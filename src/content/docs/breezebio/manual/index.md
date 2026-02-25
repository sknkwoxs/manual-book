---
title: BreezeBio 관리자 매뉴얼
---

# BreezeBio 관리자 매뉴얼

BreezeBio 웹사이트 관리자 시스템 사용 매뉴얼입니다.

## 목차

### 기본 안내

1. [시스템 개요](./01-system-overview.md)
   - 웹사이트 소개
   - WordPress 관리자 접속
   - 관리자 화면 구성
   - 다국어 시스템 이해

2. [콘텐츠 관리](./02-content-management.md)
   - 페이지 편집
   - 블록 에디터 사용법
   - 미디어 관리
   - 발행 및 미리보기

### 블록 시스템

3. [ACF 블록 가이드](./03-block-guide.md)
   - 블록 추가 및 편집
   - Hero 블록
   - 콘텐츠 블록들
   - 블록별 필드 설명

### 운영 기능

4. [다국어 관리](./04-multilingual.md)
   - Polylang 사용법
   - 언어별 콘텐츠 연결
   - 번역 워크플로우

5. [문의 관리](./05-contact-inquiry.md)
   - 문의 목록 확인
   - 이메일 알림 설정
   - 문의 데이터 관리

6. [팀 멤버 관리](./06-team-management.md)
   - 팀 멤버 등록
   - 카테고리 관리 (Leadership, Advisors, Board)
   - 순서 변경

7. [법무 문서 관리](./07-legal-documents.md)
   - 이용약관 편집
   - 개인정보처리방침 편집
   - 쿠키 정책

8. [LLM 검색 최적화](./08-llm-search.md)
   - llms.txt 표준
   - AI 크롤러 허용 설정
   - 콘텐츠 작성 가이드

---

## 빠른 참조

### 접속 정보

| 환경 | 웹사이트 | 관리자 |
|------|----------|--------|
| **운영** | https://breezebio.com | https://breezebio.com/wp/wp-admin |
| **개발** | https://genedit.ddev.site | https://genedit.ddev.site/wp/wp-admin |

### 주요 관리 URL

| 기능 | 경로 |
|------|------|
| 관리자 대시보드 | `/wp/wp-admin` |
| 페이지 관리 | `/wp/wp-admin/edit.php?post_type=page` |
| 뉴스 관리 | `/wp/wp-admin/edit.php` |
| 팀 멤버 관리 | `/wp/wp-admin/edit.php?post_type=team_member` |
| 문의 관리 | `/wp/wp-admin/edit.php?post_type=contact_us` |
| 미디어 관리 | `/wp/wp-admin/upload.php` |

---

## 문의 및 지원

시스템 관련 문의: **스컹크웍스스튜디오** (admin@skunkworks.co.kr)

---

*최종 업데이트: 2026년 2월 25일*
