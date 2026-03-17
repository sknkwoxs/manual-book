---
title: "통합검색 시스템 구성도"
description: "서울연구데이터서비스 통합검색엔진 시스템 아키텍처 및 데이터 흐름"
---

> [SI-DATA 문서](../)

서울연구데이터서비스(data.si.re.kr) 통합검색엔진 **시스템 구성도**입니다.
Drupal CMS, Elasticsearch, 생성형 AI(FastAPI), MySQL, 서비스 UI 간의 연계 흐름을 정리합니다.

---

## 1. 전체 시스템 구성도

```mermaid
---
config:
  theme: base
  themeVariables:
    fontSize: 32px
  flowchart:
    nodeSpacing: 50
    rankSpacing: 60
    padding: 20
---
flowchart TB
    User(["사용자 (웹 브라우저)"])

    subgraph UI["서비스 UI (Vue.js 2.3 + Axios)"]
        VueApp["통합검색 SPA<br/>· /node/search<br/>· 병렬 호출: 검색 + AI 키워드 확장"]
        DataPage["데이터로 본 서울<br/>· /data"]
        PhotoPage["사진으로 본 서울<br/>· /photo"]
        MapPage["지도 보기<br/>· /map/view"]
    end

    User -->|"검색어 입력"| UI

    subgraph CMS["Drupal 11 CMS (PHP 8.3 · Nginx)"]
        subgraph Controllers["컨트롤러 (11개)"]
            SearchCtrl["SearchController<br/>· /si/combined/search<br/>· /api/elastic<br/>· /api/static-search"]
            LlmProxy["LlmProxyController<br/>· /api/llm/keywords<br/>· /api/llm/insight<br/>· /api/llm/config"]
            OtherCtrl["SiDataController · SiPhotoController<br/>· MapController · ChartController<br/>· SurveyController · DownloadController<br/>· SuggestionController"]
            IndexCtrl["IndexingController<br/>· /api/indexing/failed<br/>· /api/indexing/retry"]
        end

        subgraph Services["서비스 계층"]
            ESResolver["ElasticsearchIndexResolver<br/>· 환경별 DB명 → 인덱스명 동적 해석"]
            StaticIdx["StaticContentIndexer<br/>· Quarto 문서 자동 색인"]
            Hooks["si_data.module<br/>· hook_node_insert / update / delete<br/>· PDF 첨부 감지 → 색인 트리거"]
        end

        subgraph Security["보안 계층"]
            Flood["Flood API<br/>· IP: 인사이트 10회/분, 키워드 20회/분<br/>· 세션: 50회/일"]
            CSRF["CSRF 토큰 검증<br/>· 인사이트 요청 시 필수"]
            Cache["Drupal Cache<br/>· 인사이트 1시간, 키워드 2시간"]
        end

        Controllers --> Services
        LlmProxy --> Security
    end

    subgraph ES["Elasticsearch 7.17 (Nori 형태소 분석기)"]
        IdxSi["si 인덱스<br/>· data_seoul, insight_report,<br/>  si_survey, drag_and_drop_page"]
        IdxPhoto["photo 인덱스<br/>· digital_photo<br/>· 촬영장소, 좌표, 촬영연월"]
        IdxStatic["static_html 인덱스<br/>· Quarto 문서 섹션<br/>· breadcrumbs, parent_node"]
        IdxDoc["documents 인덱스<br/>· PDF 청크<br/>· chunk_index, source_id"]
    end

    subgraph MySQL["MySQL 8.0"]
        DrupalDB["Drupal 표준 테이블<br/>· node, taxonomy_term, file_managed"]
        CustomDB["커스텀 테이블<br/>· 다운로드 이력, 이용동의"]
    end

    subgraph AI["생성형 AI 서비스 (FastAPI · llm:8000)"]
        KWExpand["키워드 확장<br/>· POST /api/keywords/expand"]
        Insight["인사이트 생성<br/>· POST /api/insight/generate<br/>· PDF 근거 검색 → LLM 요약"]
        PDFIndex["PDF 색인<br/>· POST /api/indexing/node<br/>· 다운로드 → 파싱 → 청크 분할"]
        LLMEngine["LLM 엔진<br/>· OpenAI GPT 기반"]
        KWExpand --> LLMEngine
        Insight --> LLMEngine
    end

    subgraph External["외부 서비스"]
        Kakao["Kakao Map SDK<br/>· 사진 위치 마커, 클러스터링"]
        SeoulGIS["서울시 GIS API<br/>· 행정구역 배경 지도"]
    end

    VueApp -->|"① 검색 요청"| SearchCtrl
    VueApp -->|"② AI 키워드 확장 (병렬)"| LlmProxy
    VueApp -->|"③ AI 인사이트 요청"| LlmProxy
    DataPage & PhotoPage --> OtherCtrl
    MapPage --> OtherCtrl

    SearchCtrl -->|"multi_match + facet 집계"| ES
    ESResolver -.->|"인덱스명 동적 해석"| ES
    StaticIdx --> IdxStatic

    OtherCtrl --> MySQL
    SearchCtrl -->|"택소노미 용어 해석"| DrupalDB

    LlmProxy -->|"보안 검증 후 프록시 전달"| AI
    Hooks -->|"PDF 색인 트리거 (자동)"| PDFIndex
    PDFIndex -->|"청크 저장"| IdxDoc

    MapPage --> Kakao
    MapPage --> SeoulGIS
```

---

## 2. 컴포넌트별 역할

| 계층 | 컴포넌트 | 기술 스택 | 역할 |
|------|----------|-----------|------|
| **서비스 UI** | Vue.js SPA | Vue 2.3, Axios | 통합검색 화면, 검색결과·AI 인사이트 표시, facet 필터 |
| **CMS** | Drupal 11 | PHP 8.3, Nginx | 콘텐츠 관리, API 라우팅, 보안 프록시, 택소노미 관리 |
| **검색엔진** | Elasticsearch 7.17 | Nori 형태소 분석기, 4개 인덱스 | 전문검색(fuzzy), 다중 인덱스 통합검색, facet 집계 |
| **관계형 DB** | MySQL 8.0 | Drupal Schema | 노드·택소노미 저장, 다운로드 이력, 이용동의 |
| **생성형 AI** | FastAPI | Docker(llm:8000) | 키워드 확장, AI 인사이트, PDF 파싱·청크 색인 |
| **외부 API** | Kakao Map, 서울GIS | JavaScript SDK | 사진 위치 지도, 서울시 배경 지도 |

---

## 3. Elasticsearch 인덱스 구조

4개 인덱스가 역할별로 분리 운영됩니다. 인덱스명은 `ElasticsearchIndexResolver`가 환경별 DB 이름을 반영해 동적으로 해석합니다.

| 인덱스 | 관리 주체 | 대상 콘텐츠 | 주요 필드 |
|--------|-----------|-------------|-----------|
| `si` | Search API | data_seoul, insight_report, si_survey, drag_and_drop_page | title, body, field_category_data, field_service, created |
| `photo` | Search API | digital_photo | title, 촬영장소, 좌표(x/y), 촬영연월, 컬렉션 |
| `static_html` | StaticContentIndexer | Quarto 문서 섹션 | section, text, breadcrumbs, parent_node |
| `documents` | FastAPI LLM | PDF 청크 | title, body, file_name, chunk_index, source_id |

---

## 4. 통합검색 데이터 흐름

사용자가 검색어를 입력했을 때의 처리 순서입니다. **검색 요청**과 **AI 키워드 확장**이 **병렬**로 동시 실행됩니다.

```mermaid
sequenceDiagram
    participant U as 사용자
    participant V as Vue.js SPA
    participant D as Drupal CMS
    participant E as Elasticsearch
    participant A as AI 서비스 (FastAPI)
    participant M as MySQL

    U->>V: 검색어 입력 (예: "서울 인구변화")

    par 병렬 호출 — 1 + 2 동시 실행
        V->>D: 1. GET /si/combined/search?query=서울 인구변화
        D->>E: multi_match 검색 (si 인덱스)
        E-->>D: 노드 결과 (nid 목록)
        D->>E: 연관 문서 검색 (static_html + documents)
        E-->>D: 정적 문서 + PDF 청크
        D->>M: 택소노미 용어 로드 (facet 라벨 해석)
        M-->>D: 분류명, 연대명
        D->>E: post_filter + 집계 (다중선택 facet)
        E-->>D: facet 카운트
        D-->>V: 그룹화된 검색 결과 + facet
    and
        V->>D: 2. POST /api/llm/keywords {query}
        D->>D: Flood 제한 확인 + 캐시 조회
        D->>A: POST /api/keywords/expand
        A-->>D: {expanded_keywords: ["인구감소", "고령화", ...]}
        D-->>V: 확장된 키워드 목록
        V->>E: 키워드별 추가 검색
        E-->>V: AI 추천 연관 콘텐츠
    end

    V-->>U: 검색 결과 + AI 추천 연관 콘텐츠 표시

    opt 사용자가 AI 인사이트 요청 시
        U->>V: "서울 인구변화 추세는?" (질문 입력)
        V->>D: 3. POST /api/llm/insight {query, question}
        D->>D: Flood 제한 + CSRF 검증
        D->>A: POST /api/insight/generate
        A->>E: 관련 문서 검색 (documents 인덱스)
        E-->>A: PDF 청크 (근거 자료)
        A->>A: LLM 분석·요약 생성 (인용 포함)
        A-->>D: {insight, citations}
        D-->>V: AI 인사이트 응답
        V-->>U: AI 분석 결과 (인용 링크 포함)
    end
```

---

## 5. PDF 자동 색인 흐름

관리자가 콘텐츠를 등록·수정하면 첨부 PDF가 자동으로 파싱되어 검색 가능해집니다.

```mermaid
sequenceDiagram
    participant Admin as 관리자
    participant D as Drupal CMS
    participant A as AI 서비스 (FastAPI)
    participant E as Elasticsearch

    Admin->>D: 노드 생성/수정 (data_seoul, si_survey, insight_report 등)
    D->>D: hook_node_insert/update 실행 — PDF 첨부 확인
    D->>A: POST /api/indexing/node {nid, action: index}
    A->>A: PDF 다운로드 → 파싱 → 텍스트 청크 분할
    A->>E: documents 인덱스에 청크 저장
    E-->>A: 색인 완료
    A-->>D: 성공 응답

    alt 색인 실패 시
        A-->>D: 실패 응답
        D->>D: State API에 실패 기록 (최대 3회 재시도, 5분 쿨다운)
    end

    Note over Admin,E: 색인된 PDF는 통합검색에서 원본 노드와 그룹화되어 표시
```

---

## 6. 보안 및 요청 제한

AI 서비스 호출은 `LlmProxyController`를 통해 다층 보안이 적용됩니다.

| 보안 계층 | 방식 | 설정 |
|-----------|------|------|
| **Referer 검증** | 허용 호스트만 통과 | `data.si.re.kr`, `si-data.ddev.site` |
| **IP 요청 제한** | Flood API | 인사이트 10회/분, 키워드 20회/분 |
| **세션 제한** | Flood API | 50회/일 |
| **CSRF 토큰** | 토큰 검증 | 인사이트 요청 시 필수 |
| **응답 캐싱** | Drupal Cache | 인사이트 1시간, 키워드 2시간 |

---

## 7. API 엔드포인트 전체 목록

### 검색 관련

| 엔드포인트 | 메서드 | 컨트롤러 | 설명 |
|------------|--------|----------|------|
| `/node/search` | GET | SearchController | 통합검색 페이지 (Vue.js SPA) |
| `/si/combined/search` | GET | SearchController | 노드 기준 그룹화 검색 + facet |
| `/api/elastic` | POST | SearchController | ES 프록시 (data/photo) |
| `/api/static-search` | GET/POST | SearchController | 정적 콘텐츠 + PDF 검색 |

### AI 관련

| 엔드포인트 | 메서드 | 컨트롤러 | 설명 |
|------------|--------|----------|------|
| `/api/llm/config` | GET | LlmProxyController | AI 서비스 설정 조회 |
| `/api/llm/keywords` | POST | LlmProxyController | 키워드 확장 (연관 검색어) |
| `/api/llm/insight` | POST | LlmProxyController | AI 인사이트 생성 |
| `/api/indexing/failed` | GET | IndexingController | 실패 색인 큐 조회 |
| `/api/indexing/retry` | POST | IndexingController | 실패 색인 재시도 |

### 데이터·사진·지도

| 엔드포인트 | 메서드 | 컨트롤러 | 설명 |
|------------|--------|----------|------|
| `/data` | GET | SiDataController | 데이터로 본 서울 메인 |
| `/photo` | GET | SiPhotoController | 사진으로 본 서울 메인 |
| `/map/view` | GET | MapController | 지도 보기 (Kakao Map + 서울GIS) |
| `/map/markers` | GET | MapController | 사진 마커 (좌표 범위 검색) |

---

## 8. 핵심 흐름 요약

| # | 흐름 | 경로 | 설명 |
|---|------|------|------|
| 1 | **통합검색** | 사용자 → Vue.js → Drupal → ES 4개 인덱스 → 결과 그룹화 + facet | 노드 기준으로 관련 문서를 묶어 표시 |
| 2 | **AI 연관검색** | 사용자 → Drupal 프록시(보안) → FastAPI → LLM → 키워드 → ES 추가 검색 | 검색과 **병렬 실행**, "AI 추천 연관 콘텐츠" 표시 |
| 3 | **AI 인사이트** | 사용자 질문 → Drupal 프록시 → FastAPI → PDF 인덱스 근거 검색 → LLM 요약 | 인용 출처 포함 분석 결과 |
| 4 | **PDF 자동 색인** | 관리자 콘텐츠 등록 → Drupal 훅 → FastAPI → PDF 파싱·청크 → ES 저장 | 등록 즉시 검색 가능 |
