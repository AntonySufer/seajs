/**
 *  比赛名单
 * @author 余一一
 * @date 2016-03-15
 */
define("ytgMatch/scripts/public/entryList", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
		pageCode = "public/entryList", 
		ytgMatchService = require("ytgMatchService"),//服务
		 userService=require("userService"),
		_pageId = "#public_entryList ";
	
	//插件
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null,"_init":false}; //上下滑动
	//页面公共JS
	var pageCommon = require("pageCommon");
	var curPage = 1,//当前页
         num = 0,
         numPerPage =10,//显示条数
	     totalPage = 1;//总条数
	var user_id = "";//用户id
	var act_id = ""//大赛id
	var rank_type = 2;//排行类型，//0，周收益；1，月收益；2日收益；3总收益
	var activity_type ="";//大赛属性
	var daname ="";//大赛名称
	var match_status ="";//大赛状态
	//全局变量
	var domain = gconfig.global.domain;
	var isFirstShow =true;//判断是否第一次进入
	/**
	 * 初始化
	 */
	function init() {
		act_id = appUtils.getSStorageInfo("act_id");
		user_id = appUtils.getSStorageInfo("userId",true);
		match_status = appUtils.getSStorageInfo("match_status");//大赛类型
		daname = appUtils.getPageParam("match_name");//大赛类型
		if (isFirstShow) {
			destoryScroll();//销毁
			QueryJoin();//查询参数
			isFirstShow =false;
		}
		
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent() {
       
		//头部菜单绑定事件
		pageCommon.headerMenuFunc(_pageId,pageCode);
		
		//返回
		appUtils.bindEvent($(_pageId + ".back_btn"), function(){
			isFirstShow =true;//销毁
			destoryScroll();
			 if (match_status=="1") {
				 appUtils.pageInit(pageCode,"dynamic/contest/ing",{});	
			}if (match_status=="0") {
				 appUtils.pageInit(pageCode,"dynamic/contest/registration",{});	
			}if(match_status=="2"){
				 appUtils.pageInit(pageCode,"dynamic/contest/end",{});	
			}
		});
		//点击关注
		appUtils.preBindEvent($(_pageId + "#join"),".gz_btn", function(e){
			//被关注人id
			var invest_id = $(this).parent(".rt_btn").parent("li.ui ").attr("name");
			var html_id =$(this).attr("id");//索引
			if(!user_id){
				appUtils.setSStorageInfo("hisPageCode",pageCode);	
				appUtils.pageInit(pageCode,"account/login");
				}
				else {
					cancelOrAttInvest(html_id,invest_id);//取消or关注
				}
				e.stopPropagation(); 
				
			},"click"); 
			
		//点击人员
		appUtils.preBindEvent($(_pageId + "#join"),"li", function(e){
		  var account_id = $(this).attr("id");//account_id
		  //参赛人id
		 var invest_ids = $(this).attr("name");
		 //排名
		 var rankings = $(this).data("yeled");
		if (rankings=="undefined") {
			rankings="";
	    	}
		  //组合详情
		
		 //清除session
		 appUtils.clearSStorage("match_name");//大赛名称
		 appUtils.clearSStorage("account_id");//大赛名称
		 appUtils.clearSStorage("invest_id");//大赛名称
		 appUtils.clearSStorage("rankings");//大赛名称
		 //保存信息
		 appUtils.setSStorageInfo("match_name",daname);//大赛名称
		 appUtils.setSStorageInfo("account_id",account_id);//大赛名称
		 appUtils.setSStorageInfo("invest_id",invest_ids);//大赛名称
		 appUtils.setSStorageInfo("rankings",rankings);//大赛名称
		if (match_status=="1") {
			 appUtils.pageInit(pageCode,"public/positionIng",{"match_name":daname,"account_id":account_id,"invest_id":invest_ids,"rankings":rankings});	
		}if (match_status=="2") {
			 appUtils.pageInit(pageCode,"public/positionEnd",{"match_name":daname,"account_id":account_id,"invest_id":invest_ids,"rankings":rankings});	
		}
		 	e.stopPropagation(); 	
			},"click"); 
		
		
		
	}
	
	//***************************【函数方法】***********************************//
	
	
	
	//参赛名单
	function QueryJoin(loadType){
		var param={
				"act_id":act_id,
				"numPerPage":numPerPage,
				"user_id":user_id,
				"curPage":curPage
		};
		
		ytgMatchService.queryJoinUser(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				if(resultVo.results!=null && resultVo.results!=undefined){
					var results=resultVo.results;
					if (results !=null && results.length>0) {
						var  result = resultVo.results[0].data;
						queryJoinData(result,loadType);//填充到页面	
						num = result.length;
						totalPage=results[0].totalPages;	//数据的总页数
						curPage=results[0].currentPage;	//数据的当前页数
						totalRows = results[0].totalRows;
						 initVIScroll(num);	
					
					}
				}else{
					//没有数据
					var height = $(window).height() - $(_pageId +" .header").height()-$(_pageId+" .top_nav").height();
					$(_pageId + "#join").html("");
					var noDataHtml = '<div  style="height:'+height+'px; font-size:16px; color:#9999B1; background-color:#FFFFFF; text-align:center; padding-top:150px; margin-top: 0.1rem;">暂无参赛人员</div>';
					$(_pageId + "#join").append(noDataHtml);
					 initVIScroll(0);	
				}
			}else if(resultVo.error_no == '-40180502'){
				//没有数据
				var height = $(window).height() - $(_pageId +" .header").height()-$(_pageId+" .top_nav").height();
				$(_pageId + "#join").html("");
				var noDataHtml = '<div  style="height:'+height+'px; font-size:16px; color:#9999B1; background-color:#FFFFFF; text-align:center; padding-top:150px; margin-top: 0.1rem;">暂无参赛人员</div>';
				$(_pageId + "#join").append(noDataHtml);
				 initVIScroll(0);	
			}else{
				layerUtils.iAlert("参赛名单加载失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	
	//参赛名单信息
	function queryJoinData(result,loadTypes){
		var html = "";
		if(loadTypes != "append"){
			$(_pageId + "#join").html(html);
		}
		
		var total_yield="";
		var total_yieldHtml ="";
		for(var i=0; result != null && i<result.length; i++){
			//默认图片
			var faceImage = result[i].face_image_small? result[i].face_image_small:"images/my_tx.png";
			//总收益
		    if (result[i].total_yield) {
		    	 total_yield =parseFloat(Number(result[i].total_yield)*100).toFixed(2);
			}else{
				total_yield="0.00";
			}
		    
		    if (total_yield >=0) {
		    	total_yieldHtml="<span class='ared'>"+total_yield+"%</span>";
			}else{
				total_yieldHtml="<span class='agreen'>"+total_yield+"%</span>";
			}
			var attention=result[i].sub_status;//是否关注
			var attention_html="<a href='javascript:void(0);' id='subInvest"+i+"' class='gz_btn '></a>";
			if (attention=="0") {
				//未关注
				attention_html="<a href='javascript:void(0);' id='subInvest"+i+"'  class='gz_btn gz_btn_act'></a>";
			}
	       html +="<li  class='ui layout' id="+result[i].account_id+" name ="+result[i].user_id+" data-yeled="+result[i].total_yield_rankings+" >"
				+" 	 <div class='lt_pic'>"
		 		+"	<em><img src='"+faceImage+"' class='circle' /></em>"
		 		+"	</div>"
		 		+"<div class='row-1 in_txt'>"
		 		+"	<p>"+result[i].name+"</p>"
		 		+"	<p>收益："+total_yieldHtml+"</p>"
		 		+"</div>"
		 		+"<div class='rt_btn'>"
		 		+attention_html
		 		+"</div>"
		 		+"</li>";
			
		}
		$(_pageId + "#join").append(html);
	}
	
	/**
	 * 取消or关注投顾
	 * index 点击的索引
	 * invest_id 被关注的人
	 * */
	function cancelOrAttInvest(html_ids,invest_id){
		var cancelOrAttCallBack=function(resultVo){			
			if(0==Number(resultVo.error_no)){
				var flag = $(_pageId +"#"+html_ids).attr("class");//获取关注/未关祝
				if(flag.indexOf("gz_btn_act")!=-1){
					//取消
					$(_pageId+"#"+html_ids).removeClass("gz_btn_act");
				}
				else{
					//关注
					$(_pageId+"#"+html_ids).addClass("gz_btn_act");
				}
			}
			else {
				layerUtils.iAlert(resultVo.error_info, -1);
			}
		};
		var pram = {
				"user_id":user_id,
				"invest_id" : invest_id
		};
		userService.userSubInvest(pram,cancelOrAttCallBack,{isShowWait:false});
	}
	
	

	/**
     * 初始化上下滑动组件 
     */
    function initVIScroll(num){
    	if(!vIscroll._init){
    		var config = {
    				"isPagingType": false,		//false表示是微博那种累加形式，true表示分页形式
    				"visibleHeight": $(window).height()-$(_pageId +" .header").height(),//显示内容区域的高度，当isPaingType为false时传
    				"container": $(_pageId+" #container_person"),
    				"wrapper":$(_pageId+" #wrapper_person"),	
    				//下拉完毕后执行的方法	
    				"downHandle": function(){				//下拉获取上一页数据方法
    					curPage = 1;						//上拉将当前页数设置为1
    					//查询数据
    					QueryJoin();
    					
    				},
    				"upHandle": function() {
    			        //上拉获取下一页数据方法
    					if(curPage < totalPage){			//判断当前页数是不是小于总页数
    						curPage++;
    						QueryJoin("append");
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
    		if(curPage == 1){
    			if(num < numPerPage || num==totalRows){
    				$(_pageId+" .visc_pullUp").hide();
    			}else{
    				$(_pageId+" .visc_pullUp").show();
    			}
    		}else{
    			if(num < numPerPage || (num == numPerPage && curPage == totalPage)){
    				$(_pageId+" .visc_pullUp").hide();
    			}else{
    				$(_pageId+" .visc_pullUp").show();
    			}
    		}

    	}
    }
    
    
	
	//*********************************************************************//
	//销毁
	function destoryScroll(){
		//销毁滑动插件
		if(vIscroll._init == true){
			vIscroll.scroll.destroy(); //销毁
			vIscroll.scroll = null;
			vIscroll._init = false; 
		}
		numPerPage = 10,//显示条数
		curPage = 1;		//当前页数
		totalPage=1;		//后台返回的总页数
		totalRows =null;     //总条数
		num = 0;
		type = "";			//返回类型
		rankingtype=2;
		isFirstShow =true;
		$(_pageId+" #join").html("");//数据清空
	}
	
	
	/**
	 * 销毁
	 */
	function destroy() {
		//隐藏菜单以及遮罩层
		pageCommon.hideHeaderMenuFunc(_pageId);
	}

	var public_rankingList = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = public_rankingList;
});