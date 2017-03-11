/**
* @Author: Ke Shen <godzilla>
* @Date:   2017-03-10 09:43:57
* @Email:  keshen@sohu-inc.com
* @Last modified by:   godzilla
* @Last modified time: 2017-03-10 09:43:57
*/


var PropertyTable = {
    'display': {},
    'flex': {},
    'position': {},
    'z-index': {},
    'width': {},
    'height': {},
    'top': {},
    'right': {},
    'bottom': {},
    'left': {},
    'margin': {},
    // 'margin-top': {},
    // 'margin-right': {},
    // 'margin-bottom': {},
    // 'margin-left': {},
    'padding': {},
    // 'padding-top': {},
    // 'padding-right': {},
    // 'padding-bottom': {},
    // 'padding-left': {},
    'border': {
        ignore: function (v) {
            return v.indexOf('none') >= 0;
        }
    },
    'border-top': {
        ignore: function (v) {
            return v.indexOf('none') >= 0;
        }
    },
    'border-right': {
        ignore: function (v) {
            return v.indexOf('none') >= 0;
        }
    },
    'border-bottom': {
        ignore: function (v) {
            return v.indexOf('none') >= 0;
        }
    },
    'border-left': {
        ignore: function (v) {
            return v.indexOf('none') >= 0;
        }
    },
    'border-radius': {},
    'border-collapse': {
        inherit: true
    },
    'border-spacing': {
        inherit: true
    },
    'box-shadow': {},
    'box-sizing': {},
    'outline': {},
    'color': {
        inherit: true
    },
    'text-align': {
        inherit: true
    },
    'text-indent': {
        inherit: true
    },
    'overflow': {},
    'clear': {},
    'cursor': {
        inherit: true
    },
    'float': {},
    'font': {
        inherit: true
    },
    'font-family': {
        inherit: true
    },
    'font-size': {
        inherit: true
    },
    'font-weight': {
        inherit: true
    },
    'letter-spacing': {
        inherit: true
    },
    'line-height': {
        inherit: true
    },
    'list-style': {
        inherit: true
    },
    'max-width': {},
    'min-width': {},
    'max-height': {},
    'min-height': {},
    'opacity': {},
    'visibility': {
        inherit: true
    },
    'text-decoration': {},
    'transform': {},
    'transition': {},
    'vertical-align': {},
    'white-space': {
        inherit: true
    },
    'word-break': {},
    'word-wrap': {}
};

var cleanComputedStyle = function (cs) {
    if (cs['border-top'] === cs['border']) delete cs['border-top'];
    if (cs['border-right'] === cs['border']) delete cs['border-right'];
    if (cs['border-bottom'] === cs['border']) delete cs['border-bottom'];
    if (cs['border-left'] === cs['border']) delete cs['border-left'];
};

var propNameCamelify = function (name) {
    var parts = name.split('-');
    var re = parts[0] || '';
    for (var i = 1, len = parts.length; i < len; i++) {
        var p = parts[1];
        re += p.substr(0, 1).toUpperCase() + p.substr(1);
    }
    return re;
};

var getFullStyle = function (dom, pseudo) {
    var cs = getComputedStyle.apply(window, arguments);
    var ncs = getNodeDefaultCS(dom.nodeName.toLowerCase());
    var re = {};
    for (var prop in PropertyTable) {
        var cprop = propNameCamelify(prop);
        if (cs[cprop] && cs[cprop] !== ncs[cprop]
            && (!PropertyTable[prop].ignore || !PropertyTable[prop].ignore(cs[cprop]))) {
            re[prop] = cs[cprop];
        }
    }
    cleanComputedStyle(re);
    return re;
};

var getPseudoElements = function (dom) {
    var re = {};
    var beforeElemCs = getComputedStyle(dom, '::before');
    if (beforeElemCs.content) {
        re.before = getFullStyle(dom, '::before');
    }
    var afterElemCs = getComputedStyle(dom, '::after');
    if (afterElemCs.content) {
        re.after = getFullStyle(dom, '::after');
    }
    if (!re.before && !re.after) return null;
    return re;
};

var getMetaData = function (dom) {
    var type = dom.nodeName.toLowerCase();
    if (type === 'meta') return null;
    if (type === '#comment') return null;
    if (type === '#text') {
        return {
            nodeName: '#text',
            value: dom.nodeValue
        };
    }
    var meta = {
        nodeName: type,
        style: getFullStyle(dom),
        attrs: {}
    };
    switch (type) {
        case 'a':
            var href = dom.getAttribute('href');
            var target = dom.getAttribute('target');
            var title = dom.getAttribute('title');
            if (href) meta.attrs.href = href;
            if (target) meta.attrs.target = target;
            if (title) meta.attrs.title = title;
            break;
        case 'img':
            var src = dom.getAttribute('src');
            if (src) meta.attrs.src = src;
            break;
    }
    if (Object.keys(meta.attrs).length === 0) {
        delete meta.attrs;
    }

    meta.pseudo = getPseudoElements(dom);
    if (!meta.pseudo) delete meta.pseudo;

    if (dom.childNodes.length) {
        meta.childNodes = [];
        dom.childNodes.forEach(function (el, i) {
            var childData = getMetaData(el);
            if (!childData) return true;
            if (childData.nodeName !== '#text') {
                var dupProps = [];
                for (var i in childData.style) {
                    if (meta.style[i] === childData.style[i]) {
                        dupProps.push(i);
                    }
                }
                dupProps.forEach(function (p) {
                    delete childData.style[p];
                });
            }
            meta.childNodes.push(childData);
        });
    }

    return meta;
};

var addCssRule = function (selector, obj) {
    var props = [];
    for (var p in obj) {
        props.push(p + ':' + obj[p] + ';');
    }
    styleSheet.innerHTML += selector + '{' + props.join('') + '}';
};

var nodeTypeCount = {};

var helperIframe;

var getNodeDefaultCS = function (nodeName) {
    var iframeId = 'qwe123';
    if (!helperIframe) {
        helperIframe = document.createElement('iframe');
        helperIframe.id = iframeId;
        document.body.appendChild(helperIframe);
    }
    var iframeDoc = helperIframe.contentDocument;
    var iframeNodes = iframeDoc.getElementsByTagName(nodeName);
    var node;
    if (iframeNodes.length) node = iframeNodes[0];
    else {
        node = iframeDoc.createElement(nodeName);
        iframeDoc.body.appendChild(node);
    }
    return getComputedStyle(node);
};

var buildDom = function (meta) {
    if (meta.nodeName === '#text') {
        return document.createTextNode(meta.value);
    }
    var dom = document.createElement(meta.nodeName);

    if (!nodeTypeCount[meta.nodeName]) nodeTypeCount[meta.nodeName] = 1;
    dom.className = meta.nodeName.toUpperCase() + nodeTypeCount[meta.nodeName];
    nodeTypeCount[meta.nodeName]++;

    if (meta.attrs) {
        for (var k in meta.attrs) {
            dom.setAttribute(k, meta.attrs[k]);
        };
    }

    if (meta.childNodes) {
        meta.childNodes.forEach(function (child) {
            dom.appendChild(buildDom(child));
        });
    }

    addCssRule('.' + dom.className, meta.style);
    if (meta.pseudo) {
        if (meta.pseudo.before) addCssRule('.' + dom.className + '::before', meta.pseudo.before);
        if (meta.pseudo.after) addCssRule('.' + dom.className + '::after', meta.pseudo.after);
    }

    return dom;
};

var styleSheet;

var presentDom = function (dom) {
    var rootMeta = getMetaData(dom);
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    styleSheet = document.createElement('style');
    document.head.appendChild(styleSheet);

    document.body.appendChild(buildDom(rootMeta));
};
