"""
Queen - Academic Intelligence Pipeline
A Flask application for processing academic signals from Zapier webhooks
"""

from flask import Flask, request, jsonify
from datetime import datetime, timezone
import os
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Expected GPG headers for authentication
EXPECTED_GPG_KEY_ID = "AE5519579584DEF5"
EXPECTED_SUBKEY = "510AB6D40B4A24FB"
EXPECTED_SOURCE = "strategickhaos-academic"


def validate_gpg_headers(headers):
    """
    Validate GPG authentication headers
    
    Args:
        headers: Request headers object
        
    Returns:
        tuple: (is_valid: bool, error_message: str or None)
    """
    gpg_key_id = headers.get('X-GPG-Key-ID')
    subkey = headers.get('X-Subkey')
    source = headers.get('X-Source')
    
    if not gpg_key_id:
        return False, "Missing X-GPG-Key-ID header"
    
    if gpg_key_id != EXPECTED_GPG_KEY_ID:
        return False, f"Invalid GPG Key ID: {gpg_key_id}"
    
    if not subkey:
        return False, "Missing X-Subkey header"
        
    if subkey != EXPECTED_SUBKEY:
        return False, f"Invalid Subkey: {subkey}"
    
    if not source:
        return False, "Missing X-Source header"
        
    if source != EXPECTED_SOURCE:
        return False, f"Invalid Source: {source}"
    
    return True, None


@app.route('/health', methods=['GET'])
def health():
    """
    Health check endpoint
    
    Returns:
        JSON response with service status
    """
    return jsonify({
        'status': 'healthy',
        'service': 'Queen Academic Intelligence Pipeline',
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'version': '1.0.0',
        'endpoints': {
            'health': '/health',
            'academic_signals': '/signals/academic'
        }
    }), 200


@app.route('/signals/academic', methods=['POST'])
def academic_signals():
    """
    Process academic signals from Zapier webhook
    
    Expected headers:
        - X-GPG-Key-ID: AE5519579584DEF5
        - X-Subkey: 510AB6D40B4A24FB
        - X-Source: strategickhaos-academic
        - Content-Type: application/json
        
    Returns:
        JSON response with processing status
    """
    # Validate GPG headers
    is_valid, error_msg = validate_gpg_headers(request.headers)
    
    if not is_valid:
        logger.warning(f"Authentication failed: {error_msg}")
        return jsonify({
            'status': 'error',
            'message': 'Authentication failed',
            'error': error_msg,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 401
    
    # Get JSON payload
    try:
        payload = request.get_json()
    except Exception as e:
        logger.error(f"Invalid JSON payload: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Invalid JSON payload',
            'error': str(e),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 400
    
    if not payload:
        return jsonify({
            'status': 'error',
            'message': 'Empty payload',
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 400
    
    # Log the received signal
    logger.info(f"Academic signal received: {payload}")
    
    # Process the academic signal
    # In a real implementation, this would:
    # 1. Parse the email data from Zapier
    # 2. Extract academic metadata
    # 3. Store in database or forward to processing pipeline
    # 4. Return acknowledgment
    
    response_data = {
        'status': 'success',
        'message': 'Academic signal processed successfully',
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'signal_id': payload.get('id', 'unknown'),
        'processed': True,
        'pipeline': 'academic-intelligence',
        'received_fields': list(payload.keys()) if isinstance(payload, dict) else []
    }
    
    logger.info(f"Signal processed successfully: {response_data['signal_id']}")
    
    return jsonify(response_data), 200


@app.route('/', methods=['GET'])
def index():
    """
    Root endpoint with API information
    """
    return jsonify({
        'service': 'Queen Academic Intelligence Pipeline',
        'version': '1.0.0',
        'description': 'Processing academic signals from SNHU emails via Zapier',
        'endpoints': {
            'health': {
                'path': '/health',
                'method': 'GET',
                'description': 'Health check endpoint'
            },
            'academic_signals': {
                'path': '/signals/academic',
                'method': 'POST',
                'description': 'Process academic signals',
                'authentication': 'GPG headers required',
                'required_headers': [
                    'X-GPG-Key-ID: AE5519579584DEF5',
                    'X-Subkey: 510AB6D40B4A24FB',
                    'X-Source: strategickhaos-academic',
                    'Content-Type: application/json'
                ]
            }
        },
        'codespace_url': 'https://congenial-space-telegram-7vw6r9vqgjgp3764-8080.app.github.dev',
        'timestamp': datetime.now(timezone.utc).isoformat()
    }), 200


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'status': 'error',
        'message': 'Endpoint not found',
        'timestamp': datetime.now(timezone.utc).isoformat()
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({
        'status': 'error',
        'message': 'Internal server error',
        'timestamp': datetime.now(timezone.utc).isoformat()
    }), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Starting Queen on port {port}")
    logger.info(f"Debug mode: {debug}")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )
