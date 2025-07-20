// src/KotakGetAccounts.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const KotakGetAccount = () => {
  const [details, setDetails] = useState([]);   // each account’s full detail
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // 1. fetch every account
        const res = await axios.post("/get-all-accounts", {});
        // 2. only keep Kotak ones
        const kotakAccounts = res.data.accounts.filter(a => a.traderType === "kotak");

        // 3. fetch detail for each Kotak account
        const detailPromises = kotakAccounts.map(acc =>
          axios
            .post("/get-account-details", {
              traderType: "kotak",
              name: acc.name
            })
            .then(r => ({ name: acc.name, ...r.data }))
        );

        const allDetails = await Promise.all(detailPromises);
        setDetails(allDetails);
      } catch (err) {
        console.error(err);
        setError("Failed to load Kotak accounts or details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) return <p className="p-4">Loading accounts…</p>;
  if (error)   return <p className="p-4 text-red-600">{error}</p>;

  // Determine all detail fields returned, so we can render them dynamically
  const columns = details.length > 0
    ? Object.keys(details[0]).filter(key => key !== "name")
    : [];

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">All Kotak Accounts & Details</h2>

      {details.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Account Name
                </th>
                {columns.map(col => (
                  <th
                    key={col}
                    className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                  >
                    {col.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {details.map((acct, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-800">{acct.name}</td>
                  {columns.map(col => (
                    <td
                      key={col}
                      className="px-4 py-2 text-sm text-gray-800 break-all"
                    >
                      {typeof acct[col] === "object"
                        ? JSON.stringify(acct[col])
                        : acct[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No Kotak accounts found.</p>
      )}

      <div className="mt-6 flex space-x-4">
        <Link to="/" className="text-blue-500 hover:underline">
          ← Back to Home
        </Link>
        <Link to="/kotakAdd" className="text-blue-500 hover:underline">
          Add New Kotak Account →
        </Link>
      </div>
    </div>
  );
};

export default KotakGetAccount;
