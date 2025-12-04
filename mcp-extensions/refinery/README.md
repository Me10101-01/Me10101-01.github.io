# MCP Extensions - Refinery

## Overview

The Refinery is a CLI tool for deploying and managing MCP (Model Context Protocol) extensions for the Strategickhaos ecosystem.

## Purpose

The Refinery serves as the deployment and orchestration layer for all MCP extensions, providing:

- **Deployment automation** - Deploy extensions to various environments
- **Configuration management** - Manage extension settings and credentials
- **Health monitoring** - Monitor extension status and performance
- **Extension lifecycle** - Start, stop, restart, and update extensions

## Structure

```
refinery/
├── cli.py              # Main CLI entry point
├── deploy.py           # Deployment logic
├── config.py           # Configuration management
└── README.md           # This file
```

## Future Capabilities

- Deploy extensions to Codespaces, cloud platforms, or local environments
- Manage environment variables and secrets
- Monitor extension health and logs
- Coordinate multi-extension workflows
- Version control and rollback support

## Usage (Planned)

```bash
# Deploy an extension
python refinery/cli.py deploy academic --env codespace

# Check extension status
python refinery/cli.py status academic

# View logs
python refinery/cli.py logs academic --tail 100

# Stop an extension
python refinery/cli.py stop academic
```

## Integration

The Refinery integrates with:
- **Queen** - Core intelligence pipeline
- **Academic** - SNHU email processing
- **Treasury** - Financial signal processing
- **Sovereign** - Empire-wide orchestration
