var LobbyLayer = cc.Node.extend({
    ctor: function(){
        this._super();

        this.setPosition(cc.winSize.width/2, cc.winSize.height/2);

        this.addChild(new cc.Sprite("res/lobby/bg.jpg"));

        this.addChild(new Header());

        this.addChild(new Footer());

        this.addChild(new Marquee());

        this.addChild(new TopHu());

        this._dataIcons = [
            {   
                gid: 1001,
                spine: ["res/gamelist/Icon-TaiXiu.json", "res/gamelist/Icon-TaiXiu.atlas"],
                x: 98.5,
                y: 317.5,
                w: 226,
                h: 228,
                x2: 98.5,
                btn: null,
                sN: "TAIXIU",
                t: "MNG"
            },{
                gid: 1002,
                spine: ["res/gamelist/Icon-Minipoker.json", "res/gamelist/Icon-Minipoker.atlas"],
                x: 98.5,
                y: 127.5,
                w: 226,
                h: 228,
                x2: 98.5,
                btn: null,
                sN: "MINIPOKER",
                t: "MNG"
            },{
                gid: 1003,
                spine: ["res/gamelist/Icon-BaLa.json", "res/gamelist/Icon-BaLa.atlas"],
                x: 298.5,
                y: 317.5,
                w: 226,
                h: 228,
                x2: 298.5,
                btn: null,
                sN: "BALA",
                t: "MNG"
            },{
                gid: 1004,
                spine: ["res/gamelist/Icon-BanCa.json", "res/gamelist/Icon-BanCa.atlas"],
                x: 508.5,
                y: 225.5,
                w: 248,
                h: 424,
                x2: 108.5,
                btn: null,
                sN: "BANCA",
                t: "SLOT"
            },{
                gid: 209,
                spine: ["res/gamelist/Icon-RungRam.json", "res/gamelist/Icon-RungRam.atlas"],
                x: 728.5,
                y: 269.5,
                w: 248,
                h: 337,
                x2: 328.5,
                btn: null,
                sN: "LONGVUONG",
                t: "SLOT"
            },{
                gid: 210,
                spine: ["res/gamelist/Icon-TDK.json", "res/gamelist/Icon-TDK.atlas"],
                x: 947.5,
                y: 275.5,
                w: 248,
                h: 337,
                x2: 547.5,
                btn: null,
                sN: "DEADORALIVE",
                t: "SLOT"
            },{
                gid: 1007,
                spine: ["res/gamelist/Icon-LMHT.json", "res/gamelist/Icon-LMHT.atlas"],
                x: 1166.5,
                y: 269.5,
                w: 248,
                h: 337,
                x2: 766.5,
                btn: null,
                sN: "LONGVUONG2",
                t: "SLOT"
            },{ 
                gid: 1008,
                spine: ["res/gamelist/Icon-Larva.json", "res/gamelist/Icon-Larva.atlas"],
                x: 1373.5,
                y: 317.5,
                w: 226,
                h: 228,
                x2: 496.5,
                btn: null,
                sN: "LARVA",
                t: "MNG"
            },{
                gid: 1009,
                spine: ["res/gamelist/Icon-TomCuaCa.json", "res/gamelist/Icon-TomCuaCa.atlas"],
                x: 1373.5,
                y: 127.5,
                w: 226,
                h: 228,
                x2: 496.5,
                btn: null,
                sN: "TOMCUACA",
                t: "MNG"
            },{ 
                gid: 1010,
                spine: ["res/gamelist/Icon-BaCay.json", "res/gamelist/Icon-BaCay.atlas"],
                x: 1573.5,
                y: 317.5,
                w: 226,
                h: 228,
                x2: 103.5,
                btn: null,
                sN: "BACAY",
                t: "CARD"
            },{
                gid: 1011,
                spine: ["res/gamelist/Icon-Lieng.json", "res/gamelist/Icon-Lieng.atlas"],
                x: 1573.5,
                y: 127.5,
                w: 226,
                h: 228,
                x2: 103.5,
                btn: null,
                sN: "LIENG",
                t: "CARD"
            },{ 
                gid: 1012,
                spine: ["res/gamelist/Icon-MauBinh.json", "res/gamelist/Icon-MauBinh.atlas"],
                x: 1773.5,
                y: 317.5,
                w: 226,
                h: 228,
                x2: 303.5,
                btn: null,
                sN: "MAUBINH",
                t: "CARD"
            },{
                gid: 1013,
                spine: ["res/gamelist/Icon-Poker.json", "res/gamelist/Icon-Poker.atlas"],
                x: 1773.5,
                y: 127.5,
                w: 226,
                h: 228,
                x2: 303.5,
                btn: null,
                sN: "POKER",
                t: "CARD"
            },{ 
                gid: 1014,
                spine: ["res/gamelist/Icon-Sam.json", "res/gamelist/Icon-Sam.atlas"],
                x: 1973.5,
                y: 317.5,
                w: 226,
                h: 228,
                x2: 503.5,
                btn: null,
                sN: "SAM",
                t: "CARD"
            },{
                gid: 1015,
                spine: ["res/gamelist/Icon-TLMN.json", "res/gamelist/Icon-TLMN.atlas"],
                x: 1973.5,
                y: 127.5,
                w: 226,
                h: 228,
                x2: 503.5,
                btn: null,
                sN: "TLMN",
                t: "CARD"
            },{ 
                gid: 1016,
                spine: ["res/gamelist/Icon-ThienDia.json", "res/gamelist/Icon-ThienDia.atlas"],
                x: 2173.5,
                y: 317.5,
                w: 226,
                h: 228,
                x2: 697.5,
                btn: null,
                sN: "THIENDIA",
                t: "MNG"
            },{
                gid: 1017,
                x: 298.5,
                y: 127.5,
                x2: 298.5,
                sN: "ET",
                btn: null,
                t: "MNG"
            }
        ];

        var btnTatCa = new newui.Button(["res/gamelist/tatca-tab.png"], function(){
            btnTatCa.setOpacity(255);
            btnSlots.setOpacity(150);
            btnMiniGame.setOpacity(150);
            btnGameBai.setOpacity(150);

            for( var i = this._dataIcons.length-1; i>=0; i-- ){
                if( this._dataIcons[i].btn ){                   
                    if( this._dataIcons[i].hasOwnProperty("x") ){
                        this._dataIcons[i].btn.setPosition(this._dataIcons[i].x, this._dataIcons[i].y);
                        this._dataIcons[i].btn.visible = true;
                    }
                }
            }
            scrollView.jumpToLeft();
            scrollView.setInnerContainerSize(cc.size(2300, 435));
        }.bind(this));
        btnTatCa.setPosition(-207, 186);
        this.addChild(btnTatCa);

        var btnSlots = new newui.Button(["res/gamelist/slots-tab.png"], function(){
            btnTatCa.setOpacity(150);
            btnSlots.setOpacity(255);
            btnMiniGame.setOpacity(150);
            btnGameBai.setOpacity(150);

            for( var i = this._dataIcons.length-1; i>=0; i-- ){
                if( this._dataIcons[i].btn ){
                    if( this._dataIcons[i].t == "SLOT" ){
                        if( this._dataIcons[i].hasOwnProperty("x2") ){
                            this._dataIcons[i].btn.setPosition(this._dataIcons[i].x2, this._dataIcons[i].y);
                            this._dataIcons[i].btn.visible = true;
                        }
                    }else{
                        this._dataIcons[i].btn.visible = false;
                    }
                }
            }
            scrollView.jumpToLeft();
            scrollView.setInnerContainerSize(cc.size(963, 435));
            //thiz._changeTab(2);
        }.bind(this));
        btnSlots.setPosition(cc.p(-67, 186));
        btnSlots.setOpacity(150);
        this.addChild(btnSlots, 5);

        var btnMiniGame = new newui.Button(["res/gamelist/minigame-tab.png"], function(){
            btnTatCa.setOpacity(150);
            btnSlots.setOpacity(150);
            btnMiniGame.setOpacity(255);
            btnGameBai.setOpacity(150);

            for( var i = this._dataIcons.length-1; i>=0; i-- ){
                if( this._dataIcons[i].btn ){
                    if( this._dataIcons[i].t == "MNG" ){
                        if( this._dataIcons[i].hasOwnProperty("x2") ){
                            this._dataIcons[i].btn.setPosition(this._dataIcons[i].x2, this._dataIcons[i].y);
                            this._dataIcons[i].btn.visible = true;
                        }
                    } else{
                        this._dataIcons[i].btn.visible = false;
                    }
                }
            }
            scrollView.jumpToLeft();
            scrollView.setInnerContainerSize(cc.size(963, 435));
            //thiz._changeTab(3);
        }.bind(this));
        btnMiniGame.setPosition(cc.p(73, 186));
        btnMiniGame.setOpacity(150);
        this.addChild(btnMiniGame, 5);

        var btnGameBai = new newui.Button(["res/gamelist/gamebai-tab.png"], function(){
            btnTatCa.setOpacity(150);
            btnSlots.setOpacity(150);
            btnMiniGame.setOpacity(150);
            btnGameBai.setOpacity(255);

            for( var i = this._dataIcons.length-1; i>=0; i-- ){
                if( this._dataIcons[i].btn ){
                    if( this._dataIcons[i].t == "CARD" ){
                        if( this._dataIcons[i].hasOwnProperty("x2") ){
                            this._dataIcons[i].btn.setPosition(this._dataIcons[i].x2, this._dataIcons[i].y);
                            this._dataIcons[i].btn.visible = true;
                        }
                    }else{
                        this._dataIcons[i].btn.visible = false;
                    }
                }
            }

            scrollView.jumpToLeft();
            scrollView.setInnerContainerSize(cc.size(963, 435));
            // thiz._changeTab(4);
        }.bind(this));
        btnGameBai.setPosition(cc.p(213, 186));
        btnGameBai.setOpacity(150);
        this.addChild(btnGameBai, 5);

        // var banner = new Slider();
        // this.addChild(banner);
        // banner.setData([
        //     {img:"res/banner/sukien1.png", url:""},
        //     {img:"res/banner/sukien2.png", url:""},
        //     {img:"res/banner/sukien3.png", url:""},
        //     {img:"res/banner/sukien4.png", url:""},
        //     {img:"res/banner/sukien5.png", url:""},
        // ]);


        var scrollView = new ccui.ScrollView();
        scrollView.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        scrollView.setBounceEnabled(true);
        scrollView.setContentSize(cc.size(963, 435));

        scrollView.setInnerContainerSize(cc.size(2300, 435));
        scrollView.setPosition(cc.p(-324,-268));
        // scrollView.setAnchorPoint(cc.p(0.5, 0.5));
        this.addChild(scrollView, 2); // < btn filter

        for( var i = this._dataIcons.length-1; i>=0; i-- ){
            if( !this._dataIcons[i].hasOwnProperty("spine") ) continue;
            var spineIcon = new sp.SkeletonAnimation(this._dataIcons[i].spine[0], this._dataIcons[i].spine[1]);

            spineIcon.setName(this._dataIcons[i].sN);

            if(this._dataIcons[i].sN === "DEADORALIVE"){
                spineIcon.setAnimation(0, 'animation', true);
            }else {
                spineIcon.setAnimation(0, 'Idle', true);
            }

            spineIcon.setPosition(this._dataIcons[i].x, this._dataIcons[i].y);

            scrollView.addChild(spineIcon, 5);

            // this.addTouchIcon(spineIcon, this._dataIcons[i]);

            this._dataIcons[i].btn = spineIcon;

            if( ["RUNGRAM", "DEADORALIVE", "LMHT", "LONGVUONG", "LONGVUONG2"].indexOf(this._dataIcons[i].sN) !== -1 ){
                
                var huBg = new cc.Sprite("res/gamelist/bg-hu.png");

                if(this._dataIcons[i].sN === "DEADORALIVE") huBg.setPosition(cc.p(0, -190));
                else huBg.setPosition(cc.p(0, -180));
                spineIcon.addChild(huBg, -1);

                var label1 = new newui.LabelBMFont("", "res/fonts/font-listhu-export.fnt");
                label1.setScale(0.3);
                label1.setPosition(cc.p(97, 90));
                huBg.addChild(label1, 0);

                var label2 = new newui.LabelBMFont("", "res/fonts/font-listhu-export.fnt");
                label2.setScale(0.3);
                label2.setPosition(cc.p(97, 63));
                huBg.addChild(label2, 0);

                var label3 = new newui.LabelBMFont("", "res/fonts/font-listhu-export.fnt");
                label3.setScale(0.3);
                label3.setPosition(cc.p(97, 35));
                huBg.addChild(label3, 0);

                this._dataIcons[i].lbs = {
                    100:{
                        n: 0,
                        lb: label1
                    },
                    1000:{
                        n: 0,
                        lb: label2
                    },
                    10000:{
                        n: 0,
                        lb: label3
                    }
                };
            }
        }

        var btnIcon = new newui.Button("res/gamelist/Icon-ET.png", function(){
            MH.openGame("ET");
        });
        btnIcon.setName("ET");
        btnIcon.setPosition(cc.p(298.5,127.5));
        scrollView.addChild(btnIcon, 5);

        var spineIcon1 = new sp.SkeletonAnimation("res/gamelist/Icon-3.json", "res/gamelist/Icon-3.atlas");
        spineIcon1.setAnimation(0, 'Idle', true);
        spineIcon1.setPosition(cc.p(80, 70));
        btnIcon.addChild(spineIcon1, 2);

        var spineIcon2 = new sp.SkeletonAnimation("res/gamelist/Icon-4.json", "res/gamelist/Icon-4.atlas");
        spineIcon2.setAnimation(0, 'Idle', true);
        spineIcon2.setPosition(cc.p(150, 80));
        spineIcon2.scaleX *= -1;
        btnIcon.addChild(spineIcon2, 2);

        for( var i = this._dataIcons.length-1; i>=0; i-- ){
            if( this._dataIcons[i].sN == "ET" ){
                this._dataIcons[i].btn = btnIcon;
                break;
            }
        }

        // Event
        var rect = cc.rect(-324,-268, 963, 435);
        var _beganX = 0;
        var _indexBtn = 0;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
                var locationInNode = this.convertToNodeSpace(touch.getLocation());
                if (cc.rectContainsPoint(rect, locationInNode)){
                    for( var i=this._dataIcons.length-1; i>=0; i-- ){
                        var node = this._dataIcons[i].btn;
                        var iconBox = node.getBoundingBox();
                        var locationInNode2 = node.convertToNodeSpace(touch.getLocation());
                        locationInNode2.x += iconBox.width/2;
                        locationInNode2.y += iconBox.height/2;

                        var rect2 = cc.rect(0, 0, iconBox.width, iconBox.height);
                        if (cc.rectContainsPoint(rect2, locationInNode2) && node.getName() !== "ET"){
                            _beganX = touch.getLocation().x;
                            _indexBtn = i;
                            node.setScale(1.05);
                            return true;
                        }
                    }
                }
                return false;
            }.bind(this),
            onTouchEnded: function (touch, event) {
                var node = this._dataIcons[_indexBtn].btn;
                node.setScale(1);

                if( Math.abs(touch.getLocation().x-_beganX) < 25 ){
                    var icoload = new cc.Sprite("res/gamelist/progess.png");
                    icoload.runAction(cc.rotateBy(200, 36000));

                    var numload = new cc.LabelTTF("0%", MH.getFont("Font_Default"), 30, cc.size(200, 50), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM)
                    numload.y = -40;
                    numload.setTag(111);

                    node.setColor(cc.color(120, 120, 120));
                    node.addChild(icoload);
                    node.addChild(numload);

                    //
                    MH.openGame(node.getName());
                }
            }.bind(this),
        }, btnIcon);
    }
});