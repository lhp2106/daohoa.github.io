/**
 * Created by kk on 2/27/2017.
 */

var HttpRequest = HttpRequest || {};
HttpRequest.RES_SUCCESS = 0;
HttpRequest.RES_ERROR = 1;
HttpRequest.RES_ABOUT = 2;

HttpRequest.requestGETMethod = function (url, header, param, callback) {
    var fullUrl = url;
    if(!fullUrl.endsWith("?")){
        fullUrl += "?";
    }

    if(param){
        var firstParam = true;
        for (var key in param) {
            if(firstParam){
                firstParam = false;
            }
            else{
                fullUrl += "&";
            }
            if(!param.hasOwnProperty(key)) continue;
            fullUrl += key + "=" + param[key].toString();
        }
    }
    //cc.log("get request: "+fullUrl);

    // var request = new XMLHttpRequest();
    var request = cc.loader.getXMLHttpRequest();

    request.open("GET", fullUrl);

    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    if(header){
        for (var key in header) {
            if(!header.hasOwnProperty(key)) continue;
            request.setRequestHeader(key, header[key].toString());
        }
    }
    
    var loadCallback = function () {
        request.removeEventListener('load', loadCallback);
        request.removeEventListener('error', errorCallback);
        if (request._timeoutId >= 0) {
            clearTimeout(request._timeoutId);
        }
        else {
            request.removeEventListener('timeout', timeoutCallback);
        }
        if (request.readyState === 4) {
            (request.status === 200||request.status === 0) ? callback(HttpRequest.RES_SUCCESS, JSON.parse(request.responseText)) : callback(HttpRequest.RES_ERROR, null);
        }
    };
    var errorCallback = function () {
        request.removeEventListener('load', loadCallback);
        request.removeEventListener('error', errorCallback);
        if (request._timeoutId >= 0) {
            clearTimeout(request._timeoutId);
        }
        else {
            request.removeEventListener('timeout', timeoutCallback);
        }
        callback(HttpRequest.RES_ERROR, null);
    };
    var timeoutCallback = function () {
        request.removeEventListener('load', loadCallback);
        request.removeEventListener('error', errorCallback);
        if (request._timeoutId >= 0) {
            clearTimeout(request._timeoutId);
        }
        else {
            request.removeEventListener('timeout', timeoutCallback);
        }
        callback(HttpRequest.RES_ERROR, null);
    };
    request.addEventListener('load', loadCallback);
    request.addEventListener('error', errorCallback);
    if (request.ontimeout === undefined) {
        request._timeoutId = setTimeout(function () {
            timeoutCallback();
        }, request.timeout);
    }
    else {
        request.addEventListener('timeout', timeoutCallback);
    }

    // request.addEventListener("timeout", function (e) {
    //     console.log("timeout httprequest");
    //     callback(HttpRequest.RES_ERROR, null);
    // });
    // request.addEventListener("load", function (e) {
    //     //console.log("RES_SUCCESS "+JSON.parse (request.responseText));
    //     callback(HttpRequest.RES_SUCCESS, JSON.parse(request.responseText));
    // });
    // request.addEventListener("error", function (e) {
    //     callback(HttpRequest.RES_ERROR, null);
    // });
    // request.addEventListener("abort", function (e) {
    //     callback(HttpRequest.RES_ABOUT, null);
    // });
    
    //request.timeout = 10000;
    request.send();
};

HttpRequest.requestPOSTMethod = function (url, header, param, callback) {
    var fullUrl = url;

    // var request = new XMLHttpRequest();
    var request = cc.loader.getXMLHttpRequest();

    request.open("POST", fullUrl);

    request.setRequestHeader("Content-Type","application/json");
    if(header){
        for (var key in header) {
            if(!header.hasOwnProperty(key)) continue;
            request.setRequestHeader(key, header[key].toString());
        }
    }

    request.onreadystatechange = function (){
        if (request.readyState == 4){
            callback(HttpRequest.RES_SUCCESS, JSON.parse(request.responseText));
        }else{
            callback(HttpRequest.RES_ERROR, null);
        }
    };

    // request.addEventListener("timeout", function (e) {
    //     console.log("timeout httprequest");
    //     callback(HttpRequest.RES_ERROR, null);
    // });
    // request.addEventListener("load", function (e) {
    //     //console.log("RES_SUCCESS "+JSON.parse (request.responseText));
    //     callback(HttpRequest.RES_SUCCESS, JSON.parse(request.responseText));
    // });
    // request.addEventListener("error", function (e) {
    //     callback(HttpRequest.RES_ERROR, null);
    // });
    // request.addEventListener("abort", function (e) {
    //     callback(HttpRequest.RES_ABOUT, null);
    // });
    request.timeout = 5000;
    request.send( JSON.stringify(param) );
};

HttpRequest.requestGETMethod_FB = function (url, header, param, callback) {
    var fullUrl = url;
    /*if(!fullUrl.endsWith("?")){
        fullUrl += "?";
    }*/

    if(param){
        var firstParam = true;
        for (var key in param) {
            if(firstParam){
                firstParam = false;
            }
            else{
                fullUrl += "&";
            }
            if(!param.hasOwnProperty(key)) continue;
            fullUrl += key + "=" + param[key].toString();
        }
    }

    //cc.log("get request: "+fullUrl);

    // var request = new XMLHttpRequest();
    var request = cc.loader.getXMLHttpRequest();
    request.open("GET", fullUrl);

    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    if(header){
        for (var key in header) {
            if(!header.hasOwnProperty(key)) continue;
            request.setRequestHeader(key, header[key].toString());
        }
    }

    request.onreadystatechange = function (){
        if (request.readyState == 4){
            callback(HttpRequest.RES_SUCCESS, JSON.parse(request.responseText));
        }else{
            callback(HttpRequest.RES_ERROR, null);
        }
    };

    // request.addEventListener("load", function (e) {
    //     callback(HttpRequest.RES_SUCCESS, JSON.parse(request.responseText));
    // });
    // request.addEventListener("error", function (e) {
    //     callback(HttpRequest.RES_ERROR, null);
    // });
    // request.addEventListener("abort", function (e) {
    //     callback(HttpRequest.RES_ABOUT, null);
    // });

    request.send();
};
