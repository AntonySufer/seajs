/**
 * 我的赛场列表
 * @author 余一一
 * @date 2016-03-21
 */
define("ytgMatch/scripts/simulatedStocks/myMatch", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	layerUtils = require("layerUtils"), 
	gconfig = require("gconfig"),
	validatorUtil = require("validatorUtil"),
	ytgMatchService = require("ytgMatchService"),//服务
	pageCode = "simulatedStocks/myMatch", 
	_pageId = "#simulatedStocks_myMatch  ";
	
	//页面公共JS
	var pageCommon = require("pageCommon");
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null,"_init":false}; //上下滑动
    var hisPage="";
	var user_id ="";//用户id
	var search_type = 1;//1：进行中 2.已结束
	var isFirstShow =true;//判断是否第一次进入
	var account_id="";//大赛组合
	var isLastDay = "";//判断是否是比赛的最后一天 0 不是  1 是
	var obj = {}; //记录持仓股票与对应可买数量
	var curPage =1;//交易动态第一页
	var hasDrawChart=false;
	var count=0;
	//插件
	var drowCharts = require("drowCharts");
	/**
	 * 初始化
	 */
	function init() {
		hisPage = appUtils.getSStorageInfo("hisPageCode");//前置页面
		user_id = appUtils.getSStorageInfo("userId",true);//用户id
		if (isFirstShow) {
			 destoryFunc();
			 queryMyMatchAll();//查询我的大赛详情
			 isFirstShow=false; 
		}
	    
	    
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent(){
		//头部菜单绑定事件
		//pageCommon.headerMenuFunc(_pageId,pageCode);
		//返回
		appUtils.bindEvent($(_pageId + ".back_btn"), function(){
			isFirstShow=true;
			destoryFunc();//销毁
			if (hisPage) {
				appUtils.pageInit(pageCode,hisPage);
			}else{
				appUtils.pageBack();
			}	
		});	
		
		//买入卖出查询撤单
		appUtils.bindEvent($(_pageId + "#stock_type .row-1"), function(){
			//判断是否是微博进入的炒股大赛
			var login_uid = appUtils.getSStorageInfo("login_uid",true);//大赛id
			if (!login_uid) {
				
            var index =$(this).attr("name");//获取当前点击的name；
            var prepageCode="simulatedStocks/myPortfolio/buyStock";//买入
            if (index==2) {
            	prepageCode="simulatedStocks/myPortfolio/sellStock";//卖出
			} if (index==3) {
				prepageCode="simulatedStocks/myPortfolio/cancelEntrust";//撤单
			} if (index==4) {
				prepageCode="simulatedStocks/myPortfolio/queryEntrust/queryEntrustIndex";
			}
			appUtils.clearLStorage("account_id");
			appUtils.setSStorageInfo("account_id",account_id);//保存组合id
			appUtils.clearLStorage("isLastDay");
			appUtils.setSStorageInfo("isLastDay",isLastDay);//保存组合id
			
			appUtils.clearLStorage("parentPageCode");
			appUtils.setSStorageInfo("parentPageCode",pageCode);//保存当前pagecode，返回使用到
			appUtils.pageInit(pageCode,prepageCode,["account_id",account_id]);
			}else{
				layerUtils.iConfirm("请在微证券客户端内操作，点击立即下载", function(){
					appUtils.sendDirect("http://www.wzqapp.com/home/download.html", true,pageCode );
				}, function(){
					$(this).close();
				});
			}
		});	
		

		//持仓Tab
		appUtils.bindEvent($(_pageId+"#row1"),function(e){
			$(_pageId+"#row2").children('a').removeClass("act");
			$(_pageId+"#row3").children('a').removeClass("act");
			$(this).children('a').addClass("act");
			$(_pageId+".tab_con").hide();
			$(_pageId+"#postion").show();
			
		});
		//交易动态Tab
		appUtils.bindEvent($(_pageId+"#row2"),function(e){
			$(_pageId+"#row1").children('a').removeClass("act");
			$(_pageId+"#row3").children('a').removeClass("act");
			$(this).children('a').addClass("act");
			$(_pageId+".tab_con").hide();
			$(_pageId+"#dymanic").show();
			
			if(curPage != 1){
				curPage = 1;
				//查询交易动态
				queryProtfolioTrade();
			}
		});
		//收益走势Tab
		appUtils.bindEvent($(_pageId+"#row3"),function(e){
			$(_pageId+"#row1").children('a').removeClass("act");
			$(_pageId+"#row2").children('a').removeClass("act");
			$(this).children('a').addClass("act");
			$(_pageId+".tab_con").hide();
			$(_pageId+"#chartsRaking").show();
			
			if(hasDrawChart == false){
				//画图(收益曲线图)(不要放在初始化里面)
				introductionTabFunc();
			}
		});
		
		//交易动态 加载更多
		appUtils.preBindEvent($(_pageId+"#TradeList"),".load_add",function(e){
			//alert("更多");
			curPage++;
			queryProtfolioTrade("append");
		});
		
		//我的战绩
		appUtils.bindEvent($(_pageId+"#myMatchList"),function(e){
			var value =$(this).attr("name");
			 if (value=="0") {
				  $(_pageId+"#insertRanking").hide(); //暂无参数显示	 
				  $(_pageId+"#myMatchList").attr("name",1);
			}if(value=="1"){
				 
				  $(_pageId+"#insertRanking").show(); //暂无参数显示	
				  $(_pageId+"#myMatchList").attr("name",0);
			}
		
		});
		
		//我的奖励
		appUtils.bindEvent($(_pageId+"#myAward"),function(e){
			
			var value =$(this).attr("name");
			 if (value=="0") {
				  $(_pageId+"#insertAward").hide(); //暂无参数显示	 
				  $(_pageId+"#myAward").attr("name",1);
			}if(value=="1"){
				  $(_pageId+"#insertAward").show(); 
				  $(_pageId+"#myAward").attr("name",0);
			}
		
		});
		
		//进入大赛详情 --我的战绩
		appUtils.preBindEvent($(_pageId + "#insertRanking"),"tr", function(){
			var index =$(this).index();
			if (index != 0) {
				var match_state = $(this).attr("name");	
				var act_id = $(this).attr("id");
				var followCode = "dynamic/contest/registration";
				if(match_state == "1"){	//进行中
					 followCode = "dynamic/contest/ing";
				}else if(match_state == "2"){//已结束
					followCode = "dynamic/contest/end";
				}
				try {
					  appUtils.clearSStorage("act_id");
					  appUtils.setSStorageInfo("act_id",act_id);
			    } catch (e) {
			    	layerUtils.iAlert("你的浏览器不支持sessionStorage",-1);
				  }
				appUtils.pageInit(pageCode,followCode, {"frontPage": pageCode});
			}

		},"click");
		
		
	}
	
	/** *************************【函数方法】***************************** */
	/***
	 * 
	 * 当前用户大赛信息
	 */
	function queryMyMatchAll(){
		
		var param={
				"user_id" : user_id,
		};
		//401823
		ytgMatchService.queryMyMatchAllInfo(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
					var matchInfoList = resultVo.matchInfo;//当前比赛信息
					var matchList = resultVo.myMatch;//历史战绩
					var awardLists = resultVo.myGift;//获奖信息
				 if (matchInfoList!=null && matchInfoList.length>0) {
					 account_id =matchInfoList[0].account_id;//关与进行中的大赛组合
					  isLastDay = matchInfoList[0].islastDay;//判断是否是比赛的最后一天 0 不是  1 是
					 loadIngMatch(matchInfoList);
					 getPosition();//组合持仓
					 queryProtfolioTrade();//查询组合动态
				 }
				 //参加的比赛排名 --ceshi
			
				 if (matchList!=null && matchList.length>0) {
					 
					 $(_pageId+"#insertRanking").hide(); //战绩隐藏
					 $(_pageId+"#myMatchList").attr("name",1);
					 $(_pageId+"#matchnone").hide(); //暂无参数显示
					 insertMatchRanking(matchList);
				  }else{
					  $(_pageId+"#insertRanking").hide(); //战绩隐藏
					  $(_pageId+"#myMatchList").attr("name",2);
					  $(_pageId+"#matchnone").show(); //暂无参数显示
					  
				  }
	
				 if (awardLists!=null && awardLists.length>0) {
					 $(_pageId+"#insertAward").hide(); //
					  $(_pageId+"#myAward").attr("name",1);
					  $(_pageId+"#award_none").hide(); //暂无参数显示
					insertAwardLsit(awardLists);//加载奖品
				 }else{
					  $(_pageId+"#insertAward").hide(); //战绩隐藏
					  $(_pageId+"#myAward").attr("name",2);
					  $(_pageId+"#award_none").show(); //暂无参数显示
				 }
			}
		},null);
	}
	
	
	/***
	 * 填充当前大赛的信息数据
	 */
    function loadIngMatch(resultList){
	   var item =resultList[0];
	   var total_assets = (item.total_assets*1).toFixed(2); //总资产
	   var userable_balance=(item.userable_balance*1).toFixed(2);
	   var total_market=(item.total_market*1).toFixed(2);
	   var total_yield = (Number(item.total_yield)*100).toFixed(2); //总收益
		var day_yield = (Number(item.day_yield)*100).toFixed(2); //日收益
		var week_yield = (Number(item.week_yield)*100).toFixed(2); //7日收益
		
		$(_pageId + "#join_nowName").html(item.act_name);//大赛名称
		$(_pageId + "#all_yeled").html(total_yield?total_yield+"<span>%</span>":"--");//总收益
		$(_pageId + "#week_yeled").html(week_yield?week_yield+"%":"--");//周收益
		$(_pageId + "#this_weekRanking").html(item.week_yield_rankings?item.week_yield_rankings:"--");//周排名
		$(_pageId + "#all_money").html(total_assets?total_assets:"--");//总资产
		$(_pageId + "#guzhi_money").html(total_market?total_market:"--");//总市值
		$(_pageId + "#user_money").html(userable_balance?userable_balance:"--");//可用资金
  
    }
    
    /***
     * 参加的赛事排名
     */
    function insertMatchRanking(rankList){
    	 $(_pageId + "#match_ranklist").siblings().remove();
    	 var insertHtml="";
       rankList.forEach(function(item){
    	  
    	   var total_yield = (Number(item.total_yield)*100).toFixed(2); //总收益
    	   var yeledHtml="";
    	   if (total_yield <0) {
    		   yeledHtml = "<p class='agreen'>"+total_yield+"%</p>";
		   }else{
			   yeledHtml = "<p class='ared'>"+total_yield+"%</p>";
		   }
    	   var total_yield_rankings = (item.total_yield_rankings*1);//排名
    	   insertHtml+= "<tr id='"+item.act_id+"'  name='"+item.match_state+"'><td><p>"+item.act_name+"</p></td>"
					 +  "<td>"+yeledHtml+"</td>"
					 +  "<td><p>"+total_yield_rankings+"</p></td></tr>";   
       });
       $(_pageId + "#match_ranklist").after(insertHtml);
    }
    
    
    /**
     * 奖品列表
     */
    function insertAwardLsit(awardList){
    	  $(_pageId + "#awardList").siblings().remove();
    	 var insertHtml="";
    	 awardList.forEach(function(item){
      	   insertHtml += "<tr><td><p>"+item.act_name+"</p></td>"
					  +  "<td><p>"+item.award_name+"</p></td></tr>";  
         });
         $(_pageId + "#awardList").after(insertHtml);
    }
    /**
	 * 查询组合持仓
	 * */
	function getPosition(){
		var param = {
				"account_id" : account_id,
				"curPage" : 1,
				"numPerPage" : 200
		};
		ytgMatchService.queryProtfolioHoldStock(param,function callBack(resultVo){
			if(Number(resultVo.error_no) == 0){
				var resultList = resultVo.results;
				if (resultList !=null && resultList.length>0) {
					var result = resultList[0].data;
					//将持仓的股票代码记录下来
					if(result != null && result != ""){
						for(var i = 0;i<result.length;i++){
							obj[result[i].stock_code] = result[i].usable_qty;
						}
						fillPositionData(result); //将组合数据填充到页面
					}else{
						$(_pageId + "#HoldStockList").siblings().remove();
						var noDataHtml = '<tr><td colspan="4" style="height:10px; border-bottom:1px dashed #BBBBBB; font-size:0.12rem; color:#9999B1; text-align:center;">暂无持仓</td></tr>';
						$(_pageId + "#HoldStockList").after(noDataHtml);
						positionHeight = 87;
					}				
				}	
			//	initVIScroll();
			}
			else if(resultVo.error_no == '-40835102'){
				$(_pageId + "#HoldStockList").siblings().remove();
				var noDataHtml = '<tr><td colspan="4" style="height:10px; border-bottom:1px dashed #BBBBBB; font-size:0.12rem; color:#9999B1; text-align:center;">暂无持仓</td></tr>';
				$(_pageId + "#HoldStockList").after(noDataHtml);
				positionHeight = 87;
				//initVIScroll();
			}
			else{
				layerUtils.iAlert("查询组合持仓失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	//将组合持仓填充到页面
	function fillPositionData(result)
	{
		$(_pageId + "#HoldStockList").siblings().remove();
		var html = "";
		for(var i = 0;i<result.length;i++)
		{
			html += '<tr id="'+result[i].stock_code+'">';
			html += '<td><h4>'+result[i].stock_name+'</h4><span>'+result[i].stock_code+'</span></td>';
			if(result[i].profit_rate >= 0)
				html += '<td><p class="ared">'+(result[i].profit_rate*1).toFixed(2)+'%</p><p class="ared">'+(result[i].profit*1).toFixed(2)+'</p></td>';
			else
				html += '<td><p class="agreen">'+(result[i].profit_rate*1).toFixed(2)+'%</p><p class="agreen">'+(result[i].profit*1).toFixed(2)+'</p></td>';
			html += '<td><p>'+result[i].total_qty+'</p><p>'+result[i].usable_qty+'</p></td>';
			html += '<td><p>'+Number(result[i].cost_price).toFixed(2)+'</p><p>'+Number(result[i].now_price).toFixed(2)+'</p></td>';
			html += '</tr>';
		}
		$(_pageId + "#HoldStockList").after(html);
		positionHeight = $(_pageId + "#positionBox").height();
	}
	
	//查询 交易动态
	function queryProtfolioTrade(insertType){
		var type;
		if(count>1){
			type=false;
		}else{
			type=false;
		}
		insertType =  typeof insertType == "undefined" || insertType == "" || insertType == null ? "html":insertType;
		var param={

				"curPage" : curPage,
				"numPerPage" : 1,
				"account_id":account_id
		};
		ytgMatchService.queryProtfolioTrade(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				var result = resultVo.results[0].data;
				if (result !=null && result.length>0) {
					totalPage = resultVo.results[0].totalPages;
					totalRows = resultVo.results[0].totalRows;
					num = result.length;
					fillProtfolioHoldTrade(result,insertType);
				} else {
					$(_pageId + ".det2_con").css("border","0");
					$(_pageId + "#TradeList").html("");
					var noDataHtml = '<div  style="text-align:center;color:#9999B1;">暂无交易动态</div>';
					$(_pageId + "#TradeList").html(noDataHtml);
				}
				
			}
			else if(resultVo.error_no=='-40835602'){
				$(_pageId + ".det2_con").css("border","0");
				$(_pageId + "#TradeList").html("");
				
				var noDataHtml = '<div  style="text-align:center;color:#9999B1;">暂无交易动态</div>';
				$(_pageId + "#TradeList").html(noDataHtml);
			}
			else{
				layerUtils.iAlert("交易动态详情加载失败:"+resultVo.error_info,-1);
			}
		},{isShowWait:type});
	}

	//填充交易动态数据
	function fillProtfolioHoldTrade(result,insertType){
		$(_pageId + "#TradeList .load_add").remove();
		$(_pageId + "#TradeList").after("");
		if(insertType != 'append'){
			$(_pageId + "#TradeList").html("");
		}
		var html = "";
		for(var i = 0;i<result.length;i++)
		{
			html += '<div class="list_item" id="TradeListnexts" ><table class="ui table" ><h3>'+result[i].exec_date+'-'+result[i].exec_time+' 交易记录</h3>';
			html += '<tr><th>股票名称</th><th>成交价</th><th>操作</th><th>个股仓位</th></tr><tr>';
			html += '<td><h4>'+result[i].stock_name+'</h4><span>'+result[i].stock_code+'</span></td>';
			html += '<td>'+result[i].exec_price+'</td><td>';
			if(result[i].trade_type == 0)
				html +='<a class="ui tag primary primary2">买入</a>';
			else if(result[i].trade_type == 1)
				html += '<a class="ui tag blue">卖出</a>';
			html += '</td><td>'+(result[i].stock_be_position*100).toFixed(2)+'%→'+(result[i].stock_af_position*100).toFixed(2)+'%</td></tr></table></div>';

		}
		$(_pageId + "#TradeList").append(html);
		if(curPage != totalPage){
			$(_pageId + "#TradeList").append('<a href="javascript:void(0);" class="load_add" style="border:1px solid #689EEF;">加载更多动态</a>');
		}
	}
     
	
	/**
	 *画图
	 * */
	function introductionTabFunc()
	{    
		var queryMap ={
				"plan_id" : account_id
		};
		var drowdataCallBack = function(resultVo){
			if(0==Number(resultVo.error_no)){
				var result = resultVo.results;

				var profitList = eval('([' + result[0].profit + '])');
				var exponentList = eval('([' + result[0].exponent + '])');
				//收益曲线数组，保存需要画的曲线
				var seriesOptions = [];
				//尺寸参数
				var style = [374,187];

				// 组合收益曲线
				seriesOptions[0] = {
						'name': '组合收益',
						'data': profitList[0]
				};
				// 大盘收益曲线
				seriesOptions[1] = {
						'name': '上证指数',
						'data': exponentList[0]
				};	
				//画图
				drowCharts.getHighcharts2(seriesOptions,$("#drows"),style);
				//drowCharts.getHighcharts(seriesOptions,'box_line',style);
				hasDrawChart = true;
			}
			else{
				layerUtils.iAlert("曲线图加载失败"+resultVo.error_info,-1);
			}
		};
		ytgMatchService.queryDrowdata(queryMap,drowdataCallBack);
		
		}
	


	
/** ****************************************************************** */
  
	/**
	 * 销毁
	 */
	function destroy() {
		//隐藏菜单以及遮罩层
	//	pageCommon.hideHeaderMenuFunc(_pageId);
		
	}
	
	function destoryFunc(){
		heightTop = 100;
		$(_pageId+" .foo_float_bar").show();
		hasDrawChart = false;  //重置是否画了走势图的标示
		isFirstShow = true;
		$("#drows").html("");
		$(_pageId+".my-zj").show(); //战绩隐藏
		$(_pageId+".none-join").hide(); //暂无参数显示
		$(_pageId+"#myMatchList").attr("name",1);
		$(_pageId+"#myAward").attr("name",1);
		$(_pageId+"#row2").children('a').removeClass("act");
		$(_pageId+"#row3").children('a').removeClass("act");
		$(_pageId+"#row1").children('a').addClass("act");
		$(_pageId+".tab_con").hide();
		$(_pageId+"#postion").show();
		$(_pageId+"#insertRanking").hide(); //战绩隐藏
		$(_pageId+"#matchnone").hide(); //暂无参数显示
		$(_pageId+"#myAward").attr("name",1);
		$(_pageId+"#award_none").hide(); //暂无参数显示
	}


	
	var myMatch = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = myMatch;
});