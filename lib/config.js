var baseUrlFromAPP = "http://116.236.149.165:18090";
var tokenFromAPP = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJleHAiOjE1OTA0NjQyMDksImlzcyI6ImFjcmVsIiwiYXVkIjoiYWNyZWwifQ.GF6u6SSuU5-88lqxgeZQRmSnVSelu11_K3ApiVmHR8A";
//语言字段传参
var languageOption = "zh";

//iOS安卓基础传参
var u = navigator.userAgent,
    app = navigator.appVersion;
var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
//判断数组中是否包含某字符串
try {
    // if (isIOS) {
    //     //ios系统的处理
    //     window.webkit.messageHandlers.iOS.postMessage(null);
    //     var storage = localStorage.getItem("accessToken");
    //     // storage = storage ? JSON.parse(storage):[];
    //     storage = JSON.parse(storage);
    //     baseUrlFromAPP = storage.baseurl;
    //     tokenFromAPP = storage.token;
    //     languageOption = storage.languageType;
    // } else {
    //     baseUrlFromAPP = android.getBaseUrl();
    //     tokenFromAPP = android.getToken();
    //     languageOption = android.postLanguage();
    // }
} catch (e) {
    languageOption = "zh";
}

bui.config.ajax = {
    baseUrl: baseUrlFromAPP,
    headers: {
        "Authorization": tokenFromAPP
    }
}

var uiLoading;

var energyObj = {
    loadLanguageData: function () {
        $("[data-i18n]").each(function () {
            $(this).html(Operation[$(this).data("i18n")]);
        });
        $("[data-placeholder]").each(function () {
            $(this).attr('placeholder', Operation[$(this).data("placeholder")]);
        });
    },
    loadLanguageJS: function () {
        if (languageOption == "en") {
            getEnLanguage();
        } else {
            getZhLanguage();
        }
        this.loadLanguageData();
    },
    addLoadingDiv: function () {
        $("body main").append("<div id='loading'></div>");
        uiLoading = bui.loading({
            appendTo: "#loading",
            width: 40,
            height: 40,
            callback: function (argument) {
                console.log("clickloading")
            }
        })
    },
    showLoading: function () {
        uiLoading.show();
        uiLoading.text(Operation['ui_loading']);
    },
    hideLoading: function () {
        uiLoading.hide();
    },
    getDataByAjax: function (method, url, param, successCallback) {
        bui.ajax({
            url: url,
            data: param,
            method: method,
            transformRequest: function (xhr) {
                energyObj.showLoading();
            },
            transformResponse: function (xhr) {
                energyObj.hideLoading();
            },
        }).then(function (res) {
            if (res.code == 200) {
                successCallback(res.data);
            } else {
                successCallback(res);
            }
        }, function (res, status) {
            //           console.log(status);
            // status = "timeout" || "error" || "abort", "parsererror"
        })
    }
}

var tool = {
    initDate: function (type, date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        // var today = date.getDate();
        // if (today < 10) {
        // 	today = "0" + today;
        // }

        var lastDay;
        if (month == 0) {
            year = year - 1;
            var day = new Date(year, 12, 0);
            lastDay = day.getDate();
        } else {
            var day = new Date(year, month, 0);
            lastDay = day.getDate(); //获取某月最后一天
        }

        var getToday = new Date();
        var result = "";

        switch (type) {
            //年
            case "Y":
                // result = year + "-" + month;
                result = getToday.format("yyyy");
                break;
                //年、月
            case "YM":
                // result = year + "-" + month;
                result = getToday.format("yyyy-MM");
                break;
                //年、月、日
            case "YMD":
                // result = year + "-" + month + "-" + today;
                result = getToday.format("yyyy-MM-dd");
                break;
                //年、月、日
            case "yesteray":
                getToday.setDate(getToday.getDate() - 1);
                result = getToday.format("yyyy-MM-dd");
                var strTime = result.substring(result.length - 2);
                if (strTime.search("-") != -1) {
                    var strGetd = result.substring(result.length - 1);
                    result = getToday.format("yyyy-MM") + "-0" + strGetd;
                }
                break;
                //第一天
            case "first":
                result = year + "-" + month + "-" + "01";
                break;
                //最后一天
            case "last":
                result = year + "-" + month + "-" + lastDay;
                break;
            case "YMDh":
                // result = year + "-" + month + "-" + today;
                result = getToday.format("yyyy-MM-dd hh");
                break;
                //年、月、日、时
            case "YMDhm":
                // result = year + "-" + month + "-" + today;
                result = getToday.format("yyyy-MM-dd hh:mm");
                break;
                //年、月、日、时、分
        }

        return result;
    },
    getUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); // 匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; // 返回参数值
    }
}

/**
 *对Date的扩展，将 Date 转化为指定格式的String
 *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *例子：
 *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 *2017-06-27 变 20170627 “2017-06-27”.replace(/-/g, "")
 */
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

window.onload = energyObj.loadLanguageJS();
window.onload = energyObj.addLoadingDiv();