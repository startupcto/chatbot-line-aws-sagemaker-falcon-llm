# Building GenAI Chatbot with LINE & LLM with AWS SageMaker Falcon Model

> :warning: **Make sure that `ml.g5.2xlarge` instance is available in the AWS region that you are using.**

## Demo

![Screenshot](screenshot.gif "Screenshot")

## Architecture

- LINE Messaging API (Nodejs)
- AWS API Gateway
- AWS Lambda (Nodejs)
- AWS SageMaker (Python)

![Architecture](architecture.jpg "Architecture")

### SageMaker

Refer to [TextGeneration](sagemaker/text-generation.ipynb)

### Lambda

```sh
# Config
aws lambda update-function-configuration --region=us-west-2 --function-name line-messaging-api-v2 --environment Variables="{LINE_ACCESS_TOKEN=...,LINE_SECRET_KEY=...}"

# Deploy & Publish
aws lambda update-function-code --region us-west-2 --function-name line-messaging-api-v2 --zip-file fileb://publish.zip --publish
```