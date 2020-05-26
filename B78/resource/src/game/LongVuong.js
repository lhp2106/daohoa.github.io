var LongVuong = cc.Node.extend({
	_betting: 0,
	_lines: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
	_dataJackpot: [{J:0},{J:0},{J:0}],
	_gameId: SLOT_GAME_MINI.DAOCA,
	_moneyType: MoneyType.Gold,
	_isTrial: false,
	_onSpin: false,
	_spinFast: false,
	_slotData: null,
	_autoSpin: false,
	_session: false,
	_spinning: {
    	sid: 0,
    	at: 0
    },
    _itemHeight: 170,
	_gotoLobby: function(){
		this._betting = 0;

		this.removeAllChildren(true);

		var bg = new cc.Sprite("res/longvuong/bg-lobby.jpg");
		this.addChild(bg);

		var btnBack = new newui.Button(["res/longvuong/btn_back.png"], function(){
			MH.changePage("home");
		});
		btnBack.setPosition(cc.p(-592, 324));
		this.addChild(btnBack);

		var btnSetting = new newui.Button(["res/longvuong/icon_setting.png"], function(){
			//MH.changePage("home");
		});
		btnSetting.setPosition(cc.p(-510, 324));
		this.addChild(btnSetting);

		var btnLichsu = new newui.Button(["res/longvuong/icon_history.png"], function(){
			//MH.changePage("home");
		});
		btnLichsu.setPosition(cc.p(515, 324));
		this.addChild(btnLichsu);

		var btnVinhdanh = new newui.Button(["res/longvuong/icon_cup.png"], function(){
			//MH.changePage("home");
		});
		btnVinhdanh.setPosition(cc.p(595, 324));
		this.addChild(btnVinhdanh);

		var bgHeader = new cc.Sprite("res/longvuong/header.png");
		bgHeader.setPosition(cc.p(0, 315));
		this.addChild(bgHeader);

		var labelName = new cc.LabelTTF(PlayerMe.displayName, MH.getFont("UTM_SeagullBold"), 26);
		labelName.setPosition(cc.p(-290, 320));
		this.addChild(labelName);

		var labelSodu = new cc.LabelTTF("Số dư", MH.getFont("UTM_SeagullBold"), 26);
		labelSodu.setPosition(cc.p(200, 320));
		this.addChild(labelSodu);

		var labelGold = new newui.LabelBMFont( MH.numToText(PlayerMe.gold), "res/longvuong/fontJpLobby.fnt");
		labelGold.setPosition(cc.p(255, 295));
		labelGold.setAnchorPoint(cc.p(0 ,0));
		this.addChild(labelGold);


		var sp1 = cc.createSpine("res/longvuong/ThanCa_Lobby.json","res/longvuong/ThanCa_Lobby.atlas");
		// sp1.setMix("Intro", "Idle", 1.8);
		sp1.setAnimation(0, "Intro", false);
		this.addChild(sp1);
		sp1.addAnimation(0, "Idle", true, 1.8);

		var btnChoithu = new newui.Button(["res/longvuong/btn-lobby.png"], function(){
			this._betting = 10000;
			this._playGame();
		}.bind(this));
		btnChoithu.setPosition(cc.p(-460, 0));
		this.addChild(btnChoithu);

		var btnRoom1 = new newui.Button("res/longvuong/btn-lobby.png", function(){
			this._betting = 100;
			this._playGame();
		}.bind(this));
		btnRoom1.setPosition(cc.p(-160, 0));
		this.addChild(btnRoom1);
		var label1 = new newui.LabelBMFont("", "res/longvuong/fontJpLobby.fnt");
		label1.setPosition(cc.p(-155, -237));
		this.addChild(label1);
		this.labelJp1 = label1;
		
		var btnRoom2 = new newui.Button(["res/longvuong/btn-lobby.png"], function(){
			this._betting = 1000;
			this._playGame();
		}.bind(this));
		btnRoom2.setPosition(cc.p(150, 0));
		this.addChild(btnRoom2);
		var label2 = new newui.LabelBMFont("", "res/longvuong/fontJpLobby.fnt");
		label2.setPosition(cc.p(155, -237));
		this.addChild(label2);
		this.labelJp2 = label2;

		var btnRoom3 = new newui.Button("res/longvuong/btn-lobby.png", function(){
			this._betting = 10000;
			this._playGame();
		}.bind(this));
		btnRoom3.setPosition(cc.p(450, 0));
		this.addChild(btnRoom3);
		var label3 = new newui.LabelBMFont("", "res/longvuong/fontJpLobby.fnt");
		label3.setPosition(cc.p(455, -237));
		this.addChild(label3);
		this.labelJp3 = label3;
	},
	_playGame: function(){
		var thiz = this;

		this.removeAllChildren(true);
		// var bg = new cc.Sprite("res/longvuong/demo/2.png");
		// this.addChild(bg);
		var spBg = cc.createSpine("res/longvuong/ThanCa_ingame.json", "res/longvuong/ThanCa_ingame.atlas");
		spBg.setAnimation(0, "Idle", true);
		spBg.setPosition(cc.p(-cc.winSize.width/2, -cc.winSize.height/2));
		this.addChild(spBg);

		var spBongBong = cc.createSpine("res/longvuong/play/TienCa-BongBong.json", "res/longvuong/play/TienCa-BongBong.atlas");
		spBongBong.setAnimation(0, "Idle", true);
		spBongBong.x = 160;
		this.addChild(spBongBong);

		this.lineWrap = new cc.Node();
		this.lineWrap.setPosition(cc.p(140, 15));
		this.addChild(this.lineWrap);

		var stencil = new cc.DrawNode();
        stencil.drawPoly(
            [cc.p(0, 0),cc.p(948, 0),cc.p(948,510),cc.p(0, 510)],
            cc.color(255, 0, 0, 255),
            0,
            cc.color(255, 255, 255, 0)
        );
        var khung = new cc.ClippingNode(stencil);
        khung.setPosition(cc.p(-336, -220));
        this.addChild(khung);

        this.columns = [];

        var items = [], itemsBlur = [];
        for( var i=0; i<=6; i++ ){
        	items.push( cc.spriteFrameCache.getSpriteFrame(i+"_longvuong.png") );
        	itemsBlur.push( cc.spriteFrameCache.getSpriteFrame(i+"_blur_longvuong.png") );
        }

        for(var i=0; i<5; i++){
        	var col = new Column({
        		itemH: this._itemHeight,
        		items: items,
        		itemsBlur: itemsBlur,
        		speed: 2300,
        		backOut: 50,
        		index: i
        	});

        	col.setPosition(cc.p(i*185+100,0));
        	khung.addChild(col);
            this.columns[i] = col;

            col.onBeforeStop = function(target){
        		this.playItemAnimation(target);
        		// cc.log("onBeforeStop", target);
        	}.bind(this);

            this.playItemAnimation(col);
        }

		var stone = new cc.Sprite("res/longvuong/stone.png");
		stone.setPosition(cc.p(-505, -240));
		this.addChild(stone, 99);
		
		var spLongVuong = cc.createSpine("res/longvuong/LongVuong-Character.json", "res/longvuong/LongVuong-Character.atlas");
		spLongVuong.setAnimation(0, "Idle", true);
		this.addChild(spLongVuong, 100);
		this.spLongVuong = spLongVuong;
        spLongVuong.setCompleteListener(function(trackEntry){
            if(trackEntry){
                var animationName = trackEntry.animation ? trackEntry.animation.name : "";
                if(animationName != "Idle") spLongVuong.setAnimation(0, "Idle", true);
            }
        });

		var btnBack = new newui.Button(["res/longvuong/btn_back.png"], function(){
			this._gotoLobby();
		}.bind(this));
		btnBack.setPosition(cc.p(-592, 324));
		this.addChild(btnBack);

		var btnSetting = new newui.Button(["res/longvuong/icon_setting.png"], function(){
			//MH.changePage("home");
		});
		btnSetting.setPosition(cc.p(-510, 324));
		this.addChild(btnSetting);

		var btnLichsu = new newui.Button(["res/longvuong/icon_history.png"], function(){
			//MH.changePage("home");
		});
		btnLichsu.setPosition(cc.p(-435, 324));
		this.addChild(btnLichsu);

		var btnVinhdanh = new newui.Button(["res/longvuong/icon_cup.png"], function(){
			//MH.changePage("home");
		});
		btnVinhdanh.setPosition(cc.p(-360, 324));
		this.addChild(btnVinhdanh);

		var bgHeader = new cc.Sprite("res/longvuong/header.png");
		bgHeader.setPosition(cc.p(150, 320));
		this.addChild(bgHeader);

		var labelSodu = new cc.LabelTTF("Số dư", "UTM_SeagullBold", 26);
		labelSodu.setPosition(cc.p(-240, 320));
		this.addChild(labelSodu);

		var labelGold = new newui.LabelBMFont( MH.numToText(PlayerMe.gold), "res/longvuong/fontJpLobby.fnt");
		labelGold.setPosition(cc.p(-180, 295));
		labelGold.setAnchorPoint(cc.p(0 ,0));
		this.addChild(labelGold);

		var labelHu = new cc.LabelTTF("Hũ", MH.getFont("UTM_SeagullBold"), 26);
		labelHu.setPosition(cc.p(340, 320));
		this.addChild(labelHu);

		var labelJp = new newui.LabelBMFont("", "res/longvuong/fontJpLobby.fnt");
		labelJp.setPosition(cc.p(380, 295));
		labelJp.setAnchorPoint(cc.p(0 ,0));
		this.addChild(labelJp);
		this.labelJp = labelJp;

		var bgFooter = new cc.Sprite("res/longvuong/footer.png");
		bgFooter.setPosition(cc.p(0, -297));
		this.addChild(bgFooter);

		var btnQuay = new newui.Button(["res/longvuong/play/btn_quay.png"], function(){
			// thiz.spinStart();
			if( !this._onSpin ) this._sendRequestSpin();
		}.bind(this));
		btnQuay.setPosition(cc.p(122, -285));
		this.addChild(btnQuay);

		var btnDong = new newui.Button(["res/longvuong/play/btn_dong.png"], function(){

		});
		btnDong.setPosition(cc.p(-322, -295));

		this.addChild(btnDong);
		btnDong.setTitleText(this._lines.length);
		btnDong.setTitleFontName(MH.getFont("UTM_SeagullBold"));
		btnDong.setTitleFontSize(28);
		btnDong.setTitleColor(cc.color(255,235,59,255));
		btnDong.setTitlePadding(0, -27);
		btnDong.setTitleStroke(cc.color(41,91,155,255), 3);

		var btnCuoc = new newui.Button(["res/longvuong/play/btn_cuoc.png"], function(){

		});
		btnCuoc.setPosition(cc.p(-202, -295));
		this.addChild(btnCuoc);
		btnCuoc.setTitleText(MH.numToText(this._betting));
		btnCuoc.setTitleFontName(MH.getFont("UTM_SeagullBold"));
		btnCuoc.setTitleFontSize(28);
		btnCuoc.setTitleColor(cc.color(255,235,59,255));
		btnCuoc.setTitlePadding(0, -27);
		btnCuoc.setTitleStroke(cc.color(41,91,155,255), 3);

		var boardThang = new cc.Sprite("res/longvuong/play/board_thang.png");
		boardThang.setPosition(cc.p(305, -292));
		this.addChild(boardThang);

		var labelThang = new newui.LabelBMFont( "0", "res/longvuong/play/font.fnt");
		labelThang.setPosition(cc.p(308, -320));
		this.addChild(labelThang);

		var boardTongCuoc = new cc.Sprite("res/longvuong/play/board_tongcuoc.png");
		boardTongCuoc.setPosition(cc.p(-50, -292));
		this.addChild(boardTongCuoc);

		var labelTongCuoc = new newui.LabelBMFont( MH.numToText(this._betting*this._lines.length), "res/longvuong/play/font.fnt");
		this.addChild(labelTongCuoc);
		labelTongCuoc.setPosition(cc.p(-48, -320));

		var btnSieuToc = new newui.Button(["res/longvuong/play/btn_sieutoc.png", "res/longvuong/play/btn_sieutoc_stop.png"], function(){

		});
		btnSieuToc.setPosition(cc.p(463, -301));
		this.addChild(btnSieuToc);

		var btnTuQuay = new newui.Button(["res/longvuong/play/btn_tuquay.png", "res/longvuong/play/btn_tuquay_stop.png"], function(){
			this.changeAutoSpin( !this._autoSpin, true );
		}.bind(this));
		btnTuQuay.setPosition(cc.p(577, -301));
		this.addChild(btnTuQuay);
		this.btnTuQuay = btnTuQuay;

		var arr1 = [6,2,8,5,1,4,10,7,3,9];
		for( var i=0; i<arr1.length; i++ ){
			var btn = new cc.Sprite("res/longvuong/line/"+ arr1[i] +".png");
			btn.setPosition(cc.p(-340, 212-i*43));
			this.addChild(btn);
		}

		var arr2 = [16,12,19,14,13,17,18,15,11,20];
		for( var i=0; i<arr2.length; i++ ){
			var btn = new cc.Sprite("res/longvuong/line/"+ arr2[i] +".png");
			btn.setPosition(cc.p(615, 210-i*43));
			this.addChild(btn);
		}
	},
	playItemAnimation: function(col){
		var items = col.getChildren();

		for( var i=items.length-1; i>=0; i-- ){
			if( items[i].itemId === 1 ){
				var anim = cc.createSpine("res/longvuong/item/ItemGame.json", "res/longvuong/item/ItemGame.atlas");
				anim.setAnimation(0, "Item3_1_A", true);
				anim.itemId = items[i].itemId;
				anim.setPosition(items[i].getPosition());
				anim.setTag(items[i].getTag());
				anim.setName("animation");
				col.addChild(anim);
				col.removeChild(items[i], true);
			}
		}
	},
	_onupdateGame: function(cmd, data){
		if( data[1].gid != this._gameId ) return;
		switch( parseInt(cmd) ){
			case CMD_SLOT_MACHINE.JACKPOT :
				this.setQuy( data[1].Js );
				break;
			case CMD_SLOT_MACHINE.SPIN :
			case CMD_SLOT_MACHINE.SPIN_TRIAL :
				this.onReceiveSpin( data[1] );
				break;
			default:
				break;
		}
	},
	_sendRequestSpin: function(){
		var items = ["Thang", "Quay-1", "Quay-2", "Quay-3"];
		this.spLongVuong.setAnimation(0, items[Math.floor(Math.random()*items.length)], false);

		this.columns[0].runSpin();
		this.columns[1].runSpin();
		this.columns[2].runSpin();
		this.columns[3].runSpin();
		this.columns[4].runSpin();

		this.scheduleOnce(function(){
			this.forceStopSpin();
		}.bind(this), 2.5);
		return;

		// cc.log("_sendRequestSpin");
		// var thiz = this;
		// var	sendObj = [
		// 	command.ZonePluginMessage,
		// 	Constant.CONSTANT.ZONE_NAME_MINI_GAME,
		// 	miniGamePlugin.PLUGIN_SLOT_GAME,
		// 	{
		// 		'cmd':CMD_SLOT_MACHINE.SPIN_TRIAL,
		// 		'gid':thiz._gameId,
		// 		'aid':thiz._moneyType,
		// 		'ls':thiz._lines,
		// 		'b':thiz._betting
		// 	}
		// ];

		// MiniGameClient.getInstance().send(sendObj);

		this._spinning.sid = -1;
	    this._spinning.at = new Date().getTime();
		this._onSpin = true;

		var items = ["Thang", "Quay-1", "Quay-2", "Quay-3"];
		this.spLongVuong.setAnimation(0, items[Math.floor(Math.random()*items.length)], false);

		this.runColSpin(0);
		this.scheduleOnce(function(){
			thiz.runColSpin(1);
		}, 0.2);
		this.scheduleOnce(function(){
			thiz.runColSpin(2);
		}, 0.4);
		this.scheduleOnce(function(){
			thiz.runColSpin(3);
		}, 0.6);
		this.scheduleOnce(function(){
			thiz.runColSpin(4);
		}, 0.8);

		this.scheduleOnce(function(){
			if( thiz._spinning.sid == -1 && new Date().getTime() - thiz._spinning.at > 50000 ){
	    		thiz.forceStopSpin();
	    	}
		}, 60);
	},
	onReceiveSpin: function(data){
		var thiz = this;

	    this.slotData = null;

	    if( !data ){ // || this.onSpin
	        this.forceStopSpin();
	        return;
	    }
	    if( !this._isTrial && this._lines.length === 0 ){
	        this.notify('Chưa chọn dòng');
	        this.forceStopSpin();
	        return;
	    }
	    if( data.mgs ){
	        this.notify( data.mgs );
	        this.forceStopSpin();
	        return;
	    }
	    if( !data.hasOwnProperty('sbs') || data.sbs.length != 15 ){
	        this.forceStopSpin();
	        return;
	    }

	    if( this._onSpin && this._spinning.sid == -1 ){
	    	this._slotData = data;

		    this.runSpin();

		    if( this._isTrial ){
		        this._trialJackpot += 25*10000/100;
		        // this.setQuy( this._trialJackpot );
		    }

		    this.setSession( data.sid );
		    // console.log('spinStart', data);
	    } 
	},
	runSpin: function(){
		var _delay = this._spinFast?0.5:2;
		var thiz = this;

		var _prefix = "res/longvuong/item/";
		this.scheduleOnce(function(){
			// thiz.columns[0].children[0].children[0].setSpriteFrame(_prefix+thiz._slotData.sbs[0]+".png");
			// thiz.columns[0].children[0].children[1].setSpriteFrame(_prefix+thiz._slotData.sbs[5]+".png");
			// thiz.columns[0].children[0].children[2].setSpriteFrame(_prefix+thiz._slotData.sbs[10]+".png");
			thiz.stopColSpin(0);
		}, 0+_delay);
		this.scheduleOnce(function(){
			// thiz.columns[1].children[0].children[0].setSpriteFrame(_prefix+thiz._slotData.sbs[1]+".png");
			// thiz.columns[1].children[0].children[1].setSpriteFrame(_prefix+thiz._slotData.sbs[6]+".png");
			// thiz.columns[1].children[0].children[2].setSpriteFrame(_prefix+thiz._slotData.sbs[11]+".png");
			thiz.stopColSpin(1);
		}, 0.2+_delay);
		this.scheduleOnce(function(){
			// thiz.columns[2].children[0].children[0].setSpriteFrame(_prefix+thiz._slotData.sbs[2]+".png");
			// thiz.columns[2].children[0].children[1].setSpriteFrame(_prefix+thiz._slotData.sbs[7]+".png");
			// thiz.columns[2].children[0].children[2].setSpriteFrame(_prefix+thiz._slotData.sbs[12]+".png");
			thiz.stopColSpin(2);
		}, 0.4+_delay);
		this.scheduleOnce(function(){
			// thiz.columns[3].children[0].children[0].setSpriteFrame(_prefix+thiz._slotData.sbs[3]+".png");
			// thiz.columns[3].children[0].children[1].setSpriteFrame(_prefix+thiz._slotData.sbs[8]+".png");
			// thiz.columns[3].children[0].children[2].setSpriteFrame(_prefix+thiz._slotData.sbs[13]+".png");
			thiz.stopColSpin(3);
		}, 0.6+_delay);
		this.scheduleOnce(function(){
			// thiz.columns[4].children[0].children[0].setSpriteFrame(_prefix+thiz._slotData.sbs[4]+".png");
			// thiz.columns[4].children[0].children[1].setSpriteFrame(_prefix+thiz._slotData.sbs[9]+".png");
			// thiz.columns[4].children[0].children[2].setSpriteFrame(_prefix+thiz._slotData.sbs[14]+".png");
			thiz.stopColSpin(4);
		}, 0.8+_delay);
		this.scheduleOnce(function(){
			// thiz._winner( thiz.slotData );
			// thiz.hasFreeSpin( thiz.slotData.fss );
			var winlines = [];
	        if( thiz._slotData.wls && thiz._slotData.wls.length ){
		        for( var i=0; i< thiz._slotData.wls.length; i++ ){
		            winlines.push( thiz._slotData.wls[i].lid );
		        }
		    }

	        thiz.drawLines(winlines);
	        thiz._onSpin = false;
		}, 1+_delay);
	},
	forceStopSpin: function(){
		this.columns[0].stopSpin();

		this.scheduleOnce(function(){
			this.columns[1].stopSpin();
			this.scheduleOnce(function(){
				this.columns[2].stopSpin();
				this.scheduleOnce(function(){
					this.columns[3].stopSpin();
					this.scheduleOnce(function(){
						this.columns[4].stopSpin();
					}.bind(this), 1);
				}.bind(this), 0.4);
			}.bind(this), 0.4);
		}.bind(this), 0.4);
		

		this.changeAutoSpin( false );
		this._onSpin = false;
	},
	handleSpinDone: function(){

	},
	setSession: function(sid){
		this._session = sid;
		this._spinning.sid = sid;
	},
	changeAutoSpin: function(type, check){
		if( check && (this.isTrial || !MiniGameClient.getInstance().isLoginDone()) ){
	        this.notify('Chức năng không hỗ trợ khi chơi thử');
	        this.changeAutoSpin(false);
	        return;
	    }

	    if( type ){
	    	this.btnTuQuay.setActive(true);
	        if( !this._onSpin ) this._sendRequestSpin();
	    }else{
	    	this.btnTuQuay.setActive(false);
	    }
	    this._autoSpin = type;
	},
	setQuy: function( arr ){
		if( this._betting === 0 ){
			this.labelJp1.countTo(arr[0].J, 1);
			this.labelJp2.countTo(arr[1].J, 1);
			this.labelJp3.countTo(arr[2].J, 1);
		}
		else if( this._betting === 100 ) this.labelJp.countTo(arr[0].J, 1);
		else if( this._betting === 1000 ) this.labelJp.countTo(arr[1].J, 1);
		else if( this._betting === 10000 ) this.labelJp.countTo(arr[2].J, 1);

		this._dataJackpot = arr;
	},
	_onReconnectGame: function(){
		cc.log('_onReconnectGame LongVuong');
		MiniGameClient.getInstance().observerByGameID(this._gameId);
	},
	_onObserverResponse: function( cmd, data ){
		cc.log('_onObserverResponse LongVuong');
		var data = MiniGameClient.getInstance().getObserverDataByGameId( this._gameId );

		if( data && data.fss && data.fss.length ){
			for( var i = 0; i<data.fss.length; i++  ){
				if( data.fss[i].aid == this._moneyType  && data.fss[i].b == this._betting ){
					this.hasFreeSpin( data.fss[i].fs );
					break;
				}
			}
			MiniGameClient.getInstance().resetObserverDataByGameId( this._gameId );
		}
	},
	hasFreeSpin: function(n){
		cc.log("has hasFreeSpin", n);
	},
	drawLines: function(arr){
		this.lineWrap.removeAllChildren(true);

		if( arr.length ){
			var thiz = this;
			for(var i=arr.length-1; i>=0; i--){
				var line = cc.createSpine("res/longvuong/line/skeleton.json", "res/longvuong/line/skeleton.atlas");
				line.setAnimation(0, "Line lv "+(i+1), false);
				this.lineWrap.addChild(line);
			}

			setTimeout(function(){
				thiz.lineWrap.removeAllChildren(true);
			}, 3000);
		}
	},
	notify: function(_str, _t){
		if( this.notifyWrap ) this.notifyWrap.removeFromParent(true);

		this.notifyWrap = new cc.Node();
		this.notifyWrap.y = -250;
		this.addChild(this.notifyWrap, 9999);

		// this.notifyWrap.removeAllChildren(true);

		if( !_str ) return;

		var bg = new cc.Scale9Sprite("res/input_default.png", cc.rect(0, 0, 350, 65));
        this.notifyWrap.addChild(bg);

		var lb = new cc.LabelTTF(_str, MH.getFont("Font_Default"), 32);
		this.notifyWrap.addChild(lb);

		bg.width = lb.width + 60;
		lb.y = -5;

		var thiz = this;
		this.notifyWrap.scheduleOnce(function(){
			thiz.notifyWrap.removeFromParent(true);
		}, 3);
	},
	onEnter: function(){
		this._super();

		this.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));
		this._gotoLobby();

		MiniGameClient.getInstance().addListener( '100' , this._onupdateGame, this);
		MiniGameClient.getInstance().addListener( CMD_SLOT_MACHINE.SPIN.toString() , this._onupdateGame, this);
		MiniGameClient.getInstance().addListener( CMD_SLOT_MACHINE.SPIN_TRIAL.toString() , this._onupdateGame, this);
		MiniGameClient.getInstance().addListener( CMD_SLOT_MACHINE.JACKPOT.toString() , this._onupdateGame, this);
		MiniGameClient.getInstance().addListener( kCMD.OBSERVER_RESPONSE , this._onObserverResponse, this);
		MiniGameClient.getInstance().addListener( CMD_OBSERVER.OBSERVER_SLOT_RECONNECT , this._onReconnectGame, this);
		MiniGameClient.getInstance().observerByGameID(this._gameId);
	},
	onExit: function(){
		this._super();
		cc.log("onExit LongVuong");
		MiniGameClient.getInstance().removeObserverByGameID(this._gameId);
		MiniGameClient.getInstance().removeListener(this);
	}
});