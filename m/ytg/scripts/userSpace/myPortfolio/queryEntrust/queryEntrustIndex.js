/**
 * 查询
 */
define("ytg/scripts/userSpace/myPortfolio/queryEntrust/queryEntrustIndex", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
		
		pageCode = "userSpace/myPortfolio/queryEntrust/queryEntrustIndex", 
		_pageId = "#userSpace_myPortfolio_queryEntrust_queryEntrustIndex ";
	
	//全局变量
	var portfolio_name = null;
	
	//页面公共JS
	var pageCommon = require("pageCommon");
	
	/**
	 * 初始化
	 */
	function init() {
		//设置标题
		portfolio_name = appUtils.getSStorageInfo("portfolioName");
		$(_pageId + " #portfolio_name").html(portfolio_name);
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent() {
		//头部菜单绑定事件
		pageCommon.headerMenuFunc(_pageId,pageCode);
		//头部返回
		appUtils.bindEvent($(_pageId + ".icon_back"), function(e) {
			appUtils.pageInit(pageCode,"userSpace/myPortfolio/myPortfolio");
		});
		
		//头部导航栏(持仓;买入;卖出;撤单;查询)
		appUtils.bindEvent($(_pageId + ".row-1"), function(e) {
			var index = $(this).index();
			if(index == 0){
				appUtils.pageInit(pageCode,"userSpace/myPortfolio/portfolioDetail");
			}
			else if(index ==1){
				appUtils.pageInit(pageCode,"userSpace/myPortfolio/buyStock");
			}
			else if(index ==2 ){
				appUtils.pageInit(pageCode,"userSpace/myPortfolio/sellStock");
			}
			else if(index ==3){
				appUtils.pageInit(pageCode,"userSpace/myPortfolio/cancelEntrust");
			}
			else if(index ==4){
				//appUtils.pageInit(pageCode,"userSpace/myPortfolio/queryEntrust/queryEntrustIndex");
			}
		});
		
		//委托查询
		appUtils.bindEvent($(_pageId + "#todayDeal"), function(e){
			appUtils.pageInit(pageCode,"userSpace/myPortfolio/queryEntrust/todayDeal");
		});
		appUtils.bindEvent($(_pageId + "#todayEntrust"), function(e){
			appUtils.pageInit(pageCode,"userSpace/myPortfolio/queryEntrust/todayEntrust");
		});
		appUtils.bindEvent($(_pageId + "#hisDeal"), function(e){
			appUtils.pageInit(pageCode,"userSpace/myPortfolio/queryEntrust/hisDeal");
		});
		appUtils.bindEvent($(_pageId + "#hisEntrust"), function(e){
			appUtils.pageInit(pageCode,"userSpace/myPortfolio/queryEntrust/hisEntrust");
		});
	}
	
	//***************************【初始化方法】***********************************//
	
	//*********************************************************************//
	
	/**
	 * 销毁
	 */
	function destroy() {
		//隐藏菜单以及遮罩层
		pageCommon.hideHeaderMenuFunc(_pageId);
	}

	var userSpace_myPortfolio_queryEntrust_queryEntrustIndex = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = userSpace_myPortfolio_queryEntrust_queryEntrustIndex;
});