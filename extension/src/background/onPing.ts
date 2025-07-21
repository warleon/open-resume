export const onPing = (request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
    sendResponse({ status: "success", success: true, timestamp: Date.now() });
    return true;
};