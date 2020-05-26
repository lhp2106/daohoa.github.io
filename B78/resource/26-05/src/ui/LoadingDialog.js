/**
 * Created by k on 7/11/2016.
 */
var LoadingDialog = (function() {

    var instance = null;
    var LoadingDialogClass = function(){
    	this.onRun = false;
    	this.afterTimeout = undefined;
        this.show = function () {
            var title = "";
            if(arguments.length){
                title = arguments[0];
            }else{
                title = "Đang kết nối";
            }

            var thiz = this;
            
            MH.loadingDialog.show({
                text:title,
                timeout: 10000,
                afterTimeout: function(){
                    thiz.timeOutCall();
                }
            });

            
        };

        this.hide = function () {
            MH.loadingDialog.hide();
        };

        this.timeOutCall = function () {
            MH.loadingDialog.hide();
            var isLogin = LobbyClient.getInstance().isLoginDone();
            var isClickLogin = LobbyClient.getInstance().isClickLogin();
            var currentScene = MH.currentPage();//home || game || play || signup \\ playslot(tamgioi)

            cc.log("loadingDialog timeout");
            // cc.log(MyPixi.isDestroy +" --- "+ isClickLogin);
            if(currentScene == "home"){
                cc.log("timeout and reconnect");
                LobbyClient.getInstance().changeServerAndLoginAgain();
                /*MH.logOut();
                MH.createPopup({
                    title:'Mất kết nối',
                    content:[
                        {
                            tag:'p',
                            //text:"Hệ thống thử kết nối lại cho bạn nhưng không thành công",
                            text:"Đăng nhập thất bại",
                        }
                    ]
                });*/

            }else{
                LobbyClient.getInstance().reConnect();
            }

            //var currentScene = cc.director.getRunningScene();

            //SceneNavigator.toLogin("Hết thời gian kết nối máy chủ");

        };

        this.isShow = function(){
            return false;
        };
    };

    LoadingDialogClass.getInstance = function () {
        if (!instance) {
            instance = new LoadingDialogClass();
            //instance.retain();
        }
        return instance;
    };
    LoadingDialogClass.reset = function () {
        if(instance){
            instance.hide();
            // if(MyPixi.stageGame)MyPixi.stageGame.removeChild(instance.container);
        }
        instance = null;
    };

    return LoadingDialogClass;
})();