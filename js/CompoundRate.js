bui.ready(function () {
    var storage = bui.storage();
    // 右边出来对话框
    var uiDialogRight = bui.dialog({
        id: "#dialogRight",
        effect: "fadeInRight",
        position: "right",
        fullscreen: true,
        buttons: []
    });
    var compoundCode = '01000';
    var typeC = 'c';
    var saveBuild;
    var selectCurid;
    var fengRate = '';
    var pingRate = '';
    var guRate = '';
    var getParams = bui.getPageParams();

    getParams.done(function (result) {
        console.log(result);
        selectCurid = result.curid;
        $(".bui-bar-main").html(result.curname);
        if (selectCurid == null || selectCurid == undefined) {
            try {
                var curObj = JSON.parse(storage.get("curObj"));
                selectCurid = curObj.id;
                $(".bui-bar-main").html(curObj.name);
            } catch (e) {
                uiDialogRight.open();
            };
        }
        // {id:"page2"}
    });
    try {
        saveBuild = JSON.parse(storage.get("build"));
    } catch (e) {};

    $('#btnOpenFilter').on("click", function () {
        uiDialogRight.open();
    });

    // $(".top-class .span1").on("click", function () {
    //     $(this).addClass("active").siblings().removeClass("active");
    //     uiList.empty();
    //     // 重新初始化数据
    //     uiList.init({
    //         page: 1,
    //         data: {
    //             "keyWord": $("#mainSearchInput").val(),
    //             "code": $(".secord-class .bui-btn.selected").attr("data-value"),
    //             "type": $(".top-class .active").attr("data-type"),
    //         }
    //     });
    // });

    // $(".secord-class .bui-btn").on("click", function () {
    //     $(this).addClass("selected").siblings().removeClass("selected");
    //     uiList.empty();
    //     // 重新初始化数据
    //     uiList.init({
    //         page: 1,
    //         data: {
    //             "keyWord": $("#mainSearchInput").val(),
    //             "code": $(".secord-class .bui-btn.selected").attr("data-value"),
    //             "type": $(".top-class .active").attr("data-type"),
    //         }
    //     });
    // });

    // $($(".top-class li")[0]).addClass("active");
    // $($(".secord-class .bui-btn")[0]).addClass("selected");

    var uiPickerdate = bui.pickerdate({
        handle: "#datepicker_input",
        bindValue: true, // 1.5.3 新增, 修改的值会自动绑定到 handle, 不再需要自己去绑定
        // input 显示的日期格式
        formatValue: "yyyy-MM",
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
            getMainData(selectCurid);
        }
        // 如果不需要按钮,设置为空
        // buttons: [{name:"取消"}]
    });

    var time = tool.initDate("YMD", new Date());
    var reportType = "MM";
    //切换按钮 日月年
    var showtimeForElectSum = tool.initDate("YMD", new Date());
    initQuick(reportType);

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
        getMainData(selectCurid);
    });

    function initQuick(type) {
        $("#datePre").unbind("click");
        $("#dateNext").unbind("click");
        if (type == "DD") {
            $("#datePre").click(function () {
                var selectDate = new Date($("#datepicker_input").val().replace(/\-/g, "\/"));
                var preDate = new Date(selectDate.getTime() - 24 * 60 * 60 * 1000);
                $("#datepicker_input").val(preDate.getFullYear() + "-" + ((preDate.getMonth()) < 9 ? ("0" + (preDate.getMonth() + 1)) : (preDate.getMonth() + 1)) + "-" + (preDate.getDate() < 10 ? ("0" + preDate.getDate()) : (preDate.getDate())));
                getMainData(selectCurid);
            });
            $("#dateNext").click(function () {
                var d = new Date();
                var nowDate = new Date(d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate());
                var selectDate = new Date($("#datepicker_input").val().replace(/\-/g, "\/"));
                if (selectDate < nowDate) {
                    var nextDate = new Date(selectDate.getTime() + 24 * 60 * 60 * 1000);
                    $("#datepicker_input").val(nextDate.getFullYear() + "-" + ((nextDate.getMonth()) < 9 ? ("0" + (nextDate.getMonth() + 1)) : (nextDate.getMonth() + 1)) + "-" + (nextDate.getDate() < 10 ? ("0" + nextDate.getDate()) : (nextDate.getDate())));
                    getMainData(selectCurid);
                } else {
                    return;
                }
            });
        } else if (type == "MM") {
            $("#datePre").click(function () {
                var selectDate = new Date(($("#datepicker_input").val() + "-01").replace(/\-/g, "\/"));
                var preDate = new Date(selectDate.setMonth(selectDate.getMonth() - 1));
                $("#datepicker_input").val(preDate.getFullYear() + "-" + ((preDate.getMonth()) < 9 ? ("0" + (preDate.getMonth() + 1)) : (preDate.getMonth() + 1)));
                getMainData(selectCurid);
            });
            $("#dateNext").click(function () {
                var d = new Date();
                var nowDate = new Date(d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + '01');
                var selectDate = new Date(($("#datepicker_input").val() + "-01").replace(/\-/g, "\/"));
                if (selectDate < nowDate) {
                    var nextDate = new Date(selectDate.setMonth(selectDate.getMonth() + 1));
                    $("#datepicker_input").val(nextDate.getFullYear() + "-" + ((nextDate.getMonth()) < 9 ? ("0" + (nextDate.getMonth() + 1)) : (nextDate.getMonth() + 1)));
                    getMainData(selectCurid);
                } else {
                    return;
                }
            });
        } else if (type == "YY") {
            $("#datePre").click(function () {
                var selectDate = new Date($("#datepicker_input").val().replace(/\-/g, "\/"));
                var preDate = new Date(selectDate.setFullYear(selectDate.getFullYear() - 1));
                $("#datepicker_input").val(preDate.getFullYear());
                getMainData(selectCurid);
            });
            $("#dateNext").click(function () {
                var d = new Date();
                var nowDate = new Date((d.getFullYear() + "-01-01").replace(/\-/g, "\/"));
                var selectDate = new Date(($("#datepicker_input").val() + "-01" + "-01").replace(/\-/g, "\/"));
                if (selectDate < nowDate) {
                    var nextDate = new Date(selectDate.setFullYear(selectDate.getFullYear() + 1));
                    $("#datepicker_input").val(nextDate.getFullYear());
                    getMainData(selectCurid);
                } else {
                    return;
                }
            });
        }
    }

    function getMainData(curid) {
        $("#mainScrollList").empty();
        var reportTypeStr = $(".btn_active").attr("value");
        var timeUnit;
        var dataName1;
        var dataName2;
        var timeParam;
        if (reportType == "DD") {
            timeUnit = "时";
            dataName1 = "今日";
            dataName2 = "昨日";
            timeParam = $("#datepicker_input").val();
        } else if (reportType == "MM") {
            timeUnit = "日";
            dataName1 = "当月";
            dataName2 = "上月";
            timeParam = $("#datepicker_input").val() + "-01";
        } else if (reportType == "YY") {
            timeUnit = "月";
            dataName1 = "今年";
            dataName2 = "去年";
            timeParam = $("#datepicker_input").val() + "-01-01";
        }
        var param = {
            id: saveBuild.id,
            // code: $(".secord-class .bui-btn.selected").attr("data-value"),
            // type: $(".top-class .active").attr("data-type"),
            reportType: reportTypeStr,
            time: timeParam,
            ids: curid,
        };
        energyObj.getDataByAjax("GET", "/api/MultiRate", param, function (data) {
            var html = "";
            var days = [];
            var months = [];
            var names, dataAxis, series, values;
            var FList = [];
            var PList = [];
            var GList = [];
            var fSum = 0;
            var pSum = 0;
            var gSum = 0;
            switch (reportType) {
                case 'MM':
                    for (let day = 1; day < 32; day++) {
                        days.push(day + '日');
                        //获取当日数据
                        var todayArr = [];
                        data.forEach(function (el, index) {
                            var innerTime = new Date(el.time);
                            if (day == innerTime.getDate()) {
                                todayArr.push(el);
                            }
                        });
                        if (todayArr.length == 0) {
                            FList.push(0)
                            PList.push(0)
                            GList.push(0)
                        } else if (todayArr.length > 0) {
                            for (let i = 0; i < todayArr.length; i++) {
                                if (todayArr[i].paramName == '峰电能') {
                                    FList.push(todayArr[i].value)
                                    fSum += todayArr[i].value;
                                }
                                if (todayArr[i].paramName == '平电能') {
                                    PList.push(todayArr[i].value);
                                    pSum += todayArr[i].value;
                                }
                                if (todayArr[i].paramName == '谷电能') {
                                    GList.push(todayArr[i].value);
                                    gSum += todayArr[i].value;
                                }
                            }
                        }
                        dataAxis = days;
                        names = ['峰电能', '平电能', '谷电能'];
                        series = [{
                                name: '峰电能',
                                type: 'bar',
                                stack: '电能值',
                                data: FList
                            },
                            {
                                name: '平电能',
                                type: 'bar',
                                stack: '电能值',
                                data: PList
                            },
                            {
                                name: '谷电能',
                                type: 'bar',
                                stack: '电能值',
                                data: GList
                            },
                        ];
                        values = [{
                                name: '峰电能',
                                value: fSum
                            },
                            {
                                name: '平电能',
                                value: pSum
                            },
                            {
                                name: '谷电能',
                                value: gSum
                            },
                        ]
                        fengRate = (fSum / (fSum + pSum + gSum).toFixed(1)) * 100;
                        pingRate = (pSum / (fSum + pSum + gSum).toFixed(1)) * 100;
                        guRate = (gSum / (fSum + pSum + gSum).toFixed(1)) * 100;
                    }
                    break;
                case 'YY':
                    for (let month = 1; month < 13; month++) {
                        months.push(month + '月');
                        data.forEach(function (el, index) {
                            var innerTime = new Date(el.time);
                            if (day == innerTime.getDate()) {
                                todayArr.push(el);
                            }
                        });
                        if (todayArr.length == 0) {
                            FList.push(0)
                            PList.push(0)
                            GList.push(0)
                        } else if (todayArr.length > 0) {
                            for (let i = 0; i < todayArr.length; i++) {
                                if (todayArr[i].paramName == '峰电能') {
                                    FList.push(todayArr[i].value)
                                    fSum += todayArr[i].value;
                                }
                                if (todayArr[i].paramName == '平电能') {
                                    PList.push(todayArr[i].value);
                                    pSum += todayArr[i].value;
                                }
                                if (todayArr[i].paramName == '谷电能') {
                                    GList.push(todayArr[i].value);
                                    gSum += todayArr[i].value;
                                }
                            }
                        }
                        dataAxis = months;
                        names = ['峰电能', '平电能', '谷电能']
                        series = [{
                                name: '峰电能',
                                type: 'bar',
                                stack: '电能值',
                                data: FList
                            },
                            {
                                name: '平电能',
                                type: 'bar',
                                stack: '电能值',
                                data: PList
                            },
                            {
                                name: '谷电能',
                                type: 'bar',
                                stack: '电能值',
                                data: GList
                            },
                        ]
                        values = [{
                                name: '峰电能',
                                value: fSum
                            },
                            {
                                name: '平电能',
                                value: pSum
                            },
                            {
                                name: '谷电能',
                                value: gSum
                            },
                        ]
                        fengRate = (fSum / (fSum + pSum + gSum).toFixed(1)) * 100;
                        pingRate = (pSum / (fSum + pSum + gSum).toFixed(1)) * 100;
                        guRate = (gSum / (fSum + pSum + gSum).toFixed(1)) * 100;
                    }
                    break;
                default:
                    break;
            }
            showStaxkBar('stackBar', names, series, dataAxis);
            showPieRose('pieBar', names, values, '对比');
            if (fengRate) {
                var fengVal = fengRate / 100 * 3140;
                $("#feng").css("stroke-dasharray", fengVal + 'px, 3140px');
                $("#showFengText").text(fengRate.toFixed(0) + '%峰电能');
            }
            if (pingRate) {
                var pingVal = pingRate / 100 * 3140;
                $("#ping").css("stroke-dasharray", pingVal + 'px, 3140px');
                $("#showPingText").text(pingRate.toFixed(0) + '%平电能');
            }
            if (guRate) {
                var guVal = guRate / 100 * 3140;
                $("#gu").css("stroke-dasharray", guVal + 'px, 3140px');
                $("#showGuText").text(guRate.toFixed(0) + '%谷电能');
            }
        });
    }

    function showPieRose(id, names, values, seriesName) {
        var line = echarts.init(document.getElementById(id))
        line.clear()
        line.setOption({
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                bottom: '0%',
                data: names,
                textStyle: {
                    color: 'black'
                }
            },
            series: [{
                name: seriesName,
                type: 'pie',
                top: '0',
                radius: ['30%', '70%'],
                center: ['50%', '50%'],
                roseType: 'radius',
                itemStyle: {
                    normal: {
                        shadowBlur: 200,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                data: values,
            }],
            color: ['#e9444c', '#f6b949', '#90c557']
        })
    }

    function showStaxkBar(id, names, series, seriesName) {
        var line = echarts.init(document.getElementById(id))
        line.clear()
        line.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                top: 15,
                left: 55
            },
            legend: {
                orient: 'horizontal',
                bottom: '0%',
                data: names,
                textStyle: {
                    color: 'black'
                }
            },
            xAxis: [{
                type: 'category',
                data: seriesName,
                splitLine: {
                    show: false
                }, //去除网格线
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: 'rgb(0,173,169)', //左边线的颜色
                        width: '1.5' //坐标线的宽度
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: 'black', //坐标值得具体的颜色
                    }
                }
            }],
            yAxis: [{
                type: 'value',
                splitLine: {
                    show: true
                }, //去除网格线
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: 'rgb(0,173,169)',
                        width: '1.5'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: 'black'
                    }
                }
            }],
            series: series,
            color: ['#e9444c', '#f6b949', '#90c557']
        })
    }

    function sum(arr) {
        var s = 0;
        for (var i = arr.length - 1; i >= 0; i--) {
            s += arr[i];
        }
        return s;
    }

    function makeLine(chartData) {
        var option = {
            color: ['#2EC7C9', '#B6A2DE', '#3CA4E4', '#FFB980'],
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                show: true,
                orient: 'horizontal',
                top: -6,
                feature: {
                    dataView: {
                        readOnly: true
                    },
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {}
                }
            },
            legend: {
                data: [chartData.data1.name, chartData.data2.name],
                left: 60,
            },
            dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
                type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                start: 0, // 左边在 10% 的位置。
                end: 100, // 右边在 60% 的位置。
                height: 25,
                bottom: 8
            }],
            grid: {
                left: 50,
                right: 20,
                top: 45,
                bottom: 58
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: chartData.time,
            },
            yAxis: {
                type: 'value',
                scale: true,
                name: chartData.unit,
                axisLabel: {
                    formatter: function (val, index) {
                        if (val >= 10000 && val < 10000000) {
                            return val / 10000 + "万";
                        } else if (val >= 10000000) {
                            return val / 10000000 + "千万";
                        } else {
                            return val;
                        }
                    },
                },
            },
            series: [{
                    name: chartData.data1.name,
                    type: 'line',
                    data: chartData.data1.yesVals,
                },
                {
                    name: chartData.data2.name,
                    type: 'line',
                    data: chartData.data2.todayVals,
                }
            ]
        };
        var myChart = echarts.init($("#chartBox").get(0));
        myChart.setOption(option);
    }

    function makePie(pieData) {
        var option = {
            color: ['#2EC7C9', '#B6A2DE', '#3CA4E4', '#FFB980'],
            tooltip: {
                trigger: 'item',
                formatter: '{b} : {c} ({d}%)'
            },
            legend: {
                left: 'left',
                data: [pieData.data1.name, pieData.data2.name],
            },
            series: [{
                type: 'pie',
                data: [{
                        name: pieData.data1.name,
                        value: pieData.data1.value,
                    },
                    {
                        name: pieData.data2.name,
                        value: pieData.data2.value,
                    }
                ],
            }, ]
        };
        var myChart = echarts.init($("#pieBox").get(0));
        myChart.setOption(option);
    }

    var uiSearchbar = bui.searchbar({
        id: "#searchbar",
        onInput: function (e, keyword) {
            //实时搜索
            // console.log(++n)
        },
        onRemove: function (e, keyword) {
            uiList.empty();
            // 重新初始化数据
            uiList.init({
                page: 1,
                data: {
                    "keyWord": keyword
                }
            });
        },
        callback: function (e, keyword) {
            if (uiList) {
                //点击搜索清空数据
                uiList.empty();
                // 重新初始化数据
                uiList.init({
                    page: 1,
                    data: {
                        "keyWord": keyword
                    }
                });
            }
        }
    });

    var uiList = bui.list({
        id: "#scrollList",
        url: "/api/app/AppTrend/GetMeterList",
        pageSize: 15, // 当pageSize 小于返回的数据大小的时候,则认为是最后一页,接口返回的数据最好能返回空数组,而不是null
        data: {
            code: compoundCode,
            type: typeC,
            buildId: saveBuild.id ? saveBuild.id : '000001G003',
            keyWord: $("#searchInput").val(),
        },
        //如果分页的字段名不一样,通过field重新定义
        field: {
            page: "pageIndex",
            size: "pageSize",
            data: "data"
        },
        callback: function (e) {
            // e.target 为你当前点击的元素
            // e.currentTarget 为你当前点击的handle 整行
            var buildId = $(e.currentTarget).attr("data-id");
            var buildName = $(e.currentTarget).attr("data-name");
            storage.set("curObj", JSON.stringify({
                id: buildId,
                name: buildName
            }));
            $(".bui-bar-main").html(buildName);
            uiDialogRight.close();
            selectCurid = buildId;
            getMainData(buildId);
        },
        template: function (data) {
            var html = "";
            data.forEach(function (el, index) {
                html += `<li class="bui-btn bui-box" data-id="${el.id}" data-name="${el.name}">
                             <div class="icon"><i class="icon-sub"></i></div>
                             <div class="span1">${el.name}</div>
                         </li>`
            });
            return html;
        },
        onBeforeRefresh: function () {
            console.log("brefore refresh")
        },
        onBeforeLoad: function () {
            console.log("brefore load")
        },
        onRefresh: function () {
            // 刷新以后执行
            console.log("refreshed")
        },
        onLoad: function () {
            // 刷新以后执行
            console.log("loaded")
        }
    });

    if (selectCurid == undefined) {
        uiDialogRight.open();
    } else {
        getMainData(selectCurid);
    }
});