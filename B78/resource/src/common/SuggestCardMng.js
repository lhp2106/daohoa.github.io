/**
 * Created by kaka on 7/27/2016.
 * test case voi bo bai tren tay [8,9,12,13,16,17,18,19, 20,21, 24,27,28,40,41,42,43,44,45,48,49]
 *  - deal: 3 dôi thông(33 44 55) mà bộ bài có 33 44 5555 66 77 8JJJJ QQ KK => PASs
 *  - deal: 4 doi thông(33 44 55) mà bộ bài có 33 44 5555 66 77 8JJJJ QQ KK => PASs (1 CASE KO HẠ ĐƯƠC BỘ 33 DẦU =)))
 *  - deal card 2 mà bộ bài có 33 44 5555 66 77 8JJJJ QQ KK => PASs
 *  - deal doi 2 mà bộ bài có 33 44 5555 66 77 8JJJJ QQ KK => PASs
 *  - deal 3 card 2 mà bộ bài có 33 44 5555 66 77 8JJJJ QQ KK => ko co tổ hợp nào chặt dươc 3 cây 2
 *  - deal tu quy (!= tu quy 2) mà bộ bài có 33 44 5555 66 77 8JJJJ QQ KK => PASs (1 case hạ đôi 6 mà dôi 7 đéo hạ thôi kệ =)))
 */

var SuggestCardMng = (function() {
    var instance = null;
    var Clazz = function(){
        //lobbySocket: null,
        this.ctor= function() {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                this.cardList = null;
                this.reset();

            }
        };
        this.reset=function(){
            this.oponentTypeCombo = CARD_COMBO.NORMAL;
            this.lastArrCardDeal =[];

        };
        this.initCardList= function(cardList){
            this.cardList = cardList;
        };
        this.getIndexCard = function( _cardCompt, listCard){
            if(!listCard)  listCard = null;
            var spriteCards = this.cardList.getCards();
            var indexPlayerChose =-1;// this.spriteCards.indexOf(_cardCompt);
            var spriteCards = this.cardList.getCards();
            if(listCard !=null) cardList = listCard;
            spriteCards.forEach(function(card, index){

                var cardCompt = card;
                if(cardCompt === _cardCompt){
                    indexPlayerChose = index;
                }
            });
            return indexPlayerChose;
        };
        this.suggestCard= function(cardList, cardsDeaded,  isBlurCardIfNeed ){
            if(! isBlurCardIfNeed )  isBlurCardIfNeed = true;
            this.cardList = cardList; //cardList CLASS in card.js
            this.lastArrCardDeal =cardsDeaded;
            cc.log(isBlurCardIfNeed +" <=isBlur  suggest.......cardsDeaded =>"+cardsDeaded);

            var thiz = this;
            this.oponentTypeCombo = CARD_COMBO.NORMAL;
            if(!cardsDeaded || !cardsDeaded.length){
                this.cardList.resetCardComboId(false);
                return;
            }

            this.cardList.resetCardComboId(isBlurCardIfNeed);
            var lengthCard = cardsDeaded.length;
            var handCards = this.cardList.getCards();// card tren tay cua playerMe
            var size = handCards.length;
            if(lengthCard == 1){
                // danh 1 card => check normal card va` card 2
                thiz.oponentTypeCombo = CARD_COMBO.NORMAL;
                var _cardDeadId = cardsDeaded[0];
                var cardCompare = Utils.getCardFromServer(_cardDeadId);
                var isCard2 = Utils.isCard2(cardCompare.id);
                for(var i =0;i<  handCards.length; i++){
                    var card = handCards[i];
                    var cardData = card.getCardData();
                    if(cardData.pointTLMN < cardCompare.pointTLMN){
                        if(isBlurCardIfNeed) card.revealBlur(true);
                        card.moveDown();
                    }else if (cardData.pointTLMN == cardCompare.pointTLMN){
                        if(cc.Global.gameId == Constant.GAME_ID.TLMN){
                            if(  cardData.pointTLMN == cardCompare.pointTLMN && cardData.suit < cardCompare.suit){
                                if(isBlurCardIfNeed) card.revealBlur(true);
                                card.moveDown();
                            }else{
                                card.revealBlur(false);
                                card.setCardComboIdBitWise(CARD_COMBO.NORMAL_BIGGER);
                            }
                        }else if(cc.Global.gameId == Constant.GAME_ID.SAM){
                            //SAM THI BAT BUOC PHAI >, KO TINH SUIT
                            if(isBlurCardIfNeed) card.revealBlur(true);
                            card.moveDown();
                        }
                    }else{
                        card.revealBlur(false);
                        card.setCardComboIdBitWise(CARD_COMBO.NORMAL_BIGGER);
                    }
                }
                if(isCard2){
                    //   tu quy
                    //cc.log("is 2 Card");
                    thiz.oponentTypeCombo = CARD_COMBO.CARD_2;
                    var listTuQuy = Utils.getTuQuy(handCards);
                    if(listTuQuy.length){
                        listTuQuy.forEach(function(tuquy, index){
                            if(tuquy.length ==4){
                                tuquy.forEach(function(cardInTuQuy, i){
                                    cardInTuQuy.revealBlur(false);
                                    cardInTuQuy.setCardComboIdBitWise(CARD_COMBO.TUQUY);
                                });
                            }
                        });
                    }
                    // check > 3 doi thong (ko co 2trong cac doithong)
                    //sâm ko dung nthong chat 2 duoc
                    if(cc.Global.gameId == Constant.GAME_ID.TLMN){
                        var resultThong = Utils.getDoiThong(handCards);
                        if(resultThong.length){
                            resultThong.forEach(function(thong, i){
                                if(thong.length >=6){
                                    thong.forEach(function(cardInThong, i){
                                        cardInThong.revealBlur(false);
                                        cardInThong.setCardComboIdBitWise(CARD_COMBO.N_DOITHONG);
                                    });
                                }
                            });
                        }
                    }

                }
            }else{
                var coupleToTuQuy = Utils.isSamPoint(cardsDeaded);
                cc.log('coupleToTuQuy '+coupleToTuQuy);
                //[bool, point, maxSuit]
                if(coupleToTuQuy[0]){
                    // cac bo 2, 3, tu quy(tuquy chat dc 1 doi 2)
                    // get cac  coupleToTuQuy co dung so luong card nhung point > hoac point = va suit lon hon
                    var size = cardsDeaded.length;
                    if(size == 2){
                        thiz.oponentTypeCombo = CARD_COMBO.DOI;
                        var _cardDeadId = cardsDeaded[0];
                        var cardCompare = Utils.getCardFromServer(_cardDeadId);
                        var isCard2 = Utils.isCard2(cardCompare.id);
                        if(isCard2 ) thiz.oponentTypeCombo = CARD_COMBO.DOI_2;
                    }
                    else if(size == 3){
                        thiz.oponentTypeCombo = CARD_COMBO.BO_3;
                    }
                    else if(size == 4){
                        thiz.oponentTypeCombo = CARD_COMBO.TUQUY;
                    }

                    // cc.Global.gameId == Constant.GAME_ID.TLMN
                    var result = Utils.getCoupleToTuQuyBigger(cardsDeaded.length, coupleToTuQuy[1], coupleToTuQuy[2], handCards, cc.Global.gameId );
                    // cc.log('result '+result.length);
                    if(result.length){
                        result.forEach(function(arr, i){
                            arr.forEach(function(cardInArr, i){
                                cardInArr.revealBlur(false);
                                var length = arr.length;
                                if(length == 2){
                                    cardInArr.setCardComboIdBitWise(CARD_COMBO.DOI);

                                }
                                else if(length == 3){
                                    cardInArr.setCardComboIdBitWise(CARD_COMBO.BO_3);

                                }
                                else if(length == 4){
                                    cardInArr.setCardComboIdBitWise(CARD_COMBO.TUQUY);
                                }
                            });
                        });
                    }
                    if(size == 4 || (size == 2 && thiz.oponentTypeCombo == CARD_COMBO.DOI_2)){
                        if(cc.Global.gameId == Constant.GAME_ID.TLMN){//sam ko dung nthong chat 2 voi tu quy duoc
                            //xem co >=4 doi thong ko
                            var resultThong = Utils.getDoiThong(handCards, 4);
                            //alert(resultThong);
                            if(resultThong.length){
                                resultThong.forEach(function(arr, i){
                                    arr.forEach(function(cardInArr, i){
                                        cardInArr.revealBlur(false);
                                        cardInArr.setCardComboIdBitWise(CARD_COMBO.N_DOITHONG);
                                        //cc.log('*********************testt');
                                    });
                                });
                            }
                        }

                    }
                }else{

                    // cac doi thong or day
                    //[isSeq, cardsDeaded.length, maxPoint, suit, [] ,seqTLMN]
                    //seqTLMN true =>seq from tlmn or sam format(1,2,3; 2,3,4 ...)
                    var seqCard = Utils.isSeqCard(cardsDeaded, cc.Global.gameId);
                    cc.log('seqCard '+seqCard);
                    if(seqCard[0]){
                        //VOI SAM THI chuoi 3 thi QKA MAX, A12 MIN,ko co K12 => case nay chua tinh cho sam 1 2 3 => 2 3 4
                        // get cac seqcard bigger
                        // var lastDealCard = Utils.getCardFromServer(cardsDeaded[cardsDeaded.length-1]);
                        // var maxPointDeal = lastDealCard.pointTLMN;
                        // var suitLastDeal = lastDealCard.suit;
                        // cc.log(` ---- ${maxPointDeal} ---- ${suitLastDeal} `);
                        var result = Utils.getSeqCardBigger(seqCard[1], seqCard[2], seqCard[3] , seqCard[4], handCards, cc.Global.gameId );
                        thiz.oponentTypeCombo = CARD_COMBO.CHUOI_CARD;
                        if(result.length){
                            result.forEach(function(arr, i){
                                // cc.log('res==> ');
                                arr.forEach(function(cardInArr, i){
                                    cardInArr.revealBlur(false);
                                    cardInArr.setCardComboIdBitWise(CARD_COMBO.CHUOI_CARD);
                                });
                            });
                        }
                    }else{
                        // check > 3 doi thong (ko co 2trong cac doithong)
                        var isDoiThong = Utils.isDoiThong(cardsDeaded);
                        // [boolean, cardsDeaded.length, maxPoint, suit]
                        //c.log('isDoiThong '+isDoiThong);
                        if(isDoiThong[0]){
                            thiz.oponentTypeCombo = CARD_COMBO.N_DOITHONG;
                            // handCards.forEach(function(a,i){
                            //
                            //     cc.log(`----------${data.toString()}`);
                            // });
                            var resultThong = Utils.getDoiThong(handCards, cardsDeaded.length/2);
                            if(resultThong.length){
                                cc.log('isDoiThong result '+resultThong.length);
                                var thiz = this;
                                resultThong.forEach(function(thong, i){
                                    // cc.log('res==> size '+thong.length);
                                    if(thong.length > cardsDeaded.length){ // 4 doi thong luon chat duoc 3 doi thong
                                        var cId = cardsDeaded[cardsDeaded.length-1];
                                        var cardComponent = Utils.getCardFromServer(cId);
                                        var lastElement = Utils.getMaxCardInArray(thong).getCardData() ;//
                                        var typeApply = CARD_COMBO.N_DOITHONG;
                                        if(lastElement.pointTLMN < cardComponent.pointTLMN){
                                            thiz.oponentTypeCombo = CARD_COMBO.MAX_DOITHONG;
                                            typeApply = CARD_COMBO.MAX_DOITHONG;
                                        }

                                        thong.forEach(function(cardInThong, i){
                                            cardInThong.revealBlur(false);
                                            cardInThong.setCardComboIdBitWise(typeApply);

                                        });
                                    }else if(thong.length === cardsDeaded.length){
                                        //check max card so voi card deal cua oponent
                                        var cId = cardsDeaded[cardsDeaded.length-1];
                                        var cardComponent = Utils.getCardFromServer(cId);
                                        var lastElement = Utils.getMaxCardInArray(thong).getCardData() ;//

                                        // cc.log('res==> last element '+lastElement.toString());
                                        if(cc.Global.gameId == Constant.GAME_ID.TLMN){
                                            if(lastElement.pointTLMN > cardComponent.pointTLMN || (cc.Global.gameId == Constant.GAME_ID.TLMN && lastElement.pointTLMN == cardComponent.pointTLMN && lastElement.suit> cardComponent.suit)){
                                                thong.forEach(function(cardInThong, i){
                                                    cardInThong.revealBlur(false);
                                                    cardInThong.setCardComboIdBitWise(CARD_COMBO.N_DOITHONG);

                                                });
                                            }
                                        }else if(cc.Global.gameId == Constant.GAME_ID.SAM){
                                            var cId = cardsDeaded[0];
                                            var firstDeal = Utils.getCardFromServer(cId);
                                            while(thong[0].getCardData().pointTLMN == firstDeal.pointTLMN){
                                                thong.shift();//xoa phan tu dau tien
                                                // break;
                                            }
                                            if(lastElement.pointTLMN >  cardComponent.pointTLMN){
                                                thong.forEach(function(cardInThong, i){
                                                    cardInThong.revealBlur(false);
                                                    cardInThong.setCardComboIdBitWise(CARD_COMBO.N_DOITHONG);
                                                });
                                            }
                                        }

                                    }
                                });
                            }

                            /////
                            // tu quy chat 3 doi thong
                            var lengthThongDeal = isDoiThong[1]/2;
                            if(lengthThongDeal === 3){
                                // thiz.oponentTypeCombo = CARD_COMBO.CARD_2;
                                var listTuQuy = Utils.getTuQuy(handCards);
                                if(listTuQuy.length){
                                    listTuQuy.forEach(function(tuquy, index){
                                        if(tuquy.length ==4){
                                            tuquy.forEach(function(cardInTuQuy, i){
                                                cardInTuQuy.revealBlur(false);
                                                cardInTuQuy.setCardComboIdBitWise(CARD_COMBO.TUQUY);// TUQUY
                                            });
                                        }
                                    });
                                }
                            }

                            ////
                        }


                    }
                }
            }
            // if dang nhac san card ma chua den turn thi verify xem card nhac san bjo co danh duoc ko

            for(var i =0;i<  handCards.length; i++){
                var card = handCards[i];
                //var cardData = handCards[i].getCardData();
                if( isBlurCardIfNeed && !card.isCardMoveUp() && card.getCardComboIdBitWise() === CARD_COMBO.NORMAL) card.revealBlur(true);
                if(card.isCardMoveUp() && card.getCardComboIdBitWise() === CARD_COMBO.NORMAL){
                    var blurWhenDone = false;
                    if( isBlurCardIfNeed) card.revealBlur(true);
                    card.moveDown();
                    // card.node.setPositionY(0);
                }
            }
        };
        this.getAllCardMoveUp= function( isCardArr, cardCompIgnore ) {
            if(! isCardArr )  isCardArr = false;
            if(! cardCompIgnore )  cardCompIgnore = null;
            var intCardArr =[];
            var spriteCards = this.cardList.getCards();
            spriteCards.forEach(function(card, index){
                var cardCompt = card;
                if(cardCompIgnore ==null ||  cardCompIgnore != cardCompt){
                    if(cardCompt.isCardMoveUp()){
                        var codeCard =cardCompt.getCardData().codeCard;
                        //cc.log("CAR MOVEUP idCard==>"+codeCard );//cards[index].toCodeCard()
                        if(isCardArr) intCardArr.push(codeCard);
                        else intCardArr.push(cardCompt);
                    }
                }

            });
            return intCardArr;
        };
        /**
         * @param cardClick : Card Obj duoc chon
         * @param isUp : state hien tai cua cay bai chon
         */
        this.onSuggestUpCard= function (cardClick, isUp){
            if(! isUp )  isUp = true;
            var spriteCards = this.cardList.getCards();// arr card oBj toan bo bai tren tay
            var arr = this.cardList.getCardSelected(); //arr cardObj select
            var cardsDeaded = this.lastArrCardDeal;
            var oponentTypeCombo = this.oponentTypeCombo;
            var isAllUpSame = true;
            var countSame = 0;
            var count = 0;
            if(arr && arr.length){
                //if(arr.length == 1 && arr[0] === cardClick &&  isUp){
                if(arr.length <=3  && arr.indexOf(cardClick) != -1 &&  isUp){
                    //dang co 1,..n card up ma click luon vao card do thi chi down cai do thoi roi return
                    arr.forEach(function(cardInArr, i){
                        for (var idx in spriteCards) {
                            var c = spriteCards[idx].getCardData();
                            if(c.point === cardInArr.getCardData().point && c.suit === cardInArr.getCardData().suit ){
                                if(cardClick != cardInArr) spriteCards[idx].moveDown(false);
                                break;
                            }
                        };
                    });

                    return;
                }
                var p = arr[0].getCardData().pointTLMN;//cardClick.getCardData().pointTLMN;
                for(var idx in arr){
                    if(cardClick != arr[idx]){
                        if( p != arr[idx].getCardData().pointTLMN ){
                            isAllUpSame = false;
                        }else{
                            countSame++;
                        }
                        if( cardClick.getCardData().pointTLMN === arr[idx].getCardData().pointTLMN ){
                            count++;
                        }
                    }

                }
            }
            //countSame == 1 ko tinh
            if(arr.length > 1 && countSame < 4) isAllUpSame = false;
            if(countSame === 3 &&  cardClick.getCardData().pointTLMN ===  arr[0].getCardData().pointTLMN) isAllUpSame = true;
            if(count === 3 && arr.length > 4 ) isAllUpSame = true;
            var arrayMoveDown = [];
            if(!isUp){
                if(!cardsDeaded || !cardsDeaded.length){
                    this.suggestClickCard( cardClick, isUp);// ko co oponent card thi user click card thi se sggest theo card click do

                }else{
                    this.suggestClickCard(cardClick, isUp);//
                }
                return;
            }else{
                if(!cardsDeaded || !cardsDeaded.length){
                    this.suggestClickCard(cardClick, isUp);// ko co oponent card thi user click card thi se sggest theo card click do
                    return;
                }
                // if(oponentTypeCombo === CARD_COMBO.CHUOI_CARD ){//|| oponentTypeCombo === CARD_COMBO.CARD_2
                //     this.suggestClickCard(cardClick, isUp);// ko co oponent card thi user click card thi se sggest theo card click do
                //      return;
                // }
            }
            cc.log('onSuggestUpCard nhung ko suggestClickCard');
            if( arr.length &&  arr.length >= 6 && (oponentTypeCombo == CARD_COMBO.DOI_2 || oponentTypeCombo == CARD_COMBO.CARD_2  || oponentTypeCombo == CARD_COMBO.N_DOITHONG ) ){
                var numberSameCard = 0;
                var isSame = false;
                var pointClickCard = cardClick.getCardData().pointTLMN;
                if( pointClickCard === (arr[0].getCardData().pointTLMN-1) || pointClickCard === (1+arr[arr.length-1 ].getCardData().pointTLMN )){
                    // nthong 55 66 77 => click card 4 or 8 se cho no nhac len ma ko lam gi
                    return;
                }
                for(var index = 0; index < arr.length; index++){
                    var card = arr[index];
                    if(cardClick.getCardData().pointTLMN === card.getCardData().pointTLMN && cardClick !== card){
                        numberSameCard++;
                        isSame = true;
                        // nthong 55 66 77 => click card cung point voi card dang up thi cho no up len
                        //ko can move vi card click se tu move len
                        // cc.log("----------cardCompt up ${cardClick.getCardData().toString}");
                        // cardClick.onSuggestUp(true);
                        // break;//
                        // return;
                    }
                }
                if(numberSameCard<3 && isSame){
                    var _cardCompt = cardClick;
                    var clickPoint =  _cardCompt.getCardData().pointTLMN;
                    var isClickCardInArr = arr.indexOf(_cardCompt) == -1 ? false : true;
                    if(isClickCardInArr){
                        var indexDown = -1;
                        var temArr = arr;

                        temArr.forEach(function(card, index){

                            var cardCompt = card;
                            if(cardCompt === _cardCompt){
                                indexDown = index;
                            }
                        });
                        var arrLeft = temArr.slice(0, indexDown);



                        if(!arrLeft || !arrLeft.length  || arrLeft.length <6) {
                            //move down all
                            temArr.forEach(function(cardInArr, i){
                                for (var idx in spriteCards) {
                                    var c = spriteCards[idx].getCardData();
                                    if(c.point === cardInArr.getCardData().point && c.suit === cardInArr.getCardData().suit ){
                                        if( cardInArr !== _cardCompt){
                                            spriteCards[idx].moveDown(false);
                                            //cc.log("move down "+ c.point + ":"+ c.suit);
                                        }

                                        break;
                                    }
                                };
                            });
                            return;

                        }else if(arrLeft && arrLeft.length >=6){
                            temArr.forEach(function(cardInArr, i){
                                for (var idx in spriteCards) {
                                    var c = spriteCards[idx].getCardData();
                                    if(c.point === cardInArr.getCardData().point && c.suit === cardInArr.getCardData().suit ){
                                        if(clickPoint <= c.point && cardInArr !== _cardCompt){
                                            spriteCards[idx].moveDown(false);
                                            //cc.log("move down "+ c.point + ":"+ c.suit);
                                        }
                                        break;
                                    }
                                };
                            });
                            return;
                        }
                    }
                    return;
                }
            }

            if( arr.length &&  arr.length >= 3 && (oponentTypeCombo == CARD_COMBO.CHUOI_CARD ) ){
                // dang nhac 6 7 8.... bjo click 1 cay 8 # ben canh => ha cay 8 cu, nhac cay 8 moi
                cc.log('onSuggestUpCard chuoi card change 1 card');
                for(var index = 0; index < arr.length; index++){
                    var card = arr[index];
                    if(cardClick.getCardData().pointTLMN === card.getCardData().pointTLMN && cardClick !== card){
                        card.moveDown(false);
                        cc.log('onSuggestUpCard cmovedown 1 card and return');
                        return;
                    }
                }

            }

            //co card up roi thi ko sugges nua
            if(arr && arr.length){
                if(cardsDeaded && (cardsDeaded.length == 1 || cardsDeaded.length == 2 || cardsDeaded.length == 3
                    || ( cardsDeaded.length >= 4 && oponentTypeCombo == CARD_COMBO.CHUOI_CARD)
                    || ( cardsDeaded.length >= 6 && oponentTypeCombo == CARD_COMBO.N_DOITHONG) )){

                    if(cc.Global.gameId ==Constant.GAME_ID.SAM && ( oponentTypeCombo == CARD_COMBO.CARD_2 || oponentTypeCombo == CARD_COMBO.DOI_2 )){
                        // sam thi chi co tu quy moi chat duoc 2 => nhac 1 tu quy roi"
                        //click tiep thi nhac 2 tu quy len
                    }else{
                        // 1 or n CARD da UP truoc do THI nhac card thu 2 se hide card 1;
                        cc.log('vao dayyyyyy *******');
                        spriteCards.forEach(function(card, index){
                            var cardCompt = card;
                            if(cardClick !== cardCompt) {
                                arrayMoveDown.push(cardCompt);// check xem co card nao sau khi suggest lai nhac len
                                // => hoa" ko move o cuoi ham"
                                //cardCompt.moveDown(); //cardCompt.moveDownNoAmin();
                            }
                        });
                    }


                }else if(oponentTypeCombo == CARD_COMBO.DOI_2){
                }else if(cardsDeaded && cardsDeaded.length == 4 && oponentTypeCombo === CARD_COMBO.TUQUY){
                    //nhac them card: vi du nhac doi 5,doi6,doi7,doi8 bjo nhac them 1 card 7 # thi ke user cu cho nhac 7 len
                    // neu la bien cua n doi thong thi nhac luon doi o bien len
                    var c = cardClick.getCardData();
                    var first = arr[0].getCardData();
                    var last = arr[arr.length-1].getCardData();
                    if(arr.length >=8 && (c.pointTLMN == (first.pointTLMN -1) || c.pointTLMN == (last.pointTLMN+1)) ){
                        for(var index = 0; index < spriteCards.length; index++){
                            var card = spriteCards[index];
                            var cardCompt = card;
                            if(cardCompt.getCardData().pointTLMN == c.pointTLMN && cardCompt !== cardClick){
                                cardCompt.onSuggestUp(true);
                                break;//
                            }
                        }
                        return;
                    }else{
                        var bit =cardClick.getCardComboIdBitWise();
                        var bit2 =arr[0].getCardComboIdBitWise();
                        var check = bit && bit2;
                        if(check != 0){
                            spriteCards.forEach(function(card, index){
                                var cardCompt = card;
                                if(cardClick !== cardCompt) cardCompt.moveDown(false);
                            });
                        }else{

                            return;
                        }
                    }
                }else{
                    cc.log('vao day*************aaaaaaa ');
                    // cc.log('ko suggest vi getAllCardMoveUp > 0 ');
                    // return;
                }

            }

            cc.log('ko suggestClickCard vi cardsDeaded .length > 0 ');
            var _pointTLMN =  cardClick.getCardData().pointTLMN;
            var _suit =  cardClick.getCardData().suit;
            var _idBitwise = cardClick.getCardComboIdBitWise();
            var arraySuggest = [];
            var indexSuggest= -1;
            var sizeSuggest = cardsDeaded.length ;
            var indexPlayerChose =-1;// spriteCards.indexOf(cardClick);
            spriteCards.forEach(function(card, index){
                var cardCompt = card;
                if(cardCompt === cardClick) indexPlayerChose = index;
            });
            for(var index = 0; index < spriteCards.length; index++){
                var card = spriteCards[index];
                var cardCompt = card;

                var idBitwise = cardCompt.getCardComboIdBitWise();
                var result = _idBitwise & idBitwise;
                if(result!=0){
                    // cung loaij card
                    switch(oponentTypeCombo){
                        case CARD_COMBO.NORMAL:
                            break;
                        case CARD_COMBO.DOI:
                            if(cardCompt !== cardClick){
                                if(cardCompt.getCardData().pointTLMN == cardClick.getCardData().pointTLMN && indexSuggest < indexPlayerChose){
                                    //lay phan tu ben phai hoac ben trai gan nhat  tao thanh couple
                                    //phan tu dau tien ben phai se co indexSuggest > indexPlayerChose => end
                                    indexSuggest = index;
                                    arraySuggest.splice(0, arraySuggest.length);
                                    arraySuggest.push(cardCompt);
                                }
                            }

                            break;

                        case CARD_COMBO.DOI_2:case CARD_COMBO.N_DOITHONG:case CARD_COMBO.CARD_2:case CARD_COMBO.TUQUY:case CARD_COMBO.MAX_DOITHONG:
                        var nThong = false;
                        if(oponentTypeCombo ==CARD_COMBO.DOI_2 ){


                            var check  = _idBitwise & CARD_COMBO.TUQUY;
                            if(check!= 0 ){
                                if(cardCompt !== cardClick){
                                    if( cardCompt.getCardData().pointTLMN == cardClick.getCardData().pointTLMN) arraySuggest.push(cardCompt);
                                }
                            }else{
                                check  = _idBitwise & CARD_COMBO.DOI;
                                if(check!= 0 ){
                                    //DOI 2 TO HON
                                    if(cardCompt !== cardClick){
                                        //tu quy chat doi 2 thoi, n doi thong ko chat duoc(?)=> get all 4 phan tu, hoac 2 cay 2 lon hon
                                        if(cardCompt.getCardData().pointTLMN == cardClick.getCardData().pointTLMN){
                                            //add het vao array
                                            arraySuggest.push(cardCompt);
                                        }


                                    }
                                }else{
                                    check  = _idBitwise & CARD_COMBO.N_DOITHONG;
                                    if(check!= 0 ){
                                        nThong = true;
                                        sizeSuggest =8;// min 8 cay moi chat doi 2, max la 10 cay thong, 12 cay thong thi win ngay roi
                                        // alert('nThong');
                                    }
                                }

                            }

                        }else
                        if(oponentTypeCombo ==CARD_COMBO.CARD_2 ){
                            if(isAllUpSame){
                                var check  = _idBitwise & CARD_COMBO.TUQUY;
                                if(check!= 0 ){
                                    if(cardCompt !== cardClick){
                                        if( cardCompt.getCardData().pointTLMN == cardClick.getCardData().pointTLMN) arraySuggest.push(cardCompt);
                                    }

                                }else{
                                    check  = _idBitwise & CARD_COMBO.N_DOITHONG;
                                    if(check!= 0 ){
                                        nThong = true;
                                        var lengthThong = 6;
                                        var arrUp = this.getAllCardMoveUp();
                                        if(arrUp && arrUp.length){
                                            var minPointUp = arrUp[0].getCardData().pointTLMN;
                                            var pointClick = cardClick.getCardData().pointTLMN;
                                            var lengthThong = 2* (1+Math.abs(pointClick - minPointUp));
                                            if(lengthThong< 6) lengthThong = 6;
                                        }

                                        sizeSuggest =lengthThong;// min 6 cay moi chat 2, max la 10 cay thong, 12 cay thong thi win ngay roi
                                    }
                                }
                            }else{
                                /////
                                var check  = _idBitwise & CARD_COMBO.N_DOITHONG;
                                if(check!= 0 ){
                                    nThong = true;
                                    var lengthThong = 6;
                                    var arrUp = this.getAllCardMoveUp();
                                    if(arrUp && arrUp.length){
                                        var minPointUp = arrUp[0].getCardData().pointTLMN;
                                        var pointClick = cardClick.getCardData().pointTLMN;
                                        var lengthThong = 2* (1+Math.abs(pointClick - minPointUp));
                                        if(lengthThong< 6) lengthThong = 6;
                                    }
                                    sizeSuggest =lengthThong;/// min 6 cay moi chat 2, max la 10 cay thong, 12 cay thong thi win ngay roi
                                }else{
                                    check  = _idBitwise & CARD_COMBO.TUQUY;
                                    if(check!= 0 ){
                                        if(cardCompt !== cardClick){
                                            if( cardCompt.getCardData().pointTLMN == cardClick.getCardData().pointTLMN) arraySuggest.push(cardCompt);
                                        }

                                    }
                                }
                            }
                        }else if(oponentTypeCombo ==CARD_COMBO.TUQUY){
                            var check  = _idBitwise & CARD_COMBO.TUQUY;
                            if(check!= 0 ){
                                if(cardCompt !== cardClick){
                                    if( cardCompt.getCardData().pointTLMN == cardClick.getCardData().pointTLMN) arraySuggest.push(cardCompt);
                                }

                            }else{
                                check  = _idBitwise & CARD_COMBO.N_DOITHONG;
                                if(check!= 0 ){
                                    nThong = true;
                                    sizeSuggest =8;//
                                }
                            }


                        }else if(oponentTypeCombo ==CARD_COMBO.MAX_DOITHONG){
                            sizeSuggest =8;
                            nThong = true;

                        }else{
                            cc.log('casedb **** ');
                            if(cardsDeaded.length === 6){
                                nThong = false;
                                //lay tat tu quy chat 3 doi thong co the
                                var check  = _idBitwise & CARD_COMBO.TUQUY;
                                if(check!= 0 ){
                                    if(cardCompt !== cardClick){
                                        if( cardCompt.getCardData().pointTLMN == cardClick.getCardData().pointTLMN) arraySuggest.push(cardCompt);
                                    }

                                }else{
                                    nThong = true;
                                }
                            }else
                                nThong = true;
                        }
                        //alert(nThong);
                        if(nThong){
                            var arrUp = this.getAllCardMoveUp();// ko bao gom card dang click (cardClick)

                            var  p  = cardClick.getCardData().pointTLMN ;
                            var  p2 = arrUp[0] ? arrUp[0].getCardData().pointTLMN : p ;
                            var pointMin = ( p < p2 ? p : p2 );
                            var pointMax =  ( p > p2 ? p : p2 );
                            var diffPoint = pointMax - pointMin;
                            // arrUp.push(cardClick);
                            // this.choseNThong(spriteCards,cardClick,_pointTLMN, indexPlayerChose, arraySuggest, sizeSuggest, false, arrUp);
                            // dung n thong de chan thi luon uu tien nhac 4+ doi thong, muon ha thanh 3 doi thong thi tu ha = tay
                            if(diffPoint >=3){// >= 2
                                this.choseNThong(cardClick,_pointTLMN, indexPlayerChose, arraySuggest, sizeSuggest, false, arrUp);
                            }else{
                                var lengthGet = 10;
                                while(lengthGet >6 && (!arraySuggest || !arraySuggest.length) ){
                                    this.choseNThong( cardClick, _pointTLMN, indexPlayerChose, arraySuggest, lengthGet, false, arrUp);
                                    lengthGet -=2;
                                }
                            }
                        }
                        //cc.log('zzzzzzzzzzzzzzz '+arraySuggest.length);
                        break;
                        case CARD_COMBO.BO_3:
                            if(cardCompt !== cardClick){
                                if(cardCompt.getCardData().pointTLMN == cardClick.getCardData().pointTLMN){
                                    //add het vao array
                                    //2 or 3 element in array, so suit de biet lay 2 pt first or last
                                    arraySuggest.push(cardCompt);
                                }
                            }
                            break;

                        case CARD_COMBO.CHUOI_CARD:{
                            // yeu tien nhac tu ben phai, ko co thi nhac sang ben trai
                            // if(index < indexPlayerChose) break;
                            if(arraySuggest.length == (sizeSuggest -1) ){
                                //da tim duoc sugest chuoi roi
                            }else{
                                var temPointTLMN = -1;
                                var startIndex =  spriteCards.length -1;
                                while(startIndex >=0){
                                    temPointTLMN = -1;
                                    for(var k = startIndex  ; k >= 0; k--){
                                        var cardComptTemp = spriteCards[k];
                                        var isCard2 = Utils.isCard2(cardComptTemp.getCardData().id);
                                        if( isCard2) continue;

                                        var idBitwiseTemp = cardComptTemp.getCardComboIdBitWise();
                                        var resultTem = _idBitwise & idBitwiseTemp;
                                        if(result==0) continue;

                                        if(cardComptTemp.getCardData().pointTLMN >= (_pointTLMN -sizeSuggest +1 ) && cardComptTemp.getCardData().pointTLMN <= (_pointTLMN + sizeSuggest -1 )){
                                            if(temPointTLMN < 0) temPointTLMN = cardComptTemp.getCardData().pointTLMN;
                                            //add het vao array
                                            if(arraySuggest.length == (sizeSuggest -1)) continue;

                                            if(cardComptTemp.getCardData().pointTLMN == (temPointTLMN)){
                                                temPointTLMN --
                                                if(cardComptTemp !== cardClick && _pointTLMN !== cardComptTemp.getCardData().pointTLMN) {
                                                    arraySuggest.push(cardComptTemp);
                                                    cc.log(index + ' push2.... '+ cardComptTemp.getCardData().toString);
                                                }
                                            }else{
                                            }
                                            // cc.log('push ...' + cardComptTemp.getCardData().toString);
                                            // alert(cardComptTemp.getCardData().toString);
                                            if(arraySuggest.length == (sizeSuggest -1)){
                                                var lastElement = arraySuggest[0].getCardData();
                                                var  firstElement= arraySuggest[arraySuggest.length -1].getCardData();
                                                if(firstElement.pointTLMN > _pointTLMN){
                                                    if(lastElement.pointTLMN - _pointTLMN != (sizeSuggest -1)) arraySuggest.splice(0, arraySuggest.length);
                                                }else if(lastElement.pointTLMN < _pointTLMN){
                                                    if(_pointTLMN-  firstElement.pointTLMN != (sizeSuggest -1)) arraySuggest.splice(0, arraySuggest.length);
                                                    lastElement = cardClick.getCardData();
                                                }else {
                                                    if(lastElement.pointTLMN - firstElement.pointTLMN != (sizeSuggest -1)) arraySuggest.splice(0, arraySuggest.length);

                                                }
                                                if(arraySuggest.length == (sizeSuggest -1)){
                                                    var cId = cardsDeaded[cardsDeaded.length-1];
                                                    var lastDeal =  Utils.getCardFromServer(cId);
                                                    if(lastElement.pointTLMN === lastDeal.pointTLMN &&  lastElement.suit < lastDeal.suit){
                                                        arraySuggest.pop();
                                                        temPointTLMN++;
                                                    }
                                                }

                                            }

                                        }
                                    }

                                    if(arraySuggest.length < (sizeSuggest -1 ) ){
                                        arraySuggest.splice(0, arraySuggest.length);
                                    }else{
                                        break;
                                    }

                                    startIndex--;
                                }
                                // cc.log('******************* '+cc.Global.gameId);
                                if(cc.Global.gameId === Constant.GAME_ID.SAM){
                                    ////
                                    var temPoint = -1;
                                    var _temPoint  = cardClick.getCardData().point;
                                    var arrTemSpriteCards = Utils.deepCoppyArray(spriteCards);
                                    arrTemSpriteCards.sort(function(a, b) {
                                        var card1 = a;
                                        var aData = card1.getCardData();
                                        var card2 = b;
                                        var bData = card2.getCardData();
                                        return aData.point - bData.point;
                                    });
                                    startIndex =  arrTemSpriteCards.length -1;
                                    while(startIndex >=0){
                                        temPoint = -1;
                                        cc.log( 'sam test....... ');
                                        for(var k = startIndex  ; k >= 0; k--){
                                            var cardComptTemp = arrTemSpriteCards[k];
                                            var idBitwiseTemp = cardComptTemp.getCardComboIdBitWise();
                                            var resultTem = _idBitwise & idBitwiseTemp;
                                            if(result === 0 ) continue;

                                            if(cardComptTemp.getCardData().point >= (_temPoint -sizeSuggest +1 ) && cardComptTemp.getCardData().point <= (_temPoint + sizeSuggest -1 )){
                                                if(temPoint < 0) temPoint = cardComptTemp.getCardData().point;
                                                //add het vao array
                                                if(arraySuggest.length == (sizeSuggest -1)) continue;

                                                if(cardComptTemp.getCardData().point == (temPoint)){
                                                    temPoint --
                                                    if(cardComptTemp !== cardClick && _temPoint !== cardComptTemp.getCardData().point) {
                                                        arraySuggest.push(cardComptTemp);
                                                        cc.log(index + 'sam push2.... '+ cardComptTemp.getCardData().toString);
                                                    }
                                                }

                                                // cc.log('push ...' + cardComptTemp.getCardData().toString);
                                                // alert(cardComptTemp.getCardData().toString);
                                                if(arraySuggest.length == (sizeSuggest -1)){
                                                    var lastElement = arraySuggest[0].getCardData();
                                                    var  firstElement= arraySuggest[arraySuggest.length -1].getCardData();
                                                    if(firstElement.point > _temPoint){
                                                        if(lastElement.point - _temPoint != (sizeSuggest -1)) arraySuggest.splice(0, arraySuggest.length);
                                                    }else if(lastElement.point < _temPoint){
                                                        if(_temPoint-  firstElement.point != (sizeSuggest -1)) arraySuggest.splice(0, arraySuggest.length);
                                                        lastElement = cardClick.getCardData();
                                                    }else {
                                                        if(lastElement.point - firstElement.point != (sizeSuggest -1)) arraySuggest.splice(0, arraySuggest.length);

                                                    }
                                                    if(arraySuggest.length == (sizeSuggest -1)){
                                                        var cId = cardsDeaded[cardsDeaded.length-1];
                                                        var lastDeal =  Utils.getCardFromServer(cId);
                                                        if(lastElement.point === lastDeal.point &&  lastElement.suit < lastDeal.suit){
                                                            arraySuggest.pop();
                                                            temPoint++;
                                                        }
                                                    }

                                                }

                                            }
                                        }

                                        if(arraySuggest.length < (sizeSuggest -1 ) ){
                                            arraySuggest.splice(0, arraySuggest.length);
                                        }else{
                                            break;
                                        }

                                        startIndex--;
                                    }

                                    /////
                                }



                            }
                            var arrContainer = this.getAllCardMoveUp();
                            if(arrContainer!=null && arrContainer.length && arraySuggest.length){
                                for (var idex in arrContainer) {
                                    var element = arrContainer[idex];
                                    if(arraySuggest.indexOf( element) === -1 ){
                                        //
                                        for (var k =0 ; k < arraySuggest.length; k++ ) {
                                            var el = arraySuggest[k];
                                            if(el.getCardData().pointTLMN === element.getCardData().pointTLMN &&  arrContainer.indexOf(el ) === -1 ){
                                                //
                                                arraySuggest.splice(k, 1, element);//remove 1 pt va add elemnt vao ptu day
                                                break;
                                            }
                                        };
                                    }
                                };
                            }


                            break;
                        }
                    }


                }
                // }
            }
            // });

            if(arraySuggest.length){
                if(arrayMoveDown && arrayMoveDown.length > 0){
                    var lengthDown = arrayMoveDown.length ;
                    //for (var i = lengthDown - 1; i >= 0; i--) {
                        var index = arraySuggest.indexOf(cardCompt);
                        if( index >  -1 ){
                            arrayMoveDown.splice(index, 1);
                        }

                    //};
                }
                if(arrayMoveDown.length){
                    arrayMoveDown.forEach(function(cardCompt, i){
                        cc.log("cardCompt move down  "+cardCompt.getCardData().toString);
                        cardCompt.moveDown(false);
                    });
                }
                var suggestLength = arraySuggest.length;
                switch(oponentTypeCombo){
                    case CARD_COMBO.NORMAL:
                        break;
                    case CARD_COMBO.DOI:
                        arraySuggest.forEach(function(cardCompt, i){
                            cardCompt.onSuggestUp(true);
                        });
                        break;

                    case CARD_COMBO.BO_3:
                        if(suggestLength ==2){//+1 element player chose = 3
                            arraySuggest.forEach(function(cardCompt, i){
                                cardCompt.onSuggestUp(true);
                            });
                        }else{
                            //3 element = > chon 2 element gan" index Player chon nhat
                            if(_suit == Suit.b) arraySuggest.pop();//remove last element
                            if(_suit == Suit.t) arraySuggest.pop();//remove last element
                            if(_suit == Suit.r) arraySuggest.shift();//remove first element
                            if(_suit == Suit.c) arraySuggest.shift();//remove first element
                            arraySuggest.forEach(function(cardCompt, i){
                                cardCompt.onSuggestUp(true);
                            });
                        }

                        break;
                    case CARD_COMBO.CARD_2:case CARD_COMBO.N_DOITHONG:case CARD_COMBO.TUQUY: case CARD_COMBO.DOI_2:case CARD_COMBO.CHUOI_CARD:case CARD_COMBO.MAX_DOITHONG:
                    arraySuggest.forEach(function(cardCompt, i){
                        cc.log("cardCompt up "+cardCompt.getCardData().toString);
                        cardCompt.onSuggestUp(true);
                    });
                    break;

                }



            }else{
                if(arrayMoveDown.length){
                    arrayMoveDown.forEach(function(cardCompt, i){
                        cc.log("cardCompt move down 1 "+cardCompt.getCardData().toString);
                        cardCompt.moveDown(false);
                    });
                }
            }
        };
        this.choseNThong = function( cardClick,_pointTLMN, indexPlayerChose, arraySuggest, sizeSuggest, isRightOnly , arrContainer){
            if(!sizeSuggest) sizeSuggest = -1;
            if(!isRightOnly) isRightOnly = false;
            if(!arrContainer) arrContainer = null;

            var spriteCards = this.cardList.getCards();// arr card oBj toan bo bai tren tay


            var _idBitwise =cardClick.getCardComboIdBitWise();
            //nhac het vi ko the co 2 cap (moi cap 3 doi thong)
            // chi can co 6 doi la win luon roi => case nay chi co the co 1 cap >=3 doi thong
            var pointChose =_pointTLMN -1;
            var i =2;
            var isCoupleChose = false;
            var arrayIdxUse = [];
            if(!isRightOnly){
                for(var k = indexPlayerChose-1; k>=0; k--){

                    if(sizeSuggest > -1){
                        if(arraySuggest && arraySuggest.length == (sizeSuggest-1)){
                            continue;
                        }
                    }
                    if(arrayIdxUse.length && arrayIdxUse.indexOf(k) != -1 ) continue;

                    var cardComptTemp = spriteCards[k];
                    var idBitwiseTemp = cardComptTemp.getCardComboIdBitWise();
                    var resultTem = (cardClick.getCardComboIdBitWise() & idBitwiseTemp);
                    //cc.log('resultTem '+resultTem);
                    if(resultTem!==0){
                        if(cardComptTemp.getCardData().pointTLMN == _pointTLMN && !isCoupleChose){
                            i = 0;
                            pointChose++;
                            isCoupleChose = true;

                        } else if(cardComptTemp.getCardData().pointTLMN == pointChose ){
                            i--;

                        } else{
                            continue;
                        }
                        if(i==0 ){
                            pointChose--;
                            i=2;
                        }
                        arraySuggest.push(cardComptTemp);
                        arrayIdxUse.push(k);
                    }
                }
                if(arraySuggest && arraySuggest.length >=2){
                    var last = arraySuggest[arraySuggest.length-1];
                    var secondLast = arraySuggest[arraySuggest.length-2];
                    if(last.getCardData().pointTLMN != secondLast.getCardData().pointTLMN){
                        arraySuggest.pop();
                    }
                }
                //
            }

            if(!isCoupleChose && isRightOnly){


                for(var k = indexPlayerChose-1; k>=0; k--){


                    var cardComptTemp = spriteCards[k];
                    var idBitwiseTemp = cardComptTemp.getCardComboIdBitWise();
                    var resultTem = (cardClick.getCardComboIdBitWise() & idBitwiseTemp);
                    //cc.log('resultTem '+resultTem);
                    if(resultTem!==0){
                        if(cardComptTemp.getCardData().pointTLMN == _pointTLMN){
                            arraySuggest.push(cardComptTemp);
                            arrayIdxUse.push(k);
                            isCoupleChose = true;
                            break;

                        }


                    }
                }


            }



            pointChose =_pointTLMN;
            if(isCoupleChose) pointChose++;
            // alert("${pointChose} ==> ${isCoupleChose}");
            var i =2;
            for(var k = indexPlayerChose+1; k<  spriteCards.length; k++){
                //if(arraySuggest && arraySuggest.length == (sizeSuggest - 1)) continue;
                if(sizeSuggest > -1){
                    if(arraySuggest && arraySuggest.length == (sizeSuggest-1)){
                        continue;
                    }
                }
                if(arrayIdxUse.length && arrayIdxUse.indexOf(k) != -1 ) continue;
                var cardComptTemp = spriteCards[k];
                var idBitwiseTemp = cardComptTemp.getCardComboIdBitWise();
                cc.log(" ${_idBitwise}  === ${idBitwiseTemp}");
                var resultTem = _idBitwise & idBitwiseTemp;
                // cung loai combo card hoac deu" la type card normal
                if(resultTem!=0 ){//|| (_idBitwise ===0 && idBitwiseTemp ===0 )
                    if(cardComptTemp.getCardData().pointTLMN == _pointTLMN && !isCoupleChose){
                        i = 0;
                        isCoupleChose = true;
                    } else if(cardComptTemp.getCardData().pointTLMN == pointChose){
                        i--;
                    } else{
                        continue;
                    }
                    if(i==0 ){
                        pointChose++;
                        i=2;
                    }
                    cc.log("choseNThong "+ cardComptTemp.getCardData().toString);
                    arraySuggest.push(cardComptTemp);
                    arrayIdxUse.push(k);
                }
            }



            if(arrContainer!=null && arrContainer.length && arraySuggest.length){
                for (var idex in arrContainer) {
                    var element = arrContainer[idex];
                    if(arraySuggest.indexOf( element) === -1 ){
                        //
                        for (var k =0 ; k < arraySuggest.length; k++ ) {
                            var el = arraySuggest[k];
                            if(el.getCardData().pointTLMN === element.getCardData().pointTLMN &&  arrContainer.indexOf(el ) === -1 ){
                                //
                                arraySuggest.splice(k, 1, element);//remove 1 pt va add elemnt vao ptu day
                                break;
                            }
                        };
                    }
                };
            }

            return arraySuggest;
            //cc.log('zzzzzzzzzzzzzzz '+arraySuggest.length);

        };
        this.suggestClickCard = function(  _cardCompt, isUpStatus ){
            if(hiepnh.isUndefined(isUpStatus)) isUpStatus = true;
            var cardsDeaded = this.lastArrCardDeal;
            var spriteCards = this.cardList.getCards();// arr card oBj toan bo bai tren tay
            var indexPlayerChose =-1;// spriteCards.indexOf(_cardCompt);
            spriteCards.forEach(function(card, index){

                var cardCompt = card;
                if(cardCompt === _cardCompt){
                    indexPlayerChose = index;
                }
            });
            cc.log("suggestClickCard indexPlayerChose"+ indexPlayerChose);
            var isCard2 = Utils.isCard2(_cardCompt.getCardData().id);
            var _pointTLMN =_cardCompt.getCardData().pointTLMN;
            var isUp=false;
            var arr = this.getAllCardMoveUp( false, null); //array card tinh ca
            var arrCode = this.getAllCardMoveUp( true, null); ////array card ko containt _cardCompt

            var isSeqCard  = Utils.isSeqCard(arrCode, cc.Global.gameId);
            var isSamPoint = Utils.isSamPoint(arrCode);

            var arrNotMe = this.getAllCardMoveUp( false, _cardCompt);
            for (var index in arrNotMe) {
                cc.log("--card aready up-- "+arrNotMe[index].getCardData().toString);
            }
            var arrMe = this.getAllCardMoveUp( false);
            var isDoiThongArrayCountMe  = Utils.isDoiThongArray(arrMe);
            var isDoiThongArray  = Utils.isDoiThongArray(arrNotMe );
            //var isDoiThongArrayContaintMe = Utils.isDoiThongArray(arrNotMe );

            if(!isDoiThongArray[0] && isDoiThongArray[1] >=6 && isUpStatus && cc.Global.gameId  === Constant.GAME_ID.TLMN ){
                var lastElement = Utils.getMaxCardInArray(arrNotMe).getCardData() ;//getMinCardInArray
                var firstElement = Utils.getMinCardInArray(arrNotMe).getCardData() ;
                var clickPoint = _cardCompt.getCardData().pointTLMN;
                if(firstElement.pointTLMN === clickPoint ){
                    arrNotMe.unshift(_cardCompt);
                }
                if(lastElement.pointTLMN === clickPoint ){
                    arrNotMe.push(_cardCompt);
                }
                isDoiThongArray  = Utils.isDoiThongArray(arrNotMe );
            }
            //ket qua isDoiThongArray = [isDoiThong, cardsArr.length, maxPoint, suit];
            if(isDoiThongArrayCountMe[0] && isDoiThongArrayCountMe[1] >=8 && cc.Global.gameId  === Constant.GAME_ID.TLMN){
                //cut from click index to right
                var isClickCardInArr = arr.indexOf(_cardCompt) == -1 ? false : true;
                if(isClickCardInArr){
                    var indexDown = -1;
                    var temArr = arrMe;

                    temArr.forEach(function(card, index){

                        var cardCompt = card;
                        if(cardCompt === _cardCompt){
                            indexDown = index;
                        }
                    });
                    var arrLeft = temArr.slice(0, indexDown);
                    var arrCodeLeft = arrCode.slice(0, indexDown);


                    if(!arrCodeLeft || !arrCodeLeft.length  || arrCodeLeft.length <6) {
                        //move down all
                        temArr.forEach(function(cardInArr, i){
                            for (var idx in spriteCards) {
                                var c = spriteCards[idx].getCardData();
                                if(c.point === cardInArr.getCardData().point && c.suit === cardInArr.getCardData().suit ){
                                    if( cardInArr !== _cardCompt){
                                        spriteCards[idx].moveDown(false);
                                        //cc.log("move down "+ c.point + ":"+ c.suit);
                                    }

                                    break;
                                }
                            };
                        });
                        return;

                    }else if(arrCodeLeft && arrCodeLeft.length >=6){
                        temArr.forEach(function(cardInArr, i){
                            for (var idx in spriteCards) {
                                var c = spriteCards[idx].getCardData();
                                if(c.point === cardInArr.getCardData().point && c.suit === cardInArr.getCardData().suit ){
                                    if(clickPoint <= c.point && cardInArr !== _cardCompt){
                                        spriteCards[idx].moveDown(false);
                                        //cc.log("move down "+ c.point + ":"+ c.suit);
                                    }
                                    break;
                                }
                            };
                        });
                        return;
                    }
                }


            }
            if(isDoiThongArray[0] && isDoiThongArray[1] >=6 && cc.Global.gameId  === Constant.GAME_ID.TLMN){
                // n doi thong
                var isClickCardInArr = arr.indexOf(_cardCompt) == -1 ? false : true;
                cc.log("isUpStatus "+isClickCardInArr);
                if(isUpStatus && isClickCardInArr){
                    // dang co nthong 66 77 88 => click 1 cay 7 nua => nhtong se cho no up
                    //nhung khi no click down 1 cay 7 trong 3 cay dang up thi se vaof case nay
                    //co  66 777 88  dang UP=> cclick 1 cay 7  => check 66 77 88 la nthong
                    //=> cho ha cay 7 con lai ko lam gi
                    return;
                }

                //// dang co nthong 66 77 88 => click 1 cay 7 nua => nhtong se cho no up
                var lastElement = Utils.getMaxCardInArray(arrNotMe).getCardData() ;
                var firstElement = Utils.getMinCardInArray(arrNotMe).getCardData() ;
                var clickPoint = _cardCompt.getCardData().pointTLMN;
                // if(firstElement.pointTLMN === _cardCompt.getCardData().pointTLMN || lastElement.pointTLMN === _cardCompt.getCardData().pointTLMN){
                if( (firstElement.pointTLMN -1) <= clickPoint && (lastElement.pointTLMN + 1) >= clickPoint){
                    // 66 77 88 => nhac them 1 cay 5 ,6,7,8,9 deu se cho nhac len
                    return;
                }
            }else if(isUpStatus && isDoiThongArrayCountMe[0] && isDoiThongArrayCountMe[1] >=8 && cc.Global.gameId  === Constant.GAME_ID.TLMN){
                //nthong 66 77 88 99 +> click 1 cay 6 hoac 9 se ha luon doi 6 or doi 9
                var lastElement = Utils.getMaxCardInArray(arrMe).getCardData() ;//getMinCardInArray
                var firstElement = Utils.getMinCardInArray(arrMe).getCardData() ;
                var clickPoint = _cardCompt.getCardData().pointTLMN;
                if(firstElement.pointTLMN === clickPoint ){
                    for(var idx in spriteCards){
                        var cardCompt = spriteCards[idx];
                        if(cardCompt != _cardCompt && cardCompt.getCardData().pointTLMN === clickPoint){
                            cardCompt.moveDown(false);
                        }
                    }
                    return;
                }else if(lastElement.pointTLMN === clickPoint ){
                    for(var idx in spriteCards){
                        var cardCompt = spriteCards[idx];
                        if(cardCompt != _cardCompt && cardCompt.getCardData().pointTLMN === clickPoint){
                            cardCompt.moveDown(false);
                        }
                    }
                    return;
                }

            }else
            if(isSamPoint[0] && arrCode.length >=2){
                cc.log("suggestClickCard isSamPoint "+isSamPoint);
                var isClickCardInArr = arr.indexOf(_cardCompt) == -1 ? false : true;
                if(!isUpStatus && isClickCardInArr){
                    //click down 1 card trong chuoi samecard => donothing vi card click tu dong move xuong
                    return;
                }
                //case nhac 2 card or 3 card sau do nhac them 1 card == point nua (ma ko phai trong 2,3 card da nhac truoc)
                var maxSamePoint = isSamPoint[1];
                arrCode.push(_cardCompt.getCardData().codeCard); ////array card ko containt _cardCompt
                // else arrCode.unshift(_cardCompt.getCardData().codeCard);

                var isSame  = Utils.isSamPoint(arrCode);
                if(isSame[0] && isSame[1] >=3){ //
                    // case dang co 1 1 up 1 (down), click 1(down) => 3 con 1 se up

                    return;
                }
                //

            }else
            if( ( cc.Global.gameId === Constant.GAME_ID.SAM || (cc.Global.gameId === Constant.GAME_ID.TLMN && !isCard2) ) && isSeqCard[0] && isSeqCard[1] >=3){ //seqcard >=3 element
                cc.log("suggestClickCard isSeqCard "+isSeqCard);
                var isClickCardInArr = arr.indexOf(_cardCompt) == -1 ? false : true;
                for (var i = 0 ; i < arr.length; i++) {
                    var cardInArr = arr[i];
                    if(cardInArr.getCardData().pointTLMN === _cardCompt.getCardData().pointTLMN){
                        if(cardInArr!== _cardCompt && cardInArr.isCardMoveUp() ){
                            // dang co 5 6 7 8 ro(up) va 8 tep(down) => click 8 tep se up 8 tep va down 8 ro
                            cardInArr.moveDown(false);
                            // cc.log("return 1 ");
                            return;
                            // break;
                        }
                    }
                };

                if(isUpStatus && isClickCardInArr && (!cardsDeaded || !cardsDeaded.length) ){

                    var indexDown = -1;
                    var temArr = arr;
                    if(cc.Global.gameId === Constant.GAME_ID.SAM){
                        temArr.sort(function(a, b) {
                            var card1 = a;
                            var aData = card1.getCardData();
                            var card2 = b;
                            var bData = card2.getCardData();
                            return aData.point - bData.point;
                        });
                    }
                    temArr.forEach(function(card, index){

                        var cardCompt = card;
                        if(cardCompt === _cardCompt){
                            indexDown = index;
                        }
                    });

                    var arrLeft = temArr.slice(0, indexDown);
                    var arrCodeLeft = arrCode.slice(0, indexDown);
                    var arrRight =[];
                    var arrCodeRight = [];
                    if(indexDown < temArr.length-1) {
                        arrRight = temArr.slice(indexDown+1);
                        arrCodeRight = arrCode.slice(indexDown+1);
                    }
                    //cc.log(" ---- ${arrCodeLeft}  ${arrCodeRight} " );
                    var isLeftDown = false;
                    if(arrCodeLeft && arrCodeLeft.length){
                        isSeqCard  = Utils.isSeqCard(arrCodeLeft, cc.Global.gameId);
                        var isSeqCardRight = false;
                        if(arrCodeRight && arrCodeRight.length) isSeqCardRight  = Utils.isSeqCard(arrCodeRight, cc.Global.gameId);
                        cc.log('-------------down card in seq card '+arrCodeRight);
                        if(!isSeqCard[0] || isSeqCard[1] < 3 ){
                            //HA LUON card dben trai neu no ko phai seq
                            isLeftDown = false;//true; neu muon ko ha ben phai
                            cc.log(" ---- aaaaaaa " );
                            arrLeft.forEach(function(cardInArr, i){
                                // cardInArr.moveDown(false);;
                                for (var idx in spriteCards) {
                                    var c = spriteCards[idx].getCardData();
                                    if(c.point === cardInArr.getCardData().point && c.suit === cardInArr.getCardData().suit ){
                                        spriteCards[idx].moveDown(false);
                                        break;
                                    }
                                };
                            });
                        }
                    }else{
                        //click cay dau tien trong seq
                        isLeftDown = false;//true;
                    }


                    if(arrCodeRight && arrCodeRight.length){
                        isSeqCard  = Utils.isSeqCard(arrCodeRight, cc.Global.gameId);
                        //cc.log('-------------right '+isSeqCard);
                        if(!isLeftDown || !isSeqCard[0] || isSeqCard[1] <3){
                            //chuoi card up con lai ko la seq nua sau khi move xuong 1 card
                            cc.log(" ---- bbbb " );
                            arrRight.forEach(function(cardInArr, i){
                                // cardInArr.moveDown(false);
                                for (var idx in spriteCards) {
                                    var c = spriteCards[idx].getCardData();
                                    if(c.point === cardInArr.getCardData().point && c.suit === cardInArr.getCardData().suit ){
                                        spriteCards[idx].moveDown(false);
                                        break;
                                    }
                                };
                            });
                        }
                    }

                    //cc.log('-------------here '+indexPlayerChose);
                    return;
                }
                var maxSeqPoint = isSeqCard[2];
                if(maxSeqPoint < _cardCompt.getCardData().pointTLMN) arrCode.push(_cardCompt.getCardData().codeCard); ////array card ko containt _cardCompt
                else arrCode.unshift(_cardCompt.getCardData().codeCard);

                var isSeqCard  = Utils.isSeqCard(arrCode, cc.Global.gameId);
                if(isSeqCard[0] && isSeqCard[1] >=3){ //seqca
                    // case dang co 5 6 7 8, click 5 => 5 move xuong
                    //bjo click lai 5 thi no se move len, tao voi allcardup seq nhu cu~ => return luon
                    return;
                }

                // return;
            }


            if(arr && arr.length==2 && cc.Global.gameId === Constant.GAME_ID.TLMN){
                var p = _cardCompt.getCardData().pointTLMN;
                var indexInArr = arr.indexOf(_cardCompt);
                // if(p == (arr[0].getCardData().pointTLMN +1) || p == (arr[0].getCardData().pointTLMN -1) ){
                if(indexInArr === -1  ){
                    //predict nthong
                    var arraySuggest=[];
                    ///
                    var  p2 = arr[0].getCardData().pointTLMN ;
                    var cardMin = ( p < p2 ? _cardCompt : arr[0] );
                    var cardMax = ( p > p2 ? _cardCompt : arr[0] );
                    var indexMin = this.getIndexCard(cardMin);
                    var indexMax = this.getIndexCard(cardMax);
                    var pointMin = ( p < p2 ? p : p2 );
                    var pointMax =  ( p > p2 ? p : p2 );
                    ///
                    var indexFirst =indexMin;// spriteCards.indexOf(_cardCompt);
                    var cardComFirst =  cardMin;
                    var pointFirst = pointMin;


                    cc.log("max--min ${pointMax}----${pointMin} ");
                    cc.log('clickcard---- '+_cardCompt.getCardData().toString);
                    // var resultThong = Utils.getDoiThong(spriteCards.slice(indexFirst), 3);
                    var diffPoint = pointMax - pointMin;
                    var suggestDoiLength = (1+ diffPoint ) ;//*2;
                    if(suggestDoiLength < 3) suggestDoiLength = 3;
                    var resultThong = Utils.getDoiThong(spriteCards, suggestDoiLength);
                    if(resultThong.length){
                        resultThong.forEach(function(thong, i){
                            if(thong.length >=6){
                                thong.forEach(function(cardInThong, i){
                                    // cardInThong.revealBlur(false);
                                    cardInThong.setCardComboIdBitWise(CARD_COMBO.N_DOITHONG);
                                });
                            }
                        });
                    }
                    //alert(resultThong);
                    cc.log(' resultThong---- '+ resultThong.length);
                    if(resultThong.length){
                        var isExitThong = false;
                        var thiz = this;
                        resultThong.forEach(function(arrThong, i){
                            if(!isExitThong){
                                if(arrThong.indexOf(arr[0]) != -1 && arrThong.indexOf(arr[1]) != -1 && arrThong.indexOf(_cardCompt) != -1 && arrThong.length >=(suggestDoiLength*2)) {
                                    ///
                                    arrThong.forEach(function(cardInArr, i){

                                        cc.log(' ******** '+ cardInArr.getCardData().toString);

                                    });
                                    cc.log(' ------------------------------');


                                    ///
                                    isExitThong = true;
                                    isUp = true;
                                    cc.log(" ${cardMin} ${pointMin} ${indexMin} ${arraySuggest}");
                                    var isRightOnly = true;
                                    //if( (pointMax - pointMin) < 2) isRightOnly = false; // luon luon lay ben phai thoi
                                    if(diffPoint >=2) thiz.choseNThong(cardMin, pointMin, indexMin, arraySuggest, suggestDoiLength*2, isRightOnly, [arr[0], arr[1] ] );
                                    else{
                                        var lengthGet = 10;
                                        while(lengthGet >6 && (!arraySuggest || !arraySuggest.length) ){
                                            thiz.choseNThong(cardMin, pointMin, indexMin, arraySuggest, lengthGet, isRightOnly, [arr[0], arr[1] ] );


                                            lengthGet -=2;
                                        }

                                    }
                                    cc.log(' resultThong----arraySuggest chose array '+ arraySuggest.length );
                                    if(arraySuggest && (arraySuggest.length +1) >=6){// +1 la card click cuoi cung vi arraySuggest ko bao gom card click cuoi
                                        var isOk = true;

                                        arraySuggest.forEach(function(cardInArr, i){
                                            cc.log(' ----chose '+ cardInArr.getCardData().toString);
                                            // cardInArr.onSuggestUp(true);
                                            // if(arr[0] != cardInArr && arr[1]!= cardInArr && _cardCompt != cardInArr && p2 === cardInArr.getCardData().pointTLMN){

                                            // }else
                                            if(_cardCompt!= cardInArr){
                                                if(cardInArr.getCardData().pointTLMN === _cardCompt.getCardData().pointTLMN){
                                                    if(isOk){
                                                        isOk = false;
                                                        cardInArr.onSuggestUp(true);
                                                    }
                                                }else{
                                                    cc.log(p2+ ' point---- '+ cardInArr.getCardData().toString);
                                                    cardInArr.onSuggestUp(true);
                                                }

                                            }
                                        });
                                    }else{
                                        //hide all arr up card, giu lai card cuoi cung vua click
                                        for(var i in arr){
                                            arr[i].moveDown(false);
                                        }

                                    }


                                }

                            }

                        });
                    }
                }


            }
            ////////start test
            if(isUp) return;

            cc.log("ko vao dayyyy----- length "+arr.length);
            if(arr && arr.length==1){
                //suggest khi click 1 card up, sau do click card thu 2
                //neu 2 card = nhau thi se nhac toan bo card = diem len (bo 3, tu quy neu cp)
                var p = _cardCompt.getCardData().pointTLMN;
                if(_cardCompt !=  arr[0] && p == arr[0].getCardData().pointTLMN ){
                    isUp = true;
                    // alert(''+ indexPlayerChose);
                    // for(var index = 0; index < spriteCards.length; index++){
                    for(var index = indexPlayerChose; index < spriteCards.length; index++){

                        var card = spriteCards[index];
                        var cardCompt = card;
                        if(_cardCompt !== cardCompt){
                            if(_cardCompt.getCardData().pointTLMN == cardCompt.getCardData().pointTLMN){
                                cardCompt.onSuggestUp(true);
                                isUp = true;
                            }
                        }
                    }
                }
            }

            if(!isUp){
                //seq card
                var isCard2 = Utils.isCard2(_cardCompt.getCardData().id);
                //cc.log("${cardCompt.getCardData().toString} is 2 => ${isCard2}");

                var arraySuggest =[];
                if(!isCard2 && arr && arr.length === 1 && !Utils.isCard2(arr[0].getCardData().id)){
                    //suggest khi click 1 card up, sau do click card thu 2
                    //neu 2 card cach nhau n donvi  thi se nhac toan bo seq card
                    var p = _cardCompt.getCardData().pointTLMN;
                    var p2 = arr[0].getCardData().pointTLMN;
                    var diff  =  p2 - p;
                    diff = Math.abs(diff);
                    // if(p == (arr[0].getCardData().pointTLMN +1) || p == (arr[0].getCardData().pointTLMN -1) ){
                    var cardMin = ( p < p2 ? _cardCompt : arr[0] );
                    var cardMax = ( p > p2 ? _cardCompt : arr[0] );
                    var indexMin = this.getIndexCard(cardMin);
                    var indexMax = this.getIndexCard(cardMax);
                    if( diff === 1 ){
                        arraySuggest.length = 0;
                        var pointTLMN = cardMin.getCardData().pointTLMN;
                        /* uncmt block nay neu muon suggest lay card truoc do : eg : 3 4 5 6 7 ma click 5 roi 6 thi se sugg 3,4
                         for(var index = indexMin-1; index >=0; index--){
                         var card = spriteCards[index];
                         var cardCompt = card;
                         var isCard2 = Utils.isCard2(cardCompt.getCardData().id);
                         //cc.log("${cardCompt.getCardData().toString} is 2 => ${isCard2}");
                         if(isCard2) break;
                         var cardData = cardCompt.getCardData();
                         if(_cardCompt !== cardCompt  && arr[0] !== cardCompt){

                         if( cardData.pointTLMN == (pointTLMN -1 )){
                         arraySuggest.push(cardCompt);
                         pointTLMN--;

                         }
                         }
                         } */

                        // suggest chuoi card ben phai 2 cay bai nhac: eg  3 4 5 6 7 8 ma click 5 roi 6 thi suggest 7
                        pointTLMN   = cardMax.getCardData().pointTLMN;

                        for(var index =indexMax+1; index < spriteCards.length; index++){
                            var card = spriteCards[index];
                            var cardCompt = card;
                            var isCard2 = Utils.isCard2(cardCompt.getCardData().id);
                            // cc.log("${cardCompt.getCardData().toString} is 2 => ${isCard2}");
                            if(isCard2) break;
                            var cardData = cardCompt.getCardData();
                            if(_cardCompt !== cardCompt && arr[0] !== cardCompt){

                                if( cardData.pointTLMN == (pointTLMN +1 )){
                                    arraySuggest.push(cardCompt);
                                    //cc.log("-----pushhhhhh ${cardData.toString()}");
                                    pointTLMN++;

                                }
                            }
                        }
                        if(arraySuggest && arraySuggest.length >=1){//1card up truoc + 1 arraySuggest  + 1 card user select = 3++
                            isUp = true;
                            arraySuggest.forEach(function(suggest, index){
                                if(suggest.getCardData().pointTLMN ==  _cardCompt.getCardData().pointTLMN ||
                                    suggest.getCardData().pointTLMN ==  arr[0].getCardData().pointTLMN){
                                }else{
                                    cc.log('tlmn push ...'+ suggest.getCardData().toString);
                                    suggest.onSuggestUp(true);
                                }


                            });
                        }else{
                            arraySuggest.length = 0;
                        }

                    }else {//if( diff === 2 )
                        arraySuggest.length = 0;
                        // var arraySuggest =[];
                        pointTLMN   = cardMin.getCardData().pointTLMN;
                        for(var index =indexMin+1; index < indexMax; index++){
                            var card = spriteCards[index];
                            var cardCompt = card;
                            var isCard2 = Utils.isCard2(cardCompt.getCardData().id);
                            // cc.log("${cardCompt.getCardData().toString} is 2 => ${isCard2}");
                            if(isCard2) break;
                            var cardData = cardCompt.getCardData();
                            if(_cardCompt !== cardCompt && arr[0] !== cardCompt){

                                if( cardData.pointTLMN == (pointTLMN +1 )){
                                    arraySuggest.push(cardCompt);
                                    //cc.log("-----pushhhhhh ${cardData.toString()}");
                                    pointTLMN++;

                                }
                            }
                        }
                        var requireLength = (diff+1) - 1 -1 // -1card up truoc - 1 in arraySuggest
                        // alert(requireLength+ ' '+ arraySuggest.length);
                        if(arraySuggest && arraySuggest.length >=requireLength){// >= moi duoc
                            isUp = true;
                            arraySuggest.forEach(function(suggest, index){
                                if(suggest.getCardData().pointTLMN ==  _cardCompt.getCardData().pointTLMN ||
                                    suggest.getCardData().pointTLMN ==  arr[0].getCardData().pointTLMN){
                                }else{
                                    cc.log('tlmn push ...'+ suggest.getCardData().toString);
                                    suggest.onSuggestUp(true);
                                }


                            });
                        }else{
                            arraySuggest.length = 0;
                        }
                    }
                }

                if(cc.Global.gameId === Constant.GAME_ID.SAM){
                    //case 1 2 3... or 2 3 4 ...
                    var temSpriteCards = Utils.deepCoppyArray(spriteCards);
                    temSpriteCards.sort(function(a, b) {
                        var card1 = a;
                        var aData = card1.getCardData();
                        var card2 = b;
                        var bData = card2.getCardData();
                        return aData.point - bData.point;
                    });
                    if( arr && arr.length === 1 ){
                        //suggest khi click 1 card up, sau do click card thu 2
                        //neu 2 card cach nhau n donvi  thi se nhac toan bo seq card
                        var p = _cardCompt.getCardData().point;
                        var p2 = arr[0].getCardData().point;
                        var diff  =  p2 - p;
                        diff = Math.abs(diff);
                        // if(p == (arr[0].getCardData().pointTLMN +1) || p == (arr[0].getCardData().pointTLMN -1) ){
                        var cardMin = ( p < p2 ? _cardCompt : arr[0] );
                        var cardMax = ( p > p2 ? _cardCompt : arr[0] );
                        var indexMin = this.getIndexCard(cardMin, temSpriteCards);
                        var indexMax = this.getIndexCard(cardMax, temSpriteCards);
                        if( diff === 1 ){

                            var arraySuggestSam =[];
                            var point = cardMin.getCardData().point;


                            for(var index = indexMin-1; index >=0; index--){
                                var card = temSpriteCards[index];
                                var cardCompt = card;
                                var cardData = cardCompt.getCardData();
                                if(_cardCompt !== cardCompt  && arr[0] !== cardCompt){

                                    if( cardData.point == (point -1 )){
                                        arraySuggestSam.push(cardCompt);
                                        point--;

                                    }
                                }
                            }
                            point   = cardMax.getCardData().point;

                            for(var index =indexMax+1; index < temSpriteCards.length; index++){
                                var card = temSpriteCards[index];
                                var cardCompt = card;

                                var cardData = cardCompt.getCardData();
                                if(_cardCompt !== cardCompt && arr[0] !== cardCompt){

                                    if( cardData.point == (point +1 )){
                                        arraySuggestSam.push(cardCompt);
                                        point++;

                                    }
                                }
                            }
                            if(arraySuggestSam && arraySuggestSam.length >=1){//1card up truoc + 1 arraySuggestSam  + 1 card user select = 3++
                                isUp = true;
                                arraySuggestSam.forEach(function(suggest, index){
                                    if(suggest.getCardData().point ==  _cardCompt.getCardData().point ||
                                        suggest.getCardData().point ==  arr[0].getCardData().point){
                                    }else{
                                        // suggest.onSuggestUp(true);
                                        var idx = spriteCards.indexOf(suggest);
                                        for (var idx in spriteCards) {
                                            var cardComp =  spriteCards[idx];
                                            var c = cardComp.getCardData();
                                            if(c.point === suggest.getCardData().point && c.suit === suggest.getCardData().suit ){
                                                if(arraySuggest.length){
                                                    var firstSeqTlmn =arraySuggest[0].getCardData().pointTLMN ;
                                                    var lastPointTlmn = arraySuggest[arraySuggest.length -1 ].getCardData().pointTLMN ;
                                                    if(c.pointTLMN < firstSeqTlmn || c.pointTLMN > lastPointTlmn){
                                                        // cc.log('sam push ...'+ spriteCards[idx].getCardData().toString);
                                                        spriteCards[idx].onSuggestUp(true);
                                                        break;
                                                    }
                                                }else{
                                                    //cc.log('sam push ...'+ spriteCards[idx].getCardData().toString);
                                                    spriteCards[idx].onSuggestUp(true);
                                                    break;

                                                }


                                            }
                                        };

                                    }
                                });
                            }

                        }else {//if( diff === 2 )
                            var arraySuggestSam =[];
                            point   = cardMin.getCardData().point;
                            for(var index =indexMin+1; index < indexMax; index++){
                                var card = temSpriteCards[index];
                                var cardCompt = card;
                                var cardData = cardCompt.getCardData();
                                if(_cardCompt !== cardCompt && arr[0] !== cardCompt){

                                    if( cardData.point == (point +1 )){
                                        arraySuggestSam.push(cardCompt);
                                        //cc.log("-----pushhhhhh ${cardData.toString()}");
                                        point++;

                                    }
                                }
                            }
                            var requireLength = (diff+1) - 1 -1 // -1card up truoc - 1 in arraySuggestSam
                            // alert(requireLength+ ' '+ arraySuggestSam.length);
                            if(arraySuggestSam && arraySuggestSam.length >=requireLength){// >= moi duoc
                                isUp = true;
                                arraySuggestSam.forEach(function(suggest, index){
                                    if(suggest.getCardData().point ==  _cardCompt.getCardData().point||
                                        suggest.getCardData().point ==  arr[0].getCardData().point){
                                    }else{
                                        // suggest.onSuggestUp(true);
                                        for (var idx in spriteCards) {
                                            var cardComp =  spriteCards[idx];
                                            var c = cardComp.getCardData();
                                            if(c.point === suggest.getCardData().point && c.suit === suggest.getCardData().suit ){
                                                if(arraySuggest.length){
                                                    var firstSeqTlmn =arraySuggest[0].getCardData().pointTLMN ;
                                                    var lastPointTlmn = arraySuggest[arraySuggest.length -1 ].getCardData().pointTLMN ;
                                                    if(c.pointTLMN < firstSeqTlmn || c.pointTLMN > lastPointTlmn){
                                                        //cc.log('sam push ...'+ spriteCards[idx].getCardData().toString);
                                                        spriteCards[idx].onSuggestUp(true);
                                                        break;
                                                    }
                                                }else{
                                                    //cc.log('sam push ...'+ spriteCards[idx].getCardData().toString);
                                                    spriteCards[idx].onSuggestUp(true);
                                                    break;

                                                }


                                            }
                                        };
                                    }


                                });
                            }
                        }
                    }
                }



            }
            if(isUp) return;
            if(!isUp){
                //MOVE XUONG PREVIOUS CARD
                // cc.log('suggestClickCard');
                spriteCards.forEach(function(card, index){
                    var cardCompt = card;
                    if(cardCompt !== _cardCompt){
                        if(cardCompt.isCardMoveUp()) cardCompt.moveDown(false);
                    }
                });
            }

        };
        this.ctor();
    };
    Clazz.getInstance = function() {
        if (!instance) {
            instance = new Clazz();
        }
        return instance;
    };
    return Clazz;
})();



