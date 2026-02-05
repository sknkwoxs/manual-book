---
title: 4. 테마 구조
---

## 4.1 테마 디렉토리 구조

```
web/app/themes/genedit/
├── acf-json/                  # ACF 필드 그룹 JSON
│   ├── group_xxx.json         # 각 필드 그룹
│   └── ...
├── blocks/                    # ACF 커스텀 블록
│   ├── genedit-hero/
│   │   ├── block.json         # 블록 메타데이터
│   │   ├── render.twig        # 템플릿
│   │   └── HeroSection.svelte # Svelte 컴포넌트
│   └── ...
├── dist/                      # Vite 빌드 출력 (Git 포함)
│   ├── assets/
│   │   ├── main-[hash].js
│   │   └── main-[hash].css
│   └── .vite/manifest.json
├── scripts/                   # 유틸리티 스크립트
│   ├── create-block.js        # 블록 생성 CLI
│   └── seed-editor-styles.php # 에디터 스타일 시드
├── src/                       # PHP 소스 (PSR-4)
│   ├── Blocks/                # 블록 관련 클래스
│   ├── ContactUs/             # 문의 CPT 모듈
│   ├── Legal/                 # 법무 문서 CPT 모듈
│   ├── LlmsTxt/               # LLMs.txt 생성기
│   ├── News/                  # 뉴스 REST API
│   ├── TeamMember/            # 팀 멤버 CPT 모듈
│   ├── components/            # Svelte 공통 컴포넌트
│   │   ├── navigation/
│   │   │   ├── Header.svelte
│   │   │   └── Footer.svelte
│   │   └── icons/
│   ├── GeneditSite.php        # 메인 테마 클래스
│   ├── Vite.php               # Vite 에셋 로더
│   ├── main.js                # JS 엔트리포인트
│   ├── styles.css             # CSS 엔트리포인트
│   └── editor-overrides.css   # 에디터 스타일
├── templates/                 # Twig 템플릿
│   ├── base.twig              # 기본 레이아웃
│   ├── front-page.twig        # 홈페이지
│   ├── page.twig              # 기본 페이지
│   ├── single.twig            # 개별 포스트
│   ├── archive.twig           # 아카이브
│   └── ...
├── functions.php              # 테마 초기화
├── index.php                  # 폴백
├── package.json               # npm 패키지
├── vite.config.js             # Vite 설정
└── style.css                  # 테마 메타데이터
```

---

## 4.2 핵심 파일 설명

### functions.php

테마 초기화 진입점입니다.

```php
<?php
declare(strict_types=1);

use Genedit\GeneditSite;
use Timber\Timber;

Timber::init();
new GeneditSite();
```

### GeneditSite.php

모든 테마 기능을 통합하는 메인 클래스입니다.

```php
class GeneditSite extends Site
{
    public function __construct()
    {
        // WordPress 훅 등록
        add_action('after_setup_theme', [$this, 'themeSupports']);
        add_action('init', [$this, 'registerNavMenus']);
        add_action('wp_enqueue_scripts', [$this, 'enqueueAssets']);
        add_filter('timber/context', [$this, 'addToContext']);
        add_filter('timber/twig', [$this, 'addToTwig']);
        
        // 모듈 초기화
        (new BlockRegistrar())->init();
        (new ContactUs())->init();
        (new TeamMember())->init();
        (new LegalDocument())->init();
        (new NewsRestApi())->register();
        
        parent::__construct();
    }
}
```

### Vite.php

Vite 빌드 에셋을 WordPress에 로드합니다.

```php
class Vite
{
    public function enqueueAssets(): void
    {
        if ($this->isDev()) {
            // 개발: Vite 서버에서 로드
            wp_enqueue_script('vite-client', 'http://localhost:5173/@vite/client');
            wp_enqueue_script('main', 'http://localhost:5173/src/main.js');
        } else {
            // 프로덕션: manifest.json 기반 로드
            $manifest = json_decode(file_get_contents($this->distPath('.vite/manifest.json')));
            wp_enqueue_script('main', $this->distUrl($manifest->{'src/main.js'}->file));
            wp_enqueue_style('main', $this->distUrl($manifest->{'src/styles.css'}->file));
        }
    }
}
```

---

## 4.3 Twig 템플릿 구조

### base.twig (기본 레이아웃)

```twig
<!DOCTYPE html>
<html {{ site.language_attributes }}>
<head>
    <meta charset="{{ site.charset }}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    {{ function('wp_head') }}
</head>
<body class="{{ body_class }}">
    
    {# 헤더 - Svelte 컴포넌트 #}
    <div data-svelte="header"
         data-menu='{{ menu_json }}'
         data-variant='{{ header_variant|default("dark") }}'>
        <div class="seo-content">
            {# SEO용 네비게이션 #}
        </div>
    </div>
    
    <main>
        {% block content %}{% endblock %}
    </main>
    
    {# 푸터 - Svelte 컴포넌트 #}
    <div data-svelte="footer">
        <div class="seo-content">
            {# SEO용 푸터 #}
        </div>
    </div>
    
    {{ function('wp_footer') }}
</body>
</html>
```

### page.twig (기본 페이지)

```twig
{% extends "base.twig" %}

{% block content %}
    <article class="page-content">
        {{ post.content }}
    </article>
{% endblock %}
```

---

## 4.4 Svelte 컴포넌트 구조

### main.js (엔트리포인트)

```javascript
import './styles.css';
import { registry } from './blocks/_registry.js';

// data-svelte 속성을 가진 요소에 Svelte 컴포넌트 마운트
document.querySelectorAll('[data-svelte]').forEach((el) => {
    const componentName = el.dataset.svelte;
    const Component = registry[componentName];
    
    if (Component) {
        // data-* 속성에서 props 추출
        const props = {};
        for (const [key, value] of Object.entries(el.dataset)) {
            if (key !== 'svelte') {
                try {
                    props[key] = JSON.parse(value);
                } catch {
                    props[key] = value;
                }
            }
        }
        
        // Svelte 컴포넌트 마운트
        new Component({ target: el, props });
        
        // SEO 콘텐츠 숨김
        el.querySelector('.seo-content')?.classList.add('hidden');
    }
});
```

### _registry.js (자동 생성)

```javascript
// Vite 빌드 시 자동 생성됨
export const registry = {
    'header': () => import('./components/navigation/Header.svelte'),
    'footer': () => import('./components/navigation/Footer.svelte'),
    'genedit-hero': () => import('../blocks/genedit-hero/HeroSection.svelte'),
    // ...
};
```

---

## 4.5 스타일 구조

### styles.css

```css
@import "tailwindcss";

/* Tailwind 소스 경로 */
@source "../templates/**/*.twig";
@source "../blocks/**/*.twig";
@source "../blocks/**/*.svelte";
@source "./components/**/*.svelte";

/* 디자인 토큰 */
@theme {
    /* 폰트 */
    --font-display: "Poppins", sans-serif;
    --font-body: "Inter", sans-serif;
    --font-korean: "Pretendard", sans-serif;
    
    /* 컬러 */
    --color-accent: #144B5C;
    --color-body: #424242;
    --color-light: #F5F5F5;
    
    /* 브레이크포인트 */
    --breakpoint-sm: 640px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 1024px;
    --breakpoint-xl: 1216px;
}

/* 언어별 폰트 */
.lang-ko {
    --font-body: "Pretendard", "Inter", sans-serif;
}
```

### editor-overrides.css

블록 에디터 전용 스타일 오버라이드:

```css
/* WordPress 에디터 기본 스타일 덮어쓰기 */
.editor-styles-wrapper {
    font-family: var(--font-body);
}

.editor-styles-wrapper h1,
.editor-styles-wrapper h2 {
    font-family: var(--font-display);
}
```

---

## 4.6 PSR-4 네임스페이스

### composer.json 설정

```json
{
    "autoload": {
        "psr-4": {
            "Genedit\\": "web/app/themes/genedit/src/"
        }
    }
}
```

### 네임스페이스 구조

| 네임스페이스 | 경로 | 역할 |
|-------------|------|------|
| `Genedit\` | `src/` | 루트 네임스페이스 |
| `Genedit\Blocks\` | `src/Blocks/` | 블록 등록 |
| `Genedit\ContactUs\` | `src/ContactUs/` | 문의 CPT |
| `Genedit\TeamMember\` | `src/TeamMember/` | 팀 멤버 CPT |
| `Genedit\Legal\` | `src/Legal/` | 법무 문서 CPT |
| `Genedit\News\` | `src/News/` | 뉴스 REST API |

---

[← 이전: 3. 기술 스택](./03-tech-stack.md) | [다음: 5. ACF 블록 명세 →](./05-blocks.md)
