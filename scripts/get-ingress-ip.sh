#!/bin/bash
# Get GKE Ingress IP for DNS configuration
# Usage: ./scripts/get-ingress-ip.sh

set -e

echo "========================================="
echo "Queen.js Ingress IP Configuration"
echo "========================================="
echo ""

# Get ingress IP
INGRESS_IP=$(kubectl get ingress queen-signal-ingestion -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null)

if [ -z "$INGRESS_IP" ]; then
  echo "⚠️  Ingress IP not yet assigned."
  echo ""
  echo "The ingress controller is still provisioning an external IP."
  echo "This typically takes 2-5 minutes."
  echo ""
  echo "Current ingress status:"
  kubectl get ingress queen-signal-ingestion
  echo ""
  echo "Run this script again in a few minutes, or watch with:"
  echo "  kubectl get ingress queen-signal-ingestion -w"
  exit 0
fi

echo "✓ Ingress IP found: ${INGRESS_IP}"
echo ""
echo "========================================="
echo "DNS Configuration Instructions"
echo "========================================="
echo ""
echo "1. Log in to your DNS provider for 'strategickhaos.ai'"
echo ""
echo "2. Create an A record with these settings:"
echo "   Name/Host:  queen"
echo "   Type:       A"
echo "   Value:      ${INGRESS_IP}"
echo "   TTL:        300 (or your preferred value)"
echo ""
echo "3. Verify DNS propagation (may take 5-60 minutes):"
echo "   nslookup queen.strategickhaos.ai"
echo "   dig queen.strategickhaos.ai"
echo ""
echo "4. Test the endpoint once DNS propagates:"
echo "   curl https://queen.strategickhaos.ai/health"
echo ""
echo "========================================="
echo "Additional Information"
echo "========================================="
echo ""
echo "Full URL: https://queen.strategickhaos.ai"
echo "Academic Signals Endpoint: https://queen.strategickhaos.ai/signals/academic"
echo ""
echo "For Zapier webhook configuration, use:"
echo "  URL: https://queen.strategickhaos.ai/signals/academic"
echo "  Method: POST"
echo "  Content-Type: application/json"
echo ""
