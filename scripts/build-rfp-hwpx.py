#!/usr/bin/env python3
from __future__ import annotations
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RFP_ROOT = ROOT / "src/content/docs/goodthinking-isp/08-rfp"
DIST = ROOT / "dist-hwpx"
DIST.mkdir(exist_ok=True)

ORDER = [
    RFP_ROOT / "index.md",
    RFP_ROOT / "01-overview/index.md",
    RFP_ROOT / "02-current-status/index.md",
    RFP_ROOT / "03-strategy/index.md",
    RFP_ROOT / "04-proposal-request/index.md",
    RFP_ROOT / "04-proposal-request/str-system-build.md",
    RFP_ROOT / "04-proposal-request/sre-functional.md",
    RFP_ROOT / "04-proposal-request/ser-security.md",
    RFP_ROOT / "04-proposal-request/dar-data.md",
    RFP_ROOT / "04-proposal-request/ter-test-ops.md",
    RFP_ROOT / "04-proposal-request/edr-education.md",
    RFP_ROOT / "04-proposal-request/cor-constraints.md",
    RFP_ROOT / "05-proposal-guideline/index.md",
    RFP_ROOT / "06-evaluation/index.md",
    RFP_ROOT / "appendix/index.md",
    RFP_ROOT / "appendix/01-personal-info-consignment.md",
    RFP_ROOT / "appendix/02-security-penalty.md",
    RFP_ROOT / "appendix/03-security-violation.md",
    RFP_ROOT / "appendix/04-confidentiality.md",
    RFP_ROOT / "forms/index.md",
]

FRONTMATTER_RE = re.compile(r"^---\n.*?\n---\n", re.DOTALL)
ASIDE_OPEN_RE = re.compile(r"^:::\s*(\w+)(?:\s*\[(.*?)\])?\s*$", re.MULTILINE)
ASIDE_CLOSE_RE = re.compile(r"^:::\s*$", re.MULTILINE)
ABSOLUTE_LINK_RE = re.compile(r"\[([^\]]+)\]\(/[^)]+\)")
IMG_RE = re.compile(r"!\[([^\]]*)\]\(([^)]+)\)")


def extract_title(md: str) -> str | None:
    m = re.search(r"^title:\s*(.+)$", md, re.MULTILINE)
    return m.group(1).strip().strip('"').strip("'") if m else None


def transform(md_path: Path) -> str:
    raw = md_path.read_text(encoding="utf-8")
    title = extract_title(raw) or md_path.stem

    body = FRONTMATTER_RE.sub("", raw, count=1)

    def aside_open(m: re.Match) -> str:
        label = m.group(2) or m.group(1).upper()
        return f"\n> **[{label}]**\n>"

    body = ASIDE_OPEN_RE.sub(aside_open, body)
    body = ASIDE_CLOSE_RE.sub("", body)
    body = ABSOLUTE_LINK_RE.sub(r"\1", body)

    def img_to_abs(m: re.Match) -> str:
        alt, src = m.group(1), m.group(2)
        if src.startswith("http"):
            return m.group(0)
        if src.startswith("/"):
            return f"![{alt}]({ROOT / 'public' / src.lstrip('/')})"
        return f"![{alt}]({(md_path.parent / src).resolve()})"

    body = IMG_RE.sub(img_to_abs, body)

    if not body.lstrip().startswith("# "):
        body = f"# {title}\n\n{body.lstrip()}"
    return body.strip() + "\n\n"


def preprocess_for_hwpx(content: str) -> str:
    """pypandoc-hwpx 0.1.1 알려진 크래시/렌더링 이슈 회피 전처리.

    참고: https://github.com/msjang/pypandoc-hwpx/issues/1
    - 빈 표 셀 → 한글 12.x 크래시 (CHncMArrayBase::_GetPtr)
    - ASCII 따옴표 안 텍스트 소실
    - SMP 이모지 → 한글 XML 파서 실패
    """
    # 표 라인 안의 빈 셀(`| |`)에 점 삽입. 표 라인만 대상으로 다중 패스.
    def fix_empty_cells(line: str) -> str:
        if not line.lstrip().startswith("|"):
            return line
        prev = None
        cur = line
        # `| |` 패턴이 겹치므로 반복 치환
        while prev != cur:
            prev = cur
            cur = re.sub(r"\|(\s*)\|", r"| . |", cur)
        return cur

    content = "\n".join(fix_empty_cells(ln) for ln in content.split("\n"))

    # ASCII → 유니코드 스마트 따옴표 (단순 균등 치환)
    content = content.replace('"', "\u201c").replace("'", "\u2018")

    # SMP(보조 다국어 평면) 이모지 제거
    content = re.sub(r"[\U00010000-\U0010FFFF]", "", content)

    return content


def main() -> None:
    merged_md = DIST / "08-rfp-merged.md"
    out_hwpx = DIST / "08-rfp-제안요청서.hwpx"

    parts = []
    for p in ORDER:
        if not p.exists():
            print(f"  SKIP (없음): {p.relative_to(ROOT)}")
            continue
        print(f"  + {p.relative_to(ROOT)}")
        parts.append(transform(p))

    merged = "\n---\n\n".join(parts)
    merged = preprocess_for_hwpx(merged)
    merged_md.write_text(merged, encoding="utf-8")
    print(f"\n병합 완료: {merged_md} ({merged_md.stat().st_size:,} bytes)")

    print("\nHWPX 변환 중...")
    subprocess.run(["pypandoc-hwpx", str(merged_md), "-o", str(out_hwpx)], check=True)
    print(f"\n완료: {out_hwpx} ({out_hwpx.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
