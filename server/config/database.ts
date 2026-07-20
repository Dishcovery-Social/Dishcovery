import pg from "pg";

const { Pool } = pg;

const connectionString = "";

export const pool = new Pool({
	ssl: {
		rejectUnauthorized: false,
	},
});

export default pool;
