var MenuMinigame = cc.Node.extend({
	_isOpen: false,
    _canTouch: true,
    txTimeForBetting: 50000,
    txTimeForPayout: 25000,
	ctor: function(){
		this._super();
		this._createMenu();
	},
	_createMenu: function(){
		// var mngIcon = cc.createSpine("res/menu-minigame/Icon-MiniGame.json", "res/menu-minigame/Icon-MiniGame.atlas");
		// mngIcon.setAnimation(0, 'Idle', true);
		// this.addChild(mngIcon);
		// this.btnMenu = mngIcon;
		// mngIcon.setPosition( this._setButtonPosition(cc.p(1280, 570)));

		// this.wrapTimer = new cc.Sprite("res/menu-minigame/minigame-dem-taixiu.png");
		// this.wrapTimer.setPosition(29, 37);
		// this.btnMenu.addChild( this.wrapTimer );
		// this.wrapTimer.setVisible(false);
	},
	_open: function(){
		if( this._isOpen ) return;
		this._isOpen = true;
		var colorLayer = new cc.LayerColor(cc.color(0,0,0,255), cc.winSize.width, cc.winSize.height);
        this.addChild(colorLayer);
        colorLayer.setTag(2);

        colorLayer.setOpacity(0);

		var bg = new cc.Sprite("res/menu-minigame/bg-minigame.png");
		bg.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));
		bg.setCascadeOpacityEnabled(true);
		bg.setRotation(180);
		bg.setOpacity(0);
		// bg.setScale(0);
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
			var button = new newui.Button([arr[i].img], function(sender){
				MH.openGame( sender._gid );
	        	this._close();
			}.bind(this));
			button._gid = arr[i].gid;
			button.setPosition(cc.p(arr[i].x, arr[i].y));
			bg.addChild(button);
		}

		bg.runAction(cc.rotateTo(0.3, 0));
		bg.runAction(cc.fadeIn(0.3));

		colorLayer.runAction(cc.fadeTo(0.3, 180));
	},
	_close: function(){
		if( !this._isOpen ) return;
		this._isOpen = false;
		this._canTouch = false;

		var menuMNG = this.getChildByTag(2).children[0];

		menuMNG.runAction(cc.rotateTo(0.4, 180));
		menuMNG.getParent().runAction(cc.fadeOut(0.3));
		menuMNG.runAction(cc.sequence(cc.delayTime(0.1), cc.fadeOut(0.3), cc.callFunc(function(){
			this.removeChildByTag(2, true);
			this._canTouch = true;
		}, this)));
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
	_open: function(){
		if( this._isOpen ) return;
		this._isOpen = true;
		var colorLayer = new cc.LayerColor(cc.color(0,0,0,255), cc.winSize.width, cc.winSize.height);
        this.addChild(colorLayer);
        colorLayer.setOpacity(0);

		var bg = new cc.Sprite("res/menu-minigame/bg-minigame.png");
		bg.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));
		bg.setCascadeOpacityEnabled(true);
		bg.setRotation(180);
		bg.setOpacity(0);
		// bg.setScale(0);

		this.menuMNG = bg;
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
			var button = new newui.Button([arr[i].img], function(btn){
				MH.openGame( btn._gid );
	        	this._close();
			}.bind(this));

			button._gid = arr[i].gid;
			button.setPosition(cc.p(arr[i].x, arr[i].y));
			bg.addChild(button);
		}

		bg.runAction(cc.rotateTo(0.3, 0));
		bg.runAction(cc.fadeIn(0.3));
		//bg.runAction(cc.scaleTo(0.1, 1));
		colorLayer.runAction(cc.fadeTo(0.3, 180));
	},
	_close: function(){
		if( !this._isOpen ) return;
		this._isOpen = false;
		this._canTouch = false;

		this.menuMNG.runAction(cc.rotateTo(0.4, 180));
		this.menuMNG.getParent().runAction(cc.fadeOut(0.3));
		this.menuMNG.runAction(cc.sequence(cc.delayTime(0.1), cc.fadeOut(0.3), cc.callFunc(function(){
			this.menuMNG.getParent().removeFromParent(true);
			this.menuMNG = null;
			this._canTouch = true;
		}.bind(this))));

		//this.menuMNG.runAction(cc.sequence(cc.delayTime(0.2), cc.scaleTo(0.2, 0)));
	},
	runClock: function(_time, type){
		this.wrapTimer.setVisible(true);
		this.wrapTimer.removeAllChildren(true);
		this.unscheduleAllCallbacks();

		if( _time > 1000 ) _time = Math.floor(_time/1000);

		var _t = _time;
		if( _time < 10 ) _t = "0"+_time;

		var label = new cc.LabelTTF(_t, MH.getFont("Font_Default"), 22, cc.size(150, 50), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM);
		label.setPosition(22, 36);
		this.wrapTimer.addChild(label);
		this.schedule(function(){
			_time -= 1;
			if( _time < 0 ) return;
			if( _time < 10 ) _t = "0"+_time;
			else _t = _time;

			this.wrapTimer.children[0].setString( _t );
		}.bind(this), 1, _time, 0, "runClock");
	},
	_onupdateGame: function(cmd, data){
		// cc.log("menuminigame", data);
    	switch( parseInt(cmd) ){
    		case CMD_OBSERVER.OBSERVER_TAI_XIU:
    			if( data[1].tFB ){
					this.txTimeForBetting = data[1].tFB;
				}

				if( data[1].tFP ){
					this.txTimeForPayout = data[1].tFP;
				}
    			this.runClock(data[1].rmT, data[1].gS == 2);
    			break;
    		case CMD_TAI_XIU.ENABLE_BETTING:
    			this.runClock(this.txTimeForBetting, true);
    			break;
    		case CMD_TAI_XIU.CHARGE_MONEY:
    			this.runClock(this.txTimeForPayout);
    			break;
    	}
    },
	onEnter: function(){
		this._super();

		return;

		var locationInNode = null;
        var sprSize;
        var oldPos;

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


		// chi nghe thong tin can thiet de hien thi thơi gian
    	MiniGameClient.getInstance().addListener(CMD_OBSERVER.OBSERVER_TAI_XIU.toString(), this._onupdateGame, this);
		MiniGameClient.getInstance().addListener(CMD_TAI_XIU.ENABLE_BETTING.toString(), this._onupdateGame, this);
		MiniGameClient.getInstance().addListener(CMD_TAI_XIU.CHARGE_MONEY.toString(), this._onupdateGame, this);
	},
	onExit: function(){
		this._super();
		MiniGameClient.getInstance().removeListener(this);
	}
});