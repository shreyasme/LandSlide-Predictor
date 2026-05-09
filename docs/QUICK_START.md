# Quick Start Guide

Get the Landslide Predictor running in 5 minutes!

## Prerequisites

- Git
- Docker & Docker Compose (Recommended)
- OR Node.js 18+, Python 3.11+, MongoDB 7.0+

## Option 1: Quick Start with Docker (Recommended)

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/landslide-predictor.git
cd LandslidePredictor
```

### Step 2: Generate Sample Data

```bash
cd ml_model
python generate_dataset.py
python train_model.py
cd ..
```

### Step 3: Copy Environment File

```bash
cp .env.example .env
```

### Step 4: Start All Services

```bash
docker-compose up --build
```

### Step 5: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **MongoDB**: localhost:27017

## Option 2: Local Development Setup

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp ../.env.example ../.env
# Edit ../.env with your MongoDB URL

# Run backend
uvicorn main:app --reload
```

Backend will be available at: `http://localhost:8000`

### Frontend Setup

```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### MongoDB Setup

```bash
# Option 1: MongoDB Atlas (Cloud)
# 1. Create account at https://www.mongodb.com/cloud/atlas
# 2. Create a cluster
# 3. Get connection string
# 4. Update MONGO_URL in .env

# Option 2: Local MongoDB (Docker)
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:7.0
```

## First Steps

### 1. Create Account

Navigate to http://localhost:5173 and click "Sign Up"

Fill in:

- Name: Your Name
- Email: your@email.com
- Password: YourPassword123

### 2. Make Your First Prediction

1. Click "Dashboard" in navigation
2. Fill in the Landslide Prediction Form with values:
   - Rainfall: 125.5 mm
   - Humidity: 78.2 %
   - Soil Moisture: 65.3 %
   - Slope Angle: 35.4 °
   - Soil Type: clay
   - Temperature: 25.1 °C
   - Earthquake Intensity: 3.5
   - Elevation: 1200 m
   - Vegetation Density: 55 %
   - Water Level: 2.5 m
3. Click "Get Prediction"
4. View the risk level and recommendations

### 3. Check Prediction History

Click "History" to see all your predictions

## Testing the API with cURL

### Sign Up

```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'

# Save the access_token from response
export TOKEN="your_token_here"
```

### Make Prediction

```bash
curl -X POST http://localhost:8000/api/predict \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
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

## Accessing API Documentation

Navigate to: http://localhost:8000/docs

This gives you interactive Swagger UI to test all endpoints.

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9

# Kill process on port 8000 (backend)
lsof -ti:8000 | xargs kill -9
```

### MongoDB Connection Error

```bash
# Check if MongoDB is running
mongosh

# If using Docker Compose, ensure MongoDB container is running:
docker-compose logs mongodb
```

### Module Not Found Error

```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# For frontend
npm install --save-dev
```

### CORS Errors in Browser Console

```bash
# Backend must be running on port 8000
# Frontend must be running on port 5173
# Check .env configuration
```

## Project Structure

```
LandslidePredictor/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utility functions
│   └── package.json
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── models/         # DB models & schemas
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   ├── main.py
│   └── requirements.txt
├── ml_model/               # ML model training
│   ├── train_model.py
│   ├── generate_dataset.py
│   └── models/
├── aws_deployment/         # AWS integration
│   ├── lambda/
│   ├── scripts/
│   └── configs/
├── data/                   # Sample datasets
├── docs/                   # Documentation
└── docker-compose.yml
```

## Next Steps

1. **Explore the Dashboard**
   - View statistics
   - Check charts
   - Analyze environmental data

2. **Try Admin Panel**
   - Create an admin account manually
   - Upload datasets
   - Retrain the model

3. **Configure AWS Integration**
   - Follow AWS_DEPLOYMENT_GUIDE.md
   - Set up SageMaker models
   - Deploy to production

4. **Customize**
   - Modify prediction form fields
   - Add new environmental parameters
   - Integrate with external APIs

## Useful Commands

### Docker Commands

```bash
# Start services
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild containers
docker-compose up --build
```

### Backend Commands

```bash
# Run tests
pytest tests/

# Generate database indexes
python scripts/setup_indexes.py

# Export data
python scripts/export_data.py
```

### Frontend Commands

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

## Performance Tips

1. **Use Production Build**

   ```bash
   npm run build
   ```

2. **Optimize Images**
   - Compress predictions charts
   - Use WebP format

3. **Database Indexing**
   - Index user_id in predictions
   - Index created_at for sorting

4. **Caching**
   - Enable browser caching
   - Use Redis for session storage

## Security Reminders

⚠️ **Before Deploying to Production:**

1. Change `SECRET_KEY` in `.env`
2. Set strong MongoDB password
3. Enable HTTPS/TLS
4. Configure CORS properly
5. Set up rate limiting
6. Enable WAF
7. Use environment variables for secrets
8. Enable encryption at rest

## Common Issues & Solutions

| Issue                             | Solution                                           |
| --------------------------------- | -------------------------------------------------- |
| Frontend won't connect to backend | Check backend is running on port 8000              |
| CORS error                        | Frontend and backend ports correct?                |
| MongoDB auth failed               | Check credentials in MONGO_URL                     |
| SageMaker endpoint error          | AWS credentials not configured                     |
| Out of memory                     | Reduce batch size or upgrade RAM                   |
| Slow predictions                  | Check model file size, increase SageMaker instance |

## Getting Help

- Check API docs: http://localhost:8000/docs
- Read README.md for detailed info
- Check logs: `docker-compose logs`
- Review AWS_DEPLOYMENT_GUIDE.md
- Check API_REFERENCE.md for endpoint details

## Performance Metrics

Expected performance in local environment:

- API response time: 100-300ms
- Frontend load time: 1-3s
- Prediction inference: 50-150ms
- Database query: 10-50ms

---

**Ready to use!** 🚀

For detailed documentation, see:

- README.md - Project overview
- AWS_DEPLOYMENT_GUIDE.md - Production deployment
- API_REFERENCE.md - API endpoints details
- ARCHITECTURE.md - System architecture
