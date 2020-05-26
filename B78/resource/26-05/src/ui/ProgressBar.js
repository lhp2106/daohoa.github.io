var MyProgressBar = cc.ProgressTimer.extend({
	ctor: function(type, img){
		if( arguments.length == 0 ) type = cc.ProgressTimer.TYPE_RADIAL;
		if( arguments.length < 2 ) img = "#button/khung_avatar_thoigian.png";

		cc.ProgressTimer.prototype.ctor.call(this, new cc.Sprite(img));

		this.setType(type);
		this.setReverseDirection(true);
		this.setPercentage(0);

		this.count = 0;
	    this.coldown = 10000;//10s SECONDS
	    this.startColdown = false;

	    this.lineWidth = 180;

	    this.x = 0;
		this.y = 0;
		this.setAnchorPoint(cc.p3(0, 0));
	},
	stop: function(){

	},
	start: function(){
		// this.visible = true;
  //   	this.startColdown = true;
	},
	showTimeRemain: function(currentTime, maxTime){
		if(!maxTime) maxTime = this.MAX_TURN;
		this.visible = true;
		this.runAction( new cc.ProgressFromTo(currentTime/1000, 100*currentTime/maxTime, 0.0) );
	},
	stopTimeRemain: function(){
		this.stopAllActions();
		this.visible = false;
	}
});

var BaoSamTimer = MyProgressBar.extend({
	ctor: function(type, timebao){
		MyProgressBar.prototype.ctor.call(this, type, "#btn_baosam1.png");
		this.x = 0;
	    this.y = 0;
	    this.MAX_TURN = timebao;
	    this.lineWidth = 180;
	}
});

var ProgressCircleTimer = MyProgressBar.extend({
	ctor :function(type){
		MyProgressBar.prototype.ctor.call(this, type, "#game/timebar.png");
		this.x = 0;
	    this.y = 0;
	    this.lineWidth = 180;
	}
});