import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// point axios at your Flask/ngrok server
axios.defaults.baseURL = "https://super-sincerely-buffalo.ngrok-free.app";

export default function SavedBaskets() {
  const [baskets, setBaskets]       = useState(null);
  const [accounts, setAccounts]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [confirms, setConfirms]     = useState({
    putHedge: false,
    putMain:  false,
    callHedge:false,
    callMain: false,
  });
  const [editId, setEditId]         = useState(null);
  const [form, setForm]             = useState({});
  const [message, setMessage]       = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [bResp, aResp] = await Promise.all([
          axios.post("/get-baskets", {}),
          axios.post("/get-all-accounts", {})
        ]);
        setBaskets(Array.isArray(bResp.data.baskets) ? bResp.data.baskets : []);
        setAccounts(Array.isArray(aResp.data.accounts) ? aResp.data.accounts : []);
      } catch (e) {
        console.error(e);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleAccount = acct => {
    setSelectedAccounts(prev =>
      prev.includes(acct)
        ? prev.filter(a => a !== acct)
        : [...prev, acct]
    );
  };

  const deleteBasket = async id => {
    if (!window.confirm(`Delete basket #${id}?`)) return;
    await axios.post("/delete-basket", { basketId: id });
    setBaskets(bs => bs.filter(b => b.id !== id));
    setMessage(`Basket #${id} deleted`);
    if (expandedId === id) setExpandedId(null);
  };

  const startEdit = b => {
    setEditId(b.id);
    setForm({
      index: b.index,
      expiry: b.expiry,
      putStrike: b.putStrike,
      callStrike: b.callStrike,
      putDistance: b.putDistance,
      callDistance: b.callDistance,
      quantity: b.quantity
    });
    setMessage("");
  };

  const saveEdit = async () => {
    await axios.post("/update-basket", { basketId: editId, ...form });
    setBaskets(bs =>
      bs.map(b => (b.id === editId ? { id: b.id, ...form } : b))
    );
    setMessage(`Basket #${editId} updated`);
    setEditId(null);
  };

  const executeBasket = async basketId => {
    if (!selectedAccounts.length) {
      setMessage("Select at least one account");
      return;
    }
    try {
      const payload = {
        basketId,
        accounts: selectedAccounts.map(a => a.name),
        confirmations: confirms
      };
      const res = await axios.post("/execute-basket", payload);
      setMessage(`Executed: ${res.data.executed.join(", ")}`);
    } catch (e) {
      console.error(e);
      setMessage("Execution failed");
    }
  };

  if (loading) return <div className="p-4">Loading…</div>;
  if (error)   return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Saved Baskets</h1>
      {message && <p className="mb-4 text-blue-600">{message}</p>}

      {baskets.length === 0 ? (
        <p className="text-gray-600">No baskets saved.</p>
      ) : (
        baskets.map(b => (
          <div key={b.id} className="mb-6 border p-4 rounded">
            {editId === b.id ? (
              <div className="space-y-4">
                {/* Index */}
                <div>
                  <label className="block font-semibold">Index</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={form.index}
                    onChange={e => setForm(f => ({ ...f, index: e.target.value, expiry: "" }))}
                  >
                    <option value="">Select index</option>
                    <option value="NIFTY">NIFTY</option>
                    <option value="BANKNIFTY">BANKNIFTY</option>
                    <option value="SENSEX">SENSEX</option>
                  </select>
                </div>
                {/* Expiry */}
                {form.index === "NIFTY" && (
                  <div>
                    <label className="block font-semibold">Expiry</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={form.expiry}
                      onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))}
                    >
                      <option value="">Date</option><option value="25724">24th July</option><option value="25JUL">31st July</option><option value="25807">7th August</option>
                    </select>
                  </div>
                )}
                {form.index === "BANKNIFTY" && (
                  <div>
                    <label className="block font-semibold">Expiry</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={form.expiry}
                      onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))}
                    >
                      <option value="">Date</option><option value="25JUL">31st July</option><option value="25AUG">28th August</option>
                    </select>
                  </div>
                )}
                {form.index === "SENSEX" && (
                  <div>
                    <label className="block font-semibold">Expiry</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={form.expiry}
                      onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))}
                    >
                      <option value="">Date</option><option value="25722">22nd July</option><option value="25JUL">29th July</option><option value="25805">5th August</option>
                    </select>
                  </div>
                )}
                {/* Strikes & Distances */}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="p-2 border rounded"
                    type="number"
                    placeholder="Put Strike"
                    value={form.putStrike}
                    onChange={e => setForm(f => ({ ...f, putStrike: e.target.value }))}
                  />
                  <input
                    className="p-2 border rounded"
                    type="number"
                    placeholder="Call Strike"
                    value={form.callStrike}
                    onChange={e => setForm(f => ({ ...f, callStrike: e.target.value }))}
                  />
                  <input
                    className="p-2 border rounded"
                    type="number"
                    placeholder="Put Distance"
                    value={form.putDistance}
                    onChange={e => setForm(f => ({ ...f, putDistance: e.target.value }))}
                  />
                  <input
                    className="p-2 border rounded"
                    type="number"
                    placeholder="Call Distance"
                    value={form.callDistance}
                    onChange={e => setForm(f => ({ ...f, callDistance: e.target.value }))}
                  />
                </div>
                {/* Quantity */}
                <div>
                  <input
                    className="p-2 border rounded w-full"
                    type="number"
                    placeholder="Quantity"
                    value={form.quantity}
                    onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                  />
                </div>
                {/* Save/Cancel */}
                <div className="flex space-x-2">
                  <button
                    onClick={saveEdit}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p>
                  <strong>#{b.id}</strong>: {b.index}@{b.expiry} × {b.quantity}
                </p>
                <p>
                  putStrike={b.putStrike}±{b.putDistance}, callStrike={b.callStrike}±{b.callDistance}
                </p>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => startEdit(b)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBasket(b.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setExpandedId(b.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Execute
                  </button>
                </div>
              </>
            )}

            {expandedId === b.id && editId !== b.id && (
              <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded">
                {/* Account Selection */}
                <div>
                  <p className="font-semibold">Select Accounts</p>
                  <div className="max-h-32 overflow-auto border p-2 rounded">
                    {accounts.length === 0 ? (
                      <p className="text-gray-600">No accounts available.</p>
                    ) : (
                      accounts.map((acct, i) => (
                        <label key={i} className="flex items-center mb-1">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={selectedAccounts.includes(acct)}
                            onChange={() => toggleAccount(acct)}
                          />
                          {acct.name} ({acct.traderType})
                        </label>
                      ))
                    )}
                  </div>
                </div>
                {/* Confirm Legs */}
                <div>
                  <p className="font-semibold">Confirm Legs</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {[
                      ["putHedgeEnter","Enter Put Hedge"],
                      ["putHedgeExit","Exit Put Hedge"],
                      ["putMainEnter","Enter Put Main"],
                      ["putMainExit","Exit Put Main"],
                      ["callHedgeEnter","Enter Call Hedge"],
                      ["callHedgeExit","Exit Call Hedge"],
                      ["callMainEnter","Enter Call Main"],
                      ["callMainExit","Exit Call Main"]

                    ].map(([key,label]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={confirms[key]}
                          onChange={() =>
                            setConfirms(c => ({ ...c, [key]: !c[key] }))
                          }
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
                {/* Execute Button */}
                <button
                  onClick={() => executeBasket(b.id)}
                  className="w-full py-2 bg-indigo-600 text-white rounded"
                >
                  Confirm & Execute
                </button>
              </div>
            )}
          </div>
        ))
      )}

      <div className="mt-8">
        <Link to="/" className="text-blue-500 underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
