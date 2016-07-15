define("ytg/scripts/common/drowcharts",function(require, exports, module) {
	//var highCharts = require("/plugins/higtchart/highcharts");
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
				height: style[1]
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
			series: [{                //曲线数据列
					name: data1[0].name,
					data: data1[0].data,
					xDateFormat: '%Y-%m-%d'
				},
				{
					color: '#ff7e00',
					name: data1[1].name,
					data: data1[1].data,
					xDateFormat: '%Y-%m-%d'
				}
			],
			tooltip: {
				xDateFormat: '%Y-%m-%d',
				pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}%</b><br/>',
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
				height: 80,
				width:80
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
					size: 60,
					innerSize: 30,
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
	function drowColunm(data,id){
		var idType = null;
		idType = $('#'+id);
		idType.highcharts({
	            chart: {
	                type: 'column',
	                height: 152,
	                width:500
	            },
	            title: {
	                text: null
	            },
	            credits: {        //不显示版权信息
			        enabled: false
			    },
	            xAxis: {
	                type: 'category',
	                labels: {
	                    rotation: 0,
	                    
	                    align: 'center',
	                    style: {
	                        fontSize: '13px',
	                        fontFamily: 'Verdana, sans-serif'
	                    }
	                }
	            },
	            yAxis: {
	                min: 0,
	                title: {
	                    text: null
	                },
	                gridLineColor: null,    //去掉表格刻度
	                labels: {
	                	enabled:false   
	                }
	            },
	            legend: {
	                enabled: false
	            },
	            tooltip: {
	                pointFormat: '{point.y:.1f}%'
	            },
	            series: [{
	                data: data,
	                dataLabels: {
	                    enabled: true,
	                    rotation: 0,
	                    color: '#FFFFFF',
	                    align: 'center',
	                    style: {
	                        fontSize: '13px',
	                        fontFamily: 'Verdana, sans-serif',
	                        textShadow: '0 0 3px black'
	                    },
	                    format: '{point.y:.1f}%'   //格式化输出数字
	                }
	            
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
				}
				series.push(item);
			}
		}
		idType.highcharts({
			chart: {
				height: style[1]
			},
			legend: {
				enabled: true  //不显示水平图例说明
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
			    tickPixelInterval: 100,  //X轴步伐
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
	 */
	function drowpie2(divId,title,data){
		$('#'+divId).highcharts({
	        chart: {
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false
	        },
	        title: {
	            text: title
	        },
	        credits: {  
	        	  enabled: false  
	        },
	        tooltip: {
	    	    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	        },
	        plotOptions: {
	            pie: {
	                allowPointSelect: true,
	                cursor: 'pointer',
	                dataLabels: {
	                    enabled: true,
	                    color: '#000000',
	                    connectorColor: '#000000',
	                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
	                }
	            }
	        },
	        series: [{
	            type: 'pie',
	            name: '',
	            data: data

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
		"drowColunm2" :drowColunm2
	};
	
	// 暴露对外的接口
	module.exports = drowCharts;
});