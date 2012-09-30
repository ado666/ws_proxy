var tmp = window.location.hostname.split('.')
document.domain = tmp.slice(-2).join('.')

function getInternetExplorerVersion() {
	var rv = 10000;
	if (navigator.appName == 'Microsoft Internet Explorer')
	{
		var ua = navigator.userAgent;
		var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat( RegExp.$1 );
	}
	return rv;
}

function Connection(config){

	iframe			= document.createElement('iframe');

	this.iframe			= iframe;

	iframe.setAttribute('src', config.url);
	$(iframe).css('width', '0px').css('height', '0px').hide();

	document.body.appendChild(iframe);

	if (getInternetExplorerVersion() < 9) {
		var local_t = config.target;
		window.onMessage    = function(data) {
			local_t.onMessage({data:data});
		}
		window.onOpen    = function(data) {
			local_t.onOpen(data);
		}
		window.iframecfg	= config;
	};

	config.target   = null;

	iframe.onload	= function(){

		// for IE compatability
		if (!window.addEventListener) {
			window.attachEvent("message", config.onmessage);
		} else {
			window.addEventListener("message", config.onmessage, false);
		}

		iframe.contentWindow.postMessage(parent.JSON.stringify({'action': 'init', 'message': config}), '*');
	}
};
Connection.prototype.send	= function (data) {
	if (!data)
		return;

	if (getInternetExplorerVersion() < 9) {
		this.iframe.contentWindow.send(data);
	} else {
		data    = JSON.stringify({action: 'send', message: data});
		this.iframe.contentWindow.postMessage(data, '*');
	}
};