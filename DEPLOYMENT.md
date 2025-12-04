# Queen.js Signal Ingestion - Deployment Guide

This guide covers deploying the Queen.js signal ingestion service to GKE and configuring DNS.

## Architecture Overview

```
Zapier (Gmail) → DNS (queen.strategickhaos.ai) → GKE Ingress → Queen.js Service → Compute Substrate
                                                                      ↓
                                                           GPG Verification (AE5519579584DEF5)
```

## Prerequisites

1. GKE cluster running with at least 4 nodes
2. `kubectl` configured to access your cluster
3. Docker installed for building images
4. Access to configure DNS for `strategickhaos.ai` domain

## Step 1: Build and Push Docker Image

```bash
# Build the Docker image
docker build -t gcr.io/YOUR_PROJECT_ID/queen-signal-ingestion:latest .

# Authenticate to Google Container Registry
gcloud auth configure-docker

# Push the image
docker push gcr.io/YOUR_PROJECT_ID/queen-signal-ingestion:latest
```

**Note:** Replace `YOUR_PROJECT_ID` with your actual GCP project ID in both the command and `k8s/deployment.yaml`.

## Step 2: Deploy to GKE

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# Verify deployment
kubectl get deployments
kubectl get pods -l app=queen
kubectl get services
kubectl get ingress
```

## Step 3: Get the Ingress External IP

The ingress will take a few minutes to provision an external IP address:

```bash
# Watch for the ingress to get an external IP
kubectl get ingress queen-signal-ingestion -w
```

Wait until you see an IP address in the `ADDRESS` column. This is your cluster's ingress IP.

Alternative commands to find the IP:

```bash
# Check ingress details
kubectl describe ingress queen-signal-ingestion

# If using LoadBalancer service instead of Ingress
kubectl get svc -o wide
```

## Step 4: Configure DNS

Once you have the ingress external IP (e.g., `35.123.45.67`):

1. **Access your DNS provider** for the `strategickhaos.ai` domain
2. **Create an A record** with the following configuration:
   - **Name/Host:** `queen`
   - **Type:** `A`
   - **Value/Points to:** `35.123.45.67` (your ingress IP)
   - **TTL:** `300` (5 minutes) or your preferred value

3. **Verify DNS propagation:**
   ```bash
   # Check DNS resolution
   nslookup queen.strategickhaos.ai
   
   # Or use dig
   dig queen.strategickhaos.ai
   ```

## Step 5: Configure TLS/SSL (Optional but Recommended)

For production use, you should set up TLS certificates:

```bash
# Install cert-manager if not already installed
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer for Let's Encrypt
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@strategickhaos.ai
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: gce
EOF
```

The ingress configuration already includes TLS annotations, so once DNS is configured, cert-manager will automatically provision certificates.

## Step 6: Test the Webhook Endpoint

Once DNS is configured and propagated:

```bash
# Test health endpoint
curl https://queen.strategickhaos.ai/health

# Test academic signal endpoint
curl -X POST https://queen.strategickhaos.ai/signals/academic \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Research Paper - Urgent Deadline",
    "from": "researcher@university.edu",
    "content": "Important research findings..."
  }'
```

## Step 7: Configure Zapier Webhook

In your Zapier workflow:

1. Set the webhook URL to: `https://queen.strategickhaos.ai/signals/academic`
2. Set the method to: `POST`
3. Set the content type to: `application/json`
4. Map the Gmail fields to the request body

Example Zapier webhook configuration:
```json
{
  "subject": "{{gmail_subject}}",
  "from": "{{gmail_from}}",
  "to": "{{gmail_to}}",
  "content": "{{gmail_body_plain}}",
  "timestamp": "{{gmail_received_time}}"
}
```

## Monitoring and Logs

```bash
# View application logs
kubectl logs -f deployment/queen-signal-ingestion

# View logs from a specific pod
kubectl logs -f <pod-name>

# Check ingress status
kubectl describe ingress queen-signal-ingestion
```

## Troubleshooting

### DNS not resolving
- Wait for DNS propagation (can take up to 48 hours, usually much faster)
- Verify A record is correctly configured
- Use `nslookup` or `dig` to check DNS

### Ingress not getting external IP
- Check GKE cluster has ingress controller enabled
- Verify ingress manifest is correctly applied
- Check GCP quotas and permissions

### Pods not starting
- Check pod logs: `kubectl logs <pod-name>`
- Verify image is accessible: `docker pull gcr.io/PROJECT_ID/queen-signal-ingestion:latest`
- Check resource constraints

### 502/503 errors
- Verify pods are healthy: `kubectl get pods`
- Check service endpoints: `kubectl get endpoints queen-signal-ingestion`
- Review application logs for errors

## Scaling

To adjust the number of replicas:

```bash
# Scale to 5 replicas
kubectl scale deployment queen-signal-ingestion --replicas=5

# Or edit the deployment.yaml and reapply
kubectl apply -f k8s/deployment.yaml
```

## Security Considerations

1. **GPG Verification:** The current implementation has a placeholder for GPG signature verification. To enable full verification:
   - Import the trusted public key (AE5519579584DEF5) to the container
   - Update `verifySignature()` function in `src/queen.js`

2. **Network Policies:** Consider adding Kubernetes NetworkPolicies to restrict traffic

3. **Secrets Management:** Use Kubernetes Secrets or a secret manager for sensitive data

4. **Rate Limiting:** Consider adding rate limiting to prevent abuse

## Next Steps

- Implement full GPG signature verification with key AE5519579584DEF5
- Set up monitoring with Prometheus/Grafana
- Implement signal dispatching to compute substrate
- Add comprehensive logging and alerting
- Set up CI/CD pipeline for automated deployments
