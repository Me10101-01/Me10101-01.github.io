const express = require('express');
const bodyParser = require('body-parser');
const openpgp = require('openpgp');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GPG Key ID for signature verification
const TRUSTED_KEY_ID = 'AE5519579584DEF5';

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'queen-signal-ingestion' });
});

// Signal ingestion endpoint for academic signals
app.post('/signals/academic', async (req, res) => {
  try {
    console.log('Received academic signal:', {
      timestamp: new Date().toISOString(),
      headers: req.headers,
      body: req.body
    });

    // Extract signal data
    const signal = req.body;
    
    // Verify GPG signature if present
    if (signal.signature && signal.signedContent) {
      const isValid = await verifySignature(signal.signedContent, signal.signature);
      if (!isValid) {
        console.warn('Invalid signature detected');
        return res.status(401).json({ 
          error: 'Invalid signature',
          message: 'Signal signature verification failed'
        });
      }
      console.log('Signature verified successfully');
    }

    // Classify and route the signal
    const classification = classifySignal(signal);
    console.log('Signal classified as:', classification);

    // Dispatch signal to appropriate handler
    const result = await dispatchSignal(signal, classification);

    res.status(200).json({
      status: 'accepted',
      classification: classification,
      result: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing signal:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Generic signal endpoint
app.post('/signals/:category', async (req, res) => {
  const category = req.params.category;
  
  try {
    console.log(`Received ${category} signal:`, {
      timestamp: new Date().toISOString(),
      body: req.body
    });

    const signal = req.body;
    const classification = { category, ...classifySignal(signal) };
    const result = await dispatchSignal(signal, classification);

    res.status(200).json({
      status: 'accepted',
      classification: classification,
      result: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`Error processing ${category} signal:`, error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Verify GPG signature
 */
async function verifySignature(content, signature) {
  try {
    // In production, you would load the public key from a keyserver or local storage
    // For now, we'll return true if signature is present (placeholder)
    // TODO: Implement actual GPG verification with key AE5519579584DEF5
    console.log('Verifying signature (placeholder implementation)');
    return true;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Classify incoming signal based on content
 */
function classifySignal(signal) {
  const classification = {
    priority: 'normal',
    type: 'unknown',
    tags: []
  };

  // Extract classification hints from signal
  if (signal.subject) {
    const subject = signal.subject.toLowerCase();
    
    if (subject.includes('urgent') || subject.includes('critical')) {
      classification.priority = 'high';
    }
    
    if (subject.includes('research') || subject.includes('paper')) {
      classification.type = 'academic-research';
      classification.tags.push('research');
    }
    
    if (subject.includes('deadline') || subject.includes('due')) {
      classification.tags.push('deadline');
    }
  }

  return classification;
}

/**
 * Dispatch signal to appropriate handler based on classification
 */
async function dispatchSignal(signal, classification) {
  console.log('Dispatching signal:', { classification });
  
  // In production, this would route to different compute substrates
  // based on classification (GKE nodes, specific services, etc.)
  
  const result = {
    dispatched: true,
    handler: determineHandler(classification),
    queuedAt: new Date().toISOString()
  };

  // TODO: Implement actual dispatching to compute substrate
  // For now, just log and return success
  
  return result;
}

/**
 * Determine which handler should process this signal
 */
function determineHandler(classification) {
  const { type, priority } = classification;
  
  if (priority === 'high') {
    return 'priority-queue';
  }
  
  if (type === 'academic-research') {
    return 'research-processor';
  }
  
  return 'default-processor';
}

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Queen.js signal ingestion service running on port ${PORT}`);
    console.log(`Trusted GPG Key ID: ${TRUSTED_KEY_ID}`);
    console.log('Ready to receive signals...');
  });
}

module.exports = app;
