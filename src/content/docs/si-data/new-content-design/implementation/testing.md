---
title: 테스트 및 확인
---

# 테스트 및 확인

> [SI-DATA 문서](../../index/) / [SI-DATA 신규 콘텐츠 설계 문서](../SI-DATA_신규_콘텐츠_설계/) / [구현](./index/)

**작성일**: 2026-01-15  
**버전**: 1.0

---

## 개요

신규 콘텐츠 타입의 테스트 URL, 시나리오 및 유지보수 명령어에 대한 문서입니다.

---

## 테스트 URL

```
https://si-data.ddev.site/node/add/data_content
https://si-data.ddev.site/node/add/dxpr_content
https://si-data.ddev.site/node/add/report_content
https://si-data.ddev.site/node/add/html_content
https://si-data.ddev.site/node/add/survey_content
https://si-data.ddev.site/node/add/heritage_content
https://si-data.ddev.site/node/add/photo_content
```

---

## 테스트 시나리오

### ITEM 타입 선택 테스트

| 선택 | 결과 |
|------|------|
| "데이터로 본 서울" 선택 | ITEM명에 "데이터로 본 서울" 자동 선택됨 |
| "지도로 본 서울" 선택 | ITEM명에 2000, 2007, 2013 옵션 표시됨 |

### ITEM명 선택 테스트

- ITEM명 선택 후 → 카테고리 옵션이 필터링됨

### 폼 저장 테스트

- 필드 값 입력 후 저장 → 노드 생성 확인

---

## 테스트 노드

| 노드 ID | 콘텐츠 타입 | 제목 | URL |
|---------|-------------|------|-----|
| 65464 | data_content | 지도로 본 서울 콘텐츠 테스트 | https://si-data.ddev.site/node/65464 |

---

## 유지보수 명령어

```bash
# 캐시 삭제
ddev drush cr

# Config 확인
ddev drush cget field.field.node.data_content.field_item_type

# 택소노미 구조 확인
ddev drush sqlq "SELECT tid, name, (SELECT parent_target_id FROM taxonomy_term__parent WHERE entity_id=t.tid LIMIT 1) as parent FROM taxonomy_term_field_data t WHERE vid='item_service' ORDER BY parent, tid"
```

---

## 관련 문서

- [SI-DATA 신규 콘텐츠 설계 문서](../SI-DATA_신규_콘텐츠_설계/)

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0 | 2026-01-15 | 초기 문서 작성 |
