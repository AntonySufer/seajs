/**
 * 注册页面2(校验 手机验证码)
 */
define("ytg/scripts/account/register/checkVcode", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
        validatorUtil = require("validatorUtil"),
        
        userService = require("userService"),
		
		pageCode = "account/register/checkVcode", 
		_pageId = "#account_register_checkVcode ";
	
	//全局变量
	var mobile = null; //页面传参 手机号码
	var count = 180; //验证码 有效期 180s
	var curCount = 0; //当前剩余秒数  开始为0
	
	/**
	 * 初始化
	 */
	function init() {
		//获取页面传参
		mobile = appUtils.getPageParam("mobile");
		
		//计时器
		curCount = count;
		InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent() {
		//头部返回
		appUtils.bindEvent($(_pageId + ".icon_back"), function(e) {
			appUtils.pageBack();
		});
		
		//下一步
		appUtils.bindEvent($(_pageId + ".login_btn"), function(e) {
			//校验短信验证码
			checkVCode();
		});
	}
	
	//***************************【绑定事件方法】******************************//
	
	//短信验证码校验
	function checkVCode(){
		var mbCode = $(_pageId+"#mbCode").val();
		var timing=$(_pageId+"#timing").text();
		if(timing=='0s')
		{
			layerUtils.iMsg(-1,"验证码过期请重新获取");
			return ;
		}
		else  if(mbCode==""&& mbCode.length<1){
			layerUtils.iMsg(-1,"验证码不能为空");
			return ;
			
		}else if(mbCode.length != 6 || !validatorUtil.isNumeric(mbCode)){
			layerUtils.iMsg(-1,"验证码格式不正确");
			return ;
		}
		else{
			//向接入层验证短信验证码
			$.ajax({
			    type: "POST", //用POST方式传输
			    dataType: "text", //数据格式:JSON
			    url: gconfig.global.domain + "/servlet/SentMobileMsg?function=CheckVcode", //目标地址
			    data:  "mobile=" + mobile + "&mbCode=" + mbCode,
			    error: function (XMLHttpRequest, textStatus, errorThrown) { 
			    	layerUtils.iMsg(-1,"短信验证码验证过程失败");
			    },
		        success: function (msg){ 
		        	var result = eval(msg)[0];
		        	//短信验证成功后不可修改手机号码
		        	if(result.resultNo == '0'){
		        		//停止计时
		        		window.clearInterval(InterValObj);
		        		//验证通过后不能重新发送
		        		curCount = -1;
		        		
		        		//到完善资料页面
		        		appUtils.pageInit(pageCode,"account/register/userInformation",{"mobile":mobile,"mbCode":mbCode});
		        	}
		        	if(result.resultNo == '-1'){
						var msg = result.message;
		        		layerUtils.iAlert(msg,-1);
		        	}
		        }
		     });
			
			//拦截器验证短信验证码
			var afterSendMobileCode = function(resultVo){
				if(resultVo.error_no ==  0){
					//停止计时
					//window.clearInterval(InterValObj);
					//验证通过后不能重新发送
					//curCount = -1;

					//到完善资料页面
					appUtils.pageInit(pageCode,"account/register/userInformation",{"mobile":mobile,"mbCode":mbCode});
				}else if(resultVo.error_no!=-997){
					layerUtils.iAlert(resultVo.error_info,-1);
				}
			};
			userService.sendMobileCode({"mobile":mobile,"vCode":mbCode,"ctrlType":"2"},afterSendMobileCode);
			
			// 备注： 测试用
			//到完善资料页面
			appUtils.pageInit(pageCode,"account/register/userInformation",{"mobile":mobile,"mbCode":mbCode});
			
		}
	}
	
	//***************************【初始化方法】******************************//
	//timer处理函数
	function SetRemainTime() {
        if (curCount == 0) {                
            window.clearInterval(InterValObj);//停止计时器
            //layerUtils.iMsg(-1,"验证码过期,请重新获取");
            //$(_pageId+".login_btn .ui.button").css("background:#999; color:#ddd;");
        }
        else {
            curCount--;
            $(_pageId+".timing").html(curCount + "s");
        }
	}
	
	//停止计数器
	function removeInterval(){
		//验证成功后停止计时器
    	window.clearInterval(InterValObj);
    	//验证成功后，计数回0
    	curCount = 0;
	}
	//*********************************************************************//
	
	/**
	 * 销毁
	 */
	function destroy() {
		//重置页面所有的输入值
		appUtils.pageResetValue();
		$(_pageId).find("input").val("");
		removeInterval();
	}

	var account_register_checkVcode = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = account_register_checkVcode;
});