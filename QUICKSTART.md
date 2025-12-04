# Quick Start Guide - Queen.js Signal Ingestion

This guide will get you from zero to a running signal ingestion system in under 10 minutes.

## Prerequisites

- GKE cluster with 4+ nodes running
- `kubectl` configured to access your cluster
- Docker installed locally
- Access to configure DNS for `strategickhaos.ai`
- GCP Project ID

## Step-by-Step Deployment

### 1. Clone and Test Locally (Optional but Recommended)

```bash
# Install dependencies
npm install

# Run tests
npm test

# Start locally to verify
npm start

# In another terminal, test it
curl http://localhost:3000/health
curl -X POST http://localhost:3000/signals/academic \
  -H "Content-Type: application/json" \
  -d '{"subject": "Test Signal", "content": "Hello!"}'
```

### 2. Deploy to GKE

```bash
# Deploy everything to your GKE cluster
./scripts/deploy.sh YOUR_GCP_PROJECT_ID

# This will:
# - Build Docker image
# - Push to Google Container Registry
# - Deploy to Kubernetes
# - Set up service and ingress
```

### 3. Get the Ingress IP

```bash
# Run the helper script
./scripts/get-ingress-ip.sh

# Or manually:
kubectl get ingress queen-signal-ingestion

# Wait until you see an IP address in the ADDRESS column
# This can take 2-5 minutes
```

### 4. Configure DNS

Using the IP from step 3:

1. Log into your DNS provider for `strategickhaos.ai`
2. Create an A record:
   - **Name**: `queen`
   - **Type**: `A`
   - **Value**: `[IP from step 3]`
   - **TTL**: `300`

### 5. Wait for DNS Propagation

```bash
# Check DNS (may take 5-60 minutes)
nslookup queen.strategickhaos.ai

# or
dig queen.strategickhaos.ai
```

### 6. Test the Endpoint

Once DNS resolves:

```bash
# Test health endpoint
curl https://queen.strategickhaos.ai/health

# Test signal ingestion
curl -X POST https://queen.strategickhaos.ai/signals/academic \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Research Paper - Urgent",
    "from": "researcher@example.com",
    "content": "Important findings..."
  }'
```

### 7. Configure Zapier

In your Zapier workflow:

1. Add a **Webhooks by Zapier** action
2. Choose **POST**
3. Set URL: `https://queen.strategickhaos.ai/signals/academic`
4. Set **Payload Type**: JSON
5. Map your Gmail fields:
   ```json
   {
     "subject": "{{gmail_subject}}",
     "from": "{{gmail_from}}",
     "to": "{{gmail_to}}",
     "content": "{{gmail_body_plain}}",
     "timestamp": "{{gmail_received_time}}"
   }
   ```
6. Test the Zap

### 8. Verify Everything is Working

```bash
# Check pod status
kubectl get pods -l app=queen

# Should show 3 pods running

# View logs
kubectl logs -f deployment/queen-signal-ingestion

# Send a test email and watch the logs
# You should see the signal being received and processed
```

## Troubleshooting

### Pods not starting
```bash
kubectl describe pod -l app=queen
kubectl logs <pod-name>
```

### DNS not resolving
- Wait longer (can take up to 48 hours, usually 5-30 minutes)
- Verify A record is correct
- Try `dig queen.strategickhaos.ai @8.8.8.8`

### 502/503 errors
```bash
# Check pod health
kubectl get pods -l app=queen

# Check service
kubectl get svc queen-signal-ingestion

# Check ingress
kubectl describe ingress queen-signal-ingestion
```

### Ingress not getting IP
```bash
# Check ingress controller
kubectl get pods -n kube-system

# Check GKE ingress status
kubectl describe ingress queen-signal-ingestion
```

## Next Steps

Once everything is working:

1. **Enable Rate Limiting** - See DEPLOYMENT.md for options
2. **Set up GPG Verification** - See DEPLOYMENT.md security section
3. **Configure Monitoring** - Set up logging and metrics
4. **Review Security** - Read SECURITY.md

## Getting Help

- **Deployment Issues**: See DEPLOYMENT.md
- **Architecture Questions**: See ARCHITECTURE.md
- **Security Concerns**: See SECURITY.md
- **Code Issues**: Check tests with `npm test`

## Summary

You now have:
- ✅ Queen.js running on GKE with 3 replicas
- ✅ Accessible at `https://queen.strategickhaos.ai`
- ✅ Ready to receive signals from Zapier
- ✅ Signals classified and routed automatically
- ✅ Production-ready infrastructure

**The signal ingestion loop is complete!**

```
Gmail → Zapier → queen.strategickhaos.ai → GKE → Queen.js → Classification → Dispatch
```
