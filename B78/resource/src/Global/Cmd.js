var command = {
    LOGIN: 1,
    LOGOUT: 2,
    JOINROOM:3,//[3, zoneName:String, roomId:Integer, password:String]
    LeaveRoom:4,// [4,zoneName:String, roomId:Int]
    RoomPluginMessage:5,// [5,JsonObject]
    ZonePluginMessage:6,
    PingMessage:7,
    PingResponse:6,//zonePlugin never tra ve nhe
};
var kCMD = kCMD || {
        LOGIN : "1",
        LOGOUT : "2",
        JOINROOM:"3",
        LeaveRoom:"4",
        RoomPluginMessage:"5",
        BROASTCASTTIVI: "10",
        USER_INFO: "100",
        CHAT    : "102",
        BROASTCAST: "104",
        USER_JOIN_OUT  		: "200",
        ROOM_INFO      		: "202",
        ROOM_MASTER_CHANGE     : "203",//255
        DEAL_CARD              : "250",//
        CHANGE_TURN            : "251",
        TOI_TRANG              : "252",//PHAT BAI TAT CA DEU LA COUPLE => WIN LUON
        DANH_BAI               : "253",
        REJECT_TURN            : "254",
        ERROR                  : "1",
        KICK_PLAYER            : "3",
        PLAYER_READY           : "5",
        LIST_ROOM               :"300",
        LIST_INVITE     		: "303",
        SEND_INVITE     		: "304",
        RECEIVE_INVITE     	: "305",
        OBSERVER_INVITE        : "306",// SETING CO NHAN LOI MOI` CHOI HAY KO
        FAST_PLAY              : "307",
        JOIN_ROOM      		: "308",
        UPDATE_MONEY      		: "310",
        CREATE_TABLE      		: "311",
        REGISTER_DONE      		: "REGISTER_DONE",
        REGISTER_FB_DONE      		: "REGISTER_FB_DONE",
        DESTROY_GAME    : "DESTROY_GAME",
        PHOM_EARN_CARD    : "PHOM_EARN_CARD",
        RECONNECT_INGAME    : "RECONNECT_INGAME",
        CONFIG_SUCCESS : "CONFIG_SUCCESS",
        FB_LIBS_SUCCESS: "FB_LIBS_SUCCESS",
        OBSERVER_RESPONSE : "OBSERVER_RESPONSE",
        TOP_HU     		: "10000",
        CHANGE_LINES_SLOT     		: "CHANGE_LINES_SLOT",
        UPDATE_JUST_WIN     		: "UPDATE_JUST_WIN",
        LOGOUT_SLOT_MINIGAME     		: "LOGOUT_SLOT_MINIGAME",
        PROGESS_OPEN_GAME : "PROGESS_OPEN_GAME"
};


var friendCMD = friendCMD || {
            IS_FRIEND : 350,
            REQUEST_FRIEND : 351,//GUI LOI MOI KET BAN
            FRIEND_REQUEST_ADD:352,// Nhận đươc lơi mời từ ai đó
            FRIEND_REQUEST_ACCEPT:353,
            FRIEND_REMOVE: 355// huỷ kết bạn
    };

var chatCMD = chatCMD || {
            LIST_CHANNEL : 360,
            SEND_MESSAGE : 361

    };

var phatlocCMD = phatlocCMD || {
        OBSERVER : 1400,
        REMOVE_OBSERVER : 1401,
        BEGIN_GIVEAWAY : 1402,
        BEGIN_GET_GIVEAWAY : 1407,
        MONEY_RANGE : 1405,
        DO_GIVEAWAY : 1403,
        GET_GIVEAWAY : 1404,
        END_GIVEAWAY : 1408,
    };

var caothapCMD = caothapCMD || {
        GET_INFO : 1500,
        START_GAME : 1501,
        SPIN : 1502,
        STOP_SPIN : 1503,
        UPDATE_JACKPOT : 1504
    };

var wheelCMD = wheelCMD || {
        REGISTER : 7000,
        UNREGISTER : 7006,
        GET_HISTORY : 7004,
        GET_TOP : 7005,
        SPIN : 7001,
        UPDATE_JACKPOT: 7002
    };

var baucuaCMD = baucuaCMD || {
        REGISTER : 7500,
        UNREGISTER : 7510,
        BEGIN_GAME : 7501,
        UPDATE_JACKPOT: 7502,
        ACCEPT_BET : 7503,
        END_GAME : 7504,
        RESULT_GAME : 7505,
        BET_AGAIN : 7506,
        DOUBLE_BET : 7507,
        GET_HISTORY : 7508,
        GET_TOP : 7509
    };

var OtpCMD = OtpCMD || {
        REGISTER : 'getOtpCode',
        UNREGISTER : 7510,
        VERIFY : 'verifyCode'
    };

var xosoCMD = xosoCMD || {
    ACCEPT_BET : 1700,
    GET_HISTORY : 1701,
    RESULT_GAME : 1702,
    REGISTER : 1703
};