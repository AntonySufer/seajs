/*创建时间hSea 2015-07-27 20:32:39 PM */
define(function(require,exports,module){function a(a){var b=this,c=null;this.setCssHW=function(){for(var b=a.wPerColumn,c=a.container.children(":eq(0)").children(":eq(0)").children().length,d=a.wrapper.children(":eq(0)").children(":eq(0)").children().length,e=0,f=0,g=0;c>g;g++)e+=b?b[g]:80,e+=1;a.wrapper.css("left",e+"px"),a.wrapper.width(a.container.width()-e);for(var g=0;d>g;g++)f+=b?b[g+c]:80,g!=d-1&&(f+=1);a.wrapper.children(":eq(0)").width(f),a.container.children(":eq(0)").children().each(function(){$(this).children().each(function(c){$(this).width(b?b[c]:80),a.hasBorder===!1&&$(this).css("border-right-width","0")})}),a.wrapper.children(":eq(0)").children().each(function(){$(this).children().each(function(d){$(this).width(b?b[d+c]:80),a.hasBorder===!1&&$(this).css("border-right-width","0")})})},this.init=function(){b.setCssHW(),null!=c&&(c.destroy(),c=null);var d=require("iscroll");c=new d(a.wrapper[0],{snap:!0,vScroll:!1,hScrollbar:!1,vScrollbar:!1,onBeforeScrollStart:function(a){var b=a.explicitOriginalTarget?a.explicitOriginalTarget.nodeName.toLowerCase():a.target?a.target.nodeName.toLowerCase():"";"select"!=b&&"option"!=b&&"input"!=b&&"textarea"!=b&&this.absDistX>this.absDistY+5&&a.preventDefault()},onScrollEnd:function(){var b=c.x,d=a.wrapper.width(),e=a.wrapper.children(":eq(0)").width();b==d-e?a.wrapper.addClass("over"):a.wrapper.removeClass("over");var f=this;f.touchEndTimeId&&clearTimeout(f.touchEndTimeId),f.touchEndTimeId=setTimeout(function(){f.absDistX=0,f.absDistY=0},200)}}),a.container.find(".isc_item").show()},this.destroy=function(){null!=c&&(c.destroy(),c=null)},b.init()}module.exports=a});
/*创建时间 2015-07-27 20:32:39 PM */