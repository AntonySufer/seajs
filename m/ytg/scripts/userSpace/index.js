/**
 * 个人中心主页（普通客户）
 */
define("ytg/scripts/userSpace/index", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
        userService = require("userService"),
		pageCode = "userSpace/index", 
		_pageId = "#userSpace_index ";
		
	  var domain = gconfig.global.domain;
		
	//页面公共JS
	var pageCommon = require("pageCommon");
	
	//全局变量
	var user_name = null;
	var login_id = null;
	
	
	/**
	 * 初始化
	 */
	function init() {
		//若user_id不存在，则到登录页面
		user_id = appUtils.getSStorageInfo("userId",true);
		// user_id=appUtils.getPageParam("user_id");
		/*if(user_id==null||""==user_id||undefined==user_id){
	    	layerUtils.iAlert("您尚未登录！",-1);
			appUtils.pageInit(pageCode,"index");
		}*/
		/** 获取face_image_small，以及user_name(如果没有则取login_id) */
		login_id = appUtils.getSStorageInfo("loginId",true);
		user_name = appUtils.getSStorageInfo("userName",true);
		if(user_name != ""){
			$(_pageId + ".my_name_box").find("p").html("欢迎："+user_name);
		}
		else if(login_id != ""){
			$(_pageId + ".my_name_box").find("p").html("欢迎："+login_id);
		}
		getUserInfo();
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent(){
		//头部菜单绑定事件
		pageCommon.headerMenuFunc(_pageId,pageCode);
		//头部返回
		appUtils.bindEvent($(_pageId + ".icon_back"), function(e) {
			appUtils.pageInit(pageCode,"index");
		});
		
		//牛的组合
		appUtils.bindEvent($(_pageId + "#myPortfolio"), function(e) {
			appUtils.pageInit(pageCode,"userSpace/myPortfolio/myPortfolio");
		});
		
		//问答咨询
		appUtils.bindEvent($(_pageId + "#myQues"), function(e) {
			appUtils.pageInit(pageCode,"userSpace/myQues");
		});
		
		//我的收藏
		appUtils.bindEvent($(_pageId + "#myPoint"), function(e) {
			appUtils.pageInit(pageCode,"userSpace/myPoint");
		});
		
		//我的关注
		appUtils.bindEvent($(_pageId + "#mySub"), function(e) {
			appUtils.pageInit(pageCode,"userSpace/mySub/mySubportfolio");
		});
			
	}
	
	//***************************【初始化方法】***********************************//
	/**
	 * 获取用户基本资料
	 * */
	function getUserInfo(){
		var param = {
			"user_id" : user_id	
		};
		userService.findUserInfoById(param,function callBack(resultVo){
			if(Number(resultVo.error_no) == 0){
				//layerUtils.iMsg(0,"查询用户信息成功");
				var result = resultVo.results[0];
				var img = result.face_image_small;
				if(img != ""){
					$(_pageId + ".tx_pic img").attr("src",domain+img+"?r="+Math.random());
				}
				else{
					$(_pageId + ".tx_pic img").attr("src",'images/my_tx.png');
				}
			}
			else{
				layerUtils.iAlert("查询用户信息失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	//*********************************************************************//
	
	/**
	 * 销毁
	 */
	function destroy() {
		//隐藏菜单以及遮罩层
		pageCommon.hideHeaderMenuFunc(_pageId);
		//$(_pageId).empty();
	}

	var userSpace_index = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = userSpace_index;
});