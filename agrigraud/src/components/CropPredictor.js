import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../App.css";

// Fix Leaflet marker icons for React environments
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerRetina from "leaflet/dist/images/marker-icon-2x.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconRetinaUrl: markerRetina,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const SOIL_TYPES = [
  "Loamy soil",
  "Alluvial soil",
  "Black Soil",
  "Red soil",
  "Sandy soil",
  "Clay soil",
  "Laterite soil",
];

// Component to handle map clicks
function LocationMarker({ location, setLocation }) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });
  return location ? <Marker position={location} /> : null;
}

// Critical component to fix "shattered tiles" and center the map
function MapResizer({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      // Small delay ensures the DOM transition is complete
      const timer = setTimeout(() => {
        map.invalidateSize(); 
        map.flyTo(center, 13, { duration: 1.5 });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [center, map]);

  return null;
}

export default function CropPredictor() {
  const [location, setLocation] = useState(null);
  const [center, setCenter] = useState([20.5937, 78.9629]); // Default: India
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    n: "",
    p: "",
    k: "",
    ph: "",
    soil_type: "Loamy soil",
    water_sources: "",
  });

  // Automatically request location on load
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
      () => {
        alert("Location access denied. Please click on the map manually.");
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      alert("Please select your farm location on the map!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        n: parseFloat(formData.n),
        p: parseFloat(formData.p),
        k: parseFloat(formData.k),
        ph: parseFloat(formData.ph),
        water_sources: formData.water_sources.split(",").map(s => s.trim()),
        lat: location.lat,
        lng: location.lng,
      };

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setResults(data.top_crops || []);
    } catch (err) {
      alert("Backend server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#15803d' }}>🌾 Crop Recommendation Engine</h1>
        <p style={{ color: '#666' }}>Pinpoint your farm and provide soil details for analysis</p>
      </header>

      <div className="map-wrapper">
        <MapContainer
          key={`${center[0]}-${center[1]}`} // FORCE RE-RENDER ON LOCATION CHANGE
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          className="map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker location={location} setLocation={setLocation} />
          <MapResizer center={center} />
        </MapContainer>

        <button
          className="location-btn"
          onClick={handleUseCurrentLocation}
          disabled={loadingLocation}
          type="button"
        >
          {loadingLocation ? "Locating..." : "📍 Use My Location"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="prediction-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Nitrogen (N)</label>
            <input type="number" id="n" placeholder="mg/kg" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phosphorus (P)</label>
            <input type="number" id="p" placeholder="mg/kg" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Potassium (K)</label>
            <input type="number" id="k" placeholder="mg/kg" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>pH Level</label>
            <input type="number" step="0.1" id="ph" placeholder="0-14" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Soil Type</label>
            <select id="soil_type" onChange={handleChange} value={formData.soil_type}>
              {SOIL_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Water Sources</label>
            <input type="text" id="water_sources" placeholder="borewell, rainfall" onChange={handleChange} required />
          </div>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Analyzing Soil..." : "Get Recommendations"}
        </button>
      </form>

      {results.length > 0 && (
        <div className="results fade-in" style={{ marginTop: '30px' }}>
          <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Recommended Crops</h2>
          <div className="crop-grid">
            {results.map((crop, index) => (
              <div key={index} className="crop-card">
                <strong>{crop.crop || crop}</strong>
                {crop.confidence && (
                  <div className="confidence-bar">
                    <div className="fill" style={{ width: `${crop.confidence}%` }}></div>
                    <small>{crop.confidence}% Match</small>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}