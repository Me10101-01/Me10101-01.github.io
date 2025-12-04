# Refinery - MCP Extension CLI

CLI tooling for creating, testing, and deploying MCP extensions.

## 🎯 Purpose

The Refinery provides command-line tools to:
- Create new MCP extensions
- Test extensions locally
- Deploy extensions to production
- Manage extension lifecycle

## 🚀 Installation

```bash
cd mcp-extensions/refinery
npm install
```

## 📖 Usage

### Create a New Extension

```bash
refinery create <extension-name>
```

### Test an Extension

```bash
refinery test <extension-name>
```

### Deploy an Extension

```bash
refinery deploy <extension-name>
```

## 🔧 Configuration

Create a `refinery.config.json` in your project root:

```json
{
  "organization": "Strategickhaos-Swarm-Intelligence",
  "registry": "github",
  "target": "enterprise"
}
```

## 📦 Extension Template

The Refinery generates extensions with the following structure:

```
<extension-name>/
├── package.json
├── index.js
├── README.md
└── tests/
    └── index.test.js
```

## 🧪 Testing

Extensions are tested against the MCP specification to ensure compatibility.

## 🌐 Deployment

Deployment integrates with GitHub Enterprise and the Strategickhaos-Swarm-Intelligence organization.

## 💡 Examples

See the `examples/` directory for sample extensions.
