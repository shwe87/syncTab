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


exports.addSaveAllTabsMenu = function(){
	var toolBar = document.getElementById('menu_ToolsPopup');
	
	var menuitem = document.createElement('menuitem');
	menuitem.setAttribute('id', 'saveTabs');
	menuitem.setAttribute('label', 'Save all Tabs');
	menuitem.addEventListener('command', function(event){
		emit(exports,'saveAllTabsClicked',tabs);
	});
	toolBar.appendChild(menuitem);
}


exports.on = on.bind(null, exports);
exports.once = once.bind(null, exports);
exports.removeListener = function removeListener(type, listener) {
  off(exports, type, listener);
};


