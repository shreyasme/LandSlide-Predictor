from datetime import datetime
from typing import Optional
from bson import ObjectId
from pymongo import MongoClient
import os

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "landslide_predictor")

client = MongoClient(MONGO_URL)
db = client[DB_NAME]

class User:
    collection = db.users

    @staticmethod
    def create(name: str, email: str, hashed_password: str, role: str = "user"):
        user_data = {
            "name": name,
            "email": email,
            "password": hashed_password,
            "role": role,
            "created_at": datetime.utcnow()
        }
        result = User.collection.insert_one(user_data)
        return str(result.inserted_id)

    @staticmethod
    def find_by_email(email: str):
        return User.collection.find_one({"email": email})

    @staticmethod
    def find_by_id(user_id: str):
        return User.collection.find_one({"_id": ObjectId(user_id)})

class Prediction:
    collection = db.predictions

    @staticmethod
    def create(user_id: str, risk_level: str, probability: float, data: dict):
        prediction_data = {
            "user_id": user_id,
            "risk_level": risk_level,
            "probability": probability,
            "rainfall": data.get("rainfall"),
            "humidity": data.get("humidity"),
            "soil_moisture": data.get("soil_moisture"),
            "slope_angle": data.get("slope_angle"),
            "soil_type": data.get("soil_type"),
            "temperature": data.get("temperature"),
            "earthquake_intensity": data.get("earthquake_intensity"),
            "elevation": data.get("elevation"),
            "vegetation_density": data.get("vegetation_density"),
            "water_level": data.get("water_level"),
            "created_at": datetime.utcnow()
        }
        result = Prediction.collection.insert_one(prediction_data)
        return str(result.inserted_id)

    @staticmethod
    def find_by_user(user_id: str, limit: int = 100):
        predictions = list(Prediction.collection.find({"user_id": user_id}).sort("created_at", -1).limit(limit))
        return predictions

    @staticmethod
    def get_stats(user_id: str = None):
        if user_id:
            predictions = list(Prediction.collection.find({"user_id": user_id}))
        else:
            predictions = list(Prediction.collection.find())

        total = len(predictions)
        high_risk = len([p for p in predictions if p["risk_level"] == "HIGH"])
        medium_risk = len([p for p in predictions if p["risk_level"] == "MEDIUM"])
        low_risk = len([p for p in predictions if p["risk_level"] == "LOW"])

        avg_rainfall = sum([p.get("rainfall", 0) for p in predictions]) / total if total > 0 else 0
        avg_soil_moisture = sum([p.get("soil_moisture", 0) for p in predictions]) / total if total > 0 else 0
        avg_temperature = sum([p.get("temperature", 0) for p in predictions]) / total if total > 0 else 0
        avg_humidity = sum([p.get("humidity", 0) for p in predictions]) / total if total > 0 else 0

        return {
            "total_predictions": total,
            "high_risk_count": high_risk,
            "medium_risk_count": medium_risk,
            "low_risk_count": low_risk,
            "model_accuracy": 87.5,
            "avg_rainfall": avg_rainfall,
            "avg_soil_moisture": avg_soil_moisture,
            "avg_temperature": avg_temperature,
            "avg_humidity": avg_humidity
        }

class Dataset:
    collection = db.datasets

    @staticmethod
    def create(filename: str, size: int):
        dataset_data = {
            "filename": filename,
            "size": size,
            "upload_date": datetime.utcnow()
        }
        result = Dataset.collection.insert_one(dataset_data)
        return str(result.inserted_id)

    @staticmethod
    def get_all():
        return list(Dataset.collection.find())
