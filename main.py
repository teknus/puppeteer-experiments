# from web_scrapper import open_browser, login_twitter, scroll
from bs4 import BeautifulSoup
import requests

def load_user_info(soup):
    user = {}
    for div in soup.findAll('div'):
        if div.has_attr('class'):
            if div['class'][0] == 'fullname':
                user['fullname'] = div.text.strip()
            if div['class'][0] == 'location':
                user['location'] = div.text.strip()
    return user

def link_button(soup):
    link = ''
    for a in soup.findAll('a'):
        if '?max_id' in a['href']:
            link = a['href']
    if link == '':
        return None
    else:
        return link

def load_soup(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text,'html.parser')
    return soup

def load_tweet_page(url):
    tmp = list()
    tweet = load_soup(url)
    for a in tweet.findAll('a'):
        if a['href'] == '#':
            tmp.append(a.text)
    return tmp


def get_tweets(user, limit=1):
    button = None
    url = "https://mobile.twitter.com"
    soup = load_soup(url + user)
    user = load_user_info(soup)
    tweets = list()
    tweets_text = list()
    tweets_timestamp = list()
    tweet_dict = dict()
    while True:
        for tables in soup.findAll('table'):
            if tables.has_attr('class'):
                if tables['class'][0] == 'tweet':
                    tweets_timestamp += load_tweet_page(url+tables['href'])
                    tweets.append(tables['href'])

        for div in soup.findAll('div'):
            if div.has_attr('class') and div['class'][0] == 'dir-ltr':
                tweets_text.append(div.text)

        for link, text, time in zip(tweets, tweets_text, tweets_timestamp):
            tweet_dict[link] = {'text': text, 'timestamp': time}

        button = link_button(soup)

        if len(tweets) >= limit or button is None:
            break
        else:
            soup = load_soup(url+button)
    user['tweets'] = tweet_dict
    return user

user = '/t3knus'
print(get_tweets(user, 10))
