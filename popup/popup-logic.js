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

    document.querySelectorAll(".setFormatBtn").forEach((btn) => {
        btn.addEventListener(
            "click",
            ({ target }) => {
                debugger;
                const format = target.attributes["data-format"]
                    ? target.attributes["data-format"].value
                    : target.parentElement.attributes["data-format"].value;
                entityGenState.format = format;
                render();
            },
            false
        );
    });
}

async function checkMetadata(origin) {
    // CHECK METADATA
    let metadata = await EntityMetadataCache.getMetadata(origin);
    if (!metadata) {
        // Get new data and cache
        workerRequest("GetMetadata");
    } else {
        console.log("Metadata - ", metadata);
        // Cached Data
        setEntitygenMetadata(metadata);
    }
}

function setEntitygenMetadata(metadata) {
    entityGenState.entitySetMappings = metadata.entitySetMappings;
    entityGenState.entitySetMappingsLastRefreshed = metadata.lastRefreshed;

    refreshJsonButton();
}

function newDataAvailable(response) {
    logPopup("New Data Available", response);
    if (response.type === "GetBasicAttributes") {
        const { entityName, entityId, attributes, params, origin } = response;

        if (!isValidPage(params)) {
            return;
        }

        entityGenState.entityName = entityName;
        entityGenState.entityId = entityId;
        entityGenState.attributes = attributes;

        render();

        enableButtons();
        hideWelcome();

        checkMetadata(origin);
    }

    if (response.type === "GetMetadata") {
        const metadataResponse = response;
        debugger;
        EntityMetadataCache.setMetadata(
            metadataResponse.origin, // Dynamics URL - xxx.crmXX.dynamics.com
            metadataResponse.metadata
        );
        setEntitygenMetadata(metadataResponse.metadata);
    }
}
