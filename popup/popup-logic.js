(() => {
    // Is this even Dynamics?
    workerRequest("GetBasicAttributes");
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
    logPopup("New Data Available", response);
    if (response.type === "GetBasicAttributes") {
        const { entityName, entityId, attributes, params } = response;

        if (!isValidPage(params)) {
            return;
        }

        entityGenState.entityName = entityName;
        entityGenState.entityId = entityId;
        entityGenState.attributes = attributes;

        render();

        enableButtons();
        hideWelcome();
    }

    /*if (response.type == "GetPageURL") {
        
    }*/
}
