import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE = "https://super-sincerely-buffalo.ngrok-free.app";

export default function IronFly() {
  // Basket creation state
  const [index, setIndex]             = useState("");
  const [expiry, setExpiry]           = useState("");
  const [putStrike, setPutStrike]     = useState("");
  const [callStrike, setCallStrike]   = useState("");
  const [putDistance, setPutDistance] = useState("");
  const [callDistance, setCallDistance] = useState("");
  const [quantity, setQuantity]       = useState("");

  // Support state
  const [accounts, setAccounts]       = useState([]);
  const [baskets, setBaskets]         = useState([]);
  const [message, setMessage]         = useState("");

  // Fetch accounts & existing baskets
  useEffect(() => {
    axios
      .post(`${API_BASE}/get-all-accounts`, {})
      .then(r => setAccounts(r.data.accounts))
      .catch(console.error);

    axios
      .post(`${API_BASE}/get-baskets`)
      .then(r => setBaskets(r.data.baskets))
      .catch(console.error);
  }, []);

  // Save-only handler
  const handleSave = async e => {
    e.preventDefault();
    try {
      const resp = await axios.post(`${API_BASE}/create-basket`, {
        index,
        expiry,
        putStrike,
        callStrike,
        putDistance,
        callDistance,
        quantity
      });
      setMessage(`Basket saved! ID=${resp.data.basketId}`);
      // reload list
      const b = await axios.post(`${API_BASE}/get-baskets`);
      setBaskets(b.data.baskets);
    } catch (err) {
      console.error(err);
      setMessage("Error saving basket");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Ironfly Basket</h2>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Index */}
        <div>
          <label className="block mb-1 font-semibold">Index:</label>
          <select
            value={index}
            onChange={e => {
              setIndex(e.target.value);
              setExpiry("");
            }}
            className="p-2 border rounded w-full"
            required
          >
            <option value="">Select index</option>
            <option value="NIFTY">Nifty</option>
            <option value="BANKNIFTY">Banknifty</option>
            <option value="SENSEX">Sensex</option>
          </select>
        </div>

        {/* Expiry (conditional) */}
        {index === "NIFTY" && (
          <div>
            <label className="block mb-1 font-semibold">Expiry Date:</label>
            <select
              value={expiry}
              onChange={e => setExpiry(e.target.value)}
              className="p-2 border rounded w-full"
              required
            >
              <option value="">Date</option><option value="25724">24th July</option><option value="25JUL">31st July</option><option value="25807">7th August</option>
            </select>
          </div>
        )}
        {index === "BANKNIFTY" && (
          <div>
            <label className="block mb-1 font-semibold">Expiry Date:</label>
            <select
              value={expiry}
              onChange={e => setExpiry(e.target.value)}
              className="p-2 border rounded w-full"
              required
            >
              <option value="">Date</option><option value="25JUL">31st July</option><option value="25AUG">28th August</option>
            </select>
          </div>
        )}
        {index === "SENSEX" && (
          <div>
            <label className="block mb-1 font-semibold">Expiry Date:</label>
            <select
              value={expiry}
              onChange={e => setExpiry(e.target.value)}
              className="p-2 border rounded w-full"
              required
            >
              <option value="">Date</option><option value="25722">22nd July</option><option value="25JUL">29th July</option><option value="25805">5th August</option>
            </select>
          </div>
        )}

        {/* Strike & Distance Inputs */}
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Put Strike"
            type="number"
            className="p-2 border rounded"
            value={putStrike}
            onChange={e => setPutStrike(e.target.value)}
            required
          />
          <input
            placeholder="Call Strike"
            type="number"
            className="p-2 border rounded"
            value={callStrike}
            onChange={e => setCallStrike(e.target.value)}
            required
          />
          <input
            placeholder="Put Distance"
            type="number"
            className="p-2 border rounded"
            value={putDistance}
            onChange={e => setPutDistance(e.target.value)}
            required
          />
          <input
            placeholder="Call Distance"
            type="number"
            className="p-2 border rounded"
            value={callDistance}
            onChange={e => setCallDistance(e.target.value)}
            required
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block mb-1 font-semibold">Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            className="p-2 border rounded w-full"
            placeholder="Enter quantity"
            required
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="mt-2 w-full bg-blue-600 text-white p-2 rounded text-lg"
        >
          Save Basket
        </button>
      </form>

      {message && (
        <div className="mt-4 p-2 bg-gray-100 rounded">{message}</div>
      )}

      <div className="mt-6">
        <Link to="/" className="text-blue-500 underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
