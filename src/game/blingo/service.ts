import * as Models from "@/common/models";
import * as Types from "@/game/types";
import * as Functions from "@/game/blingo/functions";
import * as Constants from "@/game/blingo/constants";

// const jokerSymbols = [ "D", "J", "RJ", "PG" ];
let sid = 0;
export const blingoService = {
    handleAction : async ( actionParams:any ) => {
        const token = actionParams.body.token;
        const userInfo = await Models.getUserInfo( token );
        if(userInfo === null) return Constants.ERRORDESCRIPTION[ 6 ];
        const action = actionParams.action;
        const cells   : number[] = action === "currentGame"  ? Functions.getCells() : [];
        const symbols : string[] = action === "spin"  ? Functions.getSymbols() : [];
        console.log(`--------------------> action :: ${ action } ------------------------->`);

        let actionFlag = 0; // 0::SPIN, 1::CHOOSE_CELL,
        let totalSymbolWin = 0, spinPrice = 0, chosenCellIdx = -1;
        let symbolWinsInfo : Types.SymbolWinsType[] = [];
        let purpleGemIndexes : number[] = [];
        let response = {};
        let slingoWinInfo = {
            patterns : [] as number[],
            patternInfo : [] as any[]
        };

        if( symbols.length>0 ) {
            let isJoker = false;
            let pgCnt = 0;
            symbols.forEach(( symbol:string, idx:number) => {
                if( symbol === "RJ" || symbol === "J" ) {
                    for( let i = 0; i<5; i++ ) {
                        // console.log(`cell is ${ userInfo.gameStatus.cells[ 5*i+idx ] }, have it ? ${!userInfo.gameStatus.gameMatches.includes( 5*i+idx )}`)
                        if( !userInfo.gameStatus.gameMatches.includes( 5*i+idx ) ) {
                            if( !isJoker ) {
                                isJoker = true;
                                break;
                            }
                        }
                    }
                }
            })

            if( isJoker ) {
                actionFlag = 1;
                purpleGemIndexes = [ 1 ];
                userInfo.gameStatus.isChoose = true;
            }

            symbols.forEach(( symbol:string, idx:number) => {
                if( isNaN(parseFloat(symbol)) ) {
                    if( symbol === "RJ" || symbol === "J" ) {
                        // console.log("   **** ", isJoker);
                        if( isJoker ) {
                            userInfo.gameStatus.chooseTime++;
                            userInfo.gameStatus.cells.forEach(( cell:number, ind:number ) => {
                                if( ind%5 === idx && !userInfo.gameStatus.gameMatches.includes( ind ) ) {
                                    if( !userInfo.gameStatus.jokerIndexes.includes( idx ) ) userInfo.gameStatus.jokerIndexes.push( idx );
                                    userInfo.gameStatus.jokerCells.push( cell );
                                }
                            });
                        }
                    }
                    if( symbol == "PG" ) {
                        pgCnt++;
                        if( !purpleGemIndexes.includes( idx ) ) purpleGemIndexes.push( idx );
                    }
                }
            })

            if( pgCnt>=3 ) {
                totalSymbolWin = Math.round( totalSymbolWin*100 + Constants.PAYTABLE["pgCnt"][5-pgCnt]*0.5*100 )/100;
                userInfo.gameStatus.totalSymbolWin = Math.round( userInfo.gameStatus.totalSymbolWin*100+totalSymbolWin*100 )/100;
                userInfo.gameStatus.totalWin = Math.round( userInfo.gameStatus.totalWin*100+totalSymbolWin*100 )/100;
                const symbolwinItem : Types.SymbolWinsType = {
                    symbols : 3,
                    amount : totalSymbolWin,
                    type : Constants.SYMBOLTYPES[3]
                };
                symbolWinsInfo.push( symbolwinItem );
            }
        }

        if( action === "spin" || action === "chooseCell" ) {
            let matches : number[] = [];
            if( action==="spin" ) {
                userInfo.gameStatus.symbols = symbols;
                userInfo.gameStatus.spinMatches.length = 0;
                matches = Functions.getIdxMatchedSymbol( userInfo.gameStatus.cells, symbols );
            } else {
                chosenCellIdx = userInfo.gameStatus.cells.indexOf( actionParams.body.cellNumber );
            }
            
            if( action === "spin" && matches.length>0 ) {
                matches.forEach((matchPos:number) => {
                    if( !userInfo.gameStatus.gameMatches.includes( matchPos ) ) {
                        userInfo.gameStatus.gameMatches.push( matchPos );
                        userInfo.gameStatus.spinMatches.push( matchPos );
                    }
                });
            }

            if( action==="chooseCell" && !userInfo.gameStatus.gameMatches.includes( chosenCellIdx ) ) {
                userInfo.gameStatus.gameMatches.push( chosenCellIdx );
                userInfo.gameStatus.spinMatches.push( chosenCellIdx );
            }

            if( userInfo.gameStatus.spinMatches.length>0 ) {
                slingoWinInfo = Functions.checkSlingoWinLines( userInfo.gameStatus.gameMatches, userInfo.gameStatus.spinMatches );
                if( slingoWinInfo.patterns.length>0 ) {
                    userInfo.gameStatus.matchPatterns = new Set([ ...userInfo.gameStatus.matchPatterns, ...slingoWinInfo.patterns ]) ;
                    userInfo.gameStatus.matchPatterns = Array.from( userInfo.gameStatus.matchPatterns );
                }
            }

            if( userInfo.gameStatus.fsCount >= 0 ) spinPrice = Functions.calcSpinPrice();
        }

        switch ( action ) {
            case "currentGame" :
                userInfo.gameStatus.cells = cells;

                const curParams = {
                    cells : userInfo.gameStatus.cells,
                    balance : userInfo.balance,
                    currency : userInfo.property.currency
                };
                response = Functions.generateCurrentGameResponse( curParams );
                break;
            case "startGame" :
                userInfo.gameStatus.stake = actionParams.body.stake;
                userInfo.gameStatus.totalStake = actionParams.body.stake;

                userInfo.gameStatus.respinIndexes = [1];
                userInfo.balance = Math.round( userInfo.balance*100 - userInfo.gameStatus.stake*100 )/100;
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
                sid++;
                if( sid === 2 ) userInfo.gameStatus.respinIndexes = []

                if( userInfo.gameStatus.spinsRemaining === 0 ) {
                    if( !userInfo.gameStatus.isFreeSpin && userInfo.gameStatus.fsCount === -1 ) {
                        userInfo.gameStatus.isFreeSpin = true;
                    }

                    userInfo.gameStatus.fsCount++;
                    if( userInfo.gameStatus.fsCount===1 ) userInfo.gameStatus.fspSpinsRemaining = 0;
                    else if( userInfo.gameStatus.fsCount>1 ) userInfo.gameStatus.fpSpinsRemaining--;
                }

                if( userInfo.gameStatus.gameMatches.length===25 ) {
                    actionFlag = 2;
                }
                const spinParams = {
                    actionFlag  : actionFlag,
                    userId      : actionParams.body.userId,
                    gameInstanceId  : actionParams.body.gameInstanceId,
                    symbolWinsInfo  : symbolWinsInfo,
                    spinSymbolWin   : totalSymbolWin,
                    purpleGemIndexes: purpleGemIndexes,
                    patternInfo : slingoWinInfo.patternInfo,
                    spinPrice   : spinPrice,
                    balance     : userInfo.balance,
                    matchPatterns : userInfo.gameStatus.matchPatterns.length,
                    currency    : userInfo.property.currency,
                    gameInfo    : userInfo.gameStatus,
                };
                response = Functions.generateSpinResponse( spinParams );
                
                if( userInfo.gameStatus.fsCount>=1 ) {
                    userInfo.gameStatus.totalStake = Math.round( userInfo.gameStatus.totalStake*100+spinPrice*100 ) / 100;
                    userInfo.balance = Math.round( userInfo.balance*100-spinPrice*100 )/100;
                    await Models.updateUserBalance( userInfo.token, userInfo.balance )
                }

                if( userInfo.gameStatus.spinsRemaining > 0 ) userInfo.gameStatus.spinsRemaining--;
                break;
            case "chooseCell" :
                userInfo.gameStatus.chooseTime--;

                if( userInfo.gameStatus.chooseTime>0 ) {
                    actionFlag = 1;
                    userInfo.gameStatus.jokerIndexes = userInfo.gameStatus.jokerIndexes.filter((jId:number) => jId !== chosenCellIdx%5 );
                    userInfo.gameStatus.cells.forEach( ( cell:number, idx:number ) => {
                        if( idx%5 === chosenCellIdx%5 ) {
                            userInfo.gameStatus.jokerCells = userInfo.gameStatus.jokerCells.filter((jokerCell:number) => jokerCell !== cell );
                        }
                    })
                } else {
                    actionFlag = 0;
                    userInfo.gameStatus.isChoose = false;
                    userInfo.gameStatus.jokerCells.length = 0;
                    userInfo.gameStatus.jokerIndexes.length = 0;
                }

                if( userInfo.gameStatus.gameMatches.includes( chosenCellIdx ) ) {
                    if( userInfo.gameStatus.fsCount > 0 ) spinPrice = Functions.calcSpinPrice();

                    const chooseParams = {
                        actionFlag  : actionFlag,
                        userId      : actionParams.body.userId,
                        spinSymbolWin   : totalSymbolWin,
                        gameInstanceId  : actionParams.body.gameInstanceId,
                        symbolWinsInfo  : symbolWinsInfo,
                        purpleGemIndexes: purpleGemIndexes,
                        patternInfo   : slingoWinInfo.patternInfo,
                        spinPrice   : spinPrice,
                        balance     : userInfo.balance,
                        matchPatterns : userInfo.gameStatus.matchPatterns.length,
                        currency    : userInfo.property.currency,
                        gameInfo    : userInfo.gameStatus,
                    };
                    response = Functions.generateChooseCellResponse( chooseParams );
                }

                if( userInfo.gameStatus.fsCount>=1 ) {
                    userInfo.gameStatus.totalStake = Math.round( userInfo.gameStatus.totalStake*100+spinPrice*100 ) / 100;
                    userInfo.balance = Math.round( userInfo.balance*100-spinPrice*100 )/100;
                    // console.log("userInfo.balance - ", userInfo.balance);
                    await Models.updateUserBalance( userInfo.token, userInfo.balance )
                }
                break;
            case "collect" :
                response = Functions.generateCollectResponse();
                break;
        }
        if( action !== "currentGame" ) console.log("response", JSON.stringify( response ) );
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
            userInfo["token"] = "fun@yyfexssupw1m3pohr1h" ;
            userInfo["balance"] = 10000;
            userInfo["property"] = {
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
                "error": 0,
                "description": "Success",
                "result": {
                    "url": `http://${ process.env.HOST }:${ process.env.PORT }/blingo?gameId=slingo-starburst&gameMode=DEMO`
                }
            }
        } else {
            responseProvider = {
                "error" : 8,
                "description" : Constants.ERRORDESCRIPTION[8]
            }
        }
        return responseProvider;
    },
}
