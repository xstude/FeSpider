

//stringify a rules array
function stringifyrules(rules)
{
	var str = '', mac = /^mac/i.test(navigator.platform);
	for(var i=0; i<rules.length; i++)
	{
		str += i + ': \n';
		for(var j in rules[i])
		{
			str += '        "' + j + '": ';
			
			if(j == 'inheritance')
			{
				for(var k=0; k<rules[i][j].length; k++)
				{
					str += rules[i][j][k].nodeName.toUpperCase();
					if(k < rules[i][j].length-1) { str += ' -> '; }
				}
				str += '\n';
			}
			else if(/properties/.test(j))
			{
				if(!rules[i][j])
				{
					str += '\n                    null\n';
				}
				else
				{
					str += '\n';
					for(var k in rules[i][j])
					{
						str += '                 ';
						
						if(typeof rules[i][j][k] == 'object')
						{
							switch(rules[i][j][k].status)
							{
								case 'cancelled' : //unicode cross
									str += (mac ? '\u2718' : '-') + '   ';
									break;
								case 'inactive' : //unicode half-dark circle
									str += (mac ? '\u25d1' : '/') + '   ';
									break;
								case 'active' : //unicode tick
									str += (mac ? '\u2714' : '+') + '   ';
									break
								default :
									str += '  ';
							}
							
							str += '"' + k + '": "' + rules[i][j][k].value + '"\n';
						}
						else
						{
							str += '  "' + k + '": "' + rules[i][j][k] + '"\n';
						}
					}
				}
			}
			else
			{
				if(typeof rules[i][j] == 'string') { str += '"'; }
				str += rules[i][j];
				if(typeof rules[i][j] == 'string') { str += '"'; }
				str += '\n';
			}
		}
	}
	return str;
}

//define and clear test output
var test = document.getElementById('test');
test.value = '';

//display stylesheet rules data
function displayRulesData(rules, title)
{
	//if we have rules
	if(typeof rules != 'undefined')
	{
		//create the string and add a divider
		var str = '\n'
			+ '--[ ' + title + ' ]----------------------------------------------------------------------\n\n'
			+ '';
	
		//stringify the data
		if(rules.length > 0) { str += stringifyrules(rules); }
		else { str += 'no rules\n'; }
		
		//add a divider and output the final string
		str += '\n=================================================================================================\n\n';
		test.value += str;
	}
	
	//otherwise output a failure message
	else
	{
		test.value += '\n##[ FAIL: data initialization is not complete ]##################################################\n\n'
	}
}

//display stylesheet properties data
function displayPropertiesData(props, title)
{
	//if we have properties
	if(typeof props != 'undefined')
	{
		//create the string and add a divider
		var str = '\n'
			+ '--[ ' + title + ' ]---------------------------------------------------------------------------\n\n'
			+ '';
	
		//stringify the data like a CSS rule
		for(var i in props)
		{
			str += i + ': ' + props[i] + ';\n';
		}
		
		//add a divider and output the final string
		str += '\n=================================================================================================\n\n';
		test.value += str;
	}
	
	//otherwise output a failure message
	else
	{
		test.value += '\n##[ FAIL: data initialization is not complete ]##################################################\n\n'
	}
}

//display stylesheet selectors data
function displaySelectorsData(selectors, title)
{
	//if we have selectors
	if(typeof selectors != 'undefined')
	{
		//create the string and add a divider
		var str = '\n'
			+ '--[ ' + title + ' ]----------------------------------------------------------------------\n\n'
			+ '';
	
		//stringify the data 
		if(selectors.length > 0)
		{
			for(var i=0; i<selectors.length; i++)
			{
				str += (i < 10 ? ' ' : '') + i + ': ' + selectors[i] + '\n';
			}
		}
		else
		{
			str += 'no selectors';
		}
		
		//add a divider and output the final string
		str += '\n=================================================================================================\n\n';
		test.value += str;
	}
	
	//otherwise output a failure message
	else
	{
		test.value += '\n##[ FAIL: data initialization is not complete ]##################################################\n\n'
	}
}

//display stylesheet specificity data
function displaySpecificityData(selectors, specs, title)
{
	//if we have specs
	if(typeof specs != 'undefined')
	{
		//create the string and add a divider
		var str = '\n'
			+ '--[ ' + title + ' ]------------------------------------------------\n\n'
			+ '';
	
		//compile the data
		for(var i=0; i<selectors.length; i++)
		{
			str += (i < 10 ? ' ' : '') + i + ': ' + selectors[i];
			for(var j=0; j<(50-selectors[i].length); j++) { str += ' '; }

			if(specs[i] == null) { str += 'null\n'; }
			else { str += '[ ' + specs[i].join(', ') + ' ]\n'; }
		}
		
		//add a divider and output the final string
		str += '\n=================================================================================================\n\n';
		test.value += str;
	}
	
	//otherwise output a failure message
	else
	{
		test.value += '\n##[ FAIL: data initialization is not complete ]##################################################\n\n'
	}
}

