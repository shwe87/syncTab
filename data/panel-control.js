/*Handle the "list tabs button"*/
var listButton = document.getElementById('getTabsButton');
if(listButton != null){
	listButton.onclick = function(){
		self.port.emit('tabsClicked','noMessage');	
	};
}

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


//Hide panel when a href is clicked
window.addEventListener('click', function(event){ 
                 var t = event.target;
                 if (t.nodeName == 'A'){
                 	self.port.emit('close','panel');
                 }                 
}, false);


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
});



