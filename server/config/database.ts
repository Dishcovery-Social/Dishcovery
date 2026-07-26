import pg from "pg";

const config = {
  ssl: {
    rejectUnauthorized: false,
  },
};

export const pool = new pg.Pool(config);
