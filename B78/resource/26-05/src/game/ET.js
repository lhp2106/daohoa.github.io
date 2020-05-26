var ET = cc.Node.extend({
	gameId: SLOT_GAME_MINI.TRUNG_PHUC_SINH,
	betting: 1000,
	lines: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
	autoPlay: false,
	moneyType: MoneyType.Gold,
	_dataJackpot: [{J:0},{J:0},{J:0}],
	_onSpin: false,
	_spinFast: false,
	_slotData: null,
	_session: false,
	_spinning: {
    	sid: 0,
    	at: 0
    },
    _itemHeight: 95,
    ctor: function(){
    	this._super();
    	this.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));

		var bg = new cc.Sprite("res/et/bkg.png");
		this.addChild(bg,-2);
		var textTop = new cc.Sprite("res/et/logo.png");
		textTop.setPosition(-114, 240);
		this.addChild(textTop, -1);

		var labelQuy = new newui.LabelBMFont("", "res/et/font/ET-font2-export.fnt");
		labelQuy.setScale(0.5);
		labelQuy.setAnchorPoint(cc.p(0 ,0));
		labelQuy.setPosition(cc.p(-178, 135));
        this.addChild(labelQuy);
        this.labelQuy = labelQuy;

		var stencil = new cc.DrawNode();
        stencil.drawPoly(
            [cc.p(0, 0),cc.p(285, 0),cc.p(285,285),cc.p(0, 285)],
            cc.color(255, 0, 0, 255),
            0,
            cc.color(255, 255, 255, 0)
        );
        var khung = new cc.ClippingNode(stencil);
        khung.setPosition(cc.p(-196, -174));
        this.addChild(khung, 2);

        this.columns = [];
        var items = [], itemsBlur = [];
        for( var i=0; i<=5; i++ ){
        	items.push( cc.spriteFrameCache.getSpriteFrame(i+"_et.png") );
        	itemsBlur.push( cc.spriteFrameCache.getSpriteFrame(i+"_blur_et.png") );
        }

	    for(var i=0; i<3; i++){
        	var col = new Column({
        		itemH: this._itemHeight,
        		items: items,
        		itemsBlur: itemsBlur,
        		speed: 1080,
        		backOut: 30,
        		index: i
        	});

        	col.setPosition(cc.p(i*95+46,0));

        	col.onBeforeStop = function(target){
        		this.playItemAnimation(target);
        		cc.log("onBeforeStop", target);
        	}.bind(this);

            khung.addChild(col);

            this.columns[i] = col;
            
            this.playItemAnimation(col);
        }

        this.columns[2].onAfterStop = function(){
        	cc.log("spin done");
        	this.winnerEff();
        }.bind(this);

		this.initButton();

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

                this.setPosition( newPos );
            }.bind(this),
        }, this);

        this.drawLine();
    },
    initButton: function(){
    	var thiz = this;
    	var btnVinhDanh = new newui.Button("res/et/icon-vinhdanh.png", function(){
    		this.showVinhDanh();
    	}.bind(this));
    	btnVinhDanh.setPosition(134, 152);
    	this.addChild(btnVinhDanh);

    	var btnHelp = new newui.Button("res/et/icon-huongdan.png", function(){
    		this.showHuongDan();
    	}.bind(this));
    	btnHelp.setPosition(190, 152);
    	this.addChild(btnHelp);

    	var btnLichSu = new newui.Button("res/et/icon-i.png", function(){
    		this.showVinhDanh();
    	}.bind(this));
    	this.addChild(btnLichSu);
    	btnLichSu.setPosition(76, 152);

    	var btnClose = new newui.Button("res/et/exit-game.png", function(){
    		this.close();
    	}.bind(this));
    	btnClose.setPosition(250, 180);
    	this.addChild(btnClose);

    	var btnDong = new newui.Button("res/et/button-dong.png", function(){
    		this.showChonDong(true);
    	}.bind(this));
    	btnDong.setPosition(188, 71);
    	this.addChild(btnDong);
    	var lbDong = new cc.LabelTTF( this.lines.length , MH.getFont("UTM_Showcard"), 28,cc.size(100, 50), cc.TEXT_ALIGNMENT_CENTER);
    	lbDong.setPosition(95, 20);
    	btnDong.addChild(lbDong);
    	this.btnDong = btnDong;

    	var btnSieuToc = new newui.Button("res/et/button-sieutoc-act.png");
    	btnSieuToc.setPosition(188, 7);
    	this.addChild(btnSieuToc);

    	var btnQuay = new newui.Button("res/et/button-quay.png", function(){
    		thiz._sendRequestSpin();
    	});
    	btnQuay.setPosition(188, -120);
    	this.addChild(btnQuay);

    	var btnTuQuay = new newui.Button("res/et/button-tuquay.png");
    	btnTuQuay.setPosition(188, -56);
    	this.addChild(btnTuQuay);
    	this.btnTuQuay = btnTuQuay;

    	var btn100 = new newui.Button(["res/et/100_inactive.png", "res/et/100.png"], function(){
    		this.changeBetting(100);
    	}.bind(this));
    	btn100.setPosition(-260, 48);
    	this.addChild(btn100);
    	this.btn100 = btn100;
    	var btn1K = new newui.Button(["res/et/1k_inactive.png", "res/et/1k.png"], function(){
    		this.changeBetting(1000);
    	}.bind(this));
    	btn1K.setPosition(-260, -28);
    	this.addChild(btn1K);
    	this.btn1K = btn1K;
    	var btn10K = new newui.Button(["res/et/10k_inactive.png", "res/et/10k.png"], function(){
    		this.changeBetting(10000);
    	}.bind(this));
    	btn10K.setPosition(-260, -104);
    	this.addChild(btn10K);
    	this.btn10K = btn10K;
    },
	_sendRequestSpin: function(){
		this.removeChildByName("winnerEff", "drawLine");
		this.columns[0].runSpin();
		this.columns[1].runSpin();
		this.columns[2].runSpin();
		
		this.scheduleOnce(function(){
			this.forceStopSpin();
		}.bind(this), 2.5);
	},
	forceStopSpin: function(){
		// for( var i=0; i<3; i++ ){
		// 	for(var j=0; j<3; j++){
		// 		var item = this.columns[i].children[0].children[j];
		// 		var newId = Math.floor(Math.random() * 10)%6;
		// 		item.setTexture('res/et/item/icon'+newId+'.png');
		// 		item.iconId = newId;
		// 		this.playItemAnimation(item);
		// 	}
		// }

		this.columns[0].stopSpin();

		this.scheduleOnce(function(){
			this.columns[1].stopSpin();
			this.scheduleOnce(function(){
				this.columns[2].stopSpin();
			}.bind(this), 1);
		}.bind(this), 0.4);

		// this.changeAutoSpin( false );
		// this._onSpin = false;
	},
	playItemAnimation: function(col){
		var arr = [2, 3, 4, 5];

		var items = col.getChildren();

		for( var i=items.length-1; i>=0; i-- ){
			if( arr.indexOf( items[i].itemId ) != -1 ){
				var anim = cc.createSpine("res/et/item/Icon-"+items[i].itemId+".json", "res/et/item/Icon-"+items[i].itemId+".atlas");
				anim.setAnimation(0, "Idle", true);
				anim.itemId = items[i].itemId;
				anim.setPosition(items[i].getPosition());
				anim.setTag(items[i].getTag());
				anim.setName("animation");
				col.addChild(anim);
				col.removeChild(items[i], true);
			}
		}
	},
	stopItemAnimation: function(item){
		
	},
	close: function(){
		MinigamePlugin.getInstance().close(this.gameName);
	},
	open: function(){
		this.setVisible(true);
		this.setPosition(cc.winSize.width/2, cc.winSize.height/2+100);
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
		// MH.countTo(_new, this.labelQuy);
		this.labelQuy.countTo(_new, 1);
		this._dataJackpot = arr;
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
	changeAutoSpin: function(s){
		if( arguments.length == 0 ) s = !this.autoPlay;

		if( s && !this._onSpin ) this._sendRequestSpin();

		this.autoPlay = s;

		//change button stage
		this.btnTuQuay.setActive(s);
	},
	showChonDong: function(){
		var popup = new MHPopupL();
		popup.setTitle("res/et/pickline/text-dongdatcuoc.png");

		var btnChan = new newui.Button("res/et/pickline/popup-button4.png", function(){
			this.lines = [1,3,5,7,9,11,13,15,17,19];
			this.btnDong.children[0].string = this.lines.length;
			for( var i=0; i<20; i++ ){
				if( this.lines.indexOf(i) == -1 ) wrap.children[i].setActive(false);
				else wrap.children[i].setActive(true);
			}

		}.bind(this));
		btnChan.setPosition(-262, -217);

		var btnLe = new newui.Button("res/et/pickline/popup-button3.png", function(){
			this.lines = [0,2,4,6,8,10,12,14,16,18];
			this.btnDong.children[0].string = this.lines.length;
			for( var i=0; i<20; i++ ){
				if( this.lines.indexOf(i) == -1 ) wrap.children[i].setActive(false);
				else wrap.children[i].setActive(true);
			}
		}.bind(this));
		btnLe.setPosition(-87, -217);

		var btnAll = new newui.Button("res/et/pickline/popup-button2.png", function(){
			this.lines = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
			this.btnDong.children[0].string = this.lines.length;
			for( var i=0; i<20; i++ ){
				if( this.lines.indexOf(i) == -1 ) wrap.children[i].setActive(false);
				else wrap.children[i].setActive(true);
			}
		}.bind(this));
		btnAll.setPosition(88, -217);

		var btnNone = new newui.Button("res/et/pickline/popup-button1.png", function(){
			this.lines = [0];
			this.btnDong.children[0].string = this.lines.length;
			for( var i=0; i<20; i++ ){
				if( this.lines.indexOf(i) == -1 ) wrap.children[i].setActive(false);
				else wrap.children[i].setActive(true);
			}
		}.bind(this));
		btnNone.setPosition(263, -217);

		popup.addContent( btnChan, btnLe, btnAll, btnNone );

		for( var i=0; i<20; i++ ){
			var button = new newui.Button(["res/et/pickline/"+ (i+1) +"_2.png","res/et/pickline/"+ (i+1) +".png"], function(sender){
				var lid = sender.lineId;
				var index = this.lines.indexOf(lid);
				if( index === -1 ){
					this.lines.push( lid );
					sender.setActive(true);
				}else{
					this.lines.splice(index, 1);
					sender.setActive(false);
				}

				this.btnDong.children[0].string = this.lines.length;
			}.bind(this));
			button.lineId = i;
			button.x = -321 +158*(i%5);
			button.y = 216 - 110* Math.floor(i/5) ;

			if( this.lines.indexOf(i) === -1 ){
				button.setActive(false);
			}else{
				button.setActive(true);
			}

			popup.addContent(button);
		}

		popup.show();
	},
	showHuongDan: function(){
		var popup = new MHPopupL();
		popup.setTitle("res/et/pickline/text-dongdatcuoc.png");
		var spr = new cc.Sprite("res/et/text-thele.png");
		spr.y = -5;
		popup.setContent( spr );
		popup.show();
	},
	showVinhDanh: function(){
		var popup = new MHPopupL();
        popup.setTitle("res/popup/title/text-BangVinhDanh.png");
        var table = new newui.TableView(995, 530);
        table.setColumn(0.25, 0.2, 0.15, 0.2, 0.2);
        table.setItemHeight(60);
        table.setHeader("Thời gian", "tài khoản","Cược", "Thắng", "Laoij");
        popup.addContent(table);
        popup.show();

        MyRequest.fetchTopSlotMachine(this.gameId ,function(cmd, obj){
			if( obj && obj.status == 0 && obj.data.items.length ){
				var _len = obj.data.items.length;
				var arr = [];
				for( var i=0; i<_len; i++ ){
					if( obj.data.items[i].assetId == MoneyType.Gold ){
						arr.push([ MH.convertTime(obj.data.items[i].createdTime), obj.data.items[i].displayName, MH.numToText(obj.data.items[i].betting), MH.numToText(obj.data.items[i].money), obj.data.items[i].description]);
					}
				}
				table.setContent(arr);
			}
		}.bind(this));
	},
	drawLine: function(lids, eff, showone){//lid|arr, effect
		this.removeChildByName("drawLine");
		drawLineWrap = new cc.Node();
		drawLineWrap.setName("drawLine");
		drawLineWrap.setPosition(-52, -28);
		this.addChild(drawLineWrap, 1); // < khung=2
		
		if( cc.isArray(lids) ){
			if( !eff ){
				for( var i=0; i<lids.length; i++ ){
					var _src = "res/et/line/btnLine_";
					if( lids[i]<10 ) _src += "0";
					_src += lids[i]+".png";
					drawLineWrap.addChild( new cc.Sprite(_src) );
				}
			}else{
				var i=0;
				var interval = 0.1;
				if( cc.isNumber(eff) ) interval = eff;

				cc.director.getScheduler().schedule(function(){
					if( i<lids.length ){
						if( showone ) drawLineWrap.removeAllChildren(true);
						var _src = "res/et/line/btnLine_";
						if( i<10 ) _src += "0";
						_src += lids[i]+".png";
						drawLineWrap.addChild( new cc.Sprite(_src) );
						i++;
					}else{
						if( showone ) drawLineWrap.removeAllChildren(true);
						cc.director.getScheduler().unscheduleAllForTarget(drawLineWrap);
					}
				}, drawLineWrap, interval, false)
			}
		}else{
			cc.log("err. array");
		}
	},
	winnerEff: function(){
		cc.log( "winnerEff" );
		var label = new newui.LabelBMFont(MH.numToText(0), "res/et/font/ET-font1-export.fnt");
		var timeClose = 3;
		var winnerEff;
		if( 1 ){
			winnerEff = new cc.Node();
			var winAnim = cc.createSpine("res/et/fx/ET-Thang-1.json", "res/et/fx/ET-Thang-1.atlas");
			winAnim.setAnimation(0, "Thang-Sieu-Lon", true);
			winnerEff.addChild(winAnim);
			winnerEff.addChild(label);
			label.y = -30;
			if( this.autoPlay ) timeClose = 7;
			else timeClose = 15;
		}else{
			winnerEff = label;
		}

		winnerEff.setName("winnerEff");
		winnerEff.setPosition(-56, 24);
		winnerEff.setAnchorPoint(0.5, 0.5);
		this.addChild(winnerEff, 3); // > khung=2
		label.countTo(30000, 1);

		this.drawLine([2,3,5,6,7,9,12,14,15,18]);

		cc.director.getScheduler().schedule(function(){
			// if auto or free -> send
			// else highline
			if( this.autoPlay ){
				this._sendRequestSpin();
			}else{
				this.removeChildByName("winnerEff");
				this.drawLine([1,2,3,4,5,6,7,8,9], 1, true);
			}
			cc.log("ohhhhhh runnnnnn");
		}.bind(this), winnerEff, 0, 0, timeClose, false, "closeWinnerEff");
	},

	removeChildByName: function(){
		var arr = [];
		for( var i=0; i<arguments.length; i++ ){
			arr.push( arguments[i] );
		}

		var child = this.getChildren();
		for( var i=child.length-1; i>=0; i-- ){
			if( arr.indexOf(child[i].getName()) != -1 ){
				this.removeChild( child[i], true);
			}
		}
	},
	_onupdateGame: function(cmd, data){
		if( data[1].gid != this.gameId ) return;

		switch( parseInt(cmd) ){
			case CMD_SLOT_MACHINE.JACKPOT :
				this.setQuy( data[1].Js );
				break;
			default:
				break;
		}
	},
	onEnter: function(){
		this._super();
		this.changeBetting(1000);
		MiniGameClient.getInstance().addListener( CMD_SLOT_MACHINE.JACKPOT.toString() , this._onupdateGame, this);
		MiniGameClient.getInstance().observerByGameID(this.gameId);
	},
	onExit: function(){
		this._super();
		MiniGameClient.getInstance().removeListener(this);
		TopHuClient.getInstance().removeListener(this);
		if( !this.autoPlay ){
			MiniGameClient.getInstance().removeObserverByGameID(this.gameId);
		}
	}
});