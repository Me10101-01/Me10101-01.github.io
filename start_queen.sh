#!/bin/bash

# Queen Startup Script
# Starts the Queen Academic Intelligence Pipeline

set -e

echo "🔥 Starting Queen Academic Intelligence Pipeline..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip is not installed. Please install pip."
    exit 1
fi

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "📦 Installing dependencies..."
    pip3 install -r requirements.txt
else
    echo "⚠️  No requirements.txt found. Skipping dependency installation."
fi

# Set default environment variables if not set
export PORT=${PORT:-8080}
export DEBUG=${DEBUG:-False}
export GPG_KEY_ID=${GPG_KEY_ID:-AE5519579584DEF5}
export GPG_SUBKEY=${GPG_SUBKEY:-510AB6D40B4A24FB}

echo "📝 Configuration:"
echo "   PORT: $PORT"
echo "   DEBUG: $DEBUG"
echo "   GPG_KEY_ID: $GPG_KEY_ID"
echo "   GPG_SUBKEY: $GPG_SUBKEY"

# Detect Codespace environment
if [ -n "$CODESPACE_NAME" ]; then
    QUEEN_URL="https://$CODESPACE_NAME-$PORT.app.github.dev"
    echo "🚀 Codespace detected!"
    echo "   👑 QUEEN URL: $QUEEN_URL"
    echo "   🔗 Access Queen at: $QUEEN_URL"
else
    echo "🖥️  Running locally"
    echo "   👑 QUEEN URL: http://localhost:$PORT"
fi

echo ""
echo "✨ Starting Queen application..."
echo ""

# Start the Flask application
python3 app.py
