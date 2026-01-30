---
title: 마이그레이션 계획
description: 데이터 이관 및 시스템 전환 전략
---

# 마이그레이션 계획

로컬 DB 데이터를 웹 기반 신규 DB로 구조 변경 및 이관하는 전략 수립

---

## 마이그레이션 개요

### 이관 대상

| 구분 | 원본 | 대상 | 데이터량 (추정) |
|------|------|------|----------------|
| 고객 데이터 | MSSQL (로컬) | PostgreSQL (클라우드) | __만 건 |
| 주문 데이터 | MSSQL (로컬) | PostgreSQL (클라우드) | __만 건 |
| CS 이력 | MSSQL (로컬) | PostgreSQL (클라우드) | __만 건 |
| 구독 정보 | MSSQL (로컬) | PostgreSQL (클라우드) | __만 건 |

### 이관 전략

```
┌─────────────────────────────────────────────────────────────────┐
│                      마이그레이션 전략                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [1단계: 준비]                                                   │
│      │                                                          │
│      ├── 소스 데이터 분석                                        │
│      ├── 매핑 테이블 작성                                        │
│      └── ETL 스크립트 개발                                       │
│                                                                 │
│  [2단계: 테스트 이관]                                            │
│      │                                                          │
│      ├── 샘플 데이터 이관                                        │
│      ├── 검증 및 수정                                           │
│      └── 반복 테스트                                            │
│                                                                 │
│  [3단계: 본 이관]                                                │
│      │                                                          │
│      ├── 전체 데이터 이관                                        │
│      ├── 정합성 검증                                            │
│      └── 차이 데이터 동기화                                      │
│                                                                 │
│  [4단계: 전환]                                                   │
│      │                                                          │
│      ├── 신규 시스템 오픈                                        │
│      ├── 기존 시스템 폐쇄                                        │
│      └── 병행 운영 기간 종료                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 데이터 매핑

### 테이블 매핑

| AS-IS (MSSQL) | TO-BE (PostgreSQL) | 변환 규칙 |
|---------------|-------------------|----------|
| (분석 후 작성) | customers | |
| | subscriptions | |
| | orders | |
| | order_items | |
| | cs_tickets | |
| | cs_histories | |

### 필드 매핑 예시

| AS-IS 필드 | TO-BE 필드 | 타입 변환 | 데이터 변환 |
|-----------|-----------|----------|------------|
| CustNo | customer_code | VARCHAR→VARCHAR | 앞 0 패딩 |
| CustNm | name | NVARCHAR→VARCHAR | 공백 제거 |
| Phone | phone | VARCHAR→VARCHAR | 숫자만 추출 |
| RegDt | created_at | DATETIME→TIMESTAMP | UTC 변환 |

---

## ETL 프로세스

### 1. Extract (추출)

```sql
-- MSSQL에서 데이터 추출 예시
SELECT 
    CustNo,
    CustNm,
    Phone,
    Email,
    RegDt
FROM Customer
WHERE DelYn = 'N'
```

### 2. Transform (변환)

```python
# 변환 로직 예시 (Python)
def transform_customer(row):
    return {
        'customer_code': row['CustNo'].zfill(10),
        'name': row['CustNm'].strip(),
        'phone': re.sub(r'\D', '', row['Phone']),
        'email': row['Email'].lower() if row['Email'] else None,
        'created_at': row['RegDt'].replace(tzinfo=timezone.utc)
    }
```

### 3. Load (적재)

```sql
-- PostgreSQL에 데이터 적재
INSERT INTO customers (customer_code, name, phone, email, created_at)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (customer_code) DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email;
```

---

## 검증 방안

### 1. 건수 검증

| 테이블 | AS-IS 건수 | TO-BE 건수 | 차이 | 원인 |
|--------|-----------|-----------|------|------|
| 고객 | | | | |
| 주문 | | | | |
| CS | | | | |

### 2. 데이터 정합성 검증

```sql
-- 합계 검증 예시
-- AS-IS
SELECT COUNT(*), SUM(Amount) FROM Orders WHERE YEAR(OrderDt) = 2024;

-- TO-BE
SELECT COUNT(*), SUM(total_amount) FROM orders 
WHERE EXTRACT(YEAR FROM order_date) = 2024;
```

### 3. 샘플 검증

- 무작위 샘플 100건 추출
- 원본-대상 1:1 대조
- 불일치 항목 분석

---

## 전환 시나리오

### 옵션 1: 빅뱅 전환

```
[기존 시스템 운영] ──▶ [일시 중단 (4시간)] ──▶ [신규 시스템 오픈]
                              │
                              ▼
                        [데이터 이관]
```

**장점:** 전환 기간 짧음, 단순함  
**단점:** 리스크 높음, 롤백 어려움

### 옵션 2: 단계적 전환 (권장)

```
[기존 시스템] ────────────▶ [종료]
       │                       │
       ├── [1주] 병행 운영 ────┤
       │                       │
       ▼                       ▼
[신규 시스템] ────────────▶ [단독 운영]
```

**장점:** 리스크 분산, 롤백 가능  
**단점:** 병행 운영 부담

---

## 롤백 계획

### 롤백 트리거

| 상황 | 조치 |
|------|------|
| 데이터 정합성 90% 미만 | 이관 중단, 원인 분석 |
| 주요 기능 오류 | 기존 시스템 복귀 |
| 성능 기준 미달 | 기존 시스템 복귀 |

### 롤백 절차

1. 신규 시스템 접근 차단
2. 기존 시스템 재활성화
3. 변경 데이터 역이관 (Delta)
4. 원인 분석 및 재이관 계획

---

## 일정 계획

| 단계 | 기간 | 활동 |
|:---:|:---:|------|
| 준비 | 1주 | 매핑 테이블, ETL 개발 |
| 테스트 | 1주 | 샘플 이관, 검증, 수정 |
| 본 이관 | 1일 | 전체 데이터 이관 |
| 검증 | 2일 | 정합성 검증 |
| 전환 | 1일 | 시스템 전환 |
| 안정화 | 2주 | 병행 운영, 모니터링 |

---

## 작성 이력

| 날짜 | 작성자 | 변경 내용 |
|------|--------|----------|
| YYYY-MM-DD | - | 초안 작성 |
