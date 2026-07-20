import "dotenv/config";
import express, { type Request, type Response } from "express";
import recipesRouter from "./routes/recipes.js";

const app = express();
const PORT = parseInt(process.env.PORT as string) || 3000;

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
	res.send("Server is running.");
});

app.use("/recipes", recipesRouter);

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
