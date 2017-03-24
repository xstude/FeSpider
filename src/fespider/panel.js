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

backgroundPageConnection.onMessage.addListener(function (message) {
    // Handle responses from the background page, if any
});

// Relay the tab ID to the background page
chrome.runtime.sendMessage({
    tabId: chrome.devtools.inspectedWindow.tabId,
    scriptToInject: 'FeSpider.js'
});