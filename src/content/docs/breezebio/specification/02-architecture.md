---
title: 2. 시스템 아키텍처
---

## 2.1 전체 구조

BreezeBio 웹사이트는 **WordPress Bedrock** 구조를 기반으로, **Timber/Twig** 템플릿 엔진과 **Svelte 5** 프론트엔드 프레임워크를 결합한 하이브리드 아키텍처입니다.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'fontSize': '14px' }}}%%
flowchart TB
    USERS["**인터넷 사용자**"]

    subgraph server["웹 서버 (Nginx)"]
        NGINX["breezebio.com (VPS)"]
    end

    subgraph wp["WordPress (Bedrock 구조)"]
        subgraph theme["BreezeBio 테마"]
            direction LR
            TIMBER["**Timber**<br/>+ Twig"]
            ACF["**ACF Pro**<br/>Blocks"]
            POLYLANG["**Polylang**<br/>(i18n)"]
        end

        subgraph vite["Vite 6 빌드 시스템"]
            direction LR
            SVELTE["**Svelte 5**<br/>Components"]
            TW["**Tailwind v4**<br/>CSS-first"]
            GSAP["**GSAP**<br/>Animation"]
        end

        DB[("**MariaDB 10.11**")]
    end

    USERS --> server
    server --> wp

    style USERS fill:#fff,stroke:#333,stroke-width:1px
    style server fill:#f5f5f5,stroke:#666,stroke-width:1px
    style wp fill:#fff,stroke:#333,stroke-width:1px
    style theme fill:#f5f5f5,stroke:#666,stroke-width:1px
    style vite fill:#f5f5f5,stroke:#666,stroke-width:1px
    style DB fill:#fff,stroke:#333,stroke-width:1px
```

---

## 2.2 Bedrock 구조

### 디렉토리 구조

```
genedit/
├── config/                    # WordPress 설정
│   ├── application.php        # 공통 설정
│   └── environments/          # 환경별 오버라이드
│       ├── development.php
│       └── production.php
├── web/                       # 웹 루트
│   ├── app/                   # 커스텀 코드
│   │   ├── mu-plugins/        # Must-use 플러그인
│   │   ├── plugins/           # Composer 관리 플러그인
│   │   └── themes/            # 테마
│   │       └── genedit/       # 커스텀 테마
│   └── wp/                    # WordPress 코어
├── vendor/                    # Composer 패키지
├── .env                       # 환경 변수
├── composer.json              # PHP 의존성
└── composer.lock
```

### Bedrock의 장점

| 장점 | 설명 |
|------|------|
| **버전 관리** | WordPress 코어를 Composer로 관리, git에서 제외 |
| **환경 분리** | .env 파일로 환경별 설정 분리 |
| **보안 강화** | 웹 루트에 민감 파일 노출 방지 |
| **의존성 관리** | 플러그인/테마를 Composer로 일괄 관리 |

---

## 2.3 테마 아키텍처

### Timber + Twig

**Timber**는 WordPress를 MVC 패턴으로 사용할 수 있게 해주는 라이브러리입니다.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'fontSize': '14px' }}}%%
flowchart TB
    subgraph flow["요청 처리 흐름"]
        direction TB
        REQ["요청"] --> WP["WordPress"]
        WP --> PHP["page.php"]
        PHP --> RENDER["Timber::render()"]
        RENDER --> PAGE["**page.twig**<br/>(extends base)"]
        PAGE --> BASE["**base.twig**<br/>(HTML 구조)"]
    end

    style flow fill:#fff,stroke:#333,stroke-width:1px
    style REQ fill:#f5f5f5,stroke:#666,stroke-width:1px
    style WP fill:#fff,stroke:#333,stroke-width:1px
    style PHP fill:#fff,stroke:#333,stroke-width:1px
    style RENDER fill:#fff,stroke:#333,stroke-width:1px
    style PAGE fill:#f5f5f5,stroke:#666,stroke-width:1px
    style BASE fill:#f5f5f5,stroke:#666,stroke-width:1px
```

### Svelte 하이브리드

인터랙티브 컴포넌트는 **Svelte 5**로 구현되어 클라이언트에서 마운트됩니다.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'fontSize': '14px' }}}%%
flowchart TB
    subgraph hybrid["Svelte 하이브리드 렌더링"]
        direction TB

        subgraph step1["1. 서버 (Twig)"]
            TWIG["data-svelte 마크업 렌더링<br/>───<br/>div data-svelte='header'<br/>+ seo-content 정적 HTML"]
        end

        subgraph step2["2. 클라이언트 (Svelte)"]
            JS["querySelectorAll data-svelte<br/>───<br/>registry에서 컴포넌트 매칭<br/>→ new Component target, props"]
        end
    end

    step1 --> step2

    style hybrid fill:#fff,stroke:#333,stroke-width:1px
    style step1 fill:#f5f5f5,stroke:#666,stroke-width:1px
    style step2 fill:#f5f5f5,stroke:#666,stroke-width:1px
    style TWIG fill:#fff,stroke:#333,stroke-width:1px
    style JS fill:#fff,stroke:#333,stroke-width:1px
```

---

## 2.4 ACF 블록 시스템

### 블록 렌더링 흐름

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'fontSize': '14px' }}}%%
flowchart TB
    subgraph acf["ACF 블록 렌더링"]
        direction TB
        ADMIN["관리자 블록 추가"]
        BLOCK["**block.json**<br/>블록 메타데이터 + ACF 설정"]
        REG["**BlockRegistrar**<br/>자동 블록 등록 (PHP)"]
        TWIG["**render.twig**<br/>마크업"]
        SVELTE["**Component.svelte**<br/>인터랙션"]

        ADMIN --> BLOCK
        BLOCK --> REG
        REG --> TWIG
        TWIG --> SVELTE
    end

    style acf fill:#fff,stroke:#333,stroke-width:1px
    style ADMIN fill:#f5f5f5,stroke:#666,stroke-width:1px
    style BLOCK fill:#fff,stroke:#333,stroke-width:1px
    style REG fill:#fff,stroke:#333,stroke-width:1px
    style TWIG fill:#f5f5f5,stroke:#666,stroke-width:1px
    style SVELTE fill:#f5f5f5,stroke:#666,stroke-width:1px
```

### 블록 디렉토리 구조

```
blocks/genedit-hero/
├── block.json           # 블록 메타데이터
├── render.twig          # Twig 템플릿
├── HeroSection.svelte   # Svelte 컴포넌트
└── hero.css             # 블록 스타일 (선택)
```

---

## 2.5 Vite 빌드 시스템

### 빌드 구성

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'fontSize': '14px' }}}%%
flowchart TB
    subgraph pipeline["Vite 6 빌드 파이프라인"]
        direction TB

        subgraph src["소스 파일"]
            direction LR
            S1["src/main.js<br/>엔트리포인트"]
            S2["src/styles.css<br/>Tailwind + 디자인 토큰"]
            S3["blocks/**/*.svelte<br/>블록 컴포넌트"]
            S4["src/components/<br/>공통 컴포넌트"]
        end

        BUILD["**Vite Build**<br/>───<br/>Svelte · Tailwind v4 · PostCSS"]

        subgraph out["출력 파일 (dist/)"]
            direction LR
            O1["assets/main-hash.js"]
            O2["assets/main-hash.css"]
            O3[".vite/manifest.json"]
        end
    end

    src --> BUILD
    BUILD --> out

    style pipeline fill:#fff,stroke:#333,stroke-width:1px
    style src fill:#f5f5f5,stroke:#666,stroke-width:1px
    style BUILD fill:#fff,stroke:#333,stroke-width:2px
    style out fill:#f5f5f5,stroke:#666,stroke-width:1px
```

### 개발 서버 (HMR)

```bash
ddev npm run dev
```

- Vite 개발 서버가 `http://localhost:5173`에서 실행
- HMR(Hot Module Replacement)로 실시간 반영
- Svelte 컴포넌트 변경 시 페이지 새로고침 없이 업데이트

---

## 2.6 데이터 흐름

### 콘텐츠 렌더링

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'fontSize': '14px' }}}%%
sequenceDiagram
    participant A as 관리자
    participant W as WordPress
    participant U as 사용자

    A->>W: 1. 블록으로 편집
    W->>W: 2. DB 저장
    U->>W: 3. 페이지 요청
    W->>W: 4. PHP → Twig 렌더
    W->>W: 5. Svelte 마운트
    W->>U: 6. 페이지 표시
```

### Contact 폼 제출

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'fontSize': '14px' }}}%%
sequenceDiagram
    participant U as 사용자
    participant F as 프론트엔드
    participant W as WordPress

    U->>F: 1. 폼 작성
    F->>W: 2. REST API 호출<br/>POST /wp-json/genedit/v1/contact
    W->>W: 3. CPT 저장
    W->>W: 4. 이메일 발송
    W->>F: 5. 성공 응답
    F->>U: 6. 확인 메시지
```

---

[← 이전: 1. 프로젝트 개요](./01-overview.md) | [다음: 3. 기술 스택 →](./03-tech-stack.md)
