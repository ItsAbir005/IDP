import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware for verifying token
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

// ✅ Log new vitals & update streak/points
router.post("/log-vitals", auth, async (req, res) => {
  try {
    const { heartRate, spo2, bp, temp, steps } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const now = new Date();
    const today = now.toISOString().split("T")[0]; // e.g., "2025-10-10"

    // --- Calculate streak logic ---
    let streak = user.streak || 0;
    let lastEntryDate = user.vitals?.length
      ? user.vitals[user.vitals.length - 1].timestamp?.split("T")[0]
      : null;

    if (lastEntryDate === today) {
      // Already logged today, no streak change
    } else if (
      lastEntryDate &&
      new Date(today) - new Date(lastEntryDate) === 86400000
    ) {
      // +1 day (continued streak)
      streak += 1;
    } else {
      // Break streak
      streak = 1;
    }

    // --- Points system ---
    const pointsEarned = 10; // arbitrary: +10 points per log
    const points = (user.points || 0) + pointsEarned;

    // --- Save new vitals ---
    user.vitals.push({
      heartRate,
      spo2,
      bp,
      temp,
      steps,
      timestamp: now.toISOString(),
    });

    user.streak = streak;
    user.points = points;
    await user.save();

    res.json({
      message: "Vitals logged successfully!",
      newStreak: streak,
      totalPoints: points,
    });
  } catch (err) {
    console.error("⚠️ Error logging vitals:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
