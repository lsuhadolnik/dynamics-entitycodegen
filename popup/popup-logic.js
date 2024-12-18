(() => {
    workerRequest("GetBasicAttributes");

    enableButtons();
})();

function enableButtons() {
    document.getElementById("copyCode").addEventListener(
        "click",
        () => {
            navigator.clipboard
                .writeText(entityGenState.generatedCode)
                .then(() => {
                    signalStatus("copyCode", "SUCCESS");
                })
                .catch((err) => {
                    console.error("🚨 Clipboard write failed:", err);
                    signalStatus("copyCode", "ERROR");
                });
        },
        false
    );
}

function newDataAvailable(response) {
    debugger;
    console.log("Hello! New data available");
    if (response.type === "GetBasicAttributes") {
        const { entityName, entityId, attributes } = response;

        entityGenState.entityName = entityName;
        entityGenState.entityId = entityId;
        entityGenState.attributes = attributes;

        debugger;
        render();
    }
}
