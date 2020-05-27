var Footer = cc.Sprite.extend({
	ctor: function(){
		this._super("res/footer/bg.png");
		this.setPosition(0, -239);
	},
	onEnter: function(){
		this._super();

		var btnNhiemVu = new newui.Button("res/footer/nhiemvu-icon.png");
		btnNhiemVu.setPosition(132,51);
		this.addChild(btnNhiemVu);

		var btnGiftCode = new newui.Button("res/footer/giftcode-icon.png");
		btnGiftCode.setPosition(270,51);
		this.addChild(btnGiftCode);

		var btnChuyenKhoan = new newui.Button("res/footer/chuyenkhoan-icon.png");
		btnChuyenKhoan.setPosition(410,51);
		this.addChild(btnChuyenKhoan);

		var btnGroup = new newui.Button("res/footer/group-icon.png");
		btnGroup.setPosition(870,51);
		this.addChild(btnGroup);

		var btnFanPage = new newui.Button("res/footer/fanpage-icon.png");
		btnFanPage.setPosition(1010,51);
		this.addChild(btnFanPage);

		var btnOTPApp = new newui.Button("res/footer/otp-icon.png");
		btnOTPApp.setPosition(1147,51);
		this.addChild(btnOTPApp);

		var spineIcon = new sp.SkeletonAnimation("res/footer/Dai ly.json", "res/footer/Dai ly.atlas");
		spineIcon.setAnimation(0, 'Idle', true);
		spineIcon.setPosition(640, 0);
		this.addChild(spineIcon);
	}
});