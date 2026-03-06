---
title: "검색시스템 설계 문서"
---

> [SI-DATA 문서](../)

SI-DATA 통합검색 시스템 관련 문서입니다.

---

## 문서 목록

| # | 문서 | 설명 |
|---|------|------|
| 1 | [SLLM 검색시스템 계획서](./search-system-plan/) | 검색시스템 설계 및 계획 |
| 2 | [SLLM 로컬환경 설치가이드](./local-setup-guide/) | 로컬 개발 환경 설정 |
| 3 | [작업보고서 2026-01-14](./work-report-2026-01-14/) | 작업 진행 보고 |

---

## 시스템 개요

- **검색엔진**: Elasticsearch 7.17.14 (Nori 형태소 분석기)
- **검색 API**: `/si/combined/search` (SearchController)
- **주요 기능**: 전문 검색, 패싯 필터, AI 인사이트, PDF/HTML 인덱싱

---

## 통합검색 아키텍처

```
[브라우저] → /si/search (Vue.js 2 SPA)
    │
    ├── /si/combined/search (SearchController::combinedSearch)
    │   ├── ES: elasticsearch_index_{db}_si (노드 검색)
    │   ├── ES: elasticsearch_index_{db}_static_html (Quarto 문서)
    │   └── ES: elasticsearch_index_{db}_documents (PDF 문서)
    │
    └── /api/llm-proxy/* (LlmProxyController → FastAPI)
        ├── /api/insight/generate (AI 인사이트)
        └── /api/keywords/expand (키워드 확장)
```

## 검색 패싯 (Faceted Search)

5개 패싯 그룹 구현 완료 (2026-03-05):

| # | 패싯 (UI) | ES 필드 | 택소노미 | 구현 방식 |
|---|-----------|---------|----------|-----------|
| 1 | **ITEM 타입** | `field_service` | `item_service` (depth 0, 9개) | 부모 TID → 자식 TID 확장 (`getChildTidsForParent`) |
| 2 | **간행물** | `service_title.keyword` | — (원문 텍스트) | ES aggregation 직접 사용 |
| 3 | **주제분류** | `field_category_data` | `category_data` (17개) | `resolveTaxonomyFacet()` — 전체 표시 |
| 4 | **시기분류** | `field_series` | `category_period` (4개) | `resolveTaxonomyFacet()` — 전체 표시 |
| 5 | **형태분류** | `field_format` | `category_format` (4개) | `resolveTaxonomyFacet()` — 전체 표시 |

### 핵심 구현 패턴

- **`resolveTaxonomyFacet()`**: 택소노미 전체 용어를 로드하고 ES 집계 결과와 병합하는 범용 헬퍼
- count=0 항목도 표시 (`.facet-item-disabled` 스타일 적용, 클릭 불가)
- 동적 ES 인덱스명: `ElasticsearchIndexResolver` 서비스 사용

### ES 인덱스 현재 매핑 (`elasticsearch_index_{db}_si`)

```
_language, body, created, field_category_data, field_data_year,
field_es, field_service, nid, service_title, status, title, type
```

**미인덱싱 필드** (향후 추가 예정): `field_item_type`, `field_series`, `field_format`, `field_chapter`, `field_keyword`

---

## 관련 파일

| 파일 | 설명 |
|------|------|
| `web/modules/custom/si_data/src/Controller/SearchController.php` | 통합검색 컨트롤러 |
| `web/modules/custom/si_data/js/si-combine-search.js` | 검색 프론트엔드 (Vue.js 2) |
| `web/modules/custom/si_data/templates/si-search.html.twig` | 검색 UI 템플릿 |
| `web/modules/custom/si_data/src/Service/ElasticsearchIndexResolver.php` | ES 인덱스명 동적 해석 |
| `web/themes/custom/datasi/css/custom.css` | 패싯 스타일 (facet-item-disabled 등) |

---

## 관련 링크

- [신규 콘텐츠 설계 문서](../new-content-design/design-overview/)
- [LLM Search PoC](../llm-search-poc/)
