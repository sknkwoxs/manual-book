#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const DOCS_DIR = path.join(ROOT_DIR, 'src/content/docs/goodthinking-isp');
const OUTPUT_BASE = path.join(ROOT_DIR, 'public/diagrams/goodthinking-isp');
const URL_BASE = '/diagrams/goodthinking-isp';
const TEMP_DIR = path.join(ROOT_DIR, '.mermaid-temp');

const EXCLUDE_PATTERNS = [
  '00-clinet_document/',
  'appendix/backlog.md',
];

function initDirs() {
  if (fs.existsSync(OUTPUT_BASE)) {
    fs.rmSync(OUTPUT_BASE, { recursive: true });
  }
  fs.mkdirSync(OUTPUT_BASE, { recursive: true });

  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  const mermaidConfig = {
    theme: 'base',
    themeVariables: {
      fontSize: '14px',
      fontFamily: '"Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
    },
    flowchart: { htmlLabels: true, curve: 'basis' },
  };
  fs.writeFileSync(path.join(TEMP_DIR, 'config.json'), JSON.stringify(mermaidConfig, null, 2));

  const puppeteerConfig = {
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
  };
  fs.writeFileSync(path.join(TEMP_DIR, 'puppeteer.json'), JSON.stringify(puppeteerConfig, null, 2));
}

function findMdFiles(dir) {
  const files = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) files.push(...findMdFiles(fullPath));
    else if (item.name.endsWith('.md') || item.name.endsWith('.mdx')) files.push(fullPath);
  }
  return files;
}

function isExcluded(absPath) {
  const rel = path.relative(DOCS_DIR, absPath).split(path.sep).join('/');
  return EXCLUDE_PATTERNS.some((p) => rel === p || rel.startsWith(p));
}

function extractMermaidBlocks(content) {
  const lines = content.split('\n');
  const blocks = [];
  let inBlock = false;
  let blockStart = -1;
  let codeLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!inBlock && line.trim() === '```mermaid') {
      inBlock = true;
      blockStart = i + 1;
      codeLines = [];
    } else if (inBlock && line.trim() === '```') {
      blocks.push({ startLine: blockStart, endLine: i + 1, code: codeLines.join('\n').trim() });
      inBlock = false;
    } else if (inBlock) {
      codeLines.push(line);
    }
  }
  return blocks;
}

function extractAltText(content, blockStartLine) {
  const lines = content.split('\n');
  for (let i = blockStartLine - 2; i >= Math.max(0, blockStartLine - 30); i--) {
    const headingMatch = lines[i].match(/^#{1,6}\s+(.+?)(?:\s*\{.*\})?$/);
    if (headingMatch) return headingMatch[1].trim().replace(/[`*_]/g, '');
  }
  return 'diagram';
}

async function main() {
  console.log('\n🎨 goodthinking-isp Mermaid → SVG 일괄 변환\n' + '='.repeat(60));
  initDirs();

  const mdFiles = findMdFiles(DOCS_DIR).filter((f) => !isExcluded(f));
  console.log(`📂 대상 파일: ${mdFiles.length}개\n`);

  let totalDiagrams = 0, converted = 0, failed = 0;
  const results = [], failures = [];

  for (const mdFile of mdFiles) {
    let content = fs.readFileSync(mdFile, 'utf-8');
    const blocks = extractMermaidBlocks(content);
    if (blocks.length === 0) continue;

    const relMdPath = path.relative(DOCS_DIR, mdFile);
    const docDir = path.dirname(relMdPath);
    const docStem = path.basename(relMdPath, path.extname(relMdPath));
    const outDir = path.join(OUTPUT_BASE, docDir);
    fs.mkdirSync(outDir, { recursive: true });

    console.log(`📄 ${relMdPath} (${blocks.length}개)`);

    for (let i = blocks.length - 1; i >= 0; i--) {
      const block = blocks[i];
      const fileName = `${docStem}-L${block.startLine}.svg`;
      const mmdFile = path.join(TEMP_DIR, fileName.replace('.svg', '.mmd'));
      const svgFile = path.join(outDir, fileName);
      const urlPath = `${URL_BASE}/${docDir ? docDir + '/' : ''}${fileName}`;
      const altText = extractAltText(content, block.startLine);
      totalDiagrams++;

      try {
        fs.writeFileSync(mmdFile, block.code);
        execSync(
          `npx mmdc -i "${mmdFile}" -o "${svgFile}" -c "${path.join(TEMP_DIR, 'config.json')}" -p "${path.join(TEMP_DIR, 'puppeteer.json')}" -b white`,
          { stdio: 'pipe', timeout: 60000 }
        );
        console.log(`   ✅ ${fileName}`);
        results.push({ file: relMdPath, diagram: fileName, status: 'success' });
        converted++;

        const linesArr = content.split('\n');
        const before = linesArr.slice(0, block.startLine - 1).join('\n');
        const after = linesArr.slice(block.endLine).join('\n');
        const replacement = `![${altText}](${urlPath})`;
        content = (before ? before + '\n' : '') + replacement + (after ? '\n' + after : '');
      } catch (error) {
        const errMsg = error.stderr ? error.stderr.toString() : error.message;
        console.log(`   ❌ ${fileName} - 실패`);
        console.log(`      ${errMsg.split('\n').slice(0, 3).join(' | ').slice(0, 200)}`);
        results.push({ file: relMdPath, diagram: fileName, status: 'failed' });
        failures.push({ file: relMdPath, diagram: fileName, error: errMsg.slice(0, 500) });
        failed++;
      }
    }

    fs.writeFileSync(mdFile, content);
  }

  fs.rmSync(TEMP_DIR, { recursive: true, force: true });

  console.log(`\n${'='.repeat(60)}\n📊 변환 결과\n${'='.repeat(60)}`);
  console.log(`   대상: ${totalDiagrams}개 / 성공: ${converted}개 / 실패: ${failed}개`);
  console.log(`   출력: ${path.relative(ROOT_DIR, OUTPUT_BASE)}/`);

  if (failures.length > 0) {
    console.log('\n❌ 실패 내역:');
    failures.forEach((f) => console.log(`   - ${f.file} :: ${f.diagram}`));
  }

  const indexContent = `# goodthinking-isp 다이어그램 인덱스

생성: ${new Date().toLocaleString('ko-KR')}
총 ${totalDiagrams}개 (성공 ${converted} / 실패 ${failed})

| 문서 | 파일 | 상태 |
|------|------|------|
${results.map((r) => `| ${r.file} | ${r.diagram} | ${r.status === 'success' ? '✅' : '❌'} |`).join('\n')}
`;
  fs.writeFileSync(path.join(OUTPUT_BASE, 'README.md'), indexContent);
}

main().catch((e) => { console.error(e); process.exit(1); });
