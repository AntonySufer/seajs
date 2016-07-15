/**
 * 注册页面3(设置云投顾账户)
 */
define("ytg/scripts/account/register/userInformation", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
        validatorUtil = require("validatorUtil"),
        pageCommon = require("pageCommon"),
        
        userService = require("userService"),
        
		pageCode = "account/register/userInformation", 
		_pageId = "#account_register_userInformation ";
	
	//全局变量
	var isCanCommit = true; //表单是否允许提交
	var mobile = null; //页面传参  手机号码
	var mbCode = null; //页面传参  短信验证码
	
	/**
	 * 初始化
	 */
	function init() {
		//获取页面传参
		mobile = appUtils.getPageParam("mobile");
		mbCode = appUtils.getPageParam("mbCode");
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent() {
		//头部返回
		appUtils.bindEvent($(_pageId + ".icon_back"), function(e) {
			appUtils.pageBack();
		});
		
		//完成
		appUtils.bindEvent($(_pageId + ".login_btn"), function(e) {
			//注册
			registerFunc();
		});
	}
	
	//***************************【绑定事件方法】******************************//
	/**
	 * 注册
	 * */
	function registerFunc(){
		var nickName = $(_pageId + ".name_text").val(); //昵称 
		var password = $(_pageId + ".psw_text").val(); //密码
		
		if(validatorUtil.isEmpty(nickName)){
			layerUtils.iMsg(-1,"昵称不能为空");
			return ;
		}
		else if(validatorUtil.isEmpty(password) || password.length<6 || password.length>18){
			layerUtils.iMsg(-1,"密码不能为空,长度为6~18位");
			return ;
		}
		else if(!password.match(/^[A-Za-z0-9]+$/)){
			layerUtils.iMsg(-1,"密码应为字母与数字的组合");
			return;
		}
		if(isCanCommit){
			//不可重复提交表单
			afterCommitDeal();
			//注册回调
			var completeRegester = function(resultVo){
				if(resultVo.error_no == 0){
					var result = resultVo.results;
					var userInfo = result[0];
					//userInfo = $.jsonToStr(userInfo);
					userInfo = JSON.stringify(userInfo);
					appUtils.setSStorageInfo("userInfo_ytg",userInfo);
					//layerUtils.iMsg(0,"注册成功!");
					
					//注册成功后，直接登录
					loginFunc(mobile,password);
				}else{
					//出错后允许继续注册
					allowCommitDeal();
				}
			};
			var param = {
					"user_name" : nickName,
					"password" : password,
					"mobile" : mobile,
					"mbCode" : mbCode
			};
			userService.register(param,completeRegester);
		}
		
	}
	
	//表单提交后
	function afterCommitDeal(){
		isCanCommit = false;
		nocanReg();
		$(_pageId+" #register").html("注册中...");
	}
	
	//允许提交处理
	function allowCommitDeal(){
		isCanCommit = true;
		canReg();
		$(_pageId+" #register").html("完 成");
	}
	
	//可注册
	function canReg(){
		//$(_pageId+" #register").css("background","none repeat scroll 0 0 #e60808");
		$(_pageId+" #register").attr("href","javascript:void(0)");
	}
	
	//不可注册
	function nocanReg(){
		//$(_pageId+" #register").css("background","none repeat scroll 0 0 #61503f");
		$(_pageId+" #register").removeAttr("href");
	}
	
	/***
	 * 登录
	 * */
	function loginFunc(mobile,password){
		var param = {
				"mobile" : mobile,
				"password" : password
		};
		var ctrlParam = {
				"isLastReq" : true, //是否是最后一次请求
				"isShowWait" : true //是否显示等待层
		};
		userService.login(param,function callBack(resultVo){
			if(Number(resultVo.error_no) == 0){
				//layerUtils.iMsg(0,"登录成功");
				
				//将登录信息写入缓存
				var result = resultVo.results[0];
				var userId = result.user_id;
				var loginId = result.login_id;
				var userType = result.user_type;
				var userName = result.user_name;
				appUtils.setSStorageInfo("_isLoginIn","true",true);
				appUtils.setSStorageInfo("userId",userId,true);
				appUtils.setSStorageInfo("loginId",loginId,true);
				appUtils.setSStorageInfo("userType",userType,true);
				appUtils.setSStorageInfo("userName",userName,true);
				//appUtils.setSStorageInfo("_isFirstLoginIn",true,true);
				/*if(appUtils.getPageParam("_isTNine")!="" && appUtils.getPageParam("_isTNine")!=null && appUtils.getPageParam("_isTNine")!=undefined){
					appUtils.pageBack();
				}else{
					//跳转到登录后的页面
					appUtils.pageInit(pageCode,"account/bindSuccess",{"LoginId":LoginId,"nickName":nickName});
				}	*/
				pageCommon.loginToPage(pageCode);
			}
			else{
				layerUtils.iAlert("登录失败:"+resultVo.error_info,-1);
			}
		},ctrlParam);
	}
	//*********************************************************************//
	
	/**
	 * 销毁
	 */
	function destroy() {
		$(_pageId).find("input").val("");
	}

	var account_register_userInformation = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = account_register_userInformation;
});