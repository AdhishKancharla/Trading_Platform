import React from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Layers,
  RefreshCw
} from "lucide-react";

const tradeActions = [
  { name: "Place Trade",     to: "/trade",        icon: ShoppingCart, color: "bg-green-600" },
  { name: "Add Baskets",     to: "/Ironfly",      icon: Layers,       color: "bg-purple-500" },
  { name: "Manage Baskets",  to: "/baskets",      icon: RefreshCw,    color: "bg-purple-700" },
];

const Home = () => (
  <div className="p-6 max-w-5xl mx-auto">
    <header className="mb-8 text-center">
      <h1 className="text-4xl font-extrabold">Trading Platform</h1>
      <p className="mt-2 text-gray-600">Quick access to trading tools</p>
    </header>

    <div className="flex justify-center mb-6">
      <Link
        to="/login"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Login / Accounts
      </Link>
    </div>

    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tradeActions.map(({ name, to, icon: Icon, color }) => (
          <Link
            key={name}
            to={to}
            className={`${color} p-6 rounded-2xl shadow-md hover:shadow-xl transform hover:scale-105 transition flex flex-col items-center justify-center`}
          >
            <Icon className="w-10 h-10 text-white mb-4" />
            <span className="text-white font-semibold text-center">{name}</span>
          </Link>
        ))}
      </div>
    </section>
  </div>
);

export default Home;
