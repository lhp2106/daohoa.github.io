var CMD_TLMN = CMD_TLMN || {};
CMD_TLMN.CHIABAI = 250;
CMD_TLMN.CHANGE_TURN = 251;
CMD_TLMN.TOI_TRANG =252;
CMD_TLMN.CHOSE_CAI = 5001;
var ERROR_CMD_TLMN = {
    8000:{msg:'không có trong danh sách ù'},
    8001:{msg:'có người đang đợi ù'},
    8002:{msg:'Ăn bài ko hợp lệ'},
    8003:{msg:'Có người đang chíu'}
};


var GameTLMN = GameScene.extend({
	ctor: function(dataGame){
		this._super(dataGame);

		// cc.log("dataGame",dataGame);

		this.setPosition(0, 0);

		this.registerQuit = false;
	    this.totalPlayerPlaying = 0;
	    this.rejectTurnTotal = 0;
	    this.arrEarnCard = [];//all earncard of all player in 1 game
	    this.data = dataGame;
	    this.type = "GameTLMN";
	    //cc.log("data "+ JSON.stringify(data));

	    this.initGame();
	},
	initGame: function(){
		var data = this.data;
	    this.timeTurn = 20000;//data.tft;
	    this.tfeg = data.tfeg/1000;//time4endgame
	    var gameState = data.gS;//GAME_STATE.WAIT_PLAYER;
	    this.gameState = gameState;
	    this.aid = data.aid;
	    var remainTime = data.tRMT/1000;//time danh bai cua player co turn hien tai
	    this.tFDC = data.tFDC;//Thời gian chia bài (bằng thời gian trộn bài + thời gian bốc nọc),
	    var timeBocNoc = data.tPC;
	    this.timeBocNoc = timeBocNoc;
	    this.timeXuong = data.tSLC/1000;
	    this.nocSize = data.nSz;//so bai cua noc
	    this.timeReadyBeforeKick = data.tFR;


	    this.timeChonCai = timeBocNoc;
	    this.timeReady =  data.timeReady ? data.timeReady : 0;
	    this.timeChiaBai = this.tFDC - timeBocNoc;

	    this.initButton();

	    this.initPlayer();
	    this.initCardContainer();
	    this.showReadyIfCan();
	    this.updateGame(data);

	    this.scheduleOnce(function(){
	    	return;
	    	this.onUserInOut([5,{"p":{"uid":"6e787f55-a3ff-468c-896a-119f1e7a26b4","a":"https://acs.p0w7m9d10d668i92wjs.com/images/avatar/avatar_15.png","r":false,"As":{"gold":17690420,"winTime":0,"chip":0,"looseTime":0,"vip":4,"exp":0},"C":false,"g":0,"dn":"pro234","pid":4,"id":0,"m":17690420,"sit":1},"t":1,"cmd":200}]);

	    	this.scheduleOnce(function(){
	    		this.onReadyResponse([5,{"uid":"6e787f55-a3ff-468c-896a-119f1e7a26b4","dn":"pro234","cmd":5}]);

	    		this.scheduleOnce(function(){
	    			this.chiabai([5,{"cs":[9,10,11,13,20,40,42,46,47,49,50,4,7],"ps":[{"uid":"5f5f2528-44e9-4a36-a754-0373842a5a5c","m":6127200},{"uid":"6e787f55-a3ff-468c-896a-119f1e7a26b4","m":17680352}],"lpi":["5f5f2528-44e9-4a36-a754-0373842a5a5c","6e787f55-a3ff-468c-896a-119f1e7a26b4"],"cmd":250,"tP":{"uid":"5f5f2528-44e9-4a36-a754-0373842a5a5c","dn":"mhtest123"},"m":6127200}]);

	    			this.scheduleOnce(function(){
	    				this.onChangeTurn([5,{"fP":{"uid":"5f5f2528-44e9-4a36-a754-0373842a5a5c","pS":1,"dCs":[9,10,11],"dn":"mhtest123"},"cmd":251,"tP":{"uid":"6e787f55-a3ff-468c-896a-119f1e7a26b4","dn":"pro234"}}]);
	    			}.bind(this), 2);

	    			// this.scheduleOnce(function(){
	    			// 	this.onChangeTurn([5,{"fP":{"uid":"6e787f55-a3ff-468c-896a-119f1e7a26b4","pS":2,"dn":"pro234"},"cmd":251,"tP":{"uid":"5f5f2528-44e9-4a36-a754-0373842a5a5c","dn":"mhtest123"}}]);
	    			// }.bind(this), 4);

	    			// this.scheduleOnce(function(){
	    			// 	this.onChangeTurn([5,{"fP":{"uid":"5f5f2528-44e9-4a36-a754-0373842a5a5c","pS":1,"dCs":[13],"dn":"mhtest123"},"cmd":251,"tP":{"uid":"6e787f55-a3ff-468c-896a-119f1e7a26b4","dn":"pro234"}}]);
	    			// }.bind(this), 6);

	    		}.bind(this), 1);
	    	}.bind(this), 1);
	    }.bind(this), 1);
	},
	updateGame: function(data){
	    var gameState = data.gS;
	    var  players =this.data.ps;
	    var remainTime = data.rmT;///1000;//time danh bai cua player co turn hien tai
	    this.lastArrCardDeal = data.ldc;

	    if(gameState == GAME_STATE.PLAYING){
	    	if(!data.re){
	    		this.setStatePlayer(PlayerMe.uid, state_player.DANG_XEM);
	            for(var i = 0 ; i < players.length; i++){
	                var p = players[i];
	                if(p.pi) this.totalPlayerPlaying++;
	            }
	            this.isViewing = true;
	            MessageNode.getInstance().show("Bàn đang chơi. Vui lòng chờ",2);

	            cc.each(this.allSlot, function(slot, index){
	            	if( slot != null && !slot.isMe ){
	                    for(var i= 0 ; i < players.length; i++){
	                        var p = players[i];
	                        var playerState = p.pS;

	                        if( slot.uid == p.uid){
	                            if(p.pi){
	                                // slot.readyPlayer(false);//viewer xem thi hide ready chb o cac playing player
	                                var card = Utils.getCardFromServer(0);
	                                var remainingCard = p.rmC;
	                                //slot.addBackCard(card, index, remainingCard);
	                                this.backCardList[slot.sitId].dealBackCards([card], false);

	                                if(playerState == Constant.PLAYER_STATE.DANG_CO_LUOT){
	                                    //slot.activeTurnDuration(true, remainTime);
	                                    this.onUpdateTurn(slot.uid, remainTime,true);
	                                }
	                                this.backCardList[slot.sitId].showRemainCard(true, remainingCard);

	                            }else{
	                                //another viewer
	                                this.setStatePlayer(slot.uid, state_player.DANG_XEM);
	                                //slot.showViewerText(true);
	                            }

	                        }
	                    }

	                }
	            }.bind(this));
	    	}
	    }

	    cc.each(players, function(value, index){
	    	if(value.C ==true){
	            this.idRoomMaster = index;
	        }
	    }.bind(this))

	    //{"b":100,"re":false,"ps":[{"cs":[],"uid":"d7cac132-296d-4103-a94a-996e2e81142f","r":false,"pS":0,
	    //"C":true,"pi":false,"rmC":0,"dn":"gts001","pid":4,"m":400000,"sit":0}],"Mu":4,"rmT":0,"cmd":202,"gS":1,"aid":2}
	    //CASE rEconnect
	    //{"b":100,"re":true,"ps":[{"uid":"d7cac132-296d-4103-a94a-996e2e81142f",
	    // "r":false,"pS":3,"C":true,"pi":true,"rmC":9,"dn":"gts001","pid":4,"m":254160,"sit":0},
	    // {"cs":[15,19,23,28,29,31,32,40,41,45,3,6,7],"uid":"6659b1dc-fa6e-48e3-88da-48076ef94a89","r":true,"pS":2,"C":false,"pi":true,"rmC":13,"dn":"gts002","pid":4,"m":96800,"sit":1}],
	    // "Mu":4,"rmT":5572,"ldc":[12,17,21,27],"cmd":202,"gS":4,"aid":1}

	    if(data.re){
	        this.isPlaying = true;
	        this.onReconnect(data);
	    }else{
	        //
	        if(players[this.idRoomMaster].uid !== PlayerMe.uid){
	            //ko la room master thi send auto ready
	            if(cc.Global.GetSetting(GameSetting.autoReady)){
	                //true la enable auto ready
	                this.sendStartRequest();
	            }

	        }
	    }
	},
	onReconnect: function(data){
		var thiz =  this;
	    this.totalPlayerPlaying =0;
	    this.rejectTurnTotal =0;
	    var listPlayer = data.ps;
	    var gameState = data.gS;
	    this.gameState = data.gS;
	    var remainTime = data.rmT;///1000;//time danh bai cua player co turn hien tai => CONVERT SANG seconds
	    this.lastArrCardDeal = data.ldc;
	    var myPlayState =0;
	    for(var i= 0 ; i < listPlayer.length; i++){
	        var p = listPlayer[i];
	        var playerState = p.pS;//NONE: 0,DANH_BAI: 1,BO_LUOT: 2,DANG_CO_LUOT : 3,
	        if(p.pi){
	            this.totalPlayerPlaying++;
	            if(playerState === Constant.PLAYER_STATE.BO_LUOT) this.rejectTurnTotal++;
	            if(p.uid === PlayerMe.uid){
	                this.playerView[0].x=(cc.Global.GameView.width / 2 -this.playerView[0].widthBG/2 -GameTLMN.X_CHIA_BAI);
	                myPlayState = playerState;
	            }
	        }
	    }

	    if(this.lastArrCardDeal && this.lastArrCardDeal.length){
	        var cards = [];
	        for (var i = 0; i < this.lastArrCardDeal.length; i++) {
	            cards.push(Utils.getCardFromServer(this.lastArrCardDeal[i]));
	        }
	        this.cardOnTable.addNewCardList(cards);
	        //thiz.animCardToCentre(null, thiz.lastArrCardDeal, false);
	    }
	    var mySlot =null;
	    cc.each(this.allSlot, function(slot, index){
	        if(slot){
	            //slot.onShowBtnWhenPlaying(false);//hide ready chb, kick icon
	            for(var i= 0 ; i < listPlayer.length; i++){
	                var p = listPlayer[i];
	                //cc.log('uid reconnect '+ slot.uid);
	                if(slot.uid == p.uid){
	                    var cardArray = p.cs;
	                    var isRoomMaster = p.C;
	                    var playerState = p.pS;//NONE: 0,DANH_BAI: 1,BO_LUOT: 2,DANG_CO_LUOT : 3,
	                    var pi = p.pi;//dang choi hay ngoi xem
	                    var remainingCard = p.rmC;
	                    if(pi){
	                        if(p.uid === PlayerMe.uid){
	                            //MY PLAYER
	                            //thiz.animChiaBaiToPlayer(cardArray, slot,  thiz.playerAnchors[0]);
	                            var cards = [];
	                            for (var num = 0; num < cardArray.length; num++) {
	                                cards.push(Utils.getCardFromServer(cardArray[num]));
	                            }
	                            this.cardList.dealCards(cards, false);
	                            //slot.showReadyChbox(false);
	                            if(playerState == Constant.PLAYER_STATE.DANG_CO_LUOT){
	                                mySlot = slot;
	                                this.onUpdateTurn(slot.uid, remainTime);
	                                //cc.log(` onRecconect active turn player  ${p.dn} =>time ${remainTime}");
	                                //show button danh bai, bo luot
	                                this.showAllBtnPlay();

	                                //neu turn dau tien luk sau khi chia bai
	                                //phai danh' bai, ko dc bo luot (reconnect thi lam sao biet ???)
	                                //  GameTLMN.instance.panelButton.activeRejectTurnButton(false); 
	                            }else if(playerState == Constant.PLAYER_STATE.BO_LUOT){
	                                this.setStatePlayer(slot.uid, state_player.BO_LUOT);
	                                //slot.onRejectTurn(true);

	                            }
	                        }else{
	                            //oponent => add backcard remainingCard
	                            var card = Utils.getCardFromServer(0);
	                            this.backCardList[slot.sitId].dealBackCards([card], false);

	                            if(playerState == Constant.PLAYER_STATE.DANG_CO_LUOT){
	                                this.onUpdateTurn(slot.uid, remainTime);
	                                //slot.activeTurnDuration(true, remainTime);
	                                //cc.log(`active turn player ${p.dn} =>time ${remainTime}`);
	                            }

	                        }
	                    }else{
	                        //viewer
	                        this.setStatePlayer(slot.uid, state_player.DANG_XEM);
	                        //slot.showViewerText(true);

	                    }


	                    break;
	                }

	            }

	        }

	    }.bind(this));


	    if(this.rejectTurnTotal === (this.totalPlayerPlaying-1)) {
	        //vong` moi. up bai` cu~ va hide nut bo luot , lan dau tien cua vong moi danh gi cung duoc nen ko bo luot dc
	        this.rejectTurnTotal =0;
	        this.suggestCard([]);//luot moi thi ko tinh suggest card vong truoc
	        // if(tP.uid == PlayerMe.uid){
	        //      //hide text bo luot
	        //      GameTLMN.instance.panelButton.activeRejectTurnButton(false);
	        // }
	    }else{
	        if(this.lastArrCardDeal && this.lastArrCardDeal.length){
	            var isBlurCardIfNeed = myPlayState == 3 ? true : false;
	            //dang co luot thi enable blurcard
	            this.suggestCard(this.lastArrCardDeal, isBlurCardIfNeed);
	        }
	    }
	},
	initCardContainer: function(){
		var zOrder = 2;
	    var left = 170;
	    var cardList = new CardList(cc.size(cc.Global.GameView.width - 20 -left, 150));
	    //cardList.setAnchorPoint(cc.p(0, 0.0));
	    cardList.setPosition(left, -cc.Global.GameView.height + 70.0);//70
	    window.cardList = cardList;
	    // cardList.displayGroup = MyPixi.gameContainerLayer;
	    MyPixi.gameContainer.addChild(cardList);
	    cardList.setDeckPoint(cc.p(cc.Global.GameView.width/2, cc.Global.GameView.height/2));
	    this.cardList = cardList;
	    //this.cardList.showBlurBg(true);
	    SuggestCardMng.getInstance().initCardList(cardList);

        var dx = 160;
        var dy = 100;

        var cardList0 = new CardList(cc.size(60, 75) ,GameTLMN.cardOriginScaleBackCard);
        cardList0.canTouch = false;
        //cardList0.anchor.set(.5, 0.5);
        cardList0.setPosition(cc.Global.GameView.width/2 +dx ,  -dy + this.playerView[0].y);//cc.Global.GameView.width / 2
        MyPixi.gameContainer.addChild(cardList0);

        var cardList1 = new CardList(cc.size(60, 75),GameTLMN.cardOriginScaleBackCard);
        cardList1.canTouch = false;
        //cardList1.anchor.set(.5, 0.5);
        cardList1.setPosition(this.playerView[1].x +this.playerView[1].widthBG -dx - 70,  -dy +this.playerView[1].y);//cc.Global.GameView.width / 2
        MyPixi.gameContainer.addChild(cardList1);

        var cardList2 = new CardList(cc.size(60, 75),GameTLMN.cardOriginScaleBackCard);
        cardList2.canTouch = false;
        //cardList2.anchor.set(0.5, 0.5);
        cardList2.setPosition(this.playerView[2].x +dx,  -dy +this.playerView[2].y);//cc.Global.GameView.width / 2
        MyPixi.gameContainer.addChild(cardList2);

        var cardList3 = new CardList(cc.size(60, 75),GameTLMN.cardOriginScaleBackCard);
        cardList3.canTouch = false;
        //cardList3.anchor.set(.5, 0.5);
        cardList3.setPosition(this.playerView[3].x +dx ,  -dy +this.playerView[3].y);//cc.Global.GameView.width / 2
        MyPixi.gameContainer.addChild(cardList3);

        this.backCardList = [cardList0, cardList1, cardList2, cardList3];
        for(var i = 0 ; i < this.backCardList.length;i++){
            this.backCardList[i].setDeckPoint(cc.p(cc.Global.GameView.width/2, cc.Global.GameView.height/2));
        }

	    var cardOnTable = new CardOnTable();
	    //cardOnTable.position.set(cc.p(0, 0));
	    cardOnTable.setContentSize(cc.size(500,300))
	    MyPixi.gameContainer.addChild(cardOnTable);
	    //cardOnTable.displayGroup = MyPixi.gameContainerLayer;
	    //cardOnTable.showBlurBg(true);
	     cardOnTable.setDeckPoint(cc.p(cc.winSize.width/2, cc.winSize.height/2));
	    this.cardOnTable = cardOnTable;

	    if(TEST_MODE){
	        var cardListDeal = new CardList(cc.size(cc.Global.GameView.width, 150),GameTLMN.cardOriginScaleBackCard);
	        //cardListDeal.setAnchorPoint(cc.p(0, 1));
	        cardListDeal.setPosition(200, cc.Global.GameView.height/2);//cc.Global.GameView.width / 2
	        MyPixi.gameContainer.addChild(cardListDeal);
	        this.cardListDeal = cardListDeal;
	    }
	},
	handlePendingBack: function(){
		this.isPlaying =false;
	    if(this.isRegisterQuit){
	        this.quitRoom();
	        return;
	    }
	    if(!this.isPlaying){
	        this.gameState=0;
	    }
	    if(this.ideGameNumber >= IDE_GAME_KICK && !this.isViewing){
	        this.ideGameNumber++ ;
	        this.quitRoom(true);

	    }
	},
	resetNewGame: function(ignoreCheckReady){
		SuggestCardMng.getInstance().reset();
	    this.playerView[0].x=(cc.Global.GameView.width / 2 -this.playerView[0].widthBG/2);
	    if(this.lastArrCardDeal && this.lastArrCardDeal.length) this.lastArrCardDeal.length =0;
	    this.currentTurn = -1;
	    this.rejectTurnTotal =0;
	    this.gameState = GAME_STATE.WAIT_PLAYER;
	    this.data.gS = this.gameState;
	    this.cardList.removeAll();
	    this.cardOnTable.removeAll();

	    for(var i = 0 ; i< this.backCardList.length; i++){
	        this.backCardList[i].removeAll();
	        //this.cardListEndGame[i].removeAll();
	    }

	    for(var i=0;i<this.allSlot.length;i++){
	        this.allSlot[i].stopTimeRemain(false);
	        this.allSlot[i].setState(state_player.NOTHING);
	        this.allSlot[i].clearAnimMoney();

	    }

	    if(!ignoreCheckReady){
	        var idMaster = this.getIdRoomMaster();
	        if(this.data.ps[idMaster].uid == PlayerMe.uid){
	            this.showReady(false);
	            this.showStartIfCan();
	        }else{
	            this.showReadyIfCan();
	        }
	    }
	},
	_onRoomPluginMsg: function(command, dataObj){
		cc.log("_onRoomPluginMsg", dataObj);
		cc.log(JSON.stringify(dataObj));
		var cmd = dataObj[1][Constant.CONSTANT.CMD];
	    if(cmd == Constant.CMD_RESULT.ERROR){
	    	cc.log("Constant.CMD_RESULT.ERROR");
	        this.onErrorResponse(dataObj);
	    }else if(cmd== 7){
	        this.onServerNotifyResponse(dataObj);
	        cc.log("7");
	    }else if(cmd == Constant.CMD_RESULT.USER_JOIN_OUT){
	    	cc.log("Constant.CMD_RESULT.USER_JOIN_OUT");
	        this.onUserInOut(dataObj);
	    }else if(cmd == Constant.CMD_RESULT.ROOM_MASTER_CHANGE){
	    	cc.log("Constant.CMD_RESULT.ROOM_MASTER_CHANGE");
	        this.onRoomMasterResponse(dataObj);
	    }else if(cmd ==  Constant.CMD_RESULT.PLAYER_READY){
	    	cc.log("Constant.CMD_RESULT.PLAYER_READY");
	        this.onReadyResponse(dataObj);
	    }else if(cmd ==  Constant.CMD_RESULT.LIST_INVITE){
	    	cc.log("Constant.CMD_RESULT.LIST_INVITE");
	        this.onInviteResponse(dataObj);
	    }else if(cmd === 205){
	    	cc.log("205");
	        this.updateGoldAllPlayerFromServer(dataObj);
	    }else if(cmd === CMD_TLMN.CHIABAI){
	        //console.log('CMD_TLMN.CHIABAI');
	        //console.log(dataObj);
	        cc.log("CMD_TLMN.CHIABAI");
	        this.chiabai(dataObj);
	    }else if(cmd === CMD_TLMN.DANH){
	        //this.onDanhBaiResponse(dataObj);
	        cc.log("CMD_TLMN.DANH");
	    }else if(cmd === CMD_TLMN.CHANGE_TURN){
	    	cc.log("CMD_TLMN.CHANGE_TURN");
	        this.onChangeTurn(dataObj);
	    }else if(cmd === CMD_TLMN.TOI_TRANG){
	    	cc.log("CMD_TLMN.TOI_TRANG");
	        LobbyClient.getInstance().setGameState(GAME_STATE.SHOW_KQ);
	        this.onEndGameResponse(dataObj);
	    }
	},
	onErrorResponse: function(dataObj){
		//{"c":101,"mgs":"","cmd":1}]
	    var errorCode = dataObj[1].c;
	    cc.log('cmd 1 error show showDialogNotice '+errorCode);
	    var errorStr =ERROR_CMD_TLMN[errorCode];//.msg;//= Constant.ERROR_STR[errorCode].msg;
	    /* if(errorStr === undefined) errorStr = "Hành động không hợp lệ (mã lỗi = "+errorCode +")";
	     else errorStr = errorStr.msg;
	     if(errorCode != 210) // 210 la loi send ready khi ban dang choi (auto ready roi vao xem game => ignore)
	     {
	     var msg = errorStr;
	     var dialog = new MessageOkDialog();
	     dialog.setMessage(msg);
	     dialog.showWithAnimationScale();
	     }*/
	    if(errorStr === undefined) return;
	    errorStr = errorStr.msg;
	    if(errorCode != 210) // 210 la loi send ready khi ban dang choi (auto ready roi vao xem game => ignore)
	    {
	        var msg = errorStr;
	        var dialog = new MessageOkDialog();
	        dialog.setMessage(msg);
	        dialog.showWithAnimationScale();
	    }
	},
	onServerNotifyResponse: function(dataObj){
		//catch trong LobbyClient roi - o day chi la regist quit no nua thoi
	    // nen ko can show dialog
	    //pop up show error/ thong bao / bao tri
	    var type = dataObj[1].t;
	    if(type ===3) this.isRegisterQuit = true; // bao tri
	    //pop up show error/ thong bao / bao tri
	    //var dialog = new MessageOkDialog();
	    //dialog.setMessage(dataObj[1].message);
	    //dialog.showWithAnimationScale();
	},
	onRoomMasterResponse: function(dataObj){
		var newMasterUid = dataObj[1].uid;
	    cc.log("chu phong moi la " +dataObj[1].dn + " "+ dataObj[1].uid);
	    cc.each(this.data.ps, function(value, index){
	        if(value.uid == newMasterUid){
	            value.C = true;
	            value.r = false;
	        }else{
	            value.C = false;
	        }
	    });


	    if(this.gameState ===4 || this.gameState ===5){
	        //chu phong quit khi so ket qua thi ko lam gi
	        //doi so ket qua xong se co event arrangePlayerInGame
	    }else{
	        this.arrangePlayerInGame();
	    }
	    this.showStartIfCan();
	},
	onReadyResponse: function(dataObj){
		var uid = dataObj[1].uid;
	    var displayName = dataObj[1].dn;//
	    var isReady = true;
	    cc.log("PLAYER_READY "+ uid + " => "  +displayName);

	    cc.each(this.data.ps, function(value, index){
	    	if(value.uid == uid){
	            value.r = isReady;
	        }
	    });

	    //var dataplayer = this.getDataPlayerByUid();
	    if(uid == PlayerMe.uid) {
	        //me ready
	        this.showReady(false);

	    }

	    if(isReady )this.setStatePlayer(uid, state_player.READY);
	    else this.setStatePlayer(uid, state_player.NOTHING);

	    var idMaster = this.getIdRoomMaster();
	    if(this.data.ps[idMaster].uid == PlayerMe.uid){
	        this.showReady(false);
	        this.showStartIfCan();
	        cc.log("me showStartIfCan");
	    }else{
	        this.showReadyIfCan();
	        cc.log("notme showStartIfCan");
	    }
	},
	onInviteResponse: function(dataObj){
		var listUser  = dataObj[1].us;
	    cc.log("LIST_INVITE "+ JSON.stringify(listUser));
	    LoadingDialog.getInstance().hide();
	    if(!listUser || !listUser.length){
	        var  message = 'Không có người chơi để mời';
	        MessageNode.getInstance().show(message, 1);
	    }
	    else{
	        /*var dialog = new InviteDialog();
	        dialog.initData(listUser);
	        dialog.show();*/

	        this.showInviteDialog(listUser);
	    }
	},
	updateGoldAllPlayerFromServer: function(dataObj){
		var playerArr = dataObj[1].ps;
	    /*ps:Array = [
	     {
	     uid:String = USER_ID,
	     m:MOney= MONEYCAI
	     }
	     ]*/

	    if(playerArr){
	        for(var idx in this.allSlot){
	            var slot = this.allSlot[idx];
	            if(!slot) continue;
	            for(var i =0; i < playerArr.length; i++){
	                if(playerArr[i].uid === slot.uid ){
	                    this.updateMoneyPlayer(playerArr[i]);
	                    slot.setTotalGoldWithEffect(playerArr[i].m);
	                    //cc.log(playerArr[i].uid + 'update money ' + playerArr[i].m);
	                    break;
	                }
	            }
	        }
	    }
	},
	chiabai: function(dataObj){
		this.stopAllActions();//prevent animation endgame chua ket thuc
	    this.resetNewGame(true);
	    if(TEST_MODE){
	        var uid = this.allSlot[0].uid;
	        dataObj = [5,{"cs":[10,11,19,20,26,27,32,35,41,42,44,50,1],
	            "ps":[{"uid":"uid1","m":1111},
	                {"uid":uid,"m":100050000}],
	            "lpi":["uid1","uid2","uid3",uid],"cmd":250,
	            "tP":{"uid":uid,"dn":"005gts"},"m":100050000}];
	    }
	    //[5,{"cs":[10,11,19,20,26,27,32,35,41,42,44,50,1],
	    // "ps":[{"uid":"aa2df8ef-8eb7-4c09-ac63-b2046b90b9a9","m":100050000},
	    // {"uid":"de05eb1e-7cc4-4923-b8f8-b606e1a8fa88","m":100050000}],
	    // "lpi":["aa2df8ef-8eb7-4c09-ac63-b2046b90b9a9","de05eb1e-7cc4-4923-b8f8-b606e1a8fa88"],"cmd":250,
	    // "tP":{"uid":"de05eb1e-7cc4-4923-b8f8-b606e1a8fa88","dn":"005gts"},"m":100050000}]
	    this.showReady(false);
	    this.ideGameNumber++;
	    this.isPlaying = true;
	    /*this.countDownReady.stopAllActions();
	     this.countDownReady.setString("");*/
	    this.cardList.removeAll();
	    this.cardOnTable.removeAll();
	    this.playSoundAction("chiabai");
	    this.updateGoldAllPlayerFromServer(dataObj);
	    //hide all ready btn
	    this.startGame();
	    var data= dataObj[1];
	    cc.log("chiabai gamestate "+data.gS);
	    this.gameState = GAME_STATE.PLAYING;
	    this.data.gS = GAME_STATE.PLAYING;//update
	    var cardArray = data.cs;

	    var tP = data.tP;
	    var listPlayer = data.lpi;//ds nguoi` choi (ko co dang xem)
	    this.totalPlayerPlaying = listPlayer.length;

	    cc.each(this.data.ps, function(player, index){
	        if(listPlayer.indexOf(player.uid) !== -1 ) {
	            player.pi = true;//update to dang choi
	        }
	    });

	    this.onUpdateTurn(tP.uid, this.timeTurn,true);
	    //MAX_CARD_PLAYER
	    if(listPlayer.indexOf(PlayerMe.uid) > -1){
	        //choi chu ko phai viewer
	        // thiz.animChiaBaiToPlayer(cardArray, thiz.allSlot[0],  thiz.playerAnchors[0]);
	        var cards = [];

	        for (var i = 0; i < cardArray.length; i++) {
	            cards.push(Utils.getCardFromServer(cardArray[i]));
	        }
	        this.cardList.dealCards(cards, true);
	        this.playerView[0].x = (cc.Global.GameView.width / 2 -this.playerView[0].widthBG/2 -GameTLMN.X_CHIA_BAI);
	    }else{
	        //show viewer
	        this.setStatePlayer(PlayerMe.uid, state_player.DANG_XEM);
	        this.isPlaying = false;
	    }
	    //cc.log(" backCardList begen");
	    for(var i  = 0 ; i < this.allSlot.length; i++){
	        var slot = this.allSlot[i];
	        if(!slot.isMe){
	            if(listPlayer.indexOf(slot.uid) > -1)
	            {
	                //!= ME VA dang choi => show back card with remain
	                //var card = Utils.getCardFromServer(0);
	                //cc.log(`chiabai--- ${index}  thiz.maxCardPerPlayer ${thiz.maxCardPerPlayer}`);
	                //slot.addBackCard(card, index, thiz.maxCardPerPlayer, true);

	                var cards = [Utils.getCardFromServer(0)];
	                this.backCardList[slot.sitId].dealBackCards(cards, true);
	            }else{
	                this.setStatePlayer(slot.uid, state_player.DANG_XEM);
	            }
	        }
	    }
	},
	showReady: function(visible){
		this.readyBt.setVisible(visible);
	    var idMaster = this.getIdRoomMaster();
	    if(idMaster >=0 && this.data.ps[idMaster].uid == PlayerMe.uid){
	        MyHelper.addLblButton(this.readyBt, "Chia bài", 16);
	    }else{
	        MyHelper.addLblButton(this.readyBt, "Sẵn sàng", 16);
	    }

	    cc.log("GameTLMN showReady", this.readyBt);
	},
	hideStartAndReady: function(hide){
		this.readyBt.visible = hide;
	},
	initButton: function(){
		var thiz = this;
	    var readyBt = new newui.Button("#button/btn_button2.png", function () {
	        var idMaster = thiz.getIdRoomMaster();
	        cc.log("idMaster  = "+idMaster);
	        cc.log("PlayerMe  = "+PlayerMe.uid);
	        if(thiz.data.ps[idMaster].uid  === PlayerMe.uid){
	            var notReady = thiz.getNumberPlayerNotReadyIgnoreMaster();
	            if(notReady > 0){
	                var dialog = new MessageConfirmDialog();
	                dialog.setMessage("Vẫn còn người chơi chưa sẵn sàng.\n Bạn có chắc muốn bắt đầu không?");
	                dialog.okButtonHandler = function () {
	                    thiz.sendStartRequest();
	                    dialog.hide();
	                };
	                dialog.cancelButtonHandler = function () {
	                    dialog.hide();
	                };
	                dialog.show();
	            }else{
	                thiz.sendStartRequest();
	            }
	        }else{
	            thiz.sendStartRequest();
	        }
	    });
	    readyBt.setPosition(cc.Global.GameView.width/2, -350 );
	    MyPixi.gameContainer.addChild(readyBt);
	    MyHelper.addLblButton(readyBt, "Sẵn sàng", 16);

	    var startBt = MyHelper.createButton("button/btn_button2.png", true,function () {
	        var idMaster = thiz.getIdRoomMaster();
	        cc.log("idMaster  = "+idMaster);
	        cc.log("PlayerMe  = "+PlayerMe.uid);
	        if(thiz.data.ps[idMaster].uid  === PlayerMe.uid){
	            var notReady = thiz.getNumberPlayerNotReadyIgnoreMaster();
	            if(notReady > 0){
	                var dialog = new MessageConfirmDialog();
	                dialog.setMessage("Vẫn còn người chơi chưa sẵn sàng.\n Bạn có chắc muốn bắt đầu không?");
	                dialog.okButtonHandler = function () {
	                    thiz.sendStartRequest();
	                    dialog.hide();
	                };
	                dialog.cancelButtonHandler = function () {
	                    dialog.hide();
	                };
	                dialog.show();
	            }else{
	                thiz.sendStartRequest();
	            }
	        }else{
	            thiz.sendStartRequest();
	        }
	    });
	    startBt.setPosition(cc.Global.GameView.width/2, -350 );
	    MyPixi.gameContainer.addChild(startBt);
	    MyHelper.addLblButton(startBt, "Bắt đầu", 16);

	    var boLuotBt = MyHelper.createButton("button/btn_button2.png", true,function () {
	        thiz.sendBoLuot();
	    });
	    boLuotBt.setPosition(cc.Global.GameView.width/2 -100 , -cc.Global.GameView.height/2 - 320 );
	    MyPixi.gameContainer.addChild(boLuotBt);
	    MyHelper.addLblButton(boLuotBt, "Bỏ lượt", 16);

	    var danhbaiBt = MyHelper.createButton("button/bg_napthe.png", true,function () {
	        thiz.sendDanhBai();
	    });
	    danhbaiBt.setPosition(cc.Global.GameView.width/2 +100 , -cc.Global.GameView.height/2 - 320 );
	    MyPixi.gameContainer.addChild(danhbaiBt);
	    MyHelper.addLblButton(danhbaiBt, "Đánh bài", 16);

	    readyBt.visible = false;
	    startBt.visible = false;
	    boLuotBt.visible = false;
	    danhbaiBt.visible = false;

	    this.readyBt = readyBt;
	    this.startBt = startBt;
	    this.boLuotBt = boLuotBt;
	    this.danhbaiBt = danhbaiBt;

	    var reccBt = MyHelper.createButton("button/btn_button2.png", true,function () {
	        LobbyClient.getInstance().reConnect();
	        /*var msg = "Tự động kết nối lại sau 5s\n Kết nối ngay?";
	         var dialog = new MessageReconnectDialog(5);
	         dialog.setMessage(msg);
	         dialog.showWithAnimationScale();*/
	    } );
	    reccBt.setPosition(cc.Global.GameView.width/2 -580 - reccBt.width/2, -cc.Global.GameView.height+ 50 );
	    MyPixi.gameContainer.addChild(reccBt);
	    MyHelper.addLblButton(reccBt, "recc", 16);
	    reccBt.visible = false;

	    var suggestBt = MyHelper.createButton("button/btn_button2.png", true,function () {
	        thiz.suggestCard();
	    } );
	    suggestBt.setPosition(cc.Global.GameView.width/2 -580, -cc.Global.GameView.height+ 150 );
	    MyPixi.gameContainer.addChild(suggestBt);
	    MyHelper.addLblButton(suggestBt, "suggest", 16);
	    suggestBt.visible = false;
	},
	initPlayer: function(){
		var zOrder =4;
	    var playerMe = new GamePlayer();
	    playerMe.sitId = 0;
	    playerMe.setPosition(cc.p2(cc.Global.GameView.width / 2 - playerMe.widthBG/2, - playerMe.heightBG/2 + cc.Global.GameView.height - 140.0));

	    window.playerView = playerMe;

	    var player1 = new GamePlayer();
	    player1.sitId = 1;
	    player1.setPosition(cc.p2(cc.Global.GameView.width - 80.0 - player1.widthBG/2, - player1.heightBG/2 + cc.Global.GameView.height/2 - 50));


	    var player2 = new GamePlayer();
	    player2.sitId = 2;
	    player2.setPosition(cc.p2(cc.Global.GameView.width / 2 - player2.widthBG/2, - player2.heightBG/2 + cc.Global.GameView.height -630.0));



	    var player3 = new GamePlayer();
	    player3.sitId = 3;
	    player3.setPosition(cc.p2(80.0 - player3.widthBG/2, - player3.heightBG/2 + 360.0 -50));
	    this.playerView = [playerMe, player1, player2, player3];
	    if(this.data.Mu ==2){
	        this.playerView[1].visible = false;
	        this.playerView[3].visible = false;
	    }

	    for(var i = 0 ; i < this.playerView.length; i++){
	        // this.playerView[i].displayGroup =   MyPixi.gamePlayerLayer;
	        MyPixi.gameContainer.addChild(this.playerView[i]);
	    }
	    this.arrangePlayerInGame();
	},
	arrangePlayerInGame: function(arrangeChauRiaOnly){
		this.processPlayerPosition(this.data.ps, this.data.gS,arrangeChauRiaOnly);
	},
	updateInfoPlayer: function(player ,info, index){
		player.setEnable(true);
	    player.setUsername(info.usViewName);
	    player.setGold(info.money);
	    if(index === 0 )
	    //===0 la roommaster
	        player.setMasterRoom(true);//room master luon la dua dau tien trong arr player
	    else
	        player.setMasterRoom(false);
	},
	isReconnectOrViewer: function(){
		var players =this.data.players;
	    var meInPlayerList = false;
	    for(var i = 0 ; i < players.length; i++){
	        if(players[i].TTID === PlayerMe.uid){
	            meInPlayerList = true;
	        }
	    }
	    if(meInPlayerList && this.gameState ===GAME_STATE.PLAYING) return true;
	    else return false;
	},
	showReadyIfCan: function(){
		var players =this.data.ps;
	    var isPlaying = this.data.gS >=GAME_STATE.PLAYING ? true : false;
	    var meReady = false;
	    var meInPlayerList = false;
	    for(var i = 0 ; i < players.length; i++){
	        if(players[i].uid === PlayerMe.uid){
	            meReady = players[i].r;
	            if(players.sit < 0) meInPlayerList = false;//chau` ria` ma ko co slot ngoi`
	            else meInPlayerList = true;
	        }
	    }
	    if(!meReady && !isPlaying && players.length>=2) {
	        this.readyBt.visible = true;
	        //this.readyBt.loadTextures("btn_ready.png","btn_ready_press.png","" ,ccui.Widget.PLIST_TEXTURE);

	        cc.log("ready vao dayyyyyy");
	    }else if(meReady && !isPlaying && players.length>=2){
	        this.readyBt.visible = false;
	        /*this.readyBt.visible = true;
	         this.readyBt.loadTextures("btn_unready.png","btn_unready_press.png","" ,ccui.Widget.PLIST_TEXTURE);
	         //this.readyBt.setTitleText("Bỏ sẵn sàng");
	         cc.log("ready vao dayyyyyy bo san sang");*/
	    }
	    else
	        this.readyBt.visible = false;

	    if(this.gameState ==GAME_STATE.PLAYING || !meInPlayerList) this.readyBt.visible = false;

	    var autoReady = cc.Global.GetSetting(GameSetting.autoReady, false);
	    if(autoReady && this.gameState !=GAME_STATE.PLAYING && meInPlayerList && !meReady){
	        var idMaster = this.getIdRoomMaster();
	        if(players[idMaster].uid !== PlayerMe.uid){
	            //ko la room master thi send auto ready
	            //true la enable auto ready
	            this.sendStartRequest();
	        }
	    }
	},
	getCardWithId: function(cardId){
		var rankCard = (cardId % 13) + 3;
	    if (rankCard > 13) {
	        rankCard -= 13;
	    }
	    return {
	        rank: rankCard,
	        suit: Math.floor(cardId / 13)
	    };
	},
	getCardIdWithRank: function(rank, suit){
		var rankCard = rank - 3;
	    if (rankCard < 0) {
	        rankCard = 13 + rankCard;
	    }
	    return ((suit * 13) + rankCard);
	},
	activeTurnButton: function(visible){
		this.boLuotBt.visible = visible;
    	this.danhbaiBt.visible = visible;
	},
	hideAllBtnPlay: function(){
		this.boLuotBt.visible = false;
    	this.danhbaiBt.visible = false;
	},
	showAllBtnPlay: function(){
		this.boLuotBt.visible = true;
    	this.danhbaiBt.visible = true;
	},

	/**
	 *
	 * @param uid
	 * @param currentTime
	 * @param newTurn : turn dau tien cua ban choi. nguoi dau tien chi duoc danh
	 */
	onUpdateTurn: function(uid, currentTime, newTurn){
		this.currentTurn = uid;
	    for (var i = 0; i < this.allSlot.length; i++) {
	        if (this.allSlot[i].uid == uid) {
	            this.allSlot[i].showTimeRemain(currentTime, this.timeTurn);
	            if (this.allSlot[i].isMe) {
	                this.hideAllBtnPlay();
	                this.boLuotBt.visible = true;
	                this.danhbaiBt.visible = true;
	                if (newTurn) {
	                    this.boLuotBt.visible = false;
	                }
	            }
	            else {
	                this.boLuotBt.visible = false;
	                this.danhbaiBt.visible = false;
	            }
	        }
	        else {
	            this.allSlot[i].stopTimeRemain();
	        }
	    }
	},
	/**
	 * cardsDeaded : int array của  lượt trước
	 * nếu cardsDeaded là của mình thì dánh con gì cũng duoc. ko cần check
	 * */
	suggestCard: function(cardsDeaded,  isBlurCardIfNeed){
		if(!isBlurCardIfNeed) isBlurCardIfNeed =true;
	    SuggestCardMng.getInstance().suggestCard(this.cardList,cardsDeaded,  isBlurCardIfNeed );
	},
	onChangeTurn: function(dataObj){
		cc.log('onChangeTurn '+ JSON.stringify(dataObj));
	    //[5,{"fP":{"uid":"48f7c55e-1f27-4e37-a4a7-70965006062f","pS":4,"dCS":10},"cmd":5002,"tP":{"uid":"622d664b-3298-412d-bce8-b22a40c30cc9"}}]
	    var data = dataObj[1];
	    var nCmd = dataObj[1].nCmd;
	    var fromPlayer = dataObj[1].fP;
	    var puid = fromPlayer.puid;//exist thi la an chat
	    var  lastArrCardDeal = fromPlayer.dCs;
	    if(fromPlayer.pS == Constant.PLAYER_STATE.DANH_BAI && lastArrCardDeal && lastArrCardDeal.length){
	        this.lastArrCardDeal = lastArrCardDeal ;
	        this.lastUidDealCard = fromPlayer.uid;
	        if(fromPlayer.uid !== PlayerMe.uid){
	            //reduce card remain
	            var totalReduce = lastArrCardDeal.length;
	            var slot = this.getSlotByUid(fromPlayer.uid);
	            this.backCardList[slot.sitId].showRemainCard(true, -totalReduce);
	        }

	    }
	    if(fromPlayer.pS == Constant.PLAYER_STATE.BO_LUOT){
	        this.rejectTurnTotal++;
	        if(fromPlayer.uid == PlayerMe.uid ) this.meRejectTurn = true;
	    }
	    var tP = dataObj[1].tP;//

	    var mySlot =null;
	    this.activeTurnButton(false);
	    this.onUpdateTurn(data.tP.uid, this.timeTurn,false);
	    if(fromPlayer && fromPlayer.pS == Constant.PLAYER_STATE.DANH_BAI && lastArrCardDeal.length){
	    	this.onDanhBaiThanhCong(fromPlayer.uid,lastArrCardDeal);
	    }

	    cc.each(this.allSlot, function(slot, index){
	        if(slot){
	            if(tP.uid === slot.uid && slot.isMe){
	                //show button danh bai, bo luot
	                this.activeTurnButton(true);
	                if(this.rejectTurnTotal === (this.totalPlayerPlaying-1)) {
	                    cc.log("0000suggest "+ lastArrCardDeal);
	                    this.suggestCard();//luot moi' => ko suggest danh bai
	                }else{
	                    if(lastArrCardDeal && lastArrCardDeal.length){
	                        cc.log("----suggest "+ lastArrCardDeal);
	                        this.suggestCard(lastArrCardDeal, true);
	                    }else{
	                        cc.log("--11-suggest"+this.lastArrCardDeal);
	                        this.suggestCard(this.lastArrCardDeal, true);
	                    }
	                }
	                mySlot = slot;
	            }
	            if(fromPlayer.uid === slot.uid){
	                //show text bo luot  0:none1:Đánh bài 2:Bỏ lượt 3:Đang có lượt
	                if(fromPlayer.pS == 2 )  slot.setState(state_player.BO_LUOT);
	                if(fromPlayer.uid === PlayerMe.uid ){
	                    if(fromPlayer.pS === 2 ){
	                        //myplayer bo luot
	                        this.suggestCard([]);
	                    }else{
	                        // ko suggest khi minh` vua danh bai xong
	                        // thiz.suggestCard([]);
	                        //suggest bai nhung ko blur card, ko the ghep thanh chuoi > dealcard
	                        cc.log("333suggest "+ lastArrCardDeal);
	                        this.suggestCard(lastArrCardDeal, false);
	                    }
	                }
	            }
	            if(tP.uid != slot.uid && fromPlayer.uid != slot.uid && slot.isMe){

	                if(lastArrCardDeal && lastArrCardDeal.length){
	                    cc.log("444suggest "+ lastArrCardDeal);
	                    this.suggestCard(lastArrCardDeal,false);
	                }else{
	                    cc.log("555suggest "+ this.lastArrCardDeal);
	                    this.suggestCard(this.lastArrCardDeal, false);
	                }
	            }
	            //if(nCmd && nCmd === 256){//Trường hợp thay đổi lượt và ăn chặt
	            if(fromPlayer.puid){
	                cc.log('------- an chat ');
	                //log player gts 002 {"fP":{"uid":"6659b1dc-fa6e-48e3-88da-48076ef94a89","lm":-1000,"pS":1,"puid":"d7cac132-296d-4103-a94a-996e2e81142f",
	                //"dCs":[16,17,18,19],"dn":"gts002","mX":950,"m":340950},"cmd":251,
	                //"tP":{"uid":"d7cac132-296d-4103-a94a-996e2e81142f","dn":"gts001"},"nCmd":256}
	                var addMoney   = fromPlayer.mX; //số tiền cộng cho thằng chặt
	                var reduceMoney =fromPlayer.lm; //số tiền trừ cho thằng bị chặt
	                var puid = fromPlayer.puid;//thang bi chat
	                if(fromPlayer.uid == slot.uid){
	                    slot.runChangeGoldEffect(addMoney);
	                }
	                if(puid == slot.uid){
	                    slot.runChangeGoldEffect(reduceMoney);
	                }
	            }
	        }
	    }.bind(this));

	    cc.log(this.rejectTurnTotal +" <==== > "+(this.totalPlayerPlaying-1));
	    if(this.rejectTurnTotal === (this.totalPlayerPlaying-1)) {

	        this.rejectTurnTotal =0;
	        this.meRejectTurn = false;
	        this.lastArrCardDeal.length = 0;
	        cc.log("<==== > hideAllBoLuot ----");
	        this.hideAllBoLuot();

	        if(tP.uid == PlayerMe.uid){
	            this.boLuotBt.visible = false;
	        }
	        // flip and hide card on table
	        this.cardOnTable.flipAndRemoveAll();


	    }
	    if(tP.uid == PlayerMe.uid){
	        //hide btn danh bai neu all card ko the chặt được bai dối phương
	        if(mySlot && this.cardList.isAllBlur()) this.danhbaiBt.visible = false;
	    }
	},
	onDanhBaiThanhCong: function(uid, cardData){
		cc.log("onDanhBaiThanhCong  "+cardData);
	    var slot = this.getSlotByUid(uid);
	    if (slot) {
	        var cards = [];
	        for (var i = 0; i < cardData.length; i++) {
	            cards.push(Utils.getCardFromServer(cardData[i]));
	        }

	        this.cardOnTable.moveOldCard();

	        if (slot.isMe) {
	        	cc.log("onDanhBaiThanhCong me");
	            var arr = this.cardList.removeCard2(cards);
	            var arrCard = [];
	            for (var i = 0; i < arr.length; i++) {
	            	var card = new Card(arr[i].point, arr[i].suit , this.cardOnTable);
			        card.canTouch  = false;
			        card.setAnchorPoint(.5,.5);
			        card.setPosition(this.cardOnTable.convertToNodeSpace( this.cardList.convertToWorldSpace(cc.p(arr[i].x, arr[i].y)) ));
			        arrCard.push(card);

	                // var pos = cc.convertToWorldSpace(arr[i]) ;
	                // var pos = arr[i].getParent().convertToWorldSpace(arr[i].getPosition());
	                // arr[i].setPosition( this.cardOnTable.convertToNodeSpace(pos) );
	                // arr[i].canTouch = false;
	            }
	            this.cardList.reOrder();
	            this.cardOnTable.addCard(arrCard);
	        }else {
	        	cc.log("onDanhBaiThanhCong  not me");
	            var bCard = this.backCardList[slot.sitId];
	            // var pos = cc.convertToWorldSpace(bCard) ;// bCard.getParent().convertToWorldSpace(bCard.getPosition());
	            var pos = bCard.getParent().convertToWorldSpace(bCard.getPosition());
	            pos = cc.p(pos.x + bCard.widthContainer/2, pos.y+ bCard.heightContainer/2);
	            this.cardOnTable.addNewCardList(cards, this.cardOnTable.convertToNodeSpace(pos));
	        }
	    }
	},
	onEndGameResponse: function(dataObj){
		cc.log('onEndGameResponse '+JSON.stringify(dataObj));
	    var data = dataObj[1];
	    var thiz = this;
	    var player = dataObj[1].ps;
	    thiz.playerPlayed = player;
	    //{"ps":[{"cs":[9,16,22,37,45,46,47,1],"uid":"78e729d6-36cd-4f57-a26a-0ebd4355a602","dn":"gts004","mX":-800,"m":196300}],
	    //"fP":{"uid":"890501a5-ebfb-4df3-ae0d-3f257b53e4ab","pS":1,"dCs":[49,50],"dn":"gts003","mX":760,"m":183680},"cmd":252}
	    // neu co whR:Int = WHITE_HAND_RANKING la win luon
	    //   Constant.WHITE_HAND_RANKING.

	    thiz.isShowingResult = true;
	    thiz.showReady(false);
	    thiz.hideAllBtnPlay();
	    thiz.stopTurnTimeAll();
	    for(var i = 0 ; i < this.backCardList.length; i++){
	        this.backCardList[i].removeAll();//remove all backcard+ remain card label
	    }
	    var fromPlayer = dataObj[1].fP;
	    if(fromPlayer){
	        this.isPlaying = false;

	        var  lastArrCardDeal = fromPlayer.dCs;
	        this.onDanhBaiThanhCong(fromPlayer.uid, lastArrCardDeal);
	        //thiz.onDealCardToCentre(fromPlayer, lastArrCardDeal);
	        // lat bai cac user con` card
	        cc.each(thiz.allSlot, function(_slot, index){
	            if( _slot != null){
	                var isHorizontal = true;
	                var scale = .5;
	                if(!_slot.isMe){//=0 la` mythiz => ko can animation lat bai`
	                    var p = thiz.getPlayerDataByUid(_slot.uid, player);// player.cs;
	                    if(p){
	                        //var cardArray = p.cs;
	                        //this.cardListEndGame[_slot.sitId].dealCards(cardArray, true);

	                        var cards = [];
	                        var cardArray = p.cs;
	                        for (var i = 0; i < cardArray.length; i++) {
	                            cards.push(Utils.getCardFromServer(cardArray[i]));
	                        }
	                        _slot.showCardEndGame( cards, true);

	                    }


	                }


	            }

	        });

	        //call cuoi cung` tranh loi
	        this.showResult(true, dataObj[1]);
	    }else{
	        //win ngay khi chia bai => anim show all bai xong moi call  2 dong duoi
	        //GameTLMN.instance.isPlaying = false;
	        //   GameTLMN.instance.showResult(true, dataObj[1]);
	        thiz.onWinAfterChiabai(dataObj[1]);
	        //show detail whR
	    }
	    cc.each(thiz.data.ps, function(p, i){
	        p.pi = false;
	        p.r = false;
	    });
	    //show result endgame in 4s
	    //window.setTimeout(thiz.resetNewGame, 4000);//4s




	    var delay = cc.delayTime(this.tfeg);
	    var cb = function(){
	        if(thiz.registerQuit && thiz.registerQuitHandler){
	            thiz.registerQuit = false;
	            thiz.registerQuitHandler();
	            thiz.registerQuitHandler = null;
	        }

	        LobbyClient.getInstance().checkkickWhenEndGame(); // luon goi func nay


	        thiz.resetNewGame();
	        thiz.arrangePlayerInGame();
	        var idMaster = thiz.getIdRoomMaster();
	        if(thiz.data.ps[idMaster].uid == PlayerMe.uid){
	            thiz.showReady(false);
	            thiz.showStartIfCan();
	        }else{
	            thiz.showReadyIfCan();
	        }

	    };



	    var callFun = cc.callFunc(cb);
	    this.runAction(cc.sequence(delay, callFun));
	    cc.log("delay "+this.tfeg + " then resetgame");
	},
	showResult: function(isShow, dataObj){
		var thiz = this;
	    //thiz.animationMng.show(isShow);
	    if(isShow){
	        //{"ps":[{"cs":[9,16,22,37,45,46,47,1],"uid":"78e729d6-36cd-4f57-a26a-0ebd4355a602","dn":"gts004","mX":-800,"m":196300}],
	        //"fP":{"uid":"890501a5-ebfb-4df3-ae0d-3f257b53e4ab","pS":1,"dCs":[49,50],"dn":"gts003","mX":760,"m":183680},"cmd":252}
	        // neu co whR:Int = WHITE_HAND_RANKING la win luon
	        //hide all backcard if have
	        for(var i = 0 ; i < this.backCardList.length; i++){
	            this.backCardList[i].removeAll();//remove all backcard+ remain card label
	        }
	        var playerArr   = dataObj.ps;
	        if(dataObj.fP){
	            this.playSoundAction("finished");
	            var uidWin      = dataObj.fP.uid;
	            var winMoney    = dataObj.fP.mX;
	            var totalMoney    = dataObj.fP.m;

	            cc.each(thiz.allSlot, function(slot, index){
	                if(slot){
	                    if(slot.uid == uidWin){
	                        slot.showResult(true,totalMoney, winMoney,slot.sitId);
	                        if(uidWin == PlayerMe.uid){
	                            if(thiz.aid == Constant.ASSET_ID.GOLD) PlayerMe.gold +=winMoney;
	                            else PlayerMe.chip +=winMoney;
	                        }
	                    }else{
	                        for(var i =0; i < playerArr.length; i++){
	                            if(playerArr[i].uid ==slot.uid ){
	                                var isCong =false;
	                                if(playerArr[i].cs && playerArr[i].cs.length == 13 && playerArr[i].mX < 0) isCong = true
	                                slot.showResult(false,  playerArr[i].m, playerArr[i].mX,slot.sitId,-1, isCong);
	                                if(playerArr[i].uid == PlayerMe.uid){
	                                    if(thiz.aid == Constant.ASSET_ID.GOLD) PlayerMe.gold =playerArr[i].m;
	                                    else PlayerMe.chip =playerArr[i].m;
	                                }else{
	                                    var cards = [];
	                                    var cardArray = playerArr[i].cs;
	                                    for (var i = 0; i < cardArray.length; i++) {
	                                        cards.push(Utils.getCardFromServer(cardArray[i]));
	                                    }
	                                    slot.showCardEndGame( cards, true);
	                                }
	                                break;
	                            }
	                        }
	                    }


	                }
	            });

	            playerArr.push(dataObj.fP);//de updateMoneyPlayer
	        }else{
	            //win luon khi chia bai
	            var delay = cc.delayTime(1);
	            var cb = function(){
	                //coi nhu 1 s de chiabai
	                thiz.playSoundAction("finished");
	                var uidWin =-1;
	                var whR = -1;
	                var winMoney    = 0;
	                var totalMoney    = 0;
	                var playWin ='';
	                var cardWinArr =[];
	                cc.each(playerArr, function(_player, index){
	                    if(_player.whR && _player.whR > 0) {
	                        uidWin = _player.uid;
	                        whR = _player.whR;
	                        playWin = _player.dn;
	                        totalMoney =  _player.m;
	                        winMoney =  _player.mX;
	                        cardWinArr = _player.cs;
	                    }
	                });
	                cc.each(thiz.allSlot, function(slot, index){
	                    if(slot){
	                        if(slot.uid == uidWin){
	                            slot.showResult(true,totalMoney, winMoney, slot.sitId, whR, false);
	                            if(thiz.aid == Constant.ASSET_ID.GOLD) PlayerMe.gold +=winMoney;
	                            else PlayerMe.chip +=winMoney;
	                        }else{
	                            for(var i =0; i < playerArr.length; i++){
	                                if(playerArr[i].uid ==slot.uid ){
	                                    slot.showResult(false,  playerArr[i].m, playerArr[i].mX,slot.sitId, whR, false);//toi trang thi thua ko tinh la cong
	                                    if(playerArr[i].uid == PlayerMe.uid){
	                                        if(thiz.aid == Constant.ASSET_ID.GOLD) PlayerMe.gold -=winMoney;
	                                        else PlayerMe.chip -=winMoney;
	                                    }
	                                    break;
	                                }
	                            }
	                        }
	                    }
	                });
	            };
	            var callFun  =  cc.callFunc(cb);
	            this.runAction( cc.sequence(delay, callFun));
	        }

	        for(var i =0; i < playerArr.length; i++){
	            thiz.updateMoneyPlayer(playerArr[i]);
	        }

	    }
	},
	onWinAfterChiabai: function(data){
		var player = data.ps;
	    var thiz = this;
	    //laggy - prevent bug mat quan bai nen reset truoc chi chia bai moi
	    thiz.resetNewGame(true);

	    //prevent switch tab and comback when resetNewGame not call because pause
	    //fix bug rare use
	    /*thiz.allSlot.forEach(function(_allSlot, index){
	     if(_allSlot){
	     _allSlot.reset();
	     }
	     });*/


	    var whR = -1;
	    var cardWinArr =[];
	    cc.each(player, function(_player, index){
	        if(_player.whR && _player.whR > 0) {
	            whR = _player.whR;
	            cardWinArr = _player.cs;
	        }

	    });
	    thiz.gameState =GAME_STATE.SHOW_KQ;//5;
	    thiz.isPlaying = true;
	    /* var selector = function(){
	     thiz.isPlaying = false;
	     thiz.showResult(true, data);
	     };
	     var callback = cc.callFunc(selector, thiz);*/

	    var delay = cc.delayTime(.4);
	    var cb = function(){
	        thiz.isPlaying = false;
	        thiz.showResult(true, data);

	    };

	    var callFun  =  cc.callFunc(cb);
	    this.runAction( cc.sequence(delay, callFun));

	    this.hideAllBtnPlay();
	    cc.each(this.allSlot, function(slot, index){
	        if( slot != null){
	            cc.each(player, function(_player, j){
	                if( _player.uid == slot.uid) {
	                    var cardArray = _player.cs;
	                    var cards = [];

	                    for (var i = 0; i < cardArray.length; i++) {
	                        cards.push(Utils.getCardFromServer(cardArray[i]));
	                    }
	                    var rd = Math.floor((Math.random() * 10) + 1);
	                    if(TEST_MODE){
	                        if (slot.isMe) {
	                            slot.isMe = rd > 5 ? true : false;
	                        }
	                    }


	                    if(slot.isMe){
	                        //thiz.cardList.dealCards(cards, true);
	                        slot.x=(cc.Global.GameView.width / 2 -thiz.playerView[0].widthBG/2 -GameTLMN.X_CHIA_BAI);

	                    }
	                    //thiz.cardListEndGame[slot.sitId].dealCards(cards, true);

	                    var deckPoint = cc.p(cc.winSize.width/2, cc.winSize.height/2);

	                    slot.showCardEndGame( cards, true, deckPoint);



	                    _player.pi = true;
	                }
	            });
	        }
	    });
	},
	sendStartRequest: function(){
		cc.log('send ready ');
	    var sendObj = [
	        command.RoomPluginMessage,
	        Constant.CONSTANT.ZONE_NAME,
	        LobbyClient.getInstance().getCurrentRoomId(),
	        {'cmd':Constant.CMD_RESULT.PLAYER_READY}
	    ];
	    LobbyClient.getInstance().send(sendObj);
	},
	sendBoLuot: function(){
	    var sendObj = [
	        command.RoomPluginMessage,
	        Constant.CONSTANT.ZONE_NAME,
	        LobbyClient.getInstance().getCurrentRoomId(),
	        {'cmd':Constant.CMD_RESULT.REJECT_TURN}
	    ];

	    LobbyClient.getInstance().send(sendObj);
	    //thiz.audioMng.playButtonClick();
	    this.ideGameNumber = 0;
	},
	sendDanhBai: function(){
		var cards = this.cardList.getCardSelected();
	    if (cards.length > 0) {
	        var intCardArr = [];
	        for (var i = 0; i < cards.length; i++) {
	            intCardArr.push(Utils.getCodeCard(cards[i].point, cards[i].suit));
	        }

	        var msg = [
	            command.RoomPluginMessage,
	            Constant.CONSTANT.ZONE_NAME,
	            LobbyClient.getInstance().getCurrentRoomId(),
	            {'cmd':Constant.CMD_RESULT.DANH_BAI,'cs':intCardArr}
	        ];
	        LobbyClient.getInstance().send(msg);
	    }
	    else {
	        MessageNode.getInstance().show("Bạn chưa nhấc cây bài nào",1);
	    }
	},
	checkMeIsPlaying: function(){
		var listPlaying= this.data.ps;
	    if(this.gameState >= GAME_STATE.PLAYING){
	        for(var i=0;i<listPlaying.length;i++){
	            if(listPlaying[i].uid === PlayerMe.uid && listPlaying[i].pi){
	                return true;
	            }
	        }
	    }
	    return false;
	},
	backButtonClickHandler: function(forceQuit){
		// test

		MH.changePage("game",{"gameId": Constant.GAME_ID.TLMN});

		return;

		// return;


		cc.log('click quit room tlmn');
	    if(!forceQuit && this.checkMeIsPlaying()){
	        this.registerQuit = !this.registerQuit;
	        // this.showSystemNotice();
	        if(this.registerQuit) {
	            this.showSystemNotice("Bạn đăng ký thoát bàn khi ván chơi kết thúc");
	            this.registerQuitHandler = function(){
	                if(!LoadingDialog.getInstance().isShow()) LoadingDialog.getInstance().show();
	                LobbyClient.getInstance().quitRoom();
	            };
	        }else{
	            this.showSystemNotice("Bạn huỷ thoát bàn khi ván chơi kết thúc");
	            this.registerQuitHandler = null;
	        }
	        return;
	    }


	    if(!LoadingDialog.getInstance().isShow()) LoadingDialog.getInstance().show();
	    LobbyClient.getInstance().quitRoom();
	},
	onEnter: function(){
		this._super();
		LobbyClient.getInstance().addListener(kCMD.RoomPluginMessage, this._onRoomPluginMsg, this);
	},
	onExit: function(){
		this._super();
		LobbyClient.getInstance().removeListener(this);
	}
});

GameTLMN.X_CHIA_BAI = 550;
GameTLMN.MAX_CARD_PLAYER = 13;
GameTLMN.cardOriginScaleBackCard = 0.6;
GameTLMN.MAX_SLOT = 4;