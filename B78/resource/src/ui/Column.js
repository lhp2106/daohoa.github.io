var Column = cc.Node.extend({
	_colIndex: 0,
	_itemH: 0,
	_items: [],
    _itemsBlur: [],
    _nextMove: 0,
    _nextItem: 0,
    _mspeed: 0,
    _backOut: -30,
    _backIn: 0,
    _status: 0, // 0:stop 1:backIn 2:spin 3:backOut
    _orderedChilds: [],
	ctor: function(obj){
		this._super();

		this._itemH = obj.itemH;
		this._items = obj.items;
		this._itemsBlur = obj.itemsBlur? obj.itemsBlur: obj.items;
		this._mspeed = obj.speed || 1080; //300 1080
		this._colIndex = obj.index || 0;
		if( obj.hasOwnProperty("backOut") ) this._backOut = -obj.backOut;
		if( obj.hasOwnProperty("backIn") ) this._backIn = obj.backIn;
		for(var j=0; j<3; j++){
            this._createItem(-1, j);
        }

        this._resetCol();
	},
	_createItem: function(_itemid, _index, isBlur){
		if( _itemid === -1 ) _itemid = Math.floor(Math.random() * 10)%6;
		var item = new cc.Sprite( this._items[_itemid] );
		item.itemId = _itemid;
		item.setName("item");
		item.setTag(_index);
		item.y = _index * this._itemH+this._itemH/2;
		this.addChild(item);
	},
	setItem: function(item, _itemID, isBlur){
		if( _itemID === -1 ) _itemID = Math.floor(Math.random() * 6);

        if( isBlur ) item.setSpriteFrame( this._itemsBlur[_itemID] );
        else item.setSpriteFrame( this._items[_itemID] );

        item.itemId = _itemID;
	},
	removeItemAnimation: function(){
		var child = this.getChildren();
		for( var i=child.length-1; i>=0; i-- ){
			if( child[i].getName() === "animation" ){
				this._createItem(child[i].itemId, child[i].getTag());
				this.removeChild(child[i]);
			}
		}
	},
	fullBlur: function(){
		this.removeItemAnimation();
		
		var childs = this.getChildren();
		var blurId = this._colIndex*4;
		var maxId = this._itemsBlur.length-1;

		for( var i=0; i<childs.length; i++ ){
			var node = childs[i];
			this._orderedChilds[ node.tag ] = node;

			if( blurId > maxId ) blurId = 0;
			this.setItem(node, blurId, true);
			blurId++;
		}
	},
	runSpin: function(){
		if( this._status !== 0 ) return;

		this._createItem(-1, 3);

		if( this._backIn === 0 ){
			this._status = 2;
			if( this._colIndex%2 === 0 ) this.y = -this._itemH/2;
			else this.y = 0;
			this.fullBlur();

			this._nextMove = -this._itemH;
			this._nextItem = 0;
		}else{
			this._status = 1;
			this.getChildByTag(3).y = -this._itemH/2;
			this.y = 0;

			this._nextMove = 0;
			this._nextItem = 3;
		}

		this.scheduleUpdate();
	},
	stopSpin: function(arr){
		if( this._status != 2 ) return;
		if( !arr ) arr = [-1, -1, -1];
		arr[3] = -1;
		var childs = this.getChildren();
		for( var i=0; i<childs.length; i++ ){
			childs[i].y = childs[i].tag*this._itemH+this._itemH/2;
			this.setItem(childs[i], arr[childs[i].tag]);
		}
		this.y = this._backOut;
		this._status = 3;
		this.onBeforeStop.call(null, this);
	},
	_resetCol: function(){
		this._status = 0;
		this.y = 0;
		this.removeChildByTag(3);
		this._nextMove = -this._itemH;
		this._nextItem = 0;
		this._orderedChilds = [];
	},
	onBeforeStop: function(){},
	onAfterStop: function(){},
	update: function(dt){
		if( this._status === 2 ){
			this.y -= this._mspeed*dt;
			if(this.y < this._nextMove ){
	            this._nextMove -= this._itemH;
	            //this.setItem( this._orderedChilds[this._nextItem], -1, true);
	            this._orderedChilds[this._nextItem].y += this._itemH*4;

	            if( this._nextItem === 3 ) this._nextItem = 0;
	            else this._nextItem += 1;
	        }
		}else if( this._status === 3 ){
			this.y += 300*dt;
			if( this.y > 0 ){
				this.unscheduleUpdate();
				this._resetCol();
				this.onAfterStop.call(null, this);
			}
		}else if( this._status === 1 ){
			this.y += 200*dt;
			if( this.y > this._backIn ){
				this._status = 2;
				this.fullBlur();
			}
		}
	}
});