---
title: "SI-DATA 신규 콘텐츠 설계 문서"
---

> [SI-DATA 문서](../)

**작성일**: 2026-01-07  
**수정일**: 2026-01-15  
**버전**: 1.0

---

## 1. 개요

SI-DATA(서울연구데이터서비스)의 7개 신규 콘텐츠 타입은 **동일한 공통 필드 구조**를 공유합니다. 이 문서는 공통요소의 설계와 아이템 계층 구조 구현에 대해 설명합니다.

### 1.1 대상 콘텐츠 타입

| 콘텐츠 타입 | 머신명 | 용도 |
|------------|--------|------|
| 데이터 콘텐츠 | `data_content` | 데이터로 본 서울 콘텐츠 |
| DXPR 콘텐츠 | `dxpr_content` | DXPR 빌더 기반 콘텐츠 |
| 리포트 콘텐츠 | `report_content` | 인사이트 리포트 |
| HTML 콘텐츠 | `html_content` | HTML 기반 콘텐츠 |
| 조사 콘텐츠 | `survey_content` | 설문조사 데이터 |
| 근현대유산 콘텐츠 | `heritage_content` | 근현대 유산 데이터 |
| 사진 콘텐츠 | `photo_content` | 디지털 사진 콘텐츠 |

---

## 2. 공통 필드 구조

모든 신규 콘텐츠 타입은 4개의 필드 그룹으로 구성됩니다.

- **공통요소**: 모든 콘텐츠 타입에 동일하게 적용
- **개별요소/구조/관리**: 콘텐츠 타입별로 다르게 구성될 수 있음

### 2.1 공통요소 (group_common)

분류 및 메타데이터 관련 필드입니다. **모든 콘텐츠 타입에 동일하게 적용됩니다.**

| # | 필드명 | 머신명 | 타입 | 설명 |
|---|--------|--------|------|------|
| 1 | 제목 | `title` | String | 콘텐츠 제목 (기본 필드) |
| 2 | ITEM 타입 | `field_item_type` | Entity Reference (Taxonomy) | 상위 분류 선택 |
| 3 | ITEM명 | `field_service` | Entity Reference (Taxonomy) | 중간 분류 선택 |
| 4 | 주제분류 | `field_topic` | Entity Reference (Taxonomy) | 주제별 분류 (중복선택 가능) |
| 5 | 시기분류 | `field_decade` | Entity Reference (Taxonomy) | 시기별 분류 (중복선택 가능) |
| 6 | 챕터 | `field_chapter` | Entity Reference (Taxonomy) | 하위 분류 선택 |
| 7 | 핵심 키워드 | `field_keyword` | Text (plain) | 검색용 키워드 |
| 8 | 디스크립션 | `field_description` | Text (formatted, long) | 상세 설명 |
| 9 | 공공누리 | `field_ggnuri` | List (text) | 저작권 유형 |
| 10 | 종간콘텐츠 여부 | `field_legacy` | Boolean | 종간 콘텐츠 여부 |

### 2.2 콘텐츠 타입별 필드 구성

개별요소, 구조, 관리 필드는 콘텐츠 타입별로 다르게 구성될 수 있습니다.
각 콘텐츠 타입의 상세 필드 구성은 아래 문서를 참조하세요.

| 콘텐츠 타입 | 문서 |
|-------------|------|
| 데이터 콘텐츠 | [data_content 필드 구성](../content-types/data_content/) |
| DXPR 콘텐츠 | [dxpr_content 필드 구성](../content-types/dxpr_content/) |
| 리포트 콘텐츠 | [report_content 필드 구성](../content-types/report_content/) |
| HTML 콘텐츠 | [html_content 필드 구성](../content-types/html_content/) |
| 조사 콘텐츠 | [survey_content 필드 구성](../content-types/survey_content/) |
| 근현대유산 콘텐츠 | [heritage_content 필드 구성](../content-types/heritage_content/) |
| 사진 콘텐츠 | [photo_content 필드 구성](../content-types/photo_content/) |

---

## 3. 아이템 계층 구조

### 3.1 아이템 계층 구조 개요

콘텐츠 분류를 위한 AJAX 연동 드롭다운 구조입니다.

```
┌─────────────────────────────────────────────────────────────┐
│  ITEM 타입 (field_item_type)                                │
│  └─ ITEM 서비스 택소노미 (depth 0, 9개 term)               │
│     예: 데이터로 본 서울, 지도로 본 서울, 통계로 본 서울...    │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼ AJAX 연동
┌─────────────────────────────────────────────────────────────┐
│  ITEM명 (field_service)                                     │
│  └─ ITEM 서비스 택소노미 (depth 1, 21개 term)              │
│     예: 지도로 본 서울 2000, 지도로 본 서울 2007...          │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼ AJAX 연동
┌─────────────────────────────────────────────────────────────┐
│  챕터 (field_chapter)                                        │
│  └─ ITEM 카테고리 택소노미                                   │
│     예: 인구, 경제, 교통, 주거...                            │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 AJAX 연동 흐름

ITEM 타입 → ITEM명 → 챕터 순으로 AJAX 연동되어 옵션이 필터링됩니다.

> 상세 구현 내용은 [아이템 계층 구조 구현](../implementation/item-hierarchy/)을 참조하세요.

### 3.3 ITEM 서비스 택소노미 구조

```
ITEM 서비스 택소노미
├── 데이터로 본 서울 (TID: 342) ← ITEM 타입 (depth 0)
│   └── 데이터로 본 서울 (TID: 275) ← ITEM명 (depth 1)
│
├── 서울과 세계대도시 (TID: 343)
│   └── 서울과 세계대도시 (TID: 276)
│
├── 지도로 본 서울 (TID: 344)
│   ├── 지도로 본 서울 2000 (TID: 277)
│   ├── 지도로 본 서울 2007 (TID: 278)
│   └── 지도로 본 서울 2013 (TID: 279)
│
├── 지표로 본 서울 (TID: 345)
│   ├── 지표로 본 서울 2003 (TID: 280)
│   ├── 지표로 본 서울 2010 (TID: 281)
│   └── 지표로 본 서울 2015 (TID: 282)
│
├── 통계로 본 서울 (TID: 346)
│   ├── 통계로 본 서울 인구 (TID: 283)
│   ├── 통계로 본 서울 경제 (TID: 284)
│   ├── 통계로 본 서울 교통 (TID: 285)
│   ├── 통계로 본 서울 주거 (TID: 286)
│   └── Seoul Statistical Series (영문판) (TID: 287)
│
├── 서울도시기본계획 모니터링 (TID: 347)
│   ├── 서울도시기본계획 모니터링 2024 (TID: 288)
│   ├── 서울도시기본계획 모니터링 2023 (TID: 289)
│   ├── 서울도시기본계획 모니터링 2022 (TID: 290)
│   ├── 서울도시기본계획 모니터링 2021 (TID: 291)
│   └── 서울도시기본계획 모니터링 2015~2020 (TID: 292)
│
├── 조사데이터 (TID: 348)
│   └── 설문조사 (TID: 293)
│
├── 서울의 근현대유산 (TID: 349)
│   └── 서울의 근현대 유산 (TID: 294)
│
└── 디지털 사진 (TID: 350)
    └── 디지털 사진 (TID: 295)
```

### 3.4 ITEM 카테고리 택소노미 구조

각 ITEM명(depth 1)은 고유한 챕터 집합을 가집니다. ITEM명 선택 시 해당 ITEM명에 연결된 챕터만 `field_chapter`에 표시됩니다.

| ITEM 타입 | ITEM명 | 카테고리 문서 |
|-----------|--------|---------------|
| 데이터로 본 서울 | 데이터로 본 서울 | [카테고리 목록](../taxonomy/data-seoul/) |
| 서울과 세계대도시 | 서울과 세계대도시 | [카테고리 목록](../taxonomy/seoul-world-cities/) |
| 지도로 본 서울 | 2000, 2007, 2013 | [카테고리 목록](../taxonomy/map-seoul/) |
| 지표로 본 서울 | 2003, 2010, 2015 | [카테고리 목록](../taxonomy/indicators-seoul/) |
| 통계로 본 서울 | 인구, 경제, 교통, 주거, 영문판 | [카테고리 목록](../taxonomy/statistics-seoul/) |
| 서울도시기본계획 모니터링 | 2015~2024 | [카테고리 목록](../taxonomy/urban-plan-monitoring/) |
| 조사데이터 | 설문조사 | [카테고리 목록](../taxonomy/survey-data/) |
| 서울의 근현대유산 | 서울의 근현대 유산 | [카테고리 목록](../taxonomy/modern-heritage/) |
| 디지털 사진 | 디지털 사진 | [카테고리 목록](../taxonomy/digital-photo/) |

> 각 카테고리 택소노미는 현재 정의 중이며, 향후 완성될 예정입니다.

---

## 4. 분류체계 및 검색 패싯

콘텐츠 분류 및 검색 필터링에 사용되는 필드입니다.

| # | 분류명 | 필드명 | 타입 | 용어 목록 |
|---|--------|--------|------|-----------|
| 1 | 주제분류 | `field_topic` | Taxonomy (category_topic) | [용어 목록](../taxonomy/topic-classification/) |
| 2 | 시기분류 | `field_decade` | Taxonomy (category_decade) | [용어 목록](../taxonomy/period-classification/) |
| 3 | 공공누리 | `field_ggnuri` | List (text) | 제1~4유형 |
| 4 | 핵심키워드 | `field_keyword` | Text (plain) | 자유 입력 |

---

## 5. 필드 상세 설명

### 5.1 분류 필드 그룹

| 필드명 | 머신명 | 타입 | 설명 |
|--------|--------|------|------|
| ITEM 타입 | `field_item_type` | Entity Reference (Taxonomy) | 콘텐츠의 최상위 분류 선택 |
| ITEM명 | `field_service` | Entity Reference (Taxonomy) | 콘텐츠의 중간 분류 선택 |
| 주제분류 | `field_topic` | Entity Reference (Taxonomy) | 콘텐츠의 주제별 분류 (중복선택 가능) |
| 시기분류 | `field_decade` | Entity Reference (Taxonomy) | 콘텐츠의 시기별 분류 (중복선택 가능) |
| 챕터 | `field_chapter` | Entity Reference (Taxonomy) | 콘텐츠의 하위 분류 선택 |

### 5.2 메타데이터 필드 그룹

| 필드명 | 머신명 | 타입 | 설명 |
|--------|--------|------|------|
| 핵심 키워드 | `field_keyword` | Text (plain) | 검색을 위한 핵심 키워드 |
| 데이터 연도 | `field_data_year` | Text (plain) | 데이터의 기준 연도 |
| 발행일자 | `field_date` | Text (plain) | 콘텐츠 발행 일자 |
| 디스크립션 | `field_description` | Text (formatted, long) | 콘텐츠에 대한 상세 설명 |

### 5.3 미디어 필드 그룹

| 필드명 | 머신명 | 타입 | 설명 |
|--------|--------|------|------|
| 대표이미지 | `field_thumbnail` | Image | 콘텐츠의 썸네일 이미지 |
| 첨부파일 | `field_attached_file` | File | 다운로드 가능한 첨부 파일 |

### 5.4 콘텐츠 구성 필드 그룹

| 필드명 | 머신명 | 타입 | 설명 |
|--------|--------|------|------|
| 콘텐트 | `field_content` | Paragraphs | 동적 콘텐츠 구성을 위한 Paragraphs 필드 |
| 연관 콘텐츠 | `field_related_data` | Paragraphs | 관련 콘텐츠 연결을 위한 Paragraphs 필드 |

### 5.5 시스템 필드 그룹

| 필드명 | 머신명 | 타입 | 설명 |
|--------|--------|------|------|
| 공공누리 | `field_ggnuri` | List (text) | 저작권 유형 선택 |
| 검색제외 | `field_es` | Boolean | 검색 결과에서 제외할지 여부 |
| 종간콘텐츠 여부 | `field_legacy` | Boolean | 종간 콘텐츠 여부 (기본값: 체크 해제) |

---

## 6. 구현 및 설정

상세 구현 및 설정 문서입니다.

| # | 문서 | 설명 |
|---|------|------|
| 1 | [아이템 계층 구조 구현](../implementation/item-hierarchy/) | AJAX 연동 구현 |
| 2 | [View Display 설정](../implementation/view-display-settings/) | 표시/숨김 필드 설정 |
| 3 | [노드 템플릿 구현](../implementation/node-template/) | Twig 템플릿 구조 |
| 4 | [테마 디버깅](../implementation/theme-debugging/) | Twig 디버깅 설정 |
| 5 | [테스트 및 확인](../implementation/testing/) | 테스트 URL 및 시나리오 |

---

## 7. 폼 UI 개선사항

노드 편집 폼의 사용자 경험 개선을 위한 UI 구현입니다.

### 7.1 체크박스 그리드 레이아웃

주제분류, 시기분류 필드의 체크박스를 그리드 형태로 배치하여 공간을 효율적으로 사용합니다.

| 필드 | 레이아웃 | 설명 |
|------|----------|------|
| 주제분류 (`field_topic`) | 5열 그리드 | 18개 항목을 5열로 배치 |
| 시기분류 (`field_decade`) | 4열 그리드 | 4개 항목을 한 줄에 배치 |

**반응형 대응:**
- 태블릿 (992px 이하): 3열
- 모바일 (768px 이하): 2열
- 작은 모바일 (480px 이하): 1열

### 7.2 주제 설명 아코디언

주제분류 체크박스 아래에 각 주제에 대한 설명을 아코디언 형태로 제공합니다.

**UI 구조:**
```
주제분류
☐ 인구가구  ☐ 주택  ☐ 토지이용  ☐ 도시계획  ☐ 산업경제
☐ 기업경영  ☐ 교통  ☐ 사회      ☐ 복지      ☐ 보건
...
콘텐츠의 주제를 선택합니다. 복수 선택 가능합니다.

▶ 주제 설명 보기  ← 클릭 시 펼침
```

**펼쳤을 때:**
```
▼ 주제 설명 보기
┌────────────┬────────────────────────────────────────┐
│ 인구가구   │ 인구구조, 가구유형, 이동, 인구변동     │
│ 주택       │ 주택현황, 주거환경, 주거비, 임대...    │
│ ...        │ ...                                    │
└────────────┴────────────────────────────────────────┘
```

**구현 방식:**
- HTML5 `<details>` + `<summary>` 태그 사용 (JavaScript 불필요)
- 설명 데이터: `category_topic` 택소노미 term의 description 필드 활용

### 7.3 관련 파일

| 파일 | 설명 |
|------|------|
| `web/modules/custom/si_data/si_data.module` | `si_data_form_alter()` - 폼에 아코디언 마크업 삽입 |
| `web/modules/custom/si_data/si_data.module` | `si_data_build_topic_descriptions()` - 주제 설명 마크업 생성 |
| `web/modules/custom/si_data/css/si-data.css` | 체크박스 그리드, 아코디언 스타일 |
| `web/modules/custom/si_data/si_data.libraries.yml` | CSS 라이브러리 정의 |

---

## 8. 향후 고려사항

1. **ITEM 챕터 목록 추가**
   - 각 ITEM명별 챕터(field_chapter) 용어 정의 필요
   - 관련 문서: [taxonomy/](../taxonomy/) 디렉토리 내 ITEM 카테고리 문서

2. **분류 택소노미 용어 정리**
   - 주제분류(category_topic): 18개 용어 정의 완료
   - 관련 문서: [주제분류](../taxonomy/topic-classification/)

3. **기존 콘텐츠 마이그레이션**
   - 기존 콘텐츠 타입(`data_seoul` 등)의 데이터를 신규 콘텐츠 타입으로 마이그레이션

4. **브레드크럼 구현** (보류)
   - 목록 페이지 및 메뉴 변경 작업 시 함께 진행 예정
   - 구조: `ITEM 타입 > ITEM명 > 챕터`

5. **검색 연동**
   - Elasticsearch 검색에서 신규 콘텐츠 타입의 분류 체계 반영

6. **권한 설정**
   - 콘텐츠 타입별 생성/편집/삭제 권한 설정

---

## 9. 관련 문서

- [아이템 계층 구조 구현](../implementation/item-hierarchy/)

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0 | 2026-01-15 | 초기 문서 작성 |
| 1.1 | 2026-01-29 | 폼 UI 개선사항 섹션 추가 (체크박스 그리드, 주제 설명 아코디언) |
