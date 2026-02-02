---
title: "3.2 기록 유형별 서비스 전략"
description: 회의록, 법안, 의정활동, 국정감사의 서비스 전략
sidebar:
  order: 2
---

## 5대 기록 유형의 서비스 전략

각 기록 유형별로 서비스 기능과 UI를 정의한다.

---

## 회의록/속기록 서비스

**핵심 기능:**
| 기능 | 설명 | AI 적용 |
|------|------|---------|
| **쟁점 요약** | 회의의 핵심 논점 자동 추출 | 토픽 모델링, 요약 |
| **발언 검색** | 특정 주제/의원 발언 찾기 | 의미 검색, 필터링 |
| **감성 분석** | 찬반 입장, 논쟁 구간 표시 | 감성 분석, 하이라이트 |
| **타임라인** | 회의 흐름 시각화 | 구간 분리, 안건별 정리 |

**UI 예시:**
```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'fontSize': '14px' }}}%%
flowchart TB
    subgraph viewer["회의록 뷰어"]
        direction TB
        H1["제21대 국회 산업통상자원위원회 제5차 회의록<br/>2024.03.15 | 2시간 30분 | 참석 15인"]
        
        subgraph summary["AI 3줄 요약"]
            S1["1. 반도체특별법 개정안 심사, 세제 지원 범위가 핵심 쟁점"]
            S2["2. 여당은 대기업 포함 주장, 야당은 중소기업 집중 요구"]
            S3["3. 법안소위 회부 의결, 추가 논의 예정"]
        end
        
        subgraph agenda["안건별 보기"]
            A1["[1] 반도체특별법 개정안 (45분) - 쟁점 있음"]
            A2["[2] 에너지전환법안 (30분)"]
            A3["[3] 기타 안건 (15분)"]
        end
        
        subgraph speakers["발언자별 보기"]
            P1["김OO 위원장 (8회)"]
            P2["이OO 의원 (12회) - 세제 지원 확대 주장"]
            P3["박OO 의원 (9회) - 중소기업 우선 주장"]
        end
    end
    
    style viewer fill:#fff,stroke:#333,stroke-width:1px
    style summary fill:#f5f5f5,stroke:#666,stroke-width:1px
    style agenda fill:#fff,stroke:#333,stroke-width:1px
    style speakers fill:#fff,stroke:#333,stroke-width:1px
```

---

## 법안/의안 서비스

**핵심 기능:**
| 기능 | 설명 | AI 적용 |
|------|------|---------|
| **타임라인 뷰어** | 발의→심사→의결 과정 시각화 | 이벤트 추출, 연결 |
| **쉬운 설명** | 법안 내용을 일반인 언어로 | LLM 요약, 용어 설명 |
| **유사 법안** | 관련/유사 법안 자동 추천 | 벡터 유사도 검색 |
| **조문 비교** | 신구조문 자동 대비 | 텍스트 diff, 시각화 |

**UI 예시:**
```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'fontSize': '14px' }}}%%
flowchart TB
    subgraph billpage["법안 상세 페이지"]
        direction TB
        H1["반도체 산업 경쟁력 강화를 위한 특별조치법 일부개정법률안<br/>의안번호: 2100001 | 상태: 위원회 심사중"]
        
        subgraph explanation["AI 쉬운 설명"]
            E1["이 법안은 반도체 기업에 대한 세금 혜택을 늘리자는 내용입니다."]
            E2["• 지금: 대기업 6%, 중소기업 16% 세액공제"]
            E3["• 바꾸면: 대기업 15%, 중소기업 25% 세액공제"]
            E4["쉽게 말해, 반도체 공장 지을 때 세금을 더 깎아주겠다는 거예요."]
        end
        
        subgraph timeline["법안 타임라인"]
            T1(("발의<br/>01.15"))
            T2(("회부<br/>01.20"))
            T3(("1차심사<br/>03.15"))
            T4((" 2차심사<br/>(예정)"))
            T5(("의결<br/>(예정)"))
            T1 --- T2 --- T3 -.- T4 -.- T5
        end
        
        subgraph similar["유사 법안 (AI 추천)"]
            S1["반도체클러스터지원법안 (유사도 92%)"]
            S2["첨단산업특별법안 (유사도 78%)"]
            S3["2021년 반도체특별법 원안 (모법)"]
        end
    end
    
    style billpage fill:#fff,stroke:#333,stroke-width:1px
    style explanation fill:#f5f5f5,stroke:#666,stroke-width:1px
    style timeline fill:#fff,stroke:#333,stroke-width:1px
    style similar fill:#fff,stroke:#333,stroke-width:1px
```

---

## 의정활동 서비스

**핵심 기능:**
| 기능 | 설명 | AI 적용 |
|------|------|---------|
| **의원 프로필** | 활동 요약, 관심 분야 | 패턴 분석, 자동 생성 |
| **활동 비교** | 의원 간 활동 비교 | 통계 분석, 시각화 |
| **발언 하이라이트** | 주요 발언 자동 추출 | 중요도 판단, 요약 |

---

## 국정감사 서비스

**핵심 기능:**
| 기능 | 설명 | AI 적용 |
|------|------|---------|
| **QA 검색** | 질의-답변 쌍 검색 | QA 추출, 의미 검색 |
| **이행 추적** | 시정요구 이행 현황 | 상태 추적, 알림 |
| **연도별 비교** | 동일 기관 연도별 쟁점 | 트렌드 분석 |

---

## 통합 검색/QA 서비스

**대화형 QA 예시:**
```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'fontSize': '14px' }}}%%
flowchart TB
    subgraph assistant["국회기록 AI 도우미"]
        direction TB
        Q["사용자: 기후변화 관련 법안 중에서 여야 간 쟁점이 컸던 것 알려줘"]
        
        A["AI: 기후변화 관련 주요 쟁점 법안을 정리해드릴게요."]
        
        subgraph result1["1. 탄소중립기본법 (2021)"]
            R1["쟁점: 2030년 감축 목표율 (여당 40% vs 야당 35%)<br/>결과: 40%로 가결"]
        end
        
        subgraph result2["2. 재생에너지특별법안 (2023, 계류중)"]
            R2["쟁점: RE100 의무화 범위<br/>현황: 상임위 심사 진행 중"]
        end
        
        subgraph result3["3. 환경영향평가법 개정안 (2022)"]
            R3["쟁점: 신재생에너지 시설 평가 간소화<br/>결과: 수정가결"]
        end
        
        F["더 자세히 알고 싶은 법안이 있으신가요?"]
    end
    
    Q --> A --> result1 --> result2 --> result3 --> F
    
    style assistant fill:#fff,stroke:#333,stroke-width:1px
    style result1 fill:#f5f5f5,stroke:#666,stroke-width:1px
    style result2 fill:#f5f5f5,stroke:#666,stroke-width:1px
    style result3 fill:#f5f5f5,stroke:#666,stroke-width:1px
```

---

## 서비스 요약

| 기록 유형 | 핵심 서비스 | AI 기능 |
|-----------|------------|---------|
| 회의록/속기록 | 쟁점 요약, 발언 검색 | 요약, 의미 검색 |
| 법안/의안 | 타임라인, 쉬운 설명 | LLM 요약, 유사도 검색 |
| 의정활동 | 의원 프로필, 비교 | 패턴 분석 |
| 국정감사 | QA 검색, 이행 추적 | QA 추출 |
| 통합 | 대화형 QA | RAG |
