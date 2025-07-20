# OpenResume Browser Extension

A browser extension that integrates with OpenResume to help extract resume data from web pages, generate AI analysis prompts, and provide quick access to the resume builder.

## Features

- **Keyword Extraction**: Extract keywords from job sites and professional profiles
- **AI Prompt Generation**: Generate enhanced prompts for ChatGPT analysis using extracted content
- **Smart ChatGPT Integration**: Navigate to ChatGPT with intelligent tab management
- **Auto-detection**: Automatically detect job postings and resume content
- **Context Menu Integration**: Right-click access to extraction and analysis features
- **Configurable Settings**: Customize auto-extraction and notification preferences

## Key Improvements

### Enhanced AI Analysis
- Generate detailed analysis prompts that include actual job posting content
- Smart ChatGPT tab management (reuses existing tabs or creates new ones)
- One-click copy prompt and navigate workflow
- Fallback options for manual prompt copying

### Better Job Site Support
- Works seamlessly on LinkedIn, Indeed, Glassdoor, and other job sites
- No CORS or iframe limitations like the web app
- Direct access to page content for better keyword extraction

## Development

### Prerequisites

- Node.js and npm installed
- Chrome or Chromium-based browser for testing

### Setup

1. Install dependencies:
```bash
npm install
```

2. Build the extension:
```bash
npm run extension:build
```

3. For development with hot reload:
```bash
npm run extension:dev
```

### Loading the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `extension/dist` folder
4. The OpenResume extension should now be loaded

### Project Structure

```
extension/
├── src/
│   ├── popup/          # Extension popup UI with AI features
│   ├── options/        # Options/settings page
│   ├── content/        # Content script for web page interaction
│   ├── background/     # Background service worker with ChatGPT integration
│   └── global.d.ts     # TypeScript global definitions
├── public/
│   ├── manifest.json   # Extension manifest
│   ├── popup.html      # Popup HTML template
│   ├── options.html    # Options page HTML template
│   └── icons/          # Extension icons
└── dist/               # Built extension files
```

### Building for Production

```bash
npm run extension:build
```

The built extension will be in the `extension/dist` folder, ready for packaging and distribution.

### Development Scripts

- `npm run extension:dev` - Build in development mode with watch
- `npm run extension:build` - Build for production
- `npm run extension:clean` - Clean the dist folder

## Usage

### Basic Workflow
1. **Install Extension**: Load the extension in Chrome
2. **Navigate to Job Posting**: Go to any job site (LinkedIn, Indeed, etc.)
3. **Extract Keywords**: Click extension icon and use "Extract Keywords"
4. **Generate AI Prompt**: Use "Copy AI Prompt & Go to ChatGPT"
5. **Analyze with AI**: Paste prompt in ChatGPT for detailed analysis

### Available Actions
- **Extract Keywords**: Automatically extract relevant keywords from job postings
- **Copy AI Prompt & Go to ChatGPT**: Generate enhanced prompt and navigate to ChatGPT
- **Copy AI Prompt Only**: Copy the enhanced prompt to clipboard
- **Copy Keywords**: Copy extracted keywords as comma-separated list

### Context Menu Integration
Right-click on any page and select:
- "Extract Keywords from Job Posting"
- "Generate AI Analysis Prompt"

## Configuration

The extension can be configured through the options page:

- **Auto-extract**: Automatically analyze pages for resume content
- **Notifications**: Show notifications when resume data is found
- **Default Template**: Choose the default resume template
- **API Endpoint**: Configure the OpenResume app URL

## Supported Sites

The extension works best on:

- LinkedIn job postings and profiles
- Indeed job listings
- Glassdoor job postings
- Company career pages
- Resume/CV websites
- Any page with structured job or profile information

## AI Integration

### Enhanced Prompts
The extension generates comprehensive analysis prompts that include:
- Actual job posting content (not just URLs)
- Structured analysis requests for technical and soft skills
- Industry-specific keyword optimization suggestions
- Experience level and education requirements extraction

### Smart ChatGPT Management
- Automatically detects existing ChatGPT tabs
- Reuses existing tabs when possible
- Creates new tabs when needed
- Focuses ChatGPT window after navigation
- Handles multiple windows and browser sessions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the extension locally
5. Submit a pull request

## License

Same as the main OpenResume project. 