import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UpstoxPositions = () => {
  const [traderName, setTraderName] = useState("");
  const [positions, setPositions] = useState([]); // Ensure initial state is an empty array
  const [error, setError] = useState("");

  const getPositions = async(e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const response = await axios.post("https://super-sincerely-buffalo.ngrok-free.app/get-positions", 
        {
          traderType: "upstox",
          name: traderName
        }
      );
      console.log(response)
      setPositions(response.data);
    } catch (error) {
      setError("Please try again using an access token");
      console.error("Error fetching positions:", error);
    }
  }

  return (
    <div className = "p-4 border rounded-lg shadow-md bg-white">
      <h2 className = "text-xl font-bold mb-4">Enter Upstox Account Name</h2>
      <form onSubmit = {getPositions} className = "mb-4">
        <input
          type = "text"
          value = {traderName}
          onChange = {(e) => setTraderName(e.target.value)}
          placeholder = "Enter the trader name"
          className="block p-2 border rounded w-64 mb-2"
          required
        />
        <button type = "submit" className="p-2 bg-blue-500 text-white rounded">Get Positions</button>
      </form>

      <h2 className = "text-xl font-semibold mb-4 text-gray-800">Existing Positions</h2>

      <div className = "mb-4">
        <Link
          to = "/"
          className = "text-blue-500 hover:underline text-sm"
        >
          &larr; Go Back to Home Page
        </Link>
      </div>      

      {error && <p className="text-red-500 font-medium">{error}</p>}

      {positions.length > 0 ? (
        <table className = "min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className = "bg-gray-100 border-b border-gray-300">
              <th className = "p-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">Symbol</th>
              <th className = "p-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">Quantity</th>
              <th className = "p-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">Average Price</th>
              <th className = "p-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">Current Price</th>
              <th className = "p-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">Instrument Token</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos, index) => (
              <tr
                key = {index}
                className = {`text-sm ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-300`}
              >
                <td className = "p-2 border-r border-gray-300">{pos.tradingsymbol}</td>
                <td className = "p-2 border-r border-gray-300">{pos.quantity}</td>
                <td className = "p-2 border-r border-gray-300">₹{pos.average_price}</td>
                <td className = "p-2 border-r border-gray-300">₹{pos.last_price}</td>
                <td className = "p-2 border-r border-gray-300">{pos.instrument_token}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No existing positions</p>
      )}
    </div>
  );
};

export default UpstoxPositions;
