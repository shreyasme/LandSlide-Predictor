# Installation Guide

Complete installation instructions for all environments.

## System Requirements

### Minimum Requirements

- CPU: 2 cores
- RAM: 4 GB
- Storage: 10 GB
- Internet: 5 Mbps

### Recommended Requirements

- CPU: 4+ cores
- RAM: 8 GB+
- Storage: 50 GB+
- Internet: 10 Mbps+

## OS Support

✅ Windows 10/11  
✅ macOS 10.15+  
✅ Ubuntu 20.04+  
✅ CentOS 8+

## Step 1: Install Prerequisites

### 1.1 Git

```bash
# Windows (using Chocolatey)
choco install git

# macOS (using Homebrew)
brew install git

# Ubuntu/Debian
sudo apt-get install git
```

### 1.2 Python 3.11+

```bash
# Windows
# Download from https://www.python.org/downloads/
# OR using Chocolatey
choco install python --version=3.11

# macOS
brew install python@3.11

# Ubuntu/Debian
sudo apt-get install python3.11 python3.11-venv
```

Verify installation:

```bash
python --version  # Should show 3.11+
```

### 1.3 Node.js 18+

```bash
# Windows (using Chocolatey)
choco install nodejs

# macOS (using Homebrew)
brew install node@18

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify installation:

```bash
node --version   # Should show v18+
npm --version    # Should show 8+
```

### 1.4 Docker & Docker Compose (Optional but Recommended)

```bash
# Windows
# Download Docker Desktop from https://www.docker.com/products/docker-desktop

# macOS
brew install docker docker-compose

# Ubuntu/Debian
sudo apt-get install docker.io docker-compose
sudo usermod -aG docker $USER
```

Verify installation:

```bash
docker --version
docker-compose --version
```

## Step 2: Clone Repository

```bash
git clone https://github.com/yourusername/landslide-predictor.git
cd LandslidePredictor
```

## Step 3: Install Dependencies

### Backend Dependencies

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Step 4: Configure Environment

```bash
# Go back to project root
cd ..

# Copy example environment file
cp .env.example .env

# Edit .env file with your settings
# nano .env  # or use your favorite editor
```

### Example .env Configuration

```bash
# Database
MONGO_URL=mongodb://localhost:27017
DB_NAME=landslide_predictor

# Backend
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256

# AWS Configuration (optional for local development)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET=
SAGEMAKER_ENDPOINT=
```

## Step 5: Set Up Database

### Option A: Using MongoDB Atlas (Recommended for Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a new project
4. Create a cluster (free tier available)
5. Add connection string to .env:
   ```bash
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

### Option B: Local MongoDB Installation

#### Windows

```bash
# Using Chocolatey
choco install mongodb-community

# Or download MSI installer from https://www.mongodb.com/try/download/community
```

#### macOS

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Ubuntu/Debian

```bash
sudo apt-get install -y gnupg curl
curl https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

#### Or Using Docker

```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:7. 0

# Update .env
MONGO_URL=mongodb://admin:password@localhost:27017/landslide_predictor?authSource=admin
```

Verify MongoDB connection:

```bash
mongosh
# You should see the mongo shell prompt
# Exit with: exit
```

## Step 6: Generate ML Model

```bash
cd ml_model
python generate_dataset.py
python train_model.py
```

This will:

- Generate synthetic dataset (data/landslide_dataset.csv)
- Train Random Forest model
- Save model (models/landslide_model.pkl)
- Generate metrics and visualizations

## Step 7: Start Backend Server

```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn main:app --reload
```

Backend is now running at: http://localhost:8000

API documentation available at: http://localhost:8000/docs

## Step 8: Start Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

Frontend is now running at: http://localhost:5173

## Step 9: Verify Installation

Open browser and visit:

1. Frontend: http://localhost:5173
2. Backend: http://localhost:8000
3. API Docs: http://localhost:8000/docs

## Troubleshooting Installation

### Python Virtual Environment Issues

```bash
# Delete and recreate venv
rm -rf backend/venv
python -m venv backend/venv

# Windows
backend\Scripts\activate

# macOS/Linux
source backend/venv/bin/activate
```

### Node Module Issues

```bash
# Clear npm cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <process_id> /F

# macOS/Linux
lsof -ti:5173 | xargs kill -9
```

### MongoDB Connection Failed

```bash
# Check if MongoDB is running
mongosh --version

# Start MongoDB
# macOS: brew services start mongodb-community
# Windows: Services > MongoDB Server > Start
# Linux: sudo systemctl start mongod
```

### Import Errors in Backend

```bash
# Make sure virtual environment is activated
# Reinstall requirements
pip install -r requirements.txt --force-reinstall
```

## Verification Checklist

- [ ] Python 3.11+ installed
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Project cloned
- [ ] .env file configured
- [ ] MongoDB running
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] ML model trained
- [ ] Backend server running (port 8000)
- [ ] Frontend server running (port 5173)
- [ ] Can access frontend UI
- [ ] Can access API docs
- [ ] Can make test prediction

## Docker Installation (Alternative)

If you prefer containerized setup:

```bash
# Build and start all services
docker-compose up --build

# Everything will be available:
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# MongoDB: localhost:27017
```

## Development Tools (Optional)

### IDE/Editor

- Visual Studio Code (recommended)
- PyCharm (Python development)
- WebStorm (JavaScript/React)

### Browser Extensions

- React Developer Tools
- Redux DevTools
- PostMan (API testing)
- MongoDB Compass (Database GUI)

### VS Code Extensions

```
MongoDB.mongodb-vscode
ms-python.python
Pylance
ES7+ React/Redux/React-Native snippets
Tailwind CSS IntelliSense
```

## Post-Installation Setup

### 1. Create Admin User

```bash
# Update database directly
mongosh
use landslide_predictor
db.users.insertOne({
  name: "Admin",
  email: "admin@example.com",
  password: "hashed_password",
  role: "admin",
  created_at: new Date()
})
```

### 2. Configure AWS (For Production)

```bash
# Install AWS CLI
pip install awscli

# Configure credentials
aws configure
```

### 3. Set Up Git Hooks (Optional)

```bash
# Pre-commit linting
pip install pre-commit
pre-commit install
```

## Next Steps

1. Read QUICK_START.md for first steps
2. Read README.md for full documentation
3. Check API_REFERENCE.md for API details
4. See AWS_DEPLOYMENT_GUIDE.md for production deployment

## Support

For installation issues:

- Check system requirements
- Review log files
- Google the error message
- Create GitHub issue with logs

---

**Installation Complete!** 🎉

You're now ready to use the Landslide Predictor.

Start with QUICK_START.md or README.md.
