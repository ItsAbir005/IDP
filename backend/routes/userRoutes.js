// ✅ Get user progress (streak, points, vitals count)
import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// 🧠 Return streak, points, and total vitals
router.get("/progress", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      streak: user.streak || 0,
      points: user.points || 0,
      totalVitals: user.vitals?.length || 0,
    });
  } catch (err) {
    console.error("⚠️ Progress fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
