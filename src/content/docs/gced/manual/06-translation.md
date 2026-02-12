---
title: 번역 관리
---

# 번역 관리

TMGMT(Translation Management Tool) 모듈을 통해 콘텐츠 번역을 관리합니다.

---

## 개요

클리어링하우스는 7개 언어를 지원하며, 두 가지 번역 방법을 제공합니다:

1. **직접 번역**: 수동으로 번역 콘텐츠 입력
2. **AI 번역**: DeepL을 통한 자동 번역 후 검토

### 지원 언어

English, Arabic, Chinese (Simplified), French, Russian, Spanish, Korean

### 번역 가능 콘텐츠

- Resources (Published 상태만)
- Events
- News
- Useful Links

:::note
Resources는 Published 상태에서만 번역이 가능합니다.
:::

---

## 번역담당자

번역담당자는 별도의 Drupal 역할이 아니라, **다큐멘탈리스트(Documentalist)** 역할을 가진 회원 중 번역 업무를 담당하는 사용자를 뜻합니다.

- People에서 회원 추가 시 **번역 가능 언어**를 설정하면 해당 언어의 번역 업무가 할당됩니다
- 번역 권한은 다큐멘탈리스트와 최고관리자만 보유합니다

### 역할별 번역 권한

| 역할 | 번역 요청 | 직접 번역 | 번역 검토 |
|------|:--------:|:--------:|:--------:|
| 최고관리자 (Administrator) | O | O | O |
| 다큐멘탈리스트 (Documentalist) | O | O | O |
| DB 총괄관리자 (General Supervisor) | - | - | - |
| 협력연구자 (Research Collaborator) | - | - | - |

---

## 번역 업무 흐름

| 단계 | 수행 역할 | 내용 |
|------|----------|------|
| ① 콘텐츠 게시 | 최고관리자 / DB 총괄관리자 | Published 상태의 콘텐츠 준비 |
| ② 번역 요청 | 최고관리자 / 번역담당자 | 번역 화면에서 AI 번역 요청 |
| ③ 할당 확인 | 번역담당자 | Manage Tasks에서 번역 할당 내역 확인 |
| ④ 번역 진행 | 번역담당자 | 번역 콘텐츠 검토, 수정 후 저장 |
| ⑤ 내역 확인 | 번역담당자 | Translation 관리 화면에서 상태 확인 |
| ⑥ 통계 확인 | 최고관리자 / 번역담당자 | 월별 번역량(byte) 확인 및 출력 |

---

## 번역 메뉴 접근

### 방법 1: 콘텐츠 목록에서 접근

1. 콘텐츠 목록 화면에서 번역할 콘텐츠 찾기
2. **Operations** 컬럼의 드롭다운 클릭
3. **Translate** 선택

### 방법 2: 콘텐츠 편집 화면에서 접근

1. 콘텐츠 편집 화면 진입
2. 상단 탭에서 **Translate** 클릭

<!-- 
![번역 메뉴 접근](../images/06-translate-menu.png)
-->

---

## 번역 화면 구성

번역 화면(`/node/{nid}/translations`)에서 각 언어별 번역 상태를 확인할 수 있습니다.

| 컬럼 | 설명 |
|------|------|
| **Language** | 언어명 |
| **Translation** | 번역 상태 (Original / Published / Not translated) |
| **Operations** | 작업 버튼 (View / Edit / Add) |

### 작업 버튼

| 버튼 | 설명 |
|------|------|
| **View** | 해당 언어 번역본 열람 |
| **Edit** | 기존 번역 수정 |
| **Add** | 새 번역 추가 (직접 번역) |
| **Request translation** | AI 번역 요청 |

---

## 직접 번역

이미 등록된 콘텐츠에 대해 직접 번역 작업을 수행합니다.

### 번역 진행 방법

1. 번역 화면에서 번역할 언어의 **Add** 버튼 클릭
2. 원래 언어(Original language)의 각 필드를 번역 언어로 변경
3. **Save** 버튼 클릭

### 번역 대상 필드

모든 필드가 번역 대상에 포함되지는 않습니다.

**번역 대상 필드:**
- Title (제목)
- Description (본문)
- 기타 텍스트 필드

**번역 미대상 필드:**
- Author
- Corporate Author
- DB URL
- Ebook URL
- File
- Keyword
- Region
- Resource Info (Format, File type)
- Resource URL
- Topic
- Translate Title
- Translator
- Year of publication

:::note
번역 대상 필드 변경이 필요한 경우 개발팀에 요청해주세요.
:::

---

## AI 번역 요청 (TMGMT + DeepL)

DeepL을 통해 자동 번역을 수행합니다.

### 번역 요청 방법

1. 번역 화면에서 번역할 언어 선택 (체크박스)
2. **Request translation** 버튼 클릭
3. DeepL이 자동으로 번역 수행

<!-- 
![번역 요청](../images/06-translate-request.png)
-->

### 번역 완료 후

1. 번역 완료 시 메시지 출력
2. 번역 초안 작성 후, **검토 필요 상태(Needs review)**로 전환
3. 해당 버튼을 클릭하여 번역 내역 열람

<!-- 
![번역 검토](../images/06-translate-review.png)
-->

### 번역 검토 화면

| 영역 | 설명 |
|------|------|
| **Source** | 원문 (원래 언어) |
| **Translation** | 번역문 (AI 번역 결과) |

### 저장 옵션

| 버튼 | 설명 |
|------|------|
| **Save** | 검토 상태 유지하고 저장 |
| **Save as completed** | 검토 완료 후 저장 및 공개 |

---

## 번역 할당 확인 (Manage Tasks)

| 항목 | 내용 |
|------|------|
| **위치** | Manage Tasks |
| **경로** | `/manage-translate` |
| **접근 권한** | 번역담당자 (Documentalist) |

번역담당자는 이 페이지에서 자신에게 할당된 번역 작업 목록을 확인합니다.

- 회원의 **번역 가능 언어** 설정에 따라 해당 언어의 번역 작업만 표시
- 할당된 번역 작업을 클릭하여 번역 진행 화면(`/translate/items/{tid}`)으로 이동

---

## 번역 관리 화면

### Jobs

| 항목 | 내용 |
|------|------|
| **위치** | Resources > Translation > Jobs |
| **경로** | `/admin/tmgmt/jobs` |

- 번역 요청 단위(Job)별 관리
- 하나의 Job에는 여러 Job Items가 포함될 수 있음
- 콘텐츠 확인 및 공개/비공개 설정 가능

### Job Items

| 항목 | 내용 |
|------|------|
| **위치** | Resources > Translation > Job Items |
| **경로** | `/admin/tmgmt/items` |

- 콘텐츠별 번역 요청 내역 확인
- **Review** 버튼으로 번역 진행 내역 열람

### Translation Sources

| 항목 | 내용 |
|------|------|
| **위치** | Resources > Translation > Translation Sources |
| **경로** | `/admin/tmgmt/sources` |

- 등록된 모든 콘텐츠의 언어별 번역 현황 확인
- 한 눈에 번역 상태 파악 가능

![Translation Sources](../images/06-translate-sources.png)

---

## 번역 통계

월별 번역량(byte)을 확인하고 출력할 수 있습니다.

| 항목 | 내용 |
|------|------|
| **접근 권한** | 최고관리자 (Administrator), 번역담당자 (Documentalist) |
| **기능** | 1달 동안 번역한 전체 내역(byte) 확인 및 출력 |

---

## 번역 워크플로우 요약

```mermaid
flowchart TD
    A[Published 콘텐츠] --> B{번역 방법 선택}
    B -->|직접 번역| C[Add 버튼 클릭]
    B -->|AI 번역| D[Request translation]
    C --> E[번역 입력]
    D --> F[DeepL 자동 번역]
    F --> G[Needs review 상태]
    G --> K[Manage Tasks에서 할당 확인]
    K --> H[번역 검토/수정]
    E --> I[Save]
    H --> I
    I --> J[번역 완료 · 공개]
```

---

## 다음 단계

- [웹사이트 관리](./07-site-admin) — 메인화면, 팝업, 통계 관리
