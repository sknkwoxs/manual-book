---
title: 구현 문서
---

# 구현 문서

> [SI-DATA 문서](../../index/) / [SI-DATA 신규 콘텐츠 설계 문서](../SI-DATA_신규_콘텐츠_설계/)

신규 콘텐츠 타입의 기술 구현 및 설정 가이드입니다.

---

## 문서 목록

| # | 문서 | 설명 |
|---|------|------|
| 1 | [아이템 계층 구조 구현](./아이템_계층구조_구현/) | AJAX 연동 드롭다운 구현 |
| 2 | [View Display 설정](./view-display-settings/) | 필드 표시/숨김 설정 |
| 3 | [노드 템플릿 구현](./node-template/) | Twig 템플릿 구조 |
| 4 | [테마 디버깅](./theme-debugging/) | Twig 디버깅 설정 |
| 5 | [테스트 및 확인](./testing/) | 테스트 URL 및 시나리오 |
| 6 | [Drush 명령어](./drush-commands/) | 택소노미 관리, CSV 마이그레이션 |

---

## 주요 구현 내용

### 아이템 계층 구조

ITEM 타입 → ITEM명 → 카테고리 순서의 AJAX 연동 드롭다운 구현

```
field_item_type (ITEM 타입)
       ↓ AJAX
field_service (ITEM명)
       ↓ AJAX
field_chapter (카테고리)
```

### 검색 패싯 (Faceted Search)

통합검색에서 분류체계 기반 5개 패싯 필터 구현 (2026-03-05 완료)

| 패싯 | 구현 방식 | 파일 |
|------|-----------|------|
| ITEM 타입 (9개) | 부모 TID → 자식 TID 확장 | `SearchController.php` |
| 간행물 | ES `service_title.keyword` 집계 | `SearchController.php` |
| 주제분류 (17개) | `resolveTaxonomyFacet()` | `SearchController.php` |
| 시기분류 (4개) | `resolveTaxonomyFacet()` | `SearchController.php` |
| 형태분류 (4개) | `resolveTaxonomyFacet()` | `SearchController.php` |

> 상세 문서: [검색시스템 설계 문서](../../search-system/)

### 관련 파일

- 모듈: `web/modules/custom/si_data/`
- 테마: `web/themes/custom/datasi/`

---

## 관련 링크

- [신규 콘텐츠 설계 문서 홈](../index/)
- [SI-DATA 신규 콘텐츠 설계 문서](../SI-DATA_신규_콘텐츠_설계/)
- [검색시스템 문서](../../search-system/)
