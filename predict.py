import joblib
import numpy as np
import pandas as pd

def predict_crop_console():
    # 1. Load the Model and Encoders
    try:
        model = joblib.load('crop_model.pkl')
        soil_le = joblib.load('soil_encoder.pkl')
        label_le = joblib.load('label_encoder.pkl')
        mlb = joblib.load('water_source_mlb.pkl')
    except FileNotFoundError:
        print("Error: Model or Encoder files not found. Please ensure the .pkl files are in the same directory.")
        return

    print("--- Crop Recommendation System: User Input ---")
    
    # 2. Collect Inputs from Console
    try:
        n = float(input("Enter Nitrogen (N): "))
        p = float(input("Enter Phosphorus (P): "))
        k = float(input("Enter Potassium (K): "))
        ph = float(input("Enter Soil pH (e.g., 6.5): "))
        
        print(f"Available Soil Types: {list(soil_le.classes_)}")
        soil_type = input("Enter Soil Type: ").strip()
        
        past_temp = float(input("Enter Past Average Temperature (°C): "))
        future_temp = float(input("Enter Future Forecast Temperature (°C): "))
        past_rainfall = float(input("Enter Past Total Rainfall (mm): "))
        humidity = float(input("Enter Relative Humidity (%): "))
        future_precip_prob = float(input("Enter Future Precipitation Probability (0 to 1): "))
        
        sm_0_1 = float(input("Enter Soil Moisture 0-1cm (%): "))
        sm_1_3 = float(input("Enter Soil Moisture 1-3cm (%): "))
        sm_3_9 = float(input("Enter Soil Moisture 3-9cm (%): "))
        
        print("Available Water Sources: bore, canals, rainfall")
        water_source_raw = input("Enter Water Sources (comma separated, e.g., 'bore, rainfall'): ")
        
        # 3. Preprocessing Categorical Inputs
        # Encode Soil Type
        try:
            soil_encoded = soil_le.transform([soil_type])[0]
        except ValueError:
            print(f"Error: '{soil_type}' is not a recognized soil type.")
            return

        # Encode Water Source (Multi-label)
        # Convert "bore, rainfall" -> ["bore", "rainfall"]
        ws_list = [s.strip().lower() for s in water_source_raw.split(',')]
        ws_encoded = mlb.transform([ws_list]) # Returns a 2D array [[1, 0, 1]]
        
        # 4. Combine all features into a single vector
        # Order must match training: N, P, K, ph, soil_type, past_temp, future_temp, 
        # past_rainfall, humidity, future_precip_prob, sm_0_1, sm_1_3, sm_3_9, bore, canals, rainfall
        base_features = [
            n, p, k, ph, soil_encoded, 
            past_temp, future_temp, past_rainfall, humidity, future_precip_prob,
            sm_0_1, sm_1_3, sm_3_9
        ]
        
        # Combine base features + the binary columns from mlb
        final_features = np.array(base_features + ws_encoded[0].tolist()).reshape(1, -1)
        
        # 5. Make Prediction
        prediction_id = model.predict(final_features)
        crop_name = label_le.inverse_transform(prediction_id)[0]
        
        # Get Confidence (Optional but great for Hackathons)
        proba = model.predict_proba(final_features)
        confidence = np.max(proba) * 100

        print("\n" + "="*30)
        print(f"RECOMMENDED CROP: {crop_name.upper()}")
        print(f"Confidence Level: {confidence:.2f}%")
        print("="*30)

    except ValueError as e:
        print(f"Input Error: Please enter valid numeric values. Details: {e}")

if __name__ == "__main__":
    predict_crop_console()