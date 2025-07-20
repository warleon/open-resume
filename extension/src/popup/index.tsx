import React from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css';

interface PopupProps {}

interface KeywordExtractionResult {
  extractedText: string;
  extractedKeywords: string[];
  extractionMethod: string;
  success: boolean;
  error?: string;
}

const Popup: React.FC<PopupProps> = () => {
  const [currentTab, setCurrentTab] = React.useState<chrome.tabs.Tab | null>(null);
  const [isExtractingKeywords, setIsExtractingKeywords] = React.useState(false);
  const [keywordResults, setKeywordResults] = React.useState<KeywordExtractionResult | null>(null);
  const [hasJobContent, setHasJobContent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [contentScriptLoaded, setContentScriptLoaded] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    // Get current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        setCurrentTab(tabs[0]);
        
        // Check if content script is loaded and if current page has job content
        if (tabs[0].id) {
          checkContentScriptStatus(tabs[0].id);
        }
      }
    });
  }, []);

  const checkContentScriptStatus = async (tabId: number) => {
    try {
      // Try to ping the content script
      chrome.tabs.sendMessage(tabId, { action: 'ping' }, (response) => {
        if (chrome.runtime.lastError) {
          // Content script not loaded, try to inject it
          setContentScriptLoaded(false);
          console.log('Content script not loaded, attempting injection...');
          injectContentScript(tabId);
        } else if (response && response.status === 'loaded') {
          setContentScriptLoaded(true);
          console.log('Content script is loaded');
          
          // Check for job content
          chrome.tabs.sendMessage(tabId, { action: 'checkJobContent' }, (response) => {
            if (response && response.hasJobContent) {
              setHasJobContent(true);
            }
          });
        }
      });
    } catch (error) {
      console.error('Error checking content script status:', error);
      setContentScriptLoaded(false);
    }
  };

  const injectContentScript = async (tabId: number) => {
    try {
      // Inject the content script files
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content.js']
      });
      
      // Also inject the CSS
      await chrome.scripting.insertCSS({
        target: { tabId },
        files: ['content.css']
      });
      
      setContentScriptLoaded(true);
      setError(null);
      
      // Wait a bit for the script to initialize, then check for job content
      setTimeout(() => {
        chrome.tabs.sendMessage(tabId, { action: 'checkJobContent' }, (response) => {
          if (response && response.hasJobContent) {
            setHasJobContent(true);
          }
        });
      }, 500);
      
      console.log('Content script injected successfully');
      return true;
    } catch (error) {
      console.error('Failed to inject content script:', error);
      setError(`Failed to inject content script: ${error instanceof Error ? error.message : String(error)}`);
      setContentScriptLoaded(false);
      return false;
    }
  };

  const handleExtractKeywords = async () => {
    if (!currentTab?.id) return;
    
    setIsExtractingKeywords(true);
    setKeywordResults(null);
    setError(null);
    
    try {
      // Check if content script is loaded, if not try to inject it
      if (contentScriptLoaded === false) {
        console.log('Content script not loaded, attempting to inject...');
        const injected = await injectContentScript(currentTab.id);
        if (!injected) {
          return;
        }
        // Wait a bit for the script to initialize
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Send message to content script to extract keywords
      const response = await new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(currentTab.id!, {
          action: 'extractKeywords',
          url: currentTab.url
        }, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      });
      
      console.log('Extracted keywords:', response);
      setKeywordResults(response as KeywordExtractionResult);
    } catch (error) {
      console.error('Error extracting keywords:', error);
      setKeywordResults({
        extractedText: '',
        extractedKeywords: [],
        extractionMethod: '',
        success: false,
        error: 'Failed to extract keywords from this page'
      });
    } finally {
      setIsExtractingKeywords(false);
    }
  };

  const copyKeywords = () => {
    if (keywordResults && keywordResults.extractedKeywords.length > 0) {
      navigator.clipboard.writeText(keywordResults.extractedKeywords.join(', '));
    }
  };

  const openOptions = () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL('options.html')
    });
  };

  return (
    <div className="popup-container">
      <div className="popup-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="popup-title">OpenResume</h1>
            <p className="popup-subtitle">Resume Builder Extension</p>
          </div>
          <button 
            className="settings-button"
            onClick={openOptions}
            title="Settings"
          >
            ⚙️
          </button>
        </div>
      </div>
      
      <div className="popup-content">
        <div className="current-page">
          <h3>Current Page:</h3>
          <p className="page-title">{currentTab?.title || 'Unknown'}</p>
          <p className="page-url">{currentTab?.url || 'Unknown'}</p>
          
          {contentScriptLoaded === false && (
            <div className="content-script-status">
              <span className="status-badge error">⚠️ Content script not loaded</span>
            </div>
          )}
          {contentScriptLoaded === true && (
            <div className="content-script-status">
              <span className="status-badge success">✅ Extension ready</span>
            </div>
          )}
          {contentScriptLoaded === null && (
            <div className="content-script-status">
              <span className="status-badge loading">🔄 Checking extension status...</span>
            </div>
          )}
          
          {hasJobContent && (
            <div className="job-indicator">
              <span className="job-badge">🎯 Job Posting Detected</span>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            <h4>❌ Error</h4>
            <p>{error}</p>
          </div>
        )}

        <div className="actions">
          <button 
            className="btn btn-primary"
            onClick={handleExtractKeywords}
            disabled={isExtractingKeywords}
          >
            {isExtractingKeywords ? 'Extracting Keywords...' : '🔍 Extract Keywords'}
          </button>
        </div>

        {keywordResults && (
          <div className="keyword-results">
            {keywordResults.success ? (
              <div className="keywords-success">
                <h4>✅ Keywords Extracted ({keywordResults.extractedKeywords.length})</h4>
                <div className="keywords-list">
                  {keywordResults.extractedKeywords.join(', ')}
                </div>
                <button 
                  className="btn btn-copy"
                  onClick={copyKeywords}
                >
                  📋 Copy Keywords
                </button>
                <p className="extraction-method">
                  Method: {keywordResults.extractionMethod}
                </p>
              </div>
            ) : (
              <div className="keywords-error">
                <h4>❌ Extraction Failed</h4>
                <p>{keywordResults.error}</p>
              </div>
            )}
          </div>
        )}

        <div className="help-text">
          <p>Use this extension to:</p>
          <ul>
            <li>Extract keywords from job postings</li>
            <li>Analyze page content for resume building</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Initialize popup
const container = document.getElementById('popup-root');
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
} 