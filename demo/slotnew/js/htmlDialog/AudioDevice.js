function AudioDevice(a){
	this.volume = 1;
	this.repeat = false;
	this.speaker = [];
	this.crNum = 0;

	var thiz = this;

	if( typeof a === 'string' ){
		var _p = new Audio();
		_p.src = a;
		_p.volume = this.volume;
		_p.onended = function(){
			if( thiz.repeat == true ){
				thiz.crNum = 0;
				thiz.speaker[ thiz.crNum ].currentTime = 0;
				thiz.speaker[ thiz.crNum ].play();
			}
		};
		this.speaker.push(_p);
	}else if( typeof a === 'object' ){
		var _len = a.length;
		for( var i=0; i<_len; i++ ){
			var _p = new Audio();
			_p.src = a[i];
			_p.volume = this.volume;
			if( i === _len-1 ){
				_p.onended = function(){
					thiz.crNum = 0;
					if( thiz.repeat == true ){
						thiz.speaker[ thiz.crNum ].currentTime = 0;
						thiz.speaker[ thiz.crNum ].play();
					}
				};
			}else{
				_p.onended = function(){
					thiz.crNum += 1;
					thiz.speaker[ thiz.crNum ].play();
				};
			}

			this.speaker.push(_p);
		}
	}

	this.load = function(a){
		if( typeof a === 'string' ){
			var _p = new Audio();
			_p.src = a;
			_p.load();
		}else if( typeof a === 'object' ){
			for( var i=0; i<a.length; i++ ){
				var _p = new Audio();
				_p.src = a[i];
				_p.load();
			}
		}else if( this.speaker.length ){
			for( var i=0; i<this.speaker.length; i++ ){
				this.speaker[i].load();
			}
		}
	};

	this.destroy = function(){
		this.crNum = 0;
		for( var i=0; i<this.speaker.length; i++ ){
			this.speaker[i].pause();
		}
		this.speaker = [];
	};

	this.play = function(a){
		var thiz = this;
		if( typeof a === 'string' ){
			this.destroy();
			var _p = new Audio();
			_p.src = a;
			_p.volume = this.volume;
			_p.onended = function(){
				// if( callback ) callback();
				if( thiz.repeat == true ){
					thiz.crNum = 0;
					thiz.speaker[ thiz.crNum ].currentTime = 0;
					thiz.speaker[ thiz.crNum ].play();
				}
			};
			this.speaker.push(_p);
		}else if( typeof a === 'object' ){
			this.destroy();
			var _len = a.length;
			for( var i=0; i<_len; i++ ){
				var _p = new Audio();
				_p.src = a[i];
				_p.volume = this.volume;
				if( i === _len-1 ){
					_p.onended = function(){
						thiz.crNum = 0;
						if( thiz.repeat == true ){
							thiz.speaker[ thiz.crNum ].currentTime = 0;
							thiz.speaker[ thiz.crNum ].play();
						}
					};
				}else{
					_p.onended = function(){
						thiz.crNum += 1;
						thiz.speaker[ thiz.crNum ].play();
					};
				}

				this.speaker.push(_p);
			}
		}

		if( this.speaker.length && this.speaker[thiz.crNum] ) this.speaker[thiz.crNum].play();
	};

	this.changeVolume = function(n){
		this.volume = n;
		for( var i=0; i<this.speaker.length; i++ ){
			this.speaker[i].volume = this.volume;
		}
	};

	this.pause = function(){
		for( var i=0; i<this.speaker.length; i++ ){
			this.speaker[i].pause();
		}
	};

	this.playAgain = function(){
		this.crNum = 0;
		for( var i=0; i<this.speaker.length; i++ ){
			this.speaker[i].currentTime = 0;
			if( i != this.crNum ) this.speaker[i].pause();
		}

		if( this.speaker.length && this.speaker[this.crNum] ) this.speaker[this.crNum].play();
	};

	this.stop = function(){
		this.crNum = 0;
		for( var i=0; i<this.speaker.length; i++ ){
			this.speaker[i].pause();
			this.speaker[i].currentTime = 0;
		}
	};
}