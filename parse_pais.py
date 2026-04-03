import re
with open('carta.html', 'r', encoding='utf-16le') as f:
    html = f.read()

match = re.search(r'<select[^>]*name=[\'"]Pais[\'"][^>]*>.*?</select>', html, re.IGNORECASE | re.DOTALL)
if match:
    print(match.group(0))
else:
    print("Not found")
