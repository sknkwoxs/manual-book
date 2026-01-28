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
          ],
        },
      ],
    }),
  ],
});