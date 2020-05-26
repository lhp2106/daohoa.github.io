var SlotLayer = cc.Layer.extend({
    ctor: function(gid){
        this._super();
        cc.log("Render slot "+ gid);
        return true;
    }
});