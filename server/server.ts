import "./config/passport.js";
import cors from "cors";
import express, { type Request, type Response } from "express";
import passport from "passport";
import { env } from "./config/env.js";
import { sessionMiddleware } from "./config/session.js";
import authRouter from "./routes/auth.js";
import recipesRouter from "./routes/recipes.js";

const app = express();

if (env.NODE_ENV === "production") {
  // Render reverse proxies the backend server and auth
  // will fail in prod since secure is set to true and
  // Render terminates the TLS before proxying to the server.
  // Setting this tells Express to trust the proxy that forwarded
  // the request to it for up to 1 hop.
  app.set("trust proxy", 1);
}

app.use(express.json());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);
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
