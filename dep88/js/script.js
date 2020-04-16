$(function(){
	var $mess = $('.mess');
	var delayClose = null;
	var notify = function(txt, type){
		if( !type ) type = 'warning';
		else type = 'success';

		clearTimeout(delayClose);
		$mess.attr('data-type', type).html('<p>'+ txt +'</p>').fadeIn();
		delayClose = setTimeout(function(){
			$mess.fadeOut();
		}, 3000);
	};

	var count = 1;
	$('.btn-dangky').off('click').on('click', function(){
		count++;
		if( count%2==0 ) notify('Vui lòng nhập đủ thông tin');
		else notify('Đăng ký thành công', 1);
		return false;
	});
});

