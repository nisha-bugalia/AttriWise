import joblib

feature_cols = joblib.load("model/feature_columns.pkl")
print("Expected Columns:", feature_cols)
