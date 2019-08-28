import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options


def scroll(max_interations, url, delay):
    options = Options()
    options.add_argument('--headless')
    browser = webdriver.Chrome('/usr/bin/chromedriver', options)
    browser.get(url)

    lenOfPage = browser.execute_script(
        "window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;"
    )
    while (max_interations > 0):
        max_interations -= 1
        time.sleep(delay)
        lenOfPage = browser.execute_script(
            "window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;"
        )
    return browser
