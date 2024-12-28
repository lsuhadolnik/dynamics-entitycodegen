/**
 * SOURCE: Steve Harrison - Stack Overflow
 * https://stackoverflow.com/a/1026087
 */
function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function escapeHTML(str) {
    if (typeof str !== "string") {
        return str;
    }

    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function escapeDoubleQuotes(str) {
    if (typeof str !== "string") {
        return str;
    }

    return str.replace(/"/g, '""');
}
