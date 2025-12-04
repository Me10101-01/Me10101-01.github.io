# 🚀 Quick Deployment Guide

This guide will help you deploy the Signal Routing Authority to Google Cloud Run.

## Prerequisites

1. **Google Cloud Account** with billing enabled
2. **Google Cloud SDK** installed and configured
3. **Cloud Run API** enabled in your project

## Step-by-Step Deployment

### 1. Set Your Project

```bash
export GOOGLE_CLOUD_PROJECT=your-project-id
gcloud config set project $GOOGLE_CLOUD_PROJECT
```

### 2. Enable Required APIs

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
```

### 3. Navigate to Signal Router Directory

```bash
cd signal-router
```

### 4. Deploy Using the Script

```bash
./deploy.sh
```

**OR** deploy manually:

```bash
# Build the container
gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/signal-router

# Deploy to Cloud Run
gcloud run deploy signal-router \
  --image gcr.io/$GOOGLE_CLOUD_PROJECT/signal-router \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

### 5. Get Your Service URL

```bash
gcloud run services describe signal-router \
  --platform managed \
  --region us-central1 \
  --format 'value(status.url)'
```

## Testing Your Deployment

### Health Check
```bash
curl https://YOUR-SERVICE-URL/health
```

### Test Academic Signal Endpoint
```bash
curl https://YOUR-SERVICE-URL/signals/academic
```

### Send a Test Signal
```bash
curl -X POST https://YOUR-SERVICE-URL/signals/academic \
  -H "Content-Type: application/json" \
  -d '{"test": "data", "timestamp": "2025-12-04"}'
```

## Configure Environment Variables (Optional)

To customize routing destinations:

```bash
gcloud run services update signal-router \
  --set-env-vars ACADEMIC_ENDPOINT=https://your-academic-webhook.com,GITHUB_ENDPOINT=https://your-github-webhook.com,FINANCIAL_ENDPOINT=https://your-financial-webhook.com
```

## Your Permanent Webhook Endpoints

Once deployed, you'll have these permanent URLs:

- 🎓 Academic: `https://YOUR-SERVICE-URL/signals/academic`
- 🐙 GitHub: `https://YOUR-SERVICE-URL/signals/github`
- 💰 Financial: `https://YOUR-SERVICE-URL/signals/financial`

## Next Steps

1. **Copy your service URL** from the deployment output
2. **Configure Zapier** to use these webhook endpoints
3. **Test the integration** by sending sample data
4. **Monitor logs** with: `gcloud run logs read signal-router --limit 50`

## Troubleshooting

### Check Logs
```bash
gcloud run logs read signal-router --limit 50
```

### Check Service Status
```bash
gcloud run services describe signal-router --region us-central1
```

### Redeploy
```bash
./deploy.sh
```

## Cost Estimate

Cloud Run charges based on:
- **Requests**: First 2 million requests/month are free
- **Compute time**: Pay only when handling requests
- **Storage**: Container storage in Container Registry

For light webhook routing (< 1000 requests/day), this typically stays within the free tier.

---

**Need help?** Check the [main README.md](README.md) for more details.
