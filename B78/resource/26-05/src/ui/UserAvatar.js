var UserAvatar = cc.Node.extend({
	ctor: function(){
		this._super();
		

		if(cc.Global.gameId === Constant.GAME_ID.CHAN){

		}else{
			var avatarBg = new cc.Sprite('#khung_avatar.png');
			avatarBg.setAnchorPoint(cc.p3(0, 0));

	        var maskAv = new cc.Sprite("#mask_avatar.png"); //#mask_avatar.png

	        this.sizeW = maskAv.width;
	        this.sizeH = maskAv.height;

	        // var stencil = new cc.DrawNode();
	        // stencil.drawPoly(
	        //     [cc.p(0, 0),cc.p(107, 0),cc.p(107,106),cc.p(0, 106)],
	        //     cc.color(255, 0, 0, 255),
	        //     0,
	        //     cc.color(255, 255, 255, 0)
	        // );

	        var maskedFill = new cc.ClippingNode(maskAv);
	        maskedFill.setAlphaThreshold(0);
	        // maskedFill.setPosition(cc.p(0, 0));
	        this.maskedFill = maskedFill;
	        // maskedFill.setPosition(cc.p(avatarBg.width/2, avatarBg.height/2));
	        maskedFill.setPosition(cc.p(avatarBg.width/2, avatarBg.height/2+6));

	        avatarBg.addChild(maskedFill);

	        // var avatarImg = new cc.Sprite("res/avatar.png");
	        // maskedFill.addChild(avatarImg);
	        // this.avatarImg = avatarImg;
		}

		// avatarBg.visible = false;
		// avatarBg.opacity = 0;
	    this.addChild(avatarBg);
	    this.avatarBg = avatarBg;

	},
	loadAvatarFromUrl: function(avatarUrl){
		var thiz = this;
	    cc.loader.loadImg(avatarUrl, function(err, tex){
	    	// console.log(err, tex, tex.width, tex.height, thiz.sizeW, thiz.sizeH, Math.min(thiz.sizeW/tex.width, thiz.sizeH/tex.height));
	        if( !err ){
	        	thiz.maskedFill.removeAllChildren(true);

	        	var avar = new cc.Sprite(tex);
	            thiz.maskedFill.addChild(avar);
	            avar.setScale(Math.max(thiz.sizeW/tex.width, thiz.sizeH/tex.height));

	         //    var dotRed = PIXI.Sprite.fromImage('res/dot.png');
		        // dotRed.setAnchorPoint(0.5, 0.5);
		        // dotRed.setPosition(0,0);
		        // thiz.maskedFill.addChild(dotRed);
	        }
	    });
	},
	setAvatar: function(avatarUrl){
		if(avatarUrl.indexOf('http') !== -1){
	        if(avatarUrl.indexOf('graph.facebook.com') !== -1) {
	            avatarUrl = avatarUrl.concat('&redirect=false');
	            if(avatarUrl.endsWith("?")){
	                avatarUrl = avatarUrl.slice(0, -1);//remove last char
	            }
	            //cc.log("avatar fb : "+avatarUrl);
	            var thiz = this;
	            HttpRequest.requestGETMethod_FB(avatarUrl, null,null, function(status, response){
	                //cc.log("response "+JSON.stringify(response) );
	                if(response && response.data){
	                    var url = response.data.url;
	                    if(url) thiz.loadAvatarFromUrl(url);
	                }
	            });
	        }else this.loadAvatarFromUrl(avatarUrl);
	    }else{
	    	this.loadAvatarFromUrl(avatarUrl);

	        /*var sprite =loaderAvatar.resources[avatarUrl];//.texture;// PIXI.Sprite.fromFrame(avatarUrl);
	        var scaleX = this.size.width/sprite.width;
	        var scaleY = this.size.height/sprite.height;
	        var scale = scaleX < scaleY ? scaleX : scaleY;
	        //sprite.scale.set(scale, scale);
	        this.avatarImg.texture=sprite.texture;
	        this.avatarImg.scale.set(scale, scale);*/
	        cc.log("user ko co avatar");
	    }
	}
});

var UserAvatar2 = cc.Sprite.extend({
	ctor: function(size, circleImg){
		this._super();
		if(size){
			// this.size = size;
			this.setContentSize(size);
		}
    	if(cc.isUndefined(circleImg)) circleImg = true;
    	var avatarBg = new cc.Sprite('#khung_avatar.png');//('bg_avatar_home.png');

    	if(cc.Global.gameId === Constant.GAME_ID.CHAN && circleImg){
	        avatarBg.displayGroup = MyPixi.gamePlayerLayer;
	        avatarBg = new cc.Sprite("#game/khung_avatar_chan.png");
	        var radian = (avatarBg.width -20)/2;
	        var maskAvatar = new MaskCircleLayer(radian);
	        maskAvatar.displayGroup = MyPixi.gamePlayerLayer;
	        maskAvatar.setPosition(cc.p2(size.width/2, size.height/2));
	        this.addChild(maskAvatar);
	        //maskAvatar.showBlurBg(true);
	        //maskAvatar.displayGroup = avt.displayGroup;
	        var avatarImg = new PIXI.Sprite();// new PIXI.Sprite.fromFrame('bg_avatar_home.png');// new PIXI.Sprite();// new cc.Sprite();
	        avatarImg.setPosition(cc.p2(-size.width/2,-size.height/2));
	        maskAvatar.addChild(avatarImg);
	        this.avatarImg = avatarImg;
	        this.maskAvatar = maskAvatar;
	    }else{
	        var avatarImg = new cc.Sprite(); //new PIXI.Sprite.fromFrame('bg_avatar_home.png');// new PIXI.Sprite();// new cc.Sprite();
	        this.addChild(avatarImg);
	        this.avatarImg = avatarImg;
	    }

	    if(this.size && cc.Global.gameId !== Constant.GAME_ID.CHAN){
	        var scaleX = this.size.width/avatarBg.width;
	        var scaleY = this.size.height/avatarBg.height;
	        var scale = scaleX < scaleY ? scaleX : scaleY;
	        //cc.log("scale -- "+scale);
	        avatarBg.scale.set(scale, scale);
	    }

	    maskedFill.setPosition(cc.p(avarWrap.width/2, avarWrap.height/2));

	    avatarBg.visible = false;
	    this.addChild(avatarBg);
	    this.avatarBg = avatarBg;
	},
	setSizeAvatar: function(size){
		this.setContentSize(size);
		// this.size = size;
	},
	setAvatarBg: function(avatarImg){
		this.avatarBg.setSpriteFrame(avatarImg);
	},
	setAvatar: function(avatarUrl){
		if(avatarUrl.indexOf('http') !== -1){
	        if(avatarUrl.indexOf('graph.facebook.com') !== -1) {
	            avatarUrl = avatarUrl.concat('&redirect=false');
	            if(avatarUrl.endsWith("?")){
	                avatarUrl = avatarUrl.slice(0, -1);//remove last char
	            }
	            //cc.log("avatar fb : "+avatarUrl);
	            var thiz = this;
	            HttpRequest.requestGETMethod_FB(avatarUrl, null,null, function(status, response){
	                //cc.log("response "+JSON.stringify(response) );
	                if(response && response.data){
	                    var url = response.data.url;
	                    if(url) thiz.loadAvatarFromUrl(url);
	                }
	            });
	        }else this.loadAvatarFromUrl(avatarUrl);
	    }else{
	        /*var sprite =loaderAvatar.resources[avatarUrl];//.texture;// PIXI.Sprite.fromFrame(avatarUrl);
	        var scaleX = this.size.width/sprite.width;
	        var scaleY = this.size.height/sprite.height;
	        var scale = scaleX < scaleY ? scaleX : scaleY;
	        //sprite.scale.set(scale, scale);
	        this.avatarImg.texture=sprite.texture;
	        this.avatarImg.scale.set(scale, scale);*/
	        cc.log("user ko co avatar");
	    }
	},
	loadAvatarFromUrl: function(avatarUrl){
		var thiz = this;
	    cc.log("avatar----load "+avatarUrl);
	    cc.loader.loadImg(avarUrl, function(err, tex){
	        cc.log("ava load textures",tex);
	        var avar = new cc.Sprite(tex);
	        maskedFill.addChild(avar);
	        avar.setScale(Math.min( maskAv.width/avar.width, maskAv.height/avar.height ));
	    });
	},
	createLobbyAvatar: function(){
		var avt = new UserAvatar();
	    avt.setAvatarBg("#bg_avatar_home.png");
	    return avt;
	},
	createMe: function(){
		var avt = new UserAvatar();
	    avt.setAvatarBg("#bg_avatar_home.png");
	    return avt;
	},
	createAvatar: function(){
		var avt = new UserAvatar();
	    avt.setAvatarBg("#bg_avatar_home.png");
	    return avt;
	}
});

// UserAvatar.createAvatarGame = function (size, circleImg) {
//     var avt = new UserAvatar(size, circleImg);
//     return avt;
// };