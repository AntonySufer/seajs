/*创建时间hSea 2015-07-27 20:32:39 PM */
define(function(require,exports,module){function a(){return _KeyPanel=Object.create({init:b,close:h,get version(){return"1.0.2"},get updateDate(){return"2015-7-8 15:01:22"}})}function b(a,b,e,f){j(),_KeyPanel.keyPanelType=b,_KeyPanel.config=f,_KeyPanel.$input=$(a),_KeyPanel.$inputEM=_KeyPanel.$input.find("em"),_KeyPanel.inputPlaceholder=_KeyPanel.$input.attr("placeholder")||"",_KeyPanel.$input.addClass("active"),_KeyPanel.$input.maxlength=_KeyPanel.$input.attr("maxlength")||1e5,_KeyPanel.isPassword="undefined"==typeof e?!1:e,c(),_KeyPanel.config&&"function"==typeof _KeyPanel.config.beforeInitFunc&&_KeyPanel.config.beforeInitFunc(),d(),_KeyPanel.config&&"function"==typeof _KeyPanel.config.afterInitFunc&&_KeyPanel.config.afterInitFunc()}function c(){switch(_KeyPanel.keyPanelType=_KeyPanel.keyPanelType||"1",Number(_KeyPanel.keyPanelType)){case 1:_KeyPanel.keyPanelHtml=l.createKeyPanelHtml(),_KeyPanel.keyPanelId=l.keyPanelId;break;case 2:_KeyPanel.keyPanelHtml=keyType2.createKeyPanelHtml(),_KeyPanel.keyPanelId=keyType2.keyPanelId;break;case 3:_KeyPanel.keyPanelHtml=keyType3.createKeyPanelHtml(),_KeyPanel.keyPanelId=keyType3.keyPanelId;break;case 4:_KeyPanel.keyPanelHtml=keyType4.createKeyPanelHtml(),_KeyPanel.keyPanelId=keyType4.keyPanelId;break;case 5:_KeyPanel.keyPanelHtml=keyType5.createKeyPanelHtml(),_KeyPanel.keyPanelId=keyType5.keyPanelId}}function d(){_KeyPanel.$keyPanel=$("#"+_KeyPanel.keyPanelId),"DIV"==_KeyPanel.$input[0].tagName&&0==_KeyPanel.$inputEM.length&&(_KeyPanel.$input.html("<em>"+_KeyPanel.inputPlaceholder+"</em>"),_KeyPanel.$inputEM=_KeyPanel.$input.find("em")),"DIV"==_KeyPanel.$input[0].tagName&&_KeyPanel.$inputEM.html()==_KeyPanel.inputPlaceholder&&_KeyPanel.$inputEM.html(""),_KeyPanel.$keyPanel.length<=0&&(_KeyPanel.$keyPanel=$(_KeyPanel.keyPanelHtml),$("body").append(_KeyPanel.$keyPanel)),_KeyPanel.$keyPanel.slideDown(100,function(){i()}),_KeyPanel.$keyPanel.css("display","block").siblings(".word_table").css("display","none"),e()}function e(){var a=iBrowser.pc?"mousedown":"touchstart",b=iBrowser.pc?"mouseup":"touchend";k.bindEvent(_KeyPanel.$keyPanel,function(a){a.preventDefault()},"touchmove"),k.bindEvent(_KeyPanel.$keyPanel.find("a"),function(a){var b=$(this),c=a||window.event;b.addClass("active"),c.stopPropagation?c.stopPropagation():c.cancelBubble=!0,c.preventDefault()},a),k.bindEvent(_KeyPanel.$keyPanel.find("a"),function(a){var b=a||window.event;f($(this)),b.stopPropagation?b.stopPropagation():b.cancelBubble=!0},b)}function f(a){var b=a.html(),c=a.attr("btn-type"),d=null,e=null;switch(a.removeClass("active"),_KeyPanel.$inputEM.length<1&&(_KeyPanel.$inputEM=$("<em></em>"),_KeyPanel.$inputEM.html(_KeyPanel.$inputEM.html()),_KeyPanel.$input.attr("value","")),e=_KeyPanel.$inputEM.html(),d="undefined"==typeof _KeyPanel.$input.attr("value")?"":_KeyPanel.$input.attr("value"),Number(c)){case 1:e+=b,d+=b,_KeyPanel.$inputEM.html(e),_KeyPanel.$input.attr("value",d),_KeyPanel.isPassword&&_KeyPanel.$inputEM.html(e.replace(/[a-zA-Z0-9\.]/,"*")),inputEvent&&(inputEvent=null),d.length>_KeyPanel.$input.maxlength&&g(e,d),inputEvent=new CustomEvent("input",{detail:{optType:"normal",curValue:b}}),_KeyPanel.$input[0].dispatchEvent(inputEvent);break;case 2:h();break;case 3:g(e,d),inputEvent&&(inputEvent=null),inputEvent=new CustomEvent("input",{detail:{optType:"del"}}),_KeyPanel.$input[0].dispatchEvent(inputEvent);break;case 4:_KeyPanel.init(_KeyPanel.$input[0],2,_KeyPanel.isPassword,_KeyPanel.config);break;case 5:_KeyPanel.init(_KeyPanel.$input[0],4,_KeyPanel.isPassword,_KeyPanel.config);break;case 6:h();break;case 7:e+=b,d+=" ",_KeyPanel.$inputEM.html(e),_KeyPanel.$input.attr("value",d),_KeyPanel.isPassword&&_KeyPanel.$inputEM.html(e.replace(/(&nbsp;)$/,"*")),inputEvent&&(inputEvent=null),d.length>_KeyPanel.$input.maxlength&&g(e,d),inputEvent=new CustomEvent("input",{detail:{optType:"space",curValue:" "}}),_KeyPanel.$input[0].dispatchEvent(inputEvent);break;case 8:h();break;case 9:var f=$("#"+_KeyPanel.keyPanelId+" .col10 a"),i=a.hasClass("selected");i?a.removeClass("selected"):a.addClass("selected"),f.each(function(a,b){var c=$(b).html();/^[a-z]$/.test(c)?$(b).html(c.toUpperCase()):/^[A-Z]$/.test(c)&&$(b).html(c.toLowerCase())});break;case 10:for(b=a.find("span").html(),e+=b,d+=b,_KeyPanel.$inputEM.html(e),_KeyPanel.$input.attr("value",d.replace("&nbsp;"," ")),_KeyPanel.isPassword&&_KeyPanel.$inputEM.html(e.replace(/\d$/,"*")),inputEvent&&(inputEvent=null);d.length>_KeyPanel.$input.maxlength;)g(e,d),e=_KeyPanel.$inputEM.html(),d=_KeyPanel.$input.attr("value");inputEvent=new CustomEvent("input",{detail:{optType:"stock",curValue:b}}),_KeyPanel.$input[0].dispatchEvent(inputEvent)}}function g(a,b){a.length>0&&(a=/.*&nbsp;+$/.test(a)?a.slice(0,-6):a.slice(0,-1),b=b.slice(0,-1),_KeyPanel.$inputEM.html(a),_KeyPanel.$input.attr("value",b))}function h(){_KeyPanel.$keyPanel&&_KeyPanel.$keyPanel.length>0&&(j(),_KeyPanel.config&&"function"==typeof _KeyPanel.config.beforeCloseFunc&&_KeyPanel.config.beforeCloseFunc(),_KeyPanel.$keyPanel.hide(100,function(){_KeyPanel.$keyPanel=null,_KeyPanel.config&&"function"==typeof _KeyPanel.config.afterCloseFunc&&_KeyPanel.config.afterCloseFunc()}))}function i(){var a=_KeyPanel.$input.parents("[key-panel-main]");if(a&&a.length>0){{var b=_KeyPanel.$input.offset().top,c=_KeyPanel.$input[0].clientHeight,d=_KeyPanel.$keyPanel.offset().top,e=b+c+5-d;a.css("margin-top")}if("false"==a.attr("key-panel-main"))return!1;if(_KeyPanel.inputMainExtraOffset=e,_KeyPanel.$inputMain=a,e>0){var f="none"!=a.css("transform")?a.css("transform").split(","):"",g=0;""!=f&&(g=f[f.length-1].slice(0,-1)),g=Number(g)-e,_KeyPanel.$inputMain.css("-moz-transform","translateY("+g+"px)"),_KeyPanel.$inputMain.css("-webkit-transform","translateY("+g+"px)"),_KeyPanel.$inputMain.css("-ms-transform","translateY("+g+"px)"),_KeyPanel.$inputMain.css("transform","translateY("+g+"px)")}}}function j(){if(_KeyPanel&&_KeyPanel.$input&&_KeyPanel.$input.length>0){var a=_KeyPanel.$input.attr("value");if("DIV"===_KeyPanel.$input[0].tagName&&_KeyPanel.$inputEM.length>0&&(""===a||"undefined"==typeof a)&&_KeyPanel.$inputEM.html(_KeyPanel.inputPlaceholder),_KeyPanel.$input.removeClass("active"),_KeyPanel.$inputMain&&_KeyPanel.$inputMain.length>0&&_KeyPanel.inputMainExtraOffset>0){var b=_KeyPanel.$inputMain.css("transform").split(","),c=b[b.length-1].slice(0,-1);c=Number(c)+_KeyPanel.inputMainExtraOffset,_KeyPanel.$inputMain.css("-moz-transform","translateY("+c+"px)"),_KeyPanel.$inputMain.css("-webkit-transform","translateY("+c+"px)"),_KeyPanel.$inputMain.css("-ms-transform","translateY("+c+"px)"),_KeyPanel.$inputMain.css("transform","translateY("+c+"px)"),_KeyPanel.$inputMain=null,_KeyPanel.inputMainExtraOffset=0}}}require("../css/keyPanel.css");var k=require("appUtils"),l=require("keyType1");keyType2=require("keyType2"),keyType3=require("keyType3"),keyType4=require("keyType4"),keyType5=require("keyType5"),inputEvent=null,_KeyPanel=null,module.exports=a});
/*创建时间 2015-07-27 20:32:39 PM */