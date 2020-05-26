//var LobbyRequest = LobbyRequest || {};

var LobbyRequest = (function() {

    var instance = null;
    var LobbyRequestClass = function(){

        this.ctor = function () {

        };

        this.requestUpdateMoney = function () {

            cc.getClient().onUpdateMoney();
        };

        this.getListTable = function (gameID, typeRoom, callback, target) {
            //LobbyRequest.getInstance().show("Đang tải danh sách phòng... ",this);
            var msgObj = {
                cmd:    kCMD.LIST_ROOM,
                gid:    gameID, //
                aid:    typeRoom,
            };
            var sendObj = [
                6,
                Constant.CONSTANT.ZONE_NAME,
                'channelPlugin',
                msgObj
            ];
            //console.log("getListTable "+ JSON.stringify(sendObj) );
            if(!target) target = this;
            cc.getClient().addListener(kCMD.LIST_ROOM, callback, target);
            cc.getClient().send(sendObj);
        };

        this.getCapcha = function (sessionId, callback) {
            var request = {
                command: "getCaptcha",
                sessionId: sessionId
            };

            cc.getClient().addListener("getCaptcha", callback, this);

            cc.getClient().httpRequest(HostConfig.services.id, request);
        };
        /**
         *
         * @param roomInfo
         * @param callbackWhenJoinDone(isJoinDone, errorMsg(str) is Fail to join)
         */
        this.joinRoom = function (roomInfo, callbackWhenJoinDone) {
            //LobbyRequest.getInstance().show("Đang vào phòng...");
            cc.getClient().handlerJoinRoomSuccess = callbackWhenJoinDone;//clear html lobby, show canvas game
            cc.getClient().onJoinRoom(roomInfo);
            MH.loadingDialog.show({
                text:"Đang vào phòng..",
                timeout: 10000,
                afterTimeout: function(){
                    cc.getClient().reConnect();
                }
            });
        };
        /**
         *
         * @param idAvatar: ID AVATAR thay doi
         * callback(cmd, data) => cmd la string command(ko can quan tam), data co dang
         */
        this.updateAvatar = function (idAvatar, callback) {
            /*var callback  = function(cmd, data){
             var status = data["status"];
             if (status == 0) {//success
             //refresh avatar tren menubar
             //update PlayerMe.avatar  = link avatar moi
             PlayerMe.avatar = url;
             }
             }*/
            //if(!target) target = this;

            var request = {
                command: "updateAvatar",
                id: idAvatar
            };

            cc.getClient().removeListener(this);
            cc.getClient().addListener("updateAvatar", callback, this);
            cc.getClient().httpRequest(HostConfig.services.id, request);

        };

        this.createTable = function(callback){
            var sendObj = [
                command.ZonePluginMessage,
                Constant.CONSTANT.ZONE_NAME,
                'channelPlugin',
                {
                    'cmd':311,
                    'gid':cc.Global.gameId,
                    'aid':cc.Global.moneyType
                }
            ];
            cc.getClient().addListener(kCMD.CREATE_TABLE, callback, this);
            cc.getClient().send(sendObj);
        };

        this.okCreateRoomBtnHandler= function (moneyBet, maxUser) {
            var data={};
            data.b=moneyBet;//this.currentValue;
            data.Mu = maxUser;//this.maxUser;

            var sendObj = [
                command.ZonePluginMessage,
                Constant.CONSTANT.ZONE_NAME,
                'channelPlugin',
                { 'cmd':308,
                    'gid':cc.Global.gameId,
                    'aid':cc.Global.moneyType,
                    'b'  : data.b,
                    'Mu' :data.Mu
                }
            ];
            cc.log("create room "+JSON.stringify(sendObj));
            LoadingDialog.getInstance().show();
            cc.getClient().send(sendObj);
        };

        this.getForgotPass = function (displayName, callback) {
            var request = {
                command: "fetchForgotPasswordSyntax",
                displayName: displayName,
                telcoId: 1
            };
            cc.getClient().addListener("fetchForgotPasswordSyntax", callback, this);
            cc.getClient().httpRequest(HostConfig.services.paygate, request);
        };




        this.ctor();

    };

    LobbyRequestClass.getInstance = function () {
        if (!instance) {
            instance = new LobbyRequestClass();
            //instance.retain();
        }
        return instance;
    };

    return LobbyRequestClass;
})();
/**
 * FriendPlugin.getInstance() need tobe call first after login success for listner some event like FRIEND_REQUEST_ADD,...
 */
var FriendPlugin = (function() {

    var instance = null;
    var FriendPluginClass = function(){

        this.ctor = function () {
            this.pluginName = "friendPlugin";
            this.friendReuestAddMe = [];
            cc.getClient().addListener(friendCMD.FRIEND_REQUEST_ADD, this.friendAddResponse, this);
            cc.getClient().addListener(friendCMD.FRIEND_REQUEST_ACCEPT, this.acceptOrRemoveResponse, this);
            cc.getClient().addListener(friendCMD.FRIEND_REMOVE, this.acceptOrRemoveResponse, this);
            //FriendPlugin.getInstance().acceptFriend("dohimi", function(cmd, data){
            //    console.log(" co dataaaaaaaaaaaaa "+ JSON.stringify(data) );
            // });
        };

        /**
         * call when user logout => clear list FRIEND_REQUEST_ADD add dang co
         */
        this.logOut = function () {
            this.friendReuestAddMe.length =0;
        };
        this.acceptOrRemoveResponse = function (cmd, data) {
            cc.log(cmd +" acceptOrRemoveResponse "+ JSON.stringify(data));
            // accept [5,{"tu":"dohimi123","cmd":353,"fu":"fucker"}]

        };
        /**
         *
         * @param cmd
         * @param data {
         *       cmd:Int = 352,
         *       dn:String = DISPLAY_NAME
         *       u:String = USERNAME
         *   }
         */
        this.friendAddResponse = function (cmd, data) {
            cc.log("friendAddResponse "+ JSON.stringify(data));
            //[5,{"a":"http://sandbox28.api1bai247.info/images/avatar/108x108_1.png","u":"dohimi","dn":"dohimi123","cmd":352,"m":10432826}]
            var friend = {
                "displayName":data.dn,
                "username":data.u,
            };
            this.friendReuestAddMe.push(friend);
        };
        /**
         *
         * @param disPlayNameFriend
         * @param callback(cmd, data) => cmd la string command(ko can quan tam), data co dang
         * {
         *       cmd:Int = 350,
         *       iF:Boolean = IS_FRIEND,
         *       dn:String = DISPLAY_NAME
         *   }
         */
        this.checkIsFriend = function (disPlayNameFriend, callback) {
            //repsonse [5,{"dn":"fucker","cmd":350,"iF":false}]
            var sendObj = [
                command.ZonePluginMessage,
                Constant.CONSTANT.ZONE_NAME,
                this.pluginName,
                {'cmd':friendCMD.IS_FRIEND,
                    'dn':disPlayNameFriend
                }
            ];
            cc.getClient().addListener(friendCMD.IS_FRIEND, callback, this);
            cc.getClient().send(sendObj);

        };

        this.sendRequestFriend = function (disPlayNameFriend) {
            var sendObj = [
                command.ZonePluginMessage,
                Constant.CONSTANT.ZONE_NAME,
                this.pluginName,
                {'cmd':friendCMD.REQUEST_FRIEND,
                    'dn':disPlayNameFriend
                }
            ];
            //cc.getClient().addListener(friendCMD.IS_FRIEND, callback, this);
            cc.getClient().send(sendObj);

        };
        /**
         *
         * @param username
         * @param callBack(cmd, data) , data co dang
         * Response:
         *{
         *    cmd:Int = 353,
         *    fu:String = FROM_USER,
         *    tu:String = TO_USER
         *}
         */
        this.acceptFriend = function (username, callback) {
            var sendObj = [
                command.ZonePluginMessage,
                Constant.CONSTANT.ZONE_NAME,
                this.pluginName,
                {'cmd':friendCMD.FRIEND_REQUEST_ACCEPT,
                    'u':username
                }
            ];
            cc.getClient().addListener(friendCMD.FRIEND_REQUEST_ACCEPT, callback, this);
            cc.getClient().send(sendObj);

        };
        this.removeFriend = function (username) {
            var sendObj = [
                command.ZonePluginMessage,
                Constant.CONSTANT.ZONE_NAME,
                this.pluginName,
                {'cmd':friendCMD.FRIEND_REMOVE,
                    'u':username
                }
            ];
            cc.getClient().send(sendObj);

        };




        this.ctor();

    };

    FriendPluginClass.getInstance = function () {
        if (!instance) {
            instance = new FriendPluginClass();
            //instance.retain();
        }
        return instance;
    };

    return FriendPluginClass;
})();
/**
 * ChatPlugin.getInstance() need tobe call first after login success for listner some event like chat, msg,...
 */
var ChatPlugin = (function() {
    var instance = null;
    var ChatPluginClass = function(){
        this.ctor = function () {
            this.pluginName = "chatPlugin";
            this.message = [];
            this.channelData= [];
            cc.getClient().addListener(chatCMD.SEND_MESSAGE, this.onMessageResponse, this);
            cc.getClient().addListener(chatCMD.LIST_CHANNEL, this.onChannelResponse, this);
        };
        this.getListMgs = function (callback) {
            return this.message
        };
        /**
         *
         * @param cmd
         * @param callback (cmd, data)
         */
        this.getListChannel = function (callback) {
            var data= this.getListChannelData();
            if(data && data.length){
                if(callback){
                    callback(chatCMD.LIST_CHANNEL,data);
                }
            }else{
                var sendObj = [
                    command.ZonePluginMessage,
                    Constant.CONSTANT.ZONE_NAME,
                    this.pluginName,
                    {'cmd':chatCMD.LIST_CHANNEL
                    }
                ];
                this.callBackChannel = callback;
                cc.getClient().send(sendObj);
            }

        };
        this.getListChannelData = function () {
            //[{"displayName":"world","name":"zone","active":true,"users":[]},
            // {"displayName":"CSKH","name":"cskh","active":true,"users":[{"displayName":"CSKH1","username":"seven1"}]
            return this.channelData;
        };
        /**
         * call when user logout => clear list   dang co
         */
        this.logOut = function () {
            this.message.length =0;
            this.channelData.length =0;
        };
        /**
         *
         * @param cmd
         * @param data {
         *   cmd:Int = 361,
         *   fu:String = FROM_USER,
         *   m:String = MESSAGE,
         *   tst:String = TIMESTAMP
         * }
         */
        this.onMessageResponse = function (cmd, data) {
            cc.log("onMessageResponse "+JSON.stringify(data));
            //[5,{"tst":1503916928401,"mgs":"abc 2","cmd":361,"fu":"fucker"}]
            if(this.message && this.message.length > 100){
                this.message.shift();
            }
            this.message.push(data);
        };
        this.onChannelResponse = function (cmd, data) {
            cc.log("onChannelResponse "+JSON.stringify(data));
            //[5,{"cmd":360,"chs":[{"displayName":"world","name":"zone","active":true,"users":[]},
            // {"displayName":"CSKH","name":"cskh","active":true,"users":[{"displayName":"CSKH1","username":"seven1"}]}]}]
            var channels = data[1];
            if(channels && channels.chs){
                this.channelData.length =0;
                this.channelData = channels.chs;
            }


            if(this.callBackChannel){
                this.callBackChannel(cmd,data);
                this.callBackChannel = null;
            }
        };
        /**
         *
         * @param username : ko phai displayName
         * @param mes
         */
        this.sendMessageToUser = function (username, mes) {
            var sendObj = [
                command.ZonePluginMessage,
                Constant.CONSTANT.ZONE_NAME,
                this.pluginName,
                {'cmd':chatCMD.SEND_MESSAGE,
                    'ch':"friends", // "" neu send to user #
                    'u':username, // username cần gửi
                    'mgs':mes
                }
            ];
            cc.getClient().send(sendObj);
        };
        this.sendMessage = function (channel , username, mes) {
            //{"displayName":"CSKH","name":"cskh","active":true,"users":[{"displayName":"CSKH1","username":"seven1"}]
            var sendObj = [
                command.ZonePluginMessage,
                Constant.CONSTANT.ZONE_NAME,
                this.pluginName,
                {'cmd':chatCMD.SEND_MESSAGE,
                    'ch':channel, // name
                    'u':username, // username trong users
                    'mgs':mes
                }
            ];
            cc.getClient().send(sendObj);
        };


        this.ctor();

    };

    ChatPluginClass.getInstance = function () {
        if (!instance) {
            instance = new ChatPluginClass();
            //instance.retain();
        }
        return instance;
    };

    return ChatPluginClass;
})();