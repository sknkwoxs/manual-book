#!/usr/bin/env python3
import base64
import re
import subprocess
from pathlib import Path

BASE = Path(__file__).parent
ROOT = Path(__file__).resolve().parents[5]
MD = ROOT / "marp-slides" / "google-slides-cs-system-presentation-detailed.marp.md"
HTML = BASE / "google-slides-cs-system-presentation-detailed.html"
PDF  = BASE / "google-slides-cs-system-presentation-detailed.pdf"
PPTX = BASE / "google-slides-cs-system-presentation-detailed.pptx"

MARP = ["npx", "marp", str(MD), "--allow-local-files"]

def build_html():
    print("→ HTML 빌드 중...")
    subprocess.run(MARP + ["--html", "--output", str(HTML)], check=True)

    content = HTML.read_text(encoding="utf-8")

    content = rebuild_cover_layout(content)
    content = rebuild_slide12_layout(content)

    content = re.sub(
        r'(<section[^>]*data-class="lead"[^>]*style="[^"]*section\s*\{[^}]*)justify-content:flex-start',
        r'\1justify-content:center',
        content, flags=re.DOTALL
    )

    LEAD_JC = "div#\\:\\$p > svg > foreignObject > section.lead{justify-content:center!important;}"
    FLEX_START = 'justify-content:flex-start;overflow:hidden}'
    if LEAD_JC not in content and FLEX_START in content:
        content = content.replace(FLEX_START, FLEX_START + LEAD_JC)

    content = re.sub(
        r'<div class="bespoke-marp-osc">.*?</div>\s*(?=<)',
        '', content, flags=re.DOTALL
    )

    if 'osc-hide' not in content:
        content = content.replace(
            '</head>',
            '<style id="osc-hide">.bespoke-marp-osc{display:none!important;}</style>\n</head>'
        )

    BRAND_HIDE = "div#\\:\\$p > svg > foreignObject > section.brand-panel::after{content:'' !important;width:0!important;height:0!important;}"
    TARGET = 'div#\\:\\$p > svg > foreignObject > section::after{'
    if BRAND_HIDE not in content and TARGET in content:
        content = content.replace(TARGET, BRAND_HIDE + TARGET)

    if 'progress-bar-inject' not in content:
        js = """
<script id="progress-bar-inject">
(function() {
  function updateProgress() {
    var sections = document.querySelectorAll('section[data-marpit-pagination]');
    sections.forEach(function(section) {
      var current = parseInt(section.getAttribute('data-marpit-pagination'), 10);
      var total = parseInt(section.getAttribute('data-marpit-pagination-total'), 10);
      if (total > 0) {
        section.style.setProperty('--progress', (current / total * 100).toFixed(2) + '%');
      }
    });
  }
  // Fix cover slide vertical centering: override Marp's flex-start after Bespoke initializes
  function fixLeadJustify() {
    var lead = document.querySelector('section[data-class="lead"]');
    if (lead) {
      lead.style.setProperty('justify-content', 'center', 'important');
    }
  }
  function init() {
    updateProgress();
    // Bespoke may inject styles asynchronously; retry until cover is centered
    fixLeadJustify();
    setTimeout(fixLeadJustify, 100);
    setTimeout(fixLeadJustify, 500);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>
"""
        content = content.replace('</body>', js + '</body>')

    HTML.write_text(content, encoding="utf-8")
    print("  ✓ HTML 후처리 완료")

def rebuild_slide12_layout(content: str) -> str:

    SLIDE12_NEW = """<div class="twocol" style="align-items:start;margin-top:0;">
<div>
<h3 id="reason">이유</h3>
<ul>
<li>CS 시스템과 어드민&amp;CMS는 시스템의 목적과 업무 흐름이 다름
<ul>
<li>CS 시스템: 좋은생각의 정기구독자 관리</li>
<li>어드민&amp;CMS: 좋은생각의 원고 관리 (이 두 시스템은 향후 통합하는 것을 제안)</li>
</ul>
</li>
</ul>
<h3 id="%EC%A3%BC%EC%9A%94-%EA%B0%9C%EC%84%A0-%EB%B0%A9%ED%96%A5">CS 시스템 주요 개선 방향</h3>
<ul>
<li>통합 회원 조회 및 중복 식별 기능</li>
<li>상담/구독/결제/발송 이력 통합 화면</li>
<li>자주 쓰는 기능의 전면 배치</li>
<li>일괄 처리 기능 강화</li>
<li>권한 세분화</li>
<li>검색 정확도 개선</li>
<li>예외 건 관리 기능 보강</li>
</ul>
</div>
<div class="diagram-wrap" style="padding:20px;">
<img src="./diagrams/goodthinking-phased-strategy.svg" alt="diagram" style="display:block;max-width:100%;max-height:360px;margin:0 auto;object-fit:contain;" />
<div class="diagram-caption">1단계와 2단계의 역할 분리 및 추진 방향</div>
</div>
</div>"""

    pattern = re.compile(
        r'(<section[^>]*data-marpit-pagination="12"[^>]*>.*?<blockquote>.*?</blockquote>\s*)'
        r'(.*?)'
        r'(</section>)',
        re.DOTALL
    )

    def replace_slide12(m):
        return m.group(1) + '\n' + SLIDE12_NEW + '\n' + m.group(3)

    new_content = pattern.sub(replace_slide12, content, count=1)
    if new_content == content:
        print("  ⚠ slide12 layout: pattern not matched, skipping")
    return new_content


def get_logo_data_uri() -> str:
    logo_path = ROOT / "public" / "skunkworks-logo.png"
    data = base64.b64encode(logo_path.read_bytes()).decode("ascii")
    return f"data:image/png;base64,{data}"


def rebuild_cover_layout(content: str) -> str:
    logo_src = get_logo_data_uri()

    COVER_NEW = f"""<div class="cover-project">좋은생각 CS 시스템 웹 전환 ISP</div>
<div class="cover-layout">
  <div class="cover-left">
    <img src="{logo_src}" alt="Skunkworks Studio" class="cover-logo" />
    <div class="kicker">GOODTHINKING ISP / CS SYSTEM WEB TRANSFORMATION</div>
    <div class="cover-h1">좋은생각 CS 시스템<br>웹 전환 ISP</div>
    <div class="cover-sub">현행 시스템 분석 및 CS 중심 목표 모델 제안</div>
  </div>
  <div class="cover-right">
    <div class="cover-tagline">좋은생각의 디지털 전환은<br>"모든 시스템의 동시 통합"이 아니라,<br><strong>운영 병목이 가장 큰 CS 시스템부터<br>우선 개선하는 전략</strong>에서 시작해야 합니다.</div>
    <div class="cover-rule-h"></div>
    <div class="cover-meta">수행 · 스컹크웍스스튜디오<br>기간 · 2026.03 ~ 2026.05<br>대상 · 좋은생각사람들</div>
  </div>
</div>"""

    def replace_lead_inner(m):
        return m.group(1) + '\n' + COVER_NEW + '\n' + m.group(3)

    pattern = re.compile(
        r'(<section[^>]*\bdata-class="lead"[^>]*>)(.*?)(</section>)',
        re.DOTALL
    )
    return pattern.sub(replace_lead_inner, content, count=1)

def build_pdf():
    print("→ PDF 빌드 중...")
    subprocess.run(MARP + ["--pdf", "--output", str(PDF)], check=True)
    print("  ✓ PDF 완료")

def build_pptx():
    print("→ PPTX 빌드 중...")
    subprocess.run(MARP + ["--pptx", "--output", str(PPTX)], check=True)
    print("  ✓ PPTX 완료")

if __name__ == "__main__":
    import concurrent.futures
    build_html()
    with concurrent.futures.ThreadPoolExecutor() as executor:
        executor.submit(build_pdf)
        executor.submit(build_pptx)
    print("\n✅ 전체 빌드 완료")
    print(f"  HTML: {HTML}")
    print(f"  PDF:  {PDF}")
    print(f"  PPTX: {PPTX}")
