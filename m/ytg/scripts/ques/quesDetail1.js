/**
 * 问答详情页
 */
define("ytg/scripts/ques/quesDetail1", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
		quesService=require("quesService"),
		pageCode = "ques/quesDetail1", 
		_pageId = "#ques_quesDetail1 ";
	
	//全局变量
	var ques_id=null;
	var user_id=null;
	var type="";
	//页面公共JS
	var pageCommon = require("pageCommon");
	
	/**
	 * 初始化
	 */
	function init() {
		type=appUtils.getPageParam("type");
		ques_id=appUtils.getPageParam("ques_id");
		user_id=appUtils.getSStorageInfo("userId",true);
		if(user_id == undefined || user_id==null || user_id==""){
			var hisPageParam = {
					"ques_id" : ques_id
			};
			appUtils.setSStorageInfo("hisPageParam",JSON.stringify(hisPageParam));
			appUtils.setSStorageInfo("hisPageCode",pageCode);
			appUtils.pageInit(pageCode,"account/login");
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
			//appUtils.pageBack();
			//到对应的问答详情页
			appUtils.pageInit(pageCode,"ques/quesDetail",{"ques_id":ques_id,"type":type});
		}); 
		
		//回答
		appUtils.bindEvent($(_pageId + "#submit"), function(e) {
			var answer_content=$(_pageId + " #answer_content").val();
			if(answer_content==null || ""==answer_content){
				layerUtils.iAlert("回答内容不能为空",-1);
				return;
			}
			queryQuesDetails(removeHTMLTag(answer_content));
		}); 
		
		//字数限制
		appUtils.bindEvent($(_pageId+"#answer_content"),function(){
			var len = $.trim($(this).val()).length;
			if(len > 120){
				$(this).val($(this).val().substring(0,120));
				layerUtils.iAlert("超过字数限制",-1);
				return;
			}
			var num = 120 - len;
			$(_pageId+"#word").text("还可以输入"+num+"字");
		},"input");
	}
	
	//***************************【函数方法】***********************************//
	/**
	 * 提交回答
	 * */
	function queryQuesDetails(answer_content){
		var time= new Date().format("yyyy-MM-dd HH:mm:ss");
		var param={
				"user_id" :user_id,
				"ques_id" :ques_id,
				"answer_content" : answer_content,
				"ques_create_time":time
		};
		quesService.AnswerQuestion(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				layerUtils.iMsg(0,"回答成功");
				if(type==1){
					appUtils.pageInit(pageCode, "ques/quesDetail", {"ques_id":ques_id,"type":1});
				}else if(type==2){
					appUtils.pageInit(pageCode, "ques/quesDetail", {"ques_id":ques_id,"type":2});
				}
			}else{
				layerUtils.iAlert("回答问题失败:"+resultVo.error_info,-1);
			}
		});
	}
	   
	   
	//过滤内容
	function removeHTMLTag(ques_comment){
		ques_comment = ques_comment.replace(/<\/?[^>]*>/g,''); //去除HTML tag
		ques_comment = ques_comment.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
		ques_comment = ques_comment.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
		ques_comment=ques_comment.replace(/&nbsp;/ig,'');//去掉&nbsp;
		return ques_comment;
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

	var ques_quesDetail1 = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = ques_quesDetail1;
});