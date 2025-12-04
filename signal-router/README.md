# Signal Routing Authority (SRA)

A Flask-based webhook routing service that receives and routes signals to appropriate destinations.

## Features

- **Health Check**: `/health` - Service health monitoring
- **Signal Routing**: `/signals/{type}` - Route signals to appropriate destinations
  - `/signals/academic` - Academic intelligence signals
  - `/signals/github` - GitHub event signals
  - `/signals/financial` - Financial signals
- **Routing Table**: `/routing-table` - View current routing configuration

## Deployment to Google Cloud Run

### Prerequisites

- Google Cloud Project with billing enabled
- gcloud CLI installed and configured

### Deploy

```bash
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

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run the app
python app.py
```

The service will be available at `http://localhost:8080`

## API Usage

### Health Check
```bash
curl https://YOUR-SERVICE-URL/health
```

### Route a Signal
```bash
curl -X POST https://YOUR-SERVICE-URL/signals/academic \
  -H "Content-Type: application/json" \
  -d '{"event": "test", "data": "sample"}'
```

### View Routing Table
```bash
curl https://YOUR-SERVICE-URL/routing-table
```

## Architecture

The SRA acts as a centralized routing hub that:
1. Receives webhook signals from various sources
2. Routes them to appropriate processing services based on signal type
3. Provides monitoring and health check endpoints

## Signal Types

- **Academic**: Routes to academic intelligence processors
- **GitHub**: Routes to code analyzers and deployment trackers
- **Financial**: Routes to financial data processors
