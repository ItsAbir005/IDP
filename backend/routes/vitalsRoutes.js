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

    console.log("📝 Logging vitals for:", user.email);

    // ✅ Update streak using model method
    const newStreak = user.updateStreak();
    
    console.log("🔥 Streak updated:", newStreak);

    // ✅ Points system
    const pointsEarned = 10;
    const totalPoints = (user.points || 0) + pointsEarned;
    user.points = totalPoints;

    // ✅ Save new vitals
    user.vitals.push({
      heartRate,
      spo2,
      bp,
      temp,
      steps,
      timestamp: now,
    });

    await user.save();

    console.log("✅ Vitals saved! Streak:", newStreak, "| Points:", totalPoints);

    res.json({
      message: "Vitals logged successfully!",
      newStreak: newStreak,
      totalPoints: totalPoints,
      vitalsCount: user.vitals.length,
      loggedToday: true,
    });
  } catch (err) {
    console.error("⚠️ Error logging vitals:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// ✅ Get all vitals for user
router.get("/my-vitals", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      vitals: user.vitals,
      streak: user.streak,
      points: user.points,
    });
  } catch (err) {
    console.error("⚠️ Error fetching vitals:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;