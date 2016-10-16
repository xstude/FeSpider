var util = {
    extend: function(obj1, obj2, noCast) {
        if (obj2 == null) return obj1;
        if (obj1 == null) obj1 = {};
        for (var i in obj2) {
            if (!obj2.hasOwnProperty(i)) continue;
            if (obj1.hasOwnProperty(i) && noCast) continue;
            obj1[i] = obj2[i];
        }
        return obj1;
    }
};

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

    var rules = styleRulesOfElement(el);
    var style = styleOfElement(el);

    console.log(rules);

    return style;
};

var styleRulesOfElement = function (el) {
    var re = CSSUtilities.getCSSRules(
        el,
        'screen',
        'selector,properties,inheritance,media,specificity,href,index',
        true
    );
    return re;
};

var styleOfElement = function (el) {
    var re = inheritedStyleOfElement(el);

    var srs = styleRulesOfElement(el);
    for(var i = 0, len = srs.length; i < len; i++) {
        var sr = srs[i];
        if(sr.inheritance > 0) continue;
        var srp = sr.properties;
        for(var j in srp) {
            if(!srp.hasOwnProperty(j) || srp[j].status !== 'active') continue;
            re[j] = srp[j].value;
        }
    }

    return re;
};

var inheritedStyleOfElement = function(el) {
    var re = {};
    var p = el.parentElement;
    if(!p) return {};
    var ps = styleOfElement(p);
    for(var i = 0, len = cssInheritedPropList.length; i < len; i++) {
        var prop = cssInheritedPropList[i];
        if(ps[prop]) {
            re[prop] = ps[prop];
        }
    }
    return re;
};

var inlineStyleOfElement = function(el) {
    var csd = el.style;  
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
    'line-height': '',
    'text-align': '',
    'text-indent': '',
    'text-decoration': '',
    'letter-spacing': '',
    'word-wrap': '',
    'word-break': '',
    'word-spacing': '',
    'white-space': '',
    'cursor': '',
    'filter': '',
    'content': '',
    'box': '',
    'transition': '',
    'transform': '',
    'animation': '',
    'list-style': ''
};

var cssInheritedPropList = [
    'azimuth',
    'border-collapse',
    'border-spacing',
    'caption-side',
    'color',
    'cursor',
    'direction',
    'elevation',
    'empty-cells',
    'font-family',
    'font-size',
    'font-style',
    'font-variant',
    'font-weight',
    'font',
    'letter-spacing',
    'line-height',
    'list-style-image',
    'list-style-position',
    'list-style-type',
    'list-style',
    'orphans',
    'pitch-range',
    'pitch',
    'quotes',
    'richness',
    'speak-header',
    'speak-numeral',
    'speak-punctuation',
    'speak',
    'speech-rate',
    'stress',
    'text-align',
    'text-indent',
    'text-transform',
    'visibility',
    'voice-family',
    'volume',
    'white-space',
    'widows',
    'word-spacing'
];

