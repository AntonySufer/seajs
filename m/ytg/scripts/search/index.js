/**
 * 搜索页
 */
define("ytg/scripts/search/index", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	layerUtils = require("layerUtils"), 
	gconfig = require("gconfig"),
	queryService = require("queryService"),
	portfolioService = require("portfolioService"),

	pageCode = "search/index", 
	_pageId = "#search_index ";
	//页面公共JS
	var pageCommon = require("pageCommon");
	//全局变量
	var user_id = null;
	//入参
	var key_words = "";
	var quesCurpage = 1;
	var quesTotalPage = 1;
	var portCurpage = 1;
	var portTotalPage = 1;
	var viewCurpage = 1;
	var viewTotalPage = 1;
	var numPerPage = 30;
    var user_type=null;
    var gconfig = require("gconfig");
    var domain = gconfig.global.domain;
	/**
	 * 初始化
	 */
	function init() {
		user_id = appUtils.getSStorageInfo("userId",true);
		user_type = appUtils.getSStorageInfo("userType",true);
		//滑动区域设置
		var contentHeight = $(window).height()-$(_pageId+".search_text").height()-$(_pageId+".adv_box1").height()-58;
		$(_pageId + "#ques").css("height",contentHeight);
		$(_pageId + "#ques").css("overflow","auto");
		$(_pageId + "#point").css("height",contentHeight);
		$(_pageId + "#point").css("overflow","auto");
		$(_pageId + "#portfolio").css("height",contentHeight);
		$(_pageId + "#portfolio").css("overflow","auto");
	}

	/**
	 * 事件绑定
	 */
	function bindPageEvent() {
		//头部菜单绑定事件
		pageCommon.headerMenuFunc(_pageId,pageCode);
		
		//返回
		appUtils.bindEvent($(_pageId + ".icon_back"), function(e){
			//重置输入框
			$(_pageId).find("input").val("");
			$(_pageId + "#portfolioList").empty();
			$(_pageId + "#quesList").html("");
			$(_pageId + "#pointList").html("");
			appUtils.pageInit(pageCode, "index", {});
		});

		//搜索
		appUtils.bindEvent($(_pageId + ".search_text a "), function(e) {
			key_words = $(_pageId + "#key_words").val();
			if(key_words != undefined && key_words != null && key_words != ""){
				quesCurpage = 1;
				quesTotalPage = 1;
				portCurpage = 1;
				portTotalPage = 1;
				viewCurpage = 1;
				viewTotalPage = 1;
				searchPortfolio(key_words);
				searchQues(key_words);
				searchPoint(key_words);
				
			}
		});

		//Tab切换
		appUtils.bindEvent($(_pageId + ".row-1"), function(e) {
			var index = $(this).index();
			$(this).siblings().find("a").removeClass("act");
			$(this).find("a").addClass("act");
			if(index == 0){
				//显示组合
				$(_pageId + "#portfolio").show();
				$(_pageId + "#ques").hide();
				$(_pageId + "#point").hide();
			}
			if(index == 1){
				//显示问答
				$(_pageId + "#portfolio").hide();
				$(_pageId + "#ques").show();
				$(_pageId + "#point").hide();
			}
			if(index == 2){
				//显示观点
				$(_pageId + "#portfolio").hide();
				$(_pageId + "#ques").hide();
				$(_pageId + "#point").show();
			}
		});

		/** ****************** 预绑定事件 ************************  */
		//进入组合详情
		appUtils.preBindEvent($(_pageId +"#portfolioList"), "li",function(){
			appUtils.setSStorageInfo("portfolio_PageCode",pageCode);
			var portfolio_id = $(this).attr("id");
			appUtils.pageInit(pageCode, "portfolio/portfolioDetail",{'portfolio_id':portfolio_id});
		});
		//进入问答详情
		appUtils.preBindEvent($(_pageId +"#quesList"), "li",function(){
			var ques_id = $(this).attr("id");
			appUtils.pageInit(pageCode, "ques/quesDetail",{"ques_id":ques_id});
		});
		//进入观点详情
		appUtils.preBindEvent($(_pageId +"#pointList"), "li",function(){
			appUtils.clearSStorage("last_PageCode");
			appUtils.setSStorageInfo("last_PageCode",pageCode);
			var view_id = $(this).attr("id");
			appUtils.pageInit(pageCode, "point/pointDetail", {"view_id":view_id});
		});

		//关注组合
		appUtils.preBindEvent($(_pageId + "#portfolioList"),"li .attention_btn", function(e){

			if(user_type==1){
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
			subOrCancelPort(portfolio_id,sub_type,$(this));
			e.stopPropagation();
			searchPortfolio(key_words);
		});
		
		/**  加载更多 */
		//组合
		appUtils.preBindEvent($(_pageId+"#portfolio"),".load_add",function(e){
			portCurpage++;
			searchPortfolio(key_words,"append");
		});
		//问答
		appUtils.preBindEvent($(_pageId+"#ques"),".load_add",function(e){
			quesCurpage++;
			searchQues(key_words,"append");
		});
		//观点
		appUtils.preBindEvent($(_pageId+"#point"),".load_add",function(e){
			viewCurpage++;
			searchPoint(key_words,"append");
		});
	}

	//***************************【函数方法】***********************************//
	/**
	 * 搜索组合
	 * */
	function searchPortfolio(key_words,insertType){
		insertType =  typeof insertType == "undefined" || insertType == "" || insertType == null ? "html":insertType;
		var param = {
				"key_words" : key_words,
				"curPage" : 1,
				"numPerPage" : numPerPage,
				'customer_id' : user_id
		};
		queryService.searchPortfolio(param,function callBack(resultVo){
			if(Number(resultVo.error_no) == 0){
				//console.log("~~~~~~搜索组合成功");
				$(_pageId+" #portfolio").children("div").removeClass("empty");
				var result = resultVo.results[0].data;
				portTotalPage = resultVo.results[0].totalPages;
				fillPortData(result,insertType);
			}
			else if(resultVo.error_no == "-40833702"){
				var noDataHtml = '<div class="no_data_box"><em></em><p>抱歉，找不到相关组合</p></div>';
				//向子节点添加empty样式
				$(_pageId+" #portfolio").children("div").addClass("empty");
				$(_pageId + "#portfolioList").html("");
				$(_pageId + "#portfolioList").append(noDataHtml);
			}else{
				layerUtils.iAlert("搜索组合失败:"+resultVo.error_info,-1);
			}
		});
	}

	//将组合数据填充到页面
	function fillPortData(resultset,insertType){
		$(_pageId + "#portfolio .load_add").remove();
		if(insertType == 'html'){
			$(_pageId + "#portfolioList").empty();
		}
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
	   					+'<p><span class="user">'+this.invest_name+' </span>'+sub_num+'人关注</p>'
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

	/**
	 * 搜索问答
	 * */
	function searchQues(key_words,insertType){
		insertType =  typeof insertType == "undefined" || insertType == "" || insertType == null ? "html":insertType;
		var param = {
				"key_words" : key_words,
				"curPage" : quesCurpage,
				"numPerPage" : numPerPage
		};
		queryService.searchQues(param,function callBack(resultVo){
			if(Number(resultVo.error_no) == 0){
				var result = resultVo.results[0].data;
				quesTotalPage = resultVo.results[0].totalPages;
				fillQuesData(result,insertType);
			}
			else if(resultVo.error_no == "-40802402"){
//				var height = $(window).height()-$(_pageId + ".header").height()-$(_pageId + ".search_text").height()-$(_pageId + ".grid_box").height();
//				var html = '<div style="height:'+height+'px; font-size:16px; color:#9999B1; text-align:center; padding-top:150px;">抱歉，找不到相关问答</div>';
				var noDataHtml = '<div class="no_data_box"><em></em><p>抱歉，找不到相关问答</p></div>';
				$(_pageId + "#quesList").html("");
				$(_pageId + "#quesList").append(noDataHtml);
			}
			else{
				layerUtils.iAlert("搜索问答失败:"+resultVo.error_info,-1);
			}
		});
	}

	//将问答数据填充到页面
	function fillQuesData(result,insertType)
	{
		$(_pageId + "#ques .load_add").remove();
		if(insertType == 'html'){
			$(_pageId + "#quesList").html("");
		}
		var html = "";
		for(var i = 0;i<result.length;i++)
		{
			html += '<li id="'+result[i].ques_id+'">';
			html += '<div class="li_up"><div class="ring"><span>?</span></div><div class="list_info">';
			html += '<h4>'+result[i].ques_content+'</h4>';
			html += '<p>提问者 : '+result[i].ask_name+" | "+result[i].ques_create_time+'</p>';
			html += '</div></div>';
			html += '<div class="li_lower">';
			html += '<div class="ring">';
			if(result[i].face_image_small == null || result[i].face_image_small == "")
				html += '<img src="images/my_tx.png" width="26" class="circle"/>';
			else
				html += '<img src="'+domain+result[i].face_image_small+'" width="26" class="circle"/>';
			html += '</div>';
			html += '<div class="list_info">';
			html += '<h4>'+result[i].answer_content+'</h4>';
			html += '<p>回答 : '+result[i].invest_name+" | "+result[i].ans_create_time+'</p>';
			html += '</div></div>';
			html += '</li>';
		}
		$(_pageId + "#quesList").append(html);
//		if(quesCurpage != quesTotalPage){
//			$(_pageId + "#ques").append('<a href="javascript:void(0);" class="load_add" id="load_add_ques">加载更多问答...</a>');
//		}
	}

	/**
	 * 搜索观点
	 * */
	function searchPoint(key_words,insertType){
		insertType =  typeof insertType == "undefined" || insertType == "" || insertType == null ? "html":insertType;
		var param = {
				"key_words" : key_words,
				"curPage" : viewCurpage,
				"numPerPage" : numPerPage
		};
		queryService.searchPoint(param,function callBack(resultVo){
			if(Number(resultVo.error_no) == 0){
				//console.log("~~~~~~搜索观点成功");
				$(_pageId+" #point").children("div").removeClass("empty");
				var result = resultVo.results[0].data;
				viewTotalPage = resultVo.results[0].totalPages;
				fillPointData(result,insertType);
			}
			else if(resultVo.error_no == "-40802502"){
				$(_pageId+" #point").children("div").addClass("empty");
//				var height = $(window).height()-$(_pageId + ".header").height()-$(_pageId + ".search_text").height()-$(_pageId + ".grid_box").height();
//				var html = '<div style="height:'+height+'px; font-size:16px; color:#9999B1; text-align:center; padding-top:150px;">抱歉，找不到相关观点</div>';
				var noDataHtml = '<div class="no_data_box"><em></em><p>抱歉，找不到相关观点</p></div>';
				$(_pageId + "#pointList").html("");
				$(_pageId + "#pointList").append(noDataHtml);
			}
			else{
				layerUtils.iAlert("搜索观点失败:"+resultVo.error_info,-1);
			}
		});
	}

	//将观点数据填充到页面
	function fillPointData(result,insertType)
	{
		$(_pageId + "#point .load_add").remove();
		if(insertType == 'html'){
			$(_pageId + "#pointList").html("");
		}
		var html = "";
		for(var i = 0;i<result.length;i++)
		{
			html += '<li id="'+result[i].view_id+'"><a href="javascript:void(0)">';
			html += '<div class="sy_list_tit"><div class="tx_box">';
			if(result[i].user_image_small==null || ""==result[i].user_image_small)
				html+='<img src="images/my_tx.png" class="rounded" width="30" /></div>';
			else{
				html+='<img src="'+domain+result[i].user_image_small+'" width="26" class="circle"/></div>';
			}
			html +='<div class="list_info">';
			html += '<p>'+result[i].invest_name+'</p><span>'+result[i].create_time+'</span></div>';
			html +='<div class="review_iocn"><em></em><p class="text-center">'+result[i].read_num+'</p></div></div>';
			html +='<div class="sy_list_txt"><p>'+result[i].title+'</p></div></a></li>';
		}
		$(_pageId + "#pointList").append(html);
//		if(viewCurpage != viewTotalPage){
//			$(_pageId + "#point").append('<a href="javascript:void(0);" class="load_add" id="load_add_view">加载更多观点...</a>');
//		}
	}

	/**
	 * 关注或者取消关注 组合
	 * */
	function subOrCancelPort(portfolio_id,sub_type,elem){
		var param={
				"portfolio_id" : portfolio_id,
				"user_id" : user_id,
				"sub_type":sub_type
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
		});
	}

	//*********************************************************************//

	/**
	 * 销毁
	 */
	function destroy() {
		//隐藏菜单以及遮罩层
		pageCommon.hideHeaderMenuFunc(_pageId);
	
		//清空搜索记录
	//	$(_pageId + "#portfolioList").empty();
	//	$(_pageId + "#quesList").html("");
	//	$(_pageId + "#pointList").html("");
	}

	var search_index = {
			"init" : init,
			"bindPageEvent" : bindPageEvent,
			"destroy" : destroy
	};

	module.exports = search_index;
});