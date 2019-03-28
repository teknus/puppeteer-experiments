require 'nokogiri'
require 'json'

def parse_tweet(doc, user)
  aux_list = []
  tweet = {}
  tweet['user'] = "@#{user}"

  ### Tweet Text'
  selector = 'TweetTextSize TweetTextSize--normal js-tweet-text tweet-text'

  tweet['retweet'] = false
  doc.css('li div', selector).each do |page|
    page.each do |link, _content|
      tweet['retweet'] = true if link.to_s == 'data-retweet-id'
    end
  end

  tweet['metions'] = []
  doc.css('li div', selector).each do |page|
    page.each do |link, content|
      tweet['metions'] = content.to_s.split(' ') if link.to_s == 'data-mentions'
    end

    page.each do |link, content|
      tweet['user'] = content.to_s if link.to_s == 'data-screen-name'
    end
  end
  doc.css('li div div div p', selector).each do |page|
    if page.content.to_s.include?('pic.twitter.com')
      splited = page.content.split('pic.twitter.com')
      tweet['text'] = splited[0] + ' pic.twitter.com' + splited[1]
    else
      tweet['text'] = page.content.to_s
    end
  end

  ## tweet actions
  doc.css('li div div div span span', 'ProfileTweet-actionCount').each do |page|
    page.each do |nameSel, contentSel|
      next unless nameSel.to_s == 'data-tweet-stat-count'

      aux_list.push(contentSel.to_s.to_i)
    end
    tweet['actions'] = { 'like': aux_list[0], 'rt': aux_list[1], 'reply': aux_list[2] }
  end

  # Meta data
  doc.css('li div div div a', 'tweet-timestamp js-permalink js-nav js-tooltip').each do |atag|
    # TODO: find some way to cancat the same tweet in a string
    atag.each do |link, content|
      next unless link.to_s == 'title'
      if content.to_s.include?('http')
        next
      else
        tweet['time'] = content.to_s
      end
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
  meta = []
  info = []
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
