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
let round = 0;
const maxVal = 75, wild = 12, maxPs = 40;

const generateMatchePatterns = ( cells:number[], matchesArr:number[], patternInfo:any ) => {
    const matches : any[] = [];
    if( matchesArr.length > 0 ) {
        // console.log(`matchesArr`, matchesArr);
        // console.log(`patternInfo`, patternInfo);
        matchesArr.forEach(( no:number, idx:number ) => {
            let pattern : number[] = [];
            patternInfo.forEach((element:any) => {
                if( no === cells[element.number] ) {
                    pattern.push( element.patterns );
                }
            });
            const matchItem = {
                number : no,
                pattern : pattern
            };
            matches.push( matchItem );
        });
    }
    return matches;
}

export const getCells = () => {
    const subNumArr : number[][] = [];
    let remainCells : number[] = [];
    let cells: number[] = [ 5,22,42,50,71,11,19,45,54,68,8,30,39,55,72,10,17,43,59,70,2,18,36,46,64 ];
    // cells = [ 4,26,40,60,61,14,25,35,53,65,3,19,36,51,74,8,18,45,46,75,15,27,37,50,68 ];
    // cells = [ 13,30,33,49,65,9,24,40,48,73,1,29,39,53,69,8,25,32,54,70,5,19,36,58,67 ];
    // cells = [ 13,16,34,56,61,8,18,40,52,62,11,29,33,47,68,15,17,36,50,69,10,24,37,54,66 ];
    // for (let i = 0; i < 5; i++) {
    //     const start = i*15;
    //     let arr = Array.from({ length: 15 }, (_, index) => start + index+1);
    //     let subNumbers = makeRandArr( arr );
    //     subNumArr.push( subNumbers.slice( 0,5 ) );
    // }
    // for( let i=0; i<5; i++ ) {
    //     for( let j=0; j<5; j++ ) {
    //         cells[ 5*i+j ] = subNumArr[ j ][ i ];
    //     }
    // }

    return {
        cells : cells,
        remainCells : remainCells
    }
}

const checkSymbolByCols = ( cells:number[], matches:number[] ) => {
    let colsCnt = [ 0,0,0,0,0 ];
    let cols: number[] = [];
    let col = 0;
    matches.forEach((symb) => {
        for( let i=1; i<=5; i++ ) {
            if( symb<=15*i && cells.includes(symb) ) {
                col = i-1;
                colsCnt[ col ]++; 
                break;
            }
        }
    })
    for( let i=0; i<5; i++ ) {
        if( colsCnt[i]>4 ) cols.push( i );
    }
    return cols;
}
let ftid = 0;
export const getSymbols = ( params:any ) => {
    const PG = "PG", RJ="RJ", SJ="SJ", J="J", FS="FS", D="D";
    let symbols : string[] = [];
    let symCnt = 0;
    let hasSJ = false;

    for( let i=0; i<5; i++ ) {
        const start = i*15;
        const arr = Array.from({ length: 15 }, (_, index) => start + index+1);
        const subNumbers = makeRandArr( arr );
        symbols.push(String( subNumbers[0] ));
    }
    
    const cntRand = isaac.random();
    if( cntRand>0.99 ) symCnt = 5;
    else if( cntRand>0.96 ) symCnt = 4;
    else if( cntRand>0.91 ) symCnt = 3;
    else if( cntRand>0.84 ) symCnt = 2;
    else if( cntRand>0.7 ) symCnt = 1;
    if( symCnt>0 ) {
        let fsCnt = 0;
        const symbolPoss = makeRandArr( [0,1,2,3,4] );
        const disableCols = checkSymbolByCols( params.cells, params.gameMatches );
        for( let i=0; i<symCnt; i++ ) {
            const specRand = isaac.random();
            if( !disableCols.includes(i) ) {
                if( hasSJ ) {
                    if( specRand>0.834 ) symbols[ symbolPoss[i] ] = PG;
                    else if( specRand>0.782 ) symbols[ symbolPoss[i] ] = D;
                } else {
                    if( params.isExtra ) {
                        if( specRand>0.73) symbols[ symbolPoss[i] ] = PG;
                        else if( specRand>0.62 ) symbols[ symbolPoss[i] ] = D;
                        else if( params.purCount===-1 && fsCnt===0 ) fsCnt++, symbols[ symbolPoss[i] ] = FS;
                    } else {
                        if( specRand>0.95 ) hasSJ = true, symbols[ symbolPoss[i] ] = SJ;
                        else if( specRand>0.91 ) symbols[ symbolPoss[i] ] = RJ;
                        else if( specRand>0.85 ) symbols[ symbolPoss[i] ] = J;
                        else if( specRand>0.73) symbols[ symbolPoss[i] ] = PG;
                        else if( specRand>0.62 ) symbols[ symbolPoss[i] ] = D;
                        else if( params.purCount===-1 && fsCnt===0 ) fsCnt++, symbols[ symbolPoss[i] ] = FS;
                    }
                }
            }
        }

        let sjCnt = symbols.filter(symbol=>symbol===SJ).length;
        let rjCnt = symbols.filter(symbol=>symbol===RJ).length;
        let jCnt = symbols.filter(symbol=>symbol===J).length;
        if( sjCnt>1 ) {
            let mid = 5;
            while ( sjCnt>1 ) {
                const sjInd = symbols.indexOf(SJ);
                if( sjInd !== -1 ) {
                    mid++; 
                    sjCnt--;
                    const start = sjInd*15;
                    const arr = Array.from({ length: 15 }, (_, index) => start + index+1);
                    const subNumbers = makeRandArr( arr );
                    symbols[ sjInd ] = String(subNumbers[ mid ]);
                }
            }
            if( rjCnt>0 ) {
                while (rjCnt>0) {
                    const rjInd = symbols.indexOf(RJ);
                    if( rjInd !== -1 ) {
                        mid++; 
                        rjCnt--;
                        const start = rjInd*15;
                        const arr = Array.from({ length: 15 }, (_, index) => start + index+1);
                        const subNumbers = makeRandArr( arr );
                        symbols[ rjInd ] = String(subNumbers[ mid ]);
                    }
                }
            }
            if( jCnt>0 ) {
                while (jCnt>0) {
                    const jInd = symbols.indexOf(J);
                    if( jInd !== -1 ) {
                        mid++; 
                        jCnt--;
                        const start = jInd*15;
                        const arr = Array.from({ length: 15 }, (_, index) => start + index+1);
                        const subNumbers = makeRandArr( arr ); 
                        symbols[ jInd ] = String(subNumbers[ mid ]);
                    }
                }
            }
        }
    }
    const ftSymbols = [
        ["J", "18", "36", "56", "61"], ["13", "25", "41", "51", "63"],["3", "19", "D", "PG", "73"],["PG", "20", "42", "57", "71"],["D", "17", "D", "46", "70"],["5", "D", "35", "52", "71"],["7", "24", "44", "53", "PG"],["8", "17", "38", "59", "68"],["9", "27", "PG", "50", "73"],["13", "PG", "J", "RJ", "67"],["9", "19", "38", "RJ", "65"],[], ["1", "24", "31", "J", "73"], ["PG", "18", "38", "51", "67"], ["11", "18", "36", "57", "65"],["15", "PG", "D", "59", "62"],["12", "19", "33", "48", "J"],["J", "21", "34", "50", "75"],["14", "22", "38", "46", "SJ"],["14", "D", "43", "52", "71"],["12", "20", "37", "51", "67"], ["2", "28", "45", "PG", "66"],["11", "21", "42", "60", "70"],["J", "18", "44", "59", "64"], ["8", "25", "44", "54", "SJ"],["2", "16", "39", "49", "72"], ["1", "22", "PG", "58", "63"],["6", "24", "PG", "48", "74"],["14", "26", "43", "PG", "69"],["14", "18", "J", "PG", "62"],["6", "26", "D", "48", "69"],["2", "22", "42", "J", "71"],["14", "D", "43", "60", "PG"],["15", "20", "35", "PG", "63"],["2", "25", "34", "53", "70"],["PG", "25", "PG", "50", "75"],["J", "16", "D", "56", "65"], ["PG", "PG", "31", "54", "75"],["3", "25", "33", "54", "PG"],["J", "28", "J", "60", "PG"],["3", "PG", "J", "J", "69"],["13", "17", "43", "47", "69"],["8", "22", "41", "52", "74"],["9", "26", "38", "57", "72"],["3", "25", "42", "52", "68"],["5", "17", "39", "PG", "71"],["8", "D", "PG", "59", "71"],["12", "19", "PG", "51", "67"],["8", "18", "PG", "57", "62"],["4", "16", "45", "D", "66"],["14", "16", "41", "54", "62"]

        // ["14", "PG", "PG", "46", "70"],["13", "25", "D", "51", "73"],["3", "28", "44", "47", "71"],["PG", "PG", "43", "59", "69"],["10", "24", "33", "J", "D"],["5", "22", "38", "56", "62"],["6", "PG", "D", "50", "PG"],["1", "26", "43", "51", "64"],["13", "28", "43", "49", "J"],["12", "D", "42", "58", "75"], ["14", "27", "J", "54", "74"],[],["7", "26", "43", "60", "D"],["7", "19", "43", "47", "74"]

        // ["7", "30", "J", "58", "62"],["8", "PG", "J", "58", "72"],["D", "24", "44", "48", "PG"],["7", "23", "D", "46", "67"],["PG", "16", "43", "46", "64"],["6", "24", "38", "PG", "69"],["13", "29", "J", "56", "64"],["J", "29", "39", "53", "61"],["1", "D", "33", "59", "J"],["15", "PG", "J", "52", "62"],["7", "18", "33", "PG", "PG"],[],["PG", "PG", "J", "52", "74"],["11", "26", "38", "52", "J"],["4", "PG", "PG", "49", "72"],["12", "21", "35", "SJ", "62"],["PG", "26", "32", "59", "67"],["8", "24", "J", "60", "PG"],["13", "PG", "PG", "49", "61"],["5", "28", "D", "PG", "J"],["8", "20", "D", "52", "PG"],["4", "27", "34", "59", "62"],["11", "17", "34", "59", "67"],["8", "27", "PG", "57", "65"],["5", "24", "D", "47", "J"],["9", "25", "PG", "PG", "D"],["PG", "J", "J", "D", "72"],["2", "26", "D", "54", "75"]

        // ["11", "28", "D", "49", "68"],["D", "23", "D", "57", "74"],["9", "J", "J", "59", "74"],["1", "J", "J", "59", "69"],["9", "28", "44", "60", "J"],["10", "PG", "32", "60", "62"],["14", "24", "FS", "RJ", "PG"],["15", "28", "PG", "RJ", "74"],["9", "20", "39", "PG", "63"],["12", "30", "34", "J", "65"],["15", "19", "45", "60", "69"],["1", "27", "40", "60", "70"],["3", "18", "PG", "48", "PG"],["PG", "28", "J", "54", "73"],["3", "PG", "J", "53", "71"],[],["4", "J", "PG", "60", "72"],["PG", "18", "J", "48", "64"],["J", "26", "D", "47", "J"],["15", "29", "42", "60", "72"],["3", "20", "36", "54", "67"],["PG", "22", "45", "PG", "62"],["6", "17", "41", "51", "63"],["12", "21", "38", "53", "61"],["11", "26", "D", "52", "70"],["7", "16", "40", "50", "PG"],["11", "25", "D", "PG", "D"],["12", "18", "31", "52", "68"],["PG", "J", "38", "51", "PG"],["13", "29", "J", "54", "62"],["8", "J", "D", "56", "70"]

    ]; 
    symbols = ftSymbols[ ftid ];
    ftid++;
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
    const price = 
        params.totalMatches.length===25 || params.patternLength===0 || params.patternLength===12 ? 0.01 : 
        Math.round( 100*params.stake*(maxVal-remainCell) / ((25-remainCell)*rtps[params.rtp-1]*(12-params.patternLength)) )/100;

    console.log(`===> spinPrice ${price}=${ params.stake }*${(maxVal-remainCell)}/(${25-remainCell}*${rtps[ params.rtp-1 ]}*${ 12-params.patternLength }), length=${ remainCell }`);
    return price;
}

export const checkSlingoWinLines = ( matchedPatterns:number[], matchedIdxs:number[], spinIdxs : number[] ) => {
    const patterns : number[] = [];
    const patternInfo : any[] = [];
    if( matchedIdxs.length>=5 ) {
        let slingoWinLines: number[] = Object.keys( GlobalConstants.SLINGOWINLINES ).map(Number);
        if( matchedPatterns.length > 0 ) {
            slingoWinLines = slingoWinLines.filter(num=>!matchedPatterns.includes(Number(num)));
        }
        for( const key in GlobalConstants.SLINGOWINLINES ) {
            const lineKey = Number(key);
            if( slingoWinLines.includes(lineKey)) {
                const winLine = GlobalConstants.SLINGOWINLINES[key];
                spinIdxs.forEach(( idx:number ) => {
                    if( winLine.includes( idx )) {
                        const isPattern = winLine.every( element => matchedIdxs.includes(element) );
                        if( isPattern ) {
                            if( !patterns.includes( lineKey )) {
                                patterns.push( lineKey );
                                const patternItem = {
                                    number : idx,
                                    patterns : lineKey
                                };
                                patternInfo.push( patternItem );
                            }
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
        const numSym = parseFloat(symbol);
        if( !isNaN(numSym) && cells.includes( numSym )) matches.push( numSym );
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
            purchaseSpinsRemaining: maxPs,
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

const removeRepatedPatterns = ( matches:any ) => {
    const seen: number[] = [];
    for( let i=matches.length-1; i>=0; i-- ) {
        matches[i].pattern = matches[i].pattern.filter( (num:number) => {
            if( seen.includes(num) ) {
                return false;
            }
            seen.push( num );
            return true;
        })
    }
    return matches;
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
                if( rightSameCnt===3 || rightSameCnt===4 ) {
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
    const matches = generateMatchePatterns( gameInfo.cells, gameInfo.spinMatches, params.patternInfo );
    const hasPattern = matches.some(match => match.pattern.length > 0);
    let removeMatches: any[] = hasPattern ? removeRepatedPatterns( matches ) : [];
    let state = 0, spinType = 0;

    if( gameInfo.spinsRemaining<=0 ) {
        if( gameInfo.spinsRemaining===0 ) {
            if( gameInfo.fsAwarded===1 ) {
                state = 2, spinType=3;
            }
        } else {
            if( !gameInfo.isFreeSpin ) {
                console.log(`else case :: symbols=[${gameInfo.symbols}], isExtra=${gameInfo.isExtra}, isPurchase=${gameInfo.isPurchase}`)
                if( gameInfo.isExtra ) {
                    state = 2, spinType = 1; // state = 3
                }
                if( gameInfo.isPurchase ) {
                    state = 3, spinType=2;
                }
                // if( params.isRS ) {
                //     spinType = 4;
                //     if( params.prevActionFlag===1 ) state = 2;
                // } else {
                //     state = 2;
                // }
            }
        }
    }
    if( params.isRS ) {
        spinType = 4;
    }
    if( params.actionFlag===2 ) {
        state = 4
    }
    const response = {
        game: {
            userId: params.userId,
            gameInstanceId: params.gameInstanceId,
            currencyCode: params.currency,
            state: GlobalConstants.STATES[ state ],
            action: params.actionFlag===4 ? "SPIN" : GlobalConstants.ACTIONS[ params.actionFlag ],
            stake: gameInfo.stake,
            totalStake: gameInfo.totalStake,
            spinsRemaining: gameInfo.spinsRemaining < 0 ? 0 : gameInfo.spinsRemaining ,
            freeSpinsRemaining: gameInfo.fsRemain,
            freePurchaseSpinsRemaining: gameInfo.fpsSpinsRemaining,
            purchaseSpinsRemaining: gameInfo.psRemaining,
            freeSpinsAwarded: gameInfo.fsAwarded,
            freePurchaseSpinsAwarded: gameInfo.fpsSpinsCnt,
            spin: {
                type: GlobalConstants.SPINTYPES[ spinType ],
                symbols: gameInfo.symbols,
                jokerIndexes: gameInfo.jokerIndexes,
                jokerCells: gameInfo.jokerCells ,
                superJokerIndexes: params.superJokerIndexes,
                superJokerCells: params.superJokerCells,
                respinIndexes: gameInfo.respinIndexes,
                matches: hasPattern ? removeMatches : matches,
                symbolWins: params.symbolWinsInfo.length > 0 ? params.symbolWinsInfo : [],
                totalSymbolWin: params.spinSymbolWin,
                purpleGemIndexes: gameInfo.pgIndexes,
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

export const generateBonusSpins = ( params:any ) => {
    let expSubReels: number[][] = [];
    let reels : number[][] = [];
    let isExpand = false;
    let maxCnt = 1;
    const maxRules : { [ key:number ] : number[] } = {
        3 : [ 0.6, 0.9 ],
        4 : [ 0.65, 0.89 ],
        5 : [ 0.65, 0.86 ],
        6 : [ 0.5, 0.83 ],
        7 : [ 0.5, 0.8 ],
        8 : [ 0.45, 0.75 ],
        9 : [ 0.35, 0.65 ],
        10 : [ 0.35, 0.65 ],
        12 : [ 0.35, 0.65 ]
    }
    const cntRand = isaac.random();
    const fullReels = [ 3,4,5,6,7,8 ];
    const reelMrx : typeof reels[] = [];
    const expReelMrx : typeof reels[] = [];

    if( params.winSymbol>8 ) {
        isExpand = true;
        switch ( params.winSymbol ) {
            case 9:
                params.winSymbol = 7;
                break;
            case 10:
                params.winSymbol = 8;
                break;
            case 12:
                params.winSymbol = Math.floor( isaac.random()*6 )+3;;
                break;
        }
    }
    
    for( let i=0; i<2; i++ ) {
        if( cntRand>=maxRules[params.winSymbol][i] ) {
            maxCnt++;
        }
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

        if( !reels[0].includes( params.winSymbol ) ) {
            const firstPos = getFloorRandom( 3 );
            reels[0][ firstPos ] = params.winSymbol;
            expSubReels[0][ firstPos ] = params.winSymbol;
        }

        const line = selectPayLine( reels[0].indexOf( params.winSymbol ) );
        const sameCnt = getFloorRandom( 3 )+3;
        for( let k=0; k<sameCnt; k++ ) {
            reels[ k ][ GlobalConstants.SLOTPAYLINES[line][k] ] = params.winSymbol;
            expSubReels[ k ][ GlobalConstants.SLOTPAYLINES[line][k] ] = params.winSymbol;
        }

        if( isExpand ) {
            const col = getFloorRandom( 3 )+1;
            const idx = getFloorRandom( 3 );
            reels[ col ][ idx ] = 12;
            expSubReels[ col ][ idx ] = 12;
        }

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
    const payLineInfo = checkPayLines( isExpand ? expReelMrx : reelMrx, params.stake );
    return {
        reelMrx : reelMrx,
        payLineInfo : payLineInfo.payInfo,
        bonusProfit : payLineInfo.totalProfit
    };
}

export const generateBonusResponse = ( params: any ) => {
    let totalWin = 0;
    const directDict: { [ key:number ] : string } = {
        0 : "LEFT_TO_RIGHT",
        1 : "RIGHT_TO_LEFT"
    };
    const spins : any[] = [];
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

    if( gameInfo.psRemaining<maxPs ) {
        const balanceResp = generateBalanceResponse( params.balance, params.currency );
        const wrapperResp = {
            wrapper: {
                postWager: params.actionFlag===2 ? false : true,
                gameInstanceId: params.gameInstanceId
            }
        }
        if( params.actionFlag !== 2 ) {
            const activeBalance = {
                activeBalance: "CASH"
            }
            Object.assign( wrapperResp.wrapper, activeBalance );
        }
        Object.assign( balanceResp, wrapperResp );
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
        game: {
            userId: 26787348,
            gameInstanceId: 94674817,
            currencyCode: params.currency,
            state: "COMPLETE",
            action: "SPIN", // NONE
            stake: gameInfo.stake,
            totalStake: gameInfo.totalStake,
            spinsRemaining: gameInfo.spinsRemaining,
            freeSpinsRemaining: 0,
            freePurchaseSpinsRemaining: gameInfo.fpsSpinsRemaining,
            purchaseSpinsRemaining: gameInfo.psRemaining,
            freeSpinsAwarded: 0,
            freePurchaseSpinsAwarded: 1, // gameInfo.isFreeSpin ? 1 : 0,
            spin: {
                type: "FREE_PURCHASE",
                symbols: [],
                jokerIndexes: [],
                jokerCells: [],
                superJokerIndexes: [],
                superJokerCells: [],
                respinIndexes: [],
                matches: [],
                symbolWins: [],
                totalSymbolWin: 0,
                purpleGemIndexes: [],
                freeSpinIndexes: []
            },
            symbolWins: gameInfo.symbolWins,
            patternWin: {
                amount: params.bonusReelInfo.bonusProfit,
                matchedPatterns: gameInfo.matchPatterns.length
            },
            spinPrice: params.spinPrice,
            matchedPatterns: gameInfo.matchPatterns.length,
            totalPatternWin: params.actionFlag===0 ? 0 : params.bonusReelInfo.bonusProfit,
            totalSymbolWin: gameInfo.totalSymbolWin,
            totalWin: params.actionFlag===0 ? gameInfo.totalSymbolWin : Math.round(gameInfo.totalSymbolWin*100+params.bonusReelInfo.bonusProfit*100)/100
        },
        wrapper: {
            postWager: false,
            winProcessorRsp: null,
            gameInstanceId: 94674817
        },
        response: 0
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
    return response;
}
/**
 * test Cheat Functions
 */
const checkOtherLines = ( matchedPos:number[], slingoWinCnt:number ) => {
    let matchedCnt = 0;
    for( const key in GlobalConstants.SLINGOWINLINES ) {
        const line = GlobalConstants.SLINGOWINLINES[key];
        line.forEach(pos=> {
            if( matchedPos.includes(pos) ) matchedCnt++;
        })
        if( matchedCnt===5 ) matchedCnt++;
    }
    if( matchedCnt===slingoWinCnt ) return true;
    else return false;
}

export const simulateGameByAction = ( params:any ) => {
    const cellInfo = getCells();
    const cells = cellInfo.cells;
    const cheatSymbols : number[][] = [];
    const keys = [ 0,1,2,3,4,5,6,7,8,9,10,11 ];
    
    let slingoWinCnt = 0;
    let matchedPos : number[] = [];
    let matchedCells : number[] = [];
    let remainCells = cellInfo.remainCells;

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
    let matchWinLines = makeRandArr( keys ).slice( 0, slingoWinCnt );
    // let matchWinLines = [ 6, 9, 10, 3, 0 ];
    matchWinLines.forEach(( matchLine ) => {
        GlobalConstants.SLINGOWINLINES[ matchLine ].forEach( pos => {
            if( !matchedPos.includes( pos ) ) {
                matchedPos.push( pos );
                matchedCells.push( cells[pos] );
            }
        })
    })
    
    if( slingoWinCnt>=5 ) {
        const noLine = checkOtherLines( matchedPos, slingoWinCnt )
        if( !noLine ) {

        }
    }

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
        config: {
            rtp: params.rtp,
            stake: {
                amounts: [ 0.1, 0.2, 0.5, 1, 2, 5, 10, 25, 50, 100 ],
                index: 2
            },
            rows: 5,
            columns: 5,
            standardSpins: 10,
            purchaseSpins: maxPs,
            freePurchaseSpins: 5,
            patterns: [{
                    index: 0,
                    columns: 5,
                    rows: 5,
                    sequence: "1111100000000000000000000"
                }, {
                    index: 1,
                    columns: 5,
                    rows: 5,
                    sequence: "0000011111000000000000000"
                }, {
                    index: 2,
                    columns: 5,
                    rows: 5,
                    sequence: "0000000000111110000000000"
                }, {
                    index: 3,
                    columns: 5,
                    rows: 5,
                    sequence: "0000000000000001111100000"
                }, {
                    index: 4,
                    columns: 5,
                    rows: 5,
                    sequence: "0000000000000000000011111"
                }, {
                    index: 5,
                    columns: 5,
                    rows: 5,
                    sequence: "1000010000100001000010000"
                }, {
                    index: 6,
                    columns: 5,
                    rows: 5,
                    sequence: "0100001000010000100001000"
                }, {
                    index: 7,
                    columns: 5,
                    rows: 5,
                    sequence: "0010000100001000010000100"
                }, {
                    index: 8,
                    columns: 5,
                    rows: 5,
                    sequence: "0001000010000100001000010"
                }, {
                    index: 9,
                    columns: 5,
                    rows: 5,
                    sequence: "0000100001000010000100001"
                }, {
                    index: 10,
                    columns: 5,
                    rows: 5,
                    sequence: "1000001000001000001000001"
                }, {
                    index: 11,
                    columns: 5,
                    rows: 5,
                    sequence: "0000100010001000100010000"
                }
            ],
            symbolPayouts: [{
                id: GlobalConstants.SYMBOLDICT[100],
                payouts: [{
                        symbols: 3,
                        multiplier: 0.5
                    }, {
                        symbols: 4,
                        multiplier: 1
                    }, {
                        symbols: 5,
                        multiplier: 2.5
                    }
                ]
            }],
            patternPayouts: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            instructions: {
                reelSymbols: [ "3","18", "41", "55", "71" ],
                jokerReelSymbols: [ "J", "18", "41", "55", "71" ],
                ticket: {
                    id: 0,
                    rows: 5,
                    columns: 5,
                    cells: `${params.cells}`,
                    matches: "0,0,1,1,1,0,1,1,1,0,0,1,1,1,1,0,1,1,0,0,1,1,1,1,1"
                }
            },
            winThreshold: 100,
            spinDuration: 2.5
        },
        bonusConfig: {
            rows: 3,
            columns: 5,
            reels: [{
                    symbols: [
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
                }, {
                    symbols: [
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
                }, {
                    symbols: [
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
                }, {
                    symbols: [
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
                }, {
                    symbols: [
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
            payouts: [{
                    id: GlobalConstants.SYMBOLDICT[ 3 ], // BLUE_GEM
                    payouts: [{
                            symbols: 3,
                            multiplier: 5
                        }, {
                            symbols: 4,
                            multiplier: 10
                        }, {
                            symbols: 5,
                            multiplier: 25
                        }
                    ]
                },
                {
                    id: GlobalConstants.SYMBOLDICT[ 5 ], // GREEN_GEM
                    payouts: [{
                            symbols: 3,
                            multiplier: 8
                        },
                        {
                            symbols: 4,
                            multiplier: 20
                        },
                        {
                            symbols: 5,
                            multiplier: 50
                        }
                    ]
                },
                {
                    id: GlobalConstants.SYMBOLDICT[ 6 ], //YELLOW_GEM
                    payouts: [{
                            symbols: 3,
                            multiplier: 10
                        },
                        {
                            symbols: 4,
                            multiplier: 25
                        },
                        {
                            symbols: 5,
                            multiplier: 60
                        }
                    ]
                },
                {
                    id: GlobalConstants.SYMBOLDICT[ 8 ], // BAR
                    payouts: [{
                            symbols: 3,
                            multiplier: 50
                        },
                        {
                            symbols: 4,
                            multiplier: 200
                        },
                        {
                            symbols: 5,
                            multiplier: 250
                        }
                    ]
                },
                {
                    id: GlobalConstants.SYMBOLDICT[ 4 ], // ORANGE_GEM
                    payouts: [{
                            symbols: 3,
                            multiplier: 7
                        },
                        {
                            symbols: 4,
                            multiplier: 15
                        },
                        {
                            symbols: 5,
                            multiplier: 40
                        }
                    ]
                },
                {
                    id: GlobalConstants.SYMBOLDICT[ 7 ], // SEVEN
                    payouts: [{
                            symbols: 3,
                            multiplier: 25
                        },
                        {
                            symbols: 4,
                            multiplier: 60
                        },
                        {
                            symbols: 5,
                            multiplier: 120
                        }
                    ]
                }
            ],
            payLines: [{
                    id: 0,
                    indexes: [
                        1,
                        1,
                        1,
                        1,
                        1
                    ]
                },
                {
                    id: 1,
                    indexes: [
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    id: 2,
                    indexes: [
                        2,
                        2,
                        2,
                        2,
                        2
                    ]
                },
                {
                    id: 3,
                    indexes: [
                        0,
                        1,
                        2,
                        1,
                        0
                    ]
                },
                {
                    id: 4,
                    indexes: [
                        2,
                        1,
                        0,
                        1,
                        2
                    ]
                },
                {
                    id: 5,
                    indexes: [
                        0,
                        0,
                        1,
                        0,
                        0
                    ]
                },
                {
                    id: 6,
                    indexes: [
                        2,
                        2,
                        1,
                        2,
                        2
                    ]
                },
                {
                    id: 7,
                    indexes: [
                        1,
                        2,
                        2,
                        2,
                        1
                    ]
                },
                {
                    id: 8,
                    indexes: [
                        1,
                        0,
                        0,
                        0,
                        1
                    ]
                },
                {
                    id: 9,
                    indexes: [
                        1,
                        0,
                        1,
                        0,
                        1
                    ]
                }
            ]
        },
        wrapper: {},
        balance: {
            cash: params.balance,
            bonus: 0,
            total: params.balance,
            currencyCode: params.currency
        },
        game: {
            userId: 24177383,
            ticket: {
                id: 100,
                rows: 5,
                columns: 5,
                cells: `${params.cells}`,
                matches: "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0"
            },
            state: "PURCHASE_ENTRY"
        },
        response: 0
    }
    return response;
}

/**
 * configRouter, cloudRouter
 */
export const generateOperatorAttrubute = () => {
    const response = {
        tablet: {
            dialog_enabled: "true",
            show_elapsed_time: "false",
            help_button_enabled: "true",
            reality_check_enabled: "true",
            force_stop_enabled: "true",
            reality_check_options_enabled: "true",
            orientation_enabled: "true",
            clock_enabled: "false",
            show_net_position: "false",
            you_could_win: "false",
            cma_enabled: "true",
            options_enabled: "true",
            detailed_game_history_enabled: "false",
            show_meta_bar: "false"
        },
        all: {
            controller: "GamingRealmsController",
            buy_feature_enabled: "false",
            user_autocomplete_enabled: "true",
            user_autocomplete_expiry_hours: "24",
            integration: "gamingrealms",
            parameters: "OperatorParameters",
            deploy: "games"
        },
        phone: {
            show_elapsed_time: "false",
            help_button_enabled: "true",
            reality_check_enabled: "true",
            force_stop_enabled: "true",
            reality_check_options_enabled: "true",
            orientation_enabled: "true",
            clock_enabled: "false",
            show_net_position: "false",
            you_could_win: "false",
            cma_enabled: "true",
            options_enabled: "true",
            detailed_game_history_enabled: "false",
            show_meta_bar: "false"
        }
    };
    return response;
}

export const generateGamesAttribute = () => {
    const response = {
        name: "Slingo Starburst",
        gameId: 1435,
        externalGameId: "slingo-starburst",
        clientAttributes: {
            client_path: "rogue/starburst"
        }
    };
    return response;
}

export const generaterealityCheckDetails = () => {
    const response = {
        realityCheckInterval: 0,
        totalSessionTime: 0,
        nextRealityCheck: 0,
        rsp: 0
    };
    return response;
}

export const generateUserLogin = ( params:any ) => {
    const now = getCurrentTime()
    const response = {
        userId: 24177383,
        username: "1732099498491",
        st: "ACTIVE",
        lastLoginDate: null,
        timeZone: "America/New_York",
        currentTime: now,
        access_token: params.token,
        rn: "Slingo Starburst",
        rsp: 0
    };
    return response;
}