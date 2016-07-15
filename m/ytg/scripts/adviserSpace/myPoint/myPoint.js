/**
 * 我的回答
 */
define("ytg/scripts/adviserSpace/myPoint/myPoint", function(require, exports, module){
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
        userService = require("userService"),
		pageCode = "adviserSpace/myPoint/myPoint", 
		_pageId = "#adviserSpace_myPoint_myPoint ";
	//页面公共JS
	var pageCommon = require("pageCommon");
	
	//插件
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null,"_init":false}; //上下滑动
	//全局变量
	var user_id =null;
	//入参
	var curPage = 1;
	var numPerPage = 8;
	var totalPage=1;
	var totalRows = 0;
	var num = 0;
	var count=0;
	var isFirstShow=true;
	 var gconfig = require("gconfig");
	 var domain = gconfig.global.domain;
	
	/**
	 * 初始化
	 */
	function init() {
		counts=appUtils.getSStorageInfo("counts");
		if(counts>1){
			count=counts;
		}else{
			count=0;
		}
		user_id=appUtils.getSStorageInfo("userId",true);
		if(user_id==null||""==user_id||undefined==user_id){
			appUtils.pageInit(pageCode,"account/login");
			return;
		}
		if(isFirstShow){
			destoryFunc();
			querymyPoint();
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
			appUtils.clearSStorage("counts");
			appUtils.pageInit(pageCode, "adviserSpace/index");
			isFirstShow=true;
		});
		
		/** ******************** 预绑定事件 ************************  */
		//进入观点详情
		appUtils.preBindEvent($(_pageId +"#myPointList"), "li",function(){
			appUtils.clearSStorage("counts");
			appUtils.setSStorageInfo("counts",count);
			appUtils.clearSStorage("last_PageCode");
			appUtils.setSStorageInfo("last_PageCode",pageCode);
			var point_id = $(this).attr("id");
			appUtils.pageInit(pageCode, "point/pointDetail", {"view_id":point_id});
		},"click");
		
		//创建观点图标
		appUtils.bindEvent($(_pageId + ".adv_nav_iocn"), function(e) {
			appUtils.pageInit(pageCode, "adviserSpace/myPoint/createPoint");
		});
	}
	
	//***************************【函数方法】***********************************//
	 /**
	  * 查询投顾已发表观点列表
	  */
	function querymyPoint(insertType){
		count++;
		var type;
    	if(count>=1){
    		type=false;
    	}else{
    	  type=true;	
    	}
		insertType =  typeof insertType == "undefined" || insertType == "" || insertType == null ? "html":insertType;
		var param={
				"curPage" : curPage,
				"numPerPage" : numPerPage,
				"invest_id" :user_id
		};
		userService.queryInvestPublishView(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				var result = resultVo.results;
				fillmyPointData(result,insertType);
				
				num = result.length;
				totalPage=result[0].total_page;	//数据的总页数
				curPage=result[0].cur_page;	//数据的当前页数
				totalRows = result[0].total_rows;
				initVIScroll(num);
			}
			else if(resultVo.error_no == '-40813602'){
				 var height = $(window).height()-$(_pageId + ".header").height()-$(_pageId + ".top_nav").height();
				 var html = '<div style="height:'+height+'px; font-size:16px; color:#9999B1; text-align:center; padding-top:150px;">您暂无已发布观点</div>';
				 $(_pageId + "#myPointList").empty();
				 $(_pageId + "#myPointList").append(html);
				 initVIScroll(num);
			}
			else{
				layerUtils.iAlert("投顾已发布观点加载失败:"+resultVo.error_info,-1);
			}
		},{isShowWait:type});
	} 
	
	//填充查询到的数据
	function fillmyPointData(result,insertType){
		if(insertType == 'html'){
			$(_pageId + "#myPointList").html("");
		}
		var html = "";
		for(var i = 0;i<result.length;i++)
		{
			/*html += '<li id="'+result[i].view_id+'"><a href="javascript:void(0)">';
			html += '<div class="sy_list_tit"><div class="tx_box">';
			if(result[i].face_image_small==null || ""==result[i].face_image_small)
				html+='<img src="images/my_tx.png" class="rounded" width="30" /></div>';
			else{
				html+='<img src="'+result[i].face_image_small+'" width="26" class="rounded"/></div>';
			}
			html +='<div class="list_info">';
			html += '<p>'+result[i].invest_name+'</p><span>'+result[i].create_time+'&nbsp;&nbsp;&nbsp;阅读  '+result[i].read_num+'</span></div>';
			html +='<div class="review_iocn"><em></em><p class="text-center">'+result[i].comment_num+'</p></div></div>';
			html +='<div class="sy_list_txt"><p>'+result[i].title+'</p></div></a></li>';*/
			var content=result[i].content;
			  if(content.length>=50){
				  content=content.substring(0,49)+".......";
			  }
			html += '<li id="'+result[i].view_id+'"><div class="ui layout li_tit"><div class="user_pic">';
		    if(result[i].face_image_small==null && result[i].face_image_small==""){
		    	html+='<img src="images/user_pic.png" class="circle" /></div>';
		    }
		    else{
		    	html+=' <img src="'+domain+result[i].face_image_small+'" class="circle" /></div>';
		    }
		    	
		html +='<div class="row-1"><p>'+result[i].invest_name+'</p><span>'+result[i].create_time+'</span></div>';
		html +='<div class="fr_txt"><span>'+ result[i].read_num+'阅读</span></div></div>'+'<div class="li_txt"><p>'+content+'</p></div></li>';
	
		}
		$(_pageId + "#myPointList").append(html);
	}
	
	/**
	 * 初始化上下滑动组件 
	 */
	function initVIScroll(num){
		if(!vIscroll._init){
			var config = {
					"isPagingType": false,		//false表示是微博那种累加形式，true表示分页形式
					"visibleHeight": $(window).height()-$(_pageId +" .header").height()-$(_pageId+" .top_nav").height()-10,//显示内容区域的高度，当isPaingType为false时传
					"container": $(_pageId+" #v_container_div"),
					"wrapper":$(_pageId+" #v_wrapper_div"),	
					"downHandle": function() {				//下拉获取上一页数据方法
						curPage = 1;						//上拉将当前页数设置为1
						//查询数据
						querymyPoint("html");
					},
					"upHandle": function() {				//上拉获取下一页数据方法
						if(curPage < totalPage)				//判断当前页数是不是小于总页数
						{
							curPage++;
							querymyPoint("append"); 
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
		$(_pageId +" #myPointList").html("");
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

	var adviserSpace_myPoint_myPoint = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = adviserSpace_myPoint_myPoint;
});