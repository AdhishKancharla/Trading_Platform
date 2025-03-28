import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Upstox = () => {
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) setAccessToken(storedToken);
  }, []);

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("accessToken", accessToken);
    alert("Upstox Access Token saved!");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Enter Upstox API Access Token</h2>
      <form onSubmit={handleTokenSubmit} className="mt-4">
        <input
          type="text"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          placeholder="Enter Access Token"
          className="block p-2 border rounded w-64 mb-2"
          required
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Save Token</button>
      </form>

      <div className="mt-4">
        <Link to="/" className="text-blue-500 underline">Back to Home</Link>
      </div>
    </div>
  );
};

export default Upstox;
