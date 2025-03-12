import express, { NextFunction, Request, Response } from "express";
import { MongoClient } from "mongodb";
import { CredentialsProvider } from "../CredentialsProvider";
import jwt from "jsonwebtoken";

export function verifyAuthToken(
    req: Request,
    res: Response,
    next: NextFunction 
) {
    const signatureKey = process.env.JWT_SECRET
    if (!signatureKey) {
        throw new Error("Missing JWT_SECRET from env file");
    }
    
    const authHeader = req.get("Authorization");
    // The header should say "Bearer <token string>".  Discard the Bearer part.
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).end();
    } else { // signatureKey already declared as a module-level variable
        jwt.verify(token, signatureKey, (error, decoded) => {
            if (decoded) {
                res.locals.token = decoded;
                next();
            } else {
                res.status(403).end();
            }
        });
    }
}

function generateAuthToken(username: string): Promise<string> {
    const signatureKey = process.env.JWT_SECRET
    if (!signatureKey) {
        throw new Error("Missing JWT_SECRET from env file");
    }

    return new Promise<string>((resolve, reject) => {
        jwt.sign(
            { username: username },
            signatureKey,
            { expiresIn: "1d" },
            (error, token) => {
                if (error) reject(error);
                else resolve(token as string);
            }
        );
    });
}

export function registerAuthRoutes(app: express.Application, mongoClient: MongoClient) {
    const credentialsProvider = new CredentialsProvider(mongoClient);

    app.post("/auth/register", async (req: Request, res: Response) => {        
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).send({
                error: "Bad Request",
                message: "Missing username or password"
            });
            return;
        }
        const success = await credentialsProvider.registerUser(username, password);
        if (!success) {
            res.status(400).send({
                error: "Username already taken",
                message: "Please choose a different username"
            });
            return;
        } else {
            try {
                const createdToken = await generateAuthToken(username);
                res.status(200).send({ token: createdToken });
                return;
            } catch (error) {
                res.status(500).send({
                    error: "Internal server error",
                    message: "Failed to generate authentication token"
                });
                return;
            }
        }
    });

    app.post("/auth/login", async (req: Request, res: Response) => {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).send({
                error: "Bad Request",
                message: "Missing username of password"
            });
            return;
        }
        const success = await credentialsProvider.verifyPassword(username, password);
        if (success) {
            try {
                const createdToken = await generateAuthToken(username);
                res.status(200).send({ token: createdToken });
                return;
            } catch (error) {
                res.status(500).send({
                    error: "Internal server error",
                    message: "Failed to generate authentication token"
                })
                return;
            }
        } else {
            res.status(401).send({
                error: "Unauthorized",
                message: "Incorrect username or password"
            });
            return;
        }
    });

}