import isaac from 'isaac';
import * as GlobalConstants from "@/game/blingo/constants";

const getFloorRandom = ( len:number, flag="i" ) => {
    if( flag==="m ") return Math.floor( Math.random()*len );
    else return Math.floor( isaac.random()*len );
}

const makeRandArr = ( orgArr:number[], flag="i" ) => {
    for (let i = orgArr.length - 1; i > 0; i--) {
        let j = getFloorRandom( ( i+1 ), flag );
        [orgArr[i], orgArr[j]] = [orgArr[j], orgArr[i]];
    }
    return orgArr;
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
let round = 0, sid = 0, rid = 0 ;
const maxVal = 75, wild = 12;
const cellsArr = [
    [ 5,25,31,53,61, 7,22,43,55,65, 11,18,38,46,74, 3,21,33,49,64, 13,26,40,56,71 ]
];

const generateMatchePatterns = ( matchesArr:number[], cells:number[], patternInfo:any ) => {
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
        // for (let i = 1; i < matches.length; i++) {
        //     if (matches[i].pattern.includes(2)) {
        //         for (let j = 0; j < i; j++) {
        //             matches[j].pattern = matches[j].pattern.filter((p:number) => p !== 2);
        //         }
        //     }
        // }
    }
    
    // console.log(`matches`, matches)
    return matches;
}

export const getCells = () => {
    let numbers = Array.from({ length: maxVal }, (_, i) => i + 1);
    numbers = makeRandArr( numbers );
    // const cells : number[] = numbers.slice(0, 25);
    const cells = cellsArr[ 0 ];
    const remainCells = numbers.filter( num => !cells.includes( num ) );

    return {
        cells : cells,
        remainCells : remainCells
    }
}

export const getSymbols = ( params:any ) => {
    /*
    const symbolsArr = [
        [ "5", "22", "49", "71", "74" ], [ "46", "18", "13", "5", "24" ], [ "11", "67", "38", "45", "34" ],
        ["1", "RJ", "41", "49", "65"], ["8", "RJ", "D", "J", "J"], ["PG", "PG", "PG", "49", "61"], ["PG", "D", "35", "56", "75"], ["9", "26", "31", "59", "69"], ["PG", "J", "33", "49", "70"], ["12", "J", "45", "51", "64"], ["5", "RJ", "D", "58", "75"], ["11", "RJ", "38", "J", "69"], ["3", "30", "31", "56", "74"], 
        // FREE_PURCHASE_SPIN
        ["13", "27", "PG", "60", "70"], [], ["D", "28", "31", "57", "PG"], ["9", "20", "38", "54", "PG"], ["11", "23", "43", "52", "68"], ["14", "24", "44", "D", "63"], ["15", "26", "J", "54", "64"],  
        // purchase 49,74->49,71
        ["9", "30", "PG", "J", "72"], ["J", "27", "34", "53", "64"], ["9", "26", "44", "46", "63"], ["5", "16", "36", "49", "74"], ["6", "23", "41", "57", "63"], ["15", "21", "42", "46", "72"], ["J", "16", "35", "57", "J"], ["15", "22", "PG", "PG", "73"], ["1", "16", "PG", "55", "68"], ["4", "22", "PG", "D", "69"], ["7", "28", "32", "57", "PG"], ["J", "PG", "PG", "55", "PG"], ["13", "18", "37", "53", "68"]
    ];
    [  ], [  ], [  ], [  ],
    let symbols = symbolsArr[ sid ];
    sid++;
    */
    // /*
    const totalSymbols = Array.from({ length: maxVal }, (_, i) => i + 1);
    let misMatched = totalSymbols.filter( num => !params.gameMatches.includes( num ) );
    misMatched = makeRandArr( misMatched );
    let symbols = misMatched.slice(0,5).map(String);
    let symCnt = 0;
    const cntRand = isaac.random();
    if( cntRand>0.99 ) symCnt = 5;
    else if( cntRand>0.96 ) symCnt = 4;
    else if( cntRand>0.91 ) symCnt = 3;
    else if( cntRand>0.84 ) symCnt = 2;
    else if( cntRand>0.7 ) symCnt = 1;
    if( symCnt>0 ) {
        const symbolPoss = makeRandArr( [0,1,2,3,4] );
        for( let i=0; i<symCnt; i++ ) {
            const specRand = isaac.random();
            if( specRand>0.5 ) {
                if( specRand>0.95 ) symbols[ symbolPoss[i] ] = "FS";
                else if( specRand>0.91 ) symbols[ symbolPoss[i] ] = "SJ";
                else if( specRand>0.83 ) symbols[ symbolPoss[i] ] = "RJ";
                else if( specRand>0.75 ) symbols[ symbolPoss[i] ] = "J";
                else if( specRand>0.61 ) symbols[ symbolPoss[i] ] = "PG";
                else symbols[ symbolPoss[i] ] = "D";
            }
        }
        if( symbols.filter(symbol=>symbol==="SJ").length>1 ) {
            for( let i=1; i<symbols.filter(symbol=>symbol==="SJ").length; i++ ) {
                const sjInd = symbols.indexOf("SJ");
                if( sjInd !== -1 ) symbols[ sjInd ] = `7`;
            }
        }
    }
    // */
    return symbols;
}

export const getEmptySymbols = ( currentCells : number[] ) => {
    const numbers = Array.from({ length: maxVal }, (_, i) => i + 1);
    const remainCells = numbers.filter( num => !currentCells.includes(num) );
    const symbols = makeRandArr( remainCells ).slice( 0, 5 );
    return symbols;
}

export const checkRowCells = ( gameMatches:number[], row:number ) => {
    let cnt = 0;
    gameMatches.forEach((val)=>{ if( val%5===row ) cnt++ });
    if( cnt===5 ) return false;
    else return true;
}

export const calcSpinPrice = ( params:any ) => {
    const rtps = [ 0.96, 0.94, 0.92 ];
    const remainCell = params.totalMatches.length;
    const price = params.totalMatches.length===25 ? 0.01 : 
                    params.patternLength===0 || params.patternLength===12 ? 0.01 : 
                        Math.round( 100*params.stake*rtps[params.rtp-1]*(maxVal-remainCell) / ((25-remainCell)*(12-params.patternLength)) )/100;

    console.log(`spin price is ${price}=${ params.stake }*${rtps[ params.rtp-1 ]}*${25-remainCell}/( ${ 12-params.patternLength }), length=${ remainCell } `);
    return price;
}

export const checkSlingoWinLines = ( matchedPatterns:number[], gameMatches:number[], spinMatches : number[] ) => {
    const patterns  : number[] = [];
    const patternInfo   : any[] = [];
    if( gameMatches.length>5 ) {
        let slingoWinLines: number[] = Object.keys( GlobalConstants.SLINGOWINLINES ).map(Number);
        if( matchedPatterns.length > 0 ) {
            slingoWinLines = slingoWinLines.filter(num=>!matchedPatterns.includes(Number(num)));
        }
        for( const key in GlobalConstants.SLINGOWINLINES ) {
            if( slingoWinLines.includes(Number(key)) ) {
                const winLine = GlobalConstants.SLINGOWINLINES[key];
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
        game: {
            userId: params.userId,
            gameInstanceId: 88776505,
            currencyCode: params.currency,
            state: "STANDARD_SPIN",
            action: "SPIN",
            stake: params.stake,
            totalStake: params.stake,
            spinsRemaining: 10,
            freeSpinsRemaining: 0,
            freePurchaseSpinsRemaining: 5,
            purchaseSpinsRemaining: 40,
            freeSpinsAwarded: 0,
            freePurchaseSpinsAwarded: 0,
            ticket: {
                id: params.ticketId,
                rows: 5,
                columns: 5,
                cells: `${params.cells}`,
                matches: "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0"
            },
            spinPrice: 0,
            matchedPatterns: 0,
            totalPatternWin: 0,
            totalSymbolWin: 0,
            totalWin: 0
        },
        wrapper: {
            postWager: true,
            winProcessorRsp: null,
            activeBalance: "CASH"
        },
        response: 0
    };
    const balanceResp = generateBalanceResponse( params.balance, params.currency );
    Object.assign( response, balanceResp );
    return response;
}

const selectPayLine = ( idx:number ) => {
    const lines : { [key:number] : number[] } = {
        0 : [ 1,3,5 ],
        1 : [ 0,7,8,9 ],
        2 : [ 2,4,6 ]
    }
    return lines[idx][ getFloorRandom( lines[idx].length )];
}

const checkPayLines = ( reels:number[][][], stake:number ) => {
    let bonusProfit = 0;
    const reelPayInfo : any[] = [];

    reels.forEach(( subReels:number[][] ) => {
        const payInfo : any[] = [];
        for (const key in GlobalConstants.SLOTPAYLINES) {
            if( GlobalConstants.SLOTPAYLINES.hasOwnProperty(key) ) {
                const leftPayItem : any = {
                    symbol : 0,
                    sameCnt : 0,
                    line : key,
                    direct : 0,
                    profit : 0
                };
                const rightPayItem : any = {
                    symbol : 0,
                    sameCnt : 0,
                    line : key,
                    direct : 1,
                    profit : 0
                };
                const line = GlobalConstants.SLOTPAYLINES[ key ];
                let leftSymbol = subReels[ 0 ][line[0]];
                let rightSymbol = subReels[ 4 ][line[0]];
                let leftSameCnt = 0, rightSameCnt = 0;
                if( leftSymbol===wild ) {
                    for( let i=1; i<5; i++ ) {
                        if( subReels[i][ line[i] ]!==wild ) leftSymbol = subReels[i][ line[i] ];
                    }                    
                }

                if( rightSymbol===wild ) {
                    for( let i=3; i>=0; i-- ) {
                        if( subReels[i][ line[i] ]!==wild ) rightSymbol = subReels[i][ line[i] ];
                    }                    
                }
                // LEFT_TO_RIGHT
                for( let i=0; i<5; i++ ) {
                    if( subReels[ i ][ line[i] ] === leftSymbol || subReels[ i ][ line[i] ] === wild ) leftSameCnt++;
                    else break;
                }
                if( leftSameCnt>=3 ) {
                    leftPayItem.symbol = leftSymbol;
                    leftPayItem.sameCnt = leftSameCnt;
                    leftPayItem.profit = Math.round(stake*GlobalConstants.PAYTABLE[ leftSymbol ][ 5-leftSameCnt ]*10)/100;
                    bonusProfit = Math.round( bonusProfit*100 + leftPayItem.profit*100 )/100;
                    payInfo.push(leftPayItem);
                }
                // RIGHT_TO_LEFT
                for( let i=4; i>=0; i-- ) {
                    if( subReels[ i ][ line[i] ] === rightSymbol || subReels[ i ][ line[i] ] === wild ) rightSameCnt++;
                    else break;
                }
                if( rightSameCnt>=3 ) {
                    rightPayItem.symbol = rightSymbol;
                    rightPayItem.sameCnt = rightSameCnt;
                    rightPayItem.direct = 1;
                    rightPayItem.profit = Math.round(stake*GlobalConstants.PAYTABLE[ rightSymbol ][ 5-rightSameCnt ]*10)/100;
                    bonusProfit = Math.round( bonusProfit*100 + rightPayItem.profit*100 )/100;
                    payInfo.push(rightPayItem);
                }
            }
        }
        reelPayInfo.push( payInfo );
    });
    // console.log(`reelPayInfo=`, reelPayInfo)
    return {
        payInfo : reelPayInfo,
        totalProfit : bonusProfit
    }
}

const generateTriggers = ( line:number, sameCnt:number ) => {
    const reelPos: number[][] = [ [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0] ];
    const triggers : string[] = [];
    for (let index = 0; index < sameCnt; index++) {
        reelPos[index][ GlobalConstants.SLOTPAYLINES[line][index] ]=1;
        triggers.push( String(reelPos[index]) );
    }
    for( let i=0; i<5-sameCnt; i++ ) {
        triggers.push( String([0,0,0]) );
    }
    return triggers;
};

const generateGameResponse = ( params: any ) => {
    const gameInfo = params.gameInfo;
    const matches = generateMatchePatterns( gameInfo.spinMatches, gameInfo.cells, params.patternInfo );
    let state = 0, spinType = 0;
    if( gameInfo.purCount===0 ) {
        state = 1;
    } else if( gameInfo.purCount>0 ) {
        if( gameInfo.purCount===1 ) state=1, spinType=2 ;
        if( gameInfo.purCount > 1 ) state=2, spinType=3 ;
    } 
    console.log(`purCount=${ gameInfo.purCount }, state=${state}, spinType=${spinType}`)
    if( params.actionFlag===2 ) state=3;
    const response = {
        game: {
            userId: params.userId,
            gameInstanceId: params.gameInstanceId,
            currencyCode: params.currency,
            state: GlobalConstants.STATES[ state ],
            action: GlobalConstants.ACTIONS[ params.actionFlag ],
            stake: gameInfo.stake,
            totalStake: gameInfo.totalStake,
            spinsRemaining: gameInfo.spinsRemaining < 0 ? 0 : gameInfo.spinsRemaining ,
            freeSpinsRemaining: gameInfo.fsSpinsRemaining,
            freePurchaseSpinsRemaining: gameInfo.fspSpinsRemaining,
            purchaseSpinsRemaining: gameInfo.fpSpinsRemaining,
            freeSpinsAwarded: gameInfo.fsAwarded,
            freePurchaseSpinsAwarded: gameInfo.purCount > 0 ? 1 : 0,
            spin: {
                type: GlobalConstants.SPINTYPES[ spinType ],
                symbols: gameInfo.symbols,
                jokerIndexes: gameInfo.jokerIndexes,
                jokerCells: gameInfo.jokerCells ,
                superJokerIndexes: params.superJokerIndexes,
                superJokerCells: params.superJokerCells,
                respinIndexes: gameInfo.respinIndexes,
                matches: matches,
                symbolWins: params.symbolWinsInfo.length > 0 ? params.symbolWinsInfo : [],
                totalSymbolWin: params.spinSymbolWin,
                purpleGemIndexes: params.purpleGemIndexes,
                freeSpinIndexes: params.freeSpinIndexes
            },
            spinPrice: params.spinPrice,
            matchedPatterns: params.matchPatterns,
            totalPatternWin: params.bonusProfit,
            totalSymbolWin: gameInfo.totalSymbolWin,
            totalWin: Math.round( gameInfo.totalSymbolWin*100+params.bonusProfit*100 )/100,
        },
        response: 0
    }
    return response;
}

const generateBalanceResponse = ( balance:number, currency:string ) => {
    const balanceResp = {
        balance: {
            cash: balance,
            bonus: 0,
            total: balance,
            currencyCode: currency
        },        
    };
    return balanceResp;
}
// [ [  ], [  ], [  ], [  ], [  ] ],
const fsReels = [
    [ [ 12,6,12 ], [ 9,8,6 ], [ 7,7,5 ], [ 8,12,6 ], [ 3,12,5 ] ],
];

export const generateBonusSpins = ( winSymbol:number, stake:number ) => {
    let reels : number[][] = [];
    let expSubReels: number[][] = [];
    const fullReels = [ 3,4,5,6,7,8 ];
    const cntRand = isaac.random();
    const maxCnt = 1 ;
    // const maxCnt = cntRand > 0.99 ? 3 : cntRand > 0.5 ? 2 : 1 ;
    const reelMrx : typeof reels[] = [];
    const expReelMrx : typeof reels[] = [];
    let isExpand = false;
    if( winSymbol>8 ) {
        isExpand = true;
        winSymbol = Math.floor( isaac.random()*6 )+3;
    }

    for( let i=0; i<maxCnt; i++ ) {
        for( let j=0; j<5; j++ ) {
            reels[ j ] = [];
            expSubReels[ j ] = [];
            for( let k=0; k<3; k++ ) {
                let rand = getFloorRandom(( fullReels.length ));
                reels[ j ][ k ] = fullReels[ rand ];
                expSubReels[ j ][ k ] = fullReels[ rand ];
            }
        }

        if( !reels[0].includes( winSymbol ) ) {
            const firstPos = getFloorRandom( 3 );
            reels[0][ firstPos ] = winSymbol;
            expSubReels[0][ firstPos ] = winSymbol;
        }

        const line = selectPayLine( reels[0].indexOf( winSymbol ) );
        const sameCnt = getFloorRandom( 3 )+3;
        for( let k=0; k<sameCnt; k++ ) {
            reels[ k ][ GlobalConstants.SLOTPAYLINES[line][k] ] = winSymbol;
            expSubReels[ k ][ GlobalConstants.SLOTPAYLINES[line][k] ] = winSymbol;
        }

        if( isExpand ) {
            const col = getFloorRandom( 5 );
            const idx = getFloorRandom( 3 );
            reels[ col ][ idx ] = 12;
            expSubReels[ col ][ idx ] = 12;
        }

        // reels = fsReels[ rid ];
        // expSubReels = fsReels[ rid ];
        // rid++;
        reelMrx.push( [ ...reels ] );
        const flatReel = expSubReels.flat();
        if( flatReel.includes(wild) ) {
            isExpand = true;
            for (let i = 0; i < expSubReels.length; i++) {
                const element = expSubReels[i];
                if( element.includes(wild) ) {
                    expSubReels[i] = [ wild,wild,wild ]
                }
            }
            expReelMrx.push( expSubReels );
        }
    }
    const payLineInfo = checkPayLines( isExpand ? expReelMrx : reelMrx, stake );
    return {
        reelMrx : reelMrx,
        payLineInfo : payLineInfo.payInfo,
        bonusProfit : payLineInfo.totalProfit
    };
}

export const generateBonusResponse = ( params: any ) => {
    const directDict: { [ key:number ] : string } = {
        0 : "LEFT_TO_RIGHT",
        1 : "RIGHT_TO_LEFT"
    };
    const spins : any[] = [];
    let totalWin = 0;
    params.bonusReelInfo.reelMrx.forEach((subReels: number[][], idx: number) => {
        let spinTotalWin = 0;
        let isExpand = false;
        const expansionIndexes : number[] = [];
        const subPayLineInfo = params.bonusReelInfo.payLineInfo[idx];
        const expandReels : any[] = [];
        const reels : any[] = [];
        const wins : any[]  = [];

        subReels.forEach(( item:number[], ind:number ) => {
            const symbolStr: string[] = [];
            const expSymbolStr: string[] = [];
            item.forEach(( no : number ) => {
                if( item.includes(wild) ) {
                    if( !isExpand ) isExpand = true;
                    if( !expansionIndexes.includes( ind ) ) expansionIndexes.push( ind );
                    expSymbolStr.push( GlobalConstants.SYMBOLDICT[ wild ] );
                } else {
                    expSymbolStr.push( GlobalConstants.SYMBOLDICT[ no ] );
                }
                symbolStr.push( GlobalConstants.SYMBOLDICT[ no ] );
            })
            reels.push( { symbols : symbolStr } );
            expandReels.push( { symbols : expSymbolStr } );
        });

        subPayLineInfo.forEach((payItem:any)=>{
            const winItem = {
                direction: directDict[ payItem.direct ],
                symbol: GlobalConstants.SYMBOLDICT[ payItem.symbol ],
                index: Number( payItem.line ),
                symbols: payItem.sameCnt,
                amount: payItem.profit,
                multiplier: GlobalConstants.PAYTABLE[ payItem.symbol ][ 5-payItem.sameCnt ],
                triggers: generateTriggers( payItem.line, payItem.sameCnt )
            }
            spinTotalWin = Math.round(spinTotalWin*100+payItem.profit*100)/100 ;
            totalWin = Math.round( totalWin*100+payItem.profit*100 )/100 ;
            wins.push( winItem );
        })

        const subSpin = {
            reels : reels,
            expansionIndexes : expansionIndexes,
            wins : wins,
            totalWin : spinTotalWin
        };

        if( isExpand ) {
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
            totalWin : totalWin,
        }
    }
   return bonusResp;
}

export const generateSpinResponse = ( params: any ) => {
    const gameInfo = params.gameInfo;
    let response = generateGameResponse( params );

    if( params.actionFlag===2 ) {
        const winResp = {
            symbolWins: gameInfo.symbolWins,
            patternWin: {
                amount: params.bonusReelInfo.bonusProfit,
                matchedPatterns: wild
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
        const balanceResp = generateBalanceResponse( params.balance, params.currency );
        Object.assign( response, balanceResp );
    }

    if( gameInfo.purCount>1 ) {
        const balanceResp = generateBalanceResponse( params.balance, params.currency );
        const fsResp = {
            wrapper: {
                postWager: true,
                winProcessorRsp: null,
                activeBalance: "CASH"
            }
        }
        Object.assign( balanceResp, fsResp );
        Object.assign( response, balanceResp );
    }
    return response;
}

export const generateChooseCellResponse = ( params:any ) => {
    const gameInfo = params.gameInfo;
    const response = generateGameResponse( params );
    if( params.actionFlag === 2 ) {
        const winResp = {
            symbolWins: gameInfo.symbolWins,
            patternWin: {
                amount: params.bonusReelInfo.bonusProfit,
                matchedPatterns: wild
            },
        };
        Object.assign( response.game, winResp );
        const bonusParams = {
            stake : gameInfo.stake,
            totalWin : gameInfo.totalWin,
            bonusReelInfo : params.bonusReelInfo
        }
        const bonusResp = generateBonusResponse( bonusParams );
        Object.assign( response, bonusResp );
        const balanceResp = generateBalanceResponse( params.balance, params.currency );
        Object.assign( response, balanceResp );
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
            "action": "SPIN", // NONE
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
            "symbolWins": gameInfo.symbolWins,
            "patternWin": {
                "amount": params.bonusReelInfo.bonusProfit,
                "matchedPatterns": gameInfo.matchPatterns.length
            },
            "spinPrice": params.spinPrice,
            "matchedPatterns": gameInfo.matchPatterns.length,
            "totalPatternWin": params.actionFlag===0 ? 0 : params.bonusReelInfo.bonusProfit,
            "totalSymbolWin": gameInfo.totalSymbolWin,
            "totalWin": params.actionFlag===0 ? gameInfo.totalSymbolWin : Math.round(gameInfo.totalSymbolWin*100+params.bonusReelInfo.bonusProfit*100)/100
        },
        "wrapper": {
            "postWager": false,
            "winProcessorRsp": null,
            "gameInstanceId": 94674817
        },
        "response": 0
    }
    const balanceResp = generateBalanceResponse( params.balance, params.currency );
    Object.assign( response, balanceResp );
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
/**
 * test Cheat Functions
 */
export const simulateGameByAction = ( params:any ) => {
    console.log(` action=${params.action}, stake=${params.stake} `);
    const cellInfo = getCells();
    const cells = cellInfo.cells;
    const matchedPos : number[] = [];
    const cheatSymbols : number[][] = [];
    const keys = [ 0,1,2,3,4,5,6,7,8,9,10,11 ];
    
    let remainCells = cellInfo.remainCells;
    let matchedCells : number[] = [];
    let slingoWinCnt = 0;

    switch (params.action) {
        case "blingo3":
            slingoWinCnt = 3;
            break;
        case "blingo4" :
            slingoWinCnt = 4;
            break;
        case "blingo5" :
            slingoWinCnt = 5;
            break;
        case "blingo6" :
            slingoWinCnt = 6;
            break;
        case "blingo7" :
            slingoWinCnt = 7;
            break;
        case "blingo8" :
            slingoWinCnt = 8;
            break;
        case "blingo9" :
            slingoWinCnt = 9;
            break;
        case "blingo10" :
            slingoWinCnt = 10;
            break;
        case "fullhouse" :
            slingoWinCnt = 12;
            break;
    }
    const matchWinLines = makeRandArr( keys ).slice( 0, slingoWinCnt );
    if( slingoWinCnt>=5 ) {
        if( !matchWinLines.includes(10) && !matchWinLines.includes(11) ) {
            console.log('matchWinLines1=', matchWinLines);
            matchWinLines.pop();
            matchWinLines.push( 10 );
            console.log('matchWinLines2=', matchWinLines);
        }
    }
    // const matchWinLines = [ 5, 4, 8 ];
    console.log(`matchWinLines=`, matchWinLines)
    matchWinLines.forEach(( matchLine ) => {
        GlobalConstants.SLINGOWINLINES[ matchLine ].forEach( pos => {
            if( !matchedPos.includes( pos ) ) {
                matchedPos.push( pos );
                matchedCells.push( cells[pos] );
            }
        })
    })
    const matchedTarget = matchedPos.length;
    let curMatchedSymbolCnt = 0;
    while( matchedTarget>curMatchedSymbolCnt ) {
        let positions = [ 0,1,2,3,4 ];
        let symbols = makeRandArr( remainCells, "m" ).slice( 0, 5 );
        let sameCnt = 0;
        const rand = Math.random();
        if( rand>0.85 ) curMatchedSymbolCnt+=3, sameCnt = 3;
        else if( rand>0.65 ) curMatchedSymbolCnt+=2, sameCnt = 2;
        else if( rand>0.4 ) curMatchedSymbolCnt+=1, sameCnt = 1;
        if( sameCnt>0 ) {
            let randMatchSymbols = makeRandArr( matchedCells, "m" ).slice( 0, sameCnt );
            let randMatchPos = makeRandArr( positions, "m" ).slice( 0, sameCnt );
            matchedCells = matchedCells.filter( num => !randMatchSymbols.includes( num ) );
            for( let i=0; i<sameCnt; i++ ) {
                if( randMatchSymbols[i] !==undefined ) symbols[ randMatchPos[i] ] = randMatchSymbols[ i ];
            }
        }
        cheatSymbols.push( symbols );
    }
    return {
        cells : cells,
        cheatSymbols : cheatSymbols
    }
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
                "id": GlobalConstants.SYMBOLDICT[100],
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
                    "id": GlobalConstants.SYMBOLDICT[ 3 ], // BLUE_GEM
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
                    "id": GlobalConstants.SYMBOLDICT[ 5 ], // GREEN_GEM
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
                    "id": GlobalConstants.SYMBOLDICT[ 6 ], //YELLOW_GEM
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
                    "id": GlobalConstants.SYMBOLDICT[ 8 ], // BAR
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
                    "id": GlobalConstants.SYMBOLDICT[ 4 ], // ORANGE_GEM
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
                    "id": GlobalConstants.SYMBOLDICT[ 7 ], // SEVEN
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