# API Reference Documentation

## Base URL

```
Production: https://api.landslide-predictor.com
Development: http://localhost:8000
```

## Authentication

All endpoints (except /auth/login and /auth/signup) require JWT token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Formats

### Success Response

```json
{
  "success": true,
  "data": {...},
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00Z",
  "details": {}
}
```

---

## Authentication Endpoints

### POST /api/auth/signup

Register a new user account.

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**

- 400: Email already registered
- 422: Invalid input data

---

### POST /api/auth/login

Authenticate user and get JWT token.

**Request:**

```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**

- 401: Invalid credentials
- 422: Invalid input data

---

## Prediction Endpoints

### POST /api/predict

Submit environmental data and get landslide risk prediction.

**Request:**

```json
{
  "rainfall": 125.5,
  "humidity": 78.2,
  "soil_moisture": 65.3,
  "slope_angle": 35.4,
  "soil_type": "clay",
  "temperature": 25.1,
  "earthquake_intensity": 3.5,
  "elevation": 1200.0,
  "vegetation_density": 55.0,
  "water_level": 2.5
}
```

**Field Descriptions:**

- `rainfall` (float): Rainfall amount in millimeters (10-200)
- `humidity` (float): Relative humidity percentage (0-100)
- `soil_moisture` (float): Soil moisture percentage (0-100)
- `slope_angle` (float): Slope angle in degrees (0-90)
- `soil_type` (enum): Type of soil - clay, sand, silt, rock
- `temperature` (float): Temperature in Celsius (-10 to 50)
- `earthquake_intensity` (float): Earthquake intensity on Richter scale (0-8)
- `elevation` (float): Elevation in meters (0-3000)
- `vegetation_density` (float): Vegetation density percentage (0-100)
- `water_level` (float): Water level in meters

**Response (200 OK):**

```json
{
  "id": "507f1f77bcf86cd799439012",
  "risk_level": "HIGH",
  "probability": 0.87,
  "created_at": "2024-01-15T10:32:15Z",
  "user_id": "507f1f77bcf86cd799439011"
}
```

**Risk Levels:**

- `LOW`: Risk probability < 33% - Safe conditions
- `MEDIUM`: Risk probability 33-67% - Heightened alert
- `HIGH`: Risk probability > 67% - Evacuation recommended

**Error Responses:**

- 401: Unauthorized
- 422: Invalid input data
- 500: Prediction service error

---

### GET /api/history

Retrieve user's prediction history.

**Query Parameters:**

- `limit` (optional, int): Maximum records to return (default: 100)
- `offset` (optional, int): Records to skip (default: 0)

**Response (200 OK):**

```json
{
  "predictions": [
    {
      "id": "507f1f77bcf86cd799439012",
      "risk_level": "HIGH",
      "probability": 0.87,
      "rainfall": 125.5,
      "humidity": 78.2,
      "soil_moisture": 65.3,
      "slope_angle": 35.4,
      "temperature": 25.1,
      "created_at": "2024-01-15T10:32:15Z"
    }
  ],
  "total": 15,
  "limit": 100,
  "offset": 0
}
```

**Error Responses:**

- 401: Unauthorized
- 500: Database error

---

### GET /api/stats

Get user's prediction statistics.

**Response (200 OK):**

```json
{
  "total_predictions": 25,
  "high_risk_count": 5,
  "medium_risk_count": 10,
  "low_risk_count": 10,
  "model_accuracy": 87.5,
  "avg_rainfall": 45.3,
  "avg_soil_moisture": 62.8,
  "avg_temperature": 28.5,
  "avg_humidity": 71.2
}
```

**Error Responses:**

- 401: Unauthorized

---

## Admin Endpoints

### GET /api/admin/predictions

Get all predictions (admin only).

**Headers:**

```
Authorization: Bearer <admin_token>
```

**Query Parameters:**

- `limit` (optional, int): Maximum records (default: 100)
- `offset` (optional, int): Records to skip
- `start_date` (optional, ISO 8601): Filter by start date
- `end_date` (optional, ISO 8601): Filter by end date
- `risk_level` (optional, enum): Filter by risk level (LOW, MEDIUM, HIGH)

**Response (200 OK):**

```json
{
  "predictions": [
    {
      "id": "507f1f77bcf86cd799439012",
      "user_id": "507f1f77bcf86cd799439011",
      "risk_level": "HIGH",
      "probability": 0.87,
      "created_at": "2024-01-15T10:32:15Z"
    }
  ],
  "total": 847
}
```

**Error Responses:**

- 401: Unauthorized
- 403: Not an admin user

---

### GET /api/admin/stats

Get system statistics (admin only).

**Response (200 OK):**

```json
{
  "total_predictions": 847,
  "total_users": 234,
  "high_risk_count": 125,
  "medium_risk_count": 389,
  "low_risk_count": 333,
  "model_accuracy": 87.5,
  "system_uptime": 99.9,
  "api_calls_today": 12450,
  "avg_response_time_ms": 145,
  "sagemaker_endpoint_status": "InService"
}
```

---

### POST /api/admin/upload-dataset

Upload new training dataset (admin only).

**Headers:**

```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Body:**

- `file` (required, file): CSV or XLSX file

**Response (200 OK):**

```json
{
  "message": "Dataset uploaded successfully",
  "filename": "landslide_dataset_2024.csv",
  "size": 1024000,
  "upload_date": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**

- 400: Invalid file format
- 401: Unauthorized
- 403: Not an admin user
- 413: File too large

---

### POST /api/admin/retrain-model

Trigger model retraining (admin only).

**Response (200 OK):**

```json
{
  "message": "Model retraining initiated",
  "status": "queued",
  "job_id": "landslide-training-20240115",
  "estimated_time_minutes": 30,
  "created_at": "2024-01-15T10:35:00Z"
}
```

**Error Responses:**

- 401: Unauthorized
- 403: Not an admin user
- 503: SageMaker service unavailable

---

### GET /api/admin/training-jobs

Get model training jobs (admin only).

**Response (200 OK):**

```json
{
  "jobs": [
    {
      "job_id": "landslide-training-20240115",
      "status": "InProgress",
      "progress": 45,
      "created_at": "2024-01-15T10:35:00Z",
      "started_at": "2024-01-15T10:36:00Z",
      "estimated_completion": "2024-01-15T11:06:00Z"
    }
  ]
}
```

---

## Health & Status Endpoints

### GET /health

Check API health status.

**Response (200 OK):**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "services": {
    "database": "connected",
    "sagemaker": "available",
    "s3": "available"
  }
}
```

---

## Rate Limiting

API endpoints are rate-limited per user:

- Regular users: 100 requests per hour
- Admin users: 1000 requests per hour

**Rate Limit Headers:**

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705334400
```

---

## Error Codes

| Code                | Status | Description                     |
| ------------------- | ------ | ------------------------------- |
| INVALID_INPUT       | 422    | Invalid request data            |
| UNAUTHORIZED        | 401    | Missing or invalid token        |
| FORBIDDEN           | 403    | Insufficient permissions        |
| NOT_FOUND           | 404    | Resource not found              |
| CONFLICT            | 409    | Resource already exists         |
| RATE_LIMITED        | 429    | Too many requests               |
| SERVER_ERROR        | 500    | Internal server error           |
| SERVICE_UNAVAILABLE | 503    | Service temporarily unavailable |

---

## Code Examples

### Python

```python
import requests

API_URL = "http://localhost:8000/api"

# Sign up
response = requests.post(f"{API_URL}/auth/signup", json={
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123!"
})
token = response.json()["access_token"]

# Make prediction
headers = {"Authorization": f"Bearer {token}"}
response = requests.post(f"{API_URL}/predict",
    json={
        "rainfall": 125.5,
        "humidity": 78.2,
        "soil_moisture": 65.3,
        "slope_angle": 35.4,
        "soil_type": "clay",
        "temperature": 25.1,
        "earthquake_intensity": 3.5,
        "elevation": 1200.0,
        "vegetation_density": 55.0,
        "water_level": 2.5
    },
    headers=headers
)
prediction = response.json()
print(f"Risk Level: {prediction['risk_level']}")
print(f"Probability: {prediction['probability']*100:.2f}%")
```

### JavaScript/TypeScript

```javascript
const API_URL = "http://localhost:8000/api";

// Sign up
const signupResponse = await fetch(`${API_URL}/auth/signup`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    password: "SecurePassword123!",
  }),
});
const { access_token } = await signupResponse.json();

// Make prediction
const predictionResponse = await fetch(`${API_URL}/predict`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${access_token}`,
  },
  body: JSON.stringify({
    rainfall: 125.5,
    humidity: 78.2,
    soil_moisture: 65.3,
    slope_angle: 35.4,
    soil_type: "clay",
    temperature: 25.1,
    earthquake_intensity: 3.5,
    elevation: 1200.0,
    vegetation_density: 55.0,
    water_level: 2.5,
  }),
});
const prediction = await predictionResponse.json();
console.log(`Risk Level: ${prediction.risk_level}`);
console.log(`Probability: ${(prediction.probability * 100).toFixed(2)}%`);
```

### cURL

```bash
# Sign up
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'

# Make prediction
curl -X POST http://localhost:8000/api/predict \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "rainfall": 125.5,
    "humidity": 78.2,
    "soil_moisture": 65.3,
    "slope_angle": 35.4,
    "soil_type": "clay",
    "temperature": 25.1,
    "earthquake_intensity": 3.5,
    "elevation": 1200.0,
    "vegetation_density": 55.0,
    "water_level": 2.5
  }'
```

---

## Webhooks (Optional)

Subscribe to prediction events:

```json
POST /api/webhooks/subscribe
{
  "event": "prediction.high_risk",
  "url": "https://your-domain.com/webhook",
  "secret": "webhook-secret-key"
}
```

---

## Changelog

### Version 1.0.0 (2024-01-15)

- Initial API release
- Authentication endpoints
- Prediction endpoints
- Admin endpoints
- SageMaker integration

---

**Last Updated**: January 2024
