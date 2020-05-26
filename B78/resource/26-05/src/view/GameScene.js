// cha của Game TLMN, GAmePHOM...
var GameScene = cc.Node.extend({
	CONSTANT_VALUE: 0.064,
	ctor: function(dataGame){
		this._super();

	    this.setPosition(0, 0);

	    this.data = dataGame;
	    this.type = "GameScene";
	    this.meGotPunish = false;

	    this.isOwnerMe = false;
	    this.ideGameNumber = 0;

	    // var chatLayer = new ChatLayer();
	    // MyPixi.gameContainer.addChild(chatLayer);
	    // LobbyClient.getInstance().addListener(kCMD.CHAT, this.onRecvChatMessage, this);
	    this.initGameScene();
	},
	showInviteDialog: function(listUser){
		cc.log( listUser );

		MH.openPopup("Invite", listUser);
		return;
		MH.invite( listUser, function(userSelected){
	        if (userSelected && userSelected.length > 0){
	            var arrName = [];
	            for(var i = 0 ; i < userSelected.length;i++){
	                arrName.push(userSelected[i].u);

	            }
	            var sendObj = [
	                command.ZonePluginMessage,
	                Constant.CONSTANT.ZONE_NAME,
	                'channelPlugin',
	                {'cmd':Constant.CMD_RESULT.SEND_INVITE,
	                    'us':arrName,
	                    'rid':LobbyClient.getInstance().getCurrentRoomId()
	                }
	            ];
	            cc.log("invite "+ JSON.stringify(sendObj) );
	            LobbyClient.getInstance().send(sendObj);
	        }
	    });
	},
	initGameScene: function(){
		var displayAutoReady = false;

	    var gameId = cc.Global.gameId;
	    switch (gameId) {
	        case Constant.GAME_ID.TLMN:
	            displayAutoReady = true;
	            break;
	        case Constant.GAME_ID.SAM:
	            displayAutoReady = true;
	            break;
	        case Constant.GAME_ID.PHOM:
	            displayAutoReady = true;
	            break;
	    }
	    this.addBg();

	   	this.hudLayer = new GameTopBar(this, displayAutoReady);
	    MyPixi.gameContainer.addChild(this.hudLayer);

	    LobbyClient.getInstance().addListener("ping", this.hudLayer.notifiPing, this);
	},
	addBg: function(){
		var sprite;
		if(cc.Global.gameId === Constant.GAME_ID.CHAN){
	        sprite = PIXI.Sprite.fromImage("res/bg/bg_chan.jpg");
	    }else {
	        sprite = PIXI.Sprite.fromImage("res/bg/bg_game.jpg");
	    }

	    sprite.setAnchorPoint(cc.p3(0.5,0.5));

	    sprite.setPosition(cc.p2(MyPixi.rendererGame.width / 2, MyPixi.rendererGame.height / 2));


    	MyPixi.gameContainer.addChild(sprite);

    	if( cc.Global.gameId === Constant.GAME_ID.LIENG || cc.Global.gameId === Constant.GAME_ID.XITO || cc.Global.gameId === Constant.GAME_ID.POKER){
	        var table = PIXI.Sprite.fromImage("res/bg/table.png");
        	table.setAnchorPoint(cc.p3(0.5, 0.5));
	        

	        // move the sprite to the center of the screen
	        table.setPosition(cc.p2(MyPixi.rendererGame.width / 2, MyPixi.rendererGame.height / 2));
	        // table.displayGroup = MyPixi.gameRootLayer;
	        MyPixi.gameContainer.addChild(table);
	    }

	    switch (cc.Global.gameId){
	        case Constant.GAME_ID.TLMN:
	            this.addLogo("logo_tlmn.png");
	            break;
	        case Constant.GAME_ID.SAM:
	            this.addLogo("logo_sam.png");
	            break;
	        case Constant.GAME_ID.LIENG:
	            this.addLogo("logo_lieng.png");
	            break;

	        case Constant.GAME_ID.XITO:
	            this.addLogo("logo_xito.png");
	            break;
	        case Constant.GAME_ID.POKER:
	            this.addLogo("logo_poker.png");
	            break;
	        case Constant.GAME_ID.PHOM:
	            this.addLogo("logo_tala.png");
	            break;
	        case Constant.GAME_ID.MAUBINH:
	            this.addLogo("logo_maubinh.png");
	            break;
	        case Constant.GAME_ID.BACAY:
	            this.addLogo("logo_3cay.png");
	            break;
	    }

	    // var btn = new newui.Button("#khung_avatar.png", function(){
	    // 	cc.log('click this');
	    // });

	    // btn.setAnchorPoint(0.5, 0.5);

	    // btn.visible = false;

	    // MyPixi.gameContainer.addChild(btn);
	    // btn.setPosition(MyPixi.rendererGame.width / 2, -MyPixi.rendererGame.height / 2);
	},
	addLogo: function(pngName){
		var table = PIXI.Sprite.fromFrame(pngName);
		// var table = new cc.Sprite(pngName);
	    // center the sprite's anchor point
	    table.setAnchorPoint(cc.p3(0.5, 0.5));

	    // move the sprite to the center of the screen
	    table.setPosition(cc.p2(MyPixi.rendererGame.width / 2, MyPixi.rendererGame.height / 2));
	    // table.displayGroup = MyPixi.gameRootLayer;
	    MyPixi.gameContainer.addChild(table);
	},
	onReconnectDone: function(data){
		//call sau khi reconnect done
	},
	onLoginDone: function(data){
		//call sau khi login done
	},
	stopTurnTime: function(uid){
		for (var i = 0; i < this.allSlot.length; i++) {
	        if (this.allSlot[i].uid === uid) {
	            this.allSlot[i].stopTimeRemain();
	            break;
	        }

	    }
	},
	stopTurnTimeAll: function(){
		for (var i = 0; i < this.allSlot.length; i++) {
	        this.allSlot[i].stopTimeRemain();
    	}
	},
	resetStateAllPlayer: function(){
		for (var i = 0; i < this.allSlot.length; i++) {
	        this.allSlot[i].stopTimeRemain();
	    }
	},
	stopAllSlotTimeTurn: function(){
		for(var i=0;i<this.allSlot.length;i++){
	        this.allSlot[i].stopTimeRemain();
	    }
	},
	backButtonClickHandler: function(){},
	updateOwner: function(playerData){
		if(!playerData || !playerData.uid) return;
	    var isShowKick = false;
	    if (this.data.gS < GAME_STATE.PLAYING && PlayerMe.uid === playerData.uid) {
	        isShowKick = true;
	    }
	    for (var i = 0; i < this.allSlot.length; i++) {
	        if(!this.allSlot[i]) continue;
	        //cc.log(this.allSlot[i].username + " === "+userName);
	        if(cc.Global.gameId === Constant.GAME_ID.XOCDIA || cc.Global.gameId === Constant.GAME_ID.CHAN) isShowKick =false;
	        this.allSlot[i].showKick(isShowKick);
	        if (this.allSlot[i].uid === playerData.uid) {
	            //show key icon
	            this.allSlot[i].setMasterRoom(true);
	            if (PlayerMe.uid === playerData.uid) this.allSlot[i].showKick(false);

	            cc.log("master la "+this.allSlot[i].dn);
	        }
	        else {
	            this.allSlot[i].setMasterRoom(false);
	        }
	    }

	    if (PlayerMe.uid == playerData.uid) {
	        this.isOwnerMe = true;
	    }
	    else {
	        this.isOwnerMe = false;
	    }
	},
	setStatePlayerLieng: function(uid, state){
		for (var i = 0; i < this.allSlot.length; i++) {
	        if (this.allSlot[i].uid == uid) {
	            this.allSlot[i].setStateLieng(state);
	            return;
	        }
	    }
	},
	setStatePlayerGameTo: function(uid, state){
		this.setStatePlayerLieng(uid, state);
	},
	setStatePlayerBinh: function(uid, state){
		for (var i = 0; i < this.allSlot.length; i++) {
	        if (this.allSlot[i].uid == uid) {
	            this.allSlot[i].setStateBinhResult(state);
	            return;
	        }
	    }
	},
	setStatePlayer: function(uid, state){
		for (var i = 0; i < this.allSlot.length; i++) {
	        if (this.allSlot[i].uid == uid) {
	            this.allSlot[i].setState(state);
	            return;
	        }
	    }
	},
	setStatePlayerChan: function(uid, state){
		for (var i = 0; i < this.allSlot.length; i++) {
	        if (this.allSlot[i].uid == uid) {
	            this.allSlot[i].setStateChan(state);
	            return;
	        }
	    }
	},
	clearStatePlayer: function(){
		for (var i = 0; i < this.allSlot.length; i++) {
	        if(cc.Global.gameId == Constant.GAME_ID.CHAN)
	            this.allSlot[i].setStateChan(state_player.NOTHING);
	        else
	            this.allSlot[i].setState(state_player.NOTHING);
	    }
	},
	startGame: function(){
		this.gameState = GAME_STATE.PLAYING;
	    // remove all ready img
	    for (var i = 0; i < this.allSlot.length; i++) {
	        this.allSlot[i].setState(state_player.NOTHING);
	    }
	},
	updateGold: function(username, gold){
		var goldNumber = gold;
	    if ( cc.isString(gold) ){
	        goldNumber = parseInt(gold);
	    }
	    for (var i = 0; i < this.allSlot.length; i++) {
	        if (this.allSlot[i].username == username) {
	            this.allSlot[i].setGold(goldNumber);
	            return;
	        }
	    }
	},
	getSlotBeforeByIndexId: function(indexId){
		var slotKq = null;
	    var slot = this.getSlotByIndex(indexId);
	    if (!slot) return null;
	    var indexTurn = slot.index;
	    if (indexTurn === 0) {
	        indexTurn = 4;
	        cc.log('aaaa testtt');
	        //need check neu co chau ria` thi co sai ko
	        while (!slotKq && indexTurn > 0) {
	            indexTurn--;
	            slotKq = this.getSlotByIndex(indexTurn);
	        }
	    } else {
	        indexTurn -= 1;
	        slotKq = this.getSlotByIndex(indexTurn);
	    }

	    return slotKq;
	},
	getIdRoomMaster: function(){
		var ps = this.data.ps;
	    for (var i = 0; i < ps.length; i++) {
	        var value = ps[i];
	        if (value.C) {
	            return i;
	        }
	    }
	    ;
	    return -1;
	},
	getDataPlayerByUid: function(uid){
		var ps = this.data.ps;
	    for (var i = 0; i < ps.length; i++) {
	        var value = ps[i];
	        if (value.uid === uid) {
	            return value;
	        }
	    }
	    ;
	    return null;
	},
	processPlayerPosition: function(players, gameState,arrangeChauRiaOnly){
		var listPlayer = [];
	    var listChauRia = [];
	    var totalPlayer = 0;
	    var isShowKick = false;
	    cc.log("processPlayerPosition "+ gameState);
	    //if (gameState < GAME_STATE.PLAYING || gameState >= GAME_STATE.SHOW_KQ) {
	    if (gameState < GAME_STATE.PLAYING || gameState > GAME_STATE.SHOW_KQ) {
	        listPlayer = players;
	        totalPlayer = players.length;
	    } else {
	        for (var i = 0; i < players.length; i++) {
	            var p = players[i];
	            if ( p.pi ) {
	                totalPlayer++;
	                listPlayer.push(p);
	                cc.log("player "+ p.dn);
	            } else {
	                listChauRia.push(p);
	                cc.log("chau ria "+ p.dn);
	            }
	        }
	    }
	    //cc.log("listchau ria "+JSON.stringify(listChauRia));
	    //game dang choi ma co user thoat game thi chi refresh lai list chau ria`
	    if (listPlayer && listPlayer.length > 0 && !arrangeChauRiaOnly) { //startGame
	        var userList = listPlayer;
	        this.setPlayerWithPosition(userList);

	        for (var i = 0; i < this.allSlot.length; i++) {
	            if(this.allSlot[i]){
	                this.allSlot[i].setEnable(false);
	                this.allSlot[i].reset();//reset lai uid, index,.. tranh loi~ khi findslotbyindex
	            }
	        }
	        var ownerPlayer = null;
	        for (var i = 0; i < userList.length; i++) {
	            if(i >= this.allSlot.length){
	                //lieng,xito, poker full player nhung van vao` xem duoc , chi la ko co slot de ngoi`
	                break;//
	            }
	            var idx = userList[i].sit;
	            //cc.log(idx+ " => "+ userList[i].uid );
	            this.allSlot[idx].setDataPlayer(userList[i]);
	            this.allSlot[idx].setEnable(true);
	            this.allSlot[idx].setIndex(idx);
	            this.allSlot[idx].setUid(userList[i].uid);
	            this.allSlot[idx].setUsername(userList[i].dn);
	            this.allSlot[idx].setGold(Math.floor(userList[i].m));
	            this.allSlot[idx].setAvatar(userList[i].a);

	            if (gameState < 4) this.allSlot[idx].setState(userList[i].r ? state_player.READY : state_player.NOTHING);
	            if (userList[i].ib) {
	                this.allSlot[idx].setState(state_player.BAO_SAM);
	            }
	            this.allSlot[idx].stopTimeRemain();//userID
	            this.allSlot[idx].showChauRia(false);
	            if (this.allSlot[idx].uid === PlayerMe.uid) {
	                this.allSlot[idx].isMe = true;
	            } else {
	                this.allSlot[idx].isMe = false;
	            }
	            if (userList[i].C) {
	                ownerPlayer = userList[i];
	                //cc.log("master  la 11 = "+ownerPlayer.dn);
	            }
	        }
	        //update owner
	        this.updateOwner(ownerPlayer);
	    }
	    if(this.allSlot && this.allSlot.length){
	        //clear all chau ria truoc tien
	        for (var j = 0; j < this.allSlot.length; j++) {
	            var slot = this.allSlot[j];
	            if (slot && slot.index === -1 && slot.isChauRia()) {
	                slot.setEnable(false);
	                slot.reset();
	                slot.showChauRia(false);
	            }
	        }
	    }
	    if (listChauRia && listChauRia.length > 0) {//
	        var userList = listChauRia;
	        var _index = 0;
	        for (var i = 0; i < listChauRia.length; i++) {
	            var user = listChauRia[i];
	            for (var j = _index; j < this.allSlot.length; j++) {
	                var slot = this.allSlot[j];
	                //cc.log("chau riaaaaaaa "+slot.index + " !chayria "+slot.isChauRia());
	                if (slot && slot.visible && slot.index === -1 && !slot.isChauRia()) {//chua ai ngoi hoac dang co chau ria ngoi roi
	                    cc.log(slot.sitId+ " => "+ userList[i].dn );
	                    _index = j + 1;
	                    slot.setDataPlayer(user);
	                    slot.setEnable(true);
	                    slot.setIndex(-1);//-1 la chauria
	                    slot.setUid(user.uid);
	                    slot.setUsername(user.dn);
	                    slot.setGold(Math.floor(user.m));//isReady
	                    slot.setAvatar(user.a);
	                    slot.setState(state_player.NOTHING);
	                    slot.stopTimeRemain();//userID
	                    slot.showChauRia(true);
	                    if (slot.uid === PlayerMe.uid) {
	                        slot.isMe = true;
	                    } else {
	                        slot.isMe = false;
	                    }

	                    break;
	                }
	            }

	        }


	    }
	},
	getPlayerDataByUid: function(uid, player){
		for (var i = 0; i < player.length; i++) {
	        if (player[i].uid == uid) {
	            return player[i];
	        }
	    }
	    return null;
	},
	getSlotByLoginName: function(loginName){
		for (var i = 0; i < this.allSlot.length; i++) {
	        if (this.allSlot[i].loginName == loginName) {
	            return this.allSlot[i];
	        }
	    }
	    return null;
	},
	getSlotByIndex: function(index){
		for (var i = 0; i < this.allSlot.length; i++) {
	        if (this.allSlot[i].index == index && this.allSlot[i].index >= 0) {
	            return this.allSlot[i];
	        }
	    }
	    return null;
	},
	getSlotByUid: function(uid){
		if(!this.playerView || !this.playerView.length)  return null;
	    for (var i = 0; i < this.playerView.length; i++) {
	        var slot = this.playerView[i];
	        if (slot && uid === slot.uid) {
	            return slot;
	        }
	    }
	    return null;
	},
	getSlotMaster: function(){
		for (var i = 0; i < this.allSlot.length; i++) {
	        if (this.allSlot[i].C) {
	            return this.allSlot[i];
	        }
	    }
	    return null;
	},
	hideAllBoLuot: function(){
		for (var i = 0; i < this.allSlot.length; i++) {
	        this.allSlot[i].showBoLuot(false);
	    }
	},
	getMaxPlayer: function(){
		var maxPlayer = 4;
	    var gId = cc.Global.gameId;
	    if (gId == Constant.GAME_ID.TLMN) maxPlayer = 4;
	    else if (gId == Constant.GAME_ID.SAM) maxPlayer = 5;
	    else if (gId == Constant.GAME_ID.MAUBINH) maxPlayer = 4;
	    else if (gId == Constant.GAME_ID.LIENG) maxPlayer = 9;
	    else if (gId == Constant.GAME_ID.XITO) maxPlayer = 5;
	    else if (gId == Constant.GAME_ID.POKER) maxPlayer = 9;
	    else if (gId == Constant.GAME_ID.PHOM) maxPlayer = 4;
	    else if (gId == Constant.GAME_ID.CHAN) maxPlayer = 4;
	    else if (gId == Constant.GAME_ID.BACAY) maxPlayer = 9;
	    else if (gId == Constant.GAME_ID.XOCDIA) maxPlayer = 9;//max 30 nguoi nhung chi co 9 slot

	    return maxPlayer;
	},
	getSitPosArr: function(totalPlayer){
		if (totalPlayer === 2) this.sitdownPlayerNext = [2];
	    else if (totalPlayer === 3) this.sitdownPlayerNext = [1, 2];
	    else if (totalPlayer === 4) this.sitdownPlayerNext = [1, 2, 3];
	    else if (totalPlayer === 5) this.sitdownPlayerNext = [1, 2, 3, 4];
	    else {
	        this.sitdownPlayerNext = [];
	        for (var i = 1; i <= (totalPlayer -1); i++) {
	            this.sitdownPlayerNext.push(i);
	        }
	    }
	    return this.sitdownPlayerNext;
	},
	setPlayerWithPosition: function(players){
		cc.log("PLAYERRR setPlayerWithPosition in GameScene "+players);
	    //find me
	    var idx = -1;
	    for (var i = 0; i < players.length; i++) {
	        if (players[i].uid == PlayerMe.uid) {
	            idx = players[i].sit;
	            break;
	        }
	    }
	    var allSlot = [];
	    var maxPlayer = this.getMaxPlayer();
	    for(var i = 0 ; i < maxPlayer; i++){
	        allSlot[i] = null;
	    }
	    //var allSlot = [null, null, null, null];
	    if (idx >= 0) {
	        allSlot[idx] = this.playerView[0];
	        cc.log("PLAYERRR ME ngoi` sitId = 0 sit_server = " + idx);
	    }
	    ///
	    var totalPlayer = players.length;
	    cc.log("totalPlayer " + totalPlayer);
	    if (totalPlayer >= 2) {

	        /* if(totalPlayer ===2) this.sitdownPlayerNext = [2];
	         else if(totalPlayer ===3) this.sitdownPlayerNext = [1,2];
	         else if(totalPlayer ===4) this.sitdownPlayerNext = [1,2,3];*/
	        this.sitdownPlayerNext = this.getSitPosArr(totalPlayer);

	        if (idx == -1) this.sitdownPlayerNext.unshift(0);//them sit 0 vao` dau` arr
	        var thiz = this;
	        var start = idx + 1;
	        for (var i = start; i < maxPlayer; i++) {//vi sitid tu server bat dau tu 1 => max = totalplayer
	            cc.each(players, function (p, index) {
	                if (p.sit === i) {
	                    var sitId = thiz.sitdownPlayerNext[0];
	                    allSlot[i] = thiz.playerView[sitId];
	                    cc.log("PLAYERRR " + p.dn + "  ngoi` sitId = " + sitId + " sit_server = " + i);

	                    thiz.sitdownPlayerNext.shift();
	                }
	            });

	        }
	        start = idx - 1;
	        for (i = start; i >= 0; i--) {//idx  idMyPlayer
	            cc.each(players, function (p, index) {
	                if (p.sit === i) {
	                    var sitId = thiz.sitdownPlayerNext[thiz.sitdownPlayerNext.length - 1];
	                    allSlot[i] = thiz.playerView[sitId];
	                    cc.log("PLAYERRR " + p.dn + "  ngoi` sitId = " + sitId + " sit_server = " + i);
	                    //thiz.updateInfoPlayer(thiz.playerView[sitId], thiz.data.players[index], index);
	                    thiz.sitdownPlayerNext.pop();

	                }
	            });
	        }
	    } else {
	        if (idx == -1){
	            idx = 0;
	            if(cc.Global.gameId == Constant.GAME_ID.LIENG ||
	                cc.Global.gameId == Constant.GAME_ID.XITO ||
	                cc.Global.gameId == Constant.GAME_ID.BACAY ||
	                cc.Global.gameId == Constant.GAME_ID.POKER){
	                idx = 4;
	            }
	        }
	        //else idx = idx +1;
	        for (var i = 0; i < this.playerView.length; i++) {
	            allSlot[idx] = this.playerView[i];
	            idx++;
	            if (idx >= this.playerView.length) {
	                idx = 0;
	            }
	        }
	    }


	    var start = allSlot.length;
	    for (var k = 0; k < this.playerView.length; k++) {
	        if (!allSlot[k]) {
	            for (var i = this.playerView.length - 1; i >= 0; i--) {
	                if (allSlot.indexOf(this.playerView[i]) === -1) {
	                    allSlot[k] = this.playerView[i];
	                    break;
	                }
	            }
	        }
	    }

	    this.allSlot = allSlot;
	},
	playSoundAction: function(nameSound){
		return;
		//name sound ko co duoi file
	    if (!cc.Global.GetSetting(GameSetting.sound, true)) {
	        return;
	    }
	    cc.playSound(nameSound);
	    //SoundPlayer.playSound(nameSound);
	},
	resetNewGame: function(){

	},
	showStartIfCan: function(){
		var idMaster = this.getIdRoomMaster();
	    if (this.data.ps[idMaster].uid == PlayerMe.uid) {
	        //la room master
	        var allReady = true;
	        var haveReady = false;
	        cc.each(this.data.ps, function (value, index) {
	            if (value.uid !== idMaster && !value.r) {
	                allReady = false;
	            }
	            if (value.uid !== idMaster && value.r) {
	                haveReady = true;
	            }
	        });

	        if (haveReady) this.showReady(true);
	        // cc.log('haveReady' + haveReady);
	    }
	},
	getNumberPlayerNotReadyIgnoreMaster: function(){
		// ko tinh chu ban`
	    var players = this.data.ps;
	    var isPlaying = this.data.gS >= GAME_STATE.PLAYING ? true : false;
	    var num = 0;
	    var idMaster = this.getIdRoomMaster();
	    for (var i = 0; i < players.length; i++) {

	        if (players[i].uid !== this.data.ps[idMaster].uid) {
	            if (!players[i].r) num++;
	        }
	    }
	    return num;
	},
	showReadyIfCan: function(){

	},
	showReady: function(visible){

	},
	hideStartAndReady: function(hide){

	},
	updateRealMoneyPlayer: function(data){
		if(!data) return;
	    var self = this;
	    var length = this.data.ps.length;
	    for (var j = 0; j < length;j++) {
	        var el = this.data.ps[j];
	        if(el.uid === data.uid){
	            el.rM = data.m;//server tra ve m chu ko phai rm :(
	            //cc.log(`update real money ${el.rM} = ${data.m}`);
	            break;
	        }
	    }
	},
	updateMoneyPlayer: function(data){
		if (!data) return;
	    var length = this.data.ps.length;
	    for (var j = 0; j < length; j++) {
	        var el = this.data.ps[j];
	        if (el.uid === data.uid) {
	            if (data.m) {
	                el.m = data.m;
	                //cc.log("update money " + el.dn + " = " + data.m);
	                break;
	            }
	        }
	    }
	},
	quitRoom: function(isIdeKick){
		LobbyClient.getInstance().quitRoom(isIdeKick);
	},
	onUserInOut: function(dataObj){
		//{"p":{"uid":"890501a5-ebfb-4df3-ae0d-3f257b53e4ab","dn":"gts003"}"t":2,"cmd":200}
	    //{"p":{"uid":"78e729d6-36cd-4f57-a26a-0ebd4355a602","a":"","C":false,"g":0,"dn":"gts004","pid":4,"m":150345,"sit":2}"t":1,"cmd":200} => a la avatar, g:gender
	    var newPlayer = null;
	    var isJoin = true;
	    var isPlayingPlayerQuit = false;// dang so ket qua quit
	    if (dataObj[1].t == 1) {//pi = playing
	        // pi: true => dang turn cua no', pS
	        //{"cs":[],"uid":"d7cac132-296d-4103-a94a-996e2e81142f","r":false,"pS":0,"C":true,"pi":false,"rmC":0,"dn":"gts001","pid":1,"m":1423000,"sit":0}
	        //   {"p":{"uid":"6659b1dc-fa6e-48e3-88da-48076ef94a89","a":""          ,"C":false,            "g":0,"dn":"gts002","pid":4,"m":200000 ,"sit":1}"t":1,"cmd":200}
	        newPlayer = dataObj[1].p;
	        newPlayer['r'] = false;
	        newPlayer['pS'] = 0;
	        newPlayer['pi'] = false;
	        newPlayer['rmC'] = 0;
	        // sau khi bam start se up date pi = true cho tat ca player nao ready + chu phong in chiabai()
	        //update or push new neu chua co
	        var length = this.data.ps.length;
	        var isUpdate = false;
	        for (var j = 0; j < length; j++) {
	            var el = this.data.ps[j];
	            if (el.uid === newPlayer.uid) {
	                el = newPlayer;
	                isUpdate = true;
	                break;
	            }
	        }
	        if (!isUpdate) this.data.ps.push(newPlayer);
	    } else if (dataObj[1].t == 2) {
	        cc.log("out room" + dataObj[1].p.uid + " " + dataObj[1].p.dn);
	        newPlayer = dataObj[1].p;
	        isJoin = false;
	        var length = this.data.ps.length;
	        for (var j = 0; j < length; j++) {
	            var el = this.data.ps[j];
	            if (el.pi && el.uid === dataObj[1].p.uid) isPlayingPlayerQuit = true;
	            if (el.uid === dataObj[1].p.uid) {
	                this.data.ps.splice(j, 1);
	                cc.log('size new players ' + this.data.ps.length);
	                //if(j < this.getIdRoomMaster() ) GamePhom.instance.idRoomMaster-=1;
	                break;
	            }
	        }
	    }
	    //cc.log("isPlayingPlayerQuit ${isPlayingPlayerQuit} this.gameState ${this.gameState}`);
	    if(!isPlayingPlayerQuit && (this.gameState ===4 || this.gameState ===5)){
	        //arrange viewer
	        this.arrangePlayerInGame(true);
	    }else{
	        this.arrangePlayerInGame();
	    }
	    if (this.data.ps.length === 1) this.hideStartAndReady(false);
	},
	arrangePlayerInGame: function(arrangeChauRiaOnly){

	},
	onRecvChatMessage: function(cmd, dataObj){
		//cc.log("onRecvChatMessage game "+JSON.stringify(dataObj));
	},
	onRecvDestroyGame: function(cmd, dataObj){
		cc.log("onRecvDestroyGame "+JSON.stringify(dataObj));
	    LobbyClient.getInstance().removeListener(this);
	    LobbyClient.getInstance().onUpdateMoney();
	    this.stopAllActions();//need, specific mau binh for stop update card every 2 sec
	    if(this.onDestroyGame) this.onDestroyGame();//onDestroyGame o cac game nao can`

	    // var allAction = PIXI.actionManager.actions;
	    // if(allAction){
	    //     for (var key in allAction) {
	    //            // console.log(key + " ------onRecvDestroyGame actions-----> " + allAction[key]);
	    //             PIXI.actionManager.cancelAction(allAction[key]);

	    //     }
	    // }
	    // var timersAction = PIXI.timerManager.timers;
	    // if(timersAction && timersAction.length){
	    //     for (var i=0; i <timersAction.length; i++) {
	    //         //console.log(" ------onRecvDestroyGame timersAction-----> " + timersAction[i]);
	    //         PIXI.timerManager.removeTimer(timersAction[i]);

	    //     }
	    // }
	},
	onRecconnectGame: function(cmd, dataObj){
		cc.log("GameScene onRecconnectGame");
	    this.stopAllActions();
	    this.resetNewGame(true);
	    this.updateGame(dataObj);
	    this.recconnectGame();
	},
	updateGame: function(data){},
	recconnectGame: function(){},
	showMsgInSlot: function(uid, mgs){
		var slot = this.getSlotByUid(uid);
	    if (slot) {
	        this.showToast(mgs, cc.p(slot.x + slot.widthBG/2, slot.y ), 2);
	    }
	},
	onShowNotice: function(msg, timeShowInMilisec){
		if(hiepnh.isUndefined(timeShowInMilisec)) timeShowInMilisec = 2000;
    	MessageNode.getInstance().show(msg, timeShowInMilisec/1000);
	},
	showSystemNotice: function(msg, timeShowInSec){
		if(!timeShowInSec) timeShowInSec = 2;
	    if(cc.Global.gameId == Constant.GAME_ID.CHAN)
	        this.showToast(msg, cc.p(cc.Global.designGame.width/2, 320), 2);
	    else
	        MessageNode.getInstance().show(msg, timeShowInSec);
	},
	showToast: function(msg, pos, timeShow){
		alert("on showToast, but fail");
		return;
		if(!timeShow) timeShow = 2;

	    var lb = cc.LabelTTF(msg, cc.res.font.Arial, 25, null, "white");

	    var sizeContent = cc.size(lb.width, lb.height);

	    var padding = [12, 12, 12, 12];//bubble_chat or button/dialog
	    var bg = new PIXI.mesh.NineSlicePlane(PIXI.Texture.fromFrame("bubble_chat.png"), padding[0], padding[1], padding[2], padding[3]);
	    bg.width = sizeContent.width + 20;
	    bg.height = sizeContent.height + 30;


	    bg.alpha = .85;

	    bg.displayGroup = MyPixi.topLayer;

	    MyPixi.gameContainer.addChild(bg);

	    lb.anchor.set(.5,.5);
	    lb.position.set(bg.width/2, bg.height/2);
	    bg.addChild(lb);

	    var w = cc.Global.GameView.width;
	    /*if (pos.x > 0.6 * w) {
	        bg.position.set(pos.x -sizeContent.width * 0.5, pos.y +0);
	       // lb.position.set(-sizeContent.width * 0.5, 0);
	    } else if (pos.x < 0.4 * w) {
	        bg.position.set(pos.x , pos.y +0);
	        //lb.position.set(sizeContent.width * 0.5, 0);
	    }else{
	        bg.position.set(pos.x , pos.y );
	    }*/
	    bg.position.set(pos.x -bg.width * 0.5, pos.y -bg.height/2);

	  //  bg.runAction(new cc.ScaleTo(0.25, 1.0));
	    var cb = cc.callFunc(function(){
	        if(bg && bg.parent) bg.parent.removeChild(bg);
	    });
	    var seq = cc.sequence( cc.delayTime(timeShow), cb);
	    //this.runAction(bg, seq); not use runAction vi` no se ko hide di neu minh goi stopAllAction luk text chua bi xoa
	    PIXI.actionManager.runAction(bg, seq);
	    //cc.log("aaaaaaa");
	},
	onEnter: function(){
		this._super();
		LobbyClient.getInstance().addListener(kCMD.DESTROY_GAME, this.onRecvDestroyGame, this);
	    LobbyClient.getInstance().addListener(kCMD.RECONNECT_INGAME, this.onRecconnectGame, this);
	},
	onExit: function(){
		this._super();
		LobbyClient.getInstance().removeListener(this);
	}
});