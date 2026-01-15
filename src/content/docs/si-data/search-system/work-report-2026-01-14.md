---
title: "작업보고서 - 2026-01-14"
---

> [SI-DATA 문서](../../) / [검색시스템 설계 문서](../)

## 작업 개요
서울연구데이터서비스(si-data) 프로젝트 로컬 개발환경 구성 및 SLLM 검색 시스템 PoC 착수

---

## 수행 작업

### 1. DDEV 개발환경 구성
- **MySQL 버전 마이그레이션**: MariaDB 10.11 → MySQL 8.0
- **컨테이너 재구성**: 기존 컨테이너 삭제 후 새로 생성
- **최종 환경 설정**:
  - PHP: 8.3
  - MySQL: 8.0
  - Elasticsearch: 7.17.14
  - Webserver: nginx-fpm

### 2. 프로젝트 구조 분석

#### 2.1 디렉토리 구조
```
si-data/
├── config/sync/           # 811개 yml 설정 파일
├── Docs/                  # 작업문서 (gitignore)
├── web/
│   ├── modules/custom/si_data/   # 핵심 커스텀 모듈
│   ├── themes/custom/datasi/     # 메인 테마
│   ├── themes/custom/silicon/    # 보조 테마
│   ├── phpr/                     # PHPExcel 레거시
│   └── R/                        # R 차트 HTML
└── vendor/                       # Composer 의존성
```

#### 2.2 콘텐츠 타입 (15개)
| 타입 | 용도 |
|------|------|
| data_seoul | 데이터로 본 서울 |
| digital_photo | 사진으로 본 서울 |
| collection | 사진 컬렉션 |
| charts | 데이터 차트 |
| si_survey | 조사 데이터 |
| archi | 근현대 유산 |
| insight_report | 인사이트 리포트 |
| data_intro | 데이터 소개 |
| data_collection | 데이터 컬렉션 |
| front_page | 프론트 페이지 |
| suggest | 제안 |
| suggestion | 제안 (구버전) |
| page | 기본 페이지 |
| article | 기사 |
| drag_and_drop_page | DXPR 페이지 |

#### 2.3 주요 엔드포인트
| 경로 | 기능 | 컨트롤러 |
|------|------|----------|
| /data | 데이터로 본 서울 | SiDataController |
| /photo | 사진으로 본 서울 | SiPhotoController |
| /node/search | 통합검색 | SearchController |
| /map/view | 지도 보기 | MapController |
| /chart/api/* | 차트 API | ChartController |

### 3. 문서화 작업
- **AGENTS.md 업데이트**: 개발환경 정보 추가, 콘텐츠 타입 목록 확장
- **Docs 폴더 생성**: 작업보고서/결과내역서 저장용
- **.gitignore 업데이트**: Docs 폴더 버전관리 제외

---

### 4. SLLM 검색 시스템 PoC 구현

#### 4.1 Git 브랜치 분리
- **신규 브랜치**: `feature/sllm-search-poc`
- **목적**: 운영 배포에 영향을 미치지 않도록 격리

#### 4.2 LLM 환경 구축 완료
| 항목 | 상태 | 상세 |
|------|------|------|
| Ollama | ✅ 설치 완료 | v0.14.0 via Homebrew |
| LLM 모델 | ✅ 다운로드 완료 | **Qwen3 8B** (5.2GB) - EEVE 대신 사용 |
| FastAPI 서비스 | ✅ 구현 완료 | `services/llm-search/` |
| Drupal 연동 | ✅ 구현 완료 | Vue.js 통합검색 수정 |

#### 4.3 FastAPI 서비스 구조
```
services/llm-search/
├── README.md
├── requirements.txt
├── venv/                    # Python 가상환경
└── app/
    ├── __init__.py
    ├── main.py              # FastAPI 엔트리포인트
    ├── routes/
    │   ├── __init__.py
    │   └── keywords.py      # 키워드 확장 API
    ├── services/
    │   ├── __init__.py
    │   └── llm_client.py    # Ollama 클라이언트
    └── data/
        └── synonyms.json    # 동의어 사전 (17개 카테고리)
```

#### 4.4 API 엔드포인트
| 경로 | 메서드 | 기능 |
|------|--------|------|
| `/health` | GET | 서비스 상태 확인 |
| `/api/keywords/expand` | POST | 검색어 확장 (LLM) |
| `/api/keywords/suggest` | POST | 동의어 제안 |
| `/api/keywords/test` | GET | LLM 연결 테스트 |

#### 4.5 Drupal 통합검색 수정

**수정된 파일:**
| 파일 | 변경 내용 |
|------|----------|
| `si-combine-search.js` | LLM 확장 검색 기능 추가 (~200줄) |
| `si-search.html.twig` | AI 연관 검색어 UI, 확장 결과 섹션 추가 |
| `si-combine-search.css` | LLM UI 스타일 (신규 파일) |
| `si_data.libraries.yml` | CSS 의존성 추가 |

**구현된 기능:**
1. **AI 연관 검색어 태그** - 검색창 아래에 클릭 가능한 확장 키워드 표시
2. **ON/OFF 토글** - AI 검색 기능 켜고 끄기
3. **로딩 스피너** - "AI가 연관 검색어를 찾고 있습니다..."
4. **AI 추천 연관 콘텐츠** - 확장 검색 결과 (데이터 + 사진)
5. **AI 배지** - 확장 검색 결과 아이템에 보라색 "AI" 배지

#### 4.6 기술적 이슈 해결

| 이슈 | 원인 | 해결 |
|------|------|------|
| `$.isEmptyObject` 에러 | jQuery 로드 순서 | `Object.keys()` 사용으로 대체 |
| `hits.total` 객체 표시 | ES7+ 응답 형식 변경 | 객체/숫자 분기 처리 |
| `grid01 is not defined` | Masonry 전역 변수 | `typeof` 체크 추가 |
| Masonry 레이아웃 깨짐 | Vue 동적 렌더링 타이밍 | **CSS Grid로 대체** |

#### 4.7 검색 흐름 (Async Dual Search)
```
┌─────────────────────────────────────────────────────────────┐
│ 사용자 검색: "서울 인구"                                      │
├─────────────────────────────────────────────────────────────┤
│ 1. 즉시 검색 (기존 Elasticsearch)                            │
│    → 결과 바로 표시                                          │
├─────────────────────────────────────────────────────────────┤
│ 2. LLM 확장 검색 (비동기)                                    │
│    → FastAPI (localhost:8000) 호출                          │
│    → AI 연관 검색어 표시: "인구 통계", "인구 변화" 등          │
│    → 확장 키워드로 추가 검색                                  │
│    → "AI 추천 연관 콘텐츠" 섹션에 점진적 표시                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 결과물

| 항목 | 파일/폴더 |
|------|-----------|
| 개발환경 설정 | .ddev/config.yaml |
| 프로젝트 지침 | AGENTS.md |
| 작업문서 폴더 | Docs/ |
| Git 제외 설정 | .gitignore |
| SLLM 계획서 | Docs/SLLM_검색시스템_계획서_v1.0.md |
| 설치 가이드 | Docs/SLLM_로컬환경_설치가이드.md |
| **FastAPI 서비스** | services/llm-search/ |
| **통합검색 JS** | web/modules/custom/si_data/js/si-combine-search.js |
| **통합검색 Twig** | web/modules/custom/si_data/templates/si-search.html.twig |
| **LLM 스타일** | web/modules/custom/si_data/css/si-combine-search.css |

---

## 현재 상태

| 항목 | 상태 |
|------|------|
| DDEV 환경 | ✅ 정상 동작 (MySQL 8.0) |
| URL | https://si-data.ddev.site |
| Git 브랜치 | feature/sllm-search-poc |
| Ollama | ✅ 실행 중 (`brew services start ollama`) |
| LLM 모델 | ✅ Qwen3 8B (5.2GB) |
| FastAPI | ✅ 구현 완료 (localhost:8000) |
| Drupal 연동 | ✅ 통합검색 수정 완료 |
| 테스트 | ✅ 기본 기능 동작 확인 |

---

## 다음 단계 (내일 작업)

### 우선순위 높음
1. **동의어 사전 통합** - `synonyms.json`을 FastAPI에서 활용하여 LLM 호출 전 로컬 매칭
2. **검색 품질 개선** - LLM 프롬프트 튜닝, 확장 키워드 품질 향상
3. **에러 핸들링 강화** - LLM 타임아웃, 네트워크 오류 대응

### 우선순위 중간
4. **CTR 추적 구현** - 사용자 클릭 데이터 수집 (검색어, 클릭한 결과)
5. **캐싱 구현** - 자주 검색되는 쿼리 결과 캐싱
6. **성능 최적화** - LLM 응답 시간 모니터링 및 개선

### 우선순위 낮음
7. **관리자 UI** - 동의어 사전 관리 인터페이스
8. **A/B 테스트 준비** - LLM 검색 효과 측정 기반 마련
9. **문서화** - 운영 배포 가이드 업데이트

---

## 서비스 실행 명령어

```bash
# 1. Ollama (LLM 서버)
brew services start ollama
# 확인: curl http://localhost:11434/api/tags

# 2. FastAPI (키워드 확장 API)
cd services/llm-search
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
# 확인: curl http://localhost:8000/health

# 3. DDEV (Drupal)
ddev start
# 확인: https://si-data.ddev.site/node/search?query=서울+인구

# 캐시 클리어
ddev drush cr
```

---

## 참고 문서

| 문서 | 경로 |
|------|------|
| SLLM 계획서 | Docs/SLLM_검색시스템_계획서_v1.0.md |
| 설치 가이드 | Docs/SLLM_로컬환경_설치가이드.md |
| 콘텐츠 타입 분석 | Docs/콘텐츠_타입_분석.md |
| 데이터로 본 서울 분석 | Docs/데이터로_본_서울-현_콘텐츠_택소노미_분석.md |
