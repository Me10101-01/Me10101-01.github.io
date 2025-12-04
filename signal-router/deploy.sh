#!/bin/bash
# Deploy Signal Routing Authority to Google Cloud Run

set -e

echo "🏛️ Signal Routing Authority Deployment Script"
echo "================================================"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Please install it first."
    exit 1
fi

# Get the project ID
GOOGLE_CLOUD_PROJECT=$(gcloud config get-value project 2>/dev/null)

if [ -z "$GOOGLE_CLOUD_PROJECT" ]; then
    echo "❌ No Google Cloud project configured."
    echo "Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "📦 Google Cloud Project: $GOOGLE_CLOUD_PROJECT"
echo ""

# Build and push the container
echo "🔨 Building container image..."
gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/signal-router

echo ""
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy signal-router \
  --image gcr.io/$GOOGLE_CLOUD_PROJECT/signal-router \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080

echo ""
echo "🔍 Getting service URL..."
SRA_URL=$(gcloud run services describe signal-router --platform managed --region us-central1 --format 'value(status.url)')

echo ""
echo "🏛️════════════════════════════════════════════════🏛️"
echo "   SIGNAL ROUTING AUTHORITY DEPLOYED!"
echo "🏛️════════════════════════════════════════════════🏛️"
echo "🌐 URL: $SRA_URL"
echo ""
echo "📡 Your PERMANENT webhook endpoints:"
echo "   $SRA_URL/signals/academic"
echo "   $SRA_URL/signals/github"
echo "   $SRA_URL/signals/financial"
echo ""
echo "🔥 Testing health..."
if ! HEALTH_RESPONSE=$(curl -s "$SRA_URL/health"); then
    echo "❌ Failed to reach health endpoint"
    exit 1
fi

echo "$HEALTH_RESPONSE" | python3 -m json.tool

# Validate health response
if ! echo "$HEALTH_RESPONSE" | grep -q '"status": "healthy"'; then
    echo "❌ Service not reporting healthy status"
    exit 1
fi

echo "✅ Service is healthy and responding correctly!"
echo ""
echo "🏛️════════════════════════════════════════════════🏛️"
