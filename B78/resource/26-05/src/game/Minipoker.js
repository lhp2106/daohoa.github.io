var Minipoker = cc.Node.extend({
	autoPlay: false,
	betting: 1000,
	lines: [0],
	gameId: SLOT_GAME_MINI.MINI_POKER,
	moneyType: MoneyType.Gold,
	_dataJackpot: [{J:0},{J:0},{J:0}],
	_onSpin: false,
	_onRunSpin: false,
	_spinFast: false,
	_session: 0,
	_spinning: {
    	sid: 0,
    	at: 0
    },
	ctor: function(){
		this._super();

		var thiz = this;

		this.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));

		var bg = new cc.Sprite("res/minipoker/bg.png");
		this.addChild(bg);

		///
		var labelQuy = new newui.LabelBMFont("", "res/minipoker/font/font-minigame-export.fnt", cc.TEXT_ALIGNMENT_LEFT);
		labelQuy.setScale(0.75);
		labelQuy.setAnchorPoint(cc.p(0 ,0));
		labelQuy.setPosition(cc.p(-160, 125));
        this.addChild(labelQuy);
        this.labelQuy = labelQuy;

		var locationInNode = null;
        var sprSize = null;
		cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                sprSize = bg.getContentSize();
                locationInNode = bg.convertToNodeSpace(touch.getLocation());
                var rect = cc.rect(0, 0, sprSize.width, sprSize.height);
                if (cc.rectContainsPoint(rect, locationInNode)){
                	return true;
                }
                return false;
            },
            onTouchMoved: function (touch, event) {
                var tL = touch.getLocation();

                var newPos = cc.p( tL.x +sprSize.width/2 - locationInNode.x, tL.y+sprSize.height/2 - locationInNode.y );
                if( newPos.x < -160 ) newPos.x = -160;
                else if( newPos.x > 1390 ) newPos.x = 1390;

                if( newPos.y < -75 ) newPos.y = -75;
                else if( newPos.y > 700 ) newPos.y = 700;

                thiz.setPosition( newPos );
            }
        }, this);

        var stencil = new cc.Sprite("res/minipoker/shadows2.png") //new cc.DrawNode();
        stencil.setPosition(cc.p(0, -3));
        stencil.setAnchorPoint(cc.p(0,0));
        // stencil.drawPoly(
        //     [cc.p(0, 0),cc.p(532, 0),cc.p(532,157),cc.p(0, 157)],
        //     cc.color(255, 0, 0, 255),
        //     0,
        //     cc.color(255, 255, 255, 0)
        // );

        var khung = new cc.ClippingNode(stencil);

        khung.setPosition(cc.p(-267, -40));
        khung.alphaThreshold = 0;
        this.addChild(khung);

        var khungShadows = new cc.Sprite("res/minipoker/shadows.png");
        khungShadows.setPosition(cc.p(0, 36));
        this.addChild( khungShadows );

        // cc.spriteFrameCache.addSpriteFrames("res/minipoker/cards.plist");

        this.columns = [];

        for(var i=0; i<5; i++){
        	var col = new cc.Node();
        	col.setPosition(cc.p(i*105, 0));
        	khung.addChild(col);
        	this.columns.push(col);

			var icon = new cc.Sprite("#"+(i+1)+"c.png");
            icon.setPosition(cc.p(0,0));
            icon.setAnchorPoint(cc.p(0,0));
            col.addChild(icon);

            var itemBlur = new cc.Sprite("res/minipoker/card-slide.png");
        	itemBlur.setPosition(cc.p(0,0)); // reset y when spin
        	itemBlur.setAnchorPoint(cc.p(0,0));
        	itemBlur.setVisible(false);
        	col.addChild(itemBlur);
        }

        /// 
        this.initButton();
	},
	close: function(){
		MinigamePlugin.getInstance().close(this.gameName);
	},
	open: function(){
		this.setVisible(true);
		this.setPosition(cc.winSize.width/2, cc.winSize.height/2+100);
	},
	initAutoPlay: function(data){
		if( !data ) return;
		this.moneyType = data.moneyType;
		this.lines = data.lines;
		this.changeBetting(data.betting);
		this.changeAutoSpin(true);// se tu dong quay
	},
	notify: function(mes, t){
		if( !mes ) return;

		var spr = new cc.Sprite("res/minipoker/notify.png");
		spr.setPosition(cc.p(0, 28));
		this.addChild(spr, 99);

		var mes = new cc.LabelTTF(mes, "Font_Default", 28);
		mes.setPosition(cc.p(spr.width/2, 30));
		spr.addChild(mes);

		if( !t ) t = 3000;

		this.scheduleOnce(function(){
			spr.removeFromParent();
		}, t/1000);
	},
	changeBetting: function(bet){
		switch(bet){
			case 100:
				this.btn100.setActive(true);
				this.btn1K.setActive(false);
				this.btn10K.setActive(false);
				this.betting = bet;
				break;
			case 1000:
				this.btn100.setActive(false);
				this.btn1K.setActive(true);
				this.btn10K.setActive(false);
				this.betting = bet;
				break;
			case 10000:
				this.btn100.setActive(false);
				this.btn1K.setActive(false);
				this.btn10K.setActive(true);
				this.betting = bet;
				break;
		}
	},
	setQuy: function(arr){
		var _new;
		switch( this.betting ){
			case 100:
				//_old = this._dataJackpot[0].J;
				_new = arr[0].J;
				break;
			case 1000:
				//_old = this._dataJackpot[1].J;
				_new = arr[1].J;
				break;
			case 10000:
				//_old = this._dataJackpot[2].J;
				_new = arr[2].J;
				break;
			default:
				//_old = 0;
				_new = 0;
				break;
		}

		// NumberRun.add(this.labelQuy, _old, _new, 1);
		this.labelQuy.countTo(_new, 1);
		// MH.countTo(_new, this.labelQuy);
		this._dataJackpot = arr;
	},
	initButton: function(){
		var thiz = this;
		var btnClose = new ccui.Button("res/minipoker/close-btn.png");
		btnClose.setPosition(cc.p(255, 180));
		this.addChild(btnClose);
		btnClose.addTouchEventListener(function(sender, type){
			if( type === ccui.Widget.TOUCH_ENDED ) this.close();
		}, this);

		var btnBXH = new ccui.Button("res/minipoker/bxh-icon.png");
		btnBXH.setPosition(cc.p(0, 180));
		this.addChild(btnBXH);

		var btnLSGD = new ccui.Button("res/minipoker/lsgd-icon.png");
		btnLSGD.setPosition(cc.p(-70, 180));
		this.addChild(btnLSGD);

		var btnHELP = new ccui.Button("res/minipoker/help-icon.png");
		btnHELP.setPosition(cc.p(70, 180));
		this.addChild(btnHELP);

		//
		var btn100 = new newui.Button(["res/minipoker/100_inactive.png", "res/minipoker/100.png"], function(){
			if( thiz._onSpin || thiz.autoPlay ) thiz.notify('Đang quay, xin chờ ..', 800);
			else thiz.changeBetting(100);
		}, this);
		btn100.setPosition(cc.p(-100, -136));
		this.addChild(btn100);
		this.btn100 = btn100;

		var btn1K = new newui.Button(["res/minipoker/1k_inactive.png", "res/minipoker/1k.png"], function(){
			if( thiz._onSpin || thiz.autoPlay ) thiz.notify('Đang quay, xin chờ ..', 800);
			else thiz.changeBetting(1000);
		}, this);
		btn1K.setPosition(cc.p(0, -136));
		this.addChild(btn1K);
		this.btn1K = btn1K;

		var btn10K = new newui.Button(["res/minipoker/10k_inactive.png", "res/minipoker/10k.png"], function(){
			if( thiz._onSpin || thiz.autoPlay ) thiz.notify('Đang quay, xin chờ ..', 800);
			else thiz.changeBetting(10000);
		}, this);
		btn10K.setPosition(cc.p(100, -136));
		this.addChild(btn10K);
		this.btn10K = btn10K;

		var btnTuquay = new newui.Button(["res/minipoker/tuquay-btn.png","res/minipoker/dung-btn.png"], function(){
			thiz.changeAutoSpin();
		}, this);
		btnTuquay.setPosition(cc.p(100, -75));
		this.addChild(btnTuquay);
		this.btnTuquay = btnTuquay;

		var btnQuaynhanh = new newui.Button(["res/minipoker/quaynhanh-btn.png", "res/minipoker/quaynhanh.png"], function(){
			thiz._spinFast = !thiz._spinFast;
			btnQuaynhanh.setActive(thiz._spinFast);
		}, this);
		btnQuaynhanh.setPosition(cc.p(-92, -75));
		this.addChild(btnQuaynhanh);

		var spineIcon = cc.createSpine("res/minipoker/MiniPoker-Quay.json", "res/minipoker/MiniPoker-Quay.atlas");
		spineIcon.setPosition( cc.p(304, 25) );
		this.addChild(spineIcon, -1);

		var btnQuay = new newui.Button(["res/minipoker/cangat.jpg"], function(){
			if( thiz._onSpin || thiz.autoPlay ){
				thiz.notify('Đang quay vui lòng chờ', 1000);
			}else{
				thiz._sendRequestSpin();
			}
		}, this);
		btnQuay.setPosition(cc.p(320, 60));
		btnQuay.setOpacity(0);
		this.addChild(btnQuay, 5);
		btnQuay.spineIcon = spineIcon;
		this.btnQuay = btnQuay;
	},
	_onupdateGame: function(cmd, data){
		if( data[1].gid != this.gameId ) return;

		switch( parseInt(cmd) ){
			case CMD_SLOT_MACHINE.JACKPOT :
				// cc.log("mnp jackpot", data);
				this.setQuy( data[1].Js );
				break;
			case CMD_SLOT_MACHINE.SPIN :
				cc.log("spin data mnp", data);
				this.onReceiveSpin( data[1] );
				break;
			default:
				break;
		}
	},
	_sendRequestSpin: function(){
		// cc.log("_sendRequestSpin");
		var thiz = this;
		var	sendObj = [
			command.ZonePluginMessage,
			Constant.CONSTANT.ZONE_NAME_MINI_GAME,
			miniGamePlugin.PLUGIN_SLOT_GAME,
			{
				'cmd':CMD_SLOT_MACHINE.SPIN,
				'gid':thiz.gameId,
				'aid':thiz.moneyType,
				'ls':thiz.lines,
				'b':thiz.betting
			}
		];

		MiniGameClient.getInstance().send(sendObj);
		this._spinning.sid = -1;
	    this._spinning.at = new Date().getTime();
		this._onSpin = true;
		this.btnQuay.spineIcon.setAnimation(0, 'Spine', false);

		this.playColSpin(0);
		this.scheduleOnce(function(){
			thiz.playColSpin(1);
		}, 0.1);
		this.scheduleOnce(function(){
			thiz.playColSpin(2);
		}, 0.2);
		this.scheduleOnce(function(){
			thiz.playColSpin(3);
		}, 0.3);
		this.scheduleOnce(function(){
			thiz.playColSpin(4);
		}, 0.4);

		this.scheduleOnce(function(){
			if( thiz._spinning.sid == -1 && new Date().getTime() - thiz._spinning.at > 50000 ){
	    		thiz.forceStopSpin();
	    	}
		}, 60);
	},
	handleSpinDone: function(){
		this._onSpin = false;

		LobbyRequest.getInstance().requestUpdateMoney();

		if( this.autoPlay ){
			this._sendRequestSpin();
		}
	},
	_winner: function(data){
		var thiz = this;
		var n = data.mX,
			b = data.b,
			nohu = data.iJ;
		// cc.log("_winner", data);
		if( !n ){
			this.handleSpinDone();
		}else{
			var _arr = [
				{
					name: 'Đôi',
					money: [250, 2500,25000],
					texture: "res/minipoker/txtDoiJ.png"
				},
				{
					name: 'Hai Đôi',
					money: [500, 5000, 50000],
					texture: "res/minipoker/txtHaiDoi.png"
				},
				{
					name: 'Sám',
					money: [800, 8000,80000],
					texture: "res/minipoker/txtSam.png"
				},
				{
					name: 'Sảnh',
					money: [1300, 13000,130000],
					texture: "res/minipoker/txtSanh.png"
				},
				{
					name: 'Thùng',
					money: [2000,20000,200000],
					texture: "res/minipoker/txtThung.png"
				},
				{
					name: 'Cù Lũ',
					money: [5000,50000,500000],
					texture: "res/minipoker/txtCuLu.png"
				},
				{
					name: 'Tứ Quý',
					money: [15000,150000,1500000],
					texture: "res/minipoker/txtTuQuy.png"
				},
				{
					name: 'Thùng Phá Sảnh',
					money: [100000,1000000,10000000],
					texture: "res/minipoker/txtThungPhaSanh.png"
				}
			];

			var _texture;
			var k;
			if( b == 100 ) k = 0;
			else if( b == 1000 ) k = 1;
			else if( b == 10000 ) k = 2;
			if( k===0 || k === 1 || k === 2 ){
				for( var i=0; i<_arr.length; i++ ){
					if( n == _arr[i].money[k] ){
						// _name = _arr[i].name;
						_texture = _arr[i].texture;

						// if( i == _arr.length-1 ){
						// 	_lightBorder += ' thungphasanh';
						// }
						break;
					}
				}
			}

			var wrap = new cc.Node();
			wrap.setCascadeOpacityEnabled(true);
				
			var imgType = new cc.Sprite(_texture);
			imgType.setPosition(cc.p(0, 40));
			wrap.addChild(imgType);

			var gjackpot = new cc.LabelBMFont("+"+n, "res/minipoker/0123456789export.fnt");
			gjackpot.setScale(0.7);
			gjackpot.setPosition(cc.p(0, -10));
	        wrap.addChild(gjackpot);

	        this.addChild(wrap, 999);

	        wrap.setOpacity(0);

	        wrap.runAction(cc.fadeIn(0.3));
	        wrap.runAction(cc.sequence(cc.moveTo(0.5, cc.p(0, 50)), cc.delayTime(2) ,cc.callFunc(function(){
	        	wrap.removeFromParent(true);
	        	thiz.handleSpinDone();
	        })));
		}
	},
	changeAutoSpin: function(s){
		// this.autoPlay = s;

		if( arguments.length == 0 ) s = !this.autoPlay;

		if( s && !this._onSpin ) this._sendRequestSpin();

		this.autoPlay = s;

		//change button stage
		this.btnTuquay.setActive(s);
	},
	hasFreeSpin: function(n){
		cc.log("hasFreeSpin", n);

		if( n ){
			if( this.labelFreeSpin ){
				this.labelFreeSpin.setString("Lượt quay miễn phí: "+n);
			}else{
				this.labelFreeSpin = new cc.LabelTTF("Lượt quay miễn phí: "+n, "Font_Default", 28); 
				this.labelFreeSpin.setPosition(cc.p(0, -40));
				this.addChild(this.labelFreeSpin, 5);
			}
		}else{
			if( this.labelFreeSpin ){
				this.labelFreeSpin.removeFromParent(true);
				this.labelFreeSpin = null;
			}
		}
	},
	_onReconnectGame: function(){
		cc.log('_onReconnectGame MNP');
		MiniGameClient.getInstance().observerByGameID(this.gameId);
	},
	_onObserverResponse: function( cmd, data ){
		cc.log('_onObserverResponse LongVuong');
		var data = MiniGameClient.getInstance().getObserverDataByGameId( this.gameId );

		if( data && data.fss && data.fss.length ){
			for( var i = 0; i<data.fss.length; i++  ){
				if( data.fss[i].aid == this.moneyType  && data.fss[i].b == this.betting ){
					this.hasFreeSpin( data.fss[i].fs );
					break;
				}
			}
			MiniGameClient.getInstance().resetObserverDataByGameId( this.gameId );
		}
	},
	setSession: function(sid){
		this._session = sid;
		this._spinning.sid = sid;
	},
	playColSpin: function(i){
		var col = this.columns[i];
		var _hBlur = col.children[1].height;
		col.children[0].visible = false;
		col.children[1].visible = true;
		col.children[1].runAction( cc.repeatForever(cc.sequence( cc.moveTo(1, cc.p(0, -_hBlur*7/8)), cc.callFunc( function(){col.children[1].y = 0;} ))));
	},
	stopColSpin: function(i){
		this.columns[i].children[0].y = -20;
		this.columns[i].children[0].visible = true;
		this.columns[i].children[0].runAction( cc.moveTo(0.1, cc.p(0,0)) );

		this.columns[i].children[1].visible = false;
		this.columns[i].children[1].y = 0;
		this.columns[i].children[1].stopAllActions();
	},
	forceStopSpin: function(){
		var thiz = this;
		this.stopColSpin(0);
		this.scheduleOnce(function(){
			thiz.stopColSpin(1);
		}, 0.2);
		this.scheduleOnce(function(){
			thiz.stopColSpin(2);
		}, 0.4);
		this.scheduleOnce(function(){
			thiz.stopColSpin(3);
		}, 0.5);
		this.scheduleOnce(function(){
			thiz.stopColSpin(4);
		}, 0.8);

		this.changeAutoSpin( false );
		this._onSpin = false;
	},
	onReceiveSpin: function(data){
		this.slotData = null;
		if( !data ){ // || this.onSpin
	        this.forceStopSpin();
	        return;
	    }
		if( data.mgs ){
			this.notify( data.mgs );
			this.handleSpinDone();
			return;
		}
		if( !data.sbs || data.sbs.length !== 5 ){
			this.forceStopSpin();
			return;
		}

		if( this._onSpin && this._spinning.sid == -1 ){
			this.slotData = data;
			this.runSpin();
			this.setSession( data.sid );
		}
	},
	runSpin: function(){
		var _delay = this._spinFast?0.5:2;

		cc.log('data', this.slotData.sbs);

		var thiz = this;
		this.scheduleOnce(function(){
			thiz.columns[0].children[0].setSpriteFrame(Utils.getCardFromServer( thiz.slotData.sbs[0] ).toString+".png");
			thiz.stopColSpin(0);
		}, 0+_delay);
		this.scheduleOnce(function(){
			thiz.columns[1].children[0].setSpriteFrame(Utils.getCardFromServer( thiz.slotData.sbs[1] ).toString+".png");
			thiz.stopColSpin(1);
		}, 0.2+_delay);
		this.scheduleOnce(function(){
			thiz.columns[2].children[0].setSpriteFrame(Utils.getCardFromServer( thiz.slotData.sbs[2] ).toString+".png");
			thiz.stopColSpin(2);
		}, 0.4+_delay);
		this.scheduleOnce(function(){
			thiz.columns[3].children[0].setSpriteFrame(Utils.getCardFromServer( thiz.slotData.sbs[3] ).toString+".png");
			thiz.stopColSpin(3);
		}, 0.6+_delay);
		this.scheduleOnce(function(){
			thiz.columns[4].children[0].setSpriteFrame(Utils.getCardFromServer( thiz.slotData.sbs[4] ).toString+".png");
			thiz.stopColSpin(4);
		}, 0.8+_delay);
		this.scheduleOnce(function(){
			thiz._winner( thiz.slotData );
			thiz.hasFreeSpin( thiz.slotData.fss );
		}, 1+_delay);
	},
	onEnter: function(){
		this._super();
		this.changeBetting(1000);

		MiniGameClient.getInstance().addListener( CMD_SLOT_MACHINE.JACKPOT.toString() , this._onupdateGame, this);
		MiniGameClient.getInstance().addListener( CMD_SLOT_MACHINE.SPIN.toString() , this._onupdateGame, this);
		MiniGameClient.getInstance().addListener( CMD_OBSERVER.OBSERVER_SLOT_RECONNECT , this._onReconnectGame, this);
		MiniGameClient.getInstance().addListener( '100' , this._onupdateGame, this);
		MiniGameClient.getInstance().addListener( kCMD.OBSERVER_RESPONSE , this._onObserverResponse, this);

		MiniGameClient.getInstance().observerByGameID(this.gameId);
	},
	onExit: function(){
		this._super();
		MiniGameClient.getInstance().removeObserverByGameID(this.gameId);
		MiniGameClient.getInstance().removeListener(this);
	}
});