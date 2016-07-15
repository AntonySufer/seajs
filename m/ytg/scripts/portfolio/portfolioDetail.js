/**
 * 组合详情页
 */
define("ytg/scripts/portfolio/portfolioDetail", function(require, exports, module){
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
		pageCode = "portfolio/portfolioDetail", 
		_pageId = "#portfolio_portfolioDetail ";
	//页面公共JS
	var pageCommon = require("pageCommon");
	   
	//service定义
	var portfolioService=require("portfolioService");
	//插件
	var drowCharts = require("ytg/scripts/common/drowcharts");
	
	//全局变量
	var user_id = "";
	var user_type = ""; 
	var portfolio_id=null;
	var hasDrawChart=false;
	var heightTop = 100;


	//入参
	var curPage = 1;
	var numPerPage = 5;
	var totalPage=1;
	var totalRows = 0;
	var num = 0;
	var count=0;
	var isFirstShow=true;
	var gconfig = require("gconfig");
    var domain = gconfig.global.domain;
	/**
	 * 初始化
	 */
	function init() {
		
		counts=appUtils.getSStorageInfo("counts");
		if(counts>1){
			count=counts;
		}else{
			count=0;
		}
		user_id=appUtils.getSStorageInfo("userId",true);
		user_type=appUtils.getSStorageInfo("userType",true);
		
		//设置高度
		var height = $(window).height() - $(_pageId +" .header").height();
		$(_pageId+" #bodyPage").css("height",height);
		
		//设置前页面不为登录页
		if(appUtils.getSStorageInfo("_prePageCode") != "account/login"){
			var prePageCode = appUtils.getSStorageInfo("_prePageCode");
			appUtils.clearSStorage("ytg_prePageCode");
			appUtils.setSStorageInfo("ytg_prePageCode",prePageCode);
		}
		if(appUtils.getPageParam("portfolio_id")){
			portfolio_id = appUtils.getPageParam("portfolio_id"); 
		}
		if(portfolio_id==null&&""==portfolio_id){
			portfolio_id = appUtils.getPageParam("portfolio_id"); 
		}
		//页面传参:组合ID
		//判断用户是否关注了该组合
		if(user_id != null || user_id != "" || user_type == 0){
			userIsSubPort();
		}
		if(isFirstShow){
			destoryFunc();
			//查询组合详情
			queryPortfolioDetails();
			//查询持仓信息
			queryProtfolioHoldStock();
			//查询交易动态
			queryProtfolioTrade();
			$(_pageId+"#row2").children('a').removeClass("act");
			$(_pageId+"#row3").children('a').removeClass("act");
			$(_pageId+".tab_con_det1").show();
			$(_pageId+".tab_con_det2").hide();
			$(_pageId+".tab_con_det3").hide();
			$(_pageId+"#row1").children('a').addClass("act");
			isFirstShow = false;
		}
	
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent(){
		
		//头部菜单绑定事件
		appUtils.preBindEvent($(_pageId + ".header"),".menu_iocn", function(e) {
			pageCommon.headerMenuFunc(_pageId,pageCode);
		});
		
		//头部返回
		appUtils.preBindEvent($(_pageId + ".header"),".icon_back", function(e) {
			appUtils.clearSStorage("counts");
			if(appUtils.getSStorageInfo("ytg_prePageCode")=="adviser/adviserDetail"){
				var prePageCode = appUtils.getSStorageInfo("portfolio_PageCode");
				isFirstShow=true;
				appUtils.pageInit(pageCode, prePageCode);
			}else{
				isFirstShow=true;
				appUtils.pageBack();
			}
				
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
			$(_pageId+".tab_con_det1").show();
			$(_pageId+".tab_con_det2").hide();
			$(_pageId+".tab_con_det3").hide();
			$(this).children('a').addClass("act"); 
		});
		//交易动态Tab
		appUtils.bindEvent($(_pageId+"#row2"),function(e){
			$(_pageId+"#row1").children('a').removeClass("act");
			$(_pageId+"#row3").children('a').removeClass("act");
			$(this).children('a').addClass("act"); 
			$(_pageId+".tab_con_det2").show();
			$(_pageId+".tab_con_det1").hide();
			$(_pageId+".tab_con_det3").hide();
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
			$(_pageId+".tab_con_det3").show();
			$(_pageId+".tab_con_det1").hide();
			$(_pageId+".tab_con_det2").hide();
			if(hasDrawChart == false){
				//画图(收益曲线图)(不要放在初始化里面)
				introductionTabFunc();
			}
		});
		//交易动态 加载更多
		appUtils.preBindEvent($(_pageId+"#TradeList"),".load_add",function(e){
			curPage++;
			queryProtfolioTrade("append");
		});
		
		/** 底部栏 */
		//关注组合
		appUtils.preBindEvent($(_pageId+"#headList1"),"#gz",function(e){
//			alert("关注");
			if(user_id == undefined || user_id==null || user_id==""){
				var hisPageParam = {
						"portfolio_id" : portfolio_id
				};
				appUtils.setSStorageInfo("hisPageParam",JSON.stringify(hisPageParam));
				appUtils.setSStorageInfo("hisPageCode",pageCode);
				appUtils.pageInit(pageCode,"account/login");
				return ;
			}
			if(user_type == 1){
				layerUtils.iAlert("投顾不能关注组合！",-1);
				return ;
			}
			var sub_type = "";
			if($(this).hasClass('subed_btn'))
				sub_type = 0;
			else 
				sub_type = 1;
			//关注或者取消关注组合
			subOrCancelPort(user_id,portfolio_id,sub_type,$(this));
		});
		


	}
	
	//***************************【函数方法】***********************************//
	
	/**
	 * 判断用户是否关注了该组合
	 * */
	function userIsSubPort(){
		var param={
				"portfolio_id":portfolio_id,
				"user_id" : user_id
		};
		portfolioService.userIsSubPortfolio(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				//已关注
				$(_pageId + ".sub_btn").addClass("subed_btn");
				$(_pageId + ".sub_btn").html("取关");
			}
			else if(resultVo.error_no == '-40832703'){
				//未关注
				$(_pageId + ".sub_btn").removeClass("subed_btn");
				$(_pageId + ".sub_btn").html("+关注");
			}else if(resultVo.error_no =='-40832702'){
		
			}
			else{
				layerUtils.iAlert("判断用户是否关注了该组合失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	/**
	 * 关注或者取消关注 组合
	 * */
	function subOrCancelPort(user_id,portfolio_id,sub_type,elem){
		var param={
				"portfolio_id" : portfolio_id,
				"user_id" : user_id,
				"sub_type":sub_type
		};
		portfolioService.attentionAndCancelPortfolio(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				if(sub_type == 1){
					layerUtils.iMsg(0,"关注组合成功");
					elem.addClass("subed_btn");
				    elem.html("取关");
				    //关注人数增加
					var fans_num =$(_pageId+"#start_num").text();
					if(fans_num!=0){
						fans_num =parseInt(fans_num)+1;
						$(_pageId+"#start_num").text(fans_num+"人关注");	
					}
				}
				else{
					layerUtils.iMsg(0,"取消关注组合成功");
					elem.removeClass("subed_btn");
					elem.html("+关注");
					var fans_num =$(_pageId+"#start_num").text();
				    fans_num =parseInt(fans_num)-1;
					$(_pageId+"#start_num").text(fans_num+"人关注");
				}
			}
			else{
				if(sub_type == 1)
					layerUtils.iAlert("关注组合失败:"+resultVo.error_info,-1);
				else 
					layerUtils.iAlert("取消关注组合失败:"+resultVo.error_info,-1);
			}
		},{isShowWait:false});
	}

	//查询组合详情
	function queryPortfolioDetails(){
		var param={
				"portfolio_id":portfolio_id    
		};
		portfolioService.queryPortfolioDetails(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				var result = resultVo.results;
				fillHotPortfolioDetailsData(result);
				userIsSubPort();
			}else{
				layerUtils.iAlert("组合详情加载失败:"+resultVo.error_info,-1);
			}
		});
	}


	/**
	 * 初始化绑定查询后的组合详情
	 */
	function fillHotPortfolioDetailsData(result){
		$(_pageId + "#headList").html("");
		$(_pageId + "#headList1").html("");
		$(_pageId + "#int_txt").html("");
		var html = "";
		var html1="";
		var html2="";
		for(var i = 0;i<result.length;i++)
		{
			html2 += '<a herf="javascript:void(0)" class="icon_back"></a> <h1 class="title text-center">'+result[i].portfolio_name+'</h1>';
			html2 +='<a href="javascript:void(0)" class="menu_iocn"></a><a href="javascript:void(0)" class="menu_iocn close_iocn" style="display: none" id="close" ></a>';
			html2 +=	'<div class="xl_menu" style="display: none"><ul><li><a href="javascript:void(0)">首页</a></li>';
			html2 +='<li><a href="javascript:void(0)">组合</a></li>';
			html2 +='<li><a href="javascript:void(0)">投顾</a></li>';
			html2 +='<li><a href="javascript:void(0)">问答</a></li>';
			html2 +=	'<li><a href="javascript:void(0)">我的</a></li></ul></div>';
			html += '<div class="box1_up">';
			html += '<div class="up_tit">';
			
			html +='<a href="javascript:void(0)" class="sub_btn" id="gz">+关注</a><span>沪深</span></div>';
			html +='<div class="up_txt"><span>总收益</span><strong id="total_yield">'+(result[i].total_yield*100).toFixed(2)+'<em>%</em></strong>';
			html +='<b style="font-size: 0.12rem;color: #e6e6e6;line-height: 0.8rem;float: right;" name='+result[i].sub_num+' id="start_num">';
			if(result[i].sub_num==null ||""==result[i].sub_num){
			    html+='0 人关注</b>';
				}else{
					 html+=result[i].sub_num+'人关注</b>';
				}
		
			html += '</div></div><div class="box1_lower"><div class="ui layout">';
				html += '<div class="row-1"><p>日收益</p><span>'+(result[i].day_yield*100).toFixed(2)+'%</span></div><div class="row-1">';
			html += '<p>周收益</p><span>'+(result[i].recent_week_yield*100).toFixed(2)+'%</span></div><div class="row-1">';
			html += '<p>月收益</p><span>'+(result[i].recent_month_yield*100).toFixed(2)+'%</span></div><div class="row-2">';
			html += '<p>近30日最大回撤率 </p><span>'+(result[i].retrace_rate_thirty*100).toFixed(2)+'%</span></div></div></div>';
			html += '</div><div class="com_det_box2"><div class="tx_box" id="'+result[i].user_id+'" type="'+result[i].user_type+'"><div class="ring">';
			if(result[i].user_image_small==null||""==result[i].user_image_small)
				html+='<img src="images/my_tx.png" class="circle" /></div>';
			else{
				html+='<img src="'+domain+result[i].user_image_small+'" class="circle" /></div>';
			}

			html += '<div class="list_info"><h4>'+result[i].user_name+'</h4>';
			if(result[i].user_type == 1){
				if(result[i].invest_rank==0){
					html += '<p>普通投顾</p>';
				}else if(result[i].invest_rank==1){
					html += '<p>高级投顾</p>';
				}else if(result[i].invest_rank==2){
					html += '<p>资深投顾</p>';
				}else if(result[i].invest_rank==3){
					html += '<p>首席投顾</p>';
				}else if(result[i].invest_rank==4){
					html += '<p>总部投顾团队</p>';
				}else if(result[i].invest_rank==5){
					html += '<p>客服专员</p>';
				}else
					html += '<p>未知投顾</p>';
			}else
				html += '<p>民间高手</p>';
				
			html += '</div></div><div class="box2_lower"><div class="ui layout"><div class="row-1">';
			html += '<p>初始资产(元)</p><span>1000000.00</span></div><div class="row-1">';
			html +='<p>当前总资产(元)</p><span>'+result[i].total_assets+'</span></div><div class="row-1">';
			html +='<p>创建日期</p><span>'+result[i].create_time.substring(0,10)+'</span></div></div></div>';
			html1+='<p>'+result[i].introdution+'</p><div class="window_gray" style="display: none" id="close"></div>	<!--遮罩层 -->';
		}
		$(_pageId + "#headList").append(html2);
		$(_pageId + "#headList1").append(html);
		$(_pageId + "#int_txt").append(html1);

	}


	//查询 持仓(默认每页100条)
	function queryProtfolioHoldStock(){
		var param={
				"curPage" : 1,
				"numPerPage" : 100,
				"account_id":portfolio_id     //118
		};
		portfolioService.queryProtfolioHoldStock(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				var result = resultVo.results[0].data;
				fillProtfolioHoldStockData(result);
			}else if(resultVo.error_no=='-40835102'){
				//无持仓数据
				$(_pageId + ".HoldStockList").siblings().remove();
				var noDataHtml = '<tr><td colspan="4" style="height:10px; border-bottom:1px dashed #BBBBBB; font-size:0.12rem; color:#9999B1; text-align:center;">暂无持仓</td></tr>';
				$(_pageId + ".HoldStockList").after(noDataHtml);
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
			html +='<tr><td><h4>'+result[i].stock_name+'</h4><span>'+result[i].stock_code+'</span></td>';
			html +='<td><p class="'+(result[i].profit_rate >=0 ? "ared" : "agreen")+'">'+Number(result[i].profit_rate).toFixed(2)+'%</p><p class="'+(result[i].profit>=0 ? "ared" : "agreen")+'">'+(result[i].profit*1).toFixed(2)+'</p></td><td>';
			html +='<p>'+result[i].total_qty+'</p><p>'+result[i].position+'%</p></td><td>';
			html +='<p>'+Number(result[i].cost_price).toFixed(2)+'</p><p class="'+(result[i].uppercent>= 0 ? "ared" : "agreen")+'">'+Number(result[i].now_price).toFixed(2)+'</p></td></tr>';
		}

		$(_pageId + ".HoldStockList").after(html);

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
				"account_id":portfolio_id
		};
		portfolioService.queryProtfolioTrade(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				var result = resultVo.results[0].data;
				
				totalPage = resultVo.results[0].totalPages;
				totalRows = resultVo.results[0].totalRows;
				num = result.length;
				fillProtfolioHoldTrade(result,insertType);
			}
			else if(resultVo.error_no=='-40835602'){		
				$(_pageId + " .det2_con").css({'display':'none'});
				$(_pageId + " .tab_con tab_con_det2").css({'display':'none'});
				$(_pageId + " #noData").css({'display':'block'});
				var noDataHtml = '<tr><td colspan="4" style="height:10px; border-bottom:1px dashed #BBBBBB; font-size:0.12rem; color:#9999B1; text-align:center;">暂无交易动态</td></tr>';
				$(_pageId + "#TradeListnexts").after(noDataHtml);
			}
			else{
				layerUtils.iAlert("交易动态详情加载失败:"+resultVo.error_info,-1);
			}
		},{isShowWait:type});
	}

	//填充交易动态数据
	function fillProtfolioHoldTrade(result,insertType){
		$(_pageId + "#TradeList .load_add").remove();
		$(_pageId + "#TradeListnext").after("");
		var html = "";
		for(var i = 0;i<result.length;i++)
		{
			html += '<tr><td><h4>'+result[i].stock_name+'</h4><span>'+result[i].stock_code+'</span></td>';
			html +='<td>'+result[i].exec_date+'</td><td>'+(result[i].stock_be_position*100).toFixed(2)+'%→'+(result[i].stock_af_position*100).toFixed(2)+'%</td>';
			if(result[i].trade_type == 0)
				html +='<td><a class="ui tag primary buy">买</a>';
			else if(result[i].trade_type == 1)
				html += '<td><a class="ui tag primary sell">卖</a>';
			html +='<span>'+(result[i].exec_price*1).toFixed(2)+'</span></td></tr>';
			
		}if(curPage!=1){
			$(_pageId + " #TradeListTab").find("tr").last().after(html);
		}else{
			$(_pageId + "#TradeListnext").after(html);
		}
		if(curPage != totalPage){
			//由于 html块 不好追加 只好 选用这种找到最后 一个tr进行叠加
			var lodMore='<a href="javascript:void(0);" class="load_add" style=" text-align:center;">点击加载更多...</a>';
			$(_pageId + " #TradeListTab").after(lodMore);
		}

	}
	
		

	/**
	 *画图
	 * */
	function introductionTabFunc()
	{    
		var queryMap ={
				"plan_id" : portfolio_id
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
				drowCharts.getHighcharts2(seriesOptions,$("#box_line"),style);
				//drowCharts.getHighcharts(seriesOptions,'box_line',style);
				hasDrawChart = true;
			}
			else{
				layerUtils.iAlert("曲线图加载失败"+resultVo.error_info,-1);
			}
		};
		portfolioService.queryDrowdata(queryMap,drowdataCallBack);
		
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

	}

	var portfolio_portfolioDetail = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = portfolio_portfolioDetail;
});