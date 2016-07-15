/**
 * 云投顾H5前端service层调用接口[组合相关]
 */
define(function(require, exports, module) {
	var gconfig = require("gconfig");
	var global = gconfig.global;
	var service = require("service");
	var serviceSingleton = new service.Service();

	/** ******************************公共代码部分******************************* */
	function commonInvoke(paraMap, callback, ctrlParam, reqParamVo) {
		reqParamVo.setReqParam(paraMap);
		ctrlParam = ctrlParam ? ctrlParam : {};
		reqParamVo.setIsLastReq(ctrlParam.isLastReq);
		reqParamVo.setIsAsync(ctrlParam.isAsync);
		reqParamVo.setIsShowWait(ctrlParam.isShowWait);
		reqParamVo.setTimeOutFunc(ctrlParam.timeOutFunc);
		reqParamVo.setIsShowOverLay(ctrlParam.isShowOverLay);
		reqParamVo.setTipsWords(ctrlParam.tipsWords);
		reqParamVo.setDataType(ctrlParam.dataType);
		reqParamVo.setProtocol(ctrlParam.protocol);
		serviceSingleton.invoke(reqParamVo, callback);
	}
	function destroy() {
		serviceSingleton.destroy();
	}
	var mobileService = { 
			"submitPhtoo":submitPhtoo, //接口方法模板
			"queryPortfolioList":queryPortfolioList,  //查询所有组合
			"queryPortfolioDetails":queryPortfolioDetails, //查询组合详情
			"queryClientBuyPortfolio":queryClientBuyPortfolio,  //查询用户购买的组合 
			"attentionPortfolioNewsRemind":attentionPortfolioNewsRemind,  //关注组合  是否接收调仓消息提醒
			"buyPortfolioNewsRemind":buyPortfolioNewsRemind,  //购买组合   是否接收调仓消息提醒
			"userIsSubPortfolio":userIsSubPortfolio,  //用户是否关注组合 
			"isPortfolio":isPortfolio,  //判断是否是产品组合
			"commonRanks":commonRanks,  //普通组合排行
			"userCommentPortfolio":userCommentPortfolio,  //用户评论组合 
			"filterPortfolio":filterPortfolio,   //菜单式 筛选组合
			"recomPortfolioByStyle":recomPortfolioByStyle, //按风格推荐组合
			"attentionAndCancelPortfolio":attentionAndCancelPortfolio, //关注取消组合
			"queryPortfolioData":queryPortfolioData, //查询用户组合数据
			"portfolioQuesAndAnswer":portfolioQuesAndAnswer,  //组合问答
			"portfolioNum":portfolioNum,  //组合数量
			"queryProtfolioTrade":queryProtfolioTrade,  //历史成交查询
			"queryPortfolioOperateInfo":queryPortfolioOperateInfo,  //查询组合完整收益
			"queryPortfolioHistBargain":queryPortfolioHistBargain,  //查询组合的交易动态 
			"queryViewQuesPortfolio":queryViewQuesPortfolio,  //组合观点问答
			"queryUsersPortfolioList" : queryUsersPortfolioList, //查询用户的组合列表
			"createPortfolio" : createPortfolio, //创建组合
			"queryProtfolioHoldStock" : queryProtfolioHoldStock, //查询资金账户持仓
			"queryTodayEntrust" : queryTodayEntrust, //当日委托（可撤委托）
			"queryHisEntrust" : queryHisEntrust, //历史委托
			"queryHisDeal" : queryHisDeal, //历史成交
			"queryTodayDeal" : queryTodayDeal, //当日成交
			"cancelTradeOrder" : cancelTradeOrder, //委托撤单
			"stockAutoInput" : stockAutoInput, //股票自动补全输入
			"queryStockInfo" : queryStockInfo, //查询股票信息
			"entrustStock" : entrustStock, //股票买卖委托下单（普通）
			"queryDrowdata" :queryDrowdata,//组合详情 画图
			"getInstance" : getInstance,
			"destroy" : destroy,
			"newShow" : newShow,//最新发布
			"GoodUser" : GoodUser//投顾组合/民间高手

	};
	function getInstance() {
		return mobileService;
	}
	module.exports = mobileService;
	
	
    /** ******************************应用接口开始******************************* */
	
	/**
	 * 接口方法模板
	 * @param param json格式入参
	 * @callback 回调处理
	 * @ctrlParam json格式控制参数，包括isLastReq、isAsync、isShowWait等
	 * */
	function submitPhtoo(param, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "501503";  // 接口功能号
		paraMap["user_id"] = param.user_id; //其他参数
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	
	
	
	
	
	/**
	 * 关注/取消关注 组合
	 * @param sub_type 关注类型（0：取消关注 1：关注）
	 * */
	function attentionAndCancelPortfolio(queryMap, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408321";
		paraMap["portfolio_id"] = queryMap["portfolio_id"];
		paraMap["user_id"] = queryMap["user_id"];
		paraMap["sub_type"] = queryMap["sub_type"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	
	/**
	 * 热门组合
	 * */
	function queryPortfolioList(queryMap, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408343";
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		paraMap["customer_id"] = queryMap["customer_id"]; //可传入用户Id,判断与组合的关注关系
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
		
	}
	/**
	 * 组合详情
	 * */
	function queryPortfolioDetails(queryMap, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408338";
		paraMap["portfolio_id"] = queryMap.portfolio_id;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
		
	}
	
	/**
	 * 查询用户订阅（购买）的组合列表
	 */
      function queryClientBuyPortfolio(queryMap,callback,ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408324";
		paraMap["user_id"] = queryMap["user_id"];
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};

	/**
	 * 关注组合 是否接收调仓消息提醒
	 */
	function attentionPortfolioNewsRemind(queryMap, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408325";
		paraMap["portfolio_id"] = queryMap["portfolio_id"];
		paraMap["user_id"] = queryMap["user_id"];
		paraMap["is_receive_msg"] = queryMap["is_receive_msg"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};

	/**
	 * 购买组合 是否接收调仓消息提醒
	 */
	function buyPortfolioNewsRemind(queryMap,callBackFunc,ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408326";
		paraMap["portfolio_id"] = queryMap["portfolio_id"];
		paraMap["user_id"] = queryMap["user_id"];
		paraMap["is_receive_msg"] = queryMap["is_receive_msg"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};

	/**
	 * 用户是否关注组合
	 */
	  function userIsSubPortfolio(queryMap,callback,ctrlParam ) {
		var paraMap = {};
		paraMap["funcNo"] = "408327";
		paraMap["portfolio_id"] = queryMap["portfolio_id"];
		paraMap["user_id"] = queryMap["user_id"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};

	

	/**
	 * 判断是否是产品组合
	 */
	    function isPortfolio(queryMap,callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408329";
		paraMap["portfolio_id"] = queryMap["portfolio_id"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};

	/**
	 * 普通组合排行
	 */
	  function commonRanks(queryMap,callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408331";
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		paraMap["type"] = queryMap["type"];
		paraMap["customer_id"] = queryMap["customer_id"]; //可传入用户Id,判断与组合的关注关系
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 最新发布
	 */
	 function newShow(queryMap,callback, ctrlParam) {
			var paraMap = {};
			paraMap["funcNo"] = "408368";
			paraMap["curPage"] = queryMap["curPage"];
			paraMap["numPerPage"] = queryMap["numPerPage"];
			paraMap["customer_id"] = queryMap["customer_id"]; //可传入用户Id,判断与组合的关注关系
			var reqParamVo = new service.ReqParamVo();
			reqParamVo.setUrl(global.serverPath);
			commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
		};
		
		/**
		 * 投顾组合/民间高手
		 */
		function GoodUser(queryMap,callback, ctrlParam) {
			var paraMap = {};
			paraMap["funcNo"] = "408357";
			paraMap["curPage"] = queryMap["curPage"];
			paraMap["numPerPage"] = queryMap["numPerPage"];
			paraMap["rank_type"] = queryMap["rank_type"];
			paraMap["type"] = queryMap["type"];
			paraMap["customer_id"] = queryMap["customer_id"]; //可传入用户Id,判断与组合的关注关系
			var reqParamVo = new service.ReqParamVo();
			reqParamVo.setUrl(global.serverPath);
			commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
		};

		/**
		 * 用户评论组合
		 */
		function userCommentPortfolio(queryMap,callback,ctrlParam) {
			var paraMap = {};
			paraMap["funcNo"] = "408334";
			paraMap["curPage"] = queryMap["curPage"];
			paraMap["numPerPage"] = queryMap["numPerPage"];
			paraMap["view_id"] = queryMap["view_id"];
			paraMap["user_id"] = queryMap["user_id"];
			paraMap["parent_id"] = queryMap["parent_id"];
			paraMap["comment_content"] = queryMap["comment_content"];
			paraMap["comment_state"] = queryMap["comment_state"];

			var reqParamVo = new service.ReqParamVo();
			reqParamVo.setUrl(global.serverPath);
			commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
		};


	/**
	 * 菜单式筛选组合
	 */
	    function filterPortfolio(queryMap,callback,ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408340";
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		paraMap["count_type"] = queryMap["count_type"];
		paraMap["rank_type"] = queryMap["rank_type"];
		paraMap["stock_holddays_avg_down"] = queryMap["stock_holddays_avg_down"];
		paraMap["stock_holddays_avg_up"] = queryMap["stock_holddays_avg_up"];
		paraMap["turnover_rate_down"] = queryMap["turnover_rate_down"];
		paraMap["turnover_rate_up"] = queryMap["turnover_rate_up"];
		paraMap["choose_success_rate_down"] = queryMap["choose_success_rate_down"];
		paraMap["choose_success_rate_up"] = queryMap["choose_success_rate_up"];
		paraMap["retrace_rate_down"] = queryMap["retrace_rate_down"];
		paraMap["retrace_rate_up"] = queryMap["retrace_rate_up"];
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};

	/**
	 * 按风格推荐组合
	 */
	function recomPortfolioByStyle(queryMap,callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408344";
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		paraMap["portfolio_style"] =  queryMap["portfolio_style"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};

	/**
	 * 查询用户组合数据
	 */
	   function queryPortfolioData(queryMap,callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408323";
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		paraMap["user_id"] =queryMap["user_id"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};

	/**
	 * 组合问答
	 */
	function portfolioQuesAndAnswer(queryMap,callback,ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408364";
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		paraMap["invest_id"] = queryMap["invest_id"];
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};



	/**
	 * 组合数量
	 */
	function portfolioNum(queryMap,callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408350";
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		paraMap["user_id"] = queryMap["user_id"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};


	
	/**
	 * 历史成交查询(查询组合的交易动态)
	 */
	function queryProtfolioTrade(queryMap,callback,ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408356";
		paraMap["account_id"] = queryMap["account_id"];
		paraMap["startDate"] = queryMap["startDate"];
		paraMap["endDate"] = queryMap["endDate"];				
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 查询组合完整收益
	 */
	
	function queryPortfolioOperateInfo(queryMap,callback,ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401508";
		paraMap["account_id"] = queryMap["account_id"];
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	

	/**
	 * 查询组合的交易动态
	 */
	function queryPortfolioHistBargain(queryMap,callback,ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408356";
		paraMap["account_id"] = queryMap["account_id"];
		paraMap["startDate"] = queryMap["startDate"];
		paraMap["endDate"] = queryMap["endDate"];
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 *  组合观点问答
	 */
	function queryViewQuesPortfolio(queryMap,callback,ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408360";			
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 查询用户的组合列表(普通用户、投顾用户)
	 */
	function queryUsersPortfolioList(queryMap,callback,ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408322";
		paraMap["user_id"] = queryMap["user_id"];
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];	
		paraMap["customer_id"] = queryMap["customer_id"];	
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 创建组合
	 */
	function createPortfolio(queryMap,callback,ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408320";
		paraMap["portfolio_name"] = queryMap["portfolio_name"];
		paraMap["user_id"] = queryMap["user_id"];
		paraMap["introdution"] = queryMap["introdution"];
		paraMap["portfolio_type"] = queryMap["portfolio_type"];
		paraMap["confirm_state"] = queryMap["confirm_state"];
		paraMap["portfolio_image_big"] = queryMap["portfolio_image_big"];
		paraMap["portfolio_image_small"] = queryMap["portfolio_image_small"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 查询资金账户持仓
	 */
	function queryProtfolioHoldStock(queryMap,callback,ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408351";
		paraMap["account_id"] = queryMap["account_id"];
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 当日委托（可撤委托）
	 */
	function queryTodayEntrust(queryMap,callback,ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401152";
		paraMap["account_id"] = queryMap["account_id"];
		paraMap["curPage"] =queryMap["curPage"] ;
		paraMap["numPerPage"] =queryMap["numPerPage"] ;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 当日成交
	 */
	function queryTodayDeal(queryMap,callback,ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401153";
		paraMap["account_id"] = queryMap.account_id;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 历史委托
	 */
	function queryHisEntrust(queryMap,callback,ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401154";
		paraMap["account_id"] = queryMap["account_id"];
		paraMap["startDate"] =queryMap["startDate"] ;
		paraMap["endDate"] =queryMap["endDate"] ;
		paraMap["curPage"] =queryMap["curPage"] ;
		paraMap["numPerPage"] =queryMap["numPerPage"] ;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 历史成交
	 */
	function queryHisDeal(queryMap,callback,ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401155";
		paraMap["account_id"] = queryMap["account_id"];
		paraMap["startDate"] =queryMap["startDate"] ;
		paraMap["endDate"] =queryMap["endDate"] ;
		paraMap["curPage"] =queryMap["curPage"] ;
		paraMap["numPerPage"] =queryMap["numPerPage"] ;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 委托撤单
	 */
	function cancelTradeOrder(queryMap,callback,ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401157";
		paraMap["account_id"] = queryMap.account_id;
		paraMap["cancel_id"] = queryMap.cancel_id;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 股票自动补全输入
	 */
	function stockAutoInput(queryMap,callback,ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401626";
		paraMap["stock_code"] = queryMap.stock_code;
		paraMap["limit"] = queryMap.limit;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 股票信息查询
	 */
	function queryStockInfo(queryMap,callback,ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401627";
		paraMap["stock_code"] = queryMap.stock_code;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 股票买卖委托下单（普通）
	 */
	function entrustStock(queryMap,callback,ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401150";
		paraMap["account_id"] = queryMap["account_id"];
		paraMap["market"] = queryMap["market"];
		paraMap["stkcode"] = queryMap["stkcode"];
		paraMap["stockName"] = queryMap["stockName"];
		paraMap["price"] = queryMap["price"];
		paraMap["amount"] = queryMap["amount"];
		paraMap["trade_type"] = queryMap["trade_type"];
		paraMap["order_remark"] = queryMap["order_remark"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 查询计划简介的画图数据
	 */
	 function queryDrowdata(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408014";
		paraMap["plan_id"] = queryMap["plan_id"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/** ******************************应用接口结束******************************* */
});