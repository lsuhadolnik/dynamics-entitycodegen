function signalStatus(buttonId, status) {
    const btn = document.getElementById(buttonId);

    const prevContent = btn.innerHTML;
    if (status == "SUCCESS") {
        btn.innerHTML = "✅ Ok!";
    } else {
        btn.innerHTML = "😢 Something went wrong :(";
    }

    setTimeout(() => {
        btn.innerHTML = prevContent;
    }, 1000);
}
