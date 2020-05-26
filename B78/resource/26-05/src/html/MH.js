var MyPixi = MyPixi || {};
MyPixi.rendererGame = cc.winSize;

var MH = MH || {};
MH.onOpenPopup = false;
MH.fonts = [];
MH.currentPage = function(){
    var crPage = cc.director.getRunningScene().getPageName();

    if( arguments.length ) return crPage === arguments[0];
    else return  crPage
};

MH.loadRes = function(){
	var res = arguments[0];
	var callback = ( arguments.length === 2 )? arguments[1]: arguments[2];
	var progress = arguments.length === 3? arguments[1]: function(){};

	var complete = function(){
		for( var i = 0; i<res.length; i++ ){
			if( cc.isObject(res[i]) && res[i].hasOwnProperty("type") && res[i]["type"] === "font" ){
				if( MH.fonts.length === 0 ) MH.fonts.push( res[i] );
				else {
					for( var j = 0; j<MH.fonts.length; j++ ){
						if( MH.fonts[j].name === res[i].name ) break;
						else if( j === MH.fonts.length -1 ) MH.fonts.push( res[i] );
					}
				}
			}else if( cc.isString(res[i]) && res[i].endsWith(".plist") ){
				cc.spriteFrameCache.addSpriteFrames(res[i]);
			}
		}

		callback.call(null);
	};

	cc.loader.load(arguments[0], progress, complete);
};

MH.loadJson = function(url, cb){
	var xhr = cc.loader.getXMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
    	if (xhr.readyState === 4)
            (xhr.status === 200||xhr.status === 0) ? cb(null, JSON.parse(xhr.responseText)) : cb({status:xhr.status, errorMessage:errInfo}, null);
    };
    xhr.send();
};

MH.getFont = function(fontName){
	for( var j = 0; j<MH.fonts.length; j++ ){
		if( MH.fonts[j].name === fontName ){
			if (cc.sys.isNative){
				return MH.fonts[j].srcs[0];
			}else{
				return fontName;
			}
		}
	}

	return "Arial";
};

MH.changePage = function(pname, data){
	var pagesName = ['loading', 'home', 'game', 'play', 'slot'];
	if( pagesName.indexOf( pname ) === -1 ){
		return;
	}

	cc.director.getRunningScene().changePage(pname, data);
};

MH.logOut = function(){
	// MH.setCookie('_infoVIP52', 'pp', -1);
	// MH.setCookie('_loginType', 'pp', -1);
	// location.reload();
	// return;

	cc.log("run MH logout");

	PlayerMe.id = -1;

	// Logout mini game
	MiniGameClient.getInstance().logOut();
	TopHuClient.getInstance().login();

	// hide minigames
	// $('#menu-minigame, .minigame-item, #menu-gameslot').remove();

	// change page -> home
	//if( !MH.currentPage('playslot') ) MH.changePage('home');
	// $('body').removeClass('logged');
	MH.changePage("home");

	// MH.header.change('logout');
};

MH.numToText = function(n){
	return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

MH.imageBase64 = function(_code, callback){
	if( cc.sys.isNative ){
		var requestUrl = "https://spritebase64.000webhostapp.com/";
		var request = cc.loader.getXMLHttpRequest();
	    request.open("POST", requestUrl, true);
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");

	    request.onreadystatechange = function (){
	        if (request.readyState == 4){
	        	var res = JSON.parse(request.responseText);
	        	if( res.src ){
	        		cc.loader.loadImg(requestUrl+res.src, callback);
	        	}
	            // cc.log(HttpRequest.RES_SUCCESS, request.responseText);
	        }else{
	            // cc.log(HttpRequest.RES_ERROR, null);
	        }
	    };

	    request.send(_code);
	}else{
		cc.loader.loadImg("data:image/png;base64,"+_code, {isCrossOrigin : false }, callback);
	}

   //  $now = time();
   //  $str = file_get_contents('php://input');
   //  $fileName = "img/".$now."_".rand(1, 10000).".png";
   //  file_put_contents($fileName, base64_decode($str));
    
   //  $files = glob("img/*");
	  // foreach ($files as $file) {
	  //   if (is_file($file)) {
	  //     if ($now - filemtime($file) >= 60) { // 60sec
	  //       unlink($file);
	  //     }
	  //   }
	  // }
   //  echo '{"src":"'. $fileName .'"}';   
};

MH.convertTime = function(s, type){
	//%d-ngày %m-tháng %y-năm %h-giờ %i-phút %s-giây
	if( !type ) type = "%d/%m %h:%i:%s";
	var d = new Date( s );

	return type.replace(new RegExp("\\%" + "\\w"  , "g"), function(mather){
		var returnStr ="";
        if(mather.indexOf("d") !=-1) returnStr = (d.getDate() < 10) ? '0'+d.getDate() : d.getDate();
        else if(mather.indexOf("m")!=-1) returnStr =  (d.getMonth()<9) ? '0'+(d.getMonth()+1) : (d.getMonth()+1);
        else if(mather.indexOf("y")!=-1) returnStr =  d.getFullYear();
        else if(mather.indexOf("h")!=-1) returnStr =  (d.getHours()<10) ? '0'+d.getHours() : d.getHours();
        else if(mather.indexOf("i")!=-1) returnStr =  (d.getMinutes()<10) ? '0'+d.getMinutes() : d.getMinutes();
        else if(mather.indexOf("s")!=-1) returnStr =  (d.getSeconds()<10) ? '0'+d.getSeconds() : d.getSeconds();

        return returnStr;
	});
};

MH.loadingDialog = {
	onRun: false,
	show : function(obj){
		this.hide();

		var _text = "",
			_timeout = 1000;

		if( obj ){
			if( cc.isString(obj) ) _text = obj;
			else if( cc.isObject(obj) ){
				if( obj.text ) _text = obj.text;
				if( obj.timeout ) _timeout = obj.timeout; 
			}
		}

		if( _timeout > 1000 ) _timeout = _timeout/1000;


		var winSize = cc.winSize;

        var colorLayer = new cc.LayerColor(cc.color(0,0,0,180), winSize.width, winSize.height);
        colorLayer.setTag(92175);
        var iconLoading = new cc.Sprite("res/icon-loading.png");
        iconLoading.setPosition(cc.p(winSize.width/2, winSize.height/2+30));

        var textLabel = new cc.LabelTTF(_text, "Font_Default", 24);
        textLabel.setPosition(cc.p(winSize.width/2, winSize.height/2-100+30));

        colorLayer.addChild(iconLoading);
        colorLayer.addChild(textLabel);

        cc.director.getRunningScene().addChild(colorLayer, 9999);


        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function (touch, event) {
                return true;
            }
        }, colorLayer);

        var iconAction = cc.sequence(cc.rotateBy(_timeout, 360*_timeout), cc.callFunc(function(){
        	if( obj.afterTimeout ) obj.afterTimeout.call(this);
        }));
        iconLoading.runAction( iconAction );

		this.onRun = true;
	},
	hide : function(){
		cc.director.getRunningScene().removeChildByTag(92175);
		this.onRun = false;
	}
};

MH.getCookie = function(cname){
	return 0;
};

MH.setCookie = function(){

};

MH.createPopup = function(obj){
	if( cc.isString(obj) ) MessageNode.getInstance().show(obj);
};

MH.updateDPN = {
	open: function(){
		cc.log("open MH.updateDPN");
	},
	close: function(){
		cc.log("close MH.updateDPN");
	}
};

MH.loginDone = function( obj ){
	cc.log("MH.loginDone", obj);

	// TV kích hoạt
	// header logged
	// login minigame -> add menu - minigame

	MH.header.change('logged');

	if( obj.kichhoat ){
		// MH.marquee.destroy();
		// MH.marquee.append([obj.kichhoat]);
	}

	var handlerLoginDone = function(){
		cc.log("login minigame done");
		// add menu - minigame
		// MH.openGame('MINIPOKER');
	};

	var handlerLoginFail = function(){

	};

	var user = PlayerMe.username,
		pass = "123qwe";

	if( !user && !pass && cc.Global.loginType === LoginType.FB ){
		MiniGameClient.getInstance().loginFBHandler(handlerLoginDone, handlerLoginFail);
	}else if(user && pass){
		MiniGameClient.getInstance().login(user, pass,handlerLoginDone);
	}


	// if( cc.Global.loginType == LoginType.FB ){
	// 	MH.setCookie('_infoVIP52', MH.getCookie('_infoVIP52'), -1);
	// 	MH.setCookie('_loginType', 'FB', 100);
	// }else{
	// 	MH.setCookie('_loginType', 'Normal', 100);
	// }

	// if( !obj ) obj = PlayerMe;

	// $('body').addClass('logged');

	// MH.header.change('logged');

	// if( MH.currentPage('home') ){
	// 	MH.changePage('home');
	// }

	// $('body').children('#menu-minigame, .minigame-item, #menu-gameslot').remove();
	// setTimeout(function(){
	// 	cc.log( 'Append new minigame' );
	// 	$('body').append( MH.contentMiniGame );
	// }, 500);

	// if( obj.kichhoat ){
	// 	MH.marquee.destroy();
	// 	MH.marquee.append([obj.kichhoat]);
	// }

	// setTimeout(function(){
	// 	MH.hasNewMessage( LoginData.unreadMsg );
	// 	MH.hasNewNotify( LoginData.newAnnounceMsg );
	// }, 1000);

	// $('#popup-shop .shop-tabs').tabs('option', 'active', 1);
};

MH.header = {
	node: null,
	reInit : function(){
		
	},
	change: function( type ){
		// type = logout || logged
		if( !MH.header.node ) return;

		if( type === 'logged' ){
			if( !MH.checkLogin() ) return;
			MH.header.node.setLogged(true);
		}else if( type === 'logout' ){
			MH.header.node.setLogged(false);
		}
	},
	updateMoney: function(n){
		if( n == undefined ) n = PlayerMe.gold;
		$('#header').find('.gold-num').html( MH.numToText( n, 1) );
	}
};

MH.miniGameLoadingDialog = {
	afterTimeout : undefined,
	show : function(obj){
		/*{
			text:'',
			timeout: 300,
			afterTimeout: function(){}
		}*/

		// $('#loadingDialog').remove();

		var _text = obj.text || '',
			_timeout = obj.timeout || 500;
		// var _html = '<div id="loadingDialog"><div class="dialog-content"><p>'+ _text +'</p></div></div>';
		// $('body').append( _html );


		clearTimeout( this.afterTimeout );

		this.afterTimeout = setTimeout(function(){
			if( obj.hasOwnProperty('afterTimeout') ){
				obj.afterTimeout();
			}
		}, _timeout);

		// $('#menu-minigame').addClass('on-loading');
		// $('body .minigame-item').hide();
	},
	hide : function(){
		clearTimeout( this.afterTimeout );
		// $('#loadingDialog').remove();
		// $('#menu-minigame').removeClass('on-loading');
	}
};

MH.user = {
	reload: function(){
		if( MH.header.node ) MH.header.node.reload;
	}
};

MH.checkLogin = function(){
	return ( PlayerMe.id === -1 ) ? false : true;
};

MH.minigame = {
	nodes: {},
	off: function(){
		cc.log('MH.minigame OFFFFF');
        // hide menu minigame
        // hide all minigames
	},
	on: function(){
		// show menu minigame
	},
	logout: function(){
		cc.log('LOGOUT MINIGAME');

		// hide menu minigame
        // hide all minigames
        // minigame autospin -> off auto
	},
	login: function(){
		// show menu

		// check autospin? -> show
	}
};

MH.openGame = function(k){
	k = k+'';
	// MiniGameClient.getInstance().isLoginDone()

	cc.log("open game", k);

	if( 0&&!MH.checkLogin() ){
		MessageNode.getInstance().show("Vui lòng đăng nhập hoặc đăng ký tài khoản để chơi");
		return false;
	}else if( k && Constant.GAME_ID[ k ] ){
		if(Constant.GAME_ID_DONE.indexOf(Constant.GAME_ID[ k ]) !== -1 ){
            MH.changePage('game', {gameId: Constant.GAME_ID[ k ]});
		}else{
			MessageNode.getInstance().show("Game này sắp ra mắt");
		}
	}else if(0 && !MiniGameClient.getInstance().isLoginDone() ){
		MessageNode.getInstance().show("Lỗi server, vui lòng chơi game khác hoặc đăng nhập lại");
		return false;
	}else{
		// slot big
		var slBig = ["LONGVUONG", "DEADORALIVE"];
		
		if( slBig.indexOf(k) !== -1 ){
			MH.loadRes(m_resources[k], function(target, total, count){
				MinigamePlugin.getInstance().postEvent(kCMD.PROGESS_OPEN_GAME, {total: total, count: count, game: k});
			}, function(){
                MH.changePage("slot", k);
            });
		}else{
			MinigamePlugin.getInstance().open(k);
		}
	}
};

MH.openPopup = function(_name, data, _check){
	if( _check ){
		
	}
	if( MH.popup.hasOwnProperty(_name) ){
		MH.popup[_name].call(null, data);
	}
};

MH.addTouch = function(node, cb){
	cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function(touch, event){
        	if( !MH.isActuallyVisible(node) ) return false;
	        var sprSize = node.getContentSize();
	        var rect = cc.rect(0, 0, sprSize.width, sprSize.height);
	        if (cc.rectContainsPoint(rect, node.convertToNodeSpace(touch.getLocation()))){
	            return true;
	        }
	        return false;
        },
        onTouchEnded: function(touch, event){
        	cb.call(null);
        }
    }, node);
};

MH.isActuallyVisible = function(node){
	if (node && !node.isVisible()) return false;
	if (null == node) return true;
    var parent = node.getParent();
    if (parent && !parent.isVisible()) return false;
    return this.isActuallyVisible(parent);
};

// xem Global.js
// var cc = cc || {};