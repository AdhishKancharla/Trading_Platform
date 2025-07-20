import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from './Home';
import LoginPage from './LoginPage';

import Trade from './Trade';
import Ironfly from "./IronFly";
import SavedBaskets from "./SavedBaskets";

import KotakAdd from './KotakAddAccount';
import KotakLogin from './KotakLogin';
import KotakAuthenticate from './KotakAuthenticate';
import KotakGetAccount from './KotakGetAccount';

import UpstoxAdd from './UpstoxAddAccount';
import UpstoxGetAccount from "./UpstoxGetAccount";
import UpstoxPositions from "./UpstoxPositions";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home + Login */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Trading */}
        <Route path="/trade" element={<Trade />} />
        <Route path="/Ironfly" element={<Ironfly />} />
        <Route path="/baskets" element={<SavedBaskets />} />

        {/* Account Management */}
        <Route path="/kotakAdd" element={<KotakAdd />} />
        <Route path="/kotakLogin" element={<KotakLogin />} />
        <Route path="/kotakAuthenticate" element={<KotakAuthenticate />} />
        <Route path="/kotakGet" element={<KotakGetAccount />} />

        <Route path="/upstoxAdd" element={<UpstoxAdd />} />
        <Route path="/upstoxGet" element={<UpstoxGetAccount />} />
        <Route path="/upstoxPositions" element={<UpstoxPositions />} />
      </Routes>
    </Router>
  );
};

export default App;
