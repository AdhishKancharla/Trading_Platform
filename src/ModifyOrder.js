import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ModifyOrder = () => {
  const [order_id, setOrderId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [orderType, setOrderType] = useState("");
  const [triggerPrice, setTriggerPrice] = useState("");
  const [afterMarketOrder, setAfterMarketOrder] = useState(false);
  const [message, setMessage] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);

  useEffect(() => {
    fetchAccounts();
  }
  , []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.post("https://super-sincerely-buffalo.ngrok-free.app/get-all-accounts");
      setAccounts(response.data.accounts);
      console.log("Accounts fetched:", response.data.accounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const handleAccountSelection = (account) => {
    setSelectedAccounts((prev) =>
      prev.includes(account) ? prev.filter((a) => a !== account) : [...prev, account]
    );
  };

  const handleTradeModify = async (e) => {
    e.preventDefault();
    for (const trader of selectedAccounts) {
      try{
        if (!(orderType === "SL" || orderType === "SL-M")){
          setTriggerPrice("0");
        }
        console.log("Modifying order for ", trader.name);
        console.log("Order ID: ", order_id);
        console.log("Quantity: ", quantity);
        console.log("Price: ", price);
        console.log("Transaction Type: ", transactionType);
        console.log("Order Type: ", orderType);
        console.log("Trigger Price: ", triggerPrice);
        console.log("After Market Order: ", afterMarketOrder);
        await axios.post("https://super-sincerely-buffalo.ngrok-free.app/modify-order", 
          {
            name: trader.name,
            orderId: order_id,
            newQuantity: quantity,
            newPrice: price,
            transactionType: transactionType,
            orderType: orderType,
            triggerPrice: triggerPrice,
            amo: afterMarketOrder,
          }
        );
        console.log("Order modified successfully for ", trader.name);
      }
      catch(error) {
        console.error("Error modifying order for ", trader.name, error);
        setMessage(`Error modifying order for ${trader.name}. Please try again.`);
        return;
      }
    }
    setMessage("All trade orders placed successfully!");
  };

  return (
    <div className = "p-4">
      <h1 className = "text-4xl font-bold mb-4">Trade Page</h1>

      <form onSubmit = {handleTradeModify} className = "space-y-4">
        <div>
            <label className = "block mb-1 font-semibold">Order ID:</label>
            <input
                type = "text"
                value = {order_id}
                onChange = {(e) => setOrderId(e.target.value)}
                className = "p-2 border rounded w-full"
                placeholder = "Enter order ID"
                required
            />
        </div>
        <div>
          <label className = "block mb-1 font-semibold">Quantity:</label>
          <input
            type = "number"
            value = {quantity}
            onChange = {(e) => setQuantity(e.target.value)}
            className = "p-2 border rounded w-full"
            placeholder = "Enter quantity"
            required
          />
        </div>
        <div>
          <label className = "block mb-1 font-semibold">Price:</label>
          <input
            type = "number"
            step = "0.01"
            value = {price}
            onChange = {(e) => setPrice(e.target.value)}
            className = "p-2 border rounded w-full"
            placeholder = "Enter price"
            required
          />
        </div>
        <div>
          <label className = "block mb-1 font-semibold">Transaction Type:</label>
          <select
            value = {transactionType}
            onChange = {(e) => setTransactionType(e.target.value)}
            className="p-2 border rounded w-full"
            required
          >
            <option value = "">Select transaction type</option>
            <option value = "B">BUY</option>
            <option value = "S">SELL</option>
          </select>
        </div>
        <div>
          <label className = "block mb-1 font-semibold">After Market Order:</label>
          <select
            value = {afterMarketOrder}
            onChange = {(e) => setAfterMarketOrder(e.target.value)}
            className="p-2 border rounded w-full"
            required
          >
            <option value = "">Select whether or not this is an after market order: remember to select NO during trading hours</option>
            <option value = "YES">YES</option>
            <option value = "NO">NO</option>
          </select>
        </div>
        <div>
          <label className = "block mb-1 font-semibold">Order Type:</label>
          <select
            value = {orderType}
            onChange = {(e) => setOrderType(e.target.value)}
            className = "p-2 border rounded w-full"
            required
          >
            <option value = "">Select order type</option>
            <option value = "LIMIT">Limit</option>
            <option value = "MARKET">Market</option>
            <option value = "SL">Stop Loss Limit</option>
            <option value = "SL-M">Stop Loss Market</option>
          </select>
        </div>
        {(orderType === "SL" || orderType === "SL-M") && (
          <div>
            <label className = "block mb-1 font-semibold">Trigger Price:</label>
            <input
              type = "number"
              step = "0.01"
              value = {triggerPrice}
              onChange = {(e) => setTriggerPrice(e.target.value)}
              className = "p-2 border rounded w-full"
              placeholder = "Enter trigger price"
              required
            />
          </div>
        )}
        <div className = "mb-4">
            <h3 className = "block mb-2 font-semibold">Select Accounts:</h3>
            {accounts.map((account, index) => (
              <div key = {index} className="flex items-center mb-2">
                <input
                  type = "checkbox"
                  id = {`account-${index}`}
                  value = {account.name}
                  checked = {selectedAccounts.includes(account)}
                  onChange = {() => handleAccountSelection(account)}
                  className = "mr-2"
                />
                <label htmlFor = {`account-${index}`} > {`${account.name} (${account.traderType})`}</label>
              </div>
            ))}
          </div>
        <button type = "submit" className="p-2 bg-green-500 text-white rounded">
          Submit Modify order
        </button>
      </form>
      {message && (<div className="mt-4 p-2 bg-gray-200 rounded">{message}</div>)}
      <div className = "mb-4">
        <Link to = "/" className = "p-2 bg-blue-500 text-white rounded">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default ModifyOrder;