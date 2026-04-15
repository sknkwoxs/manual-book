---
marp: true
theme: default
paginate: true
size: 16:9
style: |
  :root {
    --bg: #ffffff;
    --fg: #111111;
    --muted: #6b7280;
    --line: #d9dde3;
    --soft: #f3f4f6;
    --accent: #000000;
    --accent-soft: #f3f4f6;
    --warn: #d95c5c;
    --radius: 10px;
    --title-bar-height: 90px;
  }

  section {
    font-family: 'Noto Sans KR', 'Pretendard', sans-serif;
    color: var(--fg);
    background: var(--bg);
    padding: 0 56px 52px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: hidden;
  }

  section::before {
    content: none;
  }

  /* 헤더 상단 프로그레스 바 — JS가 --progress 를 각 섹션에 주입 */
  section:not(.lead):not(.brand-panel)::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 3px;
    width: var(--progress, 0%);
    background: rgba(255,255,255,0.72);
    z-index: 10;
    pointer-events: none;
  }

  section.lead {
    background: #000000;
    color: #ffffff;
    padding: 0;
    position: relative;
    justify-content: center !important;
  }

  section.lead::before {
    content: '';
    position: absolute;
    top: 0;
    right: 56px;
    width: 180px;
    height: 10px;
    background: linear-gradient(90deg, rgba(255,255,255,0.92) 0 62%, rgba(255,255,255,0.18) 62% 100%);
  }

  section.lead h1,
  section.lead h2,
  section.lead h3,
  section.lead strong,
  section.lead blockquote,
  section.lead p,
  section.lead li {
    color: #ffffff;
  }

  h1 {
    color: var(--fg);
    font-size: 28px;
    margin: 0;
    padding: 0 0 14px 0;
    letter-spacing: -0.02em;
    font-weight: 700;
    border-bottom: 2px solid #d8dde3;
    line-height: 1.25;
  }

  section:not(.lead) h1 {
    position: relative;
    margin: 0 -56px 24px;
    padding: 20px 300px 18px 56px;
    width: calc(100% + 112px);
    box-sizing: border-box;
    min-height: var(--title-bar-height);
    background: #000000;
    color: #ffffff;
    border-bottom: 0;
    display: flex;
    align-items: flex-end;
    line-height: 1.25;
    word-break: keep-all;
  }

  section:not(.lead) h1::before {
    content: none;
  }

  section:not(.lead) h1::after {
    content: '좋은생각 CS 시스템 웹 전환 ISP';
    position: absolute;
    top: 16px;
    right: 52px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: rgba(255,255,255,0.78);
    white-space: nowrap;
  }

  section.lead h1 {
    border-bottom: 0;
    padding: 0;
  }

  h2 {
    color: #2b2f36;
    font-size: 20px;
    margin: 10px 0 10px;
    font-weight: 700;
  }

  h3 {
    color: var(--fg);
    font-size: 17px;
    margin: 24px 0 8px;
    font-weight: 700;
  }

  h4 {
    color: #2f3945;
    font-size: 15px;
    margin: 8px 0 6px;
    font-weight: 700;
    line-height: 1.4;
  }

  p, li {
    font-size: 16px;
    line-height: 1.55;
  }

  section:not(.lead) p,
  section:not(.lead) ul,
  section:not(.lead) ol {
    max-width: 72ch;
  }

  /* twocol 내부는 max-width 제한 해제 + 폰트/간격 축소로 더 많은 콘텐츠 수용 */
  section:not(.lead) .twocol > div p,
  section:not(.lead) .twocol > div ul,
  section:not(.lead) .twocol > div ol {
    max-width: none;
  }

  .twocol h4 {
    font-size: 14px;
    margin: 10px 0 4px;
  }

  .twocol li {
    font-size: 14px;
    line-height: 1.5;
  }

  .twocol ul, .twocol ol {
    margin: 3px 0 8px;
  }

  p {
    margin: 0 0 12px;
  }

  ul, ol {
    margin: 6px 0 12px;
    padding-left: 1.2em;
  }

  h1 + * {
    margin-top: 20px;
  }

  h1 + .twocol,
  h1 + table,
  h1 + blockquote,
  h1 + p,
  h1 + ul,
  h1 + ol,
  h1 + div {
    margin-top: 20px;
  }

  h2 + p,
  h2 + ul,
  h2 + ol,
  h3 + p,
  h3 + ul,
  h3 + ol,
  h4 + p,
  h4 + ul,
  h4 + ol {
    margin-top: 8px;
  }

  strong {
    color: inherit;
  }

  blockquote {
    border-left: 4px solid #000000;
    background: #fafbfc;
    padding: 11px 14px;
    color: var(--fg);
    margin: 0 0 20px;
    border-radius: 0 8px 8px 0;
  }

  table {
    font-size: 14px;
    border-collapse: collapse;
    width: 100%;
    margin: 0 0 16px;
    border: 1px solid #000000;
  }

  th {
    background: #000000;
    color: #ffffff;
    border-right: 1px solid rgba(255,255,255,0.15);
    text-align: left;
    padding: 10px 14px;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.01em;
  }

  th:last-child {
    border-right: 0;
  }

  td {
    border-bottom: 1px solid #e8ebef;
    border-right: 1px solid #e8ebef;
    padding: 10px 14px;
    vertical-align: top;
    font-size: 14px;
  }

  td:last-child {
    border-right: 0;
  }

  tr:last-child td {
    border-bottom: 0;
  }

  tr:nth-child(even) td {
    background: #f8f9fb;
  }

  img.diagram {
    display: block;
    margin: 0 auto;
    max-width: 100%;
    max-height: 340px;
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 10px;
    box-shadow: none;
    padding: 12px;
  }

  .lead-text {
    font-size: 22px;
    line-height: 1.4;
    font-weight: 700;
    margin-top: 18px;
  }

  .small {
    font-size: 13px;
    color: var(--muted);
  }

  .kicker {
    display: inline-block;
    padding: 0;
    border-radius: 0;
    background: transparent;
    border: 0;
    font-size: 13px;
    margin-bottom: 14px;
    letter-spacing: 0.03em;
    color: rgba(255,255,255,0.7);
  }

  .chip {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 999px;
    background: #f5f7fa;
    color: #2f3945;
    font-size: 12px;
    font-weight: 700;
    margin-right: 6px;
    border: 1px solid #e2e8f0;
  }

  .req-chips {
    margin-top: 14px;
    line-height: 2.2;
  }

  .warn {
    color: var(--warn);
    font-weight: 700;
  }

  .twocol {
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    gap: 26px;
    align-items: start;
    margin-top: 0;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 18px;
    align-items: stretch;
  }

  .card {
    background: #ffffff;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 18px 18px 16px;
    box-shadow: none;
    min-height: 156px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 12px;
    position: relative;
    overflow: hidden;
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: #000000;
  }

  .card strong {
    display: block;
    font-size: 15px;
    line-height: 1.35;
    font-weight: 700;
    color: #111111;
    margin: 0;
  }

  .card br {
    display: none;
  }

  .card {
    font-size: 14px;
    line-height: 1.6;
    color: #2f3945;
  }

  section.lead .card {
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.18);
    color: rgba(255,255,255,0.88);
  }

  section.lead .card::before {
    background: rgba(255,255,255,0.92);
  }

  section.lead .card strong {
    color: #ffffff;
  }

  .decision {
    background: #ffffff;
    border: 1px solid var(--line);
    border-left: 6px solid #000000;
    border-radius: var(--radius);
    padding: 16px 18px;
    margin-top: 14px;
  }

  .diagram-wrap {
    background: #ffffff;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 16px;
    box-shadow: none;
    max-width: 680px;
    margin-left: auto;
    margin-right: auto;
  }

  /* twocol 안의 diagram-wrap: max-width 해제, 높이 제한 */
  .twocol .diagram-wrap {
    max-width: none;
  }

  .twocol img.diagram {
    max-height: 420px;
  }

  .diagram-caption {
    margin-top: 12px;
    font-size: 11px;
    color: var(--muted);
    text-align: center;
    letter-spacing: 0.01em;
  }

  .diagram-wrap .diagram {
    border-radius: 8px;
  }

  .diagram-wrap table {
    margin: 0;
  }

  /* ── Cover layout ── */
  .cover-project {
    position: absolute;
    top: 28px;
    right: 56px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: rgba(255,255,255,0.72);
    white-space: nowrap;
  }

  .cover-layout {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    padding: 0 64px;
    box-sizing: border-box;
    gap: 0;
  }

  .cover-left {
    flex: 0 0 52%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-right: 52px;
    border-right: none;
  }

  .cover-right {
    flex: 0 0 48%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 52px;
  }

  .cover-logo {
    width: 180px;
    height: auto;
    filter: invert(1) brightness(2.4);
    margin: 0 0 28px;
  }

  .cover-h1 {
    font-size: 34px !important;
    font-weight: 800 !important;
    line-height: 1.2 !important;
    letter-spacing: -0.02em !important;
    color: #ffffff !important;
    margin: 12px 0 12px !important;
    padding: 0 !important;
    border: none !important;
  }

  .cover-sub {
    font-size: 15px !important;
    font-weight: 500 !important;
    color: rgba(255,255,255,0.72) !important;
    margin: 0 !important;
    letter-spacing: 0 !important;
  }

  .cover-tagline {
    font-size: 14px;
    line-height: 1.75;
    color: rgba(255,255,255,0.82);
    margin-bottom: 24px;
  }

  .cover-tagline strong {
    color: #ffffff !important;
    font-weight: 700;
  }

  .cover-rule-h {
    width: 40px;
    height: 2px;
    background: rgba(255,255,255,0.5);
    margin-bottom: 20px;
  }

  .cover-meta {
    font-size: 13px;
    line-height: 1.9;
    color: rgba(255,255,255,0.6);
  }

  .section-label {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--fg);
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  section.lead .section-label {
    color: rgba(255,255,255,0.72);
  }

  .body-note {
    color: var(--muted);
    font-size: 13px;
  }

  section::after {
    content: attr(data-marpit-pagination);
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    color: #9aa3ad;
  }

  section.lead::after {
    content: '';
  }

  section.brand-panel::after {
    content: '';
  }

  section[data-marpit-pagination='']::after {
    content: '';
  }

  .bespoke-marp-osc,
  [data-bespoke-marp-osc],
  .bespoke-marp-parent > .bespoke-marp-osc,
  div.bespoke-marp-osc,
  div.bespoke-marp-osc * {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
    width: 0 !important;
    height: 0 !important;
    overflow: hidden !important;
    position: absolute !important;
    clip: rect(0,0,0,0) !important;
  }

  .toc-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px 20px;
    margin-top: 10px;
  }

  .toc-item {
    display: flex;
    align-items: center;
    gap: 12px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 16px 18px;
    background: #ffffff;
  }

  .toc-num {
    width: 30px;
    height: 30px;
    border-radius: 999px;
    background: #000000;
    color: #ffffff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    flex: 0 0 auto;
  }

  .toc-text {
    font-size: 16px;
    font-weight: 600;
    line-height: 1.35;
    color: var(--fg);
  }

  .graph-panel {
    border: 1px solid var(--line);
    border-radius: var(--radius);
    overflow: hidden;
    background: #ffffff;
    margin-top: 14px;
  }

  .graph-panel-title {
    background: #000000;
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
    padding: 10px 16px;
    letter-spacing: 0.02em;
  }

  .graph-panel-body {
    padding: 16px;
  }

  .graph-note {
    margin-top: 10px;
    color: var(--muted);
    font-size: 11px;
  }

  .brand-message {
    margin: 4px 0 18px;
  }

  .brand-message-en {
    font-size: 26px;
    font-weight: 800;
    line-height: 1.2;
    color: #111111;
    letter-spacing: -0.03em;
  }

  .brand-message-ko {
    margin-top: 6px;
    font-size: 14px;
    font-weight: 600;
    color: var(--muted);
    letter-spacing: -0.01em;
  }

  .brand-slide {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100%;
    text-align: center;
  }

  .brand-slide .brand-message {
    margin: 0;
  }

  .brand-slide .brand-message-en {
    font-size: 44px;
    line-height: 1.08;
    letter-spacing: -0.04em;
    color: #ffffff;
  }

  .brand-slide .brand-message-ko {
    margin-top: 10px;
    font-size: 18px;
    color: rgba(255,255,255,0.72);
  }

  .brand-slide-note {
    margin-top: 24px;
    font-size: 13px;
    color: rgba(255,255,255,0.42);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  section.brand-panel {
    background: #000000;
    color: #ffffff;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 72px 52px;
    overflow: hidden;
  }

  section.brand-panel h1 {
    display: none;
  }

  section.brand-panel::before,
  section.brand-panel::after {
    content: '';
    position: absolute;
    pointer-events: none;
  }

  section.brand-panel::before {
    right: 56px;
    top: 44px;
    width: 170px;
    height: 10px;
    background: linear-gradient(90deg, rgba(255,255,255,0.8) 0 62%, rgba(255,255,255,0.16) 62% 100%);
  }

  section.brand-panel::after {
    left: 56px;
    bottom: 48px;
    width: 140px;
    height: 10px;
    background: linear-gradient(90deg, rgba(255,255,255,0.16) 0 38%, rgba(255,255,255,0.8) 38% 100%);
  }

  section.brand-panel .brand-slide {
    width: 100%;
    min-height: calc(100% - 52px);
  }
---

<!-- _class: lead -->
<!-- _paginate: false -->
<div class="cover-project">좋은생각 CS 시스템 웹 전환 ISP</div>
<div class="cover-layout"><div class="cover-left"><img src="../../../../../public/skunkworks-logo.png" alt="Skunkworks Studio" class="cover-logo" /><div class="kicker">GOODTHINKING ISP / CS SYSTEM WEB TRANSFORMATION</div><div class="cover-h1">좋은생각 CS 시스템<br>웹 전환 ISP</div><div class="cover-sub">현행 시스템 분석 및 CS 중심 목표 모델 제안</div></div><div class="cover-right"><div class="cover-tagline">좋은생각의 디지털 전환은<br>"모든 시스템의 동시 통합"이 아니라,<br><strong>운영 병목이 가장 큰 CS 시스템부터<br>우선 개선하는 전략</strong>에서 시작해야 합니다.</div><div class="cover-rule-h"></div><div class="cover-meta">수행 · 스컹크웍스스튜디오<br>기간 · 2026.03 ~ 2026.05<br>대상 · 좋은생각사람들</div></div></div>

---

<!-- _class: brand-panel -->

# make IT worthy.

<div class="brand-slide">
  <div class="brand-message">
    <div class="brand-message-en">make IT worthy.</div>
    <div class="brand-message-ko">IT를 가치있게.</div>
  </div>
</div>

---

# 목차

> 이번 발표는 현행 진단 → 병목 구조 파악 → 해결방안 → 이행 방향 순으로 진행됩니다.

<div class="toc-grid">
  <div class="toc-item"><span class="toc-num">1</span><span class="toc-text">프로젝트 개요</span></div>
  <div class="toc-item"><span class="toc-num">2</span><span class="toc-text">좋은생각 내 시스템 현황 분석</span></div>
  <div class="toc-item"><span class="toc-num">3</span><span class="toc-text">좋은생각 각 부서 인터뷰 진행</span></div>
  <div class="toc-item"><span class="toc-num">4</span><span class="toc-text">현행 시스템의 한계</span></div>
  <div class="toc-item"><span class="toc-num">5</span><span class="toc-text">CS 시스템 핵심 병목현상 및 해결방안</span></div>
  <div class="toc-item"><span class="toc-num">6</span><span class="toc-text">메뉴 분석</span></div>
  <div class="toc-item"><span class="toc-num">7</span><span class="toc-text">기능요건 정리</span></div>
  <div class="toc-item"><span class="toc-num">8</span><span class="toc-text">개선된 CS 시스템 UX안</span></div>
  <div class="toc-item"><span class="toc-num">9</span><span class="toc-text">향후 진행 방향</span></div>
</div>

---

# Executive Summary

> 좋은생각의 핵심 문제는 기능 부족이 아니라, **분산된 시스템과 수작업 중심 운영 구조**입니다.

<div class="cards">
  <div class="card">
    <strong>현행 문제</strong><br>
    CS, 홈페이지, CMS, 외부몰, 정산 체계가 분리되어 업무 흐름이 끊기고 있습니다.
  </div>
  <div class="card">
    <strong>현장 영향</strong><br>
    엑셀 가공, 수동 업로드, 이중 입력이 누적되며 처리 속도보다 검수·정합성 유지에 더 많은 시간을 쓰고 있습니다.
  </div>
  <div class="card">
    <strong>권고안</strong><br>
    CS 시스템을 우선 웹 전환하고, 템플릿·통합조회·권한관리를 핵심 범위로 잡는 전략이 가장 현실적입니다.
  </div>
</div>

### 오늘의 제안
1. **CS 시스템 우선 웹 전환**  
2. **템플릿·통합조회·권한관리 중심 개선**  
3. **어드민/CMS는 2단계 별도 고도화**

---

# 1. 프로젝트 개요

> 이번 ISP의 목적은 시스템 교체가 아니라, **좋은생각 운영 구조를 디지털 방식으로 재설계하기 위한 기준선**을 만드는 것입니다.

- 좋은생각은 33년 이상 축적된 구독·콘텐츠·고객 데이터를 기반으로 운영되는 출판/콘텐츠 기업입니다.
- 현재 고객 응대, 구독 관리, 주문 처리, 정산, 콘텐츠 운영 업무가 서로 다른 시스템에 분산되어 있습니다.
- 이번 ISP는 실제 구축이 가능한 **목표 모델, 기능 우선순위, 이행 계획, RFP 기준**을 정리하는 단계입니다.

### 핵심 목표
<span class="chip">웹 전환</span>
<span class="chip">데이터 통합</span>
<span class="chip">수작업 축소</span>
<span class="chip">RFP 기준 수립</span>

---

# 2. 좋은생각 내 시스템 현황 분석

> 현재는 시스템이 연결된 구조가 아니라, **사람이 시스템 사이를 연결하는 구조**입니다.

<div class="twocol">
<div>

### 현행 시스템 구성
- **CS 시스템**: 레거시 C/S 기반 고객관리 프로그램
- **홈페이지/어드민**: 웹 기반 주문 및 일부 운영 기능
- **CMS**: 콘텐츠 등록 및 관리
- **외부 채널**: 스마트스토어, 쿠팡 등 다수 채널
- **외부 솔루션**: Playauto, 나이스페이, WEHAGO, 배송 시스템

### 현황 요약
- On-Prem 시스템과 AWS 시스템이 이원화
- 시스템 간 직접 연동 부족
- 동일 고객/주문/정산 정보가 여러 곳에 분산 저장

</div>
<div>

<div class="diagram-wrap">

<img src="./diagrams/goodthinking-current-system.svg" alt="diagram" style="display:block;max-width:100%;max-height:380px;margin:0 auto;object-fit:contain;" />

<div class="diagram-caption">현행 시스템 연결 구조 / 수동 연결 지점 표시</div>

</div>

</div>
</div>

---

# 3. 좋은생각 각 부서 인터뷰 진행

> 인터뷰를 통해 확인된 공통 요구는 “더 많은 기능”보다 **덜 끊기는 업무 흐름**이었습니다.

<div class="twocol">
<div>

### 인터뷰 대상
- 정기구독팀
- 경영지원팀
- 편집팀
- 외주 콜센터
- 영업추진팀

### 공통 확인 사항
- 시스템 간 데이터가 이어지지 않아 중간 작업이 많음
- 엑셀 가공, 수동 업로드, 육안 검수 비중이 높음
- 검색, 조회, 권한, 이력 확인 기능의 불편이 반복적으로 제기됨
- 부서별 사용하는 시스템 목적이 달라 단일 통합 접근에 한계가 있음

</div>
<div>

<div class="diagram-wrap">

<img src="./diagrams/goodthinking-interview-insights.svg" alt="diagram" style="display:block;max-width:100%;max-height:380px;margin:0 auto;object-fit:contain;" />

<div class="diagram-caption">부서 인터뷰 결과가 공통 문제군으로 수렴되는 구조</div>

</div>

</div>
</div>

---

# 4. 현행 시스템의 한계

> 현재 구조는 기능 부족의 문제가 아니라, **업무 흐름을 시스템이 지원하지 못하고 있는 구조적 문제**입니다.

### 주요 한계
- **레거시 구조**: 로컬 설치형 C/S 시스템 중심으로 운영되어 접근성과 확장성이 낮음
- **데이터 분산**: 고객, 주문, 결제, 구독, 콘텐츠 데이터가 시스템별로 분리되어 있음
- **수작업 의존**: 엑셀 취합, 수동 업로드, 수동 다운로드, 육안 검수 업무가 지속 발생
- **운영 리스크**: 권한 관리 미흡, 개인정보 수동 관리, CTI 중단, 외부업체 접근 범위 불명확
- **업무 비효율**: 같은 업무를 여러 화면과 여러 시스템에서 나눠 처리하고 있음

<div class="warn">사람이 시스템 사이를 연결하고 있는 구조는 더 이상 지속 가능하지 않습니다.</div>

---

# 5. CS 시스템 핵심 병목현상 및 해결방안

> 병목은 특정 기능 하나가 아니라, **입력-조회-처리-후속관리 전체 흐름에 걸쳐 누적**되어 있습니다.

<div class="twocol">
<div>

### 핵심 병목
1. 주문 수집 후 시스템 등록까지 엑셀 수작업 발생
2. 회원정보와 이력이 분산되어 통합 조회 어려움
3. 외부 양식 대응을 위해 반복적인 엑셀 재가공 필요
4. 정산/리포트/후속 처리를 위한 별도 수기 작업 반복
5. 자주 쓰는 메뉴가 분산되어 있어 업무 흐름이 끊김

</div>
<div>

<div class="diagram-wrap">

<img src="./diagrams/goodthinking-bottlenecks.svg" alt="diagram" style="display:block;max-width:100%;max-height:380px;margin:0 auto;object-fit:contain;" />

<div class="diagram-caption">주문 수집부터 후속 처리까지 이어지는 병목 흐름</div>

</div>

</div>
</div>

---

# 5-1. 해결방안 ① 로컬 CS 시스템의 웹 전환

> CS 시스템 웹 전환은 선택 기능이 아니라, **이후 개선을 가능하게 하는 전제 조건**입니다.

<div class="twocol">
<div>

### 기대 효과
- 설치 환경 제약 해소
- 사용자 접근성 향상
- 중앙 통합 관리 및 유지보수 용이
- 권한 및 접속 이력 관리 강화
- 외부 시스템 연계를 위한 API 구조 확장 가능

### 왜 필요한가
현재 C/S 구조는 기능을 조금 보완한다고 해결되는 단계가 아닙니다. 웹 전환을 통해서만 향후 데이터 통합, 자동화, 권한 관리, 화면 재구성의 기반을 만들 수 있습니다.

</div>
<div>

<div class="diagram-wrap">

<img src="./diagrams/goodthinking-web-transition.svg" alt="diagram" style="display:block;max-width:100%;max-height:380px;margin:0 auto;object-fit:contain;" />

<div class="diagram-caption">웹 전환 이후 확보되는 운영 기반</div>

</div>

</div>
</div>

---

# 5-2. 해결방안 ② 템플릿 제작 기능 도입

> 사람마다 엑셀을 다시 맞추는 방식에서, **시스템이 필요한 서식을 만들어주는 방식**으로 전환해야 합니다.

<div class="twocol">
<div>

### 필요 배경
- 외부 플랫폼마다 요구하는 양식이 다름
- 담당자가 열 순서, 주소 분리, 항목명을 수작업으로 맞추고 있음
- 동일 데이터도 목적에 따라 여러 번 재가공되고 있음

### 도입 방향
- 회원/주문/발송/정산용 출력 템플릿 저장
- 외부 시스템 업로드용 컬럼 매핑 기능 제공
- 자주 쓰는 양식 재사용
- 업로드 오류 보정 기능 제공

</div>
<div>

<div class="diagram-wrap">

<img src="./diagrams/goodthinking-template-system.svg" alt="diagram" style="display:block;max-width:100%;max-height:380px;margin:0 auto;object-fit:contain;" />

<div class="diagram-caption">하나의 CS 데이터에서 다양한 외부 서식으로 분기</div>

</div>

</div>
</div>

---

# 5-3. 해결방안 ③ 병목 기능 개선 및 단계적 전략

> 이번 분석을 통해 **CS 시스템과 어드민&CMS를 한 번에 완전 통합하는 것은 현실적으로 어렵다**는 점이 확인되었습니다.

### 주요 개선 방향
- 통합 회원 조회 및 중복 식별 기능
- 상담/구독/결제/발송 이력 통합 화면
- 자주 쓰는 기능의 전면 배치
- 일괄 처리 기능 강화
- 권한 세분화
- 검색 정확도 개선
- 예외 건 관리 기능 보강

<div class="diagram-wrap">

<img src="./diagrams/goodthinking-phased-strategy.svg" alt="diagram" style="display:block;max-width:82%;max-height:380px;margin:0 auto;object-fit:contain;" />

<div class="diagram-caption">1단계와 2단계의 역할 분리 및 추진 방향</div>

</div>

---

# 6. 메뉴 분석

> 메뉴 수를 유지하는 것이 아니라, **업무 흐름을 살리는 메뉴 구조**가 중요합니다.

### 분석 결과 요약

| 구분 | 수량 |
|---|---:|
| 전체 메뉴 수 | 109개 |
| 존치 | 42개 |
| 통합 | 7개 |
| 폐기 후보 | 58개 |
| 미확정 | 2개 |

### 핵심 인사이트
- 전체 메뉴의 절반 이상이 실제 업무에서 거의 사용되지 않음
- 실제 적극 사용 메뉴는 제한적이며, 핵심 기능은 특정 메뉴에 집중됨
- 회원현황 등 일부 메뉴가 여러 기능을 대체 수행하고 있음
- 영업관리 탭은 권한 문제와 실제 미사용이 혼재되어 재설계 필요

---

# 7. 기능요건 정리

> 기능요건의 핵심은 "기능을 많이 넣는 것"이 아니라, **현업이 가장 자주 반복하는 업무를 끊김 없이 처리할 수 있도록 만드는 것**입니다.

<div class="twocol">
<div>

#### 1) 회원 관리
- 통합 회원 조회
- 중복 회원 식별
- 회원정보 수정 이력 확인
- 권한별 고객정보 노출 제어

#### 2) 주문/구독 관리
- 주문 및 구독 현황 통합 조회
- 상태 변경 및 이력 관리
- 일괄 등록/처리 기능
- 외부 채널 데이터 반영 지원

</div>
<div>

#### 3) 상담/이력 관리
- 상담 이력 통합 기록
- 고객 상세 화면에서 전체 이력 확인
- 처리 상태 및 후속 조치 관리

#### 4) 데이터 활용 기능
- 업로드/다운로드 템플릿
- 자주 쓰는 양식 저장
- 외부 시스템 양식 대응

<div class="req-chips">
<span class="chip">개인정보 자동 파기</span><span class="chip">권한 제어 세분화</span><span class="chip">엑셀 양식 표준화</span><span class="chip">회원 계정 통폐합</span><span class="chip">CTI 복구</span><span class="chip">유연한 주소 검색</span>
</div>

</div>
</div>

---

# 8. 개선된 CS 시스템 UX안

> 좋은 UX는 예쁜 화면이 아니라, **한 명의 고객을 처리하기 위해 여러 화면을 돌아다니지 않아도 되는 구조**입니다.

<div class="twocol">
<div>

#### 고객 360도 화면
- 기본 회원정보 · 구독 · 결제 · 발송 · 상담 이력 통합

#### 자주 쓰는 기능 우선 배치
- 회원 조회 · 구독 처리 · 발송 확인 · 상담 등록 · 템플릿 추출

#### 검색 UX 개선
- 이름, 연락처, 주소, 최근 회원번호 기준 검색
- 동일인 관련 정보 묶음 조회
- 최근 사용 데이터 우선 노출

</div>
<div>

<div class="diagram-wrap">

<img src="./diagrams/goodthinking-ux-wireframe.svg" alt="UX wireframe" style="display:block;max-width:100%;max-height:380px;margin:0 auto;object-fit:contain;" />

<div class="diagram-caption">고객 360도 화면 기반 UX 구조 예시</div>

</div>

</div>
</div>

---

# 9. 향후 진행 방향

> 좋은생각의 차세대 운영체계는 **CS 시스템 중심의 목표 모델 설계와 단계적 이행 계획**을 기반으로 추진되어야 합니다.

<div class="twocol">
<div>

#### 1단계
- CS 시스템 목표 모델 확정
- 핵심 기능 우선순위 정리
- 메뉴 재구성 및 UX 설계
- 이행 계획 및 RFP 구체화

#### 2단계
- 어드민/CMS 고도화 검토
- 콘텐츠 운영 및 편집 기능 구조 개선
- 필요한 범위 내 연계 강화

</div>
<div>

<div class="diagram-wrap">

<img src="./diagrams/goodthinking-roadmap.svg" alt="단계별 로드맵" style="display:block;max-width:88%;max-height:360px;margin:0 auto;object-fit:contain;" />

<div class="diagram-caption">CS 중심 추진 이후 어드민/CMS 고도화로 이어지는 단계별 로드맵</div>

</div>

</div>
</div>

---

# 기대 효과

> 좋은생각의 디지털 전환은 효율 개선을 넘어서, **운영 안정성과 데이터 활용 기반을 확보하는 일**입니다.

### 기대 효과
- 수작업 및 엑셀 의존도 감소
- 고객 응대 속도 향상
- 데이터 활용성과 운영 안정성 확보
- 시스템 목적별 역할 분리 명확화
- 향후 어드민/CMS 및 AI 확장 기반 확보

### 한 줄 정리
CS 시스템 우선 전환은 가장 큰 병목을 먼저 풀면서도, 이후 확장을 위한 기반을 함께 만드는 전략입니다.

---

# Decision Slide

> 이번 단계에서 필요한 의사결정은 **“무엇을 먼저 할 것인가”** 입니다.

<div class="decision">

### 결정 요청 사항
1. CS 시스템을 **1단계 우선 구축 대상**으로 확정할 것인지  
2. 템플릿/통합조회/권한관리 기능을 **핵심 범위**로 둘 것인지  
3. 어드민/CMS는 **2단계 별도 고도화 과제**로 분리할 것인지

</div>

<br>

<div class="lead-text">
좋은생각의 디지털 전환은 “통합을 위한 통합”이 아니라,<br>
<strong>현장의 병목을 먼저 해결하는 CS 시스템 중심 전략</strong>에서 시작해야 합니다.
</div>

---

# Appendix 가이드

### 추가 자료로 확장 가능한 영역
- 상세 시스템 현황도
- 부서별 인터뷰 세부 기록
- 메뉴 분석 상세표 (109개 메뉴)
- 기능요건 상세 목록
- UX 와이어프레임 상세안
- 어드민/CMS 고도화 방향 세부안

<div class="small">필요 시 현재 상세본 문서를 기반으로 Appendix 슬라이드를 추가 구성할 수 있습니다.</div>
