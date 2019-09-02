import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options


def open_browser():
    options = Options()
    options.add_argument('--headless')
    options.add_argument("--disable-javascript")
    return webdriver.Chrome('/usr/bin/chromedriver', chrome_options=options)


def scroll(max_interations, url, delay, browser):
    browser.get(url)
    while (max_interations > 0):
        max_interations -= 1
        time.sleep(delay)
        _ = browser.execute_script(
            "window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;"
        )
    return browser


def login_twitter(username, password, browser):
    browser.get("https://twitter.com/login")
    username_field = browser.find_element_by_class_name("js-username-field")
    password_field = browser.find_element_by_class_name("js-password-field")
    username_field.send_keys(username)
    browser.implicitly_wait(1)
    password_field.send_keys(password)
    browser.implicitly_wait(1)
    browser.find_element_by_class_name("EdgeButtom--medium").click()
    return browser
