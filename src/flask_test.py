import requests

url = "https://super-sincerely-buffalo.ngrok-free.app/"
data_kotak_init = {
    "name": "padma",
    "traderType": "kotak",
    "consumerKey": "PJoxjCrpnnj446Aw1hQ2IM4Tdv4a",
    "secretKey": "EyJEETHe3NtSAs_AmZ6JF27k60oa",
    "neoFinKey": "neotradeapi"
}
data_upstox_init = {
    "name": "prasad",
    "traderType": "upstox",
    "accessToken": "eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiI1UEFQN1YiLCJqdGkiOiI2N2U3Mzg4ZDdhNzU4NDE1YzBjNzMyMTkiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaWF0IjoxNzQzMjA2NTQxLCJpc3MiOiJ1ZGFwaS1nYXRld2F5LXNlcnZpY2UiLCJleHAiOjE3NDMyODU2MDB9.54-wl-DdftMu1pk9oHqOymaY8Qp1pmcTUNV9piWQLHI"
}
data_kotak_login = {
    "name": "padma",
    "pan": "ACGPK7786H",
    "password": "Trade1234$"
}
data_kotak_authenticate = {
    "name": "padma",
    "traderType": "kotak",
    "otp": "4636"
}
data_get_kotak_details = {
    "name": "padma",
    "traderType": "kotak"
}
data_get_upstox_details = {
    "name": "prasad",
    "traderType": "upstox"
}
data_get_kotak_positions = {
    "name": "padma",
    "traderType": "kotak"
}
data_get_upstox_positions = {
    "name": "prasad",
    "traderType": "upstox"
}
data_place_order = {
    "name": "padma",
    "exchangeSegment": "bse_fo",
    "index": "SENSEX",
    "strike": "81000",
    "expiry": "25722",
    "option": "PE",
    "quantity": 200,
    "price": 48,
    "transactionType": "BUY",
    "orderType": "LIMIT",
    "triggerPrice": 0,
    "amo": "NO"
}
data_create_basket = {
    "index": "NIFTY",
    "putStrike": 25400,
    "callStrike": 26000,
    "putDistance": 100,
    "callDistance": 200,
    "expiry": "2023-10-26",
    "quantity": 75
}
data_get_basket = {}
data_execute_basket = {
    "basketId": "1",
    "accounts": ["padma", "prasad"],
    "side": "enterBoth", #OR exitBoth
}

#response = requests.post(url + "create-basket", json = data_create_basket).json()
#print(response)

#response = requests.get(url + "get-baskets", json = data_get_basket).json()
#print(response)

#response = requests.post(url + "execute-basket", json = data_execute_basket).json()
#print(response)

#response = requests.post(url + "add-account", json = data_upstox_init).json()
#print(response)
#response = requests.post(url + "get-account-details", json = data_get_upstox_details).json()
#print(response)
#response = requests.get(url + "get-positions", json = data_get_upstox_positions).json()
#print(response)

#response = requests.post(url + "get-all-accounts").json()
#print(response['accounts'])

#response = requests.post(url + "place-order", json = data_place_order).json()
#print(response)

#response = requests.post(url + "add-account", json = data_kotak_init).json()
#print(response)
#response = requests.post(url + "login", json = data_kotak_login).json()
#print(response)
#response = requests.post(url + "authenticate", json = data_kotak_authenticate).json()
#print(response)
#response = requests.post(url + "get-account-details", json = data_get_kotak_details).json()
#print(response)
#response = requests.post(url + "get-positions", json = data_get_kotak_positions).json()
#print(response)
#data_place_order['name'] = "padma"
response = requests.post(url + "place-order", json = data_place_order).json()
print(response)