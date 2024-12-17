document.getElementById("getEntity").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });
    chrome.tabs.sendMessage(
        tab.id,
        { EntityGeneratorRequest: true }
    );
});

async function init() {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });
    chrome.tabs.sendMessage(
        tab.id,
        { EntityGeneratorRequest: true }
    );
}

chrome.runtime.onMessage.addListener((response, sender, sendResponse) => {
    debugger;
    if (response.EntityGeneratorResponse) {
        if (response && response.entityName) {
            document.getElementById(
                "output"
            ).textContent = `Entity: ${response.entityName}`;
        } else {
            document.getElementById("output").textContent =
                "No entity found or error occurred.";
        }
    }
});

init();
