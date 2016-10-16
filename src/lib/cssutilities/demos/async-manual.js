


//configure
CSSUtilities.define('async', true);
CSSUtilities.define('mode', 'author');


//show the throbber
test.style.background = 'url("throbber.gif") #fefdfb no-repeat 93% 5%';


//initialize with callback
CSSUtilities.init(function()
{

	//synchronously call data method and display returned data
	var rules = CSSUtilities.getCSSRules('#HeadinG', 'screen', '*', true);
	displayRulesData(rules, 'getCSSRules');	

	//synchronously call data method and display returned data
	var rules = CSSUtilities.getCSSProperties('#HeadinG', 'screen');
	displayPropertiesData(rules, 'getCSSProperties');	

	//synchronously call data method and display returned data
	var selectors = CSSUtilities.getCSSSelectors('#HeadinG', 'screen', true);
	var specs = [];
	for(var i=0; i<selectors.length; i++)
	{
		specs[i] = CSSUtilities.getCSSSelectorSpecificity(selectors[i], '#HeadinG');
	}
	displaySpecificityData(selectors, specs, 'getCSSSelectors + getCSSSelectorSpecificity');	

	//synchronously call data method and display returned data
	var rules = CSSUtilities.getCSSStyleSheets();
	displayRulesData(rules, 'getCSSStyleSheets');	

	//synchronously call data method and display returned data
	var rules = CSSUtilities.getCSSStyleSheetRules('*','*', -1);
	displayRulesData(rules, 'getCSSStyleSheetRules');	


	//hide the throbber
	test.style.background = '#fefdfb';
	
});
