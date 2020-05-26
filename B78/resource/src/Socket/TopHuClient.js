/**
 * Created by kk on 6/23/2017.
 *
 *
 *
 */
var TopHuClient = (function () {
    var instance = null;

    var Clazz = function(){
        this.ctor = function () {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                var thiz = this;
                this.obServerData = [];
                this.allListener = {};
                this.zoneName = Constant.CONSTANT.ZONE_NAME_TOP_HU;
                this.pluginName = Constant.PLUGIN_TAI_XIU;

                this.lobbySocket = new socket.LobbyClient(this.zoneName);
                this.lobbySocket.onEvent = function (messageName, data) {
                    thiz.onEvent(messageName, data);
                };

                this.isLogin = false;
                this.clickLoginBtn = false;
                this.host = "ws://125.212.192.97";
                this.port = -1;
                this.addListener("LobbyStatus", this._onLobbyStatus, this);
                this.addListener(kCMD.LOGIN, this._onLogInRes, this);
                this.addListener(kCMD.LOGOUT, this._onLogOutRes, this);
                this.addListener(kCMD.RoomPluginMessage, this._onRoomPluginMsg, this);
                this.addListener(CMD_OBSERVER.OBSERVER_SLOT.toString(), this.onObserverResponse, this);

                //this.addListener(kCMD.BROASTCAST, this._onBroastCast, this);

                this.addListener("fetchConfig", this._onFetchConfig, this);
                this.addListener("fetchAllCashoutItems", this._onFetchAllCashoutItems, this);
            }
        };
       
        this.testLostConnection = function(){
            this.lobbySocket.setSocketStatus(socket.LobbySocket.LostConnection);
        };
       

        this.send = function (message) {
            if (this.lobbySocket) {
                //cc.log(message);
                this.lobbySocket.send(JSON.stringify(message));
            }
        };

        this.close = function () {
            this.isReconnected = false;
            if (this.lobbySocket) {
                this.lobbySocket.close();
            }
        };
        
        this.connectTo = function (host, port) {
            if(this.lobbySocket){
                this.isLogined = false;
                this.isKicked = false;
                this.lobbySocket.connect(host);

            }
        };

        this.onEvent = function (messageName, data) {
            if(messageName == "ping"){
                //cc.log(' postEvent => '+ data);
                this.postEvent("ping", data);
            }else if(messageName == "socketStatus"){
                //cc.log(' postEvent => '+ data);
                this.postEvent("LobbyStatus", data);
            }
            else if(messageName == "message"){
                var messageData = JSON.parse(data);
                var _command = messageData[0];
                if(_command === command.RoomPluginMessage){
                    this.postEvent(messageData[0].toString(), messageData);
                }else{
                    this.postEvent(messageData[0].toString(), messageData);
                }
            }
        };

        this.prePostEvent = function (command, event) {

        };

        this.onLoginEvent = function (event) {

        };

        this.postEvent = function (command, event) {
           // this.prePostEvent(command, event);
            var arr = this.allListener[command];
            if (arr) {
                //cc.log("allListener length "+arr.length);
                this.isBlocked = true;
                for (var i = 0; i < arr.length;) {
                    var target = arr[i];
                    if (target) {
                        target.listener.apply(target.target, [command, event]);
                    }
                    else {
                        arr.splice(i, 1);
                        continue;
                    }
                    i++;
                }
                this.isBlocked = false;
            }

            if( command === '10000' && this.obServerData.length === 0 && event && event[1] && event[1].Js ){
                this.obServerData = event[1].Js;
            }
        };

        this.addListener = function (command, _listener, _target) {
            var arr = this.allListener[command];
            if (!arr) {
                arr = [];
                this.allListener[command] = arr;
            }
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] && arr[i].target == _target) {
                    return;
                }
            }
            arr.push({
                listener: _listener,
                target: _target
            });
        };

        this.removeListener = function (target) {
            for (var key in this.allListener) {
                if (!this.allListener.hasOwnProperty(key)) continue;
                var arr = this.allListener[key];
                for (var i = 0; i < arr.length;) {
                    if (arr[i] && arr[i].target == target) {
                        if (this.isBlocked) {
                            arr[i] = null;
                        }
                        else {
                            arr.splice(i, 1);
                            continue;
                        }
                    }
                    i++;
                }
            }
        };


        
        this.isLoginDone= function(){
            return this.isLogin;
        };

        this.connect = function ( loginType,connectType, serverId) {
            this.isLogin = false;//= true la login thanh cong
            if(!serverId) serverId = -1;
            var thiz = this;

            if(loginType > -1){
                this.loginType = loginType;
            }
            if(HostConfig.miniGameServer.length <= 0){
                cc.log("ko co thong tin TOPHU server, LobbyClinet da load config chua???");
            }else{
                var server = this.getServer(connectType,serverId);

                if( server["wsEndpoint"] ){
                    this.connectTo( server["wsEndpoint"] );
                }else if(server["ip"] && server["webSocketPort"]){
                    this.connectTo("wss://"+server["host"]+":"+server["webSocketPort"]+"/websocket");
                }

                HostConfig.currentServerMiniGame = server;

                // if(server["ip"] && server["webSocketPort"]){
                //     this.connectTo("wss://"+server["ip"]+":"+server["webSocketPort"]+"/websocket");
                //     // cc.log("TOPHU server CONNECTING TO "+server["ip"]);
                //     HostConfig.currentServerMiniGame = server;
                // }
            }
        };
        this.httpRequest = function (url, params, callback) {
            var header = {};
            if(this._accessToken){
                header.Authorization = this._accessToken;
            }
            //cc.log("this._accessToken "+this._accessToken);
            var thiz = this;
            HttpRequest.requestGETMethod(url, header, params, function (status, response) {
                if(response && response.status == 500){
                    if(thiz._refreshToken){
                        thiz._sendRequestRefreshToken(function (status) {
                            if(status == 0){
                                thiz.httpRequest(url, params, callback);
                            }
                            else{
                                cc.log("khong refresh dc token");
                            }
                        });
                    }
                }
                else{
                    if(callback){
                        callback(status, response);
                    }
                    else{
                        thiz.postEvent(params.command, response);
                        // thiz._dispatchHttpResponse(status, response);
                    }
                }
            });
        };

        
        this.getServer= function( connectType, serverId ){
            if(!serverId) serverId = -1;
            var server =cc.Global.getRandomServerMiniGame();
            switch(connectType){
                case Constant.CONNECT_TYPE.NORMAL:
                    server =cc.Global.getRandomServerMiniGame();
                    break;
                case Constant.CONNECT_TYPE.RECONNECT:
                    server = HostConfig.currentServerMiniGame;//cc.Global.getRandomServerMiniGame();
                    break;
                case Constant.CONNECT_TYPE.CHANGE_RADOM_SERVER:
                    server =cc.Global.getRandomServerMiniGame();
                    this.numberRetry=1;
                    break;

            }
            HostConfig.currentServerMiniGame = server;
            return server;
        };
        this.authenGameServer= function(user ,pass, connectType ){
            if(!connectType) connectType = Constant.CONNECT_TYPE.NORMAL;
            var loginSend = [
                command.LOGIN,
                this.zoneName,
                "",//USER
                "",//PASS
                //signatureData
                {}
            ];
            var msg =loginSend;// `[${command.LOGIN};Simms, usernamej, password, {}]`;
            cc.log("TOP hu authen send "+JSON.stringify(msg));
            this.send(msg);
        };

        this._onLobbyStatus= function (command, event) {
            if(event === "Connected"){
                cc.log("TopHuClient:: command " +command+ " event "+event);
                this.authenGameServer(this.username, this.password);


            }else if(event == "LostConnection"){

                cc.log("TopHuClient:: command " +command+ " event "+event);
                cc.log(" reConnect => LostConnection");
                this.reConnect();
            }else if(event == "ConnectFailure"){
                //change ws ket noi lai

                cc.log("TopHuClient:: command " +command+ " event "+event);
                this.close();
                var currentScene = 'home';//MH.currentPage();//home || game || play || signup
                if(currentScene == "home"){
                    //login but fail => tiep tuc login till die =))
                    //if(!cc.isClientGameBai() ) //MiniGameLoadingDialog.getInstance().show("Đang kết nối lại");
                    TopHuClient.getInstance().connect(this.loginType, Constant.CONNECT_TYPE.NORMAL);

                }else{
                    //reconnect but fail to connect ws => show dialog ket noi sau xxx s
                   /* var msg = "Tự động kết nối lại sau 5s\n Kết nối ngay?";
                    var dialog = new MessageReconnectDialog(5);
                    dialog.setMessage(msg);
                    dialog.showWithAnimationScale();*/

                    //MiniGameLoadingDialog.getInstance().showReconnect();


                }
            }

        };
        this.isClickLogin= function(){
            return this.clickLoginBtn;
        };
        this._onLogInRes= function (command, data){
            cc.log(command+ " _onLogInRes mini game => "+ JSON.stringify(data));
            var isSuccess = data[1];
            var errorStr = data[5];
            //[1,false,104,"dohimi",null,"Website tạm thời bảo trì. Mời bạn quay lại sau"]
            //MiniGameLoadingDialog.getInstance().hide();
            if(!isSuccess){
                /*//MiniGameLoadingDialog.getInstance().hide();
                if(!errorStr || !errorStr.length) errorStr = "Đăng nhập thất bại"
                var dialog = new MessageOkDialog();
                dialog.setMessage(errorStr);
                dialog.showWithAnimationScale();*/
                if(this.handlerLoginFail){
                    this.handlerLoginFail(errorStr);
                    this.handlerLoginFail = null;
                }
                return;
            }
            // wait cmd 100 userinfo tra ve moi hide loading bar- luk nay moi tinh login succ
            // mini game thi ko can doi cmd 100, cmd tra ve sau thi update info cung dc
            cc.log('TOPHU login done ');

            this.isLogin = true;

        };
        /**
         * code for html call
         */
        this.logOut = function(){
            cc.log('CALL LOG OUT TOPHU');
            TopHuClient.getInstance().close();
            this.isLogin = false;
            
        };
        this._onLogOutRes= function (command, data){
            cc.log('CALL LOG OUT '+data[1] +" reason "+data[2]);
            cc.log(command+ " TOPHU _onLogOutRes => "+ JSON.stringify(data));
            //[messageId:Int 2, success:bool, reason:Int]  => [2,true,4]
            if(data[1]){
                //logout success
                this.logOut();

               
            }
        };
        this._onRoomPluginMsg= function (command, dataObj){
             //cc.log(command+ "TOPHU _onRoomPluginMsg => "+ JSON.stringify(dataObj));
            //[5,{"tst":1499309896478,"mgs":"đây là tin nhắn chat","cmd":1308,"fu":"dohimi123"}]
            var cmd = dataObj[1][Constant.CONSTANT.CMD];

            if(cmd === 10000){//top hu~
                //cc.log(command+ "TOPHU _onRoomPluginMsg => "+ JSON.stringify(dataObj));
                this.postEvent(cmd.toString(), dataObj);

            }
            // cc.log(dataObj);
        };

       
        this.reConnect= function (){
            //ket noi lai
            this.close();
            cc.log( " reConnecting........... ");
           // if(!cc.isClientGameBai() ) //MiniGameLoadingDialog.getInstance().show("Mất kết nối .Đang kết nối lại");
            TopHuClient.getInstance().connect(this.loginType, Constant.CONNECT_TYPE.RECONNECT);
            this._isReconnecting = true;

        };
        this.reConnectDone= function (data){
            if(!this._isReconnecting) return;
            this._isReconnecting = false;
            //MiniGameLoadingDialog.getInstance().hide();


            cc.log("reConnectDone ****** "+PlayerMe.roomInfoReconnect);
            //show panel userInfo
            MH.header.change('logged');
            if(!cc.isClientGameBai() ){
                MH.createPopup({
                    title:'Kết nối lại',
                    width:'600px',
                    content:[
                        {
                            tag:'p',
                            text:'Bạn vừa mất kết nối. Hệ thống vừa tự kết nối lại',
                        }
                    ]
                });
            }


        };
        this.updateUserInfo= function (data) {
            var jObj= data[1];
            LoginData.userinfo = jObj;

            var uid = jObj.uid;
            var avatar = jObj.a;
            var info = jObj.As;
            var gold = info.gold;
            var chip = info.chip;
            var vip =  info.vip;
            var safe = info.safe;
            var playerName  =  jObj.u;
            var gender = jObj.g;
            var phone = jObj.ph;
            var phoneVerify = jObj.pvr;
            var broastCastArr = jObj.bcm;
            var id = jObj.id;
            var displayName = jObj.dn;
            var lastRoom = jObj.lr;
            var kichhoat = jObj.am;
            //cc.log("broastCastArr "+ JSON.stringify(broastCastArr));
            LoginData.broastCastArr = broastCastArr;
            PlayerMe.id = id;
            PlayerMe.uid = uid;
            PlayerMe.avatar = avatar;
            PlayerMe.username = playerName;
            PlayerMe.displayName = displayName;
            PlayerMe.gold = gold;
            PlayerMe.chip = chip;
            PlayerMe.vip = vip;
            PlayerMe.gender = gender;
            PlayerMe.phone = phone;
            PlayerMe.phoneVerify = phoneVerify;
            if(kichhoat) PlayerMe.kichhoat = kichhoat;
            PlayerMe.moneySafe = safe;
        };
        this._onUserInfo= function (command, data){
            cc.log(command+ "tophu _onUserInfo => "+ JSON.stringify(data));

            var jObj= data[1];
            var phoneVerify = jObj.pvr;
            var kichhoat = jObj.am;
            var displayName = jObj.dn;


            if(!phoneVerify && displayName && kichhoat && kichhoat.length){//prevent not verify phone but disconnect and reconnect when refresh browseer
                cc.log("pending show dialog active sdt");

                MH.createPopup({
                    title:'',
                    width:'600px',
                    delay: 1200,
                    content:[
                        {
                            tag:'p',
                            text:kichhoat,
                        }
                    ]
                });

                this.loadReward();
            }
            else
            if(( !displayName || displayName.length===0) ){
                cc.log("pending show dialog UPDATE ten hien thi");
                MH.updateDPN.open();
                this.loadReward();
            }else{
                    //normal login

                    cc.log('normal login ***************');
                    this.onUpdateMoney();
                    this.loadReward();



            }


            if(MH.currentPage('home')){
                //!=HomeScene co the la reconnect => ko doi scene, giu nguyen scene hien tai
                //MiniGameLoadingDialog.getInstance().hide();
                //currentScene.onLoginDone();

            }

        };


        this.login=function(){
           // if(!cc.isClientGameBai() ) //MiniGameLoadingDialog.getInstance().show("Đang đăng nhập");
            TopHuClient.getInstance().connect(LoginType.Normal, Constant.CONNECT_TYPE.NORMAL);
        },



        this.ctor();
    };

    Clazz.getInstance = function () {
        if (!instance) {
            instance = new Clazz();
        }
        return instance;
    };

    return Clazz;
})();