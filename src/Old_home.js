import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [accessToken, setAccessToken] = useState("");
  const [inputValue, setInputValue] = useState("");

  const [redirectToken, setRedirectToken] = useState(""); // store token for redirection
  const navigate = useNavigate(); // useNavigate hook for programmatic navigation

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setAccessToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("accessToken");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleNavigateToPositions = () => {
    navigate(`/Positions?accessToken=${redirectToken}`); // programmatically navigate with token as query param
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAccessToken(inputValue);
    localStorage.setItem("accessToken", inputValue); // Save token
    setInputValue(""); // Clear input field after submission
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Welcome to Upstox Trading App</h2>

      {/* Access Token Input Form */}
      <form onSubmit={handleSubmit} className="mt-4 flex space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="p-2 border rounded w-64"
          placeholder="Enter Access Token"
          required
        />
        <button type="submit" className="p-2 bg-green-500 text-white rounded">
          Submit
        </button>
      </form>

      {/* Display Current Access Token */}
      {accessToken && (
        <div className="mt-2 w-64 overflow-x-auto whitespace-nowrap border p-2 rounded bg-gray-100 text-sm">
          <span className="inline-block animate-marquee">{accessToken}</span>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleNavigateToPositions}
          className="p-2 bg-blue-500 text-white rounded mr-4"
        >
          Go to Positions Page
        </button>

        {/* New Link to Trade page */}
        <Link to="/trade" className="p-2 bg-purple-500 text-white rounded">
          Go to Trade Page
        </Link>

      </div>
    </div>
  );
};

export default Home;
