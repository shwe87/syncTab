var code = document.getElementsByClassName('auth-code')[0];

if (code != null){
	self.port.emit('takeCode',code.innerHTML);
	console.log('JS TAKE CODE = ' + code.innerHTML);
}


self.port.on('signedIn',function(msg){
	document.body.innerHTML = msg;
	//tab.close();
	//self.port.emit('closeTab','close');
});

self.on("detach", function() {
  	window.close();
});