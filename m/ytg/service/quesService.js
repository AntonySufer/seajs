/**
 * 云投顾H5前端service层调用接口[问答相关]
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
			"queryQuesList":queryQuesList,//查询所有问题
			"queryQuesDetails":queryQuesDetails, //查询单个问题详情
			"queryInvsestOtherQues":queryInvsestOtherQues,//理财师回答的其他问题
			"querySysRecmdInvest":querySysRecmdInvest,  //提问系统推荐理财师
			"queryRemainAskNum":queryRemainAskNum,  //客户免费问答次数 
			"AnswerQuestion":AnswerQuestion,      //回答问题
			"commitQuestion":commitQuestion,      //提交问题
			"queryInvestInfo":queryInvestInfo,   //查询投顾信息
			"queryInvestAnsweredQues":queryInvestAnsweredQues, //投顾已回答问题
			"queryUserAnsweredQues":queryUserAnsweredQues,   //查询用户已回答问题
			"newQues":newQues, //最新提问 
			"newAnswer":newAnswer, //最新回答
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
	 * 查询所有问题
	 * */
	function queryQuesList(queryMap, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408030";
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
		
	}
	
	/**
	 * 查询单个问题详情
	 * */
	function queryQuesDetails(queryMap, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408353";
		paraMap["ques_id"] = queryMap["ques_id"];
		paraMap["rows"] = queryMap["rows"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
		
	}
	
	/**
	 * @param param json格式入参
	 * @callback 回调处理
	 * @ctrlParam json格式控制参数，包括isLastReq、isAsync、isShowWait等
	 * 理财师回答的其他问题
	 * */
	function queryInvsestOtherQues(queryMap, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408032";
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
		
	}
	/**
	 * @param param json格式入参
	 * @callback 回调处理
	 * @ctrlParam json格式控制参数，包括isLastReq、isAsync、isShowWait等
	 * 提问系统推荐理财师
	 * */
	function querySysRecmdInvest(queryMap, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408033";
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
		
	}
	/**
	 * 客户免费问答次数(剩余提问次数)
	 */
	   function  queryRemainAskNum(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408300";
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 回答问题
	 */
	   function AnswerQuestion(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408336";
		paraMap["user_id"] = queryMap["user_id"];
		paraMap["ques_id"] = queryMap["ques_id"];
		paraMap["ques_create_time"] = queryMap["ques_create_time"];
		paraMap["answer_content"] = queryMap["answer_content"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 
	 *提交问题
	 */
        function commitQuestion(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408339";
		paraMap["user_id"] = queryMap["user_id"];
		paraMap["invest_id"] = queryMap["invest_id"];
		paraMap["ques_content"] = queryMap["ques_content"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	
	//查询投顾信息
	    function queryInvestInfo(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408105";
		paraMap["invest_id"] = queryMap["invest_id"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	//查询投顾已回答问题
	    function queryInvestAnsweredQues(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408364";
		paraMap["invest_id"] = queryMap["invest_id"];
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	//查询用户已回答问题
	    function queryUserAnsweredQues(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408367";
		paraMap["invest_id"] = queryMap["invest_id"];
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 最新提问
	 */
	function newQues(queryMap,callback,ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408347";
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};

	/**
	 * 最新回答
	 */
	function newAnswer(queryMap,callback,ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408348";
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	
	
	/** ******************************应用接口结束******************************* */
});