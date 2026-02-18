const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();

// Default hardcoded accounts (no database needed)
const DEFAULT_ACCOUNTS = [
  {
    id: 1,
    name: "Admin",
    email: "admin@healthinsure.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: 2,
    name: "John Doe",
    email: "user@healthinsure.com",
    password: "user123",
    role: "user",
  },
];

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Try database first, fall back to default accounts
    try {
      const [existing] = await pool.query(
        "SELECT id FROM users WHERE email = ?",
        [email],
      );
      if (existing.length > 0) {
        return res.status(409).json({ message: "Email already registered." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const [result] = await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, "user"],
      );

      const token = jwt.sign(
        { id: result.insertId, name, email, role: "user" },
        process.env.JWT_SECRET || "default_jwt_secret",
        { expiresIn: "7d" },
      );

      return res.status(201).json({
        message: "Registration successful.",
        token,
        user: { id: result.insertId, name, email, role: "user" },
      });
    } catch (dbErr) {
      console.warn(
        "DB unavailable for register, using default accounts fallback",
      );
      // Check default accounts
      if (DEFAULT_ACCOUNTS.find((a) => a.email === email)) {
        return res.status(409).json({ message: "Email already registered." });
      }
      const newUser = {
        id: DEFAULT_ACCOUNTS.length + 1,
        name,
        email,
        role: "user",
      };
      DEFAULT_ACCOUNTS.push({ ...newUser, password });

      const token = jwt.sign(
        { id: newUser.id, name, email, role: "user" },
        process.env.JWT_SECRET || "default_jwt_secret",
        { expiresIn: "7d" },
      );

      return res.status(201).json({
        message: "Registration successful.",
        token,
        user: newUser,
      });
    }
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Try database first
    try {
      const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      if (users.length > 0) {
        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return res
            .status(401)
            .json({ message: "Invalid email or password." });
        }

        const token = jwt.sign(
          { id: user.id, name: user.name, email: user.email, role: user.role },
          process.env.JWT_SECRET || "default_jwt_secret",
          { expiresIn: "7d" },
        );

        return res.json({
          message: "Login successful.",
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      }
    } catch (dbErr) {
      console.warn("DB unavailable, falling back to default accounts");
    }

    // Fallback: check default hardcoded accounts
    const defaultUser = DEFAULT_ACCOUNTS.find(
      (a) => a.email === email && a.password === password,
    );
    if (!defaultUser) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      {
        id: defaultUser.id,
        name: defaultUser.name,
        email: defaultUser.email,
        role: defaultUser.role,
      },
      process.env.JWT_SECRET || "default_jwt_secret",
      { expiresIn: "7d" },
    );

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: defaultUser.id,
        name: defaultUser.name,
        email: defaultUser.email,
        role: defaultUser.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
