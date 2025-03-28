import React, { useState } from "react";

const TradeForm = ({ onSubmit }) => {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [orderType, setOrderType] = useState("BUY");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ symbol, quantity, orderType, price });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <input type="text" placeholder="Stock Symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} className="mb-2 p-2 border rounded w-full" />
      <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="mb-2 p-2 border rounded w-full" />
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="mb-2 p-2 border rounded w-full" />
      <select value={orderType} onChange={(e) => setOrderType(e.target.value)} className="mb-4 p-2 border rounded w-full">
        <option value="BUY">Buy</option>
        <option value="SELL">Sell</option>
      </select>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded w-full">Place Order</button>
    </form>
  );
};

export default TradeForm;
