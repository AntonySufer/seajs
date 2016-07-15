/**
 * 云投顾H5前端service层调用接口[投顾相关]
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
			//"submitPhtoo":submitPhtoo, //接口方法模板
			"queryPlanIntro":queryPlanIntro,
			"submitPlanIntro":submitPlanIntro,  //提交计划简介
			"queryInvestRunPlan":queryInvestRunPlan,  //投顾正在运行计划
			"queryInvestUnpublishPlan":queryInvestUnpublishPlan,  //查询投顾未发布计划
			"queryInvesHistPlan":queryInvesHistPlan,  //查询投顾历史计划
			"updateInvestOnlineTime":updateInvestOnlineTime,  //刷新投顾在线时间
			"queryInvestIsOnline":queryInvestIsOnline,  //判断投顾是否在线
			"investAnsQues":investAnsQues,  //投顾回答问题
			"queryAllInvest" : queryAllInvest, //查询全部投顾
 			"getInstance" : getInstance,
			"destroy" : destroy
	};
	function getInstance() {
		return mobileService;
	}
	module.exports = mobileService;
	
	
    /** ******************************应用接口开始******************************* */
	
	/**
	 * 查询投顾的计划简介
	 */
	   function queryPlanIntro(queryMap, callback, ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408050";
		paraMap["plan_id"] = queryMap.plan_id;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}; 
	
	/**
	 * 提交计划简介
	 */
	function submitPlanIntro(queryMap, callback, ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408051";
		paraMap["plan_id"] = queryMap["plan_id"];
		paraMap["introdution"] = queryMap["introdution"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 查询投顾正在运行计划
	 */
    	function queryInvestRunPlan(queryMap, callback, ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408052";
		paraMap["invest_id"] = queryMap.invest_id;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 查询投顾未发布计划
	 */
	function queryInvestUnpublishPlan(queryMap, callback, ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408053";
		paraMap["invest_id"] = queryMap["invest_id"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 查询投顾历史计划
	 */
	  function queryInvesHistPlan(queryMap, callback, ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408054";
		paraMap["invest_id"] = queryMap["invest_id"];
		paraMap["curPage"] =queryMap["curPage"] ;
		paraMap["numPerPage"] =queryMap["numPerPage"] ;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 刷新投顾在线时间
	 */
	  function updateInvestOnlineTime(queryMap, callback, ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408302";
		paraMap["invest_id"] = queryMap["invest_id"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 判断投顾是否在线
	 */
	   function queryInvestIsOnline(queryMap, callback, ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408303";
		paraMap["invest_id"] = queryMap["invest_id"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 投顾回答问题
	 */
    	function investAnsQues(param, callback, ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408202";
		paraMap["invest_id"] = queryMap["invest_id"];
		paraMap["ques_id"] = queryMap["ques_id"];
		paraMap["ques_create_time"] = queryMap["ques_create_time"];
		paraMap["answer_content"] = queryMap["answer_content"];
		paraMap["is_pay"] = queryMap["is_pay"];
		paraMap["ans_private_content"] = queryMap["ans_private_content"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 查询全部投顾
	 */
	   function queryAllInvest(queryMap, callback, ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408021";
		paraMap["bond_type"] = queryMap["bond_type"]; //证券类型,可不传
		paraMap["user_id"] = queryMap["user_id"]; //用户id
		paraMap["invest_name"] = queryMap["invest_name"]; //搜索的投顾姓名,可不传
		paraMap["curPage"] = queryMap["curPage"]; 
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
		
	
	
	/** ******************************应用接口结束******************************* */
});