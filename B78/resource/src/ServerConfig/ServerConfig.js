var BUNDLE = 'com.hiphip.sandbox';
var APPNAME = 'prod'; //slotvipprod  prod
var BASE_URL = 'https://dev.anxndjejxjdjejxndjeifucn.info';//https://configurator.sslgstatic-gooogle.services https://dev.anxndjejxjdjejxndjeifucn.info
var BASE_URL_TEST = 'https://dev.anxndjejxjdjejxndjeifucn.info';

var COMMAND = "command";
var VERSION_ID = "2";//2
var PLATFORM_ID = '1';//1 change to 4 (web) when server config 4 done
var VERSION_ID_TEST = '4';//4
var PLATFORM_ID_TEST = '4';//4
var ServerConfig = ServerConfig || {};

ServerConfig.getLinkDistributor= function(){
    var distributorUrl = BASE_URL_TEST+"/distributor";
    
    if(1) { // prod
        distributorUrl = BASE_URL + "/distributor";
    }

    //var link1 = distributorUrl+"?"+COMMAND +"=regdis&bundle="+BUNDLE+"&appName="+APPNAME;
    //cc.log("getLinkDistributor: "+ link1 );
    var link = distributorUrl;
    //cc.log("getLinkDistributor"+ link );
    return link;
}
ServerConfig.getLinkACS = function(distId, appId){
    var acsUrl = BASE_URL_TEST+"/acs";
    var version = VERSION_ID_TEST;
    var plalform = PLATFORM_ID_TEST;
    if(1){// prod
      acsUrl = BASE_URL+"/acs";
      version = VERSION_ID;
      plalform = PLATFORM_ID;
    }
  /*  var link = acsUrl+"?"+COMMAND+"=get-bid&distId="+distId+"&versionId="+version+
              +"&platformId="+plalform+"&appId="+appId;
             
              cc.log("getLinkACS"+ link);*/
    var link = acsUrl;
    return link;
}
//http://v1.api1bai247.info/id?command=login&username=hiepnh&password=hiep123
ServerConfig.getLinkSignature = function(name, pass){
    var plalform = PLATFORM_ID_TEST;
    if(1){ // prod
      plalform = PLATFORM_ID;
    }
     var link = HostConfig.services.id+"?"+COMMAND+"=login&username="+name+"&password="+pass+"&platformId="+plalform;
    // url = url.replace("%username%", name);
    // url = url.replace("%password%", pass);
    // url = url.replace("%platformId%", PLATFORM_ID);
    // var link  =url;
    cc.log("getLinkSignature"+ link+" ");
    return link;
}
ServerConfig.getLinkRegister =  function(name, pass, deviceId, platformId, os, capcha, sessionIdCaptCha){
    var plalform = PLATFORM_ID_TEST;
    if(!cc.Global.GetSetting("test", false)) {
        plalform = PLATFORM_ID;
    }
    // var url = "http://v1.api1bai247.info/id?command=register&username=hehe167
    // &password=kaka123&deviceId=111&platformId=4&os=web&alsoLogin=true";
    //var link = BASE_URL+"/id?COMMAND+"=register&username=name+"&password=pass+"&deviceId=deviceId&platformId=PLATFORM_ID+"&os=os&alsoLogin=true";
    //var link = HostConfig.services.id+"?COMMAND+"=signup&username=name+"&password=pass+"&deviceId=deviceId&platformId=plalform+"&os=os+"&alsoLogin=true&g-recaptcha-response=capcha+"";
    var link = HostConfig.services.id+"?"+COMMAND+"=signup&username="+name+"&password="+pass+"&deviceId="+deviceId+"&platformId="+plalform+"&os="+os+"&alsoLogin=true&answer="+capcha+"";
    if(sessionIdCaptCha ) link = link + "&sessionId="+sessionIdCaptCha;
    cc.log("getLinkRegister"+ link+" ");
    return link;
}
ServerConfig.getLinkFb =  function(fbToken, platformId, os){
    //http://v1.api1bai247.info/id?command=loginQuickPlay&deviceId=181c3ed6a95f25879a29b59801148222a&platformId=4&os=web
    var link = HostConfig.services.id+"?"+COMMAND+"=loginFacebook&fbAccessToken="+fbToken+
              + "&os="+os+"&platformId="+platformId;
              cc.log("getLinkFb"+ link+" ");
    return link;
}
ServerConfig.getLinkGuestPlay =  function(deviceId, platformId, os){
    //http://v1.api1bai247.info/id?command=loginQuickPlay&deviceId=181c3ed6a95f25879a29b59801148222a&platformId=4&os=web
    var link = HostConfig.services.id+"?"+COMMAND+"=loginQuickPlay&deviceId="+deviceId
              + "&platformId="+platformId+"&os="+os;
              cc.log("getLinkGuestPlay"+ link+" ");
    return link;
}

ServerConfig.getLinkUpdateDisPlayName =  function(dn){
    //http://v1.api1bai247.info/id?command=loginQuickPlay&deviceId=181c3ed6a95f25879a29b59801148222a&platformId=4&os=web
    //var url = 'http://v1.api1bai247.info/id' ;//HostConfig.services.sa;
    var url = HostConfig.services.id+"?command=updateDisplayName&displayName="+dn;
    return url;
}
ServerConfig.getPayGateConfig =  function(){
    //http://sandbox.api1bai247.info/paygate?command=fetchConfig
    var url = HostConfig.services.paygate+"?command=fetchConfig";
    cc.log("getPayGateConfig"+ url+" ");
    return url;
}
ServerConfig.getPayGateRewardItem =  function(){
    //http://sandbox.api1bai247.info/paygate?command=fetchConfig
    var url = HostConfig.services.paygate+"?command=fetchAllCashoutItems";
    cc.log("getPayGateRewardItem"+ url+" ");
    return url;
}

ServerConfig.getPayGateRewardHistory =  function(){
    //http://sandbox.api1bai247.info/paygate?command=fetchConfig
    var url = HostConfig.services.paygate+"?command=fetchCashoutHistory";
    cc.log("getPayGateRewardHistory"+ url+" ");
    return url;
}
//cashout
ServerConfig.getCashOut =  function(itemID){
    //http://sandbox.api1bai247.info/paygate?command=fetchConfig
    var url = HostConfig.services.paygate+"?command=cashout&itemId="+itemID;
    cc.log("getCashOut"+ url+" ");
    return url;
}
ServerConfig.getRefundItem =  function(itemID){
    var url = HostConfig.services.paygate+"?command=refundCashout&id="+itemID;
    cc.log("getRefundItem"+ url+" ");
    return url;
}
ServerConfig.getListAvatar =  function(){
    //http://sandbox.api1bai247.info/id?command=fetchConfig
    var url = HostConfig.services.id+"?command=getAvatars";
    cc.log("getListAvatar"+ url+" ");
    return url;
}
ServerConfig.getUpdateAvatar =  function(idAvatar){
    //http://sandbox.api1bai247.info/id?command=fetchConfig
    var url = HostConfig.services.id+"?command=updateAvatar&id="+idAvatar;
    cc.log("updateAvatar"+ url+" ");
    return url;
}
ServerConfig.getLinkNews =  function(type){
    //http://sandbox.api1bai247.info/id?command=fetchConfig
    var url = HostConfig.services.sa+"?command=getTopNews&type="+type;
    cc.log("getLinkNews"+ url+" ");
    return url;
}
ServerConfig.getLinkMsg =  function(){
    //http://sandbox.api1bai247.info/sa?command=fetchConfig
    var url = HostConfig.services.sa+"?command=fetchInbox";
    cc.log("getLinkMsg"+ url+" ");
    return url;
}
ServerConfig.getLinkChangePass =  function(newPassword){
  var url = HostConfig.services.id+"?command=changePass&newPassword="+newPassword;
    cc.log("getLinkChangePass"+ url+" ");
    return url;
}
ServerConfig.getLinkReadMsg =  function(idMsg){
  var url = HostConfig.services.sa+"?command=readMessage&id="+idMsg;
    cc.log("getLinkReadMsg"+ url+" ");
    return url;
}
ServerConfig.getLinkDelMsg =  function(idMsg){
  var url = HostConfig.services.sa+"?command=deleteMessage&id="+idMsg;
    cc.log("getLinkDelMsg"+ url+" ");
    return url;
}
ServerConfig.getLinkRule =  function(){
    var url = HostConfig.services.sa+"?command=fetchGameRules";
    cc.log("getLinkRule"+ url+" ");
    return url;
}
ServerConfig.getChargeCardLink =function(serial, code, telcoId){
    var url = HostConfig.services.paygate+"?command=chargeCard&serial="+serial+"&code="+code+"&telcoId="+telcoId;
    cc.log("getChargeCardLink"+ url+" ");
    return url;
}
ServerConfig.getCaptCha =function(seasonId){
  var url = HostConfig.services.id+"?command=getCaptcha&sessionId="+seasonId;
    cc.log("getCaptCha"+ url+" ");
    return url;
}
ServerConfig.getForgotPass =function(displayName, telcoId){
  var url = HostConfig.services.paygate+"?command=fetchForgotPasswordSyntax&displayName="+displayName+"&telcoId="+telcoId+"";
    cc.log("getForgotPass"+ url+" ");
    return url;
}
ServerConfig.getOTPphone =function(phone){
    var url = HostConfig.services.paygate+"?command=registerOTPCode&phone="+phone;
    cc.log("getOTPphone"+ url+" ");
    return url;
}
ServerConfig.activeOTP =function(otp){
    var url = HostConfig.services.paygate+"?command=activeOTPCode&otp="+otp;
    cc.log("activeOTP"+ url+" ");
    return url;
}
ServerConfig.getToken =function(){
    var token = LoginData.signatureData.data.accessToken;
    cc.log("getToken"+ token+" ");
    return token;
}
ServerConfig.getRefreshToken =function(){
    //load everthing co repsonse status = 500 thi phai lay lai token
    var refreshToken = LoginData.signatureData.data.refreshToken;
    var url = HostConfig.services.id+"?command=refreshToken&refreshToken="+refreshToken;
    cc.log("getRefreshToken"+ url+" ");
    return url;
}

