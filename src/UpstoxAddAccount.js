import React, {useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UpstoxAdd = () => {
  const [traderName, setTraderName] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [message, setMessage] = useState("");

  const addAccount = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const response = await axios.post("https://super-sincerely-buffalo.ngrok-free.app/add-account", 
          {
            traderType: "upstox",
            name: traderName,
            accessToken: accessToken
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
      );
      console.log(response)
      setMessage("Upstox account added successfully!");
    } catch (error) {
      console.error("Error adding upstox account:", error);
      setMessage("Error adding upstox account. Please try again.");
    }
  }

  return (
    <div className = "p-4">
      <h2 className = "text-xl font-bold">Enter Upstox Account Details</h2>
      <form onSubmit = {addAccount} className = "mt-4">
        <input
          type = "text"
          value = {traderName}
          onChange = {(e) => setTraderName(e.target.value)}
          placeholder = "Enter the trader name"
          className = "block p-2 border rounded w-64 mb-2"
          required
        />
        <input
          type = "text"
          value = {accessToken}
          onChange = {(e) => setAccessToken(e.target.value)}
          placeholder = "Enter the access token"
          className = "block p-2 border rounded w-64 mb-2"
          required
        />
        <button type = "submit" className = "p-2 bg-blue-500 text-white rounded">Save Upstox Account</button>
      </form>
      <div className = "mt-4">
        <Link to = "/" className = "text-blue-500 underline">Back to Home</Link>
        <br />
        {message && <p className = "mt-4 text-blue-600">{message}</p>}
        <br />
      </div>
    </div>
  );
};

export default UpstoxAdd;
