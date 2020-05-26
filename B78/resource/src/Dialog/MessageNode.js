/**
 * Created by Qk on 7/11/2016.
 */

var MessageNode = (function() {

    var instance = null;
    var MessageNodeClass = function(){
        var thiz = this;

        this.container = null;
        this.isShow = false;

        this.show = function () {
        	if( this.isShow ) this.hide();

            this.container = new cc.Node();

            this.container.x = cc.winSize.width/2;
            this.container.y = 100;
            this.container.opacity = 0;
            this.container.setCascadeOpacityEnabled(true);

            cc.director.getRunningScene().addChild(this.container, 9999);

            var bg = new cc.Scale9Sprite("res/input_default.png");//, cc.rect(0, 0, 350, 65)
            this.container.addChild(bg);

            var lb = new cc.LabelTTF(arguments[0], MH.getFont("Font_Default"), 32);
            this.container.addChild(lb);

            bg.width = lb.width + 60;
            lb.y = -5;

            var timeOut = 3;
            if(arguments.length == 2) timeOut = arguments[1];

            var actionText = cc.moveTo(0.2, cc.p( cc.winSize.width/2, 200 ));
            this.container.runAction( cc.fadeIn(0.2) );
            this.container.runAction( cc.sequence(actionText, cc.delayTime(timeOut), cc.callFunc(this.hide, this, true)));

            this.isShow = true;
        };

        this.hide = function(){
            if( arguments.length != 0 ){
                this.container.runAction( cc.scaleTo(0.2,1.2) );
                this.container.runAction( cc.sequence(cc.fadeOut(0.2), cc.callFunc(function(){
                    this.container.removeFromParent();
                    this.container = null;
                    this.isShow = false;
                }, this)));
            }else{
                this.container.removeFromParent();
                this.container = null;
                this.isShow = false;
            }
        };
    };

    MessageNodeClass.getInstance = function () {
        if (!instance) {
            instance = new MessageNodeClass();
            //instance.retain();
        }
        return instance;
    };
    MessageNodeClass.reset = function () {
        if(instance){
            instance.hide();
        }
        instance = null;
    };

    return MessageNodeClass;
})();