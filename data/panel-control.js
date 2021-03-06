/*Handle the "list tabs button"*/
var listButton = document.getElementById('getTabsButton');
if(listButton != null){
	listButton.onclick = function(){
		self.port.emit('tabsClicked','noMessage');	
	};
}

/*Handle the "bookmarks" button*/
var bookmarkButton = document.getElementById('getBookmarks');
if(bookmarkButton != null){
	bookmarkButton.onclick = function(){
		self.port.emit('bookmarksClicked','noMessage');	
	};

}

/*Handle the "history" button*/
var historyButton = document.getElementById('getHistory');
if(historyButton != null){
	historyButton.onclick = function(){
		self.port.emit('historyClicked','noMessage');	
	};
}

/*Handle the save tabs button*/
var saveTabs = document.getElementById('saveTabs');
if (saveTabs != null){
	saveTabs.onclick = function(){
		console.log('CLICKED');
		self.port.emit('saveTabs','noMessage');	
	};
}

/*Handle the save bookmarks button*/
var saveTabs = document.getElementById('saveBookmarks');
if (saveTabs != null){
	saveTabs.onclick = function(){
		console.log('CLICKED');
		self.port.emit('saveBookmarks','noMessage');	
	};
}


/*Handle the save history button*/
var saveTabs = document.getElementById('saveHistory');
if (saveTabs != null){
	saveTabs.onclick = function(){
		console.log('CLICKED');
		self.port.emit('saveHistory','noMessage');	
	};
}


/*Handle the get saved tabs button*/
var saveTabs = document.getElementById('getSavedTabs');
if (saveTabs != null){
	saveTabs.onclick = function(){
		console.log('CLICKED');
		self.port.emit('getSavedTabs','noMessage');	
	};
}


/*Handle the get saved bookmark button*/
var saveTabs = document.getElementById('getSavedBookmarks');
if (saveTabs != null){
	saveTabs.onclick = function(){
		console.log('CLICKED');
		self.port.emit('getSavedBookmarks','noMessage');	
	};
}



/*Handle the get saved history button*/
var saveTabs = document.getElementById('getSavedHistory');
if (saveTabs != null){
	saveTabs.onclick = function(){
		console.log('CLICKED');
		self.port.emit('getSavedHistory','noMessage');	
	};
}


/*Handle the clear button*/
var clearButton = document.getElementById('clear');
if (clearButton != null){
	clearButton.onclick = function(){
		self.port.emit('clearAll','clear screen');
	};
}

self.port.on('error',function(file){
	var error = document.getElementById('error');
	if (error != null){
		error.innerHTML = 'No ' + file + ' saved!!!'
	
	
	}



});

self.port.on('showMessage',function(msg){
	var message = document.getElementById('message');
	message.innerHTML = msg;

});

//Create a list:
/*To obtain:
 * <ul>
 * <li>a tab's title</li>
 * <li>another tab's title</li>
 * </ul>
*/

self.port.on('takeTabs',function(tabs){
	console.log('Got tabs = ' + tabs);
	var tabUL = document.getElementById('tabs');
	for each (var tabsInfo in tabs){
		var tabsURL = tabsInfo.url;
		var tabsName = tabsInfo.title;
		var tabsCookie = tabsInfo.cookies;
		var tabsID = tabsInfo.id;
		//Create a <li><a href="tab's url">tab's title</a></li>
		var tabLI = document.createElement('li');
		a = document.createElement('a');
		href = document.createAttribute('href');	//This is an attibute of 'a'
		href.value = tabsURL;
		target = document.createAttribute('target');	//Open in a new window/tab
		target.value = '_blank';
		var style = document.createAttribute('style');
		style.value = 'color:blue';
		var title = document.createTextNode(tabsName);
		a.setAttributeNode(href);
		a.setAttributeNode(target);
		a.setAttributeNode(style);
		a.appendChild(title);
		tabLI.appendChild(a);
		
		//Create a button with it's tab's ID to be able to distinguish it later
		var b = document.createElement('BUTTON');
		var id = document.createAttribute('id');
		id.value = tabsID;
		b.setAttributeNode(id);
		var t = document.createTextNode('Cookies');
		b.appendChild(t);
		//Space up
		tabLI.appendChild( document.createTextNode( '\u00A0'+'\u00A0'+'\u00A0'+'\u00A0'+'\u00A0' ) );
		tabLI.appendChild(b);
		
		tabUL.appendChild(tabLI);
	}	
	
	
	/*Show the save tabs button*/
	var saveTabsButton = document.getElementById('saveTabs');
	saveTabsButton.style.display = "block";
		
	//Make a Cookie button for each tab
	buttonsList = new Array();
	for(i=0;i<tabs.length;i++){
		buttonsList[i] = document.getElementById(tabs[i].id);
		//console.log("ID " + tabs[i].id + "  " + tabs[i].title);
		if (buttonsList[i] != null){
			//Add an event listener for each button
			buttonsList[i].addEventListener('click',function(event){
				var cookieUL = document.getElementById('cookies');
				//Clean up everything it has
				cookieUL.innerHTML = "";
				var pos = tabs.map(function(e) { 
    					return e.id; 
    				}).indexOf(this.id);
    				var cookieCenter = document.createElement('center');
    				var cookieH1 = document.createElement('h1');
    				var ulText = document.createTextNode( tabs[pos].title + " Cookies:");
    				cookieH1.appendChild(ulText);
    				cookieCenter.appendChild(cookieH1);
				cookieUL.appendChild(cookieCenter);
				var cookieLI = document.createElement('li');
				var cookieLIText = document.createTextNode(tabs[pos].cookies);
				cookieLI.appendChild(cookieLIText);
				cookieUL.appendChild(cookieLI);
				var hr = document.createElement('HR');
				cookieUL.appendChild(hr);
				/*for each (var cookie in tabs[pos].cookies){
					var cookieLI = document.createElement('li');
					var liText = document.createTextNode(cookie);
					cookieLI.appendChild(liText);	
					cookieUL.appendChild(cookieLI);			
				}*/
			
			});
			
		
		}
		
	}
	
	
},false);

self.port.on('takeBookmarks',function(listOfBookmarks){
	var bookmarksUL = document.getElementById('bookmarks');
	for each (var bookmark in listOfBookmarks){
		var main = bookmark.main;
		var folders = bookmark.folders;
		var uris = bookmark.uri;
		var bookmarkMain = document.createTextNode(main);
		var bookmarkLI = document.createElement('li');
		bookmarkLI.appendChild(bookmarkMain);
		bookmarksUL.appendChild(bookmarkLI);
		/*
		<ul id='bookmarks'>
		<li> main
			<ul>
			<li>
			folder.title
				<ul>
				<li>
				subfolder
				</li>
				</ul>
			</li>
			</ul>
		</li>
		</ul>
		
		*/
		if (folders != null){
			//console.log("Hay folders " + folders);
			for each (var folder in folders){
				var folderUL = document.createElement('ul');
				var folderLI = document.createElement('li');
				var folderText = document.createTextNode(folder.title);
				folderLI.appendChild(folderText);
				folderUL.appendChild(folderLI);
				bookmarksUL.appendChild(folderUL);
				/*Now iterate it's subfolder*/
				if (folder.sub != null){
					for each (var sub in folder.sub){
						var subUL = document.createElement('ul');
						var subLI = document.createElement('li');
						var subText = document.createTextNode(sub);
						subLI.appendChild(subText);
						subUL.appendChild(subLI);
						folderUL.appendChild(subUL);				
					}
				}
			
			}
		}
		/*Now show the uri of each subfolder*/
		if (uris != null){
			for each (var uri in uris){
				var uriUL = document.createElement('ul');
				var uriLI = document.createElement('li');
				var uriText = document.createTextNode(uri);
				uriLI.appendChild(uriText);
				uriUL.appendChild(uriLI);
				bookmarksUL.appendChild(uriUL);
			}
						
		}	
	}	
	/*Create a save bookmarks button*/
	/*Show the save tabs button*/
	var saveBookmarksButton = document.getElementById('saveBookmarks');
	saveBookmarksButton.style.display = "block";
	
});



self.port.on('takeHistory',function(listOfHistory){
	var historyUL = document.getElementById('history');
	for each(var history in listOfHistory){
		var title = history.title;
		var url = history.url;
		var visited = history.visited;
		var lastVisitedTimeInMicrosecs = history.time;
		var iconURI = history.iconURI; // is null if no favicon available
		
		//Show the history title				
		var historyLI = document.createElement('ul');
		var historyTitle = document.createElement('li');
		var titleText = document.createTextNode(title);
		historyTitle.appendChild(titleText);
		
		//Show the uri of the history (child of history title)
		var urlLI = document.createElement('li');
		var urlText = document.createTextNode(url);
		urlLI.appendChild(urlText);
		historyLI.appendChild(urlLI);
		
		//Show the number of time this uri was visited	(child of history title)	
		var visitedLI = document.createElement('li');
		var visitedText = document.createTextNode(visited);
		visitedLI.appendChild(visitedText);
		historyLI.appendChild(visitedLI);
		
		//Show when was the last time this uri was visited in microsecods. (child of history title)
		var lastLI = document.createElement('li');
		var lastText = document.createTextNode(lastVisitedTimeInMicrosecs);
		lastLI.appendChild(lastText);
		historyLI.appendChild(lastLI);
		
		historyTitle.appendChild(historyLI);
		historyUL.appendChild(historyTitle);	
	}
	
	/*Create a save history button*/
	/*Show the save tabs button*/
	var saveHistoryButton = document.getElementById('saveHistory');
	saveHistoryButton.style.display = "block";
	var hr = document.createElement('HR');
	var body = document.getElementById('body');
	body.appendChild(hr);
	
});


//Hide panel when a href is clicked
window.addEventListener('click', function(event){ 
                 var t = event.target;
                 if (t.nodeName == 'A'){
                 	self.port.emit('close','panel');
                 }                 
}, false);

String.prototype.capitalize = function() {
	//capitalize the first letter.
    	return this.charAt(0).toUpperCase() + this.slice(1);
}


//Clear the list
/*Reset eveything and list again*/
self.port.on('reset',function(message){
	//message can be tabs,getBookmarks,getHistory,etc
	var u = document.getElementById(message);
	if (u != null){
		//Remove all the "li"(tabs) elements who are child of ul
 		while (u.firstChild) {
    			u.removeChild(u.firstChild);
		}
	}
	//All the buttons are saveTabs,saveBookmarks,etc. Capitalize the first letter
	var button = 'save'+message.capitalize();
	var saveButton = document.getElementById(button);
	if (saveButton != null){
		saveButton.style.display = "none";
	}
});



