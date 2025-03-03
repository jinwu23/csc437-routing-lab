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
    constructor(private readonly mongoClient: MongoClient) { }

    async getAllImages(authorId?: string): Promise<Image[]> {
        const collectionName = process.env.IMAGES_COLLECTION_NAME;
        const authorsCollectionName = process.env.USERS_COLLECTION_NAME;
        if (!collectionName || !authorsCollectionName) {
            throw new Error("Missing IMAGES_COLLECTION_NAME from environment variables");
        }

        const collection = this.mongoClient.db().collection<Image>(collectionName);
        
        // Create the pipeline
        const pipeline: any[] = [];
        
        // Add author filter stage if authorId is provided
        if (authorId) {
            pipeline.push({
                $match: {
                    author: authorId // Filter by author ID
                }
            });
        }
        
        // Add the rest of the aggregation stages
        pipeline.push(
            {
                $lookup: {
                    from: authorsCollectionName,
                    localField: "author",
                    foreignField: "_id",
                    as: "authorDetails",
                }
            },
            {
                $unwind: "$authorDetails" // Convert authorDetails array to a single object
            },
            {
                $project: {
                    _id: 1,
                    src: 1,
                    name: 1,
                    author: "$authorDetails", // Replace author ID with full author object
                    likes: 1,
                }
            }
        );
        
        return collection.aggregate<Image>(pipeline).toArray();
    }

    async updateImageName(imageId: string, newName: string): Promise<number> {
        const collectionName = process.env.IMAGES_COLLECTION_NAME;
        if (!collectionName) {
            throw new Error("Missing IMAGES_COLLECTION_NAME from environment variables");
        }

        const collection = this.mongoClient.db().collection<Image>(collectionName);
        
        // Create query to validate imageId as ObjectId or not
        let query: any;
        if (ObjectId.isValid(imageId)) {
            query = { _id: new ObjectId(imageId) }; // Convert to ObjectId if valid
        } else {
            query = { _id: imageId }; // Keep as string if it's not an ObjectId
        }

        // Use updateOne to modify the image name
        const result = await collection.updateOne(
            query, // Filter by image ID
            { $set: { name: newName } } // Set the new name
        );

        // Return the number of documents that matched the filter criteria
        return result.matchedCount;
    }
}