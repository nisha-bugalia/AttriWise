import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from imblearn.over_sampling import SMOTE
import joblib
import os

# 1. Load data
df = pd.read_csv("backend\WA_Fn-UseC_-HR-Employee-Attrition.csv")
df = df.drop(['EmployeeCount', 'Over18', 'StandardHours', 'EmployeeNumber'], axis=1)

# 2. Encode categorical columns
label_encoders = {}
for col in df.select_dtypes(include='object').columns:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

# 3. Prepare features/target
X = df.drop("Attrition", axis=1)
y = df["Attrition"]

# 4. Split and balance
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X_train, y_train)

# 5. Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_resampled, y_resampled)

# 6. Save model, encoders, and column names
os.makedirs("model", exist_ok=True)
joblib.dump(model, "model/attrition_model.pkl")
joblib.dump(label_encoders, "model/label_encoder.pkl")
joblib.dump(X.columns.tolist(), "model/feature_columns.pkl")

print("✅ All files saved successfully!")
