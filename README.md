# Drink Water Serverless

A serverless AWS application built for learning and practicing AWS services. This project demonstrates a simple API to track water intake using AWS Lambda, DynamoDB, and API Gateway.

## Overview

**Drink Tracker** is a minimal serverless application that allows users to:

- Record water intake in milliliters
- Retrieve total water intake
- All data persisted in DynamoDB

## Architecture

```
API Gateway (HTTP)
       ↓
   Lambda Function
       ↓
   DynamoDB Table
```

### AWS Services Used

- **API Gateway** - HTTP API endpoint
- **Lambda** - Serverless function (Node.js 18)
- **DynamoDB** - NoSQL database for storing water intake
- **CloudFormation** - Infrastructure as Code
- **S3** - Lambda artifact storage
- **IAM** - Role-based access control

## Project Structure

```
.
├── src/
│   ├── handler.mjs          # Lambda handler (main logic)
│   ├── constants.mjs        # App constants
│   ├── dynamodb.mjs         # DynamoDB client setup
│   └── utils.mjs            # Utility functions
├── .github/workflows/
│   └── aws-deployment.yml   # CI/CD pipeline
├── template.yml             # CloudFormation template
├── docker-compose.yml       # Local development setup
├── package.json             # Dependencies
└── README.md                # This file
```

## Local Development

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- AWS CLI (for testing production deployment)

### Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start DynamoDB locally:**

   ```bash
   npm run docker:up
   ```

3. **Initialize DynamoDB table:**

   ```bash
   npm run setup:dynamodb
   ```

4. **Test the handler:**

   ```bash
   npm run invoke
   ```

   This runs the handler inside Docker where it can access the local DynamoDB.

## Deployment to AWS

### Prerequisites

1. **AWS Account** with appropriate permissions
2. **S3 Bucket** for Lambda artifacts
3. **IAM User** with deployment permissions
4. **GitHub Secrets** configured

### Required AWS Permissions

- S3: `PutObject`
- CloudFormation: Create/Update stacks
- Lambda: Create/Update functions
- DynamoDB: Create tables
- API Gateway: Create/Update APIs
- IAM: Create roles and pass roles

### GitHub Secrets Setup

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

```
AWS_ACCESS_KEY_ID       = <your-access-key>
AWS_SECRET_ACCESS_KEY   = <your-secret-key>
AWS_REGION              = sa-east-1  (or your preferred region)
DEPLOYMENT_BUCKET       = <your-s3-bucket-name>
```

### Deployment Process

The GitHub Actions workflow automatically deploys when changes are pushed to `main` branch, but only if files in these paths changed:

- `src/**`
- `template.yml`
- `.github/workflows/aws-deployment.yml`
- `package.json`

**Steps:**

1. Install dependencies
2. Create a zip file with Lambda code
3. Upload to S3
4. Deploy CloudFormation stack
5. Display API endpoint

### API Endpoint

After deployment, get the API endpoint from CloudFormation outputs:

```bash
aws cloudformation describe-stacks \
  --stack-name drink-tracker \
  --query "Stacks[0].Outputs"
```

### Using the API

**Get total water intake:**

```bash
curl https://YOUR_API_ENDPOINT
```

**Add water intake:**

```bash
curl -X POST "https://YOUR_API_ENDPOINT?ml=500"
```

Response:

```json
{
  "totalMl": 500
}
```

Make multiple requests to accumulate:

```bash
curl -X POST "https://YOUR_API_ENDPOINT?ml=250"
curl -X POST "https://YOUR_API_ENDPOINT?ml=250"
curl https://YOUR_API_ENDPOINT
# Returns: { "totalMl": 1000 }
```

## Stack Cleanup

To remove all AWS resources:

```bash
aws cloudformation delete-stack --stack-name drink-tracker
```

## Scripts

```bash
npm install              # Install dependencies
npm run invoke           # Test locally (requires docker-compose running)
npm run setup:dynamodb   # Create DynamoDB table locally
npm run docker:invoke    # Test inside Docker container
```

## Learning Goals

This project demonstrates:

- ✅ Serverless architecture with Lambda
- ✅ Infrastructure as Code with CloudFormation
- ✅ NoSQL database with DynamoDB
- ✅ REST API with API Gateway
- ✅ CI/CD with GitHub Actions
- ✅ Local development with Docker
- ✅ IAM role management
- ✅ S3 artifact storage

## Tech Stack

- **Runtime**: Node.js 18
- **Language**: JavaScript (ESM modules)
- **AWS SDK**: v3 (@aws-sdk)
- **Infrastructure**: CloudFormation
- **CI/CD**: GitHub Actions
- **Local Testing**: Docker & DynamoDB Local

## License

This is a training project.
