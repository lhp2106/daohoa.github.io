var MHSlider = cc.Node.extend({
	_scrolling:false,
    _lastPoint:null,
    _itemW: 260,
    _itemH: 475,
    _items: [],
    _active: 0,
    _showDots: true,
    _autoSlide: true,
    _timeAuto: 4,
    initWithArray: function(){
    	this.removeAllChildren(true);

    	if( !this._items.length ) return;

    	var clipper = new cc.ClippingNode();
        clipper.width = this._itemW;
        clipper.height = this._itemH;
        clipper.anchorX = 0.5;
        clipper.anchorY = 0.5;
        clipper.x = 0;//this.width / 2;
        clipper.y = 0;//this.height / 2;
        // clipper.runAction(cc.rotateBy(1, 45).repeatForever());
        this.addChild(clipper);

        var stencil = new cc.DrawNode();
        var rectangle = [cc.p(0, 0),cc.p(clipper.width, 0),
            cc.p(clipper.width, clipper.height),
            cc.p(0, clipper.height)];

        var white = cc.color(255, 255, 255, 255);
        stencil.drawPoly(rectangle, white, 1, white);
        clipper.stencil = stencil;

        var content = new cc.Node();
        content.x = 0;
        content.y = 0;
        clipper.addChild(content);
        this.contentSl = content;

        if( this._showDots ){
            this.dotsWap = new cc.Node();
            this.dotsWap.y = -this._itemH/2;
            this.addChild(this.dotsWap);
        }

        this._renderItem();

        var thiz = this;

        var _oldX = 0;

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var locationInNode = clipper.convertToNodeSpace(touch.getLocation());
                var rect = cc.rect(0, 0, clipper.width, clipper.height);
                if (cc.rectContainsPoint(rect, locationInNode)){
                	thiz._scrolling = true;
                	_oldX = content.x;
                    var items = content.getChildren();
                    for( var i=0; i<items.length; i++ ){
                        items[i].visible = true;
                    }
                	return true;
                }
                return false;
            },
            onTouchMoved: function (touch, event) {
            	if( !thiz._scrolling ) return;
            	var move = touch.getLocation().x - touch.getStartLocation().x;
            	// cc.log(move, thiz._itemW);
            	if( move > thiz._itemW || move < -thiz._itemW ){
            		thiz._scrolling = false;
            		thiz._activeByMove(move);
                    thiz.setAutoSlide(thiz._autoSlide, thiz._timeAuto);
            	}else{
            		content.x = _oldX + move;
            	}
            },
            onTouchEnded: function(touch, event){
            	if( thiz._scrolling ){
            		thiz._scrolling = false;
            		var move = content.x - _oldX;
	            	thiz._activeByMove(move);
                    thiz.setAutoSlide(thiz._autoSlide, thiz._timeAuto);
            	}	
            }
        }, this);

        this.contentSl.x = -this._itemW;

        this.setAutoSlide(this._autoSlide, this._timeAuto);
    },
    initWithJson: function(url){
    	var thiz = this;
    	cc.log("get json", url);
        var tmp = 0;
        MH.loadJson(url, function(err, data){
            if( data && data.data && data.data.length ){
                thiz._items = data.data;

                var _count = 0;
                for( var i=0; i<data.data.length; i++ ){
                    // imgs.push( data.data[i].img );
                    (function(i){
                        cc.loader.load(data.data[i].img, function(err, res){
                            // cc.log("loaded", i);
                            if( !err ){
                                thiz._items[i].texture = res[0];
                                _count++;
                                if( _count === data.data.length-1 ){
                                    thiz.initWithArray();
                                }
                            }
                        });
                    })(i);
                }
            }
        });
    },
    _moveLeft: function(){
    	this._active -= 1;
    	if( this._active < 0 ) this._active = this._items.length-1;

    	this.contentSl.runAction( cc.sequence(cc.moveTo(0.2, cc.p(0,0)), cc.callFunc(this._renderItem, this)));
    },
    _moveRight: function(){
    	this._active += 1;
    	if( this._active > this._items.length-1 ) this._active = 0;

    	this.contentSl.runAction( cc.sequence(cc.moveTo(0.2, cc.p(-2*this._itemW, 0)), cc.callFunc(this._renderItem, this)));
    },
    _moveCenter: function(){
    	this.contentSl.runAction( cc.moveTo(0.2, cc.p(-this._itemW, 0)));
    },
    _renderItem: function(){
    	this.contentSl.x = -this._itemW;

    	var k1 = this._active-1,
        	k2 = this._active+1;

        if( k1<0 ) k1 = this._items.length-1;
        if( k2>this._items.length-1 ) k2 = 0;

        var item1 = new cc.Sprite(this._items[k1].texture);
        var item2 = new cc.Sprite(this._items[this._active].texture);
        var item3 = new cc.Sprite(this._items[k2].texture);

        item1.setAnchorPoint(cc.p(0,0));
    	item1.x = 0;
    	item1.y = 0;
        item1.visible = false;

    	item2.setAnchorPoint(cc.p(0,0));
    	item2.x = this._itemW;
    	item2.y = 0;

    	item3.setAnchorPoint(cc.p(0,0));
    	item3.x = 2*this._itemW;
    	item3.y = 0;
        item3.visible = false;

        this.contentSl.removeAllChildren(true);

    	this.contentSl.addChild(item1);
    	this.contentSl.addChild(item2);
    	this.contentSl.addChild(item3);

        if( this._showDots ){
            this.dotsWap.removeAllChildren(true);
            for( var i=0; i<this._items.length; i++ ){
                var dot = new cc.Sprite("res/banner/dot.png");
                dot.x = i*20;
                this.dotsWap.addChild(dot);

                if( this._active != i ) dot.opacity = 150;
            }

            this.dotsWap.x = -20*this._items.length/2;
        }
    },
    _activeByMove: function(_mX){
    	if( _mX > this._itemW/3 ){
    		this._moveLeft();
    	}else if( _mX < -this._itemW/3 ){
    		this._moveRight();
    	}else this._moveCenter();
    },
    _updateAuto: function(){
        var items = this.contentSl.getChildren();
        for( var i=0; i<items.length; i++ ){
            items[i].visible = true;
        }
        this._moveRight();
    },
    setAutoSlide: function(_auto, _time){
        this._autoSlide = _auto;
        if( _auto ){
            this._timeAuto = _time;
            this.unschedule( this._updateAuto );
            this.schedule(this._updateAuto, this._timeAuto);
        }
    },
    onEnter: function(){
    	this._super();
    	var spr = new cc.Sprite("res/banner/sukien.png");
    	this.addChild(spr);
    }
});