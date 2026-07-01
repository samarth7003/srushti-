import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db/db.js";

// Helper to generate JWT token (valid for 7 days)
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET || "srushti_secret_jwt_key_2026",
    { expiresIn: "7d" }
  );
};

// Register customer account
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Please enter your name, email, and password." });
  }

  try {
    const emailLower = email.trim().toLowerCase();

    // Check if email already registered
    const { rows: existing } = await db.query("SELECT * FROM users WHERE email = $1", [emailLower]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    // Reserve admin email check
    if (emailLower === "admin@srushti.com") {
      return res.status(400).json({ error: "This email is reserved for administrators." });
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Insert user and return credentials (role defaults to 'customer')
    const { rows } = await db.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'customer') RETURNING id, name, email, role",
      [name.trim(), emailLower, hash]
    );

    const user = rows[0];
    const token = generateToken(user);

    res.status(201).json({ user, token });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to register user. Please try again." });
  }
};

// Authenticate user & return token
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please enter both email and password." });
  }

  try {
    const emailLower = email.trim().toLowerCase();

    // Fetch user from database
    const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [emailLower]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user = rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate token
    const token = generateToken(user);
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to log in. Please try again." });
  }
};

// Get current authenticated user profile
export const getMe = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT id, name, email, role, created_at FROM users WHERE id = $1", [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User profile not found." });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to retrieve user profile." });
  }
};
