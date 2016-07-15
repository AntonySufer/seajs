/**
 *  持仓详情
 * @author 余一一
 * @date 2016-03-15
 */
define("ytg/scripts/ytgMatch/public/positionEnd", function(require, exports, module) {
	var appUtils = require("appUtils"), 
    layerUtils = require("layerUtils"), 
    gconfig = require("gconfig"),
    ytgMatchService = require("ytgMatchService"),//服务
	pageCode = "ytgMatch/public/positionEnd", 
	_pageId = "#ytgMatch_public_positionEnd ";

	//页面公共JS
	var pageCommon = require("pageCommon");
		
	function init() {
			user_id = appUtils.getSStorageInfo('userId',true);//获取用户s
			account_id = appUtils.getSStorageInfo("account_id");//获取组合id
			if (!account_id) {
				account_id = appUtils.getPageParam("account_id");//用户
			}
			//查询组合基本信息
			getPortfolioInfo();
			queryPortfolioSumCb();//稳健等
		}
		
		/**
		 * 事件绑定
		 */
		function bindPageEvent() {
			//头部菜单绑定事件
			pageCommon.headerMenuFunc(_pageId,pageCode);
			//头部返回
			appUtils.bindEvent($(_pageId + ".back_btn"), function(e) {
				appUtils.pageBack();
			});
			
			//头部返回
			appUtils.bindEvent($(_pageId + "#analysis"), function(e) {
				appUtils.pageInit(pageCode,"ytgMatch/public/analysis",{"account_id":account_id});
				
			});
			
		}
		
		//***************************【初始化方法】***********************************//
		/**
		 * 查询组合基本信息
		 * */
		function getPortfolioInfo(){
			var param = {
					"account_id" : account_id //组合id
			};
			ytgMatchService.queryPortfolioDetails(param,function callBack(resultVo){
				if(Number(resultVo.error_no) == 0){
					//layerUtils.iMsg(0,"查询组合信息成功");
					var result = resultVo.results;
					if (result) {
					var item =result[0];
					var total_yield = (Number(item.total_yield)*100).toFixed(2); //总收益
					$(_pageId+"#all_yeled").html(total_yield+"<span>%</span>");//收益
					$(_pageId+"#rankings").html(item.total_yield_rankings);//排名
					$(_pageId+"#name").html(item.name);//排名
					var small_img =result.face_image_small?result.face_image_small:"images/my_tx.png";
					$(_pageId + "#small_img").attr("src",small_img);//头像
					
					}
					
				}
				else{
					
					layerUtils.iAlert("查询组合信息失败:"+resultVo.error_info,-1);
				}
			});
		}
		
		
		//查询 模拟炒股帐号数据统计 (稳健 保守等)
		function queryPortfolioSumCb(){
			
			var param={
					"account_id":account_id
			      };
			ytgMatchService.queryPortfolioSumByAccountId(param,function callBack(resultVo){
				if(0==Number(resultVo.error_no)){
					var result = resultVo.results;
					if(result != null && result.length>0){
						var data=result[0];
					 $(_pageId+ "#caozuo_style").html(data.risk_rank);//操作类型
					}
					
				}
				else{
					layerUtils.iAlert("交易动态详情加载失败:"+resultVo.error_info,-1);
				}
			});
		}
		   
		

		
		//*********************************************************************//
		
		/**
		 * 销毁
		 */
		function destroy() {
			//隐藏菜单以及遮罩层
			pageCommon.hideHeaderMenuFunc(_pageId);

		}

		var positionEnd = {
			"init" : init,
			"bindPageEvent" : bindPageEvent,
			"destroy" : destroy
		};

		module.exports = positionEnd;
	});