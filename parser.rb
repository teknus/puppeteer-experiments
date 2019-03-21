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
  selector = 'TweetTextSize TweetTextSize--normal js-tweet-text tweet-text'
  doc.css('li div div div p', selector).each do |page|
    info.push(page.content.strip)
  end
  #   meta .each do |data| puts data end
  #puts meta 
  #puts info 

  puts 'Getting Time'
  doc.css('li div div div a', "tweet-timestamp js-permalink js-nav js-tooltip").each do |atag|
    puts atag.map{ |link, content| puts "#{link}=\"#{content}\"" }
  end
end


