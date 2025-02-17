/**
 * SOURCE: Steve Harrison - Stack Overflow
 * https://stackoverflow.com/a/1026087
 */
function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function refreshJsonButton() {
    const jsonBtn = document.getElementById("json-loading-btn");
    const text = jsonBtn.querySelector(".spinnerText");
    const spinner = jsonBtn.querySelector(".spinner");

    if (entityGenState.entitySetMappings) {
        spinner.hidden = true;
        text.classList.remove("disabledText");
        jsonBtn.disabled = false;
    } else {
        spinner.hidden = false;
        text.classList.add("disabledText");
        jsonBtn.disabled = true;
    }
}

function escapeHTML(str, backslashQuote) {
    if (typeof str !== "string") {
        return str;
    }

    const quoteReplace = backslashQuote ? "&#92;&quot;" : "&quot;";

    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, quoteReplace)
        .replace(/'/g, "&#39;");
}

function escapeDoubleQuotes(str) {
    if (typeof str !== "string") {
        return str;
    }

    return str.replace(/"/g, '""');
}

function escapeQuoteBackslash(str) {
    if (typeof str !== "string") {
        return str;
    }

    return str.replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function removeCurlyBraces(guid) {
    return guid.replace("{", "").replace("}", "");
}

function isValidPage(urlParams) {
    let params = new URLSearchParams(urlParams);
    return params.get("pagetype") == "entityrecord" && params.get("id");
}

function hideWelcome() {
    document.getElementById("welcomePage").style.display = "none";
    document.getElementById("mainPage").style.display = "block";
}
