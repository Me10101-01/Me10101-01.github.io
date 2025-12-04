# MCP Extensions Framework

## Overview

The MCP Extensions Framework provides a modular, extensible architecture for processing and coordinating intelligence signals across the Strategickhaos ecosystem.

## Architecture

```
mcp-extensions/
├── refinery/       # CLI for deploying and managing extensions
├── queen/          # Queen integration and signal routing
├── academic/       # SNHU email processing and academic intelligence
├── treasury/       # Financial signal processing and management
└── sovereign/      # Empire-wide orchestration and governance
```

## Components

### Refinery
**Purpose**: Deployment and lifecycle management for all MCP extensions

**Key Features**:
- Extension deployment automation
- Configuration management
- Health monitoring
- Version control

[Read More](./refinery/README.md)

### Queen
**Purpose**: Integration layer connecting MCP extensions to the Queen intelligence pipeline

**Key Features**:
- Signal routing between Queen and extensions
- GPG-based authentication
- Data transformation
- Real-time communication

[Read More](./queen/README.md)

### Academic
**Purpose**: Process academic emails from SNHU via Zapier integration

**Key Features**:
- Email filtering and classification
- AI-powered summarization (GPT-4o mini)
- Deadline and assignment tracking
- Academic intelligence extraction

[Read More](./academic/README.md)

### Treasury
**Purpose**: Financial signal processing and treasury management

**Key Features**:
- Transaction monitoring
- Budget tracking
- Revenue analytics
- Financial reporting

[Read More](./treasury/README.md)

### Sovereign
**Purpose**: Empire-wide orchestration and strategic intelligence

**Key Features**:
- Cross-extension coordination
- Strategic analytics
- Automated governance
- Master dashboard

[Read More](./sovereign/README.md)

## Getting Started

### Prerequisites
- Python 3.8+
- Flask 3.0+
- Access to Zapier (for Academic extension)
- GPG keys for authentication

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/Me10101-01/Me10101-01.github.io.git
cd Me10101-01.github.io
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

3. **Configure environment**:
```bash
export PORT=8080
export GPG_KEY_ID=AE5519579584DEF5
export GPG_SUBKEY=510AB6D40B4A24FB
```

4. **Start Queen**:
```bash
python app.py
```

### Testing Queen

**Test health endpoint**:
```bash
curl -s http://localhost:8080/health | jq '.'
```

**Test academic endpoint**:
```bash
curl -X POST http://localhost:8080/signals/academic \
  -H "Content-Type: application/json" \
  -H "X-GPG-Key-ID: AE5519579584DEF5" \
  -H "X-Source: strategickhaos-academic" \
  -H "X-Subkey: 510AB6D40B4A24FB" \
  -d '{"test": "academic signal"}' | jq '.'
```

## Codespace Deployment

When running in GitHub Codespaces, Queen is accessible via:

```
https://[CODESPACE-NAME]-8080.app.github.dev
```

For example:
```
https://congenial-space-telegram-7vw6r9vqgjgp3764-8080.app.github.dev
```

### Get Your Codespace URL

```bash
# Set your Codespace name
CODESPACE_NAME="congenial-space-telegram-7vw6r9vqgjgp3764"
QUEEN_URL="https://$CODESPACE_NAME-8080.app.github.dev"

echo "👑 QUEEN URL: $QUEEN_URL"

# Test health
curl -s "$QUEEN_URL/health" | jq '.'

# Test academic endpoint
curl -X POST "$QUEEN_URL/signals/academic" \
  -H "Content-Type: application/json" \
  -H "X-GPG-Key-ID: AE5519579584DEF5" \
  -H "X-Source: strategickhaos-academic" \
  -H "X-Subkey: 510AB6D40B4A24FB" \
  -d '{"test": "academic signal"}' | jq '.'
```

## Zapier Integration

### Academic Pipeline Configuration

1. **Trigger**: Office 365 Outlook - New Email
2. **Filter**: 7 academic conditions (see [Academic README](./academic/README.md))
3. **Action**: AI Summarization (GPT-4o mini)
4. **Webhook**: POST to Queen academic endpoint

**Webhook Configuration**:
- **URL**: `https://[CODESPACE]-8080.app.github.dev/signals/academic`
- **Method**: POST
- **Headers**:
  - `Content-Type: application/json`
  - `X-GPG-Key-ID: AE5519579584DEF5`
  - `X-Subkey: 510AB6D40B4A24FB`
  - `X-Source: strategickhaos-academic`

## Authentication

All endpoints (except `/health` and `/`) require GPG header authentication:

- **X-GPG-Key-ID**: Your GPG key ID
- **X-Subkey**: Your GPG subkey
- **X-Source**: Source identifier (e.g., `strategickhaos-academic`)

## Development

### Adding New Extensions

1. Create a new directory under `mcp-extensions/`
2. Add a README.md describing the extension
3. Implement the extension logic
4. Add endpoint to Queen if needed
5. Update this README

### Testing

Run tests for all extensions:
```bash
# Run Flask app tests
python -m pytest tests/

# Test individual endpoints
./scripts/test_endpoints.sh
```

## Production Deployment

### Environment Variables

Required:
- `PORT` - Port number (default: 8080)
- `GPG_KEY_ID` - GPG key ID for authentication
- `GPG_SUBKEY` - GPG subkey
- `DEBUG` - Debug mode (default: False)

Optional:
- `LOG_LEVEL` - Logging level (default: INFO)
- `MAX_CONTENT_LENGTH` - Max request size
- `RATE_LIMIT` - Rate limiting configuration

### Security Considerations

- Always use HTTPS in production
- Rotate GPG keys regularly
- Monitor authentication failures
- Implement rate limiting
- Use environment-specific configurations
- Enable audit logging

## Roadmap

### Phase 1: Foundation (Current)
- [x] Queen application with health and academic endpoints
- [x] MCP extensions directory structure
- [x] GPG header authentication
- [x] Basic documentation

### Phase 2: Academic Intelligence
- [ ] Signal storage and retrieval
- [ ] Academic deadline tracking
- [ ] Calendar integration
- [ ] Priority-based alerting
- [ ] Study schedule optimization

### Phase 3: Multi-Extension
- [ ] Treasury extension implementation
- [ ] Sovereign orchestration layer
- [ ] Cross-extension workflows
- [ ] Unified dashboard

### Phase 4: Advanced Features
- [ ] WebSocket real-time updates
- [ ] Machine learning integration
- [ ] Predictive analytics
- [ ] Self-healing automation
- [ ] Advanced governance

## Contributing

This is a private repository for Strategickhaos DAO LLC. Internal contributors should:

1. Create a feature branch
2. Implement changes with tests
3. Update documentation
4. Submit for review
5. Merge to main

## License

Proprietary - Strategickhaos DAO LLC

## Support

For issues or questions, contact the Strategickhaos development team.
