(function() {
    var lastSnapshot, html, css,

        cssStringifier = new CSSStringifier(),
        shorthandPropertyFilter = new ShorthandPropertyFilter(),
        webkitPropertiesFilter = new WebkitPropertiesFilter(),
        defaultValueFilter = new DefaultValueFilter(),
        sameRulesCombiner = new SameRulesCombiner(),
        inspectedContext = new InspectedContext();

    var $hint = $('#hint'),
        $createButton = $('#create'),
        $htmlTextarea = $('#html'),
        $cssTextarea = $('#css');

    // Event listeners
    $createButton.on('click', make);
    $htmlTextarea.on('click', function() {
        $(this).select();
    });
    $cssTextarea.on('click', function() {
        $(this).select();
    });

    // Storage - get & set
    // Since we can't access localStorage from here, we need to ask background page to handle it.
    // Communication with background page is based on sendMessage/onMessage.
    function getStorage() {
        chrome.runtime.sendMessage({
            name: 'getStorage'
        }, function(storage) {
            // TODO
        });
    }

    function setStorage(data, key, value) {
        chrome.runtime.sendMessage({
            name: 'setStorage',
            data: data,
            item: key,
            value: value
        });
    }

    // processing
    function make() {
        $hint.text('please wait...');

        inspectedContext.eval("(" + Snapshooter.toString() + ")($0)", function(result) {
            try {
                lastSnapshot = JSON.parse(result);
            } catch (e) {
                $hint.text('DOM snapshot could not be created. Make sure that you have inspected some element.');
            }

            process();
        });
    }

    function process() {
        if (!lastSnapshot) {
            return;
        }

        css = lastSnapshot.css,
        html = lastSnapshot.html;

        $hint.text('processing');

        css = defaultValueFilter.process(css);
        css = shorthandPropertyFilter.process(css);
        css = webkitPropertiesFilter.process(css);
        css = sameRulesCombiner.process(css);

        html = $.htmlClean(html, {
            removeAttrs: ['class'],
            allowedAttributes: [
                ['id'],
                ['placeholder', ['input', 'textarea']],
                ['disabled', ['input', 'textarea', 'select', 'option', 'button']],
                ['value', ['input', 'button']],
                ['readonly', ['input', 'textarea', 'option']],
                ['label', ['option']],
                ['selected', ['option']],
                ['checked', ['input']]
            ],
            format: true,
            replace: [],
            replaceStyles: [],
            allowComments: true
        });

        css = cssStringifier.process(css);

        $htmlTextarea.val(html);
        $cssTextarea.val(css);

        $hint.text('document.head.innerHTML');
	    chrome.devtools.inspectedWindow.eval(
	    	'document.head.innerHTML=""',
	        // 'document.head.innerHTML = "<style>" + "' + css.replace(/"/g,"'") + '" + "</style>"',
	        function(result, isException) {
	        	$hint.text(isException);
	        }
	    );

        $hint.text('document.body.innerHTML');
	    chrome.devtools.inspectedWindow.eval(
	    	'document.body.innerHTML=""',
	        // "document.body.innerHTML = '<div>' + '" + html.replace(/'/g,'"') + "' + '</div>'",
	        function(result, isException) {
	        	$hint.text(result);
	        }
	    );

        $hint.text('done');
    }
})();