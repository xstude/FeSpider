// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {

    // chrome.tabs.executeScript(null, { file: "Selector.js" });
    // chrome.tabs.executeScript(null, { file: "CSSUtilities.js" });
    // chrome.tabs.executeScript(null, { file: "fespider.js" });

    chrome.tabs.executeScript({
        code: 'document.getElementById("123123123").click();'
    });
});
