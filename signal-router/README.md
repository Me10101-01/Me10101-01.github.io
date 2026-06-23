# Signal Routing Authority (SRA)

Permanent webhook routing service for academic, GitHub, and financial signals.

## 🏛️ Overview

The Signal Routing Authority is a Flask-based microservice deployed on Google Cloud Run that provides stable, permanent webhook endpoints for routing signals to various destinations (Zapier, webhooks, etc.).

## 🚀 Deployment

### Prerequisites
- Google Cloud SDK installed
- Google Cloud project with billing enabled
- Cloud Run API enabled

### Deploy to Google Cloud Run

```bash
# Build and push container image
gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/signal-router

# Deploy to Cloud Run
gcloud run deploy signal-router \
  --image gcr.io/$GOOGLE_CLOUD_PROJECT/signal-router \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

### Get Service URL

```bash
gcloud run services describe signal-router \
  --platform managed \
  --region us-central1 \
  --format 'value(status.url)'
```

## 📡 API Endpoints

### Health Check
```
GET /health
```
Returns service status and available routes.

### Signal Routing
```
POST /signals/academic
POST /signals/github
POST /signals/financial
```
Routes incoming signals to configured destinations.

```
GET /signals/{type}
```
Returns routing information for the specified signal type.

### Service Info
```
GET /
```
Returns service information and available endpoints.

## 🔧 Configuration

Environment variables for routing destinations:
- `ACADEMIC_ENDPOINT` - Academic signal destination URL
- `GITHUB_ENDPOINT` - GitHub signal destination URL
- `FINANCIAL_ENDPOINT` - Financial signal destination URL
- `PORT` - Service port (default: 8080)

## 🏗️ Architecture

```
Incoming Signal → SRA → Enrichment → Destination
                   ↓
              Routing Table
```

The SRA enriches each signal with metadata including:
- Signal type
- Routing timestamp
- Source IP
- SRA version

## 📦 Dependencies

- Flask 2.3.3
- Requests 2.31.0

## 🔒 Security

- All signals are enriched with metadata for audit trails
- Timeout protection on outbound requests (10s)
- Error handling for failed routing attempts
- Health check endpoint for monitoring

## 📝 License

Part of the Strategickhaos DAO LLC infrastructure.
