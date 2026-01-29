---
title: 노드 템플릿 구현
---

# 노드 템플릿 구현

> [SI-DATA 문서](../../index/) / [SI-DATA 신규 콘텐츠 설계 문서](../SI-DATA_신규_콘텐츠_설계/) / [구현](./index/)

**작성일**: 2026-01-15  
**버전**: 1.0

---

## 개요

신규 콘텐츠 타입의 노드 템플릿 구현에 대한 문서입니다.

---

## 템플릿 파일 위치

```
web/themes/custom/datasi/templates/node/
├── node--data-content--full.html.twig
├── node--dxpr-content--full.html.twig
├── node--report-content--full.html.twig
├── node--html-content--full.html.twig
├── node--survey-content--full.html.twig
├── node--heritage-content--full.html.twig
└── node--photo-content--full.html.twig
```

---

## 템플릿 구조

```twig
<section class="fc01">
  <div class="inner">
    <article class="tc01" id="nid-{{ node.id }}">
      <div class="header">
        {% if node.field_chapter.entity %}
          <dl class="service">
            <dd>{{ node.field_chapter.entity.name.value }}</dd>
          </dl>
        {% endif %}
        <h1>{{ label }}</h1>
      </div>

      <div class="bodyA">
        {{ content|without('field_chapter') }}
      </div>
    </article>
  </div>
</section>
```

---

## 카테고리 소제목 표시

| 항목 | 값 |
|------|-----|
| 위치 | 제목(`<h1>`) 위에 소제목으로 표시 |
| 필드 | `field_chapter` (카테고리) |
| 출력 방식 | 노드 엔티티에서 직접 택소노미 term 이름 출력 |
| 코드 | `{{ node.field_chapter.entity.name.value }}` |

---

## 필드 템플릿

```
web/themes/custom/datasi/templates/field/
└── field--field-chapter.html.twig
```

카테고리 필드는 래퍼 없이 term 이름만 출력:

```twig
{% for item in items %}
  {{ item.content }}
{% endfor %}
```

---

## 관련 문서

- [SI-DATA 신규 콘텐츠 설계 문서](../SI-DATA_신규_콘텐츠_설계/)

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0 | 2026-01-15 | 초기 문서 작성 |
