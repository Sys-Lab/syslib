
//
// NS:CORE
// REQUIRE:NONE
// NEED:NONE
//
SYSLIB={
	ver:'0.1.0',
	 //settings
    settings:{
    	release:0,
    	loglevel:0,
    	set:function(settings,val){
    		if(val){
    			SYSLIB.settings[settings]=val;
    		}else{
    			for(var key in settings[key]){
	    			SYSLIB.settings[key]=settings[key];
	    		}
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
	    	
	    	for(var i in SYSLIB.namespaces_list){
	    		if(SYSLIB.namespaces_list[i]!=1){
					__Error.log(2,"Namespace : can't find required ns "+i);
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
	    	
	        if(!SYSLIB.include_need&&SYSLIB.include_end_callback){
	          	SYSLIB.include_end_callback();
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
				newnode.includeLink=newnode;
				
				SYSLIB.include_need++;
				document.body.appendChild(newnode);
				newnode.onload=function(){
					
			        SYSLIB.include_need--;
			        SYSLIB.check_loadend();
			    }
				SYSLIB.included[SYSLIB.includePath+ttp[0]] = 1;
		    }
	    }
	},
	exclude:function(filename, filetype) {
		
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


//
// NS:MATH
// REQUIRE:CORE
// NEED:NONE
//
var __Math=SYSLIB.namespace("syslib.math");
__Math.has =  function ($a,$b) {
            var $has = 0;
      $a = ($a.length)?$a:[$a];
      $b = ($b.length)?$b:[$b];
      for(var $j = 0;$j<$a.length;$j++) {
        for(var $k = 0;$k<$b.length;$k++) {
          if($a[$j] == $b[$k]) {
            $has++;
          }
        }
      }
            return ($has>= $b.length)
};
__Math.rand =  function (min,max,length) {
    var $rand = min+(Math.random() * (max-min));
    if(length) {
      if(length>0) {
        $rand = ($rand.toString()).split(".");
        $rand[1] = $rand[1].substr(0,length);
        $rand = $rand.join(".");
        return parseFloat($rand);
      }else{
        return $rand;
      }
    }else{
            return Math.floor($rand);
    }
};


//
// NS:DOM
// REQUIRE:CORE,MATH
// NEED:EVENT[ Bind event to dom obj ],UTIL[ dom obj global position ]
//
__Dom = SYSLIB.namespace("syslib.dom","syslib.math");
__Dom.domcache = {
	allnodes:[],
	byid:{},
	byclass:{},
	bytag:{},
	byattr:{}
};
__Dom.fresh=function () {
	__Dom.domcache = {
	    allnodes:[],
	    byid:{},
	    byclass:{},
	    bytag:{},
	    byattr:{}
	}
    __Dom.findall(document.body);
    
}
__Dom.nodeparser=function(node){
	node.find=function(ipt){
		return __Dom.find(ipt,this);
	}
	node.searchdom=function(ipt){
		return __Dom.search(ipt,this);
	}
	node.searchcontent=function(ipt){
		return __Dom.searchcontent(ipt,this);
	}
	node.has=function(ipt){
		return __Dom.class(this).has(ipt);
	}
	node.class=function(){
		return __Dom.class(this).get();
	}
	node.add=function(ipt){
		return __Dom.class(this).add(ipt);
	}
	node.remove=function(ipt){
		return __Dom.class(this).remove(ipt);
	}
	node.replace=function(ipt,to){
		return __Dom.class(this).replace(ipt,to);
	}
  node.getAttr=function(attrnames){
    if(typeof(attrnames)!='object'){
      return this.getAttribute(attrnames);
    }else{
      var attrs=[];
      for(var i=0;i<attrnames.length;i++){
        attrs.push(this.getAttribute(attrnames[i]))
      }
      return attrs;
    }
  }
  node.setAttr=function(attrsets,val){
    if(typeof(attrsets)!='object'){
      if(typeof(val)!='undefined'){
        this.setAttribute(attrsets,val);
      }else{
        __Error.log(2,"Node : can't set attribute missing value!");
      }
    }else{
      if(attrsets.length){
        if(typeof(val)!='undefined'){
          if(typeof(val)!='object'){
            for(var i=0;i<attrsets.length;i++){
              this.setAttribute(attrsets[i],val);
            }
          }else{
            if(val.length){
              if(val.length>=attrsets.length){
                this.setAttribute(attrsets[i],val[i]);
              }else{
                __Error.log(2,"Node : can't set attribute when key's length > value's length!");
              }
            }else{
              __Error.log(2,"Node : can't set attribute invilade value!");
            }
          } 
        }else{
          __Error.log(2,"Node : can't set attribute missing value!");
        }
      }else{
        for(var i in attrsets){
          this.setAttribute(i,attrsets[i]);
        }
      }
    }
  }
  if(__Event){
      node.addListener=function(event,listener,nopopup,level){
        return __Event.Listen(event,listener,nopopup,level,this);
      }
      node.removeListener=function(event,listener,nopopup,level){
        return __Event.unListen(event,listener,nopopup,level,this);
      }
      node.clearListener=function(){
        return __Event.clear(this);
      }
  }
  if(__Util){
      node.globalposition=function(event,listener,nopopup,level){
        return __Util.globalposition(this);
      }
  }
	return node;
}
__Dom.findall = function (father) {
    if(father.tagName) {
    	var list = father.childNodes;
    	__Dom.domcache.allnodes.push(__Dom.nodeparser(father));
    	if(list) {
        	if(list.length>0) {
        		var i = 0;
        		for(i = 0;i<list.length;i++) {
          			__Dom.findall(list[i]);
        		}
      		}else{
        		__Dom.findall(list);
      		}
    	}
  	}
}
__Dom.find = function (ipt,from) {
  	this.findthis = function (ipt,from) {
    	var $query = ipt.split("#"),
    		$nodes = 0;
    	if($query[1]) {
      		if(!from) {
        		$nodes = (__Dom.domcache.byid[$query[1]])?__Dom.domcache.byid[$query[1]]:document.getElementById($query[1]);
        		$nodes = ($nodes)?$nodes:0;
        		if($nodes) {
        			$nodes=__Dom.nodeparser($nodes);
          			__Dom.domcache.byid[$query[1]] = $nodes;
        		}
        		return $nodes;
      		}else{
        		var $nodesn = [],$uu = 0;
        		for($uu = 0;$uu<from.length;$uu++) {
         			$nodes = from[$uu];
          			if($nodes.id&&$nodes.id == $query[1]) {
          				if($nodes){
          					$nodes=__Dom.nodeparser($nodes);
          				}
            			$nodesn.push($nodes);
          			}
        		}
        		return $nodesn;
      		}
    	}
    	$query = ipt.split(".");
    	if($query[1]) {
      		if(!from) {
       			$nodes = (__Dom.domcache.byclass[$query[1]])?__Dom.domcache.byclass[$query[1]]:document.getElementsByClassName($query[1]);
        		$nodes = ($nodes)?$nodes:0;
        		if($nodes) {
        			$nodes=__Dom.nodeparser($nodes);
          			__Dom.domcache.byclass[$query[1]] = $nodes;
        		}
        		return $nodes;
      		}else{
        		var $nodesn = [],$uu = 0;
        		for($uu = 0;$uu<from.length;$uu++) {
         			$nodes = from[$uu];
          			if($nodes.className&&$nodes.className == $query[1]) {
          				if($nodes){
          					$nodes=__Dom.nodeparser($nodes);
          				}
            			$nodesn.push($nodes);
          			}
        		}
        		return $nodesn;
      		}
    	}
    	$query = ipt.split("<");
    	if($query[1]) {
      		$query = $query[1].split(">");
      		if(!from) {
       			$nodes = (__Dom.domcache.bytag[$query[0]])?__Dom.domcache.bytag[$query[0]]:document.getElementsByTagName($query[0]);
        		$nodes = ($nodes)?$nodes:0;
        		if($nodes) {
        			$nodes=__Dom.nodeparser($nodes);
          			__Dom.domcache.bytag[$query[0]] = $nodes;
        		}
        		return $nodes;
      		}else{
        		var $nodesn = [],$uu = 0;
        		for($uu = 0;$uu<from.length;$uu++) {
          			$nodes = from[$uu];
          			if($nodes.tagName&&(($nodes.tagName).toUpperCase()) == (($query[0]).toUpperCase())) {
            			$nodesn.push($nodes);
          			}
        		}
        		return $nodesn;
      		}
    	}
    	$query = ipt.split(" = ");
    	if($query[1]) {
      		$query[1] = $query[1].split("]")[0];
      		$query[0] = $query[0].split("[")[1];
      		if(!from) {
        		if(__Dom.domcache.byattr[$query[0]]) {
          			$nodes = __Dom.domcache.byattr[$query[0]];
        		}else{
          			if(!__Dom.domcache.allnodes||__Dom.domcache.allnodes.length == 0) {
            			__Dom.freshdomcache();
          			}
	          		for(var $k = 0;$k<__Dom.domcache.allnodes.length;$k++) {
	            		var $yy = __Dom.domcache.allnodes[$k];
	            		if($yy.getAttribute($query[0])&&$yy.getAttribute($query[0]) == $query[1]) {
	              			if(!$nodes) {
	                			$nodes = [];
	              			}
	              			if($yy){
	          					$yy=__Dom.nodeparser($yy);
	          				}
	              			$nodes.push($yy);
	            		}
	          		}
        		}
	        	$nodes = ($nodes)?$nodes:0;
	        	if($nodes) {
	          		__Dom.domcache.byattr[$query[0]] = $nodes;
	        	}
	        	return $nodes;
	      	}else{
	        	var $nodesn = [],$uu = 0;
	        	for($uu = 0;$uu<from.length;$uu++) {
	          		$nodes = from[$uu];
	          		if($nodes.getAttribute&&$nodes.getAttribute($query[0])&&$nodes.getAttribute($query[0]) == ($query[1])) {
	          			if($nodes){
          					$nodes=__Dom.nodeparser($nodes);
          				}
	            		$nodesn.push($nodes);
	          		}
	        	}
	        	return $nodesn;
	      	}
    	}
	}
  	//##########################
  	//U:$dom = __Dom.find("bellow");
  	//#id or .class or <tag> or [attr = val] mutil arg must use &&.
  	//E.G. "<div>&&.ffg&&[type = ll]"
  	//Do not support RE FOR NOW !
  	//R:dom node(s) or 0;
  	//##########################
  	var $i = 0,$j = 0;
  	if(!from) {
    	var $k = 0;
  	}else{
  		if(from.tagName){
  			var $k = __Dom.findall(from);
  		}else{
  			var $k = from;
  		}
  	}
  	
  	if(ipt.indexOf("&&")>0) {
    	$j = ipt.split("&&");
    	for($i = 0;$i<$j.length;$i++) {
      		$k = this.findthis($j[$i],$k);
      		if(!$k) {
        		return 0;
      		}
    	}
    	return $k;
  	}else{
    	return this.findthis(ipt,$k);
  	}
}
__Dom.search = function (ipt,from) {
  	this.searchthis = function (ipt,from) {
    	var $query = ipt.split("#"),$nodes = 0;
    	if(!from) {
      		var from = __Dom.domcache.allnodes;  
    	}
    	if($query[1]) {
      		var $nodesn = [],$uu = 0;
      		for($uu = 0;$uu<from.length;$uu++) {
        		$nodes = from[$uu];
        		if($nodes.id&&($nodes.id).match($query[1])) {
        			if($nodes){
          				$nodes=__Dom.nodeparser($nodes);
          			}
          			$nodesn.push($nodes);
        		}
      		}
      		return $nodesn;
    	}
    	$query = ipt.split(".");
		if($query[1]) {
  			var $nodesn = [],$uu = 0;
  			for($uu = 0;$uu<from.length;$uu++) {
    			$nodes = from[$uu];
    				if($nodes.className&&($nodes.className).match($query[1])) {
    					if($nodes){
          					$nodes=__Dom.nodeparser($nodes);
          				}
      					$nodesn.push($nodes);
    				}
  				}
  			return $nodesn;
		}
		$query = ipt.split("<");
    	if($query[1]) {
      		$query = $query[1].split(">");
      		var $nodesn = [],$uu = 0;
      		for($uu = 0;$uu<from.length;$uu++) {
        		$nodes = from[$uu];
        		if($nodes.tagName&&(($nodes.tagName).toUpperCase()).match($query[0])) {
        			if($nodes){
          				$nodes=__Dom.nodeparser($nodes);
          			}
          			$nodesn.push($nodes);
        		}
      		}
      		return $nodesn;
    	}
    	$query = ipt.split(" = ");
    	if($query[1]) {
      		$query[1] = $query[1].split("]")[0];
      		$query[0] = $query[0].split("[")[1];
      		var $nodesn = [],$uu = 0;
      		for($uu = 0;$uu<from.length;$uu++) {
        		$nodes = from[$uu];
        		if($nodes.getAttribute&&$nodes.getAttribute($query[0])&&($nodes.getAttribute($query[0])).match($query[1])) {
        			if($nodes){
          				$nodes=__Dom.nodeparser($nodes);
          			}
          			$nodesn.push($nodes);
        		}
      		}
      		return $nodesn;
    	}
  	}
  	//##########################
  	//U:$dom = __Dom.search("bellow");
  	//#id or .class or <tag> or [attr = val] mutil arg must use &&.
  	//id / class / tag / val is in RE
  	//Only support RE FOR NOW !
  	//R:dom node(s) or 0;
  	//##########################
  	var $i = 0,$j = 0;
  	if(!from) {
    	var $k = 0;
    	if(!__Dom.domcache.allnodes||__Domcache.allnodes.length == 0) {
      		__Dom.freshdomcache();
    	}
  	}else{
    	if(from.tagName){
  			var $k = __Dom.findall(from);
  		}else{
  			var $k = from;
  		}
  	}
  	
  	if(ipt.indexOf("&&")>0) {
    	$j = ipt.split("&&");
    	for($i = 0;$i<$j.length;$i++) {
      		$k = this.searchthis($j[$i],$k);
      		if(!$k) {
        		return 0;
      		}
    	}
    	return $k;
  	}else{
    	return this.searchthis(ipt,$k);
  	}
}
__Dom.searchcontent = function (ipt,from) {
  	if(!from) {
      	if(!__Dom.domcache.allnodes||__Dom.domcache.allnodes.length == 0) {
        	__Dom.freshdomcache();
      	}
      	var from = __Dom.domcache.allnodes;  
  	}
  	var $nodesn = [],$uu = 0;
  	for($uu = 0;$uu<from.length;$uu++) {
    	$nodes = from[$uu];
    	if($nodes.innerHTML&&($nodes.innerHTML).match(ipt)) {
    		if($nodes){
          		$nodes=__Dom.nodeparser($nodes);
          	}
      		$nodesn.push($nodes);
    	}
  	}
  	
  	return $nodesn;
}
__Dom.class = function (domnodes) {
  	if(!domnodes) {
      	return;
  	}
  	var $this = {};
  	$this.domnode = domnodes;
  	if(!$this.domnode.length) {
    	$this.domnode = [$this.domnode];
  	}
  	$this.has = function (ipt) {
    	var $hasclass = true,
	        ipt = ipt.split(" "),
	        $i = 0;
    	for($i = 0;$i<$this.domnode.length;$i++) {
	      	var domnode = $this.domnode[$i],
	          	$thisclassName = (domnode.className)?((domnode.className).split(" ")):[];
	      	if(!__Math.has($thisclassName,ipt)) {
	        	$hasclass = false;
	      	}
    	}
    	return $hasclass;
  	}
  	$this.get = function (ipt) {
    	var $nodesclasslist = [],
        	$i = 0;
    	for($i = 0;$i<$this.domnode.length;$i++) {
      		var domnode = $this.domnode[$i],
          	$thisclassName = (domnode.className)?((domnode.className).split(" ")):"",
         	$j = 0;
      		for($j = 0;$j<$thisclassName.length;$j++) {
        		if($nodesclasslist.indexOf($thisclassName[$j])<0) {
          			if($thisclassName[$j]!= "") {
            			$nodesclasslist.push($thisclassName[$j]);
          			}
        		}
      		}
    	}
    	return $nodesclasslist;
  	}
  	$this.add = function (ipt) {
    	var ipt = ipt.split(" "),
        	$i = 0;
    	for($i = 0;$i<$this.domnode.length;$i++) {
      		var domnode = $this.domnode[$i],
          		$thisclassName = (domnode.className)?((domnode.className).split(" ")):[],
          		$thisclassName = ($thisclassName!= "")?$thisclassName:[],
          		$j = 0;
      		for($j = 0;$j<ipt.length;$j++) {
        		if(!__Math.has($thisclassName,[ipt[$j]])) {
          			if($thisclassName.length) {
            			$thisclassName.push(ipt[$j]);
          			}else{
           				$thisclassName = [ipt[$j]];
          			}
        		}
      		}
      		domnode.className = $thisclassName.join(" ");
    	}
  	}
  	$this.remove = function (ipt) {
    	var ipt = ipt.split(" "),$i = 0;
    	for($i = 0;$i<$this.domnode.length;$i++) {
      		var domnode = $this.domnode[$i],
          		$thisclassName = (domnode.className).split(" ")||"",
          		$j = 0;
      		for($j = 0;$j<ipt.length&&$thisclassName;$j++) {
        		if(__Math.has($thisclassName,[ipt[$j]])) {
          			$thisclassName.splice($thisclassName.indexOf(ipt[$j]),1);
        		}
      		}
      		domnode.className = $thisclassName.join(" ");
    	}
  	}
  	$this.replace = function (ipt,to) {
    	var ipt = ipt.split(" "),
        	to = to.split(" "),
        	$i = 0;
    	for($i = 0;$i<$this.domnode.length;$i++) {
      		var domnode = $this.domnode[$i],
          	$thisclassName = (domnode.className).split(" ");
          	$thisclassName = ($thisclassName!= "")?$thisclassName:[];
      		if($thisclassName!= []) {
        		var $hasipt = 1,
            	$j = 0;
	        	for( $j = 0;$j<ipt.length;$j++) {
	          		if(!__Math.has($thisclassName,[ipt[$j]])) {
	            		$hasipt = 0;
	          		}
	        	}
	        	if($hasipt) {
	          		for($j = 0;$j<ipt.length;$j++) {
	            		if($thisclassName.indexOf(ipt[$j])>= 0) {
	              			$thisclassName.splice($thisclassName.indexOf(ipt[$j]),1);
	            		}
	          		}
	          		for($j = 0;$j<to.length;$j++) {
	            		if($thisclassName.indexOf(to[$j])<0) {
	              			if($thisclassName.length) {
	                			$thisclassName.push(to[$j]);
	              			}else{
	                			$thisclassName = [to[$j]];
	              			}
	            		}
	          		}
	          		domnode.className = $thisclassName.join(" ");
	        	}
      		}
   	 	}
  	}
  	return $this;
}

//short cuts

var _f=SYSLIB.namespace("syslib.dom").find,
	_search=SYSLIB.namespace("syslib.dom").search,
	_c=SYSLIB.namespace("syslib.dom").class;



//
// NS:EVENT
// REQUIRE:CORE,UTIL
// NEED:NONE
//

var HEIGHTEST=0,
  LOWEST=Math.pow(2, 53);

var __Event=SYSLIB.namespace("syslib.event","syslib.util",function(){
	__Event.global.eventtoken="global";
});
////////////////////////////////
// There is a level define listener's
// order with same event.
//
// use HEIGHTEST for the one you want 
// to triger it very first
// use LOWEST for the one you want
// to triger it very last
//
// trigger order is from HEIGHTEST(0) to LOWEST(Max val)
////////////////////////////////
__Event.Listeners={};
__Event.global={};
__Event.Listen=function(event,listener,nopopup,level,element){
	if(!element){
		element=__Event.global;
	}
	if(!element.eventtoken){
		element.eventtoken=__Util.token();
		if(element!=__Event.global){
			element.setAttribute("eventtoken",element.eventtoken)
		}
	}
	if(!__Event.Listeners[element.eventtoken]){
		__Event.Listeners[element.eventtoken]=new Object();
	}
	if(!__Event.Listeners[element.eventtoken][event]){
		__Event.Listeners[element.eventtoken][event]=new Array();
		if(element!=__Event.global){
			if(!Element.prototype.addEventListener){
				element.attachEvent('on'+event,function(){
					__Event.emit(event,window.event,element,this);
				})
			}else{
				element.addEventListener(event,function(e){
					__Event.emit(event,e,element,this);
				},false)
			}
		}
	}
	var elementinfo=(element.id)?("#"+element.id):element.eventtoken;
		listenerList=__Event.Listeners[element.eventtoken][event];
	if(!level){
		listenerList.push({
			listener:listener,
			nopopup:nopopup
		})
		
	}else{
		
		if(!listenerList[level]){
			listenerList[level]={
				listener:listener,
				nopopup:nopopup
			}
			if(level==LOWEST){
				
			}else{
				
			}
		}else{
			if(level==LOWEST){
				__Error.log(2,"Event : Event "+elementinfo+"."+event+"'s Listener with LOWEST Level is used.");
				return;
			}
			var newlevel=level;
			while(listenerList[newlevel]&&newlevel<LOWEST){
				newlevel++;
			}
			if(listenerList[newlevel]){
				__Error.log(2,"Event : Event "+elementinfo+"."+event+"'s Listener with Level "+level+" is used. Tried using lower Level but all is used.");
				return;
			}
			listenerList[newlevel]={
				listener:listener,
				nopopup:nopopup
			}
			if(newlevel==LOWEST){
				
			}else{
				
			}
		}
		
	}
}
__Event.unListen=function(event,listener,nopopup,level,element,all){
	if(!element){
		element=__Event.global;
	}
	if(!element.eventtoken){
		
		return;
	}
	var elementinfo=(element.id)?("#"+element.id):element.eventtoken;
	if(!__Event.Listeners[element.eventtoken]||!__Event.Listeners[element.eventtoken][event]){
		
		return;
	}
	var list=__Event.Listeners[element.eventtoken][event];
	for(var i=0;i<list.length;i++){
		if(list[i]){
			if(list[i].listener&&list[i].listener==listener&&list[i].nopopup==nopopup){
				
				list.splice(i,1);
				if(!all){
					break;
				}
			}
		}
	}
}
SYSLIB.settings.set('event_safe',true);
__Event.clear=function(element){
	/*
		todo: autoclear listener when del element
	*/
	if(!element){
		element=__Event.global;
	}
	if(element==__Event.global&&SYSLIB.settings.event_safe){
		
		return;
	}
	if(!element.eventtoken){
		
		return;
	}
	var elementinfo=(element.id)?("#"+element.id):element.eventtoken;
	if(!__Event.Listeners[element.eventtoken]){
		
		return;
	}
	__Event.Listeners[element.eventtoken]=[];
	
}
__Event.emit=function(event,data,element,scope){
	if(!element){
		element=__Event.global;
	}
	if(!element.eventtoken){
		
		return;
	}
	var elementinfo=(element.id)?("#"+element.id):element.eventtoken;
	if(!__Event.Listeners[element.eventtoken]||!__Event.Listeners[element.eventtoken][event]||!__Event.Listeners[element.eventtoken][event].length){
		
		return;
	}
	var list=__Event.Listeners[element.eventtoken][event];

	
	for(var i=0;i<list.length;i++){
		if(list[i]){
			var nopopup=list[i].nopopup;
			if(list[i].listener){
				
				list[i].listener.call(scope,data);
			}
			if(nopopup){
				
				break;
			}
		}
	}
}

//short cuts
var _listen=SYSLIB.namespace("syslib.event").Listen,
	_unlisten=SYSLIB.namespace("syslib.event").unListen;




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
__Template.build=function (f,vals,insertTo,callback) {
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
      if(callback){
        setTimeout(callback,50);
      }
    }
    setTimeout(func,50);
    
  	return rhtml;
}
//short cuts
var _template = SYSLIB.namespace("syslib.template").build;
var _lang=function(name){SYSLIB.namespace("syslib.template").SYS_LAN[name];};

//
// NS:MODEL
// REQUIRE:CORE,TEMPLATE
// NEED:NONE
//

__Model = SYSLIB.namespace("syslib.model","syslib.template");
__Model.t = function (name) {
	if(!__Model.list[name]){
		
	}
  	return __Model.list[name];
};
__Model.list = {};
__Model.add = function (name,html,required,initfunc,attrs,father,formats) {
  	if(__Model.list[name]) {
    	
   	 	return;
  	}
  	if(required) {
    	if(required.p) {
      		SYSLIB.includePath = required.p;
    	}else{
      		SYSLIB.includePath = '';
    	}
    	SYSLIB.include(required.f);
  	}
  	if(!father) {
    	father = document.getElementById('sys_main_playground');
  	}
  	var $model = __Model.build(name,html,initfunc,attrs,father,formats);
  	__Model.list[name] = $model;
}
__Model.draw = function (name,ipts) {
  	__Model.list[name].draw(ipts);
}
__Model.setstatue = function (name,statue) {
  	__Model.list[name].setstatue(statue);
}
__Model.jump_to = function (mod,statue,setdata) {
  	if(SYS_hide_all_mod) {
    	SYS_hide_all_mod();
  	}
  	if(setdata) {
    	var tmp;
    	for(tmp in setdata) {
      		var ii = tmp+" = \'"+setdata[tmp]+"\'";
      		eval(ii);
    	}
  	}
  	setTimeout(function () {
    	_m(mod).to(statue);
  	},600);
}
__Model.build = function (name,html,initfunc,attrs,father,formats) {
  	var $this = {
      	html:html,
      	father:father,
      	id:"SYS_MD_"+name,
      	node:document.createElement("div"),
      	statues:{},
      	name:name,
      	statue:"",
      	laststatue:"",
      	formats:formats,
      	rebuild:function () {
            $this.statue = "";
            $this.laststatue = "";
            __Template.build($this.html,$this.formats,$this.node);
            __Dom.fresh();
            if($this.initfunc) {
              	$this.initfunc();
            }
      	},
      	to:function (stname) {
            var ty = __Model.list[$this.name].statues[stname];
            if(!ty) {
            	
              	return;
            }
            if(ty.file) {
              	__Model.list[$this.name].statues[stname] = 0;
              	SYSLIB.includePath = ty.file.p;
              	if(ty.file.p) {
                  	SYSLIB.includePath = ty.file.p;
              	}else{
                  	SYSLIB.includePath = '';
              	}
              	if(ty.file.loadingani&&ty.file.loadingani.start) {
                	ty.file.loadingani.start();
              	}
              	var $stname = stname;
              	SYSLIB.include(ty.file.f);
              	var checkt = 0;
              	var tt = function check_loadok(a,b,c) {
                	if(__Model.list[a.name].statues[b]) {
                  		if(c.file.loadingani&&c.file.loadingani.ok) {
                    		c.file.loadingani.ok();
                  		}
                  		var $a = a;
                  		setTimeout(function () {$a.to($stname);},2000)
                  		clearInterval(checkt);
                  		return;
                	}
                	console.log('nothis');
              	};
              	var $stname = stname;
              	checkt = setInterval(function () {tt($this,$stname,ty);},500);
              
              	return;
            }
            __Model.list[$this.name].statues[stname]();
            $this.statue = stname;
            if(stname!= "hide") {
              	$this.laststatue = stname;
            }
      	},
    	addstatue:function (stname,stfunc,required,delyloadme) {
            if(__Model.list[$this.name].statues[stname]) {
              	
              	return;
            }
            if(delyloadme) {
              	__Model.list[$this.name].statues[stname] = {file:delyloadme};
            }else{
              	__Model.list[$this.name].statues[stname] = stfunc;
              	if(required) {
                	if(required.p) {
                  		SYSLIB.includePath = required.p;
                	}else{
                  		SYSLIB.includePath = '';
                	}
                	SYSLIB.include(required.f);
              	}
        	}
            
    	}
  	};
  	$this.node.innerHTML = __Template.build(html,formats);
  	$this.node.id = $this.id;
  	if(initfunc) {
      	$this.initfunc = initfunc;
  	}
  	if(attrs) {
    	for(var $attr in attrs) {
      		$this.node.setAttribute($attr,attrs[$attr]);
    	}
  	}
  	father.appendChild($this.node);
  	if($this.initfunc) {
      	$this.initfunc();
  	}
  	return $this;
}

//short cuts
var _m = SYSLIB.namespace("syslib.model").t,
	JUMP_TO = SYSLIB.namespace("syslib.model").jump_to;


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

