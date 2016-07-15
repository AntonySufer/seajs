/**
 * 我的组合
 * 描述：普通用户只能有一个组合，投顾用户可以有多个组合
 */
define("ytg/scripts/userSpace/myPortfolio/myPortfolio", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
        
        portfolioService = require("portfolioService"),
		
		pageCode = "userSpace/myPortfolio/myPortfolio", 
		_pageId = "#userSpace_myPortfolio_myPortfolio ";
	
	//全局变量
	var user_id = null;
	var user_type = null;
		
	//页面公共JS
	var pageCommon = require("pageCommon");
	/**
	 * 初始化
	 */
	function init() {
		user_id = appUtils.getSStorageInfo('userId',true);
	/*	if(user_id==null||""==user_id||undefined==user_id){
	    	layerUtils.iAlert("您尚未登录！",-1);
			appUtils.pageInit(pageCode,"index");
		}*/
		user_type = appUtils.getSStorageInfo('userType',true);
		//查询我的组合列表
		getPortfolioList();
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent() {
		//头部菜单绑定事件
		pageCommon.headerMenuFunc(_pageId,pageCode);
		//头部返回
		appUtils.bindEvent($(_pageId + ".icon_back"), function(e) {
			$(_pageId + "#myPortfolioList").html(" ");
			if(user_type == 0){
				appUtils.pageInit(pageCode,"userSpace/index");
			}
			else{
				appUtils.pageInit(pageCode,"adviserSpace/index");
			}
		});
		
		//创建组合图标
		appUtils.bindEvent($(_pageId + ".adv_nav_iocn"), function(e) {
			appUtils.pageInit(pageCode,"userSpace/myPortfolio/createPortfolio");
		});
		
		//创建组合 文字提示(无组合数据时)
		appUtils.preBindEvent($(_pageId + "#myPortfolioList"),"#toCreatePort",function(e) {
			appUtils.pageInit(pageCode,"userSpace/myPortfolio/createPortfolio");
		});
		
		//进入组合详情
		appUtils.preBindEvent($(_pageId + "#myPortfolioList"),"li", function(e) {
			var portfolio_id = $(this).attr("id");
			var portfolio_name = $(this).attr("name");
			appUtils.clearSStorage("portfolioName");
			appUtils.setSStorageInfo("portfolioName",portfolio_name);
			appUtils.clearSStorage("portfolioId");
			appUtils.setSStorageInfo("portfolioId",portfolio_id);
			appUtils.pageInit(pageCode,"userSpace/myPortfolio/portfolioDetail");
		});
	}
	
	//***************************【初始化方法】***********************************//
	
	/**
	 * 查询我的组合(默认查询100个 不分页)
	 * */
	function getPortfolioList(){
		var param = {
				"user_id" : user_id,
				"curPage" : 1,
				"numPerPage" : 100
		};
		portfolioService.queryUsersPortfolioList(param,function callBack(resultVo){
			if(Number(resultVo.error_no) == 0){
				//layerUtils.iMsg(0,"查询我的组合成功");
				var result = resultVo.results;
				fillPortData(result); //将组合数据填充到页面
				
				//当组合列表不为空时，普通用户不能再创建组合，投顾用户依然可以创建组合
				if(user_type == 0){
					$(_pageId + ".adv_nav_iocn").hide();
					$(_pageId + ".menu_iocn:not(.close_iocn)").show();
				}else if(user_type != 0){
					$(_pageId + ".menu_iocn").hide();
					$(_pageId + ".adv_nav_iocn").show();
				}
			}
			else if(resultVo.error_no == '-40832202'){
				//当接口无返回数据时
				//当组合列表为空时，普通用户和投顾用户都可以创建组合
				//这里应该有一张，显示的图片，效果最佳
				$(_pageId + ".adv_nav_iocn").show();
				$(_pageId + ".menu_iocn").hide();
				
				var height = $(window).height()-$(_pageId + ".header").height();
				var html = '<div style="height:'+height+'px; font-size:16px; color:#9999B1; text-align:center; padding-top:150px;">您暂无组合，'+'<a href="javascript:void(0)" style="color:#4286EB" id="toCreatePort">快去创建吧！</a>'+'</div>';
				$(_pageId + "#myPortfolioList").html("");
				$(_pageId + "#myPortfolioList").append(html);
			}
			else{
				layerUtils.iAlert("查询我的组合失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	//将组合数据填充到页面
	function fillPortData(result)
	{
		$(_pageId + "#myPortfolioList").html("");
		var html = "";
		for(var i = 0;i<result.length;i++)
		{
			html += '<li id="'+result[i].portfolio_id+'" name="'+result[i].portfolio_name+'">';
			html += '<a href="javascript:void(0)">';
			html += '<div class="li_det">';
			html += '<div class="ring">';
			html += '<p>总收益</p><strong>'+(Number(result[i].total_yield)*100).toFixed(2)+'<i>%</i></strong>';
			html += '</div>';
			html += '<div class="list_info"><div class="label_box"><span class="ui tag">沪深</span><span></span></div>';
			html += '<div class="mes_box">';
			html += '<h4>'+result[i].portfolio_name+'</h4>';
			html += '<p><span class="user">'+"我的组合"+' </span>';
			if(result[i].sub_num>=1){
			html +=result[i].sub_num+'人关注</p>';
			}else{
				html+=' 0  人关注</p>';
			}
			html += '</div></div></div></a>';
			html += '</li>';
		}
		$(_pageId + "#myPortfolioList").append(html);
	}
	
	//*********************************************************************//
	
	/**
	 * 销毁
	 */
	function destroy() {
		//隐藏菜单以及遮罩层
		pageCommon.hideHeaderMenuFunc(_pageId);
	}

	var userSpace_myPortfolio_myPortfolio = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = userSpace_myPortfolio_myPortfolio;
});