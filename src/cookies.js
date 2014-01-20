//
// NS:COOKIES
// REQUIRE:CORE
// NEED:NONE
//
__Cookies=SYSLIB.namespace("syslib.cookies");
__Cookies.get = function (c_name,defaultvar) {
  	var $defaultvar = defaultvar||"";
  	if (document.cookie.length>0){
      	c_start = document.cookie.indexOf(c_name + " = ");
		if(c_start==-1){
			c_start = document.cookie.indexOf(c_name + "=");
		}
      	if (c_start!= -1){ 
	        c_start = c_start + c_name.length+1;
	        c_end = document.cookie.indexOf(";",c_start);
        	if (c_end == -1) {
        		c_end = document.cookie.length;
       		} 
      		var $rvar = unescape(document.cookie.substring(c_start,c_end));
      		return ($rvar!= "")?$rvar:$defaultvar;
      	}else{
      		return $defaultvar;
      	}
  	}else{
  		return $defaultvar;
  	}
}
__Cookies.set = function (c_name,value,expiredays) {
  	var exdate = new Date();
  	exdate.setDate(exdate.getDate()+(expiredays||14));
  	document.cookie = c_name+ " = " +escape(value)+((expiredays == null) ? "" : ";expires = "+exdate.toGMTString()+"; path = /");
}
__Cookies.clean = function (c_name) {
  	__Cookies.set(c_name,"");
}
