$(function(){
	if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
		$('body').addClass("isFirefox");
	}
	$("#footer").append($(window).width());
});

