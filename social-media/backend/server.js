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


// 1. GET ALL POSTS (with user details)
app.get("/api/posts", async (req, res) => {
  try {
    // We join the 'users' table so we can show the name of the person who posted
    const q = `
      SELECT p.*, u.username, u.profilePic 
      FROM posts p 
      JOIN users u ON p.userId = u.id 
      ORDER BY p.createdAt DESC
    `;
    const [data] = await db.query(q);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// 2. CREATE A NEW POST
app.post("/api/posts", async (req, res) => {
  try {
    const { content, userId } = req.body; // We get this from the frontend
    
    const q = "INSERT INTO posts (content, userId) VALUES (?, ?)";
    await db.query(q, [content, userId]);
    
    res.status(200).json("Post has been created.");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// 3. GET SINGLE USER (For Profile Header)
app.get("/api/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const q = "SELECT id, username, email, profilePic, created_at FROM users WHERE id = ?";
    
    const [rows] = await db.query(q, [userId]);
    if (rows.length === 0) return res.status(404).json("User not found");
    
    // Return the first user found (without password!)
    const { password, ...info } = rows[0];
    res.json(info);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 4. GET POSTS FOR A SPECIFIC USER
app.get("/api/posts/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    // Join with users table to get username
    const q = `
      SELECT p.*, u.username, u.profilePic 
      FROM posts p 
      JOIN users u ON p.userId = u.id 
      WHERE p.userId = ? 
      ORDER BY p.createdAt DESC
    `;
    
    const [data] = await db.query(q, [userId]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 5. GET LIKES FOR A POST
app.get("/api/likes", async (req, res) => {
  try {
    const q = "SELECT * FROM likes WHERE postId = ?";
    const [data] = await db.query(q, [req.query.postId]);
    // Return list of userIds who liked this post
    res.status(200).json(data.map(like => like.userId));
  } catch (err) {
    res.status(500).json(err);
  }
});

// 6. TOGGLE LIKE (Add or Remove)
app.post("/api/likes", async (req, res) => {
  try {
    const { userId, postId } = req.body;

    // Check if already liked
    const [existing] = await db.query("SELECT * FROM likes WHERE userId = ? AND postId = ?", [userId, postId]);

    if (existing.length > 0) {
      // If exists, delete it (Unlike)
      await db.query("DELETE FROM likes WHERE userId = ? AND postId = ?", [userId, postId]);
      res.status(200).json("Post has been disliked.");
    } else {
      // If not exists, add it (Like)
      await db.query("INSERT INTO likes (userId, postId) VALUES (?, ?)", [userId, postId]);
      res.status(200).json("Post has been liked.");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// 7. FOLLOW A USER
app.post("/api/relationships", async (req, res) => {
  try {
    const { followerUserId, followedUserId } = req.body;
    
    // Prevent following yourself
    if (followerUserId === followedUserId) return res.status(400).json("Cannot follow yourself");

    const q = "INSERT INTO relationships (followerUserId, followedUserId) VALUES (?, ?)";
    await db.query(q, [followerUserId, followedUserId]);
    res.status(200).json("Following");
  } catch (err) {
    res.status(500).json(err);
  }
});

// 8. UNFOLLOW A USER
app.delete("/api/relationships", async (req, res) => {
  try {
    const { followerUserId, followedUserId } = req.query; // NOTE: using query params for delete
    
    const q = "DELETE FROM relationships WHERE followerUserId = ? AND followedUserId = ?";
    await db.query(q, [followerUserId, followedUserId]);
    res.status(200).json("Unfollowed");
  } catch (err) {
    res.status(500).json(err);
  }
});

// 9. GET SUGGESTED USERS (Users you don't follow yet)
app.get("/api/users/suggestions/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    // Find users who are NOT me AND NOT in my following list
    const q = `
      SELECT * FROM users 
      WHERE id != ? 
      AND id NOT IN (SELECT followedUserId FROM relationships WHERE followerUserId = ?)
      LIMIT 5
    `;
    const [data] = await db.query(q, [userId, userId]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});


app.listen(8800, () => {
  console.log("Backend server running on port 8800!");
});