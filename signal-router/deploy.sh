#!/bin/bash
# Deploy Signal Routing Authority to Google Cloud Run
# Usage: ./deploy.sh [project-id]

set -e

echo "🏛️ SIGNAL ROUTING AUTHORITY DEPLOYMENT SCRIPT"
echo "=============================================="

# Get project ID
if [ -n "$1" ]; then
    PROJECT_ID="$1"
else
    PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
fi

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: No Google Cloud project ID specified"
    echo "Usage: ./deploy.sh [project-id]"
    echo "Or set default project: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "📋 Project ID: $PROJECT_ID"
echo ""

# Configuration
REGION="us-central1"
SERVICE_NAME="signal-router"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

# Build the container image
echo "🔨 Building container image..."
gcloud builds submit --tag "$IMAGE_NAME" --project "$PROJECT_ID"

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"
echo ""

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --image "$IMAGE_NAME" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --set-env-vars="QUEEN_URL=https://httpbin.org/post,PORT=8080" \
  --project "$PROJECT_ID"

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed"
    exit 1
fi

echo "✅ Deployment successful"
echo ""

# Get the service URL
SRA_URL=$(gcloud run services describe "$SERVICE_NAME" \
  --platform managed \
  --region "$REGION" \
  --format 'value(status.url)' \
  --project "$PROJECT_ID")

echo "=============================================="
echo "🏛️ SRA DEPLOYED SUCCESSFULLY!"
echo "=============================================="
echo "Service URL: $SRA_URL"
echo ""
echo "Test the deployment:"
echo "  curl -s \"$SRA_URL/health\" | jq '.'"
echo ""
echo "Dashboard:"
echo "  curl -s \"$SRA_URL/\" | jq '.'"
echo ""
echo "Academic webhook endpoint:"
echo "  $SRA_URL/signals/academic"
echo ""
echo "Configure this URL in your Zapier webhook action!"
echo "=============================================="

# Test the health endpoint
echo ""
echo "🔍 Testing health endpoint..."
if command -v jq &> /dev/null; then
    curl -s "$SRA_URL/health" | jq '.'
else
    curl -s "$SRA_URL/health"
fi

exit 0
