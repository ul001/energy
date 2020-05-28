bui.ready(function () {
    var storage = bui.storage();
    var time = tool.initDate("YMD", new Date());
    var reportType = "DD";
    var buildId;
    var selectBuildId;
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
        selectBuildId = saveBuild.id;
    } catch (e) {
        uiDialogRight.open();
    }

    $("#btnOpenFilter").on("click", function () {
        uiDialogRight.open();
    });

    $(".top-class .span1").on("click", function () {
        $(this)
            .addClass("active")
            .siblings()
            .removeClass("active");
    });

    $(".secord-class .bui-btn").on("click", function () {
        $(this)
            .addClass("selected")
            .siblings()
            .removeClass("selected");
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

    function initBar(barData) {
        var bar = echarts.init(document.getElementById("pie"));
        var option = {
            title: [{
                text: Operation["ui_donut"],
                textStyle: {
                    fontWeight: "small"
                },
                right: "10",
                top: 10
            }],
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow"
                }
            },
            legend: {
                data: [
                    Operation["ui_jian"],
                    Operation["ui_feng"],
                    Operation["ui_ping"],
                    Operation["ui_gu"]
                ],
                bottom: 0
            },
            grid: {
                top: "51%",
                left: "13%",
                right: "5%",
                bottom: "0%"
            },
            // toolbox: {
            //     left: "right",
            //     top: "15%",
            //     feature: {
            //         dataZoom: {
            //             yAxisIndex: "none"
            //         },
            //         dataView: {
            //             readOnly: true
            //         },
            //         restore: {}
            //     }
            // },
            series: [{
                name: Operation["ui_proportion"],
                type: "pie",
                radius: ["20%", "45%"],
                center: ["50%", "50%"],
                label: {
                    normal: {
                        position: "inner",
                        formatter: function (data) {
                            return (
                                data.name +
                                "\n" +
                                data.value +
                                "\n" +
                                "(" +
                                data.percent.toFixed(2) +
                                "%)"
                            );
                        }
                    }
                },
                color: ["#c23531", "#EDBA5E"],
                data: barData
            }]
        };
        bar.setOption(option);
    }

    initQuick(reportType);

    function initData() {
        energyObj.getDataByAjax(
            "GET",
            "/api/app/AppStandardCoal", {
                buildId: selectBuildId,
                reportType: reportType,
                time: time
            },
            function (data) {
                console.log(data);
                initBar(data);
            }
        );
    }

    initData();

    var uiList = bui.list({
        id: "#scrollList",
        url: "/api/app/AppBuild",
        headers: {
            Authorization: tokenFromAPP
        },
        pageSize: 15, // 当pageSize 小于返回的数据大小的时候,则认为是最后一页,接口返回的数据最好能返回空数组,而不是null
        data: {},
        //如果分页的字段名不一样,通过field重新定义
        field: {
            page: "pageIndex",
            size: "pageSize",
            data: "data"
        },
        callback: function (e) {
            // e.target 为你当前点击的元素
            // e.currentTarget 为你当前点击的handle 整行
            buildId = $(e.currentTarget).attr("data-id");
            var buildName = $(e.currentTarget).attr("data-name");
            var clickBuild = {
                id: buildId,
                name: buildName
            };
            selectBuildId = buildId;
            storage.set("build", JSON.stringify(clickBuild));
            storage.remove("curObj");
            $(".bui-bar-main").html(buildName);
            uiDialogRight.close();
        },
        template: function (data) {
            var html = "";
            data.forEach(function (el, index) {
                html += `<li class="bui-btn bui-box" data-id="${el.id}" data-name="${el.name}">
                             <div class="icon"><i class="icon-sub"></i></div>
                             <div class="span1">${el.name}</div>
                         </li>`;
            });
            return html;
        },
        onBeforeRefresh: function () {
            console.log("brefore refresh");
        },
        onBeforeLoad: function () {
            console.log("brefore load");
        },
        onRefresh: function () {
            // 刷新以后执行
            console.log("refreshed");
        },
        onLoad: function () {
            // 刷新以后执行
            console.log("loaded");
        }
    });
    if (selectBuildId == undefined) {
        uiDialogRight.open();
    } else {
        initData();
    }
});