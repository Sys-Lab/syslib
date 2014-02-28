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
       __Error.log(2,"UI : can't process  element:"+data.id+" ! ui type: "+data.gtype+"."+data.type+" no found !");
    }
  }
}
__UI.add('btn','standard',function(element){
  element.add("SYSUI_btn_standard");
  var disabled=element.getAttr("disabled");
  disabled=(disabled&&disabled!="false")?true:false;
  if(disabled){
    element.add("btn_disabled");
  }
  element.disable=function(){
    this.disabled=true;
    this.setAttr("disabled",true);
    this.add("btn_disabled");
  }
  element.addListener("disable",element.disable);
  element.enable=function(){
    this.disabled=false;
    this.setAttr("disabled",false);
    this.remove("btn_disabled");
  }
  element.addListener("enable",element.enable);
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
__UI.add('select','standard',function(element){
  element.add("SYSUI_select_standard");
  var disabled=element.getAttr("disabled");
  disabled=(disabled&&disabled!="false")?true:false;
  element.disabled=disabled;
  var value=element.getAttr("value");
  value=(value)?value:0;
  var icolor=element.getAttr("icolor");
  icolor=(icolor)?icolor:'#a3cd3d';
  var default_t=element.getAttr("default");
  default_t=(default_t)?default_t:'-';

  var select_top=document.createElement('div');
  select_top.className="select_top";
  var select_box=document.createElement('div');
  select_box.className="select_box";
  var select_bar=document.createElement('div');
  select_bar.className="select_bar";

  var select_text=document.createElement('div');
  select_text.className="select_text";
  var select_icon=document.createElement('span');
  select_icon.className="select_icon";


  select_icon.icon_down='<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="11" height="12" viewBox="0 0 11 12"><g></g><path d="M10.788 4.714q0 0.355-0.248 0.603l-4.359 4.359q-0.254 0.254-0.609 0.254-0.362 0-0.603-0.254l-4.359-4.359q-0.254-0.241-0.254-0.603 0-0.355 0.254-0.609l0.496-0.502q0.261-0.248 0.609-0.248 0.355 0 0.603 0.248l3.254 3.254 3.254-3.254q0.248-0.248 0.603-0.248 0.348 0 0.609 0.248l0.502 0.502q0.248 0.261 0.248 0.609z" fill="'+icolor+'" /></svg>'
  select_icon.icon_up='<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="11" height="12" viewBox="0 0 11 12"><g></g><path d="M10.788 8.143q0 0.355-0.248 0.603l-0.502 0.502q-0.254 0.254-0.609 0.254-0.362 0-0.603-0.254l-3.254-3.248-3.254 3.248q-0.241 0.254-0.603 0.254t-0.603-0.254l-0.502-0.502q-0.254-0.241-0.254-0.603 0-0.355 0.254-0.609l4.359-4.359q0.248-0.248 0.603-0.248 0.348 0 0.609 0.248l4.353 4.359q0.254 0.254 0.254 0.609z" fill="'+icolor+'" /></svg>';
  
  select_icon.innerHTML=select_icon.icon_down;

  select_text.innerHTML=default_t;
  if(disabled){
    element.add("select_disabled");
  }

  var dlist=[],
      childs=element.childNodes;
  for(var i=0;i<childs.length;i++){
    if(childs[i].tagName){
      var value=childs[i].value;
      value=(value)?value:childs[i].innerHTML;
      dlist.push({
        text:childs[i].innerHTML,
        value:value
      });
    }
  }
  element.innerHTML="";
  element.appendChild(select_top);
  element.appendChild(select_box);
  element.appendChild(select_bar);
  select_top.appendChild(select_text);
  select_top.appendChild(select_icon);
  var fixlock=0;
  element.addListener("click",function(){
    if(this.disabled||fixlock){
      fixlock=0;
      return;
    }
    if(_c(select_box).has("open")){
      _c(select_box).remove("open");
      select_icon.innerHTML=select_icon.icon_down;
      setTimeout(function(){
        select_box.style.display="none";
      },200)
    }else{
      select_box.style.top=(element.offsetTop+34)+"px";
      select_box.style.left=(element.offsetLeft+7)+"px";
      select_box.style.width=(element.offsetWidth-16)+"px";
      select_box.style.display="block";
      setTimeout(function(){
        _c(select_box).add("open");
      },50)
      select_icon.innerHTML=select_icon.icon_up;
    }
  })
  element.parseOptions=function(list){
    element.optionList=list;
    select_box.innerHTML="";
    for(var i=0;i<element.optionList.length;i++){
      element.addOption(element.optionList[i]);
    }
  }
  element.addOption=function(data){
    var onode=__Dom.nodeparser(document.createElement('div'));
    onode.value=data.value;
    onode.innerHTML=data.text;
    select_box.appendChild(onode);
    onode.addListener("click",element.selectOption)
  }
  element.removeOption=function(num){
    var node=select_box.childNodes[num];
    if(node&&node.tagName){
      select_box.removeChild(node);
    }
  }
  element.selectOption=function(){
    var value=this.value,
        text=this.innerHTML;
    fixlock=1;
    select_text.style.minWidth=select_text.offsetWidth+"px";
    select_text.innerHTML=text;
    element.value=value;
    __Event.emit("change",{
      value:value
    },element);
    _c(select_box).remove("open");
    select_icon.innerHTML=select_icon.icon_down;
    setTimeout(function(){
      select_box.style.display="none";
    },200)
  }
  element.disable=function(){
    this.disabled=true;
    this.setAttr("disabled",true);
    this.add("select_disabled");
  }
  element.addListener("disable",element.disable);
  element.enable=function(){
    this.disabled=false;
    this.setAttr("disabled",false);
    this.remove("select_disabled");
  }
  element.parseOptions(dlist);
  element.addListener("enable",element.enable);
})
