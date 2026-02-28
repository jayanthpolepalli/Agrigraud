import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

# 1. Load Dataset
df = pd.read_csv('Hackathon_Training_Data_Final.csv')

# 2. Load Encoders
soil_le = joblib.load('soil_encoder.pkl')
label_le = joblib.load('label_encoder.pkl')
mlb = joblib.load('water_source_mlb.pkl')

# 3. Process water_source
df['ws_list'] = df['water_source'].apply(lambda x: [s.strip() for s in x.split(',')])
ws_encoded = mlb.transform(df['ws_list'])
ws_df = pd.DataFrame(ws_encoded, columns=mlb.classes_)

df = pd.concat([df.drop(['water_source', 'ws_list'], axis=1), ws_df], axis=1)

# 4. Encode soil_type
df['soil_type'] = soil_le.transform(df['soil_type'])

# 5. Encode labels
df['label'] = label_le.transform(df['label'])

# 6. Split again (same random_state for consistency)
X = df.drop('label', axis=1)
y = df['label']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 7. Load Model
model = joblib.load('crop_model.pkl')

# 8. Predictions
y_train_pred = model.predict(X_train)
y_test_pred = model.predict(X_test)

# 9. Accuracy
train_acc = accuracy_score(y_train, y_train_pred)
test_acc = accuracy_score(y_test, y_test_pred)

print("\n==============================")
print(f"Training Accuracy: {train_acc*100:.2f}%")
print(f"Test Accuracy:     {test_acc*100:.2f}%")
print("==============================")

# 10. Overfitting Check
gap = train_acc - test_acc
print(f"Generalization Gap: {gap*100:.2f}%")

if gap > 0.05:
    print("⚠ Model is Overfitting")
else:
    print("✅ Model Generalizes Well")

# 11. Classification Report
print("\nClassification Report (Test Data):")
print(classification_report(y_test, y_test_pred))