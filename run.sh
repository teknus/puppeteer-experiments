for i in "$*"
do
   node tt_scrappy.js $i
   echo "parsing..."
   ruby parser.rb $i
    echo "Parsed"
done