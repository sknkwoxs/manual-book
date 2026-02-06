---
title: 디자인 에셋 요청서
description: 디자인팀에 요청하는 로고 및 이미지 에셋 목록
---

# 디자인팀 에셋 요청서

**작성일:** 2026년 2월 6일 (금)  
**요청 부서:** 개발팀  
**요청 마감일:** 2026년 2월 14일 (금) - 스테이징 개발 시작 전  
**리브랜딩 배포일:** 2026년 3월 26일  

---

## 1. 요청 개요

3월 26일 예정된 사명 및 로고 전면 교체에 따라, 웹사이트에서 사용되는 **모든 로고 및 이미지 에셋**을 요청드립니다.

---

## 2. 필요 에셋 목록

### 2.1 메인 로고 (총 8개 파일)

웹사이트 헤더, 푸터 등에 사용되는 메인 로고입니다.

| 파일명 | 형식 | 크기/사양 | 용도 | 색상 |
|--------|------|----------|------|------|
| logo-red.svg | SVG | 벡터 | PC 헤더 로고 | 빨간색 (기본) |
| logo-red.png | PNG | 배경 투명, 최소 300px 너비 | Schema.org 데이터용 | 빨간색 |
| logo-white.svg | SVG | 벡터 | 흰색 배경용 로고 | 흰색 |
| logo-white.png | PNG | 배경 투명, 최소 300px 너비 | 흰색 배경용 PNG | 흰색 |
| logo-original.svg | SVG | 벡터 | 회사소개 페이지용 | 원본 컬러 |
| logo-mobile-red.png | PNG | 배경 투명, 모바일 최적화 | 모바일 헤더 | 빨간색 |
| logo-mobile-white.png | PNG | 배경 투명, 모바일 최적화 | 모바일 흰색 배경 | 흰색 |
| logo-colorfinder.svg | SVG | 벡터 | 컬러파인더 페이지 로고 | 흰색 |

**참고:** 현재 파일명은 `logo-samhwa-red.svg` 형태입니다. 가능하면 동일한 파일명 규칙 유지를 권장드립니다.

---

### 2.2 Favicon (총 3개 파일)

브라우저 탭, 북마크에 표시되는 작은 아이콘입니다.

| 파일명 | 형식 | 크기/사양 | 용도 |
|--------|------|----------|------|
| favicon.ico | ICO | 16x16, 32x32, 48x48 포함 | 브라우저 탭 아이콘 |
| favicon.png | PNG | 32x32, 배경 투명 | 일부 브라우저용 |
| apple-touch-icon.png | PNG | 180x180 | iOS 홈화면 아이콘 (선택) |

**ICO 파일 요구사항:**
- 멀티 해상도 지원 (16x16, 32x32, 48x48 모두 포함)
- 작은 크기에서도 식별 가능한 단순화된 디자인

---

### 2.3 대리점 찾기 지도 마커 (총 4개 파일)

**확인 페이지:** https://samhwa.com/customer/findus

대리점 찾기 페이지의 카카오맵에서 대리점 위치를 표시하는 마커입니다. 현재 빨간색 말풍선 안에 "SAMHWA" 로고가 들어있습니다.

| 파일명 | 형식 | 크기 | 용도 | 디자인 참고 |
|--------|------|------|------|------------|
| marker_default.svg | SVG | viewBox 58x74 | 기본 마커 | 빨간 말풍선 + 신규 로고 |
| marker_on.png | PNG | 112x112px | 선택된 마커 | 강조 효과 |
| marker_default_en.png | PNG | - | 영문 기본 마커 | 동일 디자인 |
| marker_on_en.png | PNG | 112x112px | 영문 선택 마커 | 동일 디자인 |

**현재 마커 이미지 위치:**
- `sknk/src/images/contents/customer/marker_default.svg`
- `sknk/src/images/contents/customer/marker_on.png`

**디자인 요구사항:**
- 빨간색 말풍선 형태 유지
- 말풍선 안에 신규 로고/심볼 배치
- 지도 위에서 잘 보이도록 대비 고려

---

### 2.4 뉴스레터/소셜 공유용 이미지 (총 4개 파일)

SNS에서 링크 공유 시 썸네일로 표시되는 이미지입니다.

| 파일명 | 형식 | 크기 | 용도 |
|--------|------|------|------|
| og-image.png | PNG | 1200x630px | 기본 OG 이미지 (카카오톡, 페이스북 등) |
| og-image-newsletter.png | PNG | 1200x630px | 뉴스레터 공유용 |
| og-image-en.png | PNG | 1200x630px | 영문 사이트용 |
| twitter-card.png | PNG | 1200x600px | 트위터 카드용 (선택) |

**디자인 요구사항:**
- 신규 로고 + 신규 사명 포함
- 브랜드 컬러 적용
- 작은 썸네일에서도 로고/사명 식별 가능

---

### 2.5 이메일 템플릿용 로고 (선택, 1개 파일)

고객 문의 접수 확인 메일 등에 사용됩니다.

| 파일명 | 형식 | 크기 | 용도 |
|--------|------|------|------|
| logo-email.png | PNG | 200px 너비, 배경 투명 | 이메일 본문 로고 |

---

## 3. 파일 전달 형식

### 권장 전달 방식

```
design-assets/
├── logo/
│   ├── logo-red.svg
│   ├── logo-red.png
│   ├── logo-white.svg
│   ├── logo-white.png
│   ├── logo-original.svg
│   ├── logo-mobile-red.png
│   ├── logo-mobile-white.png
│   └── logo-colorfinder.svg
├── favicon/
│   ├── favicon.ico
│   └── favicon.png
├── marker/
│   ├── marker_default.svg
│   ├── marker_on.png
│   ├── marker_default_en.png
│   └── marker_on_en.png
├── og-image/
│   ├── og-image.png
│   ├── og-image-newsletter.png
│   └── og-image-en.png
└── email/
    └── logo-email.png
```

---

## 4. 체크리스트

디자인팀에서 파일 전달 전 확인해주세요:

- [ ] SVG 파일: 불필요한 레이어/그룹 정리됨
- [ ] SVG 파일: 아웃라인 처리됨 (폰트 사용 시)
- [ ] PNG 파일: 배경 투명 처리됨
- [ ] PNG 파일: 적절한 해상도 (Retina 대응 2x 권장)
- [ ] ICO 파일: 멀티 해상도 포함됨
- [ ] 마커 이미지: 실제 지도 배경에서 테스트됨
- [ ] OG 이미지: SNS 미리보기에서 테스트됨

---

## 5. 일정

| 일정 | 내용 |
|------|------|
| **2/14 (금)** | 에셋 전달 완료 요청 |
| 2/17 (월) | 스테이징 개발 시작 |
| 3/10 (화) | 스테이징 테스트 시작 |
| 3/24-25 | 최종 검수 |
| **3/26 (목)** | 프로덕션 배포 |

> **참고:** 3/10 스테이징 테스트 전까지 에셋이 준비되어야 전체 일정에 차질이 없습니다.

---

## 6. 문의

에셋 사양 관련 문의사항은 스컹크웍스스튜디오 현승인 PM (nbf@skunkworks.co.kr)으로 연락 부탁드립니다.
