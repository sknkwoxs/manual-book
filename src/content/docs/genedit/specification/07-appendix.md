---
title: 7. 부록
---

## A. 명령어 레퍼런스

### DDEV 환경 명령어

| 명령어 | 설명 |
|--------|------|
| `ddev start` | 환경 시작 |
| `ddev stop` | 환경 중지 |
| `ddev restart` | 환경 재시작 |
| `ddev launch` | 브라우저에서 사이트 열기 |
| `ddev ssh` | 컨테이너 접속 |
| `ddev describe` | 환경 정보 표시 |

### 프론트엔드 빌드

| 명령어 | 설명 |
|--------|------|
| `ddev npm run dev` | Vite 개발 서버 (HMR) |
| `ddev npm run build` | 프로덕션 빌드 |
| `ddev npm run preview` | 빌드 결과 미리보기 |
| `ddev npm run create:block` | 새 블록 생성 |

### PHP 의존성

| 명령어 | 설명 |
|--------|------|
| `ddev composer install` | 의존성 설치 |
| `ddev composer update` | 의존성 업데이트 |
| `ddev composer require [패키지]` | 새 패키지 추가 |
| `ddev composer lint` | PHP 코드 스타일 검사 |
| `ddev composer lint:fix` | PHP 코드 스타일 자동 수정 |

### WP-CLI

| 명령어 | 설명 |
|--------|------|
| `ddev wp cache flush` | 캐시 삭제 |
| `ddev wp plugin list` | 플러그인 목록 |
| `ddev wp user list` | 사용자 목록 |
| `ddev wp option get [옵션명]` | 옵션 값 조회 |
| `ddev wp rewrite flush` | 퍼머링크 재생성 |

### 팀 멤버 관리

| 명령어 | 설명 |
|--------|------|
| `ddev wp genedit team list` | 팀 멤버 목록 |
| `ddev wp genedit team import [파일]` | CSV 가져오기 |
| `ddev wp genedit team export [파일]` | CSV 내보내기 |

### 데이터베이스 동기화

| 명령어 | 설명 |
|--------|------|
| `ddev db-pull` | 운영 → 로컬 DB 동기화 |
| `ddev db-push` | 로컬 → 운영 DB 동기화 (주의!) |

---

## B. 용어집

| 용어 | 설명 |
|------|------|
| **ACF** | Advanced Custom Fields. WordPress 커스텀 필드 플러그인 |
| **Bedrock** | Roots에서 만든 WordPress 보일러플레이트 |
| **CPT** | Custom Post Type. 커스텀 포스트 타입 |
| **DDEV** | 로컬 개발 환경 도구 |
| **HMR** | Hot Module Replacement. 코드 변경 시 페이지 새로고침 없이 반영 |
| **Polylang** | WordPress 다국어 플러그인 |
| **PSR-4** | PHP 오토로딩 표준 |
| **Runes** | Svelte 5의 새로운 반응성 문법 |
| **SSR** | Server-Side Rendering. 서버 사이드 렌더링 |
| **Taxonomy** | WordPress 분류 체계 (카테고리, 태그 등) |
| **Timber** | WordPress용 Twig 템플릿 엔진 통합 라이브러리 |
| **Twig** | PHP 템플릿 엔진 |
| **Vite** | 차세대 프론트엔드 빌드 도구 |

---

## C. 파일 경로 레퍼런스

### 주요 설정 파일

| 파일 | 경로 | 설명 |
|------|------|------|
| 환경 변수 | `.env` | DB, WP 설정 |
| WP 설정 | `config/application.php` | WordPress 상수 |
| DDEV 설정 | `.ddev/config.yaml` | 로컬 환경 설정 |
| Composer | `composer.json` | PHP 의존성 |
| npm | `web/app/themes/genedit/package.json` | JS 의존성 |
| Vite | `web/app/themes/genedit/vite.config.js` | 빌드 설정 |

### 테마 핵심 파일

| 파일 | 경로 | 설명 |
|------|------|------|
| 초기화 | `functions.php` | 테마 진입점 |
| 메인 클래스 | `src/GeneditSite.php` | 테마 설정 |
| Vite 로더 | `src/Vite.php` | 에셋 로드 |
| CSS 엔트리 | `src/styles.css` | Tailwind + 토큰 |
| JS 엔트리 | `src/main.js` | Svelte 마운트 |

### 템플릿 파일

| 파일 | 경로 | 용도 |
|------|------|------|
| 기본 레이아웃 | `templates/base.twig` | HTML 구조 |
| 홈페이지 | `templates/front-page.twig` | 메인 페이지 |
| 기본 페이지 | `templates/page.twig` | 일반 페이지 |
| 뉴스 상세 | `templates/single.twig` | 개별 포스트 |
| 아카이브 | `templates/archive.twig` | 목록 페이지 |
| About | `templates/page-about.twig` | About 페이지 |

---

## D. Cloudflare 관리 가이드

### 대시보드 접속

1. https://dash.cloudflare.com 접속
2. 계정 로그인
3. breezebio.com 도메인 선택

### DNS 레코드 관리

**경로**: DNS → Records

| 작업 | 절차 |
|------|------|
| 레코드 추가 | "Add record" 클릭 → 타입/이름/값 입력 → Save |
| 레코드 수정 | 해당 레코드 우측 "Edit" → 수정 → Save |
| 레코드 삭제 | 해당 레코드 우측 "Edit" → Delete |

### Proxy 설정

| 상태 | 아이콘 | 설명 |
|------|--------|------|
| Proxied | 🟠 주황색 구름 | Cloudflare CDN + 보안 활성화 |
| DNS only | ⚪ 회색 구름 | DNS만 사용 (CDN 비활성화) |

> **권장**: 웹사이트는 Proxied(주황색), 메일 서버는 DNS only(회색)

### SSL/TLS 설정

**경로**: SSL/TLS → Overview

| 모드 | 설명 |
|------|------|
| Off | 암호화 없음 (비권장) |
| Flexible | Cloudflare↔사용자만 암호화 |
| Full | 양쪽 암호화, 인증서 검증 안 함 |
| Full (Strict) | 양쪽 암호화 + 유효한 인증서 필수 (권장) |

### 캐시 관리

**경로**: Caching → Configuration

| 작업 | 방법 |
|------|------|
| 전체 캐시 삭제 | "Purge Everything" 클릭 |
| 특정 URL 삭제 | "Custom Purge" → URL 입력 |
| 개발 모드 | "Development Mode" 토글 (3시간) |

### Page Rules (선택)

특정 URL에 대한 규칙 설정:

**경로**: Rules → Page Rules

예시: 관리자 페이지 캐시 비활성화
```
URL: breezebio.com/wp/*
설정: Cache Level = Bypass
```

---

## E. 트러블슈팅

### 빌드 오류

**증상**: `ddev npm run build` 실패

**해결**:
```bash
cd web/app/themes/genedit
rm -rf node_modules package-lock.json
ddev npm install
ddev npm run build
```

### 스타일이 적용되지 않음

**증상**: Tailwind 클래스가 작동하지 않음

**해결**:
1. `src/styles.css`의 `@source` 경로 확인
2. 해당 경로에 파일이 있는지 확인
3. `ddev npm run build` 재실행

### Svelte 컴포넌트가 마운트되지 않음

**증상**: `data-svelte` 요소가 빈 상태로 남음

**해결**:
1. 브라우저 콘솔에서 JS 오류 확인
2. `_registry.js`에 컴포넌트가 등록되어 있는지 확인
3. 컴포넌트 이름 철자 확인

### 다국어 콘텐츠가 표시되지 않음

**증상**: 한국어 페이지가 404

**해결**:
1. Polylang에서 언어 설정 확인
2. 해당 콘텐츠에 언어가 할당되어 있는지 확인
3. 퍼머링크 재생성: `ddev wp rewrite flush`

### Contact 폼 제출 오류

**증상**: 폼 제출 시 오류 발생

**해결**:
1. REST API 엔드포인트 확인: `/wp-json/genedit/v1/contact`
2. 필수 필드 검증
3. SMTP 설정 확인 (이메일 발송 오류인 경우)

---

## F. 참고 자료

### 공식 문서

| 기술 | URL |
|------|-----|
| WordPress | https://developer.wordpress.org |
| Bedrock | https://roots.io/bedrock/docs |
| Timber | https://timber.github.io/docs |
| Twig | https://twig.symfony.com/doc |
| ACF | https://www.advancedcustomfields.com/resources |
| Svelte 5 | https://svelte.dev/docs |
| Tailwind CSS v4 | https://tailwindcss.com/docs |
| Vite | https://vitejs.dev/guide |
| DDEV | https://ddev.readthedocs.io |
| Cloudflare | https://developers.cloudflare.com |

### 내부 문서

| 문서 | 설명 |
|------|------|
| `AGENTS.md` | 프로젝트 지식 베이스 |
| `.sisyphus/` | 작업 계획/초안 |

---

## G. 연락처

### 개발 지원

**스컹크웍스스튜디오**
- Email: admin@skunkworks.co.kr
- GitHub: https://github.com/sknkwoxs

### 운영 서버

- 도메인: breezebio.com
- DNS/CDN: Cloudflare
- 호스팅: VPS (genedit 서버)
