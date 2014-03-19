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
			if(typeof Element== undefined){
				Element={};
			}
			if(Element.prototype.addEventListener){
				element.addEventListener(event,function(e){
					__Event.emit(event,e,element,this);
				},false)
			}else{
				element['on'+event]=function(e){
					__Event.emit(event,window.event,element,this);
				}
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
				__Error.log(1,"Event : Event "+elementinfo+"."+event+"'s Listener with Level "+level+" is used. Using "+newlevel+" level instead.");
			}
		}
		
	}
}
__Event.unListen=function(event,listener,nopopup,level,element,all){
	if(!element){
		element=__Event.global;
	}
	if(!element.eventtoken){
		__Error.log(1,"Event : element With no eventtoken!");
		return;
	}
	var elementinfo=(element.id)?("#"+element.id):element.eventtoken;
	if(!__Event.Listeners[element.eventtoken]||!__Event.Listeners[element.eventtoken][event]){
		__Error.log(1,"Event : Event "+elementinfo+"."+event+" has no Listener to unListen !");
		return;
	}
	var list=__Event.Listeners[element.eventtoken][event];
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
SYSLIB.settings.set('event_safe',true);
__Event.clear=function(element){
	/*
		todo: autoclear listener when del element
	*/
	if(!element){
		element=__Event.global;
	}
	if(element==__Event.global&&SYSLIB.settings.event_safe){
		__Error.log(1,"Event : can't clear global settings! Please set event_safe to false.");
		return;
	}
	if(!element.eventtoken){
		__Error.log(1,"Event : element With no eventtoken!");
		return;
	}
	var elementinfo=(element.id)?("#"+element.id):element.eventtoken;
	if(!__Event.Listeners[element.eventtoken]){
		__Error.log(1,"Event : Event "+elementinfo+"."+event+" has no Listener to clear !");
		return;
	}
	__Event.Listeners[element.eventtoken]=[];
	__Error.log(0,"Event : Event "+elementinfo+"'s Listener is cleared.");
}
__Event.emit=function(event,data,element,scope){
	if(!element){
		element=__Event.global;
	}
	if(!element.eventtoken){
		__Error.log(1,"Event : element With no eventtoken!");
		return;
	}
	var elementinfo=(element.id)?("#"+element.id):element.eventtoken;
	if(!__Event.Listeners[element.eventtoken]||!__Event.Listeners[element.eventtoken][event]||!__Event.Listeners[element.eventtoken][event].length){
		__Error.log(1,"Event : Event "+elementinfo+"."+event+" has no Listener !");
		return;
	}
	var list=__Event.Listeners[element.eventtoken][event];

	__Error.log(0,"Event : Event "+event+" emit !");
	for(var i=0;i<list.length;i++){
		if(list[i]){
			var nopopup=list[i].nopopup;
			if(list[i].listener){
				__Error.log(0,"Event : Event "+elementinfo+"."+event+" emit Listener with level "+i);
				list[i].listener.call(scope,data,scope);
			}
			if(nopopup){
				__Error.log(0,"Event : Event "+elementinfo+"."+event+" emit break on level "+i);
				break;
			}
		}
	}
}

//short cuts
var _listen=SYSLIB.namespace("syslib.event").Listen,
	_unlisten=SYSLIB.namespace("syslib.event").unListen;



