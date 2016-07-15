/**
 * 组合详情页
 */
define("ytg/scripts/ytgMatch/public/positionIng", function(require, exports, module){
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
		pageCode = "ytgMatch/public/positionIng", 
		_pageId = "#ytgMatch_public_positionIng ";
	//页面公共JS
	var pageCommon = require("pageCommon");
	   
	//service定义
	var ytgMatchService = require("ytgMatchService");//服务
	var userService=require("userService");
	var Common = require("ytgMatchCommon");//公告方法
	//插件
	var drowCharts = require("drowCharts");
	
	//全局变量
	var user_id = "";
	var invest_id ="";//参赛人id
	
	var account_id=null;
	var hasDrawChart=false;
	var heightTop = 100;


	//入参
	//页面公共JS
	var pageCommon = require("pageCommon");
	var curPage = 1;
	var numPerPage = 5;
	var totalPage=1;
	var totalRows = 0;
	var num = 0;
	var count=0;
	var isFirstShow=true;
	var gconfig = require("gconfig");
	var daname ="";//大赛名称
	var this_rankings ="";//排名
	
    var domain = gconfig.global.domain;
	/**
	 * 初始化
	 */
	function init() {
		user_id = appUtils.getSStorageInfo("userId",true);//用户
		daname = appUtils.getSStorageInfo("match_name");//大赛名称
		this_rankings = appUtils.getSStorageInfo("rankings");//当前排名
		//页面传参:组合ID 防止登陆回来没有入参
		account_id = appUtils.getSStorageInfo("account_id"); 	
		 invest_id = appUtils.getSStorageInfo("invest_id");
		if (!user_id) {
			user_id = appUtils.getPageParam("userId");//用户
		}if (!daname) {
			daname = appUtils.getPageParam("match_name");//用户
		}if (!this_rankings) {
			this_rankings = appUtils.getPageParam("rankings");//用户
		}if (!account_id) {
			account_id = appUtils.getPageParam("account_id");//用户
		}if (!invest_id) {
			invest_id = appUtils.getPageParam("invest_id");//用户
		}

		if (daname) {
			$(_pageId+"#contest_info").show();
			$(_pageId+"#match_name").html(daname);
			$(_pageId+"#ranking").html(this_rankings?this_rankings:"暂无排名");
			
		} else {
			$(_pageId+".contest_info").hide();
		}
		
		
		
		//判断用户是否关注了该组合
		if(user_id != null && user_id != ""){
			userIsSubPort();//查询是否关注此人
		}
			destoryFunc();
			//查询组合详情
			queryPortfolioDetails();
			//查询 保守，稳健等信息
			queryPortfolioSumCb();
			//查询持仓信息
			queryProtfolioHoldStock();
			//查询交易动态
			queryProtfolioTrade();
			$(_pageId+"#row2").children('a').removeClass("act");
			$(_pageId+"#row3").children('a').removeClass("act");
			$(_pageId+".tab_con").hide();
			$(_pageId+"#postion").show();
			$(_pageId+"#row1").children('a').addClass("act");
			isFirstShow = false;
			  var paraMaps = {};
				paraMaps["account_id"] = account_id;
				paraMaps["invest_id"] = invest_id;
				paraMaps["this_rankings"] = this_rankings;
				paraMaps["userId"] = user_id;
				paraMaps["daname"] = daname;
			 Common.loadShare(_pageId,pageCode,"华林炒股大赛","组合详情页",paraMaps);//原生分享
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent(){
		//头部菜单绑定事件
		pageCommon.headerMenuFunc(_pageId,pageCode);
		
		//头部返回
		appUtils.bindEvent(_pageId+".back_btn", function(e) {
			appUtils.pageInit(pageCode,"ytgMatch/public/rankingList",{"match_name":daname});
		});
		
		//查看投顾详情
		appUtils.preBindEvent($(_pageId +".com_det_box1"),".ring",function(){
			appUtils.setSStorageInfo("invest_PageCode",pageCode);
			isFirstShow=true;
			appUtils.clearSStorage("counts");
			appUtils.setSStorageInfo("counts",count);
			var invest_id = $(this).parent().attr("id");
			var user_type = $(this).parent().attr("type");
			if(user_type == 1){
				appUtils.pageInit(pageCode,"adviser/adviserDetail", {'invest_id':invest_id});
			}
		},"click");
		
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
		
		/** 底部栏 */
		//关注组合
		appUtils.bindEvent($(_pageId+"#attention"),function(e){
			//被关注人id
			if(!user_id){
				appUtils.setSStorageInfo("hisPageCode",pageCode);	
				appUtils.pageInit(pageCode,"account/login");
				}
				else {
					cancelOrAttInvest();//取消or关注
				} 
				
		},"click");
        
		
		//交易动态 加载更多
		appUtils.preBindEvent($(_pageId+"#TradeList"),".load_add",function(e){
			//alert("更多");
			curPage++;
			queryProtfolioTrade("append");
		});

	}
	
	//***************************【函数方法】***********************************//
	
	
	/**
	 * 判断用户是否关注了该组合
	 * */
	function userIsSubPort(){
		var param={
				"invest_id":invest_id,
				"user_id" : user_id
		};
		ytgMatchService.userIsSubPortfolio(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				//已关注
				
				$(_pageId + "#attention a").html("<i class='gz_btn'></i>取关");
			}
			else if(resultVo.error_no == '-40812203'){
				//未关注
				$(_pageId + "#attention a").html("<i class='gz_btn'></i>关注");
			}
			else{
				layerUtils.iAlert("判断用户是否关注了该组合失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	
	//查询组合详情
	function queryPortfolioDetails(){
		var param={
				"account_id":account_id    
		};
		ytgMatchService.queryPortfolioDetails(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				var result = resultVo.results;
				fillHotPortfolioDetailsData(result);
			}else{
				layerUtils.iAlert("组合详情加载失败:"+resultVo.error_info,-1);
			}
		});
	}


	/**
	 * 初始化绑定查询后的组合详情
	 */
	function fillHotPortfolioDetailsData(results){    
		var result = results[0];
		var total_assets = (result.total_assets*1).toFixed(2); //总资产
	//	var total_earnings = (result.total_earnings*1).toFixed(2); //总收益
		var total_yield = (Number(result.total_yield)*100).toFixed(2); //总收益
		var day_yield = (Number(result.day_yield)*100).toFixed(2); //日收益
		var month_yield = (Number(result.month_yield)*100).toFixed(2); //月收益
		var week_yield = (Number(result.total_yield)*100).toFixed(2); //7日收益
		var threeteen_yield = (Number(result.retrace_rate_thirty)*100).toFixed(2); //30日最大回撤
		var introdution = result.introdution; //简介
		var small_img =result.face_image_small?result.face_image_small:"images/my_tx.png";
		    $(_pageId + "#guanzu_num").html(result.view_counts);//关注view_counts
		    $(_pageId + "#finduname").html(result.finduname);//
			$(_pageId + "#all_yeled").html(total_yield+"<span>%</span");//总收益
			$(_pageId + "#day_yeled").html(day_yield+'%');
			$(_pageId + "#week_yeled").html(week_yield+'%');
			$(_pageId + "#month_yeled").html(month_yield);
			$(_pageId + "#threeteen_yeled").html(threeteen_yield);
			
			$(_pageId + "#init_money").html(result.init_balance);//初始资金
			$(_pageId + "#all_money").html(total_assets);//总资产
			$(_pageId + "#create_date").html(result.create_date.substring(0,10));
			$(_pageId + "#introdition").html(introdution);
			$(_pageId + "#name").html(result.name);
			$(_pageId + "#small_img").attr("src",small_img);//头像
			
			
			
	}


	//查询 持仓(默认每页100条)
	function queryProtfolioHoldStock(){
		var param={
				"curPage" : 1,
				"numPerPage" : 100,
				"account_id":account_id     //118
		};
		ytgMatchService.queryProtfolioHoldStock(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				var result = resultVo.results[0].data;
				fillProtfolioHoldStockData(result);
			}else if(resultVo.error_no=='-40835102'){
				//无持仓数据
				$(_pageId + "#HoldStockList").siblings().remove();
				var noDataHtml = '<tr><td colspan="4" style="height:10px; border-bottom:1px dashed #BBBBBB; font-size:0.12rem; color:#9999B1; text-align:center;">暂无持仓</td></tr>';
				$(_pageId + "#HoldStockList").after(noDataHtml);
			}
			else{
				layerUtils.iAlert("持仓详情加载失败:"+resultVo.error_info,-1);
			}
		});
	}
	//持仓填充数据
	function fillProtfolioHoldStockData(result){ 
		$(_pageId + ".HoldStockList").siblings().remove();
		var html = "";
		for(var i = 0;i<result.length;i++)
		{
			html +='<tr><td><h4>'+result[i].stock_name+'</h4><p>'+result[i].stock_code+'</p></td>';
			html +='<td><p class="'+(result[i].profit_rate >=0 ? "ared" : "agreen")+'">'+Number(result[i].profit_rate).toFixed(2)+'%</p><p class="'+(result[i].profit>=0 ? "ared" : "agreen")+'">'+(result[i].profit*1).toFixed(2)+'</p></td><td>';
			html +='<p>'+result[i].total_qty+'</p><p>'+result[i].position+'%</p></td><td>';
			html +='<p>'+Number(result[i].cost_price).toFixed(2)+'</p><p class="'+(result[i].uppercent>= 0 ? "ared" : "agreen")+'">'+Number(result[i].now_price).toFixed(2)+'</p></td></tr>';
	       
		}

		$(_pageId + "#HoldStockList").after(html);

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
				"numPerPage" : 4,
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
					$(_pageId + "#trade_remove").removeClass("det2_con");
					$(_pageId + "#TradeList").html("");
					var noDataHtml = '<div  style="text-align:center;color:#9999B1;">暂无交易动态</div>';
					$(_pageId + "#TradeList").html(noDataHtml);
				}
				
			}
			else if(resultVo.error_no=='-40835602'){
				$(_pageId + "#trade_remove").removeClass("det2_con");
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
				html +='<a class="ui tag primary primary2">加仓</a>';
			else if(result[i].trade_type == 1)
				html += '<a class="ui tag blue">减仓</a>';
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
	
	
	/**
	 * 取消or关注投顾
	 * index 点击的索引
	 * invest_id 被关注的人
	 * */
	function cancelOrAttInvest(){
		var cancelOrAttCallBack=function(resultVo){			
			if(0==Number(resultVo.error_no)){
			var counts=0;
				counts =$(_pageId+"#guanzu_num").html();
				var attention_text = $(_pageId+"#attention a").html();
				if(attention_text.indexOf("关注")!=-1){
					//取消		
					$(_pageId+"#attention a").html("<i class='gz_btn'></i>取关");
					 counts++;
					$(_pageId +"#guanzu_num").attr("name",counts);
					$(_pageId +"#guanzu_num").html(counts);
					
				}
				else{
					//关注
					$(_pageId+"#attention a").html("<i class='gz_btn'></i>关注");
					counts--;
					$(_pageId +"#guanzu_num").attr("name",counts);
					$(_pageId +"#guanzu_num").html(counts);
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
	
	
	//查询 模拟炒股帐号数据统计 (稳健 保守等)
	function queryPortfolioSumCb(){
		
		var param={
				"account_id":account_id
		      };
		ytgMatchService.queryPortfolioSumByAccountId(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				var result = resultVo.results;
				if(result != null && result.length>0){
					var data=result[0];
				 $(_pageId+ "#chaogu_type").html(data.risk_rank);//操作类型
				}
				
			}
			else{
				layerUtils.iAlert("交易动态详情加载失败:"+resultVo.error_info,-1);
			}
		});
	}
	    
	//*********************************************************************//
	
	/**
	 * 销毁
	 */
	function destroy() {
		//隐藏菜单以及遮罩层
		pageCommon.hideHeaderMenuFunc(_pageId);
		isFirstShow = true;
	}
	
	function destoryFunc(){
		heightTop = 100;
		$(_pageId+" .foo_float_bar").show();
		hasDrawChart = false;  //重置是否画了走势图的标示
		isFirstShow = true;
		$("#drows").html("");

	}

	var portfolio_portfolioDetail = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = portfolio_portfolioDetail;
});