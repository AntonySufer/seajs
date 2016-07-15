define("ytg/scripts/ytgMatch/common/drowcharts",function(require, exports, module) {
	    var highCharts = require("highcharts");
	
	function DrowCharts(){
		this.service = new $.domain.Service();
	}
	
	// 加载曲线图
	function getHighcharts(seriesOptions,id,style)
	{ 
		colors = Highcharts.getOptions().colors;

		//设置语言风格
		Highcharts.setOptions({                                
			lang: {
				months: ['1月', '2月', '3月', '4月', '5月', '6月',
					'7月', '8月', '9月', '10月', '11月', '12月'],
				shortMonths: ['1月', '2月', '3月', '4月', '5月', '6月',
					'7月', '8月', '9月', '10月', '11月', '12月'],
				weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
			},
			global: {useUTC: false}
		});

		//画图
		createChart(seriesOptions,id,style);
	}
	
	 //画图
	function createChart(data1,id,style) {
		var idType = null;
		idType = $('#'+id);

		idType.highcharts({
			chart: {
				 height: style[1],
				 type: 'area',
				 backgroundColor: '#F9F9F9'//设置背景图
			},
			legend: {
				enabled: false  //不显示水平图例说明
			},
			credits: {        //不显示版权信息
		        enabled: false
		    },
		    title: {         //不显示标题
	            text: null  
	        },
	       
	        
			yAxis: {
				labels: {
					formatter: function() {
						return  this.value ;
					},
					align: 'right',
					x: -5
				},
				title:{          //不显示Y轴标题
					text:null
				},
				plotLines: [{
						value: 0,
						width: 2,
						color: 'silver'
				}]
			},
			xAxis: {
			    type: 'datetime',
			    tickPixelInterval: 150,  //X轴步伐
				dateTimeLabelFormats: {
					day: '%b%e日',
					week: '%b%e日',
					month: '%y年%b'
				}
			},
             plotOptions: {           //曲线配置
              series: {
                marker: {
                    enabled: false    //去掉曲线节点
                },
                lineWidth:2,
                lineColor :'#B8CAEE'//设置曲线的颜色
              }
            },
			series: [
				{
					color: '#D5E6F5',
					name: data1[1].name,
					data: data1[1].data,
					
					xDateFormat: '%Y-%m-%d'
				}
			],
			tooltip: {
				xDateFormat: '%Y-%m-%d',
				pointFormat: '<span style="color:#CAA65A;">{series.name}</span>: <b>{point.y}%</b><br/>',
				shared: true,      //一个提示框显示所有曲线节点
				crosshairs: true   //显示跟随直线
			}
		});
	}
	
	//饼状图数据计算realData:有色部分比值，color：有色部分颜色
	function drowpie(realData,color,id){
		//绘制饼图
		var data = [];
		data[0]={
			'data':	100-realData,
			'color':'#eee'
		};
		data[1]={
				'data':	realData,
				'color':color
		};
		createPie(data,id);
	}
	
	//画饼状图data：饼图数据域，id:画图id
	function createPie(data,id){
		var idType = null;
		idType = $('#'+id);
		idType.highcharts({
			chart : {
				plotBackgroundColor : null,
				plotBorderWidth : null,
				plotShadow : false,
				height: 46,
				width:46
			},
			credits: {        //不显示版权信息
		        enabled: false
		    },
			title : {
				text : null
			},
			tooltip : {
				enabled: false
			},
			plotOptions : {
				pie : {
					size: 40,
					innerSize: 20,
					dataLabels : {
						enabled : false
					}
				}
			},
			series : [ {
				type : 'pie',
				data : [ {y: data[0].data,color :data[0].color}, {y: data[1].data,color :data[1].color} ]
			} ]
		});
	}
	
	//画柱状图
	function drowColunm(data,id,style){
		var idType = null;
		idType = $('#'+id);
		idType.highcharts({
	            chart: {
	                type: 'column',
	                height:style['height'],
	                width:style['width'],
	               
	            },
	            title: {
	                text: null
	            },
	            credits: {        //不显示版权信息
			        enabled: false
			    },
			    tooltip: {
			    	   headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
			            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
			                '<td style="padding:0"><b>{point.y:.1f} 万</b></td></tr>',
			            footerFormat: '</table>',
			            shared: true,
			            useHTML: true

		        },
	            xAxis: {
	            	
	            	categories:data[0].data_x,
	            	  labels: {
	                      rotation: 90,
	                     
	               
	                  },
	                 
	            	
	            },
	            yAxis: {
	            	 min: 0,
	            	 step:1,
	            	 allowDecimals :false
	                
	            },
	            legend: {
	            	slantLabels:'1',
	            	layout:"vertical",
	            	verticalAlign: 'top',
	                enabled: false
	            },
	            series: [{
	                data: data[0].data_y,
	                name:data[0].name
	            }]
	        });
	}
	
	// 加载曲线图（根据seriesOptions的曲线数量加载）
	function getHighcharts2(seriesOptions,divObj,style)
	{ 
		colors = Highcharts.getOptions().colors;

		//设置语言风格
		Highcharts.setOptions({                                
			lang: {
				months: ['1月', '2月', '3月', '4月', '5月', '6月',
					'7月', '8月', '9月', '10月', '11月', '12月'],
				shortMonths: ['1月', '2月', '3月', '4月', '5月', '6月',
					'7月', '8月', '9月', '10月', '11月', '12月'],
				weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
			},
			global: {useUTC: false}
		});

		//画图
		createChart2(seriesOptions,divObj,style);
	}
	
	 //画图
	function createChart2(data1,divObj,style) {
		var idType = null;
		var series=[];
		idType = divObj;
		if(data1!=null&&data1.length>0){
			for(var i=0;i<data1.length;i++){
				var item={                //曲线数据列
					name: data1[i].name,
					data: data1[i].data,
					xDateFormat: '%Y-%m-%d'
				};
				series.push(item);
			}
		}
		idType.highcharts({
			chart: {
				height: style[1]
			},
			legend: {
				enabled: true,  //不显示水平图例说明
				align:"center"
			},
			credits: {        //不显示版权信息
		        enabled: false
		    },
		    title: {         //不显示标题
	            text: null  
	        },
			yAxis: {
				labels: {
					formatter: function() {
						return (this.value > 0 ? '+' : '') + this.value + '%';
					},
					align: 'right',
					x: -5
				},
				title:{          //不显示Y轴标题
					text:null
				},
				plotLines: [{
						value: 0,
						width: 2,
						color: 'silver'
				}]
			},
			xAxis: {
			    type: 'datetime',
			    tickPixelInterval: 150,  //X轴步伐
				dateTimeLabelFormats: {
					day: '%b%e日',
					week: '%b%e日',
					month: '%y年%b'
				}
			},
             plotOptions: {           //曲线配置
              series: {
                marker: {
                    enabled: false    //去掉曲线节点
                },
                lineWidth: 1.5
              }
            },
			series: series,
			tooltip: {
				xDateFormat: '%Y-%m-%d',
				pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}%</b><br/>',
				shared: true,      //一个提示框显示所有曲线节点
				crosshairs: true   //显示跟随直线
			}
		});
	}
	
	/**
	 *     data=    [
	                ['Firefox',   45.0],
	                ['IE',       26.8],
	                ['guge',       12.8],
	                ['Safari',    8.5],
	                ['Opera',     6.2],
	                ['Others',   0.7]
	                	            ]
	       style:div长高度，饼图长高度
	 */
	function drowpie2(divId,title,data,style,userClickFunc,moseOverFunc){
		if(style == null){
			style = [];
			style['c_height'] = 80;
			style['c_width'] = 80;
			style['p_size'] = 60;
			style['p_innersize'] = 30;
		}
		$('#'+divId).highcharts({
	        chart: {
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false,
	            height:style['c_height'],
				width:style['c_width']
	        },
	        legend: {		//图例：图表中的以下区块中用名字和颜色图表表示序列
            	enabled: true,
                y:10
            },
	        title: {
	            text: title
	        },
	        credits: {  
	        	  enabled: false  
	        },
	        tooltip: {
	    	    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
	    	    enabled:false
	        },
	        plotOptions: {
	            pie: {
	            	size: style['p_size'],
					innerSize: style['p_innersize'],
	                allowPointSelect: true,
	                cursor: 'pointer',
	                dataLabels: {
	                	distance:-20,
	                    enabled: true,
	                    format: '{point.percentage:.1f}%',
	                    style:{
	                    	fontWeight: "bold",
	                    	color:"#fff"
	                    }
	                },
	                showInLegend: true,
	                events:{ 
                        click: function(e) { 
                        	if(userClickFunc){
                        		userClickFunc(e.point.intid); 
                        	}
                        }
                    }
	            }
	        },
	        series: [{
	            type: 'pie',
	            name: '投入比例',
	            data: data
	        }]
	    });
	}
	
	/***
	 * hicharts画环形图
	 * @param syli 数据 50%
	 */
	function drowHuangCharts(syli,html_id)
	{  
		$('#'+html_id).highcharts({
        chart: {
          type:'pie',
          backgroundColor: '#F9F9F9'
        },
        title: {
            text: '<h1><center><span>'+syli+'</span>%</center></h1>',
            verticalAlign:'middle',
            y:-10,
            useHTML:true,
            fontFamily:"微软雅黑"
        
        },
        plotoptions:{
        	pie:{
        		shadow:true,
        		center:['50%','50%']
        	}
        },
        tooltip:{
        	enabled:false
        },
        labels:{
        	style:{
        		color:'#3DB19A',
        		fontWeight:"bold"
        	},
        	items:[{
        	html:'5.3%',
        	style:{
        		left:'620px',
        		fontSize:"40px",
        			top:'150px'
        				}
        	},
        	{
        		html:'收益4.2~4.5%',
        		style:{
            		left:'620px',
            		fontSize:"15px",
            			top:'180px'
            }
        	}]
        },
        series: [{
            name: 'pie',
            data: [{color:"#F18767",y:65,v:2323}],
        size:"90%",
        innerSize:'95%',
        dataLabels:
        	{
        	enabled:false
        	}
        }]
    });
	}
	
	
	/***
	 * hicharts画多个数据环形图
	 * @param drowdata 数据集
	 */
	function drowAnyCharts(datalist,html_id)
	{ 
		$('#'+html_id).highcharts({
        chart: {
          type:'pie',
         
        },
        title: {
            text: '',
            verticalAlign:'middle',
            y:-20,
            useHTML:true,
            fontFamily:"微软雅黑"
        
        },
        plotoptions:{
        	pie:{
        		shadow:true,
        		center:['50%','50%']
        	}
        },
        tooltip:{    	
        	 pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'//格式化输出收益和名称
        },
       
        series: [{
            name: 'pie',
    		data :[ {name:datalist[0].name,y: 20,color :datalist[0].color}, {name:datalist[1].name,y: 10,color :datalist[1].color},{name:datalist[2].name,y: 20,color :datalist[2].color},{name:datalist[3].name,y:50,color :datalist[3].color}],
    		size:"100%",
            innerSize:'85%',
             dataLabels:
        	{
        	enabled:false //线条指明数据与名称
        	}
        }]
    });
	}
	
	
	function drowColunm2(divId,title,data){
		//alert($.strToJson(data).colValues)
		$('#'+divId).highcharts({
	        chart: {
	            type: 'column'
	        },
	        title: {
	            text: title
	        },
	        xAxis: {
	            categories:eval(data.colNames)// ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
	        },
	        credits: {
	            enabled: false
	        },
	        series: [{
	            name: '收益',
	            data: eval(data.colValues)//[5, -3, 4, 7, 2]
	        }]
	    });
	}
	
	
	//画柱状图(包含负值的柱状图)
	function drowColunm3(data,id,style){
		var idType = null;
		idType = $('#'+id);
		idType.highcharts({
	            chart: {
	                type: 'column',
	                height:style['height'],
	                width:style['width']
	            },
	            title: {
	                text: null
	            },
	            credits: {        //不显示版权信息
			        enabled: false
			    },
			    tooltip: {
		    	    pointFormat: '{series.name}: <b>{point.y:.1f}%</b>',
		    	    enabled:true
		        },
	            xAxis: {
	                type: 'category',
	                labels: {
	                    rotation: style['rotation'] == '' ? 0 : style['rotation'], 
	                    style: { 
                            fontSize: '13px', 
                            fontFamily: 'Verdana, sans-serif'
                       }
	                }
	            },
	            yAxis: {
	                title: {
	                    text: null
	                },
	                allowDecimals:true,
	                tickInterval:style['tickInterval'] == '' ? null : style['tickInterval'],
	                gridLineColor: '#CCCCCC',    //去掉表格刻度
	                labels: {
	                	enabled:true   
	                }
	            },
	            legend: {
	                enabled: false
	            },
	            series: [{
	                data: data,
	                name:style['name']
	            }]
	        });
	}
	
	
	/**
	 * 释放操作
	 */
	DrowCharts.prototype.destroy = function(){
		this.service.destroy();
	};
	
    /**
	 * 实例化对象
	 */
	function getInstance(){
		return new DrowCharts();
	}
	
	var drowCharts = {
		"getInstance" : getInstance,
		"getHighcharts":getHighcharts,
		"getHighcharts2":getHighcharts2,
		"drowpie" : drowpie,
		"drowpie2":drowpie2,
		"drowColunm" :drowColunm,
		"drowColunm2" :drowColunm2,
	    "drowHuangCharts":drowHuangCharts,
	    "drowAnyCharts":drowAnyCharts,
	    "drowColunm3":drowColunm3
	};
	
	// 暴露对外的接口
	module.exports = drowCharts;
});