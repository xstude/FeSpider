


//configure
CSSUtilities.define('async', false);
CSSUtilities.define('mode', 'author');


//synchronously call data method [which will trigger auto-init] and display returned data
var rules = CSSUtilities.getCSSRules('#HeadinG', 'screen', '*', false);
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
displaySpecificityData(selectors, specs, 'getCSSSelectors / getCSSSelectorSpecificity');	

//synchronously call data method and display returned data
var rules = CSSUtilities.getCSSStyleSheets();
displayRulesData(rules, 'getCSSStyleSheets');	

//synchronously call data method and display returned data
var rules = CSSUtilities.getCSSStyleSheetRules('*', '*', -1);
displayRulesData(rules, 'getCSSStyleSheetRules');	

