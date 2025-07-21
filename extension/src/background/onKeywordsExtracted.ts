export const onKeywordsExtracted = (request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
    chrome.storage.local.set({
        lastKeywordExtraction: {
            url: sender.tab?.url,
            timestamp: Date.now(),
            data: request.data,
        },
    }).then(() => {
        sendResponse({ status: "success", success: true, data: request.data, timestamp: Date.now() });
    });
    return true;
};