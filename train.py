import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, MultiLabelBinarizer
import joblib

# 1. Load the corrected dataset
df = pd.read_csv('Hackathon_Training_Data_Final.csv')

# 2. Handle Multi-Value 'water_source' (Bore, Canal, Rainfall)
# Convert string "bore, rainfall" -> list ["bore", "rainfall"]
df['ws_list'] = df['water_source'].apply(lambda x: [s.strip() for s in x.split(',')])
mlb = MultiLabelBinarizer()
ws_encoded = mlb.fit_transform(df['ws_list'])
ws_df = pd.DataFrame(ws_encoded, columns=mlb.classes_)

# Merge binary columns and drop the original source column
df = pd.concat([df.drop(['water_source', 'ws_list'], axis=1), ws_df], axis=1)

# 3. Encode categorical Soil Type
soil_le = LabelEncoder()
df['soil_type'] = soil_le.fit_transform(df['soil_type'])

# 4. Encode Target Labels (Crops)
label_le = LabelEncoder()
df['label'] = label_le.fit_transform(df['label'])

# 5. Define Features (X) and Target (y)
# Ensure 'label' is not in features
X = df.drop('label', axis=1)
y = df['label']

# 6. Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 7. Train the Model (Random Forest)
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 8. Export Model Weights and Encoders
joblib.dump(model, 'crop_model.pkl')
joblib.dump(soil_le, 'soil_encoder.pkl')
joblib.dump(label_le, 'label_encoder.pkl')
joblib.dump(mlb, 'water_source_mlb.pkl')

print(f"Success! Accuracy: {model.score(X_test, y_test)*100:.2f}%")
print("Exported: crop_model.pkl, soil_encoder.pkl, label_encoder.pkl, water_source_mlb.pkl")