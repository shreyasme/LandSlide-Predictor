from fastapi import APIRouter, HTTPException, Depends
from datetime import timedelta
from app.models.schemas import UserCreate, UserLogin, TokenResponse, UserResponse
from app.models.database import User
from app.utils.auth import get_password_hash, verify_password, create_access_token, verify_token

router = APIRouter()

@router.post("/signup", response_model=TokenResponse)
async def signup(user_data: UserCreate):
    existing_user = User.find_by_email(user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user_data.password)
    user_id = User.create(user_data.name, user_data.email, hashed_password)

    user_obj = User.find_by_id(user_id)
    access_token = create_access_token(data={"sub": user_id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "name": user_obj["name"],
            "email": user_obj["email"],
            "role": user_obj.get("role", "user"),
            "created_at": user_obj["created_at"]
        }
    }

@router.post("/login", response_model=TokenResponse)
async def login(user_data: UserLogin):
    user = User.find_by_email(user_data.email)
    if not user or not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": str(user["_id"])})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user.get("role", "user"),
            "created_at": user["created_at"]
        }
    }
