self.on('click',function(node,data){
	//console.log('Context clicked ' + node.nodeName);
	var allChildren = node.children;
	var nodeToSend = new Object();
	for each(var child in allChildren){
		if (child.className == 'title'){
			nodeToSend.title = child.innerHTML;
		}
		if (child.className == 'url'){
			nodeToSend.url = child.innerHTML;
			self.postMessage(nodeToSend);
			break;
		}
		
	}
});
				
