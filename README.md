# Me10101-01.github.io
"Personal GitHub Pages site for Strategickhaos DAO LLC, compliance repos, and SNHU capstone projects."

## Features

### Grok AI Integration
This site includes a Grok AI assistant that allows you to interact with AI directly from the web interface.

#### Setup & Usage

1. **Local Development**: 
   - Run a local Grok API server on `http://localhost:11434/run`
   - Select "Local Grok" option in the API Configuration section
   - Start chatting with the AI assistant

2. **API Key Method**:
   - Select "API Key" option in the API Configuration section
   - Enter your Grok API key in the provided field
   - Start chatting with the AI assistant

#### Features
- **Simple Interface**: Clean, responsive design that works on mobile and desktop
- **Real-time Chat**: Send prompts and receive AI responses instantly
- **Error Handling**: Comprehensive error messages for connection issues
- **Flexible Configuration**: Support for both local development and production API keys
- **Loading Indicators**: Visual feedback during API calls
- **Message History**: Conversation history displayed in an easy-to-read format

#### Technical Details
- **Vanilla JavaScript**: No frameworks or dependencies required
- **Fetch API**: Modern browser API for HTTP requests
- **Responsive CSS**: Mobile-first design with gradient backgrounds
- **Error Recovery**: Timeout handling and connection retry logic

#### File Structure
```
├── index.html              # Main page with chat interface
├── assets/
│   ├── css/
│   │   └── style.css       # Styling for the interface
│   └── js/
│       └── grok.js         # Grok API integration logic
├── README.md               # This documentation
└── LICENSE                 # MIT License
```

#### API Configuration
The Grok integration supports two modes:

1. **Local Mode** (Default): Connects to `http://localhost:11434/run`
2. **API Key Mode**: Uses provided API key with standard endpoint

#### Browser Compatibility
- Modern browsers with ES6+ support
- Fetch API support required
- CSS Grid and Flexbox support recommended

## Deployment
This site is designed for GitHub Pages deployment. Simply push to the main branch and GitHub Pages will automatically deploy the site.

## License
MIT License - see LICENSE file for details.
