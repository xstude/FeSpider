/**
 * @Author: Ke Shen <godzilla>
 * @Date:   2017-03-10 09:43:57
 * @Email:  keshen@sohu-inc.com
 * @Last modified by:   godzilla
 * @Last modified time: 2017-03-10 09:43:57
 */

(function () {

    var conf = {
        fetchFont: true,
        serverHost: 'http://127.0.0.1:3663',
        pullContent: true,
        generateType: 'html' // 'html' | 'vue'
    };

    /**
     * String Hash
     * Ref: http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
     */
    String.prototype.hashCode = function () {
        var hash = 0, i, chr;
        if (this.length === 0) return hash;
        for (i = 0; i < this.length; i++) {
            chr   = this.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };
    
    if (!String.prototype.endsWith) {
        String.prototype.endsWith = function (s) {
            if (typeof s !== 'string') return false;
            if (s.length > this.length) return false;
            return (this.substr(this.length - s.length) === s);
        };
    }
    
    var parseUrl = function (url) {
        var parser = document.createElement('a');
        parser.href = url;
        return {
            protocol: parser.protocol,
            host: parser.host,
            path: parser.pathname,
            search: parser.search,
            hash: parser.hash
        };
    };
    var recoverUrl = function (base, target) {
        if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('data:')) return target;
        base = recoverUrl(window.location.href, base);
        var b = parseUrl(base);
        if (target.startsWith('//')) return b.protocol + target;
        if (target.startsWith('/')) return b.protocol + '//' + b.host + target;
        if (b.path.endsWith('/')) return b.protocol + '//' + b.host + b.path + target;
        return b.protocol + '//' + b.host + b.path.substring(0, b.path.lastIndexOf('/')) + '/' + target;
    };
    var recoverCssUrls = function (cssText, baseUrl) {
        var replacer = function (s, p1) {
            p1 = p1.trim();
            var inner = p1;
            if ((p1.charAt(0) === "'" && p1.charAt(p1.length - 1) === "'")
                || (p1.charAt(0) === '"' && p1.charAt(p1.length - 1) === '"')) inner = p1.substr(1, p1.length - 2);
            if (inner.startsWith('data:')) return 'url(' + inner + ')';
            return 'url(\'' + recoverUrl(baseUrl, inner) + '\')';
        };
        cssText = cssText.replace(/url\s*\((.*?)\)/g, replacer);
        return cssText;
    };

    var getCssLinks = function () {
        var sheet = document.styleSheets,
            i = sheet.length;
        var re = [];
        while (0 <= --i) {
            if (sheet[i].href) {
                re.push(sheet[i].href);
            }
        }
        return re;
    };
    var getFontFaces = function () {
        var sheet = document.styleSheets,
            rule = null,
            i = sheet.length, j;
        var urlQueue = [];
        var interRules = [];
        while (0 <= --i) {
            if (sheet[i].href) {
                urlQueue.push(sheet[i].href);
            } else {
                rule = sheet[i].rules || sheet[i].cssRules || [];
                j = rule.length;
                while (0 <= --j) {
                    if (rule[j].constructor.name === 'CSSFontFaceRule') {
                        interRules.push(recoverCssUrls(rule[j].cssText, window.location.href));
                    };
                }
            }
        }
        return Promise.all(urlQueue.map(url => {
            return fetch(conf.serverHost + '/get/' + encodeURIComponent(url), {
                mode: 'cors',
                headers: {'Content-Type': 'text/plain'}
            }).then(res => {
                return res.text().then(data => {
                    var regExp = /@font-face\s*\{[^}]+}/g;
                    var results = data.match(regExp) || [];
                    return interRules.concat(results.map(result => recoverCssUrls(result, url)));
                });
            }).catch(err => {
                console.error(err);
            });
        }));
    };

    var PropertyTable = {
        'display': {},
        'zoom': {},
        'flex-direction': {},
        'flex-wrap': {},
        'flex-flow': {},
        'justify-content': {},
        'align-items': {},
        'align-content': {},
        'order': {},
        'flex-grow': {},
        'flex-shrink': {},
        'flex-basis': {},
        'flex': {},
        'align-self': {},
        'position': {},
        'z-index': {},
        'width': {
            default: 'auto'
        },
        'height': {
            default: 'auto'
        },
        'max-width': {
            ignore: function (v) {
                return v === 'auto' || v === 'none';
            }
        },
        'min-width': {
            ignore: function (v) {
                return v === 'auto' || v === 'none';
            }
        },
        'max-height': {
            ignore: function (v) {
                return v === 'auto' || v === 'none';
            }
        },
        'min-height': {
            ignore: function (v) {
                return v === 'auto' || v === 'none';
            }
        },
        'top': {
            default: 'auto'
        },
        'right': {
            default: 'auto'
        },
        'bottom': {
            default: 'auto'
        },
        'left': {
            default: 'auto'
        },
        'background': {},
        // 'background-color': {},
        // 'background-size': {},
        'margin': {
            default: '0px'
        },
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
        'outline': {
            ignore: function (v) {
                return v.indexOf('none') >= 0;
            }
        },
        'color': {
            inherit: true
        },
        'text-align': {
            inherit: true
        },
        'text-indent': {
            inherit: true
        },
        'text-overflow': {},
        'overflow-x': {},
        'overflow-y': {},
        'cursor': {
            inherit: true
        },
        'float': {},
        'clear': {},
        'font': {
            inherit: true
        },
        /*
        'font-family': {
            inherit: true
        },
        'font-size': {
            inherit: true
        },
        'font-weight': {
            inherit: true
        },
        'font-style': {
            inherit: true
        },
        'line-height': {
            inherit: true
        },
        */
        'letter-spacing': {
            inherit: true
        },
        'list-style': {
            inherit: true
        },
        'opacity': {},
        'visibility': {
            inherit: true
        },
        'text-decoration': {},
        'vertical-align': {},
        'white-space': {
            inherit: true
        },
        'word-break': {},
        'word-wrap': {},
        'content': {},
        'transform': {},
        'transition': {},
        'fill': {}
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

    var getFullStyle = function (dom, pseudo, inSvg) {
        var cs = !pseudo ? getComputedStyle(dom) : getComputedStyle(dom, ':' + pseudo);
        var ncs = (pseudo && !pseudoClassTable[pseudo].element) ? getComputedStyle(dom) 
            : getNodeDefaultCS((pseudo && pseudoClassTable[pseudo].element === 'inline') ? 'span' : dom.nodeName.toLowerCase(), inSvg);
        var re = {};
        for (var prop in PropertyTable) {
            var cprop = propNameCamelify(prop);
            if (cs[cprop] && (preventDefaultProps[dom.nodeName.toLowerCase() + ' ' + prop] || PropertyTable[prop].inherit
                || (cs[cprop] !== ncs[cprop] && (!PropertyTable[prop].ignore || !PropertyTable[prop].ignore(cs[cprop]))))) {
                re[prop] = cs[cprop];
            }
        }
        cleanComputedStyle(re);
        return re;
    };

    var pseudoClassTable = {
        'before': { element: 'inline' },
        'after': { element: 'inline' }
    };
    var getPseudoElements = function (dom, domStyle, inSvg) {
        var re = {};
        for (var p in pseudoClassTable) {
            if (pseudoClassTable[p].element) {
                var cs = getComputedStyle(dom, ':' + p);
                if (cs.content) {
                    re[p] = getFullStyle(dom, p, inSvg);
                }
            } else {
                var ps = getFullStyle(dom, p, inSvg);
                var stylePatches = {};
                var diff = false;
                for (var i in domStyle) {
                    if (domStyle[i] !== ps[i]) {
                        stylePatches[i] = ps[i];
                        diff = true;
                    }
                }
                if (diff) {
                    re[p] = stylePatches;
                    console.log('[LOG]', stylePatches);
                }
            }
        }
        if (Object.keys(re).length === 0) return null;
        return re;
    };

    var preventDefaultProps = {
        'a color': true,
        'a text-decoration': true,
        'em font': true,
        'input outline': true,
        'input border': true,
        'textarea outline': true,
        'textarea border': true,
        'button border': true
    };

    var getMetaData = function (dom) {
        var metaShow = getFullMetaData(dom);
        var originalDisplay = getComputedStyle(dom)['display'];
        dom.style.display = 'none';
        var metaHide = getFullMetaData(dom);
        dom.style.display = originalDisplay;
        var patch = function (node1, node2) {
            if (node1.style) {
                for (var p in node1.style) {
                    if (/px/.test(node1.style[p])
                        && p !== 'transform' && p != 'transition') {
                        node1.style[p] = node2.style[p];
                        if ((node1.style[p] === 'auto' && !(PropertyTable[p].default && PropertyTable[p].default !== 'auto')) || (!PropertyTable[p].inherit && PropertyTable[p].default === node1.style[p]) || node1.style[p] === undefined) {
                            delete node1.style[p];
                        }
                    }
                }
                for (var p in node2.style) {
                    if (node1.style[p] == null && node2.style[p].indexOf('auto') >= 0 
                        && PropertyTable[p].default != node2.style[p]) {
                        node1.style[p] = node2.style[p]; // this could fix the problem of margin auto 0
                    }
                }
            }
            if (node1.childNodes) {
                for (var i = 0, len = node1.childNodes.length; i < len; i++) {
                    patch(node1.childNodes[i], node2.childNodes[i]);
                }
            }
        };
        patch(metaShow, metaHide);
        return metaShow;
    };
    var getMetaData_test = function (dom) {
        var display = getComputedStyle(dom)['display'];
        dom.style.display = 'none';
        var re = getFullMetaData(dom);
        re.style.display = display;
        return re;
    };

    var reservedAttrs = {
        'a': ['href', 'target'],
        'img': ['src'],
        'input': ['placeholder']
    };
    
    // notice: some attributes would be ignored by default, see variable 'ignoreTable' of function 'getAttributes'
    var ignoredAttrs = {
        'svg': [],
        'svg/*': []
    };
    
    var getAttributes = function (dom, ignoreAttrNames, allowAttrNames, filter) {
        var re = {}, ignoreTable = {
            'id': true,
            'class': true,
            'style': true
        };
        if (allowAttrNames) {
            for (let an of allowAttrNames) {
                var av = dom.getAttribute(an);
                if (av) {
                    re[an] = filter ? filter(an, av) : av;
                }
            }
            return re;
        }
        if (ignoreAttrNames) {
            for (let an of ignoreAttrNames) ignoreTable[an] = true;
        }
        var rawAttrs = dom.attributes;
        for (var i = 0, len = rawAttrs.length; i < len; i++) {
            var an = rawAttrs[i].name;
            if (ignoreTable[an]) continue;
            var av = rawAttrs[i].value;
            re[an] = filter ? filter(an, av) : av;
        }
        
        return re;
    };
    
    var cleanAttributes = function (dom) {
        while (dom.attributes.length > 0)
            dom.removeAttribute(dom.attributes[0].name);
        return dom;
    };
    
    var getFullMetaData = function (dom, keepAttrs, inSvg) {
        var type = dom.nodeName.toLowerCase();
        inSvg = inSvg || (type === 'svg');
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
            style: getFullStyle(dom, null, inSvg)
        };
        
        if (keepAttrs) {
            meta.attrs = getAttributes(dom);
        } else if (ignoredAttrs[type]) {
            meta.attrs = getAttributes(dom, ignoredAttrs[type]);
        } else if (reservedAttrs[type]) {
            meta.attrs = getAttributes(dom, null, reservedAttrs[type], (attrName, attrValue) => {
                return (attrName === 'href' || attrName === 'src') ? recoverUrl(window.location.href, attrValue) : attrValue;
            });
        }
        
        if (ignoredAttrs[type + '/*']) {
            keepAttrs = true;
        }
        
        if (meta.attrs && Object.keys(meta.attrs).length === 0) {
            delete meta.attrs;
        }

        meta.pseudo = getPseudoElements(dom, meta.style, inSvg);
        if (!meta.pseudo) delete meta.pseudo;

        if (dom.childNodes.length) {
            meta.childNodes = [];
            dom.childNodes.forEach(function (el, i) {
                var childData = getFullMetaData(el, keepAttrs, inSvg);
                if (!childData) return true;
                if (childData.nodeName !== '#text') {
                    var dupProps = [];
                    for (var i in childData.style) {
                        if (!preventDefaultProps[childData.nodeName + ' ' + i]
                            && PropertyTable[i].inherit
                            && meta.style[i] === childData.style[i]) {
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

    var styleSheetData = {};
    var nodeTypeCount = {};
    var cssRuleValueHash2Name = {};
    var cssRuleName2ValueHash = {};
    var stringOfStyleObj = function (obj, indent) {
        indent = indent ? '\n    ' : '';
        var re = '';
        for (var p in obj) {
            re += indent + p + ':' + obj[p] + ';';
        }
        return re;
    };
    var addCssRule = function (nodeName, obj, pseudo) {
        var self = obj;
        var selfHash = stringOfStyleObj(self).hashCode();
        
        var pseudoValues = {};
        var pseudoHashes = {};
        if (pseudo) {
            for (var p in pseudo) {
                pseudoValues[p] = pseudo[p] || undefined;
                pseudoHashes[p] = pseudoValues[p] ? stringOfStyleObj(pseudoValues[p]).hashCode() : undefined;
            }
        }

        if (cssRuleValueHash2Name[selfHash]) {
            var existingNameList = cssRuleValueHash2Name[selfHash];
            for (let existingName of existingNameList) {
                var consistent = true;
                for (var p in pseudoClassTable) {
                    if (cssRuleName2ValueHash[existingName + ':' + p] !== pseudoHashes[p]) {
                        consistent = false;
                        break;
                    }
                }
                if (consistent) {
                    return existingName;
                }
            }
        }
        
        if (!nodeTypeCount[nodeName]) nodeTypeCount[nodeName] = 0;
        nodeTypeCount[nodeName]++;
        var className = nodeName.toUpperCase() + nodeTypeCount[nodeName];
        
        if (!cssRuleValueHash2Name[selfHash]) cssRuleValueHash2Name[selfHash] = [];
        cssRuleValueHash2Name[selfHash].push(className);
        for (var p in pseudoHashes) {
            if (pseudoHashes[p]) cssRuleName2ValueHash[className + ':' + p] = pseudoHashes[p];
        }
        cssRuleName2ValueHash[className] = selfHash;
        
        styleSheetData['.' + className] = self;
        for (var p in pseudoValues) {
            if (pseudoValues[p]) styleSheetData['.' + className + ':' + p] = pseudoValues[p];
        }
        
        return className;
    };

    var getHelperIframe = function (iframeSrc) {
        var iframeId = 'qwe123';
        var helperIframe;
        if (!window.frames[iframeId]) {
            helperIframe = document.createElement('iframe');
            helperIframe.id = iframeId;
            document.body.appendChild(helperIframe);
        } else {
            helperIframe = window.frames[iframeId];
        }
        if (iframeSrc) helperIframe.src = iframeSrc;
        return helperIframe;
    };

    var getNodeDefaultCS = function (nodeName, inSvg) {
        inSvg = inSvg || (nodeName === 'svg');
        var iframeIns = getHelperIframe();
        var iframeDoc = iframeIns.contentDocument;
        var iframeNodes = iframeDoc.getElementsByTagName(nodeName);
        var node;
        if (iframeNodes.length) node = iframeNodes[0];
        else {
            node = (!inSvg) ? iframeDoc.createElement(nodeName) : iframeDoc.createElementNS('http://www.w3.org/2000/svg', nodeName);
            iframeDoc.body.appendChild(node);
        }
        return getComputedStyle(node);
    };
    
    var extractCommonCssFromChildren = function (meta, className, styleData) {
        /* find all-children-share styles */
        var validChildCount = 0;
        var childrenCssStat = {};
        var allChildrenHave = {};
        meta.childNodes.forEach(function (child) {
            if (child.nodeName !== '#text') {
                validChildCount++;
                if (child.style) {
                    for (var i in child.style) {
                        var key = i + ': ' + child.style[i];
                        childrenCssStat[key] = (childrenCssStat[key] || 0) + 1;
                    }
                }
            }
        });
        if (validChildCount > 2) {
            for (var i in childrenCssStat) {
                if (childrenCssStat[i] < validChildCount) continue;
                var splitPos = i.indexOf(': ');
                allChildrenHave[i.substr(0, splitPos)] = i.substr(splitPos + 2);
            }
            if (Object.keys(allChildrenHave).length) {
                meta.childNodes.forEach(function (child) {
                    if (child.nodeName !== '#text') {
                        for (var i in allChildrenHave) {
                            delete child.style[i];
                        }
                    }
                });
                /* add the common style rule for child nodes */
                styleData['.' + className + '>*'] = allChildrenHave;
            }
        }
    };
    
    var pl_overflowCombine = function (dom, styles) {
        for (var sel in styles) {
            var s = styles[sel];
            if (s['overflow-x'] && (s['overflow-x'] === s['overflow-y'])) {
                s['overflow'] = s['overflow-x'];
                delete s['overflow-x'];
                delete s['overflow-y'];
            }
        }
    };
    var pl_borderCombile = function (dom, styles) {
        for (var sel in styles) {
            var s = styles[sel];
            if (s['border-top'] && s['border-right'] && s['border-bottom'] && s['border-left']) {
                var bt = s['border-top'];
                var br = s['border-right'];
                var bb = s['border-bottom'];
                var bl = s['border-left'];
                if (bt === br && bt === bb && bt === bl) {
                    s['border'] = bt;
                    delete s['border-top'];
                    delete s['border-right'];
                    delete s['border-bottom'];
                    delete s['border-left'];
                }
            }
        }
    };
    var plugins = [pl_overflowCombine, pl_borderCombile];
    var plugin = function (handler) {
        plugins.push(handler);
    };

    var buildDom = function (meta, inSvg) {
        if (meta.nodeName === '#text') {
            return document.createTextNode(meta.value);
        }
        inSvg = inSvg || (meta.nodeName === 'svg');
        if (inSvg) {
            var dom = document.createElementNS('http://www.w3.org/2000/svg', meta.nodeName);
        } else {
            var dom = document.createElement(meta.nodeName);
        }

        if (meta.attrs) {
            for (var k in meta.attrs) {
                dom.setAttribute(k, meta.attrs[k]);
            }
        }
        
        var className = addCssRule(meta.nodeName, meta.style, meta.pseudo);
        dom.setAttribute('class', className);

        if (meta.childNodes) {
            meta.childNodes.forEach(function (child) {
                dom.appendChild(buildDom(child, inSvg));
            });
        }

        return dom;
    };

    var extendObj = function (dest, src) {
        for (var i in src) {
            dest[i] = src[i];
        }
        return dest;
    };
    var presentDom = function (dom, moduleName, options) {
        extendObj(conf, options);
        moduleName = moduleName || 'module';
        var styleSheet = document.createElement('style');
        var ndom;
        
        var output = () => {
            var outputData = {
                name: moduleName,
                type: conf.generateType,
                style: styleSheet.innerHTML,
                html: ndom.outerHTML
            }
            console.log(outputData);
            var postData = new FormData();
            postData.append('json', JSON.stringify(outputData));
            if (conf.pullContent) {
                fetch(conf.serverHost + '/post', {
                    method: 'post',
                    mode: 'cors',
                    headers: {
                        'Accept': '*'
                    },
                    body: postData
                }).then(function (res) { return res.json(); })
                .then(function (res) {
                    if (res.code === 200) {
                        console.log('[SUCCESS] to save the content.');
                    } else {
                        console.error('[ERROR] to save the content.');
                    }
                });
            }
        };
        
        var promises = [];
        
        if (conf.fetchFont) {
            promises.push(getFontFaces().then(results => {
                styleSheet.innerHTML = results.map(result => result.join('\n')).join('\n') + '\n' + styleSheet.innerHTML;
                console.log('[SUCCESS] to get all font-face rules.');
            }).catch(() => {
                console.error('[ERROR] to get all font-face rules.');
            }));
        }
        
        var rootMeta = getMetaData(dom);
        document.head.innerHTML = '';
        cleanAttributes(document.body).innerHTML = '';
        document.head.appendChild(styleSheet);
        
        ndom = buildDom(rootMeta);
        
        PLUGINS: {
            for (let pl of plugins) {
                pl.call(null, ndom, styleSheetData);
            }
        }
        
        SET_MODULE_NAME: {
            var moduleClassNameAlready = ndom.getAttribute('class');
            var moduleClassAlone = !ndom.getElementsByClassName(moduleClassNameAlready).length;
            ndom.setAttribute('class', moduleClassAlone ? moduleName : (moduleName + ' ' + moduleClassNameAlready));
            for (var sel in styleSheetData) {
                if (!styleSheetData[sel]) {
                    delete styleSheetData[sel];
                    continue;
                }
                if (sel === '.' + moduleClassNameAlready || sel.startsWith('.' + moduleClassNameAlready + ':')
                    || sel.startsWith('.' + moduleClassNameAlready + '>')) {
                    if (moduleClassAlone) {
                        var selector = '.' + moduleName + sel.substr(1 + moduleClassNameAlready.length);
                        styleSheetData[selector] = styleSheetData[sel];
                        delete styleSheetData[sel];
                        continue;
                    } else {
                        styleSheetData['.' + moduleName + sel] = styleSheetData[sel];
                    }
                }
                styleSheetData['.' + moduleName + ' ' + sel] = styleSheetData[sel];
                delete styleSheetData[sel];
            }
        }
        
        var styles = [];
        for (var sel in styleSheetData) {
            styles.push([sel, styleSheetData[sel]]); 
        }
        styleSheet.innerHTML += styles.map(rule => rule[0] + ' {' + stringOfStyleObj(rule[1], true) + '\n}').join('\n');

        document.body.appendChild(ndom);
        
        Promise.all(promises).then(() => output());
    };

    window.fespider = {
        getMetaData: getMetaData,
        present: presentDom,
        plugin: plugin
    };

})();
