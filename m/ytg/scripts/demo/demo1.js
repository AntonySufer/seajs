/**
 * 首页
 */
define("ytg/scripts/demo/demo1", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
        service = require("hlytgService"),
		
		pageCode = "demo/dome1", 
		_pageId = "#demo_demo1 ";
	
	//全局变量
	var openid = "", weixinpk = "";
	
	/**
	 * 初始化
	 */
	function init() {
		
		$(_pageId + ".qa_title li:first").siblings().removeClass("active");
		$(_pageId + ".qa_title li:first").addClass("active");
		var param = {
				
			};
		getQuestion(param); //获取问题
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent() {
		
		//我（图标）
		appUtils.bindEvent($(_pageId + ".icon_user"), function(e) {
			appUtils.pageInit(pageCode,"my/me");
		});
		
		//我要提问（图标）
		appUtils.bindEvent($(_pageId + ".cir_box"), function(e) {
			appUtils.pageInit(pageCode,"question/ask");
		});
		
		//众口一词
		appUtils.bindEvent($(_pageId + "#zkyc"), function(e) {
			appUtils.pageInit(pageCode,"djzw/zkyc");
		});
		
		//搜问题
		appUtils.bindEvent($(_pageId + "#swt"), function(e) {
			appUtils.pageInit(pageCode,"search/search");
		});
		
		//趋势达人
		appUtils.bindEvent($(_pageId + "#qsdr"), function(e) {
			appUtils.pageInit(pageCode,"djzw/qsdr");
		});
		
		//最热提问
		appUtils.bindEvent($(_pageId + ".qa_title li:first"), function(e) {
			$(this).siblings().removeClass("active");
			$(this).addClass("active");
			var param = {
					"type" : 0, //0：最热问题  1：最新问题
					"deal" : "",  //0:看多  1：看空
					"rownum" : 10,
					"num" : 0, //回答数
					"count" : 0, //同问数
					"nowuser_id" : -1, //当前用户id
					"Qtype" : 0  //0：当天  1：查看更多	
				};
				getQuestion(param);
		});
		
		//最新提问
		appUtils.bindEvent($(_pageId + ".qa_title li:last"), function(e) {
			$(this).siblings().removeClass("active");
			$(this).addClass("active");
			var param = {
					"type" : 1, //0：最热问题  1：最新问题
					"deal" : "",  //0:看多  1：看空
					"rownum" : 10,
					"num" : 0, //回答数
					"count" : 0, //同问数
					"times" : 5,
					"nowuser_id" : -1, //当前用户id
					"isPage" : 0 //0:分页 1：不分页
				};
			getQuestion(param);
		});
		
		//点击问题，查看问题详情
		appUtils.preBindEvent($(_pageId + "#fill_data"),"li", function(e) {
			var question_id = $(this).attr("id");
			appUtils.pageInit(pageCode,"my/myWt/wtDetails",{"question_id":question_id});
		});
		
		
		//...更多
		appUtils.bindEvent($(_pageId + ".more"), function(e) {
			//alert("更多");
			//testWeixinMsg();
		});
		
		//我要提问
		appUtils.bindEvent($(_pageId + "#wytw"), function(e) {
			appUtils.pageInit(pageCode,"question/ask");
		});
		
		//大家在问
		appUtils.bindEvent($(_pageId + "#djzw"), function(e) {
			appUtils.pageInit(pageCode,"djzw/allWt");
		});
		
	}
	
	//*********************************************************************
	/**
	 * 获取最热最新问题(已改为全部提问)
	 * */
	function getQuestion(param)
	{
		service.queryMostQuestion(param,function callBack(resultVo){
			if(Number(resultVo.error_no) == 0){
				var result = resultVo.results;
				var list = [];
				for(var i=0; i<result.length; i++){
					var temp = new Object();
					temp.stock_code = result[i].stock_code; //股票代码
					temp.stock_name = result[i].stock_name; //股票名称
					temp.deal = result[i].deal; //0:看多 1:看空
					temp.answer_count = result[i].answer_count; //回答数
					temp.dis_time = result[i].dis_time; //多久时间
					temp.face_image_small = result[i].face_image_small; //小图像
					temp.real_name = result[i].real_name; //姓名
					temp.question_id = result[i].question_id; //问题id
					list.push(temp);
				}
				//填充页面
				fillListData(list);
			}
			else{
				layerUtils.iAlert("查询最热最新问题失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	//将数据填充到页面
	function fillListData(result)
	{
		$(_pageId + "#fill_data").html("");
		var html = "";
		for(var i = 0;i<result.length;i++)
		{
			html += '<li id="'+result[i].question_id+'">';
			html += '<a href="javascript:void(0)">';
			html += '<img src="'+'http://www.hlytg.cn'+result[i].face_image_small+'"/>';
			html += '<p><strong>问 : </strong>'+result[i].stock_code+result[i].stock_name;
			if(result[i].deal == 0)
			    html += ',今日能否买入？</p>';
			else if(result[i].deal == 1)
				html += '今日能否卖出？</p>';
			//html += '<em><i>'+result[i].answer_count+'</i>'+result[i].dis_time+'</em><span>'+'用户：'+result[i].real_name+'</span>';
			html += '<em><i>'+result[i].answer_count+'</i>'+result[i].dis_time+'</em><div style="height:14px"></div>';
			html += '</a></li>';
		}
		$(_pageId + "#fill_data").append(html);
	}
	
	/**
	 * 测试微信消息
	 * */
	function testWeixinMsg()
	{
		var param={};
		service.testWeixinMsg(param,function callBack(resultVo){
			if(Number(resultVo.error_no) == 0){
				alert('微信消息调用成功');
			}
			else
			{
				layerUtils.iAlert("微信消息调用失败:"+resultVo.error_info,-1);
			}
		});
	}
	//*********************************************************************
	
	/**
	 * 销毁
	 */
	function destroy() {
	}

	var demo_demo1 = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = demo_demo1;
});