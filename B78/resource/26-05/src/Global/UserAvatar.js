/**
 * Created by Kk on 7/16/2016.
 */
/*
var UserAvatar = cc.Node.extend({
    ctor : function (size) {
        this._super();
        this.setAnchorPoint(cc.p(0.5, 0.5));
        if(size) this.setContentSize(size);
        var avatarBg = new cc.Sprite();
        this.addChild(avatarBg);
        this.avatarBg = avatarBg;

        var avatarImg = new WebSprite(cc.size(212,100));// new cc.Sprite();
        this.addChild(avatarImg,1);
        this.avatarImg = avatarImg;
    },
    setSizeAvatar: function (size) {
        this.avatarImg._setFixSize(size);
    },
    setAvatar : function (avatarUrl) {
        if(avatarUrl.indexOf('http') !== -1){
            if(avatarUrl.indexOf('graph.facebook.com') !== -1) {
                //avatarUrl = avatarUrl.concat('&redirect=false');
                cc.log("avatar fb : "+avatarUrl);
            }
            this.avatarImg.reloadFromURL(avatarUrl);
            //cc.log("aaaaaaaaaa setavatar");
        }else{
            this.avatarImg.setSpriteFrame(avatarUrl);
            //this.setContentSize(this.avatarImg.getContentSize());
        }
        this.avatarImg.setPosition(this.getContentSize().width/2, this.getContentSize().height/2 + 3);


    },

    setAvatarBg : function (avatarImg) {
        this.avatarBg.setSpriteFrame(avatarImg);
        var size = this.avatarBg.getContentSize();
        this.setContentSize(size);
        this.avatarBg.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        this.avatarImg._setFixSize(cc.size(size.width -20, size.height -20));
    },
    downloadCompleted : function(texture)
    {
        //var sprite = new cc.Sprite(texture);
        //this.addChild(sprite);
        this.setAvatarBg(texture);
    },

});
UserAvatar.createLobbyAvatar = function () {
    var avt = new UserAvatar();
    avt.setAvatarBg("bg_avatar_home.png");
    return avt;
};
UserAvatar.createMe = function () {
    var avt = new UserAvatar();
    avt.setAvatarBg("bg_avatar_home.png");
    return avt;
};

UserAvatar.createAvatar = function () {
    var avt = new UserAvatar();
    avt.setAvatarBg("bg_avatar_home.png");
    return avt;
};

UserAvatar.createAvatarGame = function (size) {
    var avt = new UserAvatar(size);
    //avt.setAvatarBg("bg_avatar_home.png");
    return avt;
};*/

