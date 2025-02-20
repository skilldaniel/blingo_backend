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
        const rtp = 1;

        console.log(`----------> action :: ${ action } ---------->`);
        let winSymbol = 0;
        let actionFlag = 0; // 0::SPIN, 1::CHOOSE_CELL, 2::COMPLETE, 3::NONE
        let totalSymbolWin = 0, chosenCellIdx = -1, bonusProfit = 0;;
        let symbolWinsInfo : Types.SymbolWinsType[] = [];
        let purpleGemIndexes : number[] = [];
        let superJokerIndexes: number[] = [];
        let freeSpinIndexes: number[] = [];
        let superJokerCells: number[] = [];
        let endGame = false;
        let isExtra = false;
        let response = {};
        let bonusReelInfo : any = {};

        let slingoWinInfo = {
            patterns : [] as number[],
            patternInfo : [] as any[]
        };
        
        if( action === "spin" || action === "chooseCell" ) {
            let matches : number[] = [];
            if( action === "spin" ) {
                let isJoker = false;
                let isPG = false;
                let pgCnt = 0;
                const gameMatches: number[] = [];
                userInfo.gameStatus.gameMatches.forEach(( num:number ) => {
                    gameMatches.push( userInfo.gameStatus.cells[num] );
                })
                if( userInfo.cheat.isCheat ) {
                    if( userInfo.cheat.cid>=userInfo.cheat.symbols.length ) {
                        userInfo.gameStatus.symbols = Functions.getEmptySymbols( userInfo.gameStatus.cells );
                    } else {
                        userInfo.gameStatus.symbols = userInfo.cheat.symbols[ userInfo.cheat.cid ];
                        userInfo.cheat.cid++;
                    }
                } else {
                    const symParam: any = {
                        cells : userInfo.gameStatus.cells,
                        purCount : userInfo.gameStatus.purCount,
                        gameMatches : gameMatches,
                    };
                    userInfo.gameStatus.symbols = Functions.getSymbols( symParam );
                    // if( ratio<( rtps[rtp-1]+0.02 ) ) {
                    //     const symParam: any = {
                    //         cells : userInfo.gameStatus.cells,
                    //         gameMatches : gameMatches
                    //     };
                    //     userInfo.gameStatus.symbols = Functions.getSymbols( symParam );
                    // } else {
                    //     userInfo.gameStatus.symbols = Functions.getEmptySymbols( userInfo.gameStatus.cells );
                    // }
                }

                if( userInfo.gameStatus.spinsRemaining===0 ) {
                    if( !userInfo.gameStatus.isPurchase && userInfo.gameStatus.purCount === -1 ) userInfo.gameStatus.isPurchase = true;
                    userInfo.gameStatus.purCount++;
                    if( userInfo.gameStatus.purCount===1 ) userInfo.gameStatus.fspSpinsRemaining--;
                    else if( userInfo.gameStatus.purCount>1 && !userInfo.gameStatus.isExtra ) userInfo.gameStatus.fpSpinsRemaining--;
                }

                if( userInfo.gameStatus.purCount===1 || userInfo.gameStatus.isExtra ) {
                    isExtra = userInfo.gameStatus.symbols.some( (num:any) => userInfo.gameStatus.cells.includes(num) );
                    if( !isExtra ) {
                        userInfo.gameStatus.symbols.length = 0;
                    } else {
                        userInfo.gameStatus.purCount=1;
                    }
                }
                
                userInfo.gameStatus.symbols.forEach(( symbol:string, idx:number) => {
                    if( symbol === "RJ" || symbol === "J" ) {
                        for( let i = 0; i<5; i++ ) {
                            if( !userInfo.gameStatus.gameMatches.includes( 5*i+idx ) && !isJoker ) {
                                isJoker = true;
                                break;
                            }
                        }
                    }
                })
                if( isJoker ) {
                    actionFlag = 1;
                    userInfo.gameStatus.isChoose = true;
                }
                if( userInfo.gameStatus.symbols.includes("PG") ) isPG = true;
                userInfo.gameStatus.symbols.forEach(( symbol:string, idx:number) => {
                    if( isNaN(parseFloat(symbol)) ) {
                        switch (symbol) {
                            case "J":
                            case "RJ":
                                if( isJoker ) {
                                    const isRow = Functions.checkRowCells( userInfo.gameStatus.gameMatches, idx );
                                    if( isRow===true ) userInfo.gameStatus.chooseTime++;
                                    userInfo.gameStatus.cells.forEach(( cell:number, ind:number ) => {
                                        if( ind%5 === idx && !userInfo.gameStatus.gameMatches.includes( ind ) ) {
                                            if( !userInfo.gameStatus.jokerIndexes.includes( idx ) ) userInfo.gameStatus.jokerIndexes.push( idx );
                                            userInfo.gameStatus.jokerCells.push( cell );
                                        }
                                    });
                                }
                                if( symbol==="RJ" && isPG ) purpleGemIndexes.push(idx), pgCnt++;
                                break;
                            case "PG":
                                pgCnt++;
                                if( !purpleGemIndexes.includes( idx ) ) purpleGemIndexes.push( idx );
                                break;
                            case "SJ": 
                                if( !superJokerIndexes.includes( idx ) ) {
                                    actionFlag = 1
                                    userInfo.gameStatus.cells.forEach(( cell:number, ind:number ) => {
                                        if( !userInfo.gameStatus.gameMatches.includes( ind ) ) {
                                            superJokerCells.push( cell );
                                        }
                                    });
                                    superJokerIndexes.push( idx );
                                }
                                break;
                            case "FS":
                                userInfo.gameStatus.spinsRemaining += 1;
                                userInfo.gameStatus.isFreeSpin = true;
                                userInfo.gameStatus.fsSpinsRemaining = 1;
                                userInfo.gameStatus.fsAwarded = 1;
                                freeSpinIndexes.push( idx );
                                break;
                        }
                    }
                })
                if( isPG && pgCnt>=3 ) {
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
                userInfo.gameStatus.spinMatches.length = 0;

                matches = Functions.getIdxMatchedSymbol( userInfo.gameStatus.cells, userInfo.gameStatus.symbols );
                if( matches.length>0 ) {
                    matches.forEach((matchPos:number) => {
                        if( !userInfo.gameStatus.gameMatches.includes( matchPos ) ) {
                            if( superJokerCells.length>0 ) {
                                superJokerCells = superJokerCells.filter( num=>num!=userInfo.gameStatus.cells[ matchPos ] );
                            }
                            if( userInfo.gameStatus.jokerCells.length>0 ) {
                                userInfo.gameStatus.jokerCells = userInfo.gameStatus.jokerCells.filter( (num:number)=>num!=userInfo.gameStatus.cells[ matchPos ] );
                            }
                            userInfo.gameStatus.gameMatches.push( matchPos );
                            userInfo.gameStatus.spinMatches.push( matchPos );
                        }
                    });

                }
            }
            if( action==="chooseCell" ) {
                chosenCellIdx = userInfo.gameStatus.cells.indexOf( actionParams.body.cellNumber );
                if( !userInfo.gameStatus.gameMatches.includes( chosenCellIdx ) ) {
                    userInfo.gameStatus.gameMatches.push( chosenCellIdx );
                    userInfo.gameStatus.spinMatches.push( chosenCellIdx );
                }
            }

            if( userInfo.gameStatus.spinMatches.length>0 ) {
                slingoWinInfo = Functions.checkSlingoWinLines( userInfo.gameStatus.matchPatterns, userInfo.gameStatus.gameMatches, userInfo.gameStatus.spinMatches );
                if( slingoWinInfo.patterns.length>0 ) {
                    userInfo.gameStatus.matchPatterns = new Set([ ...userInfo.gameStatus.matchPatterns, ...slingoWinInfo.patterns ]) ;
                    userInfo.gameStatus.matchPatterns = Array.from( userInfo.gameStatus.matchPatterns );
                }
            }
            if( userInfo.gameStatus.purCount >= 1 ) { // 0
                const priceParams: any = {
                    rtp : 1,
                    stake : userInfo.gameStatus.stake,
                    totalMatches : userInfo.gameStatus.gameMatches,
                    patternLength : userInfo.gameStatus.matchPatterns.length,
                }

                userInfo.gameStatus.fsStake = Functions.calcSpinPrice( priceParams );
            }
        }
        if( userInfo.gameStatus.gameMatches.length===25 ) {
            endGame = true;
            winSymbol = 12;
        } else if( userInfo.gameStatus.fpSpinsRemaining===0 ) {
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
                // console.log(`---> inc balance case 1`, userInfo.gameStatus);
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
        switch ( action ) {
            case "currentGame" :
                const cellInfo = Functions.getCells();
                userInfo.gameStatus.cells = cellInfo.cells;
                userInfo.gameStatus.fsStake = 0;
                userInfo.gameStatus.totalStake = 0;
                userInfo.gameStatus.isPurchase = false;
                userInfo.gameStatus.isFreeSpin = false;
                userInfo.gameStatus.purCount = -1;
                userInfo.gameStatus.fpSpinsRemaining = 40;
                userInfo.gameStatus.fspSpinsRemaining = 5;
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
                const spinParams = {
                    actionFlag  : actionFlag,
                    userId      : actionParams.body.userId,
                    patternInfo : slingoWinInfo.patternInfo,
                    bonusReelInfo : bonusReelInfo,
                    bonusProfit : bonusProfit,
                    gameInstanceId  : actionParams.body.gameInstanceId,
                    symbolWinsInfo  : symbolWinsInfo,
                    spinSymbolWin   : totalSymbolWin,
                    purpleGemIndexes: purpleGemIndexes,
                    freeSpinIndexes: freeSpinIndexes,
                    superJokerIndexes: superJokerIndexes,
                    superJokerCells : superJokerCells,
                    spinPrice   : userInfo.gameStatus.purCount >= 0 ? userInfo.gameStatus.fsStake : 0,
                    balance     : userInfo.balance,
                    currency    : userInfo.property.currency,
                    gameInfo    : userInfo.gameStatus,
                    matchPatterns   : userInfo.gameStatus.matchPatterns.length,
                };
                response = Functions.generateSpinResponse( spinParams );
                
                if( !isExtra ) userInfo.gameStatus.isExtra = false;
                else userInfo.gameStatus.isExtra = true;

                if( userInfo.gameStatus.purCount>=1 ) {
                    if( actionFlag === 0 ) {
                        if( userInfo.balance<userInfo.gameStatus.fsStake ) {
                            console.log('insuffcient balance');
                            return "insuffcient balance";
                        } else {
                            userInfo.gameStatus.totalStake = Math.round( userInfo.gameStatus.totalStake*100+userInfo.gameStatus.fsStake*100 ) / 100;
                            // console.log(`---> dec balance case 1 -`, userInfo.gameStatus.fsStake);
                            userInfo.balance = Math.round( userInfo.balance*100-userInfo.gameStatus.fsStake*100 )/100;
                            totalStake = Math.round( totalStake*100 + userInfo.gameStatus.fsStake*100 ) / 100;
                            ratio = Math.round( totalProfit*100/totalStake ) / 100;
                        }
                    }
                    await Models.updateUserBalance( userInfo.token, userInfo.balance )
                }
                if( userInfo.gameStatus.spinsRemaining > 0 ) userInfo.gameStatus.spinsRemaining--;
                break;
            case "chooseCell" :
                userInfo.gameStatus.chooseTime--;
                if( userInfo.gameStatus.chooseTime>0 ) {
                    actionFlag = 1;
                    userInfo.gameStatus.jokerIndexes = userInfo.gameStatus.jokerIndexes.filter((jId:number) => jId !== chosenCellIdx%5 );
                    if( userInfo.gameStatus.jokerIndexes.length===0 ) {
                        userInfo.gameStatus.chooseTime = -1;
                    } else {
                        userInfo.gameStatus.cells.forEach( ( cell:number, idx:number ) => {
                            if( idx%5 === chosenCellIdx%5 ) {
                                userInfo.gameStatus.jokerCells = userInfo.gameStatus.jokerCells.filter((jokerCell:number) => jokerCell !== cell );
                            }
                        })
                    }
                } else {
                    actionFlag = 0;
                    userInfo.gameStatus.isChoose = false;
                    userInfo.gameStatus.jokerCells.length = 0;
                    userInfo.gameStatus.jokerIndexes.length = 0;
                }
                if( userInfo.gameStatus.gameMatches.includes( chosenCellIdx ) ) {
                    if( userInfo.gameStatus.matchPatterns.length===12  ) {
                        winSymbol = 12;
                        actionFlag = 2;
                        const bsParams = {
                            winSymbol : 12,
                            stake : userInfo.gameStatus.stake
                        }
                        bonusReelInfo = Functions.generateBonusSpins( bsParams );
                        userInfo.gameStatus.chooseTime=-1;
                        bonusProfit = bonusReelInfo.bonusProfit;
                    }

                    const chooseParams = {
                        actionFlag  : actionFlag,
                        userId      : actionParams.body.userId,
                        spinSymbolWin   : totalSymbolWin,
                        gameInstanceId  : actionParams.body.gameInstanceId,
                        bonusReelInfo : bonusReelInfo,
                        symbolWinsInfo  : symbolWinsInfo,
                        purpleGemIndexes: purpleGemIndexes,
                        patternInfo   : slingoWinInfo.patternInfo,
                        superJokerIndexes: superJokerIndexes,
                        superJokerCells : superJokerCells,
                        balance     : userInfo.balance,
                        currency    : userInfo.property.currency,
                        spinPrice   : userInfo.gameStatus.purCount > 0 ? userInfo.gameStatus.fsStake : 0,
                        matchPatterns : userInfo.gameStatus.matchPatterns.length,
                        bonusProfit : actionFlag===2 ? bonusProfit : 0,
                        gameInfo    : userInfo.gameStatus,
                    };
                    response = Functions.generateChooseCellResponse( chooseParams );
                    if( userInfo.gameStatus.matchPatterns.length===12  ) {
                        console.log(`---> inc balance case 2-`, bonusProfit);
                        userInfo.balance = Math.round( userInfo.balance*100 + bonusProfit*100 ) / 100;
                        await Models.updateUserBalance( userInfo.token, userInfo.balance );
                    }
                }
                if( userInfo.gameStatus.purCount>=1 ) {
                    console.log(`---> dec balance case 2 -`, userInfo.gameStatus.fsStake );
                    userInfo.gameStatus.totalStake = Math.round( userInfo.gameStatus.totalStake*100+userInfo.gameStatus.fsStake*100 ) / 100;
                    userInfo.balance = Math.round( userInfo.balance*100-userInfo.gameStatus.fsStake*100 )/100;
                    await Models.updateUserBalance( userInfo.token, userInfo.balance )
                    totalStake = Math.round( totalStake*100+userInfo.gameStatus.fsStake*100 ) / 100;
                    ratio = Math.round( totalProfit*100/totalStake ) / 100;
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
                userInfo.gameStatus.fpSpinsRemaining = -1;
                userInfo.gameStatus.fspSpinsRemaining = 5;
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