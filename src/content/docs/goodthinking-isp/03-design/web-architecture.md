---
title: Web 시스템 아키텍처
description: 클라우드 기반 웹 시스템 아키텍처 설계
---

# Web 시스템 아키텍처

현행 On-Premise + AWS 이원화 시스템을 **통합 클라우드 웹 관리자 시스템**으로 전환하기 위한 아키텍처 설계

---

## 현행(AS-IS) → 목표(TO-BE) 전환 개요

### 현행 시스템 문제점

| 구분 | AS-IS | 문제점 |
|------|-------|--------|
| 관리 시스템 | XPlatform C/S (Tobesoft) | 윈도우 전용, 사내 PC에서만 접근, 유지보수 불가 (개발사 폐업) |
| 홈페이지 관리 | Node.js Admin (AWS) | C/S와 데이터 분리, 수동 Excel 이관 |
| 데이터베이스 | On-Prem MSSQL (75t) + AWS MSSQL (63t) | 이원화, 실시간 연동 없음, CMS 별도 13t |
| 외부 주문 | Playauto → 네이버/쿠팡 | 주문 수집 후 C/S에 수동 입력 |
| 네트워크 | MikroTik VPN (PPTP) | 취약 프로토콜, 외부 근무 불가 |

### 전환 방향

```
┌─ AS-IS ──────────────────────────────┐     ┌─ TO-BE ─────────────────────────────┐
│                                      │     │                                     │
│  [On-Prem]          [AWS]            │     │  [AWS 클라우드 통합]                   │
│  ┌──────────┐   ┌──────────┐         │     │  ┌───────────────────────────────┐   │
│  │ XPlatform│   │ Node.js  │         │     │  │   통합 웹 관리자 시스템         │   │
│  │   C/S    │   │  Admin   │         │     │  │  (고객·구독·주문·배송·CS·정산)  │   │
│  └────┬─────┘   └────┬─────┘         │     │  └───────────────┬───────────────┘   │
│       │              │               │     │                  │                   │
│  ┌────┴─────┐   ┌────┴─────┐         │     │  ┌───────────────┴───────────────┐   │
│  │  MSSQL   │   │  MSSQL   │         │ ──▶ │  │       통합 Database           │   │
│  │ 고객관리 │   │ 홈페이지 │         │     │  │    (MSSQL → 단일 스키마)       │   │
│  │  75 t    │   │  63 t    │         │     │  │        ~100 tables            │   │
│  └──────────┘   └──────────┘         │     │  └───────────────────────────────┘   │
│       ×              ×               │     │          │                           │
│  (연동 없음, 수동 Excel 이관)          │     │  ┌───────┴───────────────────────┐   │
│                                      │     │  │      외부 연동 API 레이어       │   │
│  [외부]                               │     │  │  나이스페이·CJ·네이버·쿠팡     │   │
│  Playauto → 네이버/쿠팡 (수동 입력)    │     │  │  이카운트·CTI·Playauto        │   │
│  이카운트 ERP (수동 전표)              │     │  └───────────────────────────────┘   │
│                                      │     │                                     │
└──────────────────────────────────────┘     └─────────────────────────────────────┘
```

**핵심 전환 포인트**:
1. C/S 데스크톱 앱 → **웹 브라우저 기반** (장소·OS 무관 접근)
2. On-Prem + AWS DB 이원화 → **AWS 단일 DB 통합** (실시간 정합성)
3. 수동 Excel 이관 → **API 기반 자동 연동**
4. Playauto 수동 입력 → **외부몰 주문 자동 수집**
5. PPTP VPN → **HTTPS + WAF** (보안 강화, 외부 근무 가능)

---

## TO-BE 시스템 구성도

```
┌─ 사용자 레이어 ──────────────────────────────────────────────────────────┐
│  정기구독팀       영업추진팀       경영지원팀       편집실/앵두아트        │
│  (정황규,어은진)  (이성수,권지은)  (송윤경,김나현)  (정다정 연구소장)      │
│  + 외부콜센터     + CEO                                                  │
│  (더아이앤오 4명)                                                         │
│                                                                          │
│  [웹 브라우저]  ────────  HTTPS  ────────  [모바일 브라우저]               │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │
                             ▼
┌─ CDN / WAF ──────────────────────────────────────────────────────────────┐
│  AWS CloudFront + AWS WAF                                                │
│  - 정적 자산 캐싱 (SPA bundle, 이미지)                                    │
│  - DDoS 방어, IP 제한, Rate Limiting                                     │
│  - SSL/TLS 종단                                                          │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │
                             ▼
┌─ 웹 애플리케이션 레이어 (AWS ECS or EC2) ────────────────────────────────┐
│                                                                          │
│  ┌─ 프론트엔드 (SPA) ────────────────────────────────────────────┐       │
│  │  통합 웹 관리자 시스템                                         │       │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │       │
│  │  │ 대시보드 │ │ 고객관리 │ │ 구독관리 │ │ 배송관리 │         │       │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │       │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │       │
│  │  │ 주문관리 │ │ CS/상담  │ │ 정산/재무│ │ 콘텐츠   │         │       │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │       │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                      │       │
│  │  │ 선물관리 │ │ 재고/도서│ │ 시스템   │                      │       │
│  │  └──────────┘ └──────────┘ └──────────┘                      │       │
│  └───────────────────────────────────────────────────────────────┘       │
│                                                                          │
│  ┌─ 홈페이지 (SPA) ─────────────────────────────────────────────┐       │
│  │  고객향 자사몰 (구독신청, 상품구매, 마이페이지)                  │       │
│  └───────────────────────────────────────────────────────────────┘       │
│                                                                          │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │
                             ▼
┌─ API 서버 레이어 (AWS ECS or EC2) ───────────────────────────────────────┐
│                                                                          │
│  ┌─ API Gateway / Reverse Proxy (Nginx or ALB) ──────────────────┐      │
│  │  인증/인가(JWT) │ 라우팅 │ Rate Limiting │ 요청 로깅           │      │
│  └───────────────────────────┬───────────────────────────────────┘      │
│                              │                                           │
│  ┌─ 비즈니스 API 서비스 ─────┴───────────────────────────────────┐      │
│  │                                                                │      │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐  │      │
│  │  │ 고객 API   │ │ 구독 API   │ │ 주문 API   │ │ 배송 API   │  │      │
│  │  │ Customer   │ │ Subscribe  │ │ Order      │ │ Shipping   │  │      │
│  │  │ Receiver   │ │ Finance    │ │ HomepageOrd│ │ CJ택배     │  │      │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘  │      │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐  │      │
│  │  │ CS API     │ │ 정산 API   │ │ 콘텐츠 API │ │ 선물 API   │  │      │
│  │  │ Councel    │ │ Settlement │ │ CMS        │ │ Gift       │  │      │
│  │  │ Promise    │ │ DeferIncome│ │ ptcms_*    │ │ GiftStock  │  │      │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘  │      │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐                 │      │
│  │  │ 재고 API   │ │ 알림 API   │ │ 시스템 API │                 │      │
│  │  │ Stock/Book │ │ SMS/이메일 │ │ Auth/Menu  │                 │      │
│  │  └────────────┘ └────────────┘ └────────────┘                 │      │
│  └────────────────────────────────────────────────────────────────┘      │
│                                                                          │
│  ┌─ 배치/스케줄러 ───────────────────────────────────────────────┐      │
│  │  월간지 발송 데이터 생성 │ 지로 생성 │ 이연수익 계산           │      │
│  │  외부몰 주문 수집 │ 미입금 알림 │ 데이터 모니터링             │      │
│  └───────────────────────────────────────────────────────────────┘      │
│                                                                          │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │
                             ▼
┌─ 데이터 레이어 ──────────────────────────────────────────────────────────┐
│                                                                          │
│  ┌─ Primary Database ────────────────┐  ┌─ 캐시/세션 ──────────────┐    │
│  │  MSSQL (AWS RDS)                  │  │  Redis (ElastiCache)     │    │
│  │  통합 스키마 ~100 tables          │  │  - 세션 저장             │    │
│  │  - 고객/구독/배송 (C/S 75t 이관)  │  │  - 빈번 조회 캐시       │    │
│  │  - 홈페이지 주문/상품 (63t 정리)   │  │  - Rate Limit 카운터    │    │
│  │  - CMS 콘텐츠 (13t)              │  └─────────────────────────┘    │
│  │  - SP → API 로직 전환            │                                  │
│  │  - Trigger → 이벤트 핸들러 전환   │  ┌─ 파일 스토리지 ──────────┐    │
│  └───────────────────────────────────┘  │  S3                      │    │
│                                          │  - 도서 이미지           │    │
│                                          │  - CMS 콘텐츠 파일      │    │
│                                          │  - 발송 데이터 백업      │    │
│                                          └─────────────────────────┘    │
│                                                                          │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │
                             ▼
┌─ 외부 연동 레이어 ───────────────────────────────────────────────────────┐
│                                                                          │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐            │
│  │ 나이스페이 │ │ CJ대한통운 │ │ Playauto   │ │ 이카운트   │            │
│  │ PG 결제    │ │ 배송추적   │ │ 외부몰     │ │ ERP 전표   │            │
│  │ 가상계좌   │ │ 송장 연동  │ │ 주문수집   │ │ (API 연동) │            │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘            │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                            │
│  │서울정보시스템│ │ SMS/알림톡│ │ 우편 발송  │                            │
│  │ CTI 연동   │ │ (비즈엠 등)│ │ (지로/DM)  │                            │
│  └────────────┘ └────────────┘ └────────────┘                            │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 기술 스택 권장안

:::note[설계 원칙]
좋은생각사람들은 직원 약 15명, 동시 사용자 약 10~15명 규모의 소규모 조직입니다. **과도한 인프라 복잡도를 피하고**, 개발·운영 인력 최소화에 적합한 기술 스택을 권장합니다.
:::

### Frontend

| 구분 | 권장 기술 | 선정 근거 |
|------|-----------|-----------|
| Framework | **React 18+** 또는 **Next.js (App Router)** | 국내 개발 인력풀 풍부, 관리자 UI 생태계 성숙 |
| UI Library | **Ant Design 5** | 관리자 시스템에 특화 (테이블, 폼, 필터 등 풍부한 컴포넌트) |
| State Management | **TanStack Query (React Query)** | 서버 상태 관리 중심 (관리자 시스템 특성상 서버 데이터 의존도 높음) |
| Build Tool | **Vite** | 빠른 HMR, 가벼운 빌드 |
| 홈페이지 | **Next.js (SSR/SSG)** | SEO 필요 (상품 페이지, 콘텐츠), 관리자와 코드베이스 분리 |

### Backend

| 구분 | 권장 기술 | 선정 근거 |
|------|-----------|-----------|
| Framework | **NestJS (Node.js)** | TypeScript 기반, 모듈 구조로 도메인 분리 용이, 현행 Node.js Admin과 언어 통일 |
| API 스타일 | **RESTful API** + OpenAPI (Swagger) | RFP 기능 명세와 1:1 매핑, 프론트엔드 코드 자동 생성 가능 |
| ORM | **TypeORM** 또는 **Prisma** | MSSQL 드라이버 지원, 타입 안전성 |
| Authentication | **JWT (Access + Refresh)** | 현행 PT_Account 테이블 기반 사용자 인증 전환 |
| 배치 처리 | **NestJS Schedule (@nestjs/schedule)** 또는 **BullMQ** | 월간지 발송, 지로 생성, 이연수익 계산, 외부몰 주문 수집 등 현행 SP 대체 |

**NestJS 선정 근거 상세**:
- 현행 AWS Admin이 Node.js 기반 → 동일 언어 스택으로 학습 곡선 최소화
- 모듈 구조가 도메인 분리에 적합 (고객 모듈, 구독 모듈, 배송 모듈 등)
- TypeScript 기반으로 151개 테이블의 엔티티 타입 안전성 확보
- 소규모 팀(개발자 2~3명)으로도 운영 가능한 모놀리식 구조 지원
- MSA 필요 시 점진적 분리 가능 (NestJS 마이크로서비스 패턴)

### Database

| 구분 | 권장 기술 | 선정 근거 |
|------|-----------|-----------|
| Primary DB | **MSSQL (AWS RDS for SQL Server)** | 아래 트레이드오프 분석 참조 |
| Cache | **Redis (ElastiCache)** | 세션, 빈번 조회 캐시, Rate Limit |
| File Storage | **AWS S3** | 도서 이미지, CMS 콘텐츠, 발송 데이터 백업 |

#### Database 선택: MSSQL 유지 vs PostgreSQL 전환

| 평가 항목 | MSSQL 유지 (권장) | PostgreSQL 전환 |
|-----------|:-:|:-:|
| **데이터 이관 리스크** | ✅ 낮음 — 동일 엔진, 스키마 변환 불필요 | ⚠️ 높음 — 데이터 타입 변환 (decimal, datetime 등), SP/함수 전면 재작성 |
| **현행 로직 전환** | ✅ 20 SP + 14 Function 일부 재활용 가능 | ❌ T-SQL → PL/pgSQL 전면 재작성 (49개 비즈니스 로직) |
| **이관 기간** | ✅ 4~6주 | ⚠️ 8~12주 (SP/Trigger 변환 추가) |
| **AWS RDS 비용** | ⚠️ 라이선스 포함 → 월 ~$200~400 (db.r5.large) | ✅ 무료 엔진 → 월 ~$100~200 (동급 사양) |
| **장기 비용 (5년)** | ⚠️ 라이선스 누적 ~$12K~24K | ✅ 절감 ~$6K~12K |
| **운영 인력** | ✅ 현행 DBA 지식 활용 가능 | ⚠️ PostgreSQL 운영 경험 필요 |
| **ORM 호환성** | ✅ TypeORM/Prisma MSSQL 지원 | ✅ TypeORM/Prisma 최우선 지원 |
| **확장성/커뮤니티** | 보통 | ✅ 오픈소스, 활발한 커뮤니티 |

:::tip[권장안]
**1단계**: MSSQL 유지로 이관 리스크 최소화 (프로젝트 일정 준수 우선)  
**2단계**: 안정화 후 PostgreSQL 전환 검토 (비용 절감 목적, 12~18개월 후)  

현행 49개 비즈니스 로직(20 SP + 14 Function + 15 Trigger)을 **API 레이어로 이전**하는 것이 핵심이므로, DB 엔진 변경은 부차적 의사결정입니다. API 레이어 이전이 완료되면 DB 종속성이 크게 줄어들어 향후 전환이 용이합니다.
:::

### Infrastructure

| 구분 | 권장 기술 | 선정 근거 |
|------|-----------|-----------|
| Cloud | **AWS** (현행 유지) | 이미 AWS에 홈페이지·MSSQL 운영 중, 인프라 이전 불필요 |
| 컴퓨팅 | **AWS ECS (Fargate)** 또는 **EC2 (t3.medium~large)** | ECS Fargate: 컨테이너 관리 간소화 / EC2: 비용 효율 (예약 인스턴스) |
| 컨테이너 | **Docker + Docker Compose** | K8s 불필요 — 동시 사용자 10~15명 규모에 오버 엔지니어링 |
| CI/CD | **GitHub Actions** | 코드 리포지토리 + CI/CD 통합, 무료 티어 충분 |
| 모니터링 | **AWS CloudWatch** + **Sentry** | 인프라 메트릭 + 애플리케이션 에러 추적 |
| SSL | **AWS ACM (Certificate Manager)** | 무료 SSL 인증서, ALB 연동 자동 갱신 |
| DNS | **AWS Route 53** | 기존 도메인 관리 통합 |

:::caution[K8s(EKS) 미권장 근거]
좋은생각사람들 규모(직원 15명, 동시 사용자 10~15명)에서 Kubernetes는 **운영 복잡도 대비 이점이 없습니다**.
- EKS 클러스터 자체 비용: 월 ~$73 (제어 플레인)
- K8s 운영을 위한 DevOps 인력 필요
- Docker Compose 또는 ECS Fargate로 동일한 컨테이너 이점 확보 가능
- 향후 트래픽 증가 시(월간 방문자 10만+ 등) 재검토 가능
:::

---

## 웹 관리자 모듈 구성

현행 C/S 시스템(XPlatform) 기능을 웹 관리자 모듈로 매핑합니다.

### 모듈 — 현행 매핑표

| No | TO-BE 모듈 | 현행 C/S 기능 | 관련 DB 테이블 | 관련 SP/Logic | 사용 팀 |
|:--:|-----------|-------------|---------------|-------------|---------|
| 1 | **대시보드** | (신규) | 전체 집계 | func_dailySendCount/Amount 등 | 전체 |
| 2 | **고객 관리** | 고객 등록/조회/수정, 고객 병합, 그룹 관리 | PT_Customer, PT_Company, PT_Group, PT_Nation | sp_PT_CustomerMerge | 정기구독팀, 영업추진팀 |
| 3 | **구독 관리** | 정기구독 등록/해지/변경, 수신자 관리 | PT_Subscribe, PT_Receiver, PT_Book, PT_BookPrice | sp_PT_SubscribeCreate/Cancel, func_CalcSubscribePeriod | 정기구독팀 |
| 4 | **주문 관리** | 단행본/선물 주문, 홈페이지 주문, 외부몰 주문 | PT_Finance, 홈페이지 주문 12t | sp_PT_FinanceCreate/Refund | 정기구독팀, 영업추진팀 |
| 5 | **배송 관리** | 월간지 발송, DM 발송, 택배 송장, 반송 처리 | PT_RegularSend_Info, PT_SendHistory, PT_BookResend, PT_BookReturned | sp_PT_SendBookData, sp_PT_SendDMData | 정기구독팀 |
| 6 | **결제/정산** | 입금 확인, 가상계좌, 카드결제, 이연수익, 세금계산서 | PT_Deposit, PT_NicepayCreditcardIncome, PT_NicepayVirtualAccount, PT_DEFERINCOME_* | sp_PT_DeferIncomeCalc, sp_PT_NicepayProcess | 경영지원팀 |
| 7 | **CS/상담** | 상담 이력, 약속, 환불, 해지 | PT_Councel_History, PT_SalesCancel, PT_RefundRequest, PT_Promise | - | 정기구독팀, 외부콜센터 |
| 8 | **지로 관리** | 지로 생성/발송/수납/취소 | PT_Giro | sp_PT_GiroCreate/Update/Delete/Send/Recv/Cancel | 경영지원팀 |
| 9 | **선물 관리** | 선물 재고, 선물 발송, 쿠폰 | PT_GiftSend, PT_GiftStock, PT_GiftStockLogs, PT_Coupon | sp_PT_CouponCreate/Use | 영업추진팀 |
| 10 | **재고/도서** | 도서 관리, 재고 관리, 도서 가격 | PT_Book, PT_BookPrice, PT_Stock, PT_Stock_History, PT_Bundle | sp_PT_StockUpdate | 경영지원팀 |
| 11 | **콘텐츠(CMS)** | 콘텐츠 관리, 저작권, 작가, 키워드 | ptcms_contents, ptcms_copyright, ptcms_writer, ptcms_subject 등 13t | - | 편집실 |
| 12 | **시스템 관리** | 계정, 권한, 메뉴, 코드 관리, 로그 | PT_Account, PT_Auth, PT_Menu, PT_MENU_authority, PT_CodeMaster, PT_CodeDetail | - | 관리자 |

### 모듈 의존 관계

```
                    ┌──────────┐
                    │ 대시보드  │ ◀── 전체 모듈 집계
                    └──────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────┴─────┐   ┌─────┴─────┐   ┌──────┴──────┐
   │ 고객 관리 │   │ 재고/도서 │   │ 시스템 관리 │
   └────┬─────┘   └─────┬─────┘   └─────────────┘
        │               │
   ┌────┴─────┐         │
   │ 구독 관리 │─────────┘ (도서 참조)
   └────┬─────┘
        │
   ┌────┼────────────────┐
   │    │                │
┌──┴──┐ ┌┴──────┐  ┌────┴─────┐
│주문 │ │배송   │  │CS/상담   │
│관리 │ │관리   │  │          │
└──┬──┘ └───────┘  └──────────┘
   │
┌──┴───────┐  ┌──────────┐
│결제/정산 │  │지로 관리 │
└──────────┘  └──────────┘
```

---

## 외부 연동 레이어 상세

### 연동 대상 및 방식

| No | 외부 시스템 | 연동 방식 | 현행 상태 | TO-BE 연동 내용 |
|:--:|-----------|----------|----------|----------------|
| 1 | **나이스페이** | REST API (PG SDK) | ✅ 홈페이지에서 사용 중 | 카드결제, 가상계좌 발급/입금 통보, 현금영수증. 관리자에서 결제 상태 조회·취소·환불 API 통합 |
| 2 | **CJ대한통운** | REST API / SFTP | ✅ 홈페이지에서 사용 중 | 송장번호 연동, 배송상태 추적 Webhook, 반품 접수. 월간지 대량 발송 데이터 연동 |
| 3 | **Playauto** | REST API (주문수집) | ✅ 사용 중 (수동 입력) | 네이버 스마트스토어·쿠팡 주문 자동 수집 → 통합 DB 저장, 재고 차감 자동 처리 |
| 4 | **이카운트 ERP** | REST API (Open API) | ⚠️ 수동 전표 입력 | 매출전표, 입출금 데이터 자동 전송. 거래처·품목 마스터 동기화 |
| 5 | **서울정보시스템 (CTI)** | Socket / API | ✅ C/S에서 사용 중 | 인바운드 콜 팝업, 발신 클릭투콜, 통화이력 자동 저장. 웹 기반 CTI 연동 방식 확인 필요 |
| 6 | **SMS/알림톡** | REST API | ✅ 사용 중 | PT_SMSText/SMSHistory 기반 SMS 발송, 카카오 알림톡 추가 검토 (비즈엠 등) |
| 7 | **우편 발송** | 파일 기반 (CSV/Excel) | ✅ 사용 중 | 지로 OCR 데이터, DM 발송 목록 생성. 우체국 API 연동 검토 |

### 연동 아키텍처

```
┌─ 통합 웹 관리자 ─────────────────────────────────────────────────┐
│                                                                  │
│  ┌─ Integration Service Layer ────────────────────────────────┐  │
│  │                                                            │  │
│  │  ┌──────────────────┐   나이스페이 SDK 호출                 │  │
│  │  │ PaymentService   │──→ 결제/취소/환불/정산                │  │
│  │  └──────────────────┘                                      │  │
│  │                                                            │  │
│  │  ┌──────────────────┐   CJ API + SFTP                     │  │
│  │  │ ShippingService  │──→ 송장등록/배송추적/반품             │  │
│  │  └──────────────────┘                                      │  │
│  │                                                            │  │
│  │  ┌──────────────────┐   Playauto API (스케줄 폴링)         │  │
│  │  │ MarketplaceService│──→ 주문수집/재고동기화/발송처리      │  │
│  │  └──────────────────┘                                      │  │
│  │                                                            │  │
│  │  ┌──────────────────┐   이카운트 Open API                  │  │
│  │  │ ERPService       │──→ 전표전송/거래처동기화              │  │
│  │  └──────────────────┘                                      │  │
│  │                                                            │  │
│  │  ┌──────────────────┐   CTI Socket / WebSocket             │  │
│  │  │ CTIService       │──→ 콜팝업/클릭투콜/통화이력          │  │
│  │  └──────────────────┘                                      │  │
│  │                                                            │  │
│  │  ┌──────────────────┐   SMS API (비즈엠 등)                │  │
│  │  │ NotificationSvc  │──→ SMS/알림톡/이메일 발송             │  │
│  │  └──────────────────┘                                      │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

:::note[CTI 연동 확인 필요]
현행 서울정보시스템 CTI는 C/S 전용 ActiveX/OCX 기반일 가능성이 높습니다. 웹 기반 전환 시:
1. **WebSocket 기반 CTI** 지원 여부 → 서울정보시스템에 확인 필요
2. 미지원 시 **웹 CTI 솔루션 교체** 검토 (e.g., AWS Connect, Twilio 등)
3. 교체 시 외부콜센터(더아이앤오) 연동 방식도 변경 필요
:::

---

## 보안 정책

### 1. 인증 (Authentication)

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│ 로그인   │────▶│ 인증 서비스  │────▶│  JWT 발급     │
│ (ID/PW)  │     │ (PT_Account  │     │  Access Token │
└──────────┘     │  기반 검증)  │     │  Refresh Token│
                 └──────────────┘     └──────────────┘
```

| 항목 | 정책 | 현행 매핑 |
|------|------|----------|
| 인증 방식 | ID/Password + JWT | 현행 PT_Account 테이블 기반 |
| 역할 기반 | PT_Auth + PT_MENU_authority 기반 RBAC | 현행 메뉴별 버튼 권한 (PT_Button_authority) 유지 |
| 토큰 만료 | Access: 1시간, Refresh: 7일 | - |
| 비밀번호 | 8자 이상, 영문+숫자+특수문자, bcrypt 해싱 | 현행 PT_Account_History로 변경 이력 관리 |
| 세션 관리 | Redis 기반, 동시 로그인 제한 (선택) | - |
| 외부콜센터 | 별도 역할(CTI담당) + IP 제한 | 더아이앤오 4명 접속 |

### 2. 인가 (Authorization) — 현행 역할 매핑

| TO-BE 역할 | 현행 매핑 | 권한 범위 |
|-----------|----------|----------|
| 최고관리자 | CEO (정용철) | 전체 기능 + 시스템 설정 |
| 정기구독 관리자 | 정기구독팀 (정황규, 어은진) | 고객, 구독, 배송, CS, 지로 |
| 영업 관리자 | 영업추진팀 (이성수, 권지은) | 고객, 주문, 선물, 쿠폰 |
| 경영 관리자 | 경영지원팀 (송윤경, 김나현) | 정산, 재고, 도서, 재무 |
| 콘텐츠 관리자 | 편집실 (정다정 연구소장) | CMS 콘텐츠 관리 |
| CTI 담당 | 외부콜센터 (더아이앤오 4명) | CS 상담, 고객 조회 (읽기) |

### 3. 데이터 보안

| 항목 | 정책 | 비고 |
|------|------|------|
| 전송 암호화 | HTTPS (TLS 1.3) | CloudFront + ACM 자동 인증서 |
| 저장 암호화 | 개인정보 필드 AES-256 암호화 | 주민번호, 카드번호, 계좌번호 등 |
| DB 암호화 | RDS 스토리지 암호화 (AES-256) | AWS KMS 키 관리 |
| 접근 통제 | VPC + Security Group + IP 화이트리스트 | DB는 Private Subnet, 외부 직접 접근 차단 |
| 개인정보 | 개인정보보호법 준수 — 수집·이용·파기 정책 | PT_Customer 48개 컬럼 중 개인정보 식별·암호화 필요 |
| 접근 로그 | 모든 접근/변경 기록 (감사 로그) | 현행 PT_DataMonitoringLog 확장 |

### 4. 감사 로그

```sql
-- 감사 로그 테이블 (현행 PT_DataMonitoringLog 확장)
CREATE TABLE AuditLog (
    AuditLog_SQ      BIGINT IDENTITY(1,1) PRIMARY KEY,
    User_ID          VARCHAR(50)  NOT NULL,   -- PT_Account.Account_ID
    Action           VARCHAR(10)  NOT NULL,   -- CREATE, READ, UPDATE, DELETE
    Module           VARCHAR(50)  NOT NULL,   -- 모듈명 (Customer, Subscribe, ...)
    Resource_Table   VARCHAR(100),            -- 대상 테이블
    Resource_ID      VARCHAR(50),             -- 대상 레코드 PK
    Old_Value        NVARCHAR(MAX),           -- 변경 전 (JSON)
    New_Value        NVARCHAR(MAX),           -- 변경 후 (JSON)
    IP_Address       VARCHAR(45),
    User_Agent       NVARCHAR(500),
    Created_At       DATETIME2 DEFAULT GETDATE()
);

-- 인덱스
CREATE INDEX IX_AuditLog_User ON AuditLog(User_ID, Created_At DESC);
CREATE INDEX IX_AuditLog_Resource ON AuditLog(Module, Resource_Table, Created_At DESC);
```

### 5. 네트워크 보안 — 현행 대비 개선

| 구분 | AS-IS | TO-BE |
|------|-------|-------|
| 접근 방식 | MikroTik VPN (PPTP) | HTTPS + AWS WAF |
| 프로토콜 | PPTP (보안 취약) | TLS 1.3 |
| 방화벽 | 두루안 (On-Prem) | AWS WAF + Security Group |
| 외부 접근 | VPN 필수 → 사내에서만 | 웹 브라우저로 어디서나 접근 (IP 제한 선택) |
| DDoS 방어 | 없음 | AWS Shield (Standard 무료) |

---

## 화면 설계 (Wireframe)

### 주요 화면 목록

현행 XPlatform C/S 화면 기준으로 TO-BE 웹 화면을 도출합니다.

| No | 모듈 | 화면명 | 설명 | 현행 C/S 매핑 | 상태 |
|:--:|------|--------|------|-------------|:----:|
| 1 | 공통 | **대시보드** | 금일 발송건수, 미입금 현황, 구독 현황, 최근 CS, 외부몰 주문 요약 | (신규) | ⬜ |
| 2 | 고객 | **고객 목록** | 통합 고객 검색 (이름, 전화, 회사, 그룹별 필터) | 고객 조회 화면 | ⬜ |
| 3 | 고객 | **고객 상세** | 고객 기본정보, 구독 이력, 결제 이력, CS 이력, 수신자 목록 — 탭 구성 | 고객 등록/수정 | ⬜ |
| 4 | 구독 | **구독 목록** | 구독 현황 조회 (진행중/해지/만료별 필터) | 구독 관리 | ⬜ |
| 5 | 구독 | **구독 등록/변경** | 구독 신규 등록, 기간 변경, 수신자 변경, 도서 변경 | 구독 등록 | ⬜ |
| 6 | 배송 | **월간지 발송 관리** | 월별 발송 데이터 생성, 발송 목록, 발송 상태, 반송 처리 | 발송 관리 | ⬜ |
| 7 | 배송 | **DM/택배 발송** | DM 발송 목록 생성, 택배 송장 연동, 배송 추적 | DM발송, 택배 | ⬜ |
| 8 | 주문 | **주문 목록** | 다채널 주문 통합 조회 (자사몰, 네이버, 쿠팡 — 출처별 필터) | 주문 관리 | ⬜ |
| 9 | 주문 | **주문 상세** | 주문 상태 변경, 결제 정보, 배송 정보, 취소/환불 처리 | 주문 상세 | ⬜ |
| 10 | 결제 | **입금/정산 관리** | 입금 확인, 미입금 목록, 이연수익 현황, 세금계산서 관리 | 입금관리, 이연수익 | ⬜ |
| 11 | CS | **상담 목록** | CS 접수 목록, CTI 통화이력 연동, 처리 상태 | 상담 관리 | ⬜ |
| 12 | CS | **상담 상세** | 상담 내용 입력, 고객 정보 팝업, 약속 관리, 이전 이력 | 상담 등록 | ⬜ |
| 13 | 지로 | **지로 관리** | 지로 생성/발송/수납/취소, OCR 데이터 관리 | 지로 관리 | ⬜ |
| 14 | 선물 | **선물/쿠폰 관리** | 선물 재고, 선물 발송, 쿠폰 생성/사용 이력 | 선물 관리 | ⬜ |
| 15 | 재고 | **도서/재고 관리** | 도서 목록, 가격 관리, 재고 현황, 입출고 이력 | 도서 관리 | ⬜ |
| 16 | CMS | **콘텐츠 관리** | 월간지 콘텐츠 등록, 저작권 관리, 작가 관리 | CMS 관리 | ⬜ |
| 17 | 시스템 | **사용자/권한 관리** | 계정 관리, 역할별 메뉴/버튼 권한 설정 | 계정/권한 관리 | ⬜ |
| 18 | 시스템 | **코드 관리** | 공통 코드 관리 (CodeMaster/CodeDetail) | 코드 관리 | ⬜ |
| 19 | 공통 | **통계/리포트** | 매출 통계, 구독 통계, 발송 통계, 채널별 실적 | 각종 통계 화면 | ⬜ |

:::note
화면 상태 ⬜는 "RFP 기능 목록에 포함, 화면 설계는 구축 단계에서 수행"을 의미합니다. ISP 단계에서는 화면 목록 도출과 기능 매핑까지 수행합니다.
:::

---

## 비즈니스 로직 전환 전략

현행 DB 레벨 로직(SP, Trigger, Function)을 API 레이어로 전환하는 전략입니다.

### SP → API 전환 매핑

| 현행 SP | TO-BE API | 전환 방식 | 비고 |
|---------|----------|----------|------|
| sp_PT_SendBookData | POST /api/shipping/monthly-send | API 로직 전환 | 월간지 발송 데이터 생성 — 핵심 배치 |
| sp_PT_DataMonitoring | GET /api/system/monitoring | API 전환 + 스케줄러 | 데이터 정합성 모니터링 |
| sp_PT_GiroCreate/Update/Delete/Send/Recv/Cancel | /api/giro/* (CRUD) | API 전환 | 6개 SP → REST 엔드포인트 |
| sp_PT_CouponCreate/Use | /api/coupon/* | API 전환 | 쿠폰 생성/사용 |
| sp_PT_SubscribeCreate/Cancel | /api/subscribe/* | API 전환 | 구독 등록/해지 — 트랜잭션 중요 |
| sp_PT_FinanceCreate/Refund | /api/finance/* | API 전환 | 결제/환불 — 나이스페이 연동 |
| sp_PT_CustomerMerge | POST /api/customer/merge | API 전환 | 고객 병합 (중복 고객 통합) |
| sp_PT_DeferIncomeCalc | /api/settlement/defer-income | 배치 스케줄러 | 이연수익 계산 — 월 배치 |
| sp_PT_NicepayProcess | /api/payment/process | API 전환 | 나이스페이 결제 처리 |
| sp_PT_SendDMData | POST /api/shipping/dm-send | API 전환 | DM 발송 데이터 생성 |

### Trigger → 이벤트 핸들러 전환

| 현행 Trigger | TO-BE 이벤트 | 전환 방식 |
|-------------|-------------|----------|
| trg_Subscribe_Giro_Insert/Update/Delete | SubscribeService.afterCreate/Update/Delete → GiroService | 서비스 이벤트 | 
| trg_Subscribe_Count_Insert/Delete | SubscribeService → 구독 카운트 업데이트 | 서비스 로직 내장 |
| trg_GiftSend_Stock_Insert/Update/Delete | GiftService → StockService.adjustQuantity | 서비스 이벤트 |
| trg_Customer_Tel_Index | CustomerService → 전화번호 인덱스 자동 업데이트 | ORM 훅 |
| trg_Company_Stock_Group_Ins/Del | CompanyService → StockService | 서비스 이벤트 |
| trg_Finance_DeferIncome | FinanceService → DeferIncomeService.recalculate | 서비스 이벤트 |
| trg_Receiver_SendHistory | ReceiverService → SendHistoryService.log | 서비스 이벤트 |
| trg_Book_Price_Update | BookService → SubscribeService.recalcPrice | 서비스 이벤트 |
| trg_Deposit_Finance_Sync | DepositService → FinanceService.syncPayment | 서비스 이벤트 |

### Function → 유틸리티/서비스 메서드 전환

| 현행 Function | TO-BE 위치 | 용도 |
|-------------|----------|------|
| func_dailySendCount/Amount/Book | DashboardService | 대시보드 집계 |
| func_sendBookCount/Amount/No | ShippingService | 발송 통계 |
| func_GetNumeric | utils/format.ts | 숫자 추출 유틸리티 |
| func_GetCustomerByTel | CustomerService.findByPhone() | 전화번호 고객 검색 |
| func_CalcSubscribePeriod | SubscribeService.calcPeriod() | 구독 기간 계산 |
| func_CalcDeferIncome | DeferIncomeService.calculate() | 이연수익 계산 |
| func_GetReceiverCount | SubscribeService.getReceiverCount() | 수신자 수 조회 |
| func_GetFinanceSum | FinanceService.getSum() | 결제 합계 |
| func_CheckDuplicate | CustomerService.checkDuplicate() | 중복 고객 체크 |
| func_FormatDate | utils/date.ts | 날짜 포맷 유틸리티 |

---

## 배포 구성

### 환경 구성

| 환경 | 용도 | 인프라 | URL (예시) |
|------|------|--------|-----------|
| Development | 개발·테스트 | Docker Compose (로컬 또는 EC2 1대) | dev-admin.goodthinking.or.kr |
| Staging | 검증·UAT | EC2 or ECS (운영과 동일 구성, 소규모) | stg-admin.goodthinking.or.kr |
| Production | 운영 | ECS Fargate 또는 EC2 (t3.large) | admin.goodthinking.or.kr |

### 배포 흐름

```
  개발자 Push                GitHub Actions                  AWS
  ──────────    ──────────────────────────    ─────────────────────
                                              
  git push ──▶ ① Lint + Type Check
              ② Unit Test
              ③ Docker Build
              ④ ECR Push ───────────────▶ ECR (이미지 저장)
              ⑤ ECS Deploy ─────────────▶ ECS Service 업데이트
                                          (Rolling Update)
              ⑥ Health Check ◀──────────  /api/health 응답 확인
              ⑦ Slack 알림                 
```

---

## 작성 이력

| 날짜 | 작성자 | 변경 내용 |
|------|--------|----------|
| 2026-02-24 | ISP팀 | 초안 작성 — 일반적 아키텍처 구조 |
| 2026-03-03 | ISP팀 | 현행 시스템 분석 기반 전면 개편 — AS-IS→TO-BE 전환 경로 구체화, 기술 스택 권장안(NestJS+React+MSSQL), DB 선택 트레이드오프 분석, 12개 모듈 매핑(현행 75t+63t+13t), 화면 목록 7→19개 확장, 외부 연동 7건 상세화, 비즈니스 로직 전환 전략(49개 SP/Trigger/Function→API), 보안 정책 현행 매핑, 배포 구성 추가 |
