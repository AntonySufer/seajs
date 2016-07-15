/**
 * 创建观点页
 */
define("ytg/scripts/adviserSpace/myPoint/createPoint", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
	    userService=require("userService"),
		pageCode = "adviserSpace/myPoint/createPoint", 
		_pageId = "#adviserSpace_myPoint_createPoint ";
	
	//全局变量
	var user_id=null;
	//接口入参
	var create_view = true; //是否提交审核 
	
	//页面公共JS
	var pageCommon = require("pageCommon");
	
	/**
	 * 初始化
	 */
	function init() {
		user_id=appUtils.getSStorageInfo("userId",true);
		if(user_id==null||""==user_id||undefined==user_id){
			appUtils.pageInit(pageCode,"account/login");
			return;
		}
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent(){
		//头部菜单绑定事件
		pageCommon.headerMenuFunc(_pageId,pageCode);
		
		//头部返回
		appUtils.bindEvent($(_pageId + ".icon_back"), function(e) {
			appUtils.pageBack();
		});
		
		//勾选框
		appUtils.bindEvent($(_pageId + ".check_box label"), function(e) {
			if($(this).siblings('input').attr("checked") == 'checked'){
				$(this).siblings('input').removeAttr("checked");
				$(this).parent().siblings().find('input').attr("checked","checked");
			}
			else{
				$(this).siblings('input').attr("checked","checked");
				$(this).parent().siblings().find('input').removeAttr("checked");
			}
			if($(_pageId + "#checkbox_1").attr("checked") == "checked"){
				create_view = true;
			}
			else if($(_pageId + "#checkbox_2").attr("checked") == "checked"){
				create_view = false;
			}
		});
		
		//创建观点
		appUtils.bindEvent($(_pageId + ".login_btn"), function(e) {
			createPoint(); //创建观点
		}); 
	}
	
	//***************************【函数方法】***********************************//
	/**
	 * 创建观点
	 * */
	function createPoint(){
		var title = $(_pageId+"#view_name").attr("value"); //标题
	//	var view_brief = $(_pageId+"#view_brief").val(); //简介
		var view_content =$(_pageId+"#view_content").val(); //内容
		if(title==null || title==""){
			layerUtils.iAlert("观点名称不能为空 ",-1);
			return;
		}
		if(title.length>15||title.length<5){
			layerUtils.iAlert("标题为5~15字",-1);
			return;
		}
		/*if(view_brief==null || view_brief==""){
			layerUtils.iAlert("观点简介不能为空 ",-1);
			return;
		}
		if(view_brief.length>50 || view_brief.length<20){
			layerUtils.iAlert("观点简介为20~50字",-1);
			return;
		}*/
		if(view_content==null || view_content==""){
			layerUtils.iAlert("观点内容不能为空 ",-1);
			return;
		}
		if(view_content.length<50){
			layerUtils.iAlert("观点内容不得低于50字",-1);
			return;
		}
		var viewMap={
				"title":title,
				"content":view_content,
				"introdution":null,
				"invest_id":user_id,
				"bond_type":0,
				"viewpage_id":null
		};
		var investaddview= function (resultVo) {
			if (resultVo.error_no == 0) {
				layerUtils.iMsg(0,"创建观点成功");
				appUtils.pageInit(pageCode,"adviserSpace/myPoint/myPoint");
			} else {
				layerUtils.iAlert("创建观点失败:"+resultVo.error_info, -1);
			}
		};
		
		if(create_view){
			userService.investAddView(viewMap,investaddview);
		}else{
			userService.investAddViewDraft(viewMap,investaddview);
		}
	}
	   
	//*********************************************************************//
	
	/**
	 * 销毁
	 */
	function destroy() {
		//隐藏菜单以及遮罩层
		pageCommon.hideHeaderMenuFunc(_pageId);
		
		$(_pageId).find("input").val("");
		$(_pageId).find("textarea").val("");
	}

	var adviserSpace_myPoint_createPoint = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = adviserSpace_myPoint_createPoint;
});