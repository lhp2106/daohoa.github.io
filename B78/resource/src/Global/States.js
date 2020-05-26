/**
 * Created by hiepnh on 4/27/17.
 */
var GAME_STATE = GAME_STATE || {};
GAME_STATE.WAIT_PLAYER = 0;
GAME_STATE.CHOOSE_STILT = 1;
GAME_STATE.CHOOSE_HOST = 2;
GAME_STATE.CHIA_BAI = 3;
GAME_STATE.PLAYING = 4;
GAME_STATE.SHOW_KQ = 5;


var state_player = state_player || {};
state_player.NOTHING = 0;
state_player.READY = 1;
state_player.CHON_CAI = 2;
state_player.BAT_BAO = 3;
state_player.U = 4;
state_player.BO_LUOT = 5;
state_player.HUY_BAO = 6;
state_player.BAO_SAM = 7;
state_player.DANG_XEM = 8;
state_player.DANG_XEP_BINH = 9;
state_player.XEP_XONG_BINH = 10;
state_player.AN_CAY_CHOT = 19;
state_player.MOM = 20;

var IDE_GAME_KICK = 3;