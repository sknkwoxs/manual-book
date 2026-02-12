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
              label: '신규 콘텐츠 설계',
              items: [
                { label: '설계 문서', link: '/si-data/new-content-design/design-overview/' },
                { label: '택소노미', autogenerate: { directory: 'si-data/new-content-design/taxonomy' } },
                { label: '콘텐츠 타입', autogenerate: { directory: 'si-data/new-content-design/content-types' } },
                { label: '구현', autogenerate: { directory: 'si-data/new-content-design/implementation' } },
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
              autogenerate: { directory: 'goodthinking-isp/02-analysis' },
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
          label: 'GenEdit (BreezeBio)',
          items: [
            { label: '개요', link: '/genedit/' },
            {
              label: '관리자 매뉴얼',
              autogenerate: { directory: 'genedit/manual' },
            },
            {
              label: '개발 명세서',
              autogenerate: { directory: 'genedit/specification' },
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
      ],
    }),
  ],
});
