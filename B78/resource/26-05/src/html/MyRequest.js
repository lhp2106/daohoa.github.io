var MyRequest = MyRequest || {};
/**
 *
 * @param callback (command, data)
 */
MyRequest.getTopNews = function (callback) {
    var request = {
        command: "getTopNews",
        type: 2
    };
    cc.getClient().addListener("getTopNews", callback, cc.getClient());
    cc.getClient().httpRequest(HostConfig.services.sa, request);
};

MyRequest.fetchGameRules = function (callback) {
    var request = {
        command: "fetchGameRules"
    };
    cc.getClient().addListener("fetchGameRules", callback, cc.getClient());
    cc.getClient().httpRequest(HostConfig.services.sa, request);
};
MyRequest.getTopUsers = function (callback) {
    var request = {
        command: "getTopUsers"

    };
    cc.getClient().addListener("getTopUsers", callback, cc.getClient());
    cc.getClient().httpRequest(HostConfig.services.sa, request);
};
MyRequest.fetchInbox = function (callback) {
    var request = {
        command: "fetchInbox"

    };
    cc.getClient().addListener("fetchInbox", callback, cc.getClient());
    cc.getClient().httpRequest(HostConfig.services.sa, request);
};
MyRequest.readMessage = function (idMsg, callback) {
    var request = {
        command: "readMessage",
        id: idMsg
    };
    cc.getClient().addListener("readMessage", callback, cc.getClient());
    cc.getClient().httpRequest(HostConfig.services.sa, request);
};
MyRequest.deleteMessage = function (idMsg, callback) {
    var request = {
        command: "deleteMessage",
        id: idMsg
    };

    cc.getClient().removeListener(LobbyRequest.getInstance());
    cc.getClient().addListener("deleteMessage", callback, LobbyRequest.getInstance());
    cc.getClient().httpRequest(HostConfig.services.sa, request);
};
/**
 * lấy ds  item minh` dã đổi
 */
MyRequest.fetchCashoutHistory= function (callback) {
    var request = {
        command: "fetchCashoutHistory"
    };

    cc.getClient().addListener("fetchCashoutHistory", callback, cc.getClient());
    cc.getClient().httpRequest(HostConfig.services.paygate, request);
};
/**
 * lấy ds  item đổi thưởng
 */
MyRequest.fetchAllCashoutItems= function (callback) {
    callback("fetchAllCashoutItems", LoginData.paygateRewardData);
};
/**
 * đổi thưởng 1 item
 */
MyRequest.getCashOut= function (obj, callback) {
    obj.command = "cashout";
    var request = obj;
    cc.getClient().addListener("cashout", callback, cc.getClient());
    cc.getClient().httpRequest(HostConfig.services.paygate, request);
};

MyRequest.refundCashout = function(id, callback){
    var request = {
        command: "refundCashout",
        id: id
    };

    cc.getClient().removeListener(LobbyRequest.getInstance());
    cc.getClient().addListener("refundCashout", callback, LobbyRequest.getInstance());
    cc.getClient().httpRequest(HostConfig.services.paygate, request);
};
/**
 * gạch thẻ
 */
MyRequest.chargeCard= function (obj, callback) {
    var request = {
        command: "chargeCard",
    };

    for( var key in obj ){
        if( obj.hasOwnProperty( key ) ){
            request[key] = obj[key];
        }
    }

    // serial: serial,
    // code: code,
    // telcoId: telcoId

    cc.getClient().addListener("chargeCard", callback, cc.getClient());
    cc.getClient().httpRequest(HostConfig.services.paygate, request);
};

/*
Cất tiền vào két
*/

MyRequest.putMoneyToSafe = function (money, callback) {
    var request = {
        command: "putMoneyToSafe",
        money: money
    };
    cc.getClient().addListener("putMoneyToSafe", callback, cc.getClient());
    cc.getClient().httpRequest(HostConfig.services.paygate, request);
};

/* Rút tiền trong ket */
MyRequest.withdraw = function( obj, callback ){
    var request = {
        command: "withdraw"
    };

    for( var key in obj ){
        if( obj.hasOwnProperty( key ) ){
            request[key] = obj[key];
        }
    }

    cc.getClient().removeListener(LobbyRequest.getInstance());
    cc.getClient().addListener("withdraw", callback, LobbyRequest.getInstance());
    cc.getClient().httpRequest(HostConfig.services.paygate, request);
};

/* Xác thực OTP */
MyRequest.verifyOTP = function( code, callback ){
    var request = {
        command: "verifyOTP",
        otp: code
    };
    cc.getClient().addListener("verifyOTP", callback, cc.getClient());
    cc.getClient().httpRequest(HostConfig.services.paygate, request);
};

/* Chuyen tien */
MyRequest.transferMoney2 = function( capcha, seasonId, money, name, reason, callback ){
    // var request = {
    //     command: "ctid",
    //     sessionId: seasonId,
    //     answer: capcha,
    //     money: money,
    //     customerId: name,
    //     reason: reason
    // };

    var request = {
        command: "transferMoney2",
        sessionId: seasonId,
        answer: capcha,
        money: money,
        displayName: name,
        reason: reason
    };

    cc.getClient().addListener("transferMoney2", callback, cc.getClient());
    cc.getClient().httpRequest(HostConfig.services.paygate, request);
};

/* Chuyen tien */
MyRequest.transfer = function( obj, callback ){
    var request = {
        command: "transfer"
    };

    // sessionId: seasonId,
    // answer: capcha,
    // money: money,
    // displayName: name,
    // reason: reason

    for( var key in obj ){
        if( obj.hasOwnProperty(key) ){
            request[key] = obj[key];
        }
    }

    cc.getClient().addListener("transfer", callback, cc.getClient());
    cc.getClient().httpRequest(HostConfig.services.paygate, request);
};



/* danh sach dai ly */
MyRequest.fetchActiveMerchant = function(callback){
    var request = {
        command: "fetch-active-merchant"
    };

    cc.getClient().addListener("fetch-active-merchant", callback, cc.getClient());
    cc.getClient().httpRequest(HostConfig.services.paygate, request);
};

MyRequest.checkMerchantByCustomerId = function(uid, callback){
    var request = {
        command: "checkMerchantByCustomerId",
        customerId: uid
    };

    cc.getClient().addListener("checkMerchantByCustomerId", callback, cc.getClient());
    cc.getClient().httpRequest(HostConfig.services.paygate, request);
};

MyRequest.checkMerchantByDisplayName = function(uname, callback){
    var request = {
        command: "checkMerchantByDisplayName",
        displayName: uname
    };

    cc.getClient().addListener("checkMerchantByDisplayName", callback, cc.getClient());
    cc.getClient().httpRequest(HostConfig.services.paygate, request);
};


/* lich su chuyen tien */

MyRequest.fetchTransferHistory = function(limit, skip, callback){
    var request = {
        command: "fetchTransferHistory",
        limit: limit,
        skip: skip
    };

    cc.getClient().addListener("fetchTransferHistory", callback, cc.getClient());
    cc.getClient().httpRequest(HostConfig.services.paygate, request);
};

MyRequest.fetchTransferHistory2 = function(limit, skip, callback){
    var request = {
        command: "fetchTransferHistory2",
        limit: limit,
        skip: skip
    };

    cc.getClient().addListener("fetchTransferHistory2", callback, cc.getClient());
    cc.getClient().httpRequest(HostConfig.services.paygate, request);
};

/* nap tien gifcode */
MyRequest.useGiftCode = function( obj, callback ){
    var request = {
        command: "useGiftCode"
    };

    for( var key in obj ){
        if( obj.hasOwnProperty(key) ){
            request[key] = obj[key];
        }
    }

    cc.getClient().addListener("useGiftCode", callback, cc.getClient());
    cc.getClient().httpRequest(HostConfig.services.paygate, request);
};
MyRequest.getOTPphone = function(phoneNumber, callback ){
    var request = {
        command: "registerOTPCode",
        phone: phoneNumber
    };
    MyRequest.phone = phoneNumber;
    //{"data":{"message":"Mã kích hoạt đã được gửi đến số 84979221938"},"status":0}
    // => status = 0 la success , !=0 thi show data.data.message;
    cc.getClient().addListener("registerOTPCode", callback, cc.getClient());

    cc.getClient().httpRequest(HostConfig.services.paygate, request);
};
MyRequest.getOTPCode = function(obj, callback){
    var request = {
        command: "getOTPCode"
    };


    // 1 kích hoạt
    // 2 hủy kích hoạt
    // 3 đổi mật khẩu
    // 4 chuyển khoản
    // 5 rút két
    // 6 quên mk


    for(var key in obj){
        if( obj.hasOwnProperty(key) ){
            request[key] = obj[key];
        }
    }

    var callback2 = function(cmd, data){
        LobbyRequest.getInstance().requestUpdateMoney();
        callback(cmd, data);
    };

    cc.getClient().removeListener(LobbyRequest.getInstance());
    cc.getClient().addListener("getOTPCode", callback2, LobbyRequest.getInstance());
    cc.getClient().httpRequest(HostConfig.services.paygate, request);
};
/**
 * update name
 * @param callback(cmd, data) => cmd la string command(ko can quan tam), data co dang
 * {status,data} => status = 0 la success , !=0 thi show data.data.message;
 */
MyRequest.activeOTPCode = function(otpNumber, callback ){
    var request = {
        command: "activeOTPCode",
        otp: otpNumber
    };

    cc.getClient().removeListener(LobbyRequest.getInstance());
    cc.getClient().addListener("activeOTPCode", callback , LobbyRequest.getInstance());
    /*var thiz = this;
    function(cmd, data){
        //{status,data} => status = 0 la success , !=0 thi show data.data.message;
        var status = data.status;
        var outputString = "";
        if(status === 0){
            PlayerMe.phone = MyRequest.phone;
            PlayerMe.phoneVerify = true;//prevent  active sdt again in avatar -> update sdt
            outputString = data.data.message;

            cc.getClient().onUpdateMoney();//updateMoneyAfterActivePhone();
        }else{
            outputString = data.data.message;
        }
        thiz.callback(status ,outputString);
    } */

    cc.getClient().httpRequest(HostConfig.services.paygate, request);
};
/* Lich su giao dich */
MyRequest.fetchUserTransaction2 = function(limit, skip, callback){
    // fetch-user-transaction2
    var request = {
        command: "fetch-user-transaction2",
        skip: skip,
        limit: limit,
        assetName: "gold"
    };

    cc.getClient().removeListener(LobbyRequest.getInstance());
    cc.getClient().addListener("fetch-user-transaction2", callback, LobbyRequest.getInstance());
    cc.getClient().httpRequest(HostConfig.services.sa, request);

};


MyRequest.verifyAccount = function(username, phone, callback){
    var request = {
        command: "verifyAccount",
        username: username,
        phone: phone
    };

    cc.getClient().removeListener(LobbyRequest.getInstance());
    cc.getClient().addListener("verifyAccount", callback, LobbyRequest.getInstance());
    cc.getClient().httpRequest(HostConfig.services.id, request);
};

MyRequest.deactivePhone = function(obj, callback){
    var request = obj;
    request.command = "deactivePhone";

    cc.getClient().removeListener(LobbyRequest.getInstance());
    cc.getClient().addListener("deactivePhone", callback, LobbyRequest.getInstance());
    cc.getClient().httpRequest(HostConfig.services.paygate, request);
};

MyRequest.activePhone = function(obj, callback){
    // var request = {
    //     command: "activePhone",
    //     otp: _otp
    // };

    var request = obj;
    request.command = "activePhone";

    cc.getClient().removeListener(LobbyRequest.getInstance());
    cc.getClient().addListener("activePhone", callback, LobbyRequest.getInstance());
    cc.getClient().httpRequest(HostConfig.services.paygate, request);
};


/**
 * change pass
 * @param callback(cmd, data) => cmd la string command(ko can quan tam), data co dang
 */
MyRequest.changePass= function (newPassword, callback) {
    var request = {
        command: "changePass",
        newPassword: newPassword
    };
    cc.getClient().addListener("changePass", callback, cc.getClient());
    cc.getClient().httpRequest(HostConfig.services.id, request);
};

MyRequest.forgotPassword = function (obj, callback) {
    var request = {
        command: "forgotPassword",
    };

    for(var key in obj){
        if( obj.hasOwnProperty(key) ){
            request[key] = obj[key];
        }
    }



    // var request = {
    //     command: "forgotPassword",
    //     newPassword: newpass,
    //     otp: otp,
    //     username: username
    // };

    cc.getClient().addListener("forgotPassword", callback, cc.getClient());
    cc.getClient().httpRequest(HostConfig.services.paygate, request);
};

/**
 * update name
 * @param callback(cmd, data) => cmd la string command(ko can quan tam), data co dang
 * {status:1,error:errorStr} => status = 0 la success
 */
MyRequest.updateDisplayName= function (name, callback) {
    var request = {
        command: "updateDisplayName",
        displayName: name
    };
    cc.getClient().addListener("updateDisplayName", function(cmd, data){
        cc.log("onRecvUpdateName " + JSON.stringify(data));
        //{"data":{"lastLogin":1489375041326,"gender":0,"os":"web","displayName":"rangbobapaa","phoneVerified":false,
        // "ipAddress":"117.6.57.35","avatar":"http://sandbox136.api1bai247.info/images/avatar/108x108_13.png","registerType":1,"platformId":4,"userId":"248caef8-ae6b-488f-89fc-9559fb5b0cb5","deviceId":"deviceId",
        // "regTime":1489375041205,"phone":"","customerId":5561,"phoneCount":0,"email":"","username":"baprangbo"},"status":0}
        if (data) {
            var status = data["status"];
            if (status == 0) {//success

                PlayerMe.displayName = data["data"].displayName;
               /* var scene = cc.director.getRunningScene();
                if(scene.userInfo){
                    scene.userInfo.refreshView();
                }*/
                callback(cmd, {status:0, error:"" });

                var sendObj = [
                    command.ZonePluginMessage,
                    Constant.CONSTANT.ZONE_NAME,
                    'channelPlugin',
                    {'cmd':309,
                        'dn':PlayerMe.displayName
                    }
                ];
                cc.getClient().send(sendObj);
            }else{
                var errorStr = Constant.STATUS_STR[status] ? Constant.STATUS_STR[status].msg : "Cập nhật tên thất bại";
                //this.showMessage(errorStr, 1);
                callback(cmd, {status:1,error:errorStr });
            }
        }else{
            callback(cmd, {status:1,error:"Có lỗi xảy ra. Vui lòng thử lại" });
        }
    }, cc.getClient());
    cc.getClient().httpRequest(HostConfig.services.id, request);
};
/**
 *
 * @param roomInfo
 * @param callback(cmd, data) => cmd la string command(ko can quan tam), data co dang
 * status  !=0 la get avatar fail, luk do co the ko co field items
 * {"items":[{"id":6,"url":"http://sandbox28.api1bai247.info/images/avatar/108x108_9.png"},{"id":17,"url":"http://sandbox28.api1bai247.info/images/avatar/108x108_4.png"}],"status":0}
 */
MyRequest.getAvatars = function ( callback) {
    var request = {
        command: "getAvatars"
    };
    // cc.getClient().addListener("getAvatars", callback, cc.getClient());
    // cc.getClient().httpRequest(HostConfig.services.id, request);

    cc.getClient().removeListener(LobbyRequest.getInstance());

    cc.getClient().addListener("getAvatars", callback, LobbyRequest.getInstance());

    cc.getClient().httpRequest(HostConfig.services.id, request);

};

/**
 *
 * @param idAvatar: ID AVATAR thay doi
 * callback(cmd, data) => cmd la string command(ko can quan tam), data co dang
 */
MyRequest.updateAvatar= function (idAvatar, callback) {
    /*var callback  = function(cmd, data){
        var status = data["status"];
        if (status == 0) {//success
            //refresh avatar tren menubar
            //update PlayerMe.avatar  = link avatar moi
            PlayerMe.avatar = url;
        }
    }*/

    var request = {
        command: "updateAvatar",
        id: idAvatar
    };
    cc.getClient().addListener("updateAvatar", callback, this);
    cc.getClient().httpRequest(HostConfig.services.id, request);

};

MyRequest.getCaptcha = function(sessionId, callback ){
    var request = {
        command: "getCaptcha",
        sessionId: sessionId
    };

    cc.getClient().addListener("getCaptcha", callback, cc.getClient());

    cc.getClient().httpRequest(HostConfig.services.id, request);
};

MyRequest.signup = function(capcha, sessionId, username, password, callback){
    var request = {
        command: "signup",
        username: username,
        password: password,
        deviceId: "deviceId",
        platformId: 4,
        os: "web",
        alsoLogin: true,
        answer: capcha,
        sessionId: sessionId
    };

    cc.getClient().addListener("signup", callback, cc.getClient());
    cc.getClient().httpRequest(HostConfig.services.id, request);
};


MyRequest.fetchTopSlotMachine = function(gid, callback){
    var request = {
        command: "fetchTopSlotMachine",
        gameId: gid,
        limit: 20,
        skip:0
    };
    var client = cc.getClient();
    client.removeListener(LobbyRequest.getInstance());

    client.addListener("fetchTopSlotMachine", callback, LobbyRequest.getInstance());

    client.httpRequest(HostConfig.services.sa, request);
};

MyRequest.fetchSlotMachineHistory = function(gid, type, limit, skip, callback){
    var request = {
        command: "fetchSlotMachineHistory",
        gameId: gid,
        limit: limit,
        skip: skip,
        assetId: type
    };

    cc.getClient().removeListener(LobbyRequest.getInstance());

    cc.getClient().addListener("fetchSlotMachineHistory", callback, LobbyRequest.getInstance());

    cc.getClient().httpRequest(HostConfig.services.sa, request);
};

MyRequest.fetchTaiXiuRanking = function(callback){
    var request = {
        command: "fetch-mini-game-ranking",
        gameName: "Tài Xỉu",
        limit: 10
    };

    cc.getClient().addListener("fetch-mini-game-ranking", callback, cc.getClient());

    cc.getClient().httpRequest(HostConfig.services.sa, request);
};

MyRequest.fetchSlotJackpotHistory = function(gid, limit,skip, callback){
    var request = {
        command: "fetchSlotJackpotHistory",
        gameId: gid,
        limit: limit,
        skip: skip
    };

    cc.getClient().removeListener(LobbyRequest.getInstance());

    cc.getClient().addListener("fetchSlotJackpotHistory", callback, LobbyRequest.getInstance());

    cc.getClient().httpRequest(HostConfig.services.sa, request);
};

MyRequest.fetchAllJackpotsHistory = function(aid, limit,skip, callback){
    var request = {
        command: "fetchAllJackpotsHistory",
        assetId: aid,
        limit: limit,
        skip: skip
    };

    cc.getClient().removeListener(LobbyRequest.getInstance());

    cc.getClient().addListener("fetchAllJackpotsHistory", callback, LobbyRequest.getInstance());

    cc.getClient().httpRequest(HostConfig.services.sa, request);
};

MyRequest.getLastJackpot = function(gid, aid, callback){
    var request = {
        command: "getLastJackpot",
        gameId: gid,
        assetId: aid
    };

    cc.getClient().removeListener(LobbyRequest.getInstance());

    cc.getClient().addListener("getLastJackpot", callback, LobbyRequest.getInstance());

    cc.getClient().httpRequest(HostConfig.services.sa, request);
};

MyRequest.creditTest = function( username, callback ){
    var request = {
        command: "credit",
        username: username
    };

    cc.getClient().addListener("credit", callback, cc.getClient());
    cc.getClient().httpRequest(HostConfig.services.paygate, request);
};

MyRequest.fetchSpinBoard = function(limit, skip, callback){
    var request = {
        command: "fetchSpinBoard",
        limit: limit,
        skip: skip
    };

    cc.getClient().removeListener(LobbyRequest.getInstance());

    cc.getClient().addListener("fetchSpinBoard", callback, LobbyRequest.getInstance());

    cc.getClient().httpRequest(HostConfig.services.sa, request);
};

MyRequest.fetchUpdownBettingHistory = function(limit, skip, callback){
    var request = {
        command: "fetchUpdownBettingHistory",
        limit: limit,
        skip: skip,
        assetId: 1
    };

    cc.getClient().removeListener(LobbyRequest.getInstance());

    cc.getClient().addListener("fetchUpdownBettingHistory", callback, LobbyRequest.getInstance());

    cc.getClient().httpRequest(HostConfig.services.sa, request);
};

MyRequest.getAccountKit = function(obj, callback){
    var countryCode =  (obj&&obj.countryCode)? obj.countryCode:'+84';
    var phoneNumber = (obj&&obj.phoneNumber)? obj.phoneNumber:'';
    AccountKit.login(
        'PHONE', 
        {countryCode: countryCode, phoneNumber: phoneNumber},
        callback
    );
};