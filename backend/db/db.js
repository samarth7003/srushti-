import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// Use environment variables for connection parameters
const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "srushti_jewellery",
  password: process.env.PGPASSWORD || "postgres",
  port: parseInt(process.env.PGPORT || "5432"),
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export const query = (text, params) => pool.query(text, params);
export default pool;
