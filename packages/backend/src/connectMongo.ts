import { MongoClient } from "mongodb";

export function connectMongo() {
    const { MONGO_DB_USER, MONGO_DB_PASS, MONGO_CLUSTER, DB_NAME } = process.env;

    const connectionStringRedacted = `mongodb+srv://${MONGO_DB_USER}:<password>@${MONGO_CLUSTER}/${DB_NAME}`;
    const connectionString = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASS}@${MONGO_CLUSTER}/${DB_NAME}`;
    console.log("Attempting Mongo connection at " + connectionStringRedacted);

    return new MongoClient(connectionString);
}