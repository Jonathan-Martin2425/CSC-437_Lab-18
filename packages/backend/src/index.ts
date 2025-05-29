import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { ValidRoutes } from "../../src/shared/ValidRoutes";
import { ImageProvider } from "./ImageProvider";
import { connectMongo } from "./connectMongo";

dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.
const PORT = process.env.PORT || 3000;
const STATIC_DIR = process.env.STATIC_DIR || "public";

const app = express();
app.use(express.static(STATIC_DIR));

function waitDuration(numMs: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, numMs));
}

app.get(Object.values(ValidRoutes), (req: Request, res: Response) => {
    const options = {
        root: STATIC_DIR
    }
    res.sendFile("index.html", options);
});

app.get("/api/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.get("/api/images", (req: Request, res: Response) => {
    waitDuration(1000).then(() => {
        const images = new ImageProvider(connectMongo()).getAllImages();
        images.then((images) => res.send(images));
    })
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
