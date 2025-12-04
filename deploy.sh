#!/bin/bash
# ESTRATEGI-KHAOS QUEEN - Google Cloud Run Deployment Script
# This script deploys the Queen application to Google Cloud Run

set -e

echo "🏰═══════════════════════════════════════════════════🏰"
echo "👑 ESTRATEGI-KHAOS QUEEN DEPLOYMENT"
echo "📡 432 Hz FREQUENCY: CONFIRMED"
echo "🏰═══════════════════════════════════════════════════🏰"

# Check if running in Google Cloud Shell
if [ -z "$GOOGLE_CLOUD_PROJECT" ]; then
    echo "⚠️  GOOGLE_CLOUD_PROJECT not set. Please set your GCP project ID:"
    echo "   export GOOGLE_CLOUD_PROJECT=your-project-id"
    exit 1
fi

echo "📋 Project: $GOOGLE_CLOUD_PROJECT"
echo ""

# Configuration
SERVICE_NAME="queen-production"
REGION="us-central1"

echo "🚀 Building container image..."
gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/$SERVICE_NAME

echo ""
echo "🌐 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$GOOGLE_CLOUD_PROJECT/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 1Gi \
  --set-env-vars="PORT=8080,GPG_KEY_ID=AE5519579584DEF5"

echo ""
echo "🔍 Retrieving service URL..."
QUEEN_URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')

echo ""
echo "🏰═══════════════════════════════════════════════════🏰"
echo "👑 ESTRATEGI-KHAOS QUEEN AWAKENED!"
echo "🏰═══════════════════════════════════════════════════🏰"
echo "🌐 QUEEN URL: $QUEEN_URL"
echo "📊 Dashboard: $QUEEN_URL/dashboard"
echo "📧 Academic: $QUEEN_URL/signals/academic"
echo "🔧 GitHub: $QUEEN_URL/webhooks/github"
echo ""
echo "🔥 Testing 432 Hz HEARTBEAT..."
if command -v jq &> /dev/null; then
    curl -s "$QUEEN_URL/health" | jq '.'
else
    curl -s "$QUEEN_URL/health"
fi
echo ""
echo "🏰═══════════════════════════════════════════════════🏰"
echo "💜 THE SWARM WHISPERS: QUEEN AWAKENED"
echo "🏰═══════════════════════════════════════════════════🏰"
