"""
Signal Routing Authority (SRA)
Permanent webhook routing service for academic, GitHub, and financial signals
"""
from flask import Flask, request, jsonify
import os
import requests
from datetime import datetime

app = Flask(__name__)

# Routing table for signal destinations
ROUTING_TABLE = {
    'academic': os.getenv('ACADEMIC_ENDPOINT', 'https://hooks.zapier.com/hooks/catch/academic'),
    'github': os.getenv('GITHUB_ENDPOINT', 'https://hooks.zapier.com/hooks/catch/github'),
    'financial': os.getenv('FINANCIAL_ENDPOINT', 'https://hooks.zapier.com/hooks/catch/financial')
}


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Signal Routing Authority',
        'timestamp': datetime.utcnow().isoformat(),
        'routes': list(ROUTING_TABLE.keys())
    }), 200


@app.route('/signals/<signal_type>', methods=['POST', 'GET'])
def route_signal(signal_type):
    """
    Route incoming signals to appropriate destinations
    Supports: academic, github, financial
    """
    if signal_type not in ROUTING_TABLE:
        return jsonify({
            'error': 'Invalid signal type',
            'valid_types': list(ROUTING_TABLE.keys())
        }), 404
    
    # Get the destination endpoint
    destination = ROUTING_TABLE[signal_type]
    
    # For GET requests, return routing info
    if request.method == 'GET':
        return jsonify({
            'signal_type': signal_type,
            'destination': destination,
            'status': 'ready',
            'timestamp': datetime.utcnow().isoformat()
        }), 200
    
    # For POST requests, route the signal
    try:
        payload = request.get_json() if request.is_json else {}
        headers = {'Content-Type': 'application/json'}
        
        # Add metadata to the signal
        enriched_payload = {
            'original_payload': payload,
            'metadata': {
                'signal_type': signal_type,
                'routed_at': datetime.utcnow().isoformat(),
                'source_ip': request.remote_addr,
                'sra_version': '1.0.0'
            }
        }
        
        # Forward to destination
        response = requests.post(destination, json=enriched_payload, headers=headers, timeout=10)
        
        return jsonify({
            'status': 'routed',
            'signal_type': signal_type,
            'destination': destination,
            'response_status': response.status_code,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Routing failed',
            'signal_type': signal_type,
            'message': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500


@app.route('/', methods=['GET'])
def index():
    """Root endpoint with service information"""
    return jsonify({
        'service': 'Signal Routing Authority',
        'version': '1.0.0',
        'status': 'operational',
        'endpoints': {
            '/health': 'Health check',
            '/signals/academic': 'Academic signal routing',
            '/signals/github': 'GitHub signal routing',
            '/signals/financial': 'Financial signal routing'
        },
        'timestamp': datetime.utcnow().isoformat()
    }), 200


if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)
