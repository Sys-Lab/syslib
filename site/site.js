__Model.add("main",function(){
	/*
		<div id="error_notice"></div>
		<a id="github" target="_blank" href="https://github.com/Sys-Lab/syslib">Fork me</a>
		<div id="logo" style="height:%@300%px;font-size:%@180%px;">
			SYSLIB
			<div>Just another opensource javascript libary</div>
		</div>
		<div id="applogo" style="top: %@262%px;right:%&310%px;">FOR HTML5 APP</div>
		<div id="not_doneyet">It's Not done yet ! We are under Heavy DEV !!</div>
		<div id="dowloadbtn" style="top: %@310%px;">Download Now</div>
		<div id="features">
			<div id="features_0">
				<li>The app is made up with mutiple models</li>
				<li>Each model has it's own statue</li>
				<li>So views/pages are just models with different statues!</li>
			</div>
			<div id="features_1">
				<div>Features</div>
				<ul>
					<li>Awsome Model/Statue System</li>
					<li>Build in Namespeace support</li>
					<li>Basic Css selector</li>
					<li>Basic Event listener/emiter</li>
					<li>Ajax Socket Geolocation Vilade</li>
					<li>and Many other small functions</li>
				</ul>
			</div>
		</div>
		<div id="pre_build">
			<div>Download Pre-Build Compressed Packs <span class="ver_small">Build 2014031947</span></div>
			<div id="pre_build_dl">
				<a target="_blank" href="dl/full/SYSLIB.min.js">
					<div>Full</div>
					<div class="dl_des">With everything ! ( 45 KB )</div>
				</a>
				<a target="_blank" href="dl/standard/SYSLIB.min.js">
					<div>Standard</div>
					<div class="dl_des">Model inside !( 21 KB )</div>
				</a>
				<a target="_blank" href="dl/mini/SYSLIB.min.js">
					<div>Mini</div>
					<div class="dl_des">Dom & Event ( 17 KB )</div>
				</a>
			</div>
		</div>
		<div id="Builders">
			<div id="Buildonbr">Build on your browser</div>
			<div id="Buildwithnode" style="left: %&1050%px;">or Build with Nodejs</div>
			<div id="Builder">
				<div id="Build_on_browser">
					<div id="Builder_notice">Choose you want:<span>The builder will take care of dependencies.</span></div>
					<div id="components"></div>
					<div id="components_des"></div>
					<div id="components_go">Build</div>
					<div id="only_Build_with_node"></div>
				</div>
				<div id="Build_with_nodeJs" style="top: %@928%px;width: %&400%px;">
					Just run
					<div class="code">git https://github.com/Sys-Lab/syslib.git</div>
					Then run
					<div class="code">node build.js</div>
					Follow instructions.			
					Good Luck
				</div>
			</div>
		</div>
		<div id="footer">By <a target="_blank" href="https://github.com/scientihark/">Scientihark</a></div>
	*/
},0,function(){
	var build_lock=0;
	var List={
		core:{
			dependencies:0,
			des:"Basic components . Every component depended on this.",
			features:"Namespeace,Include,Exclude,Error"
		},dom:{
			dependencies:['core','math'],
			des:"Provide dom operations.can bind event listeners when act with Event.",
			features:"CSS selector,class manage,dom search"
		},event:{
			dependencies:['core','util'],
			des:"Bind event listener and build custom events",
			features:"Event for both dom and custom"
		},cookies:{
			dependencies:['core'],
			des:"Basic cookies manage.",
			features:"Read write cookies"
		},ajax:{
			dependencies:['core'],
			des:"Basic ajax support.",
			features:"POST,GET,Load"
		},file:{
			dependencies:['core'],
			des:"Basic Html5 File API support.",
			features:"Read Write comes simple, need rewrite.temp removed from full pack."
		},geo:{
			dependencies:['core'],
			des:"get Geolocation with Html5 API and fallback with Baidu.",
			features:"Geolocation"
		},math:{
			dependencies:['core'],
			des:"Basic math support.",
			features:"rand,has"
		},model:{
			dependencies:['core','template'],
			des:"Awsome model/statue system.",
			features:"model build with template,statue change"
		},sound:{
			dependencies:['core'],
			des:"Basic Html5 sound support.",
			features:"add,play"
		},template:{
			dependencies:['core'],
			des:"Basic template support.",
			features:"auto width/height,language file"
		},ui:{
			dependencies:['core','template','dom','event','util'],
			des:"UI engine support.",
			features:"basic UIs ,can be extended. <br/>MUST INCLUDE ui.css !!!"
		},util:{
			dependencies:['core'],
			des:"some utils",
			features:"ua,object clone ..."
		},vilade:{
			dependencies:['core'],
			des:"staring/value vilade",
			features:"Chinese ID card and Phone vilade"
		},socket:{
			dependencies:['core'],
			des:"socket and encryption,under DEV",
			features:"come back later"
		}
	},
	mom=_f("#components");
	for(var component in List){
		var newnode=__Dom.nodeparser(document.createElement('div'));
		newnode.datas=List[component];
		newnode.name=component;
		if(component=="core"){
			newnode.selected=1;
			newnode.required=1;
			newnode.add("selected");
		}else{
			newnode.selected=0;
			newnode.required=0;
		}
		newnode.innerHTML=component;
		newnode.id="component_"+component;
		mom.appendChild(newnode);
		newnode.addListener("click",function(){
			if(this.selected){
				if(this.required>0){
					return;
				}
				this.required=0;
				this.selected=0;
				_c(this).remove("selected");
				if(this.datas&&this.datas.dependencies){
					for(var i=0;i<this.datas.dependencies.length;i++){
						var node=_f("#component_"+this.datas.dependencies[i]);
						node.required--;
						if(node.required<=0){
							node.required=0;
							node.selected=0;
							node.remove("selected");
						}
					}
				}
			}else{
				this.selected=1;
				_c(this).add("selected");
				if(this.datas&&this.datas.dependencies){
					for(var i=0;i<this.datas.dependencies.length;i++){
						var node=_f("#component_"+this.datas.dependencies[i]);
						node.selected=1;
						node.required++;
						node.add("selected");
					}
				}
			}
		},false)
		newnode.addListener("mouseover",function(){
			_f("#components_des").innerHTML=_template(function(){
				/*
					<div id="components_des_name">%$1%</div>
					<div id="components_des_dep">Dependencies: %$2%</div>
					<div id="components_des_des">%$3%</div>
					<div id="components_des_features">
						<div id="components_des_features_title">features: </div>
						<div id="components_des_features_inner">%$4%</div>
					</div>
				*/
			},[this.innerHTML.toUpperCase(),
				((this.datas.dependencies)?(this.datas.dependencies.join(",").toUpperCase()):"None"),
				this.datas.des,this.datas.features])
		},false)
	}
	_f("#Buildwithnode").addListener("mouseover",function(){
			_f("#Build_with_nodeJs").style.display="block";
			setTimeout(function(){
				_f("#Build_with_nodeJs").style.opacity=1;
			},300)
	},false)
	_f("#Build_with_nodeJs").addListener("mouseout",function(e){
			if(__Util.checkFather(this,e)){
				_f("#Build_with_nodeJs").style.opacity=0;
				setTimeout(function(){
					_f("#Build_with_nodeJs").style.display="none";
				},300)
			}
	},false)
	_f("#dowloadbtn").addListener("click",function(){
			document.body.scrollTop=window.innerHeight;
	},false)
	_f("#components_go").addListener("click",function(){
			if(build_lock){
				return;
			}
			var list=_f("#components").childNodes,
				builddata="";
			for(var i=0;i<list.length;i++){
				if(list[i].tagName&&list[i].selected){	
					var data=__Ajax.getfile("src/"+list[i].name+".js");
					builddata=builddata+"\n"+data;
				}
			}
			__File.file.init({persistent: true, size: 200*1024 * 1024}, function(fs) {
				var eee=function(){
					__File.file.write('SYSLIB.build.js', {data: builddata, type: 'text/javascript'},function(fileEntry) {
							window.open(fileEntry.toURL());
					},function(){
							alert("Build Fail");
					});
				}
				eee();
			}, function(){
				alert("Build Fail");
			});
	},false)
	var cant_build=function(){
		_f("#error_notice").add("error_notice_show");
		build_lock=1;
		_f("#Buildonbr").innerHTML="Build with nodeJs";
		_f("#Buildwithnode").style.display="none";
		_f("#only_Build_with_node").innerHTML=_f("#Build_with_nodeJs").innerHTML;
		_f("#only_Build_with_node").style.display="block";
		setTimeout(function(){
			_f("#only_Build_with_node").style.opacity=1;
		},300);
	}
	if(window.location.protocol=="file:"){
		_f("#error_notice").innerHTML="Please View This Page Under Webservers <br/>or go to <a href='http://sys-lab.github.io/syslib/'>Http://sys-lab.github.io/syslib/</a>"
		_f("#Builder_notice").innerHTML="You can only build With nodeJs since you are not viewing this page under webservers. Please view this page under webservers or go to <a href='http://sys-lab.github.io/syslib/'>Http://sys-lab.github.io/syslib/</a> for browser-side building!";
		setTimeout(cant_build,500);
	}
	if(!window.File || !window.FileReader || !window.FileList || !window.Blob){
		_f("#error_notice").innerHTML="Please View This Page Under Modern Browsers<br/><a href='http://sys-lab.github.io/syslib/'>Click here to download Chrome</a>"
		_f("#Builder_notice").innerHTML="You can only build With nodeJs since you are using an old/unsupported browser. Please view this page under modern browsers for browser-side building! <a href='http://sys-lab.github.io/syslib/'>Click here to download Chrome</a>.";
		setTimeout(cant_build,500);
	}
})