document.getElementById("getEntity").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });
    chrome.tabs.sendMessage(tab.id, { EntityGeneratorRequest: true });
});

async function workerRequest(requestType) {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });
    chrome.tabs.sendMessage(tab.id, {
        EntityGeneratorRequest: true,
        type: requestType,
    });
}

// Worker Responses
chrome.runtime.onMessage.addListener((response) => {
    if (response.EntityGeneratorResponse) {
        newDataAvailable(response);
    }
});
