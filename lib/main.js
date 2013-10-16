/*Mozilla sdk modules load*/
var data = require("sdk/self").data;
var tabs = require("sdk/tabs");



/*Variables*/
var tabsList = new Array();			//A list of all tabs.

/*My modules*/
var bookmarks = require('./bookmark.js');	//Query bookmarks
var history = require('./history.js');		//Query history


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


myPanel.port.on('close', function(toClose){
	if (toClose == 'panel'){
		myPanel.hide();
	}
});


//If list tabs button is clicked
myPanel.port.on('tabsClicked',function(message){
	//The content-script lets know the add-on that the user has clicked the list button.
	//So call ths function listTabs
	tabsList = listTabs();
});


//If bookmarks button is clicked
myPanel.port.on('bookmarksClicked',function(message){
	var listOfBookmarks = getBookmarks();
	myPanel.port.emit('takeBookmarks',listOfBookmarks);
});


//If get history button is clicked:
myPanel.port.on('historyClicked',function(message){
	var listOfHistory = getHistory();
	myPanel.port.emit('takeHistory',listOfHistory);


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


//Get all the bookmarks
function getBookmarks(){	
	var folderIds = bookmarks.getFoldersId();
	var allBookmarks = new Array();
	for each (var id in folderIds){
		var uri = new Array();		
		var folders = new Array();
		var b = {};
		b.main = bookmarks.nameFolder(id);
		var children = bookmarks.getFoldersChildren(id);
		// children will be an array of all the children of the folder:
		for (j=0;j<children.length;j++){
			var ifURI = bookmarks.ifUri(children[j]);
			var ifSubFolder = bookmarks.ifSubFolder(children[j]);
			if (ifURI == true){
				uri.push(children[j].title);			
			}
			else if (ifSubFolder == true){
				var folder = {};
				folder.title = children[j].title;
				var sub = new Array();
				var allChildren = bookmarks.getSubFoldersBookmarks(children[j]);
				for(k=0;k<allChildren.length;k++){
					sub.push(allChildren[k].title);
				}
				folder.sub = sub.slice(0);
				folders.push(folder);
			}	
		}
		b.uri = uri.slice(0);
		b.folders = folders.slice(0);
		allBookmarks.push(b);
	}
	return allBookmarks;

}


function getHistory(){
	var listOfHistory = history.queryHistory();
	console.log(listOfHistory.title);
	return listOfHistory;
}





