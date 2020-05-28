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
    var selectCurid;
    var getParams = bui.getPageParams();
    getParams.done(function(result){
        console.log(result);
        selectCurid = result.curid;
        $(".bui-bar-main").html(result.curname);
        if(selectCurid == null || selectCurid == undefined){
            try{
                var curObj = JSON.parse(storage.get("curObj"));
                selectCurid = curObj.id;
                $(".bui-bar-main").html(curObj.name);
                getParamSelect();
            }catch(e){
                uiDialogRight.open();
            };
        }
        // {id:"page2"}
    });
    try{
        saveBuild = JSON.parse(storage.get("build"));
    }catch(e){
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

    function getParamSelect(){
        if(selectCurid!=undefined){
            energyObj.getDataByAjax("GET","/api/ParameterData/GetParamInfo","circuitID="+selectCurid,function(data){
                var html1='';
                data.parameterClssify.forEach(function(el,index){
                    var imgSrc = "";
                    if(el.name.indexOf("电压")!=-1){
                        imgSrc="img/dianya_p.png";
                    }else if(el.name.indexOf("电流")!=-1){
                        imgSrc="img/dianliu_p.png";
                    }else if(el.name.indexOf("功率因数")!=-1){
                        imgSrc="img/gonglvyinshu_p.png";
                    }else if(el.name.indexOf("电能")!=-1){
                        imgSrc="img/energy_unAc.png";
                    }else if(el.name.indexOf("需量")!=-1){
                        imgSrc="img/xuliang_p.png";
                    }else if(el.name.indexOf("功率")!=-1){
                        imgSrc="img/gonglv_p.png";
                    }
                    if(el.name.indexOf("谐波")==-1){
                        html1 += `<li class="bui-btn" data-value="${el.id}">
                                      <div class="bui-icon"><img src="${imgSrc}"></div>
                                      <div class="span1">${el.name}</div>
                                  </li>`;
                    }
                });
                $(".third-class").html(html1);
                var html2 = "";
                data.parameterList.forEach(function(el,index){
                    if(el.name.indexOf("谐波")==-1){
                        html2 += `<div class="span1 selectSpan bui-btn" data-code="${el.code}">
                                      <label for="${el.id}">
                                          <input id="${el.id}" type="checkbox" class="bui-choose" name="interester2"
                                                 value="${el.id}" text="" checked="checked">
                                          ${el.name}
                                      </label>
                                  </div>`;
                    }
                });
                $(".checkDiv").html(html2);
                $(".third-class .bui-btn").on("click", function() {
                    $(this).addClass("selected").siblings().removeClass("selected");
                    var className = $(".third-class .bui-btn.selected").attr("data-value");
                    $(".checkDiv .selectSpan").removeClass("showSpan");
                    $(".checkDiv .selectSpan[data-code='"+className+"']").addClass("showSpan");
                    $(".checkDiv .selectSpan[data-code='"+className+"'] input").prop("checked",true);
                    if(selectCurid!=undefined){
                        getMainData(selectCurid);
                    }
                });
                $(".third-class .bui-btn")[0].click();
                $(".selectSpan input").on("change",function(){
                    getMainData(selectCurid);
                });
            });
        }
    }

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
    initQuick();

    function initQuick() {
        $("#datePre").unbind("click");
        $("#dateNext").unbind("click");
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
    }

    function avgArr(arr) {
        var s = 0;
        for (var i=arr.length-1; i>=0; i--) {
            s += arr[i];
        }
        return (s/arr.length).toFixed(2);
    }

    function getFormatNum(val){
        if(val >= 10000 && val<10000000){
            return (val/10000).toFixed(2)+"万";
        }else if(val >= 10000000){
            return (val/10000000).toFixed(2)+"千万";
        }else{
            return val;
        }
    }

    function getMainData(curid){
        $("#mainScrollList").empty();
        var timeUnit;
        var dataName1;
        var dataName2;
        var timeParam = $("#datepicker_input").val();
        var paramArray = [];
        $(".showSpan input:checked").each(function(index,obj){
            paramArray.push($(obj).val());
        });
        var paramStr = paramArray.join(",");
        var param = {
            meterParamIds:paramStr,
            dateTime:timeParam,
            circuitID:curid,
        };
        energyObj.getDataByAjax("GET","/api/ParameterData/GetParamValue",param,function(data){
            var html = "";
            var legs = [];
            var YSeries = [];
            var XSeries = [];
            var unitY = "";
            var tableData = [];
            try{
                data.forEach(function(el1, index1) {
                    var unitStr = el1.paramUnit;
                    unitY = unitStr;
                    legs.push(el1.paramName);
                    var times = [];
                    var vals = [];
                    el1.data.forEach(function(el,index){
                        var val = "-";
                        var timeStr = "-";
                        timeStr = el.time.substring(11,16);
                        times.push(timeStr);
                        if(el.value!=undefined){
                            val = el.value;
                            vals.push(val);
                        }
                    });
                    XSeries = times;
                    YSeries.push({
                            name: el1.paramName,
                            type: 'line',
                            data: vals,
                    });
                    var max = Math.max.apply(Math, vals);
                    var min = Math.min.apply(Math, vals);
                    var avg = avgArr(vals);
                    tableData.push({name:el1.paramName,max:getFormatNum(max),min:getFormatNum(min),avg:getFormatNum(avg)});
                });
            }catch(e){};
            var chartData = {
                legs:legs,
                YSeries:YSeries,
                XSeries:XSeries,
                unitY:unitY
            };
            makeLine(chartData);
            addParamTable(tableData);
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
                data:chartData.legs,
                top:15
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
                top: 60,
                bottom: 58
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: chartData.XSeries,
            },
            yAxis: {
                type: 'value',
                scale: true,
                name:chartData.unitY,
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
            series: chartData.YSeries
        };
        var myChart = echarts.init(document.getElementById('chartBox'));
        myChart.clear();
        myChart.setOption(option);
    }

    function addParamTable(tableData){
        var html = `<li class="paramLi">
                        <h3 class="bui-box">
                            <span class="span3 blueSpan">参数名称</span>
                            <span class="span2 yellowSpan">平均值</span>
                            <span class="span2 yellowSpan">最大值</span>
                            <span class="span2 yellowSpan">最小值</span>
                        </h3>
                    </li>`;
        tableData.forEach(function(el,index){
            html += `<li class="paramLi">
                         <h3 class="bui-box">
                             <span class="span3 blueSpan">${el.name}</span>
                             <span class="span2 yellowSpan">${el.avg}</span>
                             <span class="span2 yellowSpan">${el.max}</span>
                             <span class="span2 yellowSpan">${el.min}</span>
                         </h3>
                     </li>`;
        });
        $("#tableBox").html(html);
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
            storage.set("curObj",JSON.stringify({id:buildId,name:buildName}));
            $(".bui-bar-main").html(buildName);
            uiDialogRight.close();
            selectCurid = buildId;
            getParamSelect();
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

    $($(".third-class .bui-btn")[0]).click();

    if(selectCurid==undefined){
        uiDialogRight.open();
    }

});