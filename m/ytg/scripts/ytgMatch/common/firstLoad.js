define(function(require,exports,module){
	var appUtils = require("appUtils"),
		gconfig = require("gconfig");
	
	var weixinpk = "",
		appid = gconfig.global.appid,
		appsecret = gconfig.global.appsecret,
		weixinPath = gconfig.global.weixinPath,
		code = "",
		openid = "";
	function setWXPK_OPID(weixinpk,code){
		//自定义微信缓存(H5端用)
		//appUtils.setSStorageInfo("openid",116);
		//appUtils.setSStorageInfo("weixinpk",116);
		/**
		 * 获取weixinpk和openid
		 */
		openid = appUtils.getSStorageInfo("openid");
		//如果缓存中有就从缓存中取
		if(openid!=null&&typeof(openid)!=undefined&&openid!=""){
			return [appUtils.getSStorageInfo("weixinpk"),openid];
		}
		//获取微信传入参数weixinpk,只要是链接没获取到，就是默认的，不管是网页授权方式还是链接方式
		weixinpk = appUtils.getPageParam("weixinpk");
		if(weixinpk ==""||weixinpk == null || weixinpk == undefined )
		{
			weixinpk = gconfig.global.weixinpk;//默认的weixinpk
		}
		code = appUtils.getPageParam("code");
		if(code!=null&&typeof(code)!=undefined&&code!="")  //网页授权链接形式进入
		{		
			openid = getopenid(appid,appsecret,code,weixinpk);
			appUtils.setSStorageInfo("openid",openid);
			appUtils.setSStorageInfo("weixinpk",weixinpk);
		}	
		else  
		{
			openid = appUtils.getPageParam("openid");  //图文消息或普通链接传递进入
			appUtils.setSStorageInfo("openid",openid);
			appUtils.setSStorageInfo("weixinpk",weixinpk);
		}
	}
	function getopenid(appid,appsecret,code,weixinpk)
	{
		var url = weixinPath;
		var param = "code=" + code + "&weixinpk="  + weixinpk;
		var isLastReq = true;
		var isAsync = false;
		var isShowWait = false;
		var isShowOverLay = false;
		var tipsWords = null;
		var timeOutFunc = null;
		var dataType = "";
		var openid = "";
			var callBackFunc = function(resultVo){
			if(resultVo != null)
			{
				openid = resultVo["openid"];
			}
			else
			{
				// 初始化失败
			}
		};
		appUtils.invokeServer(url,param,callBackFunc,isLastReq, isAsync, isShowWait, isShowOverLay, tipsWords, timeOutFunc);
		
		return openid;
	}
	
	var firstLoad = {
		"setWXPK_OPID": setWXPK_OPID
	};
	
	module.exports = firstLoad;
});