/*Mozilla sdk modules load*/
var data = require("sdk/self").data;
var tabs = require("sdk/tabs");



/*Variables*/
var tabsList = new Array();			//A list of all tabs.



/*Panel settings*/
var myPanel = require("sdk/panel").Panel({
	width:800,
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


//Get all the open tabs information, save it locally and send it to the content-script.
function listTabs() {
	var listOfTabs = new Array();
	
	//Clear everything before doing anything
	myPanel.port.emit('reset','tabs');
	
	var numberOfTabs = tabs.length;
	var countTabs = 0;
	//For each tab handle the tab's info:
	for each (var tab in tabs){
		//Create object with all the info as an object which will be a serialazable JSON message
		var info = new Object();
		info.id = tab.id;
		info.title = tab.title;
		info.url = tab.url;		
		listOfTabs.push(info);		
		//A tab's worker, used to get information and work on the tab.
		worker = tab.attach({
    			contentScriptFile: data.url("give-tabs-cookies.js")
   		});
   		// Ask the worker's content-script for tab's cookies 
    		worker.port.emit('giveCookies',tab.id);
    		worker.port.on('takeCookies',function(cookiesInfo){
    			countTabs++;
    			//Ths last element of the cookie's content-script is the tabs id.
    			var thisTabsId = cookiesInfo.pop();
    			//Lets search for the tab with thisTabsId in the listOfTabs.
    			var pos = listOfTabs.map(function(e) { 
    				return e.id; 
    			}).indexOf(thisTabsId);
    			
    			//Once we have got the position of the tab with the id, lets save its cookies:
    			listOfTabs[pos].cookies = cookiesInfo;
    			 			
			/*If we have saved information of all the tabs then send it to the content-script*/
			if(countTabs == numberOfTabs){
				myPanel.port.emit('takeTabs',listOfTabs);
			}
		}); 
	}
	return listOfTabs;
}



