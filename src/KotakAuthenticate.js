import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const KotakAuthenticate = () => {
  const [traderName, setTraderName] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const handleAuth = async e => {
    e.preventDefault();
    try {
      await axios.post('/authenticate', { name: traderName, otp });
      setMessage('Authenticated successfully!');
    } catch (err) {
      setMessage('Authentication failed. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-2">Authenticate Kotak Account</h2>
      <p className="text-gray-600 mb-6">Enter the OTP sent to your mobile.</p>

      <form onSubmit={handleAuth} className="space-y-4">
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
          value={otp}
          onChange={e => setOtp(e.target.value)}
          placeholder="OTP"
          className="block w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button type="submit" className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition">
          Authenticate
        </button>
      </form>

      {message && <p className="mt-4 text-green-600 text-center">{message}</p>}

      <div className="mt-6 flex justify-between">
        <Link to="/kotakLogin" className="text-gray-500 hover:underline">← Back to Login</Link>
        <Link to="/" className="text-blue-500 hover:underline">Home</Link>
      </div>
    </div>
  );
};

export default KotakAuthenticate;