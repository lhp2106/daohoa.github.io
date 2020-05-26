var Marquee = cc.Sprite.extend({
	_width: 940,
	_height: 50,
	_canPush: true,
	_items: [], // string || obj{mgs, params}
	_runningItem: [],// {node, stt, x, x1, x2}
	_isRunning: false,

	ctor: function(){
		this._super("res/notice/notice-bg.png");
		this.setPosition(-30, 214);
	},
	_pushNew: function(){
		if( !this._canPush || !this._items.length ){
			return;
		}

		var item = this._items[0];
		this._items.splice(0, 1);

		var node;
		var nodeW = 0;

		if( cc.isString(item) ){
			node = this._crateLabel(item+"    ");
			nodeW = node.width;
		}else if( cc.isObject(item) ){
			node = new cc.Node();
			var arr = item.mgs.replace(/\t/g, '    ').split(new RegExp("\\%" + "\\w", "g"));
			var arr2 = item.mgs.match(new RegExp("\\%" + "\\w", "g"));

			if( item.params.length === arr.length-1 && arr2.length === item.params.length ){
				for( var j=0; j<arr.length; j++ ){
					if( arr[j] ){
						if( j >= item.params.length ) arr[j] += "    ";
						var text = this._crateLabel(arr[j]);
						text.x = nodeW;
						node.addChild(text);
						nodeW += text.width;
					}

					if( j < item.params.length ){
						var text2 = this._crateLabel(item.params[j], this._getTextColor(arr2[j]));
						text2.x = nodeW;
						node.addChild(text2);
						nodeW += text2.width;
					}
				}
			}else{
				cc.log("TV sai format???");
			}
		}else{
			return;
		}



		this._runningItem.unshift({node: node, stt: 0, x: this._width, x1: this._width-nodeW, x2: -nodeW });

		var clipping = this.getChildByTag(1212);

		if( !clipping ){
			var stencil = new cc.DrawNode();
	        stencil.drawPoly(
	            [cc.p(0, 0),cc.p(this._width, 0),cc.p(this._width, this._height),cc.p(0, this._height)],
	            cc.color(255, 0, 0, 255), 0,
	            cc.color(255, 255, 255, 0)
	        );
	        clipping = new cc.ClippingNode(stencil);
	        clipping.setPosition(-185, 35);

	        clipping.setTag(1212);

	        this.addChild(clipping);

	        this.scheduleUpdate();
		}

		clipping.addChild(node);

		node.x = this._width;
		this._isRunning = true;
		this._canPush = false;
	},
	_crateLabel: function(_str, _color){
		var node = new cc.LabelTTF( _str, MH.getFont("Font_Default"), 26, null, cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM);
		node.setAnchorPoint(0, 0);
		if( _color ) node.setFontFillColor(_color);
		return node;
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
	_receiveData: function(cmd, data){
		cc.log("Marquee reveive dtaaa", cmd, data);
		if( data ){
			if( cc.isArray(data) ){
				if( data[1] && cc.isObject(data[1]) ){
					cc.log( JSON.stringify( data[1].params ) );
					var arr = data[1].mgs.split("\t");
					if( arr.length > 2 ){ // chia nhỏ
						for( var i=0; i<arr.length; i++ ){
							var count = arr[i].match(new RegExp("\\%" + "\\w", "g")).length;
							if( count ){
								var obj = {mgs: arr[i], params: data[1].params.slice(0, count)};
								data[1].params.splice(0, count);
								this._items.push(obj);
							}else{
								this._items.push(arr[i]);
							}
						}
					}else{
						this._items.push(data[1]);
					}
				}else{
					// arr[str] => srt
					for( var i=0; i<data.length; i++ ){
						if( data[i] ) this._items.push(data[i]);
					}
				}
			}else if( data ){
				this._items.push(data);
			}
		}

		if( this._canPush ){
			this._pushNew();
		}
	},
	update: function(dt){
		for( var i=this._runningItem.length-1; i>=0; i-- ){
			this._runningItem[i].x -= 120*dt;
			this._runningItem[i].node.x -= 120*dt;
			if( this._runningItem[i].stt === 0 && this._runningItem[i].x < this._runningItem[i].x1 ){
				this._runningItem[i].stt = 1;
				this._canPush = true;
				this._pushNew();
			}else if( this._runningItem[i].stt === 1 && this._runningItem[i].x < this._runningItem[i].x2 ){
				// remove item and node
				this._runningItem[i].node.removeFromParent(true);
				this._runningItem.splice(i, 1);
				if( this._runningItem.length === 0 ){
					this.removeAllChildren(true);
					this.unscheduleUpdate();
					this._isRunning = false;
				}

				if( this._canPush ){
					this._pushNew();
				}
			}
		}
	},
	onEnter: function(){
		this._super();
		// this.setVisible(false);
		// LobbyClient.getInstance().addListener(kCMD.BROASTCASTTIVI, this._receiveData, this);
		// MiniGameClient.getInstance().addListener(kCMD.BROASTCASTTIVI, this._receiveData, this);
	},
	onExit: function(){
		this._super();
		LobbyClient.getInstance().removeListener(this);
		MiniGameClient.getInstance().removeListener(this);
	}
});