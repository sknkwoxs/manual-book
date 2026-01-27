---
title: "OpenAI 클라이언트 구현"
---

# OpenAI 클라이언트 구현

## 1. 개요

### 1.1 목적
- OpenAI API(gpt-4o)를 활용한 검색어 확장 기능 구현
- 기존 Ollama 클라이언트와 동일한 인터페이스 제공
- 토큰 사용량 및 비용 추적 기능

### 1.2 구현 파일

| 파일 | 설명 |
|------|------|
| `app/services/openai_client.py` | OpenAI API 클라이언트 |
| `app/services/llm_factory.py` | Provider 선택 팩토리 |

---

## 2. 클래스 구조

### 2.1 OpenAIClient

```python
class OpenAIClient:
    """OpenAI LLM 클라이언트"""
    
    def __init__(
        self,
        api_key: Optional[str] = None,
        model: Optional[str] = None,
        timeout: Optional[float] = None
    )
    
    # 주요 메서드
    async def expand_keywords(query, max_keywords, context) -> Dict
    async def suggest_synonyms(keyword) -> Dict
    async def analyze_intent(query) -> Dict
    async def test_connection() -> Dict
    
    # 속성
    @property
    def usage_stats -> Dict  # 누적 사용량 통계
```

### 2.2 LLMFactory

```python
class LLMFactory:
    """LLM 클라이언트 팩토리"""
    
    @classmethod
    def get_client(provider: str) -> LLMClientProtocol
    
    @classmethod
    def get_all_clients() -> Dict[str, LLMClientProtocol]
```

---

## 3. 주요 기능

### 3.1 검색어 확장 (expand_keywords)

**입력:**
```python
await client.expand_keywords(
    query="인구",           # 검색어
    max_keywords=5,         # 최대 키워드 수
    context=None            # RAG 컨텍스트 (선택)
)
```

**출력:**
```json
{
  "original_query": "인구",
  "expanded_keywords": ["출산율", "고령화", "인구밀도", "세대수", "인구이동"],
  "source": "openai",
  "model": "gpt-4o",
  "usage": {
    "prompt_tokens": 125,
    "completion_tokens": 45,
    "total_tokens": 170,
    "estimated_cost_usd": 0.00076,
    "response_time_ms": 892.5
  }
}
```

### 3.2 동의어 제안 (suggest_synonyms)

**입력:**
```python
await client.suggest_synonyms(keyword="주택")
```

**출력:**
```json
{
  "keyword": "주택",
  "synonyms": ["주거", "거주지", "가옥", "주거시설", "아파트"],
  "source": "openai",
  "model": "gpt-4o",
  "usage": {...}
}
```

### 3.3 검색 의도 분석 (analyze_intent)

**입력:**
```python
await client.analyze_intent(query="강남구 아파트 가격 추이")
```

**출력:**
```json
{
  "query": "강남구 아파트 가격 추이",
  "analysis": {
    "intent": "트렌드 분석",
    "category": "주거",
    "time_scope": "추세",
    "region_scope": "특정 구",
    "confidence": 0.9
  },
  "source": "openai",
  "model": "gpt-4o",
  "usage": {...}
}
```

---

## 4. Provider 팩토리 사용법

### 4.1 기본 사용

```python
from app.services import get_llm_client

# 기본 provider (설정 파일 기준)
client = get_llm_client()

# 특정 provider 지정
ollama_client = get_llm_client("ollama")
openai_client = get_llm_client("openai")
```

### 4.2 벤치마크용 모든 클라이언트

```python
from app.services import LLMFactory

clients = LLMFactory.get_all_clients()
# {"ollama": OllamaClientWrapper, "openai": OpenAIClient}
```

---

## 5. 비용 계산

### 5.1 모델별 가격 (2024년 기준)

| 모델 | Input (1M tokens) | Output (1M tokens) |
|------|-------------------|-------------------|
| gpt-4o | $2.50 | $10.00 |
| gpt-4o-mini | $0.15 | $0.60 |

### 5.2 예상 비용 (검색어 확장 1건)

| 모델 | 평균 토큰 | 예상 비용 |
|------|----------|----------|
| gpt-4o | ~200 | ~$0.0008 |
| gpt-4o-mini | ~200 | ~$0.00006 |

### 5.3 월간 예상 비용 (1만 건 기준)

| 모델 | 월 비용 |
|------|--------|
| gpt-4o | ~$8 |
| gpt-4o-mini | ~$0.6 |

---

## 6. 에러 핸들링

### 6.1 재시도 정책

```python
@retry(
    stop=stop_after_attempt(3),         # 최대 3회 시도
    wait=wait_exponential(              # 지수 백오프
        multiplier=1,
        min=1,
        max=10
    )
)
```

### 6.2 주요 예외

| 예외 | 원인 | 처리 |
|------|------|------|
| `AuthenticationError` | 잘못된 API 키 | 키 확인 필요 |
| `RateLimitError` | 요청 한도 초과 | 자동 재시도 |
| `APITimeoutError` | 응답 시간 초과 | 타임아웃 증가 |

---

## 7. 시스템 프롬프트

### 7.1 검색어 확장용

```
당신은 서울연구데이터서비스의 검색 키워드 확장 전문가입니다.
사용자가 입력한 검색어와 관련된 연관 검색어를 추천해주세요.

규칙:
1. 한국어로 응답하세요
2. 서울 관련 통계/데이터 검색에 적합한 키워드를 추천하세요
3. JSON 배열 형태로만 응답하세요: ["키워드1", "키워드2", ...]
4. 다른 설명 없이 JSON 배열만 출력하세요
```

### 7.2 의도 분석용

```
당신은 검색 의도 분석 전문가입니다.
사용자의 검색어를 분석하여 다음 정보를 JSON 형태로 반환하세요:

{
  "intent": "데이터 조회 | 트렌드 분석 | 비교 분석 | 지역 정보 | 기타",
  "category": "인구 | 경제 | 환경 | 교통 | 주거 | 문화 | 복지 | 역사 | 기타",
  "time_scope": "현재 | 과거 | 추세 | 미지정",
  "region_scope": "서울 전체 | 특정 구 | 미지정",
  "confidence": 0.0~1.0
}
```

---

## 8. 테스트

### 8.1 연결 테스트

```bash
# API 실행 후
curl -X GET "http://localhost:8000/api/keywords/test?provider=openai"
```

### 8.2 키워드 확장 테스트

```bash
curl -X POST "http://localhost:8000/api/keywords/expand" \
  -H "Content-Type: application/json" \
  -d '{"query": "인구", "max_keywords": 5, "provider": "openai"}'
```

---

## 9. 관련 문서

- [01_환경설정.md](./01_환경설정.md) - 환경변수 설정
- [03_RAG_서비스.md](./03_RAG_서비스.md) - RAG 컨텍스트 활용
- [05_API_엔드포인트.md](./05_API_엔드포인트.md) - API 명세
