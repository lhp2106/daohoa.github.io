var MH = MH || {};
MH.Slider = cc.Node.extend({
	_items: [],//{img, url}
	_index: -1,
	_canTouch: false,
	ctor: function(){
		this._super();

		var spr = new cc.Sprite("res/banner/sukien1.png");
		spr.setTag(1);
		this.addChild(spr);

		this.setPosition(cc.p(-465, -45));
	},
	setData: function(arr){
		if( arr.length === 0 ) return;
		this._items = arr;
		this._index = 0;
		this.getChildByTag(1).setTexture(arr[0].img);

		// add dot
		// space = 25 => W = (arr.length -1)*25 => Left = W/2
		var _left = (arr.length -1)*25/2;
		if( arr.length > 1 ){
			this.autoNext();
			this._canTouch = true;
			for( var i=0; i<arr.length; i++ ){
				var dot = new cc.Sprite("res/banner/dot.png");
				dot.setPosition(i*25 - _left, -205);
				dot.setTag(10+i);
				if( i > 0 ) dot.setOpacity(150);
				this.addChild(dot, 2);
			}
		}
	},
	changeTo: function(n){
		if( n < 0 || n >= this._items.length || n === this._index ) return;
		this._canTouch = false;
		var oldSpr = this.getChildByTag(1);
		var newSpr = new cc.Sprite( this._items[n].img );
		newSpr.setOpacity(0);
		newSpr.setTag(2);

		var _to = -50;
		if( n > this._index ) _to = 50;

		newSpr.x = _to;

		this.addChild(newSpr, 1);

		oldSpr.runAction( new cc.MoveTo(0.5, -_to, 0) );
		oldSpr.runAction( new cc.FadeOut(0.5) );

		newSpr.runAction( new cc.MoveTo(0.5, 0, 0) );
		newSpr.runAction( cc.sequence(new cc.FadeIn(0.5), cc.callFunc(function(){
			this._canTouch = true;
			this.removeChild(oldSpr);
			newSpr.setTag(1);

			for( var i=0; i<this._items.length; i++ ){
				if( i === this._index ) this.getChildByTag(10+i).setOpacity(255);
				else this.getChildByTag(10+i).setOpacity(150);
			}
		}.bind(this))));

		this._index = n;
		this.autoNext();
	},
	next: function(){
		var n = this._index + 1;
		if( n >= this._items.length ) n = 0;
		this.changeTo(n);
	},
	prev: function(){
		var n = this._index - 1;
		if( n < 0 ) n = this._items.length-1;
		this.changeTo(n);
	},
	autoNext: function(){
		this.unschedule( this.next );
		this.schedule( this.next, 3);
	},
	onEnter: function(){
		this._super();

		var _added = false;
		var _oldX = 0;

		cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event){
            	if( !this._canTouch || this._items.length === 0 ) return false;

            	var crSpr = this.getChildByTag(1);
            	var sprSize = crSpr.getContentSize();

            	var rect = cc.rect(0, 0, sprSize.width, sprSize.height);
		        if (cc.rectContainsPoint(rect, crSpr.convertToNodeSpace(touch.getLocation()))){
		            _oldX = touch.getLocation().x;
		            _added = false;
		            return true;
		        }
                return false;
            }.bind(this),
            onTouchMoved: function(touch, event){
            	if( !_added ){
            		var _m = touch.getLocation().x-_oldX;
            		if( _m > 25 ){
            			_added = true;
	            		this.prev();
            		}else if( _m < -25 ){
            			_added = true;
	            		this.next();
            		}
            	}
            }.bind(this),
            onTouchEnded: function(touch, event){
            	if( !_added ){ // open link

            	}
            }.bind(this),

        }, this);

	}
});