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
		reqParamVo.setTimeOutFunc(ctrlParam.timeOutFunc);
		reqParamVo.setIsShowOverLay(ctrlParam.isShowOverLay);
		reqParamVo.setTipsWords(ctrlParam.tipsWords);
		reqParamVo.setDataType(ctrlParam.dataType);
		reqParamVo.setIsGlobal(ctrlParam.isGlobal);
		reqParamVo.setProtocol(ctrlParam.protocol);
		serviceSingleton.invoke(reqParamVo, callback);
	}
	function destroy() {
		serviceSingleton.destroy();
	}
	var mobileService = {

		"queryPortfolioDetails" : queryPortfolioDetails,// 查询组合详情
		"queryProtfolioHoldStock" : queryProtfolioHoldStock,// 查询资金账户持仓
		"stockAutoInput" : stockAutoInput, // 股票自动补全输入
		"queryStockInfo" : queryStockInfo,// 补全股票信息，查询股票
		"entrustStock" : entrustStock,// 股票买卖委托下单（普通）
		"queryTodayEntrust" : queryTodayEntrust,// 可撤委托 普通交易撤单查询
		"queryHisEntrust" : queryHisEntrust, // 历史委托
		"queryHisDeal" : queryHisDeal, // 历史成交
		"queryTodayDeal" : queryTodayDeal, // 当日成交
		"cancelTradeOrder" : cancelTradeOrder, // 委托撤单
		"queryProtfolioTrade" : queryProtfolioTrade, // 组合历史成交查询
		"queryDrowdata" : queryDrowdata,// 组合详情 画图
		"userIsSubPortfolio" : userIsSubPortfolio, // 用户是否关注参数人

		"queryList" : queryList,// 查询赛场列表
		"queryUserAllMatch" : queryUserAllMatch,// 查询用户参加的大赛
		"queryMatchDetails" : queryMatchDetails,// 查询大赛详情
		"queryIsJoinMatch" : queryIsJoinMatch, // 查询用户是否参加大赛
		"queryUserMatchRanking" : queryUserMatchRanking,// 查询用户参加比赛的排行收益
		"queryMatchRanking" : queryMatchRanking,// 查询我的大赛的排行
		"UserJoinMatch" : UserJoinMatch,// 报名比赛
		"queryRecentTurnover" : queryRecentTurnover,// 最近成交动态-查询普通交易赛事成交动态
		"queryJoinUser" : queryJoinUser,// 最近成交动态-查询普通交易赛事成交动态
		"loadInvestStkProfitInfo" : loadInvestStkProfitInfo, // 历史交易盈/亏前五笔
		"queryPortfolioSumByAccountId" : queryPortfolioSumByAccountId, // 模拟炒股帐号数据统计
		"findOperateInfoByAccountId" : findOperateInfoByAccountId,// 查看完整受益
		"queryNormalCountList" : queryNormalCountList,// 查询用户普通组合
		"queryMyMatchAllInfo" : queryMyMatchAllInfo,
		"singlogin" :singlogin,
		/** ********************************** */

		"submitPhtoo" : submitPhtoo
	// 接口方法模板
	};
	function getInstance() {
		return mobileService;
	}
	module.exports = mobileService;

	/** ******************************应用接口开始******************************* */

	/**
	 * 接口方法模板
	 * 
	 * @param param
	 *            json格式入参
	 * @callback 回调处理
	 * @ctrlParam json格式控制参数，包括isLastReq、isAsync、isShowWait等
	 */
	function submitPhtoo(param, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "501503"; // 接口功能号
		paraMap["user_id"] = param.user_id; // 其他参数
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	
	
	/**
	 * 微博授权
	 */
	function singlogin (queryMap, callback, ctrlParam){
		var paraMap = {};
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.weiboServices);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};

	/**
	 * 他的组合详情
	 */
	function queryPortfolioDetails(queryMap, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401812";
		paraMap["account_id"] = queryMap.account_id;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);

	}

	/**
	 * 查询资金账户持仓
	 */
	function queryProtfolioHoldStock(queryMap, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408351";
		paraMap["account_id"] = queryMap["account_id"];
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	;

	/**
	 * 股票自动补全输入
	 */
	function stockAutoInput(queryMap, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401626";
		paraMap["stock_code"] = queryMap.stock_code;
		paraMap["account_id"] = queryMap.account_id;
		paraMap["limit"] = queryMap.limit;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	;

	/**
	 * 股票信息查询
	 */
	function queryStockInfo(queryMap, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401627";
		paraMap["stock_code"] = queryMap.stock_code;
		paraMap["account_id"] = queryMap.account_id;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	;

	/**
	 * 股票买卖委托下单（普通）
	 */
	function entrustStock(queryMap, callback, ctrlParam) {
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
	}
	;

	/**
	 * 当日委托（可撤委托）普通交易撤单查询
	 */
	function queryTodayEntrust(queryMap, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401152";
		paraMap["account_id"] = queryMap["account_id"];
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	;

	/**
	 * 当日成交
	 */
	function queryTodayDeal(queryMap, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401153";
		paraMap["account_id"] = queryMap.account_id;
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	;

	/**
	 * 历史委托
	 */
	function queryHisEntrust(queryMap, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401154";
		paraMap["account_id"] = queryMap["account_id"];
		paraMap["startDate"] = queryMap["startDate"];
		paraMap["endDate"] = queryMap["endDate"];
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	;

	/**
	 * 历史成交
	 */
	function queryHisDeal(queryMap, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401155";
		paraMap["account_id"] = queryMap["account_id"];
		paraMap["startDate"] = queryMap["startDate"];
		paraMap["endDate"] = queryMap["endDate"];
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	;

	/**
	 * 委托撤单(模拟炒股)
	 */
	function cancelTradeOrder(queryMap, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401157";
		paraMap["account_id"] = queryMap.account_id;
		paraMap["cancel_id"] = queryMap.cancel_id;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	;

	/**
	 * 历史成交查询(查询组合的交易动态)
	 */
	function queryProtfolioTrade(queryMap, callback, ctrlParam) {
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
	}
	;

	/**
	 * 查询计划简介的画图数据
	 */
	function queryDrowdata(queryMap, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408014";
		paraMap["plan_id"] = queryMap["plan_id"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	;

	/**
	 * 用户是否关注组合
	 */
	function userIsSubPortfolio(queryMap, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408122";
		paraMap["invest_id"] = queryMap["invest_id"];
		paraMap["user_id"] = queryMap["user_id"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	;

	/** ******************************应用接口结束******************************* */

	/** ******************************应用接口开始******************************* */

	/**
	 * 功能号 401808 查询赛场列表（全部）
	 * 
	 * @param Y
	 */
	function queryList(param, callback, ctrlParam) {

		var paraMap = {};
		paraMap["funcNo"] = "401808";
		paraMap["match_state"] = param.match_state;// 比赛状态:0未开始，1进行中，2已结束
		paraMap["apply_state"] = param.apply_state;// 报名状态:0未开始，1进行中，2已结束
		paraMap["curPage"] = param.curPage;
		paraMap["user_id"] = param.user_id;
		paraMap["numPerPage"] = param.numPerPage;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}

	/**
	 * 功能号 401801 查询大赛详情
	 * 
	 * @param Y
	 */
	function queryMatchDetails(param, callback, ctrlParam) {

		var paraMap = {};
		paraMap["funcNo"] = "401801";
		paraMap["act_id"] = param.act_id;// 大赛id
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}

	// 查询用户是否参加了大赛
	function queryIsJoinMatch(param, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401813";
		paraMap["act_id"] = param.act_id;// 大赛id
		paraMap["user_id"] = param.user_id;// 用户id
		paraMap["activity_type"] = param.activity_type;// 大赛属性
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}

	/***************************************************************************
	 * 401802 查询用户关于**比赛的排行和收益
	 */
	function queryUserMatchRanking(param, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401802";
		paraMap["act_id"] = param.act_id;// 大赛id
		paraMap["user_id"] = param.user_id;// 用户id
		paraMap["type"] = param.type;// 0，周收益；1，月收益；2日收益；3总收益
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}

	/**
	 * 功能号 401807 查询普通交易赛事排行分页
	 * 
	 * @param act_id
	 *            大赛ID Y
	 */
	function queryMatchRanking(param, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401807";
		paraMap["act_id"] = param.act_id;// 大赛id
		paraMap["user_id"] = param.user_id;// 大赛id
		paraMap["type"] = param.type;// 0，周收益；1，月收益；2日收益；3总收益
		paraMap["curPage"] = param.curPage;
		paraMap["numPerPage"] = param.numPerPage;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}

	/**
	 * 功能号 408338 查询组合详情
	 * 
	 * @param portfolio_id
	 *            组合ID Y
	 */
	function queryPortfolioDetail(param, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408338";
		paraMap["portfolio_id"] = param.portfolio_id;//
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}

	/**
	 * 功能号 401818 报名大赛
	 * 
	 * @param portfolio_id
	 *            组合ID Y
	 */
	function UserJoinMatch(param, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401818";
		paraMap["act_id"] = param.act_id;// 大赛id
		paraMap["user_id"] = param.user_id;// 用户id
		paraMap["activity_type"] = param.activity_type;// 大赛属性
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}

	/**
	 * 功能号 401804 最近成交动态-查询普通交易赛事成交动态
	 * 
	 * @param act_id
	 *            大赛ID Y
	 */
	function queryRecentTurnover(param, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401804";
		paraMap["curPage"] = param.curPage;
		paraMap["numPerPage"] = param.numPerPage;
		paraMap["act_id"] = param.act_id;
		paraMap["account_id"] = param.account_id;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}

	/**
	 * 功能号 401805 普通用户参赛名单
	 * 
	 * @param Y
	 */
	function queryJoinUser(param, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401805";
		paraMap["act_id"] = param.act_id;
		paraMap["user_id"] = param.user_id;
		paraMap["curPage"] = param.curPage;
		paraMap["numPerPage"] = param.numPerPage;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}

	// 模拟炒股帐号数据统计
	function queryPortfolioSumByAccountId(param, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401816";
		paraMap["account_id"] = param.account_id;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}

	// 盈亏前五笔
	function loadInvestStkProfitInfo(param, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401819";
		paraMap["account_id"] = param.account_id;
		paraMap["row_num"] = param.row_num;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}

	// 完整收益
	function findOperateInfoByAccountId(param, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401821";
		paraMap["account_id"] = param.account_id;
		paraMap["curPage"] = param.curPage;
		paraMap["numPerPage"] = param.numPerPage;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}

	/**
	 * 用户大赛的详细信息
	 */
	function queryMyMatchAllInfo(queryMap, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401823";
		paraMap["user_id"] = queryMap["user_id"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	;

	/**
	 * 功能号 401814 查询用户参加过比赛
	 * 
	 * @param userId
	 *            Y
	 */
	function queryUserAllMatch(param, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "401814";
		paraMap["userId"] = param.user_id;
		paraMap["curPage"] = param.curPage;
		paraMap["numPerPage"] = param.numPerPage;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}

	/**
	 * 功能号 408322 查询用户参加过比赛
	 * 
	 * @param userId
	 *            Y
	 */
	function queryNormalCountList(param, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408322";
		paraMap["user_id"] = param.user_id;
		paraMap["curPage"] = param.curPage;
		paraMap["numPerPage"] = param.numPerPage;
		paraMap["customer_id"] = param.customer_id;// 游客id
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}

	/** ******************************应用接口结束******************************* */
});