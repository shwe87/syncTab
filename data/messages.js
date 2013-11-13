/*<div style="border:1px dotted black;padding:2em;">TEXT_HERE</div>*/





self.port.on('alreadySaved',function(message){
	
	/*var div = document.createElement('div');
	div.setAttribute('style','border:1px solid green;padding:2em;');
	var text = document.createTextNode(message);
	div.appendChild(text);
	if (body.childNodes.length == 0){
		console.log("There is none!!");
	}
	else{
		console.log("ChildNodes = " + body.childNodes.length);
	}
	document.insertBefore(div, body.childNodes[0]);*/
	/*
	<body>
    	<div id="wrapper">
        Piece of text inside a 500px width div centered on the page
    </div>
</body>*/
	var msg = 'These tabs are already saved : \n';
	for each (var title in message){
		msg = msg + title + "\n";	
	}
	alert(msg);


	
	

});



function createAButton(id, title){
	var button = document.createElement('button');
	button.setAttribute('id',id);
	button.setAttribute('title',title);
	button.style.width = '27px';
	button.style.height = '27px';
	button.style.cursor = 'pointer';
	button.style.marginLeft = '4px';
	button.style.marginRight = '10px';
	button.style.border = "solid #ff6262";
	
	//button.setAttribute('class',className);
	button.addEventListener('click',function(event){
		var div = document.getElementById('myDialogBox');
		//div.setAttribute('class','hidden');
		console.log(event.target.id);
		var clickedOption = event.target.id;
		self.port.emit('optionClicked',clickedOption);
	
	});
	return button;
}

self.port.on('show',function(message){
	var body = document.body || document.getElementsByTagName('body')[0];
	var firstDiv = document.createElement('div');
	firstDiv.setAttribute('id','mainMessageDiv');
	//firstDiv.style.zIndex = "100";
	firstDiv.style.position = "fixed";
    	firstDiv.style.top = "0px";
    	firstDiv.style.width = "100%";
    	firstDiv.style.marginLeft = "-9px"
    	//firstDiv.style.boxShadow = "0px -1px 2px rgba(0, 0, 0, 0.2)";
    	firstDiv.style.background =  /*"#ff4d4d";*/" -moz-linear-gradient(to right, #ff9d9d, #ff8989, #ff7676)";
    	firstDiv.style.border = "solid #ff6262";
    	firstDiv.style.height="50px";

	var div = document.createElement('div');
	div.setAttribute('id','messageButtonDiv');
	div.style.background = /*"#ff4d4d";*/" -moz-linear-gradient(to right, #ff9d9d, #ff8989, #ff7676)";
	//div.style.background = "none repeat scroll 0% 0% #D2EBD7";
	div.style.margin = "10px";
	div.style.fontFamily = "Palatino, Georgia, Times";
	div.style.fontSize = "small";
	
	div.style.textAlign =  "center";
	div.style.width =  "95%";
	div.style.position = "fixed";
	
		
	//var p = document.createElement('p');
	var text = document.createTextNode(message);
	//text.style.fontFamily = "Palatino, Georgia, Times";
	//text.style.fontSize = "small";
	//p.style.color = "#333333";
	//p.style.fontWeight = "600";
	//p.appendChild(text);
	div.appendChild(text);
	
	
	//var contentDiv = document.createElement('div');
	var dropBoxButton = createAButton('dropBoxButton','Sign in with Dropbox.');
	dropBoxButton.style.background = "url(http://upload.wikimedia.org/wikipedia/de/3/3a/Dropbox_Logo_02.svg) no-repeat";
	dropBoxButton.style.backgroundSize = "25px 25px";
	div.appendChild(dropBoxButton);
	var googleDriveButton = createAButton('googleDriveButton','Sign in with Google Drive.');
	googleDriveButton.style.background = "url(http://upload.wikimedia.org/wikipedia/commons/9/9b/Logo_of_Google_Drive.png) no-repeat";
	googleDriveButton.style.backgroundSize = "25px 25px";
	div.appendChild(googleDriveButton);
	
	/*

close button
 position: absolute;
    top: -10px;
    right: -10px;
    border: solid 1px red;
    z-index: 4;
    cursor: pointer;

*/
	var closeButtonDiv = document.createElement('div');
	//closeButtonDiv.style.fontSize = 'xx-small';
	var closeButton = createAButton('closeButton', 'Close.');
	closeButton.setAttribute('id','unAuthCloseButton');
	closeButton.style.width = '30px';
	closeButton.style.height = '13px';
	closeButton.style.position = 'absolute';
	closeButton.style.background = "transparent";
	closeButton.style.fontSize = "70%";
	closeButton.innerHTML = "close";
	closeButton.style.padding = '0';
	closeButton.style.border = 'none';
	closeButton.addEventListener('click',function(event){
		console.log('messageClose');
		clean('mainMessageDiv');
	});
	//closeButton.style.
	closeButton.style.marginTop = '-5px';
	closeButton.style.marginLeft = '-5px';
	//closeButton.style.top = '0';
	//closeButton.style.top = '-10px';
	//closeButton.style.right = '-10px';
	closeButtonDiv.appendChild(closeButton);
	div.appendChild(closeButtonDiv);
	//div.appendChild(contentDiv);
	
	firstDiv.appendChild(div);
	
	
	//body.appendChild(firstDiv);
	body.insertBefore(firstDiv,body.childNodes[1]);

});

self.port.on('savedCompletely',function(message){

	alert(message);


});

self.port.on('clean',function(message){
	clean('mainMessageDiv');

});


self.port.on('authenticated',function(message){
	console.log("Authenticated!!\r\n\r\n");

	alert(message);
});


function clean(elementToClean){
	var toClean = document.getElementById(elementToClean);
	if (toClean != null){
		while (toClean.firstChild) {
    			toClean.removeChild(toClean.firstChild);
		}
		//Remove the div
		toClean.parentElement.removeChild(toClean);
	}
	
	
}
