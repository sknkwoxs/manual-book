---
title: DCAMP-ADMIN 관리자 매뉴얼
---

# DCAMP-ADMIN 관리자 매뉴얼

디캠프(dcamp) 관리자 시스템 사용 매뉴얼입니다.

> **중요**: 일반 회원(`user.user`)과 관리자(`user.manager`) 계정은 완전히 분리되어 있습니다. 관리자 시스템(admin.dcamp.kr)에서는 관리자 계정만 관리합니다.

## 목차

### 기본 안내

1. [시스템 개요](./01-system-overview.md)
   - 디캠프 소개
   - 헤드리스 아키텍처
   - 회원 계정 완전 분리 정책
   - 다중 보안 레이어 구조
   - 접속 정보

2. [로그인 및 권한](./02-login-and-permissions.md)
   - 계정 체계 (일반 회원 vs 관리자)
   - 3단계 로그인 과정
   - 사용자 역할 (부서별 역할)
   - 역할별 권한 매트릭스
   - 보안 유의사항

### 관리 기능

3. [회원 관리](./03-member-management.md)
   - 관리자 회원 목록 조회
   - 새 관리자 계정 생성
   - 관리자 역할 변경
   - 퇴사자 계정 처리
   - 비밀번호 관리

4. [프로그램 관리](./04-program-management.md)
   - 프로그램별 접근 권한
   - 이벤트 생성 및 관리
   - 지원자 관리
   - 심사 시스템
   - 이메일 발송

5. [포트폴리오 관리](./05-portfolio-management.md)
   - 스타트업 관리
   - 파트너사 관리
   - 캠퍼스 관리
   - 이미지 가이드

6. [콘텐츠 관리](./06-content-management.md)
   - 공지사항 관리
   - 스토리 관리
   - 미디어 관리
   - 에디터 사용법 (CKEditor)

7. [사용자 화면 관리](./07-frontend-settings.md)
   - 메인화면 관리
   - 페이지 설정 (About, Program)
   - Featured Contents
   - 스타트업 페이지
   - 캐시 관리

8. [문의 관리](./08-contact-inquiry.md)
   - 문의 목록 조회
   - 문의 처리 및 응대
   - 문의 데이터 관리
   - 개인정보 보호

---

## 빠른 참조

### 접속 정보

| 환경 | 사용자 사이트 | 관리자 사이트 |
|------|-------------|--------------|
| **운영** | https://dcamp.kr | https://admin.dcamp.kr |
| **개발** | https://dcamp.sknkwoxs.com | https://dcamp-admin.sknkwoxs.com |

### 주요 관리 URL

| 기능 | 경로 |
|------|------|
| 관리자 대시보드 | `/admin` |
| 콘텐츠 관리 | `/admin/content` |
| 회원 관리 | `/admin/people` |
| 이벤트 관리 | `/admin/content/event` |
| 포트폴리오 관리 | `/admin/content/portfolio` |
| 메인화면 관리 | `/admin/dcamp/main` |
| 페이지 설정 | `/admin/dcamp/pages` |
| 문의 관리 | `/admin/structure/webform` |

### 부서별 역할

| 부서 | 역할 ID | 권한 수 |
|------|---------|---------|
| 기획실 | `planning` | 35개 |
| 투자실 | `investment` | 21개 |
| 글로벌사업실 | `global_business` | 23개 |
| 사업실 | `business` | 25개 |
| BizOps | `bizops` | 25개 |
| Growth | `growth` | 22개 |
| Resource | `resource` | 21개 |
| Space/경영본부 | `space` | 20개 |

> **참고**: 상세 권한 체계는 [로그인 및 권한](./02-login-and-permissions.md) 또는 [권한 관리 문서](../permissions/README.md)를 참고하세요.

---

## 문의 및 지원

시스템 관련 문의: **스컹크웍스스튜디오** (admin@skunkworks.co.kr)

---

*최종 업데이트: 2026년 1월*
