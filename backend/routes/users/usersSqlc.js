import pool from "../../config/database.js";

/**
 * Fetch a user by email from the database
 * @param {string} email 
 * @returns {Promise<object|null>}
 */
export const getUserByEmailDb = async (email) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return rows[0] || null;
};

/**
 * Fetch a user by id from the database
 * @param {number} id 
 * @returns {Promise<object|null>}
 */
export const getUserByIdDb = async (id) => {
  const { rows } = await pool.query("SELECT id, name, email, role, created_at FROM users WHERE id = $1", [id]);
  return rows[0] || null;
};

/**
 * Create a new user in the database
 * @param {string} name 
 * @param {string} email 
 * @param {string} passwordHash 
 * @returns {Promise<object>}
 */
export const createUserDb = async (name, email, passwordHash) => {
  const { rows } = await pool.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'customer') RETURNING id, name, email, role",
    [name, email, passwordHash]
  );
  return rows[0];
};
