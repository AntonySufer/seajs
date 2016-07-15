/**
 *  持仓详情
 * @author 余一一
 * @date 2016-03-15
 */
define("ytgMatch/scripts/simulatedStocks/myPortfolio/queryEntrust/position", function(require, exports, module) {
	var appUtils = require("appUtils"), 
    layerUtils = require("layerUtils"), 
    gconfig = require("gconfig"),
    ytgMatchService = require("ytgMatchService"),//服务
    
	pageCode = "simulatedStocks/myPortfolio/queryEntrust/position", 
	_pageId = "#simulatedStocks_myPortfolio_queryEntrust_position ";

	//页面公共JS
	var pageCommon = require("pageCommon");
	var positionHeight = 0; //持仓高度
	//全局变量
	var user_id = null;//用户id
	var account_id = null; //组合id,页面传参

		function init() {
			user_id = appUtils.getSStorageInfo('userId',true);//获取用户
			account_id = appUtils.getSStorageInfo("account_id");//获取组合id
			//查询组合基本信息
			getPortfolioInfo();
			//查询组合持仓
			getPosition();
		}
		
		/**
		 * 事件绑定
		 */
		function bindPageEvent() {
			//头部菜单绑定事件
			pageCommon.headerMenuFunc(_pageId,pageCode);
			//头部返回
			appUtils.bindEvent($(_pageId + ".icon_back"), function(e) {
				appUtils.pageInit(pageCode,"dynamic/contest/ing");
			});
			
			//头部导航栏(持仓;买入;卖出;撤单;查询)
			appUtils.bindEvent($(_pageId + ".row-1"), function(e) {
				var index = $(this).index();
				if(index == 0){
					//appUtils.pageInit(pageCode,pageCode);
				}
				else if(index ==1){
					appUtils.pageInit(pageCode,"simulatedStocks/myPortfolio/buyStock");
				}
				else if(index ==2 ){
					appUtils.pageInit(pageCode,"simulatedStocks/myPortfolio/sellStock");
				}
				else if(index ==3){
					appUtils.pageInit(pageCode,"simulatedStocks/myPortfolio/cancelEntrust");
				}
				else if(index ==4){
					appUtils.pageInit(pageCode,"simulatedStocks/myPortfolio/queryEntrust/queryEntrustIndex");
				}
			});
		}
		
		//***************************【初始化方法】***********************************//
		/**
		 * 查询组合基本信息
		 * */
		function getPortfolioInfo(){
			var param = {
					"account_id" : account_id //组合id
			};
			ytgMatchService.queryPortfolioDetails(param,function callBack(resultVo){
				if(Number(resultVo.error_no) == 0){
					//layerUtils.iMsg(0,"查询组合信息成功");
					var result = resultVo.results;
					if (result) {
						fillPortInfoData(result); //将组合数据填充到页面
				}
					
				}
				else{
					
					layerUtils.iAlert("查询组合信息失败:"+resultVo.error_info,-1);
				}
			});
		}
		
		//将组合基本信息填充到页面
		function fillPortInfoData(results)
		{
			
			var result = results[0];
			//将可用资金存入cookie
			var userable_balance = result.userable_balance; //可用资金
			appUtils.clearSStorage("userableBalance");
			appUtils.setSStorageInfo("userableBalance",userable_balance);

			//var protfolio_name = result.portfolio_name; //组合名称
			var total_assets = (result.total_assets*1).toFixed(2); //总资产
			var userable_balance = (result.userable_balance*1).toFixed(2); //可用资金
			var total_earnings = (result.total_earnings*1).toFixed(2); //总收益
			var total_yield = (Number(result.total_yield)*100).toFixed(2); //总收益
			var day_yield = (Number(result.day_yield)*100).toFixed(2); //日收益
			var recent_week_yield = (Number(result.total_yield)*100).toFixed(2); //7日收益
			var introdution = result.introdution; //简介
			//$(_pageId + "#protfolio_name").html(protfolio_name);
			$(_pageId + "#total_assets").html(total_assets);
			$(_pageId + "#userable_balance").html(userable_balance);
			$(_pageId + "#total_earnings").html(total_earnings);
			$(_pageId + "#total_yield").html(total_yield+'%');
			$(_pageId + "#day_yield").html(day_yield+'%');
			$(_pageId + "#recent_week_yield").html(recent_week_yield+'%');
			$(_pageId + "#introdution").html(introdution);
			if(total_yield < 0){
				$(_pageId + "#total_yield").addClass("agreen");	
			}
			else{
				$(_pageId + "#total_yield").addClass("ared");
			}
			if(total_earnings < 0){
				$(_pageId + "#total_earnings").addClass("agreen");	
			}
			else{
				$(_pageId + "#total_earnings").addClass("ared");
			}
			
			
			if(day_yield < 0){
				$(_pageId + "#day_yield").addClass("agreen");	
			}
			else{
				$(_pageId + "#day_yield").addClass("ared");
			}
			if(recent_week_yield < 0){
				$(_pageId + "#recent_week_yield").addClass("agreen");
			
			}
			else{
				$(_pageId + "#recent_week_yield").addClass("ared");
			}
		}
		
		/**
		 * 查询组合持仓(默认查询100条，不分页)
		 * */
		function getPosition(){
			var param = {
					"account_id" : account_id,
					"curPage" : 1,
					"numPerPage" : 100
			};
			ytgMatchService.queryProtfolioHoldStock(param,function callBack(resultVo){
				if(Number(resultVo.error_no) == 0){
					$(_pageId + "#positionBox2").hide();
					$(_pageId + "#positionBox").show();
				  var result = resultVo.results[0].data;
					if (result!==null && result.length>0) {
						fillPositionData(result); //将组合数据填充到页面
					}else{
						$(_pageId + "#position").siblings().remove();
						var noDataHtml = '<tr><td colspan="4" style="height:10px; border-bottom:1px dashed #BBBBBB; font-size:0.12rem; color:#9999B1; text-align:center;">暂无持仓</td></tr>';
						$(_pageId + "#position").after(noDataHtml);
					//	$(_pageId + "#positionBox").html("暂无持仓");
					}
				}else if(resultVo.error_no =="-40835102"){
					$(_pageId + "#position").siblings().remove();
					var noDataHtml = '<tr><td colspan="4" style="height:10px; border-bottom:1px dashed #BBBBBB; font-size:0.12rem; color:#9999B1; text-align:center;">暂无持仓</td></tr>';
					$(_pageId + "#position").after(noDataHtml);
				//	$(_pageId + "#positionBox").html("暂无持仓");
				}
				else{
					layerUtils.iAlert("查询组合持仓失败:"+resultVo.error_info,-1);
				}
			});
		}
		
		//将组合持仓填充到页面
		function fillPositionData(result)
		{
			$(_pageId + "#position").siblings().remove();
			var html = "";
			for(var i = 0;i<result.length;i++)
			{
				html += '<tr>';
				html += '<td><p>'+result[i].stock_name+'</p><p>'+result[i].stock_code+'</p></td>';
				if(result[i].profit_rate >= 0)
					html += '<td><p class="ared">'+(result[i].profit_rate*1).toFixed(2)+'%</p>';
				else
					html += '<td><p class="agreen">'+(result[i].profit_rate*1).toFixed(2)+'%</p>';
				if(result[i].profit>=0){
					html+='<p class="ared">'+(result[i].profit*1).toFixed(2)+'</p></td>';
					
				}else
					{
					 html+='<p class="agreen">'+(result[i].profit*1).toFixed(2)+'</p></td>';
					}
				html += '<td><p>'+result[i].total_qty+'</p><p>'+result[i].usable_qty+'</p></td>';
				html += '<td><p>'+result[i].cost_price+'</p>';
				if(result[i].uppercent>= 0){
					html+='<p class="ared">'+(result[i].now_price*1).toFixed(2)+'</p></td>';
				}else{
					html+='<p class="agreen">'+(result[i].now_price*1).toFixed(2)+'</p></td>';
				}
				
				html += '</tr>';
			}
			$(_pageId + "#position").after(html);
			
		//	positionHeight = $(_pageId + ".visc_scroller").height();
		}
		
		
		//*********************************************************************//
		
		/**
		 * 销毁
		 */
		function destroy() {
			//隐藏菜单以及遮罩层
			pageCommon.hideHeaderMenuFunc(_pageId);

		}

		var userSpace_myPortfolio_portfolioDetail = {
			"init" : init,
			"bindPageEvent" : bindPageEvent,
			"destroy" : destroy
		};

		module.exports = userSpace_myPortfolio_portfolioDetail;
	});