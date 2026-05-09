# AWS Deployment Guide

## Complete AWS Deployment Architecture

This guide walks through deploying the Landslide Predictor to AWS cloud infrastructure.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    AWS Cloud Infrastructure                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐                                      │
│  │   Route 53           │  DNS Management                       │
│  └──────────┬───────────┘                                      │
│             │                                                   │
│  ┌──────────▼──────────┐                                       │
│  │  CloudFront CDN     │  Static Content Distribution          │
│  └──────────┬──────────┘                                       │
│             │                                                   │
│  ┌──────────▼──────────────────┐                               │
│  │   API Gateway               │  REST APIs                    │
│  │  - /predict                 │                               │
│  │  - /history                 │                               │
│  │  - /upload-dataset          │                               │
│  └──────────┬───────────┬──────┘                               │
│             │           │                                       │
│  ┌──────────▼──────┐  ┌─▼──────────────┐                       │
│  │  Lambda         │  │ Elastic        │                       │
│  │  Functions      │  │ Beanstalk      │                       │
│  │  - Predictions  │  │ - Backend API  │                       │
│  │  - Processing   │  │ - Auth         │                       │
│  └────────┬────────┘  └─┬──────────────┘                       │
│           │             │                                       │
│  ┌────────┴─────────────▼──────┐                               │
│  │   Amazon SageMaker Endpoint  │  ML Model Service            │
│  │   - Model: Random Forest     │                              │
│  │   - Predictions              │                              │
│  └────────┬─────────────────────┘                              │
│           │                                                     │
│  ┌────────▼─────────────────────┐                              │
│  │   Amazon S3                  │  Data Storage                │
│  │   - Models                   │  - Datasets                  │
│  │   - Reports                  │  - Logs                      │
│  └──────────┬────────────────────┘                             │
│             │                                                   │
│  ┌──────────▼────────────────────┐                             │
│  │   RDS / DocumentDB            │  Database                   │
│  │   - User data                 │  - Predictions              │
│  │   - Session management        │                             │
│  └───────────────────────────────┘                             │
│                                                                 │
│  ┌───────────────────────────────┐                             │
│  │   CloudWatch                  │  Monitoring & Logging       │
│  │   - Dashboards                │  - Alarms                   │
│  │   - Logs                      │  - Metrics                  │
│  └───────────────────────────────┘                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Prerequisites

1. **AWS Account** with admin/developer access
2. **AWS CLI** installed and configured
3. **Docker** and **Docker Compose** installed locally
4. **Git** for version control
5. **Access to AWS services**:
   - EC2
   - S3
   - SageMaker
   - Lambda
   - API Gateway
   - RDS/DocumentDB
   - CloudWatch
   - IAM
   - CloudFront
   - Route 53

## Step 1: AWS Account Setup

### 1.1 Create IAM User (Optional but Recommended)

```bash
# Create a new IAM user for deployment
aws iam create-user --user-name landslide-deployer

# Create access key
aws iam create-access-key --user-name landslide-deployer

# Attach policies
aws iam attach-user-policy \
  --user-name landslide-deployer \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

### 1.2 Configure AWS CLI

```bash
aws configure
# Enter: AWS Access Key ID
# Enter: AWS Secret Access Key
# Enter: Default region (us-east-1)
# Enter: Default output format (json)
```

## Step 2: Create S3 Bucket

```bash
# Set variables
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export BUCKET_NAME="landslide-predictor-${AWS_ACCOUNT_ID}"
export AWS_REGION="us-east-1"

# Create S3 bucket
aws s3 mb s3://${BUCKET_NAME} --region ${AWS_REGION}

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket ${BUCKET_NAME} \
  --versioning-configuration Status=Enabled

# Create folders
aws s3api put-object --bucket ${BUCKET_NAME} --key datasets/
aws s3api put-object --bucket ${BUCKET_NAME} --key models/
aws s3api put-object --bucket ${BUCKET_NAME} --key logs/
```

## Step 3: Set Up IAM Roles and Policies

### 3.1 Create SageMaker Execution Role

```bash
# Create trust policy
cat > trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "sagemaker.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create role
aws iam create-role \
  --role-name LandslideSageMakerRole \
  --assume-role-policy-document file://trust-policy.json

# Attach policies
aws iam attach-role-policy \
  --role-name LandslideSageMakerRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonSageMakerFullAccess

aws iam attach-role-policy \
  --role-name LandslideSageMakerRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
```

### 3.2 Create Lambda Execution Role

```bash
# Create trust policy for Lambda
cat > lambda-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create role
aws iam create-role \
  --role-name LandslideL ambdaRole \
  --assume-role-policy-document file://lambda-trust-policy.json

# Attach policies
aws iam attach-role-policy \
  --role-name LandslideL ambdaRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam attach-role-policy \
  --role-name LandslideL ambdaRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonSageMakerFullAccess

aws iam attach-role-policy \
  --role-name LandslideL ambdaRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
```

## Step 4: Deploy Backend to Elastic Beanstalk

### 4.1 Initialize Elastic Beanstalk

```bash
cd backend
eb init -p python-3.11 landslide-api --region ${AWS_REGION}
```

### 4.2 Create Environment

```bash
eb create landslide-env \
  --instance-type t3.medium \
  --envvars MONGO_URL=${MONGO_URL},SECRET_KEY=${SECRET_KEY},AWS_REGION=${AWS_REGION}
```

### 4.3 Deploy

```bash
eb deploy
```

Get the endpoints:

```bash
eb status
```

## Step 5: Deploy Frontend to CloudFront + S3

### 5.1 Build Frontend

```bash
cd frontend
npm install
npm run build
```

### 5.2 Create S3 Bucket for Frontend

```bash
export FRONTEND_BUCKET="landslide-predictor-frontend-${AWS_ACCOUNT_ID}"

aws s3 mb s3://${FRONTEND_BUCKET} --region ${AWS_REGION}

# Enable static website hosting
aws s3website s3://${FRONTEND_BUCKET} \
  --index-document index.html \
  --error-document index.html
```

### 5.3 Upload Frontend Files

```bash
aws s3 sync dist/ s3://${FRONTEND_BUCKET}/ \
  --delete \
  --cache-control "public, max-age=3600"
```

### 5.4 Create CloudFront Distribution

```bash
# Get S3 endpoint
export S3_ENDPOINT="${FRONTEND_BUCKET}.s3.${AWS_REGION}.amazonaws.com"

# Create CloudFront distribution
aws cloudfront create-distribution --cli-input-json file://cf-config.json
```

## Step 6: Set Up SageMaker Model

### 6.1 Upload Training Data

```bash
# Generate dataset locally
cd ml_model
python generate_dataset.py

# Upload to S3
aws s3 cp data/landslide_dataset.csv s3://${BUCKET_NAME}/datasets/
```

### 6.2 Create SageMaker Training Job

```bash
python aws_deployment/scripts/deploy_sagemaker.py
```

### 6.3 Monitor Training

```bash
aws sagemaker describe-training-job \
  --training-job-name landslide-training-YYYYMMDDHHMMSS
```

## Step 7: Deploy Lambda Function

### 7.1 Package Lambda Function

```bash
cd aws_deployment/lambda
pip install -r requirements.txt -t .
zip -r lambda-function.zip .
```

### 7.2 Create Lambda Function

```bash
ROLE_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:role/LandslideL ambdaRole"

aws lambda create-function \
  --function-name landslide-prediction \
  --runtime python3.11 \
  --role ${ROLE_ARN} \
  --handler prediction_handler.lambda_handler \
  --zip-file fileb://lambda-function.zip \
  --timeout 60 \
  --memory-size 512 \
  --environment Variables="{SAGEMAKER_ENDPOINT=landslide-predictor-endpoint}"
```

## Step 8: Create API Gateway

### 8.1 Create REST API

```bash
export API_NAME="landslide-api"

API_ID=$(aws apigateway create-rest-api \
  --name ${API_NAME} \
  --description "Landslide Predictor API" \
  --query 'id' \
  --output text)

echo "API ID: $API_ID"
```

### 8.2 Create Resources and Methods

```bash
# Get root resource
RESOURCES=$(aws apigateway get-resources --rest-api-id ${API_ID})
ROOT_ID=$(echo ${RESOURCES} | jq -r '.items[0].id')

# Create /predict resource
PREDICT_RESOURCE=$(aws apigateway create-resource \
  --rest-api-id ${API_ID} \
  --parent-id ${ROOT_ID} \
  --path-part predict \
  --query 'id' \
  --output text)

# Create POST method
aws apigateway put-method \
  --rest-api-id ${API_ID} \
  --resource-id ${PREDICT_RESOURCE} \
  --http-method POST \
  --authorization-type NONE
```

### 8.3 Integrate with Lambda

```bash
LAMBDA_ARN="arn:aws:apigateway:${AWS_REGION}:lambda:path/2015-03-31/functions/arn:aws:lambda:${AWS_REGION}:${AWS_ACCOUNT_ID}:function:landslide-prediction/invocations"

aws apigateway put-integration \
  --rest-api-id ${API_ID} \
  --resource-id ${PREDICT_RESOURCE} \
  --http-method POST \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri ${LAMBDA_ARN}
```

### 8.4 Deploy API

```bash
aws apigateway create-deployment \
  --rest-api-id ${API_ID} \
  --stage-name prod
```

## Step 9: Set Up Monitoring with CloudWatch

```bash
cd aws_deployment/scripts
python setup_monitoring.py
```

## Step 10: Configure Domain (Route 53)

### 10.1 Create Hosted Zone

```bash
aws route53 create-hosted-zone \
  --name landslide-predictor.com \
  --caller-reference $(date +%s)
```

### 10.2 Create Records

```bash
# Create A record for CloudFront
aws route53 change-resource-record-sets \
  --hosted-zone-id ZONEID \
  --change-batch file://route53-changes.json
```

## Step 11: Enable SSL/TLS with ACM

```bash
# Request certificate
aws acm request-certificate \
  --domain-name landslide-predictor.com \
  --validation-method DNS \
  --region ${AWS_REGION}

# Note: Manual DNS validation required in Route 53
```

## Step 12: Set Up CI/CD (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - name: Deploy backend
        run: cd backend && eb deploy
      - name: Deploy frontend
        run: |
          cd frontend
          npm install
          npm run build
          aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }}/
```

## Deployment Checklist

- [ ] AWS Account created and configured
- [ ] IAM roles and policies set up
- [ ] S3 buckets created
- [ ] MongoDB/DocumentDB set up
- [ ] Backend deployed to Elastic Beanstalk
- [ ] Frontend built and deployed to S3 + CloudFront
- [ ] SageMaker model trained and deployed
- [ ] Lambda function created
- [ ] API Gateway configured
- [ ] CloudWatch monitoring set up
- [ ] Domain configured in Route 53
- [ ] SSL/TLS certificate installed
- [ ] CI/CD pipeline configured
- [ ] Testing completed
- [ ] Performance optimized
- [ ] Backup and recovery procedures documented

## Monitoring and Maintenance

### CloudWatch Dashboard

```bash
# View dashboard
aws cloudwatch get-dashboard --dashboard-name LandslidePredictor
```

### View Logs

```bash
# Backend logs
aws logs tail /aws/elasticbeanstalk/landslide-env/var/log/eb-engine.log --follow

# Lambda logs
aws logs tail /aws/lambda/landslide-prediction --follow
```

### Auto-Scaling Configuration

```bash
# Configure auto-scaling for Elastic Beanstalk
eb scale 2
```

## Cost Estimation (Monthly)

- **SageMaker**: $50-200
- **Lambda**: $10-50
- **S3**: $10-30
- **Data Transfer**: $10-50
- **Elastic Beanstalk**: $30-100
- **CloudWatch**: $5-20
- **RDS/DocumentDB**: $50-150

**Total Estimated Cost**: $165-600/month

## Troubleshooting Deployment Issues

### Issue: EB deploy fails

```bash
# Check logs
eb logs

# SSH into instance
eb ssh

# Redeploy
eb deploy
```

### Issue: Lambda timeout

```bash
# Increase timeout
aws lambda update-function-configuration \
  --function-name landslide-prediction \
  --timeout 120
```

### Issue: API Gateway CORS errors

```bash
# Enable CORS on API Gateway
aws apigateway put-stage --rest-api-id ${API_ID} --stage-name prod
```

## Disaster Recovery

### Backup Strategy

- Daily S3 snapshots
- Weekly RDS backups
- Model versioning in S3

### Recovery

```bash
# Restore from backup
aws s3 sync s3://${BUCKET_NAME}/backups/models/ ./models/
```

## Security Best Practices

1. Use VPN for admin access
2. Enable MFA on AWS account
3. Rotate credentials regularly
4. Use CloudTrail for auditing
5. Enable WAF on API Gateway
6. Encrypt data in transit and at rest
7. Use Secrets Manager for sensitive data

## Support

For deployment issues:

- Check AWS documentation
- Review CloudWatch logs
- Create AWS Support ticket for critical issues

---

**Version**: 1.0  
**Last Updated**: January 2024
