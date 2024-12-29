function generateCode_CS(escape) {
    // Retrieve entity logical name
    const entityName = entityGenState.entityName;
    const entityId = entityGenState.entityId;

    // Initialize the C# code template
    let csharpCode = `new Entity("${entityName}", Guid.Parse("${entityId}"))\n{\n`;

    // Loop over attributes on the form
    const attributes = entityGenState.attributes;
    const lines = [];

    for (let attribute of attributes) {
        // Skip fields with null or undefined values
        if (attribute.value !== null && attribute.value !== undefined) {
            // Handle different field types
            switch (attribute.type) {
                case "string":
                    lines.push({
                        fieldName: attribute.name,
                        formattedValue: `@"${escapeDoubleQuotes(
                            attribute.value
                        )}"`, // Escape quotes in strings
                    });
                    break;
                case "boolean":
                    lines.push({
                        fieldName: attribute.name,
                        formattedValue: attribute.value ? "true" : "false",
                    });
                    break;
                case "money":
                    lines.push({
                        fieldName: attribute.name,
                        formattedValue: `new Money(${attribute.value}m)`,
                    });
                    break;
                case "decimal":
                    lines.push({
                        fieldName: attribute.name,
                        formattedValue: `${attribute.value}m`,
                    });
                    break;
                case "integer":
                case "double": // Float
                    lines.push({
                        fieldName: attribute.name,
                        formattedValue: attribute.value,
                    });
                    break;
                case "lookup":
                    // Handle lookup values
                    const ob = {
                        fieldName: attribute.name,
                        formattedValue: `new EntityReference("${attribute.value[0].entityType}", Guid.Parse("${attribute.value[0].id}"))`,
                    };
                    if (attribute.value[0].name) {
                        ob.comment = ` // ${attribute.value[0].name}`;
                    }

                    lines.push(ob);
                    break;
                case "optionset":
                    // Handle OptionSet (Choice) values
                    lines.push({
                        fieldName: attribute.name,
                        formattedValue: `new OptionSetValue(${attribute.value})`,
                        comment: ` // ${attribute.text}`,
                    });

                    break;
                case "datetime":
                    lines.push({
                        fieldName: attribute.name,
                        formattedValue: `DateTime.Parse("${new Date(
                            attribute.value
                        ).toISOString()}")`,
                    });
                    break;
                case "memo":
                    lines.push({
                        fieldName: attribute.name,
                        formattedValue: `@"${escapeDoubleQuotes(
                            attribute.value
                        )}"`,
                    });
                    break;
                case "multiselectoptionset":
                    if (!attribute.value || attribute.value.length == 0) {
                        break;
                    }
                    lines.push({
                        fieldName: attribute.name,
                        formattedValue: `new OptionSetValueCollection(
        new List<OptionSetValue>() {
${attribute.value
    .map(({ value, text }, i) => {
        const lastLine = i + 1 == attribute.value.length;
        const comma = lastLine ? "" : ",";
        return `            new OptionSetValue(${value})${comma} // ${text}`;
    })
    .join(",\n")}
        }
    )`,
                    });

                    break;
                case "file":
                    lines.push({
                        fieldName: attribute.name,
                        formattedValue: `"${attribute.value.id}"`, // The guid field
                    });
                    lines.push({
                        fieldName: `${attribute.name}_name`,
                        formattedValue: `"${attribute.value.fileName}"`, // The name field
                    });
                    break;
                case "image":
                    lines.push({
                        fieldName: `${attribute.name}_timestamp`,
                        formattedValue: `"${attribute.value.timestamp}"`, // The timestamp field
                    });
                    lines.push({
                        fieldName: `${attribute.name}id`,
                        formattedValue: `"${attribute.value.id}"`, // The guid field
                    });
                    lines.push({
                        fieldName: `${attribute.name}_url`,
                        formattedValue: `"${attribute.value.fileUrl}"`, // The URL field
                    });
                    break;
                default:
                    lines.push({
                        fieldName: attribute.name,
                        formattedValue: `"${escapeDoubleQuotes(
                            attribute.value
                        )}"`,
                    });
                    break;
            }
        }
    }

    for (let lineId = 0; lineId < lines.length; lineId++) {
        const { fieldName, formattedValue, comment } = lines[lineId];
        const lastLine = lineId + 1 == lines.length;
        const comma = lastLine ? "" : ",";

        const value = escape ? escapeHTML(formattedValue) : formattedValue;

        // Add the field initialization to the C# code string with comma before the comment
        csharpCode += `  ["${fieldName}"] = ${value}${comma}${comment || ""}\n`;
    }

    // Close the C# object declaration
    csharpCode += `}\n`;

    return csharpCode;
}
