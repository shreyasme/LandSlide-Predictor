import boto3
import os
import joblib
import json
from io import BytesIO

AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
S3_BUCKET = os.getenv("S3_BUCKET", "landslide-predictor-data")
SAGEMAKER_ENDPOINT = os.getenv("SAGEMAKER_ENDPOINT", "landslide-predictor-endpoint")

s3_client = boto3.client('s3', region_name=AWS_REGION)
sagemaker_client = boto3.client('sagemaker-runtime', region_name=AWS_REGION)

def upload_to_s3(file_content, key):
    try:
        s3_client.put_object(Bucket=S3_BUCKET, Key=key, Body=file_content)
        return True
    except Exception as e:
        print(f"Error uploading to S3: {e}")
        return False

def download_from_s3(key):
    try:
        response = s3_client.get_object(Bucket=S3_BUCKET, Key=key)
        return response['Body'].read()
    except Exception as e:
        print(f"Error downloading from S3: {e}")
        return None

def invoke_sagemaker_endpoint(data):
    try:
        response = sagemaker_client.invoke_endpoint(
            EndpointName=SAGEMAKER_ENDPOINT,
            ContentType='application/json',
            Body=json.dumps(data)
        )
        result = json.loads(response['Body'].read().decode())
        return result
    except Exception as e:
        print(f"Error invoking SageMaker endpoint: {e}")
        return None

def save_model(model, filename):
    joblib.dump(model, f"/tmp/{filename}")
    with open(f"/tmp/{filename}", 'rb') as f:
        upload_to_s3(f.read(), f"models/{filename}")

def load_model(filename):
    content = download_from_s3(f"models/{filename}")
    if content:
        return joblib.loads(content)
    return None
