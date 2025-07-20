# OpenResume Browser Extension

A browser extension that integrates with OpenResume to help extract resume data from web pages and provide quick access to the resume builder.

## Features

- Extract resume data from job sites and professional profiles
- Quick access to OpenResume app
- Auto-detection of resume content
- Configurable settings and templates
- Context menu integration

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
│   ├── popup/          # Extension popup UI
│   ├── options/        # Options/settings page
│   ├── content/        # Content script for web page interaction
│   ├── background/     # Background service worker
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

1. **Popup Interface**: Click the extension icon to access the main interface
2. **Extract Resume Data**: Use the "Extract Resume Data" button to analyze the current page
3. **Settings**: Access extension settings through the options page
4. **Context Menu**: Right-click on any page and select "Extract Resume Data"

## Configuration

The extension can be configured through the options page:

- **Auto-extract**: Automatically analyze pages for resume content
- **Notifications**: Show notifications when resume data is found
- **Default Template**: Choose the default resume template
- **API Endpoint**: Configure the OpenResume app URL

## Supported Sites

The extension works best on:

- LinkedIn profiles
- Indeed job listings
- Company career pages
- Resume/CV websites
- Any page with structured profile information

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the extension locally
5. Submit a pull request

## License

Same as the main OpenResume project. 