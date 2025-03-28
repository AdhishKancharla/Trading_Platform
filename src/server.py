from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import json

app = Flask(__name__)
CORS(app)

# API to fetch existing positions
@app.route("/get-positions", methods = ["POST"])
def get_positions():
    try:
        data = request.get_json(silent = True)

        access_token = data.get('accessToken')

        print("Received Access Token:", access_token)

        if not access_token:
            return jsonify({"error": "Access token is required"}), 400

        result = subprocess.run(["python", "positions_script.py", access_token], capture_output = True, text = True)
        positions = json.loads(result.stdout)
        
        return jsonify(positions)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/place-order", methods = ["POST"])
def place_order():
    try:
        data = request.get_json(silent = True)

        access_token = data.get('accessToken')
        tradingsymbol = data.get('tradingsymbol')
        quantity = str(data.get('quantity'))
        price = str(data.get('price'))
        transaction_type = data.get('transactionType')
        order_type = data.get('orderType')
        trigger_price = str(data.get('triggerPrice'))

        if not access_token:
            return jsonify({"error": "Access token is required"}), 400
        if not tradingsymbol:
            return jsonify({"error": "Tradingsymbol is required"}), 400
        if not quantity:
            return jsonify({"error": "Quantity is required"}), 400
        if not price:
            return jsonify({"error": "Price is required"}), 400
        if not transaction_type:
            return jsonify({"error": "Transaction type is required"}), 400
        if not order_type:
            return jsonify({"error": "Order type is required"}), 400

        if order_type == "SL" or order_type == "SL-M":
            if not trigger_price:
                return jsonify({"error": "Trigger price is required for SL and SL-M order types"}), 400

        result = subprocess.run(["python", "trade_script.py", access_token, tradingsymbol, quantity, price, transaction_type, order_type, trigger_price], capture_output = True, text = True)

        return jsonify({"message": "Order placed successfully"})
    except Exception as e:
        return jsonify({"THE ERROR HERE ISSSS ": str(e)}), 500

if __name__ == "__main__":
    app.run(debug = True, port = 5000)