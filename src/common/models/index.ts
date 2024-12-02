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
    newUser["gameStatus"] = {
        stake   : 0.5,
        totalStake  : 0.5,
        // state   : 0,
        isFreeSpin  : false,
        fsCount : -1,
        fpSpinsAwarded  : 0,
        fpSpinsRemaining : 40,
        fspSpinsRemaining   : 5,

        isChoose    : false,
        chooseTime  : 0,
        spinsRemaining  : 10,

        totalWin : 0,
        totalSymbolWin  : 0,

        cells   : [] as number[],
        symbols : [] as number[],
        
        symbolwin   : [] as any[],
        spinMatches : [] as number[],
        gameMatches : [] as number[],
        matchPatterns   : [] as number[],

        jokerCells  : [] as number[],
        jokerIndexes    : [] as number[],
        respinIndexes   : [] as number[],
    };
    
    await Users.insertOne( newUser );
}

export const updateUserInfo = async( token:string, userInfo:any ) => {
    await Users.updateOne(
        { token: token },
        {
            $set : {
                // "property.lastId" : userInfo.property.lastId,
                gameStatus: {
                    stake : userInfo.gameStatus.stake,
                    totalStake  : userInfo.gameStatus.totalStake,

                    isFreeSpin  : userInfo.gameStatus.isFreeSpin,
                    fsCount     : userInfo.gameStatus.fsCount,
                    fpSpinsAwarded  : userInfo.gameStatus.fpSpinsAwarded,
                    fpSpinsRemaining : userInfo.gameStatus.fpSpinsRemaining,
                    fspSpinsRemaining   : userInfo.gameStatus.fspSpinsRemaining,

                    isChoose    : userInfo.gameStatus.isChoose,
                    chooseTime  : userInfo.gameStatus.chooseTime,
                    spinsRemaining  : userInfo.gameStatus.spinsRemaining,

                    totalWin : userInfo.gameStatus.totalWin,
                    totalSymbolWin  : userInfo.gameStatus.totalSymbolWin,

                    cells : userInfo.gameStatus.cells,
                    symbols     : userInfo.gameStatus.symbols,
                    
                    spinMatches : userInfo.gameStatus.spinMatches,
                    gameMatches : userInfo.gameStatus.gameMatches,
                    matchPatterns   : userInfo.gameStatus.matchPatterns,

                    jokerCells  : userInfo.gameStatus.jokerCells,
                    jokerIndexes    : userInfo.gameStatus.jokerIndexes,
                    respinIndexes   : userInfo.gameStatus.respinIndexes,
                }
            }
        }
    )
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