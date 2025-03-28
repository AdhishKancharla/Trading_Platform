import sys
import requests
import json
import pandas as pd

def place_order(quantity, price, instrument_token, transaction_type, order_type, trigger_price):
  url = "https://api-hft.upstox.com/v2/order/place"

  payload = json.dumps({
    "quantity": str(quantity),
    "product": "D",
    "validity": "DAY",
    "price": str(price),
    "tag": "string",
    "instrument_token": instrument_token,
    "order_type": order_type,
    "transaction_type": transaction_type,
    "disclosed_quantity": 0,
    "trigger_price": trigger_price,
    "is_amo": False
  })
  headers = {
      'Authorization': f'Bearer {access_token}',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
  }

  return requests.request("POST", url, headers = headers, data = payload)

if __name__ == "__main__":
    try:
        access_token = sys.argv[1]
        tradingsymbol = sys.argv[2]
        quantity = sys.argv[3]
        price = sys.argv[4]
        transaction_type = sys.argv[5]
        order_type = sys.argv[6]
        trigger_price = sys.argv[7]
        
        fileUrl = "https://assets.upstox.com/market-quote/instruments/exchange/complete.csv.gz"
        symboldf = pd.read_csv(fileUrl)
        symboldf['expiry'] = pd.to_datetime(symboldf['expiry']).apply(lambda x: x.date())
        instrument_token = symboldf[symboldf['tradingsymbol'] == tradingsymbol]['instrument_key'].iloc[0]

        trade_result = place_order(quantity, price, instrument_token, transaction_type, order_type, trigger_price)
        
    except:
        print("Usage: python trade_script.py access_token tradingsymbol quantity price instrument_token transaction_type order_type trigger_price")