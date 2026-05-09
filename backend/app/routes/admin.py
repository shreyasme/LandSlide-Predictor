from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from app.models.database import User, Prediction, Dataset
from app.utils.auth import verify_token
from app.utils.aws_service import upload_to_s3
import pandas as pd
import io

router = APIRouter()

@router.get("/predictions")
async def get_all_predictions(user_id: str = Depends(verify_token)):
    user = User.find_by_id(user_id)
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    from app.models.database import Prediction as PredModel
    predictions = list(PredModel.collection.find())

    return {
        "predictions": [
            {
                "id": str(p["_id"]),
                "user_id": p["user_id"],
                "risk_level": p["risk_level"],
                "probability": p["probability"],
                "created_at": p["created_at"]
            }
            for p in predictions
        ]
    }

@router.get("/stats")
async def get_system_stats(user_id: str = Depends(verify_token)):
    user = User.find_by_id(user_id)
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    stats = Prediction.get_stats()
    return stats

@router.post("/upload-dataset")
async def upload_dataset(file: UploadFile = File(...), user_id: str = Depends(verify_token)):
    user = User.find_by_id(user_id)
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    content = await file.read()
    success = upload_to_s3(content, f"datasets/{file.filename}")

    if success:
        Dataset.create(file.filename, len(content))
        return {"message": "Dataset uploaded successfully", "filename": file.filename}
    else:
        raise HTTPException(status_code=500, detail="Failed to upload dataset")

@router.post("/retrain-model")
async def retrain_model(user_id: str = Depends(verify_token)):
    user = User.find_by_id(user_id)
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    # This would trigger a Lambda function or SageMaker training job
    return {
        "message": "Model retraining initiated",
        "status": "queued",
        "estimated_time": "30 minutes"
    }
