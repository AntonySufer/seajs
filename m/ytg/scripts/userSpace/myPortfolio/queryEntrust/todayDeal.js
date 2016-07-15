/**
 * 今日成交
 */
define("ytg/scripts/userSpace/myPortfolio/queryEntrust/todayDeal", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
        portfolioService = require("portfolioService"),
		
		pageCode = "userSpace/myPortfolio/queryEntrust/todayDeal", 
		_pageId = "#userSpace_myPortfolio_queryEntrust_todayDeal ";
	
	//页面公共JS
	var pageCommon = require("pageCommon");
	
	//全局变量
	var portfolio_id = null;
	//插件
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null,"_init":false}; //上下滑动
	//入参
	var num = 0;
	var decount=0;
	var isFirstShow=true;
	/**
	 * 初始化
	 */
	function init() {
		decounts=appUtils.getSStorageInfo("decounts");
		if(decounts>1){
			decount=decounts;
		}else{
			decount=0;
		}
		portfolio_id = appUtils.getSStorageInfo("portfolioId");
		
		if(isFirstShow){
			 destoryFunc();
			//查询当日成交
				getTodayDeal();
			 isFirstShow=false;
		 }
		
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent() {
		//头部菜单绑定事件
		pageCommon.headerMenuFunc(_pageId,pageCode);
		//头部返回
		appUtils.bindEvent($(_pageId + ".icon_back"), function(e) {
			appUtils.clearSStorage("decounts");
			appUtils.pageInit(pageCode,"userSpace/myPortfolio/queryEntrust/queryEntrustIndex");
		});
		
		//今日委托
		appUtils.bindEvent($(_pageId + "#todayEntrust"), function(e) {
			appUtils.clearSStorage("decounts");
			appUtils.setSStorageInfo("decounts",decount);
			appUtils.pageInit(pageCode,"userSpace/myPortfolio/queryEntrust/todayEntrust");
		});
	}
	
	//***************************【初始化方法】***********************************//
	/**
	 * 今日成交
	 * */
	function getTodayDeal(){
		 decount++;
		    var type;
	    	if(decount>1){
	    		type=false;
	    	}else{
	    	  type=true;	
	    	}
		var param = {
				"account_id" : portfolio_id
		};
		portfolioService.queryTodayDeal(param,function callBack(resultVo){
			if(Number(resultVo.error_no) == 0){
				//layerUtils.iMsg(0,"当日成交查询成功");
				var result = resultVo.results[0].data;
				fillEntrustData(result);
				
				num = result.length;
				initVIScroll(num);
			}
			else if(resultVo.error_no == '-40115302'){
				//没有数据
				var height = $(window).height() - $(_pageId +" .header").height()-$(_pageId+" .top_nav").height();
				$(_pageId + ".entrust_list").html("");
				var noDataHtml = '<div  style="height:'+height+'px; font-size:16px; color:#9999B1; background-color:#FFFFFF; text-align:center; padding-top:150px">今日暂无成交记录</div>';
				$(_pageId + ".entrust_list").append(noDataHtml);
				initVIScroll(num);
			}
			else{
				layerUtils.iAlert("当日成交查询失败:"+resultVo.error_info,-1);
			}
		},{isShowWait:type});
	}
	
	//将历史成交数据填充到页面
	function fillEntrustData(result)
	{
		$(_pageId + ".entrust_list").html("");
		var html = "";
		for(var i = 0;i<result.length;i++)
		{
			var trade_type = '';
			if(result[i].trade_type == 0)
				trade_type = '<h3 class="ared">买入</h3>';
			else
				trade_type = '<h3 class="agreen">卖出</h3>';
			html += '<div class="item_box">';
			html += '<div class="li_tit"><span class="time">'+result[i].exec_date+'   '+result[i].exec_time+'</span>'+trade_type+'</div>';
			html += '<div class="box_list clearfix">';
			html += '<h4>'+result[i].stock_name+'<span>'+result[i].stock_code+'</span></h4>';
			html += '<ul>';
			html += '<li><span>委托编号</span>'+result[i].order_srlnum+'</li>';
			//html += '<li><span>状态说明</span>部分成交</li>';
			html += '<li><span>成交数量</span>'+result[i].exec_qty+'</li>';
			html += '<li><span>成交价格</span>'+(result[i].exec_price*1).toFixed(2)+'</li>';
			html += '<li><span>成交金额</span>'+result[i].bargain_balance+'</li>';
			//html += '<li><span>委托数量</span>1500</li>';
			html += '</ul>';
			html += '</div>';
			html += '</div>';
		}
		$(_pageId + ".entrust_list").append(html);
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
						//查询数据
						getTodayDeal();//查询委托数据
					},
					"upHandle": function() {				//上拉获取下一页数据方法
						
					},
					"wrapperObj": null
			};
			vIscroll.scroll = new VIscroll(config); 	//初始化，需要做if(!hIscroll._init)判断
			vIscroll._init = true; 						//尽量只初始化一次，保持性能
			$(_pageId + " .visc_pullUp").hide();
		} else {
			vIscroll.scroll.refresh();
		}
	}
	
	//*********************************************************************//
	
	/**
	 * 销毁
	 */
	function destroy() {
	
		//隐藏菜单以及遮罩层
		pageCommon.hideHeaderMenuFunc(_pageId);
	}
	function destoryFunc(){
		//销毁滑动插件
		if(vIscroll._init == true){
			vIscroll.scroll.destroy(); //销毁
			vIscroll.scroll = null;
			vIscroll._init = false; 
		}
		curPage = 1;		//当前页数
		totalPage=1;		//后台返回的总页数
		totalRows = 0;     //总条数
		num = 0;
	}
	var userSpace_myPortfolio_todayDeal = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = userSpace_myPortfolio_todayDeal;
});