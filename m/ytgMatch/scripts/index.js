/**
 * 炒股大赛首页
 * @author 余一一
 * @date 2016-03-30
 */
define("ytgMatch/scripts/index", function(require, exports, module) {
	var appUtils = require("appUtils"), 
		layerUtils = require("layerUtils"), 
		gconfig = require("gconfig"),
		validatorUtil = require("validatorUtil"),
		ytgMatchService = require("ytgMatchService"),//服务
		userService = require("userService").getInstance(),//服务
		pageCode = "index", 
		_pageId = "#index ";
	//页面公共JS
	var pageCommon = require("pageCommon");
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null,"_init":false}; //上下滑动
	var curPage = 1,//当前页
	    num = 0,
		numPerPage = 10,//显示条数
		totalPage = 1;//总条数
	var user_id = "";
	var channel="";
	var urlFrom="";//判断是微博客户端还是微证券  1.微博 
	var userInfo=null;
	/**
	 * 初始化
	 */
	function init() {
		
	/*	var aa=appUtils.getPageParam("urlFrom");//微证券进入
		 var urlFrom = window.location.search; //获取问号后面的值  ?urlFrom=1 
		if (urlFrom) {
			var sub_url =urlFrom.charAt(urlFrom.length - 1);//获取参数值 1
			if (sub_url ==1) {
				//微博授权
				getWeibocode();
			}*/
			user_id = appUtils.getSStorageInfo("userId",true);	
			if(!user_id){
			     userInfo=appUtils.getPageParam("userInfo");//微证券进入
			  //获取用户信息
				loginFunc();
			}
			if (user_id) {
				
				   queryMatchList();//查询大赛列表
				   channel=appUtils.getPageParam("channel");
			} 
	
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent(){
       
		//头部菜单绑定事件
		pageCommon.headerMenuFunc(_pageId,pageCode);
		//个人中心
		appUtils.bindEvent($(_pageId + ".login_btn"), function() {
		  isFirstSet = true;
			if (user_id) {
				appUtils.setSStorageInfo("hisPageCode",pageCode);	
				appUtils.pageInit(pageCode,"simulatedStocks/myMatch");	
			}else{
				appUtils.setSStorageInfo("hisPageCode",pageCode);	
				appUtils.pageInit(pageCode,"account/login");
			}
		});
		
		//测试微博
		appUtils.bindEvent($(_pageId + "#weibologin"), function() {
			/*	//微博授权
				var callBackFunc = function (resultVo){
					if(resultVo.error_no == 0){
						var result = resultVo.results[0];
						//跳转到授权页面
						appUtils.sendDirect(result.url);
					}else{
						layerUtils.iMsg(resultVo.error_info,-1);
					}
			    	};
				 userService.weiboLogin(callBackFunc);*/

		});
		
		
		//返回
		appUtils.bindEvent($(_pageId + ".back_btn"), function() {
			isFirstSet = true;
			if(channel==1){
				appUtils.pageBack();
			}else{
				showAPP();
			}
			
		});
		
		
		//banner跳转
		appUtils.bindEvent($(_pageId + "#img"), function(){
			var apply_state = $(this).data("apply_state");//
			var match_state = $(this).data("match_state");	
			var act_id = $(this).data("act_id");
			var followCode = "dynamic/contest/registration";
			if(match_state == "1"){	//进行中
				 followCode = "dynamic/contest/ing";
			}else if(match_state == "2"){//已结束
				followCode = "dynamic/contest/end";
			}
			try {
				  appUtils.clearSStorage("act_id");
				  appUtils.setSStorageInfo("act_id",act_id);
		    } catch (e) {
		    	layerUtils.iAlert("你的浏览器不支持sessionStorage",-1);
			  }
			appUtils.pageInit(pageCode,followCode, {"frontPage": pageCode});
			
		});
		
	}
	
	/** *************************【函数方法】***************************** */
	
	
	
	/***
	 * 微博授权
	 *//*
	function getWeibocode(){
		//微博授权
		var callBackFunc = function (resultVo){
			if(resultVo.error_no == 0){
				var result = resultVo.results[0];
				//跳转到授权页面
				appUtils.sendDirect(result.url);
			}else{
				layerUtils.iMsg(resultVo.error_info,-1);
			}
	    	};
		 userService.weiboLogin(callBackFunc);
	}*/
	
/*	*//**
	*获取微博授权后的结果信息
	*//*
	function getWeiboLoginResultInfo(){
		var callBackFunc = function (resultVo){
			if(resultVo.error_no == 0){
				var resultList = resultVo.results;
				if (resultList!=null && resultList.length>0) {
					//微博客户端授权了    	
				}else{
					
				}
				
			}else{
				
				layerUtils.iMsg(-1,resultVo.error_info);
			}
		};
		userService.getWeiboLoginResultInfo(callBackFunc);
	}*/
	
	
	/***
	 * 查询炒股大赛列表
	 * 
	 */
	function queryMatchList(loadType){		
		 
		   var paraMap = {};
			paraMap["curPage"] = curPage;
			paraMap["numPerPage"] = numPerPage;
			paraMap["user_id"] =user_id;
			ytgMatchService.queryList(paraMap,function(resultVo){
				//console.info(JSON.stringify(resultVo));
				var error_no = resultVo.error_no;//错误number
				var error_info = resultVo.error_info;//错误信息
				if (error_no == "0") {
					var results=resultVo.results;
					if (results !=null && results.length>0) {
						innerHtmlMacthList(results,loadType);//填充到页面	
						
					}
					
				}
				else{
					layerUtils.iAlert("调用失败:"+resultVo.error_info,-1);
				}
			});	
	}
	

	 /***
	 * 填充大赛列表
	 */
	function innerHtmlMacthList(resultList, loadType){
		if(resultList != null && resultList.length>0){
			var insertHtml ="";
			if(loadType != "append"){
				$(_pageId + "#stockMatch").html(insertHtml);
			}
			var result =resultList[0].data;
			var index=0;//索引
			result.forEach(function(item){
		        //判断大赛状态 apply_state 报名状态:0未开始，1进行中，2已结束  
				//match_state 比赛状态:0未开始，1进行中，2已结束
				var s_childHtml="";//大赛状态
				var StateName ="";//大赛状态名称
				var apply_joinHtml =""; //用户是否参加 
				if(item.match_state == "0" ){	
					s_childHtml = "<div class='process_icon soon'></div>";
					StateName ="即将开始";
				} else if( item.match_state == "1"){
					s_childHtml = "<div class='process_icon ongoing'></div>";
					StateName ="火热进行";
			    }else if(item.match_state == "2"){
					s_childHtml = "<div class='process_icon end'></div>";
					StateName ="比赛结束";
				} 
				
				//banner图和第一大赛名称
				if (index ==0 && curPage==1) {
					
					var imgSrc = item.match_pict?item.match_pict:"images/sy_banner.png";
					$(_pageId + "#img").attr("data-match_state",item.match_state);
					$(_pageId + "#img").attr("data-apply_state",item.apply_state);
					$(_pageId + "#img").attr("data-act_id",item.act_id);
					$(_pageId + "#banner_index").attr("src",imgSrc);
					$(_pageId + "#banner_name").html(StateName+":"+item.act_name);
					$(_pageId + "#banner_name").show();
				}
				    
				//判断用户是否报名
				if (item.isApply =="1") {
					if (item.match_state=="2") {
						apply_joinHtml = "<div class='process_icon joined'></div>";
					}else{
						apply_joinHtml = "<div class='process_icon joining'></div>";	
					}
					
				}else{
					apply_joinHtml = "<div class='process_icon'></div>";
				}
				
			 insertHtml += "<div class='ui layout game_box_mes'  data-match_state="+item.match_state+" data-apply_state="+item.apply_state+" data-act_id="+item.act_id+">"
					    +  s_childHtml
						+  "<div class='row-1'>"
						+  "	<h4>"+item.act_name+"</h4>"
						+  "	<p>比赛时间: <em>"+item.begin_date+'-'+item.end_date+"</em></p>"
						+  "</div>"
					    +  apply_joinHtml
			            +  "</div>";
			 index++;
			     });
			 $(_pageId + "#stockMatch").append(insertHtml);
			 
			     num = result.length;
				totalPage=resultList[0].totalPages;	//数据的总页数
				curPage=resultList[0].currentPage;	//数据的当前页数
				totalRows = resultList[0].totalRows;
				 initVIScroll(num);	
				
			 
				
				//进入大赛详情
				appUtils.preBindEvent($(_pageId + "#container_match_list"),".game_box_mes", function(){
					var apply_state = $(this).data("apply_state");//
					var match_state = $(this).data("match_state");	
					var act_id = $(this).data("act_id");
					var followCode = "dynamic/contest/registration";
					if(match_state == "1"){	//进行中
						 followCode = "dynamic/contest/ing";
					}else if(match_state == "2"){//已结束
						followCode = "dynamic/contest/end";
					}
					try {
						  appUtils.clearSStorage("act_id");
						  appUtils.setSStorageInfo("act_id",act_id);
				    } catch (e) {
				    	layerUtils.iAlert("你的浏览器不支持sessionStorage",-1);
					  }
					appUtils.pageInit(pageCode,followCode, {"frontPage": pageCode});
					
				},"click");
		}
	}
	
	
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
					user_id = appUtils.getSStorageInfo("userId",true);	
					 if (user_id) {
						   queryMatchList();//查询大赛列表
						
					  }
				}
			},ctrlParam);
		}
	}
	
	   //返回APP界面
    function  showAPP(){
  	   //$(_pageId + "#pointList").html(""); 
		//$(_pageId + "#portfolioList").html("");
		isFirstSet=true;
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
     * 初始化上下滑动组件 
     */
    function initVIScroll(num){
    	if(!vIscroll._init){
    		var config = {
    				"isPagingType": false,		//false表示是微博那种累加形式，true表示分页形式
    				"visibleHeight": $(window).height()-$(_pageId +" .header").height()-$(_pageId +"#img").height(),//显示内容区域的高度，当isPaingType为false时传
    				"container": $(_pageId+" #container_match_list"),
    				"wrapper":$(_pageId+" #wrapper_match_list"),	
    				//下拉完毕后执行的方法	
    				"downHandle": function(){				//下拉获取上一页数据方法
    					curPage = 1;						//上拉将当前页数设置为1
    					//查询数据
    					queryMatchList();
    					
    				},
    				"upHandle": function() {
    			        //上拉获取下一页数据方法
    					if(curPage < totalPage){			//判断当前页数是不是小于总页数
    						curPage++;
    						queryMatchList("append");
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
    
  /*  
    function destoryScoll(){
    	//销毁滑动插件
		if(vIscroll._init == true){
			vIscroll.scroll.destroy(); //销毁
			vIscroll.scroll = null;
			vIscroll._init = false; 
		}
	 
		curPage = 1;
		totalPage = 1;
		num = 0;
		numPerPage=10;
		$(_pageId+" #stockMatch").html("");//数据清空
    }*/
	/** ****************************************************************** */
	
	/**
	 * 销毁
	 */
	function destroy() {
		//隐藏菜单以及遮罩层
		//pageCommon.hideHeaderMenuFunc(_pageId);
		//销毁滑动插件
		if(vIscroll._init == true){
			vIscroll.scroll.destroy(); //销毁
			vIscroll.scroll = null;
			vIscroll._init = false; 
		}
	 
		curPage = 1;
		totalPage = 1;
		num = 0;
		numPerPage=10;
		$(_pageId+" #stockMatch").html("");//数据清空
	}

	
	var index = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = index;
});