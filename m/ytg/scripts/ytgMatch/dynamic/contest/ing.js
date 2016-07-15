/**
 * 赛场详情——进行中
 * @author 余一一
 * @date 2016-03-15
 */
define("ytg/scripts/ytgMatch/dynamic/contest/ing", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	layerUtils = require("layerUtils"), 
	gconfig = require("gconfig"),
	validatorUtil = require("validatorUtil"),
	Common = require("ytgMatchCommon"),//公告方法
	ytgMatchService = require("ytgMatchService"),//服务
	pageCode = "ytgMatch/dynamic/contest/ing", 
	_pageId = "#ytgMatch_dynamic_contest_ing  ";
   
	var act_id ="";//大赛id
	var user_id ="";//用户id
	var activity_type ="";//大赛属性
	var frontPage ="";//前置页面pagecode
	var applyState ="";//报名状态
	/**
	 * 初始化
	 */
	function init() {
		
		act_id = appUtils.getSStorageInfo("act_id");//大赛id
		user_id = appUtils.getSStorageInfo("userId",true);//用户id
		frontPage = appUtils.getPageParam("frontPage");//前置页面
		
		if (!act_id) {
			act_id = appUtils.getPageParam("act_id");//大赛id	
		}if (!user_id) {
			user_id = appUtils.getPageParam("userId");//大赛id	
		}
		 queryMatchDetail();//查询大赛详情
		   var paraMaps = {};
			paraMaps["act_id"] = act_id;
			paraMaps["userId"] = user_id;
		Common.loadShare(_pageId,pageCode,"华林炒股大赛","大赛详情",paraMaps);//原生分享
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent(){
		//返回
		appUtils.bindEvent($(_pageId + ".back_btn"), function(){
			if (!frontPage) {
				appUtils.pageInit(pageCode,"ytgMatch/index");
			}else{
				appUtils.pageInit(pageCode,frontPage);
			}
		});
		
		
		//排行榜，比赛动态/参赛名单
		appUtils.bindEvent($(_pageId + "#match_select li"), function(){
			var index = $(this).index()+1;
			var redirect_type ="";
			if (index ==1 ) {
				//排行榜
				redirect_type = "ytgMatch/public/rankingList";
	    	}if(index == 2){
               //比赛动态
	    		redirect_type = "ytgMatch/public/competitionDynamics";
			}if(index == 3){
				//参赛名单
				redirect_type = "ytgMatch/public/entryList";
		    }
			var dsname = $(_pageId + "#dsname").html();
			appUtils.clearSStorage("match_status");
			appUtils.setSStorageInfo("match_status",1);
			appUtils.pageInit(pageCode,redirect_type,{"match_name":dsname,"activity_type":activity_type});
			
		});
		
		//买卖股票 //报名 
		appUtils.bindEvent($(_pageId + "#apply_type"), function(){
			var value_type =$(this).text();
			if (value_type == "报名") {
				//报名操作
				if (applyState =="1") {
					if (user_id) {
						JoinMatch();//参加比赛
					} else {
						appUtils.setSStorageInfo("hisPageCode",pageCode);	
						appUtils.pageInit(pageCode,"account/login");		
					}
				}
				
			}if(value_type.indexOf("组合") > -1 ){
			var account_id = $(this).attr("name");//获取组合id
			appUtils.clearSStorage("account_id");
			appUtils.setSStorageInfo("account_id",account_id);
			appUtils.pageInit(pageCode,"ytgMatch/simulatedStocks/myPortfolio/queryEntrust/position");
			}
			
		});
		
		//流程点击事件
		appUtils.bindEvent($(_pageId + "#process li"), function(){
			var index = $(this).prevAll().length;
			var flag =$(this).attr("class");//判断样式
			if (flag.indexOf("current")>-1) {
				var value_type =$(_pageId+"#apply_type").text();
				if (value_type == "报名") {
					//报名操作
					if (user_id) {
						JoinMatch();//参加比赛
					} else {
						appUtils.setSStorageInfo("hisPageCode",pageCode);
						appUtils.pageInit(pageCode,"account/login");
					}
		
				}if(value_type.indexOf("组合") > -1 ){
				var account_id = $(_pageId+"#apply_type").attr("name");//获取组合id
				appUtils.clearSStorage("account_id");
				appUtils.setSStorageInfo("account_id",account_id);
				appUtils.pageInit(pageCode,"ytgMatch/simulatedStocks/myPortfolio/queryEntrust/position");
				}
			}
		});
		
		
		
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
					var  awardList = resultVo.awardList;
					if(result != null && result.length>0){
					queryJinXingData(result);
					}
					
					//填充奖品信息
					if (awardList != null && awardList.length>0) {
						var awardHtml ="";
						awardList.forEach(function(item){ 
					     var index = item.serinum;//排名
					     var indexHtml="一";
					     if (index=="2") {
					    	 indexHtml="二";
						 }if (index=="3") {
							 indexHtml="三";
						}
						awardHtml +="<p><span>"+indexHtml+"等奖：</span><span >"+item.award_name+"</span></p>";	  	
							}) ;
						$(_pageId+"#award_list").html(awardHtml);
					}else{
						$(_pageId+"#award_list").html("<p>暂无奖品信息</p>");
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
		var match_stateHtml="";//html
		var apply_stateHtml="";//html
		 if(result!=null&&result.length>0){
			 
		applyState = result[0].apply_state;
		if(result[0].apply_state=="0"){//报名状态:0未开始，1进行中，2已结束
			apply_stateHtml="</span><em class='ared'>未开始</em>";
			 $(_pageId+"#apply_type").html("<i></i>未开始报名");
		}else if(result[0].apply_state=="1"){//报名状态:0未开始，1进行中，2已结束
			apply_stateHtml="</span><em class='ared'>报名中</em>";
			 $(_pageId+"#apply_type").html("<i></i>报名");
			 $(_pageId+".process_list ul li :eq(0)").addClass("current").siblings("li").removeClass("current");
		}else if(result[0].apply_state=="2"){//报名状态:0未开始，1进行中，2已结束
			apply_stateHtml="</span><em class='ared'>报名已结束</em>";
			 $(_pageId+"#apply_type").html("<i></i>报名已结束");
		}
		
		if(result[0].match_state=="0"){//比赛状态:0未开始，1进行中，2已结束
			match_stateHtml="</span><em class='aorange'>未开始</em>";
		}else if(result[0].match_state=="1"){//比赛状态:0未开始，1进行中，2已结束
			match_stateHtml="</span><em class='aorange'>进行中</em>";
		}else if(result[0].match_state=="2"){//比赛状态:0未开始，1进行中，2已结束
			match_stateHtml="</span><em class='aorange'>已结束</em>";
		}
		
			 activity_type=result[0].activity_type;//大赛属性
			// sec_type = result[0].sec_type;
			 $(_pageId+"#activity_type").html(result[0].activity_type);//大赛属性
			 $(_pageId+"#dsname").html(result[0].act_name);//大赛名称
			 $(_pageId+"#act_id").val(result[0].act_id);//大赛id
			 $(_pageId+"#act_number").html(result[0].act_number);//大赛人数
			 $(_pageId+"#act_name").html(result[0].act_name);//大赛名称
			 $(_pageId+"#applydata").html(result[0].apply_begin_date+"-"+result[0].apply_end_date+ " "+ apply_stateHtml);//报名时间
			 $(_pageId+"#data").html(result[0].begin_date+"-"+result[0].end_date+" "+match_stateHtml);//大赛时间
			 $(_pageId+"#init_money").html("<span>初始资金：</span>"+result[0].init_money);//初始资金
			 $(_pageId+"#introduction").html("<span>大赛简介：</span>"+result[0].introduction);//大赛介绍
			 $(_pageId+"#ad_message").html(result[0].ad_message);//大赛介绍
				
			 var  apply_state=Number(result[0].apply_state);//报名状态
			 //股票类型
			 var sec_type = result[0].sec_type? result[0].sec_type:"1,2,3,4,5";//炒股类型
			 var sec_typeHtml = Common.queryStocktype(sec_type);
			 $(_pageId+"#sec_type").html(sec_typeHtml);
			 
			 //用户没有登陆
			 if(!user_id){
				
				 if(apply_state=="0" ){
					 $(_pageId+"#apply_type").html("<i></i>报名未开始");
					 //流程改变 报名
				 } if(apply_state=="1" ){
					 $(_pageId+"#apply_type").html("<i></i>报名");
					 //流程改变 报名
				 } if(apply_state=="2" ) {
					 $(_pageId+"#apply_type").html("<i></i>报名已结束");	
					 
			  }
		$(_pageId+".process_list ul li :eq(0)").addClass("current").siblings("li").removeClass("current");
						 
			 }else {
				     //查询用户是否参加过大赛
					 var param = {
								"activity_type": activity_type,
								"act_id": act_id, 
								"user_id": user_id
						};
					ytgMatchService.queryIsJoinMatch(param,function(resultVo){
							if(0==Number(resultVo.error_no)){
								//参加了大赛
							var result = resultVo.results;
							if (result) {
								var isclose = result[0].state;
								if (isclose =="0") {
									 $(_pageId+"#apply_type").html("<i></i>报名审核中");	
								}
								if (isclose =="2") {
									 $(_pageId+"#apply_type").html("<i></i>您的账号已被关闭");	
								}else{
									$(_pageId+"#apply_type").attr("name",result[0].account_id);
									param["account_id"] =result[0].account_id;//组合id
									$(_pageId+"#apply_type").html("<i></i>操作组合");	 
									$(_pageId+".process_list ul li :eq(1)").addClass("current").siblings("li").removeClass("current");
								
									// queryUserRanking(param);//查询用户的收益	
								}
							
							}
						}
					   
						}); 
				 } 
		  }
	}
	
	/***
	 * 查询用户关于此比赛的收益排行
	 */
	function queryUserRanking(param_info){
		//0，周收益；1，月收益；2日收益；3总收益
		param_info["type"] = 3;
		ytgMatchService.queryUserMatchRanking(param_info,function(resultVo){
			if(0==Number(resultVo.error_no)){
				var error_no = resultVo.error_no;//错误number
				var error_info = resultVo.error_info;//错误信息
				var  result = resultVo.results;	
				if (result) {
				/*	var item =result[0];
					 $(_pageId+"#user_ranking").html(total_yield_rankings);//排行	
					 $(_pageId+"#user_income").html(item.total_yield+"%");//总收益	*/	
					$(_pageId+"#apply_type").html("<i></i>操作组合");	 
					 $(_pageId+".process_list ul li :eq(1)").addClass("current").siblings("li").removeClass("current");
						
				} else {
					 $(_pageId+"#apply_type").html("<i></i>立即炒股");	 
					 $(_pageId+".process_list ul li:eq(1)").addClass("current").siblings("li").removeClass("current");
						 
				}
			 }else{
				 layerUtils.iAlert("查询排行失败:"+resultVo.error_info,-1); 
			 }
	   
		}); 
	}
	
	/***
	 * 用户参加比赛
	 */
	function JoinMatch(){
		
		 var param = {
					"activity_type": activity_type,
					"act_id": act_id, 
					"user_id": user_id
			};
		ytgMatchService.UserJoinMatch(param,function(resultVo){
			if(0==Number(resultVo.error_no)){
				//参加了大赛
			var result = resultVo.results;
			if (result) {
				layerUtils.iAlert("报名成功"); 
				$(_pageId+"#apply_type").attr("name",result[0].account_id);
				 $(_pageId+"#apply_type").html("<i></i>创建组合");	 
				 $(_pageId+".process_list ul li:eq(1)").addClass("current").siblings("li").removeClass("current");
				 queryMatchDetail();//刷新数据
				// queryUserRanking(param);//查询用户的收益	
			  }
		}else{
			layerUtils.iAlert("报名失败:"+resultVo.error_info,-1); 
				 $(_pageId+"#apply_type").html("<i></i>报名");	
				 $(_pageId+".process_list ul li:eq(0)").addClass("current").siblings("li").removeClass("current");
					
	  }
	   
		}); 
		
	}
	
	
   
	/** ****************************************************************** */
	
	/**
	 * 销毁
	 */
	function destroy() {
		 $(_pageId+"#award_list").html("");//清除奖品信息
		 $(_pageId+"#apply_type").html("<i></i>报名");
		 $(_pageId+".process_list ul li :eq(0)").addClass("current").siblings("li").removeClass("current");
			
	}

	
	var ing = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = ing;
});