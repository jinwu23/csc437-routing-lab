import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.
const PORT = process.env.PORT || 3000;
const staticDir = process.env.STATIC_DIR || "public";

const app = express();
app.use(express.static(staticDir));

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.get("*", (req: Request, res: Response, next) => {
    res.sendFile(path.resolve(staticDir, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
