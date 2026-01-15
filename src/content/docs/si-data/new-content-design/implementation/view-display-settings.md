---
title: "View Display 설정"
---

> [SI-DATA 문서](../../../) / [SI-DATA 신규 콘텐츠 설계 문서](../design-overview/) / [구현](../)

**작성일**: 2026-01-15  
**버전**: 1.0

---

## 개요

신규 콘텐츠 타입의 View Display 설정입니다. 표시할 필드와 숨길 필드를 정의합니다.

---

## 표시 필드 (content 영역)

| 필드 | 라벨 표시 | Weight | 설명 |
|------|-----------|--------|------|
| links | - | 0 | 노드 링크 |
| body | hidden | 1 | 본문 |
| field_content | hidden | 2 | Paragraphs 콘텐츠 |
| field_date | above | 4 | 발행일자 |
| field_thumbnail | above | 7 | 대표이미지 |
| field_attached_file | above | 8 | 첨부파일 |
| field_keyword | above | 15 | 핵심 키워드 |

---

## 숨김 필드 (hidden 영역)

| 필드 | 이유 |
|------|------|
| field_item_type | 별도 표시 예정 |
| field_service | 별도 표시 예정 |
| field_chapter | 소제목 위치에 템플릿에서 직접 출력 |
| field_category_data | 관리용 |
| field_series | 관리용 |
| field_format | 관리용 |
| field_description | 관리용 |
| field_ggnuri | 관리용 |
| field_legacy | 관리용 |
| field_es | 관리용 |
| field_data_year | 관리용 |
| langcode | 시스템 필드 |
| search_api_excerpt | 시스템 필드 |

---

## 관련 문서

- [SI-DATA 신규 콘텐츠 설계 문서](../design-overview/)

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0 | 2026-01-15 | 초기 문서 작성 |
