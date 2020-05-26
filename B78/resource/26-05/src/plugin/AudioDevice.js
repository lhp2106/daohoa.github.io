var MH = MH || {};
var AudioDevice = cc.Class.extend({
	ctor: function(){
		this._allSoundKey = {};
		this._list = [];
		this._muted = false;
	},
	setData: function(obj){
		this._allSoundKey = obj;
	},
	setMuted: function(t){
		this._muted = t;
		for( var i=0; i<this._list.length; i++ ){
            if( t ) cc.audioEngine.pauseEffect(this._list[i]._eff);
            else cc.audioEngine.resumeEffect(this._list[i]._eff);
        }
	},
	checkToRemove: function(){
		// noloop max 60s
		var _now = (new Date()).getTime();
		for( var i=this._list.length-1; i>=0; i-- ){
			if( !this._list[i]._loop && _now-this._list[i]._at > 60000 ){
				// try stop then remove
				cc.audioEngine.stopEffect(this._list[i]._eff);
				this._list.splice(i, 1);
			}
		}
	},
	playEffect: function(key, loop, tag){
		if( this._muted ) return;
		cc.log("before play", this._list.length);
		this.checkToRemove();
		if( this._allSoundKey[key] ){
			if(!tag) tag = "";
			if(!loop) loop = false;
			var at = (new Date()).getTime();
			var eff;
			if( cc.isArray( this._allSoundKey[key] ) ){ // play random
				eff = cc.audioEngine.playEffect(this._allSoundKey[key][ Math.floor(Math.random() * (this._allSoundKey[key].length)) ], loop);
			}else if( cc.isString( this._allSoundKey[key] ) ){
				eff = cc.audioEngine.playEffect(this._allSoundKey[key], loop);
			}

			this._list.push({_eff: eff, _tag: tag, _loop: loop, _at: at});

			return eff;
		}

		return null;
	},
	stopEffect: function(audio){
		cc.log("please run stopByTag to stop an effect");
	},
	stopByTag: function(s){
		cc.log("stop by tag", s);
		var arr = s.split(" ");
		for( var i=this._list.length-1; i>=0; i-- ){
			for( var j=0; j<arr.length; j++ ){
				if( this._list[i]._tag.indexOf(arr[j]) != -1 ){
					cc.audioEngine.stopEffect(this._list[i]._eff);
					this._list.splice(i, 1);
					cc.log("found", arr[j]);
					break;
				}
			}
		}
		cc.log("after stop", this._list);
	},
	destroy: function(){
		cc.log("destroy", this._list);
		for( var i=this._list.length-1; i>=0; i-- ){
			cc.log("remove eff", this._list[i]);
			cc.audioEngine.stopEffect(this._list[i]._eff);
		}
		this._list = [];
	}
});