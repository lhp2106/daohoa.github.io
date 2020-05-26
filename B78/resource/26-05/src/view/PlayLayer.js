var PlayLayer = cc.Node.extend({
	ctor: function(){
		this._super();

        this.x = 0;
        this.y = cc.winSize.height;

		this.gameContainer = new cc.Node();
    	this.popupContainer = new cc.Node();
    	this.addChild(this.gameContainer);
    	this.addChild(this.popupContainer);

    	MyPixi.gameContainer = this.gameContainer;
    	MyPixi.popupContainer = this.popupContainer;

    	// cc.Global.dataGame = {"b":100,"tfeg":4000,"re":false,"tft":20000,"ps":[{"a":"http://api.prod.apislotvip.info/images/avatar/avatar_13.png","pS":0,"C":true,"rmC":0,"dn":"megabit","pid":4,"m":6550,"cs":[],"uid":"dc64bfc7-6bda-4760-89e3-c98a4702b03f","r":false,"As":{"gold":6550,"winTime":0,"chip":0,"looseTime":0,"vip":0,"exp":0},"pi":false,"id":0,"sit":0}],"tFDC":3000,"Mu":4,"rmT":0,"ldc":[],"cmd":202,"gS":1,"aid":1};

    	switch (cc.Global.gameId){
	        case  Constant.GAME_ID.XOCDIA:
	            this.gameLayer =  new GameXocDia(cc.Global.dataGame);
	            break;
	        case  Constant.GAME_ID.PHOM:
	            this.gameLayer =  new GamePhom(cc.Global.dataGame);
	            break;
	        case  Constant.GAME_ID.MAUBINH:
	            this.gameLayer =  new GameMauBinh(cc.Global.dataGame);
	            break;
	        case  Constant.GAME_ID.TLMN:
	            this.gameLayer =  new GameTLMN(cc.Global.dataGame);
	            //console.log( 'cc.Global.dataGame' );
	            //console.log( cc.Global.dataGame );
	            break;
	        case  Constant.GAME_ID.SAM:
	            this.gameLayer =  new GameSam(cc.Global.dataGame);
	            break;
	        case  Constant.GAME_ID.LIENG:
	            this.gameLayer =  new GameLieng(cc.Global.dataGame);
	            break;
	        case  Constant.GAME_ID.XITO:
	            this.gameLayer =  new GameXiTo(cc.Global.dataGame);
	            break;
	        case  Constant.GAME_ID.POKER:
	            this.gameLayer =  new GamePoker(cc.Global.dataGame);
	            break;
	        case  Constant.GAME_ID.BACAY:
	            this.gameLayer =  new GameBaCay(cc.Global.dataGame);
	            break;
	        case  Constant.GAME_ID.CHAN:
	            this.gameLayer =  new GameChan(cc.Global.dataGame);
	            break;
	    }

	    if(this.gameLayer) MyPixi.gameContainer.addChild(this.gameLayer);
	}
});