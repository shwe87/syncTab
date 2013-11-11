/*http://visionwidget.com/ajax-gif-loader-generators.html
LOADING ICON = https://drive.google.com/file/d/0B-QM_tizf_jpQUNpeUR1V05TWmM/edit?usp=sharing
SYNCING ICON = https://drive.google.com/file/d/0B-QM_tizf_jpQUNpeUR1V05TWmM/edit?usp=sharing
*/
/*CONSTANTS:*/
const LOADING_ICON = 'https://drive.google.com/file/d/0B-QM_tizf_jpQUNpeUR1V05TWmM/edit?usp=sharing';
const SYNCING_ICON = 'https://drive.google.com/file/d/0B-QM_tizf_jpQUNpeUR1V05TWmM/edit?usp=sharing';

//As soon as the page loads, create the effect in the main table:
createEffectInTable('cell','selected');
createEffectInTable('bCell','bSelected');

//When the page loads for the first time:
self.port.on('start',function(clickedElement){
	//When the tab opens, open the bookmark table.
	var cell = document.getElementById('bookmarksCell');
	window.alert("HELOO");
	cell.click();
});


//Get the table ready depending on which element is going to be shown:
self.port.on('getTableReady',function(element){
	//This is to decide if the hidden row is going to be shown or not
	var createEffect = false;	//Create the hidden/shown row effect:
	clean('mainContent');
	clean('loading');
		
	if (element == 'bookmarks'){
		setOptions('Bookmarks','Saved Bookmarks');
		createEffect = true;
	}
	else if(element == 'history'){
		setOptions('History','Saved History');
		createEffect = true;
	}
	
	if (createEffect){
		//Bookmarks, history
		showHiddenRow();
		//createEffectInTable('bCell','bSelected');
		
		var mainContent = document.getElementById('mainContent');
		var UL = document.createElement('ul');
		UL.setAttribute('id',element+'List');
		mainContent.appendChild(UL);
	}
	else{
		putLoading();
		hideHiddenRow();
		/*var loading = document.getElementById('loading');
		loading.innerHTML = 'Loading. Please wait.....'*/
	}
	
});

//Get the hidden row ready:
self.port.on('initHiddenRow',initHiddenRow);

//Show the saved tabs. Display the elements in the content.
self.port.on('showtabs',function(elementsToShow){
	////console.log(JSON.stringify(elementsToShow));
	//First clean the table, delete the previous items that were showing:
	//clean('mainContent');
	//var tabsTable = document.getElementById('tabsTable');
	window.alert('SHOW TABS!!');
	clean('loading');
	var allTabs = elementsToShow.tabs;
	if (allTabs.length == 0){
		var mainContent = document.getElementById('mainContent');
		var p = document.createElement('p');
		p.innerHTML = 'Nothing saved yet!';
		mainContent.appendChild(p);
	}
	else{
		for each (var tab in allTabs){
			//var rowCell = document.createElement('tr');
			//var columnCell = document.createElement('td');
			var mainContent = document.getElementById('mainContent');
			//columnCell.innerHTML = tab.title;
			/*var image = document.createElement('img');
			image.setAttribute('src',tab.favicon);
			image.setAttribute('height','20');
			image.setAttribute('width','20');
			columnCell.appendChild(image);*/
			var p1 = document.createElement('p');
			p1.setAttribute('id','tabsTitle');
			p1.innerHTML = tab.title;
			mainContent.appendChild(p1);
			//document.insertBefore(image,p1);
			var p2 = document.createElement('p');
			p2.setAttribute('class','url');
			p2.innerHTML = tab.url;
			var line = document.createElement('hr');
			mainContent.appendChild(p2);
			mainContent.appendChild(line);
			//rowCell.appendChild(columnCell);
			//tabsTable.appendChild(rowCell);
		}
	}

});


self.port.on('showbookmarks',function(elementsToShow){
	clean('loading');
	var allBookmarks = elementsToShow.bookmarks;
	for each(var bookmark in allBookmarks){
		var mainContent = document.getElementById('mainContent');
		var p1 = document.createElement('p');
		p1.setAttribute('id','tabsTitle');
		p1.innerHTML = bookmark.title;
		mainContent.appendChild(p1);
		//document.insertBefore(image,p1);
		var p2 = document.createElement('p');
		p2.setAttribute('class','url');
		p2.innerHTML = bookmark.url;
		var line = document.createElement('hr');
		mainContent.appendChild(p2);
		mainContent.appendChild(line);
	}

});


	


/*Synch foto = https://cdn3.iconfinder.com/data/icons/block/32/sync-512.png*/




self.port.on('takeAllHistory',function(allHistory){
	var historyList = document.getElementById('historyList');
	////console.log("History length = " +  allHistory.length);
	if (allHistory.length == 0){
		var historyP = document.createElement('p');
		historyP.innerHTML = "No history to show.";
		historyList.appendChild(historyP);
	}
	else{
		for each(var aHistory in allHistory){
			var aHistoryLI = document.createElement('li');
			var favQuery = "http://www.google.com/s2/favicons?domain="+aHistory.url;
			aHistoryLI.style.background = "url('"+favQuery+"') no-repeat left top";
			aHistoryLI.style.margin = '0px';
			/*Padding = Top, Right, Left, Bottom.*/
			aHistoryLI.style.padding = '0px 0px 0px 5px';	//Modify only the space between the icon and the title.
			var liDiv = makeLiContent(aHistory.title, aHistory.url);
			aHistoryLI.appendChild(liDiv);
			historyList.appendChild(aHistoryLI);
		
		}
	}


});





self.port.on('takeABookmark',function(bookmarkToShow){
	/*https://cdn3.iconfinder.com/data/icons/block/32/sync-512.png*/
	
	var ifFolder = bookmarkToShow[1];
	var aBookmark = bookmarkToShow[0];
	var parentId = aBookmark.parentId;
	////console.log('takeABookmark received : ' + aBookmark.title);
	var parent = document.getElementById(parentId);
	if (ifFolder){
		//var aDiv = document.createElement('div');
		var bookmarkUL = document.createElement('ul');
		bookmarkUL.setAttribute('id',aBookmark.itemId);
		//bookmarkUL.setAttribute('class','title');
		var bookmarkText = document.createTextNode(aBookmark.title);
		bookmarkUL.appendChild(bookmarkText);
		var line = document.createElement('hr');
		bookmarkUL.appendChild(line);
		var favQuery = "http://www.gettyicons.com/free-icons/103/pretty-office-2/png/256/folder_256.png";
		bookmarkUL.style.background = "url('"+favQuery+"') no-repeat left top";
		bookmarkUL.style.backgroundSize = "15px 15px";
		bookmarkUL.style.margin = '0px';
		bookmarkUL.style.padding = '0px 0px 0px 20px';	//Modify only the space between the icon and the title.
		bookmarkUL.addEventListener('click',function(event){
			////console.log("I was clicked!!  " + event.target.nodeName);
			var whatWasClicked = event.target;
			if (whatWasClicked.nodeName == 'UL'){ //Only when a folder is clicked
				var ULChildren = bookmarkUL.children;	//The third child is the LI elements
				if (ULChildren != undefined){
					for (var i=0;i<ULChildren.length;i++){
						////console.log(i+" ULChildren = " + ULChildren[i].innerHTML);
						if (ULChildren[i].className == 'hidden'){
							ULChildren[i].setAttribute('class','showLi');
						}
						else if(ULChildren[i].className == 'showLi'){
							ULChildren[i].setAttribute('class','hidden');
						}
					}
				}
			}
		});
		parent.appendChild(bookmarkUL);
	}
	else{
		var bookmarkLI = document.createElement('LI');	
		bookmarkLI.setAttribute('class','hidden');

		var liDiv = makeLiContent(aBookmark.title,aBookmark.url);
		bookmarkLI.appendChild(liDiv);
		
		var favQuery = "http://www.google.com/s2/favicons?domain="+aBookmark.url;
		bookmarkLI.style.background = "url('"+favQuery+"') no-repeat left top";
		bookmarkLI.style.margin = '0px';
		/*Padding = Top, Right, Left, Bottom.*/
		bookmarkLI.style.padding = '0px 0px 0px 5px';	//Modify only the space between the icon and the title.
		
		
		parent.appendChild(bookmarkLI);	
	}

	
	
});




/*************FUNCTIONS****************/


function createEffectInTable(cellName, selectedType){
	//console.log("\t\t\t\t Creating effect in table " + cellName + "," + selectedType);
	var td = document.getElementsByClassName(cellName);
	
	//Add an event listener to all the cell "menu"
	for (var i=0;i<td.length;i++){
		//var ifClickedAdded = td[i].className.split(' click');
		//if (ifClickedAdded.length == 1 ){
			////console.log("\t\t\t\t Doesn't have click!!!!!");
			//td[i].setAttribute('class',td[i].getAttribute('class')+' click');	//Click added
			td[i].addEventListener('click',function(event){
				putLoading();
				//var loading = document.getElementById('loading');
				//loading.innerHTML = 'Loading. Please wait.......'
				////console.log('I have been clicked on!! ' + event.target.innerHTML);
				//Get the element that was clicked on:
				var clickedElement = event.target;
				//Get the class of the clicked element to know if it was already selected.
				var clickedClass = clickedElement.getAttribute('class');
				//var selectedOne = clickedClass.split(selectedType);
				if (clickedClass == cellName){//If it is not the selected one:
				//if (selectedOne.length == 1 ){ //Not the selected onw
					//Get the selected one.
					var selected = document.getElementsByClassName(selectedType);
					//Make it unselected (a normal cell) 
					selected[0].setAttribute('class',cellName);
					//Make selected to the clicked cell.
					clickedElement.setAttribute('class',cellName+' '+selectedType);
				}//
				/*else{//The selected one
					//console.log("Adding click");
					clickedElement.setAttribute('class' + clickedClass+' click');
				
				}*/
				var whatWasClicked = new Object();
				whatWasClicked.node = event.target.innerHTML;
				whatWasClicked.id = event.target.id;
				//console.log("CLicked on = " + event.target.id);
				self.port.emit('cellClicked',whatWasClicked);
				//console.log("\t\t\t\t cellClicked Sent.");
		
					
			});
			
		//}else{
		//	//console.log("\t\t\t HAS CLICK");
		//}
	}
}

//Get the hidden row ready
function initHiddenRow(){
	//console.log('\t\t\t\t initHiddenRow');
	var twoOption = document.getElementById('twoOption');
	twoOption.setAttribute('class','bCell');
	var oneOption = document.getElementById('oneOption');
	oneOption.setAttribute('class','bCell bSelected');

}

//Shows the hidden row.
function showHiddenRow(){
	var hiddenRow = document.getElementById('hiddenRow');
		if (hiddenRow != null){
			hiddenRow.style.display='table-row';
			var content = document.getElementById('mainContent');
			content.setAttribute('class','content bContent');
	}
}

//Hides the hidden row.
function hideHiddenRow(){
	var hiddenRow = document.getElementById('hiddenRow');
	hiddenRow.style.display = 'none';
	var content = document.getElementById('mainContent');
	content.setAttribute('class','content');
}

//Set the hidden row's content with the options.
function setOptions(option1, option2){
	var optionOne = document.getElementById('oneOption');
	optionOne.innerHTML = option1;
	var optionTwo = document.getElementById('twoOption');
	optionTwo.innerHTML = option2;
}

//Set the loading message with its icon:
function putLoading(){
	//console.log("\t\t\t\tAdding loading.....");
	var loading = document.getElementById('loading');
	var loadingIconSpan = document.createElement('span');
	var loadingIcon = document.createElement('img');
	loadingIcon.setAttribute('src',LOADING_ICON);
	//loadingIcon.setAttribute('width','15px');
	//loadingIcon.setAttribute('height','15px');
	loadingIcon.setAttribute('title','Loading. Please wait.....');
	loadingIconSpan.appendChild(loadingIcon);
	loading.appendChild(loadingIconSpan);
	
	var loadingText = document.createElement('span');
	loadingText.innerHTML = '  Loading. Please wait.....';
	loading.appendChild(loadingText);
	//console.log('\t\t\t\tLoading added complete.\r\n\r\n');

}



//Function that makes the <li> element's content, will be a div with two <p>
function makeLiContent(title, url){
	//Always a link, never a folder.
	//Make the div element.
	var div = document.createElement('div');
	
	var imageSpan = document.createElement('span');
	imageSpan.setAttribute('class','hidden');
	var image = document.createElement('img');
	image.setAttribute('title','Click to save.');
	image.setAttribute('src','https://cdn3.iconfinder.com/data/icons/block/32/sync-512.png');
	image.setAttribute('width','15px');
	image.setAttribute('height','15px');
	imageSpan.appendChild(image);
	div.appendChild(imageSpan);
	
	//Make the title and add it to the div
	var titleSpan = document.createElement('span');
	titleSpan.setAttribute('class','title');
	titleSpan.innerHTML = title;
	div.appendChild(titleSpan);
	
	//Make the url and add it to the div
	var urlP = document.createElement('p');
	urlP.innerHTML = url;
	urlP.setAttribute('class','url');
	div.appendChild(urlP);
	
	//Make the line and add it to the div.
	var line = document.createElement('hr');
	line.setAttribute('class','liLine');
	div.appendChild(line);
	
	div.addEventListener('mouseover',function(event){
		////console.log('Hovered over ' + event.target.nodeName);		
		var DIVChildren = event.target.parentNode.children;	//The third child is the LI elements
		if (DIVChildren != undefined){
			for (var i=0;i<DIVChildren.length;i++){
				////console.log(i+" DIVChildren = " + DIVChildren[i].className);
				if (DIVChildren[i].className == 'hidden'){
					////console.log("IMG = " + DIVChildren[i].innerHTML);
					DIVChildren[i].className = 'show';
				}
				
			}
		}
			
	});
	
	div.addEventListener('mouseout',function(event){
		////console.log(event.target.parentNode);
		
		var DIVChildren = event.target.parentNode.children;	//The third child is the LI elements
		if (DIVChildren != undefined){
			for (var i=0;i<DIVChildren.length;i++){
				////console.log(i+" DIVChildren = " + DIVChildren[i].className);
				if (DIVChildren[i].className == 'show'){
					////console.log("IMG = " + DIVChildren[i].innerHTML);
					DIVChildren[i].className = 'hidden';
				}
				
			}
		}
			
	});
	return div;
}






function clean(elementToClean){
	var toClean = document.getElementById(elementToClean);
	if (toClean != null){
		while (toClean.firstChild) {
    			toClean.removeChild(toClean.firstChild);
		}
	}
	//Clean also the loading message:
	
}

