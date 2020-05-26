var newui = {};

newui.EditBox = cc.Node.extend({
    _inputMode: cc.EDITBOX_INPUT_MODE_SINGLELINE,
    _placeHolder: "",
    _fontName: "Font_Default",
    _fontSize: 25,
    _isPassWord: false,
    _width: 350,
    _height: 65,
    _value: "",
    ctor: function(){
        this._super();
        this._padding = [0,15,0,15];
        this._fontColor = cc.color(255,255,255,255);
        this._editBox = null;
        this._backgroundSprite = null;

        this._initWithBackground("res/input_default.png");
    },
    _initEditBox: function(){
        if( this._editBox ){
            this._editBox.removeFromParent(true);
            this._editBox = null;
        }

        var spr = new ccui.Scale9Sprite("res/none.png", cc.rect(0, 0, 0, 0));
        spr.setVisible(false);
        var _editBox = new cc.EditBox(cc.size(this._width-this._padding[1]-this._padding[3], this._height), spr);
        _editBox.setPosition(cc.p(this._padding[3]-(this._padding[1]+this._padding[3])/2, -this._padding[0]));
        this.addChild(_editBox, 1);

        this._editBox = _editBox;

        this.setInputMode(this._inputMode);
        this.setPasswordEnabled(this._isPassWord);
        this.setPlaceHolder(this._placeHolder);
        this.setFontName(this._fontName);
        this.setFontSize(this._fontSize);
        this.setFontColor(this._fontColor);
        this.setString(this._value);
    },

    _initWithBackground: function(src){
        if (this._backgroundSprite) {
            this._backgroundSprite.removeFromParent(true);
            this._backgroundSprite = null;
        }

        this._backgroundSprite = new cc.Sprite(src);
        this.addChild(this._backgroundSprite,0);

        var thiz = this;
        cc.loader.load([src], function(){
            thiz._width = thiz._backgroundSprite.width;
            thiz._height = thiz._backgroundSprite.height;
            thiz._initEditBox();
        });
    },

    setBackground: function(src){
        if( arguments.length == 2 && arguments[1] == false ){
            if (this._backgroundSprite) {
                this._backgroundSprite.removeFromParent();
            }

            this._backgroundSprite = new cc.Sprite(src);
            this.addChild(this._backgroundSprite,0);
        }else {
            this._initWithBackground(src);
        }
    },

    setFontSize: function(fontSize){
        this._fontSize = fontSize;
        if( this._editBox ){
            this._editBox.setFontSize(fontSize);
            this._editBox.setPlaceholderFontSize(fontSize);
        }
    },
    setFontName: function(fontName){
        this._fontName = fontName;
        if(this._editBox){
            this._editBox.setFontName(fontName);
            this._editBox.setPlaceholderFontName(fontName);
        }
    },
    setFontColor: function(fontColor){
        this._fontColor = fontColor;
        if(this._editBox){
            this._editBox.setFontColor(fontColor);
            this._editBox.setPlaceholderFontColor(fontColor);
        }
    },
    setInputMode: function(mode){
        this._inputMode = mode;
        if(this._editBox) this._editBox.setInputMode(mode);
    },
    setPasswordEnabled: function(enabled){
        this._isPassWord = enabled;
        if( enabled && this._editBox ) this._editBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
    },
    setPlaceHolder: function(str){
        this._placeHolder = str;
        if(this._editBox) this._editBox.setPlaceHolder(str);
    },
    setPadding: function(t, r, b ,l){
        this._padding = [t, r, b, l];
        this._initEditBox();
    },
    getString: function(){
        return this._editBox.getString();
    },
    setString: function(str){
        this._value = str;
        if(this._editBox) this._editBox.setString(str);
    }
});

newui.Button = cc.Sprite.extend({
    _textureNormal: null,
    _texturePress: null,
    _textureActive: null,
    _isActive: false,
    _title: null,
    _titlePos: null,
    _onTouch: null,
    _touchEffect: true,
    _padding: {top:0, left: 0},
    _oldScale: cc.p(1, 1),
    ctor: function(){
        if( cc.isString(arguments[0]) ){
            this._textureNormal = arguments[0];
            this._texturePress = arguments[0];
            this._textureActive = arguments[0];
        } else if( !arguments[0] ){
            this._textureNormal = "";
            this._texturePress = "";
            this._textureActive = "";
        }else if( arguments[0].length == 1 ){
            this._textureNormal = arguments[0][0];
            this._texturePress = arguments[0][0];
            this._textureActive = arguments[0][0];
        }else if( arguments[0].length == 2 ){
            this._textureNormal = arguments[0][0];
            this._texturePress = arguments[0][0];
            this._textureActive = arguments[0][1];
        }else if( arguments[0].length == 3 ){
            this._textureNormal = arguments[0][0];
            this._texturePress = arguments[0][1];
            this._textureActive = arguments[0][2];
        }

        this._super(this._textureNormal);

        if( arguments.length > 1 ) this._onTouch = arguments[1];
    },
    _onTouchBegan: function(touch, event){
        if( !this.isActuallyVisible() ) return false;
        var sprSize = this.getContentSize();
        var rect = cc.rect(0, 0, sprSize.width, sprSize.height);
        if (cc.rectContainsPoint(rect, this.convertToNodeSpace(touch.getLocation()))){
            if( this._touchEffect ){
                this._oldScale.x = this.scaleX;
                this._oldScale.y = this.scaleY;
                this.setScale(this._oldScale.x+0.05, this._oldScale.y+0.05);
            }
            return true;
        }
        return false;
    },
    _onTouchMoved: function(touch, event){
        // if( this._onTouch ) return;

        // var tL = touch.getLocation();
        // var locationInNode = this.convertToNodeSpace(tL);

        // var sprSize = this.getContentSize();
        // var newPos = cc.p( tL.x - locationInNode.x -, tL.y- locationInNode.y );

        // this.setPosition( newPos );
    },
    _onTouchEnded: function(touch, event){
        if( this._touchEffect ) this.setScale(this._oldScale.x, this._oldScale.y);
        if( this._onTouch ) this._onTouch(this);
    },
    setActive: function(t){
        this._isActive = t;
        if( this._isActive ) this.setTexture( this._textureActive);
        else this.setTexture( this._textureNormal);
    },
    setTouchEffect: function(t){
        this._touchEffect = t;
    },
    getActive: function(){
        return this._isActive;
    },
    setTitleText: function(txt){
        if( !this._title ){
            this._title = new cc.LabelTTF("", MH.getFont("Font_Default"), 24, null, cc.TEXT_ALIGNMENT_CENTER);
            this._title.setAnchorPoint(0.5, 0.5);
            this.addChild(this._title);
            this._updateTitlePos();
        }

        this._title.string = txt;
    },
    setTitleFontName: function(font){
        this._title.setFontName(font);
    },
    setTitleFontSize: function(n){
        this._title.setFontSize(n);
    },
    setTitleColor: function(_color){
        this._title.setFontFillColor(_color);
    },
    setTitlePadding: function(x, y){
        this._updateTitlePos(x, y);
    },
    setTitleStroke: function(_color, _size){
        this._title.enableStroke(_color, _size);
    },
    getTitle: function(){
        return this._title;
    },
    _updateTitlePos: function(x, y){
        if( !x ) x = 0;
        if( !y ) y = 0;
        if( this._title.x == 0 && this._title.y == 0 ){
            cc.loader.load([this._textureNormal], function(){
                this._title.x = this.width/2 + x;
                this._title.y = this.height/2 + y;    
            }.bind(this));
        }else{
            this._title.x = this.width/2 + x;
            this._title.y = this.height/2 + y;
        }
    },
    isActuallyVisible: function(node){
        if( arguments.length == 0 ){
            if( !this.isVisible() ) return false;
            node = this;
        }
        if (null == node) return true;

        var parent = node.getParent();

        if (parent && !parent.isVisible()) return false;
        return this.isActuallyVisible(parent);
    },
    onEnter: function(){
        this._super();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this._onTouchBegan.bind(this),
            onTouchMoved: this._onTouchMoved.bind(this),
            onTouchEnded: this._onTouchEnded.bind(this)
        }, this);
    },
    onExit: function(){
        this._super();
        cc.eventManager.removeListener(this);
    }
});

newui.SelectBox = cc.Sprite.extend({
    _options:[], //[{label, value}];
    _maxHeight: 200,
    _width: 350,
    _isShow: false,
    _value: null,
    ctor: function(){
        this._options = arguments[0];
        this._super("res/input_default.png");

        var arrow = new cc.Sprite("res/arrow-dropdown.png");
        arrow.x = this._width-30;
        arrow.y = 30;
        this.addChild(arrow);

        var _label = "";
        for( var i=0; i<this._options.length; i++ ){
            if( this._options[i].value = "###" ){
                _label = this._options[i].label;
                break;
            } 
        }

        var label = new cc.LabelTTF(_label, MH.getFont("Font_Default"), 28, cc.size(this._width, 65), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label.setAnchorPoint(0, 0);
        this.addChild(label);
        this.label = label;
    },
    showOption: function(type){
        if( !type ){
            if( this.optionWrap ){
                this.optionWrap.runAction( cc.sequence(cc.scaleTo(0.15, 1, 0), cc.callFunc(function(){
                    this.optionWrap.removeFromParent(true);
                    this.optionWrap = null;
                }, this)));
            }            
            if( this._isShow ) this.zIndex -= 1;
            this._isShow = false;
            return;
        }

        if( this.optionWrap ){
            this.optionWrap.removeFromParent(true);
        }

        if( this._options.length <=1 ) return;

        var wrap = new cc.Scale9Sprite("res/input_default.png");//, cc.rect(0, 0, 350, 65)
        wrap.setContentSize( this._width, this._maxHeight );
        wrap.setAnchorPoint(0, 1);

        var scrollView = new ccui.ScrollView();
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollView.setBounceEnabled(true);
        var padding = 4;
        scrollView.setContentSize(cc.size(this._width, this._maxHeight-2*padding));
        scrollView.setAnchorPoint(0, 0);
        scrollView.y = padding;
        wrap.addChild( scrollView);


        var menu = new cc.Menu();
        var menuH = 0;
        var itemPadd = 10;
        var arr = [];

        for( var i=0; i<this._options.length; i++ ){
            if( this._options[i].value != "###" ){
                var menuItem = new cc.MenuItemFont( this._options[i].label , function(sender){
                    this.setValueByIndex(sender._itemIndex);
                }.bind(this));

                menuItem._itemIndex = i;

                menuItem.setFontName("Font_Default");
                menuItem.setFontSize(28);
                arr.push(menuItem);

                menuH += menuItem.height + itemPadd;
            }
        }


        menuH -= itemPadd; // trừ padding cuối

        menu.initWithArray(arr);
        menu.alignItemsVerticallyWithPadding(itemPadd);

        menu.setPosition(0, 0);
        menu.x = this._width/2;
        menu.setAnchorPoint(0, 0);

        scrollView.addChild(menu);

        cc.log("menuH", menuH);

        if( menuH > this._maxHeight ){
            scrollView.setInnerContainerSize(cc.size(this._width, menuH));
            menu.y = menuH/2;
        }else{
            menu.y = this._maxHeight/2;
        }

        this.addChild(wrap);
        this.optionWrap = wrap;
        wrap.scaleY = 0;
        wrap.runAction( cc.scaleTo(0.2, 1).easing(cc.easeBackOut()) );

        this._isShow = true;
        this.zIndex += 1;
    },
    setValueByIndex: function(i){
        this.showOption(false);
        if( i > this._options.length) return;
        this.label.setString( this._options[i].label );
        this._value = this._options[i].value;
        this.onChange(this._value);
    },
    getValue: function(){
        return this._value;
    },
    onChange: function(){
        cc.log('onChange');
    },
    reset: function(_option){
        // quay về label mặc định
        for( var i=0; i<this._options.length; i++ ){
            if( this._options[i].value == "###" ){
                this.label.setString(this._options[i].label);
                this._value = null;
                break;
            }
        }

        if( _option ) this._options = _option;
    },
    onEnter: function(){
        this._super();

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                if( this._isShow ){
                    this.showOption(false);
                    return true;
                }else{
                    var labelSize = this.getContentSize();
                    var rect = cc.rect(0, 0, labelSize.width, labelSize.height);
                    if (cc.rectContainsPoint(rect, this.convertToNodeSpace(touch.getLocation()))){
                        this.showOption(true);
                        return true;
                    }
                    return false;
                }
            }.bind(this),
        }, this);
    },
    onExit: function(){
        this._super();
        cc.eventManager.removeListener(this);
    }
});

newui.FormCapcha = cc.Node.extend({
    ctor: function(){
        this._super();
        this.sessionId = '';
        // var thiz = this;
        var input = new newui.EditBox();
        input.setBackground("res/popup/textbox-small.png");
        input.setPosition(-90, 0);
        input.setPlaceHolder("Nhập mã");
        this.addChild(input);
        this.inputForm = input;

        var btnF5 = new newui.Button(["res/popup/refesh.png"], this.render.bind(this));
        btnF5.setPosition(145, 0);
        this.addChild(btnF5);

        this.render();
        
    },

    render: function(){
        var thiz = this;

        if( this.imgCapcha ){
            this.imgCapcha.removeFromParent(true);
            this.imgCapcha = null;
        }

        LobbyRequest.getInstance().getCapcha( this.sessionId, function(cmd, data){
            // cc.log("data capcha", cmd, data);
            if( !data ) return;

            thiz.sessionId = data.data.sessionId;

            MH.imageBase64(data.data.image, function(err, img){
                if( !err ){
                    var spr = new cc.Sprite(img);
                    spr.setScale(0.65);
                    spr.setPosition(cc.p(60, 6));
                    thiz.addChild(spr);
                    thiz.imgCapcha = spr;
                }
            });

            cc.getClient().removeListener(LobbyRequest.getInstance());
        }, LobbyRequest.getInstance());
    },
    getAnswer: function(){
        return this.inputForm.getString();
    },
    getSession: function(){
        return this.sessionId;
    }
});

newui.TableView = cc.Node.extend({
    rows: [],
    colWidth: [],
    itemHeight: 50,
    fontSize: 24,
    fontName: "Font_Default",
    sizeW: 0,
    sizeH: 0,
    headerH: 58,//==bg header | itemHeight
    colColor: {},
    ctor: function(w, h){
        this._super();
        this.sizeW = w;
        this.sizeH = h;
        this.x = 0;
        this.y = this.sizeH/2;

        var scrollView = new ccui.ScrollView();
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollView.setBounceEnabled(true);
        scrollView.setContentSize(cc.size(this.sizeW, this.sizeH));
        scrollView.setInnerContainerSize(cc.size(this.sizeW, this.sizeH));
        scrollView.setAnchorPoint(0.5, 1);
        this.addChild( scrollView, 2);
        this.scrollView = scrollView; 
    },
    setHeader: function(){
        if( this.header ) this.header.removeAllChildren(true);
        else{
            this.header = new cc.Node();
            this.header.x = -this.sizeW/2;
            this.addChild(this.header, 1);
        }

        
        var bg = new cc.Sprite("res/popup/table-head.png");
        bg.scaleX = this.sizeW/986;
        bg.setAnchorPoint(0, 1);
        bg.x = 0;
        bg.y += 2;
        this.header.addChild(bg);

        var crWidth = 0;
        for( var i=0; i<arguments.length; i++ ){
            var label = new cc.LabelTTF(arguments[i].toUpperCase(), MH.getFont(this.fontName), this.fontSize, null, cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            label.y = -this.headerH/2;
            label.x = crWidth*this.sizeW+this.colWidth[i]*this.sizeW/2;
            label.setAnchorPoint(0.5, 0.5);
            label.setFontFillColor(cc.color(255, 193, 7));
            this.header.addChild(label);
            crWidth += this.colWidth[i];
        }

        this.scrollView.setContentSize(cc.size(this.sizeW, this.sizeH-this.headerH));
        this.scrollView.setPosition(0, -this.headerH);
    },
    setContent: function(arr){ //[[a, b,c], [a, b,c]]
        this.scrollView.removeAllChildren(true);

        this.rows = arr;
        var contentH = this.rows.length*this.itemHeight;
        if( contentH < this.scrollView.getContentSize().height ){
            contentH = this.scrollView.getContentSize().height;
        }

        this.scrollView.setInnerContainerSize(cc.size(this.sizeW, contentH));

        for( var i=0; i<this.rows.length; i++ ){
            var row = this._createRowNode(this.rows[i]);
            row.y = -i*this.itemHeight- this.itemHeight/2 + contentH;
            this.scrollView.addChild(row);
        }
    },
    setColumn: function(){
        if( arguments.length ) this.colWidth = arguments;
    },
    setColumnColor: function(i, _color){
        this.colColor[i.toString()] = _color;
    },
    setItemHeight: function(h){
        this.itemHeight = h;
    },
    _createRowNode: function(arr){
        var row = new cc.Node();
        row.setContentSize(cc.size(this.sizeW, this.itemHeight));
        // row.y = -this.rows.length*this.itemHeight;
        // if( this.header ) row.y -= this.headerH;

        var crWidth = 0;
        for( var i=0; i<arr.length; i++ ){
            if( cc.isString(arr[i]) ){
                var label = new cc.LabelTTF(arr[i], MH.getFont(this.fontName), this.fontSize, null, cc.TEXT_ALIGNMENT_CENTER);
                label.y = 0;//this.itemHeight/2;
                label.x = crWidth*this.sizeW+this.colWidth[i]*this.sizeW/2;
                label.setAnchorPoint(0.5, 0.5);
                if( this.colColor[i.toString()] ) label.setFontFillColor(this.colColor[i.toString()]);
                row.addChild(label);
            }else{
                arr[i].setAnchorPoint(0.5, 0.5);
                arr[i].x = crWidth*this.sizeW+this.colWidth[i]*this.sizeW/2;
                arr[i].y = 0;
                row.addChild(arr[i]);
            }

            crWidth += this.colWidth[i];
        }

        if( this.rows.length >= 1 ){
            var line = new cc.Sprite("res/popup/table-row.png");
            line.setPosition(this.sizeW/2, -this.itemHeight/2);
            line.scaleX = this.sizeW/980;
            row.addChild( line );
        }

        return row;
    }
});

newui.LabelTTF = cc.LabelTTF.extend({
    _countRunning: false,
    _countFrom: 0,
    _countTo: 0,
    _countStep: 1,
    _countDuration: 1,
    _countTime: 0,
    numToString: function(n){
        return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },
    countTo: function(_to, _duration){
        if( _to === this._countTo ) return;

        this.unscheduleUpdate();

        this._countFrom = this._countTo;
        this._countTo = _to;
        this._countDuration = _duration || 1;
        this._countTime = 0;
        this._countStep = (this._countTo - this._countFrom)/this._countDuration;
        this._countRunning = true;
        this.scheduleUpdate();
    },
    update: function(dt){
        if( this._countRunning ){
            this._countTime += dt;
            if( this._countTime > this._countDuration ){
                this._countRunning = false;
                this.setString(this.numToString(this._countTo));
                this.unscheduleUpdate();
            }else{
                this.setString( this.numToString(this._countFrom + this._countStep*this._countTime) );
            }
        }
    }
});

newui.LabelBMFont = cc.LabelBMFont.extend({
    _countRunning: false,
    _countFrom: 0,
    _countTo: 0,
    _countStep: 1,
    _countDuration: 1,
    _countTime: 0,
    numToString: function(n){
        return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },
    countTo: function(_to, _duration){
        if( _to === this._countTo ) return;

        this.unscheduleUpdate();

        this._countFrom = this._countTo;
        this._countTo = _to;
        this._countDuration = _duration || 1;
        this._countTime = 0;
        this._countStep = (this._countTo - this._countFrom)/this._countDuration;
        this._countRunning = true;
        this.scheduleUpdate();
    },
    update: function(dt){
        if( this._countRunning ){
            this._countTime += dt;
            if( this._countTime > this._countDuration ){
                this._countRunning = false;
                this.setString(this.numToString(this._countTo));
                this.unscheduleUpdate();
            }else{
                this.setString( this.numToString(this._countFrom + this._countStep*this._countTime) );
            }
        }
    }
});

newui.RadioGroup = cc.Class.extend({
    _buttons: [],
    getValue: function(){
        for( var i=0; i<this._buttons.length; i++ ){
            if( this._buttons[i].getActive() ) return this._buttons[i].getUserData().value;
        }

        return null;
    },
    setValue: function(_val){
        for( var i=0; i<this._buttons.length; i++ ){
            if( this._buttons[i].getUserData().value === _val ){
                this._buttons[i].setActive(true);
            }else{
                this._buttons[i].setActive(false);
            }
        }
    },
    initWithArray: function(arr){ // aray of node
        this._buttons = arr;
        for( var i=0; i<arr.length; i++ ){
            arr[i]._onTouch = function(sender){
                this.setValue(sender.getUserData().value);
            }.bind(this);
        }
        this.setValue( arr[0].getUserData().value );
    },
    addRadio: function(node){
        this._buttons.push(node);
        node._onTouch = function(sender){
            this.setValue(sender.getUserData().value);
        }.bind(this);
    }
});