/**
 * Created by  on 6/23/2016.
 *
 *
 *
 */
var REASON_QUIT = REASON_QUIT || {
        IDLE:1,
        REJECT_GOP_GA:2
    };


var LobbyClient = (function () {
    var instance = null;

    var Clazz = function(){
        this.ctor = function () {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                var thiz = this;

                this.allListener = {};
                this.serverIndex = 0;
                this.isKicked = false;
                this.loginHandler = null;
                this.isReconnected = false;
                this.isLogined = false;



                this.lobbySocket = new socket.LobbyClient();
                this.lobbySocket.onEvent = function (messageName, data) {
                    thiz.onEvent(messageName, data);
                };

                this.isLogin = false;
                this.clickLoginBtn = false;
                this.host = "ws://125.212.192.97";
                this.port = -1;//8888;
                this.addListener("LobbyStatus", this._onLobbyStatus, this);
                //this.addListener(kCMD.USER_INFO, this._onUserInfo, this);
                this.addListener(kCMD.LOGIN, this._onLogInRes, this);
                this.addListener(kCMD.LOGOUT, this._onLogOutRes, this);
                this.addListener(kCMD.JOINROOM, this._onJoinRoomFunc, this);
                this.addListener(kCMD.LeaveRoom, this._onLeaveRoomFunc, this);
                this.addListener(kCMD.RoomPluginMessage, this._onRoomPluginMsg, this);
                //this.addListener(kCMD.BROASTCAST, this._onBroastCast, this);


                this.addListener("fetchConfig", this._onFetchConfig, this);
                this.addListener("fetchAllCashoutItems", this._onFetchAllCashoutItems, this);
            }
        };



        this.send = function (message) {
            if (this.lobbySocket) {
                //cc.log("send :::: "+message);
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
                PlayerMe.avatar = "";
                this.isKicked = false;
                this.lobbySocket.connect(host);

            }
        };

        this.onEvent = function (messageName, data) {
            /*if (messageName == "socketStatus") {
                this.postEvent("LobbyStatus", data);
            }
            else if (messageName == "message") {
                var messageData = JSON.parse(data);
                // if (messageData.command == "error") {
                //     LobbyClient.ErrorHandle(messageData.errorCode);
                // }

                this.postEvent(messageData.command, messageData);
            }*/


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


        this.isClickLogin= function(){
            return this.clickLoginBtn;
        };
        this.isLoginDone= function(){
            return this.isLogin;
        };

        this.connect = function (user, pass, loginType,connectType, serverId) {
            MH.popup.close("all");
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
            if(HostConfig.servers.length <= 0){
                var cb = function () {
                    cc.log("load config before login done => login");
                    if(thiz.lobbySocket){
                        LoadingDialog.getInstance().show("Đang đăng nhập");//reset timeout
                        cc.log("load config before login done => login connecting");
                        var server = thiz.getServer(connectType,serverId);
                        cc.log('connect server', server);
                        if( server["wsEndpoint"] ){
                            this.connectTo( server["wsEndpoint"] );
                        }else if(server["ip"] && server["webSocketPort"]){
                            this.connectTo("wss://"+server["host"]+":"+server["webSocketPort"]+"/websocket");
                        }
                        //thiz.connectTo("wss://"+server["ip"]+":"+server["webSocketPort"]+"/websocket");
                        HostConfig.currentServer = server;
                    }
                }
                cc.log("load config before login");
                LoadingDialog.getInstance().show("Đang tải cấu hình");
                this.loadConfig( cb);
            }else{
                var server = this.getServer(connectType,serverId);
                cc.log('sv info', server);
                if( server["wsEndpoint"] ){
                    this.connectTo( server["wsEndpoint"] );
                }else if(server["ip"] && server["webSocketPort"]){
                    this.connectTo("wss://"+server["host"]+":"+server["webSocketPort"]+"/websocket");
                }
                HostConfig.currentServer = server;
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

            var header = {};
            if(this._accessToken){
                header.Authorization = this._accessToken;
            }

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

        this.loadDistributor = function(callback){
            var thiz = this;
            cc.Global.verifyTest();
            if(Distributor.distId && Distributor.applicationId){
                // neu fix thi ko can load tu serrver nua
                //Distributor.distId = data.distId;
                //Distributor.applicationId = data.applicationId;
                LobbyClient.getInstance().loadConfig();
                thiz._loadConfig = true;
                if(!hiepnh.isUndefined(callback)){
                    callback();
                }
               // alert("ko load dis nua");
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
                        return;
                    }
                    var data = response.data;
                    Distributor.distId = data.distId;
                    Distributor.applicationId = data.applicationId;
                    //thiz.titleConfig.string = "Tải cấu hình game ok. ";
                    LobbyClient.getInstance().loadConfig();
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
                }
            });
        };
        this.loadConfig = function(callback){
            if(arguments.length == 1) this.configLoadedCallback = arguments[0];

            var url = ServerConfig.getLinkACS(Distributor.distId, Distributor.applicationId);
            var thiz = this;
            var version = VERSION_ID_TEST;
            var plalform = PLATFORM_ID_TEST;
            if(!cc.Global.GetSetting("test"+APPNAME, false)){

                version = VERSION_ID;
                plalform = PLATFORM_ID;
            }
            if(!Distributor.applicationId || !Distributor.distId){
                /*MH.createPopup({
                    title:'',
                    width:'600px',
                    content:[
                        {
                            tag:'p',
                            text:"Đăng nhập thất bại",
                        }
                    ]
                });*/
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
                // cc.log("loadConfig response=> "+JSON.stringify(response) );
                if(status == HttpRequest.RES_SUCCESS && response){
                    var status = response.status;
                    if(status != 0){
                        if(callback != null){
                            console.log("Không thể tải thông tin cấu hình game");
                            /*var dialog = new MessageOkDialog();
                            dialog.setMessage("Không thể tải thông tin cấu hình game");
                            dialog.showWithAnimationScale();*/
                        }

                        return;
                    }
                    var data = response.data;
                    // console.log('get-bid success', data);
                    var servers = data.config.servers;
                    if(USE_TEST_SERVER){
                        for(var i = servers.length -1 ; i>=0; i--){
                            if(VIP52_IP_REJECT.indexOf(servers[i].ip) != -1 ){
                                servers.splice(i,1);
                            }

                        }
                    }
                    HostConfig.ctconfig = data.config;
                    HostConfig.servers = servers;//data.config.servers;
                    var defaultServerID = data.config.defaultServer;
                    HostConfig.defaultServerID = defaultServerID;
                    //cc.log("get defaultserver defaultServerID "+ defaultServerID);
                    var replace = BASE_URL_TEST;
                    if(!cc.Global.GetSetting("test", false)) {
                        replace = BASE_URL;
                    }
                    HostConfig.services = data.config.services;
                    HostConfig.services.sa = HostConfig.services.sa.replace("http://sandbox.api1bai247.info", replace);
                    HostConfig.services.id= HostConfig.services.id.replace("http://sandbox.api1bai247.info", replace);
                    HostConfig.services.paygate =HostConfig.services.paygate.replace("http://sandbox.api1bai247.info", replace);
                    HostConfig.miniGameServer =data.config.miniGameServer;

                    // TopHuClient.getInstance().login();

                    // var _info = window.btoa( JSON.stringify(HostConfig.miniGameServer) );
                    // MH.setCookie("miniGameServer",  _info, 100);

                    // var _infoServices = window.btoa( JSON.stringify(HostConfig.services) );
                    // MH.setCookie("_infoServices",  _infoServices, 100);

                    // if( typeof jQuery === 'function' ) jQuery(window).trigger('ConfigSuccess');

                    // if(callback != null){
                    //   callback();

                    //  }

                    if( LobbyClient.getInstance().configLoadedCallback ) LobbyClient.getInstance().configLoadedCallback();

                }
                else{
                    //LoadingDialog.getInstance().hide();
                    if(callback != null){
                        cc.log("Không thể tải thông tin cấu hình game");
                        /*var dialog = new MessageOkDialog();
                        dialog.setMessage("Không thể tải thông tin cấu hình game");
                        dialog.showWithAnimationScale();*/
                    }
                }
            });


        };
        this.getServer= function( connectType, serverId ){
            if(!serverId) serverId = -1;
            var server =cc.Global.getRandomServer();
            switch(connectType){
                case Constant.CONNECT_TYPE.NORMAL:
                    server =cc.Global.getRandomServer();
                    break;
                case Constant.CONNECT_TYPE.RECONNECT:
                    server = HostConfig.currentServer;//cc.Global.getRandomServer();
                    break;
                case Constant.CONNECT_TYPE.CHANGE_RADOM_SERVER:
                    server =cc.Global.getRandomServer();
                    this.numberRetry=1;
                    break;
                case Constant.CONNECT_TYPE.CHANGE_SERVER_SPECIFC:
                    server =cc.Global.getServerById(serverId);
                    break;
            }
            cc.log("getServer "+JSON.stringify(server));
            HostConfig.currentServer = server;
            return server;
        };
        this.authenGameServer = function(user ,pass, connectType ){
            if(!connectType) connectType = Constant.CONNECT_TYPE.NORMAL;
            var signature = LoginData.signatureData.data.signature;
            var info = LoginData.signatureData.data.info;
            var loginSend = [
                command.LOGIN,
                Constant.CONSTANT.ZONE_NAME,
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
            // cc.log("authen send "+JSON.stringify(msg));
            this.send(msg);
        };
        this.updateUserInfo= function (data) {
            var jObj= data[1];
            LoginData.userinfo = jObj;

            var uid = jObj.uid;
            var avatar = "res/avatar.png";//jObj.a;
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
            PlayerMe.kichhoat = kichhoat;
            PlayerMe.moneySafe = safe;
        };
        this._onLobbyStatus= function (command, event) {
            if(event === "Connected"){
                //LoadingDialog.getInstance().hide();
                cc.log("LobbySocket:: command " +command+ " event "+event);
                var thiz = this;
                var param = {
                    command : "login2",
                    username : this.username,
                    password : this.password,
                    platformId : 4
                };
                if(this.loginType == LoginType.FB){
                    if(!cc.Global.fbLoginToken || cc.Global.fbLoginToken.length == 0 ){
                        cc.log("fb chua lay dc token return");
                        LoadingDialog.getInstance().hide();
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
                if( MH.getCookie('_signatureData') ){
                    var info = "{}"; //window.atob( MH.getCookie('_signatureData') );
                    //cc.log("=========="+ JSON.stringify(info));
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


                    }
                }



                //


                thiz._accessToken = null;
                thiz._refreshToken = null;

                HttpRequest.requestGETMethod(HostConfig.services.id, null, param, function (status, response) {
                    cc.log("login2 response", status, response);
                    if(status == HttpRequest.RES_SUCCESS && response){
                        // cc.log("_onLobbyStatus : response login HttpRequest "+ JSON.stringify(response) );
                        thiz.pwdEncryptedAES = '';
                        var status = response.status;
                        PlayerMe.security = response.data.otp;
                        if(status != Constant.STATUS.SUCCESS){
                            LoadingDialog.getInstance().hide();
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
                           /* LoadingDialog.getInstance().hide();
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

                        cc.log("_onLobbyStatus login success");
                    }else{
                        LoadingDialog.getInstance().hide();
                        //KO DUNG DUOC MessageOkDialog VI CHUA VAO GAME CHUA CO PIXI.APP
                        /*var dialog = new MessageOkDialog();
                        dialog.setMessage("Đăng nhập thất bại");
                        dialog.showWithAnimationScale();*/

                        MH.createPopup("Đăng nhập thất bại");
                        cc.log("Đăng nhập thất bại", "status", status);
                    }
                });


            }else if(event == "LostConnection"){
                MH.popup.close("all");
                cc.log("LobbySocket:: command " +command+ " event "+event);
                cc.log(" reConnect => LostConnection");
                this.reConnect();
            }else if(event == "ConnectFailure"){
                MH.popup.close("all");
                //change ws ket noi lai
                cc.log("LobbySocket:: command " +command+ " event "+event);
                this.close();
                var currentScene = MH.currentPage();//home || game || play || signup \\ playslot(tamgioi)
                // DANG TRONG MIN SLOT ma register ac thi  ko the ConnectFailure vì chỉ có 1 server minigame
                if(currentScene == "home" || currentScene == "signup"){
                    //login but fail => tiep tuc login till die =))
                    LoadingDialog.getInstance().show("Đang kết nối lại");
                    LobbyClient.getInstance().connect(this.username, this.password,this.loginType, Constant.CONNECT_TYPE.NORMAL);

                }else{
                    //reconnect but fail to connect ws => show dialog ket noi sau xxx s
                   /* var msg = "Tự động kết nối lại sau 5s\n Kết nối ngay?";
                    var dialog = new MessageReconnectDialog(5);
                    dialog.setMessage(msg);
                    dialog.showWithAnimationScale();*/

                    MH.loadingDialog.show({
                        text:"Tự động kết nối lại sau 2s",
                        timeout: 2000,
                        afterTimeout: function(){
                            LobbyClient.getInstance().reConnect();
                        }
                    });
                }
            }

        };
        this.verifyOtpLoginDoneThenAuthenAcc = function(response){
            var thiz = this;
            LoginData.signatureData = response;
            thiz._accessToken = LoginData.signatureData.data.accessToken;
            thiz._refreshToken = LoginData.signatureData.data.refreshToken;

            // var _signatureData = window.btoa( JSON.stringify(LoginData.signatureData) );
            // MH.setCookie("_signatureData",  _signatureData, 1);//save 1 day


            cc.log("verifyOtpLoginDoneThenAuthenAcc ");
            thiz.authenGameServer(thiz.username, thiz.password);
        };
        this._showKichHoatSuggest = function(){
            if(SHOW_OTP){
                // jQuery('#popup-xacthuc').data('mhPopup').open();
            }else if(LoginData.smsActive && Object.keys(LoginData.smsActive).length){
                var msgSms = "Soạn tin nhắn theo cú pháp dưới đây để kích hoạt tài khoản"
                    +"<br>Viettel: "+ LoginData.smsActive["1"]
                    +"<br>Vinaphone: "+ LoginData.smsActive["2"]
                    +"<br>Mobiphone: "+ LoginData.smsActive["3"];
                PlayerMe.kichhoat = msgSms;
                MH.createPopup(msgSms);
            }
            /*else if(PlayerMe.kichhoat && PlayerMe.kichhoat.length){

                MH.createPopup({
                    title:'',
                    width:'600px',
                    delay: 1200,
                    content:[
                        {
                            tag:'p',
                            text:PlayerMe.kichhoat,
                        }
                    ]
                });
            }*/
        };
        this._onUserInfo= function (command, data){
            // cc.log(command+ " _onUserInfo => "+ JSON.stringify(data));
            // cmd 100 tra ve => login done
            //[5,{"uid":"14fef528-64d6-4024-b7e9-fda2d6b13237",
            // "a":"http://s3.api1bai247.info/images/avatar/ava-(20).jpg",
            // "As":{"gold":0,"chip":0,"vip":0};"u":"tuantv10","g":0,
            // "vm":"Vui lòng kích hoạt với mã V52 KH 1544 gửi 6191 (1.5k/SMS) để nhận 5.000 QUAN và kích hoạt đổi thưởng",
            // "ph":"","dn":"tuandeptrai12","cmd":100,"id":1544,"am":"Để đổi thưởng vui lòng kích hoạt tài khoản với mã (V52 KH 1544 gửi 6191) để được tặng 5.000 QUAN (chơi đổi thưởng), 100.000 XU (chơi\n\t\t\t\tgiải trí)
            // và đảm bảo bảo mật tài khoản","pvr":false}]
            this.updateUserInfo(data);
            var jObj= data[1];
            var phoneVerify = jObj.pvr;
            var lastRoom = jObj.lr;
            var kichhoat = jObj.am;
            var displayName = jObj.dn;
            if(lastRoom){
                lastRoom.timeResponse  = new Date().getTime()/1000;
                lastRoom.isTryReconnect = false;
            }
            if(lastRoom) PlayerMe.roomInfoReconnect = lastRoom;

            // add in html5 version
            if(this.handlerLoginDone){
                cc.log("handlerLoginDone");
                this.handlerLoginDone();
                this.handlerLoginDone = null;
            }
            var currentScene = MH.currentPage();//home || game || play || signup
            //var currentScene = {type:"HomeScene"};//cc.director.getRunningScene();
            //currentScene.type prevent reconnect in lobby or game ma chua kick hoat se popup activeDialog
            if(!phoneVerify && displayName && !lastRoom && currentScene == "home"){//prevent not verify phone but disconnect and reconnect when refresh browseer

                this._showKichHoatSuggest();

                this.loadReward();
            }
            else
            if(( !displayName || displayName.length===0) && currentScene == "home"){
                cc.log("pending show dialog UPDATE ten hien thi");
                MH.updateDPN.open();
                /*var dialog = new UpdateNameLayer();
                dialog.showWithAnimationScale();*/
                this.loadReward();
            }else if(lastRoom && HostConfig.currentServer.id !== lastRoom.sid){

                cc.log('***********onReconnectRoom test change server login scene');
                this.changeServerAndJoinGame(lastRoom.sid);
                return;

            }else{
                //join phong sau khi switcher server success
                //globalData.getData().isChangingServer = false;
                //var self = MainLobbySence.instance;

                if(PlayerMe.roomInfoReconnect){
                    //self.showPanelInfo(true);
                    cc.log('*********onReconnectRoom onJoinRoom');

                    cc.Global.gameId = PlayerMe.roomInfoReconnect.gid;
                    this._currentRoomID = PlayerMe.roomInfoReconnect.rid;

                    this.onJoinRoom(PlayerMe.roomInfoReconnect);


                }else{
                    //normal login

                    cc.log('normal login ***************');
                    this.onUpdateMoney();
                    this.loadReward();


                }
            }


            if(MH.currentPage('home')){
                //!=HomeScene co the la reconnect => ko doi scene, giu nguyen scene hien tai
                LoadingDialog.getInstance().hide();
                //currentScene.onLoginDone();

            }

        };
        this._onLogInRes= function (command, data){
            cc.log(command+ " _onLogInRes => "+ JSON.stringify(data));
            //[1,true,0,"tuantv10","Simms",null]
            var isSuccess = data[1];
            var errorStr = data[5];
            //[1,false,104,"dohimi",null,"Website tạm thời bảo trì. Mời bạn quay lại sau"]
            if(!isSuccess){

                MH.setCookie("_signatureData",  '', -1);
                if(!errorStr || !errorStr.length) errorStr = "Đăng nhập thất bại. Mã lỗi "+ data[2];

                 LoadingDialog.getInstance().hide();
                /*LoadingDialog.getInstance().hide();
                if(!errorStr || !errorStr.length) errorStr = "Đăng nhập thất bại"
                var dialog = new MessageOkDialog();
                dialog.setMessage(errorStr);
                dialog.showWithAnimationScale();*/
                if(this.handlerLoginFail){
                    this.handlerLoginFail(errorStr);
                    this.handlerLoginFail = null;
                }
                /* pending check chu ky het han thi day la login
                else if(data[2] == true){
                    this.isLogin = false;
                    this.close();
                    MH.changePage("home");

                    var reason = data[2];
                    var msg = "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại";
                    if(msg && msg.length ){
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
                    this.logOut();
                    MH.logOut();//remove userinfobat html
                    this.destroyGame();//post destroy event
                }*/
                return;
            }
            // wait cmd 100 userinfo tra ve moi hide loading bar- luk nay moi tinh login succ
            cc.log('login done - wait cmd 100 '+ data);
            FriendPlugin.getInstance();//add some listner friend ....
            ChatPlugin.getInstance();
        };
        /**
         * code for html call
         */
        this.logOut = function(){
            LobbyClient.getInstance().close();
            LoginData.paygateData = null;//reset de login se get lai info
            LoginData.smsActive = {};
            LoginData.broastCastArr = [];
            LoginData.unreadMsg = 0;
            LoginData.newAnnounceMsg = 0;
            this.isLogin = false;

        };
        this._onLogOutRes= function (command, data){

            cc.log(command+ " _onLogOutRes => "+ JSON.stringify(data));
            //[messageId:Int 2, success:bool, reason:Int]  => [2,true,4]
            if(data[1]){
                //logout success
                this.isLogin = false;
                this.close();
                MH.changePage("home");
                console.log("change page to home");
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
                    MH.createPopup(msg);
                }
                this.logOut();
                MH.logOut();//remove userinfobat html
                this.destroyGame();//post destroy event
            }
        };
        this._onJoinRoomFunc= function (command, data){
            cc.log(command+ " _onJoinRoomFunc => "+ JSON.stringify(data));
            //[messageId:Int 2, success:bool, reason:Int]  => [2,true,4]null
            //[3,true,0,1,null]
            PlayerMe.roomInfoReconnect = null;//reset here de neu join room ma fail thi clear luon
            //LoadingDialog.getInstance().hide();

            if(data[1] == true){
                this._currentRoomID   = data[3];
                //wait cmd 202 Constant.CMD_RESULT.ROOM_INFO co info room thi moi tinh la join done
            }else {
                LoadingDialog.getInstance().hide();
                var errorCode = data[2];
                //if(errorCode === 101 ) return;//ko the vao khi dang o phong #
                var msg = data[4];
                if(!msg || !msg.length){
                    var info = Constant.ERROR_STR[errorCode];
                    msg = info ? info.msg : "Không vào được phòng";
                }

                if(this.handlerJoinRoomSuccess){
                    //handlerJoinRoom set in LobbyRequest.joinRoom();
                    this.handlerJoinRoomSuccess(false, msg);
                    this.handlerJoinRoomSuccess = null;
                }
                this.isJoiningRoom = false;//set below callback



            }


        };
        this.checkkickWhenEndGame= function (){
            //call every time end 1 game
            if(this._handlerKickWhenEndGame){
                this._handlerKickWhenEndGame();
                this._handlerKickWhenEndGame = null;
                this._gameState = null;
            }
        };

        this._onLeaveRoomFunc= function (cmd, data){
            cc.log(cmd+ " _onLeaveRoomFunc => "+ JSON.stringify(data), new Date().getTime());
            //LoadingDialog.getInstance().hide();

            //[4,true,2,21,2,"Bạn thoát vì không sẵn sàng"]onleave
            //[4,false,1,5,153,"Bạn không thể rời phòng khi đang chơi"]
            if(data[0] == command.LeaveRoom && data[1]){//[4,true,1,5,0,""]
                var erorcode = data[2];
                if(!data[5] || data[5] != null){
                    //pengind task commnet below
                    if( erorcode ===2 && (this._gameState ===4 || this._gameState ===5)){
                        if( this._gameState ===4 || this._gameState ===GAME_STATE.SHOW_KQ ){
                        
                        }else{
                            MH.createPopup(data[5]);
                            this.gotoLobby();
                        }
                        return;
                    }
                    if(this.resonQuit){//idleKick : pending check if ko thao tac gi trong 1 van choi
                        var msg = "Bạn thoát vì không thao tác 3 ván liên tục";
                        switch (this.resonQuit){
                            case REASON_QUIT.IDLE:
                                msg = "Bạn thoát vì không thao tác 3 ván liên tục";
                                if(cc.Global.gameId === Constant.GAME_ID.XOCDIA) msg ="Bạn thoát vì không thao tác 6 ván liên tục";
                                break;
                            case REASON_QUIT.REJECT_GOP_GA:
                                msg =  "Bạn thoát vì từ chối góp gà";
                                break;
                        }
                        this.resonQuit = null;

                        MessageNode.getInstance().show(msg)

                    }else if(data[5] && data[5].length){
                        MessageNode.getInstance().show(data[5]);
                    }

                    this.gotoLobby();


                }else{
                    cc.log('key 0.1');
                    /* var lobbyScene = new LobbyScene(cc.Global.gameId);
                    cc.director.replaceScene(lobbyScene);*/
                    this.resonQuit = null;
                    this.gotoLobby();

                }
            }
            if(data[0] === command.LeaveRoom && !data[1]){
                //self.onShowNotice(data[5], 2000);//show ban ko the quit room khi dang choi
                //reconnect vi game start roi` ma click quit duoc -> lag or lose connect
                this.reConnect();
            }
        };
        this.gotoLobby = function(){
            this.destroyGame(); //sau nho kiểm tra lại

            MH.changePage("game",{"gameId":cc.Global.gameId});
        },
        this.destroyGame = function(){
                this.postEvent(kCMD.DESTROY_GAME,{} );//add trong GameScene,DE REMOVE LISTENER TRONG LOBBY cLINET

                // if(!cc.isUndefined(MyPixi)){
                //     MyPixi.destroyGame();
                //     if(MyPixi.app){
                //         MyPixi.app.destroy(true);
                //         MyPixi.app = null;
                //     }
                // }
         },
        this._onRoomPluginMsg= function (command, dataObj){
            // console.log(command+ " _onRoomPluginMsg => "+ JSON.stringify(dataObj), new Date().getTime());
            var cmd = dataObj[1][Constant.CONSTANT.CMD];
            //console.log("cmd----- "+cmd);
            if(cmd === 104){
                this._onBroastCast(command, dataObj);
            }else if(cmd === 100) {
                this.clickLoginBtn = false;
                this.isLogin = true;
                this.updateUserInfo(dataObj);
                if (PlayerMe.roomInfoReconnect) {
                    //change server de vao room # sid
                    var roomInfo = PlayerMe.roomInfoReconnect;
                    this.onJoinRoom(roomInfo);
                } else {
                    this._onUserInfo(command, dataObj);
                    this.reConnectDone(dataObj[1]);
                }
            }else if(cmd === 310) {
                //update tien
                var info = dataObj[1].As;
                var gold = info.gold;
                var chip = info.chip;
                var vip = info.vip;
                PlayerMe.gold = gold;
                PlayerMe.chip = chip;
                PlayerMe.vip = vip;
                PlayerMe.moneySafe = info.safe;
                this.postEvent(kCMD.UPDATE_MONEY, dataObj[1]);
                //cc.log("post event");
                MH.user.reload();//update chip gold tren html
                //TRONG USER INFO CUNG ADDLISTENER UPDATE_MONEY => UDATE LABEL TRONG DO
            }else if(cmd === 205){
                //cc.log(command+ " _onRoomPluginMsg => "+ JSON.stringify(dataObj));
                var playerArr = dataObj[1].ps;
                /*ps:Array = [
                 {
                 uid:String = USER_ID,
                 m:MOney= MONEYCAI
                 }
                 ]*/

                if(playerArr){
                        for(var i =0; i < playerArr.length; i++){
                            if(playerArr[i].uid === PlayerMe.uid ){
                                    if(playerArr[i].rCP){
                                        var mgs = "Hệ thống trả lại bạn "+playerArr[i].rCP + " điểm gà  ";
                                        if(MyPixi.isDestroy){
                                            MH.createPopup(mgs);
                                        }else{
                                            var dialog = new MessageOkDialog();
                                            dialog.setMessage(mgs);
                                            dialog.showWithAnimationScale();
                                        }

                                    }

                                break;
                            }
                        }
                }
            }else if(cmd == 102){
                //this.onRecvChatMessage(dataObj);
                this.postEvent(dataObj[1].cmd, dataObj);
            }else if(cmd == Constant.CMD_RESULT.ROOM_INFO) {
                this.isJoiningRoom = false;
                LoadingDialog.getInstance().hide();
                //{"b":100,"re":false,"ps":[{"cs":[],"uid":"de173b1b-4fc1-4a89-a818-7ce2b14f5ddd","r":false,
                //"pS":0,"C":true,"pi":false,"rmC":0,"dn":"hiepnh","pid":4,"m":100000,"sit":0}],"Mu":4,"rmT":-13760021,"cmd":202,"gS":1,"aid":2}
                cc.Global.dataGame = dataObj[1];//SET TRUOC KHI CALL HANDER JOIN ROOM
                if(this.handlerJoinRoomSuccess){
                    //handlerJoinRoom set in LobbyRequest.joinRoom();
                    this.handlerJoinRoomSuccess(true, "");
                    this.handlerJoinRoomSuccess = null;
                }else{
                    //reconnect trong ban` choi thi ko co handlerJoinRoomSuccess
                    var currentScene =MH.currentPage();//home || game || play || signup
                    if(currentScene == "play"){
                        cc.log("reConnectDone ****** refresh playscene");
                        this.postEvent(kCMD.RECONNECT_INGAME, cc.Global.dataGame);
                    }else{
                        MH.changePage('play');
                        cc.log("reConnectDone ****** recreate playscene");
                    }


                }

                this.onPlayGame(dataObj[1]);
            }else if(cmd == 6){
                if(dataObj[1].mgs) MH.createPopup(dataObj[1].mgs);
            }else if(cmd == 7){
                var type = dataObj[1].t;
                //if(type ===3) self.isRegisterQuit = true;
                //pop up show error/ thong bao(2) / bao tri  (3)
                var msg = dataObj[1].message;


                MH.createPopup(msg);

            }else if(cmd == 204){
                this.handlerAutoReady = true;
                //only maubinh va cac game auto ready - > implement torng tung game
                //cc.log("onReadyResponse aaaaa");
                //DetailLobbySence.instance.onReady();
            }else if(cmd == 607){
                //only maubinh va cac game auto ready

                //DetailLobbySence.instance.onCountDown(dataObj[1]);

            }else if(cmd == Constant.CMD_RESULT.LIST_ROOM){
                var roomData = dataObj[1].rs;
                roomData =  roomData.sort(function(a, b) {
                    //CONSTANT.ROOM.MUC_CUOC
                    return a[Constant.ROOM.MUC_CUOC] - b[Constant.ROOM.MUC_CUOC];
                });
                this.postEvent(kCMD.LIST_ROOM, dataObj);

            }else if(cmd == Constant.CMD_RESULT.FAST_PLAY){
                LoadingDialog.getInstance().hide();
                //   {"ri":{"b":100,"gid":1,"zn":"Simms","Mu":4,"rid":21,"rn":"DemLa#0","ariid":2,"sid":1};"cmd":307}
                // cc.log('fast play =>' + Utils.encode(dataObj[1]));
                if(!dataObj[1].ri){
                    var msg = 'Không có phòng phù hợp';
                    var dialog = new MessageOkDialog();
                    dialog.setMessage(msg);
                    dialog.showWithAnimationScale();
                    return;
                }

                this.onJoinRoom(dataObj[1].ri);

            }else if(cmd == 4){
                // DetailLobbySence.instance.popupUIComponent.closeLoading();
                //alert(Utils.encode(dataObj[1]));
            }else if(cmd == Constant.CMD_RESULT.RECEIVE_INVITE){
                this.onReceiverInvite(dataObj[1]);
            }else if(cmd === kCMD.UPDATE_MONEY){
                //alert('update money => '+dataObj[1]);
                var info = dataObj[1].As;
                var gold = info.gold;
                var chip = info.chip;
                var vip =  info.vip;
                PlayerMe.gold = gold;
                PlayerMe.chip = chip;
                PlayerMe.vip = vip;
                MH.user.reload();
                //TRONG USER INFO CUNG ADDLISTENER UPDATE_MONEY => UDATE LABEL TRONG DO
            }else if(cmd == 311){
                // catch trong LobbyBottombar roi
                this.postEvent(dataObj[1].cmd, dataObj);
                //{"b":[],"mB":0,"cmd":311} neu ko con tien
                //{"b":[50,100,200,500],"mB":700,"cmd":311}
                //click create table se lay maxbet truoc sau day tao ban
                /*cc.log('311 =>' + JSON.stringify(dataObj[1]));
                 var mb = dataObj[1].mB;
                 var b = dataObj[1].b;
                 if(mb ===0){
                 var msg = 'Bạn không đủ tiền để tạo bàn';
                 var dialog = new MessageOkDialog();
                 dialog.setMessage(msg);
                 dialog.showWithAnimationScale();
                 }

                 //if(b && b.length)DetailLobbySence.instance.popupCreateRoom.showDialog(true, b);

                 var msg = "TAO BAN`";
                 var dialog = new MessageConfirmDialog();
                 dialog.setMessage(msg);
                 dialog.showWithAnimationScale();

                 this._dialogCreateRoom = dialog;*/

            }else if(cmd == 308){
                // catch trong LobbyBottombar roi
                //308 =>{"mgs":"Bạn phải chờ 1 phút kể từ lần tạo bàn gần nhất.","cmd":308}
                cc.log('308 =>' + JSON.stringify(dataObj[1]));
                var roomInfo = dataObj[1].ri;
                if(roomInfo) this.onJoinRoom(roomInfo,true);
                else{
                    LoadingDialog.getInstance().hide();
                    /*var msg = dataObj[1].mgs;
                    var dialog = new MessageOkDialog();
                    dialog.setMessage(msg);
                    dialog.showWithAnimationScale();*/
                    var msg = dataObj[1].mgs;
                    MH.createPopup(msg);

                }
            }else if(cmd > 7){
                // > 7 vi`  1 -> 7 la command.LOGIN => command.Ping da add listener rieng roi
                //friend + chat plugin use this
                //console.log(cmd +" post event "+JSON.stringify(dataObj));
                this.postEvent(cmd, dataObj);
            }


        };
        this.onReceiverInvite= function (data){
            //cc.log("invite "+ JSON.stringify(data) );

            if(cc.Global.GetSetting(GameSetting.acceptInvite, true) == false || data.ri.aid == Constant.ASSET_ID.CHIP){
                // ko nhan loi moi
                //cc.log(" ko nhan loi moi ");
                return;
            }
            if(this.isJoiningRoom) return;
            /*if(data.ri.gid !== Constant.GAME_ID.TLMN && data.ri.gid !== Constant.GAME_ID.MAUBINH && data.ri.gid !== Constant.GAME_ID.SAM
                && data.ri.gid !== Constant.GAME_ID.LIENG && data.ri.gid !== Constant.GAME_ID.XITO && data.ri.gid !== Constant.GAME_ID.POKER
                && data.ri.gid !== Constant.GAME_ID.BACAY && data.ri.gid !== Constant.GAME_ID.PHOM && data.ri.gid !== Constant.GAME_ID.XOCDIA){//&& data.ri.gid !== Constant.GAME_ID.XITO
                return;
            }
            ////
           */

            //cc.log("show invite");

            var currentScene = MH.currentPage();//home || game || play || signup \\ playslot(tamgioi)
            if(currentScene != "playslot"){
                // MH.hasInvited( data );
                MH.openPopup("Invited", data);
            }else{
                //alert("invite in tam gioi");
            }

        };
        this.onJoinRoom= function (roomInfo){
            cc.Global.gameId = roomInfo.gid;
            if(HostConfig.currentServer.id !== roomInfo.sid){

                cc.log('****** change server khi vao room # serverID');
                //LoadingDialog.getInstance().show("Đang vào phòng...");
                //DetailLobbySence.instance.roomInfo = roomInfo;
                PlayerMe.roomInfoReconnect = roomInfo;
                // pending: connect den server # roi auto join room
                LobbyClient.getInstance().changeServerAndJoinGame(roomInfo.sid);
                return;

            }


            //  JSonArray = [3, zoneName:String, roomId:Integer, password:String]

            var joinRoomMsg = [
                command.JOINROOM,
                roomInfo[Constant.ROOM.ZONE_NAME],
                roomInfo[Constant.ROOM.ROOM_ID],
                ''
            ];
            cc.log('Đang vào phòng '+ JSON.stringify(roomInfo));
            //LoadingDialog.getInstance().show("Đang vào phòng...");
            LoadingDialog.getInstance().show("Đang vào phòng...");
            this.isJoiningRoom = true;
            LobbyClient.getInstance().send(joinRoomMsg);

        };
        this._onBroastCast= function (command, data){
            // cc.log(command+ " _onBroastCast => "+ JSON.stringify(data));
            //[5,{"na":0,"cmd":104,"bcm":["Chào mừng bạn đến với VIP52"],"ur":0}]
            var jObj= data[1];
            LoginData.broastCastArr = jObj.bcm;
            LoginData.unreadMsg = jObj.ur;
            LoginData.newAnnounceMsg = jObj.na;
            MH.hasNewMessage( LoginData.unreadMsg  );
            MH.hasNewNotify( LoginData.newAnnounceMsg );
            this.postEvent(kCMD.BROASTCASTTIVI, LoginData.broastCastArr);

        };
        this.onPlayGame= function (dataGame) {
            PlayerMe.roomInfoReconnect =null;

        };
        this.quitRoom = function(idle){
            if(idle) this.resonQuit = REASON_QUIT.IDLE;
            var sendObj = [
                command.LeaveRoom,
                Constant.CONSTANT.ZONE_NAME,
                this._currentRoomID
            ];
            this.send(sendObj);
        };
        this.quitRoomGameChan= function(resonQuit){
            //game chắn
            if(resonQuit) this.resonQuit = resonQuit;
            var sendObj = [
                command.LeaveRoom,
                Constant.CONSTANT.ZONE_NAME,
                this._currentRoomID
            ];
            this.send(sendObj);
        };
        this.onUpdateMoney= function(){

            var sendObj = [
                command.ZonePluginMessage,
                Constant.CONSTANT.ZONE_NAME,
                'channelPlugin',
                {'cmd':310
                }
            ];
            this.send(sendObj);
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
                        syntax+= " gửi "+sms["number"];
                        LoginData.smsActive[telcoId.toString()] = syntax;
                    }
                }
            }
            // cc.log("---- "+JSON.stringify(LoginData.smsActive) );

            var currentScene = MH.currentPage();//home || game || play || signup
            //var currentScene = {type:"HomeScene"};//cc.director.getRunningScene();
            //currentScene.type prevent reconnect in lobby or game ma chua kick hoat se popup activeDialog
            if(!PlayerMe.phoneVerify && PlayerMe.displayName  && currentScene == "home"){//prevent not verify phone but disconnect and reconnect when refresh browseer
                this._showKichHoatSuggest();
            }
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
            cc.log("begin----------");
            // MyRequest.fetchAllCashoutItems(function(cmd, data){
            //     cc.log("fetchAllCashoutItems "+JSON.stringify(data) );
            // });

        };
        this.getCurrentRoomId= function () {
            return this._currentRoomID;// phong dang choi cua minh`
        };
        this.setGameState= function ( gs) {
            this._gameState = gs;// ban` dang choi = true
        };
        /**
         * click vao game # server voi current server
         * or login vao ma van dang choi # sid
         * @param serverId
         */
        this.changeServerAndJoinGame= function(serverId){

            this.close();
            cc.log( "changeServerAndJoinGame........... ");
            //LoadingDialog.getInstance().show("Đang kết nối");
            LobbyClient.getInstance().connect(this.username, this.password,this.loginType, Constant.CONNECT_TYPE.CHANGE_SERVER_SPECIFC, serverId);

        };
        this.changeServerAndLoginAgain= function (){
            //ket noi lai
            this.close();
            LoadingDialog.getInstance().show("Mất kết nối .Đang kết nối lại");
            LobbyClient.getInstance().connect(this.username, this.password,this.loginType, Constant.CONNECT_TYPE.CHANGE_RADOM_SERVER);


        };
        this.reConnect= function (){
            //ket noi lai
            this.close();
            cc.log( " reConnecting........... ");
            LoadingDialog.getInstance().show("Mất kết nối .Đang kết nối lại");
            LobbyClient.getInstance().connect(this.username, this.password,this.loginType, Constant.CONNECT_TYPE.RECONNECT);
            this._isReconnecting = true;

        };
        this.reConnectDone= function (data){
            if(!this._isReconnecting) return;
            this._isReconnecting = false;
            LoadingDialog.getInstance().hide();
            MH.loadingDialog.hide();
            //var currentScene = cc.director.getRunningScene();
            //currentScene.onReconnectDone(data);//implement o cac scene nao` muon update sau khi reconn
            // chang han update money in lobby,....
            //if(currentScene == "GameScene")
            cc.log("reConnectDone ****** "+PlayerMe.roomInfoReconnect);
            //show panel userInfo
            MH.header.change('logged');

            if (PlayerMe.roomInfoReconnect) {
                cc.log("reConnectDone ****** vao lai room");
                var roomInfo = PlayerMe.roomInfoReconnect;
                this.onJoinRoom(roomInfo);
            }else{
                //cc.Global.gameId
                cc.log("reConnectDone ****** player dang view hoac ngoi` nhung ko bet trong xoc dia, hoac dang view trong cac game bai # thi cho ra lobby");
                if(cc.Global.gameId <= 0){
                    //ko chuyen r lobby neu gameID chua co
                    //case reconnect at home scene
                    return;
                }


                this.gotoLobby();
                MH.createPopup('Bạn vừa mất kết nối. Hệ thống vừa tự kết nối lại');
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
            console.log('run login');
            this.handlerLoginDone = handlerLoginDone;
            this.handlerLoginFail = handlerLoginFail;
            /*if(name === "kaka167"){
             cc.Global.SetSetting("debug", true);
             }else{
             cc.Global.SetSetting("debug", false);
             }*/
            cc.Global.loginType = LoginType.Normal;
            //luon luon save for reconnecting if need
            cc.Global.SetSetting(USER,name);
            cc.Global.SetSetting(PASS, pass);
            LoadingDialog.getInstance().show("Đang đăng nhập");
            LobbyClient.getInstance().connect(name, pass,LoginType.Normal, Constant.CONNECT_TYPE.NORMAL);
            //LoadingDialog.getInstance().show();

        },

        this.loginFBHandler = function(handlerLoginDone, handlerLoginFail){
            cc.log('LobbyClient loginFBHandler');
            this.handlerLoginDone = handlerLoginDone;
            this.handlerLoginFail = handlerLoginFail;
            var thiz = this;
            LobbyClient.getInstance().clickLoginBtn = true;
            this.loginType = LoginType.FB;
            LoadingDialog.getInstance().show("Đang đăng nhập FB");
            FB.getLoginStatus(function(response) {
                if (response.status === 'not_authorized') {
                    LobbyClient.getInstance().isNotAuthenFB = true;
                    cc.log("..Lobby FB::not_authorized");
                }
            });
            FB.login(function(response) {
                if (response.authResponse) {
                    cc.log('LobbyClient => Welcome!  Fetching your information.... ');
                    FB.api('/me', function(response) {
                        cc.log('Good to see you, ' + response.name + '.');
                        cc.log('Good to see you, api/me ' + Utils.encode(response));
                        FB.getLoginStatus(function(response) {
                            thiz.statusChangeCallback(response);
                        });

                    });
                } else {
                    cc.log('User cancelled login or did not fully authorize.');
                    LoadingDialog.getInstance().hide();
                }
            });
        };
        this.statusChangeCallback= function(response) {
            //cc.log('statusChangeCallback');
            //cc.log("FB statusChangeCallback "+JSON.stringify(response));
            // The response object is returned with a status field that lets the
            // app know the current login status of the person.
            // Full docs on the response object can be found in the documentation
            // for FB.getLoginStatus().

            if (response.status === 'connected') {
                // Logged into your app and Facebook.
                //console.log("Lobby FB::connected");
                cc.Global.loginType = LoginType.FB;
                cc.Global.fbLoginToken = response.authResponse.accessToken;
                LoadingDialog.getInstance().show("Đang đăng nhập FB");
                LobbyClient.getInstance().connect(cc.Global.fbLoginToken, "",LoginType.FB, Constant.CONNECT_TYPE.NORMAL);
                if(LobbyClient.getInstance().isNotAuthenFB){
                    LobbyClient.getInstance().isNotAuthenFB = false;
                    cc.log("Lobby FB::connected 1st time");
                    if(typeof fbq === 'function') fbq('track', 'CompleteRegistration');
                    if(typeof gtag === 'function') gtag('event', 'conversion', {'send_to': 'AW-940505908/gQquCP7RoZABELT2u8AD'});
                    // MyFBHelper.logEvent('CompleteRegistration',1);
                    if(typeof ga === 'function') ga('send', 'event', 'Registration', 'FBRegistration', 'Registration Campaign', 1);
                }

                //LoadingDialog.getInstance().show();
            } else if (response.status === 'not_authorized') {
                LoadingDialog.getInstance().hide();
                LobbyClient.getInstance().isNotAuthenFB = true;
                //console.log("Lobby FB::not_authorized");
                // The person is logged into Facebook, but not your app.
                // document.getElementById('status').innerHTML = 'Please log ' +
                //   'into this app.';
                /*MH.createPopup({
                    title:'',
                    width:'600px',
                    content:[
                        {
                            tag:'p',
                            text:"Đăng nhập thất bại",
                        }
                    ]
                });*/
            } else {
                LoadingDialog.getInstance().hide();
                // The person is not logged into Facebook, so we're not sure if
                // they are logged into this app or not.
                // document.getElementById('status').innerHTML = 'Please log ' +
                //   'into Facebook.';
            }
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