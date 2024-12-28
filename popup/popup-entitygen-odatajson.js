function generateCode_ODataJSON(escape) {
    let lines = [];

    // Loop over attributes on the form
    const attributes = entityGenState.attributes;

    for (let attribute of attributes) {
        // Skip fields with null or undefined values
        if (attribute.value !== null && attribute.value !== undefined) {
            // Handle different field types
            switch (attribute.type) {
                case "string":
                    lines.push({
                        fieldName: attribute.name,
                        formattedValue: escapeQuoteBackslash(attribute.value), // Escape quotes in strings
                    });
                    break;
                case "boolean":
                    lines.push({
                        fieldName: attribute.name,
                        formattedValue: attribute.value ? "true" : "false",
                    });
                    break;
                case "money":
                case "decimal":
                case "integer":
                case "double": // That's all just a normal number in OData
                    lines.push({
                        fieldName: attribute.name,
                        formattedValue: attribute.value,
                    });
                    break;
                case "lookup":
                    // Handle lookup values

                    // BAD IDEA, FIX USING METADATA
                    const entityset = attribute.value[0].entityType + "s";

                    lines.push({
                        fieldName: `${attribute.name}@odata.bind`,
                        formattedValue: `/${entityset}(${removeCurlyBraces(
                            attribute.value[0].id
                        )})`,
                    });

                    lines.push({
                        fieldName: `${attribute.name}@OData.Community.Display.V1.FormattedValue`,
                        formattedValue: `"${escapeQuoteBackslash(
                            attribute.value[0].name
                        )}"`,
                    });

                    break;
                case "optionset":
                    // Handle OptionSet (Choice) values
                    lines.push({
                        fieldName: attribute.name,
                        formattedValue: attribute.value,
                        comment: ` // ${attribute.text}`,
                    });

                    break;
                case "datetime":
                    lines.push({
                        fieldName: attribute.name,
                        formattedValue: `${new Date(
                            attribute.value
                        ).toISOString()}`,
                    });
                    break;
                case "memo":
                    lines.push({
                        fieldName: attribute.name,
                        formattedValue: `${escapeQuoteBackslash(
                            attribute.value
                        )}`,
                    });
                    break;
                case "multiselectoptionset":
                    if (!attribute.value || attribute.value.length == 0) {
                        break;
                    }

                    lines.push({
                        fieldName: attribute.name,
                        formattedValue: attribute.value
                            .map((v) => v.value)
                            .join(","),
                        comment:
                            "// " +
                            attribute.value.map((v) => v.text).join(","),
                    });

                    break;
                /*case "file":
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
                    break;*/
                default:
                    lines.push({
                        fieldName: attribute.name,
                        formattedValue: `"${escapeQuoteBackslash(
                            attribute.value
                        )}"`,
                    });
                    break;
            }
        }
    }

    return JSON.stringify(
        Object.fromEntries(
            lines.map(({ fieldName, formattedValue }) => [
                fieldName,
                formattedValue,
            ])
        ),
        null,
        4
    );
}
