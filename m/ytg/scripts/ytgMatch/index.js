/**
 * 炒股大赛首页
 * @author 余一一
 * @date 2016-03-30
 */
define("ytg/scripts/ytgMatch/index", function(require, exports, module) {
	var appUtils = require("appUtils"), 
		layerUtils = require("layerUtils"), 
		gconfig = require("gconfig"),
		validatorUtil = require("validatorUtil"),
		ytgMatchService = require("ytgMatchService"),//服务
		userService = require("userService").getInstance(),//服务
		pageCode = "ytgMatch/index", 
		_pageId = "#ytgMatch_index ";
	//页面公共JS
	var pageCommon = require("pageCommon");
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null,"_init":false}; //上下滑动
	var curPage = 1,//当前页
	    num = 0,
		numPerPage = 3,//显示条数
		totalPage = 1;//总条数
	var isFirstSet =true;
	var user_id = appUtils.getSStorageInfo("userId",true);
	/**
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
	   if (isFirstSet) {
		   destoryScoll();//销毁
		   queryMatchList();//查询大赛列表
		   isFirstSet = false;
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
			appUtils.setSStorageInfo("hisPageCode","pageCode");	
			appUtils.pageInit(pageCode,"account/login");
		});
		
		//返回
		appUtils.bindEvent($(_pageId + ".back_btn"), function() {
			appUtils.pageInit(pageCode,"index");
		});
		
	}
	
	/** *************************【函数方法】***************************** */
	
	/***
	 * 查询炒股大赛列表
	 * 
	 */
	function queryMatchList(loadType){		
		 
		   var paraMap = {};
			paraMap["curPage"] = curPage;
			paraMap["numPerPage"] = 3;
			ytgMatchService.queryList(paraMap,function(resultVo){
				//console.info(JSON.stringify(resultVo));
				var error_no = resultVo.error_no;//错误number
				var error_info = resultVo.error_info;//错误信息
				if (error_no == "0") {
					var results=resultVo.results;
					if (results !=null && results.length>0) {
						var  result = resultVo.results[0].data;
						innerHtmlMacthList(result,loadType);//填充到页面	
						num = result.length;
						totalPage=results[0].totalPages;	//数据的总页数
						curPage=results[0].currentPage;	//数据的当前页数
						totalRows = results[0].totalRows;
						 initVIScroll(num);	
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
	function innerHtmlMacthList(result, loadType){
		if(result != null && result.length>0){
			var insertHtml ="";
			if(loadType != "append"){
				$(_pageId + "#stockMatch").html(insertHtml);
			}
			
			result.forEach(function(item){
				//图片
				var matchImg="";
		        //判断大赛状态 apply_state 报名状态:0未开始，1进行中，2已结束  
				//match_state 比赛状态:0未开始，1进行中，2已结束
				var s_childHtml="";

				if(item.match_state == "0" ){	
					 matchImg = item.match_pict?item.match_pict:"images/matchImages/sy_banner.png";
					s_childHtml = "<div class='process_icon soon'></div>";
				} else if( item.match_state == "1"){
					 matchImg = item.match_pict?item.match_pict:"images/matchImages/game_p1.jpg";
					s_childHtml = "<div class='process_icon ongoing'></div>";
			    }else if(item.match_state == "2"){
			   
			    	 matchImg = item.match_pict?item.match_pict:"images/matchImages/game_p2.jpg";
					s_childHtml = "<div class='process_icon end'></div>";
				} 
			 insertHtml += "<div  class='game_box' match_state="+item.match_state+" apply_state="+item.apply_state+" act_id="+item.act_id+" ><div class='game_box_pic'>"
					     + "<img style='height:122px;' src="+matchImg+" width='100%'/></div>"
				         + "<div class='ui layout game_box_mes'>"
					     + s_childHtml
					     + "<div class='row-1'>"
						 + "<h4>"+item.act_name+"</h4>"
						 + "<p>"+item.begin_date+'-'+item.end_date+"</p></div></div></div>";
			  
			     });
			 $(_pageId + "#stockMatch").append(insertHtml);
			 
			
				
			 
				
				//进入大赛详情
				appUtils.preBindEvent($(_pageId + "#container_match_list"),".game_box", function(){
					var apply_state = $(this).attr("apply_state");//
					var match_state = $(this).attr("match_state");	
					var act_id = $(this).attr("act_id");
					var followCode = "ytgMatch/dynamic/contest/registration";
					if(match_state == "1"){	//进行中
						 followCode = "ytgMatch/dynamic/contest/ing";
					}else if(match_state == "2"){//已结束
						followCode = "ytgMatch/dynamic/contest/end";
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
				}
			},ctrlParam);
		}
	}
	
	
	/**
     * 初始化上下滑动组件 
     */
    function initVIScroll(num){
    	if(!vIscroll._init){
    		var config = {
    				"isPagingType": false,		//false表示是微博那种累加形式，true表示分页形式
    				"visibleHeight": $(window).height()-$(_pageId +" .header").height()+90,//显示内容区域的高度，当isPaingType为false时传
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
		$(_pageId+" #stockMatch").html("");//数据清空
    }
	/** ****************************************************************** */
	
	/**
	 * 销毁
	 */
	function destroy() {
		//隐藏菜单以及遮罩层
		pageCommon.hideHeaderMenuFunc(_pageId);
	}

	
	var index = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = index;
});