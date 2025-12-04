#!/bin/bash
# Deploy Queen.js Signal Ingestion to GKE
# Usage: ./scripts/deploy.sh PROJECT_ID

set -e

if [ -z "$1" ]; then
  echo "Usage: ./scripts/deploy.sh PROJECT_ID"
  echo "Example: ./scripts/deploy.sh my-gcp-project"
  exit 1
fi

PROJECT_ID=$1
IMAGE_NAME="gcr.io/${PROJECT_ID}/queen-signal-ingestion:latest"

echo "========================================="
echo "Deploying Queen.js Signal Ingestion"
echo "Project: ${PROJECT_ID}"
echo "Image: ${IMAGE_NAME}"
echo "========================================="
echo ""

# Step 1: Build Docker image
echo "Step 1: Building Docker image..."
docker build -t ${IMAGE_NAME} .

# Step 2: Push to GCR
echo ""
echo "Step 2: Pushing to Google Container Registry..."
docker push ${IMAGE_NAME}

# Step 3: Create deployment manifest from template
echo ""
echo "Step 3: Creating Kubernetes manifest from template..."
cat k8s/deployment.yaml.template | sed "s|REPLACE_WITH_IMAGE_NAME|${IMAGE_NAME}|g" > /tmp/deployment.yaml

# Step 4: Apply Kubernetes manifests
echo ""
echo "Step 4: Deploying to Kubernetes..."
kubectl apply -f /tmp/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# Clean up temporary file
rm /tmp/deployment.yaml

echo ""
echo "========================================="
echo "Deployment initiated!"
echo "========================================="
echo ""
echo "To check deployment status:"
echo "  kubectl get deployments"
echo "  kubectl get pods -l app=queen"
echo ""
echo "To get ingress IP (may take a few minutes):"
echo "  kubectl get ingress queen-signal-ingestion"
echo "  # Or run: ./scripts/get-ingress-ip.sh"
echo ""
echo "To view logs:"
echo "  kubectl logs -f deployment/queen-signal-ingestion"
echo ""
