//
// NS:TEMPLATE
// REQUIRE:CORE
// NEED:NONE
//
__Template=SYSLIB.namespace("syslib.template");
//
__Template.SYS_LAN={};
//
//Use this for simple language support
//
__Template.preprocess=[];
__Template.postprocess=[];
__Template.build=function (f,vals,insertTo) {
    //get strings
    var rhtml = f.toString().replace(/^[^\/]+\/\*!?\s?/, '').replace(/\*\/[^\/]+$/, '');

    //parse vals
    rhtml = rhtml.replace(/\%\$([0-9])*\%/g, function (match) {
      	var r = match.replace(/\%/g,'');
      	r = parseInt(r.replace(/\$/g,''));
      	if(r&&vals&&typeof(vals[r-1])!== "undefined") {
        	return vals[r-1];
      	}else{
        	__Error.log(2,"Template : can't find "+r+" in vals . in "+f);
      	}
        return match;
    });
    //parse lans
    rhtml = rhtml.replace(/\%\#([^\%]*)\%/g, function (match) {
  		var r = match.replace(/\%/g,'');
  		r = r.replace(/\#/g,'');
  		if(r&&__Template.SYS_LAN&&typeof(__Template.SYS_LAN[r])!== "undefined") {
    		return __Template.SYS_LAN[r];
  		}else{
    		__Error.log(2,"Template : can't find "+r+" in Lan file . in "+f);
  		}
      	return match;
  	});

    //****old***
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
    //***old***

    if(__Template.preprocess){
      for(var i=0;i<__Template.preprocess.length;i++){
        rhtml=__Template.preprocess[i](rhtml);
      }
    }
    if(insertTo){
        insertTo.innerHTML=rhtml;
    }
    var func=function(){
      if(__Template.postprocess){
        for(var i=0;i<__Template.postprocess.length;i++){
          __Template.postprocess[i](insertTo);
        }
      }
    }
    setTimeout(func,50);
  	return rhtml;
}
//short cuts
var _template = SYSLIB.namespace("syslib.template").build;
var _lang=function(name){SYSLIB.namespace("syslib.template").SYS_LAN[name];};
