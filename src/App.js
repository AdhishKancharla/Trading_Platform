import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './Home'; 
import Trade from './Trade';
import KotakAdd from './KotakAddAccount'
import KotakLogin from './KotakLogin';
import KotakAuthenticate from './KotakAuthenticate';
import KotakGetAccount from './KotakGetAccount';
import UpstoxAdd from './UpstoxAddAccount'
import UpstoxGetAccount from "./UpstoxGetAccount";
import UpstoxPositions from "./UpstoxPositions";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upstoxAdd" element={<UpstoxAdd />} />
        <Route path="/kotakAdd" element={<KotakAdd />} />
        <Route path="/kotakLogin" element={<KotakLogin />} />
        <Route path="/kotakAuthenticate" element={<KotakAuthenticate />} />
        <Route path="/kotakGet" element={<KotakGetAccount />} />
        <Route path="/upstoxGet" element={<UpstoxGetAccount />} />
        <Route path="/upstoxPositions" element={<UpstoxPositions />} />
        <Route path="/trade" element={<Trade />} />
      </Routes>
    </Router>
  );
};

export default App;
