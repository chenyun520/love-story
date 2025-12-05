from playwright.sync_api import sync_playwright

def verify_magazine(page):
    # 1. Login Page
    page.goto("http://localhost:8080/index.html")
    page.wait_for_selector(".login-cover-card") # Check cover
    page.screenshot(path="verification/1_login.png")

    # 2. Login Logic
    page.fill("#passwordInput", "251105")
    page.click("#btnLogin")

    # 3. Check Home Page (Carousel, Timer, Sheep)
    page.wait_for_selector("#tocSection:not(.hidden)")
    page.wait_for_selector(".carousel-item")
    page.wait_for_selector(".timer-digits")
    # Wait for a sheep to appear (approx 1 sec)
    page.wait_for_timeout(2000)
    page.screenshot(path="verification/2_home.png")

    # 4. Check Manga
    page.goto("http://localhost:8080/manga.html")
    page.wait_for_selector(".story-card")
    page.wait_for_selector(".season-toggle") # Check seasons UI
    page.screenshot(path="verification/3_manga.png")

    # 5. Check Game Mode
    page.goto("http://localhost:8080/game.html")
    page.wait_for_selector("#modeSelection")
    page.screenshot(path="verification/4_game_mode.png")

    # Click Fruit Mode
    page.click("#modeFruit")

    # Wait for Difficulty Panel and Click 'Easy'
    page.wait_for_selector("#difficulty[aria-hidden='false']")
    page.click(".difficulty-card[data-diff='easy']")

    # Start Game Screen (Sheep with 'Start Game' button)
    page.wait_for_selector("#gameStartScreen")
    page.click("#btnStartGame")

    # NOW check slots
    page.wait_for_selector("#gameContainer")
    page.wait_for_selector(".slot .silhouette")
    page.screenshot(path="verification/5_fruit_game.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 414, "height": 896}) # Mobile view
        try:
            verify_magazine(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_debug.png")
        finally:
            browser.close()
