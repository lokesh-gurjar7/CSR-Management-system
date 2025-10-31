import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect MySQL (main connection)
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "security",
  database: process.env.DB_NAME || "csr_db",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running and connected to MySQL!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
