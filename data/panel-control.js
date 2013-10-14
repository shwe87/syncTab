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
	var ul = document.getElementById('tabs');
	for each (var tabsInfo in tabs){
		var tabsURL = tabsInfo.url;
		var tabsName = tabsInfo.title;
		var tabsCookie = tabsInfo.cookies;
		var tabsID = tabsInfo.id;
		//Create a <li><a href="tab's url">tab's title</a></li>
		var li = document.createElement('li');
		a = document.createElement('a');
		href = document.createAttribute('href');	//This is an attibute of 'a'
		href.value = tabsURL;
		target = document.createAttribute('target');	//Open in a new widnow/tab
		target.value = '_blank';
		var style = document.createAttribute('style');
		style.value = 'color:blue';
		var title = document.createTextNode(tabsName);
		a.setAttributeNode(href);
		a.setAttributeNode(target);
		a.setAttributeNode(style);
		a.appendChild(title);
		li.appendChild(a);
		ul.appendChild(li);
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



