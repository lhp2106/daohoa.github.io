var GameMng = GameMng || {};
/**
 *
 * khi click vaof icon game trong 10 game thi phai setCurrentGameId
 */
GameMng.setCurrentGameId = function (gID) {
    cc.Global.gameId = gID;
};
/**
 *
 * @param type MoneyType.Chip / MoneyType.Gold;
 */
GameMng.setMoneyType = function (type) {
    cc.Global.moneyType  = type;
};

