import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Trading Platform</h1>
      <p className="mt-2">Manage your trading credentials and place orders.</p>

      <div className="mt-6">
        <Link to="/upstox" className="block p-2 bg-blue-500 text-white rounded w-64 text-center mb-2">Enter Upstox Token</Link>
        <Link to="/kotak" className="block p-2 bg-green-500 text-white rounded w-64 text-center mb-2">Enter Kotak Credentials</Link>
        <Link to="/trade" className="block p-2 bg-red-500 text-white rounded w-64 text-center">Go to Trade Page</Link>
        <Link to="/positions" className="block p-2 bg-purple-500 text-white rounded w-64 text-center">View Upstox Positions</Link>
      </div>
    </div>
  );
};

export default Home;
