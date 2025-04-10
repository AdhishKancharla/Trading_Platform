from flask import Flask, request, jsonify
from flask_cors import CORS
from KotakTrader import KotakTrader
from UpstoxTrader import UpstoxTrader

app = Flask(__name__)
CORS(app)

kotak_traders = []
upstox_traders = []

def getTrader(name, trader_type):
    if trader_type == "kotak":
        for trader in kotak_traders:
            if trader.name == name:
                return trader
        return None
    elif trader_type == "upstox":
        for trader in upstox_traders:
            if trader.name == name:
                return trader
        return None
    else:
        return None

# API to add a new account
@app.route("/add-account", methods = ["POST"])
def add_account():
    try:
        data = request.get_json(silent = True)

        name = data.get('name')
        trader_type = data.get('traderType')

        if trader_type not in ["kotak", "upstox"]:
            return jsonify({"error": "Invalid trader type"}), 400
        if trader_type == "kotak":
          try:
            consumer_key = data.get('consumerKey')
            secret_key = data.get('secretKey')
            neo_fin_key = data.get('neoFinKey')
          
            kotak_trader = KotakTrader(name, consumer_key, secret_key, neo_fin_key)
            kotak_traders.append(kotak_trader)
            return jsonify({"message": "Kotak Account added successfully"}), 200
          except Exception as e:
            return jsonify({"error": "Invalid Kotak account details"}), 500
        else:
          try:
            access_token = data.get('accessToken')
            upstox_trader = UpstoxTrader(name, access_token)
            upstox_traders.append(upstox_trader)
            return jsonify({"message": "Upstox Account added successfully"}), 200
          except Exception as e:
            return jsonify({"error": "Invalid Upstox account details"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API to login to an account
@app.route("/login", methods = ["POST"])
def login():
    try:
        data = request.get_json(silent = True)
        name = data.get('name')
        pan = data.get('pan')
        password = data.get('password')
        trader = getTrader(name, "kotak")
        if trader:
            trader.login(pan, password)
            return jsonify({"message": "Enter the OTP"}), 200
        else:
            return jsonify({"error": "Kotak Account not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API to authenticate the user
@app.route("/authenticate", methods = ["POST"])
def authenticate():
    try:
        data = request.get_json(silent = True)
        name = data.get('name')
        otp = data.get('otp')
        trader = getTrader(name, "kotak")
        if trader:
            trader.authenticate(otp)
            return jsonify({"message": "Authenticated successfully"}), 200
        else:
            return jsonify({"error": "Account not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API to fetch existing positions
@app.route("/get-positions", methods = ["POST"])
def get_positions():
    try:
        data = request.get_json(silent = True)
        trader_type = data.get('traderType')
        if trader_type not in ["kotak", "upstox"]:
            return jsonify({"error": "Invalid trader type"}), 400
        if trader_type == "kotak":
            name = data.get('name')
            trader = getTrader(name, "kotak")
            if trader:
                positions = trader.getPositions()
                return jsonify(positions), 200
            else:
                return jsonify({"error": "Kotak Account not found"}), 404
        else:
            name = data.get('name')
            trader = getTrader(name, "upstox")
            if trader:
                positions = trader.get_positions()
                return jsonify(positions), 200
            else:
                return jsonify({"error": "Upstox Account not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API to get account details
@app.route("/get-account-details", methods = ["POST"])
def get_account_details():
    try:
        data = request.get_json(silent = True)
        name = data.get('name')
        trader_type = data.get('traderType')
        if trader_type not in ["kotak", "upstox"]:
            return jsonify({"error": "Invalid trader type"}), 400
        if trader_type == "kotak":            
          trader = getTrader(name, "kotak")
          if trader:
              pan = trader.getPAN()
              password = trader.getPassword()
              return jsonify({"pan": pan, "password": password}), 200
          else:
              return jsonify({"error": "Kotak Account not found"}), 404
        else:
          trader = getTrader(name, "upstox")
          if trader:
              access_token = trader.get_access_token()
              return jsonify({"access_token": access_token}), 200
          else:
              return jsonify({"error": "Upstox Account not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API to get all accounts
@app.route("/get-all-accounts", methods = ["POST"])
def get_all_accounts():
    try:
        accounts = []
        for trader in kotak_traders:
            accounts.append({"name": trader.name, "traderType": "kotak"})
        for trader in upstox_traders:
            accounts.append({"name": trader.name, "traderType": "upstox"})
        return jsonify({"accounts": accounts}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/place-order", methods = ["POST"])
def place_order():
    try:
        data = request.get_json(silent = True)

        name = data.get('name')
        exchangeSegment = data.get('exchangeSegment')
        index = data.get('index')
        strike = data.get('strike')
        option = data.get('option')
        expiry = data.get('expiry')

        tradingsymbol = index + expiry + strike + option
        
        quantity = str(data.get('quantity'))
        price = str(data.get('price'))
        transaction_type = data.get('transactionType')
        order_type = data.get('orderType')
        trigger_price = str(data.get('triggerPrice'))
        amo = str(data.get('amo'))

        if not name:
            return jsonify({"error": "Name is required"}), 400
        if not exchangeSegment:
            return jsonify({"error": "Exchange segment is required"}), 400
        if not index:
            return jsonify({"error": "Index is required"}), 400
        if not strike:
            return jsonify({"error": "Strike is required"}), 400
        if not option:
            return jsonify({"error": "Option is required"}), 400
        if not expiry:
            return jsonify({"error": "Expiry is required"}), 400
        if not quantity:
            return jsonify({"error": "Quantity is required"}), 400
        if not price:
            return jsonify({"error": "Price is required"}), 400
        if not transaction_type:
            return jsonify({"error": "Transaction type is required"}), 400
        if not order_type:
            return jsonify({"error": "Order type is required"}), 400
        if not amo:
            return jsonify({"error": "AMO is required"}), 400

        if order_type == "SL" or order_type == "SL-M":
            if not trigger_price:
                return jsonify({"error": "Trigger price is required for SL and SL-M order types"}), 400
        else:
            trigger_price = "0"

        trader_kotak = getTrader(name, "kotak")
        trader_upstox = getTrader(name, "upstox")
        
        if trader_kotak:
            if exchangeSegment == "BSE":
                exchangeSegment = "bse_fo"
            elif exchangeSegment == "NSE":
                exchangeSegment = "nse_fo"
            if order_type == "LIMIT":
                order_type = "L"
            elif order_type == "MARKET":
                order_type = "MKT"
            if transaction_type == "BUY":
                transaction_type = "B"
            elif transaction_type == "SELL":
                transaction_type = "S"
            else:
                return jsonify({"error": "Invalid transaction type"}), 400
            
            print("Trying to place order")

            try:
                message = trader_kotak.placeOrder(exchangeSegment = exchangeSegment, price = price, quantity = quantity, tradingSymbol = tradingsymbol, 
                                                  transactionType = transaction_type, orderType = order_type, triggerPrice = trigger_price, amo = amo)
                print("Message from kotak: ", message)
                if message['stCode'] == 200:
                    return jsonify({"message": "Order placed successfully"}), 200
                else:
                    return jsonify({"error": "Failed to place kotak order"}), 500
            except Exception as e:
                return jsonify({"error": "Exception while placing kotak order"}), 500
        
        if trader_upstox:
            if transaction_type == "B" or transaction_type == "BUY":
                transaction_type = "BUY"
            else:
                transaction_type = "SELL"
            if amo == "YES":
                is_amo = True
            else:
                is_amo = False
            if trader_upstox.placeOrder(tradingsymbol, quantity, price, transaction_type, order_type, trigger_price, is_amo):
                return jsonify({"message": "Order placed successfully"}), 200
            else:
                return jsonify({"error": "Failed to place upstox order"}), 500
        return jsonify({"error": "Trader not found"}), 404
    except Exception as e:
        return jsonify({"Invalid order placing": str(e)}), 500
@app.route("/modify-order", methods = ["POST"])
def modify_order():
    try:
        data = request.get_json(silent = True)
        name = data.get('name')
        order_id = data.get('orderId')
        new_price = str(data.get('newPrice'))
        new_quantity = str(data.get('newQuantity'))
        transaction_type = data.get('transactionType')
        order_type = data.get('orderType')
        trigger_price = data.get('triggerPrice')

        if not name:
            return jsonify({"error": "Name is required"}), 400
        if not order_id:
            return jsonify({"error": "Order ID is required"}), 400
        if not new_price:
            return jsonify({"error": "New price is required"}), 400
        if not new_quantity:
            return jsonify({"error": "New quantity is required"}), 400
        if not transaction_type:
            return jsonify({"error": "Transaction type is required"}), 400
        if not order_type:
            return jsonify({"error": "Order type is required"}), 400
        if order_type == "SL" or order_type == "SL-M":
            if not trigger_price:
                return jsonify({"error": "Trigger price is required for SL and SL-M order types"}), 400
        else:
            trigger_price = "0"

        trader_kotak = getTrader(name, "kotak")

        if trader_kotak:
            print("Trying to modify order")
            try:
                message = trader_kotak.client.modify_order(quantity = new_quantity, price = new_price, order_id = order_id, 
                                                           order_type = order_type, transaction_type = transaction_type, validity = "DAY", trigger_price = trigger_price)
                print("Message from kotak: ", message)
                if message['stCode'] == 200:
                    return jsonify({"message": "Order modified successfully"}), 200
                else:
                    return jsonify({"error": "Failed to modify kotak order"}), 500
            except Exception as e:
                return jsonify({"error": "Exception while modifying kotak order"}), 500
        else:
            return jsonify({"error": "Kotak Trader not found"}), 404
    except Exception as e:
        return jsonify({"Invalid order modifying": str(e)}), 500
@app.route("/cancel-order", methods = ["POST"])
def cancel_order():
    try:
        data = request.get_json(silent = True)
        name = data.get('name')
        order_id = data.get('orderId')

        if not name:
            return jsonify({"error": "Name is required"}), 400
        if not order_id:
            return jsonify({"error": "Order ID is required"}), 400

        trader_kotak = getTrader(name, "kotak")
        
        if trader_kotak:
            if trader_kotak.client.cancel_order(order_id = order_id):
                return jsonify({"message": "Order cancelled successfully"}), 200
            else:
                return jsonify({"error": "Failed to cancel order"}), 500
        else:
            return jsonify({"error": "Kotak Trader not found"}), 404
    except Exception as e:
        return jsonify({"Invalid order cancelling": str(e)}), 500
@app.route("/get-open-orders", methods = ["POST"])
def get_open_orders():
    try:
        data = request.get_json(silent = True)
        name = data.get('name')
        trader = getTrader(name, "kotak")
        if trader:
            orders = trader.getOpenOrders()
            return jsonify(orders), 200
        else:
            return jsonify({"error": "Kotak Account not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route("/post-ironfly", methods = ["POST"])
def ironfly():
    try:
        data = request.get_json(silent = True)
        name = data.get('name')
        index = data.get('index')
        expiry = data.get('expiry')
        strike = data.get('strike')
        away = data.get('away')
        quantity = str(data.get('quantity'))
        amo = str(data.get('amo'))
        enter = data.get('enter')

        if not name:
            return jsonify({"error": "Name is required"}), 400
        if not index:
            return jsonify({"error": "Index is required"}), 400
        if not expiry:
            return jsonify({"error": "Expiry is required"}), 400
        if not strike:
            return jsonify({"error": "Strike is required"}), 400
        if not away:
            return jsonify({"error": "Away is required"}), 400
        if not amo:
            return jsonify({"error": "AMO is required"}), 400
        if not quantity:
            return jsonify({"error": "Quantity is required"}), 400
        if not enter:
            return jsonify({"error": "Enter is required"}), 400

        trader_kotak = getTrader(name, "kotak")
        
        if trader_kotak:
            exchangeSegment = "nse_fo"
            
            if index == "SENSEX":
                exchangeSegment = "bse_fo"
            transactionType = "B"
            
            if enter == "YES":
                transactionType = "S"
            
            trader_kotak.placeOrder(exchangeSegment = exchangeSegment, price = "0", quantity = quantity, tradingSymbol = index + expiry + strike + "PE",
                                    transactionType = transactionType, orderType = "MKT", amo = amo)
            
            trader_kotak.placeOrder(exchangeSegment = exchangeSegment, price = "0", quantity = quantity, tradingSymbol = index + expiry + strike + "CE",
                                    transactionType = transactionType, orderType = "MKT", amo = amo)
            
            if transactionType == "B":
                transactionType = "S"
            else:
                transactionType = "B"
            
            trader_kotak.placeOrder(exchangeSegment = exchangeSegment, price = "0", quantity = quantity, 
                                    tradingSymbol = index + expiry + str(int(strike) - int(away)) + "PE", transactionType = transactionType,
                                      orderType = "MKT", amo = amo)

            trader_kotak.placeOrder(exchangeSegment = exchangeSegment, price = "0", quantity = quantity, 
                                    tradingSymbol = index + expiry + str(int(strike) + int(away)) + "CE", transactionType = transactionType,
                                      orderType = "MKT", amo = amo)

        trader_upstox = getTrader(name, "upstox")

        if trader_upstox:
            transactionType = "BUY"
            if enter == "YES":
                transactionType = "SELL"
            
            trader_upstox.placeOrder(index + expiry + strike + "PE", quantity, "0", transactionType, "MKT", "0", is_amo = amo)
            trader_upstox.placeOrder(index + expiry + strike + "CE", quantity, "0", transactionType, "MKT", "0", is_amo = amo)
            
            if transactionType == "BUY":
                transactionType = "SELL"
            else:
                transactionType = "BUY"

            is_amo = True
            if amo == "NO":
                is_amo = False
            
            trader_upstox.placeOrder(index + expiry + str(int(strike) - int(away)) + "PE", quantity, "0", transactionType, "MKT", "0", is_amo = is_amo)
            trader_upstox.placeOrder(index + expiry + str(int(strike) + int(away)) + "CE", quantity, "0", transactionType, "MKT", "0", is_amo = is_amo)

        return jsonify({"message": "Ironfly placed successfully"}), 200
        
    except Exception as e:
        return jsonify({"Invalid order placing": str(e)}), 500

if __name__ == "__main__":
    app.run(debug = False, port = 5000)