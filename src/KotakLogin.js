import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const KotakLogin = () => {
  const [traderName, setTraderName] = useState('');
  const [pan, setPan] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async e => {
    e.preventDefault();
    try {
      await axios.post('/login', { name: traderName, pan, password });
      setMessage('OTP sent! Proceed to authentication.');
    } catch (err) {
      setMessage('Login failed. Please check your PAN and password.');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-2">Kotak Account Login</h2>
      <p className="text-gray-600 mb-6">Enter your PAN and password.</p>

      <form onSubmit={handleLogin} className="space-y-4">
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
          value={pan}
          onChange={e => setPan(e.target.value)}
          placeholder="PAN"
          className="block w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="block w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button type="submit" className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition">
          Login
        </button>
      </form>

      {message && <p className="mt-4 text-indigo-700 text-center">{message}</p>}

      <div className="mt-6 flex justify-between">
        <Link to="/kotakAdd" className="text-gray-500 hover:underline">← Back</Link>
        <Link to="/kotakAuthenticate" className="text-blue-500 hover:underline">Next: Authenticate →</Link>
      </div>
    </div>
  );
};

export default KotakLogin;