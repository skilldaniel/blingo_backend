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
    newUser["gameStatus"] = {
        isFreeSpin : false,
        fsRound : 0,
        fsCount : -1,
        fsMaxCnt : 0,
        fsWinMoney : 0,
        betAmount : 0,
        spinNtp : 0
    };
    
    await Users.insertOne( newUser );
}