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
  if (request.action === 'keywordsExtracted') {
    // Handle keyword extraction results
    console.log('Keywords extracted:', request.data);
    
    // Store the latest extraction results
    chrome.storage.local.set({
      lastKeywordExtraction: {
        url: sender.tab?.url,
        timestamp: Date.now(),
        data: request.data
      }
    });

    // Show notification if enabled
    chrome.storage.sync.get({ showNotifications: true }, (result: any) => {
      if (result.showNotifications && request.data.success) {
        console.log(`Keywords extracted: ${request.data.extractedKeywords.length} keywords found`);
      }
    });
  }
  
  return true;
});

// Handle tab updates to check for job postings and inject content script
chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Try to inject content script on all pages
    // The content script will determine if it should run keyword extraction
    injectContentScriptIfNeeded(tabId);
  }
});

// Function to inject content script if not already present
async function injectContentScriptIfNeeded(tabId: number) {
  try {
    // Check if content script is already loaded
    chrome.tabs.sendMessage(tabId, { action: 'ping' }, (response) => {
      if (chrome.runtime.lastError) {
        // Content script not loaded, inject it
        console.log('Injecting content script for tab:', tabId);
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
        }).then(() => {
          // Also inject CSS
          return chrome.scripting.insertCSS({
            target: { tabId: tabId },
            files: ['content.css']
          });
        }).then(() => {
          console.log('Content script and CSS injected successfully for tab:', tabId);
        }).catch((error) => {
          console.error('Failed to inject content script for tab:', tabId, error);
        });
      } else {
        console.log('Content script already loaded for tab:', tabId);
      }
    });
  } catch (error) {
    console.error('Error checking/injecting content script for tab:', tabId, error);
  }
}

// Handle extension icon click
chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
  console.log('Extension icon clicked for tab:', tab.id);
  
  // Ensure content script is loaded when popup is opened
  if (tab.id) {
    injectContentScriptIfNeeded(tab.id);
  }
});

// Context menu integration
chrome.contextMenus.create({
  id: 'extractKeywords',
  title: 'Extract Keywords from Job Posting',
  contexts: ['page']
});

chrome.contextMenus.onClicked.addListener((info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
  if (info.menuItemId === 'extractKeywords' && tab?.id) {
    // Ensure content script is loaded first
    chrome.tabs.sendMessage(tab.id, { action: 'ping' }, (response) => {
      if (chrome.runtime.lastError) {
        // Inject content script first
        chrome.scripting.executeScript({
          target: { tabId: tab.id! },
          files: ['content.js']
        }).then(() => {
          return chrome.scripting.insertCSS({
            target: { tabId: tab.id! },
            files: ['content.css']
          });
        }).then(() => {
          // Wait a bit then send extract message
          setTimeout(() => {
            chrome.tabs.sendMessage(tab.id!, { action: 'extractKeywords', url: tab.url }, (response: any) => {
              if (response && response.success) {
                // Store results and show notification
                chrome.storage.local.set({
                  lastKeywordExtraction: {
                    url: tab.url,
                    timestamp: Date.now(),
                    data: response
                  }
                });
                console.log('Keywords extracted via context menu:', response.extractedKeywords.length, 'keywords');
              }
            });
          }, 1000);
        }).catch((error) => {
          console.error('Failed to inject content script for context menu:', error);
        });
      } else {
        // Content script already loaded
        chrome.tabs.sendMessage(tab.id!, { action: 'extractKeywords', url: tab.url }, (response: any) => {
          if (response && response.success) {
            // Store results and show notification
            chrome.storage.local.set({
              lastKeywordExtraction: {
                url: tab.url,
                timestamp: Date.now(),
                data: response
              }
            });
            console.log('Keywords extracted via context menu:', response.extractedKeywords.length, 'keywords');
          }
        });
      }
    });
  }
});

// Clean up old keyword extraction data periodically
chrome.alarms.create('cleanupKeywords', { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cleanupKeywords') {
    chrome.storage.local.get(['lastKeywordExtraction'], (result) => {
      if (result.lastKeywordExtraction) {
        const dayAgo = Date.now() - (24 * 60 * 60 * 1000);
        if (result.lastKeywordExtraction.timestamp < dayAgo) {
          chrome.storage.local.remove(['lastKeywordExtraction']);
          console.log('Cleaned up old keyword extraction data');
        }
      }
    });
  }
});

// Cleanup on startup
chrome.runtime.onStartup.addListener(() => {
  console.log('OpenResume extension started');
});

console.log('OpenResume background script loaded with keyword extraction support'); 