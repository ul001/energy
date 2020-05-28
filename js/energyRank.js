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
    var selectBuildId;
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
        getMainData(selectBuildId);
    });

    $(".secord-class .bui-btn").on("click", function() {
        $(this).addClass("selected").siblings().removeClass("selected");
        getMainData(selectBuildId);
    });

    $($(".top-class li")[0]).addClass("active");
    $($(".secord-class .bui-btn")[0]).addClass("selected");

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
                getMainData(selectBuildId);
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
        getMainData(selectBuildId);
    });

    function initQuick(type) {
        $("#datePre").unbind("click");
        $("#dateNext").unbind("click");
        if (type == "DD") {
            $("#datePre").click(function () {
                var selectDate = new Date($("#datepicker_input").val().replace(/\-/g, "\/"));
                var preDate = new Date(selectDate.getTime() - 24 * 60 * 60 * 1000);
                $("#datepicker_input").val(preDate.getFullYear() + "-" + ((preDate.getMonth()) < 9 ? ("0" + (preDate.getMonth() + 1)) : (preDate.getMonth() + 1)) + "-" + (preDate.getDate() < 10 ? ("0" + preDate.getDate()) : (preDate.getDate())));
                getMainData(selectBuildId);
            });
            $("#dateNext").click(function () {
                var d = new Date();
                var nowDate = new Date(d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate());
                var selectDate = new Date($("#datepicker_input").val().replace(/\-/g, "\/"));
                if (selectDate < nowDate) {
                    var nextDate = new Date(selectDate.getTime() + 24 * 60 * 60 * 1000);
                    $("#datepicker_input").val(nextDate.getFullYear() + "-" + ((nextDate.getMonth()) < 9 ? ("0" + (nextDate.getMonth() + 1)) : (nextDate.getMonth() + 1)) + "-" + (nextDate.getDate() < 10 ? ("0" + nextDate.getDate()) : (nextDate.getDate())));
                    getMainData(selectBuildId);
                } else {
                    return;
                }
            });
        } else if (type == "MM") {
            $("#datePre").click(function () {
                var selectDate = new Date(($("#datepicker_input").val() + "-01").replace(/\-/g, "\/"));
                var preDate = new Date(selectDate.setMonth(selectDate.getMonth() - 1));
                $("#datepicker_input").val(preDate.getFullYear() + "-" + ((preDate.getMonth()) < 9 ? ("0" + (preDate.getMonth() + 1)) : (preDate.getMonth() + 1)));
                getMainData(selectBuildId);
            });
            $("#dateNext").click(function () {
                var d = new Date();
                var nowDate = new Date(d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + '01');
                var selectDate = new Date(($("#datepicker_input").val() + "-01").replace(/\-/g, "\/"));
                if (selectDate < nowDate) {
                    var nextDate = new Date(selectDate.setMonth(selectDate.getMonth() + 1));
                    $("#datepicker_input").val(nextDate.getFullYear() + "-" + ((nextDate.getMonth()) < 9 ? ("0" + (nextDate.getMonth() + 1)) : (nextDate.getMonth() + 1)));
                    getMainData(selectBuildId);
                } else {
                    return;
                }
            });
        } else if (type == "YY") {
            $("#datePre").click(function () {
                var selectDate = new Date($("#datepicker_input").val().replace(/\-/g, "\/"));
                var preDate = new Date(selectDate.setFullYear(selectDate.getFullYear() - 1));
                $("#datepicker_input").val(preDate.getFullYear());
                getMainData(selectBuildId);
            });
            $("#dateNext").click(function () {
                var d = new Date();
                var nowDate = new Date((d.getFullYear() + "-01-01").replace(/\-/g, "\/"));
                var selectDate = new Date(($("#datepicker_input").val() + "-01" + "-01").replace(/\-/g, "\/"));
                if (selectDate < nowDate) {
                    var nextDate = new Date(selectDate.setFullYear(selectDate.getFullYear() + 1));
                    $("#datepicker_input").val(nextDate.getFullYear());
                    getMainData(selectBuildId);
                } else {
                    return;
                }
            });
        }
    }

    if(saveBuild!=null){
        selectBuildId = saveBuild.id;
        getMainData(selectBuildId);
    }

    $(".bui-tag").on("change",function(){
        getMainData(selectBuildId);
    });

    function getMainData(buildId){
            $("#mainScrollList").empty();
            var reportTypeStr = $(".btn_active").attr("value");
            var timeUnit;
            var dataName1;
            var dataName2;
            var timeParam;
            if(reportType=="DD"){
                timeUnit = "时";
                dataName1 = "今日";
                dataName2 = "昨日";
                timeParam = $("#datepicker_input").val();
            }else if(reportType=="MM"){
                timeUnit = "日";
                dataName1 = "当月";
                dataName2 = "上月";
                timeParam = $("#datepicker_input").val()+"-01";
            }else if(reportType=="YY"){
                timeUnit = "月";
                dataName1 = "今年";
                dataName2 = "去年";
                timeParam = $("#datepicker_input").val()+"-01-01";
            }
            var param = {
                buildId:buildId,
                code:$(".secord-class .bui-btn.selected").attr("data-value"),
                type:$(".top-class .active").attr("data-type"),
                reportType:reportTypeStr,
                time:timeParam,
                pageIndex:1,
                pageSize:$(".bui-tag:checked").val(),
            };
            energyObj.getDataByAjax("GET","/api/app/AppRank",param,function(data){
                var names = [];
                var values = [];
                var html = '';
                data.forEach(function(el, index) {
                    names.push(el.name);
                    values.push(el.value);
                    html += `<li>
                                    <div class="rankLi bui-box">
                                        <div class="span1">
                                            <h3 class="item-title title-left"><span class="rankIndex">${index+1}</span><span class="rankValue">${el.name}</span></h3>
                                        </div>
                                        <span class="value-right">${el.value}</span>
                                    </div>
                                </li>`;
                });
                $("#mainScrollList").html(html);
                var barData = {
                    name:names,
                    value:values
                };
                makeBar(barData);
            });
    }

    function makeBar(barData){
        option = {
            color: ['#2EC7C9','#B6A2DE','#3CA4E4','#FFB980'],
            dataZoom: [{
                type: 'inside'
            }, {
                type: 'slider'
            }],
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
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: 50,
                right: 20,
                top: 38,
                bottom: 58
            },
            xAxis: {
                type: 'category',
                data: barData.name
            },
            yAxis: {
                type: 'value',
                scale: true,
                axisLabel:{
                    formatter:function(val,index){
                        if(val >= 10000 && val<10000000){
                            return val/10000+"万";
                        }else if(val >= 10000000){
                            return val/10000000+"千万";
                        }else{
                            return val;
                        }
                    },
                },
            },
            series: [{
                data: barData.value,
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(220, 220, 220, 0.8)'
                }
            }]
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
        url: "/api/app/AppBuild",
        pageSize: 15, // 当pageSize 小于返回的数据大小的时候,则认为是最后一页,接口返回的数据最好能返回空数组,而不是null
        data: {},
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
            var clickBuild = {id:buildId,name:buildName};
            storage.set("build", JSON.stringify(clickBuild));
            storage.remove("curObj");
            $(".bui-bar-main").html(buildName);
            uiDialogRight.close();
            selectBuildId = buildId;
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