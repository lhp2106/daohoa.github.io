/**
 * Created by kk
 */
var CardAlign = CardAlign || {};

CardAlign.LEFT =1;
CardAlign.CENTER =2;
CardAlign.RIGHT =3;
var CardSuit = CardSuit || {};
//CardSuit.Spades = 0;
//CardSuit.Clubs = 1;
//CardSuit.Diamonds = 2;
//CardSuit.Hearts = 3;
CardSuit.Spades = 1;
CardSuit.Clubs = 2;
CardSuit.Diamonds = 3;
CardSuit.Hearts = 4;

var state_card = state_card || {};
state_card.NOTHING = 0;
state_card.ORANGE_BORDER = 1;
state_card.TRI_ANGLE = 2;

var s_card_suit = s_card_suit || [];
s_card_suit[CardSuit.Hearts] = "c";
s_card_suit[CardSuit.Diamonds] = "r";
s_card_suit[CardSuit.Clubs] = "t";
s_card_suit[CardSuit.Spades] = "b";
//var SPEED = 1500;//100 PIXEL/S

var Card = cc.Sprite.extend({
	ctor: function(rank, suit, listener){
		this._super("#"+rank + s_card_suit[suit] +".png");

		this.displayGroup = MyPixi.cardLayer;

	    this.canTouch = true;
	    this.canMove = false;
	    this.point = rank;
	    this.suit = suit;
	    this.listener = listener;

	    this.widthContainer = this.width;
	    this.heightContainer = this.height;

	    //var scale = this.scale.y;
	    var remainBg = new cc.Sprite("#button/elip_cards.png");
	    remainBg.setAnchorPoint(cc.p3(.5,.5));
	    // remainBg.setPosition(this.width, this.height);
	    cc.log("set backcard", this.width, this.height);
	    this.addChild(remainBg);

	    this.remainBg =remainBg;
	    this.remainBg.visible = false;
	    this.remainCard = 13;
	    if(cc.Global.gameId == Constant.GAME_ID.SAM)  this.remainCard = 10;

	    // this.lblRemain =  cc.LabelTTF(""+this.remainCard,cc.res.font.Roboto_Condensed,30, null, "000000");
	    this.lblRemain = new cc.LabelTTF(""+this.remainCard, cc.res.font.Roboto_Condensed, 30);
	    this.lblRemain.setAnchorPoint(cc.p3(0.5, 0.5));
	    this.lblRemain.setPosition( this.remainBg.width/2, this.remainBg.height/2 );
		this.lblRemain.setFontFillColor(cc.color("#000000"));
	    //this.lblRemain.setColor(cc.color("#000000"));
	    //this.lblRemain.position.set(remainBg.width/2, remainBg.height/2);
	    remainBg.addChild(this.lblRemain);

	    var blurBg = new cc.Sprite("#white_card.png");
	    blurBg.opacity = 102; //0.4
	    blurBg.setAnchorPoint(0, 0);
	    this.blurBg = blurBg;
	    this.addChild(this.blurBg);
	    this.blurBg.visible = false;

	    this.effectSprite = new cc.Sprite("#card_select1.png");//button/triangle.png  card_select1
	    this.effectSprite.setAnchorPoint(cc.p3(0.5,.5));
	    //this.effectSprite.position.set(this.widthContainer/2, this.heightContainer/2);
	    this.addChild(this.effectSprite);
	    this.effectSprite.visible = false;


	    this.touchRect = cc.rect(0, 0,this.widthContainer, this.heightContainer);
	    this.cardDistance = this.widthContainer;
	    this.originState =state_card.NOTHING;
	    this.originScale = this.getScaleY();
	    this.originVisible = true;//default se visible
	    this.originShowBack  = false;//mac dinh ko show backcard
	    this.origin = cc.p(0, 0);

	    this.isTouched = false;
	    this._selected = false;
	},
	onEnter: function () {
        this._super();

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function (touch, event) {
                return this._onTouchBegan(touch, event);
            }.bind(this),
            onTouchEnded : function (touch, event) {
                this._onTouchEnded(touch, event);
            }.bind(this),
            onTouchMoved :  function (touch, event){
                this._onTouchMoved(touch, event);
            }.bind(this),
        }, this);
	},
	onExit : function () {
        this._super();

        cc.eventManager.removeListeners(this);
    },
    _onTouchBegan: function(touch, event){
    	if(this.canTouch && !this.isTouched){
            var p = this.convertToNodeSpace(touch.getLocation());
           // var rect = this.getBoundingBox();
            if(cc.rectContainsPoint(this.touchRect, p)){
                // this.isTouched = true;
                // this.isMoved = false;
                // this.preTouchPoint = touch.getLocation();



                this.onButtonDown(touch, event);

                return true;
            }
        }
        return false;
    },
    _onTouchEnded: function(touch, event){
    	this.onButtonUp();
    },
    _onTouchMoved: function(touch, event){
    	this.onButtonMove(touch, event);
    },
	onButtonDown: function(touch, event){
	    this.oldGroup = this.displayGroup;
	    this.isAcpetTouch = false;
	    if(this.originState == state_card.TRI_ANGLE){
	        //cc.log(" pending send an cay bai phom");
	        LobbyClient.getInstance().postEvent(kCMD.PHOM_EARN_CARD, {});
	        /*var scene = cc.director.getRunningScene();
	         if(scene.sendAnBai) scene.sendAnBai();*/
	        this.isAcpetTouch = false;
	    }else if(this.canTouch && !this.isTouched){
	        //var p = this.convertToNodeSpace(touch.getLocation());

	        // var p = event.data.getLocalPosition(thiz.parent);
	        // this.data = event.data;

	        this.isTouched = true;
	        this.isMoved = false;

	        // thiz.preTouchPoint = event.data.getLocalPosition(thiz.parent);
	        this.preTouchPoint = touch.getLocation();


	        //anchor 0.5, 0.5 thi phai trừ di pos (x,y)
	        //thiz.preTouchPoint.x -= this.x;// - this.widthContainer/2;
	        //thiz.preTouchPoint.y -= this.y;// - this.heightContainer/2;

	        //return true;
	        this.isAcpetTouch = true;
	        //cc.log("isAcpetTouch true");

	    }
	},
	onButtonUp: function(){
	    if(!this.isAcpetTouch ) return;
	    this.isTouched = false;

	    if(this.isMoved){
	        this.moveToOriginPosition();
	        //thiz.getParent().reorderChild(thiz, thiz.cardIndex);
	        if(this.oldGroup) this.displayGroup = this.oldGroup;
	    }
	    else{
	        // var thiz = this;
	        if(cc.Global.gameId === Constant.GAME_ID.TLMN || cc.Global.gameId === Constant.GAME_ID.SAM){
	            SuggestCardMng.getInstance().onSuggestUpCard( this, !this.isSelected());
	        }
	        this.setSelected(!this._selected);


	        if(this.listener && this.listener.onTouchCard) this.listener.onTouchCard(this);

	    }
	},
	onButtonMove: function(touch, event) {
		var thiz = this;
	    if(!this.isAcpetTouch ) return;
	    if(!this.canMove) return;

	    //cc.log("moveeeee");

	    var p = touch.getLocation();
	    //var p = this.data.getLocalPosition(this.parent);
	    if(!this.isMoved){
	        if(cc.pDistance(this.preTouchPoint, p) < 5.0){
	            return;
	        }
	        else{
	            if(this.oldGroup && this.oldGroup!= MyPixi.cardDragLayer){
	                this.displayGroup = MyPixi.cardDragLayer;
	            }
	            //thiz.getParent().reorderChild(this, 200);
	            this.isMoved = true;
	        }
	    }

	    /*thiz.x += p.x - thiz.preTouchPoint.x;
	     thiz.y += p.y - thiz.preTouchPoint.y;*/
	    this.x += p.x - this.preTouchPoint.x;
	    this.y += p.y - this.preTouchPoint.y;

	    this.preTouchPoint = p;
	},
	moveToOriginPosition: function (isUp) {
		if(!this.isTouched){
            this._selected = false;
            // this.stopAllActions();

            // var beforeMove = new PIXI.action.CallFunc(function() {
            //     //thiz.getParent().reorderChild(thiz, thiz.cardIndex + 100);
            //     thiz.displayGroup = MyPixi.cardDragLayer;
            //     thiz.reveal(!this.originShowBack);
            //     thiz.visible = thiz.originVisible;
            //     thiz.showEffectCard(thiz.originState);
            // });

            var beforeMove = new cc.CallFunc(function(){
            	this.displayGroup = MyPixi.cardDragLayer;
                this.reveal(!this.originShowBack);
                this.visible = this.originVisible;
                this.showEffectCard(this.originState);
            }.bind(this));


            // var afterMove = new PIXI.action.CallFunc(function() {
            //     //thiz.getParent().reorderChild(thiz, thiz.cardIndex);
            //     thiz.displayGroup = MyPixi.cardLayer;
            //     if(isUp){
            //         thiz.setSelected(true);
            //     }
            // });

            var afterMove = new cc.CallFunc(function(){
            	this.displayGroup = MyPixi.cardLayer;
                if(isUp){
                    this.setSelected(true);
                }
            }.bind(this));

            this.visible = this.originVisible;
            this.reveal(!this.originShowBack);

            var animTime = cc.pDistance(this.getPosition(), this.origin)/SPEED;
            var move =  new cc.MoveTo(animTime, this.origin.x, this.origin.y);
            var scale =  new cc.ScaleTo(animTime, this.originScale);

            var action =  new cc.Sequence(beforeMove, new cc.Spawn(move, scale) ,afterMove);
            this.runAction(action);
        }
	},
	setSelected: function (selected) {
		this._selected = selected;
        if(selected){
            this.y = this.origin.y + Card.SELECT_MOVE_DISTANCE;

        }
        else {
            this.y = this.origin.y;
        }
	},
	isSelected: function () {
		return this._selected;
	},
	enableMove: function(canMove){
		this.canMove = canMove;
	},
	moveDown: function(checkSuggest){
		this.setSelected(false);
        if(checkSuggest){
            if(cc.Global.gameId === Constant.GAME_ID.TLMN || cc.Global.gameId === Constant.GAME_ID.SAM){
                SuggestCardMng.getInstance().onSuggestUpCard( this, this.isSelected());

            }

        }
	},
	flipCard: function(scaleDefault){
        if(!scaleDefault) scaleDefault = this.originScale;
        var action1 = cc.scaleTo(.2, 0, scaleDefault);//scaleX to 0 in .2s
        var action2 = cc.scaleTo(.2, scaleDefault, scaleDefault);
        var callback = cc.callFunc(function(){
            this.reveal(true);
        }.bind(this));
        var action = cc.sequence(action1, callback, action2);

        this.runAction(action);
        // var animation = PIXI.actionManager.runAction(thiz, action);
        // this.animation.push(animation);
	},
	reveal: function(isShow){
		if(!isShow){
            // this.texture = PIXI.Texture.fromFrame("card_face_down.png");
            this.setSpriteFrame("card_face_down.png");
        } else{
            // this.texture = PIXI.Texture.fromFrame(this.point + s_card_suit[this.suit] +".png");
            this.setSpriteFrame(""+this.point + s_card_suit[this.suit] +".png");
        }
	},
	isCardMoveUp: function(isBlur) {
		return this.isSelected();
	},
	showEffectCard: function(stateCard) {
		this.originState = stateCard;
        this.effectSprite.visible = true;
        this.effectSprite.setPosition(0,0);
        this.effectSprite.stopAllActions();
        // if(this.effectSpriteAction){
        //     PIXI.actionManager.cancelAction( this.effectSpriteAction);
        //     this.effectSpriteAction = null;
        // }
        //this.widget.setTouchEnabled(false);

        if(stateCard == state_card.NOTHING){
            this.effectSprite.visible = false;
        }else if(stateCard == state_card.ORANGE_BORDER){
            this.effectSprite.setSpriteFrame("card_select1.png");
            // this.effectSprite.texture = PIXI.Texture.fromFrame("card_select1.png");
        }else if(stateCard == state_card.TRI_ANGLE){
            //this.widget.setTouchEnabled(true);

            this.effectSprite.setSpriteFrame("button/triangle.png");
            //cc.log("set triangle-------");
            // this.effectSprite.texture = PIXI.Texture.fromFrame("button/triangle.png");
            var size = cc.size(this.widthContainer, this.heightContainer);
            //this.effectSprite.position.set(size.width/2, size.height -40);
            this.effectSprite.setPosition(cc.p2(0, -90));

            var ac =  cc.sequence(cc.moveTo(.5, cc.p(0, -110)), cc.moveTo(.5, cc.p(0, -90))  );
            var repeat = cc.repeatForever(ac);
            // this.effectSpriteAction = PIXI.actionManager.runAction(this.effectSprite, repeat);
            this.effectSprite.runAction(repeat);
        }
	},
	revealBlur: function(isBlur) {
		this.blurBg.visible = isBlur;
        this.blurBg.rotation = this.rotation;
        this.canTouch = !isBlur;
	},
	isBlur: function() {
		return this.blurBg.visible;
	},
	getCardComboIdBitWise: function(){
		return this.comboId;
	},
	resetCardComboId: function(){
		this.comboId = CARD_COMBO.NORMAL;
	},
	setCardComboIdBitWise: function(id){
		this.comboId = this.comboId | id;
	},
	showRemainCard: function(isShow, numRemain){
		if(cc.Global.gameId == Constant.GAME_ID.SAM){
            if(numRemain < 0){
                var value = this.remainCard + numRemain;
                cc.log("reduce => value "+ value);
                if(value > 1) isShow = false;
            }else if(numRemain > 1)  isShow = false;
        }

        this.remainBg.visible = isShow;

        if( numRemain){
            if(numRemain < 0){
                this.remainCard += numRemain;
            }else{
                this.remainCard = numRemain;
            }
            var str =  this.remainCard <=0 ? "" : (""+this.remainCard);
            this.lblRemain.setString(str);
        }
        this.remainBg.visible = isShow;
        var scale = this.getScaleY()
        //this.remainBg.position.set(this.widthContainer/2 *scale  - this.remainBg.width/2, this.heightContainer/2 *scale - this.remainBg.height/2);
    	this.remainBg.setPosition(this.widthContainer/2, this.heightContainer/2);
	},
	getCardData: function(){
		var card  = Types.Card(this.point, this.suit);// Card.fromId(id);
        return card;
	},
	onSuggestUp: function(forceUp){
		this.setSelected(true);
	}
});

Card.SELECT_MOVE_DISTANCE = 20;


var CardList = cc.Node.extend({
	ctor: function(size, originScale, align){
		this._super();
		this.topLeftRoot = cc.p(0,0);// x,y tu top-left root layer den top left cardlist
	    //topLeftRoot se assign ngay sau khi new CardList o bat ky cho nao
	    this.canTouch = true;
	    this.cardOrigiScale = originScale ? originScale : 1;
	    this.oldCardOrigiScale = this.cardOrigiScale;
	    this.originVisible =true;
	    this.originShowBack = false;
	    this.align = align ? align : CardAlign.LEFT;
	    this.cardList = [];
	    //this.setContentSize(size);
	    //this.setAnchorPoint(cc.p(0.5,0.5));
	    this.size = size;
	    this.widthContainer = size.width;
	    this.heightContainer = size.height;
	    this.deckPoint = cc.p(cc.winSize.width/2, cc.winSize.height/2);
	},
	setContentSize: function(size){
		// this._super();
		this.widthContainer = size.width;
    	this.heightContainer = size.height;
	},
	resetOrigin: function(size){
		this.cardOrigiScale = this.oldCardOrigiScale;
    	this.cardSize = null;
	},
	showBlurBg: function(isShow, colorHexa){
		// if(isShow){
	 //        if(!this.graphics){
	 //            this.graphics = new PIXI.Graphics();
	 //            this.graphics.displayGroup =   this.displayGroup;
	 //        }
	 //        var colorArr = [0x8325ea, 0xff0000, 0xe4562f, 0x6cf170, 0x6b038e];
	 //        var color =colorArr[Math.floor(Math.random()*colorArr.length)];
	 //        if(colorHexa) color = colorHexa;
	 //        this.parent.addChild(this.graphics);
	 //        this.graphics.setPosition(this.x, this.y);
	 //        this.graphics.clear();
	 //        this.graphics.beginFill(color,.5);
	 //        this.graphics.drawRect(0, 0, this.size.width, this.size.height);
	 //        this.graphics.endFill();
	 //    }else{
	 //        if(this.graphics) this.graphics.clear();
	 //    }
	    cc.log("cardlist showBlurBg");
	},
	onTouchCard: function(card){
		//touch 1 card phom thi move down caca card con lai
	    if(cc.Global.gameId === Constant.GAME_ID.PHOM ){
	        for(var i =0, length = this.cardList.length; i< length; i++){
	            var c = this.cardList[i];
	            if(c.point === card.point && c.suit == card.suit){
	                continue;
	            }
	            if(this.mutiSelect) continue;
	            c.moveDown();
	        }
	    }
	},
	reOrderByPoint: function (arrCodeCard){
		this.xepbai(arrCodeCard, CardAlign.CENTER);
	},
	reOrder: function(){
		if(this.cardList.length > 0){
	        var width = this.cardSize.width * this.cardList.length;
	        if(width > this.widthContainer){
	            width = this.widthContainer;
	        }else{

	        }

	        var dx = width / this.cardList.length;

	        var x = dx/2 ;
	        var shiftLeft = 20;
	        if(dx >= (this.cardSize.width -10) ) dx -= shiftLeft;
	        else shiftLeft =0;
	        if(this.align == CardAlign.CENTER) x = this.widthContainer/2 - width/2 + (this.cardList.length)*shiftLeft/2 + dx/2;
	        var y = this.heightContainer/2;
	        //cc.log("PHOMLIST height y reoder "+y);
	        for(var i=0;i<this.cardList.length;i++){
	            var card = this.cardList[i];
	            //cc.log("PHOMLIST height y anchor "+card.anchor.y);
	            card.origin = cc.p(x, y);
	            card.cardIndex = i;
	            card.cardDistance = dx;
	            //this.reorderChild(card, i);
	            card.moveToOriginPosition();
	            x += dx;
	        }
	    }
	},
	reOrderWithoutAnimation: function(){
		if(this.cardList.length > 0){
	        var width = this.cardSize.width * this.cardList.length;
	        if(width > this.widthContainer){
	            width = this.widthContainer;
	        }
	        var dx = width / this.cardList.length;

	        var x = dx/2 ;
	        if(dx >= (this.cardSize.width -10) ) dx -= 20;
	        var y = this.heightContainer/2;
	        for(var i=0;i<this.cardList.length;i++){
	            var card = this.cardList[i];
	            card.origin = cc.p(x, y);
	            card.cardIndex = i;
	            card.cardDistance = dx;
	            //this.reorderChild(card, i);
	            card.setPosition(x,y);
	            x += dx;
	        }
	    }
	},
	xepbai: function(arrSuggest, align){
		if(this.cardList.length != arrSuggest.length){
	        cc.log(this.getCodeCards().toString() +" fuckkkk xepbai");
	        LobbyClient.getInstance().reConnect();
	        //MessageNode.getInstance().show(this.cardList.length + "Xếp bài thất bại "+arrSuggest.length);
	        return;
	    }
	    var newList = [];
	    if(this.cardList.length > 0){
	        var width = this.cardSize.width * this.cardList.length;
	        if(width > this.widthContainer){
	            width = this.widthContainer;
	        }else{

	        }

	        var dx = width / this.cardList.length;

	        var x = dx/2 ;
	        var shiftLeft = 20;
	        if(align == CardAlign.CENTER) x = this.widthContainer/2 - width/2 + (this.cardList.length)*shiftLeft/2 + dx/2;

	        if(dx >= (this.cardSize.width -10) ) dx -= 20;
	        var y = this.heightContainer/2;
	        for(var i=0;i<arrSuggest.length;i++){
	            var card = this.getCardByRank(arrSuggest[i].point, arrSuggest[i].suit);
	            //cc.log("xepbai "+x +" => "+y);
	            card.origin = cc.p(x, y);
	            card.cardIndex = i;
	            //cc.log(i +" == "+ card.cardIndex);
	            card.cardDistance = dx;
	            //this.reorderChild(card, i);
	            card.moveToOriginPosition();
	            x += dx;
	            newList.push(card);
	        }

	        this.cardList.length = 0;
	        this.cardList = newList;

	    }
	},
	setDeckPoint: function (deckPoint){
		// var gloalPos = this.getGlobalPosition();
		var gloalPos = this.convertToWorldSpace(this.getPosition());
    	this.deckPoint = cc.pSub(deckPoint, gloalPos);
	},
	addNewCard: function (cardId, animation, pos, startScale){
		var arr = [];
	    for(var i =0;i<cardId.length;i++){
	        var card = new Card(cardId[i].point, cardId[i].suit , this);
	        var startPos = pos? pos : this.deckPoint;


	        this.addCard(card);
	        card.setAnchorPoint(.5,.5);
	        card.setPosition(startPos.x, startPos.y);
	        var scale = (startScale ? startScale : this.cardOrigiScale);
	        card.setScale(scale,scale);
	        arr.push(card);
	    }
	    if(animation)this.reOrder();
	    else  this.reOrderWithoutAnimation();

	    return arr;
	},
	addNewCardWithEffectBorder: function (cardId, animation, moveUpAfterAnim, pos){
		var arr = this.addNewCard(cardId, animation, moveUpAfterAnim, pos);
	    for(var i =0; i < arr.length; i++){
	        arr[i].showEffectCard(state_card.ORANGE_BORDER);
	    }
	},
	addCard: function (card){
		if(!this.cardSize){
	        this.cardSize = cc.size(card.width, card.height);
	        //cc.log("fuck "+this.cardSize.height);
	        if(this.cardSize.height > this.heightContainer){
	            cc.log("fuckkkk this.heightContainer "+this.heightContainer);
	            var ratio = this.heightContainer / this.cardSize.height;
	            this.cardSize.width *= ratio;
	            this.cardSize.height *= ratio;
	            cc.log("this.cardSize.width", this.cardSize.width);
	        }
	    }
	    //cc.log("card.height "+card.height +"  ==> this.cardSize.height "+this.cardSize.height);
	    if(card.height > this.cardSize.height){
	        this.cardOrigiScale = this.cardSize.height/card.height;
	        card.setScale(this.cardOrigiScale, this.cardOrigiScale);
	    }
	    card.cardIndex = this.cardList.length;
	    card.origin = cc.p(0, 0);
	    card.originScale =this.cardOrigiScale;// card.scale.y;
	    card.originVisible = this.originVisible ;
	    card.originShowBack =this.originShowBack;
	    card.canTouch = this.canTouch;
	    card.isTouched = false;
	    card.listener = this;
	    //cc.log("card.canTouch ==> "+this.canTouch);
	    //var p = this.convertToNodeSpace(cc.p(card.x, card.y));
	    var p = cc.p(card.x,card.y) ;
	    card.setPosition(p.x, p.y);
	    //this.addChild(card, this.cardList.length);
	    this.addChild(card);
	    this.cardList.push(card);
	},
	setMutiSelectEnable: function(value){
		this.mutiSelect = value;
	},
	setTouchEnable: function (touch){
		this.canTouch = touch;
	    for(var i=0;i<this.cardList.length;i++) {
	        this.cardList[i].canTouch = this.canTouch;
	    }
	},
	dealBackCards: function (cards, animation, removeAfterAnim){
		// back card present bai` cua oponent user, chi co 1 cay
	    //ko add nhieu hon
	    var oldLength = 0;
	    if(this.cardList && this.cardList.length) oldLength = this.cardList.length;
	    for(var i=0;i<cards.length;i++){
	        var card = new Card(cards[i].point, cards[i].suit);
	        this.addCard(card);
	        card.setAnchorPoint(0.5,0.5);
	        card.setPosition(this.deckPoint.x, this.deckPoint.y);
	    }

	    var width = this.cardSize.width;// * this.cardList.length;
	    if(width > this.widthContainer){
	        width = this.widthContainer;
	    }
	    var dx = width;// / this.cardList.length;
	    var x = this.widthContainer/2 ;//- width/2 + dx/2;
	    var y = this.heightContainer/2;
	    var numCardRemain = 13;

	    for(var i=0;i<this.cardList.length;i++){
	        //this.reorderChild(this.cardList[i], i);
	        var card = this.cardList[i];
	        card.origin = cc.p(x, y);
	        card.cardDistance = dx;
	        card.reveal(false);
	        var scaleTo = this.cardOrigiScale;
	        if(animation){
	            if(i >=oldLength){
	                card.setScale(0.5,0.5);
	                card.visible = false;
	            }else{

	            }


	            var delayAction =  cc.delayTime(0.04 * i);
	            var beforeAction =  cc.callFunc(function () {
	                card.visible = true;
	            });
	            var afterAction =  cc.callFunc(function () {
	                if(cc.Global.gameId === Constant.GAME_ID.TLMN) card.showRemainCard(true,numCardRemain);
	            });
	            var animTime = cc.pDistance(cc.p(card.x, card.y), cc.p(x, y))/SPEED;
	            var scaleAction =  cc.scaleTo(animTime,scaleTo);
	            var moveAction =  cc.moveTo(animTime, cc.p(x, y));
	            var action =  cc.sequence(delayAction, beforeAction, cc.spawn( moveAction, scaleAction),afterAction);
	            if(!removeAfterAnim) card.runAction(action);
	            else if(i >=oldLength){
	                card.runAction( cc.sequence(action, cc.removeSelf(card)  ) );
	                //chip.parent.removeChild(chip);
	            }else{
	                card.runAction(action);
	            }

	        }
	        else{
	            card.setScale(scaleTo, scaleTo);
	            card.setPosition(x,y);
	            if(cc.Global.gameId === Constant.GAME_ID.TLMN) card.showRemainCard(true,numCardRemain);
	        }
	    }
	},
	dealCards: function (cards, animation, align){
		this.removeAll();
	    if(!cards || !cards.length) return;
	    for(var i=0;i<cards.length;i++){
	        var card = new Card(cards[i].point, cards[i].suit, this);
	        this.addCard(card);
	        //this.addChild(card);
	        card.setAnchorPoint(0.5, 0.5);
	        card.setPosition(this.deckPoint.x, this.deckPoint.y);
	        //cc.log("addChild "+i);
	    }
	    //cc.log("deckpoint cardList "+this.deckPoint.x+":"+this.deckPoint.y);
	    //return;

	    var width = this.cardSize.width * this.cardList.length;
	    if(width > this.widthContainer){
	        width = this.widthContainer;
	    }
	    var dx = width / this.cardList.length;

	    var x = dx/2 ;
	    if(align === CardAlign.CENTER){
	        x = this.widthContainer/2 - width/2 + dx/2;
	    }else if(align === CardAlign.RIGHT){
	        //right  o day la right contentsize, all card se ko nam ben trai contentsize
	            x = - width + dx/2;

	    }

	    if(dx >= (this.cardSize.width -10) ) dx -= 20;
	    var y = this.heightContainer/2;
	    //for(var i=0;i<1;i++){
	    var thiz = this;
	    for(var i=0;i<this.cardList.length;i++){
	        //this.reorderChild(this.cardList[i], i);
	            var card = thiz.cardList[i];
	            thiz.animChia(card, animation, x, y,dx,i);
	            x += dx;
	    }
	},
	animChia: function (card, animation, x,y,dx,i){
		card.origin = cc.p(x, y);
	    card.originScale = this.cardOrigiScale;
	    card.originVisible = this.originVisible;
	    card.originShowBack = this.originShowBack;
	    card.cardDistance = dx;
	    if(animation){

	        card.reveal(false);
	        card.setScale(0.5*card.originScale, 0.5*card.originScale);
	        card.visible = false;

	        var delayAction =  cc.delayTime(0.04 * i);
	        var beforeAction =  cc.callFunc(function () {
	            card.visible = true;
	        });
	        var afterAction =  cc.callFunc(function () {
	            card.flipCard(card.originScale);
	        } );
	        var animTime = cc.pDistance(cc.p(card.x, card.y), cc.p(x, y))/SPEED;
	        //cc.log("animTime "+animTime + " card "+ card.x + ":"+card.y + " end "+x+":"+y);
	        //cc.log("card.originScale "+card.originScale);
	        var scaleAction = cc.scaleTo(animTime, 1*card.originScale);
	        var moveAction = cc.moveTo(animTime, cc.p(x, y));
	        var action = cc.sequence(delayAction, beforeAction, cc.spawn( moveAction, scaleAction),afterAction);
	        // var animation = PIXI.actionManager.runAction(card, action);
	        // card.animation.push(animation);
	        card.runAction(action);
	    }
	    else{
	        card.setPosition(x,y);
	    }
	},
	dealCardsPhom: function (cards, animation, worldPos){
		if(!cards || !cards.length) return;
	    if(!worldPos) worldPos = this.deckPoint;
	    for(var i=0;i<cards.length;i++){
	        var card = new Card(cards[i].point, cards[i].suit, this);
	        this.addCard(card);
	        card.setAnchorPoint(0.5,0.5);
	        card.setPosition(worldPos.x, worldPos.y);
	    }
	    if(animation) this.reOrder();
	    else  this.reOrderWithoutAnimation();
	},
	containsWithCard: function (card){
		return null;
	},
	swapCardLeft: function (index){
		if(index > 0){
	        var cardMove = this.cardList[index];
	        var cardSwap = this.cardList[index-1];
	        this.swapCard(cardMove, cardSwap);
	    }
	},
	swapCardRight: function (index){
		if(index < this.cardList.length - 1){
	        var cardMove = this.cardList[index];
	        var cardSwap = this.cardList[index+1];
	        this.swapCard(cardMove, cardSwap);
	    }
	},
	swapCard: function (card1, card2){
		var _origin = card1.origin;
	    var _cardIndex = card1.cardIndex;

	    card1.origin = card2.origin;
	    card1.cardIndex = card2.cardIndex;

	    card2.origin = _origin;
	    card2.cardIndex = _cardIndex;

	    card1.moveToOriginPosition();
	    card2.moveToOriginPosition();

	    this.cardList[card1.cardIndex] = card1;
	    this.cardList[card2.cardIndex] = card2;
	},
	removeCard: function (cards){
		var arrCard = [];
	    for(var i=0;i<cards.length;i++){
	        var rank  = cards[i].point;
	        var suit = cards[i].suit;
	        for(var j=0;j<this.cardList.length;j++){
	            var card = this.cardList[j];
	            if(card.point == rank && card.suit == suit){
	                /*card.retain();
	                var p = card.getParent().convertToWorldSpace(cc.p(card.x, card.y));

	                card.removeFromParent(true);

	                card.position.set(p.x, p.y);*/
	                arrCard.push(card);
	                this.cardList.splice(j, 1);
	                // card.removeFromParent(true);
	                break;
	            }
	        }
	    }
	    return arrCard;
	},
	removeCard2: function(cards){
		var arr = [];
	    for(var i=0;i<cards.length;i++){
	        var rank  = cards[i].point;
	        var suit = cards[i].suit;
	        for(var j=0;j<this.cardList.length;j++){
	            var card = this.cardList[j];
	            if(card.point == rank && card.suit == suit){
	                /*card.retain();
	                var p = card.getParent().convertToWorldSpace(cc.p(card.x, card.y));
	                card.removeFromParent(true);
	                card.position.set(p.x, p.y);*/
	                cards[i].x = card.x;
	                cards[i].y = card.y;
	                arr.push( cards[i] );
	                this.cardList.splice(j, 1);
	                card.removeFromParent(true);
	                break;
	            }
	        }
	    }

	    return arr;
	},
	removeAll: function (){
		this.setMutiSelectEnable(false);
	    this.removeAllChildren();
	    this.cardList = [];
	},
	getCardAtIndex: function (index){
		return this.cardList[index];
	},
	getCardByRank: function (rank, suit){
		var _card;
	    for(var i=0;i<this.cardList.length;i++){
	        var card = this.cardList[i];
	        if(card.point == rank && card.suit == suit){
	            _card = card;
	            break;
	        }
	    }
	    return _card;
	},
	getCardSelected: function (){
		var cardSelected = [];
	    for(var i=0;i<this.cardList.length;i++){
	        if(this.cardList[i].isSelected()){
	            cardSelected.push(this.cardList[i]);
	        }
	    }
	    return cardSelected;
	},
	resetCardComboId: function(isBlurCardIfNeed){
		for(var i =0;i<  this.cardList.length; i++){
	        var card = this.cardList[i];
	        if(!isBlurCardIfNeed) card.revealBlur(false);
	        card.resetCardComboId();
	    }
	},
	getCards: function (){
		return this.cardList;
	},
	getCodeCards: function (){
		var _card = [];
	    for(var i=0;i<this.cardList.length;i++){
	        _card.push(this.cardList[i].getCardData().codeCard);
	    }
	    return _card;
	},
	isAllBlur: function (){
		var allBlur = true;
	    for(var i=0;i<this.cardList.length;i++){
	        var card = this.cardList[i];
	        if(!card.isBlur()){
	            allBlur = false;
	            break;
	        }
	    }
	    return allBlur;
	},
	showRemainCard: function(isShow, numRemain){
		if(this.cardList.length){
	        this.cardList[0].showRemainCard(isShow, numRemain);
	    }
	},
	onMoveUpCards: function (arrId){
		if(!arrId || !arrId.length) return;
	    //var cardSelected = [];
	    for(var i=0;i<this.cardList.length;i++){
	        var codeCard = this.cardList[i].getCardData().codeCard;
	        if(arrId.indexOf(codeCard) > -1){
	            this.cardList[i].moveToOriginPosition(true);
	            //this.cardList[i].setSelected(true);
	        }
	    }
	},
	onMoveUpCardPhom: function(arrPhom, arrNotChange){
		if(!arrNotChange) arrNotChange = [];
	    if(!this.cardList || !this.cardList.length) return;
	    for(var i=0;i<this.cardList.length;i++){
	        var codeCard = this.cardList[i].getCardData().codeCard;
	        if(arrNotChange && arrNotChange.length && arrNotChange.indexOf(codeCard) !== -1){

	        } else if(arrPhom.indexOf(codeCard) !== -1 ) this.cardList[i].setSelected(true);//move up
	        else this.cardList[i].setSelected(false);//move down
	    }
	},

});

var CardOnTable = cc.Node.extend({
	ctor: function(_pos, cardOrigiScale){
		this._super();

		this.cardList = [];
	    this.cardSize = null;
	    this.canTouch = false;
	    this.cardOrigiScale = cardOrigiScale ? cardOrigiScale : 0.5;
	    this.originVisible =true;
	    this.originShowBack = false;
	    /*var scale =1;
	    var currentScene = cc.director.getRunningScene();
	    if(currentScene.sceneLayer ){
	        scale = currentScene.sceneLayer.scale;
	    }*/
	    this._pos = _pos;
	    if(_pos)
	        this.cardPosition = _pos;// this.convertToNodeSpace(_pos);
	    else{
	        //this.cardPosition = this.convertToNodeSpace(cc.p(cc.winSize.width/2, cc.winSize.height - cc.Global.GameView.height*scale/2));
	        this.cardPosition = cc.p(cc.winSize.width/2, -cc.winSize.height/2);
	    }
	},
	showBlurBg: function(isShow, colorHexa){
		if(isShow){
	        if(!this.graphics){
	            this.graphics = new cc.DrawNode();
	            this.graphics.displayGroup = this.displayGroup;
	        }
	        var colorArr = ["#8325ea", "#ff0000", "#e4562f", "#6cf170", "#6b038e"];
	        var color =colorArr[Math.floor(Math.random()*colorArr.length)];
	        if(colorHexa) color = colorHexa;
	        this.getParent().addChild(this.graphics);
	        this.graphics.setPosition(this.x, this.y);

	        this.graphics.clear();

	        this.graphics.drawPoly(
	            [cc.p(0, 0),cc.p(this.widthContainer, 0),cc.p(this.widthContainer,this.heightContainer),cc.p(0, this.heightContainer)],
	            cc.color(color),
	            0,
	            cc.color(255, 255, 255, 0)
	        );

	    }else{
	        if(this.graphics) this.graphics.clear();
	    }
	},
	setDeckPoint: function (deckPoint){
		// always setDeckPoint sau khi addChild
	    // var gloalPos = this.getGlobalPosition();
	    var gloalPos = this.convertToWorldSpace(this.getPosition());
	    this.cardPosition =cc.pSub(deckPoint, gloalPos);
	    cc.log("CardOnTable cardPosition "+this.cardPosition.x +" : "+this.cardPosition.y);
	},
	onTouchBegan: function(card){
		//touch 1 card phom trn table thi earn card neu co state tri angle
	    var thiz = this;
	    if(cc.Global.gameId === Constant.GAME_ID.PHOM ){
	        if(card.originState == state_card.TRI_ANGLE){
	            var scene = cc.director.getRunningScene();
	            if(scene.sendAnBai) scene.sendAnBai();
	        }
	    }
	},
	setEarnCard: function(cb){
		this.cb =  cb;
	},
	getCards: function(){
		return this.cardList;
	},
	getCardByRank: function (rank, suit){
		var _card;
	    for(var i=0;i<this.cardList.length;i++){
	        var card = this.cardList[i];
	        if(card.point == rank && card.suit == suit){
	            _card = card;
	            break;
	        }
	    }
	    return _card;
	},
	onEnter: function(){
		this._super();
		/*this._super();
		    var scale =1;
		    var currentScene = cc.director.getRunningScene();
		    if(currentScene.sceneLayer ){
		        scale = currentScene.sceneLayer.scale;
		    }*/

		    /*if(this._pos)
		        this.cardPosition = this.convertToNodeSpace(this._pos);
		    else
		        this.cardPosition = this.convertToNodeSpace(cc.p(cc.winSize.width/2, cc.winSize.height - cc.Global.GameView.height*scale/2));
		*/
	},
	reOrder: function () {
		if(this.cardList.length > 0){
	        var width = this.cardSize.width * this.cardList.length;
	        if(width > this.widthContainer){
	            width = this.widthContainer;
	        }else{

	        }


	        var dx = width / this.cardList.length;

	        var x = dx/2 ; // this.widthContainer/2 - width/2 + dx/2;
	        if(dx >= (this.cardSize.width -10) ) dx -= 20;
	        var y = this.cardPosition.y;//this.heightContainer/2;
	        for(var i=0;i<this.cardList.length;i++){
	            var card = this.cardList[i];
	            card.origin = cc.p(x, y);
	            card.cardIndex = i;
	            card.cardDistance = dx;
	            //this.reorderChild(card, i);
	            card.moveToOriginPosition();
	            x += dx;
	        }
	    }
	},
	reOrderWithoutAnimation: function () {
		if(this.cardList.length > 0){
	        var width = this.cardSize.width * this.cardList.length;
	        if(width > this.widthContainer){
	            width = this.widthContainer;
	        }
	        var dx = width / this.cardList.length;

	        var x = dx/2 ;
	        if(dx >= (this.cardSize.width -10) ) dx -= 20;
	        var y = this.heightContainer/2;
	        for(var i=0;i<this.cardList.length;i++){
	            var card = this.cardList[i];
	            card.origin = cc.p(x, y);
	            card.cardIndex = i;
	            card.cardDistance = dx;
	            //this.reorderChild(card, i);
	            card.setPosition(x,y);
	            x += dx;
	        }
	    }
	},
	moveOldCard: function () {
		if(this.cardList.length === 2){
	        var arr = this.cardList[0];
	        for(var i=0;i<arr.length;i++){
	            arr[i].removeFromParent(true);
	            // if(arr[i].parent){
	            //     arr[i].stopAllActions();
	            //     arr[i].parent.removeChild(arr[i]);
	            // }
	        }
	        this.cardList.splice(0,1);
	    }else if(this.cardList.length === 1){
	        var arr = this.cardList[0];
	        for(var i=0;i<arr.length;i++){
	            arr[i].y += 40.0;
	            arr[i].revealBlur(true);
	            //arr[i].setColor(cc.color(100,100,100));
	            arr[i].setScale(0.4,0.4);
	        }
	    }
	},
	addNewCardList: function (cards,startPosition) {
		//add
	    if(!startPosition) startPosition = this.cardPosition;
	    var arrCard = [];
	    for(var i=0;i<cards.length;i++){
	        var card = new Card(cards[i].point, cards[i].suit , this);
	        card.canTouch  = false;
	        card.setAnchorPoint(.5,.5);
	        card.setPosition(startPosition);
	        arrCard.push(card);
	    }

	    this.addCard(arrCard);
	    return arrCard;
	},
	addNewCardListPhomToTable: function (cards,startPosition, slotId, startScale, showTriAngle) {
		//add
	    if(!startPosition) startPosition = this.cardPosition;
	    var arrCard = [];
	    for(var i=0;i<cards.length;i++){
	        var card = new Card(cards[i].point, cards[i].suit , this);
	        //card.originScale = 0.3;
	        card.canTouch  = false;
	        if(showTriAngle) {
	            card.originState = state_card.TRI_ANGLE;
	            card.showEffectCard(card.originState);
	        }
	        card.setAnchorPoint(.5,.5);
	        card.setPosition(startPosition.x, startPosition.y);
	        arrCard.push(card);
	    }
	    this.addCardPhomToTable(arrCard, slotId, startScale);
	    return arrCard;
	},
	addCardPhomToTable: function (cards, sitId, startScale) {
		// danh' 1 cay xuong cua? duoi'
	    var animationDuration = 0.3;
	    var _scale = startScale? startScale : this.cardOrigiScale;
	    if(!this.cardSize){
	        var scale = this.cardOrigiScale;//0.5;//cards[0].getScale();
	        this.cardSize = cc.size(cards[0].width * scale, cards[0].height * scale);
	    }
	    var value = 1;
	    var oldLength = 0;
	    if(this.cardList && this.cardList.length) oldLength = this.cardList.length;
	    this.cardList = this.cardList.concat(cards);

	    var dx = this.cardSize.width * this.cardOrigiScale ;//-5;//-5 de card de` len nhau
	    var width = this.cardList.length * dx;
	    var x = this.cardPosition.x +  value*dx/2;

	    for(var i=0;i<this.cardList.length;i++){
	        var card = this.cardList[i];
	        card._selected = false;//z-oder ko sai neu card selectf
	        if(i >=oldLength){
	            // var p = cc.convertToNodeSpace(this, cc.p(card.x, card.y));//cc.p(card.x, card.y);//this.convertToNodeSpace(cc.p(card.x, card.y));

	            var p = this.convertToNodeSpace(cc.p(card.x, card.y));

	            card.setPosition(p.x, p.y);
	            this.addChild(card);//this.addChild(card,0);
	            card.setScale(_scale, _scale);
	        }else{
	            //card.scale.set(card.originScale, card.originScale);
	            card.setScale(this.cardOrigiScale, this.cardOrigiScale);
	        }

	        card.stopAllActions();

	        card.reveal(true);
	        card.canTouch = false;
	        card.originScale = this.cardOrigiScale;//remove
	        card.originVisible = true;
	        card.originShowBack =false;
	        card.origin =cc.p(x, this.cardPosition.y);
	        var animationDuration = cc.pDistance(cc.p(card.x, card.y),card.origin)/SPEED;

	        var moveAction =  cc.moveTo(animationDuration, cc.p(x, this.cardPosition.y));
	        var scaleAction =  cc.scaleTo(animationDuration, card.originScale );
	        //card.runAction( cc.spawn(moveAction, scaleAction));
	        //PIXI.actionManager.runAction(card, cc.spawn(moveAction, scaleAction));
	        var action = cc.spawn(moveAction, scaleAction);

	        card.runAction(action);

	        // var animation = PIXI.actionManager.runAction(card, action);
	        // card.animation.push(animation);


	        var rotate = 0;//20.0 - Math.random() * 40.0;
	        //card.setRotation(rotate);
	        card.rotation = rotate;
	        x += value*dx;
	    }
	},
	addCardReconnect: function (cards) {
		var arrCard = [];
	    for(var i=0;i<cards.length;i++){
	        // var card = PIXI.Sprite.fromFrame(""+cards[i].point + s_card_suit[cards[i].suit] +".png");
	        var card = new cc.Sprite("#"+cards[i].point + s_card_suit[cards[i].suit] +".png");
	        arrCard.push(card);
	    }
	    this.addCardWithoutAnimation(arrCard);
	    return arrCard;
	},
	addCard: function (cards, startScale) {
		cc.log("CardOnTable add card", cards, startScale);
		var animationDuration = 0.3;
	    var _scale = startScale? startScale : this.cardOrigiScale;
	    if(!this.cardSize){
	        this.cardSize = cards[0].getContentSize();
	    }
	    this.cardList.push(cards);

	    var dx = this.cardSize.width * this.cardOrigiScale -20;//-20 de card de` len nhau
	    var width = cards.length * dx;
	    var x = this.cardPosition.x - width/2 +  dx/2;
	    var rotate = 20.0 - Math.random() * 40.0;
	    // rotate = cc.Global.degreeToRadian(rotate);
	    for(var i=0;i<cards.length;i++){
	        var card = cards[i];
	        this.addChild(card);
	        // card._selected = false;
	        // var p = cc.p(card.x, card.y);//this.convertToNodeSpace(cc.p(card.x, card.y));
	        // card.setPosition(p.x, p.y);

	        card.stopAllActions();
	        card.cardIndex = i;
	        card.originScale = this.cardOrigiScale;
	        card.originVisible = this.originVisible;
	        card.originShowBack = this.originShowBack;
	        card.canTouch = this.canTouch;
	        card.setScale(_scale,_scale);
	        card.rotation = rotate;
	        card.reveal(true);
	        card.revealBlur(false);
	        card.origin.x = x;
	        card.origin.y = this.cardPosition.y;

	        card.moveToOriginPosition(false, true);
	        x += dx;
	    }
	},
	addCardWithoutAnimation: function (cards) {
		if(!this.cardSize){
	        this.cardSize =cc.size(cards[0].width, cards[0].height);
	    }
	    this.cardList.push(cards);

	    var dx = this.cardSize.width * this.cardOrigiScale;
	    var width = cards.length * dx;
	    var x = this.cardPosition.x - width/2 +  dx/2;

	    for(var i=0;i<cards.length;i++){
	        var card = cards[i];
	        cards._selected = false;
	        card.setPosition(x, this.cardPosition.y);
	        card.setScale(0.5, 0.5);
	        var rotate = 20.0 - Math.random() * 40.0;
	        card.rotation = rotate;// cc.Global.degreeToRadian(rotate);
	        this.addChild(card);
	        x += dx;
	    }
	},
	removeCard: function (cards) {
		var arrCard = [];
	    for(var i=0;i<cards.length;i++){
	        var rank  = cards[i].point;
	        var suit = cards[i].suit;
	        for(var j=0;j<this.cardList.length;j++){
	            var card = this.cardList[j];
	            if(card.point == rank && card.suit == suit){
	                /*var p = cc.p(card.x, card.y);//card.getParent().convertToWorldSpace(cc.p(card.x, card.y));
	                card.position.set(p.x, p.y);
	                card.retain();
	                card.removeFromParent(true);*/
	                arrCard.push(card);
	                this.cardList.splice(j, 1);
	                break;
	            }
	        }
	    }
	    return arrCard;
	},
	flipAndRemoveAll: function(){
		//return;
	    var cards = this.cardList;
	    if(!cards) return;
	    for(var k=0;k<cards.length;k++){
	        var group = cards[k];
	        for(var i=0;i<group.length;i++){
	            var card = group[i];
	            this.flip(card);
	        }

	    }
	    //this.cardList.removeChildren();
	},
	flip: function (card) {
		var _scale = card.getScaleY();
	    var action1 = cc.scaleTo(.2, 0,_scale);//scaleX to 0 in .2s
	    var action2 = cc.scaleTo(.2, _scale,_scale );

	    var func = function(){
	        card.reveal(false);
	        //card.visible = false;
	    };
	    var callback = cc.callFunc(func);

	    //var callback = cc.callFunc(card.reveal, card, false);
	    var rm = cc.removeSelf(card);
	    //PIXI.actionManager.runAction(card, cc.sequence(action1, callback, action2, rm));

	    var action = cc.sequence(action1, callback, action2, rm);
	    /*var animation = PIXI.actionManager.runAction(card, action);
	     card.animation.push(animation);*/
	    card.runAction(action);
	},
	removeAll: function () {
		this.cardList = [];
	    this.removeAllChildren();
	    cc.log("cardlist remove all");
	},
});