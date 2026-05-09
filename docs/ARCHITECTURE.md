# System Architecture

## Overview

The Landslide Predictor is built using a microservices architecture deployed on AWS cloud infrastructure. This document explains the system architecture, data flow, and component interactions.

## High-Level Architecture

```
┌──────────────────────────┐
│     User Interface       │
│   (React Frontend)       │
└──────────────┬───────────┘
               │
               │ HTTPS/REST
               │
┌──────────────▼────────────┐
│   API Gateway            │
│   (Rate Limiting, CORS)   │
└──────────────┬────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼────────┐  ┌──▼─────────┐
│  Elastic      │  │   AWS      │
│  Beanstalk    │  │   Lambda   │
│  (FastAPI)    │  │  Functions │
└──────┬────────┘  └──┬─────────┘
       │               │
       └───────┬───────┘
               │
    ┌──────────▼────────────┐
    │  Amazon SageMaker    │
    │  Endpoint (ML Model) │
    └──────────┬────────────┘
               │
    ┌──────────▼──────────────┐
    │  Prediction Result      │
    │  (LOW/MEDIUM/HIGH)      │
    └─────────────────────────┘
```

## Components

### 1. Frontend (React + Vite)

- **Purpose**: User interface for dashboard and predictions
- **Technology**: React 18, Vite, Tailwind CSS
- **Deployment**: CloudFront + S3
- **Responsibilities**:
  - User authentication
  - Prediction form submission
  - Data visualization (charts, graphs)
  - Risk analysis display
  - History management

### 2. Backend API (FastAPI)

- **Purpose**: REST API for all operations
- **Technology**: Python FastAPI, Uvicorn
- **Deployment**: AWS Elastic Beanstalk
- **Responsibilities**:
  - User authentication and authorization
  - Request validation
  - Database operations
  - SageMaker integration
  - Lambda invocation
  - Logging and monitoring

### 3. Machine Learning Model

- **Algorithm**: Random Forest Classifier
- **Framework**: Scikit-learn
- **Deployment**: AWS SageMaker
- **Input Features** (10):
  1. Rainfall (mm)
  2. Humidity (%)
  3. Soil Moisture (%)
  4. Slope Angle (degrees)
  5. Soil Type (categorical)
  6. Temperature (°C)
  7. Earthquake Intensity (Richter)
  8. Elevation (m)
  9. Vegetation Density (%)
  10. Water Level (m)
- **Output**: Risk Level + Probability

### 4. Database

- **Technology**: MongoDB / AWS DocumentDB
- **Collections**:
  - Users: User accounts and auth
  - Predictions: User predictions and results
  - Datasets: Training data metadata
- **Deployment**: MongoDB Atlas or AWS DocumentDB

### 5. AWS Services

#### Amazon SageMaker

- Model training
- Model hosting/endpoints
- Real-time predictions
- Batch predictions

#### AWS Lambda

- Asynchronous prediction requests
- Data preprocessing
- Report generation
- Email notifications

#### Amazon S3

- Training datasets
- Trained models
- Prediction reports
- Logs and backups

#### API Gateway

- Public REST API
- Request validation
- Rate limiting
- CORS configuration

#### CloudWatch

- Application logs
- Metrics collection
- Alarms and notifications
- Dashboard

#### IAM

- Role-based access control
- Service permissions
- User authentication

## Data Flow

### 1. User Prediction Flow

```
User Input
    ↓
Frontend Form
    ↓
Validation
    ↓
POST /api/predict
    ↓
Backend Receives Request
    ↓
JWT Token Validation
    ↓
Feature Preprocessing
    ↓
AWS SageMaker Invocation
    ↓
ML Model Inference
    ↓
Risk Level Classification
    ↓
Save to Database
    ↓
Return Result to Frontend
    ↓
Display Prediction
```

### 2. Model Training Flow

```
Admin Upload Dataset
    ↓
S3 Storage
    ↓
SageMaker Training Job
    ↓
Model Training (30 mins)
    ↓
Evaluation Metrics
    ↓
Model Versioning
    ↓
Deploy to Endpoint
    ↓
Update Configuration
```

### 3. Admin Monitoring Flow

```
Admin Panel
    ↓
CloudWatch Dashboard
    ↓
Metrics Collection
    ↓
Performance Analysis
    ↓
Alert Triggers (if needed)
    ↓
Notification to Admins
```

## Technology Decisions

### Why Random Forest?

1. **Interpretability**: Feature importance analysis
2. **Robustness**: Handles non-linear relationships
3. **Performance**: 87.5% accuracy on test data
4. **Scalability**: Works well with ensemble predictions
5. **Flexibility**: Handles mixed data types

### Why FastAPI?

1. **Performance**: High-speed async framework
2. **Modern**: Built for production APIs
3. **Documentation**: Auto-generated Swagger UI
4. **Type Safety**: Pydantic validation
5. **Easy Integration**: AWS services integration

### Why MongoDB?

1. **Flexibility**: Schema-less document storage
2. **Scalability**: Easy horizontal scaling
3. **JSON Format**: Natural JSON API integration
4. **Distributed**: Replica sets for redundancy
5. **Aggregation**: Powerful data analysis queries

### Why React + Vite?

1. **Fast Development**: Hot module replacement
2. **Modern**: Latest React 18 features
3. **Build Speed**: Lightning-fast builds
4. **Bundle Size**: Optimized output
5. **Developer Experience**: Excellent tooling

### Why AWS?

1. **SageMaker**: Managed ML operations
2. **Scalability**: Auto-scaling infrastructure
3. **Reliability**: 99.99% uptime SLA
4. **Security**: Enterprise-grade security
5. **Cost**: Pay-as-you-go pricing

## Security Architecture

```
┌─────────────────────────────────────┐
│         Client                      │
└────────────────┬────────────────────┘
                 │
                 │ TLS 1.3
                 │
┌────────────────▼────────────────────┐
│    API Gateway / CloudFront         │
│    - WAF Rules                      │
│    - DDoS Protection                │
│    - Rate Limiting                  │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│    Application Load Balancer        │
│    - SSL/TLS Termination            │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│    FastAPI Backend                  │
│    - JWT Validation                 │
│    - CORS Headers                   │
│    - Rate Limiting                  │
│    - Input Validation               │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│    SageMaker Endpoint                  │
│    - IAM Authentication             │
│    - Encryption at Rest             │
│    - Encryption in Transit          │
└─────────────────────────────────────┘
```

## Scalability Design

### Horizontal Scaling

- **Frontend**: CloudFront CDN with auto-scaling
- **Backend**: Elastic Beanstalk auto-scaling groups
- **Database**: MongoDB replica sets
- **Lambda**: Automatic scaling

### Vertical Scaling

- **SageMaker**: Increase instance size
- **Elastic Beanstalk**: Upgrade instance type
- **Database**: Increase storage capacity

### Load Balancing

- Application Load Balancer (FastAPI)
- CloudFront Global Distribution
- Database read replicas

## Monitoring & Observability

```
┌──────────────────────────────────┐
│   Application Metrics            │
├──────────────────────────────────┤
│ - API Response Time              │
│ - Error Rates                    │
│ - Prediction Accuracy            │
│ - SageMaker Performance          │
│ - Database Performance           │
└──────────────┬───────────────────┘
               │
┌──────────────▼───────────────────┐
│    CloudWatch                    │
├──────────────────────────────────┤
│ - Metrics Collection             │
│ - Logs Aggregation               │
│ - Dashboard Creation             │
│ - Alarm Management               │
└──────────────┬───────────────────┘
               │
┌──────────────▼───────────────────┐
│    Admin Notifications           │
├──────────────────────────────────┤
│ - SNS Alerts                     │
│ - Email Notifications            │
│ - Slack Integration              │
│ - PagerDuty for Critical Issues  │
└──────────────────────────────────┘
```

## Deployment Environments

### Development

- Local Docker Compose setup
- LocalStack for AWS service mocking
- MongoDB local instance
- Development credentials

### Staging

- AWS Elastic Beanstalk (small instances)
- MongoDB Atlas (dev tier)
- SageMaker notebook for model development
- Test data only

### Production

- AWS Elastic Beanstalk (auto-scaling)
- MongoDB Atlas (M30 or higher)
- SageMaker Production Endpoint
- Real data with backups
- Multi-region failover

## Cost Optimization

1. **SageMaker**: Use reserved instances
2. **Lambda**: Optimize memory/timeout
3. **S3**: Lifecycle policies for old data
4. **CloudFront**: Cache aggressively
5. **Data Transfer**: Minimize cross-region
6. **Monitoring**: Use log sampling

## Disaster Recovery

### RTO: 1 hour

### RPO: 15 minutes

**Backup Strategy:**

- Daily S3 snapshots
- Hourly database backups
- Model versioning
- Cross-region replication

**Recovery Procedure:**

1. Trigger failover Lambda
2. Restore from latest backup
3. Verify data integrity
4. Update DNS records
5. Monitor for issues

## Performance Metrics

- **API Response Time**: < 200ms (p95)
- **ML Prediction Time**: < 100ms
- **Database Query Time**: < 50ms
- **Frontend Load Time**: < 2s
- **System Availability**: 99.9%

## Future Enhancements

1. Multi-model ensemble
2. Real-time data streaming (Kafka)
3. Advanced analytics (Apache Spark)
4. Mobile app (React Native)
5. Real-time notifications (WebSocket)
6. Graph database for spatial data
7. Machine learning drift detection
8. A/B testing framework
9. Federated learning
10. Enhanced geographic information systems

---

**Architecture Version**: 1.0  
**Last Updated**: January 2024
