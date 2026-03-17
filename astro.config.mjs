import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
  site: 'https://manual.skunkworks.co.kr',
  base: '/',
  integrations: [
    mermaid(),
    starlight({
      title: '고객 매뉴얼',
      customCss: ['./src/styles/custom.css'],
      components: {
        Header: './src/components/Header.astro',
        PageTitle: './src/components/PageTitle.astro',
        Sidebar: './src/components/Sidebar.astro',
        Pagination: './src/components/Pagination.astro',
        SiteTitle: './src/components/SiteTitle.astro',
      },
      defaultLocale: 'root',
      locales: {
        root: { label: '한국어', lang: 'ko' },
      },
      sidebar: [
        {
          label: 'AI 화면해설 PoC',
          items: [
            { label: '개요', link: '/ai-narration-poc/' },
            {
              label: '시스템 구성 및 운영 비용',
              autogenerate: { directory: 'ai-narration-poc/system-design' },
            },
            {
              label: '개발 비용',
              autogenerate: { directory: 'ai-narration-poc/development-cost' },
            },
          ],
        },
        {
          label: 'SI-Data',
          items: [
            { label: '개요', link: '/si-data/' },
            {
              label: '검색 시스템',
              autogenerate: { directory: 'si-data/search-system' },
            },
            {
              label: 'LLM Search PoC',
              autogenerate: { directory: 'si-data/llm-search-poc' },
            },
            {
              label: '시스템 구성도',
              link: '/si-data/system-architecture/',
            },
            {
              label: '신규 콘텐츠 설계',
              items: [
                { label: '설계 문서', link: '/si-data/new-content-design/design-overview/' },
                { label: 'GNB 메뉴 구조', link: '/si-data/new-content-design/gnb-menu-structure/' },
                { label: '택소노미', autogenerate: { directory: 'si-data/new-content-design/taxonomy' } },
                { label: '콘텐츠 타입', autogenerate: { directory: 'si-data/new-content-design/content-types' } },
                { label: '마이그레이션', link: '/si-data/new-content-design/migration-report/' },
              ],
            },
          ],
        },
        {
          label: '디캠프',
          items: [
            { label: '개요', link: '/dcamp/' },
            {
              label: '관리자 매뉴얼',
              autogenerate: { directory: 'dcamp/manual' },
            },
            {
              label: '개발 명세서',
              autogenerate: { directory: 'dcamp/specification' },
            },
            {
              label: '화면계획서',
              autogenerate: { directory: 'dcamp/plan' },
            },
          ],
        },
        {
          label: '좋은생각 ISP',
          items: [
            { label: '개요', link: '/goodthinking-isp/' },
            { label: '추진 일정', link: '/goodthinking-isp/schedule/' },
            {
              label: '1. 프로젝트 개요',
              autogenerate: { directory: 'goodthinking-isp/01-project-overview' },
            },
            {
              label: '2. 현황 분석',
              items: [
                { label: '개요', link: '/goodthinking-isp/02-analysis/' },
                { label: '조사 가이드 및 주의사항', link: '/goodthinking-isp/02-analysis/investigation-guide/' },
                { label: '시스템 정밀진단', link: '/goodthinking-isp/02-analysis/system-diagnosis/' },
                { label: '업무 분석', link: '/goodthinking-isp/02-analysis/business-analysis/' },
                { label: '이해관계자 인터뷰', link: '/goodthinking-isp/02-analysis/interview/' },
                { label: '요구사항 분석', link: '/goodthinking-isp/02-analysis/requirements/' },
                {
                  label: '관련 회의록 및 인터뷰 자료',
                  autogenerate: { directory: 'goodthinking-isp/02-analysis/meeting-notes' },
                },
              ],
            },
            {
              label: '3. 목표 모델 설계',
              autogenerate: { directory: 'goodthinking-isp/03-design' },
            },
            {
              label: '4. 이행 계획',
              autogenerate: { directory: 'goodthinking-isp/04-implementation' },
            },
            {
              label: '5. 향후 확장 로드맵',
              autogenerate: { directory: 'goodthinking-isp/05-future-roadmap' },
            },
            {
              label: '부록',
              autogenerate: { directory: 'goodthinking-isp/appendix' },
            },
          ],
        },
        {
          label: 'AI 기반 국회기록원 아카이브 모형',
          items: [
            { label: '개요', link: '/nanet-platform/' },
            {
              label: '1. 수집 (Collection)',
              autogenerate: { directory: 'nanet-platform/01-collection' },
            },
            {
              label: '2. 연결 (Connection)',
              autogenerate: { directory: 'nanet-platform/02-connection' },
            },
            {
              label: '3. 서비스 (Service)',
              autogenerate: { directory: 'nanet-platform/03-service' },
            },
            {
              label: '4. 확장 (Expansion)',
              autogenerate: { directory: 'nanet-platform/04-expansion' },
            },
            {
              label: '부록',
              autogenerate: { directory: 'nanet-platform/appendix' },
            },
          ],
        },
        {
          label: '삼화 리브랜딩',
          autogenerate: { directory: 'samhwa-rebranding' },
        },
        {
          label: 'BreezeBio',
          items: [
            { label: '개요', link: '/breezebio/' },
            {
              label: '관리자 매뉴얼',
              autogenerate: { directory: 'breezebio/manual' },
            },
            {
              label: '개발 명세서',
              autogenerate: { directory: 'breezebio/specification' },
            },
          ],
        },
        {
          label: '자원봉사 아카이브',
          items: [
            { label: '개요', link: '/v1365/' },
            {
              label: '현황 분석',
              autogenerate: { directory: 'v1365/analysis' },
            },
            {
              label: '운영유지 가이드',
              autogenerate: { directory: 'v1365/operations' },
            },
            {
              label: 'CMS 어드민 컨버팅 로드맵(제안)',
              autogenerate: { directory: 'v1365/roadmap' },
            },
          ],
        },
        {
          label: 'GCED Clearinghouse',
          items: [
            { label: '개요', link: '/gced/' },
            {
              label: '관리자 매뉴얼',
              items: [
                { label: '목차', link: '/gced/manual/' },
                { label: '시스템 개요', link: '/gced/manual/01-system-overview/' },
                { label: '인프라 현황', link: '/gced/manual/01-1-infrastructure/' },
                { label: '역할 및 권한', link: '/gced/manual/02-user-roles/' },
                {
                  label: '콘텐츠 관리',
                  items: [
                    { label: '콘텐츠 관리 개요', link: '/gced/manual/03-content-management/' },
                    { label: '자료(Resources)', link: '/gced/manual/03-content-management/01-resources/' },
                    { label: '이벤트(Events)', link: '/gced/manual/03-content-management/02-events/' },
                    { label: '뉴스(News)', link: '/gced/manual/03-content-management/03-news/' },
                    { label: '유용한 링크(Useful Links)', link: '/gced/manual/03-content-management/04-useful-links/' },
                  ],
                },
                { label: '택소노미 관리', link: '/gced/manual/04-taxonomy/' },
                {
                  label: '워크플로우',
                  items: [
                    { label: '워크플로우 개요', link: '/gced/manual/05-workflow/' },
                    { label: '협력연구자(RC)', link: '/gced/manual/05-workflow/01-research-collaborator/' },
                    { label: 'DB 총괄관리자(GS)', link: '/gced/manual/05-workflow/02-general-supervisor/' },
                    { label: '다큐멘탈리스트(Documentalist)', link: '/gced/manual/05-workflow/03-documentalist/' },
                  ],
                },
                {
                  label: '번역 관리',
                  items: [
                    { label: '번역 관리 개요', link: '/gced/manual/06-translation/' },
                    { label: '관리자용 (요청·검토)', link: '/gced/manual/06-translation/01-admin/' },
                    { label: '번역자용 (Local Tasks)', link: '/gced/manual/06-translation/02-translator/' },
                  ],
                },
                { label: '웹사이트 관리', link: '/gced/manual/07-site-admin/' },
              ],
            },
          ],
        },
        {
          label: '한울타리',
          items: [
            { label: '개요', link: '/mcfamily/' },
            {
              label: '제출 문서',
              autogenerate: { directory: 'mcfamily/document' },
            },
            {
              label: '보안교육 자료 (2026.03)',
              autogenerate: { directory: 'mcfamily/education' },
            },
          ],
        },
        {
          label: '충남지역공동체활성화센터',
          items: [
            { label: '개요', link: '/clocal/' },
            { label: '아우름 분석 및 개선 제안', link: '/clocal/01-awoorum-analysis/' },
            { label: 'DB 플랫폼 ISP 제안', link: '/clocal/02-db-platform-isp/' },
          ],
        },
        {
          label: '서울시립사진미술관 포토라이브러리',
          items: [
            { label: '개요', link: '/sema-photo/' },
            {
              label: '시민 교육 프로그램',
              autogenerate: { directory: 'sema-photo/education' },
            },
          ],
        },
      ],
    }),
  ],
});
