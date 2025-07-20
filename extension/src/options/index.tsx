import React from 'react';
import { createRoot } from 'react-dom/client';
import './options.css';

interface OptionsProps {}

const Options: React.FC<OptionsProps> = () => {
  const [settings, setSettings] = React.useState({
    autoExtract: true,
    showNotifications: true,
    defaultTemplate: 'modern',
    apiEndpoint: 'https://www.open-resume.com'
  });
  
  const [savedMessage, setSavedMessage] = React.useState('');

  React.useEffect(() => {
    // Load saved settings
    chrome.storage.sync.get(settings, (result: any) => {
      setSettings(result);
    });
  }, []);

  const handleSave = () => {
    chrome.storage.sync.set(settings, () => {
      setSavedMessage('Settings saved successfully!');
      setTimeout(() => setSavedMessage(''), 3000);
    });
  };

  const handleReset = () => {
    const defaultSettings = {
      autoExtract: true,
      showNotifications: true,
      defaultTemplate: 'modern',
      apiEndpoint: 'https://www.open-resume.com'
    };
    setSettings(defaultSettings);
    chrome.storage.sync.set(defaultSettings, () => {
      setSavedMessage('Settings reset to defaults!');
      setTimeout(() => setSavedMessage(''), 3000);
    });
  };

  const openMainApp = () => {
    chrome.tabs.create({
      url: settings.apiEndpoint
    });
  };

  return (
    <div className="options-container">
      <div className="options-header">
        <h1>OpenResume Extension Settings</h1>
        <p>Configure your browser extension preferences</p>
      </div>

      <div className="options-content">
        <div className="settings-section">
          <h2>General Settings</h2>
          
          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.autoExtract}
                onChange={(e) => setSettings({...settings, autoExtract: e.target.checked})}
              />
              Auto-extract resume data when visiting job sites
            </label>
            <p className="setting-description">
              Automatically analyze pages for potential resume content
            </p>
          </div>

          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.showNotifications}
                onChange={(e) => setSettings({...settings, showNotifications: e.target.checked})}
              />
              Show notifications
            </label>
            <p className="setting-description">
              Display notifications when resume data is found or actions are completed
            </p>
          </div>

          <div className="setting-item">
            <label className="setting-label">
              Default Resume Template
            </label>
            <select
              value={settings.defaultTemplate}
              onChange={(e) => setSettings({...settings, defaultTemplate: e.target.value})}
              className="setting-select"
            >
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
              <option value="minimal">Minimal</option>
              <option value="creative">Creative</option>
            </select>
            <p className="setting-description">
              Choose the default template for new resumes
            </p>
          </div>

          <div className="setting-item">
            <label className="setting-label">
              OpenResume Website URL
            </label>
            <input
              type="url"
              value={settings.apiEndpoint}
              onChange={(e) => setSettings({...settings, apiEndpoint: e.target.value})}
              className="setting-input"
              placeholder="https://www.open-resume.com"
            />
            <p className="setting-description">
              The URL of the OpenResume application
            </p>
          </div>
        </div>

        <div className="settings-section">
          <h2>Quick Actions</h2>
          
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={openMainApp}>
              Open OpenResume App
            </button>
            
            <button className="btn btn-success" onClick={handleSave}>
              Save Settings
            </button>
            
            <button className="btn btn-warning" onClick={handleReset}>
              Reset to Defaults
            </button>
          </div>

          {savedMessage && (
            <div className="save-message">
              {savedMessage}
            </div>
          )}
        </div>

        <div className="settings-section">
          <h2>About</h2>
          <div className="about-content">
            <p>
              <strong>OpenResume Extension</strong> v1.0.0
            </p>
            <p>
              A browser extension that integrates with OpenResume to help you build professional resumes.
            </p>
            <p>
              <a href="https://github.com/xitanggg/open-resume" target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Initialize options page
const container = document.getElementById('options-root');
if (container) {
  const root = createRoot(container);
  root.render(<Options />);
} 