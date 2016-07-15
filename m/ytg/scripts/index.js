/**
 * 首页
 */
define("ytg/scripts/index", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	layerUtils = require("layerUtils"), 
	gconfig = require("gconfig"),
	validatorUtil = require("validatorUtil"),
	portfolioService = require("portfolioService"),
	pointService=require("pointService"),
	userService = require("userService"),
	pageCode = "index", 
	_pageId = "#index ";
    var isFirstShow=true;
    var domain = gconfig.global.domain;
	//全局变量
	var user_id = appUtils.getSStorageInfo("userId",true);
	var user_type = null;
	appUtils.clearSStorage("userName"); //清除姓名
	appUtils.clearSStorage("userType");//清除类型
	var channel="";
	/**t
	 * 初始化
	 */
	function init() {
		if(user_id==null){
			user_id = appUtils.getSStorageInfo("userId",true);
		}
		if(user_id==null || ""==user_id ||user_id==undefined){
			userInfo=appUtils.getPageParam("userInfo");
			loginFunc();
		}
		user_id = appUtils.getSStorageInfo("userId",true);
		if(isFirstShow){
			destoryFunc();
			queryHotportfoliolist();
			//查询热门观点
			queryNewViewList();
			isFirstShow = false;
		}
		channel=appUtils.getPageParam("channel");
		
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent(){
		
		//炒股大赛-更多
		appUtils.bindEvent($(_pageId + "#match"), function(){
			appUtils.pageInit(pageCode, "ytgMatch/index", {});
			isFirstShow=true;
			
		});
		
		

		//热门组合-更多
		appUtils.bindEvent($(_pageId + "#portfolio"), function(){
			appUtils.pageInit(pageCode, "portfolio/index", {});
			isFirstShow=true;
			
		});
		
		//热门观点-更多
		appUtils.bindEvent($(_pageId + "#point"), function() {
			appUtils.pageInit(pageCode, "point/index", {});
		});
		
		//问问题
		appUtils.bindEvent($(_pageId + "#ques"), function() {
			appUtils.pageInit(pageCode, "ques/index", {});
		});
		
		//找投顾
		appUtils.bindEvent($(_pageId + "#adviser"), function() {
			appUtils.pageInit(pageCode, "adviser/index", {});
		});
		
		//搜索页面
		appUtils.bindEvent($(_pageId + ".search_btn"), function() {
			appUtils.pageInit(pageCode, "search/index", {});
		});
		

		//主页返回到APP
		appUtils.bindEvent($(_pageId + "#back"), function() {
			isFirstShow = true;
			if(channel==1){
				appUtils.pageBack();
			}else{
				showAPP();
			}
			
			
		});
		//个人中心
		appUtils.bindEvent($(_pageId + ".login_btn"), function() {
			user_type = appUtils.getSStorageInfo("userType",true);	
			if(user_type == 0){
				appUtils.pageInit(pageCode,"userSpace/index");
			}
			else if(user_type == 1){
				appUtils.pageInit(pageCode,"adviserSpace/index");
			}else{
				appUtils.pageInit(pageCode,"account/login");
				appUtils.setSStorageInfo("hisPageCode",pageCode);
		
			}
		});
		
		/******************* 预绑定事件 **************************/
		//进入组合详情
		appUtils.preBindEvent($(_pageId +"#portfolioList"), "li",function(){
			appUtils.setSStorageInfo("portfolio_PageCode",pageCode);
			var portfolio_id = $(this).attr("id");
			appUtils.pageInit(pageCode, "portfolio/portfolioDetail",{'portfolio_id':portfolio_id});
			isFirstShow=true;
		});
		
		//进入观点详情
		appUtils.preBindEvent($(_pageId +"#pointList"), "li",function(){
			appUtils.clearSStorage("last_PageCode");
			appUtils.setSStorageInfo("last_PageCode",pageCode);
			var point_id = $(this).attr("id");
			appUtils.pageInit(pageCode, "point/pointDetail",{"view_id":point_id});
			isFirstShow=true;
		});
		
		//关注组合
		appUtils.preBindEvent($(_pageId + "#portfolioList"),"li .attention_btn", function(e){
			user_id=appUtils.getSStorageInfo("userId",true);
			if(user_id == undefined || user_id==null || user_id==""){
				appUtils.pageInit(pageCode,"account/login");
				appUtils.setSStorageInfo("hisPageCode",pageCode);
				e.stopPropagation();
				return ;
			}else if(user_type==1){
				layerUtils.iMsg(-1,"投顾不能关注组合");
				e.stopPropagation();
				return ;
				
			}
			var portfolio_id = $(this).parent().parent().attr("id");
			var sub_type = "";
			if($(this).hasClass('attention_btn2')){
				sub_type = 0;
			}
			else{
				sub_type = 1;
			}
			//关注或者取消关注组合
			subOrCancelPort(portfolio_id,sub_type,$(this));
			e.stopPropagation();
			queryHotportfoliolist();
		});
		
	}
	
	/** *************************【绑定事件方法】***************************** */
	
	/**
	 * 关注或者取消关注 组合
	 * */
	function subOrCancelPort(portfolio_id,sub_type,elem){
		user_id = appUtils.getSStorageInfo("userId",true);
		var param={
				"portfolio_id" : portfolio_id,
				"user_id" : user_id,
				"sub_type":sub_type
		};
		portfolioService.attentionAndCancelPortfolio(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				if(sub_type == 1){
					elem.addClass("attention_btn2");
				}
				else{
					elem.removeClass("attention_btn2");
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
	
	/** *************************【初始化方法】***************************** */
	
	/**
	 * 登录
	 * */
	function loginFunc(){
		var param = {
			"userInfo":userInfo
			
		};
		var ctrlParam = {
				"isLastReq" : true, //是否是最后一次请求
				"isShowWait" : false //是否显示等待层
		};
		if(userInfo!=null){	
			//不可重复提交表单
			userService.hlLogin(param,function callBack(resultVo){
				if(Number(resultVo.error_no) == 0){
					//将登录信息写入缓存
					var result = resultVo.results[0];
					var userId = result.user_id;
					var loginId = result.login_id;
					var userType = result.user_type;
					var userName = result.user_name;
					//登录后,设置相关cookie
					appUtils.setSStorageInfo("_isLoginIn","true");
					appUtils.setSStorageInfo("userId",userId,true);
					appUtils.setSStorageInfo("loginId",loginId,true);
					appUtils.setSStorageInfo("userType",userType,true);
					appUtils.setSStorageInfo("userName",userName,true);
					//查询热门组合
					queryHotportfoliolist();
					//查询热门观点
					queryNewViewList();
				}
			},ctrlParam);
		}
	}
	        //返回APP界面
          function  showAPP(){
        	$(_pageId + "#pointList").html(""); 
      		$(_pageId + "#portfolioList").html("");
        	  isFirstShow=true;
        	  appUtils.clearSStorage(true); //清除本地session storage
        	  appUtils.clearSStorage(); //清除本地session storage
        	     var sUserAgent = navigator.userAgent.toLowerCase();
        	   	 var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        	   	 var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        	   	 var bIsAndroid = sUserAgent.match(/android/i) == "android";
        	    if(bIsIphoneOs==true||bIsAndroid==false || bIsIpad==true){
        	    	
        	    	//苹果返回    
      	  	      function connectWebViewJavascriptBridge(callback){
      	          	    if (window.WebViewJavascriptBridge) {
      	          	    			callback(WebViewJavascriptBridge);
      	          	    		} else {
      	          	    			document.addEventListener('WebViewJavascriptBridgeReady', function(){
      	          	    				callback(WebViewJavascriptBridge);
      	          	    			}, false);
      	          	    		}
      	          	    	}
      	          	    	connectWebViewJavascriptBridge(function(bridge) {
      	          	    		var uniqueId = 1;
      	          	    		function log(message, data) {
      	          	    			var log = document.getElementById('log');
      	          	    			var el = document.createElement('div');
      	          	    			el.className = 'logLine';
      	          	    			el.innerHTML = uniqueId++ + '. ' + message + ':<br/>' + JSON.stringify(data);
      	          	    			if (log.children.length) { 
      	          	    				log.insertBefore(el, log.children[0]);
      	          	    				}
      	          	    			else {
      	          	    				 log.appendChild(el);
      	          	    				}
      	          	    		}
      	          	    		bridge.init(function(message, responseCallback) {
      	          	    			var data = { 'Javascript Responds':'Wee!' };
      	          	    			responseCallback(data);
      	          	    		});
      	          	    		bridge.registerHandler('testJavascriptHandler', function(data, responseCallback) {
      	          	    			var responseData = { 'Javascript Says':'Right back atcha!' }
      	          	    			responseCallback(responseData);
      	          	    		});

      	          	    		
      	          	    			var data = 'Hello from JS button';
      	          	    			
      	          	    			bridge.send(data, function(responseData) {
      	          	    				
      	          	    			});

      	          	    			bridge.callHandler('testObjcCallback', {'foo': 'bar'}, function(response) {
      	          	    				
      	          	    				log('JS got response', response);
      	          	    			});
      	          	    		
      	          	    	});

        	    }else{
        	    	//安卓
       	    	 location.href="http://action:10430";
        	    }
        	 
         }
	
	/**
	 * 查询热门组合
	 * */
	function queryHotportfoliolist()
	{
		user_id = appUtils.getSStorageInfo("userId",true);
		if(user_id==null||""==user_id||undefined==user_id){
			userInfo=appUtils.getPageParam("userInfo");			loginFunc();
			user_id = appUtils.getSStorageInfo("userId",true);
		}
		var param={
				"customer_id" : user_id, //可传入用户Id,判断与组合的关注关系
				"curPage" : 1,
				"numPerPage" : 3
		};
		portfolioService.queryPortfolioList(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				var result = resultVo.results;
				fillHotPortfolioData(result);
			}else if(resultVo.error_no=="-40834302"){
				$(_pageId + "#portfolioList").empty();
				$(_pageId + "#portfolioList").html('<h3 style="text-align:center;">暂无热门组合</h3>');
			}else{
				layerUtils.iAlert("热门组合加载失败:"+resultVo.error_info,-1);
			}
		});
	}
	//填充组合数据
	function fillHotPortfolioData(result){
		$(_pageId + "#portfolioList").empty();
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
   					+'<p><span class="user">'+this.invest_name+' </span><span style="color:#f48c56;">'+sub_num+'人关注</span></p>'
   					+'</div>'
   				+'</div>';
			if(this.sub_status == 'no')
				str += '<a href="javascript:void(0)" class="attention_btn" id="gz">加关注</a>'
					+'</div>'
		            +'</li>';
			else 
				str += '<a href="javascript:void(0)" class="attention_btn attention_btn2" id="gz">已关注</a>'
					+'</div>'
		            +'</li>';
			
			$(_pageId + "#portfolioList").append(str);
		});
	}
	 
	
	 /**
	  * 查询热门观点
	  */
	function queryNewViewList(){
		var param={
				"curPage" : 1,
				"numPerPage" : 3
		};
		pointService.queryPointList(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				var result = resultVo.results;
				fillHotPointData(result);
			}else if(resultVo.error_no=="-40834202"){
				$(_pageId + "#pointList").empty();
				$(_pageId + "#pointList").html('<h3 style="text-align:center;">暂无热门观点</h3>');

			}else{
				layerUtils.iAlert("热门观点加载失败:"+resultVo.error_info,-1);
			}
		});
	} 
	/**
	 * 热门观点查询后绑定数据
	 */
	function fillHotPointData(result){
		 $(_pageId + "#pointList").html("");
			var html = "";
			for(var i = 0;i<result.length;i++)
			{
				var img=result[i].face_image_small;
				if(img == ""){
					img="images/my_tx.png";
				}else{
					img=domain+img;
				}
				html += '<li id="'+result[i].view_id+'"><div class="ui layout li_tit"><div class="user_pic">';
				html+=' <img src="'+img+'" class="circle" /></div>';
				html +='<div class="row-1"><p>'+result[i].invest_name+'</p><span>'+result[i].create_time+'</span></div>';
				html +='<div class="fr_txt"><span>'+ result[i].read_num+'阅读</span></div></div>'+'<div class="li_txt"><p>'+ result[i].content+'</p></div></li>';
			
			}
			$(_pageId + "#pointList").append(html);

		}
		
	
	/** ****************************************************************** */
	
	/**
	 * 销毁
	 */
	function destroy() {
		queryHotportfoliolist();
		isFirstShow =true;
	}

	function destoryFunc(){
		$(_pageId + "#pointList").html(""); 
		$(_pageId + "#portfolioList").html("");

}
	var index = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = index;
});