//SYSLIB Plugin : shareto
//ver 20140208.01
//


var __Shareto=SYSLIB.namespace("syslib.shareto");
__Shareto.sharelist={
	"baidu_cang":function(ipt){
		
		return ('http://cang.baidu.com/do/add?it='+ encodeURIComponent((ipt.title).substring(0, 76))+ '&iu=' + encodeURIComponent(ipt.url)+ '&fr=ien#nw=1');
	},
	"qq_shuqian":function(ipt){
		
		return ('http://shuqian.qq.com/post?from=3&title='+ encodeURIComponent((ipt.title))+ '&uri=' + encodeURIComponent(ipt.url)+ '&jumpback=2&noui=1');
	},
	"douban_recommand":function(ipt){
		var $opic=""
		if(ipt.pic){
			$opic='&image='+encodeURIComponent((ipt.pic));
		}
		return ('http://www.douban.com/share/service?bm=1&href='+ encodeURIComponent(ipt.url)+ '&title=' + encodeURIComponent((ipt.title))+ '&sel='+encodeURIComponent((ipt.data))+'&updated=&name=0'+$opic);
	},
	"qq_zone":function(ipt){
		var $odata=""
		if(ipt.data){
			$odata='&summary='+encodeURIComponent((ipt.data));
		}
		var $opic=""
		if(ipt.pic){
			$opic='&pics='+encodeURIComponent((ipt.pic));
		}
		
		return ('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+ encodeURIComponent(ipt.url)+ '&title=' + encodeURIComponent((ipt.title))+ $odata+$opic);
	},
	"weibo":function(ipt){
		var $oappkey="2516674591"
		if(ipt.appkey){
			$oappkey=(ipt.appkey);
		}
		var $osource="marliang.com"
		if(ipt.source){
			$osource=encodeURIComponent((ipt.source));
		}
		var $ouid=""
		if(ipt.uid){
			$ouid=encodeURIComponent((ipt.uid));
		}
		
		return ('http://service.weibo.com/share/share.php?appkey='+$oappkey+'&title='+ encodeURIComponent((ipt.title))+ '&url='+encodeURIComponent(ipt.url))+'&source='+$osource+'&retcode=0&ralateUid='+$ouid;
	},
	"renren":function(ipt){
		var $opic='&images=';
		if(ipt.pic){
			$opic='&images='+encodeURIComponent((ipt.pic));
		}
		var $odes="&description="
		if(ipt.data){
			$odes="&description="+encodeURIComponent((ipt.data));
		}
		return ('http://widget.renren.com/dialog/share?resourceUrl='+encodeURIComponent(ipt.url))+'&title='+ encodeURIComponent((ipt.title))+$opic+$odes;
	},
	"tencent_weibo":function(ipt){
		var $opic='';
		if(ipt.pic){
			$opic=encodeURIComponent((ipt.pic));
		}
		var $oappkey="dcba10cb2d574a48a16f24c9b6af610c";
		if(ipt.appkey){
			$oappkey=encodeURIComponent((ipt.appkey));
		}
		return ('http://share.v.t.qq.com/index.php?c=share&a=index&title='+ encodeURIComponent((ipt.title))+'&site='+$osite+'&pic='+$opic+'&url='+encodeURIComponent(ipt.url))+'&appkey='+$oappkey+'&assname=${RALATEUID}';
	},
	"163_weibo":function(ipt){
		var $osource='bshare';
		if(ipt.source){
			$osource=encodeURIComponent((ipt.source));
		}
		var $odata='';
		if(ipt.data){
			$odata=encodeURIComponent((ipt.data));
		}
		var $opic='';
		if(ipt.pic){
			$opic=encodeURIComponent((ipt.pic));
		}
		return ('http://t.163.com/article/user/checkLogin.do?source='+$osource+'&info='+$odata+'&images='+$opic);
	},
	"sohu_weibo":function(ipt){
		var $oappkey="GTnImhxM56";
		if(ipt.appkey){
			$oappkey=encodeURIComponent((ipt.appkey));
		}
		var $opic='';
		if(ipt.pic){
			$opic=encodeURIComponent((ipt.pic));
		}
		return ('http://t.sohu.com/third/post.jsp?url='+encodeURIComponent(ipt.url)+'&title='+encodeURIComponent((ipt.title))+'&content=utf-8&pic='+$opic+'&appkey='+$oappkey);
	},
	"xinhua_weibo":function(ipt){
		var $opic='';
		if(ipt.pic){
			$opic=encodeURIComponent((ipt.pic));
		}
		return ('http://t.home.news.cn/share.jsp?url='+encodeURIComponent(ipt.url)+'&title='+encodeURIComponent((ipt.title))+'&pic='+$opic);
	},
	"tianya":function(ipt){
		var $oappkey="63e2cd0fd94669848c60cabd4606335e04f547fc8";
		if(ipt.appkey){
			$oappkey=encodeURIComponent((ipt.appkey));
		}
		var $opic='';
		if(ipt.pic){
			$opic=encodeURIComponent((ipt.pic));
		}
		var $ouname=""
		if(ipt.uname){
			$ouname=encodeURIComponent((ipt.uname));
		}
		return ('http://open.tianya.cn/widget/send_for.php?action=send-html&shareTo=2&appkey='+$oappkey+'&title='+encodeURIComponent((ipt.title))+'&url='+encodeURIComponent(ipt.url)+'&picUrl='+$opic+'&relateTYUserName='+$ouname);
	},
	"10086":function(ipt){
		var $oappkey="c1659189f4a91d92218af2b2a2dbf51b";
		if(ipt.appkey){
			$oappkey=encodeURIComponent((ipt.appkey));
		}
		return ('http://go.10086.cn/ishare.do?m=wt&u='+encodeURIComponent(ipt.url)+'&t='+encodeURIComponent((ipt.title))+'&sid='+$oappkey);
	},
	"fenghuang_weibo":function(ipt){
		var $oappkey="2i0bjoV";
		if(ipt.appkey){
			$oappkey=encodeURIComponent((ipt.appkey));
		}
		var $osource='bshare';
		if(ipt.source){
			$osource=encodeURIComponent((ipt.source));
		}
		var $opic='';
		if(ipt.pic){
			$opic=encodeURIComponent((ipt.pic));
		}
		return ('http://t.ifeng.com/interface.php?_c=share&_a=share&sourceUrl='+encodeURIComponent(ipt.url)+'&title='+encodeURIComponent((ipt.title))+'&pic='+$opic+'&source='+$osource+'&type=0&key='+$oappkey);
	},
	"pengyou":function(ipt){
		var $odata=""
		if(ipt.data){
			$odata='&summary='+encodeURIComponent((ipt.data));
		}
		var $opic=""
		if(ipt.pic){
			$opic='pics='+encodeURIComponent((ipt.pics));
		}
		
		return ('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?to=pengyou&url='+ encodeURIComponent(ipt.url)+ '&title=' + encodeURIComponent((ipt.title))+ $odata+$opic);
	},
	"kaixin":function(ipt){
		var $odata=""
		if(ipt.data){
			$odata='&summary='+encodeURIComponent((ipt.data));
		}
		var $opic=""
		if(ipt.pic){
			$opic='pics='+encodeURIComponent((ipt.pics));
		}
		var $oappkey="100013770";
		if(ipt.appkey){
			$oappkey=encodeURIComponent((ipt.appkey));
		}
		
		return ('http://www.kaixin001.com/login/open_login.php?flag=1&url=/rest/records.php?url='+ encodeURIComponent(ipt.url)+ '&content=' + $odata+'&pic='+$opic+'&starid=${RALATEUID}&aid='+$oappkey);
	},
	"people_weibo":function(ipt){
		var $opic=""
		if(ipt.pic){
			$opic='pics='+encodeURIComponent((ipt.pics));
		}
		var $oappkey="5554506767";
		if(ipt.appkey){
			$oappkey=encodeURIComponent((ipt.appkey));
		}
		return ('http://t.people.com.cn/toshareinfo.action?appkey='+$oappkey+'&url='+ encodeURIComponent(ipt.url)+ '&title=' + encodeURIComponent((ipt.title))+'&pic='+$opic+'&pic=&site=&showFocusId=');
	},
	"baidu_hi":function(ipt){
		return ('http://hi.baidu.com/pub/show/share?url='+ encodeURIComponent(ipt.url)+ '&title=' + encodeURIComponent((ipt.title)));
	},
	"google_bookmarks":function(ipt){
		return ('https://www.google.com/bookmarks/mark?op=edit&output=popup&bkmk='+ encodeURIComponent(ipt.url)+ '&title=' + encodeURIComponent((ipt.title)));
	},
	"caimi":function(ipt){
		return ('http://t.eastmoney.com/share.aspx?url='+ encodeURIComponent(ipt.url)+ '&title=' + encodeURIComponent((ipt.title)));
	},
	"zhongjing_weibo":function(ipt){
		var $oappkey="2924220432";
		if(ipt.appkey){
			$oappkey=encodeURIComponent((ipt.appkey));
		}
		return ('http://t.cnfol.com/share.php?url='+ encodeURIComponent(ipt.url)+ '&title=' + encodeURIComponent((ipt.title))+'&appkey='+$oappkey);
	},
	"chouti":function(ipt){
		return ('http://dig.chouti.com/digg.action?newsURL='+ encodeURIComponent(ipt.url)+ '&title=' + encodeURIComponent((ipt.title)));
	},
	"zhongqinshequ":function(ipt){
		return ('http://home.cyol.com/home.php?mod=space&do=share&view=me&from=space&url='+ encodeURIComponent(ipt.url)+ '&title=' + encodeURIComponent((ipt.title)));
	},
	"chuangyeba":function(ipt){
		return ('http://u.cyzone.cn/share.php?url='+ encodeURIComponent(ipt.url)+ '&title=' + encodeURIComponent((ipt.title)));
	},
	"delicious":function(ipt){
		return ('https://delicious.com/save?url='+ encodeURIComponent(ipt.url)+ '&title=' + encodeURIComponent((ipt.title))+'&v=5');
	},
	"dig24":function(ipt){
		return ('http://www.dig24.cn/share/crawler.dhtml?address='+ encodeURIComponent(ipt.url));
	},
	"digg":function(ipt){
		return ('http://digg.com/submit?phase=2&url='+ encodeURIComponent(ipt.url)+ '&title=' + encodeURIComponent((ipt.title)));
	},
	"diigo":function(ipt){
		return ('http://www.diigo.com/post?url='+ encodeURIComponent(ipt.url)+ '&title=' + encodeURIComponent((ipt.title))+'&desc=');
	},
	"duitang":function(ipt){
		var $opic=""
		if(ipt.pic){
			$opic='pics='+encodeURIComponent((ipt.pics));
		}
		return ('http://www.duitang.com/collect/?img='+$opic+'$alt=&url='+ encodeURIComponent(ipt.url)+ '&title=' + encodeURIComponent((ipt.title))+'&desc=');
	},
	"evernote":function(ipt){
		return ('http://www.evernote.com/clip.action?url='+ encodeURIComponent(ipt.url)+ '&title=' + encodeURIComponent((ipt.title)));
	},
	"facebook":function(ipt){
		return ('http://www.facebook.com/share.php?src=bm&u='+ encodeURIComponent(ipt.url));
	},
	"fanfou":function(ipt){
		return ('http://fanfou.com/sharer?u='+ encodeURIComponent(ipt.url)+ '&t=' + encodeURIComponent((ipt.title)));
	},
	"feixin":function(ipt){
		var $opic=""
		if(ipt.pic){
			$opic='pics='+encodeURIComponent((ipt.pics));
		}
		var $oappkey="";
		if(ipt.appkey){
			$oappkey=encodeURIComponent((ipt.appkey));
		}
		var $osource='bshare';
		if(ipt.source){
			$osource=encodeURIComponent((ipt.source));
		}
		return ('http://i3.feixin.10086.cn/apps/share/share?appkey='+$oappkey+'&source='+$osource+'&content=&pageid=$pic='+$opic+'&url='+ encodeURIComponent(ipt.url)+ '&title=' + encodeURIComponent((ipt.title)));
	},
	"friendfeed":function(ipt){
		return ('https://friendfeed.com/account/login?next=/share?url='+ encodeURIComponent(ipt.url)+ '&title=' + encodeURIComponent((ipt.title)));
	},
	"fwisp":function(ipt){
		return ('http://fwisp.com/login.php?return=/submit.php?url='+ encodeURIComponent(ipt.url));
	},
	"gmail":function(ipt){
		return ('https://accounts.google.com/ServiceLogin?service=mail&passive=true&rm=false&continue='+encodeURIComponent('https://mail.google.com/mail/?ui=2&view=cm&fs=1&tf=1&body='+ encodeURIComponent(ipt.url)+ '&su=' + encodeURIComponent((ipt.title))));
	}
	
}
__Shareto.share=function(ipt,rule){
	if(__Shareto.sharelist[rule]){
		
		return (__Shareto.sharelist[rule](ipt));
	}
}
__shareto=__Shareto.share;



//iefix
if(SYSLIB.includecb&&IS_IE){
  SYSLIB.includecb("SYSLIB.shareto.js");
}


