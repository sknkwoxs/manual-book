---
title: 어드민 시스템 현황
description: 한국자원봉사아카이브 관리자 시스템 현황 및 한계 분석
sidebar:
  order: 3
---

# 어드민 시스템 현황

## Omeka Classic 관리자 패널 개요

- **접근 URL**: `/admin` (표준 Omeka 관리자 URL)
- **탭 기반 네비게이션**: Items, Collections, Tags, Plugins, Appearance, Users, Settings
- **표준 MVC 컨트롤러 기반 CRUD Operations**
- **body class**: `admin-bar` 확인됨 — 로그인 시 프론트엔드에 관리자 바 표시

## 관리자 주요 기능

| 기능 | 설명 | 접근 경로 |
|------|------|----------|
| 아이템 관리 | 아이템 CRUD, 메타데이터 입력, 파일 업로드 | /admin/items |
| 컬렉션 관리 | 컬렉션 생성/편집 | /admin/collections |
| 전시 관리 | ExhibitBuilder로 전시 페이지 구성 | /admin/exhibits |
| 페이지 관리 | SimplePages로 정적 페이지 관리 | /admin/simple-pages |
| 사용자 관리 | 사용자 계정, 역할 관리 | /admin/users |
| 기여 관리 | Contribution 플러그인으로 기증/칼럼 제출 관리 | /admin/contribution |
| 검색 설정 | SolrSearch 설정, 인덱싱 관리 | /admin/solr-search |
| 플러그인 관리 | 설치된 플러그인 활성화/비활성화 | /admin/plugins |
| 테마 관리 | 테마 선택 및 설정 | /admin/appearance |
| 사이트 설정 | 사이트 제목, 설명, API 설정 등 | /admin/settings |

## 관리자 UI/UX 문제점

| 문제 | 상세 내용 | 심각도 |
|------|-----------|:------:|
| 비반응형 관리자 UI | 모바일/태블릿에서 관리 불가 | 🔴 |
| 구형 인터페이스 디자인 | 2012년 수준의 UI | 🟠 |
| 대량 작업 미지원 | Batch 편집/삭제 기본 미지원 (플러그인 필요) | 🟠 |
| 복잡한 메타데이터 입력 | Dublin Core 15개 필드 개별 입력 | 🟠 |
| 자동저장 없음 | 브라우저 종료 시 데이터 손실 가능 | 🟡 |
| 키보드 네비게이션 부족 | 접근성 미흡 | 🟡 |

## REST API 현황

- Omeka 2.1+ REST API 기본 탑재
- **Endpoints**: `/api/items`, `/api/collections`, `/api/files` 등
- **인증**: API key 기반
- **형식**: JSON (JSON-LD 아님)
- **현재 상태**: 비인증 접근 시 403 Forbidden 반환 확인됨

### API 제약사항

| 제약 | 설명 |
|------|------|
| 플러그인 데이터 노출 제한 | ExhibitBuilder 등 플러그인 데이터는 API로 접근 어려움 |
| WebHook 미지원 | 이벤트 기반 외부 시스템 연동 불가 |
| Rate Limiting 없음 | DoS 공격에 취약 |
| CORS 설정 복잡 | 프론트엔드 SPA 연동 시 추가 설정 필요 |
| 문서화 부족 | 공식 API 문서 최소한 수준 |

## 사용자 역할 및 권한

Omeka Classic 기본 역할:

| 역할 | 권한 |
|------|------|
| Super User | 모든 권한 (사이트 설정, 플러그인 관리 포함) |
| Admin | 콘텐츠 관리 전체 권한 |
| Contributor | 아이템 추가/수정 가능, 삭제 불가 |
| Researcher | 읽기 전용 접근 |


