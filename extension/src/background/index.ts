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
  console.log('Background received message:', request.action);
  
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
  } else if (request.action === 'findChatGPTTab') {
    // Handle ChatGPT tab finding
    console.log('Searching for existing ChatGPT tabs...');
    
    chrome.tabs.query({ url: "*://chatgpt.com/*" }, (tabs) => {
      if (chrome.runtime.lastError) {
        console.error('Error finding ChatGPT tabs:', chrome.runtime.lastError);
        sendResponse({ found: false, error: chrome.runtime.lastError.message });
      } else {
        console.log('Found ChatGPT tabs:', tabs.length);
        
        if (tabs.length > 0) {
          const tab = tabs[0];
          console.log('Using ChatGPT tab:', tab.id, 'in window:', tab.windowId);
          sendResponse({ 
            found: true, 
            tabId: tab.id, 
            windowId: tab.windowId,
            url: tab.url 
          });
        } else {
          console.log('No ChatGPT tabs found');
          sendResponse({ found: false });
        }
      }
    });
    return true; // Keep message channel open for async response
  } else if (request.action === 'createChatGPTTab') {
    // Handle ChatGPT tab creation
    console.log('Creating new ChatGPT tab...');
    
    chrome.tabs.create({ 
      url: 'https://chatgpt.com', 
      active: true 
    }, (tab) => {
      if (chrome.runtime.lastError) {
        console.error('Error creating ChatGPT tab:', chrome.runtime.lastError);
        sendResponse({ 
          success: false, 
          error: chrome.runtime.lastError.message 
        });
      } else {
        console.log('Created ChatGPT tab:', tab.id, 'in window:', tab.windowId);
        if (tab.id) chatGptTabs.add(tab.id);
        
        sendResponse({ 
          success: true, 
          tabId: tab.id, 
          windowId: tab.windowId,
          url: tab.url 
        });
      }
    });
    return true; // Keep message channel open for async response
  } else if (request.action === 'focusChatGPTTab') {
    // Handle ChatGPT tab focusing
    console.log('Focusing ChatGPT tab:', request.tabId, 'in window:', request.windowId);
    
    if (request.tabId && request.windowId) {
      // First, check if the tab still exists
      chrome.tabs.get(request.tabId, (tab) => {
        if (chrome.runtime.lastError) {
          console.error('Tab no longer exists:', chrome.runtime.lastError);
          sendResponse({ 
            success: false, 
            error: 'Tab no longer exists' 
          });
        } else {
          // Tab exists, try to focus it
          chrome.tabs.update(request.tabId, { active: true }, (updatedTab) => {
            if (chrome.runtime.lastError) {
              console.error('Error updating tab:', chrome.runtime.lastError);
              sendResponse({ 
                success: false, 
                error: chrome.runtime.lastError.message 
              });
            } else {
              // Also bring the window to front
              chrome.windows.update(request.windowId, { focused: true }, (window) => {
                if (chrome.runtime.lastError) {
                  console.warn('Warning: Could not focus window:', chrome.runtime.lastError);
                  // Still consider it successful if tab was activated
                  sendResponse({ success: true });
                } else {
                  console.log('Successfully focused ChatGPT tab and window');
                  sendResponse({ success: true });
                }
              });
            }
          });
        }
      });
    } else {
      console.error('Missing tabId or windowId for focus action');
      sendResponse({ success: false, error: 'Missing tabId or windowId' });
    }
    return true; // Keep message channel open for async response
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

// Track ChatGPT tabs for better management
let chatGptTabs = new Set<number>();

chrome.tabs.onCreated.addListener((tab) => {
  if (tab.url && tab.url.includes('chatgpt.com')) {
    if (tab.id) chatGptTabs.add(tab.id);
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  chatGptTabs.delete(tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    if (changeInfo.url.includes('chatgpt.com')) {
      chatGptTabs.add(tabId);
    } else {
      chatGptTabs.delete(tabId);
    }
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

chrome.contextMenus.create({
  id: 'generateAIPrompt',
  title: 'Generate AI Analysis Prompt',
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
  } else if (info.menuItemId === 'generateAIPrompt' && tab?.id) {
    // Open popup to handle AI prompt generation
    chrome.action.openPopup();
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
  
  // Clean up ChatGPT tabs tracking
  chatGptTabs.clear();
  chrome.tabs.query({ url: "*://chatgpt.com/*" }, (tabs) => {
    tabs.forEach(tab => {
      if (tab.id) chatGptTabs.add(tab.id);
    });
  });
});

console.log('OpenResume background script loaded with enhanced ChatGPT integration'); 