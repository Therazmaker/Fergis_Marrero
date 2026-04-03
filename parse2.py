import re

with open('carta.html', 'r', encoding='utf-16le') as f:
    html = f.read()

match = re.search(r'<select[^>]*name=[\'"]Pais[\'"][^>]*>(.*?)</select>', html, re.IGNORECASE | re.DOTALL)
if match:
    options_html = match.group(1)
    # Output to utf8 file
    with open('pais.txt', 'w', encoding='utf-8') as out:
        out.write(options_html)
    print("Done")
else:
    print("Not found")
