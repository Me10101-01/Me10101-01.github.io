# 🏛️ Signal Routing Authority (SRA)

**The Permanent Webhook Infrastructure Department**  
**GPG: AE5519579584DEF5**

## Overview

The Signal Routing Authority (SRA) is the central webhook routing infrastructure for the Strategickhaos DAO LLC ecosystem. It provides a permanent, stable endpoint for all incoming signals (webhooks) and routes them to the appropriate downstream services.

## Architecture

### Signal Types Supported
- **Academic**: Research papers, journal articles, academic intelligence
- **GitHub**: Repository events, issues, pull requests, deployments
- **Financial**: Treasury operations, financial alerts
- **Discord**: Community signals and notifications

### Routing Table
The SRA maintains a permanent routing table that maps signal types to their destinations:
- Academic → Queen Service (http://localhost:3000/signals/academic)
- GitHub → Queen Service (http://localhost:3000/webhooks/github)
- Financial → Treasury Service (http://localhost:3001/signals/financial)
- Discord → Queen Service (http://localhost:3000/signals/discord)

## Deployment

### Prerequisites
- Google Cloud Platform account with billing enabled
- `gcloud` CLI installed and configured
- Docker installed (optional, for local testing)

### Deploy to Google Cloud Run

1. **Navigate to the signal-router directory:**
   ```bash
   cd signal-router
   ```

2. **Build and submit the container image:**
   ```bash
   gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/signal-router
   ```

3. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy signal-router \
     --image gcr.io/$GOOGLE_CLOUD_PROJECT/signal-router \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars="QUEEN_URL=https://httpbin.org/post,PORT=8080"
   ```

4. **Get the deployed service URL:**
   ```bash
   SRA_URL=$(gcloud run services describe signal-router --platform managed --region us-central1 --format 'value(status.url)')
   echo "🏛️ SRA DEPLOYED: $SRA_URL"
   ```

5. **Test the deployment:**
   ```bash
   curl -s "$SRA_URL/health" | jq '.'
   ```

### Environment Variables

Configure these environment variables for production deployment:

- `QUEEN_URL`: Base URL for the Queen service (default: http://localhost:3000)
- `TREASURY_URL`: Base URL for the Treasury service (default: http://localhost:3001)
- `PORT`: Port to run the service on (default: 8080)

### Local Development

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the application:**
   ```bash
   python app.py
   ```

3. **Test locally:**
   ```bash
   curl http://localhost:8080/health
   ```

## API Endpoints

### Dashboard
- **GET** `/`
- Returns service status, version, routing table, and statistics

### Health Check
- **GET** `/health`
- Returns service health status

### Signal Endpoints
- **POST** `/signals/academic` - Route academic intelligence signals
- **POST** `/signals/github` - Route GitHub webhook signals
- **POST** `/signals/financial` - Route financial signals

## Integration with Zapier

The SRA provides permanent endpoints for Zapier integrations:

### Academic Pipeline
Configure your Zapier webhook action to send to:
```
https://signals.strategickhaos.ai/academic
```

**Expected Request Format:**
```json
{
  "sender": "email@example.com",
  "subject": "Research Paper Title",
  "summary": "GPT-4o mini generated summary",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### GitHub Webhooks
Configure GitHub webhooks to send to:
```
https://signals.strategickhaos.ai/github
```

## Security

- All endpoints are configured for unauthenticated access for webhook compatibility
- Consider implementing API key authentication for production use
- Review and update the routing table regularly
- Monitor the dashboard for unusual activity

## Statistics

The SRA tracks:
- Total signals routed
- Last signal timestamp
- Service uptime

Access statistics via the dashboard endpoint (`/`).

## Monitoring

### Health Checks
```bash
curl https://your-sra-url.run.app/health
```

### Dashboard
```bash
curl https://your-sra-url.run.app/ | jq '.'
```

## Troubleshooting

### Common Issues

1. **502 Bad Gateway when routing signals**
   - Check that downstream services (Queen, Treasury) are running
   - Verify the environment variables are set correctly
   - Check network connectivity between services

2. **Service not starting**
   - Verify Python dependencies are installed
   - Check PORT environment variable
   - Review Cloud Run logs: `gcloud run logs read signal-router`

3. **Webhook not receiving data**
   - Verify the webhook URL in Zapier/GitHub
   - Check request format matches expected schema
   - Review application logs for errors

## Maintenance

### Updating the Routing Table
Edit the `ROUTES` dictionary in `app.py`:
```python
ROUTES = {
    'academic': os.environ.get('QUEEN_URL', 'http://localhost:3000/signals/academic'),
    'github': os.environ.get('QUEEN_URL', 'http://localhost:3000/webhooks/github'),
    # Add new routes here
}
```

### Deploying Updates
```bash
gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/signal-router
gcloud run deploy signal-router --image gcr.io/$GOOGLE_CLOUD_PROJECT/signal-router
```

## License

Part of the Strategickhaos DAO LLC infrastructure.
