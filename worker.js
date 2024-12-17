// alert("Hey! Hello from WORKER");

window.addEventListener("message", (event) => {
    if (event.data && event.data.EntityGeneratorRequest) {
        const requestType = event.data.type;

        const response = {
            EntityGeneratorResponse: true,
        };

        if (requestType == "GetBasicAttributes") {
            response.entityName = Xrm.Page.data.entity.getEntityName();
            response.entityId = Xrm.Page.data.entity.getId();

            response.attributes = [];

            Xrm.Page.data.entity.attributes.get().forEach((attr) => {
                response.attributes.push({
                    name: attr.getName(),
                    value: attr.getValue(),
                    type: attr.getAttributeType(),
                    text: attr.getText(), // Useful for OptionSets
                });
            });
        }

        window.postMessage(response, "*");
    }
});
