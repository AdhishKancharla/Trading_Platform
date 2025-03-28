import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Trade = () => {
  const [tradingsymbol, setTradingsymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [instrumentToken, setInstrumentToken] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [orderType, setOrderType] = useState("");
  const [triggerPrice, setTriggerPrice] = useState("");
  const [orderMessage, setOrderMessage] = useState("");

  const accessToken = localStorage.getItem("accessToken");

  const handleTradeSubmit = (e) => {
    e.preventDefault();
    console.log("Trade submitted:", {
      tradingsymbol,
      quantity,
      price,
      instrumentToken,
      transactionType,
      orderType,
      triggerPrice,
    });
    axios
      .post("http://localhost:5000/place-order", {
        accessToken,
        tradingsymbol,
        quantity,
        price,
        instrumentToken,
        transactionType,
        orderType,
        // Include triggerPrice only when orderType is SL or SL-M.
        triggerPrice: (orderType === "SL" || orderType === "SL-M") ? triggerPrice : 0,
      })
      .then((response) => {
        console.log("Order response:", response.data);
        setOrderMessage("Order successfully placed!");
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        setOrderMessage("Error placing order. Please try again.");
      });
    // Clear input fields after submission
    setTradingsymbol("");
    setQuantity("");
    setPrice("");
    setInstrumentToken("");
    setTransactionType("");
    setOrderType("");
    setTriggerPrice("");
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">Trade Page</h1>

      {/* Link back to Home */}
      <div className="mb-4">
        <Link to="/" className="p-2 bg-blue-500 text-white rounded">
          Go to Home
        </Link>
      </div>

      {/* Trade Parameters Form */}
      <form onSubmit={handleTradeSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Trading Symbol:</label>
          <input
            type="text"
            value={tradingsymbol}
            onChange={(e) => setTradingsymbol(e.target.value)}
            className="p-2 border rounded w-full"
            placeholder="Enter trading symbol"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="p-2 border rounded w-full"
            placeholder="Enter quantity"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Price:</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="p-2 border rounded w-full"
            placeholder="Enter price"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Transaction Type:</label>
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="p-2 border rounded w-full"
            required
          >
            <option value="">Select transaction type</option>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Order Type:</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="p-2 border rounded w-full"
            required
          >
            <option value="">Select order type</option>
            <option value="LIMIT">LIMIT</option>
            <option value="SL">SL</option>
            <option value="SL-M">SL-M</option>
          </select>
        </div>
        {(orderType === "SL" || orderType === "SL-M") && (
          <div>
            <label className="block mb-1 font-semibold">Trigger Price:</label>
            <input
              type="number"
              step="0.01"
              value={triggerPrice}
              onChange={(e) => setTriggerPrice(e.target.value)}
              className="p-2 border rounded w-full"
              placeholder="Enter trigger price"
              required
            />
          </div>
        )}
        <button type="submit" className="p-2 bg-green-500 text-white rounded">
          Submit Trade
        </button>
      </form>
      {orderMessage && (
        <div className="mt-4 p-2 bg-gray-200 rounded">
          {orderMessage}
        </div>
      )}
    </div>
  );
};

export default Trade;