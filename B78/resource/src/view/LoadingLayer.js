var LoadingLayer = cc.Node.extend({
	ctor: function(){
		this._super();

		var size = cc.winSize;
        var bg = new cc.Sprite("res/loading/loading_bg.jpg");
        bg.setPosition(size.width/2,size.height/2);
        this.addChild(bg, 0);

        var logo = new cc.Sprite("res/loading/logo_big.png");
        logo.setPosition(size.width/2, size.height/2+50);
        this.addChild(logo);
        // this.addTouchIcon(logo);

        var loading_bg = new cc.Sprite("res/loading/loading_bg.png");
        loading_bg.setPosition(size.width/2, size.height/2-150);
        this.addChild(loading_bg);

        var loading_pr = new ccui.LoadingBar();
        loading_pr.loadTexture("res/loading/loading.png");
        loading_pr.setPercent(0);
        loading_pr.setPosition(size.width/2, size.height/2-150);
        this.addChild(loading_pr);

        // if( cc.sys.isNative ){}

        MH.loadRes(g_resources, function (result, count, loadedCount) {
            var percent = ((loadedCount+1) / count * 100) | 0;
            percent = Math.min(percent, 100);
            loading_pr.setPercent(percent);
        }, function(){
        	cc.director.getRunningScene().changePage("home");

            LobbyClient.getInstance().login( 'minhhoatest', '123qwe', function(){
                MH.loginDone( PlayerMe );
                // MH.openGame("TLMN");
            }, function(){
                MessageNode.getInstance().show('Đăng nhập không thành công');
            });
        });
	}
});