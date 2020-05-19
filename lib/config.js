var baseUrlFromAPP = "http://116.236.149.165:8090/SubstationWEBV2/";
var tokenFromAPP = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1OTAwNDgwODksInVzZXJuYW1lIjoiaGFoYWhhIn0.7XrG1hOIM65AgGeIdu3JTpyCg3VDGANmnSTYExRvxsI";
var ipAddress = "http://116.236.149.165:8090";
var userId = "315";
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
    ipAddress = storage.ipAddress;
    userId = storage.userID;
    languageOption = storage.languageType;
  } else {
    baseUrlFromAPP = android.getBaseUrl();
    tokenFromAPP = android.getToken();
    ipAddress = android.getIpAddress();
    userId = android.getUserid();
    languageOption = android.postLanguage();
  }
} catch (e) {
  languageOption = "zh";
}

bui.config.ajax = {
   baseUrl: baseUrlFromAPP,
   headers: {"Authorization":tokenFromAPP}
}