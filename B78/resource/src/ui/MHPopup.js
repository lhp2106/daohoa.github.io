var MHPopup = cc.Node.extend({
    outsideClose: false,
    isShow: false,
    ctor: function(_show){
        this._super();
        var colorLayer = new cc.LayerColor(cc.color(0,0,0,255), cc.winSize.width, cc.winSize.height);
        colorLayer.setOpacity(180);
        colorLayer.setPosition(-cc.winSize.width/2, -cc.winSize.height/2);
        this.addChild(colorLayer);

        var background = new cc.Sprite("res/popup/BG-popup.png");
        this.addChild(background);
        this.background = background;

        var btnClose = new newui.Button("res/popup/btn_close.png", function(){
            this.hide();
        }.bind(this));
        btnClose.setPosition(515, 295);
        this.addChild( btnClose, 2);
        this.btnClose = btnClose;

        var wrapContent = new cc.Node();
        this.addChild(wrapContent);
        this.wrapContent = wrapContent;

        this.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.zIndex = 99;
        this.setCascadeOpacityEnabled(true);

        if( _show ) this.show();
    },
    show: function(){
        if( this.isShow ) return;
        cc.director.getRunningScene().addChild(this);
        this.isShow = true;

        //effect
        this.setCascadeOpacityNodes(this.getChildren());

        this.setScale(1.1);
        this.setOpacity(0);
        this.runAction( cc.scaleTo(0.2, 1) );
        this.runAction( cc.fadeIn(0.2) );
    },
    setCascadeOpacityNodes: function(arr){
        for( var i=0; i<arr.length; i++ ){
            arr[i].setCascadeOpacityEnabled(true);
            this.setCascadeOpacityNodes(arr[i].children);
        }
    },
    hide: function(){
        var callfun = cc.callFunc(function(){
            this.removeFromParent(true);
            this.onClose.call(this);
        }.bind(this));
        this.runAction(cc.sequence(cc.scaleTo(0.2, 1.1), callfun));
        this.runAction(cc.fadeOut(0.2));
    },
    setTitle: function(s){
        // node | src | string
        if( this.wrapTitle ) this.removeChild( this.wrapTitle );

        if( cc.isString(s) ){
            if( s.indexOf(".") !== -1 ){
                // src
                var spr = new cc.Sprite(s);
                this.addChild(spr);
                this.wrapTitle = spr;
            }else{
                // text
                var label = new cc.LabelTTF(s, MH.getFont("Font_Default"), 40, cc.size(1000, 50), cc.TEXT_ALIGNMENT_CENTER);
                this.addChild(label);
                this.wrapTitle = label;
            }
        }else{
            //node
            this.addChild(s);
            this.wrapTitle = s;
        }

        // 
        this.wrapTitle.y = 265;
        this.wrapContent.y = -30;
    },
    setContent: function(){
        this.wrapContent.removeAllChildren(true);
        for( var i=0; i<arguments.length; i++ ){
            this.wrapContent.addChild(arguments[i]);
        }
    },
    addContent: function(){
        for( var i=0; i<arguments.length; i++ ){
            this.wrapContent.addChild(arguments[i]);
        }
    },
    onClose: function(){

    },
    onEnter: function(){
        this._super();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function (touch, event) {
                var sprSize = this.background.getContentSize();
                var rect = cc.rect(0, 0, sprSize.width, sprSize.height);
                if (this.outsideClose && !cc.rectContainsPoint(rect, this.background.convertToNodeSpace(touch.getLocation()))){
                    this.hide();
                }
                return true;
            }.bind(this),
        }, this);
    },
    onExit: function(){
        this._super();
        cc.eventManager.removeListener(this);
    }
});

var MHPopupL = MHPopup;

var MHPopupN = MHPopup.extend({
    ctor: function(){
        this._super();
        this.background.setTexture( cc.textureCache.getTextureForKey("res/popup/popup-normal.png") );
        this.btnClose.setPosition(300, 220);
    },
    setTitle: function(s){
        this._super(s);
        this.wrapTitle.y = 190;
    }
});

var MH = MH || {};
MH.popup = {};
MH.popup.close = function(_t){
    if( !_t || _t == "all" ) cc.log("need close all popup");
};
MH.popup["Login"] = function(){
    var popup = new MHPopupN();
    popup.setTitle("res/popup/dangnhap/title.png");

    var inputName = new newui.EditBox();
    inputName.y = 120;
    inputName.setPlaceHolder("Tên đăng nhập");
    inputName.setFontName("Font_Default");

    var inputPass = new newui.EditBox();
    inputPass.setPasswordEnabled(true);
    inputPass.y = 40;
    inputPass.setPlaceHolder("Mật khẩu");
    inputPass.setFontName("Font_Default");

    var btnDangNhap = new newui.Button("res/popup/dangnhap/dangnhap-btn.png");
    btnDangNhap.y = -50;

    var btnFB = new newui.Button("res/popup/dangnhap/fb-dangky-icon.png");
    btnFB.y = -170;

    var btnQuenMK = new newui.Button("res/popup/dangnhap/quenmk.png");
    btnQuenMK.y = -115;

    popup.setContent(inputName, inputPass, btnDangNhap, btnFB, btnQuenMK);

    popup.show();
};

MH.popup["Shop"] = function(data){
    var popup = new MHPopupL();
    // popup.setTitle("res/popup/shop/title-napthe.png");

    var btnNapTien = new newui.Button(["res/popup/shop/napbig-tab.png"], function(){
        clickchangeTab(this);
        openNapTien();
    });
    btnNapTien.setPosition(-210, 260);

    var btnDoiThe = new newui.Button(["res/popup/shop/doithe-tab.png"], function(){
        clickchangeTab(this);
        openDoiThe();
    });
    btnDoiThe.setPosition(-80, 260);

    var btnChuyenKhoan = new newui.Button(["res/popup/shop/chuyenkhoan-tab.png"], function(){
        clickchangeTab(this);
        openChuyenKhoan();
    });
    btnChuyenKhoan.setPosition(70, 260);

    var btnLichSu = new newui.Button(["res/popup/shop/lsdoith-tab.png"], function(){
        clickchangeTab(this);
        openLichSu();
    });
    btnLichSu.setPosition(240, 260);

    var contentWrap = new cc.Node();

    popup.setContent(btnNapTien, btnDoiThe, btnChuyenKhoan, btnLichSu, contentWrap);

    var clickchangeTab = function(btn){
        btnNapTien.opacity = 150;
        btnDoiThe.opacity = 150;
        btnChuyenKhoan.opacity = 150;
        btnLichSu.opacity = 150;
        contentWrap.removeAllChildren(true);
        btn.opacity = 255;
    };

    var telcos = [];
    if( LoginData.paygateData && LoginData.paygateData.data && LoginData.paygateData.data.telcos && LoginData.paygateData.data.telcos.length){
        telcos = LoginData.paygateData.data.telcos;
    }

    var showTyGia = function(_id, tableTyGia){
        var arr = [];
        for( var i=0; i< telcos.length; i++ ){
            if( telcos[i].id === _id ){
                for( var ii=0; ii<telcos[i].exchangeRates.length; ii++ ){
                    arr.push([ MH.numToText(telcos[i].exchangeRates[ii].amount), MH.numToText(telcos[i].exchangeRates[ii].gold)]);
                }
                break;
            }
        }

        tableTyGia.setContent(arr);
    };

    var openNapTien = function(){
        var inputNhaMang = new newui.SelectBox([{label:"Chọn nhà mạng", value: "###"},{label:"Viettel", value: "VTT"},{label:"Vinaphone", value: "VNN"},{label:"Mobiphone", value: "MBP"}]);
        inputNhaMang.setPosition(-290, 175);
        contentWrap.addChild(inputNhaMang);

        var inputMenhGia = new newui.SelectBox([{label: "Chọn mệnh giá", value: "###"},{label: "10.000", value: 10000}, {label: "20.000", value: 20000}, {label: "50.000", value: 50000}, {label: "100.000", value: 100000}, {label: "200.000", value: 200000}, {label: "500.000", value: 500000}]);
        inputMenhGia.setPosition(-290, 100);
        contentWrap.addChild(inputMenhGia);

        inputNhaMang.onChange = function(v){
            inputMenhGia.reset([{label: "Chọn mệnh giá", value: "###"},{label: "10.000", value: 10000}, {label: "20.000", value: 20000}, {label: "50.000", value: 50000}, {label: "100.000", value: 100000}, {label: "200.000", value: 200000}, {label: "500.000", value: 500000}]);
        };

        var inputSoSeri = new newui.EditBox();
        inputSoSeri.setPosition(-290, 25);
        inputSoSeri.setPlaceHolder("Số seri");
        inputSoSeri.setFontName("Font_Default");
        contentWrap.addChild(inputSoSeri);

        var inputMaThe = new newui.EditBox();
        inputMaThe.setPosition(-290, -50);
        inputMaThe.setPlaceHolder("Mã thẻ");
        contentWrap.addChild(inputMaThe);

        var inputCapCha = new newui.FormCapcha();
        inputCapCha.setPosition(-290, -125);
        contentWrap.addChild(inputCapCha);

        var btnXacNhan = new newui.Button(["res/popup/dangnhap-btn.png"], function(){
            MessageNode.getInstance().show("Vui lòng nhập đủ dữ liệu");
        });
        btnXacNhan.setPosition(-290, -200);
        contentWrap.addChild(btnXacNhan);

        var wrapTyGia = new cc.Sprite("res/popup/shop/tygianap-img.png");
        wrapTyGia.setPosition(206, -6);

        contentWrap.addChild( wrapTyGia );

        // wrap tygia
        var btnViettel = new newui.Button(["res/popup/shop/viettel.png", "res/popup/shop/viettel-active.png"], function(){
            showTyGia(1, tableTyGia);
            btnViettel.setActive(true);
            btnMobiphone.setActive(false);
            btnVinaphone.setActive(false);
        });
        btnViettel.setPosition(17, 116);
        var btnMobiphone = new newui.Button(["res/popup/shop/mobiphone.png", "res/popup/shop/mobiphone-active.png"], function(){
            showTyGia(3, tableTyGia);
            btnViettel.setActive(false);
            btnMobiphone.setActive(true);
            btnVinaphone.setActive(false);
        });
        btnMobiphone.setPosition(17, 10);
        var btnVinaphone = new newui.Button(["res/popup/shop/vinaphone.png", "res/popup/shop/vinaphone-active.png"], function(){
            showTyGia(2, tableTyGia);
            btnViettel.setActive(false);
            btnMobiphone.setActive(false);
            btnVinaphone.setActive(true);
        });
        btnVinaphone.setPosition(17, -95);

        contentWrap.addChild(btnViettel);
        contentWrap.addChild(btnVinaphone);
        contentWrap.addChild(btnMobiphone);

        // table 370 320
        var tableTyGia = new newui.TableView(370, 320);
        tableTyGia.setPosition(305,165);
        tableTyGia.setColumn(0.5, 0.5);
        tableTyGia.setHeader("MỆNH GIÁ", "TRỊ GIÁ BIG");
        contentWrap.addChild(tableTyGia);

        //
        btnViettel.setActive(true);
        showTyGia(1, tableTyGia);
    };

    var openDoiThe = function(){
        

    };

    var openChuyenKhoan = function(){
        
    };

    var openLichSu = function(){
        
    };

    ////
    var tab = 1;
    if( data && data.tab ){
        tab = data.tab;
    }



    switch(tab){
        case 1:
            clickchangeTab(btnNapTien);
            openNapTien();
            break;
        case 2:
            clickchangeTab(btnDoiThe);
            openDoiThe();
            break;
        case 3:
            clickchangeTab(btnChuyenKhoan);
            openChuyenKhoan();
            break;
        case 4:
            clickchangeTab(btnLichSu);
            openLichSu();
            break;
    }

    ////
    popup.show();
};

MH.popup["Invite"] = function(arr){ // gửi lời mời
    var popup = new MHPopupN();

    var scrollView = new ccui.ScrollView();
    scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
    scrollView.setBounceEnabled(true);
    scrollView.setContentSize(cc.size(540, 350));
    scrollView.setAnchorPoint(0.5, 0.5);
    scrollView.setInnerContainerSize(cc.size(540, arr.length*50));
    scrollView.setPosition(0, 30);

    

    var arrCheckBox = [];

    for( var i=arr.length-1; i>=0; i-- ){
        var checkbox = new newui.Button(["res/popup/off-checkbox.png", "res/popup/on-checkbox.png"], function(sender){
            sender.setActive( !sender.getActive() );
            cc.log( sender.getTag() );
        });
        checkbox.setTag(i);
        checkbox.setActive(true);
        checkbox.setPosition(70, 177 + 150 - i*50);

        arrCheckBox.push(checkbox);

        var uname = new cc.LabelTTF( arr[i].dn , MH.getFont("Font_Default"), 28, null, cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM);
        uname.setPosition(125, 160 + 150 - i*50);
        uname.setAnchorPoint(0, 0);

        var ugold = new cc.LabelTTF( MH.numToText(arr[i].m) , MH.getFont("Font_Default"), 28, null, cc.TEXT_ALIGNMENT_RIGHT, cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM);
        ugold.setFontFillColor(cc.color("#fffc01"));
        ugold.setPosition(502, 160 + 150 - i*50);
        ugold.setAnchorPoint(1, 0);

        scrollView.addChild(checkbox);
        scrollView.addChild(uname);
        scrollView.addChild(ugold);
    }

    var btnXacNhan = new newui.Button("res/popup/xacnhan-btn.png", function(){
        var arrSend = []; //
        for( var i=0; i<arrCheckBox.length; i++ ){
            if( arrCheckBox[i].getActive() && arr[ arrCheckBox[i].getTag() ] ) arrSend.push( arr[ arrCheckBox[i].getTag() ].u );
        }

        if( arrSend.length === 0 ) MessageNode.getInstance().show("Bạn chưa chọn ai để mời chơi");
        else{
            var sendObj = [
                command.ZonePluginMessage,
                Constant.CONSTANT.ZONE_NAME,
                'channelPlugin',
                {'cmd':Constant.CMD_RESULT.SEND_INVITE,
                    'us':arrSend,
                    'rid':LobbyClient.getInstance().getCurrentRoomId()
                }
            ];
            cc.log("invite "+ JSON.stringify(sendObj) );
            LobbyClient.getInstance().send(sendObj);

            popup.hide();
        }
    });
    btnXacNhan.setPosition(0, -180);

    popup.setContent(btnXacNhan, scrollView);  
    popup.show();
};

MH.popup["Invited"] = function(obj){ // được mời
    var popup = new MHPopupN();
    var wrap = new ccui.Scale9Sprite("res/input_default.png");
    wrap.setContentSize(cc.size(350, 145));
    wrap.y = 130;
    wrap.opacity = 150;

    var _name = "";
    if( obj.hasOwnProperty('fu') && obj['fu'].hasOwnProperty('u') ) _name = obj['fu']['u'];

    var name = new cc.LabelTTF(_name, MH.getFont("Font_Default"), 28);
    name.setAnchorPoint(0.5, 0);
    name.y = 140;

    var _gold = 0;
    if( obj.hasOwnProperty('fu') && obj['fu'].hasOwnProperty('m') ) _gold = MH.numToText( obj['fu']['m'] );
    var gold = new cc.LabelTTF(_gold, MH.getFont("Font_Default"), 36);
    gold.setAnchorPoint(0.5, 0);
    gold.setFontFillColor(cc.color("#e9fe00"));
    gold.y = 80;
    gold.setPosition(16, 80);

    var ico = new cc.Sprite("res/ico-gold.png");
    ico.setPosition(-30, 28);
    gold.addChild(ico);

    var _lb = "Mời bạn chơi ";
    if( obj.hasOwnProperty('ri') && obj['ri'].hasOwnProperty('gid') && Constant.GAME_NAME_ARRAY[ obj['ri']['gid'] ] ){
        _lb += Constant.GAME_NAME_ARRAY[ obj['ri']['gid'] ];
    }
    var lb = new cc.LabelTTF(_lb, MH.getFont("Font_Default"), 28);
    lb.setAnchorPoint(0.5, 0);
    lb.y = -8;

    var lb2 = new cc.LabelTTF("Không nhận lời mời chơi", MH.getFont("Font_Default"), 24);
    lb2.setAnchorPoint(0.5, 0);
    lb2.setPosition(12, -74);

    var checkbox = new newui.Button(["res/popup/off-checkbox.png", "res/popup/on-checkbox.png"], function(){
        var checked = !this.getActive();
        this.setActive( checked );
        btnXacNhan.setActive( checked );
    });
    checkbox.setPosition(-152, -50);

    var btnXacNhan = new newui.Button(["res/popup/xacnhan-btn.png", "res/popup/quaylai-btn.png"], function(){
        var notagree = this.getActive();
        popup.hide();
        if(!notagree) LobbyClient.getInstance().onJoinRoom(obj.ri);
    });
    btnXacNhan.y = -150;

    popup.setContent(wrap, name, gold, lb, lb2, checkbox, btnXacNhan);
    popup.show();
};

MH.popup["Setting"] = function(){
    var popup = new MHPopupN();

    var sound = new newui.Button(["res/popup/setting/icon-sound.png", "res/popup/setting/icon-sound2.png"], function(){
        this.setActive( !this.getActive() );
    });
    sound.x = -110;

    var invited = new newui.Button(["res/popup/setting/icon-invited.png", "res/popup/setting/icon-invited2.png"], function(){
        this.setActive( !this.getActive() );
    });
    invited.x = 120;

    popup.setContent(sound, invited);
    popup.show();
};

MH.popup["TaoBan"] = function(data){
    var popup = new MHPopupN();

    var slot = cc.Global.getSlotCountByGame();
    var inputMember = new newui.RadioGroup();


    var arrMucCuoc = [{label: "Chọn mức cược", value: "###"}];
    for( var i=0; i<data.b.length; i++ ){
        arrMucCuoc.push({label: MH.numToText(data.b[i]), value: data.b[i]});
    } 

    var inputMuccuoc = new newui.SelectBox( arrMucCuoc );
    inputMuccuoc.y = 80;

    var btnXacNhan = new newui.Button("res/popup/xacnhan-btn.png", function(){
        cc.log( inputMember.getValue(), inputMuccuoc.getValue() );
    });
    btnXacNhan.y = -160;

    popup.setContent(inputMuccuoc, btnXacNhan);

    if( slot.length ){
        for( var i=0; i<slot.length;i++ ){
            var lb = new cc.LabelTTF(slot[i]+" người", MH.getFont("Font_Default"), 28, null, cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM );
            lb.setAnchorPoint(0, 0);
            lb.y = -28;
            var check = new newui.Button(["res/popup/off-checkbox.png", "res/popup/on-checkbox.png"]);
            check.setUserData({value: slot[i]});
            check.y = -10;

            if( i === 0 ){
                lb.x = -124;
                check.x = -160;
            }else{
                lb.x = 80;
                check.x = 45;
            }

            popup.addContent(lb, check);

            inputMember.addRadio( check );
        }

        inputMember.setValue( slot[0] );
    }
    
    popup.show();
};

MH.popup["User"] = function(){
    var popup = new MHPopupN();
    popup.setTitle("res/popup/user/title.png");

    // var demo = new cc.Sprite("res/popup/demo-user.png");
    // demo.y = 30;

    var _lb = "minhhoatest\nID: 1234567\nSĐT: 0123456789\nCoin: 280.000";
    var lb = new cc.LabelTTF(_lb, MH.getFont("Font_Default"), 28);
    lb.setAnchorPoint(0, 0);
    lb.setPosition(-46, 5);
    lbb = lb;

    var btnDoiAvt = new newui.Button("res/popup/user/btn-doiavt.png", function(){
        popup.hide();
        MH.openPopup("DoiAvatar");
    });
    btnDoiAvt.setPosition(-126, -4);

    var btnDoiMk = new newui.Button("res/popup/user/btn-doimk.png");
    btnDoiMk.setPosition(-176, -110);
    var btnBaoMat = new newui.Button("res/popup/user/btn-baomat.png");
    btnBaoMat.setPosition(5, -110);
    var btnLs = new newui.Button("res/popup/user/btn-lsgiaodich.png");
    btnLs.setPosition(184, -110);

    popup.setContent(btnDoiAvt, lb, btnDoiMk, btnBaoMat, btnLs);

    cc.loader.loadImg(PlayerMe.avatar, function(err, tex){
        var avar = new cc.Sprite(tex);
        avar.setPosition(-126, 85);
        // maskedFill.addChild(avar);
        // avar.setScale(Math.max( maskAv.width/avar.width, maskAv.height/avar.height ));
        popup.addContent(avar);
    });

    popup.show();
};

MH.popup["DoiAvatar"] = function(){
    var popup = new MHPopupN();
    popup.setTitle("res/popup/title/doiavatar.png");

    var scrollView = new ccui.ScrollView();
    scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
    scrollView.setBounceEnabled(true);
    scrollView.setContentSize(cc.size(555, 370));
    scrollView.setAnchorPoint(0.5, 0.5);
    //scrollView.setPosition(0, 15);

    MyRequest.getAvatars(function(cmd, data){
        if( data.status === 0 && data.items.length ){
            scrollView.setInnerContainerSize(cc.size(555, Math.floor(data.items.length/4)*135));
            var loadImg = function(_index){
                var url = data.items[_index].url;
                if( !cc.sys.isNative ) url = url.replace("https://acs.p0w7m9d10d668i92wjs.com", "https://spritebase64.000webhostapp.com");
                cc.loader.loadImg(url, function(err, texture){
                    var av = new cc.Sprite(texture);
                    av.setAnchorPoint(0, 1);
                    av.x = 25 + _index%4 * 135;
                    av.y = - Math.floor(_index/4) *135 + Math.floor(data.items.length/4)*135 - 10;
                    scrollView.addChild(av);

                    var touchStart = av.getPosition();
                    cc.eventManager.addListener({
                        event: cc.EventListener.TOUCH_ONE_BY_ONE,
                        swallowTouches: false,
                        onTouchBegan: function (touch, event) {
                            var sprSize = av.getContentSize();
                            var rect = cc.rect(0, 0, sprSize.width, sprSize.height);
                            if (cc.rectContainsPoint(rect, av.convertToNodeSpace(touch.getLocation()))){
                                touchStart = touch.getLocation();
                                return true;
                            }
                            return false;
                        },
                        onTouchEnded: function (touch, event) {
                            var touchEnd = touch.getLocation();
                            if( Math.abs(touchEnd.x-touchStart.x) < 25 && Math.abs(touchEnd.y-touchStart.y) < 25 ){
                                popup.hide();
                                LobbyRequest.getInstance().updateAvatar(_index, function(cmd, data){
                                    if ( data['status'] == 0 ) {
                                        PlayerMe.avatar = url;
                                        MH.header.change("logged");
                                    }
                                });
                            }
                        },
                    }, av);

                    if( _index < data.items.length-1 ) loadImg(_index+1);
                });
            };

            loadImg(0);
        }
    });

    popup.setContent(scrollView);

    popup.show();
};