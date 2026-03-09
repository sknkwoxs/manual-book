---
title: "아이템 계층 구조 구현 문서"
---

> [SI-DATA 문서](../../) / [SI-DATA 콘텐츠 공통요소 설계 문서](../design-overview/) / [구현](./)

**작성일**: 2026-01-15  
**수정일**: 2026-03-09  
**버전**: 2.0

---

## 1. 개요

이 문서는 아이템 계층 구조의 기술적 구현에 대해 설명합니다.

아이템 계층 구조는 콘텐츠 분류를 위한 **2단 AJAX 연동 드롭다운** 구조입니다.

```
ITEM명 — depth 0 셀렉트박스 (field_service)
  └─ ITEM명 — depth 1 셀렉트박스 (field_service)
```

:::note[v2.0 변경사항]
기존 3단 구조 (`field_item_type` → `field_service` → `field_chapter`)에서 **2단 구조** (`field_service` depth 0 → depth 1)로 축소되었습니다. `field_item_type`과 `field_chapter`는 더 이상 사용하지 않습니다.
:::

구조적 설계에 대해서는 [SI-DATA 콘텐츠 공통요소 설계 문서](../design-overview/)를 참조하세요.

---

## 2. AJAX 연동 흐름

### 2.1 depth 0 셀렉트박스 선택 시

1. `field_service` depth 0 셀렉트박스에서 상위 분류 선택 (예: "지도로 본 서울")
2. AJAX 콜백 `si_data_update_service_options()` 실행
3. `field_service` depth 1 셀렉트박스 옵션이 선택된 depth 0 term의 자식으로 필터링됨
4. 자식이 1개인 경우 자동 선택

:::caution[v1.x에서 제거된 단계]
기존 2.2절 "ITEM명 선택 시" (`field_service` → `field_chapter` AJAX 연동)는 정책 변경으로 제거되었습니다. `field_chapter` 필드와 `si_data_update_category_options()` 콜백은 더 이상 사용하지 않습니다.
:::

---

## 3. 구현 코드

### 3.1 파일 위치

| 파일 | 경로 | 설명 |
|------|------|------|
| si_data.module | `web/modules/custom/si_data/` | AJAX 연동 로직 |

### 3.2 주요 함수

```php
/**
 * hook_form_alter() - 기존 콘텐츠 타입 폼에 AJAX 연동 설정
 */
function si_data_form_alter(&$form, FormStateInterface $form_state, $form_id)

/**
 * depth 0 옵션 반환
 * @return array depth 0 옵션 배열 (tid => name)
 */
function si_data_get_depth0_options()

/**
 * AJAX 콜백: depth 0 변경 시 depth 1 셀렉트박스 옵션 업데이트
 */
function si_data_update_service_options(array &$form, FormStateInterface $form_state)

/**
 * 선택된 depth 0 term의 자식 term 반환
 * @param int $depth0_tid depth 0 term ID
 * @return array depth 1 옵션 배열 (tid => name)
 */
function si_data_get_service_options($depth0_tid)
```

:::note[v1.x에서 제거된 함수]
다음 함수들은 3단→2단 축소로 더 이상 사용하지 않습니다:
- `si_data_get_item_type_options()` — `field_item_type` 관련
- `si_data_update_category_options()` — `field_chapter` 관련
- `si_data_get_category_options()` — item_category 관련
:::

### 3.3 대상 폼 목록

```php
$target_forms = [
  'node_data_seoul_form',
  'node_data_seoul_edit_form',
  'node_drag_and_drop_page_form',
  'node_drag_and_drop_page_edit_form',
  'node_insight_report_form',
  'node_insight_report_edit_form',
  'node_si_survey_form',
  'node_si_survey_edit_form',
  'node_archi_form',
  'node_archi_edit_form',
];
```

:::caution[v1.x에서 변경된 폼 목록]
기존 구 설계 머신명(`node_data_content_form` 등)에서 **기존 CMS 머신명**(`node_data_seoul_form` 등)으로 변경되었습니다. `html_content`는 보류 중이므로 제외, `photo_content`는 별도 공통요소 적용이므로 제외합니다.
:::

---

## 4. 필드 매핑

| 계층 | 필드명 | 머신명 | 택소노미 |
|------|--------|--------|----------|
| depth 0 | ITEM명 (상위) | `field_service` | item_service (depth 0) |
| depth 1 | ITEM명 (하위) | `field_service` | item_service (depth 1) |

:::caution[v1.x에서 제거된 필드]
- `field_item_type` (ITEM 타입, depth 0) — 제거. `field_service` depth 0이 이 역할을 대체합니다.
- `field_chapter` (카테고리, item_category 택소노미) — 제거. 2단 구조로 축소.
:::

---

## 5. 관련 문서

- [SI-DATA 콘텐츠 공통요소 설계 문서](../design-overview/)

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0 | 2026-01-15 | 초기 문서 작성 (SI-DATA_신규_콘텐츠_설계.md에서 분리) |
| 2.0 | 2026-03-09 | 정책 변경 반영 — 3단→2단 AJAX 축소, `field_item_type`/`field_chapter` 제거, 대상 폼 머신명을 기존 CMS 머신명으로 갱신, 제거된 함수/필드 안내 추가 |
