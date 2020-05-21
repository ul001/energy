bui.ready(function () {
    // 带按钮
    var uiPickerdate = bui.pickerdate({
        handle: "#datepicker_input",
        bindValue: true, // 1.5.3 新增, 修改的值会自动绑定到 handle, 不再需要自己去绑定
        // input 显示的日期格式
        formatValue: "yyyy-MM-dd",
        cols: {
            hour: "none",
            minute: "none",
            second: "none"
        },
        onChange: function (value) {},
        callback: function (e) {
            console.log(e.target)
            console.log(this.value())

        },
        // 如果不需要按钮,设置为空
        // buttons: [{name:"取消"}]
    });


    function initBar($container, time, j, f, p, g, barData, sum, y) {
        var bar = echarts.init(document.getElementById('pie'));
        var option = {
            title: [{
                text: Operation['ui_donut'],
                subtext: y == "￥" ? (Operation['ui_totalsum'] + '：' + y + sum) : (Operation['ui_totalsum'] + '：' + sum + y),
                textStyle: {
                    fontWeight: 'small'
                },
                // textAlign: 'center',
                right: '10',
                top: 10
            }],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: [Operation['ui_jian'], Operation['ui_feng'], Operation['ui_ping'], Operation['ui_gu']],
                bottom: 50
            },
            grid: {
                top: '51%',
                left: '13%',
                right: '5%',
                bottom: '20%'
            },
            // xAxis: {
            //     type: 'category',
            //     data: time
            // },
            // yAxis: {
            //     name: y,
            //     type: 'value'
            // },
            toolbox: {
                left: 'right',
                top: '45%',
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    dataView: {
                        readOnly: true
                    },
                    restore: {}
                }
            },
            // dataZoom: [{
            //     startValue: time[0]
            // }, {
            //     type: 'inside'
            // }],
            series: [
                // {
                //     name: Operation['ui_jian'],
                //     type: 'bar',
                //     stack: Operation['ui_consumeelecval'],
                //     label: {
                //         normal: {
                //             show: false,
                //             position: 'insideRight'
                //         }
                //     },
                //     itemStyle: {
                //         normal: {
                //             color: '#c23531'
                //         }
                //     },
                //     data: j
                // },
                // {
                //     name: Operation['ui_feng'],
                //     type: 'bar',
                //     stack: Operation['ui_consumeelecval'],
                //     label: {
                //         normal: {
                //             show: false,
                //             position: 'insideRight'
                //         }
                //     },
                //     itemStyle: {
                //         normal: {
                //             color: '#F36757'
                //         }
                //     },
                //     data: f
                // },
                // {
                //     name: Operation['ui_ping'],
                //     type: 'bar',
                //     stack: Operation['ui_consumeelecval'],
                //     label: {
                //         normal: {
                //             show: false,
                //             position: 'insideRight'
                //         }
                //     },
                //     itemStyle: {
                //         normal: {
                //             color: '#2EC3D9'
                //         }
                //     },
                //     data: p
                // },
                // {
                //     name: Operation['ui_gu'],
                //     type: 'bar',
                //     stack: Operation['ui_consumeelecval'],
                //     label: {
                //         normal: {
                //             show: false,
                //             position: 'insideRight'
                //         }
                //     },
                //     itemStyle: {
                //         normal: {
                //             color: '#92D401'
                //         }
                //     },
                //     data: g
                // },
                {
                    name: Operation['ui_proportion'],
                    type: 'pie',
                    radius: ['20%', '45%'],
                    center: ['50%', '25%'],
                    label: {
                        normal: {
                            position: 'inner',
                            formatter: function (data) {
                                return data.name + '\n' + data.value + '\n' + '(' + data.percent.toFixed(1) + '%)';
                            }
                        }
                    },
                    color: ['#c23531', '#F36757', '#2EC3D9', '#92D401'],
                    data: barData
                }
            ]
        };
        bar.setOption(option);
    }

    initBar($("#lineChart"), ["05-01"], ["2.00"], ["4.00"], ["3.00"], ["1.00"], [{
        value: "0",
        name: "尖"
    }, {
        value: "4356",
        name: "峰"
    }, {
        value: "6902",
        name: "平"
    }, {
        value: "5554",
        name: "谷"
    }], 1682, 'kW·h');

});