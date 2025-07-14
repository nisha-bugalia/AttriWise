from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import shap
import numpy as np

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "https://attri-wise.vercel.app"])

def interpret_feature(name, value):
    mapping = {
        "Age": lambda v: f"Age ({'young' if v < 30 else 'senior' if v > 45 else 'mid-age'})",
        "BusinessTravel": lambda v: f"Travel Frequency ({['Rarely', 'Frequently', 'Non-Travel'][int(v)]})",
        "JobSatisfaction": lambda v: f"Job Satisfaction ({['Low', 'Medium', 'High', 'Very High'][int(v)-1]})",
        "OverTime": lambda v: "OverTime (Yes)" if v == 1 else "OverTime (No)",
        "MonthlyIncome": lambda v: f"Income ({'low' if v < 3000 else 'high' if v > 8000 else 'moderate'})",
        # Add more feature interpretations here
    }
    return mapping[name](value) if name in mapping else f"{name} ({value})"


# Load model, encoders, and features
model = joblib.load('./backend/model/attrition_model.pkl')
encoder = joblib.load('./backend/model/label_encoder.pkl')
feature_cols = joblib.load('./backend/model/feature_columns.pkl')
explainer = shap.TreeExplainer(model)

@app.route('/')
def home():
    return 'AttriWise backend is running!', 200

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    df = pd.read_csv(file)

    # Encode object columns
    for col in df.select_dtypes(include='object').columns:
        if col in encoder:
            try:
                df[col] = encoder[col].transform(df[col])
            except Exception as e:
                df[col] = 0  # fallback to 0 if unseen label
        else:
            df[col] = 0

    # Reorder columns
    df = df.reindex(columns=feature_cols, fill_value=0)

    # Predict
    preds = model.predict(df)
    probs = model.predict_proba(df)

    try:
        shap_values = explainer.shap_values(df)
    except Exception as e:
        shap_values = None
        print("SHAP error:", e)

    results = []

    for i in range(len(df)):
        top_features = []

        # Get SHAP values per instance
        try:
            if shap_values is not None:
                current_shap = shap_values[1][i] if isinstance(shap_values, list) else shap_values[i]
                current_shap = np.array(current_shap)
                if len(current_shap) == len(df.columns):
                    top_indices = current_shap.argsort()[-3:][::-1]
                    top_features = df.columns[top_indices].tolist()
        except Exception as e:
            print(f"SHAP value error at index {i}: {e}")
            top_features = []

        if not top_features:
            top_features = fallback_feature_reasoning(df.iloc[i])

        top_values = df.iloc[i][top_features].tolist()
        result = {
            "employeeName": f"Employee {i+1}",
            "prediction": "Likely to leave" if preds[i] == 1 else "Likely to stay",
            "probability": float(probs[i][1]),
            "top_features": top_features,
            "feedback": generate_feedback(top_features, top_values, preds[i])
        }
        results.append(result)

    return jsonify(results)


def fallback_feature_reasoning(row):
    # When SHAP fails, use features with highest values
    top_features = row.abs().sort_values(ascending=False).head(3).index.tolist()
    return top_features


def generate_feedback(factors, values, pred):
    readable_factors = [interpret_feature(f, v) for f, v in zip(factors, values)]
    if pred == 1:
        return f"High attrition risk due to: {', '.join(readable_factors)}."
    else:
        return f"Low attrition risk. Key retention drivers: {', '.join(readable_factors)}."


if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
