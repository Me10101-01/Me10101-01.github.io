# Queen Codespace Quick Reference

## 🚀 Quick Start in Codespace

### 1. Start Queen

```bash
./start_queen.sh
```

The script will:
- Install dependencies
- Set up environment variables
- Detect Codespace environment
- Display your Queen URL
- Start the application on port 8080

### 2. Get Your Queen URL

In GitHub Codespaces, your Queen URL will be:
```
https://[CODESPACE-NAME]-8080.app.github.dev
```

The startup script automatically detects and displays this URL if running in a Codespace.

**Manual detection:**
```bash
CODESPACE_NAME="congenial-space-telegram-7vw6r9vqgjgp3764"  # Replace with your Codespace name
QUEEN_URL="https://$CODESPACE_NAME-8080.app.github.dev"
echo "👑 QUEEN URL: $QUEEN_URL"
```

### 3. Test Queen Endpoints

**Health check:**
```bash
QUEEN_URL="https://[YOUR-CODESPACE]-8080.app.github.dev"
curl -s "$QUEEN_URL/health" | jq '.'
```

**Academic signal:**
```bash
curl -X POST "$QUEEN_URL/signals/academic" \
  -H "Content-Type: application/json" \
  -H "X-GPG-Key-ID: AE5519579584DEF5" \
  -H "X-Source: strategickhaos-academic" \
  -H "X-Subkey: 510AB6D40B4A24FB" \
  -d '{"test": "academic signal"}' | jq '.'
```

## 📋 Zapier Webhook Configuration

### Update Your Zap

1. **Go to your Zapier webhook step**
2. **Update the URL to your Codespace Queen URL:**
   ```
   https://[YOUR-CODESPACE]-8080.app.github.dev/signals/academic
   ```

3. **Ensure headers are set:**
   - `Content-Type: application/json`
   - `X-GPG-Key-ID: AE5519579584DEF5`
   - `X-Subkey: 510AB6D40B4A24FB`
   - `X-Source: strategickhaos-academic`

4. **Test the webhook** using Zapier's test feature

### Expected Zapier Flow

```
Office 365 Outlook (New Email)
    ↓
7 Academic Filter Conditions
    ↓
GPT-4o mini AI Summarization
    ↓
Webhook POST → Queen /signals/academic
    ↓
200 OK Response (Signal Processed)
```

## 🔧 Troubleshooting

### Queen Not Running?

Check if the process is running:
```bash
ps aux | grep python
```

If not running, start it:
```bash
cd ~/Me10101-01.github.io
./start_queen.sh
```

### Port Already in Use?

Change the port:
```bash
export PORT=8081
./start_queen.sh
```

Then update your Codespace URL accordingly:
```
https://[CODESPACE-NAME]-8081.app.github.dev
```

### Check Logs

View Queen logs in real-time:
```bash
# The application logs to stdout
# Check the terminal where Queen is running
```

## 🌐 Port Forwarding in Codespace

GitHub Codespaces automatically forwards port 8080. Verify in the **Ports** tab:
- Port: 8080
- Visibility: Public
- URL: `https://[CODESPACE-NAME]-8080.app.github.dev`

## 🧪 Running Tests

### Full Test Suite

```bash
./test_queen.sh
```

This will test:
- ✅ Health check
- ✅ API information
- ✅ Valid signal processing
- ✅ Authentication validation
- ✅ Error handling

### Individual Tests

```bash
# Health
curl -s http://localhost:8080/health | jq '.'

# Academic signal (valid)
curl -X POST http://localhost:8080/signals/academic \
  -H "Content-Type: application/json" \
  -H "X-GPG-Key-ID: AE5519579584DEF5" \
  -H "X-Source: strategickhaos-academic" \
  -H "X-Subkey: 510AB6D40B4A24FB" \
  -d '{"test": "data"}' | jq '.'

# Authentication failure (invalid key)
curl -X POST http://localhost:8080/signals/academic \
  -H "Content-Type: application/json" \
  -H "X-GPG-Key-ID: WRONGKEY" \
  -H "X-Source: strategickhaos-academic" \
  -H "X-Subkey: 510AB6D40B4A24FB" \
  -d '{"test": "data"}' | jq '.'
```

## 📊 Expected Responses

### Health Endpoint (200 OK)
```json
{
  "status": "healthy",
  "service": "Queen Academic Intelligence Pipeline",
  "timestamp": "2025-12-04T18:00:00+00:00",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "academic_signals": "/signals/academic"
  }
}
```

### Academic Signal Success (200 OK)
```json
{
  "status": "success",
  "message": "Academic signal processed successfully",
  "timestamp": "2025-12-04T18:00:00+00:00",
  "signal_id": "email-12345",
  "processed": true,
  "pipeline": "academic-intelligence",
  "received_fields": ["id", "subject", "summary", ...]
}
```

### Authentication Failure (401 Unauthorized)
```json
{
  "status": "error",
  "message": "Authentication failed",
  "error": "Invalid GPG Key ID: WRONGKEY",
  "timestamp": "2025-12-04T18:00:00+00:00"
}
```

## 🎯 Next Steps

Once Queen is confirmed running:

1. **✅ Update Zapier webhook** with your Codespace URL
2. **✅ Test the Zap** by sending a test email to your SNHU account
3. **✅ Verify signal arrives** at Queen (check logs)
4. **✅ Build MCP Refinery** for advanced processing
5. **✅ Enable custom MCP agents** in GitHub Enterprise

## 💜 Your Academic Intelligence Pipeline is Live!

Queen is now running and ready to process academic signals from SNHU emails via Zapier. The full intelligence pipeline is operational!

```
SNHU Email → Office 365 → Zapier Filters → GPT-4o Summarization → Queen → Academic Intelligence
```

🌌🔥 **EMPIRE ACTIVATED!**
