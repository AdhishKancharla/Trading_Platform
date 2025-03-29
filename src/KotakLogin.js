import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const KotakLogin = () => {
    const [traderName, setTraderName] = useState("");
    const [pan, setPan] = useState("");
    const [password, setDassword] = useState("");
    const [message, setMessage] = useState("");

    const login = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        try {
            const response = await axios.post("http://localhost:5000/login",
                {
                    name: traderName,
                    pan: pan,
                    password: password
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(response);
            setMessage("Enter the OTP sent to your registered mobile number.");
        } catch (error) {
            console.error("Error logging in to Kotak account:", error);
            setMessage("Error logging in to Kotak account. Please try again.");
        }
    }
    return (
        <div className = "p-4">
            <h2 className = "text-xl font-bold">Enter the account name, PAN and password</h2>
              <form onSubmit = {login} className = "mt-4">
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
                  value = {pan}
                  onChange = {(e) => setPan(e.target.value)}
                  placeholder = "Enter the PAN"
                  className = "block p-2 border rounded w-64 mb-2"
                  required
                />
                <input
                  type = "text"
                  value = {password}
                  onChange = {(e) => setDassword(e.target.value)}
                  placeholder = "Enter the password"
                  className = "block p-2 border rounded w-64 mb-2"
                  required
                />
                <button type = "submit" className="p-2 bg-green-500 text-white rounded">Login</button>
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
export default KotakLogin;