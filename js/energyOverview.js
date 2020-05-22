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
        uiMainList.empty();
        // 重新初始化数据
        uiMainList.init({
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
        uiMainList.empty();
        // 重新初始化数据
        uiMainList.init({
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

    var uiMianSearchbar;

    var uiMainList;

    if(saveBuild!=null){
        getMainData(saveBuild.id);
    }

    function getMainData(buildId){
        uiMianSearchbar = bui.searchbar({
            id: "#mainsearchbar",
            onInput: function(e, keyword) {
                //实时搜索
                // console.log(++n)
            },
            onRemove: function(e, keyword) {
                uiMainList.empty();
                // 重新初始化数据
                uiMainList.init({
                    page: 1,
                    data: {
                        "keyWord": keyword
                    }
                });
            },
            callback: function(e, keyword) {
                if (uiMainList) {
                    //点击搜索清空数据
                    uiMainList.empty();
                    // 重新初始化数据
                    uiMainList.init({
                        page: 1,
                        data: {
                            "keyWord": keyword
                        }
                    });
                }
            }
        });

        uiMainList = bui.list({
            id: "#mainScrollList",
            url: "/api/app/AppCompareData",
            pageSize: 10, // 当pageSize 小于返回的数据大小的时候,则认为是最后一页,接口返回的数据最好能返回空数组,而不是null
            data: {buildId:buildId,
                code:$(".secord-class .bui-btn.selected").attr("data-value"),
                type:$(".top-class .active").attr("data-type")},
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
                $(".bui-bar-main").html(buildName);
                uiDialogRight.close();
            },
            template: function(data) {
                var html = "";
                data.forEach(function(el, index) {
                    var tongbi = "-";
                    var yesVal = "-";
                    var todayVal = "-";
                    if(el.currentValue!=undefined){
                        todayVal = el.currentValue;
                    }
                    if(el.beforeValue!=undefined){
                        yesVal = el.beforeValue;
                    }
                    try{
                        if(todayVal != "-" && yesVal != "-" && yesVal != 0){
                            tongbi = (((el.currentValue-el.beforeValue)/el.beforeValue)*100).toFixed(2)+"%";
                        }
                    }catch(e){};
                    var codeStr = $(".secord-class .bui-btn.selected").attr("data-value");
                    var unitStr = "";
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
                    html += `<li class="bui-box-align-middle liBox" data-id="${el.id}">
                                 <div class="span1">
                                     <div class="bui-box-align-middle">
                                         <div class="icon"><i class="icon-biaozhi"></i></div>
                                         <div class="span1 boldFont">${el.name}</div>
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
                                 <i class="icon-listright"></i>
                             </li>`;
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