import { forwardRef, useImperativeHandle } from "react";
import { useAppSelector } from "lib/redux/hooks";
import type { JobPreviewPanelRef } from "./JobPreviewPanel";

interface KeywordExtractionPanelProps {
  jobPreviewRef: React.RefObject<JobPreviewPanelRef>;
}

interface KeywordExtractionPanelRef {
  extractKeywords: () => void;
}

export const KeywordExtractionPanel = forwardRef<KeywordExtractionPanelRef, KeywordExtractionPanelProps>(({
  jobPreviewRef,
}, ref) => {
  const {
    jobUrl,
    isValidUrl,
  } = useAppSelector((state) => state.jobHunt);
  
  const extractKeywords = () => {
    // This functionality has been moved to the browser extension
    console.log('Keyword extraction is now handled by the OpenResume browser extension');
  };

  // Expose extractKeywords function to parent component for compatibility
  useImperativeHandle(ref, () => ({
    extractKeywords,
  }));

  const openExtensionPage = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      // We're in the extension context, open the popup
      chrome.action.openPopup();
    } else {
      // We're in the web app, show instructions
      alert('Please install the OpenResume browser extension to use keyword extraction features.');
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-blue-800">
          🚀 Enhanced Keyword Extraction
        </h3>
      </div>

      <div className="space-y-3">
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🎯</span>
            <h4 className="font-semibold text-blue-900">Moved to Browser Extension!</h4>
          </div>
          <p className="text-sm text-blue-800 mb-3">
            Keyword extraction is now powered by our browser extension for better performance and direct page access.
          </p>
          
          <div className="space-y-2 text-xs text-blue-700">
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Direct access to job posting content</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>No CORS or iframe limitations</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Works on any job site (LinkedIn, Indeed, etc.)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Auto-detection of job postings</span>
            </div>
          </div>
        </div>

        {isValidUrl && (
          <div className="bg-white border border-blue-200 rounded-lg p-3">
            <h5 className="font-medium text-blue-900 mb-2 text-sm">How to extract keywords:</h5>
            <ol className="text-xs text-blue-700 space-y-1 pl-4">
              <li>1. Install the OpenResume browser extension</li>
              <li>2. Navigate to the job posting: <code className="bg-blue-100 px-1 rounded text-xs">{jobUrl}</code></li>
              <li>3. Click the extension icon and use "Extract Keywords"</li>
              <li>4. Copy the keywords and paste them into your resume</li>
            </ol>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={openExtensionPage}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>🔧</span>
            Use Extension
          </button>
          
          <a
            href="https://github.com/xitanggg/open-resume/tree/main/extension"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-center no-underline"
          >
            <span>📥</span>
            Install Extension
          </a>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
          <div className="flex items-start gap-2">
            <span className="text-yellow-600">💡</span>
            <div className="text-xs text-yellow-800">
              <strong>Pro Tip:</strong> The extension can auto-extract keywords as you browse job sites, making it even faster to optimize your resume!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

KeywordExtractionPanel.displayName = "KeywordExtractionPanel"; 