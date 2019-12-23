$(function(){
	if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
		$('body').addClass("isFirefox");
	}

	$(".btn-dangkyngay").on("click", function(){
		$("#form-lienhe").show();
		return false;
	});
	$("#form-lienhe .btn-close").on("click", function(){
		$("#form-lienhe").hide();
		return false;
	});
	$(".btn-dieukhoan").on("click", function(){
		$("#dieu-khoan").show();
		return false;
	});
	$("#dieu-khoan .btn-close").on("click", function(){
		$("#dieu-khoan").hide();
		return false;
	});
});

