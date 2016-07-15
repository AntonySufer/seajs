/**
 * 我的回答
 */
define("ytg/scripts/adviserSpace/myAns/myAns", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        userService = require("userService"),
		pageCode = "adviserSpace/myAns/myAns", 
		_pageId = "#adviserSpace_myAns_myAns ";
	
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
	var isFirstShow=true;
	var anscount=0;
	var gconfig = require("gconfig");
    var domain = gconfig.global.domain;
	/**
	 * 初始化
	 */
	function init() {
		anscounts=appUtils.getSStorageInfo("anscounts");
		if(anscounts>1){
			anscount=anscounts;
		}else{
			anscount=0;
		}
		user_id=appUtils.getSStorageInfo("userId",true);
		if(user_id==null||""==user_id||undefined==user_id){
			appUtils.pageInit(pageCode,"account/login");
			return;
		}
		if(isFirstShow){
			destoryFunc();
			querymyAns();
			isFirstShow = false;
		}
		
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent() {
		//头部菜单绑定事件
		pageCommon.headerMenuFunc(_pageId,pageCode);
		//投顾未回答数据
		appUtils.bindEvent($(_pageId + "#myAnsWHD"), function() {
			appUtils.pageInit(pageCode, "adviserSpace/myAns/myAnsWHD", {});
		});
		
		//头部返回
		appUtils.bindEvent($(_pageId + ".icon_back"), function(e) {
			appUtils.clearSStorage("anscounts");
			appUtils.pageInit(pageCode, "adviserSpace/index");
			isFirstShow=true;
		});
		
		/** ************************* 预绑定事件  ************************** */
		//进入问答详情
		appUtils.preBindEvent($(_pageId +"#myAnsList"), "li",function(){
			appUtils.clearSStorage("anscounts");
			appUtils.setSStorageInfo("anscounts",anscount);
			var ques_id = $(this).attr("id");
			appUtils.pageInit(pageCode, "ques/quesDetail",{"ques_id":ques_id});
		},"click");
	}
	
	//***************************【函数方法】***********************************//
	
	 /**
	  * 查询已回答问题列表
	  */
	function querymyAns(insertType){
		anscount++;
		var type;
    	if(anscount>1){
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
		userService.queryInvestAnsweredList(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				var result = resultVo.results;
				fillmyAnsData(result,insertType);
				
				num = result.length;
				totalPage=result[0].total_page;	//数据的总页数
				curPage=result[0].cur_page;	//数据的当前页数
				totalRows = result[0].total_rows;
				initVIScroll(num);
			}
			else if(resultVo.error_no == '-40813002'){
				 var height = $(window).height()-$(_pageId + ".header").height();
				 var html = '<div style="height:'+height+'px; font-size:16px; color:#9999B1; text-align:center; padding-top:150px;">您暂无已回答问题</div>';
				 $(_pageId + "#myAnsList").empty();
				 $(_pageId + "#myAnsList").append(html);
				 initVIScroll(num);
			}
			else{
				layerUtils.iAlert("已回答问答加载失败:"+resultVo.error_info,-1);
			}
		},{isShowWait:type});
	} 
	
	//填充数据 
	function fillmyAnsData(result,insertType){
		if(insertType == 'html'){
			$(_pageId + "#myAnsList").html("");
		}
		var html = "";
		for(var i = 0;i<result.length;i++)
		{
			  var ques_content=result[i].ques_content;
			  if(ques_content.length>=20){
				  ques_content=ques_content.substring(0,19)+".......";
			  }
			html += '<li id="'+result[i].ques_id+'">';
			html += '<div class="li_up"><div class="ring"><span>?</span></div>';
			html += '<div class="list_info"><h4>'+ques_content+'</h4>';
			html +='<p>提问者 :'+result[i].user_name+'&nbsp;&nbsp;&nbsp;&nbsp;'+result[i].ques_time+'</p></div></div>';
			html += '<div class="li_lower"><div class="ring">';
			if(result[i].invest_image==null || ""==result[i].invest_image)
				html+='<img src="images/my_tx.png" width="26" class="rounded"/>';
			else{
				html+='<img src="'+domain+result[i].invest_image+'" width="26" class="rounded"/>';
			}
			html +='</div><div class="list_info">';
			html += '<h4>'+result[i].answer_content+'</h4>';
			html +='<p>回答 :'+result[i].invest_name+'&nbsp;&nbsp;&nbsp;&nbsp;'+result[i].create_time+'</p></div></div></li>';
		}
		$(_pageId + "#myAnsList").append(html);
	}
	
	/**
	 * 初始化上下滑动组件 
	 */
	function initVIScroll(num){
		if(!vIscroll._init){
			var config = {
					"isPagingType": false,		//false表示是微博那种累加形式，true表示分页形式
					"visibleHeight": $(window).height()-$(_pageId +" .header").height()-5,//显示内容区域的高度，当isPaingType为false时传
					"container": $(_pageId+" #v_container_div"),
					"wrapper":$(_pageId+" #v_wrapper_div"),	
					"downHandle": function() {				//下拉获取上一页数据方法
						curPage = 1;						//上拉将当前页数设置为1
						//查询数据
						querymyAns("html");
					},
					"upHandle": function() {				//上拉获取下一页数据方法
						if(curPage < totalPage)				//判断当前页数是不是小于总页数
						{
							curPage++;
							querymyAns("append"); 
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
		$(_pageId +" #myAnsList").html("");
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

	var adviserSpace_myAns_myAns = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = adviserSpace_myAns_myAns;
});