---
title: 현황(AS-IS) 및 개선방향(TO-BE)
description: 좋은생각 CS 시스템의 현재 상태와 목표 상태 비교 분석
---

# 현황(AS-IS) 및 개선방향(TO-BE)

## 핵심 전환 비전

> **"단절과 수작업"에서 "연결과 자동화"로**

---

## 상세 비교표

| 구분 | 현황 (AS-IS) | 개선방향 (TO-BE) |
|:---|:---|:---|
| **아키텍처** | • PC 설치형 프로그램 (C/S) 방식<br>• 웹(CMS/쇼핑몰)과 기술적 연동(API) 불가 | • 100% 웹 기반 (Web-based) 시스템 전환<br>• 장소/PC 제약 없는 접속 및 실시간 연동 구현 |
| **데이터** | • 채널별(자사몰, 외부몰, 후원) 데이터 고립<br>• 담당자의 Excel 수기 취합 및 업로드 필수 | • 고객/주문 데이터 통합 DB 일원화<br>• API/스크래핑을 활용한 데이터 수집 자동화 |
| **프로세스** | • 데이터 단절로 인한 결제-권한 부여 지연<br>• 수작업 의존으로 휴먼 에러 상존 | • CS ↔ CMS 실시간 동기화 (결제 즉시 열람)<br>• 시스템 주도의 표준화된 자동 처리 프로세스 |

---

## AS-IS 상세 분석

### 1. 아키텍처 현황

```mermaid
graph TD
    subgraph CS["CS 환경"]
        A["CS 프로그램<br/>(Tobesoft)<br/>로컬 설치"]
    end
    
    subgraph WEB["웹 환경"]
        B["웹 시스템<br/>(CMS/쇼핑몰)"]
    end
    
    subgraph DB["데이터베이스"]
        C["MSSQL DB<br/>(로컬)"]
        D["별도 DB"]
    end
    
    A --> C
    B --> D
    
    C -.->|연동 불가| D
    
    style CS fill:#ffccbc
    style WEB fill:#b3e5fc
    style DB fill:#f0f4c3
```

**문제점:**
- [ ] 특정 PC에서만 접근 가능
- [ ] 시스템 간 데이터 연동 불가
- [ ] 실시간 정보 공유 제한

### 2. 데이터 현황

| 채널 | 데이터 위치 | 통합 방식 |
|------|------------|----------|
| 자사몰 | 별도 DB | Excel 수작업 |
| 외부몰 | 외부 플랫폼 | Excel 수작업 |
| 후원 | CS 프로그램 | - |

**문제점:**
- [ ] 고객 정보 중복 및 불일치
- [ ] 채널별 매출 통합 어려움
- [ ] 히스토리 추적 불가

### 3. 프로세스 현황

```mermaid
flowchart LR
    A["주문발생"] --> B["Excel 다운로드"]
    B --> C["수기 취합"]
    C --> D["CS 입력"]
    D --> E["권한 부여"]
    
    F["휴먼 에러 발생 구간"]
    
    D -.->|에러| F
    
    style A fill:#c8e6c9
    style E fill:#c8e6c9
    style F fill:#ffccbc
    style C fill:#fff9c4
    style D fill:#fff9c4
```

**문제점:**
- [ ] 처리 지연 (최대 __시간)
- [ ] 입력 오류 발생률
- [ ] 담당자 부재 시 업무 마비

---

## TO-BE 목표 모델

### 1. 아키텍처 목표

```mermaid
graph TD
    subgraph WEB["웹 기반 통합 시스템"]
        A["CS Admin"]
        B["CMS"]
        C["쇼핑몰"]
        
        A --> D["통합 DB<br/>(Cloud)"]
        B --> D
        C --> D
    end
    
    style WEB fill:#c8e6c9
    style D fill:#fff9c4
```

### 2. 데이터 통합 목표

- **단일 고객 뷰**: 모든 채널의 고객 정보 통합
- **실시간 동기화**: API/Webhook 기반 자동 연동
- **데이터 정합성**: 마스터 데이터 관리 체계

### 3. 자동화 프로세스 목표

```mermaid
flowchart LR
    A["주문발생"] --> B["자동 수집"]
    B --> C["자동 처리"]
    C --> D["즉시 권한 부여"]
    D --> E["알림 발송"]
    
    F["시스템 자동 처리"]
    
    C -.->|시스템 자동| F
    
    style A fill:#c8e6c9
    style E fill:#c8e6c9
    style F fill:#c8e6c9
    style B fill:#b3e5fc
    style C fill:#b3e5fc
    style D fill:#b3e5fc
```

---

## 전환 전략

| 단계 | 목표 | 핵심 활동 |
|:---:|:---|:---|
| 1 | 분석 | 현행 시스템 역공학, 요구사항 도출 |
| 2 | 설계 | 아키텍처, ERD, 프로세스 설계 |
| 3 | 계획 | 마이그레이션, RFP 작성 |

---

## 작성 이력

| 날짜 | 작성자 | 변경 내용 |
|------|--------|----------|
| YYYY-MM-DD | - | 초안 작성 |
