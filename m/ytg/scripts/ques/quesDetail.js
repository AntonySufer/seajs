/**
 * 问答详情页
 */
define("ytg/scripts/ques/quesDetail", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
		quesService=require("quesService"),
		pageCode = "ques/quesDetail", 
		_pageId = "#ques_quesDetail ";
	
	//全局变量
	var ques_id=null;
	var rows = 100; //默认查询最大查询100条回答
	var type="";
	//页面公共JS
	var pageCommon = require("pageCommon");
	var gconfig = require("gconfig");
    var domain = gconfig.global.domain;
	
	/**
	 * 初始化
	 */
	function init() {
		type=appUtils.getPageParam("type");
		if(appUtils.getPageParam("ques_id")){
			ques_id=appUtils.getPageParam("ques_id");		
			}
		if(ques_id==null&&""==ques_id){
			ques_id=appUtils.getPageParam("ques_id");		
		}
		
		queryQuesDetails();
		if(appUtils.getSStorageInfo("_prePageCode") != "ques/quesDetail1"){
			var prePageCode = appUtils.getSStorageInfo("_prePageCode");
			appUtils.clearSStorage("ytg_prePageCode");
			appUtils.setSStorageInfo("ytg_prePageCode",prePageCode);
		}
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent(){
		//头部菜单绑定事件
		pageCommon.headerMenuFunc(_pageId,pageCode);
		
		// 进入投顾详情
		appUtils.preBindEvent($(_pageId +"#answered_list"), " img",function(){
			appUtils.setSStorageInfo("invest_PageCode",pageCode);
			var user_type = $(this).attr("userType");
			var invest_id = $(this).parent().parent().parent().parent().attr("id");
			if(user_type == 1){
				if(type==1){
					appUtils.pageInit(pageCode,"adviser/adviserDetail", {'invest_id':invest_id,"type":1});
				}else if(type==2){
					appUtils.pageInit(pageCode,"adviser/adviserDetail", {'invest_id':invest_id,"type":2});
				}
			}
		});
		
		//返回事件
		appUtils.bindEvent($(_pageId + ".icon_back"), function(){
			//设置前页面不为回答页
			if(appUtils.getSStorageInfo("_prePageCode") == "ques/quesDetail1"){
					var prePageCode = appUtils.getSStorageInfo("ytg_prePageCode");
					appUtils.pageInit(pageCode, prePageCode);
				}else if(appUtils.getSStorageInfo("ytg_prePageCode") == "adviser/adviserDetail"|| appUtils.getSStorageInfo("_prePageCode") == "userSpace/myQues"){
//					var prePageCode = appUtils.getSStorageInfo("ques_PageCode");
////					appUtils.pageInit(pageCode, prePageCode);
					if(type==1){
						appUtils.pageInit(pageCode, "ques/index");
					}else if(type==2){
						appUtils.pageInit(pageCode, "ques/index1");
					}else{
//						appUtils.pageInit(pageCode, "adviser/adviserDetail");
						appUtils.pageBack();
					}
				}
				else{
					appUtils.pageBack();
				}
		});
		//回答页面
		appUtils.bindEvent($(_pageId + "#huida"), function() {
			if(type==1){
				appUtils.pageInit(pageCode, "ques/quesDetail1", {"ques_id":ques_id,"type":1});
			}else if(type==2){
				appUtils.pageInit(pageCode, "ques/quesDetail1", {"ques_id":ques_id,"type":2});
			}
			
		});
	}
	
	//***************************【函数方法】***********************************//
	//查询问答详情
	   function queryQuesDetails(){
		   var param={
					"rows" : rows,
					"ques_id":ques_id
			};
			quesService.queryQuesDetails(param,function callBack(resultVo){
				if(0==Number(resultVo.error_no)){
					var result = resultVo.results;
				    fillHotQuesDetailsData(result);
				}
				else{
					layerUtils.iAlert("问答详情数据加载失败:"+resultVo.error_info,-1);
				}
			});
	   }
	   /**
	    * 填充问答数据详情
	    */
	   function fillHotQuesDetailsData(result){
		   $(_pageId + "#answered_list").html("");
		   var html = "";
		   //问题信息
		 /*  var ques_content=result[0].ques_content;
		   if(ques_content.length>=20){
			   ques_content=ques_content.substring(0,19)+".......";
		   }*/
		   html += '<li class="ts">';
		   html += '<div class="li_up"><div class="ring"><span>?</span></div>';
		   html += '<div class="list_info"><h4>'+result[0].ques_content+'</h4>';
		   html +='<p>提问者 :'+result[0].user_name+"  &nbsp;&nbsp;&nbsp;&nbsp;  "+result[0].ques_create_time+'</p></div></div></li>';
		   if(result[0].ans_num > 0){
			   for(var i = 0;i<result.length;i++)
			   {
				   //回答信息
				   html += '<li id="'+result[i].invest_id+'"><div class="li_lower"><div class="ring">';
				   if("" == result[i].face_image_small)
					   html+='<a><img src="images/my_tx.png" width="26" class="rounded" userType="'+result[i].user_type+'" /></a>';
				   else{
					   html+='<a><img src="'+domain+result[i].face_image_small+'" width="26" class="rounded" userType="'+result[i].user_type+'" /></a>';
				   }
				   html +='</div><div class="list_info">';
				   html += '<h4>'+result[i].answer_content+'</h4>';
				   if(result[i].user_type == 1){
					   if(result[i].invest_rank==0){
						   html +='<p>回答 :'+result[i].invest_name+" | 普通投顾"+"&nbsp;&nbsp;&nbsp;&nbsp;"+result[i].create_time+'</p></div></div></li>';
						}else if(result[i].invest_rank==1){
						   html +='<p>回答 :'+result[i].invest_name+" | 高级投顾"+"&nbsp;&nbsp;&nbsp;&nbsp;"+result[i].create_time+'</p></div></div></li>';
						}else if(result[i].invest_rank==2){
						   html +='<p>回答 :'+result[i].invest_name+" | 资深投顾"+"&nbsp;&nbsp;&nbsp;&nbsp;"+result[i].create_time+'</p></div></div></li>';
						}else if(result[i].invest_rank==3){
						   html +='<p>回答 :'+result[i].invest_name+" | 首席投顾"+"&nbsp;&nbsp;&nbsp;&nbsp;"+result[i].create_time+'</p></div></div></li>';
						}else if(result[i].invest_rank==4){
						   html +='<p>回答 :'+result[i].invest_name+" | 总部投顾团队"+"&nbsp;&nbsp;&nbsp;&nbsp;"+result[i].create_time+'</p></div></div></li>';
						}else if(result[i].invest_rank==5){
						   html +='<p>回答 :'+result[i].invest_name+" | 客服专员"+"&nbsp;&nbsp;&nbsp;&nbsp;"+result[i].create_time+'</p></div></div></li>';
						}else
						   html +='<p>回答 :'+result[i].invest_name+" | 未知投顾"+"&nbsp;&nbsp;&nbsp;&nbsp;"+result[i].create_time+'</p></div></div></li>';
				   }
				   else if(result[i].user_type == 0)
					   html +='<p>回答者 :'+result[i].invest_name+" | 民间高手"+"&nbsp;&nbsp;&nbsp;&nbsp;"+result[i].create_time+'</p></div></div></li>';
				   else
					   html +='<p>回答 :'+result[i].invest_name+' &nbsp;&nbsp;&nbsp;&nbsp; '+result[i].create_time+'</p></div></div></li>';
			   }
			   /*if(result.length <= result[0].ans_num){
				   html += '<a href="javascript:void(0);" class="load_add">查看更多回答...</a>';
			   }*/
		   }
		   else{
			   var noDataHtml = '<div class="no_data_box"><em></em><p>暂无回答</p></div>';
			   //$(_pageId + ".answered_list").empty();
			   //$(_pageId + ".answered_list").append(noDataHtml);
			   html += noDataHtml;
		   }
		   $(_pageId + "#answered_list").append(html);
	   }
	     
	//*********************************************************************//
	
	/**
	 * 销毁
	 */
	function destroy() {
		//隐藏菜单以及遮罩层
		pageCommon.hideHeaderMenuFunc(_pageId);
	}

	var ques_quesDetail = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = ques_quesDetail;
});