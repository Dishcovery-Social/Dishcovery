import connectPgSimple from "connect-pg-simple";
import session from "express-session";
import { pool } from "./database.js";
import { env } from "./env.js";

const SEVEN_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 7;

const PgStore = connectPgSimple(session);

export const sessionMiddleware = session({
  store: new PgStore({
    pool,
    createTableIfMissing: true,
  }),
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: SEVEN_DAYS_IN_MS,
  },
});
