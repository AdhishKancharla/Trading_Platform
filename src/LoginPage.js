import React from "react";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  LogIn,
  ShieldCheck,
  User
} from "lucide-react";

const accountActions = [
  { name: "Add Upstox Account",       to: "/upstoxAdd",      icon: PlusCircle,  color: "bg-blue-500" },
  { name: "Get Upstox Account Info",   to: "/upstoxGet",      icon: User,        color: "bg-blue-400" },
  { name: "View Upstox Positions",     to: "/upstoxPositions",icon: User,        color: "bg-red-500" },
  { name: "Add Kotak Account",         to: "/kotakAdd",       icon: PlusCircle,  color: "bg-green-500" },
  { name: "Kotak Login",               to: "/kotakLogin",     icon: LogIn,       color: "bg-green-600" },
  { name: "Authenticate Kotak",        to: "/kotakAuthenticate",icon: ShieldCheck,color: "bg-green-700" },
  { name: "Get Kotak Account Info",    to: "/kotakGet",       icon: User,        color: "bg-green-800" }
];

const LoginPage = () => (
  <div className="p-6 max-w-4xl mx-auto">
    <header className="mb-6 text-center">
      <h2 className="text-3xl font-extrabold">Account Management</h2>
      <p className="text-gray-600">Add, login, or retrieve your trading accounts</p>
    </header>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {accountActions.map(({ name, to, icon: Icon, color }) => (
        <Link
          key={name}
          to={to}
          className={`${color} p-5 rounded-xl shadow hover:shadow-lg transform hover:scale-105 transition flex items-center space-x-3`}
        >
          <Icon className="w-6 h-6 text-white" />
          <span className="text-white font-medium">{name}</span>
        </Link>
      ))}
    </div>
    <div className="mt-8 text-center">
      <Link to="/" className="text-blue-500 hover:underline">
        ← Back to Home
      </Link>
    </div>
  </div>
);

export default LoginPage;
