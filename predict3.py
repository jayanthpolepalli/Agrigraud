import joblib
import numpy as np
import pandas as pd

def fast_predict():
    # 1. Load the Model and Encoders
    try:
        model = joblib.load('crop_model.pkl')
        soil_le = joblib.load('soil_encoder.pkl')
        label_le = joblib.load('label_encoder.pkl')
        mlb = joblib.load('water_source_mlb.pkl')
    except FileNotFoundError:
        print("Error: Missing .pkl files.")
        return

    print("\n" + "="*50)
    print("PASTE ALL VALUES AT ONCE (Comma Separated)")
    print("Format: N, P, K, pH, Soil_Type, Past_Temp, Future_Temp, Past_Rain, Hum, Future_Prob, SM1, SM2, SM3, Water_Sources")
    print("Example: 90, 42, 43, 6.5, Loamy soil, 28, 27, 1200, 70, 0.8, 30, 28, 35, bore, rainfall")
    print("="*50)

    # 2. Single line input
    raw_input = input("\nPaste here: ")
    
    try:
        # Split and clean whitespace
        data = [x.strip() for x in raw_input.split(',')]
        
        # Mapping values (Index-based)
        # 0:N, 1:P, 2:K, 3:ph, 4:soil_type, 5:past_temp, 6:future_temp, 
        # 7:past_rain, 8:hum, 9:future_prob, 10:sm1, 11:sm2, 12:sm3, 13 onwards: water sources
        
        n, p, k, ph = float(data[0]), float(data[1]), float(data[2]), float(data[3])
        
        # Handle Soil Type
        soil_input = data[4]
        soil_match = next((s for s in soil_le.classes_ if s.lower() == soil_input.lower()), None)
        soil_encoded = soil_le.transform([soil_match])[0]

        past_temp, future_temp = float(data[5]), float(data[6])
        past_rain, hum, future_prob = float(data[7]), float(data[8]), float(data[9])
        sm1, sm2, sm3 = float(data[10]), float(data[11]), float(data[12])
        
        # Handle remaining values as Water Sources
        ws_list = [s.strip().lower() for s in data[13:]]
        ws_encoded = mlb.transform([ws_list])
        
        # 3. Assemble Feature Vector
        base_features = [
            n, p, k, ph, soil_encoded, 
            past_temp, future_temp, past_rain, hum, future_prob,
            sm1, sm2, sm3
        ]
        final_features = np.array(base_features + ws_encoded[0].tolist()).reshape(1, -1)

        # 4. Predict Probabilities
        probabilities = model.predict_proba(final_features)[0]
        crop_probs = []
        for i, prob in enumerate(probabilities):
            crop_name = label_le.inverse_transform([i])[0]
            crop_probs.append((crop_name, prob))
        
        # Sort descending
        crop_probs.sort(key=lambda x: x[1], reverse=True)

        # 5. Output Results
        print("\n" + "="*45)
        print(f"{'RANK':<5} | {'CROP NAME':<20} | {'CONFIDENCE'}")
        print("-" * 45)
        for rank, (name, prob) in enumerate(crop_probs[:3], 1):
            print(f"{rank:<5} | {name.upper():<20} | {prob*100:.2f}%")
        print("="*45)

    except Exception as e:
        print(f"\nError processing input: {e}")
        print("Check if you missed a comma or a value.")

if __name__ == "__main__":
    fast_predict()