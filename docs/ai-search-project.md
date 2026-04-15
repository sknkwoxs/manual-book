# 매뉴얼북 AI 검색 — 구축 및 운영 가이드

> 관련 이슈: [sknkwoxs/extras#99](https://github.com/sknkwoxs/extras/issues/99)
> 최종 업데이트: 2026-04-15

## 개요

매뉴얼북에 Cloudflare AutoRAG(AI Search) 기반의 AI 검색 기능을 도입했다.
기존 Pagefind 키워드 검색은 유지하면서, AI 버튼을 통해 문서 기반 자연어 검색을 병행 제공한다.

### 핵심 구조

```
코드 push (master)
  ├─ Cloudflare Pages (Git 연결) → 사이트 빌드/배포 (자동)
  └─ GitHub Actions → src/content/docs/ MD/MDX 파일을 R2 버킷에 업로드
                            ↓
                    AutoRAG 자동 인덱싱 (1시간 주기)
                            ↓
                    /api/ai-search 엔드포인트로 검색 제공
```

문서를 작성하고 push하면 **사이트 반영**과 **AI 검색 인덱싱**이 동시에 진행된다.

---

## 기술 스택

| 구성 요소 | 기술 | 역할 |
|----------|------|------|
| 문서 사이트 | Astro v5.17 + Starlight v0.37 | 정적 문서 사이트 |
| 기본 검색 | Pagefind | 키워드 기반 검색 (Starlight 내장) |
| AI 검색 | Cloudflare AutoRAG (AI Search 베타) | 자연어 RAG 검색 |
| 문서 저장소 | Cloudflare R2 (`manual-book-content`) | AutoRAG 인덱싱 데이터 소스 |
| 배포 | Cloudflare Pages (Git 연결) | 빌드/배포 자동화 |
| R2 업로드 | GitHub Actions | MD/MDX 파일 R2 동기화 |

---

## 파일 구조

```
manual-book/
├── astro.config.mjs              # Cloudflare adapter, Search 컴포넌트 오버라이드
├── wrangler.toml                 # Cloudflare 로컬 개발 설정
├── .github/workflows/
│   └── deploy.yml                # R2 업로드 워크플로우
├── src/
│   ├── components/
│   │   └── Search.astro          # 검색 UI (일반 Pagefind + AI 토글)
│   └── pages/api/
│       └── ai-search.ts          # AutoRAG API 엔드포인트
└── docs/
    └── ai-search-project.md      # 이 문서
```

---

## Cloudflare 리소스 구성

### 계정 정보

- **계정**: sknk-dev
- **Account ID**: `a401d577dea602e601c084e944535d50`
- **Pages 프로젝트**: `manual-book` (Git 연결: `sknkwoxs/manual-book`)
- **도메인**: `manual.skunkworks.co.kr`, `manual-book.pages.dev`

### R2 버킷

- **이름**: `manual-book-content`
- **용도**: AutoRAG 인덱싱용 마크다운 파일 저장
- **파일 구조**: `docs/` 하위에 `src/content/docs/`의 MD/MDX 파일이 미러링됨

### AI Search (AutoRAG)

- **인스턴스**: `manual-book-rag`
- **데이터 소스**: R2 → `manual-book-content`
- **인덱싱 주기**: 1시간 (설정에서 변경 가능, 기본값 6시간)
- **임베딩 모델**: `@cf/qwen/qwen3-embedding-0.6b` (기본값)
- **생성 모델**: `@cf/meta/llama-3.3-70b-instruct-fp8-fast` (스마트 기본값)
- **청크 크기**: 1024 토큰
- **벡터 DB**: `ai-search-manual-book-rag`

### Pages 바인딩

Pages 프로젝트 → 설정 → 바인딩:

| 유형 | 이름 | 값 |
|------|------|-----|
| R2 버킷 | `MANUAL_BOOK_BUCKET` | `manual-book-content` |
| Workers AI | `AI` | Workers AI 카탈로그 |

### Pages 환경변수

Pages 프로젝트 → 설정 → 변수 및 암호:

| 이름 | 값 |
|------|-----|
| `AUTORAG_NAME` | `manual-book-rag` |

---

## GitHub 설정

### Secrets (Settings → Secrets and variables → Actions)

| Secret | 설명 |
|--------|------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API 토큰 |
| `CLOUDFLARE_ACCOUNT_ID` | `a401d577dea602e601c084e944535d50` |

### API 토큰 권한

토큰 이름: `manual-book-rag` (Cloudflare 내 프로필 → API 토큰)

필요 권한:
- 계정 > Cloudflare Pages > 편집
- 계정 > Workers R2 저장 공간 > 편집
- 계정 > Workers 스크립트 > 편집
- 계정 > Workers AI > 읽기 (있으면)

계정 리소스: `sknk-dev` 포함

### R2 업로드 워크플로우 (`.github/workflows/deploy.yml`)

- **트리거**: `src/content/docs/**` 경로 변경 시 자동 실행, 또는 수동(workflow_dispatch)
- **동작**: MD/MDX 파일을 개별적으로 R2에 업로드 (`--remote` 플래그 필수)
- **주의**: `wrangler r2 object put`은 단일 파일만 지원하므로 for 루프로 처리

---

## 검색 UI 동작

### 모드

1. **일반 검색** (Pagefind): 기존 Starlight 검색 아이콘 클릭
2. **AI 검색**: 검색 영역 옆 `AI` 버튼 클릭 → 대화형 검색 다이얼로그

### AI 검색 흐름

```
사용자 질문 입력
  → POST /api/ai-search { query: "..." }
    → runtime.env.AI.autorag("manual-book-rag").aiSearch(...)
      → AutoRAG가 R2 문서에서 관련 내용 검색
      → LLM이 검색 결과 기반으로 답변 생성
  ← { answer: "...", sources: [...] }
→ UI에 답변 + 참고 문서 링크 표시
```

---

## 운영 가이드

### 문서 추가/수정 후

1. `src/content/docs/`에 MD/MDX 파일 추가/수정
2. Git push → Cloudflare Pages 자동 배포 + GitHub Actions R2 업로드
3. AutoRAG가 1시간 내 자동 인덱싱 (또는 대시보드에서 수동 동기화)

### 수동 동기화

Cloudflare Dashboard → AI → AI Search → `manual-book-rag` → `↻ 동기화` 클릭

### 수동 R2 업로드

GitHub → Actions → "Upload docs to R2 for AutoRAG" → "Run workflow" 클릭

### AI 검색 품질 조정

대시보드 → AI Search → `manual-book-rag` → 설정:

- **생성 모델**: 한국어 품질이 중요하면 `Qwen3 30B` 또는 `Llama 3.3 70B` 비교 테스트
- **청크 크기**: 기본 1024 토큰. 늘리면 더 넓은 맥락 제공, 줄이면 정밀도 향상
- **일치 임계값**: 기본 0.4. 낮추면 더 많은 소스 참고, 높이면 정밀도 향상
- **인덱싱 주기**: 현재 1시간. 필요에 따라 조정

### 인덱싱 오류 확인

대시보드 → AI Search → `manual-book-rag` → 개요:
- "오류" 항목에 실패한 파일 수 표시
- "인덱스 로그"에서 개별 파일 오류 확인 가능

---

## 비용

현재 모두 무료 티어 범위 내:

| 서비스 | 무료 한도 | 현재 사용량 |
|--------|----------|-----------|
| AutoRAG (AI Search) | 오픈 베타 무료 | 227 문서 |
| R2 저장소 | 10GB/월 | 수 MB |
| Workers AI | 10,000 뉴런/일 | 소량 |
| Cloudflare Pages | 500 빌드/월, 무제한 요청 | 소량 |

---

## 트러블슈팅 기록

### R2 업로드는 성공하는데 버킷이 비어있음

`wrangler r2 object put` 명령에 `--remote` 플래그가 없으면 로컬 에뮬레이터에 업로드된다.
반드시 `--remote` 포함.

### `The specified bucket does not exist` 에러

GitHub Secret `CLOUDFLARE_ACCOUNT_ID` 값이 잘못되었거나 비어있음.
`a401d577dea602e601c084e944535d50` (sknk-dev 계정)으로 정확히 설정.

### `More than one account available` 에러

API 토큰이 여러 계정에 접근 가능할 때 발생.
`CLOUDFLARE_ACCOUNT_ID` 환경변수를 반드시 설정.

### Pages 배포 `Could not route to /pages/projects/manual-book` (7003)

- Pages 프로젝트가 Git 연결 방식이면 `wrangler pages deploy` (Direct Upload) 불가
- 현재 구조: Cloudflare Pages Git 연결로 자동 배포, GitHub Actions는 R2 업로드만 담당

### AI 검색이 일반 지식으로만 답변

- AutoRAG 인덱싱이 완료되었는지 확인 (대시보드 → 인덱스팀 수 > 0)
- 질문이 너무 일반적이면 문서 맥락을 활용하지 못할 수 있음
- 문서에 실제로 있는 구체적 내용으로 질문

---

## 향후 개선 사항

- [ ] AI 검색 응답에 스트리밍 지원 (`stream: true` 이미 코드에 구현됨)
- [ ] 검색 품질 모니터링 및 모델 비교 테스트
- [ ] AutoRAG 베타 종료 후 비용 재검토
- [ ] 필요 시 QMD(로컬 AI 검색) 또는 Algolia 전환 검토
