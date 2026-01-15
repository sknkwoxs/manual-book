---
title: "사진 콘텐츠 필드 구성"
---

> [SI-DATA 문서](../../../) / [SI-DATA 신규 콘텐츠 설계 문서](../design-overview/) / [콘텐츠 타입](../)

**콘텐츠 타입**: `photo_content`  
**작성일**: 2026-01-15  
**수정일**: 2026-01-15  
**버전**: 1.0

---

## 1. 개요

사진 콘텐츠는 디지털 사진 콘텐츠를 위한 콘텐츠 타입입니다.

공통요소는 [SI-DATA 신규 콘텐츠 설계 문서](../SI-DATA_신규_콘텐츠_설계.md#21-공통요소-group_common)를 참조하세요.

---

## 2. 개별요소 (group_content)

| # | 필드명 | 머신명 | 타입 | 설명 |
|---|--------|--------|------|------|
| 1 | 본문 | `body` | Text (formatted, long, summary) | 콘텐츠 본문 |
| 2 | 콘텐트 | `field_content` | Paragraphs | 동적 콘텐츠 구성 |

---

## 3. 구조 (group_structure)

| # | 필드명 | 머신명 | 타입 | 설명 |
|---|--------|--------|------|------|
| 1 | 첨부파일 | `field_attached_file` | File | 첨부 파일 |
| 2 | 대표이미지 | `field_thumbnail` | Image | 썸네일 이미지 |
| 3 | 연관 콘텐츠 | `field_related_data` | Paragraphs | 관련 콘텐츠 연결 |

---

## 4. 관리 (group_management)

| # | 필드명 | 머신명 | 타입 | 설명 |
|---|--------|--------|------|------|
| 1 | 발행일자 | `field_date` | Text (plain) | 발행 일자 |
| 2 | 데이터 연도 | `field_data_year` | Text (plain) | 데이터 기준 연도 |
| 3 | 검색제외 | `field_es` | Boolean | 검색 제외 여부 |

---

## 5. 관련 문서

- [SI-DATA 신규 콘텐츠 설계 문서](../design-overview/)

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0 | 2026-01-15 | 초기 문서 작성 |
