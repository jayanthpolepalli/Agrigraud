import { useState } from "react";
import { motion } from "framer-motion";

const cropRecommendations = {
  paddy: { name: "Paddy/Rice", yield: "4-6 tons/ha", season: "Kharif" },
  wheat: { name: "Wheat", yield: "3-4 tons/ha", season: "Rabi" },
  cotton: { name: "Cotton", yield: "1.5-2 tons/ha", season: "Kharif" },
  maize: { name: "Maize", yield: "6-8 tons/ha", season: "Kharif" },
  soybean: { name: "Soybean", yield: "2-3 tons/ha", season: "Kharif" },
  groundnut: { name: "Groundnut", yield: "2-3 tons/ha", season: "Rabi" },
};

export default function CropRecommendation() {
  const [formData, setFormData] = useState({
    soilType: "",
    season: "",
    rainfall: "",
    temperature: "",
  });
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate recommendation based on form data
    const crops = Object.keys(cropRecommendations);
    const randomCrop = crops[Math.floor(Math.random() * crops.length)];
    setResult(cropRecommendations[randomCrop]);
  };

  return (
    <section className="interactive-section">
      <h2 className="section-title">🌱 Get Crop Recommendations</h2>
      
      <motion.form
        className="crop-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="form-group">
          <label>Soil Type</label>
          <select
            value={formData.soilType}
            onChange={(e) =>
              setFormData({ ...formData, soilType: e.target.value })
            }
            required
          >
            <option value="">Select Soil Type</option>
            <option value="clay">Clay Soil</option>
            <option value="sandy">Sandy Soil</option>
            <option value="loamy">Loamy Soil</option>
            <option value="black">Black Soil</option>
            <option value="red">Red Soil</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Season</label>
            <select
              value={formData.season}
              onChange={(e) =>
                setFormData({ ...formData, season: e.target.value })
              }
              required
            >
              <option value="">Select Season</option>
              <option value="kharif">Kharif (Monsoon)</option>
              <option value="rabi">Rabi (Winter)</option>
              <option value="zaid">Zaid (Summer)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Rainfall (mm)</label>
            <input
              type="number"
              placeholder="e.g., 1000"
              value={formData.rainfall}
              onChange={(e) =>
                setFormData({ ...formData, rainfall: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Temperature (°C)</label>
          <input
            type="number"
            placeholder="e.g., 25"
            value={formData.temperature}
            onChange={(e) =>
              setFormData({ ...formData, temperature: e.target.value })
            }
            required
          />
        </div>

        <motion.button
          type="submit"
          className="btn-primary"
          style={{ width: "100%" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🌾 Get Recommendation
        </motion.button>

        {result && (
          <motion.div
            className="result-box"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h4>Recommended Crop</h4>
            <p>{result.name}</p>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
              Expected Yield: {result.yield} | Season: {result.season}
            </p>
          </motion.div>
        )}
      </motion.form>
    </section>
  );
}
