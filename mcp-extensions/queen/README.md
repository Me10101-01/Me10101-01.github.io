# Queen - API Integration

Queen API integration module for managing the sovereign AI infrastructure.

## 🎯 Purpose

The Queen module provides:
- Integration with Queen API (Port 8080)
- Health check endpoints
- API communication and monitoring
- Status tracking and reporting

## 🌐 Codespace Setup

The Queen API runs on port 8080 in GitHub Codespaces:

```
Forwarded URL: https://congenial-space-telegram-7vw6r9vqgjgp3764-8080.app.github.dev
```

## ✅ Health Check

Test the Queen API health:

```bash
curl https://congenial-space-telegram-7vw6r9vqgjgp3764-8080.app.github.dev/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-04T19:02:58.066Z",
  "version": "1.0.0"
}
```

## 🔌 API Endpoints

### GET /health
Returns the health status of the Queen API.

### GET /status
Returns detailed status information.

### POST /command
Execute commands through the Queen API.

## 🔧 Configuration

Set the Queen API URL in your environment:

```bash
export QUEEN_API_URL="https://congenial-space-telegram-7vw6r9vqgjgp3764-8080.app.github.dev"
```

## 📦 Installation

```bash
cd mcp-extensions/queen
npm install
```

## 📖 Usage

```javascript
const Queen = require('./queen');

const queen = new Queen({
  apiUrl: process.env.QUEEN_API_URL
});

// Check health
await queen.health();

// Get status
await queen.status();

// Send command
await queen.command({ action: 'status' });
```

## 🚨 Troubleshooting

### Port Not Forwarded

If the Queen API is not accessible:
1. Open GitHub Codespace
2. Click on "PORTS" tab (bottom panel)
3. Verify port 8080 is forwarded
4. Copy the forwarded URL

### Connection Timeout

Ensure your Codespace is running and the Queen service is active.

## 🔐 Security

- API requires authentication tokens
- All requests use HTTPS
- Rate limiting enabled

## 💜 Queen is Running! 👑

Status: ✅ ACTIVE on port 8080
