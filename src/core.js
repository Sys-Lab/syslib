//
// NS:CORE
// REQUIRE:NONE
// NEED:NONE
//
SYSLIB={
	ver:0,
	 //settings
    settings:{
    	release:0,
    	loglevel:0,
    	set:function(settings){
    		for(var key in settings[key]){
    			SYSLIB.settings[key]=settings[key];
    		}
    	}
    },

	//namespace system
	namespaces:{},
	namespaces_list:{},
	namespaces_checklock:0,
	namespaces_requireEnd:[],
	namespaces_checkend:function(){
		if(SYSLIB.namespaces_checklock){
	      	clearTimeout(SYSLIB.namespaces_checklock);
	    }
	    SYSLIB.namespaces_checklock=setTimeout(function(){
	    	__Error.log(0,"Namespace : all NS loaded");
	    	for(var i in SYSLIB.namespaces_list){
	    		if(SYSLIB.namespaces_list[i]!=1){
					__Error.log(2,"Namespace : can't find required ns "+i)
					return;
				}
	    	}
	    	for(var i=0;i<SYSLIB.namespaces_requireEnd.length;i++){
	    		SYSLIB.namespaces_requireEnd[i]();
	    	}
	    	if(window.nsloaded){
	    		window.nsloaded();
	    	}
	    },50);
	},
	namespace:function (nsname,require,requireEnd) {
		var ns = nsname.split("."),
			opns = SYSLIB.namespaces[ns[0]],
			i = 1;
		SYSLIB.namespaces_list[nsname]=1;
		if(requireEnd){
			SYSLIB.namespaces_requireEnd.push(requireEnd)
		}
		if(require&&require!=-1){
			if(typeof(require)!='object'){
				var tmprequire=[];
				tmprequire[0]=require;
				require=tmprequire;
			}
			for(i=0;i<require.length;i++){
				if(!SYSLIB.namespaces_list[require[i]]){
					SYSLIB.namespaces_list[require[i]]=-1;
				}
			}
			SYSLIB.namespaces_checkend();
		}
		if(typeof(opns) != 'function'){
				SYSLIB.namespaces[ns[0]] = function () {};
				opns = SYSLIB.namespaces[ns[0]];
		}
		for(i = 1;i<ns.length;i++) {
		  if(typeof(opns[ns[i]]) !=  'function') {
		  		if(require!=-1){
				    opns[ns[i]] = function () {};
		  		}else{
		  			return 0;
		  		}
		  }
		  opns = opns[ns[i]];
		}
		return opns;
	},
	//include & exclude
	included:{},
	includePath:'',
	include_need:0,
	include_end_callback:0,
	include_checklock:0,
	check_loadend:function(){
	    if(SYSLIB.include_checklock){
	      clearTimeout(SYSLIB.include_checklock);
	    }
	    SYSLIB.include_checklock=setTimeout(function(){
	    	__Error.log(0,"INCLUDE : all file loaded");
	        if(!SYSLIB.include_need&&$this.include_end_callback){
	          SYSLIB.include_end_callback();
	          SYSLIB.include_end_callback=0;
	        }
	    },500);
	},
	include:function (file,callback) {
		var files  =  typeof file  ==  "string" ? [file]:file,
			i  =  0;
		if(callback){
	        SYSLIB.include_end_callback=callback;
	    }
		for (i  =  0; i < files.length; i++) {
			var ttp = files[i].split("#");
			if(ttp[1] == "!") {
				//If use name#! the file will be loaded again
				SYSLIB.included[SYSLIB.includePath+ttp[0]] = 0;
			}
		  		//check if already included.
		    if(!SYSLIB.included[SYSLIB.includePath+ttp[0]]) {
				var name  =  ttp[0].replace(/^\s|\s$/g, ""),
					att  =  name.split('.'),
					ext  =  att[att.length - 1].toLowerCase(),
					isCSS  =  ext  ==  "css",
					tag  =  isCSS ? "link" : "script",
					newnode = document.createElement(tag),
					link  =  SYSLIB.includePath + name;
				if(isCSS) {
					newnode.setAttribute("rel","stylesheet");
					newnode.setAttribute("href",link);
				}else{
					newnode.setAttribute("src",link);
				}
				$newnode.includeLink=$newnode
				__Error.log(0,"INCLUDE : including "+$newnode);
				document.body.appendChild(newnode);
				$newnode.onload=function(){
					__Error.log(0,"INCLUDE : included "+this.includeLink);
			        SYSLIB.include_need--;
			        SYSLIB.check_loadend();
			    }
				SYSLIB.included[SYSLIB.includePath+ttp[0]] = 1;
		    }
	    }
	},
	exclude:function(filename, filetype) {
		__Error.log(0,"EXCLUDE : excluded "+filetype+": "+filename);
	    var targetelement = (filetype == "js")? "script" : (filetype == "css")? "link" : "none", //determine element type to create nodelist from
	        targetattr = (filetype == "js")? "src" : (filetype == "css")? "href" : "none", //determine corresponding attribute to test for
	        allsuspects = document.getElementsByTagName(targetelement),
	        i = allsuspects.length;
	    for (i = allsuspects.length; i>= 0; i--) { //search backwards within nodelist for matching elements to remove
	        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!= null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!= -1){
	            allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
	        }
	    }
    },
    //baseurl
    baseurl:window.location.protocol+"//"+window.location.hostname
}

//
//syslib.error
//

var __Error=SYSLIB.namespace("syslib.error");
__Error.List=[];
//level
// 0 all 1 warn & error 2 error only
__Error.log=function(type,text){  // type = Notice Warn Error
	var log={
		type:type,
		text:type
	}
	if(!SYSLIB.settings['loglevel']||SYSLIB.settings['loglevel']<type){
		return console.log("%c"+(["Notice: ","Warn: ","Error: "])[type],(["color:#5353E5","color:#F7620E","color:#F81325"])[type]),console.log("%c"+text,(["background:#AED8FA","background:#FCCEB4","background:#F199A0"])[type]);
	}
}
window.onerror  =  function(errorMessage, errorUrl, errorLine){
	__Error.log(2,errorMessage+" onLine :"+((errorLine)?errorLine:"unknow Of ")+((errorUrl)?errorUrl:"unknow File"));
	return (SYSLIB.settings['release'])?true:false;
}

