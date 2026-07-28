import "./config/passport.js";
import cors from "cors";
import express, { type Request, type Response } from "express";
import passport from "passport";
import { env } from "./config/env.js";
import { sessionMiddleware } from "./config/session.js";
import authRouter from "./routes/auth.js";
import recipesRouter from "./routes/recipes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (_req: Request, res: Response) => {
  res.send("Server is running.");
});

app.use("/auth", authRouter);
app.use("/recipes", recipesRouter);

app.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});
