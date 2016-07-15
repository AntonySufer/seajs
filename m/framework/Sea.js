/*! Sea.js 2.1.1 | seajs.org/LICENSE.md
*/(function(t,u){function v(b){return function(c){return Object.prototype.toString.call(c)==="[object "+b+"]"}}function Q(){return w++}function I(b,c){var a;a=b.charAt(0);if(R.test(b))a=b;else if("."===a){a=(c?c.match(E)[0]:h.cwd)+b;for(a=a.replace(S,"/");a.match(J);)a=a.replace(J,"/")}else a="/"===a?(a=h.cwd.match(T))?a[0]+b.substring(1):b:h.base+b;return a}function K(b,c){if(!b)return"";var a=b,d=h.alias,a=b=d&&F(d[a])?d[a]:a,d=h.paths,g;if(d&&(g=a.match(U))&&F(d[g[1]]))a=d[g[1]]+g[2];g=a;var e=h.vars;
e&&-1<g.indexOf("{")&&(g=g.replace(V,function(a,b){return F(e[b])?e[b]:a}));a=g.length-1;d=g.charAt(a);b="#"===d?g.substring(0,a):".js"===g.substring(a-2)||0<g.indexOf("?")||".css"===g.substring(a-3)||"/"===d?g:g+".js";g=I(b,c);var a=h.map,l=g;if(a)for(var d=0,f=a.length;d<f&&!(l=a[d],l=x(l)?l(g)||g:g.replace(l[0],l[1]),l!==g);d++);return l}function L(b,c){var a=b.sheet,d;if(M)a&&(d=!0);else if(a)try{a.cssRules&&(d=!0)}catch(g){"NS_ERROR_DOM_SECURITY_ERR"===g.name&&(d=!0)}setTimeout(function(){d?
c():L(b,c)},20)}function W(){if(y)return y;if(z&&"interactive"===z.readyState)return z;for(var b=s.getElementsByTagName("script"),c=b.length-1;0<=c;c--){var a=b[c];if("interactive"===a.readyState)return z=a}}function e(b,c){this.uri=b;this.dependencies=c||[];this.exports=null;this.status=0;this._waitings={};this._remain=0}if(!t.seajs){var f=t.seajs={version:"2.1.1"},h=f.data={},X=v("Object"),F=v("String"),A=Array.isArray||v("Array"),x=v("Function"),w=0,p=h.events={};f.on=function(b,c){(p[b]||(p[b]=
[])).push(c);return f};f.off=function(b,c){if(!b&&!c)return p=h.events={},f;var a=p[b];if(a)if(c)for(var d=a.length-1;0<=d;d--)a[d]===c&&a.splice(d,1);else delete p[b];return f};var m=f.emit=function(b,c){var a=p[b],d;if(a)for(a=a.slice();d=a.shift();)d(c);return f},E=/[^?#]*\//,S=/\/\.\//g,J=/\/[^/]+\/\.\.\//,U=/^([^/:]+)(\/.+)$/,V=/{([^{]+)}/g,R=/^\/\/.|:\//,T=/^.*?\/\/.*?\//,n=document,q=location,B=q.href.match(E)[0],k=n.getElementsByTagName("script"),k=n.getElementById("seajsnode")||k[k.length-
1],k=((k.hasAttribute?k.src:k.getAttribute("src",4))||B).match(E)[0],s=n.getElementsByTagName("head")[0]||n.documentElement,N=s.getElementsByTagName("base")[0],O=/\.css(?:\?|$)/i,Y=/^(?:loaded|complete|undefined)$/,y,z,M=536>1*navigator.userAgent.replace(/.*AppleWebKit\/(\d+)\..*/,"$1"),Z=/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g,$=/\\\\/g,r=f.cache={},C,G={},H={},D={},j=e.STATUS={FETCHING:1,
SAVED:2,LOADING:3,LOADED:4,EXECUTING:5,EXECUTED:6};e.prototype.resolve=function(){for(var b=this.dependencies,c=[],a=0,d=b.length;a<d;a++)c[a]=e.resolve(b[a],this.uri);return c};e.prototype.load=function(){if(!(this.status>=j.LOADING)){this.status=j.LOADING;var b=this.resolve();m("load",b);for(var c=this._remain=b.length,a,d=0;d<c;d++)a=e.get(b[d]),a.status<j.LOADED?a._waitings[this.uri]=(a._waitings[this.uri]||0)+1:this._remain--;if(0===this._remain)this.onload();else{for(var g={},d=0;d<c;d++)a=
r[b[d]],a.status<j.FETCHING?a.fetch(g):a.status===j.SAVED&&a.load();for(var h in g)if(g.hasOwnProperty(h))g[h]()}}};e.prototype.onload=function(){this.status=j.LOADED;this.callback&&this.callback();var b=this._waitings,c,a;for(c in b)if(b.hasOwnProperty(c)&&(a=r[c],a._remain-=b[c],0===a._remain))a.onload();delete this._waitings;delete this._remain};e.prototype.fetch=function(b){function c(){var a=g.requestUri,b=g.onRequest,c=g.charset,d=O.test(a),e=n.createElement(d?"link":"script");if(c&&(c=x(c)?
c(a):c))e.charset=c;var f=e;d&&(M||!("onload"in f))?setTimeout(function(){L(f,b)},1):f.onload=f.onerror=f.onreadystatechange=function(){Y.test(f.readyState)&&(f.onload=f.onerror=f.onreadystatechange=null,!d&&!h.debug&&s.removeChild(f),f=null,b())};d?(e.rel="stylesheet",e.href=a):(e.async=!0,e.src=a);y=e;N?s.insertBefore(e,N):s.appendChild(e);y=null}function a(){delete G[f];H[f]=!0;C&&(e.save(d,C),C=null);var a,b=D[f];for(delete D[f];a=b.shift();)a.load()}var d=this.uri;this.status=j.FETCHING;var g=
{uri:d};m("fetch",g);var f=g.requestUri||d;!f||H[f]?this.load():G[f]?D[f].push(this):(G[f]=!0,D[f]=[this],m("request",g={uri:d,requestUri:f,onRequest:a,charset:h.charset}),g.requested||(b?b[g.requestUri]=c:c()))};e.prototype.exec=function(){function b(a){return e.get(b.resolve(a)).exec()}if(this.status>=j.EXECUTING)return this.exports;this.status=j.EXECUTING;var c=this.uri;b.resolve=function(a){return e.resolve(a,c)};b.async=function(a,g){e.use(a,g,c+"_async_"+w++);return b};var a=this.factory,a=
x(a)?a(b,this.exports={},this):a;a===u&&(a=this.exports);null===a&&!O.test(c)&&m("error",this);delete this.factory;this.exports=a;this.status=j.EXECUTED;m("exec",this);return a};e.resolve=function(b,c){var a={id:b,refUri:c};m("resolve",a);return a.uri||K(a.id,c)};e.define=function(b,c,a){var d=arguments.length;1===d?(a=b,b=u):2===d&&(a=c,A(b)?(c=b,b=u):c=u);if(!A(c)&&x(a)){var g=[];a.toString().replace($,"").replace(Z,function(a,b,c){c&&g.push(c)});c=g}d={id:b,uri:e.resolve(b),deps:c,factory:a};if(!d.uri&&
n.attachEvent){var f=W();f&&(d.uri=f.src)}m("define",d);d.uri?e.save(d.uri,d):C=d};e.save=function(b,c){var a=e.get(b);a.status<j.SAVED&&(a.id=c.id||b,a.dependencies=c.deps||[],a.factory=c.factory,a.status=j.SAVED)};e.get=function(b,c){return r[b]||(r[b]=new e(b,c))};e.use=function(b,c,a){var d=e.get(a,A(b)?b:[b]);d.callback=function(){for(var a=[],b=d.resolve(),e=0,f=b.length;e<f;e++)a[e]=r[b[e]].exec();c&&c.apply(t,a);delete d.callback};d.load()};e.preload=function(b){var c=h.preload,a=c.length;
a?e.use(c,function(){c.splice(0,a);e.preload(b)},h.cwd+"_preload_"+w++):b()};f.use=function(b,c){e.preload(function(){e.use(b,c,h.cwd+"_use_"+w++)});return f};e.define.cmd={};t.define=e.define;f.Module=e;h.fetchedList=H;h.cid=Q;f.resolve=K;f.require=function(b){return(r[e.resolve(b)]||{}).exports};h.base=(k.match(/^(.+?\/)(\?\?)?(seajs\/)+/)||["",k])[1];h.dir=k;h.cwd=B;h.charset="utf-8";var B=h,P=[],q=q.search.replace(/(seajs-\w+)(&|$)/g,"$1=1$2"),q=q+(" "+n.cookie);q.replace(/(seajs-\w+)=1/g,function(b,
c){P.push(c)});B.preload=P;f.config=function(b){for(var c in b){var a=b[c],d=h[c];if(d&&X(d))for(var e in a)d[e]=a[e];else A(d)?a=d.concat(a):"base"===c&&("/"===a.slice(-1)||(a+="/"),a=I(a)),h[c]=a}m("config",b);return f}}})(this);

;!(function(window, undefined) {
	var oProjConfig = null; // 项目的配置信息 
	seajs._sysVersion = window._sysVersion ? window._sysVersion : 1;
	seajs._configFileName = window._configFileName ? window._configFileName : "configuration";
	seajs.use("./" + seajs._configFileName + ".js?v=" + seajs._sysVersion, function(configuration){
		oProjConfig = configuration;
		seajs.use("../globalConfig.js?v=" + seajs._sysVersion, function(projGlobalConfig){
			projGlobalConfig = projGlobalConfig || {};
			if(typeof(oProjConfig.platform) == "undefined" || oProjConfig.platform == "")
			{
				oProjConfig.platform = projGlobalConfig.platform || "0";
			}
			if(typeof(oProjConfig.seaBaseUrl) == "undefined" || oProjConfig.seaBaseUrl == "")
			{
				oProjConfig.seaBaseUrl = projGlobalConfig.seaBaseUrl || "/m/";
			}
			initSeajsConfig(); // 初始化seajs配置项
			doInit(); // 执行初始化操作
		});
	});
	
	/**
	 * 初始化seajs配置项
	 */
	function initSeajsConfig()
	{
		/**
		 * seajs的配置信息
		 */
		seajs.config({
			_preDo: (function(win) { //起初框架做的处理
				//浏览器运行环境相关信息
				var u = navigator.userAgent;
				var iBrowser = {
					//是否为移动终端 ，/Mobile/i.test(u) 与 /AppleWebKit.*Mobile/i.test(u)重复，后期再看具体怎么区分
					mobile: /Mobile/i.test(u) || /AppleWebKit.*Mobile/i.test(u) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(u)),
					//是否为PC端
					pc: !(/Mobile/i.test(u) || /AppleWebKit.*Mobile/i.test(u) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(u))),
					android: u.indexOf('Android') > -1, //是否为android终端
					ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //是否为ios终端
					iPhone: u.indexOf('iPhone') > -1, //是否为iPhone
					iPad: u.indexOf('iPad') > -1, //是否iPad
			        trident: u.indexOf('Trident') > -1, //是否为IE内核
			        presto: u.indexOf('Presto') > -1, //是否为opera内核
			        webKit: u.indexOf('AppleWebKit') > -1, //是否为苹果、谷歌内核
			        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //是否为火狐内核
					language: (navigator.browserLanguage || navigator.language).toLowerCase(),
					app: navigator.appVersion,
					weixin: /MicroMessenger/i.test(u), //是否为微信浏览器
					uc: /UCWEB|UcBrowser/i.test(u), //是否为uc浏览器
					qq: /QQBrowser/i.test(u) //是否为qq浏览器
				};
				win.iBrowser = iBrowser;
				
				//添加调试信息方法
				console.printStackTrace = function(e) {
					var message = e.message, stack = e.stack;
					if(message) { console.log("错误说明：" + message); }
					if(stack) { console.log("错误堆栈：" + stack); }
				};
			})(window),
			vars: (function() {
				var platRoot = "";
				switch (oProjConfig.platform + "") {
					case "0":
						platRoot = ""; //pc上为""
						break;
					case "1":
						platRoot = "file://" + window.location.pathname.substring(0, window.location.pathname.lastIndexOf("www/")+3); //以前是"file:///android_asset/www"，为了支持动态H5升级改成动态取地址
						break;
					case "2":
						platRoot = "file://" + window.location.pathname.substring(0, window.location.pathname.lastIndexOf("www/")+4);
						break;
					case "3":
						platRoot = "appfile:"; //ios嵌air为"appfile:"，有时和等于2的值时一样的
						break;
					case "4":
						platRoot = "";
						break;
					case "5":
						platRoot = "";
						break;
					default:
						platRoot = "";
						break;
				}
				console.log("~~"+platRoot);
				seajs._platRoot = platRoot;
				return {
					"platRoot": seajs._platRoot,
					"pluginBaseUrl": seajs._platRoot + oProjConfig.seaBaseUrl
				};
			})(),
			base: seajs._platRoot + oProjConfig.seaBaseUrl,
		    alias: (function() {
		    	var alias = { "jquery": "/framework/base/jquery/jquery_fda6b489", "jquery_scrollto": "/framework/base/jquery/jquery_scrollto_1bb69295", "ajax": "/framework/base/lang/ajax_194df9ce", "appUtils": "/framework/base/lang/appUtils_f8b8d996", "extnative": "/framework/base/lang/extnative_a1b4d9ee", "gconfig": "/framework/base/lang/gconfig_37984852", "map": "/framework/base/lang/map_5c060a79", "main": "/framework/base/main_560cc688", "sea": "/framework/base/seajs/sea_cea777a2", "startup": "/framework/base/startup_5a131923", "chartsUtils": "{pluginBaseUrl}framework/plugins/charts/scripts/chartsUtils_96d7369c", "highcharts": "{pluginBaseUrl}framework/plugins/charts/scripts/highcharts_145c04a4", "icharts": "{pluginBaseUrl}framework/plugins/charts/scripts/icharts_75d020c4", "ichartsUtils": "{pluginBaseUrl}framework/plugins/charts/scripts/ichartsUtils_0bdb763a", "aes": "{pluginBaseUrl}framework/plugins/endecrypt/scripts/aes_c0df41f4", "des": "{pluginBaseUrl}framework/plugins/endecrypt/scripts/des_cf444a2a", "endecryptUtils": "{pluginBaseUrl}framework/plugins/endecrypt/scripts/endecryptUtils_14cda0f8", "rsa": "{pluginBaseUrl}framework/plugins/endecrypt/scripts/rsa_0e10c50c", "fIscroll": "{pluginBaseUrl}framework/plugins/iscroll/scripts/fIscroll_e37cea46", "hIscroll": "{pluginBaseUrl}framework/plugins/iscroll/scripts/hIscroll_3bb0e4a7", "iscroll": "{pluginBaseUrl}framework/plugins/iscroll/scripts/iscroll_c9b0353b", "shIscroll": "{pluginBaseUrl}framework/plugins/iscroll/scripts/shIscroll_c18d2aee", "svIscroll": "{pluginBaseUrl}framework/plugins/iscroll/scripts/svIscroll_16c92dd9", "vIscroll": "{pluginBaseUrl}framework/plugins/iscroll/scripts/vIscroll_c7db0b19", "keyPanel": "{pluginBaseUrl}framework/plugins/keypanel/scripts/keyPanel_141ed75a", "keyType1": "{pluginBaseUrl}framework/plugins/keypanel/scripts/keyType1_cf181f7d", "keyType2": "{pluginBaseUrl}framework/plugins/keypanel/scripts/keyType2_14b816b1", "keyType3": "{pluginBaseUrl}framework/plugins/keypanel/scripts/keyType3_1f456338", "keyType4": "{pluginBaseUrl}framework/plugins/keypanel/scripts/keyType4_d73a0d70", "keyType5": "{pluginBaseUrl}framework/plugins/keypanel/scripts/keyType5_379e2259", "layer": "{pluginBaseUrl}framework/plugins/layer/scripts/layer_3679a168", "layerUtils": "{pluginBaseUrl}framework/plugins/layer/scripts/layerUtils_51307981", "dateUtils": "{pluginBaseUrl}framework/plugins/mobiscroll/scripts/dateUtils_f5c94113", "mobiscroll": "{pluginBaseUrl}framework/plugins/mobiscroll/scripts/mobiscroll_c6a7d2d1", "external": "{pluginBaseUrl}framework/plugins/nativeintf/scripts/external_33d44919", "msgFunction": "{pluginBaseUrl}framework/plugins/nativeintf/scripts/msgFunction_04a557b4", "nativePluginService": "{pluginBaseUrl}framework/plugins/nativeintf/scripts/nativePluginService_208c0428", "pagingUtils": "{pluginBaseUrl}framework/plugins/page/scripts/pagingUtils_ccee5a01", "service": "{pluginBaseUrl}framework/plugins/service/scripts/base/service_f6180aa1", "validatorUtil": "{pluginBaseUrl}framework/plugins/validator/scripts/validatorUtil_6f874fc6" };
		    	
		        //处理项目中模块的别名
		        var pAlias = oProjConfig.pAlias || {};
		        for (var i in pAlias) {
		        	if(pAlias.hasOwnProperty(i))
		        	{
			            alias[i] = pAlias[i];
		        	}
		        }
		        return alias;
		    })(window),
		    map: [ [ /^(.*\/(^base)\/.*\.(?:css|js))(?:.*)$/i, '$1?v='+seajs._sysVersion ] ],
		    charset: "utf-8"
		});
	}
	
	/**
	 * 执行初始化操作
	 */
	function doInit()
	{
		//不同平台延时不同，这里依平台可再修改
		var delayTime = 0;
		switch (oProjConfig.platform + "") {
			case "0":
				delayTime = 0;
				break;
			case "1":
				delayTime = 800;
				break;
			case "2":
				delayTime = 200;
				break;
			default:
				delayTime = 0;
				break;
		}
		setTimeout(function() {
			seajs.use(["main", "jquery"], function(main, $){
				$(document).ready(function(){
					main.init();
				});
			});
		}, delayTime);
	}
})( window );
/*! jQuery v1.8.2 jquery.com | jquery.org/license */
define("/framework/base/jquery/jquery_fda6b489", [], function(require, exports, module) {
    (function(a, b) {
        function G(a) {
            var b = F[a] = {};
            return p.each(a.split(s), function(a, c) {
                b[c] = !0;
            }), b;
        }
        function J(a, c, d) {
            if (d === b && a.nodeType === 1) {
                var e = "data-" + c.replace(I, "-$1").toLowerCase();
                d = a.getAttribute(e);
                if (typeof d == "string") {
                    try {
                        d = d === "true" ? !0 : d === "false" ? !1 : d === "null" ? null : +d + "" === d ? +d : H.test(d) ? p.parseJSON(d) : d;
                    } catch (f) {}
                    p.data(a, c, d);
                } else d = b;
            }
            return d;
        }
        function K(a) {
            var b;
            for (b in a) {
                if (b === "data" && p.isEmptyObject(a[b])) continue;
                if (b !== "toJSON") return !1;
            }
            return !0;
        }
        function ba() {
            return !1;
        }
        function bb() {
            return !0;
        }
        function bh(a) {
            return !a || !a.parentNode || a.parentNode.nodeType === 11;
        }
        function bi(a, b) {
            do a = a[b]; while (a && a.nodeType !== 1);
            return a;
        }
        function bj(a, b, c) {
            b = b || 0;
            if (p.isFunction(b)) return p.grep(a, function(a, d) {
                var e = !!b.call(a, d, a);
                return e === c;
            });
            if (b.nodeType) return p.grep(a, function(a, d) {
                return a === b === c;
            });
            if (typeof b == "string") {
                var d = p.grep(a, function(a) {
                    return a.nodeType === 1;
                });
                if (be.test(b)) return p.filter(b, d, !c);
                b = p.filter(b, d);
            }
            return p.grep(a, function(a, d) {
                return p.inArray(a, b) >= 0 === c;
            });
        }
        function bk(a) {
            var b = bl.split("|"), c = a.createDocumentFragment();
            if (c.createElement) while (b.length) c.createElement(b.pop());
            return c;
        }
        function bC(a, b) {
            return a.getElementsByTagName(b)[0] || a.appendChild(a.ownerDocument.createElement(b));
        }
        function bD(a, b) {
            if (b.nodeType !== 1 || !p.hasData(a)) return;
            var c, d, e, f = p._data(a), g = p._data(b, f), h = f.events;
            if (h) {
                delete g.handle, g.events = {};
                for (c in h) for (d = 0, e = h[c].length; d < e; d++) p.event.add(b, c, h[c][d]);
            }
            g.data && (g.data = p.extend({}, g.data));
        }
        function bE(a, b) {
            var c;
            if (b.nodeType !== 1) return;
            b.clearAttributes && b.clearAttributes(), b.mergeAttributes && b.mergeAttributes(a), 
            c = b.nodeName.toLowerCase(), c === "object" ? (b.parentNode && (b.outerHTML = a.outerHTML), 
            p.support.html5Clone && a.innerHTML && !p.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : c === "input" && bv.test(a.type) ? (b.defaultChecked = b.checked = a.checked, 
            b.value !== a.value && (b.value = a.value)) : c === "option" ? b.selected = a.defaultSelected : c === "input" || c === "textarea" ? b.defaultValue = a.defaultValue : c === "script" && b.text !== a.text && (b.text = a.text), 
            b.removeAttribute(p.expando);
        }
        function bF(a) {
            return typeof a.getElementsByTagName != "undefined" ? a.getElementsByTagName("*") : typeof a.querySelectorAll != "undefined" ? a.querySelectorAll("*") : [];
        }
        function bG(a) {
            bv.test(a.type) && (a.defaultChecked = a.checked);
        }
        function bY(a, b) {
            if (b in a) return b;
            var c = b.charAt(0).toUpperCase() + b.slice(1), d = b, e = bW.length;
            while (e--) {
                b = bW[e] + c;
                if (b in a) return b;
            }
            return d;
        }
        function bZ(a, b) {
            return a = b || a, p.css(a, "display") === "none" || !p.contains(a.ownerDocument, a);
        }
        function b$(a, b) {
            var c, d, e = [], f = 0, g = a.length;
            for (;f < g; f++) {
                c = a[f];
                if (!c.style) continue;
                e[f] = p._data(c, "olddisplay"), b ? (!e[f] && c.style.display === "none" && (c.style.display = ""), 
                c.style.display === "" && bZ(c) && (e[f] = p._data(c, "olddisplay", cc(c.nodeName)))) : (d = bH(c, "display"), 
                !e[f] && d !== "none" && p._data(c, "olddisplay", d));
            }
            for (f = 0; f < g; f++) {
                c = a[f];
                if (!c.style) continue;
                if (!b || c.style.display === "none" || c.style.display === "") c.style.display = b ? e[f] || "" : "none";
            }
            return a;
        }
        function b_(a, b, c) {
            var d = bP.exec(b);
            return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b;
        }
        function ca(a, b, c, d) {
            var e = c === (d ? "border" : "content") ? 4 : b === "width" ? 1 : 0, f = 0;
            for (;e < 4; e += 2) c === "margin" && (f += p.css(a, c + bV[e], !0)), d ? (c === "content" && (f -= parseFloat(bH(a, "padding" + bV[e])) || 0), 
            c !== "margin" && (f -= parseFloat(bH(a, "border" + bV[e] + "Width")) || 0)) : (f += parseFloat(bH(a, "padding" + bV[e])) || 0, 
            c !== "padding" && (f += parseFloat(bH(a, "border" + bV[e] + "Width")) || 0));
            return f;
        }
        function cb(a, b, c) {
            var d = b === "width" ? a.offsetWidth : a.offsetHeight, e = !0, f = p.support.boxSizing && p.css(a, "boxSizing") === "border-box";
            if (d <= 0 || d == null) {
                d = bH(a, b);
                if (d < 0 || d == null) d = a.style[b];
                if (bQ.test(d)) return d;
                e = f && (p.support.boxSizingReliable || d === a.style[b]), d = parseFloat(d) || 0;
            }
            return d + ca(a, b, c || (f ? "border" : "content"), e) + "px";
        }
        function cc(a) {
            if (bS[a]) return bS[a];
            var b = p("<" + a + ">").appendTo(e.body), c = b.css("display");
            b.remove();
            if (c === "none" || c === "") {
                bI = e.body.appendChild(bI || p.extend(e.createElement("iframe"), {
                    frameBorder: 0,
                    width: 0,
                    height: 0
                }));
                if (!bJ || !bI.createElement) bJ = (bI.contentWindow || bI.contentDocument).document, 
                bJ.write("<!doctype html><html><body>"), bJ.close();
                b = bJ.body.appendChild(bJ.createElement(a)), c = bH(b, "display"), e.body.removeChild(bI);
            }
            return bS[a] = c, c;
        }
        function ci(a, b, c, d) {
            var e;
            if (p.isArray(b)) p.each(b, function(b, e) {
                c || ce.test(a) ? d(a, e) : ci(a + "[" + (typeof e == "object" ? b : "") + "]", e, c, d);
            }); else if (!c && p.type(b) === "object") for (e in b) ci(a + "[" + e + "]", b[e], c, d); else d(a, b);
        }
        function cz(a) {
            return function(b, c) {
                typeof b != "string" && (c = b, b = "*");
                var d, e, f, g = b.toLowerCase().split(s), h = 0, i = g.length;
                if (p.isFunction(c)) for (;h < i; h++) d = g[h], f = /^\+/.test(d), f && (d = d.substr(1) || "*"), 
                e = a[d] = a[d] || [], e[f ? "unshift" : "push"](c);
            };
        }
        function cA(a, c, d, e, f, g) {
            f = f || c.dataTypes[0], g = g || {}, g[f] = !0;
            var h, i = a[f], j = 0, k = i ? i.length : 0, l = a === cv;
            for (;j < k && (l || !h); j++) h = i[j](c, d, e), typeof h == "string" && (!l || g[h] ? h = b : (c.dataTypes.unshift(h), 
            h = cA(a, c, d, e, h, g)));
            return (l || !h) && !g["*"] && (h = cA(a, c, d, e, "*", g)), h;
        }
        function cB(a, c) {
            var d, e, f = p.ajaxSettings.flatOptions || {};
            for (d in c) c[d] !== b && ((f[d] ? a : e || (e = {}))[d] = c[d]);
            e && p.extend(!0, a, e);
        }
        function cC(a, c, d) {
            var e, f, g, h, i = a.contents, j = a.dataTypes, k = a.responseFields;
            for (f in k) f in d && (c[k[f]] = d[f]);
            while (j[0] === "*") j.shift(), e === b && (e = a.mimeType || c.getResponseHeader("content-type"));
            if (e) for (f in i) if (i[f] && i[f].test(e)) {
                j.unshift(f);
                break;
            }
            if (j[0] in d) g = j[0]; else {
                for (f in d) {
                    if (!j[0] || a.converters[f + " " + j[0]]) {
                        g = f;
                        break;
                    }
                    h || (h = f);
                }
                g = g || h;
            }
            if (g) return g !== j[0] && j.unshift(g), d[g];
        }
        function cD(a, b) {
            var c, d, e, f, g = a.dataTypes.slice(), h = g[0], i = {}, j = 0;
            a.dataFilter && (b = a.dataFilter(b, a.dataType));
            if (g[1]) for (c in a.converters) i[c.toLowerCase()] = a.converters[c];
            for (;e = g[++j]; ) if (e !== "*") {
                if (h !== "*" && h !== e) {
                    c = i[h + " " + e] || i["* " + e];
                    if (!c) for (d in i) {
                        f = d.split(" ");
                        if (f[1] === e) {
                            c = i[h + " " + f[0]] || i["* " + f[0]];
                            if (c) {
                                c === !0 ? c = i[d] : i[d] !== !0 && (e = f[0], g.splice(j--, 0, e));
                                break;
                            }
                        }
                    }
                    if (c !== !0) if (c && a["throws"]) b = c(b); else try {
                        b = c(b);
                    } catch (k) {
                        return {
                            state: "parsererror",
                            error: c ? k : "No conversion from " + h + " to " + e
                        };
                    }
                }
                h = e;
            }
            return {
                state: "success",
                data: b
            };
        }
        function cL() {
            try {
                return new a.XMLHttpRequest();
            } catch (b) {}
        }
        function cM() {
            try {
                return new a.ActiveXObject("Microsoft.XMLHTTP");
            } catch (b) {}
        }
        function cU() {
            return setTimeout(function() {
                cN = b;
            }, 0), cN = p.now();
        }
        function cV(a, b) {
            p.each(b, function(b, c) {
                var d = (cT[b] || []).concat(cT["*"]), e = 0, f = d.length;
                for (;e < f; e++) if (d[e].call(a, b, c)) return;
            });
        }
        function cW(a, b, c) {
            var d, e = 0, f = 0, g = cS.length, h = p.Deferred().always(function() {
                delete i.elem;
            }), i = function() {
                var b = cN || cU(), c = Math.max(0, j.startTime + j.duration - b), d = 1 - (c / j.duration || 0), e = 0, f = j.tweens.length;
                for (;e < f; e++) j.tweens[e].run(d);
                return h.notifyWith(a, [ j, d, c ]), d < 1 && f ? c : (h.resolveWith(a, [ j ]), 
                !1);
            }, j = h.promise({
                elem: a,
                props: p.extend({}, b),
                opts: p.extend(!0, {
                    specialEasing: {}
                }, c),
                originalProperties: b,
                originalOptions: c,
                startTime: cN || cU(),
                duration: c.duration,
                tweens: [],
                createTween: function(b, c, d) {
                    var e = p.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                    return j.tweens.push(e), e;
                },
                stop: function(b) {
                    var c = 0, d = b ? j.tweens.length : 0;
                    for (;c < d; c++) j.tweens[c].run(1);
                    return b ? h.resolveWith(a, [ j, b ]) : h.rejectWith(a, [ j, b ]), this;
                }
            }), k = j.props;
            cX(k, j.opts.specialEasing);
            for (;e < g; e++) {
                d = cS[e].call(j, a, k, j.opts);
                if (d) return d;
            }
            return cV(j, k), p.isFunction(j.opts.start) && j.opts.start.call(a, j), p.fx.timer(p.extend(i, {
                anim: j,
                queue: j.opts.queue,
                elem: a
            })), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always);
        }
        function cX(a, b) {
            var c, d, e, f, g;
            for (c in a) {
                d = p.camelCase(c), e = b[d], f = a[c], p.isArray(f) && (e = f[1], f = a[c] = f[0]), 
                c !== d && (a[d] = f, delete a[c]), g = p.cssHooks[d];
                if (g && "expand" in g) {
                    f = g.expand(f), delete a[d];
                    for (c in f) c in a || (a[c] = f[c], b[c] = e);
                } else b[d] = e;
            }
        }
        function cY(a, b, c) {
            var d, e, f, g, h, i, j, k, l = this, m = a.style, n = {}, o = [], q = a.nodeType && bZ(a);
            c.queue || (j = p._queueHooks(a, "fx"), j.unqueued == null && (j.unqueued = 0, k = j.empty.fire, 
            j.empty.fire = function() {
                j.unqueued || k();
            }), j.unqueued++, l.always(function() {
                l.always(function() {
                    j.unqueued--, p.queue(a, "fx").length || j.empty.fire();
                });
            })), a.nodeType === 1 && ("height" in b || "width" in b) && (c.overflow = [ m.overflow, m.overflowX, m.overflowY ], 
            p.css(a, "display") === "inline" && p.css(a, "float") === "none" && (!p.support.inlineBlockNeedsLayout || cc(a.nodeName) === "inline" ? m.display = "inline-block" : m.zoom = 1)), 
            c.overflow && (m.overflow = "hidden", p.support.shrinkWrapBlocks || l.done(function() {
                m.overflow = c.overflow[0], m.overflowX = c.overflow[1], m.overflowY = c.overflow[2];
            }));
            for (d in b) {
                f = b[d];
                if (cP.exec(f)) {
                    delete b[d];
                    if (f === (q ? "hide" : "show")) continue;
                    o.push(d);
                }
            }
            g = o.length;
            if (g) {
                h = p._data(a, "fxshow") || p._data(a, "fxshow", {}), q ? p(a).show() : l.done(function() {
                    p(a).hide();
                }), l.done(function() {
                    var b;
                    p.removeData(a, "fxshow", !0);
                    for (b in n) p.style(a, b, n[b]);
                });
                for (d = 0; d < g; d++) e = o[d], i = l.createTween(e, q ? h[e] : 0), n[e] = h[e] || p.style(a, e), 
                e in h || (h[e] = i.start, q && (i.end = i.start, i.start = e === "width" || e === "height" ? 1 : 0));
            }
        }
        function cZ(a, b, c, d, e) {
            return new cZ.prototype.init(a, b, c, d, e);
        }
        function c$(a, b) {
            var c, d = {
                height: a
            }, e = 0;
            b = b ? 1 : 0;
            for (;e < 4; e += 2 - b) c = bV[e], d["margin" + c] = d["padding" + c] = a;
            return b && (d.opacity = d.width = a), d;
        }
        function da(a) {
            return p.isWindow(a) ? a : a.nodeType === 9 ? a.defaultView || a.parentWindow : !1;
        }
        var c, d, e = a.document, f = a.location, g = a.navigator, h = a.jQuery, i = a.$, j = Array.prototype.push, k = Array.prototype.slice, l = Array.prototype.indexOf, m = Object.prototype.toString, n = Object.prototype.hasOwnProperty, o = String.prototype.trim, p = function(a, b) {
            return new p.fn.init(a, b, c);
        }, q = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source, r = /\S/, s = /\s+/, t = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, u = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/, v = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, w = /^[\],:{}\s]*$/, x = /(?:^|:|,)(?:\s*\[)+/g, y = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, z = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g, A = /^-ms-/, B = /-([\da-z])/gi, C = function(a, b) {
            return (b + "").toUpperCase();
        }, D = function() {
            e.addEventListener ? (e.removeEventListener("DOMContentLoaded", D, !1), p.ready()) : e.readyState === "complete" && (e.detachEvent("onreadystatechange", D), 
            p.ready());
        }, E = {};
        p.fn = p.prototype = {
            constructor: p,
            init: function(a, c, d) {
                var f, g, h, i;
                if (!a) return this;
                if (a.nodeType) return this.context = this[0] = a, this.length = 1, this;
                if (typeof a == "string") {
                    a.charAt(0) === "<" && a.charAt(a.length - 1) === ">" && a.length >= 3 ? f = [ null, a, null ] : f = u.exec(a);
                    if (f && (f[1] || !c)) {
                        if (f[1]) return c = c instanceof p ? c[0] : c, i = c && c.nodeType ? c.ownerDocument || c : e, 
                        a = p.parseHTML(f[1], i, !0), v.test(f[1]) && p.isPlainObject(c) && this.attr.call(a, c, !0), 
                        p.merge(this, a);
                        g = e.getElementById(f[2]);
                        if (g && g.parentNode) {
                            if (g.id !== f[2]) return d.find(a);
                            this.length = 1, this[0] = g;
                        }
                        return this.context = e, this.selector = a, this;
                    }
                    return !c || c.jquery ? (c || d).find(a) : this.constructor(c).find(a);
                }
                return p.isFunction(a) ? d.ready(a) : (a.selector !== b && (this.selector = a.selector, 
                this.context = a.context), p.makeArray(a, this));
            },
            selector: "",
            jquery: "1.8.2",
            length: 0,
            size: function() {
                return this.length;
            },
            toArray: function() {
                return k.call(this);
            },
            get: function(a) {
                return a == null ? this.toArray() : a < 0 ? this[this.length + a] : this[a];
            },
            pushStack: function(a, b, c) {
                var d = p.merge(this.constructor(), a);
                return d.prevObject = this, d.context = this.context, b === "find" ? d.selector = this.selector + (this.selector ? " " : "") + c : b && (d.selector = this.selector + "." + b + "(" + c + ")"), 
                d;
            },
            each: function(a, b) {
                return p.each(this, a, b);
            },
            ready: function(a) {
                return p.ready.promise().done(a), this;
            },
            eq: function(a) {
                return a = +a, a === -1 ? this.slice(a) : this.slice(a, a + 1);
            },
            first: function() {
                return this.eq(0);
            },
            last: function() {
                return this.eq(-1);
            },
            slice: function() {
                return this.pushStack(k.apply(this, arguments), "slice", k.call(arguments).join(","));
            },
            map: function(a) {
                return this.pushStack(p.map(this, function(b, c) {
                    return a.call(b, c, b);
                }));
            },
            end: function() {
                return this.prevObject || this.constructor(null);
            },
            push: j,
            sort: [].sort,
            splice: [].splice
        }, p.fn.init.prototype = p.fn, p.extend = p.fn.extend = function() {
            var a, c, d, e, f, g, h = arguments[0] || {}, i = 1, j = arguments.length, k = !1;
            typeof h == "boolean" && (k = h, h = arguments[1] || {}, i = 2), typeof h != "object" && !p.isFunction(h) && (h = {}), 
            j === i && (h = this, --i);
            for (;i < j; i++) if ((a = arguments[i]) != null) for (c in a) {
                d = h[c], e = a[c];
                if (h === e) continue;
                k && e && (p.isPlainObject(e) || (f = p.isArray(e))) ? (f ? (f = !1, g = d && p.isArray(d) ? d : []) : g = d && p.isPlainObject(d) ? d : {}, 
                h[c] = p.extend(k, g, e)) : e !== b && (h[c] = e);
            }
            return h;
        }, p.extend({
            noConflict: function(b) {
                return a.$ === p && (a.$ = i), b && a.jQuery === p && (a.jQuery = h), p;
            },
            isReady: !1,
            readyWait: 1,
            holdReady: function(a) {
                a ? p.readyWait++ : p.ready(!0);
            },
            ready: function(a) {
                if (a === !0 ? --p.readyWait : p.isReady) return;
                if (!e.body) return setTimeout(p.ready, 1);
                p.isReady = !0;
                if (a !== !0 && --p.readyWait > 0) return;
                d.resolveWith(e, [ p ]), p.fn.trigger && p(e).trigger("ready").off("ready");
            },
            isFunction: function(a) {
                return p.type(a) === "function";
            },
            isArray: Array.isArray || function(a) {
                return p.type(a) === "array";
            },
            isWindow: function(a) {
                return a != null && a == a.window;
            },
            isNumeric: function(a) {
                return !isNaN(parseFloat(a)) && isFinite(a);
            },
            type: function(a) {
                return a == null ? String(a) : E[m.call(a)] || "object";
            },
            isPlainObject: function(a) {
                if (!a || p.type(a) !== "object" || a.nodeType || p.isWindow(a)) return !1;
                try {
                    if (a.constructor && !n.call(a, "constructor") && !n.call(a.constructor.prototype, "isPrototypeOf")) return !1;
                } catch (c) {
                    return !1;
                }
                var d;
                for (d in a) ;
                return d === b || n.call(a, d);
            },
            isEmptyObject: function(a) {
                var b;
                for (b in a) return !1;
                return !0;
            },
            error: function(a) {
                throw new Error(a);
            },
            parseHTML: function(a, b, c) {
                var d;
                return !a || typeof a != "string" ? null : (typeof b == "boolean" && (c = b, b = 0), 
                b = b || e, (d = v.exec(a)) ? [ b.createElement(d[1]) ] : (d = p.buildFragment([ a ], b, c ? null : []), 
                p.merge([], (d.cacheable ? p.clone(d.fragment) : d.fragment).childNodes)));
            },
            parseJSON: function(b) {
                if (!b || typeof b != "string") return null;
                b = p.trim(b);
                if (a.JSON && a.JSON.parse) return a.JSON.parse(b);
                if (w.test(b.replace(y, "@").replace(z, "]").replace(x, ""))) return new Function("return " + b)();
                p.error("Invalid JSON: " + b);
            },
            parseXML: function(c) {
                var d, e;
                if (!c || typeof c != "string") return null;
                try {
                    a.DOMParser ? (e = new DOMParser(), d = e.parseFromString(c, "text/xml")) : (d = new ActiveXObject("Microsoft.XMLDOM"), 
                    d.async = "false", d.loadXML(c));
                } catch (f) {
                    d = b;
                }
                return (!d || !d.documentElement || d.getElementsByTagName("parsererror").length) && p.error("Invalid XML: " + c), 
                d;
            },
            noop: function() {},
            globalEval: function(b) {
                b && r.test(b) && (a.execScript || function(b) {
                    a.eval.call(a, b);
                })(b);
            },
            camelCase: function(a) {
                return a.replace(A, "ms-").replace(B, C);
            },
            nodeName: function(a, b) {
                return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase();
            },
            each: function(a, c, d) {
                var e, f = 0, g = a.length, h = g === b || p.isFunction(a);
                if (d) {
                    if (h) {
                        for (e in a) if (c.apply(a[e], d) === !1) break;
                    } else for (;f < g; ) if (c.apply(a[f++], d) === !1) break;
                } else if (h) {
                    for (e in a) if (c.call(a[e], e, a[e]) === !1) break;
                } else for (;f < g; ) if (c.call(a[f], f, a[f++]) === !1) break;
                return a;
            },
            trim: o && !o.call(" ") ? function(a) {
                return a == null ? "" : o.call(a);
            } : function(a) {
                return a == null ? "" : (a + "").replace(t, "");
            },
            makeArray: function(a, b) {
                var c, d = b || [];
                return a != null && (c = p.type(a), a.length == null || c === "string" || c === "function" || c === "regexp" || p.isWindow(a) ? j.call(d, a) : p.merge(d, a)), 
                d;
            },
            inArray: function(a, b, c) {
                var d;
                if (b) {
                    if (l) return l.call(b, a, c);
                    d = b.length, c = c ? c < 0 ? Math.max(0, d + c) : c : 0;
                    for (;c < d; c++) if (c in b && b[c] === a) return c;
                }
                return -1;
            },
            merge: function(a, c) {
                var d = c.length, e = a.length, f = 0;
                if (typeof d == "number") for (;f < d; f++) a[e++] = c[f]; else while (c[f] !== b) a[e++] = c[f++];
                return a.length = e, a;
            },
            grep: function(a, b, c) {
                var d, e = [], f = 0, g = a.length;
                c = !!c;
                for (;f < g; f++) d = !!b(a[f], f), c !== d && e.push(a[f]);
                return e;
            },
            map: function(a, c, d) {
                var e, f, g = [], h = 0, i = a.length, j = a instanceof p || i !== b && typeof i == "number" && (i > 0 && a[0] && a[i - 1] || i === 0 || p.isArray(a));
                if (j) for (;h < i; h++) e = c(a[h], h, d), e != null && (g[g.length] = e); else for (f in a) e = c(a[f], f, d), 
                e != null && (g[g.length] = e);
                return g.concat.apply([], g);
            },
            guid: 1,
            proxy: function(a, c) {
                var d, e, f;
                return typeof c == "string" && (d = a[c], c = a, a = d), p.isFunction(a) ? (e = k.call(arguments, 2), 
                f = function() {
                    return a.apply(c, e.concat(k.call(arguments)));
                }, f.guid = a.guid = a.guid || p.guid++, f) : b;
            },
            access: function(a, c, d, e, f, g, h) {
                var i, j = d == null, k = 0, l = a.length;
                if (d && typeof d == "object") {
                    for (k in d) p.access(a, c, k, d[k], 1, g, e);
                    f = 1;
                } else if (e !== b) {
                    i = h === b && p.isFunction(e), j && (i ? (i = c, c = function(a, b, c) {
                        return i.call(p(a), c);
                    }) : (c.call(a, e), c = null));
                    if (c) for (;k < l; k++) c(a[k], d, i ? e.call(a[k], k, c(a[k], d)) : e, h);
                    f = 1;
                }
                return f ? a : j ? c.call(a) : l ? c(a[0], d) : g;
            },
            now: function() {
                return new Date().getTime();
            }
        }), p.ready.promise = function(b) {
            if (!d) {
                d = p.Deferred();
                if (e.readyState === "complete") setTimeout(p.ready, 1); else if (e.addEventListener) e.addEventListener("DOMContentLoaded", D, !1), 
                a.addEventListener("load", p.ready, !1); else {
                    e.attachEvent("onreadystatechange", D), a.attachEvent("onload", p.ready);
                    var c = !1;
                    try {
                        c = a.frameElement == null && e.documentElement;
                    } catch (f) {}
                    c && c.doScroll && function g() {
                        if (!p.isReady) {
                            try {
                                c.doScroll("left");
                            } catch (a) {
                                return setTimeout(g, 50);
                            }
                            p.ready();
                        }
                    }();
                }
            }
            return d.promise(b);
        }, p.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(a, b) {
            E["[object " + b + "]"] = b.toLowerCase();
        }), c = p(e);
        var F = {};
        p.Callbacks = function(a) {
            a = typeof a == "string" ? F[a] || G(a) : p.extend({}, a);
            var c, d, e, f, g, h, i = [], j = !a.once && [], k = function(b) {
                c = a.memory && b, d = !0, h = f || 0, f = 0, g = i.length, e = !0;
                for (;i && h < g; h++) if (i[h].apply(b[0], b[1]) === !1 && a.stopOnFalse) {
                    c = !1;
                    break;
                }
                e = !1, i && (j ? j.length && k(j.shift()) : c ? i = [] : l.disable());
            }, l = {
                add: function() {
                    if (i) {
                        var b = i.length;
                        (function d(b) {
                            p.each(b, function(b, c) {
                                var e = p.type(c);
                                e === "function" && (!a.unique || !l.has(c)) ? i.push(c) : c && c.length && e !== "string" && d(c);
                            });
                        })(arguments), e ? g = i.length : c && (f = b, k(c));
                    }
                    return this;
                },
                remove: function() {
                    return i && p.each(arguments, function(a, b) {
                        var c;
                        while ((c = p.inArray(b, i, c)) > -1) i.splice(c, 1), e && (c <= g && g--, c <= h && h--);
                    }), this;
                },
                has: function(a) {
                    return p.inArray(a, i) > -1;
                },
                empty: function() {
                    return i = [], this;
                },
                disable: function() {
                    return i = j = c = b, this;
                },
                disabled: function() {
                    return !i;
                },
                lock: function() {
                    return j = b, c || l.disable(), this;
                },
                locked: function() {
                    return !j;
                },
                fireWith: function(a, b) {
                    return b = b || [], b = [ a, b.slice ? b.slice() : b ], i && (!d || j) && (e ? j.push(b) : k(b)), 
                    this;
                },
                fire: function() {
                    return l.fireWith(this, arguments), this;
                },
                fired: function() {
                    return !!d;
                }
            };
            return l;
        }, p.extend({
            Deferred: function(a) {
                var b = [ [ "resolve", "done", p.Callbacks("once memory"), "resolved" ], [ "reject", "fail", p.Callbacks("once memory"), "rejected" ], [ "notify", "progress", p.Callbacks("memory") ] ], c = "pending", d = {
                    state: function() {
                        return c;
                    },
                    always: function() {
                        return e.done(arguments).fail(arguments), this;
                    },
                    then: function() {
                        var a = arguments;
                        return p.Deferred(function(c) {
                            p.each(b, function(b, d) {
                                var f = d[0], g = a[b];
                                e[d[1]](p.isFunction(g) ? function() {
                                    var a = g.apply(this, arguments);
                                    a && p.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f + "With"](this === e ? c : this, [ a ]);
                                } : c[f]);
                            }), a = null;
                        }).promise();
                    },
                    promise: function(a) {
                        return a != null ? p.extend(a, d) : d;
                    }
                }, e = {};
                return d.pipe = d.then, p.each(b, function(a, f) {
                    var g = f[2], h = f[3];
                    d[f[1]] = g.add, h && g.add(function() {
                        c = h;
                    }, b[a ^ 1][2].disable, b[2][2].lock), e[f[0]] = g.fire, e[f[0] + "With"] = g.fireWith;
                }), d.promise(e), a && a.call(e, e), e;
            },
            when: function(a) {
                var b = 0, c = k.call(arguments), d = c.length, e = d !== 1 || a && p.isFunction(a.promise) ? d : 0, f = e === 1 ? a : p.Deferred(), g = function(a, b, c) {
                    return function(d) {
                        b[a] = this, c[a] = arguments.length > 1 ? k.call(arguments) : d, c === h ? f.notifyWith(b, c) : --e || f.resolveWith(b, c);
                    };
                }, h, i, j;
                if (d > 1) {
                    h = new Array(d), i = new Array(d), j = new Array(d);
                    for (;b < d; b++) c[b] && p.isFunction(c[b].promise) ? c[b].promise().done(g(b, j, c)).fail(f.reject).progress(g(b, i, h)) : --e;
                }
                return e || f.resolveWith(j, c), f.promise();
            }
        }), p.support = function() {
            var b, c, d, f, g, h, i, j, k, l, m, n = e.createElement("div");
            n.setAttribute("className", "t"), n.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", 
            c = n.getElementsByTagName("*"), d = n.getElementsByTagName("a")[0], d.style.cssText = "top:1px;float:left;opacity:.5";
            if (!c || !c.length) return {};
            f = e.createElement("select"), g = f.appendChild(e.createElement("option")), h = n.getElementsByTagName("input")[0], 
            b = {
                leadingWhitespace: n.firstChild.nodeType === 3,
                tbody: !n.getElementsByTagName("tbody").length,
                htmlSerialize: !!n.getElementsByTagName("link").length,
                style: /top/.test(d.getAttribute("style")),
                hrefNormalized: d.getAttribute("href") === "/a",
                opacity: /^0.5/.test(d.style.opacity),
                cssFloat: !!d.style.cssFloat,
                checkOn: h.value === "on",
                optSelected: g.selected,
                getSetAttribute: n.className !== "t",
                enctype: !!e.createElement("form").enctype,
                html5Clone: e.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>",
                boxModel: e.compatMode === "CSS1Compat",
                submitBubbles: !0,
                changeBubbles: !0,
                focusinBubbles: !1,
                deleteExpando: !0,
                noCloneEvent: !0,
                inlineBlockNeedsLayout: !1,
                shrinkWrapBlocks: !1,
                reliableMarginRight: !0,
                boxSizingReliable: !0,
                pixelPosition: !1
            }, h.checked = !0, b.noCloneChecked = h.cloneNode(!0).checked, f.disabled = !0, 
            b.optDisabled = !g.disabled;
            try {
                delete n.test;
            } catch (o) {
                b.deleteExpando = !1;
            }
            !n.addEventListener && n.attachEvent && n.fireEvent && (n.attachEvent("onclick", m = function() {
                b.noCloneEvent = !1;
            }), n.cloneNode(!0).fireEvent("onclick"), n.detachEvent("onclick", m)), h = e.createElement("input"), 
            h.value = "t", h.setAttribute("type", "radio"), b.radioValue = h.value === "t", 
            h.setAttribute("checked", "checked"), h.setAttribute("name", "t"), n.appendChild(h), 
            i = e.createDocumentFragment(), i.appendChild(n.lastChild), b.checkClone = i.cloneNode(!0).cloneNode(!0).lastChild.checked, 
            b.appendChecked = h.checked, i.removeChild(h), i.appendChild(n);
            if (n.attachEvent) for (k in {
                submit: !0,
                change: !0,
                focusin: !0
            }) j = "on" + k, l = j in n, l || (n.setAttribute(j, "return;"), l = typeof n[j] == "function"), 
            b[k + "Bubbles"] = l;
            return p(function() {
                var c, d, f, g, h = "padding:0;margin:0;border:0;display:block;overflow:hidden;", i = e.getElementsByTagName("body")[0];
                if (!i) return;
                c = e.createElement("div"), c.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px", 
                i.insertBefore(c, i.firstChild), d = e.createElement("div"), c.appendChild(d), d.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", 
                f = d.getElementsByTagName("td"), f[0].style.cssText = "padding:0;margin:0;border:0;display:none", 
                l = f[0].offsetHeight === 0, f[0].style.display = "", f[1].style.display = "none", 
                b.reliableHiddenOffsets = l && f[0].offsetHeight === 0, d.innerHTML = "", d.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", 
                b.boxSizing = d.offsetWidth === 4, b.doesNotIncludeMarginInBodyOffset = i.offsetTop !== 1, 
                a.getComputedStyle && (b.pixelPosition = (a.getComputedStyle(d, null) || {}).top !== "1%", 
                b.boxSizingReliable = (a.getComputedStyle(d, null) || {
                    width: "4px"
                }).width === "4px", g = e.createElement("div"), g.style.cssText = d.style.cssText = h, 
                g.style.marginRight = g.style.width = "0", d.style.width = "1px", d.appendChild(g), 
                b.reliableMarginRight = !parseFloat((a.getComputedStyle(g, null) || {}).marginRight)), 
                typeof d.style.zoom != "undefined" && (d.innerHTML = "", d.style.cssText = h + "width:1px;padding:1px;display:inline;zoom:1", 
                b.inlineBlockNeedsLayout = d.offsetWidth === 3, d.style.display = "block", d.style.overflow = "visible", 
                d.innerHTML = "<div></div>", d.firstChild.style.width = "5px", b.shrinkWrapBlocks = d.offsetWidth !== 3, 
                c.style.zoom = 1), i.removeChild(c), c = d = f = g = null;
            }), i.removeChild(n), c = d = f = g = h = i = n = null, b;
        }();
        var H = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, I = /([A-Z])/g;
        p.extend({
            cache: {},
            deletedIds: [],
            uuid: 0,
            expando: "jQuery" + (p.fn.jquery + Math.random()).replace(/\D/g, ""),
            noData: {
                embed: !0,
                object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
                applet: !0
            },
            hasData: function(a) {
                return a = a.nodeType ? p.cache[a[p.expando]] : a[p.expando], !!a && !K(a);
            },
            data: function(a, c, d, e) {
                if (!p.acceptData(a)) return;
                var f, g, h = p.expando, i = typeof c == "string", j = a.nodeType, k = j ? p.cache : a, l = j ? a[h] : a[h] && h;
                if ((!l || !k[l] || !e && !k[l].data) && i && d === b) return;
                l || (j ? a[h] = l = p.deletedIds.pop() || p.guid++ : l = h), k[l] || (k[l] = {}, 
                j || (k[l].toJSON = p.noop));
                if (typeof c == "object" || typeof c == "function") e ? k[l] = p.extend(k[l], c) : k[l].data = p.extend(k[l].data, c);
                return f = k[l], e || (f.data || (f.data = {}), f = f.data), d !== b && (f[p.camelCase(c)] = d), 
                i ? (g = f[c], g == null && (g = f[p.camelCase(c)])) : g = f, g;
            },
            removeData: function(a, b, c) {
                if (!p.acceptData(a)) return;
                var d, e, f, g = a.nodeType, h = g ? p.cache : a, i = g ? a[p.expando] : p.expando;
                if (!h[i]) return;
                if (b) {
                    d = c ? h[i] : h[i].data;
                    if (d) {
                        p.isArray(b) || (b in d ? b = [ b ] : (b = p.camelCase(b), b in d ? b = [ b ] : b = b.split(" ")));
                        for (e = 0, f = b.length; e < f; e++) delete d[b[e]];
                        if (!(c ? K : p.isEmptyObject)(d)) return;
                    }
                }
                if (!c) {
                    delete h[i].data;
                    if (!K(h[i])) return;
                }
                g ? p.cleanData([ a ], !0) : p.support.deleteExpando || h != h.window ? delete h[i] : h[i] = null;
            },
            _data: function(a, b, c) {
                return p.data(a, b, c, !0);
            },
            acceptData: function(a) {
                var b = a.nodeName && p.noData[a.nodeName.toLowerCase()];
                return !b || b !== !0 && a.getAttribute("classid") === b;
            }
        }), p.fn.extend({
            data: function(a, c) {
                var d, e, f, g, h, i = this[0], j = 0, k = null;
                if (a === b) {
                    if (this.length) {
                        k = p.data(i);
                        if (i.nodeType === 1 && !p._data(i, "parsedAttrs")) {
                            f = i.attributes;
                            for (h = f.length; j < h; j++) g = f[j].name, g.indexOf("data-") || (g = p.camelCase(g.substring(5)), 
                            J(i, g, k[g]));
                            p._data(i, "parsedAttrs", !0);
                        }
                    }
                    return k;
                }
                return typeof a == "object" ? this.each(function() {
                    p.data(this, a);
                }) : (d = a.split(".", 2), d[1] = d[1] ? "." + d[1] : "", e = d[1] + "!", p.access(this, function(c) {
                    if (c === b) return k = this.triggerHandler("getData" + e, [ d[0] ]), k === b && i && (k = p.data(i, a), 
                    k = J(i, a, k)), k === b && d[1] ? this.data(d[0]) : k;
                    d[1] = c, this.each(function() {
                        var b = p(this);
                        b.triggerHandler("setData" + e, d), p.data(this, a, c), b.triggerHandler("changeData" + e, d);
                    });
                }, null, c, arguments.length > 1, null, !1));
            },
            removeData: function(a) {
                return this.each(function() {
                    p.removeData(this, a);
                });
            }
        }), p.extend({
            queue: function(a, b, c) {
                var d;
                if (a) return b = (b || "fx") + "queue", d = p._data(a, b), c && (!d || p.isArray(c) ? d = p._data(a, b, p.makeArray(c)) : d.push(c)), 
                d || [];
            },
            dequeue: function(a, b) {
                b = b || "fx";
                var c = p.queue(a, b), d = c.length, e = c.shift(), f = p._queueHooks(a, b), g = function() {
                    p.dequeue(a, b);
                };
                e === "inprogress" && (e = c.shift(), d--), e && (b === "fx" && c.unshift("inprogress"), 
                delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire();
            },
            _queueHooks: function(a, b) {
                var c = b + "queueHooks";
                return p._data(a, c) || p._data(a, c, {
                    empty: p.Callbacks("once memory").add(function() {
                        p.removeData(a, b + "queue", !0), p.removeData(a, c, !0);
                    })
                });
            }
        }), p.fn.extend({
            queue: function(a, c) {
                var d = 2;
                return typeof a != "string" && (c = a, a = "fx", d--), arguments.length < d ? p.queue(this[0], a) : c === b ? this : this.each(function() {
                    var b = p.queue(this, a, c);
                    p._queueHooks(this, a), a === "fx" && b[0] !== "inprogress" && p.dequeue(this, a);
                });
            },
            dequeue: function(a) {
                return this.each(function() {
                    p.dequeue(this, a);
                });
            },
            delay: function(a, b) {
                return a = p.fx ? p.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function(b, c) {
                    var d = setTimeout(b, a);
                    c.stop = function() {
                        clearTimeout(d);
                    };
                });
            },
            clearQueue: function(a) {
                return this.queue(a || "fx", []);
            },
            promise: function(a, c) {
                var d, e = 1, f = p.Deferred(), g = this, h = this.length, i = function() {
                    --e || f.resolveWith(g, [ g ]);
                };
                typeof a != "string" && (c = a, a = b), a = a || "fx";
                while (h--) d = p._data(g[h], a + "queueHooks"), d && d.empty && (e++, d.empty.add(i));
                return i(), f.promise(c);
            }
        });
        var L, M, N, O = /[\t\r\n]/g, P = /\r/g, Q = /^(?:button|input)$/i, R = /^(?:button|input|object|select|textarea)$/i, S = /^a(?:rea|)$/i, T = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, U = p.support.getSetAttribute;
        p.fn.extend({
            attr: function(a, b) {
                return p.access(this, p.attr, a, b, arguments.length > 1);
            },
            removeAttr: function(a) {
                return this.each(function() {
                    p.removeAttr(this, a);
                });
            },
            prop: function(a, b) {
                return p.access(this, p.prop, a, b, arguments.length > 1);
            },
            removeProp: function(a) {
                return a = p.propFix[a] || a, this.each(function() {
                    try {
                        this[a] = b, delete this[a];
                    } catch (c) {}
                });
            },
            addClass: function(a) {
                var b, c, d, e, f, g, h;
                if (p.isFunction(a)) return this.each(function(b) {
                    p(this).addClass(a.call(this, b, this.className));
                });
                if (a && typeof a == "string") {
                    b = a.split(s);
                    for (c = 0, d = this.length; c < d; c++) {
                        e = this[c];
                        if (e.nodeType === 1) if (!e.className && b.length === 1) e.className = a; else {
                            f = " " + e.className + " ";
                            for (g = 0, h = b.length; g < h; g++) f.indexOf(" " + b[g] + " ") < 0 && (f += b[g] + " ");
                            e.className = p.trim(f);
                        }
                    }
                }
                return this;
            },
            removeClass: function(a) {
                var c, d, e, f, g, h, i;
                if (p.isFunction(a)) return this.each(function(b) {
                    p(this).removeClass(a.call(this, b, this.className));
                });
                if (a && typeof a == "string" || a === b) {
                    c = (a || "").split(s);
                    for (h = 0, i = this.length; h < i; h++) {
                        e = this[h];
                        if (e.nodeType === 1 && e.className) {
                            d = (" " + e.className + " ").replace(O, " ");
                            for (f = 0, g = c.length; f < g; f++) while (d.indexOf(" " + c[f] + " ") >= 0) d = d.replace(" " + c[f] + " ", " ");
                            e.className = a ? p.trim(d) : "";
                        }
                    }
                }
                return this;
            },
            toggleClass: function(a, b) {
                var c = typeof a, d = typeof b == "boolean";
                return p.isFunction(a) ? this.each(function(c) {
                    p(this).toggleClass(a.call(this, c, this.className, b), b);
                }) : this.each(function() {
                    if (c === "string") {
                        var e, f = 0, g = p(this), h = b, i = a.split(s);
                        while (e = i[f++]) h = d ? h : !g.hasClass(e), g[h ? "addClass" : "removeClass"](e);
                    } else if (c === "undefined" || c === "boolean") this.className && p._data(this, "__className__", this.className), 
                    this.className = this.className || a === !1 ? "" : p._data(this, "__className__") || "";
                });
            },
            hasClass: function(a) {
                var b = " " + a + " ", c = 0, d = this.length;
                for (;c < d; c++) if (this[c].nodeType === 1 && (" " + this[c].className + " ").replace(O, " ").indexOf(b) >= 0) return !0;
                return !1;
            },
            val: function(a) {
                var c, d, e, f = this[0];
                if (!arguments.length) {
                    if (f) return c = p.valHooks[f.type] || p.valHooks[f.nodeName.toLowerCase()], c && "get" in c && (d = c.get(f, "value")) !== b ? d : (d = f.value, 
                    typeof d == "string" ? d.replace(P, "") : d == null ? "" : d);
                    return;
                }
                return e = p.isFunction(a), this.each(function(d) {
                    var f, g = p(this);
                    if (this.nodeType !== 1) return;
                    e ? f = a.call(this, d, g.val()) : f = a, f == null ? f = "" : typeof f == "number" ? f += "" : p.isArray(f) && (f = p.map(f, function(a) {
                        return a == null ? "" : a + "";
                    })), c = p.valHooks[this.type] || p.valHooks[this.nodeName.toLowerCase()];
                    if (!c || !("set" in c) || c.set(this, f, "value") === b) this.value = f;
                });
            }
        }), p.extend({
            valHooks: {
                option: {
                    get: function(a) {
                        var b = a.attributes.value;
                        return !b || b.specified ? a.value : a.text;
                    }
                },
                select: {
                    get: function(a) {
                        var b, c, d, e, f = a.selectedIndex, g = [], h = a.options, i = a.type === "select-one";
                        if (f < 0) return null;
                        c = i ? f : 0, d = i ? f + 1 : h.length;
                        for (;c < d; c++) {
                            e = h[c];
                            if (e.selected && (p.support.optDisabled ? !e.disabled : e.getAttribute("disabled") === null) && (!e.parentNode.disabled || !p.nodeName(e.parentNode, "optgroup"))) {
                                b = p(e).val();
                                if (i) return b;
                                g.push(b);
                            }
                        }
                        return i && !g.length && h.length ? p(h[f]).val() : g;
                    },
                    set: function(a, b) {
                        var c = p.makeArray(b);
                        return p(a).find("option").each(function() {
                            this.selected = p.inArray(p(this).val(), c) >= 0;
                        }), c.length || (a.selectedIndex = -1), c;
                    }
                }
            },
            attrFn: {},
            attr: function(a, c, d, e) {
                var f, g, h, i = a.nodeType;
                if (!a || i === 3 || i === 8 || i === 2) return;
                if (e && p.isFunction(p.fn[c])) return p(a)[c](d);
                if (typeof a.getAttribute == "undefined") return p.prop(a, c, d);
                h = i !== 1 || !p.isXMLDoc(a), h && (c = c.toLowerCase(), g = p.attrHooks[c] || (T.test(c) ? M : L));
                if (d !== b) {
                    if (d === null) {
                        p.removeAttr(a, c);
                        return;
                    }
                    return g && "set" in g && h && (f = g.set(a, d, c)) !== b ? f : (a.setAttribute(c, d + ""), 
                    d);
                }
                return g && "get" in g && h && (f = g.get(a, c)) !== null ? f : (f = a.getAttribute(c), 
                f === null ? b : f);
            },
            removeAttr: function(a, b) {
                var c, d, e, f, g = 0;
                if (b && a.nodeType === 1) {
                    d = b.split(s);
                    for (;g < d.length; g++) e = d[g], e && (c = p.propFix[e] || e, f = T.test(e), f || p.attr(a, e, ""), 
                    a.removeAttribute(U ? e : c), f && c in a && (a[c] = !1));
                }
            },
            attrHooks: {
                type: {
                    set: function(a, b) {
                        if (Q.test(a.nodeName) && a.parentNode) p.error("type property can't be changed"); else if (!p.support.radioValue && b === "radio" && p.nodeName(a, "input")) {
                            var c = a.value;
                            return a.setAttribute("type", b), c && (a.value = c), b;
                        }
                    }
                },
                value: {
                    get: function(a, b) {
                        return L && p.nodeName(a, "button") ? L.get(a, b) : b in a ? a.value : null;
                    },
                    set: function(a, b, c) {
                        if (L && p.nodeName(a, "button")) return L.set(a, b, c);
                        a.value = b;
                    }
                }
            },
            propFix: {
                tabindex: "tabIndex",
                readonly: "readOnly",
                "for": "htmlFor",
                "class": "className",
                maxlength: "maxLength",
                cellspacing: "cellSpacing",
                cellpadding: "cellPadding",
                rowspan: "rowSpan",
                colspan: "colSpan",
                usemap: "useMap",
                frameborder: "frameBorder",
                contenteditable: "contentEditable"
            },
            prop: function(a, c, d) {
                var e, f, g, h = a.nodeType;
                if (!a || h === 3 || h === 8 || h === 2) return;
                return g = h !== 1 || !p.isXMLDoc(a), g && (c = p.propFix[c] || c, f = p.propHooks[c]), 
                d !== b ? f && "set" in f && (e = f.set(a, d, c)) !== b ? e : a[c] = d : f && "get" in f && (e = f.get(a, c)) !== null ? e : a[c];
            },
            propHooks: {
                tabIndex: {
                    get: function(a) {
                        var c = a.getAttributeNode("tabindex");
                        return c && c.specified ? parseInt(c.value, 10) : R.test(a.nodeName) || S.test(a.nodeName) && a.href ? 0 : b;
                    }
                }
            }
        }), M = {
            get: function(a, c) {
                var d, e = p.prop(a, c);
                return e === !0 || typeof e != "boolean" && (d = a.getAttributeNode(c)) && d.nodeValue !== !1 ? c.toLowerCase() : b;
            },
            set: function(a, b, c) {
                var d;
                return b === !1 ? p.removeAttr(a, c) : (d = p.propFix[c] || c, d in a && (a[d] = !0), 
                a.setAttribute(c, c.toLowerCase())), c;
            }
        }, U || (N = {
            name: !0,
            id: !0,
            coords: !0
        }, L = p.valHooks.button = {
            get: function(a, c) {
                var d;
                return d = a.getAttributeNode(c), d && (N[c] ? d.value !== "" : d.specified) ? d.value : b;
            },
            set: function(a, b, c) {
                var d = a.getAttributeNode(c);
                return d || (d = e.createAttribute(c), a.setAttributeNode(d)), d.value = b + "";
            }
        }, p.each([ "width", "height" ], function(a, b) {
            p.attrHooks[b] = p.extend(p.attrHooks[b], {
                set: function(a, c) {
                    if (c === "") return a.setAttribute(b, "auto"), c;
                }
            });
        }), p.attrHooks.contenteditable = {
            get: L.get,
            set: function(a, b, c) {
                b === "" && (b = "false"), L.set(a, b, c);
            }
        }), p.support.hrefNormalized || p.each([ "href", "src", "width", "height" ], function(a, c) {
            p.attrHooks[c] = p.extend(p.attrHooks[c], {
                get: function(a) {
                    var d = a.getAttribute(c, 2);
                    return d === null ? b : d;
                }
            });
        }), p.support.style || (p.attrHooks.style = {
            get: function(a) {
                return a.style.cssText.toLowerCase() || b;
            },
            set: function(a, b) {
                return a.style.cssText = b + "";
            }
        }), p.support.optSelected || (p.propHooks.selected = p.extend(p.propHooks.selected, {
            get: function(a) {
                var b = a.parentNode;
                return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null;
            }
        })), p.support.enctype || (p.propFix.enctype = "encoding"), p.support.checkOn || p.each([ "radio", "checkbox" ], function() {
            p.valHooks[this] = {
                get: function(a) {
                    return a.getAttribute("value") === null ? "on" : a.value;
                }
            };
        }), p.each([ "radio", "checkbox" ], function() {
            p.valHooks[this] = p.extend(p.valHooks[this], {
                set: function(a, b) {
                    if (p.isArray(b)) return a.checked = p.inArray(p(a).val(), b) >= 0;
                }
            });
        });
        var V = /^(?:textarea|input|select)$/i, W = /^([^\.]*|)(?:\.(.+)|)$/, X = /(?:^|\s)hover(\.\S+|)\b/, Y = /^key/, Z = /^(?:mouse|contextmenu)|click/, $ = /^(?:focusinfocus|focusoutblur)$/, _ = function(a) {
            return p.event.special.hover ? a : a.replace(X, "mouseenter$1 mouseleave$1");
        };
        p.event = {
            add: function(a, c, d, e, f) {
                var g, h, i, j, k, l, m, n, o, q, r;
                if (a.nodeType === 3 || a.nodeType === 8 || !c || !d || !(g = p._data(a))) return;
                d.handler && (o = d, d = o.handler, f = o.selector), d.guid || (d.guid = p.guid++), 
                i = g.events, i || (g.events = i = {}), h = g.handle, h || (g.handle = h = function(a) {
                    return typeof p != "undefined" && (!a || p.event.triggered !== a.type) ? p.event.dispatch.apply(h.elem, arguments) : b;
                }, h.elem = a), c = p.trim(_(c)).split(" ");
                for (j = 0; j < c.length; j++) {
                    k = W.exec(c[j]) || [], l = k[1], m = (k[2] || "").split(".").sort(), r = p.event.special[l] || {}, 
                    l = (f ? r.delegateType : r.bindType) || l, r = p.event.special[l] || {}, n = p.extend({
                        type: l,
                        origType: k[1],
                        data: e,
                        handler: d,
                        guid: d.guid,
                        selector: f,
                        needsContext: f && p.expr.match.needsContext.test(f),
                        namespace: m.join(".")
                    }, o), q = i[l];
                    if (!q) {
                        q = i[l] = [], q.delegateCount = 0;
                        if (!r.setup || r.setup.call(a, e, m, h) === !1) a.addEventListener ? a.addEventListener(l, h, !1) : a.attachEvent && a.attachEvent("on" + l, h);
                    }
                    r.add && (r.add.call(a, n), n.handler.guid || (n.handler.guid = d.guid)), f ? q.splice(q.delegateCount++, 0, n) : q.push(n), 
                    p.event.global[l] = !0;
                }
                a = null;
            },
            global: {},
            remove: function(a, b, c, d, e) {
                var f, g, h, i, j, k, l, m, n, o, q, r = p.hasData(a) && p._data(a);
                if (!r || !(m = r.events)) return;
                b = p.trim(_(b || "")).split(" ");
                for (f = 0; f < b.length; f++) {
                    g = W.exec(b[f]) || [], h = i = g[1], j = g[2];
                    if (!h) {
                        for (h in m) p.event.remove(a, h + b[f], c, d, !0);
                        continue;
                    }
                    n = p.event.special[h] || {}, h = (d ? n.delegateType : n.bindType) || h, o = m[h] || [], 
                    k = o.length, j = j ? new RegExp("(^|\\.)" + j.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
                    for (l = 0; l < o.length; l++) q = o[l], (e || i === q.origType) && (!c || c.guid === q.guid) && (!j || j.test(q.namespace)) && (!d || d === q.selector || d === "**" && q.selector) && (o.splice(l--, 1), 
                    q.selector && o.delegateCount--, n.remove && n.remove.call(a, q));
                    o.length === 0 && k !== o.length && ((!n.teardown || n.teardown.call(a, j, r.handle) === !1) && p.removeEvent(a, h, r.handle), 
                    delete m[h]);
                }
                p.isEmptyObject(m) && (delete r.handle, p.removeData(a, "events", !0));
            },
            customEvent: {
                getData: !0,
                setData: !0,
                changeData: !0
            },
            trigger: function(c, d, f, g) {
                if (!f || f.nodeType !== 3 && f.nodeType !== 8) {
                    var h, i, j, k, l, m, n, o, q, r, s = c.type || c, t = [];
                    if ($.test(s + p.event.triggered)) return;
                    s.indexOf("!") >= 0 && (s = s.slice(0, -1), i = !0), s.indexOf(".") >= 0 && (t = s.split("."), 
                    s = t.shift(), t.sort());
                    if ((!f || p.event.customEvent[s]) && !p.event.global[s]) return;
                    c = typeof c == "object" ? c[p.expando] ? c : new p.Event(s, c) : new p.Event(s), 
                    c.type = s, c.isTrigger = !0, c.exclusive = i, c.namespace = t.join("."), c.namespace_re = c.namespace ? new RegExp("(^|\\.)" + t.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, 
                    m = s.indexOf(":") < 0 ? "on" + s : "";
                    if (!f) {
                        h = p.cache;
                        for (j in h) h[j].events && h[j].events[s] && p.event.trigger(c, d, h[j].handle.elem, !0);
                        return;
                    }
                    c.result = b, c.target || (c.target = f), d = d != null ? p.makeArray(d) : [], d.unshift(c), 
                    n = p.event.special[s] || {};
                    if (n.trigger && n.trigger.apply(f, d) === !1) return;
                    q = [ [ f, n.bindType || s ] ];
                    if (!g && !n.noBubble && !p.isWindow(f)) {
                        r = n.delegateType || s, k = $.test(r + s) ? f : f.parentNode;
                        for (l = f; k; k = k.parentNode) q.push([ k, r ]), l = k;
                        l === (f.ownerDocument || e) && q.push([ l.defaultView || l.parentWindow || a, r ]);
                    }
                    for (j = 0; j < q.length && !c.isPropagationStopped(); j++) k = q[j][0], c.type = q[j][1], 
                    o = (p._data(k, "events") || {})[c.type] && p._data(k, "handle"), o && o.apply(k, d), 
                    o = m && k[m], o && p.acceptData(k) && o.apply && o.apply(k, d) === !1 && c.preventDefault();
                    return c.type = s, !g && !c.isDefaultPrevented() && (!n._default || n._default.apply(f.ownerDocument, d) === !1) && (s !== "click" || !p.nodeName(f, "a")) && p.acceptData(f) && m && f[s] && (s !== "focus" && s !== "blur" || c.target.offsetWidth !== 0) && !p.isWindow(f) && (l = f[m], 
                    l && (f[m] = null), p.event.triggered = s, f[s](), p.event.triggered = b, l && (f[m] = l)), 
                    c.result;
                }
                return;
            },
            dispatch: function(c) {
                c = p.event.fix(c || a.event);
                var d, e, f, g, h, i, j, l, m, n, o = (p._data(this, "events") || {})[c.type] || [], q = o.delegateCount, r = k.call(arguments), s = !c.exclusive && !c.namespace, t = p.event.special[c.type] || {}, u = [];
                r[0] = c, c.delegateTarget = this;
                if (t.preDispatch && t.preDispatch.call(this, c) === !1) return;
                if (q && (!c.button || c.type !== "click")) for (f = c.target; f != this; f = f.parentNode || this) if (f.disabled !== !0 || c.type !== "click") {
                    h = {}, j = [];
                    for (d = 0; d < q; d++) l = o[d], m = l.selector, h[m] === b && (h[m] = l.needsContext ? p(m, this).index(f) >= 0 : p.find(m, this, null, [ f ]).length), 
                    h[m] && j.push(l);
                    j.length && u.push({
                        elem: f,
                        matches: j
                    });
                }
                o.length > q && u.push({
                    elem: this,
                    matches: o.slice(q)
                });
                for (d = 0; d < u.length && !c.isPropagationStopped(); d++) {
                    i = u[d], c.currentTarget = i.elem;
                    for (e = 0; e < i.matches.length && !c.isImmediatePropagationStopped(); e++) {
                        l = i.matches[e];
                        if (s || !c.namespace && !l.namespace || c.namespace_re && c.namespace_re.test(l.namespace)) c.data = l.data, 
                        c.handleObj = l, g = ((p.event.special[l.origType] || {}).handle || l.handler).apply(i.elem, r), 
                        g !== b && (c.result = g, g === !1 && (c.preventDefault(), c.stopPropagation()));
                    }
                }
                return t.postDispatch && t.postDispatch.call(this, c), c.result;
            },
            props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
            fixHooks: {},
            keyHooks: {
                props: "char charCode key keyCode".split(" "),
                filter: function(a, b) {
                    return a.which == null && (a.which = b.charCode != null ? b.charCode : b.keyCode), 
                    a;
                }
            },
            mouseHooks: {
                props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                filter: function(a, c) {
                    var d, f, g, h = c.button, i = c.fromElement;
                    return a.pageX == null && c.clientX != null && (d = a.target.ownerDocument || e, 
                    f = d.documentElement, g = d.body, a.pageX = c.clientX + (f && f.scrollLeft || g && g.scrollLeft || 0) - (f && f.clientLeft || g && g.clientLeft || 0), 
                    a.pageY = c.clientY + (f && f.scrollTop || g && g.scrollTop || 0) - (f && f.clientTop || g && g.clientTop || 0)), 
                    !a.relatedTarget && i && (a.relatedTarget = i === a.target ? c.toElement : i), !a.which && h !== b && (a.which = h & 1 ? 1 : h & 2 ? 3 : h & 4 ? 2 : 0), 
                    a;
                }
            },
            fix: function(a) {
                if (a[p.expando]) return a;
                var b, c, d = a, f = p.event.fixHooks[a.type] || {}, g = f.props ? this.props.concat(f.props) : this.props;
                a = p.Event(d);
                for (b = g.length; b; ) c = g[--b], a[c] = d[c];
                return a.target || (a.target = d.srcElement || e), a.target.nodeType === 3 && (a.target = a.target.parentNode), 
                a.metaKey = !!a.metaKey, f.filter ? f.filter(a, d) : a;
            },
            special: {
                load: {
                    noBubble: !0
                },
                focus: {
                    delegateType: "focusin"
                },
                blur: {
                    delegateType: "focusout"
                },
                beforeunload: {
                    setup: function(a, b, c) {
                        p.isWindow(this) && (this.onbeforeunload = c);
                    },
                    teardown: function(a, b) {
                        this.onbeforeunload === b && (this.onbeforeunload = null);
                    }
                }
            },
            simulate: function(a, b, c, d) {
                var e = p.extend(new p.Event(), c, {
                    type: a,
                    isSimulated: !0,
                    originalEvent: {}
                });
                d ? p.event.trigger(e, null, b) : p.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault();
            }
        }, p.event.handle = p.event.dispatch, p.removeEvent = e.removeEventListener ? function(a, b, c) {
            a.removeEventListener && a.removeEventListener(b, c, !1);
        } : function(a, b, c) {
            var d = "on" + b;
            a.detachEvent && (typeof a[d] == "undefined" && (a[d] = null), a.detachEvent(d, c));
        }, p.Event = function(a, b) {
            if (this instanceof p.Event) a && a.type ? (this.originalEvent = a, this.type = a.type, 
            this.isDefaultPrevented = a.defaultPrevented || a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault() ? bb : ba) : this.type = a, 
            b && p.extend(this, b), this.timeStamp = a && a.timeStamp || p.now(), this[p.expando] = !0; else return new p.Event(a, b);
        }, p.Event.prototype = {
            preventDefault: function() {
                this.isDefaultPrevented = bb;
                var a = this.originalEvent;
                if (!a) return;
                a.preventDefault ? a.preventDefault() : a.returnValue = !1;
            },
            stopPropagation: function() {
                this.isPropagationStopped = bb;
                var a = this.originalEvent;
                if (!a) return;
                a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0;
            },
            stopImmediatePropagation: function() {
                this.isImmediatePropagationStopped = bb, this.stopPropagation();
            },
            isDefaultPrevented: ba,
            isPropagationStopped: ba,
            isImmediatePropagationStopped: ba
        }, p.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        }, function(a, b) {
            p.event.special[a] = {
                delegateType: b,
                bindType: b,
                handle: function(a) {
                    var c, d = this, e = a.relatedTarget, f = a.handleObj, g = f.selector;
                    if (!e || e !== d && !p.contains(d, e)) a.type = f.origType, c = f.handler.apply(this, arguments), 
                    a.type = b;
                    return c;
                }
            };
        }), p.support.submitBubbles || (p.event.special.submit = {
            setup: function() {
                if (p.nodeName(this, "form")) return !1;
                p.event.add(this, "click._submit keypress._submit", function(a) {
                    var c = a.target, d = p.nodeName(c, "input") || p.nodeName(c, "button") ? c.form : b;
                    d && !p._data(d, "_submit_attached") && (p.event.add(d, "submit._submit", function(a) {
                        a._submit_bubble = !0;
                    }), p._data(d, "_submit_attached", !0));
                });
            },
            postDispatch: function(a) {
                a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && p.event.simulate("submit", this.parentNode, a, !0));
            },
            teardown: function() {
                if (p.nodeName(this, "form")) return !1;
                p.event.remove(this, "._submit");
            }
        }), p.support.changeBubbles || (p.event.special.change = {
            setup: function() {
                if (V.test(this.nodeName)) {
                    if (this.type === "checkbox" || this.type === "radio") p.event.add(this, "propertychange._change", function(a) {
                        a.originalEvent.propertyName === "checked" && (this._just_changed = !0);
                    }), p.event.add(this, "click._change", function(a) {
                        this._just_changed && !a.isTrigger && (this._just_changed = !1), p.event.simulate("change", this, a, !0);
                    });
                    return !1;
                }
                p.event.add(this, "beforeactivate._change", function(a) {
                    var b = a.target;
                    V.test(b.nodeName) && !p._data(b, "_change_attached") && (p.event.add(b, "change._change", function(a) {
                        this.parentNode && !a.isSimulated && !a.isTrigger && p.event.simulate("change", this.parentNode, a, !0);
                    }), p._data(b, "_change_attached", !0));
                });
            },
            handle: function(a) {
                var b = a.target;
                if (this !== b || a.isSimulated || a.isTrigger || b.type !== "radio" && b.type !== "checkbox") return a.handleObj.handler.apply(this, arguments);
            },
            teardown: function() {
                return p.event.remove(this, "._change"), !V.test(this.nodeName);
            }
        }), p.support.focusinBubbles || p.each({
            focus: "focusin",
            blur: "focusout"
        }, function(a, b) {
            var c = 0, d = function(a) {
                p.event.simulate(b, a.target, p.event.fix(a), !0);
            };
            p.event.special[b] = {
                setup: function() {
                    c++ === 0 && e.addEventListener(a, d, !0);
                },
                teardown: function() {
                    --c === 0 && e.removeEventListener(a, d, !0);
                }
            };
        }), p.fn.extend({
            on: function(a, c, d, e, f) {
                var g, h;
                if (typeof a == "object") {
                    typeof c != "string" && (d = d || c, c = b);
                    for (h in a) this.on(h, c, d, a[h], f);
                    return this;
                }
                d == null && e == null ? (e = c, d = c = b) : e == null && (typeof c == "string" ? (e = d, 
                d = b) : (e = d, d = c, c = b));
                if (e === !1) e = ba; else if (!e) return this;
                return f === 1 && (g = e, e = function(a) {
                    return p().off(a), g.apply(this, arguments);
                }, e.guid = g.guid || (g.guid = p.guid++)), this.each(function() {
                    p.event.add(this, a, e, d, c);
                });
            },
            one: function(a, b, c, d) {
                return this.on(a, b, c, d, 1);
            },
            off: function(a, c, d) {
                var e, f;
                if (a && a.preventDefault && a.handleObj) return e = a.handleObj, p(a.delegateTarget).off(e.namespace ? e.origType + "." + e.namespace : e.origType, e.selector, e.handler), 
                this;
                if (typeof a == "object") {
                    for (f in a) this.off(f, c, a[f]);
                    return this;
                }
                if (c === !1 || typeof c == "function") d = c, c = b;
                return d === !1 && (d = ba), this.each(function() {
                    p.event.remove(this, a, d, c);
                });
            },
            bind: function(a, b, c) {
                return this.on(a, null, b, c);
            },
            unbind: function(a, b) {
                return this.off(a, null, b);
            },
            live: function(a, b, c) {
                return p(this.context).on(a, this.selector, b, c), this;
            },
            die: function(a, b) {
                return p(this.context).off(a, this.selector || "**", b), this;
            },
            delegate: function(a, b, c, d) {
                return this.on(b, a, c, d);
            },
            undelegate: function(a, b, c) {
                return arguments.length === 1 ? this.off(a, "**") : this.off(b, a || "**", c);
            },
            trigger: function(a, b) {
                return this.each(function() {
                    p.event.trigger(a, b, this);
                });
            },
            triggerHandler: function(a, b) {
                if (this[0]) return p.event.trigger(a, b, this[0], !0);
            },
            toggle: function(a) {
                var b = arguments, c = a.guid || p.guid++, d = 0, e = function(c) {
                    var e = (p._data(this, "lastToggle" + a.guid) || 0) % d;
                    return p._data(this, "lastToggle" + a.guid, e + 1), c.preventDefault(), b[e].apply(this, arguments) || !1;
                };
                e.guid = c;
                while (d < b.length) b[d++].guid = c;
                return this.click(e);
            },
            hover: function(a, b) {
                return this.mouseenter(a).mouseleave(b || a);
            }
        }), p.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
            p.fn[b] = function(a, c) {
                return c == null && (c = a, a = null), arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b);
            }, Y.test(b) && (p.event.fixHooks[b] = p.event.keyHooks), Z.test(b) && (p.event.fixHooks[b] = p.event.mouseHooks);
        }), function(a, b) {
            function bc(a, b, c, d) {
                c = c || [], b = b || r;
                var e, f, i, j, k = b.nodeType;
                if (!a || typeof a != "string") return c;
                if (k !== 1 && k !== 9) return [];
                i = g(b);
                if (!i && !d) if (e = P.exec(a)) if (j = e[1]) {
                    if (k === 9) {
                        f = b.getElementById(j);
                        if (!f || !f.parentNode) return c;
                        if (f.id === j) return c.push(f), c;
                    } else if (b.ownerDocument && (f = b.ownerDocument.getElementById(j)) && h(b, f) && f.id === j) return c.push(f), 
                    c;
                } else {
                    if (e[2]) return w.apply(c, x.call(b.getElementsByTagName(a), 0)), c;
                    if ((j = e[3]) && _ && b.getElementsByClassName) return w.apply(c, x.call(b.getElementsByClassName(j), 0)), 
                    c;
                }
                return bp(a.replace(L, "$1"), b, c, d, i);
            }
            function bd(a) {
                return function(b) {
                    var c = b.nodeName.toLowerCase();
                    return c === "input" && b.type === a;
                };
            }
            function be(a) {
                return function(b) {
                    var c = b.nodeName.toLowerCase();
                    return (c === "input" || c === "button") && b.type === a;
                };
            }
            function bf(a) {
                return z(function(b) {
                    return b = +b, z(function(c, d) {
                        var e, f = a([], c.length, b), g = f.length;
                        while (g--) c[e = f[g]] && (c[e] = !(d[e] = c[e]));
                    });
                });
            }
            function bg(a, b, c) {
                if (a === b) return c;
                var d = a.nextSibling;
                while (d) {
                    if (d === b) return -1;
                    d = d.nextSibling;
                }
                return 1;
            }
            function bh(a, b) {
                var c, d, f, g, h, i, j, k = C[o][a];
                if (k) return b ? 0 : k.slice(0);
                h = a, i = [], j = e.preFilter;
                while (h) {
                    if (!c || (d = M.exec(h))) d && (h = h.slice(d[0].length)), i.push(f = []);
                    c = !1;
                    if (d = N.exec(h)) f.push(c = new q(d.shift())), h = h.slice(c.length), c.type = d[0].replace(L, " ");
                    for (g in e.filter) (d = W[g].exec(h)) && (!j[g] || (d = j[g](d, r, !0))) && (f.push(c = new q(d.shift())), 
                    h = h.slice(c.length), c.type = g, c.matches = d);
                    if (!c) break;
                }
                return b ? h.length : h ? bc.error(a) : C(a, i).slice(0);
            }
            function bi(a, b, d) {
                var e = b.dir, f = d && b.dir === "parentNode", g = u++;
                return b.first ? function(b, c, d) {
                    while (b = b[e]) if (f || b.nodeType === 1) return a(b, c, d);
                } : function(b, d, h) {
                    if (!h) {
                        var i, j = t + " " + g + " ", k = j + c;
                        while (b = b[e]) if (f || b.nodeType === 1) {
                            if ((i = b[o]) === k) return b.sizset;
                            if (typeof i == "string" && i.indexOf(j) === 0) {
                                if (b.sizset) return b;
                            } else {
                                b[o] = k;
                                if (a(b, d, h)) return b.sizset = !0, b;
                                b.sizset = !1;
                            }
                        }
                    } else while (b = b[e]) if (f || b.nodeType === 1) if (a(b, d, h)) return b;
                };
            }
            function bj(a) {
                return a.length > 1 ? function(b, c, d) {
                    var e = a.length;
                    while (e--) if (!a[e](b, c, d)) return !1;
                    return !0;
                } : a[0];
            }
            function bk(a, b, c, d, e) {
                var f, g = [], h = 0, i = a.length, j = b != null;
                for (;h < i; h++) if (f = a[h]) if (!c || c(f, d, e)) g.push(f), j && b.push(h);
                return g;
            }
            function bl(a, b, c, d, e, f) {
                return d && !d[o] && (d = bl(d)), e && !e[o] && (e = bl(e, f)), z(function(f, g, h, i) {
                    if (f && e) return;
                    var j, k, l, m = [], n = [], o = g.length, p = f || bo(b || "*", h.nodeType ? [ h ] : h, [], f), q = a && (f || !b) ? bk(p, m, a, h, i) : p, r = c ? e || (f ? a : o || d) ? [] : g : q;
                    c && c(q, r, h, i);
                    if (d) {
                        l = bk(r, n), d(l, [], h, i), j = l.length;
                        while (j--) if (k = l[j]) r[n[j]] = !(q[n[j]] = k);
                    }
                    if (f) {
                        j = a && r.length;
                        while (j--) if (k = r[j]) f[m[j]] = !(g[m[j]] = k);
                    } else r = bk(r === g ? r.splice(o, r.length) : r), e ? e(null, g, r, i) : w.apply(g, r);
                });
            }
            function bm(a) {
                var b, c, d, f = a.length, g = e.relative[a[0].type], h = g || e.relative[" "], i = g ? 1 : 0, j = bi(function(a) {
                    return a === b;
                }, h, !0), k = bi(function(a) {
                    return y.call(b, a) > -1;
                }, h, !0), m = [ function(a, c, d) {
                    return !g && (d || c !== l) || ((b = c).nodeType ? j(a, c, d) : k(a, c, d));
                } ];
                for (;i < f; i++) if (c = e.relative[a[i].type]) m = [ bi(bj(m), c) ]; else {
                    c = e.filter[a[i].type].apply(null, a[i].matches);
                    if (c[o]) {
                        d = ++i;
                        for (;d < f; d++) if (e.relative[a[d].type]) break;
                        return bl(i > 1 && bj(m), i > 1 && a.slice(0, i - 1).join("").replace(L, "$1"), c, i < d && bm(a.slice(i, d)), d < f && bm(a = a.slice(d)), d < f && a.join(""));
                    }
                    m.push(c);
                }
                return bj(m);
            }
            function bn(a, b) {
                var d = b.length > 0, f = a.length > 0, g = function(h, i, j, k, m) {
                    var n, o, p, q = [], s = 0, u = "0", x = h && [], y = m != null, z = l, A = h || f && e.find.TAG("*", m && i.parentNode || i), B = t += z == null ? 1 : Math.E;
                    y && (l = i !== r && i, c = g.el);
                    for (;(n = A[u]) != null; u++) {
                        if (f && n) {
                            for (o = 0; p = a[o]; o++) if (p(n, i, j)) {
                                k.push(n);
                                break;
                            }
                            y && (t = B, c = ++g.el);
                        }
                        d && ((n = !p && n) && s--, h && x.push(n));
                    }
                    s += u;
                    if (d && u !== s) {
                        for (o = 0; p = b[o]; o++) p(x, q, i, j);
                        if (h) {
                            if (s > 0) while (u--) !x[u] && !q[u] && (q[u] = v.call(k));
                            q = bk(q);
                        }
                        w.apply(k, q), y && !h && q.length > 0 && s + b.length > 1 && bc.uniqueSort(k);
                    }
                    return y && (t = B, l = z), x;
                };
                return g.el = 0, d ? z(g) : g;
            }
            function bo(a, b, c, d) {
                var e = 0, f = b.length;
                for (;e < f; e++) bc(a, b[e], c, d);
                return c;
            }
            function bp(a, b, c, d, f) {
                var g, h, j, k, l, m = bh(a), n = m.length;
                if (!d && m.length === 1) {
                    h = m[0] = m[0].slice(0);
                    if (h.length > 2 && (j = h[0]).type === "ID" && b.nodeType === 9 && !f && e.relative[h[1].type]) {
                        b = e.find.ID(j.matches[0].replace(V, ""), b, f)[0];
                        if (!b) return c;
                        a = a.slice(h.shift().length);
                    }
                    for (g = W.POS.test(a) ? -1 : h.length - 1; g >= 0; g--) {
                        j = h[g];
                        if (e.relative[k = j.type]) break;
                        if (l = e.find[k]) if (d = l(j.matches[0].replace(V, ""), R.test(h[0].type) && b.parentNode || b, f)) {
                            h.splice(g, 1), a = d.length && h.join("");
                            if (!a) return w.apply(c, x.call(d, 0)), c;
                            break;
                        }
                    }
                }
                return i(a, m)(d, b, f, c, R.test(a)), c;
            }
            function bq() {}
            var c, d, e, f, g, h, i, j, k, l, m = !0, n = "undefined", o = ("sizcache" + Math.random()).replace(".", ""), q = String, r = a.document, s = r.documentElement, t = 0, u = 0, v = [].pop, w = [].push, x = [].slice, y = [].indexOf || function(a) {
                var b = 0, c = this.length;
                for (;b < c; b++) if (this[b] === a) return b;
                return -1;
            }, z = function(a, b) {
                return a[o] = b == null || b, a;
            }, A = function() {
                var a = {}, b = [];
                return z(function(c, d) {
                    return b.push(c) > e.cacheLength && delete a[b.shift()], a[c] = d;
                }, a);
            }, B = A(), C = A(), D = A(), E = "[\\x20\\t\\r\\n\\f]", F = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+", G = F.replace("w", "w#"), H = "([*^$|!~]?=)", I = "\\[" + E + "*(" + F + ")" + E + "*(?:" + H + E + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + G + ")|)|)" + E + "*\\]", J = ":(" + F + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + I + ")|[^:]|\\\\.)*|.*))\\)|)", K = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + E + "*((?:-\\d)?\\d*)" + E + "*\\)|)(?=[^-]|$)", L = new RegExp("^" + E + "+|((?:^|[^\\\\])(?:\\\\.)*)" + E + "+$", "g"), M = new RegExp("^" + E + "*," + E + "*"), N = new RegExp("^" + E + "*([\\x20\\t\\r\\n\\f>+~])" + E + "*"), O = new RegExp(J), P = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/, Q = /^:not/, R = /[\x20\t\r\n\f]*[+~]/, S = /:not\($/, T = /h\d/i, U = /input|select|textarea|button/i, V = /\\(?!\\)/g, W = {
                ID: new RegExp("^#(" + F + ")"),
                CLASS: new RegExp("^\\.(" + F + ")"),
                NAME: new RegExp("^\\[name=['\"]?(" + F + ")['\"]?\\]"),
                TAG: new RegExp("^(" + F.replace("w", "w*") + ")"),
                ATTR: new RegExp("^" + I),
                PSEUDO: new RegExp("^" + J),
                POS: new RegExp(K, "i"),
                CHILD: new RegExp("^:(only|nth|first|last)-child(?:\\(" + E + "*(even|odd|(([+-]|)(\\d*)n|)" + E + "*(?:([+-]|)" + E + "*(\\d+)|))" + E + "*\\)|)", "i"),
                needsContext: new RegExp("^" + E + "*[>+~]|" + K, "i")
            }, X = function(a) {
                var b = r.createElement("div");
                try {
                    return a(b);
                } catch (c) {
                    return !1;
                } finally {
                    b = null;
                }
            }, Y = X(function(a) {
                return a.appendChild(r.createComment("")), !a.getElementsByTagName("*").length;
            }), Z = X(function(a) {
                return a.innerHTML = "<a href='#'></a>", a.firstChild && typeof a.firstChild.getAttribute !== n && a.firstChild.getAttribute("href") === "#";
            }), $ = X(function(a) {
                a.innerHTML = "<select></select>";
                var b = typeof a.lastChild.getAttribute("multiple");
                return b !== "boolean" && b !== "string";
            }), _ = X(function(a) {
                return a.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>", !a.getElementsByClassName || !a.getElementsByClassName("e").length ? !1 : (a.lastChild.className = "e", 
                a.getElementsByClassName("e").length === 2);
            }), ba = X(function(a) {
                a.id = o + 0, a.innerHTML = "<a name='" + o + "'></a><div name='" + o + "'></div>", 
                s.insertBefore(a, s.firstChild);
                var b = r.getElementsByName && r.getElementsByName(o).length === 2 + r.getElementsByName(o + 0).length;
                return d = !r.getElementById(o), s.removeChild(a), b;
            });
            try {
                x.call(s.childNodes, 0)[0].nodeType;
            } catch (bb) {
                x = function(a) {
                    var b, c = [];
                    for (;b = this[a]; a++) c.push(b);
                    return c;
                };
            }
            bc.matches = function(a, b) {
                return bc(a, null, null, b);
            }, bc.matchesSelector = function(a, b) {
                return bc(b, null, null, [ a ]).length > 0;
            }, f = bc.getText = function(a) {
                var b, c = "", d = 0, e = a.nodeType;
                if (e) {
                    if (e === 1 || e === 9 || e === 11) {
                        if (typeof a.textContent == "string") return a.textContent;
                        for (a = a.firstChild; a; a = a.nextSibling) c += f(a);
                    } else if (e === 3 || e === 4) return a.nodeValue;
                } else for (;b = a[d]; d++) c += f(b);
                return c;
            }, g = bc.isXML = function(a) {
                var b = a && (a.ownerDocument || a).documentElement;
                return b ? b.nodeName !== "HTML" : !1;
            }, h = bc.contains = s.contains ? function(a, b) {
                var c = a.nodeType === 9 ? a.documentElement : a, d = b && b.parentNode;
                return a === d || !!(d && d.nodeType === 1 && c.contains && c.contains(d));
            } : s.compareDocumentPosition ? function(a, b) {
                return b && !!(a.compareDocumentPosition(b) & 16);
            } : function(a, b) {
                while (b = b.parentNode) if (b === a) return !0;
                return !1;
            }, bc.attr = function(a, b) {
                var c, d = g(a);
                return d || (b = b.toLowerCase()), (c = e.attrHandle[b]) ? c(a) : d || $ ? a.getAttribute(b) : (c = a.getAttributeNode(b), 
                c ? typeof a[b] == "boolean" ? a[b] ? b : null : c.specified ? c.value : null : null);
            }, e = bc.selectors = {
                cacheLength: 50,
                createPseudo: z,
                match: W,
                attrHandle: Z ? {} : {
                    href: function(a) {
                        return a.getAttribute("href", 2);
                    },
                    type: function(a) {
                        return a.getAttribute("type");
                    }
                },
                find: {
                    ID: d ? function(a, b, c) {
                        if (typeof b.getElementById !== n && !c) {
                            var d = b.getElementById(a);
                            return d && d.parentNode ? [ d ] : [];
                        }
                    } : function(a, c, d) {
                        if (typeof c.getElementById !== n && !d) {
                            var e = c.getElementById(a);
                            return e ? e.id === a || typeof e.getAttributeNode !== n && e.getAttributeNode("id").value === a ? [ e ] : b : [];
                        }
                    },
                    TAG: Y ? function(a, b) {
                        if (typeof b.getElementsByTagName !== n) return b.getElementsByTagName(a);
                    } : function(a, b) {
                        var c = b.getElementsByTagName(a);
                        if (a === "*") {
                            var d, e = [], f = 0;
                            for (;d = c[f]; f++) d.nodeType === 1 && e.push(d);
                            return e;
                        }
                        return c;
                    },
                    NAME: ba && function(a, b) {
                        if (typeof b.getElementsByName !== n) return b.getElementsByName(name);
                    },
                    CLASS: _ && function(a, b, c) {
                        if (typeof b.getElementsByClassName !== n && !c) return b.getElementsByClassName(a);
                    }
                },
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(a) {
                        return a[1] = a[1].replace(V, ""), a[3] = (a[4] || a[5] || "").replace(V, ""), a[2] === "~=" && (a[3] = " " + a[3] + " "), 
                        a.slice(0, 4);
                    },
                    CHILD: function(a) {
                        return a[1] = a[1].toLowerCase(), a[1] === "nth" ? (a[2] || bc.error(a[0]), a[3] = +(a[3] ? a[4] + (a[5] || 1) : 2 * (a[2] === "even" || a[2] === "odd")), 
                        a[4] = +(a[6] + a[7] || a[2] === "odd")) : a[2] && bc.error(a[0]), a;
                    },
                    PSEUDO: function(a) {
                        var b, c;
                        if (W.CHILD.test(a[0])) return null;
                        if (a[3]) a[2] = a[3]; else if (b = a[4]) O.test(b) && (c = bh(b, !0)) && (c = b.indexOf(")", b.length - c) - b.length) && (b = b.slice(0, c), 
                        a[0] = a[0].slice(0, c)), a[2] = b;
                        return a.slice(0, 3);
                    }
                },
                filter: {
                    ID: d ? function(a) {
                        return a = a.replace(V, ""), function(b) {
                            return b.getAttribute("id") === a;
                        };
                    } : function(a) {
                        return a = a.replace(V, ""), function(b) {
                            var c = typeof b.getAttributeNode !== n && b.getAttributeNode("id");
                            return c && c.value === a;
                        };
                    },
                    TAG: function(a) {
                        return a === "*" ? function() {
                            return !0;
                        } : (a = a.replace(V, "").toLowerCase(), function(b) {
                            return b.nodeName && b.nodeName.toLowerCase() === a;
                        });
                    },
                    CLASS: function(a) {
                        var b = B[o][a];
                        return b || (b = B(a, new RegExp("(^|" + E + ")" + a + "(" + E + "|$)"))), function(a) {
                            return b.test(a.className || typeof a.getAttribute !== n && a.getAttribute("class") || "");
                        };
                    },
                    ATTR: function(a, b, c) {
                        return function(d, e) {
                            var f = bc.attr(d, a);
                            return f == null ? b === "!=" : b ? (f += "", b === "=" ? f === c : b === "!=" ? f !== c : b === "^=" ? c && f.indexOf(c) === 0 : b === "*=" ? c && f.indexOf(c) > -1 : b === "$=" ? c && f.substr(f.length - c.length) === c : b === "~=" ? (" " + f + " ").indexOf(c) > -1 : b === "|=" ? f === c || f.substr(0, c.length + 1) === c + "-" : !1) : !0;
                        };
                    },
                    CHILD: function(a, b, c, d) {
                        return a === "nth" ? function(a) {
                            var b, e, f = a.parentNode;
                            if (c === 1 && d === 0) return !0;
                            if (f) {
                                e = 0;
                                for (b = f.firstChild; b; b = b.nextSibling) if (b.nodeType === 1) {
                                    e++;
                                    if (a === b) break;
                                }
                            }
                            return e -= d, e === c || e % c === 0 && e / c >= 0;
                        } : function(b) {
                            var c = b;
                            switch (a) {
                              case "only":
                              case "first":
                                while (c = c.previousSibling) if (c.nodeType === 1) return !1;
                                if (a === "first") return !0;
                                c = b;

                              case "last":
                                while (c = c.nextSibling) if (c.nodeType === 1) return !1;
                                return !0;
                            }
                        };
                    },
                    PSEUDO: function(a, b) {
                        var c, d = e.pseudos[a] || e.setFilters[a.toLowerCase()] || bc.error("unsupported pseudo: " + a);
                        return d[o] ? d(b) : d.length > 1 ? (c = [ a, a, "", b ], e.setFilters.hasOwnProperty(a.toLowerCase()) ? z(function(a, c) {
                            var e, f = d(a, b), g = f.length;
                            while (g--) e = y.call(a, f[g]), a[e] = !(c[e] = f[g]);
                        }) : function(a) {
                            return d(a, 0, c);
                        }) : d;
                    }
                },
                pseudos: {
                    not: z(function(a) {
                        var b = [], c = [], d = i(a.replace(L, "$1"));
                        return d[o] ? z(function(a, b, c, e) {
                            var f, g = d(a, null, e, []), h = a.length;
                            while (h--) if (f = g[h]) a[h] = !(b[h] = f);
                        }) : function(a, e, f) {
                            return b[0] = a, d(b, null, f, c), !c.pop();
                        };
                    }),
                    has: z(function(a) {
                        return function(b) {
                            return bc(a, b).length > 0;
                        };
                    }),
                    contains: z(function(a) {
                        return function(b) {
                            return (b.textContent || b.innerText || f(b)).indexOf(a) > -1;
                        };
                    }),
                    enabled: function(a) {
                        return a.disabled === !1;
                    },
                    disabled: function(a) {
                        return a.disabled === !0;
                    },
                    checked: function(a) {
                        var b = a.nodeName.toLowerCase();
                        return b === "input" && !!a.checked || b === "option" && !!a.selected;
                    },
                    selected: function(a) {
                        return a.parentNode && a.parentNode.selectedIndex, a.selected === !0;
                    },
                    parent: function(a) {
                        return !e.pseudos.empty(a);
                    },
                    empty: function(a) {
                        var b;
                        a = a.firstChild;
                        while (a) {
                            if (a.nodeName > "@" || (b = a.nodeType) === 3 || b === 4) return !1;
                            a = a.nextSibling;
                        }
                        return !0;
                    },
                    header: function(a) {
                        return T.test(a.nodeName);
                    },
                    text: function(a) {
                        var b, c;
                        return a.nodeName.toLowerCase() === "input" && (b = a.type) === "text" && ((c = a.getAttribute("type")) == null || c.toLowerCase() === b);
                    },
                    radio: bd("radio"),
                    checkbox: bd("checkbox"),
                    file: bd("file"),
                    password: bd("password"),
                    image: bd("image"),
                    submit: be("submit"),
                    reset: be("reset"),
                    button: function(a) {
                        var b = a.nodeName.toLowerCase();
                        return b === "input" && a.type === "button" || b === "button";
                    },
                    input: function(a) {
                        return U.test(a.nodeName);
                    },
                    focus: function(a) {
                        var b = a.ownerDocument;
                        return a === b.activeElement && (!b.hasFocus || b.hasFocus()) && (!!a.type || !!a.href);
                    },
                    active: function(a) {
                        return a === a.ownerDocument.activeElement;
                    },
                    first: bf(function(a, b, c) {
                        return [ 0 ];
                    }),
                    last: bf(function(a, b, c) {
                        return [ b - 1 ];
                    }),
                    eq: bf(function(a, b, c) {
                        return [ c < 0 ? c + b : c ];
                    }),
                    even: bf(function(a, b, c) {
                        for (var d = 0; d < b; d += 2) a.push(d);
                        return a;
                    }),
                    odd: bf(function(a, b, c) {
                        for (var d = 1; d < b; d += 2) a.push(d);
                        return a;
                    }),
                    lt: bf(function(a, b, c) {
                        for (var d = c < 0 ? c + b : c; --d >= 0; ) a.push(d);
                        return a;
                    }),
                    gt: bf(function(a, b, c) {
                        for (var d = c < 0 ? c + b : c; ++d < b; ) a.push(d);
                        return a;
                    })
                }
            }, j = s.compareDocumentPosition ? function(a, b) {
                return a === b ? (k = !0, 0) : (!a.compareDocumentPosition || !b.compareDocumentPosition ? a.compareDocumentPosition : a.compareDocumentPosition(b) & 4) ? -1 : 1;
            } : function(a, b) {
                if (a === b) return k = !0, 0;
                if (a.sourceIndex && b.sourceIndex) return a.sourceIndex - b.sourceIndex;
                var c, d, e = [], f = [], g = a.parentNode, h = b.parentNode, i = g;
                if (g === h) return bg(a, b);
                if (!g) return -1;
                if (!h) return 1;
                while (i) e.unshift(i), i = i.parentNode;
                i = h;
                while (i) f.unshift(i), i = i.parentNode;
                c = e.length, d = f.length;
                for (var j = 0; j < c && j < d; j++) if (e[j] !== f[j]) return bg(e[j], f[j]);
                return j === c ? bg(a, f[j], -1) : bg(e[j], b, 1);
            }, [ 0, 0 ].sort(j), m = !k, bc.uniqueSort = function(a) {
                var b, c = 1;
                k = m, a.sort(j);
                if (k) for (;b = a[c]; c++) b === a[c - 1] && a.splice(c--, 1);
                return a;
            }, bc.error = function(a) {
                throw new Error("Syntax error, unrecognized expression: " + a);
            }, i = bc.compile = function(a, b) {
                var c, d = [], e = [], f = D[o][a];
                if (!f) {
                    b || (b = bh(a)), c = b.length;
                    while (c--) f = bm(b[c]), f[o] ? d.push(f) : e.push(f);
                    f = D(a, bn(e, d));
                }
                return f;
            }, r.querySelectorAll && function() {
                var a, b = bp, c = /'|\\/g, d = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g, e = [ ":focus" ], f = [ ":active", ":focus" ], h = s.matchesSelector || s.mozMatchesSelector || s.webkitMatchesSelector || s.oMatchesSelector || s.msMatchesSelector;
                X(function(a) {
                    a.innerHTML = "<select><option selected=''></option></select>", a.querySelectorAll("[selected]").length || e.push("\\[" + E + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)"), 
                    a.querySelectorAll(":checked").length || e.push(":checked");
                }), X(function(a) {
                    a.innerHTML = "<p test=''></p>", a.querySelectorAll("[test^='']").length && e.push("[*^$]=" + E + "*(?:\"\"|'')"), 
                    a.innerHTML = "<input type='hidden'/>", a.querySelectorAll(":enabled").length || e.push(":enabled", ":disabled");
                }), e = new RegExp(e.join("|")), bp = function(a, d, f, g, h) {
                    if (!g && !h && (!e || !e.test(a))) {
                        var i, j, k = !0, l = o, m = d, n = d.nodeType === 9 && a;
                        if (d.nodeType === 1 && d.nodeName.toLowerCase() !== "object") {
                            i = bh(a), (k = d.getAttribute("id")) ? l = k.replace(c, "\\$&") : d.setAttribute("id", l), 
                            l = "[id='" + l + "'] ", j = i.length;
                            while (j--) i[j] = l + i[j].join("");
                            m = R.test(a) && d.parentNode || d, n = i.join(",");
                        }
                        if (n) try {
                            return w.apply(f, x.call(m.querySelectorAll(n), 0)), f;
                        } catch (p) {} finally {
                            k || d.removeAttribute("id");
                        }
                    }
                    return b(a, d, f, g, h);
                }, h && (X(function(b) {
                    a = h.call(b, "div");
                    try {
                        h.call(b, "[test!='']:sizzle"), f.push("!=", J);
                    } catch (c) {}
                }), f = new RegExp(f.join("|")), bc.matchesSelector = function(b, c) {
                    c = c.replace(d, "='$1']");
                    if (!g(b) && !f.test(c) && (!e || !e.test(c))) try {
                        var i = h.call(b, c);
                        if (i || a || b.document && b.document.nodeType !== 11) return i;
                    } catch (j) {}
                    return bc(c, null, null, [ b ]).length > 0;
                });
            }(), e.pseudos.nth = e.pseudos.eq, e.filters = bq.prototype = e.pseudos, e.setFilters = new bq(), 
            bc.attr = p.attr, p.find = bc, p.expr = bc.selectors, p.expr[":"] = p.expr.pseudos, 
            p.unique = bc.uniqueSort, p.text = bc.getText, p.isXMLDoc = bc.isXML, p.contains = bc.contains;
        }(a);
        var bc = /Until$/, bd = /^(?:parents|prev(?:Until|All))/, be = /^.[^:#\[\.,]*$/, bf = p.expr.match.needsContext, bg = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
        p.fn.extend({
            find: function(a) {
                var b, c, d, e, f, g, h = this;
                if (typeof a != "string") return p(a).filter(function() {
                    for (b = 0, c = h.length; b < c; b++) if (p.contains(h[b], this)) return !0;
                });
                g = this.pushStack("", "find", a);
                for (b = 0, c = this.length; b < c; b++) {
                    d = g.length, p.find(a, this[b], g);
                    if (b > 0) for (e = d; e < g.length; e++) for (f = 0; f < d; f++) if (g[f] === g[e]) {
                        g.splice(e--, 1);
                        break;
                    }
                }
                return g;
            },
            has: function(a) {
                var b, c = p(a, this), d = c.length;
                return this.filter(function() {
                    for (b = 0; b < d; b++) if (p.contains(this, c[b])) return !0;
                });
            },
            not: function(a) {
                return this.pushStack(bj(this, a, !1), "not", a);
            },
            filter: function(a) {
                return this.pushStack(bj(this, a, !0), "filter", a);
            },
            is: function(a) {
                return !!a && (typeof a == "string" ? bf.test(a) ? p(a, this.context).index(this[0]) >= 0 : p.filter(a, this).length > 0 : this.filter(a).length > 0);
            },
            closest: function(a, b) {
                var c, d = 0, e = this.length, f = [], g = bf.test(a) || typeof a != "string" ? p(a, b || this.context) : 0;
                for (;d < e; d++) {
                    c = this[d];
                    while (c && c.ownerDocument && c !== b && c.nodeType !== 11) {
                        if (g ? g.index(c) > -1 : p.find.matchesSelector(c, a)) {
                            f.push(c);
                            break;
                        }
                        c = c.parentNode;
                    }
                }
                return f = f.length > 1 ? p.unique(f) : f, this.pushStack(f, "closest", a);
            },
            index: function(a) {
                return a ? typeof a == "string" ? p.inArray(this[0], p(a)) : p.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.prevAll().length : -1;
            },
            add: function(a, b) {
                var c = typeof a == "string" ? p(a, b) : p.makeArray(a && a.nodeType ? [ a ] : a), d = p.merge(this.get(), c);
                return this.pushStack(bh(c[0]) || bh(d[0]) ? d : p.unique(d));
            },
            addBack: function(a) {
                return this.add(a == null ? this.prevObject : this.prevObject.filter(a));
            }
        }), p.fn.andSelf = p.fn.addBack, p.each({
            parent: function(a) {
                var b = a.parentNode;
                return b && b.nodeType !== 11 ? b : null;
            },
            parents: function(a) {
                return p.dir(a, "parentNode");
            },
            parentsUntil: function(a, b, c) {
                return p.dir(a, "parentNode", c);
            },
            next: function(a) {
                return bi(a, "nextSibling");
            },
            prev: function(a) {
                return bi(a, "previousSibling");
            },
            nextAll: function(a) {
                return p.dir(a, "nextSibling");
            },
            prevAll: function(a) {
                return p.dir(a, "previousSibling");
            },
            nextUntil: function(a, b, c) {
                return p.dir(a, "nextSibling", c);
            },
            prevUntil: function(a, b, c) {
                return p.dir(a, "previousSibling", c);
            },
            siblings: function(a) {
                return p.sibling((a.parentNode || {}).firstChild, a);
            },
            children: function(a) {
                return p.sibling(a.firstChild);
            },
            contents: function(a) {
                return p.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : p.merge([], a.childNodes);
            }
        }, function(a, b) {
            p.fn[a] = function(c, d) {
                var e = p.map(this, b, c);
                return bc.test(a) || (d = c), d && typeof d == "string" && (e = p.filter(d, e)), 
                e = this.length > 1 && !bg[a] ? p.unique(e) : e, this.length > 1 && bd.test(a) && (e = e.reverse()), 
                this.pushStack(e, a, k.call(arguments).join(","));
            };
        }), p.extend({
            filter: function(a, b, c) {
                return c && (a = ":not(" + a + ")"), b.length === 1 ? p.find.matchesSelector(b[0], a) ? [ b[0] ] : [] : p.find.matches(a, b);
            },
            dir: function(a, c, d) {
                var e = [], f = a[c];
                while (f && f.nodeType !== 9 && (d === b || f.nodeType !== 1 || !p(f).is(d))) f.nodeType === 1 && e.push(f), 
                f = f[c];
                return e;
            },
            sibling: function(a, b) {
                var c = [];
                for (;a; a = a.nextSibling) a.nodeType === 1 && a !== b && c.push(a);
                return c;
            }
        });
        var bl = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", bm = / jQuery\d+="(?:null|\d+)"/g, bn = /^\s+/, bo = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, bp = /<([\w:]+)/, bq = /<tbody/i, br = /<|&#?\w+;/, bs = /<(?:script|style|link)/i, bt = /<(?:script|object|embed|option|style)/i, bu = new RegExp("<(?:" + bl + ")[\\s/>]", "i"), bv = /^(?:checkbox|radio)$/, bw = /checked\s*(?:[^=]|=\s*.checked.)/i, bx = /\/(java|ecma)script/i, by = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g, bz = {
            option: [ 1, "<select multiple='multiple'>", "</select>" ],
            legend: [ 1, "<fieldset>", "</fieldset>" ],
            thead: [ 1, "<table>", "</table>" ],
            tr: [ 2, "<table><tbody>", "</tbody></table>" ],
            td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
            col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
            area: [ 1, "<map>", "</map>" ],
            _default: [ 0, "", "" ]
        }, bA = bk(e), bB = bA.appendChild(e.createElement("div"));
        bz.optgroup = bz.option, bz.tbody = bz.tfoot = bz.colgroup = bz.caption = bz.thead, 
        bz.th = bz.td, p.support.htmlSerialize || (bz._default = [ 1, "X<div>", "</div>" ]), 
        p.fn.extend({
            text: function(a) {
                return p.access(this, function(a) {
                    return a === b ? p.text(this) : this.empty().append((this[0] && this[0].ownerDocument || e).createTextNode(a));
                }, null, a, arguments.length);
            },
            wrapAll: function(a) {
                if (p.isFunction(a)) return this.each(function(b) {
                    p(this).wrapAll(a.call(this, b));
                });
                if (this[0]) {
                    var b = p(a, this[0].ownerDocument).eq(0).clone(!0);
                    this[0].parentNode && b.insertBefore(this[0]), b.map(function() {
                        var a = this;
                        while (a.firstChild && a.firstChild.nodeType === 1) a = a.firstChild;
                        return a;
                    }).append(this);
                }
                return this;
            },
            wrapInner: function(a) {
                return p.isFunction(a) ? this.each(function(b) {
                    p(this).wrapInner(a.call(this, b));
                }) : this.each(function() {
                    var b = p(this), c = b.contents();
                    c.length ? c.wrapAll(a) : b.append(a);
                });
            },
            wrap: function(a) {
                var b = p.isFunction(a);
                return this.each(function(c) {
                    p(this).wrapAll(b ? a.call(this, c) : a);
                });
            },
            unwrap: function() {
                return this.parent().each(function() {
                    p.nodeName(this, "body") || p(this).replaceWith(this.childNodes);
                }).end();
            },
            append: function() {
                return this.domManip(arguments, !0, function(a) {
                    (this.nodeType === 1 || this.nodeType === 11) && this.appendChild(a);
                });
            },
            prepend: function() {
                return this.domManip(arguments, !0, function(a) {
                    (this.nodeType === 1 || this.nodeType === 11) && this.insertBefore(a, this.firstChild);
                });
            },
            before: function() {
                if (!bh(this[0])) return this.domManip(arguments, !1, function(a) {
                    this.parentNode.insertBefore(a, this);
                });
                if (arguments.length) {
                    var a = p.clean(arguments);
                    return this.pushStack(p.merge(a, this), "before", this.selector);
                }
            },
            after: function() {
                if (!bh(this[0])) return this.domManip(arguments, !1, function(a) {
                    this.parentNode.insertBefore(a, this.nextSibling);
                });
                if (arguments.length) {
                    var a = p.clean(arguments);
                    return this.pushStack(p.merge(this, a), "after", this.selector);
                }
            },
            remove: function(a, b) {
                var c, d = 0;
                for (;(c = this[d]) != null; d++) if (!a || p.filter(a, [ c ]).length) !b && c.nodeType === 1 && (p.cleanData(c.getElementsByTagName("*")), 
                p.cleanData([ c ])), c.parentNode && c.parentNode.removeChild(c);
                return this;
            },
            empty: function() {
                var a, b = 0;
                for (;(a = this[b]) != null; b++) {
                    a.nodeType === 1 && p.cleanData(a.getElementsByTagName("*"));
                    while (a.firstChild) a.removeChild(a.firstChild);
                }
                return this;
            },
            clone: function(a, b) {
                return a = a == null ? !1 : a, b = b == null ? a : b, this.map(function() {
                    return p.clone(this, a, b);
                });
            },
            html: function(a) {
                return p.access(this, function(a) {
                    var c = this[0] || {}, d = 0, e = this.length;
                    if (a === b) return c.nodeType === 1 ? c.innerHTML.replace(bm, "") : b;
                    if (typeof a == "string" && !bs.test(a) && (p.support.htmlSerialize || !bu.test(a)) && (p.support.leadingWhitespace || !bn.test(a)) && !bz[(bp.exec(a) || [ "", "" ])[1].toLowerCase()]) {
                        a = a.replace(bo, "<$1></$2>");
                        try {
                            for (;d < e; d++) c = this[d] || {}, c.nodeType === 1 && (p.cleanData(c.getElementsByTagName("*")), 
                            c.innerHTML = a);
                            c = 0;
                        } catch (f) {}
                    }
                    c && this.empty().append(a);
                }, null, a, arguments.length);
            },
            replaceWith: function(a) {
                return bh(this[0]) ? this.length ? this.pushStack(p(p.isFunction(a) ? a() : a), "replaceWith", a) : this : p.isFunction(a) ? this.each(function(b) {
                    var c = p(this), d = c.html();
                    c.replaceWith(a.call(this, b, d));
                }) : (typeof a != "string" && (a = p(a).detach()), this.each(function() {
                    var b = this.nextSibling, c = this.parentNode;
                    p(this).remove(), b ? p(b).before(a) : p(c).append(a);
                }));
            },
            detach: function(a) {
                return this.remove(a, !0);
            },
            domManip: function(a, c, d) {
                a = [].concat.apply([], a);
                var e, f, g, h, i = 0, j = a[0], k = [], l = this.length;
                if (!p.support.checkClone && l > 1 && typeof j == "string" && bw.test(j)) return this.each(function() {
                    p(this).domManip(a, c, d);
                });
                if (p.isFunction(j)) return this.each(function(e) {
                    var f = p(this);
                    a[0] = j.call(this, e, c ? f.html() : b), f.domManip(a, c, d);
                });
                if (this[0]) {
                    e = p.buildFragment(a, this, k), g = e.fragment, f = g.firstChild, g.childNodes.length === 1 && (g = f);
                    if (f) {
                        c = c && p.nodeName(f, "tr");
                        for (h = e.cacheable || l - 1; i < l; i++) d.call(c && p.nodeName(this[i], "table") ? bC(this[i], "tbody") : this[i], i === h ? g : p.clone(g, !0, !0));
                    }
                    g = f = null, k.length && p.each(k, function(a, b) {
                        b.src ? p.ajax ? p.ajax({
                            url: b.src,
                            type: "GET",
                            dataType: "script",
                            async: !1,
                            global: !1,
                            "throws": !0
                        }) : p.error("no ajax") : p.globalEval((b.text || b.textContent || b.innerHTML || "").replace(by, "")), 
                        b.parentNode && b.parentNode.removeChild(b);
                    });
                }
                return this;
            }
        }), p.buildFragment = function(a, c, d) {
            var f, g, h, i = a[0];
            return c = c || e, c = !c.nodeType && c[0] || c, c = c.ownerDocument || c, a.length === 1 && typeof i == "string" && i.length < 512 && c === e && i.charAt(0) === "<" && !bt.test(i) && (p.support.checkClone || !bw.test(i)) && (p.support.html5Clone || !bu.test(i)) && (g = !0, 
            f = p.fragments[i], h = f !== b), f || (f = c.createDocumentFragment(), p.clean(a, c, f, d), 
            g && (p.fragments[i] = h && f)), {
                fragment: f,
                cacheable: g
            };
        }, p.fragments = {}, p.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function(a, b) {
            p.fn[a] = function(c) {
                var d, e = 0, f = [], g = p(c), h = g.length, i = this.length === 1 && this[0].parentNode;
                if ((i == null || i && i.nodeType === 11 && i.childNodes.length === 1) && h === 1) return g[b](this[0]), 
                this;
                for (;e < h; e++) d = (e > 0 ? this.clone(!0) : this).get(), p(g[e])[b](d), f = f.concat(d);
                return this.pushStack(f, a, g.selector);
            };
        }), p.extend({
            clone: function(a, b, c) {
                var d, e, f, g;
                p.support.html5Clone || p.isXMLDoc(a) || !bu.test("<" + a.nodeName + ">") ? g = a.cloneNode(!0) : (bB.innerHTML = a.outerHTML, 
                bB.removeChild(g = bB.firstChild));
                if ((!p.support.noCloneEvent || !p.support.noCloneChecked) && (a.nodeType === 1 || a.nodeType === 11) && !p.isXMLDoc(a)) {
                    bE(a, g), d = bF(a), e = bF(g);
                    for (f = 0; d[f]; ++f) e[f] && bE(d[f], e[f]);
                }
                if (b) {
                    bD(a, g);
                    if (c) {
                        d = bF(a), e = bF(g);
                        for (f = 0; d[f]; ++f) bD(d[f], e[f]);
                    }
                }
                return d = e = null, g;
            },
            clean: function(a, b, c, d) {
                var f, g, h, i, j, k, l, m, n, o, q, r, s = b === e && bA, t = [];
                if (!b || typeof b.createDocumentFragment == "undefined") b = e;
                for (f = 0; (h = a[f]) != null; f++) {
                    typeof h == "number" && (h += "");
                    if (!h) continue;
                    if (typeof h == "string") if (!br.test(h)) h = b.createTextNode(h); else {
                        s = s || bk(b), l = b.createElement("div"), s.appendChild(l), h = h.replace(bo, "<$1></$2>"), 
                        i = (bp.exec(h) || [ "", "" ])[1].toLowerCase(), j = bz[i] || bz._default, k = j[0], 
                        l.innerHTML = j[1] + h + j[2];
                        while (k--) l = l.lastChild;
                        if (!p.support.tbody) {
                            m = bq.test(h), n = i === "table" && !m ? l.firstChild && l.firstChild.childNodes : j[1] === "<table>" && !m ? l.childNodes : [];
                            for (g = n.length - 1; g >= 0; --g) p.nodeName(n[g], "tbody") && !n[g].childNodes.length && n[g].parentNode.removeChild(n[g]);
                        }
                        !p.support.leadingWhitespace && bn.test(h) && l.insertBefore(b.createTextNode(bn.exec(h)[0]), l.firstChild), 
                        h = l.childNodes, l.parentNode.removeChild(l);
                    }
                    h.nodeType ? t.push(h) : p.merge(t, h);
                }
                l && (h = l = s = null);
                if (!p.support.appendChecked) for (f = 0; (h = t[f]) != null; f++) p.nodeName(h, "input") ? bG(h) : typeof h.getElementsByTagName != "undefined" && p.grep(h.getElementsByTagName("input"), bG);
                if (c) {
                    q = function(a) {
                        if (!a.type || bx.test(a.type)) return d ? d.push(a.parentNode ? a.parentNode.removeChild(a) : a) : c.appendChild(a);
                    };
                    for (f = 0; (h = t[f]) != null; f++) if (!p.nodeName(h, "script") || !q(h)) c.appendChild(h), 
                    typeof h.getElementsByTagName != "undefined" && (r = p.grep(p.merge([], h.getElementsByTagName("script")), q), 
                    t.splice.apply(t, [ f + 1, 0 ].concat(r)), f += r.length);
                }
                return t;
            },
            cleanData: function(a, b) {
                var c, d, e, f, g = 0, h = p.expando, i = p.cache, j = p.support.deleteExpando, k = p.event.special;
                for (;(e = a[g]) != null; g++) if (b || p.acceptData(e)) {
                    d = e[h], c = d && i[d];
                    if (c) {
                        if (c.events) for (f in c.events) k[f] ? p.event.remove(e, f) : p.removeEvent(e, f, c.handle);
                        i[d] && (delete i[d], j ? delete e[h] : e.removeAttribute ? e.removeAttribute(h) : e[h] = null, 
                        p.deletedIds.push(d));
                    }
                }
            }
        }), function() {
            var a, b;
            p.uaMatch = function(a) {
                a = a.toLowerCase();
                var b = /(chrome)[ \/]([\w.]+)/.exec(a) || /(webkit)[ \/]([\w.]+)/.exec(a) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a) || /(msie) ([\w.]+)/.exec(a) || a.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a) || [];
                return {
                    browser: b[1] || "",
                    version: b[2] || "0"
                };
            }, a = p.uaMatch(g.userAgent), b = {}, a.browser && (b[a.browser] = !0, b.version = a.version), 
            b.chrome ? b.webkit = !0 : b.webkit && (b.safari = !0), p.browser = b, p.sub = function() {
                function a(b, c) {
                    return new a.fn.init(b, c);
                }
                p.extend(!0, a, this), a.superclass = this, a.fn = a.prototype = this(), a.fn.constructor = a, 
                a.sub = this.sub, a.fn.init = function c(c, d) {
                    return d && d instanceof p && !(d instanceof a) && (d = a(d)), p.fn.init.call(this, c, d, b);
                }, a.fn.init.prototype = a.fn;
                var b = a(e);
                return a;
            };
        }();
        var bH, bI, bJ, bK = /alpha\([^)]*\)/i, bL = /opacity=([^)]*)/, bM = /^(top|right|bottom|left)$/, bN = /^(none|table(?!-c[ea]).+)/, bO = /^margin/, bP = new RegExp("^(" + q + ")(.*)$", "i"), bQ = new RegExp("^(" + q + ")(?!px)[a-z%]+$", "i"), bR = new RegExp("^([-+])=(" + q + ")", "i"), bS = {}, bT = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        }, bU = {
            letterSpacing: 0,
            fontWeight: 400
        }, bV = [ "Top", "Right", "Bottom", "Left" ], bW = [ "Webkit", "O", "Moz", "ms" ], bX = p.fn.toggle;
        p.fn.extend({
            css: function(a, c) {
                return p.access(this, function(a, c, d) {
                    return d !== b ? p.style(a, c, d) : p.css(a, c);
                }, a, c, arguments.length > 1);
            },
            show: function() {
                return b$(this, !0);
            },
            hide: function() {
                return b$(this);
            },
            toggle: function(a, b) {
                var c = typeof a == "boolean";
                return p.isFunction(a) && p.isFunction(b) ? bX.apply(this, arguments) : this.each(function() {
                    (c ? a : bZ(this)) ? p(this).show() : p(this).hide();
                });
            }
        }), p.extend({
            cssHooks: {
                opacity: {
                    get: function(a, b) {
                        if (b) {
                            var c = bH(a, "opacity");
                            return c === "" ? "1" : c;
                        }
                    }
                }
            },
            cssNumber: {
                fillOpacity: !0,
                fontWeight: !0,
                lineHeight: !0,
                opacity: !0,
                orphans: !0,
                widows: !0,
                zIndex: !0,
                zoom: !0
            },
            cssProps: {
                "float": p.support.cssFloat ? "cssFloat" : "styleFloat"
            },
            style: function(a, c, d, e) {
                if (!a || a.nodeType === 3 || a.nodeType === 8 || !a.style) return;
                var f, g, h, i = p.camelCase(c), j = a.style;
                c = p.cssProps[i] || (p.cssProps[i] = bY(j, i)), h = p.cssHooks[c] || p.cssHooks[i];
                if (d === b) return h && "get" in h && (f = h.get(a, !1, e)) !== b ? f : j[c];
                g = typeof d, g === "string" && (f = bR.exec(d)) && (d = (f[1] + 1) * f[2] + parseFloat(p.css(a, c)), 
                g = "number");
                if (d == null || g === "number" && isNaN(d)) return;
                g === "number" && !p.cssNumber[i] && (d += "px");
                if (!h || !("set" in h) || (d = h.set(a, d, e)) !== b) try {
                    j[c] = d;
                } catch (k) {}
            },
            css: function(a, c, d, e) {
                var f, g, h, i = p.camelCase(c);
                return c = p.cssProps[i] || (p.cssProps[i] = bY(a.style, i)), h = p.cssHooks[c] || p.cssHooks[i], 
                h && "get" in h && (f = h.get(a, !0, e)), f === b && (f = bH(a, c)), f === "normal" && c in bU && (f = bU[c]), 
                d || e !== b ? (g = parseFloat(f), d || p.isNumeric(g) ? g || 0 : f) : f;
            },
            swap: function(a, b, c) {
                var d, e, f = {};
                for (e in b) f[e] = a.style[e], a.style[e] = b[e];
                d = c.call(a);
                for (e in b) a.style[e] = f[e];
                return d;
            }
        }), a.getComputedStyle ? bH = function(b, c) {
            var d, e, f, g, h = a.getComputedStyle(b, null), i = b.style;
            return h && (d = h[c], d === "" && !p.contains(b.ownerDocument, b) && (d = p.style(b, c)), 
            bQ.test(d) && bO.test(c) && (e = i.width, f = i.minWidth, g = i.maxWidth, i.minWidth = i.maxWidth = i.width = d, 
            d = h.width, i.width = e, i.minWidth = f, i.maxWidth = g)), d;
        } : e.documentElement.currentStyle && (bH = function(a, b) {
            var c, d, e = a.currentStyle && a.currentStyle[b], f = a.style;
            return e == null && f && f[b] && (e = f[b]), bQ.test(e) && !bM.test(b) && (c = f.left, 
            d = a.runtimeStyle && a.runtimeStyle.left, d && (a.runtimeStyle.left = a.currentStyle.left), 
            f.left = b === "fontSize" ? "1em" : e, e = f.pixelLeft + "px", f.left = c, d && (a.runtimeStyle.left = d)), 
            e === "" ? "auto" : e;
        }), p.each([ "height", "width" ], function(a, b) {
            p.cssHooks[b] = {
                get: function(a, c, d) {
                    if (c) return a.offsetWidth === 0 && bN.test(bH(a, "display")) ? p.swap(a, bT, function() {
                        return cb(a, b, d);
                    }) : cb(a, b, d);
                },
                set: function(a, c, d) {
                    return b_(a, c, d ? ca(a, b, d, p.support.boxSizing && p.css(a, "boxSizing") === "border-box") : 0);
                }
            };
        }), p.support.opacity || (p.cssHooks.opacity = {
            get: function(a, b) {
                return bL.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : b ? "1" : "";
            },
            set: function(a, b) {
                var c = a.style, d = a.currentStyle, e = p.isNumeric(b) ? "alpha(opacity=" + b * 100 + ")" : "", f = d && d.filter || c.filter || "";
                c.zoom = 1;
                if (b >= 1 && p.trim(f.replace(bK, "")) === "" && c.removeAttribute) {
                    c.removeAttribute("filter");
                    if (d && !d.filter) return;
                }
                c.filter = bK.test(f) ? f.replace(bK, e) : f + " " + e;
            }
        }), p(function() {
            p.support.reliableMarginRight || (p.cssHooks.marginRight = {
                get: function(a, b) {
                    return p.swap(a, {
                        display: "inline-block"
                    }, function() {
                        if (b) return bH(a, "marginRight");
                    });
                }
            }), !p.support.pixelPosition && p.fn.position && p.each([ "top", "left" ], function(a, b) {
                p.cssHooks[b] = {
                    get: function(a, c) {
                        if (c) {
                            var d = bH(a, b);
                            return bQ.test(d) ? p(a).position()[b] + "px" : d;
                        }
                    }
                };
            });
        }), p.expr && p.expr.filters && (p.expr.filters.hidden = function(a) {
            return a.offsetWidth === 0 && a.offsetHeight === 0 || !p.support.reliableHiddenOffsets && (a.style && a.style.display || bH(a, "display")) === "none";
        }, p.expr.filters.visible = function(a) {
            return !p.expr.filters.hidden(a);
        }), p.each({
            margin: "",
            padding: "",
            border: "Width"
        }, function(a, b) {
            p.cssHooks[a + b] = {
                expand: function(c) {
                    var d, e = typeof c == "string" ? c.split(" ") : [ c ], f = {};
                    for (d = 0; d < 4; d++) f[a + bV[d] + b] = e[d] || e[d - 2] || e[0];
                    return f;
                }
            }, bO.test(a) || (p.cssHooks[a + b].set = b_);
        });
        var cd = /%20/g, ce = /\[\]$/, cf = /\r?\n/g, cg = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, ch = /^(?:select|textarea)/i;
        p.fn.extend({
            serialize: function() {
                return p.param(this.serializeArray());
            },
            serializeArray: function() {
                return this.map(function() {
                    return this.elements ? p.makeArray(this.elements) : this;
                }).filter(function() {
                    return this.name && !this.disabled && (this.checked || ch.test(this.nodeName) || cg.test(this.type));
                }).map(function(a, b) {
                    var c = p(this).val();
                    return c == null ? null : p.isArray(c) ? p.map(c, function(a, c) {
                        return {
                            name: b.name,
                            value: a.replace(cf, "\r\n")
                        };
                    }) : {
                        name: b.name,
                        value: c.replace(cf, "\r\n")
                    };
                }).get();
            }
        }), p.param = function(a, c) {
            var d, e = [], f = function(a, b) {
                b = p.isFunction(b) ? b() : b == null ? "" : b, e[e.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b);
            };
            c === b && (c = p.ajaxSettings && p.ajaxSettings.traditional);
            if (p.isArray(a) || a.jquery && !p.isPlainObject(a)) p.each(a, function() {
                f(this.name, this.value);
            }); else for (d in a) ci(d, a[d], c, f);
            return e.join("&").replace(cd, "+");
        };
        var cj, ck, cl = /#.*$/, cm = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, cn = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/, co = /^(?:GET|HEAD)$/, cp = /^\/\//, cq = /\?/, cr = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, cs = /([?&])_=[^&]*/, ct = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/, cu = p.fn.load, cv = {}, cw = {}, cx = [ "*/" ] + [ "*" ];
        try {
            ck = f.href;
        } catch (cy) {
            ck = e.createElement("a"), ck.href = "", ck = ck.href;
        }
        cj = ct.exec(ck.toLowerCase()) || [], p.fn.load = function(a, c, d) {
            if (typeof a != "string" && cu) return cu.apply(this, arguments);
            if (!this.length) return this;
            var e, f, g, h = this, i = a.indexOf(" ");
            return i >= 0 && (e = a.slice(i, a.length), a = a.slice(0, i)), p.isFunction(c) ? (d = c, 
            c = b) : c && typeof c == "object" && (f = "POST"), p.ajax({
                url: a,
                type: f,
                dataType: "html",
                data: c,
                complete: function(a, b) {
                    d && h.each(d, g || [ a.responseText, b, a ]);
                }
            }).done(function(a) {
                g = arguments, h.html(e ? p("<div>").append(a.replace(cr, "")).find(e) : a);
            }), this;
        }, p.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(a, b) {
            p.fn[b] = function(a) {
                return this.on(b, a);
            };
        }), p.each([ "get", "post" ], function(a, c) {
            p[c] = function(a, d, e, f) {
                return p.isFunction(d) && (f = f || e, e = d, d = b), p.ajax({
                    type: c,
                    url: a,
                    data: d,
                    success: e,
                    dataType: f
                });
            };
        }), p.extend({
            getScript: function(a, c) {
                return p.get(a, b, c, "script");
            },
            getJSON: function(a, b, c) {
                return p.get(a, b, c, "json");
            },
            ajaxSetup: function(a, b) {
                return b ? cB(a, p.ajaxSettings) : (b = a, a = p.ajaxSettings), cB(a, b), a;
            },
            ajaxSettings: {
                url: ck,
                isLocal: cn.test(cj[1]),
                global: !0,
                type: "GET",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                processData: !0,
                async: !0,
                accepts: {
                    xml: "application/xml, text/xml",
                    html: "text/html",
                    text: "text/plain",
                    json: "application/json, text/javascript",
                    "*": cx
                },
                contents: {
                    xml: /xml/,
                    html: /html/,
                    json: /json/
                },
                responseFields: {
                    xml: "responseXML",
                    text: "responseText"
                },
                converters: {
                    "* text": a.String,
                    "text html": !0,
                    "text json": p.parseJSON,
                    "text xml": p.parseXML
                },
                flatOptions: {
                    context: !0,
                    url: !0
                }
            },
            ajaxPrefilter: cz(cv),
            ajaxTransport: cz(cw),
            ajax: function(a, c) {
                function y(a, c, f, i) {
                    var k, s, t, u, w, y = c;
                    if (v === 2) return;
                    v = 2, h && clearTimeout(h), g = b, e = i || "", x.readyState = a > 0 ? 4 : 0, f && (u = cC(l, x, f));
                    if (a >= 200 && a < 300 || a === 304) l.ifModified && (w = x.getResponseHeader("Last-Modified"), 
                    w && (p.lastModified[d] = w), w = x.getResponseHeader("Etag"), w && (p.etag[d] = w)), 
                    a === 304 ? (y = "notmodified", k = !0) : (k = cD(l, u), y = k.state, s = k.data, 
                    t = k.error, k = !t); else {
                        t = y;
                        if (!y || a) y = "error", a < 0 && (a = 0);
                    }
                    x.status = a, x.statusText = (c || y) + "", k ? o.resolveWith(m, [ s, y, x ]) : o.rejectWith(m, [ x, y, t ]), 
                    x.statusCode(r), r = b, j && n.trigger("ajax" + (k ? "Success" : "Error"), [ x, l, k ? s : t ]), 
                    q.fireWith(m, [ x, y ]), j && (n.trigger("ajaxComplete", [ x, l ]), --p.active || p.event.trigger("ajaxStop"));
                }
                typeof a == "object" && (c = a, a = b), c = c || {};
                var d, e, f, g, h, i, j, k, l = p.ajaxSetup({}, c), m = l.context || l, n = m !== l && (m.nodeType || m instanceof p) ? p(m) : p.event, o = p.Deferred(), q = p.Callbacks("once memory"), r = l.statusCode || {}, t = {}, u = {}, v = 0, w = "canceled", x = {
                    readyState: 0,
                    setRequestHeader: function(a, b) {
                        if (!v) {
                            var c = a.toLowerCase();
                            a = u[c] = u[c] || a, t[a] = b;
                        }
                        return this;
                    },
                    getAllResponseHeaders: function() {
                        return v === 2 ? e : null;
                    },
                    getResponseHeader: function(a) {
                        var c;
                        if (v === 2) {
                            if (!f) {
                                f = {};
                                while (c = cm.exec(e)) f[c[1].toLowerCase()] = c[2];
                            }
                            c = f[a.toLowerCase()];
                        }
                        return c === b ? null : c;
                    },
                    overrideMimeType: function(a) {
                        return v || (l.mimeType = a), this;
                    },
                    abort: function(a) {
                        return a = a || w, g && g.abort(a), y(0, a), this;
                    }
                };
                o.promise(x), x.success = x.done, x.error = x.fail, x.complete = q.add, x.statusCode = function(a) {
                    if (a) {
                        var b;
                        if (v < 2) for (b in a) r[b] = [ r[b], a[b] ]; else b = a[x.status], x.always(b);
                    }
                    return this;
                }, l.url = ((a || l.url) + "").replace(cl, "").replace(cp, cj[1] + "//"), l.dataTypes = p.trim(l.dataType || "*").toLowerCase().split(s), 
                l.crossDomain == null && (i = ct.exec(l.url.toLowerCase()) || !1, l.crossDomain = i && i.join(":") + (i[3] ? "" : i[1] === "http:" ? 80 : 443) !== cj.join(":") + (cj[3] ? "" : cj[1] === "http:" ? 80 : 443)), 
                l.data && l.processData && typeof l.data != "string" && (l.data = p.param(l.data, l.traditional)), 
                cA(cv, l, c, x);
                if (v === 2) return x;
                j = l.global, l.type = l.type.toUpperCase(), l.hasContent = !co.test(l.type), j && p.active++ === 0 && p.event.trigger("ajaxStart");
                if (!l.hasContent) {
                    l.data && (l.url += (cq.test(l.url) ? "&" : "?") + l.data, delete l.data), d = l.url;
                    if (l.cache === !1) {
                        var z = p.now(), A = l.url.replace(cs, "$1_=" + z);
                        l.url = A + (A === l.url ? (cq.test(l.url) ? "&" : "?") + "_=" + z : "");
                    }
                }
                (l.data && l.hasContent && l.contentType !== !1 || c.contentType) && x.setRequestHeader("Content-Type", l.contentType), 
                l.ifModified && (d = d || l.url, p.lastModified[d] && x.setRequestHeader("If-Modified-Since", p.lastModified[d]), 
                p.etag[d] && x.setRequestHeader("If-None-Match", p.etag[d])), x.setRequestHeader("Accept", l.dataTypes[0] && l.accepts[l.dataTypes[0]] ? l.accepts[l.dataTypes[0]] + (l.dataTypes[0] !== "*" ? ", " + cx + "; q=0.01" : "") : l.accepts["*"]);
                for (k in l.headers) x.setRequestHeader(k, l.headers[k]);
                if (!l.beforeSend || l.beforeSend.call(m, x, l) !== !1 && v !== 2) {
                    w = "abort";
                    for (k in {
                        success: 1,
                        error: 1,
                        complete: 1
                    }) x[k](l[k]);
                    g = cA(cw, l, c, x);
                    if (!g) y(-1, "No Transport"); else {
                        x.readyState = 1, j && n.trigger("ajaxSend", [ x, l ]), l.async && l.timeout > 0 && (h = setTimeout(function() {
                            x.abort("timeout");
                        }, l.timeout));
                        try {
                            v = 1, g.send(t, y);
                        } catch (B) {
                            if (v < 2) y(-1, B); else throw B;
                        }
                    }
                    return x;
                }
                return x.abort();
            },
            active: 0,
            lastModified: {},
            etag: {}
        });
        var cE = [], cF = /\?/, cG = /(=)\?(?=&|$)|\?\?/, cH = p.now();
        p.ajaxSetup({
            jsonp: "callback",
            jsonpCallback: function() {
                var a = cE.pop() || p.expando + "_" + cH++;
                return this[a] = !0, a;
            }
        }), p.ajaxPrefilter("json jsonp", function(c, d, e) {
            var f, g, h, i = c.data, j = c.url, k = c.jsonp !== !1, l = k && cG.test(j), m = k && !l && typeof i == "string" && !(c.contentType || "").indexOf("application/x-www-form-urlencoded") && cG.test(i);
            if (c.dataTypes[0] === "jsonp" || l || m) return f = c.jsonpCallback = p.isFunction(c.jsonpCallback) ? c.jsonpCallback() : c.jsonpCallback, 
            g = a[f], l ? c.url = j.replace(cG, "$1" + f) : m ? c.data = i.replace(cG, "$1" + f) : k && (c.url += (cF.test(j) ? "&" : "?") + c.jsonp + "=" + f), 
            c.converters["script json"] = function() {
                return h || p.error(f + " was not called"), h[0];
            }, c.dataTypes[0] = "json", a[f] = function() {
                h = arguments;
            }, e.always(function() {
                a[f] = g, c[f] && (c.jsonpCallback = d.jsonpCallback, cE.push(f)), h && p.isFunction(g) && g(h[0]), 
                h = g = b;
            }), "script";
        }), p.ajaxSetup({
            accepts: {
                script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            },
            contents: {
                script: /javascript|ecmascript/
            },
            converters: {
                "text script": function(a) {
                    return p.globalEval(a), a;
                }
            }
        }), p.ajaxPrefilter("script", function(a) {
            a.cache === b && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1);
        }), p.ajaxTransport("script", function(a) {
            if (a.crossDomain) {
                var c, d = e.head || e.getElementsByTagName("head")[0] || e.documentElement;
                return {
                    send: function(f, g) {
                        c = e.createElement("script"), c.async = "async", a.scriptCharset && (c.charset = a.scriptCharset), 
                        c.src = a.url, c.onload = c.onreadystatechange = function(a, e) {
                            if (e || !c.readyState || /loaded|complete/.test(c.readyState)) c.onload = c.onreadystatechange = null, 
                            d && c.parentNode && d.removeChild(c), c = b, e || g(200, "success");
                        }, d.insertBefore(c, d.firstChild);
                    },
                    abort: function() {
                        c && c.onload(0, 1);
                    }
                };
            }
        });
        var cI, cJ = a.ActiveXObject ? function() {
            for (var a in cI) cI[a](0, 1);
        } : !1, cK = 0;
        p.ajaxSettings.xhr = a.ActiveXObject ? function() {
            return !this.isLocal && cL() || cM();
        } : cL, function(a) {
            p.extend(p.support, {
                ajax: !!a,
                cors: !!a && "withCredentials" in a
            });
        }(p.ajaxSettings.xhr()), p.support.ajax && p.ajaxTransport(function(c) {
            if (!c.crossDomain || p.support.cors) {
                var d;
                return {
                    send: function(e, f) {
                        var g, h, i = c.xhr();
                        c.username ? i.open(c.type, c.url, c.async, c.username, c.password) : i.open(c.type, c.url, c.async);
                        if (c.xhrFields) for (h in c.xhrFields) i[h] = c.xhrFields[h];
                        c.mimeType && i.overrideMimeType && i.overrideMimeType(c.mimeType), !c.crossDomain && !e["X-Requested-With"] && (e["X-Requested-With"] = "XMLHttpRequest");
                        try {
                            for (h in e) i.setRequestHeader(h, e[h]);
                        } catch (j) {}
                        i.send(c.hasContent && c.data || null), d = function(a, e) {
                            var h, j, k, l, m;
                            try {
                                if (d && (e || i.readyState === 4)) {
                                    d = b, g && (i.onreadystatechange = p.noop, cJ && delete cI[g]);
                                    if (e) i.readyState !== 4 && i.abort(); else {
                                        h = i.status, k = i.getAllResponseHeaders(), l = {}, m = i.responseXML, m && m.documentElement && (l.xml = m);
                                        try {
                                            l.text = i.responseText;
                                        } catch (a) {}
                                        try {
                                            j = i.statusText;
                                        } catch (n) {
                                            j = "";
                                        }
                                        !h && c.isLocal && !c.crossDomain ? h = l.text ? 200 : 404 : h === 1223 && (h = 204);
                                    }
                                }
                            } catch (o) {
                                e || f(-1, o);
                            }
                            l && f(h, j, l, k);
                        }, c.async ? i.readyState === 4 ? setTimeout(d, 0) : (g = ++cK, cJ && (cI || (cI = {}, 
                        p(a).unload(cJ)), cI[g] = d), i.onreadystatechange = d) : d();
                    },
                    abort: function() {
                        d && d(0, 1);
                    }
                };
            }
        });
        var cN, cO, cP = /^(?:toggle|show|hide)$/, cQ = new RegExp("^(?:([-+])=|)(" + q + ")([a-z%]*)$", "i"), cR = /queueHooks$/, cS = [ cY ], cT = {
            "*": [ function(a, b) {
                var c, d, e = this.createTween(a, b), f = cQ.exec(b), g = e.cur(), h = +g || 0, i = 1, j = 20;
                if (f) {
                    c = +f[2], d = f[3] || (p.cssNumber[a] ? "" : "px");
                    if (d !== "px" && h) {
                        h = p.css(e.elem, a, !0) || c || 1;
                        do i = i || ".5", h = h / i, p.style(e.elem, a, h + d); while (i !== (i = e.cur() / g) && i !== 1 && --j);
                    }
                    e.unit = d, e.start = h, e.end = f[1] ? h + (f[1] + 1) * c : c;
                }
                return e;
            } ]
        };
        p.Animation = p.extend(cW, {
            tweener: function(a, b) {
                p.isFunction(a) ? (b = a, a = [ "*" ]) : a = a.split(" ");
                var c, d = 0, e = a.length;
                for (;d < e; d++) c = a[d], cT[c] = cT[c] || [], cT[c].unshift(b);
            },
            prefilter: function(a, b) {
                b ? cS.unshift(a) : cS.push(a);
            }
        }), p.Tween = cZ, cZ.prototype = {
            constructor: cZ,
            init: function(a, b, c, d, e, f) {
                this.elem = a, this.prop = c, this.easing = e || "swing", this.options = b, this.start = this.now = this.cur(), 
                this.end = d, this.unit = f || (p.cssNumber[c] ? "" : "px");
            },
            cur: function() {
                var a = cZ.propHooks[this.prop];
                return a && a.get ? a.get(this) : cZ.propHooks._default.get(this);
            },
            run: function(a) {
                var b, c = cZ.propHooks[this.prop];
                return this.options.duration ? this.pos = b = p.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : this.pos = b = a, 
                this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), 
                c && c.set ? c.set(this) : cZ.propHooks._default.set(this), this;
            }
        }, cZ.prototype.init.prototype = cZ.prototype, cZ.propHooks = {
            _default: {
                get: function(a) {
                    var b;
                    return a.elem[a.prop] == null || !!a.elem.style && a.elem.style[a.prop] != null ? (b = p.css(a.elem, a.prop, !1, ""), 
                    !b || b === "auto" ? 0 : b) : a.elem[a.prop];
                },
                set: function(a) {
                    p.fx.step[a.prop] ? p.fx.step[a.prop](a) : a.elem.style && (a.elem.style[p.cssProps[a.prop]] != null || p.cssHooks[a.prop]) ? p.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now;
                }
            }
        }, cZ.propHooks.scrollTop = cZ.propHooks.scrollLeft = {
            set: function(a) {
                a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now);
            }
        }, p.each([ "toggle", "show", "hide" ], function(a, b) {
            var c = p.fn[b];
            p.fn[b] = function(d, e, f) {
                return d == null || typeof d == "boolean" || !a && p.isFunction(d) && p.isFunction(e) ? c.apply(this, arguments) : this.animate(c$(b, !0), d, e, f);
            };
        }), p.fn.extend({
            fadeTo: function(a, b, c, d) {
                return this.filter(bZ).css("opacity", 0).show().end().animate({
                    opacity: b
                }, a, c, d);
            },
            animate: function(a, b, c, d) {
                var e = p.isEmptyObject(a), f = p.speed(b, c, d), g = function() {
                    var b = cW(this, p.extend({}, a), f);
                    e && b.stop(!0);
                };
                return e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g);
            },
            stop: function(a, c, d) {
                var e = function(a) {
                    var b = a.stop;
                    delete a.stop, b(d);
                };
                return typeof a != "string" && (d = c, c = a, a = b), c && a !== !1 && this.queue(a || "fx", []), 
                this.each(function() {
                    var b = !0, c = a != null && a + "queueHooks", f = p.timers, g = p._data(this);
                    if (c) g[c] && g[c].stop && e(g[c]); else for (c in g) g[c] && g[c].stop && cR.test(c) && e(g[c]);
                    for (c = f.length; c--; ) f[c].elem === this && (a == null || f[c].queue === a) && (f[c].anim.stop(d), 
                    b = !1, f.splice(c, 1));
                    (b || !d) && p.dequeue(this, a);
                });
            }
        }), p.each({
            slideDown: c$("show"),
            slideUp: c$("hide"),
            slideToggle: c$("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, function(a, b) {
            p.fn[a] = function(a, c, d) {
                return this.animate(b, a, c, d);
            };
        }), p.speed = function(a, b, c) {
            var d = a && typeof a == "object" ? p.extend({}, a) : {
                complete: c || !c && b || p.isFunction(a) && a,
                duration: a,
                easing: c && b || b && !p.isFunction(b) && b
            };
            d.duration = p.fx.off ? 0 : typeof d.duration == "number" ? d.duration : d.duration in p.fx.speeds ? p.fx.speeds[d.duration] : p.fx.speeds._default;
            if (d.queue == null || d.queue === !0) d.queue = "fx";
            return d.old = d.complete, d.complete = function() {
                p.isFunction(d.old) && d.old.call(this), d.queue && p.dequeue(this, d.queue);
            }, d;
        }, p.easing = {
            linear: function(a) {
                return a;
            },
            swing: function(a) {
                return .5 - Math.cos(a * Math.PI) / 2;
            }
        }, p.timers = [], p.fx = cZ.prototype.init, p.fx.tick = function() {
            var a, b = p.timers, c = 0;
            for (;c < b.length; c++) a = b[c], !a() && b[c] === a && b.splice(c--, 1);
            b.length || p.fx.stop();
        }, p.fx.timer = function(a) {
            a() && p.timers.push(a) && !cO && (cO = setInterval(p.fx.tick, p.fx.interval));
        }, p.fx.interval = 13, p.fx.stop = function() {
            clearInterval(cO), cO = null;
        }, p.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        }, p.fx.step = {}, p.expr && p.expr.filters && (p.expr.filters.animated = function(a) {
            return p.grep(p.timers, function(b) {
                return a === b.elem;
            }).length;
        });
        var c_ = /^(?:body|html)$/i;
        p.fn.offset = function(a) {
            if (arguments.length) return a === b ? this : this.each(function(b) {
                p.offset.setOffset(this, a, b);
            });
            var c, d, e, f, g, h, i, j = {
                top: 0,
                left: 0
            }, k = this[0], l = k && k.ownerDocument;
            if (!l) return;
            return (d = l.body) === k ? p.offset.bodyOffset(k) : (c = l.documentElement, p.contains(c, k) ? (typeof k.getBoundingClientRect != "undefined" && (j = k.getBoundingClientRect()), 
            e = da(l), f = c.clientTop || d.clientTop || 0, g = c.clientLeft || d.clientLeft || 0, 
            h = e.pageYOffset || c.scrollTop, i = e.pageXOffset || c.scrollLeft, {
                top: j.top + h - f,
                left: j.left + i - g
            }) : j);
        }, p.offset = {
            bodyOffset: function(a) {
                var b = a.offsetTop, c = a.offsetLeft;
                return p.support.doesNotIncludeMarginInBodyOffset && (b += parseFloat(p.css(a, "marginTop")) || 0, 
                c += parseFloat(p.css(a, "marginLeft")) || 0), {
                    top: b,
                    left: c
                };
            },
            setOffset: function(a, b, c) {
                var d = p.css(a, "position");
                d === "static" && (a.style.position = "relative");
                var e = p(a), f = e.offset(), g = p.css(a, "top"), h = p.css(a, "left"), i = (d === "absolute" || d === "fixed") && p.inArray("auto", [ g, h ]) > -1, j = {}, k = {}, l, m;
                i ? (k = e.position(), l = k.top, m = k.left) : (l = parseFloat(g) || 0, m = parseFloat(h) || 0), 
                p.isFunction(b) && (b = b.call(a, c, f)), b.top != null && (j.top = b.top - f.top + l), 
                b.left != null && (j.left = b.left - f.left + m), "using" in b ? b.using.call(a, j) : e.css(j);
            }
        }, p.fn.extend({
            position: function() {
                if (!this[0]) return;
                var a = this[0], b = this.offsetParent(), c = this.offset(), d = c_.test(b[0].nodeName) ? {
                    top: 0,
                    left: 0
                } : b.offset();
                return c.top -= parseFloat(p.css(a, "marginTop")) || 0, c.left -= parseFloat(p.css(a, "marginLeft")) || 0, 
                d.top += parseFloat(p.css(b[0], "borderTopWidth")) || 0, d.left += parseFloat(p.css(b[0], "borderLeftWidth")) || 0, 
                {
                    top: c.top - d.top,
                    left: c.left - d.left
                };
            },
            offsetParent: function() {
                return this.map(function() {
                    var a = this.offsetParent || e.body;
                    while (a && !c_.test(a.nodeName) && p.css(a, "position") === "static") a = a.offsetParent;
                    return a || e.body;
                });
            }
        }), p.each({
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset"
        }, function(a, c) {
            var d = /Y/.test(c);
            p.fn[a] = function(e) {
                return p.access(this, function(a, e, f) {
                    var g = da(a);
                    if (f === b) return g ? c in g ? g[c] : g.document.documentElement[e] : a[e];
                    g ? g.scrollTo(d ? p(g).scrollLeft() : f, d ? f : p(g).scrollTop()) : a[e] = f;
                }, a, e, arguments.length, null);
            };
        }), p.each({
            Height: "height",
            Width: "width"
        }, function(a, c) {
            p.each({
                padding: "inner" + a,
                content: c,
                "": "outer" + a
            }, function(d, e) {
                p.fn[e] = function(e, f) {
                    var g = arguments.length && (d || typeof e != "boolean"), h = d || (e === !0 || f === !0 ? "margin" : "border");
                    return p.access(this, function(c, d, e) {
                        var f;
                        return p.isWindow(c) ? c.document.documentElement["client" + a] : c.nodeType === 9 ? (f = c.documentElement, 
                        Math.max(c.body["scroll" + a], f["scroll" + a], c.body["offset" + a], f["offset" + a], f["client" + a])) : e === b ? p.css(c, d, e, h) : p.style(c, d, e, h);
                    }, c, g ? e : b, g, null);
                };
            });
        }), a.jQuery = a.$ = p, /**
 * $$用来取指定page下中指定元素 $$("#index",".eClassName") 或者 $$("#index","#eID")，
 * 主要用于后者，为了在不同page下能有相同的元素ID
 * 因为绝大部分情况用的是$$("#pageId","#eleId")，故抽象分出2种，简写去掉入参的#：
 * $x = function(parentId, childId) {return $("#"+parentId+" #"+childId);};window.$x = $x;
 * $y = function(parentId, childCls) {return $("#"+parentId+" ."+childCls);};window.$y = $y;
 */
        a.$x = function(pageId, eleId) {
            return p("#" + pageId + " #" + eleId);
        }, a.$y = function(pageId, eleCls) {
            return p("#" + pageId + " ." + eleCls);
        }, typeof define == "function" && define.amd && define("jquery", [], function() {
            return p;
        });
    })(window);
    //module.exports = $.noConflict(true); //把jquery包成模块
    module.exports = $ = jQuery = window.jQuery = window.$;
});

/**
 * 扩展jquery，无需export
 */
define("/framework/base/jquery/jquery_scrollto_1bb69295", [ "/framework/base/jquery/jquery_fda6b489" ], function(require, exports, module) {
    var $ = jQuery = require("/framework/base/jquery/jquery_fda6b489");
    jQuery.getPos = function(e) {
        var l = 0;
        var t = 0;
        var w = jQuery.intval(jQuery.css(e, "width"));
        var h = jQuery.intval(jQuery.css(e, "height"));
        var wb = e.offsetWidth;
        var hb = e.offsetHeight;
        while (e.offsetParent) {
            l += e.offsetLeft + (e.currentStyle ? jQuery.intval(e.currentStyle.borderLeftWidth) : 0);
            t += e.offsetTop + (e.currentStyle ? jQuery.intval(e.currentStyle.borderTopWidth) : 0);
            e = e.offsetParent;
        }
        l += e.offsetLeft + (e.currentStyle ? jQuery.intval(e.currentStyle.borderLeftWidth) : 0);
        t += e.offsetTop + (e.currentStyle ? jQuery.intval(e.currentStyle.borderTopWidth) : 0);
        return {
            x: l,
            y: t,
            w: w,
            h: h,
            wb: wb,
            hb: hb
        };
    };
    jQuery.getClient = function(e) {
        if (e) {
            w = e.clientWidth;
            h = e.clientHeight;
        } else {
            w = window.innerWidth ? window.innerWidth : document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.offsetWidth;
            h = window.innerHeight ? window.innerHeight : document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.offsetHeight;
        }
        return {
            w: w,
            h: h
        };
    };
    jQuery.getScroll = function(e) {
        if (e) {
            t = e.scrollTop;
            l = e.scrollLeft;
            w = e.scrollWidth;
            h = e.scrollHeight;
        } else {
            if (document.documentElement && document.documentElement.scrollTop) {
                t = document.documentElement.scrollTop;
                l = document.documentElement.scrollLeft;
                w = document.documentElement.scrollWidth;
                h = document.documentElement.scrollHeight;
            } else if (document.body) {
                t = document.body.scrollTop;
                l = document.body.scrollLeft;
                w = document.body.scrollWidth;
                h = document.body.scrollHeight;
            }
        }
        return {
            t: t,
            l: l,
            w: w,
            h: h
        };
    };
    jQuery.intval = function(v) {
        v = parseInt(v);
        return isNaN(v) ? 0 : v;
    };
    jQuery.fn.ScrollTo = function(s, spacingx, spacingy) {
        o = jQuery.speed(s);
        return this.each(function() {
            new jQuery.fx.ScrollTo(this, o, spacingx, spacingy);
        });
    };
    jQuery.fx.ScrollTo = function(e, o, sx, sy) {
        var z = this;
        z.o = o;
        z.e = e;
        z.p = jQuery.getPos(e);
        z.s = jQuery.getScroll();
        z.clear = function() {
            clearInterval(z.timer);
            z.timer = null;
        };
        z.t = new Date().getTime();
        z.step = function() {
            var t = new Date().getTime();
            var p = (t - z.t) / z.o.duration;
            if (t >= z.o.duration + z.t) {
                z.clear();
                setTimeout(function() {
                    z.scroll(z.p.y, z.p.x);
                }, 13);
            } else {
                st = (-Math.cos(p * Math.PI) / 2 + .5) * (z.p.y - z.s.t) + z.s.t;
                sl = (-Math.cos(p * Math.PI) / 2 + .5) * (z.p.x - z.s.l) + z.s.l;
                z.scroll(st, sl);
            }
        };
        z.scroll = function(t, l) {
            sx = sx ? sx : 0;
            sy = sy ? sy : 0;
            window.scrollTo(l - sx, t - sy);
        };
        z.timer = setInterval(function() {
            z.step();
        }, 13);
    };
});

/**
 * ajax异步请求数据入口
 */
define("/framework/base/lang/ajax_194df9ce", [ "layerUtils", "/framework/base/lang/gconfig_37984852" ], function(require, exports, module) {
    // 加载依赖模块  
    var layerUtils = require("{pluginBaseUrl}framework/plugins/layer/scripts/layerUtils_51307981");
    var gconfig = require("/framework/base/lang/gconfig_37984852");
    var aes = require("{pluginBaseUrl}framework/plugins/endecrypt/scripts/aes_c0df41f4");
    var external = null;
    /**
	 * 存放所有的ajax请求对象数组，暂时用数组
	 */
    var requestArr = [];
    /**
	 * 清理正在请求的ajax，提供给切换页面时调用
	 */
    function clearRequest() {
        for (var i = 0, len = requestArr.length; i < len; i++) {
            var iAjax = requestArr[i];
            if (iAjax) {
                iAjax.abort();
                //中断正在请求的ajax，会执行该请求的error和complete方法
                iAjax = null;
                requestArr[i] = null;
            }
        }
        requestArr = [];
    }
    /**
	 * 生成clientkey
	 * 新规则：增加clientkey维持会话，uuid|当前时间毫秒数|10位随机数
	 */
    function generateClientKey() {
        var uuid = sessionStorage.getItem(gconfig.projName + "|uuid");
        //uuid
        uuid = uuid || "";
        //解密处理，因为保存的时候是用的appUtils的setSStorageInfo方法，但是这里不能引用appUtils(循环依赖)，所以下面解密的代码对应getSStorageInfo
        if (gconfig.platform != "0") {
            if (aes) {
                var keyHex = aes.enc.Utf8.parse("iloveyou");
                var iv = aes.enc.Utf8.parse("iloveyou");
                var valueHex = aes.enc.Base64.parse(uuid);
                var decrypted = aes.AES.decrypt({
                    ciphertext: valueHex
                }, keyHex, {
                    iv: iv,
                    mode: aes.mode.CBC
                });
                uuid = decrypted.toString(aes.enc.Utf8);
            }
        }
        var timestamp = new Date().getTime();
        //当前时间毫秒数
        var randomNum = (Math.random() + 1).toString().substring(2, 12);
        //10位随机数
        var clientkey = uuid + "|" + timestamp + "|" + randomNum;
        //加密处理
        var aesKey = gconfig.global.aesKey;
        aesKey = aesKey ? aesKey : "B49A86FA425D439d";
        //对clientKey加密种子是与后台一致的
        if (aes) {
            var keyHex = aes.enc.Utf8.parse(aesKey);
            var valueHex = aes.enc.Utf8.parse(clientkey);
            var iv = aes.enc.Utf8.parse(aesKey);
            var encrypted = aes.AES.encrypt(valueHex, keyHex, {
                iv: iv,
                mode: aes.mode.CBC
            });
            clientkey = encrypted.toString();
        }
        //UTF-8编码
        return encodeURIComponent(clientkey);
    }
    /**
	 * ajax请求数据
	 * @param url：请求的url
	 * @param param：传递的参数,这里进行utf-8编码，后端服务器需要进行相应解码，处理中文乱码问题
	 * @param callback 回调处理函数
	 * @param isLastReq 是否是最后一个请求，默认是true，如果是true表示后面再没有ajax请求了，等待层将清除掉，
	 * 		false表示又有ajax加载数据，保留等待层的状态，与isShowWait配合实现多个请求的等待状态显示
	 * @param isAsync 是否异步请求，默认是true
	 * @param isShowWait：是否显示等待层 默认是true
	 * @param isShowOverLay 是否显示遮罩层，默认为true
	 * @param tipsWords 显示等待层时，显示的文字，不传默认显示"请等待..."
	 * @param timeOutFunc 超时后的处理函数，默认可不传，只提示超时
	 * @param dataType 出参格式，默认可不传，为json格式
	 * @param isGlobal 是否属于全局请求，true表示切换页面时，该请求不会被清除，默认是false
	 */
    function request(url, param, callback, isLastReq, isAsync, isShowWait, isShowOverLay, tipsWords, timeOutFunc, dataType, isGlobal) {
        // 设置默认值
        isLastReq = _setBoolDefault(isLastReq, true);
        isAsync = _setBoolDefault(isAsync, true);
        isShowWait = _setBoolDefault(isShowWait, true);
        isShowOverLay = _setBoolDefault(isShowOverLay, true);
        isGlobal = _setBoolDefault(isGlobal, false);
        tipsWords = tipsWords || "请等待...";
        dataType = dataType || "json";
        // 生成clientkey，用于维持会话
        param.clientKey = generateClientKey();
        // UTF-8编码
        for (var key in param) {
            var value = param[key] + "";
            if (value === null || value === undefined || value === "" || value.trim().toLowerCase() === "null" || value.trim().toLowerCase() === "undefined") {
                param[key] = "";
            } else {
                value = encodeURIComponent(value);
                param[key] = value;
            }
        }
        // firefox 禁止同步请求使用 withCredentials 功能
        var xhrFields = {
            withCredentials: true
        };
        if (isAsync === false) {
            xhrFields = {};
        }
        var iAjax = $.ajax({
            url: url,
            data: param,
            type: "post",
            dataType: dataType,
            async: isAsync,
            xhrFields: xhrFields,
            timeout: gconfig.ajaxTimeout * 1e3,
            beforeSend: function(XMLHttpRequest) {
                if (isShowWait) {
                    layerUtils.iLoading(true, tipsWords, isShowOverLay);
                }
            },
            success: function(data, textStatus) {
                if (data) {
                    if (callback) {
                        callback(data);
                    }
                } else {
                    layerUtils.iMsg(-1, "后台返回数据格式不正确,请联系管理员！数据内容是:" + data);
                }
            },
            complete: function(XMLHttpRequest, textStatus) {
                if (isShowWait && isLastReq) {
                    layerUtils.iLoading(false);
                }
            },
            error: function(XMLHttpRequest, textStatus, errorMessage) {
                // abort会执行error方法
                layerUtils.iLoading(false);
                if (textStatus == "timeout") {
                    iAjax.abort();
                    // 增加超时特殊处理功能
                    if (timeOutFunc) {
                        timeOutFunc();
                    } else {
                        layerUtils.iMsg(-1, "请求超时,请检查接口是否异常或者网络不通！");
                    }
                } else if (textStatus != "abort") {
                    var getNetInfoCallback = function(result) {
                        if (result && +result.network === 0) // 断网
                        {
                            layerUtils.iMsg(-1, "网络未连接");
                        } else {
                            layerUtils.iMsg(-1, "服务器异常,错误码:" + XMLHttpRequest.status + ",错误信息:" + XMLHttpRequest.statusText);
                        }
                    };
                    getNetInfo(getNetInfoCallback);
                }
            }
        });
        // 放入数组中，记录方便切换页面时干掉前页面ajax请求
        if (!isGlobal) {
            requestArr.push(iAjax);
        }
    }
    /**
	 * 获取网络信息
	 * @param getFinishFunc 获取结束的回调函数
	 */
    function getNetInfo(getFinishFunc) {
        var result = null;
        var doQuery = function() {
            var param = {
                funcNo: "50030"
            };
            if (+gconfig.platform !== 0) {
                var data = external.callMessage(param);
                if (data) {
                    if (data.error_no >= 0 && data.results && data.results[0]) {
                        result = data.results[0];
                    }
                }
            }
            if (getFinishFunc) {
                getFinishFunc(result);
            }
        };
        if (external) {
            doQuery();
        } else {
            require.async("external", function(module) {
                external = module;
                doQuery();
            });
        }
    }
    /**
	 * 设置 boolean 变量的默认值
	 * @param originalVal 原始值 
	 * @param defaultVal 默认值
	 */
    function _setBoolDefault(originalVal, defaultVal) {
        return typeof originalVal == "undefined" || originalVal === "" ? defaultVal : originalVal;
    }
    /**
	 * ajax加载纯静态html页面
	 * @param url：请求页面的url
	 * @param callback 回调处理函数
	 * @param isLastReq 是否是最后一个请求，默认是true
	 * 如果是true表示后面再没有ajax请求了，等待层将清除掉，false表示又有ajax加载数据，保留等待层的状态，
	 * 与isShowWait配合实现多个请求的等待状态显示
	 * @param isAsync 是否异步请求，默认是true
	 * @param isShowWait：是否显示等待层 默认是true
	 * @param isShowOverLay 是否显示遮罩层，默认为true
	 */
    function loadHtml(url, callback, isLastReq, isAsync, isShowWait, isShowOverLay) {
        // 设置默认值
        isLastReq = _setBoolDefault(isLastReq, true);
        isAsync = _setBoolDefault(isAsync, true);
        isShowWait = _setBoolDefault(isShowWait, true);
        isShowOverLay = _setBoolDefault(isShowOverLay, true);
        // firefox 禁止同步请求使用 withCredentials 功能
        var xhrFields = {
            withCredentials: true
        };
        if (isAsync === false) {
            xhrFields = {};
        }
        $.ajax({
            url: url + "?v=" + seajs._sysVersion,
            type: "get",
            // get方式便于缓存页面
            dataType: "html",
            async: isAsync,
            xhrFields: xhrFields,
            beforeSend: function(XMLHttpRequest) {
                if (isShowWait) {
                    layerUtils.iLoading(true, "请等待...", isShowOverLay);
                }
            },
            success: function(data, textStatus) {
                // 判断是否成功
                if (data) {
                    if (callback) {
                        callback(data);
                    }
                } else {
                    layerUtils.iAlert("请求html页面异常或者页面不存在！>>" + url, -1);
                }
            },
            complete: function(XMLHttpRequest, textStatus) {
                if (isLastReq) {
                    layerUtils.iLoading(false);
                }
            },
            // abort会执行error方法
            error: function() {
                layerUtils.iLoading(false);
                layerUtils.iAlert("请求html页面异常！>>" + url, -1);
            }
        });
    }
    var ajax = {
        request: request,
        loadHtml: loadHtml,
        clearRequest: clearRequest
    };
    // 暴露对外的接口
    module.exports = ajax;
});

/**
 * 项目相关工具方法
 */
define("/framework/base/lang/appUtils_f8b8d996", [ "/framework/base/lang/gconfig_37984852", "/framework/base/lang/ajax_194df9ce", "layerUtils" ], function(require, exports, module) {
    var gconfig = require("/framework/base/lang/gconfig_37984852");
    var ajax = require("/framework/base/lang/ajax_194df9ce");
    var layerUtils = require("{pluginBaseUrl}framework/plugins/layer/scripts/layerUtils_51307981");
    var loadCssTimer = null;
    // 加载 css 文件时启动的定时器
    /**
	 * 函数绑定
	 * @param {} fn
	 * @param {} scope
	 * @param {} args
	 * @param {} appendArgs
	 * @return {}
	 */
    function bindFunc(fn, scope, args, appendArgs) {
        if (arguments.length === 2) {
            return function() {
                return fn.apply(scope, arguments);
            };
        }
        var method = fn, slice = Array.prototype.slice, splice = Array.prototype.splice;
        return function() {
            var callArgs = args || arguments;
            if (appendArgs === true) {
                callArgs = slice.call(arguments, 0);
                callArgs = callArgs.concat(args);
            } else if (typeof appendArgs == "number") {
                callArgs = slice.call(arguments, 0);
                var applyArgs = [ appendArgs, 0 ].concat(args);
                splice.apply(callArgs, applyArgs);
            }
            return method.apply(scope || window, callArgs);
        };
    }
    /**
	 * 动态加载js
	 * @param id js文件id
	 * @param fileUrl js文件路径
	 */
    function loadJS(id, fileUrl) {
        var scriptTag = document.getElementById(id), oHead = document.getElementsByTagName("head").item(0), oScript = document.createElement("script");
        if (scriptTag) oHead.removeChild(scriptTag);
        oScript.id = id;
        oScript.type = "text/javascript";
        oScript.src = fileUrl;
        oHead.appendChild(oScript);
    }
    /**
	 * page的跳转
	 * @param toPageId 要显示的page
	 */
    function switchPage(toPageId) {
        //滚动条回到顶部
        $(document.body).ScrollTo(0);
        $("#" + toPageId).siblings(".page").attr("data-display", "none");
        $("#" + toPageId).attr("data-display", "block");
        //去掉上一个页面的提示层
        layerUtils.iLayerClose();
        //页面跳转，这里增加了页面平滑过渡效果
        if (gconfig.isSmoothTran) {
            $("#" + toPageId).siblings(".page").animate({
                width: "hide",
                marginLeft: "hide",
                paddingLeft: "hide"
            }, 0, "swing", function() {
                $("#" + toPageId).animate({
                    width: "show",
                    marginRight: "show",
                    paddingRight: "show"
                }, 200, "swing");
            });
        } else {
            $("#" + toPageId).siblings(".page").hide();
            $("#" + toPageId).show();
        }
        //微平台返回兼容处理
        appUtils.preHashUrl = location.href;
    }
    /**
	 * 重置对应page页下所有的输入值，如果不需要重置的字段，在调用这个方法之前，
	 * 给输入域设置data-origin自定义属性为它的value值，调用该方法后输入域的值会变成data-origin指定的值
	 * @param pageId 业务模块页面page的id值
	 */
    function pageResetValue(pageId) {
        $("body>#afui>#content>#" + pageId + " input").each(function() {
            var type = $(this).attr("type"), isDisable = $(this).attr("disabled");
            //忽略disabled
            if ((type == "text" || type == "password" || type == "number") && !isDisable) //hidden暂不考虑清除
            {
                var dataOrigin = $(this).attr("data-origin");
                //默认设置的输入域值，如果没有初始值，默认为""
                dataOrigin ? $(this).val(dataOrigin) : $(this).val("");
            }
        });
        $("body>#afui>#content>#" + pageId + " select").each(function() {
            var dataOrigin = $(this).attr("data-origin") ? $(this).attr("data-origin") : 0;
            //默认选中的下拉框索引，如不设置select的初始值，则默认为0
            $(this).children("option").eq(dataOrigin).attr("selected", "true");
        });
    }
    //	/**
    //	 * 滚动到指定元素位置
    //	 * @parm jQEle 元素
    //	 * @param time 滚动到该元素的时间，单位毫秒
    //	 * @param xDev 相对ele元素x轴偏移，负值表示偏右，正值表示偏左，可不传，默认为0
    //	 * @param yDev相对ele元素y轴偏移，负值表示偏下，正值表示偏上，可不传，默认为0
    //	 */
    //	function scrollToEle(jQEle,time,xDev,yDev)
    //	{
    //		$(jQEle).ScrollTo(time,xDev,yDev);
    //	}
    /**
	 * 页面的事件绑定处理
	 * @parm ele 页面元素
	 * @param eMethod 处理函数
	 * @param etype 事件类型
	 */
    function bindEvent(ele, eMethod, eType) {
        eType = eType ? eType : gconfig.triggerEventName;
        //不传事件类型默认为click/mousedown事件
        $(ele).off(eType);
        $(ele).each(function() {
            var timeInv = 0;
            var _eMethod = bindFunc(eMethod, this);
            var eventFunc = function(e) {
                if (eType.toLowerCase() == "click" || eType.toLowerCase() == "mousedown") {
                    var time = new Date().getTime();
                    if (time - timeInv > 500) {
                        _eMethod(e);
                        timeInv = time;
                    }
                } else {
                    _eMethod(e);
                }
            };
            $(this).on(eType, eventFunc);
        });
    }
    /**
	 * 页面元素预绑定事件，预绑定需要知道父容器
	 * @parm parentEle 页面负载元素
	 * @parm eleSelc 预绑定元素选择器
	 * @param eMethod 处理函数
	 * @param etype 事件类型
	 */
    function preBindEvent(parentEle, eleSelc, eMethod, eType) {
        eType = eType ? eType : gconfig.triggerEventName;
        //不传事件类型默认为click/mousedown事件
        $(parentEle).off(eType, eleSelc);
        $(parentEle).each(function() {
            var timeInv = 0;
            var eventFunc = function(e) {
                var _eMethod = bindFunc(eMethod, this);
                if (eType.toLowerCase() == "click" || eType.toLowerCase() == "mousedown") {
                    var time = new Date().getTime();
                    if (time - timeInv > 500) {
                        _eMethod(e);
                        timeInv = time;
                    }
                } else {
                    _eMethod(e);
                }
            };
            $(this).on(eType, eleSelc, eventFunc);
        });
    }
    /**
	 * 保存sessionStorage信息，session级别缓存
	 * 在key前增加模块名的前缀标识，每个模块存的key值是属于当前模块的，而开发人员不需要关注前缀（缓存的数据会自动增加前缀标识）
	 * 另外在非pc浏览器上保存、取值统一通过aes加密为密文
	 * @parm key 设置的key
	 * @parm value 设置的值
	 * @parm isModulesShare true/false 是否多模块共享，true表示可以被其他模块使用，则保存没有模块前缀标识，不传默认为false，
	 * 		注意：这里共享只能是同域下同一个浏览器，如果是嵌入原生多webview中，相当于开启多个浏览器，不能实现模块共享，共享数据存取需要调用原生的对接方法！！
	 */
    function setSStorageInfo(key, value, isModulesShare) {
        //加密处理
        if (gconfig.platform != "0") {
            value = value != null ? value : "";
            var aes = require("{pluginBaseUrl}framework/plugins/endecrypt/scripts/aes_c0df41f4");
            if (aes) {
                try {
                    var keyHex = aes.enc.Utf8.parse("iloveyou");
                    var valueHex = aes.enc.Utf8.parse(value);
                    var iv = aes.enc.Utf8.parse("iloveyou");
                    var encrypted = aes.AES.encrypt(valueHex, keyHex, {
                        iv: iv,
                        mode: aes.mode.CBC
                    });
                    value = encrypted.toString();
                } catch (e) {
                    layerUtils.iAlert("setSStorageInfo：保存数据时，加密失败！");
                }
            }
        }
        //增加模块前缀标识
        if (isModulesShare == true) {
            key = "_share|" + key;
        } else {
            key = gconfig.projName + "|" + key;
        }
        try {
            sessionStorage.setItem(key, value);
        } catch (e) {
            layerUtils.iAlert("您的浏览器版本太低，或者您开启了隐身/无痕浏览模式，或者WebView组件不支持sessionStorage！");
        }
    }
    /**
	 * 获取sessionStorage信息，session级别缓存
	 * 在key前增加模块名的前缀标识，每个模块存的key值是属于当前模块的，避免冲突，而开发人员不需要关注前缀（缓存的数据会自动增加前缀标识）
	 * 另外在非pc浏览器上保存、取值统一通过aes加密为密文
	 * @parm key 设置的key
	 * @parm isModulesShare true/false 是否多模块共享，true表示可以被其他模块使用，则保存没有模块前缀标识，不传默认为false
	 * 		注意：这里共享只能是同域下同一个浏览器，如果是嵌入原生多webview中，相当于开启多个浏览器，不能实现模块共享，共享数据存取需要调用原生的对接方法！！
	 */
    function getSStorageInfo(key, isModulesShare) {
        //增加模块前缀标识
        if (isModulesShare == true) {
            key = "_share|" + key;
        } else {
            key = gconfig.projName + "|" + key;
        }
        var value = null;
        try {
            value = sessionStorage.getItem(key);
        } catch (e) {
            layerUtils.iAlert("您的浏览器版本太低，或者您开启了隐身/无痕浏览模式，或者WebView组件不支持sessionStorage！");
        }
        //解密处理
        if (gconfig.platform != "0") {
            value = value != null ? value : "";
            var aes = require("{pluginBaseUrl}framework/plugins/endecrypt/scripts/aes_c0df41f4");
            if (aes) {
                try {
                    var keyHex = aes.enc.Utf8.parse("iloveyou");
                    var iv = aes.enc.Utf8.parse("iloveyou");
                    var valueHex = aes.enc.Base64.parse(value);
                    var decrypted = aes.AES.decrypt({
                        ciphertext: valueHex
                    }, keyHex, {
                        iv: iv,
                        mode: aes.mode.CBC
                    });
                    value = decrypted.toString(aes.enc.Utf8);
                } catch (e) {
                    layerUtils.iAlert("getSStorageInfo：取数据时，解密失败！");
                }
            }
        }
        return value ? value : null;
    }
    /**
	 * 获取模块所有的sessionStorage数据（json对象）
	 * 1、projName为空，表示取当前模块的sessionStorage数据
	 * 2、projName不为空，表示取模块名对应的sessionStorage数据
	 * 3、projName为"_share"，表示取所有模块共享的sessionStorage数据
	 * @param projName 模块前缀标识
	 */
    function getProjSStorage(projName) {
        projName = projName ? projName : gconfig.projName;
        var projSSJonObj = {};
        for (var item in sessionStorage) {
            if (item.indexOf(projName + "|") > -1) {
                var value = null;
                try {
                    value = sessionStorage.getItem(item);
                } catch (e) {
                    layerUtils.iAlert("您的浏览器版本太低，或者您开启了隐身/无痕浏览模式，或者WebView组件不支持sessionStorage！");
                }
                //解密处理
                if (gconfig.platform != "0") {
                    value = value != null ? value : "";
                    var aes = require("{pluginBaseUrl}framework/plugins/endecrypt/scripts/aes_c0df41f4");
                    if (aes) {
                        try {
                            var keyHex = aes.enc.Utf8.parse("iloveyou");
                            var iv = aes.enc.Utf8.parse("iloveyou");
                            var valueHex = aes.enc.Base64.parse(value);
                            var decrypted = aes.AES.decrypt({
                                ciphertext: valueHex
                            }, keyHex, {
                                iv: iv,
                                mode: aes.mode.CBC
                            });
                            value = decrypted.toString(aes.enc.Utf8);
                        } catch (e) {
                            layerUtils.iAlert("getProjSStorage：取数据时，解密失败！");
                        }
                    }
                }
                projSSJonObj[item.replace(projName + "|", "")] = value;
            }
        }
        return projSSJonObj;
    }
    /**
	 * 清除sessionStorage中的数据，这里分3种情况：
	 * 1、如果不传key，则清除当前模块的sessionStorage数据
	 * 2、如果key为字符串变量，则清除当前模块的sessionStorage数据
	 * 3、如果key为Boolean类型变量true，则清除同一站点下所有模块的sessionStorage数据（支持多模块）
	 * @parm key 设置的key
	 */
    function clearSStorage(key) {
        try {
            if (key === true) {
                sessionStorage.clear();
            } else {
                if (key) {
                    sessionStorage.removeItem(gconfig.projName + "|" + key);
                } else {
                    for (var pkey in sessionStorage) {
                        if (pkey.indexOf(gconfig.projName + "|") > -1) {
                            sessionStorage.removeItem(pkey);
                        }
                    }
                }
            }
        } catch (e) {
            layerUtils.iAlert("您的浏览器版本太低，或者您开启了隐身/无痕浏览模式，或者WebView组件不支持sessionStorage！");
        }
    }
    /**
	 * 保存localStorage信息，离线浏览器缓存还存在
	 * 在key前增加模块名的前缀标识，每个模块存的key值是属于当前模块的，避免冲突，而开发人员不需要关注前缀（缓存的数据会自动增加前缀标识）
	 * 另外在非pc浏览器上保存、取值统一通过aes加密为密文
	 * @parm key 设置的key
	 * @parm value 设置的值
	 * @parm isModulesShare true/false 是否多模块共享，true表示可以被其他模块使用，则保存没有模块前缀标识，不传默认为false
	 */
    function setLStorageInfo(key, value, isModulesShare) {
        //加密处理
        if (gconfig.platform != "0") {
            value = value != null ? value : "";
            var aes = require("{pluginBaseUrl}framework/plugins/endecrypt/scripts/aes_c0df41f4");
            if (aes) {
                try {
                    var keyHex = aes.enc.Utf8.parse("iloveyou");
                    var valueHex = aes.enc.Utf8.parse(value);
                    var iv = aes.enc.Utf8.parse("iloveyou");
                    var encrypted = aes.AES.encrypt(valueHex, keyHex, {
                        iv: iv,
                        mode: aes.mode.CBC
                    });
                    value = encrypted.toString();
                } catch (e) {
                    layerUtils.iAlert("setLStorageInfo： 保存数据时，加密失败！");
                }
            }
        }
        //增加模块前缀标识
        if (isModulesShare == true) {
            key = "_share|" + key;
        } else {
            key = gconfig.projName + "|" + key;
        }
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            layerUtils.iAlert("您的浏览器版本太低，或者您开启了隐身/无痕浏览模式，或者WebView组件不支持localStorage！");
        }
    }
    /**
	 * 获取localStorage信息
	 * 在key前增加模块名的前缀标识，每个模块存的key值是属于当前模块的，避免冲突，而开发人员不需要关注前缀（缓存的数据会自动增加前缀标识）
	 * 另外在非pc浏览器上保存、取值统一通过aes加密为密文
	 * @parm key 设置的key
	 * @parm isModulesShare true/false 是否多模块共享，true表示可以被其他模块使用，则保存没有模块前缀标识，不传默认为false
	 */
    function getLStorageInfo(key, isModulesShare) {
        //增加模块前缀标识
        if (isModulesShare == true) {
            key = "_share|" + key;
        } else {
            key = gconfig.projName + "|" + key;
        }
        var value = null;
        try {
            value = localStorage.getItem(key);
        } catch (e) {
            layerUtils.iAlert("您的浏览器版本太低，或者您开启了隐身/无痕浏览模式，或者WebView组件不支持localStorage！");
        }
        //解密处理
        if (gconfig.platform != "0") {
            value = value != null ? value : "";
            var aes = require("{pluginBaseUrl}framework/plugins/endecrypt/scripts/aes_c0df41f4");
            if (aes) {
                try {
                    var keyHex = aes.enc.Utf8.parse("iloveyou");
                    var iv = aes.enc.Utf8.parse("iloveyou");
                    var valueHex = aes.enc.Base64.parse(value);
                    var decrypted = aes.AES.decrypt({
                        ciphertext: valueHex
                    }, keyHex, {
                        iv: iv,
                        mode: aes.mode.CBC
                    });
                    value = decrypted.toString(aes.enc.Utf8);
                } catch (e) {
                    layerUtils.iAlert("getLStorageInfo： 取数据时，解密失败！");
                }
            }
        }
        return value ? value : null;
    }
    /**
	 * 获取模块所有的localStorage数据（json对象）
	 * 1、projName为空，表示取当前模块的localStorage数据
	 * 2、projName不为空，表示取模块名对应的localStorage数据
	 * 3、projName为"_share"，表示取所有模块共享的localStorage数据
	 * @param projName 模块前缀标识
	 */
    function getProjLStorage(projName) {
        projName = projName ? projName : gconfig.projName;
        var projLSJonObj = {};
        for (var item in localStorage) {
            if (item.indexOf(projName + "|") > -1) {
                var value = null;
                try {
                    value = localStorage.getItem(item);
                } catch (e) {
                    layerUtils.iAlert("您的浏览器版本太低，或者您开启了隐身/无痕浏览模式，或者WebView组件不支持localStorage！");
                }
                //解密处理
                if (gconfig.platform != "0") {
                    value = value != null ? value : "";
                    var aes = require("{pluginBaseUrl}framework/plugins/endecrypt/scripts/aes_c0df41f4");
                    if (aes) {
                        try {
                            var keyHex = aes.enc.Utf8.parse("iloveyou");
                            var iv = aes.enc.Utf8.parse("iloveyou");
                            var valueHex = aes.enc.Base64.parse(value);
                            var decrypted = aes.AES.decrypt({
                                ciphertext: valueHex
                            }, keyHex, {
                                iv: iv,
                                mode: aes.mode.CBC
                            });
                            value = decrypted.toString(aes.enc.Utf8);
                        } catch (e) {
                            layerUtils.iAlert("getProjLStorage： 取数据时，解密失败！");
                        }
                    }
                }
                projLSJonObj[item.replace(projName + "|", "")] = value;
            }
        }
        return projLSJonObj;
    }
    /**
	 * 清除localStorage中的数据，这里分3种情况：
	 * 1、如果不传key，则清除当前模块的localStorage数据
	 * 2、如果key为字符串变量，则清除当前模块的localStorage数据
	 * 3、如果key为Boolean类型变量true，则清除同一站点下所有模块的localStorage数据（支持多模块）
	 * @parm key 设置的key
	 */
    function clearLStorage(key) {
        try {
            if (key === true) {
                localStorage.clear();
            } else {
                if (key) {
                    localStorage.removeItem(gconfig.projName + "|" + key);
                } else {
                    for (var pkey in localStorage) {
                        if (pkey.indexOf(gconfig.projName + "|") > -1) {
                            localStorage.removeItem(pkey);
                        }
                    }
                }
            }
        } catch (e) {
            layerUtils.iAlert("您的浏览器版本太低，或者您开启了隐身/无痕浏览模式，或者WebView组件不支持localStorage！");
        }
    }
    /**
	 * 获取页面入参json对象中某一个参数
	 * 提供给页面对应的js获取参数以初始化页面
	 * @param paramName参数名称，如果无参数，则返回整个param对象
	 * @returns 参数值
	 */
    function getPageParam(paramName) {
        var sCurPage = getSStorageInfo("_curPage"), curPage = JSON.parse(sCurPage);
        if (curPage) {
            var jsonParam = curPage.param;
            if (paramName) {
                return jsonParam && jsonParam != "null" ? jsonParam[paramName] : "";
            } else {
                return jsonParam;
            }
        }
        return "";
    }
    /**
	 * 页面切换的后退，返回到前一个page
	 */
    function pageBack() {
        if (gconfig.global.isMultiple) {
            window.history.back();
        } else {
            if (window.history && window.history.pushState) {
                //alert("pageBack1");
                window.history.back();
            } else {
                //获取当前页面curPage
                var sCurPage = getSStorageInfo("_curPage"), curPage = JSON.parse(sCurPage), pageCode = curPage.pageCode, prePageCode = curPage.prePageCode;
                //alert("pageBack2~"+sCurPage);
                var prePageId = prePageCode.replaceAll("/", "_");
                var prePageStateObj = JSON.parse(getSStorageInfo(prePageCode));
                setSStorageInfo("_curPage", JSON.stringify(prePageStateObj));
                //保存当前页面信息，注意：防止刷新参数丢失
                //				setSStorageInfo(prePageCode, JSON.stringify(prePageStateObj)); //保存页面最近一次访问的入参信息，history.pushState不兼容的处理
                if ($("#" + prePageId).length < 1 || $("#" + prePageId).attr("data-refresh") == "yes" || $("#" + prePageId).attr("data-refresh") == "true") {
                    //页面回退参数pageCode, prePageCode顺序互调
                    appUtils.pageInit(pageCode, prePageCode, prePageStateObj.param, prePageStateObj.isLastReq, prePageStateObj.isShowWait, prePageStateObj.isShowOverLay);
                } else {
                    var title = $("#" + prePageId).attr("data-pageTitle");
                    title = title ? title : "3GWeb";
                    document.title = title;
                    //调用前也页面销毁方法，再switchPage
                    var iPrePageCode = getSStorageInfo("_curPageCode");
                    iPrePageCode = !iPrePageCode || iPrePageCode == "null" ? "" : iPrePageCode;
                    clearRequest();
                    //清除正在发起的请求
                    require.async(gconfig.scriptsPath + iPrePageCode, function(page) {
                        if (page.destroy) {
                            //页面存在切换页面后的清理工作，主要是原来页面重置显示的值
                            page.destroy();
                        }
                        switchPage(prePageId);
                        setSStorageInfo("_curPageCode", pageCode);
                    });
                }
            }
        }
    }
    /**
	 * 对history.pushState的兼容处理
	 */
    function iPushState(state, title, hash) {
        if (window.history && window.history.pushState) {
            if (!gconfig.global.isMultiple) {
                //alert("push");
                window.history.pushState(state, title, hash);
            }
        } else {
            //alert("no push");
            console.log("您的浏览器不支持history.pushState！！");
        }
    }
    /**
	 * 切换页面时清除正在发起的请求
	 */
    function clearRequest() {
        var protocol = gconfig.global.protocol;
        protocol = protocol ? protocol : "ajax";
        require.async(protocol, function(module) {
            module.clearRequest();
        });
    }
    /**
	 * 前端根据后台配置的errorNo做的过滤器
	 * @param data 返回结果集
	 * @returns isFiltered 表示是否经过过滤
	 */
    function executeFilter(data) {
        var resultsParser = gconfig.resultsParser, iErrorNo = resultsParser.error_no, iErrorInfo = resultsParser.error_info;
        var error_no = data[iErrorNo] + "", error_info = data[iErrorInfo], isFiltered = false, filters = gconfig.filters, filterPage = filters[error_no];
        //在config配置过才有过滤处理
        if (filterPage) {
            layerUtils.iLoading(false);
            var moduleAlias = filterPage.moduleAlias;
            var moduleFuncName = filterPage.moduleFuncName;
            if (moduleAlias && moduleFuncName) {
                require.async(moduleAlias, function(module) {
                    if (module && module[moduleFuncName]) {
                        module[moduleFuncName](data);
                    }
                });
            } else {
                var pageCode = filterPage.pageCode;
                if (pageCode) {
                    appUtils.pageInit(getSStorageInfo("_curPageCode"), pageCode, filterPage.jsonParam);
                    setTimeout(function() {
                        layerUtils.iMsg(-1, error_info);
                    }, 400);
                } else {
                    layerUtils.iAlert(error_info);
                }
            }
            isFiltered = true;
        }
        return isFiltered;
    }
    /**
	 * 统一请求后台入口
	 * @param url：请求的url
	 * @param param：传递的参数,这里进行utf-8编码，后端服务器需要进行相应解码，处理中文乱码问题
	 * @param callback 回调处理函数
	 * @param isLastReq 是否是最后一个请求，默认是true
	 * 如果是true表示后面再没有ajax请求了，等待层将清除掉，false表示又有ajax加载数据，保留等待层的状态，
	 * 与isShowWait配合实现多个请求的等待状态显示
	 * @param isAsync 是否异步请求，默认是true
	 * @param isShowWait：是否显示等待层 默认是true
	 * @param isShowOverLay 是否显示遮罩层，默认为true
	 * @param tipsWords 显示等待层时，显示的文字，不传默认显示"请等待..."
	 * @param timeOutFunc 超时后的处理函数，默认可不传，只提示超时
	 * @param dataType 出参格式，默认可不传，为json格式
	 * @param isGlobal 是否属于全局请求，true表示切换页面时，该请求不会被清除，默认是false
	 */
    function invokeServer(url, param, callback, isLastReq, isAsync, isShowWait, isShowOverLay, tipsWords, timeOutFunc, dataType, isGlobal) {
        var protocol = gconfig.global.protocol;
        protocol = protocol ? protocol : "ajax";
        require.async(protocol, function(module) {
            module.request(url, param, function(data) {
                if (!executeFilter(data)) {
                    callback && callback(data);
                }
            }, isLastReq, isAsync, isShowWait, isShowOverLay, tipsWords, timeOutFunc, dataType, isGlobal);
        });
    }
    /**
	 * ajax加载纯静态html页面
	 * @param loadEle：要加载的位置元素
	 * @param htmlUrl：请求页面的url
	 * @param callback 回调处理函数
	 * @param isLastReq 是否是最后一个请求，默认是true
	 * 如果是true表示后面再没有ajax请求了，等待层将清除掉，false表示又有ajax加载数据，保留等待层的状态，
	 * 与isShowWait配合实现多个请求的等待状态显示
	 * @param isAsync 是否异步请求，默认是true
	 * @param isShowWait：是否显示等待层 默认是true
	 * @param isShowOverLay 是否显示遮罩层，默认为true
	 */
    function loadHtml(loadEle, htmlUrl, callback, isLastReq, isAsync, isShowWait, isShowOverLay) {
        ajax.loadHtml(htmlUrl, function(htmlContent) {
            loadEle = loadEle || $("body>#afui>#content");
            loadEle.html(htmlContent);
            if (callback) {
                callback();
            }
        }, isLastReq, isAsync, isShowWait, isShowOverLay);
    }
    /**
	 * 页面入口方法
	 * 如果有也页面部分区域页面需要ajax加载进来需要调用loadHtml方法实现自己的效果
	 * @parm prePageCode 前置页面标识
	 * @parm pageCode 页面标识
	 * @param param：注意：这里是请求页面后的页面初始化参数，非必传
	 * @param isLastReq 是否是最后一个请求，默认是true
	 * 如果是true表示后面再没有ajax请求了，等待层将清除掉，false表示又有ajax加载数据，保留等待层的状态，
	 * 与isShowWait配合实现多个请求的等待状态显示
	 * @param isShowWait：是否显示等待层 默认是true
	 * @param isShowOverLay 是否显示遮罩层，默认为true
	 */
    function pageInit(prePageCode, pageCode, param, isLastReq, isShowWait, isShowOverLay) {
        //嵌入手机壳子的页面加载不用显示等待层
        isShowWait = false;
        //gconfig.platform != "0" ? false : isShowWait;
        isLastReq = true;
        //gconfig.platform != "0" ? true : isLastReq;
        var pageUrl = gconfig.viewsPath + pageCode + ".html", pageId = pageCode.replaceAll("/", "_");
        //pageCode转换成html页面的pageId
        //如果dom中存在该页面直接执行afterAjaxPage方法，如果dom中不存则先加载再执行
        try {
            firstLoadFucntion(function() {
                //页面的权限校验
                checkPermission({
                    checkInParam: {
                        prePageCode: prePageCode,
                        pageCode: pageCode,
                        param: param,
                        isLastReq: isLastReq,
                        isShowWait: isShowWait,
                        isShowOverLay: isShowOverLay
                    },
                    callback: function() {
                        if ($("body>#afui>#content>#" + pageId).length < 1) {
                            ajax.loadHtml(pageUrl, function(htmlContent) {
                                $("body>#afui>#content").append(htmlContent);
                                //保存这个page到dom，切换页面时根据需要是否清除page
                                $("body>#afui>#content>#" + pageId + " img").each(function() {
                                    //设置图片scr地址，防止出错
                                    var src = $(this).attr("src");
                                    if (src && $(this).attr("data-serverImg") != "true") {
                                        $(this).attr("src", gconfig.imagesPath + src.substring(src.indexOf("images") + 7));
                                    }
                                });
                                //判断是否需要登录检验和登录才能访问
                                if (checkLogin(prePageCode, pageCode, param, true, isShowWait, isShowOverLay)) {
                                    _pageInit(prePageCode, pageCode, param, isLastReq, isShowWait, isShowOverLay);
                                }
                            }, isLastReq, true, isShowWait, isShowOverLay);
                        } else {
                            //判断是否需要登录检验和登录才能访问
                            if (checkLogin(prePageCode, pageCode, param, true, isShowWait, isShowOverLay)) {
                                _pageInit(prePageCode, pageCode, param, isLastReq, isShowWait, isShowOverLay);
                            }
                        }
                    }
                });
            });
        } catch (e) {
            console.printStackTrace(e);
        }
    }
    /**
	 * 权限校验
	 * @param callBackObj 校验判断依据和回调
	 */
    function checkPermission(callBackObj) {
        var checkPermission = gconfig.checkPermission;
        if (checkPermission && checkPermission.moduleAlias && checkPermission.moduleFuncName) {
            var moduleAlias = checkPermission.moduleAlias;
            var moduleFuncName = checkPermission.moduleFuncName;
            var module = require.async(moduleAlias, function(module) {
                if (module && module[moduleFuncName]) {
                    var isPass = module[moduleFuncName](callBackObj.checkInParam);
                    if (isPass === true) {
                        callBackObj.callback();
                    }
                } else {
                    callBackObj.callback();
                }
            });
        } else {
            callBackObj.callback();
        }
    }
    /**
	 * 校验是否需要登录，并调到登录页面，且登录后调到目标页面
	 * 目标页面和目标页面入参分别从sessionstorage中取_loginInPageCode和_loginInPageParam
	 * 需要注意：
	 * 1、在需要校验登录才能访问的页面page上增加自定义属性data-isCheckLogin为true
	 * 2、需要在configuration配置 "loginPage": {"pageCode": "person/userLogin", "jsonParam":{}}, //登录页面
	 * 3、登录后设置setSStorageInfo("_isLoginIn","true")，退出时需要clearSStorage("_loginInPageCode")、clearSStorage("_loginInPageParam")
	 */
    function checkLogin(prePageCode, pageCode, param, isLastReq, isShowWait, isShowOverLay) {
        var pageId = pageCode.replaceAll("/", "_");
        var isCheckLogin = $("body>#afui>#content>#" + pageId).attr("data-ischecklogin");
        if (isCheckLogin == "true") {
            if (getSStorageInfo("_isLoginIn") == "true") {
                return true;
            } else {
                var loginPage = gconfig.loginPage;
                if (loginPage && loginPage.pageCode) {
                    setSStorageInfo("_loginInPageCode", pageCode);
                    setSStorageInfo("_loginInPageParam", param ? JSON.stringify(param) : "");
                    pageInit(prePageCode, loginPage.pageCode, loginPage.jsonParam, isLastReq, isShowWait, isShowOverLay);
                    setTimeout(function() {
                        layerUtils.iMsg(-1, "请先登录！");
                    }, 400);
                } else {
                    layerUtils.iAlert("你未登录，且登录页面配置错误！");
                }
                return false;
            }
        } else {
            return true;
        }
    }
    /**
	 * 第一次加载第一个业务模块之前需要处理方法
	 * @param pageModuleInit 某个模块的int方法
	 */
    function firstLoadFucntion(pageModuleInit) {
        var firstLoadIntf = gconfig.firstLoadIntf;
        if (firstLoadIntf && firstLoadIntf.isLoad !== true) {
            var moduleAlias = firstLoadIntf.moduleAlias;
            var moduleFuncName = firstLoadIntf.moduleFuncName;
            var module = require.async(moduleAlias, function(module) {
                if (module && module[moduleFuncName]) {
                    module[moduleFuncName]();
                }
                firstLoadIntf.isLoad = true;
                pageModuleInit();
            });
        } else {
            pageModuleInit();
        }
    }
    /**
	 * 私有pageInit方法
	 */
    function _pageInit(prePageCode, pageCode, param, isLastReq, isShowWait, isShowOverLay) {
        prePageCode = !prePageCode || prePageCode == "null" ? "" : prePageCode;
        var pageId = pageCode.replaceAll("/", "_"), //pageCode转换成html页面的pageId
        prePageId = prePageCode.replaceAll("/", "_");
        //prePageCode转换成前置页面id
        switchPage(pageId);
        //切换页面
        clearRequest();
        //清除正在发起的请求
        var funcInit = function() {
            require.async(gconfig.scriptsPath + pageCode, function(page) {
                handleHashFunc(prePageCode, pageCode, param, isLastReq, isShowWait, isShowOverLay);
                page.init();
                //当前页面初始化
                if (page.bindPageEvent && $("body>#afui>#content>#" + pageId).attr("data-hasBindEvent") != "yes" && $("body>#afui>#content>#" + pageId).attr("data-hasBindEvent") != "true") {
                    //兼容以后page的事件绑定抽出成bindPageEvent方法
                    page.bindPageEvent();
                    $("body>#afui>#content>#" + pageId).attr("data-hasBindEvent", "true");
                }
                //DOM对page的管理，暂实现自管理，通过page上自定义熟悉data-isSaveDom
                if ($("#" + prePageId).length > 0) {
                    var isSave = $("#" + prePageId).attr("data-isSaveDom");
                    //默认保存，page元素可不写该参数，如果不需要保存，则设置为no
                    if (isSave == "no" || isSave == "false") {
                        $("#" + prePageId).remove();
                    }
                }
            });
        };
        if (prePageCode) {
            //存在前置页面，则调用该页面销毁方法
            require.async(gconfig.scriptsPath + prePageCode, function(prePage) {
                if (prePage.destroy) {
                    //页面存在切换页面后的清理工作，主要是原来页面重置显示的值
                    prePage.destroy();
                    clearTempAsync();
                }
                funcInit();
            });
        } else {
            funcInit();
        }
    }
    /**
	 * History的Hash处理
	 */
    function handleHashFunc(prePageCode, pageCode, param, isLastReq, isShowWait, isShowOverLay) {
        if (gconfig.global.isMultiple) {
            return false;
        }
        //是否保存浏览器地址栏的入参
        var urlParam = "";
        if (param && JSON.stringify(param) != "{}" && ($("#" + pageCode.replaceAll("/", "_")).attr("data-urlParam") == "yes" || $("#" + pageCode.replaceAll("/", "_")).attr("data-urlParam") == "true")) {
            urlParam = "?" + $.param(param);
        }
        /**
		 * 前面是针对页面刷新和History的Hash处理
		 */
        var state = {
            hash: "#!/" + pageCode + ".html" + urlParam,
            prePageCode: prePageCode,
            pageCode: pageCode,
            param: param,
            isLastReq: isLastReq,
            isShowWait: isShowWait,
            isShowOverLay: isShowOverLay
        };
        var title = $("#" + pageCode.replaceAll("/", "_")).attr("data-pageTitle");
        title = title ? title : "3GWeb";
        document.title = title;
        //alert("handleHashFunc1~"+JSON.stringify(state));
        if (typeof window.history.state == "undefined") {
            if (appUtils.getSStorageInfo("_isRefresh") === "true") {
                appUtils.setSStorageInfo("_isRefresh", "false");
            } else {
                //alert("handleHashFunc11");
                //某些浏览器不支持window.history.state，去掉是否重复state的判断，当刷新后再回退需要回退2次！！
                iPushState(state, title, state.hash);
            }
        } else {
            //alert("handleHashFunc2");
            if (state != window.history.state) {
                if (!window.history.state || window.history.state && window.history.state.hash != state.hash) {
                    iPushState(state, title, state.hash);
                }
            }
        }
        setSStorageInfo("_curPage", JSON.stringify(state));
        //保存当前页面信息
        setSStorageInfo(pageCode, JSON.stringify(state));
        //保存页面最近一次访问的入参信息，history.pushState不兼容的处理
        setSStorageInfo("_prePageCode", prePageCode);
        //保存前置页面标识prePageCode
        setSStorageInfo("_curPageCode", pageCode);
        //保存当前页面标识curPageCode
        appUtils.startInitFlag = true;
    }
    /**
	 * seajs的require.async和use方法产生的临时模块
	 */
    function clearTempAsync() {
        for (var key in seajs.cache) {
            if (key.indexOf("_async_") > -1) {
                delete seajs.cache[key];
            }
        }
    }
    /**
	 * 提供给项目中重定向跳转页面，支持跳转到其他模块或者不同域下的项目，url为路径（相对路径或者全路径），参数拼接在url上
	 * 同时提供给壳子调用的重定向页面的接口方法，参数isInner和prePageCode一般可不传，但是这种只有一个H5的webView
	 * @param url page对应的地址，url后面可以带参数
	 * @param isInner 是否是重定向当前模块的内部页面，不传默认为false
	 * @param prePageCode 重定向当前模块的页面时的前置页面pageCode，当isInner为true是必传
	 */
    window.sendDirect4Shell = function(url, isInner, prePageCode) {
        if (!isInner) {
            clearSStorage("_prePageCode");
        } else {
            appUtils.setSStorageInfo("_prePageCode", prePageCode ? prePageCode : "");
        }
        appUtils.preHashUrl = location.href;
        location.href = url;
    };
    /**
	 * 提供给壳子调用的切换页面的接口方法，这个只是在当前模块切换页面，这种只有一个H5的webView
	 * 与appUtils的pageInit有所不同
	 * @param toPageCode 要跳转到的页面pageCode
	 * @param toPageParam 要跳转到的页面json格式入参
	 */
    window.pageInit4Shell = function(toPageCode, toPageParam) {
        //查询当前显示的页面的pageCode
        var pageId = $(".page[data-display='block']").attr("id");
        var currPageCode = pageId ? pageId.replaceAll("_", "/") : "";
        if (currPageCode != toPageCode) {
            appUtils.pageInit(currPageCode, toPageCode, toPageParam);
        }
    };
    /**
	 * 加载指定地址的 css
	 * @param cssAddr 需要加载的 css 地址，可以是字符串，也可以是数组
	 * @param callback 加载完成的回调函数
	 */
    function loadCss(cssAddr, callback) {
        var aCssAddr = [];
        // 需要加载的 css 数组
        if (cssAddr instanceof Array) {
            aCssAddr = aCssAddr.concat(cssAddr);
        } else if (cssAddr) {
            aCssAddr.push(cssAddr);
        }
        for (var i = 0, length = aCssAddr.length; i < length; i++) {
            var linkDom = document.createElement("link");
            linkDom.charset = "utf-8";
            linkDom.rel = "stylesheet";
            linkDom.href = aCssAddr[i];
            document.querySelector("head").appendChild(linkDom);
        }
        if (loadCssTimer) {
            clearTimeout(loadCssTimer);
            loadCssTimer = null;
        }
        loadCssTimer = setTimeout(callback, 100);
    }
    var appUtils = {
        preHashUrl: "",
        startInitFlag: false,
        //最开始执行页面init，不触发window.onpopstate，刷新hash处理
        bindFunc: bindFunc,
        loadJS: loadJS,
        switchPage: switchPage,
        pageResetValue: pageResetValue,
        bindEvent: bindEvent,
        preBindEvent: preBindEvent,
        setSStorageInfo: setSStorageInfo,
        getSStorageInfo: getSStorageInfo,
        getProjSStorage: getProjSStorage,
        setLStorageInfo: setLStorageInfo,
        getLStorageInfo: getLStorageInfo,
        getProjLStorage: getProjLStorage,
        clearSStorage: clearSStorage,
        clearLStorage: clearLStorage,
        getPageParam: getPageParam,
        pageBack: pageBack,
        clearRequest: clearRequest,
        executeFilter: executeFilter,
        invokeServer: invokeServer,
        loadHtml: loadHtml,
        pageInit: pageInit,
        sendDirect: window.sendDirect4Shell,
        loadCss: loadCss
    };
    //暴露对外的接口
    module.exports = appUtils;
});

/**
 * 原生js方法扩展，无需export
 */
define("/framework/base/lang/extnative_a1b4d9ee", [], function(require, exports, module) {
    /** 
	 * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
	 * 可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
	 * eg: (newDate()).format("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423      
	 * (new Date()).format("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04      
	 * (new Date()).format("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04      
	 * (new Date()).format("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04      
	 * (new Date()).format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18      
	 */
    Date.prototype.format = function(pattern) {
        var o = {
            "M+": this.getMonth() + 1,
            //月份
            "d+": this.getDate(),
            //日
            "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,
            //小时
            "H+": this.getHours(),
            //小时
            "m+": this.getMinutes(),
            //分
            "s+": this.getSeconds(),
            //秒
            "q+": Math.floor((this.getMonth() + 3) / 3),
            //季度
            S: this.getMilliseconds()
        };
        var week = {
            "0": "日",
            "1": "一",
            "2": "二",
            "3": "三",
            "4": "四",
            "5": "五",
            "6": "六"
        };
        if (/(y+)/.test(pattern)) {
            pattern = pattern.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(pattern)) {
            pattern = pattern.replace(RegExp.$1, (RegExp.$1.length > 1 ? RegExp.$1.length > 2 ? "星期" : "周" : "") + week[this.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(pattern)) {
                pattern = pattern.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return pattern;
    };
    /**
	 * 功能:根据元素找出元素所在索引值. 
	 * 参数:元素值
	 * 返回:下标
	 */
    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) {
                return i;
            }
        }
        return -1;
    };
    /**
	 * 功能:根据元素位置值删除数组元素. 
	 * 参数:索引值 
	 * 返回:修改后的数组 
	 */
    Array.prototype.remove = function(idx) {
        if (isNaN(idx) || idx > this.length) {
            return false;
        }
        for (var i = 0, n = 0; i < this.length; i++) {
            if (this[i] != this[idx]) {
                this[n++] = this[i];
            }
        }
        this.length -= 1;
    };
    /**
	 * 清除两边的空格
	 * @returns
	 */
    String.prototype.trim = function() {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    };
    String.prototype.startWith = function(str) {
        if (StringHelper.isBlank(str)) return false;
        if (this.substr(0, str.length) === str) return true; else return false;
        return true;
    };
    String.prototype.endsWith = function(str) {
        if (StringHelper.isBlank(str)) return false;
        if (this.length <= str.length) return false;
        if (this.substr(this.length - str.length, this.length) === str) return true; else return false;
        return true;
    };
    String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
        if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
            return this.replace(new RegExp(reallyDo, ignoreCase ? "gi" : "g"), replaceWith);
        } else {
            return this.replace(reallyDo, replaceWith);
        }
    };
});

/**
 * 框架配置信息，与configuration做了交集
 * 如果configuration模块中配置了就取configuration模块的配置值
 * 项目自定义配置 || 框架默认值
 */
define("/framework/base/lang/gconfig_37984852", [], function(require, exports, module) {
    var projName = configuration.projName || "project";
    var seaBaseUrl = configuration.seaBaseUrl || "/m/";
    var gconfig = {
        //框架配置
        frameworkVersion: "framework",
        appWidth: document.body.clientWidth,
        //界面宽度
        appHeight: document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight,
        //界面高度
        triggerEventName: iBrowser.pc ? "click" : "mousedown",
        //触发界面响应的事件 pc上：click  手机上：mousedown
        //项目名，默认为project
        projName: projName,
        //一般为“project”，对应的项目目录名字
        //项目根路径
        projPath: seajs._platRoot + seaBaseUrl + projName + "/",
        //项目的css目录
        cssPath: seajs._platRoot + seaBaseUrl + projName + "/css/",
        //项目的images目录
        imagesPath: seajs._platRoot + seaBaseUrl + projName + "/images/",
        //项目的scripts目录
        scriptsPath: seajs._platRoot + seaBaseUrl + projName + "/scripts/",
        //项目的views目录
        viewsPath: seajs._platRoot + seaBaseUrl + projName + "/views/",
        /*******************************************必配项***************************************************/
        /**
		 * 平台，不传默认为0：
		 * 0：pc或者手机浏览器、1：android手机壳子嵌phonegap、2：ios手机壳子嵌phonegap、
		 * 3：ios手机壳子嵌AIR、4：android手机跳转web、5：ios手机跳转web
		 */
        platform: configuration.platform || "0",
        /**
		 * 项目的默认页面，当在地址栏输入的url不带pageCode（“#!/”至“.html”中间的部分）时进入该配置对应的页面，
		 * 这个参数是不带pageCode时进入默认页面的入参
		 */
        defaultPage: configuration.defaultPage || {},
        /******************************************选择可配项************************************************/
        /**
		 * hSea根路径，项目中的文件uri最终会在项目访问的web路径后添加
		 */
        seaBaseUrl: seajs._platRoot + seaBaseUrl,
        /**
		 * 项目中的需要先加载的css样式文件，如果多个，添加在数组里面中，从css目录下写文件路径
		 * 不配默认为：["/css/app_style.css"]
		 */
        firstLoadCss: function() {
            var firstLoadCss = configuration.firstLoadCss;
            if (firstLoadCss) {
                for (var i = 0, len = firstLoadCss.length; i < len; i++) {
                    firstLoadCss[i] = seajs._platRoot + seaBaseUrl + projName + firstLoadCss[i];
                }
                return firstLoadCss;
            } else {
                return [ seajs._platRoot + seaBaseUrl + projName + "/css/app_style.css" ];
            }
        }(),
        /**
		 * 后台返回结果集出参结构，类似error_no、error_info的出参命名定义，
		 * 防止不同项目的后台的出参命名不一致，以便框架可取配置的值，由项目自己定义，但后台必须统一
		 * 不配默认为：{"error_no": "error_no", "error_info": "error_info"}
		 */
        resultsParser: configuration.resultsParser || {
            error_no: "error_no",
            error_info: "error_info"
        },
        /**
		 * 该配置是请求接口被后台拦截器拦截之后返回的错误号对应的处理
		 * 前端根据后台的error_no做的过滤器配置，需要后台配合定义error_no，
		 * 有的需要跳转页面，有的只做提示，提示信息如果后台给出，就取后台提示信息，否则取配置中的error_info字段
		 * 不配默认为：{}
		 */
        filters: configuration.filters || {},
        /**
		 * 整个项目的登录页面
		 * 不配默认为：{}
		 */
        loginPage: configuration.loginPage || {},
        /**
		 * 整个应用的引导页配置
		 * 不配默认为：{}
		 */
        guidePage: configuration.guidePage || {},
        /**
		 * 项目中公用模块的别名配置
		 * 不配默认为：{}
		 */
        pAlias: configuration.pAlias || {},
        /**
		 * 跳转页面时做的权限校验，提供在外面的方法
		 * moduleAlias为项目通用模块配置的别名，moduleFuncName方法里面写校验规则，返回true或者false，避免写异步的代码
		 * 不配默认为：{}
		 */
        checkPermission: configuration.checkPermission || {},
        /**
		 * 第一次加载第一个业务模块前所需要的处理，即启动之后提供给外界初始化的接口，
		 * 这个方法中避免写异步操作，或者保证异步影响其他代码逻辑
		 * moduleAlias为项目通用模块配置的别名，moduleFuncName为执行的方法
		 * 这个配置可以做很多事情，当你从业务模块逻辑上不好实现时，可以考虑这里！！
		 * 不配默认为：{}
		 */
        firstLoadIntf: configuration.firstLoadIntf || {},
        /**
		 * 项目中需要调用到的常量、变量这里配置，调用方式，通过require("gconfig").global.*来调用
		 * 不配默认为：{}
		 */
        global: configuration.global || {},
        /**
		 * Android手机返回键处理，退出应用还是返回上级页面，true-退出应用，false-返回页面，默认为true
		 * 如果需要返回上一级页面，并最终提示退出应用，需要改为false，并且在一级页面的html上设置“data-pageLevel="1"”
		 * 不配默认为：true
		 */
        isDirectExit: typeof configuration.isDirectExit != "undefined" ? configuration.isDirectExit : true,
        /**
		 * 弹出层各种弹出层主题样式，默认为系统自带
		 * 不配默认为："default"
		 */
        layerTheme: configuration.layerTheme || "default",
        /**
		 * ajax请求超时时间设置，默认为20秒之后超时
		 * 不配默认为：20秒
		 */
        ajaxTimeout: configuration.ajaxTimeout || 20,
        /**
		 * 当弹出等待层时（iLoading），点击遮罩层是否关闭遮罩，关闭后用户可操作页面
		 * 不配默认为：false
		 */
        isClickShadeHide: typeof configuration.isClickShadeHide != "undefined" ? configuration.isClickShadeHide : false
    };
    //清理全局的configuration
    window.configuration = null;
    try {
        delete window.configuration;
    } catch (e) {}
    //暴露对外的接口
    module.exports = gconfig;
});

/**
 * MAP对象，实现MAP功能
 *
 * 接口：
 * size()     获取MAP元素个数
 * isEmpty()    判断MAP是否为空
 * clear()     删除MAP所有元素
 * put(key, value)   向MAP中增加元素（key, value) 
 * remove(key)    删除指定KEY的元素，成功返回True，失败返回False
 * get(key)    获取指定KEY的元素值VALUE，失败返回NULL
 * element(index)   获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
 * containsKey(key)  判断MAP中是否含有指定KEY的元素
 * containsValue(value) 判断MAP中是否含有指定VALUE的元素
 * values()    获取MAP中所有VALUE的数组（ARRAY）
 * keys()     获取MAP中所有KEY的数组（ARRAY）
 */
define("/framework/base/lang/map_5c060a79", [], function(require, exports, module) {
    function Map() {
        this.elements = new Array();
    }
    Map.prototype = {
        //获取MAP元素个数
        size: function() {
            return this.elements.length;
        },
        //判断MAP是否为空
        isEmpty: function() {
            return this.elements.length < 1;
        },
        //删除MAP所有元素
        clear: function() {
            this.elements = new Array();
        },
        //向MAP中增加元素（key, value) 
        put: function(_key, _value) {
            this.elements.push({
                key: _key,
                value: _value
            });
        },
        //删除指定KEY的元素，成功返回True，失败返回False
        remove: function(_key) {
            var bln = false;
            try {
                for (i = 0; i < this.elements.length; i++) {
                    if (this.elements[i].key == _key) {
                        this.elements.splice(i, 1);
                        return true;
                    }
                }
            } catch (e) {
                bln = false;
            }
            return bln;
        },
        //获取指定KEY的元素值VALUE，失败返回NULL
        get: function(_key) {
            try {
                for (i = 0; i < this.elements.length; i++) {
                    if (this.elements[i].key == _key) {
                        return this.elements[i].value;
                    }
                }
            } catch (e) {
                return null;
            }
        },
        //获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
        element: function(_index) {
            if (_index < 0 || _index >= this.elements.length) {
                return null;
            }
            return this.elements[_index];
        },
        //判断MAP中是否含有指定KEY的元素
        containsKey: function(_key) {
            var bln = false;
            try {
                for (i = 0; i < this.elements.length; i++) {
                    if (this.elements[i].key == _key) {
                        bln = true;
                    }
                }
            } catch (e) {
                bln = false;
            }
            return bln;
        },
        //判断MAP中是否含有指定VALUE的元素
        containsValue: function(_value) {
            var bln = false;
            try {
                for (i = 0; i < this.elements.length; i++) {
                    if (this.elements[i].value == _value) {
                        bln = true;
                    }
                }
            } catch (e) {
                bln = false;
            }
            return bln;
        },
        //获取MAP中所有VALUE的数组（ARRAY）
        values: function() {
            var arr = new Array();
            for (i = 0; i < this.elements.length; i++) {
                arr.push(this.elements[i].value);
            }
            return arr;
        },
        //获取MAP中所有KEY的数组（ARRAY）
        keys: function() {
            var arr = new Array();
            for (i = 0; i < this.elements.length; i++) {
                arr.push(this.elements[i].key);
            }
            return arr;
        }
    };
    //暴露对外的接口
    module.exports = Map;
});

/**
 * 总应用程序入口
 */
define("/framework/base/main_560cc688", [ "/framework/base/lang/extnative_a1b4d9ee", "/framework/base/jquery/jquery_scrollto_1bb69295", "/framework/base/jquery/jquery_fda6b489", "external", "/framework/base/lang/appUtils_f8b8d996", "/framework/base/lang/gconfig_37984852", "/framework/base/lang/ajax_194df9ce" ], function(require, exports, module) {
    function init() {
        /**
	 * 加载所有全局js模块，因为暴露给了window，所以这种只需要加载一次
	 * 扩展原生js方法、jQuery.fn.extend或者jQuery.extend等
	 */
        require("/framework/base/lang/extnative_a1b4d9ee");
        require("/framework/base/jquery/jquery_scrollto_1bb69295");
        require("{pluginBaseUrl}framework/plugins/nativeintf/scripts/external_33d44919");
        // 将 callMessage 方法暴露给原生，供原生回调H5使用
        /************************************初始化*******************************************/
        var appUtils = require("/framework/base/lang/appUtils_f8b8d996"), gconfig = require("/framework/base/lang/gconfig_37984852");
        var layerUtils = require("{pluginBaseUrl}framework/plugins/layer/scripts/layerUtils_51307981");
        var layerPath = seajs.data.alias.layer;
        layerPath = layerPath.replace("{pluginBaseUrl}", "");
        appUtils.loadJS("", gconfig.seaBaseUrl + layerPath + ".js");
        /**
	 * 加载应用需要先加载的通用css文件
	 */
        appUtils.loadCss(gconfig.firstLoadCss, function() {
            /**
		 * 前面是针对页面刷新和History的Hash处理
		 */
            var sCurPage = appUtils.getSStorageInfo("_curPage"), curPage = sCurPage ? JSON.parse(sCurPage) : null, lHref = window.location.href;
            if (curPage && getPageCode() == curPage.pageCode) {
                //这里为了刷新取curPage中的param参数
                var pageCode = curPage.pageCode, param = JSON.stringify(queryString2Json()) != "{}" && queryString2Json() != curPage.param ? queryString2Json() : curPage.param, isLastReq = curPage.isLastReq, isShowWait = curPage.isShowWait, isShowOverLay = curPage.isShowOverLay;
                appUtils.pageInit("", pageCode, param, isLastReq, isShowWait, isShowOverLay);
                appUtils.startInitFlag = false;
                if (!gconfig.global.isMultiple) {
                    setTimeout(function() {
                        handleHistoryHash();
                    }, 200);
                }
            } else {
                setTimeout(function() {
                    dispatchPage();
                }, 200);
                appUtils.startInitFlag = false;
                if (!gconfig.global.isMultiple) {
                    setTimeout(function() {
                        handleHistoryHash();
                    }, 200);
                }
            }
            //预防假死...
            if (gconfig.platform != "0") {
                setInterval(function() {}, 5e3);
            }
        });
        /************************************初始化中调用的该模块私有方法*******************************************/
        /**
	 * 转换url查询入参为json对象
	 * Turning the Querystring into a JSON object using JavaScript
	 */
        function queryString2Json() {
            var lHref = decodeURIComponent(window.location.href), pairs = lHref.lastIndexOf(".html?") > -1 ? lHref.substring(lHref.lastIndexOf(".html?") + 6).split("&") : [];
            var result = {};
            pairs.forEach(function(pair) {
                pair = pair.split("=");
                if (pair.length > 1) {
                    var tempArr = [];
                    for (var i = 1, len = pair.length; i < len; i++) {
                        tempArr[i - 1] = pair[i];
                    }
                    pair[1] = tempArr.join("=");
                }
                result[pair[0]] = decodeURIComponent(pair[1] || "");
            });
            return JSON.parse(JSON.stringify(result));
        }
        /**
	 * 获取地址栏pageCode
	 */
        function getPageCode() {
            var lHref = window.location.href;
            if (lHref.indexOf("#!/") == -1) return "";
            var start = lHref.indexOf("#!/") + 3, end = lHref.lastIndexOf(".html") == -1 ? lHref.length : lHref.lastIndexOf(".html");
            return lHref.substring(start, end);
        }
        /**
	 * 根据不同参数进行不同页面分发
	 */
        function dispatchPage() {
            /**
		 * pageCode其实是views目录下的对应页面的一个标识，与html和相应js路径匹配
		 * 如何配置，页面参数中文注意编码：http://192.168.1.110:2222/m/#!/demo/demo?name=zhangsan&age=21
		 * pageCode为demo/demo
		 * jsonParam为?name=zhangsan&age=21转换成json对象
		 */
            var pageCode = getPageCode(), jsonParam = queryString2Json();
            if (gconfig.global.isMultiple) {
                pageCode = jsonParam.pageCode;
                if (pageCode && pageCode.indexOf("_") > -1) {
                    pageCode = pageCode.replaceAll("_", "/");
                }
            }
            //Android预加载webView导致屏幕高度为0，通过参数传进来，在这里赋值
            var browserHeight = jsonParam.browser_height;
            var browserWidth = jsonParam.browser_width;
            if ($(window).height() == 0 && browserHeight) {
                $("body>#afui>#content").height(browserHeight - $("body>#afui>#header").height() - $("body>#afui>#footer").height());
            }
            if (gconfig.appHeight == 0 && browserHeight) {
                gconfig.appHeight = browserHeight;
            }
            if (gconfig.appWidth == 0 && browserWidth) {
                gconfig.appWidth = browserWidth;
            }
            //分发页面，先判断是否存在这个页面不存在则进入默认页面
            if (pageCode) {
                appUtils.pageInit(appUtils.getSStorageInfo("_prePageCode"), pageCode, jsonParam);
            } else {
                var isGuided = appUtils.getLStorageInfo("isGuided");
                if (isGuided == "true") {
                    var defaultPage = gconfig.defaultPage;
                    appUtils.pageInit(appUtils.getSStorageInfo("_prePageCode"), defaultPage.pageCode, defaultPage.jsonParam);
                    console.log("进入默认页面~~");
                } else {
                    var guidePage = gconfig.guidePage;
                    if (guidePage && guidePage.pageCode) {
                        appUtils.pageInit(appUtils.getSStorageInfo("_prePageCode"), guidePage.pageCode, guidePage.jsonParam);
                    } else {
                        var defaultPage = gconfig.defaultPage;
                        appUtils.pageInit(appUtils.getSStorageInfo("_prePageCode"), defaultPage.pageCode, defaultPage.jsonParam);
                        console.log("进入默认页面~~");
                    }
                }
            }
        }
        /**
	 * History的Hash处理
	 */
        function handleHistoryHash() {
            window.onpopstate = function(event) {
                if (!(window.history && window.history.pushState)) {
                    return false;
                }
                //alert("handleHistoryHash1");
                if (event && event.state) {
                    var stateObj = event.state, prePageCode = stateObj.prePageCode, pageCode = stateObj.pageCode, param = stateObj.param, isLastReq = stateObj.isLastReq, isShowWait = stateObj.isShowWait, isShowOverLay = stateObj.isShowOverLay;
                    //alert("handleHistoryHash2~~~"+appUtils.getSStorageInfo("_curPageCode")+"~~~"+JSON.stringify(stateObj));
                    var iPrePageCode = appUtils.getSStorageInfo("_curPageCode");
                    //当前页面，注意上面的prePageCode是hash值中的页面的前置页面
                    var pageId = pageCode.replaceAll("/", "_");
                    appUtils.setSStorageInfo("_curPage", JSON.stringify(stateObj));
                    //保存当前页面信息，注意：防止刷新参数丢失
                    //				appUtils.setSStorageInfo(pageCode, JSON.stringify(stateObj)); //保存页面最近一次访问的入参信息，history.pushState不兼容的处理
                    if ($("#" + pageId).length < 1 || $("#" + pageId).attr("data-refresh") == "yes" || $("#" + pageId).attr("data-refresh") == "true") {
                        //alert("handleHistoryHash3~"+iPrePageCode+"~"+pageCode);
                        appUtils.setSStorageInfo("_isRefresh", "true");
                        appUtils.pageInit(iPrePageCode, pageCode, param, isLastReq, isShowWait, isShowOverLay);
                        appUtils.setSStorageInfo("_prePageCode", iPrePageCode);
                        //保存前置页面标识prePageCode
                        appUtils.setSStorageInfo("_curPageCode", pageCode);
                    } else {
                        var title = $("#" + pageId).attr("data-pageTitle");
                        title = title ? title : "3GWeb";
                        document.title = title;
                        //调用前也页面销毁方法，再switchPage
                        iPrePageCode = !iPrePageCode || iPrePageCode == "null" ? "" : iPrePageCode;
                        appUtils.clearRequest();
                        //清除正在发起的请求
                        require.async(gconfig.scriptsPath + iPrePageCode, function(page) {
                            if (page.destroy) {
                                //页面存在切换页面后的清理工作，主要是原来页面重置显示的值
                                page.destroy();
                            }
                            appUtils.switchPage(pageId);
                            appUtils.setSStorageInfo("_curPageCode", pageCode);
                            //保存当前页面标识curPageCode
                            appUtils.setSStorageInfo("_prePageCode", iPrePageCode);
                        });
                    }
                } else {
                    //增加微平台返回兼容处理
                    if (location.href.indexOf(appUtils.preHashUrl) < 0 && location.href.indexOf("#!") != -1) {
                        if (appUtils.startInitFlag) {
                            dispatchPage();
                        }
                    } else {
                        history.go(-1);
                        if (iBrowser.weixin) {
                            try {
                                WeixinJSBridge.call("closeWindow");
                            } catch (e) {}
                        }
                    }
                }
            };
        }
    }
    module.exports = {
        init: init
    };
});
