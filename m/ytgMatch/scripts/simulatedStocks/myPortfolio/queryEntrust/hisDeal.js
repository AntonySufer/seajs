/**
 * 历史成交
 * @author 余光宝
 * @date 2016-03-16
 */
define("ytgMatch/scripts/simulatedStocks/myPortfolio/queryEntrust/hisDeal", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
        ytgMatchService = require("ytgMatchService"),//服务
		
		pageCode = "simulatedStocks/myPortfolio/queryEntrust/hisDeal", 
		_pageId = "#simulatedStocks_myPortfolio_queryEntrust_hisDeal ";
	
	//页面公共JS
	var pageCommon = require("pageCommon");
	
	//插件
	var dateUtils = require("dateUtils");
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null,"_init":false}; //上下滑动
	//全局变量
	var portfolio_id = null; //组合id
	//入参
	var curpage = 1;
	var numPerPage = 5;
	var totalPage=1;
	var totalRows = 0;
	var num = 0;
	//全局变量
	var portfolio_id = null;
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
		$(_pageId+" #begin_time").val(getDate(30));
		$(_pageId+" #end_time").val(new Date().format("yyyyMMdd"));
		account_id = appUtils.getSStorageInfo("account_id");
		if(isFirstShow){
			 destoryFunc();
			//查询历史成交
				getHisDeal();
			 isFirstShow=false;
		 }
		
		//日期时间输入点击调用日期组件，第一次点击不会触发效果，所以在init里面先初始化一次。
		dateUtils.initDateUI("simulatedStocks_myPortfolio_queryEntrust_hisDeal",{"dateFormat":"yyyymmdd"});
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
			appUtils.pageInit(pageCode,"simulatedStocks/myPortfolio/queryEntrust/queryEntrustIndex");
			if(!isFirstShow){
				isFirstShow = true;
				//同步点击最新问答的返回
				$(" #ytgMatch_simulatedStocks_myPortfolio_queryEntrust_hisEntrust " +".icon_back").trigger("mousedown");
			}
		});
		
		//历史委托
		appUtils.bindEvent($(_pageId + "#hisEntrust"), function(e) {
			appUtils.clearSStorage("decounts");
			appUtils.setSStorageInfo("decounts",decount);
			appUtils.pageInit(pageCode,"simulatedStocks/myPortfolio/queryEntrust/hisEntrust");
		});
		
		//查询按钮
		appUtils.bindEvent($(_pageId+" #clickQuery"), function(e){
			curpage = 1;		//当前页数
			totalPage=1;		//后台返回的总页数
			totalRows = 0;//总条数
			num = 0;
			$(_pageId +" #entrust_list").html("");
			getHisDeal("html");
			e.stopPropagation();
		},"click");
	}
	
	//***************************【初始化方法】***********************************//
	
	//设置查询的开始日期
	function getDate(sum){
		var now = new Date();
		now.setDate(now.getDate()-sum);
		var year = now.getFullYear();       //年
		var month = now.getMonth() + 1;     //月
		var day = now.getDate();            //日
		var clock = year+"";
		if(month < 10)
		  clock += "0";
		  clock += month;
		if(day < 10)
		  clock += "0";  
		  clock += day;
		return(clock); 
	}
	
	/**
	 * 历史成交
	 * */
	function getHisDeal(insertType){
		 decount++;
		    var type;
	    	if(decount>1){
	    		type=false;
	    	}else{
	    	  type=true;	
	    	}
		insertType =  typeof insertType == "undefined" || insertType == "" || insertType == null ? "html":insertType;
		var begin_time = $(_pageId+" #begin_time").val();
		var end_time = $(_pageId+" #end_time").val();
		var param = {
				"account_id" : account_id,
				"startDate" : begin_time,
				"endDate" : end_time,
				"curPage" : curpage,
				"numPerPage" : numPerPage
		};
		ytgMatchService.queryHisDeal(param,function callBack(resultVo){
			if(Number(resultVo.error_no) == 0){
				//layerUtils.iMsg(0,"历史成交查询成功");
				showEntrustCallback(resultVo,insertType);
				//var result = resultVo.results[0].data;
				//fillEntrustData(result);
			}
			else if(resultVo.error_no == '-40115502'){
				//没有数据
				var height = $(window).height() - $(_pageId +" .header").height()-$(_pageId+" .top_nav").height()-$(_pageId+" .history_order").height();
				$(_pageId + ".entrust_list").html("");
				var noDataHtml = '<div  style="height:'+height+'px; font-size:16px; color:#9999B1; background-color:#FFFFFF; text-align:center; padding-top:150px">暂无历史成交记录</div>';
				$(_pageId + ".entrust_list").append(noDataHtml);
				initVIScroll(num);
			}
			else{
				layerUtils.iAlert("历史成交查询失败:"+resultVo.error_info,-1);
			}
		},{isShowWait:type});
	}
	
	/**
	 * 委托查询回调
	 */
	function showEntrustCallback(data,insertType){
		if (typeof(data) != "undefined" && data != null) {
			if(data.error_no == 0)
			{
				num = data.results[0].data.length;
				var results = data.results[0].data;
				totalPage=data.results[0].totalPages;	//数据的总页数
				curpage=data.results[0].currentPage;	//数据的当前页数
				totalRows = data.results[0].totalRows;
				if(results != "undefined" && results != null && results != "" && results.length > 0){
					var dataTable = "";
					for (var i=0;i<results.length;i++){
						dataTable += queryEntrustHTML(results[i]);
					}
					switch(insertType){
						case "html":$(_pageId+" .entrust_list").html(dataTable);
									break;
						case "append":$(_pageId +" .entrust_list").append(dataTable);
									  break;
						case "prepend":$(_pageId +" .entrust_list").prepend(dataTable);
									   break;
						default:$(_pageId +" #tableComm").html(dataTable);
					}
					initVIScroll(num);
				}
			}
		}
	}
	
	/**
	 * 委托查询HTML生成
	 */
	function queryEntrustHTML(result){
		var html = "";
		var trade_type = '';
		if(result.trade_type == 0)
			trade_type = '<h3 class="ared">买入</h3>';
		else
			trade_type = '<h3 class="agreen">卖出</h3>';
		html += '<div class="item_box">';
		html += '<div class="li_tit"><span class="time">'+result.deal_time+'</span>'+trade_type+'</div>';
		html += '<div class="box_list clearfix">';
		html += '<h4>'+result.stock_name+'<span>'+result.stock_code+'</span></h4>';
		html += '<ul>';
		html += '<li><span>委托编号</span>'+result.order_srlnum+'</li>';
		//html += '<li><span>状态说明</span>部分成交</li>';
		html += '<li><span>成交数量</span>'+result.exec_qty+'</li>';
		html += '<li><span>成交价格</span>'+(result.exec_price*1).toFixed(2)+'</li>';
		html += '<li><span>成交金额</span>'+result.bargain_balance+'</li>';
		//html += '<li><span>委托数量</span>1500</li>';
		html += '</ul>';
		html += '</div>';
		html += '</div>';
		return html;
	}
	
	/**
	 * 初始化上下滑动组件 
	 */
	function initVIScroll(num){
		if(!vIscroll._init){
			var config = {
					"isPagingType": false,		//false表示是微博那种累加形式，true表示分页形式
					"visibleHeight": $(window).height() - $(_pageId +" .header").height()-$(_pageId+" .top_nav").height()-$(_pageId+" .history_order").height()-4,//显示内容区域的高度，当isPaingType为false时传
					"container": $(_pageId+" #v_container_funds"),
					"wrapper":$(_pageId+" #v_wrapper_funds"),	
					"downHandle": function() {				//下拉获取上一页数据方法
						curpage = 1;						//上拉将当前页数设置为1
						//查询数据
						getHisDeal("html");//查询委托数据
					},
					"upHandle": function() {				//上拉获取下一页数据方法
						if(curpage < totalPage)				//判断当前页数是不是小于总页数
						{
							curpage++;
							getHisDeal("append");//查询委托数据
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
			if(curpage == 1){
				if(num < numPerPage || num==totalRows){
					$(_pageId+" .visc_pullUp").hide();
				}else{
					$(_pageId+" .visc_pullUp").show();
				}
			}else{
				if(num < numPerPage || (num == numPerPage && curpage == totalPage)){
					$(_pageId+" .visc_pullUp").hide();
				}else{
					$(_pageId+" .visc_pullUp").show();
				}
			}

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
		$(_pageId +" .entrust_list").html("");
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

	var userSpace_myPortfolio_queryEntrust_hisDeal = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = userSpace_myPortfolio_queryEntrust_hisDeal;
});