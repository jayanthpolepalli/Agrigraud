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
import "../App.css";

/* Fix Leaflet marker icons */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const SOIL_TYPES = [
  "Alluvial soil", "Black Soil", "black cotton soil", "brown Loamy soil", 
  "Clay soil", "clay Loamy soil", "cotton soil", "deep soil", 
  "friable soil", "heavy Black Soil", "heavy soil", "Laterite soil", 
  "light Loamy soil", "light soil", "Loamy soil", "medium Black Soil", 
  "Red soil", "red Loamy soil", "red lateritic Loamy soil", "rich red Loamy soil", 
  "salty clay Loamy soil", "Sandy soil", "sandy Loamy soil", "sandy clay Loamy soil", 
  "sandy loamy soil", "shallow Black Soil", "silty Loamy soil", "well-drained soil", 
  "well-drained loamy soil", "well-grained deep loamy moist soil"
];

function LocationMarker({ location, setLocation }) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });
  return location ? <Marker position={location} /> : null;
}

function MapResizer({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.invalidateSize(); // Fixes the "grey box" or "invisible map" issue
      map.flyTo(center, 13, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

export default function CropPredictor() {
  const [location, setLocation] = useState(null);
  const [center, setCenter] = useState([20.5937, 78.9629]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [formData, setFormData] = useState({
    n: "", p: "", k: "", ph: "",
    soil_type: "Loamy soil",
    water_sources: "",
  });
  const [errors, setErrors] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleUseCurrentLocation();
  }, []);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords);
        setCenter([coords.lat, coords.lng]);
        setLoadingLocation(false);
      },
      () => setLoadingLocation(false),
      { enableHighAccuracy: true }
    );
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) return alert("Please select a location on the map!");
    
    setLoading(true);
    try {
      const payload = {
        ...formData,
        n: parseFloat(formData.n),
        p: parseFloat(formData.p),
        k: parseFloat(formData.k),
        ph: parseFloat(formData.ph),
        water_sources: formData.water_sources.split(",").map(s => s.trim().toLowerCase()),
        lat: location.lat,
        lng: location.lng
      };

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setResults(data.top_crops || []);
    } catch (err) {
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Crop Recommendation Engine</h1>
        <p>Select your field on the map and enter soil data.</p>
      </header>

      <div className="map-wrapper">
        {/* The 'key' forces the map to re-render when center changes, ensuring it doesn't stay 'lost' */}
        <MapContainer 
          key={`${center[0]}-${center[1]}`} 
          center={center} 
          zoom={13} 
          className="map-instance"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker location={location} setLocation={setLocation} />
          <MapResizer center={center} />
        </MapContainer>
        
        <button 
          type="button" 
          className="location-btn" 
          onClick={handleUseCurrentLocation} 
          disabled={loadingLocation}
        >
          {loadingLocation ? "Locating..." : "📍 Use My Location"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="prediction-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Nitrogen (N)</label>
            <input type="number" id="n" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phosphorus (P)</label>
            <input type="number" id="p" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Potassium (K)</label>
            <input type="number" id="k" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>pH Level</label>
            <input type="number" id="ph" step="0.1" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Soil Type</label>
            <select id="soil_type" onChange={handleChange}>
              {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Water Sources</label>
            <input type="text" id="water_sources" placeholder="borewell, rain" onChange={handleChange} required />
          </div>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Analyzing..." : "Get Recommendations"}
        </button>
      </form>
      
      {/* Results rendering remains the same */}
    </div>
  );
}