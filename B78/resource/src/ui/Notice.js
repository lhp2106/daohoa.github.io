var Notice = cc.Node.extend({
	_fontName: "Font_Default",
	_fontSize: 26,
	_isRunning: false,
	_width: 940,
	_height: 50,
	_speed: 120, //px/s
	_items: [],
	ctor: function(logged){
		this._super();
		
		var bg = new cc.Sprite("res/notice/notice-bg.png");
		this.addChild(bg, 0);
		this.setPosition(cc.p(0,215));
	},
	append: function(data){
		if( cc.isString(data) ) this._items.push( data );
		else{
			for( var i = data.length -1; i>=0; i-- ){
				this._items.push( data[i] );
			}
		}
		if( !this._isRunning ) this.start();
	},
	prepend: function(data){
		this.append(data);
	},
	_renderItem: function(){
		// max 5 items

		if( !this._items.length ) return;

		var _i = 0;
		for( var i=0; i < this._items.length; i++ ){
			var item = this._items[i];

			if( cc.isString(item) ){
				var text = new ccui.RichElementText(i, cc.color.WHITE, 255, item+"    ", MH.getFont(this._fontName), this._fontSize);
				this.uiRichText.pushBackElement(text);
			}else{
				var arr = item.mgs.replace(/\t/g, '    ').split(new RegExp("\\%" + "\\w", "g"));
				var arr2 = item.mgs.match(new RegExp("\\%" + "\\w", "g"));

				if( item.params.length == arr.length-1 && arr2.length == item.params.length ){
					for( var j=0; j<arr.length; j++ ){
						if( arr[j] ){
							if( j >= item.params.length ) arr[j] += "    ";
							var text = new ccui.RichElementText(j+i, cc.color.WHITE, 255, arr[j], MH.getFont(this._fontName), this._fontSize);
							this.uiRichText.pushBackElement(text);
						}

						if( j < item.params.length ){
							var text2 = new ccui.RichElementText(j+i+1, this._getTextColor(arr2[j]), 255, item.params[j], MH.getFont(this._fontName), this._fontSize);
							this.uiRichText.pushBackElement(text2);
						}
					}
				}else{
					cc.log("TV sai format???");
				}
			}
			_i++;

			if( _i > 5 ) break;
		}

		this._items.splice(0, _i); // xóa _i item

		this.scheduleOnce(function(){
			var _width = this.uiRichText.getContentSize().width;

			this.uiRichText.setPosition(cc.p(_width/2+this._width, 0));

			var _action = cc.moveTo( (_width+this._width)/this._speed, cc.p(-_width/2, 0));
			var sequence = cc.sequence( _action, cc.callFunc(this._onStop, this) );

	        this.uiRichText.runAction(sequence);
		}, 0.3);

        this._isRunning = true;
	},

	start: function(){
		if( this._isRunning || !this._items.length ) return;
		// check has data
		//
		var stencil = new cc.DrawNode();
        stencil.drawPoly(
            [cc.p(0, 0),cc.p(this._width, 0),cc.p(this._width,this._height),cc.p(0, this._height)],
            cc.color(255, 0, 0, 255), 0,
            cc.color(255, 255, 255, 0)
        );

        stencil.setPosition(cc.p(0, -30));

        this.wrap = new cc.ClippingNode(stencil);
        this.wrap.setPosition(cc.p(-470, 30));
        this.addChild(this.wrap,0);

        this.uiRichText = new ccui.RichText();
        this.uiRichText.setPosition(cc.p(-9999, -500));
		this.wrap.addChild(this.uiRichText, 0);

		this._renderItem();
	},

	stop: function(){
		if( this.wrap ) this.wrap.removeFromParent();
		this.wrap = null;
		this.uiRichText = null;
		this._isRunning = false; 
	},

	destroy: function(){
		this.stop();
		this._items = [];
	},

	_getTextColor: function(s){
		switch(s){
			case "%y":
				return cc.color(255, 235, 59, 255);
			case "%m":
				return cc.color(255, 0, 255, 255);
			case "%c":
				return cc.color(0, 255, 255, 255);
			case "%r":
				return cc.color(255, 0, 0, 255);
			case "%g":
				return cc.color(0, 255, 0, 255);
			case "%b":
				return cc.color(0, 0, 255, 255);
			case "%w":
				return cc.color(255, 255, 255, 255);
			case "%k":
				return cc.color(0, 0, 0, 255);
		}
		return cc.color(255,255,255,255);
	},
	_onStop: function(){
		if( this.wrap ) this.wrap.removeFromParent();
		this.wrap = null;
		this.uiRichText = null;

		this._isRunning = false;

		cc.log('TV success');

		this.start(); // run new
	}
});