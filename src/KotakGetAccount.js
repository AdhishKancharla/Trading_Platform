import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const KotakGetAccount = () => {
    const [traderName, setTraderName] = useState("");
    const [message, setMessage] = useState("");

    const getAccount = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        try {
            const response = await axios.post("http://localhost:5000/get-account-details",
                {
                    traderType: "kotak",
                    name: traderName
                }
                ,
                {
                    headers: {
                      "Content-Type": "application/json",
                    },
                }
            );
            
            //display the response on the screen on a new line after the message
            
            setMessage(`Kotak account details retrieved successfully! \n ${JSON.stringify(response.data)}`);
            console.log(response.data)

        } catch (error) {
            console.error("Error retrieving kotak account:", error);
            setMessage("Error retrieving kotak account. Please try again.");
        }
    }
    return (
        <div className = "p-4">
            <h2 className = "text-xl font-bold">Get Kotak Account Details</h2>
            <form onSubmit = {getAccount} className="mt-4">
                <input
                    type = "text"
                    value = {traderName}
                    onChange = {(e) => setTraderName(e.target.value)}
                    placeholder = "Enter the trader name"
                    className = "block p-2 border rounded w-64 mb-2"
                    required
                />
                <button type = "submit" className = "p-2 bg-blue-500 text-white rounded">Get Account</button>
            </form>
            {message && <p className = "mt-4 text-blue-600">{message}</p>}
            <div className = "mt-4">
                <Link to = "/" className = "text-blue-500 underline">Back to Home</Link>
            </div>
        </div>
    )
}
export default KotakGetAccount;