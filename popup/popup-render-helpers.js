/**
 * SOURCE: Steve Harrison - Stack Overflow
 * https://stackoverflow.com/a/1026087
 */
function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function isValidPage(urlParams) {
    let params = new URLSearchParams(urlParams);
    return params.get("pagetype") == "entityrecord" && params.get("id");
}

function hideWelcome() {
    document.getElementById("welcomePage").style.display = "none";
    document.getElementById("mainPage").style.display = "block";
}
