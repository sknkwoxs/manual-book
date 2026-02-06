---
title: 부록
description: 수정 파일 목록, 미결 사항, 용어 설명
---

# Part 10. 부록

---

## 10.1 수정 필요 파일 요약

개발팀 작업 시 참고할 파일 목록입니다.

### 테마 파일 (sknk)

| 경로 | 수정 내용 |
|------|----------|
| `twigs/base.twig` | Schema.org, 메타데이터 |
| `twigs/partial/header.twig` | SNS 링크 |
| `twigs/partial/footer.twig` | 회사명, Copyright, SNS 링크 |
| `twigs/home.twig` | 해시태그, SNS 텍스트 |
| `twigs/templates/company/*.twig` | 회사소개 페이지 |
| `twigs/templates/extra/privacy.twig` | 개인정보처리방침 |
| `twigs/mail/*.twig` | 메일 템플릿 (5개) |
| `twigs/archive-news.twig` | 뉴스 목록 페이지 안내 문구 |
| `twigs/templates/newsletter-request.twig` | 뉴스레터 구독 페이지 |
| `twigs/partial/newsletter-banner.twig` | 뉴스레터 배너 |
| `inc/register.php` | 메일 발송자 |
| `inc/ajax.php` | 메일 제목 |
| `src/css/common.css` | 로고 참조 경로 |
| `src/css/contents.css` | 로고 참조 경로 |
| `src/images/common/` | 로고, Favicon, 뉴스레터 OG 이미지 |
| `src/images/contents/` | 회사소개 로고 |
| `src/images/contents/customer/` | **대리점 찾기 마커 이미지 (marker_default.svg, marker_on.png)** |
| `src/js/customer/store.js` | 마커 이미지 경로 참조 |

### 영문 테마 (sknk_en)

- 동일 구조로 동일 파일 수정 필요

### 설정 파일

| 파일 | 수정 내용 |
|------|----------|
| `.env` | WP_HOME, DOMAIN_CURRENT_SITE |
| `web/sitemap-*.xml` | 도메인 변경 |

### 데이터베이스

| 테이블 | 수정 내용 |
|------|----------|
| `wp_posts` | 뉴스, 뉴스레터, 공지사항 등 게시물 본문 내 사명 변경 |
| `wp_postmeta` | 게시물 메타 정보 내 사명 변경 (필요 시) |

---

## 10.2 미결 사항

> 아래 항목들은 관련 부서의 추가 확인이 필요합니다.

### 10.2.1 해외법인 명칭 변경 여부

연혁 페이지에 해외법인 명칭이 포함되어 있습니다. 해외법인 명칭도 변경되는지 확인이 필요합니다.

- SAMHWA PAINTS INDIA PVT.LTD (인도)
- SAMHWA PAINTS VINA CO.,LTD (베트남)
- SAMHWA PAINTS (M) SDN.BHD (말레이시아)

### 10.2.2 구매포털 도메인 처리

현재 대리점용 구매포털이 `gume.samhwa.com`에서 운영 중입니다.

- 이 도메인도 변경되나요?
- 변경 시 대리점에 사전 안내가 필요합니다.

### 10.2.3 Family Site 연동 사이트

푸터의 Family Site 메뉴에 연결된 사이트들입니다.

| 사이트 | 도메인 | 확인 필요 사항 |
|--------|--------|---------------|
| 컬러디자인센터 | scd.spi.co.kr | 도메인 유지? |
| 파우톤 분체도료 | powton.co.kr | 도메인 유지? |
| 카로클 자동차 도료 | karocle.com | 도메인 유지? |
| 대리점전용 시스템 | paintnet.co.kr | 도메인 유지? |

### 10.2.4 SNS 계정 변경 여부

현재 SNS 계정명에 "samhwa"가 포함되어 있습니다.

| 플랫폼 | 현재 계정명 | 변경 여부 |
|--------|------------|----------|
| Instagram | samhwa_paint | ? |
| Naver Blog | samhwapaint_official | ? |
| 스마트스토어 | samhwapaint | ? |

> SNS 계정명 변경 시 기존 팔로워/구독자는 유지되지만, 웹사이트의 모든 링크를 수정해야 합니다.

### 10.2.5 슬로건 변경 여부

현재 슬로건 **"삼화니까 안심이다"**가 비전 페이지에 사용되고 있습니다. 슬로건도 변경되는지 확인이 필요합니다.

### 10.2.6 기존 게시물 처리 범위

뉴스, 뉴스레터 등 기존 게시물 내 사명 변경과 관련하여 확인이 필요합니다.

| 확인 사항 | 상세 |
|----------|------|
| **변경 범위** | 모든 과거 게시물을 변경할지, 특정 시점 이후 게시물만 변경할지? |
| **변경 방식** | "삼화페인트" → 신규 사명으로 단순 치환? 또는 문맥별 검토 후 수정? |
| **이미지 처리** | 게시물에 첨부된 이미지 내 로고/사명도 교체 대상인지? |
| **PDF 자료** | 기술자료, 카탈로그 등 PDF 파일 내 사명도 교체 대상인지? |

> **참고:** 과거 보도자료의 경우, 당시 시점의 사실을 기록한 것이므로 변경하지 않는 것이 일반적입니다. 단, 회사 정책에 따라 결정이 필요합니다.

---

## 10.3 용어 설명

이 보고서에서 사용된 기술 용어들을 정리했습니다.

| 용어 | 설명 |
|------|------|
| **도메인** | 웹사이트 주소 (예: samhwa.com) |
| **SSL 인증서** | 웹사이트 보안 접속(https)을 가능하게 하는 디지털 인증서 |
| **DNS** | 도메인 이름을 서버 IP 주소로 변환해주는 시스템 |
| **301 리다이렉트** | 영구적인 페이지 이동을 알려주는 방식. 검색엔진이 새 주소를 인식하도록 도움 |
| **SEO** | 검색엔진최적화. 검색 결과 상위 노출을 위한 작업 |
| **Schema.org** | 검색엔진이 웹사이트 정보를 이해하도록 돕는 표준 데이터 형식 |
| **GTM** | Google Tag Manager. 다양한 추적 코드를 관리하는 도구 |
| **GA/GA4** | Google Analytics. 웹사이트 방문자 분석 도구 |
| **API** | 다른 서비스의 기능을 사용할 수 있게 해주는 연결 방식 |
| **캐시** | 빠른 로딩을 위해 파일을 임시 저장하는 것 |
| **스테이징** | 실제 서비스 전 테스트를 위한 환경 |
| **배포** | 개발된 코드를 실제 서버에 적용하는 것 |

---

[← Part 9. 소요시간 산정](./09-timeline-estimation.md) | [목차로 돌아가기 →](./00-index.md)


