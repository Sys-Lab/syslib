////////////////////////load file////////////////////////////////
var fs = require("fs");

function readfile(filepath){
	var data=fs.readFileSync(filepath);
	return data.toString();
}
function savefile(filepath,data){
	fs.writeFileSync(filepath,data);
	return;
}
///////////////////////get arg//////////////////////////////
var clc = require('cli-color'),
	spawn = require( 'child_process' ).spawn,
	exec = require( 'child_process' ).exec;
var clcerror = function(e){
	console.log(clc.bgRedBright.black(" ERROR! ")+" "+e);
}
var clcwarn = function(e){
	console.log(clc.bgMagentaBright.black("  WARN  ")+" "+e);
}
var clcnotice = function(e){
	console.log(clc.bgCyanBright.black(" NOTICE ")+" "+e);
}
var clcallright = function(e){
	console.log(clc.bgGreenBright.black("   OK   ")+" "+e);
}
var argv = require('optimist').argv;
if((!argv)||argv.help){
	console.log("\nSYSLIB Build Tool.\t\t\t\tBuild 2014012001.\n");
	console.log("Usage: node build.js "+clc.yellowBright("[options]"));
	console.log("");
	console.log("Options:");
	console.log("\t--compress\t\tcompress with uglyfy");
	console.log("\t--no_notice\t\tremove debug notice in code for smaller file size");
	console.log("\t--no_warning\t\tremove warning,debug notice in code.");
	console.log("\t--no_error\t\tremove error,warning,debug notice in code.");
	console.log("\t--compress\t\tcompress with uglyfy");
	console.log("");
	console.log("\t--full\t\tbuild all compoments [ Big ] [no socket]");
	console.log("\t--core\t\tinclude Core only");
	console.log("\t--micro\t\tinclude core + Dom,MATH");
	console.log("\t--mini\t\tinclude micro + Event");
	console.log("\t--standard\t\tinclude mini + Model,Template");
	console.log("");
	console.log("\t--ajax\t\t\tinclude Ajax");
	console.log("\t--cookies\t\tinclude Cookies");
	console.log("\t--dom\t\t\tinclude Dom");
	console.log("\t--event\t\t\tinclude Event");
	console.log("\t--file\t\t\tinclude File");
	console.log("\t--geo\t\t\tinclude Geo");
	console.log("\t--math\t\t\tinclude Math");
	console.log("\t--model\t\t\tinclude Model");
	console.log("\t--socket\t\tinclude Socket [bugy now]");
	console.log("\t--sound\t\t\tinclude Sound");
	console.log("\t--template\t\tinclude Template");
	console.log("\t--ui\t\tinclude UI");
	console.log("\t--util\t\t\tinclude Util");
	console.log("\t--vilade\t\tinclude Vilade");
	console.log("");
	console.log("");
	return 0;
}
//try{
	exec("mkdir build");
	var buildlist={
		core:0,
		math:0,
		dom:0,
		event:0,
		template:0,
		ui:0,
		model:0,
		ajax:0,
		vilade:0,
		cookies:0,
		file:0,
		geo:0,
		sound:0,
		socket:0,
		util:0
	}
	var noneargv=0;
	if(argv.full){
		for(var i in buildlist){
			if(i!="socket"){
				buildlist[i]=1;
			}
		}
		noneargv=1;
	}else{
		if(argv.standard){
			buildlist.model=1;
			buildlist.template=1;
			noneargv=1;
		}
		if(argv.standard||argv.mini){
			buildlist.event=1;
			noneargv=1;
		}
		if(argv.standard||argv.mini||argv.micro){
			buildlist.dom=1;
			buildlist.math=1;
			noneargv=1;
		}
		if(argv.core){
			noneargv=1;
		}
		buildlist.core=1;
	}
	if(argv.ajax){
		buildlist.ajax=1;
		noneargv=1;
	}
	if(argv.cookies){
		buildlist.cookies=1;
		noneargv=1;
	}
	if(argv.dom){
		buildlist.dom=1;
		noneargv=1;
	}
	if(argv.event){
		buildlist.event=1;
		noneargv=1;
	}
	if(argv.file){
		buildlist.file=1;
		noneargv=1;
	}
	if(argv.geo){
		buildlist.geo=1;
		noneargv=1;
	}
	if(argv.math){
		buildlist.math=1;
		noneargv=1;
	}
	if(argv.model){
		buildlist.model=1;
		noneargv=1;
	}
	if(argv.socket){
		buildlist.socket=1;
		noneargv=1;
	}
	if(argv.sound){
		buildlist.sound=1;
		noneargv=1;
	}
	if(argv.template){
		buildlist.template=1;
		noneargv=1;
	}
	if(argv.ui){
		buildlist.ui=1;
		noneargv=1;
	}
	if(argv.util){
		buildlist.util=1;
		noneargv=1;
	}
	if(argv.vilade){
		buildlist.vilade=1;
		noneargv=1;
	}
	if(!noneargv){
		for(var i in buildlist){
			if(i!="socket"){
				buildlist[i]=1;
			}
		}
	}
	var toloadlist=[];
	for(var i in buildlist){
		if(buildlist[i]){
			toloadlist.push(i)
		}
	}
	var builddata="";
	clcnotice("Start Building ...");
	var build=function(){
		if(!toloadlist||!toloadlist.length){
			return;
		}
		var nowfile=toloadlist.shift(),
			data=readfile("src/"+nowfile+".js").replace(/^\ufeff/i, "").replace(/^\ufffe/i, "");
		clcnotice("Building :"+nowfile.toUpperCase());
		if(data){
			var tmp=data.match(/REQUIRE\:([\s\S]*?)\r\n/);
			if(tmp[1]){
				tmp=tmp[1].split(",");
				for(var i=0;i<tmp.length;i++){
					var tmp2=(tmp[i]).toLowerCase();
					if(tmp2!="none"&&!buildlist[tmp2]){
						toloadlist.push(tmp2);
					}
				}
			}
			if(argv.no_error){
				data=data.replace(/\_\_Error\.log\(2\,[\s\S]*?\)\;/g,"");
			}
			if(argv.no_error||argv.no_warning){
				data=data.replace(/\_\_Error\.log\(1\,[\s\S]*?\)\;/g,"");
			}
			if(argv.no_error||argv.no_warning||argv.no_notice){
				data=data.replace(/\_\_Error\.log\(0\,[\s\S]*?\)\;/g,"");

			}
			builddata=builddata+"\n"+data;
			build();
		}else{
			clcerror("Read File Error ! Please Check your repo.");
		}
	}
	build();
	savefile("build/SYSLIB.js",builddata);
	clcallright("Build ok ...");
	if(argv.compress){
		clcnotice("Compressing ...");
		var UglifyJS = require("uglify-js");
		builddata =UglifyJS.minify(builddata, {
			fromString: true
		});
		savefile("build/SYSLIB.min.js",builddata.code);
		clcallright("Compress ok ...");
	}
	clcallright("All done ...");
	// var mdata=readfile(argv.m);
	// var name=argv.f;
	// name=(argv.n)?argv.n:name;
	// var file2=(argv.f).split(".");
	// var orgext=(file2.pop()).toUpperCase();
	// var file3=file2.join(".")+".svg";
	// var coned=function(){
	// 	fs.stat(file3, function (err, stat) {
	// 		  if (err) {
	// 		  	clcerror("Convert Error ! Please Check Your Font File.");
	// 			return 1;
	// 		  }
	// 		  var fdata=readfile(file3);
	// 		  if(fdata&&mdata){
	// 				savefile('output/'+name+".svg",min_svg(fdata,mdata,name));
	// 				fName_to_conv='output/'+name+".svg";
	// 				if(!argv.no_ttf){
	// 					fList_to_conv.push("ttf");
	// 				}
	// 				if(!argv.no_eot){
	// 					fList_to_conv.push("eot");
	// 				}
	// 				if(!argv.no_woff){
	// 					fList_to_conv.push("woff");
	// 				}
	// 				startconv();
	// 		  }else{
	// 				clcwarn("File Is Empty ! Abort ...")
	// 		  }
	// 	});
	// }
	// fName_to_conv=0;
	// fList_to_conv=[];
	// var cleaning=function(){
	// 	if(!argv.no_zip){
	// 			clcnotice("Cleaning ...");
	// 			if(!argv.no_ttf){
	// 				exec("del output/"+name+".ttf");
	// 			}
	// 			if(!argv.no_eot){
	// 				exec("del output/"+name+".eot");
	// 				exec("del output/"+name+".afm");
	// 			}
	// 			if(!argv.no_css){
	// 				exec("del output/"+name+".css");
	// 			}
	// 			if(!argv.no_svg){
	// 				exec("del output/"+name+".svg");
	// 			}
	// 			if(!argv.no_woff){
	// 				exec("del output/"+name+".woff");
	// 			}
	// 			clcallright("Cleaning done.");
	// 	}
	// 	clcallright("All done.");
	// 	return;
	// }
	// var packing=function(){
	// 	var tt=[ 'a','output/'+name+'.zip'] ;
	// 	if(!argv.no_woff){
	// 		tt.push('output/'+name+'.woff');
	// 	}
	// 	if(!argv.no_ttf){
	// 		tt.push('output/'+name+'.ttf');
	// 	}
	// 	if(!argv.no_svg){
	// 		tt.push('output/'+name+'.svg');
	// 	}
	// 	if(!argv.no_eot){
	// 		tt.push('output/'+name+'.eot');
	// 		tt.push('output/'+name+'.afm');
	// 	}
	// 	if(!argv.no_css){
	// 		tt.push('output/'+name+'.css');
	// 	}
	// 	packer = spawn( 'win32/7z', tt);
	// 	packer.stdout.on('data', function (data) { 
	// 		clcnotice("PACKER: "+data);
	// 	});
	// 	packer.on( 'exit', function () { if(!ERR){
	// 		clcallright("Packing done.");cleaning();
	//  	}else{clcerror("Packing error");return;}} );
	// 	var ERR=0;
	// 	packer.stderr.on('data', function (data) { clcerror("PACKER: "+data);ERR=1; });
	// }
	// var startconv=function(list){
	// 	if(!fList_to_conv||!fList_to_conv.length){
	// 		clcallright("Conv done.");
	// 		if(!argv.no_css){
	// 			clcnotice("Generate CSS ...");
	// 			var opt="@font-face {\n\tfont-family: '"+name+"';\n\t";
	// 			if(!argv.no_eot){
	// 				opt=opt+"src: url('"+name+".eot');\n\t";
	// 			}
	// 			opt=opt+"src: ";
	// 			var tt=[];
	// 			if(!argv.no_woff){
	// 				tt.push("url('"+name+".woff') format('woff')");
	// 			}
	// 			if(!argv.no_ttf){
	// 				tt.push("url('"+name+".ttf') format('truetype')");
	// 			}
	// 			if(!argv.no_svg){
	// 				tt.push("url('"+name+".svg#"+name+"') format('svg')");
	// 			}
	// 			if(!argv.no_eot){
	// 				tt.push("url('"+name+".eot?#iefix') format('embedded-opentype')");
	// 			}
	// 			var cssDATA=opt+(tt.join(","))+";\n}";
	// 			savefile("output/"+name+".css",cssDATA);
	// 			clcallright("CSS done.");
	// 		}
	// 		if(!argv.no_zip){
	// 			clcnotice("Packing ...");
	// 			packing();
	// 		}else{
	// 			cleaning();
	// 		}
	// 		return;
	// 	}
	// 	var nlist=fList_to_conv.shift();
	// 	clcnotice("Output As "+nlist.toUpperCase()+" ...");
	// 	var confont = spawn( 'win32/fontforge', [ "-script" ,"res/gen"+nlist+".pe",fName_to_conv] );
	// 	confont.on( 'exit',startconv );
	// }
	// clcnotice("File is "+orgext);
	// if(orgext=="SVG"){
	// 	coned();
		
	// 	return;
	// }
	// clcnotice("Converting To SVG ...");
	// var consvg = spawn( 'win32/fontforge', [ "-script" ,"res/gensvg.pe",argv.f] );
	// consvg.on( 'exit',coned );
//}catch(e){
	//clcerror("Read File Error !\n"+e);
//}


