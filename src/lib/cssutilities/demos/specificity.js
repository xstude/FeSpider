
//initialize with default config
//we don't actually need any of the library data
//so we can leave it in synchronous browser mode
//which in this environment will initialize almost instantaneously
CSSUtilities.init();


//save a reference to the results area
var results = document.getElementById('results');

//bind a handler to the test form for the main functionality
document.getElementById('get-specificity').onsubmit = function()
{
	//get the value from the selector textbox and trim whitespace
	var selector = this['selector'].value.replace(/^\s+|\s+$/g, '');
	
	//pass it to the get specificity method
	//with error trapping to alert any errors
	try { var specificity = CSSUtilities.getCSSSelectorSpecificity(selector); }
	catch(err)
	{
		alert('ERROR: ' + err.message);
		return false;
	}
	
	//compile the output HTML from the result, and output it
	var html = '<dl>',
		figures = [
			{ 'label':'The style attribute', 'text':'@' },
			{ 'label':'ID selectors', 'text':'#' },
			{ 'label':'Class selectors, attribute selectors and pseudo-classes', 'text':'.' },
			{ 'label':'Element-type selectors and pseudo-elements', 'text':'/>' }
			];
	for(var i=0; i<4; i++)
	{
		if(specificity[i] == 0) { continue; }

		html += '<dt>' + figures[i].label + ':</dt>'
		html += '<dd>';
		for(var j=0; j<specificity[i]; j++)
		{
			html += '<span class="group' + i + '">' + figures[i].text + '</span>';
		}
		html += '</dd>';
	}
	html += '</dl>';
	results.innerHTML = html;
	
	//don't submit the form
	return false;
};


//bind a focus handler to the selector input, to clear default class and value
document.getElementById('selector').onfocus = function()
{
	if(this.value == this.defaultValue)
	{
		this.className = this.className.replace(/ default/g, '');
		this.value = '';
	}
};

//bind a blur handler to restore default class and value when it's empty
document.getElementById('selector').onblur = function()
{
	if(this.value == '')
	{
		this.className += ' default';
		this.value = this.defaultValue;
	}
};

