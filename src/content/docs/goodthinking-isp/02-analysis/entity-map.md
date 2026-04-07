---
title: 엔티티 관계도
description: 좋은생각 조직·시스템·업무 전체 연계 관계를 한눈에 조망하는 엔티티 맵
---

# 엔티티 관계도 (Entity Relationship Map)

좋은생각의 **조직(Organization) → 시스템(System) → 업무(Process)** 간 연계를 한눈에 파악할 수 있도록 구성한 전체 관계도입니다.

---

## 1. 전체 조감도

조직이 어떤 시스템을 사용하고, 어떤 업무를 수행하는지 3개 레이어로 조망합니다.

```mermaid
flowchart LR
    %% ── 조직 레이어 (좌측 컬럼) ──
    subgraph ORG["🏢 조직"]
        direction TB
        SUB["정기구독팀<br/><small>정황규 · 어은진</small>"]
        SALES["영업추진팀<br/><small>이성수 · 권지은</small>"]
        MGMT["경영지원팀<br/><small>송윤경 · 김나현</small>"]
        EDIT_M["월간지팀<br/><small>이민애 편집장 外</small>"]
        EDIT_B["단행본팀<br/><small>강시현</small>"]
        CHERRY["앵두아트프로젝트"]
        CALL["외주 콜센터<br/><small>더아이앤오 ~4명</small>"]
    end

    %% ── 시스템 레이어 (중앙 컬럼) ──
    subgraph SYS["💻 시스템"]
        direction TB
        CS["CS System<br/><small>XPlatform / MSSQL 2008<br/>86화면</small>"]
        CMS["CMS<br/><small>기사관리</small>"]
        ADMIN["홈페이지 Admin<br/><small>Node.js</small>"]
        NICE["나이스페이 PG<br/><small>4~5 계정</small>"]
        PLAY["Playauto<br/><small>외부몰 연동</small>"]
        ERP["위하고 ERP"]
        KORYO["고려출판물류<br/><small>단행본 출고</small>"]
        CJ["CJ대한통운"]
        POST["우체국"]
        NAS["NAS"]
        BANK["신한 인사이트 뱅크"]
        CTI["서울정보시스템 CTI<br/><small>⚠️ 중단</small>"]
    end

    %% ── 업무 레이어 (우측 컬럼) ──
    subgraph PROC["📋 업무 프로세스"]
        direction TB
        P_SUB["정기구독 관리<br/><small>신규가입·해지·배송</small>"]
        P_SALES["외부몰 판매<br/><small>주문수집·재고·CS</small>"]
        P_MGMT["경영관리<br/><small>회계·인사·입출금</small>"]
        P_EDIT["콘텐츠 제작<br/><small>기사작성·편집·인쇄</small>"]
        P_CHERRY["앵두 제품관리<br/><small>상품등록·배송</small>"]
        P_CALL["인바운드 CS<br/><small>수신·상담·처리</small>"]
    end

    %% ── 조직 → 시스템 ──
    SUB -->|"주력"| CS
    SUB --> NICE
    SUB --> POST
    SUB --> CJ

    SALES -->|"카드결제만"| CS
    SALES -->|"주력"| KORYO
    SALES -->|"주력"| ERP
    SALES --> CJ

    MGMT -->|"주력"| CS
    MGMT --> ERP
    MGMT --> BANK

    EDIT_M --> CMS
    EDIT_M --> NAS
    EDIT_B --> CMS
    EDIT_B --> NAS

    CHERRY --> ADMIN
    CHERRY --> PLAY
    CHERRY --> CJ

    CALL -->|"VPN"| CS
    CALL --> CTI

    %% ── 시스템 → 업무 ──
    CS -.-> P_SUB
    CS -.-> P_MGMT
    CS -.-> P_CALL
    KORYO -.-> P_SALES
    CMS -.-> P_EDIT
    ADMIN -.-> P_CHERRY
    PLAY -.-> P_SALES
    PLAY -.-> P_CHERRY

    %% ── 스타일 ──
    style ORG fill:#dbeafe,stroke:#3b82f6,stroke-width:2px
    style SYS fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style PROC fill:#d1fae5,stroke:#10b981,stroke-width:2px
    style CTI fill:#fee2e2,stroke:#ef4444,stroke-width:2px,stroke-dasharray: 5 5
```

---

## 2. 시스템 간 연동 관계

내부 시스템과 외부 시스템 간의 데이터 흐름을 보여줍니다.

```mermaid
flowchart LR
    subgraph INTERNAL["내부 시스템"]
        CS["CS System<br/><small>MSSQL 2008</small>"]
        CMS["CMS"]
        ADMIN["홈페이지 Admin"]
    end

    subgraph EXTERNAL["외부 연동"]
        NICE["나이스페이 PG"]
        PLAY["Playauto"]
        ERP["위하고 ERP"]
        KORYO["고려출판물류"]
        CJ["CJ대한통운"]
        POST["우체국"]
        BANK["신한 인사이트 뱅크"]
        SETTLE["금융결제원"]
    end

    CS <-->|"결제 처리"| NICE
    CS <-->|"주문 수집·재고"| PLAY
    CS -->|"회계 데이터"| ERP
    CS -->|"배송 접수"| CJ
    CS -->|"배송 접수"| POST
    CS -->|"CMS 출금"| SETTLE
    ERP <-->|"계좌 조회"| BANK
    KORYO -->|"단행본 출고"| CJ
    KORYO -->|"재고 데이터"| ERP
    CMS -->|"기사 발행"| ADMIN
    ADMIN -->|"구독 신청"| CS

    style INTERNAL fill:#eff6ff,stroke:#3b82f6,stroke-width:2px
    style EXTERNAL fill:#fff7ed,stroke:#f97316,stroke-width:2px
```

---

## 3. 수작업 병목 지도

현행 업무에서 식별된 **56건의 수작업** 중 핵심 병목을 팀별로 표시합니다.
빨간색 항목이 개선 우선순위가 높은 병목 구간입니다.

```mermaid
flowchart TB
    subgraph SUB_TEAM["정기구독팀 — 28단계 프로세스"]
        S1["🔴 수기 가입접수<br/><small>전화→CS 직접입력</small>"]
        S2["🔴 엑셀 배송 매칭<br/><small>CS↔우체국·CJ 수작업</small>"]
        S3["🔴 수기 해지 처리<br/><small>전화→CS 직접삭제</small>"]
        S4["🟡 반품 수기 처리"]
        S5["🟡 미납 수기 확인"]
    end

    subgraph SALES_TEAM["영업추진팀 — 10건 수작업·병목"]
        L1["🔴 고려출판물류→위하고 이중입력<br/><small>단행본 출고·매출 매일</small>"]
        L2["🔴 입금내역 삼중입력<br/><small>엑셀→관리용→위하고 수금</small>"]
        L3["🔴 통장내역 수작업 대조<br/><small>미수금 확인 수시</small>"]
        L4["🟡 다량특판 개인엑셀 관리<br/><small>출고량·단가·입금여부</small>"]
        L5["🟡 편집팀 인쇄완료 수동확인"]
    end

    subgraph MGMT_TEAM["경영지원팀 — 8단계 프로세스"]
        M1["🔴 매출 수기 대사<br/><small>CS↔ERP 일일 대조</small>"]
        M2["🔴 입출금 수기 확인<br/><small>신한뱅크→엑셀→CS</small>"]
        M3["🟡 급여 수기 산출"]
    end

    subgraph EDIT_TEAM["편집실 — 5단계 프로세스"]
        E1["🟡 기사 상태 수기 추적<br/><small>CMS 미연동</small>"]
        E2["🟡 인쇄 교정 메일 수작업"]
    end

    subgraph CALL_TEAM["외주 콜센터 — 5단계 프로세스"]
        C1["🔴 VPN 끊김 시 업무 중단"]
        C2["🔴 CTI 중단 → 수기 콜 로그<br/><small>통화기록 없음</small>"]
        C3["🟡 상담 이력 CS 수기 입력"]
    end

    style SUB_TEAM fill:#fef2f2,stroke:#ef4444,stroke-width:2px
    style SALES_TEAM fill:#fff7ed,stroke:#f97316,stroke-width:2px
    style MGMT_TEAM fill:#fffbeb,stroke:#eab308,stroke-width:2px
    style EDIT_TEAM fill:#f0fdf4,stroke:#22c55e,stroke-width:2px
    style CALL_TEAM fill:#fef2f2,stroke:#ef4444,stroke-width:2px
```

---

## 4. 데이터베이스 구조 개요

CS System의 MSSQL 2008 데이터베이스 151개 테이블 구성을 보여줍니다.

```mermaid
flowchart TB
    subgraph DB["📦 MSSQL 2008 — 151 Tables"]
        direction TB
        subgraph CS_DB["CS 데이터베이스 — 75 tables"]
            T_MEM["회원 테이블군<br/><small>회원·구독·결제이력</small>"]
            T_ORD["주문 테이블군<br/><small>주문·배송·반품</small>"]
            T_PRD["상품 테이블군<br/><small>월간지·단행본·앵두</small>"]
            T_FIN["정산 테이블군<br/><small>매출·입금·미납</small>"]
            T_CS["상담 테이블군<br/><small>인바운드·아웃바운드</small>"]
        end
        subgraph WEB_DB["웹 데이터베이스 — 76 tables"]
            T_CMS["CMS 테이블군<br/><small>기사·카테고리·태그</small>"]
            T_SITE["사이트 테이블군<br/><small>회원·게시판·배너</small>"]
            T_ADMIN["어드민 테이블군<br/><small>관리자·권한·로그</small>"]
        end
    end

    T_MEM <-->|"회원 연동"| T_SITE
    T_ORD <-->|"주문 연동"| T_SITE
    T_PRD -->|"상품 정보"| T_CMS
    T_CS -->|"상담 기록"| T_ADMIN

    NOTE["⚠️ 56건 비즈니스 로직<br/><small>Stored Procedure 기반</small>"]

    style DB fill:#f5f3ff,stroke:#7c3aed,stroke-width:2px
    style CS_DB fill:#ede9fe,stroke:#8b5cf6
    style WEB_DB fill:#e0e7ff,stroke:#6366f1
    style NOTE fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
```

---

## 범례

| 기호 | 의미 |
|------|------|
| 🔴 | 높은 우선순위 병목 (업무 지연·오류 발생) |
| 🟡 | 중간 우선순위 (비효율적이나 운영 가능) |
| `실선 →` | 시스템 사용 / 데이터 흐름 |
| `점선 -.->` | 업무 수행 관계 |
| ⚠️ | 서비스 중단 또는 주의 필요 |

---

## 5. 인터랙티브 네트워크 그래프

위 정적 다이어그램을 **클릭·드래그·줌** 가능한 네트워크로 탐색합니다.
노드를 클릭하면 상세 정보가 표시되고, 상단 필터로 레이어별 표시를 제어할 수 있습니다.

<div id="network-controls" style="margin-bottom: 0.8rem; display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
  <button class="net-filter active" data-group="org">🏢 조직</button>
  <button class="net-filter active" data-group="sys">💻 시스템</button>
  <button class="net-filter active" data-group="proc">📋 업무</button>
  <button id="net-fullscreen" class="net-btn-fullscreen">⛶ 전체화면</button>
  <button id="net-reset" class="net-btn-reset">↺ 초기화</button>
</div>

<div id="network-graph" style="width: 100%; height: 520px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fafafa;"></div>

<span style="display: block; text-align: center; font-size: 0.78rem; color: #888; margin-top: 0.4rem;">⛶ 전체화면 버튼을 누르면 크게 볼 수 있습니다</span>

<div id="network-info" style="margin-top: 0.6rem; padding: 0.7rem 1rem; border-radius: 6px; background: #f0f9ff; border: 1px solid #bae6fd; font-size: 0.82rem; color: #0c4a6e; min-height: 2.2rem;">
  💡 노드를 클릭하면 상세 정보가 여기에 표시됩니다. 드래그로 이동, 스크롤로 줌할 수 있습니다.
</div>

<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/vis-network/10.0.2/standalone/umd/vis-network.min.js"></script>

<script>
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var container = document.getElementById('network-graph');
    var infoBox = document.getElementById('network-info');
    if (!container) return;

    // ── 노드 데이터 ──
    var allNodes = [
      // 조직 (org)
      { id: 'sub', label: '정기구독팀', group: 'org', title: '정황규 · 어은진\n주력: CS System\n연동: 나이스페이, 우체국, CJ', info: '<strong>정기구독팀</strong> (정황규, 어은진)<br/>28단계 프로세스 · 주력 시스템: CS System<br/>연동: 나이스페이 PG, 우체국, CJ대한통운' },
      { id: 'sales', label: '영업추진팀', group: 'org', title: '이성수 · 권지은\n주력: 고려출판물류, 위하고, 엑셀\nCS 시스템은 카드결제만', info: '<strong>영업추진팀</strong> (이성수, 권지은)<br/>10건 수작업·병목 · 주력 시스템: 고려출판물류, 위하고, 엑셀<br/>CS 시스템은 카드결제·현금영수증 발행 외 미사용' },
      { id: 'mgmt', label: '경영지원팀', group: 'org', title: '송윤경 · 김나현\n주력: CS System\n연동: 위하고 ERP, 신한뱅크', info: '<strong>경영지원팀</strong> (송윤경, 김나현)<br/>8단계 프로세스 · 주력 시스템: CS System<br/>연동: 위하고 ERP, 신한 인사이트 뱅크' },
      { id: 'edit_m', label: '월간지팀', group: 'org', title: '이민애 편집장 外\n시스템: CMS, NAS', info: '<strong>월간지팀</strong> (이민애 편집장 外)<br/>편집실 · 시스템: CMS (기사관리), NAS' },
      { id: 'edit_b', label: '단행본팀', group: 'org', title: '강시현\n시스템: CMS, NAS', info: '<strong>단행본팀</strong> (강시현)<br/>편집실 · 시스템: CMS (기사관리), NAS' },
      { id: 'cherry', label: '앵두아트프로젝트', group: 'org', title: '홈페이지 Admin, Playauto, CJ', info: '<strong>앵두아트프로젝트</strong><br/>시스템: 홈페이지 Admin, Playauto, CJ대한통운' },
      { id: 'call', label: '외주 콜센터', group: 'org', title: '더아이앤오 ~4명\nVPN 접속 · CS System', info: '<strong>외주 콜센터</strong> (더아이앤오 ~4명)<br/>VPN으로 CS System 접속<br/>⚠️ CTI 중단 상태 → 수기 콜 로그' },

      // 시스템 (sys)
      { id: 'cs', label: 'CS System', group: 'sys', title: 'XPlatform / MSSQL 2008\n86화면 · 핵심 시스템', info: '<strong>CS System</strong><br/>XPlatform 클라이언트 / MSSQL 2008<br/>86화면 · 56건 비즈니스 로직 (SP 기반)<br/>전 부서 사용 핵심 시스템', font: { size: 15, bold: true }, borderWidth: 4, size: 25, color: { background: '#fde68a', border: '#d97706' } },
      { id: 'cms', label: 'CMS', group: 'sys', title: '기사 관리 시스템', info: '<strong>CMS</strong> (기사관리)<br/>편집실에서 기사 작성·편집·발행<br/>홈페이지 Admin으로 기사 발행 연동' },
      { id: 'admin', label: '홈페이지 Admin', group: 'sys', title: 'Node.js 기반', info: '<strong>홈페이지 Admin</strong> (Node.js)<br/>앵두아트 상품 관리·구독 신청 접수<br/>CMS에서 기사 수신 → 웹 발행' },
      { id: 'nice', label: '나이스페이 PG', group: 'sys', title: '4~5 계정 · 결제 처리', info: '<strong>나이스페이 PG</strong><br/>4~5개 결제 계정 운영<br/>CS System과 결제 처리 연동' },
      { id: 'play', label: 'Playauto', group: 'sys', title: '외부몰 연동 · 10개 몰', info: '<strong>Playauto</strong> (외부몰 연동)<br/>쿠팡·네이버 등 10개 외부몰<br/>주문 수집 · 재고 동기화' },
      { id: 'erp', label: '위하고 ERP', group: 'sys', title: '회계 · 인사 관리', info: '<strong>위하고 ERP</strong><br/>회계 데이터 관리<br/>CS System → ERP 매출 전송<br/>신한 인사이트 뱅크 계좌 조회 연동<br/>영업추진팀 핵심 시스템' },
      { id: 'koryo', label: '고려출판물류', group: 'sys', title: '단행본 출고 시스템', info: '<strong>고려출판물류 시스템</strong><br/>단행본 출고 관리 (권지은 과장)<br/>예스24·알라딘·교보문고 SCM 연동<br/>영업추진팀 핵심 시스템' },
      { id: 'cj', label: 'CJ대한통운', group: 'sys', title: '배송 접수', info: '<strong>CJ대한통운</strong><br/>배송 접수 · 송장 관리<br/>정기구독팀·영업추진팀·앵두 공통 사용' },
      { id: 'post', label: '우체국', group: 'sys', title: '배송 접수', info: '<strong>우체국</strong><br/>배송 접수 (월간지 등)<br/>정기구독팀 주 사용' },
      { id: 'nas', label: 'NAS', group: 'sys', title: '파일 스토리지', info: '<strong>NAS</strong><br/>편집 원고·이미지 파일 저장소<br/>편집실 공유 스토리지' },
      { id: 'bank', label: '신한 인사이트 뱅크', group: 'sys', title: '계좌 조회 · 입출금', info: '<strong>신한 인사이트 뱅크</strong><br/>계좌 조회 · 입출금 확인<br/>위하고 ERP와 연동' },
      { id: 'cti', label: 'CTI ⚠️ 중단', group: 'sys', title: '서울정보시스템 CTI\n⚠️ 서비스 중단', info: '<strong>서울정보시스템 CTI</strong><br/>⚠️ 서비스 중단 상태<br/>콜센터 통화 기록 관리 불가 → 수기 로그', color: { background: '#fee2e2', border: '#ef4444' } },

      // 업무 프로세스 (proc)
      { id: 'p_sub', label: '정기구독 관리', group: 'proc', title: '신규가입·해지·배송\n🔴 수기가입, 엑셀배송, 수기해지', info: '<strong>정기구독 관리</strong><br/>신규가입 · 해지 · 배송 처리<br/>🔴 핵심 병목: 수기 가입접수, 엑셀 배송 매칭, 수기 해지' },
      { id: 'p_sales', label: '외부몰 판매', group: 'proc', title: '단행본·총판·다량특판\n🔴 이중입력, 수작업대조', info: '<strong>외부몰 판매 / 단행본 유통</strong><br/>단행본 출고 · 총판 관리 · 다량 특판<br/>🔴 핵심 병목: 고려출판물류→위하고 이중입력, 입금내역 삼중입력, 통장내역 수작업 대조' },
      { id: 'p_mgmt', label: '경영관리', group: 'proc', title: '회계·인사·입출금\n🔴 매출수기대사, 입출금수기', info: '<strong>경영관리</strong><br/>회계 · 인사 · 입출금 관리<br/>🔴 핵심 병목: 매출 수기 대사 (CS↔ERP), 입출금 수기 확인' },
      { id: 'p_edit', label: '콘텐츠 제작', group: 'proc', title: '기사작성·편집·인쇄\n🟡 상태수기추적, 교정메일수작업', info: '<strong>콘텐츠 제작</strong><br/>기사 작성 · 편집 · 인쇄<br/>🟡 병목: 기사 상태 수기 추적, 인쇄 교정 메일 수작업' },
      { id: 'p_cherry', label: '앵두 제품관리', group: 'proc', title: '상품등록·배송', info: '<strong>앵두 제품관리</strong><br/>상품 등록 · 배송 처리<br/>홈페이지 Admin + Playauto 이용' },
      { id: 'p_call', label: '인바운드 CS', group: 'proc', title: '수신·상담·처리\n🔴 VPN끊김, CTI중단', info: '<strong>인바운드 CS</strong><br/>수신 · 상담 · 처리<br/>🔴 핵심 병목: VPN 끊김 시 업무 중단, CTI 중단 → 수기 콜 로그' }
    ];

    // ── 엣지 데이터 ──
    var allEdges = [
      // 조직 → 시스템 (주력)
      { id: 'e1', from: 'sub', to: 'cs', label: '주력', color: { color: '#3b82f6' }, width: 2 },
      { id: 'e2', from: 'sub', to: 'nice', color: { color: '#93c5fd' } },
      { id: 'e3', from: 'sub', to: 'post', color: { color: '#93c5fd' } },
      { id: 'e4', from: 'sub', to: 'cj', color: { color: '#93c5fd' } },

      { id: 'e5', from: 'sales', to: 'cs', label: '카드결제만', color: { color: '#a3a3a3' } },
      { id: 'e5b', from: 'sales', to: 'koryo', label: '주력', color: { color: '#3b82f6' }, width: 2 },
      { id: 'e5c', from: 'sales', to: 'erp', label: '주력', color: { color: '#3b82f6' }, width: 2 },
      { id: 'e7', from: 'sales', to: 'cj', color: { color: '#93c5fd' } },

      { id: 'e8', from: 'mgmt', to: 'cs', label: '주력', color: { color: '#3b82f6' }, width: 2 },
      { id: 'e9', from: 'mgmt', to: 'erp', color: { color: '#93c5fd' } },
      { id: 'e10', from: 'mgmt', to: 'bank', color: { color: '#93c5fd' } },

      { id: 'e11', from: 'edit_m', to: 'cms', color: { color: '#93c5fd' } },
      { id: 'e12', from: 'edit_m', to: 'nas', color: { color: '#93c5fd' } },
      { id: 'e13', from: 'edit_b', to: 'cms', color: { color: '#93c5fd' } },
      { id: 'e14', from: 'edit_b', to: 'nas', color: { color: '#93c5fd' } },

      { id: 'e15', from: 'cherry', to: 'admin', color: { color: '#93c5fd' } },
      { id: 'e16', from: 'cherry', to: 'play', color: { color: '#93c5fd' } },
      { id: 'e17', from: 'cherry', to: 'cj', color: { color: '#93c5fd' } },

      { id: 'e18', from: 'call', to: 'cs', label: 'VPN', color: { color: '#3b82f6' }, width: 2 },
      { id: 'e19', from: 'call', to: 'cti', color: { color: '#ef4444' }, dashes: true },

      // 시스템 → 업무 (점선)
      { id: 'e20', from: 'cs', to: 'p_sub', dashes: true, color: { color: '#a3a3a3' }, arrows: { to: { scaleFactor: 0.5 } } },
      { id: 'e21', from: 'koryo', to: 'p_sales', dashes: true, color: { color: '#a3a3a3' }, arrows: { to: { scaleFactor: 0.5 } } },
      { id: 'e22', from: 'cs', to: 'p_mgmt', dashes: true, color: { color: '#a3a3a3' }, arrows: { to: { scaleFactor: 0.5 } } },
      { id: 'e23', from: 'cs', to: 'p_call', dashes: true, color: { color: '#a3a3a3' }, arrows: { to: { scaleFactor: 0.5 } } },
      { id: 'e24', from: 'cms', to: 'p_edit', dashes: true, color: { color: '#a3a3a3' }, arrows: { to: { scaleFactor: 0.5 } } },
      { id: 'e25', from: 'admin', to: 'p_cherry', dashes: true, color: { color: '#a3a3a3' }, arrows: { to: { scaleFactor: 0.5 } } },
      { id: 'e26', from: 'play', to: 'p_sales', dashes: true, color: { color: '#a3a3a3' }, arrows: { to: { scaleFactor: 0.5 } } },
      { id: 'e27', from: 'play', to: 'p_cherry', dashes: true, color: { color: '#a3a3a3' }, arrows: { to: { scaleFactor: 0.5 } } },

      // 시스템 간 연동
      { id: 'e28', from: 'cs', to: 'nice', label: '결제', color: { color: '#f59e0b' }, dashes: [5, 5] },
      { id: 'e29', from: 'cs', to: 'play', label: '주문·재고', color: { color: '#f59e0b' }, dashes: [5, 5] },
      { id: 'e30', from: 'cs', to: 'erp', label: '회계', color: { color: '#f59e0b' }, dashes: [5, 5] },
      { id: 'e31', from: 'erp', to: 'bank', label: '계좌', color: { color: '#f59e0b' }, dashes: [5, 5] },
      { id: 'e32', from: 'cms', to: 'admin', label: '기사발행', color: { color: '#f59e0b' }, dashes: [5, 5] },
      { id: 'e33', from: 'admin', to: 'cs', label: '구독신청', color: { color: '#f59e0b' }, dashes: [5, 5] }
    ];

    var nodes = new vis.DataSet(allNodes);
    var edges = new vis.DataSet(allEdges);

    // ── 네트워크 옵션 ──
    var options = {
      groups: {
        org: { color: { background: '#dbeafe', border: '#3b82f6' }, shape: 'box', font: { size: 13, face: 'Pretendard, -apple-system, sans-serif' } },
        sys: { color: { background: '#fef3c7', border: '#f59e0b' }, shape: 'box', font: { size: 13, face: 'Pretendard, -apple-system, sans-serif' } },
        proc: { color: { background: '#d1fae5', border: '#10b981' }, shape: 'box', font: { size: 13, face: 'Pretendard, -apple-system, sans-serif' } }
      },
      nodes: {
        borderWidth: 2,
        shadow: { enabled: true, size: 4, x: 2, y: 2 },
        margin: { top: 8, bottom: 8, left: 12, right: 12 }
      },
      edges: {
        arrows: { to: { enabled: true, scaleFactor: 0.7 } },
        smooth: { type: 'cubicBezier', roundness: 0.4 },
        font: { size: 10, color: '#6b7280', strokeWidth: 2, strokeColor: '#ffffff' }
      },
      physics: {
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -40,
          centralGravity: 0.008,
          springLength: 160,
          springConstant: 0.03,
          damping: 0.4
        },
        stabilization: { iterations: 200 }
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        navigationButtons: false,
        keyboard: { enabled: true }
      },
      layout: { randomSeed: 42 }
    };

    var network = new vis.Network(container, { nodes: nodes, edges: edges }, options);

    // ── 클릭 시 상세 정보 ──
    network.on('click', function(params) {
      if (params.nodes.length > 0) {
        var nodeId = params.nodes[0];
        var node = nodes.get(nodeId);
        if (node && node.info && infoBox) {
          infoBox.innerHTML = node.info;
          infoBox.style.borderColor = node.group === 'org' ? '#93c5fd' : node.group === 'sys' ? '#fcd34d' : '#6ee7b7';
          infoBox.style.background = node.group === 'org' ? '#f0f9ff' : node.group === 'sys' ? '#fffbeb' : '#ecfdf5';
        }
      } else {
        if (infoBox) {
          infoBox.innerHTML = '💡 노드를 클릭하면 상세 정보가 여기에 표시됩니다. 드래그로 이동, 스크롤로 줌할 수 있습니다.';
          infoBox.style.borderColor = '#bae6fd';
          infoBox.style.background = '#f0f9ff';
        }
      }
    });

    // ── 필터 토글 ──
    var activeGroups = { org: true, sys: true, proc: true };

    document.querySelectorAll('.net-filter').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var group = btn.dataset.group;
        activeGroups[group] = !activeGroups[group];
        btn.classList.toggle('active');
        btn.style.opacity = activeGroups[group] ? '1' : '0.35';
        applyFilter();
      });
    });

    function applyFilter() {
      // 노드 표시/숨김
      var updates = allNodes.map(function(n) {
        return { id: n.id, hidden: !activeGroups[n.group] };
      });
      nodes.update(updates);

      // 엣지: 양쪽 노드가 모두 보일 때만 표시
      var edgeUpdates = allEdges.map(function(e) {
        var fromNode = allNodes.find(function(n) { return n.id === e.from; });
        var toNode = allNodes.find(function(n) { return n.id === e.to; });
        var fromVisible = fromNode ? activeGroups[fromNode.group] : false;
        var toVisible = toNode ? activeGroups[toNode.group] : false;
        return { id: e.id, hidden: !(fromVisible && toVisible) };
      });
      edges.update(edgeUpdates);
    }

    // ── 초기화 버튼 ──
    var resetBtn = document.getElementById('net-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        activeGroups = { org: true, sys: true, proc: true };
        document.querySelectorAll('.net-filter').forEach(function(btn) {
          btn.classList.add('active');
          btn.style.opacity = '1';
        });
        nodes.update(allNodes.map(function(n) { return { id: n.id, hidden: false }; }));
        edges.update(allEdges.map(function(e) { return { id: e.id, hidden: false }; }));
        network.fit({ animation: { duration: 500, easingFunction: 'easeInOutQuad' } });
        if (infoBox) {
          infoBox.innerHTML = '💡 노드를 클릭하면 상세 정보가 여기에 표시됩니다. 드래그로 이동, 스크롤로 줌할 수 있습니다.';
          infoBox.style.borderColor = '#bae6fd';
          infoBox.style.background = '#f0f9ff';
        }
      });
    }

    // ── 안정화 후 fit ──
    network.once('stabilizationIterationsDone', function() {
      network.fit({ animation: { duration: 800, easingFunction: 'easeInOutQuad' } });
    });

    // ── 풀스크린 모달 ──
    var fsOverlay = document.getElementById('network-fs-overlay');
    var fsContainer = document.getElementById('network-graph-fs');
    var fsInfoBox = document.getElementById('network-info-fs');
    var fsCloseBtn = document.getElementById('net-fs-close');
    var fsResetBtn = document.getElementById('net-fs-reset');
    var fullscreenBtn = document.getElementById('net-fullscreen');
    var fsNetwork = null;
    var fsNodes = null;
    var fsEdges = null;
    var fsActiveGroups = { org: true, sys: true, proc: true };

    function openFullscreen() {
      if (!fsOverlay || !fsContainer) return;
      fsOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      document.querySelectorAll('.right-sidebar-container, .sidebar, header.header').forEach(function(s) { s.style.display = 'none'; });

      // 새 DataSet으로 풀스크린 network 생성
      fsNodes = new vis.DataSet(JSON.parse(JSON.stringify(allNodes)));
      fsEdges = new vis.DataSet(JSON.parse(JSON.stringify(allEdges)));
      fsActiveGroups = { org: true, sys: true, proc: true };

      // 필터 버튼 상태 초기화
      document.querySelectorAll('.net-filter-fs').forEach(function(btn) {
        btn.classList.add('active');
        btn.style.opacity = '1';
      });

      var fsOptions = JSON.parse(JSON.stringify(options));
      fsOptions.physics.forceAtlas2Based.springLength = 200;
      fsOptions.physics.forceAtlas2Based.gravitationalConstant = -60;

      // 기존 인스턴스 제거
      if (fsNetwork) { fsNetwork.destroy(); fsNetwork = null; }

      fsNetwork = new vis.Network(fsContainer, { nodes: fsNodes, edges: fsEdges }, fsOptions);

      fsNetwork.on('click', function(params) {
        if (params.nodes.length > 0) {
          var node = fsNodes.get(params.nodes[0]);
          if (node && node.info && fsInfoBox) {
            fsInfoBox.innerHTML = node.info;
          }
        } else if (fsInfoBox) {
          fsInfoBox.innerHTML = '💡 노드를 클릭하면 상세 정보가 표시됩니다.';
        }
      });

      fsNetwork.once('stabilizationIterationsDone', function() {
        fsNetwork.fit({ animation: { duration: 600, easingFunction: 'easeInOutQuad' } });
      });
    }

    function closeFullscreen() {
      if (!fsOverlay) return;
      fsOverlay.classList.remove('active');
      document.body.style.overflow = '';
      document.querySelectorAll('.right-sidebar-container, .sidebar, header.header').forEach(function(s) { s.style.display = ''; });
      if (fsNetwork) { fsNetwork.destroy(); fsNetwork = null; }
      if (fsInfoBox) fsInfoBox.innerHTML = '💡 노드를 클릭하면 상세 정보가 표시됩니다.';
    }

    if (fullscreenBtn) fullscreenBtn.addEventListener('click', openFullscreen);
    if (fsCloseBtn) fsCloseBtn.addEventListener('click', closeFullscreen);

    // ESC 닫기 (풀스크린)
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && fsOverlay && fsOverlay.classList.contains('active')) {
        closeFullscreen();
      }
    });

    // 풀스크린 필터 토글
    document.querySelectorAll('.net-filter-fs').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var group = btn.dataset.group;
        fsActiveGroups[group] = !fsActiveGroups[group];
        btn.classList.toggle('active');
        btn.style.opacity = fsActiveGroups[group] ? '1' : '0.35';
        if (!fsNodes || !fsEdges) return;
        fsNodes.update(allNodes.map(function(n) { return { id: n.id, hidden: !fsActiveGroups[n.group] }; }));
        fsEdges.update(allEdges.map(function(e) {
          var fn = allNodes.find(function(n) { return n.id === e.from; });
          var tn = allNodes.find(function(n) { return n.id === e.to; });
          return { id: e.id, hidden: !(fn && fsActiveGroups[fn.group] && tn && fsActiveGroups[tn.group]) };
        }));
      });
    });

    // 풀스크린 초기화 버튼
    if (fsResetBtn) {
      fsResetBtn.addEventListener('click', function() {
        fsActiveGroups = { org: true, sys: true, proc: true };
        document.querySelectorAll('.net-filter-fs').forEach(function(btn) {
          btn.classList.add('active');
          btn.style.opacity = '1';
        });
        if (fsNodes) fsNodes.update(allNodes.map(function(n) { return { id: n.id, hidden: false }; }));
        if (fsEdges) fsEdges.update(allEdges.map(function(e) { return { id: e.id, hidden: false }; }));
        if (fsNetwork) fsNetwork.fit({ animation: { duration: 500, easingFunction: 'easeInOutQuad' } });
        if (fsInfoBox) fsInfoBox.innerHTML = '💡 노드를 클릭하면 상세 정보가 표시됩니다.';
      });
    }
  });
})();
</script>

<style>
  .mermaid-zoom-overlay {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 999999;
    background: rgba(0, 0, 0, 0.85);
    cursor: zoom-out;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  .mermaid-zoom-overlay.active {
    display: flex;
  }
  .mermaid-zoom-overlay svg {
    max-width: 95vw;
    max-height: 92vh;
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  }
  .mermaid-zoom-hint {
    display: block;
    text-align: center;
    font-size: 0.78rem;
    color: var(--sl-color-gray-4, #888);
    margin-top: 0.4rem;
    cursor: pointer;
  }
  .mermaid-zoom-close {
    position: fixed;
    top: 1rem;
    right: 1.5rem;
    z-index: 1000000;
    display: none;
    color: white;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 6px;
    font-size: 0.85rem;
    padding: 0.35rem 0.9rem;
    cursor: pointer;
    backdrop-filter: blur(4px);
  }
  .mermaid-zoom-close.active {
    display: block;
  }
  pre.mermaid {
    cursor: zoom-in;
    transition: box-shadow 0.2s ease;
    border-radius: 6px;
  }
  pre.mermaid:hover {
    box-shadow: 0 0 0 2px var(--sl-color-accent, #3b82f6);
  }
  /* 오른쪽 목차: 세로선 제거 + 배경 불투명 처리 */
  .right-sidebar {
    border-inline-start: none !important;
    border-left: none !important;
  }
  .right-sidebar-panel {
    background-color: #ffffff !important;
  }
  /* 네트워크 풀스크린 모달 */
  .network-fullscreen-overlay {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 999999;
    background: rgba(0, 0, 0, 0.9);
    flex-direction: column;
    padding: 0;
  }
  .network-fullscreen-overlay.active {
    display: flex;
  }
  .network-fullscreen-toolbar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(255,255,255,0.1);
    flex-shrink: 0;
  }
  .network-fullscreen-toolbar button {
    padding: 0.35rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.82rem;
    font-weight: 600;
    line-height: 1.2;
    box-sizing: border-box;
    height: 2rem;
    vertical-align: middle;
  }
  .network-fullscreen-toolbar .net-filter-fs {
    border-width: 2px;
    border-style: solid;
  }

  /* ── 필터 버튼 공통 ── */
  .net-filter,
  .net-filter-fs {
    padding: 0.3rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.82rem;
    font-weight: 600;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }

  /* 조직 — 기본 */
  .net-filter[data-group="org"],
  .net-filter-fs[data-group="org"] {
    background: #dbeafe;
    border: 2px solid #3b82f6;
    color: #1e40af;
  }
  /* 조직 — 호버 */
  .net-filter[data-group="org"]:hover,
  .net-filter-fs[data-group="org"]:hover {
    background: #93c5fd;
    border-color: #2563eb;
    color: #1e3a5f;
  }

  /* 시스템 — 기본 */
  .net-filter[data-group="sys"],
  .net-filter-fs[data-group="sys"] {
    background: #fef3c7;
    border: 2px solid #f59e0b;
    color: #92400e;
  }
  /* 시스템 — 호버 */
  .net-filter[data-group="sys"]:hover,
  .net-filter-fs[data-group="sys"]:hover {
    background: #fcd34d;
    border-color: #d97706;
    color: #78350f;
  }

  /* 업무 — 기본 */
  .net-filter[data-group="proc"],
  .net-filter-fs[data-group="proc"] {
    background: #d1fae5;
    border: 2px solid #10b981;
    color: #065f46;
  }
  /* 업무 — 호버 */
  .net-filter[data-group="proc"]:hover,
  .net-filter-fs[data-group="proc"]:hover {
    background: #6ee7b7;
    border-color: #059669;
    color: #064e3b;
  }

  /* 전체화면 버튼 */
  .net-btn-fullscreen {
    padding: 0.3rem 0.8rem;
    border-radius: 4px;
    border: 1px solid #6366f1;
    background: #eef2ff;
    color: #4338ca;
    cursor: pointer;
    font-size: 0.82rem;
    font-weight: 600;
    margin-left: auto;
    transition: background 0.15s, border-color 0.15s;
  }
  .net-btn-fullscreen:hover {
    background: #c7d2fe;
    border-color: #4f46e5;
  }

  /* 초기화 버튼 */
  .net-btn-reset,
  #net-reset {
    padding: 0.3rem 0.8rem;
    border-radius: 4px;
    border: 1px solid #d1d5db;
    background: #f9fafb;
    color: #374151;
    cursor: pointer;
    font-size: 0.82rem;
    transition: background 0.15s, border-color 0.15s;
  }
  .net-btn-reset:hover,
  #net-reset:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
  }

  /* 풀스크린 액션 버튼 (초기화/닫기) */
  .net-btn-fs-action {
    border: 1px solid rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.1);
    color: white;
    transition: background 0.15s, border-color 0.15s;
  }
  .net-btn-fs-action:hover {
    background: rgba(255,255,255,0.25);
    border-color: rgba(255,255,255,0.5);
  }
  .network-fullscreen-body {
    flex: 1;
    position: relative;
  }
  .network-fullscreen-body #network-graph-fs {
    width: 100%;
    height: 100%;
    background: #ffffff;
  }
  .network-fullscreen-info {
    padding: 0.5rem 1rem;
    background: rgba(255,255,255,0.95);
    font-size: 0.82rem;
    color: #0c4a6e;
    border-top: 1px solid #e5e7eb;
    min-height: 2rem;
    flex-shrink: 0;
  }
</style>

<div class="network-fullscreen-overlay" id="network-fs-overlay">
  <div class="network-fullscreen-toolbar">
    <button class="net-filter-fs active" data-group="org">🏢 조직</button>
    <button class="net-filter-fs active" data-group="sys">💻 시스템</button>
    <button class="net-filter-fs active" data-group="proc">📋 업무</button>
    <span style="flex: 1;"></span>
    <button id="net-fs-reset" class="net-btn-fs-action">↺ 초기화</button>
    <button id="net-fs-close" class="net-btn-fs-action">ESC 닫기</button>
  </div>
  <div class="network-fullscreen-body">
    <div id="network-graph-fs"></div>
  </div>
  <div class="network-fullscreen-info" id="network-info-fs">💡 노드를 클릭하면 상세 정보가 표시됩니다.</div>
</div>

<div class="mermaid-zoom-overlay" id="mermaid-overlay"></div>
<button class="mermaid-zoom-close" id="mermaid-close">ESC 닫기</button>

<script>
  (function() {
    const overlay = document.getElementById('mermaid-overlay');
    const closeBtn = document.getElementById('mermaid-close');
    if (!overlay || !closeBtn) return;

    function setupDiagram(el) {
      if (el.dataset.zoomReady) return;
      el.dataset.zoomReady = 'true';

      // Add hint
      if (!el.nextElementSibling?.classList?.contains('mermaid-zoom-hint')) {
        const hint = document.createElement('span');
        hint.className = 'mermaid-zoom-hint';
        hint.textContent = '🔍 클릭하면 크게 볼 수 있습니다';
        hint.addEventListener('click', () => el.click());
        el.after(hint);
      }

      // Click → modal
      el.addEventListener('click', () => {
        const svg = el.querySelector('svg');
        if (!svg) return;
        const clone = svg.cloneNode(true);
        clone.removeAttribute('width');
        clone.removeAttribute('height');
        clone.style.width = 'auto';
        clone.style.height = 'auto';
        overlay.innerHTML = '';
        overlay.appendChild(clone);
        overlay.classList.add('active');
        closeBtn.classList.add('active');
        document.body.style.overflow = 'hidden';
        // 사이드바·목차 숨기기
        document.querySelectorAll('.right-sidebar-container, .sidebar').forEach(s => s.style.display = 'none');
      });
    }

    // Close modal
    function close() {
      overlay.classList.remove('active');
      closeBtn.classList.remove('active');
      overlay.innerHTML = '';
      document.body.style.overflow = '';
      // 사이드바·목차 복원
      document.querySelectorAll('.right-sidebar-container, .sidebar').forEach(s => s.style.display = '');
    }
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('svg')) close();
    });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    // Watch for Mermaid to render SVGs inside pre.mermaid
    function trySetup() {
      document.querySelectorAll('pre.mermaid').forEach(el => {
        if (el.querySelector('svg')) setupDiagram(el);
      });
    }

    // Initial check
    trySetup();

    // Observe for async Mermaid rendering
    const observer = new MutationObserver(() => trySetup());
    observer.observe(document.body, { childList: true, subtree: true });

    // Stop observing after 10s (Mermaid should be done by then)
    setTimeout(() => observer.disconnect(), 10000);
  })();
</script>
