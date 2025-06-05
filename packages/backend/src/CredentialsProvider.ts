import { Collection, MongoClient } from "mongodb";
import bcrypt from "bcrypt";

interface ICredentialsDocument {
    username: string;
    password: string;
}

export class CredentialsProvider {
    private readonly collection: Collection<ICredentialsDocument>;

    constructor(mongoClient: MongoClient) {
        const COLLECTION_NAME = process.env.CREDS_COLLECTION_NAME;
        if (!COLLECTION_NAME) {
            throw new Error("Missing CREDS_COLLECTION_NAME from env file");
        }
        this.collection = mongoClient.db().collection<ICredentialsDocument>(COLLECTION_NAME);
    }

    async registerUser(username: string, plaintextPassword: string) {

        // checking if user already exists
        const userCollectionName = process.env.CREDS_COLLECTION_NAME
        if (!userCollectionName) {
            throw new Error("Missing USERS_COLLECTION_NAME from environment variables");
        }

        const pipeline: any[] = [];

        if (username) {
            pipeline.push({
                $match: {
                    username: { $regex: username }
                }
            });
        }
        const users = this.collection.aggregate(pipeline).toArray();
        if((await users).length > 0){
            return false;
        }

        // finish creating userCred object to insert
        const salt  = bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(plaintextPassword, await salt);

        const userCred: ICredentialsDocument = {
            username: username,
            password: await hashedPassword,
        }

        await this.collection.insertOne(userCred);

        // Wait for any DB operations to finish before returning!
        return true;
    }

    async verifyPassword(username: string, plaintextPassword: string) {
        // TODO

        const user = this.collection.findOne({username: username});
        if((await user)!){
            const dbPassword = (await user)!.password;
            return bcrypt.compare(plaintextPassword, dbPassword);
        }else{
            console.log("invalid user");
            return false
        }
    }
}
