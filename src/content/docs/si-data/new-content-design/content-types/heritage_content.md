---
title: 서울의 근현대유산 필드 구성
---

# 서울의 근현대유산 필드 구성

> [SI-DATA 문서](../../index/) / [SI-DATA 콘텐츠 공통요소 설계 문서](../design-overview/) / [콘텐츠 타입](./index/)

**콘텐츠 타입**: `archi`  
**작성일**: 2026-01-15  
**수정일**: 2026-03-09  
**버전**: 2.0

---

## 1. 개요

기존 CMS의 `archi` 콘텐츠 타입에 **8개 공통요소 필드를 추가**합니다. 근현대 유산 데이터를 위한 콘텐츠 타입입니다.

공통요소 필드는 [SI-DATA 콘텐츠 공통요소 설계 문서](../design-overview/#21-공통요소-8개-필드)를 참조하세요.

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

- [SI-DATA 콘텐츠 공통요소 설계 문서](../design-overview/)
- [GNB 메뉴 구조 설계](../gnb-menu-structure/)

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0 | 2026-01-15 | 초기 문서 작성 |
| 2.0 | 2026-03-09 | 정책 변경 반영 — 머신명 `heritage_content` → `archi` (기존 CMS 유지), 공통요소 참조 링크 변경 |
