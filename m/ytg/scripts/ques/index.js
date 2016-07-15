/**
 * 问答主页
 */
define("ytg/scripts/ques/index", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
	    quesService=require("quesService"),
		pageCode = "ques/index", 
		_pageId = "#ques_index ";
	
	//插件
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null,"_init":false}; //上下滑动

	//全局变量
	var user_id="";
	var user_type = ""; //用户类型
	//入参
	var curPage = 1;
	var numPerPage = 9;
	var totalPage=1;
	var totalRows = 0;
	var num = 0;
	//页面公共JS
	var pageCommon = require("pageCommon");
	var isFirstShow=true;
	var count=0;
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
		user_type=appUtils.getSStorageInfo("userType",true);
		if(isFirstShow){
			destoryFunc();
			queryques();
			isFirstShow = false;
		}
		
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent() {
		//头部菜单绑定事件
		pageCommon.headerMenuFunc(_pageId,pageCode);
		
		//最新回答数据
		appUtils.bindEvent($(_pageId + "#newHuida"), function() {
			appUtils.pageInit(pageCode, "ques/index1", {});
		});
		
		//头部返回
		appUtils.bindEvent($(_pageId + ".icon_back"), function(e) {
			isFirstShow = true;
			appUtils.clearSStorage("anscounts");
			appUtils.clearSStorage("counts");
			appUtils.pageInit(pageCode,"index");
			if(!isFirstShow){
				//同步点击最新问答的返回
				$("#ques_index1 " +".icon_back").trigger("mousedown");
			}
		});
		
		//进入问答详情
		appUtils.preBindEvent($(_pageId +"#advisory_list"), "li",function(){
			appUtils.clearSStorage("counts");
			appUtils.setSStorageInfo("counts",count);
			var ques_id = $(this).attr("id");
			appUtils.pageInit(pageCode,"ques/quesDetail", {'ques_id':ques_id,"type":1});
		},"click");
		
		//提问
		appUtils.bindEvent($(_pageId + ".foot_box_fixed"), function(){
			if(user_id==undefined || user_id ==null || user_id == ""){
				appUtils.setSStorageInfo("hisPageCode",pageCode);
				appUtils.pageInit(pageCode, "account/login");
				return ;
			}else if(user_type==1){
				layerUtils.iAlert("投顾用户不能提问",-1);
				return;
			}else{
				$(_pageId + "#tiwen").show();
				$(_pageId + "#invest_name").html('向所有人提问');
			}
		});
		

		//点击×按钮 关闭提问弹窗
		appUtils.bindEvent($(_pageId+".close_btn"),function() {
			$(_pageId + "#tiwen").hide();
		});
		
		//字数限制
		appUtils.bindEvent($(_pageId+"#comment"),function(){
			var len = $(this).val().length;
			if(len > 120){
				$(this).val($(this).val().substring(0,120));
				var num = 120 - $(this).val().length;
				$(_pageId+"#word").text("还可输入"+num+"字");
				layerUtils.iAlert("超过字数限制!",-1);
				return;
			}
			var num = 120 - len;
			$(_pageId+"#word").text("还可输入"+num+"字");
		},"input");
		
		//提交问题
		appUtils.bindEvent($(_pageId+"#commit"),function() {
			var ques_comment = $(_pageId+ " #comment").val();
			if(ques_comment == ""){
				layerUtils.iAlert("内容不能为空!",-1);
				return;
			}
			//提交问题
			commitQues(removeHTMLTag(ques_comment),"");
		});
	}
	// ************************  提交问题 **************************************//
	
	//过滤提问内容
	function removeHTMLTag(ques_comment){
		ques_comment = ques_comment.replace(/<\/?[^>]*>/g,''); //去除HTML tag
		ques_comment = ques_comment.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
		ques_comment = ques_comment.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
		ques_comment=ques_comment.replace(/&nbsp;/ig,'');//去掉&nbsp;
		return ques_comment;
	}
	
	/**
	 * 提交问题
	 * */
	function commitQues(ques_comment,invest_id){
		var queryMap={		
				"user_id" : user_id,
				"invest_id" : invest_id,
				"ques_content" : ques_comment	
		};
		var CommitQuestion=function(resultVo){					
			if(0==Number(resultVo.error_no)){
				layerUtils.iAlert("提交成功", 0,function(){
//					location.reload();
					queryques();
				});

				$(_pageId + "#tiwen").hide();
				$(_pageId+"#comment").val("");
				$(_pageId+"#word").text("还可输入"+120+"字");

			}else if(Number(resultVo.error_no)=="-40833903"){
				layerUtils.iAlert("投顾不能向自己提问",-1);
			}else{
				layerUtils.iAlert("提问失败:"+resultVo.error_info,-1);
			}
		};
		quesService.commitQuestion(queryMap,CommitQuestion);
	}
	//***************************【函数方法】***********************************//
	function queryques(insertType){
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
				"numPerPage" : numPerPage
		};
		quesService.newQues(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				var result = resultVo.results;
				fillQuesListData(result,insertType);

				num = result.length;
				totalPage=Number(result[0].total_page);	//数据的总页数
				curPage=Number(result[0].cur_page);	//数据的当前页数
				totalRows = Number(result[0].total_rows);
				initVIScroll(num);
			}else if(resultVo.error_no=="-40834702"){
				$(_pageId + "#advisory_list").empty();
				var noDataHtml = '<div class="no_data_box"><em></em><p>暂无最新提问</p></div>';
				$(_pageId + "#advisory_list").html(noDataHtml);
				//$(_pageId + "#advisory_list").html('<h3 style="text-align:center;">暂无最新提问</h3>');

			}else{
				layerUtils.iAlert("最新回答数据加载失败:"+resultVo.error_info,-1);
			}
		},{isShowWait:type});
	}
	 
	 
	
	 
	/**
	 * 问答数据填充
	 */
	function fillQuesListData(result,insertType){
		if(insertType == 'html'){
			$(_pageId + "#advisory_list").empty();
		}
		var html = "";
		for(var i = 0;i<result.length;i++)
		{
			var ques_content=result[i].ques_content;
			if(ques_content.length>=50){
				ques_content=ques_content.substring(0,49)+".......";
			}
			html += ' <li id="'+result[i].ques_id+'"><a href="javascript:void(0)" style="color:#999999;"><h4>'+ques_content+'</h4>';
			html += '<p>提问者 : '+result[i].user_name+"&nbsp;&nbsp;&nbsp;&nbsp;"+result[i].create_time+'</p></a></li>';


		}
		$(_pageId + "#advisory_list").append(html);
	}
	
	/**
	 * 初始化上下滑动组件 
	 */
	function initVIScroll(num){
		if(!vIscroll._init){
			var config = {
					"isPagingType": false,		//false表示是微博那种累加形式，true表示分页形式
					"visibleHeight": $(window).height()-$(_pageId +" .header").height()-$(_pageId+" #top_nav").height()-13,//显示内容区域的高度，当isPaingType为false时传
					"container": $(_pageId+" #v_container_div"),
					"wrapper":$(_pageId+" #v_wrapper_div"),	
					"downHandle": function() {				//下拉获取上一页数据方法
						curPage = 1;						//上拉将当前页数设置为1
						//查询数据
						queryques("html");
					},
					"upHandle": function() {				//上拉获取下一页数据方法
						if(curPage < totalPage)				//判断当前页数是不是小于总页数
						{
							curPage++;
							queryques("append"); 
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


	var ques_index = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = ques_index;
});