/**
 * Created by  on 6/23/2016.
 *
 *
 *
 */
var reason_v52 = reason_v52 || {};
reason_v52.UNKNOWN = 1;
reason_v52.KICKED = 2;
reason_v52.LOGOUT = 3;
reason_v52.KICK_LOGIN_OTHER_DEVICE = 4;
reason_v52.KICK_IDLE = 5;

var SLOT_GAME_MINI   = SLOT_GAME_MINI || {
        TAI_XIU : 100,
        MINI_POKER : 199,
        TAM_GIOI : 208,
        TRUNG_PHUC_SINH: 202,
        SIEUXE: 218,
        SPARTA: 209,
        DAOCA: 205,
        TRUTIEN: 210,
        DEADORALIVE: 215,
        THAN_DEN: 217
    };
var SLOT_GAME_MINI_ARR   = SLOT_GAME_MINI_ARR || [
        SLOT_GAME_MINI.MINI_POKER,

        SLOT_GAME_MINI.TAM_GIOI,
        SLOT_GAME_MINI.TRUNG_PHUC_SINH,
        SLOT_GAME_MINI.SIEUXE,
        SLOT_GAME_MINI.SPARTA,
        SLOT_GAME_MINI.DEADORALIVE

];

var CMD_OBSERVER = CMD_OBSERVER || {
    OBSERVER_TAI_XIU: 1005,
    OBSERVER_POKER  :1101,//
    OBSERVER_SLOT  :1300,// SLOT la 3 game mini poker, trung , tam gioi, PHAN BIET = SLOT_GAME_MINI when send
    OBSERVER_SLOT_REMOVE  :1301,
    OBSERVER_SLOT_CHAT  :1308,
    OBSERVER_SLOT_RECONNECT: "OBSERVER_SLOT_RECONNECT"
//OBSERVER_TAI_XIU_REMOVE  : 1006,
//OBSERVER_POKER_REMOVE  : 1102,

};
var CMD_TAI_XIU = CMD_TAI_XIU || {
    GET_INFO_PHIEN  : 1007,
    GET_HISTORY_BET :1009,
    BETTING_DONE: 1000,
    ENABLE_BETTING: 1002,
    CHARGE_MONEY: 1004,
    UPDATE_BETTING: 1008,
    BETTING_ALL: 1012,
    CHAT: 1011
};

var CMD_SLOT_MACHINE = CMD_SLOT_MACHINE || {
    GET_HU : 1300,
    SPIN : 1302,
    JACKPOT: 1304,
    AUTOSPIN_ON: 1303,
    AUTOSPIN_OFF: 1305,
    SPIN_TRIAL: 1307,
    X2_GAME: 1306,
    FINISH_X2_GAME: 1309
};

var miniGamePlugin = miniGamePlugin || {
        PLUGIN_TAI_XIU  : "taixiuPlugin",
        PLUGIN_SLOT_GAME : "slotMachinePlugin"
    };
var MiniGameClient = (function () {
    var instance = null;

    var Clazz = function(){
        this.ctor = function () {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                var thiz = this;
                this.obServerData = [];
                this.allListener = {};
                this.zoneName = Constant.CONSTANT.ZONE_NAME_MINI_GAME;
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
        this._onBroastCast= function (command, data){
            cc.log(command+ " _onBroastCast => "+ JSON.stringify(data));
            //[5,{"na":0,"cmd":104,"bcm":["Chào mừng bạn đến với VIP52"],"ur":0}]
            var jObj= data[1];
            LoginData.broastCastArr = jObj.bcm;
            LoginData.unreadMsg = jObj.ur;
            LoginData.newAnnounceMsg = jObj.na;
            MH.hasNewMessage( LoginData.unreadMsg  );
            MH.hasNewNotify( LoginData.newAnnounceMsg );

            this.postEvent(kCMD.BROASTCASTTIVI, LoginData.broastCastArr);

        };
        this._onBroastCastTivi= function (command, data){
            //cmd 10 chi co o minigame - Thanh` bao the
            cc.log(command+ " _onBroastCast => "+ JSON.stringify(data));
            //[5,{"mgs":"vin*** thắng lớn 750.000 (Tam giới)","cmd":9}]
            var jObj= data[1];
            if(jObj.mgs && jObj.mgs.length > 0){
                //console.log(" _onBroastCastTivi => "+ jObj.mgs);
                this.postEvent(kCMD.BROASTCASTTIVI, jObj);
            }
        };
        this.testLostConnection = function(){
            this.lobbySocket.setSocketStatus(socket.LobbySocket.LostConnection);
        };
        this.obServerAllMiniGame = function () {
            // var sendObj = [
            //     command.ZonePluginMessage,
            //     this.zoneName,
            //     miniGamePlugin.PLUGIN_TAI_XIU,
            //     { 'cmd':CMD_OBSERVER.OBSERVER_TAI_XIU}
            // ];
            // this.send(sendObj);
            MinigamePlugin.getInstance().loginTaiXiu();

            //observer top hu~
             sendObj = [
                command.ZonePluginMessage,
                this.zoneName,
                "lobbyPlugin",
                { 'cmd':10001}
            ];
            //console.log("aaaaaa "+JSON.stringify(sendObj));
            this.send(sendObj);
            //miniPokerPlugin
            // observer 3 slot game

           /* for(var i = 0 ; i< SLOT_GAME_MINI_ARR.length; i++){
                var sendObj = [
                    command.ZonePluginMessage,
                    this.zoneName,
                    miniGamePlugin.PLUGIN_SLOT_GAME,
                    {
                        'cmd': CMD_OBSERVER.OBSERVER_SLOT,
                        'gid': SLOT_GAME_MINI_ARR[i]
                    }
                ];
                cc.log("send "+JSON.stringify(sendObj));
                this.send(sendObj);
            }*/

        };
        this.removeObserverByGameID = function(slotGameId){
            var sendObj = [
                command.ZonePluginMessage,
                this.zoneName,
                miniGamePlugin.PLUGIN_SLOT_GAME,
                {
                    'cmd': CMD_OBSERVER.OBSERVER_SLOT_REMOVE
                    ,
                    'gid': slotGameId
                }
            ];
            cc.log("removeObserverByGameID send "+JSON.stringify(sendObj));
            this.send(sendObj);
        };
        this.observerByGameID = function(slotGameId){
            var sendObj = [
                command.ZonePluginMessage,
                this.zoneName,
                miniGamePlugin.PLUGIN_SLOT_GAME,
                {
                    'cmd': CMD_OBSERVER.OBSERVER_SLOT,
                    'gid': slotGameId
                }
            ];
            cc.log("observerByGameID send "+JSON.stringify(sendObj));
            this.send(sendObj);
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

        this.connect = function (user, pass, loginType,connectType, serverId) {
            this.isLogin = false;//= true la login thanh cong
            if(!serverId) serverId = -1;
            var thiz = this;
            if(user){
                this.username = user;
            }
            if(pass){
                this.password = pass;
            }
            if(loginType > -1){
                this.loginType = loginType;
            }
            if(HostConfig.miniGameServer.length <= 0){
                cc.log("ko co thong tin minigame server, LobbyClinet da load config chua???");
            }else{
                var server = this.getServer(connectType,serverId);
                if( server["wsEndpoint"] ){
                    this.connectTo( server["wsEndpoint"] );
                }else if(server["ip"] && server["webSocketPort"]){
                    this.connectTo("wss://"+server["host"]+":"+server["webSocketPort"]+"/websocket");
                }

                HostConfig.currentServerMiniGame = server;

                // if(server["host"] && server["webSocketPort"]){
                //     this.connectTo("ws://"+server["host"]+":"+server["webSocketPort"]+"/websocket");
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

        this._sendRequestRefreshToken = function (callback) {
            var params = {
                command : "refreshToken",
                refreshToken : this._refreshToken
            };
            var thiz = this;
            HttpRequest.requestGETMethod(HostConfig.services.id, header, params, function (status, response) {
                if(response){
                    if(response.status == 0){
                        thiz._accessToken = response.data.accessToken;
                    }
                    else{
                        thiz._accessToken = null;
                    }
                    callback(response.status);
                }
                else{
                    callback(-1);
                }
            });
        };

        this.loadDistributor= function(callback){
            var thiz = this;
            //cc.Global.SetSetting("test", USE_TEST_SERVER);
            cc.Global.verifyTest();
            if(Distributor.distId && Distributor.applicationId){
                // neu fix thi ko can load tu serrver nua
                //Distributor.distId = data.distId;
                //Distributor.applicationId = data.applicationId;
                MiniGameClient.getInstance().loadConfig();
                thiz._loadConfig = true;
                if(!hiepnh.isUndefined(callback)){
                    callback();
                }
                //alert("ko load dis nua");
                return; // ----------------------------------
            }
            cc.log("Đang Tải cấu hình game");
            var link = ServerConfig.getLinkDistributor();
            var thiz = this;
            var param = {
                command : "regdis",
                bundle : BUNDLE,
                appName : APPNAME
            };

            HttpRequest.requestGETMethod(link, null, param, function (status, response) {
                if(status == HttpRequest.RES_SUCCESS && response){
                    var status = response.status;
                    cc.log("loadDistributor response "+JSON.stringify(response));
                    if(status != Constant.STATUS.SUCCESS){
                        /*thiz.titleConfig.string = "Tải cấu hình game thất bại.\n Tự động tải lại sau 1 giây ";
                         var cb = new cc.CallFunc(thiz.loadDistributor, thiz);
                         var ac = new cc.Sequence(new cc.DelayTime(1), cb );
                         thiz.runAction(ac);*/
                        setTimeout(function(){
                            MiniGameClient.getInstance().loadDistributor();
                        }, 1000);
                         
                        return;
                    }
                    var data = response.data;
                    Distributor.distId = data.distId;
                    Distributor.applicationId = data.applicationId;
                    //thiz.titleConfig.string = "Tải cấu hình game ok. ";

                    MiniGameClient.getInstance().loadConfig();
                    thiz._loadConfig = true;
                    if(!hiepnh.isUndefined(callback)){
                        callback();
                    }
                    //if(thiz._loadResouce ) thiz.nextScene();

                }
                else{
                    //thiz.titleConfig.string = "Tải cấu hình game thất bại.\n Tự động tải lại sau 1 giây ";
                    //var cb = new cc.CallFunc(thiz.loadDistributor, thiz);
                    //var ac = new cc.Sequence(new cc.DelayTime(1), cb );
                    //thiz.runAction(ac);
                    setTimeout(function(){
                        MiniGameClient.getInstance().loadDistributor();
                    }, 1000);
                }
            });
        };

        this.loadConfig= function( callback){
            if(callback=== undefined) callback = null;
            var url = ServerConfig.getLinkACS(Distributor.distId, Distributor.applicationId);
            var thiz = this;
            var version = VERSION_ID_TEST;
            var plalform = PLATFORM_ID_TEST;
            if(!cc.Global.GetSetting("test"+APPNAME, false)){

                version = VERSION_ID;
                plalform = PLATFORM_ID;
            }
            if(!Distributor.applicationId || !Distributor.distId){
                this.loadDistributor();//try load lai distribute
                return;
            }
            var params = {
                command : "get-bid",
                distId : Distributor.distId,
                versionId: version,
                platformId: plalform,
                appId : Distributor.applicationId
            };
            HttpRequest.requestGETMethod(url, null, params, function (status, response) {
                //cc.log("loadConfig response=> "+response);
                if(status == HttpRequest.RES_SUCCESS && response){
                    var status = response.status;
                    if(status != 0){
                        if(callback != null){
                            cc.log("Không thể tải thông tin cấu hình game");
                            /*var dialog = new MessageOkDialog();
                            dialog.setMessage("Không thể tải thông tin cấu hình game");
                            dialog.showWithAnimationScale();*/
                            setTimeout(function(){
                                MiniGameClient.getInstance().loadConfig();
                            }, 1000);
                        }

                        return;
                    }
                    var data = response.data;
                    var servers = data.config.servers;
                    if(USE_TEST_SERVER){
                        for(var i = servers.length -1 ; i>=0; i--){
                            if(VIP52_IP_REJECT.indexOf(servers[i].ip) != -1 ){
                                servers.splice(i,1);
                            }

                        }
                    }
                    var replace = BASE_URL_TEST;
                    if(!cc.Global.GetSetting("test", false)) {
                        replace = BASE_URL;
                    }
                    HostConfig.ctconfig = data.config;
                    HostConfig.servers = servers;//data.config.servers;
                    HostConfig.services = data.config.services;
                    HostConfig.services.sa = HostConfig.services.sa.replace("http://sandbox.api1bai247.info", replace);
                    HostConfig.services.id= HostConfig.services.id.replace("http://sandbox.api1bai247.info", replace);
                    HostConfig.services.paygate =HostConfig.services.paygate.replace("http://sandbox.api1bai247.info", replace);
                    HostConfig.miniGameServer =data.config.miniGameServer;
                    HostConfig.miniGameServer =data.config.miniGameServer;
                    cc.log("set------- HostConfig.slotGames "+ JSON.stringify(data));
                    cc.log("loadConfig => "+JSON.stringify(data));


                    MiniGameClient.getInstance().postEvent(kCMD.CONFIG_SUCCESS,{} );

                    //var _info = window.btoa( JSON.stringify(HostConfig.miniGameServer) );
                    //MH.setCookie("miniGameServer",  _info, 100);

                    //var _infoServices = window.btoa( JSON.stringify(HostConfig.services) );
                    //MH.setCookie("_infoServices",  _infoServices, 100);

                    if(callback != null){
                      callback();

                     }

                }
                else{
                    //LoadingDialog.getInstance().hide();
                    if(callback != null){
                        cc.log("Không thể tải thông tin cấu hình game");
                        /*var dialog = new MessageOkDialog();
                        dialog.setMessage("Không thể tải thông tin cấu hình game");
                        dialog.showWithAnimationScale();*/
                    }
                    setTimeout(function(){
                        MiniGameClient.getInstance().loadConfig();
                    }, 1000);
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
                /*case Constant.CONNECT_TYPE.CHANGE_SERVER_SPECIFC:
                    server =cc.Global.getServerById(serverId);
                    break;*/
            }
            HostConfig.currentServerMiniGame = server;
            return server;
        };
        this.authenGameServer = function(user ,pass, connectType ){
            if(!connectType) connectType = Constant.CONNECT_TYPE.NORMAL;
            var signature = LoginData.signatureData.data.signature;
            var info = LoginData.signatureData.data.info;
            var loginSend = [
                command.LOGIN,
                this.zoneName,
                user,
                pass,
                //signatureData
                {
                    signature: LoginData.signatureData.data.signature,
                    info: LoginData.signatureData.data.info,
                    pid: Constant.CONSTANT.PLATFORM//4 la plaft form id web

                }
            ];
            var msg =loginSend;// `[${command.LOGIN};Simms, usernamej, password, {}]`;
            cc.log("authen send "+JSON.stringify(msg));
            this.send(msg);
        };

        this._onLobbyStatus= function (command, event) {
            if(event === "Connected"){
                // LoginData.signatureData = response;
                this._accessToken = LoginData.signatureData.data.accessToken;
                this._refreshToken = LoginData.signatureData.data.refreshToken;

                //cc.log("_onLobbyStatus "+thiz.username + ":"+thiz.password);
                this.authenGameServer(this.username, this.password);



                return;
                var thiz = this;
                var param = {
                    command : "login",
                    username : this.username,
                    password : this.password,
                    platformId : 4
                };
                if(this.loginType == LoginType.FB){
                    if(!cc.Global.fbLoginToken || cc.Global.fbLoginToken.length == 0 ){
                        cc.log("fb chua lay dc token return");
                        MiniGameClient.getInstance().hide();
                        return;
                    }
                    param = {
                        command : "loginFacebook",
                        fbAccessToken : cc.Global.fbLoginToken,
                        platformId : 4,
                        os       : "web"
                    };
                }


                //AUTO LOGIN lai  neu seassion van dung
                //neu dung OTP ma ko co cookie thi login minigame cung pop up OTP :9
                if( MH.getCookie('_signatureData') ){
                    var info = "{}";//window.atob( MH.getCookie('_signatureData') );
                    LoginData.signatureData = JSON.parse(info);
                    if(LoginData.signatureData && LoginData.signatureData.data){

                        var userName = LoginData.signatureData.data.info.username;
                        //login dung username thi check ===, ko co username thi la reconnect or auto login
                        if( (!thiz.username || thiz.username.length == 0 || thiz.loginType == LoginType.FB) || (thiz.username && thiz.username.length > 0 && thiz.username == userName) ){
                            thiz._accessToken = LoginData.signatureData.data.accessToken;
                            thiz._refreshToken = LoginData.signatureData.data.refreshToken;
                            PlayerMe.security = LoginData.signatureData.data.otp;
                            cc.log("-----------SEASION AUTO LOGIN-----------");
                            thiz.authenGameServer('', '');
                            return;
                        }


                        cc.log("-----------SEASION AUTO LOGIN-----------");
                        thiz.authenGameServer('', '');
                        return;
                    }
                }


                thiz._accessToken = null;
                thiz._refreshToken = null;
                HttpRequest.requestGETMethod(HostConfig.services.id, null, param, function (status, response) {
                    if(status == HttpRequest.RES_SUCCESS && response){
                        cc.log("_onLobbyStatus : response login HttpRequest "+ JSON.stringify(response) );
                        thiz.pwdEncryptedAES = '';
                        var status = response.status;
                        PlayerMe.security = response.data.otp;
                        if(status != Constant.STATUS.SUCCESS){
                            MiniGameLoadingDialog.getInstance().hide();
                            if(status == Constant.STATUS.USE_OTP){//show dialog nhap otp de choi
                                LoginData.signatureData = response;
                                thiz._accessToken = LoginData.signatureData.data.accessToken;
                                thiz._refreshToken = LoginData.signatureData.data.refreshToken;
                                MH.openLoginOTP();

                            }else if(thiz.handlerLoginFail){
                                var msg = response.data.message;
                                if(!msg){
                                    var info = Constant.STATUS_STR[status];
                                    msg = info ? info.msg : "Lỗi "+status;
                                }
                                thiz.handlerLoginFail(msg);
                                thiz.handlerLoginFail = null;

                            }
                           /* MiniGameLoadingDialog.getInstance().hide();
                            var info = Constant.STATUS_STR[status];
                            var msg = info ? info.msg : "Lỗi "+status;
                            var dialog = new MessageOkDialog();
                            dialog.setMessage(msg);
                            dialog.showWithAnimationScale();*/
                            return;
                        }
                        LoginData.signatureData = response;
                        thiz._accessToken = LoginData.signatureData.data.accessToken;
                        thiz._refreshToken = LoginData.signatureData.data.refreshToken;

                        //cc.log("_onLobbyStatus "+thiz.username + ":"+thiz.password);
                        thiz.authenGameServer(thiz.username, thiz.password);
                    }
                    else{
                        MiniGameLoadingDialog.getInstance().hide();
                        //KO DUNG DUOC MessageOkDialog VI CHUA VAO GAME CHUA CO PIXI.APP
                        /*var dialog = new MessageOkDialog();
                        dialog.setMessage("Đăng nhập thất bại");
                        dialog.showWithAnimationScale();*/

                        MH.createPopup({
                            title:'',
                            width:'600px',
                            content:[
                                {
                                    tag:'p',
                                    text:"Đăng nhập thất bại",
                                }
                            ]
                        });
                    }
                });

            }else if(event == "LostConnection"){
                MH.popup.close("all");
                //try reconnect dung server dang dung -> neu ko duoc thi show dialog ask co muon ket noi lai or tu dong
                //ket noi sau xxx seconds
                // if(this._isReconnecting) return;//prevent spam event LostConnection
                cc.log("MiniGameClient:: command " +command+ " event "+event);
                cc.log(" reConnect => LostConnection");
                this.reConnect();
            }else if(event == "ConnectFailure"){
                //change ws ket noi lai
                MH.popup.close("all");
                cc.log("MiniGameClient:: command " +command+ " event "+event);
                this.close();
                var currentScene = MH.currentPage();//home || game || play || signup
                if(currentScene == "home"){
                    //login but fail => tiep tuc login till die =))
                    if(!cc.isClientGameBai() ) MiniGameLoadingDialog.getInstance().show("Đang kết nối lại");
                    MiniGameClient.getInstance().connect(this.username, this.password,this.loginType, Constant.CONNECT_TYPE.NORMAL);

                }else{
                    //reconnect but fail to connect ws => show dialog ket noi sau xxx s
                   /* var msg = "Tự động kết nối lại sau 5s\n Kết nối ngay?";
                    var dialog = new MessageReconnectDialog(5);
                    dialog.setMessage(msg);
                    dialog.showWithAnimationScale();*/

                    MiniGameLoadingDialog.getInstance().showReconnect();


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
            MiniGameLoadingDialog.getInstance().hide();
            if(!isSuccess){

                if(this.handlerLoginFail){
                    this.handlerLoginFail(errorStr);
                    this.handlerLoginFail = null;
                }
                return;
            }
            // wait cmd 100 userinfo tra ve moi hide loading bar- luk nay moi tinh login succ
            // mini game thi ko can doi cmd 100, cmd tra ve sau thi update info cung dc
            cc.log('minigame login done ');
            //DANG KY LAY REPSONE cac mini game
            this.obServerAllMiniGame();

            this.isLogin = true;
            this.loadReward();
            this.onUpdateMoney();
            MH.minigame.login();
            this.postEvent(CMD_OBSERVER.OBSERVER_SLOT_RECONNECT, {});
            TopHuClient.getInstance().logOut();
        };
        /**
         * code for html call
         */
        this.logOut = function(){
            cc.log('CALL LOG OUT MINIGAME');

            MiniGameClient.getInstance().close();
            this.isLogin = false;
            this.obServerData = [];
            MH.minigame.logout();
            LoginData.paygateData = null;//reset de login se get lai info
            LoginData.smsActive = {};
            LoginData.broastCastArr = [];
            LoginData.unreadMsg = 0;
            LoginData.newAnnounceMsg = 0;
        };
        this._onLogOutRes= function (command, data){
            //[messageId:Int 2, success:bool, reason:Int]  => [2,true,4]
            if(data[1]){
                //logout success
                this.logOut();

                var reason = data[2];
                var msg = "";
                switch(reason){
                    case reason_v52.KICK_IDLE:
                        msg = "Bạn thoát do không thao tác trong 1 thời gian dài";
                        break;
                    case reason_v52.KICK_LOGIN_OTHER_DEVICE:
                        msg = "Bạn thoát do có người đăng nhập vào tài khoản của bạn";
                        break;
                    case reason_v52.LOGOUT:
                        msg = "";// user tu logout, ko show msg
                        break;
                    case reason_v52.KICKED:
                        msg = "Bạn bị kick khỏi hệ thống";
                        break;
                    default :
                        msg = "Tài khoản bị đăng xuất ra ngoài";
                        break;
                }
                if(msg && msg.length ){
                    cc.log("MiniGame => "+msg);
                    if(!cc.isClientGameBai()){
                        MH.createPopup({
                            title:'Đăng xuất',
                            width:'600px',
                            content:[
                                {
                                    tag:'p',
                                    text:msg,
                                }
                            ]
                        });
                    }
                }
            }
        };
        this._onRoomPluginMsg= function (command, dataObj){
            //cc.log(command+ "minigame _onRoomPluginMsg => "+ JSON.stringify(dataObj));
            //[5,{"tst":1499309896478,"mgs":"đây là tin nhắn chat","cmd":1308,"fu":"dohimi123"}]
            var cmd = dataObj[1][Constant.CONSTANT.CMD];

            if(cmd === 10000){//top hu~
                //cc.log(command+ "MINIGAMEClinet TOPHU _onRoomPluginMsg => "+ JSON.stringify(dataObj));
                TopHuClient.getInstance().postEvent(cmd.toString(), dataObj);
            }else if(cmd === 104){
                this._onBroastCast(command, dataObj);
            }else if(cmd === 100) {
                cc.log("cmd 100 minigame ----------");
                //this.isLogin = true;
                this.updateUserInfo(dataObj);

                this._onUserInfo(command, dataObj);
                this.reConnectDone(dataObj[1]);
                
                if(this.handlerLoginDone){
                    this.handlerLoginDone();
                    this.handlerLoginDone =null;
                }
            }else if(cmd === 310) {
                //update tien
                //alert("update money "+JSON.stringify(dataObj[1].As));
                var info = dataObj[1].As;
                var gold = info.gold;
                var chip = info.chip;
                var vip = info.vip;
                PlayerMe.gold = gold;
                PlayerMe.chip = chip;
                PlayerMe.vip = vip;
                PlayerMe.moneySafe = info.safe;
                this.postEvent(kCMD.UPDATE_MONEY,dataObj[1] );
                cc.log("post event");
                MH.user.reload();//update chip gold tren html
                //TRONG USER INFO CUNG ADDLISTENER UPDATE_MONEY => UDATE LABEL TRONG DO
            }else{
                this.postEvent(cmd.toString(), dataObj);
            }
        };

        this.onObserverResponse= function (command, dataObj){
            cc.log("onObserverResponse "+JSON.stringify(dataObj));
            var data = dataObj[1];
            var gameId = data.gid;
            this.obServerData[gameId] = data;
            MiniGameClient.getInstance().postEvent(kCMD.OBSERVER_RESPONSE,{} );
        };
        this.getObserverDataByGameId = function(gId){
            if(!this.obServerData || !this.obServerData.length){
                cc.log("chua co data ");
                return;
            }
            return this.obServerData[gId];
        };
        this.resetObserverDataByGameId = function(gId){
            if(!this.obServerData || !this.obServerData.length){
                cc.log("chua co data ");
                return;
            }
             this.obServerData[gId] = null;
        };

        /**
         * click vao game # server voi current server
         * or login vao ma van dang choi # sid
         * @param serverId
         */
        this.changeServerAndJoinGame= function(serverId){
            this.close();
            cc.log( " changeServerAndJoinGame........... ");
            //if(!cc.isClientGameBai() ) MiniGameLoadingDialog.getInstance().show("Đang kết nối");
            MiniGameClient.getInstance().connect(this.username, this.password,this.loginType, Constant.CONNECT_TYPE.CHANGE_SERVER_SPECIFC, serverId);

        };
        this.reConnect= function (){
            //ket noi lai
            this.close();
            cc.log( " reConnecting........... ");
            if(!cc.isClientGameBai() ) MiniGameLoadingDialog.getInstance().show("Mất kết nối .Đang kết nối lại");
            MiniGameClient.getInstance().connect(this.username, this.password,this.loginType, Constant.CONNECT_TYPE.RECONNECT);
            this._isReconnecting = true;

        };
        this.reConnectDone= function (data){
            if(!this._isReconnecting) return;
            this._isReconnecting = false;
            MiniGameLoadingDialog.getInstance().hide();


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

            cc.log('minigame userinfo', data);
        };
        this._onUserInfo= function (command, data){
            cc.log(command+ "MiniGame _onUserInfo => "+ JSON.stringify(data));

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
                MiniGameLoadingDialog.getInstance().hide();
                //currentScene.onLoginDone();

            }

        };
        this.loadWithAccessToken= function(url, callback){
            var token = LoginData.signatureData.data.accessToken;
            var request = cc.loader.getXMLHttpRequest();
            request.open("GET", url, true);
            request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
            //request.setRequestHeader("Authorization",""+token);
            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    //get status text
                    var httpStatus = request.statusText;
                    cc.log("loadWithAccessToken response: "+request.response);

                }
            };
            request.send();
        };

        this.login = function(name, pass,handlerLoginDone , handlerLoginFail){
            this.handlerLoginDone = handlerLoginDone;
            this.handlerLoginFail = handlerLoginFail;
            //cc.log("call minigame login");
            /*if(name === "kaka167"){
             cc.Global.SetSetting("debug", true);
             }else{
             cc.Global.SetSetting("debug", false);
             }*/
            cc.Global.loginType = LoginType.Normal;
            //luon luon save for reconnecting if need
            cc.Global.SetSetting(USER,name);
            cc.Global.SetSetting(PASS, pass);
            if(!cc.isClientGameBai() ) MiniGameLoadingDialog.getInstance().show("Đang đăng nhập");
            MiniGameClient.getInstance().connect(name, pass,LoginType.Normal, Constant.CONNECT_TYPE.NORMAL);
        },

        this.loginFBHandler = function(handlerLoginDone, handlerLoginFail){
            cc.log('MiniGameClient.loginFBHandler');
            this.handlerLoginDone = handlerLoginDone;
            this.handlerLoginFail = handlerLoginFail;
            var thiz = this;
            MiniGameClient.getInstance().clickLoginBtn = true;
            this.loginType = LoginType.FB;
            if(!cc.isClientGameBai()) MiniGameLoadingDialog.getInstance().show("Đang đăng nhập FB");
            FB.login(function(response) {
                if (response.authResponse) {
                    cc.log('MiniGameClient => Welcome!  Fetching your information.... ');
                    FB.api('/me', function(response) {
                        cc.log('Good to see you, ' + response.name + '.');
                        cc.log('Good to see you, api/me ' + Utils.encode(response));
                        FB.getLoginStatus(function(response) {
                            thiz.statusChangeCallback(response);
                        });

                    });
                } else {
                    cc.log('User cancelled login or did not fully authorize.');
                    MiniGameLoadingDialog.getInstance().hide();
                }
            });
        };
        this.statusChangeCallback= function(response) {
            //cc.log('statusChangeCallback');
            cc.log("FB statusChangeCallback "+JSON.stringify(response));
            // The response object is returned with a status field that lets the
            // app know the current login status of the person.
            // Full docs on the response object can be found in the documentation
            // for FB.getLoginStatus().

            if (response.status === 'connected') {
                // Logged into your app and Facebook.

                cc.Global.loginType = LoginType.FB;
                cc.Global.fbLoginToken = response.authResponse.accessToken;

                MiniGameClient.getInstance().connect(cc.Global.fbLoginToken, "",LoginType.FB, Constant.CONNECT_TYPE.NORMAL);

                if(!cc.isClientGameBai() ) MiniGameLoadingDialog.getInstance().show();
            } else if (response.status === 'not_authorized') {
                // The person is logged into Facebook, but not your app.
                // document.getElementById('status').innerHTML = 'Please log ' +
                //   'into this app.';
                if(!cc.isClientGameBai() ) MiniGameLoadingDialog.getInstance().show();
            } else {
                // The person is not logged into Facebook, so we're not sure if
                // they are logged into this app or not.
                // document.getElementById('status').innerHTML = 'Please log ' +
                //   'into Facebook.';
                if(!cc.isClientGameBai() ) MiniGameLoadingDialog.getInstance().show();
            }
        };

        this.onUpdateMoney= function(){
            var sendObj = [
                command.ZonePluginMessage,
                Constant.CONSTANT.ZONE_NAME_MINI_GAME,
                "channelPlugin",
                {'cmd':310
                }
            ];
            this.send(sendObj);
            cc.log("send onUpdateMoney "+JSON.stringify(sendObj));
        };
        this.verifyOtpLoginDoneThenAuthenAcc = function(response){
            var thiz = this;
            LoginData.signatureData = response;
            thiz._accessToken = LoginData.signatureData.data.accessToken;
            thiz._refreshToken = LoginData.signatureData.data.refreshToken;

            // var _signatureData = window.btoa( JSON.stringify(LoginData.signatureData) );
            // MH.setCookie("_signatureData",  _signatureData, 1);//save 1 day


            //cc.log("_onLobbyStatus "+thiz.username + ":"+thiz.password);
            thiz.authenGameServer(thiz.username, thiz.password);
        };
        this._showKichHoatSuggest = function(){
            if(LoginData.smsActive && Object.keys(LoginData.smsActive).length){
                var msgSms = "Soạn tin nhắn theo cú pháp dưới đây để kích hoạt tài khoản"
                    +"<br>Viettel: "+ LoginData.smsActive["1"]
                    +"<br>Vinaphone: "+ LoginData.smsActive["2"]
                    +"<br>Mobiphone: "+ LoginData.smsActive["3"];
                PlayerMe.kichhoat = msgSms;
                MH.createPopup({
                    title:'',
                    width:'600px',
                    delay: 200,
                    content:[
                        {
                            tag:'p',
                            text:msgSms,
                        }
                    ]
                });
            }

        };
        this._onFetchConfig = function (cmd, data) {
            //cc.log("aaa "+JSON.stringify(data));
            LoginData.paygateData = data;
            if(!data || !data["data"]) return;
            var dataSms = data["data"].sms;
            // cc.log("dataSms "+JSON.stringify(dataSms));
            if(dataSms && dataSms.length >0){
                for(var i = 0 ; i < dataSms.length;i++){
                    var sms = dataSms[i];
                    // cc.log("---- "+sms["name"] );
                    if(sms["name"] == "SMS_Active"){
                        var telcoId = sms["telcoId"];
                        var syntax = sms["syntax"].replace("%userId%", PlayerMe.id);
                        LoginData.smsActive[telcoId.toString()] = syntax;
                    }
                }
            }
            //alert("_onFetchConfig");
             //cc.log("----_onFetchConfig "+JSON.stringify(LoginData.smsActive) );


        };

        this._onFetchAllCashoutItems = function (cmd, data) {
            LoginData.paygateRewardData = data;
        };

        this.loadReward=function(){
            if(!LoginData.paygateRewardData){
                var request = {
                    command : "fetchAllCashoutItems"
                };
                this.httpRequest(HostConfig.services.paygate, request);
            }

            if(!LoginData.paygateData){
                var request = {
                    command : "fetchConfig"
                };
                this.httpRequest(HostConfig.services.paygate, request);
            }

            MyRequest.fetchAllCashoutItems(function(cmd, data){
                cc.log("fetchAllCashoutItems "+JSON.stringify(data) );
            });

        };
       

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