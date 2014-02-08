//
// NS:MODEL
// REQUIRE:CORE,TEMPLATE
// NEED:NONE
//

__Model = SYSLIB.namespace("syslib.model","syslib.template");
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
            __Template.build($this.html,$this.formats,$this.node);
            _Dom.freshdomcache();
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

