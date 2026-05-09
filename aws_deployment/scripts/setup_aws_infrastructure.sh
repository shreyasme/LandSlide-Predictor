#!/bin/bash

# AWS Landslide Predictor Deployment Script
# This script sets up the AWS infrastructure for the Landslide Predictor

set -e

PROJECT_NAME="landslide-predictor"
AWS_REGION="us-east-1"
ACCOUNT_ID="YOUR_AWS_ACCOUNT_ID"

echo "======================================"
echo "AWS Infrastructure Deployment"
echo "======================================"

# 1. Create IAM Role
echo "1. Creating IAM Role..."
cat > ml-role-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": [
          "sagemaker.amazonaws.com",
          "lambda.amazonaws.com"
        ]
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

aws iam create-role \
  --role-name LandslideMLRole \
  --assume-role-policy-document file://ml-role-trust-policy.json \
  --region $AWS_REGION || echo "Role already exists"

# 2. Attach policies
echo "2. Attaching policies to IAM role..."
aws iam attach-role-policy \
  --role-name LandslideMLRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonSageMakerFullAccess

aws iam attach-role-policy \
  --role-name LandslideMLRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

aws iam attach-role-policy \
  --role-name LandslideMLRole \
  --policy-arn arn:aws:iam::aws:policy/CloudWatchLogsFullAccess

# 3. Create S3 Bucket
echo "3. Creating S3 Bucket..."
BUCKET_NAME="${PROJECT_NAME}-data-${ACCOUNT_ID}"
aws s3 mb s3://$BUCKET_NAME --region $AWS_REGION || echo "Bucket already exists"

# 4. Upload Lambda function
echo "4. Uploading Lambda function..."
zip lambda-function.zip prediction_handler.py
aws lambda create-function \
  --function-name landslide-prediction \
  --runtime python3.9 \
  --role arn:aws:iam::${ACCOUNT_ID}:role/LandslideMLRole \
  --handler prediction_handler.lambda_handler \
  --zip-file fileb://lambda-function.zip \
  --region $AWS_REGION || echo "Lambda function already exists"

# 5. Create API Gateway
echo "5. Creating API Gateway..."
API_ID=$(aws apigateway create-rest-api \
  --name landslide-api \
  --description "Landslide Prediction API" \
  --region $AWS_REGION \
  --query 'id' \
  --output text)

echo "API Gateway created: $API_ID"

echo "======================================"
echo "Deployment Complete!"
echo "======================================"
echo "S3 Bucket: s3://$BUCKET_NAME"
echo "Lambda Function: landslide-prediction"
echo "API Gateway ID: $API_ID"
echo "======================================"
