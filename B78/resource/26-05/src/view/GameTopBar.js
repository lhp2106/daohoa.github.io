var GA_MODE = GA_MODE || {};
GA_MODE.NORMAL = 1;
GA_MODE.GA = 2;

var SPEED_MODE = SPEED_MODE || {};
SPEED_MODE.NORMAL = 1;
SPEED_MODE.FAST = 2;

var GAME_MODE = GAME_MODE || {};
GAME_MODE.FREE = 1;
GAME_MODE.IS_411 = 2;

var GameTopBar = cc.Node.extend({
	DELTA_X: 0.064,
	ctor: function(listener, displayAutoReady){
		this._super();

		this.x = 0;
	    this.y = 0;

	    var roomID =  LobbyClient.getInstance().getCurrentRoomId();
	    this._roomID = roomID;

	    this.listener = listener;
	    this.displayAutoReady = displayAutoReady;
	    //if(!listener.data) listener.data = {b: 100};
	    this.data = listener.data;

	    this.initView();

	    cc.log("listener", listener);
	    cc.log("listener.data", listener.data);
	},
	initView: function(){
		var roomID = LobbyClient.getInstance().getCurrentRoomId();
	    var sid = HostConfig.currentServer.id - 1;//sid bat dau tu 1
	    var str = 'ABCDEFGHIJKLMNOUPQRS';
	    var roomName = "Bàn: " + roomID + str[sid];
	    var cuoc = "Cược: " + cc.Global.NumberFormat2(this.data.b);

	    var roomLbl = new PIXI.Text(roomName,{fontFamily : cc.res.font.Arial, fontSize: 21, fill : 0xffffff, align : 'left'});
	    roomLbl.setAnchorPoint(cc.p3(0.5, 0.5));
	    roomLbl.setPosition(cc.p2(170, 30));
	    // roomLbl.displayGroup = MyPixi.gameRootLayer;
	    this.addChild(roomLbl);
	    this.roomLbl = roomLbl;

	    var iconMoney;
	    if (cc.Global.moneyType === MoneyType.Gold) iconMoney = PIXI.Sprite.fromFrame("button/icon_vang_small.png");
	    else iconMoney = PIXI.Sprite.fromFrame("button/icon_xu_small.png");

	    iconMoney.setAnchorPoint(cc.p3(0, 0));
	    iconMoney.setPosition(cc.p2(90, 55));
	    // iconMoney.displayGroup = MyPixi.gameRootLayer;
	    this.addChild(iconMoney);
	    this.iconMoney = iconMoney;

	    var cuocLbl = new PIXI.Text(cuoc,{fontFamily : cc.res.font.Arial, fontSize: 21, fill : 0xffffff, align : 'left'});

	    cuocLbl.setAnchorPoint(cc.p3(0,0.5));
	    cuocLbl.setPosition(cc.p2(130, 75));
	    // cuocLbl.displayGroup = MyPixi.gameRootLayer;
	    this.addChild(cuocLbl);
	    this.cuocLbl = cuocLbl;

	    if(cc.Global.gameId === Constant.GAME_ID.CHAN){
	        var uLbl = new PIXI.Text("",{fontFamily : cc.res.font.Arial, fontSize: 21, fill : 0xffffff, align : 'left'});

	        uLbl.setAnchorPoint(cc.p3(0,0.5));
	        uLbl.setPosition(cc.p2(100, 120));
	        // uLbl.displayGroup = MyPixi.gameRootLayer;
	        this.addChild(uLbl);
	        this.uLbl = uLbl;

	        roomLbl.setAnchorPoint(cc.p3(0,0.5));
	        roomLbl.setPosition(cc.p2(100, 30));
	        roomLbl.setString(roomName + ", "+cuoc);
	        cuocLbl.visible = false;
	        uLbl.y = cuocLbl.y;
	    }

	    var iconWifi = PIXI.Sprite.fromFrame("button/signal_1.png");
	    iconWifi.setAnchorPoint(cc.p3(0, 1));
	    iconWifi.setPosition(cc.p2(20, 150));
	    // iconWifi.displayGroup = MyPixi.gameRootLayer;
	    this.addChild(iconWifi);
	    this.iconWifi = iconWifi;

	    this.initButtons();

	    this.refreshView();
	},
	refreshView: function(){
		var roomID = this._roomID ;
	    var sid = HostConfig.currentServer.id -1;//sid bat dau tu 1
	    var str = 'ABCDEFGHIJKLMNOUPQRS';

	    var roomName = "Bàn: 31A";//+ roomID+str[sid];
	    this.roomLbl.setString(roomName);
	    var cuoc = "Cược: "+ cc.Global.NumberFormat2(this.data.b);
	    this.cuocLbl.setString(cuoc);

	    if(cc.Global.gameId == Constant.GAME_ID.CHAN){
	        this.roomLbl.setString(roomName + ", "+cuoc);

	        var times = this.data.tft/1000;
	        var is411 = this.data.gM == GAME_MODE.IS_411;//1: free, 2: 4-11,
	        var u = is411 ? "4-11" : "Ù tự do";
	        this.uLbl.setString(u+", "+times +" s");
	        this.updateChicken();
	    }
	},
	initButtons: function(){
		var thiz = this;

	    var onButtonDown = function() {
	        cc.log("GameTopBar: click back btn");
	        if(thiz.listener.backButtonClickHandler) thiz.listener.backButtonClickHandler();
	        /*MyPixi.destroyGame();
	        MyPixi.app.destroy(true);
	        MH.changePage("game",{"gameId":cc.Global.gameId});*/


	        //LobbyClient.getInstance().quitRoom();
	    }
	    var button = MyHelper.createButton("button/btn_back.png", true, onButtonDown);
	    this.backBtn = button;

	    this.addChild(button);


	    var clickHandler = function() {
	        if(thiz.onSettingButtonHandler ) thiz.onSettingButtonHandler();
	    };

	    this.settingBt = MyHelper.createButton("button/btn_caidat.png", true, clickHandler);

	    this.settingBt.setPosition( cc.p2(cc.Global.GameView.width - 50,  50));

	    this.addChild(this.settingBt);

	    if(cc.Global.gameId === Constant.GAME_ID.CHAN){
	        var onChickenDown = function() {
	            //cc.log("GameTopBar: click chickenHandler btn");
	            if(thiz.chickenHandler) thiz.chickenHandler();
	        }
	        // var chickenBt = MyHelper.createButton("button/res_ga_off.png", true, onChickenDown);
	        var chickenBt = new newui.Button(["#button/res_ga_off.png"], function(){
	        	if(thiz.chickenHandler) thiz.chickenHandler();
	        });
	        this.addChild(chickenBt);
	        this.chickenBt = chickenBt;
	        this.chickenBt.setAnchorPoint(0.5, 0.5);
	        this.chickenBt.setPosition(cc.winSize.width - 150,  -40);

	        // this.gaMoney = cc.LabelTTF("0", cc.res.font.Arial, 21, null, "white");
	        this.gaMoney = new cc.LabelTTF("0", cc.res.font.Arial, 21, cc.size(0,0), cc.TEXT_ALIGNMENT_LEFT);
	        this.gaMoney.setFontFillColor(cc.color("#ffffff"));
	        this.gaMoney.setAnchorPoint(0.5, 0.5);
	        this.gaMoney.setPosition(this.chickenBt.x,-this.chickenBt.y-45 );
	        // this.gaMoney.displayGroup = this.chickenBt.displayGroup;
	        this.addChild(this.gaMoney);

	    }
	},
	updateChicken: function(){
		if(cc.Global.gameId != Constant.GAME_ID.CHAN) return;
	    var isGa = (this.data.cKM === GA_MODE.GA);
	    this.isGa = isGa;
	    if(!this.data.tCkP) this.data.tCkP = 0;
	    if(isGa){
	        this.gaMoney.string = cc.Global.NumberFormat1(this.data.tCkP* this.data.b);
	        this.chickenBt.loadTextureNormal("#button/res_ga_on.png");// = PIXI.Texture.fromFrame("button/res_ga_on.png");
	    }else{
	        this.gaMoney.string ="";
	        this.chickenBt.loadTextureNormal("#button/res_ga_off.png");// = PIXI.Texture.fromFrame("button/res_ga_off.png");
	    }
	},
	notifiPing: function(command, data){
		if (!this.iconWifi) return;
		var pingNum = data.latency;
	    if (pingNum < 100) {
	        this.iconWifi.setTexture("#button/signal_0.png");// = this.pingTexture[0];
	    } else if (pingNum < 200) {
	        this.iconWifi.setTexture("#button/signal_1.png");// = this.pingTexture[1];
	    } else if (pingNum < 300) {
	        this.iconWifi.setTexture("#button/signal_2.png");// = this.pingTexture[2];
	    } else {
	        this.iconWifi.setTexture("#button/signal_3.png");// = this.pingTexture[3];
	    }
	},
	chickenHandler: function(){
		//overide in gameChan
	},
	onSettingButtonHandler: function(){
		// MH.openSetting(this.displayAutoReady);
	}
});