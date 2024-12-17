// alert("Hey! Hello from content");

function injectWorker() {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("worker.js");
    (document.head || document.documentElement).appendChild(script);
    script.onload = () => script.remove();
}

// Response forwarder
window.addEventListener("message", (event) => {
    if (event.data && event.data.EntityGeneratorResponse) {
        chrome.runtime.sendMessage(event.data);
    }
});


// Request forwarder
chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.EntityGeneratorRequest) {
        window.postMessage({ EntityGeneratorRequest: true }, "*");
    }
});

injectWorker();
