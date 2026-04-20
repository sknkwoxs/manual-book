---
title: SP100주년 뮤지엄 매뉴얼북
description: SP100주년 뮤지엄 웹사이트 운영 매뉴얼 및 개발 명세서
---

**SP100주년 뮤지엄** 웹사이트 기술 문서입니다.

---

## 문서 목록

| # | 분류 | 설명 |
|---|------|------|
| 1 | [관리자 매뉴얼](./manual/) | 웹사이트 콘텐츠 관리 및 운영 가이드 |
| 2 | [개발 명세서](./specification/) | 웹사이트 기술 구조 및 개발 문서 |

---

## 프로젝트 개요

- **프로젝트명**: SP100주년 기념 뮤지엄 사이트
- **고객사**: 삼화페인트 (SP100주년 기념)
- **기술 스택**: WordPress Multisite + Timber/Twig + Tailwind CSS + GSAP
- **시스템 유형**: WordPress 멀티사이트 기반 이벤트/갤러리 사이트 (blog_id=3)

---

## 접속 정보

| 환경 | 웹사이트 | 관리자 |
|------|----------|--------|
| **운영** | https://spsamhwa.com/museum | https://spsamhwa.com/museum/samwha-admin/ |
| **개발** | https://samhwa.sknkwoxs.com/museum | https://samhwa.sknkwoxs.com/museum/wp-admin/ |

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| **이벤트 관리** | 이벤트 등록/수정/삭제, 이벤트 기간 설정 |
| **당첨자 발표** | 이벤트 당첨자(수상작) 등록 및 관리 |
| **이벤트 댓글** | 이벤트 참여 댓글 승인/관리 |
| **갤러리 관리** | 갤러리 이미지 등록 및 관리 |

---

## 사이트 구조

```
WordPress Network (서브디렉토리 방식)
│
├── blog_id=1: / (국문 메인)
├── blog_id=2: /en/ (영문)
└── blog_id=3: /museum/ (뮤지엄) ★ 현재 문서 대상
```

---

## 문의 및 지원

시스템 관련 문의: **스컹크웍스스튜디오** (admin@skunkworks.co.kr)
