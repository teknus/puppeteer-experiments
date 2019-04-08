require 'nokogiri'
require 'json'

def parse_tweet(doc, user)
  aux_list = []
  tweet = {}
  tweet['user'] = "@#{user}"

  ### Tweet Text'
  selector = 'TweetTextSize TweetTextSize--normal js-tweet-text tweet-text'

  doc.css('li div', selector).each do |page|
    page.each do |link, content|
      tweet['path'] = content.to_s if link.to_s == 'data-permalink-path'
    end
    tweet['retweet'] = !tweet['path'].include?("#{user}")

    page.each do |link, content|
      tweet['metions'] = content.to_s.split(' ') if link.to_s == 'data-mentions'
    end

    page.each do |link, content|
      tweet['user'] = content.to_s if link.to_s == 'data-screen-name'
    end

    page.each do |link, content|
      tweet['data-id'] = content.to_s if link.to_s == 'data-tweet-id'
    end
  end
  
  doc.css('li div div div p', selector).each do |page|

    if page.content.to_s.include?('pic.twitter.com')
      splited = page.content.split('pic.twitter.com')
      tweet['text'] = splited[0] + ' pic.twitter.com' + splited[1]
    else
      tweet['text'] = page.content.to_s
    end
    if page.content.to_s.include?('http')
      splited = page.content.split('http')
      tweet['text'] = splited[0] + ' http' + splited[1]
    else
      tweet['text'] = page.content.to_s
    end
    list_hash = []
    if tweet['text'].include?('#')
      list = tweet['text'].split(" ")
      list.each do |item|
        if item.start_with?("#")
          list_hash.push(item)
        end
      end
    end
    tweet['hashtag'] = list_hash
  end

  ## tweet actions
  doc.css('li div div div span span', 'ProfileTweet-actionCount').each do |page|
    page.each do |nameSel, contentSel|
      next unless nameSel.to_s == 'data-tweet-stat-count'

      aux_list.push(contentSel.to_s.to_i)
    end
    tweet['actions'] = { 'like': aux_list[0], 'rt': aux_list[1], 'reply': aux_list[2] }
  end

  doc.css('li div div div span', 'tweet-timestamp js-permalink js-nav js-tooltip').each do |atag|
    atag.each do |link, content|
      next unless link.to_s == 'data-time-ms'
        tweet['time-ms'] = content.to_i
      end
    end
  tweet
end

# Fetch and parse HTML document
ARGV.each do |arg|
  user = arg
  doc = Nokogiri::HTML(File.read("info_#{user}.html"))
  json_file = File.read("#{user}.json")
  user_data = JSON.parse(json_file)
  user_data['tweets'] = []
  doc.css('li', 'tweet').each do |page|
    page.each do |link, _content|
      next unless link.to_s == 'data-item-id'

      doc_tweet = Nokogiri::HTML(page.to_s)
      user_data['tweets'].push(parse_tweet(doc_tweet, user))
    end
  end
  File.open("#{user}.json", 'w') do |f|
    f.write(user_data.to_json)
  end
end
