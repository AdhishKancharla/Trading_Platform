import React, {useEffect} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Positions from './Positions';
import Home from './Home'; 
import Trade from './Trade';
import Kotak from './Kotak'
import Upstox from './Upstox'

const App = () => {
  useEffect(() => {
    // Check for a session flag.
    // If it doesn't exist, it's a new session (new tab), so clear sensitive localStorage data.
    if (!sessionStorage.getItem("sessionActive")) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("kotakConsumerKey");
      localStorage.removeItem("kotakSecretKey");
      localStorage.removeItem("kotakPan");
      localStorage.removeItem("kotakPassword");
      // Set a flag so that on refresh this doesn't run again.
      sessionStorage.setItem("sessionActive", "true");
    }
  }, []);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upstox" element={<Upstox />} />
        <Route path="/kotak" element={<Kotak />} />
        <Route path="/positions" element={<Positions />} />
        <Route path="/trade" element={<Trade />} />
      </Routes>
    </Router>
  );
};

export default App;
