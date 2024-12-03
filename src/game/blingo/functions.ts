import * as Contants from '@/game/blingo/constants';

export const generateFunToken = () => {
    round++;
    if (round > 100000) round = 0;
    const session = "fun@" + (Math.random() + 1).toString(36).substring(2) + String(round.toString(36)) + (Date.now().toString(36));
    return session;
}

export const getCurrentTime = () => {
    return new Date().getTime();
}
/**
 * gameRouter
 */
let round = 0, cid = 0, sid = 0, spid = 0 ;

export const getCells = () => {
    const cellsArr = [
        [ 5,25,31,53,61,7,22,43,55,65,11,18,38,46,74,3,21,33,49,64,13,26,40,56,71 ],
    ];
    const cells = cellsArr[ cid ];
    // cid++;
    return cells;
}

export const getSymbols = () => {
    const symbolsArr = [
        // ["1", "RJ", "41", "49", "65"], ["8", "RJ", "D", "J", "J"], ["PG", "PG", "PG", "49", "61"], 
        // ["PG", "D", "35", "56", "75"], ["9", "26", "31", "59", "69"], ["PG", "J", "33", "49", "70"],
        // ["12", "J", "45", "51", "64"], ["5", "26", "D", "58", "75"], ["11", "17", "38", "J", "69"], 
        // ["3", "30", "31", "56", "74"], 
        // // FREE_PURCHASE_SPIN
        // ["13", "27", "PG", "60", "70"], [],
        // ["D", "28", "31", "57", "PG"], ["9", "20", "38", "54", "PG"], ["11", "23", "43", "52", "68"], 
        // ["14", "24", "44", "D", "63"], ["15", "26", "J", "54", "64"],  
        // // purchase
        // ["9", "30", "PG", "J", "72"], ["J", "27", "34", "53", "64"], ["9", "26", "44", "46", "63"], 
        // ["5", "16", "36", "49", "74"], ["6", "23", "41", "57", "63"], ["15", "21", "42", "46", "72"], 
        // ["J", "16", "35", "57", "J"], ["15", "22", "PG", "PG", "73"], ["1", "16", "PG", "55", "68"], 
        // ["4", "22", "PG", "D", "69"], ["7", "28", "32", "57", "PG"], ["J", "PG", "PG", "55", "PG"], 
        // ["13", "18", "37", "53", "68"],
        ["10", "26", "40", "59", "75"], ["2", "22", "33", "60", "62"], ["3", "17", "40", "J", "70"],
        ["3", "17", "40", "J", "70"], ["2", "23", "D", "48", "65"], ["D", "24", "PG", "51", "66"],
        ["9", "D", "J", "56", "73"], ["2", "24", "31", "59", "63"], ["PG", "24", "PG", "56", "73"], 
        ["J", "21", "31", "59", "70"], ["PG", "22", "J", "54", "68"], ["15", "28", "PG", "49", "64"],
        [], ["12", "J", "40", "56", "66"]
    ];
    const symbols = symbolsArr[ sid ];
    sid++;
    return symbols;
}

export const calcSpinPrice = () => {
    const spinPrices = [ 0.62, 0.62, 0.62, 0.62, 1.27, 1.27, 1.27, 3.03, 3.03, 3.03, 8.47, 8.47, 8.47, 5.39, 5.39, 5.39, 5.39, 5.39, 5.39, 5.39, 5.39, 5.39, 5.39, 5.39, 5.39, 5.39, 5.39, 5.39, 5.39, 5.39, 5.39, 5.39, 5.39 ];
    spid++;
    return spinPrices[ spid ];
}

export const generateMatchePatterns = ( matchesArr:number[], cells:number[], patternInfo:any ) => {
    const matches : any[] = [];
    if( matchesArr.length > 0 ) {
        matchesArr.forEach(( no:number, idx:number ) => {
            let pattern : number[] = [];
            patternInfo.forEach((element:any) => {
                if( no === element.number ) {
                    pattern.push( element.patterns );
                }
            });
            const matchItem = {
                number : cells[ no ],
                pattern : pattern
            };
            matches.push( matchItem );
        });
    }

    return matches;
}

export const checkSlingoWinLines = ( gameMatches:number[], spinMatches : number[] ) => {
    const patterns  : number[] = [];
    const patternInfo   : any[] = [];
    if( gameMatches.length>5 ) {
        for( const key in Contants.SLINGOWINLINES ) {
            const winLine = Contants.SLINGOWINLINES[key];
            spinMatches.forEach(( idx:number ) => {
                if( winLine.includes( idx )) {
                    const isPattern = winLine.every( element => gameMatches.includes(element) );
                    if( isPattern ) {
                        patterns.push( Number(key) );
                        const patternItem = {
                            number : idx,
                            patterns : Number(key)
                        };
                        patternInfo.push( patternItem );
                    }
                }
            })
        }
    }
    return {
        patterns : patterns,
        patternInfo : patternInfo
    };
}

export const getIdxMatchedSymbol = ( cells:number[], symbols:string[] ) => {
    const matches : number[] = [];
    symbols.forEach((symbol:string) => {
        if( !isNaN(parseFloat(symbol)) ) {
            const idx = cells.indexOf(parseFloat(symbol));
            if( idx >= 0 ) {
                matches.push( idx );
            }
        }
    });
    return matches ;
}

export const generateStartGameResponse = (params: any) => {
    const response = {
        "game": {
            "userId": params.userId,
            "gameInstanceId": 88776505,
            "currencyCode": params.currency,
            "state": "STANDARD_SPIN",
            "action": "SPIN",
            "stake": params.stake,
            "totalStake": 0.5,
            "spinsRemaining": 10,
            "freeSpinsRemaining": 0,
            "freePurchaseSpinsRemaining": 5,
            "purchaseSpinsRemaining": 40,
            "freeSpinsAwarded": 0,
            "freePurchaseSpinsAwarded": 0,
            "ticket": {
                "id": params.ticketId,
                "rows": 5,
                "columns": 5,
                "cells": `${params.cells}`,
                "matches": "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0"
            },
            "spinPrice": 0,
            "matchedPatterns": 0,
            "totalPatternWin": 0,
            "totalSymbolWin": 0,
            "totalWin": 0
        },
        "balance": {
            "cash": params.balance,
            "bonus": 0,
            "total": params.balance,
            "currencyCode": params.currency
        },
        "wrapper": {
            "postWager": true,
            "winProcessorRsp": null,
            "activeBalance": "CASH"
        },
        "response": 0
    };
    return response;
}

export const generateBonusSpins = ( winSymbol:number ) => {
    let bonusProfit = 50;
    let expandFlag = false;
    const reels : number[][][] = [];
/*    
    const reels : number[][][] = [
        [ [ 8,5,4 ], [ 8,4,3 ], [ 4,12,3 ], [ 5,5,7 ], [ 6,3,7 ] ], 
        [ [ 7,6,8 ], [ 8,12,4 ], [ 12,12,12 ], [ 4,8,8 ], [ 3,6,7 ] ], 
        [ [ 6,4,5 ], [ 12,12,12 ], [ 12,12,12 ], [ 4,3,8 ], [ 4,7,4 ] ],
    ];
    
    reels.forEach( ( reels:number[][], ind:number ) => {
        console.log(`<------------------------------------------------------------------------->`);
        const flatReels = Array.from({ length:reels[0].length }, (_, i) => reels.map( row=>row[i]) ).flat();
        let expandFlag = false;
        console.log("flatReels", String(flatReels));
        if( flatReels.includes(12) ) {
            expandFlag = true;
            const expandPos = flatReels.reduce(( acc:number[], val:number, idx:number) => {
                if( val === 12 && !acc.includes(idx%5) ) acc.push( (idx%5) );
                return acc;
            }, []);
            console.log(`expandPos ${expandPos}`);
        }
    } );
*/
    if( winSymbol === 12 ) {
        expandFlag = true;
    }
    if( expandFlag ) {

    } else {

    }

    return {
        reels : reels,
        bonusProfit : bonusProfit
    }
}

export const generateSpinResponse = ( params: any ) => {
    const gameInfo = params.gameInfo;
    const matches = generateMatchePatterns( gameInfo.spinMatches, gameInfo.cells, params.patternInfo );
    let state = 0, spinType = 0;
    if( gameInfo.fsCount === 0 ) {
        state = 1;
    } else if( gameInfo.fsCount>0 ) {
        if( gameInfo.fsCount===1) state = 2, spinType = 2 ;
        if( gameInfo.fsCount > 1) state = 2, spinType = 3 ;
    } 

    if( params.actionFlag === 2 ) state = 3;

    let response = {
        "game": {
            "userId": params.userId,
            "gameInstanceId": params.gameInstanceId,
            "currencyCode": params.currency,
            "state": Contants.STATES[ state ],
            "action": Contants.ACTIONS[ params.actionFlag ],
            "stake": gameInfo.stake,
            "totalStake": gameInfo.totalStake,
            "spinsRemaining": gameInfo.spinsRemaining,
            "freeSpinsRemaining": 0,
            "freePurchaseSpinsRemaining": gameInfo.fspSpinsRemaining,
            "purchaseSpinsRemaining": gameInfo.fpSpinsRemaining,
            "freeSpinsAwarded": 0,
            "freePurchaseSpinsAwarded": gameInfo.fsCount > 0 ? 1 : 0,
            "spin": {
                "type": Contants.SPINTYPES[ spinType ],
                "symbols": gameInfo.symbols,
                "jokerIndexes": gameInfo.jokerIndexes,
                "jokerCells": gameInfo.jokerCells ,
                "superJokerIndexes": [],
                "superJokerCells": [],
                "respinIndexes": gameInfo.respinIndexes,
                "matches": matches,
                "symbolWins": params.symbolWinsInfo.length > 0 ? params.symbolWinsInfo : [],
                "totalSymbolWin": params.spinSymbolWin,
                "purpleGemIndexes": params.purpleGemIndexes,
                "freeSpinIndexes": []
            },
            "spinPrice": params.spinPrice,
            "matchedPatterns": params.matchPatterns,
            "totalPatternWin": params.bonusProfit,
            "totalSymbolWin": gameInfo.totalSymbolWin,
            "totalWin": Math.round( gameInfo.totalSymbolWin*100+params.bonusProfit*100 )/100,
        },
        "response": 0
    }

    if( params.actionFlag===2 ) {
        const winResp = {
            "symbolWins": gameInfo.symbolWins,
            "patternWin": {
                "amount": 50,
                "matchedPatterns": 12
            },
        };
        Object.assign( response.game, winResp );
        const bonusResp = {
            "bonus": {
                "gameInstanceId": params.gameInstanceId,
                "spins": [
                    {
                        "reels": [
                            {
                                "symbols": [
                                    "BAR",
                                    "GREEN_GEM",
                                    "ORANGE_GEM"
                                ]
                            },
                            {
                                "symbols": [
                                    "BAR",
                                    "ORANGE_GEM",
                                    "BLUE_GEM"
                                ]
                            },
                            {
                                "symbols": [
                                    "ORANGE_GEM",
                                    "EXPANDING_WILD",
                                    "BLUE_GEM"
                                ]
                            },
                            {
                                "symbols": [
                                    "GREEN_GEM",
                                    "GREEN_GEM",
                                    "SEVEN"
                                ]
                            },
                            {
                                "symbols": [
                                    "YELLOW_GEM",
                                    "BLUE_GEM",
                                    "SEVEN"
                                ]
                            }
                        ],
                        "expansionIndexes": [
                            2
                        ],
                        "expandedReels": [
                            {
                                "symbols": [
                                    "BAR",
                                    "GREEN_GEM",
                                    "ORANGE_GEM"
                                ]
                            },
                            {
                                "symbols": [
                                    "BAR",
                                    "ORANGE_GEM",
                                    "BLUE_GEM"
                                ]
                            },
                            {
                                "symbols": [
                                    "EXPANDING_WILD",
                                    "EXPANDING_WILD",
                                    "EXPANDING_WILD"
                                ]
                            },
                            {
                                "symbols": [
                                    "GREEN_GEM",
                                    "GREEN_GEM",
                                    "SEVEN"
                                ]
                            },
                            {
                                "symbols": [
                                    "YELLOW_GEM",
                                    "BLUE_GEM",
                                    "SEVEN"
                                ]
                            }
                        ],
                        "wins": [
                            {
                                "direction": "LEFT_TO_RIGHT",
                                "symbol": "BAR",
                                "index": 1,
                                "symbols": 3,
                                "amount": 2.5,
                                "multiplier": 50,
                                "triggers": [
                                    "1,0,0",
                                    "1,0,0",
                                    "1,0,0",
                                    "0,0,0",
                                    "0,0,0"
                                ]
                            },
                            {
                                "direction": "RIGHT_TO_LEFT",
                                "symbol": "SEVEN",
                                "index": 2,
                                "symbols": 3,
                                "amount": 1.25,
                                "multiplier": 25,
                                "triggers": [
                                    "0,0,1",
                                    "0,0,1",
                                    "0,0,1",
                                    "0,0,0",
                                    "0,0,0"
                                ]
                            },
                            {
                                "direction": "LEFT_TO_RIGHT",
                                "symbol": "ORANGE_GEM",
                                "index": 4,
                                "symbols": 3,
                                "amount": 0.35,
                                "multiplier": 7,
                                "triggers": [
                                    "0,0,1",
                                    "0,1,0",
                                    "1,0,0",
                                    "0,0,0",
                                    "0,0,0"
                                ]
                            },
                            {
                                "direction": "LEFT_TO_RIGHT",
                                "symbol": "BAR",
                                "index": 5,
                                "symbols": 3,
                                "amount": 2.5,
                                "multiplier": 50,
                                "triggers": [
                                    "1,0,0",
                                    "1,0,0",
                                    "0,1,0",
                                    "0,0,0",
                                    "0,0,0"
                                ]
                            },
                            {
                                "direction": "RIGHT_TO_LEFT",
                                "symbol": "SEVEN",
                                "index": 6,
                                "symbols": 3,
                                "amount": 1.25,
                                "multiplier": 25,
                                "triggers": [
                                    "0,0,1",
                                    "0,0,1",
                                    "0,1,0",
                                    "0,0,0",
                                    "0,0,0"
                                ]
                            }
                        ],
                        "totalWin": 7.85
                    },
                    {
                        "reels": [
                            {
                                "symbols": [
                                    "SEVEN",
                                    "YELLOW_GEM",
                                    "BAR"
                                ]
                            },
                            {
                                "symbols": [
                                    "BAR",
                                    "EXPANDING_WILD",
                                    "ORANGE_GEM"
                                ]
                            },
                            {
                                "symbols": [
                                    "EXPANDING_WILD",
                                    "EXPANDING_WILD",
                                    "EXPANDING_WILD"
                                ]
                            },
                            {
                                "symbols": [
                                    "ORANGE_GEM",
                                    "BAR",
                                    "BAR"
                                ]
                            },
                            {
                                "symbols": [
                                    "BLUE_GEM",
                                    "YELLOW_GEM",
                                    "SEVEN"
                                ]
                            }
                        ],
                        "expansionIndexes": [
                            1,
                            2
                        ],
                        "expandedReels": [
                            {
                                "symbols": [
                                    "SEVEN",
                                    "YELLOW_GEM",
                                    "BAR"
                                ]
                            },
                            {
                                "symbols": [
                                    "EXPANDING_WILD",
                                    "EXPANDING_WILD",
                                    "EXPANDING_WILD"
                                ]
                            },
                            {
                                "symbols": [
                                    "EXPANDING_WILD",
                                    "EXPANDING_WILD",
                                    "EXPANDING_WILD"
                                ]
                            },
                            {
                                "symbols": [
                                    "ORANGE_GEM",
                                    "BAR",
                                    "BAR"
                                ]
                            },
                            {
                                "symbols": [
                                    "BLUE_GEM",
                                    "YELLOW_GEM",
                                    "SEVEN"
                                ]
                            }
                        ],
                        "wins": [
                            {
                                "direction": "LEFT_TO_RIGHT",
                                "symbol": "YELLOW_GEM",
                                "index": 0,
                                "symbols": 3,
                                "amount": 0.5,
                                "multiplier": 10,
                                "triggers": [
                                    "0,1,0",
                                    "0,1,0",
                                    "0,1,0",
                                    "0,0,0",
                                    "0,0,0"
                                ]
                            },
                            {
                                "direction": "LEFT_TO_RIGHT",
                                "symbol": "SEVEN",
                                "index": 1,
                                "symbols": 3,
                                "amount": 1.25,
                                "multiplier": 25,
                                "triggers": [
                                    "1,0,0",
                                    "1,0,0",
                                    "1,0,0",
                                    "0,0,0",
                                    "0,0,0"
                                ]
                            },
                            {
                                "direction": "LEFT_TO_RIGHT",
                                "symbol": "BAR",
                                "index": 2,
                                "symbols": 4,
                                "amount": 10,
                                "multiplier": 200,
                                "triggers": [
                                    "0,0,1",
                                    "0,0,1",
                                    "0,0,1",
                                    "0,0,1",
                                    "0,0,0"
                                ]
                            },
                            {
                                "direction": "LEFT_TO_RIGHT",
                                "symbol": "SEVEN",
                                "index": 3,
                                "symbols": 3,
                                "amount": 1.25,
                                "multiplier": 25,
                                "triggers": [
                                    "1,0,0",
                                    "0,1,0",
                                    "0,0,1",
                                    "0,0,0",
                                    "0,0,0"
                                ]
                            },
                            {
                                "direction": "LEFT_TO_RIGHT",
                                "symbol": "BAR",
                                "index": 4,
                                "symbols": 4,
                                "amount": 10,
                                "multiplier": 200,
                                "triggers": [
                                    "0,0,1",
                                    "0,1,0",
                                    "1,0,0",
                                    "0,1,0",
                                    "0,0,0"
                                ]
                            },
                            {
                                "direction": "LEFT_TO_RIGHT",
                                "symbol": "SEVEN",
                                "index": 5,
                                "symbols": 3,
                                "amount": 1.25,
                                "multiplier": 25,
                                "triggers": [
                                    "1,0,0",
                                    "1,0,0",
                                    "0,1,0",
                                    "0,0,0",
                                    "0,0,0"
                                ]
                            },
                            {
                                "direction": "LEFT_TO_RIGHT",
                                "symbol": "BAR",
                                "index": 6,
                                "symbols": 4,
                                "amount": 10,
                                "multiplier": 200,
                                "triggers": [
                                    "0,0,1",
                                    "0,0,1",
                                    "0,1,0",
                                    "0,0,1",
                                    "0,0,0"
                                ]
                            },
                            {
                                "direction": "LEFT_TO_RIGHT",
                                "symbol": "YELLOW_GEM",
                                "index": 7,
                                "symbols": 3,
                                "amount": 0.5,
                                "multiplier": 10,
                                "triggers": [
                                    "0,1,0",
                                    "0,0,1",
                                    "0,0,1",
                                    "0,0,0",
                                    "0,0,0"
                                ]
                            },
                            {
                                "direction": "LEFT_TO_RIGHT",
                                "symbol": "YELLOW_GEM",
                                "index": 8,
                                "symbols": 3,
                                "amount": 0.5,
                                "multiplier": 10,
                                "triggers": [
                                    "0,1,0",
                                    "1,0,0",
                                    "1,0,0",
                                    "0,0,0",
                                    "0,0,0"
                                ]
                            },
                            {
                                "direction": "LEFT_TO_RIGHT",
                                "symbol": "YELLOW_GEM",
                                "index": 9,
                                "symbols": 3,
                                "amount": 0.5,
                                "multiplier": 10,
                                "triggers": [
                                    "0,1,0",
                                    "1,0,0",
                                    "0,1,0",
                                    "0,0,0",
                                    "0,0,0"
                                ]
                            }
                        ],
                        "totalWin": 35.75
                    },
                    {
                        "reels": [
                            {
                                "symbols": [
                                    "YELLOW_GEM",
                                    "ORANGE_GEM",
                                    "GREEN_GEM"
                                ]
                            },
                            {
                                "symbols": [
                                    "EXPANDING_WILD",
                                    "EXPANDING_WILD",
                                    "EXPANDING_WILD"
                                ]
                            },
                            {
                                "symbols": [
                                    "EXPANDING_WILD",
                                    "EXPANDING_WILD",
                                    "EXPANDING_WILD"
                                ]
                            },
                            {
                                "symbols": [
                                    "ORANGE_GEM",
                                    "BLUE_GEM",
                                    "BAR"
                                ]
                            },
                            {
                                "symbols": [
                                    "ORANGE_GEM",
                                    "SEVEN",
                                    "ORANGE_GEM"
                                ]
                            }
                        ],
                        "expansionIndexes": [
                            1,
                            2
                        ],
                        "expandedReels": [
                            {
                                "symbols": [
                                    "YELLOW_GEM",
                                    "ORANGE_GEM",
                                    "GREEN_GEM"
                                ]
                            },
                            {
                                "symbols": [
                                    "EXPANDING_WILD",
                                    "EXPANDING_WILD",
                                    "EXPANDING_WILD"
                                ]
                            },
                            {
                                "symbols": [
                                    "EXPANDING_WILD",
                                    "EXPANDING_WILD",
                                    "EXPANDING_WILD"
                                ]
                            },
                            {
                                "symbols": [
                                    "ORANGE_GEM",
                                    "BLUE_GEM",
                                    "BAR"
                                ]
                            },
                            {
                                "symbols": [
                                    "ORANGE_GEM",
                                    "SEVEN",
                                    "ORANGE_GEM"
                                ]
                            }
                        ],
                        "wins": [
                            {
                                "direction": "LEFT_TO_RIGHT",
                                "symbol": "ORANGE_GEM",
                                "index": 0,
                                "symbols": 3,
                                "amount": 0.35,
                                "multiplier": 7,
                                "triggers": [
                                    "0,1,0",
                                    "0,1,0",
                                    "0,1,0",
                                    "0,0,0",
                                    "0,0,0"
                                ]
                            },
                            {
                                "direction": "LEFT_TO_RIGHT",
                                "symbol": "YELLOW_GEM",
                                "index": 1,
                                "symbols": 3,
                                "amount": 0.5,
                                "multiplier": 10,
                                "triggers": [
                                    "1,0,0",
                                    "1,0,0",
                                    "1,0,0",
                                    "0,0,0",
                                    "0,0,0"
                                ]
                            },
                            {
                                "direction": "RIGHT_TO_LEFT",
                                "symbol": "ORANGE_GEM",
                                "index": 1,
                                "symbols": 4,
                                "amount": 0.75,
                                "multiplier": 15,
                                "triggers": [
                                    "1,0,0",
                                    "1,0,0",
                                    "1,0,0",
                                    "1,0,0",
                                    "0,0,0"
                                ]
                            },
                            {
                                "direction": "LEFT_TO_RIGHT",
                                "symbol": "GREEN_GEM",
                                "index": 2,
                                "symbols": 3,
                                "amount": 0.4,
                                "multiplier": 8,
                                "triggers": [
                                    "0,0,1",
                                    "0,0,1",
                                    "0,0,1",
                                    "0,0,0",
                                    "0,0,0"
                                ]
                            },
                            {
                                "direction": "LEFT_TO_RIGHT",
                                "symbol": "YELLOW_GEM",
                                "index": 3,
                                "symbols": 3,
                                "amount": 0.5,
                                "multiplier": 10,
                                "triggers": [
                                    "1,0,0",
                                    "0,1,0",
                                    "0,0,1",
                                    "0,0,0",
                                    "0,0,0"
                                ]
                            },
                            {
                                "direction": "LEFT_TO_RIGHT",
                                "symbol": "GREEN_GEM",
                                "index": 4,
                                "symbols": 3,
                                "amount": 0.4,
                                "multiplier": 8,
                                "triggers": [
                                    "0,0,1",
                                    "0,1,0",
                                    "1,0,0",
                                    "0,0,0",
                                    "0,0,0"
                                ]
                            },
                            {
                                "direction": "LEFT_TO_RIGHT",
                                "symbol": "YELLOW_GEM",
                                "index": 5,
                                "symbols": 3,
                                "amount": 0.5,
                                "multiplier": 10,
                                "triggers": [
                                    "1,0,0",
                                    "1,0,0",
                                    "0,1,0",
                                    "0,0,0",
                                    "0,0,0"
                                ]
                            },
                            {
                                "direction": "RIGHT_TO_LEFT",
                                "symbol": "ORANGE_GEM",
                                "index": 5,
                                "symbols": 4,
                                "amount": 0.75,
                                "multiplier": 15,
                                "triggers": [
                                    "1,0,0",
                                    "1,0,0",
                                    "0,1,0",
                                    "1,0,0",
                                    "0,0,0"
                                ]
                            },
                            {
                                "direction": "LEFT_TO_RIGHT",
                                "symbol": "GREEN_GEM",
                                "index": 6,
                                "symbols": 3,
                                "amount": 0.4,
                                "multiplier": 8,
                                "triggers": [
                                    "0,0,1",
                                    "0,0,1",
                                    "0,1,0",
                                    "0,0,0",
                                    "0,0,0"
                                ]
                            },
                            {
                                "direction": "LEFT_TO_RIGHT",
                                "symbol": "ORANGE_GEM",
                                "index": 7,
                                "symbols": 3,
                                "amount": 0.35,
                                "multiplier": 7,
                                "triggers": [
                                    "0,1,0",
                                    "0,0,1",
                                    "0,0,1",
                                    "0,0,0",
                                    "0,0,0"
                                ]
                            },
                            {
                                "direction": "LEFT_TO_RIGHT",
                                "symbol": "ORANGE_GEM",
                                "index": 8,
                                "symbols": 4,
                                "amount": 0.75,
                                "multiplier": 15,
                                "triggers": [
                                    "0,1,0",
                                    "1,0,0",
                                    "1,0,0",
                                    "1,0,0",
                                    "0,0,0"
                                ]
                            },
                            {
                                "direction": "LEFT_TO_RIGHT",
                                "symbol": "ORANGE_GEM",
                                "index": 9,
                                "symbols": 4,
                                "amount": 0.75,
                                "multiplier": 15,
                                "triggers": [
                                    "0,1,0",
                                    "1,0,0",
                                    "0,1,0",
                                    "1,0,0",
                                    "0,0,0"
                                ]
                            }
                        ],
                        "totalWin": 6.4
                    }
                ],
                "stake": gameInfo.stake,
                "totalWin": 50
            },            
        }
        Object.assign( response, bonusResp );
    }

    if( gameInfo.fsCount>1 ) {
        const fsResp = {
            "balance": {
                "cash": params.balance,
                "bonus": 0,
                "total": params.balance,
                "currencyCode": params.currency
            },
            "wrapper": {
                "postWager": true,
                "winProcessorRsp": null,
                "activeBalance": "CASH"
            }
        }
        Object.assign( response, fsResp );
    }
    return response;
}

export const generateChooseCellResponse = ( params:any ) => {
    const gameInfo = params.gameInfo;
    const matches = generateMatchePatterns( gameInfo.spinMatches, gameInfo.cells, params.patternInfo );
    let state = 0, spinType = 0;
    if( gameInfo.fsCount === 0 ) {
        state = 1;
    } else if( gameInfo.fsCount>0 ) {
        if( gameInfo.fsCount===1) state = 2, spinType = 2 ;
        if( gameInfo.fsCount > 1) state = 2, spinType = 3 ;
    } 

    const response = {
        "game": {
            "userId": params.userId,
            "gameInstanceId": params.gameInstanceId,
            "currencyCode": params.currency,
            "state": Contants.STATES[ state ],
            "action": Contants.ACTIONS[ params.actionFlag ],
            "stake": gameInfo.stake,
            "totalStake": gameInfo.totalStake,
            "spinsRemaining": ( gameInfo.spinsRemaining+1 ),
            "freeSpinsRemaining": 0,
            "freePurchaseSpinsRemaining": gameInfo.fspSpinsRemaining,
            "purchaseSpinsRemaining": gameInfo.fpSpinsRemaining,
            "freeSpinsAwarded": 0,
            "freePurchaseSpinsAwarded": gameInfo.isFreeSpin ? 1 : 0,
            "spin": {
                "type": Contants.SPINTYPES[ spinType ],
                "symbols": gameInfo.symbols,
                "jokerIndexes": gameInfo.jokerIndexes,
                "jokerCells": gameInfo.jokerCells,
                "superJokerIndexes": [],
                "superJokerCells": [],
                "respinIndexes": gameInfo.respinIndexes,
                "matches": matches,
                "symbolWins": params.symbolWinsInfo,
                "totalSymbolWin": params.spinSymbolWin,
                "purpleGemIndexes": params.purpleGemIndexes,
                "freeSpinIndexes": []
            },
            "spinPrice": params.spinPrice,
            "matchedPatterns": params.matchPatterns,
            "totalPatternWin": 0,
            "totalSymbolWin": gameInfo.totalSymbolWin,
            "totalWin": gameInfo.totalWin
        },
        "response": 0
    }
    return response;
}

export const generateCollectResponse = () => {
    const response = {
        "wrapper": {},
        "balance": {
            "cash": 999.5,
            "bonus": 0,
            "total": 999.5,
            "currencyCode": "EUR"
        },
        "game": {
            "userId": 24177383,
            "ticket": {
                "id": 686,
                "rows": 5,
                "columns": 5,
                "cells": "11,24,36,56,71,9,17,44,58,69,3,18,34,49,63,12,29,32,53,70,2,28,37,52,74",
                "matches": "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0"
            },
            "state": "PURCHASE_ENTRY"
        },
        "response": 0
    }
    // const response = collects[ ctid ];
    // ctid++;
    return response;
}

export const generateCurrentGameResponse = ( params:any ) => {
    const response = {
        "config": {
            "stake": {
                "amounts": [ 0.1, 0.2, 0.5, 1, 2, 5, 10, 25, 50, 100 ],
                "index": 2
            },
            "rows": 5,
            "columns": 5,
            "standardSpins": 10,
            "purchaseSpins": 40,
            "freePurchaseSpins": 5,
            "patterns": [{
                    "index": 0,
                    "columns": 5,
                    "rows": 5,
                    "sequence": "1111100000000000000000000"
                },
                {
                    "index": 1,
                    "columns": 5,
                    "rows": 5,
                    "sequence": "0000011111000000000000000"
                },
                {
                    "index": 2,
                    "columns": 5,
                    "rows": 5,
                    "sequence": "0000000000111110000000000"
                },
                {
                    "index": 3,
                    "columns": 5,
                    "rows": 5,
                    "sequence": "0000000000000001111100000"
                },
                {
                    "index": 4,
                    "columns": 5,
                    "rows": 5,
                    "sequence": "0000000000000000000011111"
                },
                {
                    "index": 5,
                    "columns": 5,
                    "rows": 5,
                    "sequence": "1000010000100001000010000"
                },
                {
                    "index": 6,
                    "columns": 5,
                    "rows": 5,
                    "sequence": "0100001000010000100001000"
                },
                {
                    "index": 7,
                    "columns": 5,
                    "rows": 5,
                    "sequence": "0010000100001000010000100"
                },
                {
                    "index": 8,
                    "columns": 5,
                    "rows": 5,
                    "sequence": "0001000010000100001000010"
                },
                {
                    "index": 9,
                    "columns": 5,
                    "rows": 5,
                    "sequence": "0000100001000010000100001"
                },
                {
                    "index": 10,
                    "columns": 5,
                    "rows": 5,
                    "sequence": "1000001000001000001000001"
                },
                {
                    "index": 11,
                    "columns": 5,
                    "rows": 5,
                    "sequence": "0000100010001000100010000"
                }
            ],
            "symbolPayouts": [{
                "id": "PURPLE_GEM",
                "payouts": [{
                        "symbols": 3,
                        "multiplier": 0.5
                    },
                    {
                        "symbols": 4,
                        "multiplier": 1
                    },
                    {
                        "symbols": 5,
                        "multiplier": 2.5
                    }
                ]
            }],
            "patternPayouts": [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            "instructions": {
                "reelSymbols": [ "3","18", "41", "55", "71" ],
                "jokerReelSymbols": [ "J", "18", "41", "55", "71" ],
                "ticket": {
                    "id": 0,
                    "rows": 5,
                    "columns": 5,
                    "cells": `${params.cells}`,
                    "matches": "0,0,1,1,1,0,1,1,1,0,0,1,1,1,1,0,1,1,0,0,1,1,1,1,1"
                }
            },
            "winThreshold": 100,
            "spinDuration": 2.5
        },
        "bonusConfig": {
            "rows": 3,
            "columns": 5,
            "reels": [{
                    "symbols": [
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "BAR",
                        "SEVEN",
                        "GREEN_GEM",
                        "BAR",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "BAR",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "BAR",
                        "BAR",
                        "SEVEN",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "BAR",
                        "BAR",
                        "SEVEN",
                        "BLUE_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "SEVEN",
                        "SEVEN",
                        "ORANGE_GEM",
                        "BAR",
                        "SEVEN",
                        "YELLOW_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "BAR",
                        "SEVEN",
                        "BAR",
                        "SEVEN",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "BAR",
                        "BAR",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "BAR",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "SEVEN",
                        "BAR",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "BAR",
                        "SEVEN",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "BAR",
                        "YELLOW_GEM",
                        "SEVEN",
                        "GREEN_GEM",
                        "BAR",
                        "BAR",
                        "SEVEN",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "SEVEN",
                        "GREEN_GEM",
                        "SEVEN",
                        "SEVEN",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "BAR",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "GREEN_GEM",
                        "SEVEN",
                        "BAR",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "SEVEN",
                        "SEVEN",
                        "BAR",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "BAR",
                        "YELLOW_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "SEVEN",
                        "BAR",
                        "BAR",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "SEVEN",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "BAR",
                        "BAR",
                        "ORANGE_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "BAR",
                        "ORANGE_GEM",
                        "BAR",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "BAR",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "BAR",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "SEVEN",
                        "SEVEN",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "SEVEN",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "BAR",
                        "SEVEN",
                        "SEVEN",
                        "SEVEN",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "BAR",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "SEVEN",
                        "BAR",
                        "BAR",
                        "SEVEN",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "SEVEN",
                        "ORANGE_GEM",
                        "BAR",
                        "BLUE_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "BAR",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "SEVEN"
                    ]
                },
                {
                    "symbols": [
                        "GREEN_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "SEVEN",
                        "BAR",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "BAR",
                        "BAR",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "SEVEN",
                        "BAR",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "SEVEN",
                        "SEVEN",
                        "GREEN_GEM",
                        "SEVEN",
                        "GREEN_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "SEVEN",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "BAR",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "SEVEN",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "SEVEN",
                        "GREEN_GEM",
                        "SEVEN",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "BLUE_GEM",
                        "SEVEN",
                        "SEVEN",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "BAR",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "BAR",
                        "BLUE_GEM",
                        "SEVEN",
                        "BAR",
                        "SEVEN",
                        "SEVEN",
                        "ORANGE_GEM",
                        "BAR",
                        "BAR",
                        "ORANGE_GEM",
                        "BAR",
                        "YELLOW_GEM",
                        "SEVEN",
                        "BAR",
                        "SEVEN",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "SEVEN",
                        "SEVEN",
                        "SEVEN",
                        "BAR",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "BAR",
                        "BAR",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "GREEN_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "SEVEN",
                        "BAR",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "BAR",
                        "SEVEN",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "BAR",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "SEVEN",
                        "BAR",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "BLUE_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "BAR",
                        "BAR",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "BAR",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "BAR",
                        "BAR",
                        "GREEN_GEM",
                        "SEVEN",
                        "GREEN_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "BAR",
                        "BAR",
                        "YELLOW_GEM",
                        "SEVEN",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "SEVEN",
                        "BAR",
                        "GREEN_GEM",
                        "BAR",
                        "GREEN_GEM",
                        "BAR",
                        "EXPANDING_WILD",
                        "ORANGE_GEM",
                        "BAR",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "SEVEN",
                        "BAR",
                        "BLUE_GEM"
                    ]
                },
                {
                    "symbols": [
                        "YELLOW_GEM",
                        "BAR",
                        "SEVEN",
                        "SEVEN",
                        "SEVEN",
                        "BAR",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "SEVEN",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "SEVEN",
                        "SEVEN",
                        "SEVEN",
                        "SEVEN",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "BAR",
                        "SEVEN",
                        "BAR",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "SEVEN",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "BAR",
                        "BAR",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "BAR",
                        "GREEN_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "SEVEN",
                        "BAR",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "BLUE_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "BAR",
                        "BAR",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "BAR",
                        "BAR",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "SEVEN",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "BAR",
                        "SEVEN",
                        "ORANGE_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "BAR",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "SEVEN",
                        "GREEN_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "BAR",
                        "SEVEN",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "SEVEN",
                        "GREEN_GEM",
                        "BAR",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "BLUE_GEM",
                        "SEVEN",
                        "SEVEN",
                        "YELLOW_GEM",
                        "SEVEN",
                        "SEVEN",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "SEVEN",
                        "BAR",
                        "BAR",
                        "SEVEN",
                        "SEVEN",
                        "BAR",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "BAR",
                        "SEVEN",
                        "ORANGE_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "BAR",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "EXPANDING_WILD",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "BAR",
                        "SEVEN",
                        "SEVEN",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "BAR",
                        "SEVEN",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "BAR",
                        "YELLOW_GEM",
                        "BAR",
                        "BAR",
                        "ORANGE_GEM",
                        "BAR",
                        "BAR",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "BAR",
                        "SEVEN",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "SEVEN",
                        "BAR",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM"
                    ]
                },
                {
                    "symbols": [
                        "BAR",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "SEVEN",
                        "ORANGE_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "BAR",
                        "SEVEN",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "BAR",
                        "SEVEN",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "BAR",
                        "BAR",
                        "SEVEN",
                        "GREEN_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "BAR",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "SEVEN",
                        "SEVEN",
                        "GREEN_GEM",
                        "SEVEN",
                        "GREEN_GEM",
                        "SEVEN",
                        "SEVEN",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "BAR",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "SEVEN",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "BAR",
                        "BAR",
                        "BAR",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "BAR",
                        "BAR",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "SEVEN",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "EXPANDING_WILD",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "SEVEN",
                        "SEVEN",
                        "SEVEN",
                        "BAR",
                        "BAR",
                        "SEVEN",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "SEVEN",
                        "BAR",
                        "BAR",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "BAR",
                        "BAR",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "BAR",
                        "BAR",
                        "BAR",
                        "BLUE_GEM",
                        "BAR",
                        "BAR",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "BAR",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "BAR",
                        "SEVEN",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "SEVEN",
                        "BAR",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "SEVEN",
                        "BAR",
                        "ORANGE_GEM",
                        "SEVEN",
                        "SEVEN",
                        "BAR",
                        "BAR",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "BAR",
                        "BLUE_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "SEVEN",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "SEVEN",
                        "GREEN_GEM",
                        "BAR",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "SEVEN",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "BAR",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "SEVEN",
                        "SEVEN",
                        "BAR",
                        "BAR",
                        "ORANGE_GEM"
                    ]
                },
                {
                    "symbols": [
                        "ORANGE_GEM",
                        "BAR",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "SEVEN",
                        "BAR",
                        "BAR",
                        "YELLOW_GEM",
                        "BAR",
                        "BAR",
                        "SEVEN",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "SEVEN",
                        "BAR",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "BAR",
                        "BLUE_GEM",
                        "SEVEN",
                        "SEVEN",
                        "GREEN_GEM",
                        "SEVEN",
                        "SEVEN",
                        "BAR",
                        "SEVEN",
                        "SEVEN",
                        "SEVEN",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "YELLOW_GEM",
                        "SEVEN",
                        "SEVEN",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "BAR",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "SEVEN",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "SEVEN",
                        "GREEN_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "BAR",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "BAR",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "SEVEN",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "BAR",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "BAR",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "BAR",
                        "GREEN_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "BAR",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "BAR",
                        "BLUE_GEM",
                        "BAR",
                        "BLUE_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "BAR",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "SEVEN",
                        "GREEN_GEM",
                        "BAR",
                        "SEVEN",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "SEVEN",
                        "SEVEN",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "SEVEN",
                        "BAR",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "BAR",
                        "BAR",
                        "GREEN_GEM",
                        "BAR",
                        "YELLOW_GEM",
                        "BAR",
                        "BAR",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "ORANGE_GEM",
                        "ORANGE_GEM",
                        "YELLOW_GEM",
                        "BAR",
                        "BAR",
                        "YELLOW_GEM",
                        "BAR",
                        "SEVEN",
                        "BAR",
                        "ORANGE_GEM",
                        "BAR",
                        "SEVEN",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "BLUE_GEM",
                        "ORANGE_GEM",
                        "SEVEN",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "SEVEN",
                        "SEVEN",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "ORANGE_GEM",
                        "BLUE_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "GREEN_GEM",
                        "SEVEN",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "BLUE_GEM",
                        "SEVEN",
                        "SEVEN",
                        "BAR",
                        "BLUE_GEM",
                        "BAR",
                        "BLUE_GEM",
                        "BAR",
                        "BAR",
                        "GREEN_GEM",
                        "SEVEN",
                        "GREEN_GEM",
                        "SEVEN",
                        "SEVEN",
                        "ORANGE_GEM",
                        "BAR",
                        "BAR",
                        "SEVEN",
                        "BAR",
                        "BAR",
                        "ORANGE_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "GREEN_GEM",
                        "YELLOW_GEM",
                        "YELLOW_GEM",
                        "BAR",
                        "BLUE_GEM",
                        "YELLOW_GEM",
                        "BAR",
                        "SEVEN",
                        "BLUE_GEM",
                        "SEVEN",
                        "YELLOW_GEM",
                        "SEVEN",
                        "ORANGE_GEM"
                    ]
                }
            ],
            "payouts": [{
                    "id": "BLUE_GEM",
                    "payouts": [{
                            "symbols": 3,
                            "multiplier": 5
                        },
                        {
                            "symbols": 4,
                            "multiplier": 10
                        },
                        {
                            "symbols": 5,
                            "multiplier": 25
                        }
                    ]
                },
                {
                    "id": "GREEN_GEM",
                    "payouts": [{
                            "symbols": 3,
                            "multiplier": 8
                        },
                        {
                            "symbols": 4,
                            "multiplier": 20
                        },
                        {
                            "symbols": 5,
                            "multiplier": 50
                        }
                    ]
                },
                {
                    "id": "YELLOW_GEM",
                    "payouts": [{
                            "symbols": 3,
                            "multiplier": 10
                        },
                        {
                            "symbols": 4,
                            "multiplier": 25
                        },
                        {
                            "symbols": 5,
                            "multiplier": 60
                        }
                    ]
                },
                {
                    "id": "BAR",
                    "payouts": [{
                            "symbols": 3,
                            "multiplier": 50
                        },
                        {
                            "symbols": 4,
                            "multiplier": 200
                        },
                        {
                            "symbols": 5,
                            "multiplier": 250
                        }
                    ]
                },
                {
                    "id": "ORANGE_GEM",
                    "payouts": [{
                            "symbols": 3,
                            "multiplier": 7
                        },
                        {
                            "symbols": 4,
                            "multiplier": 15
                        },
                        {
                            "symbols": 5,
                            "multiplier": 40
                        }
                    ]
                },
                {
                    "id": "SEVEN",
                    "payouts": [{
                            "symbols": 3,
                            "multiplier": 25
                        },
                        {
                            "symbols": 4,
                            "multiplier": 60
                        },
                        {
                            "symbols": 5,
                            "multiplier": 120
                        }
                    ]
                }
            ],
            "payLines": [{
                    "id": 0,
                    "indexes": [
                        1,
                        1,
                        1,
                        1,
                        1
                    ]
                },
                {
                    "id": 1,
                    "indexes": [
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "id": 2,
                    "indexes": [
                        2,
                        2,
                        2,
                        2,
                        2
                    ]
                },
                {
                    "id": 3,
                    "indexes": [
                        0,
                        1,
                        2,
                        1,
                        0
                    ]
                },
                {
                    "id": 4,
                    "indexes": [
                        2,
                        1,
                        0,
                        1,
                        2
                    ]
                },
                {
                    "id": 5,
                    "indexes": [
                        0,
                        0,
                        1,
                        0,
                        0
                    ]
                },
                {
                    "id": 6,
                    "indexes": [
                        2,
                        2,
                        1,
                        2,
                        2
                    ]
                },
                {
                    "id": 7,
                    "indexes": [
                        1,
                        2,
                        2,
                        2,
                        1
                    ]
                },
                {
                    "id": 8,
                    "indexes": [
                        1,
                        0,
                        0,
                        0,
                        1
                    ]
                },
                {
                    "id": 9,
                    "indexes": [
                        1,
                        0,
                        1,
                        0,
                        1
                    ]
                }
            ]
        },
        "wrapper": {},
        "balance": {
            "cash": params.balance,
            "bonus": 0,
            "total": params.balance,
            "currencyCode": params.currency
        },
        "game": {
            "userId": 24177383,
            "ticket": {
                "id": 100,
                "rows": 5,
                "columns": 5,
                "cells": `${params.cells}`,
                "matches": "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0"
            },
            "state": "PURCHASE_ENTRY"
        },
        "response": 0
    }
    return response;
}

/**
 * configRouter, cloudRouter
 */
export const generateOperatorAttrubute = () => {
    const response = {
        "tablet": {
            "dialog_enabled": "true",
            "show_elapsed_time": "false",
            "help_button_enabled": "true",
            "reality_check_enabled": "true",
            "force_stop_enabled": "true",
            "reality_check_options_enabled": "true",
            "orientation_enabled": "true",
            "clock_enabled": "false",
            "show_net_position": "false",
            "you_could_win": "false",
            "cma_enabled": "true",
            "options_enabled": "true",
            "detailed_game_history_enabled": "false",
            "show_meta_bar": "false"
        },
        "all": {
            "controller": "GamingRealmsController",
            "buy_feature_enabled": "false",
            "user_autocomplete_enabled": "true",
            "user_autocomplete_expiry_hours": "24",
            "integration": "gamingrealms",
            "parameters": "OperatorParameters",
            "deploy": "games"
        },
        "phone": {
            "show_elapsed_time": "false",
            "help_button_enabled": "true",
            "reality_check_enabled": "true",
            "force_stop_enabled": "true",
            "reality_check_options_enabled": "true",
            "orientation_enabled": "true",
            "clock_enabled": "false",
            "show_net_position": "false",
            "you_could_win": "false",
            "cma_enabled": "true",
            "options_enabled": "true",
            "detailed_game_history_enabled": "false",
            "show_meta_bar": "false"
        }
    };
    return response;
}

export const generateGamesAttribute = () => {
    const response = {
        "name": "Slingo Starburst",
        "gameId": 1435,
        "externalGameId": "slingo-starburst",
        "clientAttributes": {
            "client_path": "rogue/starburst"
        }
    };
    return response;
}

export const generaterealityCheckDetails = () => {
    const response = {
        "realityCheckInterval": 0,
        "totalSessionTime": 0,
        "nextRealityCheck": 0,
        "rsp": 0
    };
    return response;
}

export const generateUserLogin = ( params:any ) => {
    const now = getCurrentTime()
    const response = {
        "userId": 24177383,
        "username": "1732099498491",
        "st": "ACTIVE",
        "lastLoginDate": null,
        "timeZone": "America/New_York",
        "currentTime": now,
        "access_token": params.token,
        "rn": "Slingo Starburst",
        "rsp": 0
    };
    return response;
}