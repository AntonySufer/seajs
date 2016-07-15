/**
 * 注册页面3(设置云投顾账户)
 */
define("ytgMatch/scripts/account/register/userInformation", function(require, exports, module) {
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
	var checkboxFlag =true;//是否选中当选
	var mobile = null; //页面传参  手机号码
	var mbCode = null; //页面传参  短信验证码
	var count = 120; //验证码 有效期 180s
	var curCount = 0; //当前剩余秒数  开始为0
	
	
	var nickName =null;//账户名称
	var access_token = null;//授权码
	var login_uid =null;//第三方账户id
	var exspireIn ="";//失效时间
	var InterValObj =null;
	
	/**
	 * 初始化
	 */
	function init() {
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
		
		//完成
		appUtils.bindEvent($(_pageId + "#register_button"), function(e) {
			//验证非空等
			if (checkboxFlag) {
				if (checkMobile()&& checkCode() &&checkPassword() &&  checkRules()) {
					checkVCode();//验证短信验证码
				} 
			}
		});
		
		//获取验证码
		appUtils.bindEvent($(_pageId + "#yangcode"),function(e){
			var value= $(this).text();
			var mobiles =$(_pageId + "#mobile").val();
			if (checkMobile()) {
				if (value.indexOf("验证码")!=-1 ||value=='0s') {
					 chekMobileIsReg(mobiles);
				}
			}
			
		});
		
		/*//电话验证
		appUtils.bindEvent($(_pageId + "#mobile"),function(e){
		var mobiles = $(this).val();
			checkMobile();
		},"blur");
		
		//获取验证码
		appUtils.bindEvent($(_pageId + "#yzcode"),function(e){
			 checkCode();
		},"blur");
		
		//获取验证码
		appUtils.bindEvent($(_pageId + "#password"),function(e){
			checkPassword();
		},"blur");*/
		
		//规则
		appUtils.bindEvent($(_pageId + "#contents"),function(e){
			$(_pageId + "#gtw_clause").show();
			 e.stopPropagation();
		});
		
		//规则
		appUtils.bindEvent($(_pageId + "#close"),function(e){
			$(_pageId + "#gtw_clause").hide();
		});
		
		//确认规则
		appUtils.bindEvent($(_pageId + "#pin_btn"),function(e){
			$(_pageId + "#gtw_clause").hide();
			$(_pageId + "#radio_1").attr("checked",true);
		});
		
		//规则选择
		appUtils.bindEvent($(_pageId + "#radioCheck"),function(e){
			var checked =$(_pageId + "#radio_1").attr("checked");
			if (checked =="checked") {
				$(_pageId + "#radio_1").attr("checked",false);
				$(_pageId + "#register").css("background-color","#c8c8c8");
				checkboxFlag = false; //表单是否允许提交
				
			}else{
				$(_pageId + "#radio_1").attr("checked",true);
				$(_pageId + "#register").css("background-color","#f48c56");
				checkboxFlag = true; //表单是否允许提交
				}
		});
	}
	
	//***************************【绑定事件方法】******************************//
	/**
	 * 注册
	 * */
	function registerFunc(){
		var password = $(_pageId+"#password").val();
		var mobile = $(_pageId+"#mobile").val();
		var mbCode = $(_pageId+"#yzcode").val();
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
				}
			};
			var param = {
					"nick_name" : nickName,//账户名称
					"password" : password,//密码
					"mbCode" : mbCode,
					"mobile" : mobile//电话
					
			};
			userService.register(param,completeRegester);	
		}
	}
	
	/***
	 * 验证规则是否选中
	 */
	function checkRules(){
		var checked =$(_pageId + "#radio_1").attr("checked");
		if (checked !="checked") {
			layerUtils.iMsg(-1,"请签订注册协议");
			return false;;
		}else{
			return true;
	    }
		
	}
	
	
	/***
	 * 校验电话
	 */
	function checkMobile(){
		var mobile= $(_pageId+"#mobile").val();
		if(mobile==""&&mobile.length<1){
			layerUtils.iMsg(-1,"手机号码不能为空");
			return ;
		}if(mobile.length<11){
			layerUtils.iMsg(-1,"手机号码格式不正确");
			return ;
		}if(!validatorUtil.isMobile(mobile)){
			layerUtils.iMsg(-1,"手机号码格式不正确");
			return ;
		}else{
			return true;
		}
	}
	
	/***
	 * 校验短信
	 */
	function checkCode(){
		var mbCode= $(_pageId+"#yzcode").val();
		var timing =$(_pageId+"#yangcode").html();
		if(timing=='0s')
		{
			layerUtils.iMsg(-1,"验证码过期请重新获取");
			 count = 120; //验证码 有效期 180s
			 curCount = count; //当前剩余秒数  开始为0
			$(_pageId+"#checkVCode").html("重获验证码");
			return ;
		}
		if(mbCode==""&& mbCode.length<1){
			layerUtils.iMsg(-1,"验证码不能为空");
			return ;
			
		}if(mbCode.length != 6 || !validatorUtil.isNumeric(mbCode)){
			layerUtils.iMsg(-1,"验证码格式不正确");
			return ;
		}else{
			return true;
		}
	}
	
	/***
	 * 校验密码是否为空等格式
	 */
	function checkPassword(){
		var password=$(_pageId + "#password").val();
		if(validatorUtil.isEmpty(password) || password.length<6 || password.length>18){
			layerUtils.iMsg(-1,"密码不能为空,长度为6~18位");
			return ;
		}
		 if(!password.match(/^[A-Za-z0-9]+$/)){
			layerUtils.iMsg(-1,"密码应为字母与数字的组合");
			return;
		}else{
			return true;
		}
	}
	

	/**
	 * 查询手机号码是否注册
	 * */
	function chekMobileIsReg(mobile){
		var finduserinfobymobile=function(resultVo){
			if(resultVo.error_no==0){
				layerUtils.iMsg(-1,"该手机号码已被注册");
			}else if(resultVo.error_no=="-40814502"){
				 sendMessage(mobile);
				
				
			}
		};
		var param = {
				"mobile" : mobile
		};
		userService.findUserInfoByMobile(param,finduserinfobymobile);
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
				appUtils.pageInit(pageCode,"index");
				//pageCommon.loginToPage(pageCode);
			}
			else{
				layerUtils.iAlert("登录失败:"+resultVo.error_info,-1);
			}
		},ctrlParam);
		
	}
	
	/**
	 * 发送短信验证码
	 * */
	function sendMessage(mobile){
		var afterSendMobileCode = function(resultVo){
			 if(resultVo.error_no ==  0){
				 count = 120; //验证码 有效期 180s
				 curCount = count; //当前剩余秒数  开始为0
				InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
				
			 }else if(resultVo.error_no!=-997){
				 layerUtils.iAlert("短信验证码发送失败"+resultVo.error_info,-1);
			 }
		 };
		 userService.sendMobileCode({"mobile":mobile,"ctrlType":"1"},afterSendMobileCode);
	}
	
	
	//timer处理函数
	function SetRemainTime() {
        if (curCount == 0) {                
            window.clearInterval(InterValObj);//停止计时器
            $(_pageId+"#yangcode").html("重获验证码");
            $(_pageId + "#yangcode").css("background-color","#f48c56");
         }
        else {
            curCount--;
            $(_pageId+"#yangcode").html(curCount + "s后重发");
            $(_pageId + "#yangcode").css("background-color","#c8c8c8");
        }
	}
	
	//停止计数器
	function removeInterval(){
		//验证成功后停止计时器
    	window.clearInterval(InterValObj);
    	//验证成功后，计数回0
    	curCount = 0;
	}
	
	
	//短信验证码校验
	function checkVCode(){
		var mobile = $(_pageId+"#mobile").val();
		var mbcode = $(_pageId+"#yzcode").val();
		/*	//向接入层验证短信验证码
			$.ajax({
			    type: "POST", //用POST方式传输
			    dataType: "text", //数据格式:JSON
			    url: gconfig.global.domain + "/servlet/SentMobileMsg?function=CheckVcode", //目标地址
			    data:  "mobile=" + mobile + "&mbCode=" + mbcode,
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
		        		if (login_uid) {
		        			weiboLoginFunc();//微博注册
						}else{
							registerFunc();//注册
						}
		        		
		        		
                  	}
		        	if(result.resultNo == '-1'){
						var msg = result.message;
		        		layerUtils.iAlert(msg,-1);
		        	}
		        }
		     });*/
			
			//拦截器验证短信验证码
			var afterSendMobileCode = function(resultVo){
				if(resultVo.error_no ==  0){
					if (login_uid) {
						//停止计时
		        		window.clearInterval(InterValObj);
		        		//验证通过后不能重新发送
		        		curCount = -1;	
	        			weiboLoginFunc();//微博注册
					}
	           }else if(resultVo.error_no!=-997){
					layerUtils.iAlert(resultVo.error_info,-1);
				}
			};
			userService.sendMobileCode({"mobile":mobile,"vCode":mbcode,"ctrlType":"2"},afterSendMobileCode);

	}
	
	
	
	/**
	 *微博登陆并绑定存量账号
	 * */
	function weiboLoginFunc(){
		var mobile = $(_pageId + "#mobile").val();
		var password = $(_pageId + "#password").val();
		var mbCode = $(_pageId + "#mbCode").val();
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
				"access_token":access_token,//授权码
				"mobile" : mobile,//电话
				"mbCode" : mbCode,//电话
				"channel_type" : 3,//第三方类型
				"expires_in" :exspireIn,//第三方类型
				"login_uid":login_uid //第三方账户id
		};
		var ctrlParam = {
				"isLastReq" : true, //是否是最后一次请求
				"isShowWait" : true //是否显示等待层
		};
			
		if(isCanCommit){
			//不可重复提交表单
			afterCommitDeal();
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
		$(_pageId+" #register").html("提交");
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
	
	//*********************************************************************//
	
	/**
	 * 销毁
	 */
	function destroy() {
		$(_pageId).find("input").val("");
		$(_pageId+"#yzcode").html("");
		$(_pageId + "#gtw_clause").hide();
		$(_pageId+" #register").html("提交");
		 isCanCommit = true; //表单是否允许提交
		 checkboxFlag = true; //表单是否允许提交
		removeInterval();//清楚定时
		count = 120; //验证码 有效期 180s
		$(_pageId+" #yangcode").html("发送验证码");
		$(_pageId + "#register").css("background-color","#f48c56");
		  $(_pageId + "#yangcode").css("background-color","#f48c56");
		$(_pageId + "#radio_1").attr("checked",true);
	}

	var account_register_userInformation = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = account_register_userInformation;
});