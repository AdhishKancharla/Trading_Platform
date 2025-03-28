import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Positions = () => {
  const [positions, setPositions] = useState([]); // Ensure initial state is an empty array
  const [error, setError] = useState("");

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.post("http://localhost:5000/get-positions", {
          accessToken,
        });
        console.log(response)
        setPositions(response.data);
      } catch (error) {
        setError("Please try again using an access token");
        console.error("Error fetching positions:", error);
      }
    };

    if (accessToken && positions.length === 0) {
      fetchPositions();
    }
  }, [accessToken, positions.length]); // Make sure the positions are fetched only once

  return (
    
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Existing Positions</h2>

      <div className="mb-4">
        <Link
          to="/"
          className="text-blue-500 hover:underline text-sm"
        >
          &larr; Go Back to Home Page
        </Link>
      </div>      

      {error && <p className="text-red-500 font-medium">{error}</p>}

      {positions.length > 0 ? (
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="p-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">Symbol</th>
              <th className="p-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">Quantity</th>
              <th className="p-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">Average Price</th>
              <th className="p-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">Current Price</th>
              <th className="p-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">Instrument Token</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos, index) => (
              <tr
                key={index}
                className={`text-sm ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-300`}
              >
                <td className="p-2 border-r border-gray-300">{pos.tradingsymbol}</td>
                <td className="p-2 border-r border-gray-300">{pos.quantity}</td>
                <td className="p-2 border-r border-gray-300">₹{pos.average_price}</td>
                <td className="p-2 border-r border-gray-300">₹{pos.last_price}</td>
                <td className="p-2 border-r border-gray-300">{pos.instrument_token}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">Loading positions...</p>
      )}
    </div>
  );
};

export default Positions;
