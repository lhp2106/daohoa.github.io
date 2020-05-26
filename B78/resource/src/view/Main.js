function Main(gameID){
	this.gameId = gameID;
	var zorder = 0;
	MyPixi.gameRootLayer = null;
	
	MyPixi.gamePlayerLayer = null;
	MyPixi.gameContainerLayer = null;
	MyPixi.cardLayer = null;
	MyPixi.cardDragLayer = null;
	MyPixi.chipLayer = null;
	MyPixi.animationLayer = null;
	MyPixi.noticeLayer = null;
	MyPixi.popupLayer = null;
	MyPixi.topLayer = null;

	var runningScene = cc.director.getRunningScene();

	MyPixi.rendererGame = runningScene;
    MyPixi.stageGame = runningScene;
    MyPixi.gameContainer = runningScene._layer;
    MyPixi.popupContainer = runningScene;
    MyPixi.app = runningScene;

    MessageNode.getInstance().show("Đang vào game");
    if(!LobbyClient.getInstance().loadResource ){
        cc.log("-------loading resouce because loadfail startgame");
        this.loadSpriteSheet();
    }else{
        cc.log("-------loading resouce ignore aready load");
        this.spriteSheetLoaded();
    }
}

Main.MIN_SCROLL_SPEED = 5;
Main.MAX_SCROLL_SPEED = 15;
Main.SCROLL_ACCELERATION = 0.005;

Main.prototype.update = function() {};

Main.prototype.updateGame = function(dt){};

Main.prototype.loadSpriteSheet = function(){
	var thiz = this;
	cc.loader.load(LIST_RESOURCE_FILE, function(){
		thiz.spriteSheetLoaded();
	});

	cc.laoder.load(LIST_RESOURCE_SPIN_FILE, function(){
		//
	});
};

Main.prototype.onLoaded = function(loader, resources){};

Main.prototype.spriteSheetLoaded = function(){
	MessageNode.getInstance().hide();
	// this.gameFactory = new GameFactory(this.app, this.gameId);
	var game = new GameTLMN(cc.Global.dataGame);
	MyPixi.gameContainer.addChild(game);
};

Main.prototype.updateSmothie = function(){};