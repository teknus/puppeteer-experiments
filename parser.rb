require 'nokogiri'

# Fetch and parse HTML document
user = ""
doc = Nokogiri::HTML(File.read("info_#{user}.html"))
## Tweet feito por usuario X
puts "### Parse user name user @ and replys, retweets, likes"
doc.css('li div div div span', 'UserBadges').each do |page|
  puts page.content
end

puts "### Tweet Text"
doc.css('li div div div p', 'TweetTextSize TweetTextSize--normal js-tweet-text tweet-text').each do |page|
  puts page.content
end