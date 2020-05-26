var MainScene = cc.Scene.extend({
    _layerName: "",
    _resCardLoaded: false,

    ctor: function(pname){
        this._super();

        this.minigameLayer = new cc.Node();
        this.addChild(this.minigameLayer, 3);
        this.popupLayer = new cc.Node();
        this.addChild( this.popupLayer, 5);

        // Btn Minigame
        var mngIcon = cc.createSpine("res/menu-minigame/Icon-MiniGame.json", "res/menu-minigame/Icon-MiniGame.atlas");
        mngIcon.setAnimation(0, 'Idle', true);
        mngIcon.setPosition( cc.p(1200, 570));
        this.addChild(mngIcon, 4);
        var btnOldPos = mngIcon.getPosition();
        var sprSize = cc.size(105,87);
        var locationInNode = null;

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event){
                locationInNode = mngIcon.convertToNodeSpace(touch.getLocation());
                var rect = cc.rect(0, 0, sprSize.width, sprSize.height);
                if (cc.rectContainsPoint(rect, {x: locationInNode.x + sprSize.width/2, y: locationInNode.y + sprSize.height/2 })){
                    // có thể nó muốn kéo đi nên ko open ở đây
                    btnOldPos = mngIcon.getPosition();
                    return true;
                }
                return false;
            },
            onTouchMoved: function(touch, event){
                var tL = touch.getLocation();
                mngIcon.setPosition( tL.x - locationInNode.x, tL.y - locationInNode.y);
            },
            onTouchEnded: function(touch, event){
                var newPos = mngIcon.getPosition();

                if( (newPos.x-btnOldPos.x)*(newPos.x-btnOldPos.x) + (newPos.y-btnOldPos.y)*(newPos.y-btnOldPos.y) < 200 ){
                    this._openMenuMNG();
                }

                if( newPos.x > cc.winSize.width/2 ) newPos.x = cc.winSize.width - sprSize.width/2;
                else newPos.x = sprSize.width/2;

                if( newPos.y < sprSize.height/2 ) newPos.y = sprSize.height/2;
                else if( newPos.y > cc.winSize.height-sprSize.height/2 ) newPos.y = cc.winSize.height-sprSize.height/2;

                mngIcon.runAction( new cc.MoveTo(0.15, newPos ) );
            }.bind(this),

        }, mngIcon);
        //
        this.wrapTimer = new cc.Sprite("res/menu-minigame/minigame-dem-taixiu.png");
        this.wrapTimer.setPosition(29, 37);
        mngIcon.addChild( this.wrapTimer );
        this.wrapTimer.setVisible(false);
        //
        if( !pname ) pname = "home";
        this.changePage(pname);
    },
    _openMenuMNG: function(){
        var tagMNG = 11129;
        var _touched = false;

        this.removeChildByTag(tagMNG);

        var colorLayer = new cc.LayerColor(cc.color(0,0,0,255), cc.winSize.width, cc.winSize.height);
        colorLayer.setOpacity(0);
        colorLayer.setTag(tagMNG);

        this.addChild(colorLayer, 4); // >= btn, < popup

        var bg = new cc.Sprite("res/menu-minigame/bg-minigame.png");
        bg.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        bg.setCascadeOpacityEnabled(true);
        bg.setRotation(180);
        bg.setOpacity(0);
        colorLayer.addChild(bg);

        var arr = [
            {img: "res/menu-minigame/et-icon.png", x: 220, y: 420, gid: "ET"},
            {img: "res/menu-minigame/3la-icon.png" , x: 225, y: 8},
            {img: "res/menu-minigame/larva-icon.png" , x: 430, y: 220},
            {img: "res/menu-minigame/nhiemvu-icon.png" , x: 10, y: 215},
            {img: "res/menu-minigame/minipoker-icon.png" , x: 378, y: 68, gid: "MINIPOKER"},
            {img: "res/menu-minigame/taixiu-icon.png" , x: 67, y: 65, gid: "TAIXIU"},
            {img: "res/menu-minigame/thiendia-icon.png" , x: 375, y: 370},
            {img: "res/menu-minigame/tomcuaca-icon.png" , x: 63, y: 368},
        ];

        for( var i=arr.length-1; i>= 0; i-- ){
            var button = new newui.Button(arr[i].img, function(btn){
                MH.openGame( btn._gid );
                if( _touched ) return;
                _touched = true;
                bg.runAction(cc.rotateTo(0.4, 180));
                colorLayer.runAction(cc.fadeOut(0.3));
                bg.runAction(cc.sequence(cc.delayTime(0.1), cc.fadeOut(0.3), cc.callFunc(function(){
                    colorLayer.removeFromParent(true);
                })));
            }.bind(this));

            button._gid = arr[i].gid;
            button.setPosition(cc.p(arr[i].x, arr[i].y));
            bg.addChild(button);
        }

        bg.runAction(cc.rotateTo(0.3, 0));
        bg.runAction(cc.fadeIn(0.3));

        colorLayer.runAction(cc.fadeTo(0.3, 180));

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event){
                return true;
            },
            onTouchEnded: function(touch, event){
                if( _touched ) return;
                _touched = true;
                bg.runAction(cc.rotateTo(0.4, 180));
                colorLayer.runAction(cc.fadeOut(0.3));
                bg.runAction(cc.sequence(cc.delayTime(0.1), cc.fadeOut(0.3), cc.callFunc(function(){
                    colorLayer.removeFromParent(true);
                })));
            }.bind(this),

        }, colorLayer);
    },
    _setButtonPosition: function(pos){
        var winSize = cc.winSize, _x = 0, _y = pos.y;
        var btnSize = this.btnMenu.getContentSize();

        if( pos.x > winSize.width/2 ) _x = winSize.width - btnSize.width/2;
        else _x = btnSize.width/2;

        if( _y < btnSize.height/2 ) _y = btnSize.height/2;
        else if( _y > winSize.height-btnSize.height/2 ) _y = winSize.height-btnSize.height/2;

        return cc.p(_x, _y);
    },

    getPageName: function(){
        return this._layerName;
    },
    changePage: function(pname, data){
        // ['loading', 'home', 'game', 'play', 'signup', 'gameslot', 'playslot']
        var newLayer = null;

        switch( pname ){
            case "loading":
                newLayer = new LobbyLayer();
                break;
            case "home":
                newLayer = new LobbyLayer();
                break;
            case "game":
            case "play":
                if( this._resCardLoaded ){
                    if( pname === "game" ) newLayer = new GameLayer(data);
                    else newLayer = new PlayLayer(data);
                }else{
                    var gameId = (pname === "play")? cc.Global.gameId : data.gameId;
                    var gameName = "";
                    cc.each(Constant.GAME_ID, function(v, k){
                        if( v === gameId ){
                            gameName = k;
                            return;
                        }
                    });

                    MH.loadRes(m_resources["CARD"], function(target, total, count){
                        MinigamePlugin.getInstance().postEvent(kCMD.PROGESS_OPEN_GAME, {total: total, count: count, game: gameName});
                    }, function(){
                        this._resCardLoaded = true;
                        this.changePage(pname, data);
                    }.bind(this));
                }
                break;
            case "slot":
                // data
                if( data === "LONGVUONG" ) newLayer = new LongVuong();
                else if( data === "DEADORALIVE" ) newLayer = new DeadOrAlive();
                break;
            default:
                cc.log("page not found "+pname);
                break;
        }

        if( newLayer ){
            var oldLayer = this.getChildByTag(1111);
            if( oldLayer ) this.removeChild( oldLayer, true );

            newLayer.setTag(1111);
            this.addChild(newLayer);
            this._layerName = pname;
        }
    },
    onEnter: function(){
        this._super();

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                if( !this._canTouch ) return false;
                if( this._isOpen ){
                    return true;//so large , alway true, then close AFTER
                }else{
                    sprSize = this.btnMenu.getContentSize();
                    oldPos = this.btnMenu.getPosition();

                    locationInNode = this.btnMenu.convertToNodeSpace(touch.getLocation());
                    // locationInNode.x += sprSize.width/2;
                    // locationInNode.y += sprSize.height/2;
                    var rect = cc.rect(0, 0, sprSize.width, sprSize.height);
                    if (cc.rectContainsPoint(rect, {x: locationInNode.x + sprSize.width/2, y: locationInNode.y + sprSize.height/2 })){
                        // có thể nó muốn kéo đi nên ko open ở đây
                        return true;
                    }
                    return false;
                }     
            }.bind(this),
            onTouchMoved: function (touch, event) {
                if( this._isOpen ) return;
                var tL = touch.getLocation();

                this.btnMenu.setPosition( cc.p( tL.x - locationInNode.x, tL.y - locationInNode.y ) );
            }.bind(this),
            onTouchEnded: function(touch, event){
                if( this._isOpen ){
                    this._close();
                }else {
                    var newPos = this.btnMenu.getPosition();
                    var posTo = this._setButtonPosition( newPos );

                    if( (newPos.x-oldPos.x)*(newPos.x-oldPos.x) + (newPos.y-oldPos.y)*(newPos.y-oldPos.y) < 200 ){
                        this._open();
                    }

                    oldPos = posTo;

                    this.btnMenu.runAction( cc.moveTo(0.15, posTo ) );
                }
            }.bind(this),
        }, this);
    }
});