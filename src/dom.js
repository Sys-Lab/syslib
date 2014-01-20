//
// NS:DOM
// REQUIRE:CORE,MATH
// NEED:EVENT[ Bind event to dom obj ],UTIL[ dom obj global position ]
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
  if(__Event){
      node.addListener=function(event,listener,nopopup,level){
        return __Event.Listen(event,listener,nopopup,level,this);
      }
      node.removeListener=function(event,listener,nopopup,level){
        return __Event.unListen(event,listener,nopopup,level,this);
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


