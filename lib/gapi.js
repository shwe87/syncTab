var { emit, on, once, off } = require("sdk/event/core");

var data = require("sdk/self").data;
var tabs = require("sdk/tabs");
var Request = require("sdk/request").Request;
var UIControl = require('./UIControl.js');


/* GOOGLE DRIVE OAUTH CONSTANTS */
const CLIENT_ID = 
const CLIENT_SECRET = 
const REDIRECT_URI_URN = 
const REDIRECT_URI_LOCAL = 'http://localhost';
const SCOPE = 'https://www.googleapis.com/auth/drive.appdata+';
var URL = 'https://accounts.google.com/o/oauth2/auth?'+'scope='+SCOPE+'https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&'+'redirect_uri=' + REDIRECT_URI_URN + '&'+ 'client_id=' + CLIENT_ID+'&'+'response_type=code';

/*Files we can work with*/
const TABS_FILE = 'tabs.json';
const BOOKMARKS_FILE = 'bookmarks.json';
const HISTORY_FILE = 'history.json';


/*Google drive necessary var.*/
var access_token;
var token_type;
var expires_in;
var id_token;
var refresh_token;
var resumable_sesion_uri;
var theCode;


var tabWorker;

exports.on = on.bind(null, exports);
exports.once = once.bind(null, exports);
exports.removeListener = function removeListener(type, listener) {
  off(exports, type, listener);
};


/*
When the token was expired!
info: synctab: Search File = Unauthorized
info: synctab: Search File = 401
info: synctab: Search File = {"Alternate-Protocol":"443:quic","Cache-Control":"private, max-age=0","Content-Encoding":"gzip","Content-Length":"162","Content-Type":"application/json; charset=UTF-8","Date":"Tue, 29 Oct 2013 13:34:06 GMT","Expires":"Tue, 29 Oct 2013 13:34:06 GMT","Server":"GSE","WWW-Authenticate":"Bearer realm=\"https://www.google.com/accounts/AuthSubRequest\", error=invalid_token","x-content-type-options":"nosniff","X-Frame-Options":"SAMEORIGIN","X-XSS-Protection":"1; mode=block","X-Firefox-Spdy":"3"}
info: synctab: Search File = {
 "error": {
  "errors": [
   {
    "domain": "global",
    "reason": "authError",
    "message": "Invalid Credentials",
    "locationType": "header",
    "location": "Authorization"
   }
  ],
  "code": 401,
  "message": "Invalid Credentials"
 }
}

*/



//var name='';
//This is the auth function: controls the authentication process:
exports.auth = function (callersData){
	//name = element;
	tabs.open({
		url: URL	
	});	
	tabs.on('ready', function(tab) {
		
  		tabWorker = tab.attach({
		      contentScriptFile: data.url('google-drive-handler.js')
	 	});
	 	tabWorker.port.on('takeCode',function(myCode){
			
			theCode = myCode;
			var getAccess = Request({		
				url: 'https://accounts.google.com/o/oauth2/token',
				contentType: 'application/x-www-form-urlencoded',
				content: {'code': myCode,'client_id':CLIENT_ID,'client_secret':CLIENT_SECRET,'redirect_uri':REDIRECT_URI_URN,'grant_type':'authorization_code'},
				onComplete: function(response){
      					
					////console.log('STATUS ' + response.statusText);
					if(response.statusText =='OK'){
						/*
						The response format will be:
						 {
						  "access_token" : string,
						  "token_type" : string,
						  "expires_in" : 3600,
						  "id_token" : string,
						  "refresh_token" : string
						}
						To access this; response.json.access_token, etc
						*/
						tabWorker.port.emit('signedIn','Signed in correctly');
				
						////console.log('auth: Element  = '+name);
						
						
						try{
							tabWorker.port.on('closeTab',function(msg){
							tab.close();
								
							emit(exports, 'authComplete', [response.json, callersData]);
							UIControl.showToast('gapi: Authenticated');
								
		
							});
						}catch(e){
						}
				
					}		
				}
			});
			getAccess.post();
			
		});
		
	});
	
};


//Search for specific file with the file name title.
exports.searchFile = function(title, dataToSave, token){
	//console.log("Search File.");
	//If dataToSave null then there is nothing to save
	//ElementToSave:
	
        var exists = false;	//Lets assume that it doesn't exist.
        var request = "https://www.googleapis.com/drive/v2/files?q=title+=+'"+title+"'";
        var whoCalled = 'searchFile';
        var searchFor = Request({
                url: request,
                headers: {'Host':'www.googleapis.com','Authorization': 'Bearer '+ token},
                onComplete: function(response){
                	
                	if (response.status == '401'){	//Invalid token; Unauthorized
                		
                		emit(exports,'Unauthorized',[whoCalled, title, dataToSave]);
                	}
                	else if (response.status == '200'){ //Everything fine
                		var dLoadURL = '';
        			var fileId = '';
		               	if (response.json.items.length == 0){
		               		              		
		               	}
		               	else{
		               		//The files exists.
		               		   
		               		exists = true;
		               		dLoadURL = response.json.items[0].downloadUrl;
		               		fileId = response.json.items[0].id;		               				
		               	}
		               	emit(exports, 'searchFile',[exists, title, dataToSave, token, dLoadURL, fileId]);
		        }
                       
                }
        });
        searchFor.get();
}

//Upload the file
function uploadFile(uploadData){
	//uploadFile = [fileData, resumable_sesion_uri]
	//fileData = [exists, title, dataToSave, token, dLoadURL, fileId]
	


	var fileData = uploadData[0];
	var dataToSave = fileData[2];
	var token = fileData[3];
	var resumable_sesion = uploadData[1];

	
	var str = JSON.stringify(dataToSave);

	var session = Request({		
		url: resumable_sesion,
		//contentType: 'application/json; charset=UTF-8',
		headers: {'Authorization': 'Bearer '+ token/*'Content-Length':38*/,'Content-Type':'application/json; charset=UTF-8'},
		content: str,
		onComplete: function(response){			
			
			resumable_sesion = response.headers.Location;

			emit(exports, 'saveComplete', [fileData, resumable_sesion]); 
		}
	
	});
	session.put();

}

//Start the upload process:
exports.startUpload = function startUpload(fileData){
	//fileData = [exists, title, dataToSave, token, dLoadURL, fileId]
	var exists = fileData[0];
	var fileName = fileData[1];
	var dataToSave = fileData[2];
	var token = fileData[3];
	
	
	
	if (!exists){		
		//If it is a new file then create it:
		//console.log('handleSave: NO EXSITE '+ fileName);
		var parents = [{'id':'appdata'}];
		var j = {'title': fileName,'parents':parents};
		var str = JSON.stringify(j);
		var session = Request({		
			url: 'https://www.googleapis.com/upload/drive/v2/files?uploadType=resumable',
			//contentType: 'application/json; charset=UTF-8',
			headers: {'Host':'www.googleapis.com','Authorization': 'Bearer '+ token,'Content-Length':38,'Content-Type':'application/json; charset=UTF-8','X-Upload-Content-Type':'application/json'/*,'X-Upload-Content-Length':2000000*/},
			content: str,
			onComplete: function(response){
				
				resumable_sesion_uri = response.headers.Location;
				
				
				uploadFile([fileData, resumable_sesion_uri]);
				
						
			}	
		});
		session.post();
	}
	else{
		var downloadURL = fileData[4];
		var fileId = fileData[5];
		//Try to just add lines, not upload a new file.
		//First step: Start a resumable session:
		
		var session = Request({                
		        url: 'https://www.googleapis.com/upload/drive/v2/files/'+fileId+'?uploadType=resumable',
		        //contentType: 'application/json; charset=UTF-8',
		        headers: {'Host':'www.googleapis.com','Authorization': 'Bearer '+ token/*,'Content-Length':38,'Content-Type':'application/json; charset=UTF-8','X-Upload-Content-Type':'application/json'/*,'X-Upload-Content-Length':2000000*/},
		        //content: str,
		        onComplete: function(response){
		                
		                resumable_sesion_uri = response.headers.Location;
		                 
		                uploadFile([fileData, resumable_sesion_uri]);      
		        }        
		});
		session.put();	
	}
	
}











/*
POST /o/oauth2/token HTTP/1.1
Host: accounts.google.com
Content-Type: application/x-www-form-urlencoded

client_id=8819981768.apps.googleusercontent.com&
client_secret={client_secret}&
refresh_token=1/6BMfW9j53gdGImsiyUH5kU5RsR4zwI9lUVX-tqf8JXQ&
grant_type=refresh_token

*/



exports.downloadData = function(fileData, action){
	/*fileData = [exists, title, dataToSave, token, dLoadURL, fileId]*/
	var token = fileData[3];
	var downloadURL = fileData[4];
	var whoCalls = 'downloadData';
        var download = Request({
                url: downloadURL,
                headers: {'Authorization': 'Bearer '+ token},
                onComplete: function(response){
                       
                       if(response.status == 401){
                       		
                       		emit(exports,'Unauthorized',[whoCalls, fileData, action]);
                       
                       }
                       else{
                       		//If it is download the datas and update the file then:
                       	
                       		
                       		//If it is just download the datas then:
		               	emit(exports,'downloadComplete',[fileData, action, response.text]);
		              
		              
                       		
                       		
                       }
                      
                }
        
        });
        download.get();
}



exports.getData = function(fileName, token){
	this.searchFile(fileName, null, token, null)
	
}





















