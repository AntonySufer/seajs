/**
 * 观点详情页
 */
define("ytg/scripts/point/pointDetail", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	layerUtils = require("layerUtils"), 
	gconfig = require("gconfig"),
	pointService=require("pointService");
	userService=require("userService");
	pageCode = "point/pointDetail", 
	_pageId = "#point_pointDetail ";
	
	//页面公共JS
	var pageCommon = require("pageCommon");
	

	//全局变量
	var user_id=null;
	var view_id=null;
	var user_type=null;
    var domain = gconfig.global.domain;
	//查询观点评论入参
	var curPage = 1;
	var numPerPage = 5;
	var totalPage=1;
	var totalRows = 0;
	var num = 0;
	
	/**
	 * 初始化
	 */
	function init() {
		
		//设置前页面不为登录页
		if(appUtils.getSStorageInfo("_prePageCode") != "account/login"){
			var prePageCode = appUtils.getSStorageInfo("_prePageCode");
			appUtils.clearSStorage("ytg_prePageCode");
			appUtils.setSStorageInfo("ytg_prePageCode",prePageCode);
		}
		if(appUtils.getPageParam("view_id")){
			view_id=appUtils.getPageParam("view_id"); 
		}
		if(view_id==null&&""==view_id){
			view_id=appUtils.getPageParam("view_id"); 
		}
		user_id = appUtils.getSStorageInfo("userId",true);
		if(user_id !=null && ""!=user_id){
			addViewReadNum(); //增加观点阅读数
		}
		curPage = 1;
	    numPerPage = 5;
		totalPage=1;
		totalRows = 0;
		num = 0;
		//查询单个观点详情
		queryNewViewDetails(view_id);
		//查询评论
		queryViewComment(view_id);
		user_type = appUtils.getSStorageInfo('userType',true);
		//查询用户是否观注了该观点
		if(user_id != null && user_id != ""){
			queryisSubView();
		}
	
		
	}

	/**
	 * 事件绑定
	 */
	function bindPageEvent() {
		//头部菜单绑定事件
		pageCommon.headerMenuFunc(_pageId,pageCode);
		//头部返回
		appUtils.bindEvent($(_pageId + ".icon_back"), function(e){
			if(appUtils.getSStorageInfo("_prePageCode") == "point/pointDetail1"){
				var last_Pagecode = appUtils.getSStorageInfo("last_PageCode");
				var prePageCode = appUtils.getSStorageInfo("ytg_prePageCode");
				appUtils.pageInit(pageCode, last_Pagecode);
			}else if(appUtils.getSStorageInfo("_prePageCode") == "account/login"){
				var prePageCode = appUtils.getSStorageInfo("ytg_prePageCode");
				appUtils.pageInit(pageCode, prePageCode);
			
			}else{ 
				
				var last_Pagecode = appUtils.getSStorageInfo("last_PageCode");
				if(last_Pagecode=="point/index"||last_Pagecode=="search/index" ){
					appUtils.pageBack(); 
				}else if(last_Pagecode=="myPoint"){
					appUtils.pageBack(); 
				}else if(last_Pagecode=="adviserSpace/myPoint/myPoint "||last_Pagecode=="adviserSpace/myPoint/myPointWFB" || last_Pagecode=="adviser/adviserDetail"){
					appUtils.pageBack(); 
				}else{
				appUtils.pageInit(pageCode, last_Pagecode);
				}
				}
				
		});
		
		//评论页面
		appUtils.bindEvent($(_pageId + "#huida"), function() {
			if(!user_id){
				appUtils.pageInit(pageCode, "account/login");
			}
			else{
				appUtils.pageInit(pageCode, "point/pointDetail1", {"view_id":view_id});
			}
		});
		
		//评论  加载更多
		appUtils.preBindEvent($(_pageId+"#pointList1"),".load_add",function(e){
			//alert("更多");
			curPage++;
			queryViewComment(view_id,"append");
		});
	
		//收藏功能
		appUtils.bindEvent($(_pageId + ".collect_iocn"), function(e) {
			if(user_id == undefined || user_id==null || user_id==""){
				var hisPageParam = {
						"view_id" : view_id
				};
				appUtils.setSStorageInfo("hisPageParam",JSON.stringify(hisPageParam));
				appUtils.setSStorageInfo("hisPageCode",pageCode);
				appUtils.pageInit(pageCode, "account/login");
				return ;
			}else if(user_type==1){
				layerUtils.iAlert("投顾不能收藏观点",-1);
				return;
			}
			
			var col_status = "";
			if($(this).hasClass('collected_iocn'))
				col_status = 0;
			else 
				col_status = 1;
			//关注或者取消关注组合
			subOrCancelCollection(view_id,col_status,$(this));
			e.stopPropagation();
		
		});
	
		
	}

	//***************************【函数方法】***********************************//
	/**
	 * 关注或者取消关注 组合
	 * */
	function subOrCancelCollection(view_id,col_status,elem){
		var param={
				"view_id" : view_id,
				"user_id" : user_id,
				"col_status":col_status
		};
		pointService.addCollectionview(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				if(col_status == 1)
					elem.addClass("collected_iocn");
				else
					elem.removeClass("collected_iocn");
			}
			else{
				if(col_status == 1)
					layerUtils.iAlert("关注组合失败:"+resultVo.error_info,-1);
				else 
					layerUtils.iAlert("取消关注组合失败:"+resultVo.error_info,-1);
			}
		},{isShowWait:false});
	}
	
	
	/**
	 * 用户是否收藏了该观点
	 * */
	function queryisSubView(){
		var param={
				"view_id":view_id,
				"user_id":user_id
		};
		userService.isSubView(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				if("已收藏"==resultVo.error_info)
				$(_pageId+"#collect_iocn").addClass("collected_iocn");
				else
				 $(_pageId+"#collect_iocn").removeClass("collected_iocn");
			}else if(resultVo.error_no=='-40838002'){
				layerUtils.iAlert("判断用户是否收藏失败:"+resultVo.error_info,-1) ;
			}
			else{
				
			}
		},{isShowWait:false});

	}
	/**
	 * 增加观点的阅读数
	 * */
	function addViewReadNum(){
		var param={
				"view_id":view_id,
				"user_id":user_id
		};
		pointService.addViewReadNum(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				
			}else{
				layerUtils.iAlert("增加观点阅读数失败:"+resultVo.error_info,-1) ;
			}
		});

	}

	//查看观点详情
	function queryNewViewDetails(view_id){
		var param={
				"curPage" : 1,
				"numPerPage" : 3,
				"view_id":view_id
		};
		pointService.queryPointDetails(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				var result = resultVo.results;
				fillPointDetails(result);
			}
			else{
				layerUtils.iAlert("观点详情加载失败:"+resultVo.error_info,-1) ;
			}
		});
	}

	/**
	 * 查询后绑定填充数据
	 */
	function fillPointDetails(result){
		$(_pageId + "#pointList").html("");
		var html = "";
		for(var i = 0;i<result.length;i++)
		{
			html += '<li id="'+result[i].view_id+'"><a href="javascript:void(0)"><div class="view_con">';
			html += '<div class="sy_list_tit"><div class="tx_box">';
			if("" == result[i].user_image_small)
				html+='<img src="images/my_tx.png" class="rounded" width="30" id="'+result[i].invest_id+'"/></div>';

			else{
				html+='<img src="'+domain+result[i].user_image_small+'" class="rounded" width="30" id="'+result[i].invest_id+'" /></div>';
			}

			html +='<div class="list_info"><p id="'+result[i].invest_id+'">'+result[i].invest_name+'</p><span>'+result[i].create_time+'&nbsp;&nbsp;&nbsp;阅读  '+result[i].read_num+'</span></div><div class="review_iocn">';
			html += '<em></em><p class="text-center">'+result[i].comment_num+'</p></div></div>';
			html +='<div class="sy_list_txt">';
			html += '<p id="view_title" style="text-align:center;">'+result[i].title+'</p>';
			html +='</div></div><div class="detail_txt"><p id="view_content">'+result[i].content+'</p></div></a></li>';

		}
		$(_pageId + "#pointList").append(html);

	}


	//查看评论
	function queryViewComment(view_id,insertType){
		var type;
		if(curPage>1){
			type=false;
		}else{
			type=true;
		}
		insertType =  typeof insertType == "undefined" || insertType == "" || insertType == null ? "html":insertType;
		var param={
				"curPage" : curPage,
				"numPerPage" : numPerPage,
				"view_id":view_id

		};
		pointService.queryViewComment(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				var result =resultVo.results[0].data;
				totalPage = resultVo.results[0].totalPages;
				totalRows = resultVo.results[0].totalRows;
				num = result.length;
				
				fillqueryViewCommentData(result,insertType);
				
			}else if(resultVo.error_no=='-40836102'){
				$(_pageId + "#pointList1").html("");
				var height = $(window).height()-$(_pageId + ".header").height()-$(_pageId + ".combination_list").height()-$(_pageId + ".answer_box").height()-12;
				var noDataHtml = '<div class="no_data_box" style="height:'+height+'px;"><em></em><p>暂无评论</p></div>';
				$(_pageId + "#pointList1").append(noDataHtml);
			}else{
				layerUtils.iAlert("评论详情加载失败:"+resultVo.error_info,-1) ;
			}
		},{isShowWait:false});
	}

	//评论数据填充

	function fillqueryViewCommentData(result,insertType){
		$(_pageId + "#pointList1 .load_more").remove();
		$(_pageId + "#pointList1 .load_add").remove();
		if(insertType == 'html'){
			$(_pageId + "#pointList1").html("");
		}
		var html1 = "";
		for(var i = 0;i<result.length;i++)
		{
			html1+='<li id="'+result[i].user_id+'"><div class="li_lower"><div class="ring">';
			if(result[i].face_image_small==null||""==result[i].face_image)
				html1+='<img src="images/my_tx.png" class="rounded" width="26" /></div>';

			else{
				html1+='<img src="'+domain+result[i].face_image_small+'" class="rounded" width="30" /></div>';
			}
			html1+='<div class="list_info"><h4>'+result[i].comment_content+'</h4>';
			html1+='<p>评论者 : '+result[i].user_name+"&nbsp;&nbsp;&nbsp;&nbsp; "+result[i].create_time+'</p></div></div></li>';

		}
		$(_pageId + "#pointList1").append(html1);
		if(curPage != totalPage){
			/*$(_pageId + "#pointList1").append('<a href="javascript:void(0);" class="load_add" style="">点击查看更多....</a>');*/
			$(_pageId + "#pointList1").append('<div class="load_more"><a href="javascript:void(0);" class="load_add" style="">点击查看更多....</a></div>');
		}
	}
	



	//*********************************************************************//

	/**
	 * 销毁
	 */
	function destroy() {
		//隐藏菜单以及遮罩层
		pageCommon.hideHeaderMenuFunc(_pageId);
		$(_pageId + "#pointList").html("");
		$(_pageId + "#pointList1").html("");
	
	}

	var point_pointDetail = {
			"init" : init,
			"bindPageEvent" : bindPageEvent,
			"destroy" : destroy
	};

	module.exports = point_pointDetail;
});