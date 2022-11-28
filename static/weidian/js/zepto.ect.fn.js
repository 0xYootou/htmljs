(function() {		
		if (window.devicePixelRatio === 2 && window.navigator.appVersion.match(/iphone|ipod/gi)) {			
			var text = '<meta name="viewport" content="initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no" />';
		}else{
			var text='<meta name="viewport" content="target-densitydpi=device-dpi, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0" />';				
		}		
		document.write(text);
	})();  //屏幕适配