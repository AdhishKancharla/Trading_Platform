import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Kotak = () => {
  const [kotakCredentials, setKotakCredentials] = useState({
    consumerKey: "",
    secretKey: "",
    panCard: "",
    password: "",
  });

  useEffect(() => {
    const storedKotak = JSON.parse(localStorage.getItem("kotakCredentials"));
    if (storedKotak) setKotakCredentials(storedKotak);
  }, []);

  const handleKotakSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("kotakCredentials", JSON.stringify(kotakCredentials));
    alert("Kotak credentials saved!");
  };

  const handleChange = (e) => {
    setKotakCredentials({ ...kotakCredentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Enter Kotak Neo API Credentials</h2>
      <form onSubmit={handleKotakSubmit} className="mt-4">
        <input
          type="text"
          name="consumerKey"
          value={kotakCredentials.consumerKey}
          onChange={handleChange}
          placeholder="Consumer Key"
          className="block p-2 border rounded w-64 mb-2"
          required
        />
        <input
          type="text"
          name="secretKey"
          value={kotakCredentials.secretKey}
          onChange={handleChange}
          placeholder="Secret Key"
          className="block p-2 border rounded w-64 mb-2"
          required
        />
        <input
          type="text"
          name="panCard"
          value={kotakCredentials.panCard}
          onChange={handleChange}
          placeholder="PAN Card"
          className="block p-2 border rounded w-64 mb-2"
          required
        />
        <input
          type="password"
          name="password"
          value={kotakCredentials.password}
          onChange={handleChange}
          placeholder="Password"
          className="block p-2 border rounded w-64 mb-2"
          required
        />
        <button type="submit" className="p-2 bg-green-500 text-white rounded">Save Kotak Credentials</button>
      </form>

      <div className="mt-4">
        <Link to="/" className="text-blue-500 underline">Back to Home</Link>
      </div>
    </div>
  );
};

export default Kotak;
