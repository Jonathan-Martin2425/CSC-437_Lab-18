import { Request, Response, NextFunction } from "express";
import multer from "multer";

class ImageFormatError extends Error {}

const storageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        // TODO 1
        const uploads = process.env.IMAGE_UPLOAD_DIR;
        if(uploads) cb(null, uploads);
    },
    filename: function (req, file, cb) {
        // TODO 2

        if(file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg"){
            const fileName = Date.now() + "-" + Math.round(Math.random() * 1E9) + "." + file.mimetype.slice(6);
            cb(null, fileName);
        }else{
            cb(new ImageFormatError("Unsupported image type"), "")
        }
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