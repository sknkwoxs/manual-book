import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = join(__dirname, 'images');
const BASE_URL = 'https://gced2025.ddev.site';

// 일회용 로그인 URL 얻기
function getLoginUrl() {
  try {
    const result = execSync('cd /Users/skunk/docs/github/gced2025 && ddev drush uli', { encoding: 'utf-8' });
    return result.trim();
  } catch (e) {
    console.error('drush uli 실행 실패:', e.message);
    return null;
  }
}

async function takeScreenshots() {
  await mkdir(IMAGES_DIR, { recursive: true });
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--ignore-certificate-errors']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
    locale: 'en-US'
  });
  
  const page = await context.newPage();
  
  try {
    // 1. 로그인 화면 (로그인 전)
    console.log('📸 로그인 화면 촬영...');
    await page.goto(`${BASE_URL}/user/login`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({ path: join(IMAGES_DIR, 'login.png'), fullPage: false });
    
    // 2. 일회용 URL로 로그인
    console.log('🔐 관리자 로그인 중...');
    const loginUrl = getLoginUrl();
    if (!loginUrl) {
      throw new Error('로그인 URL을 가져올 수 없습니다');
    }
    await page.goto(loginUrl);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // 3. 대시보드
    console.log('📸 대시보드 촬영...');
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: join(IMAGES_DIR, 'dashboard.png'), fullPage: false });
    
    // 4. Resources 목록
    console.log('📸 Resources 목록 촬영...');
    await page.goto(`${BASE_URL}/admin/content?type=resources`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: join(IMAGES_DIR, 'resource-list.png'), fullPage: false });
    
    // 5. Resource 편집 화면 (첫 번째 resource)
    console.log('📸 Resource 편집 화면 촬영...');
    const editLink = await page.$('td.views-field-operations a[href*="/edit"]');
    if (editLink) {
      const href = await editLink.getAttribute('href');
      await page.goto(`${BASE_URL}${href}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: join(IMAGES_DIR, 'resource-edit.png'), fullPage: false });
      
      // 워크플로우 상태 드롭다운 캡쳐 (우측 사이드바)
      const workflowSection = await page.$('.layout-region-node-secondary');
      if (workflowSection) {
        await workflowSection.screenshot({ path: join(IMAGES_DIR, 'workflow-status.png') });
      }
    } else {
      console.log('  ⚠️ 편집 링크를 찾을 수 없음');
    }
    
    // 6. Events 목록
    console.log('📸 Events 목록 촬영...');
    await page.goto(`${BASE_URL}/admin/content?type=events`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: join(IMAGES_DIR, 'events-list.png'), fullPage: false });
    
    // 7. News 목록
    console.log('📸 News 목록 촬영...');
    await page.goto(`${BASE_URL}/admin/content?type=news`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: join(IMAGES_DIR, 'news-list.png'), fullPage: false });
    
    // 8. 워크플로우 - Draft
    console.log('📸 Workflow Draft 목록 촬영...');
    await page.goto(`${BASE_URL}/admin/content/resources-workflow/draft`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: join(IMAGES_DIR, 'workflow-draft.png'), fullPage: false });
    
    // 9. 워크플로우 - Published
    console.log('📸 Workflow Published 목록 촬영...');
    await page.goto(`${BASE_URL}/admin/content/resources-workflow/published`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: join(IMAGES_DIR, 'workflow-published.png'), fullPage: false });
    
    // 10. Taxonomy - Keywords
    console.log('📸 Taxonomy Keywords 촬영...');
    await page.goto(`${BASE_URL}/admin/structure/taxonomy/manage/keywords/overview`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: join(IMAGES_DIR, 'taxonomy-keywords.png'), fullPage: false });
    
    // 11. Taxonomy - Creator
    console.log('📸 Taxonomy Creator 촬영...');
    await page.goto(`${BASE_URL}/admin/structure/taxonomy/manage/creator/overview`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: join(IMAGES_DIR, 'taxonomy-creator.png'), fullPage: false });
    
    // 12. People 목록
    console.log('📸 People 목록 촬영...');
    await page.goto(`${BASE_URL}/admin/people`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: join(IMAGES_DIR, 'people-list.png'), fullPage: false });
    
    // 13. People 추가 화면
    console.log('📸 People 추가 화면 촬영...');
    await page.goto(`${BASE_URL}/admin/people/create`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: join(IMAGES_DIR, 'people-add.png'), fullPage: false });
    
    // 14. TMGMT Sources
    console.log('📸 Translation Sources 촬영...');
    await page.goto(`${BASE_URL}/admin/tmgmt/sources`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: join(IMAGES_DIR, 'translate-sources.png'), fullPage: false });
    
    // 15. Site Settings (Main & Popup)
    console.log('📸 Site Settings 촬영...');
    await page.goto(`${BASE_URL}/admin/gced/settings`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: join(IMAGES_DIR, 'site-settings.png'), fullPage: false });
    
    // 16. Statistics - Content
    console.log('📸 Statistics Content 촬영...');
    await page.goto(`${BASE_URL}/admin/gced/statistics/content`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: join(IMAGES_DIR, 'statistics-content.png'), fullPage: false });
    
    // 17. Statistics - View
    console.log('📸 Statistics View 촬영...');
    await page.goto(`${BASE_URL}/admin/gced/statistics/view`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: join(IMAGES_DIR, 'statistics-view.png'), fullPage: false });
    
    // 18. Statistics - Search
    console.log('📸 Statistics Search 촬영...');
    await page.goto(`${BASE_URL}/admin/gced/statistics/search`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: join(IMAGES_DIR, 'statistics-search.png'), fullPage: false });
    
    // 19. Statistics - Visit
    console.log('📸 Statistics Visit 촬영...');
    await page.goto(`${BASE_URL}/admin/gced/statistics/visit`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: join(IMAGES_DIR, 'statistics-visit.png'), fullPage: false });
    
    // 20. Main & Popup Settings (Featured)
    console.log('📸 Main Featured 촬영...');
    await page.goto(`${BASE_URL}/admin/gced/settings`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    // Featured Collection 섹션 스크린샷
    await page.screenshot({ path: join(IMAGES_DIR, 'main-featured.png'), fullPage: false });
    
    // 21. Popup 설정 (같은 페이지 - 스크롤해서 팝업 섹션)
    console.log('📸 Main Popup 촬영...');
    // 페이지 하단으로 스크롤하여 팝업 섹션 캡쳐
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.screenshot({ path: join(IMAGES_DIR, 'main-popup.png'), fullPage: false });
    
    console.log('✅ 스크린샷 촬영 완료!');
    console.log(`📁 저장 위치: ${IMAGES_DIR}`);
    
  } catch (error) {
    console.error('❌ 에러 발생:', error.message);
  } finally {
    await browser.close();
  }
}

takeScreenshots();
