from playwright.sync_api import sync_playwright
import sys

def run():
    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto('http://localhost:4173')
        page.wait_for_load_state('networkidle')

        # 1. 首页加载
        if 'learn' not in page.url and '#/' not in page.url:
            errors.append(f'首页 URL 异常: {page.url}')

        # 2. 导航到默写页
        page.get_by_role('link', name='默写').click()
        page.wait_for_load_state('networkidle')
        if '#/quiz' not in page.url:
            errors.append(f'点击默写后 URL 异常: {page.url}')

        # 3. 导航到词库页
        page.get_by_role('link', name='词库').click()
        page.wait_for_load_state('networkidle')
        if '#/wordbook' not in page.url:
            errors.append(f'点击词库后 URL 异常: {page.url}')

        # 4. 导航到统计页
        page.get_by_role('link', name='统计').click()
        page.wait_for_load_state('networkidle')
        if '#/stats' not in page.url:
            errors.append(f'点击统计后 URL 异常: {page.url}')

        # 5. 返回学习页
        page.get_by_role('link', name='学习').click()
        page.wait_for_load_state('networkidle')
        if '#/quiz' in page.url or '#/wordbook' in page.url or '#/stats' in page.url:
            errors.append(f'返回学习页 URL 异常: {page.url}')

        # 6. 无效路径重定向
        page.goto('http://localhost:4173/#/invalid')
        page.wait_for_load_state('networkidle')
        if '#/invalid' in page.url:
            errors.append(f'无效路径未重定向: {page.url}')

        # 7. 错题复习模式无错题时跳转回首页
        page.goto('http://localhost:4173/#/quiz?mode=wrong')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(500)
        if '#/quiz?mode=wrong' in page.url:
            errors.append(f'无错题时未从错题复习跳转: {page.url}')

        browser.close()

    if errors:
        print('FAILED')
        for e in errors:
            print(f'  - {e}')
        sys.exit(1)
    print('PASSED')

if __name__ == '__main__':
    run()
