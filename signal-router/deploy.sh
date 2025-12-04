#!/bin/bash
# Signal Routing Authority Deployment Script
# Deploys the SRA to Google Cloud Run

set -e  # Exit on error

echo "🏛️════════════════════════════════════════════════🏛️"
echo "   DEPLOYING SIGNAL ROUTING AUTHORITY"
echo "🏛️════════════════════════════════════════════════🏛️"
echo ""

# Check for required environment variables
if [ -z "$GOOGLE_CLOUD_PROJECT" ]; then
    echo "❌ Error: GOOGLE_CLOUD_PROJECT environment variable is not set"
    echo "   Please set it with: export GOOGLE_CLOUD_PROJECT=your-project-id"
    exit 1
fi
echo "✓ Using project: $GOOGLE_CLOUD_PROJECT"
echo ""

# Verify files exist
echo "📁 Verifying files..."
if [ ! -f "Dockerfile" ]; then
    echo "❌ Dockerfile not found!"
    exit 1
fi
if [ ! -f "app.py" ]; then
    echo "❌ app.py not found!"
    exit 1
fi
if [ ! -f "requirements.txt" ]; then
    echo "❌ requirements.txt not found!"
    exit 1
fi
echo "✓ All files present"
echo ""

# Build and push container
echo "🚀 Building container image..."
gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/signal-router

echo ""
echo "🌐 Deploying to Cloud Run..."
gcloud run deploy signal-router \
  --image gcr.io/$GOOGLE_CLOUD_PROJECT/signal-router \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080

# Get the deployed URL
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
curl -s "$SRA_URL/health" | python3 -m json.tool
echo ""
echo "🏛️════════════════════════════════════════════════🏛️"
echo ""
echo "✅ Deployment complete! Use the endpoints above in Zapier."
echo ""
