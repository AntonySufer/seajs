/**
 * 能力分析
 * @author 余一一
 * @date 2016-03-21
 */
define("ytg/scripts/ytgMatch/public/analysis", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
        drowCharts = require("drowCharts"),//画图
		pageCode = "ytgMatch/public/analysis", 
		ytgMatchService = require("ytgMatchService"),//服务
		_pageId = "#ytgMatch_public_analysis ";
	
	
	//全局变量
	var domain = gconfig.global.domain;
	//初始化

	var curPage = 1;

	var account_id = "";
	var paramMap = {
			curPage:curPage,
			numPerPage:5
	};
	/**
	 * 初始化
	 */
	function init() {
		account_id = appUtils.getPageParam("account_id");//获取组合id
		paramMap.account_id = account_id;
		//402502	模拟炒股帐号数据统计
		ytgMatchService.queryPortfolioSumByAccountId({"account_id": account_id}, queryPortfolioSumCb, null);
		//401819		盈亏前五笔
		ytgMatchService.loadInvestStkProfitInfo({'account_id':account_id,'row_num':5}, completeQueryCb, null);
		//401821		查询完整收益
		ytgMatchService.findOperateInfoByAccountId(paramMap, operateInfoByAccountIdCb, null);
		
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent() {

		//返回
		appUtils.bindEvent($(_pageId + ".back_btn"), function(){
			appUtils.pageBack();
		});
		
		//加载更多
		appUtils.bindEvent($(_pageId + ".load_add"), function() {
			paramMap.curPage = curPage++;
			//401821	查询完整收益
			ytgMatchService.findOperateInfoByAccountId(paramMap, function(resultVo){
				operateInfoByAccountIdCb(resultVo, "append");
			}, null);
		});
		
	}
	
	//***************************【函数方法】***********************************//
	//加载投资盈利和亏损股票信息
	function completeQueryCb(resultVo){
		if(resultVo.error_no == 0){
			//作条形图
			var result = resultVo.results;
			var list = [];
			if(result != null){
				var tickInterval = parseInt((parseFloat(result[0].earn_rate) - result[result.length-1].earn_rate)/3);
				$(result).each(function(i){
					var temp = {};
					var earn_rate;
					var color = '#50ed7d';
					temp['name'] = result[i].stock_name;
					earn_rate = parseFloat(result[i].earn_rate*100);
					if(earn_rate >= 0){
						color = '#FF7A7A';
					}
					temp['color'] = color;
					temp['y'] = earn_rate;
					list[i] = temp;
				});
				
				var style = {};
				style['height']=200;
				style['rotation']=-90;
				style['tickInterval']=tickInterval<=0 ? 3 : tickInterval;
				style['name']='盈利';
				drowCharts.drowColunm3(list,"investStk",style);
			} 
		} else {
			layerUtils.iAlert("调用失败:"+resultVo.error_info,-1);
		}
	}
	
	
	//查询组合信息
	function queryPortfolioSumCb(resultVo){
		if(resultVo.error_no == 0){
			var result = resultVo.results;
			if(result != null && result.length>0){
				var data = result[0];
				$(_pageId+ "#portfolio_style").html(data.portfolio_style);//组合类型
				$(_pageId+ "#stock_holddays_avg").html(data.stock_holddays_avg);//平均持股天数
				$(_pageId+ "#stock_style").html(data.risk_rank);//操作类型
				$(_pageId+ "#stock_num_avg").html(data.stock_num_avg);//操作天数
				$(_pageId+ "#retrace_rate_year").html(Number(data.retrace_rate_year*100).toFixed(2));//回撤
				$(_pageId+ "#trade_loss_sum").html(data.trade_loss_sum);//失败比赛
				$(_pageId+ "#trade_success_sum").html(data.trade_success_sum);//成功比赛
				
				var total_operate = Number(data.trade_loss_sum) + Number(data.trade_success_sum);
				var trade_loss_rate = 0.0;
				var trade_success_rate = 0.0;
				if(total_operate != 0){
					trade_loss_rate = (Number(data.trade_loss_sum) / total_operate * 100).toFixed(2);
					trade_success_rate = (Number(data.trade_success_sum) / total_operate * 100).toFixed(2);
				}
				
				$(_pageId+ "#trade_loss_rate").html(trade_loss_rate + "%");
				$(_pageId+ "#trade_success_rate").html(trade_success_rate + "%");
				
				
				//饼图大小
				var style = [];
				style['c_height'] = 46;
				style['c_width'] = 46;
				style['p_size'] = 20;
				style['p_innersize'] = 20;
				//绘制盈利饼状图
				drowCharts.drowpie(parseInt(trade_success_rate),'#FF7A7A','profitDiv',style);
				//绘制亏损饼状图
				drowCharts.drowpie(parseInt(trade_loss_rate),'#50ed7d','lossDiv',style);
				
			}
		} else {
			layerUtils.iAlert("调用失败:"+resultVo.error_info,-1);
		}
	}
	
	
	/***
	 * 完整收益
	 */
	function operateInfoByAccountIdCb(resultVo, loadType){
		if(resultVo.error_no == 0){
			if(resultVo.results != null && resultVo.results.length >0){
				var result = resultVo.results[0].data;
				if(result != null && result.length>0){
					var html = "";
					if(loadType != "append"){
						$(_pageId + "div.table_con table").html(html);
					}
					for(var i=0; i< result.length; i++){
						var data = result[i];
						var earn_rate = data.earn_rate;
						var earnRateHtml = "";
						if(earn_rate > 0){
							earnRateHtml = "<td><h5 class=\"ared\">"+Number(data.earn_rate*100).toFixed(2)+"%</h5><p class=\"ared\">盈利并跑赢大盘</p></td>";
						} else {
							earnRateHtml = "<td><h5 class=\"agreen\">"+Number(data.earn_rate*100).toFixed(2)+"%</h5><p class=\"agreen\">盈亏并跑输大盘</p></td>";
						}
						
						html +="<tr>"+
						"<td>"+
						"<h4>"+data.stock_name+"</h4>"+
						"<p>数量"+data.stk_qty+"</p>"+
					"</td>"+
					"<td>"+
						"<h5 class=\"ared\">"+data.clost_price+"买入</h5>"+
						"<p>"+data.start_date+"</p>"+
					"</td>"+
					"<td>"+
						"<h5 class=\"agreen\">"+data.sell_average_price+"卖出</h5>"+
						"<p>"+data.end_date+"</p>"+
					"</td>"+
					"<td>"+
					earnRateHtml+
					"</td>"+
				"</tr>";

					}
					if(resultVo.results[0].currentPage*1 < resultVo.results[0].totalPages*1){
						$(_pageId + ".load_add").show();
					} else {
						$(_pageId + ".load_add").hide();
					}
				}
				$(_pageId + "div.table_con table").append(html);
			}
		} else {
			layerUtils.iAlert("调用失败:"+resultVo.error_info,-1);
		}
	};
	
	
	
	
	//*********************************************************************//
	
	/**
	 * 销毁
	 */
	function destroy() {
		
	}

	var analysis = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = analysis;
});