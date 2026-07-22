import cors from "cors";
import express, { type Request, type Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/", (_req: Request, res: Response) => {
  res.send("Server is running.");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
