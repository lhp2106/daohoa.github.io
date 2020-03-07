var allProducts = [];
var yourCart = [];
var addToCart = function(pid){
	yourCart.push( pid );
	$("#header .your-cart .count").html(yourCart.length);
};

var loadCategory = function(cid){
	$("#content-right").children(".filled_items").remove();
	var _html = '<div class="features_items filled_items"></div>';

	$("#content-right").prepend(_html);
};

$(function(){
	$.getJSON("https://sapo.scontent-sin2-2-xx-fbcdl.services/paygate?command=fetchAllCashoutItems", function(obj){
		if( obj && obj.data && obj.data.items ) allProducts = obj.data.items;
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
});