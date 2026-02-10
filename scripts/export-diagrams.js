#!/usr/bin/env node
/**
 * Mermaid 다이어그램을 SVG 이미지로 추출하는 스크립트 (프린트용)
 * 
 * 사용법: npm run export-diagrams
 * 결과물: dist/diagrams/ 폴더에 SVG 파일 생성
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const DOCS_DIR = path.join(ROOT_DIR, 'src/content/docs/nanet-platform');
const OUTPUT_DIR = path.join(ROOT_DIR, 'dist/diagrams/nanet-platform');
const TEMP_DIR = path.join(ROOT_DIR, '.mermaid-temp');

// 디렉토리 초기화
function initDirs() {
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
  
  // Mermaid 설정 파일 생성
  const mermaidConfig = {
    theme: 'base',
    themeVariables: {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif'
    }
  };
  
  fs.writeFileSync(
    path.join(TEMP_DIR, 'config.json'),
    JSON.stringify(mermaidConfig, null, 2)
  );
}

// 모든 md 파일 찾기
function findMdFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory() && item.name !== 'reference') {
      files.push(...findMdFiles(fullPath));
    } else if (item.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

// Mermaid 코드블록 추출
function extractMermaidBlocks(content) {
  const blocks = [];
  const regex = /```mermaid\n([\s\S]*?)```/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    blocks.push({
      code: match[1].trim()
    });
  }
  return blocks;
}

// 파일명에서 안전한 이름 생성
function sanitizeFileName(filePath, index) {
  const relativePath = path.relative(DOCS_DIR, filePath);
  const baseName = relativePath
    .replace(/\//g, '-')
    .replace(/\.md$/, '')
    .replace(/[^a-zA-Z0-9-]/g, '_');
  return `${baseName}-diagram-${String(index + 1).padStart(2, '0')}`;
}

// 메인 처리
async function main() {
  console.log('\n🎨 Mermaid 다이어그램 이미지 추출 (프린트용)\n');
  console.log('='.repeat(50));
  
  initDirs();
  
  const mdFiles = findMdFiles(DOCS_DIR);
  let totalDiagrams = 0;
  let converted = 0;
  let failed = 0;
  const results = [];

  for (const mdFile of mdFiles) {
    const content = fs.readFileSync(mdFile, 'utf-8');
    const blocks = extractMermaidBlocks(content);
    
    if (blocks.length === 0) continue;
    
    const relPath = path.relative(DOCS_DIR, mdFile);
    console.log(`\n📄 ${relPath}`);
    
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const diagramName = sanitizeFileName(mdFile, i);
      const mmdFile = path.join(TEMP_DIR, `${diagramName}.mmd`);
      const svgFile = path.join(OUTPUT_DIR, `${diagramName}.svg`);
      
      totalDiagrams++;
      
      try {
        // Mermaid 파일 저장
        fs.writeFileSync(mmdFile, block.code);
        
        // SVG로 변환
        execSync(
          `npx mmdc -i "${mmdFile}" -o "${svgFile}" -c "${path.join(TEMP_DIR, 'config.json')}" -b white -w 1200`,
          { stdio: 'pipe', timeout: 30000 }
        );
        
        console.log(`   ✅ ${diagramName}.svg`);
        results.push({ file: relPath, diagram: diagramName, status: 'success' });
        converted++;
      } catch (error) {
        console.log(`   ❌ ${diagramName} - 변환 실패`);
        results.push({ file: relPath, diagram: diagramName, status: 'failed', error: error.message });
        failed++;
      }
    }
  }

  // 임시 디렉토리 정리
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });

  // 결과 요약
  console.log(`\n${'='.repeat(50)}`);
  console.log('📊 변환 결과');
  console.log('='.repeat(50));
  console.log(`   총 다이어그램: ${totalDiagrams}개`);
  console.log(`   성공: ${converted}개`);
  console.log(`   실패: ${failed}개`);
  console.log('='.repeat(50));
  
  if (converted > 0) {
    console.log(`\n📁 출력 폴더: ${path.relative(ROOT_DIR, OUTPUT_DIR)}/`);
    console.log('\n💡 프린트 시 이 폴더의 SVG 파일들을 사용하세요.\n');
  }
  
  // 인덱스 파일 생성
  const indexContent = `# 다이어그램 목록

생성일시: ${new Date().toLocaleString('ko-KR')}

| 문서 | 다이어그램 | 상태 |
|------|-----------|------|
${results.map(r => `| ${r.file} | ${r.diagram}.svg | ${r.status === 'success' ? '✅' : '❌'} |`).join('\n')}
`;
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'README.md'), indexContent);
}

main().catch(console.error);
