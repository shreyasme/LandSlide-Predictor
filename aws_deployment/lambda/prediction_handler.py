import json
import boto3
import base64
import numpy as np
from io import BytesIO

sagemaker_runtime = boto3.client('sagemaker-runtime')

def lambda_handler(event, context):
    """
    AWS Lambda function for landslide prediction
    Invokes SageMaker endpoint
    """
    try:
        # Parse input
        body = json.loads(event['body'])
        
        # Prepare prediction data
        features = [
            float(body['rainfall']),
            float(body['humidity']),
            float(body['soil_moisture']),
            float(body['slope_angle']),
            encode_soil_type(body['soil_type']),
            float(body['temperature']),
            float(body['earthquake_intensity']),
            float(body['elevation']),
            float(body['vegetation_density']),
            float(body['water_level'])
        ]
        
        # Invoke SageMaker endpoint
        endpoint_name = 'landslide-predictor-endpoint'
        
        response = sagemaker_runtime.invoke_endpoint(
            EndpointName=endpoint_name,
            ContentType='application/json',
            Body=json.dumps({'data': [features]})
        )
        
        # Parse response
        result = json.loads(response['Body'].read().decode())
        prediction = result['predictions'][0]
        
        # Determine risk level
        if prediction < 0.33:
            risk_level = 'LOW'
        elif prediction < 0.67:
            risk_level = 'MEDIUM'
        else:
            risk_level = 'HIGH'
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'risk_level': risk_level,
                'probability': float(prediction),
                'message': 'Prediction successful'
            })
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e)
            })
        }

def encode_soil_type(soil_type):
    """Encode soil type to numeric value"""
    encoding = {
        'clay': 0,
        'sand': 1,
        'silt': 2,
        'rock': 3
    }
    return encoding.get(soil_type.lower(), 0)
