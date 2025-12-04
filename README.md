# Queen.js Signal Ingestion System

Signal ingestion and orchestration service for Strategickhaos DAO LLC.

## Overview

This system provides a webhook endpoint for receiving signals from external sources (e.g., Zapier, Gmail) and routing them through a verification and classification pipeline to appropriate compute substrates.

### Architecture

```
┌─────────────┐
│   Zapier    │  Gmail → Webhook
│  (Gmail)    │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────┐
│  DNS: queen.strategickhaos.ai       │
└──────┬──────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────┐
│    GKE Ingress (TLS Termination)    │
└──────┬──────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────┐
│   Queen.js Service (3 replicas)     │
│   - Signal Reception                │
│   - GPG Verification (AE5519579584DEF5) │
│   - Classification                  │
│   - Routing/Dispatch                │
└──────┬──────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────┐
│   Compute Substrate (GKE, 4 nodes)  │
└─────────────────────────────────────┘
```

## Components

### Signal Ingestion Layer
- **Endpoint:** `POST /signals/academic`
- **Purpose:** Receive signals from Zapier forwarding Gmail messages
- **Features:** 
  - Webhook endpoint receiving JSON payloads
  - Configurable for multiple signal categories

### Verification Layer
- **GPG Key ID:** `AE5519579584DEF5`
- **Purpose:** Validate authenticity of incoming signals
- **Implementation:** OpenPGP-based signature verification

### Orchestration Layer (Queen.js)
- **Technology:** Node.js with Express
- **Purpose:** Route signals to appropriate handlers
- **Features:**
  - Signal classification based on content
  - Priority determination
  - Handler dispatch logic

### Compute Substrate
- **Platform:** Google Kubernetes Engine (GKE)
- **Configuration:** 4 nodes, scalable deployment
- **Purpose:** Distributed workload processing

## Quick Start

### Prerequisites
- Node.js 18+ 
- Docker
- kubectl configured for GKE
- Access to `strategickhaos.ai` DNS configuration

### Local Development

```bash
# Install dependencies
npm install

# Run locally
npm start

# Run in development mode with auto-reload
npm run dev

# Test the endpoint
curl -X POST http://localhost:3000/signals/academic \
  -H "Content-Type: application/json" \
  -d '{"subject": "Test Signal", "content": "Test content"}'
```

### Production Deployment

**See [QUICKSTART.md](./QUICKSTART.md) for step-by-step deployment instructions.**

**Quick deployment:**

```bash
# 1. Deploy to GKE
./scripts/deploy.sh YOUR_PROJECT_ID

# 2. Get ingress IP and configure DNS
./scripts/get-ingress-ip.sh

# 3. Point queen.strategickhaos.ai to the ingress IP

# 4. Test
curl https://queen.strategickhaos.ai/health
```

## Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in under 10 minutes
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design
- **[SECURITY.md](./SECURITY.md)** - Security assessment and hardening guide

## API Endpoints

### Health Check
```
GET /health
```
Returns service health status.

### Academic Signals
```
POST /signals/academic
Content-Type: application/json

{
  "subject": "Email subject",
  "from": "sender@example.com",
  "content": "Email body content",
  "signature": "GPG signature (optional)",
  "signedContent": "Signed content (optional)"
}
```

### Generic Signals
```
POST /signals/:category
```
Accepts signals for any category (e.g., `/signals/research`, `/signals/admin`).

## Configuration

### Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

### Kubernetes Configuration

See files in `k8s/` directory:
- `deployment.yaml` - Pod deployment (3 replicas)
- `service.yaml` - Internal service routing
- `ingress.yaml` - External access configuration

## DNS Configuration

The system requires DNS configuration to resolve `queen.strategickhaos.ai` to the GKE ingress IP.

**Steps:**
1. Deploy the ingress: `kubectl apply -f k8s/ingress.yaml`
2. Get the external IP: `kubectl get ingress queen-signal-ingestion`
3. Create DNS A record: `queen.strategickhaos.ai` → `<INGRESS_IP>`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Security

### GPG Signature Verification
- Trusted Key ID: `AE5519579584DEF5`
- Verifies authenticity of incoming signals
- Rejects signals with invalid signatures

### TLS/HTTPS
- Automated certificate management via cert-manager
- Let's Encrypt integration for free SSL certificates
- Ingress handles TLS termination

### Network Security
- Internal service communication via ClusterIP
- External access only through ingress
- Ready for NetworkPolicy implementation

## Signal Classification

The system automatically classifies signals based on content:

- **Priority Levels:** `high`, `normal`
- **Types:** `academic-research`, `unknown`
- **Tags:** `research`, `deadline`, etc.

Classification determines routing to appropriate handlers.

## Monitoring

```bash
# View application logs
kubectl logs -f deployment/queen-signal-ingestion

# Check pod health
kubectl get pods -l app=queen

# Monitor ingress
kubectl describe ingress queen-signal-ingestion
```

## Development

### Project Structure
```
.
├── src/
│   └── queen.js          # Main application logic
├── k8s/
│   ├── deployment.yaml   # Kubernetes deployment
│   ├── service.yaml      # Kubernetes service
│   └── ingress.yaml      # Ingress configuration
├── Dockerfile            # Container image definition
├── package.json          # Node.js dependencies
├── DEPLOYMENT.md         # Deployment guide
└── README.md            # This file
```

### Testing

Create test signals:
```bash
# Test with curl
curl -X POST http://localhost:3000/signals/academic \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Research Paper - Urgent Deadline",
    "from": "researcher@university.edu",
    "content": "Important research findings..."
  }'
```

## Zapier Integration

Configure Zapier webhook action:
- **URL:** `https://queen.strategickhaos.ai/signals/academic`
- **Method:** POST
- **Content Type:** application/json
- **Body:** Map Gmail fields to JSON payload

Example payload mapping:
```json
{
  "subject": "{{gmail_subject}}",
  "from": "{{gmail_from}}",
  "to": "{{gmail_to}}",
  "content": "{{gmail_body_plain}}",
  "timestamp": "{{gmail_received_time}}"
}
```

## Roadmap

- [x] Basic signal ingestion endpoint
- [x] GPG verification framework
- [x] Signal classification logic
- [x] Kubernetes deployment manifests
- [x] DNS configuration documentation
- [ ] Full GPG signature implementation
- [ ] Compute substrate integration
- [ ] Monitoring and alerting setup
- [ ] CI/CD pipeline
- [ ] Comprehensive test suite

## License

MIT - See LICENSE file

## Support

For issues or questions, please open a GitHub issue in this repository.
