//
// NS:UTIL
// REQUIRE:CORE
// NEED:NONE
//
var __Util=SYSLIB.namespace("syslib.util");
// ua
__Util.UA=function(){
	var n=window.navigator&&navigator.userAgent||"";
	return{
		isChrome:(/webkit\W.*(chrome|chromium)\W/i).test(n),
		isFirefox:(/mozilla.*\Wfirefox\W/i).test(n),
		isGecko:(/mozilla(?!.*webkit).*\Wgecko\W/i).test(n),
		isIE:function(){ return navigator.appName==="Microsoft Internet Explorer"; },
		isKindle:(/\W(kindle|silk)\W/i).test(n),
		isMobile:(/(iphone|ipod|(android.*?mobile)|blackberry|nokia)/i).test(n),
		isOpera:(/opera.*\Wpresto\W/i).test(n),
		isSafari:(/webkit\W(?!.*chrome).*safari\W/i).test(n),
		isTablet:(/(ipad|android(?!.*mobile))/i).test(n),
		isTV:(/googletv|sonydtv/i).test(n),
		isWebKit:(/webkit\W/i).test(n),
		isAndroid:(/android/i).test(n),
		isIOS:(/(ipad|iphone|ipod)/i).test(n),
		isIPad:(/ipad/i).test(n),
		isIPhone:(/iphone/i).test(n),
		isIPod:(/ipod/i).test(n),
		whoami:function(){ return n }
	}
}
__Util.checkFather = function (that,e) {
  var parent  =  e.relatedTarget;
         try {
            while ( parent && parent !==  that ) {
                parent  =  parent.parentNode; 
            }
            return (parent !==  that);
        } catch(e) { }
}
__Util.globalposition =  function (node) {
            var $d  =  node,$c = {x:0,y:0};
            for (; null !=  $d ;) {
                $c.x +=  $d.offsetLeft;
                $c.y +=  $d.offsetTop;
                $d  =  $d.offsetParent
            }
            return $c
};
__Util.title= function (ipt) {
  	document.title = ipt;
}
__Util.brhistory=function (action) {
	var $state = {
	  	title:document.title,
	    url:window.location.href,
	    action:(action)?action:0
	}
  	history.pushState($state,$state['title'],$state['url']);
}
__Util.url=function (ipt) {
  	window.location.href = SYSLIB.baseurl+"#"+ipt;
}
__Util.preventDefault=function (e) {
 	e  =  e || window.event;
  	if (e.preventDefault){
      	e.preventDefault();
  	}
  	e.returnValue  =  false;  
}
__Util.clone=function (obj) {
    // Handle the 3 simple types, and null or undefined
    if (null  ==  obj || "object" !=  typeof obj) return obj;
    // Handle Date
    if (obj instanceof Date) {
        var copy  =  new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    // Handle Array
    if (obj instanceof Array) {
        var copy  =  [];
        for (var i  =  0, len  =  obj.length; i < len; i++) {
            copy[i]  =  __Util.clone(obj[i]);
        }
        return copy;
    }
    // Handle Object
    if (obj instanceof Object) {
        var copy  =  {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr]  =  __Util.clone(obj[attr]);
        }
        return copy;
    }
    //throw new Error("Unable to copy obj! Its type isn't supported.");
    __Error.log(2,"Util.clone : Unable to copy obj! Its type isn't supported.");
}
__Util.token = function (length) {
  	var $i = 0,
      	$length = length||32,
      	$yu = Array(0,1,2,3,4,5,6,7,8,9,"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"),
      	$utk = "";
  	for($i = 0;$i<$length;$i++) {
    	var $j = __Math.rand(0,61);
   		$utk+= $yu[$j];
  	}
  	return $utk;
}
__Util.base64={
	EncodeChars:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
	DecodeChars:new Array(
     	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
     	52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
     	-1, 0,   1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
     	15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
     	-1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
     	41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1),
	decode: function (str) {
     	var c1, c2, c3, c4,
	     	i = 0, 
	     	len = str.length, 
	     	out = "";
     	while(i < len) {
         	// c1 
         	do {
             	c1  =  __Util.base64.DecodeChars[str.charCodeAt(i++) & 0xff];
         	} while(i < len && c1  ==  -1);
         	if(c1  ==  -1){
         		break;
         	}
	        // c2
	        do {
	             c2  =  __Util.base64.DecodeChars[str.charCodeAt(i++) & 0xff];
	        } while(i < len && c2  ==  -1);
	        if(c2  ==  -1){
	            break;
	        }
	        out +=  String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
	        // c3
	        do {
	            c3  =  str.charCodeAt(i++) & 0xff;
	            if(c3  ==  61){
	            	return out
	            }
	            c3  =  __Util.base64.DecodeChars[c3];
	        } while(i < len && c3  ==  -1);
	        if(c3  ==  -1){
	            break;
	        }
        	out +=  String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

	        // c4
	        do {
	            c4  =  str.charCodeAt(i++) & 0xff;
	            if(c4  ==  61){
	            	return out;
	            } 
	            c4  =  __Util.base64.DecodeChars[c4];
	        } while(i < len && c4  ==  -1);
	        if(c4  ==  -1){
	            break;
	        }
	        out +=  String.fromCharCode(((c3 & 0x03) << 6) | c4);
     	}
     	return out;
	},
	encode:function (str) {
     	var c1, c2, c3,
	     	i = 0, 
	     	len = str.length, 
	     	out = "";
     	while(i < len) {
         	c1  =  str.charCodeAt(i++) & 0xff;
         	if(i  ==  len){
             	out +=  __Util.base64.EncodeChars.charAt(c1 >> 2);
             	out +=  __Util.base64.EncodeChars.charAt((c1 & 0x3) << 4);
             	out +=  " == ";
             	break;
         	}
         	c2  =  str.charCodeAt(i++);
         	if(i  ==  len){
             	out +=  __Util.base64.EncodeChars.charAt(c1 >> 2);
             	out +=  __Util.base64.EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
            	out +=  __Util.base64.EncodeChars.charAt((c2 & 0xF) << 2);
             	out +=  " = ";
             	break;
         	}
         	c3  =  str.charCodeAt(i++);
         	out +=  __Util.base64.EncodeChars.charAt(c1 >> 2);
         	out +=  __Util.base64.EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
        	out +=  __Util.base64.EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
         	out +=  __Util.base64.EncodeChars.charAt(c3 & 0x3F);
     	}
     	return out;
	},
	utf8to16:function (str) {
     	var c,char2, char3,
	     	i = 0, 
	     	len = str.length, 
	     	out = "";
    	while(i < len) {
         	c  =  str.charCodeAt(i++);
         	switch(c >> 4){ 
           		case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
             		// 0xxxxxxx
             		out +=  str.charAt(i-1);
             		break;
           		case 12: case 13:
             		// 110x xxxx    10xx xxxx
             		char2  =  str.charCodeAt(i++);
             		out +=  String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
             		break;
           		case 14:
             		// 1110 xxxx   10xx xxxx   10xx xxxx
             		char2  =  str.charCodeAt(i++);
             		char3  =  str.charCodeAt(i++);
             		out += String.fromCharCode(((c & 0x0F) << 12) |
                                            ((char2 & 0x3F) << 6) |
                                            ((char3 & 0x3F) << 0));
             		break;
         	}
     	}
     	return out;
	},
	utf16to8:function (str) {
    	var i, c,
     	 	len=str.length,
     	 	out =  "";
     	for(i  =  0; i < len; i++) {
         	c  =  str.charCodeAt(i);
         	if ((c >=  0x0001) && (c <=  0x007F)) {
             	out +=  str.charAt(i);
         	} else if (c > 0x07FF) {
             	out +=  String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
             	out +=  String.fromCharCode(0x80 | ((c >>   6) & 0x3F));
             	out +=  String.fromCharCode(0x80 | ((c >>   0) & 0x3F));
         	} else {
             	out +=  String.fromCharCode(0xC0 | ((c >>   6) & 0x1F));
             	out +=  String.fromCharCode(0x80 | ((c >>   0) & 0x3F));
         	}
     	}
     	return out;
	}
}
//short cuts
var _title = SYSLIB.namespace("syslib.util").title,
	_pushhistory = SYSLIB.namespace("syslib.util").brhistory,
	_seturl = SYSLIB.namespace("syslib.util").url,
    _clone = SYSLIB.namespace("syslib.utils").clone;

