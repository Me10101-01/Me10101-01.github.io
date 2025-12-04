# MCP Extensions - Queen Integration

## Overview

Queen integration layer for the MCP extension framework. This module provides the glue between Queen's intelligence pipeline and the MCP ecosystem.

## Purpose

- **API Integration** - Connect MCP extensions to Queen endpoints
- **Signal Routing** - Route signals between Queen and extensions
- **Authentication** - Manage GPG-based authentication
- **Data Transformation** - Transform data between MCP and Queen formats

## Structure

```
queen/
├── integration.py      # Main integration module
├── router.py           # Signal routing logic
├── auth.py             # Authentication helpers
└── README.md           # This file
```

## Features

- Bidirectional signal flow between Queen and MCP extensions
- GPG header validation and management
- WebSocket support for real-time updates (future)
- Batch processing capabilities

## Configuration

Environment variables:
- `QUEEN_URL` - Queen application URL
- `GPG_KEY_ID` - GPG key ID for authentication
- `GPG_SUBKEY` - GPG subkey for signing
- `SOURCE_ID` - Source identifier

## Integration Points

- `/signals/academic` - Academic intelligence endpoint
- `/signals/treasury` - Financial intelligence endpoint
- `/signals/sovereign` - Empire-wide signals
