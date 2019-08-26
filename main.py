import numpy as np
import pandas as pd
from web_scrapper import scroll

# Now that the page is fully scrolled, grab the source code.
# browser = scroll(max_interations=5,url="https://twitter.com/search?l=&q=esquerda%20OR%20direita%20since%3A2013-01-01%20until%3A2013-12-31&src=typd&lang=pt", delay=1)
browser = scroll(max_interations=5,url="https://twitter.com/t3knus", delay=1)
source_data = browser.page_source
tweets = browser.find_elements_by_class_name('tweet-text')
for index, tweet in zip(list(range(0,len(tweets)-1)),tweets):
		print("[0{}] {}:{}".format(index,tweet.text,tweet.get_attribute('lang')))

elements = browser.find_elements_by_xpath('//*[@id="page-container"]/div[2]/div/div/div[1]/div/div/div/div[1]/h1/a')
bio = browser.find_elements_by_xpath('//*[@id="page-container"]/div[2]/div/div/div[1]/div/div/div/div[1]/p')
tts =browser.find_elements_by_class_name('tweet')
for element in elements:
		print("Name: {}".format(element.text))
for b in bio:
		print("Bio: {}".format(b.text))

#compare name in perm link and user to discover a retweet
for t in tts:
		print("type: {}".format(t.get_attribute('data-permalink-path')))
print("\n")
#if has some quoted compare with the previous list and set as retweet too
tts =browser.find_elements_by_class_name('QuoteTweet-link')
retweet_bin = list()
for t in tts:
		print("type: {}".format(t.get_attribute('data-conversation-id')))
# tweetys = [tweet.text for tweet in tweets]
# tweetys2 = [tweet.text.encode('utf-8') for tweet in tweets]

browser.close()
#To Disk
# pd.DataFrame(tweetys2).to_csv('/home/teknus/Documents/tcc/src/save.csv', index = False)
# np.savetxt('base7.csv', tweetys2, delimiter=',', fmt='%10s')
