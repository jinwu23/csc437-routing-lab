import { MongoClient, ObjectId } from "mongodb";

interface Image {
    _id: ObjectId | string;
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
        if (!collectionName) {
            throw new Error("Missing IMAGES_COLLECTION_NAME from environment variables");
        }

        const collection = this.mongoClient.db().collection<Image>(collectionName);

        // Create the query
        const query: any = {};
        if (authorId) {
            query.author = new ObjectId(authorId); // Filter by author ID if provided
        }

        return collection.find(query).toArray();
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

    async createImage(image: Image): Promise<void> {
        const collectionName = process.env.IMAGES_COLLECTION_NAME;
        if (!collectionName) {
            throw new Error("Missing IMAGES_COLLECTION_NAME from environment variables");
        }

        const collection = this.mongoClient.db().collection<Image>(collectionName);

        // Ensure the author field is an ObjectId
        if (typeof image.author === "object" && "_id" in image.author) {
            image.author = (image.author as Author)._id; // Extract the _id from the Author object
        }

        // Insert the image document into the collection
        await collection.insertOne(image);
    }
}