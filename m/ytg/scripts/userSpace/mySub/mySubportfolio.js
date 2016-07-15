/**
 * 我的关注
 */
define("ytg/scripts/userSpace/mySub/mySubportfolio", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
        portfolioService = require("portfolioService"),
		pageCode = "userSpace/mySub/mySubportfolio", 
		_pageId = "#userSpace_mySub_mySubportfolio ";
	//页面公共JS
	var pageCommon = require("pageCommon");
	
	//插件
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null,"_init":false}; //上下滑动
	//全局变量
	var user_id = null;
	//入参
	var curPage = 1;
	var numPerPage = 8;
	var totalPage=1;
	var totalRows = 0;
	var num = 0;
	var isFirstShow=true;
	var portcount=0;
	/**
	 * 初始化
	 */
	function init() {
		portcounts=appUtils.getSStorageInfo("portcounts");
		if(portcounts>=1){
			portcount=portcounts;
		}else{
			portcount=0;
		}
		user_id = appUtils.getSStorageInfo("userId",true);
	/*	if(user_id==null||""==user_id||undefined==user_id){
	    	layerUtils.iAlert("您尚未登录！",-1);
			appUtils.pageInit(pageCode,"index");
		}*/
		if(isFirstShow){
			destoryFunc();
			queryMyportfolio();
			isFirstShow = false;
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
			appUtils.clearSStorage("portcounts");
			appUtils.pageInit(pageCode,"userSpace/index");
			if(!isFirstShow){
				isFirstShow = true;
				//同步关注投顾的返回
				$(" #userSpace_mySub_mySubinvest " +".icon_back").trigger("mousedown");
			}
		});
		
		//关注投顾(Tab)
		appUtils.bindEvent($(_pageId + "#mySubinvest"), function() {
			appUtils.pageInit("userSpace/mySub/mySubportfolio", "userSpace/mySub/mySubinvest", {});
		});
		
		/******************* 预绑定事件 **************************/
		//点击组合进去组合详情
		appUtils.preBindEvent($(_pageId +"#portfolioList"),"li",function(e){
			appUtils.setSStorageInfo("portfolio_PageCode",pageCode);
			appUtils.clearSStorage("portcounts");
			appUtils.setSStorageInfo("portcounts",portcount);
			var portfolio_id = $(this).attr("id");
			if(portfolio_id != undefined && portfolio_id != null && portfolio_id != "")
				appUtils.pageInit(pageCode, "portfolio/portfolioDetail", {"portfolio_id" : portfolio_id});
		},"click");
		
		//关注 /取消 关注组合
		appUtils.preBindEvent($(_pageId +"#portfolioList"),"li .attention_btn",function(e){
			var portfolio_id = $(this).parent().parent().attr("id");
			var sub_type = "";
			if($(this).hasClass('attention_btn2'))
				sub_type = 0;
			else 
				sub_type = 1;
			//关注或者取消关注组合
			subOrCancelPort(portfolio_id,sub_type,$(this));
			//阻止事件冒泡
			if (e.stopPropagation) {
                e.stopPropagation();
                return ;
            }
            e.cancelBubble = true;
            return ;
		},"click");
		
	}
	
	//***************************【函数方法】***********************************//
	/**
	 * 查询我的组合
	 * */
	function queryMyportfolio(insertType)
	{
		portcount++;
		var type;
    	if(portcount>1){
    		type=false;
    	}else{
    	  type=true;	
    	}
		insertType =  typeof insertType == "undefined" || insertType == "" || insertType == null ? "html":insertType;
		var param={
				"curPage" : curPage,
				"numPerPage" : numPerPage,
				"user_id":user_id
		};
		portfolioService.queryPortfolioData(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				var result = resultVo.results;
				fillPortfolioData(result,insertType);
			
				
				num = result.length;
				totalPage=result[0].total_page;	//数据的总页数
				curPage=result[0].cur_page;	//数据的当前页数
				totalRows = result[0].total_rows;
				initVIScroll(num);
			}
			else if(resultVo.error_no == '-40832302'){
				 var height = $(window).height()-$(_pageId + ".header").height();
				 var html = '<li style="height:'+height+'px; font-size:16px; color:#9999B1; text-align:center; padding-top:150px;">您暂无关注的组合</li>';
				 $(_pageId + "#portfolioList").html("");
				 $(_pageId + "#portfolioList").append(html);
				 initVIScroll(num);
			}
			else{
				layerUtils.iAlert("查询我关注的组合失败:"+resultVo.error_info,-1);
			}
		},{isShowWait:type});
	}
	
	
	//填充热门组合数据
	function fillPortfolioData(result,insertType){
		if(insertType == 'html'){
			$(_pageId + "#portfolioList").empty();
		}
		$(result).each(function(i) {
			if(this.sub_num>=1){
				sub_num=this.sub_num;
			}else{
				sub_num=0;
			}
			var str='<li id="'+this.portfolio_id+'">'
				+'<div class="ui layout li_det">'
			+'<div class="ring">'
			+'<p>总收益</p>'
				+'<strong>'+(this.total_yield*100).toFixed(2)+'<i>%</i></strong>'
    			+'</div>'
			+'<div class="ui row-1 list_info">'
			+'<div class="label_box">'
   				+'<span class="ui tag">沪深</span>'
   					+'</div>'
   				+'<div class="mes_box">'
   				+'<h4>'+this.portfolio_name+'</h4>'
   					+'<p><span class="user">'+this.user_name+' </span><i>'+sub_num+'</i>人关注</p>'
   					+'</div>'
   				+'</div>';
			if(this.sub_status == 'no')
				str += '<a href="javascript:void(0)" class="attention_btn attention_btn2" id="gz">已关注</a>'
					+'</div>'
		            +'</li>';
				
			else 
				str += '<a href="javascript:void(0)" class="attention_btn" id="gz">加关注</a>'
					+'</div>'
		            +'</li>';
			
			$(_pageId + "#portfolioList").append(str);
		});
		
	}
	
	/**
	 * 关注或者取消关注 组合
	 * */
	function subOrCancelPort(portfolio_id,sub_type,elem){
		var param={
				"portfolio_id" : portfolio_id,
				"user_id" : user_id,
				"sub_type":sub_type
		};
		portfolioService.attentionAndCancelPortfolio(param,function callBack(resultVo){
//			var portfolio=$(this).attr("id");
			if(0==Number(resultVo.error_no)){
				if(sub_type == 1){
				elem.addClass("attention_btn2");
				$(_pageId+"#"+portfolio_id+" #gz").html('已关注');
				var focusnum = $(_pageId+"#"+portfolio_id+" .user").next().text();
				$(_pageId+"#"+portfolio_id+" .user").next().html(parseInt(focusnum)+1);
			}
			else{
				elem.removeClass("attention_btn2");
				$(_pageId+"#"+portfolio_id+" #gz").html('加关注');
				var focusnum = $(_pageId+"#"+portfolio_id+" .user").next().text();
				if(focusnum > 0){
					$(_pageId+"#"+portfolio_id+" .user").next().html(parseInt(focusnum)-1);
				}
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
	
	/**
	 * 初始化上下滑动组件 
	 */
	function initVIScroll(num){
		if(!vIscroll._init){
			var config = {
					"isPagingType": false,		//false表示是微博那种累加形式，true表示分页形式
					"visibleHeight": $(window).height()-$(_pageId +" .header").height()-10,//显示内容区域的高度，当isPaingType为false时传
					"container": $(_pageId+" #v_container_mysub"),
					"wrapper":$(_pageId+" #v_wrapper_mysub"),	
					"downHandle": function() {				//下拉获取上一页数据方法
						curPage = 1;						//上拉将当前页数设置为1
						//查询数据
						queryMyportfolio("html");
					},
					"upHandle": function() {				//上拉获取下一页数据方法
						if(curPage < totalPage)				//判断当前页数是不是小于总页数
						{
							curPage++;
							queryMyportfolio("append"); 
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
	}
	function destoryFunc(){
		$(_pageId +" #portfolioList").html("");
		//销毁滑动插件
		if(vIscroll._init == true){
			vIscroll.scroll.destroy(); //销毁
			vIscroll.scroll = null;
			vIscroll._init = false; 
		}
		curPage = 1;
		totalPage = 1;
		totalRows = 0;
		num = 0;
	}

	var userSpace_mySub_mySubportfolio = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = userSpace_mySub_mySubportfolio;
});