/*创建时间hSea 2015-07-27 20:32:39 PM */
define(function(require,exports,module){function a(a){var b=this,c=1,d=!1,e=null,f=null;this.setCssHW=function(){a.scroller.css({width:"100%",overflow:"hidden"}),a.scroller.children().css({"float":"left"});var b=a.perCount,c=a.scroller.children().length,d=a.wrapper.parent().width()/b,e=a.scroller.children(":eq(0)").height();a.scroller.children().width(d),a.scroller.children().height(e),a.scroller.width(d*c),a.scroller.height(e)},this.init=function(){this.setCssHW(),null!=f&&(f.destroy(),f=null),a.showTab&&a.tabDiv.children(":eq(0)").addClass("current active").siblings().removeClass("current active");var c=require("iscroll");f=new c(a.wrapper[0],{snap:!0,vScroll:!1,momentum:!1,hScrollbar:!1,vScrollbar:!1,onBeforeScrollStart:function(a){var b=a.explicitOriginalTarget?a.explicitOriginalTarget.nodeName.toLowerCase():a.target?a.target.nodeName.toLowerCase():"";"select"!=b&&"option"!=b&&"input"!=b&&"textarea"!=b&&this.absDistX>this.absDistY+5&&a.preventDefault()},onScrollMove:function(a){return this.absDistX>50&&this.absDistY>0&&this.absDistY<this.absDistX+20?(a.preventDefault(),!1):void 0},onScrollEnd:function(){if(a.showTab){var c=a.tabDiv;c.children(":eq("+this.currPageX+")").addClass("current active").siblings().removeClass("current active")}!d&&a.auto&&b.autoScroll(),a.onScrollEnd&&a.onScrollEnd();var e=this;e.touchEndTimeId&&clearTimeout(e.touchEndTimeId),e.touchEndTimeId=setTimeout(function(){e.absDistX=0,e.absDistY=0},200)}}),a.auto&&b.autoScroll()},this.destroy=function(){null!=f&&(f.destroy(),f=null),clearInterval(e),e=null,a.showTab&&a.tabDiv.children(":eq(0)").addClass("current active").siblings().removeClass("current active")},this.autoScroll=function(){d=!1,clearInterval(e),e=null,e=setInterval(function(){null!=f&&a.wrapper.is(":visible")&&(d=!0,f.currPageX>=f.pagesX.length-1?c=-1:f.currPageX<=0&&(c=1),f.currPageX+=c,f.scrollToPage(f.currPageX,0,800))},4e3)},this.getActivePage=function(){return f.currPageX},this.scrollToPage=function(a,b){f.scrollToPage(a,0,b)},this.init()}module.exports=a});
/*创建时间 2015-07-27 20:32:39 PM */