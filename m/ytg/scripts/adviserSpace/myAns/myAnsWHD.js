/**
 * 我的回答
 */
define("ytg/scripts/adviserSpace/myAns/myAnsWHD", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        userService=require("userService"),
		pageCode = "adviserSpace/myAns/myAnsWHD", 
		_pageId = "#adviserSpace_myAns_myAnsWHD ";
	
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
	var quescount=0;
	var isFirstShow=true;
	
	/**
	 * 初始化
	 */
	function init() {
		quescounts=appUtils.getSStorageInfo("quescounts");
		if(quescounts>1){
			quescount=quescounts;
		}else{
			quescount=0;
		}
		user_id=appUtils.getSStorageInfo("userId",true);
		if(user_id==null||""==user_id||undefined==user_id){
			appUtils.pageInit(pageCode,"account/login");
			return;
		}
		if(isFirstShow){
			destoryFunc();
			querymyAnsWHD();
			isFirstShow = false;
		}
		
		
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent() {
		//头部菜单绑定事件
		pageCommon.headerMenuFunc(_pageId,pageCode);
		
		//已回答（导航）
		appUtils.bindEvent($(_pageId + "#myAns"), function() {
			appUtils.pageInit(pageCode, "adviserSpace/myAns/myAns", {});
		});
		
		//头部返回
		appUtils.bindEvent($(_pageId + ".icon_back"), function(e) {
			appUtils.clearSStorage("quescounts");
			appUtils.pageInit(pageCode, "adviserSpace/index");
			isFirstShow=true;
		});
		
		/** ************************* 预绑定事件  ************************** */
		//进入问答详情
		appUtils.preBindEvent($(_pageId +"#myAnsWHDList"), "li",function(){
			appUtils.clearSStorage("quescounts");
			appUtils.setSStorageInfo("quescounts",quescount);
			var ques_id = $(this).attr("id");
			appUtils.pageInit(pageCode, "ques/quesDetail",{"ques_id":ques_id,"type":"1"});
		},"click");
		
	}
	
	//***************************【函数方法】***********************************//
	 /**
	  * 查询未回答问题列表
	  */
	function querymyAnsWHD(insertType){
		quescount++;
		var type;
    	if(quescount>=1){
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
		userService.queryInvestNotAnsweredList(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				var result = resultVo.results;
				fillmyAnsData(result,insertType);
				
				num = result.length;
				totalPage=result[0].total_page;	//数据的总页数
				curPage=result[0].cur_page;	//数据的当前页数
				totalRows = result[0].total_rows;
				initVIScroll(num);
			}
			else if(resultVo.error_no == '-40813402'){
				 var height = $(window).height()-$(_pageId + ".header").height();
				 var html = '<div style="height:'+height+'px; font-size:16px; color:#9999B1; text-align:center; padding-top:150px">您暂无待回答问题</div>';
				 $(_pageId + "#myAnsWHDList").empty();
				 $(_pageId + "#myAnsWHDList").append(html);
				 initVIScroll(num);
			}
			else{
				layerUtils.iAlert("待回答数据加载失败:"+resultVo.error_info,-1);
			}
		},{isShowWait:type});
	} 
	
	//填充数据 
	function fillmyAnsData(result,insertType){
		if(insertType == 'html'){
			$(_pageId + "#myAnsWHDList").html("");
		}
		var html = "";
		for(var i = 0;i<result.length;i++)
		{
			html += '<li id="'+result[i].ques_id+'">';
			html += '<a href="javascript:void(0)" style="color:#999999;"><h4>'+result[i].ques_content+'</h4>';
			html +='<p>提问者 : '+result[i].user_name+result[i].create_time+'</p></a></li>';
		}
		$(_pageId + "#myAnsWHDList").append(html);
	}

	/**
	 * 初始化上下滑动组件 
	 */
	function initVIScroll(num){
		if(!vIscroll._init){
			var config = {
					"isPagingType": false,		//false表示是微博那种累加形式，true表示分页形式
					"visibleHeight": $(window).height()-$(_pageId +" .header").height()-9,//显示内容区域的高度，当isPaingType为false时传
					"container": $(_pageId+" #v_container_div"),
					"wrapper":$(_pageId+" #v_wrapper_div"),	
					"downHandle": function() {				//下拉获取上一页数据方法
						curPage = 1;						//上拉将当前页数设置为1
						//查询数据
						querymyAnsWHD("html");
					},
					"upHandle": function() {				//上拉获取下一页数据方法
						if(curPage < totalPage)				//判断当前页数是不是小于总页数
						{
							curPage++;
							querymyAnsWHD("append"); 
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
		$(_pageId +" #myAnsWHDList").html("");
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

	var adviserSpace_myAns_myAnsWHD = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = adviserSpace_myAns_myAnsWHD;
});