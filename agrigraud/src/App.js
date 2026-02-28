import React, { useState } from "react";
import 'leaflet/dist/leaflet.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CropPredictor from "./components/CropPredictor";
import CropRecommendations from "./pages/CropRecommendations";
import Marketplace from "./pages/Marketplace";
import languages from "./data/languages";
import "./App.css";

// Placeholder component for Weather route
const Weather = ({ content }) => (
  <div className="page-container">
    <h1>{content.weather.title}</h1>
    <p>{content.weather.comingSoon}</p>
  </div>
);

export default function App() {
  const [lang, setLang] = useState("en");
  const content = languages[lang];

  return (
    <Router>
      <Navbar setLang={setLang} content={content} />
      <Routes>
        <Route path="/" element={<Home content={content} />} />
        <Route path="/login" element={<Login content={content} />} />
        <Route path="/signup" element={<Signup content={content} />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/recommendations" element={<CropPredictor content={content} />} />
        <Route path="/weather" element={<Weather content={content} />} />
      </Routes>
    </Router>
  );
}
