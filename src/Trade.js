// Trade.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Trade = () => {
  const [index, setIndex] = useState('');
  const [strike, setStrike] = useState('');
  const [expiry, setExpiry] = useState('');
  const [optionType, setOptionType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [orderType, setOrderType] = useState('');
  const [triggerPrice, setTriggerPrice] = useState('');
  const [afterMarketOrder, setAfterMarketOrder] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [message, setMessage] = useState('');
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [accountsError, setAccountsError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoadingAccounts(true);
      try {
        const res = await axios.post('/get-all-accounts', {});
        setAccounts(res.data.accounts || []);
      } catch {
        setAccountsError('Failed to load accounts.');
      } finally {
        setLoadingAccounts(false);
      }
    };
    fetch();
  }, []);

  const toggleAcct = acct => {
    setSelectedAccounts(prev =>
      prev.includes(acct) ? prev.filter(a => a !== acct) : [...prev, acct]
    );
  };

  const submit = async e => {
    e.preventDefault();
    if (!selectedAccounts.length) return setMessage('Select an account.');
    for (const t of selectedAccounts) {
      try {
        const tp = ['SL', 'SL-M'].includes(orderType) ? triggerPrice : '0';
        const pr = orderType === 'LIMIT' ? price : '0';
        await axios.post('/place-order', {
          name: t.name,
          exchangeSegment: index === "SENSEX" ? 'bse_fo' : 'nse_fo',
          index: index, option: optionType, strike: strike, expiry: expiry, quantity: quantity, price: pr,
          transactionType: transactionType, orderType: orderType, triggerPrice: tp, amo: afterMarketOrder
        });
      } catch {
        return setMessage(`Error for ${t.name}`);
      }
    }
    setMessage('Orders placed!');
  };

  return (
    <div className="p-4 max-w-xl mx-auto bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-1">Place a Trade</h2>
      <p className="text-sm text-gray-600 mb-4">Choose options & accounts.</p>

      {accountsError && <p className="text-red-600 text-sm mb-2">{accountsError}</p>}
      {loadingAccounts ? (
        <p className="text-sm">Loading accounts...</p>
      ) : (
        <form onSubmit={submit} className="space-y-2 text-sm">
          {/* Index & Type */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1 font-semibold">Index</label>
              <select value={index} onChange={e => { setIndex(e.target.value); setExpiry(''); }} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" required>
                <option value="">Select</option><option value="NIFTY">Nifty</option><option value="BANKNIFTY">Banknifty</option><option value="SENSEX">Sensex</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold">Option</label>
              <select value={optionType} onChange={e => setOptionType(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" required>
                <option value="">Select</option><option value="CE">Call</option><option value="PE">Put</option>
              </select>
            </div>
          </div>

          {/* Strike & Expiry */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1 font-semibold">Strike</label>
              <input type="number" value={strike} onChange={e => setStrike(e.target.value)} placeholder="Strike" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Expiry</label>
              {index === 'NIFTY' && (
                <select value={expiry} onChange={e => setExpiry(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Date</option><option value="25724">24th July</option><option value="25JUL">31st July</option><option value="25807">7th August</option>
                </select>
              )}
              {index === 'BANKNIFTY' && (
                <select value={expiry} onChange={e => setExpiry(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Date</option><option value="25JUL">31st July</option><option value="25AUG">28th August</option>
                </select>
              )}
              {index === 'SENSEX' && (
                <select value={expiry} onChange={e => setExpiry(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Date</option><option value="25722">22nd July</option><option value="25JUL">29th July</option><option value="25805">5th August</option>
                </select>
              )}
            </div>
          </div>

          {/* Quantity */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1 font-semibold">Qty</label>
              <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Qty" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" required />
            </div>

            {/* Price - shown only for LIMIT orders */}
            {orderType === 'LIMIT' ? (
              <div>
                <label className="block mb-1 font-semibold">Price</label>
                <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" required />
              </div>
            ) : <div />}
          </div>

          {/* Trans & Order */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1 font-semibold">Trans</label>
              <select value={transactionType} onChange={e => setTransactionType(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" required>
                <option value="">Type</option><option value="BUY">Buy</option><option value="SELL">Sell</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold">Order</label>
              <select value={orderType} onChange={e => setOrderType(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" required>
                <option value="">Order</option><option value="LIMIT">Limit</option><option value="MARKET">Market</option><option value="SL">SL</option><option value="SL-M">SL-M</option>
              </select>
            </div>
          </div>

          {/* Trigger if needed */}
          {['SL', 'SL-M'].includes(orderType) && (
            <div>
              <label className="block mb-1 font-semibold">Trigger</label>
              <input type="number" step="0.01" value={triggerPrice} onChange={e => setTriggerPrice(e.target.value)} placeholder="Trigger" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" required />
            </div>
          )}

          {/* AMO */}
          <div>
            <label className="block mb-1 font-semibold">AMO</label>
            <select value={afterMarketOrder} onChange={e => setAfterMarketOrder(e.target.value === 'true')} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" required>
              <option value="">AMO?</option><option value="true">Y</option><option value="false">N</option>
            </select>
          </div>

          {/* Accounts */}
          <div>
            <label className="block mb-1 font-semibold">Accounts</label>
            <div className="grid grid-cols-2 gap-1">
              {accounts.map((a, i) => (
                <label key={i} className="flex items-center space-x-1 text-xs">
                  <input type="checkbox" checked={selectedAccounts.includes(a)} onChange={() => toggleAcct(a)} className="h-4 w-4" />
                  <span>{a.name}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition">Submit</button>
          {message && <p className="mt-2 text-center text-sm text-indigo-700">{message}</p>}
          <div className="mt-2 text-sm flex justify-between">
            <Link to="/" className="text-gray-500">← Home</Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default Trade;
