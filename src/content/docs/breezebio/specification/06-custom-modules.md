---
title: 6. 커스텀 모듈
---

## 6.1 모듈 개요

BreezeBio 테마는 4개의 커스텀 포스트 타입(CPT) 모듈과 추가 기능 모듈을 포함합니다.

| 모듈 | 네임스페이스 | CPT | 역할 |
|------|-------------|-----|------|
| ContactUs | `Genedit\ContactUs` | `contact_us` | 문의 폼 처리 |
| TeamMember | `Genedit\TeamMember` | `team_member` | 팀 멤버 관리 |
| Legal | `Genedit\Legal` | `legal_document` | 법무 문서 |
| News | `Genedit\News` | - | 뉴스 REST API |
| LlmsTxt | `Genedit\LlmsTxt` | - | LLMs.txt 생성 |

---

## 6.2 ContactUs 모듈

### 구성 파일

```
src/ContactUs/
├── ContactUs.php           # 모듈 초기화
├── ContactUsPostType.php   # CPT 등록
├── ContactUsRestApi.php    # REST API 엔드포인트
├── ContactUsMailer.php     # 이메일 발송
└── ContactUsMetadata.php   # 메타데이터 정의
```

### CPT 정의

```php
// ContactUsPostType.php
class ContactUsPostType
{
    public const POST_TYPE = 'contact_us';
    
    public function register(): void
    {
        register_post_type(self::POST_TYPE, [
            'labels' => [
                'name' => 'Contact Us',
                'singular_name' => 'Contact',
            ],
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'supports' => ['title'],
            'menu_icon' => 'dashicons-email',
        ]);
    }
}
```

### REST API

**엔드포인트**: `POST /wp-json/genedit/v1/contact`

```php
// ContactUsRestApi.php
class ContactUsRestApi
{
    public function register(): void
    {
        register_rest_route('genedit/v1', '/contact', [
            'methods' => 'POST',
            'callback' => [$this, 'handleSubmit'],
            'permission_callback' => '__return_true',
        ]);
    }
    
    public function handleSubmit(WP_REST_Request $request): WP_REST_Response
    {
        // 1. 데이터 검증
        $data = $this->validateData($request);
        
        // 2. CPT로 저장
        $postId = $this->saveContact($data);
        
        // 3. 이메일 발송
        (new ContactUsMailer())->send($data);
        
        return new WP_REST_Response([
            'success' => true,
            'post_id' => $postId,
        ]);
    }
}
```

### 저장 필드

| 필드 | 메타 키 | 타입 |
|------|---------|------|
| First Name | `_first_name` | string |
| Last Name | `_last_name` | string |
| Email | `_email` | string |
| Phone | `_phone` | string |
| Company | `_company` | string |
| Job Title | `_job_title` | string |
| Inquiry Type | `_inquiry_type` | string |
| Message | `_message` | text |
| Country | `_country` | string |
| Source Page | `_source_page` | string |

---

## 6.3 TeamMember 모듈

### 구성 파일

```
src/TeamMember/
├── TeamMember.php           # 모듈 초기화
├── TeamMemberPostType.php   # CPT 등록
├── TeamMemberTaxonomy.php   # Team Group 택소노미
├── TeamMemberQuery.php      # 쿼리 헬퍼
├── TeamMemberCommand.php    # WP-CLI 명령어
└── TeamMemberMigration.php  # 데이터 마이그레이션
```

### CPT 정의

```php
// TeamMemberPostType.php
class TeamMemberPostType
{
    public const POST_TYPE = 'team_member';
    
    public function register(): void
    {
        register_post_type(self::POST_TYPE, [
            'labels' => [
                'name' => 'Team Members',
                'singular_name' => 'Team Member',
            ],
            'public' => true,
            'show_in_rest' => true,
            'supports' => ['title', 'thumbnail'],
            'menu_icon' => 'dashicons-groups',
            'has_archive' => false,
        ]);
    }
}
```

### 택소노미: Team Group

```php
// TeamMemberTaxonomy.php
class TeamMemberTaxonomy
{
    public const TAXONOMY = 'team_group';
    
    public function register(): void
    {
        register_taxonomy(self::TAXONOMY, TeamMemberPostType::POST_TYPE, [
            'labels' => [
                'name' => 'Team Groups',
                'singular_name' => 'Team Group',
            ],
            'public' => true,
            'hierarchical' => true,
            'show_in_rest' => true,
        ]);
    }
}
```

### 기본 그룹

| 슬러그 | 이름 | 프론트엔드 탭 |
|--------|------|--------------|
| `leadership` | Leadership | Leadership |
| `advisors` | Advisors | Advisors |
| `board` | Board | Board of Directors |

### 쿼리 헬퍼

```php
// TeamMemberQuery.php
class TeamMemberQuery
{
    public static function getTeamTabs(): array
    {
        $groups = get_terms([
            'taxonomy' => TeamMemberTaxonomy::TAXONOMY,
            'hide_empty' => true,
        ]);
        
        $tabs = [];
        foreach ($groups as $group) {
            $members = Timber::get_posts([
                'post_type' => TeamMemberPostType::POST_TYPE,
                'tax_query' => [
                    ['taxonomy' => TeamMemberTaxonomy::TAXONOMY, 'terms' => $group->term_id],
                ],
                'posts_per_page' => -1,
            ]);
            
            $tabs[] = [
                'id' => $group->slug,
                'label' => $group->name,
                'members' => $members,
            ];
        }
        
        return $tabs;
    }
}
```

### ACF 필드

| 필드 | 키 | 타입 |
|------|-----|------|
| Position | `position` | Text |
| Bio | `bio` | WYSIWYG |
| LinkedIn URL | `linkedin_url` | URL |
| Profile Image | `profile_image` | Image |

### WP-CLI 명령어

```bash
# 팀 멤버 목록
ddev wp genedit team list

# CSV에서 가져오기
ddev wp genedit team import /path/to/file.csv

# CSV로 내보내기
ddev wp genedit team export /path/to/output.csv
```

---

## 6.4 Legal 모듈

### 구성 파일

```
src/Legal/
├── LegalDocument.php          # 모듈 초기화
├── LegalDocumentPostType.php  # CPT 등록
├── LegalTypeTaxonomy.php      # Legal Type 택소노미
└── LegalDocumentQuery.php     # 쿼리 헬퍼
```

### CPT 정의

```php
// LegalDocumentPostType.php
class LegalDocumentPostType
{
    public const POST_TYPE = 'legal_document';
    
    public function register(): void
    {
        register_post_type(self::POST_TYPE, [
            'labels' => [
                'name' => 'Legal Documents',
                'singular_name' => 'Legal Document',
            ],
            'public' => true,
            'show_in_rest' => true,
            'supports' => ['title', 'editor'],
            'menu_icon' => 'dashicons-media-document',
            'has_archive' => false,
            'rewrite' => ['slug' => 'legal-document'],
        ]);
    }
}
```

### 택소노미: Legal Type

| 슬러그 | 이름 | URL |
|--------|------|-----|
| `terms` | Terms of Service | `/legal/terms` |
| `privacy` | Privacy Policy | `/legal/privacy` |
| `cookies` | Cookie Policy | `/legal/cookies` |

---

## 6.5 News 모듈

### REST API 확장

기본 WordPress Posts에 추가 REST 엔드포인트를 제공합니다.

```php
// NewsRestApi.php
class NewsRestApi
{
    public function register(): void
    {
        register_rest_route('genedit/v1', '/news', [
            'methods' => 'GET',
            'callback' => [$this, 'getNews'],
            'permission_callback' => '__return_true',
            'args' => [
                'count' => ['default' => 10],
                'category' => ['default' => ''],
                'lang' => ['default' => ''],
            ],
        ]);
    }
    
    public function getNews(WP_REST_Request $request): WP_REST_Response
    {
        $args = [
            'post_type' => 'post',
            'posts_per_page' => $request->get_param('count'),
            'post_status' => 'publish',
        ];
        
        // 카테고리 필터
        if ($category = $request->get_param('category')) {
            $args['category_name'] = $category;
        }
        
        // 다국어 필터 (Polylang)
        if ($lang = $request->get_param('lang')) {
            $args['lang'] = $lang;
        }
        
        $posts = Timber::get_posts($args);
        
        return new WP_REST_Response(
            array_map([$this, 'formatPost'], $posts)
        );
    }
}
```

### 응답 형식

```json
{
    "id": 123,
    "title": "News Title",
    "excerpt": "News excerpt...",
    "date": "2026-02-05",
    "category": "Press Releases",
    "thumbnail": "https://...",
    "url": "/news/news-title"
}
```

---

## 6.6 LlmsTxt 모듈

### 개요

LLMs.txt는 AI 언어 모델이 웹사이트 정보를 이해할 수 있도록 하는 표준 형식입니다.

### 엔드포인트

```
GET /llms.txt
```

### 생성 내용

```php
// LlmsTxtGenerator.php
class LlmsTxtGenerator
{
    public function register(): void
    {
        add_action('init', [$this, 'addRewriteRule']);
        add_filter('query_vars', [$this, 'addQueryVar']);
        add_action('template_redirect', [$this, 'handleRequest']);
    }
    
    public function generate(): string
    {
        $output = "# BreezeBio\n\n";
        $output .= "> Genetic Medicine Delivered\n\n";
        $output .= "## About\n";
        $output .= "BreezeBio develops innovative genetic medicines...\n\n";
        $output .= "## Pages\n";
        // 페이지 목록 생성
        
        return $output;
    }
}
```

---

## 6.7 모듈 초기화 흐름

```php
// GeneditSite.php
public function __construct()
{
    // 1. 블록 시스템
    (new BlockRegistrar())->init();
    
    // 2. CPT 모듈들
    (new ContactUs())->init();      // contact_us CPT + REST API
    (new TeamMember())->init();     // team_member CPT + CLI
    (new LegalDocument())->init();  // legal_document CPT
    
    // 3. 추가 기능
    (new NewsRestApi())->register();    // 뉴스 REST API
    (new LlmsTxtGenerator())->register(); // LLMs.txt
    
    parent::__construct();
}
```

---

[← 이전: 5. ACF 블록 명세](./05-blocks.md) | [다음: 7. 부록 →](./07-appendix.md)
