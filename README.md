# Me10101-01.github.io

Personal GitHub Pages site for Strategickhaos DAO LLC, compliance repos, and SNHU capstone projects.

## 🏛️ Signal Routing Authority (SRA)

The **Signal Routing Authority** is the permanent webhook infrastructure department for the Strategickhaos DAO ecosystem.

### Features
- **Permanent Endpoints**: Stable webhook URLs for external integrations (Zapier, GitHub, etc.)
- **Signal Routing**: Intelligent routing of signals to appropriate backend services
- **Multi-Signal Support**: Academic, GitHub, Financial, and Discord signal types
- **Cloud Native**: Deployed on Google Cloud Run for scalability and reliability

### Quick Start

Navigate to the [`signal-router/`](./signal-router/) directory for:
- Deployment instructions
- API documentation
- Configuration details

### Deployment

```bash
cd signal-router
./deploy.sh YOUR_PROJECT_ID
```

See [`signal-router/README.md`](./signal-router/README.md) for detailed deployment and usage instructions.

### Integration Points

- **Zapier Academic Pipeline**: `https://signals.strategickhaos.ai/academic`
- **GitHub Webhooks**: `https://signals.strategickhaos.ai/github`
- **Financial Signals**: `https://signals.strategickhaos.ai/financial`
