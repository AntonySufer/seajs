/**
 * 公共方法
 */
define(function(require, exports, module) {
	var appUtils = require("appUtils"), 
		layerUtils = require("layerUtils"), 
		gconfig = require("gconfig"), 
		global = gconfig.global;
	var VIscroll = require("vIscroll");
	function initVIscroll(_pageId, vIscroll, downHandleFunction,upHandleFunction, ifShowPullUp, Menuheight) {
		if (Menuheight == null) {
			Menuheight = 40;
		}
		if (!vIscroll._init) {
			var config = {
				"isPagingType" : false, // 累加形式，true表示分页形式
				"isHasHead" : false, // 是否有包含头部
				"visibleHeight" : gconfig.appHeight - Menuheight,
				"container" : $(_pageId + " #v_container_infoList"),
				"wrapper" : $(_pageId + " #v_wrapper_infoList"),
				"downHandle" : function() { // 向下拉
					downHandleFunction();
				},
				"upHandle" : function() { // 向上拉
					upHandleFunction();
				},
				"wrapperObj" : null
			};
			vIscroll.scroll = new VIscroll(config); // 初始化
			vIscroll._init = true; // 尽量只初始化一次，保持性能（如果是项目开发，这句和下一句可以忽略）
		} else {
			vIscroll.scroll.refresh();
		}
		if (!ifShowPullUp) {
			$(_pageId + " #v_wrapper_infoList .visc_pullUp").hide();
		} else {
			$(_pageId + " #v_wrapper_infoList .visc_pullUp").show();
		}
	}
	
	//获取openid 与weixinpk
	function getWeiXinPKAndOpenId(){
		var weixinpk = appUtils.getSStorageInfo("weixinpk");
		var openid = appUtils.getSStorageInfo("openid");
		return  {"weixinpk" : weixinpk , "openid" : openid};
	}
	
	function getAccountInfo(){
		var service = require("accountService");  //业务层接口，请求数据
		/*入参*/
		var param = getWeiXinPKAndOpenId();
		var info = "";
		/*回调函数*/
		var callBack = function(resultVo){
			console.log(JSON.stringify(resultVo));
			if(resultVo.error_no == 0){
				var results = resultVo["results"];
				info = {
						"headimgurl":results[0]["headimgurl"],
						"nickname":results[0]["nickname"],
						"weixin_no":results[0]["weixin_no"]
				};
				
			}else{
				layerUtils.iMsg(-1,resultVo.error_info);
				return false;
			}
		};
		// 账户资料(1002303)
		service.getAccountInfo(param,callBack,{isAsync:false});//同步
		return info;
	}
	
	function getCurrentDateTime(){
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var day = (date.getDay()< 10 ? "0"+date.getDay():date.getDay());
		var hour = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();
		return  year+ "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
	}
	function onlyNum(This)
	{
		This.value=This.value.replace(/\D/g,'');
	}
	
	
	
	/* 查询客户信息 */
	var common = {
		"onlyNum":onlyNum,
		"initVIscroll" : initVIscroll,
		"getWeiXinPKAndOpenId" : getWeiXinPKAndOpenId,
		"getCurrentDateTime" : getCurrentDateTime,
		"getAccountInfo" : getAccountInfo,
		
	};
	module.exports = common;
});
