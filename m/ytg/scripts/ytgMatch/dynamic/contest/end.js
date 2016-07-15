/**
 * 赛场详情——结束
 * @author 余一一
 * @date 2016-03-15
 */
define("ytg/scripts/ytgMatch/dynamic/contest/end", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	layerUtils = require("layerUtils"), 
	gconfig = require("gconfig"),
	validatorUtil = require("validatorUtil"),
	ytgMatchService = require("ytgMatchService"),//服务
	pageCode = "ytgMatch/dynamic/contest/end", 
	_pageId = "#ytgMatch_dynamic_contest_end ";
   
	var apply_status ="";//大赛状态  
	var act_id ="";//大赛id
	var user_id ="";//用户id
	var activity_type ="";//大赛属性
	var frontPage ="index";//前置页面pagecode
	var awardList =null;//奖品信息
	/**
	 * 初始化
	 */
	function init() {
		
		act_id = appUtils.getSStorageInfo("act_id");//大赛id
		frontPage = appUtils.getPageParam("frontPage");//前置页面
		queryMatchDetail();//查询大赛详情
		//loadTournamentRanking();//大赛排行
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent(){
		//返回
		appUtils.bindEvent($(_pageId + ".back_btn"), function(){
			if (!frontPage) {
				appUtils.pageInit(pageCode,"index");
			}else{
				appUtils.pageInit(pageCode,frontPage);
			}
		});
		
		//榜单已经结束
		appUtils.bindEvent($(_pageId + "#rankings_select"), function(){
			var dsname = $(_pageId + "#dsname").html();
			appUtils.clearSStorage("match_status");
			appUtils.setSStorageInfo("match_status",2);
			appUtils.pageInit(pageCode,"ytgMatch/public/rankingList",{"match_name":dsname,"activity_type":activity_type});
		});
	
		
		//点击排行人员，查看人员信息
		appUtils.preBindEvent($(_pageId + " #ranking_match"),"li", function(){
			  var account_id = $(this).attr("id");//获取组合id
			//跳转到此参赛人详情
			  //组合详情
			  //参赛人id
			 var invest_ids = $(this).attr("name");
			 var daname = $(_pageId + "#dsname").html();
			 //排名
			 var rankings = $(this).data("yeled");
	       appUtils.pageInit(pageCode,"ytgMatch/public/positionEnd",{"match_name":daname,"account_id":account_id,"rankings":rankings});	

		},"click");
	
		
		
	}
	
	/** *************************【函数方法】***************************** */
	
	/***
	 * 查询炒股大赛详情
	 * 
	 */
	function queryMatchDetail(){		
		   var paraMap = {};
			paraMap["act_id"] = act_id;
			ytgMatchService.queryMatchDetails(paraMap,function(resultVo){
				//console.info(JSON.stringify(resultVo));
				var error_no = resultVo.error_no;//错误number
				var error_info = resultVo.error_info;//错误信息
				 var totalPages=null;
				if(error_no == "0")
				{ 
					var  result = resultVo.DataSet;	
					awardList =resultVo.awardList;//获取奖品信息
					if(result != null && result != ""){
					queryJinXingData(result);
					loadTournamentRanking();//查询大赛排行榜
				} else{
					layerUtils.iAlert("赛事信息加载失败",-1);
				}
				
				}else{
					layerUtils.iAlert("调用失败:"+resultVo.error_info,-1);
				}
			});	
	}
	

	/***
	 * 进行中赛事信息(填充)
	 */
	function queryJinXingData(result){
		 if(result!=null&&result.length>0){
			 activity_type=result[0].activity_type;
			 $(_pageId+"#activity_type").html(result[0].activity_type);//大赛属性
			 $(_pageId+"#dsname").html(result[0].act_name);//大赛名称
			 $(_pageId+"#init_money").html("初始资金："+result[0].init_money);//初始资金
		  }
		 
	}
	
	/**
	 *
	 * type：0，周收益；1，月收益；2日收益；3总收益
	 * 查询大赛排行（前三名）
	 */
	function loadTournamentRanking(){
		var paraMap = {
				"curPage" : 1,
				"act_id": act_id,
				"type" : 3,		
				"numPerPage" : 3
		};	//列表排行
		
		ytgMatchService.queryMatchRanking(paraMap,function(resultVo){
			if(0==Number(resultVo.error_no)){
		     var  results = resultVo.results;
		     if (results !=null && results.length>0) {
		    	 var result =results[0].data;
		    	 insertRankingNoHtml(result);//填充html
			} 
				
			}else if(resultVo.error_no =="-40180702"){
				//没有数据
				var height = $(window).height() - $(_pageId +" .header").height()-$(_pageId+" .top_nav").height();
				$(_pageId + "#ranking_match").html("");
				var noDataHtml = '<div  style="height:'+height+'px; font-size:16px; color:#9999B1; background-color:#FFFFFF; text-align:center; padding-top:150px; margin-top: 0.1rem;">暂时没有排行数据</div>';
				$(_pageId + "#ranking_match").append(noDataHtml);
				
			}
			 else{
				layerUtils.iAlert("查询大赛排行调用失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	/***
	 * 大赛结果集填充到html页面
	 * @select_type 0，周收益；1，月收益；2日收益；3总收益
	 */
	function insertRankingNoHtml(result){
		$(_pageId+"#ranking_match").html("");
		var insertHtml ="";
		
	if(result!=null && result.length>0){
		//奖品信息
		
		for (var i = 0; i < result.length; i++) {
			var small_img = result[i].face_image_small?result[i].face_image_small:"images/my_tx.png";
			
			var ranking_clsss ="<i class='num_01'></i>冠军";//冠军
			if (i==1) {
					ranking_clsss ="<i class='num_02'></i>季军";//季军
			} if(i==2){
				ranking_clsss ="<i class='num_03'></i>亚军";//亚军   
			}
			var awardName ="";//奖品
			var awardfell ="";//感言
			if (awardList== null || awardList=="") {
				awardName="暂未颁布奖品信息";
				awardfell = "暂无感言";
			}else{
				awardName=awardList[i].award_name;
				awardfell = awardList[i].match_feel;
			}
			var total_yeled =  Number(result[i].total_yield).toFixed(2);
				insertHtml  += "<li id="+result[i].account_id+" name ="+result[i].user_id+" data-yeled="+result[i].total_yield_rankings+"  ><div class='li_up'><div class='pic_box'>"
							+" <em><img src='"+small_img+"' /></em>"
							+"		<span>"+ranking_clsss+"</span></div>"
							+"	<div class='txt_box'>"
							+"		<h4>"+result[i].name+"</h4>"
							+"		<p>赛期收益：<span>"+total_yeled+"<em>%</em></span></p>"
							+"		<p>获得奖品：<em>"+awardName+"元</em></p></div></div>"
							+"<div class='li_lower'><p>获奖感言：</p>"
							+"	<p>"+awardfell+"</p></div></li>";
			
			    };
			$(_pageId+"#ranking_match").append(insertHtml);	  
		   }
	}
	
	
	
   
	/** ****************************************************************** */
	
	/**
	 * 销毁
	 */
	function destroy() {
		$(_pageId + " #ranking_match").html("");
	}

	
	var end = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = end;
});