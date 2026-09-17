---
title: 번역 검토·철회
sidebar:
  label: 관리자 · 검토·철회
---

# 번역 검토·철회

다큐멘탈리스트가 제출한 번역을 검토해 공개하거나, 잘못된 요청을 철회하는 방법입니다.

검토 대기(Needs review) 항목을 찾아 확인하고 Save as completed(수락)로 공개합니다.
요청 제출은 [번역 요청하기](./01-2-request), 담당자 배정은 [담당자에게 할당하기](./01-3-assign)를 먼저 완료하세요.

---

## 번역 검토 화면

번역담당자가 번역을 완료(번역자 화면의 **Save as completed**)하면 해당 항목의 상태가 **Needs review**(검토 대기)로 바뀌고, DB 총괄관리자가 검토합니다. 검토가 끝나야 번역이 콘텐츠에 반영되어 공개됩니다.

### 검토 화면 진입 경로

검토 대기 항목을 찾는 방법은 두 가지입니다.

**방법 1: Job overview에서 상태로 찾기 (권장)**

1. 사이드바 **Translation** 메뉴 → **Job Overview (작업)** 클릭 (`/admin/tmgmt/jobs`)
2. 상단 **상태** 필터에서 **Items - Needs review** 선택 후 **Filter** 클릭
3. 검토 대기 항목이 있는 Job을 클릭하면 상세 화면의 **Job items** 테이블이 열립니다
4. 상태가 **Needs review**인 항목을 클릭하면 검토 화면(`/admin/tmgmt/items/{item_id}`)으로 이동합니다

![Job Overview - Needs review 필터](../images/translation-jobs.png)

**방법 2: Job Items 목록에서 찾기**

1. 사이드바 **Translation** 메뉴 → **Job Items** 클릭 (`/admin/tmgmt/job_items`)
2. **State** 컬럼에서 **Needs review** 상태인 항목을 찾아 클릭합니다

:::tip[번역자 제출 알림 따라가기]
번역담당자가 Save as completed로 제출하면 Job에 "The translation for ... needs to be reviewed." 메시지와 검토 화면 링크가 등록됩니다. Job 상세 화면의 **Message** 영역에서 링크를 클릭해도 같은 검토 화면으로 이동합니다.
:::

![번역 검토 화면](../images/translation-review.png)

| 영역 | 설명 |
|------|------|
| **Source** | 원문 (원래 언어) |
| **Translation** | 번역문 |

### 검토 및 저장 옵션

| 버튼 | 설명 |
|------|------|
| **Save as completed** | **검토 완료(수락)**. 번역이 콘텐츠에 반영되고 공개됩니다. 검토 대기(Needs review) 화면에서만 표시됩니다 |
| **Save** | 검토 상태 유지하고 저장 (수정 필요시) |
| **Validate** | 번역 누락이 없는지 검사 |

Source와 Translation을 나란히 대조해서 확인하고, 필요하면 **Translation** 영역에서 직접 수정한 뒤 **Save as completed**를 누르세요. Save로만 저장하면 번역이 공개되지 않고 검토 대기 상태로 남습니다.

---

## 번역 요청 철회

이미 요청한 번역을 철회해야 하는 경우 (잘못 요청했거나 더 이상 번역이 필요 없는 경우) 다음 방법으로 처리합니다.

### 철회 방법

1. **Resources > Translation > Jobs** 로 이동 (`/admin/tmgmt/jobs`)
2. 철회할 번역 요청(Job)을 찾아 클릭
3. Job 상세 화면에서 **Abort job** 버튼 클릭
4. 확인 메시지에서 **Confirm** 클릭

:::caution[주의사항]
- **Abort**된 Job은 되돌릴 수 없습니다
- 번역담당자가 이미 작업 중인 경우, 해당 작업 내용이 삭제됩니다
- 필요한 경우 번역담당자에게 미리 알려주세요
:::

### Job 상태별 처리

| Job 상태 | 철회 가능 | 방법 |
|----------|----------|------|
| Unprocessed | O | Abort job |
| In progress | O | Abort job (작업 내용 삭제됨) |
| Finished | X | 이미 완료됨 (번역본 직접 삭제 필요) |

---

## 다음 단계

- [번역 요청하기](./01-2-request): 새 번역 요청
- [담당자에게 할당하기](./01-3-assign): 검토 대기가 생기기 전 단계 (할당 절차)
- [번역자용 번역 작업](./02-translator): 담당자 입장의 화면 안내
