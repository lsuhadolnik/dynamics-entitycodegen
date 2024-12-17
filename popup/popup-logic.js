(() => {
    document.getElementById("getEntity").addEventListener(
        "click",
        () => {
            workerRequest("GetBasicAttributes");
        },
        false
    );
})();

function newDataAvailable() {}
