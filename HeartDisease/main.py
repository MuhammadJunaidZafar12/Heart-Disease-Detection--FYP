from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from typing import Optional
import logging

# -------------------------------
# Load trained artifacts (FIXED)
# -------------------------------

BASE_DIR = Path(__file__).resolve().parent

# Lazy-loaded artifacts
model: Optional[object] = None
columns: Optional[list] = None
imputer: Optional[object] = None

app = FastAPI(title="Heart Disease Prediction API")

# configure logging
logger = logging.getLogger("heart_api")
logging.basicConfig(level=logging.INFO)


def load_artifacts():
    global model, columns, imputer
    try:
        model_path = BASE_DIR / "heart_model.pkl"
        cols_path = BASE_DIR / "columns.pkl"
        imputer_path = BASE_DIR / "imputer.pkl"

        if not model_path.exists() or not cols_path.exists():
            raise FileNotFoundError("Model artifacts not found in project root")

        model = joblib.load(model_path)
        columns = joblib.load(cols_path)

        # imputer is optional (was present during training)
        if imputer_path.exists():
            imputer = joblib.load(imputer_path)

        logger.info("Loaded model artifacts successfully")

    except Exception as e:
        logger.exception("Failed to load artifacts: %s", e)
        # keep model as None so requests can return a meaningful error

# -------------------------------
# Input Schema (UNCHANGED)
# -------------------------------
class PatientData(BaseModel):
    age: int
    sex: int
    cp: int
    trestbps: int
    chol: int
    fbs: int
    restecg: int
    thalach: int
    exang: int
    oldpeak: float
    slope: int
    ca: int
    thal: int

# -------------------------------
# CORS
# -------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Root endpoint
# -------------------------------
@app.get("/")
def home():
    return {"message": "Heart Disease Prediction API is running"}

# -------------------------------
# Prediction endpoint (FIXED)
# -------------------------------
@app.post("/predict")
def predict(data: PatientData):
    try:
        # Convert input to dict
        data_dict = data.model_dump()

        print("Received JSON:", data_dict)

        # Convert to DataFrame
        input_df = pd.DataFrame([data_dict])

        # One-hot encoding
        input_df = pd.get_dummies(input_df)

        # ALIGN FEATURES (IMPORTANT FIX)
        input_df = input_df.reindex(columns=columns, fill_value=0)

        # Predict using pipeline
        prediction = model.predict(input_df)[0]
        proba = model.predict_proba(input_df)[0]

        prob_no_disease = float(proba[0])
        prob_disease = float(proba[1])

        result = "HAS Heart Disease" if prediction == 1 else "NO Heart Disease"

        confidence = max(prob_no_disease, prob_disease)

        return {
            "prediction": int(prediction),
            "result": result,
            "risk_probability": round(prob_disease * 100, 2),
            "confidence": round(confidence * 100, 2)
        }

    except Exception as e:
        return {"error": str(e)}

# # train.py
#
# from fastapi import FastAPI
# from pydantic import BaseModel
# import pandas as pd
# import joblib
#
# from fastapi.middleware.cors import CORSMiddleware
#
#
# # -------------------------------
# # Load trained artifacts
# # -------------------------------
# model = joblib.load("heart_model.pkl")
# imputer = joblib.load("imputer.pkl")
# columns = joblib.load("columns.pkl")
#
# app = FastAPI(title="Heart Disease Prediction API")
#
# # -------------------------------
# # Input Schema (Validation)
# # -------------------------------
# class PatientData(BaseModel):
#     age: int
#     sex: int
#     cp: int
#     trestbps: int
#     chol: int
#     fbs: int
#     restecg: int
#     thalach: int
#     exang: int
#     oldpeak: float
#     slope: int
#     ca: int
#     thal: int
#
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # or ["http://localhost:3000"]
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
#
# # -------------------------------
# # Root endpoint
# # -------------------------------
# @app.get("/")
# def home():
#     return {"message": "Heart Disease Prediction API is running"}
#
# # -------------------------------
# # Prediction endpoint
# # -------------------------------
# @app.post("/predict")
# def predict(data: PatientData):
#     try:
#         # Convert to dict
#         data_dict = data.model_dump()
#
#         print("Received JSON:", data_dict)
#
#         # ❌ Remove non-ML fields
#         data_dict.pop("name", None)
#
#         # Convert to DataFrame
#         input_df = pd.DataFrame([data_dict])
#
#         # One-hot encoding
#         input_df = pd.get_dummies(input_df)
#         input_df = input_df.reindex(columns=columns, fill_value=0)
#
#         # Impute
#         input_df = imputer.transform(input_df)
#
#         # Predict
#         # prediction = model.predict(input_df)[0]
#         # probability = model.predict_proba(input_df)[0][1]
#         #
#         # result = "HAS Heart Disease" if prediction == 1 else "NO Heart Disease"
#         #
#         # return {
#         #     "prediction": int(prediction),
#         #     "result": result,
#         #     "risk_probability": round(float(probability) * 100, 2)
#         # }
#         # Predict
#         prediction = model.predict(input_df)[0]
#         proba = model.predict_proba(input_df)[0]
#
#         prob_no_disease = float(proba[0])
#         prob_disease = float(proba[1])
#
#         result = "HAS Heart Disease" if prediction == 1 else "NO Heart Disease"
#
#         confidence = max(prob_no_disease, prob_disease)  # strongest class certainty
#
#         return {
#             "prediction": int(prediction),
#             "result": result,
#             "risk_probability": round(prob_disease * 100, 2),
#             "confidence": round(confidence * 100, 2)
#         }
#
#     except Exception as e:
#         return {"error": str(e)}
