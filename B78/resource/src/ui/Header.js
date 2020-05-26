var Header = cc.Sprite.extend({
	_isLogged: false,
	ctor: function(logged){
        var url = "res/header/header-login.png";
        if( logged ) url = "res/header/header-lobby.png";

        this._super(url);
		this.setLogged(false); //MH.checkLogin()
	},
	setLogged: function(logged){
		if( logged ) this._renderLogged();
        else this._renderNotLogged();

        this._isLogged = logged;
	},
	_renderLogged: function(){
        this.removeAllChildren(true);

        this.setTexture("res/header/header-lobby.png");

		var btnSetting = new newui.Button("res/header/setting-icon.png", function(){
            MH.openPopup("Setting");
        });
        btnSetting.setPosition(cc.p(1220, 24));
        this.addChild(btnSetting);

        var btnEvent = new newui.Button(["res/header/sukien-icon.png"], function(){});
        btnEvent.setPosition(cc.p(1137, 24));
        this.addChild(btnEvent);

        var btnShop = new newui.Button(["res/header/store-icon.png"], function(){
            MH.openPopup("Shop", {id: 123});
        });
        btnShop.setPosition(cc.p(1054, 24));
        this.addChild(btnShop);

        var btnVip = new newui.Button(["res/header/vip-icon.png"]);
        btnVip.setPosition(cc.p(971, 24));
        this.addChild(btnVip);
        this.btnVip = btnVip;

        var btnLock = new newui.Button(["res/header/khoagame-icon.png"], function(){});
        btnLock.setPosition(cc.p(888, 24));
        this.addChild(btnLock);

        var btnBack = new newui.Button(["res/header/back-btn.png"], function(){
            var crPage = MH.currentPage();
            if( crPage == "home" ){
                MH.logOut();    
            }else if( crPage == "game" ){
                MH.changePage("home");
            }else if( crPage == "play" ){
                MH.changePage("game");
            }
        });
        btnBack.setPosition(cc.p(50, 31));
        this.addChild(btnBack);

        var btnNap = new newui.Button(["res/header/add-gold-btn.png"], function(){
            MH.openPopup("Shop", {id: 123});
        });
        btnNap.setPosition(cc.p(790, 31));
        this.addChild(btnNap);

        var goldNum = new cc.LabelBMFont(MH.numToText(PlayerMe.gold), "res/fonts/number-header.fnt", cc.TEXT_ALIGNMENT_LEFT);
        goldNum.setScale(0.2);
        goldNum.setPosition(cc.p(620, 29));
        this.addChild(goldNum);

        var disPlayName = new cc.LabelTTF(PlayerMe.displayName, MH.getFont("UTM_Eremitage"), 20, cc.size(320,32), cc.TEXT_ALIGNMENT_LEFT);
        disPlayName.setPosition(cc.p(405, 41));
        this.addChild(disPlayName);

        var userID = new cc.LabelTTF("ID: "+PlayerMe.id, MH.getFont("UTM_Eremitage"), 18, cc.size(320,32), cc.TEXT_ALIGNMENT_LEFT);
        userID.setPosition(cc.p(405, 16));
        this.addChild(userID);

        var avarWrap = new newui.Button("res/header/ava_lobby.png", function(){
            MH.openPopup("User");
        });
        avarWrap.setPosition(cc.p(200, 36));

        var avarUrl = PlayerMe.avatar || "res/header/ava_default.jpg";

        var maskAv = new cc.Sprite("res/header/ava_lobby_1.png"); /*mask*/
        var maskedFill = new cc.ClippingNode(maskAv);
        maskedFill.setAlphaThreshold(0);
        maskedFill.setAnchorPoint(0.5, 0.5);
        maskedFill.setPosition(cc.p(35, 35));

        avarWrap.addChild(maskedFill,-1);

        this.addChild(avarWrap);

        cc.loader.loadImg(avarUrl, function(err, tex){
            cc.log("ava load textures",tex);
            var avar = new cc.Sprite(tex);
            maskedFill.addChild(avar);
            avar.setScale(Math.max( maskAv.width/avar.width, maskAv.height/avar.height ));
        });

        // this.hasNewMessage(LoginData.unreadMsg+LoginData.newAnnounceMsg);
	},
	_renderNotLogged: function(){
        this.removeAllChildren(true);

        this.setTexture("res/header/header-login.png")

        var btnDangKy = new newui.Button("res/header/dangky-login-btn.png", function(){
            MH.openPopup("Login");
        });

        btnDangKy.setPosition(cc.p(634, 38));
        this.addChild(btnDangKy);

        var btnDangNhap = new newui.Button("res/header/dangnhap-login-btn.png", function(){
            MH.openPopup("Login");
        });
        btnDangNhap.setPosition(cc.p(451, 38));
        this.addChild(btnDangNhap);

        var btnFB = new newui.Button("res/header/fb-btn.png", function(){
            MH.openPopup("Login");
        });
        btnFB.setPosition(cc.p(183, 41));
        this.addChild(btnFB);

        var btnSetting = new newui.Button("res/header/setting-icon.png", function(){
            MH.openPopup("Login");
        });
        btnSetting.setPosition(cc.p(1220, 24));
        this.addChild(btnSetting);

        var btnEvent = new newui.Button("res/header/sukien-icon.png", function(){
            MH.openPopup("Login");
        });
        btnEvent.setPosition(cc.p(1137, 24));
        this.addChild(btnEvent);

        var btnShop = new newui.Button("res/header/store-icon.png", function(){
            MH.openPopup("Login");
        });
        btnShop.setPosition(cc.p(1054, 24));
        this.addChild(btnShop);

        var btnVip = new newui.Button("res/header/vip-icon.png", function(){
            MH.openPopup("Login");
        });
        btnVip.setPosition(cc.p(971, 24));
        this.addChild(btnVip);
        this.btnVip = btnVip;

        var btnLock = new newui.Button("res/header/khoagame-icon.png", function(){
            MH.openPopup("Login");
        });
        btnLock.setPosition(cc.p(888, 24));
        this.addChild(btnLock);
	},
    hasNewMessage: function(n){
        this.btnVip.removeAllChildren();
        if( !this._isLogged || !n ) return;

        var sticker = new cc.Sprite("res/header/notice-sticker.png");
        sticker.setPosition(cc.p(65, 65));

        var numText = new cc.LabelTTF(n, MH.getFont("Font_Default"), 24);
        numText.setPosition(cc.p(15, 10));
        sticker.addChild(numText);

        this.btnVip.addChild(sticker);
    },
    reLoad: function(){
        if( this._isLogged ) this._renderLogged();
        else this._renderNotLogged();
    },
    onEnter: function(){
        this._super();
        this.setPosition(cc.p(0, 320));
        MH.header.node = this;
    },
    onExit: function(){
        this._super();
        MH.header.node = null;
    }
});