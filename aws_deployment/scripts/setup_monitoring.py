import boto3
import json
from datetime import datetime

cloudwatch = boto3.client('cloudwatch')
logs = boto3.client('logs')

def create_cloudwatch_dashboard():
    """Create CloudWatch dashboard for monitoring"""
    
    dashboard_body = {
        "widgets": [
            {
                "type": "metric",
                "properties": {
                    "metrics": [
                        ["AWS/SageMaker", "ModelInvocations"],
                        [".", "ModelLatency"],
                        ["AWS/Lambda", "Duration"],
                        [".", "Errors"]
                    ],
                    "period": 300,
                    "stat": "Average",
                    "region": "us-east-1",
                    "title": "Model Performance"
                }
            },
            {
                "type": "metric",
                "properties": {
                    "metrics": [
                        ["AWS/ApiGateway", "Count"],
                        [".", "4XXError"],
                        [".", "5XXError"]
                    ],
                    "period": 300,
                    "stat": "Sum",
                    "region": "us-east-1",
                    "title": "API Gateway Metrics"
                }
            }
        ]
    }
    
    response = cloudwatch.put_dashboard(
        DashboardName='LandslidePredictor',
        DashboardBody=json.dumps(dashboard_body)
    )
    
    print("CloudWatch dashboard created: LandslidePredictor")

def create_log_group():
    """Create CloudWatch log group"""
    try:
        logs.create_log_group(
            logGroupName='/aws/lambda/landslide-prediction'
        )
        print("Log group created")
    except logs.exceptions.ResourceAlreadyExistsException:
        print("Log group already exists")

def create_alarms():
    """Create CloudWatch alarms"""
    
    # Lambda error alarm
    cloudwatch.put_metric_alarm(
        AlarmName='LandslidePredictor-LambdaErrors',
        MetricName='Errors',
        Namespace='AWS/Lambda',
        Statistic='Sum',
        Period=300,
        EvaluationPeriods=1,
        Threshold=5,
        ComparisonOperator='GreaterThanThreshold',
        Dimensions=[{'Name': 'FunctionName', 'Value': 'landslide-prediction'}]
    )
    
    # API Gateway 5XX errors
    cloudwatch.put_metric_alarm(
        AlarmName='LandslidePredictor-APIErrors',
        MetricName='5XXError',
        Namespace='AWS/ApiGateway',
        Statistic='Sum',
        Period=300,
        EvaluationPeriods=1,
        Threshold=10,
        ComparisonOperator='GreaterThanThreshold'
    )
    
    print("Alarms created successfully")

if __name__ == "__main__":
    create_log_group()
    create_cloudwatch_dashboard()
    create_alarms()
    print("CloudWatch monitoring setup complete!")
