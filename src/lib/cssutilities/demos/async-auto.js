


//configure
CSSUtilities.define('async', true);
CSSUtilities.define('mode', 'author');


//show the throbber
test.style.background = 'url("throbber.gif") #fefdfb no-repeat 93% 5%';


//asynchronously call data method with callback
CSSUtilities.getCSSRules('#HeadinG', 'screen', function(rules)
{
	
	//display the passed-in data
	displayRulesData(rules, 'getCSSRules');	

	
	//asynchronously call data method with callback
	CSSUtilities.getCSSProperties('#HeadinG', 'screen', function(properties)
	{
		
		//display the passed-in data
		displayPropertiesData(properties, 'getCSSProperties');	


		//asynchronously call data method with callback
		CSSUtilities.getCSSSelectors('#HeadinG', 'screen', function(selectors)
		{
			//pass the data to recursively asynchronously call data method with callback
			var allspecs = [];
			function getSpecificity(i)
			{
				CSSUtilities.getCSSSelectorSpecificity(selectors[i], '#HeadinG', function(specs)
				{
					//recur...
					allspecs[i] = specs;
					if(++i < selectors.length)
					{
						getSpecificity(i);
					}
					//once complete...
					else
					{
						//display the passed-in data
						displaySpecificityData(selectors, allspecs, 'getCSSSelectors / getCSSSelectorSpecificity');	
					
				
						//asynchronously call data method with callback
						CSSUtilities.getCSSStyleSheets(function(rules)
						{
							
							//display the passed-in data
							displayRulesData(rules, 'getCSSStyleSheets');	


							//asynchronously call data method with callback
							CSSUtilities.getCSSStyleSheetRules('*', function(rules)
							{
								
								//display the passed-in data
								displayRulesData(rules, 'getCSSStyleSheetRules');	
							
							
								//hide the throbber
								test.style.background = '#fefdfb';

							});
						});
						
					}
					
				});
				
			}
			
			//kick-off the async-recursion loop
			getSpecificity(0);
		});
	});
});


