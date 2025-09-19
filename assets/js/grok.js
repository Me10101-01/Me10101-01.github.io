/**
 * Grok API Integration for GitHub Pages
 * Connects to Grok AI endpoint and handles user interactions
 */

class GrokAPI {
    constructor() {
        this.outputElement = document.getElementById('output');
        this.promptElement = document.getElementById('prompt');
        this.sendButton = document.getElementById('send-btn');
        this.apiKeyElement = document.getElementById('api-key');
        
        this.initializeEventListeners();
        this.clearWelcomeMessage();
    }

    /**
     * Initialize event listeners for the interface
     */
    initializeEventListeners() {
        // API type radio button handling
        const apiTypeRadios = document.querySelectorAll('input[name="api-type"]');
        apiTypeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.apiKeyElement.disabled = e.target.value === 'localhost';
                if (e.target.value === 'localhost') {
                    this.apiKeyElement.value = '';
                }
            });
        });

        // Enter key handling for prompt input
        this.promptElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendPrompt();
            }
        });

        // Input validation
        this.promptElement.addEventListener('input', () => {
            this.sendButton.disabled = !this.promptElement.value.trim();
        });
    }

    /**
     * Clear the welcome message when first interaction occurs
     */
    clearWelcomeMessage() {
        const welcomeMessage = this.outputElement.querySelector('.welcome-message');
        if (welcomeMessage) {
            this.promptElement.addEventListener('focus', () => {
                welcomeMessage.remove();
            }, { once: true });
        }
    }

    /**
     * Get the current API configuration
     */
    getApiConfig() {
        const apiType = document.querySelector('input[name="api-type"]:checked').value;
        const apiKey = this.apiKeyElement.value.trim();

        if (apiType === 'localhost') {
            return {
                endpoint: 'http://localhost:11434/run',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        } else {
            if (!apiKey) {
                throw new Error('API key is required when not using localhost');
            }
            return {
                endpoint: 'https://api.grok.com/v1/chat/completions', // Example endpoint
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            };
        }
    }

    /**
     * Display a message in the output area
     */
    displayMessage(content, type = 'grok') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.textContent = content;
        this.outputElement.appendChild(messageDiv);
        this.scrollToBottom();
    }

    /**
     * Display loading indicator
     */
    showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message grok-message loading-message';
        loadingDiv.innerHTML = '<span class="loading"></span> Thinking...';
        loadingDiv.id = 'loading-indicator';
        this.outputElement.appendChild(loadingDiv);
        this.scrollToBottom();
    }

    /**
     * Remove loading indicator
     */
    hideLoading() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }

    /**
     * Scroll output area to bottom
     */
    scrollToBottom() {
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }

    /**
     * Send prompt to Grok API
     */
    async sendPrompt() {
        const prompt = this.promptElement.value.trim();
        if (!prompt) return;

        // Display user message
        this.displayMessage(prompt, 'user');
        this.promptElement.value = '';
        this.sendButton.disabled = true;
        this.showLoading();

        try {
            const config = this.getApiConfig();
            const response = await this.callGrokAPI(prompt, config);
            this.hideLoading();
            this.displayMessage(response, 'grok');
        } catch (error) {
            this.hideLoading();
            this.displayMessage(`Error: ${error.message}`, 'error');
            console.error('Grok API Error:', error);
        } finally {
            this.sendButton.disabled = false;
        }
    }

    /**
     * Call the Grok API with the given prompt
     */
    async callGrokAPI(prompt, config) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        try {
            const requestBody = this.buildRequestBody(prompt, config);
            
            const response = await fetch(config.endpoint, {
                method: 'POST',
                headers: config.headers,
                body: JSON.stringify(requestBody),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Grok endpoint not found. Make sure the service is running on localhost:11434');
                } else if (response.status === 401) {
                    throw new Error('Unauthorized. Please check your API key.');
                } else if (response.status === 429) {
                    throw new Error('Rate limit exceeded. Please wait before trying again.');
                } else {
                    throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
                }
            }

            const data = await response.json();
            return this.extractResponse(data);

        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error('Request timed out. Please try again.');
            } else if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('Cannot connect to Grok API. Please check if the service is running.');
            } else {
                throw error;
            }
        }
    }

    /**
     * Build the request body based on the API configuration
     */
    buildRequestBody(prompt, config) {
        if (config.endpoint.includes('localhost')) {
            // Local Grok API format
            return {
                prompt: prompt,
                model: 'grok',
                stream: false
            };
        } else {
            // Standard OpenAI-compatible format
            return {
                model: 'grok-beta',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7
            };
        }
    }

    /**
     * Extract the response text from the API response
     */
    extractResponse(data) {
        if (data.response) {
            // Local Grok API format
            return data.response;
        } else if (data.choices && data.choices.length > 0) {
            // OpenAI-compatible format
            return data.choices[0].message.content;
        } else if (data.message) {
            // Generic message format
            return data.message;
        } else {
            throw new Error('Unexpected response format from API');
        }
    }
}

// Global function for the HTML onclick handler
function sendPrompt() {
    if (window.grokAPI) {
        window.grokAPI.sendPrompt();
    }
}

// Initialize the Grok API when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.grokAPI = new GrokAPI();
});