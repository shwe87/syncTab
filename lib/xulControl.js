const {Ci,Cc} = require("chrome");
var { emit, on, once, off } = require("sdk/event/core");
var tabs = require("sdk/tabs");


var mediator = Cc['@mozilla.org/appshell/window-mediator;1'].getService(Ci.nsIWindowMediator);
//Get the window
var window = mediator.getMostRecentWindow("navigator:browser");
//Get the XUL elements as DOM
var document = mediator.getMostRecentWindow("navigator:browser").document; 

function createMenuItem(id,label){
	var menuItem = document.createElement('menuitem');
	menuItem.setAttribute('id',id);
	menuItem.setAttribute('label',label);
	return menuItem;

}


exports.addTabMenu = function() {    
	var tabContextMenu = document.getElementById("tabContextMenu");
	var currentTab = null;
	if (!tabContextMenu) {
		emit(exports,'ERROR','tab context menu doesnt exist');
	}
		    
	var menuItem = createMenuItem('myItem','Synch this tab');
	menuItem.addEventListener('command', function(event) {
		currentTab = tabs.activeTab;
		console.log(currentTab.id);
		console.log(currentTab.title);
		console.log(currentTab.url);
		emit(exports,'tabContextClicked',[currentTab]);	
	}, false);
	tabContextMenu.appendChild(menuItem);  	  
}


function addSaveAllTabsMenu(){
	//var toolBar = document.getElementById('menu_ToolsPopup');
	
	/*var menuitem = document.createElement('menuitem');
	menuitem.setAttribute('id', 'saveTabs');
	menuitem.setAttribute('label', 'Save all Tabs');*/
	var menuitem = createMenuItem('saveTabs','Save all Tabs');
	menuitem.addEventListener('command', function(event){
		emit(exports,'saveAllTabsClicked',tabs);
	});
	return menuitem;
	//toolBar.appendChild(menuitem);
}


function addOpenMenu(){
	
	
	var openMenuItem = createMenuItem('openMenu','Open...');
	
	openMenuItem.addEventListener('command',function(event){
		emit(exports, 'openMenuClicked', 'open');
	});
	
	return openMenuItem;
	


}

exports.addAllOptions = function(){

	//Add the options in the tool menu:
	var toolBar = document.getElementById('menu_ToolsPopup');
	//Create a pop up menu item:
	var menu = document.createElement('menu');
	menu.setAttribute('id','SyncShareMenu');
	menu.setAttribute('label','Synch & Share Menu');
	var menuPopUp = document.createElement('menupopup');
	menuPopUp.setAttribute('id','SyncShareMenuPopUp');
	//Add the Save all Tabs option.
	menuPopUp.appendChild(addSaveAllTabsMenu());
	//Add the Open... menu option:
	menuPopUp.appendChild(addOpenMenu());
	menu.appendChild(menuPopUp);
	toolBar.appendChild(menu);
	//Add the tabs context menu:
	this.addTabMenu();


}

exports.on = on.bind(null, exports);
exports.once = once.bind(null, exports);
exports.removeListener = function removeListener(type, listener) {
  off(exports, type, listener);
};


