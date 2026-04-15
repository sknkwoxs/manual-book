# 매뉴얼북 AI 검색 기능 도입 프로젝트

> 관련 이슈: [sknkwoxs/extras#99](https://github.com/sknkwoxs/extras/issues/99)

## 배경

- Cloudflare AutoRAG 서비스 출시 (2025.04 오픈 베타)
- 매뉴얼북이 Astro Starlight + MD 기반이라 AI 검색 적용에 유리
- 내부 서비스 우선 시범 운영 후 확대 검토

---

## 현재 상태

### 기존 검색 기능
- **Pagefind 활성화**: Starlight 기본 내장 검색 (자동 활성화)
- **검색 설정**: `astro.config.mjs`에 명시적 설정 없음 (기본값 사용)
- **인덱싱**: 빌드 시 `/dist/pagefind/`에 자동 생성
- **UI**: Starlight 기본 검색 UI 사용 중

### 기술 스택
- Astro v5.17 + Starlight v0.37
- astro-mermaid 다이어그램 지원
- Cloudflare Pages 배포

---

## 검토 대상 솔루션

### 1. Cloudflare AutoRAG (AI Search)

완전 관리형 RAG 파이프라인. 2025년 4월 오픈 베타.

#### 작동 방식
```
데이터 소스 (R2/웹사이트)
    ↓
자동 크롤링 → MD 변환 → 청킹 → 임베딩
    ↓
Vectorize DB 저장
    ↓
쿼리 → 벡터 검색 → LLM 응답 생성
```

#### 특징
| 항목 | 내용 |
|------|------|
| 데이터 소스 | R2 버킷 / 웹사이트 크롤링 |
| 인덱싱 주기 | 6시간마다 자동 |
| 파일 제한 | 10만 개, 4MB/파일 |
| 지원 형식 | MD, MDX, TXT, PDF, DOCX, HTML, 이미지 등 |

#### 가격
- AutoRAG 자체: **오픈 베타 무료**
- 내부 서비스 과금:
  - R2: 10GB/월 무료
  - Vectorize: 3천만 쿼리 차원/월 무료
  - Workers AI: 10,000 뉴런/일 무료
- **소규모 문서 사이트는 무료 티어 내 운영 가능**

#### Astro 연동
1. 웹사이트 크롤링 방식 (권장)
   - Dashboard → AI → AI Search → Website 데이터 소스 추가
   - 빌드 파이프라인 불필요
2. R2 버킷 방식
   - 빌드 결과물 R2 업로드 → 인덱싱

#### 장점
- 인프라 구축 불필요
- Cloudflare 생태계와 통합
- 자동 재인덱싱

#### 단점
- 커스텀 청킹/임베딩 모델 불가
- Cloudflare 락인
- 오픈 베타 불안정성

---

### 2. Algolia DocSearch

관리형 검색 서비스. 오픈소스 문서 사이트 무료 프로그램 제공.

#### 특징
| 항목 | 내용 |
|------|------|
| 검색 방식 | 키워드 + AI (NeuralSearch는 Elevate 플랜만) |
| 크롤링 | 주 1회 자동 |
| 무료 조건 | 오픈소스/기술 블로그/공개 문서 |

#### 가격
| 플랜 | 비용 | 검색 요청 | AI 기능 |
|------|------|-----------|---------|
| Build | 무료 | 10K/월 | 테스트만 |
| Grow | 종량제 | +$0.50/1K | X |
| Elevate | ~$50K/년 | 커스텀 | NeuralSearch |

#### Starlight 연동
```bash
npm install @astrojs/starlight-docsearch
```

```javascript
// astro.config.mjs
import starlightDocSearch from '@astrojs/starlight-docsearch';

starlight({
  plugins: [
    starlightDocSearch({
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'YOUR_INDEX_NAME',
    }),
  ],
})
```

#### 장점
- Starlight 공식 플러그인
- 즉시 배포 가능
- DocSearch 무료 프로그램

#### 단점
- NeuralSearch(AI)는 $50K/년 플랜만
- 트래픽 증가 시 비용 급증
- 벤더 락인

---

### 3. QMD (로컬 AI 검색)

Shopify CEO Tobi Lütke가 만든 로컬 마크다운 검색 엔진.

> 이슈에서 언급된 "topi"는 **QMD**의 오기로 추정

#### 작동 방식
```
BM25 (키워드) + Vector Search (의미) + LLM Re-ranking
    ↓
하이브리드 검색 결과
```

#### 특징
| 항목 | 내용 |
|------|------|
| 실행 환경 | 완전 로컬 (Node.js >= 22) |
| 모델 | ~2GB 자동 다운로드 |
| 인터페이스 | CLI / SDK / HTTP MCP 서버 |
| 지원 형식 | MD 최적화, 코드 파일 AST 청킹 |

#### 설치 및 사용
```bash
npm install -g @tobilu/qmd

# 컬렉션 추가
qmd collection add . --name manual-book --mask "**/*.md"

# 임베딩 생성
qmd embed

# 검색
qmd query "인증 흐름"
```

#### Astro 연동
```typescript
// src/pages/api/search.ts
import { createStore } from '@tobilu/qmd';

export async function GET({ url }) {
  const query = url.searchParams.get('q');
  const store = await createStore({ dbPath: './qmd-index.sqlite' });
  const results = await store.search({ query, limit: 10 });
  await store.close();
  return new Response(JSON.stringify(results));
}
```

#### 장점
- 완전 무료
- 프라이버시 보장 (데이터 외부 전송 없음)
- 오프라인 작동
- AI 에이전트 토큰 비용 90% 절감

#### 단점
- 웹 UI 없음 (직접 구현 필요)
- 서버 사이드 전용 (브라우저 실행 불가)
- 대규모 실시간 검색 부적합

---

## 비교 분석

| 항목 | AutoRAG | Algolia | QMD |
|------|---------|---------|-----|
| **비용** | 무료 (베타) | 종량제/$50K+ | 무료 |
| **AI 검색** | O | Elevate만 | O |
| **설정 난이도** | 낮음 | 낮음 | 중간 |
| **커스터마이징** | 제한적 | 제한적 | 자유 |
| **프라이버시** | 클라우드 | 클라우드 | 로컬 |
| **Starlight 연동** | 수동 구현 | 공식 플러그인 | 수동 구현 |
| **적합 규모** | 중소 | 중대 | 소 |

---

## 권장 방향

### 1단계: AutoRAG 시범 적용 (권장)

**이유**:
- 매뉴얼북이 이미 Cloudflare Pages 배포 중
- 무료 티어로 소규모 문서 사이트 운영 가능
- 웹사이트 크롤링 방식으로 빌드 파이프라인 변경 없음
- AI 검색 + 요약 기능 기본 제공

**구현 계획**:
1. Cloudflare Dashboard에서 AI Search 생성
2. 매뉴얼북 도메인 크롤링 설정
3. API 엔드포인트로 검색 UI 구현
4. 기존 Pagefind와 병행 운영 (A/B 비교)

### 2단계: 평가 후 확장 결정

- 사용량/만족도 기준 6개월 운영
- 문제 시 QMD 로컬 방식 전환 검토
- 대규모 확장 필요 시 Algolia Elevate 검토

---

## 구현 TODO

- [x] Cloudflare Pages 배포 설정 (`wrangler.toml`)
- [x] 검색 API 엔드포인트 구현 (`/api/ai-search`)
- [x] 검색 UI 컴포넌트 개발 (일반/AI 모드 토글)
- [x] GitHub Actions 워크플로우 (R2 업로드 + Pages 배포)
- [ ] **Cloudflare 설정** (아래 가이드 참조)
- [ ] 내부 테스트 및 피드백 수집

---

## Cloudflare 설정 가이드

배포 전 Cloudflare Dashboard에서 다음 리소스를 생성해야 합니다.

### 1. R2 버킷 생성

1. Cloudflare Dashboard → R2 Object Storage
2. "Create bucket" 클릭
3. 버킷 이름: `manual-book-content`
4. 위치: 자동 (또는 아시아 선택)

### 2. AI Search (AutoRAG) 인스턴스 생성

1. Cloudflare Dashboard → AI → AI Search
2. "Create" 클릭
3. 설정:
   - Name: `manual-book-rag`
   - Data source: R2 bucket → `manual-book-content`
   - Indexing path: `/docs` (MD 파일 경로)

### 3. Cloudflare Pages 프로젝트 생성

1. Cloudflare Dashboard → Workers & Pages → Pages
2. "Create" → "Connect to Git"
3. GitHub 연결 → `manual-book` 저장소 선택
4. 빌드 설정:
   - Framework preset: Astro
   - Build command: `npm run build`
   - Build output: `dist`

### 4. GitHub Secrets 설정

GitHub 저장소 → Settings → Secrets and variables → Actions:

| Secret 이름 | 값 |
|-------------|-----|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API 토큰 (Edit Workers 권한 필요) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 계정 ID |

**API 토큰 생성**:
1. Cloudflare Dashboard → My Profile → API Tokens
2. "Create Token" → "Edit Cloudflare Workers" 템플릿
3. 권한 추가: R2 Storage (Edit), Pages (Edit)

### 5. 바인딩 설정 (Pages Functions)

Pages 프로젝트 → Settings → Functions → Bindings:

| Type | Variable name | Resource |
|------|---------------|----------|
| R2 bucket | `MANUAL_BOOK_BUCKET` | `manual-book-content` |
| Workers AI | `AI` | Workers AI |

Environment variables:

| Name | Value |
|------|-------|
| `AUTORAG_NAME` | `manual-book-rag` |

---

## 구현 파일 구조

```
manual-book/
├── wrangler.toml              # Cloudflare 설정
├── .github/workflows/
│   └── deploy.yml             # CI/CD (R2 + Pages)
├── src/
│   ├── components/
│   │   └── Search.astro       # 검색 UI (일반 + AI 토글)
│   └── pages/api/
│       └── ai-search.ts       # AI 검색 API 엔드포인트
└── docs/
    └── ai-search-project.md   # 이 문서
```

---

## 참고 자료

### AutoRAG
- [Cloudflare AI Search 문서](https://developers.cloudflare.com/ai-search/)
- [AutoRAG 발표 블로그](https://blog.cloudflare.com/introducing-autorag-on-cloudflare/)

### Algolia
- [DocSearch 신청](https://dashboard.algolia.com/users/sign_up?selected_plan=docsearch)
- [Starlight DocSearch 플러그인](https://starlight.astro.build/guides/site-search/#algolia-docsearch)

### QMD
- [GitHub: tobi/qmd](https://github.com/tobi/qmd)
- [QMD + AI 에이전트 활용](https://www.heyuan110.com/posts/ai/2026-03-25-qmd-local-search-ai-agent-memory/)
