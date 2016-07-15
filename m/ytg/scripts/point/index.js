/**
 * 观点主页
 */
define("ytg/scripts/point/index", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        pointService=require("pointService"),
	    queryService=require("queryService"),
		pageCode = "point/index", 
		_pageId = "#point_index ";
	
	//页面公共JS
	var pageCommon = require("pageCommon");
	var gconfig = require("gconfig");
	//全局变量
	//插件
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null,"_init":false}; //上下滑动
	//入参
	var curPage = 1;
	var numPerPage = 8;
	var totalPage=1;
	var totalRows = 0;
	var num = 0;
	  var domain = gconfig.global.domain;
	//其他参数
	var isFirstShow = true;
	var pointcount=0;
	/**
	 * 初始化
	 */
	function init(){
		pointcounts=appUtils.getSStorageInfo("pointcounts");
		if(pointcounts>1){
			pointcount=pointcounts;
		}else{
			pointcount=0;
		}
		
		if(isFirstShow){
			destoryFunc();
			//查询最新观点
			queryNewView();
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
			appUtils.clearSStorage("pointcounts");
			appUtils.pageInit(pageCode,"index");
			isFirstShow = true;
		});
	 
		//进入观点详情
		appUtils.preBindEvent($(_pageId +"#pointList"), "li",function(){
			appUtils.clearSStorage("pointcounts");
			appUtils.setSStorageInfo("pointcounts",pointcount);
			appUtils.clearSStorage("last_PageCode");
			appUtils.setSStorageInfo("last_PageCode",pageCode);
			var view_id = $(this).attr("id");
			appUtils.pageInit(pageCode,"point/pointDetail", {'view_id':view_id});
		},"click");
		
		//点击投顾头像进入投顾详情页面
		appUtils.preBindEvent($(_pageId + "#pointList"), "img",function(e) {
			appUtils.setSStorageInfo("invest_PageCode",pageCode);
			var invest_id = $(this).attr("id");
			if(invest_id){
				appUtils.pageInit(pageCode,"adviser/adviserDetail",{'invest_id':invest_id});
			}
			//阻止冒泡  域绑定事件 域绑定下多个绑定有效
			e.stopPropagation();
		},"click");
	
/*		//点击投顾头像进入投顾详情页面
		appUtils.preBindEvent($(_pageId + "#pointList"), ".ui layout li_tit .row-1 p",function(e) {
			appUtils.setSStorageInfo("invest_PageCode",pageCode);
			var invest_id = $(this).attr("id");
			alert(invest_id);
			appUtils.pageInit(pageCode,"adviser/adviserDetail",{'invest_id':invest_id});
			//阻止冒泡  域绑定事件 域绑定下多个绑定有效
			e.stopPropagation();
		},"click");*/
		
        
		
	}
	
	//***************************【函数方法】***********************************//
	    function queryNewView(insertType){
	    	pointcount++;
	    	var type;
	    	if(pointcount>1){
	    		type=false;
	    	}else{
	    	  type=true;	
	    	}
	    	insertType =  typeof insertType == "undefined" || insertType == "" || insertType == null ? "html":insertType;
	    	var param={
	    			"curPage" : curPage,
					"numPerPage" : numPerPage
			};
	    	 pointService.queryPointList(param,function callBack(resultVo){
				if(0==Number(resultVo.error_no)){
					var result = resultVo.results;
					fillPointListData(result,insertType);
					
					num = result.length;
					totalPage=result[0].total_page;	//数据的总页数
					curPage=Number(result[0].cur_page);	//数据的当前页数
					totalRows = result[0].total_rows;
					initVIScroll(num);
				}else if(resultVo.error_no=='-40834202'){
					$(_pageId + "#pointList").empty();
					var noDataHtml = '<div class="no_data_box"><em></em><p>暂无观点</p></div>';
					$(_pageId + "#pointList").append(noDataHtml);
				}else{
					layerUtils.iAlert("热门观点加载失败:"+resultVo.error_info,-1) ;
				}
			},{isShowWait:type});
	    }
	    

	    /**
	     * 热门观点查询后填充绑定数据
	     */
	    function fillPointListData(result,insertType){
	    	if(insertType == 'html'){
	    		$(_pageId + "#pointList").empty();
	    	}
	    	var html = "";
	    	for(var i = 0;i<result.length;i++)
	    	{
	    		html += '<li id="'+result[i].view_id+'"><div class="ui layout li_tit"><div class="user_pic">';
			    if(result[i].face_image_small == ""){
			    	html+='<img src="images/my_tx.png" id='+result[i].invest_id+' class="circle" /></div>';
			    }
			    else{
			    	html+=' <img src="'+domain+result[i].face_image_small+'" id='+result[i].invest_id+' class="circle" /></div>';
			    }
			    	
			html +='<div class="row-1"><p>'+result[i].invest_name+'</p><span>'+result[i].create_time+'</span></div>';
			html +='<div class="fr_txt"><span>'+ result[i].read_num+'阅读</span></div></div>'+'<div class="li_txt"><p>'+ result[i].content+'</p></div></li>';
		
	    	}
	    	$(_pageId + "#pointList").append(html);
	    }
	
	    
		
	    /**
	     * 初始化上下滑动组件 
	     */
	    function initVIScroll(num){
	    	if(!vIscroll._init){
	    		var config = {
	    				"isPagingType": false,		//false表示是微博那种累加形式，true表示分页形式
	    				"visibleHeight": $(window).height()-$(_pageId +" .header").height()-13,//显示内容区域的高度，当isPaingType为false时传
	    				"container": $(_pageId+" #v_container_point"),
	    				"wrapper":$(_pageId+" #v_wrapper_point"),	
	    				"downHandle": function() {				//下拉获取上一页数据方法
	    					curPage = 1;						//上拉将当前页数设置为1
	    					//查询数据
	    					queryNewView("html");
	    				},
	    				"upHandle": function() {				//上拉获取下一页数据方法
	    					if(totalPage > curPage)				//判断当前页数是不是小于总页数
	    					{
	    						
	    						curPage++;
	    						queryNewView("append"); 
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
		$(_pageId + "#pointList").html("");
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

	var point_index = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = point_index;
});