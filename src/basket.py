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
  
  def enterPutHedge(self, kotak_trader, upstox_trader, type):
    if type:
      kotak_trader.placeOrder(exchangeSegment=self.exchangeSegment,price="0",quantity=self.quantity,
                              tradingSymbol=f"{self.index}{self.expiry}{self.putHedge}PE", transactionType="B",orderType="MKT")
    else:
      upstox_trader.placeOrder(tradingSymbol=f"{self.index}{self.expiry}{self.putHedge}PE",quantity=self.quantity,
                               price=0, transaction_type="BUY", order_type="MARKET", trigger_price=0, is_amo=False)
      
  def enterPutMain(self, kotak_trader, upstox_trader, type):
    if type:
      kotak_trader.placeOrder(exchangeSegment=self.exchangeSegment, price="0", quantity=self.quantity,
                            tradingSymbol=f"{self.index}{self.expiry}{self.putStrike}PE", transactionType="S", orderType="MKT")
    else:
      upstox_trader.placeOrder(tradingSymbol=f"{self.index}{self.expiry}{self.putStrike}PE", quantity=self.quantity,
                             price=0, transaction_type="SELL", order_type="MARKET", trigger_price=0, is_amo=False)

  def enterCallHedge(self, kotak_trader, upstox_trader, type):
    if type:
      kotak_trader.placeOrder(exchangeSegment=self.exchangeSegment, price="0", quantity=self.quantity,
                              tradingSymbol=f"{self.index}{self.expiry}{self.callHedge}CE", transactionType="B", orderType="MKT")
    else:
      upstox_trader.placeOrder(tradingSymbol=f"{self.index}{self.expiry}{self.callHedge}CE", quantity=self.quantity,
                               price=0, transaction_type="BUY", order_type="MARKET", trigger_price=0, is_amo=False)

  def enterCallMain(self, kotak_trader, upstox_trader, type):
    if type:
      kotak_trader.placeOrder(exchangeSegment=self.exchangeSegment, price="0", quantity=self.quantity,
                              tradingSymbol=f"{self.index}{self.expiry}{self.callStrike}CE", transactionType="S", orderType="MKT")
    else:
      upstox_trader.placeOrder(tradingSymbol=f"{self.index}{self.expiry}{self.callStrike}CE", quantity=self.quantity,
                               price=0, transaction_type="SELL", order_type="MARKET", trigger_price=0, is_amo=False)
  
  def exitPutHedge(self, kotak_trader, upstox_trader, type):
    if type:
      kotak_trader.placeOrder(exchangeSegment=self.exchangeSegment, price="0", quantity=self.quantity,
                              tradingSymbol=f"{self.index}{self.expiry}{self.putHedge}PE", transactionType="S", orderType="MKT")
    else:
      upstox_trader.placeOrder(tradingSymbol=f"{self.index}{self.expiry}{self.putHedge}PE", quantity=self.quantity,
                               price=0, transaction_type="SELL", order_type="MARKET", trigger_price=0, is_amo=False)
  
  def exitPutMain(self, kotak_trader, upstox_trader, type):
    if type:
      kotak_trader.placeOrder(exchangeSegment=self.exchangeSegment, price="0", quantity=self.quantity,
                              tradingSymbol=f"{self.index}{self.expiry}{self.putStrike}PE", transactionType="B", orderType="MKT")
    else:
      upstox_trader.placeOrder(tradingSymbol=f"{self.index}{self.expiry}{self.putStrike}PE", quantity=self.quantity,
                               price=0, transaction_type="BUY", order_type="MARKET", trigger_price=0, is_amo=False)
  
  def exitCallHedge(self, kotak_trader, upstox_trader, type):
    if type:
      kotak_trader.placeOrder(exchangeSegment=self.exchangeSegment, price="0", quantity=self.quantity,
                              tradingSymbol=f"{self.index}{self.expiry}{self.callHedge}CE", transactionType="S", orderType="MKT")
    else:
      upstox_trader.placeOrder(tradingSymbol=f"{self.index}{self.expiry}{self.callHedge}CE", quantity=self.quantity,
                               price=0, transaction_type="SELL", order_type="MARKET", trigger_price=0, is_amo=False)
  
  def exitCallMain(self, kotak_trader, upstox_trader, type):
    if type:
      kotak_trader.placeOrder(exchangeSegment=self.exchangeSegment, price="0", quantity=self.quantity,
                              tradingSymbol=f"{self.index}{self.expiry}{self.callStrike}CE", transactionType="B", orderType="MKT")
    else:
      upstox_trader.placeOrder(tradingSymbol=f"{self.index}{self.expiry}{self.callStrike}CE", quantity=self.quantity,
                               price=0, transaction_type="BUY", order_type="MARKET", trigger_price=0, is_amo=False)