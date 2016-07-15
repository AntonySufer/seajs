/**
 * 赛场详情——即将开始
 * @author 余一一
 * @date 2016-03-15
 */
define("ytg/scripts/ytgMatch/dynamic/contest/registration", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	layerUtils = require("layerUtils"), 
	gconfig = require("gconfig"),
	validatorUtil = require("validatorUtil"),
	ytgMatchService = require("ytgMatchService"),//服务
	pageCode = "ytgMatch/dynamic/contest/registration", 
	_pageId = "#ytgMatch_dynamic_contest_registration  ";
	ytgMatchCommon = require("ytgMatchCommon");//公告方法
	
	var HIscroll = require("hIscroll");//滑动组件 
	var myHIscroll = null;
	var isbanner =false;
	//页面公共JS
	var pageCommon = require("pageCommon");
	var matchState ="";//大赛状态  
	var applyState ="";//报名状态
	var act_id ="";//大赛id
	var user_id ="";//用户id
	var activity_type ="";//大赛属性
	var frontPage ="";//前置页面pagecode
	/**
	 * 初始化
	 */
	function init() {
		$(_pageId + "#open").hide();
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
		ytgMatchCommon.loadShare(_pageId,pageCode,"华林炒股大赛","大赛详情",paraMaps);//原生分享	
		
    }
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent(){
		
		//头部菜单绑定事件
		pageCommon.headerMenuFunc(_pageId,pageCode);
		//返回
		appUtils.bindEvent($(_pageId + ".back_btn"), function(){
			if (!frontPage) {
				appUtils.pageInit(pageCode,"ytgMatch/index");
			}else{
				appUtils.pageInit(pageCode,frontPage);
			}
		});
		
		//报名
		appUtils.bindEvent($(_pageId + "#join_match"), function(){
			var value =$(this).attr("name");//被关注人id
			if (applyState =="1" && value=="0") {
				if(!user_id){
					appUtils.setSStorageInfo("hisPageCode",pageCode);	
					appUtils.pageInit(pageCode,"account/login");
					}
					else {
						JoinMatch();//参加比赛
					}  
			}
			
		});
		
		//查看参赛名单
		appUtils.bindEvent($(_pageId + "#look_list"), function(){
			appUtils.clearSStorage("match_status");
			appUtils.setSStorageInfo("match_status",0);
			appUtils.pageInit(pageCode,"ytgMatch/public/entryList",{});	
		});
		
		//流程点击事件
		appUtils.bindEvent($(_pageId + "#process li"), function(){
			var value =$(_pageId + "#join_match").attr("name");//被关注人id
			if (applyState =="1" && value=="0") {
				if(!user_id){
					appUtils.setSStorageInfo("hisPageCode",pageCode);	
					appUtils.pageInit(pageCode,"account/login");
					}
					else {
						JoinMatch();//参加比赛
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
					var  awardList = resultVo.awardList;//奖品信息
					//填充赛事信息
					if(result != null && result.length>0){
						queryJinXingData(result);
					}
					//大赛奖品
					if (awardList != null && awardList.length>0) {
						if (!isbanner) {
							getBanner(awardList);//奖品图片轮播
						}
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
						$(_pageId+"#scroller_aword").hide();//奖品图隐藏
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
		var match_state="";//html
		var apply_state="";//html
		
		matchState = result[0].match_state;
		applyState = result[0].apply_state;
		if(result[0].apply_state=="0"){//报名状态:0未开始，1进行中，2已结束
			apply_state="</span><em class='ared'>未开始</em>";
		}else if(result[0].apply_state=="1"){//报名状态:0未开始，1进行中，2已结束
			apply_state="</span><em class='ared'>进行中</em>";
		}else if(result[0].apply_state=="2"){//报名状态:0未开始，1进行中，2已结束
			apply_state="</span><em class='ared'>已结束</em>";
		}
		
		if(result[0].match_state=="0"){//比赛状态:0未开始，1进行中，2已结束
			match_state="</span><em class='aorange'>未开始</em>";
		}else if(result[0].match_state=="1"){//比赛状态:0未开始，1进行中，2已结束
			match_state="</span><em class='aorange'>进行中</em>";
		}else if(result[0].match_state=="2"){//比赛状态:0未开始，1进行中，2已结束
			match_state="</span><em class='aorange'>已结束</em>";
		}
		 if(result!=null&&result.length>0){
			 activity_type=result[0].activity_type;
			 $(_pageId+" #dsname h3").html(result[0].act_name);//大赛名称
			 $(_pageId+"#act_id").val(result[0].act_id);//大赛id
			 $(_pageId+"#act_number").html(result[0].act_number);//大赛人数
			 $(_pageId+"#applydata").html(result[0].apply_begin_date+"-"+result[0].apply_end_date+ " "+ apply_state);//报名时间
			 $(_pageId+"#data").html(result[0].begin_date+"-"+result[0].end_date+" "+match_state);//大赛时间
			 $(_pageId+"#init_money").html("<span>初始资金：</span>"+result[0].init_money);//初始资金
			 $(_pageId+"#introduction").html("<span>大赛简介：</span>"+result[0].introduction);//大赛介绍
			 $(_pageId+"#alerady_join").html(result[0].apply_act_number?result[0].apply_act_number:0);//报名人数
			 $(_pageId+"#new_join").html(result[0].today_act_number);//今日参赛
			 var last_join =result[0].recentlyName;//最后参数人名称
			 if (last_join) {
				 $(_pageId+"#last_join").show();
				 $(_pageId+"#last_join").html("<i></i>用户<em class='ablue'  >"+last_join+"</em>参加了本次大赛");
			} else {
				 $(_pageId+"#last_join").hide();
			}
			 var  apply_state=Number(result[0].apply_state);//报名状态
			
			 //股票类型
			 var sec_type = result[0].sec_type?result[0].sec_type:"1,2,3,4,5";//炒股类型
			 var sec_typeHtml = ytgMatchCommon.queryStocktype(sec_type);
			 $(_pageId+"#sec_types").html(sec_typeHtml);
			 
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
							if (result) {
								 //买卖股票
								 $(_pageId+"#join_match").html("已报名");//组合id
								 $(_pageId+"#join_match").attr("name","1");//组合id
								 $(_pageId+"#join_match").attr("style", "background:gray");
								// queryUserRanking(param);//查询用户的收益	
							 }else{
								 $(_pageId+"#join_match").html("报名");//组合id
								 $(_pageId+"#join_match").attr("name","0");//组合id
						  }
							}else{
								layerUtils.iAlert("调用失败:"+resultVo.error_info,-1);
								
							}
						}); 
				 } 
		  }
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
				 //买卖股票
				 $(_pageId+"#join_match").html("已报名");//组合id
				 $(_pageId+"#join_match").attr("name","1");//组合id
				 $(_pageId+"#join_match").attr("style", "background:gray");
				 queryMatchDetail();//刷新数据
			  }
		}else{
			layerUtils.iAlert("报名失败:"+resultVo.error_info,-1); 
			
					
	  }
	   
		}); 
		
	}
	
	// 加载banner图
	function getBanner(result) {
				var html = "";
				var dot = "";
			if (result.length > 1) {
				for (var i = 0; i < result.length; i++) {
				 html +=" <div class='arena_banner'><img src='"+result[i].award_pict+"' width='100%' /></div>";	
				 dot +="<em></em>";
				}
			$(_pageId + "#scroller_aword").html(html);
			$(_pageId + "#tag_aword").html(dot);
			$(_pageId + "#wrapper_aword").css({"height":'1rem',"overflow":'hidden'});
				setTimeout(function() {
				if (!myHIscroll) {
					var config = {
						wrapper : $(_pageId + "#wrapper_aword"), // wrapper对象
						scroller : $(_pageId + '#scroller_aword'), // scroller对象
						perCount : 1, // 每个可视区域显示的子元素，就是每个滑块区域显示几个子元素
						showTab : false, // 是否有导航点
						tabDiv : $(_pageId + '#tag_aword'), // 导航点集合对象
						auto : true
					// 是否自动播放
					};
					myHIscroll = new HIscroll(config);
					$(_pageId + "#wrapper #scroller_aword div").show();
				 }
			  }, 500);
				
			}else if (result.length == 1) {
				 html +=" <div class='arena_banner'><img src='"+result[0].award_pict+"' width='100%' /></div>";	
				$(_pageId + "#scroller_aword").html(html); 
		    }else{
		    	   html +=" <div class='arena_banner'><img src='images/matchImages/arena_banner.jpg' width='100%' /></div>";	
					$(_pageId + "#scroller_aword").html(html);
			}
			$(_pageId+"#scroller_aword").show();//奖品图隐藏
			isbanner=true;
	}
	
   
	/** ****************************************************************** */
	
	/**
	 * 销毁
	 */
	function destroy() {
		
		 $(_pageId+"#join_match").html("报名");//组合id
		 $(_pageId+"#join_match").attr("name","0");
		 $(_pageId+"#join_match").attr("style", "background:#f48c56");
		//隐藏菜单以及遮罩层
			pageCommon.hideHeaderMenuFunc(_pageId);
	}

	
	var registration = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = registration;
});