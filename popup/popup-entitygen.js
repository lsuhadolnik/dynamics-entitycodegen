const entityGenState = {
    attributes: [],
    entityName: null,
    entityId: null,

    generatedCode: null,

    format: "cs",
    onlyNonNull: false,
    hasAllFields: false,
    onlyFormFields: true, // Only render the fields which are available by default, otherwise, fetch all.
};

function render() {
    const code = generateCode();

    entityGenState.generatedCode = code;

    setCodeOutput(code);
    setTitle();
}

function generateCode() {
    // Retrieve entity logical name
    const entityName = entityGenState.entityName;
    const entityId = entityGenState.entityId;

    // Initialize the C# code template
    let csharpCode = `new Entity("${entityName}", Guid.Parse("${entityId}"))\n{\n`;

    // Loop over attributes on the form
    const attributes = entityGenState.attributes;
    for (let index = 0; index < attributes.length; index++) {
        const attribute = attributes[index];

        const fieldName = attribute.name;
        const fieldValue = attribute.value;
        const attributeType = attribute.type;

        // Skip fields with null or undefined values
        if (fieldValue !== null && fieldValue !== undefined) {
            let formattedValue;
            let comment = "";

            // Handle different field types
            switch (attributeType) {
                case "string":
                    formattedValue = `@"${fieldValue.replace(/"/g, '\\"')}"`; // Escape quotes in strings
                    break;
                case "boolean":
                    formattedValue = fieldValue ? "true" : "false";
                    break;
                case "integer":
                case "decimal":
                case "double":
                    formattedValue = fieldValue;
                    break;
                case "lookup":
                    // Handle lookup values
                    formattedValue = `new EntityReference("${fieldValue[0].entityType}", Guid.Parse("${fieldValue[0].id}"))`;
                    break;
                case "optionset":
                    // Handle OptionSet (Choice) values
                    formattedValue = `new OptionSetValue(${fieldValue})`;
                    const optionSetText = attribute.text;
                    comment = ` // ${optionSetText}`;
                    break;
                case "datetime":
                    formattedValue = `DateTime.Parse("${new Date(
                        fieldValue
                    ).toISOString()}")`;
                    break;
                case "memo":
                    formattedValue = `@"${fieldValue.replace(/"/g, '\\"')}"`;
                    break;
                default:
                    formattedValue = `"${fieldValue}"`;
            }

            // Add the field initialization to the C# code string with comma before the comment
            csharpCode += `  ["${fieldName}"] = ${formattedValue},${comment}`;

            // Remove the comma if it's the last field
            if (index === attributes.length - 1) {
                csharpCode = csharpCode.trimEnd(",");
            }

            // Add a newline after each field
            csharpCode += "\n";
        }
    }

    // Close the C# object declaration
    csharpCode += `}\n`;

    return csharpCode;
}

function setCodeOutput(code) {
    document.getElementById("codeOutput").innerHTML = code;

    hljs.highlightAll();
}

function setTitle() {
    if (entityGenState.entityName) {
        const title = capitalizeFirstLetter(entityGenState.entityName);

        document.getElementById("entityName").innerHTML = title;
    }
}
