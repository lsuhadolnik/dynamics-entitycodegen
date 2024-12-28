function injectWorker() {
    console.log("[content] Injecting Worker..");
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("worker.js");
    (document.head || document.documentElement).appendChild(script);
    script.onload = () => script.remove();
}

// Response forwarder
window.addEventListener("message", (event) => {
    console.log("[content] Receiving to Forward", event);
    if (event.data && event.data.EntityGeneratorResponse) {
        console.log("[content] Forwarding", event);
        chrome.runtime.sendMessage(event.data);
    }
});

// Request forwarder
chrome.runtime.onMessage.addListener((message, sender) => {
    console.log("[content] Receiving to Return", message);
    if (message.EntityGeneratorRequest) {
        console.log("[content] Returning", message);
        window.postMessage(message, "*");
    }
});

injectWorker();
