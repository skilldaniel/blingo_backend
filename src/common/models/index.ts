import { MongoClient } from 'mongodb';

let Users : any;

export const connect = async (dbName : string) => {
    try {
        const mongoURL = `mongodb://localhost:27017/`;
        const client = new MongoClient(mongoURL);
        await client.connect();
        console.log("Connected to ", dbName , "db");
        const db = client.db(dbName);

        Users = db.collection<SchemaUser>('Users');
        return true;
    } catch (error) {
        console.log("mongodb-initialization", error);
        return false;
    }
}

export const addUser = async( newUser:any ) => {
    await Users.deleteOne({ token : newUser.token }) ;

    newUser.gameStatus = {
        stake   : 0.5,
        fsStake : 0,
        totalStake  : 0,
        
        isPurchase  : false, // purchase spin mode with spin price
        isFreeSpin  : false,
        isExtra : false, // extra spin mode
        fsCount  : -1,
        purCount : -1,
        psRemaining : 40, // purchaseSpinsRemaining
        fsRemain : 0, // freeSpinsRemaining
        fpsSpinsRemaining : 5, // freePurchaseSpinsRemaining
        fpsSpinsCnt : 0, // freePurchaseSpinsAwarded
        fsAwarded : 0,

        isChoose    : false,
        chooseTime  : 0,
        spinsRemaining  : 10, // spinsRemaining

        totalWin : 0,
        totalSymbolWin  : 0,

        cells   : [] as number[],
        symbols : [] as number[],
        
        symbolWins  : [] as any[],
        gameMatches : [] as number[],
        matchedIdxs : [] as number[],
        spinMatches : [] as number[],
        spinIdxs : [] as number[],
        matchPatterns   : [] as number[],

        jokerCells  : [] as number[],
        jokerIndexes    : [] as number[],
        respinIndexes   : [] as number[],
        pgIndexes   : [] as number[],

    };
    newUser.cheat = {
        isCheat : false,
        cid: 0,
        cells : [] as number[],
        symbols : [] as number[][],

    }
    await Users.insertOne( newUser );
}

export const updateUserInfo = async( token:string, userInfo:any ) => {
    const result = await Users.updateOne(
        { token: token },
        {
            $set : {
                gameStatus: {
                    stake : userInfo.gameStatus.stake,
                    fsStake : userInfo.gameStatus.fsStake,
                    totalStake  : userInfo.gameStatus.totalStake,

                    isPurchase  : userInfo.gameStatus.isPurchase,
                    isFreeSpin  : userInfo.gameStatus.isFreeSpin,
                    isExtra : userInfo.gameStatus.isExtra,
                    fsCount  : userInfo.gameStatus.fsCount,
                    purCount     : userInfo.gameStatus.purCount,
                    psRemaining : userInfo.gameStatus.psRemaining,
                    fsRemain : userInfo.gameStatus.fsRemain,
                    fpsSpinsRemaining : userInfo.gameStatus.fpsSpinsRemaining,
                    fpsSpinsCnt : userInfo.gameStatus.fpsSpinsCnt,
                    fsAwarded   : userInfo.gameStatus.fsAwarded,

                    isChoose    : userInfo.gameStatus.isChoose,
                    chooseTime  : userInfo.gameStatus.chooseTime,
                    spinsRemaining  : userInfo.gameStatus.spinsRemaining,

                    totalWin : userInfo.gameStatus.totalWin,
                    totalSymbolWin  : userInfo.gameStatus.totalSymbolWin,

                    cells : userInfo.gameStatus.cells,
                    symbols     : userInfo.gameStatus.symbols,
                    
                    symbolWins : userInfo.gameStatus.symbolWins,
                    gameMatches : userInfo.gameStatus.gameMatches,
                    matchedIdxs : userInfo.gameStatus.matchedIdxs,
                    spinMatches : userInfo.gameStatus.spinMatches,
                    spinIdxs : userInfo.gameStatus.spinIdxs,
                    matchPatterns   : userInfo.gameStatus.matchPatterns,

                    jokerCells  : userInfo.gameStatus.jokerCells,
                    jokerIndexes    : userInfo.gameStatus.jokerIndexes,
                    respinIndexes   : userInfo.gameStatus.respinIndexes,
                    pgIndexes   : userInfo.gameStatus.pgIndexes,

                },
                cheat : {
                    isCheat : userInfo.cheat.isCheat,
                    cid : userInfo.cheat.cid,
                    cells : userInfo.cheat.cells,
                    symbols : userInfo.cheat.symbols
                }
            }
        }
    );
    return result;

}

export const getUserInfo = async( token:string ) => {
    try {
        return Users.findOne( { token : token }, { sort : {_id : -1}});
    } catch (error) {
        console.log('getUserInfo', error);
        return false;
    }
}

export const updateUserBalance = async( token:string, newBalance:number ) => {
    try {
        const filter = { token : token };
        const updateInfo = { 
            $set : { balance : newBalance }
         };
        Users.updateMany( filter, updateInfo );
    } catch (error) {
        console.log('updateUserBalance', error);
    }
}