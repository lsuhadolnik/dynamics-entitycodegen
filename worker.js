// alert("Hey! Hello from WORKER");

window.addEventListener("message", (event) => {
    // console.log("[worker] Receiving", event);
    if (event.data && event.data.EntityGeneratorRequest) {
        const requestType = event.data.type;

        // console.log("[worker] Processing", requestType);

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

                const rawAttr = Xrm.Page.data.entity.attributes.get();
                for (const attr of rawAttr) {
                    const newAttr = {
                        name: attr.getName(),
                        value: processAttributeValue(attr),
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

function processAttributeValue(attr) {
    const value = attr.getValue();
    const type = attr.getAttributeType();

    if (type == "file") {
        const {
            fileName,
            fileSize,
            fileUrl,
            mimeType,
            target: {
                id: { guid },
            },
        } = value;
        return {
            fileName,
            fileSize,
            fileUrl,
            mimeType,
            id: guid,
        };
    } else if (type == "image") {
        // https://xx.crmxx.dynamics.com/Image/download.aspx
        // ?Entity=ls_iwantitall
        // &Attribute=ls_23_image
        // &Id=907291e6-efc1-ef11-b8e8-000d3adbc59e
        // &Timestamp=638710096255629165
        // &Full=true

        const {
            fileName,
            fileSize,
            fileUrl,
            mimeType,
            target: {
                id: { guid },
            },
        } = value;

        const parsedUrl = new URL(fileUrl);

        return {
            fileName,
            fileSize,
            fileUrl,
            mimeType,
            id: parsedUrl.searchParams.get("Id"),
            timestamp: parsedUrl.searchParams.get("Timestamp"),
        };
    } else if (type == "multiselectoptionset") {
        if (!value) {
            return [];
        }

        const texts = attr.getText();
        return value.map((v, i) => ({
            value: v,
            text: texts[i],
        }));
    }

    return value;
}
