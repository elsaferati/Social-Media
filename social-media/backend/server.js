import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "./db.js"; // <--- Note the .js extension, it is required now!

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = "supersecretkey123";

// REGISTER ROUTE
app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length > 0) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", 
      [username, email, hashedPassword]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN ROUTE
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) return res.status(400).json({ message: "Invalid credentials" });

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

    const { password: _, ...userData } = user;
    res.json({ token, user: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(8800, () => {
  console.log("Backend server running on port 8800!");
});