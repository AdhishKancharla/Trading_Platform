import json
import requests
import pandas as pd

class UpstoxTrader:
  def __init__(self, name, access_token):
    self.name = name
    self.__access_token = access_token

  def get_access_token(self):
    return self.__access_token
  
  def get_positions(self):
    url = "https://api.upstox.com/v2/portfolio/short-term-positions"
    payload = {}
    headers = {"Authorization": f"Bearer {self.__access_token}", 'Accept': 'application/json'}

    response = requests.request("GET", url, headers = headers, data = payload).json()
    try:
        return response['data']
    except:
        return "Error in script"

  def placeOrder(self, tradingSymbol, quantity, price, transaction_type, order_type, trigger_price):
    fileUrl = "https://assets.upstox.com/market-quote/instruments/exchange/complete.csv.gz"
    symboldf = pd.read_csv(fileUrl)
    symboldf['expiry'] = pd.to_datetime(symboldf['expiry']).apply(lambda x: x.date())
    instrument_token = symboldf[symboldf['tradingsymbol'] == tradingSymbol]['instrument_key'].iloc[0]
    
    url = "https://api-hft.upstox.com/v2/order/place"

    payload = json.dumps({"quantity": str(quantity), "product": "D", "validity": "DAY", "price": str(price), "tag": "string",
      "instrument_token": instrument_token, "order_type": order_type, "transaction_type": transaction_type, "disclosed_quantity": 0,
      "trigger_price": trigger_price, "is_amo": False})
    
    headers = {'Authorization': f'Bearer {self.__access_token}', 'Content-Type': 'application/json', 'Accept': 'application/json'}

    return requests.request("POST", url, headers = headers, data = payload)