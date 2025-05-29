import { IApiImageData } from "common/ApiImageData";
import { connectMongo } from "./connectMongo";
import { Collection, MongoClient, ObjectId } from "mongodb";
import { connect, disconnect, model, Schema } from "mongoose";

interface IImageDocument {
    _id: ObjectId,
    src: string,
    name: string,
    authorId: string,
}

export class ImageProvider {
    private collection;

    constructor(private readonly mongoClient: MongoClient) {
        const collectionName = process.env.IMAGES_COLLECTION_NAME;
        if (!collectionName) {
            throw new Error("Missing IMAGES_COLLECTION_NAME from environment variables");
        }
        const authorCollectionName = process.env.USERS_COLLECTION_NAME;
        if (!authorCollectionName) {
            throw new Error("Missing USERS_COLLECTION_NAME from environment variables");
        }
        this.collection = this.mongoClient.db().collection(collectionName).aggregate([
            {
                $lookup: {
                from: authorCollectionName,
                localField: 'authorId',
                foreignField: '_id',
                as: 'authorInfo'
                }
            },
            {
                $unwind: '$authorInfo'
            },
            {
                $project: {
                _id: 1,
                src: 1,
                name: 1,
                author: {
                    id: { $toString: '$authorInfo._id' },
                    username: '$authorInfo.username'
                }
                }
            }
        ])

    }

    getAllImages() {
        return this.collection.toArray(); // Without any options, will by default get all documents in the collection as an array.
    }   
}