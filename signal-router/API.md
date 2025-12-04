# Signal Routing Authority - API Reference

## Base URL
```
https://YOUR-SERVICE-URL
```

Replace `YOUR-SERVICE-URL` with your actual Cloud Run service URL.

---

## Endpoints

### 1. Health Check
**Endpoint:** `GET /health`

**Description:** Check service health status

**Response:**
```json
{
  "status": "healthy",
  "service": "Signal Routing Authority",
  "version": "1.0.0"
}
```

**Example:**
```bash
curl https://YOUR-SERVICE-URL/health
```

---

### 2. Service Information
**Endpoint:** `GET /`

**Description:** Get service information and available endpoints

**Response:**
```json
{
  "service": "Signal Routing Authority",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "routing_table": "/routing-table",
    "signals": {
      "academic": "/signals/academic",
      "github": "/signals/github",
      "financial": "/signals/financial"
    }
  }
}
```

**Example:**
```bash
curl https://YOUR-SERVICE-URL/
```

---

### 3. Route Academic Signal
**Endpoint:** `POST /signals/academic`

**Description:** Route academic intelligence signals

**Request Body (JSON):**
```json
{
  "event": "string",
  "data": "any"
}
```

**Response:**
```json
{
  "status": "routed",
  "signal_type": "academic",
  "route_name": "Academic Intelligence",
  "destinations": ["academic-processor"],
  "priority": "high",
  "received_data": { ... }
}
```

**Example:**
```bash
curl -X POST https://YOUR-SERVICE-URL/signals/academic \
  -H "Content-Type: application/json" \
  -d '{
    "event": "course_completed",
    "student_id": "12345",
    "course": "CS101"
  }'
```

---

### 4. Route GitHub Signal
**Endpoint:** `POST /signals/github`

**Description:** Route GitHub event signals

**Request Body (JSON):**
```json
{
  "event": "string",
  "repository": "string",
  "action": "string"
}
```

**Response:**
```json
{
  "status": "routed",
  "signal_type": "github",
  "route_name": "GitHub Events",
  "destinations": ["code-analyzer", "deployment-tracker"],
  "priority": "medium",
  "received_data": { ... }
}
```

**Example:**
```bash
curl -X POST https://YOUR-SERVICE-URL/signals/github \
  -H "Content-Type: application/json" \
  -d '{
    "event": "push",
    "repository": "my-repo",
    "branch": "main"
  }'
```

---

### 5. Route Financial Signal
**Endpoint:** `POST /signals/financial`

**Description:** Route financial data signals

**Request Body (JSON):**
```json
{
  "event": "string",
  "amount": "number",
  "type": "string"
}
```

**Response:**
```json
{
  "status": "routed",
  "signal_type": "financial",
  "route_name": "Financial Signals",
  "destinations": ["financial-processor"],
  "priority": "critical",
  "received_data": { ... }
}
```

**Example:**
```bash
curl -X POST https://YOUR-SERVICE-URL/signals/financial \
  -H "Content-Type: application/json" \
  -d '{
    "event": "transaction",
    "amount": 150.00,
    "type": "payment"
  }'
```

---

### 6. Get Routing Table
**Endpoint:** `GET /routing-table`

**Description:** View current routing configuration

**Response:**
```json
{
  "routing_table": {
    "academic": {
      "name": "Academic Intelligence",
      "destinations": ["academic-processor"],
      "priority": "high"
    },
    "github": {
      "name": "GitHub Events",
      "destinations": ["code-analyzer", "deployment-tracker"],
      "priority": "medium"
    },
    "financial": {
      "name": "Financial Signals",
      "destinations": ["financial-processor"],
      "priority": "critical"
    }
  },
  "total_routes": 3
}
```

**Example:**
```bash
curl https://YOUR-SERVICE-URL/routing-table
```

---

## Error Responses

### Unknown Signal Type
**Status Code:** `404 Not Found`

**Response:**
```json
{
  "error": "Unknown signal type",
  "signal_type": "invalid_type",
  "available_types": ["academic", "github", "financial"]
}
```

---

## Request Formats

The signal endpoints accept both:
- **JSON data:** `Content-Type: application/json`
- **Form data:** `Content-Type: application/x-www-form-urlencoded`

### JSON Example:
```bash
curl -X POST https://YOUR-SERVICE-URL/signals/academic \
  -H "Content-Type: application/json" \
  -d '{"event": "test"}'
```

### Form Example:
```bash
curl -X POST https://YOUR-SERVICE-URL/signals/academic \
  -d "event=test&source=zapier"
```

---

## HTTP Status Codes

- `200 OK` - Request successful
- `404 Not Found` - Unknown signal type
- `405 Method Not Allowed` - Wrong HTTP method
- `500 Internal Server Error` - Server error

---

## Rate Limits

Currently no rate limits are enforced. For production use, consider implementing rate limiting.

---

## Integration Examples

### Zapier Webhook
1. In Zapier, add a "Webhooks by Zapier" action
2. Choose "POST"
3. URL: `https://YOUR-SERVICE-URL/signals/academic`
4. Data: Map your Zap fields to JSON

### GitHub Webhook
1. Go to Repository Settings → Webhooks
2. Payload URL: `https://YOUR-SERVICE-URL/signals/github`
3. Content type: `application/json`
4. Select events to trigger

### Custom Application
```python
import requests

response = requests.post(
    'https://YOUR-SERVICE-URL/signals/financial',
    json={
        'event': 'transaction',
        'amount': 100.00
    }
)
print(response.json())
```

---

## Testing

### Quick Health Check
```bash
curl https://YOUR-SERVICE-URL/health
```

### Test All Endpoints
```bash
# Health
curl https://YOUR-SERVICE-URL/health

# Info
curl https://YOUR-SERVICE-URL/

# Academic
curl -X POST https://YOUR-SERVICE-URL/signals/academic \
  -H "Content-Type: application/json" \
  -d '{"event": "test"}'

# GitHub
curl -X POST https://YOUR-SERVICE-URL/signals/github \
  -H "Content-Type: application/json" \
  -d '{"event": "push"}'

# Financial
curl -X POST https://YOUR-SERVICE-URL/signals/financial \
  -H "Content-Type: application/json" \
  -d '{"event": "transaction", "amount": 100}'

# Routing Table
curl https://YOUR-SERVICE-URL/routing-table
```

---

**Version:** 1.0.0  
**Last Updated:** December 2024
