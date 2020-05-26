/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var LoadingScene = cc.Scene.extend({
    _layer: null,
    _layerName: "loading",
    _resCardLoaded: false,
    _am : null,
    getPageName: function(){
        return this._layerName;
    },
    onEnter: function (){
        this._super();
        //
        var size = cc.winSize;
        var bg = new cc.Sprite("res/loading/loading_bg.jpg");
        bg.setPosition(size.width/2,size.height/2);
        this.addChild(bg, 0);

        var logo = new cc.Sprite("res/loading/logo_big.png");
        logo.setPosition(size.width/2, size.height/2+50);
        this.addChild(logo);
        // this.addTouchIcon(logo);

        var loading_bg = new cc.Sprite("res/loading/loading_bg.png");
        loading_bg.setPosition(size.width/2, size.height/2-150);
        this.addChild(loading_bg);

        var loading_pr = new ccui.LoadingBar();
        loading_pr.loadTexture("res/loading/loading.png");
        loading_pr.setPercent(0);
        loading_pr.setPosition(size.width/2, size.height/2-150);
        this.addChild(loading_pr);
        this.loading_pr = loading_pr;

        this.schedule(this.startLoading, 0.1);
    },
    startLoading: function(){
        this.unschedule(this.startLoading);
        if (!cc.sys.isNative){
            this.doLoadResource();
            return;
        }

        this._am = new jsb.AssetsManager("res/project_dev.manifest", jsb.fileUtils.getWritablePath() + "RsEx");
        this._am.retain();

        if (!this._am.getLocalManifest().isLoaded()){
            this.showNotify("ohhhhh Nooooooo");
            this.doLoadResource();
        }else{
            var listener = new jsb.EventListenerAssetsManager(this._am, function (event) {
                var scene;
                switch (event.getEventCode()) {
                    case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                        this.showNotify("No local manifest file found, skip assets update.");
                        this.doLoadResource();
                        break;
                    case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                        this.showNotify(event.getPercent() + "%");
                        break;
                    case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                    case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                        this.showNotify("Fail to download manifest file, update skipped.");
                        this.doLoadResource();
                        break;
                    case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                        this.showNotify("no need updateeee");
                        this.doLoadResource();
                        break;
                    case jsb.EventAssetsManager.UPDATE_FINISHED:
                        this.showNotify("Update finished. " + event.getMessage());
                        // require("ScriptTestTempFile.js");

                        // var lb = new ScriptTestTempLayer();
                        // lb.setPosition(cc.winSize.width/2, cc.winSize.height/2 - 100);
                        // this.addChild(lb, 0, 233);

                        // this.doLoadResource();

                        var hotUpdateSearchPaths = this._am.getLocalManifest().getSearchPaths();
                        // This value will be retrieved and appended to the default search path during game startup,
                        // please refer to samples/js-tests/main.js for detailed usage.
                        // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
                        cc.sys.localStorage.setItem("hotUpdateSearchPaths", JSON.stringify(hotUpdateSearchPaths));

                        // this.scheduleOnce(function(){cc.game.restart();}, 3.0);
                        // Restart the game to make all scripts take effect.
                        // cc.game.restart();

                        // cc.log("searchPaths " + searchPaths);

                        // cc.log("jsb.fileUtils "+ jsb.fileUtils.getSearchPaths());

                        // var searchPaths = jsb.fileUtils.getSearchPaths();

                        // // Insert hotUpdateSearchPaths to the beginning of searchPaths array
                        // Array.prototype.unshift.apply(searchPaths, hotUpdateSearchPaths);

                        // jsb.fileUtils.setSearchPaths(searchPaths);

                        // this._am.release();


                        this.doLoadResource();

                        break;
                    case jsb.EventAssetsManager.UPDATE_FAILED:
                        this.showNotify("Update failed. " + event.getMessage());
                        this.doLoadResource();
                        break;
                    case jsb.EventAssetsManager.ERROR_UPDATING:
                        this.showNotify("Asset update error: " + event.getAssetId() + ", " + event.getMessage());
                        break;
                    case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                        this.showNotify(event.getMessage());
                        this.doLoadResource();
                        break;
                    default:
                        break;
                }
            }.bind(this));
            cc.eventManager.addListener(listener, 1);
            this._am.update();
        }
    },
    showNotify: function(s){
        cc.log(s);
    },
    doLoadResource: function(){
        MH.loadRes(g_resources, function (result, count, loadedCount) {
            var percent = ((loadedCount+1) / count * 100) | 0;
            percent = Math.min(percent, 100);
            this.loading_pr.setPercent(percent);
        }.bind(this), function(){
            // cc.log("load done");
            cc.director.runScene(new MainScene());

            LobbyClient.getInstance().login( 'minhhoatest', '123qwe', function(){
                MH.loginDone( PlayerMe );
                // MH.openGame("TLMN");
            }, function(){
                MessageNode.getInstance().show('Đăng nhập không thành công');
            });
        });
    }
});