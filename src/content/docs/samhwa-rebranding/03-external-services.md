---
title: 외부 연동 서비스
description: GA4, GTM, 검색엔진, 지도 API 등 외부 서비스 영향도
---

# Part 3. GA4 및 외부 연동 영향도

웹사이트는 다양한 외부 서비스와 연동되어 있습니다. 이 섹션에서는 각 서비스가 무엇인지, 왜 중요한지, 도메인/사명 변경 시 어떤 조치가 필요한지 설명합니다.

**관련 페이지 URL:**
- 메인 페이지 (분석 스크립트 포함): https://samhwa.com
- 대리점 찾기 (카카오맵): https://samhwa.com/customer/findus
- 본사/사업장 안내 (구글맵): https://samhwa.com/company/headoffice
- 영문 사업장 안내: https://samhwa.com/en/company/offices

---

## 3.1 분석 도구

**분석 도구란?** 웹사이트 방문자 수, 어떤 페이지를 많이 보는지, 어디서 유입되는지 등을 측정하는 서비스입니다. 마케팅 전략 수립에 필수적인 데이터를 제공합니다.

| 서비스 | 설명 | 필요 조치 |
|--------|------|----------|
| **Google Tag Manager (GTM)** | 다양한 추적 코드를 관리하는 도구. 마케팅팀에서 직접 태그를 추가/수정할 수 있게 해줌 | 컨테이너 설정에서 도메인 업데이트 |
| **Google Analytics** | 방문자 통계 분석 도구. 일별 방문자 수, 인기 페이지 등 확인 | 속성 설정에서 도메인 변경, 기존 데이터는 유지됨 |
| **Hotjar** | 사용자 행동 분석 도구. 마우스 움직임, 클릭 위치 등을 히트맵으로 시각화 | 사이트 설정에서 도메인 업데이트 |
| **Naver Analytics** | 네이버에서 제공하는 방문자 분석 도구 | 신규 도메인으로 새로 등록 필요 |

### 현재 설정된 ID

| 서비스 | ID | 파일 위치 |
|--------|-----|------|
| Google Tag Manager | GTM-KPJ3VR3 | `base.twig:29` |
| Google Tag Manager | GTM-KRD65R42 | `base.twig:44` |
| Hotjar | 2365524 | `base.twig:16` |
| Naver Analytics | s_41a46d0ecc4b | `base.twig:117` |

---

## 3.2 검색엔진 인증

**검색엔진 인증이란?** 구글, 네이버 등의 검색엔진에 "이 웹사이트는 우리 회사가 운영하는 것이 맞습니다"라고 증명하는 것입니다. 이를 통해 검색 결과에서의 노출을 관리하고, 검색 성능 데이터를 확인할 수 있습니다.

| 서비스 | 인증 코드 | 파일 |
|--------|----------|------|
| Google Search Console | `0_3HdgY5CetMWZ9myJ5iR54LtGpPS3TzUVZLbcybg0g` | `base.twig:12` |
| Naver 웹마스터 (KR) | `fcbf61128438df9da66d5d7aa4a31879f94bc43d` | `base.twig:13` |
| Naver 웹마스터 (EN) | `cf40eef974bd60e8c3826163de992c1f205f334d` | `base.twig (EN)` |

### 필요 조치
- 신규 도메인으로 Search Console/웹마스터 도구에 새 사이트 등록
- 기존 도메인에서 신규 도메인으로 "주소 변경" 신청 (검색 순위 이전에 도움)

---

## 3.3 외부 API 연동

**API란?** 다른 서비스의 기능을 우리 웹사이트에서 사용할 수 있게 해주는 연결 통로입니다. 예를 들어, 대리점 찾기 페이지의 지도는 카카오맵 API를 통해 표시됩니다.

**확인 URL:**
- 카카오맵 (대리점 찾기): https://samhwa.com/customer/findus
- 구글맵 (본사 안내): https://samhwa.com/company/headoffice
- 구글맵 (비즈니스센터): https://samhwa.com/company/businesscenter
- 구글맵 (영문): https://samhwa.com/en/company/offices

| API | 용도 | 필요 조치 |
|-----|------|----------|
| **카카오맵** | 대리점 찾기 페이지의 지도 표시 | 카카오 개발자 콘솔에서 신규 도메인 등록 |
| **Google Maps** | 영문 사이트 및 일부 페이지의 지도 표시 | Google Cloud Console에서 도메인 화이트리스트 추가 |

> **중요:** API 키는 특정 도메인에서만 작동하도록 설정되어 있습니다. 신규 도메인을 등록하지 않으면 지도가 표시되지 않습니다.

---

## 3.4 SNS 연동

웹사이트 헤더, 푸터, 홈페이지 등에서 회사의 SNS 계정으로 연결되는 링크가 있습니다.

**확인 URL:** https://samhwa.com (헤더/푸터 영역)

| 플랫폼 | 현재 URL | 사용 위치 |
|--------|----------|----------|
| Instagram | https://instagram.com/samhwa_paint/ | header, footer, base.twig |
| YouTube | https://youtube.com/channel/UChCIzdQAmFFUkqghKWKFOPA | header, footer, base.twig |
| Naver Blog | https://blog.naver.com/samhwapaint_official | header, footer, base.twig |
| Naver 스마트스토어 | https://brand.naver.com/samhwapaint | header, footer, base.twig |
| 구매포털 | https://gume.samhwa.com | footer |

> **확인 필요:** SNS 계정명(samhwa_paint 등)도 변경되는지 확인 필요. 계정명이 변경되면 웹사이트의 모든 링크를 수정해야 합니다.

---

[← Part 2. 교체 대상 식별](./02-replacement-targets.md) | [Part 4. SEO 영향 분석 →](./04-seo-impact.md)
