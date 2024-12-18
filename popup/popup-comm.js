/*document.getElementById("getEntity").addEventListener("click", async () => {
    workerRequest("GetBasicAttributes");
});*/

async function workerRequest(requestType) {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });

    const msg = {
        EntityGeneratorRequest: true,
        type: requestType,
    };
    console.log("[popup-comm] Sending", msg);

    chrome.tabs.sendMessage(tab.id, msg);
}

// Worker Responses
chrome.runtime.onMessage.addListener((response) => {
    console.log("[popup-comm] Receiving", response);
    if (response.EntityGeneratorResponse) {
        console.log("[popup-comm] Calling NewDataAvailable", response);
        debugger;
        newDataAvailable(response);
    }
});
