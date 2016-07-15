/**
 * 我的设置(修改图像)
 */
define("ytg/scripts/demo/setImg", function(require, exports, module) {
	var appUtils = require("appUtils"), 
	    layerUtils = require("layerUtils"), 
        gconfig = require("gconfig"),
        
        userService = require("userService"),
		
		pageCode = "demo/setImg", 
		_pageId = "#demo_setImg ";
	
	//插件
	require("ytg/scripts/plugins/imgcompress/scripts/jquery.make-thumb.js");
	require("ytg/scripts/plugins/form/jquery-form.js");
	
	//全局变量
	var user_type = null;
	var user_id = null;
	//上传图像
	var img_data = null;
	var realPic = null;
	
	/**
	 * 初始化
	 */
	function init() {
		user_id = appUtils.getSStorageInfo('userId',true);
		user_type = appUtils.getSStorageInfo('userType',true);
		
		/** 获取基本资料（用户的小图像） */
		getUserInfo();
	}
	
	/**
	 * 事件绑定
	 */
	function bindPageEvent() {
		//头部返回
		appUtils.bindEvent($(_pageId + ".icon_back"), function(e) {
			if(user_type == 0){
				appUtils.pageInit(pageCode,"userSpace/index");
			}
			else{
				appUtils.pageInit(pageCode,"adviserSpace/index");
			}
		});
		
		//头部导航栏(资料;密码;图像)
		appUtils.bindEvent($(_pageId + ".row-1"), function(e) {
			var index = $(this).index();
			if(index == 0){
				appUtils.pageInit(pageCode,"userSpace/mySetting/setInfo");
			}
			else if(index ==1){
				appUtils.pageInit(pageCode,"userSpace/mySetting/setPwd");
			}
			else if(index ==2 ){
				//appUtils.pageInit(pageCode,"userSpace/mySetting/setImg");
			}
		});
		
		//选择文件
		appUtils.bindEvent($(_pageId + ".change_file_btn"), function(e){
			//alert("选择文件");
			$(_pageId+" #btn1").remove();
			$(_pageId+" .my_page_con").append('<input type="file" accept="image/*,camera" capture="camera"  id="btn1" style="width:0px;height:0px;position:absolute;top:0;left:0;"/>');
			setTimeout(function(){
				start_init();
				$(_pageId+" #btn1").click( function (e) {

				}).trigger("click");
			}, 200);
		});
		
		//上传图像
		appUtils.bindEvent($(_pageId + ".login_btn"), function(e){
			//alert("上传");
			//uploadTempImg();//上传临时图片
			//uploadImg(); //上传图像
			uploadMobileImg(); //上传手机图像
		});
	}
	
	//***************************【初始化方法】***********************************//
	/**
	 * 获取用户基本资料
	 * */
	function getUserInfo(){
		var param = {
			"user_id" : user_id	
		};
		userService.findUserInfoById(param,function callBack(resultVo){
			if(Number(resultVo.error_no) == 0){
				//layerUtils.iMsg(0,"查询用户信息成功");
				var result = resultVo.results[0];
				var img_small = result.face_image_small;
				if(img_small != null && img_small != ""){
					$(_pageId + "#userImage").attr("src",img_small);
				}
				else{
					$(_pageId + "#userImage").attr("src","images/my_tx2.png");
				}
			}
			else{
				layerUtils.iAlert("查询用户信息失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	//************************* 绑定时间方法 ***********************************//
	
	function start_init()
	{
		$(function() {
		    var $file = $('#btn1');
		    $file.makeThumb({
		    	width:500,
		    	height:500,
		        success: function(dataURL, tSize, file, sSize, fEvt) {
		    		// 图片上传至服务器
		    	    img_data = dataURL.split(",")[1]; //图片的base64编码
		    	    //img_data = dataURL; //图片的base64编码
		    	    $('.tx_pic').html('<img src="'+dataURL+'"  class="circle" id="userImage"/>');
			    	layerUtils.iLoading(false);
			    	//alert(dataURL);
			    	//uploadTempImg(); //上传临时图片
		        },error:function(obj,state,e){
		        	layerUtils.iLoading(false);
		        	if(state==8){
		        		layerUtils.iAlert("上传文件格式不正确，请重新上传",0,function(){});
		        	}
		        }
		    });
		});
	}
	
	//上传临时图片
	function uploadTempImg(){
		var form = $("form[name=form9]");
		var options = {
			url : gconfig.global.domain
					+ "/servlet/UploadUserImage?function=SetPortfolioImage&type=1",
			type : 'post',
			success : function(data) {
				var jsondata = eval("("+data+")")[0];
				if (jsondata.step == "2") {
				
					//设置图片路径
					//picUrl = jsondata.Picurl+"?time="+ new Date().getTime();
					alert(jsondata.Picurl);
				} else {
					layerUtils.iAlert(jsondata.message,-1);
					//canUpload=true;
					//$(space+"#uploadPic a").html("上传");
				}
			}
		};
		//canUpload=false;
		//$(space+"#uploadPic a").html("正在上传...");
		form.ajaxSubmit(options);
	}
	
	/**
	 * 上传图像
	 * */
	function uploadImg(){
		$(_pageId + "#picture").val(img_data);
		var form = $("form[name=form1]");
		var options = {
				url : gconfig.global.domain
				+ "/servlet/UploadUserImage?function=SetPortfolioImage&type=2",
				type : 'post',
				success : function(data) {
					var jsondata = eval("("+data+")")[0];
					var picUrl = jsondata.Picurl;
					alert(picUrl);
					//step==3保存成功
					if (jsondata.step == "3") {
						alert("成功");
						//updateUserImage();
					}else {
						layerUtils.iAlert(jsondata.message,-1,function(){
							//图片保存失败要重新上传
						});
						//canSave=true;
						//$(pageId+" #saveFacePic a").html("保存");
					}
				}	
		};
		//$(pageId+" #saveFacePic a").html("处理中...");
		//异步提交表单
		form.ajaxSubmit(options);
	}
	
	/**
	 * 上传手机图像
	 * */
	function uploadMobileImg(){
		$(_pageId + "#pictureBase64").val(img_data);
		$(_pageId + "#userID").val(user_id);
		var form = $("form[name=form1]");
		var options = {
				url : gconfig.global.domain
				+ "/servlet/UploadMobileImage?function=SetUserImage",
				type : 'post',
				success : function(data) {
					var jsondata = eval("("+data+")")[0];
					realPic = jsondata.Picurl;
					alert(realPic);
					//step==3保存成功
					if (jsondata.result == "ture") {
						alert("成功");
						updateUserImage();
					}else {
						layerUtils.iAlert(jsondata.message,-1,function(){
							//图片保存失败要重新上传
						});
						//canSave=true;
						//$(pageId+" #saveFacePic a").html("保存");
					}
				}	
		};
		//$(pageId+" #saveFacePic a").html("处理中...");
		//异步提交表单
		form.ajaxSubmit(options);
	}
	
	//上传用户图像
	function updateUserImage(){
		var smallImage="/userImage/small/"+realPic;
		var bigImage="/userImage/"+realPic;
		var completeSaveUserInfo = function (resultVo){
			if(resultVo.error_no=="0"){
				layerUtils.iAlert("上传成功",0,function(){
					appUtils.pageInit(pageCode,pageCode);
					//$(".photo img").attr("src",bigImage+ "?r="+new Date().getTime());
		
					//location.reload();
					//location.href="/userSpace";
				});
			}else{
				if(resultVo.error_no == "-999"){
				   // $.redirect("sso/login");
					alert("-999");
				}else if(resultVo.error_no!=-997){
					layerUtils.iAlert(resultVo.error_no,-1);
				}
			}
		};
		var param = {
				"user_id" : user_id,
				"bigImage":bigImage,
				"smallImage":smallImage
		};
		userService.updateUserImage(param,completeSaveUserInfo);
	}
	//*********************************************************************//
	
	/**
	 * 销毁
	 */
	function destroy() {
	}

	var userSpace_mySetting_setImg = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = userSpace_mySetting_setImg;
});