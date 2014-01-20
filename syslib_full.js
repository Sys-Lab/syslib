var HEIGHTEST=0,
	LOWEST=Math.pow(2, 53);

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
	namespace:function (ns,require) {
		var ns = ns.split("."),
			opns = SYSLIB.namespaces[ns[0]],
			i = 1;
		if(require&&require!=-1){
			if(typeof(require)!='object'){
				var tmprequire=[];
				tmprequire[0]=require;
				require=tmprequire;
			}
			for(i=0;i<require.length;i++){
				if(!SYSLIB.namespace(require[i],-1)){
					//expection
					__Error.log(2,"Namespace : can't find required ns "+require[i])
					return;
				}
			}
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
//
//syslib.dom
//
__Dom = SYSLIB.namespace("syslib.dom");
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
    __Error.log(0,"DOM : fresh cache.");
}
__Dom.nodeparser=function(node){
	node.find=function(ipt){
		return __Dom.find(ipt,this);
	}
	node.search=function(ipt){
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
	node.addListener=function(event,listener,nopopup,level){
		return __Event.Listen(event,listener,nopopup,level,this);
	}
	node.removeListener=function(event,listener,nopopup,level){
		return __Event.unListen(event,listener,nopopup,level,this);
	}
	node.globalposition=function(event,listener,nopopup,level){
		return __Util.globalposition(this);
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
  	__Error.log(0,"DOM : find "+ipt);
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
  	__Error.log(0,"DOM : search "+ipt);
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
  	__Error.log(0,"DOM : searchcontent "+ipt);
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
	          	$thisclassName = (domnode.className).split(" ");
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
          	$thisclassName = (domnode.className).split(" ")||"",
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
          		$thisclassName = (domnode.className).split(" "),
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
    	__Error.log(0,"DOM : searchcontent "+ipt);
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

//
//syslib.event
//

var __Event=SYSLIB.namespace("syslib.event");
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
__Event.Listen=function(event,listener,nopopup,level,element){
	if(!element){
		element='global';
	}
	if(!__Event.Listeners[element]){
		__Event.Listeners[element]=new Object();
	}
	if(!__Event.Listeners[element][event]){
		__Event.Listeners[element][event]=new Array();
		if(element!='global'){
			if(!Element.prototype.addEventListener){
				element.attachEvent('on'+event,function(){
					__Event.emit(event,window.event,element);
				})
			}else{
				element.addEventListener(event,function(e){
					__Event.emit(event,e,element);
				},false)
			}
		}
	}
	var elementinfo=(element.id)?("#"+element.id):element,
		listenerList=__Event.Listeners[element][event];
	if(!level){
		listenerList.push({
			listener:listener,
			nopopup:nopopup
		})
		__Error.log(0,"Event : Event "+elementinfo+"."+event+"'s Listener with Level "+listenerList.length+" is added.");
	}else{
		
		if(!listenerList[level]){
			listenerList[level]={
				listener:listener,
				nopopup:nopopup
			}
			if(level==LOWEST){
				__Error.log(0,"Event : Event "+elementinfo+"."+event+"'s Listener with LOWEST level added.");
			}else{
				__Error.log(0,"Event : Event "+elementinfo+"."+event+"'s Listener with Level "+level+" is added.");
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
				__Error.log(1,"Event : Event "+elementinfo+"."+event+"'s Listener with Level "+level+" is used. Using LOWEST level instead.");
			}else{
				__Error.log(1,"Event : Event "+elementinfo+"."+event+"'s Listener with Level "+level+" is used. Using "+newlevel+" level instead.")
			}
		}
		
	}
}
__Event.unListen=function(event,listener,nopopup,level,element,all){
	if(!element){
		element='global';
	}
	var elementinfo=(element.id)?("#"+element.id):element;
	if(!__Event.Listeners[element]||!__Event.Listeners[element][event]){
		__Error.log(1,"Event : Event "+elementinfo+"."+event+" has no Listener to unListen !");
		return;
	}
	var list=__Event.Listeners[element][event];
	for(var i=0;i<list.length;i++){
		if(list[i]){
			if(list[i].listener&&list[i].listener==listener&&list[i].nopopup==nopopup){
				__Error.log(0,"Event : Event "+elementinfo+"."+event+"'s Listener with Level "+i+" is removed.");
				list.splice(i,1);
				if(!all){
					break;
				}
			}
		}
	}
}
__Event.emit=function(event,data,element){
	if(!element){
		element='global';
	}
	var elementinfo=(element.id)?("#"+element.id):element;
	if(!__Event.Listeners[element]||!__Event.Listeners[element][event]||!__Event.Listeners[element][event].length){
		__Error.log(1,"Event : Event "+elementinfo+"."+event+" has no Listener !");
		return;
	}
	var list=__Event.Listeners[element][event];
	__Error.log(0,"Event : Event "+event+" emit !");
	for(var i=0;i<list.length;i++){
		if(list[i]){
			var nopopup=list[i].nopopup;
			if(list[i].listener){
				__Error.log(0,"Event : Event "+elementinfo+"."+event+" emit Listener with level "+i);
				list[i].listener(data);
			}
			if(nopopup){
				__Error.log(0,"Event : Event "+elementinfo+"."+event+" emit break on level "+i);
				break;
			}
		}
	}
}
//
//syslib.model
//
__Model = SYSLIB.namespace("syslib.model");
__Model.t = function (name) {
	if(!__Model.list[name]){
		__Error.log(1,"Model : model "+name+" dosen't exist .");
	}
  	return __Model.list[name];
};
__Model.list = {};
__Model.add = function (name,html,required,initfunc,attrs,father,formats) {
  	if(__Model.list[name]) {
    	__Error.log(1,"Model : model "+name+" already exist .");
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
            $this.node.innerHTML = __Template.build($this.html,$this.formats);
            SYSLIB_ui.parse_scroll_nodes();
            SYSLIB_dom.freshdomcache();
            if($this.initfunc) {
              	$this.initfunc();
            }
      	},
      	to:function (stname) {
            var ty = __Model.list[$this.name].statues[stname];
            if(!ty) {
            	__Error.log(1,"Model : model "+name+"'s statue "+stname+" doesn't exist .");
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
            SYSLIB_ui.parse_scroll_nodes();
            $this.statue = stname;
            if(stname!= "hide") {
              	$this.laststatue = stname;
            }
      	},
    	addstatue:function (stname,stfunc,required,delyloadme) {
            if(__Model.list[$this.name].statues[stname]) {
              	__Error.log(1,"Model : model "+name+"'s statue "+stname+" already exist .");
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
  	SYSLIB_ui.parse_scroll_nodes();
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


//
//syslib.math
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
//syslib.util
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
            if (obj.hasOwnProperty(attr)) copy[attr]  =  SYSLIB_utils.clone(obj[attr]);
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
//
//syslib.template
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
//
//syslib.vilade
//
__Vilade=SYSLIB.namespace("syslib.vilade")
__Vilade.list = {
	"email":function (ipt) {
    	// contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
    	return /^((([a-z]|\d|[!#\$%&'\*\+\-\/ = \?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/ = \?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(ipt);
  	},
  	"url":function (ipt) {
    	// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
    	return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,; = ]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,; = ]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,; = ]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,; = ]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,; = ]|:|@)|\/|\?)*)?$/i.test(ipt);
  	},
  	"date":function (ipt) {
    	return !/Invalid|NaN/.test(new Date(ipt).toString());
  	},
  	"dateISO":function (ipt) {
    	return /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(ipt);
  	},
  	"number":function (ipt) {
    	return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(ipt);
  	},
  	"digits":function (ipt) {
    	return /^\d+$/.test(ipt);
  	},
  	"letterswithbasicpunc":function (ipt) {
    	return /^[a-z\-.,()'"\s]+$/i.test(ipt);
  	},
  	"alpha+numer":function (ipt) {
    	return /^\w+$/i.test(ipt);
  	},
  	"lettersonly":function (ipt) {
   		return /^[a-z]+$/i.test(ipt);
  	},
  	"nowhitespace":function (ipt) {
    	return /^\S+$/i.test(ipt);
  	},
  	"int":function (ipt) {
    	return /^-?\d+$/.test(ipt);
  	},
  	"+int":function (ipt) {
    	return /^[0-9]*[1-9][0-9]*$/.test(ipt);
  	},
  	"0+int":function (ipt) {
    	return /^\d+$/.test(ipt);
  	},
  	"0-int":function (ipt) {
    	return /^((-\d+)|(0+))$/.test(ipt);
  	},
  	"-int":function (ipt) {
    	return /^-[0-9]*[1-9][0-9]*$/.test(ipt);
  	},
  	"0+float":function (ipt) {
    	return /^\d+(\.\d+)?$/.test(ipt);
  	},
  	"+float":function (ipt) {
    	return /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(ipt);
  	},
  	"0-float":function (ipt) {
    	return /^((-\d+(\.\d+)?)|(0+(\.0+)?))$/.test(ipt);
  	},
  	"-float":function (ipt) {
    	return /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/.test(ipt);
  	},
  	"float":function (ipt) {
    	return /^(-?\d+)(\.\d+)?$/.test(ipt);
  	},
  	"alpha":function (ipt) {
    	return /^[A-Za-z]+$/.test(ipt);
  	},
  	"ualpha":function (ipt) {
    	return /^[A-Z]+$/.test(ipt);
  	},
  	"lalpha":function (ipt) {
    	return /^[a-z]+$/.test(ipt);
  	},
  	"chinesemobile":function (ipt) {
    	return /^1[3|4|5|8][0-9]\d{4,8}$/.test(ipt);
  	},
  	"chineseid":function (idcard) {
	    var area = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"},
	        idcard,Y,JYM,
	        S,M,
	        idcard_array  =  new Array(),
	        idcard_array  =  idcard.split("");
    	//地区检验
    	if(area[parseInt(idcard.substr(0,2))] == null) {
      		return false;//"身份证地区非法!"
    	}
    	//身份号码位数及格式检验
    	switch(idcard.length) {
      		case 15:
          		if ( (parseInt(idcard.substr(6,2))+1900) % 4  ==  0 || ((parseInt(idcard.substr(6,2))+1900) % 100  ==  0 && (parseInt(idcard.substr(6,2))+1900) % 4  ==  0 )) {
            		ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
          		}else{
            		ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
          		}
          		if(ereg.test(idcard)) {
            		return true;
          		}else{
            		return false;//"身份证号码出生日期超出范围或含有非法字符!",
          		}
          		break;
      		case 18:
		        //18位身份号码检测
		        //出生日期的合法性检查
		        //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
		        //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
		        if ( parseInt(idcard.substr(6,4)) % 4  ==  0 || (parseInt(idcard.substr(6,4)) % 100  ==  0 && parseInt(idcard.substr(6,4))%4  ==  0 )) {
              		ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式
          		}else{
              		ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式
          		}
          		if(ereg.test(idcard)) {//测试出生日期的合法性
              		//计算校验位
            		S  =  (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
			            + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
			            + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
			            + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
			            + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
			            + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
			            + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
			            + parseInt(idcard_array[7]) * 1
			            + parseInt(idcard_array[8]) * 6
			            + parseInt(idcard_array[9]) * 3 ;
            		Y  =  S % 11;
            		M  =  "F";
            		JYM  =  "10X98765432";
            		M  =  JYM.substr(Y,1);//判断校验位
            		if(M  ==  idcard_array[17]) {
              			return true;
            		}else{
              			return false;//"身份证号码校验错误!",
            		}
          		}else{
            		return false;//"身份证号码出生日期超出范围或含有非法字符!",
          		}
          		break;
    		default:
      			return false;// "身份证号码位数不对!",
      			break;
    	}
  	},
  	"sysupass":function (ipt) {
    	return /^[0-9a-zA-Z\!\?\@\#\$\%\^\&\*\(\)\[\]\{\}\|\\]{6,64}$/.test(ipt);
  	},
  	"systag":function (ipt) {
    	return /^[0-9a-zA-Z\u4e00-\u9fa5\']{1,4}$/.test(ipt);
  	},
  	"sysitemname":function (ipt) {
    	return /^[\S]{1,24}$/.test(ipt);
  	},
  	"chineseonly":function (ipt) {
    	return /^[\u4e00-\u9fa5]{1,}$/.test(ipt);
  	},
  	"sysuname":function (ipt) {
    	return /^[0-9a-zA-Z\u4e00-\u9fa5\_]{1,12}$/.test(ipt);
  	}
}
__Vilade.vilade = function (ipt,rule) {
  	if(__Vilade.list[rule]) {
   		return __Vilade.list[rule](ipt);
  	}else{
  		__Error.log(2,"Vilade : can't find "+rule);
  	}
}

//
//syslib.sound
//
__Sound=SYSLIB.namespace("syslib.sound")
__Sound.list = [];
__Sound.add = function (name,url) {
  	if(!__Sound.list[name]) {
    	__Sound.list[name] = url;
  	}else{
  		__Error.log(1,"Sound : sound "+name+" is already exist.");
  	}
}
__Sound.device = document.createElement("audio");
__Sound.play = function (name) {
  	__Sound.device.src = __Sound.list[name];
  	__Sound.device.play();
}

//
//syslib.ajax
//
__Ajax=SYSLIB.namespace("syslib.ajax");
__Ajax.post = function (api,datas,rf_success,rf_error,notasync,timeout) {
  	var async = (notasync)?false:true;
  	snack.request({
     	method:"post",
     	url:api,
		format:"json",
     	data:datas,
     	async:async,
     	timeout:(timeout)?timeout:36000
    },
    function (err,data) {
	 	data=JSON.parse(data);
		if(err){
			if(rf_error) {
     			rf_error(errorThrown);
				return;
  			}
		}
   		if(rf_success) {
     		rf_success(data);
   		}
	});
}
__Ajax.getfile = function (url,rf_success,rf_error,async) {
  	var $tt = "";
  	snack.request({
     	method:"get",
     	format:"html",
     	url:url,
     	async:(async)?async:false,
     	timeout:36000
     },
     function (err,data) {
		if(err){
			if(rf_error) {
         		rf_error(errorThrown);
				return;
      		}
		}
       	if(rf_success) {
         	rf_success(data);
       	}else{
         	$tt =  data;
       	}
  	});
  	return $tt;
}
__Ajax.load = function (file,cb,err) {
  	snack.request({
        method:"get",
        dataType:"html",
        url:file,
        timeout:100000
    },function (err2,data) {
		if(err2){
			if(err) {
         		err(err2);
				return;
      		}
		}
        if(cb) {
            cb(data);
        }
        return data;
    });
}

//
//syslib.cookies
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

//
// syslib.socket
//
_Socket=SYSLIB.namespace("syslib.socket");
_Socket.io = io;
_Socket.sockets = {};
_Socket.connect = function (name,host,port,run) {
  	if(!run) {
    	var run = 0;
  	}
  	if(!_Socket.sockets[name]) {
    	var soc = (_Socket.io.connect(host+':'+port)),$name = name,$host = host,$port = port,$soc = soc,$run = run;
    	soc.on('connectok', function (data) {
      		var tttuuu = new SYSLIB_send.socket($name,$host,$port,this);
        	_Socket.sockets[name] = tttuuu;
      		if($run) {
        		$run();
      		}
      		return tttuuu;
    	});
  	}
}
_Socket.getsocket = function (name) {
  return _Socket.sockets[name];
}
_Socket.socket = function (name,host,port,socket) {
  	this.name = name;
  	var $this = this;
  	this.host = host;
  	this.port = port;
  	this.socket = socket;
  	this.socketlist = {};
  	this.send = function (api,data,success,fail,token,nodelete,pass) {
	    if(!token) {
	      	var token = SYSLIB_token.get();
	    }
	    if(!nodelete) {
	      	var nodelete = 0;
	    }
	    if(!success) {
	      	var success = function () {};
	    }
	    if(!fail) {
	      	var fail = function () {};
	    }
	    var $outdata = JSON.stringify(data);
	    if(!pass) {
	      	var pass = 0;
	    }else{
	      	$outdata = sjcl.encrypt(pass,$outdata);
	    }
    	$this.socketlist[token] = {api:api,success:success,fail:fail,nodelete:nodelete,pass:pass};
    	$this.socket.emit('senddata', { id:token,datas: $outdata });
  	}
  	$this.socket.on('recivedata', function (data) {
      	var token = data.id;
    	if($this.socketlist[token]) {
      		var $outdata = data.data;
	      	if($this.socketlist[token].pass) {
	        	$outdata = sjcl.decrypt($this.socketlist[token].pass,$outdata);
	      	}
	      	$outdata = JSON.parse($outdata);
	      	if(data.flag == "ok") {
	        	$this.socketlist[token].success($outdata);
	      	}else{
	        	$this.socketlist[token].fail($outdata,data.flag);
	      	}
	      	if(!$this.socketlist[token].nodelete) {
	        	$this.socketlist[token] = 0;
	      	}
    	}
  	});
  	return this;
}

//
//syslib.file
//
__File=SYSLIB.namespace("syslib.file");
__File.file = new Filer();
__File.save_to_ls = function (data,totalsizeinmb,filepath,encodetype) {
  	if(!data||!filepath) {
    	return;
  	}
 	if(!totalsizeinmb) {
    	var totalsizeinmb = 10;
  	}
  	if(!encodetype) {
    	var encodetype = 0;
  	}
  	switch(encodetype) {
    	case 1:
      		data = JSON.stringify(data);
      		break;
  	}
  	__File.file.init({persistent: true, size: totalsizeinmb*1024 * 1024}, function (fs) {
	    var eee = function () {
	      	__File.file.write(filepath, {data: data, type: 'application/octet-stream'},function (fileEntry) {
	      	},
	        function () {
	            __Error.log(2,"File : Faild To save files "+filepath);
	        });
	    }
    	eee();  
	    //try{
	    //  SYSLIB_utils.file.rm(filepath,function () {
	    //    eee();    
	    //  },function () {
	    //    console.log('Faild To save files')
	    //  })
	    //}catch(e) {
	    //  eee();
	    //}
	}, function () {
  		__Error.log(2,"File : Faild To save files "+filepath);
	});
};
__File.load_from_ls = function (filepath,decodetype,scb) {
  	if(!filepath) {
    	scb(0);
    	return;
  	}
  	var decodeandreturn = function (data) {
    	switch(decodetype) {
      		case 1:
        		data = JSON.parse(data);
        		break;
    	}
    	scb(data);
  	}
  	try{
      	__File.file.init({persistent: true, size: 200*1024 * 1024}, function (fs) {
         	__File.file.open(filepath,function (file) {
            	var reader  =  new FileReader();
            	reader.onload  =  (function (theFile) {
              		return function (e) {
                		decodeandreturn(e.target.result);
              		};
            	})(file);
            	reader.readAsText(file);
        	},function () {
            	__Error.log(2,"File : Faild To open files "+filepath);
            	scb(0);
        	});
   		}, function () {
        	__Error.log(2,"File : Faild To open files "+filepath);
        	scb(0);
      	});
    }catch(e) {
      scb(0);
    }
}
//
//syslib.geo
//
__Geo=SYSLIB.namespace("syslib.geo");
__Geo.get=function (scb,err) {
  	var getgeo = function (scb,scb2,err) {
    	if (navigator.geolocation) {
          	navigator.geolocation.getCurrentPosition(scb,function (error) {
        		switch(error.code) {
		            case error.PERMISSION_DENIED:
		                console.log("GEO: User denied the request for Geolocation.");
		                break;
		            case error.POSITION_UNAVAILABLE:
		                console.log("GEO: Location information is unavailable.");
		                break;
		            case error.TIMEOUT:
		                console.log("GEO: The request to get user location timed out.");
		                break;
		            case error.UNKNOWN_ERROR:
		                console.log("GEO: An unknown error occurred.");
		                break;
            	}
        		if(scb2) {
        			scb2();
        		}else{ 
        			if(err) {
        				err();
        			}
        		}
      		});
       	}else{
      		if(scb2) {
      			scb2();
      		}
    	}
  	}
  	getgeo(function (e) {
    	snack.JSONP({
       		url:'http://api.map.baidu.com/geocoder/v2/',
			key:'callback',
       		data:{ak:'6f7bcd8ebbe8209777f27f32fed49746',location:(e.coords.latitude+","+e.coords.longitude),output:'json',pois:1}
       	},function (data) {
	        if(!data||!data.result) {
	          	return err();
	        }
	        var pos = {
	          	accuracy:e.coords.accuracy,
	          	altitude:e.coords.altitude,
	          	altitudeAccuracy:e.coords.altitudeAccuracy,
	          	heading:e.coords.heading,
	          	latitude:e.coords.latitude,
	          	longitude:e.coords.longitude,
	          	speed:e.coords.speed,
	          	timestamp:e.timestamp,
	          	address:data.result.formatted_address,
	          	city:data.result.addressComponent.city,
	          	district:data.result.addressComponent.district,
	          	province:data.result.addressComponent.province,
	          	street:data.result.addressComponent.street,
	          	street_number:data.result.addressComponent.street_number
	        }
        	scb(pos);
    	});
  	},function (e) {
    	snack.JSONP({
	       	url:'http://api.map.baidu.com/location/ip',
	       	data:{ak:'6f7bcd8ebbe8209777f27f32fed49746'},
	       	key:'callback'
	    },function (data) {
	        if(!data||!data.content) {
	          	return err();
	        }
	        var pos = {
	          	accuracy:0,
	          	altitude:0,
	          	altitudeAccuracy:0,
	          	heading:0,
	          	latitude:data.content.point.x,
	          	longitude:data.content.point.y,
	          	speed:0,
	          	timestamp:(new Date()).getTime(),
	          	address:data.content.address,
	          	city:data.content.address_detail.city,
	          	district:data.content.address_detail.district,
	          	province:data.content.address_detail.province,
	          	street:data.content.address_detail.street,
	          	street_number:data.content.address_detail.street_number
	        }
        	scb(pos);
    	});
  	},err)
}


//short cuts
var _title = SYSLIB.namespace("syslib.util").title,
	_pushhistory = SYSLIB.namespace("syslib.util").brhistory,
	_seturl = SYSLIB.namespace("syslib.util").url,
    _clone = SYSLIB.namespace("syslib.utils").clone,
	_f=SYSLIB.namespace("syslib.dom").find,
	_search=SYSLIB.namespace("syslib.dom").search,
	_c=SYSLIB.namespace("syslib.dom").class,
	_listen=SYSLIB.namespace("syslib.event").Listen,
	_unlisten=SYSLIB.namespace("syslib.event").unListen;
//_listen(event,listener,nopopup,level,element)
_f("#abc").find(".def")[0].addListener("click",function(e){alert(e)},false);

