import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/* Fix Leaflet marker icons */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ---------------- Map Click + Marker ---------------- */
function LocationMarker({ location, setLocation }) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });

  return location ? (
    <Marker
      position={location}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const { lat, lng } = e.target.getLatLng();
          setLocation({ lat, lng });
        },
      }}
    />
  ) : null;
}

/* ---------------- Map Resizer ---------------- */
function MapResizer({ center }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [center, map]);
  return null;
}

/* ================= MAIN COMPONENT ================= */
export default function CropRecommendations() {
  const [location, setLocation] = useState(null);
  const [center, setCenter] = useState([20.5937, 78.9629]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const [formData, setFormData] = useState({
    n: "",
    p: "",
    k: "",
    ph: "",
    soil_type: "Loamy soil",
    water_sources: "",
  });

  /* ---------- Auto Get Location ---------- */
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setLocation(coords);
        setCenter([coords.lat, coords.lng]);
      });
    }
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  /* ---------- Submit Handler ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      alert("Please select a location on the map!");
      return;
    }

    setLoading(true);
    setResults([]);

    const payload = {
      n: parseFloat(formData.n),
      p: parseFloat(formData.p),
      k: parseFloat(formData.k),
      ph: parseFloat(formData.ph),
      soil_type: formData.soil_type,
      water_sources: formData.water_sources
        .split(",")
        .map((s) => s.trim()),
      lat: location.lat,
      lng: location.lng,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      setResults(data.top_crops || []);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h2 style={styles.heading}>
          Crop Prediction & Soil Analysis
        </h2>

        {/* ---------- MAP ---------- */}
        <div style={{ marginBottom: "20px" }}>
          <MapContainer
            center={center}
            zoom={13}
            style={styles.map}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker
              location={location}
              setLocation={setLocation}
            />
            <MapResizer center={center} />
          </MapContainer>
        </div>

        {/* ---------- FORM ---------- */}
        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            {[
              ["Nitrogen (N) - mg/kg", "n", "e.g., 45.5"],
              ["Phosphorus (P) - mg/kg", "p", "e.g., 60.0"],
              ["Potassium (K) - mg/kg", "k", "e.g., 30.25"],
              ["pH Level", "ph", "e.g., 6.5"],
            ].map(([label, id, placeholder]) => (
              <div key={id} style={styles.group}>
                <label style={styles.label}>{label}</label>
                <input
                  type="number"
                  id={id}
                  step="any"
                  placeholder={placeholder}
                  required
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            ))}

            <div style={styles.group}>
              <label style={styles.label}>Soil Type</label>
              <select
                id="soil_type"
                onChange={handleChange}
                style={styles.input}
              >
                <option value="Loamy soil">Loamy Soil</option>
                <option value="Clayey soil">Clayey Soil</option>
                <option value="Sandy soil">Sandy Soil</option>
                <option value="Black soil">Black Soil</option>
              </select>
            </div>

            <div style={styles.group}>
              <label style={styles.label}>
                Water Sources (bore, canals, rainfall)
              </label>
              <input
                type="text"
                id="water_sources"
                required
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading
              ? "Processing..."
              : "Analyze & Get Recommendations"}
          </button>
        </form>

        {/* ---------- RESULTS ---------- */}
        {results.length > 0 && (
          <div style={styles.results}>
            <h3 style={styles.resultsTitle}>
              🎯 Top Recommended Crops
            </h3>
            <p style={styles.resultsSubtitle}>Based on your soil analysis and location</p>

            <div style={styles.cropCardsContainer}>
              {results.map((item, index) => (
                <div 
                  key={index} 
                  style={{
                    ...styles.card,
                    borderLeft: index === 0 ? '6px solid #fbbf24' : index === 1 ? '6px solid #94a3b8' : index === 2 ? '6px solid #cd7f32' : '6px solid #2e7d32',
                  }}
                >
                  {/* Rank Badge */}
                  <div style={{
                    ...styles.rankBadge,
                    background: index === 0 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : index === 1 ? 'linear-gradient(135deg, #94a3b8, #64748b)' : index === 2 ? 'linear-gradient(135deg, #cd7f32, #a0522d)' : 'linear-gradient(135deg, #2e7d32, #1b5e20)'
                  }}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>

                  {/* Crop Info */}
                  <div style={styles.cropInfo}>
                    <strong style={styles.cropName}>{item.crop}</strong>
                    <span style={styles.cropMatch}>Match Score</span>
                  </div>

                  {/* Percentage Display */}
                  <div style={styles.percentageContainer}>
                    <span style={styles.percentage}>{item.confidence}%</span>
                    <div style={styles.progressBarBackground}>
                      <div 
                        style={{
                          ...styles.progressBarFill,
                          width: `${item.confidence}%`,
                          background: index === 0 ? 'linear-gradient(90deg, #fbbf24, #f59e0b)' : index === 1 ? 'linear-gradient(90deg, #94a3b8, #64748b)' : index === 2 ? 'linear-gradient(90deg, #cd7f32, #a0522d)' : 'linear-gradient(90deg, #2e7d32, #4caf50)'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Box */}
            <div style={styles.summaryBox}>
              <div style={styles.summaryIcon}>💡</div>
              <div>
                <strong>Best Choice: {results[0]?.crop}</strong>
                <p style={styles.summaryText}>With {results[0]?.confidence}% confidence, {results[0]?.crop} is recommended based on your soil's NPK levels and pH value.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  body: {
    background: "#f4f7f6",
    minHeight: "100vh",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
  },
  container: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "900px",
  },
  heading: {
    textAlign: "center",
    color: "#2e7d32",
    marginBottom: "20px",
  },
  map: {
    height: "350px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginBottom: "20px",
  },
  group: { 
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#555",
    marginBottom: "5px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "1rem",
  },
  button: {
    width: "100%",
    background: "#2e7d32",
    color: "#fff",
    padding: "15px",
    border: "none",
    borderRadius: "6px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
  results: {
    marginTop: "30px",
    paddingTop: "20px",
    borderTop: "2px solid #eee",
  },
  resultsTitle: {
    color: "#1b5e20",
    fontSize: "1.5rem",
    marginBottom: "5px",
    textAlign: "center",
  },
  resultsSubtitle: {
    color: "#666",
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "0.95rem",
  },
  cropCardsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  card: {
    display: "flex",
    alignItems: "center",
    padding: "18px",
    borderRadius: "12px",
    background: "#fff",
    borderLeft: "6px solid #2e7d32",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  rankBadge: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.3rem",
    marginRight: "15px",
    flexShrink: 0,
  },
  cropInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  cropName: {
    fontSize: "1.2rem",
    color: "#1a1a1a",
    fontWeight: "600",
  },
  cropMatch: {
    fontSize: "0.8rem",
    color: "#888",
    marginTop: "2px",
  },
  percentageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    minWidth: "100px",
  },
  percentage: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: "5px",
  },
  progressBarBackground: {
    width: "100px",
    height: "8px",
    background: "#e0e0e0",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.6s ease",
  },
  summaryBox: {
    marginTop: "25px",
    padding: "20px",
    background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    border: "1px solid #a5d6a7",
  },
  summaryIcon: {
    fontSize: "2rem",
  },
  summaryText: {
    margin: "5px 0 0 0",
    color: "#2e7d32",
    fontSize: "0.95rem",
    lineHeight: "1.5",
  },
};
