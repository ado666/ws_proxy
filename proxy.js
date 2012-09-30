    ws          = null;
    ws_config   = null;
    ie_old      = false;

    var tmp = window.location.hostname.split('.')
    document.domain = tmp.slice(-2).join('.')

    function getInternetExplorerVersion()
    {
    var rv = 1000; // Return value assumes failure.
        if (navigator.appName == 'Microsoft Internet Explorer')
        {
            var ua = navigator.userAgent;
            var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat( RegExp.$1 );
        }
        return rv;
    }

    function checkVersion()
    {
        var ver = getInternetExplorerVersion();

        if (ver < 9)    ie_old = true;
    }
    checkVersion();
    if (ie_old){
        var config  = parent.window.iframecfg;
        init({message: config});
    }


    function onmessage (evt) {
        if (ie_old){
            parent.window.onMessage(parent.JSON.stringify({action: 'message', message: evt.data}));
        }
        else{
            parent.window.postMessage(JSON.stringify({action: 'message', message: evt.data}), '*');
        };
    };

    function onclose (evt) {
	if (ie_old){
            parent.window.onMessage(parent.JSON.stringify({action: 'on_close', message: evt.data}));
	}else{
            parent.window.postMessage(JSON.stringify({action: 'on_close', message: evt.data}), '*');
	}
    };


    function init (data){
        var cfg     = data.message;
        ws_config   = cfg;
        
        ws  = new Connection('/'+cfg.path, cfg.host);
        
        ws.onmessage    = onmessage;
        ws.onopen       = function(){
        if (ie_old){
                parent.window.onOpen(parent.JSON.stringify({action: 'on_load', message: ''}));
            }
            else {
                parent.window.postMessage(JSON.stringify({action: 'on_load', message: ''}), '*');
            }
        }
	ws.onclose	= onclose;
    };

    function send (data){
        ws.send(data.message);
    };

    function send_ie(data) {
        ws.send(data);
    }

    if (ie_old)
        window.send = send_ie;

	function listener (e){
        var data    = '';
        try {
		    data    = JSON.parse(e.data);
        } catch (e){
            data    = e.data;
        }
        var handler = null;
        switch (data.action){
            case 'init':
                handler = init
                break;
            case 'send':
                handler = send
                break;
        };
        if (handler)    handler(data);
	};
$( function() {
	if (window.addEventListener){
        window.addEventListener("message", listener,false);
    } else {
        window.attachEvent("onmessage", listener);
    };
});

   /* ws          = null;
    ws_config   = null;

    
    function onopen () {
        ws.send('auth.do ' + ws_config.key);
    };

    function onmessage (evt) {
        if (evt.data == 'ping'){
            ws.send('pong');
        };
        if (evt.data == 'auth.ok'){
            return;
        };
        parent.window.postMessage({action: 'message', message: JSON.parse(evt.data)}, '*');
    };

    function onclose (evt) {
        console.log('connection closed by server: ' + evt.code + ', ' + evt.reasen);
    };

    function init (data){
        var cfg     = data.message;
        ws_config   = cfg;
        ws  = new Connection('/'+cfg.path, cfg.host+':'+cfg.port);
        
	ws.onopen       = onopen;
        ws.onmessage    = onmessage;
        ws.onclose      = onclose;
    };

    function send (data){
        console.log('call send ' + data.message)
        ws.send(data.message);
    };

	function listener (e){
		var data    = JSON.parse(e.data);
        
        var handler = null;

        switch (data.action){
            case 'init':
                handler = init;
                break;
            case 'send':
                handler = send;
                break;
        };

        if (handler)    handler(data);
	};

	if (window.addEventListener){
        window.addEventListener("message", listener,false);
    } else {
        window.attachEvent("onmessage", listener);
    };*/
