/**
 * 卖出股票
 */
define("ytg/scripts/userSpace/myPortfolio/sellStock", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
        validator = require("validatorUtil"),
        portfolioService = require("portfolioService"),
		
		pageCode = "userSpace/myPortfolio/sellStock", 
		_pageId = "#userSpace_myPortfolio_sellStock ";
	
	//页面公共JS
	var pageCommon = require("pageCommon");
	var positionHeight = 0; //持仓高度
	var portfolio_id = null; //组合id,页面传参
	var portfolio_name = null; //组合名称
	var price_step = 0.01;//买卖股票时候的价格的变化的步长
	var obj = {}; //记录持仓股票与对应可买数量
	
	
	//入参
	var stock_code = '';
	var stock_name = '';
	var market_id = '';
	
	/**
	 * 初始化
	 */
	function init() {
		user_id = appUtils.getSStorageInfo('userId',true);
		/*if(user_id==null||""==user_id||undefined==user_id){
	    	layerUtils.iAlert("您尚未登录！",-1);
			appUtils.pageInit(pageCode,"index");
		}*/
		user_type = appUtils.getSStorageInfo('userType',true);
		portfolio_id = appUtils.getSStorageInfo("portfolioId");
		//设置标题
		portfolio_name = appUtils.getSStorageInfo("portfolioName");
		$(_pageId + ".header_inner h1").html(portfolio_name);
		//设置输入框的长度
		$(_pageId + "#stockCode").attr("maxlength","6");
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
			appUtils.pageInit(pageCode,"userSpace/myPortfolio/myPortfolio");
		});
		
		//头部导航栏(持仓;买入;卖出;撤单;查询)
		appUtils.bindEvent($(_pageId + ".top_nav .row-1"), function(e) {
			var index = $(this).index();
			if(index == 0){
				appUtils.pageInit(pageCode,"userSpace/myPortfolio/portfolioDetail");
			}
			else if(index ==1){
				appUtils.pageInit(pageCode,"userSpace/myPortfolio/buyStock");
			}
			else if(index ==2 ){
				//appUtils.pageInit(pageCode,"userSpace/myPortfolio/sellStock");
			}
			else if(index ==3){
				appUtils.pageInit(pageCode,"userSpace/myPortfolio/cancelEntrust");
			}
			else if(index ==4){
				appUtils.pageInit(pageCode,"userSpace/myPortfolio/queryEntrust/queryEntrustIndex");
			}
		});
		
		//股票输入
		appUtils.bindEvent($(_pageId + "#stockCode"), function(e) {
			stock_code = $(this).val();
			if(stock_code != ""){
				if(stock_code.length == 6){
					$(_pageId + '#autoSotck').hide();
					//查询股票信息
					queryStockInfo();
				}
				else{
					resetValue(1);//重置表单
					stockAutoInput();
				}
			}
			else
				$(_pageId + '#autoSotck').hide();
				
		},"input");
		//点击弹出其他地方关闭股票代码
		$(document).click(function(event){
		    var _con = $(_pageId+"#autoSotck");
		    if(!_con.is(event.target)  && (_con.has(event.target).length ===0)){
		    	$(_pageId + "#autoSotck").hide();
		    }
		});
		
		//五档价格点击输入
		appUtils.bindEvent($(_pageId + ".trading_table ul li span:nth-child(2)"), function(e){
			$(this).parent().parent().parent().parent().find("a").removeClass("act");
			$(this).parent().addClass("act");
			var price = $(this).html();
			$(_pageId + "#price").val(price);
		});
		
		//增加价格(+号)
		appUtils.bindEvent($(_pageId+".add_btn"),function(e){
			var curPrice = Number($(_pageId+"#price").val());
			if(curPrice != "" && curPrice != null && curPrice != undefined){
				if(curPrice >= 0&&curPrice<999999999)
				{
					curPrice = (curPrice+ price_step).toFixed(2);
				}	
				$(_pageId+"#price ").val(curPrice);
			}
		},"touchstart");
		
		//减少价格(-号)
		appUtils.bindEvent($(_pageId+".less_btn"),function(e){
			var curPrice = Number($(_pageId+"#price").val());
			if(curPrice == "" || curPrice == undefined || curPrice == null){
				return false;
			}
			if(curPrice - price_step >= 0)
			{
				curPrice = (curPrice- price_step).toFixed(2);
			}	
			$(_pageId+"#price").val(curPrice);
		},"touchstart");
		
		//输入卖出数量，显示市值
		appUtils.bindEvent($(_pageId + "#amount"), function(e){
			var amount = $(_pageId + "#amount").val();
			if(amount != undefined && amount != null && amount != ""){
				if(Number(amount) == 0){
					
				}
				else{
					var price = $(_pageId + "#price").val();
					var shizhi = (Number(price)*Number(amount)).toFixed(2);
					$(_pageId + "#shizhi").show();
					$(_pageId + "#shizhi").html("市值:"+shizhi);
				}
			}
			else{
				$(_pageId + "#shizhi").hide();
			}
		},"input");
		
		//点击持仓股票,关联买入股票信息
		appUtils.preBindEvent($(_pageId + ".lower_table"),"tr:not(:nth-child(1))", function(e){
			stock_code = $(this).attr("id");
			if(stock_code != null && stock_code != ""){
				queryStockInfo();
			}
		},"click");
		
		//卖出
		appUtils.bindEvent($(_pageId + ".login_btn"), function(e) {
			entrustStock();//委托下单
		});
	}
	
	//***************************【绑定事件方法】***********************************//
	
	//***************************【初始化方法】***********************************//
	
	/**
	 * 查询组合持仓
	 * */
	function getPosition(){
		var param = {
				"account_id" : portfolio_id,
				"curPage" : 1,
				"numPerPage" : 100
		};
		portfolioService.queryProtfolioHoldStock(param,function callBack(resultVo){
			if(Number(resultVo.error_no) == 0){
				var result = resultVo.results[0].data;
				
				//将持仓的股票代码记录下来
				if(result != null && result != ""){
					for(var i = 0;i<result.length;i++){
						obj[result[i].stock_code] = result[i].usable_qty;
					}
				}
				fillPositionData(result); //将组合数据填充到页面
				
			//	initVIScroll();
			}
			else if(resultVo.error_no == '-40835102'){
				$(_pageId + "#position").siblings().remove();
				var noDataHtml = '<tr><td colspan="4" style="height:10px; border-bottom:1px dashed #BBBBBB; font-size:0.12rem; color:#9999B1; text-align:center;">暂无持仓</td></tr>';
				$(_pageId + "#position").after(noDataHtml);
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
		$(_pageId + "#position").siblings().remove();
		/*var noDataHtml = '<tr><td colspan="4" style="height:30px; border-bottom:1px dashed #BBBBBB; font-size:12px; color:#9999B1; text-align:center;">暂无持仓</td></tr>';
		if(result == ""){
			$(_pageId + "#position").after(noDataHtml);
			return;
		}*/
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
		$(_pageId + "#position").after(html);
		
		positionHeight = $(_pageId + "#positionBox").height();
	}
	
//	/**
//	 * 初始化上下滑动组件 
//	 */
//	function initVIScroll(){
//		positionHeight= $(window).height() - $(_pageId +" .header").height()-$(_pageId+" .top_nav").height() -$(_pageId + ".stock_box_list").height()-10;
////      //显示内容区域的高度，当isPaingType为false时传
//		if(!vIscroll._init){
//			var config = {
//					"isPagingType": false,		//false表示是微博那种累加形式，true表示分页形式
////					"visibleHeight": $(window).height() - $(_pageId +" .header").height()-$(_pageId+" .top_nav").height()
////					                  -$(_pageId + ".stock_box_list").height(),//显示内容区域的高度，当isPaingType为false时传
//					"visibleHeight" : positionHeight,
//					"container": $(_pageId+" #v_container_position"),
//					"wrapper":$(_pageId+" #v_wrapper_position"),	
//					"downHandle": function() {				//下拉获取上一页数据方法
//						//查询数据
//						getPosition();
//					},
//					"upHandle": function() {				//上拉获取下一页数据方法
//						
//					},
//					"wrapperObj": null
//			};
//			vIscroll.scroll = new VIscroll(config); 	//初始化，需要做if(!hIscroll._init)判断
//			vIscroll._init = true; 	//尽量只初始化一次，保持性能
//			$(_pageId + " .visc_pullUp").hide();
//		} else {
//			vIscroll.scroll.refresh();
//		}
//	}
//	
	/**
	 * 股票自动补全输入
	 * */
	function stockAutoInput(){
		var param = {
				"stock_code" : stock_code,
				"limit" :5
		};
		var reqParamVo = {
				"isShowWait" : false
		};
		portfolioService.stockAutoInput(param,function callBack(resultVo){
			if(Number(resultVo.error_no) == 0){
				$(_pageId + "#stockName").html("");
				//layerUtils.iMsg(0,"股票自动补全输入成功");
				var result = resultVo.results;
				if(result != null && result != ""){
					$(_pageId + '#autoSotck').show();
					$(_pageId + '#autoSotck').html("");
					var html = '';
					for(var  i=0; i<result.length; i++){
						html  += '<li id="'+result[i].stock_code+'"><a href="javascript:void(0)">'+result[i].stock_code+'<span>'+result[i].stock_name+'</span></a></li>';
					}
					$(_pageId + '#autoSotck').append(html);
					
					//点击股票,查询股票详情,填充数据（绑定事件）
					appUtils.bindEvent($(_pageId + "#autoSotck li"), function(e) {
						stock_code = $(this).attr("id"); //获股票代码
						queryStockInfo();
						$(_pageId + '#autoSotck').hide();
					});
				}
			}
			else{
				layerUtils.iAlert("股票自动补全输入失败:"+resultVo.error_info,-1);
			}
		},reqParamVo);
	}
	
	/**
	 * 查询股票信息
	 * */
	function queryStockInfo(){
		var param = {
				"stock_code" : stock_code
		};
		portfolioService.queryStockInfo(param,function callBack(resultVo){
			if(Number(resultVo.error_no) == 0){
				//layerUtils.iMsg(0,"股票信息查询成功");
				var result = resultVo.results[0];
				stock_name = result.stock_name; //获取股票名称
				market_id = result.market_id; //获取股票市场代码
				fillStockInfo(result);
			}
			else{
				layerUtils.iAlert("股票信息查询失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	//将股票信息填充到页面
	function fillStockInfo(result){
		$(_pageId + "#stockCode").val(result.stock_code);
		$(_pageId + "#stockName").html(result.stock_name);
		$(_pageId + "#up_limit").html(Number(result.up_limit).toFixed(2));
		$(_pageId + "#down_limit").html(Number(result.down_limit).toFixed(2));
		$(_pageId + "#price").val(Number(result.price).toFixed(2));
		$(_pageId + "#amount").val("");
		
		//查询是否持仓是否有该股票,并填充可买数量
		getMaxSell(result.stock_code);
		
	    //买卖五档
		$(_pageId+"#mrjg1").text(Number(result.mrjg1).toFixed(2));
		$(_pageId+"#mrjg2").text(Number(result.mrjg2).toFixed(2));
		$(_pageId+"#mrjg3").text(Number(result.mrjg3).toFixed(2));
		$(_pageId+"#mrjg4").text(Number(result.mrjg4).toFixed(2));
		$(_pageId+"#mrjg5").text(Number(result.mrjg5).toFixed(2));
		$(_pageId+"#mcjg1").text(Number(result.mcjg1).toFixed(2));
		$(_pageId+"#mcjg2").text(Number(result.mcjg2).toFixed(2));
		$(_pageId+"#mcjg3").text(Number(result.mcjg3).toFixed(2));
		$(_pageId+"#mcjg4").text(Number(result.mcjg4).toFixed(2));
		$(_pageId+"#mcjg5").text(Number(result.mcjg5).toFixed(2));
		$(_pageId+"#mrsl1").text(result.mrsl1);
		$(_pageId+"#mrsl2").text(result.mrsl2);
		$(_pageId+"#mrsl3").text(result.mrsl3);
		$(_pageId+"#mrsl4").text(result.mrsl4);
		$(_pageId+"#mrsl5").text(result.mrsl5);
		$(_pageId+"#mcsl1").text(result.mcsl1);
		$(_pageId+"#mcsl2").text(result.mcsl2);
		$(_pageId+"#mcsl3").text(result.mcsl3);
		$(_pageId+"#mcsl4").text(result.mcsl4);
		$(_pageId+"#mcsl5").text(result.mcsl5);
		setPriceClass($(_pageId+"#mrjg1"),Number(result.mrjg1),Number(result.closeprice));
		setPriceClass($(_pageId+"#mrjg2"),Number(result.mrjg2),Number(result.closeprice));
		setPriceClass($(_pageId+"#mrjg3"),Number(result.mrjg3),Number(result.closeprice));
		setPriceClass($(_pageId+"#mrjg4"),Number(result.mrjg4),Number(result.closeprice));
		setPriceClass($(_pageId+"#mrjg5"),Number(result.mrjg5),Number(result.closeprice));
		setPriceClass($(_pageId+"#mcjg1"),Number(result.mcjg1),Number(result.closeprice));
		setPriceClass($(_pageId+"#mcjg2"),Number(result.mcjg2),Number(result.closeprice));
		setPriceClass($(_pageId+"#mcjg3"),Number(result.mcjg3),Number(result.closeprice));
		setPriceClass($(_pageId+"#mcjg4"),Number(result.mcjg4),Number(result.closeprice));
		setPriceClass($(_pageId+"#mcjg5"),Number(result.mcjg5),Number(result.closeprice));
	}
	
	//查询是否持仓是否有该股票,并填充可买数量
	function getMaxSell(stock_code){
		var maxSell = obj[stock_code];
		if(maxSell != undefined && maxSell != null && maxSell != ""){
			$(_pageId + "#maxSell").html(maxSell);
		}
	}
	
	//设置五档价格样式
	function setPriceClass(elem,price,closeprice){
		if(price >= closeprice){
			elem.addClass("ared");
		}
		else
			elem.addClass("agreen");
	}
	
	/**
	 * 股票买卖委托下单（普通）
	 * */
	function entrustStock(){
		if(stock_code.length != 6){
			layerUtils.iAlert("请输入正确的股票代码");
			return false;
		}
		if(!validator.isNumeric(stock_code)){
			layerUtils.iAlert("请输入正确的股票代码");
			return false;
		}
		
		//验证价格
		var now_price = $(_pageId+"#price ").val();
		if (now_price.substring(now_price.length-1,now_price.length) == "."){
			now_price = now_price.substring(0,now_price.length-1);
			//去掉小数点
			$(_pageId+"#price").val(now_price);
		}
		now_price = Number($(_pageId+"#price ").val());
		
		if(now_price.length == 0)
		{
			layerUtils.iAlert("请输入正确的价格");
			return false;
		}
		if((!validator.isNumberFloat(now_price)) || parseFloat(now_price) <= 0)
		{
			layerUtils.iAlert("请输入正确的价格");
			return false;
		}
		var up_stop = Number($(_pageId + " #up_limit").html());
		var down_stop = Number($(_pageId + " #down_limit").html());
		if(now_price > up_stop){
			layerUtils.iAlert("委托价格超出涨停价格"+up_stop+"！");
			return false;
		}
		if(now_price < down_stop){
			layerUtils.iAlert("委托价格超出跌停价格"+down_stop+"！");
			return false;
		}
		
		var amount = $(_pageId + "#amount").val();
		if(amount.length==0)
		{
			layerUtils.iAlert("请输入委托数量");
			return false;
		}
		if(!validator.isNumeric(amount)||amount <= 0)
		{
			layerUtils.iAlert("输入的委托数量无效");
			return false;
		}
		amount = Number(amount);
		
		//获取最大可卖数据
		var tradingVolume =  $(_pageId+"#maxSell").html();;
		//没有购买数量
		if(tradingVolume == "--"){
			layerUtils.iAlert("可卖数量不足");
			return false;
		}
		//购买数量大于最大可卖数量
		if(amount > tradingVolume){
			layerUtils.iAlert("可卖数量不足");
			return false;
		}
		//购买数量必须是100的整数倍
		if(tradingVolume != amount && amount % 100 != 0 ){
			layerUtils.iAlert("非平仓卖出数量必须为100股整数倍");
			return false;
		}
		
		var btn = "卖出";
		var tipStr ="<h2 style=\"padding:5px 0;border-bottom: 1px solid #AAA;\">委托买卖</h2>";
		tipStr+="<dl><dt  style=\"text-align: center; margin-top: 10px;\">您是否确认下单？</dt>";
		tipStr+="<div  style=\"text-align: left;padding-left: 35%;\">";
		tipStr+= stock_name+" "+stock_code;
		tipStr+="<br>买卖方向："+btn;
		tipStr+="<br>委托价格："+(now_price).toFixed(2);
		tipStr+="<br>委托数量："+amount;
		tipStr+="</div>";
		tipStr+="</dl>";
		layerUtils.iConfirm(tipStr, null, function success(){	
			doneEntrust();//确认下单		
		}, "取消", "确定");
		$("#pop_tip_confirm").find("p").css("padding","5px");//修改提示框的边框高度
		
	}
	
	//确认下单
	function doneEntrust(){
		var price = $(_pageId+"#price ").val();
		var amount = $(_pageId + "#amount").val();
		var trade_type = 1;
		var order_remark = '';
		var param = {
				"account_id" : portfolio_id,
				"market" : market_id,
				"stkcode" : stock_code,
				"stockName" : stock_name,
				"price" : price,
				"amount" : amount,
				"trade_type" : trade_type,
				"order_remark" : order_remark
		};
		portfolioService.entrustStock(param,function callBack(resultVo){
			if(Number(resultVo.error_no) == 0){
				layerUtils.iMsg(0,"委托下单成功");
				stock_code = '';
			    appUtils.pageInit(pageCode,pageCode);
			}
			else{
				layerUtils.iAlert("委托下单失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	/**
	 * 重置表单
	 * */
	function resetValue(type){
		//重置表单
		//$(_pageId).find("input").val("");
		if(type == 0){
			$(_pageId + "#stockCode").val("");
		}
		$(_pageId + "#stockName").html("");
		$(_pageId + "#price").val("");
		$(_pageId + "#amount").val("");
		$(_pageId + ".tips_box em").html("--"); //涨跌停
		$(_pageId + ".tips_box i").html("--"); //可买
		$(_pageId + ".trading_table ul li span:not(:first-child)").html("--"); //买卖五档
		$(_pageId+".trading_table ul li span[id*=mrjg]").removeClass("ared").removeClass("agreen");
		$(_pageId+".trading_table ul li span[id*=mcjg]").removeClass("ared").removeClass("agreen");
		$(_pageId+".trading_table ul li a").removeClass("act");
		$(_pageId + '#autoSotck').hide(); //股票智能补全 隐藏
		$(_pageId + "#shizhi").hide(); //市值提示 隐藏
	}
	
	
	//*********************************************************************//
	
	/**
	 * 销毁
	 */
	function destroy() {
		//重置页面的所有输入值
		appUtils.pageResetValue();
		resetValue(0);
		//隐藏菜单以及遮罩层
		pageCommon.hideHeaderMenuFunc(_pageId);
	}

	var userSpace_myPortfolio_sellStock = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = userSpace_myPortfolio_sellStock;
});