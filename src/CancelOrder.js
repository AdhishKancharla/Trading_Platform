import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CancelOrder = () => {
  const [order_id, setOrderId] = useState("");
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

  const handleTradeCancel = async (e) => {
    e.preventDefault();
    for (const trader of selectedAccounts) {
      try{
        if (!(orderType === "SL" || orderType === "SL-M")){
          setTriggerPrice("0");
        }
        console.log("Cancelling order for ", trader.name);
        console.log("Order ID: ", order_id);
        await axios.post("https://super-sincerely-buffalo.ngrok-free.app/cancel-order", 
          {
            name: trader.name,
            orderId: order_id,
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
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">Trade Page</h1>

      <form onSubmit = {handleTradeCancel} className="space-y-4">
        <div className="mb-4">
            <label htmlFor="order_id" className="block mb-2 font-semibold">Order ID:</label>
            <input
                type="text"
                id="order_id"
                value={order_id}
                onChange={(e) => setOrderId(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full"
                required
            />
        </div>
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
          Submit Cancel Order
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

export default CancelOrder;