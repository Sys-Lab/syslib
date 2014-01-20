//
// NS:TEMPLATE
// REQUIRE:CORE
// NEED:NONE
//
__Template=SYSLIB.namespace("syslib.template")
__Template.build=function (f,vals) {　
	//get strings
    var rhtml = f.toString().replace(/^[^\/]+\/\*!?\s?/, '').replace(/\*\/[^\/]+$/, '');

    //parse vals
    rhtml = rhtml.replace(/\%\$([0-9])*\%/g, function (match) {
      	var r = match.replace(/\%/g,'');
      	r = parseInt(r.replace(/\$/g,''));
      	if(r&&vals&&typeof(vals[r-1])!== "undefined") {
        	return vals[r-1];
      	}else{
        	__Error.log(2,"Mutilstring : can't find "+r+" in vals . in "+f);
      	}
        return match;
    });
    //parse lans
	rhtml = rhtml.replace(/\%\#([^\%]*)\%/g, function (match) {
  		var r = match.replace(/\%/g,'');
  		r = r.replace(/\#/g,'');
  		if(r&&$SYS_LAN&&typeof($SYS_LAN[r])!== "undefined") {
    		return $SYS_LAN[r];
  		}else{
    		__Error.log(2,"Mutilstring : can't find "+r+" in Lan file . in "+f);
  		}
      	return match;
  	});
  	//parse width
	rhtml = rhtml.replace(/\%\&([^\%]*)\%/g, function (match) {
  		var r = match.replace(/\%/g,'');
  		r = r.replace(/\&/g,'');
    	return ((window.innerWidth/1366)*parseInt(r));
  	});
  	//parse Height
    rhtml = rhtml.replace(/\%\@([^\%]*)\%/g, function (match) {
      	var r = match.replace(/\%/g,'');
      	r = r.replace(/\@/g,'');
        return ((window.innerHeight/682)*parseInt(r));
    });

  	return rhtml;
}

//short cuts
var _template = SYSLIB.namespace("syslib.template").build;
