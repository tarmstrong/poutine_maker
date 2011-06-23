#!/usr/bin/env bash

part=$1
echo $1
cat head.html > $part.html
markdown $part.md >> $part.html
sed -i 's|=&gt;|=>|g' $part.html
sed -i 's|&amp;|\&|g' $part.html
cat $part.html | perl -pe 's|(<h.>.*?)<code>(.*?)</code>|\1\2|' > $part.html.bk1
cat $part.html.bk1 | perl -pe 's|<code>(.*?)</code>|<span style='\''font-family:"Courier New","DejaVu Sans Mono", monospace'\''>\1</span>|g' > $part.html.bk2
cat $part.html.bk2 | sed 's|code>|code>\n|g' > $part.html
