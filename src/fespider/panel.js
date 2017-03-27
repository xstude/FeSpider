var $ = function (id) {
    return document.getElementById(id);
};

var getConf = function () {
    return {
        classNameUpperCase: $('classNameUpperCase').checked,
        classNameModulePrefix: $('classNameModulePrefix').checked,
        moduleName: $('moduleName').value,
        recoverUrlInAttr: $('recoverUrlInAttr').checked,
        fetchFont: $('fetchFont').checked,
        serverHost: $('serverHost').value,
        pullContent: $('pullContent').checked,
        generateType: $('generateType1').checked ? 'html' : 'vue'
    };
};

var present = function () {
    // Injected script
    chrome.devtools.inspectedWindow.eval('fespider.present($0, null, ' + JSON.stringify(getConf()) + ')', {
        useContentScriptContext: true
    });
};

document.addEventListener('DOMContentLoaded', function () {
    $('present').addEventListener('click', present);
});

// Create a connection to the background page
var backgroundPageConnection = chrome.runtime.connect({
    name: 'panel'
});

// Send a message to the background page
backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId,
    scriptToInject: 'FeSpider.js' // Content script
});

backgroundPageConnection.onMessage.addListener(function (message) {
    // Incoming message from the background page
    $('styleOutput').value = message.style;
    $('htmlOutput').value = message.html;
    
    return true;
});