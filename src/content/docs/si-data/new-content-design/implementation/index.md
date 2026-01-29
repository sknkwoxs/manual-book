---
title: 구현 문서
---

# 구현 문서

> [SI-DATA 문서](../../index.md) / [SI-DATA 신규 콘텐츠 설계 문서](../SI-DATA_신규_콘텐츠_설계.md)

신규 콘텐츠 타입의 기술 구현 및 설정 가이드입니다.

---

## 문서 목록

| # | 문서 | 설명 |
|---|------|------|
| 1 | [아이템 계층 구조 구현](./아이템_계층구조_구현.md) | AJAX 연동 드롭다운 구현 |
| 2 | [View Display 설정](./view-display-settings.md) | 필드 표시/숨김 설정 |
| 3 | [노드 템플릿 구현](./node-template.md) | Twig 템플릿 구조 |
| 4 | [테마 디버깅](./theme-debugging.md) | Twig 디버깅 설정 |
| 5 | [테스트 및 확인](./testing.md) | 테스트 URL 및 시나리오 |

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

### 관련 파일

- 모듈: `web/modules/custom/si_data/`
- 테마: `web/themes/custom/datasi/`

---

## 관련 링크

- [신규 콘텐츠 설계 문서 홈](../index.md)
- [SI-DATA 신규 콘텐츠 설계 문서](../SI-DATA_신규_콘텐츠_설계.md)
