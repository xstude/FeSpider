chrome.runtime.onMessage.addListener(function(message, sender, callback) {
    if (message.name === 'getStorage') {
        callback(localStorage);
    } else if (message.name === 'setStorage') {
        if(message.data) localStorage = message.data;
        else if(message.item) localStorage[message.item] = message.value;
    }
});