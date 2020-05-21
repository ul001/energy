var baseUrlFromAPP = "http://116.236.149.165:18090";
var tokenFromAPP = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJleHAiOjE1OTEyNTU0NDksImlzcyI6ImFjcmVsIiwiYXVkIjoiYWNyZWwifQ.dqUbcmOQA4GQA8Z84uVghvoaXv5akyFpezDF5kym60Q";
//语言字段传参
var languageOption = "zh";

//iOS安卓基础传参
var u = navigator.userAgent,
  app = navigator.appVersion;
var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
//判断数组中是否包含某字符串
try {
  if (isIOS) {
    //ios系统的处理
    window.webkit.messageHandlers.iOS.postMessage(null);
    var storage = localStorage.getItem("accessToken");
    // storage = storage ? JSON.parse(storage):[];
    storage = JSON.parse(storage);
    baseUrlFromAPP = storage.baseurl;
    tokenFromAPP = storage.token;
    languageOption = storage.languageType;
  } else {
    baseUrlFromAPP = android.getBaseUrl();
    tokenFromAPP = android.getToken();
    languageOption = android.postLanguage();
  }
} catch (e) {
  languageOption = "en";
}

bui.config.ajax = {
   baseUrl: baseUrlFromAPP,
   headers: {"Authorization":tokenFromAPP}
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
    addLoadingDiv:function(){
        $("body main").append("<div id='loading'></div>");
        uiLoading=bui.loading({
            appendTo:"#loading",
            width: 40,
            height: 40,
            callback: function (argument) {
                console.log("clickloading")
            }
        })
    },
    showLoading:function(){
        uiLoading.show();
        uiLoading.text(Operation['ui_loading']);
    },
    hideLoading:function(){
        uiLoading.hide();
    },
}

window.onload = energyObj.loadLanguageJS();
window.onload = energyObj.addLoadingDiv();