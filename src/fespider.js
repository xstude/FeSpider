var feSpider = function (_el, url) {
    var el;
    if(_el instanceof Element) {
        el = _el;
    } else if(typeof _el === 'string') {
        el = document.querySelector(_el);
    } else {
        return;
    }
    var ourterHTML = el.ourterHTML;
    console.log(inlineStyleOfElement(el));
    console.log(cssStyleOfElement(el));
};

var extendObj = function (obj1, obj2, noCast) {
    if(obj1 == null) obj1 = {};
    if(obj2 == null) return obj1;
    for(var i in obj2) {
        if(!obj2.hasOwnProperty(i)) continue;
        if(obj1.hasOwnProperty(i) && noCast) continue;
        obj1[i] = obj2[i];
    }
    return obj1;
};

var cssStyleOfElement = function (el, rules) {
    var re = {};
    if(rules == null) rules = styleSheetRules();
    for(var i = 0, len = rules.length; i < len; i++) {
        var sel = rules[i].selectorText;
        if(!el.matches(sel)) continue;
        extendObj(re, styleInCssStyleDeclaration(rules[i].style));
    }
    return re;
};

var styleInCssStyleDeclaration = function (csd) {
    var re = {};
    var camel = function (s) {
        var wz = s.split('-');
        for(var i = 1, len = wz.length; i < len; i++) {
            var w = wz[i];
            if(w === '') continue;
            wz[i] = w.charAt(0).toUpperCase() + w.substr(1);
        }
        return wz.join('');
    };
    for(var j = 0; csd[j] !== ''; j++) {
        re[csd[j]] = csd[camel(csd[j])];
    }
    return re;
};

var styleSheetRules = function (doc) {
    var doc = doc || document;
    var sss = doc.styleSheets;
    var re = [];
    for(var i = 0, len = sss.length; i < len; i++) {
        var sr = sss[i].rules;
        for(var i = 0, len = sr.length; i < len; i++) {
            re.push(sr[i]);
        }
    }
    return re;
};

var inlineStyleOfElement = function (el) {
    var csd = el.style;
    return styleInCssStyleDeclaration(csd);
};

var computedStyleOfElement = function (el) {
    return getComputedStyle(el); // then getPropertyValue
};

var cssPropList = {
    'display': '',
    'position': '',
    'float': '',
    'clear': '',
    'z-index': '',
    'top': '',
    'right': '',
    'bottom': '',
    'left': '',
    'width': '',
    'height': '',
    'min-width': '',
    'min-height': '',
    'max-width': '',
    'max-height': '',
    'padding': '',
    'border': '',
    'margin': '',
    'zoom': '',
    'visibility': '',
    'opacity': '',
    'overflow': '',
    'color': '',
    'background': '',
    'align': '',
    'vertical-align': '',
    'font': '',
    'text-align': '',
    'text-indent': '',
    'text-decoration': '',
    'letter-spacing': '',
    'white-space': '',
    'word-wrap': '',
    'word-break': '',
    'word-spacing': '',
    'cursor': '',
    'filter': '',
    'content': '',
    'box': '',
    'transition': '',
    'transform': '',
    'animation': ''
};