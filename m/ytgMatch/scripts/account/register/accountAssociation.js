/**
 * 账户关联 微博注册
 * @author 余一一
 * @date 2016-03-21
 */
define("ytgMatch/scripts/account/register/accountAssociation", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
        validatorUtil = require("validatorUtil"),
        userService = require("userService"),
		pageCode = "account/register/accountAssociation", 
		_pageId = "#account_register_accountAssociation ",
	     pageCommon = require("pageCommon");
    
	var nickName ="";//微博用户的昵称
    var login_uid = "";	//微博用户的账户id
    var accessToken = "";//授权码
    var user_image ="";//头像
    var exspireIn ="";//失效时间
	var threeflag = 1;//点击关联不要弹框
	/**
	 * 初始化
	 */
	function init() {
         
		getWeiboLoginResultInfo();//获取微博授权后的信息
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent() {
		//头部返回
		appUtils.bindEvent($(_pageId + ".icon_back"), function(e) {
			appUtils.sendDirect("http://weibo.com");
		});
		
		//关联账户
		appUtils.bindEvent($(_pageId + "#loginsso"), function(e) {
			//第三方关联
			 threeflag = 3;//点击关联不要弹框
			 weiboLoginFunc();//判断是否已经绑定
		});
		
		//注册
		appUtils.bindEvent($(_pageId + "#register"), function(e) {
			appUtils.pageInit(pageCode,"account/register/userInformation");
		});
		
	
	}
	
	//***************************【绑定事件方法】******************************//
	/**
	*获取微博授权后的结果信息
	*/
	function getWeiboLoginResultInfo(){
		var callBackFunc = function (resultVo){
			if(resultVo.error_no == 0){
				var resultList = resultVo.results;
				if (resultList!=null && resultList.length>0) {
					var result =resultList[0];
					 nickName =result.nick_name;//微博用户的昵称
				     login_uid =result.uid;	//微博用户的账户id
				     accessToken = result.accessToken;//授权码
				     user_image =result.user_image;//头像
				     exspireIn =result.exspireIn;//失效时间
				    //微博头像设置
				     $(_pageId + "#weiboImg").attr("src",user_image); 
				     //昵称
				     $(_pageId + "#user_name").html(nickName);  
				     
				     //	//保存webo用户信息
						appUtils.clearSStorage("login_uid",login_uid,true);
						appUtils.clearSStorage("accessToken",accessToken,true);
						appUtils.clearSStorage("nickName",nickName,true);
						appUtils.clearSStorage("exspireIn",exspireIn,true);
						appUtils.setSStorageInfo("login_uid",login_uid,true);
						appUtils.setSStorageInfo("access_token",accessToken,true);
						appUtils.setSStorageInfo("nickName",nickName,true);
						appUtils.setSStorageInfo("exspireIn",exspireIn,true);  			
						//第三方是否绑定了微证券
						weiboLoginFunc();
				}
				
			}else{
				layerUtils.iMsg(-1,resultVo.error_info);
			}
		};
		userService.getWeiboLoginResultInfo(callBackFunc);
	}
	
	
	
	/**
	 *第三方账户是否已经绑定了微证券
	 * */
	function weiboLoginFunc(){
		
		var param = {
				"channel_type" : 3,//第三方类型 微博
				"login_uid":login_uid //第三方账户id
		};
		var ctrlParam = {
				"isLastReq" : true, //是否是最后一次请求
				"isShowWait" : true //是否显示等待层
		};	
			//不可重复提交表单
			//afterCommitDeal();
			userService.isWebocontestSSO(param,function callBack(resultVo){
				if(Number(resultVo.error_no) == 0){
					//将登录信息写入缓存
					var result = resultVo.results;
					if (result.length>0 && result!=null) {
						var userId = result[0].user_id;
						var loginId = result[0].login_id;
						var userType = result[0].user_type;
						var userName = result[0].user_name;
						//登录后,设置相关cookie
						appUtils.setSStorageInfo("_isLoginIn","true");
						appUtils.setSStorageInfo("userId",userId,true);
						appUtils.setSStorageInfo("loginId",loginId,true);
						appUtils.setSStorageInfo("userType",userType,true);
						appUtils.setSStorageInfo("userName",userName,true);
						//登陆回到首页
						appUtils.pageInit(pageCode,"index");
					}
				}
				else{
					/*if (threeflag==1) {
						 //没有绑定登陆去绑定
						layerUtils.iConfirm("您还没有绑定微证券账号,是否立即绑定", function(){
							//绑定
							appUtils.pageInit(pageCode,"account/login");
						});	
					}*/
					
					if (threeflag==3){
						appUtils.pageInit(pageCode,"account/login");
					}
				}
			},ctrlParam);
		
	}
	
	//*********************************************************************//
	
	/**
	 * 销毁
	 */
	function destroy() {
		 threeflag =2;//返回不做任何操作
	}

	var accountAssociation = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = accountAssociation;
});