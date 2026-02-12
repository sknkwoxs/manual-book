---
title: 콘텐츠 구조 및 데이터 현황
description: 한국자원봉사아카이브 콘텐츠 구조, 데이터 모델 및 현황 분석
sidebar:
  order: 2
---

# 콘텐츠 구조 및 데이터 현황

## Omeka Classic 데이터 모델

Omeka Classic은 유연한 메타데이터 관리를 위해 EAV(Entity-Attribute-Value) 패턴을 사용합니다. 기본적인 데이터 구조는 다음과 같습니다.

```
Items (아이템)
  ├─ Item Type (아이템 타입)
  ├─ Collection (컬렉션) [1:N]
  ├─ Files (파일) [1:N]
  ├─ Element Texts (메타데이터) [1:N] — EAV 패턴
  └─ Tags (태그) [M:N]

Collections (컬렉션)
  ├─ Element Texts [1:N]
  └─ Items [1:N]

Exhibits (전시)
  ├─ Exhibit Pages (페이지) [1:N]
  └─ Exhibit Blocks (블록) [1:N]
      └─ Attachments (첨부) [1:N]
```

### 주요 DB 테이블

| 테이블 | 용도 | 주요 필드 |
|--------|------|----------|
| omeka_items | 아이템 기본 정보 | item_type_id, collection_id, public, featured |
| omeka_element_texts | 메타데이터 (EAV) | record_id, record_type, element_id, text |
| omeka_files | 파일 정보 | filename, mime_type, size |
| omeka_collections | 컬렉션 | flat 구조 (계층 없음) |
| omeka_tags | 태그 | M:N 관계 |
| omeka_exhibits | 전시 | slug, theme, public |
| omeka_exhibit_pages | 전시 페이지 | parent_id로 계층 구조 |
| omeka_search_texts | 전문 검색 인덱스 | MySQL FULLTEXT index |

**메타데이터 스키마:** Dublin Core 15개 기본 필드와 프로젝트별로 정의된 Item Type Metadata(커스텀 필드)를 결합하여 사용합니다.

---

## 사이트 메뉴-콘텐츠 매핑

사이트의 각 메뉴는 Omeka의 특정 기능 또는 검색 필터와 매핑되어 있습니다.

| 대메뉴 | 하위메뉴 | URL 패턴 | Omeka 기능 |
|--------|---------|---------|-----------|
| 검색 | - | /solr-search?q= | SolrSearch 플러그인 |
| 콘텐츠 | 스토리 | /items/story?...element_id=237&type=is+exactly&terms=스토리 | Items 고급검색 (element 237=목록구분) |
| | 칼럼 | /exhibits/column?sort_field=added&sort_dir=d&tags=column | Exhibits (tag 필터) |
| | 전시 | /exhibits/exhibit?sort_field=added&sort_dir=d&tags=exhibit | Exhibits (tag 필터) |
| 컬렉션 | 공동운영기관 | /collections/institution | Collections (커스텀 라우트) |
| | 기증 기록 | /collections/donation | Collections (커스텀 라우트) |
| 참여 | 기록 기증하기 | /contribution/contribute | Contribution 플러그인 |
| | 칼럼 보내기 | /contribution/submit | Contribution 플러그인 |
| 소개 | 아카이브 소개 | /about | SimplePages |
| | 새소식 | /notice | SimplePages |

**하단 정책 페이지:** `/terms` (이용약관), `/privacy` (개인정보처리방침), `/deny` (이메일무단수집거부), `/copyright` (저작권정책), `/convention` (기부협약서)

---

## Element ID 매핑 (확인된 커스텀 필드)

Omeka 시스템 내부에서 특정 기능을 수행하기 위해 지정된 커스텀 메타데이터 필드 ID입니다.

| Element ID | 필드명 | 용도 | 사용 위치 |
|-----------|--------|------|----------|
| 237 | 목록구분 | 스토리/칼럼 등 콘텐츠 유형 분류 | 콘텐츠 > 스토리 메뉴 URL |
| 244 | 주제 분류 | 봉사, 교육, 연구, 운영, 홍보 | 홈페이지 "주제로 보는 기록" 섹션, Solr facet |
| 245 | 키워드 | 아이템별 키워드 태그 | 아이템 상세 페이지, Solr facet |

---

## 컬렉션 현황 — 공동운영기관

전국 18개 공동운영기관별 데이터 현황입니다.

| 기관명 | 아이템 수 |
|--------|----------|
| 한국중앙자원봉사센터 | 6 |
| 서울특별시 | 32 |
| 부산광역시 | 21 |
| 대구광역시 | 30 |
| 인천광역시 | 39 |
| 광주광역시 | 18 |
| 대전광역시 | 38 |
| 울산광역시 | 51 |
| 세종특별자치시 | 22 |
| 경기도 | 26 |
| 강원특별자치도 | 27 |
| 충청북도 | 54 |
| 충청남도 | 28 |
| 전북특별자치도 | 60 |
| 전라남도 | 34 |
| 경상북도 | 41 |
| 경상남도 | 25 |
| 제주특별자치도 | 20 |
**합계: 공동운영기관 컬렉션 내 총 572개 아이템**

---

## 콘텐츠 규모 추정

*   **최신 아이템 ID:** 약 19,529 (ID가 순차적이지 않을 수 있으나 전체적인 데이터 규모를 짐작하게 함)
*   **신규 기록:** 홈페이지 "새로 들어온 기록" 섹션에 최신 30개 아이템 표시
*   **메인 배너:** 6개의 메인 슬라이더 운영
*   **주제 분류:** 5개 범주 (봉사, 교육, 연구, 운영, 홍보)
*   **테마별 기록:** 4개 "이럴 땐 이 기록" 카테고리

---

## 검색 시스템 (Solr)

시스템의 핵심 검색 엔진으로 Apache Solr가 사용됩니다.

*   **플러그인:** SolrSearch 플러그인을 통한 Omeka 데이터 동기화
*   **패싯 검색(Faceted Search):** 검색 결과 좌측에 카테고리별 필터 제공
*   **Facet 파라미터 패턴:**
    *   주제분류: `facet=244_s:"봉사"` (element 244)
    *   키워드: `facet=245_s:"키워드"` (element 245)
*   **검색 엔드포인트:** `/solr-search?q=검색어`

---

## 아이템 상세 페이지 구조

아이템 상세 페이지(예: `/items/show/19529`)의 구성 요소 분석 결과입니다.

*   **파일 뷰어:** PDF 등의 문서를 웹에서 바로 볼 수 있는 뷰어 내장 (iframe + PDF.js 활용)
*   **메타데이터 탭:** "기본정보"와 "상세정보"로 구분된 Dublin Core 필드 표시
*   **주요 표시 필드:** 목록구분, 생산자, 생산일자 등
*   **데이터 내보내기:** URL 뒤에 `?output=csv` 파라미터를 추가하여 메타데이터 다운로드 가능
*   **연동 기능:** 키워드 클릭 시 해당 키워드를 조건으로 하는 Solr facet 검색으로 연결
*   **안내 섹션:** "기록물 활용 안내"를 통해 저작권 및 이용 조건 명시

---

## 홈페이지 콘텐츠 구성

홈페이지 메인 화면은 다음과 같은 동적 콘텐츠로 구성되어 있습니다.

1.  **메인 슬라이더:** 6개의 주요 배너 (Swiper.js 사용). 주요 링크는 특정 아이템(`/items/show/18977`) 또는 전시 페이지(`/exhibits/show/column-01` 등)로 연결됩니다.
2.  **주제로 보는 기록:** 5개의 주제 아이콘이 각각 Solr facet 검색 결과 페이지와 연결됩니다.
3.  **이럴 땐 이 기록:** 4개의 테마별 카테고리 (exhibit-26~29 시리즈 전시와 매핑).
4.  **새로 들어온 기록:** 최신 등록된 30개의 아이템을 슬라이더 형태로 제공합니다.
