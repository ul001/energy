bui.ready(function () {
    var storage = bui.storage();
    //时间控件
    var time = tool.initDate("YMD", new Date());
    var reportType = "DD";
    var buildId;
    // time = new Date(time.replace(/\-/g, "\/"));
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
        min: '2000/01/01 00:00:00',
        onChange: function (value) {},
        callback: function (e) {
            console.log(e.target);
            console.log(this.value());
            time = this.value();
            initData();
        }
        // 如果不需要按钮,设置为空
        // buttons: [{name:"取消"}]
    });

    //切换按钮 日月年
    var showtimeForElectSum = tool.initDate("YMD", new Date());

    $(".dateBtn").on("click", function () {
        var obj = $(this);
        if (obj.val() == "DD") {
            showtimeForElectSum = tool.initDate("YMD", new Date());
            uiPickerdate.formatValue("yyyy-MM-dd");
            uiPickerdate.cols({
                hour: "none",
                minute: "none",
                second: "none"
            })
            uiPickerdate.value(showtimeForElectSum);

        } else if (obj.val() == "MM") {
            showtimeForElectSum = tool.initDate("YM", new Date());
            uiPickerdate.formatValue("yyyy-MM");
            uiPickerdate.cols({
                date: "none",
                hour: "none",
                minute: "none",
                second: "none"
            })
            uiPickerdate.value(showtimeForElectSum);

        } else {
            // 弹出的时候,也不要显示对应的时分秒
            uiPickerdate.formatValue("yyyy");
            uiPickerdate.cols({
                month: "none",
                date: "none",
                hour: "none",
                minute: "none",
                second: "none"
            })
        }
        $(this)
            .addClass("btn_active")
            .siblings("button")
            .removeClass("btn_active");
        reportType = obj.val();
        initQuick(reportType);
        initData();
    });

    function initQuick(type) {
        $("#datePre").unbind("click");
        $("#dateNext").unbind("click");
        if (type == "DD") {
            $("#datePre").click(function () {
                var selectDate = new Date($("#datepicker_input").val().replace(/\-/g, "\/"));
                var preDate = new Date(selectDate.getTime() - 24 * 60 * 60 * 1000);
                $("#datepicker_input").val(preDate.getFullYear() + "-" + ((preDate.getMonth()) < 9 ? ("0" + (preDate.getMonth() + 1)) : (preDate.getMonth() + 1)) + "-" + (preDate.getDate() < 10 ? ("0" + preDate.getDate()) : (preDate.getDate())));
                initData();
            });
            $("#dateNext").click(function () {
                var d = new Date();
                var nowDate = new Date(d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate());
                var selectDate = new Date($("#datepicker_input").val().replace(/\-/g, "\/"));
                if (selectDate < nowDate) {
                    var nextDate = new Date(selectDate.getTime() + 24 * 60 * 60 * 1000);
                    $("#datepicker_input").val(nextDate.getFullYear() + "-" + ((nextDate.getMonth()) < 9 ? ("0" + (nextDate.getMonth() + 1)) : (nextDate.getMonth() + 1)) + "-" + (nextDate.getDate() < 10 ? ("0" + nextDate.getDate()) : (nextDate.getDate())));
                    initData();
                } else {
                    return;
                }
            });
        } else if (type == "MM") {
            $("#datePre").click(function () {
                var selectDate = new Date(($("#datepicker_input").val() + "-01").replace(/\-/g, "\/"));
                var preDate = new Date(selectDate.setMonth(selectDate.getMonth() - 1));
                $("#datepicker_input").val(preDate.getFullYear() + "-" + ((preDate.getMonth()) < 9 ? ("0" + (preDate.getMonth() + 1)) : (preDate.getMonth() + 1)));
                initData();
            });
            $("#dateNext").click(function () {
                var d = new Date();
                var nowDate = new Date(d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + '01');
                var selectDate = new Date(($("#datepicker_input").val() + "-01").replace(/\-/g, "\/"));
                if (selectDate < nowDate) {
                    var nextDate = new Date(selectDate.setMonth(selectDate.getMonth() + 1));
                    $("#datepicker_input").val(nextDate.getFullYear() + "-" + ((nextDate.getMonth()) < 9 ? ("0" + (nextDate.getMonth() + 1)) : (nextDate.getMonth() + 1)));
                    initData();
                } else {
                    return;
                }
            });
        } else if (type == "YY") {
            $("#datePre").click(function () {
                var selectDate = new Date($("#datepicker_input").val().replace(/\-/g, "\/"));
                var preDate = new Date(selectDate.setFullYear(selectDate.getFullYear() - 1));
                $("#datepicker_input").val(preDate.getFullYear());
                initData();
            });
            $("#dateNext").click(function () {
                var d = new Date();
                var nowDate = new Date((d.getFullYear() + "-01-01").replace(/\-/g, "\/"));
                var selectDate = new Date(($("#datepicker_input").val() + "-01" + "-01").replace(/\-/g, "\/"));
                if (selectDate < nowDate) {
                    var nextDate = new Date(selectDate.setFullYear(selectDate.getFullYear() + 1));
                    $("#datepicker_input").val(nextDate.getFullYear());
                    initData();
                } else {
                    return;
                }
            });
        }
    }

    //筛选建筑
    // 右边出来对话框
    var uiDialogRight = bui.dialog({
        id: "#dialogRight",
        effect: "fadeInRight",
        position: "right",
        fullscreen: true,
        buttons: []
    });

    try {
        var saveBuild = JSON.parse(storage.get("build"));
        $(".bui-bar-main").html(saveBuild.name);
    } catch (e) {
        uiDialogRight.open();
    }

    $("#searchA").on("click", function () {
        uiDialogRight.open();
    });

    $("#searchB").on("click", function () {
        uiDialogRight.open();
    });

    //绘图
    function initBar($container, time, j, f, p, g, barData, sum, y) {
        var bar = echarts.init(document.getElementById('chartDosage'));
        var option = {
            // title: [{
            //     text: Operation['ui_donut'],
            //     subtext: y == "￥" ? (Operation['ui_totalsum'] + '：' + y + sum) : (Operation['ui_totalsum'] + '：' + sum + y),
            //     textStyle: {
            //         fontWeight: 'small'
            //     },
            //     // textAlign: 'center',
            //     right: '10',
            //     top: 10
            // }],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: [Operation['ui_jian'], Operation['ui_feng'], Operation['ui_ping'], Operation['ui_gu']],
                bottom: 80
            },
            grid: {
                //调整柱状图位置
                top: '10%',
                left: '13%',
                right: '5%',
                bottom: '55%'
            },
            xAxis: {
                type: 'category',
                data: time
            },
            yAxis: {
                name: y,
                type: 'value'
            },
            toolbox: {
                left: 'right',
                top: '5%',
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
            dataZoom: [{
                startValue: time[0]
            }, {
                type: 'inside',
                // bottom: "auto"
            }],
            series: [{
                    name: Operation['ui_proportion'],
                    type: 'pie',
                    radius: ['20%', '45%'],
                    center: ['50%', '75%'],
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
                }, {
                    name: Operation['ui_jian'],
                    type: 'bar',
                    stack: Operation['ui_consumeelecval'],
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#c23531'
                        }
                    },
                    data: j
                },
                {
                    name: Operation['ui_feng'],
                    type: 'bar',
                    stack: Operation['ui_consumeelecval'],
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#F36757'
                        }
                    },
                    data: f
                },
                {
                    name: Operation['ui_ping'],
                    type: 'bar',
                    stack: Operation['ui_consumeelecval'],
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#2EC3D9'
                        }
                    },
                    data: p
                },
                {
                    name: Operation['ui_gu'],
                    type: 'bar',
                    stack: Operation['ui_consumeelecval'],
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#92D401'
                        }
                    },
                    data: g
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