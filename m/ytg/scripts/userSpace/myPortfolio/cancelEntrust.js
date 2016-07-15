/**
 * 撤单
 */
define("ytg/scripts/userSpace/myPortfolio/cancelEntrust", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
        portfolioService = require("portfolioService"),
		
		pageCode = "userSpace/myPortfolio/cancelEntrust", 
		_pageId = "#userSpace_myPortfolio_cancelEntrust ";
	
	//页面公共JS
	var pageCommon = require("pageCommon");
	
	//插件
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null,"_init":false}; //上下滑动
	//全局变量
	var portfolio_id = null;
	var portfolio_name = null;
	//入参
	var curPage = 1;
	var numPerPage = 1000000;
	var totalPage=1;
	var totalRows = 0;
	var num = 0;
	
	/**
	 * 初始化
	 */
	function init() {
		portfolio_id = appUtils.getSStorageInfo("portfolioId");
		//设置标题
		portfolio_name = appUtils.getSStorageInfo("portfolioName");
		$(_pageId + "#portfolio_name").html(portfolio_name);
		//查询可撤委托(当日委托)
		getTodayEntrust();
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent() {
		//头部菜单绑定事件
		pageCommon.headerMenuFunc(_pageId,pageCode);
		//头部返回
		appUtils.bindEvent($(_pageId + ".icon_back"), function(e) {
			appUtils.pageInit(pageCode,"userSpace/myPortfolio/myPortfolio");
		});
		
		//头部导航栏(持仓;买入;卖出;撤单;查询)
		appUtils.bindEvent($(_pageId + ".row-1"), function(e) {
			var index = $(this).index();
			if(index == 0){
				appUtils.pageInit(pageCode,"userSpace/myPortfolio/portfolioDetail");
			}
			else if(index ==1){
				appUtils.pageInit(pageCode,"userSpace/myPortfolio/buyStock");
			}
			else if(index ==2 ){
				appUtils.pageInit(pageCode,"userSpace/myPortfolio/sellStock");
			}
			else if(index ==3){
				//appUtils.pageInit(pageCode,"userSpace/myPortfolio/cancelEntrust");
			}
			else if(index ==4){
				appUtils.pageInit(pageCode,"userSpace/myPortfolio/queryEntrust/queryEntrustIndex");
			}
		});
		
		/** **************************  预绑定事件 ******************************  */
		//撤单
		appUtils.preBindEvent($(_pageId + ".entrust_list"),".withdrawals", function(e) {
			var cancel_id = $(this).attr("cancelId");
			layerUtils.iConfirm("确认撤单？",function yesFunc(){
				cancelEntrust(cancel_id);//撤单
			});
		},"click");
	}
	
	//***************************【初始化方法】***********************************//
	/**
	 * 可撤委托
	 * */
	function getTodayEntrust(insertType){
		insertType =  typeof insertType == "undefined" || insertType == "" || insertType == null ? "html":insertType;
		var param = {
				"account_id" : portfolio_id,
				"curPage" : curPage,
				"numPerPage" : numPerPage
		};
		portfolioService.queryTodayEntrust(param,function callBack(resultVo){
			if(Number(resultVo.error_no) == 0){
				//layerUtils.iMsg(0,"可撤委托查询成功");
				var result = resultVo.results[0].data;
				fillEntrustData(result,insertType);

				num = resultVo.results[0].data.length;
				totalPage=resultVo.results[0].totalPages;
				curPage=resultVo.results[0].currentPage;
				totalRows = resultVo.results[0].totalRows;
				initVIScroll(num);
			}
			else if(resultVo.error_no == '-40115202'){
				//没有数据
				var height = $(window).height() - $(_pageId +" .header").height()-$(_pageId+" .top_nav").height();
				$(_pageId + "#fillDataList").html("");
				var noDataHtml = '<div  style="height:'+height+'px; font-size:16px; color:#9999B1; background-color:#FFFFFF; text-align:center; padding-top:150px; margin-top: 0.1rem;">您暂无可撤委托</div>';
				$(_pageId + "#fillDataList").append(noDataHtml);
				initVIScroll(num);
			}
			else{
				layerUtils.iAlert("可撤委托查询失败:"+resultVo.error_info,-1);
			}
		});
	}
	//将可撤委托数据填充到页面
	function fillEntrustData(result,insertType)
	{
		if(insertType == 'html'){
			$(_pageId + "#fillDataList").html("");
		}
		var html = "";
		var noDataNum = 0;
		for(var i = 0;i<result.length;i++)
		{
			if(result[i].trade_status == 0 || result[i].trade_status == 1){
				var trade_type = "";
				if(result[i].trade_type == 0)
					trade_type = '<h3 class="ared">买入</h3>';
				else
					trade_type = '<h3 class="agreen">卖出</h3>';
				html += '<div class="item_box"><div class="item_box_con">';
				html += '<div class="rounded">'+trade_type+'<p>'+result[i].stock_name+'</p><span>'+result[i].stock_code+'</span></div>';
				html += '<div class="list_info">';
				html += '<div class="li_tit"><a class="withdrawals" cancelId="'+result[i].serial_num+'">撤单</a><h3><span>委托时间：</span>'+result[i].order_time+'</h3></div>';
				html += '<div class="box_list clearfix"><ul>';
				html += '<li><span>委托价格</span>'+(result[i].order_price*1).toFixed(2)+'</li>';
				html += '<li><span>委托数量</span>'+result[i].order_qty+'</li>';
				html += '<li><span>金额</span>'+result[i].order_balance+'</li>';
				if(result[i].trade_status == 0)
					html += '<li><span>状态</span>未报</li>';
				else if(result[i].trade_status == 1)
					html += '<li><span>状态</span>已报</li>';
				html += '</ul></div>';
				html += '</div>';
				html += '</div></div>';
			}
			else{
				noDataNum++;
			}
		}
		if (result.length == noDataNum) {
			//没有下滑加载下一页，所以可以这么处理
			var height = $(window).height() - $(_pageId +" .header").height()-$(_pageId+" .top_nav").height();
			$(_pageId + "#fillDataList").html("");
			var noDataHtml = '<div  style="height:'+height+'px; font-size:16px; color:#9999B1; background-color:#FFFFFF; text-align:center; padding-top:150px; margin-top: 0.1rem;">您暂无可撤委托</div>';
			$(_pageId + "#fillDataList").append(noDataHtml);
		}
		else{
			$(_pageId + "#fillDataList").append(html);
		}
	}

	
	/**
	 * 初始化上下滑动组件 
	 */
	function initVIScroll(num){
		if(!vIscroll._init){
			var config = {
					"isPagingType": false,		//false表示是微博那种累加形式，true表示分页形式
					"visibleHeight": $(window).height() - $(_pageId +" .header").height()-$(_pageId+" .top_nav").height(),//显示内容区域的高度，当isPaingType为false时传
					"container": $(_pageId+" #v_container_funds"),
					"wrapper":$(_pageId+" #v_wrapper_funds"),	
					"downHandle": function() {				//下拉获取上一页数据方法
						curPage = 1;						//上拉将当前页数设置为1
						//查询数据
						getTodayEntrust("html");//查询委托数据
					},
					"upHandle": function() {				//上拉获取下一页数据方法
						/*if(curPage < totalPage)				//判断当前页数是不是小于总页数
						{
							curPage++;
							getTodayEntrust("append");//查询委托数据
						}*/
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
			if(curPage == 1){
				if(num < numPerPage || num==totalRows){
					$(_pageId+" .visc_pullUp").hide();
				}else{
					$(_pageId+" .visc_pullUp").show();
				}
			}else{
				if(num < numPerPage || (num == numPerPage && curPage == totalPage)){
					$(_pageId+" .visc_pullUp").hide();
				}else{
					$(_pageId+" .visc_pullUp").show();
				}
			}

		}
	}
	
	/**
	 * 撤单
	 * */
	function cancelEntrust(cancel_id){
		var param = {
				"account_id" : portfolio_id,
				"cancel_id" : cancel_id
		};
		portfolioService.cancelTradeOrder(param,function callBack(resultVo){
			if(Number(resultVo.error_no) == 0){
				layerUtils.iMsg(0,"撤单成功");
				appUtils.pageInit(pageCode,pageCode);
			}
			else{
				layerUtils.iAlert("撤单失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	//*********************************************************************//
	
	/**
	 * 销毁
	 */
	function destroy() {
		curPage = 1;		//当前页数
		totalPage=1;		//后台返回的总页数
		totalRows = 0;     //总条数
		num = 0;
		$(_pageId +" #fillDataList").html("");
		//隐藏菜单以及遮罩层
		pageCommon.hideHeaderMenuFunc(_pageId);
	}

	var userSpace_myPortfolio_cancelEntrust = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = userSpace_myPortfolio_cancelEntrust;
});