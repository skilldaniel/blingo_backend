import * as Constants from '@/game/blingo/constants';

const getFloorRandom = ( len : number ) => {
    return Math.floor( Math.random()*len );
}

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
let round = 0, cid = 0, sid = 0, spid = 0, rid = 0 ;
const maxVal = 75, wild = 12;
const cellsArr = [
    [ 5,25,31,53,61, 7,22,43,55,65, 11,18,38,46,74,3,21,33,49,64,13,26,40,56,71 ],
];
const makeRandArr = ( orgArr:number[] ) => {
    for (let i = orgArr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [orgArr[i], orgArr[j]] = [orgArr[j], orgArr[i]];
    }
    return orgArr;
}

export const getCells = () => {
    let numbers = Array.from({ length: maxVal }, (_, i) => i + 1);
    numbers = makeRandArr( numbers );
    // const cells : number[] = numbers.slice(0, 25);
    const cells = cellsArr[ cid ];
    cid++;
    return cells;
}

export const getSymbols = ( params:any ) => {
    const symbolsArr = [
        ["1", "RJ", "41", "49", "65"], ["8", "RJ", "D", "J", "J"], ["PG", "PG", "PG", "49", "61"], 
        ["PG", "D", "35", "56", "75"], ["9", "26", "31", "59", "69"], ["PG", "J", "33", "49", "70"],
        ["12", "J", "45", "51", "64"], ["5", "26", "D", "58", "75"], ["11", "17", "38", "J", "69"], 
        ["3", "30", "31", "56", "74"], 
        // FREE_PURCHASE_SPIN
        ["13", "27", "PG", "60", "70"], [], ["D", "28", "31", "57", "PG"], ["9", "20", "38", "54", "PG"], 
        ["11", "23", "43", "52", "68"], ["14", "24", "44", "D", "63"], ["15", "26", "J", "54", "64"],  
        // purchase
        ["9", "30", "PG", "J", "72"], ["J", "27", "34", "53", "64"], ["9", "26", "44", "46", "63"], 
        ["5", "16", "36", "49", "74"], ["6", "23", "41", "57", "63"], ["15", "21", "42", "46", "72"], 
        ["J", "16", "35", "57", "J"], ["15", "22", "PG", "PG", "73"], ["1", "16", "PG", "55", "68"], 
        ["4", "22", "PG", "D", "69"], ["7", "28", "32", "57", "PG"], ["J", "PG", "PG", "55", "PG"], 
        ["13", "18", "37", "53", "68"],
        
        // ["10", "26", "40", "59", "75"], ["2", "22", "33", "60", "62"], ["3", "17", "40", "J", "70"],
        // ["2", "23", "D", "48", "65"], ["D", "24", "PG", "51", "66"],["9", "D", "J", "56", "73"], 
        // ["2", "24", "31", "59", "63"], ["PG", "24", "PG", "56", "73"], ["J", "21", "31", "59", "70"], 
        // ["PG", "22", "J", "54", "68"], ["15", "28", "PG", "49", "64"], [], ["12", "J", "40", "56", "66"], ["10", "18", "PG", "51", "74"], ["5", "29", "D", "52", "D"], ["3", "26", "33", "SJ", "PG"], 
        // ["D", "26", "32", "J", "64"], ["D", "PG", "41", "50", "67"], ["11", "24", "31", "48", "61"], 
        // ["8", "PG", "31", "PG", "71"], ["5", "PG", "PG", "49", "63"], ["10", "28", "J", "52", "73"]
    ];
    const numbers = Array.from({ length: maxVal }, (_, i) => i + 1);
    let misMatched = numbers.filter( num => !params.gameMatches.includes( num ) );
    misMatched = makeRandArr( misMatched );
    console.log(`symbols=`, misMatched.slice(0,5));
    const symbols = symbolsArr[ sid ];
    sid++;
    return symbols;
}

export const calcSpinPrice = () => {
    const spinPrices = [ 0.62, 1.27, 3.03, 8.47, 5.39 ];
    // const spinPrices = [ 0.03, 0.03, 0.06, 0.31, 0.33, 0.33, 0.61, 0.61, 0.54, 0.54, 0.71, 1.27, 1.27, 1.27, 2.79, 2.79 ];
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
        for( const key in Constants.SLINGOWINLINES ) {
            const winLine = Constants.SLINGOWINLINES[key];
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

const selectPayLine = ( idx:number ) => {
    const lines : { [key:number] : number[] } = {
        0 : [ 1,4,6 ],
        1 : [ 2,8,9,10 ],
        2 : [ 3,5,7 ]
    }
    return lines[idx][ getFloorRandom( lines[idx].length )];
}

const checkPayLines = ( reels:number[][][], stake:number ) => {
    // LEFT_TO_RIGHT
    let bonusProfit = 0;
    const reelPayInfo : any[] = [];

    reels.forEach((subReels:number[][], height:number) => {
        console.log(`subReels=`, subReels);
        const payInfo : any[] = [];
        for (const key in Constants.SLOTPAYLINES) {
            if( Constants.SLOTPAYLINES.hasOwnProperty(key) ) {
                const payItemLR : any = {
                    symbol : 0,
                    sameCnt : 0,
                    line : key,
                    direct : 0,
                    profit : 0
                };
                const line = Constants.SLOTPAYLINES[ key ];
                const reelKey = subReels[0][line[0]];
                let sameCnt = 1;
                for( let i=1; i<5; i++ ) {
                    if( subReels[ i ][ line[i] ] === reelKey || subReels[ i ][ line[i] ] === 12 ) sameCnt++;
                    else break;
                }
                if( sameCnt>=3 ) {
                    payItemLR.symbol = reelKey;
                    payItemLR.sameCnt = sameCnt;
                    payItemLR.profit = Math.round(stake*Constants.PAYTABLE[ reelKey ][ 5-sameCnt ]*10)/100;
                    console.log(`stake=${stake}, reelKey=${reelKey}, val=${Constants.PAYTABLE[ reelKey ][ 5-sameCnt ]} `);
                    bonusProfit = Math.round( bonusProfit*100 + payItemLR.profit*100 )/100;
                    payInfo.push(payItemLR);
                }
            }
        }
        reelPayInfo.push( payInfo );
    });
    // RIGHT_TO_LEFT
    return {
        payInfo : reelPayInfo,
        totalProfit : bonusProfit
    }
}

const generateTriggers = ( line:number, sameCnt:number ) => {
    const reelPos: number[][] = [ [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0] ];
    const triggers : string[] = [];
    for (let index = 0; index < sameCnt; index++) {
        reelPos[index][ Constants.SLOTPAYLINES[line][index] ]=1;
        triggers.push( String(reelPos[index]) );
    }
    for( let i=0; i<5-sameCnt; i++ ) {
        triggers.push( String([0,0,0]) );
    }
    return triggers;
};

// [ [  ], [  ], [  ], [  ], [  ] ],
const fsReels = [
    [ [ 8,5,4 ], [ 8,4,3 ], [ 4,12,3 ], [ 5,5,7 ], [ 6,3,7 ] ],
    [ [ 7,6,8 ], [ 8,12,4 ], [ 12,12,12 ], [ 4,8,8 ], [ 3,6,7 ] ],
    [ [ 6,4,5 ], [ 12,12,12 ], [ 12,12,12 ], [ 4,3,8 ], [ 4,7,4 ] ],
];

export const generateBonusSpins = ( winSymbol:number, stake:number ) => {
    let reels : number[][] = [];
    const fullReels = [ 3,4,5,6,7,8,12 ];
    const cntRand = Math.random();
    const maxCnt = 1 ;
    // const maxCnt = cntRand > 0.99 ? 3 : cntRand > 0.5 ? 2 : 1 ;
    const reelMrx : typeof reels[] = [];
    
    for( let i=0; i<maxCnt; i++ ) {
        for( let j=0; j<5; j++ ) {
            reels[ j ] = [];
            for( let k=0; k<3; k++ ) {
                let rand = getFloorRandom(( fullReels.length ));
                reels[ j ][ k ] = fullReels[ rand ];
            }
        }

        if( !reels[0].includes( winSymbol ) ) {
            reels[0][ getFloorRandom(3) ] = winSymbol;
        }
        const line = selectPayLine( reels[0].indexOf( winSymbol ) );
        const sameCnt = getFloorRandom( 3 )+3;
        console.log(`line=${line}, sameCnt=${sameCnt}`)
        for( let k=0; k<sameCnt; k++ ) {
            reels[ k ][ Constants.SLOTPAYLINES[line][k] ] = winSymbol;
        }
        reels = fsReels[ rid ];
        // rid++;
        reelMrx.push( [...reels] );
    }
    const payLineInfo = checkPayLines( reelMrx, stake );
    return {
        reelMrx : reelMrx,
        payLineInfo : payLineInfo.payInfo,
        bonusProfit : payLineInfo.totalProfit
    };
}

export const generateBonusResponse = ( params: any ) => {
    const symbolDict: { [ key:number ] : string } = {
        3 : "BLUE_GEM",
        4 : "ORANGE_GEM",
        5 : "GREEN_GEM",
        6 : "YELLOW_GEM",
        7 : "SEVEN",
        8 : "BAR",
        12 : "EXPANDING_WILD",
    };
    const directDict: { [ key:number ] : string } = {
        0 : "LEFT_TO_RIGHT",
        1 : "RIGHT_TO_LEFT"
    };
    const spins : any[] = [];

    params.bonusReelInfo.reelMrx.forEach((subReels: number[][], idx: number) => {
        let totalWin = 0;
        let hasExpand = false;
        const expansionIndexes : number[] = [];
        const subPayLineInfo = params.bonusReelInfo.payLineInfo[idx];
        const expandReels : any[] = [];
        const reels : any[] = [];
        const wins : any[]  = [];

        subReels.forEach(( item:number[], ind:number ) => {
            const symbolStr: string[] = [];
            const expSymbolStr: string[] = [];
            item.forEach(( no : number ) => {
                if( item.includes(12) ) {
                    if( !hasExpand ) hasExpand = true;
                    if( !expansionIndexes.includes( ind ) ) expansionIndexes.push( ind );
                    expSymbolStr.push( symbolDict[12] );
                } else {
                    expSymbolStr.push( symbolDict[no] );
                }
                symbolStr.push( symbolDict[no] );
            })
            reels.push( { symbols : symbolStr } );
            expandReels.push( { symbols : expSymbolStr } );
        });

        subPayLineInfo.forEach((payItem:any)=>{
            const winItem = {
                direction: directDict[ payItem.direct ],
                symbol: symbolDict[ payItem.symbol ],
                index: payItem.line,
                symbols: payItem.sameCnt,
                amount: payItem.profit,
                multiplier: Constants.PAYTABLE[ payItem.symbol ][ 5-payItem.sameCnt ],
                triggers: generateTriggers( payItem.line, payItem.sameCnt )
            }
            totalWin = Math.round(totalWin*100+payItem.profit*100)/100;
            wins.push( winItem );
        })

        const subSpin = {
            reels : reels,
            expansionIndexes : expansionIndexes,
            wins : wins,
            totalWin : totalWin
        };

        if( hasExpand ) {
            const expandResp = {
                expandedReels : expandReels
            }
            Object.assign( subSpin, expandResp );
        }
        spins.push( subSpin );
    });

    const bonusResp = {
        bonus : {
            gameInstanceId : 94674369,
            spins : spins,
            stake : params.stake,
            totalWin : params.totalWin,
        }
    }
   return bonusResp;
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
            "state": Constants.STATES[ state ],
            "action": Constants.ACTIONS[ params.actionFlag ],
            "stake": gameInfo.stake,
            "totalStake": gameInfo.totalStake,
            "spinsRemaining": gameInfo.spinsRemaining,
            "freeSpinsRemaining": 0,
            "freePurchaseSpinsRemaining": gameInfo.fspSpinsRemaining,
            "purchaseSpinsRemaining": gameInfo.fpSpinsRemaining,
            "freeSpinsAwarded": 0,
            "freePurchaseSpinsAwarded": gameInfo.fsCount > 0 ? 1 : 0,
            "spin": {
                "type": Constants.SPINTYPES[ spinType ],
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
        const bonusParams = {
            stake : gameInfo.stake,
            totalWin : gameInfo.totalWin,
            bonusReelInfo : params.bonusReelInfo
        }
        const bonusResp = generateBonusResponse( bonusParams )
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
            "state": Constants.STATES[ state ],
            "action": Constants.ACTIONS[ params.actionFlag ],
            "stake": gameInfo.stake,
            "totalStake": gameInfo.totalStake,
            "spinsRemaining": gameInfo.spinsRemaining,
            "freeSpinsRemaining": 0,
            "freePurchaseSpinsRemaining": gameInfo.fspSpinsRemaining,
            "purchaseSpinsRemaining": gameInfo.fpSpinsRemaining,
            "freeSpinsAwarded": 0,
            "freePurchaseSpinsAwarded": gameInfo.isFreeSpin ? 1 : 0,
            "spin": {
                "type": Constants.SPINTYPES[ spinType ],
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

export const generateCollectResponse = ( params:any ) => {
    const gameInfo = params.gameInfo;
    const response = {
        "game": {
            "userId": 26787348,
            "gameInstanceId": 94674817,
            "currencyCode": params.currency,
            "state": "COMPLETE",
            "action": "NONE",
            "stake": gameInfo.stake,
            "totalStake": gameInfo.totalStake,
            "spinsRemaining": gameInfo.spinsRemaining,
            "freeSpinsRemaining": 0,
            "freePurchaseSpinsRemaining": gameInfo.fspSpinsRemaining,
            "purchaseSpinsRemaining": gameInfo.fpSpinsRemaining,
            "freeSpinsAwarded": 0,
            "freePurchaseSpinsAwarded": 1, // gameInfo.isFreeSpin ? 1 : 0,
            "spin": {
                "type": "FREE_PURCHASE",
                "symbols": [],
                "jokerIndexes": [],
                "jokerCells": [],
                "superJokerIndexes": [],
                "superJokerCells": [],
                "respinIndexes": [],
                "matches": [],
                "symbolWins": [],
                "totalSymbolWin": 0,
                "purpleGemIndexes": [],
                "freeSpinIndexes": []
            },
            "symbolWins": [],
            "patternWin": {
                "amount": 0,
                "matchedPatterns": gameInfo.gameMatches.length
            },
            "spinPrice": 0.37,
            "matchedPatterns": gameInfo.gameMatches.length,
            "totalPatternWin": 0,
            "totalSymbolWin": gameInfo.totalSymbolWin,
            "totalWin": gameInfo.totalWin
        },
        "balance": {
            "cash": params.balance,
            "bonus": 0,
            "total": params.balance,
            "currencyCode": params.currency
        },
        "wrapper": {
            "postWager": false,
            "winProcessorRsp": null,
            "gameInstanceId": 94674817
        },
        "response": 0
    }
    if( params.actionFlag === 3 ) {
        const bonusParams = {
            stake : gameInfo.stake,
            totalWin : gameInfo.totalWin,
            bonusReelInfo : params.bonusReelInfo
        }
        const bonusResp = generateBonusResponse( bonusParams );
        Object.assign( response, bonusResp );
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