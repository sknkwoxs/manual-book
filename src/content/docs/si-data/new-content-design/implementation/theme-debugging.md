# 테마 디버깅

> [SI-DATA 문서](../../index.md) / [SI-DATA 신규 콘텐츠 설계 문서](../SI-DATA_신규_콘텐츠_설계.md) / [구현](./index.md)

**작성일**: 2026-01-15  
**버전**: 1.0

---

## 개요

Drupal Twig 테마 디버깅 설정에 대한 문서입니다.

---

## Twig 디버깅 활성화

`web/sites/default/services.yml` 설정:

```yaml
twig.config:
  debug: true
  auto_reload: true
```

---

## 디버깅 정보 확인

페이지 소스에서 템플릿 정보를 HTML 주석으로 확인 가능:

```html
<!-- THEME DEBUG -->
<!-- THEME HOOK: 'node' -->
<!-- FILE NAME SUGGESTIONS:
   * node--data-content--full.html.twig
   * node--data-content.html.twig
   * node--65464.html.twig
   * node.html.twig
-->
<!-- BEGIN OUTPUT from 'themes/custom/datasi/templates/node/node--data-content--full.html.twig' -->
```

---

## 관련 문서

- [SI-DATA 신규 콘텐츠 설계 문서](../SI-DATA_신규_콘텐츠_설계.md)

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0 | 2026-01-15 | 초기 문서 작성 |
