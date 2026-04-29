---
title: 2.5. DB-ERD
---

# 2.5. DB-ERD

---

## 1. ERD 개요

SP100주년 뮤지엄 사이트는 WordPress Multisite의 blog_id=3으로 운영되며,  
WordPress 표준 테이블 구조를 그대로 사용합니다.

---

## 2. 전체 ERD (Mermaid)

### 2.1 Core Tables

```mermaid
erDiagram
    wp_users ||--o{ wp_3_posts : "post_author"
    wp_users ||--o{ wp_3_comments : "user_id"
    
    wp_3_posts ||--o{ wp_3_postmeta : "post_id"
    wp_3_posts ||--o{ wp_3_comments : "comment_post_ID"
    wp_3_posts ||--o| wp_3_posts : "post_parent"
    
    wp_3_comments ||--o{ wp_3_commentmeta : "comment_id"
    wp_3_comments ||--o| wp_3_comments : "comment_parent"

    wp_users {
        bigint ID PK
        varchar user_login
        varchar user_pass
        varchar user_email
        varchar display_name
    }

    wp_3_posts {
        bigint ID PK
        bigint post_author FK
        datetime post_date
        longtext post_content
        text post_title
        varchar post_status
        varchar post_name
        varchar post_type
        bigint post_parent FK
        int menu_order
    }

    wp_3_postmeta {
        bigint meta_id PK
        bigint post_id FK
        varchar meta_key
        longtext meta_value
    }

    wp_3_comments {
        bigint comment_ID PK
        bigint comment_post_ID FK
        tinytext comment_author
        varchar comment_author_email
        datetime comment_date
        text comment_content
        varchar comment_approved
        bigint comment_parent FK
        bigint user_id FK
    }

    wp_3_commentmeta {
        bigint meta_id PK
        bigint comment_id FK
        varchar meta_key
        longtext meta_value
    }
```

### 2.2 Taxonomy Tables

```mermaid
erDiagram
    wp_3_terms ||--|| wp_3_term_taxonomy : "term_id"
    wp_3_term_taxonomy ||--o{ wp_3_term_relationships : "term_taxonomy_id"
    wp_3_posts ||--o{ wp_3_term_relationships : "object_id"
    wp_3_terms ||--o{ wp_3_termmeta : "term_id"

    wp_3_terms {
        bigint term_id PK
        varchar name
        varchar slug
        bigint term_group
    }

    wp_3_term_taxonomy {
        bigint term_taxonomy_id PK
        bigint term_id FK
        varchar taxonomy
        text description
        bigint parent
        bigint count
    }

    wp_3_term_relationships {
        bigint object_id FK
        bigint term_taxonomy_id FK
        int term_order
    }

    wp_3_termmeta {
        bigint meta_id PK
        bigint term_id FK
        varchar meta_key
        longtext meta_value
    }
```

### 2.3 Multisite Shared Tables

```mermaid
erDiagram
    wp_site ||--o{ wp_blogs : "site_id"
    wp_site ||--o{ wp_sitemeta : "site_id"
    wp_users ||--o{ wp_usermeta : "user_id"

    wp_site {
        bigint id PK
        varchar domain
        varchar path
    }

    wp_blogs {
        bigint blog_id PK
        bigint site_id FK
        varchar domain
        varchar path
        datetime registered
        tinyint public
    }

    wp_sitemeta {
        bigint meta_id PK
        bigint site_id FK
        varchar meta_key
        longtext meta_value
    }

    wp_usermeta {
        bigint umeta_id PK
        bigint user_id FK
        varchar meta_key
        longtext meta_value
    }

    wp_3_options {
        bigint option_id PK
        varchar option_name UK
        longtext option_value
        varchar autoload
    }
```

### 2.4 Post Type ERD

#### Event CPT

```mermaid
erDiagram
    EVENT ||--o{ POSTMETA : "has"
    EVENT ||--o{ COMMENTS : "has"
    COMMENTS ||--o{ COMMENTMETA : "has"

    EVENT {
        bigint ID PK
        text post_title
        longtext post_content
        varchar post_status
        varchar post_type
    }

    POSTMETA {
        bigint meta_id PK
        bigint post_id FK
        varchar meta_key
        longtext meta_value
    }

    COMMENTS {
        bigint comment_ID PK
        bigint comment_post_ID FK
        text comment_content
        varchar comment_approved
    }

    COMMENTMETA {
        bigint meta_id PK
        bigint comment_id FK
    }
```

#### Winner CPT

```mermaid
erDiagram
    WINNER ||--o{ POSTMETA : "has"
    WINNER ||--o| ATTACHMENT : "thumbnail"

    WINNER {
        bigint ID PK
        text post_title
        longtext post_content
        varchar post_type
    }

    POSTMETA {
        bigint meta_id PK
        bigint post_id FK
        varchar meta_key
        longtext meta_value
    }

    ATTACHMENT {
        bigint ID PK
        varchar guid
        varchar post_mime_type
    }
```

---

## 3. 핵심 관계 설명

### 3.1 Posts - Postmeta (1:N)

```mermaid
flowchart LR
    A["wp_3_posts.ID"] -->|1:N| B["wp_3_postmeta.post_id"]
```

- 하나의 포스트는 여러 메타데이터를 가짐
- ACF 필드 값은 postmeta에 저장됨

### 3.2 Posts - Comments (1:N)

```mermaid
flowchart LR
    A["wp_3_posts.ID"] -->|1:N| B["wp_3_comments.comment_post_ID"]
```

- 이벤트(event) 포스트에 댓글 연결
- 뮤지엄 사이트에서 댓글은 이벤트에만 사용

### 3.3 Comments - Commentmeta (1:N)

```mermaid
flowchart LR
    A["wp_3_comments.comment_ID"] -->|1:N| B["wp_3_commentmeta.comment_id"]
```

- 댓글 추가 정보 저장용

### 3.4 Posts (Self-reference)

```mermaid
flowchart LR
    A["wp_3_posts.ID"] -->|1:N| B["wp_3_posts.post_parent"]
```

- 페이지 계층 구조
- 첨부파일-부모 포스트 관계

### 3.5 Comments (Self-reference)

```mermaid
flowchart LR
    A["wp_3_comments.comment_ID"] -->|1:N| B["wp_3_comments.comment_parent"]
```

- 대댓글 구조

---

## 4. 테이블별 관계 요약

| 테이블 | PK | FK | 관계 대상 |
|--------|----|----|-----------|
| wp_3_posts | ID | post_author | wp_users |
| wp_3_posts | ID | post_parent | wp_3_posts (self) |
| wp_3_postmeta | meta_id | post_id | wp_3_posts |
| wp_3_comments | comment_ID | comment_post_ID | wp_3_posts |
| wp_3_comments | comment_ID | user_id | wp_users |
| wp_3_comments | comment_ID | comment_parent | wp_3_comments (self) |
| wp_3_commentmeta | meta_id | comment_id | wp_3_comments |
| wp_3_terms | term_id | - | - |
| wp_3_term_taxonomy | term_taxonomy_id | term_id | wp_3_terms |
| wp_3_term_relationships | - | object_id | wp_3_posts |
| wp_3_term_relationships | - | term_taxonomy_id | wp_3_term_taxonomy |
| wp_3_termmeta | meta_id | term_id | wp_3_terms |
| wp_3_options | option_id | - | - |

---

## 5. Post Type별 ERD

### 5.1 Page

```mermaid
erDiagram
    PAGE ||--o{ POSTMETA : "has"
    PAGE ||--o| PAGE : "post_parent"

    PAGE {
        bigint ID PK
        text post_title
        longtext post_content
        varchar post_name
        varchar post_status
        int menu_order
        bigint post_parent FK
    }

    POSTMETA {
        bigint meta_id PK
        bigint post_id FK
        varchar meta_key
        longtext meta_value
    }
```

### 5.2 Event CPT

```mermaid
erDiagram
    EVENT ||--o{ POSTMETA : "has"
    EVENT ||--o{ COMMENTS : "has"

    EVENT {
        bigint ID PK
        text post_title
        longtext post_content
        varchar post_name
        varchar post_status
    }

    POSTMETA {
        bigint meta_id PK
        bigint post_id FK
        varchar meta_key
        longtext meta_value
    }

    COMMENTS {
        bigint comment_ID PK
        bigint comment_post_ID FK
        tinytext comment_author
        text comment_content
        datetime comment_date
        varchar comment_approved
    }
```

### 5.3 Winner CPT

```mermaid
erDiagram
    WINNER ||--o{ POSTMETA : "has"
    WINNER ||--o| ATTACHMENT : "thumbnail"

    WINNER {
        bigint ID PK
        text post_title
        longtext post_content
        varchar post_type
    }

    POSTMETA {
        bigint meta_id PK
        bigint post_id FK
        varchar meta_key
        longtext meta_value
    }

    ATTACHMENT {
        bigint ID PK
        varchar guid
        varchar post_mime_type
    }
```

### 5.4 Archive CPT

```mermaid
erDiagram
    ARCHIVE ||--o{ POSTMETA : "has"
    ARCHIVE ||--o| ATTACHMENT : "thumbnail"

    ARCHIVE {
        bigint ID PK
        text post_title
        longtext post_content
        varchar post_type
    }

    POSTMETA {
        bigint meta_id PK
        bigint post_id FK
        varchar meta_key
        longtext meta_value
    }

    ATTACHMENT {
        bigint ID PK
        varchar guid
        varchar post_mime_type
    }
```

---

## 6. 미디어 관계

```mermaid
erDiagram
    CONTENT ||--o| ATTACHMENT : "post_parent"
    CONTENT ||--o| ATTACHMENT : "thumbnail_id"

    CONTENT {
        bigint ID PK
        text post_title
        longtext post_content
    }

    ATTACHMENT {
        bigint ID PK
        bigint post_parent FK
        varchar guid
        varchar post_mime_type
    }

    POSTMETA {
        varchar meta_key
        longtext meta_value
    }
```

**관계 설명:**
- `post_parent`: 첨부파일이 어느 콘텐츠에 속하는지
- `_thumbnail_id`: 콘텐츠의 대표 이미지(특성 이미지) 참조

---

## 7. 참고사항

### 7.1 별도 테이블 없음

- 뮤지엄 사이트는 WordPress 표준 테이블만 사용
- Custom Table 생성 없음
- MIS 연동 없음 (별도 Postgres 연결 없음)

### 7.2 데이터 분리

- blog_id=3 데이터는 `wp_3_*` 테이블에만 저장
- 다른 사이트(blog_id=1,2)와 데이터 분리됨
- 사용자(`wp_users`)만 공유

### 7.3 ERD 도구 추천

시각적 ERD 생성 시 권장 도구:
- MySQL Workbench (Reverse Engineering)
- dbdiagram.io (웹 기반)
- draw.io (다이어그램)
