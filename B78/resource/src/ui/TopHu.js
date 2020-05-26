var TopHu = cc.Sprite.extend({
	_list: [
		{label: null, wrap: null, gid:199, J: 0, gname: "Đảo Cá"},
		{label: null, wrap: null, gid:202, J: 0, gname: "Larva"},
		{label: null, wrap: null, gid:205, J: 0, gname: "Rừng Rậm"},
		{label: null, wrap: null, gid:209, J: 0, gname: "Long Cung"},
		{label: null, wrap: null, gid:210, J: 0, gname: "Hoa Quả"},
		{label: null, wrap: null, gid:217, J: 0, gname: "Kim Cương"},
		{label: null, wrap: null, gid:218, J: 0, gname: "Bắn Súng"}
	],
	_itemH: 80,
	_activeRoom: 0,
    _dataJackpot: null,
    ctor: function(gid){
        // 132 190
        this._super("res/tophu/list-hu.png");

        var btn100 = new newui.Button(["res/tophu/100-tab.png"], function(){
            this._changeRoom(1);
        }.bind(this));
        btn100.setPosition(cc.p(52, 350));
        this.addChild(btn100);
        this.btn100 = btn100;

        var btn1K = new newui.Button(["res/tophu/1k-tab.png"], function(){
            this._changeRoom(2);
        }.bind(this));
        btn1K.setPosition(cc.p(134, 350));
        this.addChild(btn1K);
        this.btn1K = btn1K;

        var btn10K = new newui.Button(["res/tophu/10k-tab.png"], function(){
            this._changeRoom(3);
        }.bind(this));
        btn10K.setPosition(cc.p(215, 350));
        this.addChild(btn10K, 5);
        this.btn10K = btn10K;


        var scrollView = new ccui.ScrollView();
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollView.setBounceEnabled(true);
        scrollView.setContentSize(cc.size(255, 313));
        scrollView.setInnerContainerSize(cc.size(255, this._list.length*this._itemH));
        scrollView.setPosition(cc.p(132, 163));
        scrollView.setAnchorPoint(cc.p(0.5, 0.5));
        this.addChild(scrollView);

		for(var i=this._list.length-1; i>=0; i--){
			var wrap = new cc.Sprite("res/tophu/ic"+this._list[i].gid+".png");
			scrollView.addChild(wrap);

			var gname = new cc.LabelTTF(this._list[i].gname, MH.getFont("Font_Default"), 24, null, cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM);
            gname.setAnchorPoint(0, 0);
	        gname.setPosition(cc.p(74, 39));//   36  26
	        wrap.addChild(gname);

	        var gjackpot = new newui.LabelBMFont("", "res/fonts/font-listhu-export.fnt", cc.TEXT_ALIGNMENT_LEFT);
			gjackpot.setScale(0.4);
			gjackpot.setAnchorPoint(cc.p(0 ,0));
			gjackpot.setPosition(cc.p(74, 7));
	        wrap.addChild(gjackpot);

        	var line = new cc.Sprite("res/tophu/list-bg.png");
        	line.setPosition(cc.p(121, -7));
        	wrap.addChild(line);

        	this._list[i].wrap = wrap;
        	this._list[i].label = gjackpot;

            if( i==0 ){
                window.gname = gname;
                window.gjackpot = gjackpot;
            }
		}

		this._orderPos();

        this.setPosition(cc.p(-465, -45));
        this._changeRoom(2);
    },
    _render: function(){
    	// loop: sort + setString
    },
    setJackpot: function(data){

    },
    _changeRoom: function(n){  // 1 2 3
    	this._activeRoom = n;
    	switch(n){
    		case 1:
    			this.btn100.setOpacity(255);
    			this.btn1K.setOpacity(150);
    			this.btn10K.setOpacity(150);
    			break;
    		case 2:
    			this.btn100.setOpacity(150);
    			this.btn1K.setOpacity(255);
    			this.btn10K.setOpacity(150);
    			break;
    		case 3:
    			this.btn100.setOpacity(150);
    			this.btn1K.setOpacity(150);
    			this.btn10K.setOpacity(255);
    			break;
    	}

        this._updateJackpot();
    },
    _updateJackpot: function(cmd, data){
        // return;
        cc.log('Top hu receive Jackpot');
        if(arguments.length == 2){
            this._dataJackpot = data;
        }else{
            data = this._dataJackpot;
        }



    	if( data && data[1] && data[1].Js ){
			for( var i = data[1].Js.length-1; i>=0; i-- ){
				if( this._activeRoom === 1 && data[1].Js[i].b !== 100 || this._activeRoom === 2 && data[1].Js[i].b !== 1000 || this._activeRoom === 3 && data[1].Js[i].b !== 10000 ) continue;
				for( var j = this._list.length-1; j>=0; j-- ){
					if( this._list[j].gid === data[1].Js[i].gid ){
                        if( this._list[j].J !== data[1].Js[i].J ) this._list[j].label.countTo(data[1].Js[i].J, 2);
						this._list[j].J = data[1].Js[i].J;
					}
				}
			}

			this._orderPos();
		}
    },
    _orderPos: function(){
    	this._list.sort(function(a, b){return a.J-b.J});
    	for(var i=this._list.length-1; i>=0; i--){
            this._list[i].wrap.stopAllActions();
    		var action = cc.moveTo(0.3, cc.p(40, i*this._itemH+40));
    		this._list[i].wrap.runAction( action );
    		// this._list[i].wrap.setPosition(cc.p(40, i*this._itemH+40));
    	}
    },
    onEnter: function(){
        this._super();
        TopHuClient.getInstance().addListener( kCMD.TOP_HU , this._updateJackpot, this);
    },
    onExit: function(){
        this._super();
        TopHuClient.getInstance().removeListener(this);
    }
});