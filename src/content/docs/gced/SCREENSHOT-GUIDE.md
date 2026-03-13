---
title: 스크린샷 촬영 가이드
---

# GCED Clearinghouse 매뉴얼 - 스크린샷 촬영 가이드

매뉴얼에 삽입할 스크린샷 촬영 가이드입니다.

## 촬영 환경

- **촬영 서버**: 스테이징 서버 (https://admin.gcedclearinghouse.org)
- **권장 브라우저**: Chrome
- **권장 해상도**: 1920 x 1080 (또는 1440px 너비 이상)
- **파일 형식**: PNG
- **저장 위치**: `src/content/docs/gced/images/`

## 촬영 목록

### 01-system-overview.md

| 파일명 | 촬영 화면 | 비고 |
|--------|----------|------|
| `cloudflare-access.png` | Cloudflare Access 이메일 입력 화면 | 시크릿 모드에서 접속 |
| `login.png` | Drupal 로그인 화면 | Gin 테마 로그인 |
| `dashboard.png` | 관리자 대시보드 | 로그인 후 첫 화면 |
| `language-switcher.png` | 언어 전환 UI | 상단 바 또는 사이드바 |

### 02-content-management.md

| 파일명 | 촬영 화면 | 비고 |
|--------|----------|------|
| `resource-list.png` | Resources 목록 | Board > Resources |
| `resource-edit.png` | Resource 편집 화면 | 주요 필드 보이게 |
| `events-list.png` | Events 목록 | Board > Events |
| `news-list.png` | News 목록 | Board > News |

### 03-workflow.md

| 파일명 | 촬영 화면 | 비고 |
|--------|----------|------|
| `workflow-draft.png` | Draft 목록 | Resources > Workflow > Draft |
| `workflow-picked.png` | Picked 목록 | Resources > Workflow > Picked |
| `workflow-staged.png` | Staged 목록 | Resources > Workflow > Staged |
| `workflow-published.png` | Published 목록 | Resources > Workflow > Published |
| `workflow-status.png` | 상태 변경 드롭다운 | 편집 화면 우측 사이드바 |

### 04-taxonomy.md

| 파일명 | 촬영 화면 | 비고 |
|--------|----------|------|
| `taxonomy-keywords.png` | Keywords 목록 | Resources > Taxonomy > Keywords |
| `taxonomy-creator.png` | Creator 목록 | Resources > Taxonomy > Creator |
| `taxonomy-add.png` | 용어 추가 화면 | Add term 폼 |

### 05-translation.md

| 파일명 | 촬영 화면 | 비고 |
|--------|----------|------|
| `translate-menu.png` | 번역 메뉴 접근 | Operations 드롭다운 |
| `translate-list.png` | 번역 언어 목록 | /node/{nid}/translations |
| `translate-request.png` | 번역 요청 화면 | Request translation 버튼 |
| `translate-review.png` | 번역 검토 화면 | Source/Translation 비교 |

### 06-user-roles.md

| 파일명 | 촬영 화면 | 비고 |
|--------|----------|------|
| `people-list.png` | People 목록 | /admin/people |
| `people-add.png` | 회원 추가 화면 | /admin/people/create |

### 07-site-admin.md

| 파일명 | 촬영 화면 | 비고 |
|--------|----------|------|
| `main-featured.png` | Featured Collection 설정 | Site Admin > Main & Popup |
| `main-popup.png` | 상단 팝업 설정 | Site Admin > Main & Popup |
| `statistics-content.png` | Content Statistics | Site Admin > Statistics |
| `statistics-view.png` | View Statistics | Site Admin > Statistics |
| `statistics-search.png` | Search Statistics | Site Admin > Statistics |
| `statistics-visit.png` | Visit Statistics | Site Admin > Statistics |

---

## 촬영 팁

1. **민감 정보 가리기**: 실제 이메일, 사용자명 등은 가리거나 테스트 데이터 사용
2. **일관된 크기**: 동일한 화면 크기/해상도로 촬영
3. **영역 강조**: 필요시 빨간 박스로 주요 영역 표시
4. **파일명 규칙**: 소문자, 하이픈(-) 사용, 확장자 .png

---

## 문서에 이미지 삽입 방법

현재 이미지 태그는 주석 처리되어 있습니다. 스크린샷 촬영 후 주석을 해제하세요:

```markdown
<!-- 주석 해제 전 -->
<!-- 
![관리자 대시보드](../images/01-dashboard.png)
-->

<!-- 주석 해제 후 -->
![관리자 대시보드](../images/01-dashboard.png)
```

---

*작성일: 2026년 2월*
