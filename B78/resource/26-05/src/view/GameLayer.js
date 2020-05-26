var GameLayer = cc.Node.extend({
    ctor: function(obj){
        this._super();
        this.gameId = obj.gameId;

        GameMng.setCurrentGameId(obj.gameId);
        //
        var size = cc.winSize;
        this.setPosition(cc.p(size.width/2, size.height/2));

        var bg = new cc.Sprite("res/lobby/bg.jpg");
        this.addChild(bg, -1);

        this.addChild(new Header(),10);

        this.addChild(new Footer(),0);

        ////////
        var khung = new cc.Sprite("res/game/popup_lobby.png");
        this.addChild(khung);

        var titleID = {
            "1": "res/game/TLMN-title.png",
            "2": "res/game/title-sam.png",
            "3": "res/game/title-bacay.png",
            "4": "res/game/title-maubinh.png",
            "5": "res/game/title-lieng.png",
            "6": "res/game/title-poker.png"
        };

        if( titleID.hasOwnProperty( this.gameId.toString() ) ){
            var gameTitle = new cc.Sprite( titleID[this.gameId.toString()] );
            gameTitle.setPosition(cc.p(0, 190));
            this.addChild(gameTitle);
        }

        var btnChoiNgay = new newui.Button("res/game/choingay_btn.png", function(){
            
        });
        btnChoiNgay.setPosition(cc.p(385,186));
        this.addChild(btnChoiNgay, 5);

        var btnTaoBan = new newui.Button("res/game/taoban_btn.png", function(){
            LobbyRequest.getInstance().createTable(function(cmd, dataObj){
                LobbyClient.getInstance().removeListener(LobbyRequest.getInstance());
                //{"b":[],"mB":0,"cmd":311} neu ko con tien
                //{"b":[50,100,200,500],"mB":700,"cmd":311}
                //click create table se lay maxbet truoc sau day tao ban
                cc.log('311 =>' + JSON.stringify(dataObj[1]));
                var mb = dataObj[1].mB;
                var b = dataObj[1].b;
                LoadingDialog.getInstance().hide();
                if(mb ===0){
                    var msg = "Bạn không đủ tiền để tạo bàn";
                    MH.createPopup(msg);
                }else{
                    if(b && b.length){
                        MH.openPopup("TaoBan", dataObj[1]);
                    }
                }
            });
        });
        btnTaoBan.setPosition(cc.p(390,-186));
        this.addChild(btnTaoBan, 5);

        var btnRefesh = new newui.Button("res/game/refesh_btn.png", function(){
            this.getTable();
        }.bind(this));
        btnRefesh.setPosition(cc.p(220,-186));
        this.addChild(btnRefesh, 5);

        var tableView = new newui.TableView(955, 305);
        tableView.setColumn(0.1, 0.26, 0.18, 0.25 ,0.2);
        tableView.setHeader("ID", "Mệnh Giá", "Mức Cược", "Đang Chơi", "Trạng Thái");
        tableView.setPosition(0, 155);

        this.addChild(tableView);
        this.tableView = tableView;
    },
    getTable: function(){
        LobbyRequest.getInstance().getListTable(this.gameId, MoneyType["Gold"], function(cmd, data){
            // console.log("data", data);
            if( data && cc.isArray(data) && data.length == 2 ){
                if( data[1]['rs'].length ){
                    var arr = [];
                    for( var i=0; i<data[1]['rs'].length; i++ ){    
                        var _lastCol;
                        if(data[1]['rs'][i].uC>=data[1]['rs'][i].Mu){
                            _lastCol = "Đầy";
                        }else{
                            _lastCol = new newui.Button("res/game/vaoban-btn.png", function(sender){
                                this.vaoBan(sender.roomData);
                            }.bind(this));
                            _lastCol.roomData = data[1]['rs'][i];
                        }

                        arr.push([(i+1)+"", MH.numToText(data[1]['rs'][i].b), MH.numToText(data[1]['rs'][i].mM), data[1]['rs'][i].uC+'/'+data[1]['rs'][i].Mu, _lastCol]);
                    }

                    this.tableView.setContent(arr);
                }
            }
            LobbyClient.getInstance().removeListener(LobbyRequest.getInstance());
        }.bind(this), LobbyRequest.getInstance());
    },
    vaoBan: function(_info){
        cc.log("click vao ban", _info);
        // MH.changePage('play', {gameId: 1});
        // return;

        var callBack = function(isJoinSuccess, msgError){
            MH.loadingDialog.hide();
            if(isJoinSuccess) MH.changePage('play');
            if(!isJoinSuccess && msgError && msgError.length){
                MessageNode.getInstance().show(msgError);
            }
        };
        LobbyRequest.getInstance().joinRoom(_info, callBack);
    },
    onEnter:function () {
        this._super();
        this.getTable();
    }
});