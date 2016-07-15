/**
 * 云投顾H5前端service层调用接口[综合查询]
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
			"submitPhtoo" : submitPhtoo, //接口方法模板
			"searchPortfolio" : searchPortfolio, //全局搜索组合
			"searchPoint" : searchPoint, //全局搜索观点
			"searchQues" : searchQues, //全局搜索问答
			"getInstance" : getInstance,
			"destroy" : destroy
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
	 * 全局搜索—搜索组合
	 */
	function searchPortfolio(queryMap,callback,ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408337";
		paraMap["key_words"] = queryMap["key_words"];
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		paraMap["customer_id"] = queryMap["customer_id"]; //可传入用户Id,判断与组合的关注关系
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 全局搜索—搜索观点
	 */
	function searchPoint(queryMap,callback,ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408025";
		paraMap["key_words"] = queryMap["key_words"];
		paraMap["bond_type"] = queryMap["bond_type"]; //可不传
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 全局搜索—搜索观点
	 */
	function searchQues(queryMap,callback,ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408024";
		paraMap["key_words"] = queryMap["key_words"];
		paraMap["bond_type"] = queryMap["bond_type"]; //可不传
		paraMap["user_id"] = queryMap["user_id"]; //可不传
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/** ******************************应用接口结束******************************* */
});