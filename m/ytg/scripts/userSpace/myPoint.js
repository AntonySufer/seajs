/**
 * 我订阅的观点（无）
 */
define("ytg/scripts/userSpace/myPoint", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
        userService=require("userService"),
		pageCode = "userSpace/myPoint",
		_pageId = "#userSpace_myPoint ";
	 var domain = gconfig.global.domain;
	    //全局变量
		var user_id = null;
		//页面公共JS
		var pageCommon = require("pageCommon");
		
		//插件
		var VIscroll = require("vIscroll");
		var vIscroll = {"scroll":null,"_init":false}; //上下滑动
		//入参
		var curPage = 1;
		var numPerPage = 10;
		var totalPage=1;
		var totalRows = 0;
		var num = 0;
		var isFirstShow=true;
		var count=0;
		var gconfig = require("gconfig");
	    var domain = gconfig.global.domain;
	/**
	 * 初始化
	 */
	function init() {
		
		counts=appUtils.getSStorageInfo("counts");
		if(counts>=1){
			count=counts;
		}else{
			count=0;
		}
	    user_id = appUtils.getSStorageInfo("userId",true);
	  /*  if(user_id==null||""==user_id||undefined==user_id){
	    	layerUtils.iAlert("您尚未登录！",-1);
			appUtils.pageInit(pageCode,"index");
		}*/
	    
	    if(isFirstShow){
			 destoryFunc();
				queryPoint();
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
			appUtils.clearSStorage("counts");
			appUtils.pageInit(pageCode,"userSpace/index");
			isFirstShow=true;
		});
		
		// 预绑定组合列表点击进入详情事件(单个)
		appUtils.preBindEvent($(_pageId +"#pointList"), "li",function(){
			appUtils.pageInit("userSpace/mypoint", "详细地址", {});
		});
		
		//进入观点详情
		appUtils.preBindEvent($(_pageId +"#pointList"), "li",function(){
			appUtils.clearSStorage("counts");
			appUtils.setSStorageInfo("counts",count);
			var view_id = $(this).attr("id");
			if(view_id != null && view_id != ""){
				appUtils.clearSStorage("last_PageCode");
				appUtils.setSStorageInfo("last_PageCode",pageCode);
				appUtils.pageInit(pageCode,"point/pointDetail", {'view_id':view_id});
			}
		},"click");
		
		//点击投顾头像进入投顾详情页面
		appUtils.preBindEvent($(_pageId + "#pointList"), "img",function(e) {
			appUtils.setSStorageInfo("invest_PageCode",pageCode);
			appUtils.clearSStorage("counts");
			appUtils.setSStorageInfo("counts",count);
			var invest_id = $(this).attr("id");
			appUtils.pageInit(pageCode,"adviser/adviserDetail",{'invest_id':invest_id});
			//阻止冒泡  域绑定事件 域绑定下多个绑定有效
			e.stopPropagation();
		},"click");
	
		//点击投顾头像进入投顾详情页面
		appUtils.preBindEvent($(_pageId + "#pointList"), ".sy_list_tit .list_info p",function(e) {
			appUtils.setSStorageInfo("invest_PageCode",pageCode);
			appUtils.clearSStorage("counts");
			appUtils.setSStorageInfo("counts",count);
			var invest_id = $(this).attr("id");
			appUtils.pageInit(pageCode,"adviser/adviserDetail",{'invest_id':invest_id});
			//阻止冒泡  域绑定事件 域绑定下多个绑定有效
			e.stopPropagation();
		},"click");
	}
	
	//***************************【函数方法】***********************************//
	   function queryPoint(insertType){
		   count++;
		   var type;
	    	if(count>1){
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
		   userService.queryUserCollectionView(param,function callBack(resultVo){
				if(0==Number(resultVo.error_no)){
					var result = resultVo.results;
					fillPointData(result,insertType);
					
					num = result.length;
					totalPage=result[0].total_page;	//数据的总页数
					curPage=result[0].cur_page;	//数据的当前页数
					totalRows = result[0].total_rows;
					initVIScroll(num);
				}else if(resultVo.error_no=="-40837902"){
					  var height = $(window).height()-$(_pageId + ".header").height();
					  var html = '<li style="height:'+height+'px;font-size:16px;color:#9999B1;text-align:center;padding-top:150px;">您暂无收藏观点</li>';
					  $(_pageId + "#pointList").html("");
					  $(_pageId + "#pointList").append(html);
					  initVIScroll(num);
				}else{
					layerUtils.iAlert("收藏观点数据加载失败"+resultVo.error_info,-1);
				}
			},{isShowWait:type});
	   }
	   
	   //填充数据
	   function fillPointData(result,insertType){
		   if(insertType == 'html'){
			   $(_pageId + "#pointList").html("");
	    	}
		   
			var html = "";
			for(var i = 0;i<result.length;i++)
			{
				/*html += '<li id="'+result[i].view_id+'">';
				html += '<a href="javascript:void(0)">';
				html += '<div class="sy_list_tit"><div class="tx_box">';
				    if(result[i].face_image_small==null||""==result[i].face_image_small)
				    	html+='<img src="images/my_tx.png" class="rounded" width="30" id="'+result[i].invest_id+'" /></div>';
				    	
				    else{
				    	html+='<img src="'+result[i].face_image_small+'" width="30" class="circle" id="'+result[i].invest_id+'"/></div>';
				    }
				    	
				html +='<div class="list_info" ><p id="'+result[i].invest_id+'">'+result[i].invest_name+'</p ><span>'+result[i].create_time+'&nbsp;&nbsp;&nbsp;阅读  '+result[i].read_num+'</span></div><div class="review_iocn">';
				html += '<em></em><p class="text-center">'+result[i].comment_num+'</p></div></div>';
				html +='<div class="sy_list_txt">';
				html += '<p>'+result[i].title+'</p>';
				html +='</div></a></li>';*/
				var content=result[i].content;
				  if(content.length>=50){
					  content=content.substring(0,49)+".......";
				  }
				html += '<li id="'+result[i].view_id+'"><div class="ui layout li_tit"><div class="user_pic">';
				    if(result[i].face_image_small==null || result[i].face_image_small==""){
				    	html+='<img src="images/my_tx.png" class="circle" id="'+result[i].invest_id+'"/></div>';
				    }
				    else{
				    	html+=' <img src="'+domain+result[i].face_image_small+'" class="circle" id="'+result[i].invest_id+'"/></div>';
				    }
				    	
				html +='<div class="row-1"><p>'+result[i].invest_name+'</p><span>'+result[i].create_time+'</span></div>';
				html +='<div class="fr_txt"><span>'+ result[i].read_num+'阅读</span></div></div>'+'<div class="li_txt"><p>'+ content+'</p></div></li>';
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
	    				"visibleHeight": $(window).height()-$(_pageId +" .header").height()-15,//显示内容区域的高度，当isPaingType为false时传
	    				"container": $(_pageId+" #v_container_point"),
	    				"wrapper":$(_pageId+" #v_wrapper_point"),	
	    				"downHandle": function() {				//下拉获取上一页数据方法
	    					curPage = 1;						//上拉将当前页数设置为1
	    					//查询数据
	    					queryPoint("html");
	    				},
	    				"upHandle": function() {				//上拉获取下一页数据方法
	    					if(curPage < totalPage)				//判断当前页数是不是小于总页数
	    					{
	    						curPage++;
	    						queryPoint("append"); 
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
		$(_pageId +" #advisory_list").html("");
		$(_pageId +" #pointList").html("");
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

	var userSpace_myPoint = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = userSpace_myPoint;
});