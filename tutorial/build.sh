#!/usr/bin/env bash

cat head.html > part1.html
markdown part1.md >> part1.html
sed -i 's|=&gt;|=>|g' part1.html
sed -i 's|&amp;|\&|g' part1.html
cat part1.html | perl -pe 's|(<h.>.*?)<code>(.*?)</code>|\1\2|' > part1.html.bk1
cat part1.html.bk1 | perl -pe 's|<code>(.*?)</code>|<span style='\''font-family:"Courier New","DejaVu Sans Mono", monospace'\''>\1</span>|g' > part1.html.bk2
cat part1.html.bk2 | sed 's|code>|code>\n|g' > part1.html
