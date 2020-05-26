/**
 * Created by hiepnh on 4/27/17.
 */
var MyHelper = MyHelper || {};
/**
 *
 * @param png [normal,down, hover] or string png 1 state
 * @param isSpriteSheet
 * @param clickHandler
 * @returns {*}
 */
MyHelper.createButton = function(png, isSpriteSheet, clickHandler, is9path, size9path, padding) {
    

    var button ;
    var namePng ;
    if(isSpriteSheet ){

        if(hiepnh.isArray(png)) namePng =png[0];
        else namePng = png;

        if(is9path){
            button = new PIXI.mesh.NineSlicePlane(PIXI.Texture.fromFrame(namePng), padding[0], padding[1], padding[2], padding[3]);
            button.width = size9path.width;
            button.height = size9path.height;
        }else{
            button = PIXI.Sprite.fromFrame(namePng);
        }
    }
    else{
        if(is9path){
            button = new PIXI.mesh.NineSlicePlane(PIXI.Texture.fromFrame(png), padding[0], padding[1], padding[2], padding[3]);
            button.width = size9path.width;
            button.height = size9path.height;
            button.pivot.set(size9path.width/2, size9path.width/2);
        }else{
            button = PIXI.Sprite.fromImage(png);
        }
    }
    button.interactive = true;
    button.buttonMode = true;
    button.displayGroup = MyPixi.gameRootLayer;
    if(!is9path)button.anchor.set(cc.p3(0.5, 0.5));
    button.position.set(cc.p2(50, 50));

    var thiz = this;
    var zoomScale = false;
    if(hiepnh.isArray(png)){

    }else{
        zoomScale = true;
    }

    var textureState =[];//normal -down -hover
    if(isSpriteSheet && !zoomScale){
        for(var i = 0 ; i < png.length;i++){
            textureState.push(PIXI.Texture.fromFrame(png[i]));
        }

        if(textureState.length < 3){
            for(var i = 0 ; i < (3-textureState.length);i++){
                textureState.push(PIXI.Texture.fromFrame(png[0]));
            }
        }

    }else{
        textureState[0] = PIXI.Texture.fromFrame(png);
    }
    button.textureState = textureState;

    var onButtonDown = function(event) {
        event.stopPropagation();
        this.isdown = true;

        if(zoomScale) this.scale.set(0.95, 0.95);
        else button.texture = button.textureState[1];
        if(clickHandler) clickHandler();
    }

    var onButtonUp = function() {
        this.isdown = false;
        if(zoomScale) this.scale.set(1, 1);
        if (this.isOver) {
            //if(clickHandler) clickHandler();
            if(!zoomScale && textureState.length ==3) button.texture = button.textureState[2];
        }
        else {
            if(!zoomScale)button.texture = textureState[0];
        }
    }

    var onButtonOver = function() {
        this.isOver = true;
        if (this.isdown) {
            return;
        }
        if(!zoomScale && textureState.length ==3)button.texture = button.textureState[2];
    }

    var onButtonOut=function() {
        this.isOver = false;
        if (this.isdown) {
            return;
        }
        if(!zoomScale && textureState.length ==3)button.texture = button.textureState[2];
    }

    button
        .on('pointerdown', onButtonDown)
        .on('pointerup', onButtonUp)
        .on('pointerupoutside', onButtonUp)
        .on('pointerover', onButtonOver)
        .on('pointerout', onButtonOut);
    return button;
};

MyHelper.addLblButton = function(btn, title, fontSize){
    var anchor = cc.p(0, 0);
    //9Path btn se ko co anchor
    if(btn.anchor)  anchor = cc.p(btn.anchor.x, btn.anchor.y);
    var lbl =  cc.LabelTTF(title ,cc.res.font.Arial, fontSize, null, "white");
    lbl.anchor.set(.5,.5);
    if(anchor.x == 0.5 && anchor.y == 0.5)
        lbl.position.set(0, 0 );
    else{
        lbl.position.set(btn.width/2, btn.height/2 );
    }
    btn.removeChildren();//remove cac label da add len btn neu ko
    btn.addChild(lbl);
};

MyHelper.addClickListenerToLabel = function(label, clickHandler) {
    label.interactive = true;
    label.buttonMode = true;
    label.labelMode = true;
    label.displayGroup = MyPixi.gameRootLayer;
    var thiz = this;
    var zoomScale = true;


    var onButtonDown = function(event) {
        event.stopPropagation();
        this.isdown = true;
        if(zoomScale) this.scale.set(0.95, 0.95);
        if(clickHandler) clickHandler();
    }

    var onButtonUp = function() {
        this.isdown = false;
        if(zoomScale) this.scale.set(1, 1);
        if (this.isOver) {
            //if(clickHandler) clickHandler();
        }

    }

    var onButtonOver = function() {
        this.isOver = true;
        if (this.isdown) {
            return;
        }
    }

    var onButtonOut=function() {
        this.isOver = false;
        if (this.isdown) {
            return;
        }
    }

    label
        // Mouse & touch events are normalized into
        // the pointer* events for handling different
        // label events.
        .on('pointerdown', onButtonDown)
        .on('pointerup', onButtonUp)
        .on('pointerupoutside', onButtonUp)
        .on('pointerover', onButtonOver)
        .on('pointerout', onButtonOut);


    //this.addChild(label);

    return label;
};
MyHelper.addHoverClickListenerToLabel = function(label, hoverHandler, hoverOutHandler) {
    label.interactive = true;
    label.buttonMode = true;
    label.labelMode = true;
    var thiz = this;
    var zoomScale = true;


    var onButtonDown = function(event) {

    }

    var onButtonUp = function() {


    }

    var onButtonOver = function() {
        this.scale.set(0.9, 0.9);
        if(hoverHandler) hoverHandler();
    }

    var onButtonOut=function() {
        this.scale.set(1, 1);
        if(hoverOutHandler) hoverOutHandler();
    }

    label
        // Mouse & touch events are normalized into
        // the pointer* events for handling different
        // label events.
        .on('pointerdown', onButtonDown)
        .on('pointerup', onButtonUp)
        .on('pointerupoutside', onButtonUp)
        .on('pointerover', onButtonOver)
        .on('pointerout', onButtonOut);


    //this.addChild(label);

    return label;
};

MyHelper.addClickListenerToObj = function(obj, clickHandler) {
    obj.interactive = true;
    obj.buttonMode = true;
    //obj.objMode = true;
    //obj.displayGroup = MyPixi.gameRootLayer;
    var thiz = this;
    var zoomScale = true;


    var onButtonDown = function(event) {
        event.stopPropagation();
        this.isdown = true;
        if(zoomScale) this.scale.set(0.95, 0.95);
        if(clickHandler) clickHandler(obj);
    }

    var onButtonUp = function() {
        this.isdown = false;
        if(zoomScale) this.scale.set(1, 1);
        if (this.isOver) {
            //if(clickHandler) clickHandler();
        }

    }

    var onButtonOver = function() {
        this.isOver = true;
        if (this.isdown) {
            return;
        }
    }

    var onButtonOut=function() {
        this.isOver = false;
        if (this.isdown) {
            return;
        }
    }

    obj
        // Mouse & touch events are normalized into
        // the pointer* events for handling different
        // obj events.
        .on('pointerdown', onButtonDown)
        .on('pointerup', onButtonUp)
        .on('pointerupoutside', onButtonUp)
        .on('pointerover', onButtonOver)
        .on('pointerout', onButtonOut);


    //this.addChild(obj);

    return obj;
};