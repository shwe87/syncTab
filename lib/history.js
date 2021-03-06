var {Cc, Ci, Cu} = require("chrome");
/*var history = Cc["@mozilla.org/browser/nav-history-service;1"]
              .getService(Ci.nsINavHistoryService);*/

var historyService = Cc["@mozilla.org/browser/nav-history-service;1"]
                               .getService(Ci.nsINavHistoryService);             
              
              
exports.queryHistory = function(){
	var listOfHistory = new Array();
	//var history = {};
	var query = historyService.getNewQuery();
	var options = historyService.getNewQueryOptions();
	options.sortingMode = options.SORT_BY_VISITCOUNT_DESCENDING;
	options.maxResults = 10;

	// execute the query
	var result = historyService.executeQuery(query, options);

	// iterate over the results
	result.root.containerOpen = true;
	var count = result.root.childCount;
	for (var i = 0; i < count; i++) {
	  var node = result.root.getChild(i);
	  var nodeHistory = {};
	  // do something with the node properties...
	  var title = node.title;
	  var url = node.uri;
	  var visited = node.accessCount;
	  var lastVisitedTimeInMicrosecs = node.time;
	  var iconURI = node.icon; // is null if no favicon available
	  nodeHistory.title = title;
	  nodeHistory.url = url;
	  nodeHistory.visited = visited;
	  nodeHistory.time = lastVisitedTimeInMicrosecs;
	  nodeHistory.iconURI = iconURI;
	  console.log('History = ' + JSON.stringify(nodeHistory));
	  listOfHistory.push(nodeHistory);
	  
	}

	result.root.containerOpen = false;
	return listOfHistory;


}
