from flask import Flask, request, jsonify
from flask_cors import CORS
from KotakTrader import KotakTrader
from UpstoxTrader import UpstoxTrader
from basket import Basket

app = Flask(__name__)
CORS(app)

kotak_traders = []
upstox_traders = []
baskets = []
_next_basket_id = 1

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

        print(name)
        print(trader_type)

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

@app.route("/create-basket", methods=["POST"])
def create_basket():
    global _next_basket_id

    data = request.get_json(silent=True) or {}
    # Validate required fields
    required = ["index", "expiry", "putStrike", "callStrike", "putDistance", "callDistance", "quantity"]
    for field in required:
        if field not in data:
            return jsonify({"error": f"'{field}' is required"}), 400

    # Construct the Basket instance
    try:
        b = Basket(
            index       = data["index"],
            putStrike   = int(data["putStrike"]),
            callStrike  = int(data["callStrike"]),
            putDistance = int(data["putDistance"]),
            callDistance= int(data["callDistance"]),
            expiry      = data["expiry"],
            quantity    = int(data["quantity"]),
        )
    except Exception as e:
        return jsonify({"error": f"Invalid parameter: {e}"}), 400

    # Save it with a unique ID
    basket_entry = {
        "id":       _next_basket_id,
        "instance": b,
        "params":   {
            "index": data["index"],
            "expiry": data["expiry"],
            "putStrike": data["putStrike"],
            "callStrike": data["callStrike"],
            "putDistance": data["putDistance"],
            "callDistance": data["callDistance"],
            "quantity": data["quantity"]
        }
    }

    baskets.append(basket_entry)
    _next_basket_id += 1

    return jsonify({
        "message":  "Basket saved",
        "basketId": basket_entry["id"]
    }), 200


@app.route("/get-baskets", methods = ["POST"])
def get_baskets():
    simple = [
        { "id": e["id"], **e["params"] }
        for e in baskets
    ]
    return jsonify({ "baskets": simple }), 200

@app.route("/delete-basket", methods = ["POST"])
def delete_basket():
    data = request.get_json(silent=True) or {}
    bid = data.get("basketId")
    global baskets
    before = len(baskets)
    baskets = [b for b in baskets if b["id"] != bid]
    if len(baskets) == before:
        return jsonify({"error": "Basket not found"}), 404
    return jsonify({"message": "Basket deleted successfully"}), 200

@app.route("/update-basket", methods = ["POST"])
def update_basket():
    data = request.get_json(silent=True) or {}
    required = ["basketId", "index", "expiry", "putStrike", "callStrike", "putDistance", "callDistance", "quantity"]
    for field in required:
        if field not in data:
            return jsonify({"error": f"'{field}' is required"}), 400

    # Find the basket
    entry = next((e for e in baskets if e["id"] == data["basketId"]), None)
    if not entry:
        return jsonify({"error": "Basket not found"}), 404

    # update params
    params = entry["params"]
    for key in required:
        if key != "basketId":
            params[key] = data[key]

    # re-instantiate the Basket instance with updated params
    entry["instance"] = Basket(
        index       = params["index"],
        putStrike   = int(params["putStrike"]),
        callStrike  = int(params["callStrike"]),
        putDistance = int(params["putDistance"]),
        callDistance= int(params["callDistance"]),
        expiry      = params["expiry"],
        quantity    = int(params["quantity"])
    )

    return jsonify({"message": "Basket updated"}), 200

@app.route("/execute-basket", methods = ["POST"])
def execute_basket():
    data = request.get_json(silent=True) or {}
    bid      = data.get("basketId")
    names    = data.get("accounts", [])
    conf     = data.get("confirmations", {})

    # Find the basket
    entry = next((e for e in baskets if e["id"] == bid), None)
    if not entry:
        return jsonify({"error": "Basket not found"}), 404
    basket: Basket = entry["instance"]

    # Look up traders
    kotaks   = [getTrader(n, "kotak")   for n in names]
    upstoxes = [getTrader(n, "upstox") for n in names]
    kotaks   = [t for t in kotaks   if t]
    upstoxes = [t for t in upstoxes if t]

    executed = []

    # Helper to execute a single leg
    def do_leg(symbol, txn):
        # Kotak
        for t in kotaks:
            t.placeOrder(exchangeSegment=basket.exchangeSegment,price="0",quantity=basket.quantity,tradingSymbol=symbol,
             transactionType=txn,orderType="MKT")
            executed.append(f"Kotak {symbol} {txn}")

        # Upstox
        for t in upstoxes:
            t.placeOrder(tradingSymbol=symbol,quantity=basket.quantity,price=0,transaction_type="BUY" if txn=="B" else "SELL",
            order_type="MARKET",trigger_price=0,is_amo=False)
            executed.append(f"Upstox {symbol} {txn}")

    ph = f"{basket.index}{basket.expiry}{basket.putHedge}PE"
    pm = f"{basket.index}{basket.expiry}{basket.putStrike}PE"
    ch = f"{basket.index}{basket.expiry}{basket.callHedge}CE"
    cm = f"{basket.index}{basket.expiry}{basket.callStrike}CE"

    try:
        if conf.get("putHedge"):  do_leg(ph, "B")
        if conf.get("putMain"):   do_leg(pm, "S")
        if conf.get("callHedge"): do_leg(ch, "B")
        if conf.get("callMain"):  do_leg(cm, "S")
        return jsonify({"executed": executed}), 200

    except Exception as e:
        return jsonify({"error": f"Execution failed: {e}"}), 500

if __name__ == "__main__":
    app.run(debug = False, port = 5000)