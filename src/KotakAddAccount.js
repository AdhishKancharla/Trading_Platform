import React, {useState} from "react";
import axios from "axios"
import { Link } from "react-router-dom";

const KotakAdd = () => {
  const [traderName, setTraderName] = useState("");
  const [kotakCredentials, setKotakCredentials] = useState({
    consumerKey: "",
    secretKey: "",
    neoFinKey: ""
  });
  const [message, setMessage] = useState("");

  const addAccount = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const response = await axios.post("http://localhost:5000/add-account",
        { 
          traderType: "kotak",
          name: traderName,
          consumerKey: kotakCredentials.consumerKey,
          secretKey: kotakCredentials.secretKey,
          neoFinKey: kotakCredentials.neoFinKey
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      setMessage("Kotak account added successfully!");
    } catch (error) {
      console.error("Error adding Kotak account:", error);
      setMessage("Error adding Kotak account. Please try again.");
    }
  }

  return (
    <div className = "p-4">
      <h2 className = "text-xl font-bold">Enter the Kotak Neo Credential</h2>
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
          value = {kotakCredentials.consumerKey}
          onChange = {(e) => setKotakCredentials({...kotakCredentials, consumerKey: e.target.value})}
          placeholder = "Consumer Key"
          className = "block p-2 border rounded w-64 mb-2"
          required
        />
        <input
          type = "text"
          value = {kotakCredentials.secretKey}
          onChange = {(e) => setKotakCredentials({...kotakCredentials, secretKey: e.target.value})}
          placeholder = "Secret Key"
          className = "block p-2 border rounded w-64 mb-2"
          required
        />
        <input
          type = "text"
          value = {kotakCredentials.neoFinKey}
          onChange = {(e) => setKotakCredentials({...kotakCredentials, neoFinKey: e.target.value})}
          placeholder = "Neo Fin Key"
          className = "block p-2 border rounded w-64 mb-2"
          required
        />
        <button type = "submit" className="p-2 bg-green-500 text-white rounded">Save Kotak Credentials</button>
      </form>
      <div className = "mt-4">
        <Link to = "/" className="text-blue-500 underline">Back to Home</Link>
        <br />
        {message && <p className = "mt-4 text-blue-600">{message}</p>}
        <br />
      </div>
    </div>
  );
};

export default KotakAdd;
