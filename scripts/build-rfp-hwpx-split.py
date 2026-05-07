#!/usr/bin/env python3
from __future__ import annotations
import re
import subprocess
import importlib.util
from pathlib import Path

_spec = importlib.util.spec_from_file_location(
    "_build_rfp_hwpx", Path(__file__).resolve().parent / "build-rfp-hwpx.py"
)
_mod = importlib.util.module_from_spec(_spec)  # type: ignore[arg-type]
_spec.loader.exec_module(_mod)  # type: ignore[union-attr]
preprocess_for_hwpx = _mod.preprocess_for_hwpx

ROOT = Path(__file__).resolve().parents[1]
RFP_ROOT = ROOT / "src/content/docs/goodthinking-isp/08-rfp"
DIST = ROOT / "dist-hwpx" / "split"
DIST.mkdir(parents=True, exist_ok=True)

CHAPTERS = [
    ("00-cover", [RFP_ROOT / "index.md"]),
    ("01-overview", [RFP_ROOT / "01-overview/index.md"]),
    ("02-current-status", [RFP_ROOT / "02-current-status/index.md"]),
    ("03-strategy", [RFP_ROOT / "03-strategy/index.md"]),
    ("04-1-proposal-intro", [RFP_ROOT / "04-proposal-request/index.md"]),
    ("04-2-str", [RFP_ROOT / "04-proposal-request/str-system-build.md"]),
    ("04-3-sre", [RFP_ROOT / "04-proposal-request/sre-functional.md"]),
    ("04-4-ser", [RFP_ROOT / "04-proposal-request/ser-security.md"]),
    ("04-5-dar", [RFP_ROOT / "04-proposal-request/dar-data.md"]),
    ("04-6-ter", [RFP_ROOT / "04-proposal-request/ter-test-ops.md"]),
    ("04-7-edr", [RFP_ROOT / "04-proposal-request/edr-education.md"]),
    ("04-8-cor", [RFP_ROOT / "04-proposal-request/cor-constraints.md"]),
    ("05-guideline", [RFP_ROOT / "05-proposal-guideline/index.md"]),
    ("06-evaluation", [RFP_ROOT / "06-evaluation/index.md"]),
    ("07-appendix", [
        RFP_ROOT / "appendix/index.md",
        RFP_ROOT / "appendix/01-personal-info-consignment.md",
        RFP_ROOT / "appendix/02-security-penalty.md",
        RFP_ROOT / "appendix/03-security-violation.md",
        RFP_ROOT / "appendix/04-confidentiality.md",
    ]),
    ("08-forms", [RFP_ROOT / "forms/index.md"]),
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


def main() -> None:
    for name, paths in CHAPTERS:
        md_out = DIST / f"{name}.md"
        hwpx_out = DIST / f"{name}.hwpx"
        parts = []
        for p in paths:
            if not p.exists():
                continue
            parts.append(transform(p))
        if not parts:
            continue
        md_out.write_text(preprocess_for_hwpx("\n---\n\n".join(parts)), encoding="utf-8")
        try:
            subprocess.run(
                ["pypandoc-hwpx", str(md_out), "-o", str(hwpx_out)],
                check=True,
                capture_output=True,
            )
            size = hwpx_out.stat().st_size
            print(f"  OK  {name}.hwpx  ({size:>9,} bytes)")
        except subprocess.CalledProcessError as e:
            print(f"  FAIL {name}: {e.stderr.decode()[:200]}")


if __name__ == "__main__":
    main()
