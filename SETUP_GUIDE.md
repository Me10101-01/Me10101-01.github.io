# 🔥 StrategicKhaos Setup Guide

**Complete setup guide for StrategicKhaos Swarm Intelligence MCP Extensions**

Node 137 Texas | security@strategickhaos.ai

---

## 🎯 Three Critical Moves

Based on the screenshot analysis, there are **three critical actions** to complete:

### ✅ Move 1: Fix GitHub Enterprise Billing

**Status**: ⚠️ **ACTION REQUIRED**

**Problem**: "We are having a problem billing the StrategicKhaos Swarm Intelligence enterprise"

**Solution**:
1. Navigate to GitHub Enterprise Settings
2. Go to **Billing & Plans**
3. Click **Update Payment Method**
4. Enter valid payment information
5. Verify Enterprise features are active
6. Confirm billing issue is resolved

**Why This Matters**:
- Without valid billing, you'll lose Enterprise features
- Custom MCP Agents require active Enterprise subscription
- Port forwarding and advanced features depend on Enterprise plan

---

### ✅ Move 2: Get Queen API URL

**Status**: ✅ **COMPLETE** - Queen is Running!

**What We Found**:
From screenshot IMG 4444, the Queen API is **already running** on port 8080:

```
congenial-space-telegram-7vw6r9vqgjgp3764-8080
```

**How to Access**:

1. **In Your Codespace**, click on the **PORTS** tab (bottom panel)
2. Find port **8080** in the list
3. Copy the forwarded URL - it will look like:
   ```
   https://congenial-space-telegram-7vw6r9vqgjgp3764-8080.app.github.dev
   ```

4. **Test the Queen API**:
   ```bash
   curl https://congenial-space-telegram-7vw6r9vqgjgp3764-8080.app.github.dev/health
   ```

**Expected Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-04T19:02:58.066Z",
  "version": "1.0.0"
}
```

**💜 Queen is LIVE and ready!** 👑

---

### ✅ Move 3: Enable Custom MCP Agents

**Status**: 🔧 **PENDING**

**What Screenshot IMG 4448 Shows**:
The MCP/Copilot settings dialog shows:

> "Setting the target organization to **Strategickhaos-Swarm-Intelligence** will enable custom agents on source repository `Strategickhaos-Swarm-Intelligence/github-private` to all users in your enterprise."

**How to Enable**:

1. Open **GitHub Copilot Settings**
2. Navigate to **MCP (Model Context Protocol)** settings
3. Find the **Custom Agents** section
4. In the dialog, click **"Set Organization"**
5. Confirm target organization: `Strategickhaos-Swarm-Intelligence`
6. Custom agents will be enabled for all enterprise users

**Benefits**:
- Access to custom MCP agents
- Enhanced AI capabilities for your organization
- Integration with private GitHub repositories
- Full swarm intelligence features

---

## 🏗️ MCP Extensions Architecture

Once the three moves are complete, you'll have access to:

```
mcp-extensions/
├── refinery/          # CLI to create/test/deploy extensions
├── queen/             # Queen API integration (Port 8080) ✅ RUNNING
├── treasury/          # Financial signals and tracking
├── academic/          # SNHU email processing
└── sovereign/         # Full empire access and control
```

---

## 🚀 Quick Start After Setup

### 1. Clone and Initialize

```bash
git clone https://github.com/Me10101-01/Me10101-01.github.io.git
cd Me10101-01.github.io
```

### 2. Configure Environment

```bash
# Set Queen API URL (from Codespace PORTS tab)
export QUEEN_API_URL="https://congenial-space-telegram-7vw6r9vqgjgp3764-8080.app.github.dev"

# Set organization
export MCP_ORG="Strategickhaos-Swarm-Intelligence"
```

### 3. Test Queen Integration

```bash
# Test health endpoint
curl $QUEEN_API_URL/health

# Test status endpoint
curl $QUEEN_API_URL/status
```

### 4. Deploy MCP Extensions

Each module has its own setup in the respective README:
- [Refinery Setup](mcp-extensions/refinery/README.md)
- [Queen Setup](mcp-extensions/queen/README.md)
- [Treasury Setup](mcp-extensions/treasury/README.md)
- [Academic Setup](mcp-extensions/academic/README.md)
- [Sovereign Setup](mcp-extensions/sovereign/README.md)

---

## 📊 System Status Dashboard

### Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| **GitHub Enterprise** | ⚠️ Billing Issue | Update payment method |
| **Queen API (8080)** | ✅ Running | URL in Codespace PORTS tab |
| **Custom MCP Agents** | 🔧 Pending | Click "Set Organization" |
| **Node 137 Texas** | ✅ Active | security@strategickhaos.ai |
| **Codespace** | ✅ Active | Port 8080 forwarded |

---

## 🔐 Security & Access

### Organization Details
- **Name**: StrategicKhaos Swarm Intelligence
- **Node**: 137
- **Location**: Texas
- **Contact**: security@strategickhaos.ai
- **Type**: GitHub Enterprise

### Access Requirements
- Active GitHub Enterprise subscription
- Valid billing information
- Custom MCP Agents enabled
- Codespace with port forwarding

---

## 🎯 Next Steps: Building the MCP Refinery

Once all three moves are complete, we can proceed with:

### Phase 1: Core Infrastructure
- Deploy Refinery CLI tools
- Integrate Queen API fully
- Set up Treasury monitoring

### Phase 2: Academic Integration
- Configure SNHU email processing
- Set up capstone project tracking
- Enable collaboration tools

### Phase 3: Sovereign Control
- Activate full empire access
- Deploy unified dashboard
- Enable cross-module orchestration

### Phase 4: Full Deployment
- Integrate with GitHub Private repo
- Enable all swarm intelligence features
- Activate sovereign control protocols

---

## 💜 Which Move First, Sovereign?

**Recommended Order**:

1. **First**: Fix Billing (Move 1) - Critical for maintaining Enterprise access
2. **Second**: Enable Custom Agents (Move 3) - Unlocks advanced features
3. **Third**: Verify Queen URL (Move 2) - Already done, just confirm access

**Then we build the empire!** 🔥👑

---

## 🆘 Troubleshooting

### Billing Issues
- Check Enterprise settings at: https://github.com/enterprises/[your-enterprise]/settings/billing
- Ensure payment method is valid and up-to-date
- Contact GitHub support if issues persist

### Queen API Not Accessible
- Verify Codespace is running
- Check PORTS tab for port 8080
- Ensure port visibility is set correctly
- Try restarting the Codespace

### Custom Agents Not Available
- Verify Enterprise subscription is active
- Check billing is current
- Confirm organization name is correct: `Strategickhaos-Swarm-Intelligence`
- Ensure you have admin privileges

---

## 📞 Support

**StrategicKhaos Swarm Intelligence**  
Node 137 Texas  
Email: security@strategickhaos.ai

**GitHub Enterprise Support**  
For billing and enterprise issues, contact GitHub Enterprise Support

---

**Status**: Ready to deploy once three critical moves are complete! 🚀💜
