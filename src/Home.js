import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className = "p-4">
      <h1 className = "text-2xl font-bold">Trading Platform</h1>
      <p className = "mt-2">Manage your trading credentials and place orders.</p>

      <div className = "mt-6">
        <Link to = "/upstoxAdd" className = "block p-2 bg-blue-500 text-white rounded w-64 text-center mb-2">Add Upstox Account</Link>
        <Link to = "/kotakAdd" className = "block p-2 bg-blue-500 text-white rounded w-64 text-center mb-2">Add Kotak Account</Link>
        <Link to = "/kotakLogin" className = "block p-2 bg-blue-500 text-white rounded w-64 text-center mb-2">Login to Kotak Account</Link>
        <Link to = "/kotakAuthenticate" className = "block p-2 bg-blue-500 text-white rounded w-64 text-center mb-2">Authenticate Kotak Account</Link>
        <Link to = "/kotakGet" className = "block p-2 bg-green-500 text-white rounded w-64 text-center mb-2">Get Kotak Account</Link>
        <Link to = "/upstoxGet" className = "block p-2 bg-green-500 text-white rounded w-64 text-center mb-2">Get Upstox Account</Link>
        <Link to = "/upstoxPositions" className = "block p-2 bg-red-500 text-white rounded w-64 text-center">View Upstox Positions</Link>
        <Link to = "/trade" className = "block p-2 bg-red-500 text-white rounded w-64 text-center">Go to Trade Page</Link>
        <Link to = "/modifyOrder" className = "block p-2 bg-red-500 text-white rounded w-64 text-center">Modify Order</Link>
        <Link to = "/cancelOrder" className = "block p-2 bg-red-500 text-white rounded w-64 text-center">Cancel Order</Link>
      </div>
    </div>
  );
};

export default Home;
