import { useState } from "react";
import { motion } from "framer-motion";

export default function LiveWeather() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const weatherData = {
    icon: "⛅",
    temp: 28,
    condition: "Partly Cloudy",
    humidity: 65,
    wind: 10,
    rainfall: 2,
    uv: 5,
  };

  return (
    <motion.div
      className="weather-card"
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
    >
      <h3>🌦 Live Weather</h3>
      
      <div className="weather-main">
        <span className="weather-icon">{weatherData.icon}</span>
        <span className="weather-temp">{weatherData.temp}°C</span>
      </div>
      
      <p style={{ color: "#6b7280", marginBottom: "16px" }}>
        {weatherData.condition}
      </p>
      
      <div className="weather-details">
        <div className="weather-detail">
          💧 <span>{weatherData.humidity}%</span> Humidity
        </div>
        <div className="weather-detail">
          💨 <span>{weatherData.wind} km/h</span> Wind
        </div>
        <div className="weather-detail">
          🌧 <span>{weatherData.rainfall} mm</span> Rain
        </div>
        <div className="weather-detail">
          ☀️ <span>{weatherData.uv}</span> UV Index
        </div>
      </div>

      <motion.button
        className="refresh-btn"
        onClick={handleRefresh}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isRefreshing ? 360 : 0 }}
        transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
      >
        {isRefreshing ? "Refreshing..." : "🔄 Refresh"}
      </motion.button>
    </motion.div>
  );
}
