const POPUP_LOGGING_ENABLED = false;

function logPopup(...args) {
    if (!POPUP_LOGGING_ENABLED) {
        return;
    }

    console.log(...args);
}
