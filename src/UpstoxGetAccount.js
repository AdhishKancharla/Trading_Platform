// src/UpstoxGetAccounts.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UpstoxGetAccount = () => {
  const [details, setDetails] = useState([]);             // [{ name, access_token, … }]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // 1. get all accounts
        const res = await axios.post("/get-all-accounts", {}); 
        const ups = res.data.accounts.filter(a => a.traderType === "upstox");

        // 2. fetch details for each
        const detailPromises = ups.map(acc =>
          axios
            .post("/get-account-details", {
              traderType: "upstox",
              name: acc.name
            })
            .then(r => ({ name: acc.name, ...r.data }))
        );

        const allDetails = await Promise.all(detailPromises);  // :contentReference[oaicite:1]{index=1}
        setDetails(allDetails);
      } catch (err) {
        console.error(err);
        setError("Failed to load Upstox accounts or details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) return <p className="p-4">Loading accounts…</p>;
  if (error)   return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">All Upstox Accounts & Details</h2>

      {details.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Account Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Access Token
                </th>
                {/* add more columns here if your API returns more fields */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {details.map((acct, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-800">{acct.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-800 break-all">
                    {acct.access_token}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No Upstox accounts found.</p>
      )}

      <div className="mt-6 flex space-x-4">
        <Link to="/" className="text-blue-500 hover:underline">
          ← Back to Home
        </Link>
        <Link to="/upstoxAdd" className="text-blue-500 hover:underline">
          Add New Upstox Account →
        </Link>
      </div>
    </div>
  );
};

export default UpstoxGetAccount;
