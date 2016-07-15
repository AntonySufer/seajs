/**
 * 云投顾H5前端service层调用接口[用户相关]
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
		reqParamVo.setProtocol(ctrlParam.protocol);
		serviceSingleton.invoke(reqParamVo, callback);
	}
	function destroy() {
		serviceSingleton.destroy();
	}
	var mobileService = { 
			"submitPhtoo":submitPhtoo, //接口方法模板
			"register" : register, //注册
			"login":login,  //登录
			"autoLogin":autoLogin,  //自动登录
			"loginOut":loginOut,  //退出登录
			"loginSSO":loginSSO,  //第三方登录
			"registerWeboSSO":registerWeboSSO,  //第三方登录第三方账号注册（炒股大赛 微博登陆）或绑定存量用户
			"isWebocontestSSO":isWebocontestSSO,  //第三方登录是否已经绑定存量账户
			"getLoginInfo":getLoginInfo,  //获取登录信息
			"updateUserPassword":updateUserPassword,  //用户密码修改
			"findUserInfoByName":findUserInfoByName,  //查询用户是否存在 
			"findUserInfoById":findUserInfoById,  //查询用户信息 
			"findUserInfoByMobile":findUserInfoByMobile,  //查询手机号注册
			"resetPassword":resetPassword,  //找回密码
			"findInvestInfoById":findInvestInfoById,  //查询投顾信息
			"queryUserOrderList":queryUserOrderList,  //用户订单列表
			"userAddQuestion":userAddQuestion,  //用户提问
			"queryUserOrderDetail":queryUserOrderDetail,  //用户订单详情
			"queryUserQuesList":queryUserQuesList,  //用户提问列表
			"userSubInvest":userSubInvest,  //用户取消关注投顾
			"queryUserSubInvestList":queryUserSubInvestList,  //用户关注投顾列表
			"userIsSubInvest":userIsSubInvest,  //查询用户是否订阅了 该投顾
			"queryInvestData":queryInvestData,  //查询投顾数据统计
			"queryInvestAnsweredList":queryInvestAnsweredList,  //查询投顾已回答列表
			"queryInvestAnsweredPage":queryInvestAnsweredPage,  //查询投顾已回答列表
			"queryInvestNotAnsweredList":queryInvestNotAnsweredList,  //查询投顾待回答列表
			"investAddView":investAddView,  //投顾创建观点
			"queryInvestPublishView":queryInvestPublishView,  //查询投顾已发布的观点
			"queryInvestNotPublishView":queryInvestNotPublishView,  //查询投顾未发布的观点
			"investDeleteView":investDeleteView,  //投顾删除 未发布的观点
			"queryInvestDataSum":queryInvestDataSum,  //投顾主页观点数 计划数 观点包数  问答数
			"investAddViewDraft":investAddViewDraft,  //投顾创建观点草稿
			"queryInvestWaitConfirmView":queryInvestWaitConfirmView,  //查询投顾未审核的观点
			"queryInvestViewDraft":queryInvestViewDraft,  //查询投顾观点草稿
			"investDeleteViewDraft":investDeleteViewDraft,  //投顾删除观点草稿
			"queryViewDraftById":queryViewDraftById,  //查询观点草稿信息
			"userCancelOrder":userCancelOrder,  //用户取消订单 
			"creatLoginId":creatLoginId,  //第三方账号登录 完善账号密码
			"bindSsoForOld":bindSsoForOld,  //第三方账号比绑定
			"registerClientFromSSO":registerClientFromSSO,  //第三方账号注册
			"updateUserImage":updateUserImage,  //修改用户图像
			"sendMobileCode":sendMobileCode,  //获取验证码
			"updateInvesttime":updateInvesttime,  //实时更新投顾在线时间
			"getRasInfo":getRasInfo,  //返回加密密码跟投顾
			"updateInvestInfo" : updateInvestInfo, //修改用户基本资料
			"isSubView" : isSubView, //查看用户是否收藏了该观点
			"queryUserCollectionView":queryUserCollectionView, //查詢用戶收藏的列表
			"hlLogin":hlLogin,
			"weiboLogin":weiboLogin,//授权微博
			"getWeiboLoginResultInfo":getWeiboLoginResultInfo,//获取授权
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
	function submitPhtoo(queryMap, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "501503";  // 接口功能号
		paraMap["user_id"] = queryMap.user_id; //其他参数
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	
//	/**
//	 * 注册
//	 * */
	function register(queryMap, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408100";
		paraMap["user_name"] = queryMap.user_name;
		paraMap["password"] = queryMap.password;
		paraMap["mobile"] = queryMap.mobile;
		paraMap["mbCode"] = queryMap.mbCode;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	
	/**
	 * 微博登陆授权
	 * */
	function weiboLogin(callback) {
		var paraMap = {};
		paraMap["funcNo"] = "200001";
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap,callback, "",reqParamVo);
	}

	/**
	 * 获取微博登陆后的结果信息
	 * */
	function getWeiboLoginResultInfo(callback) {
		var paraMap = {};
		paraMap["funcNo"] = "200003";
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap,callback, "",reqParamVo);
	}
	
	
	/**
	 * 登录
	 */
	 function login(queryMap, callback, ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408369"; //408101(PC)
		paraMap["mobile"] = queryMap.mobile;
		paraMap["password"] = queryMap.password;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 自动登录
	 */
	function autoLogin(queryMap, callback, ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408152";
		paraMap["mobile"] = queryMap.mobile;
		paraMap["user_id"] = queryMap.user_id;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 退出登录
	 */
	    function loginOut(queryMap, callback, ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "10001";
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 第三方登录
	 */
	    function loginSSO(queryMap, callback, ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "407035";
		paraMap["login_uid"] = queryMap.loginUid;
		paraMap["channel_type"] = queryMap.channelType;
		paraMap["nick_name"] = queryMap.nickName;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 获取登录信息
	 */
	   function getLoginInfo(queryMap, callback, ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "10002";
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 用户密码修改
	 */
	function updateUserPassword(queryMap, callback, ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408102";
		paraMap["user_id"] = queryMap.user_id;
		paraMap["current_password"] = queryMap.current_password;
		paraMap["new_password"] = queryMap.new_password;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 查询用户信息是否已存在
	 */
	function findUserInfoByName(queryMap, callback, ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408103";
		paraMap["name"] = queryMap.name;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
		
	};
	/**
	 * 查询用户信息
	 */
	function  findUserInfoById(queryMap, callback, ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408060";
		paraMap["user_id"] = queryMap["user_id"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 查询手机号是否注册
	 */
	function findUserInfoByMobile(queryMap, callback, ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408145";
		paraMap["mobile"] = queryMap.mobile;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};

	/**
	 * 找回密码
	 */
	function resetPassword(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408104";
		paraMap["mobile"] = queryMap.mobile;
		paraMap["password"] = queryMap.password;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 查询投顾信息
	 */
	    function findInvestInfoById(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408105";
		paraMap["invest_id"] = queryMap.invest_id;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 用户提问
	 */
	function userAddQuestion(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408106";
		paraMap["user_id"] = queryMap["user_id"];
		paraMap["invest_id"] = queryMap["invest_id"];
		paraMap["ques_content"] = queryMap["ques_content"];
		paraMap["bond_type"] = queryMap["bond_type"];
		paraMap["is_pay"] = queryMap["is_pay"];
		paraMap["ques_price"] =queryMap["ques_price"] ;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 用户订单列表
	 */
	function queryUserOrderList(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408107";
		paraMap["user_id"] = queryMap["user_id"];
		paraMap["order_type"] =queryMap["order_type"] ;
		paraMap["pay_status"] = queryMap["pay_status"];
		paraMap["bond_type"] =queryMap["bond_type"] ;
		paraMap["curPage"] = queryMap["curPage"];
		paraMap["numPerPage"] = queryMap["numPerPage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 用户订单详情
	 */
	 function  queryUserOrderDetail(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408108";
		paraMap["user_id"] = queryMap.user_id;
		paraMap["order_no"] =queryMap.order_no ;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};

	/**
	 * 用户提问列表
	 */
   	function queryUserQuesList(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408115";
		paraMap["user_id"] = queryMap["user_id"];
		paraMap["ques_type"] = queryMap["ques_type"];
		paraMap["curPage"] =queryMap["curPage"] ;
		paraMap["numPerPage"] =queryMap["numPerPage"] ;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};

	/**
	 * 用户取消关注/关注投顾
	 */
	function userSubInvest(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408117";
		paraMap["user_id"] = queryMap.user_id;
		paraMap["invest_id"] = queryMap.invest_id;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 用户关注投顾列表
	 */
	function queryUserSubInvestList(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408118";
		paraMap["user_id"] = queryMap["user_id"];
		paraMap["sub_status"] = queryMap["sub_status"];
		paraMap["curPage"] =queryMap["curPage"] ;
		paraMap["numPerPage"] =queryMap["numPerPage"] ;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 查询用户是否订阅了该投顾
	 */
	 function userIsSubInvest(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408122";
		paraMap["user_id"] = queryMap.user_id;
		paraMap["invest_id"] = queryMap.invest_id;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 查询用户是否观察了该计划
	 */
	 function userIsSubPlan(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408125";
		paraMap["user_id"] = queryMap.user_id;
		paraMap["plan_id"] = queryMap.plan_id;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 查询投顾数据统计
	 */
	function queryInvestData(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408132";
		paraMap["invest_id"] =queryMap.invest_id;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 查询投顾已回答列表
	 */
	function queryInvestAnsweredList(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408130";
		paraMap["invest_id"] = queryMap["invest_id"];
		paraMap["curPage"] =queryMap["curPage"] ;
		paraMap["numPerPage"] =queryMap["numPerPage"] ;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 查询投顾已回答列表
	 */
	function queryInvestAnsweredPage(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408133";
		paraMap["invest_id"] = queryMap["invest_id"];
		paraMap["curPage"] =queryMap["curPage"] ;
		paraMap["numPerPage"] =queryMap["numPerPage"] ;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 查询投顾待回答列表
	 */
	function queryInvestNotAnsweredList(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408134";
		paraMap["invest_id"] = queryMap["invest_id"];
		paraMap["curPage"] =queryMap["curPage"] ;
		paraMap["numPerPage"] =queryMap["numPerPage"] ;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 投顾创建观点
	 */
	function investAddView(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408135";
		paraMap["title"] =queryMap["title"] ;
		paraMap["content"] =queryMap["content"] ;
		paraMap["introdution"] =queryMap["introdution"] ;
		paraMap["invest_id"] = queryMap["invest_id"];
		paraMap["bond_type"] =queryMap["bond_type"] ;
		paraMap["viewpage_id"] =queryMap["viewpage_id"] ;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 查询投顾已发布的观点
	 */
	function queryInvestPublishView(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408136";
		paraMap["invest_id"] = queryMap["invest_id"];
		paraMap["curPage"] =queryMap["curPage"] ;
		paraMap["numPerPage"] =queryMap["numPerPage"] ;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 查询投顾未发布的观点（待审核的观点）
	 */
	function queryInvestNotPublishView(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408147"; //408137为审核不通过的观点
		paraMap["invest_id"] = queryMap["invest_id"];
		paraMap["curPage"] =queryMap["curPage"] ;
		paraMap["numPerPage"] =queryMap["numPerPage"] ;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 投顾删除未发布的观点
	 */
	function investDeleteView(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408138";
		paraMap["invest_id"] = queryMap.invest_id;
		paraMap["view_id"] = queryMap.view_id;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 投顾主页观点数 计划数 观点包数  问答数
	 */
	function queryInvestDataSum(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408143";
		paraMap["invest_id"] = queryMap.invest_id;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 投顾创建观点草稿
	 */
	function investAddViewDraft(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408146";
		paraMap["title"] =queryMap["title"] ;
		paraMap["content"] =queryMap["content"] ;
		paraMap["introdution"] =queryMap["introdution"] ;
		paraMap["invest_id"] = queryMap["invest_id"];
		paraMap["bond_type"] =queryMap["bond_type"] ;
		paraMap["viewpage_id"] =queryMap["viewpage_id"] ;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 查询投顾未审核的观点
	 */
	function queryInvestWaitConfirmView(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408147";
		paraMap["invest_id"] = queryMap["invest_id"];
		paraMap["curPage"] =queryMap["curPage"] ;
		paraMap["numPerPage"] =queryMap["numPerPage"] ;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 查询投顾观点草稿
	 */
	function queryInvestViewDraft(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408148";
		paraMap["invest_id"] = queryMap["invest_id"];
		paraMap["curPage"] =queryMap["curPage"] ;
		paraMap["numPerPage"] =queryMap["numPerPage"] ;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 投顾删除观点草稿
	 */
	function investDeleteViewDraft(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408149";
		paraMap["invest_id"] = queryMap.invest_id;
		paraMap["view_id"] = queryMap.view_id;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 查询观点草稿信息
	 */
	function queryViewDraftById(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408150";
		paraMap["view_id"] = queryMap.view_id;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	//用户取消订单
	function userCancelOrder(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408217";
		paraMap["user_id"] = queryMap.user_id;
		paraMap["order_no"] = queryMap.order_no;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	
	/**
	 * 第三方账号登陆完善账号与密码
	 */
	function creatLoginId(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "407057";
		paraMap["mobile"] = queryMap.mobile;
		paraMap["mbCode"] = queryMap.mbCode;
		paraMap["password"] = queryMap.password;
		paraMap["nick_name"] = queryMap.nickName;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 第三方账号绑定
	 */
	function bindSsoForOld(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "407058";
		paraMap["login_id"] = queryMap["login_id"];
		paraMap["password"] = queryMap["password"];
		paraMap["access_token"] = queryMap["access_token"];
		paraMap["expires_in"] = queryMap["expires_in"];
		paraMap["refresh_token"] = queryMap["refresh_token"];
		paraMap["smallImage"] = queryMap["smallImage"];
		paraMap["bigImage"] = queryMap["bigImage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 第三方账号注册
	 */
	function registerClientFromSSO(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "407059";
		paraMap["mobile"] = queryMap["mobile"];
		paraMap["password"] = queryMap["password"]; 
		paraMap["mbCode"] = queryMap["mbCode"];
		paraMap["nick_name"] = queryMap["nick_name"];
		paraMap["access_token"] = queryMap["access_token"];
		paraMap["expires_in"] = queryMap["expires_in"];
		paraMap["refresh_token"] = queryMap["refresh_token"];
		paraMap["smallImage"] = queryMap["smallImage"];
		paraMap["bigImage"] = queryMap["bigImage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	
	/**
	 * 判断第三方是否已经绑定存量用户
	 */
	function isWebocontestSSO(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408384";
		paraMap["login_uid"] = queryMap["login_uid"];
		paraMap["channel_type"] = queryMap["channel_type"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	
	
	/**
	 * 第三方账号注册（炒股大赛 微博登陆）或存量用户绑定微博
	 */
	function registerWeboSSO(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408385";
		paraMap["login_uid"] = queryMap["login_uid"];
		paraMap["type"] = queryMap["type"];//1
		paraMap["channel_type"] = queryMap["channel_type"];
		paraMap["mobile"] = queryMap["mobile"];
		paraMap["password"] = queryMap["password"]; 
		paraMap["mbCode"] = queryMap["mbCode"];
		paraMap["nick_name"] = queryMap["nick_name"];
		paraMap["access_token"] = queryMap["access_token"];
		paraMap["expires_in"] = queryMap["expires_in"];
		paraMap["refresh_token"] = queryMap["refresh_token"];
		paraMap["smallImage"] = queryMap["smallImage"];
		paraMap["bigImage"] = queryMap["bigImage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	
	
	
	/**
	 * 修改用户图像
	 */
	function updateUserImage(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "407063";
		paraMap["user_id"] = queryMap["user_id"];
		paraMap["face_image"] = queryMap["bigImage"];
		paraMap["face_image_small"] = queryMap["smallImage"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 获取验证码
	 */
	function sendMobileCode(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "10003";
		paraMap["mobile"] = queryMap.mobile;
		paraMap["vCode"] = queryMap.vCode; //新增
		paraMap["ctrlType"] = queryMap.ctrlType; //新增
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 *  实时更新投顾在线时间
	 */
	function updateInvesttime(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408302";
		paraMap["invest_id"] = queryMap.invest_id;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 *  返回加密密码跟投顾
	 * */
	function getRasInfo(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "1000000";
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 *  修改投顾基本信息(普通用户不传introduction)
	 * */
	function updateInvestInfo(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408355";
		paraMap["invest_id"] = queryMap["invest_id"];
		paraMap["login_id"] = queryMap["login_id"]; //备注：其实修改的内容为user_name
		paraMap["sex"] = queryMap["sex"];
		paraMap["introdution"] = queryMap["introdution"];
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 *  收藏观点列表
	 */
	function queryUserCollectionView(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408379";
		paraMap["curPage"] =queryMap["curPage"] ;
		paraMap["numPerPage"] =queryMap["numPerPage"] ;
		paraMap["user_id"] = queryMap.user_id; 
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 *  看用户是否收藏了 该观点
	 */
	function isSubView(queryMap,callback,ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408380";
		paraMap["view_id"] = queryMap.view_id;
		paraMap["user_id"] = queryMap.user_id; 
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 华林登录（专用）
	 */
	 function hlLogin(queryMap, callback, ctrlParam){
		var paraMap = {};
		paraMap["funcNo"] = "408382"; 
		paraMap["userInfo"] = queryMap.userInfo;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 注册
	 * */
	function register(queryMap, callback, ctrlParam) {
		var paraMap = {};
		paraMap["funcNo"] = "408100";
		paraMap["user_name"] = queryMap.user_name;
		paraMap["password"] = queryMap.password;
		paraMap["mobile"] = queryMap.mobile;
		paraMap["mbCode"] = queryMap.mbCode;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	
	/** ******************************应用接口结束******************************* */
});