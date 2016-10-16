var feSpider = function(_el, url) {
    var el;
    if (_el instanceof Element) {
        el = _el;
    } else if (typeof _el === 'string') {
        el = document.querySelector(_el);
    } else {
        return;
    }

    var ourterHTML = el.ourterHTML;

    var css = {};

    console.log('getComputedStyle(el): ');
    console.log(getComputedStyle(el));
};

var styleOfElement = function (el) {
    var re = CSSUtilities.getCSSRules(
        el,
        'screen',
        'selector,properties,inheritance,media,specificity,href,index',
        true
    );
    console.log(re);
    return re;
};

var extendObj = function(obj1, obj2, noCast) {
    if (obj2 == null) return obj1;
    if (obj1 == null) obj1 = {};
    for (var i in obj2) {
        if (!obj2.hasOwnProperty(i)) continue;
        if (obj1.hasOwnProperty(i) && noCast) continue;
        obj1[i] = obj2[i];
    }
    return obj1;
};

var styleInCssStyleDeclaration = function(csd) {
    var re = {};
    var camel = function(s) {
        var wz = s.split('-');
        for (var i = 1, len = wz.length; i < len; i++) {
            var w = wz[i];
            if (w === '') continue;
            wz[i] = w.charAt(0).toUpperCase() + w.substr(1);
        }
        return wz.join('');
    };
    for (var j = 0; csd[j] !== ''; j++) {
        var v = csd[camel(csd[j])];
        if (v === 'initial') continue;
        re[csd[j]] = v;
    }
    return re;
};

var inlineStyleOfElement = function(el) {
    var csd = el.style;
    return styleInCssStyleDeclaration(csd);
};

var computedStyleOfElement = function(el) {
    return getComputedStyle(el); // then getPropertyValue?
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
