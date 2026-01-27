---
title: "API 엔드포인트"
---

# API 엔드포인트

## 개요

LLM Search Service의 API는 3개의 주요 라우터로 구성됩니다:

| 라우터 | 경로 | 설명 |
|--------|------|------|
| **Keywords** | `/api/keywords` | 키워드 확장 및 동의어 제안 |
| **Benchmark** | `/api/benchmark` | 성능 비교 벤치마크 |
| **PageIndex** | `/api/pageindex` | 심층 문서 분석 |

**Base URL**: `http://localhost:8000` (로컬 개발)

**API 문서**:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## 1. Keywords API (`/api/keywords`)

### 1.1 기본 키워드 확장

**POST** `/api/keywords/expand`

검색어를 확장하여 연관 키워드를 반환합니다.

#### Request Body
```json
{
  "query": "서울 인구",
  "max_keywords": 5,
  "provider": "openai"  // "ollama" | "openai" | null(기본값)
}
```

#### Response
```json
{
  "original_query": "서울 인구",
  "expanded_keywords": ["서울시 인구수", "인구 변화", "인구 통계", "인구 추이", "서울 주민등록인구"],
  "source": "openai",
  "model": "gpt-4o",
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 45,
    "total_tokens": 195,
    "estimated_cost_usd": 0.000825,
    "response_time_ms": 1234.56
  }
}
```

### 1.2 RAG 키워드 확장

**POST** `/api/keywords/expand/rag`

서비스 메타데이터 컨텍스트를 활용한 키워드 확장입니다.

#### Request Body
```json
{
  "query": "강남구 경제 현황",
  "max_keywords": 5,
  "include_samples": false
}
```

#### Response
```json
{
  "original_query": "강남구 경제 현황",
  "expanded_keywords": ["강남구 사업체수", "강남구 GRDP", "강남구 창업", "강남구 일자리", "강남구 소득수준"],
  "source": "openai_rag",
  "model": "gpt-4o",
  "usage": {...},
  "context_used": true,
  "detected_categories": ["경제"],
  "detected_district": "강남구",
  "sample_count": null
}
```

### 1.3 확장 RAG 키워드 확장 (ES 샘플 포함)

**POST** `/api/keywords/expand/rag-extended`

Elasticsearch 샘플 데이터를 포함한 확장 RAG입니다.

#### Request Body
```json
{
  "query": "서울 대기오염",
  "max_keywords": 5
}
```

#### Response
```json
{
  "original_query": "서울 대기오염",
  "expanded_keywords": ["미세먼지 농도", "PM2.5", "대기질 지수", "대기환경 현황", "오존 농도"],
  "source": "openai_rag_extended",
  "model": "gpt-4o",
  "usage": {...},
  "context_used": true,
  "detected_categories": ["환경"],
  "detected_district": null,
  "sample_count": 5
}
```

### 1.4 동의어 제안

**POST** `/api/keywords/suggest`

특정 키워드에 대한 동의어/유의어를 제안합니다.

#### Request Body
```json
{
  "keyword": "인구",
  "provider": "openai"
}
```

#### Response
```json
{
  "keyword": "인구",
  "synonyms": ["주민", "인구수", "거주자", "시민", "주민수"],
  "source": "openai",
  "model": "gpt-4o",
  "usage": {...},
  "status": "pending_approval"
}
```

### 1.5 검색 의도 분석

**POST** `/api/keywords/intent`

검색어의 의도와 카테고리를 분석합니다.

#### Request Body
```json
{
  "query": "최근 5년간 서울 청년 실업률 변화"
}
```

#### Response
```json
{
  "query": "최근 5년간 서울 청년 실업률 변화",
  "analysis": {
    "intent": "트렌드 분석",
    "category": "경제",
    "time_scope": "추세",
    "region_scope": "서울 전체",
    "confidence": 0.92
  },
  "source": "openai",
  "model": "gpt-4o",
  "usage": {...}
}
```

### 1.6 연결 테스트

**GET** `/api/keywords/test?provider=openai`

LLM 연결 상태를 테스트합니다.

#### Response
```json
{
  "status": "ok",
  "provider": "openai",
  "model": "gpt-4o",
  "response": "연결 성공",
  "usage": {
    "response_time_ms": 456.78
  }
}
```

**GET** `/api/keywords/test/all`

모든 provider를 동시에 테스트합니다.

#### Response
```json
{
  "providers": {
    "ollama": {
      "status": "ok",
      "model": "qwen3:8b",
      "response_time_ms": 2345.67
    },
    "openai": {
      "status": "ok",
      "model": "gpt-4o",
      "response_time_ms": 567.89
    }
  }
}
```

### 1.7 컨텍스트 조회

**GET** `/api/keywords/context/categories`

RAG에 사용되는 카테고리 정보를 조회합니다.

**POST** `/api/keywords/context/build?query=서울 인구`

검색어에 대해 생성되는 RAG 컨텍스트를 미리 확인합니다.

---

## 2. Benchmark API (`/api/benchmark`)

### 2.1 단일 쿼리 벤치마크

**POST** `/api/benchmark/single`

여러 provider/mode를 동시에 테스트하여 비교합니다.

#### Request Body
```json
{
  "query": "서울 인구 변화",
  "max_keywords": 5,
  "providers": ["ollama", "openai"],
  "include_rag": true
}
```

#### Response
```json
{
  "query": "서울 인구 변화",
  "timestamp": "2026-01-26T12:00:00.000000",
  "results": [
    {
      "provider": "ollama",
      "mode": "basic",
      "success": true,
      "keywords": ["인구 통계", "인구수", ...],
      "response_time_ms": 2500.0,
      "token_usage": null,
      "estimated_cost_usd": 0.0
    },
    {
      "provider": "openai",
      "mode": "basic",
      "success": true,
      "keywords": ["서울시 인구", ...],
      "response_time_ms": 800.0,
      "token_usage": {"prompt_tokens": 150, "completion_tokens": 50},
      "estimated_cost_usd": 0.000875
    },
    {
      "provider": "openai",
      "mode": "rag",
      "success": true,
      "keywords": [...],
      "response_time_ms": 1200.0,
      "token_usage": {...},
      "estimated_cost_usd": 0.001250
    },
    {
      "provider": "openai",
      "mode": "rag_extended",
      "success": true,
      "keywords": [...],
      "response_time_ms": 1800.0,
      "token_usage": {...},
      "estimated_cost_usd": 0.001500
    }
  ],
  "summary": {
    "total_tests": 4,
    "successful_tests": 4,
    "failed_tests": 0,
    "by_provider": {
      "ollama_basic": {"success_count": 1, "avg_response_time_ms": 2500.0, ...},
      "openai_basic": {"success_count": 1, "avg_response_time_ms": 800.0, ...},
      "openai_rag": {...},
      "openai_rag_extended": {...}
    },
    "fastest_provider": "openai_basic"
  }
}
```

### 2.2 배치 벤치마크

**POST** `/api/benchmark/batch`

여러 쿼리를 순차적으로 테스트합니다.

#### Request Body
```json
{
  "queries": [
    "서울 인구 변화",
    "강남구 경제 현황",
    "서울 대기오염",
    "지하철 이용객"
  ],
  "max_keywords": 5,
  "providers": ["ollama", "openai"],
  "include_rag": true,
  "delay_between_queries": 0.5
}
```

#### Response
```json
{
  "total_queries": 4,
  "timestamp": "2026-01-26T12:00:00.000000",
  "results": [
    {"query": "서울 인구 변화", "results": [...], "summary": {...}},
    {"query": "강남구 경제 현황", "results": [...], "summary": {...}},
    ...
  ],
  "aggregate_summary": {
    "total_tests": 16,
    "successful_tests": 16,
    "failed_tests": 0,
    "by_provider": {
      "ollama_basic": {
        "success_count": 4,
        "avg_response_time_ms": 2450.5,
        "total_cost_usd": 0.0,
        "avg_keywords": 5.0
      },
      "openai_basic": {
        "success_count": 4,
        "avg_response_time_ms": 850.2,
        "total_cost_usd": 0.0035,
        "avg_keywords": 5.0
      },
      ...
    },
    "fastest_provider": "openai_basic",
    "total_queries": 4
  }
}
```

### 2.3 빠른 비교

**GET** `/api/benchmark/compare?query=서울 인구&max_keywords=5`

단일 쿼리에 대한 간단한 비교 결과를 반환합니다.

#### Response
```json
{
  "query": "서울 인구",
  "comparison": [
    {
      "provider_mode": "ollama_basic",
      "success": true,
      "response_time_ms": 2500.0,
      "keyword_count": 5,
      "keywords": ["인구 통계", "인구수", "주민등록"],
      "cost_usd": 0.0
    },
    {
      "provider_mode": "openai_basic",
      "success": true,
      "response_time_ms": 800.0,
      "keyword_count": 5,
      "keywords": ["서울시 인구", "인구 변화", "인구 추이"],
      "cost_usd": 0.000875
    },
    {
      "provider_mode": "openai_rag",
      "success": true,
      "response_time_ms": 1200.0,
      "keyword_count": 5,
      "keywords": ["주민등록인구", "인구밀도", "세대수"],
      "cost_usd": 0.001250
    }
  ],
  "winner": {
    "fastest": "openai_basic",
    "cheapest": "ollama_basic"
  }
}
```

### 2.4 사용량 통계

**GET** `/api/benchmark/usage-stats`

현재 세션의 OpenAI 사용량을 조회합니다.

#### Response
```json
{
  "openai": {
    "total_requests": 25,
    "total_prompt_tokens": 3750,
    "total_completion_tokens": 1250,
    "total_cost_usd": 0.021875
  },
  "note": "세션 내 누적 사용량입니다."
}
```

### 2.5 벤치마크 프리셋

**GET** `/api/benchmark/presets`

카테고리별 샘플 쿼리 목록을 반환합니다.

---

## 3. PageIndex API (`/api/pageindex`)

### 3.1 트리 인덱스 생성

**POST** `/api/pageindex/tree/build`

문서 내용을 분석하여 계층적 트리 구조(목차)를 생성합니다.

#### Request Body
```json
{
  "doc_id": "insight_report_2024_01",
  "content": "# 서울시 인구 동향 분석\n\n## 1. 개요\n서울시 인구는...\n\n## 2. 연도별 추이\n...",
  "title": "2024년 서울시 인구 동향 분석 리포트",
  "force_rebuild": false
}
```

#### Response
```json
{
  "doc_id": "insight_report_2024_01",
  "title": "2024년 서울시 인구 동향 분석 리포트",
  "description": "서울시 인구 변화와 추이를 분석한 종합 리포트",
  "nodes": [
    {
      "node_id": "001",
      "title": "개요",
      "summary": "서울시 인구 현황 소개",
      "start_position": "# 서울시 인구 동향",
      "sub_nodes": []
    },
    {
      "node_id": "002",
      "title": "연도별 추이",
      "summary": "2019-2024년 인구 변화 분석",
      "start_position": "## 2. 연도별 추이",
      "sub_nodes": [
        {
          "node_id": "002-1",
          "title": "총인구 변화",
          "summary": "서울 총인구 증감 추이"
        },
        {
          "node_id": "002-2",
          "title": "연령별 분포",
          "summary": "연령대별 인구 구성 변화"
        }
      ]
    }
  ],
  "model": "gpt-4o",
  "cached": false
}
```

### 3.2 트리 검색

**POST** `/api/pageindex/tree/search`

캐시된 트리 구조를 기반으로 관련 섹션을 추론 검색합니다.

#### Request Body
```json
{
  "doc_id": "insight_report_2024_01",
  "query": "65세 이상 고령 인구 비율은?"
}
```

#### Response
```json
{
  "query": "65세 이상 고령 인구 비율은?",
  "doc_id": "insight_report_2024_01",
  "relevant_nodes": ["002-2", "003"],
  "reasoning": "질문이 연령별 인구 분포에 관한 것이므로, '연령별 분포' 섹션(002-2)과 '고령화 현황' 섹션(003)이 관련됩니다.",
  "confidence": 0.89,
  "suggested_answer_sections": ["연령별 분포", "고령화 현황"]
}
```

### 3.3 문서 분석 (전체 파이프라인)

**POST** `/api/pageindex/analyze`

트리 생성과 검색을 한 번에 수행합니다.

#### Request Body
```json
{
  "doc_id": "monitoring_2024_q1",
  "content": "...(긴 문서 내용)...",
  "query": "1분기 주요 정책 성과는?",
  "title": "2024년 1분기 서울시 정책 모니터링"
}
```

#### Response
```json
{
  "success": true,
  "query": "1분기 주요 정책 성과는?",
  "doc_id": "monitoring_2024_q1",
  "doc_title": "2024년 1분기 서울시 정책 모니터링",
  "doc_description": "2024년 1분기 서울시 주요 정책 추진 현황 및 성과 분석",
  "tree_nodes_count": 15,
  "search_result": {
    "relevant_nodes": ["003", "003-2"],
    "reasoning": "...",
    "confidence": 0.85
  },
  "usage_stats": {
    "total_requests": 2,
    "total_tokens": 3500,
    "total_cost_usd": 0.0125
  }
}
```

### 3.4 캐시 관리

**GET** `/api/pageindex/cache/list`

캐시된 트리 인덱스 목록을 조회합니다.

#### Response
```json
{
  "cached_documents": [
    "insight_report_2024_01",
    "monitoring_2024_q1",
    "annual_report_2023"
  ],
  "total_count": 3,
  "cache_dir": "./data/indexes"
}
```

**GET** `/api/pageindex/cache/{doc_id}`

특정 문서의 캐시된 트리를 조회합니다.

**DELETE** `/api/pageindex/cache/{doc_id}`

특정 문서의 캐시를 삭제합니다.

**DELETE** `/api/pageindex/cache`

모든 캐시를 삭제합니다.

### 3.5 사용량 통계

**GET** `/api/pageindex/usage-stats`

PageIndex 사용량을 조회합니다.

---

## 4. 공통 엔드포인트

### 4.1 헬스 체크

**GET** `/health`

```json
{
  "status": "ok",
  "service": "llm-search",
  "version": "2.0.0",
  "llm_provider": "openai"
}
```

### 4.2 설정 확인

**GET** `/config`

```json
{
  "llm_provider": "openai",
  "openai_model": "gpt-4o",
  "pageindex_model": "gpt-4o",
  "ollama_url": "http://localhost:11434",
  "es_url": "http://elasticsearch:9200",
  "es_data_index": "elasticsearch_index_datasi_new_si",
  "cors_origins": ["*"]
}
```

---

## 5. 에러 응답

모든 API는 다음 형식으로 에러를 반환합니다:

```json
{
  "detail": "에러 메시지"
}
```

### HTTP 상태 코드

| 코드 | 설명 |
|------|------|
| 200 | 성공 |
| 400 | 잘못된 요청 (유효성 검사 실패) |
| 404 | 리소스 없음 (캐시된 트리 없음 등) |
| 500 | 서버 내부 오류 (LLM 호출 실패 등) |

---

## 6. 사용 예시

### cURL 예시

```bash
# 키워드 확장 (OpenAI)
curl -X POST "http://localhost:8000/api/keywords/expand" \
  -H "Content-Type: application/json" \
  -d '{"query": "서울 인구", "provider": "openai"}'

# RAG 키워드 확장
curl -X POST "http://localhost:8000/api/keywords/expand/rag" \
  -H "Content-Type: application/json" \
  -d '{"query": "강남구 경제", "include_samples": true}'

# 벤치마크 비교
curl "http://localhost:8000/api/benchmark/compare?query=서울 인구"

# 트리 인덱스 생성
curl -X POST "http://localhost:8000/api/pageindex/tree/build" \
  -H "Content-Type: application/json" \
  -d '{"doc_id": "test_doc", "content": "...", "title": "테스트 문서"}'
```

### Python 예시

```python
import httpx

async def expand_keywords(query: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:8000/api/keywords/expand",
            json={"query": query, "provider": "openai"}
        )
        return response.json()

# 벤치마크
async def run_benchmark(queries: list):
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            "http://localhost:8000/api/benchmark/batch",
            json={
                "queries": queries,
                "include_rag": True
            }
        )
        return response.json()
```

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 2.0.0 | 2026-01-26 | Keywords/Benchmark/PageIndex API 추가 |
| 1.0.0 | 2026-01-20 | 초기 버전 (Ollama 전용) |
