import requests

url = "https://cs536.escglobal.co/v1/message/all"

payload={}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)