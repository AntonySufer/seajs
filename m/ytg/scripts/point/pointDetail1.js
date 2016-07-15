/**
 * 观点发布评论页
 */
define("ytg/scripts/point/pointDetail1", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        pointService=require("pointService"),
		pageCode = "point/pointDetail1", 
		_pageId = "#point_pointDetail1 ";
	
	//页面公共JS
	var pageCommon = require("pageCommon");
	
	//全局变量
	 var view_id=null;
	 var user_id=null;
	/**
	 * 初始化
	 */
	function init() {
		//页面加载的时候解决光标居中问题
		$(_pageId).find("textarea").val("");
		//头部菜单绑定事件
		pageCommon.headerMenuFunc(_pageId,pageCode);
		view_id=appUtils.getPageParam("view_id");
		user_id = appUtils.getSStorageInfo("userId",true);
		if(user_id==null||""==user_id||undefined==user_id){
	    	layerUtils.iAlert("您尚未登录！",-1);
			appUtils.pageInit(pageCode,"index");
		}
		
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent(){
		//头部返回
		appUtils.bindEvent($(_pageId + ".icon_back"), function(e) {
			//appUtils.pageBack();
			//到对应的观点详情页
			appUtils.pageInit(pageCode,"point/pointDetail",{"view_id":view_id});
		}); 
		
		//评论
		appUtils.bindEvent($(_pageId + "#submit"), function(e) {
			var comment_content=$("#comment_content").val();
			if(comment_content== null || ""==comment_content){
				layerUtils.iAlert("评论内容不能为空!",-1);
				return;
			}
			commentView(comment_content);
		}); 
		//字数限制
		appUtils.bindEvent($(_pageId+"#comment_content") , function(e){
			var len = $.trim($(this).val()).length;
			if(len > 120){
				$(this).val($(this).val().substring(0,120));
				layerUtils.iAlert("超过字数限制!",-1);
				return;
			}
			var num = 120 - len;
			$(_pageId+"#word").text("还可输入"+num+"字");
		},"input");
		
	}
	
	//***************************【函数方法】***********************************//
	   function commentView(comment_content){
		   var param={
					"user_id": user_id,
					"view_id": view_id,
					"comment_content":comment_content,
					"comment_state":1,
			};
		   pointService.userCommentView(param,function callBack(resultVo){
				if(0==Number(resultVo.error_no)){
					layerUtils.iMsg(0,"评论成功");
					appUtils.pageInit(pageCode, "point/pointDetail", {"view_id":view_id});
				}else{
					layerUtils.iAlert("评论失败！:"+resultVo.error_info,-1);
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
		$(_pageId).find("textarea").val("");
		$(_pageId+"#word").text("还可输入120字");
	}

	var point_pointDetail1 = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	module.exports = point_pointDetail1;
});