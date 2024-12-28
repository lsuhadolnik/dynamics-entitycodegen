const entityGenState = {
    attributes: [],
    entityName: null,
    entityId: null,

    generatedCode: null,
    generatedCodeToRender: null,

    format: "cs",
    onlyNonNull: false,
    hasAllFields: false,
    onlyFormFields: true, // Only render the fields which are available by default, otherwise, fetch all.
};

function render() {
    entityGenState.generatedCode = generateCode(false);
    entityGenState.generatedCodeToRender = generateCode(true);

    setCodeOutput(entityGenState.generatedCodeToRender);
    setTitle();
}

function generateCode(escape) {
    if (entityGenState.format == "cs") {
        return generateCode_CS(escape);
    }

    if (entityGenState.format == "odatajson") {
        return generateCode_ODataJSON(escape);
    }
}

function setCodeOutput(code) {
    document.getElementById("codeOutput").innerHTML = code;

    hljs.highlightAll();
}

function setTitle() {
    if (entityGenState.entityName) {
        const title = entityGenState.entityName.includes("_")
            ? entityGenState.entityName
            : capitalizeFirstLetter(entityGenState.entityName);

        document.getElementById("entityName").innerHTML = title;
    }
}
