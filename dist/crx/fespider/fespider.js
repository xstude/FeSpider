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
    },
    recurse: function (el, fn) {
        fn(el);
        for(var i = 0, len = el.children.length; i < len; i++) {
            this.recurse(el.children[i], fn);
        }
    }
};

var feSpider = function(_el, url) {
    var el = _el;

    var rules = styleRulesOfElement(el);
    var style = styleOfElement(el);

    // console.log(rules);
    // console.log(style);

    el.setAttribute('_style', JSON.stringify(style));
    for(var i = 0, len = el.children.length; i < len; i++) {
        util.recurse(el.children[i], function (e) {
            e.setAttribute('_style', JSON.stringify(uninheritedStyleOfElement(e)));
        });
    }

    var newEl = iframer(el.outerHTML);

    var outerHTML = newEl.outerHTML;

    console.log(outerHTML);

    document.head.innerHTML = '';
    document.body.innerHTML = outerHTML;

    return style;
};

var iframer = function (html) {
    var iframe = document.createElement('iframe');
    iframe.setAttribute('frameBorder', '0');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('allowTransparency', 'true');
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.zoom = '1';
    iframe.style.zIndex = '2147483647';
    iframe.style.minHeight = '0';
    iframe.style.background = 'none';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    iframe.contentDocument.body.innerHTML = html;

    var el = iframe.contentDocument.body.children[0];

    util.recurse(el, function (e) {
        assignStyle(e, JSON.parse(e.getAttribute('_style')));
    });

    return el;
};

var assignStyle = function (el, obj) {
    el.style.cssText = '';
    for(var i in obj) {
        if(!obj.hasOwnProperty(i)) continue;
        el.style.setProperty(i, obj[i].replace(' !important', ''));
    }
    el.removeAttribute('id');
    el.removeAttribute('class');
    el.removeAttribute('_style');
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

var styleOfElement = function (el, noinherance) {
    var re = noinherance ? {} : inheritedStyleOfElement(el);

    var srs = styleRulesOfElement(el);
    for(var i = 0, len = srs.length; i < len; i++) {
        var sr = srs[i];
        if(sr.inheritance.length > 0) continue;
        var srp = sr.properties;
        for(var j in srp) {
            if(!srp.hasOwnProperty(j) || srp[j].status !== 'active') continue;
            re[j] = srp[j].value;
        }
    }

    return re;
};

var uninheritedStyleOfElement = function(el) {
    return styleOfElement(el, true);
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
