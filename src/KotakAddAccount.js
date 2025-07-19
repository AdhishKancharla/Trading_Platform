import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const KotakAddAccount = () => {
  const [traderName, setTraderName] = useState('');
  const [credentials, setCredentials] = useState({ consumerKey: '', secretKey: '', neoFinKey: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/add-account', {
        traderType: 'kotak',
        name: traderName,
        consumerKey: credentials.consumerKey,
        secretKey: credentials.secretKey,
        neoFinKey: credentials.neoFinKey
      });
      setMessage('Kotak account added successfully!');
    } catch (err) {
      setMessage('Error adding Kotak account. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-2">Add Kotak Neo Account</h2>
      <p className="text-gray-600 mb-6">Enter your Kotak Neo API credentials below.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={traderName}
          onChange={e => setTraderName(e.target.value)}
          placeholder="Trader name"
          className="block w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          value={credentials.consumerKey}
          onChange={e => setCredentials({ ...credentials, consumerKey: e.target.value })}
          placeholder="Consumer Key"
          className="block w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          value={credentials.secretKey}
          onChange={e => setCredentials({ ...credentials, secretKey: e.target.value })}
          placeholder="Secret Key"
          className="block w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          value={credentials.neoFinKey}
          onChange={e => setCredentials({ ...credentials, neoFinKey: e.target.value })}
          placeholder="Neo Fin Key"
          className="block w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button type="submit" className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition">
          Save Credentials
        </button>
      </form>

      {message && <p className="mt-4 text-center text-green-600">{message}</p>}

      <div className="mt-6 flex justify-end">
        <Link to="/kotakLogin" className="text-blue-500 hover:underline">
          Next: Kotak Login →
        </Link>
      </div>
    </div>
  );
};

export default KotakAddAccount;