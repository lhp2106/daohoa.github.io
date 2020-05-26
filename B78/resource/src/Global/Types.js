
var Suit = {
    b: 1,   // bich
    t: 2,    // tep
    r: 3, // ro
    c: 4,   // co
};
var SuitName = {
    "1": "b",   // bich
    "2": "t",    // tep
    "3": "r", // ro
    "4": "c"   // co
};
var CARD_COMBO = {
    NORMAL: 0,
    DOI: 1<<1,  
    N_DOITHONG: 1<<2, 
    BO_3: 1<<3, 
    TUQUY: 1<<4, 
    CHUOI_CARD: 1<<5,
    CARD_2: 1 <<6,
	DOI_2: 1<<7 ,
	NORMAL_BIGGER:1<<8,
	NOT_NORMAL:1<<9,
    MAX_DOITHONG: 1<<10, 

};
// var A2_10JQK = 'NAN,A,2,3,4,5,6,7,8,9,10,J,Q,K'.split(',');
var A2_10JQK = 'NAN,1,2,3,4,5,6,7,8,9,10,11,12,13'.split(',');

/**
 * chi get ko set duoc
 * 
 * @class Card
 * @constructor
 * @param {Number} point -
 * @param {Suit} suit
 */
var Types = Types || {};
 Types.getPointAuto = function (card, gameId) {
     if(gameId == Constant.GAME_ID.SAM)return card.point;
     else return card.pointTLMN;
 };
Types.Card =function (point, suit) {
    var _p = point;
    var _pTLMN = (point -2)<= 0 ? (point +13) : point;
    var _pMB = (point -1)<= 0 ? (point +13) : point;
    var _pLieng = point>= 10 ? 0 : point;
    var _suit = suit;
    var _id = (suit - 1) * 13 + (point - 1);
    var _codeCard =  (suit - 1) + 4*(point - 1);
    var _pointName = A2_10JQK[point];
    var _suitName = SuitName[suit];
    var _isCard2 = (_id === 12 || _id === 25 || _id === 38 || _id === 51);
    return {
        point: _p,
        pointTLMN:_pTLMN,
        pointMB: _pMB,
        pointLieng: _pLieng,
        suit : _suit,
        id : _id, //id - possible value 0 -> 51
        codeCard: _codeCard, //idcard - sent to server
        pointName: _pointName,
        suitName:_suitName,
        isCard2:_isCard2,
        toString:    ""+_pointName+""+_suitName

    };
};
