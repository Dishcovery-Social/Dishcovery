import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
	ssl: {
		rejectUnauthorized: false,
	},
});

export default pool;
