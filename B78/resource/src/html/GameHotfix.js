/**
 * Created by kk on 1/17/2017.
 */

var hiepnh = hiepnh || {};
hiepnh.hotfixFunction = function (updateFunc) {
    cc.log("hotfixFunction "+Date.now());
    //cc.log(Date.now());
    hiepnh.initEvents();
    hiepnh.GamePaused = false;
    hiepnh.startUpdateBackground = function () {
        if(MyPixi.isDestroy) return;
        hiepnh._lastUpdateTime = Date.now();
        var frame_rate = 1000.0 / 60;

        var cb = function () {
            if(hiepnh._updateBackgroundFunc){
                window.clearTimeout(hiepnh._updateBackgroundFunc);
            }
            if(MyPixi.isDestroy) return;
            hiepnh.updateBackground();
            //if(!MyPixi.isDestroy)
            hiepnh._updateBackgroundFunc = window.setTimeout(cb, frame_rate);
        };
        hiepnh._updateBackgroundFunc = window.setTimeout(cb, frame_rate);
    };

    hiepnh.stopUpdateBackground = function () {
        hiepnh._lastUpdateTime = Date.now();
        if(hiepnh._updateBackgroundFunc){
            console.log("*********stopUpdateBackground************");
            window.clearTimeout(hiepnh._updateBackgroundFunc);
            hiepnh.updateBackground();
        }
    };

    hiepnh.updateBackground = function () {
        if(MyPixi.isDestroy) return;
        var now = Date.now();
        var dt = (now - hiepnh._lastUpdateTime)/ 1000;
        if(dt> 60) dt = 60;//ko co anim nao > 60 s ca =))
        hiepnh._lastUpdateTime = now;
        var frame_rate = 1.0/ 60.0;
        //cc.log("hotfix testt "+(dt/frame_rate));
        while(dt > 0){
            var deltaTime = dt < frame_rate ? dt : frame_rate;
            //cc.director._actionManager.update(deltaTime);
            //cc.director._scheduler.update(deltaTime);
            dt -= frame_rate;
            //cc.eventManager.dispatchEvent(cc.director._eventAfterUpdate);
            if(updateFunc) updateFunc();
            else console.log("*********GAMEHOTFIX not define updateFunc************");
        }
    };

    /*cc.director.pause = function () {
        //nothing
    };*/

    

    

    //yes
    window.onbeforeunload = function () {
        if(typeof window.LobbyClient != 'undefined') LobbyClient.getInstance().close();
        if(typeof window.MiniGameClient != 'undefined') MiniGameClient.getInstance().close();
    };
};

hiepnh.pause = function () {
    if(hiepnh.GamePaused == false){
        hiepnh.GamePaused = true;
        cc.log("pause");
        hiepnh.startUpdateBackground();

    }

};

hiepnh.resume =  function () {
    if(hiepnh.GamePaused == true){
        hiepnh.GamePaused = false;
        cc.log("resume");
        hiepnh.stopUpdateBackground();

    }

    //engine
    if (!this._paused) return;
    this._paused = false;
    // Resume audio engine
    /*if (cc.audioEngine) {
        cc.audioEngine.resumeMusic();
    }
    // Resume main loop
    this._runMainLoop();*/
};
hiepnh.isArray = function (obj) {
    return Array.isArray(obj) ||
        (typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Array]');
};
hiepnh.isUndefined = function (obj) {
    return typeof obj === 'undefined';
};
hiepnh.isObject = function (obj) {
    return typeof obj === "object" && Object.prototype.toString.call(obj) === '[object Object]';
};
hiepnh.initEvents= function () {
    var win = window, hidden;



    if (!hiepnh.isUndefined(document.hidden)) {
        hidden = "hidden";
    } else if (!hiepnh.isUndefined(document.mozHidden)) {
        hidden = "mozHidden";
    } else if (!hiepnh.isUndefined(document.msHidden)) {
        hidden = "msHidden";
    } else if (!hiepnh.isUndefined(document.webkitHidden)) {
        hidden = "webkitHidden";
    }

    var changeList = [
        "visibilitychange",
        "mozvisibilitychange",
        "msvisibilitychange",
        "webkitvisibilitychange",
        "qbrowserVisibilityChange"
    ];
    var onHidden = function () {
        hiepnh.pause();
    };
    var onShow = function () {
        hiepnh.resume();
    };

    if (hidden) {
        for (var i=0; i<changeList.length; i++) {
            document.addEventListener(changeList[i], function (event) {
                var visible = document[hidden];
                // QQ App
                visible = visible || event["hidden"];
                if (visible) onHidden();
                else onShow();
            }, false);
        }
    } else {
        win.addEventListener("blur", onHidden, false);
        win.addEventListener("focus", onShow, false);
    }

    if (navigator.userAgent.indexOf("MicroMessenger") > -1) {
        win.onfocus = function(){ onShow() };
    }

    if ("onpageshow" in window && "onpagehide" in window) {
        win.addEventListener("pagehide", onHidden, false);
        win.addEventListener("pageshow", onShow, false);
    }

    /*cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function () {
        cc.game.pause();
    });
    cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function () {
        cc.game.resume();
    });*/

};
hiepnh.isFunction = function(yourFunctionName){
    if (typeof yourFunctionName == 'function')
    {
        return true;
    }
    return false;
};