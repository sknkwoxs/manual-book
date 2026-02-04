---
title: 교체 대상 식별
description: 로고, 텍스트, DB 등 교체가 필요한 대상 목록
---

# Part 2. 교체 대상 식별

이 섹션에서는 웹사이트 내에서 로고와 사명이 사용되는 모든 위치를 나열합니다. **개발팀에서 실제 작업 시 참고할 상세 목록**입니다.

---

## 2.1 로고 이미지 파일 (총 24개)

웹사이트에서 로고는 다양한 형태와 크기로 여러 곳에 사용됩니다. 같은 로고라도 PC용, 모바일용, 배경색에 따른 버전(빨간색, 흰색) 등 여러 파일이 필요합니다.

### 메인 로고 (한국어 테마 - 12개)

| 파일 | 경로 | 용도 |
|------|------|------|
| logo-samhwa-red.svg | `sknk/src/images/common/` | PC 헤더 로고 |
| logo-samhwa-red.png | `sknk/src/images/common/` | 스키마 데이터용 |
| logo-samhwa-white.svg | `sknk/src/images/common/` | 흰색 로고 |
| logo-samhwa-white.png | `sknk/src/images/common/` | 흰색 로고 PNG |
| logo-samhwa-red-bf.svg | `sknk/src/images/common/` | 브라우저 폴백 |
| logo-samhwa-white-bf.svg | `sknk/src/images/common/` | 브라우저 폴백 |
| logo_red.png | `sknk/src/mobile/images/common/` | 모바일 헤더 |
| logo_white.png | `sknk/src/mobile/images/common/` | 모바일 흰색 |
| logo-samhwa-original.svg | `sknk/src/images/contents/company/` | 회사소개 페이지 |
| logo_about.png | `sknk/src/mobile/images/contents/` | 모바일 회사소개 |
| logo_search_01_samhwa.svg | `sknk/src/images/contents/color/` | 컬러검색 로고 |
| common-logo-logo-samhwa-white.svg | `sknk/src/images/contents/color/finder/` | 컬러파인더 로고 |

### 영문 테마 (12개)
- 동일 구조로 `sknk_en` 테마 내 동일 파일 존재

### 대리점 찾기 지도 마커 이미지 (4개)

**확인 URL:** https://samhwa.com/customer/findus

대리점 찾기 페이지의 카카오맵에서 사용되는 마커 이미지에도 **"SAMHWA" 로고가 포함**되어 있습니다.

| 파일 | 경로 | 용도 | 크기 |
|------|------|------|------|
| marker_default.svg | `sknk/src/images/contents/customer/` | 기본 마커 (빨간 말풍선 + SAMHWA 로고) | 58x74px |
| marker_on.png | `sknk/src/images/contents/customer/` | 선택된 마커 | 112x112px |
| marker_default.png | `sknk_en/src/images/contents/customer/` | 영문 기본 마커 | - |
| marker_on.png | `sknk_en/src/images/contents/customer/` | 영문 선택된 마커 | - |

**마커 이미지 사용 위치 (JavaScript):**
- `sknk/src/js/customer/store.js` (Line 416)
- `sknk/src/mobile/js/customer/store.js`
- `sknk_en/src/js/customer/store.js`
- `sknk_en/src/mobile/js/customer/store.js`

> **디자인팀 요청 사항:** 신규 마커 이미지 필요
> - SVG 형식 (marker_default.svg 대체용, 58x74px viewBox)
> - PNG 형식 (marker_on.png 대체용, 112x112px)
> - 빨간색 말풍선 안에 신규 로고가 들어간 디자인

### Favicon (6개)

**Favicon이란?** 브라우저 탭이나 북마크에 표시되는 작은 아이콘(16x16 또는 32x32 픽셀)입니다. 사용자가 여러 탭을 열어놓았을 때 우리 사이트를 쉽게 식별할 수 있게 해줍니다.

| 경로 |
|------|
| `sknk/favicon.ico` |
| `sknk/src/images/common/favicon.ico` |
| `sknk/src/mobile/images/common/favicon.ico` |
| `sknk_en/favicon.ico` |
| `sknk_en/src/images/common/favicon.ico` |
| `sknk_en/src/mobile/images/common/favicon.ico` |

> **디자인팀 요청 사항:** 신규 로고 파일은 아래 형식으로 제공해 주세요.
> - SVG 형식 (벡터, 확대해도 깨지지 않음)
> - PNG 형식 (배경 투명)
> - ICO 형식 (Favicon용, 16x16, 32x32, 48x48 포함)
> - 빨간색 버전과 흰색 버전 각각 필요

---

## 2.2 텍스트 교체 대상

웹사이트 곳곳에 "삼화페인트"라는 회사명이 텍스트로 직접 입력되어 있습니다. 이 텍스트들은 모두 신규 사명으로 변경해야 합니다.

### 2.2.1 푸터 (페이지 하단 영역)

모든 페이지 하단에 표시되는 회사 정보입니다.

**확인 URL:** https://samhwa.com (모든 페이지 하단)

**파일 위치:** `twigs/partial/footer.twig`

| 위치 | 라인 | 현재 텍스트 |
|------|------|-------------|
| PC 푸터 | 14 | `삼화페인트공업(주)` |
| PC 푸터 | 55 | `ⓒ 2020 SAMHWA PAINTS INDUSTRIAL CO., LTD. All Rights Reserved.` |
| 모바일 푸터 | 69 | `삼화페인트공업(주)` |
| 모바일 푸터 | 78 | `ⓒ 2020 SAMHWA PAINTS INDUSTRIAL CO., LTD.` |

### 2.2.2 Schema.org 구조화 데이터

**구조화 데이터란?** 검색엔진(구글, 네이버 등)이 우리 웹사이트의 정보를 더 잘 이해할 수 있도록 제공하는 특별한 형식의 데이터입니다. 검색 결과에 회사 정보가 풍부하게 표시되는 데 영향을 줍니다.

**파일 위치:** `twigs/base.twig`

| 라인 | 현재 값 | 변경 필요 |
|------|---------|----------|
| 65 | `"name": "삼화페인트"` | 신규 사명 |
| 66 | `"url": "https://samhwa.com"` | 신규 도메인 |
| 67 | `"logo": "https://samhwa.com/app/themes/sknk/...logo-samhwa-red.png"` | 신규 로고 URL |
| 69-72 | SNS URL (`samhwa_paint`, `samhwapaint_official` 등) | SNS 계정 변경 시 |
| 84-108 | 네비게이션 URL | 도메인 변경 |

### 2.2.3 회사소개 페이지

회사소개 페이지에는 회사명과 관련 문구가 여러 곳에 포함되어 있습니다.

**확인 URL:**
- 회사소개: https://samhwa.com/company/intro
- 비전/미션: https://samhwa.com/company/vision
- 연혁: https://samhwa.com/company/history

**파일 위치:** `twigs/templates/company/`

| 파일 | 주요 텍스트 |
|------|-------------|
| `intro.twig` | "삼화페인트공업㈜는 1946년 창립 이래..." |
| `vision.twig` | "삼화페인트 미션", "2028 삼화페인트 비전", "삼화니까 안심이다" |
| `history.twig` | 해외법인명 (SAMHWA PAINTS INDIA, SAMHWA PAINTS VINA 등) |

> **확인 필요:** 슬로건 "삼화니까 안심이다"도 변경되는지 확인 필요

### 2.2.4 이메일 발송 관련

웹사이트에서 고객 문의, IR 미팅 예약 등이 접수되면 자동으로 이메일이 발송됩니다. 이 이메일의 발신자명과 제목에 회사명이 포함되어 있습니다.

**관련 URL (폼 제출 페이지):**
- 고객 상담: https://samhwa.com/customer/counsel
- 아파트 도장 문의: https://samhwa.com/apt-request
- IR 미팅 예약: https://samhwa.com/ir/meeting
- 컬러북/색상 견본: https://samhwa.com/color/colorbook
- WEB 교육 신청: https://samhwa.com/education
- 분석 의뢰: https://samhwa.com/analysis

**파일 위치:** `inc/register.php`, `inc/ajax.php`

| 파일 | 라인 | 내용 |
|------|------|------|
| `register.php` | 946 | `'web-manager@samhwa.com'` (발신자 이메일) |
| `register.php` | 953 | `'삼화페인트'` (발신자명) |
| `ajax.php` | 35 | `[삼화페인트]아파트도장 1:1 문의가 등록되었습니다` |
| `ajax.php` | 140 | `[삼화페인트]IR 미팅 예약이 완료되었습니다` |
| `ajax.php` | 240 | `[삼화페인트]고객 상담 신청이 있습니다` |
| `ajax.php` | 350 | `[삼화페인트] 컬러북/색상 견본 접수가 있습니다` |
| `ajax.php` | 399 | `[삼화페인트]WEB 교육 신청이 있습니다` |
| `ajax.php` | 445 | `[삼화페인트]분석 의뢰가 등록되었습니다` |

### 2.2.5 이메일 템플릿 본문

고객에게 발송되는 이메일 본문에도 회사명이 포함되어 있습니다.

**파일 위치:** `twigs/mail/`

| 파일 | 내용 |
|------|------|
| `request.twig` | "삼화페인트공업(주)" |
| `apt-request.twig` | 동일 |
| `edu-request.twig` | 동일 |
| `ir-success.twig` | 동일 |
| `customer-request.twig` | 동일 |

### 2.2.6 개인정보처리방침

법적 문서인 개인정보처리방침에도 회사명이 포함되어 있습니다.

**확인 URL:** https://samhwa.com/privacy

**파일 위치:** `twigs/templates/extra/privacy.twig`

| 내용 |
|------|
| "'삼화페인트공업㈜' (이하 '회사'라 한다)는 개인정보 보호법..." |

> **주의:** 법적 문서이므로 법무팀 검토 후 변경 필요

### 2.2.7 홈페이지 메인

홈페이지 메인에도 회사명 관련 텍스트가 있습니다.

**확인 URL:** https://samhwa.com

**파일 위치:** `twigs/home.twig`

| 라인 | 내용 |
|------|------|
| 337 | `#삼화페인트` (해시태그) |
| 342-351 | "삼화페인트 인스타그램/유튜브/블로그/스마트스토어" |
| 375 | "삼화페인트 000390" (주식 코드) |

---

## 2.3 CSS 내 로고 참조

**CSS란?** 웹사이트의 디자인(색상, 크기, 위치 등)을 정의하는 파일입니다. CSS 파일 내에서 로고 이미지 파일을 직접 참조하는 곳이 있어, 로고 파일명이 변경되면 이 부분도 수정이 필요합니다.

| 파일 | 라인 | 내용 |
|------|------|------|
| `sknk/src/css/common.css` | 1715, 1730, 1764-1769, 2162, 2455 | `logo-samhwa-*.svg` 참조 |
| `sknk/src/css/contents.css` | 8687, 10679 | `logo_search_01_samhwa.svg` 등 |
| `sknk/src/mobile/css/samhwa.css` | 전체 | 삼화 관련 커스텀 스타일 |

> **개발 참고:** 로고 파일명을 기존과 동일하게 유지하면(예: 새 로고도 `logo-samhwa-red.svg`로 저장) CSS 수정을 최소화할 수 있습니다.

---

## 2.4 데이터베이스 내 게시물 (전체)

웹사이트의 뉴스, 뉴스레터, 제품정보, 대리점스토리 등 모든 게시물은 **데이터베이스**에 저장되어 있습니다. 템플릿 파일을 수정하는 것만으로는 이 게시물들의 내용이 변경되지 않으며, 별도의 데이터베이스 작업이 필요합니다.

**주요 게시물 확인 URL:**
- 뉴스: https://samhwa.com/culture/news
- 뉴스레터: https://samhwa.com/paints/newsletter
- IR 공고: https://samhwa.com/ir/news
- #LIVE: https://samhwa.com/culture/live
- 대리점스토리: https://samhwa.com/customer/story
- 사보: https://samhwa.com/culture/magazine

### 2.4.1 게시물이란?

웹사이트의 콘텐츠는 크게 두 가지로 나뉩니다:

| 구분 | 설명 | 예시 |
|------|------|------|
| **템플릿 (고정 콘텐츠)** | 코드 파일에 직접 작성된 내용. 개발자가 파일을 수정해야 변경됨 | 푸터의 회사명, 회사소개 페이지 등 |
| **게시물 (동적 콘텐츠)** | 관리자 페이지에서 작성하여 데이터베이스에 저장된 내용. 관리자가 직접 수정 가능 | 뉴스 기사, 뉴스레터, 제품 설명 등 |

**게시물 내에 "삼화페인트"가 포함된 경우**, 해당 게시물을 하나씩 수정하거나, 데이터베이스에서 일괄 변경(Replace) 작업을 해야 합니다.

### 2.4.2 전체 게시물 유형 (총 37개 타입)

현재 웹사이트에서 관리되는 **모든 게시물 유형**입니다. 각 유형별로 "삼화페인트" 텍스트 포함 여부를 확인하고 변경해야 합니다.

#### 콘텐츠/뉴스 관련 (사명 포함 가능성 높음)

| 게시물 유형 | 설명 | URL 예시 |
|------------|------|----------|
| `news` | 뉴스/보도자료 | `/culture/news` |
| `newsletter` | 뉴스레터 콘텐츠 | `/paints/newsletter` |
| `announce` | IR 공고 | `/ir/news` |
| `live` | #LIVE 콘텐츠 (영상) | `/culture/live` |
| `story` | **대리점스토리** | `/customer/story` |
| `chemi` | 케미케미 | `/culture/chemi` |
| `withus` | 함께해요 | `/culture/withus` |
| `defect` | 결함예방백과 | `/product/defect` |
| `dictionary` | 도료 용어 사전 | `/product/dictionary` |
| `story-magazine` | 사보 | `/culture/magazine` |
| `contribution` | ESG 사회공헌 활동 | `/company/esg` |

#### 제품/컬러 관련

| 게시물 유형 | 설명 | URL 예시 |
|------------|------|----------|
| `products` | **제품 정보 (페인트솔루션 등)** | `/product/*` |
| `color` | 컬러(색상) 정보 | `/color/*` |
| `main_color` | 메인 페이지 Color Inspiration | 메인 페이지 |
| `brand-example` | 브랜드 시공 사례 | `/product/brand` |
| `construction_example` | 시공 사례 | `/color/painting-system` |
| `colortrend_post` | 컬러트렌드 포스트 | `/color/trendview` |
| `trendview_main` | 컬러트렌드 메인 | `/color/trendview` |

#### 고객 문의/신청 관련 (과거 접수 내역)

| 게시물 유형 | 설명 |
|------------|------|
| `counsel` | 고객 상담 문의 |
| `apt` | 아파트 도장 1:1 문의 |
| `waterproof_counsel` | 방수백과 상담 문의 |
| `colorbook` | 컬러북/색상 견본 접수 |
| `education` | WEB 교육 신청 |
| `analysis` | 분석 시험 의뢰 |
| `request_painting` | 재도장 상담 신청 |
| `request_product` | 제품 영업 상담 신청 |
| `newsletter_request` | 뉴스레터 신청 |
| `ir` | IR 미팅 신청 |

#### 방수백과 관련

| 게시물 유형 | 설명 |
|------------|------|
| `waterproof_faq` | 방수백과 FAQ |
| `waterproof_mov` | 방수백과 시공영상 |
| `waterproof_lineup` | 방수재 라인업 |

#### 회사/사업장 정보

| 게시물 유형 | 설명 |
|------------|------|
| `offices` | 사업장 정보 (본사, 공장, 비즈니스센터, 해외사업장) |
| `ir_room` | IR 미팅 일정 관리 |

#### UI/배너 관련

| 게시물 유형 | 설명 |
|------------|------|
| `slide` | 메인 슬라이드(배너) |
| `hot_issue` | 메인 페이지 Hot Issue |

#### 기타

| 게시물 유형 | 설명 |
|------------|------|
| `post` | 기본 포스트 (페인팅 가이드 등) |
| `download` | 제품 다운로드 이력 |

### 2.4.3 실제 게시물 수량 현황 (2026년 2월 기준)

아래는 실제 데이터베이스에서 조회한 게시물 수량입니다.

#### 한국어 사이트 (wp_posts) - 전체 게시물

| 게시물 유형 | 수량 | 설명 |
|------------|------|------|
| color | 3,503 | 컬러(색상) 정보 |
| counsel | 2,918 | 고객 상담 문의 |
| products | 408 | 제품 정보 |
| **news** | **387** | **뉴스/보도자료** |
| analysis | 238 | 분석 시험 의뢰 |
| download | 207 | 제품 다운로드 이력 |
| post | 176 | 기본 포스트 |
| **announce** | **113** | **IR 공고** |
| education | 97 | WEB 교육 신청 |
| ir_room | 78 | IR 미팅 일정 |
| page | 66 | 페이지 |
| **live** | **60** | **#LIVE 콘텐츠** |
| offices | 40 | 사업장 정보 |
| **newsletter** | **31** | **뉴스레터** |
| ir | 26 | IR 미팅 신청 |
| story-magazine | 25 | 사보 |
| apt | 15 | 아파트 도장 문의 |
| construction_example | 12 | 시공 사례 |
| **withus** | **10** | **함께해요** |
| **chemi** | **8** | **케미케미** |
| contribution | 7 | ESG 사회공헌 |
| **story** | **6** | **대리점스토리** |
| hot_issue | 6 | Hot Issue |
| trendview_main | 5 | 컬러트렌드 메인 |
| colortrend_post | 4 | 컬러트렌드 포스트 |
| slide | 4 | 메인 슬라이드 |
| brand-example | 3 | 브랜드 시공 사례 |
| newsletter_request | 3 | 뉴스레터 신청 |
| main_color | 1 | 메인 Color Inspiration |

**총 게시물 수: 약 8,700개** (발행된 게시물 기준)

#### 영문 사이트 (wp_2_posts) - 전체 게시물

| 게시물 유형 | 수량 | 설명 |
|------------|------|------|
| page | 42 | 페이지 |
| offices | 40 | 사업장 정보 |
| **live** | **36** | **#LIVE 콘텐츠** |
| dictionary | 24 | 도료 용어 사전 |
| products | 23 | 제품 정보 |
| counsel | 13 | 고객 상담 문의 |
| post | 13 | 기본 포스트 |
| **news** | **11** | **뉴스/보도자료** |
| **chemi** | **8** | **케미케미** |
| **story** | **6** | **대리점스토리** |
| hot_issue | 4 | Hot Issue |
| brand-example | 3 | 브랜드 시공 사례 |
| trendview_main | 2 | 컬러트렌드 메인 |
| defect | 1 | 결함예방백과 |
| slide | 1 | 메인 슬라이드 |
| main_color | 1 | 메인 Color Inspiration |

**총 게시물 수: 약 450개** (발행된 게시물 기준)

#### "삼화" 텍스트가 포함된 게시물 수량

**한국어 사이트** (제목 또는 본문에 "삼화" 포함):

| 게시물 유형 | 수량 | 우선순위 |
|------------|------|----------|
| **news** | **365** | **높음** |
| counsel | 134 | 낮음 (내부 데이터) |
| download | 55 | 낮음 |
| **announce** | **54** | **높음** |
| **live** | **50** | **높음** |
| post | 16 | 중간 |
| contribution | 7 | 중간 |
| **withus** | **6** | **높음** |
| chemi | 4 | 중간 |
| trendview_main | 3 | 중간 |
| story | 3 | 중간 |
| hot_issue | 2 | 낮음 |
| offices | 2 | 중간 |
| newsletter | 1 | 높음 |
| analysis | 1 | 낮음 |
| education | 1 | 낮음 |

**한국어 사이트 "삼화" 포함 게시물 총계: 약 705개**

**영문 사이트** (제목 또는 본문에 "samhwa" 포함):

| 게시물 유형 | 수량 | 우선순위 |
|------------|------|----------|
| **live** | **23** | **높음** |
| **news** | **11** | **높음** |
| post | 11 | 중간 |
| chemi | 8 | 중간 |
| offices | 8 | 중간 |
| story | 6 | 중간 |
| trendview_main | 2 | 낮음 |
| hot_issue | 2 | 낮음 |
| page | 1 | 중간 |

**영문 사이트 "samhwa" 포함 게시물 총계: 약 73개**

> **결론:** 한국어 사이트 약 705개 + 영문 사이트 약 73개 = **총 약 780개 게시물**에 사명 변경이 필요합니다.

### 2.4.4 게시물 내 "삼화" 사용 맥락

게시물 내에서 "삼화페인트"가 사용되는 주요 맥락:

| 사용 맥락 | 예시 |
|----------|------|
| 기사 제목 | "삼화페인트, 친환경 신제품 출시" |
| 기사 본문 | "삼화페인트공업(주)는 오늘..." |
| 인용문 | "삼화페인트 관계자는..." |
| 이미지 캡션 | "삼화페인트 안산공장 전경" |
| 제품 설명 | "삼화페인트의 프리미엄 라인..." |
| 대리점 소개 | "삼화페인트 공식 대리점..." |

### 2.4.5 게시물 수정 방법

게시물 내 사명 변경은 두 가지 방법으로 진행할 수 있습니다:

**방법 1: 관리자 페이지에서 수동 수정**
- WordPress 관리자 > 게시물 목록에서 하나씩 수정
- 장점: 문맥에 맞게 정확한 수정 가능
- 단점: 게시물 수가 많으면 시간이 오래 걸림 (수백~수천 개 예상)

**방법 2: 데이터베이스 일괄 변경 (SQL 쿼리)**
- 데이터베이스에서 "삼화페인트" → "신규사명" 일괄 치환
- 장점: 빠른 처리 (몇 분 내 완료)
- 단점: 문맥을 고려하지 않으므로 사전 검토 필요

```sql
-- 예시: 게시물 내용에서 사명 일괄 변경 (실제 실행 전 백업 필수)
UPDATE wp_posts 
SET post_content = REPLACE(post_content, '삼화페인트', '[신규사명]')
WHERE post_type IN ('news', 'newsletter', 'story', 'products', 'post', ...);

-- 게시물 제목도 변경
UPDATE wp_posts 
SET post_title = REPLACE(post_title, '삼화페인트', '[신규사명]')
WHERE post_type IN ('news', 'newsletter', 'story', 'products', 'post', ...);
```

### 2.4.6 일괄 변경 시 발생할 수 있는 문제점

데이터베이스 일괄 변경은 빠르지만, 다음과 같은 **위험 요소**가 있으므로 신중하게 진행해야 합니다.

#### 문제 1: 의도치 않은 텍스트 변경

| 문제 상황 | 예시 |
|----------|------|
| **해외법인명 변경** | "SAMHWA PAINTS INDIA" → "[신규사명] INDIA" (잘못된 변경) |
| **복합어 분리** | "삼화페인트공업" → "[신규사명]공업" (어색한 결과) |
| **고유명사 오변경** | "삼화빌딩" → "[신규]빌딩" (관련 없는 단어) |
| **URL 깨짐** | `samhwa.com/...` → `[신규].com/...` (링크 오류) |

> **대응:** 변경 전 검색으로 영향받는 게시물 목록을 먼저 확인하고, 예외 케이스를 정리한 후 진행

#### 문제 2: HTML/특수 포맷 손상

게시물 본문에는 HTML 코드가 포함되어 있습니다. 일괄 변경 시 HTML 구조가 깨질 수 있습니다.

```html
<!-- 원본 -->
<a href="https://samhwa.com">삼화페인트</a>

<!-- 잘못된 변경 (URL까지 변경됨) -->
<a href="https://[신규].com">[신규사명]</a>
```

> **대응:** `post_content`와 URL 필드를 분리하여 처리하거나, 정규식을 활용한 정밀한 쿼리 작성

#### 문제 3: 직렬화된 데이터 손상

WordPress는 일부 데이터를 **직렬화(serialize)** 형태로 저장합니다. 단순 REPLACE 쿼리로 직렬화된 데이터를 수정하면 데이터가 완전히 손상될 수 있습니다.

```
// 직렬화된 데이터 예시
a:2:{s:4:"name";s:12:"삼화페인트";s:3:"url";s:15:"samhwa.com";}
```

위 데이터에서 "삼화페인트"(12바이트)를 다른 길이의 문자열로 바꾸면 `s:12` 부분과 불일치하여 데이터가 깨집니다.

> **대응:** `wp_postmeta`, `wp_options` 테이블은 직렬화 데이터가 많으므로 별도 도구(WP-CLI, 플러그인) 사용 권장

#### 문제 4: 되돌리기 어려움

일괄 변경 후 문제가 발견되어도 원래 상태로 되돌리기 어렵습니다.

> **대응:** 
> - 변경 전 **전체 데이터베이스 백업** 필수
> - 스테이징 환경에서 먼저 테스트 후 프로덕션 적용

#### 문제 5: 캐시로 인한 미반영

데이터베이스를 변경해도 캐시된 페이지에는 이전 내용이 표시될 수 있습니다.

> **대응:** 변경 후 WordPress 캐시, CDN 캐시 전체 삭제

#### 문제 6: 검색 인덱스 불일치

WordPress 검색 기능이나 외부 검색 플러그인의 인덱스가 업데이트되지 않아 검색 결과가 불일치할 수 있습니다.

> **대응:** 변경 후 검색 인덱스 재생성 (Yoast SEO, ElasticSearch 등 사용 시)

### 2.4.7 권장 일괄 변경 절차

안전한 일괄 변경을 위한 권장 절차입니다:

```
1. 현황 파악
   └─ "삼화" 포함 게시물 수 확인 (SELECT COUNT 쿼리)
   └─ 변경 대상/제외 대상 분류

2. 백업
   └─ 전체 데이터베이스 백업
   └─ 백업 파일 복원 테스트

3. 스테이징 테스트
   └─ 스테이징 환경에 백업 복원
   └─ 일괄 변경 쿼리 실행
   └─ 결과 검증 (샘플 페이지 확인)

4. 프로덕션 적용
   └─ 점검 시간 공지
   └─ 일괄 변경 쿼리 실행
   └─ 캐시 전체 삭제
   └─ 검색 인덱스 재생성

5. 검증
   └─ 주요 페이지 수동 확인
   └─ 오류 발생 시 백업으로 복원
```

### 2.4.8 뉴스레터 관련 추가 수정 위치

뉴스레터 기능과 관련하여 템플릿에도 "삼화페인트"가 사용되고 있습니다:

**확인 URL:**
- 뉴스레터 구독 신청: https://samhwa.com/newsletter-request
- 뉴스 목록: https://samhwa.com/culture/news

| 파일 | 위치 | 현재 텍스트 |
|------|------|-------------|
| `twigs/templates/newsletter-request.twig` | 구독 신청 페이지 | "삼화페인트 뉴스레터를 구독하고 다양한 정보를 받아보세요" |
| `twigs/partial/newsletter-banner.twig` | 뉴스레터 배너 | "삼화페인트 뉴스레터를 구독하고..." |
| `twigs/archive-news.twig` | 뉴스 목록 페이지 | "삼화페인트의 소식을 가장 빠르게 전달해드립니다" |

### 2.4.9 뉴스레터 OG 이미지

뉴스레터 공유 시 표시되는 이미지 파일들도 교체가 필요할 수 있습니다:

| 파일 | 경로 | 용도 |
|------|------|------|
| newsletter_og.png | `sknk/src/images/common/` | 뉴스레터 SNS 공유용 |
| newsletter_og2.png | `sknk/src/images/common/` | 뉴스레터 SNS 공유용 (대체) |
| newletter_og250502.jpg | `sknk/src/images/common/` | 뉴스레터 SNS 공유용 |
| newsletter_main_image.png | `sknk/src/images/common/` | 뉴스레터 메인 이미지 |

> **확인 필요:** 위 이미지들에 "삼화페인트" 로고나 텍스트가 포함되어 있는지 확인 후 교체 여부 결정

---

## 2.5 MIS(기간계 시스템) 연동 점검

웹사이트는 MIS(PostgreSQL)와 연동하여 제품 정보, 기술자료, 대리점 정보 등을 실시간으로 조회합니다. 리브랜딩 시 MIS 연동 부분에 수정이 필요한지 점검했습니다.

**MIS 연동 페이지 URL:**
- 제품 목록: https://samhwa.com/product/paint-solution
- 기술자료(TDS): https://samhwa.com/product/reference/tech
- MSDS: https://samhwa.com/product/reference/msds
- 도장사양서: https://samhwa.com/product/reference/spec
- 인증서: https://samhwa.com/product/reference/cert
- 공인성적서: https://samhwa.com/product/reference/test
- 유해물질 요약서(HCS): https://samhwa.com/product/reference/hcs
- 대리점 찾기: https://samhwa.com/customer/findus

### 2.5.1 MIS 연동 아키텍처

| 구분 | 내용 |
|------|------|
| **연결 방식** | PostgreSQL 직접 연결 (SSH 터널 옵션) |
| **연동 클래스** | `/inc/migration/class-migration-db.php` |
| **환경별 연결** | 개발: `postgresql:5432` / 운영: SSH 터널 `192.168.222.134:5432` |

### 2.5.2 MIS 연동 기능 목록

#### 제품 소개 (제품 정보 조회)

| 연동 기능 | MIS 테이블 | 조회 데이터 |
|----------|-----------|-------------|
| 제품 마이그레이션(배치) | `mis_product_data_v`, `mis_product_data_eng_v` | product_code, product_name, mod_date |
| 제품 상세 (실시간) | `mis_tech_data_v` | 인증마크, paint_id, TDS 파일 경로 |
| 제품 설명/특징 | `mis_pntg_text_v` | 제품 상세 텍스트 |
| 제품 이미지 | `mis_can_image_v_mdata` | 캔 이미지 경로 |

#### 자료 검색 (TDS, MSDS 등)

| 연동 기능 | MIS 테이블 | 조회 데이터 |
|----------|-----------|-------------|
| 기술자료 (TDS) | `mis_tech_data_v`, `mis_tech_data_eng_v` | paint_id, product_code, server_path |
| 도장사양서 | `mis_pntg_spec_v`, `mis_pntg_spec_eng_v` | 사양서 파일 경로 |
| 인증서 | `mis_cert_v`, `mis_cert_eng_v` | cert_name, server_path, cert_org |
| 공인성적서 | `mis_cert_test_v` | 성적서 파일 경로 |
| MSDS | `mis_msds_data_lang_v` | path_ko, path_en |
| 유해화학물질 요약서 | `mis_msds_hcs_data_v` | HCS 파일 경로 |

#### 대리점 찾기

| 연동 기능 | MIS 테이블 | 조회 데이터 |
|----------|-----------|-------------|
| 대리점 목록 | `mis_sale_mst_v` JOIN `mis_sale_info_v` | sale_name, address, kakao_map_x/y |
| 대리점 상세 | `mis_sale_info_v` | mail, service_id, SNS 주소 |
| 대리점 사진 | `mis_sale_info_file_v` | file_api_url |
| 대리점 인증 | `mis_sale_mst_v` | sale_code, register |

#### 통합 검색

| 연동 기능 | MIS 테이블 | 조회 데이터 |
|----------|-----------|-------------|
| 대리점 검색 | `mis_sale_mst_v` | sale_name, address |

### 2.5.3 MIS 연동 점검 결과: ✅ 수정 불필요

**결론: MIS 연동 로직 자체는 수정이 필요 없습니다.**

| 점검 항목 | 결과 | 비고 |
|----------|------|------|
| MIS 테이블명/컬럼명 | ✅ 정상 | 회사명 포함되지 않음 (`mis_product_data_v` 등 기술적 명칭) |
| API 엔드포인트 | ✅ 정상 | 내부 DB 직접 연결 방식, URL에 회사명 없음 |
| 조회 조건 | ✅ 정상 | 회사명 기반 조건 없음 |
| 반환 데이터 필드 | ✅ 정상 | 제품명, 대리점명 등은 MIS에서 동적으로 가져옴 |

### 2.5.4 MIS 관련 수정 필요 항목 (마이그레이션 설정)

MIS 연동 로직은 수정 불필요하나, **마이그레이션 설정 파일**에 URL 치환 규칙이 있습니다.

**파일:** `/migration/swb_product.yml`

```yaml
# 기존 데이터 마이그레이션 시 URL 치환 규칙
search:
  - 'http://dev.samhwa.com/files/'
  - 'http://www.samhwa.com/files/'
  - 'https://www.samhwa.com/files/'
  - 'http://samhwa.com/files/'
  - '/APP/samhwa.com/data/files/'
replace: '/app/uploads/'
```

| 수정 필요 여부 | 조건 |
|--------------|------|
| **조건부** | 도메인이 변경되고 기존 데이터를 재마이그레이션할 경우에만 수정 필요 |
| **불필요** | 기존 데이터를 유지하고 신규 데이터만 추가하는 경우 |

### 2.5.5 MIS 데이터 내 사명 포함 여부

MIS에서 가져오는 데이터 중 "삼화" 텍스트가 포함될 수 있는 항목:

| 데이터 | 가능성 | 처리 방법 |
|--------|-------|----------|
| 제품명 (product_name) | 낮음 | MIS 측에서 변경 필요 |
| 대리점명 (sale_name) | 낮음 | MIS 측에서 변경 필요 |
| 인증서 발급기관 (cert_org) | 없음 | - |
| 파일 경로 (server_path) | 없음 | - |

> **참고:** MIS 데이터 내 사명이 포함된 경우, 웹사이트가 아닌 **MIS 시스템 측에서 변경**해야 합니다. 웹사이트는 MIS 데이터를 그대로 표시합니다.

### 2.5.6 MIS 연동 테스트 체크리스트

리브랜딩 후 MIS 연동이 정상 작동하는지 확인할 항목:

- [ ] 제품 목록 페이지 정상 표시
- [ ] 제품 상세 페이지 정상 표시 (TDS, MSDS, 인증서 다운로드)
- [ ] 기술자료 검색 정상 작동
- [ ] 대리점 찾기 지도 표시
- [ ] 대리점 상세 정보 팝업
- [ ] 통합 검색 결과 내 대리점 정보

---

[← Part 1. 개요](./01-overview.md) | [Part 3. 외부 연동 영향도 →](./03-external-services.md)
