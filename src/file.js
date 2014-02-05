//
// NS:FILE
// REQUIRE:CORE
// NEED:NONE
//
////////////////// external reqiurement

/*filer.js*/var self=this;self.URL=self.URL||self.webkitURL;self.requestFileSystem=self.requestFileSystem||self.webkitRequestFileSystem;self.resolveLocalFileSystemURL=self.resolveLocalFileSystemURL||self.webkitResolveLocalFileSystemURL;navigator.temporaryStorage=navigator.temporaryStorage||navigator.webkitTemporaryStorage;navigator.persistentStorage=navigator.persistentStorage||navigator.webkitPersistentStorage;self.BlobBuilder=self.BlobBuilder||self.MozBlobBuilder||self.WebKitBlobBuilder;
if(void 0===self.FileError){var FileError=function(){};FileError.prototype.prototype=Error.prototype}
var Util={toArray:function(a){return Array.prototype.slice.call(a||[],0)},strToDataURL:function(a,b,c){return(void 0!=c?c:1)?"data:"+b+";base64,"+self.btoa(a):"data:"+b+","+a},strToObjectURL:function(a,b){for(var c=new Uint8Array(a.length),d=0;d<c.length;++d)c[d]=a.charCodeAt(d);c=new Blob([c],b?{type:b}:{});return self.URL.createObjectURL(c)},fileToObjectURL:function(a){return self.URL.createObjectURL(a)},fileToArrayBuffer:function(a,b,c){var d=new FileReader;d.onload=function(a){b(a.target.result)};
d.onerror=function(a){c&&c(a)};d.readAsArrayBuffer(a)},dataURLToBlob:function(a){if(-1==a.indexOf(";base64,")){var b=a.split(","),a=b[0].split(":")[1],b=b[1];return new Blob([b],{type:a})}for(var b=a.split(";base64,"),a=b[0].split(":")[1],b=window.atob(b[1]),c=b.length,d=new Uint8Array(c),i=0;i<c;++i)d[i]=b.charCodeAt(i);return new Blob([d],{type:a})},arrayBufferToBlob:function(a,b){var c=new Uint8Array(a);return new Blob([c],b?{type:b}:{})},arrayBufferToBinaryString:function(a,b,c){var d=new FileReader;
d.onload=function(a){b(a.target.result)};d.onerror=function(a){c&&c(a)};a=new Uint8Array(a);d.readAsBinaryString(new Blob([a]))},arrayToBinaryString:function(a){if("object"!=typeof a)return null;for(var b=a.length,c=Array(b);b--;)c[b]=String.fromCharCode(a[b]);return c.join("")},getFileExtension:function(a){var b=a.lastIndexOf(".");return-1!=b?a.substring(b):""}},MyFileError=function(a){this.prototype=FileError.prototype;this.code=a.code;this.name=a.name};FileError.BROWSER_NOT_SUPPORTED=1E3;
FileError.prototype.__defineGetter__("name",function(){for(var a=Object.keys(FileError),b=0,c;c=a[b];++b)if(FileError[c]==this.code)return c;return"Unknown Error"});
var Filer=new function(){function a(e){if(b=e||null)c=b.root,d=!0}var b=null,c=null,d=!1,i=function(e){return 0==e.indexOf("filesystem:")},k=function(e){i(e)||(e="/"==e[0]?b.root.toURL()+e.substring(1):0==e.indexOf("./")||0==e.indexOf("../")?"../"==e&&c!=b.root?c.toURL()+"/"+e:c.toURL()+e:c.toURL()+"/"+e);return e},l=function(e,a){var b=arguments[1],c=arguments[2],g=function(e){if(e.code==FileError.NOT_FOUND_ERR){if(c)throw Error('"'+b+'" or "'+c+'" does not exist.');throw Error('"'+b+'" does not exist.');
}throw Error("Problem getting Entry for one or more paths.");},m=k(b);if(3==arguments.length){var d=k(c);self.resolveLocalFileSystemURL(m,function(a){self.resolveLocalFileSystemURL(d,function(b){e(a,b)},g)},g)}else self.resolveLocalFileSystemURL(m,e,g)},p=function(e,a,c,f,g,m){if(!b)throw Error("Filesystem has not been initialized.");if(typeof e!=typeof a)throw Error("These method arguments are not supported.");var d=c||null,n=void 0!=m?m:!1;(e.isFile||a.isDirectory)&&a.isDirectory?n?e.moveTo(a,d,
f,g):e.copyTo(a,d,f,g):l(function(e,a){if(a.isDirectory)n?e.moveTo(a,d,f,g):e.copyTo(a,d,f,g);else{var b=Error('Oops! "'+a.name+" is not a directory!");if(g)g(b);else throw b;}},e,a)};a.DEFAULT_FS_SIZE=1048576;a.version="0.4.1";a.prototype={get fs(){return b},get isOpen(){return d},get cwd(){return c}};a.prototype.pathToFilesystemURL=function(a){return k(a)};a.prototype.init=function(a,j,h){if(!self.requestFileSystem)throw new MyFileError({code:FileError.BROWSER_NOT_SUPPORTED,name:"BROWSER_NOT_SUPPORTED"});
var a=a?a:{},f=a.size||1048576;this.type=self.TEMPORARY;if("persistent"in a&&a.persistent)this.type=self.PERSISTENT;var g=function(a){this.size=f;b=a;c=b.root;d=!0;j&&j(a)};this.type==self.PERSISTENT&&navigator.persistentStorage?navigator.persistentStorage.requestQuota(f,function(a){self.requestFileSystem(this.type,a,g.bind(this),h)}.bind(this),h):self.requestFileSystem(this.type,f,g.bind(this),h)};a.prototype.ls=function(a,j,h){if(!b)throw Error("Filesystem has not been initialized.");var f=function(a){c=
a;var e=[],b=c.createReader(),f=function(){b.readEntries(function(a){a.length?(e=e.concat(Util.toArray(a)),f()):(e.sort(function(a,e){return a.name<e.name?-1:e.name<a.name?1:0}),j(e))},h)};f()};a.isDirectory?f(a):i(a)?l(f,k(a)):c.getDirectory(a,{},f,h)};a.prototype.mkdir=function(a,j,h,f){if(!b)throw Error("Filesystem has not been initialized.");var g=null!=j?j:!1,d=a.split("/"),o=function(b,c){if("."==c[0]||""==c[0])c=c.slice(1);b.getDirectory(c[0],{create:!0,exclusive:g},function(b){if(b.isDirectory)c.length&&
1!=d.length?o(b,c.slice(1)):h&&h(b);else if(b=Error(a+" is not a directory"),f)f(b);else throw b;},function(b){if(b.code==FileError.INVALID_MODIFICATION_ERR)if(b.message="'"+a+"' already exists",f)f(b);else throw b;})};o(c,d)};a.prototype.open=function(a,c,d){if(!b)throw Error("Filesystem has not been initialized.");a.isFile?a.file(c,d):l(function(a){a.file(c,d)},k(a))};a.prototype.create=function(a,d,h,f){if(!b)throw Error("Filesystem has not been initialized.");c.getFile(a,{create:!0,exclusive:null!=
d?d:!0},h,function(b){if(b.code==FileError.INVALID_MODIFICATION_ERR)b.message="'"+a+"' already exists";if(f)f(b);else throw b;})};a.prototype.mv=function(a,b,c,f,d){p.bind(this,a,b,c,f,d,!0)()};a.prototype.rm=function(a,c,d){if(!b)throw Error("Filesystem has not been initialized.");var f=function(a){a.isFile?a.remove(c,d):a.isDirectory&&a.removeRecursively(c,d)};a.isFile||a.isDirectory?f(a):l(f,a)};a.prototype.cd=function(a,d,h){if(!b)throw Error("Filesystem has not been initialized.");a.isDirectory?
(c=a,d&&d(c)):(a=k(a),l(function(a){if(a.isDirectory)c=a,d&&d(c);else if(a=Error("Path was not a directory."),h)h(a);else throw a;},a))};a.prototype.cp=function(a,b,c,d,g){p.bind(this,a,b,c,d,g)()};a.prototype.write=function(a,d,h,f){if(!b)throw Error("Filesystem has not been initialized.");var g=function(a){a.createWriter(function(b){b.onerror=f;if(d.append)b.onwriteend=function(){h&&h(a,this)},b.seek(b.length);else{var c=!1;b.onwriteend=function(){c?h&&h(a,this):(c=!0,this.truncate(this.position))}}if(d.data.__proto__==
ArrayBuffer.prototype)d.data=new Uint8Array(d.data);var e=new Blob([d.data],d.type?{type:d.type}:{});b.write(e)},f)};a.isFile?g(a):i(a)?l(g,a):c.getFile(a,{create:!0,exclusive:!1},g,f)};return a};

/////////////////
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