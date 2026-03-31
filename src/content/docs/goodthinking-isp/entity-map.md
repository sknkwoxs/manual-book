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
flowchart TB
    %% ── 조직 레이어 ──
    subgraph ORG["🏢 조직 (Organization)"]
        direction LR
        SUB["정기구독팀<br/><small>정황규 · 어은진</small>"]
        SALES["영업추진팀<br/><small>이성수 · 권지은</small>"]
        MGMT["경영지원팀<br/><small>송윤경 · 김나현</small>"]
        EDIT_M["월간지팀<br/><small>이민애 편집장 外</small>"]
        EDIT_B["단행본팀<br/><small>강시현</small>"]
        CHERRY["앵두아트프로젝트"]
        CALL["외주 콜센터<br/><small>더아이앤오 ~4명</small>"]
    end

    %% ── 시스템 레이어 ──
    subgraph SYS["💻 시스템 (System)"]
        direction LR
        CS["CS System<br/><small>XPlatform / MSSQL 2008<br/>86화면</small>"]
        CMS["CMS<br/><small>기사관리 시스템</small>"]
        ADMIN["홈페이지 Admin<br/><small>Node.js</small>"]
        PLAY["Playauto<br/><small>외부몰 연동</small>"]
        NICE["나이스페이 PG<br/><small>4~5 계정</small>"]
        ERP["위하고 ERP"]
        CJ["CJ대한통운"]
        POST["우체국"]
        NAS["NAS"]
        BANK["신한 인사이트 뱅크"]
        CTI["서울정보시스템 CTI<br/><small>⚠️ 중단</small>"]
    end

    %% ── 업무 레이어 ──
    subgraph PROC["📋 업무 프로세스 (Process)"]
        direction LR
        P_SUB["정기구독 관리<br/><small>신규가입·해지·배송</small>"]
        P_SALES["외부몰 판매<br/><small>주문수집·재고·CS</small>"]
        P_MGMT["경영관리<br/><small>회계·인사·입출금</small>"]
        P_EDIT["콘텐츠 제작<br/><small>기사작성·편집·인쇄</small>"]
        P_CHERRY["앵두 제품관리<br/><small>상품등록·배송</small>"]
        P_CALL["인바운드 CS<br/><small>수신·상담·처리</small>"]
    end

    %% ── 조직 → 시스템 연결 ──
    SUB -->|"주력"| CS
    SUB --> NICE
    SUB --> POST
    SUB --> CJ

    SALES -->|"주력"| CS
    SALES --> PLAY
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

    CALL -->|"VPN 접속"| CS
    CALL --> CTI

    %% ── 조직 → 업무 연결 ──
    SUB -.->|"수행"| P_SUB
    SALES -.->|"수행"| P_SALES
    MGMT -.->|"수행"| P_MGMT
    EDIT_M -.->|"수행"| P_EDIT
    EDIT_B -.->|"수행"| P_EDIT
    CHERRY -.->|"수행"| P_CHERRY
    CALL -.->|"수행"| P_CALL

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
    CMS -->|"기사 발행"| ADMIN
    ADMIN -->|"구독 신청"| CS

    style INTERNAL fill:#eff6ff,stroke:#3b82f6,stroke-width:2px
    style EXTERNAL fill:#fff7ed,stroke:#f97316,stroke-width:2px
```

---

## 3. 수작업 병목 지도

현행 업무에서 식별된 **49건의 수작업** 중 핵심 병목 20건을 팀별로 표시합니다.
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

    subgraph SALES_TEAM["영업추진팀 — 5단계 프로세스"]
        L1["🔴 Playauto 주문 수기 확인<br/><small>10개 외부몰 개별 확인</small>"]
        L2["🔴 재고 수기 동기화<br/><small>CS↔Playauto 불일치</small>"]
        L3["🟡 CS 미반영 주문 수기입력"]
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

> **다음 단계**: 인터랙티브 네트워크 그래프(D3.js / vis.js)로 전환하여 클릭·필터·줌 기능을 추가할 예정입니다.
