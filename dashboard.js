// SovereignMesh Dashboard - Interactive Functionality

// State management
const state = {
    systemStatus: 'operational',
    queenDeployed: false,
    metrics: {
        cpu: 34,
        memory: 58,
        network: 45,
        storage: 67
    },
    clusters: [
        { name: 'jarvis-swarm-001', status: 'active', region: 'us-central1', nodes: 8 },
        { name: 'autopilot-cluster-1', status: 'active', region: 'us-east1', nodes: 'auto' },
        { name: 'sovereign-mesh-cluster', status: 'pending', region: 'us-west1', nodes: 12 }
    ]
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 SovereignMesh Dashboard initializing...');
    
    initializeEventListeners();
    startMetricsSimulation();
    updateSystemTime();
    
    console.log('✅ Dashboard ready');
});

// Event Listeners
function initializeEventListeners() {
    // Queen.js deployment buttons
    const deployQueenBtn = document.getElementById('deployQueenBtn');
    if (deployQueenBtn) {
        deployQueenBtn.addEventListener('click', handleDeployQueen);
    }

    const testQueenBtn = document.getElementById('testQueenBtn');
    if (testQueenBtn) {
        testQueenBtn.addEventListener('click', handleTestQueen);
    }

    const viewLogsBtn = document.getElementById('viewLogsBtn');
    if (viewLogsBtn) {
        viewLogsBtn.addEventListener('click', handleViewLogs);
    }

    // Quick actions
    const viewProjectsBtn = document.getElementById('viewProjectsBtn');
    if (viewProjectsBtn) {
        viewProjectsBtn.addEventListener('click', handleViewProjects);
    }

    const openCloudShellBtn = document.getElementById('openCloudShellBtn');
    if (openCloudShellBtn) {
        openCloudShellBtn.addEventListener('click', handleOpenCloudShell);
    }

    const configZapierBtn = document.getElementById('configZapierBtn');
    if (configZapierBtn) {
        configZapierBtn.addEventListener('click', handleConfigZapier);
    }

    const viewDocsBtn = document.getElementById('viewDocsBtn');
    if (viewDocsBtn) {
        viewDocsBtn.addEventListener('click', handleViewDocs);
    }

    // Terminal
    const executeCommandBtn = document.getElementById('executeCommandBtn');
    if (executeCommandBtn) {
        executeCommandBtn.addEventListener('click', handleExecuteCommand);
    }

    const terminalInput = document.getElementById('terminalInput');
    if (terminalInput) {
        terminalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleExecuteCommand();
            }
        });
    }

    const clearTerminalBtn = document.getElementById('clearTerminalBtn');
    if (clearTerminalBtn) {
        clearTerminalBtn.addEventListener('click', handleClearTerminal);
    }
}

// Queen.js deployment handlers
function handleDeployQueen() {
    console.log('🚀 Deploying Queen.js to GKE...');
    
    const btn = document.getElementById('deployQueenBtn');
    const statusElement = document.getElementById('queenStatus');
    
    // Update button state
    btn.disabled = true;
    btn.textContent = 'Deploying...';
    btn.style.opacity = '0.6';
    
    // Simulate deployment process
    addTerminalLine('$ kubectl apply -f k8s-deploy.yaml', 'command');
    
    setTimeout(() => {
        addTerminalLine('deployment.apps/queen-orchestrator created', 'success');
        addTerminalLine('service/queen-service created', 'success');
        
        setTimeout(() => {
            addTerminalLine('$ kubectl get pods -l app=queen', 'command');
            addTerminalLine('queen-orchestrator-7d9f8c5b6-x7k2m   1/1   Running   0   10s', 'success');
            
            state.queenDeployed = true;
            statusElement.textContent = 'Deployed ✓';
            statusElement.style.color = 'var(--success-color)';
            
            btn.textContent = 'Redeploy';
            btn.disabled = false;
            btn.style.opacity = '1';
            
            showNotification('Queen.js successfully deployed to GKE! 👑', 'success');
        }, 2000);
    }, 1500);
}

function handleTestQueen() {
    console.log('🧪 Testing Queen.js locally...');
    
    addTerminalLine('$ cd ./sovereign-mesh && node queen.js', 'command');
    addTerminalLine('Queen.js Orchestrator v1.0.0', 'output');
    addTerminalLine('Server running on http://localhost:3000', 'success');
    addTerminalLine('Ready to receive commands...', 'output');
    
    showNotification('Queen.js test server started on localhost:3000', 'info');
}

function handleViewLogs() {
    console.log('📋 Viewing Queen.js logs...');
    
    addTerminalLine('$ kubectl logs -f deployment/queen-orchestrator', 'command');
    addTerminalLine('[2024-12-04 13:43:46] Queen.js initialized', 'output');
    addTerminalLine('[2024-12-04 13:43:47] Connected to SovereignMesh', 'success');
    addTerminalLine('[2024-12-04 13:43:48] Zapier webhook registered', 'success');
    addTerminalLine('[2024-12-04 13:43:49] GitHub integration active', 'success');
    addTerminalLine('[2024-12-04 13:43:50] System ready ✓', 'success');
    
    showNotification('Displaying Queen.js logs', 'info');
}

// Quick action handlers
function handleViewProjects() {
    console.log('📊 Viewing Google Cloud projects...');
    
    addTerminalLine('$ gcloud projects list', 'command');
    addTerminalLine('PROJECT_ID                NAME                        PROJECT_NUMBER', 'output');
    addTerminalLine('strategic-khaos-prod      StrategicKhaos Production   123456789012', 'output');
    addTerminalLine('sovereignmesh-dev         SovereignMesh Development   234567890123', 'output');
    
    showNotification('Fetching GCloud projects...', 'info');
}

function handleOpenCloudShell() {
    console.log('💻 Opening Cloud Shell...');
    
    showNotification('Opening Google Cloud Shell in new tab...', 'info');
    
    // Simulate opening Cloud Shell
    setTimeout(() => {
        window.open('https://console.cloud.google.com/cloudshell', '_blank');
    }, 500);
}

function handleConfigZapier() {
    console.log('⚙️ Configuring Zapier integration...');
    
    showNotification('Opening Zapier configuration...', 'info');
    
    addTerminalLine('$ curl -X POST https://hooks.zapier.com/hooks/catch/...', 'command');
    addTerminalLine('{"status": "webhook registered", "id": "zap_001"}', 'success');
}

function handleViewDocs() {
    console.log('📚 Opening documentation...');
    
    showNotification('Opening SovereignMesh documentation...', 'info');
    
    addTerminalLine('$ open https://docs.sovereignmesh.ai', 'command');
    addTerminalLine('Documentation: https://docs.sovereignmesh.ai', 'output');
}

// Terminal handlers
function handleExecuteCommand() {
    const input = document.getElementById('terminalInput');
    const command = input.value.trim();
    
    if (!command) return;
    
    addTerminalLine(`$ ${command}`, 'command');
    
    // Simulate command execution
    executeSimulatedCommand(command);
    
    input.value = '';
}

function executeSimulatedCommand(command) {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('gcloud projects')) {
        setTimeout(() => {
            addTerminalLine('PROJECT_ID: strategic-khaos-prod', 'output');
            addTerminalLine('NAME: StrategicKhaos Production', 'output');
        }, 500);
    } else if (lowerCommand.includes('kubectl get')) {
        setTimeout(() => {
            if (lowerCommand.includes('pods')) {
                addTerminalLine('NAME                                  READY   STATUS    RESTARTS   AGE', 'output');
                addTerminalLine('queen-orchestrator-7d9f8c5b6-x7k2m   1/1     Running   0          5m', 'success');
            } else if (lowerCommand.includes('clusters')) {
                addTerminalLine('jarvis-swarm-001     RUNNING   us-central1', 'output');
                addTerminalLine('autopilot-cluster-1  RUNNING   us-east1', 'output');
            } else {
                addTerminalLine('Command executed successfully', 'success');
            }
        }, 500);
    } else if (lowerCommand.includes('node queen.js')) {
        setTimeout(() => {
            addTerminalLine('Queen.js Orchestrator v1.0.0', 'output');
            addTerminalLine('Server started on port 3000', 'success');
        }, 500);
    } else if (lowerCommand.includes('help')) {
        setTimeout(() => {
            addTerminalLine('Available commands:', 'output');
            addTerminalLine('  gcloud projects list - List GCP projects', 'output');
            addTerminalLine('  kubectl get pods - List Kubernetes pods', 'output');
            addTerminalLine('  kubectl get clusters - List GKE clusters', 'output');
            addTerminalLine('  node queen.js - Start Queen.js locally', 'output');
        }, 500);
    } else {
        setTimeout(() => {
            addTerminalLine(`Executing: ${command}`, 'output');
            addTerminalLine('Done', 'success');
        }, 500);
    }
}

function addTerminalLine(text, type = 'output') {
    const terminalOutput = document.getElementById('terminalOutput');
    const promptLine = terminalOutput.querySelector('.prompt');
    
    const line = document.createElement('div');
    line.className = `terminal-line ${type}`;
    line.textContent = text;
    
    if (promptLine) {
        terminalOutput.insertBefore(line, promptLine);
    } else {
        terminalOutput.appendChild(line);
    }
    
    // Auto-scroll to bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function handleClearTerminal() {
    const terminalOutput = document.getElementById('terminalOutput');
    terminalOutput.innerHTML = '<div class="terminal-line prompt">$ <span class="cursor">_</span></div>';
    
    showNotification('Terminal cleared', 'info');
}

// Metrics simulation
function startMetricsSimulation() {
    setInterval(() => {
        updateMetrics();
    }, 3000);
}

function updateMetrics() {
    // Simulate metric fluctuations
    state.metrics.cpu = Math.max(20, Math.min(80, state.metrics.cpu + (Math.random() - 0.5) * 10));
    state.metrics.memory = Math.max(40, Math.min(90, state.metrics.memory + (Math.random() - 0.5) * 8));
    state.metrics.network = Math.max(30, Math.min(70, state.metrics.network + (Math.random() - 0.5) * 15));
    state.metrics.storage = Math.max(50, Math.min(85, state.metrics.storage + (Math.random() - 0.5) * 5));
    
    // Update UI
    updateMetricDisplay('cpuUsage', state.metrics.cpu);
    updateMetricDisplay('memoryUsage', state.metrics.memory);
    updateMetricDisplay('networkIO', `${(Math.random() * 3 + 1).toFixed(1)} GB/s`);
    updateMetricDisplay('storage', state.metrics.storage);
}

function updateMetricDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        if (typeof value === 'number') {
            element.textContent = `${Math.round(value)}%`;
            
            // Update progress bars
            const metricItem = element.closest('.metric-item');
            if (metricItem) {
                const bar = metricItem.querySelector('.metric-bar-fill');
                if (bar) {
                    bar.style.width = `${value}%`;
                }
            }
        } else {
            element.textContent = value;
        }
    }
}

// System time updates
function updateSystemTime() {
    setInterval(() => {
        const now = new Date();
        // Could update a timestamp display if needed
    }, 1000);
}

// Notification system
function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--danger-color)' : 'var(--primary-color)'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export for debugging
window.SovereignMesh = {
    state,
    updateMetrics,
    addTerminalLine,
    showNotification
};

console.log('💜 SovereignMesh Dashboard loaded successfully');
