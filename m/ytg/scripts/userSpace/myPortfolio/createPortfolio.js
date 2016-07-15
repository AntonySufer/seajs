/**
 * 创建组合
 */
define("ytg/scripts/userSpace/myPortfolio/createPortfolio", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
        portfolioService = require("portfolioService"),
		
		pageCode = "userSpace/myPortfolio/createPortfolio", 
		_pageId = "#userSpace_myPortfolio_createPortfolio ";
	
	//全局变量
	var user_id = null;
	var user_type = null;
	
	/**
	 * 初始化
	 */
	function init() {
		user_id = appUtils.getSStorageInfo('userId',true);
		/*if(user_id==null||""==user_id||undefined==user_id){
	    	layerUtils.iAlert("您尚未登录！",-1);
			appUtils.pageInit(pageCode,"index");
		}*/
		user_type = appUtils.getSStorageInfo('userType',true);
		//设置输入框长度
		$(_pageId+"#name").attr("maxlength",10);
		$(_pageId+"#intro").attr("maxlength",50);
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent() {
		//头部返回
		appUtils.bindEvent($(_pageId + ".icon_back"), function(e) {
			appUtils.pageInit(pageCode,"userSpace/myPortfolio/myPortfolio");
		});
		
		//完成
		appUtils.bindEvent($(_pageId + ".login_btn"), function(e) {
			createPortfolio();//创建组合
		});
	}
	
	//***************************【绑定事件方法】***********************************//
	
	/**
	 * 创建组合
	 * */
	function createPortfolio(){
		var portfolio_name = $(_pageId + "#name").val();
		var introdution = $(_pageId + "#intro").val();
		if(portfolio_name==null || portfolio_name==""){
			layerUtils.iMsg(-1,"组合名称不能为空");
			return;
		}
		else if(introdution==null || introdution==""){
			layerUtils.iMsg(-1,"组合简介不能为空");
			return;
		}
		var param = {
				"user_id" : user_id,
				"portfolio_name" : portfolio_name,
				"introdution" : introdution,
				"portfolio_type" : 1,
				"confirm_state" : 3
		};
		portfolioService.createPortfolio(param,function callBack(resultVo){
			if(Number(resultVo.error_no) == 0){
				layerUtils.iMsg(0,"创建组合成功");
				appUtils.pageInit(pageCode,"userSpace/myPortfolio/myPortfolio");
			}
			else{
				layerUtils.iAlert("创建组合失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	//*********************************************************************//
	
	/**
	 * 销毁
	 */
	function destroy() {
		//重置页面的所有输入值
		//appUtils.pageResetValue();
		$(_pageId).find("input").val("");
		$(_pageId).find("textarea").val("");
	}

	var userSpace_myPortfolio_createPortfolio = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = userSpace_myPortfolio_createPortfolio;
});