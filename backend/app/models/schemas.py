from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    role: str
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class PredictionRequest(BaseModel):
    rainfall: float
    humidity: float
    soil_moisture: float
    slope_angle: float
    soil_type: str
    temperature: float
    earthquake_intensity: float
    elevation: float
    vegetation_density: float
    water_level: float

class PredictionResponse(BaseModel):
    id: str
    risk_level: str
    probability: float
    created_at: datetime
    user_id: str

class DatasetUpload(BaseModel):
    filename: str
    size: int
    upload_date: datetime
