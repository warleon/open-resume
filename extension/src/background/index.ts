// Background service worker for OpenResume extension
import { env } from "@lib/env";
import { EXTRACT_KEYWORDS_ACTION, KEYWORDS_EXTRACTED_ACTION, PING_ACTION } from "./actions";
import { onPing } from "./onPing";
import { onKeywordsExtracted } from "./onKeywordsExtracted";

// Handle extension installation
chrome.runtime.onInstalled.addListener(
  (details: chrome.runtime.InstalledDetails) => {
    console.log("OpenResume extension installed:", details.reason);

    // Set default settings
    chrome.storage.sync.set({
      autoExtract: true,
      showNotifications: true,
      defaultTemplate: "modern",
      apiEndpoint: env.PUBLIC_URL,
    });
  }
);
const onMessageHandler = (
  request: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  switch (request.action) {
    case PING_ACTION:
      return onPing(request, sender, sendResponse);
    case KEYWORDS_EXTRACTED_ACTION:
      return onKeywordsExtracted(request, sender, sendResponse);
    default:
      return false;
  }
};

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener(onMessageHandler);
chrome.runtime.onMessageExternal.addListener(onMessageHandler);

// Handle tab updates to check for job postings and inject content script
chrome.tabs.onUpdated.addListener(
  (
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
  ) => {
    if (changeInfo.status === "complete" && tab.url) {
      // Try to inject content script on all pages
      // The content script will determine if it should run keyword extraction
      injectContentScriptIfNeeded(tabId);
    }
  }
);

// Function to inject content script if not already present
async function injectContentScriptIfNeeded(tabId: number) {
  try {
    // Check if content script is already loaded
    chrome.tabs.sendMessage(tabId, { action: PING_ACTION }, (response) => {
      if (chrome.runtime.lastError) {
        //create a script tag to inject, then set a variable with the id in that script
        let idScript = document.createElement("script");
        idScript.setAttribute("type", "application/javascript");
        idScript.textContent = 'var thisExtensionId = "' + chrome.runtime.id + '";';
        let parent = document.head || document.documentElement;
        parent.insertBefore(idScript, parent.firstChild);
        // Content script not loaded, inject it
        chrome.scripting
          .executeScript({
            target: { tabId: tabId },
            files: ["content.js"],
          })
          .then(() => {
            // Also inject CSS
            return chrome.scripting.insertCSS({
              target: { tabId: tabId },
              files: ["content.css"],
            });
          })
          .then(() => {
            console.log(
              "Content script and CSS injected successfully for tab:",
              tabId
            );
          })
          .catch((error) => {
            console.error(
              "Failed to inject content script for tab:",
              tabId,
              error
            );
          });
      } else {
        console.log("Content script already loaded for tab:", tabId);
      }
    });
  } catch (error) {
    console.error(
      "Error checking/injecting content script for tab:",
      tabId,
      error
    );
  }
}

// Handle extension icon click
chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
  console.log("Extension icon clicked for tab:", tab.id);

  // Ensure content script is loaded when popup is opened
  if (tab.id) {
    injectContentScriptIfNeeded(tab.id);
  }
});

//// Context menu integration
//chrome.contextMenus.create({
//  id: "extractKeywords",
//  title: "Extract Keywords from Job Posting",
//  contexts: ["page"],
//});
//
//chrome.contextMenus.onClicked.addListener(
//  (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
//    if (info.menuItemId === "extractKeywords" && tab?.id) {
//      chrome.tabs.sendMessage(
//        tab.id!,
//        { action: EXTRACT_KEYWORDS_ACTION, url: tab.url },
//        (response: any) => {
//          if (response && response.success) {
//            chrome.storage.local.set({
//              lastKeywordExtraction: {
//                url: tab.url,
//                timestamp: Date.now(),
//                data: response.data,
//              },
//            });
//          }
//        }
//      );
//    }
//  });