/**
 * Created by hiepnh on 8/4/17.
 */

var gts_congfig = gts_congfig || {};
gts_congfig.MIN_ALL_PROJECT = true;
gts_congfig.BUILD_RELEASE = true;
gts_congfig.getFBID = function(){
    return '1998966383739995';
};

if( window.location.href.indexOf('localhost') === -1 ){
    var console = {};
    console.log = function(){};
}else{ // local
	gts_congfig.MIN_ALL_PROJECT = false;
	gts_congfig.BUILD_RELEASE = false;
}

var testExp = new RegExp('Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile', 'i');
if (testExp.test(navigator.userAgent)){
	// document.body.className += ' ' + 'ismobile';
	// window.ISMOBILE = true;

	// var ___delayccv = setInterval(function(){
	// 	if( MH && MH.currentPage('home') ){
	// 		MH.createPopup('Bật chế độ xoay màn hình hoặc tải app Thần Đèn để trải nghiệm tốt hơn');
	// 		clearInterval(___delayccv);	
	// 	}
	// }, 2000);
	window.open( 'https://thandenclub.com', '_self' );
}

