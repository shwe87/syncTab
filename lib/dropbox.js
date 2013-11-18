var { emit, on, once, off } = require("sdk/event/core");
var base64 = require("sdk/base64");

var data = require("sdk/self").data;
var tabs = require("sdk/tabs");
var Request = require("sdk/request").Request;
/* Dropbox OAUTH CONSTANTS */
const APP_KEY = 
const APP_SECRET = 
//const REDIRECT_URI_URN = 'urn:ietf:wg:oauth:2.0:oob';
//const REDIRECT_URI_LOCAL = 'http://localhost';
//const SCOPE = 'https://www.googleapis.com/auth/drive.appdata+';
//var URL = 'https://accounts.google.com/o/oauth2/auth?'+'scope='+SCOPE+'https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&'+'redirect_uri=' + REDIRECT_URI_URN + '&'+ 'client_id=' + CLIENT_ID+'&'+'response_type=code';
var URL = 'https://www.dropbox.com/1/oauth2/authorize?client_id='+APP_KEY+'&response_type=code';
var tabWorker;


exports.on = on.bind(null, exports);
exports.once = once.bind(null, exports);
exports.removeListener = function removeListener(type, listener) {
  off(exports, type, listener);
};

//This is the auth function: controls the authentication process:
exports.auth = function (callersData){
	//name = element;
	tabs.open({
		url: URL	
	});	
	tabs.on('ready', function(tab) {
		//panel.hide();
		//console.log('READY!!!');
  		tabWorker = tab.attach({
		      contentScriptFile: data.url('dropbox-handler.js')
	 	});
	 	/*https://api.dropbox.com/1/oauth2/token -d grant_type=authorization_code -d code=<YOUR-AUTHORIZATION-CODE> -u <YOUR-APP-KEY>:<YOUR-APP-SECRET>*/
	 	tabWorker.port.on('takeCode',function(myCode){
			console.log('auth: TAKE CODE ' + myCode);
			theCode = myCode;
			tabWorker.port.emit('signedIn','Signed in correctly');
			var encodedData = base64.encode(APP_KEY+':'+APP_SECRET);
			var getAccess = Request({		
				url: 'https://api.dropbox.com/1/oauth2/token',
				contentType: 'application/x-www-form-urlencoded',
				content: {'code': myCode,'grant_type':'authorization_code'},
				headers: {'Authorization':'Basic '+encodedData},
				onComplete: function(response){
 					console.log('STATUS = ' + response.statusText);
 					console.log('HEADERS = ' + JSON.stringify(response.headers));
					if(response.statusText =='OK'){
						/*
						The response format will be:
						 {"access_token":"Uoai_zDkp9cAAAAAAAAAAc7Zw5Q__9vAFNzxtS_HFPV2UDqzWku1vHoh-uSB4jfw"
						 "token_type":"bearer"
						 "uid":"11878024"}

						To access this; response.json.access_token, etc
						*/
						console.log('STATUS = ' + response.statusText);
						console.log('RESPONSE = ' + JSON.stringify(response.json));
						
						try{
							//tabWorker.port.on('closeTab',function(msg){
							//	tab.close();
								emit(exports, 'authComplete', [response.json, callersData]);
							//});
						}catch(e){console.log('Shut down!!');}
				
					}		
				}
			});
			getAccess.post();
			console.log('Posted!');
		});
		
	});
	
};


//Search for specific file with the file name title.
exports.searchFile = function(title, dataToSave, token){
	console.log("Search File.");
	/*curl https://api.dropbox.com/1/datastores/get_or_create_datastore -d dsid=default -H "Authorization: Bearer <YOUR-ACCESS-TOKEN>"*/
	var exists = false;
	//If dataToSave null then there is nothing to save
	//If it doesn't exist then it creates a datastore. 
        //var exists = false;	//Lets assume that it doesn't exist.
        var request = "https://api.dropbox.com/1/datastores/get_or_create_datastore";
        var whoCalled = 'searchFile';
        var searchFor = Request({
                url: request,
                headers: {'Host':'www.dropbox.com','Authorization': 'Bearer '+ token},
                content: {'dsid':'default'},
                onComplete: function(response){
                	var handle='';
                	//console.log();
                	console.log("Search File = " + response.statusText);
                	console.log("Search File = " + response.status);
                	console.log("Search File dsid : tabs = " + JSON.stringify(response.headers));
                	console.log("Search File dsid : tabs  = " + JSON.stringify(response.json));
                	//console.log("Search File = " + JSON.stringify(response.headers));
                	//console.log("Search File = " + response.text);
                	if (response.status == '401'){	//Invalid token; Unauthorized
                		//auth('searchFile',[title,dataToSave]);
                		console.log("Unauthorized.");
                		emit(exports,'Unauthorized',[whoCalled, title, dataToSave]);
                	}
                	else if (response.status == '200'){ //Everything fine
                		console.log(" Search File = Everything is fine!!!");
                		exists = response.json.created;
                		//console.log("Search File dsid : tabs = " + JSON.stringify(response.headers));
                		//console.log("Search File dsid : tabs  = " + JSON.stringify(response.json));
                		handle = response.json.handle;
                		rev = response.json.rev;
		               	emit(exports, 'searchFile',[exists, title, dataToSave, 'Dropbox', token, handle,rev]);
		        }
                       
                }
        });
        searchFor.post();
}

/*
Maximum record size	100 KiB
Maximum number of records per datastore	100,000
Maximum datastore size	10 MiB
Maximum size of a single sync() call	2 MiB

*/

exports.saveData = function(datas){
	/*[fileName, dataToSave, token, handle]*/
	/*curl https://api.dropbox.com/1/datastores/put_delta -d handle=<DATASTORE-HANDLE> -d rev=0 -d changes='[["I", "tasks", "myrecord", {"taskname": "do laundry", "completed": false}]]' -H 'Authorization: Bearer <YOUR-ACCESS-TOKEN>'*/
	var fileName = datas[0];
	var dataToSave = datas[1];
	var token = datas[2];
	var handle = datas[3];
	var rev = datas[4];
	var request = "https://api.dropbox.com/1/datastores/put_delta";
        var whoCalled = 'searchFile';https://api.dropbox.com/1/datastores/delete_datastore
        var searchFor = Request({
                url: request,
                headers: {'Host':'www.dropbox.com','Authorization': 'Bearer '+ token},
                content: {'handle':handle, 'rev':rev,'changes': '[["I","'+fileName+'","myrecord",'+JSON.stringify(dataToSave[0])+']]'},
                onComplete: function(response){
                	var handle='';
                	//console.log();
                	console.log("saveData = " + response.statusText);
                	console.log("saveData = " + response.status);
                	console.log("saveData = " + JSON.stringify(response.headers));
                	console.log("saveData = " + response.text);
                	console.log("saveData = " + JSON.stringify(response.json));
                	if (response.status == '401'){	//Invalid token; Unauthorized
                		//auth('searchFile',[title,dataToSave]);
                		console.log("Unauthorized.");
                		//emit(exports,'Unauthorized',[whoCalled, title, dataToSave]);
                	}
                	else if (response.status == '200'){ //Everything fine
                		console.log("saveData = " + JSON.stringify(response.headers));
                		console.log("saveData = " + JSON.stringify(response.json));
                		//handle = response.json.handle;
		               	//emit(exports, 'searchFile',[exists, title, dataToSave, token, handle]);
		        }
                       
                }
        });
        searchFor.post();

}


exports.deleteAllDataStore = function(token, handle){

	var deleteD = Request({
                url: "https://api.dropbox.com/1/datastores/delete_datastore",
                headers: {'Host':'www.dropbox.com','Authorization': 'Bearer '+ token},
                content: {'handle':handle},
                onComplete: function(response){
                	//console.log();
                	console.log("saveData = " + response.statusText);
                	console.log("saveData = " + response.status);
                	console.log("saveData = " + JSON.stringify(response.headers));
                	console.log("saveData = " + response.text);
                	console.log("saveData = " + JSON.stringify(response.json));
                	if (response.status == '401'){	//Invalid token; Unauthorized
                		//auth('searchFile',[title,dataToSave]);
                		console.log("Unauthorized.");
                		//emit(exports,'Unauthorized',[whoCalled, title, dataToSave]);
                	}
                	else if (response.status == '200'){ //Everything fine
                		console.log("Delete Data = " + JSON.stringify(response.headers));
                		console.log("Delete Data = " + JSON.stringify(response.json));
                		//handle = response.json.handle;
		               	//emit(exports, 'searchFile',[exists, title, dataToSave, token, handle]);
		        }
                       
                }
        });
        deleteD.post();
	



}
