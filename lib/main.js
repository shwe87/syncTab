/*Mozilla sdk modules load*/
var data = require("sdk/self").data;
var tabs = require("sdk/tabs");




/*Variables*/
var tabsList = new Array();			//A list of all tabs.
var listOfBookmarks = new Array();		// A list of all bookmarks
var listOfHistory = new Array();		//A list of history

/*My modules*/
var bookmarks = require('./bookmark.js');	//Query bookmarks
var history = require('./history.js');		//Query history
var gapi = require('./gapi.js');



/* GOOGLE DRIVE OAUTH CONSTANTS */
var CLIENT_ID = '737302378245.apps.googleusercontent.com';
var CLIENT_SECRET = 'rcWgBDcdt9PuVnrKGXz81Hf7';
var REDIRECT_URI_URN = 'urn:ietf:wg:oauth:2.0:oob';
var REDIRECT_URI_LOCAL = 'http://localhost';
var SCOPE = 'https://www.googleapis.com/auth/drive+';
var URL = 'https://accounts.google.com/o/oauth2/auth?'+'scope='+SCOPE+'https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&'+'redirect_uri=' + REDIRECT_URI_URN + '&'+ 'client_id=' + CLIENT_ID+'&'+'response_type=code';


/*Google drive necessary var.*/
var access_token;
var token_type;
var expires_in;
var id_token;
var refresh_token;
var resumable_sesion_uri;
var theCode;

var authenticated = false;


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
	listOfBookmarks = getBookmarks();
	myPanel.port.emit('takeBookmarks',listOfBookmarks);
});


//If get history button is clicked:
myPanel.port.on('historyClicked',function(message){
	listOfHistory = getHistory();
	myPanel.port.emit('takeHistory',listOfHistory);
});




function saveData(uploadData){
	gapi.uploadFile(uploadData);
	gapi.on('saveComplete',function(uri){
		myPanel.port.emit('showMessage','UPLOADED!!');
	
	
	});	

}

function handleResponse(response){
	authenticated = true;
	accessDatas = response[0];
	element = response[1];
	//Save the respective value of the access response.
	access_token = accessDatas.access_token;
	token_type = accessDatas.token_type;
	expires_in = accessDatas.expires_in;
	id_token = accessDatas.id_token;
	refresh_token = accessDatas.refresh_token;
	
	var dataToSave;
	if (element == 'tabs'){
		dataToSave = tabsList;
			
	}
	else if (element == 'bookmarks'){
		dataToSave = listOfBookmarks;
	}
	else{
		dataToSave = listOfHistory;
	}
		
	gapi.saveData(element, dataToSave, access_token);
	/*emit(exports, 'startComplete', [dataToSave, resumable_sesion_uri, token ]);*/
	gapi.on('startComplete',saveData);
	
}



//If save tabs button is clicked:
myPanel.port.on('saveTabs',function(message){
	//console.log('CLicked');
	if (!authenticated){
		gapi.auth(myPanel,'tabs');
		gapi.on('authComplete',handleResponse);
	}
	else{
	//If already authenticated then just pass the access_token
		gapi.saveData('tabs',tabsList,access_token);
		gapi.on('startComplete',saveData);
	}	
});


//If save bookmarks button is clicked:
myPanel.port.on('saveBookmarks',function(message){
	//console.log('CLicked');
	if (!authenticated){
		gapi.auth(myPanel,'bookmarks');
		gapi.on('authComplete',handleResponse);
	}
	else{
	//If already authenticated then just pass the access_token
		gapi.saveData('bookmarks',listOfBookmarks,access_token);
		gapi.on('startComplete',saveData);
	}
});

//If save history button is clicked:
myPanel.port.on('saveHistory',function(message){
	//console.log('CLicked');
	if (!authenticated){
		gapi.auth(myPanel,'history');
		gapi.on('authComplete',handleResponse);
	}
	else{
	//If already authenticated then just pass the access_token
		gapi.saveData('history',listOfHistory,access_token);
		gapi.on('startComplete',saveData);
	}	
});

function handleSavedData(data){

	var fileName = data[0];
	try{
		var fileData = JSON.parse(data[1]);
	}catch(e){
		console.log(e.toString());
		var fileData = data[1];
	}
	
	if (fileData == null){
		console.log('Data null!!!');
		myPanel.port.emit('error',fileName.split('.json')[0]);
	}
	else{
		if (fileName == 'tabs.json'){
			//console.log('GOT TABS = ' + fileData);
			myPanel.port.emit('reset','tabs');
			myPanel.port.emit('takeTabs',fileData);
			
		}
		else if (fileName == 'bookmarks.json'){
			myPanel.port.emit('takeBookmarks',fileData);
		}
		else{
			myPanel.port.emit('takeHistory',fileData);
		}
	}


}

function handleError(fileName){
	//console.log('ERROR!!!!');
	var file = fileName.split('.json')[0];
	
	myPanel.port.emit('error',file);
	

}


function getFileData(response){
	authenticated = true;
	var accessDatas = response[0];
	var element = response[1];
	
	
	//Save the respective value of the access response.
	
	access_token = accessDatas.access_token;
	token_type = accessDatas.token_type;
	expires_in = accessDatas.expires_in;
	id_token = accessDatas.id_token;
	refresh_token = accessDatas.refresh_token;
	
	
	gapi.getData(element, access_token);
	gapi.on('downloadComplete',handleSavedData);
	gapi.on('cannotDownload', handleError);
	//emit(exports,'downloadComplete',response.text);
	/*
	
		
	gapi.saveData(element, dataToSave, access_token);
	/*emit(exports, 'startComplete', [dataToSave, resumable_sesion_uri, token ]);*/
	
	
}





//If get saved tabs button is clicked:
myPanel.port.on('getSavedTabs',function(message){
	//console.log('CLicked');
	console.log('Get tabs clicked');
	if(!authenticated){
		gapi.auth(myPanel,'tabs');
		gapi.on('authComplete',getFileData);
	}
	else{
		gapi.getData('tabs',access_token);
		gapi.on('downloadComplete',handleSavedData);
		gapi.on('cannotDownload', handleError);
	}	
});


//If get saved bookmarks button is clicked:
myPanel.port.on('getSavedBookmarks',function(message){
	//console.log('CLicked');
	console.log('Get bookmarks clicked');
	if(!authenticated){
		gapi.auth(myPanel,'bookmarks');
		gapi.on('authComplete',getFileData);
	}
	else{
		gapi.getData('bookmarks',access_token);
		gapi.on('downloadComplete',handleSavedData);
		gapi.on('cannotDownload', handleError);
	}
});

//If get saved history button is clicked:
myPanel.port.on('getSavedHistory',function(message){
	//console.log('CLicked');
	console.log('Get history clicked');
	if(!authenticated){
		gapi.auth(myPanel,'history');
		gapi.on('authComplete',getFileData);
	}
	else{
		gapi.getData('history',access_token);
		gapi.on('downloadComplete',handleSavedData);
		gapi.on('cannotDownload', handleError);
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
	var historyList = history.queryHistory();
	//console.log(listOfHistory.title);
	return historyList;
}








