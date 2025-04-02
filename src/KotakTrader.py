from neo_api_client import NeoAPI

class KotakTrader:
  """
  Initialise a trader object with the consumer key, the secret key and the neo-fin-key
  """

  def __init__(self, name, consumer_key, secret_key, neo_fin_key):
    self.name = name
    self.client = NeoAPI(consumer_key = consumer_key, consumer_secret = secret_key, environment = 'prod',
                access_token = None, neo_fin_key = neo_fin_key)

  """
  Login to the trader account using PAN number and password
  """

  def login(self, pan, password):
    self.__pan = pan
    self.__password = password
    self.details = self.client.login(pan = pan, password = password)

  """
  Enter the 2-factor authentification
  """

  def authenticate(self, otp):
    self.auth_details = self.client.session_2fa(OTP = otp)

  """
  Place an order
  Compulsory: exchange_segment, product, price, order_type, quantity, validity, trading_symbol, transaction_type
  Optional: amo, disclosed_quantity, market_protection, pf, trigger_price, tag

  Exchange-segments: nse_cm (NSE), base_cm (BSE), nse_fo (NFO), bse_fo (BFO), cde_fo (CDS), mcx_fo (MCX)
  Product: NRML (Normal), CNC (Cash and Carry), MIS (MIS), CO (Cover Order)
  Order-type: L (Limit), MKT (Market), SL (Stop loss limit), SL-M (Stop loss market)
  Validity: DAY, IOC, GTC, EOS

  """
  def placeOrder(self, exchangeSegment, price, quantity, tradingSymbol, transactionType = "S", product = "NRML", orderType = "L", validity = "DAY",
                  amo = "NO", disclosedQuantity = "0", marketProtection = "0", pf = "N", triggerPrice = "0", tag = None):
      try:
        return self.client.place_order(exchange_segment = exchangeSegment, product = product, price = price, order_type = orderType, quantity = quantity,
                                  validity = validity, trading_symbol = tradingSymbol, transaction_type = transactionType, amo = amo,
                                  disclosed_quantity = disclosedQuantity, market_protection = marketProtection, pf = pf, trigger_price = triggerPrice, tag = tag)
      except Exception as e:
        return "Exception when modifying order: "+ str(e)

  """
  Place a stop loss order
  """

  def placeStopLossOrder(self, exchangeSegment, price, quantity, tradingSymbol, transactionType = "S", product = "NRML", orderType = "L", validity = "DAY",
                 amoo = "NO", disclosedQuantity = "0", marketProtection = "0", pf = "N", triggerPrice = "0", tag = None):
    try:
      if orderType == "SL":
        triggerPrice = float(price) - 5.00
      return self.client.place_order(exchange_segment = exchangeSegment, product = product, price = price, order_type = orderType, quantity = quantity,
                                validity = validity, trading_symbol = tradingSymbol, transaction_type = transactionType, amo = amoo,
                                disclosed_quantity = disclosedQuantity, market_protection = marketProtection, pf = pf, trigger_price = triggerPrice, tag = tag)
    except Exception as e:
      return "Exception when modifying order: "+ str(e)

  """
  Cancels an order
  Compulsory: order_id
  Optional: isVerify
  """

  def cancelOrder(self, order_id, isVerify = False):
    try:
      return self.client.cancel_order(order_id, is_verify = isVerify)
    except Exception as e:
      return "Exception when modifying order: "+ str(e)

  """
  Modifies an order
  Compulsory: product, trading_symbol, transaction_type, order_type, quantity, order_id, price
  Optional: instrument_token, market_protection, dd, filled_quantity, validity, trigger_price, exchange_segment
  """

  def modifyOrder(self, tradingSymbol, quantity, orderId, price, product = "NRML", orderType = "L", instrumentToken = None, marketProtection = "0",
                  transactionType = "S", dd = "NA", filledQuantity = "0", validity = "DAY", triggerPrice = "0", exchangeSegment = "bse_cm"):
    try:
      return self.client.modify_order(instrument_token = instrumentToken, exchange_segment = exchangeSegment, product = product, price = price,
                                 order_type = orderType, quantity = quantity, validity = validity, trading_symbol = tradingSymbol, transaction_type = transactionType,
                                 order_id = orderId, trigger_price = triggerPrice, filled_quantity = filledQuantity, market_protection = marketProtection, dd = dd)
    except Exception as e:
      return "Exception when modifying order: "+ str(e)

  def getOrderReport(self):
    return self.client.order_report()

  def getOrderReport(self, orderId):
    return self.client.order_history(order_id = orderId)

  def getHoldings(self):
    return self.client.holdings()

  def getPositions(self):
    return self.client.positions()

  def getLimits(self):
    return self.client.limits()
  
  def getPAN(self):
    return self.__pan
  
  def getPassword(self):
    return self.__password

  """
  Logout from the account
  """

  def logout(self):
    self.client.logout()
