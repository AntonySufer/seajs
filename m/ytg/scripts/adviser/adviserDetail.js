/**
 * 投顾详情页
 */
define(function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
		pageCode = "adviser/adviserDetail", 
		_pageId = "#adviser_adviserDetail ";
	//页面公共JS
	var pageCommon = require("pageCommon");
	var domain = gconfig.global.domain;
	
	//service
	var quesService=require("quesService");
	var portfolioService=require("portfolioService");
	var userService=require("userService");
	//全局变量
	var invest_id="";
	var user_id="";
	var user_type = ""; //用户类型
	var invest_name = ""; //投顾姓名
	//组合入参
	var port_curPage = 1;
	var port_numPerPage = 28;
	var port_totalPage = 0;
	//观点入参
	var point_curPage = 1;
	var point_numPerPage = 28;
	var point_totalPage = 0;
	//问答入参
	var ques_curPage = 1;
	var ques_numPerPage = 10;
	var ques_totalPage = 0;
    var domain = gconfig.global.domain;
    var isFirstShow=true;
    var point_count=0;
    var ans_count=0;
    var port_count=0;
    var type="";
	/**
	 * 初始化
	 */
	function init() {
		type=appUtils.getPageParam("type");
		  var  point_counts=appUtils.getSStorageInfo("point_counts",true);
		    if(point_counts>=1)
		    	point_count=point_counts;
		    else
		    	point_count=0;
		    var  ans_counts=appUtils.getSStorageInfo("ans_counts",true);
		    if(ans_counts>=1)
		    	ans_count=ans_counts;
		    else
		    	ans_count=0;
		    
		if(appUtils.getPageParam("invest_id")){
			invest_id = appUtils.getPageParam("invest_id");
		}
		if(invest_id==null&&""==invest_id){
			invest_id = appUtils.getPageParam("invest_id");
		}
		$(_pageId + "#tiwen").hide();
		if(isFirstShow){
			destoryFunc();
			//查询投顾基本信息
			queryAdviserDetaillist(invest_id);
			$(_pageId + "#jianjie").show();
			$("#zuhe").removeClass("act");
			$("#guandian").removeClass("act");
			$("#wenda").removeClass("act");
			$("#zhu").addClass("act");
			$(_pageId + "#ques").hide();
			$(_pageId + "#point").hide();
			$(_pageId + "#portfolio").hide();
			isFirstShow = false;
		}
		user_id=appUtils.getSStorageInfo("userId",true);
		user_type=appUtils.getSStorageInfo("userType",true);
/*		if(user_id==null||""==user_id||undefined==user_id){
			var hisPageParam = {
					"invest_id" : invest_id
			};
			appUtils.setSStorageInfo("hisPageParam",JSON.stringify(hisPageParam));
			appUtils.setSStorageInfo("hisPageCode",pageCode);
			appUtils.pageInit(pageCode, "account/login");
			return ;
		}*/
		if(user_id != null && user_id != ""){
			//用户是否订阅了该投顾
			userIsSubInvest();
		}
		
		//设置前页面不为登录页
		if(appUtils.getSStorageInfo("_prePageCode") != "account/login"){
			var prePageCode = appUtils.getSStorageInfo("_prePageCode");
			appUtils.clearSStorage("ytg_prePageCode");
			appUtils.setSStorageInfo("ytg_prePageCode",prePageCode);
		}
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent() {
		//头部菜单绑定事件
		pageCommon.headerMenuFunc(_pageId,pageCode);
		
		//头部返回
		appUtils.bindEvent($(_pageId + ".icon_back"), function() {
			if(appUtils.getSStorageInfo("_prePageCode") == "point/pointDetail"||appUtils.getSStorageInfo("_prePageCode") == "ques/quesDetail"){
				var prePageCode = appUtils.getSStorageInfo("invest_PageCode");
				if(type==1){
					appUtils.pageInit(pageCode, prePageCode,{"type":1});
				}else if(type==2){
					appUtils.pageInit(pageCode, prePageCode,{"type":2});
				}else{
					appUtils.pageBack();
				}
				isFirstShow = true;
			}else if(appUtils.getSStorageInfo("_prePageCode")=="adviser/adviserDetail" ||appUtils.getSStorageInfo("ytg_prePageCode")=="adviser/adviserDetail"){
				var prePageCode = appUtils.getSStorageInfo("invest_PageCode");
				if(prePageCode=="portfolio/portfolioDetail")
					appUtils.pageInit(pageCode, "index");
					else
				appUtils.pageInit(pageCode, prePageCode);
				isFirstShow = true;
			}else if(appUtils.getSStorageInfo("_prePageCode") == "account/login"){
				var prePageCode = appUtils.getSStorageInfo("ytg_prePageCode");
				appUtils.pageInit(pageCode, prePageCode);
				
			}else{
				
//				appUtils.pageBack();
				appUtils.pageInit(pageCode, "adviser/index");
				isFirstShow = true;
			}
		});
		//Tab切换
		appUtils.bindEvent($(_pageId + "#zhu"), function(e){
			$("#zuhe").removeClass("act");
			$("#guandian").removeClass("act");
			$("#wenda").removeClass("act");
			$("#zhu").addClass("act");
			//显示简介
			$(_pageId + "#jianjie").show();
			$(_pageId + "#ques").hide();
			$(_pageId + "#point").hide();
			$(_pageId + "#portfolio").hide();
			if(isFirstIntro){
				queryAdviserDetaillist(invest_id);
			}
		},"click");
		
		appUtils.bindEvent($(_pageId + "#zuhe"), function(e) {
			$("#zhu").removeClass("act");
			$("#guandian").removeClass("act");
			$("#wenda").removeClass("act");
			$("#zuhe").addClass("act");	
			$(_pageId + "#jianjie").hide();
			$(_pageId + "#portfolio").show();
			$(_pageId + "#ques").hide();
			$(_pageId + "#point").hide();
			if(port_curPage != 1){
				port_curPage = 1;
			}
			//查询组合
			queryAdviserPortfoliolist(user_id);
		},"click");

		appUtils.bindEvent($(_pageId + "#guandian"), function(e) {
			$("#zhu").removeClass("act");
			$("#zuhe").removeClass("act");
			$("#wenda").removeClass("act");
			$("#guandian").addClass("act");
			//显示观点
			$(_pageId + "#jianjie").hide();
			$(_pageId + "#portfolio").hide();
			$(_pageId + "#ques").hide();
			$(_pageId + "#point").show();
			if(point_curPage != 1){
				point_curPage = 1;
			}
				//查询观点
				queryAdviserView(invest_id);
		},"click");


		appUtils.bindEvent($(_pageId + "#wenda"), function(e) {
			$("#zhu").removeClass("act");
			$("#guandian").removeClass("act");
			$("#zuhe").removeClass("act");
			$("#wenda").addClass("act");
			//显示问答
			$(_pageId + "#jianjie").hide();
			$(_pageId + "#portfolio").hide();
			$(_pageId + "#ques").show();
			$(_pageId + "#point").hide();
			if(ques_curPage != 1){
				ques_curPage = 1;
			}
			//查询问答
			queryQuesList(invest_id);
		},"click");	
		
		//添加关注
		appUtils.bindEvent($(_pageId + ".fr_box #subInvest"), function() {
			if(user_id==undefined || user_id ==null || user_id == ""){
				var hisPageParam = {
						"invest_id" : invest_id
				};
				appUtils.setSStorageInfo("hisPageParam",JSON.stringify(hisPageParam));
				appUtils.setSStorageInfo("hisPageCode",pageCode);
				return ;
			}else if(user_type==1){
				layerUtils.iAlert("投顾不能关注其他投顾",-1);
				return;
			} else if(invest_id==user_id){
				layerUtils.iAlert("投顾不能关注自己",-1);
				return;
			}
			else {
				cancelOrAttInvest(invest_id);
			}

		}); 
		
		//提问
		appUtils.bindEvent($(_pageId + ".ask_btn"), function() {
			if(user_id==undefined || user_id ==null || user_id == ""){
				var hisPageParam = {
						"invest_id" : invest_id
				};
				appUtils.setSStorageInfo("hisPageParam",JSON.stringify(hisPageParam));
				appUtils.setSStorageInfo("hisPageCode",pageCode);
				appUtils.pageInit(pageCode, "account/login");
				return ;
			}else if(user_type==1){
				layerUtils.iAlert("投顾用户不能提问",-1);
				return;
			}else{
				$(_pageId + "#tiwen").show();
				$(_pageId + "#invest_name").html('向'+invest_name+'提问');
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
				layerUtils.iAlert("超过字数限制",-1);
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
			commitQues(removeHTMLTag(ques_comment));
		});
		
		/** ****************** 预绑定 ************************* */
		// [组合]
		//进入组合详情
		appUtils.preBindEvent($(_pageId +"#portfolioList"), "li",function(e){
			appUtils.setSStorageInfo("point_counts",point_count);
			appUtils.setSStorageInfo("ans_counts",ans_count);
			if(appUtils.getSStorageInfo("portfolio_PageCode")!="adviser/adviserDetail" )
			appUtils.setSStorageInfo("portfolio_PageCode",pageCode);
			var portfolio_id = $(this).attr("id");
			if(portfolio_id){
				appUtils.pageInit(pageCode, "portfolio/portfolioDetail",{'portfolio_id':portfolio_id});
			}
		},"click");
		//组合 加载更多
		appUtils.preBindEvent($(_pageId+"#portfolioList"),".load_add",function(e){
			//alert("更多");
			port_curPage++;
			queryAdviserPortfoliolist(user_id,"append");
		});
		
		//关注组合
		appUtils.preBindEvent($(_pageId + "#portfolioList"),"li .attention_btn", function(e){
			if(user_id == undefined || user_id==null || user_id==""){
				var hisPageParam = {
						"invest_id" : invest_id
				};
				
				appUtils.setSStorageInfo("hisPageParam",JSON.stringify(hisPageParam));
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
			if($(this).hasClass('attention_btn2'))
				sub_type = 0;
			else 
				sub_type = 1;
			//关注或者取消关注组合
			subOrCancelPort(user_id,portfolio_id,sub_type,$(this));
			e.stopPropagation();
			queryAdviserPortfoliolist(user_id);
		},"click");
		
		//[观点]
		//进入观点详情
		appUtils.preBindEvent($(_pageId +"#pointList"), "li",function(e){
			appUtils.setSStorageInfo("point_counts",point_count);
			appUtils.setSStorageInfo("ans_counts",ans_count);
			appUtils.setSStorageInfo("last_PageCode",pageCode);
			var view_id = $(this).attr("id");
			if(view_id){
				appUtils.pageInit(pageCode, "point/pointDetail",{'view_id':view_id});
			}
		},"click");
		//观点 加载更多
		appUtils.preBindEvent($(_pageId+"#pointList"),".load_add",function(e){
			//alert("更多");
			point_curPage++;
			queryAdviserView(invest_id,"append");
		});
		
		//[问答]
		//进入问答详情
		appUtils.preBindEvent($(_pageId +"#quesList"), "li",function(e){
			appUtils.setSStorageInfo("point_counts",point_count);
			appUtils.setSStorageInfo("ans_counts",ans_count);
			if(appUtils.getSStorageInfo("ques_PageCode")==null ||appUtils.getSStorageInfo("ques_PageCode")=="" )
			appUtils.setSStorageInfo("ques_PageCode",pageCode);
			var ques_id = $(this).attr("id");
			if(ques_id){
				appUtils.pageInit(pageCode, "ques/quesDetail",{'ques_id':ques_id});
			}
		},"click");
		//问答 加载更多
		appUtils.preBindEvent($(_pageId + " #quesList"),".load_add",function(e){
			ques_curPage++;
			queryQuesList(invest_id,"append");
		});
		
	}
	
	//***************************【函数方法】***********************************//
	/**
	 * 用户是否订阅了该投顾
	 * */
	function userIsSubInvest(){
		var param={
				"user_id" : user_id,
				"invest_id" : invest_id
		};
		userService.userIsSubInvest(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				//已订阅
				$(_pageId+"#subInvest").html('取关');
			}
			else if(resultVo.error_no == '-40812203'){
				//没订阅
				$(_pageId+"#subInvest").html('+关注');
			}
			else{
				layerUtils.iAlert("判断用户与投顾的订阅关系失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	/**
	 * 投顾查询信息
	 * */
	function queryAdviserDetaillist(invest_id)
	{
		var param={
				"invest_id" : invest_id
		};
		quesService.queryInvestInfo(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				var result = resultVo.results;
				fillAdviserDetailData(result);
				
				invest_name = result[0].user_name;
				
				isFirstIntro = false;
			}
			else{
				layerUtils.iAlert("投顾详情加载失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	//填充投顾数据
	function fillAdviserDetailData(result){
		$(_pageId + "#name").text(result[0].user_name);
		$(_pageId + "#company").text("证券投资咨询");
		$(_pageId + "#skill").text("能力圈: "+result[0].skill);
		$(_pageId + "#address").text(" 互联网金融部 ");
		$(_pageId + "#card_id").text(result[0].card_id);
		$(_pageId + "#introdution").text(result[0].introdution);
		if(result[0].answer_num!=null&&""!=result[0].answer_num){
		$(_pageId + "#answer_num").text(result[0].answer_num);
		}else{
			$(_pageId + "#answer_num").text("0");
		}
		$(_pageId + "#port_num").text(result[0].port_num);
		$(_pageId + "#view_read_num").text(result[0].view_read_num);
		$(_pageId + "#fans_num").text(result[0].fans_num);
		if( result[0].face_image_small == ""){
			$(_pageId + "#face_image_small").attr("src","images/my_tx.png");
		}else{
			$(_pageId + "#face_image_small").attr('src',domain+result[0].face_image_small+"?r="+Math.random());
		}
	}
	
	
	/**
	 * 投顾查询组合
	 * */
	function queryAdviserPortfoliolist(user_id,insertType){
		port_count++;
		var type;
		if(port_count>1)
			type=false;
		else
			type=true;
		insertType =  typeof insertType == "undefined" || insertType == "" || insertType == null ? "html":insertType;
		var param={
				"customer_id" : user_id, //客户Id
				"user_id" : invest_id,
				"curPage" : port_curPage,
				"numPerPage" : port_numPerPage
		};
		portfolioService.queryUsersPortfolioList(param,function callBack(resultVo){
			
			if(0==Number(resultVo.error_no)){
				var result = resultVo.results;
				port_totalPage = result[0].total_page;
				fillAdviserPortfolioData(result,insertType);
			}
			else if(resultVo.error_no == "-40832202"){
				//无数据
				$(_pageId + "#portfolioList").empty();
				$(_pageId + " #none").removeClass("list_con");
				$(_pageId + " #none").addClass("list_connone");
				var noDataHtml ='<div class="no_data_box"><em></em><p>暂无组合</p></div>';
				$(_pageId + "#portfolioList").append(noDataHtml);
			}
			else{
				layerUtils.iAlert("组合加载失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	//填充投顾组合数据
	function fillAdviserPortfolioData(result,insertType){
		$(_pageId + "#portfolioList .load_add").parent("li").remove();
		$(_pageId + "#portfolioList .load_add").remove();
		if(insertType == 'html'){
			$(_pageId + "#portfolioList").html("");
		}

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
   					+'<p><span class="user">'+this.invest_name+' </span>'+sub_num+'人关注</p>'
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
		if(port_curPage != port_totalPage){
			$(_pageId + "#portfolioList").append('<li style="padding: 0.15rem 0.1rem 0.15rem 0.1rem;"><a href="javascript:void(0);" class="load_add" style="border:1px solid #689EEF;">加载更多TA的组合</a></li>');
		}
	}
	
	/**
	 * 关注或者取消关注 组合
	 * */
	function subOrCancelPort(user_id,portfolio_id,sub_type,elem){
		var param={
				"portfolio_id" : portfolio_id,
				"user_id" : user_id,
				"sub_type":sub_type
		};
		var ctrlParam = {
				"isShowWait" : false
		};
		portfolioService.attentionAndCancelPortfolio(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				if(sub_type == 1)
					elem.addClass("attention_btn2");
				else
					elem.removeClass("attention_btn2");
			}
			else{
				if(sub_type == 1)
					layerUtils.iAlert("关注组合失败:"+resultVo.error_info,-1);
				else 
					layerUtils.iAlert("取消关注组合失败:"+resultVo.error_info,-1);
			}
		},ctrlParam);
	}
	
	/**
	 * 投顾已发布的观点查询
	 */
	function queryAdviserView(invest_id,insertType){
		 point_count++;
		 var type;
		 if(point_count>1)
			 type=false;
		 else
			 type=true;
		insertType =  typeof insertType == "undefined" || insertType == "" || insertType == null ? "html":insertType;
		var param={
				"invest_id":invest_id,
				"curPage" : point_curPage,
				"numPerPage" : point_numPerPage
		};
		userService.queryInvestPublishView(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				var result = resultVo.results;
				point_totalPage = result[0].total_page;
				
				fillAdviserViewData(result,insertType);
				isFirstPoint = false;
			}
			else if(resultVo.error_no == '-40813602'){
				//无数据
				$(_pageId + "#pointList").empty();
				$(_pageId + " #none").removeClass("list_con list_con2");
				$(_pageId + " #none").addClass("list_connone");
				var noDataHtml = '<div class="no_data_box"><em></em><p>暂无观点</p></div>';
				$(_pageId + "#pointList").append(noDataHtml);
			}
			else{
				layerUtils.iAlert("投顾已发布观点加载失败:"+resultVo.error_info,-1) ;
			}
		},{isShowWait:type});
	}
	/**
	 *  投顾已发布的观点填充绑定数据
	 */
	function fillAdviserViewData(result,insertType){
		$(_pageId + "#pointList .load_add").remove();
		if(insertType == 'html'){
			$(_pageId + "#pointList").empty();
		}
		var html="";
		/*$(result).each(function(i) {
			var img = "";
			if(this.face_image_small == null || this.face_image_small == ""){
				img = "images/my_tx.png";
			}
			else{
				img = domain + this.face_image_small;
			}
			var str='<li id="'+this.view_id+'"><a href="javascript:void(0);"><div class="sy_list_tit"><div class="tx_box">'
			+'<img src="'+img+'" class="rounded" width="30" />'
			+'</div><div class="list_info"><p>'+this.invest_name+'</p><span>'+this.create_time+'&nbsp;&nbsp;&nbsp;阅读  '+this.read_num+'</span>'
			+'</div><div class="review_iocn"><em></em><p class="text-center">'+this.comment_num+'</p>'
			+'</div></div><div class="sy_list_txt"><p>'+this.title+'</p></div></a></li>';
			
			var str = '<li id="'+this.view_id+'"><div class="ui layout li_tit"><div class="user_pic">';
		    if(this.face_image_small==null && this.face_image_small==""){
		    	+'<img src="images/user_pic.png" class="circle" /></div>';
		    }
		    else{
		    	+' <img src="'+domain+this.face_image_small+'" class="circle" /></div>';
		    }
		 +'<div class="row-1"><p>'+this.invest_name+'</p><span>'+this.create_time+'</span></div>';
		 +'<div class="fr_txt"><span>'+ this.read_num+'阅读</span></div></div>'+'<div class="li_txt"><p>'+ this.content+'</p></div></li>';
			$(_pageId + "#pointList").append(str);
		});*/
		
		for(var i = 0;i<result.length;i++)
		{
			var content=result[i].content;
			  if(content.length>=50){
				  content=content.substring(0,49)+".......";
			  }
			html += '<li id="'+result[i].view_id+'"><div class="ui layout li_tit"><div class="user_pic">';
			    if(result[i].face_image_small == ""){
			    	html+='<img src="images/my_tx.png" class="circle" /></div>';
			    }
			    else{
			    	html+=' <img src="'+domain+result[i].face_image_small+'" class="circle" /></div>';
			    }
			    	
			html +='<div class="row-1"><p>'+result[i].invest_name+'</p><span>'+result[i].create_time+'</span></div>';
			html +='<div class="fr_txt"><span>'+ result[i].read_num+'阅读</span></div></div>'+'<div class="li_txt"><p>'+content+'</p></div></li>';
		}
		$(_pageId + "#pointList").append(html);
		if(point_curPage != point_totalPage){
			$(_pageId + "#pointList").append('<a href="javascript:void(0);" class="load_add">点击加载更多...</a>');
		}
	}
		
			
	/**
	 * 投顾已回答列表查询
	 */
	function queryQuesList(invest_id,insertType){
		ans_count++;
		var type;
		if(ans_count>1)
			type=false;
		else
			type=true;
		insertType =  typeof insertType == "undefined" || insertType == "" || insertType == null ? "html":insertType;
		var param={
				"invest_id":invest_id,
				"curPage" : ques_curPage,
				"numPerPage" : ques_numPerPage
		};
		userService.queryInvestAnsweredPage(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				var result = resultVo.results;
				ques_totalPage = result[0].total_page;
				
				fillQuesData(result,insertType);
			}
			else if(resultVo.error_no == '-40813302'){
				//无数据
				$(_pageId + "#quesList").empty();
				var noDataHtml = '<div class="no_data_box"><em></em><p>暂无问答</p></div>';
				$(_pageId + "#quesList").append(noDataHtml);
			}
			else{
				layerUtils.iAlert("投顾问答数据加载失败:"+resultVo.error_info,-1) ;
			}
		},{isShowWait:type});
	}
	/**
	 *  投顾已回答列表绑定数据
	 */
	function fillQuesData(result,insertType){
		$(_pageId + "#quesList .load_add").remove();
		if(insertType == 'html'){
			$(_pageId + "#quesList").empty();
		}
		$(result).each(function(i) {
			var img = "";
			if(this.invest_image_small == null || this.invest_image_small == ""){
				img = "images/my_tx2.png";
			}
			else{
				img = domain+this.invest_image_small;
			}
			 var ques_content=result[i].ques_content;
			  if(ques_content.length>=50){
				  ques_content=ques_content.substring(0,49)+".......";
			  }
			  var answer_content=result[i].answer_content;
			  if(answer_content.length>=50){
				  answer_content=answer_content.substring(0,49)+".......";
			  }
			var str='<li id="'+this.ques_id+'"><div class="li_up"><div class="ring"><span>?</span></div>'
				+'<div class="list_info"><h4>'+ques_content+'</h4><p>提问者 :  '+this.asker_name+'&nbsp;&nbsp;&nbsp;&nbsp;'+this.ques_create_time+'</p>'
				+'</div></div><div class="li_lower"><div class="ring">'
				+'<img src="'+img+'" width="26" class="circle"/>'
				+'</div><div class="list_info"><h4>'+answer_content+'</h4>'
				+'<p>回答 : '+this.invest_name+'&nbsp;&nbsp;&nbsp;&nbsp;'+this.ans_create_time+'</p></div></div></li>';
			$(_pageId + "#quesList").append(str);
		});
		if(ques_curPage != ques_totalPage){
			$(_pageId + "#quesList").append('<a href="javascript:void(0);" class="load_add">点击加载更多...</a>');
		}
	}
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
	function commitQues(ques_comment){
		var queryMap={		
				"user_id" : user_id,
				"invest_id" : invest_id,
				"ques_content" : ques_comment	
		};
		var CommitQuestion=function(resultVo){					
			if(0==Number(resultVo.error_no)){
				layerUtils.iAlert("提交成功", 0);

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



	/**
	 * 取消or关注投顾
	 * */
	function cancelOrAttInvest(invest_id){
		var cancelOrAttCallBack=function(resultVo){			
			if(0==Number(resultVo.error_no)){
				var flag = $(_pageId + "#subInvest").text();
				if(flag.indexOf("取关")!=-1){
					$(_pageId+"#subInvest").html('+关注');
					var fans_num =$(_pageId+"#fans_num").text();
					if(fans_num!=0){
						fans_num =parseInt(fans_num)-1;
						$(_pageId+"#fans_num").text(fans_num);	
					}
				}
				if(flag.indexOf("+关注")!=-1){
					$(_pageId+"#subInvest").html('取关');
					var fans_num =$(_pageId+"#fans_num").text();
				    fans_num =parseInt(fans_num)+1;
					$(_pageId+"#fans_num").text(fans_num);
				}
			}
			else {
				layerUtils.iAlert(resultVo.error_no, -1);
			}
		};
		var pram = {
				"user_id":user_id,
				"invest_id" : invest_id
		};
		userService.userSubInvest(pram,cancelOrAttCallBack,{isShowWait:false});
	}

	//*********************************************************************//
	
	/**
	 * 销毁
	 */
	function destroy() {
		//隐藏菜单以及遮罩层
		pageCommon.hideHeaderMenuFunc(_pageId);
//		$(_pageId + "#portfolioList").empty();  
//		$(_pageId + "#point").empty(); 
//		$(_pageId + "#ques").empty();
//		$(_pageId + "#portfolioList").html("");  
//		$(_pageId + "#point").html("");  
//		$(_pageId + "#ques").html(""); 
		queryAdviserDetaillist(invest_id);
		isFirstShow =true;
	}

	function destoryFunc(){
		
	}
	  


	var adviser_adviserDetail = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = adviser_adviserDetail;
});