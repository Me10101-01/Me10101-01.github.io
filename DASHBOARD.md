# SovereignMesh Dashboard Documentation

## Overview

The SovereignMesh Dashboard is a nation-state infrastructure control center that provides real-time monitoring and management of your distributed cloud infrastructure across Google Cloud Platform (GCP), Kubernetes, and various integrated services.

## Features

### 1. System Overview
- **GKE Clusters**: Monitor the total number of active Google Kubernetes Engine clusters
- **Containers**: Track 130+ running containers across your infrastructure
- **Active Services**: View all active microservices
- **Uptime**: Real-time uptime percentage tracking

### 2. Queen.js Orchestrator
Your sovereign orchestrator system for managing distributed AI agents and services.

**Controls:**
- **Deploy to GKE**: One-click deployment to Google Kubernetes Engine
- **Test Locally**: Run Queen.js on localhost for development
- **View Logs**: Monitor real-time application logs

**Status Information:**
- Current deployment status (Ready to Deploy / Deployed)
- Endpoint URL: `queen.strategickhaos.ai`
- Version tracking

### 3. Infrastructure Visualization

**Active Clusters:**
1. **jarvis-swarm-001**
   - Region: us-central1
   - Nodes: 8
   - Type: GKE Cluster
   - Status: Active

2. **autopilot-cluster-1**
   - Region: us-east1
   - Mode: Autopilot
   - Type: GKE Cluster
   - Status: Active

3. **sovereign-mesh-cluster**
   - Region: us-west1
   - Nodes: 12
   - Type: GKE Cluster
   - Status: Pending

### 4. Integrations

Connected services and tools:
- ⚡ **Zapier**: Workflow automation
- 🐙 **GitHub**: Source control and CI/CD
- 🤖 **Kiro CLI**: Agentic AI coding system
- ☁️ **Google Cloud**: Cloud platform
- 🐳 **Docker**: Containerization
- ☸️ **Kubernetes**: Container orchestration

### 5. Deployment Pipeline

5-step deployment process:
1. ✓ Cloud Shell Setup - Complete
2. ✓ Kiro CLI Installation - Complete
3. ✓ Queen.js Bootstrap - Complete
4. ⏳ Deploy to GKE - In Progress
5. ⏸ DNS Configuration - Pending

### 6. Quick Actions

Convenient shortcuts to common tasks:
- **View Projects**: List all Google Cloud projects
- **Open Cloud Shell**: Launch Google Cloud Shell in a new tab
- **Configure Zapier**: Set up Zapier webhook integrations
- **Documentation**: Access SovereignMesh documentation

### 7. Command Center

Interactive terminal interface for executing commands against your infrastructure.

**Supported Commands:**
```bash
# List Google Cloud projects
gcloud projects list

# View Kubernetes clusters
kubectl get clusters

# List pods
kubectl get pods

# Check pod status for Queen.js
kubectl get pods -l app=queen

# Start Queen.js locally
node queen.js

# Help
help
```

### 8. System Metrics

Real-time monitoring of system resources:
- **CPU Usage**: Current CPU utilization percentage
- **Memory Usage**: RAM consumption tracking
- **Network I/O**: Network throughput in GB/s
- **Storage**: Disk usage percentage

Metrics auto-update every 3 seconds.

## Getting Started

### Prerequisites
- Google Cloud Platform account with active projects
- GKE clusters configured
- Kiro CLI installed in Cloud Shell
- Queen.js orchestrator codebase

### Deployment

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Me10101-01/Me10101-01.github.io.git
   cd Me10101-01.github.io
   ```

2. **Serve the dashboard locally:**
   ```bash
   python3 -m http.server 8080
   ```
   Navigate to `http://localhost:8080`

3. **Deploy to GitHub Pages:**
   - Push changes to the main branch
   - Enable GitHub Pages in repository settings
   - Access at `https://me10101-01.github.io`

### Using the Dashboard

#### Deploying Queen.js
1. Click the **"Deploy to GKE"** button in the Queen.js Orchestrator section
2. Watch the terminal output for deployment progress
3. Status will update to "Deployed ✓" when complete
4. Button will change to "Redeploy" for future updates

#### Testing Locally
1. Click **"Test Locally"** to simulate running Queen.js on localhost
2. Check terminal output for server status
3. Default port: 3000

#### Viewing Logs
1. Click **"View Logs"** to see Queen.js application logs
2. Terminal displays recent log entries
3. Includes initialization, connections, and webhook registrations

#### Terminal Commands
1. Type a command in the input field
2. Press Enter or click **"Execute"**
3. Output appears in the terminal window
4. Use **"Clear"** to reset the terminal

## Technical Architecture

### Files
- **index.html**: Main dashboard structure and layout
- **styles.css**: Sovereign-themed styling with purple/pink gradients
- **dashboard.js**: Interactive functionality and state management

### Technologies
- Pure HTML5/CSS3/JavaScript (no frameworks)
- Responsive design with CSS Grid and Flexbox
- Real-time metrics simulation
- Event-driven architecture

### Customization

#### Color Scheme
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #7c3aed;    /* Purple */
    --secondary-color: #a78bfa;   /* Light purple */
    --accent-color: #ec4899;      /* Pink */
    --success-color: #10b981;     /* Green */
    --warning-color: #f59e0b;     /* Orange */
    --danger-color: #ef4444;      /* Red */
}
```

#### Adding New Metrics
Edit the `state` object in `dashboard.js`:
```javascript
const state = {
    metrics: {
        cpu: 34,
        memory: 58,
        // Add new metrics here
    }
};
```

#### Adding New Clusters
Update the `clusters` array in `dashboard.js`:
```javascript
clusters: [
    { 
        name: 'your-cluster-name', 
        status: 'active', 
        region: 'us-west2', 
        nodes: 16 
    }
]
```

## Security Considerations

⚠️ **Important Security Notes:**

1. **No Real Credentials**: This is a visualization dashboard. Never embed actual GCP credentials or API keys in the frontend code.

2. **Backend Integration**: For production use, implement a backend API that:
   - Authenticates users
   - Proxies requests to GCP APIs
   - Manages credentials securely
   - Implements rate limiting

3. **HTTPS Only**: Always serve the dashboard over HTTPS in production

4. **Access Control**: Implement proper authentication and authorization before deploying publicly

## Roadmap

Future enhancements:
- [ ] Real GCP API integration via backend
- [ ] WebSocket support for real-time updates
- [ ] User authentication and authorization
- [ ] Custom alerts and notifications
- [ ] Historical metrics and graphing
- [ ] Multi-tenant support
- [ ] Export data functionality
- [ ] Dark/light theme toggle

## Support

For issues, questions, or contributions:
- GitHub Repository: https://github.com/Me10101-01/Me10101-01.github.io
- Strategic Khaos DAO LLC

## License

See LICENSE file in the repository.

---

**SovereignMesh Dashboard v1.0.0**  
*Nation-State Infrastructure Control Center*  
💜 Built with sovereign power
