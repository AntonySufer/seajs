/**
 * 收益最高组合
 * 测试微博滑动组件,预绑定事件无效
 */
define("ytg/scripts/demo/Scroll/shouyiMax", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
        portfolioService=require("portfolioService"),
		pageCode = "demo/Scroll/shouyiMax", 
		_pageId = "#demo_Scroll_shouyiMax ";
		
	var portfolio_index = require("ytg/scripts/portfolio/index");
	
	//滑动插件
	var VIscroll = require("vIscroll");
	//上下滑动
	var vIscroll = {"scroll":null,"_init":false,"curPage":1,
			            "totalPages":1,"totalRows":0,"numPerPage":10,"num":0};
	var isFirstScroll = true;
	var isFirstShow = true;
	
	//全局变量
	var user_id = null;
	var type=6;
	
	/**
	 * 初始化
	 */
	function init() {
		user_id = appUtils.getSStorageInfo("userId",true);
		commonRanks(type);
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent() {
		//头部返回
		appUtils.bindEvent($(_pageId + ".icon_back"), function() {
			appUtils.pageBack();
		});
		
		/**  **********************  预绑定事件 *************************** */
		//进入组合详情
		appUtils.preBindEvent($(_pageId +" .my_page"), "li",function(e){
			alert('组合');
			var portfolio_id = $(this).attr("id");
			appUtils.pageInit(pageCode, "portfolio/portfolioDetail",{'portfolio_id':portfolio_id});
		});
		
		//关注组合
		appUtils.preBindEvent($(_pageId + "#portfolioList"),"li .attention_btn", function(e){
			alert('关注');
			var portfolio_id = $(this).parent().attr("id");
			var sub_type = "";
			if($(this).hasClass('attention_btn2'))
				sub_type = 0;
			else 
				sub_type = 1;
			//关注或者取消关注组合
			portfolio_index.subOrCancelPort(user_id,portfolio_id,sub_type,$(this));
			e.stopPropagation();
		});
	}
	
	//***************************【函数方法】***********************************//

	
	/**
	 * 查询收益最高[普通组合排行]
	 * */
	function commonRanks(type,insertType)
	{
		insertType =  typeof insertType == "undefined" || insertType == "" || insertType == null ? "html":insertType;
		var param={
				"type":type,
				"curPage" : vIscroll.curPage,
				"numPerPage" : vIscroll.numPerPage,
				'customer_id' : user_id
				
		};
		portfolioService.commonRanks(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				var result = resultVo.results;
				fillPortfolioData(result,insertType);
				
				vIscroll.totalPages = result[0].total_page;//总页数
				vIscroll.curPage = result[0].cur_page;//当前页
				vIscroll.totalRows = result[0].total_rows;
				vIscroll.num = result.length;
				initVIScroll(vIscroll.num);
				isFirstScroll = false;
			}
			else if(resultVo.error_no == '-40833102'){
				//无数据
			}
			else{
				layerUtils.iAlert("组合列表加载失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	//填充组合数据
	function fillPortfolioData(result,insertType){
		if(insertType == 'html'){
			$(_pageId + "#portfolioList").empty();
		}
		$(result).each(function(i) {
			var str='<li id="'+this.portfolio_id+'"><a href="javascript:void(0)"><div class="li_det"><div class="ring"><strong>'
				+(this.total_yield*100).toFixed(2)+'<i>%</i></strong><p>总收益</p>'
				+'</div><div class="list_info">'
   				+'<div class="mes_box"><h4>'
   				+this.portfolio_name+'</h4>'
   				+'<p><span class="user">'+this.invest_name+'</span>'+this.sub_num+'人关注</p>'
   				+'</div></div></div></a>';
			if(this.sub_status == 'no')
				str += '<a href="javascript:void(0)" class="attention_btn"></a></li>';
			else
				str += '<a href="javascript:void(0)" class="attention_btn attention_btn2"></a></li>';
			$(_pageId + "#portfolioList").append(str);
		});
		
		appUtils.bindEvent($(_pageId +" #portfolioList li "),function(e){
			alert('组合');
			var portfolio_id = $(this).attr("id");
			appUtils.pageInit(pageCode, "portfolio/portfolioDetail",{'portfolio_id':portfolio_id});
		});
	}
	
	/**
	 * 初始化上下滑动组件 
	 */
	function initVIScroll(num){
		if(!vIscroll._init){
			var config = {
					"isPagingType": false,		//false表示是微博那种累加形式，true表示分页形式 
					//显示内容区域的高度，当isPaingType为false时传
					"visibleHeight": $(window).height() - $(_pageId + "#header").height()-5,
					"container": $(_pageId+" #v_container"),
					"wrapper":$(_pageId+" #v_wrapper"),	
					"downHandle": function() {				//下拉获取上一页数据方法
						vIscroll.curPage = 1;						//上拉将当前页数设置为1
						//查询数据
						commonRanks(type,'html');
					},
					"upHandle": function() {				//上拉获取下一页数据方法
						if(vIscroll.curPage < vIscroll.totalPages)				//判断当前页数是不是小于总页数
						{
							vIscroll.curPage++;
							commonRanks(type,'append');
						}
					},
					"wrapperObj": null
			};
			vIscroll.scroll = new VIscroll(config); 	//初始化，需要做if(!hIscroll._init)判断
			vIscroll._init = true; 						//尽量只初始化一次，保持性能
			if(num < vIscroll.numPerPage || num== vIscroll.totalRows){
				$(_pageId + " #v_wrapper .visc_pullUp").hide();
			}
		} else {
			vIscroll.scroll.refresh();
			if(vIscroll.curPage == 1){
				if(num < vIscroll.numPerPage || num== vIscroll.totalRows){					
					$(_pageId+" #v_wrapper .visc_pullUp").hide();
				}else{
					$(_pageId+" #v_wrapper .visc_pullUp").show();
				}
			}else{
				if(num < vIscroll.numPerPage){					
					$(_pageId+" #v_wrapper .visc_pullUp").hide();
				}else{
					$(_pageId+" #v_wrapper .visc_pullUp").show();
				}
			}
		}
	}
	
	//*********************************************************************//
	
	/**
	 * 销毁
	 */
	function destroy() {
	}

	var demo_Scroll_shouyiMax = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = demo_Scroll_shouyiMax;
});