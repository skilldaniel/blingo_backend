import * as Models from "@/common/models";
import * as Functions from "@/game/blingo/functions";
import * as Constants from "@/game/blingo/constants";

export const blingoService = {
    handleAction : async ( actionParams:any ) => {
        let response = {};

        switch (actionParams.action) {
            case 1: // startGame
                response = Functions.generateStartGameResponse();
                break;
            case 2: // spin
                response = Functions.generateSpinResponse();
                break;
            case 3: // chooseCell
                response = Functions.generateChooseCellResponse();
                break;
            case 4: // collect
                response = Functions.generateCollectResponse();
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
                lobby : launcher.lobby,
                cashier : launcher.cashier,
                currency : launcher.currency,
                jurisdiction : launcher.jurisdiction,
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
    }
}