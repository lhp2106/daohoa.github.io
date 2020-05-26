
var Utils = Utils || {};
Utils.getDeckPointCentre = function (node) {
	var scale =1;
	var currentScene = cc.director.getRunningScene();
	if(currentScene.sceneLayer ){
		scale = currentScene.sceneLayer.scale;
	}
	this.scale =scale;
	this.deckPoint = node.convertToNodeSpace(cc.p(cc.winSize.width/2, cc.winSize.height - cc.Global.GameView.height*scale/2));
	return this.deckPoint;
};
/**
 * @description determine if an array contains one or more items from another array.
 * @param {array} haystack the array to search.
 * @param {array} arr the array providing items to check for in the haystack.
 * @return {boolean} true|false if haystack contains at least one item from arr.
 */
Utils.findOne = function(haystack, arr) {
    return arr.some(function (v) {
        return haystack.indexOf(v) >= 0;
    });
};

Utils.getCardFromServer= function(code){//8,16,22,25,33,36,41,45,51,0,3,4,7
                                //Club 4 Club 6
                                //3bich
    var suit = code % 4  +1;//+ 1;
    //http://stackoverflow.com/questions/4228356/integer-division-in-javascript
    var point = ~~(code / 4)  +1;// +1; //code / 4 + 1;
   // var id = (suit)*13 + (point);
    //cc.log(`suit ${suit} point ${suit} id ${id}`);
    var card  = Types.Card(point, suit);// Card.fromId(id);
    return card;
};
Utils.getCodeCard= function(point, suit){//8,16,22,25,33,36,41,45,51,0,3,4,7
	//Club 4 Club 6
	//3bich
	var codeCard =(suit - 1) + 4*(point - 1);

	return codeCard;
};
Utils.getArrCardData = function(cardArray){
	if(!cardArray || !cardArray.length) return [];
	var cards = [];
	for (var i = 0; i < cardArray.length; i++) {
		cards.push(Utils.getCardFromServer(cardArray[i]));
	}
	return cards;
};
Utils.getWordPos = function(node){
  var pos = node.getParent().convertToWorldSpace(node.getPosition());
	var scale =1;
	var currentScene = cc.director.getRunningScene();
	if(currentScene.sceneLayer ){
		scale = currentScene.sceneLayer.scale;
	}

	var dx =cc.winSize.width/2 - cc.Global.GameView.width*scale/2;
	var dy = cc.winSize.height - cc.Global.GameView.height*scale;
	pos.x -= dx;
	pos.y -=dy;

	return pos;
},

/**
 * return string with json format
 * */
Utils.encode = function(obj) {
       return JSON.stringify(obj);
   };
 /**
 * return json obj js
 * */
 Utils.decode = function(obj) {
    try {
      return JSON.parse(obj);
    } catch (e) {
        return null;
    }
    
    return null;
};


Utils.isCard2 = function (num) {
    // return num === 4 || num === 17 || num === 30 || num === 43 ;
	return num === 1 || num === 14 || num === 27 || num === 40 ;
};

Utils.getTuQuy = function (arrayCard) {
	//arrayCard la Card component
	var results = []; //list cac tu quy
    
	var length  = arrayCard.length;
                    for(var i =0;i<  length -1; i++){
						var arrayTuQuy = [];
                        arrayTuQuy.splice(0,arrayTuQuy.length);
                        var card1 = arrayCard[i];
                        var cardData1 = card1.getCardData();
                        arrayTuQuy.push(card1);
                        for(var j =i+1;j<  length; j++){
                            var card2 = arrayCard[j];
                            var cardData2 = card2.getCardData();
                            if(cardData1.point == cardData2.point){
                               arrayTuQuy.push(card2);
                               
                            }
                        }
                        if(arrayTuQuy.length ==4){
                            results.push(arrayTuQuy);
                        }

                    }
	return results ;
};

Utils.getDoiThong = function (arrayCard, minDoiThong , gameId) {
	if(!minDoiThong) minDoiThong = 3;
	if(!gameId) gameId = Constant.GAME_ID.TLMN;
	
	//arrayCard la Card component
	var results = []; //list cac doi thong
    var length  = arrayCard.length;
                    for(var i =0;i<  length -1; i++){
						var arrayThong = [];//> 3 doi thong
						var arrayTemp = [];
						var arrUse =[];
						var tempThong = -1;
                        arrayThong.splice(0,arrayThong.length);
                        arrayTemp.splice(0,arrayTemp.length);
                        var card1 = arrayCard[i];
                        var cardData1 = card1.getCardData();
                        if( Utils.isCard2(cardData1.id)) continue;
                        
                        
                        arrayThong.push(card1);
						arrUse.push(i);
                        tempThong = cardData1.pointTLMN;
                        for(var j =i+1;j<  length; j++){
                            var card2 = arrayCard[j];
                            var cardData2 = card2.getCardData();
                            if( Utils.isCard2(cardData2.id)) continue;
                            if(tempThong == cardData2.pointTLMN){
                               arrayThong.push(card2);
							   arrUse.push(j);
                               if(arrayThong.length%2 ==0){
                                   //14 la cay at' 
                                    tempThong++;
                               }  
                            }else{
                                // vi du add 3 3 , ma  loop van co 3 nua thi add 3 nay vao temthong
                               // arrayThong.forEach(function(a, i){
                                  // if(a.getCardData().pointTLMN == cardData2.pointTLMN){
									 // if(arrUse.length && arrUse.indexOf(i) == -1){
										// arrayTemp.push(card2);  
									 // }
                                     
                                  // }
                               // }); 
                            }
                            
                            
                        }
						
						for(var j =i+1;j<  length; j++){
                            var card2 = arrayCard[j];
                            var cardData2 = card2.getCardData();
                            if( Utils.isCard2(cardData2.id)) continue;
							
							arrayThong.forEach(function(a, k){
                                  if(a.getCardData().pointTLMN == cardData2.pointTLMN){
									 if(arrUse.length && arrUse.indexOf(j) == -1){
										arrayTemp.push(card2);  
										arrUse.push(j);
									 }
                                     
                                  }
                               }); 
							
						}
						
						
                        if(arrayThong.length >=(minDoiThong*2)){//>=3 doi
							while(arrayThong.length %2 == 1 ){
								//remove phan tu thuoc day bai thong nhung ko co' couple voi no
								// vi du : 3 3 44 55 6 => remove 6
								arrayThong.pop();
							}
                        //bjo check lai array card 1 lan nua, card  nao = pointTLMN cac card trong thong thi add vao
                           if(arrayTemp.length) arrayThong = arrayThong.concat(arrayTemp);
						   results.push(arrayThong);
                        } 
                    }    
	return results ;
};
Utils.isDoiThong = function(cardsDeaded){
    var _pointTLMN = -1;
	var isDoiThong = true;
	var suit =-1;
	var maxPoint =-1;
    for(var i = 0 ; i < cardsDeaded.length; i+=2){ 
                        var cId = cardsDeaded[i];
                        var cardComponent = Utils.getCardFromServer(cId);
						suit = cardComponent.suit;
						if(maxPoint < cardComponent.pointTLMN) maxPoint = cardComponent.pointTLMN;
						if(_pointTLMN < 0) _pointTLMN = cardComponent.pointTLMN; 
						else{
							if(_pointTLMN == (cardComponent.pointTLMN -1)){
								_pointTLMN++;
							}else{
								isDoiThong = false;
							}
						}
    };
    return [isDoiThong, cardsDeaded.length, maxPoint, suit];  
};
Utils.isDoiThongArray= function(cardsArr){
	//dung cho tlmn, sam thoi
	if(!cardsArr || !cardsArr.length){

		return [false,0, -1, 1];
	}

	var isDoiThong = true;
	
    for(var i = 0 ; i < cardsArr.length; i++){ 
                 
        var cardComponent = cardsArr[i]; 
        var comboID = cardComponent.getCardComboIdBitWise();
        var check = comboID && CARD_COMBO.N_DOITHONG;
        // cc.log(`comboID-- ${comboID}`);  
        if(check === 0){// ko cung loai
            isDoiThong = false;
            break;

        }
						
    };
	var pointCheck = cardsArr[0].getCardData().pointTLMN; 
	if(cardsArr.length >=2 && cardsArr.length%2 == 0){
		for( i = 0 ; i < cardsArr.length-1; i+=2){ 
	    	var pointCheck1 = cardsArr[i].getCardData().pointTLMN; 
	    	var pointCheck2 = cardsArr[i+1].getCardData().pointTLMN; 
	    	if(pointCheck1 != pointCheck2){
	    		isDoiThong = false;
	    		break;
	    	}

	    }
	}else{
		isDoiThong = false;
	}
    

    var suit = cardsArr[cardsArr.length-1].getCardData().suit;
	var maxPoint = cardsArr[cardsArr.length-1].getCardData().pointTLMN;
    return [isDoiThong, cardsArr.length, maxPoint, suit];  
};
Utils.isSeqCard  = function(cardsDeaded, gameId){
	//cardsDeaded la array card tu server
	// theo server tra ve thi 0,1,2,3, la 4 con at'
	var _pointTLMN = -1;
	var isSeq = true;
	var suit =-1;
	var maxPoint =-1;
	var seqTLMN = true;
	cardsDeaded.forEach(function(cId, i){
                        var cardComponent = Utils.getCardFromServer(cId);
						suit = cardComponent.suit;
						if(maxPoint < cardComponent.pointTLMN) maxPoint = cardComponent.pointTLMN;
						if(_pointTLMN < 0) _pointTLMN = cardComponent.pointTLMN; 
						else{
							if(_pointTLMN == (cardComponent.pointTLMN -1) &&  !Utils.isCard2(cardComponent.id)){
								_pointTLMN++;
							}else{
								isSeq = false;
								seqTLMN=false;
							}
						}
    });
	
	if(!isSeq && gameId == Constant.GAME_ID.SAM){
		var _point = -1;
		isSeq = true;
		 suit =-1;
		 maxPoint =-1;
		 var temCards =cardsDeaded;
		 temCards.sort(function(a, b) {
			return (a - b);
		});
		 // for (var i = 0 ; i  < temCards.length; i++) {
		 // 	cc.log('************ '+temCards[i]);
		 // };
		temCards.forEach(function(cId, i){
							var cardComponent = Utils.getCardFromServer(cId);
							suit = cardComponent.suit;
							if(maxPoint < cardComponent.point) maxPoint = cardComponent.point;
							if(_point < 0) _point = cardComponent.point; 
							else{
								if(_point == (cardComponent.point -1)){
									_point++;
								}else{
									isSeq = false;
								}
							}
		});
	}
	
    return [isSeq, cardsDeaded.length, maxPoint, suit, cardsDeaded, seqTLMN];         
};
Utils.getSeqCardBigger  = function(_count, _maxPoint, _suit, cardsDeaded, arrayCards, gameId, _card1stData){
	if(!_card1stData) _card1stData = null;
	//cardsDeaded la array card tu server
	// theo server tra ve thi 0,1,2,3, la 4 con at'
	var arrayCard = arrayCards;
	if(gameId == Constant.GAME_ID.SAM){
		arrayCard =  Utils.deepCoppyArray(arrayCards);
	}
	var kq = null;
	if(gameId == Constant.GAME_ID.SAM ){
	   
		var cloneArray = Utils.deepCoppyArray(arrayCard);//  arrayCard.slice(0);
		
		if(Utils.findOne([4,5,6,7], cardsDeaded)){
			kq = Utils.getSeqCardBigger(_count, _maxPoint, _suit, cardsDeaded, cloneArray, Constant.GAME_ID.TLMN, Utils.getCardFromServer('8'));
		}else{
			kq = Utils.getSeqCardBigger(_count, _maxPoint, _suit, cardsDeaded, cloneArray, Constant.GAME_ID.TLMN, Utils.getCardFromServer(cardsDeaded[1]));
		
		}
		
		
		
		
	
	}
	if(gameId == Constant.GAME_ID.SAM){
		//sort ascending 
		arrayCard.sort(function(a, b) {
			var card1 = a;
            var aData = card1.getCardData();
			var card2 = b;
            var bData = card2.getCardData();
			return aData.point - bData.point;
		});
	}
	
	var results = [];
	
	
	var _pointTLMN = -1;
	var isSeq = true;
	var suit =-1;
	var maxPoint =-1;
	var length  = arrayCard.length;
    var arrAllUse =[];
	var card1stData = _card1stData ==null? Utils.getCardFromServer(cardsDeaded[0]) : _card1stData;

	for(var i =0;i<  length; i++){//toi thieu 3 card
                        var array = [];
                        array.splice(0,array.length);
                        var arrUse =[];
                        arrUse.splice(0,array.length);
                        var card1 = arrayCard[i];
                        var cardData1 = card1.getCardData();
						if(  gameId == Constant.GAME_ID.TLMN  &&  Utils.isCard2(cardData1.id)) continue;
						suit = cardData1.suit;
						//da dung` roi => continue
						if(arrAllUse.length && arrAllUse.indexOf(i)>-1) continue;
						
						_pointTLMN = Types.getPointAuto(cardData1, gameId); //cardData1.getPointAuto(gameId);
						if(_pointTLMN < Types.getPointAuto(card1stData, gameId) ) continue;
						
						array.push(card1);
						arrUse.push(i);
						var j = i+1;
				
				    	while(j<length){
						    var isADD=false;
						    var pointLoop =Types.getPointAuto(cardData1, gameId) +1;// cardData1.getPointAuto(gameId)+1;
						    for(var k =j;k<  length; k++){
								isADD = false;
								var card2 = arrayCard[k];
								var cardData2 = card2.getCardData();
								if( gameId == Constant.GAME_ID.TLMN   && Utils.isCard2(cardData2.id)) continue;
								if(arrUse.length && arrUse.indexOf(k)>-1) continue;
								//if(_maxPoint == cardData2.getPointAuto(gameId)  && _suit > cardData2.suit) continue;
								if(pointLoop ==Types.getPointAuto(cardData2, gameId) ){//cardData2.getPointAuto(gameId)
								   array.push(card2);
								   arrUse.push(k);
								   isADD = true;
								   pointLoop++;
								   //cc.log('add*********  '+card2.getCardData().toString() + '  pointloop '+ pointLoop);
								}
								
								if(isADD && array && array.length==_count){
									var _lastElement = array[array.length-1].getCardData();
									var _lastElementDeal = Utils.getCardFromServer(cardsDeaded[cardsDeaded.length-1]);
									if(array.length == _count ){
										if(gameId == Constant.GAME_ID.TLMN ){
											if(Types.getPointAuto(_lastElement, gameId)  == _maxPoint && _lastElement.suit< _suit ){
												pointLoop--;
												var pop = array.pop();
												arrUse.pop();		
											}
											
										}else if(gameId == Constant.GAME_ID.SAM ){
											//sa^m, SEQ CARD CHAT duoc phai co last card point > last deal card
											if( Types.getPointAuto(_lastElement, gameId)  == _maxPoint){
												pointLoop--;
												var pop = array.pop();
												arrUse.pop();		
											}
										}
										
										// cc.log('remove*********  '+pop.getCardData().toString() + '  pointloop '+ pointLoop);
									}
								}
								
							
									
						    }
							//cc.log('donezzzzzzzzzzzzzzzz '+j);
						    if(array && array.length>=_count){
								    break;	
							}else{
								
								array.splice(0,array.length);
                        
								arrUse.splice(0,arrUse.length);
							} 
						    
						    j++;
						}
						
						
						if(array.length >= _count){
							array.forEach(function(a, i){
								//cc.log('aaaaaaaaaa '+ a.getCardData().toString());
							});
							//add them
							//add cac phan tu = vao
							var arayUseTem = [];
							for(var k =0;k<  length; k++){
								var card2 = arrayCard[k];
								var cardData2 = card2.getCardData();
								if( gameId == Constant.GAME_ID.TLMN  && Utils.isCard2(cardData2.id)) continue;
								if(arrUse.length && arrUse.indexOf(k)>-1){
									//cc.log('card '+cardData2.toString() +' has used');
									continue;
								} 
								var arrTep=[];
								array.forEach(function(a, _i){
									var _data = a.getCardData();
									// ko can check suit cua SAM vi last card luon > last deal card
									if(Types.getPointAuto(_data, gameId) == _maxPoint && Types.getPointAuto(_data, gameId) == Types.getPointAuto(cardData2, gameId)   ){
										if(gameId == Constant.GAME_ID.TLMN ){
											if(_data.suit< cardData2.suit){
												if(arrUse.length && arrUse.indexOf(k)==-1){
												   arrTep.push(card2);
													arrUse.push(k);	
												}
												
											}
										}else if(gameId == Constant.GAME_ID.SAM ){
											
											if(arrUse.length && arrUse.indexOf(k)==-1){
												arrTep.push(card2);
												arrUse.push(k);
											}
										}   
										
									}else{
										if(Types.getPointAuto(_data, gameId) == Types.getPointAuto(cardData2, gameId)  && Types.getPointAuto(_data, gameId) !== _maxPoint){
										   
										   if(arrUse.length && arrUse.indexOf(k)==-1){
												arrTep.push(card2);
												arrUse.push(k);
											}
										}
									}
									
								});
								if(arrTep.length){
									array =array.concat(arrTep);
									
								} 
								
						    }
							
							// for (var idx in array) {
							// 	cc.log('-------test '+array[idx].getCardData().toString() );
							// };
							//cc.log('donezzz add more '+j);
							//getMaxCardInArray
							// cc.log('-------test gameid '+gameId );
						    var cardMax = Utils.getMaxCardInArray(array, gameId);
						    var pointMax =Types.getPointAuto(cardMax.getCardData(), gameId);// cardMax.getCardData().getPointAuto(gameId);//array[array.length -1 ].getCardData().getPointAuto(gameId);
						     var suitMax = cardMax.getCardData().suit;//array[array.length -1 ].getCardData().suit;
						     // cc.log(`length ${array.length} pointMax ${pointMax} suitMax ${suitMax} `);
						    if(pointMax < _maxPoint){
						        //array tim duoc ko lon hon
						        //fail
								results.splice(0,results.length);
						        
						    }else if(pointMax == _maxPoint){
								if(gameId == Constant.GAME_ID.TLMN ){
									//sam ko phan biet suit => fail luon
									//so sanh _suit
									if(_suit > suitMax){
										//fail
										results.splice(0,results.length);
									}else{
										//lay array
										 results.push(array);
										 arrAllUse =arrAllUse.concat(arrUse);
									}
								}else if(gameId == Constant.GAME_ID.SAM ){
									results.splice(0,results.length);
								}
						        
						    }else{
						        //lay
						        results.push(array);
						        arrAllUse =arrAllUse.concat(arrUse);
						    }
						    
						    
				        }
	    
    }
	
	if(kq && kq.length){
		   kq.forEach(function(v, i){
			   results.push(v);
		   });	
		} 
	
    return results;         
};
Utils.isSamPoint = function(cardsDeaded){
	//cardsDeaded la array card tu server
	// theo server tra ve thi 0,1,2,3, la 4 con at'
	var pointTLMN = -1;
	var isSame = true;
	var maxSuit =-1;
	cardsDeaded.forEach(function(cId, i){
                        var cardComponent = Utils.getCardFromServer(cId);
						var cSuit = cardComponent.suit;
						maxSuit = (maxSuit < cSuit ? cSuit: maxSuit);
						if(pointTLMN < 0) pointTLMN = cardComponent.pointTLMN; 
						else{
							if(pointTLMN != cardComponent.pointTLMN){
								isSame =false;
							}
						}
    });
    return [isSame, pointTLMN, maxSuit];         
};
Utils.getCoupleToTuQuyBigger = function(_count,_pointTLMN, _suit, arrayCard, gameId){
		//arrayCard la Card component
	var results = []; //list cac doi, bo 3 , tu quy >  trong tham so truyen vao
	var length  = arrayCard.length;
	                if(_pointTLMN == 15 && _count ==2){//d oi 2
					//TLMN TU QUY CHAT DOI 2, SAM THI 2 TU QUY MOI CHAT DOI 2
	                  if(gameId == Constant.GAME_ID.TLMN) results= results.concat(Utils.getTuQuy(arrayCard));
					  else if(gameId == Constant.GAME_ID.SAM){
						  var listTQ = Utils.getTuQuy(arrayCard);
						  if(listTQ && listTQ.length ==2)
							 results= results.concat(listTQ);  
					  } 
	                }
	
                    for(var i =0;i<  length -1; i++){
						var arrayTuQuy = [];
                        arrayTuQuy.splice(0,arrayTuQuy.length);
                        var card1 = arrayCard[i];
                        var cardData1 = card1.getCardData();
						
                        if(cardData1.pointTLMN > _pointTLMN ){
							arrayTuQuy.push(card1);
							for(var j =i+1;j<  length; j++){
								var card2 = arrayCard[j];
								var cardData2 = card2.getCardData();
								if(cardData1.pointTLMN == cardData2.pointTLMN){
								   arrayTuQuy.push(card2);
								   
								}
							}
							if(arrayTuQuy.length >=_count){
                                results.push(arrayTuQuy);
                            }
						}else if(cardData1.pointTLMN == _pointTLMN && gameId == Constant.GAME_ID.TLMN){
							//tlmn moi check suit, sam ko  = point la ngang hang
							// doi so suit lon nhat, ko the co bo3,tu quy o day
							if(_count ==2){
								var maxSuit = cardData1.suit;
								arrayTuQuy.push(card1);
								for(var j =i+1;j<  length; j++){
									var card2 = arrayCard[j];
									var cardData2 = card2.getCardData();
									if(cardData1.pointTLMN == cardData2.pointTLMN){
									   arrayTuQuy.push(card2);
									   if(maxSuit < cardData2.suit) maxSuit = cardData2.suit;
									   break;
									}
								}
								if(arrayTuQuy.length == 2 && maxSuit > _suit)
									results.push(arrayTuQuy);	
							}
						} 
                        
                        
                        
                    }
	return results ;
};

////////////////MAU BINH/////////////////////////////
Utils.checkConboInChi3cardMB = function(chiTop){
 	for (var i = chiTop.length -1 ; i >= 0; i--) {
    		chiTop[i].resetCardComboId();
    	};
        var maxPoint= 0, maxPoint2 = 0;
        var value=1;
        var str;
        var c0 = chiTop[0].getCardData();
        maxPoint = c0.pointMB;
        maxPoint2= c0.pointMB;
        for(var i = 1 ; i < chiTop.length; i++){
            var c = chiTop[i].getCardData();
            if(c0.pointMB == c.pointMB){
              value++;
              chiTop[0].setCardComboIdBitWise(CARD_COMBO.NOT_NORMAL);
              chiTop[i].setCardComboIdBitWise(CARD_COMBO.NOT_NORMAL);
            }else 
              maxPoint = maxPoint < c.pointMB ? c.pointMB: maxPoint;
        }
        if(value ==1){
            var c1 = chiTop[1].getCardData();
            var c2 = chiTop[2].getCardData();
            if(c1.pointMB == c2.pointMB){
                value++;
                maxPoint2 = c1.pointMB;
                
                chiTop[1].setCardComboIdBitWise(CARD_COMBO.NOT_NORMAL);
                chiTop[2].setCardComboIdBitWise(CARD_COMBO.NOT_NORMAL);
            } 
        }
        var result;
        var chiSpriteIdx = 0;
        if(value ==1)  result = [false, 0, 'Mậu thầu', maxPoint]; //str = 'Mậu thầu';
        else if(value == 2){
            chiSpriteIdx =1;
            //str = 'Đôi';
            result = [true, chiSpriteIdx, 'Đôi', maxPoint2];
        } 
        else if(value == 3){
           str = 'Xám Chi'; 
            chiSpriteIdx =3;
             result = [true, chiSpriteIdx, 'Xám Chi', maxPoint2];
        } 
        
        //this.chiContainer.updateChi(2, chiSpriteIdx, str);
        return result;
    };



Utils.checkTotalSameCardMB = function(chiIdx, cards){
    	for (var i = cards.length -1 ; i >= 0; i--) {
    		cards[i].resetCardComboId();
    	};
        //cards phai duoc sort theo point truoc da
        //dung luôn cho xi to ham nay
        var maxPoint= 0, maxPoint2 =0, maxPoint3 =0, maxPoint4 =0;
        var resultPair=0;
        var resultThree=0;
        var resultFour=0;
        var value=1;
        var str;
        var arrUse =[];
		var arrCombo=[];
        var i =0;
        maxPoint = cards[0].getCardData().pointMB;
        while(i<cards.length-1){
            value=1;
            //arrUse.length=0;
            var c0 = cards[i].getCardData();
			arrCombo.push(cards[i]);
            maxPoint = maxPoint < c0.pointMB ? c0.pointMB: maxPoint;
            for(var j = i+1 ; j < cards.length; j++){
                var c = cards[j].getCardData();
                if(arrUse.length && arrUse.indexOf(j)>-1) continue;
                if(c0.pointMB === c.pointMB){
                   value++; 
                   arrUse.push(j);
					arrCombo.push(cards[j]);
                   cards[i].setCardComboIdBitWise(CARD_COMBO.NOT_NORMAL);
                   cards[j].setCardComboIdBitWise(CARD_COMBO.NOT_NORMAL);
                }
                
                // else{
                //     break;
                // }
            }
            
            if(value == 2){
                resultPair++;
                maxPoint2 = maxPoint2 < c0.pointMB ? c0.pointMB: maxPoint2;
				for(var k in arrCombo){
					arrCombo[k].resetCardComboId();
					arrCombo[k].setCardComboIdBitWise(CARD_COMBO.DOI);
				}
            } 
            else if(value == 3){
                resultThree++;
                maxPoint3 = maxPoint3 < c0.pointMB ? c0.pointMB: maxPoint3;
				for(var k in arrCombo){
					arrCombo[k].resetCardComboId();
					arrCombo[k].setCardComboIdBitWise(CARD_COMBO.BO_3);
				}
            } 
            
            else if(value == 4){
                resultFour++;
                maxPoint4 = maxPoint4 < c0.pointMB ? c0.pointMB: maxPoint4;
				for(var k in arrCombo){
					arrCombo[k].resetCardComboId();
					arrCombo[k].setCardComboIdBitWise(CARD_COMBO.TUQUY);
				}
            } 
            
            i++;

			arrCombo.splice(0,arrCombo.length);
			arrCombo.length = 0;
        }
        var result;
        if(resultFour ==1) {
            //this.chiContainer.updateChi(chiIdx, 7, 'Tứ Qúy');
            result = [true, 7,'Tứ Qúy', maxPoint4];
        }else if(resultThree === 1) {
            if(resultPair === 1) result = [true, 6, 'Cù Lũ', maxPoint3];//this.chiContainer.updateChi(chiIdx, 6, 'Cù Lũ');
            else result = [true, 3, 'Xám Chi', maxPoint3];//this.chiContainer.updateChi(chiIdx, 3, 'Xám Chi');
        }else if(resultPair >0){;
             if(resultPair ===2)  result = [true,  2, "Thú", maxPoint2];//this.chiContainer.updateChi(chiIdx, 2, "Thú" );
             else result = [true,  1, "Đôi", maxPoint2];//this.chiContainer.updateChi(chiIdx, 1, "Đôi" );
        }else{
            //check sanh, thung, thung pha sanh
            result = Utils.checkSequenceCardMB(chiIdx, cards);
            //var check = this.checkSequenceCardMB(chiIdx, cards);
            
           // if(!check) result = [true,  0, 'Mậu Thầu'];//this.chiContainer.updateChi(chiIdx,0, 'Mậu Thầu');
        }
        return result;
    };
Utils.checkSequenceCardMB = function(chiIdx, cards){
    	for (var i = cards.length -1 ; i >= 0; i--) {
    		cards[i].resetCardComboId();
    	};
        //cards phai duoc sort theo point truoc da
        if(chiIdx < 0 && cards.length < 5){
            // xi to check bai`
            return [false, 0,'Mậu thầu', maxPoint];
        } 
        var maxPoint=0;
        var isSameSuit=true;
        var isSequence=true;
        
        var c0 = cards[0].getCardData();
        maxPoint = c0.pointMB;
         var point = cards[0].getCardData().pointMB;
        for(var j = 1 ; j < cards.length; j++){
            var c = cards[j].getCardData();
            maxPoint = maxPoint < c.pointMB ? c.pointMB: maxPoint; 
            if(isSequence){
                
                if(j == (cards.length-1) && c.point ==1){//cay at' cuoi cung
                    var preCard = cards[j-1].getCardData();
                    if(preCard.pointMB !==5 && preCard.pointMB !==13 )  isSequence = false;
                    else{
                        if(preCard.pointMB ===5) maxPoint = 5;
                    }
                }else 
                if(point !== (c.pointMB -1)){
                    isSequence = false;
                }else{
                    point++;
                }
            }
            
            if(c0.suit !== c.suit){
                isSameSuit = false;
            }
        }
        var result;
        if(isSameSuit && isSequence) {
            result=[true, 8, 'Thùng phá sảnh',maxPoint];
            //this.chiContainer.updateChi(chiIdx,8, 'Thùng phá sảnh');
        }else if(isSameSuit) {
            // this.chiContainer.updateChi(chiIdx, 5,'Thùng');
             result=[true, 5, 'Thùng', maxPoint];
        }else if(isSequence){
            //  this.chiContainer.updateChi(chiIdx, 4,'Sảnh');
            result=[true, 4, 'Sảnh', maxPoint];
        }else{
             result=[false, 0,'Mậu thầu', maxPoint];
        }
        return result;
        
    };
////////////////END MAU BINH/////////////////////////////
Utils.getSaveVaule = function(key){
    
         var ls = cc.sys.localStorage;

        //This should save value "foo" on key "bar" on Local Storage
        var value = ls.getItem(key);
        if(value){
            return value;
        }
        // ls.setItem('username', username);
        // if(isSavePass) ls.setItem('password', pass);
        // else localStorage.removeItem('password');
    
    return null;
};

Utils.removeSaveVaule = function(key){
    
         var ls = cc.sys.localStorage;
        //This should save value "foo" on key "bar" on Local Storage
         ls.removeItem(key);
        
        // ls.setItem('username', username);
        // if(isSavePass) ls.setItem('password', pass);
        // else localStorage.removeItem('password');
    
};
Utils.setSaveVaule = function(key, value){
    
         var ls = cc.sys.localStorage;
         ls.setItem(key, value);
    
};

Utils.getMaxCardInArray= function(arr, gameId ){
	if(!gameId) gameId = Constant.GAME_ID.TLMN;
	//sam dung chung duoc luon
	var result =arr[0];
    arr.forEach(function(a, i){
		var data =a.getCardData();
		if(gameId === Constant.GAME_ID.TLMN){
			if(result.getCardData().pointTLMN < data.pointTLMN || (result.getCardData().pointTLMN == data.pointTLMN && result.getCardData().suit < data.suit  ) ){
				result = a;
			}
		}else{// sam
			if(result.getCardData().point < data.point  ){
				result = a;
			}
		}
		
	});
	return result;
};
Utils.getMinCardInArray= function(arr, gameId){
	if(!gameId) gameId = Constant.GAME_ID.TLMN;
	//sam dung chung duoc luon
	var result =arr[0];
    arr.forEach(function(a, i){
		var data =a.getCardData();
		if(result.getCardData().pointTLMN > data.pointTLMN || (result.getCardData().pointTLMN == data.pointTLMN && result.getCardData().suit > data.suit  ) ){
			result = a;
		}
	});
	return result;
};
/**
 *  returns
 * @param array
 * @param other
 * @returns {Array} the values from array that are not present in the other arrays.
 */
Utils.difference = function(array ,other){
	var theCopy = []; // An new empty array
	if(!array || !other) return theCopy;
	for (var i = 0, len = array.length; i < len; i++) {
		if(other.indexOf(array[i]) === -1)
		theCopy.push(array[i]);
	}
	return theCopy;
};
Utils.deepCoppyArray = function(arr1){
	var theCopy = []; // An new empty array
	for (var i = 0, len = arr1.length; i < len; i++) {
	    theCopy[i] = arr1[i];
	}
	return theCopy;
};
Utils.thongInsideThongArray = function(arrThongBig, arrThongSmall){
	var containt = true;
	for (var i = 0, len = arrThongSmall.length; i < len; i++) {
	    var index = arrThongBig.indexOf(arrThongSmall[i]);
	    if(index === -1){
			containt = false;
			break;
	    } 

	}
	return containt;
};
Utils.compare2arraysEqual= function (a, b) {
    var i = a.length;
    if (i != b.length) return false;
    while (i--) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};
Utils.loadAvatar = function(avatarLink, avatar, dataPlayer, itemAvatar){
	if(!itemAvatar) itemAvatar = null;
    if(avatarLink.indexOf('graph.facebook.com') !== -1){
            avatarLink = avatarLink.concat('&redirect=false');
            var xhr = new XMLHttpRequest();//cc.loader.getXMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {                // 4 = Response from server has been completely loaded.
                   if (xhr.status >= 200 && xhr.status <= 207) {
                        var httpStatus = xhr.statusText;
                        var response = xhr.responseText;
                        // cc.log(`response ${response}`);
                        var link = decode(response);
                        var avatarFbLink = link.data.url;
                        cc.loader.load(avatarFbLink, function(err, texture){
                            if(dataPlayer === null) return;
                            if(itemAvatar && itemAvatar.cancelAvatar) return;
                            var currAvatarLink;
                            if(itemAvatar !== null) currAvatarLink = dataPlayer.a.concat('&redirect=false');
                            else currAvatarLink = dataPlayer.avatar.concat('&redirect=false');
                            if(avatarLink !== currAvatarLink) return;
                            //if(itemAvatar) itemAvatar.avatarLink = avatarLink ;
                            var spriteFrame = new cc.SpriteFrame( texture);
                            if(avatar && avatar!=null && avatar.getComponent(cc.Sprite) ) avatar.getComponent(cc.Sprite).spriteFrame=spriteFrame; 
                        });
                   }
                }
            };
            //cc.log(`avatarLink ${avatarLink}`);
            xhr.open('GET', avatarLink);
            xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            xhr.send();
            
    }else{
    	avatarLink = avatarLink.replace("http://v1.api1bai247.info/", Constant.SERVER_IMG);
    	// console.log('avatarLink ** '+avatarLink);
        cc.loader.load(avatarLink, function(err, texture){
            if(dataPlayer === null) return;
            if(itemAvatar && itemAvatar.cancelAvatar) return;
            if(dataPlayer.a) dataPlayer.a = dataPlayer.a.replace("http://v1.api1bai247.info/", Constant.SERVER_IMG);
            if(itemAvatar !== null && avatarLink !== dataPlayer.a) return;
            if(dataPlayer.avatar) dataPlayer.avatar = dataPlayer.avatar.replace("http://v1.api1bai247.info/", Constant.SERVER_IMG);
            if(itemAvatar === null && avatarLink !== dataPlayer.avatar) return;
            //if(itemAvatar) itemAvatar.avatarLink = avatarLink ;
            var spriteFrame = new cc.SpriteFrame( texture);
            if(avatar && avatar!=null && avatar.getComponent(cc.Sprite) ) avatar.getComponent(cc.Sprite).spriteFrame=spriteFrame; 
            // if( dataPlayer.dn) cc.log('======== set avatar '+ dataPlayer.dn);
        });
    }
  
    
};
/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
Utils.shuffleArray = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};



