/**
 * Created by k on 7/11/2016.
 */




var MiniGameLoadingDialog = (function() {

    var instance = null;
    var MiniGameLoadingDialogClass = function(){
        var thiz = this;
        this.ctor = function () {
           

        };

        this.show = function () {
            var title = "";
            if(arguments.length){
                title = arguments[0];
            }else{
                title = "Đang kết nối";
            }
            var thiz = this;

            MH.miniGameLoadingDialog.show({
                text:title,
                timeout: 10000,
                afterTimeout: function(){
                    thiz.timeOutCall();
                }
            });
        };
        this.showReconnect = function () {
            var title = "Tự động kết nối lại sau 2s";
            var thiz = this;
            if(cc.isClientGameBai() ){
                setTimeout(function(){
                    thiz.timeOutCall();
                }, 2000);
            }else{
                MH.miniGameLoadingDialog.show({
                    text:title,
                    timeout: 2000,
                    afterTimeout: function(){
                        thiz.timeOutCall();
                    }
                });
            }


        };
       
        this.hide = function () {
            MH.miniGameLoadingDialog.hide();
            
        };
        this.isShow = function () {
            return false;
            
        };
       
        this.timeOutCall = function () {
            MH.miniGameLoadingDialog.hide();
            var isLogin = MiniGameClient.getInstance().isLoginDone();
            var isClickLogin = MiniGameClient.getInstance().isClickLogin();

            cc.log("minigame loadingDialog timeout - try reconnect again");
            MiniGameClient.getInstance().reConnect();
        };

        this.ctor();
    };





    MiniGameLoadingDialogClass.getInstance = function () {
        if (!instance) {
            instance = new MiniGameLoadingDialogClass();
            //instance.retain();
        }
        return instance;
    };
    MiniGameLoadingDialogClass.reset = function () {
        if(instance){
            instance.hide();
            if(MyPixi && MyPixi.stageGame)MyPixi.stageGame.removeChild(instance.container);
        }
        instance = null;
    };

    return MiniGameLoadingDialogClass;
})();