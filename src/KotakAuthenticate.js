import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const KotakAuthenticate = () => {
    const [traderName, setTraderName] = useState("");
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    
    const authenticate = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        try {
            const response = await axios.post("https://super-sincerely-buffalo.ngrok-free.app/authenticate",
                {
                    name: traderName,
                    otp: otp
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(response);
            setMessage("Kotak account authenticated successfully!");
        } catch (error) {
            console.error("Error authenticating Kotak account:", error);
            setMessage("Error authenticating Kotak account. Please try again.");
        }
    }

    return (
        <div className = "p-4">
            <h2 className = "text-xl font-bold">Enter the OTP sent to your registered mobile number</h2>
            <form onSubmit = {authenticate} className = "mt-4">
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
                    value = {otp}
                    onChange = {(e) => setOtp(e.target.value)}
                    placeholder = "Enter the OTP"
                    className = "block p-2 border rounded w-64 mb-2"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Authenticate</button>
            </form>
            <div className="mt-4">
                <Link to = "/" className = "text-blue-500 underline">Go back to Home</Link>
                <br />
                {message && <p className="mt-4">{message}</p>}
                <br />
            </div>
        </div>
    );
}
export default KotakAuthenticate;