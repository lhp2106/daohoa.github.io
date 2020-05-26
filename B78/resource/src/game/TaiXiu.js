var TaiXiu = cc.Node.extend({
	eid:{T: 1, X:2},
	cuaDat: 0,
	timeForBetting: 5000,
	timeForPayout: 15000,
	sessionId: 0,
	onBetting: false,// can bet or not
	moneyType: MoneyType.Gold,
	history: [],
	ctor: function(){
		this._super();
		this.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2+100));

		this.iconTextures =[];

		var textTop = cc.createSpine("res/taixiu/Icon-DudayTaxi.json", "res/taixiu/Icon-DudayTaxi.atlas");
		textTop.setAnimation(0, "Idle", true);
		textTop.setPosition(0, 188);
		this.addChild(textTop, -3);

		var bg = new cc.Sprite("res/taixiu/bkg.png");
		this.addChild(bg, -2);	

		var iconTai = new cc.Sprite("res/taixiu/tai.png");
		iconTai.x = -187;
		iconTai.y = 98;
		this.addChild(iconTai);
		var iconXiu = new cc.Sprite("res/taixiu/xiu.png");
		iconXiu.x = 196;
		iconXiu.y = 98;
		this.addChild(iconXiu);
		this.initButton();

		var inputT = new newui.Button("res/taixiu/textbox-bet.png", function(){
			this.showCuoc(true, this.eid.T);
		}.bind(this)); // button bật keyboard. ko phải input
		inputT.setTitleText("Đặt");
		inputT.setTitleFontSize(20);
		inputT.setPosition(-194, 2);
		inputT.setTitlePadding(0, -3);
		this.addChild(inputT);
		this.inputTai = inputT.getTitle();
		var inputX = new newui.Button("res/taixiu/textbox-bet.png", function(){
			this.showCuoc(true, this.eid.X);
		}.bind(this));
		inputX.setTitleText("Đặt");
		inputX.setTitleFontSize(20);
		inputX.setPosition(194, 2);
		inputX.setTitlePadding(0, -3);
		this.addChild(inputX);
		this.inputXiu = inputX.getTitle();

		this.userTai = new cc.LabelTTF("0", MH.getFont("Font_Default"), 22, cc.size(100, 50), cc.TEXT_ALIGNMENT_RIGHT);
		this.userTai.setPosition(-180, -130);
		this.userTai.setFontFillColor(cc.color(255, 235, 59, 255));
		this.addChild(this.userTai);
		this.userXiu = new cc.LabelTTF("0", MH.getFont("Font_Default"), 22, cc.size(100, 50), cc.TEXT_ALIGNMENT_LEFT);
		this.userXiu.setPosition(190, -130);
		this.userXiu.setFontFillColor(cc.color(255, 235, 59, 255));
		this.addChild(this.userXiu);
		
		this.quyTai = new cc.LabelBMFont("0", "res/taixiu/font/font-minigame-export.fnt", 400, cc.TEXT_ALIGNMENT_CENTER);
		this.quyTai.setScale(0.6);
		this.quyTai.setPosition(-200, 92);
		this.addChild(this.quyTai);
		this.quyXiu = new cc.LabelBMFont("0", "res/taixiu/font/font-minigame-export.fnt", 400, cc.TEXT_ALIGNMENT_CENTER);
		this.quyXiu.setScale(0.6);
		this.quyXiu.setPosition(200, 92);
		this.addChild(this.quyXiu);

		this.wrapHistory = new cc.Node();
		this.wrapHistory.x = 254;
		this.wrapHistory.y = -158;
		this.addChild( this.wrapHistory,5);

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
	},
	initButton: function(){
		var btnClose = new newui.Button("res/taixiu/close-btn.png", function(){
			this.close();
		}.bind(this));
		btnClose.x = 285;
		btnClose.y = 150;
		this.addChild(btnClose, 5);

		var btnBxh = new newui.Button("res/taixiu/bxh-icon.png", function(){

		});
		btnBxh.x = 4;
		btnBxh.y = 168;
		this.addChild(btnBxh, 5);

		var btnHelp = new newui.Button("res/taixiu/help-icon.png", function(){

		});
		btnHelp.x = 62;
		btnHelp.y = 168;
		this.addChild(btnHelp, 5);

		var btnLsgd = new newui.Button("res/taixiu/lsgd-icon.png", function(){

		});
		btnLsgd.x = -54;
		btnLsgd.y = 168;
		this.addChild(btnLsgd, 5);

		var btnChat = new newui.Button(["res/taixiu/chat-exit-icon.png","res/taixiu/chat-icon.png"], function(){
			var wrapChat = this.getChildByName("wrapChat");
			if( wrapChat ) this.showChat(false);
			else this.showChat(true);
		}.bind(this));
		btnChat.setPosition(-266, -82);
		btnChat.setName("btnChat");
		this.addChild(btnChat, 5);

		var btnSoiCau = new newui.Button("res/taixiu/soicau-icon.png", function(){
			this.showSoiCau();
		}.bind(this));
		btnSoiCau.setPosition(266, -82);
		this.addChild(btnSoiCau, 5);
	},
	close: function(){
		MinigamePlugin.getInstance().close(this.gameName);
	},
	open: function(){
		this.setVisible(true);
		this.setPosition(cc.winSize.width/2, cc.winSize.height/2+100);
	},
	drawHistory: function(){
		this.wrapHistory.removeAllChildren(true);

		var lastBg = new cc.Sprite("res/taixiu/dot_SangOutline.png");
		this.wrapHistory.addChild(lastBg);

		var _tmp = 0;
		var _tong = 0;
		for( var i=this.history.length-1; i>=0; i-- ){
			if( _tmp > 14 ) break;
			_tong = this.history[i].d1+this.history[i].d2+this.history[i].d3;

			var _src;
			if( _tong > 10 ) _src = "res/taixiu/dotTai.png";
			else _src = "res/taixiu/dotXiu.png";

			var btn = new newui.Button(_src, function(sender){
				var sendObj = [
					command.ZonePluginMessage,
					Constant.CONSTANT.ZONE_NAME_MINI_GAME,
					miniGamePlugin.PLUGIN_TAI_XIU,
					{
						'cmd':CMD_TAI_XIU.GET_INFO_PHIEN,
						'sid':parseInt(sender._sessionIdTX),
						'aid': this.moneyType
					}
				];
				MiniGameClient.getInstance().send(sendObj);
			}.bind(this));				

			btn.x = -_tmp*36;
			btn.y = 0;
			btn._sessionIdTX = this.history[i].sid; 
			this.wrapHistory.addChild(btn);

			if( _tmp == 0 ) btn.setScale(0.8, 0.8);
			else btn.setScale(0.9, 0.9);

			_tmp++;
		}
	},
	sendBetting: function(b, eid){
		if( b === 'TATTAY' ){
			var sendObj = [
				command.ZonePluginMessage,
				Constant.CONSTANT.ZONE_NAME_MINI_GAME,
				miniGamePlugin.PLUGIN_TAI_XIU,
				{
					'cmd': CMD_TAI_XIU.BETTING_ALL,
					'aid': MoneyType.Gold,
					'eid': eid
				}
			];
		}else{
			var sendObj = [
				command.ZonePluginMessage,
				Constant.CONSTANT.ZONE_NAME_MINI_GAME,
				miniGamePlugin.PLUGIN_TAI_XIU,
				{
					'cmd': CMD_TAI_XIU.BETTING_DONE,
					'b': b,
					'aid': MoneyType.Gold,
					'eid': eid
				}
			];
		}

		MiniGameClient.getInstance().send(sendObj);
	},
	showCuoc: function(visible, type, buttonMode){
		var thiz = this;
		this.removeChildByName("wrapCuoc");
		if( visible ){
			this.showCuoc(false);

			if( !this.onBetting ) return;

			var input;
			if( type == this.eid.X ){
				input = this.inputXiu;
			}else{
				input = this.inputTai;
			}

			input.string = 0;

			var wrapCuoc = new cc.Sprite("res/taixiu/cuoc/dat-bg.png");
			wrapCuoc.setPosition(0, -183);
			wrapCuoc.setAnchorPoint(0.5, 1);
			wrapCuoc.setName("wrapCuoc");
			this.addChild(wrapCuoc);

			if( !buttonMode ){
				buttonMode = 1;
				//ani
				wrapCuoc.scaleY = 0;
				wrapCuoc.runAction(cc.scaleTo(0.2, 1, 1));
			}

			var btnSoKhac = new newui.Button("res/taixiu/cuoc/sokhac-btn.png", function(){
				if( buttonMode === 1 ) this.showCuoc(true, type, 2);
				else this.showCuoc(true, type, 1);
			}.bind(this));
			btnSoKhac.setPosition(86, 48);
			wrapCuoc.addChild(btnSoKhac);

			var btnHuy = new newui.Button("res/taixiu/cuoc/huy-btn.png", function(){
				this.showCuoc(false);
			}.bind(this));

			btnHuy.setPosition(214, 48);
			wrapCuoc.addChild(btnHuy);

			var btnDongY = new newui.Button("res/taixiu/cuoc/dongy-btn.png", function(){
				if( !this.onBetting ){
					this.notify('Hết giờ đặt cược',2);
					this.showCuoc(false);
					return false;
				}

				var _b = input.getString();
				_b = parseInt(_b.replace(/[^0-9]/g, ''));

				this.sendBetting(_b, type);
				this.showCuoc(false);
			}.bind(this));
			btnDongY.setPosition(340, 48);
			wrapCuoc.addChild(btnDongY);

			var btnAllIn = new newui.Button("res/taixiu/cuoc/allin-btn.png", function(){
				if( !this.onBetting ){
					this.notify('Hết giờ đặt cược',2);
					this.showCuoc(false);
					return false;
				}
				this.sendBetting("TATTAY");
				this.showCuoc(false);
			}.bind(this));
			btnAllIn.setPosition(468, 48);
			wrapCuoc.addChild(btnAllIn);

			cc.eventManager.addListener({
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
            	swallowTouches: true,
            	onTouchBegan: function (touch, event) {
	                var sprSize = wrapCuoc.getContentSize();
	                var rect = cc.rect(0, 0, sprSize.width, sprSize.height);
	                if (cc.rectContainsPoint(rect, wrapCuoc.convertToNodeSpace(touch.getLocation()))){
	                	return true;
	                }
	                return false;
	            }
			}, wrapCuoc);

			if( buttonMode === 1 ){
				var arrWrap1 = [1000, 5000, 50000, 100000, 500000, 1000000, 5000000, 10000000];
				for( var i=0; i<arrWrap1.length; i++ ){
					var _btnName;
					if( arrWrap1[i] % 1000000 == 0 ) _btnName = arrWrap1[i]/1000000 + "m.png";
					else _btnName = arrWrap1[i]/1000 + "k.png";

					var button = new newui.Button("res/taixiu/cuoc/"+_btnName, function(){
						if( this._numcuoc ){
							input.string = MH.numToText(this._numcuoc);
						}
					});
					button._numcuoc = arrWrap1[i];

					if( Math.floor(i/4) == 0 ) button.y = 170;	
					else button.y = 110;

					button.x = 82 + (i%4)*131;
					
					wrapCuoc.addChild(button);
				}
			}else if( buttonMode === 2 ){
				var arrWrap2 = [1,2,3,4,5,6,7,8,9,0,"000", "delete"];
				for( var i=0; i<arrWrap2.length; i++ ){
					var button = new newui.Button("res/taixiu/cuoc/"+arrWrap2[i]+".png", function(){
						var _b = input.getString()+"";
						if( this._keystring === "delete" ){
							if( _b.length >1 ) _b = _b.substring(0, _b.length - 1);
							else _b = "0";
						}else{
							_b = _b+this._keystring;
						}

						_b = parseInt(_b.replace(/[^0-9]/g, ''));
						if( _b > 1000000000 ) return; // max 1ty
						_b = MH.numToText(_b);
						input.setString( _b );
					});
					button._keystring = arrWrap2[i];

					if( Math.floor(i/6) == 0 ) button.y = 170;	
					else button.y = 110;
					button.x = 62 + (i%6)*86;
					wrapCuoc.addChild(button);
	 			}
			}
		}else{
			this.inputXiu.string = "Đặt";
			this.inputTai.string = "Đặt";
		}
	},
	showChat: function(visible){
		this.getChildByName("btnChat").setActive( visible );

		this.removeChildByName("wrapChat");

		if( visible ){
			var wrapChat = new cc.Sprite("res/taixiu/chat-bg.png");
			wrapChat.setPosition(-460, -30);
			wrapChat.setName("wrapChat");
			this.addChild(wrapChat);

			cc.eventManager.addListener({
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
            	swallowTouches: true,
            	onTouchBegan: function (touch, event) {
	                var sprSize = wrapChat.getContentSize();
	                var rect = cc.rect(0, 0, sprSize.width, sprSize.height);
	                if (cc.rectContainsPoint(rect, wrapChat.convertToNodeSpace(touch.getLocation()))){
	                	return true;
	                }
	                return false;
	            }
			}, wrapChat);
		}
	},
	showHistory: function(data){

	},
	showSoiCau: function(){
		var popup = new MHPopupL();
		popup.setTitle("res/taixiu/soicau/soicau-title.png");

		var bg = new cc.Sprite("res/taixiu/soicau/demo2.jpg");
		bg.y = 30;

		var drtong = true, drxx1 = true, drxx2 = true, drxx3 = true;
		// popup.addContent( bg );
		//
		var openWrap1 = function(){
			cc.log("his", this.history);
			var btnL = new newui.Button("res/taixiu/soicau/arrow-left.png", function(){
				openWrap2();
			});
			btnL.setPosition(-470, 30);

			var btnR = new newui.Button("res/taixiu/soicau/arrow-right.png", function(){
				openWrap2();
			});
			btnR.setPosition(470, 30);

			var note = new cc.Sprite("res/taixiu/soicau/note.png");
			note.setPosition(350, -2);

			var lastHis = this.history[this.history.length-1];

			var title1 = new cc.LabelTTF("Phiên gần nhất (#"+ lastHis.sid +") -", MH.getFont("Font_Default"), 26, cc.size(400, 50), cc.TEXT_ALIGNMENT_RIGHT);
			title1.setPosition(-150, 235);

			var _str2 = (lastHis.d1+lastHis.d2+lastHis.d3) + " ("+ lastHis.d1 +"-"+ lastHis.d2 +"-"+ lastHis.d3 +")";
			if( lastHis.d1+lastHis.d2+lastHis.d3 > 10 ) _str2 = "Tài "+ _str2;
			else _str2 = "Xỉu "+ _str2;
			var title2 = new cc.LabelTTF(_str2, MH.getFont("Font_Default"), 26, cc.size(200, 50), cc.TEXT_ALIGNMENT_LEFT);
			title2.setFontFillColor(cc.color(255, 193, 7, 255));
			title2.setPosition(158, 235);

			var table1 = new cc.Sprite("res/taixiu/soicau/table-chart1.png");
			table1.setPosition(-90, 123);

			var table2 = new cc.Sprite("res/taixiu/soicau/table-chart2.png");
			table2.setPosition(-85, -120);

			var btnTong = new newui.Button(["res/taixiu/soicau/checkbox.png", "res/taixiu/soicau/checkbox-active.png"], function(){
				drtong = !drtong;
				openWrap1();
			});
			btnTong.setPosition(278, 207);
			btnTong.setActive(drtong);

			var btnXx1 = new newui.Button(["res/taixiu/soicau/checkbox.png", "res/taixiu/soicau/checkbox-active.png"], function(){
				drxx1 = !drxx1;
				openWrap1();
			});
			btnXx1.setPosition(278, 150);
			btnXx1.setActive(drxx1);

			var btnXx2 = new newui.Button(["res/taixiu/soicau/checkbox.png", "res/taixiu/soicau/checkbox-active.png"], function(){
				drxx2 = !drxx2;
				openWrap1();
			});
			btnXx2.setPosition(278, 90);
			btnXx2.setActive(drxx2);

			var btnXx3 = new newui.Button(["res/taixiu/soicau/checkbox.png", "res/taixiu/soicau/checkbox-active.png"], function(){
				drxx3 = !drxx3;
				openWrap1();
			});
			btnXx3.setPosition(278, 32);
			btnXx3.setActive(drxx3);

			var draw = new cc.DrawNode();
			var arrDots = [];
			var arrPos1 = [];
			var arrPos2 = [];
			var arrPos3 = [];
			var _tmp = 0;
			for( var i=this.history.length-1; i>=0; i-- ){
				if( _tmp >= 18 ) break;
				var _tong = this.history[i].d1+this.history[i].d2+this.history[i].d3;
				var pos = cc.p(221 - _tmp*35, 36+(_tong-3)*35/3);
				arrDots.push({p: pos, t: _tong>10});

				arrPos1.push( cc.p(223-_tmp*35, -194+this.history[i].d1*35-35) );
				arrPos2.push( cc.p(223-_tmp*35, -194+this.history[i].d2*35-35) );
				arrPos3.push( cc.p(223-_tmp*35, -194+this.history[i].d3*35-35) );
				_tmp++;
			}

			if( drtong ){
				for( var i=0; i<arrDots.length; i++ ){
					if( i==arrDots.length-1 ) break;
					draw.drawSegment(arrDots[i].p, arrDots[i+1].p, 2, cc.color(254, 221, 153, 255));
				}

				for( var i=0; i<arrDots.length; i++ ){
					if( arrDots[i].t ) draw.drawDot( arrDots[i].p, 13, cc.color(0,0,0, 255));
					else draw.drawDot( arrDots[i].p, 13, cc.color(255,255,255, 255));
				}
			}

			if( drxx1 ){
				for( var i=0; i<arrPos1.length; i++ ){
					draw.drawDot( arrPos1[i], 8, cc.color(19, 237, 178, 255));
					if( i==arrPos1.length-1 ) break;
					draw.drawSegment(arrPos1[i], arrPos1[i+1], 1, cc.color(19, 237, 178, 255));
				}
			}

			if( drxx2 ){
				for( var i=0; i<arrPos2.length; i++ ){
					draw.drawDot( arrPos2[i], 8, cc.color(253, 120, 7, 255));
					if( i==arrPos2.length-1 ) break;
					draw.drawSegment(arrPos2[i], arrPos2[i+1], 1, cc.color(253, 120, 7, 255));
				}
			}

			if( drxx3 ){
				for( var i=0; i<arrPos3.length; i++ ){
					draw.drawDot( arrPos3[i], 8, cc.color(2, 9, 250, 255));
					if( i==arrPos3.length-1 ) break;
					draw.drawSegment(arrPos3[i], arrPos3[i+1], 1, cc.color(2, 9, 250, 255));
				}
			}

			popup.setContent(btnL, btnR, note, table1,table2, btnTong, btnXx1, btnXx2, btnXx3, draw, title1, title2);
		}.bind(this);

		var openWrap2 = function(){
			var btnL = new newui.Button("res/taixiu/soicau/arrow-left.png", function(){
				openWrap1();
			});
			btnL.setPosition(-470, 30);
			
			var btnR = new newui.Button("res/taixiu/soicau/arrow-right.png", function(){
				openWrap1();
			});
			btnR.setPosition(470, 30);

			var title = new cc.Sprite("res/taixiu/soicau/title-result.png");
			title.y = 240;

			var table1 = new cc.Sprite("res/taixiu/soicau/table-result.png");
			table1.setPosition(-12, 88);
			var table2 = new cc.Sprite("res/taixiu/soicau/table-result2.png");
			table2.setPosition(-12, -148);

			var _src = "", _tong = 0,_tmp = 0, arr = [], crCol = -1;
			var _countT = 0, _countX = 0;

			for( var i=this.history.length-1; i>=0; i-- ){
				if( _tmp >= 100 ) break;
				_tong = this.history[i].d1+this.history[i].d2+this.history[i].d3;
				//
				if( _tong > 10 &&  crCol != 1 ){
					crCol = 1;
					arr.unshift([]);
				}
				if( _tong <= 10 &&  crCol != 2 ){
					crCol = 2;
					arr.unshift([]);
				}
				arr[0].unshift(crCol);


				//
				if( _tong > 10 ){
					_countT++
					_src = "res/taixiu/dotTai.png";
				}else{
					_src = "res/taixiu/dotXiu.png";
					_countX++;
				}
				var spr = new cc.Sprite(_src);
				spr.setScale(0.8);
				spr.y = 20 + _tmp%5*39;
				spr.x = 760 - Math.floor(_tmp/5)*39;
				table2.addChild(spr);
				_tmp++;
			}

			_tmp = 0, _src = "";
			for( var i = arr.length-1; i>=0; i-- ){
				if( _tmp >= 20 ) break;
				for( var ii=0; ii<arr[i].length;ii++ ){
					if( ii > 5 ) break;
					if( arr[i][ii] == 1 ) _src = "res/taixiu/dotTai.png";
					else _src = "res/taixiu/dotXiu.png";
					var spr = new cc.Sprite(_src);
					spr.setScale(0.8);
					spr.x = 760 - _tmp*39;
					spr.y = 215 - ii*39;
					table1.addChild(spr);
				}
				_tmp++;
			}

			var label1 = new cc.LabelTTF("Tài: "+ _countT, MH.getFont("UTM_Eremitage"), 32, cc.size(150, 50), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM);
			label1.setFontFillColor(cc.color(0,0,0));
			label1.setPosition(-50, 245);
			var label2 = new cc.LabelTTF("Xỉu: "+ _countX, MH.getFont("UTM_Eremitage"), 32, cc.size(150, 50), cc.TEXT_ALIGNMENT_RIGHT, cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM);
			label2.setPosition(46, 245);

			popup.setContent(btnL, btnR, title, table1, table2, label1, label2);
		}.bind(this);

		openWrap1();
		///
		popup.show();
	},
	showPhienInfo: function(data){
		cc.log("show", data);
		var popup = this.popupPhienInfo? this.popupPhienInfo : new MHPopupL();

		var bg = new cc.Sprite("res/taixiu/soicau/demo3.jpg");

		var sprLight = new cc.Sprite("res/taixiu/light-win.png");
		sprLight.runAction( cc.repeatForever(new cc.Blink(15, 60)));
		if( data.d1+data.d2+data.d3 > 10 ) sprLight.setPosition(-350,240);
		else sprLight.setPosition(350,240);

		var iconTai = new cc.Sprite("res/taixiu/tai.png");
		iconTai.setScale(1.3, 1.3);
		iconTai.setPosition(-350,240);

		var iconXiu = new cc.Sprite("res/taixiu/xiu.png");
		iconXiu.setScale(1.3, 1.3);
		iconXiu.setPosition(355,240);

		var btnL = new newui.Button("res/taixiu/soicau/arrow-left.png", function(){
			var crSession = data.sid;
			for( var i=this.history.length-1; i>=0; i-- ){
				if( this.history[i].sid == crSession && i>0 ){
					// this.history[i-1].sid
					var sendObj = [
						command.ZonePluginMessage,
						Constant.CONSTANT.ZONE_NAME_MINI_GAME,
						miniGamePlugin.PLUGIN_TAI_XIU,
						{
							'cmd':CMD_TAI_XIU.GET_INFO_PHIEN,
							'sid': this.history[i-1].sid,
							'aid': this.moneyType
						}
					];
					MiniGameClient.getInstance().send(sendObj);
					break;
				}
			}
		}.bind(this));
		btnL.setPosition(-185, 260);
		var btnR = new newui.Button("res/taixiu/soicau/arrow-right.png", function(){
			var crSession = data.sid;
			for( var i=this.history.length-1; i>=0; i-- ){
				if( this.history[i].sid == crSession && i<this.history.length-1 ){
					// this.history[i+1].sid
					var sendObj = [
						command.ZonePluginMessage,
						Constant.CONSTANT.ZONE_NAME_MINI_GAME,
						miniGamePlugin.PLUGIN_TAI_XIU,
						{
							'cmd':CMD_TAI_XIU.GET_INFO_PHIEN,
							'sid': this.history[i+1].sid,
							'aid': this.moneyType
						}
					];
					MiniGameClient.getInstance().send(sendObj);
					break;
				}
			}
		}.bind(this));
		btnR.setPosition(185, 260);

		var wrapPhien = new cc.Sprite("res/taixiu/soicau/title-result.png");
		wrapPhien.y = 260;
		var lbPhien = new cc.LabelTTF("#"+data.sid, MH.getFont("Font_Default"), 26, cc.size(280, 50), cc.TEXT_ALIGNMENT_CENTER);
		lbPhien.y = 248;

		var spr1 = new cc.Sprite("res/taixiu/dice/3"+ data.d1 +".png");
		spr1.setPosition(-110, 198);
		spr1.setScale(0.5);
		var spr2 = new cc.Sprite("res/taixiu/dice/3"+ data.d2 +".png");
		spr2.setPosition(-55, 198);
		spr2.setScale(0.5);
		var spr3 = new cc.Sprite("res/taixiu/dice/3"+ data.d3 +".png");
		spr3.setPosition(0, 198);
		spr3.setScale(0.5);

		var lbNum = new cc.LabelTTF("= "+(data.d1+data.d2+data.d3), MH.getFont("UTM_Eremitage"), 42, cc.size(120, 50), cc.TEXT_ALIGNMENT_LEFT);
		lbNum.setPosition(100, 198);

		// 500 370
		var tableT = new newui.TableView(625, 525);
		tableT.setColumn(0.25, 0.3,0.25, 0.2);
		tableT.setHeader("Thời gian", "Tên tài khoản", "Đặt", "Trả lại");
		tableT.setScale(0.8);
		tableT.setPosition(-260, 175);
		tableT.setColumnColor(2, cc.color(255, 193, 7, 255));
		tableT.setColumnColor(3, cc.color(255, 193, 7, 255));

		var tableX = new newui.TableView(625, 525);
		tableX.setColumn(0.25, 0.3,0.25, 0.2);
		tableX.setHeader("Thời gian", "Tên tài khoản", "Đặt", "Trả lại");
		tableX.setScale(0.8);
		tableX.setPosition(260, 175);

		var arrT = [], arrX = [], _len = data.bs.length,
			_refundT = 0, _refundX = 0, _bettingT = 0, _bettingX = 0;
		for( var i=0; i< _len; i++ ){
			var arr = [MH.convertTime(data.bs[i].crt, "%h:%i:%s"), data.bs[i].dn, MH.numToText( data.bs[i].b ), MH.numToText( data.bs[i].rf )];
			if( data.bs[i].eid == 1 ){ //T
				arrT.push(arr);
				_refundT += data.bs[i].rf;
				_bettingT += data.bs[i].b;
			}else{
				arrX.push(arr);
				_refundX += data.bs[i].rf;
				_bettingX += data.bs[i].b;
			}
		}

		tableT.setContent(arrT);
		tableX.setContent(arrX);

		var lb1 = new cc.LabelTTF("Tổng", MH.getFont("Font_Default"), 20);
		lb1.setFontFillColor(cc.color(255, 193, 7, 255));
		lb1.setPosition(-310, -275);
		var lb2 = new cc.LabelTTF("Tổng", MH.getFont("Font_Default"), 20);
		lb2.setFontFillColor(cc.color(255, 193, 7, 255));
		lb2.setPosition(210, -275);

		var lb3 = new cc.LabelTTF(MH.numToText(_bettingT), MH.getFont("Font_Default"), 20, cc.size(250, 0), cc.TEXT_ALIGNMENT_CENTER);
		lb3.setFontFillColor(cc.color(255, 193, 7, 255));
		lb3.setPosition(-175, -275);
		var lb4 = new cc.LabelTTF(MH.numToText(_bettingX), MH.getFont("Font_Default"), 20, cc.size(250, 0), cc.TEXT_ALIGNMENT_CENTER);
		lb4.setFontFillColor(cc.color(255, 193, 7, 255));
		lb4.setPosition(343, -275);

		var lb5 = new cc.LabelTTF(MH.numToText(_refundT), MH.getFont("Font_Default"), 20, cc.size(250, 0), cc.TEXT_ALIGNMENT_CENTER);
		lb5.setFontFillColor(cc.color(255, 193, 7, 255));
		lb5.setPosition(-57, -275);
		var lb6 = new cc.LabelTTF(MH.numToText(_refundX), MH.getFont("Font_Default"), 20, cc.size(250, 0), cc.TEXT_ALIGNMENT_CENTER);
		lb6.setFontFillColor(cc.color(255, 193, 7, 255));
		lb6.setPosition(460, -275);
		//
		popup.setContent( sprLight,iconTai, iconXiu, btnL, btnR,wrapPhien, lbPhien, spr1, spr2, spr3, lbNum, tableT, tableX, lb1, lb2, lb3, lb4, lb5, lb6);
		popup.show();
		popup.onClose = function(){
			this.popupPhienInfo = null;
		}.bind(this);
		this.popupPhienInfo = popup;
	},
	showKq: function(data){
		this.removeChildByName("clockB", "wrapKq");
		var wrapKq = new cc.Node();
		wrapKq.setName("wrapKq");
		wrapKq.setScale(0.6);
		wrapKq.setPosition(-4,38);
		this.addChild(wrapKq, 6);

		var anim = cc.createSpine("res/taixiu/dice/skeleton.json", "res/taixiu/dice/skeleton.atlas");
		anim.setAnimation(0, "Idle", false);

		anim.setAnimationListener(this, function(anim){
			wrapKq.removeAllChildren(true);

			var spr1 = new cc.Sprite("res/taixiu/dice/1"+ data.d1 +".png");
			var spr2 = new cc.Sprite("res/taixiu/dice/2"+ data.d2 +".png");
			var spr3 = new cc.Sprite("res/taixiu/dice/3"+ data.d3 +".png");
			wrapKq.addChild(spr1);
			wrapKq.addChild(spr2);
			wrapKq.addChild(spr3);

			//winner
			this.winner( data );

			this.scheduleOnce(function(){
				this.runClockS(this.timeForPayout-10000);
			}, 5);
		}.bind(this));

		wrapKq.addChild(anim);
	},
	winner: function(data){
		this.removeChildByName("kqNum", "lightTai", "lightXiu");
		var kqNum = new cc.Sprite("res/taixiu/result-bg.png");
		kqNum.setPosition(80, 90);
		kqNum.setName("kqNum");
		this.addChild(kqNum);
		var labelKq = new cc.LabelBMFont("0", "res/taixiu/font/font-taixiu-export.fnt", 400, cc.TEXT_ALIGNMENT_CENTER);
		labelKq.setScale(0.2);
		labelKq.setPosition(31, 37);
		kqNum.addChild(labelKq);

		labelKq.setString(data.d1+data.d2+data.d3);

		var light = new cc.Sprite("res/taixiu/light-win.png");
		light.runAction(new cc.Blink(20, 60));
		this.addChild(light, -1);
		if( (data.d1+data.d2+data.d3) <= 10 ){
			light.setPosition(185, 90);
			light.setName("lightXiu");
		}else{
			light.setPosition(-185, 90);
			light.setName("lightTai");
		}

		var _lai = 0;

		if( data.GX ){
			_lai = data.GX;
			if( data.gR ) _lai = _lai - data.gR;
		}else if( data.CX ){
			_lai = data.CX;
			if( data.gR ) _lai = _lai - data.gR;
		}

		if( _lai ){
			
		}else{

		}

		if( this.cuaDat != 0 ){
			LobbyRequest.getInstance().requestUpdateMoney();
		}
	},
	runClockB: function(_t){
		if(_t > 1000) _t = Math.floor(_t/1000);

		this.removeChildByName("wrapKq", "kqNum", "lightTai", "lightXiu", "clockB", "xoayTron");

		var clockB = new cc.Node();
		clockB.setPosition(0,30);
		clockB.setName("clockB");
		this.addChild(clockB);
		var num1 = new cc.LabelBMFont("0", "res/taixiu/font/font-taixiu-export.fnt", 400, cc.TEXT_ALIGNMENT_CENTER);
		num1.setScale(0.6)
		num1.setAnchorPoint(1, 0.5);
		clockB.addChild(num1);

		var num2 = new cc.LabelBMFont("0", "res/taixiu/font/font-taixiu-export.fnt", 400, cc.TEXT_ALIGNMENT_CENTER);
		num2.setAnchorPoint(0, 0.5);
		num2.setScale(0.6);
		clockB.addChild(num2);

		if( _t > 5 ){
			num1.setColor(cc.color(255,255,255));
			num2.setColor(cc.color(255,255,255));

			var xoayTron = new cc.Sprite("res/taixiu/circle-effect.png");
			xoayTron.setPosition(2, 14);
			xoayTron.setName("xoayTron");
			xoayTron.runAction(cc.rotateBy(60, 10800));
			this.addChild(xoayTron);
		}else{
			num1.setColor(cc.color(255,0, 0));
			num2.setColor(cc.color(255,0, 0));
		}

		num1.setString(Math.floor(_t/10));
		num2.setString(_t%10);

		cc.director.getScheduler().schedule(function(){
			_t -=1;
			if( _t >= 0 ){
				num1.setString(Math.floor(_t/10));
				num2.setString(_t%10);

				if( _t === 5 ){
					this.removeChildByName("xoayTron");
					num1.setColor(cc.color(255,0, 0));
					num2.setColor(cc.color(255,0, 0));
				}

				//
				num2.y = 80;		
				num2.opacity = 0;
				num2.runAction(cc.fadeIn(0.1));
				num2.runAction(cc.moveBy(0.2, cc.p(0, -80)).easing(cc.easeBackOut()));
				//
				if( Math.floor(_t/10) !== Math.floor((_t+1)/10) ){
					num1.y = 80;		
					num1.opacity = 0;
					num1.runAction(cc.fadeIn(0.1));
					num1.runAction(cc.moveBy(0.2, cc.p(0, -80)).easing(cc.easeBackOut()));
				}
			}else{
				cc.director.getScheduler().unscheduleAllForTarget(clockB);
			}

			cc.log("clockb running");
		}.bind(this), clockB, 1, false);
		// callback, target, interval, repeat, delay, paused, key
	},
	runClockS: function(_t){
		if(_t > 1000) _t = Math.floor(_t/1000);

		this.removeChildByName("clockS");
		var clockS = new cc.LabelTTF("", MH.getFont("Font_Default"), 22, cc.size(150, 50), cc.TEXT_ALIGNMENT_CENTER);
		clockS.setName("clockS");
		clockS.setPosition(0, -130);
		this.addChild(clockS);

		var _minute = Math.floor(_t/60),
			_second = _t%60;
		
		if( _minute < 10 ) _minute = "0"+_minute;
		if( _second < 10 ) _second = "0"+_second;
		clockS.setString(_minute+":"+_second);

		cc.director.getScheduler().schedule(function(){
			_t -= 1;
			if( _t > 0 ){
				var _minute = Math.floor(_t/60),
					_second = _t%60;
				
				if( _minute < 10 ) _minute = "0"+_minute;
				if( _second < 10 ) _second = "0"+_second;
				clockS.setString(_minute+":"+_second);
			}else{
				cc.director.getScheduler().unscheduleAllForTarget(clockS);
			}
		}, clockS, 1, false);
	},
	notify: function(_txt, _t){
		var thiz = this;
		if( !this.wrapNotify ){
			var wrap = new cc.Node();
			wrap.setCascadeOpacityEnabled(true);
			this.addChild(wrap, 99);
	        this.wrapNotify = wrap;
		}else{
			this.wrapNotify.removeAllChildren(true);
			this.wrapNotify.stopAllActions();
			this.wrapNotify.setVisible(true);
		}

		this.wrapNotify.setPosition(0, -206);
		this.wrapNotify.opacity = 0;

		var bg = new cc.Scale9Sprite("res/taixiu/notify-bg.png");//cc.rect(0, 0, 269, 50)
        this.wrapNotify.addChild(bg);

        var lb = new cc.LabelTTF(_txt, MH.getFont("Font_Default"), 26);
        lb.y = -5;
        this.wrapNotify.addChild(lb);

        bg.width = lb.width + 60;

        var timeOut = _t? _t:3;
        if(timeOut > 1000) timeOut = Math.floor(timeOut/1000);

        this.wrapNotify.runAction(cc.sequence(cc.fadeIn(0.1), cc.delayTime(timeOut), cc.callFunc(function(){
        	thiz.wrapNotify.setVisible(false);
        	thiz.wrapNotify.removeAllChildren(true);
        }, this)));
	},
	setSession: function(sid){
		this.sessionId = sid;
	},
	resetBetting: function(){
		this.removeChildByName("cuocTai", "cuocXiu");
	},
	setCuoc: function(_n, eid){
		var _name = "cuocXiu";
		if( eid === this.eid.T ) _name = "cuocTai";

		this.removeChildByName(_name);

		if(_n){
			var label = new cc.LabelTTF( MH.numToText(_n), MH.getFont("Font_Default"), 22, cc.size(150, 50), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM);
			label.setName(_name);
			this.addChild(label);

			if( eid === this.eid.T ) label.setPosition(-194, -28);
			else label.setPosition(194, -28);
		}
	},
	enableBetting: function(){
		this.onBetting = true;
	},
	disableBetting: function(){
		this.onBetting = false;
		this.showCuoc(false);
	},
	setTotal: function(data){
		if( data.gi ){
			var _oldT = 0, _oldX = 0;
			for( var i=0; i<data.gi.length; i++ ){
				if( data.gi[i].aid === this.moneyType ){
					this.userTai.setString(MH.numToText(data.gi[i].B.tU));
					this.quyTai.setString(MH.numToText(data.gi[i].B.tB));
					this.userXiu.setString(MH.numToText(data.gi[i].S.tU));
					this.quyXiu.setString(MH.numToText(data.gi[i].S.tB));
					break;
				}
			}
		}
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
		switch( parseInt(cmd) ){
			case CMD_TAI_XIU.CHARGE_MONEY:
				if( data[1].gBB != undefined ){
					this.quyTai.setString(MH.numToText(data[1].gBB));
					this.quyXiu.setString(MH.numToText(data[1].gBB));
				}

				if( data[1].gR && data[1].gB ){
					var _hoantra = data[1].gB-data[1].gR;
					if( _hoantra <= 0 ) _hoantra = 0;

					this.setCuoc(MH.numToText(_hoantra), this.cuaDat);
				}

				this.scheduleOnce(function(){
					this.showKq(data[1]);
				}.bind(this), 2);
				break;
			case CMD_TAI_XIU.ENABLE_BETTING:
				cc.log("TaiXiu ENABLE_BETTING");
				// thiz.hideKq();
				this.removeChildByName("clockS");
				this.userTai.setString("0");
				this.userXiu.setString("0");
				this.quyTai.setString("0");
				this.quyXiu.setString("0");

				this.runClockB(this.timeForBetting);
				this.setSession( data[1].sid );
				this.cuaDat = 0;

				this.resetBetting();
				this.enableBetting();
				// thiz.elementWrap.find('.winner-effect, .hoantra').remove();
				break;
			case CMD_TAI_XIU.UPDATE_BETTING:
				this.setTotal( data[1] );
				break;
			case CMD_TAI_XIU.GET_INFO_PHIEN:
				this.showPhienInfo(data[1]);
				break;
			case CMD_OBSERVER.OBSERVER_TAI_XIU:
				this.removeChildByName("clockS", "wrapKq");

				this.setTotal( data[1] );
				this.runClockB( data[1].rmT );

				if( data[1].tFB ){
					this.timeForBetting = data[1].tFB;
				}

				if( data[1].tFP ){
					this.timeForPayout = data[1].tFP;
				}

				if( this.sessionId != data[1].sid ){
					this.resetBetting();
					this.setSession(data[1].sid);
				}

				if( data[1].sid ) this.setSession( data[1].sid );

				if( data[1].htr.length ){
					this.history = data[1].htr;
					this.drawHistory();
					// this.buildSoiCau();
				}

				if( data[1].gS == 2 ){
					this.enableBetting();
				}else if( data[1].gS == 3 ){
					this.disableBetting();
				}

				// old chat
				// cc.log("old chat", data[1].cH);
				// {tst: 1586770786383, mgs: "111", fu: "test11"}
				// if( data[1].cH ){
				// 	var _oldChat = '';
				// 	for( var i=0; i< data[1].cH.length; i++ ){
				// 		_oldChat += '<p><span class="u-name">'+ data[1].cH[i].fu +':</span> '+ $('<div/>').text(data[1].cH[i].mgs).html() +'</p>';
				// 	}
				// 	thiz.elementWrap.find('.chat-wrap .chat-inner').html( _oldChat );
				// }
				break;
			case CMD_TAI_XIU.BETTING_DONE:
				if( data[1].b ){
					this.notify('Đặt cược thành công');
					this.showCuoc(false);

					this.setCuoc(MH.numToText(data[1].tB), data[1].eid);
					this.inputTai.setString("Đặt");
					this.inputXiu.setString("Đặt");

					if( data[1].eid == 1 ){
						this.setCuoc(0, this.eid.X);
					}else if( data[1].eid == 2 ){
						this.setCuoc(0, this.eid.T);
					}

					this.cuaDat = data[1].eid;
				}
				break;
			case 1:
				if( data[1].mgs ) this.notify(data[1].mgs, 2);
				break;
			case CMD_TAI_XIU.GET_HISTORY_BET:
				this.showHistory( data[1] );
				break;
			default:
				break;
		}
	},
	_onChatResponse: function(cmd, data){
		cc.log( cmd, data );
	},
	onEnter: function(){
		this._super();
		
		MiniGameClient.getInstance().addListener(CMD_OBSERVER.OBSERVER_TAI_XIU.toString(), this._onupdateGame, this);
		MiniGameClient.getInstance().addListener(CMD_TAI_XIU.GET_INFO_PHIEN.toString(), this._onupdateGame, this);
		MiniGameClient.getInstance().addListener(CMD_TAI_XIU.GET_HISTORY_BET.toString(), this._onupdateGame, this);
		MiniGameClient.getInstance().addListener(CMD_TAI_XIU.BETTING_DONE.toString(), this._onupdateGame, this);
		MiniGameClient.getInstance().addListener(CMD_TAI_XIU.ENABLE_BETTING.toString(), this._onupdateGame, this);
		MiniGameClient.getInstance().addListener(CMD_TAI_XIU.CHARGE_MONEY.toString(), this._onupdateGame, this);
		MiniGameClient.getInstance().addListener(CMD_TAI_XIU.UPDATE_BETTING.toString(), this._onupdateGame, this);
		MiniGameClient.getInstance().addListener(CMD_TAI_XIU.CHAT.toString(), this._onChatResponse, this);
		MiniGameClient.getInstance().addListener('1', this._onupdateGame, this);

		MinigamePlugin.getInstance().loginTaiXiu();
	},
	onExit: function(){
		this._super();
		cc.eventManager.removeListener(this);
		MiniGameClient.getInstance().removeListener(this);
	}
});