export const onExtractKeywords = (request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
    sendResponse({ status: "success", success: true, data: request.data, timestamp: Date.now() });
    return true;
};