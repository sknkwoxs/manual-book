---
title: LLM 검색 최적화
---

## 1. 개요

BreezeBio는 AI 기반 검색 서비스(ChatGPT, Claude, Perplexity 등)에서 콘텐츠가 정확하게 인덱싱되도록 **LLM SEO 최적화**가 구현되어 있습니다.

### 구현 요소

| 요소 | 설명 | 파일 위치 |
|------|------|----------|
| **llms.txt** | LLM용 사이트 콘텐츠 마크다운 | `LlmsTxtGenerator.php` |
| **robots.txt** | AI 크롤러 허용 설정 | `web/robots.txt` |
| **Schema.org** | Organization JSON-LD | `base.twig` |
| **SEO 폴백** | Svelte 블록 서버사이드 HTML | `.seo-content` 패턴 |

---

## 2. llms.txt 구현

### LlmsTxtGenerator 클래스

**위치**: `web/app/themes/genedit/src/LlmsTxt/LlmsTxtGenerator.php`

```php
namespace Genedit\LlmsTxt;

class LlmsTxtGenerator
{
    public function register(): void
    {
        add_action('rest_api_init', [$this, 'registerRoutes']);
        add_action('init', [$this, 'addRewriteRules']);
        add_action('template_redirect', [$this, 'handleRewrite']);
    }
}
```

### 엔드포인트

| URL | 설명 | 캐시 |
|-----|------|------|
| `/llms.txt` | 요약 버전 | 1시간 |
| `/llms-full.txt` | 전체 콘텐츠 | 1시간 |
| `/wp-json/genedit/v1/llms.txt` | REST API (요약) | 1시간 |
| `/wp-json/genedit/v1/llms-full.txt` | REST API (전체) | 1시간 |

### Rewrite Rules

```php
public function addRewriteRules(): void
{
    add_rewrite_rule('^llms\.txt$', 'index.php?llms_txt=1', 'top');
    add_rewrite_rule('^llms-full\.txt$', 'index.php?llms_full_txt=1', 'top');
}
```

> **주의**: Rewrite rule 추가 후 `ddev wp rewrite flush` 필요

### 콘텐츠 생성

```php
public function generate(bool $full = false): string
{
    // 1. 사이트 정보
    $siteName = get_bloginfo('name');
    $siteDescription = get_bloginfo('description');
    
    // 2. 네비게이션 메뉴 (primary 메뉴)
    $menuItems = wp_get_nav_menu_items($menuLocations['primary']);
    
    // 3. 발행된 페이지
    $pages = get_posts(['post_type' => 'page', 'post_status' => 'publish']);
    
    // 4. 뉴스(포스트)
    $posts = get_posts(['post_type' => 'post', 'posts_per_page' => $full ? 50 : 20]);
    
    // 마크다운 형식으로 출력
}
```

### HTML → Markdown 변환

```php
private function getCleanContent(\WP_Post $post): string
{
    $content = $post->post_content;
    
    // Gutenberg 블록 코멘트 제거
    $content = preg_replace('/<!--.*?-->/s', '', $content);
    
    // 헤딩 변환
    $content = preg_replace('/<h1[^>]*>(.*?)<\/h1>/is', '# $1', $content);
    $content = preg_replace('/<h2[^>]*>(.*?)<\/h2>/is', '## $1', $content);
    
    // 리스트 변환
    $content = preg_replace('/<li[^>]*>(.*?)<\/li>/is', '- $1', $content);
    
    // 링크 변환
    $content = preg_replace('/<a[^>]*href=["\']([^"\']*)["\'][^>]*>(.*?)<\/a>/is', '[$2]($1)', $content);
    
    // 나머지 HTML 태그 제거
    $content = wp_strip_all_tags($content);
    
    return trim($content);
}
```

---

## 3. robots.txt

**위치**: `web/robots.txt`

### AI 크롤러 허용

```txt
# AI Crawlers - Allowed
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: YouBot
Allow: /
```

### LLMs-Txt 지시자

```txt
# LLM 표준
LLMs-Txt: https://breezebio.com/llms.txt
Sitemap: https://breezebio.com/sitemap.xml
```

### 주요 AI 크롤러 User-Agent

| 크롤러 | User-Agent | 서비스 |
|--------|-----------|--------|
| GPTBot | `GPTBot/1.0 (+https://openai.com/gptbot)` | OpenAI ChatGPT |
| ClaudeBot | `ClaudeBot/1.0` | Anthropic Claude |
| PerplexityBot | `PerplexityBot/1.0` | Perplexity AI |
| Amazonbot | `Amazonbot/0.1` | Amazon Alexa |

---

## 4. Schema.org JSON-LD

**위치**: `web/app/themes/genedit/templates/base.twig`

```twig
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "{{ site.name }}",
    "url": "{{ site.url }}",
    "description": "{{ site.description }}",
    "logo": "{{ theme_uri }}/static/images/logo.svg",
    "sameAs": [
        "https://www.linkedin.com/company/breezebio"
    ]
}
</script>
```

### 확장 가능한 스키마

필요시 추가 가능한 스키마:

```json
{
  "@type": "Organization",
  "founder": {
    "@type": "Person",
    "name": "..."
  },
  "foundingDate": "2023",
  "numberOfEmployees": {
    "@type": "QuantitativeValue",
    "value": 50
  }
}
```

---

## 5. Svelte 블록 SEO 패턴

### 문제

Svelte 컴포넌트는 CSR로 렌더링되어 검색엔진/AI 크롤러가 콘텐츠를 인덱싱할 수 없음.

### 해결책

서버사이드에서 `.seo-content` 영역에 시맨틱 HTML 제공:

```twig
{# blocks/genedit-hero/hero.twig #}
<div id="{{ block_id }}" class="{{ block_class }}">
    <div data-svelte="hero"
         data-title="{{ fields.title|e('html_attr') }}">
        
        {# SEO 폴백 - Svelte 마운트 후 숨김 #}
        <div class="seo-content">
            <h1>{{ fields.title }}</h1>
            <p>{{ fields.body|raw }}</p>
        </div>
    </div>
</div>
```

### Svelte에서 숨김 처리

```svelte
<script>
  import { onMount } from 'svelte';
  
  onMount(() => {
    // .seo-content 숨김
    const seoContent = document.querySelector('.seo-content');
    if (seoContent) {
      seoContent.style.display = 'none';
    }
  });
</script>
```

---

## 6. 테스트 및 검증

### llms.txt 테스트

```bash
# 요약 버전
$ curl https://breezebio.com/llms.txt

# 전체 버전
$ curl https://breezebio.com/llms-full.txt

# REST API
$ curl https://breezebio.com/wp-json/genedit/v1/llms.txt
```

### robots.txt 테스트

```bash
$ curl https://breezebio.com/robots.txt | grep -A2 "GPTBot"
```

### Schema.org 검증

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

### AI 크롤러 로그 확인

```bash
# 서버 로그에서 AI 크롤러 접근 확인
$ grep -E "GPTBot|ClaudeBot|PerplexityBot" /var/log/nginx/access.log
```

---

## 7. 캐시 관리

### llms.txt 캐시

```php
header('Cache-Control: public, max-age=3600'); // 1시간
```

### 캐시 무효화

llms.txt는 WordPress 콘텐츠 기반으로 동적 생성되므로:
1. 콘텐츠 변경 → 캐시 만료 후 자동 반영
2. 즉시 반영 필요 시 → 서버 캐시 삭제

```bash
# Nginx 캐시 삭제 (서버 설정에 따라 다름)
# 또는 Cloudflare 캐시 Purge
```

---

## 8. 향후 개선 사항

### 고려 가능한 기능

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| **다국어 llms.txt** | 언어별 `/ko/llms.txt` 제공 | 중 |
| **llms.txt 커스텀 섹션** | 제품, 파이프라인 정보 추가 | 중 |
| **Article 스키마** | 뉴스 포스트에 Article JSON-LD | 낮음 |
| **FAQ 스키마** | FAQ 페이지에 FAQPage JSON-LD | 낮음 |

### 참고 자료

- [llms.txt 표준](https://llmstxt.org/)
- [OpenAI GPTBot 문서](https://platform.openai.com/docs/gptbot)
- [Schema.org Organization](https://schema.org/Organization)
