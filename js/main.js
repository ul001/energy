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

    window.addEventListener("pageshow", function (e) {
        // ios系统 返回页面 不刷新的问题 Safari内核缓存机制导致 方案一 方案二：设置meta标签，清除页面缓存
        var u = navigator.userAgent,
            app = navigator.appVersion;
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if (e.persisted && isIOS) {
            window.location.reload();
        }
    });

    try {
        var saveBuild = JSON.parse(storage.get("build"));
        $(".bui-bar-main").html(saveBuild.name);
    } catch (e) {
        uiDialogRight.open();
    };

    $('#BackToAPP').on("click", function () {
        if (isIOS) {
            window.webkit.messageHandlers.goBackiOS.postMessage("");
        } else {
            android.goBack();
        }
    });

    $('#btnOpenFilter').on("click", function () {
        uiDialogRight.open();
    });

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

    //全界面隐藏
    for (let index = 1; index < 14; index++) {
        $("#jump" + index).hide();

    }
    //初始化界面开启
    Substation.getDataByAjaxNoLoading("/getEnergyMenu", {

        },
        function (data) {
            var EnergyVar = "";
            var BuildVar = "";
            if (data.hasOwnProperty('energyRootMenu')) {
                var energyList = data.energyRootMenu;
                if (energyList.length > 0) {
                    for (let i = 0; i < energyList[0].nodes.length; i++) {
                        for (let index = 0; index < energyList[0].nodes[i].nodes.length; index++) {
                            var element = energyList[0].nodes[i].nodes[index];
                            var nodeCode = element.fCode - 100;
                            // var nodeCode = parseInt(element.fCode) - 100;
                            $("#jump" + nodeCode).show();
                        }
                    }
                } else {
                    bui.hint({
                        //请前往Web端"系统设置"-"角色管理"中进行配置。
                        content: '未配置能耗管理界面,请前往Web端进行配置',
                        // position: "center",
                        // effect: "fadeInDown"
                    });
                }
            }
        },
        function (errorcode) {

        }
    );

    $("#jump1").on("click", function () {
        bui.load({
            url: "energyOverview.html"
        });
    });

    $("#jump2").on("click", function () {
        bui.load({
            url: "trendStatistics.html"
        });
    });
    $("#jump3").on("click", function () {
        bui.load({
            url: "YoYAnalysis.html"
        });
    });
    $("#jump4").on("click", function () {
        bui.load({
            url: "energyRank.html"
        });
    });
    $("#jump5").on("click", function () {
        bui.load({
            url: "paramQuery.html"
        });
    });
    $("#jump6").on("click", function () {
        bui.load({
            url: "CompoundRate.html"
        });
    });
    //    $("#jump7").on("click",function(){
    //        bui.load({url:"energyOverview.html"});
    //    });
    //    $("#jump8").on("click",function(){
    //        bui.load({url:"energyOverview.html"});
    //    });
    $("#jump9").on("click", function () {
        bui.load({
            url: "buildOverview.html"
        });
    });
    $("#jump10").on("click", function () {
        bui.load({
            url: "buildTrendSum.html"
        });
    });
    $("#jump11").on("click", function () {
        bui.load({
            url: "buildContrast.html"
        });
    });
    $("#jump12").on("click", function () {
        bui.load({
            url: "Proportion.html"
        });
    });
    $("#jump13").on("click", function () {
        bui.load({
            url: "3DBuild.html"
        });
    });


});