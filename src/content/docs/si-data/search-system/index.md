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

5개 패싯 그룹 구현 (2026-03-25 업데이트):

| # | 패싯 (UI) | JS key | ES 필드 | 소스 | 구현 방식 |
|---|-----------|--------|---------|------|-----------|
| 1 | **타입** | `services` | `field_item_service` | `item_service` 택소노미 (depth 0, 8개) | `resolveServiceFacet()` — 자식→부모 rollup |
| 2 | **ITEM 타입명** | `types` | `field_item_type_name` | — (원문 텍스트, keyword) | ES aggregation 직접 사용 |
| 3 | **주제분류** | `categories` | `field_category_data` | `category_data` 택소노미 (17개) | `resolveTaxonomyFacet()` — 전체 표시 |
| 4 | **시기분류** | `periods` | `field_decade` | `category_decade` 택소노미 (4개) | `resolveTaxonomyFacet()` — 전체 표시 |
| 5 | **공공누리** | `ggnuris` | `field_ggnuri` | `list_string` allowed_values (4개) | `resolveListStringFacet()` — 전체 표시 |

### 타입(services) 패싯 상세

`item_service` 택소노미는 2단계 계층 구조:
- **depth 0 (1뎁스)**: ITEM 타입 (서울과 세계대도시, 통계로 본 서울 등 8개)
- **depth 1 (2뎁스)**: ITEM명 (통계로 본 서울 인구, 통계로 본 서울 경제 등)

ES `field_item_service` 필드에는 **2뎁스(자식) TID**가 저장됨. Search API 인덱스 설정:

```yaml
# config/sync/search_api.index.si.yml
field_item_service:
  label: 'data_content paragraph의 field_service'
  property_path: 'field_common_data:entity:field_service'
  type: integer
```

`resolveServiceFacet()`가 ES agg 버킷의 자식 TID doc_count를 `getItemServiceMapping()`으로 부모 기준 rollup 처리.

필터 적용 시 `getChildTidsForParent(parentTid)`로 부모 TID → 자식 TID 목록 확장 후 `post_filter`의 `terms` 절에 전달.

### 핵심 구현 패턴

- **`resolveTaxonomyFacet()`**: 택소노미 전체 용어를 로드하고 ES 집계 결과와 병합하는 범용 헬퍼
- **`resolveServiceFacet()`**: `item_service` 2뎁스 자식 TID를 1뎁스 부모 기준으로 rollup
- **`resolveListStringFacet()`**: `list_string` 타입 필드의 `allowed_values`를 패싯으로 변환
- count=0 항목도 표시 (클릭 불가)
- 동적 ES 인덱스명: `ElasticsearchIndexResolver` 서비스 사용
- **교차 필터링**: 각 agg는 자기 자신의 필터를 제외한 나머지 필터만 적용 (다중선택 시 같은 패싯의 다른 항목 count 유지)

### ES 인덱스 현재 매핑 (`elasticsearch_index_{db}_si`)

```
_language, body, created, field_category_data, field_data_year,
field_es, field_item_service, field_legacy, field_service,
field_survey_content, id, nid, service_title, status, title, type
```

**참고**: `field_item_service`는 `paragraph.data_content.field_service`를 통해 인덱싱 (`search_api.index.si.yml`의 `field_common_data:entity:field_service` 경로).

**미인덱싱 필드** (향후 추가 예정): `field_item_type_name`, `field_decade`, `field_ggnuri`, `field_chapter`, `field_keyword`

---

## 관련 파일

| 파일 | 설명 |
|------|------|
| `web/modules/custom/si_data/src/Controller/SearchController.php` | 통합검색 컨트롤러 |
| `web/modules/custom/si_data/js/si-combine-search.js` | 검색 프론트엔드 (Vue.js 2) |
| `web/modules/custom/si_data/templates/si-search.html.twig` | 검색 UI 템플릿 |
| `web/modules/custom/si_data/css/si-combine-search.css` | 검색 페이지 스타일 (패싯, 카드, AI 패널 등) |
| `web/modules/custom/si_data/src/Service/ElasticsearchIndexResolver.php` | ES 인덱스명 동적 해석 |
| `config/sync/search_api.index.si.yml` | Search API 인덱스 설정 (필드 매핑) |

---

## 관련 링크

- [신규 콘텐츠 설계 문서](../new-content-design/design-overview/)
- [LLM Search PoC](../llm-search-poc/)
