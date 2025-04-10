import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Trade = () => {
  const [index, setIndex] = useState("");
  const [strike, setStrike] = useState("");
  const [expiry, setExpiry] = useState("");
  const [option, setOption] = useState("");
  const [exchangeSegment, setExchangeSegment] = useState("");
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

  const handleTradeSubmit = async (e) => {
    e.preventDefault();
    for (const trader of selectedAccounts) {
      try{
        if (!(orderType === "SL" || orderType === "SL-M")){
          setTriggerPrice("0");
        }
        console.log("Placing order for ", trader.name);
        console.log("Trader Type: ", trader.traderType);
        console.log("Exchange Segment: ", exchangeSegment);
        console.log("Index: ", index);
        console.log("Option: ", option);
        console.log("Strike Price: ", strike);
        console.log("Expiry Date: ", expiry);
        console.log("Quantity: ", quantity);
        console.log("Price: ", price);
        console.log("Transaction Type: ", transactionType);
        console.log("Order Type: ", orderType);
        console.log("Trigger Price: ", triggerPrice);
        console.log("After Market Order: ", afterMarketOrder);
        console.log("Trader Name: ", trader.name);
        await axios.post("https://super-sincerely-buffalo.ngrok-free.app/place-order", 
          {
            name: trader.name,
            exchangeSegment: exchangeSegment,
            index: index,
            option: option,
            strike: strike,
            expiry: expiry,
            quantity: quantity,
            price: price,
            transactionType: transactionType,
            orderType: orderType,
            triggerPrice: triggerPrice,
            amo: afterMarketOrder,
          }
        );
        console.log("Order placed successfully for ", trader.name);
      }
      catch(error) {
        console.error("Error placing order for ", trader.name, error);
        setMessage(`Error placing order for ${trader.name}. Please try again.`);
        return;
      }
    }
    setMessage("All trade orders placed successfully!");
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">Trade Page</h1>

      <form onSubmit = {handleTradeSubmit} className="space-y-4">
        <div>
          <label className = "block mb-1 font-semibold">Index:</label>
          <select
            value = {index}
            onChange = {(e) => setIndex(e.target.value)}
            className = "p-2 border rounded w-full"
            required
          >
            <option value = "">Select index</option>
            <option value = "NIFTY">Nifty</option>
            <option value = "BANKNIFTY">Banknifty</option>
            <option value = "SENSEX">Sensex</option>
          </select>
        </div>
        <div>
          <label className = "block mb-1 font-semibold">Strike Price:</label>
          <input
            type = "number"
            value = {strike}
            onChange = {(e) => setStrike(e.target.value)}
            className = "p-2 border rounded w-full"
            placeholder = "Enter strike price"
            required
          />
        </div>
        <div>
          <label className = "block mb-1 font-semibold">Option:</label>
          <select
            value = {option}
            onChange = {(e) => setOption(e.target.value)}
            className = "p-2 border rounded w-full"
            required
          >
            <option value = "">Select option</option>
            <option value = "CE">Call Option</option>
            <option value = "PE">Put Option</option>
          </select>
        </div>
        {index === "NIFTY" && (
          <div>
            <label className = "block mb-1 font-semibold">Expiry Date:</label>
            <select
              value = {expiry}
              onChange = {(e) => setExpiry(e.target.value)}
              className = "p-2 border rounded w-full"
              required
            >
              <option value = "">Select expiry date</option>
              <option value = "25417">17th April</option>
              <option value = "25APR">24th April</option>
              <option value = "25430">30th April</option>
            </select>
          </div>
        )}
        {index === "BANKNIFTY" && (
            <div>
              <label className = "block mb-1 font-semibold">Expiry Date:</label>
              <select
                value = {expiry}
                onChange = {(e) => setExpiry(e.target.value)}
                className = "p-2 border rounded w-full"
                required
              >
                <option value = "">Select expiry date</option>
                <option value = "25APR">24th April</option>
              </select>
            </div>
          )}
        {index === "SENSEX" && (
            <div>
              <label className = "block mb-1 font-semibold">Expiry Date:</label>
              <select
                value = {expiry}
                onChange = {(e) => setExpiry(e.target.value)}
                className = "p-2 border rounded w-full"
                required
              >
                <option value = "">Select expiry date</option>
                <option value = "25415">15th April</option>
                <option value = "25422">22nd April</option>
                <option value = "25APR">29th April</option>
              </select>
            </div>
          )}
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
            <option value = "BUY">BUY</option>
            <option value = "SELL">SELL</option>
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
          <label className = "block mb-1 font-semibold">Exchange Segment:</label>
          <select
            value = {exchangeSegment}
            onChange = {(e) => setExchangeSegment(e.target.value)}
            className = "p-2 border rounded w-full"
            required
          >
            <option value = "">Select exchange segment</option>
            <option value = "nse_fo">NSE</option>
            <option value = "bse_fo">BSE</option>
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
          Submit Trade
        </button>
      </form>
      {message && (<div className="mt-4 p-2 bg-gray-200 rounded">{message}</div>)}
      <div className="mb-4">
        <Link to="/" className="p-2 bg-blue-500 text-white rounded">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default Trade;