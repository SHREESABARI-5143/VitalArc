import urllib.request
import urllib.error
import json

data = json.dumps({'question': 'test', 'diagnosis': 'Normal', 'confidence': 99, 'recommendation': 'None'}).encode('utf-8')
req = urllib.request.Request('http://localhost:5001/api/ask-llm', data=data, headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as response:
        print("SUCCESS:", response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("ERROR:", e.read().decode('utf-8'))
