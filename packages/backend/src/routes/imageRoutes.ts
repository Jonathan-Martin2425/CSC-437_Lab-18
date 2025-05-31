import { Application, Request, Response } from "express";
import { ImageProvider } from "./../ImageProvider";
import { match, ok } from "assert";
import { ObjectId } from "mongodb";

const MAX_NAME_LENGTH = 100;

export function registerImageRoutes(app: Application, imageProvider: ImageProvider) {
    function waitDuration(numMs: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, numMs));
    }
    
    app.get("/api/images", (req: Request, res: Response) => {
        const q = req.query.q;
        waitDuration(1000).then(() => {
            let images;
            if (q) {
                images = imageProvider.getAllImages(q as string);
            }else{
                images = imageProvider.getAllImages();
            }
            images.then((images) => {
                res.send(images);
            });
        }).catch(console.error);
    })

    app.put("/api/images/:id", (req: Request, res: Response) => {
        const id = req.params.id;
        const name = req.query.name;
        
        if(!ObjectId.isValid(id)){
            console.log("invalid id");
            res.status(404).send({
                error: "Not Found",
                message: "Image does not exist"
            });
            return;
        }
        if(name){
            if((name as string).length >= MAX_NAME_LENGTH){
                res.status(422).send({
                    error: "Unprocessable Entity",
                    message: `Image name exceeds ${MAX_NAME_LENGTH} characters`
                });
            }else{
                imageProvider.updateImageName(id, name as string).then((matchedCount) => {
                    if(matchedCount === 0){
                        console.log("update failed")
                        res.status(404).send({
                            error: "Not Found",
                            message: "Image does not exist"
                        });
                    }else{
                        res.sendStatus(204);
                    }
                })   
            }
        }else{
            res.status(400).send({
                error: "Bad Request",
                message: "Name does not exist"
            });
        }
    })
}