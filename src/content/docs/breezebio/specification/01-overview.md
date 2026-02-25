---
title: 1. 프로젝트 개요
---

## 1.1 시스템 소개

GenEdit(BreezeBio) 웹사이트는 유전자 치료제 개발 기업 BreezeBio의 기업 소개 웹사이트입니다. NanoGalaxy® 기술 플랫폼, 파이프라인 현황, 팀 소개, 뉴스 등 기업 정보를 제공합니다.

### 주요 특징

| 특징 | 설명 |
|------|------|
| **모던 프론트엔드** | Svelte 5 + Tailwind CSS v4로 구현된 인터랙티브 UI |
| **다국어 지원** | 영어/한국어 (Polylang) |
| **블록 시스템** | ACF Pro 기반 19개 커스텀 블록 |
| **SEO 최적화** | 시맨틱 HTML + All in One SEO |
| **GDPR 준수** | Complianz 쿠키 동의 관리 |

---

## 1.2 시스템 구성

| 구분 | 설명 | URL |
|------|------|-----|
| 프론트엔드 | 일반 사용자 웹사이트 | https://breezebio.com |
| 관리자 | WordPress 관리 시스템 | https://breezebio.com/wp/wp-admin |
| 개발 환경 | 로컬 DDEV 환경 | https://genedit.ddev.site |

---

## 1.3 주요 기능

### 콘텐츠 관리

| 기능 | 설명 |
|------|------|
| **페이지 편집** | 블록 에디터 기반 페이지 구성 |
| **뉴스 관리** | 보도자료, 공지사항 등록 |
| **미디어 관리** | 이미지, 파일 업로드 |

### 커스텀 포스트 타입

| CPT | 설명 |
|-----|------|
| **Team Members** | 팀 멤버 (Leadership, Advisors, Board) |
| **Contact Us** | 문의 폼 제출 내역 |
| **Legal Documents** | 법무 문서 (이용약관, 개인정보처리방침) |

### 다국어

| 기능 | 설명 |
|------|------|
| **Polylang** | 콘텐츠 다국어 관리 |
| **메뉴 번역** | 코드 기반 메뉴 라벨 번역 |
| **URL 구조** | 영어: `/about`, 한국어: `/ko/about` |

---

## 1.4 대상 사용자

| 사용자 유형 | 접속 시스템 | 주요 활동 |
|------------|------------|----------|
| 일반 방문자 | breezebio.com | 기업 정보 조회, 뉴스 확인, 문의 |
| 콘텐츠 관리자 | wp-admin | 페이지 편집, 뉴스 등록, 팀 멤버 관리 |
| 개발자 | 로컬 DDEV | 테마 개발, 블록 추가, 기능 구현 |

---

## 1.5 개발 배경 및 목표

### 개발 목표

1. **브랜드 일관성**: Figma 디자인의 픽셀 퍼펙트 구현
2. **관리 편의성**: 비개발자도 쉽게 편집 가능한 블록 시스템
3. **다국어 대응**: 글로벌 기업에 맞는 영어/한국어 지원
4. **성능 최적화**: Svelte + Vite로 빠른 로딩 속도

### 핵심 설계 원칙

| 원칙 | 설명 |
|------|------|
| **Bedrock 구조** | WordPress 코어와 커스텀 코드 분리 |
| **Timber + Twig** | PHP 로직과 템플릿 분리 |
| **Svelte 하이브리드** | 인터랙티브 컴포넌트는 Svelte로 구현 |
| **SEO 우선** | 서버사이드 렌더링 + `.seo-content` 폴백 |

---

## 1.6 웹사이트 구조

### 사이트맵

```
breezebio.com/
├── / (Home)
├── /about
├── /nanogalaxy
├── /science
├── /pipeline
├── /news
│   └── /{slug} (개별 뉴스)
├── /careers
├── /contact
└── /legal
    ├── /terms
    ├── /privacy
    └── /cookies
```

### 한국어 URL 구조

```
breezebio.com/ko/
├── /ko/ (홈)
├── /ko/about
├── /ko/nanogalaxy
└── ... (동일 구조)
```

---

[다음: 2. 시스템 아키텍처 →](./02-architecture.md)
