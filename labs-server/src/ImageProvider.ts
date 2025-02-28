import { MongoClient, ObjectId } from "mongodb";

interface Image {
    _id: ObjectId;
    src: string;
    name: string;
    author: ObjectId | Author;
    likes: number;
}

interface Author {
    _id: ObjectId;
    username: string;
    email: string;
}

export class ImageProvider {
    constructor(private readonly mongoClient: MongoClient) {}

    async getAllImages(): Promise<Image[]> {
        const collectionName = process.env.IMAGES_COLLECTION_NAME;
        const authorsCollectionName = process.env.USERS_COLLECTION_NAME;
        if (!collectionName || !authorsCollectionName) {
            throw new Error("Missing IMAGES_COLLECTION_NAME from environment variables");
        }

        const collection = this.mongoClient.db().collection<Image>(collectionName);

        return collection
            .aggregate<Image>([
                {
                    $lookup: {
                        from: authorsCollectionName,
                        localField: "author",
                        foreignField: "_id",
                        as: "authorDetails",
                    },
                },
                {
                    $unwind: "$authorDetails", // Convert authorDetails array to a single object
                },
                {
                    $project: {
                        _id: 1,
                        src: 1,
                        name: 1,
                        author: "$authorDetails", // Replace author ID with full author object
                        likes: 1,
                    },
                },
            ])
            .toArray();
    }
}