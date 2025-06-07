import { MongoClient, ObjectId } from "mongodb";

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
        this.collection = this.mongoClient.db().collection(collectionName)
    }

    getAllImages(q?: string) {
        const authorCollectionName = process.env.USERS_COLLECTION_NAME;
        if (!authorCollectionName) {
            throw new Error("Missing USERS_COLLECTION_NAME from environment variables");
        }

        const pipeline: any[] = [];

        if (q) {
            pipeline.push({
                $match: {
                    name: { $regex: q, $options: 'i' } // case-insensitive partial match
                }
            });
        }
        
        /*pipeline.push(
            {
                $lookup: {
                    from: authorCollectionName,
                    localField: 'authorId',
                    foreignField: '_id',
                    as: 'authorInfo'
                }
            },
            {
                $unwind: {
                    path: '$authorInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    src: 1,
                    name: 1,
                    author: {
                        id: { $toString: '$authorInfo._id' },
                        username: '$authorInfo.username',
                        email: "placeholder123@gmail.com"
                    }
                }
            }
        );*/

        return this.collection.aggregate(pipeline).toArray();
    }

    async updateImageName(imageId: string, newName: string): Promise<number> {
        // Do keep in mind the type of _id in the DB is ObjectId
        const res = await this.collection.updateOne({_id: new ObjectId(imageId)}, {$set: {name: newName}})
        return await res.matchedCount;
    }

    async createImage(data: IImageDocument){
        return this.collection.insertOne({src: data.src, name: data.name, authorId: data.authorId});
    }

    async verifyLogin(loginUser: string, imageId: string) {
        const image = this.collection.findOne({_id: new ObjectId(imageId)});
        const author = ((await image) as IImageDocument).authorId;
        return author === loginUser;
    }
}