import * as Models from "@/common/models";
import * as Types from "@/game/types";
import * as Functions from "@/game/blingo/functions";
import * as Constants from "@/game/blingo/constants";

let totalStake = 0;
let totalProfit = 0;
let ratio = 0;

export const blingoService = {
    handleAction : async ( actionParams:any ) => {
        const rtps = [ 0.96, 0.94, 0.92 ];
        const token = actionParams.body.token;
        const userInfo = await Models.getUserInfo( token );
        if(userInfo === null) return Constants.ERRORDESCRIPTION[ 6 ];
        const action = actionParams.action;
        console.log(`--------> action::${ action } --------->`);

        const _PG="PG", _RJ="RJ", _SJ="SJ", _J="J", _FS="FS", _D="D";
        const rtp = 1;
        const prevActionFlag = action==="spin" ? 0 : action==="chooseCell" ? 1 : 2;
        let actionFlag = 0; // 0::SPIN, 1::CHOOSE_CELL, 2::COMPLETE, 3::NONE
        let winSymbol = 0, totalSymbolWin = 0, bonusProfit = 0;;

        let response = {};
        let bonusReelInfo : any = {};

        switch ( action ) {
            case "currentGame" :
                const cellInfo = Functions.getCells();
                userInfo.gameStatus.cells = cellInfo.cells;
                userInfo.gameStatus.fsStake = 0;
                userInfo.gameStatus.totalStake = 0;
                userInfo.gameStatus.isPurchase = false;
                userInfo.gameStatus.isFreeSpin = false;
                userInfo.gameStatus.isExtra = false;
                userInfo.gameStatus.fsCount = -1;
                userInfo.gameStatus.purCount = -1;
                userInfo.gameStatus.psRemaining = 40;
                userInfo.gameStatus.fsRemain = 0;
                userInfo.gameStatus.fpsSpinsRemaining = 5;
                userInfo.gameStatus.fpsSpinsCnt = 0;
                userInfo.gameStatus.isChoose = false;
                userInfo.gameStatus.chooseTime = 0;
                userInfo.gameStatus.spinsRemaining = 10;
                userInfo.gameStatus.totalWin = 0;
                userInfo.gameStatus.totalSymbolWin = 0;

                userInfo.gameStatus.symbols.length = 0;
                userInfo.gameStatus.symbolWins.length = 0;
                userInfo.gameStatus.gameMatches.length = 0;
                userInfo.gameStatus.matchedIdxs.length = 0;
                userInfo.gameStatus.spinMatches.length = 0;
                userInfo.gameStatus.spinIdxs.length = 0;
                userInfo.gameStatus.matchPatterns.length = 0;
                userInfo.gameStatus.jokerCells.length = 0;
                userInfo.gameStatus.jokerIndexes.length = 0;
                userInfo.gameStatus.respinIndexes.length = 0;

                const curParams = {
                    cells : userInfo.gameStatus.cells,
                    balance : userInfo.balance,
                    currency : userInfo.property.currency,
                    rtp : rtps[ rtp ],
                    userId : actionParams.body.userId,
                };

                response = Functions.generateCurrentGameResponse( curParams );
                break;
            case "startGame" :
                userInfo.gameStatus.stake = actionParams.body.stake;
                userInfo.gameStatus.totalStake = actionParams.body.stake;
                userInfo.balance = Math.round( userInfo.balance*100 - userInfo.gameStatus.stake*100 )/100;
                totalStake = Math.round( totalStake*100 + userInfo.gameStatus.stake*100 ) / 100;
                ratio = Math.round( totalProfit*100/totalStake ) / 100;
                const gameParms = {
                    balance : userInfo.balance,
                    cells   : userInfo.gameStatus.cells,
                    stake   : userInfo.gameStatus.stake,
                    userId  : actionParams.body.userId,
                    ticketId : actionParams.body.ticketId,
                    currency : actionParams.body.currencyCode,
                    gameId : actionParams.body.gameInstanceId,
                };
                response = Functions.generateStartGameResponse( gameParms );
                await Models.updateUserBalance( userInfo.token, userInfo.balance );
                break;
            case "spin" :
            case "chooseCell" :
                let symbolWinsInfo : Types.SymbolWinsType[] = [];
                let fsIndexes: number[] = [];
                let matches : number[] = [];
                let sjCells: number[] = [];
                let sjIndexes: number[] = [];
                
                let isRS = false, endGame = false;

                let slingoWinInfo = {
                    patterns : [] as number[],
                    patternInfo : [] as any[]
                };

                if( action==="spin" ) {
                    const symParam: any = {
                        cells : userInfo.gameStatus.cells,
                        isExtra: userInfo.gameStatus.isExtra,
                        isPurchase: userInfo.gameStatus.isPurchase,
                        fsAwarded : userInfo.gameStatus.fsAwarded,
                        spinsRemaining : userInfo.gameStatus.spinsRemaining
                    };
                    const symbols = Functions.getSymbols( symParam );
                    const _hasJ = symbols.includes(_J);
                    const _hasFS = symbols.includes(_FS);
                    const _hasSJ = symbols.includes(_SJ);
                    const _hasRJ = symbols.includes(_RJ);
                    const _hasPG = symbols.includes(_PG);
                    const _hasD = symbols.includes(_D);
                    
                    let pgCnt = 0;
                    userInfo.gameStatus.symbols = symbols;
                    userInfo.gameStatus.pgIndexes.length = 0;
                    userInfo.gameStatus.spinMatches.length==0

                    if( userInfo.gameStatus.spinsRemaining>=0 && !userInfo.gameStatus.isFreeSpin ) {
                        userInfo.gameStatus.spinsRemaining--;
                    }
                    matches = Functions.getIdxMatchedSymbol( userInfo.gameStatus.cells, symbols );
                    if( matches.length>0 ) {
                        matches.forEach(( symb ) => {
                            if( !userInfo.gameStatus.gameMatches.includes( symb )) {
                                const ind = userInfo.gameStatus.cells.indexOf( symb );
                                userInfo.gameStatus.gameMatches.push( symb );
                                userInfo.gameStatus.spinMatches.push( symb );
                                userInfo.gameStatus.matchedIdxs.push( ind );
                                userInfo.gameStatus.spinIdxs.push( ind );
                            }
                        })
                    } 
                    
                    if( !userInfo.gameStatus.isPurchase && userInfo.gameStatus.fsRemain===0 && userInfo.gameStatus.spinsRemaining<0 ) {
                        userInfo.gameStatus.isExtra = true; // extra spin mode
                    }
                    if( userInfo.gameStatus.isExtra && userInfo.gameStatus.spinMatches.length==0 ) {
                        userInfo.gameStatus.symbols.length = 0;
                    }
                    
                    if( userInfo.gameStatus.symbols.length===5 ) {
                        if( _hasFS ) {
                            symbols.forEach((symb, idx) => {
                                if( symb===_FS ) {
                                    fsIndexes.push( idx );
                                    userInfo.gameStatus.fsRemain++;
                                }
                            })
                            userInfo.gameStatus.fsAwarded = 1;
                        }
                        if( _hasJ ) {
                            symbols.forEach((symb, idx) => {
                                if( symb===_J && Functions.checkRowCells( userInfo.gameStatus.matchedIdxs, idx )) {
                                    userInfo.gameStatus.chooseTime++;
                                    userInfo.gameStatus.jokerIndexes.push( idx );
                                    userInfo.gameStatus.cells.forEach(( cell:number, ind:number ) => {
                                        if( ind%5===idx && !userInfo.gameStatus.gameMatches.includes(cell)) {
                                            userInfo.gameStatus.jokerCells.push( cell );
                                        }
                                    })
                                }
                            })
                            if( userInfo.gameStatus.jokerCells.length>0 ) actionFlag = 1;
                        }
                        if( _hasSJ ) {
                            symbols.forEach((symb, idx) => {
                                if( symb===_SJ && Functions.checkRowCells( userInfo.gameStatus.matchedIdxs, idx ) ) {
                                    userInfo.gameStatus.chooseTime++;
                                    sjIndexes.push( idx );
                                }
                            })
                            userInfo.gameStatus.cells.forEach(( sym:number ) => {
                                if( !userInfo.gameStatus.gameMatches.includes( sym )) {
                                    sjCells.push( sym );
                                }
                            })
                            if( sjCells.length>0 ) actionFlag = 1;
                        }
                        if( _hasRJ ) {
                            // isRS = _hasRJ;
                            userInfo.gameStatus.chooseTime++;
                            if( !_hasJ && !_hasSJ ) {
                                if( !_hasFS ) {
                                    isRS = true;
                                } else {
                                    userInfo.gameStatus.spinsRemaining++;
                                }
                            }
                            symbols.forEach((symb, idx) => {
                                if( symb===_RJ && Functions.checkRowCells( userInfo.gameStatus.matchedIdxs, idx )) {
                                    if( !userInfo.gameStatus.jokerIndexes.includes( idx )){ 
                                        if( !userInfo.gameStatus.respinIndexes.includes( idx )) userInfo.gameStatus.respinIndexes.push( idx );
                                        userInfo.gameStatus.jokerIndexes.push( idx );
                                        userInfo.gameStatus.pgIndexes.push( idx );
                                        userInfo.gameStatus.cells.forEach(( cell:number, ind:number ) => {
                                            if( ind%5===idx && !userInfo.gameStatus.gameMatches.includes(cell)) {
                                                userInfo.gameStatus.jokerCells.push( cell );
                                            }
                                        })
                                    }
                                }
                            })
                            if( userInfo.gameStatus.jokerCells.length>0 ) actionFlag = 1;
                        }
                        if( _hasPG ) {
                            symbols.forEach((symb, idx) => {
                                if( symb===_PG ) userInfo.gameStatus.pgIndexes.push( idx );
                            })
                            if( userInfo.gameStatus.respinIndexes.length>0 ) {
                                userInfo.gameStatus.respinIndexes.forEach((pos:number) => {
                                    if( !userInfo.gameStatus.pgIndexes.includes(pos) ) userInfo.gameStatus.pgIndexes.push( pos );
                                })
                            }
                            pgCnt = userInfo.gameStatus.pgIndexes.length;
                        }
    
                        if( pgCnt>=3 ) {
                            totalSymbolWin = Math.round( totalSymbolWin*100 + Constants.PAYTABLE[100][5-pgCnt]*userInfo.gameStatus.stake*100 )/100;
                            userInfo.gameStatus.totalSymbolWin = Math.round( userInfo.gameStatus.totalSymbolWin*100+totalSymbolWin*100 )/100;
                            userInfo.gameStatus.totalWin = Math.round( userInfo.gameStatus.totalWin*100+totalSymbolWin*100 )/100;
                            const symbolWinItem : Types.SymbolWinsType = {
                                symbols : 3,
                                amount : totalSymbolWin,
                                type : Constants.SYMBOLDICT[100]
                            };
                            userInfo.gameStatus.symbolWins.push( symbolWinItem );
                            symbolWinsInfo.push( symbolWinItem );
                        }
                        
                        if( matches.length>0 ) {
                            matches.forEach((matchPos:number) => {
                                if( !userInfo.gameStatus.gameMatches.includes( matchPos )) {
                                    const ind = userInfo.gameStatus.cells.indexOf( matchPos );
                                    if( _hasSJ ) {
                                        sjCells = sjCells.filter( num=>num!=userInfo.gameStatus.cells[ matchPos ] );
                                    }
                                    if( userInfo.gameStatus.jokerCells.length>0 ) {
                                        userInfo.gameStatus.jokerCells = userInfo.gameStatus.jokerCells.filter( (num:number)=>num!=userInfo.gameStatus.cells[ matchPos ] );
                                    }
                                    userInfo.gameStatus.gameMatches.push( matchPos );
                                    userInfo.gameStatus.matchedIdxs.push( ind );
                                    userInfo.gameStatus.spinMatches.unshift( matchPos );
                                    userInfo.gameStatus.spinIdxs.unshift( ind );
                                }
                            });
                        }
                    }

                    console.log(`------>>> spinRemain`, userInfo.gameStatus.spinsRemaining, `symbols=[${symbols}], spinMatches=[${userInfo.gameStatus.spinMatches}], isFreeSpin=${userInfo.gameStatus.isFreeSpin}`);
                }
                if( action==="chooseCell" ) {
                    if( userInfo.gameStatus.chooseTime>0 ) {
                        isRS = userInfo.gameStatus.symbols.includes(_RJ);
                        actionFlag = 1;
                        const chosenCell = actionParams.body.cellNumber;
                        const chosenIdx = userInfo.gameStatus.cells.indexOf( chosenCell );
                        const chosenIdxOfSymbol = chosenIdx%5;
                        console.log(`chosenIdxOfSymbol=${chosenIdxOfSymbol}`);
                        if( !userInfo.gameStatus.gameMatches.includes(chosenCell)) {
                            userInfo.gameStatus.gameMatches.push( chosenCell );
                            userInfo.gameStatus.matchedIdxs.push( chosenIdx );
                            userInfo.gameStatus.spinMatches.unshift( chosenCell );
                            userInfo.gameStatus.spinIdxs.unshift( chosenIdx );
                        }
                        if( userInfo.gameStatus.symbols[chosenIdxOfSymbol]===_J || userInfo.gameStatus.symbols[chosenIdxOfSymbol]===_RJ ) {
                            userInfo.gameStatus.jokerIndexes = userInfo.gameStatus.jokerIndexes.filter(( idx:number ) => idx !== chosenIdxOfSymbol );
                            if( userInfo.gameStatus.symbols[chosenIdxOfSymbol]===_RJ ) {
                                isRS = true;
                                userInfo.gameStatus.respinIndexes = userInfo.gameStatus.respinIndexes.filter(( idx:number ) => idx !== chosenIdxOfSymbol );
                            }
                            userInfo.gameStatus.jokerCells.forEach(( cell:number ) => {
                                if( userInfo.gameStatus.cells.indexOf( cell )%5===chosenIdxOfSymbol ) {
                                    userInfo.gameStatus.jokerCells = userInfo.gameStatus.jokerCells.filter(( idx:number ) => idx!==cell );
                                }
                            })
                        }
                    }
                }

                if( userInfo.gameStatus.spinMatches.length>0 ) {
                    slingoWinInfo = Functions.checkSlingoWinLines( userInfo.gameStatus.matchPatterns, userInfo.gameStatus.matchedIdxs, userInfo.gameStatus.spinIdxs );
                    if( slingoWinInfo.patterns.length>0 ) {
                        userInfo.gameStatus.matchPatterns = new Set([ ...userInfo.gameStatus.matchPatterns, ...slingoWinInfo.patterns ]) ;
                        userInfo.gameStatus.matchPatterns = Array.from( userInfo.gameStatus.matchPatterns );
                    }
                }
                if( userInfo.gameStatus.gameMatches.length===25 ) {
                    endGame = true;
                    winSymbol = 12;
                }
                if( userInfo.gameStatus.psRemaining===0 ) {
                    endGame = true;
                    winSymbol = userInfo.gameStatus.matchPatterns.length;
                }
                if( endGame ) {
                    actionFlag = 2;
                    const bsParams = {
                        winSymbol : winSymbol,
                        stake : userInfo.gameStatus.stake
                    }
                    if( winSymbol>2 ) {
                        bonusReelInfo = Functions.generateBonusSpins( bsParams );
                        bonusProfit = bonusReelInfo.bonusProfit;
                        userInfo.balance = Math.round( userInfo.balance*100+userInfo.gameStatus.totalSymbolWin*100+bonusProfit*100 )/100;
                    } else {
                        actionFlag = 4;
                    }
                    userInfo.gameStatus.chooseTime=-1;
                    userInfo.gameStatus.isChoose=false;
                    if( userInfo.cheat.isCheat ) {
                        userInfo.cheat.isCheat = false;
                        userInfo.cheat.cid = 0;
                        userInfo.cheat.cells.length = 0;
                        userInfo.cheat.symbols.length = 0;
                    }
                }
                if( action==="spin" ) {
                    let endExtra = false;
                    if( !userInfo.gameStatus.isPurchase ) {
                        if( userInfo.gameStatus.fsRemain===0 ) {
                            if( userInfo.gameStatus.spinsRemaining<0 ) {
                                userInfo.gameStatus.isFreeSpin = false;
                                userInfo.gameStatus.fpsSpinsCnt++;
                                userInfo.gameStatus.fpsSpinsRemaining--;
                                if( userInfo.gameStatus.symbols.length===0 || userInfo
                                    .gameStatus.fpsSpinsRemaining===0 ) {
                                    endExtra = true;
                                    // userInfo.gameStatus.fpsSpinsRemaining = 0; // for slingo, not for blingo
                                    const priceParams: any = {
                                        rtp : 1,
                                        stake : userInfo.gameStatus.stake,
                                        totalMatches : userInfo.gameStatus.gameMatches,
                                        patternLength : userInfo.gameStatus.matchPatterns.length,
                                    }
                                    userInfo.gameStatus.fsStake = Functions.calcSpinPrice( priceParams );
                                }
                            }
                        } else if ( userInfo.gameStatus.fsRemain>0 ) {
                            if( userInfo.gameStatus.spinsRemaining===0 ) {
                                userInfo.gameStatus.isFreeSpin = true;
                                console.log(`set freeSpin`)
                            }
                        }
                    }
                    if( userInfo.gameStatus.isPurchase ) {
                        userInfo.gameStatus.totalStake = Math.round( userInfo.gameStatus.totalStake*100+userInfo.gameStatus.fsStake*100 ) / 100;
                        const priceParams: any = {
                            rtp : 1,
                            stake : userInfo.gameStatus.stake,
                            totalMatches : userInfo.gameStatus.gameMatches,
                            patternLength : userInfo.gameStatus.matchPatterns.length,
                        }
                        userInfo.gameStatus.fsStake = Functions.calcSpinPrice( priceParams );
                    }
                    const spinParams = {
                        prevActionFlag : prevActionFlag,
                        isRS : isRS,
                        actionFlag  : actionFlag,
                        userId      : actionParams.body.userId,
                        patternInfo : slingoWinInfo.patternInfo,
                        bonusReelInfo : bonusReelInfo,
                        bonusProfit : bonusProfit,
                        gameInstanceId  : actionParams.body.gameInstanceId,
                        symbolWinsInfo  : symbolWinsInfo,
                        spinSymbolWin   : totalSymbolWin,
                        freeSpinIndexes: fsIndexes,
                        superJokerIndexes: sjIndexes,
                        superJokerCells : sjCells,
                        spinPrice   : userInfo.gameStatus.fsStake,
                        balance     : userInfo.balance,
                        currency    : userInfo.property.currency,
                        gameInfo    : userInfo.gameStatus,
                        matchPatterns   : userInfo.gameStatus.matchPatterns.length
                    }
                    response = Functions.generateSpinResponse( spinParams );
                    if( userInfo.gameStatus.fsStake>0 ) {
                        userInfo.balance = Math.round(userInfo.balance*100 - userInfo.gameStatus.fsStake*100)/100;
                        await Models.updateUserBalance( userInfo.token, userInfo.balance );
                    }
                    if( userInfo.gameStatus.isFreeSpin ) {
                        userInfo.gameStatus.fsRemain--;
                        if( userInfo.gameStatus.fsRemain===0 ) userInfo.gameStatus.isFreeSpin=false;
                    }
                    if( userInfo.gameStatus.spinsRemaining<0 ) {
                        if( userInfo.gameStatus.fsRemain===0 ) {    
                            if( endExtra ){
                                userInfo.gameStatus.isExtra = false;
                                userInfo.gameStatus.isPurchase = true;
                            }
                        }
                    }
                    if( userInfo.gameStatus.isPurchase ) {
                        userInfo.gameStatus.psRemaining--;
                    }
                }

                if( action==="chooseCell" ) {
                    userInfo.gameStatus.chooseTime--;
                    if( userInfo.gameStatus.chooseTime===0 ) actionFlag = 0;
                    const chooseParams = {
                        prevActionFlag : prevActionFlag,
                        isRS : isRS,
                        actionFlag  : actionFlag,
                        userId      : actionParams.body.userId,
                        spinSymbolWin   : totalSymbolWin,
                        gameInstanceId  : actionParams.body.gameInstanceId,
                        bonusReelInfo : bonusReelInfo,
                        symbolWinsInfo  : symbolWinsInfo,
                        freeSpinIndexes : [],
                        patternInfo   : slingoWinInfo.patternInfo,
                        superJokerIndexes: sjIndexes,
                        superJokerCells : sjCells,
                        balance     : userInfo.balance,
                        currency    : userInfo.property.currency,
                        spinPrice   : userInfo.gameStatus.fsStake,
                        matchPatterns : userInfo.gameStatus.matchPatterns.length,
                        bonusProfit : actionFlag===2 ? bonusProfit : 0,
                        gameInfo    : userInfo.gameStatus
                    };
                    response = Functions.generateChooseCellResponse( chooseParams );
                }

                if( userInfo.gameStatus.chooseTime===0 ) {
                    userInfo.gameStatus.spinMatches.length = 0;
                    userInfo.gameStatus.spinIdxs.length = 0;
                }
                break;
            case "collect" :
                if( userInfo.gameStatus.matchPatterns.length>2 && actionFlag !== 2 ) {
                    actionFlag = 3;
                    winSymbol = userInfo.gameStatus.matchPatterns.length;
                    const bsParams = {
                        winSymbol : winSymbol,
                        stake : userInfo.gameStatus.stake
                    }
                    bonusReelInfo = Functions.generateBonusSpins( bsParams );
                    bonusProfit = bonusReelInfo.bonusProfit;
                    userInfo.gameStatus.totalWin = Math.round( userInfo.gameStatus.totalWin*100+bonusProfit*100 )/100 ;
                    totalProfit = Math.round( totalProfit*100+userInfo.gameStatus.totalWin*100+bonusProfit*100 )/100 ;
                    ratio = Math.round( totalProfit*100 / totalStake ) / 100;
                };
                if( userInfo.gameStatus.matchPatterns.length<=2 ) {
                    actionFlag = 0;
                }

                const collectParams : any = {
                    winSymbol : winSymbol,
                    spinPrice   : userInfo.gameStatus.fsStake,
                    actionFlag : actionFlag,
                    bonusReelInfo : bonusReelInfo,
                    balance   : userInfo.balance,
                    currency  : userInfo.property.currency,
                    gameInfo  : userInfo.gameStatus,
                };
                response = Functions.generateCollectResponse( collectParams );
                if( winSymbol>0 ) {
                    userInfo.balance = Math.round( userInfo.balance*100 + bonusProfit*100 ) / 100;
                    actionFlag = 3;
                }
                userInfo.balance = Math.round( userInfo.balance*100+userInfo.gameStatus.fsStake*100 ) / 100;
                await Models.updateUserBalance( userInfo.token, userInfo.balance );
                userInfo.gameStatus.fsStake = 0;
                userInfo.gameStatus.totalStake = 0;
                userInfo.gameStatus.isExtra = false;
                userInfo.gameStatus.purCount = -1;
                userInfo.gameStatus.psRemaining = -1;
                userInfo.gameStatus.fpsSpinsRemaining = 5;
                userInfo.gameStatus.isChoose = false;
                userInfo.gameStatus.spinsRemaining = 10;
                userInfo.gameStatus.totalWin = 0;
                userInfo.gameStatus.totalSymbolWin = 0;
                userInfo.gameStatus.cells.length = 0;
                userInfo.gameStatus.symbols.length = 0;
                userInfo.gameStatus.symbolWins.length = 0;
                userInfo.gameStatus.gameMatches.length = 0;
                userInfo.gameStatus.matchPatterns.length = 0;
                if( userInfo.cheat.isCheat ) {
                    userInfo.cheat.isCheat = false;
                    userInfo.cheat.cid = 0;
                    userInfo.cheat.cells.length = 0;
                    userInfo.cheat.symbols.length = 0;
                }
                break;
        }
        userInfo.gameStatus.gameMatches.sort( ( a:number,b:number )=> a-b );
        await Models.updateUserInfo( token, userInfo );
        return response;
    },
    
    handleOperation : async ( operationParams:any ) => {
        let response = {};
        switch ( operationParams.action ) {
            case 0 :
                response = Functions.generateOperatorAttrubute();
                break;
            case 1 :
                response  = Functions.generateGamesAttribute();
                break;       
            case 2 :
                response  = Functions.generaterealityCheckDetails();
                break;
            case 3 :
                const loginParams = {
                    token : "fun@yyfexssupw1m3pohr1h"
                };
                response  = Functions.generateUserLogin( loginParams );
                break;       
        }
        return response;
    },

    provideLauncher: async (launcher : any ) => {
        let responseProvider : any;
        const gameStr = launcher.game.split(/_(.+)/);
        const rtp = Number(gameStr[1]);
        if( rtp === 1 || rtp === 2 || rtp === 3) {
            const userInfo : any = {};
            const gameCode = gameStr[0];
                        
            userInfo["token"] = Functions.generateFunToken();
            userInfo.balance = 10000;
            userInfo.property = {
                rtp : rtp,
                game : gameCode,
                lang : launcher.lang,
                user : launcher.user,
                currency : launcher.currency,
                mode : launcher.mode==="real" ? 1 : 0,
                lastId : ""
            };

            await Models.addUser( userInfo );
            const hashVals = Functions.djb2Hash( userInfo["token"] );

            responseProvider = {
                error: 0,
                description: "Success",
                result: {
                    url: `http://${ process.env.HOST }:${ process.env.SERVER_PORT }/slingo?token=${userInfo.token}&userId=${ hashVals.userId}&gameId=${ hashVals.gameId }`
                    // url: `http://${ process.env.HOST }:${ process.env.FRONT_PORT }/blingo?gameId=slingo-starburst&gameMode=DEMO`
                }
            }
        } else {
            responseProvider = {
                error : 8,
                description : Constants.ERRORDESCRIPTION[8]
            }
        }
        return responseProvider;
    },

    testCheat : async( cheatData:any ) => {
        const userInfo = await Models.getUserInfo( cheatData.token );
        const actionList = [ "blingo3","blingo4","blingo5","blingo6","blingo7","blingo8","blingo9","blingo10","fullhouse" ];
        let retVal = false;
        if( actionList.includes(cheatData.action) ) {
            const cheatParams = {
                action : cheatData.action,
                stake : cheatData.stake
            };
            const simulateData = Functions.simulateGameByAction( cheatParams );
            userInfo.cheat.isCheat = true ;
            userInfo.cheat.cid = 0;
            userInfo.cheat.cells = simulateData.cells ;
            userInfo.cheat.symbols = simulateData.cheatSymbols ;
            const updateInfo = await Models.updateUserInfo( userInfo.token, userInfo );
            retVal = updateInfo.matchedCount>0 && updateInfo.modifiedCount>0 ? true : false
        }
        return {
            isCheat : retVal
        }
    }
}