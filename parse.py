import urllib.request
import re

url = "https://carta-natal.es/carta.php"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8', 'ignore')

forms = re.findall(r'<form.*?</form>', html, re.DOTALL | re.IGNORECASE)
for i, f in enumerate(forms):
    print(f"FORM {i}:")
    for inp in re.findall(r'<(input|select)[^>]+name=[\'"]([^\'"]+)[\'"][^>]*>', f, re.IGNORECASE):
        print(inp[0], inp[1])
