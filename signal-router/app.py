#!/usr/bin/env python3
"""
STRATEGICKHAOS SIGNAL ROUTING AUTHORITY (SRA)
The permanent webhook infrastructure department
GPG: AE5519579584DEF5
"""

from flask import Flask, request, jsonify
import requests
import os
from datetime import datetime
import json

app = Flask(__name__)

# PERMANENT ROUTING TABLE - Board controlled
ROUTES = {
    'academic': os.environ.get('QUEEN_URL', 'http://localhost:3000/signals/academic'),
    'github': os.environ.get('QUEEN_URL', 'http://localhost:3000/webhooks/github'),
    'financial': os.environ.get('TREASURY_URL', 'http://localhost:3001/signals/financial'),
    'discord': os.environ.get('QUEEN_URL', 'http://localhost:3000/signals/discord')
}

# Statistics
STATS = {
    'signals_routed': 0,
    'last_signal': None,
    'uptime_start': datetime.now()
}

@app.route('/')
def dashboard():
    """Board Dashboard"""
    return jsonify({
        "department": "SIGNAL ROUTING AUTHORITY",
        "status": "OPERATIONAL", 
        "version": "1.0.0",
        "routes": ROUTES,
        "stats": {
            "signals_routed": STATS['signals_routed'],
            "last_signal": STATS['last_signal'],
            "uptime_seconds": int((datetime.now() - STATS['uptime_start']).total_seconds())
        }
    })

@app.route('/health')
def health():
    return jsonify({"status": "sovereign", "department": "SRA", "routing": "active"})

@app.route('/signals/academic', methods=['POST'])
def route_academic():
    """Route Academic Intelligence Signals"""
    try:
        data = request.get_json()
        headers = dict(request.headers)
        
        # Forward to Queen
        destination = ROUTES['academic']
        response = requests.post(destination, json=data, headers=headers, timeout=30)
        
        STATS['signals_routed'] += 1
        STATS['last_signal'] = datetime.now().isoformat()
        
        print(f"📧 ACADEMIC SIGNAL ROUTED: {data.get('sender')} → {destination}")
        
        return jsonify({
            "routed": True,
            "signal_type": "academic", 
            "destination": destination,
            "status": response.status_code,
            "sra": "signal processed"
        })
        
    except Exception as e:
        print(f"❌ ROUTING FAILED: {e}")
        return jsonify({"error": str(e)}), 502

@app.route('/signals/github', methods=['POST'])
def route_github():
    """Route GitHub Signals"""
    return route_signal('github')

@app.route('/signals/financial', methods=['POST']) 
def route_financial():
    """Route Financial Signals"""
    return route_signal('financial')

def route_signal(signal_type):
    """Generic signal router"""
    try:
        data = request.get_json()
        destination = ROUTES[signal_type]
        response = requests.post(destination, json=data, headers=dict(request.headers), timeout=30)
        
        STATS['signals_routed'] += 1
        STATS['last_signal'] = datetime.now().isoformat()
        
        return jsonify({
            "routed": True,
            "signal_type": signal_type,
            "destination": destination, 
            "status": response.status_code
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 502

if __name__ == '__main__':
    print("🏛️ SIGNAL ROUTING AUTHORITY STARTING...")
    print(f"📡 Academic: {ROUTES['academic']}")
    print("🔗 PERMANENT WEBHOOK INFRASTRUCTURE ACTIVE")
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
