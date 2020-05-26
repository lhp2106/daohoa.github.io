var whiteHandRank = [
    "null",
    "tuquy3",
    "tuquy2",
    "2tuquy",
    "6doi",
    "3doithong3bich",
    "4doithong3bich",
    "5doithong",
    "6doithong",
    "donghoa",
    "sanhrong",
    "sanhrongdonghoa"

];
var whiteHandRankSam = [
    "null",
    "donghoa",
    "tuquy2",
    "2xam",
    "5doi",
    "sanhrong",
    "sanhrongdonghoa"

];

var samResult= [
    "null",
    "bibatsam",
    "cong",
    "den",
    "thoi2",
    "ansam",
    "chansam"

];

var finishTypePhom = [
    "MAUTHAU",
    "thua",
    "nhi",
    "ba",
    "bet",
    "mom",
    "ukhan",
    "uden",
    "udentron",
    "utron",
    "u",
    "nhat",
    "den_tala",
    "xaokhan"

];
var resultXiTo = [
    "Mậu thầu",
    "1 đôi",
    "Thú",
    "Xám",
    "Sảnh",
    "Thùng",
    "Cù lũ",
    "Tứ quý",
    "Thùng phá sảnh",
    "Thùng phá sảnh thượng"

];
var resultPoker = [
    "Mậu thầu",
    "1 đôi",
    "2 đôi",
    "Xám",
    "Sảnh",
    "Thùng",
    "Cù lũ",
    "Tứ quý",
    "Thùng phá sảnh",
    "Thùng phá sảnh thượng"
];

var ResultPoint = cc.Node.extend({
    ctor: function(){
        this._super();
        this.setPosition(cc.p2(0, 0));
        this.setAnchorPoint(0.5, 0.5);
        this.numberRemain = 0;

        var size = cc.size(120, 30);
        var bg = new ccui.Scale9Sprite("#button/dialog.png", cc.rect(5,5,5,5));
        // bg.setPreferredSize(size);
        bg.width = size.width;
        bg.height = size.height;

        bg.setPosition(cc.p2(0, 0));
        this.addChild(bg);
        this.bg = bg;

        this.lblPointResult = new cc.LabelTTF('',  'Arial', 18, null, "white");
        this.lblPointResult.setPosition(cc.p2(bg.width/2, bg.height/2+5));
        bg.addChild(this.lblPointResult);
    },
    showText: function(isShow,str){
        if(str) {
            this.lblPointResult.setString(str);
            this.lblPointResult.setPosition(cc.p2(this.bg.width/2- this.lblPointResult.width/2, this.bg.height/2 -this.lblPointResult.height/2));
            //this.showBlurBg(true);
        }
        this.bg.visible = isShow;
    },
    showBlurBg: function(isShow, colorHexa){
        cc.log("ResultPoint showBlurBg");
        // if(isShow){
        //     if(!this.graphics){
        //         this.graphics = new PIXI.Graphics();
        //         this.graphics.displayGroup =   this.displayGroup;
        //     }
        //     var colorArr = [0x8325ea, 0xff0000, 0xe4562f, 0x6cf170, 0x6b038e];
        //     var color =colorArr[Math.floor(Math.random()*colorArr.length)];
        //     if(colorHexa) color = colorHexa;
        //     this.parent.addChild(this.graphics);
        //     this.graphics.position.set(this.x, this.y);
        //     this.graphics.clear();
        //     this.graphics.beginFill(color,.5);
        //     this.graphics.drawRect(0, 0, this.bg.width+10, this.bg.height+10);
        //     this.graphics.endFill();
        // }else{
        //     if(this.graphics)this.graphics.clear();
        // }
        cc.log("ResultPoint showBlurBg");
    }

});

var GamePlayer = cc.Node.extend({
    ctor: function(){
        this._super();
        this.x = 0;
        this.y = 0;

        var thiz = this;

        var bg = new cc.Sprite("#khung_avatar.png");
        if(cc.Global.gameId === Constant.GAME_ID.CHAN){
            bg = new cc.Sprite("#game/khung_avatar_chan.png");
            bg.displayGroup = MyPixi.gameContainerLayer;
        }

        var padding = 10;
        this.widthBG = bg.width ;
        this.heightBG = bg.height;

        this.contentSize = cc.size(this.widthBG, this.heightBG);

        bg.setAnchorPoint(cc.p3(0, 0));
        // this.addChild(bg);

        // cc.log('bggg', bg, bg.width);



        // this.contentSize = cc.size(this.widthBG, this.heightBG);

        this._isChauRia = false;
        this.isMe = false;
        this.username = "";
        this.loginName ="";//ten dang nhap
        this.index = -1;//index postion tu serrver, vua la turn theo thu tu luon,
        this.sitId = -1;// playerme luon = 0, 0< sitid
        this.uid = "";// === TTID
        this.sfsUid = "";// === userID smarfox
        this.gold = 0;

        this.infoLayer = new cc.Node();

        this.addChild(this.infoLayer);
        this.addCuocContainer();
        this.addCuocContainerLeft();

        var avt = new UserAvatar();
        this.infoLayer.addChild(avt);
        //maskAvatar.showBlurBg(true);

        this.avt = avt;

        avt.setAvatar("res/header/ava_default.jpg");

        this.avt.showInfoHandler = function(){
            if(thiz.dataPlayer !=null){
                cc.log("this.avt.showInfoHandler");
            }
        };
        var readyChb = new cc.Sprite('#solo_checked.png');
        readyChb.setAnchorPoint(cc.p3(0,0));
        readyChb.setPosition(cc.p2(8,4));
        this.infoLayer.addChild(readyChb);//,2);
        this.readyChb = readyChb;
        this.readyChb.visible = false;

        var btnRutTien =MyHelper.createButton("button/btn_ruttien.png",true , function () {
           if(thiz.listener) thiz.listener.onSitdown(true);
        });
        btnRutTien.displayGroup = null;//ko bi below avatar

        btnRutTien.setAnchorPoint(cc.p3(0,0.5));
        btnRutTien.setPosition(cc.p2(this.contentSize.width, this.contentSize.height/2));
        this.infoLayer.addChild(btnRutTien);//,2);
        this.btnRutTien = btnRutTien;
        this.btnRutTien.visible = false;

        var dealerSprite =PIXI.Sprite.fromFrame('button/dealer_lb.png');
        dealerSprite.displayGroup = null;//ko bi below avatar
        //dealerSprite.anchor.set(0.5);
        dealerSprite.setPosition(cc.p2(this.contentSize.width , this.contentSize.height));
        this.infoLayer.addChild(dealerSprite);//,2);
        this.dealerSprite = dealerSprite;
        this.dealerSprite.visible = false;

        //ba cay chương
        var chuongSprite =PIXI.Sprite.fromFrame('bacay/chuong.png');
        chuongSprite.setAnchorPoint(cc.p3(0.5, 1));
        chuongSprite.displayGroup = null;//ko bi below avatar
        chuongSprite.setPosition(cc.p2(this.contentSize.width/2 , 5));
        this.infoLayer.addChild(chuongSprite);//,2);
        this.chuongSprite = chuongSprite;
        this.chuongSprite.visible = false;

        //ba cay ga`
        var chickenSprite =PIXI.Sprite.fromFrame('bacay/icon_ga.png');
        chickenSprite.displayGroup = MyPixi.animationLayer;
        chickenSprite.setPosition(cc.p2(this.contentSize.width , this.contentSize.height));
        this.infoLayer.addChild(chickenSprite);//,2);

        this.chickenSprite = chickenSprite;
        this.chickenSprite.visible = false;

        if(cc.Global.gameId == Constant.GAME_ID.CHAN){
            this.timer = new ProgressCircleTimer(0);//ProgressBar.TYPE_RADIAN
            this.timer.setPosition(cc.p2(0, 0));
            this.timer.displayGroup  = bg.displayGroup;
        }else{
            this.timer = new MyProgressBar(0);
            this.timer.setPosition(cc.p2(0, -5));
        }

        this.infoLayer.addChild(this.timer);


        // var dotRed = PIXI.Sprite.fromImage('res/dot.png');
        // dotRed.setAnchorPoint(0.5, 0.5);
        // dotRed.setPosition(0,0);
        // this.addChild(dotRed);
        var roomMaster = PIXI.Sprite.fromFrame("button/icon_key.png");
        roomMaster.setAnchorPoint(cc.p3(0.5,0.5));
        roomMaster.setPosition(cc.p2(this.contentSize.width -8, 10));
        if(cc.Global.gameId == Constant.GAME_ID.CHAN){
            roomMaster = PIXI.Sprite.fromFrame("game/chuphong.png");
            roomMaster.setPosition(cc.p2(this.contentSize.width -30, 5));
            // roomMaster.displayGroup  = bg.displayGroup;
        }

        this.roomMaster = roomMaster;
        this.infoLayer.addChild(roomMaster);//,2);
        this.setMasterRoom(false);

        var kickBt = MyHelper.createButton("button/icon_kick.png",true, function(){});
        kickBt.displayGroup = null;//ko bi below avatar
        kickBt.setAnchorPoint(cc.p3(0.5,0.5));
        kickBt.setPosition(cc.p2(this.contentSize.width -8,3));
        this.infoLayer.addChild(kickBt);//,11);
        this.kickBt =kickBt;
        kickBt.visible =false;

        // 
        //card list
        //var _cardList = new CardList(cc.size(cc.Global.GameView.width/4 +100, 110));
        var _cardList = new CardList(cc.size(cc.Global.GameView.width/5 , 80));
        _cardList.canTouch = false;
        _cardList.setPosition(this.contentSize.width/2, this.contentSize.height/2);
        //_cardList.anchor.set(cc.p(.5, 0.5));
        this.infoLayer.addChild(_cardList);// ,2)
        this.cardListEndGame = _cardList;
        this.cardListEndGame.deckPoint  = cc.p(this.avt.x + this.avt.width/2, this.avt.y + this.avt.height/2 );
        //
        var glowEff = new cc.Sprite("#button/glow1.png");
        glowEff.displayGroup = MyPixi.animationLayer;
        glowEff.setAnchorPoint(cc.p3(.5,.5));
        glowEff.setPosition(cc.p2(this.contentSize.width/2, this.contentSize.height/2));
        this.infoLayer.addChild(glowEff);//,2);
        this.glowEff = glowEff;
        this.glowEff.visible = false;

        var winLoseSprite = new cc.Sprite("#thang.png");
        winLoseSprite.displayGroup =  MyPixi.animationLayer;
        winLoseSprite.setAnchorPoint(cc.p3(0.5,0.5));
        winLoseSprite.setPosition(cc.p2(this.contentSize.width/2, this.contentSize.height/2));
        this.infoLayer.addChild(winLoseSprite);//,2);
        this.winLoseSprite = winLoseSprite;
        this.winLoseSprite.visible = false;

        var state = new cc.Sprite("#solo_checked.png");
        state.displayGroup = MyPixi.animationLayer;
        state.setAnchorPoint(cc.p3(0.5,0.5));
        state.setPosition(cc.p2(this.contentSize.width/2, this.contentSize.height/2));
        this.infoLayer.addChild(state);//,3);
        this.state = state;
        this.state.visible = false;
        this.stateId = state_player.NOTHING;

        var boLuotSprite = new cc.Sprite("#boluot.png");
        boLuotSprite.setAnchorPoint(cc.p3(0.5,0.5));
        boLuotSprite.setPosition(cc.p2(this.contentSize.width/2, this.contentSize.height/2));
        this.infoLayer.addChild(boLuotSprite);//,3);
        this.boLuotSprite = boLuotSprite;
        this.boLuotSprite.visible = false;

        var baoSamSprite = new cc.Sprite("#baosam.png");
        baoSamSprite.setAnchorPoint(cc.p3(0.5,0.5));
        baoSamSprite.setPosition(cc.p2(this.contentSize.width/2, this.contentSize.height/2));
        baoSamSprite.displayGroup = MyPixi.animationLayer;
        this.infoLayer.addChild(baoSamSprite);//,3);
        this.baoSamSprite = baoSamSprite;
        this.baoSamSprite.visible = false;

        var inviteImg = "#button/btn_moichoi_vuong.png";
        if(cc.Global.gameId === Constant.GAME_ID.CHAN){
            inviteImg = "#button/btn_invite.png";
        }
        var inviteBt = new newui.Button(inviteImg, function () {
            cc.log('click invite button');
            this.showInviteDialog();
        }.bind(this));
        inviteBt.displayGroup = null;//ko bi below avatar
        inviteBt.setAnchorPoint(cc.p3(0.5,0.5));
        inviteBt.setPosition(cc.p2(this.contentSize.width/2, this.contentSize.height/2));
        this.addChild(inviteBt);

        var sitBt = MyHelper.createButton("khung_avatar.png",true , function () {
            cc.log('click sit button');
            thiz.showSitDialog();
        });
        sitBt.displayGroup = null;//ko bi below avatar
        sitBt.setAnchorPoint(cc.p3(0.5,0.5));
        sitBt.setPosition(cc.p2(this.contentSize.width/2, this.contentSize.height/2));
        this.addChild(sitBt);
        // sitBt.opacity = 0;
        sitBt.visible = false;

        var arrow = PIXI.Sprite.fromFrame("button/btn_muiten.png");
        arrow.setAnchorPoint(cc.p3(0.5,0.5));
        arrow.setPosition(cc.p2(sitBt.width/2, -sitBt.height/2-20));
        sitBt.addChild(arrow);//,1);
        var delay = cc.delayTime(0.2);
        var originArrow = cc.p(arrow.x, arrow.y);
        var repeat = cc.repeatForever(cc.sequence(delay, cc.moveTo(0.5, cc.p(originArrow.x, originArrow.y -10)), delay,cc.moveTo(0.5, cc.p(originArrow.x, originArrow.y))));
        arrow.runAction(repeat);


        //var richText = new PIXI.Text('Ngồi xuống', style);
        var lblSit = new cc.LabelTTF('Ngồi xuống', cc.res.font.Arial, 18,null, "#ffffff");
        lblSit.setAnchorPoint(cc.p3(0.5,0.5));
        lblSit.setPosition(cc.p2(sitBt.width/2, -sitBt.height/2+30));
        sitBt.addChild(lblSit);//,1);

        var infoNode = PIXI.Sprite.fromFrame("button/bg_username.png");
        infoNode.setAnchorPoint(cc.p3(.5,0));
        infoNode.setPosition(cc.p2(this.contentSize.width/2,this.contentSize.height -5));
        this.infoNode = infoNode;
        this.infoLayer.addChild(infoNode);

        if(cc.Global.gameId === Constant.GAME_ID.PHOM || cc.Global.gameId === Constant.GAME_ID.LIENG
            || cc.Global.gameId === Constant.GAME_ID.XITO || cc.Global.gameId === Constant.GAME_ID.POKER
            || cc.Global.gameId === Constant.GAME_ID.BACAY){
            this.resultPoint =  new ResultPoint();
            this.resultPoint.setPosition(cc.p2(this.contentSize.width/2 - this.resultPoint.bg.width/2,this.contentSize.height +42));//this.contentSize.height/2
            this.infoLayer.addChild(this.resultPoint);
        }
        var userLabel = new cc.LabelTTF("megabits", cc.res.font.Arial, 16, cc.size(this.infoNode.width,30), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);//cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "Player", cc.TEXT_ALIGNMENT_CENTER);
        userLabel.setPosition(cc.p2(infoNode.width/2, -infoNode.height/2));
        userLabel.setAnchorPoint(cc.p3(0.5, 0.5));
        this.infoNode.addChild(userLabel);//,1);

        // var goldLabel = cc.LabelOrange("1k");
        var goldLabel = new newui.LabelTTF("0", cc.res.font.Arial, 20, cc.size(this.contentSize.width,30), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);//cc.LabelTTF.create(cc.res.font.Roboto_Condensed, "1.000V", cc.TEXT_ALIGNMENT_CENTER);
        goldLabel.setFontFillColor(cc.color("#FFEB3B"));
        //goldLabel.setScale(0.8);
        //var goldLabel = new cc.LabelTTF("1k", cc.res.font.Roboto_Condensed, 18, cc.size(this.contentSize.width,30), cc.TEXT_ALIGNMENT_CENTER);//cc.LabelTTF.create(cc.res.font.Roboto_Condensed, "1.000V", cc.TEXT_ALIGNMENT_CENTER);
        //goldLabel.setColor(cc.color("#ffde00"));
        goldLabel.setAnchorPoint(cc.p3(.5,.5));
        goldLabel.setPosition(cc.p2(infoNode.width/2, 10));
        this.infoNode.addChild(goldLabel);//,1);

        this.chauRiaLbl = PIXI.Sprite.fromFrame("button/dangxem.png");
        this.chauRiaLbl.setAnchorPoint(cc.p3(.5,.5));
        this.chauRiaLbl.setPosition(cc.p2(this.contentSize.width/2, this.contentSize.height/2));
        this.infoLayer.addChild(this.chauRiaLbl);//,1);

        this.userLabel = userLabel;
        this.goldLabel = goldLabel;
        this.inviteBt = inviteBt;
        this.sitBt = sitBt;
        // this.avt = avt;

        var spriteChat = PIXI.Sprite.fromFrame("e_1.png");
        spriteChat.setAnchorPoint(cc.p3(0.5, 0.5));
        spriteChat.setPosition(cc.p2(this.contentSize.width/2, this.contentSize.height/2));
        this.infoLayer.addChild(spriteChat);//,10);
        this.spriteChat = spriteChat;
        this.spriteChat.opacity = 0;

        this.setEnable(true);

    },
    showTimeRemain: function(currentTime, maxTime){
        this.timer.showTimeRemain(currentTime, maxTime);
    },
    stopTimeRemain: function () {
        this.timer.stopTimeRemain();
    },
    hideCardEndGame: function(){
        if(this.cardListEndGame){
            //this.cardListEndGame.stopAllActions();
            this.cardListEndGame.removeAll();
        }
    },
    changeCardAndShow: function(faceCard, a, b){

    },
    showCardEndGame: function(cards, anim , _deckPoint){
        var scale =1;


        this.cardListEndGame.setContentSize(cc.size(cc.Global.GameView.width/4 -100, 90));
        var align = CardAlign.CENTER;
        if(this.sitId == 0){
            if(this.isMe){
                align = CardAlign.LEFT;
                this.cardListEndGame.setContentSize(cc.size(cc.Global.GameView.width - this.contentSize.width -50, 150));
                /*this.cardListEndGame.anchor.set(0, 0.5);
                this.cardListEndGame.position.set(this.contentSize.width + 10, this.contentSize.height/2 );*/
                this.cardListEndGame.setPosition(cc.p2(this.contentSize.width + 10, 0 ));
            }else{
                this.cardListEndGame.setContentSize(cc.size(cc.Global.GameView.width/4 -100, 90));
                /*this.cardListEndGame.anchor.set(0.5, 0.5);
                this.cardListEndGame.position.set(this.contentSize.width/2, this.contentSize.height/2 +20);*/
                this.cardListEndGame.setPosition(cc.p2(this.contentSize.width/2 - this.cardListEndGame.widthContainer/2, 10));
            }

        }else if(this.sitId == 1){
            /*this.cardListEndGame.anchor.set(1, 0);
            this.cardListEndGame.position.set(this.contentSize.width, this.contentSize.height +10);
    */
            align = CardAlign.RIGHT;
            this.cardListEndGame.setPosition(cc.p2(this.contentSize.width, -this.contentSize.height+ 40));
        }else if(this.sitId == 2){
            /*this.cardListEndGame.anchor.set(0.5, 1);
            this.cardListEndGame.position.set(this.contentSize.width/2, this.contentSize.height +10 );
    */
            //this.cardListEndGame.setContentSize(cc.size(cc.Global.GameView.width/4 -100, 90));
            align = CardAlign.CENTER;
            this.cardListEndGame.setPosition(cc.p2(this.contentSize.width/2 - this.cardListEndGame.widthContainer/2, -20));
        }else if(this.sitId == 3){

           /* this.cardListEndGame.anchor.set(0, 0);
            this.cardListEndGame.position.set(0, this.contentSize.height +10);*/
            align = CardAlign.LEFT;
            this.cardListEndGame.setPosition(cc.p2(0,-this.contentSize.height + 40));
        }
        if(cc.Global.gameId == Constant.GAME_ID.SAM){
            if(this.sitId == 3 ){
                /*this.cardListEndGame.anchor.set(0, 1);
                this.cardListEndGame.position.set(this.contentSize.width/2, this.contentSize.height+10 );
    */
                align = CardAlign.CENTER;
                this.cardListEndGame.setPosition(cc.p2(this.contentSize.width/2 - this.cardListEndGame.widthContainer/2, -20));
            }else if(this.sitId == 4){
                /*this.cardListEndGame.anchor.set(0, 0);
                this.cardListEndGame.position.set(0, this.contentSize.height +10);*/
                align = CardAlign.LEFT;
                this.cardListEndGame.setPosition(cc.p2(0, -this.contentSize.height + 20));
            }
        }
        var deckPoint = _deckPoint;
        //if(!_deckPoint) deckPoint = cc.p(cc.winSize.width/2  , cc.winSize.height/2 );
        if(!_deckPoint) this.cardListEndGame.deckPoint = cc.p(this.avt.x + this.avt.sizeW/2, this.avt.y + this.avt.sizeH/2 );
        else this.cardListEndGame.setDeckPoint(deckPoint);
        this.cardListEndGame.canTouch = false;
        //anim = false;
        this.cardListEndGame.resetOrigin();//de caculate lai size card
        this.cardListEndGame.dealCards(cards, anim, align);
    },
    isChauRia: function(){
        return this._isChauRia;
    },
    showChauRia: function(isShow){
        this._isChauRia = isShow;
        this.chauRiaLbl.visible = isShow;
    },
    showChatMessage: function (message){

    },
    setDataPlayer: function (data) {
        this.dataPlayer = data;
    },
    isRoomMaster: function () {
        return this.isMaster;
    },
    setIndex: function (index) {
        this.index = index;
    },
    setGold: function (gold) {
        this.goldLabel.setString(cc.Global.NumberFormat1(gold));
        this.gold = gold;
    },
    setSfsUid: function(sfsUid){
        this.sfsUid = sfsUid;
    },
    setUserLoginName: function(loginName){
        this.loginName = loginName;
    },
    setUid: function(uid){
        this.uid = uid;
    },
    setUsername: function (name) {
        this.username = name;
        if(name.length >10) name= name.substring(0, 10) + "...";
        this.userLabel.setString(name);
    },
    setEnable: function (enable) {
        if(enable){
            this.infoLayer.visible = true;
            this.inviteBt.visible = false;//false;
            this.showNgoiXuong(false);
        }
        else{
            this.username = "";
            this.infoLayer.visible = false;
            this.inviteBt.visible = true;
        }
    },
    showNgoiXuong: function(visible){
        this.sitBt.visible = visible;
        this.username = "";
        this.infoLayer.visible =!visible;
    },
    showInfoLayer: function(visible){
        this.infoLayer.visible =visible;
    },
    changeToSmallBg: function(meSitDown){
        this.showNgoiXuong(!meSitDown);
    },
    reset: function(){
        this._isChauRia = false;
        this.isMe = false;
        this.username = "";
        this.loginName ="";//ten dang nhap
        this.index = -1;//index postion tu serrver, vua la turn theo thu tu luon,
        //this.sitId = -1;// ko reset vi sitdID chi set 1 lan luk contructor gameChan
        this.uid ="";// === TTID
        this.sfsUid ="";// === userID smarfox
        this.gold = 0;
        this.winLoseSprite.visible = false;

        this.glowEff.stopAllActions();

        // if(this.glowEffAnimation){
        //     PIXI.actionManager.cancelAction(this.glowEffAnimation);
        //     this.glowEffAnimation = null;
        // }

        this.glowEff.visible = false;
        this.clearAnimMoney();
        //if(this.cardListEndGame)this.cardListEndGame.stopAllActions();
        if(this.cardListEndGame)this.cardListEndGame.removeAll();
        this.showBoLuot(false);
        this.setState(state_player.NOTHING);
        this.stateId = state_player.NOTHING;
        this.showBaoSam(false);
        this.showChauRia(false);
        if(this.resultPoint)this.resultPoint.showText(false);
    },
    resetEndGame: function(){
        this.winLoseSprite.visible = false;

        // if(this.glowEffAnimation){
        //     PIXI.actionManager.cancelAction(this.glowEffAnimation);
        //     this.glowEffAnimation = null;
        // }
        this.glowEff.stopAllActions();
        this.glowEff.visible = false;
        this.clearAnimMoney();
        this.showBoLuot(false);
        this.setState(state_player.NOTHING);
        this.showBaoSam(false);
        this.stopTimeRemain(false);
        if(this.resultPoint)this.resultPoint.showText(false);

        //if(this.cardListEndGame)this.cardListEndGame.stopAllActions();
        if(this.cardListEndGame)this.cardListEndGame.removeAll();
    },
    clearAnimMoney: function(){
        if(this.labelMoneyEff){
            this.labelMoneyEff.stopAllActions();

            //this.labelMoneyEff.stopAllActions();
            // PIXI.actionManager.cancelAction(this.labelEffectAnimation);
            this.labelMoneyEff.removeFromParent(false);
            // if( this.labelMoneyEff.parent) this.labelMoneyEff.parent.removeChild(this.labelMoneyEff);
            this.labelMoneyEff = null;
            // this.labelEffectAnimation= null;
        }
    },
    showBoLuot: function(isShow){
        //cc.log(this.username +"<==== > boluot "+isShow);
        var oldState = this.boLuotSprite.visible;
        this.boLuotSprite.stopAllActions();
        // if(this.boLuotSpriteAnim){
        //     PIXI.actionManager.cancelAction(this.boLuotSpriteAnim);
        //     this.boLuotSpriteAnim =null;
        // }
        var thiz = this;
        if(isShow){
            this.boLuotSprite.visible = isShow;
            thiz.boLuotSprite.alpha = 1;
            var delay = cc.delayTime(1);
            var repeat = cc.repeatForever(cc.sequence(delay, cc.fadeOut(2.0), delay,cc.fadeIn(2.0)));
            this.boLuotSprite.runAction(repeat);
            // this.boLuotSpriteAnim = PIXI.actionManager.runAction(this.boLuotSprite, repeat);
        }
        if(oldState && !isShow){

            var fun = function(){
                thiz.boLuotSprite.visible = false;
            };
            thiz.boLuotSprite.alpha = 1;



            var cb = new cc.CallFunc(fun);
            var repeat = cc.sequence( cc.fadeOut(1.0), cb);
            // this.boLuotSpriteAnim = PIXI.actionManager.runAction(this.boLuotSprite, repeat);
            this.boLuotSprite.runAction(repeat);
            //cc.log("hide bo luot ----");
        }
    },
    showBaoSam: function(isShow){
        var thiz = this;
        this.baoSamSprite.visible = isShow;
    },
    getStatePlayer: function(){
        return this.stateId;
    },
    setStateChan: function (stateId) {
        if(state_player.NOTHING === stateId){
            this.state.visible = false;
        }
        else this.state.visible = true;

        this.state.displayGroup = MyPixi.gamePlayerLayer;

        if(state_player_chan.CHON_CAI === stateId) this.state.setSpriteFrame("game/cc.png");
        else if(state_player_chan.BAT_BAO === stateId) this.state.setSpriteFrame("game/bb.png");
        //else if(state_player_chan.U === stateId) this.state.texture = PIXI.Texture.fromFrame("game/xem.png");
        else if(state_player_chan.CHON_NOC === stateId) this.state.setSpriteFrame("game/cn.png");
        else if(state_player_chan.READY === stateId) this.state.setSpriteFrame("game/ss.png");

        this.stateId = stateId;
    },
    setStateLieng: function (stateId) {
        if(state_player.NOTHING === stateId){
            this.state.visible = false;
            this.readyChb.visible = false;
            this.showKick(false);
        }
        else this.state.visible = true;


        if(state_lieng.UP_BAI === stateId) this.state.setSpriteFrame("up.png");
        else if(state_lieng.THEO === stateId) this.state.setSpriteFrame("theo.png");
        else if(state_lieng.XEM === stateId) this.state.setSpriteFrame("xem.png");
        else if(state_lieng.TO === stateId) this.state.setSpriteFrame("to.png");
        else if(state_lieng.XA_LANG === stateId) this.state.setSpriteFrame("xalang.png");

        this.stateId = stateId;
    },
    setStateBinhResult: function (stateId) {
        cc.log("wtffff setStateBinhResult "+stateId);
        if(state_binh.NOTHING === stateId){
            this.state.visible = false;
            this.readyChb.visible = false;
            this.showKick(false);
        }
        else this.state.visible = true;


        if(state_binh.BINH_LUNG === stateId) this.state.setSpriteFrame("binhlung.png");
        else if(state_binh.BA_SANH === stateId) this.state.setSpriteFrame("3sanh.png");
        else if(state_binh.BA_THUNG === stateId) this.state.setSpriteFrame("3thung.png");
        else if(state_binh.SAU_DOI === stateId) this.state.setSpriteFrame("6doi.png");
        else if(state_binh.NAM_DOI_1_XAM === stateId) this.state.setSpriteFrame("5doi1xam.png");
        else if(state_binh.DONG_HOA === stateId) this.state.setSpriteFrame("donghoa.png");
        else if(state_binh.DONG_HOA_1 === stateId) this.state.setSpriteFrame("donghoa.png");
        else if(state_binh.SANH_RONG === stateId) this.state.setSpriteFrame("sanhrong.png");
        else if(state_binh.SANH_RONG_DONG_HOA === stateId) this.state.setSpriteFrame("sanhrongdonghoa.png");
        else if(state_binh.THANG_SAP_HAM === stateId) this.state.setSpriteFrame("thangsapham.png");
        else if(state_binh.THANG_SAP_LANG === stateId) this.state.setSpriteFrame("thangsaplang.png");
        else if(state_binh.THUA_SAP_HAM === stateId) this.state.setSpriteFrame("thuasapham.png");
        else if(state_binh.THUA_SAP_LANG === stateId) this.state.setSpriteFrame("thuasaplang.png");

        this.stateId = stateId;
    },
    setState: function (stateId) {
        if(state_player.READY === stateId){
            this.readyChb.visible = true;
            return;
        }
        if(state_player.BO_LUOT === stateId){
            this.showBoLuot(true);
            return;
        }else if(state_player.BAO_SAM === stateId){
            this.showBaoSam(true);
            return;
        }

        this.state.stopAllActions();

        // if(this.stateAnim){
        //     PIXI.actionManager.cancelAction(this.stateAnim);
        //     this.stateAnim = null;
        // }

        this.state.setPosition(cc.p2(this.contentSize.width/2, this.contentSize.height/2));//reset pos
        if(state_player.NOTHING === stateId){
            this.state.visible = false;
            this.readyChb.visible = false;
            this.showKick(false);
        }else this.state.visible = true;

        if(state_player.HUY_BAO === stateId) this.state.setSpriteFrame("huybao.png");
        else if(state_player.MOM === stateId) this.state.setSpriteFrame("mom.png");
        else if(state_player.DANG_XEM === stateId){
            this.state.setSpriteFrame("button/dangxem.png");
            this.readyChb.visible = false;
        }
        else if(state_player.AN_CAY_CHOT === stateId){
            this.state.setSpriteFrame("ancaychot.png");
            if((this.sitId == 0 && this.isMe) || this.sitId == 3)  this.state.x =this.contentSize.width/2 +50;
            else if(this.sitId == 1 )  this.state.x =this.contentSize.width/2 -50;
        }
        else if(state_player.DANG_XEP_BINH === stateId) this.state.setSpriteFrame("dangxep.png");
        else if(state_player.XEP_XONG_BINH === stateId) this.state.setSpriteFrame("xepxong.png");

        if(state_player.BO_LUOT === stateId){
            var delay = cc.delayTime(1);
            var repeat = cc.repeatForever(cc.sequence(delay, cc.fadeOut(2.0), delay,cc.fadeIn(2.0)));
            this.state.runAction(repeat);
            // this.stateAnim = PIXI.actionManager.runAction(this.state, repeat);
        }
        this.stateId = stateId;

    },
    setAvatar: function (avatar) {
        // this.avt.setAvatar(avatar);
    },
    showEmoticon: function (emo) {
        this.spriteChat.stopAllActions();
        // if(this.spriteChatAnimation){
        //     PIXI.actionManager.cancelAction(this.spriteChatAnimation);
        //     this.spriteChatAnimation = null;
        // }
        this.spriteChat.setSpriteFrame(""+emo+".png");
        this.spriteChat.opacity = 255;
        var action = cc.sequence( cc.delayTime(2), cc.fadeOut(2) ) ;
        this.spriteChat.runAction(action);
        // this.spriteChatAnimation = PIXI.actionManager.runAction(this.spriteChat, action);
    },
    showGameNotice: function (text) {
        cc.log("pending..... GamePlayer::showGameNotice");
    },
    showSitDialog: function () {
        if(this.onSitdown ) this.onSitdown();
    },
    showInviteDialog: function () {
        // cc.log('Đang tải danh sách mời');
        var sendObj = [
            command.ZonePluginMessage,
            Constant.CONSTANT.ZONE_NAME,
            'channelPlugin',
            {'cmd':Constant.CMD_RESULT.LIST_INVITE,
                'rid':LobbyClient.getInstance().getCurrentRoomId()
            }
        ];
        LobbyClient.getInstance().send(sendObj);
        LoadingDialog.getInstance().show("Đang tải danh sách mời");
    },
    setMasterRoom: function (isMaster) {
        this.isMaster = isMaster;
        this.roomMaster.visible =isMaster;
    },
    showKick: function(isShow){
        this.kickBt.visible =isShow;
    },
    showInfoDialog: function () {
        cc.log('timh năng đang phát triển');
        // MH.createPopup({
        //     title:'',
        //     content:[
        //         {
        //             tag:'p',
        //             text:"tinh năng đang phát triển",
        //         }
        //     ]
        // });
    },
    showChiExchange: function(chiEarn, isSapHam, isSapLang){
        this.runChangeGoldEffect(chiEarn, null, null, true, " Chi");
        if(chiEarn === 0 ){
            //this.stateSHamSLang.show(false);
            this.setStateBinhResult(state_card.NOTHING);
            return;
        }
        if(isSapHam){
                if(chiEarn >= 0)this.setStateBinhResult(state_binh.THANG_SAP_HAM);
                else if(chiEarn < 0)this.setStateBinhResult(state_binh.THUA_SAP_HAM);

        }else if(isSapLang){
            if(chiEarn >= 0)this.setStateBinhResult(state_binh.THANG_SAP_LANG);
            else if(chiEarn < 0)this.setStateBinhResult(state_binh.THUA_SAP_LANG);
        }
    },
    showAllChi: function(chiEarn, moneyEarn, totalMoney, ignoreShowAll){
        //var chiEarn, moneyEarn, totalMoney;
        //chiEarn = data[0];
        //moneyEarn = data[1];
        cc.log("showAllChi "+chiEarn);
        var pos =cc.p( this.avt.x, this.avt.y);
        if(this.sitId == 0){
            if(this.isMe){
                pos = cc.p(pos.x,this.avt.y-120);

            }else{
                pos = cc.p(pos.x,this.avt.y-120);
            }
        }else if(this.sitId == 1){
            pos = cc.p(pos.x-200,this.avt.y);
        }else if(this.sitId == 2){
            pos = cc.p(pos.x,80);

        }else if(this.sitId == 3){
            pos = cc.p(pos.x+200,this.avt.y);
        }


        this.runChangeGoldEffect(chiEarn, null, pos, true, " Chi");
        if(!ignoreShowAll && this.cardList) this.cardList.revealAll(true); // call den ham revealAll cua MauBinhCardList
    },
    showResultForChi: function(chiId, delayTime, chiEarn){
        if(!chiEarn) chiEarn =0
        this.runChangeGoldEffect(chiEarn, null, null, true, " Chi");
    },
    reduceMoney: function (gold) {
        var gold = this.gold + gold;
        this.setTotalGoldWithEffect(gold);
    },
    setTotalGoldWithEffect: function (gold) {
        if(this.gold == gold) return;
        var oldGold = this.gold;
        this.gold = gold;

        this.goldLabel.countTo(gold, 1);

        // MH.countUp(this.goldLabel, oldGold, gold, 1);


        // if(this.timerGoldEffect){
        //     this.timerGoldEffect.stop();
        //     this.timerGoldEffect.remove();
        //     this.timerGoldEffect = null;
        // }

        //run effect here - need stop action gold before
        /*var effect = new quyetnd.ActionNumber(1,this.gold );
        this.goldLabel.stopAllActions();
        this.goldLabel.runAction(effect);*/

        // this.timerGoldEffect =new hiepnh.ActionNumber(1,this.gold, oldGold, this.goldLabel);
    },
    runChangeGoldEffect: function (gold, fontList, _startPos, igNoreAnim, suffix, anchor) {
        var goldNumber = gold;
        if(typeof gold === "string"){
            goldNumber = parseInt(gold);
        }
        if(!fontList){
            fontList = [cc.res.font.font_so_xanh, cc.res.font.font_so_do];
        }
        var strGold = cc.Global.NumberFormat1(Math.abs(goldNumber));
        if(Math.abs(goldNumber) >= 1000) strGold = cc.Global.NumberFormat2(Math.abs(goldNumber),2);


        if(goldNumber >= 0){
            strGold = "+" + strGold;
        }
        else{
            strGold = "-" + strGold;
        }

        if(suffix) strGold+=suffix;
        this.clearAnimMoney();

        /*var labelEffect = cc.Label.createWithBMFont(fontList[0], strGold);//new cc.LabelTTF(strGold, cc.res.font.UTM_AZUKI, 50 );// cc.Label.createWithBMFont(cc.res.font.UTM_AZUKI, strGold);
        if(gold >=0){
            //labelEffect.setColor(cc.color("#ffde00"));
        }
        else{
            labelEffect = cc.Label.createWithBMFont(fontList[1], strGold);
            //labelEffect.setColor(cc.color("#ff0000"));
        }*/

        // var labelEffect  = cc.LabelBmtFont(strGold,"48px font_xanh");//cc.LabelTTF(strGold, cc.res.font.Arial, 25, null, "#ffde00");
        //this.labelMoneyEff =labelEffect;// tranh conflict voi mau binh khi so kq co qua nhieu effect money show
        var labelEffect;
        if(gold >=0){
            labelEffect = new cc.LabelBMFont(strGold, fontList[0]+".fnt", cc.TEXT_ALIGNMENT_LEFT);
        }
        else{
            labelEffect = new cc.LabelBMFont(strGold, fontList[1]+".fnt", cc.TEXT_ALIGNMENT_LEFT);
        }
        if(anchor) labelEffect.setAnchorPoint(cc.p3(anchor.x, anchor.y));

        labelEffect.displayGroup = MyPixi.animationLayer;

        this.labelMoneyEff =labelEffect;
        var contentSize = this.contentSize;
        var startPos = _startPos ? _startPos : cc.p(this.avt.x +this.avt.width/2, this.avt.y +this.avt.height/2 -50 ) ;//this.goldLabel.getPosition();
        if(this.sitId === 1 || (this.sitId === 2 && cc.Global.gameId == Constant.GAME_ID.XOCDIA)){
            labelEffect.textAlign = cc.TEXT_ALIGNMENT_LEFT;
            startPos.x = startPos.x +  contentSize.width/2 - labelEffect.width;
            /*labelEffect.anchor.set(1,0.5);
            //labelEffect.setAlignment(cc.TEXT_ALIGNMENT_RIGHT);
            labelEffect.style.align = "right";
            labelEffect.position.set(startPos.x + contentSize.width/2, startPos.y);*/
        }else if(this.sitId === 3){
            labelEffect.textAlign = cc.TEXT_ALIGNMENT_LEFT;
            startPos.x = startPos.x -  contentSize.width/2+ labelEffect.width/2;
            /*labelEffect.anchor.set(0,0.5);
            labelEffect.style.align = "left";
            //labelEffect.setAlignment(cc.TEXT_ALIGNMENT_LEFT);
            labelEffect.position.set(startPos.x - contentSize.width/2, startPos.y);*/
        }
        labelEffect.setPosition(cc.p2(startPos.x ,startPos.y));

        this.infoLayer.addChild(labelEffect);//, 10);

        if(!igNoreAnim){
            var effectDuration = 4.0;
            var moveAction = new cc.MoveBy(effectDuration, cc.p(0.0, -80.0));
            var finishedAction = new cc.CallFunc(function () {
                labelEffect.removeFromParent(true);
                // if(labelEffect.parent) labelEffect.parent.removeChild(labelEffect);
            });
            labelEffect.runAction( new cc.Sequence(moveAction, finishedAction));
            // this.labelEffectAnimation = PIXI.actionManager.runAction(labelEffect,  cc.sequence(moveAction, finishedAction));
        }else{
            var effectDuration = 4.0;
            var moveAction = cc.delayTime(effectDuration);
            var finishedAction = new cc.CallFunc(function () {
                labelEffect.removeFromParent(true);
                // if(labelEffect.parent) labelEffect.parent.removeChild(labelEffect);
            });

            // this.labelEffectAnimation = PIXI.actionManager.runAction(labelEffect,  cc.sequence(moveAction, finishedAction));
            labelEffect.runAction( new cc.Sequence(moveAction, finishedAction));
        }

        return labelEffect;
    },
    showEffectEndGame: function (gold, fontList, _startPos, igNoreAnim) {
        var goldNumber = gold;
        if(typeof gold === "string"){
            goldNumber = parseInt(gold);
        }
        if(!fontList){
            fontList = [cc.res.font.font_so_xanh, cc.res.font.font_so_do];
        }
        var strGold = cc.Global.NumberFormat1(Math.abs(goldNumber));

        if(goldNumber >= 0){
            strGold = "+" + strGold;

        }
        else{
            strGold = "-" + strGold;

        }
        this.clearAnimMoney();

        //var labelEffect = cc.Label.createWithBMFont(fontList[0], strGold);
        var labelEffect = new cc.LabelTTF(strGold, cc.res.font.Arial, 25, null, "#ffde00");
        //this.labelMoneyEff =labelEffect;// tranh conflict voi mau binh khi so kq co qua nhieu effect money show
        if(gold >=0){
            //labelEffect.setColor(cc.color("#ffde00"));
        }
        else{
            //labelEffect = cc.Label.createWithBMFont(fontList[1], strGold);
            //labelEffect.setColor(cc.color("#ff0000"));
            labelEffect = new cc.LabelTTF(strGold, cc.res.font.Arial, 25, null, "#ff0000");
        }
        var contentSize = this.contentSize;
        var startPos = _startPos ? _startPos : cc.p(this.avt.x, this.avt.y);//this.goldLabel.getPosition();
        labelEffect.setPosition(startPos);
        if(this.sitId === 1){
            labelEffect.setAnchorPoint(cc.p3(1,0.5));
            //labelEffect.setAlignment(cc.TEXT_ALIGNMENT_RIGHT);
            labelEffect.textAlign = cc.TEXT_ALIGNMENT_RIGHT;
            labelEffect.setPosition(cc.p2(startPos.x + contentSize.width/2, startPos.y));
        }else if(this.sitId === 3){
            labelEffect.setAnchorPoint(cc.p3(0,0.5));
            //labelEffect.setAlignment(cc.TEXT_ALIGNMENT_LEFT);
            labelEffect.textAlign = cc.TEXT_ALIGNMENT_LEFT;
            labelEffect.setPosition(cc.p2(startPos.x - contentSize.width/2, startPos.y));
        }

        this.infoLayer.addChild(labelEffect);//, 10);

        if(!igNoreAnim){
            var effectDuration = 2.0;
            var moveAction = cc.moveBy(effectDuration, cc.p(0.0, 80.0));
            var finishedAction = new cc.CallFunc(function () {
                labelEffect.removeFromParent(true);
                // if(labelEffect.parent) labelEffect.parent.removeChild(labelEffect);
            });
            labelEffect.runAction(cc.sequence(moveAction, finishedAction));
            // PIXI.actionManager.runAction( labelEffect,  cc.sequence(moveAction, finishedAction));
        }else{
            var effectDuration = 2.0;
            var moveAction = cc.delayTime(effectDuration);
            var finishedAction = new cc.CallFunc(function () {
                labelEffect.removeFromParent(true);
                // if(labelEffect.parent) labelEffect.parent.removeChild(labelEffect);
            });
            labelEffect.runAction(cc.sequence(moveAction, finishedAction));

            // PIXI.actionManager.runAction( labelEffect, cc.sequence(moveAction, finishedAction));
        }
    },
    showResultMauBinh: function (totalMoney, moneyChange){
        this.clearAnimMoney();
        //this.hideAllChi();//=> showResultMauBinh in gameMaiBinh roi
        //this.getComponent('Actor').showState(false);
        this.setState(state_binh.NOTHING);
        //this.stateSHamSLang.show(false);
        //this.lblResultMB.node.visible=false;//=> ko can vi dung runGoldEff no tu xoa
        this.winLoseSprite.x =this.avt.x + this.avt.sizeW/2;
        this.winLoseSprite.visible = true;
        this.glowEff.visible = true;
        this.glowEff.x =(this.winLoseSprite.x);
        // if(this.glowEffAnimation){
        //     PIXI.actionManager.cancelAction(this.glowEffAnimation);
        //     this.glowEffAnimation = null;
        // }
        if( this.glowEff ) this.glowEff.stopAllActions();
        var posX = this.avt.x+ this.avt.sizeW/2;
        var posY = this.avt.y+ this.avt.sizeH/2;

        if(this.sitId == 0){
            if(this.isMe){
                this.runChangeGoldEffect(moneyChange, null, cc.p(posX,posY -120), true );
               
            }else{
                this.runChangeGoldEffect(moneyChange, null,  cc.p(posX,posY-120), true );
            }
        }else if(this.sitId == 1){
            this.runChangeGoldEffect(moneyChange, null, cc.p(posX-200,posY), true );
        }else if(this.sitId == 2){
            this.runChangeGoldEffect(moneyChange, null, cc.p(this.avt.x, this.avt.sizeH), true );
            //cc.log("wtf");
        }else if(this.sitId == 3){
            this.runChangeGoldEffect(moneyChange, null, cc.p(posX+200,posY), true );
        }

        this.runEffectGlow();
        if(moneyChange > 0){
            this.winLoseSprite.setSpriteFrame("glow2.png");
            this.winLoseSprite.setSpriteFrame("thang.png");
        }else if(moneyChange < 0){
            this.winLoseSprite.setSpriteFrame("glow1.png");
            this.winLoseSprite.setSpriteFrame("thua.png");
        }else{
            this.winLoseSprite.setSpriteFrame("glow2.png");
            this.winLoseSprite.setSpriteFrame("hoa.png");

        }
        this.gold = totalMoney;
        this.setTotalGoldWithEffect(totalMoney);
    },
    runEffectGlow: function(){
        var rotate = cc.rotateBy(4, 720);
        var repeat = cc.repeatForever(rotate);
        this.glowEff.runAction(repeat);
        // this.glowEffAnimation =  PIXI.actionManager.runAction(this.glowEff, repeat);
    },
    showResultPhom: function (totalMoney, moneyChange,sitId,point, wHr){
        if(!wHr) wHr = -1;
        // cc.log("-----whr"+wHr );

        //this.animLayer.visible = true;
        this.setState(state_player.NOTHING);//HIDE AN CHOT IF HAVE
        var posX = this.avt.x;
        this.winLoseSprite.x =this.avt.x + this.avt.sizeW/2;
        this.glowEff.visible = true;
        this.glowEff.x=this.winLoseSprite.x;

        // if(this.glowEffAnimation){
        //     PIXI.actionManager.cancelAction(this.glowEffAnimation);
        //     this.glowEffAnimation = null;
        // }
        this.glowEff.stopAllActions();
        this.winLoseSprite.visible = true;
        if(sitId == 0) {
            if (this.isMe) {
                this.runChangeGoldEffect(moneyChange, null, cc.p(600, this.avt.y-80), true);
                this.winLoseSprite.x =(600+ this.winLoseSprite.width/2);
                this.glowEff.x =(600 + this.glowEff.width/2);
            } else {
                this.runChangeGoldEffect(moneyChange, null, cc.p(posX, this.avt.y-50), true);
            }

        }else if(sitId == 2){
            this.runChangeGoldEffect(moneyChange, null, cc.p(posX ,this.avt.y+80), true );
        }else{
            //this.runChangeGoldEffect(moneyChange, null, cc.p(posX,-90), true );
            this.runChangeGoldEffect(moneyChange, null, cc.p(posX + this.avt.sizeW/2,this.avt.y-35), true );
        }

        this.winLoseSprite.setSpriteFrame(finishTypePhom[wHr]+".png")  ;

        if( (wHr >=6 && wHr <=11) || wHr ===13 ){
            //u - uden- u den tron-nhat-xao khan,...
            this.glowEff.setSpriteFrame("glow2.png");
        }else{
            this.glowEff.setSpriteFrame("glow1.png");
        }

        if(point>0 && this.resultPoint){
            //co then null neu co player up bai
            point = point + " Điểm";
            if(sitId != 2 ) this.resultPoint.y = -(this.contentSize.height +42 );
            else this.resultPoint.y = -(this.contentSize.height +25);
            this.resultPoint.showText(true, point);


        }

        if(moneyChange > 0){
            this.glowEff.setSpriteFrame("glow2.png");
            this.runEffectGlow();
        }else if(moneyChange < 0){
            this.glowEff.setSpriteFrame("glow1.png");
        }else{
            this.glowEff.setSpriteFrame("glow2.png");

            //1 la none
            if(wHr === 1) this.winLoseSprite.setSpriteFrame("hoa.png");
            // >5 la mon hoac u, u den, u tron`,..
            if(wHr >=5 && wHr !== 11 && this.resultPoint) this.resultPoint.showText(false, point);

        }
        this.gold = totalMoney;
        this.setTotalGoldWithEffect(totalMoney);
    },
    moveAndShowAllOponentCard: function(){
        if(this.cardList) this.cardList.moveAndShowAllOponentCard();
    },
    showResultLieng: function (totalMoney, moneyChange, pointResult, isUp, isWin){
        //this.getComponent('Actor').showState(false);
        //this.lblResultMB.node.visible=false;
        // cc.log(`showResult anchor= ${self.anchorId} up =${isUp} moneyChange ${moneyChange}`);

        if(!isUp){
            this.setState(state_player.NOTHING);
            this.moveAndShowAllOponentCard();
            if(pointResult>=0){
                //co then null neu co player up bai
                if(pointResult <=9) pointResult = pointResult+ " Điểm";
                else if(pointResult === 10) pointResult = "Bộ Đội";
                else if(pointResult === 11) pointResult = "Liêng";
                else if(pointResult === 12) pointResult = "Sáp";
                //if(this.anchorId === 0 || this.anchorId === 1 || this.anchorId === 8) this.lblResultPoint.node.y = (-90);
                this.resultPoint.showText(true, pointResult);
            }

        }

        var posX = this.avt.x;
        var posY = this.avt.y;
        this.winLoseSprite.x =(this.avt.x+ this.avt.sizeW/2);
        this.glowEff.visible = false;
        this.glowEff.x =(this.winLoseSprite.x);
        // if(this.glowEffAnimation){
        //     PIXI.actionManager.cancelAction(this.glowEffAnimation);
        //     this.glowEffAnimation = null;
        // }
        this.glowEff.stopAllActions();
        this.winLoseSprite.visible = false;
        var heighAvatar = this.avt.height;
        if(moneyChange !==0){
            if(this.sitId == 0 || this.sitId == 1 ||this.sitId == 8) {
                if (this.isMe) {
                    this.runChangeGoldEffect(moneyChange, null, cc.p(posX, this.avt.y -70), true);
                } else {
                    this.runChangeGoldEffect(moneyChange, null, cc.p(posX, this.avt.y -70), true);
                }


            }else  if(this.sitId == 2 || this.sitId === 3) {
                this.runChangeGoldEffect(moneyChange, null, cc.p(posX -200,this.avt.y+ heighAvatar/2), true );
            }else  if(this.sitId == 4 || this.sitId === 5) {
                this.runChangeGoldEffect(moneyChange, null, cc.p(posX ,this.avt.y +200), true );
            }else  if(this.sitId == 6 || this.sitId === 7) {
                this.runChangeGoldEffect(moneyChange, null, cc.p(posX +200,this.avt.y+ heighAvatar/2), true );
            }
        }

        if(moneyChange > 0){
            this.glowEff.visible = true;
            this.glowEff.setSpriteFrame("glow2.png");
            this.winLoseSprite.setSpriteFrame("thang.png");

            this.runEffectGlow();
            this.winLoseSprite.visible = true;

        }else if(moneyChange < 0){
            // if(this.glowEffAnimation){
            //     PIXI.actionManager.cancelAction(this.glowEffAnimation);
            //     this.glowEffAnimation = null;
            // }
            this.glowEff.stopAllActions();
            this.glowEff.setSpriteFrame("glow1.png");
            this.winLoseSprite.setSpriteFrame("thua.png");
            if(isUp) this.winLoseSprite.visible = false;
            else this.winLoseSprite.visible = true;

        }

        if(moneyChange > 0 || !isUp){
            if(this.state) this.setState(state_player.NOTHING);
        }
        else if(isUp) this.setStateLieng(state_lieng.UP_BAI);


        this.setTotalGoldWithEffect(totalMoney);
    },
    showResultXiTo: function (totalMoney, moneyChange, pointResult, isUp, isWin){
        //this.getComponent('Actor').showState(false);
        //this.lblResultMB.node.visible=false;
        // cc.log(`showResult anchor= ${self.anchorId} up =${isUp} moneyChange ${moneyChange}`);

        if(!isUp){
            this.setState(state_player.NOTHING);
            this.cardList.revealAll(true);
            if(pointResult>=0){
                this.resultPoint.showText(true, resultXiTo[pointResult]);
            }

        }

        var posX = this.avt.x;
        var posY = this.avt.y;
        this.winLoseSprite.x =(this.avt.x+ this.avt.sizeW/2);
        this.glowEff.visible = false;
        this.glowEff.x =(this.winLoseSprite.x);
        // if(this.glowEffAnimation){
        //     PIXI.actionManager.cancelAction(this.glowEffAnimation);
        //     this.glowEffAnimation = null;
        // }
        this.glowEff.stopAllActions();
        this.winLoseSprite.visible = false;
        var heighAvatar = this.avt.height;
        if(moneyChange !==0){
            if(this.sitId == 0) {
                if (this.isMe) {
                    this.runChangeGoldEffect(moneyChange, null, cc.p(posX+200, posY -70 ), true);
                } else {
                    this.runChangeGoldEffect(moneyChange, null, cc.p(posX+200, posY -70), true);
                }


            }else  if(this.sitId == 1 || this.sitId === 2) {
                this.runChangeGoldEffect(moneyChange, null, cc.p(posX -200,this.avt.y -75), true );
            }else  if(this.sitId == 3 || this.sitId === 4) {
                this.runChangeGoldEffect(moneyChange, null, cc.p(posX +200,this.avt.y -75), true );
            }
        }

        if(moneyChange > 0 && isWin){
            this.glowEff.visible = true;
            this.glowEff.setSpriteFrame("glow2.png");
            this.winLoseSprite.setSpriteFrame("thang.png");

            this.runEffectGlow();
            this.winLoseSprite.visible = true;

        }else{
            // if(this.glowEffAnimation){
            //     PIXI.actionManager.cancelAction(this.glowEffAnimation);
            //     this.glowEffAnimation = null;
            // }
            this.glowEff.stopAllActions();
            this.glowEff.setSpriteFrame("glow1.png");
            this.winLoseSprite.setSpriteFrame("thua.png");
            if(isUp) this.winLoseSprite.visible = false;
            else this.winLoseSprite.visible = true;

        }

        if(moneyChange > 0 || !isUp){
            if(this.state) this.setState(state_player.NOTHING);
        }
        else if(isUp) this.setStateLieng(state_lieng.UP_BAI);


        this.setTotalGoldWithEffect(totalMoney);
    },
    showResultPoker: function (totalMoney, moneyChange, pointResult, isUp, isWin, cardEndGame, pokerHand){
        if(!isUp){
           // this.setState(state_player.NOTHING);
            if(cardEndGame && cardEndGame.length > 0){
                this.cardList.revealAll(true);
                this.cardList.showOrrangeEffect(pokerHand);
                //this.moveAndShowAllOponentCard(isWin, pokerHand);
                if(pointResult>=0){
                    this.resultPoint.showText(true, resultPoker[pointResult]);
                }

            }


        }

        var posX = this.avt.x+ this.avt.sizeW/2;
        var posY = this.avt.y+ this.avt.sizeH/2;
        this.winLoseSprite.x =(this.avt.x+ this.avt.sizeW/2);
        this.glowEff.visible = false;
        this.glowEff.x =(this.winLoseSprite.x);
        // if(this.glowEffAnimation){
        //     PIXI.actionManager.cancelAction(this.glowEffAnimation);
        //     this.glowEffAnimation = null;
        // }
        this.glowEff.stopAllActions();
        this.winLoseSprite.visible = false;
        var heighAvatar = this.avt.height;
        var anchor = cc.p(.5,.5);
        if(moneyChange !==0){
            if(this.sitId == 0) {
                if (this.isMe) {
                    this.runChangeGoldEffect(moneyChange, null, cc.p(posX, posY -120 ), true, false, anchor);
                } else {
                    this.runChangeGoldEffect(moneyChange, null, cc.p(posX, posY -120), true, false, anchor);
                }

            }else  if(this.sitId == 1 || this.sitId === 8) {
                this.runChangeGoldEffect(moneyChange, null, cc.p(posX, posY -120 ), true, false, anchor);
            }else  if(this.sitId == 2 || this.sitId === 3) {
                this.runChangeGoldEffect(moneyChange, null, cc.p(posX -150,this.avt.y - 30), true, false, anchor );
            }else  if(this.sitId == 4 || this.sitId === 5) {
                this.runChangeGoldEffect(moneyChange, null, cc.p(posX ,this.avt.y +120), true, false, anchor );
            }else  if(this.sitId == 6 || this.sitId === 7) {
                this.runChangeGoldEffect(moneyChange, null, cc.p(posX +150,this.avt.y -30 ), true, false, anchor );
            }
        }
        if(moneyChange > 0 && isWin){
            this.glowEff.visible = true;
            this.glowEff.setSpriteFrame("glow2.png");
            this.winLoseSprite.setSpriteFrame("thang.png");

            this.runEffectGlow();
            this.winLoseSprite.visible = true;
        }else if(moneyChange>0 && !isWin){
            // hoa` => cong lai tien cuoc luk start game
            //ko show thang, cung ko show thua
            // if(this.glowEffAnimation){
            //     PIXI.actionManager.cancelAction(this.glowEffAnimation);
            //     this.glowEffAnimation = null;
            // }
            this.glowEff.stopAllActions();
        }else{
            // if(this.glowEffAnimation){
            //     PIXI.actionManager.cancelAction(this.glowEffAnimation);
            //     this.glowEffAnimation = null;
            // }
            this.glowEff.stopAllActions();
            this.glowEff.setSpriteFrame("glow1.png");
            this.winLoseSprite.setSpriteFrame("thua.png");
            if(isUp || !cardEndGame.length) this.winLoseSprite.visible = false;
            else this.winLoseSprite.visible = true;

        }

      /*  if(moneyChange > 0 || !isUp){
            if(this.state) this.setState(state_player.NOTHING);
        }
        else if(isUp) this.setStateLieng(state_lieng.UP_BAI);*/
        if((!cardEndGame || !cardEndGame.length)  && !isWin) this.setStateLieng(state_lieng.UP_BAI);
        this.setTotalGoldWithEffect(totalMoney);
    },
    showResultXocDia: function (totalMoney, moneyChange, timeDelay){
        var pos = cc.p(this.avt.x +this.avt.width/2,this.avt.y +this.avt.height/2) ;
        //this.glowEff.position.set(pos);
        this.runChangeGoldEffect(moneyChange, null, cc.p(pos.x, pos.y), true);
        /* if(this.sitId === 1  || this.sitId === 2 ){
         this.runChangeGoldEffect(moneyChange, null, cc.p(-100, 0), true);
         }else if(this.sitId >= 3 && this.sitId < 7){
         this.runChangeGoldEffect(moneyChange, null, cc.p(0, -80), true);
         }else if(this.sitId === 7 || this.sitId === 8){
         this.runChangeGoldEffect(moneyChange, null, cc.p(100, 0), true);
         }else{
         this.runChangeGoldEffect(moneyChange, null, cc.p(pos.x, pos.y), true);
         }*/
        //tien con lai sau khi bi tru`
        if(timeDelay ===0){
            this.goldLabel.stopAllActions();
            // if(this.timerGoldEffect){
            //     this.timerGoldEffect.stop();
            //     this.timerGoldEffect.remove();
            //     this.timerGoldEffect = null;
            // }
            this.gold = totalMoney;
            this.goldLabel.string = cc.Global.NumberFormat1(totalMoney);
        }else{
            this.setTotalGoldWithEffect(totalMoney);
        }
    },
    showResult: function (isWin, totalMoney, moneyChange,sitId,  wHr, isCong, samLoseType){
        if(!wHr) wHr = -1;
        if(!isCong) isCong = false;
        if(!samLoseType) samLoseType = -1;
        cc.log("-----whr"+wHr + "--"+isCong+ "--"+samLoseType);
        if(samLoseType ===0 && moneyChange > 0) isWin = true;

        if( moneyChange > 0) isWin = true;
        this.setState(state_player.NOTHING);//
        this.showBaoSam(false);
        var visibleSize = cc.Global.GameView;
        var posX = this.avt.x;
        this.winLoseSprite.x =(this.avt.x + this.avt.sizeW/2);
        this.glowEff.visible = true;
        this.glowEff.x =(this.winLoseSprite.x);
        // if(this.glowEffAnimation){
        //     PIXI.actionManager.cancelAction(this.glowEffAnimation);
        //     this.glowEffAnimation = null;
        // }
        this.glowEff.stopAllActions();

        this.winLoseSprite.visible = true;
        if(sitId == 0){
            if(this.isMe){
                this.runChangeGoldEffect(moneyChange, null, cc.p(550,-100), true );
                this.winLoseSprite.x =(550 + this.winLoseSprite.width/2);
                this.glowEff.x =this.winLoseSprite.x;
            }else{
                if(cc.Global.gameId == Constant.GAME_ID.SAM || cc.Global.gameId == Constant.GAME_ID.TLMN)
                    this.runChangeGoldEffect(moneyChange, null, cc.p(posX, - 100), true );
                else
                    this.runChangeGoldEffect(moneyChange, null, cc.p(posX,this.winLoseSprite.y), true );
            }



        }else if(sitId == 1){
            this.runChangeGoldEffect(moneyChange, null, cc.p(posX-100,this.avt.y), true );
        }else if(sitId == 2){
            this.runChangeGoldEffect(moneyChange, null, cc.p(posX,this.avt.y+80), true );

        }else if(sitId == 3){
            this.runChangeGoldEffect(moneyChange, null, cc.p(posX+200,this.avt.y), true );

        }
        if(cc.Global.gameId == Constant.GAME_ID.SAM){
            if(sitId == 3 ){
                this.runChangeGoldEffect(moneyChange, null, cc.p(posX,this.avt.y+80), true );
            }else if(sitId == 4){
                this.runChangeGoldEffect(moneyChange, null, cc.p(posX+200,this.avt.y), true );

            }
        }

        if(isWin){
            //remove backcard if have
            //var backcard = this.anchorCard.getChildByName('backcard');
            //if(backcard) this.anchorCard.removeChild(backcard);
            this.runEffectGlow();

            if(wHr >0){
                if(cc.Global.gameId == Constant.GAME_ID.SAM) this.winLoseSprite.setSpriteFrame(whiteHandRankSam[wHr]+".png")  ;
                else this.winLoseSprite.setSpriteFrame(whiteHandRank[wHr]+".png")  ;
            }else{
                if(cc.Global.gameId == Constant.GAME_ID.SAM && samLoseType >0){
                    this.winLoseSprite.setSpriteFrame(samResult[samLoseType]+".png")  ;
                }else
                    this.winLoseSprite.setSpriteFrame("thang.png")  ;
            }

        }else{

            if(cc.Global.gameId == Constant.GAME_ID.SAM && samLoseType >0){
                this.winLoseSprite.setSpriteFrame(samResult[samLoseType]+".png")  ;
            }else if(isCong){
                this.winLoseSprite.setSpriteFrame("cong.png");
            }else
                this.winLoseSprite.setSpriteFrame("thua.png");

        }

        if(moneyChange > 0){
            //if(!wHr || wHr<=0)
             this.glowEff.setSpriteFrame("glow2.png");
           // if(!wHr || wHr<=0) this.winLoseSprite.texture = PIXI.Texture.fromFrame("glow1.png");
        }else if(moneyChange < 0){
            this.glowEff.setSpriteFrame("glow1.png");
        }else{
            this.glowEff.setSpriteFrame("glow1.png");
            this.winLoseSprite.setSpriteFrame("hoa.png");

        }
        this.gold = totalMoney;
        this.setTotalGoldWithEffect(totalMoney);
    },
    showRutTienBtn: function (visible) {
        if(!this.isMe){
            //hide luon prevent bug when playerMe standUp not hide rut tien
            this.btnRutTien.visible = false;
            return;// ko show rut tien neu player # me
        }
        this.btnRutTien.visible = visible;
    },
    showDealer: function (visible) {
        cc.log("show dealer");
        this.dealerSprite.visible = visible;
        if(this.sitId == 2 || this.sitId ==3 )
            this.dealerSprite.setPosition(cc.p2(-35, this.contentSize.height -15));
        else
            this.dealerSprite.setPosition(cc.p2(this.contentSize.width , this.contentSize.height-15));
    },
    showChuong: function (visible) {
        this.chuongSprite.visible = visible;
    },
    showDiDem: function (visible, showBet, arrCuoc, betValue) {

    },
    showGa: function (visible) {
        cc.log("showGa");
        this.chickenSprite.visible = visible;
         /*if(this.sitId == 2 || this.sitId ==3 )
             this.chickenSprite.position.set(this.contentSize.width , this.contentSize.height);
         else if(this.sitId == 2 || this.sitId ==3 )
             this.chickenSprite.position.set(-35, this.contentSize.height);
         else
         this.chickenSprite.position.set(this.contentSize.width , this.contentSize.height);
        */
        //this.chickenSprite.position.set(-35, this.contentSize.height);
        if(this.sitId>0 && this.sitId<= 4 ) {
            this.chickenSprite.setPosition(cc.p2(this.contentSize.width +20, this.contentSize.height));
            this.chickenSprite.scaleX = -1;
        }else {
            this.chickenSprite.setPosition(cc.p2(-35, this.contentSize.height));
        }
    },
    addMoneyBien: function (bettingDidem) {

    },
    addCuocContainer: function () {

    },
    addCuocContainerLeft: function () {

    }
});



