---
title: 서울연구원 매뉴얼북
description: 서울연구데이터서비스(SI-DATA) 프로젝트 기술 문서
---

**서울연구데이터서비스** 프로젝트 기술 문서입니다.

---

## 문서 목록

| # | 분류 | 설명 |
|---|------|------|
| 1 | [SI-DATA 신규 콘텐츠 설계 문서](./new-content-design/design-overview/) | 7개 신규 콘텐츠 타입 설계 문서 |
| 2 | [검색시스템 설계 문서](./search-system/) | 통합검색, 패싯 필터, AI 인사이트 |
| 3 | [LLM Search PoC](./llm-search-poc/) | LLM 기반 검색 기능 개선 PoC |
| 4 | [통합검색 시스템 구성도](./system-architecture/) | CMS·검색엔진·AI·DB 연계 아키텍처 |

---

## 프로젝트 개요

- **프로젝트명**: SI-DATA (서울연구데이터서비스)
- **기술 스택**: Drupal 11, PHP 8.3, DDEV, Elasticsearch 7.17.14 (Nori), FastAPI, Vue.js 2
- **주요 기능**: 서울 통계/사진/지도 데이터 플랫폼
- **개발 브랜치**: `new-content-types`

---

## 주요 구현 현황 (2026-03-05)

- 7개 신규 콘텐츠 타입 공통요소 구현 완료
- 통합검색 5개 패싯 필터 구현 완료 (ITEM 타입, 간행물, 주제분류, 시기분류, 형태분류)
- PDF/HTML 문서 인덱싱 및 통합검색 연동
- AI 인사이트 (GPT-4o) 검색 결과 분석
- Nori 형태소 분석기 적용 (한글 검색 품질 향상)
