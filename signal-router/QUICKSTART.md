# 🚀 Quick Deployment Guide - Signal Routing Authority

## Prerequisites Checklist
- [ ] Google Cloud account with billing enabled
- [ ] `gcloud` CLI installed and authenticated
- [ ] Project ID identified or created

## 5-Minute Deployment

### Step 1: Authenticate with Google Cloud
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### Step 2: Enable Required APIs
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Step 3: Deploy SRA
```bash
cd signal-router
./deploy.sh YOUR_PROJECT_ID
```

### Step 4: Get Your Webhook URL
The deployment script will output your service URL. Example:
```
https://signal-router-xyz123-uc.a.run.app
```

### Step 5: Update Zapier
Configure your Zapier webhook action with:
```
https://your-signal-router-url.run.app/signals/academic
```

## Environment Configuration

### For Production Deployment
Update the environment variables in the `deploy.sh` script:

```bash
--set-env-vars="QUEEN_URL=https://your-queen-service.run.app,TREASURY_URL=https://your-treasury-service.run.app,PORT=8080"
```

Or update after deployment:
```bash
gcloud run services update signal-router \
  --set-env-vars="QUEEN_URL=https://your-queen-service.run.app" \
  --region us-central1
```

## Testing Your Deployment

### Health Check
```bash
curl https://your-signal-router-url.run.app/health
```

Expected response:
```json
{
  "status": "sovereign",
  "department": "SRA",
  "routing": "active"
}
```

### Dashboard
```bash
curl https://your-signal-router-url.run.app/
```

Expected response:
```json
{
  "department": "SIGNAL ROUTING AUTHORITY",
  "status": "OPERATIONAL",
  "version": "1.0.0",
  "routes": {...},
  "stats": {...}
}
```

### Test Academic Signal
```bash
curl -X POST https://your-signal-router-url.run.app/signals/academic \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "test@example.com",
    "subject": "Test Signal",
    "summary": "Testing the SRA deployment"
  }'
```

## Troubleshooting

### Issue: "Permission denied" errors
**Solution**: Ensure you're authenticated and have necessary permissions
```bash
gcloud auth login
gcloud auth application-default login
```

### Issue: Service not deploying
**Solution**: Check if APIs are enabled
```bash
gcloud services list --enabled
```

### Issue: Can't access service URL
**Solution**: Verify service is deployed and running
```bash
gcloud run services list
gcloud run services describe signal-router --region us-central1
```

### Issue: 502 Bad Gateway on signal routing
**Solution**: This is expected if downstream services (Queen, Treasury) aren't deployed yet. Update environment variables to point to deployed services or use httpbin.org for testing.

## Viewing Logs

```bash
# Real-time logs
gcloud run logs tail signal-router --region us-central1

# Read logs
gcloud run logs read signal-router --region us-central1 --limit 50
```

## Updating the Deployment

After making code changes:
```bash
cd signal-router
./deploy.sh YOUR_PROJECT_ID
```

The script will rebuild and redeploy automatically.

## Cost Optimization

Cloud Run charges based on:
- Requests processed
- CPU and memory usage
- Always-allocated resources

For the SRA (lightweight webhook router):
- **Expected cost**: $0-5/month for low-medium traffic
- **Free tier**: 2 million requests/month
- **Recommendation**: Use default resource allocation (256MB RAM, 1 CPU)

## Security Best Practices

1. **Add Authentication** (for production):
   ```python
   # Add to app.py before routing
   api_key = request.headers.get('X-API-Key')
   if api_key != os.environ.get('API_KEY'):
       return jsonify({"error": "Unauthorized"}), 401
   ```

2. **Enable Cloud Armor** (DDoS protection)
3. **Use Secret Manager** for sensitive credentials
4. **Monitor logs** regularly for suspicious activity

## Next Steps

1. Deploy Queen service (main orchestration service)
2. Deploy Treasury service (financial operations)
3. Configure custom domain: `signals.strategickhaos.ai`
4. Set up monitoring and alerting
5. Implement API key authentication

## Support

- GitHub Issues: [Me10101-01/Me10101-01.github.io](https://github.com/Me10101-01/Me10101-01.github.io/issues)
- Documentation: `signal-router/README.md`
- GCP Documentation: https://cloud.google.com/run/docs
