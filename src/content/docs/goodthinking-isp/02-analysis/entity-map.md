---
title: 2.7. 엔티티 관계도
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
        SUB["정기구독팀"]
        SALES["영업추진팀"]
        MGMT["경영지원팀"]
        EDIT["편집실"]
        CALL["외주 콜센터"]
    end

    %% ── 시스템 레이어 (중앙 컬럼) ──
    subgraph SYS["💻 시스템"]
        direction TB
        subgraph SYS_INT["🏠 내부"]
            direction TB
            CS["CS System<br/><small>고객·구독 관리</small>"]
            ERP["위하고 ERP<br/><small>매출·재무</small>"]
            ADMIN["홈페이지 Admin<br/><small>원고 수집·교정 배분</small>"]
            CMS["CMS<br/><small>발행 아카이브·검색</small>"]
            NAS["NAS<br/><small>원고·이미지</small>"]
        end
        subgraph SYS_EXT["🌐 외부"]
            direction TB
            NICE["나이스페이<br/><small>결제</small>"]
            PLAY["Playauto<br/><small>외부몰 연동</small>"]
            KORYO["고려출판물류<br/><small>단행본 출고</small>"]
            POST["우체국<br/><small>배송</small>"]
            CJ["CJ대한통운<br/><small>배송</small>"]
            BANK["신한뱅크<br/><small>입출금</small>"]
    CTI["CTI<br/><small>[주의] 중단</small>"]
            LG["LG유플러스<br/><small>인바운드</small>"]
        end
    end

    %% ── 업무 레이어 (우측 컬럼) ──
    subgraph PROC["📋 업무"]
        direction TB
        P_SUB["정기구독 관리<br/><small>가입·해지·배송·결제</small>"]
        P_SALES["단행본 영업<br/><small>출고·입금·재고</small>"]
        P_MGMT["경영관리<br/><small>매출대사·입출금·급여</small>"]
        P_EDIT["콘텐츠 제작<br/><small>원고수집·편집·발행</small>"]
        P_CALL["고객상담<br/><small>인바운드·아웃바운드</small>"]
    end

    %% ── 조직 → 시스템 ──
    SUB --> CS
    SUB --> ERP
    SUB --> NICE
    SUB --> PLAY
    SUB --> POST
    SUB --> CJ

    SALES --> CS
    SALES --> ERP
    SALES --> KORYO
    SALES --> CJ

    MGMT --> CS
    MGMT --> ERP
    MGMT --> BANK

    EDIT --> ADMIN
    EDIT --> CMS
    EDIT --> NAS

    CALL --> CS
    CALL --> CTI
    CALL --> LG

    %% ── 시스템 → 업무 ──
    CS -.-> P_SUB
    PLAY -.-> P_SUB
    KORYO -.-> P_SALES
    ERP -.-> P_MGMT
    ADMIN -.-> P_EDIT
    CS -.-> P_CALL

    %% ── 내부 시스템 간 연동 ──
    CS <-->|"동기화"| ERP
    ADMIN -->|"발행"| CMS

    %% ── 스타일 ──
    style ORG fill:#dbeafe,stroke:#3b82f6,stroke-width:2px
    style SYS fill:#fefce8,stroke:#eab308,stroke-width:2px
    style SYS_INT fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style SYS_EXT fill:#fff7ed,stroke:#f97316,stroke-width:2px,stroke-dasharray: 5 5
    style PROC fill:#d1fae5,stroke:#10b981,stroke-width:2px
    style CTI fill:#fee2e2,stroke:#ef4444,stroke-width:2px,stroke-dasharray: 5 5
```

---

## 2. 팀별 조감도

각 팀이 사용하는 시스템과 수행하는 업무만 추출한 개별 뷰입니다.

### 2-1. 정기구독팀

```mermaid
flowchart LR
    subgraph SYS_INT["🏠 내부"]
        CS["CS System<br/><small>고객·구독 관리</small>"]
        ERP["위하고 ERP<br/><small>매출·재무</small>"]
        CS <-->|"동기화"| ERP
    end
    subgraph SYS_EXT["🌐 외부"]
        NICE["나이스페이<br/><small>결제</small>"]
        POST["우체국<br/><small>배송</small>"]
        CJ["CJ대한통운<br/><small>배송</small>"]
        PLAY["Playauto<br/><small>외부몰 연동</small>"]
    end

    P1(("①"))
    P2(("②"))
    P3(("③"))
    P4(("④"))
    P5(("⑤"))

    %% 업무 → 시스템 (업무 결과가 시스템에 반영)
    PLAY -->|"Excel"| P1
    P1 -->|"입력"| CS
    P2 -->|"삭제"| CS
    POST <-->|"엑셀"| P3
    CJ <-->|"엑셀"| P3
    P3 -->|"반영"| ERP
    NICE -->|"승인"| P4
    P4 -->|"매출"| ERP
    P5 -->|"처리"| CS

    style SYS_INT fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style SYS_EXT fill:#fff7ed,stroke:#f97316,stroke-width:2px,stroke-dasharray: 5 5
    style P1 fill:#fee2e2,stroke:#dc2626,stroke-width:2px
    style P2 fill:#fee2e2,stroke:#dc2626,stroke-width:2px
    style P3 fill:#fee2e2,stroke:#dc2626,stroke-width:2px
    style P4 fill:#dcfce7,stroke:#16a34a,stroke-width:2px
    style P5 fill:#dcfce7,stroke:#16a34a,stroke-width:2px
```

<small>병목 업무 · 일반 업무</small>

| 업무 | 설명 |
|:---:|:---|
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#fee2e2;border:2px solid #dc2626;border-radius:50%;font-weight:700;color:#991b1b;">①</span> | 신규 가입접수: Playauto(외부몰) Excel → CS 수기입력 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#fee2e2;border:2px solid #dc2626;border-radius:50%;font-weight:700;color:#991b1b;">②</span> | 구독 해지 → CS 수기삭제 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#fee2e2;border:2px solid #dc2626;border-radius:50%;font-weight:700;color:#991b1b;">③</span> | 배송 관리: 우체국·CJ ↔ 엑셀 매칭 → ERP 반영 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">④</span> | 결제·입금: 나이스페이 승인 → ERP 매출 전송 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">⑤</span> | 선물·재발송 → CS 처리 |

### 2-2. 영업추진팀

```mermaid
flowchart LR
    subgraph SYS_INT["🏠 내부"]
        CS["CS System<br/><small>카드결제만</small>"]
        ERP["위하고 ERP<br/><small>주력·재고</small>"]
    end
    subgraph SYS_EXT["🌐 외부"]
        KORYO["고려출판물류<br/><small>단행본 출고</small>"]
        CJ["CJ대한통운<br/><small>배송</small>"]
    end

    P1(("①"))
    P2(("②"))
    P3(("③"))
    P4(("④"))

    %% 업무 → 시스템
    KORYO -->|"출고"| P1
    P1 -->|"이중입력"| ERP
    P2 -->|"삼중입력"| ERP
    P3 -->|"대조"| ERP
    P4 -->|"결제"| CS
    ERP -->|"출고지시"| CJ

    style SYS_INT fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style SYS_EXT fill:#fff7ed,stroke:#f97316,stroke-width:2px,stroke-dasharray: 5 5
    style P1 fill:#fee2e2,stroke:#dc2626,stroke-width:2px
    style P2 fill:#fee2e2,stroke:#dc2626,stroke-width:2px
    style P3 fill:#fee2e2,stroke:#dc2626,stroke-width:2px
    style P4 fill:#fef9c3,stroke:#ca8a04,stroke-width:2px
```

<small>병목 업무 · 주의 업무</small>

| 업무 | 설명 |
|:---:|:---|
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#fee2e2;border:2px solid #dc2626;border-radius:50%;font-weight:700;color:#991b1b;">①</span> | 단행본 출고: 고려출판물류 → ERP 이중입력 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#fee2e2;border:2px solid #dc2626;border-radius:50%;font-weight:700;color:#991b1b;">②</span> | 입금 관리: 엑셀 → 관리 → 위하고 삼중입력 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#fee2e2;border:2px solid #dc2626;border-radius:50%;font-weight:700;color:#991b1b;">③</span> | 재고 관리: 통장내역 수작업 대조 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#fef9c3;border:2px solid #ca8a04;border-radius:50%;font-weight:700;color:#854d0e;">④</span> | 다량특판: 개인엑셀 관리 → CS 카드결제 |

### 2-3. 경영지원팀

```mermaid
flowchart LR
    subgraph SYS_INT["🏠 내부"]
        CS["CS System<br/><small>매출·정산</small>"]
        ERP["위하고 ERP<br/><small>회계·급여</small>"]
        CS <-->|"대사"| ERP
    end
    subgraph SYS_EXT["🌐 외부"]
        BANK["신한 인사이트 뱅크<br/><small>입출금 조회</small>"]
    end

    P1(("①"))
    P2(("②"))
    P3(("③"))
    P4(("④"))

    %% 업무 → 시스템
    CS <-->|"수기"| P1
    P1 <-->|"수기"| ERP
    BANK -->|"엑셀"| P2
    P2 -->|"입력"| CS
    P3 -->|"산출"| ERP
    P4 -->|"관리"| CS

    style SYS_INT fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style SYS_EXT fill:#fff7ed,stroke:#f97316,stroke-width:2px,stroke-dasharray: 5 5
    style P1 fill:#fee2e2,stroke:#dc2626,stroke-width:2px
    style P2 fill:#fee2e2,stroke:#dc2626,stroke-width:2px
    style P3 fill:#fef9c3,stroke:#ca8a04,stroke-width:2px
    style P4 fill:#dcfce7,stroke:#16a34a,stroke-width:2px
```

<small>병목 업무 · 주의 업무 · 일반 업무</small>

| 업무 | 설명 |
|:---:|:---|
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#fee2e2;border:2px solid #dc2626;border-radius:50%;font-weight:700;color:#991b1b;">①</span> | 매출 관리: CS ↔ ERP 수기 대사 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#fee2e2;border:2px solid #dc2626;border-radius:50%;font-weight:700;color:#991b1b;">②</span> | 입출금 확인: 신한뱅크 → 엑셀 → CS 수기입력 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#fef9c3;border:2px solid #ca8a04;border-radius:50%;font-weight:700;color:#854d0e;">③</span> | 급여 산출: ERP 수기 산출 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">④</span> | 선수수익 관리 → CS |

### 2-4. 편집실 (월간지 + 단행본)

```mermaid
flowchart LR
    subgraph SYS_INT["🏠 내부"]
        ADMIN["홈페이지 Admin<br/><small>원고 수집·교정 배분</small>"]
        CMS["CMS<br/><small>발행 아카이브·검색</small>"]
        NAS["NAS<br/><small>원고·이미지 저장</small>"]
        ADMIN -->|"발행"| CMS
    end

    P1(("①"))
    P2(("②"))
    P3(("③"))

    %% 업무 → 시스템
    P1 -->|"수집"| ADMIN
    ADMIN -->|"배분"| P2
    NAS <-->|"원고"| P2
    P2 -->|"완료"| P3
    P3 -->|"아카이브"| CMS

    style SYS_INT fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style P1 fill:#fef9c3,stroke:#ca8a04,stroke-width:2px
    style P2 fill:#fef9c3,stroke:#ca8a04,stroke-width:2px
    style P3 fill:#dcfce7,stroke:#16a34a,stroke-width:2px
```

<small>주의 업무 · 일반 업무</small>

| 업무 | 설명 |
|:---:|:---|
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#fef9c3;border:2px solid #ca8a04;border-radius:50%;font-weight:700;color:#854d0e;">①</span> | 원고 수집: 다양한 채널 → Admin 수집·배분 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#fef9c3;border:2px solid #ca8a04;border-radius:50%;font-weight:700;color:#854d0e;">②</span> | 편집·교정: Admin 배분 → NAS 작업 → 완료 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">③</span> | 발행·아카이브: 완료 콘텐츠 → CMS 아카이브·검색 |

### 2-5. 외주 콜센터 (더아이앤오)

```mermaid
flowchart LR
    subgraph SYS_INT["🏠 내부"]
        CS["CS System<br/><small>VPN 접속</small>"]
    end
    subgraph SYS_EXT["🌐 외부"]
        CTI["서울정보시스템 CTI<br/><small>[주의] 중단</small>"]
        LG["LG유플러스<br/><small>인바운드</small>"]
        AUTO["오토콜<br/><small>아웃바운드</small>"]
    end

    P1(("①"))
    P2(("②"))
    P3(("③"))
    P4(("④"))

    %% 업무 → 시스템
    LG -->|"인입"| P1
    CTI -.->|"중단"| P1
    P1 -->|"수기검색"| CS
    AUTO -->|"발신"| P2
    P2 --> CS
    P3 -->|"이중기록"| CS
    LG -->|"데이터"| P4

    style SYS_INT fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style SYS_EXT fill:#fff7ed,stroke:#f97316,stroke-width:2px,stroke-dasharray: 5 5
    style CTI fill:#fee2e2,stroke:#ef4444,stroke-width:2px,stroke-dasharray: 5 5
    style P1 fill:#fee2e2,stroke:#dc2626,stroke-width:2px
    style P2 fill:#dcfce7,stroke:#16a34a,stroke-width:2px
    style P3 fill:#fef9c3,stroke:#ca8a04,stroke-width:2px
    style P4 fill:#dcfce7,stroke:#16a34a,stroke-width:2px
```

<small>병목 업무 · 주의 업무 · 일반 업무</small>

| 업무 | 설명 |
|:---:|:---|
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#fee2e2;border:2px solid #dc2626;border-radius:50%;font-weight:700;color:#991b1b;">①</span> | 인바운드 상담: CTI 중단 → CS 수기 번호 검색 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">②</span> | 아웃바운드 콜: 오토콜 → 구독만료·연장 안내 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#fef9c3;border:2px solid #ca8a04;border-radius:50%;font-weight:700;color:#854d0e;">③</span> | 상담 이력 기록: CS + 엑셀 이중기록 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">④</span> | 리포트 작성: 데일리·위클리·먼슬리 |

---

## 3. 시스템 간 연동 관계

내부 시스템과 외부 시스템 간의 데이터 흐름을 보여줍니다.

```mermaid
flowchart LR
    subgraph INTERNAL["🏠 내부"]
        CS["CS System<br/><small>고객·구독 관리</small>"]
        ERP["위하고 ERP<br/><small>매출·재무</small>"]
        ADMIN["홈페이지 Admin<br/><small>원고 수집·배분</small>"]
        CMS["CMS<br/><small>발행 아카이브</small>"]
        NAS["NAS<br/><small>원고·이미지</small>"]
    end

    subgraph EXTERNAL["🌐 외부"]
        NICE["나이스페이<br/><small>결제</small>"]
        PLAY["Playauto<br/><small>외부몰</small>"]
        KORYO["고려출판물류<br/><small>단행본</small>"]
        POST["우체국<br/><small>배송</small>"]
        CJ["CJ대한통운<br/><small>배송</small>"]
        BANK["신한뱅크<br/><small>입출금</small>"]
        LG["LG유플러스<br/><small>인바운드</small>"]
        CTI["CTI<br/><small>[중단]</small>"]
    end

    %% CS System 연동
    NICE -->|"결제 승인"| CS
    PLAY -->|"주문 Excel"| CS
    CS -->|"배송 접수"| POST
    CS -->|"배송 접수"| CJ
    CS <-->|"동기화"| ERP

    %% ERP 연동
    ERP <-->|"입출금"| BANK
    KORYO -->|"출고"| ERP
    KORYO -->|"출고"| CJ

    %% 콘텐츠 시스템 연동
    NAS <-->|"원고"| ADMIN
    ADMIN -->|"발행"| CMS

    %% 콜센터 연동
    LG -->|"인입"| CS
    CTI -.->|"중단"| CS

    style INTERNAL fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style EXTERNAL fill:#fff7ed,stroke:#f97316,stroke-width:2px,stroke-dasharray: 5 5
    style CTI fill:#fee2e2,stroke:#ef4444,stroke-width:2px,stroke-dasharray: 5 5
```

---

## 4. 데이터베이스 구조 개요

CS System의 MSSQL 2008 데이터베이스 구성을 보여줍니다.

```mermaid
flowchart TB
    subgraph DB["📦 MSSQL 2008"]
        subgraph CS_DB["CS 데이터베이스 — 75 tables"]
            T_MEM["회원<br/><small>구독·결제이력</small>"]
            T_ORD["주문<br/><small>배송·반품</small>"]
            T_PRD["상품<br/><small>월간지·단행본</small>"]
            T_FIN["정산<br/><small>매출·입금</small>"]
            T_CS["상담<br/><small>인바운드·OB</small>"]
        end
        subgraph WEB_DB["웹 데이터베이스 — 76 tables"]
            T_CMS["CMS<br/><small>기사·태그</small>"]
            T_SITE["사이트<br/><small>회원·게시판</small>"]
            T_ADMIN["어드민<br/><small>권한·로그</small>"]
        end
    end

    T_MEM <-->|"회원"| T_SITE
    T_ORD <-->|"주문"| T_SITE
    T_PRD -->|"상품"| T_CMS

    NOTE["[주의] 56건 Stored Procedure"]

    style DB fill:#f5f3ff,stroke:#7c3aed,stroke-width:2px
    style CS_DB fill:#ede9fe,stroke:#8b5cf6
    style WEB_DB fill:#e0e7ff,stroke:#6366f1
    style NOTE fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
```

---

## 범례

| 기호 | 의미 |
|:---:|:---|
| 상 | 병목 업무 (업무 지연·오류 발생) |
| 중 | 주의 업무 (비효율적이나 운영 가능) |
| 하 | 일반 업무 |
| `→` | 데이터 흐름 (일방향) |
| `<-->` | 데이터 동기화 (쌍방향) |
| `-.->` | 중단/미연동 |
| [주의] | 서비스 중단 또는 주의 필요 |
