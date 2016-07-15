/**
 * 我的赛场列表
 * @author 余一一
 * @date 2016-03-21
 */
define("ytg/scripts/ytgMatch/simulatedStocks/myMatch", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	layerUtils = require("layerUtils"), 
	gconfig = require("gconfig"),
	validatorUtil = require("validatorUtil"),
	ytgMatchService = require("ytgMatchService"),//服务
	pageCode = "ytgMatch/simulatedStocks/myMatch", 
	_pageId = "#ytgMatch_simulatedStocks_myMatch  ";
	
	//页面公共JS
	var pageCommon = require("pageCommon");
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null,"_init":false}; //上下滑动
	var num=0;
	var all_curPage=1;
	var ing_curPage =1;
	var end_curPage= 1;//页
	var	numPerPage = 8;
    var totalPage = 1;
    var totalRows =1;
   
	var user_id ="";//用户id
	var search_type = 1;//1：进行中 2.已结束
	var isFirstShow =true;//判断是否第一次进入
	/**
	 * 初始化
	 */
	function init() {
		act_id = appUtils.getSStorageInfo("act_id");//大赛id
		user_id = appUtils.getSStorageInfo("userId",true);//用户id
		if (isFirstShow) {
			queryMyMatchList(ing_curPage,"#ingMatch",search_type);//查询我的大赛详情
			isFirstShow =false;
		}
		
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent(){
		//头部菜单绑定事件
		pageCommon.headerMenuFunc(_pageId,pageCode);
		//返回
		appUtils.bindEvent($(_pageId + ".back_btn"), function(){
			destroyScroll();//销毁
			appUtils.pageBack();
		});	
		
		
		//比赛进行中
		appUtils.bindEvent($(_pageId + "#button_ingMatch"), function(){
			 $(this).siblings(".row-1").children("a").removeClass("active");
			 $(this).children("a").addClass("active");
			 $(_pageId + "#endMatch").hide();//
			 search_type =1;
			 if (ing_curPage ==1) {
					queryMyMatchList(ing_curPage,"#ingMatch",search_type);//查询我的大赛详情
			} 
			 $(_pageId + "#ingMatch").show();//显示当前
		});	
		

		//比赛结束
		appUtils.bindEvent($(_pageId + "#button_endMatch"), function(){
			 $(this).siblings(".row-1").children("a").removeClass("active");
			 $(this).children("a").addClass("active");
			 $(_pageId + "#ingMatch").hide();//
			 search_type =2;
			 if (end_curPage ==1) {
					queryMyMatchList(end_curPage,"#endMatch",search_type);//查询我的大赛详情
			} 
			 $(_pageId + "#endMatch").show();//显示当前
		});	
		
		
		
		
	}
	
	/** *************************【函数方法】***************************** */
	/***
	 * 查询用户参加的比赛
	 * curpage 当前页
	 * insertHtmlId 填充的id选择器
	 * type 大赛状态，结束进行
	 * 
	 */
	function queryMyMatchList(curPage,insertHtmlId,type,loadType){
		
		var param={
				"user_id" : user_id,
				"curPage":curPage,
				"numPerPage":numPerPage
		};
		//402509
		ytgMatchService.queryUserAllMatch(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				if(resultVo.results != null && resultVo.results.length >0){
					var result = resultVo.results[0].data;
					loadIngMatch(insertHtmlId,result,type,loadType);
				}
			}else{
				layerUtils.iAlert("TA的活动加载失败:"+resultVo.error_info,-1);
			}
		},null);
	}
	
	
	/***
	 * 填充数据
	 */
    function loadIngMatch(htmlId,result,types,loadType){
		
		var inghtml = "";//进行中的比赛
		var endhtml = "";//结束的比赛
		if(loadType != "append"){
			$(_pageId + htmlId).html("");
		}
		
		var my_ingCounts =0;//进行中
		var my_endCounts =0;//结束比赛数量
		for(var i = 0;result !=null &&i<result.length;i++) {
	     //比赛状态:0未开始，1进行中，2已结束
			var match_stateHtml="";//html
			var apply_stateHtml="";//html
			var manageHtml="";
			if(result[i].apply_state=="0"){//报名状态:0未开始，1进行中，2已结束
				apply_stateHtml="待审核";
			}else if(result[i].apply_state=="1"){//报名状态:0未开始，1进行中，2已结束
				apply_stateHtml="审核通过";
			}else if(result[i].apply_state=="2"){//报名状态:0未开始，1进行中，2已结束
				apply_stateHtml="审核不通过";
			}
			
			if(result[i].match_state=="0"){//比赛状态:0未开始，1进行中，2已结束
				match_stateHtml="</span><em class='aorange'>未开始</em>";
			}else if(result[i].match_state=="1"){//比赛状态:0未开始，1进行中，2已结束
				match_stateHtml="</span><em class='aorange'>进行中</em>";
			}else if(result[i].match_state=="2"){//比赛状态:0未开始，1进行中，2已结束
				match_stateHtml="</span><em class='aorange'>已结束</em>";
			}
			
			//显示模拟炒股
			if (result[i].match_state=="1" && result[0].apply_state=="1") {
				manageHtml="<div class='li_btn' id='+"+result[i].act_id+"+'><a href='javascript:void(0);'>模拟炒股</a></div>";
			}
			//总收益
			var total_yield=result[i].total_yield;
			if(parseFloat(total_yield)>0){
				total_yield="<b  class=\"ared\">"+total_yield+"</b>";
			}else if(parseFloat(total_yield)<0){
				total_yield="<b  class=\"agreen\">"+total_yield+"</b>";
			}else{
				total_yield="<b  >"+total_yield+"</b>";
			}
			
			if (result[i].match_state=="1" ||result[i].match_state=="0") {
				my_ingCounts++;
				inghtml +="<li id='"+result[i].act_id+"' name='"+result[i].match_state+"'><div class='li_up'><span class='fr_txt'>"+apply_stateHtml+"</span>"
						 +" <h3>"+result[i].act_name+"</h3></div><div class='li_lower'>"
						 +" <div class='ui layout'><div class='row-1'>"
						 +" <span>比赛状态</span><p class='aorange'>"+match_stateHtml+"</p></div>"
						 +" <div class='row-1'><span>收益率</span>"
						 +" <p>"+total_yield+"</p></div><div class='row-1'>"
						 +" <span>排名</span><p>"+result[i].total_yield_rankings+"</p>"
						 +" </div></div></div>"+manageHtml+"</li>";	
				
			} if(result[i].match_state=="2") {
				my_endCounts++;
				endhtml +="<li id='"+result[i].act_id+"' name='"+result[i].match_state+"' ><div class='li_up'><span class='fr_txt'>"+apply_stateHtml+"</span>"
						 +" <h3>"+result[i].act_name+"</h3></div><div class='li_lower'>"
						 +" <div class='ui layout'><div class='row-1'>"
						 +" <span>比赛状态</span><p class='aorange'>"+match_stateHtml+"</p></div>"
						 +" <div class='row-1'><span>收益率</span>"
						 +" <p>"+total_yield+"</p></div><div class='row-1'>"
						 +" <span>排名</span><p>"+result[i].total_yield_rankings+"</p>"
						 +" </div></div></div>"+manageHtml+"</li>";		
			}
	
		}
		//填充     数量
		$(_pageId + "#button_ingMatch a " ).html("进行中("+my_ingCounts+"）");
		$(_pageId + "#button_endMatch a "  ).html("已结束("+my_endCounts+"）");
		   if (types==1) {
			$(_pageId + htmlId ).append(inghtml);
		  }if(types==2){
			$(_pageId + htmlId ).append(endhtml);
		  }
		  
		  
		//进入大赛详情
			appUtils.preBindEvent($(_pageId + "#container_match"),"li", function(){
				var act_id = $(this).attr("id");//大赛id
				var match_status = $(this).attr("name");//大赛状态
				if (act_id) {
					var followCode = "ytgMatch/dynamic/contest/registration";
					if(match_status == "1"){	//进行中
						 followCode = "ytgMatch/dynamic/contest/ing";
					}else if(match_status == "2"){//已结束
						followCode = "ytgMatch/dynamic/contest/end";
					}
					try {
						  appUtils.clearSStorage("act_id");
						  appUtils.setSStorageInfo("act_id",act_id);
				    } catch (e) {
				    	layerUtils.iAlert("你的浏览器不支持sessionStorage",-1);
					  }
					appUtils.pageInit(pageCode,followCode, {"frontPage":pageCode});
				    
				}else{
					layerUtils.iAlert("没有获取到大赛id");
				}
			},"click");	
		  
		
		
		num = result.length*1;
		totalPage = result[0].totalPages*1;	//数据的总页数
		all_curPage = result[0].currentPage*1;
		totalRows = result[0].totalRows*1;
		initVIScroll(htmlId,num);//滑动
		
		
		
     }
	


/**
 * 初始化上下滑动组件 
 */
function initVIScroll(htmlId,num){
	if(!vIscroll._init){
		var config = {
				"isPagingType": false,		//false表示是微博那种累加形式，true表示分页形式
				"visibleHeight": $(window).height()-$(_pageId +" .header").height() - $(_pageId +" .my_game_tab").height(),//显示内容区域的高度，当isPaingType为false时传
				"container": $(_pageId+" #container_match"),
				"wrapper":$(_pageId+" #wrapper_match"),	
				//下拉完毕后执行的方法	
				"downHandle": function() {	
					//上拉将当前页数设置为1
					ing_curPage = 1;
					end_curPage = 1;
						if (search_type==1) {
							//查询数据
						queryMyMatchList(ing_curPage,htmlId,search_type);//查询我的大赛详情
						} if (search_type==2){
							//查询数据
						queryMyMatchList(end_curPage,htmlId,search_type);//查询我的大赛详情
							
						}//下拉获取上一页数据方法	
				},
				"upHandle": function() {				//上拉获取下一页数据方法
					if(all_curPage < totalPage){			//判断当前页数是不是小于总页数
						if (search_type==1) {
							end_curPage++;
							queryMyMatchList(ing_curPage,htmlId,search_type);//查询我的大赛详情
							
						} if (search_type==2){
							ing_curPage++;
							queryMyMatchList(end_curPage,htmlId,search_type);//查询我的大赛详情	
						}	
					}
				},
				"wrapperObj": null
		};
		vIscroll.scroll = new VIscroll(config); 	//初始化，需要做if(!hIscroll._init)判断
		vIscroll._init = true; 						//尽量只初始化一次，保持性能
		if(num < numPerPage || num==totalRows){
			$(_pageId + " .visc_pullUp").hide();
		}
	} else {
		vIscroll.scroll.refresh();
        
	
		if(all_curPage == 1){
			if(num < numPerPage || num==totalRows){
				$(_pageId+" .visc_pullUp").hide();
			}else{
				$(_pageId+" .visc_pullUp").show();
			}
		}else{
			if(num < numPerPage || (num == numPerPage && all_curPage == totalPage)){
				$(_pageId+" .visc_pullUp").hide();
			}else{
				$(_pageId+" .visc_pullUp").show();
			}
		}

	}
}
   
	
/** ****************************************************************** */
   /***
    * 销毁
    */
   function destroyScroll(){
	 //销毁滑动插件
		if(vIscroll._init == true){
			vIscroll.scroll.destroy(); //销毁
			vIscroll.scroll = null;
			vIscroll._init = false; 
		}
		 num=0;
		 all_curPage=1;
		 ing_curPage =1;
		 end_curPage= 1;//页
		 numPerPage = 8;
	    totalPage = 1;
	    totalRows =1;
	    search_type =1;
	    isFirstShow =true;//判断是否第一次进入
		$(_pageId + "#ingMatch").html("");
		$(_pageId + "#endMatch").html("");
		$(_pageId + "#ingMatch").show();//显示当前
		$(_pageId + "#endMatch").hide();//显示当前
		$(_pageId + "#ingMatch").siblings(".row-1").children("a").removeClass("active");
		$(_pageId + "#ingMatch").children("a").addClass("active");
   }	



	/**
	 * 销毁
	 */
	function destroy() {
		//隐藏菜单以及遮罩层
		pageCommon.hideHeaderMenuFunc(_pageId);
	}

	
	var myMatch = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = myMatch;
});