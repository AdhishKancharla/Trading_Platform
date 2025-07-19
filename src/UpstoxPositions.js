import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UpstoxPositions = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all Upstox accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.post('/get-all-accounts', {});
        const upstoxAccounts = res.data.accounts.filter(a => a.traderType === 'upstox');
        setAccounts(upstoxAccounts);
        if (upstoxAccounts.length) {
          setSelectedAccount(upstoxAccounts[0].name);
        }
      } catch (err) {
        setError('Failed to load accounts.');
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  // Fetch positions using original POST logic when trader changes
  useEffect(() => {
    if (!selectedAccount) return;
    setLoading(true);
    setError('');
    axios.post('/get-positions', { traderType: 'upstox', name: selectedAccount })
      .then(res => {
        setPositions(res.data);
      })
      .catch(() => {
        setError('Failed to load positions.');
        setPositions([]);
      })
      .finally(() => setLoading(false));
  }, [selectedAccount]);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Upstox Positions</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Select Trader:</label>
        <select
          value={selectedAccount}
          onChange={e => setSelectedAccount(e.target.value)}
          className="block w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {accounts.map(acc => (
            <option key={acc.name} value={acc.name}>
              {acc.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading positions...</p>
      ) : (
        positions.length > 0 ? (
          <table className="w-full table-auto divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Symbol</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Quantity</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Average Price</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Current Price</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Instrument Token</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {positions.map((pos, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-800">{pos.tradingsymbol}</td>
                  <td className="px-4 py-2 text-sm text-right text-gray-800">{pos.quantity}</td>
                  <td className="px-4 py-2 text-sm text-right text-gray-800">₹{pos.average_price}</td>
                  <td className="px-4 py-2 text-sm text-right text-gray-800">₹{pos.last_price}</td>
                  <td className="px-4 py-2 text-sm text-right text-gray-800">{pos.instrument_token}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No existing positions</p>
        )
      )}

      <div className="mt-6 flex justify-between">
        <Link to="/upstoxAdd" className="text-gray-500 hover:underline">← Back</Link>
        <Link to="/" className="text-blue-500 hover:underline">Home</Link>
      </div>
    </div>
  );
};

export default UpstoxPositions;