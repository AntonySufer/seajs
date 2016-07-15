/**
 * H5分享
 */
define("ytg/scripts/demo/share", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
	    validatorUtil = require("validatorUtil"),
        gconfig = require("gconfig"),
        pageCommon = require("pageCommon"),
        
        userService = require("userService"),
		
		pageCode = "demo/share", 
		_pageId = "#demo_share ";
	
	//全局变量
	var isCanCommit = true; //表单是否可以提交
	
	/**
	 * 初始化
	 */
	function init() {
		//alert("登录");
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent() {
		//分享
		appUtils.bindEvent($(_pageId + "#QqShare"), function(e) {
			alert("分享到qq");
			QqShare();
		});
		
	}
	
	//***************************【绑定方法】******************************//
	/**
	 * 分享到qq
	 * */
	function QqShare(){
		(function(){
			var p = {
					url:location.href, /*获取URL，可加上来自分享到QQ标识，方便统计*/
					desc:'', /*分享理由(风格应模拟用户对话),支持多分享语随机展现（使用|分隔）*/
					title:'', /*分享标题(可选)*/
					summary:'', /*分享摘要(可选)*/
					pics:'', /*分享图片(可选)*/
					flash: '', /*视频地址(可选)*/
					site:'', /*分享来源(可选) 如：QQ分享*/
					style:'201',
					width:32,
					height:32
			};
			var s = [];
			for(var i in p){
				s.push(i + '=' + encodeURIComponent(p[i]||''));
			}
			document.write(['<a class="qcShareQQDiv" href="http://connect.qq.com/widget/shareqq/index.html?',s.join('&'),'" target="_blank">分享到QQ</a>'].join(''));
		})();
	}
	
	//***************************【初始化方法】******************************//
	
	//*********************************************************************//
	
	/**
	 * 销毁
	 */
	function destroy() {
		//重置页面所有的输入值
		appUtils.pageResetValue();
		$(_pageId).find("input").val("");
	}

	var demo_share = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = demo_share;
});