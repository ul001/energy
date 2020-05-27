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
            getMainData(selectCurid);
        }
        // 如果不需要按钮,设置为空
        // buttons: [{name:"取消"}]
    });

    var time = tool.initDate("YMD", new Date());
    var reportType = "DD";
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
            var times = [];
            var yesVals = [];
            var todayVals = [];
            var unitStr = "";
            data.forEach(function (el, index) {
                var tongbi = "-";
                var yesVal = "-";
                var todayVal = "-";
                var timeStr = "-";
                if (reportType == "DD") {
                    timeStr = parseInt(el.time.substring(11, 13)) + timeUnit;
                } else if (reportType == "MM") {
                    timeStr = parseInt(el.time.substring(8, 10)) + timeUnit;
                } else if (reportType == "YY") {
                    timeStr = parseInt(el.time.substring(5, 7)) + timeUnit;
                }
                times.push(timeStr);
                if (el.currentValue != undefined) {
                    todayVal = el.currentValue;
                    todayVals.push(el.currentValue);
                }
                if (el.beforeValue != undefined) {
                    yesVal = el.beforeValue;
                    yesVals.push(el.beforeValue);
                }
            });
            var chartData = {
                time: times,
                data1: {
                    name: dataName2,
                    yesVals
                },
                data2: {
                    name: dataName1,
                    todayVals
                },
                unit: unitStr
            };
            makeLine(chartData);
            var pieData = {
                data1: {
                    name: dataName2,
                    value: sum(yesVals).toFixed(2)
                },
                data2: {
                    name: dataName1,
                    value: sum(todayVals).toFixed(2)
                },
                unit: unitStr
            };
            makePie(pieData);
        });
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