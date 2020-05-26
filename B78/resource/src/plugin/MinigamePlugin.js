var MinigamePlugin = (function() {
    var instance = null;
    var Clazz = cc.Class.extend({
    	allListener: {},
    	nodes: {},
    	autoPlay: {}, //{gid, ls[], b}
        ctor: function() {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            }else{
                // addListener autospin
            }
        },
        addListener: function (command, _listener, _target) {
            var arr = this.allListener[command];
            if (!arr) {
                arr = [];
                this.allListener[command] = arr;
            }
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] && arr[i].target == _target) {
                    return;
                }
            }
            arr.push({
                listener: _listener,
                target: _target
            });
        },
        removeListener: function (target) {
            for (var key in this.allListener) {
                if (!this.allListener.hasOwnProperty(key)) continue;
                var arr = this.allListener[key];
                for (var i = 0; i < arr.length;) {
                    if (arr[i] && arr[i].target == target) {
                        if (this.isBlocked) {
                            arr[i] = null;
                        }
                        else {
                            arr.splice(i, 1);
                            continue;
                        }
                    }
                    i++;
                }
            }
        },
        postEvent: function (command, event) {
           // this.prePostEvent(command, event);
            var arr = this.allListener[command];
            if (arr) {
                //cc.log("allListener length "+arr.length);
                this.isBlocked = true;
                for (var i = 0; i < arr.length;) {
                    var target = arr[i];
                    if (target) {
                        target.listener.apply(target.target, [command, event]);
                    }
                    else {
                        arr.splice(i, 1);
                        continue;
                    }
                    i++;
                }
                this.isBlocked = false;
            }
        },
        _onupdateGame: function(cmd, data){
        	// add listener auto spin
        },
		loginTaiXiu: function(){
        	if( this._logged ) cc.log("login TX again");
        	var sendObj = [
				command.ZonePluginMessage,
				Constant.CONSTANT.ZONE_NAME_MINI_GAME,
				miniGamePlugin.PLUGIN_TAI_XIU,
				{'cmd':CMD_OBSERVER.OBSERVER_TAI_XIU}
			];
			MiniGameClient.getInstance().send(sendObj);
        },
        getAutoPlay: function(gid){
        	for( var i=0; i<this.autoPlay.length; i++ ){
        		if( this.autoPlay[i].gid == gid ) return this.autoPlay[i];
        	}
        	return null;
        },
        open: function(k){
        	if( this.nodes[k] ){
				this.nodes[k].open(); // có thể click lại vào menu mở game đang mở sẵn!
				// if( this.autoPlay[k] ) this.nodes[k] = null; ??
			}else{
                MH.loadRes(m_resources[k], function(target, total, count){
                    MinigamePlugin.getInstance().postEvent(kCMD.PROGESS_OPEN_GAME, {total: total, count: count, game: k});
                }, function(){
                    MinigamePlugin.getInstance()._create(k);
                });
			}
        },
        close: function(k){
        	if( this.nodes[k] ){
        		if( this.nodes[k].autoPlay ){
        			this.autoPlay[k] = {
        				gameId: this.nodes[k].gameId,
						moneyType: this.nodes[k].moneyType,
						lines: this.nodes[k].lines,
						betting: this.nodes[k].betting
        			};
        		}
        		this.nodes[k].removeFromParent(true);
        		this.nodes[k] = null;
        	}

            // remove cache
            cc.each(m_resources[k], function(_url){
                cc.loader.release(_url);
                if( cc.isString(_url) ){
                    if( _url.endsWith(".png") || _url.endsWith(".jpg") ) cc.textureCache.removeTextureForKey(_url);
                    else if( _url.endsWith(".plist") ) cc.spriteFrameCache.removeSpriteFramesFromFile(_url);
                }
            });

        },
        _create: function(k){
        	var game = null;
        	switch(k){
				case "TAIXIU":
					game = new TaiXiu();
					break;
				case "MINIPOKER":
					game = new Minipoker();
					break;
				case "ET":
					game = new ET();
					break;
			}

			if( game ){
				cc.director.getRunningScene().minigameLayer.addChild(game);
				game.gameName = k;
				this.nodes[k] = game;

				if( this.autoPlay[k] ) game.initAutoPlay( this.autoPlay[k] );
				this.autoPlay[k] = null;
			}
        }
    });

    Clazz.getInstance = function() {
        if (!instance) {
            instance = new Clazz();
        }
        return instance;
    }
    return Clazz;
})();