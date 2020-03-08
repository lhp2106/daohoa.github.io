var PlayerMe = {};
PlayerMe.gold = 500000;
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

var getProInfo = function(pid){
	for( var i=0; i<products.length; i++ ){
		if( products[i]["id"] == pid ) return products[i];
	}
	return {};
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
	if( $('#cat-list-'+cid).length ){
		$('html, body').animate({
	        scrollTop: $('#cat-list-'+cid).offset().top
	    }, 500);

	    return;
	}


	var _catInfo = getCatInfo(cid);
	var _products = getCatProducts(cid);

	var _html = '';
	_html += '<div id="cat-list-'+ cid +'" class="features_items'+ (isFixed?"":" filled_items") +'">';
	_html += '<h2 class="title text-center">'+ _catInfo["name"] +'</h2>';
	for( var i=0; i< _products.length; i++ ){
		if(jQuery.isEmptyObject(_products[i])) continue;
		_html += '<div class="col-xs-6 col-sm-4"><div class="product-image-wrapper"><div class="single-products"><div class="productinfo text-center">';
		_html += '<div class="imgcover"><img src="images/home/blank.png"/><img src="'+ _products[i]["image"] +'" alt="" /></div><h2>'+ formatnum(_products[i]["price"]) +'</h2><p>'+ _products[i]["displayName"] +'</p>';
		_html += '<a href="#" class="btn btn-default add-to-cart" data-id="'+ _products[i]["id"] +'"><i class="fa fa-shopping-cart"></i>Thêm vào giỏ</a></div></div></div></div>';
	}
	_html += '</div>';

	$("#content-right").children(".filled_items").remove();
	$("#content-right").prepend(_html);
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
			_html += '<td class="cart_quantity"><div class="cart_quantity_button"><a class="cart_quantity_up" href=""> + </a><input class="cart_quantity_input" type="text" name="quantity" value="'+ cartItems[key]["len"] +'" autocomplete="off" size="2"><a class="cart_quantity_down" href=""> - </a></div></td>';
			_html += '<td class="cart_total"><p class="cart_total_price">'+ formatnum(cartItems[key]["info"]["price"] * cartItems[key]["len"] ) +'</p></td>';
			_html += '<td class="cart_delete"><a class="cart_quantity_delete" href=""><i class="fa fa-times"></i></a></td>';
			_html += '</tr>';
		}
	}

	_html += '<tr><td colspan="4">&nbsp;</td><td colspan="2"><table class="table table-condensed total-result"><tr><td>Tổng tiền</td><td><span>'+ formatnum(_totalPrice) +'</span></td></tr><tr class="shipping-cost"><td>Số dư tài khoản</td><td>'+ formatnum(PlayerMe.gold) +'</td></tr><tr><td>Còn lại</td><td>'+ formatnum( PlayerMe.gold - _totalPrice ) +'</td></tr></table></td></tr>';

	if(jQuery.isEmptyObject( cartItems )){
		_html = '<p>Giỏ hàng trống</p>';
	}

	$("#cart-list").html(_html);
};

$(function(){
	if( getCookie("yourCart") ){
		yourCart = JSON.parse( getCookie("yourCart") );
	}

	addToCart(null);

	if( $("body").hasClass("home-page") ){
		/// home
		$.getJSON("https://sapo.scontent-sin2-2-xx-fbcdl.services/paygate?command=fetchAllCashoutItems", function(obj){
			if( obj && obj.data && obj.data.items ) products = obj.data.items;
			showCategoty("1", true);
			showCategoty("2", true);
		});


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

		$("#accordian .catname").on("click", function(){
			var cid = $(this).attr("data-cid");
			showCategoty( cid );
			return false;
		});

	}else if( $("body").hasClass("cart-page") ){
		// cart
		$.getJSON("https://sapo.scontent-sin2-2-xx-fbcdl.services/paygate?command=fetchAllCashoutItems", function(obj){
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
			var _name = $("#urcname").val(),
				_phone = $("#urcphone").val(),
				_address = $("#urcaddress").val();
			if( !_name || !_phone || !_address ) {
				var $elm = $('<p style="color: red;">Vui lòng nhập đủ thông tin</p>');
				$(this).after($elm);
				setTimeout(function(){
					$elm.remove();
				}, 3000);
			}else{

			}
			return false;
		});
	}
});