from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
from typing import List

app = FastAPI()

# Enable CORS for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Load Model and Encoders once at startup
try:
    model = joblib.load('crop_model.pkl')
    soil_le = joblib.load('soil_encoder.pkl')
    label_le = joblib.load('label_encoder.pkl')
    mlb = joblib.load('water_source_mlb.pkl')
except Exception as e:
    print(f"Error loading model files: {e}")

# 2. Define the Request Schema
class PredictionRequest(BaseModel):
    n: float
    p: float
    k: float
    ph: float
    soil_type: str
    past_temp: float
    future_temp: float
    past_rain: float
    hum: float
    future_prob: float
    sm1: float
    sm2: float
    sm3: float
    water_sources: List[str]

@app.post("/predict")
async def predict_crop(req: PredictionRequest):
    try:
        # Handle Soil Encoding
        soil_match = next((s for s in soil_le.classes_ if s.lower() == req.soil_type.lower()), None)
        if not soil_match:
            raise HTTPException(status_code=400, detail=f"Invalid soil type: {req.soil_type}")
        
        soil_encoded = soil_le.transform([soil_match])[0]

        # Handle Water Sources Encoding
        ws_list = [s.strip().lower() for s in req.water_sources]
        ws_encoded = mlb.transform([ws_list])

        # 3. Assemble Feature Vector
        base_features = [
            req.n, req.p, req.k, req.ph, soil_encoded, 
            req.past_temp, req.future_temp, req.past_rain, req.hum, req.future_prob,
            req.sm1, req.sm2, req.sm3
        ]
        final_features = np.array(base_features + ws_encoded[0].tolist()).reshape(1, -1)

        # 4. Predict
        probabilities = model.predict_proba(final_features)[0]
        
        results = []
        for i, prob in enumerate(probabilities):
            crop_name = label_le.inverse_transform([i])[0]
            results.append({"crop": crop_name, "confidence": round(prob * 100, 2)})

        # Sort and return top 3
        results.sort(key=lambda x: x["confidence"], reverse=True)
        return {"top_crops": results[:3]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)