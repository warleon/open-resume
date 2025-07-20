// Background service worker for OpenResume extension

// Handle extension installation
chrome.runtime.onInstalled.addListener((details: chrome.runtime.InstalledDetails) => {
  console.log('OpenResume extension installed:', details.reason);
  
  // Set default settings
  chrome.storage.sync.set({
    autoExtract: true,
    showNotifications: true,
    defaultTemplate: 'modern',
    apiEndpoint: 'https://www.open-resume.com'
  });
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
  if (request.action === 'resumeContentFound') {
    // Show notification if enabled
    chrome.storage.sync.get({ showNotifications: true }, (result: any) => {
      if (result.showNotifications) {
        // Notification would require icon - temporarily disabled
        console.log('Resume content detected on this page!');
      }
    });
  }
  
  return true;
});

// Handle tab updates to check for resume content
chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if the page might contain resume content
    const resumeSites = [
      'linkedin.com',
      'indeed.com',
      'glassdoor.com',
      'monster.com',
      'ziprecruiter.com',
      'careerbuilder.com'
    ];
    
    const isResumeSite = resumeSites.some(site => tab.url!.includes(site));
    
    if (isResumeSite) {
      // Inject content script if not already injected
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: () => {
          // Check if content script is already loaded
          if (!(window as any).openResumeExtensionLoaded) {
            console.log('Injecting OpenResume content script');
            (window as any).openResumeExtensionLoaded = true;
          }
        }
      });
    }
  }
});

// Handle browser action click (popup)
chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
  // This is handled by the popup, but we can add additional logic here if needed
  console.log('Extension icon clicked for tab:', tab.id);
});

// Context menu integration
chrome.contextMenus.create({
  id: 'extractResumeData',
  title: 'Extract Resume Data',
  contexts: ['page', 'selection']
});

chrome.contextMenus.onClicked.addListener((info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
  if (info.menuItemId === 'extractResumeData' && tab?.id) {
    // Send message to content script to extract data
    chrome.tabs.sendMessage(tab.id, { action: 'extractResumeData' }, (response: any) => {
      if (response) {
        // Open options page with extracted data
        chrome.tabs.create({
          url: chrome.runtime.getURL('options.html') + '?data=' + encodeURIComponent(JSON.stringify(response))
        });
      }
    });
  }
});

// Cleanup on startup
chrome.runtime.onStartup.addListener(() => {
  console.log('OpenResume extension started');
});

console.log('OpenResume background script loaded'); 