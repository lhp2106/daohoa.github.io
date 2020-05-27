/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

// resource for loading + lobby + popup + tophu ....
var jsList = [
    "src/html/MH.js",
    "src/ui/TopHu.js",
    "src/ui/NewUI.js",
    "src/ui/Marquee.js",
    "src/ui/Header.js",
    "src/ui/Footer.js",
    "src/view/LobbyLayer.js",
    "src/view/MainScene.js"
];

var g_resources = [
    "res/input_default.png",
    "res/header/header-login.png",
    "res/header/header-lobby.png",
    "res/footer/bg.png",
    "res/footer/Dai ly.json", "res/footer/Dai ly.atlas", "res/footer/Dai ly.png",
    "res/popup/BG-popup.png", "res/popup/popup-normal.png", "res/popup/btn_close.png",
    "res/fonts/font-listhu-export.fnt", "res/fonts/font-listhu-export.png",
    "res/fonts/number-header.fnt", "res/fonts/number-header.png",
    "res/tx_card.plist", "res/tx_card.png",
    "res/menu-minigame/minigame-icon.png", "res/menu-minigame/Icon-MiniGame.atlas", "res/menu-minigame/Icon-MiniGame.json", "res/menu-minigame/Icon-MiniGame.png",
    "res/gamelist/Icon-TaiXiu.json", "res/gamelist/Icon-TaiXiu.atlas", "res/gamelist/Icon-TaiXiu.png",
    "res/gamelist/Icon-Minipoker.json", "res/gamelist/Icon-Minipoker.atlas", "res/gamelist/Icon-Minipoker.png",
    "res/gamelist/Icon-BaLa.json", "res/gamelist/Icon-BaLa.atlas", "res/gamelist/Icon-BaLa.png",
    "res/gamelist/Icon-BanCa.json", "res/gamelist/Icon-BanCa.atlas", "res/gamelist/Icon-BanCa.png",
    "res/gamelist/Icon-RungRam.json", "res/gamelist/Icon-RungRam.atlas", "res/gamelist/Icon-RungRam.png",
    "res/gamelist/Icon-TDK.json", "res/gamelist/Icon-TDK.atlas", "res/gamelist/Icon-TDK.png",
    "res/gamelist/Icon-LMHT.json", "res/gamelist/Icon-LMHT.atlas", "res/gamelist/Icon-LMHT.png",
    "res/gamelist/Icon-Larva.json", "res/gamelist/Icon-Larva.atlas", "res/gamelist/Icon-Larva.png",
    "res/gamelist/Icon-TomCuaCa.json", "res/gamelist/Icon-TomCuaCa.atlas", "res/gamelist/Icon-TomCuaCa.png",
    "res/gamelist/Icon-BaCay.json", "res/gamelist/Icon-BaCay.atlas", "res/gamelist/Icon-BaCay.png",
    "res/gamelist/Icon-Lieng.json", "res/gamelist/Icon-Lieng.atlas", "res/gamelist/Icon-Lieng.png",
    "res/gamelist/Icon-MauBinh.json", "res/gamelist/Icon-MauBinh.atlas", "res/gamelist/Icon-MauBinh.png",
    "res/gamelist/Icon-Poker.json", "res/gamelist/Icon-Poker.atlas", "res/gamelist/Icon-Poker.png",
    "res/gamelist/Icon-Sam.json", "res/gamelist/Icon-Sam.atlas", "res/gamelist/Icon-Sam.png",
    "res/gamelist/Icon-TLMN.json", "res/gamelist/Icon-TLMN.atlas", "res/gamelist/Icon-TLMN.png",
    "res/gamelist/Icon-ThienDia.json", "res/gamelist/Icon-ThienDia.atlas", "res/gamelist/Icon-ThienDia.png",
    "res/gamelist/Icon-ET.png", "res/gamelist/Icon-3.json", "res/gamelist/Icon-3.atlas", "res/gamelist/Icon-3.png", "res/gamelist/Icon-4.json", "res/gamelist/Icon-4.atlas", "res/gamelist/Icon-4.png",

    {type:"font", name:"Font_Default", srcs:["res/fonts/UTM_Bryant.ttf"]},
    {type:"font", name:"UTM_Eremitage", srcs:["res/fonts/UTM_Eremitage.ttf"]},
    {type:"font", name:"Passion_One", srcs:["res/fonts/Passion_One.ttf"]} // tophu
];

// resource for each game
var m_resources = {
    "CARD": [
        "res/bg/table.png",
        "res/bg/bg_chan.jpg",
        "res/bg/cuoc_bg.png",
        "res/bg/bg_result.png",
        "res/bg/bg_notice.png",
        "res/bg/bg_rank.png",
        "res/bg/bg_dialog_small.png",
        "res/bg/bg_dialog_large.png",
        "res/bg/bg_dialog_withdraw.png",
        "res/bg/bg_dialog_info.png",
        "res/bg/khung_cacchi.png",
        "res/tx_1.plist", "res/tx_1.png",
        "res/tx_2.plist", "res/tx_2.png",
        "res/tx_3.plist", "res/tx_3.png",
        "res/tx_4.plist", "res/tx_4.png",
        "res/tx_emo.plist", "res/tx_emo.png",
        "res/tx_endgame.plist", "res/tx_endgame.png",
        "res/tx_ctl.plist", "res/tx_ctl.png",
        "res/fonts/font_so_do.fnt","res/fonts/font_so_do.png",
        "res/fonts/font_so_xanh.fnt","res/fonts/font_so_xanh.png",
        "res/fonts_new/font_do.fnt",
        "res/fonts_new/font_xanh.fnt",
        "res/fonts_new/font.fnt"
    ],
    "MINIPOKER": [
        "res/minipoker/font/font-minigame-export.fnt",
        "res/minipoker/font/font-minigame-export.png",
        "res/minipoker/card-slide.png", "res/minipoker/MiniPoker-Quay.json",
        "res/minipoker/MiniPoker-Quay.atlas", "res/minipoker/MiniPoker-Quay.png", "res/minipoker/notify.png",
        "res/minipoker/0123456789export.png", "res/minipoker/0123456789export.fnt"
    ],
    "TAIXIU": ["res/taixiu/notify-bg.png",
        "res/taixiu/textbox-bet.png",
        "res/taixiu/dice/skeleton.json", "res/taixiu/dice/skeleton.atlas", "res/taixiu/dice/skeleton.png",
        "res/taixiu/Icon-DudayTaxi.json","res/taixiu/Icon-DudayTaxi.atlas", "res/taixiu/Icon-DudayTaxi.png",
        "res/taixiu/font/font-minigame-export.png", "res/taixiu/font/font-minigame-export.fnt",
        "res/taixiu/font/font-taixiu-export.png","res/taixiu/font/font-taixiu-export.fnt"
    ],
    "ET": ["res/minipoker/notify.png",
        "res/et/item/Icon-2.json", "res/et/item/Icon-2.atlas", "res/et/item/Icon-2.png",
        "res/et/item/Icon-3.json", "res/et/item/Icon-3.atlas", "res/et/item/Icon-3.png",
        "res/et/item/Icon-4.json", "res/et/item/Icon-4.atlas", "res/et/item/Icon-4.png",
        "res/et/item/Icon-5.json", "res/et/item/Icon-5.atlas", "res/et/item/Icon-5.png",
        "res/et/item/sprites.png","res/et/item/sprites.plist",
        "res/et/fx/ET-Thang-1.json", "res/et/fx/ET-Thang-1.atlas", "res/et/fx/ET-Thang-1.png",
        "res/et/font/ET-font2-export.png", "res/et/font/ET-font2-export.fnt",
        "res/et/font/ET-font1-export.png", "res/et/font/ET-font1-export.fnt",
        {type:"font", name:"UTM_Showcard", srcs:["res/et/font/UTM_Showcard.ttf"]}
    ],
    "LONGVUONG": [
        "res/longvuong/ThanCa_Lobby.png", "res/longvuong/ThanCa_Lobby.atlas", "res/longvuong/ThanCa_Lobby.json",
        "res/longvuong/fontJpLobby.png", "res/longvuong/fontJpLobby.fnt",
        "res/longvuong/LongVuong-Character2.png",
        "res/longvuong/LongVuong-Character3.png",
        "res/longvuong/LongVuong-Character4.png",
        "res/longvuong/LongVuong-Character.png", "res/longvuong/LongVuong-Character.atlas", "res/longvuong/LongVuong-Character.json", 
        "res/longvuong/ThanCa_ingame.atlas", "res/longvuong/ThanCa_ingame.json",
        "res/longvuong/ThanCa_ingame.png", "res/longvuong/ThanCa_ingame2.png",
        "res/longvuong/item/ItemGame.png", "res/longvuong/item/ItemGame.atlas","res/longvuong/item/ItemGame.json",
        "res/longvuong/play/TienCa-BongBong.png","res/longvuong/play/TienCa-BongBong.atlas","res/longvuong/play/TienCa-BongBong.json",
        "res/longvuong/line/skeleton.png",
        "res/longvuong/line/skeleton2.png",
        "res/longvuong/line/skeleton.atlas",
        "res/longvuong/line/skeleton.json",
        "res/longvuong/item/sprites.png","res/longvuong/item/sprites.plist",
        "res/longvuong/play/font.png", "res/longvuong/play/font.fnt",
        {type:"font", name:"UTM_SeagullBold", srcs:["res/longvuong/UTM_SeagullBold.ttf"]}
    ],
    "DEADORALIVE":[
        "res/deadoralive/item/sprites.png","res/deadoralive/item/sprites.plist",
        "res/deadoralive/item/scatter_anim.png", "res/deadoralive/item/scatter_anim.atlas", "res/deadoralive/item/scatter_anim.json",
        "res/deadoralive/item/wild_animations.png", "res/deadoralive/item/wild_animations.atlas", "res/deadoralive/item/wild_animations.json",
        "res/deadoralive/font/number.png", "res/deadoralive/font/number.fnt",
        "res/deadoralive/sound/nen.mp3",
        "res/deadoralive/sound/spinLoop.mp3",
        "res/deadoralive/sound/spinStart.mp3",
        "res/deadoralive/sound/spinStop.mp3",
        "res/deadoralive/sound/coinUpLoop.mp3",
        "res/deadoralive/sound/winNormal/1.mp3",
        "res/deadoralive/sound/winNormal/2.mp3",
        "res/deadoralive/sound/winNormal/3.mp3",
        "res/deadoralive/sound/winNormal/4.mp3",
        "res/deadoralive/sound/winNormal/5.mp3",
        "res/deadoralive/sound/winNormal/6.mp3",
        "res/deadoralive/sound/winNormal/7.mp3",
        "res/deadoralive/sound/winNormal/8.mp3",
        "res/deadoralive/sound/winNormal/9.mp3",
        "res/deadoralive/sound/winNormal/10.mp3",
        "res/deadoralive/sound/winNormal/11.mp3",
        "res/deadoralive/sound/winJackpot.mp3",
        "res/deadoralive/sound/buttonClick.mp3",
        "res/deadoralive/sound/openOtherRuong.mp3",
        "res/deadoralive/sound/hoverRoom.mp3"
    ]
};

var LIST_RESOURCE_SPIN_FILE = [
    "res/spine/skeleton.json",//clock game binh
];

if( cc.sys.isNative ){
    cc.log("jsList length "+ jsList.length);
    for( var i=0; i<jsList.length; i++ ){
        require(jsList[i]);
    }
}
