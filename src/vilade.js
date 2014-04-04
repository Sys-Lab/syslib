//
// NS:Vilade
// REQUIRE:CORE
// NEED:NONE
//
__Vilade=SYSLIB.namespace("syslib.vilade")
__Vilade.list = {
	"email":function (ipt) {
    	// contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
    	return /^((([a-z]|\d|[!#\$%&'\*\+\-\/ = \?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/ = \?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(ipt);
  	},
  	"url":function (ipt) {
    	// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
    	return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,; = ]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,; = ]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,; = ]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,; = ]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,; = ]|:|@)|\/|\?)*)?$/i.test(ipt);
  	},
  	"date":function (ipt) {
    	return !/Invalid|NaN/.test(new Date(ipt).toString());
  	},
  	"dateISO":function (ipt) {
    	return /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(ipt);
  	},
  	"number":function (ipt) {
    	return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(ipt);
  	},
  	"digits":function (ipt) {
    	return /^\d+$/.test(ipt);
  	},
  	"letterswithbasicpunc":function (ipt) {
    	return /^[a-z\-.,()'"\s]+$/i.test(ipt);
  	},
  	"alpha+numer":function (ipt) {
    	return /^\w+$/i.test(ipt);
  	},
  	"lettersonly":function (ipt) {
   		return /^[a-z]+$/i.test(ipt);
  	},
  	"nowhitespace":function (ipt) {
    	return /^\S+$/i.test(ipt);
  	},
  	"int":function (ipt) {
    	return /^-?\d+$/.test(ipt);
  	},
  	"+int":function (ipt) {
    	return /^[0-9]*[1-9][0-9]*$/.test(ipt);
  	},
  	"0+int":function (ipt) {
    	return /^\d+$/.test(ipt);
  	},
  	"0-int":function (ipt) {
    	return /^((-\d+)|(0+))$/.test(ipt);
  	},
  	"-int":function (ipt) {
    	return /^-[0-9]*[1-9][0-9]*$/.test(ipt);
  	},
  	"0+float":function (ipt) {
    	return /^\d+(\.\d+)?$/.test(ipt);
  	},
  	"+float":function (ipt) {
    	return /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(ipt);
  	},
  	"0-float":function (ipt) {
    	return /^((-\d+(\.\d+)?)|(0+(\.0+)?))$/.test(ipt);
  	},
  	"-float":function (ipt) {
    	return /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/.test(ipt);
  	},
  	"float":function (ipt) {
    	return /^(-?\d+)(\.\d+)?$/.test(ipt);
  	},
  	"alpha":function (ipt) {
    	return /^[A-Za-z]+$/.test(ipt);
  	},
  	"ualpha":function (ipt) {
    	return /^[A-Z]+$/.test(ipt);
  	},
  	"lalpha":function (ipt) {
    	return /^[a-z]+$/.test(ipt);
  	},
  	"chinesemobile":function (ipt) {
    	return /^[\+]?[86]*?1[3|4|5|8][0-9]\d{8}$/.test(ipt);
  	},
    "hongkongphone":function (ipt) {
      return /^[\+]?852[0-9]\d{7}$/.test(ipt);
    },
    "taiwanphone":function (ipt) {
      return /^[\+]?886[0-9]\d{8}$/.test(ipt);
    },
    "macauphone":function (ipt) {
      return /^[\+]?853[0-9]\d{7}$/.test(ipt);
    },
    "chn_hk_tw_mc_phone":function (ipt) {
      return /(^[\+]?853[0-9]\d{7}$)|(^[\+]?886[0-9]\d{9}$)|(^[\+]?852[0-9]\d{7}$)|(^[\+]?[86]*?1[3|4|5|8][0-9]\d{8}$)/.test(ipt);
    },
  	"chineseid":function (idcard) {
	    var area = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"},
	        idcard,Y,JYM,
	        S,M,
	        idcard_array  =  new Array(),
	        idcard_array  =  idcard.split("");
    	//地区检验
    	if(area[parseInt(idcard.substr(0,2))] == null) {
      		return false;//"身份证地区非法!"
    	}
    	//身份号码位数及格式检验
    	switch(idcard.length) {
      		case 15:
          		if ( (parseInt(idcard.substr(6,2))+1900) % 4  ==  0 || ((parseInt(idcard.substr(6,2))+1900) % 100  ==  0 && (parseInt(idcard.substr(6,2))+1900) % 4  ==  0 )) {
            		ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
          		}else{
            		ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
          		}
          		if(ereg.test(idcard)) {
            		return true;
          		}else{
            		return false;//"身份证号码出生日期超出范围或含有非法字符!",
          		}
          		break;
      		case 18:
		        //18位身份号码检测
		        //出生日期的合法性检查
		        //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
		        //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
		        if ( parseInt(idcard.substr(6,4)) % 4  ==  0 || (parseInt(idcard.substr(6,4)) % 100  ==  0 && parseInt(idcard.substr(6,4))%4  ==  0 )) {
              		ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式
          		}else{
              		ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式
          		}
          		if(ereg.test(idcard)) {//测试出生日期的合法性
              		//计算校验位
            		S  =  (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
			            + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
			            + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
			            + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
			            + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
			            + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
			            + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
			            + parseInt(idcard_array[7]) * 1
			            + parseInt(idcard_array[8]) * 6
			            + parseInt(idcard_array[9]) * 3 ;
            		Y  =  S % 11;
            		M  =  "F";
            		JYM  =  "10X98765432";
            		M  =  JYM.substr(Y,1);//判断校验位
            		if(M  ==  idcard_array[17]) {
              			return true;
            		}else{
              			return false;//"身份证号码校验错误!",
            		}
          		}else{
            		return false;//"身份证号码出生日期超出范围或含有非法字符!",
          		}
          		break;
    		default:
      			return false;// "身份证号码位数不对!",
      			break;
    	}
  	},
  	"sysupass":function (ipt) {
    	return /^[0-9a-zA-Z\!\?\@\#\$\%\^\&\*\(\)\[\]\{\}\|\\]{6,64}$/.test(ipt);
  	},
  	"systag":function (ipt) {
    	return /^[0-9a-zA-Z\u4e00-\u9fa5\']{1,4}$/.test(ipt);
  	},
  	"sysitemname":function (ipt) {
    	return /^[\S]{1,24}$/.test(ipt);
  	},
  	"chineseonly":function (ipt) {
    	return /^[\u4e00-\u9fa5]{1,}$/.test(ipt);
  	},
  	"sysuname":function (ipt) {
    	return /^[0-9a-zA-Z\u4e00-\u9fa5\_]{1,12}$/.test(ipt);
  	}
}
__Vilade.vilade = function (ipt,rule) {
  	if(__Vilade.list[rule]) {
   		return __Vilade.list[rule](ipt);
  	}else{
  		__Error.log(2,"Vilade : can't find "+rule);
  	}
}

//short cuts
var _is = SYSLIB.namespace("syslib.vilade").vilade;