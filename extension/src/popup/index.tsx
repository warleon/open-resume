import React from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css';

interface PopupProps {}

const Popup: React.FC<PopupProps> = () => {
  const [currentTab, setCurrentTab] = React.useState<chrome.tabs.Tab | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  React.useEffect(() => {
    // Get current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        setCurrentTab(tabs[0]);
      }
    });
  }, []);

  const handleExtractResume = async () => {
    if (!currentTab?.id) return;
    
    setIsAnalyzing(true);
    
    try {
      // Send message to content script to extract resume data
      const response = await chrome.tabs.sendMessage(currentTab.id, {
        action: 'extractResumeData'
      });
      
      console.log('Extracted resume data:', response);
      
      // Here you could open the main OpenResume app with the extracted data
      chrome.tabs.create({
        url: chrome.runtime.getURL('options.html') + '?data=' + encodeURIComponent(JSON.stringify(response))
      });
    } catch (error) {
      console.error('Error extracting resume:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const openOpenResume = () => {
    chrome.tabs.create({
      url: 'https://www.open-resume.com'
    });
  };

  const openOptions = () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL('options.html')
    });
  };

  return (
    <div className="popup-container">
      <div className="popup-header">
        <h1 className="popup-title">OpenResume</h1>
        <p className="popup-subtitle">Resume Builder Extension</p>
      </div>
      
      <div className="popup-content">
        <div className="current-page">
          <h3>Current Page:</h3>
          <p className="page-title">{currentTab?.title || 'Unknown'}</p>
          <p className="page-url">{currentTab?.url || 'Unknown'}</p>
        </div>

        <div className="actions">
          <button 
            className="btn btn-primary"
            onClick={handleExtractResume}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Extract Resume Data'}
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={openOpenResume}
          >
            Open OpenResume
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={openOptions}
          >
            Settings
          </button>
        </div>

        <div className="help-text">
          <p>Use this extension to:</p>
          <ul>
            <li>Extract resume data from job sites</li>
            <li>Quick access to OpenResume</li>
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