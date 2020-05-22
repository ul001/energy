bui.ready(function() {
    var storage = bui.storage();
    // 右边出来对话框
    var uiDialogRight = bui.dialog({
        id: "#dialogRight",
        effect: "fadeInRight",
        position: "right",
        fullscreen: true,
        buttons: []
    });

    var saveBuild;
    try{
        saveBuild = JSON.parse(storage.get("build"));
        $(".bui-bar-main").html(saveBuild.name);
    }catch(e){
        uiDialogRight.open();
    };

    $('#btnOpenFilter').on("click", function() {
        uiDialogRight.open();
    });

    $(".top-class .span1").on("click", function() {
        $(this).addClass("active").siblings().removeClass("active");
        uiList.empty();
        // 重新初始化数据
        uiList.init({
            page: 1,
            data: {
                "keyWord": $("#mainSearchInput").val(),
                "code":$(".secord-class .bui-btn.selected").attr("data-value"),
                "type":$(".top-class .active").attr("data-type"),
            }
        });
    });

    $(".secord-class .bui-btn").on("click", function() {
        $(this).addClass("selected").siblings().removeClass("selected");
        uiList.empty();
        // 重新初始化数据
        uiList.init({
            page: 1,
            data: {
                "keyWord": $("#mainSearchInput").val(),
                "code":$(".secord-class .bui-btn.selected").attr("data-value"),
                "type":$(".top-class .active").attr("data-type"),
            }
        });
    });

    $($(".top-class li")[0]).addClass("active");
    $($(".secord-class .bui-btn")[0]).addClass("selected");

    function getMainData(curid){
        $("#mainScrollList .bui-list").empty();
        var param = {
            buildId:saveBuild.id,
            code:$(".secord-class .bui-btn.selected").attr("data-value"),
            type:$(".top-class .active").attr("data-type"),
            reportType:"DD",
            time:"2020-05-21",
            ids:curid,
        };
        energyObj.getDataByAjax("GET","/api/app/AppTrend/GetTrendData",param,function(data){
            var html = "";
            var times = [];
            var yesVals = [];
            var todayVals = [];
            var unitStr = "";
            data.forEach(function(el, index) {
                var tongbi = "-";
                var yesVal = "-";
                var todayVal = "-";
                times.push(index);
                if(el.currentValue!=undefined){
                    todayVal = el.currentValue;
                    todayVals.push(el.currentValue);
                }
                if(el.beforeValue!=undefined){
                    yesVal = el.beforeValue;
                    yesVals.push(el.beforeValue);
                }
                try{
                    if(todayVal != "-" && yesVal != "-" && yesVal != 0){
                        tongbi = (((el.currentValue-el.beforeValue)/el.beforeValue)*100).toFixed(2)+"%";
                    }
                }catch(e){};
                var codeStr = $(".secord-class .bui-btn.selected").attr("data-value");
                var consumeType = "用能";
                switch(codeStr){
                    case "01000":
                        consumeType = "用电";
                        unitStr = "kW·h";
                        break;
                    case "02000":
                        consumeType = "用水";
                        unitStr = "t";
                        break;
                    case "13000":
                        consumeType = "发电";
                        unitStr = "kW·h";
                        break;
                    case "03000":
                        unitStr = "m³";
                        break;
                    case "40000":
                        unitStr = "m³";
                        break;
                    case "05000":
                        unitStr = "MJ";
                        break;
                    case "04000":
                        unitStr = "MJ";
                        break;
                    case "20000":
                        unitStr = "m³";
                        break;
                }
                html += `<li class="bui-box-align-middle liBox">
                             <div class="span1">
                                 <div class="bui-box-align-middle">
                                     <div class="icon"><i class="icon-biaozhi"></i></div>
                                     <div class="span1 boldFont">${index}时</div>
                                     <div class="item-text">单位：${unitStr}</div>
                                 </div>
                                 <ul class="bui-nav-icon bui-fluid-4 span1">
                                     <li class="bui-btn clearactive">
                                         <div class="bui-icon"><i class="icon-today"></i></div>
                                         <div class="item-title">今日${consumeType}</div>
                                         <div class="item-text">${todayVal}</div>
                                     </li>
                                     <li class="bui-btn clearactive">
                                         <div class="bui-icon"><i class="icon-yes"></i></div>
                                         <div class="item-title">昨日同期</div>
                                         <div class="item-text">${yesVal}</div>
                                     </li>
                                     <li class="bui-btn clearactive">
                                         <div class="bui-icon"><i class="icon-tongbi"></i></div>
                                         <div class="item-title">同比</div>
                                         <div class="item-text">${tongbi}</div>
                                     </li>
                                 </ul>
                             </div>
                         </li>`;
            });
            $("#mainScrollList .bui-list").html(html);
            var chartData = {
                time:times,
                data1:{name:"昨日",yesVals},
                data2:{name:"今日",todayVals},
                unit:unitStr
            };
            makeLine(chartData);
        });
    }

    function makeLine(chartData){
        var option = {
            color: ['#2EC7C9','#B6A2DE','#3CA4E4','#FFB980'],
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
                data:[chartData.data1.name, chartData.data2.name],
                left:60,
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
                bottom: 60
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: chartData.time,
            },
            yAxis: {
                type: 'value',
                scale: true,
                name:chartData.unit,
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

    var uiSearchbar = bui.searchbar({
        id: "#searchbar",
        onInput: function(e, keyword) {
            //实时搜索
            // console.log(++n)
        },
        onRemove: function(e, keyword) {
            uiList.empty();
            // 重新初始化数据
            uiList.init({
                page: 1,
                data: {
                    "keyWord": keyword
                }
            });
        },
        callback: function(e, keyword) {
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
        data: {code:$(".secord-class .bui-btn.selected").attr("data-value"),
           type:$(".top-class .active").attr("data-type"),
           buildId:saveBuild.id,
           keyWord:$("#searchInput").val(),
        },
        //如果分页的字段名不一样,通过field重新定义
        field: {
            page: "pageIndex",
            size: "pageSize",
            data: "data"
        },
        callback: function(e) {
            // e.target 为你当前点击的元素
            // e.currentTarget 为你当前点击的handle 整行
            var buildId = $(e.currentTarget).attr("data-id");
            var buildName = $(e.currentTarget).attr("data-name");
            $(".bui-bar-main").html(buildName);
            uiDialogRight.close();
            getMainData(buildId);
        },
        template: function(data) {
            var html = "";
            data.forEach(function(el, index) {
                html += `<li class="bui-btn bui-box" data-id="${el.id}" data-name="${el.name}">
                             <div class="icon"><i class="icon-sub"></i></div>
                             <div class="span1">${el.name}</div>
                         </li>`
            });
            return html;
        },
        onBeforeRefresh: function() {
            console.log("brefore refresh")
        },
        onBeforeLoad: function() {
            console.log("brefore load")
        },
        onRefresh: function() {
            // 刷新以后执行
            console.log("refreshed")
        },
        onLoad: function() {
            // 刷新以后执行
            console.log("loaded")
        }
    });
});