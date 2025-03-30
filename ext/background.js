// Initialize context menu on installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "convertSelection",
        title: "Convert with Everything Converter",
        contexts: ["selection"]
    });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "convertSelection") {
        const selectedText = info.selectionText;
        // TODO: Implement conversion logic for selected text
    }
});