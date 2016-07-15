/**
 * 我的关注
 */
define("ytg/scripts/userSpace/mySub/mySubinvest", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        userService=require("userService"),
        
		pageCode = "userSpace/mySub/mySubinvest", 
		_pageId = "#userSpace_mySub_mySubinvest ";
	//页面公共JS
	var pageCommon = require("pageCommon");
	
	//插件
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null,"_init":false}; //上下滑动
	//全局变量
	var user_id = null;
	var sub_status=1;
	//入参
	var curPage = 1;
	var numPerPage = 8;
	var totalPage=1;
	var totalRows = 0;
	var num = 0;
	var isFirstShow=true;
	var investcount=0;
	var gconfig = require("gconfig");
    var domain = gconfig.global.domain;
	
	/**
	 * 初始化
	 */
	function init() {
		investcounts=appUtils.getSStorageInfo("investcounts");
		if(investcounts>=1){
			investcount=investcounts;
		}else{
			investcount=0;
		}
		user_id = appUtils.getSStorageInfo("userId",true);
		/*if(user_id==null||""==user_id||undefined==user_id){
	    	layerUtils.iAlert("您尚未登录！",-1);
			appUtils.pageInit(pageCode,"index");
		}*/
		if(isFirstShow){
			destoryFunc();
			queryUserSubInvestList();
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
			appUtils.clearSStorage("investcounts");
			appUtils.pageInit(pageCode,"userSpace/index");
			if(!isFirstShow){
				isFirstShow = true;
				//同步关注投顾的返回
				$(" #userSpace_mySub_mySubportfolio " +".icon_back").trigger("mousedown");
			}
		});
		
		//关注组合
		appUtils.bindEvent($(_pageId + "#mySubportfolio"), function() {
			appUtils.pageInit(pageCode, "userSpace/mySub/mySubportfolio", {});
		});
		
		/** ********************** 预绑定事件 ***********************    */
		//进入投顾详情页面
		appUtils.preBindEvent($(_pageId +"#investList"), "li",function(){
			appUtils.setSStorageInfo("invest_PageCode",pageCode);
			appUtils.clearSStorage("investcounts");
			appUtils.setSStorageInfo("investcounts",investcount);
			var invest_id = $(this).attr("id");
			if(invest_id != undefined && invest_id != null && invest_id != "")
				appUtils.pageInit("userSpace/mySub/mySubportfolio", "adviser/adviserDetail", {'invest_id':invest_id});
		},"click");
		
		//关注、取消关注 投顾
		appUtils.preBindEvent($(_pageId +"#investList"), ".att_btn",function(e){
			var invest_id = $(this).parent().attr("id");
			//关注或者取消关注组合
			subInvest(invest_id,$(this));
			//阻止事件冒泡
			if (e.stopPropagation) {
                e.stopPropagation();
                return ;
            }
            e.cancelBubble = true;
            return ;
		},"click");
	}
	
	//***************************【函数方法】***********************************//
	/**
	 * 查询用户关注的组合
	 * */
	function queryUserSubInvestList(insertType)
	{
		investcount++;
		var type;
    	if(investcount>1){
    		type=false;
    	}else{
    	  type=true;	
    	}
		insertType =  typeof insertType == "undefined" || insertType == "" || insertType == null ? "html":insertType;
		var param={
				"curPage" : curPage,
				"numPerPage" : numPerPage,
				"user_id":user_id,
				"sub_status":sub_status
		};
		userService.queryUserSubInvestList(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				var result = resultVo.results;
				fillTGData(result,insertType);
				
				num = result.length;
				totalPage=result[0].total_page;	//数据的总页数
				curPage=result[0].cur_page;	//数据的当前页数
				totalRows = result[0].total_rows;
				initVIScroll(num);
			}
			else if(resultVo.error_no == "-40811802" && curPage == 1){
				 var height = $(window).height()-$(_pageId + ".header").height()-15;
				 var html = '<li style="height:'+height+'px; font-size:16px; color:#9999B1; text-align:center; padding-top:150px;">您暂无关注的投顾</li>';
				 $(_pageId + "#investList").html("");
				 $(_pageId + "#investList").append(html);
				 initVIScroll(num);
			}else if(resultVo.error_no == "-40811802" && curPage != 1){
				 $(_pageId+" .visc_pullUp").hide();
			}else{
				layerUtils.iAlert("查询我关注的投顾失败:"+resultVo.error_info,-1);
			}
		},{isShowWait:type});
	}
	  
	//填充数据
	function fillTGData(result,insertType){
		if(insertType == 'html'){
			$(_pageId + "#investList").html("");
		}
		var html = "";
		for(var i = 0;i<result.length;i++)
		{
			html += '<li id="'+result[i].invest_id+'">';
			html += '<a href="javascript:void(0)">';
			html += '<div class="li_det"><div class="ring">';
			if(result[i].face_image_small==null|| ""==result[i].face_image_small)
				html+='<img src="images/my_tx.png" width="55" class="circle"/></div>';

			else{
				html+='<img src="'+domain+result[i].face_image_small+'" width="55" class="circle"/></div>';
			}

			html +='<div class="list_info"><div class="info_up">';
			html += '<h3>'+result[i].user_name+'</h3>';
			html +='<p><span>'+result[i].address+'</span>'+result[i].skill+'</p></div><div class="info_lower">';
			html += '<span class="text-left">组合数：'+result[i].port_num+'</span><span class="text-center">答题数：'+result[i].answer_num+'</span>';
			html +='<span class="text-right">观点数：'+result[i].view_num+'</span></div></div></div></a>';
			html += '<a href="javascript:void(0)" class="att_btn"></a></li>';
		}
		$(_pageId + "#investList").append(html);

	}
	   
	/**
	 * 用户关注/取消关注 组合
	 * */
	function subInvest(invest_id,elem){
		var param={
				"user_id": user_id,
				"invest_id": invest_id
		};
		userService.userSubInvest(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				elem.toggleClass("att_btn_act");
				/*if(resultVo.error_info == '关注投顾成功'){
					
				}
				else if(resultVo.error_info == '取消关注投顾成功'){
					
				}*/
			}else{
				layerUtils.iAlert("操作投顾失败:"+resultVo.error_info,-1);
			}
		},{isShowWait:false});
	}
	
	/**
	 * 初始化上下滑动组件 
	 */
	function initVIScroll(num){
		if(!vIscroll._init){
			var config = {
					"isPagingType": false,		//false表示是微博那种累加形式，true表示分页形式
					"visibleHeight": $(window).height()-$(_pageId +" .header").height()-15,//显示内容区域的高度，当isPaingType为false时传
					"container": $(_pageId+" #v_container_mysub"),
					"wrapper":$(_pageId+" #v_wrapper_mysub"),	
					"downHandle": function() {				//下拉获取上一页数据方法
						curPage = 1;						//上拉将当前页数设置为1
						//查询数据
						queryUserSubInvestList("html");
					},
					"upHandle": function() {				//上拉获取下一页数据方法
						if(curPage < totalPage)				//判断当前页数是不是小于总页数
						{
							curPage++;
							queryUserSubInvestList("append"); 
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
		$(_pageId +" #investList").html("");
		//销毁滑动插件
		if(vIscroll._init == true){
			vIscroll.scroll.destroy(); //销毁
			vIscroll.scroll = null;
			vIscroll._init = false; 
		}
		curPage = 1;
		totalPage = 1;
		totalRows = 0;
		num = 0;
	}

	var userSpace_mySub_mySubinvest = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = userSpace_mySub_mySubinvest;
});