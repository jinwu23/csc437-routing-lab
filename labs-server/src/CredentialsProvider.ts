import { Collection, MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

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
        // Check if the username already exists
        const existingUser = await this.collection.findOne({ username });
        if (existingUser) {
            return false; // User already exists
        }

        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plaintextPassword, salt);

        // Store the new user credentials
        await this.collection.insertOne({ username, password: hashedPassword });

        return true; // Successfully registered
    }

    async verifyPassword(username: string, plaintextPassword: string) {
        const user = await this.collection.findOne({ username });
        if (!user) {
            return false; // User not found
        }

        return await bcrypt.compare(plaintextPassword, user.password);
    }
}
