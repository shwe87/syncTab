/*
<!--The personal dialog box:-->
<div id="myDialogBox" visibility= "hidden">
  <div>
   <p id="DlgContent">Choose one to log in:</p>
   <button id="dropBoxButton" class="myDialogButton"><button>
   <button id="googleDriveButton" class="myDialogButton"><button>
  </div>
</div>

*/
function createAButton(id,className){
	var button = document.createElement('button');
	button.setAttribute('id',id);
	button.setAttribute('class',className);
	button.addEventListener('click',function(event){
		var div = document.getElementById('myDialogBox');
		div.setAttribute('class','hidden');
		console.log(event.target.id);
	
	});
	return button;
}
self.port.on('show',function(msg){
	var div = document.createElement('div');
	div.setAttribute('id','myDialogBox');
	div.setAttribute('class','shown');
	
	var contentDiv = document.createElement('div');
	var p = document.createElement('p');
	p.innerHTML = 'You are currently not signed in. Please choose one to log in.'
	contentDiv.appendChild(p);
	
	var dropBoxButton = createAButton('dropBoxButton','myDialogButton');
	contentDiv.appendChild(dropBoxButton);
	var googleDriveButton = createAButton('googleDriveButton','myDialogButton');
	contentDiv.appendChild(googleDriveButton);
	
	div.appendChild(contentDiv);
	
	document.body.appendChild(div);
	
	


});
