from playwright.sync_api import sync_playwright
import os

def verify_site_flow():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Get absolute path
        cwd = os.getcwd()

        # 1. Access Login Page (index.html)
        print("Accessing Login Page...")
        page.goto(f"file://{cwd}/index.html")
        page.screenshot(path="verification/1_login_page.png")

        # 2. Enter Password
        print("Entering Password...")
        page.fill("#passwordInput", "251105")
        page.click("#btnLogin")

        # 3. Verify Main Menu (Magazine Cover)
        print("Verifying Main Menu...")
        page.wait_for_selector("#magazineSection:not(.hidden)")
        page.screenshot(path="verification/2_main_menu.png")

        # 4. Navigate to Manga Page
        print("Navigating to Manga Page...")
        page.click("text=漫画恋爱史")
        page.wait_for_selector(".comic-container")
        page.screenshot(path="verification/3_manga_page.png")

        # 5. Flip pages (scroll)
        print("Scrolling Manga...")
        page.click("#btnNext")
        page.wait_for_timeout(500) # Wait for scroll
        page.screenshot(path="verification/4_manga_scrolled.png")

        # 6. Go back and navigate to Game
        print("Returning to Menu and going to Game...")
        page.click(".back-btn")
        page.wait_for_selector("#magazineSection:not(.hidden)")
        page.click("text=游戏章节")

        # 7. Verify Game Mode Selection
        print("Verifying Game Mode Selection...")
        page.wait_for_selector("#modeSelection")
        page.screenshot(path="verification/5_game_mode_selection.png")

        # 8. Enter Game
        print("Entering Game...")
        page.click("#modeTools")
        page.wait_for_selector("#hero", state="visible")
        page.screenshot(path="verification/6_game_hero.png")

        browser.close()
        print("Verification Complete.")

if __name__ == "__main__":
    verify_site_flow()
