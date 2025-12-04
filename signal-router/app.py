"""
Signal Routing Authority (SRA)
Flask app that routes webhook signals to appropriate destinations
"""

from flask import Flask, request, jsonify
import os
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Routing table for signal destinations
ROUTING_TABLE = {
    'academic': {
        'name': 'Academic Intelligence',
        'destinations': ['academic-processor'],
        'priority': 'high'
    },
    'github': {
        'name': 'GitHub Events',
        'destinations': ['code-analyzer', 'deployment-tracker'],
        'priority': 'medium'
    },
    'financial': {
        'name': 'Financial Signals',
        'destinations': ['financial-processor'],
        'priority': 'critical'
    }
}


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Signal Routing Authority',
        'version': '1.0.0'
    }), 200


@app.route('/signals/<signal_type>', methods=['POST'])
def route_signal(signal_type):
    """
    Route incoming signals to appropriate destinations
    
    Args:
        signal_type: Type of signal (academic, github, financial)
    """
    if signal_type not in ROUTING_TABLE:
        logger.warning(f"Unknown signal type: {signal_type}")
        return jsonify({
            'error': 'Unknown signal type',
            'signal_type': signal_type,
            'available_types': list(ROUTING_TABLE.keys())
        }), 404
    
    # Get the signal data (accept both JSON and non-JSON for flexibility)
    if request.is_json:
        signal_data = request.get_json()
    else:
        # Allow form data or empty requests for simple webhooks
        signal_data = request.form.to_dict() if request.form else {}
    
    # Get routing configuration
    route_config = ROUTING_TABLE[signal_type]
    
    logger.info(f"Routing {signal_type} signal to {route_config['destinations']}")
    
    # In a real implementation, this would route to actual services
    # For now, we acknowledge and log the signal
    response = {
        'status': 'routed',
        'signal_type': signal_type,
        'route_name': route_config['name'],
        'destinations': route_config['destinations'],
        'priority': route_config['priority'],
        'received_data': signal_data
    }
    
    return jsonify(response), 200


@app.route('/routing-table', methods=['GET'])
def get_routing_table():
    """Return the current routing table configuration"""
    return jsonify({
        'routing_table': ROUTING_TABLE,
        'total_routes': len(ROUTING_TABLE)
    }), 200


@app.route('/', methods=['GET'])
def index():
    """Root endpoint with service information"""
    return jsonify({
        'service': 'Signal Routing Authority',
        'version': '1.0.0',
        'endpoints': {
            'health': '/health',
            'routing_table': '/routing-table',
            'signals': {
                'academic': '/signals/academic',
                'github': '/signals/github',
                'financial': '/signals/financial'
            }
        }
    }), 200


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
