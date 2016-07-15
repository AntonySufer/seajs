/**
 * 页面公用方法
 */
define(function(require,exports,module){
	var appUtils = require("appUtils"),
	    layerUtils = require("layerUtils"),
	    gconfig = require("gconfig"),
	    global = gconfig.global;
	
	var userService = require("userService");
	
	/**
	 * 描述：登录成功后，跳到相应页面
	 * */
	function loginToPage(prePageCode){
	    var user_id = appUtils.getSStorageInfo("userId",true);
		var login_id = appUtils.getSStorageInfo("loginId",true);
		var user_type = appUtils.getSStorageInfo("userType",true);
		var user_name = appUtils.getSStorageInfo("userName",true);
		/*var param = {
				"user_id" :user_id,
				"login_id" :login_id,
				"user_type" : user_type,
				"user_name" : user_name
		};*/
		var _loginInPageCode = appUtils.getSStorageInfo("_loginInPageCode");
		var param = JSON.parse(appUtils.getSStorageInfo("_loginInPageParam"));
		var hisPageCode = appUtils.getSStorageInfo("hisPageCode");
		var ytgMatch = appUtils.getSStorageInfo("ytgMatch");//判断是否是冲炒股大赛进入
		var hisPageParam = JSON.parse(appUtils.getSStorageInfo("hisPageParam"));
		if(_loginInPageCode != null && _loginInPageCode != ""){
			appUtils.pageInit(prePageCode, _loginInPageCode,param);
		}
		else if(hisPageCode != undefined && hisPageCode != null && hisPageCode != ""){
		//如果
			if (ytgMatch) {
				//炒股大赛进入的登陆，则重定向炒股大赛地址
				appUtils.sendDirect(hisPageCode+"?user_id="+user_id);
			} else {
				appUtils.pageInit(prePageCode,hisPageCode,hisPageParam);
			}
			appUtils.clearSStorage("hisPageCode");
			appUtils.clearSStorage("hisPageParam");
		}
		else{
			if(user_type == 0){
				appUtils.pageInit(prePageCode,"userSpace/index",param);
			}
			else if(user_type == 1){
				appUtils.pageInit(prePageCode,"adviserSpace/index",param);
			}
			else if(user_type == 2){
				appUtils.pageInit(prePageCode,"userSpace/index",param);
			}
			else{
				appUtils.pageInit(prePageCode,"account/login");
			}
		}
	}
	
	/**
	 * 退出登录
	 * */
	function loginOutFunc(prePageCode){
		userService.loginOut(null,function callBack(resultVo){
			if(Number(resultVo.error_no) == 0){
				layerUtils.iMsg(0,"退出成功");
				//清除相关cookie（备注:应该放在退出操作中做的）
				appUtils.clearSStorage("_loginInPageCode");
				appUtils.clearSStorage("_loginInPageParam");
				appUtils.clearSStorage("_isLoginIn");
				//清除登录信息
				appUtils.clearSStorage(true);
				appUtils.clearSStorage();//清除所有缓存 
				//跳转至首页
				appUtils.pageInit(prePageCode,"index");
			}
			else{
				layerUtils.iAlert("退出失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	/**
	 * 头部菜单绑定事件
	 * */
	function headerMenuFunc(_pageId,pageCode){
		//修复  菜单栏需要点击两次才显示的bug
		$(document).click(function(event){
			$("html,body").animate({scrollTop: '0px'}, 100);
			//头部菜单
			var munu_icon = $(_pageId + ".menu_iocn");
			if(munu_icon.is(event.target)){
				$(_pageId +".menu_iocn").hide();
				$(_pageId +".xl_menu").show();
				$(_pageId +"#close").show();
			}
		});
		
		//头部菜单
		/*appUtils.bindEvent($(_pageId + ".menu_iocn"), function(e) {
			$(_pageId +".menu_iocn").hide();
			$(_pageId +".xl_menu").show();
			$(_pageId +"#close").show();
		});*/
		
		//关闭菜单
		appUtils.bindEvent($(_pageId + "#close"), function(e) {
			$(_pageId +".menu_iocn").show();
			$(_pageId +".xl_menu").hide();
			$(_pageId +"#close").hide();
		});
		
		//菜单选项
		appUtils.bindEvent($(_pageId + ".xl_menu li"), function(e) {
			var index = $(this).index();
			switch(index){
			case 0 : appUtils.pageInit(pageCode,"index");break; //首页
			case 1 : appUtils.pageInit(pageCode,"portfolio/index");break; //组合
			case 2 : appUtils.pageInit(pageCode,"adviser/index");break; //投顾
			case 3 : appUtils.pageInit(pageCode,"ques/index");break; //问答
			case 4 : 
				var user_type = appUtils.getSStorageInfo("userType",true);
				if(user_type == 0){
					appUtils.pageInit(pageCode,"userSpace/index");
				}
				else if(user_type == 1){
					appUtils.pageInit(pageCode,"adviserSpace/index");
				}
				else{
					appUtils.pageInit(pageCode,"account/login");
				}
				break;
			}
		});
	}
	
	/**
	 * 隐藏菜单以及遮罩层
	 * */
	function hideHeaderMenuFunc(_pageId){
		$(_pageId +".menu_iocn").show();
		$(_pageId +".xl_menu").hide();
		$(_pageId +"#close").hide();
	}
	    
	var pageCommon = {
			"loginToPage" : loginToPage,
			"loginOutFunc" : loginOutFunc,
			"headerMenuFunc" : headerMenuFunc,
			'hideHeaderMenuFunc' : hideHeaderMenuFunc
			
	};
	module.exports = pageCommon;  
});