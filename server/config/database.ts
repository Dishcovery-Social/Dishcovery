import pg from "pg";

const config = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  ssl: {
    rejectUnauthorized: false,
  },
};

export const pool = new pg.Pool(config);
