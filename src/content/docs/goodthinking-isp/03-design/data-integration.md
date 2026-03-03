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
│(MSSQL 75t)│  │                        │   (AWS RDS       │
└──────────┘  │                        │    MSSQL)        │
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
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │    Order     │      │  OrderItem   │      │  Delivery    │  │
│  │   (주문)     │◀────│  (주문상세)  │─────▶│   (배송)     │  │
│  ├──────────────┤      ├──────────────┤      ├──────────────┤  │
│  │ PK id        │      │ PK id        │      │ PK id        │  │
│  │ FK 고객id    │      │ FK 주문id    │      │ FK 주문항목id│  │
│  │ 주문일시     │      │ FK 상품id    │      │ 배송사       │  │
│  │ 주문채널     │      │ 수량         │      │ 송장번호     │  │
│  │ 총금액       │      │ 금액         │      │ 배송상태     │  │
│  │ 결제상태     │      └──────────────┘      └──────────────┘  │
│  └──────────────┘                                              │
│         │                                                      │
└─────────┼──────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      결제/정산 도메인                             │
│                                                                 │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │   Payment    │      │PaymentGiro   │      │DeferredRev   │  │
│  │   (결제)     │      │  (지로결제)  │      │ (선수수익)   │  │
│  ├──────────────┤      ├──────────────┤      ├──────────────┤  │
│  │ PK id        │      │ PK id        │      │ PK id        │  │
│  │ FK 주문id    │      │ FK 고객id    │      │ FK 구독id    │  │
│  │ FK 고객id    │      │ FK 구독id    │      │ 기간         │  │
│  │ 결제방법     │      │ 지로번호     │      │ 인식금액     │  │
│  │ 결제금액     │      │ 입금상태     │      │ 이연금액     │  │
│  │ PG거래번호   │      └──────────────┘      └──────────────┘  │
│  │ 상태         │                                              │
│  └──────────────┘                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      상품/재고 도메인                             │
│                                                                 │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │   Product    │      │  Inventory   │      │ StockHistory │  │
│  │   (상품)     │◀────│   (재고)     │─────▶│  (입출고)    │  │
│  ├──────────────┤      ├──────────────┤      ├──────────────┤  │
│  │ PK id        │      │ PK id        │      │ PK id        │  │
│  │ 상품코드     │      │ FK 상품id    │      │ FK 재고id    │  │
│  │ 상품명       │      │ 수량         │      │ 유형(입/출)  │  │
│  │ 카테고리     │      │ 위치         │      │ 수량         │  │
│  │ 가격         │      └──────────────┘      │ 일시         │  │
│  │ 유형(도서등) │                              └──────────────┘  │
│  └──────────────┘                                              │
│         │                                                      │
│         ▼                                                      │
│  ┌──────────────┐      ┌──────────────┐                        │
│  │ProductPrice  │      │   Partner    │                        │
│  │ (가격정책)   │      │  (거래처)    │                        │
│  ├──────────────┤      ├──────────────┤                        │
│  │ FK 상품id    │      │ PK id        │                        │
│  │ 기간         │      │ 거래처명     │                        │
│  │ 단가         │      │ 유형         │                        │
│  └──────────────┘      └──────────────┘                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         CS 도메인                               │
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

┌─────────────────────────────────────────────────────────────────┐
│                      선물/쿠폰 도메인                            │
│                                                                 │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │  GiftOrder   │      │    Coupon    │      │ CouponHist   │  │
│  │  (선물주문)  │      │   (쿠폰)    │      │ (사용이력)   │  │
│  ├──────────────┤      ├──────────────┤      ├──────────────┤  │
│  │ PK id        │      │ PK id        │      │ PK id        │  │
│  │ FK 주문자id  │      │ 쿠폰코드     │      │ FK 쿠폰id    │  │
│  │ 수신자명     │      │ 할인유형     │      │ FK 고객id    │  │
│  │ 수신자연락처 │      │ 할인금액     │      │ 사용일시     │  │
│  │ 상품id       │      │ 유효기간     │      └──────────────┘  │
│  └──────────────┘      └──────────────┘                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      CMS/콘텐츠 도메인                           │
│                                                                 │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │  CmsContent  │      │  CmsWriter   │      │ CmsSubject   │  │
│  │  (원고)      │◀────│   (필자)     │      │  (코너)      │  │
│  ├──────────────┤      ├──────────────┤      ├──────────────┤  │
│  │ PK id        │      │ PK id        │      │ PK id        │  │
│  │ FK 필자id    │      │ 필명         │      │ 코너명       │  │
│  │ FK 코너id    │      │ 저작권정보   │      │ 분류         │  │
│  │ 제목         │      └──────────────┘      └──────────────┘  │
│  │ 원고내용     │                                              │
│  │ 발행호수     │                                              │
│  └──────────────┘                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      시스템/관리 도메인                           │
│                                                                 │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │    User      │      │    Role      │      │  AuditLog    │  │
│  │  (사용자)    │◀────│   (역할)     │      │  (감사로그)  │  │
│  ├──────────────┤      ├──────────────┤      ├──────────────┤  │
│  │ PK id        │      │ PK id        │      │ PK id        │  │
│  │ 계정명       │      │ 역할명       │      │ FK 사용자id  │  │
│  │ 비밀번호(해시)│      │ 권한목록     │      │ 행위         │  │
│  │ FK 역할id    │      └──────────────┘      │ 대상         │  │
│  │ 활성상태     │                              │ 일시         │  │
│  └──────────────┘                              └──────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 엔티티 관계 요약

| 도메인 | 핵심 엔티티 | AS-IS 소스 | 비고 |
|--------|------------|-----------|------|
| 고객 | Customer, CmsAccess | PT_Customer + PTM_Members + ptcms_member | 3곳 통합 → 1곳 |
| 구독 | Subscription | PT_Subscribe + PTM_Regulars | 2곳 통합 |
| 주문 | Order, OrderItem, Delivery | PT_Receiver + PTM_Orders + PTM_Order_Items | 2곳 통합 |
| 결제 | Payment, PaymentGiro, DeferredRev | PT_Finance + PT_Giro + PT_DEFERINCOME_* + PTM_Payment_Infos | 2곳 통합 |
| 상품/재고 | Product, ProductPrice, Inventory, StockHistory, Partner | PT_Book + PT_BookPrice + PT_Stock + PT_Company + PTM_Products | 2곳 통합 |
| CS | CsTicket, CsHistory | PT_Councel_History | 구조 개선 |
| 선물/쿠폰 | GiftOrder, Coupon, CouponHist | PT_GiftSend + PT_Coupon + PTM_GiftOrders + PTM_Coupons | 2곳 통합 |
| CMS | CmsContent, CmsWriter, CmsSubject | ptcms_contents + ptcms_writer + ptcms_subject | 구조 유지 |
| 시스템 | User, Role, AuditLog | PT_Account + PT_Auth + PT_Menu_authority | 신규 설계 |

> **총 TO-BE 핵심 엔티티: 23개** (AS-IS 151 tables → TO-BE ~30~40 tables 예상, 레거시/임시 테이블 제거)

---

## 테이블 정의 (초안)

### 1. Customer (고객)

| 컬럼명 | 타입 | 필수 | 설명 |
|--------|------|:----:|------|
| id | BIGINT IDENTITY(1,1) | PK | 고객 ID |
| customer_code | VARCHAR(20) | UK | 고객 코드 (AS-IS Customer_ID 매핑) |
| name | NVARCHAR(100) | Y | 이름 |
| phone | VARCHAR(20) | Y | 연락처 (010XXXXXXXX, 숫자만) |
| email | VARCHAR(100) | | 이메일 |
| zipcode | VARCHAR(10) | | 우편번호 |
| address | NVARCHAR(500) | | 주소 |
| address_detail | NVARCHAR(200) | | 상세 주소 |
| grade | VARCHAR(20) | | 등급 (VIP, GOLD, NORMAL 등) |
| primary_channel | VARCHAR(20) | | 최초 유입 채널 (OWN_MALL, NAVER, COUPANG, PHONE, SPONSOR) |
| is_active | BIT | Y | 활성 여부 (기본 1) |
| memo | NVARCHAR(MAX) | | 고객 메모 |
| created_at | DATETIME2 | Y | 생성일시 |
| updated_at | DATETIME2 | Y | 수정일시 |

> AS-IS 소스: PT_Customer(48 cols) + PTM_Members + ptcms_member → 3곳 통합

### 2. Subscription (구독)

| 컬럼명 | 타입 | 필수 | 설명 |
|--------|------|:----:|------|
| id | BIGINT IDENTITY(1,1) | PK | 구독 ID |
| customer_id | BIGINT | FK | 고객 ID → Customer.id |
| product_id | BIGINT | FK | 상품 ID → Product.id |
| subscription_code | VARCHAR(30) | UK | 구독 코드 |
| start_date | DATE | Y | 시작일 |
| end_date | DATE | Y | 종료일 (fn_PT_GetEndDate 로직 전환) |
| start_issue | VARCHAR(20) | | 시작 호수 (월간지) |
| end_issue | VARCHAR(20) | | 종료 호수 |
| status | VARCHAR(20) | Y | 상태 (ACTIVE, EXPIRED, CANCELLED) |
| channel | VARCHAR(20) | Y | 가입 채널 |
| auto_renew | BIT | | 자동 갱신 여부 |
| created_at | DATETIME2 | Y | 생성일시 |
| updated_at | DATETIME2 | Y | 수정일시 |

> AS-IS 소스: PT_Subscribe + PTM_Regulars + PTM_Regular_Orders → 2곳 통합

### 3. Order (주문)

| 컬럼명 | 타입 | 필수 | 설명 |
|--------|------|:----:|------|
| id | BIGINT IDENTITY(1,1) | PK | 주문 ID |
| order_code | VARCHAR(30) | UK | 주문 코드 |
| customer_id | BIGINT | FK | 고객 ID → Customer.id |
| channel | VARCHAR(20) | Y | 주문 채널 (OWN_MALL, NAVER, COUPANG, SPONSOR) |
| order_date | DATETIME2 | Y | 주문일시 |
| total_amount | DECIMAL(12,2) | Y | 총금액 |
| payment_status | VARCHAR(20) | Y | 결제상태 (PENDING, PAID, REFUNDED, CANCELLED) |
| delivery_status | VARCHAR(20) | | 배송상태 (READY, SHIPPED, DELIVERED) |
| external_order_id | VARCHAR(50) | | 외부 주문번호 (네이버/쿠팡 원본 ID) |
| memo | NVARCHAR(500) | | 주문 메모 |
| created_at | DATETIME2 | Y | 생성일시 |
| updated_at | DATETIME2 | Y | 수정일시 |

> AS-IS 소스: PT_Receiver + PTM_Orders + Playauto 주문 → 3곳 통합

### 4. OrderItem (주문항목)

| 컬럼명 | 타입 | 필수 | 설명 |
|--------|------|:----:|------|
| id | BIGINT IDENTITY(1,1) | PK | 주문항목 ID |
| order_id | BIGINT | FK | 주문 ID → Order.id |
| product_id | BIGINT | FK | 상품 ID → Product.id |
| quantity | INT | Y | 수량 |
| unit_price | DECIMAL(12,2) | Y | 단가 |
| amount | DECIMAL(12,2) | Y | 금액 (수량 × 단가) |
| created_at | DATETIME2 | Y | 생성일시 |

### 5. Payment (결제)

| 컬럼명 | 타입 | 필수 | 설명 |
|--------|------|:----:|------|
| id | BIGINT IDENTITY(1,1) | PK | 결제 ID |
| order_id | BIGINT | FK | 주문 ID → Order.id |
| customer_id | BIGINT | FK | 고객 ID → Customer.id |
| payment_method | VARCHAR(20) | Y | 결제방법 (CARD, VBANK, GIRO, TRANSFER) |
| amount | DECIMAL(12,2) | Y | 결제금액 |
| pg_tid | VARCHAR(100) | | PG 거래번호 (나이스페이 TID) |
| pg_provider | VARCHAR(20) | | PG사 (NICEPAY) |
| status | VARCHAR(20) | Y | 상태 (PENDING, PAID, REFUNDED, FAILED) |
| paid_at | DATETIME2 | | 결제완료일시 |
| refund_amount | DECIMAL(12,2) | | 환불금액 |
| refunded_at | DATETIME2 | | 환불일시 |
| created_at | DATETIME2 | Y | 생성일시 |

> AS-IS 소스: PT_Finance + PT_NicepayCreditcardIncome + PT_NicepayVirtualAccount + PTM_Payment_Infos → 2곳 통합

### 6. PaymentGiro (지로결제)

| 컬럼명 | 타입 | 필수 | 설명 |
|--------|------|:----:|------|
| id | BIGINT IDENTITY(1,1) | PK | 지로결제 ID |
| customer_id | BIGINT | FK | 고객 ID → Customer.id |
| subscription_id | BIGINT | FK | 구독 ID → Subscription.id |
| giro_number | VARCHAR(30) | UK | 지로 번호 |
| amount | DECIMAL(12,2) | Y | 청구금액 |
| deposit_status | VARCHAR(20) | Y | 입금상태 (PENDING, DEPOSITED, OVERDUE) |
| deposit_date | DATE | | 입금일 |
| issue_month | VARCHAR(10) | Y | 발행 월 (YYYY-MM) |
| created_at | DATETIME2 | Y | 생성일시 |

> AS-IS 소스: PT_Giro + sp_PT_GiroData 등 6개 SP → 구조 개선

### 7. DeferredRevenue (선수수익)

| 컬럼명 | 타입 | 필수 | 설명 |
|--------|------|:----:|------|
| id | BIGINT IDENTITY(1,1) | PK | 선수수익 ID |
| subscription_id | BIGINT | FK | 구독 ID → Subscription.id |
| period | VARCHAR(10) | Y | 인식 기간 (YYYY-MM) |
| recognized_amount | DECIMAL(12,2) | Y | 당기 인식금액 |
| deferred_amount | DECIMAL(12,2) | Y | 이연잔액 |
| calc_date | DATETIME2 | Y | 산출일시 |
| created_at | DATETIME2 | Y | 생성일시 |

> AS-IS 소스: PT_DEFERINCOME_MONTH + PT_DEFERINCOME_YEAR + PT_DEFERINCOME_STAT + TG_PT_DeferIncome → 통합

### 8. Product (상품)

| 컬럼명 | 타입 | 필수 | 설명 |
|--------|------|:----:|------|
| id | BIGINT IDENTITY(1,1) | PK | 상품 ID |
| product_code | VARCHAR(20) | UK | 상품 코드 |
| name | NVARCHAR(200) | Y | 상품명 |
| category | VARCHAR(20) | Y | 카테고리 (MONTHLY, BOOK, ART, GIFT, BUNDLE) |
| product_type | VARCHAR(20) | Y | 유형 (SUBSCRIPTION, SINGLE, BUNDLE) |
| base_price | DECIMAL(12,2) | Y | 기본가격 |
| is_active | BIT | Y | 판매 활성 여부 |
| description | NVARCHAR(MAX) | | 상품 설명 |
| image_url | VARCHAR(500) | | 상품 이미지 URL |
| created_at | DATETIME2 | Y | 생성일시 |
| updated_at | DATETIME2 | Y | 수정일시 |

> AS-IS 소스: PT_Book(30 cols) + PT_BookPrice + PTM_Products(16t) + ptcms_books → 3곳 통합

### 9. Delivery (배송)

| 컬럼명 | 타입 | 필수 | 설명 |
|--------|------|:----:|------|
| id | BIGINT IDENTITY(1,1) | PK | 배송 ID |
| order_item_id | BIGINT | FK | 주문항목 ID → OrderItem.id |
| carrier | VARCHAR(20) | Y | 배송사 (CJ, POST, DIRECT) |
| tracking_number | VARCHAR(50) | | 송장번호 |
| recipient_name | NVARCHAR(100) | Y | 수신자명 |
| recipient_phone | VARCHAR(20) | Y | 수신자 연락처 |
| recipient_zipcode | VARCHAR(10) | | 우편번호 |
| recipient_address | NVARCHAR(500) | Y | 배송 주소 |
| status | VARCHAR(20) | Y | 배송상태 (READY, SHIPPED, IN_TRANSIT, DELIVERED, RETURNED) |
| shipped_at | DATETIME2 | | 출고일시 |
| delivered_at | DATETIME2 | | 배송완료일시 |
| created_at | DATETIME2 | Y | 생성일시 |
| updated_at | DATETIME2 | Y | 수정일시 |

> AS-IS 소스: PT_RegularSend_Info + PT_SendHistory + PT_DMSend_Info + PTM_ShippingInfos → 2곳 통합

### 10. CmsContent (CMS 콘텐츠)

| 컬럼명 | 타입 | 필수 | 설명 |
|--------|------|:----:|------|
| id | BIGINT IDENTITY(1,1) | PK | 콘텐츠 ID |
| writer_id | BIGINT | FK | 필자 ID → CmsWriter.id |
| subject_id | BIGINT | FK | 코너 ID → CmsSubject.id |
| title | NVARCHAR(300) | Y | 제목 |
| content | NVARCHAR(MAX) | Y | 원고 내용 |
| issue_number | VARCHAR(20) | Y | 발행 호수 |
| publish_date | DATE | | 발행일 |
| status | VARCHAR(20) | Y | 상태 (DRAFT, PUBLISHED, ARCHIVED) |
| created_at | DATETIME2 | Y | 생성일시 |
| updated_at | DATETIME2 | Y | 수정일시 |

> AS-IS 소스: ptcms_contents(33 cols) + ptcms_category → 구조 유지, 타입 통일

### 11. CmsAccess (CMS 열람 권한)

| 컬럼명 | 타입 | 필수 | 설명 |
|--------|------|:----:|------|
| id | BIGINT IDENTITY(1,1) | PK | 권한 ID |
| subscription_id | BIGINT | FK | 구독 ID → Subscription.id |
| customer_id | BIGINT | FK | 고객 ID → Customer.id |
| status | VARCHAR(20) | Y | 상태 (ACTIVE, EXPIRED, REVOKED) |
| activated_at | DATETIME2 | Y | 활성화일시 |
| expired_at | DATETIME2 | | 만료일시 |
| created_at | DATETIME2 | Y | 생성일시 |

> AS-IS 소스: ptcms_member → 구조 개선, 구독 기반 자동 관리로 전환

### 12. User (시스템 사용자)

| 컬럼명 | 타입 | 필수 | 설명 |
|--------|------|:----:|------|
| id | BIGINT IDENTITY(1,1) | PK | 사용자 ID |
| login_id | VARCHAR(50) | UK | 로그인 ID |
| password_hash | VARCHAR(256) | Y | 비밀번호 (bcrypt 해시) |
| name | NVARCHAR(100) | Y | 이름 |
| role_id | BIGINT | FK | 역할 ID → Role.id |
| is_active | BIT | Y | 활성 상태 |
| last_login_at | DATETIME2 | | 마지막 로그인 |
| created_at | DATETIME2 | Y | 생성일시 |
| updated_at | DATETIME2 | Y | 수정일시 |

> AS-IS 소스: PT_Account + PT_Auth + PT_Menu_authority + PT_Button_authority → 통합 RBAC 구조

### 13. AuditLog (감사 로그)

| 컬럼명 | 타입 | 필수 | 설명 |
|--------|------|:----:|------|
| id | BIGINT IDENTITY(1,1) | PK | 로그 ID |
| user_id | BIGINT | FK | 사용자 ID → User.id |
| action | VARCHAR(20) | Y | 행위 (CREATE, UPDATE, DELETE, LOGIN, LOGOUT) |
| target_table | VARCHAR(50) | Y | 대상 테이블 |
| target_id | BIGINT | | 대상 레코드 ID |
| before_data | NVARCHAR(MAX) | | 변경 전 데이터 (JSON) |
| after_data | NVARCHAR(MAX) | | 변경 후 데이터 (JSON) |
| ip_address | VARCHAR(45) | | IP 주소 |
| created_at | DATETIME2 | Y | 발생일시 |

> AS-IS 소스: PT_DataMonitoringLog + PT_LogLockKill → 확장 (JSON 기반 변경 추적)

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

## 요구사항 ↔ TO-BE 엔티티 교차 검증

> 기능 요구사항 48건이 어떤 TO-BE 엔티티에 의존하는지 매핑합니다. 요구사항 상세는 [요구사항 분석](/goodthinking-isp/02-analysis/requirements/) 참조.

### 모듈별 의존 엔티티 매트릭스

| 모듈 | 요구사항 ID | 핵심 의존 엔티티 | 참조 엔티티 |
|------|-----------|---------------|-----------|
| 대시보드 (3건) | FR-DB-001~003 | Order, Payment, Subscription | Customer, CsTicket, Delivery |
| 고객 관리 (5건) | FR-CM-001~005 | **Customer**, CmsAccess | Subscription, Order, CsTicket |
| 구독 관리 (5건) | FR-SB-001~005 | **Subscription**, **CmsAccess** | Customer, Product, Payment |
| 주문 관리 (5건) | FR-OM-001~005 | **Order**, **OrderItem**, Payment | Customer, Product, Delivery |
| 배송 관리 (4건) | FR-DL-001~004 | **Delivery**, Order, OrderItem | Customer, Product |
| 결제/정산 (5건) | FR-FN-001~005 | **Payment**, **PaymentGiro**, **DeferredRevenue** | Order, Customer, Subscription |
| CS/상담 (5건) | FR-CS-001~005 | **CsTicket**, **CsHistory** | Customer, Order, Subscription |
| 지로 관리 (3건) | FR-GR-001~003 | **PaymentGiro** | Customer, Subscription |
| 선물 관리 (3건) | FR-GF-001~003 | **GiftOrder**, **Coupon**, CouponHist | Customer, Product, Inventory |
| 재고/도서 (3건) | FR-BK-001~003 | **Product**, **Inventory**, StockHistory | ProductPrice, Partner |
| CMS 관리 (3건) | FR-CMS-001~003 | **CmsContent**, CmsWriter, CmsSubject, **CmsAccess** | Subscription |
| 시스템 관리 (4건) | FR-AD-001~004 | **User**, **Role**, **AuditLog** | - |

### 엔티티별 의존 요구사항 수

| TO-BE 엔티티 | 의존 요구사항 수 | 주요 모듈 | 중요도 |
|-------------|:--------------:|---------|:-----:|
| Customer | 48건 (전체 참조) | 전 모듈 | ⭐⭐⭐ |
| Order + OrderItem | 17건 | 주문, 배송, 대시보드, CS | ⭐⭐⭐ |
| Subscription | 13건 | 구독, 고객, 결제, CMS | ⭐⭐⭐ |
| Payment | 13건 | 결제, 주문, 대시보드 | ⭐⭐⭐ |
| CmsAccess | 8건 | 구독, CMS, 고객 | ⭐⭐⭐ |
| Delivery | 8건 | 배송, 주문 | ⭐⭐ |
| Product | 9건 | 재고, 주문, 구독 | ⭐⭐ |
| CsTicket + CsHistory | 5건 | CS | ⭐⭐ |
| PaymentGiro | 5건 | 지로, 결제 | ⭐⭐ |
| DeferredRevenue | 2건 | 결제/정산 | ⭐ |
| User + Role + AuditLog | 4건 | 시스템 관리 | ⭐⭐ |
| GiftOrder + Coupon | 3건 | 선물 | ⭐ |
| CmsContent + Writer + Subject | 3건 | CMS | ⭐ |
| Inventory + StockHistory | 3건 | 재고 | ⭐ |

> **검증 결과**: 48건 기능 요구사항 모두 TO-BE 23개 엔티티로 커버 가능. 누락 엔티티 없음.

---

## 데이터 동기화 방안

### 1. 통합 아키텍처

TO-BE에서는 **단일 DB** (AWS RDS MSSQL)를 사용하므로 기존 3개 DB 간 동기화 문제가 해소됩니다. 외부 시스템과의 연동만 설계합니다.

```
┌────────────────────────────────────────────────────────────────┐
│                    TO-BE 데이터 동기화 아키텍처                   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  [통합 DB] ◀────────── NestJS API Server ──────────▶ [React]  │
│  (AWS RDS MSSQL)           │  │  │                   (Admin)   │
│                            │  │  │                             │
│            ┌───────────────┘  │  └──────────────┐              │
│            ▼                  ▼                  ▼              │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│   │ 외부몰 연동   │  │ PG 연동      │  │ 물류 연동     │        │
│   │              │  │              │  │              │        │
│   │ • Playauto   │  │ • 나이스페이  │  │ • CJ대한통운  │        │
│   │   API 폴링   │  │   Webhook   │  │   API 연동   │        │
│   │   (5분 주기) │  │   (실시간)   │  │              │        │
│   │ • 네이버 API │  │ • 가상계좌   │  │ • 우체국     │        │
│   │ • 쿠팡 API   │  │   입금 알림  │  │   파일 생성  │        │
│   └──────────────┘  └──────────────┘  └──────────────┘        │
│            │                  │                  │              │
│            ▼                  ▼                  ▼              │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│   │ ERP 연동     │  │ CMS 연동     │  │ 알림 연동     │        │
│   │              │  │              │  │              │        │
│   │ • 이카운트   │  │ • CMS 권한   │  │ • SMS/알림톡 │        │
│   │   API 연동   │  │   자동 부여  │  │ • CTI 연동   │        │
│   └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 2. 외부몰 주문 수집

```
[Playauto API] ──(5분 폴링)──▶ [OrderCollectorService]
                                     │
                    ┌────────────────┤
                    ▼                ▼
            ┌─────────────┐  ┌─────────────┐
            │ 고객 매칭    │  │ 신규 고객    │
            │ (phone/name)│  │ 자동 생성    │
            └──────┬──────┘  └──────┬──────┘
                   │                │
                   ▼                ▼
            ┌────────────────────────────┐
            │ Order + OrderItem 생성     │
            │ • channel: NAVER/COUPANG   │
            │ • external_order_id 매핑   │
            └───────────┬────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │ 상태 동기화       │
              │ (배송→Playauto)  │
              └──────────────────┘
```

### 3. CMS 권한 자동 부여 (핵심 병목 해소)

구독 결제 완료 → CMS 열람 권한 자동 부여 시퀀스:

```
┌───────────────────────────────────────────────────────────────┐
│           결제 → 구독 → CMS 권한 자동 부여 시퀀스               │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  1. [나이스페이 Webhook] ──▶ PaymentService.handleWebhook()  │
│         │                                                     │
│         ▼                                                     │
│  2. Payment 레코드 생성 (status: PAID)                         │
│         │                                                     │
│         ▼                                                     │
│  3. Order.payment_status → PAID 갱신                          │
│         │                                                     │
│         ▼                                                     │
│  4. [구독 상품 여부 확인] ── 일반 상품이면 → 배송 처리로 이동   │
│         │ (구독 상품)                                          │
│         ▼                                                     │
│  5. Subscription 생성/갱신                                     │
│     • start_date, end_date 자동 계산                           │
│     • status: ACTIVE                                          │
│         │                                                     │
│         ▼                                                     │
│  6. CmsAccess 생성/갱신                                        │
│     • status: ACTIVE                                          │
│     • activated_at: NOW()                                     │
│     • expired_at: Subscription.end_date                       │
│         │                                                     │
│         ▼                                                     │
│  7. [알림 발송] 고객에게 열람 안내 (SMS/알림톡)                  │
│                                                               │
│  ※ 전체 소요: 결제 완료 후 ~30초 이내 (AS-IS: 수시간~1영업일)   │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### 4. 구독 만료 자동 처리 (스케줄러)

```
[매일 00:00 배치] ── CronService.handleSubscriptionExpiry()
      │
      ▼
┌─────────────────────────────────────┐
│ SELECT * FROM Subscription          │
│ WHERE end_date < GETDATE()          │
│   AND status = 'ACTIVE'             │
└──────────────┬──────────────────────┘
               │
               ▼
  ┌─────────────────────────────┐
  │ Subscription.status → EXPIRED│
  │ CmsAccess.status → EXPIRED  │
  │ CmsAccess.expired_at → NOW()│
  └──────────────┬──────────────┘
                 │
                 ▼
        [D-7 갱신 안내 알림]
        [만료 안내 알림]
```

### 5. ERP 자동 연동

```
[결제 완료 이벤트] ──▶ ErpSyncService.syncPayment()
      │
      ▼
┌──────────────────────────┐
│ 이카운트 ERP API 호출     │
│ • 매출 전표 자동 전송     │
│ • 거래처 동기화           │
│ • 세금계산서 데이터 전달  │
└──────────────────────────┘
      │
      ▼ (실패 시)
┌──────────────────────────┐
│ 재시도 큐 등록 (3회)      │
│ → 최종 실패 시 수동 처리  │
│   대기 목록 알림          │
└──────────────────────────┘
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
| 2026-03-03 | 김명직 | AS-IS→TO-BE 전환 다이어그램 보강 (3개 DB 소스 명시), 데이터 매핑 테이블 17건 작성 (C/S 75t + CMS 13t + 홈페이지 63t → 통합 DB 매핑), MySQL→MSSQL 오류 수정 |
| 2026-03-03 | 김명직 | TO-BE ERD 3개 도메인→8개 도메인 확장 (고객, 주문, 결제/정산, 상품/재고, CS, 선물/쿠폰, CMS/콘텐츠, 시스템/관리), 핵심 엔티티 23개 정의, 엔티티 관계 요약 테이블 추가 |
| 2026-03-03 | 김명직 | 테이블 정의 3건→13건 확장 (전 엔티티 컬럼 정의 완료), BIGSERIAL→BIGINT IDENTITY 등 MSSQL 타입으로 전면 수정, 엔티티별 AS-IS 소스 매핑 주석 추가 |
| 2026-03-03 | 김명직 | 요구사항↔TO-BE 엔티티 교차 검증 매트릭스 신설 — 48건 기능 요구사항 전량 커버 확인, 엔티티별 의존 요구사항 수 분석 |
| 2026-03-03 | 김명직 | 데이터 동기화 방안 전면 개편 — 통합 아키텍처 다이어그램, 외부몰 수집 흐름, CMS 권한 자동 부여 시퀀스(핵심 병목 해소), 구독 만료 자동 처리, ERP 연동 흐름 구체화 |
