import joblib
import numpy as np
import openmeteo_requests
import requests_cache
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from retry_requests import retry
from typing import List

app = FastAPI()

# Enable CORS for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup Open-Meteo Client with caching for performance
cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
openmeteo = openmeteo_requests.Client(session=retry_session)

# Load Model and Encoders
try:
    model = joblib.load('crop_model.pkl')
    soil_le = joblib.load('soil_encoder.pkl')
    label_le = joblib.load('label_encoder.pkl')
    mlb = joblib.load('water_source_mlb.pkl')
except Exception as e:
    print(f"Error loading model files: {e}")

class PredictionRequest(BaseModel):
    n: float
    p: float
    k: float
    ph: float
    soil_type: str
    water_sources: List[str]
    lat: float
    lng: float

def fetch_weather_data(lat, lng):
    print(f"--- Fetching data for Lat: {lat}, Lng: {lng} ---")
    
    # 1. Weather Data (Forecast & Past)
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lng,
        "hourly": ["temperature_2m", "precipitation", "relative_humidity_2m", "precipitation_probability"],
        "past_days": 7,
        "forecast_days": 1
    }
    
    # Corrected method: use weather_api instead of get
    responses = openmeteo.weather_api(url, params=params)
    res = responses[0]
    hourly = res.Hourly()
    
    # Extract values
    temp_data = hourly.Variables(0).ValuesAsNumpy()
    precip_data = hourly.Variables(1).ValuesAsNumpy()
    hum_data = hourly.Variables(2).ValuesAsNumpy()
    prob_data = hourly.Variables(3).ValuesAsNumpy()
    
    # Math logic (168 hours = 7 days)
    temp_past = np.mean(temp_data[:168])
    temp_future = np.mean(temp_data[168:])
    precip_past = np.sum(precip_data[:168])
    hum_mean = np.mean(hum_data)
    future_prob = np.max(prob_data[168:]) / 100.0

    # 2. Soil Moisture (Using Forecast endpoint for better India coverage)
    # We add soil moisture to the same forecast call to keep it simple and reliable
    params_soil = {
        "latitude": lat,
        "longitude": lng,
        "hourly": ["soil_moisture_0_to_1cm", "soil_moisture_1_to_3cm", "soil_moisture_3_to_9cm"],
    }
    soil_responses = openmeteo.weather_api(url, params=params_soil)
    s_res = soil_responses[0].Hourly()
    
    # Get current hour moisture
    sm1 = s_res.Variables(0).ValuesAsNumpy()[0]
    sm2 = s_res.Variables(1).ValuesAsNumpy()[0]
    sm3 = s_res.Variables(2).ValuesAsNumpy()[0]

    print(f"✅ Data Retrieved Successfully for {lat}, {lng}")
    
    return {
        "past_temp": temp_past, "future_temp": temp_future,
        "past_rain": precip_past, "hum": hum_mean, "future_prob": future_prob,
        "sm1": sm1, "sm2": sm2, "sm3": sm3
    }

@app.post("/predict")
async def predict_crop(req: PredictionRequest):
    try:
        # 1. Fetch Automated Data
        env_data = fetch_weather_data(req.lat, req.lng)

        # 2. Encoding Soil Type
        soil_match = next((s for s in soil_le.classes_ if s.lower().strip() == req.soil_type.lower().strip()), None)
        if soil_match is None:
            raise HTTPException(status_code=400, detail=f"Soil type {req.soil_type} not found")
        soil_encoded = soil_le.transform([soil_match])[0]

        # 3. Encoding Water Sources (bore, canals, rainfall)
        allowed_sources = ['bore', 'canals', 'rainfall']
        user_sources = [s.lower().strip() for s in req.water_sources if s.lower().strip() in allowed_sources]
        ws_encoded = mlb.transform([user_sources])

        # 4. Assemble ALL features (Ensure order matches your training data exactly)
        # Base (5) + Weather/Soil (8) + Water Source Binary (3) = 16 features
        base_inputs = [
            req.n, req.p, req.k, req.ph, soil_encoded,
            env_data["past_temp"], env_data["future_temp"],
            env_data["past_rain"], env_data["hum"], env_data["future_prob"],
            env_data["sm1"], env_data["sm2"], env_data["sm3"]
        ]
        
        # This creates the variable that was missing!
        final_features = np.array(base_inputs + ws_encoded[0].tolist()).reshape(1, -1)

        # 5. Predict
        probs = model.predict_proba(final_features)[0]
        
        # 6. Prepare JSON response (Converting numpy float to python float)
        results = []
        for i, p in enumerate(probs):
            crop_name = label_le.inverse_transform([i])[0]
            results.append({
                "crop": str(crop_name), 
                "confidence": round(float(p) * 100, 2)
            })
        
        results.sort(key=lambda x: x["confidence"], reverse=True)

        # 7. Clean up weather data types for JSON
        serializable_weather = {k: float(v) for k, v in env_data.items()}

        return {
            "top_crops": results[:3], 
            "retrieved_weather": serializable_weather
        }

    except Exception as e:
        print(f"Prediction Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

