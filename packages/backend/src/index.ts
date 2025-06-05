import express, { Request, Response  } from "express";
import dotenv from "dotenv";
import { ValidRoutes } from "../../src/shared/ValidRoutes";
import { ImageProvider } from "./ImageProvider";
import { connectMongo } from "./connectMongo";
import { registerImageRoutes } from "./routes/imageRoutes";
import { registerAuthRoutes } from "./routes/authRoutes";
import { CredentialsProvider } from "./CredentialsProvider";

dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.
const PORT = process.env.PORT || 3000;
const STATIC_DIR = process.env.STATIC_DIR || "public";

const app = express();
app.use(express.static(STATIC_DIR));
app.use(express.json());

app.locals.JWT_SECRET = process.env.JWT_SECRET;


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

const mongoConnection = connectMongo();
registerImageRoutes(app, new ImageProvider(mongoConnection));
registerAuthRoutes(app, new CredentialsProvider(mongoConnection));
