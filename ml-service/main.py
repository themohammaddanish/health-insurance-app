from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import joblib
import os
import pandas as pd

app = FastAPI(
    title="Health Insurance Premium Prediction API",
    description="AI-powered premium prediction microservice using scikit-learn models",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models and scalers
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")

model_rest_data = joblib.load(os.path.join(MODEL_DIR, "model_rest.joblib"))
model_young_data = joblib.load(os.path.join(MODEL_DIR, "model_young.joblib"))
scaler_rest_data = joblib.load(os.path.join(MODEL_DIR, "scaler_rest.joblib"))
scaler_young_data = joblib.load(os.path.join(MODEL_DIR, "scaler_young.joblib"))

# Extract the actual scaler objects and columns to scale
scaler_rest = scaler_rest_data['scaler']
scaler_rest_cols = scaler_rest_data['columns_to_scale']
scaler_young = scaler_young_data['scaler']
scaler_young_cols = scaler_young_data['columns_to_scale']

# The models themselves
model_rest = model_rest_data
model_young = model_young_data

# Feature columns the models were trained on (18 features)
FEATURE_COLUMNS = [
    'age', 'number_of_dependants', 'income_lakhs', 'insurance_plan',
    'genetical_risk', 'normalized_risk_score', 'gender_Male',
    'region_Northwest', 'region_Southeast', 'region_Southwest',
    'marital_status_Unmarried', 'bmi_category_Obesity',
    'bmi_category_Overweight', 'bmi_category_Underweight',
    'smoking_status_Occasional', 'smoking_status_Regular',
    'employment_status_Salaried', 'employment_status_Self-Employed'
]


class PredictionInput(BaseModel):
    age: int
    gender: str = "male"
    bmi: float = 25.0
    smoker: int = 0
    num_dependents: int = 0
    region: str = "northeast"
    existing_conditions: str = ""
    income_lakhs: float = 5.0
    income_level: int = 2
    insurance_plan: int = 1
    # Optional fields with sensible defaults
    genetical_risk: int = 0
    marital_status: str = "married"
    employment_status: str = "salaried"
    # Legacy support
    features: Optional[List[float]] = None


class PredictionOutput(BaseModel):
    predicted_premium: float


def compute_normalized_risk(bmi: float, smoker: int, existing_conditions: str, genetical_risk: int) -> float:
    """Compute a normalized risk score from health indicators."""
    risk = genetical_risk
    # BMI risk
    if bmi < 18.5 or bmi > 30:
        risk += 3
    elif bmi > 25:
        risk += 1
    # Smoking risk
    if smoker == 2:  # Regular
        risk += 4
    elif smoker == 1:  # Occasional
        risk += 2
    # Conditions risk
    conditions = existing_conditions.lower() if existing_conditions else ""
    high_risk = ['diabetes', 'heart disease', 'high blood pressure']
    medium_risk = ['asthma', 'thyroid']
    for c in high_risk:
        if c in conditions:
            risk += 3
    for c in medium_risk:
        if c in conditions:
            risk += 1
    # Clamp to 0-10
    return min(max(risk, 0), 10)


def get_bmi_category(bmi: float) -> str:
    if bmi < 18.5:
        return "Underweight"
    elif bmi < 25:
        return "Normal"
    elif bmi < 30:
        return "Overweight"
    else:
        return "Obesity"


def build_features(data: PredictionInput) -> pd.DataFrame:
    """Build the 18-feature DataFrame matching model training format."""

    bmi_cat = get_bmi_category(data.bmi)
    normalized_risk = compute_normalized_risk(data.bmi, data.smoker, data.existing_conditions, data.genetical_risk)

    # Determine smoking status string
    if data.smoker == 0:
        smoking_status = "No Smoking"
    elif data.smoker == 1:
        smoking_status = "Occasional"
    else:
        smoking_status = "Regular"

    row = {
        'age': data.age,
        'number_of_dependants': data.num_dependents,
        'income_level': data.income_level,
        'income_lakhs': data.income_lakhs,
        'insurance_plan': data.insurance_plan,
        'genetical_risk': data.genetical_risk,
        'normalized_risk_score': normalized_risk,
        # One-hot: gender
        'gender_Male': 1 if data.gender.lower() == 'male' else 0,
        # One-hot: region (base = Northeast)
        'region_Northwest': 1 if data.region.lower() == 'northwest' else 0,
        'region_Southeast': 1 if data.region.lower() == 'southeast' else 0,
        'region_Southwest': 1 if data.region.lower() == 'southwest' else 0,
        # One-hot: marital_status (base = Married)
        'marital_status_Unmarried': 1 if data.marital_status.lower() == 'unmarried' else 0,
        # One-hot: bmi_category (base = Normal)
        'bmi_category_Obesity': 1 if bmi_cat == 'Obesity' else 0,
        'bmi_category_Overweight': 1 if bmi_cat == 'Overweight' else 0,
        'bmi_category_Underweight': 1 if bmi_cat == 'Underweight' else 0,
        # One-hot: smoking_status (base = No Smoking)
        'smoking_status_Occasional': 1 if smoking_status == 'Occasional' else 0,
        'smoking_status_Regular': 1 if smoking_status == 'Regular' else 0,
        # One-hot: employment_status (base = Freelancer)
        'employment_status_Salaried': 1 if data.employment_status.lower() == 'salaried' else 0,
        'employment_status_Self-Employed': 1 if data.employment_status.lower() == 'self-employed' else 0,
    }

    all_columns = ['income_level'] + FEATURE_COLUMNS
    df = pd.DataFrame([row], columns=all_columns)
    return df


@app.get("/")
def root():
    return {"message": "Health Insurance ML Service is running"}


@app.post("/predict", response_model=PredictionOutput)
def predict(data: PredictionInput):
    # Build feature DataFrame
    df = build_features(data)

    # Select the right model and scaler based on age
    if data.age < 25:
        scaler = scaler_young
        cols = scaler_young_cols
        model = model_young
    else:
        scaler = scaler_rest
        cols = scaler_rest_cols
        model = model_rest

    # Scale only the columns that need scaling
    df[cols] = scaler.transform(df[cols])

    # Drop income_level (used only for scaling, not a model feature)
    if 'income_level' in df.columns:
        df = df.drop(columns=['income_level'])

    # Predict
    prediction = model.predict(df[FEATURE_COLUMNS])
    predicted_premium = round(float(prediction[0]), 2)

    # Ensure non-negative
    predicted_premium = max(predicted_premium, 0)

    return PredictionOutput(predicted_premium=predicted_premium)


@app.get("/health")
def health():
    return {"status": "ok", "models_loaded": True}
