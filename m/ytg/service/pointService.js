/**
 * 云投顾H5前端service层调用接口[观点相关]
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
			"queryPointList":queryPointList, //查询所有观点
			"queryPointDetails":queryPointDetails,  //查询单个观点详情
			"queryInvsestOtherView":queryInvsestOtherView, //查询理财师的其他观点
			"queryInvsestViewpageList":queryInvsestViewpageList, //查询投顾的观点包列表
			"addViewReadNum":addViewReadNum, //增加观点阅读数
			"setBuyViewpageType":setBuyViewpageType, //订阅接受观点包
			"queryViewComment":queryViewComment,  //用户评论
			"userCommentView":userCommentView,//用户评论
			"queryHotView":queryHotView,//最新观点
			"addCollectionview":addCollectionview, //收藏观点功能
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
	 * 热门观点（推荐观点）
	 * */
	function queryPointList(queryMap, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408342";
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
		
	}
	
	
	

	/**
	 * 热门观点详情(单个)（推荐观点）
	 *
	 * */
	function queryPointDetails(queryMap, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408041";
		paraMap["view_id"] = queryMap["view_id"];
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
		
	}
	
	
	/**
	 * 查询理财师的其他观点
	 */
	function  queryInvsestOtherView(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408042";
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		paraMap["invest_id"] = queryMap["invest_id"];
		paraMap["cur_view_id"] = queryMap["cur_view_id"];
		paraMap["row_num"] = queryMap["row_num"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 查询投顾的观点包列表
	 */
	function queryInvsestViewpageList(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408045";
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		paraMap["invest_id"] = queryMap["invest_id"];
		paraMap["user_id"] = queryMap["user_id"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 增加观点阅读数
	 */
	 function addViewReadNum(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408151";
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		paraMap["view_id"] = queryMap.view_id;
		paraMap["user_id"] = queryMap.user_id;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 订阅/接收消息/取消接收消息 观点包
	 */
	   function setBuyViewpageType(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408046";
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		paraMap["viewpage_id"] = queryMap["viewpage_id"];
		paraMap["user_id"] = queryMap["user_id"];
		paraMap["handle_type"] = queryMap["handle_type"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 查询观点评论
	 */
	function queryViewComment(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408361";
		paraMap["view_id"] = queryMap["view_id"];
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 用户评论观点
	 */
	    function userCommentView(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408334";
		paraMap["user_id"] = queryMap["user_id"];
		paraMap["view_id"] = queryMap["view_id"];
		paraMap["parent_id"] = queryMap["parent_id"];
		paraMap["comment_content"] = queryMap["comment_content"];
		paraMap["comment_state"] = queryMap["comment_state"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 热门观点
	 */
	function queryHotView(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408023";
		paraMap["row_num"] = queryMap["row_num"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	
	/**
	 * 收藏观点功能
	 */
	function addCollectionview(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408381";
		paraMap["view_id"] = queryMap["view_id"];
		paraMap["user_id"] = queryMap["user_id"];
		paraMap["col_status"] = queryMap["col_status"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/** ******************************应用接口结束******************************* */
});