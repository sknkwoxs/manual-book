# 07. 비교테스트 결과

## 테스트 개요

| 항목 | 내용 |
|------|------|
| 테스트 일시 | 2026-01-26 |
| 테스트 쿼리 수 | 20개 |
| 테스트 회차 | 3회 |
| 총 테스트 수 | Provider당 60회 |

### 테스트 환경

- **로컬 환경**: macOS, Apple Silicon
- **Ollama**: Qwen3:8b 모델 (로컬 실행)
- **OpenAI**: GPT-4o (API 호출)
- **Elasticsearch**: 7.17.14 (DDEV 컨테이너)

### 테스트 쿼리 카테고리

| 카테고리 | 쿼리 수 | 예시 |
|----------|---------|------|
| 인구/통계 | 6 | 서울 인구 변화, 강남구 인구수 |
| 경제/산업 | 6 | 서울 경제 성장률, 창업 현황 |
| 환경/기후 | 6 | 서울 대기오염, 미세먼지 현황 |
| 교통/도시 | 2 | 서울 교통량, 지하철 이용객 |

---

## 성능 비교 결과

### 응답 시간 (3회 평균)

| Provider | Round 1 | Round 2 | Round 3 | **평균** | Ollama 대비 |
|----------|---------|---------|---------|----------|-------------|
| **openai_basic** | 1,292ms | 1,306ms | 1,694ms | **1,431ms** | **5.6배 빠름** |
| openai_rag | 1,446ms | 1,565ms | 1,608ms | 1,540ms | 5.2배 빠름 |
| openai_rag_extended | 1,466ms | 1,531ms | 1,757ms | 1,585ms | 5.1배 빠름 |
| ollama_basic | 8,196ms | 8,532ms | 7,449ms | 8,059ms | 기준 |

```
응답 시간 비교 (ms)
────────────────────────────────────────────────────────
openai_basic      ████████ 1,431ms
openai_rag        █████████ 1,540ms  
openai_rag_ext    █████████ 1,585ms
ollama_basic      █████████████████████████████████████████████ 8,059ms
────────────────────────────────────────────────────────
```

### 비용 (20개 쿼리 기준)

| Provider | 총 비용 | 쿼리당 비용 | 월 1만 쿼리 예상 |
|----------|---------|-------------|-----------------|
| ollama_basic | **$0.0000** | $0.00000 | **$0** |
| openai_basic | $0.0146 | $0.00073 | ~$7.30 |
| openai_rag | $0.0339 | $0.00170 | ~$17.00 |
| openai_rag_extended | $0.0340 | $0.00170 | ~$17.00 |

### 성공률

| Provider | 성공 | 실패 | 성공률 |
|----------|------|------|--------|
| ollama_basic | 60 | 0 | **100%** |
| openai_basic | 60 | 0 | **100%** |
| openai_rag | 60 | 0 | **100%** |
| openai_rag_extended | 60 | 0 | **100%** |

---

## 키워드 품질 비교

### 샘플 쿼리별 결과

#### 쿼리 1: "서울 인구 변화"

| Provider | 응답시간 | 생성 키워드 |
|----------|----------|-------------|
| ollama_basic | 8,865ms | 서울 인구 현황, 서울 인구 역사적 변화, 서울 인구 감소 원인 |
| openai_basic | 1,018ms | 서울 인구 증가, 서울 인구 감소, 서울 인구 밀도 |
| openai_rag | 1,145ms | 서울 인구 통계, 서울 고령화 추세, 서울 출생률 변화 |

#### 쿼리 2: "강남구 경제 현황"

| Provider | 응답시간 | 생성 키워드 |
|----------|----------|-------------|
| ollama_basic | 7,442ms | 강남구 경제 통계, 고용률, 산업별 경제 데이터 |
| openai_basic | 4,691ms | 강남구 경제 성장률, 강남구 소득 수준, 강남구 부동산 시장 |
| openai_rag | 2,146ms | 강남구 경제지표, 강남구 일자리 현황, 강남구 소득 수준 |

#### 쿼리 3: "미세먼지 현황"

| Provider | 응답시간 | 생성 키워드 |
|----------|----------|-------------|
| ollama_basic | 9,743ms | 서울 미세먼지 농도, 미세먼지 실시간 정보, 미세먼지 차트 |
| openai_basic | 1,377ms | 서울 미세먼지 농도, 미세먼지 예보, 서울 대기오염 |
| openai_rag | 1,183ms | 서울시 대기질 지수, 서울 미세먼지 정책, 서울 환경 통계 |

### 품질 평가 요약

| 항목 | Ollama | OpenAI Basic | OpenAI RAG |
|------|--------|--------------|------------|
| 한국어 자연스러움 | ★★★☆☆ | ★★★★★ | ★★★★★ |
| 키워드 다양성 | ★★★☆☆ | ★★★★☆ | ★★★★★ |
| 도메인 적합성 | ★★★☆☆ | ★★★★☆ | ★★★★★ |
| 지역명 인식 | ★★☆☆☆ | ★★★★☆ | ★★★★★ |

**관찰 사항:**
- **Ollama**: 일반적인 키워드 생성, 서울 도메인 특화 부족
- **OpenAI Basic**: 자연스럽고 다양한 키워드, 빠른 응답
- **OpenAI RAG**: 서비스 카테고리/지역명 반영, 가장 도메인에 특화된 결과

---

## 종합 분석

### 속도 vs 비용 트레이드오프

```
        비용 ↑
        │
  $0.02 ┤      ● openai_rag / openai_rag_extended
        │
  $0.01 ┤  ● openai_basic
        │
  $0.00 ┤● ollama_basic
        └──────────────────────────────────────→ 속도 (느림)
             1초      2초      5초      8초
```

### Provider별 장단점

| Provider | 장점 | 단점 | 적합한 용도 |
|----------|------|------|-------------|
| **ollama_basic** | 무료, 프라이버시 보장, 오프라인 가능 | 느림 (8초), 품질 일관성 부족 | 내부 테스트, 비용 민감 환경 |
| **openai_basic** | 빠름 (1.4초), 고품질, 저비용 | API 의존, 네트워크 필요 | **프로덕션 권장** |
| **openai_rag** | 도메인 특화, 컨텍스트 활용 | 비용 증가 (2.3배) | 정확도 중시 검색 |
| **openai_rag_extended** | 실제 데이터 기반, 최고 정확도 | 비용 증가, ES 의존 | 고급 분석, 추천 |

### 권장 설정

#### 1. 프로덕션 환경 (권장)

```yaml
provider: openai
mode: basic
model: gpt-4o
```

- **이유**: 속도와 비용의 최적 균형
- **예상 비용**: 월 1만 쿼리 기준 ~$7

#### 2. 고품질 검색 환경

```yaml
provider: openai
mode: rag
model: gpt-4o
```

- **이유**: 도메인 특화 키워드, 높은 정확도
- **예상 비용**: 월 1만 쿼리 기준 ~$17

#### 3. 비용 절감 환경

```yaml
provider: ollama
mode: basic
model: qwen3:8b
```

- **이유**: 완전 무료, 프라이버시 보장
- **단점**: 8초 응답 시간, UX 저하

---

## 결론

### 핵심 발견

1. **OpenAI가 Ollama보다 5.6배 빠름**
   - 로컬 LLM의 한계 확인
   - API 기반 서비스의 인프라 최적화 효과

2. **RAG 컨텍스트 효과**
   - 응답 시간: Basic과 유사 (1.4초 vs 1.5초)
   - 품질: 도메인 특화 키워드 생성에 효과적
   - 비용: 2.3배 증가 (컨텍스트 토큰 추가)

3. **비용 효율성**
   - OpenAI Basic: 쿼리당 $0.00073 (매우 저렴)
   - 월 1만 쿼리 = $7.30

### 최종 권장사항

| 환경 | 권장 Provider | 예상 비용 |
|------|--------------|-----------|
| 프로덕션 | OpenAI Basic | $7/월 |
| 고정확도 필요 | OpenAI RAG | $17/월 |
| 개발/테스트 | Ollama | 무료 |
| 오프라인/보안 | Ollama | 무료 |

---

## 부록: 원시 데이터

### Round 1 결과
```json
{
  "ollama_basic": {"avg_response_time_ms": 8196, "total_cost_usd": 0.0000},
  "openai_basic": {"avg_response_time_ms": 1292, "total_cost_usd": 0.0145},
  "openai_rag": {"avg_response_time_ms": 1446, "total_cost_usd": 0.0339},
  "openai_rag_extended": {"avg_response_time_ms": 1466, "total_cost_usd": 0.0340}
}
```

### Round 2 결과
```json
{
  "ollama_basic": {"avg_response_time_ms": 8532, "total_cost_usd": 0.0000},
  "openai_basic": {"avg_response_time_ms": 1306, "total_cost_usd": 0.0147},
  "openai_rag": {"avg_response_time_ms": 1565, "total_cost_usd": 0.0339},
  "openai_rag_extended": {"avg_response_time_ms": 1531, "total_cost_usd": 0.0340}
}
```

### Round 3 결과
```json
{
  "ollama_basic": {"avg_response_time_ms": 7449, "total_cost_usd": 0.0000},
  "openai_basic": {"avg_response_time_ms": 1694, "total_cost_usd": 0.0146},
  "openai_rag": {"avg_response_time_ms": 1608, "total_cost_usd": 0.0340},
  "openai_rag_extended": {"avg_response_time_ms": 1757, "total_cost_usd": 0.0340}
}
```

---

*테스트 환경: macOS, Apple Silicon, Ollama Qwen3:8b, OpenAI GPT-4o*
