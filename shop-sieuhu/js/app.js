var APPNAME = 'slotvipprod';
var APPID = '';
var BASE_URL = 'https://configurator.sslgstatic-gooogle.services';
var API_Prefix = 'https://api.sslgstatic-gooogle.services';
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

		HttpRequest.requestGETMethod(API_Prefix+"/asset",null, param, function(cmd, data){
			if(data && data.data && data.data.userAsset){
				PlayerMe.gold = data.data.userAsset.gold;
				callback();
			}
		});
	};

	HttpRequest.requestGETMethod(API_Prefix+"/id",null, {command : "getAccessTokenInfo"}, function(cmd, data){
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

var productCache = [
	{
	    "Name": "Loa Bluetooth A10 mini",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/ba9f1f682ebbf0fa1ce47a626e77a77a.jpg",
	    "Price": "150000",
	    "amount": "150000",
	    "category": "Phụ kiện "
	},{
	    "Name": "Loa Bluetooth Led",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/c6e5657994d4df9af96bf777fa44e873.jpg",
	    "Price": "150000",
	    "amount": "150000",
	    "category": "Phụ kiện "
	}, {
	    "Name": "Mic Karaoke",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/mic-bluetooth-X6.jpg",
	    "Price": "350000",
	    "amount": "350000",
	    "category": "Phụ kiện "
	}, {
	    "Name": "Máy ảnh Lomo dưới nước",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/661cfbf236ce7fa4feef196cbbe28746.jpg",
	    "Price": "260000",
	    "amount": "260000",
	    "category": "Máy ảnh "
	}, {
	    "Name": "Máy ảnh Polaroid",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/may-anh-chup-lay-ngay-fujifilm-instax-mini-25.jpg",
	    "Price": "3750000",
	    "amount": "3750000",
	    "category": "Máy ảnh "
	}, {
	    "Name": "Thẻ nhớ 32GB",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/592f032539e89553ded8f1d3cee98ef0.jpg",
	    "Price": "200000",
	    "amount": "200000",
	    "category": "Phụ kiện "
	}, {
	    "Name": "Thẻ nhớ 16GB",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/Th-Nh-16Gb-Class-10-Tran.jpg",
	    "Price": "180000",
	    "amount": "180000",
	    "category": "Phụ kiện "
	}, {
	    "Name": "Thẻ nhớ 64GB",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/binh-giu-nhiet-500ml-dmx-002-1--300x300.jpg",
	    "Price": "260000",
	    "amount": "260000",
	    "category": "Phụ kiện "
	}, {
	    "Name": "Tai nghe XIAOMI ",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-48-36.jpg",
	    "Price": "200000",
	    "amount": "200000",
	    "category": "Phụ kiện "
	}, {
	    "Name": "Cáp chuyển Type C - Audio 3.5mm",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/tai-xung.jpg",
	    "Price": "170000",
	    "amount": "170000",
	    "category": "Phụ kiện "
	}, {
	    "Name": "Giá đỡ điện thoại",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-48-17.jpg",
	    "Price": "330000",
	    "amount": "330000",
	    "category": "Phụ kiện "
	}, {
	    "Name": "Bộ kẹp đỡ điện thoại",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-48-14.jpg",
	    "Price": "150000",
	    "amount": "150000",
	    "category": "Phụ kiện "
	}, {
	    "Name": "Túi chống nước",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-48-12.jpg",
	    "Price": "70000",
	    "amount": "70000",
	    "category": "Phụ kiện "
	}, {
	    "Name": "Cáp sạc iPhone Anker",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-48-10.jpg",
	    "Price": "240000",
	    "amount": "240000",
	    "category": "Phụ kiện "
	}, {
	    "Name": "Sạc Anker SMART MINI 2",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-47-42.jpg",
	    "Price": "225000",
	    "amount": "225000",
	    "category": "Sạc dự phòng"
	}, {
	    "Name": "Sạc Anker SPEED 5",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-47-39.jpg",
	    "Price": "1200000",
	    "amount": "1200000",
	    "category": "Sạc dự phòng"
	}, {
	    "Name": "Đồng hồ thể thao",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/dong-ho-the-thao-doi-skmei-1811.jpg",
	    "Price": "200000",
	    "amount": "200000",
	    "category": "Đồng hồ"
	}, {
	    "Name": "Đồng hồ FOURRON JAPAN",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-48-32.jpg",
	    "Price": "300000",
	    "amount": "300000",
	    "category": "Đồng hồ"
	}, {
	    "Name": "Đồng hồ  SKMEI THÉP",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-48-28.jpg",
	    "Price": "500000",
	    "amount": "500000",
	    "category": "Đồng hồ"
	}, {
	    "Name": "Đồng hồ SKMEI Thể Thao",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-48-21.jpg",
	    "Price": "260000",
	    "amount": "260000",
	    "category": "Đồng hồ"
	}, {
	    "Name": "Đồng hồ Halei",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-48-26.jpg",
	    "Price": "275000",
	    "amount": "275000",
	    "category": "Đồng hồ"
	}, {
	    "Name": "Đồng hồ Mặt Rồng 3D",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-48-34.jpg",
	    "Price": "270000",
	    "amount": "270000",
	    "category": "Đồng hồ"
	}, {
	    "Name": "Đồng hồ CRNAIRA JAPAN",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-48-19.jpg",
	    "Price": "230000",
	    "amount": "230000",
	    "category": "Đồng hồ"
	}, {
	    "Name": "Đồng hồ định vị trẻ",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-48-30.jpg",
	    "Price": "500000",
	    "amount": "500000",
	    "category": "Đồng hồ"
	}, {
	    "Name": "Đồng hồ APLE",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-48-23.jpg",
	    "Price": "230000",
	    "amount": "230000",
	    "category": "Đồng hồ"
	}, {
	    "Name": "Đồng hồ thông minh SANDA",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/3aaa39578d0b73b4569977e1c4adfc66.jpg",
	    "Price": "210000",
	    "amount": "210000",
	    "category": "Đồng hồ"
	}, {
	    "Name": "Bình giữ nhiệt 500ml ĐMX ",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/binh-giu-nhiet-500ml-dmx-002-1--110x110.jpg",
	    "Price": "100000",
	    "amount": "100000",
	    "category": "Tiêu dùng"
	}, {
	    "Name": "Set bóng trang trí sinh nhật",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-48-08.jpg",
	    "Price": "170000",
	    "amount": "170000",
	    "category": "Tiêu dùng"
	}, {
	    "Name": "Mật ong Highland Bee 500ml",
	    "IMAGE": "https://uphinh.org/images/2020/03/23/2ba46735664a3a72c129516cc8e1b644.jpg",
	    "Price": "180000",
	    "amount": "180000",
	    "category": "Tiêu dùng"
	}, {
	    "Name": "Bia Tiger Crystal 24l 330ml",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-47-53.jpg",
	    "Price": "370000",
	    "amount": "370000",
	    "category": "Tiêu dùng"
	}, {
	    "Name": "Bia Heineken Silver 24l 330ml",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-47-48.jpg",
	    "Price": "450000",
	    "amount": "450000",
	    "category": "Tiêu dùng"
	}, {
	    "Name": "Strongbow 24l ",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-47-51.jpg",
	    "Price": "425000",
	    "amount": "425000",
	    "category": "Tiêu dùng"
	}, {
	    "Name": "Bỉm Pampers 74M",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-47-37.jpg",
	    "Price": "350000",
	    "amount": "350000",
	    "category": "Tiêu dùng"
	}, {
	    "Name": "Bỉm Pampers 60M",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-47-35.jpg",
	    "Price": "300000",
	    "amount": "300000",
	    "category": "Tiêu dùng"
	}, {
	    "Name": "Bỉm Pampers 44M",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-47-31.jpg",
	    "Price": "230000",
	    "amount": "230000",
	    "category": "Tiêu dùng"
	}, {
	    "Name": "Bỉm Huggies 74M",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-47-29.jpg",
	    "Price": "370000",
	    "amount": "370000",
	    "category": "Tiêu dùng"
	}, {
	    "Name": "Bỉm Huggies 54M",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-47-25.jpg",
	    "Price": "295000",
	    "amount": "295000",
	    "category": "Tiêu dùng"
	}, {
	    "Name": "Bỉm Huggies 40M",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-47-27.jpg",
	    "Price": "221000",
	    "amount": "221000",
	    "category": "Tiêu dùng"
	}, {
	    "Name": "Máy khoan Bosch GBS 550",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-48-47.jpg",
	    "Price": "1260000",
	    "amount": "1260000",
	    "category": "Máy móc"
	}, {
	    "Name": "Máy khoan Bosch GBM 320",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-48-42.jpg",
	    "Price": "720000",
	    "amount": "720000",
	    "category": "Máy móc"
	}, {
	    "Name": "Máy khoan điện Total 280",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-48-46.jpg",
	    "Price": "430000",
	    "amount": "430000",
	    "category": "Máy móc"
	}, {
	    "Name": "Máy khoan Bosch GBS 120LI",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-48-42.jpg",
	    "Price": "2550000",
	    "amount": "2550000",
	    "category": "Máy móc"
	}, {
	    "Name": "Máy khoan PIN DCONG",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-48-44.jpg",
	    "Price": "490000",
	    "amount": "490000",
	    "category": "Máy móc"
	}, {
	    "Name": "Xiaomi MI BAND 4",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-48-40.jpg",
	    "Price": "800000",
	    "amount": "800000",
	    "category": "Đồng hồ"
	}, {
	    "Name": "Gậy Selfie ",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/2596_635445833565279425_hasthumb_1470370575.jpg",
	    "Price": "50000",
	    "amount": "50000",
	    "category": "Phụ kiện "
	}, {
	    "Name": "Ensure GOLD 850g",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-48-04.jpg",
	    "Price": "750000",
	    "amount": "750000",
	    "category": "Sữa "
	}, {
	    "Name": "Pediasure 1.6Kg",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-48-06.jpg",
	    "Price": "1000000",
	    "amount": "1000000",
	    "category": "Sữa "
	}, {
	    "Name": "Ensure GOLD 400g",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-48-02.jpg",
	    "Price": "350000",
	    "amount": "350000",
	    "category": "Sữa "
	}, {
	    "Name": "Glucerna Abbott 850g",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-48-01.jpg",
	    "Price": "750000",
	    "amount": "750000",
	    "category": "Sữa "
	}, {
	    "Name": "Abbott Grow 900g",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-47-57.jpg",
	    "Price": "300000",
	    "amount": "300000",
	    "category": "Sữa "
	}, {
	    "Name": "Abbott Grow GODL 1.7Kg",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-47-55.jpg",
	    "Price": "650000",
	    "amount": "650000",
	    "category": "Sữa "
	}, {
	    "Name": "Anlene GOLD MOVEPRO 1kg",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-47-45.jpg",
	    "Price": "400000",
	    "amount": "400000",
	    "category": "Sữa "
	}, {
	    "Name": "Anlene MOVEPRO 440G",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-47-47.jpg",
	    "Price": "155000",
	    "amount": "155000",
	    "category": "Sữa "
	}, {
	    "Name": "Anlene GOLD MOVEPRO 800G",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-47-47.jpg",
	    "Price": "355000",
	    "amount": "355000",
	    "category": "Sữa "
	}, {
	    "Name": "VINA 1.2GB/30 NGÀY",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/vina.jpg",
	    "Price": "20000",
	    "amount": "20000",
	    "category": "Thẻ Data"
	}, {
	    "Name": "VINA 3GB/30 NGÀY",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/vina.jpg",
	    "Price": "50000",
	    "amount": "50000",
	    "category": "Thẻ Data"
	}, {
	    "Name": "VINA 5GB/30 NGÀY",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/vina.jpg",
	    "Price": "70000",
	    "amount": "70000",
	    "category": "Thẻ Data"
	}, {
	    "Name": "VINA 8GB/30 NGÀY",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/vina.jpg",
	    "Price": "100000",
	    "amount": "100000",
	    "category": "Thẻ Data"
	}, {
	    "Name": "VINA 12GB/30 NGÀY",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/vina.jpg",
	    "Price": "120000",
	    "amount": "120000",
	    "category": "Thẻ Data"
	}, {
	    "Name": "VINA 15GB//30 NGÀY",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/vina.jpg",
	    "Price": "150000",
	    "amount": "150000",
	    "category": "Thẻ Data"
	}, {
	    "Name": "MOBI 1.4GB/30 NGÀY",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/mobi.jpg",
	    "Price": "14000",
	    "amount": "14000",
	    "category": "Thẻ Data"
	}, {
	    "Name": "MOBI 2.8GB/30 NGÀY",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/mobi.jpg",
	    "Price": "28000",
	    "amount": "28000",
	    "category": "Thẻ Data"
	}, {
	    "Name": "MOBI 3.5GB/30 NGÀY",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/mobi.jpg",
	    "Price": "42000",
	    "amount": "42000",
	    "category": "Thẻ Data"
	}, {
	    "Name": "MOBI 5GB/30 NGÀY",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/mobi.jpg",
	    "Price": "56000",
	    "amount": "56000",
	    "category": "Thẻ Data"
	}, {
	    "Name": "MOBI 7GB/30 NGÀY",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/mobi.jpg",
	    "Price": "84000",
	    "amount": "84000",
	    "category": "Thẻ Data"
	}, {
	    "Name": "VIETTEL 1GB/30 NGÀY",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/viettel.jpg",
	    "Price": "40000",
	    "amount": "40000",
	    "category": "Thẻ Data"
	}, {
	    "Name": "VIETTEL 3GB/30 NGÀY",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/viettel.jpg",
	    "Price": "70000",
	    "amount": "70000",
	    "category": "Thẻ Data"
	}, {
	    "Name": "VIETTEL 5GB/30 NGÀY",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/viettel.jpg",
	    "Price": "90000",
	    "amount": "90000",
	    "category": "Thẻ Data"
	}, {
	    "Name": "VIETTEL 8GB/30 NGÀY",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/viettel.jpg",
	    "Price": "125000",
	    "amount": "125000",
	    "category": "Thẻ Data"
	}, {
	    "Name": "VIETTEL 15GB/30 NGÀY",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/viettel.jpg",
	    "Price": "200000",
	    "amount": "200000",
	    "category": "Thẻ Data"
	}, {
	    "Name": "Bình đun nước ST Comet",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-47-23.jpg",
	    "Price": "150000",
	    "amount": "150000",
	    "category": "Gia dụng"
	}, {
	    "Name": "Bếp nướng Sunhouse",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-47-20.jpg",
	    "Price": "450000",
	    "amount": "450000",
	    "category": "Gia dụng"
	}, {
	    "Name": "Máy hút bụi Samsung",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-47-1040b4e92edcf7c39a.jpg",
	    "Price": "1900000",
	    "amount": "1900000",
	    "category": "Gia dụng"
	}, {
	    "Name": "Lò vi sóng Samsung ",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-47-15.jpg",
	    "Price": "5000000",
	    "amount": "5000000",
	    "category": "Gia dụng"
	}, {
	    "Name": "Nồi cơm điện Midea",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-47-13.jpg",
	    "Price": "500000",
	    "amount": "500000",
	    "category": "Gia dụng"
	}, {
	    "Name": "Máy hút bụi Midea",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-47-10.jpg",
	    "Price": "769000",
	    "amount": "769000",
	    "category": "Gia dụng"
	}, {
	    "Name": "Máy say TP Lock&Lock",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/photo_2020-03-20_13-46-58.jpg",
	    "Price": "917000",
	    "amount": "917000",
	    "category": "Gia dụng"
	}, {
	    "Name": "Máy Say sinh tố HappyTime",
	    "IMAGE": "https://uphinh.org/images/2020/03/20/may-xay-sinh-to-sunhouse-htd5113g_002.jpg",
	    "Price": "350000",
	    "amount": "350000",
	    "category": "Gia dụng"
	}, {
	    "Name": "SH 150i",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541477917935_87968963.png",
	    "Price": "130000000",
	    "amount": "130000000",
	    "category": "Xe"
	}, {
	    "Name": "SH 125",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541477917935_87968963.png",
	    "Price": "110500000",
	    "amount": "110500000",
	    "category": "Xe"
	}, {
	    "Name": "Exciter",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541477984332_81672040.png",
	    "Price": "55000000",
	    "amount": "55000000",
	    "category": "Xe"
	}, {
	    "Name": "Vision",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478017456_76409669.png",
	    "Price": "33500000",
	    "amount": "33500000",
	    "category": "Xe"
	}, {
	    "Name": "Iphone XS Max 256GB",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478040597_e619060b.png",
	    "Price": "30000000",
	    "amount": "30000000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Iphone XS Max 64GB",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478040597_e619060b.png",
	    "Price": "26990000",
	    "amount": "26990000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Iphone X 64GB",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478092946_9fe93219.png",
	    "Price": "20000000",
	    "amount": "20000000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Iphone 8 Plus 64GB",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478146028_485f6c9a.png",
	    "Price": "16000000",
	    "amount": "16000000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Samsung Note 9 128GB",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478227716_0cb12d6e.png",
	    "Price": "15000000",
	    "amount": "15000000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Iphone XS Max 512GB",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478040597_e619060b.png",
	    "Price": "33300000",
	    "amount": "33300000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Iphone 8 64GB",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478146028_485f6c9a.png",
	    "Price": "10500000",
	    "amount": "10500000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Iphone 11 Pro 64GB",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478092946_9fe93219.png",
	    "Price": "30990000",
	    "amount": "30990000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Iphone 11 Pro 256GB",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478065101_fcea3d08.png",
	    "Price": "34990000",
	    "amount": "34990000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Iphone Pro Max 512GB",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478040597_e619060b.png",
	    "Price": "43990000",
	    "amount": "43990000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Iphone Pro Max 256GB",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478040597_e619060b.png",
	    "Price": "37990000",
	    "amount": "37990000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Iphone Pro Max 64GB",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478040597_e619060b.png",
	    "Price": "33990000",
	    "amount": "33990000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Samsung Note 9 512GB",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478227716_0cb12d6e.png",
	    "Price": "23800000",
	    "amount": "23800000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Samsung Note 10 Plus",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478227716_0cb12d6e.png",
	    "Price": "27400000",
	    "amount": "27400000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Samsung Note 10 Ram 12",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478227716_0cb12d6e.png",
	    "Price": "25600000",
	    "amount": "25600000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Samsung S9 Plus",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478243153_ce0b85f4.png",
	    "Price": "16800000",
	    "amount": "16800000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Samsung A70",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478243153_ce0b85f4.png",
	    "Price": "8790000",
	    "amount": "8790000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Samsung A50s",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478243153_ce0b85f4.png",
	    "Price": "6290000",
	    "amount": "6290000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Samsung A30s",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478243153_ce0b85f4.png",
	    "Price": "5600000",
	    "amount": "5600000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Iphone 8 Plus 128GB",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478146028_485f6c9a.png",
	    "Price": "18300000",
	    "amount": "18300000",
	    "category": "Điện thoại"
	}, {
	    "Name": "OPP A1K",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478347113_5f7f88d5.png",
	    "Price": "2700000",
	    "amount": "2700000",
	    "category": "Điện thoại"
	}, {
	    "Name": "OPPO A5s",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478347113_5f7f88d5.png",
	    "Price": "3300000",
	    "amount": "3300000",
	    "category": "Điện thoại"
	}, {
	    "Name": "OPPO A5 R4/128GB",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478347113_5f7f88d5.png",
	    "Price": "3990000",
	    "amount": "3990000",
	    "category": "Điện thoại"
	}, {
	    "Name": "OPPO A5 R3/64GB",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478347113_5f7f88d5.png",
	    "Price": "4790000",
	    "amount": "4790000",
	    "category": "Điện thoại"
	}, {
	    "Name": "OPPO A9",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478296732_c63ec11e.png",
	    "Price": "5990000",
	    "amount": "5990000",
	    "category": "Điện thoại"
	}, {
	    "Name": "OPPO Reno 2 8/256GB",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478264072_b1c21e93.png",
	    "Price": "12490000",
	    "amount": "12490000",
	    "category": "Điện thoại"
	}, {
	    "Name": "OPPO Reno",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478264072_b1c21e93.png",
	    "Price": "10990000",
	    "amount": "10990000",
	    "category": "Điện thoại"
	}, {
	    "Name": "OPPO Reno 2F",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478264072_b1c21e93.png",
	    "Price": "7990000",
	    "amount": "7990000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Samsung A71",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478243153_ce0b85f4.png",
	    "Price": "10490000",
	    "amount": "10490000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Samsung A80",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478243153_ce0b85f4.png",
	    "Price": "11500000",
	    "amount": "11500000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Samsung A51",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478243153_ce0b85f4.png",
	    "Price": "7990000",
	    "amount": "7990000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Samsung A20s",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478243153_ce0b85f4.png",
	    "Price": "3990000",
	    "amount": "3990000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Samsung A10s",
	    "IMAGE": "https://api.sslgstatic-gooogle.services/uploads/1541478243153_ce0b85f4.png",
	    "Price": "3390000",
	    "amount": "3390000",
	    "category": "Điện thoại"
	}, {
	    "Name": "An Cung 60v Samsung HQ",
	    "IMAGE": "https://api.chichi.mobi/uploads/1583585854795_6d3ceac0.jpg",
	    "Price": "1000000",
	    "amount": "1000000",
	    "category": "Thực phẩm chức năng"
	}, {
	    "Name": "Camera IP Cube 2MP HIKVISION DS-2CD2421G0-IW",
	    "IMAGE": "https://api.chichi.mobi/uploads/1583586024759_b003ef7b.jpg",
	    "Price": "1590000",
	    "amount": "1590000",
	    "category": "Camera"
	}, {
	    "Name": "Camera EZVIZ CS-CV246 1080P Full HD 2.0 Megapixel",
	    "IMAGE": "https://api.chichi.mobi/uploads/1583586041852_c661be8b.jpg",
	    "Price": "890000",
	    "amount": "890000",
	    "category": "Camera"
	}, {
	    "Name": "Bàn phím Fuhlen L411",
	    "IMAGE": "https://api.chichi.mobi/uploads/1583586211853_1f8deace.jpg",
	    "Price": "200000",
	    "amount": "200000",
	    "category": "Phụ kiện Máy tính"
	}, {
	    "Name": "Chuột gaming Fuhlen L102",
	    "IMAGE": "https://api.chichi.mobi/uploads/1583586223215_9cf4bedc.jpg",
	    "Price": "130000",
	    "amount": "130000",
	    "category": "Phụ kiện Máy tính"
	}, {
	    "Name": "Bàn phím PC Kenoo K6010",
	    "IMAGE": "https://api.chichi.mobi/uploads/1583586234283_eda1480f.png",
	    "Price": "135000",
	    "amount": "135000",
	    "category": "Phụ kiện Máy tính"
	}, {
	    "Name": "Chuột Kenoo M375",
	    "IMAGE": "https://api.chichi.mobi/uploads/1583586242619_abe48929.jpg",
	    "Price": "100000",
	    "amount": "100000",
	    "category": "Phụ kiện Máy tính"
	}, {
	    "Name": "Bao cao su Sagami Extreme",
	    "IMAGE": "https://api.chichi.mobi/uploads/1583589988225_e1f07a94.jpg",
	    "Price": "110000",
	    "amount": "110000",
	    "category": "Tiêu dùng"
	}, {
	    "Name": "Bao cao su Durex Fetherlite Ultima",
	    "IMAGE": "https://api.chichi.mobi/uploads/1583587131046_2cd3e2c2.jpg",
	    "Price": "110000",
	    "amount": "110000",
	    "category": "Tiêu dùng"
	}, {
	    "Name": "Dây sạc iPhone",
	    "IMAGE": "https://api.chichi.mobi/uploads/1583586282455_fe2dd8ff.jpg",
	    "Price": "110000",
	    "amount": "110000",
	    "category": "Phụ kiện điện thoại"
	}, {
	    "Name": "Dây sạc Samsung",
	    "IMAGE": "https://api.chichi.mobi/uploads/1583586297100_59f689ba.jpg",
	    "Price": "100000",
	    "amount": "100000",
	    "category": "Phụ kiện điện thoại"
	}, {
	    "Name": "ĐT Goly BigA",
	    "IMAGE": "https://api.chichi.mobi/uploads/1583586306556_8e8084d2.png",
	    "Price": "300000",
	    "amount": "300000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Goly D3",
	    "IMAGE": "https://api.chichi.mobi/uploads/1583586319460_7562a24c.jpg",
	    "Price": "330000",
	    "amount": "330000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Goly D5",
	    "IMAGE": "https://api.chichi.mobi/uploads/1583586333343_cfcc5207.jpg",
	    "Price": "275000",
	    "amount": "275000",
	    "category": "Điện thoại"
	}, {
	    "Name": "ĐH FNGEEN Thép",
	    "IMAGE": "https://api.chichi.mobi/uploads/1583586340886_724aee78.jpg",
	    "Price": "140000",
	    "amount": "140000",
	    "category": "Đồng hỗ"
	}, {
	    "Name": "Đồng hồ CASIO",
	    "IMAGE": "https://api.chichi.mobi/uploads/1583586349252_370e4838.jpg",
	    "Price": "240000",
	    "amount": "240000",
	    "category": "Đồng hỗ"
	}, {
	    "Name": "Sạc dự phòng Xiaomi Gen 2 10000mAh",
	    "IMAGE": "https://api.chichi.mobi/uploads/1583586357797_67a96c4d.jpg",
	    "Price": "380000",
	    "amount": "380000",
	    "category": "Phụ kiện điện thoại"
	}, {
	    "Name": "Sạc dự phòng Anker 20000mAh",
	    "IMAGE": "https://api.chichi.mobi/uploads/1583586365576_fa1ebd69.jpg",
	    "Price": "1485000",
	    "amount": "1485000",
	    "category": "Phụ kiện điện thoại"
	}, {
	    "Name": "Masstel Fami 9",
	    "IMAGE": "https://api.chichi.mobi/uploads/1583586849241_0b07ce73.png",
	    "Price": "440000",
	    "amount": "440000",
	    "category": "Điện thoại"
	}, {
	    "Name": "Nokia 105",
	    "IMAGE": "https://api.chichi.mobi/uploads/1583586862870_5c20b1c2.png",
	    "Price": "420000",
	    "amount": "420000",
	    "category": "Điện thoại"
	}, {
	    "Name": "DELL LATITUDE 5490",
	    "IMAGE": "https://uphinh.org/images/2020/03/23/1584417914046_7f140a8a.jpg",
	    "Price": "22200000",
	    "amount": "22200000",
	    "category": "Máy tính xách tay"
	}, {
	    "Name": "ASUS VIVOBOOK A512FA",
	    "IMAGE": "https://uphinh.org/images/2020/03/23/1584272985133_b7aea9b5.jpg",
	    "Price": "12100000",
	    "amount": "12100000",
	    "category": "Máy tính xách tay"
	}, {
	    "Name": "HP PAVILION 15-CS2058TX",
	    "IMAGE": "https://uphinh.org/images/2020/03/23/1584273060559_7b837b9a.jpg",
	    "Price": "20200000",
	    "amount": "20200000",
	    "category": "Máy tính xách tay"
	}, {
	    "Name": "HP PAVILION 14-CE2038TU",
	    "IMAGE": "https://uphinh.org/images/2020/03/23/1584417298716_91048148.jpg",
	    "Price": "14490000",
	    "amount": "14490000",
	    "category": "Máy tính xách tay"
	}, {
	    "Name": "HP PAVILION X36014",
	    "IMAGE": "https://uphinh.org/images/2020/03/23/1584272927570_6b7eb091.jpg",
	    "Price": "12890000",
	    "amount": "12890000",
	    "category": "Máy tính xách tay"
	}, {
	    "Name": "ASUS X509FA-EJ101T",
	    "IMAGE": "https://uphinh.org/images/2020/03/23/1584417842904_77cbaee5.jpg",
	    "Price": "12590000",
	    "amount": "12590000",
	    "category": "Máy tính xách tay"
	}, {
	    "Name": "Dell Vostro 3480-70187708",
	    "IMAGE": "https://uphinh.org/images/2020/03/23/1584417914046_7f140a8a.jpg",
	    "Price": "14290000",
	    "amount": "14290000",
	    "category": "Máy tính xách tay"
	}, {
	    "Name": "HP ENVY X360",
	    "IMAGE": "https://uphinh.org/images/2020/03/23/1584417982190_2117b880.jpg",
	    "Price": "21890000",
	    "amount": "21890000",
	    "category": "Máy tính xách tay"
	}, {
	    "Name": "HP Pavilion 15-CS2032TU",
	    "IMAGE": "https://uphinh.org/images/2020/03/23/1584418040840_6eea7180.jpg",
	    "Price": "12290000",
	    "amount": "12290000",
	    "category": "Máy tính xách tay"
	}, {
	    "Name": "Dell Vostro 3580",
	    "IMAGE": "https://uphinh.org/images/2020/03/23/1584418112581_68c98421.jpg",
	    "Price": "13790000",
	    "amount": "13790000",
	    "category": "Máy tính xách tay"
	}, {
	    "Name": "Dell Vostro 3580 (T3RMD2)",
	    "IMAGE": "https://uphinh.org/images/2020/03/23/1584418112581_68c98421.jpg",
	    "Price": "18990000",
	    "amount": "18990000",
	    "category": "Máy tính xách tay"
	}, {
	    "Name": "HP Pavilion 14 CE2034TU",
	    "IMAGE": "https://uphinh.org/images/2020/03/23/1584418706692_d47a77f3.jpg",
	    "Price": "11790000",
	    "amount": "11790000",
	    "category": "Máy tính xách tay"
	}, {
	    "Name": "Dell Inspiron 7591-N5I5591W",
	    "IMAGE": "https://uphinh.org/images/2020/03/23/1584510163425_9ce394fa.jpg",
	    "Price": "26290000",
	    "amount": "26290000",
	    "category": "Máy tính xách tay"
	}, {
	    "Name": "Dell Inspiron 3480 (N4I7116W)",
	    "IMAGE": "https://uphinh.org/images/2020/03/23/1584514720144_74c33ed6.jpg",
	    "Price": "19490000",
	    "amount": "19490000",
	    "category": "Máy tính xách tay"
	}, {
	    "Name": "HP 348 G5 (7XU21PA)",
	    "IMAGE": "https://uphinh.org/images/2020/03/23/1584515233300_44363259.jpg",
	    "Price": "13990000",
	    "amount": "13990000",
	    "category": "Máy tính xách tay"
	}, {
	    "Name": "Asus S531FL (BQ190T)",
	    "IMAGE": "https://uphinh.org/images/2020/03/23/1584516079021_9b621d49.jpg",
	    "Price": "19990000",
	    "amount": "19990000",
	    "category": "Máy tính xách tay"
	}, {
	    "Name": "ASUS VIVOBOOK S15 S530UN",
	    "IMAGE": "https://uphinh.org/images/2020/03/23/1584516079021_9b621d49.jpg",
	    "Price": "21300000",
	    "amount": "21300000",
	    "category": "Máy tính xách tay"
	}, {
	    "Name": "ASUS FX505GE",
	    "IMAGE": "https://uphinh.org/images/2020/03/23/1584271187283_db12ceee.jpg",
	    "Price": "21690000",
	    "amount": "21690000",
	    "category": "Máy tính xách tay"
	}, {
	    "Name": "LENOVO IDEAPAD 330-15IKB",
	    "IMAGE": "https://uphinh.org/images/2020/03/23/1584270960778_4906a7fbdbbe25f480aa94b0.jpg",
	    "Price": "12000000",
	    "amount": "12000000",
	    "category": "Máy tính xách tay"
	}, {
	    "Name": "Macbook Air 13.3 Inch 2017",
	    "IMAGE": "https://uphinh.org/images/2020/03/23/1584266628222_71ede52f.jpg",
	    "Price": "20000000",
	    "amount": "20000000",
	    "category": "Máy tính xách tay"
	}, {
	    "Name": "ASUS X505ZA",
	    "IMAGE": "https://uphinh.org/images/2020/03/23/1584417545224_6ecab309.jpg",
	    "Price": "12500000",
	    "amount": "12500000",
	    "category": "Máy tính xách tay"
}];

var products = [];
var categories = [];

var yourCart = [];

//
//build categories
var __categories = [];
for( var i=0; i<productCache.length; i++ ){
	if( __categories.indexOf( productCache[i]["category"] ) == -1 ){
		__categories.push( productCache[i]["category"] );
		categories.push({id: __categories.length, name: productCache[i]["category"]});
	}
}


//

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

	for( var i=0; i<products.length; i++ ){
		if( products[i].catid == cid ) res.push( products[i] );
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

var getProCacheByName = function(_name){
	for( var i=0; i<productCache.length; i++ ){
		if( productCache[i]["Name"] == _name ){
			return productCache[i];
		}
	}
	return null;
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

var showCategoty = function(cname, isFixed){
	// get cid
	var cid = __categories.indexOf(cname);
	if( cid == -1 ) return;

	if( $('#cat-list-'+cid).length ){
		$('html, body').animate({
	        scrollTop: $('#cat-list-'+cid).offset().top
	    }, 500);

	    return;
	}

	// var _catInfo = getCatInfo(cid);
	var _products = getCatProducts(cid);

	var _html = '';
	var _count = 0;
	var arrHtml = [];

	_html += '<div id="cat-list-'+ cid +'" class="features_items'+ (isFixed?"":" filled_items") +'">';
	_html += '<h2 class="title text-center">'+ cname +'</h2>';

	for( var i=0; i< _products.length; i++ ){
		if(jQuery.isEmptyObject(_products[i])) continue;

		var html = '';

		html += '<div class="col-xs-6 col-sm-4"><div class="product-image-wrapper"><div class="single-products"><div class="productinfo text-center">';
		html += '<div class="imgcover"><img src="images/home/blank.png"/><img src="'+ _products[i]["image"] +'" alt="" /></div><h2>'+ formatnum(_products[i]["price"]) +'</h2><p>'+ _products[i]["displayName"] +'</p>';
		html += '<a href="#" class="btn btn-default add-to-cart" data-id="'+ _products[i]["id"] +'"><i class="fa fa-shopping-cart"></i>Thêm vào giỏ</a></div></div></div></div>';

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

		HttpRequest.requestGETMethod(API_Prefix+"/paygate",null, param, function(cmd, data){
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
		jQuery.getJSON(API_Prefix+"/paygate?command=fetchAllCashoutItems", function(obj){
			if( obj && obj.data && obj.data.items ) products = obj.data.items;

			// thêm catname catid vào product
			for( var i=0; i<products.length; i++ ){
				// var _name = products[i].displayName;
				var cachePro = getProCacheByName( products[i]["displayName"] );
				if( cachePro ){
					products[i]["category"] = cachePro["category"];
					products[i]["catid"] = __categories.indexOf( cachePro["category"] );
				}else{
					products[i]["category"] = "Sản phẩm khác";
					products[i]["catid"] = -1;
					console.log("not found", products[i]);
				}
			}

			showCategoty("Điện thoại", true);
			showCategoty("Phụ kiện ", true);
		});

		// render menu
		var _htmlMenu = '';
		for( var i=0; i<__categories.length; i++ ){
			_htmlMenu += '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a href="#" class="catname" data-cid="'+ i +'" data-cname="'+ __categories[i] +'">'+ __categories[i] +'</a></h4></div></div>';
		}
		$('#accordian').html(_htmlMenu);



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
			// var cid = $(this).attr("data-cid");
			var cname = $(this).attr("data-cname");
			showCategoty( cname );
			return false;
		});

	}else if( $("body").hasClass("cart-page") ){
		// cart
		jQuery.getJSON(API_Prefix+"/paygate?command=fetchAllCashoutItems", function(obj){
			if( obj && obj.data && obj.data.items ) products = obj.data.items;

			// thêm catname catid vào product
			for( var i=0; i<products.length; i++ ){
				// var _name = products[i].displayName;
				var cachePro = getProCacheByName( products[i]["displayName"] );
				if( cachePro ){
					products[i]["category"] = cachePro["category"];
					products[i]["catid"] = __categories.indexOf( cachePro["category"] );
				}else{
					products[i]["category"] = "Sản phẩm khác";
					products[i]["catid"] = -1;
					console.log("not found", products[i]);
				}
			}


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

				HttpRequest.requestPOSTMethod(API_Prefix+"/paygate/res",null, param, function(cmd, data){
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

                HttpRequest.requestGETMethod(API_Prefix+"/id", null, param, function (status, response) {
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

console.log("v1.0.3");