bui.ready(function () {
    var storage = bui.storage();
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
    };

    $('#btnOpenFilter').on("click", function () {
        uiDialogRight.open();
    });
    $(".top-class .span1").on("click", function () {
        $(this).addClass("active").siblings().removeClass("active");
    });

    $(".secord-class .bui-btn").on("click", function () {
        $(this).addClass("selected").siblings().removeClass("selected");
    });



    function initBar(barData) {
        var bar = echarts.init(document.getElementById('pie'));
        var option = {
            title: [{
                text: Operation['ui_donut'],
                // subtext: y == "￥" ? (Operation['ui_totalsum'] + '：' + y + sum) : (Operation['ui_totalsum'] + '：' + sum + y),
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
                                return data.name + '\n' + data.value + '\n' + '(' + data.percent.toFixed(2) + '%)';
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

    energyObj.getDataByAjax("GET", "/api/app/AppStandardCoal", {
        buildId: '000001G003',
        reportType: 'YY',
        time: '2019-02-01'
    }, function (data) {
        console.log(data);
        initBar(data);
    });

    // initBar($("#lineChart"), ["05-01"], ["2.00"], ["4.00"], ["3.00"], ["1.00"], [{
    //     value: "0",
    //     name: "尖"
    // }, {
    //     value: "4356",
    //     name: "峰"
    // }, {
    //     value: "6902",
    //     name: "平"
    // }, {
    //     value: "5554",
    //     name: "谷"
    // }], 1682, 'kW·h');


    var uiList = bui.list({
        id: "#scrollList",
        url: "/api/app/AppBuild",
        headers: {
            "Authorization": tokenFromAPP
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
            var buildId = $(e.currentTarget).attr("data-id");
            var buildName = $(e.currentTarget).attr("data-name");
            var clickBuild = {
                id: buildId,
                name: buildName
            };
            storage.set("build", JSON.stringify(clickBuild));
            $(".bui-bar-main").html(buildName);
            uiDialogRight.close();
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
    return uiList;
});