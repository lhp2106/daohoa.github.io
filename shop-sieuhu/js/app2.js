var APPNAME = 'slotvipprod';
var APPID = '';
var BASE_URL = 'https://configurator.sslgstatic-gooogle.services';
var PlayerMe = {};
PlayerMe.reset = function(){
	PlayerMe.gold = 0;
	PlayerMe._accessToken = '';
	PlayerMe.displayName = '';
	PlayerMe.phone = '';
	PlayerMe.userId = '';
	PlayerMe.username = '';
};
PlayerMe.getByToken = function(token, callback){
	PlayerMe._accessToken = token;

	var getUserGold = function(){
		var param = {
			"command": "fetch_user_assets",
			"applicationId": APPID,
			"userId": PlayerMe.userId,
			"messageType": 7,
			"skip": 0,
			"limit": 15
		};

		HttpRequest.requestGETMethod("https://api.sslgstatic-gooogle.services/asset",null, param, function(cmd, data){
			if(data && data.data && data.data.userAsset){
				PlayerMe.gold = data.data.userAsset.gold;
				callback();
			}
		});
	};

	HttpRequest.requestGETMethod("https://api.sslgstatic-gooogle.services/id",null, {command : "getAccessTokenInfo"}, function(cmd, data){
		if( data && data.data ){
			PlayerMe.displayName = data.data.displayName;
			PlayerMe.phone = data.data.phone;
			PlayerMe.userId = data.data.userId;
			PlayerMe._accessToken = data.data.accessToken;
			PlayerMe.username = data.data.username;

			setCookie("_accessToken", PlayerMe._accessToken, 1);
			// get gold
			if( !APPID ){
				var param = {
	                command : "regdis",
	                bundle : "com.hiphip.sandbox",
	                appName : APPNAME
	            };
				HttpRequest.requestGETMethod(BASE_URL+'/distributor', null, param, function (status, response) {
	                if(status == HttpRequest.RES_SUCCESS && response){
	                    if( response.data ){
	                    	APPID = response.data.applicationId;
	                    	getUserGold();
	                    }
	                }
	            });
			}else{
				getUserGold();
			}
		}else{
			setCookie("_accessToken", "123", -1);
			callback();
		}
	});
};

var products = [];
var categories = [
	{id: "1", name: "Thẻ cào"},
	{id: "2", name: "Điện thoại"},
	{id: "3", name: "Linh kiện PC"},
	{id: "4", name: "Phụ kiện ĐT"},
	{id: "5", name: "Đồng hồ"},
	{id: "6", name: "Thực Phẩm Chức Năng"},
	{id: "7", name: "Tiêu dùng"},
	{id: "8", name: "Camera"},
];

var yourCart = [];

var catProducts = {
	"1": ["5c25c110ceb5e9e31e39a7eb", "5c46f753ceb5e9e31ecef6d3", "5c4ef2dcceb5e9e31e3d9ece", "5c0b2d78ceb5e9e31e1cab87", "5c107851ceb5e9e31e86fac4", "5c2df28dceb5e9e31e85a62c", "5be137bb9dcd73b51446514f", "5be1386c9dcd73b514465b96", "5c4585a3ceb5e9e31e82241a", "5be137e19dcd73b514465389", "5be138839dcd73b514465cf3", "5c2eeea3ceb5e9e31ef56de8"],
	"2": ["5e6370b14d4e96aac36aa565", "5e6346c64d4e96aac36a2ca9", "5e6370704d4e96aac36aa49a", "5e6370114d4e96aac36aa398", "5e6370e84d4e96aac36aa639", "5e33d6295d42b57360d8e5a2", "5e33d9605d42b57360d9963a", "5e33d6515d42b57360d8f0e3", "5e33d9485d42b57360d9913f", "5e33d6905d42b57360d8ffba", "5d8c99e7ceb5e9e31eb8410a", "5e33d6775d42b57360d8fb0c", "5d8c99bcceb5e9e31eb82bf3", "5e33d6bb5d42b57360d9078b", "5e33d91a5d42b57360d988f3", "5e33d7415d42b57360d92343", "5d8c999eceb5e9e31eb81c3d", "5e33d72e5d42b57360d91f44", "5d8c9259ceb5e9e31eb48b46", "5e33d8955d42b57360d96e1b", "5e33d8ad5d42b57360d97366", "5c8687f7ceb5e9e31e45d172", "5e33d7165d42b57360d919f5", "5d8c9980ceb5e9e31eb80aa9", "5c868851ceb5e9e31e462a6c", "5c8686e0ceb5e9e31e44a301", "5e33d46f5d42b57360d8899f", "5c86866dceb5e9e31e44291c", "5d8c98fbceb5e9e31eb7cbe6", "5d8c992eceb5e9e31eb7e350", "5e33d1b25d42b57360d7e3b2", "5d8c9919ceb5e9e31eb7d943", "5c86859dceb5e9e31e433fa7", "5c868581ceb5e9e31e43241e", "5d8c91c7ceb5e9e31eb43e16", "5d8c929aceb5e9e31eb4ab2c", "5d8c92b8ceb5e9e31eb4b9e6", "5d8c9328ceb5e9e31eb4f2f9", "5d8c9315ceb5e9e31eb4e8f2", "5be1168f9dcd73b514441b2c", "5d8c92e0ceb5e9e31eb4cdbb", "5be1166f9dcd73b5144418fe", "5be1165b9dcd73b5144417a0"],
	"3": ["5e6345b94d4e96aac36a29d6", "5e63456e4d4e96aac36a2917", "5e63458d4d4e96aac36a2959", "5e63452b4d4e96aac36a283c"],
	"4": ["5e6346704d4e96aac36a2bdc", "5e6346844d4e96aac36a2c0b", "5e63755d4d4e96aac36ab227", "5e6375ae4d4e96aac36ab356"],
	"5": ["5e6372924d4e96aac36aaa8a", "5e6372ab4d4e96aac36aaadb"],
	"6": ["5e63444b4d4e96aac36a25f4"],
	"7": ["5e6345e84d4e96aac36a2a74", "5e63461c4d4e96aac36a2b02"],
	"8": ["5e6344f84d4e96aac36a279a", "5e6344c84d4e96aac36a2714"],
};

var formatnum = function( n, _type ){
	if( typeof n == 'undefined' ) return '';
	var respon = n;

	if( !_type ){
		return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	}else{
		if( n >= 1000000 ){
			respon = Math.floor( n/10000 )/100+'M';
		}else if( n >= 1000 ){
			respon = Math.floor( n/10 )/100+'K';
		}
	}

	return respon+'';
};

var getQueryVariable = function(variable){
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if(pair[0] == variable){return pair[1];}
	}
	return "";
};

var setCookie = function(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = 'expires=' + d.toUTCString();
    document.cookie = cname+ 'SHOPSIEUHU' + '=' + cvalue + ';' + expires + ';path=/';
};

var getCookie = function(cname) {
    var name = cname+ "SHOPSIEUHU" + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
};

var getCatProducts = function(cid){
	var res = [];

	var pids = catProducts[cid+""];

	for( var i=0; i<pids.length; i++ ){
		res.push( getProInfo(pids[i]) );
	}
	return res;
};

var getCartProducts = function(){
	var res = [];

	var pids = yourCart;

	for( var i=0; i<pids.length; i++ ){
		res.push( getProInfo(pids[i]) );
	}
	return res;
};

var getCatInfo = function(cid){
	for( var i=0; i<categories.length; i++ ){
		if( categories[i].id == cid ) return categories[i];
	}
	return {};
};

var getProInfo = function(pid, shopid, callback){
	// for( var i=0; i<products.length; i++ ){
	// 	if( products[i]["id"] == pid ) return products[i];
	// }
	// return {};

	$.getJSON("http://localhost:8888/test/read.php?type=product&itemid="+ pid +"&shopid="+shopid, function(obj){
		// console.log("pro info", obj);
		if(obj && obj.item){
			callback(obj.item);
		}
	});
};

var addToCart = function(pid){
	if( pid ) yourCart.push( pid );
	$("#header .your-cart .count").html(yourCart.length);
	setCookie('yourCart', JSON.stringify( yourCart ), 2);
};

var removeFromCart = function(pid, _all){
	// console.log( 'removeFromCart', pid);
	var pids = yourCart;
	for( var i=pids.length-1; i>=0; i-- ){
		if( pids[i] == pid ){
			pids.splice(i, 1);
			if( !_all ){
				addToCart(null);
				return;
			}
		}
	}

	addToCart(null);
};

var showCategoty = function(cid, isFixed){
	jQuery.getJSON("http://localhost:8888/test/read.php?type=product_list&category="+cid, function(obj){
		// console.log("products", obj);
		if( obj && obj.items ){
			var _catInfo = getCatInfo(cid);
			var _products = obj.items;

			var _html = '';
			var _count = 0;
			var arrHtml = [];

			_html += '<div id="cat-list-'+ cid +'" class="features_items'+ (isFixed?"":" filled_items") +'">';
			_html += '<h2 class="title text-center">'+ _catInfo["name"] +'</h2>';

			for( var i=0; i< _products.length; i++ ){
				if(jQuery.isEmptyObject(_products[i])) continue;

				var html = '';

				html += '<div class="col-xs-6 col-sm-4"><div class="product-image-wrapper"><div class="single-products"><div class="productinfo text-center">';
				html += '<div class="imgcover"><img src="images/home/blank.png"/><img src="https://cf.shopee.vn/file/'+ _products[i]["image"] +'" alt="" /></div><h2>'+ formatnum(_products[i]["price"]/100000) +'</h2><p>'+ _products[i]["name"] +'</p>';
				html += '<a href="#" class="btn btn-default add-to-cart" data-id="'+ _products[i]["itemid"] +'"><i class="fa fa-shopping-cart"></i>Thêm vào giỏ</a></div></div></div></div>';

				if( _count == 0 ){
					arrHtml.push( html );
				}else{
					arrHtml[arrHtml.length-1] += html;
				}

				_count += 1;

				if( _count > 5 ) _count = 0;

			}

			////
			if( arrHtml.length ) _html += arrHtml[0];
			arrHtml.splice(0, 1);
			////
			if( arrHtml.length ) _html += '<div class="col-xs-12 text-center" style="padding-bottom: 50px;"><button type="button" class="btn btn-default xemthem">Xem thêm</button></div>';

			_html += '</div>';

			$("#content-right").children(".filled_items").remove();
			

			var appended = $(_html);

			appended.find('.xemthem').on("click", function(){
				var content = $(this).data("_content");
				if( content && content.length ){
					$(this).parent().before( content[0] );
					content.splice(0, 1);

					if( !content.length ) $(this).remove();
				}

				return false;
			}).data('_content', arrHtml);

			$("#content-right").prepend(appended);
		}
	});
};

var showCategoty2 = function(cid, isFixed){
	jQuery.getJSON("http://localhost:8888/test/read.php?type=product_list&category="+cid, function(obj){
		// console.log("products", obj);
		if( obj && obj.items ){
			var _catInfo = getCatInfo(cid);
			var _products = obj.items;

			var _html = '';
			var _count = 0;
			var arrHtml = [];

			_html += '<div id="cat-list-'+ cid +'" class="features_items'+ (isFixed?"":" filled_items") +'">';
			_html += '<h2 class="title text-center">'+ _catInfo["name"] +'</h2>';
			if( _products.length > 6 ) _html += '<div class="col-xs-12 text-center" style="padding-bottom: 50px;"><button type="button" class="btn btn-default xemthem">Xem thêm</button></div>';
			_html += '</div>';

			var appended = $(_html);

			$("#content-right").children(".filled_items").remove();

			appended.find('.xemthem').on("click", function(){
				var thiz = this;
				var pros = $(this).data("products");
				if( pros && pros.length ){

					console.log("click", pros.length);

					// $(this).parent().before( content[0] );
					for( var i=0; i<6; i++ ){
						if( pros.length ){
							getProInfo(pros[0].itemid, pros[0].shopid, function(obj){
								var html = '';
								html += '<div class="col-xs-6 col-sm-4"><div class="product-image-wrapper"><div class="single-products"><div class="productinfo text-center">';
								html += '<div class="imgcover"><img src="images/home/blank.png"/><img src="https://cf.shopee.vn/file/'+ obj["image"] +'" alt="" /></div><h2>'+ formatnum(obj["price"]/100000) +'</h2><p>'+ obj["name"] +'</p>';
								html += '<a href="#" class="btn btn-default add-to-cart" data-id="'+ obj["itemid"] +'"><i class="fa fa-shopping-cart"></i>Thêm vào giỏ</a></div></div></div></div>';
								$(thiz).parent().before( html );
								if( !pros.length ) $(thiz).hide();
							});
							pros.splice(0, 1);
						}
					}
				}

				return false;
			}).data('products', _products).trigger("click");
			$("#content-right").prepend(appended);

			$('html, body').animate({
		        scrollTop: $('#cat-list-'+cid).offset().top
		    }, 500);
		}
	});
};

var showRecommend = function(callback){
	jQuery.getJSON("http://localhost:8888/test/read.php?type=recommend_items", function(obj){
		// console.log("recommend_items", obj );
		if(obj && obj.data && obj.data.items){
			var _products = obj.data.items;

			var _html = '';
			var _count = 0;
			var arrHtml = [];

			_html += '<div class="features_items">';
			_html += '<h2 class="title text-center">Gợi ý cho bạn</h2>';

			for( var i=0; i< _products.length; i++ ){
				if(jQuery.isEmptyObject(_products[i])) continue;

				_html += '<div class="col-xs-6 col-sm-4"><div class="product-image-wrapper"><div class="single-products"><div class="productinfo text-center">';
				_html += '<div class="imgcover"><img src="images/home/blank.png"/><img src="https://cf.shopee.vn/file/'+ _products[i]["image"] +'" alt="" /></div><h2>'+ formatnum(_products[i]["price"]/100000) +'</h2><p>'+ _products[i]["name"] +'</p>';
				_html += '<a href="#" class="btn btn-default add-to-cart" data-id="'+ _products[i]["itemid"] +'"><i class="fa fa-shopping-cart"></i>Thêm vào giỏ</a></div></div></div></div>';
			}

			_html += '</div>';

			$("#content-right").prepend(_html);

			if( callback ) callback();
		}
	});
};

var showCatList = function(){
	jQuery.getJSON("http://localhost:8888/test/read.php?type=category_list", function(data){
		// console.log("category_list", data);
		if( data && data.data && data.data.category_list ){
			categories = [];
			var _html = "";
			for( var i=0; i<data.data.category_list.length; i++ ){
				_html += '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a href="#" class="catname" data-cid="'+data.data.category_list[i].catid+'">'+ data.data.category_list[i].display_name +'</a></h4></div></div>';
				categories.push({id: data.data.category_list[i].catid, name: data.data.category_list[i].display_name, img: data.data.category_list[i].image});
			}

			jQuery("#accordian").html(_html);
		}
	});
};

var showCartList = function(){
	// console.log("showCartList", yourCart);
	var _products = getCartProducts();

	var _html = '';

	var cartItems = {}; //{id: len, id: len};

	var _totalPrice = 0;

	for( var i=0; i< _products.length; i++ ){
		if(jQuery.isEmptyObject(_products[i])) continue;

		if( cartItems.hasOwnProperty( _products[i]["id"] ) ){
			cartItems[ _products[i]["id"] ]["len"] += 1;
		}else{
			cartItems[ _products[i]["id"] ] = {};
			cartItems[ _products[i]["id"] ]["info"] = _products[i];
			cartItems[ _products[i]["id"] ]["len"] = 1;
		}

		_totalPrice += _products[i]["price"];
	}

	for (var key in cartItems) {
		if (cartItems.hasOwnProperty(key)) {
			_html += '<tr data-id="'+ key +'">';
			_html += '<td class="cart_product"><a href="#"><img src="'+ cartItems[key]["info"]["image"] +'" alt=""></a></td>';
			_html += '<td class="cart_description"><h4><a href="#">'+ cartItems[key]["info"]["displayName"] +'</a></h4></td>';
			_html += '<td class="cart_price"><p>'+ formatnum(cartItems[key]["info"]["price"]) +'</p></td>';
			_html += '<td class="cart_quantity"><div class="cart_quantity_button"><a class="cart_quantity_up" href=""> + </a><input class="cart_quantity_input" type="text" name="quantity" value="'+ cartItems[key]["len"] +'" autocomplete="off" size="2" disabled><a class="cart_quantity_down" href=""> - </a></div></td>';
			_html += '<td class="cart_total"><p class="cart_total_price">'+ formatnum(cartItems[key]["info"]["price"] * cartItems[key]["len"] ) +'</p></td>';
			_html += '<td class="cart_delete"><a class="cart_quantity_delete" href=""><i class="fa fa-times"></i></a></td>';
			_html += '</tr>';
		}
	}

	_html += '<tr><td colspan="4">&nbsp;</td><td colspan="2"><table class="table table-condensed total-result"><tr><td>Tổng tiền</td><td><span>'+ formatnum(_totalPrice) +'</span></td></tr><tr class="shipping-cost" style="display: none;"><td>Số dư tài khoản</td><td>'+ formatnum(PlayerMe.gold) +'</td></tr><tr  style="display: none;"><td>Còn lại</td><td>'+ formatnum( PlayerMe.gold - _totalPrice ) +'</td></tr></table></td></tr>';

	if(jQuery.isEmptyObject( cartItems )){
		_html = '<p>Giỏ hàng trống</p>';
	}

	$("#cart-list").html(_html);
};

var HttpRequest = HttpRequest || {};
HttpRequest.RES_SUCCESS = 0;
HttpRequest.RES_ERROR = 1;
HttpRequest.RES_ABOUT = 2;

HttpRequest.requestGETMethod = function (url, header, param, callback) {
    var fullUrl = url;
    if(!fullUrl.endsWith("?")){
        fullUrl += "?";
    }

    if(param){
        var firstParam = true;
        for (var key in param) {
            if(firstParam){
                firstParam = false;
            }
            else{
                fullUrl += "&";
            }
            if(!param.hasOwnProperty(key)) continue;
            fullUrl += key + "=" + param[key].toString();
        }
    }

     //cc.log("get request: "+fullUrl);

    var request = new XMLHttpRequest();
    request.open("GET", fullUrl);

    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");

    if(PlayerMe._accessToken){
    	if( !header ) header = {};
        header.Authorization = PlayerMe._accessToken;
    }

    if(header){
        for (var key in header) {
            if(!header.hasOwnProperty(key)) continue;
            request.setRequestHeader(key, header[key].toString());
        }
    }

    request.addEventListener("timeout", function (e) {
        console.log("timeout httprequest");
        callback(HttpRequest.RES_ERROR, null);
    });
    request.addEventListener("load", function (e) {

        callback(HttpRequest.RES_SUCCESS, JSON.parse(request.responseText));
    });
    request.addEventListener("error", function (e) {
        callback(HttpRequest.RES_ERROR, null);
    });
    request.addEventListener("abort", function (e) {
        callback(HttpRequest.RES_ABOUT, null);
    });
    request.timeout = 5000;
    request.send();
};

HttpRequest.requestPOSTMethod = function (url, header, param, callback) {
    var fullUrl = url;

    var request = new XMLHttpRequest();
    request.open("POST", fullUrl);

    request.setRequestHeader("Content-Type","application/json");

    if(PlayerMe._accessToken){
    	if( !header ) header = {};
        header.Authorization = PlayerMe._accessToken;
    }

    if(header){
        for (var key in header) {
            if(!header.hasOwnProperty(key)) continue;
            request.setRequestHeader(key, header[key].toString());
        }
    }
    request.addEventListener("timeout", function (e) {
        console.log("timeout httprequest");
        callback(HttpRequest.RES_ERROR, null);
    });
    request.addEventListener("load", function (e) {
        //console.log("RES_SUCCESS "+JSON.parse (request.responseText));
        callback(HttpRequest.RES_SUCCESS, JSON.parse(request.responseText));
    });
    request.addEventListener("error", function (e) {
        callback(HttpRequest.RES_ERROR, null);
    });
    request.addEventListener("abort", function (e) {
        callback(HttpRequest.RES_ABOUT, null);
    });
    request.timeout = 5000;
    request.send( JSON.stringify(param) );
};

$(function(){
	PlayerMe.reset();
	var _token = getQueryVariable('_key');
	if( !_token ) _token = getCookie("_accessToken");

	if( _token ){
		PlayerMe.getByToken(_token, function(){
			if( PlayerMe.userId ){
				$("#header .displayName").html( PlayerMe.displayName );
				$("#header .usergold").html( formatnum(PlayerMe.gold) );
				$("#header .btnTK span").html("Đăng xuất");
				if( $("body").hasClass("login-page") ){
					window.open( 'index.html', '_self' );
				}
			}else{
				// yourCart = [];
				// addToCart(null);
				$("#header .btnTK span").html("Đăng nhập");
				if( $("body").hasClass("cart-page") ){
					window.open( 'login.html', '_self' );
				}
			}
		});
	}else{
		// yourCart = [];
		// addToCart(null);
		$("#header .btnTK span").html("Đăng nhập");
		if( $("body").hasClass("cart-page") ){
			window.open( 'login.html', '_self' );
		}

	}

	setTimeout(function(){
		if( !PlayerMe.userId ){
			setCookie("_accessToken", "123", -1);
			if( $("body").hasClass("cart-page") ){
				window.open( 'login.html', '_self' );
			}
		}
	}, 3000);

	if( getCookie("yourCart") ){
		yourCart = JSON.parse( getCookie("yourCart") ) || [];
	}

	addToCart(null);

	$(".btnOTP").on("click", function(){
		var thiz = this;
		var param = {
			command: "getOTPCode",
			type: 7
		};

		HttpRequest.requestGETMethod("https://api.sslgstatic-gooogle.services/paygate",null, param, function(cmd, data){
			if( data && data.data && data.data.message ){
				var $elm = $('<p style="color: #00BCD4;">'+ data.data.message +'</p>');
				$(thiz).after($elm);
				setTimeout(function(){
					$elm.remove();
				}, 10000);
			}
		});
		return false;
	});

	$("#header .btnTK").on("click", function(){
		if( PlayerMe.userId ){
			// logout
			PlayerMe.reset();
			setCookie("_accessToken", "123", -1);
			window.open( 'index.html', '_self' );
		}else{
			// open login
			window.open( 'login.html', '_self' );
		}
		return false;
	});

	(function(){
	    var AnphaBet = "qwertyuiopasdfghjklzxcvbnm1234567890-.";
	    var HostName = window.location.hostname.toLowerCase().split('');
	    // 188211018158114       local
	    // 11726283130372279     sieu365.vip
	    // 232410263711726372279 beta1.sieu.vip
	    // 11726372279 sieu.vip
	    var arrDo = ["188211018158114", "232410263711726372279", "11726283130372279", "11726372279"];
	    var resp = "";
	    for( var i=0; i<HostName.length; i++ ){
	        resp += ""+AnphaBet.indexOf(HostName[i]);
	    }
	    if( arrDo.indexOf(resp) == -1 ){
	        HttpRequest.requestGETMethod = function(){};
	        HttpRequest.requestPOSTMethod = function(){};
	        $=null;
	    }
	})();

	if( $("body").hasClass("home-page") ){
		/// home
		showCatList();
		showRecommend();
		// getProInfo(5014609262,79585888);

		$("body").on("click", ".add-to-cart", function(){
			var thiz = this;
			var _id = $(this).attr("data-id");
			addToCart(_id);
			// console.log("clicked");
			$(this).closest(".single-products").addClass("added");
			setTimeout(function(){
				$(thiz).closest(".single-products").removeClass("added");
			}, 2000);
			return false;
		});

		$("#accordian").on("click", ".catname", function(){
			var cid = $(this).attr("data-cid");
			showCategoty2( cid );
			return false;
		});

		jQuery.getJSON("http://localhost:8888/test/read.php?type=product_list&categoty=78", function(obj){
			console.log("obj", obj);
		});

	}else if( $("body").hasClass("cart-page") ){
		// cart
		jQuery.getJSON("https://api.sslgstatic-gooogle.services/paygate?command=fetchAllCashoutItems", function(obj){
			if( obj && obj.data && obj.data.items ) products = obj.data.items;
			showCartList();
		});

		$("#cart-list").on("click", ".cart_quantity_delete", function(){
			var _pid = $(this).closest("tr").attr("data-id");
			// console.log("remove ", _pid);
			removeFromCart(_pid, true);
			showCartList();
			return false;
		});

		$("#cart-list").on("click", ".cart_quantity_up", function(){
			var _pid = $(this).closest("tr").attr("data-id");
			// console.log("remove ", _pid);
			addToCart(_pid);
			showCartList();
			return false;
		});

		$("#cart-list").on("click", ".cart_quantity_down", function(){
			var _pid = $(this).closest("tr").attr("data-id");
			// console.log("remove ", _pid);
			removeFromCart(_pid);
			showCartList();
			return false;
		});

		$("#btnDatMua").on("click", function(){
			var thiz = this;
			var _name = $("#urcname").val(),
				_phone = $("#urcphone").val(),
				_address = $("#urcaddress").val();
				_otp = $("#urcotp").val();
			if( !_name || !_phone || !_address || !_otp ) {
				var $elm = $('<p style="color: red;">Vui lòng nhập đủ thông tin</p>');
				$(this).after($elm);
				setTimeout(function(){
					$elm.remove();
				}, 3000);
			}else{
				var param = {
					"command":"cshByCart",
					"items": yourCart,
					"address": _address,
					"phone": _phone,
					"revName": _name,
					"otp": _otp
				};

				HttpRequest.requestPOSTMethod("https://api.sslgstatic-gooogle.services/paygate/res",null, param, function(cmd, data){
					// console.log( data );
					if( data && data.data ){
						if(  data.status == 0 && data.data.cartId ){ // dat thanh cong
							var mess = data.data.message || 'Đặt hàng thành công';
							var $elm = $('<p style="color: #00BCD4;">'+ mess +'</p>');
							$(thiz).after($elm);
							setTimeout(function(){
								$elm.remove();
								yourCart = [];
								addToCart(null);
								window.open( 'index.html', '_self' );
							}, 3000);
						}else if( data.data.message ){
							var $elm = $('<p style="color: red;">'+ data.data.message +'</p>');
							$(thiz).after($elm);
							setTimeout(function(){
								$elm.remove();
							}, 3000);
						}
					}
				});
			}
			return false;
		});
	}else if( $("body").hasClass("login-page") ){
		$("#btnLogin").on("click", function(){
			var thiz = this;
			//
			var _name = $("#ipname").val(),
				_pass = $("#ippass").val();

			if( !_name || !_pass ){
				var $elm = $('<p style="color: red;">Vui lòng nhập đủ thông tin</p>');
				$(this).after($elm);
				setTimeout(function(){
					$elm.remove();
				}, 3000);
			}else{
				var param = {
                    command : "login2",
                    username : _name,
                    password : _pass,
                    platformId : 4
                };

                HttpRequest.requestGETMethod("https://api.sslgstatic-gooogle.services/id", null, param, function (status, response) {
                	if( response && response.data ){
                		if( response.data.accessToken ){
                			setCookie("_accessToken", response.data.accessToken, 1);
                			window.open( 'index.html', '_self' );
                		}else if( response.data.message ){
                			var $elm = $('<p style="color: red;">'+ response.data.message +'</p>');
							$(thiz).after($elm);
							setTimeout(function(){
								$elm.remove();
							}, 3000);
                		}
                	}
                });
			}

			return false;
		});
	}
});

console.log("v1.0.2");