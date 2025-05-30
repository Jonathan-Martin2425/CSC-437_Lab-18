import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { ValidRoutes } from "../../src/shared/ValidRoutes";
import { ImageProvider } from "./ImageProvider";
import { connectMongo } from "./connectMongo";
import { registerImageRoutes } from "./routes/imageRoutes";

dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.
const PORT = process.env.PORT || 3000;
const STATIC_DIR = process.env.STATIC_DIR || "public";

const app = express();
app.use(express.static(STATIC_DIR));

app.get(Object.values(ValidRoutes), (req: Request, res: Response) => {
    const options = {
        root: STATIC_DIR
    }
    res.sendFile("index.html", options);
});

app.get("/api/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

registerImageRoutes(app, new ImageProvider(connectMongo()));
