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
        console.log(`---------> action::${ action } --------->`);
        const rtp = 1;
        const _PG="PG", _RJ="RJ", _SJ="SJ", _J="J", _FS="FS", _D="D";
        
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
                userInfo.gameStatus.purCount = -1;
                userInfo.gameStatus.purRemaining = 40;
                userInfo.gameStatus.fsRemain = 0;
                userInfo.gameStatus.fpsSpinsRemaining = 5;
                userInfo.gameStatus.isChoose = false;
                userInfo.gameStatus.chooseTime = 0;
                userInfo.gameStatus.spinsRemaining = 10;
                userInfo.gameStatus.totalWin = 0;
                userInfo.gameStatus.totalSymbolWin = 0;

                userInfo.gameStatus.symbols.length = 0;
                userInfo.gameStatus.symbolWins.length = 0;
                userInfo.gameStatus.spinMatches.length = 0;
                userInfo.gameStatus.gameMatches.length = 0;
                userInfo.gameStatus.matchPatterns.length = 0;
                userInfo.gameStatus.jokerCells.length = 0;
                userInfo.gameStatus.jokerIndexes.length = 0;
                userInfo.gameStatus.respinIndexes.length = 0;

                const curParams = {
                    cells : userInfo.gameStatus.cells,
                    balance : userInfo.balance,
                    currency : userInfo.property.currency,
                    rtp : rtps[ rtp ],
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
                };
                response = Functions.generateStartGameResponse( gameParms );
                await Models.updateUserBalance( userInfo.token, userInfo.balance );
                break;
            case "spin" :
            case "chooseCell" :
                let symbolWinsInfo : Types.SymbolWinsType[] = [];
                let fsIndexes: number[] = [];
                let matches : number[] = [];
                let pgIndexes: number[] = [];
                let rsIndexes: number[] = [];
                let sjCells: number[] = [];
                let sjIndexes: number[] = [];
                let symbolWins: number[] = [];
                
                let isExtra = false;

                let slingoWinInfo = {
                    patterns : [] as number[],
                    patternInfo : [] as any[]
                };

                if( action==="spin" ) {
                    const symParam: any = {
                        cells : userInfo.gameStatus.cells,
                        purCount : userInfo.gameStatus.purCount,
                        gameMatches : [],
                        isExtra: userInfo.gameStatus.isExtra
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
                    if( userInfo.gameStatus.spinsRemaining>=0 ) userInfo.gameStatus.spinsRemaining--;
                    matches = Functions.getIdxMatchedSymbol( userInfo.gameStatus.cells, symbols );
                    if( matches.length>0 ) {
                        matches.forEach(( symb ) => {
                            if( !userInfo.gameStatus.gameMatches.includes( symb )) {
                                userInfo.gameStatus.gameMatches.push( symb );
                                userInfo.gameStatus.spinMatches.push( symb );
                                userInfo.gameStatus.matchedIdxs.push( userInfo.gameStatus.cells.indexOf( symb ));
                            }
                        })
                        console.log(`gameMatches=[${userInfo.gameStatus.gameMatches}]`);
                    }
                    
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
                        actionFlag = 1;
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
                        actionFlag = 1;
                    }
                    if( _hasRJ ) {
                        symbols.forEach((symb, idx) => {
                            if( symb===_RJ && Functions.checkRowCells( userInfo.gameStatus.matchedIdxs, idx )) {
                                rsIndexes.push( idx );
                            }
                        })
                        actionFlag = 1;
                    }
                    if( _hasPG ) {
                        symbols.forEach((symb, idx) => {
                            if( symb===_PG ) pgIndexes.push( idx );
                        })
                        pgIndexes.push( ...rsIndexes );
                        pgCnt = pgIndexes.length;
                    }
                    if( matches.length>0 ) {
                        matches.forEach((matchPos:number) => {
                            if( !userInfo.gameStatus.gameMatches.includes( matchPos ) ) {
                                if( _hasSJ ) {
                                    sjCells = sjCells.filter( num=>num!=userInfo.gameStatus.cells[ matchPos ] );
                                }
                                if( userInfo.gameStatus.jokerCells.length>0 ) {
                                    userInfo.gameStatus.jokerCells = userInfo.gameStatus.jokerCells.filter( (num:number)=>num!=userInfo.gameStatus.cells[ matchPos ] );
                                }
                                userInfo.gameStatus.gameMatches.push( matchPos );
                                userInfo.gameStatus.spinMatches.push( matchPos );
                            }
                        });
                    }
                    if( userInfo.gameStatus.isPurchase ) {
                        userInfo.gameStatus.fspSpinsRemaining--;
                    }
                    console.log(`spinRemain`, userInfo.gameStatus.spinsRemaining, userInfo.gameStatus.fsRemain, `symbols=[${symbols}]`);

                    const spinParams = {
                        actionFlag  : actionFlag,
                        userId      : actionParams.body.userId,
                        patternInfo : slingoWinInfo.patternInfo,
                        bonusReelInfo : bonusReelInfo,
                        bonusProfit : bonusProfit,
                        gameInstanceId  : actionParams.body.gameInstanceId,
                        symbolWinsInfo  : symbolWinsInfo,
                        spinSymbolWin   : totalSymbolWin,
                        purpleGemIndexes: pgIndexes,
                        freeSpinIndexes: fsIndexes,
                        superJokerIndexes: sjIndexes,
                        superJokerCells : sjCells,
                        spinPrice   : userInfo.gameStatus.purCount >= 0 ? userInfo.gameStatus.fsStake : 0,
                        balance     : userInfo.balance,
                        currency    : userInfo.property.currency,
                        gameInfo    : userInfo.gameStatus,
                        matchPatterns   : userInfo.gameStatus.matchPatterns.length,
                        isExtra : isExtra
                    }
                    response = Functions.generateSpinResponse( spinParams );
                    if( userInfo.gameStatus.spinsRemaining<0 ) {
                        if( userInfo.gameStatus.fsRemain>0 ) userInfo.gameStatus.fsRemain--;
                        if( userInfo.gameStatus.fsRemain===0 ) {
                            userInfo.gameStatus.isPurchase = true;
                        }
                    }
                }
                if( action==="chooseCell" ) {
                    if( userInfo.gameStatus.chooseTime>0 ) {
                        const chosenCell = actionParams.body.cellNumber;
                        const chosenIdx = userInfo.gameStatus.cells.indexOf( chosenCell );
                        if( !userInfo.gameStatus.gameMatches.includes(chosenCell)) {
                            userInfo.gameStatus.gameMatches.push( chosenCell );
                            userInfo.gameStatus.spinMatches.push( chosenCell );
                        }
                        if( userInfo.gameStatus.symbols[chosenIdx]===_J ) {
                            userInfo.gameStatus.jokerIndexes = userInfo.gameStatus.jokerIndexes.filter(( idx:number ) => idx !== chosenIdx );
                            userInfo.gameStatus.jokerCells.forEach(( cell:number ) => {
                                if( userInfo.gameStatus.cells.indexOf( cell )%5===chosenIdx ) {
                                    userInfo.gameStatus.jokerCells = userInfo.gameStatus.jokerCells.filter(( idx:number ) => idx!==cell );
                                }
                            })
                        }

                        const chooseParams = {
                            actionFlag  : actionFlag,
                            userId      : actionParams.body.userId,
                            spinSymbolWin   : totalSymbolWin,
                            gameInstanceId  : actionParams.body.gameInstanceId,
                            bonusReelInfo : bonusReelInfo,
                            symbolWinsInfo  : symbolWinsInfo,
                            purpleGemIndexes: pgIndexes,
                            freeSpinIndexes : [],
                            patternInfo   : slingoWinInfo.patternInfo,
                            superJokerIndexes: sjIndexes,
                            superJokerCells : sjCells,
                            balance     : userInfo.balance,
                            currency    : userInfo.property.currency,
                            spinPrice   : userInfo.gameStatus.purCount > 0 ? userInfo.gameStatus.fsStake : 0,
                            matchPatterns : userInfo.gameStatus.matchPatterns.length,
                            bonusProfit : actionFlag===2 ? bonusProfit : 0,
                            gameInfo    : userInfo.gameStatus,
                        };
                        response = Functions.generateChooseCellResponse( chooseParams );
                        userInfo.gameStatus.chooseTime--;
                    }
                }
                if( userInfo.gameStatus.chooseTime===0 ) {
                    userInfo.gameStatus.spinMatches.length = 0;
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
                    spinPrice   : userInfo.gameStatus.purCount >= 0 ? userInfo.gameStatus.fsStake : 0,
                    actionFlag : actionFlag,
                    bonusReelInfo : bonusReelInfo,
                    balance   : userInfo.balance,
                    currency  : userInfo.property.currency,
                    gameInfo  : userInfo.gameStatus,
                };
                response = Functions.generateCollectResponse( collectParams );
                if( winSymbol>0 ) {
                    console.log(`---> inc balance case 3`, userInfo.gameStatus.totalStake, bonusProfit);
                    userInfo.balance = Math.round( userInfo.balance*100 + bonusProfit*100+userInfo.gameStatus.fsStake*100 ) / 100;
                    await Models.updateUserBalance( userInfo.token, userInfo.balance );
                    actionFlag = 3;
                }
                userInfo.gameStatus.fsStake = 0;
                userInfo.gameStatus.totalStake = 0;
                userInfo.gameStatus.isPurchase = false;
                userInfo.gameStatus.purCount = -1;
                userInfo.gameStatus.purRemaining = -1;
                userInfo.gameStatus.fpsSpinsRemaining = 5;
                userInfo.gameStatus.isChoose = false;
                userInfo.gameStatus.spinsRemaining = 10;
                userInfo.gameStatus.totalWin = 10;
                userInfo.gameStatus.totalSymbolWin = 10;
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
        // if( action !== "currentGame" ) console.log(`----> ratio=${ratio} response ---->`, JSON.stringify( response ) );
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
            
            // userInfo["token"] = Functions.generateFunToken();
            userInfo.token = "fun@yyfexssupw1m3pohr1h" ;
            userInfo.balance = 10000;
            userInfo.property = {
                rtp : rtp,
                game : gameCode,
                lang : launcher.lang,
                user : launcher.user,
                currency : launcher.currency,
                mode : launcher.mode==="real" ? 1 : 0,
                lastId : "lastId"
            };

            await Models.addUser( userInfo );
            responseProvider = {
                error: 0,
                description: "Success",
                result: {
                    url: `http://${ process.env.HOST }:${ process.env.PORT }/blingo?gameId=slingo-starburst&gameMode=DEMO`
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