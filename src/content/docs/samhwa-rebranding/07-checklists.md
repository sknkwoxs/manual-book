---
title: 체크리스트
description: 배포 전/후 확인 체크리스트
---

# Part 7. 체크리스트

배포 전/후 확인해야 할 항목들입니다. 담당자가 하나씩 확인하며 체크합니다.

---

## 7.1 로고/이미지 교체 체크리스트

**확인 URL:**
- PC 헤더: https://samhwa.com
- 모바일 헤더: https://samhwa.com (모바일 뷰)
- 회사소개: https://samhwa.com/company/intro
- 컬러검색: https://samhwa.com/color/search
- 컬러파인더: https://samhwa.com/color/finder
- 대리점 찾기: https://samhwa.com/customer/findus

- [ ] PC 헤더 로고 (SVG, PNG)
- [ ] 모바일 헤더 로고
- [ ] 푸터 로고 (해당 시)
- [ ] Favicon (6개 파일)
- [ ] 회사소개 페이지 로고
- [ ] 컬러검색 로고
- [ ] OG Image (소셜 공유용 - 카카오톡 등에서 링크 공유 시 표시되는 이미지)
- [ ] 메일 템플릿 로고 (해당 시)
- [ ] **대리점 찾기 지도 마커 (marker_default.svg, marker_on.png - 한/영 4개)**

---

## 7.2 텍스트 변경 체크리스트

**확인 URL:**
- 푸터: https://samhwa.com (모든 페이지 하단)
- 회사소개: https://samhwa.com/company/intro
- 비전: https://samhwa.com/company/vision
- 개인정보처리방침: https://samhwa.com/privacy
- 뉴스레터 구독: https://samhwa.com/newsletter-request
- 뉴스 목록: https://samhwa.com/culture/news

- [ ] 푸터 회사명 (PC/모바일)
- [ ] Copyright 문구
- [ ] Schema.org 구조화 데이터
- [ ] 회사소개 페이지 본문
- [ ] 개인정보처리방침
- [ ] 메일 발송자명
- [ ] 메일 제목 접두어
- [ ] 메일 템플릿 본문
- [ ] 뉴스레터 구독 페이지 안내 문구
- [ ] 뉴스레터 배너 문구
- [ ] 뉴스 목록 페이지 안내 문구

---

## 7.3 데이터베이스 게시물 체크리스트

**확인 URL:**
- 뉴스: https://samhwa.com/culture/news
- 뉴스레터: https://samhwa.com/paints/newsletter
- IR 공고: https://samhwa.com/ir/news

- [ ] 뉴스(news) 게시물 내 사명 변경
- [ ] 뉴스레터(newsletter) 게시물 내 사명 변경
- [ ] IR 뉴스 게시물 내 사명 변경
- [ ] 공지사항 게시물 내 사명 변경
- [ ] 변경 전 데이터베이스 백업 완료
- [ ] 변경 후 게시물 표시 확인

---

## 7.4 외부 서비스 체크리스트

**확인 URL:**
- 카카오맵 (대리점): https://samhwa.com/customer/findus
- 구글맵 (본사): https://samhwa.com/company/headoffice
- SNS 링크: https://samhwa.com (헤더/푸터)

- [ ] Google Tag Manager 설정
- [ ] Google Analytics 설정
- [ ] Google Search Console 주소 변경
- [ ] Naver 웹마스터 도구
- [ ] Naver Analytics
- [ ] 카카오맵 API 도메인
- [ ] Google Maps API 도메인
- [ ] Hotjar 사이트 설정
- [ ] SNS 프로필 업데이트

---

## 7.5 배포 후 검증 체크리스트

**확인 URL:**
- 메인: https://[신규도메인]
- 회사소개: https://[신규도메인]/company/intro
- 뉴스: https://[신규도메인]/culture/news
- 대리점 찾기: https://[신규도메인]/customer/findus
- 영문: https://[신규도메인]/en/
- 사이트맵: https://[신규도메인]/sitemap.xml

- [ ] 전체 페이지 로고 노출 확인
- [ ] Favicon 브라우저 표시 확인
- [ ] 모바일 뷰 확인
- [ ] 검색엔진 색인 요청
- [ ] 301 리다이렉트 동작 확인
- [ ] GA/GTM 데이터 수집 확인
- [ ] 이메일 발송 테스트
- [ ] 지도 API 동작 확인

---

[← Part 6. 리스크 및 고려사항](./06-risks.md) | [Part 8. 테스트 시나리오 →](./08-test-scenarios.md)
