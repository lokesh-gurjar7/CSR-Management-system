import express from "express";
import mysql from "mysql2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Create MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "csr_db",
});

// 🧾 Register (Sign Up)
router.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 8);

  const q = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
  db.query(q, [name, email, hashedPassword, role], (err, data) => {
    if (err) return res.status(500).json({ message: "Error registering user", error: err });
    res.json({ message: "User registered successfully!" });
  });
});

// 🔐 Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const q = "SELECT * FROM users WHERE email = ?";
  db.query(q, [email], (err, data) => {
    if (err) return res.status(500).json({ error: err });
    if (data.length === 0) return res.status(404).json({ message: "User not found" });

    const user = data[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, "csr_secret_key", { expiresIn: "1d" });
    res.json({ message: "Login successful", token, user });
  });
});

export default router;
