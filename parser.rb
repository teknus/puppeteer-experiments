require 'nokogiri'
require 'set'

# Fetch and parse HTML document
ARGV.each do |arg|
  user = arg
  doc = Nokogiri::HTML(File.read("info_#{user}.html"))
  meta = []
  info = []
  ## Tweet feito por usuario X
  puts '### Parse user name user @ and replys, retweets, likes'
  doc.css('li div div div span', 'UserBadges').each do |page|
    meta.push(page.content.strip)
  end

  puts '### Tweet Text'
  doc.css('li div div div p', 'TweetTextSize TweetTextSize--normal js-tweet-text tweet-text').each do |page|
    info.push(page.content.strip)
  end
#   meta.to_set.each do |data| puts data end
  puts meta.to_set
end
