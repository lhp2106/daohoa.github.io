var Constant = Constant || {};
Constant.SERVER_IMG = '/';//http://acs.apivuatop.info/';


Constant.ERROR_LEAVE_ROOM = {
    1:{msg:'Có sự cố. Bạn bị thoát khỏi phòng'},//UNKNOWN
    2:{msg:'Bạn bị mời ra khỏi phòng'},//kick
    3:{msg:'Bạn đã đăng xuất'},//log out
    4:{msg:'Bạn thoát do đăng nhập \ntừ thiết bị khác'},// kick other login
};
Constant.ERROR_STR = {
    100:{msg:'Phòng đã đầy'},
    101:{msg:'Bạn đã ở trong phòng này rồi'},
    102:{msg:'Phòng không tồn tại'},
    103:{msg:'Sai mật khẩu'},
    104:{msg:'Phòng đã bị hủy'},
    150:{msg:'Không đủ tiền vào phòng'},
    151:{msg:'Phòng đã đủ người'},
    152:{msg:'Bạn không thể vào phòng này do đang ở phòng khác'},
    153:{msg:'Bạn không thể rời phòng khi đang chơi'},
    154:{msg:'Lỗi hệ thống'}
};

Constant.CONSTANT = {
     ZONE_NAME  : 'Simms',
     ZONE_NAME_MINI_GAME : 'MiniGame',
     ZONE_NAME_TOP_HU : 'MiniGameLobby',
     WEB_SOCKET : 'ws://115.84.179.241:8892/ws',
     PING_DELAY : 5000,//5s
     SIGNATURE  :'signature',
     INFO       :'info',
     PLATFORM   : 4, // 4 =  WEB, 1:
     CMD        : 'cmd'
};
Constant.CMD_RESULT = {
    USER_JOIN_OUT  		: 200,
    ROOM_INFO      		: 202,
    ROOM_MASTER_CHANGE     : 203,//255
    DEAL_CARD              : 250,//
    CHANGE_TURN            : 251,
    TOI_TRANG              : 252,//PHAT BAI TAT CA DEU LA COUPLE => WIN LUON
    DANH_BAI               : 253,
    REJECT_TURN            : 254,
    ERROR                  : 1,
    KICK_PLAYER            : 3,
    PLAYER_READY           : 5,
    LIST_ROOM      		: 300,
    LIST_INVITE     		: 303,
    SEND_INVITE     		: 304,
    RECEIVE_INVITE     	: 305,
    OBSERVER_INVITE        : 306,// SETING CO NHAN LOI MOI` CHOI HAY KO
    FAST_PLAY              : 307,
    JOIN_ROOM      		: 308,
    //  WEB_SOCKET : 'ws://115.84.179.241:8892/ws',
};

 Constant.GAME_ID = {
    TLMN  : 1,
    SAM : 2,
    BACAY : 3,
    MAUBINH : 4,
    LIENG : 5,
    POKER : 6,
    XITO : 7,
    PHOM : 8,
    XOCDIA : 9,
	CHAN:20
};
Constant.GAME_ID_DONE = [1,2,3,4,5,6,7,8,9, 20];//20

Constant.GAME_ID_ARRAY = [
    Constant.GAME_ID.SAM,
    Constant.GAME_ID.TLMN ,
    Constant.GAME_ID.MAUBINH,
    Constant.GAME_ID.BACAY,
    Constant.GAME_ID.POKER,
    Constant.GAME_ID.LIENG,
    Constant.GAME_ID.PHOM,
    Constant.GAME_ID.XITO,
    Constant.GAME_ID.CHAN,

    Constant.GAME_ID.XOCDIA,


];

Constant.GAME_NAME_ARRAY = [// name theo id tuong ung tren GAME_ID_ARRAY
	'',// vi GAME_ID start from 1
    'Tiến lên MN' ,
	'Sâm',
	'Ba Cây',
	'Mậu Binh',
	'Liêng',
	'Poker',
	'Xì Tố',
	'Phỏm',
	'Xóc Đĩa'
];
Constant.GAME_NAME_ARRAY[20] = 'Chắn';

/*Constant.GAME_STATE = {
     WAITING_USER  : 1,// 
     WAITING_USER_READY : 2,// 
     READY_TO_START : 3,// 
     PLAYING  :4, // 
     ANIM_SHOW_RESULT:5
     
};*/
Constant.PLAYER_STATE = {
	 NONE : 0,
     DANH_BAI  : 1,// 
     BO_LUOT : 2,// 
     DANG_CO_LUOT : 3,// 
     
};
Constant.ROOM = {
    ROOM_ID  : 'rid',
    ROOM_NAME  : 'rn',
    MAX_USER  : 'Mu',
    USER_COUNT  : 'uC',
    ZONE_NAME  : 'zn',
    SERVER_ID  : 'sid',
    MIN_MONEY  : 'mM',
	MUC_CUOC   : 'b'
};

Constant.ASSET_ID = {
     GOLD  : 1,//
     CHIP : 2
};
Constant.CONNECT_TYPE = {
     NORMAL  : 0,// 
     RECONNECT : 1,// bi mat ket noi, ket noi lai
     CHANGE_RADOM_SERVER : 2,// ket noi den server bat ki trong cac server hien co
     CHANGE_SERVER_SPECIFC  :3 // ket noi den 1 sever chi dinh. case : vao phong` nao do, hoac vao server nhat dinh
     
};
Constant.PLATFORM = {
	 IOS     : 1,
     ANDROID : 2,
	 WP      :3,
	 WEB     : 4,
    //  WEB_SOCKET : 'ws://115.84.179.241:8892/ws',
};

Constant.OBSERVER_EVENT = {
     ON_CONNECTED_WS  : 'ON_CONNECTED_WS',
     ON_LOAD_CONFIG  : 'ON_LOAD_CONFIG',
     ON_GET_SIGNATURE : 'ON_GET_SIGNATURE',
     ON_REGISTER_SUCCESS: 'ON_REGISTER_SUCCESS',
     ON_LOGIN:'onLogin',
     ON_LOGOUT:'onLogout',
	 ON_JOINROOM:'onJoinRoom',
	 ON_LEAVEROOM:'onLeaveRoom',
     ON_PING:'onPing',
     ON_ROOM_PLUGIN_MSG:'onRoomPluginMessage',
     ON_CLOSE:'onClose',
     ON_ERROR:'onError',
     ON_SEND_ERROR:'onSendError',
	 ON_UPDATE_DISPLAYNAME : 'ON_UPDATE_DISPLAYNAME'
};
 Constant.STATUS_STR = {
     0:{msg:'Thành công'},
     1:{msg:'Lỗi hệ thống'},
     100:{msg:'Sai mật khẩu'},
     101:{msg:'Tài khoản không tồn tại'},
     201:{msg:'Phải đánh bộ bài nhỏ nhất'},
     202:{msg:'Tài khoản đã tồn tại'},
     203:{msg:'Tên hiển thị đã đươc dùng'},
     204:{msg:'Tên nhạy cảm hoặc có chứa kí tự đặc biệt'},
     205:{msg:'Mật khẩu phải bao gồm cả chữ và số'},
     206:{msg:'Tên tài khoản quá ngắn'},
     207:{msg:'Tên hiển thị trùng tên đăng nhập'},
     500:{msg:'Token hết hạn. Vui lòng đăng nhập lại'},
     701:{msg:'Mã capcha sai'},
     702:{msg:'Mã capcha sai hoặc hết hạn'},
     703:{msg:'Mã capcha sai hoặc hết hạn'}
 };
 Constant.STATUS = {
     SUCCESS  : 0,
     SYS_ERROR  : 1,
     WRONG_PASS : 100,
     USER_NOT_EXIST  : 101,
     USE_OTP  : 110,
     IF_NOT_ALLOW  : 201,
     USER_EXIST : 202,
     DISPLAY_NAME_EXIST : 203,
     USER_NAME_TUC_TIU : 204,    // username chữa nội dung bị cấm (tục tĩu)
     PASS_TOO_EASY : 205, //Passsword quá dễ đoán
     USER_TOO_SHORT : 206, //user name toi thieu 6 ky tu
	 USER_SAME_DISPLAY : 207,
	 ACCES_TOKEN_EXPIRE : 500
};

Constant.VIP_LVL = [// name theo id tuong ung tren GAME_ID_ARRAY
    // vi GAME_ID start from 1
    'Thường' ,
    'Đồng',
    'Bạc',
    'Vàng',
    'Kim Cương'

];
Constant.CHAT_TEXT = [
    'Nhanh lên nào!',
    'Đen vãi T.T' ,
    'Xin lỗi đời quá đen',
    'Sẵn sàng đi cưng',
    'Nhục rồi',
    'Chơi đi anh, ngại gì',
    'Cho mượn tờ báo, lâu quá bạn ơi',
    'Tiền thì anh không thiếu!!!',
    'Từ từ Pa, làm gì máu vậy',
    'Tài năng không có, thì khó tiến xa',
    'Tài không đợi tuổi, hehe',
    'Tuổi gì mà bắt',
    'Quân tử trả thù 10 năm chưa muộn !!!',
    'Chú còn non và xanh lắm',
 
];
Constant.GAME_ID = {
    TLMN  : 1,
    SAM : 2,
    BACAY : 3,
    MAUBINH : 4,
    LIENG : 5,
    POKER : 6,
    XITO : 7,
    PHOM : 8,
    XOCDIA : 9,
    CHAN:20
};

Constant.BAUCUA_ID = {
    GA  : 1,
    CA : 2,
    TOM : 3,
    CUA : 4,
    BAU : 5,
    HUOU : 6
};