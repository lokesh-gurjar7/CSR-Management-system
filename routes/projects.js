import express from "express";
import mysql from "mysql2";

const router = express.Router();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "security",
  database: process.env.DB_NAME || "csr_db",
});

// Add project (organization)
router.post("/", (req, res) => {
  const { org_id, name, description } = req.body;
  if (!org_id || !name) return res.status(400).json({ message: "Missing fields" });
  const q = "INSERT INTO projects (org_id, name, description) VALUES (?, ?, ?)";
  db.query(q, [org_id, name, description], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Project added", id: result.insertId });
  });
});

// Get all projects (with organization name)
router.get("/", (req, res) => {
  const q = `SELECT p.id, p.name, p.description, u.name AS organization, p.org_id
             FROM projects p
             LEFT JOIN users u ON p.org_id = u.id
             ORDER BY p.id DESC`;
  db.query(q, (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

// Volunteer joins a project
router.post("/participate", (req, res) => {
  const { volunteer_id, project_id } = req.body;
  if (!volunteer_id || !project_id) return res.status(400).json({ message: "Missing fields" });
  const q = "INSERT INTO participation (volunteer_id, project_id) VALUES (?, ?)";
  db.query(q, [volunteer_id, project_id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Joined project", id: result.insertId });
  });
});

export default router;
