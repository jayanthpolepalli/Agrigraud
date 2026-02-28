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
    """Fetches environmental and soil data from Open-Meteo"""
    # 1. Historical & Forecast (Temperature, Rain, Humidity)
    # We use the forecast endpoint with 'past_days' to get recent historical data
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lng,
        "hourly": ["temperature_2m", "precipitation", "relative_humidity_2m", "precipitation_probability"],
        "past_days": 7,
        "forecast_days": 1
    }
    responses = openmeteo.get(url, params=params)
    res = responses[0]
    hourly = res.Hourly()
    
    # Extract means (simplified for model input)
    temp_past = np.mean(hourly.Variables(0).ValuesAsNumpy()[:168]) # Last 7 days
    temp_future = np.mean(hourly.Variables(0).ValuesAsNumpy()[168:]) # Next 24h
    precip_past = np.sum(hourly.Variables(1).ValuesAsNumpy()[:168])
    hum_mean = np.mean(hourly.Variables(2).ValuesAsNumpy())
    future_prob = np.max(hourly.Variables(3).ValuesAsNumpy()[168:]) / 100.0 # Max prob next 24h

    # 2. Soil Moisture (DWD ICON model for high accuracy)
    soil_url = "https://api.open-meteo.com/v1/dwd-icon"
    soil_params = {
        "latitude": lat,
        "longitude": lng,
        "hourly": ["soil_moisture_0_to_1cm", "soil_moisture_1_to_3cm", "soil_moisture_3_to_9cm"]
    }
    soil_res = openmeteo.get(soil_url, params=soil_params)[0].Hourly()
    sm1 = soil_res.Variables(0).ValuesAsNumpy()[0] # Current hour
    sm2 = soil_res.Variables(1).ValuesAsNumpy()[0]
    sm3 = soil_res.Variables(2).ValuesAsNumpy()[0]

    return {
        "past_temp": temp_past, "future_temp": temp_future,
        "past_rain": precip_past, "hum": hum_mean, "future_prob": future_prob,
        "sm1": sm1, "sm2": sm2, "sm3": sm3
    }

@app.post("/predict")
async def predict_crop(req: PredictionRequest):
    try:
        # Step 1: Automated Weather Retrieval
        env_data = fetch_weather_data(req.lat, req.lng)

        # Step 2: Encoding User Inputs
        soil_match = next((s for s in soil_le.classes_ if s.lower() == req.soil_type.lower()), None)
        soil_encoded = soil_le.transform([soil_match])[0]
        ws_encoded = mlb.transform([[s.lower() for s in req.water_sources]])

        # Step 3: Feature Assembly (Matching your model's required order)
        features = [
            req.n, req.p, req.k, req.ph, soil_encoded,
            env_data["past_temp"], env_data["future_temp"],
            env_data["past_rain"], env_data["hum"], env_data["future_prob"],
            env_data["sm1"], env_data["sm2"], env_data["sm3"]
        ]
        final_features = np.array(features + ws_encoded[0].tolist()).reshape(1, -1)

        # Step 4: Predict
        probs = model.predict_proba(final_features)[0]
        results = [{"crop": label_le.inverse_transform([i])[0], "confidence": round(p*100, 2)} 
                   for i, p in enumerate(probs)]
        results.sort(key=lambda x: x["confidence"], reverse=True)

        return {"top_crops": results[:3], "retrieved_weather": env_data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))