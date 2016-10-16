/*******************************************************************************
 CSS0.99.1B :: CSSUtilities 
 -------------------------------------------------------------------------------
 Copyright (c) 2010 James Edwards (brothercake)           <cake@brothercake.com>
 BSD License                           See license.txt for licensing information
 Info/Docs       http://www.brothercake.com/site/resources/scripts/cssutilities/
 -------------------------------------------------------------------------------
 Credits and thanks:
 -------------------------------------------------------------------------------
 Henrik Lindqvist    [Selector.js]              http://llamalab.com/js/selector/
 Dean Edwards        [technical help]                  http://dean.edwards.name/
 Stuart Langridge    [technical help]                  http://www.kryogenix.org/
 -------------------------------------------------------------------------------
*******************************************************************************/

function CSSUtilities() {}
(function()
{
	//-- internal self-reference constant --//
	//this is of course not a constant, it's a variable, but IE doesn't support const 
	//so we use var with the uppercase convention for values that don't change
	//this hook can also be used by the code compression routine, to declare Z=this
	//which can then go on to be replaced for instances of both THIS and this
	var THIS = this;



	//set the asynchronous ready flag to false
	this._allready = false;

	//set the supported flag to false by default 
	this.supported = false;
	
	//do some feature detection
	if(
		
		//this generally excludes pre-DOM1 browsers
		typeof document.getElementById == 'undefined'
		
		//this excludes Opera 8
		|| typeof document.styleSheets == 'undefined'
		
		//this excludes IE 5.5
		|| typeof document.nodeType == 'undefined'
	
	//exit on failure
	){ return; }
		
	//if we're still here, set the supported flag to true
	this.supported = true;
	



	
	//-- start local variable declarations --//
	//-- nb. the breaks in string values are to avoid unwanted compression --//
	
	//we need a flag to signify when initialization is in progress
	//so that we can detect and deal with overlapping asynchronous init calls
	var busyinit = false,



	
	//-- errors and warnings --//

	//-- error constants (for data log messages) --//
	ERROR_NETWORK_OR_SECURITY = 'Network Failure or Security Violation',
	ERROR_NETWORK = 'Network Failure',
	ERROR_SECURITY = 'Security Violation',
	ERROR_UNSPECIFIED = 'Unspecified Error',
	ERROR_NOT_CSS = 'Data is not CSS',
	
	//-- warning message constants (for data log messages) --//
	MESSAGE_UNKNOWN = 'unknown',
	MESSAGE_OK = 'OK',
	MESSAGE_DUPLICATE = 'Discarded Duplicate',
	MESSAGE_DISABLED = 'Stylesheet is disabled',
	MESSAGE_UNSUPPORTED_TYPE = 'Unsupported node type',

	//-- fatal error constants (for console messages) --//
	FATAL_ERROR_PREFIX = 'CSSUtilities ' + '(Fatal Error):',
	FATAL_ERROR_INVALID_MODE = FATAL_ERROR_PREFIX + ' The specified mode is not valid',
	FATAL_ERROR_INVALID_ASYNC = FATAL_ERROR_PREFIX + ' The specified async setting is not valid',
	FATAL_ERROR_NOT_DOCUMENT = FATAL_ERROR_PREFIX + ' The specified document is not a Document',
	FATAL_ERROR_NOT_ABSOLUTE_URI = FATAL_ERROR_PREFIX + ' The specified base is not an absolute URL',
	FATAL_ERROR_INVALID_WATCH = FATAL_ERROR_PREFIX + ' The specified watch setting is not valid',
	FATAL_ERROR_INVALID_ATTRS = FATAL_ERROR_PREFIX + ' The specified attributes setting is not valid',
	FATAL_ERROR_NOT_SAPI = FATAL_ERROR_PREFIX + ' The specified api settings are not valid',
	FATAL_ERROR_INVALID_SAPI = FATAL_ERROR_PREFIX + ' Your Selectors API is not returning the right data',
	FATAL_ERROR_MISSING_SAPI = FATAL_ERROR_PREFIX + ' The Selectors API is missing',
	FATAL_ERROR_NO_XHR = FATAL_ERROR_PREFIX + ' Unable to communicate with the network',
	
	//-- error message variables (for console messages) --//
	errorMessageNoElement = 'CSSUtilities.%method has an invalid Element reference or ID',
	errorMessageNoSelector = 'CSSUtilities.%method requires a valid Selector reference',
	errorMessageMultipleSelector = 'CSSUtilities.%method can only process one Selector at a time',
	errorMessageInvalidSSID = 'CSSUtilities.%method has an invalid Stylesheet ID',
	errorMessageNotAfterAPI = FATAL_ERROR_PREFIX + ' You cannot define "%var" after "api",' + ' it must be defined first',




	//-- css data constants --//
	
	//media defaults and special values
	MEDIA_ALL = 'all',
	MEDIA_SCREEN = 'screen',
	MEDIA_NONE = 'none',
	MEDIA_CURRENT = 'current',
	
	//all valid CSS media types, used as part of the view media detection
	//this list includes all standard media types from CSS2, plus the new "reader" type proposed in CSS3
	MEDIA_TYPES_LIST = 'aural,braille,embossed,handheld,print,projection,reader,screen,speech,tty,tv',
	
	//alphabetical dictionary of inheritable CSS properties
	//we only actually need the keys, so we can go typeof INHERITED_PROPS[key] != 'undefined'
	//but the values are used for dev reference, so that we know the status of each property:
	//	'2'		CSS2 properties
	//	'3'		CSS3 properties 
	//	'?'		CSS3 properties with "inheritable" marked as "yes or ?"
	//	'm'		mozilla extensions
	//	'o'		opera extensions
	//	'w'		webkit extensions
	//	'e'		explorer extensions
	//nb. this list is complete with respect to standard properties, mozilla and opera extensions;
	//but there may be inheritable webkit and explorer extensions not listed here
	//because I couldn't find a definitive list of explorer props 
	//and the apple reference doesn't say whether properties are inheritable
	INHERITED_PROPS = {
		'azimuth':						'2',
		'border-collapse':				'2',
		'border-spacing':				'2',
		'caption-side':					'2',
		'color':						'2',
		'cursor':						'2',
		'direction':					'2',
		'elevation':					'2',
		'empty-cells':					'2',
		'fit':							'3',
		'fit-position':					'3',
		'font':							'2',
		'font-family':					'2',
		'font-size':					'2',
		'font-size-adjust':				'2',
		'font-stretch':					'2',
		'font-style':					'2',
		'font-variant':					'2',
		'font-weight':					'2',
		'hanging-punctuation':			'3',
		'hyphenate-after':				'3',
		'hyphenate-before':				'3',
		'hyphenate-character':			'3',
		'hyphenate-lines':				'3',
		'hyphenate-resource':			'3',
		'hyphens':						'3',
		'image-resolution':				'3',
		'letter-spacing':				'2',
		'line-height':					'2',
		'line-stacking':				'3',
		'line-stacking-ruby':			'3',
		'line-stacking-shift':			'3',
		'line-stacking-strategy':		'3',
		'list-style':					'2',
		'list-style-image':				'2',
		'list-style-position':			'2',
		'list-style-type':				'2',
		'marquee-direction':			'3',
		'orphans':						'2',
		'overflow-style':				'3',
		'page':							'2',
		'page-break-inside':			'2',
		'pitch':						'2',
		'pitch-range':					'2',
		'presentation-level':			'3',
		'punctuation-trim':				'3',
		'quotes':						'2',
		'richness':						'2',
		'ruby-align':					'3',
		'ruby-overhang':				'3',
		'ruby-position':				'3',
		'speak':						'2',
		'speak-header':					'2',
		'speak-numeral':				'2',
		'speak-punctuation':			'2',
		'speech-rate':					'2',
		'stress':						'2',
		'text-align':					'2',
		'text-align-last':				'3',
		'text-emphasis':				'3',
		'text-height':					'3',
		'text-indent':					'2',
		'text-justify':					'3',
		'text-outline':					'3',
		'text-replace':					'?',
		'text-shadow':					'3',
		'text-transform':				'2',
		'text-wrap':					'3',
		'visibility':					'2',
		'voice-balance':				'3',
		'voice-family':					'2',
		'voice-rate':					'3',
		'voice-pitch':					'3',
		'voice-pitch-range':			'3',
		'voice-stress':					'3',
		'voice-volume':					'3',
		'volume':						'2',
		'white-space':					'2',
		'white-space-collapse':			'3',
		'widows':						'2',
		'word-break':					'3',
		'word-spacing':					'2',
		'word-wrap':					'3',
		
		//the mozilla extensions are all proprietary properties
		'-moz-force-broken-image-icon':	'm',
		'-moz-image-region':			'm',
		'-moz-stack-sizing':			'm',
		'-moz-user-input':				'm',
		'-x-system-font':				'm',
		
		//the opera extensions are all draft implementations of CSS3 properties
		'-xv-voice-balance':			'o',
		'-xv-voice-pitch':				'o',
		'-xv-voice-pitch-range':		'o',
		'-xv-voice-rate':				'o',
		'-xv-voice-stress':				'o',
		'-xv-voice-volume':				'o',
		
		//the explorer extensions are all draft implementations of CSS3 properties
		'-ms-text-align-last':			'e',
		'-ms-text-justify':				'e',
		'-ms-word-break':				'e',
		'-ms-word-wrap':				'e'
		},
	
	//lists of longhand CSS properties indexed by their defining shorthand properties
	//nb. the reason this is a group object rather than individual constants
	//is so that we can refer to the longhand property lists by the name of the shorthand property
	LONGHAND_PROPERTIES = {
		//CSS2 shorthand properties 
		'margin': 			['margin-top','margin-right','margin-bottom','margin-left'],
		'padding': 			['padding-top','padding-right','padding-bottom','padding-left'],
		'outline': 			['outline-width','outline-style','outline-color'],
		//(the "border" shorthand defines a set of further shorthands
		// so we have to break those down individually as well)
		'border': 			['border-width','border-style','border-color','border-top','border-right','border-bottom','border-left','border-top-width','border-right-width','border-bottom-width','border-left-width','border-top-style','border-right-style','border-bottom-style','border-left-style','border-top-color','border-right-color','border-bottom-color','border-left-color'],
		'border-width': 	['border-top-width','border-right-width','border-bottom-width','border-left-width'],
		'border-style': 	['border-top-style','border-right-style','border-bottom-style','border-left-style'],
		'border-color': 	['border-top-color','border-right-color','border-bottom-color','border-left-color'],
		'border-top': 		['border-top-width','border-top-style','border-top-color'],
		'border-right': 	['border-right-width','border-right-style','border-right-color'],
		'border-bottom': 	['border-bottom-width','border-bottom-style','border-bottom-color'],
		'border-left': 		['border-left-width','border-left-style','border-left-color'],
		'list-style': 		['list-style-type','list-style-image','list-style-position'],
		'font': 			['font-weight','font-style','font-variant','font-size','line-height','font-family'],
		//(the "background" shorthand defines five properties in CSS2 [the first five]
		// plus three additional properties in CSS3 [the last three])
		'background': 		['background-color','background-image','background-repeat','background-attachment','background-position','background-size','background-clip','background-origin'],
		//CSS3 shorthand properties 
		'line-stacking': 	['line-stacking-strategy','line-stacking-ruby','line-stacking-shift'],
		'column-rule': 		['column-rule-width','column-rule-style','column-rule-color'],
		'columns': 			['column-width','column-count'],
		'pause': 			['pause-before','pause-after'],
		'rest': 			['rest-before','rest-after'],
		'cue': 				['cue-before','cue-after'],
		'mark': 			['mark-before','mark-after'],
		'transition':		['transition-property','transition-duration','transition-timing-function','transition-delay'],
		'animation':		['animation-name','animation-duration','animation-timing-function','animation-delay','animation-iteration-count','animation-direction'],
		//(I hate this module, it has no place in CSS, and the draft spec doesn't even make sense)
		'target': 			['target-name','target-new','target-position']
		},
		


	
	//-- regular expression constants --//
	//-- nb. the use or omission of brackets is significant in each case --//
	//-- for match() returns and backreferences, so don't edit them carelessly! --//
	
	//replace a single pseudo-element, which we have to manually filter from some selectors
	//to avoid them being incorrectly returned by querySelectorAll
	//for simplicity we're allowing single or double-colon syntax for all of them
	//even though the spec only requires support for single-colon syntax 
	//for pseudo-elements that were defined in CSS2 (first-letter, first-line, before and after)
	//this is non-greedy because it's used to check one selector at a time, not multiple 
	//comma-delimited selectors, and a single selector is only allowed to contain one pseudo-element
	REGEX_SINGLE_PSEUDO_ELEMENT = /[:]{1,2}(?:first\-(letter|line)|before|after|selection|value|choices|repeat\-(item|index)|outside|alternate|(line\-)?marker|slot\([_a-z0-9\-\+\.\\]*\))/i,
	
	//match pseudo-elements, used as part of specificity calculation
	//I know this code is almost an exact duplication of the single pseudo-element regex
	//that we could avoid by saving the common code as a string and then using the RegExp constructor
	//but I don't like using RegExp - it behaves differently than regex literals, and leaks memory,
	//and I've done extensive testing with these ones now, it would make me too nervous to change them
	//(because I did change them, and it made me nervous, so I changed them back!)
	//anyway it's only 142 bytes, so it's not gonna break the bank to repeat it once :-P
	REGEX_PSEUDO_ELEMENTS = /([:]{1,2}(?:first\-(letter|line)|before|after|selection|value|choices|repeat\-(item|index)|outside|alternate|(line\-)?marker|slot\([_a-z0-9\-\+\.\\]*\)))/ig,
	
	//match all pseudo-classes except :not(), used as part of specificity calculation:
	//for the purposes of specificity calculation, selectors inside :not() conditions 
	//are counted irrespective of the negation, however :not() itself is not counted as a pseudo-class 
	//this will also let through some fake permutations, like "nth-letter" and "only-of-child",
	//but that doesn't really matter .. it might be fun for someone to fool with, you never know!
	REGEX_PSEUDO_CLASSES_EXCEPT_NOT = /([:](?:(link|visited|active|hover|focus|lang|root|empty|target|enabled|disabled|checked|default|valid|invalid|required|optional)|((in|out\-of)\-range)|(read\-(only|write))|(first|last|only|nth)(\-last)?\-(child|of\-type))(?:\([_a-z0-9\-\+\.\\]*\))?)/ig,
	
	//match attribute selectors (including substring-matching), used as part of specificity calculation
	REGEX_ATTR_SELECTORS = /(\[\s*[_a-z0-9-:\.\|\\]+\s*(?:[~\|\*\^\$]?=\s*[\"\'][^\"\']*[\"\'])?\s*\])/ig,
	
	//match ID selectors, used as part of specificity calculation
	REGEX_ID_SELECTORS = /(#[a-z]+[_a-z0-9-:\\]*)/ig,
	
	//match class selectors, used as part of specificity calculation
	REGEX_CLASS_SELECTORS = /(\.[_a-z]+[_a-z0-9-:\\]*)/ig,

	//an !important rule, for which we have to check an end-substring
	//so we can't get confused by a "content" property with "!important" in its text
	//which is admittedly unlikely, but entirely possible nonetheless
	IMPORTANT_RULE = /\!\s*important\s*$/i,
	


	
	//-- other data constants --//
	
	//the library version string is used as a user-agent header for ajax requests
	//abstracting it here is useful for its own sake, but also in case
	//we ever have additional future needs for this particular data
	LIBRARY_VERSION_STRING = 'CSSUtilities/.99',
	
	//shortcuts for primitive values and data types
	//these may not seem like shortcuts because they're longer than the originals
	//but they give the compressor something to hook onto, 
	//and end up making a huge difference in the long run
	//in any case, I've become quite fond of the abstraction...
	TYPE_UNDEFINED = 'undefined',
	TYPE_OBJECT = 'object',
	TYPE_STRING = 'string',
	TYPE_FUNCTION = 'function',
	TYPE_BOOLEAN = 'boolean',
	BOOLEAN_TRUE = true,
	BOOLEAN_FALSE = false,
	NULL_VALUE = null,
	
	//...and there's a few internals that benefit from it too :-)
	MODE_BROWSER = 'browser',
	MODE_AUTHOR = 'author',
	STATUS_ACTIVE = 'active',
	STATUS_CANCELLED = 'cancelled',
	STATUS_INACTIVE = 'inactive',

	//detect some browsers for a few little tweaks where feature detection isn't appropriate
	//ie. where it's not a case of, if feature a is available, 
	//it's a case of, browser x has bug y which requires specific fix z
	//the webkit condition catches generic webkit UAs such as Google Chrome 
	//and the Adobe AIR runtime; the safari definition is split like this 
	//so that it doesn't get compressed (that single space is crucial!)
	SAFARI = navigator.vendor == 'Apple Computer,' + ' Inc.',
	SAFARI3 = SAFARI && /version\/3/i.test(navigator.appVersion),
	KONQUEROR = navigator.vendor == 'KDE',
	WEBKIT = /applewebkit/i.test(navigator.userAgent),
	IEXPLORER = typeof document.uniqueID != TYPE_UNDEFINED,
	OPERA = typeof window.opera != TYPE_UNDEFINED,
	
	//timer speed for the routine that watches for stylesheets being 
	//enabled and disabled, and then re-initializes automatically
	//and also the routine that waits for the script to have initialized
	//when calling a public method using an asynchronous callback
	//nothing we do with timers needs to be super-fast, 
	//just fast enough not to keep you hanging around when something happens!
	//and since the watch timer might be running all the time
	//we don't want it to demand anything like significant CPU time
	WATCHER_SPEED_TIMER = 200,
	
	




	//-- privileged environment variables --//
	
	//what kind of rules data to collect, either "browser" centric or "author" defined
	//if you choose browser-centric then the data comes from the document.styleSheets collection, 
	//which means that what we get is subject to each browser's implementation: it only includes 
	//stuff that the browser understands, and properties will be normalized in different ways
	//for example, firefox normalizes colors to rgb, splits out background properties,
	//adds a whole bunch of default -moz properties; opera normalizes colors to hex, 
	//also splits out background properties; safari adds a bunch of -webkit properties
	//IE doesn't do much (apart from extensive capitalization, but we change that back)
	//but it does do a few bits, like splitting out margin properties
	//if you choose browser-agnostic then the data is loaded and parsed as plain text:
	//all values are returned exactly as you defined them in the stylesheet
	//with no normalization, the same spacing [except line breaks and tabs] and quote marks you used, etc.
	//and all browsers return an identical collection of rules and properties
	//irrespective of whether they actually implement those rules and properties
	//this of course means that queries may return data which doesn't actually apply to that browser
	//NOTE: in IE "author" mode, any CSS inside <style> elements has to be retrieved by making 
	//		a synchronous request for the host page itself, as the only way to get raw text 
	//		to work with rather than pre-normalized CSS; therefore the content of <style> blocks 
	//		WILL NOT be included IF those <style> blocks were JS generated, OR the host-page request fails
	//		the same thing is true for the data in style attributes in author mode, unless "attributes" is false
	//to change mode mid session, change this value through define() then call init() to re-initialize
	//the default is browser because I think that's what people will intuitively expect
	//and because author makes a bunch of http request, which may
	//slow down the overall loading speed of the page (although hopefully not too much,
	//given that all the data it's requesting will generally already be in the browser's cache,
	//except of course where this is being run on a page they're viewing for the first time anyway!)
	mode = MODE_BROWSER,
	
	//whether to get data asynchronously
	async = BOOLEAN_FALSE,

	//context document
	page = document,
	
	//base for qualifying stylesheet hrefs, can't be defined until init
	//because it refers to page, which may change between now and then
	base,
	
	//whether to watch for changes in the disabled state of stylesheets
	//and re-initialize automatically in response
	//we set this to false by default because it uses setInterval
	//and we don't want that running unecessarily, when users may not
	//even think about it and just leave it at the default setting
	watch = BOOLEAN_FALSE,
	
	//whether to include data from style attributes
	attributes = BOOLEAN_TRUE,
	
	//selectors API backup when native implementation is not available
	//we bundle Selector.js by default, or others can be used via function argument
	//null means we don't yet know whether native implementation is available
	//if it is this will be set to false, unless it's already been set to true
	//if set to true then all browsers will use the backup function
	//qsa is a reference to a wrapper for the custom backup function, if specified
	api = NULL_VALUE, qsa = NULL_VALUE, apidefined = BOOLEAN_FALSE;
		
		
		
		
	//-- public method for modifying privileged variables --//
	this.define = function(varname, value1, value2)
	{
		//validate definitions before saving their values
		//for definable values that are invalid, throw a fatal error
		//for non-definable values just silently fail
		switch(varname)
		{
			//"mode" 
			case 'mode' :
			
				//must be "author" or "browser"
				if(typeof value1 != TYPE_STRING || !/^(author|browser)$/i.test(value1))
				{
					throw(new Error(FATAL_ERROR_INVALID_MODE));
				}
				
				//save the value
				mode = value1;
				
				//if mode is now "browser" check that "watch" is not null
				if(mode == MODE_BROWSER && watch === NULL_VALUE)
				{
					throw(new Error(FATAL_ERROR_INVALID_WATCH));
				}
				
				break;
			
			//"async"
			case 'async' :
			
				//must be a boolean
				if(typeof value1 != TYPE_BOOLEAN) 
				{ 
					throw(new Error(FATAL_ERROR_INVALID_ASYNC));
				}
				
				//save the value
				async = value1;
				
				break;
			
			//"page" 
			case 'page' :
			
				//if "api" already has a user-definition, 
				//throw the error that says this must be defined first
				if(apidefined == BOOLEAN_TRUE)
				{
					throw(new Error(errorMessageNotAfterAPI.replace('%var', 'page'))); 
				}
			
				//must be a #document node
				if(typeof value1.nodeType == TYPE_UNDEFINED || value1.nodeType != 9)
				{
					throw(new Error(FATAL_ERROR_NOT_DOCUMENT));
				}
				
				//save the value
				page = value1;
				
				break;
			
			//"base" 
			case 'base' : 
			
				//if "api" already has a user-definition, 
				//throw the error that says this must be defined first
				if(apidefined == BOOLEAN_TRUE)
				{
					throw(new Error(errorMessageNotAfterAPI.replace('%var', 'base'))); 
				}
			
				//must be an absolute URI string
				if(typeof value1 != TYPE_STRING || !/^(((ht|f)tp[s]?)\:)/i.test(value1))
				{
					throw(new Error(FATAL_ERROR_NOT_ABSOLUTE_URI));
				}
				
				//save the value
				base = value1;
				
				break;
				
			//"attributes"
			case 'attributes' :
			
				//must be a boolean
				if(typeof value1 != TYPE_BOOLEAN) 
				{ 
					throw(new Error(FATAL_ERROR_INVALID_ATTRS));
				}
				
				//save the value
				attributes = value1;
				
				break;
			
			//"watch" 
			case 'watch' :
			
				//must be true or false in browser mode
				//must be true, false or null in author mode
				if(!(typeof value1 == TYPE_BOOLEAN || (mode == MODE_AUTHOR && value1 == NULL_VALUE)))
				{ 
					throw(new Error(FATAL_ERROR_INVALID_WATCH));
				}
				
				//save the value
				watch = value1;
				
				break;
				
			//"api" 
			case 'api' :
			
				//must be a boolean
				if(typeof value1 != TYPE_BOOLEAN)
				{ 
					throw(new Error(FATAL_ERROR_NOT_SAPI));
				}
				
				//and its function if specified must be a function
				if(typeof value2 != TYPE_UNDEFINED)
				{
					if(typeof value2 != TYPE_FUNCTION)
					{
						throw(new Error(FATAL_ERROR_NOT_SAPI));
					}
				}
	
				//the api property is false if we have native support, or null if we don't
				//so if this gets set to [or left as] false that means use native where supported
				//or if it gets set to true that means use the backup function for everyone
				if(value1 == BOOLEAN_FALSE)
				{
					api = typeof page.querySelectorAll == TYPE_UNDEFINED;
				}
				else 
				{
					api = BOOLEAN_TRUE;
				}
				
				//indicate that this variable has been used-defined
				//so that we can prevent the later definition of "page" or "base"
				//both of which need to have been defined first 
				//so that the custom api method can be tested in the correct context
				apidefined = BOOLEAN_TRUE;
				
				//if we have a function definition, pre-test it to make sure 
				//that it returns the correct data structure (an array or nodelist)
				//and if not throw a fatal error
				if(typeof value2 == TYPE_FUNCTION) 
				{ 
					var nodes = value2('*', page); 
					if(typeof nodes != TYPE_OBJECT || nodes == NULL_VALUE || typeof nodes.length == TYPE_UNDEFINED)
					{
						throw(new Error(FATAL_ERROR_INVALID_SAPI));
					}
	
					//save the value if we're good
					qsa = value2; 
				}

				break;
				
		}
	};
	
	
	
	
	//-- public methods --//
	
	//initialize the library to re/build/refresh the internal data cache
	this.init = function(callback)
	{
		//if initialization is already in progress, ignore this call
		//we need to do this to prevent overlapping asynchronous calls
		if(busyinit === BOOLEAN_TRUE) 
		{ 
			return; 
		}
		
		//set the busy flag to signify that initialization is in progess
		busyinit = BOOLEAN_TRUE;
		
		//clear the global ready flag 
		this._allready = BOOLEAN_FALSE;
		
		//if querySelectorAll is supported, and api has not been set to true, set it to false
		//false means we can use the native method if supported; true means use the backup for all
		api = (typeof page.querySelectorAll != TYPE_UNDEFINED && api !== BOOLEAN_TRUE) 
				? BOOLEAN_FALSE 
				: BOOLEAN_TRUE;
		
		//if base hasn't been defined, do so now
		if(base == NULL_VALUE) { base = page.location.href; }

		//detect XML (including HTML in XHTML mode)
		//opera doens't support document.xmlVersion so it has a different test
		this._isXML = (OPERA && page.documentElement.namespaceURI != NULL_VALUE)
						|| (!OPERA && (typeof page.xmlVersion != TYPE_UNDEFINED && page.xmlVersion != NULL_VALUE));
		
		//get the current page view media
		this._viewmedia = getViewMedia(); 
		
		//nullify and delete the rules data and debug stylesheets array
		//this is only pertinent when re-initialising mid-session
		//but it must be done to avoid retaining properties that are gone since last time
		this._cssRules = NULL_VALUE;
		delete this._cssRules;
		this._stylesheets = NULL_VALUE;
		delete this._stylesheets;

		//define the local callback
		function localcallback()
		{
			//clear the busy init flag
			busyinit = BOOLEAN_FALSE;
			
			//set the global ready flag
			CSSUtilities._allready = BOOLEAN_TRUE;
			
			//if callback is a function, save the reference and call it
			if(typeof callback == TYPE_FUNCTION) 
			{
				CSSUtilities.initcallback = callback;
				CSSUtilities.initcallback();
			}

			//otherwise nullify and delete any existing reference
			else
			{
				CSSUtilities.initcallback = NULL_VALUE;
				delete CSSUtilities.initcallback;
			}
		
			//***DEV
			//function dbSize(obj){function stringify(obj){var str = '';for(var i in obj){if(!obj.hasOwnProperty(i)) { continue; }if(typeof obj[i] == TYPE_STRING){str += obj[i];}else{str += stringify(obj[i]);}}return str;}return stringify(obj).length;}
			//document.title = (typeof time != TYPE_UNDEFINED ? '(' + time + 'ms) | ' : '') + 'mode=' + mode + ' | async=' + async + ' | dbsize=' + (Math.round(dbSize(THIS._cssRules) / 10) / 100) + 'KiB | ' + new Date().toUTCString();
		}
		
		//create the new cssRules and stylesheets arrays
		THIS._cssRules = [];
		THIS._stylesheets = [];
		
		//start a new ssidcounter for assigning stylesheet IDs
		THIS.ssidcounter = 0;

		//[re]create the core rules data array according to mode
		//passing in the local callback reference for its completion
		//all the other methods will work off this data so that
		//we don't have to query the stylesheets collection more than once per session
		//(unless it's dynamically changed, after which we have to re-init())
		if(mode == MODE_AUTHOR) 
		{ 
			createAuthorRulesData(localcallback); 
		}
		else 
		{ 
			createBrowserRulesData(localcallback); 
		}
	};
		
	//***DEV data object dump
	//this.dumpDataObject = function(){
	//	var str='\n\n\n'
	//		+ '--[ raw da'+'ta dump ]------------------------------------------------------------------------------\n\n'
	//		+ '';
	//	for(var i=0; i<THIS._cssRules.length; i++){str+=i+':\n';for(var j in THIS._cssRules[i]){str += '\t"' + j + '": ';if(typeof THIS._cssRules[i][j] == TYPE_STRING) { str += '"'; }str += THIS._cssRules[i][j];if(typeof THIS._cssRules[i][j] == TYPE_STRING) { str += '"'; }str += '\n';}}return str;
	//};

	//public getCSSStyleSheets returns all the stylesheets
	//that the class was able to retrieve data from
	this.getCSSStyleSheets = function()
	{
		//process the arguments to create an indexed object
		var args = processArguments(arguments, []);
		
		//process the onfinished argument, 
		//which sets it to null if undefined or not a function, for ease of reference
		args.onfinished = processOnfinishedArgument(args.onfinished);
		
		//if the script hasn't been initialized, do so now
		lateinit();
		
		//create an internal wrapper for the rest of this function
		//so that we can call it differently for callback or return
		//then wrap the whole thing in a returned call to the
		//dispatchReturn method, which abstracts that process,
		return dispatchReturn(args.onfinished, function()
		{
			//return the debug stylesheets array
			return THIS._stylesheets;

		});
	};	
	
	//public getCSSRules return all the style rules 
	//that apply to an element within a specified media
	this.getCSSRules = function()
	{
		//process the arguments to create an indexed object
		var args = processArguments(arguments, ['element','media','accept','altstates']);
		
		//process the element argument
		//this creates an element reference from an ID
		//and/or throws an error if the element us undefined, null, or not an element
		args.element = processElementArgument(args.element, 'getCSSRules');
		
		//process the media argument
		//this sets default if undefined, empty or null
		//then splits it into a trimmmed array
		args.media = processMediaArgument(args.media);
		
		//process the accept argument
		//this parameter allows us to limit how much data is retrieved
		//for the sake of efficiency, so that we only have to keep in memory 
		//- and more to the point, only have to process - 
		//the properties that are needed by the calling operation
		//the options are the same as the complete set returned by this.getCSSRules:
		//"selector", "css", "media", "owner", "href", "ssid",
		//	"properties", "specificity", "index", "inheritance", "altstate"; 
		//		or "*" to return all values
		//which is the default value if the accept argument is undefined, empty, null or "null"
		//once processed it will either be the string value "*" 
		//or an object of properties, eg. selector and css
		//this is so we can easily go typeof accept[key] against a property name
		//rather than having to test for substrings each time
		args.accept = processAcceptArgument(args.accept);
		
		//if altstates is null, make it false
		//the altstates parameter specifies whether to include selectors as being applicable
		//that apply to interactive states of the element which it isn't necessarily in at the moment
		//and which are all defined in pseudo-classes such as :visited and :hover
		if(args.altstates == NULL_VALUE) { args.altstates = BOOLEAN_FALSE; }
		
		//process the onfinished argument, 
		//which sets it to null if undefined or not a function, for ease of reference
		args.onfinished = processOnfinishedArgument(args.onfinished);
		
		//if the script hasn't been initialized, do so now
		lateinit();
		
		//create an internal wrapper for the rest of this function
		//so that we can call it differently for callback or return
		//then wrap the whole thing in a returned call to the
		//dispatchReturn method, which abstracts that process,
		return dispatchReturn(args.onfinished, function()
		{
			//get and return the rule objects for the specified media
			//passing on the accept and altstates arguments directly for processing in getCSSRules
			return getCSSRules(args.element, args.media, args.accept, args.altstates);
		
		});
	};

	//public getCSSStyleSheetRules return all the style rules 
	//that we have in the dataset, within a specified media
	//the final argument is the oncomplte callback, which is called onfinished
	//just for internal grouping of callbacks (all public methods have onfinished)
	this.getCSSStyleSheetRules = function()
	{
		//process the arguments to create an indexed object
		var args = processArguments(arguments, ['media','accept','ssid']);
		
		//process the media argument
		//this sets default if undefined, empty or null
		//then splits it into a trimmmed array
		args.media = processMediaArgument(args.media);
		
		//process the accept argument
		args.accept = processAcceptArgument(args.accept);
		
		//if accept contains "properties" but not "css"
		//we need css to get properties, so add it to the accept object
		//but then set a flag so that we know to delete it again at the end
		if(typeof args.accept.properties != TYPE_UNDEFINED && typeof args.accept.css == TYPE_UNDEFINED)
		{
			args.accept.css = '';
			var deletecss = BOOLEAN_TRUE;
		}
		
		//if the ssid argument is null, default to -1 
		//we need to check these strictly to avoid automatic type detection
		//that could could confuse false with zero
		if(args.ssid === NULL_VALUE) { args.ssid = -1; }
		
		//process the onfinished argument, 
		//which sets it to null if undefined or not a function, for ease of reference
		args.onfinished = processOnfinishedArgument(args.onfinished);
		
		//if the script hasn't been initialized, do so now
		lateinit();

		//if ssid is specified but invalid (ie. there's no stylesheet with that ssid), throw an error
		if(args.ssid !== -1 && arrayContains(this._stylesheets, args.ssid, 'ssid') == NULL_VALUE)
		{
			throw(new Error(errorMessageInvalidSSID.replace('%method', 'getCSSStyleSheetRules'))); 
		}
		
		//create an internal wrapper for the rest of this function
		//so that we can call it differently for callback or return
		//then wrap the whole thing in a returned call to the
		//dispatchReturn method, which abstracts that process,
		return dispatchReturn(args.onfinished, function()
		{
			//create a rules array
			var rules = [];
			
			//now iterate through the main rules array to build the data
			for(var i=0; i<THIS._cssRules.length; i++)
			{
				//create the object for this rule
				var cssrule = {};
				
				//if the media of this rule matches the input criteria
				if(mediaMatches(args.media, THIS._cssRules[i]))
				{
					//if the ssid argument is not -1
					//then don't include this rule if its ssid doesn't match
					//again, we use strict tests to avoid any ambiguity
					//caused by automatic type conversion
					if(args.ssid !== -1 && THIS._cssRules[i].ssid !== args.ssid) { continue; }
					
					//for each property in this member, if it's defined in accept, 
					//or accept is "*", add it to the rule object
					for(var j in THIS._cssRules[i])
					{
						if(!THIS._cssRules[i].hasOwnProperty(j)) { continue; }
						
						if(args.accept == '*' || typeof args.accept[j] != TYPE_UNDEFINED)
						{
							cssrule[j] = THIS._cssRules[i][j];
						}
					}
					
					//add the index property, if defined in accept or accept is "*"
					if(args.accept == '*' || typeof args.accept.index != TYPE_UNDEFINED)
					{
						cssrule.index = i;
					}
					
					//add this rule to the array
					rules.push(cssrule);
				}
			}
			
			//if accept is an object containing "properties", or its the string "*"
			//pass the rules array to the addSortedProperties object
			//but with a false dosort argument so that it returns all the properties equally
			//rather than identifying and marking all the cancelled and inactive ones
			if(typeof args.accept.properties != TYPE_UNDEFINED || args.accept === '*')
			{
				rules = addSortedProperties(rules, BOOLEAN_FALSE);
			}
			
			//if the deletecss flag is defined, we need to 
			//nullify and delete all the css properties
			if(typeof deletecss != TYPE_UNDEFINED)
			{
				for(var i=0; i<rules.length; i++)
				{
					rules[i].css = NULL_VALUE;
					delete rules[i].css;
				}
			}
			
			//return the final rules array
			return rules;
		
		});
	};
	
	//public getCSSProperties method returns all the style properties 
	//that are  actually defined for this element in stylesheets
	//(rather than computed values or style properties)
	this.getCSSProperties = function()
	{
		//process the arguments to create an indexed object
		var args = processArguments(arguments, ['element','media']);
		
		//process the element argument
		//this creates an element reference from an ID
		//and/or throws an error if the element us undefined, null, or not an element
		args.element = processElementArgument(args.element, 'getCSSProperties');
		
		//process the media argument
		//this sets default if undefined, empty or null
		//then splits it into a trimmmed array
		args.media = processMediaArgument(args.media);
		
		//process the onfinished argument, 
		//which sets it to null if undefined or not a function, for ease of reference
		args.onfinished = processOnfinishedArgument(args.onfinished);
		
		//if the script hasn't been initialized, do so now
		lateinit();
		
		//create an internal wrapper for the rest of this function
		//so that we can call it differently for callback or return
		//then wrap the whole thing in a returned call to the
		//dispatchReturn method, which abstracts that process,
		return dispatchReturn(args.onfinished, function()
		{
			//create the properties object
			var properties = {};
			
			//get all the rules that apply to this element and media
			//but we only need the "properties" from each rule
			//and for altstates to be false so we only get the properties that actually apply now
			var rules = getCSSRules(args.element, args.media, 'properties', BOOLEAN_FALSE);
			
			//if there are no rules returned, return null for failure
			if(rules.length == 0) { return NULL_VALUE; }
			
			//iterate through the returned collection, then the 
			//properties object in each member, and add each property value 
			//in turn to the final properties object, if its status is "active"
			for(var i=0; i<rules.length; i++)
			{
				for(var j in rules[i].properties)
				{
					if(!rules[i].properties.hasOwnProperty(j)
						|| rules[i].properties[j].status != STATUS_ACTIVE) { continue; }
					
					properties[j] = rules[i].properties[j].value;
				}
			}

			
			//return the final properties object
			return properties;
		
		});
	};
	
	//public getCSSSelectors returns all the selectors that apply to an element
	//the second argument specifies whether to return only direct selectors (true)
	//or selectors which apply indirectly through inheritance (false)
	this.getCSSSelectors = function()
	{
		//process the arguments to create an indexed object
		var args = processArguments(arguments, ['element','media','directonly']);
		
		//process the element argument
		//this creates an element reference from an ID
		//and/or throws an error if the element us undefined, null, or not an element
		args.element = processElementArgument(args.element, 'getCSSSelectors');
		
		//process the media argument
		//this sets default if undefined, empty or null
		//then splits it into a trimmmed array
		args.media = processMediaArgument(args.media);
		
		//if the directonly flag is null, default to true
		if(args.directonly == NULL_VALUE) { args.directonly = BOOLEAN_TRUE; }
		
		//process the onfinished argument, 
		//which sets it to null if undefined or not a function, for ease of reference
		args.onfinished = processOnfinishedArgument(args.onfinished);
		
		//if the script hasn't been initialized, do so now
		lateinit();
		
		//create an internal wrapper for the rest of this function
		//so that we can call it differently for callback or return
		//then wrap the whole thing in a returned call to the
		//dispatchReturn method, which abstracts that process,
		return dispatchReturn(args.onfinished, function()
		{
			//create an array of all selectors
			var allselectors = [];
	
			//now get all the rules that apply to this element and media
			//we only need the "selector" property from each rule
			//pass true as the altstates argument so that we get selectors
			//for every state, not just those that apply by default
			var rules = getCSSRules(args.element, args.media, 'selector', BOOLEAN_TRUE);
			
			//then iterate through the rules collection and send the selector text from each one
			//to the parseSelectorText method, which will split the selector into individual selectors
			//and then add each one to the allselectors array, if it hasn't already been listed
			for(var i=0; i<rules.length; i++)
			{
				var selectors = parseSelectorText(rules[i].selector);
				for(var j=0; j<selectors.length; j++)
				{
					if(arrayContains(allselectors, selectors[j]) == NULL_VALUE)
					{
						allselectors.push(selectors[j]);
					}
				}
			}
			
			//if we want inherited as well as direct selectors
			if(args.directonly == BOOLEAN_FALSE) 
			{	
				//we have to iterate through it and remove any selectors
				//which don't apply to the element or to any of its ancestors
				//nb. we remove any state-dependent pseudo-classes from the test selector each time
				//so that we include rules that apply to non-default states like :hover
				var node = args.element, 
					ancestors = [node];
				while(node.parentNode) 
				{ 
					ancestors.push(node.parentNode); 
					node = node.parentNode; 
				}
				for(var i=0; i<allselectors.length; i++)
				{
					var applies = BOOLEAN_FALSE;
					for(var j=0; j<ancestors.length; j++)
					{
						var nodes = getElementsBySelector(allselectors[i].replace(REGEX_PSEUDO_CLASSES_EXCEPT_NOT, ''));
						if(nodes.length > 0)
						{
							for(var k=0; k<nodes.length; k++)
							{
								if(nodes[k] == ancestors[j])
								{
									applies = BOOLEAN_TRUE;
									break;
								}
							}
						}
						if(applies == BOOLEAN_TRUE) { break; }
					}
					//if it doens't apply remove it from the array
					if(applies == BOOLEAN_FALSE)
					{
						allselectors.splice(i, 1);
						i --;
					}
				}
			
				//then return the allselectors array and we're done
				return allselectors;
			}
			
			//if we only want direct selectors, 
			//proceed to create the final output selectors array
			var selectors = [];
			
			//iterate through the allselectors array
			//and evaluate each one against the original element
			//and if it matches, add it to the final selectors array
			//nb. we remove any state-dependent pseudo-classes from the test selector each time
			//so that we include rules that apply to non-default states like :hover
			for(var i=0; i<allselectors.length; i++)
			{
				var nodes = getElementsBySelector(allselectors[i].replace(REGEX_PSEUDO_CLASSES_EXCEPT_NOT, ''));
				if(nodes.length > 0)
				{
					for(var j=0; j<nodes.length; j++)
					{
						if(nodes[j] == args.element)
						{
							selectors.push(allselectors[i]);
							break;
						}
					}
				}
			}
			
			//return the selectors array
			return selectors;
		
		});
	};

	//public getCSSSelectorSpecificity returns the specificity of a selector 
	//either as it applies to an element, or in abstraction
	this.getCSSSelectorSpecificity = function()
	{
		//process the arguments to create an indexed object
		var args = processArguments(arguments, ['selector','element']);
		
		//if selector is undefined, null, empty, or not a string, throw the no selector error
		if(typeof args.selector != TYPE_STRING 
			|| args.selector == NULL_VALUE || trim(args.selector) == '') 
		{ 
			throw(new Error(errorMessageNoSelector.replace('%method', 'getCSSSelectorSpecificity'))); 
		}
		
		//if selector is a string containing any commas, throw the multiple selector error
		else if(args.selector.indexOf(',') != -1)
		{
			throw(new Error(errorMessageMultipleSelector.replace('%method', 'getCSSSelectorSpecificity'))); 
		}
		
		//if the element is null, leave it like that
		//if the element is not null, process the element argument
		//this creates an element reference from an ID
		//and throws an error if the reference is not there, or not an element
		//but the condition allows it to be null if it was originally undefined or null
		if(args.element != NULL_VALUE) 
		{ 
			args.element = processElementArgument(args.element, 'getCSSSelectorSpecificity'); 
		}
		
		//process the onfinished argument, 
		//which sets it to null if undefined or not a function, for ease of reference
		args.onfinished = processOnfinishedArgument(args.onfinished);
		
		//if the script hasn't been initialized, do so now
		lateinit();
		
		//create an internal wrapper for the rest of this function
		//so that we can call it differently for callback or return
		//then wrap the whole thing in a returned call to the
		//dispatchReturn method, which abstracts that process,
		return dispatchReturn(args.onfinished, function()
		{
			//trim the selector
			args.selector = trim(args.selector);
			
			//if the element argument is in use, work out whether this selector applies to it
			//we remove pseudo-classes while checking this so that we get those that apply
			//even if only to a different pseudo-state; but because they're not permanently removed
			//we'll still end up with a specificity value that includes any pseudo-class the selector has
			if(args.element != NULL_VALUE)
			{
				var applies = BOOLEAN_FALSE, 
					nodes = getElementsBySelector(args.selector.replace(REGEX_PSEUDO_CLASSES_EXCEPT_NOT, ''));
				if(nodes.length > 0)
				{
					for(var j=0; j<nodes.length; j++)
					{
						if(nodes[j] == args.element)
						{
							applies = BOOLEAN_TRUE;
							break;
						}
					}
				}
				
				//if the selector doesn't apply 
				if(applies == BOOLEAN_FALSE)
				{
					//see if the selector applies to any of the elements ancestors
					//and if it does then return zero specificity
					var node = args.element, ancestors = [node];
					while(node.parentNode) 
					{ 
						ancestors.push(node); 
						node = node.parentNode; 
					}
					for(var i=0; i<ancestors.length; i++)
					{
						if(nodes.length > 0)
						{
							for(var j=0; j<nodes.length; j++)
							{
								if(nodes[j] == ancestors[i])
								{
									applies = BOOLEAN_TRUE;
									break;
								}
							}
						}
						if(applies == BOOLEAN_TRUE) { break; }
					}
					
					if(applies == BOOLEAN_TRUE)
					{
						return [0,0,0,0];
					}
					
					//if it doesn't even apply to an ancestor, return null
					else { return NULL_VALUE; }
				}
			}
			
			//if the element argument is not in use, or the selector does apply to it, 
			//get and return the specificity of this selector
			return getSelectorSpecificity(args.selector);
		
		});
	};


	//-- shared private method that finalizes the public css methods --//
	
	//dispatch return method deals with the onfinished argument of each public method
	//by calling the applicable inner wrapper and then returning or calling the callback
	function dispatchReturn(onfinished, wrapper)
	{
		//if the ready flag is not true and a callback is not defined
		//return undefined to signal that init is incomplete
		//putting this after the lateinit call ensures that it will
		//only affect asynchronous uses without the internal callback, when the data is not ready
		//it can then be caught by users by testing this method's return value against undefined
		if(THIS._allready !== BOOLEAN_TRUE && onfinished == NULL_VALUE) 
		{ 
			return; 
		}
		
		//or if the ready flag is true and no callback is set 
		//just call and return the internal wrapper
		if(onfinished == NULL_VALUE) 
		{ 
			return wrapper(); 
		}
		
		//otherwise create a timer to wait for the ready property
		//then call the internal wrapper and send its return through the callback
		else
		{
			//if init has happened before then the data will already be ready
			//so if that's the case just do the calback straight away
			if(THIS._allready === BOOLEAN_TRUE)
			{
				onfinished(wrapper());
			}
			
			//otherwise start the timer to wait for it
			//this runs at the same speed as the watch timer though it could 
			//actually afford to be slower, it's fine at this speed too, 
			//and means we can save on having to have a separate value
			//it also never times out; I suppose it could, but it doesn't really 
			//matter if it does end up running forever - it's hardly a major overhead!
			else
			{
				var readywaiter = window.setInterval(function()
				{
					if(THIS._allready === BOOLEAN_TRUE)
					{
						window.clearInterval(readywaiter);
						
						onfinished(wrapper());
					}
				}, WATCHER_SPEED_TIMER);
			}
		}
	}




	//-- private methods for building the author-mode rules data array --//
	
	//create the data array of css style rules from all document stylesheets
	//this all has to be structured in such a way that it works
	//with either synchronous or asynchronous network data retrieval
	function createAuthorRulesData(oncomplete)
	{
		//what we're going to do is load each stylesheet and parse it as text
		//so that we don't have to deal with each browser's normalizing behavior
		//we get a rules collection that is exactly as author defined
		//and the same in every browser, irrespective of its own support
		//so to begin with, we need an array of stylesheet URIs
		//which we can then load and get the text from
		//or for style blocks we can just grab the text straight away
		THIS._cssdata = [];
		
		//if this is IE and the page contains any style element
		//get the raw text inside the page's <style> nodes
		//passing the continuation method as its callback
		//this works by making a request for the host page and 
		//then parsing the HTML to get the contents of <style> elements
		//we only need to do this in "author" mode, 
		//in IE, if the page contains any <style> elements 
		//because their innerHTML/nodeData returns normalized style information
		//instead of just the plain text inside the style node, as with other browsers
		if(IEXPLORER && getTheseElements('style').length > 0)
		{
			getRawStyleData(continuation);
		}
		
		//otherwise just call the continuation method directly
		else { continuation(); }
		
		//continuation method after getting the raw style data
		function continuation()
		{
			//get the collection of all nodes that refer to stylesheets
			var stylenodes = getStyleSheetNodes();
	
			//now iterate through the collection of style nodes 
			//and process each one to get the initial data we need
			for(var i=0; i<stylenodes.length; i++)
			{
				processStyleNode(
					stylenodes[i], 
					stylenodes[i].nodeType == 7 
						? stylenodes[i].target.toLowerCase()
						: stylenodes[i].nodeName.toLowerCase()
					);
			}
			
			//the next few methods are called in order, each progressively
			//by the callback from the previous one, so they can work asynchronously
	
			//1. wrapper for recurring instances of the stage2 check and request method
			function stage1_checkStyleSheetForDataWrapper(cdcount)
			{
				//pass this cssdata to the stage2 check and request method
				stage2_checkStyleSheetForData(THIS._cssdata[cdcount], 
				
				//and when that completes
				function(cssdata)
				{
					//save back the modified object
					THIS._cssdata[cdcount] = cssdata;
					
					//if we have more to process, recur
					if(cdcount + 1 < THIS._cssdata.length) 
					{ 
						stage1_checkStyleSheetForDataWrapper(cdcount + 1); 
					}
					
					//otherwise kick off the stage 3 check for imports process
					else 
					{ 
						stage3_checkStyleSheetForImportsWrapper();
					}
				});
			}
			
			//2. check to see if we have the css text for a stylesheet
			//and make a request for it if we don't
			function stage2_checkStyleSheetForData(cssdata, oncomplete)
			{
				//if the href is null then this is a style block
				//in which case we already have the text, 
				//so just pass the unmodified cssdata back through the oncomplete callback
				if(cssdata.href == NULL_VALUE) { oncomplete(cssdata); }
				
				//otherwise request the stylesheet, which sends back a data object
				//containing the text of a successful request, or an error message
				else
				{
					requestStyleSheet(cssdata.href, function(dataobject)
					{
						//if we have an error message, record it to the cssdata object
						//and nullify the stylenode reference
						//then if the error is an http error or "not css", set the media to "none"
						if(dataobject.message != NULL_VALUE)
						{
							cssdata.message = dataobject.message;
							cssdata.stylenode = NULL_VALUE;
							
							if(cssdata.message == ERROR_NOT_CSS || /^[1-9]{1,3}/.test(cssdata.message))
							{
								cssdata.media = MEDIA_NONE;
							}
						}
						
						//otherwise strain and save the text, leaving valid imports in place for now
						//because we'll need to extract them later to load them in turn
						else 
						{ 
							cssdata.text = strainStyleSheet(dataobject.text, BOOLEAN_FALSE); 
						}
			
						//call oncomplete with the modified cssdata object
						oncomplete(cssdata);
					});
				}
			}
			
			//3. wrapper for calling recurring instances of the stage5 check and request import method
			function stage3_checkStyleSheetForImportsWrapper()
			{
				//4. check a stylesheet for imports
				function stage4_checkStyleSheetForImports(cdindex)
				{
					//local callback for this method
					function localcallback(increment)
					{
						//if there are any more stylesheets to check, recur on the next one
						//increasing the iterator as specified in case we need to re-check
						//the index that we just checked, because it's now a nested import
						//which is added before its parent in the array
						//and that's why we have a .tested flag, to avoid testing the same 
						//stylesheet more than once if we encounter it more than once
						if(cdindex + 1 < THIS._cssdata.length)
						{
							stage4_checkStyleSheetForImports(cdindex + increment);
						}
						
						//otherwise go on to the final stage7 data processor
						else
						{
							stage7_processStyleSheetsData();
						}
					}
					
					//if we've already tested this stylesheet 
					//just call the local callback with a standard increment
					if(THIS._cssdata[cdindex].tested == BOOLEAN_TRUE)
					{
						localcallback(1);
					}
					
					//else proceed
					else
					{
						//look for imports in this stylesheet text
						var importsheets = extractImportStatements(THIS._cssdata[cdindex].text);
						
						//mark that we've tested this stylesheet
						THIS._cssdata[cdindex].tested = BOOLEAN_TRUE;
						
						//assign its ssid; we waited until now to do this
						//so that we can assign them in order of occurence
						THIS._cssdata[cdindex].ssid = THIS.ssidcounter++;
						
						//if we have any imports
						if(importsheets.length > 0)
						{
							//5. wrapper for passing each import 
							//to the stage6 check and request import method
							function stage5_checkImportForDataWrapper(impindex)
							{
								//pass this import data to the stage6 check and request import method
								stage6_checkImportForData(
									cdindex,
									impindex,
									importsheets[impindex],
									
								//and when that completes
								function(cssdata, cdnumber, impnumber)
								{
									//add the object to the master array before its parent
									//which means that imports go before their parent, 
									//and sibling imports maintain their relative order; 
									//this is the correct source order for specificity
									//and can make a huge difference when it comes to rule sorting
									THIS._cssdata.splice((cdindex + impnumber), 0, cssdata);
									
									//if there are any more imports to check, recur on the next one
									if(impnumber + 1 < importsheets.length)
									{
										stage5_checkImportForDataWrapper(impnumber + 1);
									}
									
									//otherwise call the local callback
									//with a zero increment value so that 
									//the iterator loops back on itself 
									//to check the stylesheet we just added
									else
									{
										localcallback(0);
									}
								});
							}
							
							//pass the first import index to stage5 to kick it off
							stage5_checkImportForDataWrapper(0);
						}
						
						//otherwise call the local callback straight away
						//with a standard increment value
						else 
						{
							localcallback(1);
						}
					}
				}
				
				//pass the first index to stage4 to kick it off
				stage4_checkStyleSheetForImports(0);
			}
			
			//6. check and request an import stylesheet
			function stage6_checkImportForData(cdcount, impcount, importobj, oncomplete)
			{
				//create a data object for the stylesheet and assign it an ssid
				var cssdata = {
					'tested' : BOOLEAN_FALSE,
					'owner' : '@import',
					'media' : MEDIA_ALL,
					'stylenode' : THIS._cssdata[cdcount].stylenode,
					'href' : importobj.href,
					'text' : ''
					};
					
				//save the media for this import
				cssdata.media = importobj.media;
				
				//get the context from the nearest ancestral non-import 
				var n = cdcount, parent = THIS._cssdata[n];
				while(parent.href == cssdata.href)
				{
					parent = THIS._cssdata[n--];
				}
				context = parent.media;
				
				//if the import itself has its own media specified, save that 
				//to the xmedia property, otherwise use the default value "all"
				//(I originally had this as media|context, but then I figured,
				// the context is not the import's media, is it?)
				cssdata.xmedia = importobj.hasownmedia ? importobj.media : MEDIA_ALL;
				
				//then contextualize the import's media
				cssdata.media = contextualizeMediaTypes(context, cssdata.media);
	
				//local finalizing function
				function finalizedata(fdata)
				{
					//if we have an error message, record it to the cssdata object
					//and nullify the stylenode reference
					//then if the error is an http error or "not css", set the media to "none"
					if(fdata.message != NULL_VALUE)
					{
						cssdata.message = fdata.message;
						cssdata.stylenode = NULL_VALUE;
						
						if(cssdata.message == ERROR_NOT_CSS || /^[1-9]{1,3}.*$/.test(cssdata.message))
						{
							cssdata.media = MEDIA_NONE;
						}
					}
					
					//otherwise strain and save the text, leaving valid imports in place for now
					//because we'll need to check for imports when its iteration comes round
					//in case an imported stylesheet also contains imports
					//the import statements will get removed when we do 
					//the final text processing operation to create the rules objects
					else 
					{ 
						cssdata.text =  strainStyleSheet(fdata.text, BOOLEAN_FALSE); 
					}
					
					//pass the data object to the oncomplete callback
					oncomplete(cssdata, cdcount, impcount);
				}
	
				//if the cssdata object already has this stylesheet href, 
				//mark it as a duplicate and don't make a request for it
				//this is particularly important to prevent infinite recursion
				//for example, where two stylesheets import each other
				if(arrayContains(THIS._cssdata, importobj.href, 'href') != NULL_VALUE)
				{
					//** how do we disable this duplicate when
					//** we don't have its stylesheet reference?
					
					//call the finalize function 
					//with a data object containing the redundent duplication message 
					//in the same format as would be returned by the request method
					finalizedata({
						'text' : '',
						'message' : MESSAGE_DUPLICATE
						});
				}
				
				//otherwise request the stylesheet, which sends back a data object
				//containing the text of a successful request, or an error message
				else
				{
					requestStyleSheet(importobj.href, finalizedata);
				}
			}
			
			//7. process the cssdata object to create the final cssRules array
			function stage7_processStyleSheetsData()
			{
				//now we're read start building the final cssRules data array
				//we'll have an array of objects each of which contains the raw stylesheet text
				//so what we have to do is parse each one to extract the style information
				for(var i=0; i<THIS._cssdata.length; i++)
				{
					//check if we already have this stylesheet data 
					//which we can only do for stylesheets that have an href
					//and will only be caused by duplication stylesheet includes
					//we already dealt with duplicate imports at the request stage
					//so this step is to find, mark and disable any duplicate top-level includes
					//we first have to check though that we're not comparing an existing duplicate
					//otherwise we could end up marking both instances as duplicates!
					//we use the arrayContains method to do this, which had to be modified so that
					//if it finds a match, it doesn't just return true, it returns the match it found,
					//which is a _cssdata object that we can check to see if it's already a duplicate
					if(THIS._cssdata[i].href)
					{
						var arycontains = arrayContains(THIS._stylesheets, THIS._cssdata[i].href, 'href');
						if(arycontains != NULL_VALUE && arycontains.message != MESSAGE_DUPLICATE)
						{
							//add duplication data to the debug stylesheets array
							THIS._stylesheets.push({
								'ssid' : THIS._cssdata[i].ssid,
								'href' : THIS._cssdata[i].href,
								'owner' : THIS._cssdata[i].owner,
								'media' : THIS._cssdata[i].media,
								'xmedia' : THIS._cssdata[i].xmedia,
								'stylenode' : NULL_VALUE,
								'rules' : 0,
								'message' : MESSAGE_DUPLICATE
								});
					
							//however if there are duplicate stylesheets, 
							//subsequently disabling one of them (ie. through stylesheet switching)
							//will cause the other one's rules to take effect, which the script
							//won't be aware of because its rules are not included
							//so since we don't have the option of just including duplicates 
							//because of the possibility of infinite recursion, 
							//what we'll do instead is just forcibly disable any duplicates we find
							if(THIS._cssdata[i].stylenode)
							{
								THIS._cssdata[i].stylenode.disabled = BOOLEAN_TRUE;
							}
							
							//continue to the next stylesheet
							continue;
						}
					}
					
					//if this data object has a message property then something went wrong
					//either a security error, or an http error while loading it
					//so just ignore it and continue to the next one
					if(typeof THIS._cssdata[i].message != TYPE_UNDEFINED) 
					{ 
						//record an entry to the debug stylesheets array
						THIS._stylesheets.push({
							'ssid' : THIS._cssdata[i].ssid,
							'href' : THIS._cssdata[i].href,
							'owner' : THIS._cssdata[i].owner,
							'media' : THIS._cssdata[i].media,
							'xmedia' : THIS._cssdata[i].xmedia,
							'stylenode' : THIS._cssdata[i].stylenode,
							'rules' : 0,
							'message' : THIS._cssdata[i].message
							});
						
						//continue to the next stylesheet
						continue; 
					}
					
					//send the data object to the css text parsing method
					//in which we'll actually build the cssRules data array
					//and return the number of rules we found, for the debug stylesheets array
					var rulecount = parseStyleSheetCSSText(THIS._cssdata[i]);
					
					//record an entry to the debug stylesheets array
					THIS._stylesheets.push({
						'ssid' : THIS._cssdata[i].ssid,
						'href' : THIS._cssdata[i].href,
						'owner' : THIS._cssdata[i].owner,
						'media' : THIS._cssdata[i].media,
						'xmedia' : THIS._cssdata[i].xmedia,
						'stylenode' : THIS._cssdata[i].stylenode,
						'rules' : rulecount,
						'message' : MESSAGE_OK
						});
				}
				
				//and once we get here we can delete the cssdata object
				//first setting it to null to ensure garbage collection in IE
				THIS._cssdata = NULL_VALUE;
				delete THIS._cssdata;
				
				//do a final sort of the _stylesheets array, putting it in ssid order
				THIS._stylesheets.sort(function(a, b) { return a.ssid - b.ssid; });
				
				//nullify and delete the ssidcounter
				THIS.ssidcounter = NULL_VALUE;
				delete THIS.ssidcounter;
				
				//if the watch setting is strictly true, watch for changes in disabled state
				if(watch === BOOLEAN_TRUE) { watchStyleSheets(); }
				
				//call the oncomplete callback, if defined
				if(typeof oncomplete == TYPE_FUNCTION) 
				{ 
					oncomplete(); 
				}
			}
		
			//0. if we have no data in _cssdata, jump straight to the final stage7
			//otherwise pass the first index to stage1 to kick everything off
			if(THIS._cssdata.length == 0) 
			{ 
				stage7_processStyleSheetsData(); 
			}
			else 
			{ 
				stage1_checkStyleSheetForDataWrapper(0); 
			}
		}
	}
	
	//get the raw text inside the page's <style> nodes
	function getRawStyleData(oncomplete)
	{
		//make a request for the page specified in the base property
		ajaxload(async, base,
		
		//if the load succeeds 
		function(code)
		{
			//re-get the "style" elements collection
			var stylenodes = getTheseElements('style');
			
			//save a copy of the html and split it by opening style tags
			var styleblocks = code.split(/<([^:]+:)?style[^>]*>/i);
			
			//delete the first member, which will be  
			//everything up to the first style element
			styleblocks.splice(0, 1);
			
			//now iterate and split each member by closing style tags
			//throw away the second member and keep the first
			//to leave us with just the css data inside it
			//in an array indexed by the element's position in the "style" collection
			//which we'll then save as a __css property of the source node,
			//just as we did for styleattrs, so that DOM changes aren't a problem
			for(var j=0; j<styleblocks.length; j++)
			{
				stylenodes[j].__css = styleblocks[j].split(/<\/([^:]+:)?style>/i)[0];
			}
			
			//we don't need the styleblocks array anymore
			//so we can delete it to save a bit of memory
			//Every Little Helps :) (tm)
			delete styleblocks;
			
			//call the callback
			oncomplete();
		},
		
		//there's no known reason why we should get failure
		//but if we do, the lack of .__css properties will be
		//handled where it occurs, so all we have to do here
		//is call the oncomplete callback as if nothing happens
		function()
		{
			oncomplete();
		});
	}
	
	//get the collection of all nodes that refer to stylesheets
	function getStyleSheetNodes()
	{
		//create the array
		var stylenodes = [];
		
		//begin by looking for xml-stylesheet processing instructions
		var kids = page.childNodes;
		for(var i=0; i<kids.length; i++)
		{
			if(kids[i].nodeType == 7 && kids[i].target.toLowerCase() == 'xml-stylesheet')
			{
				stylenodes.push(kids[i]);
			}
		}
		
		//then get a raw collection of all elements in all namespaces
		//or just all nodes if we're not in any form of XML, or the NS method fails
		var allnodes = getTheseElements('*');
		
		//then iterate through that to look for stylesheet nodes
		//link elements are included from any namespace according to their rel attribute, 
		//as are style elements from any namespace (isn't there an svg:style for example?)
		for(var i=0; i<allnodes.length; i++)
		{
			if((/link/i.test(allnodes[i].nodeName) 
					&& /stylesheet/i.test(allnodes[i].getAttribute('rel')))
				|| /style/i.test(allnodes[i].nodeName))
			{
				stylenodes.push(allnodes[i]);
			}
		}
		
		//return the final style nodes array
		return stylenodes;
	}
	
	//process a style node to get the preliminary data we need
	function processStyleNode(node, owner)
	{
		//create a data object for this stylesheet and assign it an ssid
		var cssdata = {
			'tested' : BOOLEAN_FALSE,
			'owner' : owner,
			'media' : MEDIA_ALL,
			'stylenode' : node,
			'href' : NULL_VALUE,
			'text' : ''
			};

		//if the owner is an xml-stylesheet, parse its data property
		//to create a dictionary of its pseudo attributes
		//we use match here instead of just splitting by delimiting whitespace, 
		//because the values themselves might contain whitespace
		//nb. xml-stylesheet regexes must be case-insensitive, to match implementations,
		//in which all aspects of an xml-stylesheet PI are case-sensitive
		if(/xml\-stylesheet/.test(owner))
		{
			var pseudoattrs = {}, 
				nodedata = node.data.match(/([a-z]+=[\'\"][^\'\"]*[\'\"])/gm);
			for(var i=0; i<nodedata.length; i++)
			{
				nodedata[i] = nodedata[i].split('=');
				pseudoattrs[nodedata[i][0]] = nodedata[i][1].substr(1, nodedata[i][1].length - 2);
			}
		}
		
		//except for safari or konqueror with nodes other than xml-stylesheet, because it always returns false
		//(so this is the exact opposite of what IE does!)
		//nb. though in fact, this /still/ always returns false unless the stylesheet has been
		//pre-disabled, by having a default disabled=disabled attribute, or by 
		//having its .disabled property set to false through scripting
		//if the node does have a disabled attribute, then node.sheet is null
		if((SAFARI || KONQUEROR || WEBKIT) && !/xml\-stylesheet/.test(owner))
		{
			var isdisabled = node.disabled;
		}
		
		//get the stylesheet's disabled state from the node's styleSheet/sheet property
		//we have to do this for IE because the node itself always returns not disabled
		//for others we only have to use it for xml-stylesheet,
		//but we may as well use it all the time to save a bit of code forking
		//nb. although we know this condition is IE vs. others, an object test is better
		//just in case any unknown devices have the same object reference
		else
		{
			//get the style node reference, and if its null set isdisabled to true
			//(which will happen in firefox for an alternate stylesheet that's 
			// missing its title attr and hence can never be switched on)
			//otherwise set it according to the style node's disabled state
			var disnode = node[typeof node.styleSheet != TYPE_UNDEFINED ? 'styleSheet' : 'sheet'],
				isdisabled = disnode == NULL_VALUE ? BOOLEAN_TRUE : disnode.disabled;
		}
		
		//in opera, the stylesheet returns as disabled if it applies to media
		//other than the one currently in force, such as "print" when the view is "screen"
		//so what we'll do is temporarily switch the media to whatever the current view is
		//then read its disabled property again, to find out if it's
		//really disabled or just applicable to a non-view media
		//this happens so fast that no visual change should be apparent
		if(OPERA && isdisabled && node.sheet.media.length > 0)
		{
			var realmedia = node.sheet.media.mediaText;
			node.sheet.media.mediaText = THIS._viewmedia;
			isdisabled = node.sheet.disabled;
			node.sheet.media.mediaText = realmedia;
		}
		
		//we don't want data from disabled stylesheets in the data set, 
		//unless this is author mode and the watch setting is null
		//so if it is (and it's not) add a message to the objeect to that effect, 
		//the presence of which will then prevent it from being proceessed any further
		//however don't stop here just yet because we want the href and media as well
		if(watch !== NULL_VALUE && isdisabled)
		{
			cssdata.message = MESSAGE_DISABLED;
		}

		//if the owner is an xml-stylesheet instruction
		//get the href from the pseudoattrs object and qualify it
		if(/xml\-stylesheet/.test(owner))
		{
			cssdata.href = qualifyHREF(pseudoattrs.href, base);
		}

		//or if the owner node is a link element get the href from its href attribute
		//we're using getAttribute so that we get the literal attribute value,
		//rather than a qualified value, so that we can qualify it ourselves
		//using the value for "base"; the second argument is IE proprietary
		//and the value 2 tells getAttribute to return the literal attribute value
		//rather than an "interpolated" value, ie. a property value, which is what 
		//IE normally returns for attributes, rather than returning attribute values: 
		//http://reference.sitepoint.com/javascript/Element/getAttribute
		else if(/link/i.test(owner))
		{
			cssdata.href = qualifyHREF(node.getAttribute('href', 2), base);
		}
		
		//otherwise it will be a style element
		else
		{
			//if it's not disabled or watch is null
			if(!isdisabled || watch === NULL_VALUE)
			{
				//if this is IE, the nodeData is actually CSS to IE, not just plain text like everything else
				//so it gets formatted like CSS (capitalized property names and type selectors, some value normalizing)
				//what we have to do then is refer to the raw page HTML we saved earlier
				//and grab the css text from that, not from this style element
				if(IEXPLORER)
				{
					//if we have no __css property for this node, record a network error
					//because that would mean we were unable to get the HTML during init
					if(typeof node.__css == TYPE_UNDEFINED)
					{
						cssdata.message = ERROR_NETWORK;
					}
					
					//otherwise grab that data and pass it to the strain method
					//to do some initial pre-parsing, but leaving valid imports in place for now
					else
					{
						cssdata.text += strainStyleSheet(node.__css, BOOLEAN_FALSE);
					}
				}
				
				//for any other browser
				else
				{
					//save the text content, doing some initial pre-parsing as we go
					//but leaving valid imports in place for now
					//we used to get the CSS data from the style node as simply "node.firstChild.nodeValue"
					//but running that on a stylesheet created as an <html:style> node 
					//within CodeBurner's results.xhtml page, the style node returned zero childNodes 
					//(because adding rules using insertRule doesn't create any;
					// if I modified the code to add them as text nodes then they did show up
					// - and still worked as CSS - but that's doesn't help us here)
					//so we need to be aware of that potential situation and handle it acccordingly
					//furthermore, when running it on a normal XHTML page, it missed rules
					//inside HTML comments or CDATA sections, because the main data is no longer 
					//the first child text node, it's the node data of the second child comment or cdata-section node
					//but we don't necessarily want to just put them back, because they might not apply - 
					//we need to match their inclusion against whether browsers actually apply them
					//and after cross-browser testing in applicable modes, we find the following:
					//
					//		/-------------------------------------------------------\
					//		| Browser		| HTML mode		  	| XHTML mode		|
					//		| 				| Comments	| CDATA	| Comments	| CDATA	| 
					//		|-------------------------------------------------------|
					//		| Opera 		| YES		| NO	| NO		| YES	|
					//		| Firefox		| YES		| NO	| NO		| YES	|
					//		| Safari		| YES		| NO	| YES		| YES	|
					//		| IE			| YES		| NO	| --		| --	|
					//		\-------------------------------------------------------/
					//
					//so, taking all of that into account, we made a modification to strainStyleSheet
					//that pre-removes the contents of CDATA or Comment sections,
					//according to mode and browser using the rules above, 
					//before parsing what's left as the complete CSS stylesheet
					
					//then we modified the code here to assemble a content string from all child nodes
					//including the comment or CDATA markers themselves
					//(so that the strain method would have some deletion hooks to work with)
					//using innerHTML proved unreliable because konqueror was entity-encoding it
					//and firefox was missing data in some situations - even though it was situations
					//where we didn't need it anyway, it still made me slightly uncomfortable
					//nb. the "CDATA" token is case-sensitive
					//"cdata" is invalid and causes an XML parsing exception
					for(var nodedata='', kids=node.childNodes, i=0; i<kids.length; i++)
					{
						switch(kids[i].nodeType)
						{
							case 3 : nodedata += kids[i].nodeValue; 						break;
							case 4 : nodedata += '<![CDATA[' + kids[i].nodeValue + ']]>'; 	break;
							case 8 : nodedata += '<!--' + kids[i].nodeValue + '-->'; 		break;
						}
					}
					cssdata.text += strainStyleSheet(nodedata, BOOLEAN_FALSE);
				}
			}
		}
		
		//get the media from its media attribute / pseudoattribute, 
		//or set to default if it doesn't have one defined 
		if(/xml\-stylesheet/.test(owner))
		{
			cssdata.media = typeof pseudoattrs.media != TYPE_UNDEFINED
							? pseudoattrs.media : MEDIA_ALL;
		}
		else
		{
			cssdata.media = node.getAttribute('media')
							? node.getAttribute('media') : MEDIA_ALL;
		}

		//then normalize the spacing between each delimited value
		//(the ',' + ' ' thing is to avoid compression)
		cssdata.media = cssdata.media.split(/,\s*/).join(',' + ' ');
		
		//and copy it to the xmedia property
		cssdata.xmedia = cssdata.media;
		
		//add this data object to the array
		THIS._cssdata.push(cssdata);
	}
	
	//make a request for a stylesheet
	function requestStyleSheet(href, oncomplete)
	{
		//create a request data object to return
		var requestdata = {
			'text' : '',
			'message' : NULL_VALUE
			};
		
		//make a request for the stylesheet, passing the async value
		ajaxload(async, href,
		
		//if it succeeds, save the text content to the data object
		//doing some initial pre-parsing as we do it
		function(responsetext, contype) 
		{ 
			//if we have a content type and it's not text/css
			//(local or chrome requests, with a status of 0,
			// also return a null or empty content type, 
			// so if we don't have one we'll just have to assume it's okay)
			if((typeof contype == TYPE_STRING && trim(contype) != '') 
				&& !/^(text\/css)/.test(contype))
			{
				//if the content type is text/html
				//scan it to see if it is in fact a server error page
				//and if it is see if we can extract the status error from its <title>
				//and if that succeeds record it to the data message property
				if(/^(text\/html)/.test(contype))
				{
					var matches = responsetext.match(/<title>([1-9]{1,3}[^<]+)<\/title>/i);
					if(matches && matches.length >= 2)
					{
						requestdata.message = matches[1];
					}
				}
				
				//if we haven't got a message, just set the "data is not css" message
				if(requestdata.message == NULL_VALUE)
				{
					requestdata.message = ERROR_NOT_CSS;
				}
			}
			
			//otherwise if we're good (or we have to assume we're good)
			//save the response text to the requestdata object
			else 
			{ 
				requestdata.text =  responsetext;
			}
			
			//call oncomplete with the request data
			oncomplete(requestdata);
		},
		
		//if the request fails for any reason
		function(statustext)
		{
			//save the status text message to the requestdata object
			requestdata.message = statustext;

			//call oncomplete with the request data
			oncomplete(requestdata);
		});
	}
	
	//extract @import statements from the raw text of a stylesheet
	function extractImportStatements(styletext)
	{
		//create the array for storing any we find
		var importsheets = [];
		
		//define regexes for matching import statements
		//which may include media definitions and queries
		var importreg = /@import\s*(?:url\s*\(\s*[\'\"]?|[\'\"])([^\'\"\)]+)(?:[\'\"]|[\'\"]?\s*\))([^;]*)(;|$)/ig;
		
		//look for @import statements in the text
		var matches = styletext.match(importreg);
		
		//if we have matches
		if(matches)
		{
			for(var i=0; i<matches.length; i++)
			{
				//extract and qualify the href
				var href = qualifyHREF(matches[i].replace(importreg, '$1'), base);
				
				//extract the media, from which we may have to trim 
				//leading space and residual close bracket, or set default
				var media = trim(trim(matches[i].replace(importreg, '$2')).replace(/^\)/, ''));

				//set the hasownmedia flag to true, indicating that 
				//the import statement had a media flag as part of it
				//this is used to differentiate the original media from a 
				//contextual media in the final data set
				var hasownmedia = BOOLEAN_TRUE;
	
				//then if it didn't in fact one, set this flag to false,
				//and the media itself to the default value "all"
				if(!media) 
				{ 
					hasownmedia = BOOLEAN_FALSE;
					media = MEDIA_ALL; 
				}
				
				//add to the importsheets array
				importsheets.push({
					'href' : href,
					'media' : media,
					'hasownmedia' : hasownmedia
					});
			}
		}
		
		//return the final array
		return importsheets;
	}
	
	//remove unwanted information from stylesheet text
	function strainStyleSheet(styletext, importsheets)
	{
		//css comments
		//this must come first because it expects multi-line data
		//and without that it will fail to remove complex comments
		//that contain lots of intermediate stars and slashes
		styletext = styletext.replace(/(\/\*([^*]|(\*+([^*/])))*\*+\/)/gm, '');
		
		//in HTML mode, delete anything inside and including CDATA markers
		//in XHTML mode but not webkit browsers, delete anything inside and including HTML comments
		//we do this because no supported browsers implement such rules (except for webkit as noted)
		//for more about this see processStyleNode()
		//(near the end - the notes preceding the last call to strainStyleSheet())
		//nb. the "CDATA" token is case-sensitive
		//"cdata" is invalid and causes an XML parsing exception
		if(!THIS._isXML)
		{
			styletext = styletext.replace(/(<\!\[CDATA\[([^\]]|(\]+([^>])))*\]+>)/gm, '');
		}
		if(THIS._isXML && (!(SAFARI || KONQUEROR || WEBKIT)))
		{
			styletext = styletext.replace(/(<\!\-\-([^\-]|(\-+([^>])))*\-+>)/gm, '');
		}
		
		//convert one or more contiguous tab to a single space
		//and any resulting multiple spaces to single spaces
		//we don't want to just remove them in case they're used in syntax
		//eg. the media query "screen		and		(color)" would otherwise be
		//converted to "screenand(color)", which would evaluate to "none"
		//of course this means we'll be left with whitespace in the stylesheet css text
		//but we do plenty of trimming when we parse it into properties
		//so that won't matter in the final analysis, it just means that
		//the css property may contain a space between each property:value; pair
		styletext = styletext.replace(/[\t]+/g, ' ').replace(/[ ][ ]/g, ' ');		
		
		//line-breaks
		styletext = styletext.replace(/[\r\n]/g, '');		
		
		//@charset and @namespace statements
		styletext = styletext.replace(/@(charset|namespace)[^;]+;/igm, '');	
		
		//if the importsheets flag is defined and true, remove @import statements
		if(typeof importsheets != TYPE_UNDEFINED && importsheets == BOOLEAN_TRUE)
		{
			styletext = styletext.replace(/@import[^;]+;/igm, '');	
		}
		
		//otherwise we need to check and remove any imports which are invalid
		//for imports to be valid they must be at the start of the stylesheet
		//so any which come after a block of normal CSS don't apply and get deleted
		else if(/@import[^;]+;/i.test(styletext))
		{
			//add split markers around each import statement and split by those markers
			//(IE doesn't support backreferences after split(), so we had to do this
			// to get data split by import statements without losing the statements themselves)
			var cssdata = styletext.replace(/(@import[^;]+;)/igm, '{SPLIT}$1{SPLIT}').split('{SPLIT}');

			//then clear the original text variable and iterate through the fragments
			//so we can re-compile the text with valid code only
			for(var styletext = '', nomoreimports = NULL_VALUE, i=0; i<cssdata.length; i++)
			{
				//don't include any fragments that are pure whitespace
				//because they'll throw our calculations off, beside being useless 
				if(trim(cssdata[i]) == '') { continue; }
				
				//if this fragment is an import statement
				if(/@import[^;]+;/i.test(cssdata[i]))
				{
					//if it's the first we've seen, indicate that they're still valid
					if(nomoreimports === NULL_VALUE) { nomoreimports = BOOLEAN_FALSE; }
					
					//if they're still valid,  add it to the compiled text
					if(nomoreimports === BOOLEAN_FALSE) { styletext += cssdata[i]; }
				}
				
				//or if this fragment is not an import statement
				//indicate that they're no longer valid
				//then add it to the compiled text
				else
				{
					nomoreimports = BOOLEAN_TRUE;
					styletext += cssdata[i];
				}
			}
		}
		
		//@font-face and @page declarations
		styletext = styletext.replace(/@(font\-face|page)[^\}]+\}/igm, '');
		
		//remove any remaining HTML comments or CDATA markers
		//(just the markers themselves, not their contents -
		// we've already deleted the ones that aren't valid)
		//nb. the "CDATA" token is case-sensitive
		//"cdata" is invalid and causes an XML parsing exception
		styletext = styletext.replace(/(<\!\-\-)|(\-\->)|(<\!\[CDATA\[)|(\]\]>)/gm, '');
		
		//trim and return the result
		return trim(styletext);
	}
	
	//parse the css text of a style sheet
	function parseStyleSheetCSSText(cssdata)
	{
		//do token replacements for generated content
		//to avoid confusion in case it contains any brace characters
		var gencontent = cssdata.text.match(/(content:[^;]+;)/igm);
		if(gencontent)
		{
			for(var g=0; g<gencontent.length; g++)
			{
				cssdata.text = cssdata.text.replace(gencontent[g], '[G' + g + ']');
			}
		}
		
		//strain and trim (including imports), then split the text by closing-brace characters
		cssdata.text = trim(strainStyleSheet(cssdata.text, BOOLEAN_TRUE)).split('}');
		
		//iterate through the resulting lines 
		//trim and split each one again, by the opening brace character
		for(var i=0; i<cssdata.text.length; i++)
		{
			cssdata.text[i] = trim(cssdata.text[i]).split('{');
			for(var j=0; j<cssdata.text[i].length; j++)
			{
				cssdata.text[i][j] = trim(cssdata.text[i][j]);
			}
		}
		
		//then iterate again through the resulting matrix
		//to convert any generated content tokens back to their real value
		if(gencontent)
		{
			for(var g=0; g<gencontent.length; g++)
			{
				for(var i=0; i<cssdata.text.length; i++)
				{
					for(var j=0; j<cssdata.text[i].length; j++)
					{
						cssdata.text[i][j] = cssdata.text[i][j].replace('[G' + g + ']', gencontent[g]);
					}
				}
			}
		}
		
		//count the number of rules we find so that we can
		//return that data back up to the debug stylesheets array
		var rulecount = 0;

		//we identify changes in media by an odd number of members in a group of text lines
		//beginning with the default media values from the stylesheet
		var currentmedia = cssdata.media,
			currentxmedia = cssdata.xmedia;
		
		//we identify changes in owner the same way
		var currentowner = cssdata.owner;
		
		//iterate through the text lines
		for(var i=0; i<cssdata.text.length; i++)
		{
			//if we have two members this is just a normal rule pair
			if(cssdata.text[i].length == 2)
			{
				//add this rule data to the cssRules array
				THIS._cssRules.push({
					'selector' : cssdata.text[i][0],
					'css' : cssdata.text[i][1],
					'media' : currentmedia,
					'xmedia' : currentxmedia,
					'owner' : currentowner.toLowerCase(),
					'href' : cssdata.href,
					'ssid' : cssdata.ssid
					});
					
				//add to the rulecount
				rulecount++;
			}
			//if we have three then the first is an opening @media declaration
			else if(cssdata.text[i].length == 3)
			{
				//set the new owner and media
				currentmedia = trim(cssdata.text[i][0].replace('@media', '')).toLowerCase();
				currentowner = '@media';
				
				//copy to currentxmedia to save the original value
				currentxmedia = currentmedia;
				
				//then adjust the media type if necessary to take account of the context
				//we only need to check as far as the containing style sheet
				//because its media has already been contextualized
				var context = cssdata.media;
				if(context == '') { context = MEDIA_ALL; }
				currentmedia = contextualizeMediaTypes(context, currentmedia);
					
				//add this rule to the cssRules array
				THIS._cssRules.push({
					'selector' : cssdata.text[i][1],
					'css' : cssdata.text[i][2],
					'media' : currentmedia,
					'xmedia' : currentxmedia,
					'owner' : currentowner,
					'href' : cssdata.href,
					'ssid' : cssdata.ssid
					});
					
				//add to the rulecount
				rulecount++;
			}
			//if we have one then it's closing an @media declaration
			//or it's an empty member after a stylesheets' final closing brace
			//either way, the context should now be the parent stylesheet
			else if(cssdata.text[i].length == 1)
			{
				currentmedia = cssdata.media;
				currentxmedia = cssdata.xmedia;
				
				currentowner = cssdata.owner;
			}
		}
		
		//return the number of rules we found
		return rulecount;
	}
	
	
	
	
	//-- private methods for building the browser-mode rules data array --//
	
	//create the data array of css style rules from all document stylesheets
	function createBrowserRulesData(oncomplete)
	{
		//get the collection of stylesheets from the specified context document
		//and convert it to an array so that we can splice it if necessary
		var stylesheets = arrayifize(page.styleSheets);
		
		//iterate through the collection and parse each stylesheet
		for(var i=0; i<stylesheets.length; i++)
		{
			//assign an index to this stylesheet
			stylesheets[i].__ssid = THIS.ssidcounter++;
			
			//if the stylesheets has an ownerNode property then this is a standard implementation
			//which we can parse using DOM 2 CSS properties and collections
			if(typeof stylesheets[i].ownerNode != TYPE_UNDEFINED)
			{
				//if this is safari 3 we cannot process xml-stylesheet, 
				//because it doesn't support the pseudo-attributes we need
				if(SAFARI3 && /xml\-stylesheet/.test(stylesheets[i].ownerNode.nodeName))
				{
					//add error data to the debug stylesheets array
					THIS._stylesheets.push({
						'ssid' : stylesheets[i].__ssid,
						'href' : qualifyHREF(stylesheets[i].href, base),
						'owner' : 'xml-stylesheet',
						'media' : MESSAGE_UNKNOWN,
						'stylesheet' : NULL_VALUE,
						'rules' : 0,
						'message' : MESSAGE_UNSUPPORTED_TYPE
						});
	
						//remove it from this array
						stylesheets.splice(i, 1);
						i --;
				}
			
				//otherwise try to parse the stylesheet as normal
				else
				{
					try
					{
						parseStyleSheet(
							stylesheets[i], 
							stylesheets[i].ownerNode.nodeName.toLowerCase(),
							//the trim probably isn't necessary, but better safe than sorry!
							stylesheets[i].media.length > 0 ? trim(stylesheets[i].media.mediaText) : MEDIA_ALL
							);
					}
					
					//if we fail just delete this stylesheet and carry on
					//the only known occurence is this exception is when
					//using the script within the chrome scope in Firefox
					//where a couple of extension stylesheets turned out
					//to have a null ownerNode, for reasons unknown
					catch(err)
					{
						//add error data to the debug stylesheets array
						//since this is so unlikely to happen, i'm being stingy 
						//with code and just making all the data "unknown"
						//of course this will make it harder for users 
						//to track down the offending stylesheet, 
						//but hey - that's what trial and error is for :-P
						//nb. the reason that the message is "unspecified error"
						//is that I don't actually know what causes it
						//so "unspecified" is the most I can tell you!
						THIS._stylesheets.push({
							'ssid' : stylesheets[i].__ssid,
							'href' : MESSAGE_UNKNOWN,
							'owner' : MESSAGE_UNKNOWN,
							'media' : MESSAGE_UNKNOWN,
							'stylesheet' : NULL_VALUE,
							'rules' : 0,
							'message' : ERROR_UNSPECIFIED
							});
	
						//remove it from this array
						stylesheets.splice(i, 1);
						i --;
					}
				}
			}
			
			//or if it has an owningElement property then this is IE's implementation
			//which we have to parse using IE's proprietary nastiness
			//well, I say "nastiness", it's not really all that bad,
			//and at least it doesn't do all the aggressive value normalization that firefox does
			//it's just the way it normalizes all selectors and property names to uppercase
			//which is annoying and ugly and pisses me off
			//it's bad enough that it does that for HTML tag names, 
			//but at least it has the excuse of that being the canonical form
			else if(typeof stylesheets[i].owningElement != TYPE_UNDEFINED)
			{
				parseIEStyleSheet(
					stylesheets[i], 
					stylesheets[i].owningElement.nodeName.toLowerCase(),
					//the trim probably isn't necessary, but better safe than sorry!
					trim(stylesheets[i].media) != '' ? trim(stylesheets[i].media) : MEDIA_ALL
					);
			}
		}
		
		//do a final sort of the _stylesheets array, putting it in ssid order
		//this is for IE's benefit which generates the ssids in occurence order
		//but builds the array in rule order; so this sort will bring it
		//into line with other browsers so they all output the same occurence order
		THIS._stylesheets.sort(function(a, b) { return a.ssid - b.ssid; });
		
		//nullify and delete the ssidcounter
		THIS.ssidcounter = NULL_VALUE;
		delete THIS.ssidcounter;
		
		//if the watch setting is true, watch for changes in disabled state
		if(watch == BOOLEAN_TRUE) { watchStyleSheets(); }
		
		//call the oncomplete callback, if defined
		if(typeof oncomplete == TYPE_FUNCTION) 
		{ 
			oncomplete(); 
		}
	}
	
	//parse an individual stylesheet using DOM 2 CSS
	function parseStyleSheet(sheet, owner, media)
	{
		//check if we already have this stylesheet data 
		//which we can only do for stylesheets that have an href
		//and will only be caused by duplicate stylesheet includes
		//we also have to check that the href is not the same as base
		//which can happen in firefox 2 for <style> elements, rather than href being null
		if(sheet.href && sheet.href != base)
		{
			var testhref = qualifyHREF(sheet.href, base);
			if(arrayContains(THIS._stylesheets, testhref, 'href') != NULL_VALUE)
			{
				//add duplication data to the debug stylesheets array
				THIS._stylesheets.push({
					'ssid' : sheet.__ssid,
					'href' : testhref,
					'owner' : owner,
					'media' : media,
					'stylesheet' : NULL_VALUE,
					'rules' : 0,
					'message' : MESSAGE_DUPLICATE
					});
					
				//however if there are duplicate stylesheets, 
				//subsequently disabling one of them (ie. through stylesheet switching)
				//will cause the other one's rules to take effect, which the script
				//won't be aware of because its rules are not included
				//so since we don't have the option of just including duplicates 
				//because of the possibility of infinite recursion, 
				//what we'll do instead is just forcibly disable any duplicates we find
				//(although infinite recursion will be prevented by the browser in this case,
				//it can still happen in IE because of the way we get the data
				//and so we have to do it here so that the data set is x-browser consistent)
				sheet.disabled = BOOLEAN_TRUE;
				
				//and we're done here
				return;
			}
		}
		
		//try to get the cssRules collection from this stylesheet
		//and pass it along with the other input references
		//to the standard rules collection parsing method
		try
		{
			//is this stylesheet disabled
			var isdisabled = sheet.disabled;
			
			//in opera, the stylesheet returns as disabled if it applies to media
			//other than the one currently in force, such as "print" when the view is "screen"
			//so what we'll do is temporarily switch the media to whatever the current view is
			//then read its disabled property again, to find out if it's
			//really disabled or just applicable to a non-view media
			//this happens so fast that no visual change should be apparent
			if(OPERA && isdisabled && sheet.media.length > 0)
			{
				var realmedia = sheet.media.mediaText;
				sheet.media.mediaText = THIS._viewmedia;
				isdisabled = sheet.disabled;
				sheet.media.mediaText = realmedia;
			}
		
			//if the stylesheet is not disabled							
			if(!isdisabled)
			{
				//count the number of ordinary rules
				for(var rules=sheet.cssRules, rulecount=0, i=0; i<rules.length; i++)
				{
					if(rules.item(i).type == 1) 
					{ 
						rulecount++; 
					}
					else if(rules.item(i).type == 4)
					{
						for(var subrules=rules.item(i).cssRules, j=0; j<subrules.length; j++)
						{
							//no need to recur further than this, 
							//because nested @media are not allowed
							if(subrules.item(j).type == 1) { rulecount++; }
						}
					}
				}
				
				//set the ok message for the debug stylesheet array
				var message = MESSAGE_OK;
			}
			
			//if it is disabled, set the rulecount to zero
			//and the message to "stylesheet is disabled"
			else
			{
				rulecount = 0;
				message = MESSAGE_DISABLED;
			}
			
			//add data to the debug stylesheets array
			//checking that the href is not the same as base
			//which can happen in firefox 2 for <style> elements, 
			//rather than href being null (which is what we want to record)
			THIS._stylesheets.push({
				'ssid' : sheet.__ssid,
				'href' : (sheet.href && sheet.href != base)
							? qualifyHREF(sheet.href, base) 
							: NULL_VALUE,
				'owner' : owner,
				'media' : media,
				'stylesheet' : sheet,
				'rules' : rulecount,
				'message' : message
				});

			//if it's not disabled, parse the stylesheet
			if(!isdisabled)
			{
				parseCSSRules(sheet, sheet.cssRules, owner, media);
			}
		}
		
		//it will only fail because of a security error
		//if the stylesheet is on a different domain
		catch(err) 
		{ 
			//add data to the debug stylesheets array
			//checking that the href is not the same as base
			//which can happen in firefox 2 for <style> elements, 
			//rather than href being null (which is what we want to record)
			THIS._stylesheets.push({
				'ssid' : sheet.__ssid,
				'href' : (sheet.href && sheet.href != base) 
							? qualifyHREF(sheet.href, base) 
							: NULL_VALUE,
				'owner' : owner,
				'media' : media,
				'stylesheet' : NULL_VALUE,
				'rules' : 0,
				'message' : ERROR_SECURITY
				});
		}
	}
	
	//parse a collection of css rules using DOM 2 CSS 
	//this creates an array that's in order of occurence, where rules in
	//import stylesheets that are declared at the top occur before 
	//rules inside the stylesheet, and rules in @media block occur where they occur
	function parseCSSRules(sheet, rules, owner, media)
	{
		//iterate through the rules collection
		//we're actually going to iterate separately three times
		//for @imports, rules, and media blocks
		//and do them separately so that we can control the order of execution
		//if don't do that then we'll may end up passing the wrong arguments back through
		//eg. an import will call it before the rules within a stylesheet
		//and we'll end up recording those rules with the import's media
		//we have to do the imports first so that the overall rule indices remain accurate
		//to their source order, which may be crucial when it comes to sorting
		for(i=0; i<rules.length; i++)
		{
			//save a shortcut reference
			rule = rules.item(i);
		
			//if it's an @import
			if(rule.type == 3)
			{
				//get the media from the rule itself
				//or if that's empty get it from the stylesheet's parent stylesheet
				//or if that's empty set it to default 
				media = rule.media.mediaText;
				if(media == '') 
				{ 
					//this exception handling is for safari, where if the parent
					//stylesheet is an @import then it doesn't have a media object
					//the media object belongs to its ownerRule object instead
					try { media = rule.parentStyleSheet.media.mediaText; }
					catch(err) { media = rule.parentStyleSheet.ownerRule.media.mediaText; }
				}
				if(media == '') { media = MEDIA_ALL; }
			
				//convert the value to lower case
				media = media.toLowerCase();
				
				//then adjust the media type if necessary to take account of the context
				//and so on for as many parent contexts as there are
				var parent = rule.parentStyleSheet;
				while(parent)
				{
					//this exception handling is for safari, where if the parent
					//stylesheet is an @import then it doesn't have a media object
					//the media object belongs to its ownerRule object instead
					try { var context = parent.media.mediaText; }
					catch(err) { context = parent.ownerRule.media.mediaText; }

					if(context == '') { context = MEDIA_ALL; }
					media = contextualizeMediaTypes(context, media);
					
					//this condition is to catch a difference in parent stylesheet reference
					//when the stylesheet object is an @import in safari
					if((SAFARI || KONQUEROR || WEBKIT) && !parent.parentStyleSheet && parent.ownerRule)
					{
						parent = parent.ownerRule.parentStyleSheet;
					}
					else
					{
						parent = parent.parentStyleSheet;
					}
				}
				
				//get the nested stylesheet reference from this rule
				//assign it an ssid, and then pass it back to the parseStyleSheet method
				//along with an owner name and media to save with the rule
				rule.styleSheet.__ssid = THIS.ssidcounter++;
				parseStyleSheet(rule.styleSheet, '@import', media);
			}
		}
		
		//now iterate again and look for normal rules
		for(var i=0; i<rules.length; i++)
		{
			//save a shortcut reference
			var rule = rules.item(i);
			
			//if this is a regular style rule
			if(rule.type == 1)
			{
				//if owner is "link", "style" or "xml-stylesheet" then this is a normal rule
				//(as opposed to being inside a @media or @import for which media was passed in as an argument)
				//so get the media from the rule's parent stylesheet
				//or if that's empty set it to default 
				//nb. we're splitting the media-getting routines into the rule-type conditions
				//rather than doing them all at once in this condition
				//because safari returns null for rule.parentRule
				if(/^(xml\-stylesheet|link|(([a-z]+:)?style))$/i.test(owner))
				{
					media = rule.parentStyleSheet.media.mediaText;
					if(media == '') { media = MEDIA_ALL; }
				
					//convert the value to lower case
					media = media.toLowerCase();
				}
				
				//we may have to parse the style.cssText to add !important to any !important rules
				//because in Opera (maybe others) the "!important" token itself is not included in the cssText
				//however we can get it from the getPropertyPriority method for each individual property
				//though it is quite a lot of farting about, it has to be done
				//we can't do it any later than now because we won't have the cssRule reference any more;
				//so ... begin by getting the cssText and stripping any line breaks 
				var styletext = rule.style.cssText.replace(/[\r\n]/g, ' ');
				
				//split the cssText by semi-colons
				styletext = styletext.split(';');
				
				//then iterate through the results and splt each one by its first colon
				for(var c=0; c<styletext.length; c++)
				{
					//this convoluted funkiness is because IE failed to return
					//any matches when a first-colon regex was used, so instead we split
					//by all colons and then join together any excess matches
					//even though IE doesn't actually run this particular bit of code anyway,
					//it was simpler just to use the same code pattern everywhere we need to do this
					styletext[c] = styletext[c].split(':');
					while(styletext[c].length > 2) { styletext[c][1] += ':' + styletext[c].pop(); }
								
					//if we only have one match, the most likely reason
					//is that the semi-colon split operation latched onto
					//a semi-colon that wasn't a property delimeter
					//probably it was inside generated content
					//and hence the value we're splitting doesn't contain a colon at all
					//so if that happens we'll just have to remove it and continue
					//it would happen sooner or later anyway for such a rule, so it's no ultimate loss
					if(styletext[c].length == 1) 
					{ 
						styletext.splice(c, 1);
						c--;
						continue; 
					}
					
					//add !important to the property definition if applicable
					//and if it doesn't already have that flag
					//(we need to check for an end-substring so that we don't get confused
					//	by a content property with "!important" in its text 
					// (which is possible, however improbable!))
					if(rule.style.getPropertyPriority(trim(styletext[c][0])) == 'important'
						&& !IMPORTANT_RULE.test(styletext[c][1]))
					{
						styletext[c][1] += ' !important';
					}
					
					//join it back together
					styletext[c] = styletext[c].join(':');
				}
				
				//and join the whole thing back together
				styletext = styletext.join(';');

				//add this rule object to the array
				//qualifying the href if it's not null
				THIS._cssRules.push({
					'selector' : rule.selectorText,
					'css' : styletext,
					'media' : media,
					'owner' : owner,
					'href' : sheet.href == NULL_VALUE ? NULL_VALUE : qualifyHREF(sheet.href, base),
					'ssid' : sheet.__ssid
					});
			}
		}
		
		//now iterate again and look for @media blocks
		for(i=0; i<rules.length; i++)
		{
			//save a shortcut reference
			rule = rules.item(i);
			
			//if it's an @media
			if(rule.type == 4)
			{
				//get the media from the rule itself
				//or if that empty get it from the parent stylesheet
				//		which is possible - Firefox and IE support "@media { ... }"
				//		treating it is "@media all"; however Opera and Safari reject
				//		such rules, not including them in the cssRules collection at all
				//or if that's empty set it to default 
				media = rule.media.mediaText;
				if(media == '') { media = rule.parentStyleSheet.media.mediaText; }
				if(media == '') { media = MEDIA_ALL; }
			
				//convert the value to lower case
				media = media.toLowerCase();
				
				//then adjust the media type if necessary to take account of the context
				//and so on for as many parent contexts as there are
				var parent = rule.parentStyleSheet;
				while(parent)
				{
					//this exception handling is for safari, where if the parent
					//stylesheet is an @import then it doesn't have a media object
					//the media object belongs to its ownerRule object instead
					try { var context = parent.media.mediaText; }
					catch(err) { context = parent.ownerRule.media.mediaText; }
					
					if(context == '') { context = MEDIA_ALL; }
					media = contextualizeMediaTypes(context, media);
					
					//this condition is to catch a difference in parent stylesheet reference
					//when the stylesheet object is an @import in safari
					if((SAFARI || KONQUEROR || WEBKIT) && !parent.parentStyleSheet && parent.ownerRule)
					{
						parent = parent.ownerRule.parentStyleSheet;
					}
					else
					{
						parent = parent.parentStyleSheet;
					}
				}
				
				//get the nested rules collection from this rule
				//and then pass it back to the parseCSSRules method
				//along with this stylesheet reference
				//and an owner name and media to save with the rule
				parseCSSRules(sheet, rule.cssRules, '@media', media);
			}
		}
		
		//for any other kind of rule we're not interested
	}

	//parse an individual stylesheet for IE
	function parseIEStyleSheet(sheet, owner, media, href)
	{
		//check if we already have this stylesheet data 
		//which we can only do for stylesheets that have an href
		//and will only be caused by duplication stylesheet includes
		//this is particularly necessary because it prevents infinite recursion
		//for example, where two stylesheets import each other
		if(sheet.href)
		{
			var testhref = qualifyHREF(sheet.href, base);
			if(arrayContains(THIS._stylesheets, testhref, 'href') != NULL_VALUE)
			{
				//add duplication data to the debug stylesheets array
				THIS._stylesheets.push({
					'ssid' : sheet.__ssid,
					'href' : testhref,
					'owner' : owner,
					'media' : media,
					'stylesheet' : NULL_VALUE,
					'rules' : 0,
					'message' : MESSAGE_DUPLICATE
					});
				
				//however if there are duplicate stylesheets, 
				//subsequently disabling one of them (ie. through stylesheet switching)
				//will cause the other one's rules to take effect, which the script
				//won't be aware of because its rules are not included
				//so since we don't have the option of just including duplicates 
				//because of the possibility of infinite recursion, 
				//what we'll do instead is just forcibly disable any duplicates we find
				sheet.disabled = BOOLEAN_TRUE;
				
				//and we're done here
				return;
			}
		}
		
		//create a temporary array for storing any imports we find
		//that we'll then pass back to this method at the end
		//we could just pass them back as soon as we find them
		//but storing them and doing it at the end ensures that
		//the original order is preserved for the debug stylesheets array
		var importsheets = [];	
		
		//is this stylesheet disabled
		var isdisabled = sheet.disabled;

		//if the stylesheet is not disabled							
		if(!isdisabled)
		{
			//first of all go through the imports collection
			for(var i=0; i<sheet.imports.length; i++)
			{
				//IE doesn't support @import with a media type
				//but they do still show up in the imports collection
				//even though they're not effective
				//so we have to check for this by testing the 
				//length of the import's rules collection
				//and if its zero just don't include the stylesheet
				if(sheet.imports[i].rules.length == 0) { continue; }
				
				//get the media from the owner stylesheet
				//or if that's empty set it to default
				media = trim(sheet.media);
				if(media == '') { media = MEDIA_ALL; }
				
				//get and qualify the href from the import
				//nb. we need to use a different variable name here
				//so that we don't affect the input href argument
				var ihref = qualifyHREF(sheet.imports[i].href, base);
					
				//add the impored stylesheet to the imports array
				//along with an owner reference, the effective media, and its href
				importsheets.push({
					'sheet' : sheet.imports[i], 
					'owner' : '@import', 
					'media' : media, 
					'href' : ihref
					});
			}
		}
		
		//if we have any imports, assign each one an ssid,
		//and then pass it back to this method
		//we do this before checking the other rules in this stylesheet
		//so that the overall rule indices accurately reflect source order
		if(importsheets.length > 0)
		{
			for(var i=0; i<importsheets.length; i++)
			{
				importsheets[i].sheet.__ssid = THIS.ssidcounter++;
				parseIEStyleSheet(
					importsheets[i].sheet, 
					importsheets[i].owner, 
					importsheets[i].media, 
					importsheets[i].href
					);
			}
		}

		//now we have to make a manul rules collection from the stylesheet's cssText
		//otherwise we won't be able to get info about @media blocks
		//because they're just not included in the rules collection at all
		try
		{
			//if the stylesheet is not disabled							
			if(!isdisabled)
			{
				//first copy the text
				var styletext = sheet.cssText;
				
				//remove any @import, @charset and @namespace statements
				styletext = styletext.replace(/@(import|charset|namespace)[^;]+;/igm, '');	
				
				//remove any @font-face and @page declarations
				styletext = styletext.replace(/@(font\-face|page)[^\}]+\}/igm, '');

				//do token replacements for generated content
				//to avoid confusion in case it contains any brace characters
				//this regex is different from the one we used in author mode
				//because IE6 normalizes generated content to have no quotes around it
				//and all versions put their expressions at the end of the group
				//but since we still have line breaks at this point, 
				//we can use the end of line marker to delimit the match expression
				//however we don't have line-breaks within a block of CSS
				//so just in case the ordering is not consistent
				//we'll make semi-colon an alternative delimiter
				var gencontent = styletext.match(/(content\s*:\s*[\'\"].*(;|$))/igm);
				if(gencontent)
				{
					for(var g=0; g<gencontent.length; g++)
					{
						styletext = styletext.replace(gencontent[g], '[G' + g + ']');
					}
				}
				
				//then trim and split the result by closing-brace characters
				styletext = trim(styletext).split('}');
				
				//iterate through the resulting lines 
				//trim and split each one again, by the opening brace character
				for(var i=0; i<styletext.length; i++)
				{
					styletext[i] = trim(styletext[i]).split('{');
					for(var j=0; j<styletext[i].length; j++)
					{
						styletext[i][j] = trim(styletext[i][j]);
					}
				}
				
				//then iterate again through the resulting matrix
				//to convert any generated content tokens back to their real value
				if(gencontent)
				{
					for(var g=0; g<gencontent.length; g++)
					{
						for(var i=0; i<styletext.length; i++)
						{
							for(var j=0; j<styletext[i].length; j++)
							{
								styletext[i][j] = styletext[i][j].replace('[G' + g + ']', gencontent[g]);
							}
						}
					}
				}
				
				//if href is undefined, get and qualify the href from the stylesheet, 
				//unless it's null or empty, in which case its null 
				//nb. we only really need to test empty, 
				//but I feel safer testing null as well
				if(typeof href == TYPE_UNDEFINED)
				{		
					href = (sheet.href == NULL_VALUE || sheet.href == '') 
							? NULL_VALUE 
							: qualifyHREF(sheet.href, base);
				}
				
				//now build a rules collection 
				var rules = []; 
				
				//we identify changes in media by an odd number of members in a group of text lines
				//beginning with the default media value from the stylesheet
				//if the value is empty then set it to default 
				var currentmedia = sheet.media;
				if(currentmedia == '') { currentmedia = MEDIA_ALL; }
	
				//we identify changes in owner the same way
				var currentowner = owner;
				
				//iterate through the text lines
				for(var i=0; i<styletext.length; i++)
				{
					//if we have two members this is just a normal rule pair
					if(styletext[i].length == 2)
					{
						rules.push({
							'selector' : styletext[i][0],
							'css' : styletext[i][1],
							'media' : currentmedia,
							'owner' : currentowner,
							'href' : href,
							'ssid' : sheet.__ssid
							});
					}
					//if we have three then the first is an opening @media declaration
					//which we can edit to get the actual media value
					else if(styletext[i].length == 3)
					{
						currentmedia = trim(styletext[i][0].replace('@media', '')).toLowerCase();
						currentowner = '@media';
						
						//adjust the media type if necessary to take account of the context
						var context = sheet.media;
						if(context == '') { context = MEDIA_ALL; }
						currentmedia = contextualizeMediaTypes(context, currentmedia);
						
						rules.push({
							'selector' : styletext[i][1],
							'css' : styletext[i][2],
							'media' : currentmedia,
							'owner' : currentowner,
							'href' : href,
							'ssid' : sheet.__ssid
							});
					}
					//if we have one then it's closing an @media declaration
					else if(styletext[i].length == 1)
					{
						currentmedia = sheet.media;
						if(currentmedia == '') { currentmedia = MEDIA_ALL; }
						
						currentowner = owner;
					}
				}
			
				//set the message for the debug array to "ok"
				var message = MESSAGE_OK;
			}
			
			//if it is disabled, set the message to "stylesheet is disabled"
			else
			{
				message = MESSAGE_DISABLED;
			}

			//if the stylesheet is not disabled
			//pass this custom rules collection to parseIECSSRules
			//which returns the final rule count
			if(!isdisabled)
			{
				var rulecount = parseIECSSRules(rules);
			}

			//add data to the debug stylesheets array
			THIS._stylesheets.push({
				'ssid' : sheet.__ssid,
				'href' : sheet.href 
							? qualifyHREF(sheet.href, base) 
							: NULL_VALUE,
				'owner' : owner,
				'media' : media,
				'stylesheet' : sheet,
				'rules' : !isdisabled ? rulecount : 0,
				'message' : message
				});
		}
		
		//it will only fail because of a security error
		//if the stylesheet is on a different domain
		catch(err) 
		{ 
			//add data to the debug stylesheets array
			THIS._stylesheets.push({
				'ssid' : sheet.__ssid,
				'href' : sheet.href 
							? qualifyHREF(sheet.href, base) 
							: NULL_VALUE,
				'owner' : owner,
				'media' : media,
				'stylesheet' : NULL_VALUE,
				'rules' : 0,
				'message' : ERROR_SECURITY
				});
		}
		
	}

	//parse a collection of css rules using IE proprietary nastiness
	//this creates an array in order of occurence, where rules in
	//import stylesheets that are declared at the top occur before 
	//rules inside the stylesheet, and rules in media block occur where they occur
	function parseIECSSRules(rules)
	{
		//store the number of rules that actually get added
		//we used to do this by counting the pre-cursor "rules" array 
		//but not all of them end up in the final cssRules array, 
		//which this count only includes
		var rulecount = 0;
		
		//iterate through the rules collection
		for(var i=0; i<rules.length; i++)
		{
			//if the selector is empty, unknown, or contains an unknown pseudo-node, 
			//just ignore it and continue on to the next rule
			//(IE has a cutely-obvious way of indicating unknown syntax in css :))
			if(rules[i].selector == '' 
				|| rules[i].selector == 'UNKNOWN' 
				|| rules[i].selector.indexOf(':unknown') != -1) { continue; }
			
			//add this rule object to the array, and along the way
			//parse the selectorText string to lowercase all the element type selectors
			//and parse the cssText string to lowercase all the property names
			THIS._cssRules.push({
				'selector' : lowercaseIETypeSelectors(rules[i].selector),
				'css' : lowercaseIEPropertyNames(rules[i].css),
				'media' : rules[i].media,
				'owner' : rules[i].owner,
				'href' : rules[i].href,
				'ssid' : rules[i].ssid
				});
			
			//increase the rule count
			rulecount ++;
		}
		
		//return the final rule count
		return rulecount;
	}



	
	//-- other private css-related methods --/
	
	//getCSSRules return all the rule objects that apply to an element
	//each of these is a custom object compiled with the most useful information
	//rather than actually being a cssRule object, so that the results are consistent cross browser
	function getCSSRules(element, media, accept, altstates, rules, inherited, ancestors)
	{
		//no processing of the first two arguments happens here
		//we require them to have been pre-processed before calling this

		//process the accept argument (if necessary)
		//it will never be undefined at this point, but it may still be a string
		//(when called by most public methods) or already an object 
		//(when called from a recursion of this method, or from its public equivalent)
		accept = processAcceptArgument(accept);

		//if rules is undefined or null, define a new array
		if(typeof rules == TYPE_UNDEFINED || rules == NULL_VALUE) { rules = []; }
		
		//if inherited is undefined or null, set it to false
		if(typeof inherited == TYPE_UNDEFINED || inherited == NULL_VALUE) { inherited = BOOLEAN_FALSE; }
		
		//if ancestors is undefined or null, create an array beginning with this element
		//we'll maintain an array of all the elements we check
		//which we'll need when it comes to determine the selector specificity
		//so that we can reject those that don't apply
		if(typeof ancestors == TYPE_UNDEFINED || ancestors == NULL_VALUE) 
		{ 
			ancestors = [element]; 
			
			//if the element has a style attribute, and the "attributes" setting is true,
			//add a temporary member to the end of the cssRules array containing its data
			//this means its index value will place it as the very last rule to be defined
			//which in source-order specificity terms is exactly right
			//however in IE getAttribute('style') returns an object not a string
			//which we can deal with in the createStyleAttributeRule method
			//but it means that it will always pass this test, even when
			//the element has no style attribute; if that happens, or if the 
			//style attribute is empty, the create method will return null
			//so we save the return value and test it before adding it to the array
			if(attributes == BOOLEAN_TRUE && element.getAttribute('style'))
			{
				var stylerule = createStyleAttributeRule(element);
				if(stylerule != NULL_VALUE)
				{
					THIS._cssRules.push(stylerule);
				}
			}
		}
		//otherwise add this element to the existing array
		else 
		{ 
			ancestors.push(element); 
		}
		
		//now iterate through all the stored cssRules
		for(var i=0; i<THIS._cssRules.length; i++)
		{
			//if the rule doesn't match the input media criteria, we don't want it
			if(!mediaMatches(media, THIS._cssRules[i])) { continue; }
			
			//if this is a temporary style attribute rule
			//and the element argument is the original input element reference
			//create a nodes array containing just the input element
			//so that it passes straight through as a single found match
			//and set the altstate variable for it to false
			//because style attributes apply to all states
			//this will make sure that its properties are correctly sorted
			if(THIS._cssRules[i].owner == '@style' && element == ancestors[0]) 
			{ 
				var nodes = [element],
					altstate = BOOLEAN_FALSE;
			}
			
			//otherwise, see if this selector matches any elements
			else 
			{ 
				//if the altstates argument is true, do a pre-search for this element
				//with the original selector, not edited for pseudo-classes
				//so we can compare to know whether it matched without editing, or only with editing
				if(altstates == BOOLEAN_TRUE)
				{
					for(var altstate = BOOLEAN_TRUE,
							allnodes = getElementsBySelector(THIS._cssRules[i].selector),
							j=0; j<allnodes.length; j++)
					{
						if(allnodes[j] == element)
						{
							altstate = BOOLEAN_FALSE;
							break;
						}
					}
				}
				//or if altstates is false then all matches will be by default, not alt states
				else 
				{ 
					altstate = BOOLEAN_FALSE; 
				}
				
				//now do the real search, and if the altstates argument is true, 
				//remove pseudo-classes except not() from the test selector;
				//otherwise pass it in unedited
				nodes = getElementsBySelector(
							altstates == BOOLEAN_TRUE
								? THIS._cssRules[i].selector.replace(REGEX_PSEUDO_CLASSES_EXCEPT_NOT, '')
								: THIS._cssRules[i].selector
								); 
			}
			
			//if we have matches, search them looking for the input element reference
			if(nodes.length > 0)
			{
				for(var j=0; j<nodes.length; j++)
				{
					//and if we find it add the specified rule to the rules array
					if(nodes[j] == element)
					{
						//create an inheritance path array, which must be a copy not a reference
						//otherwise when we come to copy it into the output, 
						//it will be the same (its final state) every time
						//we'll also do it in reverse so that 
						//we get an array that's in top-down DOM order
						var inheritance = [];
						if(inherited)
						{
							for(var a=ancestors.length-1; a>0; a--)
							{
								inheritance.push(ancestors[a]);
							}
						}
						
						//create a rule object to add to the array, starting with 
						//the selectors, css, index in the rule array,
						//or altstates is true and the selector only applies to an altstate
						//a placeholder for its specificity (which we'll work out 
						//once we've got all the rules), its current inheritance path 
						//and a flag to indicate whether it actually applies to the element in its current state
						//all of which we need irrespective of whether they're included
						//in the accept dictionary; so for any that are not, 
						//we'll delete them at the end once all the other processing is done
						var ruleobj = {
							'selector' : THIS._cssRules[i].selector,
							'css' : THIS._cssRules[i].css,
							'index' : i,
							'specificity' : [0,0,0,0],
							'inheritance' : inheritance,
							'altstate' : altstate
							};				
							
						//then add the properties which are optional and only included 
						//if they're listed in the accept dictionary, or it's "*";
						//apart from "properties" which we deal with later
						for(var optionalprops = ['media','xmedia','owner','ssid','href'], 
								k=0; k<optionalprops.length; k++)
						{
							if(accept == '*' || typeof accept[optionalprops[k]] != TYPE_UNDEFINED)
							{
								//we need this condition because the "xmedia"
								//property is only available in author mode
								if(typeof THIS._cssRules[i][optionalprops[k]] != TYPE_UNDEFINED) 
								{
									ruleobj[optionalprops[k]] = THIS._cssRules[i][optionalprops[k]];
								}
							}
						}
						
						//add this rule object to the rules array
						rules.push(ruleobj);
						
						//we'll only find it once!
						break;
					}
				}
			}
		}
		
		//if this element has a parent element, recur on that
		//so that we get inherited rules as well
		if(element.parentNode && element.parentNode.nodeType == 1)
		{
			return getCSSRules(element.parentNode, media, accept, altstates, rules, BOOLEAN_TRUE, ancestors);
		}

		//otherwise we can proceed to process the finished rules array
		else
		{
			//if we have no rules we can just return the empty array and we're done
			//as well as saving some process, this also means that we can save adding
			//a condition to the bit at the bottom which removes any added @style rule
			//which we'd otherwise have to check against (THIS._cssRules.length > 0)
			if(rules.length == 0) { return rules; }
			
			//first we have to sort it so it's in primary order of specificity
			//with a secondary order by source index, and a tertiary order by inheritance chain depth
			//so begin by iterating through the rules to get their specificities
			for(var i=0; i<rules.length; i++)
			{
				//extract the selector from this rule and split into individuals
				var selectors = rules[i].selector.split(',');
				
				//now we need to pass each selector to the getSelectorSpecificity method
				//(unless it's inherited in which case it has zero specificity)
				//so we get an array of all the specificities that apply to the overall selector
				for(var specs=[], j=0; j<selectors.length; j++)
				{
					specs.push(
						rules[i].inheritance.length > 0 
								? [0,0,0,0] 
								: getSelectorSpecificity(selectors[j])
								);
				}

				//now inverse sort the resulting array, so that the largest is first
				specs.sort(function(a, b)
				{
					if(a[0] !== b[0]) { return b[0] - a[0]; }
					if(a[1] !== b[1]) { return b[1] - a[1]; }
					if(a[2] !== b[2]) { return b[2] - a[2]; }
					return b[3] - a[3];
				});

				//then save the highest value, because obviously that's the one
				//that determines the specificity of the rule's properties to this element
				rules[i].specificity = specs[0];
			}
			
			//now we have the specificity data we can sort the rules array by it
			rules.sort(function(a, b)
			{
				//if the specificity values are the same
				if(a.specificity.toString() === b.specificity.toString()) 
				{ 
					//if the source index values are also the same, 
					//sort on inverse inheritance depth
					//so that the highest elements come before the deepest elements
					if(a.index === b.index) 
					{ 
						return b.inheritance.length - a.inheritance.length; 
					}
					
					//otherwise sort on source index
					return a.index - b.index; 
				}
				
				//otherwise sort on specificity
				if(a.specificity[0] !== b.specificity[0]) 
				{ 
					return a.specificity[0] - b.specificity[0]; 
				}
				if(a.specificity[1] !== b.specificity[1]) 
				{ 
					return a.specificity[1] - b.specificity[1]; 
				}
				if(a.specificity[2] !== b.specificity[2]) 
				{ 
					return a.specificity[2] - b.specificity[2]; 
				}
				return a.specificity[3] - b.specificity[3];
			});
			
			//if "properties" is included in the accept dictionary, or its "*"
			//we need to add and then sort the individual properties for the rules
			//"sort" in this case means to organise the data so that each member 
			//is a further object with value and status properties, rather than just a value
			//ie. each has the form {"color":{"value":"red","status":"active"} rather than just {"color":"red"}
			//and the "status" value can be "active", "cancelled" or "inactive" (for altstate rules)
			//this replaces what used to be separate properties,xproperties,nproperties objects
			//the second argument instructs the method to do that sort,
			//which if it's false will only return an unsorted properties object,
			//which setting is used by the getCSSStyleSheetRules method
			if(accept === "*" || typeof accept.properties != TYPE_UNDEFINED)
			{
				rules = addSortedProperties(rules, BOOLEAN_TRUE);
			}
			
			//if accept is not "*", then for each of the options 
			//"selector","css","index","specificity", "inheritance" and "altstate", 
			//if the accept dictionary didn't include it, delete it from each rule object
			//first nullifying it to ensure garbage collection in IE
			if(accept !== "*")
			{
				for(var i=0; i<rules.length; i++)
				{
					for(var props=['selector','css','index','specificity','inheritance','altstate'], 
							j=0; j<props.length; j++)
					{
						if(typeof accept[props[j]] == TYPE_UNDEFINED)
						{
							rules[i][props[j]] = NULL_VALUE;
							delete rules[i][props[j]];
						}
					}
				}
			}

			//if we added a temporary rule object 
			//for the element's style attribute, remove it again
			if(THIS._cssRules[THIS._cssRules.length - 1].owner == '@style')
			{
				THIS._cssRules.splice(THIS._cssRules.length - 1, 1);
			}
		
			//and return the final rules array
			return rules;
		}
	}
	
	//create a rule object for the cssRules array 
	//that represents an element's style attribute
	function createStyleAttributeRule(element)
	{
		//if this is internet explorer we can't get the css text from the style attribute
		//because the style attributes return a style object, not a string,
		//even when you use the incorrectly-documented second argument 
		//[see: http://reference.sitepoint.com/javascript/Element/getAttribute#compatibilitysection]
		//but we can extract it from the element's outerHTML using match() (lol)
		//and then pass it to the lowercaseIEPropertyNames method to normalize the case
		if(IEXPLORER)
		{
			//just in case this is XML and not HTML, we'll wrap it in try..catch
			//though it's very unlikely that if this is XML it will have a style attribute
			//I suppose it might be SVG, but then IE doens't support SVG. VML maybe?
			//whatever .. it's as well to be safe rather than allow a possible exception
			try
			{
				//here we can rely on the fact that IE normalizes the outerHTML
				//such that attributes are always a lowercase name and double-quoted
				//and any quotes inside values like url() are removed
				//remembering to split by the first closing angle bracket, so that we only get
				//the html of the element's opening tag, not everything inside it as well!
				//if the element doesn't have a style attribute the match will be null
				//so in that case set styletext to an empty string
				var matches = element.outerHTML.split('>')[0].match(/.*style\s*=\s*\"([^\"]*)\".*/im);
				var styletext = matches ? lowercaseIEPropertyNames(matches[1]) : '';
			}
			
			//in the unlikely event it fails for the reason noted, we just return an empty string
			catch(err) { styletext = ''; }
		}
		
		//for any other browser we can just grab it from the style attribute as text
		else 
		{ 
			styletext = element.getAttribute('style'); 
		}
		
		//if the styletext is empty, return null
		if(styletext == '') 
		{ 
			return NULL_VALUE; 
		}
		
		//else create a rule object
		var ruleobj = 
		{
			//the empty string selector signifies a style attribute, for user reference,
			//and particularly so that the the getSelectorSpecificity method can identify it
			'selector': '',
			'css' : styletext,
			'media': MEDIA_ALL,
			'owner' : '@style',
			'href' : NULL_VALUE,
			//the infinity value means that in a numerical sort it will always come out at the end
			//though tbh that isn't something I planned, it just worked out nicely that way :)
			//it had to be a number for consistency with other values, but any number I choose 
			//might conflict with an actual stylesheet, even a really high number
			//an alternative I considered was to use -1, which would be safe from conflict,
			//however that value already has a special meaning - it's a valid argument to
			//getCSSStyleSheetRules, which means "no specific stylesheet"
			'ssid' : Infinity
		};
			
		//add xmedia only in author mode
		if(mode == MODE_AUTHOR) 
		{ 
			ruleobj.xmedia = ruleobj.media; 
		}
			
		//return the finished rule object
		return ruleobj;
	}
	
	//extract the individual properties for a set of rules from each rule's css text 
	//then sort them according to which ones are precedent and which cancelled out
	//to add status flags - "active","cancelled" or "inactive" - to each property
	//this methods assumes that the rules set is already in order of specificity 
	//and that each one has information about its inheritance; as created by getCSSRules
	function addSortedProperties(rules, dosort)
	{
		//run through the rules
		for(var i=0; i<rules.length; i++)
		{
			//parse the css text to create a properties object
			rules[i].properties = parsePropertyText(
				rules[i].css, 
				{}, 
				(typeof rules[i].inheritance != TYPE_UNDEFINED 
					&& rules[i].inheritance.length > 0)
				);
				
			//create a re-organised copy in which each property 
			//is now a sub-object with "value" and "status" properties
			//then mark each status as "active" by default
			rules[i].allproperties = {};
			for(var j in rules[i].properties)
			{
				rules[i].allproperties[j] = {
					'value' : rules[i].properties[j].property,
					'status' : STATUS_ACTIVE
					};
			}
			
			//if the dosort argument is true
			if(dosort)
			{
				//if the altstate flag for this rule is true
				//change all the status flags to "inactive" 
				if(rules[i].altstate == BOOLEAN_TRUE)
				{
					for(var ip in rules[i].allproperties)
					{
						if(!rules[i].allproperties.hasOwnProperty(ip)) { continue; }

						rules[i].allproperties[ip].status = STATUS_INACTIVE;
					}							
				}
				
				//otherwise iterate from the start of the current collection up to now
				//in order to find and mark the cancelled properties
				else
				{
					for(var j=0; j<i; j++)
					{
						//for each of the properties in the earlier object
						for(var jp in rules[j].allproperties)
						{
							if(!rules[j].allproperties.hasOwnProperty(jp)
								|| rules[j].allproperties[jp].status != STATUS_ACTIVE) { continue; }
							
							//for each of the properties in this object
							for(var ip in rules[i].allproperties)
							{
								if(!rules[i].allproperties.hasOwnProperty(ip)
									|| rules[i].allproperties[ip].status != STATUS_ACTIVE) { continue; }
								
								//if we encounter this current properties in the earlier 
								//properties objects, change its status to "cancelled"
								//we do this for both inheritable and non-inheritable properties;
								//or rather: we do it for inheritable properties, or non-inheritable
								//properties where the previous rule is not inherited;
								//but we don't need to do that additional testing
								//because only non-inherited properties will be included
								//in the output of inherited rules
								if(jp == ip)
								{
									rules[j].allproperties[jp].status = STATUS_CANCELLED;
						
									//there will only be one
									break;
								}
							}
						}
					}
				}
			}
		}
		
		//if the dosort argument is true
		if(dosort)
		{
			//now we need to run through the cancelled properties 
			//to deal any with !important rules, so...
			for(var i=0; i<rules.length; i++)
			{
				//we're not interested in inherited properties, because they have no specificity
				//and therefore !important rules do not take precedence
				if(rules[i].inheritance.length > 0) { continue; }
				
				//run through the cancelled properties to look for !important
				//(we need to check for an end-substring so that we don't get confused
				//	by a content property with "!important" in its text),
				for(var j in rules[i].allproperties)
				{
					if(!rules[i].allproperties.hasOwnProperty(j)
						|| rules[i].allproperties[j].status != STATUS_CANCELLED) { continue; }
					
					//and if we find one
					if(IMPORTANT_RULE.test(rules[i].allproperties[j].value))
					{
						//it will take precedence
						var precedence = i;
	
						//then run through every subsequent object 
						//to look for later properties with the same name, 
						for(var x=i+1; x<rules.length; x++)
						{
							//and if we find a cancelled one that also has !important
							if(typeof rules[x].allproperties[j] != TYPE_UNDEFINED
								&& rules[x].allproperties[j].status == STATUS_CANCELLED
								&& IMPORTANT_RULE.test(rules[x].allproperties[j].value))
							{
								//then it will over-take precedence
								precedence = x;
							}
						}
						
						//then iterate from here to find the property identified as having precedence
						for(var x=i; x<rules.length; x++)
						{
							//and once we've found the property with precedence, 
							//change its status back to "active"
							if(x == precedence)
							{
								rules[x].allproperties[j].status = STATUS_ACTIVE;
								
								//and any earlier active instances of that property to which we did the same thing
								//then need their status changed back from "active" to "cancelled"
								for(var y=0; y<x; y++)
								{
									if(typeof rules[y].allproperties[j] != TYPE_UNDEFINED
										&& rules[y].allproperties[j].status == STATUS_ACTIVE)
									{
										rules[y].allproperties[j].status = STATUS_CANCELLED;
									}
								}
							}
							
							//and for any other instance of that property that's already "active"
							//update its status to "cancelled"
							else
							{
								if(typeof rules[x].allproperties[j] != TYPE_UNDEFINED
									&& rules[x].allproperties[j].status == STATUS_ACTIVE)
								{
									rules[x].allproperties[j].status = STATUS_CANCELLED;
									
									//there will only be one
									break;
								}
							}
						}
					}
				}
			}
			
			//now we need to deal with the interaction of shorthand and longhand properties
			//basically, if a shorthand property definition has precedence, then any earlier
			//longhand definitions of the same type are cancelled out; however the reverse 
			//is not true - if a longhand property takes precedence, then any earlier shorthand
			//properties remain listed as having precedence, because some of their properties still will
			//for eg. if a set of properties (in order, across the stack) goes: 
			//"margin-left -> margin" then the "margin-left" is cancelled out; but if it goes:
			//"margin -> margin-left" then the "margin" is not cancelled out; 
			//so...
			for(var i=0; i<rules.length; i++)
			{
				//for each active value in the properties object
				for(var j in rules[i].allproperties)
				{
					if(!rules[i].allproperties.hasOwnProperty(j)
						|| rules[i].allproperties[j].status != STATUS_ACTIVE) { continue; }
	
					//if this is a shorthand property definition
					//which we know simply by whether we have a longhands list for it
					if(typeof LONGHAND_PROPERTIES[j] != TYPE_UNDEFINED)
					{
						//run through every rule up to and including this one
						for(var x=0; x<=i; x++)
						{
							//run through the list of longhand properties that this shorthand property defines
							//and if we find an active one in the rule's properties, change its status to "cancelled"
							//we don't need to check whether the property is inhertiable for inherited rules
							//because non-inheritable properties won't even be listed (obviously)
							for(var p=0; p<LONGHAND_PROPERTIES[j].length; p++)
							{
								var longhand = LONGHAND_PROPERTIES[j][p];
								if(typeof rules[x].allproperties[longhand] != TYPE_UNDEFINED
									&& rules[x].allproperties[longhand].status == STATUS_ACTIVE)
								{
									//if we're examining this rule, only cancel out longhand properties 
									//that are defined earlier in the rule than the shorthand property we're inspecting
									//so to make that disctinction we need to work out the index of
									//the shorthand and longhand properties in question, if it's this rule
									//nb. this presumes that for..in iterates in order of the property being added
									//which is a correct presumption in all supported browsers
									if(x == i)
									{
										var n = 0;
										for(var q in rules[x].allproperties)
										{
											if(!rules[x].allproperties.hasOwnProperty(q)) { continue; }
											
											if(q == j) { var jindex = n; }
											if(q == longhand) { var pindex = n; }
											
											n++;
										}
									}
									
									//so go ahead and cancel the rule, if:
									//	we're not examining this rule;
									//	or the longhand property is earlier than the shorthand property, 
									//and: the rule does not have !important
									//(earlier checks will have already determined which important rule 
									// takes precedence, if there's more than one; we just have to 
									// make sure here that we don't mark it as cancelled, if applicable)
									if((x < i || pindex < jindex) 
										&& !IMPORTANT_RULE.test(rules[x].allproperties[longhand].value))
									{
										rules[x].allproperties[longhand].status = STATUS_CANCELLED;
									}
								}
							}
						}
					}
				}
			}
		}
		
		//iterate one more time to do final maintenance on the modified rules array
		for(var i=0; i<rules.length; i++)
		{
			//do a final sweep through the properties objects
			//converting any to null that have no members
			for(var j in rules[i])
			{
				if(!rules[i].hasOwnProperty(j)) { continue; }
				
				//we have to spell-out these conditions, not use a regex
				//so that they get converted by the compression routine
				//otherwise we'll end up with a condition that 
				//no longer matches the post-compression property names
				if((j == 'properties' || j == 'allproperties') && howmany(rules[i][j]) == 0)
				{
					rules[i][j] = NULL_VALUE;
				}
			}
			
			//copy allproperties to properties then delete it
			rules[i].properties = rules[i].allproperties;
			delete rules[i].allproperties;
			
			//then if the dosort argument is false
			//run through the properties and rationalize each property
			//so that it goes back to being simple name/value pairs
			//and we lose the status property, because none of them have been checked
			if(!dosort)
			{
				for(var k in rules[i].properties)
				{
					if(!rules[i].properties.hasOwnProperty(k)) { continue; }

					rules[i].properties[k] = rules[i].properties[k].value;
				}				
			}
		}
			
		//return the modified rules array
		return rules;
	}

	//get the specificity of a selector, using the rules defined in the CSS3 spec
	//http://www.w3.org/TR/css3-selectors/#specificity
	function getSelectorSpecificity(selector)
	{
		//create an object for storing the scores, 
		//ordered by specificity class: [style, id, class, type]
		var scores = [0,0,0,0];
		
		
		//if the selector is an empty string, this indicates a style attribute
		//so add 1 to the style score and return the scores array straight away
		if(selector === '')
		{
			scores[0] += 1;
			return scores;
		}
		
			
		//create an edited versions of the input selector 
		//that's stripped of all attribute selectors
		//which we can use to avoid confusion with attribute values
		//that look like other selectors, for example [href="index.html"] 
		//might otherwise be confused with a class selector ".html"
		var editedselector = selector.replace(REGEX_ATTR_SELECTORS, '');
		
		//look for ID selectors, which have the highest specificity category
		//use the selector that's been stripped of attribute selectors,
		//to avoid confusion with attribute values containing # symbols
		//and we should also check for valid characters and a valid ID pattern
		//nb. although "." is allowed in an ID value, 
		//we'd never be able to test it with an ID selector
		//because it will just be interpreted as an ID.class selector
		//matches from this regex will also include any pseudo-class or pseudo-elements
		//that immediately follow the ID selector, but that's doesn't matter
		var matches = editedselector.match(REGEX_ID_SELECTORS);
		
		//add the number of matches (if any) to the id score
		if(matches) { scores[1] += matches.length; }
		
		
		//look for class selectors, in almost exactly the same way 
		//and with the same caveats as an ID selector, except that
		//the valid syntax and pattern is slightly different
		var matches = editedselector.match(REGEX_CLASS_SELECTORS);
		
		//add the number of matches (if any) to the class score
		if(matches) { scores[2] += matches.length; }
		
		
		//look for attribute selectors in the unedited selector, 
		//these are the easiest to detect because there's 
		//no possibility of confusing them with anything else
		matches = selector.match(REGEX_ATTR_SELECTORS);
		
		//add the number of matches (if any) to the class score
		if(matches) { scores[2] += matches.length; }


		//look for any pseudo-class - except :not, which isn't counted
		//use the selector that's been stripped of attribute selectors
		//since there's a limited number of pseudos, we can test for each one specifically
		//nb. this will let through some fake permutations, like 
		//"only-child" or "first-last-of-type", but I don't think that's worth worrying about
		var matches = editedselector.match(REGEX_PSEUDO_CLASSES_EXCEPT_NOT);
		
		//add the number of matches (if any) to the class score
		if(matches) { scores[2] += matches.length; }
		
		
		//look for element type selectors, which is by far the hardest to do
		//because it's so easily confused for other types of selector
		//because it has no distinguishing tokens of its own, only the lack of them
		//so to begin with we'll use the selector that's been stripped of attribute selectors
		//then remove all pseudo-classes except :not(), and all pseudo-elements,
		//(but remove the actual word ":not", because XML element names are allowed to 
		//  contain colons and it would otherwise look like an element called ":not")
		//remove any namespace prefix (at the start of the selector, or inside a :not bracket)
		//and remove any ID or class selectors
		//then finally (if there's anything left!) check for valid tag name characters 
		var typeonlyselector = editedselector.replace(REGEX_PSEUDO_CLASSES_EXCEPT_NOT, '')
											 .replace(REGEX_PSEUDO_ELEMENTS, '')
											 .replace(/(:not)/ig, '')
											 .replace(/(^|\()([_a-z0-9-\.\\]+\|)/ig, '$1')
											 .replace(REGEX_ID_SELECTORS, '')
											 .replace(REGEX_CLASS_SELECTORS, '');
		var matches = typeonlyselector.match(/([_a-z0-9-:\\]+)/ig);
		
		//add the number of matches (if any) to the type score
		if(matches) { scores[3] += matches.length; }
		
		
		//and last but not least, look for pseudo-elements
		//use the selector that's been stripped of attribute selectors
		//then we can identify them easily and specifically, given such a limited range
		var matches = editedselector.match(REGEX_PSEUDO_ELEMENTS);
		
		//add the number of matches (if any) to the type score
		if(matches) { scores[3] += matches.length; }
		
		
		//return the final scores array
		return scores;
	}
	
	//parse a selectorText string for IE to lowercase the element type selectors
	function lowercaseIETypeSelectors(selectorstring)
	{
		//temporarily tokenize attribute selectors so that 
		//any all-uppercase attribute values are not affected
		var attrselectors = selectorstring.match(/(^|[^\(])(\[[^\]]+\])($|[^\)])/ig);
		if(attrselectors)
		{
			for(var a=0; a<attrselectors.length; a++)
			{
				//we only want the data in $2, but we don't have that much 
				//control over match(), so we'll have to edit them manually
				if(attrselectors[a].charAt(0) != '[') 
				{ 
					attrselectors[a] = attrselectors[a].substr(1, attrselectors[a].length - 1);
				}
				if(attrselectors[a].charAt(attrselectors[a].length -1) != ']')
				{
					attrselectors[a] = attrselectors[a].substr(0, attrselectors[a].length - 1);
				}
				//then convert the selector into a token
				selectorstring = selectorstring.replace(attrselectors[a], '{a' + a + '}');
			}
		}
		//do the same thing with class and ID selectors
		var cidselectors = selectorstring.match(/([#\.][a-z]+[_a-z0-9-:\\]*)/ig);
		if(cidselectors)
		{
			for(var c=0; c<cidselectors.length; c++)
			{
				selectorstring = selectorstring.replace(cidselectors[c], '{c' + c + '}');
			}
		}
		
		//now convert any pure uppercase element names to lowercase
		selectorstring = selectorstring.replace(/([A-Z1-6]+)/g, function(a) { return a.toLowerCase(); });
		
		//then reconvert the attribute selector and 
		//class/id selector tokens back to their original selectors
		if(attrselectors)
		{
			for(a=0; a<attrselectors.length; a++) 
			{ 
				selectorstring = selectorstring.replace('{a' + a + '}', attrselectors[a]); 
			}
		}
		if(cidselectors)
		{
			for(c=0; c<cidselectors.length; c++) 
			{ 
				selectorstring = selectorstring.replace('{c' + c + '}', cidselectors[c]); 
			}
		}
		
		//and return the edited selector		
		return selectorstring;
	}
	
	//parse a cssText string for IE to lowercase the property names
	function lowercaseIEPropertyNames(styletext)
	{
		//split the css text by semi-colons
		styletext = styletext.split(';');
		
		//iterate through the resulting properties
		for(var j=0; j<styletext.length; j++)
		{
			//split the property by its first colon to get the name and value
			//this convoluted funkiness is because IE failed to return
			//any matches when a first-colon regex was used, so instead we split
			//by all colons and then join together any excess matches
			var matches = styletext[j].split(':');
			while(matches.length > 2) { matches[1] += ':' + matches.pop(); }
			
			//if we only have one match, the most likely reason
			//is that the semi-colon split operation latched onto
			//a semi-colon that wasn't a property delimeter
			//probably it was inside generated content
			//and hence the value we're splitting doesn't contain a colon at all
			//so if that happens we'll just have to remove it and continue
			if(matches.length == 1) 
			{ 
				styletext.splice(j, 1); 
				j--; 
				continue; 
			}
			
			//trim them both and convert the property name to lower case
			matches[0] = trim(matches[0]).toLowerCase();
			matches[1] = trim(matches[1]);
			
			//then join them back together with consistent spacing
			styletext[j] = matches[0] + ': ' + matches[1];
		}
		
		//join them all back together with consistent spacing and return the reformated string
		//nb. the smei-colon and space are separated out so that we can universally compress "; " to ";"
		return styletext.join(';' + ' ');
	}

	//parse the selector text of an individual style rule
	//to create an array of individual selectors
	function parseSelectorText(selectorstring)
	{
		//create an array of selectors to return
		var selectors = [];
		
		//if the selectorstring is empty just return the empty array
		if(selectorstring == '') { return selectors; }
		
		//split the selector by commas
		selectorstring = selectorstring.split(',');
		
		//iterate through and add each trimmed selector to the array
		for(var j=0; j<selectorstring.length; j++)
		{
			selectors.push(trim(selectorstring[j]));
		}
		
		//return the selectors array
		return selectors;
	}
	
	//parse the properties text of an individual style rule 
	//to create object members in property/value pairs
	function parsePropertyText(styletext, properties, inherited)
	{
		//if the css text is empty return the object unchanged
		if(styletext == '') { return properties; }
		
		//parse all line-breaks out of the string
		styletext = styletext.replace(/[\r\n]/gm, '');
		
		//split the css text by semi-colon to get individual property definitions
		styletext = styletext.split(';');
		
		//now iterate through that array and create an object member for each one
		//counting the number of properties as we go so we can create a length property
		for(var i=0; i<styletext.length; i++)
		{
			//trim this value and continue if it's empty
			styletext[i] = trim(styletext[i]);
			if(styletext[i] == '') { continue; }
			
			//then split the property by its colon to get the name and value
			//this convoluted funkiness is for IE's benefit, which failed to return
			//any matches when a first-colon regex was used, so instead we split
			//by all colons and then join together any excess matches
			var matches = styletext[i].split(':');
			while(matches.length > 2) { matches[1] += ':' + matches.pop(); }
			
			//if we only have one match, the most likely reason
			//is that the semi-colon split operation latched onto
			//a semi-colon that wasn't a property delimeter
			//probably it was inside generated content
			//and hence the value we're splitting doesn't contain a colon at all
			//so if that happens we'll just have to ignore it and continue
			if(matches.length == 1) { continue; }
			
			//trim the first match and save it to a key variable
			var key = trim(matches[0]);

			//if the rule is not inherited, or the property is inheritable
			if(!inherited || (inherited && typeof INHERITED_PROPS[key] != TYPE_UNDEFINED))
			{
				//don't overwrite an existing rule if it has !important
				//unless it was an inherited rule, or 
				//unless this rule also has !important
				//(we need to check for an end-substring so that we don't get confused
				//	by a content property with "!important" in its text)
				if(typeof properties[key] == TYPE_UNDEFINED 
					|| !IMPORTANT_RULE.test(properties[key].property)
					|| properties[key].inherited == BOOLEAN_TRUE
					|| IMPORTANT_RULE.test(matches[1]))
				{
					//save this value to the properties array
					//along with an inherited flag
					properties[key] = {
						'property' : trim(matches[1]),
						'inherited' : inherited
						};
						
				}
			}
		}
		
		//return the modified properties object
		return properties;
	}
	
	//compare two media strings to see if the context affects the test type
	//and if so adjust the value of the test string accordingly
	//this is for cases where, for example, a <link media="screen"> contains "@media all"
	//and therefore the actual media that applies to those rules is "screen" not "all"
	//or where the context actually precludes the test type, for example <link media="print"> 
	//containing "@media screen", in which case we return "none"
	function contextualizeMediaTypes(context, types)
	{
		//convert the context string to an object
		var contextTypes = lexiconize(context, ',');
		
		//we're not currently testing for media query context
		//so remove and save any media query from the types string
		//so that we don't get confused with them
		var mediaQuery = /([ \t]and.*$)/i,
			matches = types.match(mediaQuery),
			typesQuery = (matches ? matches[0] : '');
		//we have to remove any "only" token so that we can do comparisons
		//against the media-types string that remains, but this means
		//that any such token will be lost permanently from the reported media
		//that's basically okay though because it doesn't affect how they evaluate
		types = types.replace(mediaQuery, '').replace(/only[ \t]+/i, '');
	
		//if the contextTypes object contains "all" then any inner types are okay
		//so just rejoin the types string to its saved media query and return it unmodified
		if(typeof contextTypes['all'] != TYPE_UNDEFINED)
		{
			return types + typesQuery;
		}
	
		//otherwise we have to to check each type against the context
		//so first split and trim the types string into individual media types
		types = types.split(',');
		for(var i=0; i<types.length; i++) 
		{ 
			types[i] = trim(types[i]); 
		}
		
		//then iterate through the types
		for(var i=0; i<types.length; i++)
		{
			//firstly, if the media type is "all"
			//then all the context media types apply here
			//so add them all individually to the types array
			//making sure we avoid duplication and not including media queries
			if(types[i] == MEDIA_ALL)
			{
				for(var m in contextTypes)
				{
					if(!contextTypes.hasOwnProperty(m)) { continue; }
					
					if(arrayContains(types, m) == NULL_VALUE && !/[\(\)]/.test(m))
					{
						types.push(m);
					}
				}
			}
	
			//then if the context does not contain this media type
			//then this media type either doesn't apply in context (so delete it from the array)
			//or it's "all" in which case we've already added the individual context types (so do nothing)
			if(typeof contextTypes[types[i]] == TYPE_UNDEFINED)
			{
				types.splice(i, 1);
				i --;
			}
		}
		
		//if the types array is now empty then 
		//the context has precluded the test type entirely
		//so if that's the case add the value "none" to the array
		//so that it ends up getting returned as "none [+ media query]"
		if(types.length == 0)
		{
			types.push(MEDIA_NONE);
		}
		
		//rejoin the types array, add back any media query, and return it
		//nb. the comma and space are separated like this to avoid compression
		return types.join(',' + ' ') + typesQuery;
	}
	
	//compare a media types array argument with the media types of a css rules
	//to return true of false by whther the rule matches the argument criteria
	function mediaMatches(media, rule)
	{
		//get the rule's media property and convert it to an object
		//so that we can easily test it as typeof mediaTypes[media]
		var mediaTypes = lexiconize(rule.media, ',');
		
		//begin by assuming no match
		var matches = BOOLEAN_FALSE;
		
		//then iterate through the input array of media types to look for at least one match
		//which is all we need for the rule to match the media criteria
		for(var j=0; j<media.length; j++)
		{
			//we have a match if this rule includes at least one of the specified media
			//or the specified media is "all" and the rule's media isn't "none"
			//or the rule's media contains "all" and the specified media isn't "none"
			//(this allows us to get collections of rules that don't apply to any media, 
			// as well as the collections that apply to one or more)
			if(typeof mediaTypes[media[j]] != TYPE_UNDEFINED
				|| (typeof mediaTypes[MEDIA_NONE] == TYPE_UNDEFINED && media[j] == MEDIA_ALL)
				|| (typeof mediaTypes[MEDIA_ALL] != TYPE_UNDEFINED) && media[j] != MEDIA_NONE)
			{
				matches = BOOLEAN_TRUE;
				break;
			}
		}

		//return the result
		return matches;
	}
	
	//detect the current view media 
	//this will only work on HTML pages, but it's better than nothing!
	function getViewMedia()
	{
		//set screen as default in case we can't get the value
		var viewmedia = MEDIA_SCREEN;
		
		//wrap all this in exception handling 
		//in case we're in an environment where it fails
		try
		{
			//begin by creating a test node
			//it's ID will match an ID selector in the test stylesheet we create
			//with a display value that's different from the one we'll define there
			//since we're setting it in .style it will have enough specificity
			//to override the stylesheet value, even though that has !important
			//we have to insert this node before the body's first child, we can't append to body
			//because it's not yet closed, and trying to append to an unclosed element
			//throws an error in IE7/8 (KB927917)
			var pagebody = page.getElementsByTagName('body').item(0);
			var testmedianode = pagebody.insertBefore(page.createElement('span'), pagebody.firstChild);
			testmedianode.id = 'cssutilitiestest'+'medianode';
			testmedianode.style.display = 'inline';

			//create the array of all CSS media types; the list is a delimited string which is split here
			//cos that worked out to less code than declaring an array of separate strings :)
			var mediaTypes = MEDIA_TYPES_LIST.split(',');
			
			//we see a failure condition in Safari 3 and Konqueror, where it
			//applies the stylesheet rule all the time, irrespective of applicable media,
			//and this manifests in it returning whichever type is first in the array
			//so to catch that we'll seed the array with a fake value we can check against
			mediaTypes.splice(0, 0, 'fake');
			
			//create a stylesheet and add a rule for a test node we're going to create
			//we do this differently depending on whether we're IE or everyone else
			//because the techniques we're using are mutually exclusive to those browsers
			//we'll define a display style that's different from the test node's default
			//using !important to give it the highest possible specificity,
			//and a convoluted library-specific ID value, to avoid conflict
			//with any existing styles and elements on the test document
			if(IEXPLORER)
			{
				//create a new stylesheet and add the rule using its proprietary technique
				var viewmediastylesheet = page.createStyleSheet();
				viewmediastylesheet.addRule('#cssutilitiestest'+'medianode', 'display:block !important;');
			}
			else
			{
				//create a style node and add the rule as a child text node
				var viewmedianode = page.getElementsByTagName('head').item(0).appendChild(page.createElement('style'));
				viewmedianode.setAttribute('type', 'text/css');
				viewmedianode.appendChild(page.createTextNode('#cssutilitiestest'+'medianode{display:block !important;}'));
			
				//now get a reference to the stylesheet we just created from the document.styleSheets collection
				//using the stylesheet rather than the original stylenode makes it work in Webkit
				var viewmediastylesheet = page.styleSheets[page.styleSheets.length - 1];
			}
			
			//now iterate through the CSS media types to test each one in turn
			for(var i=0; i<mediaTypes.length; i++)
			{
				//set the stylesheet media to this media type
				if(IEXPLORER) { viewmediastylesheet.media = mediaTypes[i]; }
				else { viewmediastylesheet.media.mediaText = mediaTypes[i]; }
				
				//if the test node is now taking on the display property
				//that was specified in the test stylesheet
				//then we know that the specified media applies to the current view :-)
				if((IEXPLORER && testmedianode.currentStyle.display == 'block')
					|| (!IEXPLORER && page.defaultView.getComputedStyle(testmedianode, '').getPropertyValue('display') == 'block'))
				{
					viewmedia = mediaTypes[i];
					break;
				}
			}
			
			//remove the test node and stylesheet
			testmedianode.parentNode.removeChild(testmedianode);
			if(IEXPLORER) { viewmedianode = viewmediastylesheet.owningElement; }
			viewmedianode.parentNode.removeChild(viewmedianode);
		}
		
		//silently fail [and set media back to default]
		catch(err) { viewmedia = MEDIA_SCREEN; }
		
		//if the returned value is "fake" then it's been caught by our seeding trap
		//so if that happens we'll just have to reset back to the default again
		if(viewmedia == 'fake') { viewmedia = MEDIA_SCREEN; }
		
		//return the final value
		return viewmedia;
	}
	
	//watch a collection of stylesheets for their disabled state to change
	//and when one of them does, re-initialize the script
	//we used to have a few different approaches for different browsers, but we couldn't rely on them
	//for example - in opera and firefox we can watch the disabled state of each stylesheet's ownerNode 
	//by extending the Object watch() method to the ownerNode elements, and that's virtually instantaneous 
	//but it won't cover view-menu stylesheet switching, which toggles the disabled state 
	//of the stylesheet itself, not its owner node; and we can't guarantee that any other browser
	//won't be implementing some extension or browser feature that works in the same way
	//so we can't take a chance of having innacurate data, we'll just have to use the timer
	//so in fact only Safari defaults to a different method, and that's only because the timer method
	//won't work, because disabled stylesheets don't show up in the stylesheets collection at all
	//of course once we've safely implemented the timer method, we could still use the other techniques
	//as well, but what's the point, just for a slightly faster response, it doesn't warrant the additional code
	function watchStyleSheets()
	{
		//so begin by creating an optimized data set
		//so we've got less to look at in each timer iteration
		//and thereby minimize the timer's CPU load
		for(var livesheets=[], i=0; i<THIS._stylesheets.length; i++)
		{
			//for author mode we use the stylenode.styleSheet/sheet references  
			//(or just the stylenode for safari);
			//or for browser mode we use the stylesheet references directly 
			var stylesheet = mode == MODE_AUTHOR
							 ? (THIS._stylesheets[i].stylenode == BOOLEAN_FALSE || THIS._stylesheets[i].stylenode == NULL_VALUE)
							 	? NULL_VALUE
							 	: (SAFARI || KONQUEROR || WEBKIT)
							 		? THIS._stylesheets[i].stylenode
							 		  //nb. although we know this condition is IE vs. others, an object test is better
							 		: THIS._stylesheets[i].stylenode[typeof THIS._stylesheets[i].stylenode.styleSheet != TYPE_UNDEFINED ? 'styleSheet' : 'sheet']
							 : THIS._stylesheets[i].stylesheet;
							 
			//ignore null stylesheets, such as duplicates,
			//or those we couldn't read for security reasons
			if(stylesheet == NULL_VALUE) { continue; }

			//save the stylesheet reference, and its current disabled state
			livesheets.push({
				'stylesheet' : stylesheet, 
				'disabled' : stylesheet.disabled 
				});
		}
		
		//for safari and konqueror in browser mode, 
		//disabled stylesheets don't show up in the document stylesheets collection at all
		//so what we do to detect the change is assign an ident to the owner node of each one
		//and then create a timer that assigns new idents to any stylesheet node that doesn't have one
		//and thereby it knows that something's changed because a new ident will appear
		//or an existing ident will disappear, due to stylesheets appearing and disappearing
		//from the document stylesheets collection. 
		//actually in safari, a change in the disabled state of a stylesheet causes its ownerNode to fire a
		//DOMSubtreeModified event in response to the addition or removal of that node from the DOM
		//so we culd detect that change, and use it as a springboard for re-initialization
		//but that would mean code forking for safari and konqueror, which is arguably a waste of code
		//since this method works for both; the only real difference is that the subtree modified
		//technique would be faster (virtually instant), but again, it's not really worth it for the extra code
		if((SAFARI || KONQUEROR || WEBKIT) && mode == MODE_BROWSER)
		{
			//function that iterates through the stylesheets collection
			//and assign an ident to any owner node that doesn't already have one
			function createStyleSheetIdents()
			{
				for(var idents=[], dsheets=page.styleSheets, i=0; i<dsheets.length; i++)
				{
					if(typeof dsheets[i].ownerNode.__ident == TYPE_UNDEFINED)
					{
						dsheets[i].ownerNode.__ident = new Date().getTime() + '' + Math.round(Math.random() * 10000);
					}
					idents.push(dsheets[i].ownerNode.__ident); 
				}
				return idents;
			}
			
			//assign the initial control idents then start the watch timer
			var controlidents = createStyleSheetIdents(), 
				watcher = window.setInterval(function()
			{
				//assign new idents as applicable
				var currentidents = createStyleSheetIdents();
				
				//if either of the ident arrays has changed
				if(controlidents.join() != currentidents.join())
				{
					//clear the timer then re-initialize, calling any stored init callback
					window.clearInterval(watcher);
					THIS.init(typeof THIS.initcallback != TYPE_UNDEFINED ? THIS.initcallback : NULL_VALUE);
				}
			
			}, WATCHER_SPEED_TIMER);
		}

		//for everybody else we'll use a timer to watch the disabled property
		//of all the valid stylesheets or stylenodes in the debug stylesheets array
		else
		{
			//start a watch timer, saving a reference we can stop it with
			//I actually did find a complete set of techniques for watching changes
			//in the disabled state of stylesheets without resorting to setInterval
			//however they all worked off the state of the ownerElement, but browsers'
			//built-in stylesheets switching (eg. the Style menu in Opera)
			//work off the disabled property of the stylesheet itself, not its owner node
			//so all of that is unuseable, and a timer it has to be :-(
			//I did consider adding it as well, just so that we get faster responses
			//but what's the point? it's just a whole bunch more code to little real benefit
			var watcher = window.setInterval(function()
			{
				//iterate through the optimized stylesheets set 
				for(var i=0; i<livesheets.length; i++)
				{
					//if the current disabled state differs from the stored state
					if(livesheets[i].stylesheet.disabled != livesheets[i].disabled)
					{
						//clear the timer then re-initialize, calling any stored init callback
						window.clearInterval(watcher);
						THIS.init(typeof THIS.initcallback != TYPE_UNDEFINED ? THIS.initcallback : NULL_VALUE);
						
						//set a flag to break the iteration
						var dobreak = BOOLEAN_TRUE;
					}
					
					//this break is crucial, to prevent multiple changes
					//from firing multiple re-initializations
					//it's basically doing the same job as the buffer
					//used for other browsers, but in a different way
					if(typeof dobreak != TYPE_UNDEFINED) { break; }
				}
			
			}, WATCHER_SPEED_TIMER);
		}
	}



	
	//-- private general utility methods --//
	
	//wrapper for Selectors APIs
	function getElementsBySelector(selector)
	{
		//manually filter out pseudo-elements, which of course never directly 
		//match an element reference, but some query implementations let them through
		//eg. DOMAssistant in IE, and the native implementation in Safari 3
		if(REGEX_SINGLE_PSEUDO_ELEMENT.test(selector))
		{
			var selectors = selector.split(',');
			for(var i=0; i<selectors.length; i++)
			{
				if(REGEX_SINGLE_PSEUDO_ELEMENT.test(selectors[i]))
				{
					selectors.splice(i, 1);
					i--;
				}
			}
			selector = selectors.join(',');
		}
		
		//if the selector is now empty return zero matches
		if(trim(selector) == '') { return []; }
		
		//nb. whichever selectors api method we use
		//we're going to silently fail around calls to it
		//so that we don't get errors from invalid selectors
		//the only place where we do catch and throw an explicit error
		//is where we can establish that a library we need just isn't there
		
		//if the api property is false then we've already established
		//that the browser has native support for querySelectorAll
		//and it hasn't been set to true to specify that the
		//fallback library function should be used for everyone
		if(api == BOOLEAN_FALSE) 
		{
			try { return page.querySelectorAll(selector); }
			catch(err) { return []; }
		}
		
		//otherwise, if we have a qsa function 
		//defined [and pre-tested], then call and return that
		if(typeof qsa == TYPE_FUNCTION)
		{
			try { return qsa(selector, page); }
			catch(err) { return []; }
		}
		
		//otherwise use the fallback library function
		try 		
		{ 
			//if the library isn't there at all, throw the missing sapi error
			if(typeof Selector != TYPE_FUNCTION) 
			{ 
				throw(new Error(FATAL_ERROR_MISSING_SAPI)); 
			}
			
			//in IE6, Selector sometimes returns undefined instead of an array
			//for selectors containing some pseudo-classes, like :hover
			//I haven't clearly established why (it isn't the colon causing regex failure
			//because other pseudos like :active don't display the same behavior), 
			//but anyway, to prevent unduev errors reaching the end user or developer, 
			//we'll catch that situation and return an empty array instead
			//oddly enough though, this doesn't seem to prevent it from matching
			//the selectors it returns undefined for correctly against their element
			//so it must be a different test that causes it, not the one that matches it!?
			var r = Selector(selector, page);
			return typeof r == TYPE_UNDEFINED ? [] : r;
		}
		catch(err) 
		{ 
			//if the error is the missing sapi error we threw for the missing library
			//then allow it to be output to the console
			if(err.message == FATAL_ERROR_MISSING_SAPI) { throw(err); }
			
			//otherwise silently fail as normal
			return []; 
		}

		//we return an empty array after a query method silent exception
		//which will usually be because it doesn't like the selector
		//either it doesn't understand it, or the selector is wrong or mangled in some way
	}
	
	//get an array of elements specified by tagname or "*"
	function getTheseElements(tagname)
	{
		//get a collection of the specified elements 
		//and convert it to an array so we can use array methods on it
		//use a namespaced method if appropriate so that for any given tagname 
		//we look in all namespaces, allowing us to support things like "svg:style"
		//as well as explicitly-namespaced HTML elements like "html:link"
		try
		{
			var thesenodes = arrayifize(
								THIS._isXML
									? page.getElementsByTagNameNS('*', tagname)
									: page.getElementsByTagName(tagname)
									);
		}
		//just in case anything goes wrong, create an empty array
		//this is just for paranoid safety - there's no known reason why it shoud fail
		catch(err) { thesenodes = []; }
		
		//we may need to filter out comments, because IE includes them in its "*" collection!
		//so in fact what we'll do is just exclude anything that's not an element
		//in case there's anything else it stupidly adds that I don't know about
		//[i spoke too soon...] if the page contains any custom elements, 
		//IE also adds their closing tag as an additional node to the collection!!
		//so we'll have to filter those out as well by checking for "/" at the start of the tag name
		//interestingly enough, all browsers except Opera convert custom element tag names 
		//to the canonical uppercase form in HTML; fwiw I think Opera is right - they're not HTML elements
		//so there's no reason to implement the canonical form; but other browsers probably
		//aren't thinking that deeply, they're probably just doing it for every element they encounter
		//also of interest is the fact that IE[6] doesn't apply style attribute properties
		//to a custom element's rendering, while all other browsers do; but I'm not going to allow for that
		//when returning property collections in browser mode ... maybe in the next version :-P
		//I mean ffs, I only noticed by accident; it's too late in the day to think about custom elements
		//except to the extent that I have done here, but that's only to ensure that the array indices
		//in the styleattrs array remain accurate with regard to matching indices in the "*" collection
		if(tagname == '*')
		{
			for(var i=0; i<thesenodes.length; i++)
			{
				if(thesenodes[i].nodeType != 1 || thesenodes[i].tagName.charAt(0) == '/')
				{
					thesenodes.splice(i--, 1);
				}
			}
		}
		
		//return the final array
		return thesenodes;
	}
	
	//late initialize method, used internally to initialize the script
	//if a public method is called without it having been pre-initialized
	function lateinit()
	{
		//if the script hasn't been initialized, do it now
		if(typeof THIS._cssRules == TYPE_UNDEFINED) 
		{ 
			THIS.init(); 
		}
	}
	
	//process a method's arguments array to create an indexed object
	//this makes it possible for users to omit any number of intermediate 
	//optional arguments, and have the onfinished callback be the last one
	function processArguments(argsary, keys)
	{
		//add onfinished to the keys
		//it's always the last argument to every public method
		//so we add it here to save listing it each time
		//and to maintain control over its existence  
		keys.push('onfinished');
		
		//create the empty indexed arguments object
		//then iterate through the specified keys array
		for(var args={}, i=0; i<keys.length; i++)
		{
			//as soon as we encounter a function within the arguments array
			//nullify all subsequent arguments then index the function to args.onfinished 
			//we put onfinished at the end to preserve the order of arguments
			//which is ultimately for consistency and therefore easier comprehension
			//nb. should we ever require any of the public methods to take a function argument
			//other than the callback, we will need to redesign this code to accomodate
			if(typeof argsary[i] == TYPE_FUNCTION)
			{
				for(var j=i; j<keys.length; j++)
				{
					args[keys[j]] = NULL_VALUE;
				}
				args.onfinished = argsary[i];
				
				//and we're done
				break;
			}
			//otherwise if this argument is undefined
			//create a null value at the corresponding index in the arguments object
			//all the other arg processing methods will then identify null 
			//the same as undefined, and so put the appropriate default value in its place 
			//(or throw an exception over it, if that's the appropriate response)
			else if(typeof argsary[i] == TYPE_UNDEFINED)
			{
				args[keys[i]] = NULL_VALUE;
			}
			//if the argument is defined then add it 
			//to the args object using the applicable index
			else
			{
				args[keys[i]] = argsary[i];
			}
		}
		
		//return the finished arguments object
		return args;
	}

	//process a method's element argument
	function processElementArgument(argelement, calledby)
	{
		//if the element argument is a string beginning with "#" 
		//then look for an element with that ID within the context document
		//if there isn't one then element will be set to null
		//which will make it fail the reference test that follows
		//nb. we use the leading # partly so we have future scope 
		//for accepting other kinds of reference string, 
		//and partly for consistency with CSS reference syntax,
		//but mostly just because I think it looks cooler :-D
		if(typeof argelement == TYPE_STRING && argelement.charAt(0) == '#')
		{
			argelement = page.getElementById(argelement.substr(1, argelement.length - 1));
		}
		
		//if element is undefined, null, or not an element, throw an error
		if(typeof argelement == TYPE_UNDEFINED  || argelement == NULL_VALUE 
			|| typeof argelement.nodeType == TYPE_UNDEFINED || argelement.nodeType != 1) 
		{ 
			throw(new Error(errorMessageNoElement.replace('%method', calledby))); 
		}
		
		//return the element reference
		return argelement;
	}
	
	//process a method's media argument
	function processMediaArgument(argmedia)
	{
		//if media is undefined, empty or null, default to "screen"
		if(typeof argmedia == TYPE_UNDEFINED || argmedia == '' || argmedia == NULL_VALUE) 
		{ 
			argmedia = MEDIA_SCREEN; 
		}
		
		//if argmedia is or contains the discreet value "*", this is the universal shortcut
		//meaning all media, including no media, which translates to "all,none"
		//so just set the argmedia value to that
		if(/(^|,)\*(,|$)/.test(argmedia)) 
		{ 
			argmedia = 'all,none'; 
		}
		
		//split the media argument into an array and trim the members
		argmedia = argmedia.split(',');
		for(var i=0; i<argmedia.length; i++) 
		{ 
			argmedia[i] = trim(argmedia[i]); 
			
			//if the value is "current" then set it to the current view media
			if(argmedia[i] == MEDIA_CURRENT) 
			{ 
				argmedia[i] = THIS._viewmedia; 
			}
		}
		
		//return the processed argument
		return argmedia;
	}
	
	//process a method's accept argument
	function processAcceptArgument(argaccept)
	{
		//if accept is undefined, empty, null or "null"
		//default to "*" which means "everything"
		if(typeof argaccept == TYPE_UNDEFINED 
			|| argaccept == '' || argaccept == NULL_VALUE || argaccept == 'null') 
		{ 
			argaccept = '*'; 
		}
		
		//then if accept is still a string, process it into an object 
		//so that we can easily test for values using typeof accept[key]
		//or if it's completely or contains "*" then make it just "*"
		//we have this condition for if it's already been processed 
		//because this can get called by recursive instances of getCSSRules
		//but we only actually need to process the argument 
		//on the first instance before it's already been processed
		else if(typeof argaccept == TYPE_STRING)
		{
			//trim the value
			argaccept = trim(argaccept);
			
			//if the value is "*" just leave it
			if(argaccept !== '*')
			{
				//if the string contains "*" among other delimited values, 
				//make it just "*" on its own
				//we test for delimiters so that, for example, 
				//"css*" is invalid rather than equating to "css,*"
				if(/(,\s*\*|\*\s*,)/.test(argaccept)) 
				{ 
					argaccept = '*'; 
				}
				
				//otherwise convert the string into an object
				else 
				{ 
					argaccept = lexiconize(argaccept, ','); 
				}
			}
		}
		
		//return the processed argument or existing object
		return argaccept;
	}
	
	//process a method's onfinished callback argument
	function processOnfinishedArgument(argonfinished)
	{
		//if onfinished is [undefined or null or] not a function, set it to null
		if(typeof argonfinished != TYPE_FUNCTION) 
		{ 
			argonfinished = NULL_VALUE; 
		}
		
		//return the processed argument
		return argonfinished;
	}
	
	//trim leading and trailing whitespace from a string
	function trim(str)
	{
		return str.replace(/^\s+|\s+$/g, '');
	}
		
	//check if an array contains a member
	//this can check simple arrays for whether they contain a member
	//(and in which case returns the member it found)
	//or it can check arrays of objects for whether they contain
	//a member with a property name matching the input key
	//(and in which case returns the member's parent object)
	//if there's no match it returns null
	function arrayContains(ary, member, key)
	{
		for(var i=0; i<ary.length; i++)
		{
			if(typeof key != TYPE_UNDEFINED && typeof ary[i] == TYPE_OBJECT)
			{
				if(ary[i][key] == member)
				{
					return ary[i];
				}
			}
			else if(ary[i] == member) 
			{
				return ary[i];
			}
		}
		return NULL_VALUE;
	}
	
	//convert a DOM NodeList to an array
	//cool name huh :-D
	function arrayifize(nodelist)
	{
		for(var ary=[], i=0; i<nodelist.length; i++)
		{
			ary.push(nodelist[i]);
		}
		return ary;
	}
	
	//convert a delimited string into a dictionary object of empty properties
	//so that we can easily test for a value with typeof obj[key]
	function lexiconize(str, delimiter)
	{
		//create the empty object
		var obj = {};
		
		//split the string by its delimiter
		str = str.split(delimiter);
		
		//if the final member contains media queries, split them off too
		//and add them to the array, deleting the whole final member itself
		//there's no need to look for the "only" token here because 
		//it will be gone from any media-types string before it gets here
		var tmp = str[str.length - 1];
		if(/[ \t]and/i.test(tmp))
		{
			tmp = tmp.split(/[ \t]and/i);
			str.splice(str.length-1, 1);			
			for(var i=0; i<tmp.length; i++)
			{
				str.push(tmp[i]);
			}
		}
		
		//iterate through the array and save each trimmed member to the object
		//we only need the object keys, so the values can be anything
		for(var i=0; i<str.length; i++)
		{
			obj[trim(str[i])] = '';
		}
		
		//return the object
		return obj;
	}

	//count the members of an object
	function howmany(obj)
	{
		var n = 0;
		for(var i in obj)
		{
			if(!obj.hasOwnProperty(i)) { continue; }
			
			n ++;
		}
		return n;
	}
	
	//qualify an HREF to form a complete URI
	function qualifyHREF(href, context)
	{
		//if the href is undefined return an empty string
		//the only time this is known to have an impact is in XHTML 
		//when an xml-stylesheet PI has its href pseudo-attribute 
		//in mixed or uppercase, resulting in no pseudoattrs.href property
		//and ultimately in an xml-stylesheet PI marked as "data is not CSS" 
		//(which matches what implementations actually do:
		// they can't load the stylesheet, because it has no known "href"!)
		//more generally, this will indirectly catch failure to retrieve a stylesheet's href
		//for any exceptional reason that hasn't been accounted for
		if(typeof href == TYPE_UNDEFINED) { return ''; }
		
		//extract the protocol, host and path
		//and create a location object with the data
		//nb. the first replacement here goes "/"+"/" instead of "//"
		//so that it's safe to do a global removal of //.*
		//when removing comments to minimize the script 
		var parts = context.replace('/'+'/', '/').split('/');
		var loc = {
			'protocol' : parts[0],
			'host' : parts[1]
			};
		parts.splice(0, 2);
		loc.pathname = '/' + parts.join('/');
		
		//build a base URI from the protocol plus host (which includes port if applicable)
		//nb. the "/"+"/" is for the same minimizing reason
		var uri = loc.protocol + '/'+'/' + loc.host;
		
		//if the input path is relative-from-here
		//just delete the ./ token to make it relative
		if(/^(\.\/)([^\/]?)/.test(href))
		{
			href = href.replace(/^(\.\/)([^\/]?)/, '$2');
		}
	
		//if the input href is already qualified, copy it unchanged
		if(/(^([a-z]+)\:\/\/)/.test(href))
		{
			uri = href;
		}
	
		//or if the input href begins with a leading slash, then it's base relative
		//so just add the input href to the base URI
		else if(href.substr(0, 1) == '/')
		{
			uri += href;
		}
	
		//or if it's an up-reference we need to compute the path
		else if(/^((\.\.\/)+)([^\/].*$)/.test(href))
		{
			//get the last part of the path, minus up-references
			var lastpath = href.match(/^((\.\.\/)+)([^\/].*$)/);
			lastpath = lastpath[lastpath.length - 1];
	
			//count the number of up-references
			var references = href.split('../').length - 1;
	
			//get the path parts and delete the last one (this page or directory)
			var parts = loc.pathname.split('/');
			parts = parts.splice(0, parts.length - 1);
	
			//for each of the up-references, delete the last part of the path
			for(var i=0; i<references; i++)
			{
				parts = parts.splice(0, parts.length - 1);
			}
	
			//now rebuild the path
			var path = '';
			for(i=0; i<parts.length; i++)
			{
				if(parts[i] != '')
				{
					path += '/' + parts[i];
				}
			}
			path += '/';
	
			//and add the last part of the path
			path += lastpath;
	
			//then add the path and input href to the base URI
			uri += path;
		}
	
		//otherwise it's a relative path,
		else
		{
			//calculate the path to this directory
			path = '';
			parts = loc.pathname.split('/');
			parts = parts.splice(0, parts.length - 1);
			for(var i=0; i<parts.length; i++)
			{
				if(parts[i] != '')
				{
					path += '/' + parts[i];
				}
			}
			path += '/';
	
			//then add the path and input href to the base URI
			uri += path + href;
		}
	
		//return the final uri
		return uri;
	}
	
	//load CSS or HTML data via XHR, either asynchronously or synchronously 
	//according to the value of the async flag argument
	//nb. we only use this method to retrieve data as text, never for active scripting,
	//because calling eval() on network data is just too dangerous
	function ajaxload(async, uri, oncomplete, onfail)
	{
		//try to create a request object
		//arranging the two conditions this way is for IE7/8's benefit
		//so that it works with any combination of ActiveX or Native XHR settings, 
		//as long as one or the other is enabled; but if both are enabled
		//it prefers ActiveX, which means it still works with local files
		//(Native XHR in IE7/8 is blocked and throws "access is denied",
		// but ActiveX is permitted if the user allows it [default is to prompt])
		var requestobject = NULL_VALUE;
		if(typeof window.ActiveXObject != TYPE_UNDEFINED)
		{
			try { requestobject = new ActiveXObject('Microsoft.XMLHTTP'); }
			catch(err) { requestobject = NULL_VALUE; }
		}
		if(requestobject == NULL_VALUE && typeof window.XMLHttpRequest != TYPE_UNDEFINED)
		{
			try { requestobject = new XMLHttpRequest(); }
			catch(err) { requestobject = NULL_VALUE; }
		}
		
		//if we failed to initiate a request then we can't do anything else
		//so we'll have to throw a fatal error and stop
		if(requestobject == NULL_VALUE) 
		{ 
			throw(new Error(FATAL_ERROR_NO_XHR)); 
		}

		//add a timestamp to the URI to prevent caching,
		//there are more subtle ways of trying to ensure a fresh response
		//but this approach has always proven the most reliable
		//we should give this a reasonably unique key
		//just in case the URI already has cgi parameters
		//#uri += (uri.indexOf('?') == -1 ? '?' : '&') + 'cssutilstamp=' + new Date().getTime();
		
		//open the request using the specified async flag 
		requestobject.open('GET', uri, async);
		
		//try to set a request header that defines a library user-agent string
		//this is something I like to do with programatic networking like ajax
		//so that site owners can identify such requests in their server logs
		//it's mostly for fun - like a little electronic hello :-)
		//and as a kind of side-door viral marketing! but it also provides
		//a means of filtering or otherwise handling such requests specially
		//ultimately though it's not essential, so silently fail [eg. if the method is unsupported]
		try { requestobject.setRequestHeader('User-Agent', LIBRARY_VERSION_STRING); }catch(err){}	
			
		//private response function
		function ajaxresponse(requestobject)
		{
			//if the status is okay, pass the trimmed response text to oncomplete
			//along with the Content-Type response header from this request
			//nb. we allow the status code 0 so that file:// addresses are supported
			//unfortunately though such requests also return an empty content-type
			//which means that we have to just accept all response text
			//without the ability to check whether its MIME type is text/css
			if(/(0|200|304)/.test(requestobject.status.toString()))
			{
				oncomplete(
					requestobject.responseText, 
					requestobject.getResponseHeader('Content-Type')
					);
			}

			//otherwise pass the trimmed status text to onfail
			else
			{
				onfail(trim(requestobject.statusText), requestobject.status);
			}
		}
		
		//if the async flag is true we're making an asynchronous request
		if(async == BOOLEAN_TRUE)
		{
			//create a readystatechange handler
			requestobject.onreadystatechange = function()
			{
				//when the request completes
				if(requestobject.readyState == 4)
				{
					//***DEV SEMI-RANDOMIZED LATENCY
					//setTimeout(function() { 
					
					//call the response function with the request object
					ajaxresponse(requestobject);
					
					//***DEV SEMI-RANDOMIZED LATENCY
					//}, (33 * Math.random()));
				}
			};

			//make the request, with exception handling 
			//to catch failures such as no network connection
			try 
			{ 
				requestobject.send(NULL_VALUE); 
			}

			//if just that individual request failed
			//pass a network or security error message to onfail 
			//we have to be ambiguous here because this exception handler alone
			//is not enough to establish whether the request failed
			//(eg. no internet connection), or whether we tried to make a request 
			//that violated the same-origin policy; although most of those 
			//are caught by other exception handlers, it can still happen here too
			catch(err)
			{
				onfail(ERROR_NETWORK_OR_SECURITY);
			}
		}
		
		//otherwise it's false so we're making a synchronous request
		else
		{
			//we have to make sure that the response callback is outside the try..catch construct
			//otherwise any errors within it, or anything it calls, will execute the catch block
			//## so any coding errors made by the user inside their init callback will execute it ##
			//which can lead to any genuine errors being obscured by unrelated errors fired from here
			//(errors which only happen because code is being forced to execute out of context)
			//so we need to make sure that the catch block doesn't call anything else 
			//so that if it is called out of context, nothing else happens as a result
			//we only need to do this for the synchronous case, 
			//because asynchronous calls don't display the same behavior
			//(not 100% sure why, but it's undoubtedly something to do with execution scope)
			var success;
			
			//make the request inside the try construct
			//and set the success flag to true
			try
			{
				requestobject.send(NULL_VALUE);

				success = BOOLEAN_TRUE;
			}
			//if we have failure set the success flag to false
			catch(err) 
			{ 
				success = BOOLEAN_FALSE; 
			}
			
			//if success is true call the response function with the request object
			if(success === BOOLEAN_TRUE)
			{
				ajaxresponse(requestobject);
			}
			
			//otherwise pass the network or security error message to onfail 
			else
			{
				onfail(ERROR_NETWORK_OR_SECURITY);
			}
		}
	}
	

}).apply(CSSUtilities);
