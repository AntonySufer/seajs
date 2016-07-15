/**
 *  比赛名单
 * @author 余一一
 * @date 2016-03-15
 */
define("ytg/scripts/ytgMatch/public/entryList", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
		pageCode = "ytgMatch/public/entryList", 
		ytgMatchService = require("ytgMatchService"),//服务
		 userService=require("userService"),
		_pageId = "#ytgMatch_public_entryList ";
	
	//插件
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null,"_init":false}; //上下滑动
	//页面公共JS
	var pageCommon = require("pageCommon");
	var numPerPage= 10;//行
	var curPage= 1;//页
	var user_id = "";//用户id
	var act_id = ""//大赛id
	var rank_type = 2;//排行类型，//0，周收益；1，月收益；2日收益；3总收益
	var activity_type ="";//大赛属性
	var daname ="";//大赛名称
	var match_status ="";//大赛状态
	var num =0;
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
			 if (match_status=="1") {
				 appUtils.pageInit(pageCode,"ytgMatch/dynamic/contest/ing",{});	
			}if (match_status=="0") {
				 appUtils.pageInit(pageCode,"ytgMatch/dynamic/contest/registration",{});	
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
			 appUtils.pageInit(pageCode,"ytgMatch/public/positionIng",{"match_name":daname,"account_id":account_id,"invest_id":invest_ids,"rankings":rankings});	
		}if (match_status=="2") {
			 appUtils.pageInit(pageCode,"ytgMatch/public/positionEnd",{"match_name":daname,"account_id":account_id,"invest_id":invest_ids,"rankings":rankings});	
		}
		 	e.stopPropagation(); 	
			},"click"); 
		
		
		
	}
	
	//***************************【函数方法】***********************************//
	
	
	
	//参赛名单
	function QueryJoin(){
		var param={
				"act_id":act_id,
				"num":7,
				"user_id":user_id
		};
		
		ytgMatchService.queryJoinUser(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				if(resultVo.results!=null && resultVo.results!=undefined){
					var result = resultVo.results;
					if(result != null && result != ""){
						queryJoinData(result);
					}
				}else{
					//没有数据
					var height = $(window).height() - $(_pageId +" .header").height()-$(_pageId+" .top_nav").height();
					$(_pageId + "#join").html("");
					var noDataHtml = '<div  style="height:'+height+'px; font-size:16px; color:#9999B1; background-color:#FFFFFF; text-align:center; padding-top:150px; margin-top: 0.1rem;">暂无参赛人员</div>';
					$(_pageId + "#join").append(noDataHtml);
				}
			}else if(resultVo.error_no == '-40180502'){
				//没有数据
				var height = $(window).height() - $(_pageId +" .header").height()-$(_pageId+" .top_nav").height();
				$(_pageId + "#join").html("");
				var noDataHtml = '<div  style="height:'+height+'px; font-size:16px; color:#9999B1; background-color:#FFFFFF; text-align:center; padding-top:150px; margin-top: 0.1rem;">暂无参赛人员</div>';
				$(_pageId + "#join").append(noDataHtml);
			}else{
				layerUtils.iAlert("参赛名单加载失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	
	//参赛名单信息
	function queryJoinData(results){
		var result =results[0].data;
		$(_pageId + "#join").html("");
		var html = "";
		for(var i=0; result != null && i<result.length; i++){
			//默认图片
			var faceImage = result[i].face_image_small? result[i].face_image_small:"images/my_tx.png";
			//总收益
			var total_yield =result[i].total_yield?parseFloat(result[i].total_yield).toFixed(2):0;
			
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
		 		+"	<p>收益：<span>"+total_yield+"%</span></p>"
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
	
	//*********************************************************************//
	//销毁
	function destoryScroll(){
		curPage = 1;		//当前页数
		totalPage=1;		//后台返回的总页数
		totalRows = 0;     //总条数
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