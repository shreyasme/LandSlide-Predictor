import boto3
import os
import pandas as pd
from datetime import datetime

sagemaker = boto3.client('sagemaker')
s3 = boto3.client('s3')

BUCKET = 'landslide-predictor-data'
ROLE_ARN = 'arn:aws:iam::ACCOUNT_ID:role/LandslideMLRole'
INSTANCE_TYPE = 'ml.m5.large'

def create_sagemaker_training_job(dataset_path):
    """Create SageMaker training job"""
    job_name = f'landslide-training-{datetime.now().strftime("%Y%m%d%H%M%S")}'
    
    response = sagemaker.create_training_job(
        TrainingJobName=job_name,
        RoleArn=ROLE_ARN,
        AlgorithmSpecification={
            'TrainingImage': '382416733822.dkr.ecr.us-east-1.amazonaws.com/image_uri:latest',
            'TrainingInputMode': 'File'
        },
        InputDataConfig=[
            {
                'ChannelName': 'training',
                'DataSource': {
                    'S3DataSource': {
                        'S3DataType': 'S3Prefix',
                        'S3Uri': dataset_path,
                        'S3DataDistributionType': 'FullyReplicated'
                    }
                }
            }
        ],
        OutputDataConfig={
            'S3OutputPath': f's3://{BUCKET}/models'
        },
        ResourceConfig={
            'InstanceType': INSTANCE_TYPE,
            'InstanceCount': 1,
            'VolumeSizeInGB': 30
        },
        StoppingCondition={'MaxRuntimeInSeconds': 3600},
        HyperParameters={
            'max_depth': '15',
            'num_trees': '100'
        }
    )
    
    print(f"Training job created: {job_name}")
    return job_name

def create_sagemaker_model(model_data_url):
    """Create SageMaker model"""
    model_name = f'landslide-model-{datetime.now().strftime("%Y%m%d%H%M%S")}'
    
    response = sagemaker.create_model(
        ModelName=model_name,
        PrimaryContainer={
            'Image': '382416733822.dkr.ecr.us-east-1.amazonaws.com/image_uri:latest',
            'ModelDataUrl': model_data_url
        },
        ExecutionRoleArn=ROLE_ARN
    )
    
    print(f"Model created: {model_name}")
    return model_name

def create_sagemaker_endpoint_config(model_name):
    """Create SageMaker endpoint configuration"""
    config_name = f'landslide-config-{datetime.now().strftime("%Y%m%d%H%M%S")}'
    
    response = sagemaker.create_endpoint_config(
        EndpointConfigName=config_name,
        ProductionVariants=[
            {
                'VariantName': 'variant1',
                'ModelName': model_name,
                'InstanceType': 'ml.m5.large',
                'InitialInstanceCount': 1
            }
        ]
    )
    
    print(f"Endpoint config created: {config_name}")
    return config_name

def deploy_sagemaker_endpoint(config_name):
    """Deploy SageMaker endpoint"""
    endpoint_name = 'landslide-predictor-endpoint'
    
    try:
        sagemaker.delete_endpoint(EndpointName=endpoint_name)
        print(f"Deleted existing endpoint: {endpoint_name}")
    except:
        pass
    
    response = sagemaker.create_endpoint(
        EndpointName=endpoint_name,
        EndpointConfigName=config_name
    )
    
    print(f"Endpoint deployed: {endpoint_name}")
    return endpoint_name

def main():
    print("AWS SageMaker Deployment Script")
    print("=" * 50)
    
    # Dataset path in S3
    dataset_url = f's3://{BUCKET}/datasets/landslide_dataset.csv'
    
    # Create training job
    training_job = create_sagemaker_training_job(dataset_url)
    
    # Wait for training to complete (would check status in production)
    print("Waiting for training job to complete...")
    print("In production, use waiter: client.get_waiter('training_job_completed_or_stopped')")

if __name__ == "__main__":
    main()
