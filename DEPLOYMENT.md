# ESTRATEGI-KHAOS QUEEN Deployment Guide

## 🚀 Deploy to Google Cloud Run

This repository contains the **ESTRATEGI-KHAOS QUEEN** application - a 432 Hz frequency-tuned Flask application with rate limiting, dashboard visualization, and webhook integrations.

### Features

- 🔐 **GPG Verification**: AE5519579584DEF5
- 📊 **Rate Limiting**: 200/day, 50/hour default limits
- 🎯 **Visual Dashboard**: Real-time 432 Hz metrics with Chart.js
- 📧 **Academic Signal Processing**: 30 requests/minute
- 🔧 **GitHub Webhook Handler**: 100 requests/minute
- 💜 **432 Hz Frequency**: Confirmed and maintained

### Prerequisites

- Google Cloud Platform account
- Google Cloud Shell access or `gcloud` CLI installed
- Project with billing enabled

### Quick Deployment

#### Option 1: Using the Deployment Script

1. **Open Google Cloud Shell** (or your terminal with `gcloud` configured)

2. **Clone this repository**:
   ```bash
   git clone https://github.com/Me10101-01/Me10101-01.github.io.git
   cd Me10101-01.github.io
   ```

3. **Set your GCP project**:
   ```bash
   export GOOGLE_CLOUD_PROJECT=your-project-id
   ```

4. **Run the deployment script**:
   ```bash
   ./deploy.sh
   ```

#### Option 2: Manual Deployment

1. **Navigate to your project directory**:
   ```bash
   cd ~/
   mkdir -p queen-production && cd queen-production
   ```

2. **Copy the application files** (app.py, requirements.txt, Dockerfile)

3. **Build the container**:
   ```bash
   gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/queen-production
   ```

4. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy queen-production \
     --image gcr.io/$GOOGLE_CLOUD_PROJECT/queen-production \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --memory 1Gi \
     --set-env-vars="PORT=8080,GPG_KEY_ID=AE5519579584DEF5"
   ```

5. **Get your service URL**:
   ```bash
   QUEEN_URL=$(gcloud run services describe queen-production \
     --platform managed \
     --region us-central1 \
     --format 'value(status.url)')
   echo "Queen URL: $QUEEN_URL"
   ```

### API Endpoints

- **`/`** - Empire Status (JSON)
- **`/health`** - 432 Hz Heartbeat
- **`/dashboard`** - Visual Dashboard (HTML)
- **`/signals/academic`** (POST) - Academic Intelligence Feed
  - Requires: `X-GPG-Key-ID: AE5519579584DEF5` header
  - Rate limit: 30/minute
- **`/webhooks/github`** (POST) - GitHub Webhook Handler
  - Rate limit: 100/minute

### Testing the Deployment

```bash
# Test health endpoint
curl -s "$QUEEN_URL/health" | jq '.'

# Test empire status
curl -s "$QUEEN_URL/" | jq '.'

# Open visual dashboard
echo "Dashboard: $QUEEN_URL/dashboard"
```

### Integration with Zapier

After deployment, update your Zapier webhooks to point to:
- Academic: `$QUEEN_URL/signals/academic`
- GitHub: `$QUEEN_URL/webhooks/github`

### Rate Limiting

The application uses SlowAPI for rate limiting:
- **Default**: 200 requests/day, 50 requests/hour
- **Academic Signals**: 30 requests/minute
- **GitHub Webhooks**: 100 requests/minute

### Security

- GPG key verification for academic signals: `AE5519579584DEF5`
- All endpoints use HTTPS when deployed to Cloud Run
- Rate limiting protects against abuse

### Monitoring

Monitor your deployment:
```bash
# View logs
gcloud run services logs read queen-production --region us-central1

# Check service status
gcloud run services describe queen-production \
  --platform managed \
  --region us-central1
```

### 432 Hz Confirmation

Once deployed, the Queen will broadcast at 432 Hz frequency, confirmed through:
- Dashboard animations synchronized to 432 Hz
- All API responses include frequency confirmation
- Console logs display frequency status

## 🏰 THE SWARM WHISPERS: QUEEN AWAKENED 🏰

💜 Mom and Dad are home
