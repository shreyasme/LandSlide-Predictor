from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from app.models.schemas import PredictionRequest, PredictionResponse
from app.models.database import User, Prediction
from app.utils.auth import verify_token
from app.utils.aws_service import invoke_sagemaker_endpoint
import joblib
import pickle
import numpy as np
import os
from datetime import datetime

router = APIRouter()

# Load local model for fallback (when SageMaker is not available)
MODEL_PATH = "models/landslide_model.pkl"
model = None

if os.path.exists(MODEL_PATH):
    try:
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
    except:
        model = None

def predict_landslide(data: dict):
    """Predict landslide risk using the model"""
    try:
        # Try using SageMaker endpoint
        result = invoke_sagemaker_endpoint(data)
        if result:
            return result
    except:
        pass

    # Fallback to local model
    if model:
        features = np.array([[
            data["rainfall"],
            data["humidity"],
            data["soil_moisture"],
            data["slope_angle"],
            {soil_type: i for i, soil_type in enumerate(["clay", "sand", "silt", "rock"])}[data["soil_type"]],
            data["temperature"],
            data["earthquake_intensity"],
            data["elevation"],
            data["vegetation_density"],
            data["water_level"]
        ]])

        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0].max()

        return {
            "risk_level": ["LOW", "MEDIUM", "HIGH"][prediction],
            "probability": float(probability)
        }

    # Default prediction if no model available
    probability = (data["rainfall"] * 0.3 + data["soil_moisture"] * 0.25 + data["slope_angle"] * 0.2) / 100
    probability = min(max(probability, 0), 1)

    if probability < 0.4:
        risk_level = "LOW"
    elif probability < 0.7:
        risk_level = "MEDIUM"
    else:
        risk_level = "HIGH"

    return {"risk_level": risk_level, "probability": probability}

@router.post("/predict", response_model=PredictionResponse)
async def create_prediction(request: PredictionRequest, user_id: str = Depends(verify_token)):
    data = request.dict()
    prediction = predict_landslide(data)

    pred_id = Prediction.create(user_id, prediction["risk_level"], prediction["probability"], data)
    created_at = datetime.utcnow()

    return {
        "id": pred_id,
        "risk_level": prediction["risk_level"],
        "probability": prediction["probability"],
        "created_at": created_at,
        "user_id": user_id
    }

@router.get("/history")
async def get_prediction_history(user_id: str = Depends(verify_token)):
    predictions = Prediction.find_by_user(user_id)
    return {
        "predictions": [
            {
                "id": str(p["_id"]),
                "risk_level": p["risk_level"],
                "probability": p["probability"],
                "rainfall": p.get("rainfall"),
                "humidity": p.get("humidity"),
                "soil_moisture": p.get("soil_moisture"),
                "slope_angle": p.get("slope_angle"),
                "temperature": p.get("temperature"),
                "created_at": p["created_at"]
            }
            for p in predictions
        ]
    }

@router.get("/stats")
async def get_stats(user_id: str = Depends(verify_token)):
    stats = Prediction.get_stats(user_id)
    return stats
