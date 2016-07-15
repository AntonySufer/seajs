/**
 * 找回密码3(重置密码)
 */
define("ytgMatch/scripts/account/forgetPwd/resetPwd", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
        validatorUtil = require("validatorUtil"),
        pageCommon = require("pageCommon"),
        
        userService = require("userService"),
        
		pageCode = "account/forgetPwd/resetPwd", 
		_pageId = "#account_forgetPwd_resetPwd ";
	
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
		appUtils.bindEvent($(_pageId + "#reg_button"), function(e) {
			//找回密码
			
			resetPwdFunc();
		});
	}
	
	//***************************【绑定事件方法】******************************//
	
	
	/**
	 * 找回密码
	 * */
	function resetPwdFunc(){
		var password = $(_pageId + "#newPwd").val(); //新密码
		var rePwd = $(_pageId + "#rePwd").val(); //重复密码
		
		if(validatorUtil.isEmpty(password) || password.length<6 || password.length>18){
			layerUtils.iMsg(-1,"密码不能为空,长度为6~18位");
			return ;
		}
		else if(!password.match(/^[A-Za-z0-9]+$/)){
			layerUtils.iMsg(-1,"密码应为字母与数字的组合");
			return;
		}else if(validatorUtil.isEmpty(rePwd) ||rePwd==null||""==rePwd){
			layerUtils.iMsg(-1,"重复密码不能为空");
			return ;
		}
		else if(rePwd != password){
			layerUtils.iMsg(-1,"两次密码不一致");
			return;
		}
		if(isCanCommit){
			//不可重复提交表单
			afterCommitDeal();
			//注册回调
			var completeRegester = function(resultVo){
				if(resultVo.error_no == 0){
					//layerUtils.iMsg(0,"重置成功!");
					//注册成功后，直接登录
					//loginFunc(mobile,password);
					appUtils.pageInit(pageCode,"account/login");
				}else{
					layerUtils.iAlert("重置密码失败:"+resultVo.error_info,-1);
					//出错后允许继续注册
					allowCommitDeal();
				}
			};
			var param = {
					"password" : password,
					"mobile" : mobile
			};
			userService.resetPassword(param,completeRegester);
		}
		
	}
	
	//表单提交后
	function afterCommitDeal(){
		isCanCommit = false;
		nocanReg();
		$(_pageId+" #register").html("重 置 中...");
	}
	
	//允许提交处理
	function allowCommitDeal(){
		isCanCommit = true;
		canReg();
		$(_pageId+" #register").html("重 置 密 码");
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
				appUtils.pageInit(pageCode,"account/login");
				//pageCommon.loginToPage(pageCode);
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

	var account_forgetPwd_resetPwd = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = account_forgetPwd_resetPwd;
});