/**
 * 我的咨询
 */
define(function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
        userService = require('userService'),
        quesService = require('quesService'),
		
		pageCode = "userSpace/myQues", 
		_pageId = "#userSpace_myQues ";
	
	var domain = gconfig.global.domain;
	//插件
	var VIscroll = require("vIscroll");
	var	vIscroll = new Array();
	var numPerPage = 10; //每页显示数据的条数
	//全局变量
	var user_id = null;
	var quescount=0;
	var anscount=0;
	var isFirstShow=true;
	//页面公共JS
	var pageCommon = require("pageCommon");
	/**
	 * 初始化
	 */
	function init() {
		destoryVIscroll();
		anscounts=appUtils.getSStorageInfo("anscounts");
		if(anscounts>=1){
			anscount=anscounts;
		}else{
			anscount=0;
		}
		quescounts=appUtils.getSStorageInfo("quescounts");
		if(quescounts>=1){
			quescount=quescounts;
		}else{
			quescount=0;
		}
		for(var i=0;i<2;i++){
			vIscroll[i] = {"scroll":null,"_init":false,"curPage":1,"totalPages":1,"totalRows":0,"num":0};
		}
		user_id = appUtils.getSStorageInfo('userId',true);
		/* if(user_id==null||""==user_id||undefined==user_id){
		    	layerUtils.iAlert("您尚未登录！",-1);
				appUtils.pageInit(pageCode,"index");
			}*/
		 if(isFirstShow){
			 destoryFunc();
			 getMyQuesList(); //查询我的提问列表
			 $(_pageId + ".answered_list").hide();
			$(_pageId + ".my_page_con").show();
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
			appUtils.clearSStorage("quescounts");
			appUtils.clearSStorage("anscounts");
			appUtils.pageInit(pageCode,"userSpace/index");
			isFirstShow=true;
		});
		
		//我的提问 ;我的回答(导航)
		appUtils.bindEvent($(_pageId + ".row-1 a"), function(e) {
			$(this).parent().siblings().find("a").removeClass("act");
			$(this).addClass("act");
			var index = $(this).parent().index();
			if(index == 0){
				destoryVIscroll();
				$(_pageId + ".answered_list").hide();
				$(_pageId + ".my_page_con").show();
				//查询我的提问
				vIscroll[1] = {"scroll":null,"_init":false,"curPage":1,"totalPages":1,"totalRows":0,"num":0};
				vIscroll[0] = {"scroll":null,"_init":false,"curPage":1,"totalPages":1,"totalRows":0,"num":0};
				getMyQuesList();
			}
			if(index == 1){
				destoryVIscroll();
				$(_pageId + ".my_page_con").hide(); 
				$(_pageId + ".answered_list").show();
				//查询我的回答
				vIscroll[0] = {"scroll":null,"_init":false,"curPage":1,"totalPages":1,"totalRows":0,"num":0};
				vIscroll[1] = {"scroll":null,"_init":false,"curPage":1,"totalPages":1,"totalRows":0,"num":0};
				getMyAnsList();
			}
		});
		
		/** ************************* 预绑定事件  ************************** */
		//进入问答详情
		appUtils.preBindEvent($(_pageId +"#quesList"), "li",function(){
			appUtils.setSStorageInfo("quescounts",quescount);
			appUtils.setSStorageInfo("anscounts",anscount);
			var ques_id = $(this).attr("id");
			appUtils.pageInit(pageCode, "ques/quesDetail",{"ques_id":ques_id,"type":1});
		},'click');
		appUtils.preBindEvent($(_pageId +"#ansList"), "li",function(){
			appUtils.setSStorageInfo("quescounts",quescount);
			appUtils.setSStorageInfo("anscounts",anscount);
			var ques_id = $(this).attr("id");
			appUtils.pageInit(pageCode, "ques/quesDetail",{"ques_id":ques_id,"type":2});
		},'click');
	}
	
	//***************************【初始化方法】***********************************//
	/**
	 * 查询我的提问
	 * */
	function getMyQuesList(insertType){
		quescount++;
		  var type;
	    	if(quescount>1){
	    		type=false;
	    	}else{
	    	  type=true;	
	    	}
		insertType =  typeof insertType == "undefined" || insertType == "" || insertType == null ? "html":insertType;
		var param = {
				"user_id" : user_id,
				"ques_type" : "",
				"curPage" : vIscroll[0].curPage,
				"numPerPage" : numPerPage
		};
		userService.queryUserQuesList(param,function callBack(resultVo){
			if(Number(resultVo.error_no) == 0){
				//layerUtils.iMsg(0,"查询我的提问成功");
				var result = resultVo.results;
				fillQuesData(result,insertType); //将问答数据填充到页面
				
				vIscroll[0].num = result.length;
				vIscroll[0].totalPages = result[0].total_page;//总页数
				vIscroll[0].curPage = result[0].cur_page;
				vIscroll[0].totalRows = result[0].total_rows;
				initVIScroll(0);//初始化组件
			}else if(resultVo.error_no=="-40811502"){
				var height = $(window).height()-$(_pageId + ".header").height()-$(_pageId + ".top_nav").height();
				var html = '<div style="height:'+height+'px; font-size:16px; color:#9999B1; text-align:center; padding-top:150px;">您暂无提问</div>';
				$(_pageId + "#quesList").empty();
				$(_pageId + "#quesList").html(html);
				initVIScroll(0);//初始化组件
			}else{
				layerUtils.iAlert("查询我的提问失败:"+resultVo.error_info,-1);
			}
		},{isShowWait:type});
	}
	
	//将提问数据填充到页面
	function fillQuesData(result,insertType)
	{
		if(insertType == 'html'){
			$(_pageId + "#quesList").html("");
		}
		var html = "";
		for(var i = 0;i<result.length;i++)
		{
			html += '<li id="'+result[i].ques_id+'"><a href="javascript:void(0)">';
			html += '<h4>'+result[i].ques_content+'</h4>';
			if(result[i].ask_name == "")
				html += '<p>我向所有人提问   | '+result[i].ques_time+'</p>';
			else
				html += '<p>我向'+result[i].ask_name+'提问   | ' +result[i].ques_time+'</p>';
			html += '</a></li>';
		}
		$(_pageId + "#quesList").append(html);
	}
	
	/**
	 * 查询我的回答
	 * */
	function getMyAnsList(insertType){
		anscount++;
		var type;
    	if(anscount>1){
    		type=false;
    	}else{
    	  type=true;	
    	}
		insertType =  typeof insertType == "undefined" || insertType == "" || insertType == null ? "html":insertType;
		var param = {
				"invest_id" : user_id,
				"curPage" : vIscroll[1].curPage,
				"numPerPage" : numPerPage
		};
		quesService.queryUserAnsweredQues(param,function callBack(resultVo){
			if(Number(resultVo.error_no) == 0){
				//console.log("~~查询我的回答成功~~");
				var result = resultVo.results;
				fillAnsData(result,insertType); //将组合数据填充到页面
				
				vIscroll[1].num = result.length;
				vIscroll[1].totalPages = result[0].total_page;//总页数
				vIscroll[1].curPage = result[0].cur_page;
				vIscroll[1].totalRows = result[0].total_rows;
				initVIScroll(1);//初始化组件
			}else if(resultVo.error_no=="-40836702"){
				var height = $(window).height()-$(_pageId + ".header").height()-$(_pageId + ".top_nav").height();
				var html = '<div style="height:'+height+'px; font-size:16px; color:#9999B1; text-align:center; padding-top:150px;">您暂无回答问题</div>';
				$(_pageId + "#ansList").empty();
				$(_pageId + "#ansList").html(html);
				initVIScroll(1);//初始化组件
			}else{
				layerUtils.iAlert("查询我的回答失败:"+resultVo.error_info,-1);
			}
		},{isShowWait:type});
	}
	
	//将提问数据填充到页面
	function fillAnsData(result,insertType)
	{
		if(insertType == 'html'){
			$(_pageId + "#ansList").html("");
		}
		var html = "";
		for(var i = 0;i<result.length;i++)
		{
			html += '<li id="'+result[i].ques_id+'">';
			html += '<div class="li_up"><div class="ring"><span>?</span></div><div class="list_info">';
			html += '<h4>'+result[i].ques_content+'</h4>';
			html += '<p>提问者 : '+result[i].user_name+" | "+result[i].ques_create_time+'</p>';
			html += '</div></div>';
			html += '<div class="li_lower">';
			html += '<div class="ring">';
			if(result[i].invest_image == null || result[i].invest_image == "")
				html += '<img src="images/my_tx.png" width="26" class="rounded"/>';
			else
				html += '<img src="'+domain+result[i].invest_image+'" width="26" class="rounded"/>';
			html += '</div>';
			html += '<div class="list_info">';
			html += '<h4>'+result[i].answer_content+'</h4>';
			html += '<p>回答 : '+result[i].invest_name+" | "+result[i].ans_create_time+'</p>';
			html += '</div></div>';
			html += '</li>';
		}
		$(_pageId + "#ansList").append(html);
	}
	
	
	/**
	 * 初始化上下滑动组件
	 */
	function initVIScroll(index){
		var container = null;
		var wrapper = null;
		if(index == 0){
			container = "v_container_ques";
			wrapper = "v_wrapper_ques";
		}else if(index == 1){
			container = "v_container_ans";
			wrapper = "v_wrapper_ans";
		}
		if(index==0){
			var visibleHeight=$(window).height()-$(_pageId +" #header").height()-95; //显示内容区域的高度，当isPaingType为false时传
		}else if(index==1){
			var visibleHeight=$(window).height()-$(_pageId +" #header").height()-86; //显示内容区域的高度，当isPaingType为false时传
		}
		if(!vIscroll[index]._init){
			var config = {
				"isPagingType": false,
				"visibleHeight":visibleHeight,
				"container": $(_pageId + " #"+container),
				"wrapper": 	 $(_pageId + " #"+wrapper),	
				"downHandle": function() {				//下拉获取上一页数据方法
					vIscroll[index].curPage = 1;						//上拉将当前页数设置为1
					if(index == 0){
						getMyQuesList();
					}
					else if(index == 1){
						getMyAnsList('html');
					}
				},
				"upHandle": function() {				//上拉获取下一页数据方法
					if(vIscroll[index].curPage < vIscroll[index].totalPages)				//判断当前页数是不是小于总页数
					{
						vIscroll[index].curPage++;
						if(index == 0){
							getMyQuesList("append");
						}
						else if(index == 1){
							getMyAnsList('append');
						}
					}
				},
				"wrapperObj": null
			};
			vIscroll[index].scroll = new VIscroll(config); 	//初始化，需要做if(!hIscroll._init)判断
			vIscroll[index]._init = true; 						//尽量只初始化一次，保持性能
			if(vIscroll[index].num < numPerPage || vIscroll[index].num == vIscroll[index].totalRows){
				$(_pageId + " .visc_pullUp").hide();
			}
		} else {
			vIscroll[index].scroll.refresh();
			if(vIscroll[index].curPage == 1){
				if(vIscroll[index].num < numPerPage || vIscroll[index].num==vIscroll[index].totalRows){					
					$(_pageId+" .visc_pullUp").hide();
		 		}else{
		 			$(_pageId+" .visc_pullUp").show();
		 		};
			}else{
				if(vIscroll[index].num < numPerPage || (vIscroll[index].num == numPerPage && vIscroll[index].curPage == vIscroll[index].totalPages)){					
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
	
	//销毁上下滑动组件
	function destoryVIscroll(){
		if(vIscroll && vIscroll.length>0){
			for(var i=0;i<vIscroll.length;i++){
				if(vIscroll[i]._init == true){
					vIscroll[i].scroll.destroy(); //销毁
					vIscroll[i].scroll = null;
					vIscroll[i]._init = false; 
					vIscroll[i].curPage = 1;
					vIscroll[i].totalPages = 1;
					vIscroll[i].totalRows = 0;
					vIscroll[i].num = 0;
				}
			}
		}
	}

	
	function destoryFunc(){
		$(_pageId+" #myAns").removeClass("act");
		$(_pageId+" #muQues").addClass("act");
		$(_pageId + "#quesList").html("");
		$(_pageId + "#ansList").html("");
		isFirstShow=true;
	}

	var userSpace_myQues = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy,
	};

	module.exports = userSpace_myQues;
});