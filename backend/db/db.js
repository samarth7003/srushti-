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

// Auto-initialize tables and admin user if they don't exist
const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const adminEmail = "admin@srushti.com";
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [adminEmail]);
    if (rows.length === 0) {
      const bcrypt = await import("bcryptjs");
      const salt = await bcrypt.default.genSalt(10);
      const hash = await bcrypt.default.hash("admin", salt);
      
      await pool.query(
        "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'admin')",
        ["Srushti Admin", adminEmail, hash]
      );
      console.log("Database Auto-Init: Created default administrator user.");
    }
  } catch (error) {
    console.error("Database Auto-Init Failed:", error.message);
  }
};

initDatabase();

export const query = (text, params) => pool.query(text, params);
export default pool;
