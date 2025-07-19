import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  LogIn,
  ShieldCheck,
  BarChart2,
  ShoppingCart,
  Edit,
  XCircle,
  Layers,
  RefreshCw
} from "lucide-react";

const sections = [
  {
    title: "Account Management",
    actions: [
      { name: "Add Upstox Account", to: "/upstoxAdd", icon: PlusCircle, color: "bg-blue-500" },
      { name: "Add Kotak Account", to: "/kotakAdd", icon: PlusCircle, color: "bg-blue-500" },
      { name: "Login Kotak", to: "/kotakLogin", icon: LogIn, color: "bg-green-500" },
      { name: "Authenticate Kotak", to: "/kotakAuthenticate", icon: ShieldCheck, color: "bg-green-500" },
      { name: "View Upstox Positions", to: "/upstoxPositions", icon: BarChart2, color: "bg-red-500" },
    ]
  },
  {
    title: "Trading",
    actions: [
      { name: "Place Trade", to: "/trade", icon: ShoppingCart, color: "bg-green-600" },
      { name: "Modify Order", to: "/modifyOrder", icon: Edit, color: "bg-yellow-500" },
      { name: "Cancel Order", to: "/cancelOrder", icon: XCircle, color: "bg-red-600" },
      { name: "Add Baskets", to: "/Ironfly", icon: Layers, color: "bg-purple-500" },
      { name: "Manage Baskets", to: "/baskets", icon: RefreshCw, color: "bg-purple-700" },
    ]
  }
];

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold">Trading Platform</h1>
        <p className="mt-2 text-gray-600">Manage your trading credentials and place orders</p>
      </header>

      <nav className="flex justify-center space-x-6 mb-6 border-b">
        {sections.map((sec, idx) => (
          <button
            key={sec.title}
            onClick={() => setActiveIndex(idx)}
            className={`pb-2 text-lg font-medium cursor-pointer transition-colors ${
              activeIndex === idx
                ? "border-b-4 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {sec.title}
          </button>
        ))}
      </nav>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections[activeIndex].actions.map(({ name, to, icon: Icon, color }) => (
            <Link
              key={name}
              to={to}
              className={`${color} p-6 rounded-2xl shadow-md hover:shadow-xl transform hover:scale-105 transition cursor-pointer flex flex-col items-center justify-center`}
            >
              <Icon className="w-10 h-10 text-white mb-4" />
              <span className="text-white font-semibold text-center">{name}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
