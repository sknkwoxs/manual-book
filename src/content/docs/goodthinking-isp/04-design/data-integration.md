---
title: 데이터 통합 모델
description: 통합 DB 스키마(ERD) 설계
---

# 데이터 통합 모델

외부 채널 데이터를 포용하는 통합 DB 스키마(ERD) 설계

---

## 데이터 통합 전략

### AS-IS → TO-BE 전환

```mermaid
graph LR
    subgraph ASIS["AS-IS: 분산된 데이터"]
        A1["CS DB<br/>MSSQL"]
        A2["자사몰 DB"]
        A3["외부몰<br/>API"]
    end
    
    ETL["ETL/동기화"]
    
    subgraph TOBE["TO-BE: 통합 데이터"]
        B1["통합 DB<br/>PostgreSQL"]
        B2["• 고객 마스터"]
        B3["• 주문 통합"]
        B4["• CS 이력"]
        B5["• 구독 정보"]
    end
    
    A1 --> ETL
    A2 --> ETL
    A3 --> ETL
    ETL --> B1
    B1 --> B2
    B1 --> B3
    B1 --> B4
    B1 --> B5
```

---

## TO-BE ERD (개념 모델)

### 핵심 엔터티

```mermaid
graph LR
    subgraph Customer_Domain["고객 도메인"]
        Customer["Customer<br/>고객<br/>---<br/>PK: id<br/>이름, 연락처<br/>이메일, 등급<br/>채널"]
        Subscription["Subscription<br/>구독<br/>---<br/>PK: id<br/>FK: 고객id<br/>시작일, 종료일<br/>상태, 채널"]
        CmsAccess["CmsAccess<br/>CMS권한<br/>---<br/>PK: id<br/>FK: 구독id<br/>상태<br/>활성화일, 만료일"]
    end
    
    subgraph Order_Domain["주문 도메인"]
        Order["Order<br/>주문<br/>---<br/>PK: id<br/>FK: 고객id<br/>주문일시<br/>채널, 금액<br/>결제/배송상태"]
        OrderItem["OrderItem<br/>주문상세<br/>---<br/>PK: id<br/>FK: 주문id<br/>상품명, 수량<br/>금액"]
    end
    
    subgraph CS_Domain["CS 도메인"]
        CsTicket["CsTicket<br/>CS문의<br/>---<br/>PK: id<br/>FK: 고객id<br/>유형, 제목<br/>상태, 담당자"]
        CsHistory["CsHistory<br/>처리이력<br/>---<br/>PK: id<br/>FK: 티켓id<br/>처리자, 내용<br/>처리일시"]
    end
    
    Customer <--> Subscription
    Subscription <--> CmsAccess
    Customer <--> Order
    Order <--> OrderItem
    Customer <--> CsTicket
    CsTicket <--> CsHistory
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

```mermaid
graph LR
    A["자사몰 DB"]
    B["API/DB Link"]
    C["동기화 서비스"]
    D["변경 이벤트 발행"]
    E["통합 DB"]
    
    A -->|API/DB Link| B
    B --> C
    C --> D
    D --> E
```

### 2. 외부몰 연동

```mermaid
graph LR
    A["네이버"]
    B["쿠팡"]
    C["11번가"]
    D["API 수집"]
    E["수집 서비스"]
    F["주기적 폴링/<br/>Webhook"]
    G["통합 DB"]
    
    A -->|API 수집| D
    B -->|API 수집| D
    C -->|API 수집| D
    D --> E
    E --> F
    F --> G
```

### 3. CMS 연동

```mermaid
graph LR
    A["통합 DB"]
    B["권한 변경"]
    C["CMS API"]
    D["CMS DB"]
    E["상태 동기화"]
    
    A -->|권한 변경| B
    B --> C
    C --> D
    D -->|상태 동기화| E
    E --> A
```

---

## 마이그레이션 고려사항

### 데이터 매핑

| AS-IS (MSSQL) | TO-BE (PostgreSQL) | 변환 규칙 |
|---------------|-------------------|----------|
| (분석 후 작성) | customer | |
| | subscription | |
| | order | |

### 중복 데이터 처리

- 고객: 연락처 + 이름 기준 매칭
- 주문: 외부 주문번호 기준 중복 체크

---

## 작성 이력

| 날짜 | 작성자 | 변경 내용 |
|------|--------|----------|
| YYYY-MM-DD | - | 초안 작성 |
