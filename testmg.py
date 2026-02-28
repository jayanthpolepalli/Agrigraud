import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

def check_saved_models():
    print("--- Loading Saved Models and Encoders ---")
    try:
        # 1. Load all the saved components
        model = joblib.load('crop_model.pkl')
        soil_le = joblib.load('soil_encoder.pkl')
        label_le = joblib.load('label_encoder.pkl')
        mlb = joblib.load('water_source_mlb.pkl')
        
        # 2. Load the final dataset
        df = pd.read_csv('Hackathon_Training_Data_Final.csv')
        
        # 3. Repeat the exact Preprocessing (Transforming, not Fitting)
        # Convert water_source string to binary columns using the LOADED MLB
        df['ws_list'] = df['water_source'].apply(lambda x: [s.strip() for s in x.split(',')])
        ws_encoded = mlb.transform(df['ws_list'])
        ws_df = pd.DataFrame(ws_encoded, columns=mlb.classes_)
        
        # Merge and drop columns
        df_processed = pd.concat([df.drop(['water_source', 'ws_list'], axis=1), ws_df], axis=1)
        
        # Encode categorical columns using the LOADED LabelEncoders
        df_processed['soil_type'] = soil_le.transform(df_processed['soil_type'])
        df_processed['label'] = label_le.transform(df_processed['label'])
        
        # 4. Re-split the data exactly as we did in training
        # We use random_state=42 to ensure we get the SAME test set
        X = df_processed.drop('label', axis=1)
        y = df_processed['label']
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # 5. Calculate Accuracy using the LOADED model weights
        train_preds = model.predict(X_train)
        test_preds = model.predict(X_test)
        
        train_acc = accuracy_score(y_train, train_preds)
        test_acc = accuracy_score(y_test, test_preds)
        
        print("\n" + "="*40)
        print(f"RESULTS FOR LOADED MODEL FILES")
        print("-" * 40)
        print(f"Accuracy on Training Data: {train_acc * 100:.2f}%")
        print(f"Accuracy on Testing Data:  {test_acc * 100:.2f}%")
        print("="*40)
        
        # Final Diagnosis
        gap = (train_acc - test_acc) * 100
        if gap < 2:
            print("Status: EXCELLENT. The model is generalizing perfectly.")
        elif gap < 5:
            print("Status: GOOD. Minor overfitting, but acceptable for hackathon.")
        else:
            print(f"Status: WARNING. High gap ({gap:.2f}%). Model is overfitted.")

    except Exception as e:
        print(f"Error checking models: {e}")
        print("Make sure 'crop_model.pkl' and other .pkl files are in this folder.")

if __name__ == "__main__":
    check_saved_models()