# Job Hunt Components

This directory contains modular components for the Job Hunt page, organized by functionality:

## Components

### `URLInput.tsx`
- Handles job URL input and validation
- Provides real-time URL validation feedback
- Props: `jobUrl`, `isValidUrl`, `onUrlChange`

### `JobPreviewPanel.tsx` 
- Displays the job posting in an iframe
- Shows placeholder when no valid URL is provided
- Props: `jobUrl`, `isValidUrl`

### `KeywordExtractionPanel.tsx`
- Automated keyword extraction from job postings
- Supports LinkedIn-specific extraction
- Uses html-to-text and keyword-extractor libraries
- Exposes `extractKeywords` function via ref for auto-triggering
- Props: keyword state and extraction handlers

### `AIAnalysisPanel.tsx`
- ChatGPT integration and prompt generation
- Smart tab management for ChatGPT navigation
- Enhanced prompts that include extracted keywords
- Props: `jobUrl`, `extractedKeywords`

### `AnalysisPanel.tsx`
- Combines KeywordExtractionPanel and AIAnalysisPanel
- Handles auto-extraction when URL becomes valid
- Main right-side panel for analysis functionality

### `InstructionsPanel.tsx`
- Shows usage instructions when no URL is entered
- Conditional rendering based on URL state
- Props: `show`

## Usage

```tsx
import { URLInput, JobPreviewPanel, AnalysisPanel, InstructionsPanel } from "./components";

// Use components with proper props...
```

## Architecture Benefits

- **Separation of Concerns**: Each component has a single responsibility
- **Reusability**: Components can be easily reused or moved
- **Maintainability**: Easier to debug and modify specific functionality  
- **Testing**: Components can be tested independently
- **Type Safety**: Each component has well-defined TypeScript interfaces 