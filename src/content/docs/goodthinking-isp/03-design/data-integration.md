---
title: 데이터 통합 모델
description: 통합 DB 스키마(ERD) 설계
---

# 데이터 통합 모델

외부 채널 데이터를 포용하는 통합 DB 스키마(ERD) 설계

---

## 데이터 통합 전략

### AS-IS → TO-BE 전환

```
AS-IS: 분산된 데이터                    TO-BE: 통합 데이터
┌──────────┐                           ┌──────────────────┐
│CS 고객관리│                           │                  │
│  DB      │──┐                        │   통합 DB        │
│(MSSQL 75t)│  │                        │   (PostgreSQL    │
└──────────┘  │                        │    또는 MSSQL)   │
              │    ┌────────────┐      │                  │
┌──────────┐  ├───▶│ ETL/동기화 │────▶│  • 고객 마스터   │
│홈페이지DB │──┤    └────────────┘      │  • 주문 통합     │
│(MSSQL 63t)│  │                        │  • CS 이력       │
└──────────┘  │                        │  • 구독 정보     │
              │                        │  • CMS 콘텐츠    │
┌──────────┐  │                        │  • 재고/발송     │
│ CMS DB   │──┤                        │                  │
│(MSSQL 13t)│  │                        └──────────────────┘
└──────────┘  │
              │
┌──────────┐  │
│ 외부몰   │──┘
│ (API)    │
└──────────┘
```

---

## TO-BE ERD (개념 모델)

### 핵심 엔터티

```
┌─────────────────────────────────────────────────────────────────┐
│                         고객 도메인                              │
│                                                                 │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │   Customer   │      │ Subscription │      │  CmsAccess   │  │
│  │   (고객)     │◀────│   (구독)     │─────▶│  (CMS권한)   │  │
│  ├──────────────┤      ├──────────────┤      ├──────────────┤  │
│  │ PK id        │      │ PK id        │      │ PK id        │  │
│  │ 이름         │      │ FK 고객id    │      │ FK 구독id    │  │
│  │ 연락처       │      │ 시작일       │      │ 상태         │  │
│  │ 이메일       │      │ 종료일       │      │ 활성화일     │  │
│  │ 등급         │      │ 상태         │      │ 만료일       │  │
│  │ 채널         │      │ 채널         │      └──────────────┘  │
│  └──────────────┘      └──────────────┘                        │
│         │                    │                                 │
└─────────┼────────────────────┼─────────────────────────────────┘
          │                    │
          ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                         주문 도메인                              │
│                                                                 │
│  ┌──────────────┐      ┌──────────────┐                        │
│  │    Order     │      │  OrderItem   │                        │
│  │   (주문)     │◀────│  (주문상세)  │                        │
│  ├──────────────┤      ├──────────────┤                        │
│  │ PK id        │      │ PK id        │                        │
│  │ FK 고객id    │      │ FK 주문id    │                        │
│  │ 주문일시     │      │ 상품명       │                        │
│  │ 주문채널     │      │ 수량         │                        │
│  │ 총금액       │      │ 금액         │                        │
│  │ 결제상태     │      └──────────────┘                        │
│  │ 배송상태     │                                              │
│  └──────────────┘                                              │
│         │                                                      │
└─────────┼──────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                          CS 도메인                               │
│                                                                 │
│  ┌──────────────┐      ┌──────────────┐                        │
│  │   CsTicket   │      │  CsHistory   │                        │
│  │   (CS문의)   │◀────│  (처리이력)  │                        │
│  ├──────────────┤      ├──────────────┤                        │
│  │ PK id        │      │ PK id        │                        │
│  │ FK 고객id    │      │ FK 티켓id    │                        │
│  │ FK 주문id    │      │ 처리자       │                        │
│  │ 유형         │      │ 처리내용     │                        │
│  │ 제목         │      │ 처리일시     │                        │
│  │ 상태         │      └──────────────┘                        │
│  │ 담당자       │                                              │
│  └──────────────┘                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 테이블 정의 (초안)

### 1. Customer (고객)

| 컬럼명 | 타입 | 필수 | 설명 |
|--------|------|:----:|------|
| id | BIGSERIAL | PK | 고객 ID |
| customer_code | VARCHAR(20) | UK | 고객 코드 |
| name | VARCHAR(100) | Y | 이름 |
| phone | VARCHAR(20) | Y | 연락처 |
| email | VARCHAR(100) | | 이메일 |
| address | TEXT | | 주소 |
| grade | VARCHAR(20) | | 등급 |
| primary_channel | VARCHAR(20) | | 최초 유입 채널 |
| created_at | TIMESTAMP | Y | 생성일시 |
| updated_at | TIMESTAMP | Y | 수정일시 |

### 2. Subscription (구독)

| 컬럼명 | 타입 | 필수 | 설명 |
|--------|------|:----:|------|
| id | BIGSERIAL | PK | 구독 ID |
| customer_id | BIGINT | FK | 고객 ID |
| product_type | VARCHAR(50) | Y | 상품 유형 |
| start_date | DATE | Y | 시작일 |
| end_date | DATE | Y | 종료일 |
| status | VARCHAR(20) | Y | 상태 |
| channel | VARCHAR(20) | Y | 가입 채널 |
| created_at | TIMESTAMP | Y | 생성일시 |

### 3. Order (주문)

| 컬럼명 | 타입 | 필수 | 설명 |
|--------|------|:----:|------|
| id | BIGSERIAL | PK | 주문 ID |
| order_code | VARCHAR(30) | UK | 주문 코드 |
| customer_id | BIGINT | FK | 고객 ID |
| channel | VARCHAR(20) | Y | 주문 채널 |
| order_date | TIMESTAMP | Y | 주문일시 |
| total_amount | DECIMAL(12,2) | Y | 총금액 |
| payment_status | VARCHAR(20) | Y | 결제상태 |
| delivery_status | VARCHAR(20) | | 배송상태 |
| external_order_id | VARCHAR(50) | | 외부 주문번호 |
| created_at | TIMESTAMP | Y | 생성일시 |

---

## 데이터 표준화

### 코드 표준

| 도메인 | 코드 | 값 |
|--------|------|-----|
| 주문채널 | CHANNEL | OWN_MALL, NAVER, COUPANG, SPONSOR |
| 결제상태 | PAY_STATUS | PENDING, PAID, REFUNDED, CANCELLED |
| 배송상태 | DELIV_STATUS | READY, SHIPPED, DELIVERED |
| 구독상태 | SUBS_STATUS | ACTIVE, EXPIRED, CANCELLED |
| CS유형 | CS_TYPE | INQUIRY, COMPLAINT, REFUND, ETC |

### 데이터 정제 규칙

| 항목 | 규칙 |
|------|------|
| 연락처 | 숫자만, 11자리 (010XXXXXXXX) |
| 이메일 | 소문자 변환, 유효성 검증 |
| 이름 | 공백 제거, 특수문자 제거 |
| 주소 | 우편번호 분리 저장 |

---

## 데이터 동기화 방안

### 1. 자사몰 연동

```
[자사몰 DB] ──(API/DB Link)──▶ [동기화 서비스] ──▶ [통합 DB]
                                     │
                                     ▼
                              [변경 이벤트 발행]
```

### 2. 외부몰 연동

```
[네이버] ──────┐
              │
[쿠팡]  ──────┼──(API 수집)──▶ [수집 서비스] ──▶ [통합 DB]
              │                      │
[11번가] ─────┘                      ▼
                              [주기적 폴링 / Webhook]
```

### 3. CMS 연동

```
[통합 DB] ──(권한 변경)──▶ [CMS API] ──▶ [CMS DB]
    ▲                                        │
    └──────────(상태 동기화)──────────────────┘
```

---

## 마이그레이션 고려사항

### 데이터 매핑

| AS-IS (MSSQL) | TO-BE (통합 DB) | 변환 규칙 |
|---------------|-------------------|----------|
| PT_Customer (48 cols) | customer | Customer_ID→customer_code, 연락처 정규화, 주소 분리 |
| PT_Subscribe (20 cols) | subscription | Subscribe_SN→구독코드, 상태 코드 표준화 |
| PT_Receiver (43 cols) | delivery_address / order_item | 받는사람 → 배송지 + 주문항목 분리 |
| PT_Finance (22 cols) | payment | Finance_Type 기준 입금/환불 분리 |
| PT_Company (49 cols) | partner | 거래처 → 파트너 마스터 |
| PT_Book (30 cols) + PT_BookPrice | product | 도서+가격 → 상품 통합 |
| PT_Stock + PT_GiftStock | inventory | 재고 통합 (일반+선물) |
| PT_Councel_History | cs_ticket + cs_history | 상담이력 → CS 티켓/이력 분리 |
| PT_Giro | payment_giro | 지로 전용 결제 |
| PT_GiftSend | gift_order | 선물 발송 → 선물 주문 |
| PT_DEFERINCOME_* (INFO/MST/STAT) | deferred_revenue | 선수수익 통합 |
| PTM_Products + PTM_ProductOptions | product (웹 상품 병합) | 홈페이지 상품 → 상품 통합 |
| PTM_Orders + PTM_Order_Items | order + order_item | 홈페이지 주문 병합 |
| PTM_Regular_Orders + PTM_Regulars | subscription (웹 구독 병합) | 정기구독 통합 |
| PTM_Coupons + PTM_Coupon_* | coupon + coupon_history | 쿠폰 통합 |
| ptcms_contents + ptcms_writer | cms_content + cms_writer | CMS 콘텐츠 이관 |
| ptcms_books | product (도서 카테고리) | CMS 도서 → 상품 통합 |

### 중복 데이터 처리

- 고객: 연락처 + 이름 기준 매칭
- 주문: 외부 주문번호 기준 중복 체크

---

## 작성 이력

| 날짜 | 작성자 | 변경 내용 |
|------|--------|----------|
| 2026-02-23 | - | 초안 작성 |
| 2026-03-03 | ISP 컨설턴트 | AS-IS→TO-BE 전환 다이어그램 보강 (3개 DB 소스 명시), 데이터 매핑 테이블 17건 작성 (C/S 75t + CMS 13t + 홈페이지 63t → 통합 DB 매핑), MySQL→MSSQL 오류 수정 |
