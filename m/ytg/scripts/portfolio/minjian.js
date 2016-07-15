/**
 * 民间组合
 */
define("ytg/scripts/portfolio/minjian", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
        portfolioService=require("portfolioService"),
		pageCode = "portfolio/minjian", 
		_pageId = "#portfolio_minjian ";
		
	var portfolio_index = require("ytg/scripts/portfolio/index");
	
	//全局变量
	var user_id = null;
	var type = 6;
	var rank_type = 4;
	var user_type=null;
	
	//页面公共JS
	var pageCommon = require("pageCommon");
	
	/**
	 * 初始化
	 */
	function init() {
		user_id = appUtils.getSStorageInfo("userId",true);
		user_type = appUtils.getSStorageInfo("userType",true);
		commonRanksByType();
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
			appUtils.pageBack();
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
			portfolio_index.subOrCancelPort(user_id,portfolio_id,sub_type,$(this));
			e.stopPropagation();
			commonRanksByType();
		});
	}
	
	//***************************【函数方法】***********************************//
	
	/**
	 * 查询组合[投顾组合,民间组合]
	 * */
	function commonRanksByType()
	{
		var param={
				"type" : type,
				"rank_type" : rank_type,
				"curPage" : 1,
				"numPerPage" : 28,
				'customer_id' : user_id
		};
		portfolioService.GoodUser(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				var result = resultVo.results;
				fillPortfolioData(result);
			}else if(resultVo.error_no=='-40835702'){
				
			}
			else{
				layerUtils.iAlert("组合列表加载失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	//填充组合数据
	function fillPortfolioData(result){
		$(_pageId + "#portfolioList").empty();
		$(result).each(function(i) {
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

	var portfolio_minjian = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = portfolio_minjian;
});