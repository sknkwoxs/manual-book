---
title: LLM 검색 최적화
---

## 1. 개요

BreezeBio 웹사이트는 **LLM(Large Language Model) 검색 최적화**가 적용되어 있습니다. ChatGPT, Claude, Perplexity 등 AI 기반 검색 서비스에서 사이트 콘텐츠가 정확하게 인덱싱되고 검색될 수 있도록 구성되어 있습니다.

### 왜 중요한가?

| 기존 SEO | LLM SEO |
|----------|---------|
| Google, Bing 등 검색엔진 최적화 | ChatGPT, Claude, Perplexity 등 AI 검색 최적화 |
| 키워드 중심 | 문맥과 의미 중심 |
| 메타 태그, 백링크 | 구조화된 콘텐츠, llms.txt |

> **참고**: AI 검색 트래픽이 점점 증가하고 있으며, 특히 B2B 기업 정보 검색에서 중요해지고 있습니다.

---

## 2. llms.txt 표준

### llms.txt란?

[llms.txt](https://llmstxt.org/)는 LLM이 웹사이트 콘텐츠를 효율적으로 이해할 수 있도록 마크다운 형식으로 사이트 정보를 제공하는 표준입니다.

### BreezeBio llms.txt 엔드포인트

| URL | 설명 |
|-----|------|
| `https://breezebio.com/llms.txt` | 요약 버전 (네비게이션, 페이지 목록) |
| `https://breezebio.com/llms-full.txt` | 전체 버전 (모든 콘텐츠 포함) |

### 포함 내용

```
# BreezeBio

> 사이트 설명

Website: https://breezebio.com

## Navigation
- [About](https://breezebio.com/about/)
- [Science](https://breezebio.com/science/)
...

## Pages
### About
URL: https://breezebio.com/about/
Description: ...

## News
- [뉴스 제목](URL) - 카테고리 (날짜)
...
```

### 자동 업데이트

llms.txt는 WordPress 콘텐츠 기반으로 **동적 생성**됩니다:
- 페이지 추가/수정 시 자동 반영
- 뉴스(포스트) 발행 시 자동 반영
- 네비게이션 메뉴 변경 시 자동 반영

> **캐시**: 1시간 동안 캐시됩니다. 즉시 반영이 필요하면 캐시 삭제가 필요합니다.

---

## 3. AI 크롤러 허용 설정

### robots.txt 설정

BreezeBio는 주요 AI 크롤러를 **명시적으로 허용**합니다:

| AI 크롤러 | 서비스 | 상태 |
|-----------|--------|------|
| GPTBot | OpenAI (ChatGPT) | ✅ 허용 |
| ClaudeBot | Anthropic (Claude) | ✅ 허용 |
| Claude-Web | Anthropic | ✅ 허용 |
| anthropic-ai | Anthropic | ✅ 허용 |
| Amazonbot | Amazon | ✅ 허용 |
| PerplexityBot | Perplexity AI | ✅ 허용 |
| YouBot | You.com | ✅ 허용 |

### robots.txt 확인

```
https://breezebio.com/robots.txt
```

```
# AI Crawlers - Allowed
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /
...

# LLM 표준
LLMs-Txt: https://breezebio.com/llms.txt
```

---

## 4. 구조화된 데이터 (Schema.org)

### Organization 스키마

모든 페이지에 **Organization** 스키마 마크업이 포함되어 있습니다:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "BreezeBio",
  "url": "https://breezebio.com",
  "description": "...",
  "logo": "https://breezebio.com/.../logo.svg",
  "sameAs": [
    "https://www.linkedin.com/company/breezebio"
  ]
}
```

### 효과

- Google Rich Results 지원
- AI 검색에서 회사 정보 정확하게 인식
- 소셜 미디어 연결

---

## 5. SEO 블록 패턴

### Svelte 블록과 SEO

BreezeBio의 인터랙티브 블록은 Svelte로 구현되어 CSR(Client-Side Rendering)로 동작합니다. 검색엔진과 AI 크롤러가 콘텐츠를 인덱싱할 수 있도록 **서버사이드 시맨틱 HTML**을 함께 제공합니다.

### 작동 방식

```
1. 페이지 로드 → 서버에서 .seo-content HTML 출력
2. AI/검색엔진 → .seo-content 콘텐츠 인덱싱
3. JavaScript 로드 → Svelte 마운트 → .seo-content 숨김
4. 사용자 → 인터랙티브 UI 사용
```

### 확인 방법

브라우저에서 JavaScript를 비활성화하거나, 페이지 소스 보기로 `.seo-content` 영역의 HTML을 확인할 수 있습니다.

---

## 6. 콘텐츠 작성 가이드

### LLM 친화적 콘텐츠 작성

| 권장 사항 | 설명 |
|----------|------|
| **명확한 제목** | 페이지/섹션 제목을 명확하게 작성 |
| **구조화된 정보** | 표, 목록, 단계별 설명 활용 |
| **핵심 정보 상단 배치** | 중요한 정보를 페이지 상단에 배치 |
| **전문 용어 설명** | 업계 전문 용어는 간단한 설명 추가 |
| **최신 정보 유지** | 정기적인 콘텐츠 업데이트 |

### 피해야 할 사항

| 피해야 할 것 | 이유 |
|-------------|------|
| 이미지만 있는 콘텐츠 | AI가 텍스트 기반으로 인덱싱 |
| 중복 콘텐츠 | 신뢰도 저하 |
| 오래된 정보 | 부정확한 검색 결과 유발 |

---

## 7. 모니터링

### AI 검색 노출 확인

| 서비스 | 확인 방법 |
|--------|----------|
| ChatGPT | "BreezeBio에 대해 알려줘" 질문 |
| Claude | "BreezeBio 회사 정보" 질문 |
| Perplexity | "BreezeBio gene editing" 검색 |

### llms.txt 검증

```bash
$ curl https://breezebio.com/llms.txt
$ curl https://breezebio.com/llms-full.txt
```

### 서버 로그에서 AI 크롤러 확인

AI 크롤러 접근은 서버 로그에서 User-Agent로 확인할 수 있습니다:
- `GPTBot/1.0`
- `ClaudeBot/1.0`
- `PerplexityBot/1.0`

---

## 8. 자주 묻는 질문

### Q: llms.txt가 업데이트되지 않아요

**A**:
1. llms.txt는 1시간 캐시됩니다
2. 캐시 만료 후 자동 갱신
3. 급한 경우 개발팀에 캐시 삭제 요청

### Q: AI 검색에서 잘못된 정보가 나와요

**A**:
1. 해당 페이지 콘텐츠 확인 및 수정
2. llms.txt에 최신 정보 반영 확인
3. AI 서비스는 정보 갱신에 시간이 걸릴 수 있음 (수일~수주)

### Q: 특정 페이지를 AI 검색에서 제외하고 싶어요

**A**:
1. 해당 페이지를 "비공개" 또는 "비밀번호 보호"로 설정
2. llms.txt에서 자동으로 제외됨
3. 추가 설정이 필요하면 개발팀에 문의

### Q: AI 크롤러를 차단하고 싶어요

**A**:
robots.txt 수정이 필요합니다. 개발팀에 요청하세요.

```
# 차단 예시
User-agent: GPTBot
Disallow: /
```

> **주의**: AI 크롤러 차단 시 AI 검색 서비스에서 사이트 정보가 노출되지 않습니다.
