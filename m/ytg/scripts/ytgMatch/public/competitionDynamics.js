/**
 *  比赛动态
 * @author 余一一
 * @date 2016-03-15
 */
define("ytg/scripts/ytgMatch/public/competitionDynamics", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
		pageCode = "ytgMatch/public/competitionDynamics", 
		ytgMatchService = require("ytgMatchService"),//服务
		_pageId = "#ytgMatch_public_competitionDynamics ";
	
	//插件
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null,"_init":false}; //上下滑动
  //页面公共JS
	var pageCommon = require("pageCommon");
	var num=0;
	var numPerPage=5;
	var curPage=1;
	var act_id ="";
	var account_id ="";
	/**
	 * 初始化
	 */
	function init() {
		
		act_id = appUtils.getSStorageInfo("act_id");//用户id
		queryUserAllMatch();//查询参赛动态
		
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent() {
         
		//头部菜单绑定事件
		pageCommon.headerMenuFunc(_pageId,pageCode);
		//返回
		appUtils.bindEvent($(_pageId + ".back_btn"), function(){
			appUtils.pageBack();
		});
		
	
	}
	//***************************【函数方法】***********************************//
	
	/**
	 * 查询比赛动态
	 */
	function queryUserAllMatch(type){
		
		var param = {
				"act_id":act_id,
				"curPage":curPage,
				"numPerPage":numPerPage,
		};
		//401804
		ytgMatchService.queryRecentTurnover(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				if(resultVo.results != null && resultVo.results.length >0){
					var result = resultVo.results[0].data;
					queryRecentTurnoverCb(result,type);	
					num = result.length*1;
					totalPage=resultVo.results[0].totalPages*1;	//数据的总页数
					curPage=resultVo.results[0].currentPage*1;	//数据的当前页数
					totalRows = resultVo.results[0].totalRows*1;
					initVIScroll(num);//滚动
				}
			}else if(resultVo.error_no == '-40180402'){
				//没有数据
				
				var height = $(window).height() - $(_pageId +" .header").height()-$(_pageId+" .top_nav").height();
				$(_pageId + " #palying_activitys").html("");
				var noDataHtml = '<div  style="height:'+height+'px; font-size:16px; color:#9999B1; background-color:#FFFFFF; text-align:center; padding-top:150px; margin-top: 0.1rem;">暂无成交动态</div>';
				$(_pageId + " #container_playing").append(noDataHtml);
			}else{
				layerUtils.iAlert("比赛动态加载失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	
	/***
	 * 填充动态html
	 */
	function queryRecentTurnoverCb(result,type){
		var html = "";
		if(type !="append"){
			$(_pageId + "#palying_activitys").html(html);
		}
				for(var i = 0;result !=null &&i<result.length;i++){
					var data = result[i];
					var tradeTypeP = "";
					if(data.trade_type == "0"){//交易类型0:买入;1:卖出
						tradeTypeP = "<td class='ared'>建仓</td>";
					} else if(data.trade_type == "1"){
						tradeTypeP = "<td class='agreen'>减仓</td>";
					}
					
					//前后仓位
				  var before_yeled = (Number(data.stock_be_position)*100).toFixed(2);
				  var after_yeled = (Number(data.stock_af_position)*100).toFixed(2);
				  var yeled_html =	before_yeled+"%->"+after_yeled+"%";
			     html += "<div class='dynamic_item'><div class='tit'>"
			          +" <div class='up'><span>"+data.exec_date+"</span><h3>"+data.name+"</h3></div>"
			          +" </div>"
					  +" <div class='item_table'><table class='ui table'>"
				      +" <tr><th>股票名称</th><th>成交价</th><th>操作</th><th>仓位变动</th></tr>"
					  +" <tr><td><h4>"+data.stock_name+"</h4><span>"+data.stock_code+"</span></td><td>"+data.exec_price+"</td>"+tradeTypeP+"<td>"+yeled_html+"</td></tr>"
					  +" </table></div></div> ";
				}
				$(_pageId + "#palying_activitys").append(html);
			
	}
	
	
	/**
	 * 初始化上下滑动组件 
	 */
	function initVIScroll(num){
		if(!vIscroll._init){
			var config = {
					"isPagingType": false,		//false表示是微博那种累加形式，true表示分页形式
					"visibleHeight": $(window).height()-$(_pageId +" .header").height(),//显示内容区域的高度，当isPaingType为false时传
					"container": $(_pageId+" #container_playing"),
					"wrapper":$(_pageId+" #wrapper_playing"),	
					"downHandle": function() {				//下拉获取上一页数据方法
						curPage = 1;						//上拉将当前页数设置为1
						//查询数据
						queryUserAllMatch();
						
					},
					"upHandle": function() {				//上拉获取下一页数据方法
						if(curPage < totalPage)				//判断当前页数是不是小于总页数
						{
							curPage++;
							queryUserAllMatch("append");
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
	
	
	//*********************************************************************//
	
	
	/**
	 * 销毁
	 */
	function destroy() {
		//隐藏菜单以及遮罩层
		pageCommon.hideHeaderMenuFunc(_pageId);
		curPage = 1;		//当前页数
		totalPage=1;		//后台返回的总页数
		totalRows = 0;     //总条数
		num = 0;
		type = "";			//返回类型
		rankingtype=2;
		$(_pageId+"#palying_activity").html("");//数据清空
		
	}

	var competitionDynamics = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = competitionDynamics;
});