/**
 * 登录页
 */
define("ytgMatch/scripts/account/login", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
	    validatorUtil = require("validatorUtil"),
        gconfig = require("gconfig"),
        pageCommon = require("pageCommon"),
        
        userService = require("userService"),
		
		pageCode = "account/login", 
		_pageId = "#account_login ";
	
	//全局变量
   var nickName ="";
   var access_token = "";
   var login_uid = "";	
   var exspireIn ="";//失效时间
	
	/**
	 * 初始化
	 */
	function init() {
		appUtils.clearSStorage("userName"); //清除姓名
		appUtils.clearSStorage("userType");//清除类型

		//获取第三方信息
		login_uid = appUtils.getSStorageInfo("login_uid",true);//第三方账号id
		access_token = appUtils.getSStorageInfo("access_token",true);//授权码
		nickName = appUtils.getSStorageInfo("nickName",true);//用户昵称
		exspireIn = appUtils.getSStorageInfo("exspireIn",true);//用户昵称
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent() {
		//头部返回
		appUtils.bindEvent($(_pageId + ".icon_back"), function(e) {
			appUtils.pageBack();
		});
		
		//登录按钮
		appUtils.bindEvent($(_pageId + ".login_btn"), function(e) {
			//登录
			if (login_uid) {
				weiboLoginFunc();//第三方微博登陆
			}else{
				loginFunc();
			}
			
		});
		
		/*//注册
		appUtils.bindEvent($(_pageId + "#register"), function(e) {
			appUtils.pageInit(pageCode,"account/register/userInformation");
		});*/
		
		//忘记密码
		appUtils.bindEvent($(_pageId + "#forget"), function(e) {
			appUtils.pageInit(pageCode,"account/forgetPwd/checkVcode");
		});
		
		
		//手机号码
		appUtils.bindEvent($(_pageId + "#mobile"), function(e) {
			var mobile = $(_pageId + "#mobile").val();
			if(mobile==""&&mobile.length<1){
				$(_pageId+"#password").val("");
			}
		},"input");

	/*	//微博登陆授权
		appUtils.bindEvent($(_pageId + "#weibo"), function(e) {
			var callBackFunc = function (resultVo){
				if(resultVo.error_no == 0){
					var result = resultVo.results[0];
					//跳转到授权页面
					appUtils.sendDirect(result.url);
				}else{
					layerUtils.iMsg(resultVo.error_info,-1);
				}
			};
			userService.weiboLogin(callBackFunc);
		});*/
	}
	
	//***************************【绑定方法】******************************//
	/**
	 *证券登录
	 * */
	function loginFunc(){
		var mobile = $(_pageId + "#mobile").val();
		var password = $(_pageId + "#password").val();
		if(validatorUtil.isEmpty(mobile)){
			layerUtils.iMsg(-1,"手机号不能为空");
			return ;
		}
		else if(!validatorUtil.isMobile(mobile)){
			layerUtils.iMsg(-1,"手机号格式不正确");
			return ;
		}
		else if(validatorUtil.isEmpty(password)){
			layerUtils.iMsg(-1,"密码不能为空");
			return ;
		}
		var param = {
			"mobile" : mobile,
			"password" : password
		};
		var ctrlParam = {
				"isLastReq" : true, //是否是最后一次请求
				"isShowWait" : true //是否显示等待层
		};
	
			//不可重复提交表单
			//afterCommitDeal();
			userService.login(param,function callBack(resultVo){
				if(Number(resultVo.error_no) == 0){
					//将登录信息写入缓存
					var result = resultVo.results[0];
					var userId = result.user_id;
					var loginId = result.login_id;
					var userType = result.user_type;
					var userName = result.user_name;
					//登录后,设置相关cookie
					appUtils.setSStorageInfo("_isLoginIn","true");
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
					//allowCommitDeal();
					layerUtils.iAlert("登录失败:"+resultVo.error_info,-1);
				}
			},ctrlParam);
		
	}
	
	
	/**
	 *微博登陆并绑定存量账号
	 * */
	function weiboLoginFunc(){
		var mobile = $(_pageId + "#mobile").val();
		var password = $(_pageId + "#password").val();
		if(validatorUtil.isEmpty(mobile)){
			layerUtils.iMsg(-1,"手机号不能为空");
			return ;
		}
		else if(!validatorUtil.isMobile(mobile)){
			layerUtils.iMsg(-1,"手机号格式不正确");
			return ;
		}
		else if(validatorUtil.isEmpty(password)){
			layerUtils.iMsg(-1,"密码不能为空");
			return ;
		}
		var param = {
				"nick_name" : nickName,//账户名称
				"password" : password,//密码
				"type" : 1,//密码
				"access_token":access_token,//授权码
				"mobile" : mobile,//电话
				"channel_type" : 3,//第三方类型
				"expires_in" :exspireIn,//第三方类型
				"login_uid":login_uid //第三方账户id
		};
		var ctrlParam = {
				"isLastReq" : true, //是否是最后一次请求
				"isShowWait" : true //是否显示等待层
		};
			
			//不可重复提交表单
			//afterCommitDeal();
			userService.registerWeboSSO(param,function callBack(resultVo){
				if(Number(resultVo.error_no) == 0){
					//将登录信息写入缓存
					var result = resultVo.results[0];
					var userId = result.user_id;
					var loginId = result.login_id;
					var userType = result.user_type;
					var userName = result.user_name;
					//登录后,设置相关cookie
					appUtils.setSStorageInfo("_isLoginIn","true");
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
					appUtils.pageInit(pageCode,"index");
				}
				else{
					//allowCommitDeal();
					layerUtils.iAlert("登录失败:"+resultVo.error_info,-1);
				}
			},ctrlParam);
		
	}
	
	//表单提交后
	/*function afterCommitDeal(){
		isCanCommit = false;
		$(_pageId+" .login_btn").addClass("disabled_btn");
		$(_pageId+" .login_btn").val("正在登录...");
	}*/
	
	//允许提交处理
	/*function allowCommitDeal(){
		isCanCommit = true;
		$(_pageId+" .login_btn").removeClass("disabled_btn");
		$(_pageId + ".login_btn").val("登录");
	}*/
	
	//***************************【初始化方法】******************************//
	
	//*********************************************************************//
	
	/**
	 * 销毁
	 */
	function destroy() {
		//重置页面所有的输入值
		appUtils.pageResetValue();
		$(_pageId).find("input").val("");
		//allowCommitDeal();
	}

	var user_login = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = user_login;
});