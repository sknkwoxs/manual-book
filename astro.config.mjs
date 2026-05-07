import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://manual.skunkworks.co.kr',
  base: '/',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
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
        Search: './src/components/Search.astro',
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
              label: '주간 보고서',
              autogenerate: { directory: 'dcamp/reports' },
            },
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
              items: [
                { label: '1.1. 사업개요', link: '/goodthinking-isp/01-project-overview/business-overview/' },
                { label: '1.2. 추진 일정', link: '/goodthinking-isp/schedule/' },
                { label: '1.3. 현황 및 개선방향', link: '/goodthinking-isp/01-project-overview/as-is-to-be/' },
              ],
            },
            {
              label: '2. 현황 분석',
              items: [
                { label: '2.1. 개요', link: '/goodthinking-isp/02-analysis/' },
                { label: '2.2. 조사 가이드 및 주의사항', link: '/goodthinking-isp/02-analysis/investigation-guide/' },
                { label: '2.3. 시스템 정밀진단', link: '/goodthinking-isp/02-analysis/system-diagnosis/' },
                { label: '2.4. 업무 분석', link: '/goodthinking-isp/02-analysis/business-analysis/' },
                { label: '2.5. 이해관계자 인터뷰', link: '/goodthinking-isp/02-analysis/interview/' },
                {
                  label: '2.5.1. 인터뷰 결과',
                  items: [
                    { label: '개요', link: '/goodthinking-isp/02-analysis/meeting-notes/' },
                    { label: '정기구독팀', link: '/goodthinking-isp/02-analysis/meeting-notes/subscription-team-interview/' },
                    { label: '편집팀', link: '/goodthinking-isp/02-analysis/meeting-notes/editing-team-interview/' },
                    { label: '경영지원팀', link: '/goodthinking-isp/02-analysis/meeting-notes/management-support-team-interview/' },
                    { label: '외주콜센터', link: '/goodthinking-isp/02-analysis/meeting-notes/call-center-interview/' },
                    { label: '영업추진팀', link: '/goodthinking-isp/02-analysis/meeting-notes/sales-team-interview/' },
                  ],
                },
                {
                  label: '2.5.2. 요구사항 정리',
                  items: [
                    { label: 'CS 시스템 (25건)', link: '/goodthinking-isp/02-analysis/meeting-notes/cs-system-requirements/' },
                    { label: '어드민·CMS (11건)', link: '/goodthinking-isp/02-analysis/meeting-notes/admin-cms-requirements/' },
                    { label: '기타 (2건)', link: '/goodthinking-isp/02-analysis/meeting-notes/etc-requirements/' },
                  ],
                },
                {
                  label: '2.6. 메뉴 분석',
                  items: [
                    { label: '2.6.1. 개요', link: '/goodthinking-isp/02-analysis/menu-analysis/' },
                    { label: '2.6.2. CS 시스템 메뉴 인벤토리', link: '/goodthinking-isp/02-analysis/menu-analysis/cs-menu-inventory/' },
                  ],
                },
                { label: '2.7. 엔티티 관계도', link: '/goodthinking-isp/02-analysis/entity-map/' },
              ],
            },
            {
              label: '3. 기능요건 도출',
              items: [
                { label: '3.1. 개요', link: '/goodthinking-isp/03-requirements/' },
                { label: '3.2. 대시보드', link: '/goodthinking-isp/03-requirements/dashboard/' },
                { label: '3.3. 고객 관리', link: '/goodthinking-isp/03-requirements/customer-management/' },
                { label: '3.4. 구독 관리', link: '/goodthinking-isp/03-requirements/subscription-management/' },
                { label: '3.5. 주문 관리', link: '/goodthinking-isp/03-requirements/order-management/' },
                { label: '3.6. 배송 관리', link: '/goodthinking-isp/03-requirements/delivery-management/' },
                { label: '3.7. 결제/정산', link: '/goodthinking-isp/03-requirements/payment-settlement/' },
                { label: '3.8. CS/상담', link: '/goodthinking-isp/03-requirements/cs-consultation/' },
                { label: '3.9. 선물 관리', link: '/goodthinking-isp/03-requirements/gift-management/' },
                { label: '3.10. 재고/도서', link: '/goodthinking-isp/03-requirements/inventory-book/' },
                { label: '3.11. 시스템 관리', link: '/goodthinking-isp/03-requirements/system-admin/' },
                { label: '3.12. 비기능 요구사항', link: '/goodthinking-isp/03-requirements/non-functional/' },
              ],
            },
            {
              label: '4. 목표 모델 설계',
              items: [
                { label: '4.1. 엔티티 조감도', link: '/goodthinking-isp/04-design/entity-map-tobe/' },
                { label: '4.2. 목표 모델 설계', link: '/goodthinking-isp/04-design/' },
                { label: '4.3. 아키텍처 설계 방법론', link: '/goodthinking-isp/04-design/architecture-methodology/' },
                { label: '4.4. 데이터 통합 모델', link: '/goodthinking-isp/04-design/data-integration/' },
                { label: '4.5. 자동화 프로세스', link: '/goodthinking-isp/04-design/process-automation/' },
                { label: '4.6. 품질 속성 시나리오', link: '/goodthinking-isp/04-design/quality-scenarios/' },
                { label: '4.7. 유틸리티 구조', link: '/goodthinking-isp/04-design/utility-tree/' },
                { label: '4.8. 웹 시스템 아키텍처', link: '/goodthinking-isp/04-design/web-architecture/' },
              ],
            },
            {
              label: '5. 이행 계획',
              items: [
                { label: '5.1. 개요', link: '/goodthinking-isp/05-implementation/' },
                { label: '5.2. 마이그레이션 계획', link: '/goodthinking-isp/05-implementation/migration-plan/' },
                { label: '5.3. 발주 지원(RFP)', link: '/goodthinking-isp/05-implementation/rfp-preparation/' },
              ],
            },
            {
              label: '6. 향후 확장 로드맵',
              items: [
                { label: '6.1. 개요', link: '/goodthinking-isp/06-future-roadmap/' },
                { label: '6.2. AI 기술 도입', link: '/goodthinking-isp/06-future-roadmap/ai-transformation/' },
                { label: '6.3. 디지털 아카이브', link: '/goodthinking-isp/06-future-roadmap/digital-archive/' },
                { label: '6.4. 프론트엔드 리뉴얼', link: '/goodthinking-isp/06-future-roadmap/frontend-renewal/' },
              ],
            },
            {
              label: '7. 부록',
              items: [
                { label: '7.1. 개요', link: '/goodthinking-isp/appendix/' },
                { label: '7.2. 산출물 목록', link: '/goodthinking-isp/appendix/deliverables/' },
                { label: '7.3. 용어 사전', link: '/goodthinking-isp/appendix/glossary/' },
              ],
            },
            {
              label: '8. 제안요청서(안)',
              items: [
                { label: '표지 / 목차', link: '/goodthinking-isp/08-rfp/' },
                {
                  label: '제1장 사업 개요',
                  items: [
                    { label: '1. 사업 개요', link: '/goodthinking-isp/08-rfp/01-overview/' },
                  ],
                },
                {
                  label: '제2장 현황 및 문제점',
                  items: [
                    { label: '2. 현황 및 문제점', link: '/goodthinking-isp/08-rfp/02-current-status/' },
                  ],
                },
                {
                  label: '제3장 사업 추진 전략',
                  items: [
                    { label: '3. 사업 추진 전략', link: '/goodthinking-isp/08-rfp/03-strategy/' },
                  ],
                },
                {
                  label: '제4장 제안 요청 사항',
                  items: [
                    { label: '4. 제안 요청 개요', link: '/goodthinking-isp/08-rfp/04-proposal-request/' },
                    { label: '4.3.1 시스템 구축(STR)', link: '/goodthinking-isp/08-rfp/04-proposal-request/str-system-build/' },
                    { label: '4.3.2 기능(SRE)', link: '/goodthinking-isp/08-rfp/04-proposal-request/sre-functional/' },
                    { label: '4.3.3 보안(SER)', link: '/goodthinking-isp/08-rfp/04-proposal-request/ser-security/' },
                    { label: '4.3.4 데이터(DAR)', link: '/goodthinking-isp/08-rfp/04-proposal-request/dar-data/' },
                    { label: '4.3.5 테스트·운영(TER)', link: '/goodthinking-isp/08-rfp/04-proposal-request/ter-test-ops/' },
                    { label: '4.3.6 교육·기술지원(EDR)', link: '/goodthinking-isp/08-rfp/04-proposal-request/edr-education/' },
                    { label: '4.3.7 제약 사항(COR)', link: '/goodthinking-isp/08-rfp/04-proposal-request/cor-constraints/' },
                  ],
                },
                {
                  label: '제5장 제안서 작성 안내',
                  items: [
                    { label: '5. 제안서 작성 안내', link: '/goodthinking-isp/08-rfp/05-proposal-guideline/' },
                  ],
                },
                {
                  label: '제6장 제안 안내 및 평가',
                  items: [
                    { label: '6. 제안 안내 및 평가', link: '/goodthinking-isp/08-rfp/06-evaluation/' },
                  ],
                },
                {
                  label: '부록',
                  items: [
                    { label: '부록 표지', link: '/goodthinking-isp/08-rfp/appendix/' },
                    { label: '[부록 1] 개인정보처리위탁 계약서', link: '/goodthinking-isp/08-rfp/appendix/01-personal-info-consignment/' },
                    { label: '[부록 2] 보안 위약금 부과 기준', link: '/goodthinking-isp/08-rfp/appendix/02-security-penalty/' },
                    { label: '[부록 3] 보안 위반 처리 기준', link: '/goodthinking-isp/08-rfp/appendix/03-security-violation/' },
                    { label: '[부록 4] 누설금지 대상 정보', link: '/goodthinking-isp/08-rfp/appendix/04-confidentiality/' },
                  ],
                },
                {
                  label: '별지 서식',
                  items: [
                    { label: '제1호~제15호 서식', link: '/goodthinking-isp/08-rfp/forms/' },
                  ],
                },
              ],
            },
            {
              label: '9. 산출 견적서',
              items: [
                { label: '표지 / 목차', link: '/goodthinking-isp/09-cost-estimate/' },
                { label: '9.1 FP 정통법 기반', link: '/goodthinking-isp/09-cost-estimate/01-fp-method/' },
                { label: '9.2 인건비 직접 산정', link: '/goodthinking-isp/09-cost-estimate/02-mm-method/' },
              ],
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
          label: 'SP100주년 뮤지엄',
          items: [
            { label: '개요', link: '/samhwa-musuem/' },
            {
              label: '1. 관리자 매뉴얼',
              items: [
                { label: '1.1. 시스템 개요', link: '/samhwa-musuem/manual/01-system-overview/' },
                {
                  label: '1.2. 이벤트 관리',
                  items: [
                    { label: '1.2.1. 이벤트 생성 및 관리', link: '/samhwa-musuem/manual/event-management/01-event-crud/' },
                    { label: '1.2.2. 이벤트 댓글 관리', link: '/samhwa-musuem/manual/event-management/02-comment-management/' },
                    { label: '1.2.3. 당첨자 발표 및 관리', link: '/samhwa-musuem/manual/event-management/03-winner-management/' },
                  ],
                },
                { label: '1.3. 아카이브 관리', link: '/samhwa-musuem/manual/02-gallery-management/' },
              ],
            },
            {
              label: '2. 개발 명세서',
              items: [
                { label: '2.1. 개요', link: '/samhwa-musuem/specification/' },
                { label: '2.2. 코딩가이드', link: '/samhwa-musuem/specification/01-코딩가이드/' },
                { label: '2.3. 테이블 정의서', link: '/samhwa-musuem/specification/02-테이블정의서/' },
                { label: '2.4. 화면테이블매핑', link: '/samhwa-musuem/specification/03-화면테이블매핑/' },
                { label: '2.5. DB-ERD', link: '/samhwa-musuem/specification/04-db-erd/' },
                { label: '2.6. 프로그램목록정의서', link: '/samhwa-musuem/specification/05-프로그램목록정의서/' },
                { label: '2.7. 개발소스', link: '/samhwa-musuem/specification/06-개발소스/' },
              ],
            },
          ],
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
                    { label: '파일 관리', link: '/gced/manual/03-content-management/05-files/' },
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
          label: '서울시립사진미술관 포토라이브러리',
          items: [
            { label: '개요', link: '/sema-photo/' },
            {
              label: '시민 교육 프로그램',
              autogenerate: { directory: 'sema-photo/education' },
            },
          ],
        },
        {
          label: '아카이브',
          collapsed: true,
          items: [
            { label: '아카이브 목록', link: '/archive/' },
            {
              label: 'AI 화면해설 PoC',
              collapsed: true,
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
              label: '충남지역공동체활성화센터',
              collapsed: true,
              items: [
                { label: '개요', link: '/clocal/' },
                { label: '아우름 분석 및 개선 제안', link: '/clocal/01-awoorum-analysis/' },
                { label: 'DB 플랫폼 ISP 제안', link: '/clocal/02-db-platform-isp/' },
              ],
            },
          ],
        },
      ],
    }),
  ],
});
