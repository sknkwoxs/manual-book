---
title: "3.3 서비스 AI 및 플랫폼"
description: 의미 기반 검색, RAG QA, 자동 요약, 맞춤 추천
sidebar:
  order: 3
---

## AI 활용 방안

---

### 1. 의미 기반 검색 (Semantic Search)

**아키텍처:**
```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'fontSize': '14px' }}}%%
flowchart TB
    Q["사용자 쿼리<br/>'반도체 지원 관련 여야 논쟁'"]
    
    subgraph analysis["쿼리 분석"]
        A["의도 파악, 엔티티 추출<br/>• 주제: 반도체 지원<br/>• 필터: 여야 논쟁 (쟁점 있음)"]
    end
    
    E["쿼리 임베딩<br/>(벡터 변환)"]
    
    subgraph search["검색 처리"]
        S1["벡터검색<br/>(유사도)"]
        S2["키워드<br/>검색"]
        S3["그래프<br/>탐색"]
    end
    
    R["결과 통합 (Re-rank)<br/>순위 재조정, 중복 제거"]
    
    O["검색 결과 + 하이라이트"]
    
    Q --> A --> E
    E --> S1 & S2 & S3
    S1 & S2 & S3 --> R --> O
    
    style analysis fill:#f5f5f5,stroke:#666,stroke-width:1px
    style search fill:#f5f5f5,stroke:#666,stroke-width:1px
```

**검색 유형:**
| 유형 | 방식 | 적합한 쿼리 |
|------|------|-------------|
| 벡터 검색 | 임베딩 유사도 | "탄소중립 정책 방향" |
| 키워드 검색 | BM25, 형태소 | "제21대 국회 2100001" |
| 하이브리드 | 벡터 + 키워드 | 대부분의 쿼리 |
| 그래프 탐색 | 관계 기반 | "김OO 의원 발의 법안" |

---

### 2. 대화형 QA (RAG)

**RAG 파이프라인:**
```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'fontSize': '14px' }}}%%
flowchart TB
    Q["사용자 질문<br/>'반도체특별법 주요 쟁점이 뭐야?'"]
    
    subgraph step1["1. 질문 분석 (Query Understanding)"]
        A1["• 질문 유형: 쟁점 요약<br/>• 핵심 엔티티: 반도체특별법<br/>• 필요 정보: 회의록 발언, 쟁점 구간"]
    end
    
    subgraph step2["2. 관련 문서 검색 (Retrieval)"]
        A2["• 벡터 검색: 반도체특별법 관련 문서 Top 20<br/>• 그래프 탐색: 법안 → 심사 회의록 → 쟁점 발언<br/>• 결과: 관련 회의록 5건, 법안 심사보고서 1건"]
    end
    
    subgraph step3["3. 컨텍스트 구성 (Context Assembly)"]
        A3["• 관련 발언 추출 + 순서 정렬<br/>• 찬반 입장별 그룹핑<br/>• 토큰 제한 내 최적 구성"]
    end
    
    subgraph step4["4. 답변 생성 (Generation)"]
        A4["• LLM 프롬프트: 질문 + 컨텍스트 + 지침<br/>• 출처 명시 강제<br/>• 확신도 낮으면 '확인 필요' 표시"]
    end
    
    R["답변 + 출처 링크 + 신뢰도 표시"]
    
    Q --> step1 --> step2 --> step3 --> step4 --> R
    
    style step1 fill:#f5f5f5,stroke:#666,stroke-width:1px
    style step2 fill:#f5f5f5,stroke:#666,stroke-width:1px
    style step3 fill:#f5f5f5,stroke:#666,stroke-width:1px
    style step4 fill:#f5f5f5,stroke:#666,stroke-width:1px
```

---

### 3. 자동 요약

**요약 유형:**
| 유형 | 입력 | 출력 | 용도 |
|------|------|------|------|
| 3줄 요약 | 회의록/법안 | 3문장 핵심 | 빠른 파악 |
| 쟁점 요약 | 회의록 | 찬반 정리 | 논쟁 이해 |
| 경과 요약 | 법안 이력 | 타임라인 | 진행 상황 |
| 비교 요약 | 복수 법안 | 차이점 | 법안 비교 |

**요약 품질 관리:**
```yaml
요약 품질 체크리스트:
  - 사실 정확성: 원문과 불일치 없음
  - 핵심 포함: 주요 내용 누락 없음
  - 균형성: 특정 입장 편향 없음
  - 출처 명시: 모든 주장에 근거 링크
  - 용어 정확: 법률/정책 용어 오용 없음
```

---

### 4. 맞춤 추천

**추천 시나리오:**
```
[사용자: 환경 분야 연구자]

관심 기록 추천:
├── 이번 주 환경 관련 새 회의록 3건
├── 환노위 계류 법안 업데이트 2건
├── "탄소중립" 키워드 새 발언 15건
└── 2024 환경부 국감 자료 공개

[개인화 설정]
• 관심 분야: 환경, 에너지
• 알림 키워드: 탄소중립, RE100, 그린뉴딜
• 팔로우 의원: 환노위 소속 의원 15명
```

---

## 플랫폼 설계 방향

---

### 1. 서비스 아키텍처

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'fontSize': '14px' }}}%%
flowchart TB
    subgraph architecture["서비스 계층 아키텍처"]
        direction TB
        
        subgraph frontend["프론트엔드"]
            F["웹앱 | 모바일앱 | 챗봇 | 위젯"]
        end
        
        subgraph gateway["API Gateway"]
            G["인증 | 요청 라우팅 | Rate Limit | 로깅"]
        end
        
        subgraph services["서비스 계층"]
            SV1["검색<br/>Service"]
            SV2["QA<br/>Service"]
            SV3["요약<br/>Service"]
            SV4["추천<br/>Service"]
            SV5["분석<br/>Service"]
        end
        
        subgraph aiml["AI/ML 플랫폼"]
            AI["LLM | 임베딩 | 분류 | NER | 요약 모델"]
        end
        
        subgraph data["데이터 계층"]
            D["벡터DB | 그래프DB | 검색엔진 | 캐시"]
        end
    end
    
    F --> G
    G --> SV1 & SV2 & SV3 & SV4 & SV5
    SV1 & SV2 & SV3 & SV4 & SV5 --> AI
    AI --> D
    
    style frontend fill:#fff,stroke:#333,stroke-width:1px
    style gateway fill:#f5f5f5,stroke:#666,stroke-width:1px
    style services fill:#fff,stroke:#333,stroke-width:1px
    style aiml fill:#f5f5f5,stroke:#666,stroke-width:1px
    style data fill:#fff,stroke:#333,stroke-width:1px
```

---

### 2. AI 서비스 API 설계

```yaml
# 검색 API
POST /api/v1/search
  body:
    query: "반도체 지원 정책"
    filters:
      type: ["bill", "minutes"]
      date_range: ["2023-01-01", "2024-12-31"]
    mode: "hybrid"  # vector, keyword, hybrid
    limit: 20

# QA API
POST /api/v1/qa
  body:
    question: "반도체특별법 주요 쟁점은?"
    context_limit: 5000
    include_sources: true

# 요약 API
POST /api/v1/summarize
  body:
    document_id: "minutes_2024_001"
    type: "brief"  # brief, issues, timeline
    max_length: 500

# 추천 API
GET /api/v1/recommend
  params:
    user_id: "user_123"
    type: "related"  # related, trending, personalized
```

---

### 3. 품질 관리 (환각 방지)

**환각 방지 전략:**
| 전략 | 구현 방법 |
|------|-----------|
| **근거 필수** | 모든 답변에 출처 문서 링크 필수 |
| **신뢰도 표시** | 답변 확신도 % 표시 |
| **사실 검증** | 생성 답변과 원문 자동 대조 |
| **범위 제한** | 아카이브 내 정보만 답변 |
| **불확실성 인정** | "확인 필요" 표시 적극 활용 |

**모니터링 대시보드:**
```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'fontSize': '14px' }}}%%
flowchart TB
    subgraph monitor["AI 서비스 품질 모니터링"]
        direction TB
        
        subgraph metrics["오늘의 서비스 지표"]
            M1["검색 요청: 15,234건"]
            M2["QA 질의: 3,456건"]
            M3["평균 응답시간: 1.2초"]
            M4["사용자 만족도: 4.3/5"]
        end
        
        subgraph alerts["품질 알림"]
            A1["환각 의심 답변: 12건 (검토 필요)"]
            A2["출처 매칭 실패: 5건"]
            A3["사용자 신고: 2건"]
        end
        
        T["주간 트렌드<br/>[그래프: 검색량, 정확도, 만족도 추이]"]
    end
    
    style monitor fill:#fff,stroke:#333,stroke-width:1px
    style metrics fill:#f5f5f5,stroke:#666,stroke-width:1px
    style alerts fill:#f5f5f5,stroke:#666,stroke-width:1px
```

---

## 핵심 요약

| 구분 | 현행 | To-Be |
|------|------|-------|
| **검색** | 키워드 검색 | 의미 기반 + 대화형 QA |
| **이해** | 원문 직접 읽기 | AI 요약, 쉬운 설명 |
| **탐색** | 수동 링크 이동 | 지식 그래프 기반 추천 |
| **개인화** | 동일 화면 | 관심사 기반 맞춤 서비스 |
| **신뢰** | 출처 확인 어려움 | 모든 답변에 근거 명시 |

> **"AI가 복잡한 입법 과정을 쉽게 풀어주고, 숨겨진 정보를 찾아준다."**
