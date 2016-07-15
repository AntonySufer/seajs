/**
 * 炒股大赛首页
 * @author 余一一
 * @date 2016-03-30
 */
define("ytgMatch/scripts/weiboIndex", function(require, exports, module) {
	var appUtils = require("appUtils"), 
		layerUtils = require("layerUtils"), 
		gconfig = require("gconfig"),
		validatorUtil = require("validatorUtil"),
		ytgMatchService = require("ytgMatchService"),//服务
		userService = require("userService").getInstance(),//服务
		pageCode = "weiboIndex", 
		_pageId = "#weiboIndex ";
	
	var isFirstShow =true;//第一次
	
	/**
	 * 初始化
	 */
	function init() {
		
		if (isFirstShow) {
			getWeibocode();//微博授权
			isFirstShow =false;
		} else {
			appUtils.sendDirect("http://weibo.com");
		}
		
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent(){
		
	}
	
	/** *************************【函数方法】***************************** */
	
	
	
	/***
	 * 微博授权
	 */
	function getWeibocode(){
		//微博授权
		var callBackFunc = function (resultVo){
			if(resultVo.error_no == 0){
				var result = resultVo.results[0];
				//跳转到授权页面
				appUtils.sendDirect(result.url);
			}else{
				layerUtils.iMsg(resultVo.error_info,-1);
			}
	    	};
		 userService.weiboLogin(callBackFunc);
    }
    
  
	/** ****************************************************************** */
	
	/**
	 * 销毁
	 */
	function destroy() {
		
	}

	
	var weiboIndex = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = weiboIndex;
});