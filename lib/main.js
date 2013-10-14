/*Mozilla sdk modules load*/
var data = require("sdk/self").data;
var tabs = require("sdk/tabs");



/*Variables*/
var tabsList = new Array();			//A list of all tabs.



/*Panel settings*/
var myPanel = require("sdk/panel").Panel({
	width:500,
	height:500,
	position: {
   		right: 0
  	},
	contentScriptFile: data.url("panel-control.js"),	
	contentURL: data.url("panel.html")	//Trusted script, contentScriptFile not required
});

/*Widget settings*/
var myWidget = require("sdk/widget").Widget({
	id: "my-widget",
	label: "My Widget",
	content: "Synch",
	width: 50,
	panel: myPanel,
	//onClick: auth
});

myPanel.port.on('tabsClicked',function(message){
	//The content-script lets know the add-on that the user has clicked the list button.
	//So call ths function listTabs
	tabsList = listTabs();
});

myPanel.port.on('close', function(toClose){
	if (toClose == 'panel'){
		myPanel.hide();
	}

});

function listTabs() {
	var listOfTabs = new Array();
	
	//Clear everything before doing anything
	myPanel.port.emit('reset','tabs');
	
	var numberOfTabs = tabs.length;
	var countTabs = 0;
	//For each tab handle the tab's info:
	for each (var tab in tabs){
		//Create object with all the info as a  serialazable JSON message
		var info = new Object();
		info.id = tab.id;
		info.title = tab.title;
		info.url = tab.url;		
		listOfTabs.push(info);		
		countTabs++;
				
	}
	myPanel.port.emit('takeTabs',listOfTabs);
	return listOfTabs;
}



