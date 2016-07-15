/**
 * 组合分类页
 */
define("ytg/scripts/portfolio/portfolioTab", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
        portfolioService=require("portfolioService");
		pageCode = "portfolio/portfolioTab", 
		_pageId = "#portfolio_portfolioTab ";
	
	//全局变量
	
	/**
	 * 初始化
	 */
	function init() {
		
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent() {
		
	}
	
	//***************************【函数方法】***********************************//
	
	
	//*********************************************************************//
	
	/**
	 * 销毁
	 */
	function destroy() {
	}

	var portfolio_portfolioTab = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = portfolio_portfolioTab;
});