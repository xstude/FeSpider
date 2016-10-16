
//get the collection of link elements that are switchable stylesheets
for(var switchables=[], 
		links=document.getElementsByTagName('link'),
		i=0; i<links.length; i++)
{
	if(/stylesheet$/i.test(links[i].getAttribute('rel'))
		&& links[i].getAttribute('title'))
	{
		switchables.push(links[i]);
		
		//### implement the webkit disabled-state bugfix ###
		//http://www.brothercake.com/site/resources/scripts/cssutilities/config/#config-watch-browsernote
		if(links[i].getAttribute('rel') == 'alternate stylesheet')
		{
			links[i].disabled = true;
		}
	}
}



//save a reference to the switcher menu, the output code area, 
//and the first <h1> on the page for testing
var switchermenu = document.getElementById('switcher-menu'),
	output = document.getElementById('output'),
	heading = document.getElementsByTagName('h1').item(0);


//now bind a change handler to the switcher menu
//that switches between the relevant stylesheets
switchermenu.onchange = function()
{
	//get the selected option's title
	var title = this.options[this.options.selectedIndex].firstChild.nodeValue;
	
	//now set the switchable stylesheets' disabled states accordingly
	for(var i=0; i<switchables.length; i++)
	{
		switchables[i].disabled = (switchables[i].title != title);
	}
};



//set config
CSSUtilities.define('mode', 'author');
CSSUtilities.define('attributes', false);
CSSUtilities.define('watch', true);


//intialize, with callback so it gets re-called when auto re-init happens
CSSUtilities.init(function()
{
	//get properties for the <h1> element
	var props = CSSUtilities.getCSSProperties(heading, 'screen');
	
	//assemble the output string, only including color properties
	var str = '';
	for(var i in props)
	{
		if(!props.hasOwnProperty(i) || !/color/i.test(i)) { continue; }
		
		str += i + ': ' + props[i] + ';\n';
	}
	
	//output the final string to the code area
	output.innerHTML = str;
	
	//set the select menu accordingly
	//so we get a reactive response to native switching
	for(i=0; i<switchables.length; i++)
	{
		if(!switchables[i].disabled)
		{
			switchermenu.selectedIndex = i;
			break;
		}
	}
});
