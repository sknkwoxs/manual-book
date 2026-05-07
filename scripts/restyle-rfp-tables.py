#!/usr/bin/env python3
from __future__ import annotations
import re
import shutil
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "dist-hwpx" / "SKNK_제안요청서(안)_좋은생각 CS 시스템 웹 전환 및 데이터 통합 구축 사업_260507 .docx"
DST = ROOT / "dist-hwpx" / "SKNK_제안요청서(안)_좋은생각 CS 시스템 웹 전환 및 데이터 통합 구축 사업_260507_restyled.docx"

W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
W = f"{{{W_NS}}}"
ET.register_namespace("w", W_NS)
NS = {"w": W_NS}

DOMAIN_PREFIXES = ("SRE-", "SER-", "DAR-", "TER-", "EDR-", "COR-")


def text_of(el: ET.Element) -> str:
    return "".join(t.text or "" for t in el.iter(W + "t"))


def make_border() -> ET.Element:
    borders = ET.Element(W + "tcBorders")
    for side in ("top", "left", "bottom", "right"):
        b = ET.SubElement(borders, W + side)
        b.set(W + "color", "000000")
        b.set(W + "space", "0")
        b.set(W + "sz", "8")
        b.set(W + "val", "single")
    return borders


def set_tc_style(tc: ET.Element, shade: str | None) -> None:
    """Replace tcPr children (borders + shading + valign) preserving gridSpan/vMerge."""
    tcpr = tc.find("w:tcPr", NS)
    if tcpr is None:
        tcpr = ET.SubElement(tc, W + "tcPr")
        tc.remove(tcpr)
        tc.insert(0, tcpr)
    # Preserve grid/merge children, drop styling we will rewrite
    keep_tags = {W + "gridSpan", W + "vMerge", W + "tcW"}
    preserved = [c for c in list(tcpr) if c.tag in keep_tags]
    tcpr.clear()
    tcpr.extend(preserved)
    tcpr.append(make_border())
    if shade:
        shd = ET.SubElement(tcpr, W + "shd")
        shd.set(W + "fill", shade)
        shd.set(W + "val", "clear")
    valign = ET.SubElement(tcpr, W + "vAlign")
    valign.set(W + "val", "center")


def restyle_table(tbl: ET.Element) -> None:
    """Apply STR-style formatting: header d9d9d9, label column efefef, data uncolored."""
    tblpr = tbl.find("w:tblPr", NS)
    if tblpr is not None:
        # Adopt STR table style key + width settings.
        for child in list(tblpr):
            tblpr.remove(child)
        for tag, attrs in [
            ("tblStyle", {"val": "Table21"}),
            ("tblW", {"w": "9570.0", "type": "dxa"}),
            ("jc", {"val": "left"}),
            ("tblInd", {"w": "-108.0", "type": "dxa"}),
            ("tblLayout", {"type": "fixed"}),
            ("tblLook", {"val": "0020"}),
        ]:
            el = ET.SubElement(tblpr, W + tag)
            for k, v in attrs.items():
                el.set(W + k, v)

    grid = tbl.find("w:tblGrid", NS)
    if grid is not None:
        for child in list(grid):
            grid.remove(child)
        for w_val in ("2145", "7425"):
            gc = ET.SubElement(grid, W + "gridCol")
            gc.set(W + "w", w_val)

    rows = tbl.findall("w:tr", NS)
    for ri, tr in enumerate(rows):
        cells = tr.findall("w:tc", NS)
        for ci, tc in enumerate(cells):
            if ri == 0:
                shade = "d9d9d9"
            elif ci == 0:
                shade = "efefef"
            else:
                shade = None
            set_tc_style(tc, shade)


def is_target_table(tbl: ET.Element) -> bool:
    rows = tbl.findall("w:tr", NS)
    if len(rows) != 6:
        return False
    first_cell = rows[0].find("w:tc", NS)
    if first_cell is None:
        return False
    return text_of(first_cell).strip() == "항목"


def process(document_xml: bytes) -> bytes:
    root = ET.fromstring(document_xml)
    body = root.find("w:body", NS)
    elements = list(body)

    in_section_43 = False
    section_count = 0
    current_id_kind: str | None = None
    changed = 0

    for el in elements:
        tag = el.tag.split("}")[-1]
        if tag == "p":
            t = text_of(el).strip()
            if "4.3 상세 요구 사항" in t:
                section_count += 1
                if section_count >= 2:
                    in_section_43 = True
            if in_section_43:
                m = re.match(r"^(STR|SRE|SER|DAR|TER|EDR|COR)-\d+", t)
                if m:
                    current_id_kind = m.group(1)
        elif tag == "tbl" and in_section_43 and current_id_kind in {p[:3] for p in DOMAIN_PREFIXES}:
            if is_target_table(el):
                restyle_table(el)
                changed += 1
                current_id_kind = None  # consume

    print(f"  변경된 표: {changed}개")
    return ET.tostring(root, xml_declaration=True, encoding="UTF-8")


def main() -> None:
    shutil.copy(SRC, DST)
    print(f"백업본 생성: {DST.name}")

    with zipfile.ZipFile(DST, "r") as zf:
        names = zf.namelist()
        contents = {n: zf.read(n) for n in names}

    contents["word/document.xml"] = process(contents["word/document.xml"])

    DST.unlink()
    with zipfile.ZipFile(DST, "w", zipfile.ZIP_DEFLATED) as zf:
        for n in names:
            zf.writestr(n, contents[n])

    print(f"완료: {DST}")


if __name__ == "__main__":
    main()
