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
                response.origin = document.location.host; // Dynamics URL
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

        if (requestType == "GetMetadata") {
            const host = document.location.host;
            const url = `https://${host}/api/data/v9.2/$metadata`; // I'm sorry.

            getMetadataAndPost();
            return;
        }

        if (requestType == "GetAllFieldsAndPost") {
        }

        console.log("[worker] Posting", response);
        window.postMessage(response, "*");
    }
});

async function getMetadataAndPost() {
    const baseUrl = window.location.host;
    const url = `https://${baseUrl}/api/data/v9.2/$metadata`;

    const fatCow = await fetch(url);
    const text = await fatCow.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "application/xml");

    const metadata = xmlToJson(xmlDoc);

    const entitySetMappings = extractEntitySetMappings(metadata);

    const response = {
        EntityGeneratorResponse: true,
        type: "GetMetadata",
        // metadata, -> No need for the whole metadata
        metadata: {
            entitySetMappings,
            lastRefreshed: new Date(),
        },
        origin: baseUrl,
    };

    window.postMessage(response, "*");
}

function extractEntitySetMappings(metadata) {
    return Object.fromEntries(
        metadata["edmx:Edmx"][
            "edmx:DataServices"
        ].Schema.EntityContainer.EntitySet.map((s) => [
            s["@attributes"].EntityType.replace("Microsoft.Dynamics.CRM.", ""),
            s["@attributes"].Name,
        ])
    );
}

function xmlToJson(xml) {
    // Create the return object
    let obj = {};

    // If the node has attributes, add them to the object
    if (xml.nodeType === 1) {
        // Process attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (let i = 0; i < xml.attributes.length; i++) {
                const attribute = xml.attributes.item(i);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType === 3) {
        // Text node
        obj = xml.nodeValue;
    }

    // Recurse for each child node
    if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i++) {
            const item = xml.childNodes.item(i);
            const nodeName = item.nodeName;

            if (typeof obj[nodeName] === "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (
                    typeof obj[nodeName] === "object" &&
                    !Array.isArray(obj[nodeName])
                ) {
                    obj[nodeName] = [obj[nodeName]];
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }

    return obj;
}

function processAttributeValue(attr) {
    const value = attr.getValue();
    const type = attr.getAttributeType();

    if (type == "file" && value) {
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
    } else if (type == "image" && value) {
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
