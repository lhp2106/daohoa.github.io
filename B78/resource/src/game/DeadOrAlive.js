var DeadOrAlive = cc.Node.extend({
	_betting: 0,
	_lines: [],
	_dataJackpot: [{J:0},{J:0},{J:0}],
	_gameId: SLOT_GAME_MINI.DEADORALIVE,
	_moneyType: MoneyType.Gold,
	_isTrial: false,
	_trialJackpot: 50000000,
	_onSpin: false,
	_spinFast: false,
	_slotData: null,
	_autoSpin: false,
	_session: false,
	_spinning: {
    	sid: 0,
    	at: 0
    },
    _labelsHu: [null, null, null, null, null],
    _freespinData: {
    	"100":{b:100, ls:[], ai:1, fs:0, win: 0},
        "1000":{b:1000, ls:[], ai:1, fs:0, win: 0},
        "10000":{b:10000, ls:[], ai:1, fs:0, win: 0}
    },
    ctor: function(){
    	this._super();
    	cc.log("new DeadOrAlive", this._dataJackpot, this._lines);
    	this.setPosition(cc.winSize.width/2, cc.winSize.height/2);

    	this._speaker = new AudioDevice();
    	this._speaker.setData({
    		"background": "res/deadoralive/sound/nen.mp3",
    		"soundSpin": "res/deadoralive/sound/spinLoop.mp3",
	    	"spinStart": "res/deadoralive/sound/spinStart.mp3",
	    	"soundColStop": "res/deadoralive/sound/spinStop.mp3",
	    	"coinUpLoop": "res/deadoralive/sound/coinUpLoop.mp3",
	    	"winNormal": [
	    		"res/deadoralive/sound/winNormal/1.mp3",
	    		"res/deadoralive/sound/winNormal/2.mp3",
	    		"res/deadoralive/sound/winNormal/3.mp3",
	    		"res/deadoralive/sound/winNormal/4.mp3",
	    		"res/deadoralive/sound/winNormal/5.mp3",
	    		"res/deadoralive/sound/winNormal/6.mp3",
	    		"res/deadoralive/sound/winNormal/7.mp3",
	    		"res/deadoralive/sound/winNormal/8.mp3",
	    		"res/deadoralive/sound/winNormal/9.mp3",
	    		"res/deadoralive/sound/winNormal/10.mp3",
	    		"res/deadoralive/sound/winNormal/11.mp3"
	    	],
	    	"winJackpot": "res/deadoralive/sound/winJackpot.mp3",
	    	"buttonClick": "res/deadoralive/sound/buttonClick.mp3",
	    	"openOtherRuong": "res/deadoralive/sound/openOtherRuong.mp3",
	    	"hoverRoom": "res/deadoralive/sound/hoverRoom.mp3"
    	});

    	var wrapLobby = new cc.Node();
    	this.addChild(wrapLobby);
    	this.wrapLobby = wrapLobby;

    	var wrapPlay = new cc.Node();
    	this.addChild(wrapPlay);
    	this.wrapPlay = wrapPlay;

    	// wrapPlay
    	var bg = new cc.Sprite("res/deadoralive/play/background.jpg");
		wrapPlay.addChild(bg);

        var khung = new cc.Node();
        khung.setPosition(-490, -290);
        wrapPlay.addChild(khung);

        this.columns = [];

        var items = [], itemsBlur = [];
        for( var i=0; i<=10; i++ ){
        	items.push( cc.spriteFrameCache.getSpriteFrame(i+"_deadoralive.png") );

        	// blur 6 7 8 spin xấu. ko dùng
        	if( i===6 ) itemsBlur.push( cc.spriteFrameCache.getSpriteFrame(2+"_blur_deadoralive.png") );
        	else if( i===7 ) itemsBlur.push( cc.spriteFrameCache.getSpriteFrame(3+"_blur_deadoralive.png") );
        	else if( i===8 ) itemsBlur.push( cc.spriteFrameCache.getSpriteFrame(1+"_blur_deadoralive.png") );
        	else itemsBlur.push( cc.spriteFrameCache.getSpriteFrame(i+"_blur_deadoralive.png") );
        }

        for(var i=0; i<5; i++){
        	var col = new Column({
        		itemH: 191,
        		items: items,
        		itemsBlur: itemsBlur,
        		speed: 2300,
        		backOut: 50,
        		backIn: 30,
        		index: i
        	});

        	col.setPosition(i*185+120,0);
        	khung.addChild(col);
            this.columns[i] = col;

            col.onBeforeStop = function(target){
        		this.playItemAnimation(target);
        		this._speaker.playEffect("soundColStop");
        	}.bind(this);

            this.playItemAnimation(col);
        }

        // spin done
        this.columns[4].onAfterStop = function(){
        	// win money [normal.bigwin.jackpot] -> bonus -> freespin
        	cc.log(this._slotData);
        	this.checkHasWin();
		}.bind(this);

		var bgk = new cc.Sprite("res/deadoralive/play/khung.png");
		wrapPlay.addChild(bgk);

		var btnBack = new newui.Button("res/deadoralive/lobby/btn_back.png", function(){
			this._gotoLobby();
		}.bind(this));
		btnBack.setPosition(-570, 320);
		wrapPlay.addChild(btnBack);

		var lbgold = new newui.LabelBMFont( MH.numToText(PlayerMe.gold) , "res/deadoralive/font/number.fnt");
		lbgold.setScale(0.466);
		lbgold.setPosition(-315, 331);
		wrapPlay.addChild(lbgold);

		var lbhu = new newui.LabelBMFont("0", "res/deadoralive/font/number.fnt");
		lbhu.setScale(0.466);
		lbhu.setPosition(361, 331);
		wrapPlay.addChild(lbhu);
		this._labelsHu[4] = lbhu;

		var lbSession = new newui.LabelBMFont("#0", "res/deadoralive/font/number.fnt");
		lbSession.setScale(0.433);
		lbSession.setPosition(340, 290);
		lbSession.setColor(cc.color("#e3dbbe"));
		wrapPlay.addChild(lbSession);
		this.lbSession = lbSession;

		var btnVinhDanh = new newui.Button("res/deadoralive/lobby/btn_bxh.png");
		btnVinhDanh.setPosition(495, 328);
		wrapPlay.addChild(btnVinhDanh);

		var btnSetting = new newui.Button("res/deadoralive/lobby/btn_caidat.png", function(){
			this.showCaiDat();
		}.bind(this));
		btnSetting.setPosition(580, 328);
		wrapPlay.addChild(btnSetting);

		var btnTuQuay = new newui.Button(["res/deadoralive/play/btn_tuquay.png", "res/deadoralive/play/btn_dung.png"], function(){
			this.changeAutoSpin();
		}.bind(this));
		btnTuQuay.setPosition(-61, -329);
		wrapPlay.addChild(btnTuQuay);
		this.btnTuQuay = btnTuQuay;

		var btnQuay = new newui.Button(["res/deadoralive/play/btn_quay_0.png", "res/deadoralive/play/btn_quay_1.png"], function(){
			this._sendRequestSpin();
		}.bind(this));
		btnQuay.setPosition(60, -310);
		wrapPlay.addChild(btnQuay);
		this.btnQuay = btnQuay;

		var btnMucCuoc = new newui.LabelBMFont("10.000", "res/deadoralive/font/number.fnt");
		btnMucCuoc.setScale(0.4);
		btnMucCuoc.setPosition(-441, -325);
		wrapPlay.addChild(btnMucCuoc);
		this.btnMucCuoc = btnMucCuoc;
		MH.addTouch( btnMucCuoc, function(){
			if( this._betting === 100 ) this.changeBetting(1000);
			else if( this._betting === 1000 ) this.changeBetting(10000);
			else if( this._betting === 10000 ) this.changeBetting(100);
		}.bind(this));

		var btnDong = new newui.LabelBMFont("0", "res/deadoralive/font/number.fnt");
		btnDong.setScale(0.4);
		btnDong.setPosition(-306, -325);
		btnDong.setColor(cc.color("#9b9ce0"));
		wrapPlay.addChild(btnDong);
		MH.addTouch(btnDong, function(){
			this.showChonDong();
		}.bind(this));
		this.lbDong = btnDong;

		var tongThang = new newui.LabelBMFont("0", "res/deadoralive/font/number.fnt");
		tongThang.setScale(0.4);
		tongThang.setPosition(344, -325);
		tongThang.setColor(cc.color("#debc29"));
		wrapPlay.addChild(tongThang);

		var tongDat = new newui.LabelBMFont("0", "res/deadoralive/font/number.fnt");
		tongDat.setScale(0.4);
		tongDat.setPosition(500, -325);
		wrapPlay.addChild(tongDat);
		this.lbTongDat = tongDat;

		var wrapLine = new cc.Node();
		wrapLine.setPosition(-385, 200);
		wrapLine.setVisible(false);
		wrapPlay.addChild(wrapLine);
		this.wrapLine = wrapLine;

		var wrapWin = new cc.Node();
		wrapWin.setVisible(false);
		wrapPlay.addChild(wrapWin);
		this.wrapWin = wrapWin;

		var wrapBonus = new cc.Node();
		wrapBonus.setVisible(false);
		this.addChild(wrapBonus);
		this.wrapBonus = wrapBonus;
    },
    _gotoLobby: function(){
    	this._betting = 0;
	    this._isTrial = false;
	    this._onSpin = false;

	    // this.changeSpeedMode(false);
	    this.changeAutoSpin(false);

    	this.wrapPlay.setVisible(false);
    	this.wrapLobby.setVisible(true);

		this.wrapLobby.removeAllChildren(true);

		var bg = new cc.Sprite("res/deadoralive/lobby/background.jpg");
		this.wrapLobby.addChild(bg);

		var btnBack = new newui.Button("res/deadoralive/lobby/btn_back.png", function(){
			MH.changePage("home");
		});
		btnBack.setPosition(-590, 310);
		this.wrapLobby.addChild(btnBack);

		var btnVinhDanh = new newui.Button("res/deadoralive/lobby/btn_bxh.png");
		btnVinhDanh.setPosition(375, 310);
		this.wrapLobby.addChild(btnVinhDanh);

		var btnSetting = new newui.Button("res/deadoralive/lobby/btn_caidat.png", function(){
			this.showCaiDat();
		}.bind(this));
		btnSetting.setPosition(465, 310);
		this.wrapLobby.addChild(btnSetting);

		var btnRoom0 = new newui.Button("res/deadoralive/lobby/p0.png", function(){
			this.playTrial();
		}.bind(this));
		btnRoom0.setPosition(-205, -300);
		this.wrapLobby.addChild(btnRoom0);

		var btnRoom1 = new newui.Button("res/deadoralive/lobby/p100.png", function(){
			this.changeBetting(100);
		}.bind(this));
		btnRoom1.setPosition(-455, -35);
		this.wrapLobby.addChild(btnRoom1);
		var hu1 = new newui.LabelBMFont("0", "res/deadoralive/font/number.fnt");
		hu1.setScale(0.333);
		hu1.setAnchorPoint(0, 0);
		hu1.setPosition(80, 220);
		hu1.setColor(cc.color("#3f322d"));
		btnRoom1.addChild(hu1);
		this._labelsHu[0] = hu1;

		var btnRoom2 = new newui.Button("res/deadoralive/lobby/p1000.png", function(){
			this.changeBetting(1000);
		}.bind(this));
		btnRoom2.setPosition(-200, -35);
		this.wrapLobby.addChild(btnRoom2);
		var hu2 = new newui.LabelBMFont("0", "res/deadoralive/font/number.fnt");
		hu2.setScale(0.333);
		hu2.setAnchorPoint(0, 0);
		hu2.setPosition(80, 220);
		hu2.setColor(cc.color("#3f322d"));
		btnRoom2.addChild(hu2);
		this._labelsHu[1] = hu2;

		var btnRoom3 = new newui.Button("res/deadoralive/lobby/p10000.png", function(){
			this.changeBetting(10000);
		}.bind(this));
		btnRoom3.setPosition(45, -35);
		this.wrapLobby.addChild(btnRoom3);
		var hu3 = new newui.LabelBMFont("0", "res/deadoralive/font/number.fnt");
		hu3.setScale(0.333);
		hu3.setAnchorPoint(0, 0);
		hu3.setPosition(75, 220);
		hu3.setColor(cc.color("#3f322d"));
		btnRoom3.addChild(hu3);
		this._labelsHu[2] = hu3;

		var lbgold = new newui.LabelBMFont(MH.numToText(PlayerMe.gold), "res/deadoralive/font/number.fnt");
		lbgold.setScale(0.466);
		lbgold.setPosition(-370, 314);
		this.wrapLobby.addChild(lbgold);

		var lbhu = new newui.LabelBMFont("0", "res/deadoralive/font/number.fnt");
		lbhu.setScale(0.466);
		lbhu.setPosition(-85, 314);
		this.wrapLobby.addChild(lbhu);
		this._labelsHu[3] = lbhu;
    },
    changeBetting: function(bet){
    	if( this._isTrial ){
	        this.notify('Chức năng không hỗ trợ khi chơi thử');
	        return;
	    }

	    if( this._onSpin || this._autoSpin ){
	        this.notify('Chưa kết thúc phiên');
	        return;
	    }

	    this._betting = bet;
    	this._isTrial = false;
    	this.setSession(0);

    	this.wrapLobby.setVisible(false);
    	this.wrapPlay.setVisible(true);
		this.wrapLobby.removeAllChildren(true);

    	// tong dat, btn muccuoc
    	this.lbTongDat.setString( MH.numToText( this._betting*this._lines.length ) );
    	this.btnMucCuoc.setString( MH.numToText(this._betting) );
    },
    playTrial: function(){
    	if( this._onSpin || this._autoSpin ){
	        this.notify('Chưa kết thúc phiên');
	        return;
	    }

	    this.wrapLobby.setVisible(false);
    	this.wrapPlay.setVisible(true);
		this.wrapLobby.removeAllChildren(true);

	    this._betting = 10000;
	    this.chooseLines([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);
    	this._isTrial = true;
    	this.setSession(0);
    	this.changeAutoSpin( false );

        this._trialJackpot = 50000000;
        this.setQuy( this._trialJackpot );
    },
    playBonus: function(){
    	this.wrapPlay.setVisible(false);
    	this.wrapBonus.setVisible(true);
    	this.wrapBonus.removeAllChildren(true);

    	var bg = new cc.Sprite("res/deadoralive/popup/bg_popup.jpg");
    	this.wrapBonus.addChild(bg);

    	var title = new cc.Sprite("res/deadoralive/popup/title_minigame.png");
    	title.y = 305;
    	this.wrapBonus.addChild(title);

    	var wrap1 = new cc.Node();
    	this.wrapBonus.addChild(wrap1);

    	var wrap2 = new cc.Node();
    	wrap2.setVisible(false);
    	this.wrapBonus.addChild(wrap2);

    	var lb1 = new cc.Sprite("res/deadoralive/bonus/lb1.png");
    	lb1.y = 206;
    	wrap1.addChild(lb1);

    	var totalWin = 0;
    	var countClick = 0;
    	var canClick = true;
    	var isFinished = false;

    	var total = new newui.LabelBMFont("0", "res/deadoralive/font/number.fnt");
    	total.setPosition(8, -264);
    	total.setScale(0.766);
    	total.setColor(cc.color(255,255,100));
    	wrap1.addChild(total);

    	var finishBonus = function(){
	        if( isFinished ) return;

	        isFinished = true;
	        canClick = false;

	        this.wrapPlay.setVisible(true);
	    	this.wrapBonus.setVisible(false);
	    	this.wrapBonus.removeAllChildren(true);

	    	this.showWin("bonus", this._slotData.MG.m);
	    }.bind(this);

    	var afterClick = function(){
	    	countClick++;
	    	canClick = true;

	    	total.countTo(totalWin, 0.5);

	        if( countClick >= this._slotData.MG.items.length ){
	        	this.scheduleOnce(finishBonus, 1);
	        }

	        // runBnTimmer();
	    }.bind(this);

    	for( var i=0; i<12; i++ ){
    		var item = new newui.Button("res/deadoralive/bonus/item/7.png", function(btn){
    			if( !canClick ) return;
    			this._speaker.playEffect("buttonClick");

    			if( countClick >= this._slotData.MG.items.length ) return;
        		canClick = false;

        		var _pos = btn.getPosition();

        		if( this._slotData.MG.items[countClick] == -1 ){ // daulau -> mo ruong
        			var daulau = new cc.Sprite("res/deadoralive/bonus/item/daulau.png");
        			daulau.setPosition(_pos);
        			wrap1.addChild(daulau);
					wrap1.removeChild(btn);

					wrap2.removeAllChildren(true);
					var lb2 = new cc.Sprite("res/deadoralive/bonus/lb2.png");
			    	lb2.y = 175;
			    	wrap2.addChild(lb2);

					this.scheduleOnce(function(){
						wrap1.setVisible(false);
						wrap2.setVisible(true);
					}, 1.5);
					//
					var canOpen = true;
	        		var ruongOther = null;
	        		switch(this._slotData.MG.rate){
			        	case 1:
			        		ruongOther = [2,3];
			        		break;
			        	case 2:
			        		ruongOther = [3,4];
			        		break;
			            case 3:
			                ruongOther = [2,4];
			                break;
			            case 4:
			                ruongOther = [3, 5];
			                break;
			            case 5:
			                ruongOther = [3,4];
			                break;
			            default:
			            	ruongOther = [3,4];
			                break;
			        }

			        for( var i=0; i<3; i++ ){
			        	var ruong = new newui.Button(["res/deadoralive/bonus/ruong-lg.png","res/deadoralive/bonus/ruong_on.png"], function(btn){
				    		if( !canOpen ) return;
				    		this._speaker.playEffect("buttonClick");
				    		btn.setActive(true);
				    		var lb = new newui.LabelBMFont("X"+this._slotData.MG.rate, "res/deadoralive/font/number.fnt");
				    		lb.setPosition( btn.getPosition() );
				    		lb.setColor(cc.color(255,255,100));
				    		lb.x -= 5;
				    		lb.y += 50;
				    		wrap2.addChild(lb);

				    		var mtag = btn.getTag();
				    		if( ruongOther ){
				    			this.scheduleOnce(function(){
				    				var childs = wrap2.getChildren();
				    				var t = 0;
					    			for( var i=0; i<childs.length; i++ ){
					    				var tag = childs[i].getTag();
					    				if( tag >=0 && tag <=2 && tag !== mtag ){
					    					childs[i].setActive(true);
					    					var lb = new newui.LabelBMFont("X"+ruongOther[t], "res/deadoralive/font/number.fnt");
								    		lb.setPosition( childs[i].getPosition() );
								    		lb.setColor(cc.color(255,255,100));
								    		lb.x -= 5;
								    		lb.y += 50;
								    		wrap2.addChild(lb);
								    		t++;
					    				}
					    			}
				    			}, 1);
				    		}
				    		canOpen = false;
				    		this.scheduleOnce(afterClick, 3);
				    	}.bind(this));
				    	ruong.setTag(i);
				    	ruong.setPosition(-290 + i*300, -30);
				    	wrap2.addChild(ruong);
			        }

        		}else{
        			for( var i=0; i< this._slotData.MG.stg.length; i++ ){
        				var bValue = 0,
		            		valueWin = 0;

		                if( this._slotData.MG.items[countClick] == this._slotData.MG.stg[i].id ){
		                    bValue = this._slotData.MG.stg[i].b2 || this._slotData.MG.stg[i].b||0;
		                    valueWin = this._betting * bValue * this._lines.length;
		                    totalWin += valueWin;

			    			var lb = new newui.LabelBMFont("0", "res/deadoralive/font/number.fnt");
					    	lb.setPosition(_pos);
					    	lb.setScale(0.467);
					    	lb.setColor(cc.color(255,255,100));
					    	wrap1.addChild(lb);
					    	lb.countTo(valueWin, 0.5);
		                	afterClick();
		                    break;
		                }
        			}
        		}
        		wrap1.removeChild(btn);
    		}.bind(this));

    		item.setScale(0.8);
    		item.setPosition( -464+(i%6)*185, -128+ Math.floor(i/6)*180 )
    		wrap1.addChild(item);
    	}
    },
    chooseLines: function(arr){
    	if( this._onSpin || this._autoSpin ){
	        this.notify('Chưa kết thúc phiên');
	        return;
	    }
	    if( this._isTrial ){
	        this.notify('Chức năng không hỗ trợ khi chơi thử');
	        return false
	    }
	    this._lines = arr;
	    this.lbDong.setString(arr.length);
    },
    _sendRequestSpin: function(){
    	if( this._onSpin ) return;

    	this._slotData = null;

    	this.showWin(false);
    	this.showLine(false);
    	this._spinning.sid = -1;
	    this._spinning.at = (new Date()).getTime();
	    this._onSpin = true;

    	this.btnQuay.setActive(true);
    	this._speaker.playEffect("spinStart");

		this.columns[0].runSpin();
		this.scheduleOnce(function(){
			this.columns[1].runSpin();
			this.scheduleOnce(function(){
				this.columns[2].runSpin();
				this.scheduleOnce(function(){
					this.columns[3].runSpin();
					this.scheduleOnce(function(){
						this.columns[4].runSpin();
					}.bind(this), 0.2);
				}.bind(this), 0.2);
			}.bind(this), 0.2);
		}.bind(this), 0.2);

		this.scheduleOnce(function(){
			if( this._spinning.sid === -1 && new Date().getTime() - this._spinning.at > 50000 ){
	            this.forceStopSpin();
	        }
		}.bind(this), 60);

		var sendObj = null;
	    if( this._isTrial ){
	        sendObj = [
	            command.ZonePluginMessage,
	            Constant.CONSTANT.ZONE_NAME_MINI_GAME,
	            miniGamePlugin.PLUGIN_SLOT_GAME,
	            {
	                'cmd': CMD_SLOT_MACHINE.SPIN_TRIAL,
	                'gid': this._gameId,
	                'aid': this._moneyType,
	                'ls': this._lines,
	                'b': 10000
	            }
	        ];
	    }else{
	        sendObj = [
	            command.ZonePluginMessage,
	            Constant.CONSTANT.ZONE_NAME_MINI_GAME,
	            miniGamePlugin.PLUGIN_SLOT_GAME,
	            {
	                'cmd': CMD_SLOT_MACHINE.SPIN,
	                'gid': this._gameId,
	                'aid': this._moneyType,
	                'ls': this._lines,
	                'b': this._betting
	            }
	        ];
	    }

	    MiniGameClient.getInstance().send(sendObj);
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
					}.bind(this), 0.3);
				}.bind(this), 0.3);
			}.bind(this), 0.3);
		}.bind(this), 0.3);

		this.changeAutoSpin( false );
		this._onSpin = false;
		this.btnQuay.setActive(false);
	},
	playItemAnimation: function(col){
		var items = col.getChildren();

		for( var i=items.length-1; i>=0; i-- ){
			var anim = null;
			if( items[i].itemId === 0 ){
				anim = cc.createSpine("res/deadoralive/item/wild_animations.json", "res/deadoralive/item/wild_animations.atlas");
				anim.setAnimation(0, "sym1_5_win", true);
				anim.setPosition(items[i].getPosition());

				// bug design
				anim.x -= 104;
				anim.y += 105;
			}else if( items[i].itemId === 9 ){
				anim = cc.createSpine("res/deadoralive/item/scatter_anim.json", "res/deadoralive/item/scatter_anim.atlas");
				anim.setAnimation(0, "win", true);
				anim.setPosition(items[i].getPosition());

				// bug design
				anim.x -= 100;
				anim.y += 100;
			}

			if( anim ){
				anim.itemId = items[i].itemId;
				anim.setTag(items[i].getTag());
				anim.setName("animation");
				col.addChild(anim);
				col.removeChild(items[i], true);
			}
		}
	},
	changeAutoSpin: function(type){
		if( arguments.length === 0 ) type = !this._autoSpin;
		if( type ){
			if( this._isTrial ){
				this.notify('Chức năng không hỗ trợ khi chơi thử');
				return;
			}
			if( !this._onSpin ) this._sendRequestSpin();
		}

		this.btnTuQuay.setActive(type);
		this._autoSpin = type;
	},
	showCaiDat: function(){
		var popup = new MHPopup();
		popup.background.setTexture("res/deadoralive/popup/bg_caidat.png");
		popup.btnClose.setTexture("res/deadoralive/popup/btn_close.png");
		popup.btnClose.setPosition(230, 120);

		var btnSound = new newui.Button(["res/deadoralive/popup/setting/sound-off.png", "res/deadoralive/popup/setting/sound-on.png"], function(sender){
			sender.setActive( !sender.getActive() );
		});

		btnSound.setAnchorPoint(0, 0.5);
		btnSound.setPosition(-160, 60);
		btnSound.setTouchEffect(false);

		var btnLsgd = new newui.Button("res/deadoralive/popup/setting/lsgd.png");
		btnLsgd.setAnchorPoint(0, 0.5);
		btnLsgd.setPosition(-160, -25);
		btnLsgd.setTouchEffect(false);

		var btnLshu = new newui.Button("res/deadoralive/popup/setting/lshu.png");
		btnLshu.setAnchorPoint(0, 0.5);
		btnLshu.setPosition(-160, -105);
		btnLshu.setTouchEffect(false);

		popup.addContent(btnSound,btnLsgd,btnLshu);

		popup.show();
	},
	showChonDong: function(){
		if( this._onSpin || this._autoSpin ){
            this.notify('Chưa kết thúc phiên');
            return;
        }

        if( this._isTrial ){
            this.notify('Chức năng không hỗ trợ khi chơi thử');
            return;
        }

    	var popup = new cc.Node();
    	var bg = new cc.Sprite("res/deadoralive/popup/bg_popup.jpg");
    	popup.addChild(bg);
    	var btnClose = new newui.Button("res/deadoralive/popup/btn_close.png", function(){
    		this.removeChild(popup);
    		this.wrapPlay.setVisible(true);
    	}.bind(this));
    	btnClose.setPosition(590, 325);
    	popup.addChild(btnClose);
    	var title = new cc.Sprite("res/deadoralive/popup/title_chondong.png");
    	title.y = 305;
    	popup.addChild(title);

    	var initBtn = function(){
    		var childs = popup.getChildren();
    		for( var i=0; i<childs.length; i++ ){
    			var tag = childs[i].getTag();
    			if( tag > 100 ){
    				if( this._lines.indexOf( tag-100-1 ) === -1 ){
    					childs[i].setColor(cc.color(100, 100, 100));
    					childs[i].setActive(false);
    				}else{
    					childs[i].setColor(cc.color(255,255,255));
    					childs[i].setActive(true);
    				}
    			}
    		}
    	}.bind(this);

    	for( var i=1; i<=25; i++ ){
			var btn = new newui.Button("res/deadoralive/popup/chondong/"+i+".png", function(btn){
				var act = btn.getActive(),
					lid = btn.getTag()-100-1;
				// btn.setActive(!act);
				if( act ){//remove
					var _ii = this._lines.indexOf(lid);
					if( _ii !== -1 ) this._lines.splice(_ii, 1);
				}else{//add
					if( this._lines.indexOf(lid) === -1 ) this._lines.push( lid );
				}

				this.chooseLines(this._lines);
				initBtn();
			}.bind(this));
	    	btn.setPosition(-390+(i-1)%5*191 , 195-78*Math.floor((i-1)/5));
	    	popup.addChild(btn);
	    	btn.setTag(100+i);
    	}

    	initBtn();

    	var btnChan = new newui.Button("res/deadoralive/popup/btn_dongchan.png", function(){
    		this.chooseLines([1,3,5,7,9,11,13,15,17,19,21,23]);
    		initBtn();
    	}.bind(this));
    	btnChan.setPosition(-394, -236);
    	popup.addChild(btnChan);
    	var btnLe = new newui.Button("res/deadoralive/popup/btn_dongle.png", function(){
    		this.chooseLines([0,2,4,6,8,10,12,14,16,18,20,22,24]);
    		initBtn();
    	}.bind(this));
    	btnLe.setPosition(-134, -236);
    	popup.addChild(btnLe);
    	var btnAll = new newui.Button("res/deadoralive/popup/btn_tatca.png", function(){
    		this.chooseLines([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);
    		initBtn();
    	}.bind(this));
    	btnAll.setPosition(134, -236);
    	popup.addChild(btnAll);
    	var btnNone = new newui.Button("res/deadoralive/popup/btn_bochon.png", function(){
    		this.chooseLines([0]);
    		initBtn();
    	}.bind(this));
    	btnNone.setPosition(394, -236);
    	popup.addChild(btnNone);

    	this.addChild(popup, 99);
    	this.wrapPlay.setVisible(false);
    },
    checkHasWin: function(){
    	if( !this._slotData ) return;
    	
	    var _type = "normal", _money = this._slotData.mX;

	    if (this._slotData.iJ){
	        _type = "jackpot";
	    }else if( this._slotData.bw ){
	        _type = "bigwin";
	    }else if( this._slotData.mX ){
	        _type = "normal";
	    }

	    // has bonus 
	    if( this._slotData.hMG ){
	        _money = 0;
	        for( var i=0; i<this._slotData.wls.length; i++ ){
	            _money += this._slotData.wls[i].crd;
	        }
	    }

	    var winlines = [];
	    if( this._slotData.wls && this._slotData.wls.length ){
	        for( var i=0; i< this._slotData.wls.length; i++ ){
	            winlines.push( this._slotData.wls[i].lid );
	        }
	    }

	    this.showLine(winlines);

	    if( _money ) this.showWin(_type, _money);
	    else this.checkHasBonus();
    },
    checkHasBonus: function(){
    	if( !this._slotData ) return;
    	if( this._slotData.hMG ) this.showWin("bonus");
    	else this.checkHasFreeSpin();
    },
    checkHasFreeSpin: function(){
    	if( !this._slotData ) return;

    	this._freespinData[ this._slotData.b.toString() ].fs = this._slotData.fss;
    	// set label

    	if( this._slotData.hFS ) this.showWin("freespin");
    	else this.spinDone();
    },
    fastCheckWin: function(){

    },
    showWin: function(type, n){
    	// win money [normal.bigwin.jackpot] -> bonus -> freespin

    	this.wrapWin.removeAllChildren(true);
    	// this.unschedule(this.showWin);
    	if( type === false ){
    		this.wrapWin.setVisible(false);
    		return;
    	}
    	
    	this.wrapWin.setVisible(true);
    	var delayClose = 3;
    	if( type === 'bigwin' ) delayClose = 5;
    	else if( type === 'jackpot' ) delayClose = 6;
    	else if( type === 'normal' ) delayClose = 2;

    	switch( type ){
    		case "normal":
    			var lbNormal = new newui.LabelBMFont("0", "res/deadoralive/font/number.fnt");
				lbNormal.setColor(cc.color(255,255,100));
				lbNormal.setPosition(0, -200);
				this.wrapWin.addChild(lbNormal);
				lbNormal.countTo(n);
				this._speaker.playEffect("winNormal");
    			break;
    		case "bigwin":
    			var fxLight = new cc.Sprite("res/deadoralive/fx/light_3.png");
				fxLight.y = 70;
				this.wrapWin.addChild(fxLight);
				var fxDark = new cc.Sprite("res/deadoralive/fx/bg-lg.png");
				this.wrapWin.addChild(fxDark);
				var fxCoin = new cc.Sprite("res/deadoralive/fx/coin.png");
				fxCoin.y = 50;
				this.wrapWin.addChild(fxCoin);
				var fxText = new cc.Sprite("res/deadoralive/fx/text_thanglon.png");
				fxText.y = 55;
				this.wrapWin.addChild(fxText);
				var lb = new newui.LabelBMFont("0", "res/deadoralive/font/number.fnt");
				lb.setColor(cc.color(255,255,100));
				lb.y = -45;
				this.wrapWin.addChild(lb);
				lb.countTo(n);
				this._speaker.playEffect("winNormal");
    			break;
    		case "freespin":
    			var fxDark = new cc.Sprite("res/deadoralive/fx/bg.png");
				this.wrapWin.addChild(fxDark);
				var fxText = new cc.Sprite("res/deadoralive/fx/text_lqmp.png");
				fxText.y = 10;
				this.wrapWin.addChild(fxText);
				this._speaker.playEffect("winNormal");
    			break;
    		case "bonus":
    			if( n ){
    				var lbNormal = new newui.LabelBMFont("0", "res/deadoralive/font/number.fnt");
					lbNormal.setColor(cc.color(255,255,100));
					lbNormal.setPosition(0, -200);
					this.wrapWin.addChild(lbNormal);
					lbNormal.countTo(n);
					this._speaker.playEffect("winNormal");
    			}else{
    				var fxDark = new cc.Sprite("res/deadoralive/fx/bg.png");
					this.wrapWin.addChild(fxDark);
					var fxText = new cc.Sprite("res/deadoralive/fx/text_bonusgame.png");
					fxText.y = 10;
					this.wrapWin.addChild(fxText);
					this._speaker.playEffect("winNormal");
    			}
    			break;
    		case "jackpot":
    			var fxLight = new cc.Sprite("res/deadoralive/fx/light_3.png");
				fxLight.y = 70;
				this.wrapWin.addChild(fxLight);
				var fxDark = new cc.Sprite("res/deadoralive/fx/bg-lg.png");
				this.wrapWin.addChild(fxDark);
				var fxCoin = new cc.Sprite("res/deadoralive/fx/coin.png");
				fxCoin.y = 50;
				this.wrapWin.addChild(fxCoin);
				var fxText = new cc.Sprite("res/deadoralive/fx/text_nohu.png");
				fxText.y = 90;
				this.wrapWin.addChild(fxText);
				var lb = new newui.LabelBMFont("0", "res/deadoralive/font/number.fnt");
				lb.setColor(cc.color(255,255,100));
				lb.y = -60;
				this.wrapWin.addChild(lb);
				lb.countTo(n);
				this._speaker.playEffect("winJackpot", false, "showWin");
    			break;
    		default:
    			this.wrapWin.setVisible(false);
    			break;
    	}

    	this.scheduleOnce(function(){
    		this.showLine(false);
    		this.showWin(false);
    		this._speaker.stopByTag("showWin");
    		if( ["normal", "bigwin", "jackpot"].indexOf(type) !== -1 ){
    			this.checkHasBonus();
    		}else if( type === "bonus" ){
    			if( n ) this.checkHasFreeSpin();
    			else this.playBonus();
    		}else{// freespin phien khac
    			this.spinDone();
    		}
    	}.bind(this), delayClose);
    },
    spinDone: function(){
    	LobbyRequest.getInstance().requestUpdateMoney();
    	this._onSpin = false;
    	// check freeSpin
    	if( this._betting && this._freespinData[ this._betting.toString() ].fs ){
    		this._sendRequestSpin();
    		return
    	}

    	// check autospin
    	if( this._autoSpin ){
    		this._sendRequestSpin();
    		return;
    	}

    	// highlight
    	this.btnQuay.setActive(false);
    },
    showLine: function(data){
    	if( data === false || (cc.isArray(data) && data.length === 0) ){
    		this.wrapLine.setVisible(false);
    		this.wrapLine.removeAllChildren(true);
    		return;
    	}

    	this.wrapLine.setVisible(true);
    	if( cc.isArray(data) ){
    		this.wrapLine.removeAllChildren(true);
    		for( var i=0; i<data.length; i++ ){
    			var l = new cc.Sprite("res/deadoralive/play/line/"+(data[i]+1)+".png" );
    			l.setAnchorPoint(0, 1);
    			this.wrapLine.addChild( l );
    		}
    	}else{
    		var l = new cc.Sprite("res/deadoralive/play/line/"+(data+1)+".png" );
    		l.setAnchorPoint(0, 1);
    		this.wrapLine.addChild( l );
    	}
    },
	setQuy: function(data){
		if( cc.isNumber(data) ){
			this._labelsHu[4].countTo(data, 2);
			this._dataJackpot[2].J = data;
		}else{
			if( this._betting === 0 ){ // lobby slot
				this._labelsHu[0].countTo(data[0].J, 2);
				this._labelsHu[1].countTo(data[1].J, 2);
				this._labelsHu[2].countTo(data[2].J, 2);
				this._labelsHu[3].countTo(data[2].J, 2); // default room 10k
	        }else{
	        	if( this._betting === 100 ){
	        		this._labelsHu[4].countTo(data[0].J, 2);
	            }else if( this._betting === 1000 ){
	            	this._labelsHu[4].countTo(data[1].J, 2);
	            }else{
	            	this._labelsHu[4].countTo(data[2].J, 2);
	            }
	        }
	        this._dataJackpot = data;
		}
	},
	notify: function(str, t){
		MessageNode.getInstance().show(str);
	},
	setSession: function(sid){
		this.lbSession.setString("#"+sid);
		if( this._onSpin ) this._spinning.sid = sid;
	},

	onReceiveSpin: function(data){
	    if( !data ){ // || this.onSpin
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

	    // something here
	    //

	    if( this._onSpin && this._spinning.sid === -1 ){
	        this._slotData = data;
	        if( this._isTrial ){
	            this._trialJackpot += 25*10000/100;
	            this.setQuy( this._trialJackpot );
	        }

	        this.setSession( data.sid );

	        //
	        var timeSpin = this._spinFast? 0.5 : 2;
			this.scheduleOnce(function(){
				this.columns[0].stopSpin([this._slotData.sbs[0],this._slotData.sbs[5], this._slotData.sbs[10]]);
				this.scheduleOnce(function(){
					this.columns[1].stopSpin([this._slotData.sbs[1],this._slotData.sbs[6],this._slotData.sbs[11]]);
					this.scheduleOnce(function(){
						this.columns[2].stopSpin([this._slotData.sbs[2],this._slotData.sbs[7],this._slotData.sbs[12]]);
						this.scheduleOnce(function(){
							this.columns[3].stopSpin([this._slotData.sbs[3],this._slotData.sbs[8],this._slotData.sbs[13]]);
							this.scheduleOnce(function(){
								this.columns[4].stopSpin([this._slotData.sbs[4],this._slotData.sbs[9],this._slotData.sbs[14]]);
							}.bind(this), 1);
						}.bind(this), 0.3);
					}.bind(this), 0.3);
				}.bind(this), 0.3);
			}.bind(this), timeSpin);
	    }
	},
	_onupdateGame: function(cmd, data){
		if( data[1].gid != this._gameId ) return;
	    switch ( parseInt( cmd ) ){
	        case CMD_SLOT_MACHINE.SPIN :
	        case CMD_SLOT_MACHINE.SPIN_TRIAL :
	        	// console.log("CMD_SLOT_MACHINE.SPIN", data);
	            this.onReceiveSpin( data[1] );
	            break;
	        default:
	            break;
	    }
	},
	_onObserverResponse: function(cmd, data){

	},
	_onReconnectGame: function(){
		MiniGameClient.getInstance().observerByGameID(this._gameId);
	},
	_onTopHuResponse: function(cmd, data){
		if( this._isTrial ) return;
		var dataJackpot = [{J:0},{J:0},{J:0}];
    
	    if( data && data[1] && data[1].Js && data[1].Js.length ){
	        for( var i = 0; i<data[1].Js.length; i++ ){
	            if( data[1].Js[i].gid === this._gameId ){
	                if( data[1].Js[i].b === 100 ) dataJackpot[0].J = data[1].Js[i].J;
	                else if( data[1].Js[i].b === 1000 ) dataJackpot[1].J = data[1].Js[i].J;
	                else if( data[1].Js[i].b === 10000 ) dataJackpot[2].J = data[1].Js[i].J;
	            }
	        }
	    }
	    this.setQuy( dataJackpot );
	},
    onEnter: function(){
		this._super();
		this._gotoLobby();

		this.chooseLines([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);

		this._speaker.playEffect("background", true, "background");

		// MiniGameClient.getInstance().addListener( '100' , this._onupdateGame, this);
		MiniGameClient.getInstance().addListener( CMD_SLOT_MACHINE.SPIN.toString() , this._onupdateGame, this);
		MiniGameClient.getInstance().addListener( CMD_SLOT_MACHINE.SPIN_TRIAL.toString() , this._onupdateGame, this);
		// MiniGameClient.getInstance().addListener( CMD_SLOT_MACHINE.JACKPOT.toString() , this._onupdateGame, this);
		MiniGameClient.getInstance().addListener( kCMD.OBSERVER_RESPONSE , this._onObserverResponse, this);
		MiniGameClient.getInstance().addListener( CMD_OBSERVER.OBSERVER_SLOT_RECONNECT , this._onReconnectGame, this);

		TopHuClient.getInstance().addListener( kCMD.TOP_HU , this._onTopHuResponse, this);

		MiniGameClient.getInstance().observerByGameID(this._gameId);
	},
	onExit: function(){
		this._super();
		cc.log("onExit DeadOrAlive");
		MiniGameClient.getInstance().removeObserverByGameID(this._gameId);
		MiniGameClient.getInstance().removeListener(this);
		TopHuClient.getInstance().removeListener(this);
		this._speaker.destroy();
	}
});