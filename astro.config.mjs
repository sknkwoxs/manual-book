// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://manual.skunkworks.co.kr',
  base: '/',
  integrations: [
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
          label: '국회기록원 ISP',
          items: [
            { label: '개요', link: '/nara-isp/' },
            {
              label: '1. 수집',
              autogenerate: { directory: 'nara-isp/01-collection' },
            },
            {
              label: '2. 연결',
              autogenerate: { directory: 'nara-isp/02-connection' },
            },
            {
              label: '3. 서비스',
              autogenerate: { directory: 'nara-isp/03-service' },
            },
            {
              label: '4. 확장',
              autogenerate: { directory: 'nara-isp/04-expansion' },
            },
            {
              label: '산출물',
              autogenerate: { directory: 'nara-isp/deliverables' },
            },
          ],
        },
      ],
    }),
  ],
});