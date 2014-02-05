//
// NS:UI
// REQUIRE:CORE,TEMPLATE,DOM,EVENT,UTIL
// NEED:NONE
//

//
// Basic UI require ui.css
//

__UI=SYSLIB.namespace("syslib.ui",["syslib.template","syslib.dom","syslib.event","syslib.util"],function(){
  __Template.preprocess.push(__UI.preprocess);
  __Template.postprocess.push(__UI.postprocess);
  SYSLIB.settings.set('default_img_loading_ani',__Template.build(function(){/*
    <div class="loading_ani_spinner_balls">
      <div class="loading_ani_spinner_balls_dot1"></div>
      <div class="loading_ani_spinner_balls_dot2"></div>
    </div>
  */}));
});
__UI.list={};
SYSLIB.settings.set('ui_overwrite',false);
__UI.add=function(gtype,type,processfunction){
  if(!__UI.list[gtype]){
    __UI.list[gtype]={}
  }
  if(__UI.list[gtype][type]&&!SYSLIB.settings.ui_overwrite){
    __Error.log(1,"UI : can't overwrite existing ui with type "+gtype+"."+type+" ! Please set ui_overwrite to true.");
    return;
  }
  __UI.list[gtype][type]=processfunction;
}
__UI.tmplist=[];
__UI.preprocess=function(html){
  html=html.replace(/<ui:([a-zA-Z0-9\_\-]*)([^>]*)>/g, function (match,gtype,attrs) {
      var id=__Util.token(),
          type=0,
          orgid=0;
      if(attrs){
        var attr=attrs.match(/type=[\'\"]([\s\S]*?)[\'\"]/);
        if(attr){
          type=attr[1];
        }
        attr=attrs.match(/id=[\'\"]([\s\S]*?)[\'\"]/);
        if(attr){
          orgid=attr[1];
        }
      }
      __UI.tmplist.push({
        id:id,
        orgid:orgid,
        gtype:gtype,
        type:(type)?type:'standard'
      })
      return "<div id='"+id+"'"+attrs+">";
  });
  html=html.replace(/<\/ui>/g,"</div>");
  return html;
}
//if not using .insertTo(element) with __Template(f,vals) you must call this manualy
__UI.postprocess=function(element){
  while(__UI.tmplist.length){
    var data=__UI.tmplist.pop();
    var processElement=_f("#"+data.id);
    if(data.orgid){
      processElement.id=data.orgid;
    }
    if(__UI.list[data.gtype]&&__UI.list[data.gtype][data.type]){
      __UI.list[data.gtype][data.type](processElement);
    }else{
       __Error.log(2,"UI : can't process  element:"+data.id+" ! ui type: "+gtype+"."+type+" no found !");
    }
  }
}
__UI.add('btn','standard',function(element){
  element.add("SYSUI_btn_standard");
})
__UI.add('checkbox','standard',function(element){
  element.add("SYSUI_checkbox_standard");
  var checked=element.getAttr("checked");
  checked=(checked&&checked!="false")?true:false;
  var disabled=element.getAttr("disabled");
  disabled=(disabled&&disabled!="false")?true:false;
  element.disabled=disabled;
  element.checked=checked;
  var checks_box=document.createElement('div');
  checks_box.className="checks_box";
  var checks_text=document.createElement('div');
  checks_text.className="checks_text";
  var texts={
    normal:element.innerHTML,
    checked:(element.getAttr("checked_text"))?element.getAttr("checked_text"):element.innerHTML,
    disabled:(element.getAttr("disabled_text"))?element.getAttr("disabled_text"):0
  }
  element.texts=texts;
  if(checked){
    checks_text.innerHTML=texts.checked;
    element.add("checks_checked");
  }else{
    checks_text.innerHTML=texts.normal;
  }
  if(disabled){
    if(texts.disabled){
      checks_text.innerHTML=texts.disabled;
    }
    element.add("checks_disabled");
  }
  element.innerHTML="";
  element.appendChild(checks_box);
  element.appendChild(checks_text);
  element.addListener("click",function(){
    if(this.disabled){
      return;
    }
    if(this.checked){
      this.checked=false;
      this.setAttr("checked",false);
      this.remove("checks_checked");
      checks_text.innerHTML=this.texts.normal;
      __Event.emit("unchecked",{
        element:this
      },this)
    }else{
      this.checked=true;
      this.setAttr("checked",true);
      this.add("checks_checked");
      checks_text.innerHTML=this.texts.checked;
      __Event.emit("checked",{
        element:this
      },this)
    }
  })
  element.disable=function(){
    this.disabled=true;
    this.setAttr("disabled",true);
    this.add("checks_disabled");
    this.orgtext=this.innerHTML;
    if(this.texts.disabled){
      checks_text.innerHTML=this.texts.disabled;
    }
  }
  element.addListener("disable",element.disable);
  element.enable=function(){
    this.disabled=false;
    this.setAttr("disabled",false);
    this.remove("checks_disabled");
    if(this.orgtext){
      checks_text.innerHTML=this.orgtext;
    }
  }
  element.addListener("enable",element.enable);
})
__UI_radiolist={}
__UI.add('radio','standard',function(element){
  element.add("SYSUI_radio_standard");
  var checked=element.getAttr("checked");
  checked=(checked&&checked!="false")?true:false;
  var disabled=element.getAttr("disabled");
  disabled=(disabled&&disabled!="false")?true:false;
  var group=element.getAttr("group");
  group=(group)?group:0;
  var value=element.getAttr("value");
  value=(value)?value:0;
  element.value=value;
  element.group=group;
  if(group){
    if(!__UI_radiolist[group]){
      __UI_radiolist[group]={
        value:0,
        list:[]
      };
    }
    __UI_radiolist[group].list.push(element);
  }
  element.disabled=disabled;
  element.checked=checked;
  var checks_box=document.createElement('div');
  checks_box.className="checks_box";
  var checks_text=document.createElement('div');
  checks_text.className="checks_text";
  var texts={
    normal:element.innerHTML,
    checked:(element.getAttr("checked_text"))?element.getAttr("checked_text"):element.innerHTML,
    disabled:(element.getAttr("disabled_text"))?element.getAttr("disabled_text"):0
  }
  element.texts=texts;
  if(checked){
    checks_text.innerHTML=texts.checked;
    element.add("checks_checked");
  }else{
    checks_text.innerHTML=texts.normal;
  }
  if(disabled){
    if(texts.disabled){
      checks_text.innerHTML=texts.disabled;
    }
    element.add("checks_disabled");
  }
  element.innerHTML="";
  element.appendChild(checks_box);
  element.appendChild(checks_text);
  element.checks_text=checks_text;
  element.addListener("click",function(){
    if(this.disabled){
      return;
    }
    this.checked=true;
    this.setAttr("checked",true);
    this.add("checks_checked");
    checks_text.innerHTML=this.texts.checked;
    if(this.group&&__UI_radiolist[this.group]){
      __UI_radiolist[this.group].value=this.value;
      __Event.emit("radio-"+this.group+"-change",{
        value:this.value,
        element:this
      })
      var list=__UI_radiolist[this.group].list;
      for(var i=0;i<list.length;i++){
        if(list[i]!=this){
          list[i].checked=false;
          list[i].setAttr("checked",false);
          list[i].remove("checks_checked");
          list[i].checks_text.innerHTML=list[i].texts.normal;
        }
      }
    }
  })
  element.disable=function(){
    this.disabled=true;
    this.setAttr("disabled",true);
    this.add("checks_disabled");
    this.orgtext=this.innerHTML;
    if(this.texts.disabled){
      checks_text.innerHTML=this.texts.disabled;
    }
  }
  element.addListener("disable",element.disable);
  element.enable=function(){
    this.disabled=false;
    this.setAttr("disabled",false);
    this.remove("checks_disabled");
    if(this.orgtext){
      checks_text.innerHTML=this.orgtext;
    }
  }
  element.addListener("enable",element.enable);
})
__UI.add('img','standard',function(element){
  element.add("SYSUI_img_standard");
  var picture=element.getAttr("src");
  picture=(picture)?picture:"";
  var loading_ani=element.innerHTML;
  loading_ani=(loading_ani)?loading_ani:SYSLIB.settings.default_img_loading_ani;
  element.innerHTML="";
  var img_box=document.createElement('img');
  img_box.className="img_box";
  img_box.src=picture;
  img_box.onload=function(){
    cover_box.style.opacity=0;
    setTimeout(function(){
      cover_box.style.display="none";
      setTimeout(function(){
        img_box.style.display="block";
        setTimeout(function(){
          img_box.style.opacity=1;
        },20)
      },20)
    },300)
  }
  var cover_box=document.createElement('div');
  cover_box.className="cover_box";
  cover_box.innerHTML=loading_ani;
  element.appendChild(img_box);
  element.appendChild(cover_box);
})
