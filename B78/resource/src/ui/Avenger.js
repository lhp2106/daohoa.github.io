var Avenger2 = cc.Class.extend({
    numIcons: 30,
    view: new cc.Node(),
    onSpin: false,
    ctor: function(){
        var size = cc.winSize;
        var bgkhung = new cc.Sprite("res/avenger/khung.jpg");
        this.view.addChild(bgkhung, 0);
        this.view.setPosition(cc.p(size.width/2, size.height/2));

        var stencil = new cc.DrawNode();
        // 865x480
        stencil.drawPoly(
            [cc.p(0, 0),cc.p(865, 0),cc.p(865,480),cc.p(0, 480)],
            cc.color(255, 0, 0, 255),
            0,
            cc.color(255, 255, 255, 0)
        );

        // stencil.setPosition(cc.p(-432, -200));

        var khung = new cc.ClippingNode(stencil);
        // // maskedFill.setAlphaThreshold(0);
        // console.log( '----- '+ 0 );
        // maskedFill.addChild(target);

        khung.setPosition(cc.p(-432, -200));
        this.view.addChild(khung, 2);


        var cols = [];

        for(var i=0; i<5; i++){
            var col = new cc.Node();
            for(var j=0; j<this.numIcons; j++){
                var icon = new cc.Sprite("res/avenger/icon/2.png");
                icon.setPosition(cc.p(85, 79+j*160));
                col.addChild(icon, 0);
            }

            col.setPosition(cc.p(i*173,0));
            khung.addChild(col, 0);
            cols.push(col);
        }

        // var colMove = new cc.MoveTo(3, cc.p( cols[0].x, -12*160));
        // cols[0].runAction(colMove);
        this.cols = cols;

        this.btnSpin = new ccui.Button();
        this.btnSpin.loadTextures("res/avenger/btn_quay_0.png", "res/avenger/btn_quay_0.png");
        this.btnSpin.addTouchEventListener(function(sender, type){
            cc.log(type);
            switch(type){
                case ccui.Widget.TOUCH_BEGAN:
                    console.log('began');
                    this.spin();
                    break;
                case ccui.Widget.TOUCH_MOVED:
                    // console.log('moved', sender);
                    //thiz.btnSpin.setPosition(cc.p( sender._touchMovePosition.x-640, sender._touchMovePosition.y-360 ));
                    break;
                case ccui.Widget.TOUCH_ENDED:
                    //console.log('ended', cc.p( sender._touchMovePosition.x-640, sender._touchMovePosition.y-360 ));

                    break;
                case ccui.Widget.TOUCH_CANCLLED:
                    console.log('cancelled');
                    break;
            }
        }, this);
        this.btnSpin.setPosition(cc.p(547,-279));
        this.view.addChild(this.btnSpin, 5);

        var btnTuquay = new ccui.Button();
        btnTuquay.loadTextures("res/avenger/btn_tuquay.png", "res/avenger/btn_tuquay.png");
        btnTuquay.setPosition(cc.p(349,-316));
        this.view.addChild(btnTuquay);

    

        //thiz.btnSpin.setPosition(cc.p( sender._touchMovePosition.x-640, sender._touchMovePosition.y-360 ));

        cc.log('new Avenger');
    },
    spin: function(){
        if(this.onSpin) return;
        this.onSpin = true;

        for(var i=0; i<5; i++){
            var delay = cc.delayTime(i*0.3);
            var colMove = cc.moveTo(3, cc.p( this.cols[i].x, (3-this.numIcons)*160)).easing(cc.easeInOut(2.0));

            if(i===4){
                var sequence = cc.sequence( delay, colMove, new cc.CallFunc(this.spinDone, this) );
                this.cols[i].runAction(sequence);
            }else{
                var sequence = cc.sequence( delay, colMove );
                this.cols[i].runAction(sequence);
            }
        }
    },
    spinDone: function(){
        this.onSpin = false;
        for(var i=0; i<5; i++){
            this.cols[i].y = 0;
        }
    }
});

var Avenger = cc.Layer.extend({
    ctor: function(){
        this._super();

        var size = cc.winSize;
        this.setPosition(cc.p(size.width/2, size.height/2));

        var bgkhung = new cc.Sprite("res/avenger/khung.jpg");
        this.addChild( bgkhung );

        var btnBack = new ccui.Button("res/avenger/btn_back.png");
        this.addChild(btnBack);
        btnBack.addTouchEventListener(function(sender, type){
            if( type === ccui.Widget.TOUCH_ENDED ) MH.changePage("home");
        }, this);
    }
});

