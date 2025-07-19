import pandas as pd
from KotakTrader import KotakTrader
from UpstoxTrader import UpstoxTrader

class Basket:
  symboldf = pd.read_csv("https://assets.upstox.com/market-quote/instruments/exchange/complete.csv.gz")
  symboldf['expiry'] = pd.to_datetime(symboldf['expiry']).apply(lambda x: x.date())

  def __init__(self, index, putStrike, callStrike, putDistance, callDistance, expiry, quantity):
    self.index = index
    self.putStrike = str(putStrike)
    self.callStrike = str(callStrike)
    self.putHedge = str(putStrike - putDistance)
    self.callHedge = str(callStrike + callDistance)
    self.expiry = expiry
    self.quantity = quantity
    self.exchangeSegment = "nse_fo"
    if self.index == "SENSEX":
      self.exchangeSegment = "bse_fo"