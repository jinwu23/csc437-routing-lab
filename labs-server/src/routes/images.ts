import express, { Request, Response } from "express";
import { MongoClient, ObjectId } from "mongodb";
import { ImageProvider } from "../ImageProvider";
import { handleImageFileErrors, imageMiddlewareFactory } from "../middleware/imageUploadMiddleware";

export function registerImageRoutes(app: express.Application, mongoClient: MongoClient) {
    const imageProvider = new ImageProvider(mongoClient);

    app.get("/api/images", async (req: Request, res: Response) => {
        let userId: string | undefined = undefined;
        if (typeof req.query.createdBy === "string") {
            userId = req.query.createdBy;
        }

        try {
            const images = await imageProvider.getAllImages(userId);
            res.json(images);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch images" });
        }
    
    });

    app.patch("/api/images/:id", async (req: Request, res: Response) => {
        try {
            const imageId = req.params.id;

                // Check if request body exists
            if (!req.body || Object.keys(req.body).length === 0) {
                console.log("Empty request body");
                res.status(400).send({
                    error: "Bad request",
                    message: "Request body is empty"
                });
                return;
            }

            // Check if user sent the wrong property
            if (req.body.name === undefined) {
                console.log("Property 'name' is missing, but found:", Object.keys(req.body));
                res.status(400).send({
                    error: "Bad request",
                    message: "Missing 'name' property. Please use the property name 'name'"
                });
                return;
            }

            const newName = req.body.name;
    
            console.log(`newName: ${newName} imageId: ${imageId}`)

            // Check if name property exists and is not empty
            if (newName === undefined || newName === null) {
                res.status(400).send({
                    error: "Bad request",
                    message: "Missing name property"
                });
                return;
            }
    
            // Validate name is a string and not empty
            if (typeof newName !== 'string' || newName.trim() === '') {
                res.status(400).send({
                    error: "Bad request",
                    message: "Name must be a non-empty string"
                });
                return;
            }
    
            // Optional: Limit the length of the name
            if (newName.length > 200) {
                res.status(400).send({
                    error: "Bad request",
                    message: "Name is too long (maximum 200 characters)"
                });
                return;
            }
    
            console.log(`Image ID: ${imageId}, New Name: ${newName}`);
    
            // Try to update the image
            try {
                const images_updated = await imageProvider.updateImageName(imageId, newName);
    
                // Check if any documents were updated
                if (images_updated === 0) {
                    res.status(404).send({
                        error: "Not found",
                        message: "Image does not exist"
                    });
                    return;
                }
    
                // Successful update
                res.status(204).send();
            } catch (error) {
                // Handle invalid ObjectId format
                if (error instanceof Error && error.message.includes('ObjectId')) {
                    res.status(400).send({
                        error: "Bad request",
                        message: "Invalid image ID format"
                    });
                    return;
                }
                
                // Handle other database errors
                console.error("Database error:", error);
                res.status(500).send({
                    error: "Internal server error",
                    message: "Failed to update image"
                });
                return;
            }
        } catch (error) {
            // Catch any other unexpected errors
            console.error("Unexpected error:", error);
            res.status(500).send({
                error: "Internal server error",
                message: "An unexpected error occurred"
            });
            return;
        }
    });


    app.post(
        "/api/images",
        imageMiddlewareFactory.single("image"),
        handleImageFileErrors,
        async (req: Request, res: Response) => {
            // Check if file and name are present 
            if (!req.file || !req.body.name) {
                res.status(400).send({
                    error: "Internal server error",
                    message: "An unexpected error occurred"
                });
                return;
            }
            // Extract username from auth token
            const username = res.locals.token?.username;
            if (!username) {
                res.status(401).send({
                    error: "Unauthorized",
                    message: "User is not authenticated"
                });
                return;
            }
            // Create image document
            const imageDoc = {
                _id: req.file.filename,
                src: `/uploads/${req.file.filename}`,
                name: req.body.name,
                author: username,
                likes: 0,
            }

            try {
                await imageProvider.createImage(imageDoc);
                res.status(201).send(imageDoc);
            } catch (error) {
                res.status(500).send({
                    error: "Internal server error",
                    message: "Failed to create image document"
                });
            }

        }
    )


}