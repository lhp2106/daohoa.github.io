var MaskRoundRecLayer = cc.Node.extend({
	ctor: function(w,h, radius){
		this._super();
		this.w = w;
	    this.h = h;
	    this.radius = radius;

	    var thing = new cc.DrawNode();
	    this.addChild(thing);
	    thing.x = 0;
	    thing.y = 0;

	    thing.drawRect(cc.p(0, 0), cc.p(this.w, this.h), cc.color("#8bc5ff"), 3, cc.color("#ff0000"));
	    this.mask = thing;
	    this.thing = thing;
	},
	showBlurBg: function(isShow, colorHexa){
		console.log("MaskRoundRecLayer showBlurBg");
	}
});