---
title: 5. ACF 블록 명세
---

## 5.1 블록 시스템 개요

BreezeBio 테마는 **ACF Pro**를 사용하여 19개의 커스텀 블록을 제공합니다. 각 블록은 Twig 템플릿과 Svelte 컴포넌트로 구성됩니다.

### 블록 자동 등록

`BlockRegistrar` 클래스가 `blocks/` 디렉토리의 모든 블록을 자동으로 등록합니다.

```php
// src/Blocks/BlockRegistrar.php
class BlockRegistrar
{
    public function init(): void
    {
        add_action('init', [$this, 'registerBlocks']);
    }
    
    public function registerBlocks(): void
    {
        $blocksDir = get_stylesheet_directory() . '/blocks';
        
        foreach (glob($blocksDir . '/*/block.json') as $blockJson) {
            register_block_type(dirname($blockJson));
        }
    }
}
```

---

## 5.2 블록 목록

| # | 블록 ID | 이름 | Svelte | 설명 |
|---|---------|------|--------|------|
| 1 | genedit-hero | Hero Section | ✓ | 메인 히어로 (전체 화면) |
| 2 | genedit-page-hero | Page Hero | ✓ | 서브페이지 히어로 |
| 3 | genedit-section-title | Section Title | ✓ | 섹션 제목 |
| 4 | genedit-feature-cards | Feature Cards | ✓ | 특징 카드 그리드 |
| 5 | genedit-image-text | Image Text | ✓ | 이미지+텍스트 레이아웃 |
| 6 | genedit-two-column-text | Two Column Text | ✓ | 2단 텍스트 |
| 7 | genedit-cta-banner | CTA Banner | ✓ | Call-to-Action 배너 |
| 8 | genedit-testimonials | Testimonials | ✓ | 인용/후기 슬라이더 |
| 9 | genedit-partners | Partners | ✓ | 파트너사 로고 |
| 10 | genedit-investors | Investors | ✓ | 투자사 로고 |
| 11 | genedit-team | Team | ✓ | 팀 멤버 (동적) |
| 12 | genedit-news | News | ✓ | 뉴스 목록 (동적) |
| 13 | genedit-careers | Careers | ✓ | 채용 정보 |
| 14 | genedit-qa | Q&A | ✓ | FAQ 아코디언 |
| 15 | genedit-content-accordion | Content Accordion | ✓ | 일반 아코디언 |
| 16 | genedit-pipeline-table | Pipeline Table | ✓ | 파이프라인 테이블 |
| 17 | genedit-program-section | Program Section | ✓ | 프로그램 섹션 |
| 18 | genedit-program-detail | Program Detail | ✓ | 프로그램 상세 |
| 19 | genedit-contact-info | Contact Info | ✓ | 연락처 정보 |

---

## 5.3 블록 파일 구조

### 표준 블록 구조

```
blocks/genedit-hero/
├── block.json           # 블록 메타데이터 + ACF 설정
├── render.twig          # Twig 렌더 템플릿
└── HeroSection.svelte   # Svelte 컴포넌트
```

### block.json 예시

```json
{
    "name": "genedit-hero",
    "title": "Hero Section",
    "description": "Full-screen hero section with background image",
    "category": "genedit",
    "icon": "cover-image",
    "keywords": ["hero", "banner", "header"],
    "acf": {
        "mode": "preview"
    },
    "supports": {
        "anchor": true,
        "align": ["full", "wide"],
        "alignWide": true
    },
    "attributes": {
        "align": {
            "type": "string",
            "default": "full"
        }
    }
}
```

### render.twig 예시

```twig
{# blocks/genedit-hero/render.twig #}
{% set block_id = block.id %}
{% set block_class = 'genedit-hero ' ~ (block.className ?? '') %}

<div id="{{ block_id }}" class="{{ block_class }}">
    <div data-svelte="genedit-hero"
         data-title="{{ fields.title|e('html_attr') }}"
         data-highlight="{{ fields.highlight_text|e('html_attr') }}"
         data-image="{{ fields.background_image.url|e('html_attr') }}">
        
        {# SEO 폴백 콘텐츠 #}
        <div class="seo-content">
            <h1>{{ fields.title }}</h1>
            {% if fields.highlight_text %}
                <span>{{ fields.highlight_text }}</span>
            {% endif %}
        </div>
    </div>
</div>
```

### Svelte 컴포넌트 예시

```svelte
<!-- blocks/genedit-hero/HeroSection.svelte -->
<script>
    let { title, highlight, image } = $props();
</script>

<section class="hero relative h-screen">
    <img src={image} alt="" class="absolute inset-0 object-cover" />
    
    <div class="relative z-10 flex items-center justify-center h-full">
        <div class="text-center text-white">
            {#if highlight}
                <span class="badge">{highlight}</span>
            {/if}
            <h1 class="text-6xl font-display">{title}</h1>
        </div>
    </div>
</section>
```

---

## 5.4 주요 블록 상세

### genedit-hero

메인 페이지 전체 화면 히어로.

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| title | Text | ✓ | 메인 제목 |
| highlight_text | Text | | 강조 뱃지 텍스트 |
| background_image | Image | ✓ | 배경 이미지 |
| background_video | File | | 배경 비디오 (선택) |

### genedit-team

팀 멤버를 동적으로 불러오는 블록.

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| description | WYSIWYG | | 섹션 설명 |

**특별 처리**: `GeneditSite::addTeamBlockContext()`에서 팀 멤버 데이터를 자동 주입합니다.

```php
public function addTeamBlockContext(array $context): array
{
    $context['team_tabs'] = TeamMemberQuery::getTeamTabs();
    return $context;
}
```

### genedit-news

최신 뉴스를 동적으로 불러오는 블록.

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| title | Text | | 섹션 제목 |
| count | Number | | 표시할 개수 (기본: 3) |
| category | Taxonomy | | 특정 카테고리 필터 |

---

## 5.5 ACF 필드 그룹

ACF 필드 정의는 `acf-json/` 디렉토리에 JSON으로 저장됩니다.

### 파일 위치

```
acf-json/
├── group_hero.json
├── group_team_member.json
├── group_contact_form.json
└── ...
```

### 동기화

- **저장**: 관리자에서 필드 그룹 저장 시 자동으로 JSON 파일 생성
- **로드**: 테마 활성화 시 JSON 파일에서 필드 그룹 로드

```php
// GeneditSite.php
public function acfJsonSavePath(): string
{
    return get_stylesheet_directory() . '/acf-json';
}

public function acfJsonLoadPaths(array $paths): array
{
    unset($paths[0]);
    $paths[] = get_stylesheet_directory() . '/acf-json';
    return $paths;
}
```

---

## 5.6 새 블록 생성

### CLI 도구

```bash
$ ddev npm run create:block
```

대화형으로 블록 이름을 입력하면 기본 구조가 생성됩니다.

### 수동 생성 절차

1. `blocks/genedit-{name}/` 디렉토리 생성
2. `block.json` 작성
3. `render.twig` 작성
4. `{Name}.svelte` 작성
5. ACF 필드 그룹 생성 (관리자에서)

---

## 5.7 SEO 패턴

모든 Svelte 블록은 `.seo-content` 클래스를 포함해야 합니다.

### 필수 패턴

```twig
<div data-svelte="component-name">
    {# Svelte 마운트 후 숨겨지는 SEO 콘텐츠 #}
    <div class="seo-content">
        <h2>{{ fields.title }}</h2>
        <p>{{ fields.content }}</p>
    </div>
</div>
```

### 작동 원리

1. **초기 로드**: Twig가 `.seo-content` 렌더링 (검색엔진 크롤링)
2. **JS 로드**: Svelte 마운트
3. **마운트 완료**: `.seo-content`에 `hidden` 클래스 추가

---

[← 이전: 4. 테마 구조](./04-theme-structure.md) | [다음: 6. 커스텀 모듈 →](./06-custom-modules.md)
