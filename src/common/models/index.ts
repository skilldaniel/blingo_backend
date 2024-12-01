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
        chooseTime  : 0,
        isChoose    : false,
        spinsRemaining  : 10,

        totalWin : 0,
        totalSymbolWin  : 0,

        cells   : [] as number[],
        symbols : [] as number[],
        
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
                    chooseTime  : userInfo.gameStatus.chooseTime,
                    isChoose    : userInfo.gameStatus.isChoose,
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

export const updateUserBalance = async( user : string, newBalance : number ) => {
    try {
        const filter = { "property.user":user };
        const updateInfo = { 
            $set : { balance : newBalance }
         };
        Users.updateMany( filter, updateInfo );
    } catch (error) {
        console.log('updateUserBalance', error);
    }
}

