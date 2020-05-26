var MyHelper = MyHelper || {};
/**
 *
 * @param png [normal,down, hover] or string png 1 state
 * @param isSpriteSheet
 * @param clickHandler
 * @returns {*}
 */
MyHelper.createButton = function(png, isSpriteSheet, clickHandler, is9path, size9path, padding) {
    var namePng = isSpriteSheet? ("#"+png):png;

    // cc.log("aaaaaa",png, isSpriteSheet, namePng);
    var button = new newui.Button(namePng, clickHandler);
    if(!is9path)button.setAnchorPoint(cc.p3(0.5, 0.5));
    button.setPosition(cc.p2(50, 50));

    return button;
};

MyHelper.addLblButton = function(btn, title, fontSize){
    btn.setTitleText(title);
    btn.setTitleFontName("Font_Default");
    btn.setTitleFontSize(fontSize);
};

MyHelper.addClickListenerToLabel = function(label, clickHandler) {
    return label;
};
MyHelper.addHoverClickListenerToLabel = function(label, hoverHandler, hoverOutHandler) {
    return label;
};

MyHelper.addClickListenerToObj = function(obj, clickHandler) {
    return obj;
};