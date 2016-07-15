/**
 * 登录页
 */
define("ytg/scripts/account/login", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
	    validatorUtil = require("validatorUtil"),
        gconfig = require("gconfig"),
        pageCommon = require("pageCommon"),
        
        userService = require("userService"),
		
		pageCode = "account/login", 
		_pageId = "#account_login ";
	
	//全局变量
	var isCanCommit = true; //表单是否可以提交
	
	/**
	 * 初始化
	 */
	function init() {
		//alert("登录");
		appUtils.clearSStorage("userName"); //清除姓名
		appUtils.clearSStorage("userType");//清除类型
	
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
			loginFunc();
		});
		
		//注册
		appUtils.bindEvent($(_pageId + "#register"), function(e) {
			appUtils.pageInit(pageCode,"account/register/getVcode");
		});
		
		//忘记密码
		appUtils.bindEvent($(_pageId + "#forgetPwd"), function(e) {
			appUtils.pageInit(pageCode,"account/forgetPwd/getVcode");
		});
		//忘记密码
		appUtils.bindEvent($(_pageId + "#mobile"), function(e) {
			var mobile = $(_pageId + "#mobile").val();
			if(mobile==""&&mobile.length<1){
				$(_pageId+"#password").val("");
			}
		},"input");

		
	}
	
	//***************************【绑定方法】******************************//
	/**
	 * 登录
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
		if(isCanCommit){	
			//不可重复提交表单
			//afterCommitDeal();
			userService.login(param,function callBack(resultVo){
				if(Number(resultVo.error_no) == 0){
					//layerUtils.iMsg(0,"登录成功");
					
					//allowCommitDeal();
					
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