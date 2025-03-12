import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

class ImageFormatError extends Error {}

const uploadDir = process.env.IMAGE_UPLOAD_DIR || "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Determing file extension
        let fileExtension = "";
        if (file.mimetype === "image/png") fileExtension = "png";
        else if (file.mimetype === "image/jpeg") fileExtension = "jpg";
        else return cb(new ImageFormatError("Unsupported image type"), "");

        // Generate a unique filename
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${fileExtension}`;

        cb(null, fileName);
    }
});

export const imageMiddlewareFactory = multer({
    storage: storageEngine,
    limits: {
        files: 1,
        fileSize: 5 * 1024 * 1024 // 5 MB
    },
});

export function handleImageFileErrors(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof multer.MulterError || err instanceof ImageFormatError) {
        res.status(400).send({
            error: "Bad Request",
            message: err.message
        });
        return;
    }
    next(err); // Some other error, let the next middleware handle it
}