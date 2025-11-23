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

// 6. TOGGLE LIKE (UPDATED WITH NOTIFICATION)
app.post("/api/likes", async (req, res) => {
  try {
    const { userId, postId } = req.body;

    const [existing] = await db.query("SELECT * FROM likes WHERE userId = ? AND postId = ?", [userId, postId]);

    if (existing.length > 0) {
      // Unlike
      await db.query("DELETE FROM likes WHERE userId = ? AND postId = ?", [userId, postId]);
      // Optional: Delete the notification if they unlike? For now, let's keep it simple.
      res.status(200).json("Post has been disliked.");
    } else {
      // Like
      await db.query("INSERT INTO likes (userId, postId) VALUES (?, ?)", [userId, postId]);

      // --- NEW: Create Notification ---
      // 1. First, find out who owns the post (so we know who to notify)
      const [postData] = await db.query("SELECT userId FROM posts WHERE id = ?", [postId]);
      const postOwnerId = postData[0].userId;

      // 2. Only notify if you are not liking your own post
      if (postOwnerId !== userId) {
         const notifQ = "INSERT INTO notifications (receiverUserId, senderUserId, type, postId) VALUES (?, ?, 'like', ?)";
         await db.query(notifQ, [postOwnerId, userId, postId]);
      }
      // -------------------------------

      res.status(200).json("Post has been liked.");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// 7. FOLLOW A USER (UPDATED WITH NOTIFICATION)
app.post("/api/relationships", async (req, res) => {
  try {
    const { followerUserId, followedUserId } = req.body;
    if (followerUserId === followedUserId) return res.status(400).json("Cannot follow yourself");

    const q = "INSERT INTO relationships (followerUserId, followedUserId) VALUES (?, ?)";
    await db.query(q, [followerUserId, followedUserId]);

    // --- NEW: Create Notification ---
    const notifQ = "INSERT INTO notifications (receiverUserId, senderUserId, type) VALUES (?, ?, 'follow')";
    await db.query(notifQ, [followedUserId, followerUserId]);
    // -------------------------------

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

// 10. GET FOLLOWER/FOLLOWING COUNTS
app.get("/api/relationships/count/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Query 1: Who follows THIS user? (Followers)
    const qFollowers = "SELECT count(*) as count FROM relationships WHERE followedUserId = ?";
    const [followersData] = await db.query(qFollowers, [userId]);

    // Query 2: Who does THIS user follow? (Following)
    const qFollowing = "SELECT count(*) as count FROM relationships WHERE followerUserId = ?";
    const [followingData] = await db.query(qFollowing, [userId]);

    res.status(200).json({
      followers: followersData[0].count,
      following: followingData[0].count
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// 11. GET EXPLORE POSTS (Random posts from everyone)
app.get("/api/posts/explore", async (req, res) => {
  try {
    // We join users to get names/pics
    // ORDER BY RAND() mixes them up every time you refresh
    // LIMIT 20 prevents loading too much data at once
    const q = `
      SELECT p.*, u.username, u.profilePic 
      FROM posts p 
      JOIN users u ON p.userId = u.id 
      ORDER BY RAND() 
      LIMIT 20
    `;
    
    const [data] = await db.query(q);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 12. GET NOTIFICATIONS
app.get("/api/notifications", async (req, res) => {
  try {
    const userId = req.query.userId;
    
    // Get notifications AND the sender's info (username/pic)
    const q = `
      SELECT n.*, u.username, u.profilePic 
      FROM notifications n
      JOIN users u ON n.senderUserId = u.id
      WHERE n.receiverUserId = ?
      ORDER BY n.createdAt DESC
    `;
    
    const [data] = await db.query(q, [userId]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});


app.listen(8800, () => {
  console.log("Backend server running on port 8800!");
});