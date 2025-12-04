# Queen.js Signal Ingestion - System Architecture

## Overview

This document provides a detailed view of the Queen.js signal ingestion system architecture.

## Architecture Layers

### 1. Signal Ingestion Layer

**Purpose:** Receive external signals via webhooks

**Components:**
- Zapier Integration (Email → Webhook transformation)
- Ingress Controller (External entry point)
- TLS Termination (Let's Encrypt certificates)

**Data Flow:**
```
Gmail → Zapier Trigger → Zapier Webhook Action → queen.strategickhaos.ai/signals/academic
```

### 2. Verification Layer

**Purpose:** Validate signal authenticity

**Components:**
- GPG Signature Verification
  - Trusted Key ID: `AE5519579584DEF5`
  - OpenPGP implementation
- Input Validation
- Request Authentication

**Process:**
1. Extract signature and signed content from request
2. Verify signature against trusted public key
3. Reject if signature invalid
4. Continue processing if valid or no signature provided

### 3. Orchestration Layer (Queen.js)

**Purpose:** Route signals to appropriate handlers

**Components:**
- Express.js HTTP Server
- Classification Engine
- Routing Logic
- Dispatch Mechanism

**Classification Rules:**
- **Priority Detection:**
  - "urgent" or "critical" in subject → High Priority
  - Default → Normal Priority

- **Type Detection:**
  - "research" or "paper" in subject → academic-research
  - Default → unknown

- **Tag Extraction:**
  - "deadline" or "due" → deadline tag
  - "research" → research tag

**Routing Rules:**
- High Priority → priority-queue handler
- academic-research type → research-processor handler
- Default → default-processor handler

### 4. Compute Substrate

**Purpose:** Execute workloads based on signal type

**Infrastructure:**
- Google Kubernetes Engine (GKE)
- 4 compute nodes
- Horizontal Pod Autoscaling enabled
- 3 replicas of Queen.js for high availability

## Network Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Internet                                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTPS (port 443)
                         │
          ┌──────────────▼───────────────┐
          │  DNS: queen.strategickhaos.ai │
          │  A Record → Ingress IP        │
          └──────────────┬───────────────┘
                         │
                         │
          ┌──────────────▼───────────────────────────────┐
          │   GKE Ingress Controller                     │
          │   - TLS Termination (cert-manager)           │
          │   - Load Balancing                           │
          │   - Routing                                  │
          └──────────────┬───────────────────────────────┘
                         │
                         │ HTTP (port 80)
                         │
          ┌──────────────▼───────────────────────────────┐
          │   Service: queen-signal-ingestion            │
          │   Type: ClusterIP                            │
          │   Port: 80 → 3000                            │
          └──────────────┬───────────────────────────────┘
                         │
          ┌──────────────┴────────────────┬──────────────┐
          │                               │              │
┌─────────▼──────────┐  ┌────────────────▼──┐  ┌───────▼─────────┐
│  Pod 1             │  │  Pod 2             │  │  Pod 3          │
│  queen-signal-     │  │  queen-signal-     │  │  queen-signal-  │
│  ingestion         │  │  ingestion         │  │  ingestion      │
│  Container         │  │  Container         │  │  Container      │
│  Port: 3000        │  │  Port: 3000        │  │  Port: 3000     │
└────────────────────┘  └────────────────────┘  └─────────────────┘
```

## Security Architecture

### Network Security
- All external traffic via HTTPS (TLS 1.2+)
- Internal cluster communication via ClusterIP (not exposed)
- NetworkPolicies can be added for additional isolation

### Application Security
- GPG signature verification for trusted signals
- Input validation on all endpoints
- No credentials stored in container images
- Environment variables for configuration

### Infrastructure Security
- GKE cluster with node auto-upgrade enabled
- Container images scanned for vulnerabilities
- Kubernetes RBAC for access control
- Secrets managed via Kubernetes Secrets

## Deployment Architecture

### Container
```
Docker Image: gcr.io/PROJECT_ID/queen-signal-ingestion:latest
Base: node:18-alpine
Size: ~180MB
Health Check: GET /health every 30s
```

### Kubernetes Resources

**Deployment:**
- Replicas: 3
- Update Strategy: RollingUpdate
- Resource Limits:
  - Memory: 256Mi limit, 128Mi request
  - CPU: 500m limit, 100m request

**Service:**
- Type: ClusterIP
- Port: 80 → 3000
- Selector: app=queen, component=signal-ingestion

**Ingress:**
- Host: queen.strategickhaos.ai
- TLS: Enabled with cert-manager
- Backend: queen-signal-ingestion:80

## Data Flow Diagrams

### Successful Signal Processing

```
┌─────────┐
│  Email  │
│ Arrives │
└────┬────┘
     │
     ▼
┌─────────────┐
│   Zapier    │
│  Captures   │
└────┬────────┘
     │
     │ POST /signals/academic
     ▼
┌──────────────┐
│   Ingress    │
│   Routing    │
└────┬─────────┘
     │
     ▼
┌──────────────────┐      ┌─────────────────┐
│  Queen.js Pod    │──────┤  Verify GPG     │
│  Receives        │      │  Signature      │
└────┬─────────────┘      └─────────────────┘
     │                              │
     │                              ▼
     │                        [Valid/None]
     ▼
┌──────────────────┐
│   Classify       │
│   Signal         │
└────┬─────────────┘
     │
     │ {priority, type, tags}
     ▼
┌──────────────────┐
│   Determine      │
│   Handler        │
└────┬─────────────┘
     │
     │ handler name
     ▼
┌──────────────────┐
│   Dispatch to    │
│   Compute        │
│   Substrate      │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│   Return 200 OK  │
│   with result    │
└──────────────────┘
```

### Invalid Signature

```
┌─────────┐
│ Request │
│  with   │
│Invalid  │
│  GPG    │
└────┬────┘
     │
     ▼
┌──────────────────┐      ┌─────────────────┐
│  Queen.js Pod    │──────┤  Verify GPG     │
│  Receives        │      │  Signature      │
└──────────────────┘      └─────┬───────────┘
                                 │
                                 ▼
                            [Invalid]
                                 │
                                 ▼
                          ┌──────────────┐
                          │ Return 401   │
                          │ Unauthorized │
                          └──────────────┘
```

## Monitoring & Observability

### Health Checks
- Endpoint: `GET /health`
- Kubernetes Liveness Probe: every 30s
- Kubernetes Readiness Probe: every 10s

### Logging
- All requests logged with timestamp
- Signal classification logged
- Dispatch results logged
- stderr/stdout captured by Kubernetes

### Metrics (Future)
- Request count by endpoint
- Signal classification distribution
- Processing time percentiles
- Error rates

## Scalability

### Horizontal Scaling
- Current: 3 replicas
- Can scale to 10+ replicas
- Stateless design enables easy scaling

### Vertical Scaling
- Current: 128Mi-256Mi memory per pod
- Can increase for higher throughput

### Performance
- Expected throughput: 100+ requests/second per pod
- Response time: <100ms average
- Concurrent connections: 1000+ per pod

## Disaster Recovery

### High Availability
- 3 replicas across availability zones
- Automatic pod restart on failure
- Rolling updates with zero downtime

### Backup Strategy
- Infrastructure as Code (all manifests in Git)
- Container images versioned and stored in GCR
- Configuration in Git repository

### Recovery Procedures
1. Pod failure: Kubernetes auto-restarts
2. Node failure: Pods rescheduled automatically
3. Total cluster failure: Redeploy from manifests
4. Data loss: Signals are ephemeral, re-sent by source

## Future Enhancements

1. **Message Queue Integration**
   - Add Redis/RabbitMQ for async processing
   - Persistent signal storage

2. **Full GPG Implementation**
   - Load public keys from keyserver
   - Implement full signature verification

3. **Metrics & Monitoring**
   - Prometheus integration
   - Grafana dashboards
   - Alert rules

4. **Enhanced Routing**
   - Machine learning-based classification
   - Dynamic handler assignment
   - Priority queuing system

5. **API Gateway**
   - Rate limiting
   - Authentication/Authorization
   - API versioning
