// alert("Hey! Hello from WORKER");

window.addEventListener("message", (event) => {
    console.log("[worker] Receiving", event);
    if (event.data && event.data.EntityGeneratorRequest) {
        const requestType = event.data.type;

        console.log("[worker] Processing", requestType);

        const response = {
            EntityGeneratorResponse: true,
            type: requestType,
        };

        if (requestType == "GetBasicAttributes") {
            response.params = document.location.search;
            response.url = document.location.href;

            try {
                response.entityName = Xrm.Page.data.entity.getEntityName();
                response.entityId = Xrm.Page.data.entity.getId();

                response.attributes = [];

                // debugger;
                const rawAttr = Xrm.Page.data.entity.attributes.get();
                for (const attr of rawAttr) {
                    const newAttr = {
                        name: attr.getName(),
                        value: attr.getValue(),
                        type: attr.getAttributeType(),
                    };

                    if (attr.getText) {
                        newAttr.text = attr.getText(); // Useful for OptionSets
                    }

                    response.attributes.push(newAttr);
                }
            } catch (e) {
                console.log("[worker] Exception :(", e);
            }
        }

        if (requestType == "GetPageURL") {
            response.params = document.location.search;
            response.url = document.location.href;
        }

        console.log("[worker] Posting", response);
        window.postMessage(response, "*");
    }
});
