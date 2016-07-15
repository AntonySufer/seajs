/**
 * 程序入口配置读取
 * 项目开发时需要的自定义配置
 */
define(function(require, exports, module) {
	var configuration = {
		/*******************************************必配项***************************************************/
		/**
		 * 平台，不传默认为0：
		 * 0：pc或者手机浏览器、1：android手机壳子嵌phonegap、2：ios手机壳子嵌phonegap、
		 * 3：ios手机壳子嵌AIR、4：android手机跳转web、5：ios手机跳转web、
		 * 默认为：0
		 */
		"platform": "0",
		/**
		 * 项目的默认页面，当在地址栏输入的url不带pageCode（“#!/”至“.html”中间的部分）时进入该配置对应的页面，
		 * 这个参数是不带pageCode时进入默认页面的入参
		 * 默认为：{}
		 */
		"defaultPage": {"pageCode": "index", "jsonParam":{}},
		/******************************************选择可配项************************************************/
		/**
		 * hSea根路径，项目中的文件uri最终会在项目访问的web路径后添加
		 */
//		"seaBaseUrl": "/m/",
		/**
		 * 项目模块名，默认为project
		 */
		"projName": "ytg",
		/**
		 * 项目中的需要先加载的css样式文件，如果多个，添加在数组里面中，从css目录下写文件路径
		 * 不配默认为：["/css/app_style.css"]
		 */
		"firstLoadCss": ["/css/animate.css", "/css/common.css","/css/style.css","/css/ui-font.css","/css/my.css","/css/cssreset.min.css","/css/match.css"],
		/**
		 * 后台返回结果集出参结构，类似error_no、error_info的出参命名定义，
		 * 防止不同项目的后台的出参命名不一致，以便框架可取配置的值，由项目自己定义，但后台必须统一
		 * 不配默认为：{"error_no": "error_no", "error_info": "error_info"}
		 */
		"resultsParser": {"error_no": "error_no", "error_info": "error_info"},
		/**
		 * 前端根据后台的error_no做的过滤器配置，需要后台配合定义error_no，
		 * 有的需要跳转页面，有的只做提示，提示信息如果后台给出，就取后台提示信息，否则取配置中的error_info字段
		 * 不配默认为：{}
		 */
		"filters": {
//			"-999": {"pageCode": "person/userLogin", "jsonParam": {}, "error_info":"请先登录"}, //用户没有登陆
			"-999": {"moduleAlias":"common", "moduleFuncName":"filterLoginOut"} //用户没有登陆或者登陆超时
		},
		/**
		 * 整个项目的登录页面
		 * 不配默认为：{}
		 */
		"loginPage": {"pageCode": "index", "jsonParam":{}},
		/**
		 * 整个应用的引导页配置
		 * 不配默认为：{}
		 */
		"guidePage": {"pageCode": "index", "jsonParam":{}},
		/**
		 * 项目中公用模块的别名配置
		 * 不配默认为：{}
		 */
		"pAlias": {
			"common":"ytg/scripts/common/common",
			"pageCommon" : "ytg/scripts/common/pageCommon",
			
			/*前端service层调用接口*/
			"investService":"ytg/service/investService",
			"pointService":"ytg/service/pointService",
			"portfolioService":"ytg/service/portfolioService",
			"queryService":"ytg/service/queryService",
			"quesService":"ytg/service/quesService",
			"userService":"ytg/service/userService",
			
			/*炒股大赛接口 */
			"ytgMatchService":"ytg/service/ytgMatchService",
			"ytgMatchCommon":"ytg/scripts/ytgMatch/common/common",
			"highcharts":"1.2.2/plugins/charts/scripts/highcharts_145c04a4",  //highcharts底层代码
			"drowCharts":"ytg/scripts/ytgMatch/common/drowcharts" , //hichart绘制图形
			/*炒股大赛接口结束 */
			
			"firstLoad":"ytg/scripts/common/firstLoad",
			"weixinpk":"gh_0c39e30f57c5"//站点默认公众号weixinpk
				
				
				
		},
		/**
		 * 权限校验规则，提供在外面的方法
		 * common为项目通用模块配置的别名，checkPermission方法里面写校验规则，返回true或者false，避免写异步的代码
		 * 不配默认为：{}
		 */
//		"checkPermission": {"moduleAlias":"common", "moduleFuncName":"checkPermission"},
		/**
		 * 第一次加载第一个业务模块前所需要的处理，即启动之后提供给外界初始化的接口，
		 * 这个方法中避免写异步操作，或者保证异步影响其他代码逻辑
		 * common为项目通用模块配置的别名，firstLoadFunc为执行的方法
		 * 这个配置可以做很多事情，当你从业务模块逻辑上不好实现时，可以考虑这里！！
		 * 不配默认为：{}
		 */
//		"firstLoadIntf": {"moduleAlias":"common", "moduleFuncName":"firstLoadFunc"},
		/**
		 * 项目中需要调用到的常量、变量这里配置，调用方式，通过require("gconfig").global.*来调用
		 * 不配默认为：{}
		 */
		"global": {
//			"domain" : "http://zxlcs.hualin.com:10294",
			"domain" : "http://113.105.85.104:9011",
//			"domain" : "http://192.168.11.62:8888",
			"ticketImage":"/servlet/Image",
	//		"serverPath":"/servlet/json" //后台接口地址,
//			"serverPath":"http://192.168.9.94:8888/servlet/json" //后台接口地址,
			"serverPath":"http://113.105.85.104:9011/servlet/json" //后台接口地址,
//			"serverPath":"http://zxlcs.hualin.com:10294/servlet/json" //后台接口地址,
//			"weixinPath":"http://113.105.85.104:9011/gateway/Oauth2",
//			"weixinpk":"gh_c4cc5f58aeca"
		


		},
		/**
		 * Android手机返回键处理，退出应用还是返回上级页面，true-退出应用，false-返回页面，默认为true
		 * 如果需要返回上一级页面，并最终提示退出应用，需要改为false，并且在一级页面的html上设置“data-pageLevel="1"”
		 * 不配默认为：true
		 */
		"isDirectExit": false,
		/**
		 * 弹出层各种弹出层主题样式，默认为系统自带
		 * 不配默认为："default"
		 */
		"layerTheme": "d",
		/**
		 * ajax请求超时时间设置，默认为20秒之后超时
		 * 不配默认为：20秒
		 */
		"ajaxTimeout": 20,
		/**
		 * 当弹出等待层时（iLoading），点击遮罩层是否关闭遮罩，关闭后用户可操作页面
		 * 不配默认为：false
		 */
		"isClickShadeHide": false
	};
	
	//暴露对外的接口
	module.exports = window.configuration = configuration;
});