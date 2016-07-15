/**
 *  比赛排行榜
 * @author 余一一
 * @date 2016-03-15
 */
define("ytg/scripts/ytgMatch/public/rankingList", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
		pageCode = "ytgMatch/public/rankingList", 
		ytgMatchService = require("ytgMatchService"),//服务
	     userService = require("userService");
		_pageId = "#ytgMatch_public_rankingList ";
	
	//插件
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null,"_init":false}; //上下滑动
	//页面公共JS
	var pageCommon = require("pageCommon");
	var numPerPage= 10;//行
	var all_curPage =1;//每次数据后的当前页
	var day_curPage= 1;//页
	var week_curPage= 1;//页
	var month_curPage= 1;//页
	var user_id = "";//用户id
	var act_id = ""//大赛id
	var rank_type = 2;//排行类型，//0，周收益；1，月收益；2日收益；3总收益
	var activity_type ="";//大赛属性
	var match_status ="";//大赛状态
	var num =0;
	var daname="";//大赛name
	//全局变量
	var domain = gconfig.global.domain;
	var isFirstShow = true;//判断是不是第一次进入
	/**
	 * 初始化
	 */
	function init() {
		user_id = appUtils.getSStorageInfo("userId",true);//用户id
		if (!user_id) {
			 $(_pageId+"#user_showRanking").hide();//隐藏他的排名
		}
		act_id = appUtils.getSStorageInfo("act_id");//用户id
		activity_type = appUtils.getPageParam("activity_type");//大赛类型
		match_status = appUtils.getSStorageInfo("match_status");//大赛类型
		daname = appUtils.getPageParam("match_name");//大赛name
		
		if (isFirstShow) {
			loadTournamentRanking(day_curPage,"#ranking_insertDay",rank_type);//查询大赛的排行	
			destoryScoll();//初始化
			isFirstShow= false;
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
			isFirstShow= true;
			if (match_status=="1") {
				 appUtils.pageInit(pageCode,"ytgMatch/dynamic/contest/ing",{});	
			} if(match_status=="2") {
				 appUtils.pageInit(pageCode,"ytgMatch/dynamic/contest/end",{});	
			}
		});
		
		
		//日收益、周收益、月收益
		appUtils.bindEvent($(_pageId + "#button_day"), function(e){
			 $(this).siblings("div").children("a").removeClass("act");
			 $(this).children("a").addClass("act");
			 $(_pageId + ".ranking_menus").hide();//隐藏所有数据
			 rank_type =2;
			 if (day_curPage ==1) {
				 loadTournamentRanking(day_curPage,"#ranking_insertDay",2);
			} 
			 $(_pageId + "#ranking_insertDay").show();//显示当前
		});
		appUtils.bindEvent($(_pageId + "#button_week"), function(e){
			 $(this).siblings("div").children("a").removeClass("act");
			 $(this).children("a").addClass("act");
			 $(_pageId + ".ranking_menus").hide();//隐藏所有数据
			 rank_type =0;
			 if (week_curPage ==1) {
				 loadTournamentRanking(week_curPage,"#ranking_insertWeek",0);
			} 
			 $(_pageId + "#ranking_insertWeek").show();
		});
		appUtils.bindEvent($(_pageId + "#button_month"), function(e){
			 $(this).siblings("div").children("a").removeClass("act");
			 $(this).children("a").addClass("act");
			 $(_pageId + ".ranking_menus").hide();//隐藏所有数据
			 rank_type =3;
			 if (month_curPage ==1) {
				 loadTournamentRanking(month_curPage,"#ranking_insertMonth",3);
			} 
			 $(_pageId + "#ranking_insertMonth").show();
		});
		
		//点击关注
		appUtils.preBindEvent($(_pageId + "#ranking_listss"),".att_btn", function(e){
			//被关注人id
			
			var invest_id = $(this).parent(".li_rt").parent("li.ui ").attr("name");
			var html_id =$(this).attr("id");//当前点击的关注按钮id
			var index_id =$(this).attr("name");//获取索引
			if(!user_id){
				appUtils.setSStorageInfo("hisPageCode","pageCode");	
				appUtils.pageInit(pageCode,"account/login");
				}
				else {
					cancelOrAttInvest(html_id,index_id,invest_id);//取消or关注
				}
				e.stopPropagation(); 
				
			},"click"); 
		
		//点击排行人员，查看人员信息
		appUtils.preBindEvent($(_pageId + " #ranking_listss")," ul li", function(){
			var account_id = $(this).attr("id");//获取组合id
			//跳转到此参赛人详情
			  //组合详情
			  //参赛人id
			 var invest_ids = $(this).attr("name");
			 //排名
			 var rankings = $(this).data("yeled");
			 
			 //清除session
			 appUtils.clearSStorage("match_name");
			 appUtils.clearSStorage("account_id");
			 appUtils.clearSStorage("invest_id");
			 appUtils.clearSStorage("rankings");
			 //保存信息
			 appUtils.setSStorageInfo("match_name",daname);
			 appUtils.setSStorageInfo("account_id",account_id);
			 appUtils.setSStorageInfo("invest_id",invest_ids);
			 appUtils.setSStorageInfo("rankings",rankings);
			 
			if (match_status=="1") {
				 appUtils.pageInit(pageCode,"ytgMatch/public/positionIng",{"match_name":daname,"account_id":account_id,"invest_id":invest_ids,"rankings":rankings});	
			} if(match_status=="2") {
				 appUtils.pageInit(pageCode,"ytgMatch/public/positionEnd",{"match_name":daname,"account_id":account_id,"rankings":rankings});	
			}
			
		},"click");
		
		
	}
	
	//***************************【函数方法】***********************************//
	
	/**
	 * obj：当前点击的对象
	 * insert_htmlId 填充div
	 * type：0，周收益；1，月收益；2日收益；3总收益
	 * 查询大赛排行
	 */
	function loadTournamentRanking(curPage,insert_htmlId,type, loadType){
		var paraMap = {
				"curPage" : curPage,
				"act_id": act_id,
				"type" : type,	
				"user_id":user_id,
				"numPerPage" : numPerPage
		};	//列表排行
		
		ytgMatchService.queryMatchRanking(paraMap,function(resultVo){
			if(0==Number(resultVo.error_no)){
				var result =resultVo.results[0].data;
				insertRankingHtml(insert_htmlId,type,result);//填充html
			}else if(resultVo.error_no == '-40180702'){
				$(_pageId + insert_htmlId).html("");
				var noDataHtml = '<li style="height:0.5rem; font-size:16px; color:#9999B1; background-color:#FFFFFF; background:none; text-align:center;">暂无排行数据!</li>';
				$(_pageId + insert_htmlId).html(noDataHtml);
				$(_pageId + insert_htmlId).css("height","1rem");
				initVIScroll(insert_htmlId,0);
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
	function insertRankingHtml(htmlId,select_type,result,loadType){
		if(result){
			var insertHtml ="";
			if(loadType != "append"){
				$(_pageId + htmlId).html(insertHtml);
			}
			var i=1;//常量
			result.forEach(function(item){
				
				
				var type_yeled = "";//收益html
				var viewHtml = "+关注"; //是否关注
				if(select_type == 2) {
					//日收益
				 	type_yeled = item.day_yield?parseFloat(item.day_yield).toFixed(2):"0";	
				}if(select_type == 0) {
					//周收益
				 	type_yeled = item.week_yield?parseFloat(item.day_yield).toFixed(2):"0";	
				}if(select_type == 3) {
					//总收
				 	type_yeled = item.month_yield?parseFloat(item.day_yield).toFixed(2):"0";	
				}
				
				if (item.sub_status=="1") {
					viewHtml="取关";
				}

			    insertHtml +=" <li  class='ui layout' id="+item.account_id+" name ="+item.user_id+" data-yeled="+item.rank_type+"><div class='li_lt'>"
							+" <div class='round_box'><span>总收益</span>"
							+" <strong>"+type_yeled+"<i>%</i></strong>"
							+" </div></div>"
							+" <div class='row-1 li_info'><div class='label_box'>"
							+" <span class='ui tag'>泸深</span>"+item.finduname+""
							+" <span></span></div>"
							+" <div class='mes_box'>"
							+" <p><span class='user' style='font-size:0.15rem;'>"+item.name+" </span><span id='counts"+i+"' name='"+item.view_counts+"' >"+item.view_counts+"<span>人关注</p>"
							+" </div></div>"
							+" <div class='li_rt'>"
							+" <span class='num_btn'>"+i+"</span></div></li> ";
			         i++;//自增
			    });
			$(_pageId+htmlId).append(insertHtml);
			num = result.length * 1;
			totalPage=result[0].total_page * 1;	//数据的总页数
			all_curPage=result[0].cur_page * 1;	//数据的当前页数
			totalRows = result[0].total_rows * 1;
			initVIScroll(htmlId,num);
			
			
			
			
			
			
			//判断用户是否登陆，
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
								
								param["type"] = 3;
								 queryUserRanking(param);	
				 
							 }else{
								 $(_pageId+"#user_showRanking").hide();//大赛介绍	
							 }
					   
						}); 
			   }
		   }
	}

	/***
	 * 查询用户关于此比赛的收益排行
	 */
	function queryUserRanking(params){
		ytgMatchService.queryUserMatchRanking(params,function(resultVo){
			if(0==Number(resultVo.error_no)){
		    var result = resultVo.results;	
				if (result !=null && result.length>0) {
					var item =result[0];
					if (item.total_yield_rankings) {
						 $(_pageId+"#user_ranking").html(item.total_yield_rankings);//排行	
						 var yeled =item.total_yield?parseFloat(item.day_yield).toFixed(2):"0";
						 $(_pageId+"#user_income").html(yeled+"%");//总收益	
						 $(_pageId+"#user_showRanking").show();//大赛介绍		
					} else {
						 $(_pageId+"#user_showRanking").hide();//大赛介绍	
					}
					
				} else {
					 $(_pageId+"#user_showRanking").hide();//大赛介绍	
				}
			 }else{
				 layerUtils.iAlert("查询用户此排行失败:"+resultVo.error_info,-1); 
			 }
	   
		}); 
	}
	
	
	/**
	 * 取消or关注投顾
	 * index 点击的索引
	 * invest_id 被关注的人
	 * */
	function cancelOrAttInvest(html_ids,index,invest_id){
		var cancelOrAttCallBack=function(resultVo){			
			if(0==Number(resultVo.error_no)){
				var counts =0;
				var attention_text="";
				 attention_text = $(_pageId +"#"+html_ids).html();//获取关注/去关
				 counts = $(_pageId +"#counts"+index).attr("name");
				if(attention_text.indexOf("关注")!=-1){
					//取消
					
					$(_pageId+"#"+html_ids).html("取关");
					counts++;
					$(_pageId +"#counts"+index).attr("name",counts);
					$(_pageId +"#counts"+index).html(counts);
					
				}
				else{
					//关注
					$(_pageId+"#"+html_ids).html("+关注");
					counts--;
					$(_pageId +"#counts"+index).attr("name",counts);
					$(_pageId +"#counts"+index).html(counts);
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
	function initVIScroll(htmlid,num){
		if(!vIscroll._init){
			var config = {
					"isPagingType": false,		//false表示是微博那种累加形式，true表示分页形式
					"visibleHeight": $(window).height()-$(_pageId +" .header").height()-10,//显示内容区域的高度，当isPaingType为false时传
					"container": $(_pageId+" #container_ranking"),
					"wrapper":$(_pageId+" #wrapper_ranking"),	
					"downHandle": function() {				//下拉获取上一页数据方法
						 day_curPage= 1;//页
						 week_curPage= 1;//页
						 month_curPage= 1;//页						//上拉将当前页数设置为1
						//查询数据
						if(rank_type!=null){
							loadTournamentRanking(htmlid,rank_type);
						}	
					},
					"upHandle": function() {				//上拉获取下一页数据方法
						if(all_curPage < totalPage)				//判断当前页数是不是小于总页数
						{
							if (rank_type==2) {
								 day_curPage++;
							} if (rank_type==0){
								 week_curPage++;
							}if (rank_type==3){
								 month_curPage++;
							}
							loadTournamentRanking(htmlid,rank_type, "append");
						}else{
						 $(_pageId+".visc_pullUp").hide();//大赛介绍		
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
	
	//*********************************************************************//
  //销毁
	function destoryScoll(){
		if(vIscroll._init == true){
			vIscroll.scroll.destroy(); //销毁
			vIscroll.scroll = null;
			vIscroll._init = false; 
		}
	    numPerPage= 10;//行
	    all_curPage =1;//每次数据后的当前页
		day_curPage= 1;//页
		week_curPage= 1;//页
		month_curPage= 1;//页s
		num = 0;
		type = "";			//返回类型
	    rank_type = 2;
		$(_pageId+"#ranking_insertMonth").html("");//数据清空
		$(_pageId+"#ranking_insertWeek").html("");//数据清空
		$(_pageId+"#ranking_insertDay").html("");//数据清空	
		$(_pageId + ".ranking_menus").hide();//隐藏所有数据
		$(_pageId+"#ranking_insertDay").show();
		$(_pageId+"#button_day").siblings("div").children("a").removeClass("act");
		$(_pageId+"#button_day").children("a").addClass("act");
		
		
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