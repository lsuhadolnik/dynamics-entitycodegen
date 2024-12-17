// alert("Hey! Hello from content");

function injectWorker() {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("worker.js");
    (document.head || document.documentElement).appendChild(script);
    script.onload = () => script.remove();
}

window.addEventListener("message", (event) => {
    if (event.data && event.data.EntityGeneratorResponse) {
        chrome.runtime.sendMessage(event.data);
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.EntityGeneratorRequest) {
        window.postMessage({ EntityGeneratorRequest: true }, "*");
        sendResponse({ status: "Request sent to worker" });
    }
});

injectWorker();
