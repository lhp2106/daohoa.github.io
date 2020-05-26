/**
 * Created by kk on 7/6/2016.
 */

var URL_ANDROID = 'https://sieuhu.org/';
var URL_APPSTORE = 'https://sieuhu.org/';

var USE_TEST_SERVER = false;//DUNG TRONGfalse LOADdISTRIBU.. with function verifyTest() IN LOOBYclIENT

var ENABLE_CHUYENKHOAN = true;

var TEST_MODE = false;

var SHOW_OTP = true;

var SHOW_LOG = false;

var URL_CONFIG = "http://45.119.81.168/acs?command=get-bid&CversionId=4&platformId=1&distId=42d766b7-e118-4840-89be-31f2b93d6acb&appId=55c320b5-bc45-4855-bedf-8d0faf5d2d63";
//var URL_CONFIG = "http://s3.api1baiindex247.info:9305/acs?command=get-bid&versionId=4&platformId=1&distId=42d766b7-e118-4840-89be-31f2b93d6acb&appId=55c320b5-bc45-4855-bedf-8d0faf5d2d63";


var Distributor = Distributor || {};
Distributor.distId = '';//"c43f5ab3-e3a4-4aa6-b8ae-82aea723afcf";// = null thì sẽ load tu  LOADdISTRIBU.. IN LOOBYclIENT
Distributor.applicationId = '';//"14a5e5f3-2962-42f9-8a7c-fae36c4b9307";

//cac  ip sau sẽ ko login vao neu duoc lít o day
//HostConfig.servers sẽ ko add neu co ip trung` VIP52_IP_REJECT
//chi dung neu dang o test server
var VIP52_IP_REJECT = VIP52_IP_REJECT || [
        "171.244.9.37"
    ];
var HostConfig = HostConfig || {};
HostConfig.servers = [];
HostConfig.services = null;
HostConfig.defaultServerID = 0;// 0 thi random else lay trong arr servers -1. eg ID = 1 => HostConfig.servers[0], DKM MObile lam the thi phai lam theo
HostConfig.defaultServer ={};
//minigame
HostConfig.miniGameServer = null;
HostConfig.currentServerMiniGame ={};


var LoginData = LoginData ||{};
LoginData.smsActive = {};
LoginData.signatureData = {};
LoginData.userinfo = {};
LoginData.broastCastArr = [];
LoginData.unreadMsg = [];
LoginData.newAnnounceMsg = [];
LoginData.paygateRewardData='';
LoginData.paygateData='';



var reason_v52 = reason_v52 || {};
reason_v52.UNKNOWN = 1;
reason_v52.KICKED = 2;
reason_v52.LOGOUT = 3;
reason_v52.KICK_LOGIN_OTHER_DEVICE = 4;
reason_v52.KICK_IDLE = 5;




var USER = "username_ctl";
var PASS = "pass_ctl";
var SPEED = 1500;
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.lastIndexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}
String.prototype.insertAt=function(index, string) {
    return this.substr(0, index) + string + this.substr(index);
}
//"{0} is dead, but {1} is alive!".format("ASP", "ASP.NET")
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

//"Hello, {name}, are you feeling {adjective}?".formatUnicorn({name:"Gabriel", adjective: "OK"});
String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
    function () {
        "use strict";
        var str = this.toString();
        if (arguments.length) {
            var t = typeof arguments[0];
            var key;
            var args = ("string" === t || "number" === t) ?
                Array.prototype.slice.call(arguments)
                : arguments[0];

            for (key in args) {
                str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);//gi :global and case-insensitive,
            }
        }

        return str;
    };
//"Hello, %b, are you feeling %y   %a   %y?".formatTivi(["Gabriel", "OK", "222"]);
String.prototype.formatTivi = String.prototype.formatTivi ||
    function () {
        "use strict";
        var str = this.toString();
        if (arguments.length) {
            var t = typeof arguments[0];
            var key;
            var args = ("string" === t || "number" === t) ?
                Array.prototype.slice.call(arguments)
                : arguments[0];
            var idx = 0;
            for (var i =0 ; i < args.length ; i++) {
                //g :replace all, not g => replace 1st math
                //i :global and case-insensitive
                //\w : 1 ky tu chữ bất kỳ  https://www.w3schools.com/jsref/jsref_obj_regexp.asp
                //str = str.replace(new RegExp("\\%" + "\\w"  , "i"), args[idx]);
                str = str.replace(new RegExp("\\%" + "\\w"  , "i"), function(mather){
                    var returnStr ="";
                    if(mather.indexOf("y") !=-1) returnStr =  '<font color="yellow">'+args[idx] + '</font>';
                    else if(mather.indexOf("m")!=-1) returnStr =  '<font color="magenta">'+args[idx] + '</font>';
                    else if(mather.indexOf("c")!=-1) returnStr =  '<font color="cyan">'+args[idx] + '</font>';
                    else if(mather.indexOf("r")!=-1) returnStr =  '<font color="red">'+args[idx] + '</font>';
                    else if(mather.indexOf("g")!=-1) returnStr =  '<font color="green">'+args[idx] + '</font>';
                    else if(mather.indexOf("b")!=-1) returnStr =  '<font color="blue">'+args[idx] + '</font>';
                    else if(mather.indexOf("w")!=-1) returnStr =  '<font color="white">'+args[idx] + '</font>';
                    else if(mather.indexOf("k")!=-1) returnStr =  '<font color="black">'+args[idx] + '</font>';


                    return returnStr;
                });
                idx++
            }
        }

        return str.replace(/\t/g, '<span class="space"></span>');
    };

var cc = cc || {};
cc.p2 = function(x, y){ // convert position pixi -> cocos
    return {x: x, y: -y};
};
cc.p3 = function(x, y){ // convert anchor pixi -> cocos
    return {x: x, y: 1-y};
};
cc.createSpine = function(_spine, _atlas){
    return new sp.SkeletonAnimation( _spine, _atlas);
};

cc.getClient = function(){
    // if(typeof window.LobbyClient != 'undefined'){
    //     return LobbyClient.getInstance();
    // } else if(!hiepnh.isUndefined(MiniGameClient)){
    //     return MiniGameClient.getInstance();
    // }else{
    //     return null;
    // }
    return LobbyClient.getInstance();
};
cc.isClientGameBai = function(){
    // if(typeof window.LobbyClient != 'undefined'){
    //     return true;
    // }
    // return false;
    return true;
};

cc.convertToWorldSpace = function(target){
    return target.getParent().convertToWorldSpace(target.getPosition());
};


cc.Global = cc.Global || {};
cc.Global.gameId = -1;
cc.Global.slotId = -1;
cc.Global.zoneID = 1;//1 -2 -3 => binh dan - thuong nhan - quy toc
cc.Global.designGame = cc.size(1280, 720);
cc.Global.GameView = cc.size(1280, 720);
cc.Global.dataGame = null;// data game sau khi join 1 ban` thanh cong
cc.Global.verifyTest = function(){
    // var url = new URL(window.location.href);
    // var checkT = url.searchParams.get("t");
    // if(checkT && checkT == "test"){
    //     cc.Global.SetSetting("test", true);
    // }
    // else{
    //     cc.Global.SetSetting("test", USE_TEST_SERVER);
    // }
}
cc.Global.getCardName = function( cardId)
{
    //cc.log('cardId '+cardId);
    if (cardId === 0) return 0;
    return (Math.floor(cardId / 3) + 1) * 10 + cardId % 3 + 1;
};
cc.Global.getCardObj = function( cardId)
{
    //cc.log('cardId obj '+cardId);
    if (cardId === 0) return {idGroup:0, idCard:0,index: -1};
    var   id= Math.floor(cardId / 3) + 1;//2-> 9
    var group =  cardId % 3 + 1;// van van sach
    return {idGroup:group, idCard:id,index: -1};
};

cc.Global.degreeToRadian = function (degree) {
    var radian =  Math.PI* degree/ 180.0;
    return radian;
};
cc.Global.radianToDegree = function (radian) {
    var degree = radian*180.0/ Math.PI;
    return degree;
};
cc.Global.NumberFormat1 = function (number) {
    var pret = Math.abs(number).toString();
    if(pret.length > 3){
        for(var i=pret.length-3; i>0;i-=3){
            pret = pret.insertAt(i,".");
        }
    }
    if(number < 0){
        return "-"+pret;
    }
    return pret;
};

var Number_Format_Type = ["", "K", "M", "B"];
cc.Global.NumberFormat2 = function (number, toFixed) {
    var i = 0;
    while(number >= 1000){
        if(toFixed){
            number =parseFloat(Number(number/1000).toFixed(toFixed));
        }else{
            number = Math.floor(number/1000);
        }

        i++;
    }
    return (number.toString() + Number_Format_Type[i]);
};
//cc.Global.COLOR_QUAN = cc.color("#ffff00");
//cc.Global.COLOR_XU = cc.color(180,180,180);
cc.Global.listEvent =cc.Global.listEvent || [];
cc.Global.zoneData = cc.Global.zoneData || {};
cc.Global.roomData = cc.Global.roomData || {};
cc.Global.tableData= cc.Global.tableData || {};
cc.Global.lobbyData = cc.Global.lobbyData || {};
cc.Global.roomJoin= cc.Global.roomJoin || {};
cc.Global.tableJoin= cc.Global.tableJoin || {};
cc.Global.ZoneConfigJoin= cc.Global.ZoneConfigJoin || {};
cc.Global.cuocData= cc.Global.cuocData || {};//cuoc cua van choi khi minh join phong
cc.Global.bettingData= cc.Global.bettingData || {};//ds cuoc cua 1 zone sau khi vao`
//cc.Global.reconnectTable = cc.Global.reconnectTable || {}; //info table reconnect when mat mang,...
cc.Global.socketStatus = "NotConnected";
cc.Global.fbLoginToken = "";

var LoginType = LoginType || {};
LoginType.FB = 0;
LoginType.Normal = 1;

var MoneyType = MoneyType || {};
MoneyType.Chip = 2;//!=2
MoneyType.Gold = 1;//2;
cc.Global.moneyType = MoneyType.Gold;//MoneyType.Xu;

var ZoneConfig = ZoneConfig || {};
ZoneConfig.index = "1";
ZoneConfig.zoneName = "NhaTranh";
ZoneConfig.zoneIpIos = "chanvuong2.info";
ZoneConfig.zoneIp = "125.212.192.97";
ZoneConfig.zoneName = "NhaTranh";
ZoneConfig.zonePort = "843";
ZoneConfig.zoneStatus = "1";
ZoneConfig.typeMoney = "1";

cc.Global.getServerById = function(id){
    var servers = HostConfig.servers;
    for(var i = 0; i < servers.length ; i++){
        if(servers[i].id === id){
            return servers[i];
        }
    }
};
cc.Global.getRandomServer = function(){
    //neu co default server thi dung luon default server
    var servers = HostConfig.servers;
    var currentServer = HostConfig.currentServer;
    var idDefault = HostConfig.defaultServerID;
    var id =  Math.floor(Math.random()*servers.length);
    if(idDefault > 0){
        id = idDefault-1;
        cc.log("get defaultserver "+ id);
    }
    var s = servers[id];
    cc.log("get defaultserver "+ s.ip);
    if(!currentServer || servers.length === 1 || idDefault > 0) return s;

    while(s === currentServer){
        s = servers[Math.floor(Math.random()*servers.length)];

    }
    cc.log("get defaultserver finish"+ s.ip);
    return s;
};

cc.Global.getRandomServerMiniGame = function(){
    var s = HostConfig.miniGameServer;
    return s;
};

cc.Global.storageAvailable = function(type) {
    return false;
    // try {
    //     var storage = window[type],
    //         x = '__storage_test__';
    //     storage.setItem(x, x);
    //     storage.removeItem(x);
    //     return true;
    // }
    // catch(e) {
    //     return e instanceof DOMException && (
    //             // everything except Firefox
    //         e.code === 22 ||
    //             // Firefox
    //         e.code === 1014 ||
    //             // test name field too, because code might not be present
    //             // everything except Firefox
    //         e.name === 'QuotaExceededError' ||
    //             // Firefox
    //         e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
    //             // acknowledge QuotaExceededError only if there's something already stored
    //         storage.length !== 0;
    // }
};
cc.Global.GetSetting = function (setting, defaultValue) {
    return defaultValue;
    // var _localStorage;
    // if (cc.Global.storageAvailable('localStorage')) {
    //     // Yippee! We can use localStorage awesomeness
    //     _localStorage = window.localStorage;
    //     cc.log("avaliable");
    // }
    // else {
    //     // Too bad, no localStorage for us
    //     _localStorage = new MemoryStorage(APPNAME);
    // }
    // var value = _localStorage.getItem(JSON.stringify(setting+APPNAME), JSON.stringify(value));
    // if(value){
    //     return JSON.parse(value);
    // }

    // return defaultValue;
};
cc.Global.SetSetting = function (setting, value) {
    // if (cc.Global.storageAvailable('localStorage')) {
    //     // Yippee! We can use localStorage awesomeness
    //     _localStorage = window.localStorage;
    //     cc.log("avaliable");
    // }
    // else {
    //     // Too bad, no localStorage for us
    //     _localStorage = new MemoryStorage(APPNAME);
    // }
    // _localStorage.setItem(JSON.stringify(setting+APPNAME), JSON.stringify(value));

    // if(setting == GameSetting.sound){
    //     cc.getClient().postEvent(GameSetting.sound , {"sound":value} );
    // }
};

cc.Global.getSlotCountByGame=function(){
    var kq = [];
    var maxPlayer = 4;
    var gId = cc.Global.gameId;
    if(gId == Constant.GAME_ID.TLMN) kq = [2,4];
    else if(gId == Constant.GAME_ID.SAM) kq = [2,5];
    else if(gId == Constant.GAME_ID.MAUBINH) kq = [4];
    else if(gId == Constant.GAME_ID.LIENG) kq = [5,9];
    else if(gId == Constant.GAME_ID.XITO)  kq = [5];
    else if(gId == Constant.GAME_ID.POKER) kq = [5,9];
    else if(gId == Constant.GAME_ID.PHOM) kq = [2,4];
    else if(gId == Constant.GAME_ID.CHAN) kq = [4];
    else if(gId == Constant.GAME_ID.BACAY) kq = [6,9];
    else if(gId == Constant.GAME_ID.XOCDIA) kq = [30];//max 30 nguoi nhung chi co 9 slot

    return kq;
}

cc.Global.getAllCardByPoint = function (cards, point) {
    var arr = [];
    for(var i = 0 ; i < cards.length; i++) {
        var p = Math.floor(cards[i]/3) +2;
        if(point == -1){
            //chi chi
              p = cards[i];
        }
        if(point === p){
            arr.push(cards[i]);
        }

    }
    return arr;
};

var ResultCode = ResultCode || {};
ResultCode.REGISTER_OK = 48;
ResultCode.UPDATE_NAME_ERROR = 50;
ResultCode.UPDATE_NAME_OK = 51;

cc.res = cc.res || {};
cc.res.font = cc.res.font || {};
cc.res.font.Roboto_Condensed = "";

cc.res.font.Arial = "Arial";
cc.res.font.Roboto_Condensed = "res/fonts/Roboto-Condensed";
cc.res.font.Roboto_CondensedBold = "Roboto-BoldCondensed";
cc.res.font.UTM_AvoBold = "UTM-AvoBold";
cc.res.font.Netmuc = "res/fonts/UTM_Netmuc_KT";
cc.res.font.guanine = "guanine";
cc.res.font.arialbd = "arialbd";

cc.res.font.orange_number = "res/fonts/orange_number";
cc.res.font.font = "res/fonts/font";
cc.res.font.font_so_do = "res/fonts/font_so_do";
cc.res.font.font_so_tien = "res/fonts/font_so_tien";
cc.res.font.font_so_xanh = "res/fonts/font_so_xanh";
cc.res.font.font_tienvang_to = "res/fonts/font_tienvang_to";
cc.res.font.font_title = "res/fonts/font_title";
cc.res.font.normal_30 = "res/fonts/normal_30";

cc.res.font.font_thanga = "font_xanh";
cc.res.font.font_thuaa = "font_do";
cc.res.font.Roboto_Condensed_40 = "res/fonts/RobotoCondensed_40";
cc.res.font.Roboto_CondensedBold_40 = "res/fonts/RobotoBoldCondensed_40";
cc.res.font.UTM_AvoBold_40 = "res/fonts/UTMAvoBold_40";

cc.res.font.Roboto_Condensed_30 = "res/fonts/RobotoCondensed_30";
cc.res.font.Roboto_CondensedBold_30 = "res/fonts/RobotoBoldCondensed_30";
cc.res.font.UTM_AvoBold_30 = "res/fonts/UTMAvoBold_30";

cc.res.font.Roboto_Condensed_25 = "res/fonts/RobotoCondensed_25";
cc.res.font.Roboto_CondensedBold_25 = "res/fonts/RobotoBoldCondensed_25";
cc.res.font.UTM_AvoBold_25 = "res/fonts/UTMAvoBold_25";

cc.res.font.Roboto_BoldCondensed_36_Glow = "/res/fonts/Roboto_BoldCondensed_36_Glow";
cc.res.font.videoPokerRewardFont = "/res/fonts/videoPokerRewardFont";

var LogOut = LogOut || {};
LogOut.back_to_login = 0;
LogOut.change_zone = 1;


var PlayerMe = PlayerMe || {};
PlayerMe.level = 100;
PlayerMe.username = "";
PlayerMe.displayName = "";
PlayerMe.gender = "";
PlayerMe.vip = 0;
PlayerMe.phone="";
PlayerMe.phoneVerify = false;
PlayerMe.playTypeMoney = MoneyType.Quan;
PlayerMe.gold = 1000;
PlayerMe.chip = 10000;
PlayerMe.total = 23213;
PlayerMe.uid = -1;
PlayerMe.id =-1;
PlayerMe.avatar = "";
PlayerMe.kichhoat = false;
PlayerMe.roomInfoReconnect = null;
PlayerMe.SFS = {};

var GameConfig = GameConfig || {};
GameConfig.email = "chanbachthu@gmail.com";
GameConfig.hotline = "09000123";
GameConfig.broadcastMessage = "Thông báo";
GameConfig.DeviceIDKey = "";

var GameSetting = GameSetting || {};
GameSetting.sound = "sound";
GameSetting.acceptInvite = "acceptInvite";
GameSetting.u411 = "u411";
GameSetting.fast = "fast";
GameSetting.slow = "slow";
GameSetting.autoReady = "autoReady";
GameSetting.autoReadyChan = "autoReadyChan";

var GameMng = GameMng || {};
/**
 *
 * khi click vaof icon game trong 10 game thi phai setCurrentGameId
 */
GameMng.setCurrentGameId = function (gID) {
    cc.Global.gameId = gID;
};
/**
 *
 * @param type MoneyType.Chip / MoneyType.Gold;
 */
GameMng.setMoneyType = function (type) {
    cc.Global.moneyType  = type;
};