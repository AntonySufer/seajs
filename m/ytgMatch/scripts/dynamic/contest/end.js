/**
 * 赛场详情——结束
 * @author 余一一
 * @date 2016-03-15
 */
define("ytgMatch/scripts/dynamic/contest/end", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	layerUtils = require("layerUtils"), 
	gconfig = require("gconfig"),
	validatorUtil = require("validatorUtil"),
	Common = require("ytgMatchCommon"),//公告方法
	userService = require("userService").getInstance(),//服务
	ytgMatchService = require("ytgMatchService"),//服务
	pageCode = "dynamic/contest/end", 
	_pageId = "#dynamic_contest_end  ";
   
	var act_id ="";//大赛id
	var user_id ="";//用户id
	var activity_type ="";//大赛属性
	var frontPage ="";//前置页面pagecode
	var applyState ="";//报名状态
	var isLastDay = "";//判断是否是比赛的最后一天 0 不是  1 是
	var account_id ="";//组合id
	var userInfo = null;
	/**
	 * 初始化
	 */
	function init() {
		$(_pageId+"#apply_type").css({"color":"gray","border":"1px solid gray"});
		act_id = appUtils.getSStorageInfo("act_id");//大赛id
		user_id = appUtils.getSStorageInfo("userId",true);//用户id
		frontPage = appUtils.getPageParam("frontPage");//前置页面
		userInfo=appUtils.getPageParam("userInfo");//微证券进入活动
		if (userInfo) {
			  //获取用户信息 //从活动广告页进入
			 loginFunc();
		}else{
		
		     if (!act_id) {
				act_id = appUtils.getPageParam("act_id");//大赛id	
			}if (!user_id) {
				user_id = appUtils.getPageParam("userId");//大赛id	
			}
			 queryMatchDetail();//查询大赛详情
	/*	   var paraMaps = {};
			paraMaps["act_id"] = act_id;
			paraMaps["userId"] = user_id;
		Common.loadShare(_pageId,pageCode,"华林炒股大赛","大赛详情",paraMaps);//原生分享
	*/
	  }
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
		
		
		//排行榜，比赛动态/参赛名单
		appUtils.bindEvent($(_pageId + "#match_select li"), function(){
			var index = $(this).index()+1;
			var redirect_type ="";
			if (index ==1 ) {
				//排行榜
				redirect_type = "public/rankingList";
	    	}if(index == 2){
               //比赛动态
	    		redirect_type = "public/competitionDynamics";
			}if(index == 3){
				//参赛名单
				redirect_type = "public/entryList";
		    }
			var dsname = $(_pageId + "#dsname").html();
			appUtils.clearSStorage("match_status");
			appUtils.setSStorageInfo("match_status",2);
			appUtils.pageInit(pageCode,redirect_type,{"match_name":dsname,"activity_type":activity_type});
			
		});
		
		//历史战绩
		appUtils.bindEvent($(_pageId + "#apply_type"), function(){
			var value=$(this).text();
			var dsname = $(_pageId + "#dsname").html();
			appUtils.clearSStorage("account_id");
			appUtils.setSStorageInfo("account_id",account_id);
			if (value=="历史战绩") {
				appUtils.pageInit(pageCode,"public/positionEnd",{"match_name":dsname,"account_id":account_id});	
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
						$(_pageId+"#award_list").html("");
						for (var i = 0; i < awardList.length; i++) {
							 var index = awardList[i].serinum;//排名
							  awardHtml +="<p><span>"+index+"等奖：</span><span >"+awardList[i].award_name+"</span></p>";	  	
						} 
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
	     isLastDay = result[0].islastDay;
		applyState = result[0].apply_state;
	    activity_type=result[0].activity_type;//大赛属性
			// sec_type = result[0].sec_type;
			 $(_pageId+"#activity_type").html(result[0].activity_type);//大赛属性
			 $(_pageId+"#dsname").html(result[0].act_name);//大赛名称
			 $(_pageId+"#act_id").val(result[0].act_id);//大赛id
			 $(_pageId+"#act_number").html(result[0].act_number);//大赛人数
			 $(_pageId+"#act_name").html(result[0].act_name);//大赛名称
			 $(_pageId+"#applydata").html(result[0].apply_begin_date+"-"+result[0].apply_end_date+ " "+ apply_stateHtml);//报名时间
			 $(_pageId+"#data").html(result[0].begin_date+"-"+result[0].end_date+" "+match_stateHtml);//大赛时间
			 $(_pageId+"#init_money").html("<span>初始资金：¥</span>"+result[0].init_money);//初始资金
			 $(_pageId+"#introduction").html(result[0].introduction);//大赛介绍
			 $(_pageId+"#ad_message").html(result[0].ad_message);//大赛介绍
		/*	 //股票类型
			 var sec_type = result[0].sec_type? result[0].sec_type:"0,2,4,9,12,17,18";//炒股类型
			 var sec_typeHtml = Common.queryStocktype(sec_type);
			 $(_pageId+"#sec_type").html(sec_typeHtml);*/
			 
			 //用户没有登陆
			 if(user_id){
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
							if (result!=null && result.length>0) {
								//审核赛
								var isclose = result[0].state;
								   if (isclose =="1"){
									account_id=result[0].account_id;//获取组合id
									queryUserRanking(param);//查询用户的收益	
								   $(_pageId+"#apply_type").html("历史战绩");
								  }else{
								   $(_pageId+"#apply_type").html("比赛结束");
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
					var item =result[0];
					var total_yield = (Number(item.total_yield)*100).toFixed(2); //总收益
					 $(_pageId+"#user_ranking").html(item.total_yield_rankings);//排行	
					 $(_pageId+"#user_income").html(total_yield?total_yield:"--");//总收益		
						
				}
			 }else{
				 layerUtils.iAlert("查询排行失败:"+resultVo.error_info,-1); 
			 }
	   
		}); 
	}
	
	/**
	 * 登录
	 * */
	function loginFunc(){
		var param = {
			"userInfo":userInfo
			
		};
		var ctrlParam = {
				"isLastReq" : true, //是否是最后一次请求
				"isShowWait" : false //是否显示等待层
		};
		if(userInfo!=null){	
			//不可重复提交表单
			userService.hlLogin(param,function callBack(resultVo){
				if(Number(resultVo.error_no) == 0){
					//将登录信息写入缓存
					var result = resultVo.results[0];
					var userId = result.user_id;
					var loginId = result.login_id;
					var userType = result.user_type;
					var userName = result.user_name;
					//登录后,设置相关cookie
					appUtils.setSStorageInfo("_isLoginIn","true");
					appUtils.setSStorageInfo("userId",userId,true);
					appUtils.setSStorageInfo("loginId",loginId,true);
					appUtils.setSStorageInfo("userType",userType,true);
					appUtils.setSStorageInfo("userName",userName,true);
					user_id = appUtils.getSStorageInfo("userId",true);	
					 if (user_id) {
						 //从活动广告页进入
						 act_id = appUtils.getPageParam("act_id");//大赛id
						 if (act_id) {
							   appUtils.clearSStorage("act_id");
							   appUtils.setSStorageInfo("act_id",act_id);
						}
						 queryMatchDetail();//查询大赛列表
						
					  }
				}
			},ctrlParam);
		}
	}
	
   
	/** ****************************************************************** */
	
	/**
	 * 销毁
	 */
	function destroy() {
		 $(_pageId+"#award_list").html("");//清除奖品信息	
		 $(_pageId+"#dsname").html("");//清除奖品信息
		 $(_pageId+"#apply_type").html("比赛结束");
		 $(_pageId+"#join_match").css({"color":"gray","border":"1px solid gray"});
		 $(_pageId+"#act_number").html("--");//大赛人数
		 $(_pageId+"#act_name").html("");//大赛名称
		 $(_pageId+"#applydata").html("--");//报名时间
		 $(_pageId+"#data").html("--");//大赛时间
		 $(_pageId+"#init_money").html("<span>初始资金：</span>");//初始资金
		 $(_pageId+"#introduction").html("<span>大赛简介：</span>");//大赛介绍	
		 $(_pageId+"#user_ranking").html("--");//排行	
		 $(_pageId+"#user_income").html("--");//总收益	
	}

	
	var ing = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = ing;
});