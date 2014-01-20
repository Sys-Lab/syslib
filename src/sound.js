//
// NS:SOUND
// REQUIRE:CORE
// NEED:NONE
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


