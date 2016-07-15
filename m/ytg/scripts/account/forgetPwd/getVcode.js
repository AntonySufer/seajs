/**
 * 找回密码1(输入手机号)
 */
define("ytg/scripts/account/forgetPwd/getVcode", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
        validatorUtil = require("validatorUtil"),
        
        userService = require("userService"),
		
		pageCode = "account/forgetPwd/getVcode", 
		_pageId = "#account_forgetPwd_getVcode ";
	
	//全局变量
	
	/**
	 * 初始化
	 */
	function init() {
		//限制登录框长度
		$(_pageId + " #mobile").attr("maxlength","11");
		
		//按钮不可点击样式
		//$(_pageId + ".login_btn").find('a').addClass("disabled");
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent() {
		//头部返回
		appUtils.bindEvent($(_pageId + ".icon_back"), function(e) {
			appUtils.pageBack();
		});
		
		//勾选用户协议后,按钮方可互动
		/*appUtils.bindEvent($(_pageId + "#protocol"), function(e) {
			if($(this).siblings('input').attr("checked") == 'checked'){
				$(this).siblings('input').removeAttr("checked");
				$(_pageId + ".login_btn").find('a').addClass("disabled");
			}
			else{
				$(this).siblings('input').attr("checked","checked");
				$(_pageId + ".login_btn").find('a').removeClass("disabled");
			}
		});*/
		
		//手机号码输入框
		appUtils.bindEvent($(_pageId + "#mobile"),function(e){
			var mobile =$(_pageId + "#mobile").val();
			if(mobile != ""){
				var mobile1 = mobile;
				if(mobile.length >3 && mobile.length<=7)
					mobile1 = mobile.substring(0,3)+" "+mobile.substring(3,mobile.length);
				else if(mobile.length>7)
					mobile1 = mobile.substring(0,3)+" "+mobile.substring(3,7)+" "+mobile.substring(7,11)
				$(_pageId + "#prompt").find("input").attr("value",mobile1);
				$(_pageId + "#prompt").show();
				/*//按钮是否可点击
				if(validatorUtil.isMobile(mobile)){
					$(_pageId + ".login_btn").find('a').removeClass("disabled");
				}
				else{
					$(_pageId + ".login_btn").find('a').addClass("disabled");
				}*/
			}
			else{
				$(_pageId + "#prompt").hide();
			}
		},"input");
		
		//获取验证码
		appUtils.bindEvent($(_pageId + ".login_btn"),function(e){
			if($(this).find('a').hasClass("disabled")){
				return ;
			}
			var mobile =$(_pageId + "#mobile").val();
			if(mobile==""&&mobile.length<1){
				layerUtils.iMsg(-1,"手机号码不能为空");
				return ;
			}else if(mobile<11){
				layerUtils.iMsg(-1,"手机号码格式不正确");
				return ;
			}
			else if(!validatorUtil.isMobile(mobile)){
				layerUtils.iMsg(-1,"手机号码格式不正确");
				return ;
			}
			else{
				//查询手机号是否注册
				chekMobileIsReg(mobile);
			}
		});
	}
	
	//***************************【绑定事件方法】******************************//
	
	/**
	 * 查询手机号码是否注册
	 * */
	function chekMobileIsReg(mobile){
		var finduserinfobymobile=function(resultVo){
			if(resultVo.error_no==0){
				sendMessage(mobile); //发送验证码
			}else if(resultVo.error_no=="-40814502"){
				//未被注册的情况
				layerUtils.iMsg(-1,"该手机号无对应账户");
			}
		};
		var param = {
				"mobile" : mobile
		};
		userService.findUserInfoByMobile(param,finduserinfobymobile);
	}
	
	/**
	 * 发送短信验证码
	 * */
	function sendMessage(mobile){
		// 备注： 测试用
		//到验证码 校验页面
		appUtils.pageInit(pageCode,"account/forgetPwd/checkVcode",{"mobile":mobile});
		
		var afterSendMobileCode = function(resultVo){
			 if(resultVo.error_no ==  0){
				 //到验证码 校验页面
				 appUtils.pageInit(pageCode,"account/forgetPwd/checkVcode",{"mobile":mobile});
			 }else if(resultVo.error_no!=-997){
				 layerUtils.iAlert("短信验证码发送失败"+resultVo.error_info,-1);
			 }
		 };
		 userService.sendMobileCode({"mobile":mobile,"ctrlType":"1"},afterSendMobileCode);
	}
	//*********************************************************************//
	
	/**
	 * 销毁
	 */
	function destroy() {
		//重置页面所有的输入值
		appUtils.pageResetValue();
		$(_pageId).find("input").val("");
	}

	var account_forgetPwd_getVcode = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = account_forgetPwd_getVcode;
});