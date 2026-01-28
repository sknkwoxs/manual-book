---
title: 5. API 명세
---


## 5.1 API 개요

dcamp 웹사이트는 JSON:API 표준을 사용하여 프론트엔드(dcamp.kr)와 데이터를 주고받습니다. JSON:API는 웹에서 데이터를 주고받는 표준 규격으로, 일관된 방식으로 데이터를 요청하고 응답받을 수 있습니다.

### API 통신 흐름

```
┌─────────────┐                              ┌─────────────┐
│             │   1. 데이터 요청 (HTTP)        │             │
│  dcamp.kr   │ ────────────────────────────► │ 관리 시스템  │
│ (프론트엔드) │                              │   (백엔드)   │
│             │   2. JSON 응답                │             │
│             │ ◄──────────────────────────── │             │
└─────────────┘                              └─────────────┘
```

### 기본 URL 구조

| 환경 | API 기본 주소 |
|------|--------------|
| 운영 | `https://admin.dcamp.kr/jsonapi` |
| 개발 | `https://dcamp-admin.sknkwoxs.com/jsonapi` |

---

## 5.2 인증 방식

API 접근에는 두 가지 방식이 있습니다.

### 공개 API (인증 불필요)

누구나 접근 가능한 데이터입니다. Drupal의 익명 사용자(anonymous) 권한에 따라 접근이 허용됩니다.

익명 사용자에게 부여된 권한:

| 권한 | 설명 | 접근 가능 API |
|------|------|--------------|
| access content | Node 콘텐츠 조회 | /jsonapi/node/* |
| view portfolio | Portfolio 조회 | /jsonapi/portfolio/* |
| view event | DcampEvent 조회 | /jsonapi/dcamp_event/* |
| view media | 미디어 파일 조회 | /jsonapi/media/* |
| access any webform configuration | 웹폼 양식 조회 | /webform/* |

공개 API 예시:
- 공지사항 목록
- 스타트업/파트너 목록 (공개 정보)
- 프로그램 목록

### 인증 필요 API

로그인한 사용자만 접근 가능한 데이터입니다. 추가로 본인 데이터만 접근 가능하도록 코드에서 제한합니다.

- 신청 내역 (apply) - 본인 신청만 조회 가능
- 회원 정보 수정 - 본인 정보만 수정 가능
- 신청서 제출 - 로그인 필수

인증 흐름:

```
[사용자]                [프론트엔드]              [관리 시스템]
   │                       │                         │
   │  1. 로그인 시도        │                         │
   │  (이메일/비밀번호)     │                         │
   │ ────────────────────► │                         │
   │                       │                         │
   │                       │  2. 토큰 요청            │
   │                       │  POST /oauth/token      │
   │                       │ ──────────────────────► │
   │                       │                         │
   │                       │  3. 토큰 발급            │
   │                       │  { access_token: "..." }│
   │                       │ ◄────────────────────── │
   │                       │                         │
   │  4. 로그인 완료        │                         │
   │ ◄──────────────────── │                         │
   │                       │                         │
   │  5. 데이터 요청        │                         │
   │  (마이페이지 등)       │                         │
   │ ────────────────────► │  6. 토큰과 함께 요청     │
   │                       │  Authorization: Bearer  │
   │                       │ ──────────────────────► │
   │                       │                         │
   │                       │  7. 데이터 응답         │
   │                       │ ◄────────────────────── │
   │  8. 화면 표시          │                         │
   │ ◄──────────────────── │                         │
```

---

## 5.3 주요 API 엔드포인트

### 콘텐츠 API

| 엔드포인트 | 메서드 | 설명 | 인증 |
|-----------|--------|------|------|
| `/jsonapi/node/notice` | GET | 공지사항 목록 | 불필요 |
| `/jsonapi/node/notice/{id}` | GET | 공지사항 상세 | 불필요 |
| `/jsonapi/node/insight` | GET | 인사이트 목록 | 불필요 |
| `/jsonapi/node/page` | GET | 페이지 정보 | 불필요 |

### 포트폴리오 API

| 엔드포인트 | 메서드 | 설명 | 인증 |
|-----------|--------|------|------|
| `/jsonapi/portfolio/startup` | GET | 스타트업 목록 | 불필요 |
| `/jsonapi/portfolio/startup/{id}` | GET | 스타트업 상세 | 불필요 |
| `/jsonapi/portfolio/partner` | GET | 파트너사 목록 | 불필요 |
| `/jsonapi/portfolio/campus` | GET | 캠퍼스 목록 | 불필요 |

### 프로그램 API

| 엔드포인트 | 메서드 | 설명 | 인증 |
|-----------|--------|------|------|
| `/jsonapi/dcamp_event/applicant` | GET | 참가 모집 프로그램 | 불필요 |
| `/jsonapi/dcamp_event/application` | GET | 심사형 프로그램 | 불필요 |
| `/jsonapi/dcamp_event/apply` | POST | 프로그램 신청 | 필요 |
| `/jsonapi/dcamp_event/apply` | GET | 내 신청 내역 | 필요 |

### 회원 API

| 엔드포인트 | 메서드 | 설명 | 인증 |
|-----------|--------|------|------|
| `/user/register` | POST | 회원 가입 | 불필요 |
| `/oauth/token` | POST | 로그인 (토큰 발급) | 불필요 |
| `/jsonapi/user/user/{id}` | GET | 내 정보 조회 | 필요 |
| `/jsonapi/user/user/{id}` | PATCH | 내 정보 수정 | 필요 |

### 신청서 API

| 엔드포인트 | 메서드 | 설명 | 인증 |
|-----------|--------|------|------|
| `/webform/{webform_id}` | GET | 양식 정보 조회 | 불필요 |
| `/webform/{webform_id}/submit` | POST | 신청서 제출 | 필요 |
| `/jsonapi/webform_submission` | GET | 내 제출 내역 | 필요 |

---

## 5.4 API 요청/응답 예시

### 스타트업 목록 조회

요청:
```
GET /jsonapi/portfolio/startup?page[limit]=10&sort=-created
```

응답:
```json
{
  "data": [
    {
      "type": "portfolio--startup",
      "id": "abc-123",
      "attributes": {
        "title": "테크스타트업",
        "field_short_description": "AI 기반 솔루션 기업",
        "field_founded_date": "2023-01-15",
        "created": "2024-03-20T10:30:00+09:00"
      },
      "relationships": {
        "field_logo": {
          "data": { "type": "file--file", "id": "file-456" }
        }
      }
    }
  ],
  "links": {
    "next": "/jsonapi/portfolio/startup?page[offset]=10"
  }
}
```

### 로그인 (토큰 발급)

요청:
```
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=password
&client_id=frontend
&username=user@example.com
&password=비밀번호
```

응답:
```json
{
  "token_type": "Bearer",
  "expires_in": 3600,
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "def50200..."
}
```

---

## 5.5 API 필터링 및 정렬

JSON:API는 표준화된 방식으로 데이터를 필터링하고 정렬할 수 있습니다.

### 필터링 예시

| 목적 | 쿼리 파라미터 |
|------|--------------|
| 특정 카테고리 | `?filter[field_category]=tech` |
| 공개된 항목만 | `?filter[status]=1` |
| 날짜 범위 | `?filter[created][condition][path]=created&filter[created][condition][operator]=>=&filter[created][condition][value]=2024-01-01` |

### 정렬 예시

| 목적 | 쿼리 파라미터 |
|------|--------------|
| 최신순 | `?sort=-created` |
| 이름순 | `?sort=title` |
| 복합 정렬 | `?sort=-sticky,-created` |

### 페이지네이션

| 목적 | 쿼리 파라미터 |
|------|--------------|
| 페이지당 10개 | `?page[limit]=10` |
| 2페이지 | `?page[limit]=10&page[offset]=10` |

---

## 5.6 커스텀 API

JSON:API 외에 특별한 기능을 위한 자체 API도 제공합니다.

| 엔드포인트 | 설명 |
|-----------|------|
| `/api/check-email` | 이메일 중복 확인 |
| `/api/verify-email` | 이메일 인증 처리 |
| `/api/social-login/{provider}` | 소셜 로그인 처리 |
| `/api/router` | 프론트엔드 라우팅 정보 |

---

[← 이전: 4. 데이터베이스 설계](./04-database.md) | [다음: 6. 커스텀 모듈 →](./06-modules.md)
