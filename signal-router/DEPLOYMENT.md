# 🏛️ Signal Routing Authority - Deployment Guide

This guide provides complete instructions for deploying the Signal Routing Authority (SRA) to Google Cloud Run.

## 📋 Prerequisites

Before deploying, ensure you have:

1. **Google Cloud Project**
   - Active GCP project with billing enabled
   - Project ID ready

2. **gcloud CLI**
   - Installed and configured
   - Authenticated with your Google account

3. **Required APIs**
   - Cloud Run API
   - Cloud Build API
   - Container Registry API

## 🚀 Quick Deployment

### Option 1: Automated Script (Recommended)

```bash
cd signal-router
./deploy.sh
```

This script will:
- Build the container image
- Push to Google Container Registry
- Deploy to Cloud Run (us-central1)
- Display your webhook URLs
- Test the health endpoint

### Option 2: Manual Deployment

```bash
# Navigate to the signal-router directory
cd signal-router

# Set your project ID
export GOOGLE_CLOUD_PROJECT=your-project-id

# Build and push the container
gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/signal-router

# Deploy to Cloud Run
gcloud run deploy signal-router \
  --image gcr.io/$GOOGLE_CLOUD_PROJECT/signal-router \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080

# Get the service URL
gcloud run services describe signal-router \
  --platform managed \
  --region us-central1 \
  --format 'value(status.url)'
```

## 🔧 Initial Setup

### 1. Enable Required APIs

```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 2. Set Default Region (Optional)

```bash
gcloud config set run/region us-central1
```

### 3. Authenticate gcloud

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

## 📡 Using Your Deployment

Once deployed, you'll receive a URL like:
```
https://signal-router-RANDOM-uc.a.run.app
```

### Webhook Endpoints

Use these endpoints in Zapier, webhooks, or other integrations:

- **Academic Signals:** `https://YOUR-URL/signals/academic`
- **GitHub Signals:** `https://YOUR-URL/signals/github`
- **Financial Signals:** `https://YOUR-URL/signals/financial`

### Test Your Deployment

```bash
# Health check
curl https://YOUR-URL/health

# Send a test signal
curl -X POST https://YOUR-URL/signals/academic \
  -H "Content-Type: application/json" \
  -d '{"event": "test", "source": "manual"}'

# View routing table
curl https://YOUR-URL/routing-table
```

## 🔒 Security Considerations

### Production Deployment

For production use, consider:

1. **Authentication**: Remove `--allow-unauthenticated` and implement proper auth
2. **Rate Limiting**: Add rate limiting to prevent abuse
3. **Logging**: Enable Cloud Logging for audit trails
4. **Secrets**: Use Secret Manager for sensitive configuration

### Enable Authentication

```bash
gcloud run deploy signal-router \
  --image gcr.io/$GOOGLE_CLOUD_PROJECT/signal-router \
  --platform managed \
  --region us-central1 \
  --no-allow-unauthenticated
```

Then use service accounts or IAM for access control.

## 📊 Monitoring

### View Logs

```bash
gcloud run services logs read signal-router \
  --platform managed \
  --region us-central1
```

### View Metrics

```bash
# In Google Cloud Console
# Navigate to: Cloud Run → signal-router → Metrics
```

## 🔄 Updates and Redeployment

To update the service after code changes:

```bash
cd signal-router
./deploy.sh
```

Or manually:

```bash
gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/signal-router
gcloud run deploy signal-router --image gcr.io/$GOOGLE_CLOUD_PROJECT/signal-router
```

## 🧪 Local Testing

Test locally before deploying:

```bash
cd signal-router

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run locally
python app.py
```

The service will be available at `http://localhost:8080`

## 🐛 Troubleshooting

### Build Failures

```bash
# Check Cloud Build logs
gcloud builds log $(gcloud builds list --limit=1 --format='value(id)')
```

### Deployment Failures

```bash
# Check deployment status
gcloud run services describe signal-router \
  --platform managed \
  --region us-central1

# View recent logs
gcloud run services logs read signal-router --limit=50
```

### Common Issues

1. **Permission Denied**: Ensure billing is enabled and APIs are activated
2. **Region Not Available**: Change region to one available for Cloud Run
3. **Image Not Found**: Verify the image was pushed to Container Registry

## 💰 Cost Estimation

Cloud Run pricing (as of Dec 2024):
- **Free Tier**: 2 million requests/month
- **CPU**: $0.00002400 per vCPU-second
- **Memory**: $0.00000250 per GiB-second
- **Requests**: $0.40 per million requests

For typical webhook usage, costs should remain within the free tier.

## 📚 Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Signal Router README](README.md)

## ✅ Success Checklist

After deployment, verify:

- [ ] Service is accessible via HTTPS
- [ ] Health endpoint returns 200 OK
- [ ] All three signal endpoints accept POST requests
- [ ] Routing table endpoint returns configuration
- [ ] Logs are visible in Cloud Console

## 🎯 Next Steps

1. **Configure Zapier**: Add webhook URLs to your Zaps
2. **Set Up Monitoring**: Configure alerts for errors
3. **Implement Authentication**: Add security for production
4. **Scale Settings**: Adjust min/max instances if needed

---

**Need Help?**

Check the logs, review the code in `app.py`, or consult the Cloud Run documentation.
