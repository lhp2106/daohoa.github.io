var PIXI = PIXI || {};

PIXI.Text = cc.LabelTTF.extend({
	ctor: function(str, obj){
		var fontFamily, fontSize, fill, align;

		if( obj.hasOwnProperty('fontFamily') ) fontFamily = obj.fontFamily;
		else fontFamily = cc.res.font.Arial;

		if( obj.hasOwnProperty('fontSize') ) fontSize = obj.fontSize;
		else fontSize = 21;

		if( obj.hasOwnProperty('fill') ){
			if( cc.isNumber( obj.fill ) ){
				var hex = obj.fill.toString(16);
		        hex = '000000'.substr(0, 6 - hex.length) + hex;

		        fill = '#' + hex;
			}else fill = obj.fill;
		}else fill = '#ffffff';

		if( obj.hasOwnProperty('align') ){
			if( obj.align == 'left' ) align = cc.TEXT_ALIGNMENT_LEFT;
			else if( obj.align == 'right' ) align = cc.TEXT_ALIGNMENT_RIGHT;
			else if( obj.align == 'center' ) align = cc.TEXT_ALIGNMENT_CENTER;
		}else align = cc.TEXT_ALIGNMENT_LEFT;

		cc.LabelTTF.prototype.ctor.call(this, str, fontFamily, fontSize, null, align);

		this.setFontFillColor(cc.color(fill));
	}
});
PIXI.Sprite = {};
PIXI.Sprite.fromFrame = function(str){
	var spr = new cc.Sprite("#"+str);
	spr.setAnchorPoint(cc.p3(0,0));
	return spr;
};
PIXI.Sprite.fromImage = function(str){
	var spr = new cc.Sprite(str);
	spr.setAnchorPoint(cc.p3(0,0));
	return spr;
};

PIXI.Texture = {};
PIXI.Texture.fromFrame = function(str){
	return cc.spriteFrameCache.getSpriteFrame(str).getTexture();
};