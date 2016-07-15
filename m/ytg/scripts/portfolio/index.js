/**
 * 组合主页
 */
define("ytg/scripts/portfolio/index", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
		pageCode = "portfolio/index", 
		_pageId = "#portfolio_index ",
	    queryService=require("queryService"),
	    portfolioService=require("portfolioService");
	
	//页面公共JS
	var pageCommon = require("pageCommon");
	
	//全局变量
	var user_id = null;   
	var user_type=null;
	
	/**
	 * 初始化
	 */
	function init() {
		user_id = appUtils.getSStorageInfo("userId",true);
		user_type = appUtils.getSStorageInfo("userType",true);
		//查询组合
		queryHotportfoliolist();
	}
	
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent() {
		//头部菜单绑定事件
		pageCommon.headerMenuFunc(_pageId,pageCode);
		
		//头部返回
		appUtils.bindEvent($(_pageId + ".icon_back"), function() {
			$(_pageId +" #portfolioList").html("");
			//appUtils.pageInit(pageCode, "index", {isShowWait:false});
			appUtils.pageBack();
		});
		//组合搜索（收益最高）
		appUtils.bindEvent($(_pageId + "#max"), function() {
			appUtils.pageInit(pageCode, "portfolio/shouyiMax", {});
			
		});
		//组合搜索（人气飙升）
		appUtils.bindEvent($(_pageId + "#top"), function() {
			appUtils.pageInit(pageCode, "portfolio/renqiTop", {});
			
		});
		//组合搜索（今日黑马）
		appUtils.bindEvent($(_pageId + "#today"), function() {
			appUtils.pageInit(pageCode, "portfolio/todayMax", {});
			
		});
		//组合搜索（最新发布）
		appUtils.bindEvent($(_pageId + "#new"), function() {
			appUtils.pageInit(pageCode, "portfolio/newFabu", {});
			
		});
		//组合搜索（往期回顾）
		appUtils.bindEvent($(_pageId + "#wangqi"), function() {
			appUtils.pageInit(pageCode, "portfolio/wangqiShow", {});
			
		});
		//组合搜索（投顾组合）
		appUtils.bindEvent($(_pageId + "#tougu"), function() {
			appUtils.pageInit(pageCode, "portfolio/tougu", {});
			
		});
		//组合搜索（民间高手）
		appUtils.bindEvent($(_pageId + "#minjian"), function() {
			appUtils.pageInit(pageCode, "portfolio/minjian", {});
			
		});
		//今日热门
		appUtils.bindEvent($(_pageId + "#todayHot"), function() {
			appUtils.pageInit(pageCode, "portfolio/todayHot", {});
			
		});
		
	
		/**  **********************  预绑定事件 *************************** */
		//进入组合详情
		appUtils.preBindEvent($(_pageId +"#portfolioList"), "li",function(){
			var portfolio_id = $(this).attr("id");
			appUtils.pageInit(pageCode, "portfolio/portfolioDetail",{'portfolio_id':portfolio_id});
		});
		
		//关注组合
		appUtils.preBindEvent($(_pageId + "#portfolioList"),"li .attention_btn", function(e){
			if(user_id == undefined || user_id==null || user_id==""){
				appUtils.pageInit(pageCode,"account/login");
				appUtils.setSStorageInfo("hisPageCode",pageCode);
				e.stopPropagation();
				return ;
			}else if(user_type==1){
				layerUtils.iMsg(-1,"投顾不能关注组合");
				e.stopPropagation();
				return ;
				
			}
			var portfolio_id = $(this).parent().parent().attr("id");
			var sub_type = "";
			if($(this).hasClass('attention_btn2'))
				sub_type = 0;
			else 
				sub_type = 1;
			//关注或者取消关注组合
			subOrCancelPort(user_id,portfolio_id,sub_type,$(this));
			e.stopPropagation();
			queryHotportfoliolist();
		});
	}
	
	/** *************************【绑定事件方法】********************************** */

	/**
	 * 关注或者取消关注 组合
	 * */
	function subOrCancelPort(user_id,portfolio_id,sub_type,elem){
		var param={
				"portfolio_id" : portfolio_id,
				"user_id" : user_id,
				"sub_type":sub_type
		};
		var ctrlParam = {
				"isShowWait" : false
		};
		portfolioService.attentionAndCancelPortfolio(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				if(sub_type == 1)
					elem.addClass("attention_btn2");
				else
					elem.removeClass("attention_btn2");
			}
			else{
				if(sub_type == 1)
					layerUtils.iAlert("关注组合失败:"+resultVo.error_info,-1);
				else 
					layerUtils.iAlert("取消关注组合失败:"+resultVo.error_info,-1);
			}
		},ctrlParam);
	}
	
	/** *************************【初始化方法】***************************** */
	
	/**
	 * 查询热门组合
	 * */
	function queryHotportfoliolist()
	{
		var param={
				"curPage" : 1,
				"numPerPage" : 24,
				"customer_id" : user_id
		};
		portfolioService.queryPortfolioList(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				var result = resultVo.results;
				fillPortfolioData(result);
			}
			else if(resultVo.error_info == '找不到所要查询的数据!'){
				//找不到所要查询的数据!
			}
			else{
				layerUtils.iAlert("热门组合加载失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	//填充组合数据
	function fillPortfolioData(resultset){
		$(_pageId + "#portfolioList").empty();
		$(resultset).each(function(i) {
			if(this.sub_num>=1){
				sub_num=this.sub_num;
			}else{
				sub_num=0;
			}
			var str='<li id="'+this.portfolio_id+'">'
				+'<div class="ui layout li_det">'
			+'<div class="ring">'
			+'<p>总收益</p>'
				+'<strong>'+(this.total_yield*100).toFixed(2)+'<i>%</i></strong>'
    			+'</div>'
			+'<div class="ui row-1 list_info">'
			+'<div class="label_box">'
   				+'<span class="ui tag">沪深</span>'
   					+'</div>'
   				+'<div class="mes_box">'
   				+'<h4>'+this.portfolio_name+'</h4>'
   					+'<p><span class="user">'+this.invest_name+' </span><span style="color:#f48c56;">'+sub_num+'人关注</span></p>'
   					+'</div>'
   				+'</div>';
			if(this.sub_status == 'no')
				str += '<a href="javascript:void(0)" class="attention_btn">加关注</a>'
					+'</div>'
		            +'</li>';
			else 
				str += '<a href="javascript:void(0)" class="attention_btn attention_btn2">已关注</a>'
					+'</div>'
		            +'</li>';
			
			$(_pageId + "#portfolioList").append(str);
		});
	}
	
	//*********************************************************************//
	
	/**
	 * 销毁
	 */
	function destroy() {
		//隐藏菜单以及遮罩层
		pageCommon.hideHeaderMenuFunc(_pageId);
		
	}

	var portfolio_index = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy,
		"subOrCancelPort" : subOrCancelPort,
		"fillPortfolioData" : fillPortfolioData
	};

	module.exports = portfolio_index;
});