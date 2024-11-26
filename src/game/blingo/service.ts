import * as Models from "@/common/models";
import * as Functions from "@/game/blingo/functions";
import * as Constants from "@/game/blingo/constants";

const jokerSymbols = [ "D", "J", "RJ", "PG" ];
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
        let twMoney = 0;
        let response = {};
        let purpleGemIndexes : number[] = [];
        
        if( symbols.length>0 ) {
            let isJoker = false;
            let pgCnt = 0;
            symbols.forEach(( symbol:string, idx:number) => {
                if( symbol === "RJ" || symbol === "J" ) {
                    isJoker = true;
                    userInfo.gameStatus.jokerIndexes.push( idx );
                    purpleGemIndexes = [ 1 ];
                    actionFlag = 1;
                    userInfo.gameStatus.chooseTime++;
                    userInfo.gameStatus.cells.forEach((cell:number, ind:number) => {
                        if( ind%5 === idx && !userInfo.gameStatus.gameMatches.includes(ind) ) {
                            userInfo.gameStatus.jokerCells.push( cell );
                        }
                    });
                }
                if( symbol == "PG" ) {
                    pgCnt++;
                    purpleGemIndexes.push( idx );
                }
            })
            if( isJoker ) userInfo.gameStatus.isChoose = true;
            if( pgCnt>=3 ) twMoney = Math.round( twMoney*100 + Constants.GAMEINFO.payTable["pgCnt"][5-pgCnt]*0.5*100 )
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
                await Models.updateUserBalance( userInfo.property.user, userInfo.balance );
                break;
            case "spin" :
                sid++;
                if( sid === 2 ) {
                    userInfo.gameStatus.respinIndexes = []
                }
                userInfo.gameStatus.spinsRemaining--;
                userInfo.gameStatus.spinMatches = Functions.getIdxMatchedSymbol( userInfo.gameStatus.cells, symbols );
                userInfo.gameStatus.gameMatches.push( ...userInfo.gameStatus.spinMatches );
                userInfo.gameStatus.symbols = symbols;
                const spinParams = {
                    symbols     : userInfo.gameStatus.symbols,
                    cells       : userInfo.gameStatus.cells,
                    stake       : userInfo.gameStatus.stake,
                    currency    : userInfo.property.currency,
                    spinMatches : userInfo.gameStatus.spinMatches,
                    gameMatches : userInfo.gameStatus.gameMatches,
                    jokerCells  : userInfo.gameStatus.jokerCells,
                    jokerIndexes    : userInfo.gameStatus.jokerIndexes,
                    respinIndexes   : userInfo.gameStatus.respinIndexes,
                    actionFlag  : actionFlag,
                    userId      : actionParams.body.userId,
                    gameInstanceId : actionParams.body.gameInstanceId,
                    purpleGemIndexes : purpleGemIndexes,
                };
                response = Functions.generateSpinResponse( spinParams );
                break;
            case "chooseCell" :
                const chosenCellIdx : number = userInfo.gameStatus.cells.indexOf(actionParams.body.cellNumber);
                userInfo.gameStatus.chooseTime--;
                console.log("chooseTime", userInfo.gameStatus.chooseTime, chosenCellIdx%5 );
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
                if( !userInfo.gameStatus.gameMatches.includes( chosenCellIdx ) ) {
                    userInfo.gameStatus.gameMatches.push( chosenCellIdx );
                    userInfo.gameStatus.spinMatches.push( chosenCellIdx );
                    const chooseParams = {
                        symbols     : userInfo.gameStatus.symbols,
                        stake       : userInfo.gameStatus.stake,
                        currency    : userInfo.property.currency,
                        cells       : userInfo.gameStatus.cells,
                        spinMatches : userInfo.gameStatus.spinMatches,
                        gameMatches : userInfo.gameStatus.gameMatches,
                        jokerCells  : userInfo.gameStatus.jokerCells,
                        spinsRemaining  : userInfo.gameStatus.spinsRemaining,
                        respinIndexes   : userInfo.gameStatus.respinIndexes,
                        jokerIndexes    : userInfo.gameStatus.jokerIndexes,
                        actionFlag  : actionFlag,
                        userId      : actionParams.body.userId,
                        gameInstanceId  : actionParams.body.gameInstanceId,
                        purpleGemIndexes : purpleGemIndexes,
                    };
                    response = Functions.generateChooseCellResponse( chooseParams );
                }
                break;
            case "collect" :
                response = Functions.generateCollectResponse();
                break;
        }
        if( action !== "currentGame" ) console.log("response", JSON.stringify( response ) );
        await Models.updateUserInfo( token, userInfo )
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
                ip : launcher.ip,
                game : gameCode,
                lang : launcher.lang,
                user : launcher.user,
                currency : launcher.currency,
                mode : launcher.mode==="real" ? 1 : 0,
                bonus : 0,
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
