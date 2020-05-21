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

    try{
        var saveBuild = JSON.parse(storage.get("build"));
        $(".bui-bar-main").html(saveBuild.name);
    }catch(e){
        uiDialogRight.open();
    };

    $('#btnOpenFilter').on("click", function() {
        uiDialogRight.open();
    });

    $(".top-class .span1").on("click", function() {
        $(this).addClass("active").siblings().removeClass("active");
    });

    $(".secord-class .bui-btn").on("click", function() {
        $(this).addClass("selected").siblings().removeClass("selected");
    });

    var uiSearchbar = bui.searchbar({
        id: "#miansearchbar",
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
        id: "#mainScrollList",
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