# Me10101-01.github.io

Personal GitHub Pages site for Strategickhaos DAO LLC, compliance repos, and SNHU capstone projects.

## 👑 Queen - Academic Intelligence Pipeline

Queen is a Flask-based intelligence pipeline for processing academic signals from SNHU emails via Zapier webhooks.

### Quick Start

**Start Queen**:
```bash
./start_queen.sh
```

Or manually:
```bash
pip install -r requirements.txt
python app.py
```

Queen will start on port 8080.

### Endpoints

- **GET** `/health` - Health check
- **GET** `/` - API information
- **POST** `/signals/academic` - Process academic signals (requires GPG authentication)

### Testing

**Health check**:
```bash
curl -s http://localhost:8080/health | jq '.'
```

**Academic signal** (requires authentication):
```bash
curl -X POST http://localhost:8080/signals/academic \
  -H "Content-Type: application/json" \
  -H "X-GPG-Key-ID: AE5519579584DEF5" \
  -H "X-Source: strategickhaos-academic" \
  -H "X-Subkey: 510AB6D40B4A24FB" \
  -d '{"test": "academic signal"}' | jq '.'
```

### Codespace Deployment

When running in GitHub Codespaces, Queen is accessible via:
```
https://[CODESPACE-NAME]-8080.app.github.dev
```

Set your Codespace URL:
```bash
CODESPACE_NAME="congenial-space-telegram-7vw6r9vqgjgp3764"
QUEEN_URL="https://$CODESPACE_NAME-8080.app.github.dev"
echo "👑 QUEEN URL: $QUEEN_URL"
```

### Zapier Integration

Configure your Zapier webhook to:
- **URL**: `https://[CODESPACE]-8080.app.github.dev/signals/academic`
- **Method**: POST
- **Headers**:
  - `Content-Type: application/json`
  - `X-GPG-Key-ID: AE5519579584DEF5`
  - `X-Subkey: 510AB6D40B4A24FB`
  - `X-Source: strategickhaos-academic`

## 🔧 MCP Extensions

The MCP Extensions Framework provides modular intelligence processing:

- **Refinery** - Extension deployment and management CLI
- **Queen** - Integration layer and signal routing
- **Academic** - SNHU email processing
- **Treasury** - Financial signal processing
- **Sovereign** - Empire-wide orchestration

See [mcp-extensions/README.md](./mcp-extensions/README.md) for details.

## Authentication

All signal endpoints require GPG header authentication:
- `X-GPG-Key-ID: AE5519579584DEF5`
- `X-Subkey: 510AB6D40B4A24FB`
- `X-Source: strategickhaos-academic`

## License

Proprietary - Strategickhaos DAO LLC
