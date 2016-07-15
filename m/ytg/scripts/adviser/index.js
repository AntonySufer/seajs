/**
 * 投顾主页 列表
 * @author 余一一
 * @date 2016-03--7(二次开发)
 * 
 */
define("ytg/scripts/adviser/index", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
		pageCode = "adviser/index", 
		_pageId = "#adviser_index ";
	//service
	var investService=require("investService");
	var userService=require("userService");
	//插件
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null,"_init":false}; //上下滑动	
	//页面公共JS
	var pageCommon = require("pageCommon");
	//全局变量
	//入参
	var curPage = 1;
	var numPerPage = 10;
	var totalPage=1;
	var totalRows = 0;
	var num = 0;
	var bond_type = "";//证券类型
	var invest_name = "";//策略名称
	var count=0;
	var isFirstShow=true;
    var domain = gconfig.global.domain;
    var user_id="";//用户id
	/**
	 * 初始化
	 */
	function init() {
		counts=appUtils.getSStorageInfo("counts");
		user_id=appUtils.getSStorageInfo("userId",true);//获取用户id
		user_type=appUtils.getSStorageInfo("userType",true);
		console.info(user_id);
		if(counts>1){
			count=counts;
		}else{
			count=0;
		}
		//初始化操作
		$(_pageId + "#investName").val("");
		bond_type="";
	
			destoryFunc();
			//查询全部投顾
			queryAdviserlist();
			isFirstShow = false;

	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent() {
		//头部菜单绑定事件
		pageCommon.headerMenuFunc(_pageId,pageCode);
		 //头部返回 
		appUtils.bindEvent($(_pageId + ".icon_back"), function() {
			appUtils.clearSStorage("counts");
			appUtils.pageInit(pageCode, "index");
			isFirstShow = true;
			
		});
		
	/*	//导航tab
		appUtils.bindEvent($(_pageId + ".top_nav2_con li"), function(e){
			$(this).siblings().find("a").removeClass("act");
			$(this).find("a").addClass("act");
			var index = $(this).index();
			if(index == 0){
				bond_type="";
			}
			else{
				bond_type = index-1;
			}
			queryAdviserlist();
		});*/
		
		//搜索按钮
		appUtils.bindEvent($(_pageId + "#search_button"), function(e){
			bond_type="";
			queryAdviserlist();
		});
		
		//输入输入为空
		appUtils.bindEvent($(_pageId + "#investName"), function(e){
			queryAdviserlist();
		},"input propertychange");
		
		//投顾详情
		appUtils.preBindEvent($(_pageId + "#adviserlist"),"li", function(){
			appUtils.clearSStorage("counts");
			appUtils.setSStorageInfo("counts",count);
			appUtils.clearSStorage("invest_PageCode");
			appUtils.setSStorageInfo("invest_PageCode",pageCode);
			var invest_id = $(this).attr("id");
			if(invest_id != null && invest_id != ""){
				appUtils.pageInit(pageCode, "adviser/adviserDetail", {'invest_id':invest_id});
			}
		},"click");
		
		//点击关注
		appUtils.preBindEvent($(_pageId + "#adviserlist"),".att_btn", function(e){
			var invest_id = $(this).parent(".det_up").parent(".li_fr").parent("li").attr("id");
			var index_id =$(this).attr("name");
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
					cancelOrAttInvest(index_id,invest_id);
				}
				e.stopPropagation(); 
				
			},"click"); 
			
		
		
	}
	
	//***************************【函数方法】***********************************//
	
	/**
	 * 取消or关注投顾
	 * */
	function cancelOrAttInvest(index,invest_id){
		var cancelOrAttCallBack=function(resultVo){			
			if(0==Number(resultVo.error_no)){
				var fans_num =$(_pageId+"#fans_num"+index).attr("name");//获取粉丝数
				var flag = $(_pageId + "#subInvest"+index).text();//获取关注/未关祝
				if(flag.indexOf("取关")!=-1){
					$(_pageId+"#subInvest"+index).html('+关注');
				
					if(fans_num>0){
						fans_num = parseInt(fans_num)-1;
						$(_pageId+"#fans_num"+index).html("<i></i> "+fans_num);	
						$(_pageId+"#fans_num"+index).attr("name",fans_num);
					}
				}
				if(flag.indexOf("+关注")!=-1){
					$(_pageId+"#subInvest"+index).html('取关');
					var fans_num =$(_pageId+"#fans_num"+index).text();
					fans_num = parseInt(fans_num)+1;
					$(_pageId+"#fans_num"+index).html("<i></i> "+fans_num);
					$(_pageId+"#fans_num"+index).attr("name",fans_num);
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
	
		
	/**
	 * 投顾查询
	 * */
	function queryAdviserlist(insertType)
	{
		count++;
		var type;
    	if(count>1){
    		type=false;
    	}else{
    	  type=true;
    	}
		insertType =  typeof insertType == "undefined" || insertType == "" || insertType == null ? "html":insertType;
		invest_name = $(_pageId + "#investName").val().trim();//获取文本框的值
		var param={
				
				"curPage" : curPage,
				"numPerPage" : numPerPage,
				"bond_type" : bond_type,//证券类型,可不传
				'invest_name' : invest_name,
				"user_id":user_id
		};
		investService.queryAllInvest(param,function callBack(resultVo){
			if(0==Number(resultVo.error_no)){
				var result = resultVo.results;
				fillAdviserData(result,insertType);
				
				num = result.length;
				totalPage=Number(result[0].total_page);	//数据的总页数
				curPage=Number(result[0].cur_page);	//数据的当前页数
				totalRows = Number(result[0].total_rows);
				initVIScroll(num);
			}
			else if(resultVo.error_no == "-40802101"){
				//无数据
				$(_pageId + "#adviserlist").empty();
				$(_pageId + ".visc_pullUp").hide();
				var height = $(window).height()-$(_pageId +" .header").height()-$(_pageId+" .search_text").height();
			    var html = '<li style="height:'+height+'px;font-size:16px;color:#9999B1;text-align:center;padding-top:150px;">该投顾不存在</li>';
				$(_pageId + "#adviserlist").html("");
				$(_pageId + "#adviserlist").append(html);
			}
			else{
				layerUtils.iAlert("投顾加载失败:"+resultVo.error_info,-1);
			}
		},{isShowWait:type});
	}
	
	//填充投顾数据
	function fillAdviserData(result,insertType){
		if(insertType == 'html'){
			$(_pageId + "#adviserlist").empty();
		}
		 var html="";
		 for(var i=0;i<result.length;i++){
			 var img= result[i].user_image_small;
				if(img==null || img==""){
					img = "images/my_tx.png";
				}else{
					img = domain + img;
				}
				//根据用户是否登陆显示是否关注 0关注 1 取消关注
			var attention=result[i].attention_type;//是否关注
			var attention_html="+关注";
			if (attention==1) {
				attention_html="取关";
			}
				//填充
			   html += "<li name='invest_ids' id="+result[i].invest_id+"><div class='li_fl'><em><img src='"+img+"' class='circle' /></em>"
					 + "<p>投资顾问</p></div><div class='li_fr'><div class='det_up'><a href='javascript:void(0);' class='att_btn' name="+i+" id='subInvest"+i+"' > "+attention_html+"</a>"
					 + "<h4 id='inverst_names"+i+"'>"+result[i].user_name+"<em>"+result[i].address+"</em></h4><span name="+result[i].view_counts+" id='fans_num"+i+"'><i></i> "+result[i].view_counts+"</span></div>"
					 + "<div class='det_lower'><div class='ui layout'><div class='row-1'>"
					 + "<p>组合  "+result[i].port_num+"</p></div><div class='row-1'><p>答题  "+result[i].answer_num+"</p></div><div class='row-1'>"
					 + "<p>观点 "+result[i].view_num+"</p></div></div></div></div></li>";
				
		 }
		
		 $(_pageId + "#adviserlist").append(html);
	}
	
	
	
	/**
	 * 初始化上下滑动组件 
	 */
	function initVIScroll(num){
		if(!vIscroll._init){
			var config = {
					"isPagingType": false,		//false表示是微博那种累加形式，true表示分页形式
					"visibleHeight": $(window).height()-$(_pageId +".header").height()-$(_pageId+".xz_search_box").height()-15,//显示内容区域的高度，当isPaingType为false时传
					"container": $(_pageId+" #v_container_div"),
					"wrapper":$(_pageId+" #v_wrapper_div"),	
					"downHandle": function() {				//下拉获取上一页数据方法
						curPage = 1;						//上拉将当前页数设置为1
						//查询数据
						queryAdviserlist("html");
					},
					"upHandle": function() {				//上拉获取下一页数据方法
						if(curPage < totalPage)				//判断当前页数是不是小于总页数
						{
							curPage++;
							queryAdviserlist("append"); 
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
		 $(_pageId + "#adviserlist").html("");
		//销毁滑动插件
		if(vIscroll._init == true){
			vIscroll.scroll.destroy(); //销毁
			vIscroll.scroll = null;
			vIscroll._init = false; 
		}
		curPage = 1;		//当前页数
		totalPage=1;		//后台返回的总页数
	    numPerPage = 10;
		totalRows = 0;     //总条数
		num = 0;
	}

	var adviser_index = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = adviser_index;
});