//var MiniGameRequest = MiniGameRequest || {};

var MiniGameRequest = (function() {

    var instance = null;
    var MiniGameRequestClass = function(){

        this.ctor = function () {

        };

        this.requestUpdateMoney = function () {

            MiniGameClient.getInstance().onUpdateMoney();
        };



        this.getCapcha = function (sessionId, callback) {
            var request = {
                command: "getCaptcha",
                sessionId: sessionId
            };

            MiniGameClient.getInstance().addListener("getCaptcha", callback, this);

            MiniGameClient.getInstance().httpRequest(HostConfig.services.id, request);
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
            MiniGameClient.getInstance().addListener("updateAvatar", callback, this);
            MiniGameClient.getInstance().httpRequest(HostConfig.services.id, request);

        };




        this.getForgotPass = function (displayName, callback) {
            var request = {
                command: "fetchForgotPasswordSyntax",
                displayName: displayName,
                telcoId: 1
            };
            MiniGameClient.getInstance().addListener("fetchForgotPasswordSyntax", callback, this);
            MiniGameClient.getInstance().httpRequest(HostConfig.services.paygate, request);
        };




        this.ctor();

    };

    MiniGameRequestClass.getInstance = function () {
        if (!instance) {
            instance = new MiniGameRequestClass();
            //instance.retain();
        }
        return instance;
    };

    return MiniGameRequestClass;
})();

/*

/!**
 *
 * lay danh sach ban` choi moi game
 * aid : MoneyType.Chip or MoneyType.Gold
 * gid: gameID from Constant.GAME_ID
 *!/
MiniGameRequest.getListTable = function (gameID, typeRoom, callback) {
    //MiniGameRequest.getInstance().show("Đang tải danh sách phòng... ",this);
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
    MiniGameClient.getInstance().addListener(kCMD.LIST_ROOM, callback, this);
    MiniGameClient.getInstance().send(sendObj);
};


MiniGameRequest.joinRoom = function (roomInfo, callback) {
    MiniGameRequest.getInstance().show("Đang vào phòng...");
    if(HostConfig.currentServer.id !== roomInfo.sid){

        cc.log('****** change server khi vao room # serverID');
        PlayerMe.roomInfoReconnect = roomInfo;
        // pending: connect den server # roi auto join room
        MiniGameClient.getInstance().changeServerAndJoinGame(roomInfo.sid);
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
    ///MiniGameClient.getInstance().addListener(kCMD.LIST_ROOM, callback, this);
    MiniGameClient.getInstance().send(joinRoomMsg);
};

*/
